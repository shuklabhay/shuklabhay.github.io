import { flushSync } from "react-dom";
import type { NavigateFunction, NavigateOptions } from "react-router-dom";
import { runWithRootViewTransition } from "./viewTransitions";

export function isBlogPostPath(pathname: string) {
  return pathname.startsWith("/gallery/") && pathname !== "/gallery";
}

export function navigateWithRouteTransition(
  navigate: NavigateFunction,
  to: string,
  options?: NavigateOptions,
): void {
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

  runWithRootViewTransition(update);
}
