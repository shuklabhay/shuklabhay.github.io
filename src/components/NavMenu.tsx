import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import type { MouseEvent as ReactMouseEvent } from "react";
import { runWithRootViewTransition } from "../utils/viewTransitions";
import type { NavUnderlineState, RouteTransitionState } from "../utils/types";

const MENU_ITEMS = [
  { label: "home", path: "/" },
  { label: "about", path: "/about" },
  { label: "blog", path: "/blog" },
];

function preloadTopLevelRoute(path: string) {
  if (path === "/about") {
    return import("../pages/About.tsx");
  }
  if (path === "/blog") {
    return import("../pages/Blog.tsx");
  }
  return Promise.resolve();
}

export default function NavMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  const itemLabelRefByKey = useRef<Record<string, HTMLSpanElement | null>>({});
  const previousActiveKeyRef = useRef<string | null>(null);
  const hasMeasuredUnderlineRef = useRef(false);
  const [underlineState, setUnderlineState] = useState<NavUnderlineState>({
    left: 0,
    width: 0,
    visible: false,
    animate: false,
  });
  const isPostRoute =
    location.pathname.startsWith("/blog/") && location.pathname !== "/blog";
  const activeKey = isPostRoute
    ? "blog"
    : (location.pathname.split("/").filter(Boolean)[0]?.toLowerCase() ??
      "home");

  const updateUnderline = useCallback(
    (nextActiveKey: string | null, options: { animate: boolean }) => {
      const navEl = navRef.current;
      if (!navEl || !nextActiveKey) {
        setUnderlineState((current) => {
          if (!current.visible && !current.animate) return current;
          return { ...current, visible: false, animate: false };
        });
        return;
      }

      const labelEl = itemLabelRefByKey.current[nextActiveKey];
      if (!labelEl) return;

      const navRect = navEl.getBoundingClientRect();
      const labelRect = labelEl.getBoundingClientRect();
      const nextLeft = labelRect.left - navRect.left;
      const nextWidth = labelRect.width;

      setUnderlineState((current) => {
        if (
          current.left === nextLeft &&
          current.width === nextWidth &&
          current.visible &&
          current.animate === options.animate
        ) {
          return current;
        }

        return {
          left: nextLeft,
          width: nextWidth,
          visible: true,
          animate: options.animate,
        };
      });
    },
    [],
  );

  useLayoutEffect(() => {
    const previousActiveKey = previousActiveKeyRef.current;
    const shouldAnimateUnderline =
      hasMeasuredUnderlineRef.current &&
      previousActiveKey !== null &&
      activeKey !== null &&
      previousActiveKey !== activeKey &&
      !prefersReducedMotion;

    updateUnderline(activeKey, { animate: shouldAnimateUnderline });
    hasMeasuredUnderlineRef.current = true;
    previousActiveKeyRef.current = activeKey;
  }, [activeKey, updateUnderline, prefersReducedMotion]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frameId = 0;
    const syncUnderlineWithoutAnimation = () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateUnderline(activeKey, { animate: false });
      });
    };

    const viewport = window.visualViewport;
    window.addEventListener("resize", syncUnderlineWithoutAnimation);
    viewport?.addEventListener("resize", syncUnderlineWithoutAnimation);
    viewport?.addEventListener("scroll", syncUnderlineWithoutAnimation);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("resize", syncUnderlineWithoutAnimation);
      viewport?.removeEventListener("resize", syncUnderlineWithoutAnimation);
      viewport?.removeEventListener("scroll", syncUnderlineWithoutAnimation);
    };
  }, [activeKey, updateUnderline]);

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
    const navigateState: RouteTransitionState | undefined = isPostRoute
      ? { fromPost: true }
      : undefined;
    const preloadPromise = preloadTopLevelRoute(path);

    if (isPostRoute) {
      preloadPromise.finally(() => {
        navigate(path, { state: navigateState });
      });
      return;
    }

    const shouldSkipRootViewTransition =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(hover: none)").matches ||
        prefersReducedMotion);
    if (shouldSkipRootViewTransition) {
      preloadPromise.finally(() => {
        navigate(path, {
          state: {
            ...(navigateState ?? {}),
            fromTopNav: true,
          } satisfies RouteTransitionState,
        });
      });
      return;
    }

    preloadPromise.finally(() => {
      runWithRootViewTransition(() => {
        navigate(path, { state: navigateState });
      });
    });
  };

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
      {MENU_ITEMS.map(({ label, path }) => {
        const isActive = activeKey === label;
        return (
          <Link
            key={label}
            to={path}
            viewTransition={false}
            state={isPostRoute ? { fromPost: true } : undefined}
            onMouseEnter={() => {
              void preloadTopLevelRoute(path);
            }}
            onTouchStart={() => {
              void preloadTopLevelRoute(path);
            }}
            onClick={(event) => handleTopLevelNavClick(event, path)}
            aria-current={isActive ? "page" : undefined}
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "1.25rem",
              boxShadow: "none",
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
              borderRadius: "0.2rem",
              padding: "0.2rem 0.3rem",
            }}
            className="top-nav-link"
          >
            <span
              ref={(node) => {
                itemLabelRefByKey.current[label] = node;
              }}
              style={{
                display: "inline-block",
                paddingBottom: "4px",
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: "0",
          left: `${underlineState.left}px`,
          width: `${underlineState.width}px`,
          height: "2px",
          borderRadius: "999px",
          backgroundColor: "white",
          opacity: underlineState.visible ? 1 : 0,
          pointerEvents: "none",
          willChange: "left, width, opacity",
          transition: underlineState.animate
            ? "left 520ms cubic-bezier(0.22, 0.88, 0.18, 1), width 520ms cubic-bezier(0.22, 0.88, 0.18, 1), opacity 140ms ease"
            : "none",
        }}
      />
    </nav>
  );
}
