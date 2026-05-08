import type { ViewTransitionDocument } from "./types";

export function canRunRootViewTransition(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof (document as ViewTransitionDocument).startViewTransition ===
      "function"
  );
}

export function runWithRootViewTransition(update: () => void): void {
  const doc = document as ViewTransitionDocument;
  if (canRunRootViewTransition()) {
    doc.startViewTransition(update);
    return;
  }
  update();
}
