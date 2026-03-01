import { useLocation, Link } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";

const MENU_ITEMS = [
  { label: "home", path: "/" },
  { label: "about", path: "/about" },
  { label: "blog", path: "/blog" },
];

export default function NavMenu() {
  const location = useLocation();
  const isPostRoute =
    location.pathname.startsWith("/blog/") && location.pathname !== "/blog";
  const activeKey = isPostRoute
    ? null
    : (location.pathname.split("/").filter(Boolean)[0]?.toLowerCase() ??
      "home");
  const navRef = useRef<HTMLElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [underlineTransitionMode, setUnderlineTransitionMode] = useState<
    "fade" | "move"
  >("fade");

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
        setUnderlineTransitionMode("fade");
        setUnderlineStyle((prev) =>
          prev.opacity === 0 ? prev : { ...prev, opacity: 0 },
        );
        return;
      }

      const next = {
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
        opacity: 1,
      };

      setUnderlineStyle((prev) => {
        setUnderlineTransitionMode(prev.opacity === 0 ? "fade" : "move");
        return prev.left === next.left &&
          prev.width === next.width &&
          prev.opacity === next.opacity
          ? prev
          : next;
      });
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
            underlineTransitionMode === "move"
              ? "transform 0.28s ease, width 0.28s ease, opacity 0.2s ease"
              : "opacity 0.2s ease",
          willChange: "transform, width, opacity",
          pointerEvents: "none",
        }}
      />
    </nav>
  );
}
