import { flushSync } from "react-dom";
import type { NavigateFunction, NavigateOptions } from "react-router-dom";
import {
  canRunRootViewTransition,
  runWithRootViewTransition,
} from "./viewTransitions";
import {
  currentHistoryKey,
  recallScroll,
  rememberCurrentScroll,
} from "./navigationMemory";

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

let activeTransitionId = 0;

function shouldAnimate(): boolean {
  return (
    canRunRootViewTransition() &&
    !SKIP_TRANSITION_QUERIES.some(
      (query) => window.matchMedia?.(query).matches === true,
    )
  );
}

function runRouteTransition(
  toPath: string,
  landsAtTop: boolean,
  update: () => void,
): void {
  if (!shouldAnimate()) {
    update();
    return;
  }

  const rootEl = document.documentElement;
  const isLeavingHome = rootEl.classList.contains("route-home");
  const isEnteringHome = !isLeavingHome && toPath === "/";
  const isAtTop = window.scrollY < 1;
  rootEl.classList.toggle("home-rise", isLeavingHome && landsAtTop);
  rootEl.classList.toggle("home-fall", isEnteringHome && isAtTop);

  const transitionId = ++activeTransitionId;
  const clearHomeTransition = (): void => {
    if (transitionId === activeTransitionId) {
      rootEl.classList.remove("home-rise", "home-fall");
    }
  };
  runWithRootViewTransition(update)?.then(
    clearHomeTransition,
    clearHomeTransition,
  );
}

export function navigateWithRouteTransition(
  navigate: NavigateFunction,
  to: string,
  options?: NavigateOptions,
): void {
  rememberCurrentScroll();
  runRouteTransition(to, true, () => {
    flushSync(() => navigate(to, options));
  });
}

export function animateHistoryNavigations(): () => void {
  let isReplaying = false;

  const onPopState = (event: PopStateEvent): void => {
    if (isReplaying) return;
    rememberCurrentScroll();
    if (!shouldAnimate()) return;
    event.stopImmediatePropagation();

    const toPath = window.location.pathname;
    const landsAtTop =
      !restoresScrollOnReturn(toPath) || recallScroll(currentHistoryKey()) < 1;

    runRouteTransition(toPath, landsAtTop, () => {
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
