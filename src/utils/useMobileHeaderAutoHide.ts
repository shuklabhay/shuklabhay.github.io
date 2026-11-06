import { useEffect } from "react";

const HIDDEN_CLASS = "mobile-header-hidden";
const MOBILE_QUERY = "(max-width: 860px)";
const SHOW_DELTA_PX = 8;
const HIDE_DELTA_PX = 4;
const MIN_HIDE_SCROLL_PX = 96;

export function useMobileHeaderAutoHide(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const rootEl = document.documentElement;
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    let anchorY = window.scrollY;
    let frame = 0;

    const setHidden = (hidden: boolean) => {
      rootEl.classList.toggle(HIDDEN_CLASS, hidden);
    };

    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);

      if (!mediaQuery.matches || y < MIN_HIDE_SCROLL_PX) {
        setHidden(false);
        anchorY = y;
        return;
      }

      const isHidden = rootEl.classList.contains(HIDDEN_CLASS);
      if (y > anchorY) {
        if (!isHidden && y - anchorY > HIDE_DELTA_PX) setHidden(true);
        if (isHidden) anchorY = y;
        else if (y - anchorY > HIDE_DELTA_PX) anchorY = y;
        return;
      }

      if (isHidden && anchorY - y > SHOW_DELTA_PX) {
        setHidden(false);
        anchorY = y;
        return;
      }
      if (!isHidden) anchorY = y;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    mediaQuery.addEventListener("change", update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      mediaQuery.removeEventListener("change", update);
      setHidden(false);
    };
  }, []);
}
