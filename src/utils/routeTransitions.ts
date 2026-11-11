import { flushSync } from "react-dom";
import type { NavigateFunction, NavigateOptions } from "react-router-dom";
import {
  canRunRootViewTransition,
  runWithRootViewTransition,
} from "./viewTransitions";
import { rememberCurrentPlace } from "./navigationMemory";

export function isBlogPostPath(pathname: string) {
  return pathname.startsWith("/gallery/") && pathname !== "/gallery";
}

export function restoresScrollOnReturn(pathname: string): boolean {
  return !isBlogPostPath(pathname);
}

const SKIP_TRANSITION_QUERIES = [
  "(prefers-reduced-motion: reduce)",
  "(pointer: coarse)",
  "(hover: none)",
];

function shouldAnimate(): boolean {
  return (
    canRunRootViewTransition() &&
    !SKIP_TRANSITION_QUERIES.some(
      (query) => window.matchMedia?.(query).matches === true,
    )
  );
}

function runRouteTransition(update: () => void): void {
  if (!shouldAnimate()) {
    update();
    return;
  }
  runWithRootViewTransition(update);
}

export function navigateWithRouteTransition(
  navigate: NavigateFunction,
  to: string,
  options?: NavigateOptions,
): void {
  rememberCurrentPlace();
  runRouteTransition(() => {
    flushSync(() => navigate(to, options));
  });
}

export function animateHistoryNavigations(): () => void {
  let isReplaying = false;

  const onPopState = (event: PopStateEvent): void => {
    if (isReplaying) return;
    rememberCurrentPlace();
    if (!shouldAnimate()) return;
    event.stopImmediatePropagation();

    runRouteTransition(() => {
      isReplaying = true;
      try {
        flushSync(() => {
          window.dispatchEvent(
            new PopStateEvent("popstate", { state: window.history.state }),
          );
        });
      } finally {
        isReplaying = false;
      }
    });
  };

  window.addEventListener("popstate", onPopState, true);
  return () => window.removeEventListener("popstate", onPopState, true);
}
