import { useLocation } from "react-router-dom";
import TransitionLink from "./TransitionLink";
import type { RouteTransitionState } from "../utils/types";

export default function PostBackLink(): JSX.Element {
  const location = useLocation();
  const transitionState = location.state as RouteTransitionState | null;
  const backTargetPath = transitionState?.fromPath ?? "/gallery";
  return (
    <div className="post-header-row">
      <TransitionLink to={backTargetPath} className="post-back-link">
        ← back
      </TransitionLink>
    </div>
  );
}
