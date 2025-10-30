import { useLocation, Link } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";

export default function NavMenu() {
  const location = useLocation();
  const menuItems = ["home", "about", "blog"];
  const navRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [underlineStyle, setUnderlineStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const activeItem = pathSegments[0]?.toLowerCase() ?? "home";

  useLayoutEffect(() => {
    if (!navRef.current) return;
    let frame = 0;
    let timer: number | undefined;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!navRef.current) return;
        const activeIndex = menuItems.indexOf(activeItem);
        const links = navRef.current.querySelectorAll("a");
        if (!links.length) return;
        if (activeIndex === -1) {
          setUnderlineStyle((prev) => ({
            ...prev,
            opacity: 0,
          }));
          return;
        }

        const el = links[activeIndex] as HTMLElement | undefined;
        if (!el) return;

        setUnderlineStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1,
        });
      });
    };

    measure();
    if (!hasAnimated) {
      timer = window.setTimeout(() => setHasAnimated(true), 50);
    }

    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    return () => {
      cancelAnimationFrame(frame);
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [activeItem, hasAnimated]);

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
      {menuItems.map((item) => (
        <Link
          key={item}
          to={item === "home" ? "/" : `/${item.toLowerCase()}`}
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "1.25rem",
            position: "relative",
          }}
        >
          {item}
        </Link>
      ))}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: 0,
          width: `${underlineStyle.width}px`,
          height: "2px",
          backgroundColor: "white",
          transform: `translateX(${underlineStyle.left}px)`,
          opacity: underlineStyle.opacity,
          transition: hasAnimated
            ? "transform 0.3s ease, width 0.3s ease, opacity 0.2s ease"
            : "none",
          willChange: "transform, width, opacity",
          pointerEvents: "none",
        }}
      />
    </nav>
  );
}
