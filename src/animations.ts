import type { ViewTransitionDocument } from "./utils/types";

export function buildRootViewTransitionStyles(
  durationMs: number,
  easing: string,
) {
  return `
@keyframes app-root-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes app-root-hold {
  from { opacity: 1; }
  to { opacity: 1; }
}

::view-transition-group(root),
::view-transition-image-pair(root),
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation-duration: ${durationMs}ms;
  animation-timing-function: ${easing};
  animation-fill-mode: both;
}

::view-transition-old(root) {
  animation-name: app-root-hold;
  animation-duration: ${durationMs}ms;
  animation-timing-function: linear;
  animation-fill-mode: both;
}

::view-transition-new(root) {
  animation-name: app-root-fade-in;
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
  }
}
`;
}

export function runWithRootViewTransition(update: () => void) {
  const doc = document as ViewTransitionDocument;
  if (typeof doc.startViewTransition === "function") {
    doc.startViewTransition(update);
    return;
  }
  update();
}
