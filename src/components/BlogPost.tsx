import { useEffect, useRef, useState } from "react";
import type {
  MouseEventHandler,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  RefObject,
} from "react";

const MOBILE_BREAKPOINT_PX = 860;
const POST_ENTRY_FADE_MS = 375;
const DEFAULT_DESKTOP_WIDTH_PERCENT = 95;
const DESKTOP_WIDTH_MIN_PERCENT = 65;
const DESKTOP_WIDTH_MAX_PERCENT = 95;

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

function getIsMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= MOBILE_BREAKPOINT_PX;
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
  const [isMobile, setIsMobile] = useState(getIsMobileViewport);
  const [desktopWidthPercent, setDesktopWidthPercent] = useState(
    DEFAULT_DESKTOP_WIDTH_PERCENT,
  );
  const [isResizing, setIsResizing] = useState(false);
  const [hoveredHandle, setHoveredHandle] = useState<ResizeEdge | null>(null);
  const [focusedHandle, setFocusedHandle] = useState<ResizeEdge | null>(null);
  const resizeStateRef = useRef<ResizeState | null>(null);
  const pendingWidthRef = useRef<number | null>(null);
  const resizeFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onViewportResize = () => {
      setIsMobile(getIsMobileViewport());
    };

    onViewportResize();
    window.addEventListener("resize", onViewportResize);
    return () => window.removeEventListener("resize", onViewportResize);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";

    const clampWidthPercent = (value: number) =>
      Math.round(
        Math.min(
          DESKTOP_WIDTH_MAX_PERCENT,
          Math.max(DESKTOP_WIDTH_MIN_PERCENT, value),
        ),
      );

    const updateDesktopWidth = (next: number) => {
      setDesktopWidthPercent((previous) => {
        const clamped = clampWidthPercent(next);
        return previous === clamped ? previous : clamped;
      });
    };

    const flushPendingWidth = () => {
      const pendingWidth = pendingWidthRef.current;
      pendingWidthRef.current = null;
      if (pendingWidth === null) return;
      updateDesktopWidth(pendingWidth);
    };

    const onPointerMove = (event: PointerEvent) => {
      const state = resizeStateRef.current;
      if (!state) return;

      const xDelta = event.clientX - state.startX;
      const edgeDelta = state.edge === "right" ? xDelta : -xDelta;
      const viewportWidth = Math.max(window.innerWidth, 1);
      const deltaPercent = (edgeDelta * 200) / viewportWidth;
      pendingWidthRef.current = state.startWidth + deltaPercent;

      if (resizeFrameRef.current !== null) return;
      resizeFrameRef.current = window.requestAnimationFrame(() => {
        resizeFrameRef.current = null;
        flushPendingWidth();
      });
    };

    const onPointerUp = () => {
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
        resizeFrameRef.current = null;
      }
      flushPendingWidth();
      resizeStateRef.current = null;
      setIsResizing(false);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
        resizeFrameRef.current = null;
      }
      flushPendingWidth();
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
    };
  }, [isResizing]);

  const onResizeHandlePointerDown =
    (edge: ResizeEdge) => (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (isMobile) return;
      event.preventDefault();
      resizeStateRef.current = {
        edge,
        startX: event.clientX,
        startWidth: desktopWidthPercent,
      };
      setIsResizing(true);
    };

  const pageXPadding = isMobile ? "0.625rem" : "1.125rem";
  const heroOverlap = isMobile ? 108 : 132;
  const heroHeight = isMobile ? 300 : 470;
  const titleMargin = isMobile ? "-1.9rem 0 0.94rem" : "-2.8rem 0 1.02rem";
  const showResizeHandles =
    isResizing || hoveredHandle !== null || focusedHandle !== null;

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
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <section
          style={{
            width: isMobile ? "100%" : `${desktopWidthPercent}%`,
            marginInline: "auto",
            position: "relative",
            color: "#1f2740",
            borderRadius: isMobile ? "10px" : "12px",
            border: "1px solid rgba(210, 223, 255, 0.78)",
            background:
              "linear-gradient(168deg, rgba(247, 243, 235, 0.98) 0%, rgba(239, 234, 224, 0.95) 100%)",
            boxShadow: "0 22px 46px rgba(7, 12, 24, 0.25)",
            overflow: "visible",
            isolation: "isolate",
          }}
        >
          {!isMobile ? (
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
                onPointerDown={onResizeHandlePointerDown("left")}
                aria-label="Decrease content width"
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
              >
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
                      "repeating-linear-gradient(to bottom, rgba(45, 61, 101, 0.75) 0 2px, rgba(45, 61, 101, 0.2) 2px 4px)",
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
                onPointerDown={onResizeHandlePointerDown("right")}
                aria-label="Increase content width"
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
              >
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
                      "repeating-linear-gradient(to bottom, rgba(45, 61, 101, 0.75) 0 2px, rgba(45, 61, 101, 0.2) 2px 4px)",
                  }}
                />
              </button>
            </>
          ) : null}
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
          <article
            ref={contentRef}
            className="post-content"
            data-post-content
            style={{
              width: "100%",
              maxWidth: "none",
              marginInline: "auto",
              marginBlock: 0,
              padding: isMobile
                ? "0.58rem 0.72rem 0.72rem"
                : "clamp(0.58rem, 0.92vw, 1rem) clamp(0.9rem, 1.4vw, 1.6rem) clamp(0.68rem, 1.06vw, 1.15rem)",
              lineHeight: 1.74,
              fontSize: isMobile
                ? "0.98rem"
                : "clamp(1rem, 0.58vw + 0.91rem, 1.1rem)",
              color: "#2a344f",
              position: "relative",
              zIndex: 1,
            }}
            onClick={onContentClick}
          >
            {children}
          </article>
        </section>
      </div>
    </main>
  );
}
