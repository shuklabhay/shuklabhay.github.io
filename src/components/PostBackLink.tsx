import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import TransitionLink from "./TransitionLink";
import TriangleIcon from "./TriangleIcon";
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
        <span aria-hidden className="post-back-icon">
          <TriangleIcon direction="left" size="100%" />
        </span>
        back
      </TransitionLink>
      {trailing}
    </div>
  );
}
