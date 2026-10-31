import { flushSync } from "react-dom";
import type { NavigateFunction, NavigateOptions } from "react-router-dom";
import { runWithRootViewTransition } from "./viewTransitions";

export function isBlogPostPath(pathname: string) {
  return pathname.startsWith("/gallery/") && pathname !== "/gallery";
}

let activeTransitionId = 0;

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

  const rootEl = document.documentElement;
  const isHomeTransition =
    rootEl.classList.contains("route-home") || to === "/" || to === "/contact";
  rootEl.classList.toggle("home-transition", isHomeTransition);

  const transitionId = ++activeTransitionId;
  const clearHomeTransition = (): void => {
    if (transitionId === activeTransitionId) {
      rootEl.classList.remove("home-transition");
    }
  };
  runWithRootViewTransition(update)?.then(
    clearHomeTransition,
    clearHomeTransition,
  );
}
