import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (navRef.current) {
      const activeIndex = menuItems.indexOf(activeItem);
      const links = navRef.current.querySelectorAll("a");
      if (links[activeIndex]) {
        const activeLink = links[activeIndex] as HTMLElement;
        setUnderlineStyle({
          left: activeLink.offsetLeft,
          width: activeLink.offsetWidth,
        });
        if (!hasAnimated) {
          setTimeout(() => setHasAnimated(true), 50);
        }
      }
    }
  }, [activeItem]);

  return (
    <nav
      ref={navRef}
      style={{
        position: "absolute",
        top: "1rem",
        right: "1.5rem",
        display: "flex",
        gap: "1.5rem",
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
          bottom: "-4px",
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
