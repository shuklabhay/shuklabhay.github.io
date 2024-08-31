export function scrollViewportTo(scrollPosition: number) {
  window.scrollTo({
    top: scrollPosition,
    behavior: "smooth",
  });
}

export function calculateScrollProgressOpacity(
  goalPosition: number,
  scale = 1.5,
) {
  const scrollTop = window.scrollY;
  return 1 - Math.min(scale * (scrollTop / goalPosition), 1);
}
