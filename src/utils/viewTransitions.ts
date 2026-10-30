import type { ViewTransitionDocument } from "./types";

export function canRunRootViewTransition(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof (document as ViewTransitionDocument).startViewTransition ===
      "function"
  );
}

export function runWithRootViewTransition(
  update: () => void,
): Promise<void> | null {
  const doc = document as ViewTransitionDocument;
  if (canRunRootViewTransition() && doc.startViewTransition) {
    const transition = doc.startViewTransition(update);
    transition.ready.catch(() => undefined);
    return transition.finished;
  }
  update();
  return null;
}
