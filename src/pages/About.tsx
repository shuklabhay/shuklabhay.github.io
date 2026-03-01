import PageTitle from "../components/PageTitle";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import type { RouteTransitionState } from "../utils/types";

const POST_RETURN_FLAG_KEY = "route-from-post-return";

function consumePostReturnFlag() {
  if (typeof window === "undefined") return false;
  const hasFlag = window.sessionStorage.getItem(POST_RETURN_FLAG_KEY) === "1";
  if (hasFlag) {
    window.sessionStorage.removeItem(POST_RETURN_FLAG_KEY);
  }
  return hasFlag;
}

export default function About() {
  const location = useLocation();
  const transitionState = location.state as RouteTransitionState | null;
  const [fromPostReturnFlag] = useState<boolean>(consumePostReturnFlag);
  const shouldAnimateSurfaceEntry =
    transitionState?.fromPost === true || fromPostReturnFlag;

  return (
    <main
      className={shouldAnimateSurfaceEntry ? "surface-page-return" : undefined}
    >
      <PageTitle
        title="Hi, I'm Abhay"
        subtitle={
          <div
            style={{
              color: "white",
              maxWidth: "48rem",
              lineHeight: 1.6,
              marginTop: "0.5rem",
              fontSize: "1.1rem",
            }}
          >
            <p style={{ marginTop: 0, marginBottom: "1rem" }}>
              I'm building cool things and keeping this page simple for now.
            </p>
            <p style={{ marginTop: 0, marginBottom: "0.5rem" }}>
              Previously, I've done some cool stuff:
            </p>
            <ul style={{ marginTop: 0, paddingLeft: "1.25rem" }}>
              <li>Placeholder 1</li>
              <li>Placeholder 2</li>
              <li>Placeholder 3</li>
            </ul>
          </div>
        }
      />
    </main>
  );
}
