import { useLocation, Link, useNavigate } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { runWithRootViewTransition } from "../utils/viewTransitions";
import type { UnderlineStyle } from "../utils/types";

const MENU_ITEMS = [
  { label: "home", path: "/" },
  { label: "about", path: "/about" },
  { label: "blog", path: "/blog" },
];

export default function NavMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const isPostRoute =
    location.pathname.startsWith("/blog/") && location.pathname !== "/blog";
  const activeKey = isPostRoute
    ? null
    : (location.pathname.split("/").filter(Boolean)[0]?.toLowerCase() ??
      "home");
  const navRef = useRef<HTMLElement>(null);
  const prevActiveKeyRef = useRef<string | null>(null);
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
      return;
    }

    const navRect = navEl.getBoundingClientRect();
    const underlineTarget = activeLink.querySelector(
      "[data-underline-target]",
    ) as HTMLElement | null;
    const linkRect = (underlineTarget ?? activeLink).getBoundingClientRect();
    const pixelRatio =
      typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
    const snapToDevicePixel = (value: number) =>
      Math.round(value * pixelRatio) / pixelRatio;
    const shouldMove =
      prevActiveKeyRef.current !== null &&
      prevActiveKeyRef.current !== activeKey;

    setUnderlineStyle({
      left: snapToDevicePixel(linkRect.left - navRect.left),
      width: snapToDevicePixel(linkRect.width),
      opacity: 1,
      mode: shouldMove ? "move" : "none",
    });
    prevActiveKeyRef.current = activeKey;
  }, [activeKey]);

  const handleTopLevelNavClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      return;
    if (location.pathname === path) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const navigateState = isPostRoute ? { fromPost: true } : undefined;
    if (isPostRoute) {
      navigate(path, { state: navigateState });
      return;
    }

    const shouldSkipRootViewTransition =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(hover: none)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (shouldSkipRootViewTransition) {
      navigate(path, { state: navigateState });
      return;
    }

    runWithRootViewTransition(() => {
      navigate(path, { state: navigateState });
    });
  };

  const underlineMoveTransition = "transform 0.32s ease, opacity 0.2s ease";

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
          viewTransition={false}
          state={isPostRoute ? { fromPost: true } : undefined}
          onClick={(event) => handleTopLevelNavClick(event, path)}
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "1.25rem",
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            lineHeight: 1.1,
            paddingTop: "0.24rem",
            paddingInline: "0.3rem",
            paddingBottom: "0.45rem",
            marginTop: "-0.24rem",
            marginInline: "-0.3rem",
            marginBottom: "-0.45rem",
            userSelect: "none",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
          }}
        >
          <span data-underline-target style={{ display: "inline-block" }}>
            {label}
          </span>
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
          transform: `translate3d(${underlineStyle.left}px, 0, 0)`,
          opacity: underlineStyle.opacity,
          transition:
            underlineStyle.mode === "move"
              ? underlineMoveTransition
              : underlineStyle.mode === "fade"
                ? "opacity 0.2s ease"
                : "none",
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          pointerEvents: "none",
        }}
      />
    </nav>
  );
}
