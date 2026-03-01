import { useLocation, Link } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";

const MENU_ITEMS = [
  { label: "home", path: "/" },
  { label: "about", path: "/about" },
  { label: "blog", path: "/blog" },
];

type UnderlineMode = "none" | "fade" | "move";
type UnderlineStyle = {
  left: number;
  width: number;
  opacity: number;
  mode: UnderlineMode;
};

export default function NavMenu() {
  const location = useLocation();
  const isPostRoute =
    location.pathname.startsWith("/blog/") && location.pathname !== "/blog";
  const activeKey = isPostRoute
    ? null
    : (location.pathname.split("/").filter(Boolean)[0]?.toLowerCase() ??
      "home");
  const navRef = useRef<HTMLElement>(null);
  const prevActiveKeyRef = useRef<string | null>(null);
  const hasInitializedRef = useRef(false);
  const [underlineStyle, setUnderlineStyle] = useState<UnderlineStyle>({
    left: 0,
    width: 0,
    opacity: 0,
    mode: "none",
  });

  useLayoutEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const links = Array.from(navEl.querySelectorAll("a")) as HTMLElement[];
    if (!links.length) return;

    const updateUnderline = () => {
      const activeIndex = MENU_ITEMS.findIndex(
        (item) => item.label === activeKey,
      );
      const activeLink = links[activeIndex];

      if (!activeLink) {
        setUnderlineStyle((prev) =>
          prev.opacity === 0 && prev.mode === "fade"
            ? prev
            : { ...prev, opacity: 0, mode: "fade" },
        );
        prevActiveKeyRef.current = null;
        hasInitializedRef.current = true;
        return;
      }

      const isFirstVisibleUnderline = !hasInitializedRef.current;
      const shouldMove =
        hasInitializedRef.current &&
        prevActiveKeyRef.current !== null &&
        activeKey !== null &&
        prevActiveKeyRef.current !== activeKey;

      const next: UnderlineStyle = {
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
        opacity: 1,
        mode: isFirstVisibleUnderline ? "none" : shouldMove ? "move" : "fade",
      };

      setUnderlineStyle((prev) => {
        const samePosition =
          prev.left === next.left && prev.width === next.width;
        const sameOpacity = prev.opacity === next.opacity;
        return samePosition && sameOpacity ? prev : next;
      });

      prevActiveKeyRef.current = activeKey;
      hasInitializedRef.current = true;
    };

    updateUnderline();

    const handleResize = () => updateUnderline();
    window.addEventListener("resize", handleResize);

    const resizeObserver =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(updateUnderline)
        : null;
    resizeObserver?.observe(navEl);
    links.forEach((link) => resizeObserver?.observe(link));

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
    };
  }, [activeKey]);

  return (
    <nav
      ref={navRef}
      style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        gap: "1.5rem",
        justifyContent: "flex-end",
        paddingTop: "1rem",
        paddingBottom: "4px",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
    >
      {MENU_ITEMS.map(({ label, path }) => (
        <Link
          key={label}
          to={path}
          state={isPostRoute ? { fromPost: true } : undefined}
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "1.25rem",
            position: "relative",
            display: "inline-block",
            lineHeight: 1.1,
            paddingBottom: "0.45rem",
            marginBottom: "-0.45rem",
            userSelect: "none",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
          }}
        >
          {label}
        </Link>
      ))}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: `${underlineStyle.width}px`,
          height: "2px",
          backgroundColor: "white",
          transform: `translateX(${underlineStyle.left}px)`,
          opacity: underlineStyle.opacity,
          transition:
            underlineStyle.mode === "move"
              ? "transform 0.28s ease, width 0.28s ease, opacity 0.2s ease"
              : underlineStyle.mode === "fade"
                ? "opacity 0.2s ease"
                : "none",
          willChange: "transform, width, opacity",
          pointerEvents: "none",
        }}
      />
    </nav>
  );
}
