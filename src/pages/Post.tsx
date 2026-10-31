import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import { useLocation, useParams } from "react-router-dom";
import BlogPost from "../components/BlogPost";
import ImageLightbox from "../components/ImageLightbox";
import PostBackLink from "../components/PostBackLink";
import PostExpandToggle from "../components/PostExpandToggle";
import {
  getLoadedPostBySlug,
  getPostBySlug,
  loadPostBySlug,
  readPostBySlug,
} from "../posts";
import { preloadImage } from "../utils/imagePreload";
import { formatPostDate } from "../utils/formatPostDate";
import type { PostEntry, RichImage } from "../utils/types";

const POST_SCROLL_POSITION_PREFIX = "post-scroll-position:";
const HEADING_SCROLL_OFFSET_PX = 80;
const ACTIVE_HEADING_THRESHOLD_PX = 140;
const HEADING_JUMP_SETTLE_TOLERANCE_PX = 12;
const HEADING_JUMP_RELEASE_DELAY_MS = 140;
const CARD_TOP_CLAMP_MARGIN_PX = 12;
const CARD_TOP_CLAMP_DISTANCE_PX = HEADING_SCROLL_OFFSET_PX + 40;
const HEADING_JUMP_WATCH_INTERVAL_MS = 150;
const HEADING_JUMP_WATCH_TIMEOUT_MS = 8000;
const HEADING_JUMP_SETTLED_TICKS = 4;
const POST_EXPAND_ANIMATION_MS = 150;
const CONTENTS_BOTTOM_MARGIN_PX = 16;
const CONTENTS_MIN_LIST_WIDTH_PX = 190;
const HEADING_JUMP_SCROLL_MS = 180;

function scrollLinearlyTo(top: number): () => void {
  const startTop = window.scrollY;
  const startedAt = performance.now();
  let frameId = window.requestAnimationFrame(function step(now: number): void {
    const progress = Math.min((now - startedAt) / HEADING_JUMP_SCROLL_MS, 1);
    window.scrollTo(0, startTop + (top - startTop) * progress);
    if (progress < 1) frameId = window.requestAnimationFrame(step);
  });
  return () => window.cancelAnimationFrame(frameId);
}

type PostHeading = {
  id: string;
  text: string;
  level: number;
};
type MeasuredPostHeading = {
  id: string;
  top: number;
};
type PostProps = {
  initialPostEntry?: PostEntry;
  initialSlug?: string;
};
const useIsomorphicLayoutEffect: typeof useEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function setPostContentLinksToNewTabs(contentEl: HTMLElement): void {
  contentEl
    .querySelectorAll<HTMLAnchorElement>("a[href]")
    .forEach((linkEl: HTMLAnchorElement): void => {
      linkEl.target = "_blank";
      linkEl.rel = "noopener noreferrer";
    });
}

function fitContentsToViewport(tocEl: HTMLElement, animate: boolean): void {
  const rowEls = Array.from(tocEl.querySelectorAll("li"));
  tocEl.classList.toggle("is-animating", animate);
  if (rowEls.length === 0 || tocEl.getClientRects().length === 0) return;

  const columnEl = document.querySelector<HTMLElement>(".post-column");
  const room = document.documentElement.classList.contains("post-expanded")
    ? (window.innerWidth - (columnEl?.offsetWidth ?? 0)) / 2 - 32
    : (tocEl.parentElement?.clientWidth ?? 0);
  const isTicks = room < CONTENTS_MIN_LIST_WIDTH_PX;
  const isOpen =
    isTicks &&
    (tocEl.matches(":hover") || tocEl.querySelector(":focus-visible") !== null);
  tocEl.classList.toggle("is-ticks", isTicks);
  tocEl.classList.toggle("is-open", isOpen);
  if (isTicks && !isOpen) {
    rowEls.forEach((rowEl) => rowEl.classList.remove("is-fit-hidden"));
    return;
  }

  const available =
    window.innerHeight -
    tocEl.getBoundingClientRect().top -
    CONTENTS_BOTTOM_MARGIN_PX;
  const heights = rowEls.map(
    (rowEl) => rowEl.querySelector(".post-toc-link")?.scrollHeight ?? 0,
  );
  const heightOf = (indexes: number[]): number =>
    indexes.reduce((sum, index) => sum + (heights[index] ?? 0), 0);
  const isTopLevel = (rowEl: HTMLLIElement): boolean =>
    rowEl.querySelector(".is-top-level") !== null;

  const activeIndex = Math.max(
    rowEls.findIndex((rowEl) => rowEl.querySelector(".is-active")),
    0,
  );
  let visible = rowEls.map((_, index) => index);

  if (heightOf(visible) > available) {
    let groupStart = activeIndex;
    while (groupStart > 0 && !isTopLevel(rowEls[groupStart])) groupStart -= 1;
    let groupEnd = activeIndex + 1;
    while (groupEnd < rowEls.length && !isTopLevel(rowEls[groupEnd])) {
      groupEnd += 1;
    }
    visible = visible.filter(
      (index) =>
        isTopLevel(rowEls[index]) || (index >= groupStart && index < groupEnd),
    );
  }

  if (heightOf(visible) > available) {
    const center = visible.indexOf(activeIndex);
    let start = center;
    let end = center;
    let grew = true;
    while (grew) {
      grew = false;
      if (
        end + 1 < visible.length &&
        heightOf(visible.slice(start, end + 2)) <= available
      ) {
        end += 1;
        grew = true;
      }
      if (
        start > 0 &&
        heightOf(visible.slice(start - 1, end + 1)) <= available
      ) {
        start -= 1;
        grew = true;
      }
    }
    visible = visible.slice(start, end + 1);
  }

  const visibleSet = new Set(visible);
  rowEls.forEach((rowEl, index) => {
    rowEl.classList.toggle("is-fit-hidden", !visibleSet.has(index));
  });
}

function didDocumentReload(): boolean {
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

function getPostScrollStorageKey(pathname: string): string {
  return `${POST_SCROLL_POSITION_PREFIX}${pathname}`;
}

function measurePostHeadings(
  headings: PostHeading[],
  headingElementById: ReadonlyMap<string, HTMLElement>,
): MeasuredPostHeading[] {
  if (typeof window === "undefined") return [];

  return headings
    .map((heading): MeasuredPostHeading | null => {
      const headingEl = headingElementById.get(heading.id);
      if (!headingEl) return null;

      return {
        id: heading.id,
        top: window.scrollY + headingEl.getBoundingClientRect().top,
      };
    })
    .filter((heading): heading is MeasuredPostHeading => heading !== null);
}

function findMeasuredHeadingIdAtScrollTop(
  headings: MeasuredPostHeading[],
  scrollTop: number,
): string | null {
  let low = 0;
  let high = headings.length - 1;
  let matchIndex = -1;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const heading = headings[middle];
    if (!heading) break;

    if (heading.top <= scrollTop) {
      matchIndex = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return matchIndex >= 0 ? (headings[matchIndex]?.id ?? null) : null;
}

export default function Post({
  initialPostEntry,
  initialSlug,
}: PostProps): JSX.Element {
  const { slug: routeSlug = "" } = useParams();
  const slug = initialSlug ?? routeSlug;
  const location = useLocation();
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  const isDocumentReload = didDocumentReload();
  const postScrollStorageKey = getPostScrollStorageKey(location.pathname);
  const postSummary = getPostBySlug(slug);
  const heroImage = postSummary?.cover;
  const postContentRef = useRef<HTMLElement>(null);
  const [lightboxOpened, setLightboxOpened] = useState(false);
  const [postImages, setPostImages] = useState<RichImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [postHeadings, setPostHeadings] = useState<PostHeading[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const headingElementByIdRef = useRef<Map<string, HTMLElement>>(new Map());
  const measuredPostHeadingsRef = useRef<MeasuredPostHeading[]>([]);
  const loadedInitialPostEntry = initialPostEntry ?? getLoadedPostBySlug(slug);
  const [postEntryState, setPostEntryState] = useState<{
    slug: string;
    entry: PostEntry;
  } | null>(() =>
    loadedInitialPostEntry
      ? {
          slug,
          entry: loadedInitialPostEntry,
        }
      : null,
  );
  const postEntry =
    postEntryState?.slug === slug
      ? postEntryState.entry
      : ((postSummary ? readPostBySlug(slug) : undefined) ?? null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentsSlot, setContentsSlot] = useState<HTMLElement | null>(null);
  const pendingHeadingJumpIdRef = useRef<string | null>(null);
  const pendingHeadingTargetScrollTopRef = useRef<number | null>(null);
  const pendingHeadingJumpReleaseTimeoutIdRef = useRef<number | null>(null);
  const stopHeadingJumpWatchRef = useRef<(() => void) | null>(null);
  const expandAnimationTimeoutIdRef = useRef(0);
  const previousFittedHeadingIdRef = useRef<string | null>(null);

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
    const readingCardEl = document.querySelector("[data-post-content]");
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
  const imageIndexByHashToken = useMemo(() => {
    const indexByHashToken = new Map<string, number>();
    if (typeof window === "undefined") return indexByHashToken;

    postImages.forEach((image, index) => {
      const hashToken = getImageHashToken(image.src);
      if (!hashToken || indexByHashToken.has(hashToken)) return;
      indexByHashToken.set(hashToken, index);
    });

    return indexByHashToken;
  }, [getImageHashToken, postImages]);
  const parentHeadingIdByHeadingId = useMemo(() => {
    const parentHeadingIdById = new Map<string, string>();
    let activeParentHeadingId: string | null = null;

    for (const heading of postHeadings) {
      if (heading.level === 2) activeParentHeadingId = heading.id;
      if (activeParentHeadingId) {
        parentHeadingIdById.set(heading.id, activeParentHeadingId);
      }
    }

    return parentHeadingIdById;
  }, [postHeadings]);

  const getCurrentHashImageIndex = useCallback(() => {
    if (typeof window === "undefined") return null;

    const rawHash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    if (!rawHash || !rawHash.includes(".")) return null;

    const hashToken = decodeURIComponent(rawHash);
    return imageIndexByHashToken.get(hashToken) ?? -1;
  }, [imageIndexByHashToken]);

  useEffect(() => {
    if (!postSummary) {
      setPostEntryState(null);
      return;
    }

    const loadedPostEntry = getLoadedPostBySlug(slug);
    if (loadedPostEntry) {
      setPostEntryState({
        slug,
        entry: loadedPostEntry,
      });
      return;
    }

    let cancelled = false;
    setPostEntryState(null);
    loadPostBySlug(slug).then((loadedPost) => {
      if (cancelled) return;
      setPostEntryState(
        loadedPost
          ? {
              slug,
              entry: loadedPost,
            }
          : null,
      );
    });

    return () => {
      cancelled = true;
    };
  }, [postSummary, slug]);

  useEffect(() => {
    if (!postEntry) {
      clearPendingHeadingJump();
      headingElementByIdRef.current = new Map();
      measuredPostHeadingsRef.current = [];
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
      headingElementByIdRef.current = new Map();
      measuredPostHeadingsRef.current = [];
      setPostImages([]);
      setPostHeadings([]);
      setActiveHeadingId(null);
      return;
    }

    setPostContentLinksToNewTabs(contentEl);

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
    const headingElementById = new Map<string, HTMLElement>();
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
        headingElementById.set(headingEl.id, headingEl);

        return {
          id: headingEl.id,
          text,
          level,
        };
      })
      .filter((heading): heading is PostHeading => heading !== null);

    headingElementByIdRef.current = headingElementById;
    measuredPostHeadingsRef.current = measurePostHeadings(
      headings,
      headingElementById,
    );
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

    let frameId = 0;
    const refreshMeasuredHeadings = (): void => {
      measuredPostHeadingsRef.current = measurePostHeadings(
        postHeadings,
        headingElementByIdRef.current,
      );
    };
    const scheduleRefreshMeasuredHeadings = (): void => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame((): void => {
        frameId = 0;
        refreshMeasuredHeadings();
        updateActiveHeading();
      });
    };
    const updateActiveHeading = (): void => {
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
              window.clearTimeout(
                pendingHeadingJumpReleaseTimeoutIdRef.current,
              );
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

      const nextHeadingId =
        findMeasuredHeadingIdAtScrollTop(
          measuredPostHeadingsRef.current,
          window.scrollY + ACTIVE_HEADING_THRESHOLD_PX,
        ) ??
        postHeadings[0]?.id ??
        null;

      setActiveHeadingId((previous) =>
        previous === nextHeadingId ? previous : nextHeadingId,
      );
    };

    refreshMeasuredHeadings();
    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", scheduleRefreshMeasuredHeadings);
    const resizeObserver = new ResizeObserver(scheduleRefreshMeasuredHeadings);
    if (postContentRef.current) {
      resizeObserver.observe(postContentRef.current);
    }

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", scheduleRefreshMeasuredHeadings);
      resizeObserver.disconnect();
    };
  }, [clearPendingHeadingJump, getHeadingTargetScrollTop, postHeadings]);

  useEffect(() => {
    return () => {
      clearPendingHeadingJump();
      stopHeadingJumpWatchRef.current?.();
    };
  }, [clearPendingHeadingJump]);

  useEffect(() => {
    setContentsSlot(document.getElementById("side-nav-contents"));
  }, []);

  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.toggle("post-expanded", isExpanded);
  }, [isExpanded]);

  useIsomorphicLayoutEffect(() => {
    const fitContents = (animate: boolean): void => {
      const tocEl = document.querySelector<HTMLElement>(".post-toc");
      if (tocEl) fitContentsToViewport(tocEl, animate);
    };
    const onResize = (): void => fitContents(false);

    fitContents(previousFittedHeadingIdRef.current !== null);
    previousFittedHeadingIdRef.current = activeHeadingId;
    window.addEventListener("resize", onResize);
    const tocEl = document.querySelector<HTMLElement>(".post-toc");
    tocEl?.addEventListener("pointerenter", onResize);
    tocEl?.addEventListener("pointerleave", onResize);
    tocEl?.addEventListener("focusin", onResize);
    tocEl?.addEventListener("focusout", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      tocEl?.removeEventListener("pointerenter", onResize);
      tocEl?.removeEventListener("pointerleave", onResize);
      tocEl?.removeEventListener("focusin", onResize);
      tocEl?.removeEventListener("focusout", onResize);
    };
  }, [activeHeadingId, contentsSlot, isExpanded, postHeadings]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove(
        "post-expanded",
        "post-expand-animating",
      );
      window.clearTimeout(expandAnimationTimeoutIdRef.current);
    };
  }, []);

  const onToggleExpanded = (): void => {
    const rootEl = document.documentElement;
    rootEl.classList.add("post-expand-animating");
    window.clearTimeout(expandAnimationTimeoutIdRef.current);
    expandAnimationTimeoutIdRef.current = window.setTimeout(() => {
      rootEl.classList.remove("post-expand-animating");
    }, POST_EXPAND_ANIMATION_MS);
    setIsExpanded((current) => !current);
  };

  useEffect(() => {
    setIsExpanded(false);
  }, [slug]);

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
    if (!heroImage) return;
    void preloadImage(heroImage);
  }, [heroImage, postSummary]);

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
        <main
          key={slug}
          className="route-page-post"
          style={{
            width: "100%",
            color: "var(--ink)",
            paddingBottom: "calc(3rem + env(safe-area-inset-bottom))",
            position: "relative",
            opacity: 1,
          }}
        >
          <PostBackLink />
          <h1 className="page-heading" style={{ marginTop: "0.75rem" }}>
            Post not found
          </h1>
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
    stopHeadingJumpWatchRef.current?.();
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

    let cancelScroll = (): void => undefined;
    const scrollToTarget = (top: number): void => {
      cancelScroll();
      if (prefersReducedMotion) {
        window.scrollTo(0, top);
        return;
      }
      cancelScroll = scrollLinearlyTo(top);
    };
    scrollToTarget(initialTargetScrollTop);

    const startedAt = Date.now();
    let lastScrollTop = window.scrollY;
    let settledTicks = 0;
    const intervalId = window.setInterval(() => {
      const targetScrollTop = getHeadingTargetScrollTop(headingId);
      if (
        targetScrollTop === null ||
        Date.now() - startedAt > HEADING_JUMP_WATCH_TIMEOUT_MS
      ) {
        stopWatching();
        return;
      }

      const maxScrollTop =
        document.documentElement.scrollHeight - window.innerHeight;
      const reachableTarget = Math.min(targetScrollTop, maxScrollTop);
      const isOnTarget =
        Math.abs(window.scrollY - reachableTarget) <=
        HEADING_JUMP_SETTLE_TOLERANCE_PX;
      const isIdle = window.scrollY === lastScrollTop;
      lastScrollTop = window.scrollY;

      if (isOnTarget) {
        settledTicks += 1;
        if (settledTicks >= HEADING_JUMP_SETTLED_TICKS) stopWatching();
        return;
      }

      settledTicks = 0;
      if (isIdle) scrollToTarget(reachableTarget);
    }, HEADING_JUMP_WATCH_INTERVAL_MS);

    const stopWatching = (): void => {
      cancelScroll();
      window.clearInterval(intervalId);
      window.removeEventListener("wheel", stopWatching);
      window.removeEventListener("touchstart", stopWatching);
      window.removeEventListener("keydown", stopWatching);
      stopHeadingJumpWatchRef.current = null;
    };
    window.addEventListener("wheel", stopWatching, { passive: true });
    window.addEventListener("touchstart", stopWatching, { passive: true });
    window.addEventListener("keydown", stopWatching);
    stopHeadingJumpWatchRef.current = stopWatching;
  };

  const activeParentHeadingId = activeHeadingId
    ? (parentHeadingIdByHeadingId.get(activeHeadingId) ?? null)
    : null;
  const postSidebar =
    postSummary.showInlineToc && postHeadings.length > 0 ? (
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

  return (
    <>
      {contentsSlot && postSidebar
        ? createPortal(postSidebar, contentsSlot)
        : null}
      <BlogPost
        key={slug}
        header={
          <PostBackLink
            trailing={
              <PostExpandToggle
                expanded={isExpanded}
                onToggle={onToggleExpanded}
              />
            }
          />
        }
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
        <ImageLightbox
          opened={lightboxOpened}
          setOpened={setLightboxOpened}
          images={postImages}
          currentIndex={lightboxIndex}
        />
      ) : null}
    </>
  );
}
