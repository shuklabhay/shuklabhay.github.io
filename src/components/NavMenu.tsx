import { useLocation, Link } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const MENU_ITEMS = [
  { label: "home", path: "/" },
  { label: "about", path: "/about" },
  { label: "blog", path: "/blog" },
];

export default function NavMenu() {
  const location = useLocation();
  const activeKey =
    location.pathname.split("/").filter(Boolean)[0]?.toLowerCase() ?? "home";
  const navRef = useRef<HTMLElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [transitionsEnabled, setTransitionsEnabled] = useState(false);
  const initialKeyRef = useRef(activeKey);

  useLayoutEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const links = Array.from(navEl.querySelectorAll("a")) as HTMLElement[];
    if (!links.length) return;

    const updateUnderline = () => {
      const activeIndex = MENU_ITEMS.findIndex((item) => item.label === activeKey);
      const activeLink = links[activeIndex];

      if (!activeLink) {
        setUnderlineStyle((prev) =>
          prev.opacity === 0 ? prev : { left: 0, width: 0, opacity: 0 }
        );
        return;
      }

      const next = {
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
        opacity: 1,
      };

      setUnderlineStyle((prev) =>
        prev.left === next.left && prev.width === next.width && prev.opacity === next.opacity
          ? prev
          : next
      );
    };

    updateUnderline();

    const handleResize = () => updateUnderline();
    window.addEventListener("resize", handleResize);

    const resizeObserver =
      typeof ResizeObserver === "function" ? new ResizeObserver(updateUnderline) : null;
    resizeObserver?.observe(navEl);
    links.forEach((link) => resizeObserver?.observe(link));

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
    };
  }, [activeKey]);

  useEffect(() => {
    if (activeKey !== initialKeyRef.current) {
      setTransitionsEnabled(true);
    }
  }, [activeKey]);

  return (
    <nav
      ref={navRef}
      style={{
        position: "relative",
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
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "1.25rem",
            position: "relative",
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
          transition: transitionsEnabled
            ? "transform 0.3s ease, width 0.3s ease, opacity 0.2s ease"
            : "opacity 0.2s ease",
          willChange: "transform, width, opacity",
          pointerEvents: "none",
        }}
      />
    </nav>
  );
}
