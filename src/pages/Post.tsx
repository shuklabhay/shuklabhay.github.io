import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useLocation, useParams } from "react-router-dom";
import BlogPost from "../components/BlogPost";
import ImageLightbox from "../components/ImageLightbox";
import PostBackLink from "../components/PostBackLink";
import { getPostBySlug } from "../posts";
import { getImagePreloadStatus, preloadImage } from "../utils/imagePreload";
import type { RichImage } from "../utils/types";

const POST_SCROLL_POSITION_PREFIX = "post-scroll-position:";
type HeroLoadStatus = "loading" | "loaded" | "error";

function formatPostDate(raw: string) {
  if (!raw) return "";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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
  const isDocumentReload = didDocumentReload();
  const postScrollStorageKey = getPostScrollStorageKey(location.pathname);
  const post = getPostBySlug(slug);
  const heroImage = post?.cover ?? "/static/landing-1280.avif";
  const postContentRef = useRef<HTMLElement>(null);
  const [lightboxOpened, setLightboxOpened] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<RichImage | null>(null);
  const [postImages, setPostImages] = useState<RichImage[]>([]);
  const [isPostContentReady, setIsPostContentReady] = useState(false);
  const [heroLoadState, setHeroLoadState] = useState<{
    src: string;
    status: HeroLoadStatus;
  }>({
    src: heroImage,
    status:
      getImagePreloadStatus(heroImage) === "loaded"
        ? "loaded"
        : getImagePreloadStatus(heroImage) === "error"
          ? "error"
          : "loading",
  });

  useEffect(() => {
    if (!post) {
      setPostImages([]);
      setLightboxImage(null);
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
    setLightboxImage(null);
    setLightboxOpened(false);
  }, [slug, post]);

  useLayoutEffect(() => {
    if (!post) {
      setIsPostContentReady(true);
      return;
    }

    setIsPostContentReady(false);
    let cancelled = false;
    let frameA = 0;
    let frameB = 0;

    frameA = window.requestAnimationFrame(() => {
      frameB = window.requestAnimationFrame(() => {
        if (cancelled) return;
        setIsPostContentReady(true);
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameA);
      window.cancelAnimationFrame(frameB);
    };
  }, [slug, post]);

  useEffect(() => {
    if (!post) {
      setHeroLoadState({
        src: heroImage,
        status: "loaded",
      });
      return;
    }

    const cachedStatus = getImagePreloadStatus(heroImage);
    if (cachedStatus === "loaded" || cachedStatus === "error") {
      setHeroLoadState({
        src: heroImage,
        status: cachedStatus,
      });
      return;
    }

    setHeroLoadState({
      src: heroImage,
      status: "loading",
    });
    let cancelled = false;
    preloadImage(heroImage).then((status) => {
      if (cancelled) return;
      setHeroLoadState({
        src: heroImage,
        status,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [heroImage, post]);

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

    const restoreScroll = () => {
      window.scrollTo(0, Math.max(0, savedY));
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
    window.addEventListener("load", onLoad);

    return () => {
      window.cancelAnimationFrame(frameA);
      window.cancelAnimationFrame(frameB);
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      window.removeEventListener("load", onLoad);
    };
  }, [isDocumentReload, postScrollStorageKey]);

  if (!post) {
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

  const Content = post.Component;
  const currentHeroLoadStatus =
    heroLoadState.src === heroImage ? heroLoadState.status : "loading";
  const isPostEntryReady =
    currentHeroLoadStatus !== "loading" && isPostContentReady;

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
    setLightboxImage(postImages[index] ?? null);
    setLightboxOpened(true);
  };

  return (
    <>
      <PostBackLink />
      <BlogPost
        key={slug}
        isEntryReady={isPostEntryReady}
        title={post.title}
        byline={
          post.date ? `Abhay Shukla · ${formatPostDate(post.date)}` : undefined
        }
        heroImage={heroImage}
        contentRef={postContentRef}
        onContentClick={onPostContentClick}
      >
        <Content />
      </BlogPost>
      {postImages.length > 0 ? (
        <ImageLightbox
          opened={lightboxOpened}
          setOpened={setLightboxOpened}
          image={lightboxImage}
        />
      ) : null}
    </>
  );
}
