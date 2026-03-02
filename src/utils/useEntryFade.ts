import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

const MOBILE_WIDTH_BREAKPOINT = 860;

function queryBooleanMedia(query: string): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(query).matches;
}

export function shouldSkipEntryAnimation() {
  if (typeof window === "undefined") return false;

  if (queryBooleanMedia("(prefers-reduced-motion: reduce)")) return true;
  if (queryBooleanMedia("(prefers-reduced-transparency: reduce)")) return true;

  const isTouchDevice =
    queryBooleanMedia("(pointer: coarse)") ||
    queryBooleanMedia("(hover: none)") ||
    queryBooleanMedia("(any-pointer: coarse)") ||
    ("ontouchstart" in window) ||
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
