import type { ViewTransitionDocument } from "./types";

export function canRunRootViewTransition(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof (document as ViewTransitionDocument).startViewTransition ===
      "function"
  );
}

function findLinkAt(x: number, y: number): HTMLAnchorElement | null {
  const links = document.querySelectorAll<HTMLAnchorElement>("a[href]");
  for (const link of links) {
    for (const rect of link.getClientRects()) {
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        return link;
      }
    }
  }
  return null;
}

function forwardInputDuring(transition: {
  finished: Promise<void>;
  skipTransition?: () => void;
}): void {
  const rootEl = document.documentElement;
  let pendingClick: { x: number; y: number } | null = null;

  const onMouseMove = (event: MouseEvent): void => {
    rootEl.style.cursor = findLinkAt(event.clientX, event.clientY)
      ? "pointer"
      : "";
  };
  const onClick = (event: MouseEvent): void => {
    if (event.target !== rootEl) return;
    if (event.button !== 0) return;
    if (!findLinkAt(event.clientX, event.clientY)) return;
    event.preventDefault();
    event.stopPropagation();
    pendingClick = { x: event.clientX, y: event.clientY };
    transition.skipTransition?.();
  };

  window.addEventListener("mousemove", onMouseMove, true);
  window.addEventListener("click", onClick, true);

  const cleanUp = (): void => {
    window.removeEventListener("mousemove", onMouseMove, true);
    window.removeEventListener("click", onClick, true);
    rootEl.style.cursor = "";
    if (!pendingClick) return;
    const { x, y } = pendingClick;
    pendingClick = null;
    window.requestAnimationFrame(() => findLinkAt(x, y)?.click());
  };
  transition.finished.then(cleanUp, cleanUp);
}

export function runWithRootViewTransition(
  update: () => void,
): Promise<void> | null {
  const doc = document as ViewTransitionDocument;
  if (canRunRootViewTransition() && doc.startViewTransition) {
    const transition = doc.startViewTransition(update);
    transition.ready.catch(() => undefined);
    forwardInputDuring(transition);
    return transition.finished;
  }
  update();
  return null;
}
