import {
  Suspense,
  lazy,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useLocation, useParams } from "react-router-dom";
import BlogPost from "../components/BlogPost";
import PostBackLink from "../components/PostBackLink";
import { getPostBySlug, loadPostBySlug } from "../posts";
import { preloadImage } from "../utils/imagePreload";
import { formatPostDate } from "../utils/formatPostDate";
import type {
  PostEntry,
  RichImage,
  RouteTransitionState,
} from "../utils/types";

const POST_SCROLL_POSITION_PREFIX = "post-scroll-position:";
const ImageLightbox = lazy(() => import("../components/ImageLightbox"));

function didDocumentReload() {
  if (typeof window === "undefined" || typeof performance === "undefined") {
    return false;
  }

  const navigationEntries = performance.getEntriesByType?.("navigation");
  const navigationEntry = navigationEntries?.[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (navigationEntry?.type) {
    return navigationEntry.type === "reload";
  }

  const legacyNavigation = (
    performance as Performance & {
      navigation?: {
        type?: number;
        TYPE_RELOAD?: number;
      };
    }
  ).navigation;
  if (!legacyNavigation) return false;
  return legacyNavigation.type === legacyNavigation.TYPE_RELOAD;
}

function getPostScrollStorageKey(pathname: string) {
  return `${POST_SCROLL_POSITION_PREFIX}${pathname}`;
}

export default function Post() {
  const { slug = "" } = useParams();
  const location = useLocation();
  const transitionState = location.state as RouteTransitionState | null;
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  const shouldAnimatePostEntry =
    transitionState?.fromBlog === true && !prefersReducedMotion;
  const isDocumentReload = didDocumentReload();
  const postScrollStorageKey = getPostScrollStorageKey(location.pathname);
  const postSummary = getPostBySlug(slug);
  const heroImage = postSummary?.cover ?? "/static/landing-1280.avif";
  const postContentRef = useRef<HTMLElement>(null);
  const [lightboxOpened, setLightboxOpened] = useState(false);
  const [postImages, setPostImages] = useState<RichImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [postEntry, setPostEntry] = useState<PostEntry | null>(null);
  const [isPostEntryReady, setIsPostEntryReady] = useState(false);

  useEffect(() => {
    if (!postSummary) {
      setPostEntry(null);
      return;
    }

    let cancelled = false;
    setPostEntry(null);
    loadPostBySlug(slug).then((loadedPost) => {
      if (cancelled) return;
      setPostEntry(loadedPost ?? null);
    });

    return () => {
      cancelled = true;
    };
  }, [postSummary, slug]);

  useEffect(() => {
    if (!postEntry) {
      setPostImages([]);
      setLightboxIndex(0);
      setLightboxOpened(false);
      return;
    }

    const contentEl = postContentRef.current;
    if (!contentEl) {
      setPostImages([]);
      return;
    }

    const imageElements = Array.from(contentEl.querySelectorAll("img"));
    const images: RichImage[] = imageElements.map((img) => ({
      src: img.currentSrc || img.src,
      alt: img.alt || "",
    }));

    imageElements.forEach((img, index) => {
      img.dataset.lightboxIndex = String(index);
    });

    setPostImages(images);
    setLightboxIndex(0);
    setLightboxOpened(false);
  }, [slug, postEntry]);

  useEffect(() => {
    if (!postSummary) return;
    void preloadImage(heroImage);
  }, [heroImage, postSummary]);

  useLayoutEffect(() => {
    if (!shouldAnimatePostEntry) {
      setIsPostEntryReady(true);
      return;
    }

    setIsPostEntryReady(false);
    let cancelled = false;
    let frame = 0;
    let timeoutId = 0;

    frame = window.requestAnimationFrame(() => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        setIsPostEntryReady(true);
      }, 40);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeoutId);
    };
  }, [shouldAnimatePostEntry, slug]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saveScrollPosition = () => {
      window.sessionStorage.setItem(
        postScrollStorageKey,
        String(window.scrollY),
      );
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "hidden") return;
      saveScrollPosition();
    };

    window.addEventListener("beforeunload", saveScrollPosition);
    window.addEventListener("pagehide", saveScrollPosition);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      saveScrollPosition();
      window.removeEventListener("beforeunload", saveScrollPosition);
      window.removeEventListener("pagehide", saveScrollPosition);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [postScrollStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !isDocumentReload) return;

    const raw = window.sessionStorage.getItem(postScrollStorageKey);
    const savedY = Number(raw);
    if (!Number.isFinite(savedY)) return;
    const targetY = Math.max(0, savedY);
    if (targetY <= 0) return;

    let didUserInteract = false;

    const onUserInteraction = () => {
      didUserInteract = true;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const isScrollKey =
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === "PageDown" ||
        event.key === "PageUp" ||
        event.key === "Home" ||
        event.key === "End" ||
        event.key === " ";
      if (!isScrollKey) return;
      didUserInteract = true;
    };

    const restoreScroll = () => {
      if (didUserInteract) return;
      window.scrollTo(0, targetY);
    };

    restoreScroll();
    let frameB = 0;
    const frameA = window.requestAnimationFrame(() => {
      restoreScroll();
      frameB = window.requestAnimationFrame(restoreScroll);
    });
    const timeoutIds = [120, 280, 520, 900].map((delayMs) =>
      window.setTimeout(restoreScroll, delayMs),
    );
    const onLoad = () => restoreScroll();
    window.addEventListener("wheel", onUserInteraction, { passive: true });
    window.addEventListener("touchstart", onUserInteraction, { passive: true });
    window.addEventListener("pointerdown", onUserInteraction, {
      passive: true,
    });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("load", onLoad);

    return () => {
      window.cancelAnimationFrame(frameA);
      window.cancelAnimationFrame(frameB);
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      window.removeEventListener("wheel", onUserInteraction);
      window.removeEventListener("touchstart", onUserInteraction);
      window.removeEventListener("pointerdown", onUserInteraction);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("load", onLoad);
    };
  }, [isDocumentReload, postScrollStorageKey]);

  if (!postSummary) {
    return (
      <>
        <PostBackLink />
        <main
          key={slug}
          style={{
            width: "100%",
            color: "white",
            paddingBottom: "calc(3rem + env(safe-area-inset-bottom))",
            position: "relative",
            opacity: 1,
          }}
        >
          <h1 style={{ marginTop: "0.75rem" }}>Post not found</h1>
        </main>
      </>
    );
  }

  const Content = postEntry?.Component;
  const wordCountBylinePart =
    typeof postSummary.wordCount === "number"
      ? `${postSummary.wordCount.toLocaleString()} ${
          postSummary.wordCount === 1 ? "word" : "words"
        }`
      : undefined;
  const bylineParts = [
    postSummary.author,
    postSummary.date ? formatPostDate(postSummary.date) : undefined,
    wordCountBylinePart,
  ].filter((part): part is string => Boolean(part));

  const onPostContentClick = (event: ReactMouseEvent<HTMLElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const imageEl = target.closest("img");
    if (!(imageEl instanceof HTMLImageElement)) return;
    if (!postContentRef.current?.contains(imageEl)) return;

    const rawIndex = imageEl.dataset.lightboxIndex;
    if (rawIndex === undefined) return;

    const index = Number(rawIndex);
    if (!Number.isFinite(index) || index < 0 || index >= postImages.length)
      return;

    event.preventDefault();
    setLightboxIndex(index);
    setLightboxOpened(true);
  };

  return (
    <>
      <PostBackLink />
      <BlogPost
        key={slug}
        isEntryReady={isPostEntryReady}
        title={postSummary.title}
        byline={bylineParts.length ? bylineParts.join(" · ") : undefined}
        buttons={postSummary.buttons}
        heroImage={heroImage}
        contentRef={postContentRef}
        onContentClick={onPostContentClick}
      >
        {Content ? <Content /> : null}
      </BlogPost>
      {lightboxOpened && postImages.length > 0 ? (
        <Suspense fallback={null}>
          <ImageLightbox
            opened={lightboxOpened}
            setOpened={setLightboxOpened}
            images={postImages}
            currentIndex={lightboxIndex}
            setCurrentIndex={setLightboxIndex}
          />
        </Suspense>
      ) : null}
    </>
  );
}
