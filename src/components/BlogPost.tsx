import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import ArrowFromLineIcon from "./ArrowFromLineIcon";
import type { BlogPostProps } from "../utils/types";

const MOBILE_BREAKPOINT_PX = 860;
const POST_ENTRY_FADE_MS = 375;
const SIDEBAR_STAGGER_PX = 15;

function getIsMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
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
  const [sidebarTranslateYPx, setSidebarTranslateYPx] = useState(0);
  const [hoveredButtonIndex, setHoveredButtonIndex] = useState<number | null>(
    null,
  );
  const [isSidebarToggleHovered, setIsSidebarToggleHovered] = useState(false);
  const readingCardRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    if (typeof window === "undefined" || !sidebar || isMobile) {
      setSidebarTranslateYPx(0);
      return;
    }

    const updateSidebarOffset = (): void => {
      const cardTop = readingCardRef.current?.getBoundingClientRect().top ?? 0;
      const nextOffset = Math.round(
        Math.min(Math.max(cardTop, 0), SIDEBAR_STAGGER_PX),
      );
      setSidebarTranslateYPx((current) =>
        current === nextOffset ? current : nextOffset,
      );
    };

    updateSidebarOffset();
    window.addEventListener("scroll", updateSidebarOffset, { passive: true });
    window.addEventListener("resize", updateSidebarOffset);

    return () => {
      window.removeEventListener("scroll", updateSidebarOffset);
      window.removeEventListener("resize", updateSidebarOffset);
    };
  }, [isMobile, sidebar]);

  const pageXPadding = isMobile ? "0.625rem" : "1.125rem";
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
  const sidebarMotionStyle: CSSProperties = {
    transform: `translateY(${sidebarTranslateYPx}px)`,
  };
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
            width: isMobile ? "100%" : "95%",
            marginInline: "auto",
            position: "relative",
            color: "#1f2740",
            borderRadius: isMobile ? "10px" : "12px",
            border: "1px solid rgba(210, 223, 255, 0.78)",
            background:
              "linear-gradient(168deg, rgba(250, 248, 243, 0.98) 0%, rgba(245, 241, 234, 0.95) 100%)",
            boxShadow: "0 22px 46px rgba(7, 12, 24, 0.25)",
            overflow: "visible",
            isolation: "isolate",
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
          {hasDesktopSidebar && !showSidebar ? (
            <button
              type="button"
              onClick={() => setIsSidebarDismissed(false)}
              aria-label="Show contents"
              className="post-reading-card-open-zone"
            />
          ) : null}
          <div
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
                ? `${showSidebar ? "clamp(11.5rem, 16vw, 14.5rem)" : "0px"} minmax(0, 1fr)`
                : "minmax(0, 1fr)",
              gap: showSidebar ? "clamp(1rem, 2vw, 1.8rem)" : 0,
              alignItems: "start",
              transition: prefersReducedMotion
                ? "none"
                : "grid-template-columns 220ms ease, gap 220ms ease",
            }}
          >
            {hasDesktopSidebar ? (
              <aside
                style={{
                  alignSelf: "start",
                  position: "sticky",
                  top: "clamp(0.75rem, 2vh, 1.2rem)",
                  minWidth: 0,
                  overflow: "visible",
                }}
              >
                <div
                  className={`post-sidebar-panel${
                    showSidebar ? " is-open" : " is-closed"
                  }`}
                  style={sidebarMotionStyle}
                >
                  <div className="post-sidebar-shell">
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
              </aside>
            ) : null}
            <article
              ref={contentRef}
              className="post-content"
              data-post-content
              style={{
                width: "100%",
                maxWidth: "none",
                marginInline: "auto",
                marginBlock: 0,
                minWidth: 0,
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
          </div>
        </section>
      </div>
    </main>
  );
}
