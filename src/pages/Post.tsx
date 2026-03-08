import {
  Suspense,
  lazy,
  useCallback,
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
const HEADING_SCROLL_OFFSET_PX = 80;
const ACTIVE_HEADING_THRESHOLD_PX = 140;
const HEADING_JUMP_SETTLE_TOLERANCE_PX = 12;
const HEADING_JUMP_RELEASE_DELAY_MS = 140;
const CARD_TOP_CLAMP_MARGIN_PX = 12;
const CARD_TOP_CLAMP_DISTANCE_PX = HEADING_SCROLL_OFFSET_PX + 40;

type PostHeading = {
  id: string;
  text: string;
  level: number;
};
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
  const [postHeadings, setPostHeadings] = useState<PostHeading[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const [postEntry, setPostEntry] = useState<PostEntry | null>(null);
  const [isPostEntryReady, setIsPostEntryReady] = useState(false);
  const pendingHeadingJumpIdRef = useRef<string | null>(null);
  const pendingHeadingTargetScrollTopRef = useRef<number | null>(null);
  const pendingHeadingJumpReleaseTimeoutIdRef = useRef<number | null>(null);

  const clearPendingHeadingJump = useCallback(() => {
    pendingHeadingJumpIdRef.current = null;
    pendingHeadingTargetScrollTopRef.current = null;

    if (pendingHeadingJumpReleaseTimeoutIdRef.current !== null) {
      window.clearTimeout(pendingHeadingJumpReleaseTimeoutIdRef.current);
      pendingHeadingJumpReleaseTimeoutIdRef.current = null;
    }
  }, []);

  const getHeadingTargetScrollTop = useCallback((headingId: string) => {
    if (typeof window === "undefined") return null;
    const headingEl = document.getElementById(headingId);
    if (!(headingEl instanceof HTMLElement)) return null;
    const readingCardEl = document.querySelector("[data-post-reading-card]");
    const headingDocumentTop =
      window.scrollY + headingEl.getBoundingClientRect().top;
    let nextScrollTop = headingDocumentTop - HEADING_SCROLL_OFFSET_PX;

    if (readingCardEl instanceof HTMLElement) {
      const cardDocumentTop =
        window.scrollY + readingCardEl.getBoundingClientRect().top;
      const headingDistanceFromCardTop = headingDocumentTop - cardDocumentTop;

      if (headingDistanceFromCardTop <= CARD_TOP_CLAMP_DISTANCE_PX) {
        nextScrollTop = Math.min(
          nextScrollTop,
          Math.max(cardDocumentTop - CARD_TOP_CLAMP_MARGIN_PX, 0),
        );
      }
    }

    return Math.max(nextScrollTop, 0);
  }, []);

  const alignHeadingToViewport = useCallback(
    (headingId: string, behavior: ScrollBehavior) => {
      if (typeof window === "undefined") return false;
      const nextScrollTop = getHeadingTargetScrollTop(headingId);
      if (nextScrollTop === null) return false;

      window.scrollTo({
        top: nextScrollTop,
        behavior,
      });
      return true;
    },
    [getHeadingTargetScrollTop],
  );

  const getImageHashToken = useCallback((imageSrc: string) => {
    if (typeof window === "undefined") return null;

    try {
      const imageUrl = new URL(imageSrc, window.location.href);
      const fileName = imageUrl.pathname.split("/").pop() ?? "";
      const decodedFileName = decodeURIComponent(fileName).trim();
      return decodedFileName || null;
    } catch {
      const fallbackName = imageSrc.split("?")[0]?.split("/").pop() ?? "";
      const decodedFallbackName = decodeURIComponent(fallbackName).trim();
      return decodedFallbackName || null;
    }
  }, []);

  const getCurrentHashImageIndex = useCallback(() => {
    if (typeof window === "undefined") return null;

    const rawHash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    if (!rawHash || !rawHash.includes(".")) return null;

    const hashToken = decodeURIComponent(rawHash);
    return postImages.findIndex(
      (image) => getImageHashToken(image.src) === hashToken,
    );
  }, [getImageHashToken, postImages]);

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
      clearPendingHeadingJump();
      setPostImages([]);
      setPostHeadings([]);
      setActiveHeadingId(null);
      setLightboxIndex(0);
      setLightboxOpened(false);
      return;
    }

    const contentEl = postContentRef.current;
    if (!contentEl) {
      clearPendingHeadingJump();
      setPostImages([]);
      setPostHeadings([]);
      setActiveHeadingId(null);
      return;
    }

    const imageElements = Array.from(contentEl.querySelectorAll("img"));
    const images: RichImage[] = imageElements.map((img) => ({
      src: img.currentSrc || img.src,
      alt: img.alt || "",
      width: img.naturalWidth || img.width || img.clientWidth || 1,
      height: img.naturalHeight || img.height || img.clientHeight || 1,
    }));

    imageElements.forEach((img, index) => {
      img.dataset.lightboxIndex = String(index);
    });

    const headingElements = Array.from(
      contentEl.querySelectorAll("h2, h3, h4"),
    ) as HTMLHeadingElement[];
    const headingSlugCount = new Map<string, number>();
    const headings: PostHeading[] = headingElements
      .map((headingEl) => {
        const text = headingEl.textContent?.trim() ?? "";
        if (!text) return null;

        const level = Number(headingEl.tagName.slice(1));
        if (!Number.isFinite(level)) return null;

        if (!headingEl.id) {
          const baseSlug = text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
          const normalizedBase = baseSlug || "section";
          const occurrence = headingSlugCount.get(normalizedBase) ?? 0;
          headingSlugCount.set(normalizedBase, occurrence + 1);
          headingEl.id =
            occurrence > 0
              ? `${normalizedBase}-${occurrence + 1}`
              : normalizedBase;
        }

        return {
          id: headingEl.id,
          text,
          level,
        };
      })
      .filter((heading): heading is PostHeading => heading !== null);

    setPostImages(images);
    setPostHeadings(headings);
    setActiveHeadingId(null);
    setLightboxIndex(0);
    setLightboxOpened(false);
  }, [clearPendingHeadingJump, slug, postEntry]);

  useEffect(() => {
    if (typeof window === "undefined" || postHeadings.length === 0) {
      clearPendingHeadingJump();
      setActiveHeadingId(null);
      return;
    }

    const updateActiveHeading = () => {
      const pendingHeadingId = pendingHeadingJumpIdRef.current;
      if (pendingHeadingId) {
        const pendingHeadingEl = document.getElementById(pendingHeadingId);
        if (pendingHeadingEl instanceof HTMLElement) {
          const pendingTargetScrollTop =
            getHeadingTargetScrollTop(pendingHeadingId) ??
            pendingHeadingTargetScrollTopRef.current;
          const isSettled =
            pendingTargetScrollTop !== null &&
            Math.abs(window.scrollY - pendingTargetScrollTop) <=
              HEADING_JUMP_SETTLE_TOLERANCE_PX;

          if (pendingTargetScrollTop !== null) {
            pendingHeadingTargetScrollTopRef.current = pendingTargetScrollTop;
          }

          setActiveHeadingId((previous) =>
            previous === pendingHeadingId ? previous : pendingHeadingId,
          );

          if (!isSettled) {
            if (pendingHeadingJumpReleaseTimeoutIdRef.current !== null) {
              window.clearTimeout(pendingHeadingJumpReleaseTimeoutIdRef.current);
            }
            pendingHeadingJumpReleaseTimeoutIdRef.current = window.setTimeout(
              () => {
                pendingHeadingJumpReleaseTimeoutIdRef.current = null;
                pendingHeadingJumpIdRef.current = null;
                pendingHeadingTargetScrollTopRef.current = null;
                updateActiveHeading();
              },
              HEADING_JUMP_RELEASE_DELAY_MS,
            );
            return;
          }
        }

        clearPendingHeadingJump();
      }

      let nextHeadingId: string | null = postHeadings[0]?.id ?? null;

      for (const heading of postHeadings) {
        const headingEl = document.getElementById(heading.id);
        if (!headingEl) continue;
        if (headingEl.getBoundingClientRect().top <= ACTIVE_HEADING_THRESHOLD_PX) {
          nextHeadingId = heading.id;
        } else {
          break;
        }
      }

      setActiveHeadingId((previous) =>
        previous === nextHeadingId ? previous : nextHeadingId,
      );
    };

    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [clearPendingHeadingJump, getHeadingTargetScrollTop, postHeadings]);

  useEffect(() => {
    return () => {
      clearPendingHeadingJump();
    };
  }, [clearPendingHeadingJump]);

  useEffect(() => {
    if (typeof window === "undefined" || postImages.length === 0) return;

    const hashIndex = getCurrentHashImageIndex();
    if (hashIndex === null) return;
    if (hashIndex < 0) return;

    setLightboxIndex(hashIndex);
    setLightboxOpened(true);
  }, [getCurrentHashImageIndex, postImages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!lightboxOpened) return;
    if (lightboxIndex < 0 || lightboxIndex >= postImages.length) return;

    const activeImage = postImages[lightboxIndex];
    const hashToken = activeImage ? getImageHashToken(activeImage.src) : null;
    if (!hashToken) return;

    const nextHash = `#${encodeURIComponent(hashToken)}`;
    if (window.location.hash === nextHash) return;
    window.history.replaceState(window.history.state, "", nextHash);
  }, [getImageHashToken, lightboxIndex, lightboxOpened, postImages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (lightboxOpened) return;

    const hashIndex = getCurrentHashImageIndex();
    if (hashIndex === null) return;

    const nextUrl = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(window.history.state, "", nextUrl);
  }, [getCurrentHashImageIndex, lightboxOpened]);

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

  const onHeadingJump = (headingId: string) => {
    if (typeof window === "undefined") return;
    clearPendingHeadingJump();
    const initialTargetScrollTop = getHeadingTargetScrollTop(headingId);
    if (initialTargetScrollTop === null) {
      return;
    }

    pendingHeadingJumpIdRef.current = headingId;
    pendingHeadingTargetScrollTopRef.current = initialTargetScrollTop;
    setActiveHeadingId(headingId);

    if (
      Math.abs(window.scrollY - initialTargetScrollTop) <=
      HEADING_JUMP_SETTLE_TOLERANCE_PX
    ) {
      clearPendingHeadingJump();
      return;
    }

    window.scrollTo({
      top: initialTargetScrollTop,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const postSidebar =
    (() => {
      const activeHeadingIndex = postHeadings.findIndex(
        (heading) => heading.id === activeHeadingId,
      );
      let activeParentHeadingId: string | null = null;

      if (activeHeadingIndex >= 0) {
        for (let index = activeHeadingIndex; index >= 0; index -= 1) {
          const heading = postHeadings[index];
          if (heading?.level === 2) {
            activeParentHeadingId = heading.id;
            break;
          }
        }
      }

      return postSummary.showInlineToc && postHeadings.length > 0 ? (
        <nav aria-label="Post sections" className="post-toc">
          <ul className="post-toc-list">
            {postHeadings.map((heading) => {
              const isActive = activeHeadingId === heading.id;
              const isActiveParent =
                !isActive && activeParentHeadingId === heading.id;

              return (
                <li key={heading.id}>
                  <button
                    type="button"
                    onClick={() => onHeadingJump(heading.id)}
                    className={`post-toc-link${
                      heading.level === 2 ? " is-top-level" : ""
                    }${isActive ? " is-active" : ""}${
                      isActiveParent ? " is-parent-active" : ""
                    }`}
                    style={{
                      paddingLeft: `${(heading.level - 2) * 0.72}rem`,
                    }}
                  >
                    <span className="post-toc-label">{heading.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : undefined;
    })();

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
        sidebar={postSidebar}
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
          />
        </Suspense>
      ) : null}
    </>
  );
}
