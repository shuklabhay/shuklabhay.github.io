import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { BlogPostProps } from "../utils/types";
import { isHydratingPrerenderedPage } from "../utils/prerender";

const MOBILE_BREAKPOINT_PX = 860;
const POST_ENTRY_FADE_MS = 320;
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
  header,
  children,
}: BlogPostProps): JSX.Element {
  const [isMobile, setIsMobile] = useState(getInitialIsMobile);
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
      <div className="post-column">
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
          <article
            ref={contentRef}
            className="post-content"
            data-post-content
            style={{
              width: "100%",
              minWidth: 0,
              paddingTop: "0.4rem",
              lineHeight: 1.7,
              fontSize: "1.1rem",
              color: "var(--ink-soft)",
            }}
            onClick={onContentClick}
          >
            {children}
          </article>
        </div>
      </div>
    </main>
  );
}
