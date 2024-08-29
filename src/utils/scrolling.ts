function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

export function scrollViewportTo(
  targetScrollPosition: number,
  setScrollProgress: React.Dispatch<React.SetStateAction<number>>,
) {
  const duration = 2000;
  const startScrollPosition = window.scrollY;
  const distance = targetScrollPosition - startScrollPosition;
  let startTime: number | null = null;

  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollableDistance = documentHeight - windowHeight;

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;

    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const newScrollPosition =
      startScrollPosition + distance * easeInOutCubic(progress);

    const clampedScrollPosition = Math.max(
      0,
      Math.min(newScrollPosition, scrollableDistance),
    );

    // Update the scroll progress immediately
    const newProgress = Math.min(
      (clampedScrollPosition / scrollableDistance) * 100,
      100,
    );
    setScrollProgress(newProgress);

    window.scrollTo(0, clampedScrollPosition);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, targetScrollPosition);

      const finalProgress = Math.min(
        (targetScrollPosition / scrollableDistance) * 100,
        100,
      );
      setScrollProgress(finalProgress);
    }
  }

  requestAnimationFrame(animation);
}

export function calculateScrollProgressOpacity(
  goalPosition: number,
  scale = 1.5,
) {
  const scrollTop = window.scrollY;
  return 1 - Math.min(scale * (scrollTop / goalPosition), 1);
}
