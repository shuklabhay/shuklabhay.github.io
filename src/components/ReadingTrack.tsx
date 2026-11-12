import { useEffect, useRef } from "react";

export default function ReadingTrack(): JSX.Element {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = (): void => {
      frame = 0;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        maxScroll > 0
          ? Math.min(1, Math.max(0, window.scrollY / maxScroll))
          : 0;
      trackRef.current?.style.setProperty("--read", `${progress * 100}%`);
    };
    const schedule = (): void => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return <div ref={trackRef} className="reading-track" aria-hidden />;
}
