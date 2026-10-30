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

let activeRouteTransitionId = 0;

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
  const shouldSkipTransition = [
    "(prefers-reduced-motion: reduce)",
    "(pointer: coarse)",
    "(hover: none)",
  ].some((query) => window.matchMedia?.(query).matches === true);

  const update = () => {
    flushSync(() => navigate(to, options));
    window.scrollTo(0, 0);
  };

  if (shouldSkipTransition) {
    update();
    return;
  }

  const transitionId = ++activeRouteTransitionId;
  root.dataset.routeTransition = kind;
  root.dataset.routeDirection = toDepth >= fromDepth ? "forward" : "back";
  const finished = runWithRootViewTransition(update);
  const clear = () => {
    if (transitionId !== activeRouteTransitionId) return;
    delete root.dataset.routeTransition;
    delete root.dataset.routeDirection;
  };
  if (finished) {
    finished.then(clear, clear);
  } else {
    clear();
  }
}
