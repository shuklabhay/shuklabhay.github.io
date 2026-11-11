import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { BlogPostProps } from "../utils/types";
import { isHydratingPrerenderedPage } from "../utils/prerender";

const MOBILE_BREAKPOINT_PX = 860;
function getInitialIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  if (isHydratingPrerenderedPage()) return false;
  return window.innerWidth <= MOBILE_BREAKPOINT_PX;
}

export default function BlogPost({
  title,
  byline,
  buttons,
  heroImage,
  contentRef,
  onContentClick,
  header,
  children,
}: BlogPostProps): JSX.Element {
  const [isMobile, setIsMobile] = useState(getInitialIsMobile);
  const [hoveredButtonIndex, setHoveredButtonIndex] = useState<number | null>(
    null,
  );

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
    ? "0 0 24px"
    : isMobile
      ? "12px 0 24px"
      : "24px 0 24px";
  const getHeaderButtonStyle = (isHovered: boolean): CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 11px",
    borderRadius: 0,
    border: isHovered
      ? "1px solid var(--ink)"
      : "1px solid rgba(17, 17, 17, 0.3)",
    backgroundColor: "transparent",
    color: "var(--ink)",
    textDecoration: "none",
    fontWeight: 400,
    fontSize: "var(--small-text)",
    letterSpacing: "0.01em",
    lineHeight: "22px",
    transition:
      "background-color var(--motion-hover) linear, border-color var(--motion-hover) linear, color var(--motion-hover) linear",
  });

  return (
    <main
      className="route-page-post"
      style={{
        width: "100%",
        color: "var(--ink)",
        paddingBottom: "calc(48px + env(safe-area-inset-bottom))",
        position: "relative",
      }}
    >
      <div className="post-column">
        {header}
        {heroImage ? (
          <div
            className="post-hero"
            style={{
              width: "100%",
              height: isMobile
                ? "192px"
                : "round(clamp(216px, 26vw, 336px), 12px)",
              margin: isMobile ? "12px 0 24px" : "24px 0 24px",
              borderRadius: 0,
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
                margin: "6px 0 0",
                color: "var(--ink-muted)",
                fontSize: "var(--small-text)",
                lineHeight: "var(--small-lh)",
                letterSpacing: "0.01em",
              }}
            >
              {byline}
            </p>
          ) : null}
          {buttons.length ? (
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                gap: "12px",
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
                    className="post-header-button"
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
        <article
          ref={contentRef}
          className="post-content"
          data-post-content
          style={{
            width: "100%",
            minWidth: 0,
            paddingTop: 0,
            lineHeight: "var(--lh)",
            fontSize: "var(--text)",
            color: "var(--ink-soft)",
          }}
          onClick={onContentClick}
        >
          {children}
        </article>
      </div>
    </main>
  );
}
