import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

export function useEntryFade(
  shouldAnimate: boolean,
  durationMs: number,
): CSSProperties {
  const [isVisible, setIsVisible] = useState(!shouldAnimate);

  useEffect(() => {
    if (!shouldAnimate) {
      setIsVisible(true);
      return;
    }

    setIsVisible(false);
    const frameId = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [shouldAnimate]);

  return useMemo(
    () => ({
      opacity: isVisible ? 1 : 0,
      transform: "none",
      transition: shouldAnimate ? `opacity ${durationMs}ms ease` : "none",
    }),
    [durationMs, isVisible, shouldAnimate],
  );
}
