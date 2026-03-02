import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

export function useEntryFade(
  shouldAnimate: boolean,
  durationMs: number,
): CSSProperties {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  const effectiveShouldAnimate = shouldAnimate && !prefersReducedMotion;
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
