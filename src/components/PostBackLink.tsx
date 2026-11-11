import { useLocation, useNavigate } from "react-router-dom";
import type { MouseEvent as ReactMouseEvent } from "react";
import TransitionLink from "./TransitionLink";
import { currentHistoryIndex, pathAt } from "../utils/navigationMemory";
import type { RouteTransitionState } from "../utils/types";

const BACK_LABELS: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/gallery": "gallery",
};

export default function PostBackLink(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const transitionState = location.state as RouteTransitionState | null;
  const backTargetPath = transitionState?.fromPath ?? "/gallery";
  const label = BACK_LABELS[backTargetPath] ?? "back";

  const onClick = (event: ReactMouseEvent<HTMLAnchorElement>): void => {
    if (event.button !== 0) return;
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return;
    }
    const index = currentHistoryIndex();
    if (index === null || index === 0) return;
    if (pathAt(index - 1) !== backTargetPath) return;
    event.preventDefault();
    navigate(-1);
  };

  return (
    <div className="post-header-row">
      <TransitionLink
        to={backTargetPath}
        className="post-back-link"
        onClick={onClick}
      >
        ← {label}
      </TransitionLink>
    </div>
  );
}
