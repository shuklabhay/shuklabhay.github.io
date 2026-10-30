import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useLocation } from "react-router-dom";
import { getLastPathname, isBlogPostPath } from "./routeTransitions";
import { canRunRootViewTransition } from "./viewTransitions";
import type { RouteTransitionState } from "./types";

const MOBILE_WIDTH_BREAKPOINT = 860;

function queryBooleanMedia(query: string): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(query).matches;
}

export function shouldSkipEntryAnimation(): boolean {
  if (typeof window === "undefined") return false;

  if (queryBooleanMedia("(prefers-reduced-motion: reduce)")) return true;
  if (queryBooleanMedia("(prefers-reduced-transparency: reduce)")) return true;

  const isTouchDevice =
    queryBooleanMedia("(pointer: coarse)") ||
    queryBooleanMedia("(hover: none)") ||
    queryBooleanMedia("(any-pointer: coarse)") ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;
  if (isTouchDevice) return true;

  return window.innerWidth <= MOBILE_WIDTH_BREAKPOINT;
}

export function useEntryFade(
  shouldAnimate: boolean,
  durationMs: number,
): CSSProperties {
  const shouldDisableEntryAnimation = shouldSkipEntryAnimation();
  const effectiveShouldAnimate = shouldAnimate && !shouldDisableEntryAnimation;
  const [isVisible, setIsVisible] = useState(!effectiveShouldAnimate);

  useEffect(() => {
    if (!effectiveShouldAnimate) {
      setIsVisible(true);
      return;
    }

    setIsVisible(false);
    const frameId = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [effectiveShouldAnimate]);

  return useMemo(
    () => ({
      opacity: isVisible ? 1 : 0,
      transform: "none",
      transition: effectiveShouldAnimate
        ? `opacity ${durationMs}ms ease`
        : "none",
    }),
    [durationMs, isVisible, effectiveShouldAnimate],
  );
}

export function useRouteEntryFade(durationMs: number): CSSProperties {
  const location = useLocation();
  const transitionState = location.state as RouteTransitionState | null;
  const decisionRef = useRef<{ key: string; shouldAnimate: boolean } | null>(
    null,
  );

  if (decisionRef.current?.key !== location.key) {
    const lastPathname = getLastPathname();
    decisionRef.current = {
      key: location.key,
      shouldAnimate:
        transitionState?.fromTopNav === true ||
        transitionState?.fromPost === true ||
        (lastPathname ? isBlogPostPath(lastPathname) : false),
    };
  }

  return useEntryFade(
    decisionRef.current.shouldAnimate && !canRunRootViewTransition(),
    durationMs,
  );
}
