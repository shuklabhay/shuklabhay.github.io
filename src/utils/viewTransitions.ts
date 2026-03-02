import type { ViewTransitionDocument } from "./types";

export function runWithRootViewTransition(update: () => void) {
  const doc = document as ViewTransitionDocument;
  if (typeof doc.startViewTransition === "function") {
    doc.startViewTransition(update);
    return;
  }
  update();
}
