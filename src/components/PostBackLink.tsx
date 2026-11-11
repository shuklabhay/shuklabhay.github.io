import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import TransitionLink from "./TransitionLink";
import type { RouteTransitionState } from "../utils/types";

type PostBackLinkProps = {
  trailing?: ReactNode;
};

export default function PostBackLink({
  trailing,
}: PostBackLinkProps): JSX.Element {
  const location = useLocation();
  const transitionState = location.state as RouteTransitionState | null;
  const backTargetPath = transitionState?.fromPath ?? "/gallery";
  return (
    <div className="post-header-row">
      <TransitionLink to={backTargetPath} className="post-back-link">
        ← back
      </TransitionLink>
      {trailing}
    </div>
  );
}
