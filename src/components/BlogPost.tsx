import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import ArrowFromLineIcon from "./ArrowFromLineIcon";
import type { BlogPostProps } from "../utils/types";
import { isHydratingPrerenderedPage } from "../utils/prerender";

const MOBILE_BREAKPOINT_PX = 860;
const POST_ENTRY_FADE_MS = 320;
const DESKTOP_READING_WIDTH = "46rem";
const DESKTOP_SIDEBAR_WIDTH = "clamp(11.5rem, 16vw, 14.5rem)";
function getInitialIsMobile(): boolean {
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
  header,
  children,
}: BlogPostProps): JSX.Element {
  const [isMobile, setIsMobile] = useState(getInitialIsMobile);
  const [isSidebarDismissed, setIsSidebarDismissed] = useState(false);
  const [hoveredButtonIndex, setHoveredButtonIndex] = useState<number | null>(
    null,
  );
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onViewportResize = (): void => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT_PX);
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

  const hasHeroImage = Boolean(heroImage);
  const titleMargin = hasHeroImage
    ? "0 0 1.1rem"
    : isMobile
      ? "0.9rem 0 1rem"
      : "1.1rem 0 1.2rem";
  const contentPadding = "0.4rem 0 0";
  const showSidebar = Boolean(sidebar) && !isMobile && !isSidebarDismissed;
  const postColumnWidth = isMobile
    ? "100%"
    : showSidebar
      ? `calc(${DESKTOP_READING_WIDTH} + ${DESKTOP_SIDEBAR_WIDTH})`
      : DESKTOP_READING_WIDTH;
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
  const getHeaderButtonStyle = (isHovered: boolean): CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.38rem 0.74rem",
    borderRadius: "0.38rem",
    border: isHovered
      ? "1px solid var(--ink)"
      : "1px solid rgba(17, 17, 17, 0.3)",
    backgroundColor: "transparent",
    color: "var(--ink)",
    textDecoration: "none",
    fontWeight: 490,
    fontSize: "0.84rem",
    letterSpacing: "0.01em",
    lineHeight: 1,
    transition:
      "background-color 120ms ease, border-color 120ms ease, color 120ms ease",
  });

  return (
    <main
      className="route-page-post"
      style={{
        width: "100%",
        color: "var(--ink)",
        paddingBottom: "calc(3rem + env(safe-area-inset-bottom))",
        position: "relative",
      }}
    >
      <div
        style={{
          width: postColumnWidth,
          maxWidth: "100%",
          marginInline: "auto",
        }}
      >
        {header}
        {heroImage ? (
          <div
            className="post-hero"
            style={{
              width: "100%",
              height: isMobile ? "12.5rem" : "clamp(14rem, 26vw, 21rem)",
              margin: isMobile ? "0.75rem 0 1rem" : "1rem 0 1.25rem",
              borderRadius: isMobile ? "10px" : "12px",
              backgroundColor: "#e9e4d8",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundImage: `url(${heroImage})`,
              pointerEvents: "none",
            }}
            aria-hidden
          />
        ) : null}
        <div
          className={`post-title-block ${hasHeroImage ? "has-hero" : "no-hero"}`}
          style={{ margin: titleMargin, position: "relative", zIndex: 1 }}
        >
          <h1 className="page-heading">{title}</h1>
          {byline ? (
            <p
              style={{
                margin: "0.3rem 0 0",
                color: "var(--ink-muted)",
                fontSize: "clamp(0.94rem, 1vw, 1.03rem)",
                letterSpacing: "0.01em",
              }}
            >
              {byline}
            </p>
          ) : null}
          {buttons.length ? (
            <div
              style={{
                marginTop: "0.7rem",
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
          }}
        >
          <section
            data-post-reading-card
            style={{
              width: "100%",
              position: "relative",
              color: "var(--ink)",
              isolation: "isolate",
            }}
          >
            {hasDesktopSidebar && !showSidebar ? (
              <div className="post-toc-reopen">
                <button
                  type="button"
                  onClick={() => setIsSidebarDismissed(false)}
                  aria-label="Show contents"
                  className="post-sidebar-toggle"
                >
                  <ArrowFromLineIcon direction="right" />
                </button>
              </div>
            ) : null}
            <div
              className="post-reading-grid"
              style={{
                width: "100%",
                position: "relative",
                zIndex: 1,
                padding: contentPadding,
                display: "grid",
                gridTemplateColumns: showSidebar
                  ? `${DESKTOP_SIDEBAR_WIDTH} minmax(0, 1fr)`
                  : "minmax(0, 1fr)",
                gap: 0,
                alignItems: "start",
              }}
            >
              {showSidebar ? (
                <aside className="post-sidebar">
                  <div className="post-sidebar-header">
                    <p className="post-toc-eyebrow">Contents</p>
                    <button
                      type="button"
                      onClick={() => setIsSidebarDismissed(true)}
                      aria-label="Hide contents"
                      className="post-sidebar-toggle"
                    >
                      <ArrowFromLineIcon direction="left" />
                    </button>
                  </div>
                  {sidebar}
                </aside>
              ) : null}
              <article
                ref={contentRef}
                className="post-content"
                data-post-content
                style={{
                  borderLeft:
                    showSidebar && !isMobile
                      ? "1px solid rgba(17, 17, 17, 0.12)"
                      : undefined,
                  width: "100%",
                  minWidth: 0,
                  paddingLeft:
                    showSidebar && !isMobile
                      ? "clamp(1rem, 1.8vw, 1.6rem)"
                      : undefined,
                  lineHeight: 1.7,
                  fontSize: "1.1rem",
                  color: "var(--ink-soft)",
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
      </div>
    </main>
  );
}
