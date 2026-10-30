import { flushSync } from "react-dom";
import type { NavigateFunction, NavigateOptions } from "react-router-dom";
import type { RouteTransitionKind } from "./types";
import { runWithRootViewTransition } from "./viewTransitions";

const LAST_PATHNAME_KEY = "route-last-pathname";

export function isBlogPostPath(pathname: string) {
  return pathname.startsWith("/gallery/") && pathname !== "/gallery";
}

export function getLastPathname() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(LAST_PATHNAME_KEY);
}

export function setLastPathname(pathname: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(LAST_PATHNAME_KEY, pathname);
}

export function getRouteDepth(pathname: string): number {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/" || normalized === "/contact") return 0;
  if (normalized === "/about") return 1;
  if (normalized === "/gallery") return 2;
  if (isBlogPostPath(normalized)) return 3;
  return 1;
}

export function navigateWithRouteTransition(
  navigate: NavigateFunction,
  fromPathname: string,
  to: string,
  options?: NavigateOptions,
): void {
  const fromDepth = getRouteDepth(fromPathname);
  const toDepth = getRouteDepth(to.split(/[?#]/)[0] ?? to);
  const kind: RouteTransitionKind =
    fromDepth === 0 || toDepth === 0 ? "dissolve" : "stack";
  const root = document.documentElement;
  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

  const update = () => {
    flushSync(() => navigate(to, options));
    window.scrollTo(0, 0);
  };

  if (prefersReducedMotion) {
    update();
    return;
  }

  root.dataset.routeTransition = kind;
  root.dataset.routeDirection = toDepth >= fromDepth ? "forward" : "back";
  const finished = runWithRootViewTransition(update);
  const clear = () => {
    delete root.dataset.routeTransition;
    delete root.dataset.routeDirection;
  };
  if (finished) {
    finished.then(clear, clear);
  } else {
    clear();
  }
}
