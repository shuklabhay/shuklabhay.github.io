import { Link, useLocation } from "react-router-dom";
import TriangleIcon from "./TriangleIcon";
import type { RouteTransitionState } from "../utils/types";

export default function PostBackLink(): JSX.Element {
  const location = useLocation();
  const transitionState = location.state as RouteTransitionState | null;
  const backTargetPath = transitionState?.fromPath ?? "/blog";
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        zIndex: 11,
        display: "flex",
        alignItems: "flex-start",
        paddingTop: "1rem",
        paddingBottom: "4px",
        pointerEvents: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
    >
      <Link
        to={backTargetPath}
        viewTransition={!prefersReducedMotion}
        state={{ fromPost: true }}
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "1.25rem",
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.26rem",
          lineHeight: 1,
          paddingBottom: "0.45rem",
          marginBottom: "-0.45rem",
          pointerEvents: "auto",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
          WebkitTapHighlightColor: "transparent",
          borderRadius: "0.2rem",
          padding: "0.2rem 0.3rem",
          marginInline: "-0.3rem",
        }}
        className="post-back-link"
      >
        <span
          aria-hidden
          style={{
            display: "inline-flex",
            width: "0.6em",
            height: "0.6em",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
            marginLeft: "-0.16em",
          }}
        >
          <TriangleIcon direction="left" size="100%" />
        </span>
        <span style={{ display: "inline-block", lineHeight: 1 }}>back</span>
      </Link>
    </div>
  );
}
