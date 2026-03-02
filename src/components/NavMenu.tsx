import { useLocation, Link, useNavigate } from "react-router-dom";
import type { MouseEvent as ReactMouseEvent } from "react";
import { runWithRootViewTransition } from "../utils/viewTransitions";

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

    runWithRootViewTransition(() => {
      navigate(path, { state: navigateState });
    });
  };

  return (
    <nav
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
      {MENU_ITEMS.map(({ label, path }) => {
        const isActive = activeKey === label;
        return (
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
              WebkitTapHighlightColor: "transparent",
              outline: "none",
              boxShadow: "none",
            }}
          >
            <span
              style={{
                display: "inline-block",
                borderBottom: `2px solid ${isActive ? "white" : "transparent"}`,
                paddingBottom: "1px",
                transition: "border-color 140ms ease",
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
