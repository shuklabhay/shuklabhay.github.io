import { useCallback, useEffect, useRef, useState } from "react";
import type {
  MouseEventHandler,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  RefObject,
} from "react";
import { applyPostContentInlineStyles } from "../utils/applyPostContentInlineStyles";

const POST_READING_WIDTH_STORAGE_KEY = "blog-reading-width-v2";
const LEGACY_POST_READING_WIDTH_STORAGE_KEY = "blog-reading-width-v1";
const LEGACY_READING_WIDTH_DEFAULT = 980;
const READING_WIDTH_DEFAULT = 2200;
const READING_WIDTH_MIN = 760;
const READING_WIDTH_MAX = 2800;
const MOBILE_BREAKPOINT_PX = 860;
const POST_ENTRY_FADE_MS = 375;

type ResizeEdge = "left" | "right";

type ResizeState = {
  edge: ResizeEdge;
  startX: number;
  startWidth: number;
};

type BlogPostProps = {
  isEntryReady: boolean;
  title: string;
  byline?: string;
  heroImage: string;
  contentRef: RefObject<HTMLElement>;
  onContentClick?: MouseEventHandler<HTMLElement>;
  children: ReactNode;
};

function clampReadingWidth(width: number) {
  return Math.round(
    Math.min(READING_WIDTH_MAX, Math.max(READING_WIDTH_MIN, width)),
  );
}

function readStoredReadingWidth() {
  if (typeof window === "undefined") return READING_WIDTH_DEFAULT;

  const nextRaw = window.localStorage.getItem(POST_READING_WIDTH_STORAGE_KEY);
  const legacyRaw = window.localStorage.getItem(
    LEGACY_POST_READING_WIDTH_STORAGE_KEY,
  );
  const raw = nextRaw ?? legacyRaw;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return READING_WIDTH_DEFAULT;
  if (nextRaw === null && parsed === LEGACY_READING_WIDTH_DEFAULT) {
    return READING_WIDTH_DEFAULT;
  }
  return clampReadingWidth(parsed);
}

function getCanResize() {
  if (typeof window === "undefined") return true;
  return window.innerWidth > MOBILE_BREAKPOINT_PX;
}

export default function BlogPost({
  isEntryReady,
  title,
  byline,
  heroImage,
  contentRef,
  onContentClick,
  children,
}: BlogPostProps) {
  const [readingWidth, setReadingWidth] = useState(readStoredReadingWidth);
  const [canResize, setCanResize] = useState(getCanResize);
  const [isResizing, setIsResizing] = useState(false);
  const [hoveredHandle, setHoveredHandle] = useState<ResizeEdge | null>(null);
  const [focusedHandle, setFocusedHandle] = useState<ResizeEdge | null>(null);
  const resizeStateRef = useRef<ResizeState | null>(null);

  const updateReadingWidth = useCallback((next: number) => {
    setReadingWidth(clampReadingWidth(next));
  }, []);

  const stopResize = useCallback(() => {
    resizeStateRef.current = null;
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      POST_READING_WIDTH_STORAGE_KEY,
      String(readingWidth),
    );
  }, [readingWidth]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onViewportResize = () => {
      setCanResize(getCanResize());
    };

    onViewportResize();
    window.addEventListener("resize", onViewportResize);
    return () => window.removeEventListener("resize", onViewportResize);
  }, []);

  useEffect(() => {
    if (!canResize) stopResize();
  }, [canResize, stopResize]);

  useEffect(() => {
    if (!isResizing) return;

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";

    const onPointerMove = (event: PointerEvent) => {
      const state = resizeStateRef.current;
      if (!state) return;

      const xDelta = event.clientX - state.startX;
      const edgeDelta = state.edge === "right" ? xDelta : -xDelta;
      updateReadingWidth(state.startWidth + edgeDelta * 2);
    };

    const onPointerUp = () => {
      stopResize();
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
    };
  }, [isResizing, stopResize, updateReadingWidth]);

  useEffect(() => {
    const contentRoot = contentRef.current;
    if (!contentRoot) return;
    return applyPostContentInlineStyles(contentRoot);
  }, [contentRef, children]);

  const onResizeHandlePointerDown =
    (edge: ResizeEdge) => (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!canResize) return;
      event.preventDefault();
      resizeStateRef.current = {
        edge,
        startX: event.clientX,
        startWidth: readingWidth,
      };
      setIsResizing(true);
    };

  const isMobile = !canResize;
  const pageXPadding = isMobile ? "0.625rem" : "1.125rem";
  const heroOverlap = isMobile ? 108 : 132;
  const heroHeight = isMobile ? 300 : 470;
  const showResizeHandles =
    isResizing || hoveredHandle !== null || focusedHandle !== null;
  const titleMargin = isMobile ? "-1.9rem 0 0.94rem" : "-2.8rem 0 1.02rem";

  return (
    <main
      style={{
        width: "100%",
        color: "white",
        paddingBottom: "calc(3rem + env(safe-area-inset-bottom))",
        position: "relative",
        opacity: isEntryReady ? 1 : 0,
        pointerEvents: isEntryReady ? "auto" : "none",
        transition: `opacity ${POST_ENTRY_FADE_MS}ms ease`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: `calc(100% + (${pageXPadding} * 2))`,
          marginLeft: `calc(-1 * ${pageXPadding})`,
          marginTop: `${-heroOverlap}px`,
          marginBottom: isMobile ? "0.62rem" : "0.3rem",
          height: `${heroHeight + heroOverlap}px`,
          borderRadius: 0,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: isMobile ? "center 28px" : "center 44px",
          backgroundColor: "#5a6c99",
          overflow: "hidden",
          isolation: "isolate",
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `url(${heroImage})`,
        }}
        aria-hidden
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.84) 0%, rgba(0, 0, 0, 0.48) 40%, rgba(0, 0, 0, 0.14) 72%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(to bottom, rgba(90, 108, 153, 0) 0%, rgba(90, 108, 153, 0.03) 16%, rgba(90, 108, 153, 0.12) 34%, rgba(90, 108, 153, 0.32) 54%, rgba(90, 108, 153, 0.6) 72%, rgba(90, 108, 153, 0.84) 88%, rgba(90, 108, 153, 1) 100%), linear-gradient(to bottom, rgba(90, 108, 153, 0) 0%, rgba(90, 108, 153, 0.28) 100%)",
          }}
        />
      </div>
      <div style={{ margin: titleMargin, position: "relative", zIndex: 1 }}>
        <h1
          style={{
            margin: 0,
            lineHeight: 1.16,
            fontSize: isMobile
              ? "clamp(1.6rem, 8vw, 2.3rem)"
              : "clamp(2rem, 4.5vw, 4rem)",
          }}
        >
          {title}
        </h1>
        {byline ? (
          <p
            style={{
              margin: "0.22rem 0 0",
              opacity: 0.92,
              fontSize: "clamp(0.94rem, 1vw, 1.03rem)",
              letterSpacing: "0.01em",
              position: "relative",
              zIndex: 1,
            }}
          >
            {byline}
          </p>
        ) : null}
      </div>
      <section
        style={{
          width: canResize ? `min(100%, ${readingWidth}px)` : "100%",
          margin: "0 auto",
          position: "relative",
          color: "#1f2740",
          borderRadius: isMobile ? "10px" : "12px",
          border: "1px solid rgba(210, 223, 255, 0.78)",
          background:
            "linear-gradient(168deg, rgba(247, 243, 235, 0.98) 0%, rgba(239, 234, 224, 0.95) 100%)",
          boxShadow: "0 22px 46px rgba(7, 12, 24, 0.25)",
          overflow: "visible",
          isolation: "isolate",
          transition:
            canResize && !isResizing ? "width 150ms ease-out" : "none",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            border: "1px solid rgba(255, 255, 255, 0.44)",
            pointerEvents: "none",
          }}
        />
        {canResize ? (
          <>
            <button
              type="button"
              onMouseEnter={() => setHoveredHandle("left")}
              onMouseLeave={() =>
                setHoveredHandle((current) =>
                  current === "left" ? null : current,
                )
              }
              onFocus={() => setFocusedHandle("left")}
              onBlur={() =>
                setFocusedHandle((current) =>
                  current === "left" ? null : current,
                )
              }
              style={{
                position: "absolute",
                left: "-9px",
                top: "0.8rem",
                bottom: "0.8rem",
                width: "18px",
                border: 0,
                margin: 0,
                padding: 0,
                background: "transparent",
                cursor: "ew-resize",
                zIndex: 2,
                opacity: showResizeHandles ? 1 : 0,
                transition: "opacity 140ms ease",
                outline:
                  focusedHandle === "left" ? "2px solid #4c649f" : "none",
                outlineOffset: "2px",
              }}
              onPointerDown={onResizeHandlePointerDown("left")}
              aria-label="Shrink reading width"
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "7px",
                  width: "4px",
                  borderRadius: "999px",
                  background: "rgba(68, 87, 139, 0.45)",
                }}
              />
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "4px",
                  width: "10px",
                  height: "46px",
                  transform: "translateY(-50%)",
                  borderRadius: "999px",
                  background:
                    "repeating-linear-gradient(to bottom, rgba(32, 46, 79, 0.8) 0 2px, transparent 2px 4px)",
                }}
              />
            </button>
            <button
              type="button"
              onMouseEnter={() => setHoveredHandle("right")}
              onMouseLeave={() =>
                setHoveredHandle((current) =>
                  current === "right" ? null : current,
                )
              }
              onFocus={() => setFocusedHandle("right")}
              onBlur={() =>
                setFocusedHandle((current) =>
                  current === "right" ? null : current,
                )
              }
              style={{
                position: "absolute",
                right: "-9px",
                top: "0.8rem",
                bottom: "0.8rem",
                width: "18px",
                border: 0,
                margin: 0,
                padding: 0,
                background: "transparent",
                cursor: "ew-resize",
                zIndex: 2,
                opacity: showResizeHandles ? 1 : 0,
                transition: "opacity 140ms ease",
                outline:
                  focusedHandle === "right" ? "2px solid #4c649f" : "none",
                outlineOffset: "2px",
              }}
              onPointerDown={onResizeHandlePointerDown("right")}
              aria-label="Expand reading width"
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "7px",
                  width: "4px",
                  borderRadius: "999px",
                  background: "rgba(68, 87, 139, 0.45)",
                }}
              />
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "4px",
                  width: "10px",
                  height: "46px",
                  transform: "translateY(-50%)",
                  borderRadius: "999px",
                  background:
                    "repeating-linear-gradient(to bottom, rgba(32, 46, 79, 0.8) 0 2px, transparent 2px 4px)",
                }}
              />
            </button>
          </>
        ) : null}
        <article
          ref={contentRef}
          data-post-content
          style={{
            width: "100%",
            maxWidth: "none",
            margin: 0,
            padding: canResize
              ? "clamp(0.58rem, 0.92vw, 1rem) clamp(0.9rem, 1.4vw, 1.6rem) clamp(0.68rem, 1.06vw, 1.15rem)"
              : "0.58rem 0.72rem 0.72rem",
            lineHeight: 1.74,
            fontSize: canResize
              ? "clamp(1rem, 0.58vw + 0.91rem, 1.1rem)"
              : "0.98rem",
            color: "#2a344f",
            position: "relative",
            zIndex: 1,
          }}
          onClick={onContentClick}
        >
          {children}
        </article>
      </section>
    </main>
  );
}
