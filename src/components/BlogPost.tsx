import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import ArrowFromLineIcon from "./ArrowFromLineIcon";
import type { BlogPostProps } from "../utils/types";
import { isHydratingPrerenderedPage } from "../utils/prerender";

const MOBILE_BREAKPOINT_PX = 860;
const POST_ENTRY_FADE_MS = 320;
const POST_LAYOUT_TRANSITION = "220ms ease";
const DESKTOP_READING_WIDTH = "76%";
const DESKTOP_SIDEBAR_WIDTH = "clamp(11.5rem, 16vw, 14.5rem)";
const DESKTOP_SIDEBAR_RAIL_HEIGHT =
  "calc(100svh - env(safe-area-inset-top) - clamp(1.4rem, 3vh, 2rem))";
const DESKTOP_SIDEBAR_CARD_INSET_PX = 12;

type SidebarViewportState = {
  left: number;
  mode: "bottom" | "fixed" | "inline";
  top: number;
  width: number;
};

function getIsMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  if (isHydratingPrerenderedPage()) return false;
  return window.innerWidth <= MOBILE_BREAKPOINT_PX;
}

export default function BlogPost({
  isEntryReady,
  title,
  byline,
  buttons,
  heroImage,
  contentRef,
  onContentClick,
  sidebar,
  children,
}: BlogPostProps): JSX.Element {
  const [isMobile, setIsMobile] = useState(getIsMobileViewport);
  const [isSidebarDismissed, setIsSidebarDismissed] = useState(false);
  const [hoveredButtonIndex, setHoveredButtonIndex] = useState<number | null>(
    null,
  );
  const [isSidebarToggleHovered, setIsSidebarToggleHovered] = useState(false);
  const [shouldAnimateLayout, setShouldAnimateLayout] = useState(false);
  const readingCardRef = useRef<HTMLElement>(null);
  const sidebarColumnRef = useRef<HTMLElement>(null);
  const sidebarPanelRef = useRef<HTMLDivElement>(null);
  const sidebarContentRef = useRef<HTMLDivElement>(null);
  const [sidebarViewportState, setSidebarViewportState] =
    useState<SidebarViewportState | null>(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onViewportResize = (): void => {
      setIsMobile(getIsMobileViewport());
    };

    onViewportResize();
    window.addEventListener("resize", onViewportResize);
    return () => window.removeEventListener("resize", onViewportResize);
  }, []);

  useEffect((): (() => void) | void => {
    if (typeof window === "undefined") return;

    let secondFrameId = 0;
    const firstFrameId = window.requestAnimationFrame((): void => {
      secondFrameId = window.requestAnimationFrame((): void => {
        setShouldAnimateLayout(true);
      });
    });

    return (): void => {
      window.cancelAnimationFrame(firstFrameId);
      window.cancelAnimationFrame(secondFrameId);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const clearSourceHover = (): void => {
      setHoveredButtonIndex(null);
      setIsSidebarToggleHovered(false);
    };

    const onVisibilityChange = (): void => {
      if (document.hidden) clearSourceHover();
    };

    window.addEventListener("blur", clearSourceHover);
    window.addEventListener("pagehide", clearSourceHover);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("blur", clearSourceHover);
      window.removeEventListener("pagehide", clearSourceHover);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const pageXPadding = "var(--page-x-padding)";
  const hasHeroImage = Boolean(heroImage);
  const heroOverlap = isMobile ? 108 : 132;
  const heroHeight = isMobile ? 300 : 470;
  const titleMargin = hasHeroImage
    ? isMobile
      ? "-1.9rem 0 0.94rem"
      : "-2.8rem 0 1.02rem"
    : isMobile
      ? "1.15rem 0 0.94rem"
      : "1.45rem 0 1.02rem";
  const contentPadding = isMobile
    ? "0.58rem 0.72rem 0.72rem"
    : "clamp(0.58rem, 0.92vw, 1rem) clamp(0.9rem, 1.4vw, 1.6rem) clamp(0.68rem, 1.06vw, 1.15rem)";
  const showSidebar = Boolean(sidebar) && !isMobile && !isSidebarDismissed;
  const hasDesktopSidebar = Boolean(sidebar) && !isMobile;
  const postContentFadeStyle: CSSProperties = isEntryReady
    ? {
        opacity: 1,
        pointerEvents: "auto",
      }
    : {
        opacity: 0,
        pointerEvents: "none",
      };
  const postLayoutTransition =
    prefersReducedMotion || !shouldAnimateLayout
      ? null
      : POST_LAYOUT_TRANSITION;
  const sidebarViewportMode = sidebarViewportState?.mode ?? "inline";
  const isSidebarBottomAnchored = sidebarViewportMode === "bottom";
  const isSidebarFixed = sidebarViewportMode === "fixed";
  const isSidebarPinned = isSidebarBottomAnchored || isSidebarFixed;
  const sidebarMotionStyle: CSSProperties = {
    left:
      isSidebarFixed && sidebarViewportState
        ? `${sidebarViewportState.left}px`
        : isSidebarBottomAnchored
          ? 0
          : undefined,
    position: isSidebarFixed
      ? "fixed"
      : isSidebarBottomAnchored
        ? "absolute"
        : "relative",
    top:
      isSidebarPinned && sidebarViewportState
        ? `${sidebarViewportState.top}px`
        : undefined,
    width:
      isSidebarPinned && sidebarViewportState
        ? `${sidebarViewportState.width}px`
        : undefined,
    zIndex: isSidebarFixed ? 3 : 1,
  };
  const syncSidebarViewportState = useCallback((): void => {
    if (typeof window === "undefined") return;
    if (!showSidebar) {
      setSidebarViewportState((current) => (current === null ? current : null));
      return;
    }

    const readingCardEl = readingCardRef.current;
    const sidebarColumnEl = sidebarColumnRef.current;
    const sidebarPanelEl = sidebarPanelRef.current;
    const sidebarContentEl = sidebarContentRef.current;
    if (
      !readingCardEl ||
      !sidebarColumnEl ||
      !sidebarPanelEl ||
      !sidebarContentEl
    )
      return;

    const readingCardRect = readingCardEl.getBoundingClientRect();
    const sidebarColumnRect = sidebarColumnEl.getBoundingClientRect();
    const stickyTopPx = Math.max(
      9.6,
      Math.min(window.innerHeight * 0.015, 14.4),
    );
    const fixedTop = Math.max(
      stickyTopPx,
      readingCardRect.top + DESKTOP_SIDEBAR_CARD_INSET_PX,
    );
    const bottomBoundary =
      readingCardRect.bottom - DESKTOP_SIDEBAR_CARD_INSET_PX;
    const panelHeight = sidebarContentEl.getBoundingClientRect().height;
    const shouldPinSidebar =
      sidebarColumnRect.top <= stickyTopPx &&
      bottomBoundary > fixedTop + DESKTOP_SIDEBAR_CARD_INSET_PX;
    const shouldAnchorToBottom =
      shouldPinSidebar && fixedTop + panelHeight >= bottomBoundary;
    const nextMode: SidebarViewportState["mode"] = shouldPinSidebar
      ? shouldAnchorToBottom
        ? "bottom"
        : "fixed"
      : "inline";
    const nextTop =
      nextMode === "bottom"
        ? bottomBoundary - panelHeight - sidebarColumnRect.top
        : nextMode === "fixed"
          ? fixedTop
          : 0;

    setSidebarViewportState((current) => {
      if (
        current?.mode === nextMode &&
        current.left === sidebarColumnRect.left &&
        current.top === nextTop &&
        current.width === sidebarColumnRect.width
      ) {
        return current;
      }

      return {
        left: sidebarColumnRect.left,
        mode: nextMode,
        top: nextTop,
        width: sidebarColumnRect.width,
      };
    });
  }, [showSidebar]);
  const getHeaderButtonStyle = (isHovered: boolean): CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.38rem 0.74rem",
    borderRadius: "0.38rem",
    border: isHovered
      ? "1px solid rgba(255, 255, 255, 0.9)"
      : "1px solid rgba(255, 255, 255, 0.5)",
    backgroundColor: isHovered
      ? "rgba(255, 255, 255, 0.16)"
      : "rgba(255, 255, 255, 0.12)",
    color: isHovered ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.98)",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.84rem",
    letterSpacing: "0.01em",
    lineHeight: 1,
    transition:
      "background-color 120ms ease, border-color 120ms ease, color 120ms ease",
  });

  useEffect((): (() => void) | void => {
    if (!hasDesktopSidebar) {
      setSidebarViewportState((current) => (current === null ? current : null));
      return;
    }
    if (typeof window === "undefined") return;

    let frameId = 0;
    const scheduleSyncSidebarViewportState = (): void => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame((): void => {
        frameId = 0;
        syncSidebarViewportState();
      });
    };
    const resizeObserver = new ResizeObserver(scheduleSyncSidebarViewportState);

    syncSidebarViewportState();
    window.addEventListener("scroll", scheduleSyncSidebarViewportState, {
      passive: true,
    });
    window.addEventListener("resize", scheduleSyncSidebarViewportState);
    if (readingCardRef.current) resizeObserver.observe(readingCardRef.current);
    if (sidebarColumnRef.current)
      resizeObserver.observe(sidebarColumnRef.current);
    if (sidebarPanelRef.current)
      resizeObserver.observe(sidebarPanelRef.current);
    if (sidebarContentRef.current)
      resizeObserver.observe(sidebarContentRef.current);

    return (): void => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", scheduleSyncSidebarViewportState);
      window.removeEventListener("resize", scheduleSyncSidebarViewportState);
      resizeObserver.disconnect();
    };
  }, [hasDesktopSidebar, syncSidebarViewportState]);

  return (
    <main
      style={{
        width: "100%",
        color: "white",
        paddingBottom: "calc(3rem + env(safe-area-inset-bottom))",
        position: "relative",
      }}
    >
      {heroImage ? (
        <div
          className="post-hero"
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
            backgroundColor: "#52668b",
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
                "linear-gradient(to bottom, rgba(82, 102, 139, 0) 0%, rgba(82, 102, 139, 0.03) 16%, rgba(82, 102, 139, 0.12) 34%, rgba(82, 102, 139, 0.32) 54%, rgba(82, 102, 139, 0.6) 72%, rgba(82, 102, 139, 0.84) 88%, rgba(82, 102, 139, 1) 100%), linear-gradient(to bottom, rgba(82, 102, 139, 0) 0%, rgba(82, 102, 139, 0.28) 100%)",
            }}
          />
        </div>
      ) : null}
      <div
        className={`post-title-block ${hasHeroImage ? "has-hero" : "no-hero"}`}
        style={{ margin: titleMargin, position: "relative", zIndex: 1 }}
      >
        <h1
          className="post-title-heading"
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
        {buttons.length ? (
          <div
            style={{
              marginTop: "0.55rem",
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            {buttons.map((button, index) => {
              const isHovered = hoveredButtonIndex === index;
              return (
                <a
                  key={`${button.link}-${index}`}
                  href={button.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={button.title}
                  onMouseEnter={() => setHoveredButtonIndex(index)}
                  onMouseLeave={() => setHoveredButtonIndex(null)}
                  onFocus={() => setHoveredButtonIndex(index)}
                  onBlur={() => setHoveredButtonIndex(null)}
                  style={getHeaderButtonStyle(isHovered)}
                >
                  {button.title}
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
      <div
        style={{
          ...postContentFadeStyle,
          transition: prefersReducedMotion
            ? "none"
            : `opacity ${POST_ENTRY_FADE_MS}ms ease`,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <section
          ref={readingCardRef}
          data-post-reading-card
          style={{
            width: isMobile
              ? "100%"
              : showSidebar
                ? `min(100%, calc(${DESKTOP_READING_WIDTH} + ${DESKTOP_SIDEBAR_WIDTH}))`
                : DESKTOP_READING_WIDTH,
            marginInline: "auto",
            position: "relative",
            color: "#1f2740",
            borderRadius: isMobile ? "10px" : "14px",
            border: "1px solid rgba(224, 216, 202, 0.58)",
            background:
              "linear-gradient(168deg, rgba(248, 245, 239, 0.98) 0%, rgba(243, 238, 229, 0.96) 100%)",
            boxShadow: "0 10px 22px rgba(7, 12, 24, 0.11)",
            overflow: "visible",
            isolation: "isolate",
            transition: postLayoutTransition
              ? `width ${postLayoutTransition}`
              : "none",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              pointerEvents: "none",
            }}
          />
          {hasDesktopSidebar && !showSidebar ? (
            <button
              type="button"
              onClick={() => setIsSidebarDismissed(false)}
              aria-label="Show contents"
              className="post-reading-card-open-zone"
            />
          ) : null}
          <div
            className="post-reading-grid"
            style={{
              width: "100%",
              maxWidth: "none",
              marginInline: "auto",
              marginBlock: 0,
              position: "relative",
              zIndex: 1,
              padding: contentPadding,
              display: "grid",
              gridTemplateColumns: hasDesktopSidebar
                ? `${showSidebar ? DESKTOP_SIDEBAR_WIDTH : "0px"} minmax(0, 1fr)`
                : "minmax(0, 1fr)",
              gap: 0,
              alignItems: "start",
              transition: postLayoutTransition
                ? `grid-template-columns ${postLayoutTransition}`
                : "none",
            }}
          >
            {hasDesktopSidebar ? (
              <aside
                ref={sidebarColumnRef}
                style={{
                  alignSelf: "start",
                  maxHeight: DESKTOP_SIDEBAR_RAIL_HEIGHT,
                  minWidth: 0,
                  position: "relative",
                  overflow: "visible",
                }}
              >
                <div
                  ref={sidebarPanelRef}
                  className={`post-sidebar-panel${
                    showSidebar ? " is-open" : " is-closed"
                  }`}
                  style={sidebarMotionStyle}
                >
                  <div
                    className="post-sidebar-shell"
                    style={{
                      maxHeight:
                        sidebarViewportMode === "bottom"
                          ? undefined
                          : DESKTOP_SIDEBAR_RAIL_HEIGHT,
                      overflowY:
                        sidebarViewportMode === "bottom" ? "visible" : "auto",
                      overscrollBehavior: "contain",
                      transition: postLayoutTransition
                        ? `opacity ${postLayoutTransition}, transform ${postLayoutTransition}`
                        : "none",
                    }}
                  >
                    <div
                      ref={sidebarContentRef}
                      className="post-sidebar-content"
                    >
                      <div className="post-sidebar-header">
                        <p className="post-toc-eyebrow">Contents</p>
                        <button
                          type="button"
                          onClick={() => setIsSidebarDismissed(true)}
                          onMouseEnter={() => setIsSidebarToggleHovered(true)}
                          onMouseLeave={() => setIsSidebarToggleHovered(false)}
                          onFocus={() => setIsSidebarToggleHovered(true)}
                          onBlur={() => setIsSidebarToggleHovered(false)}
                          aria-label="Hide contents"
                          className="post-sidebar-toggle"
                          style={{
                            opacity: isSidebarToggleHovered ? 1 : 0.86,
                          }}
                        >
                          <ArrowFromLineIcon direction="left" />
                        </button>
                      </div>
                      {sidebar}
                    </div>
                  </div>
                </div>
              </aside>
            ) : null}
            <article
              ref={contentRef}
              className="post-content"
              data-post-content
              style={{
                borderLeft:
                  showSidebar && !isMobile
                    ? "1px solid rgba(58, 77, 120, 0.18)"
                    : undefined,
                width: "100%",
                maxWidth: "none",
                marginInline: "auto",
                marginBlock: 0,
                minWidth: 0,
                paddingLeft:
                  showSidebar && !isMobile
                    ? "clamp(1rem, 1.8vw, 1.6rem)"
                    : undefined,
                lineHeight: 1.74,
                fontSize: "1.1rem",
                color: "#2a344f",
                position: "relative",
                zIndex: 1,
              }}
              onClick={onContentClick}
            >
              {children}
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
