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
  });

  const getActivePage = () => {
    if (location.pathname === "/") return "home";
    return location.pathname.slice(1);
  };
  const activeItem = getActivePage();

  useLayoutEffect(() => {
    if (!navRef.current) return;
    const measure = () => {
      const activeIndex = menuItems.indexOf(activeItem);
      const links = navRef.current!.querySelectorAll("a");
      const el = links[activeIndex] as HTMLElement | undefined;
      if (!el) return;
      setUnderlineStyle({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    if (!hasAnimated) setTimeout(() => setHasAnimated(true), 50);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [activeItem]);

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
          left: `${underlineStyle.left}px`,
          width: `${underlineStyle.width}px`,
          height: "2px",
          backgroundColor: "white",
          transition: hasAnimated ? "left 0.3s ease, width 0.3s ease" : "none",
        }}
      />
    </nav>
  );
}
