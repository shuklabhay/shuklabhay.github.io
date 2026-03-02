import { useRef } from "react";
import { useLocation } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { useEntryFade } from "../utils/useEntryFade";
import { getLastPathname, isBlogPostPath } from "../utils/routeTransitions";
import type { RouteTransitionState } from "../utils/types";

export default function About() {
  const location = useLocation();
  const transitionState = location.state as RouteTransitionState | null;
  const entryFadeDecisionByLocationKeyRef = useRef<{
    key: string;
    shouldAnimate: boolean;
  } | null>(null);

  if (entryFadeDecisionByLocationKeyRef.current?.key !== location.key) {
    const lastPathname = getLastPathname();
    entryFadeDecisionByLocationKeyRef.current = {
      key: location.key,
      shouldAnimate:
        transitionState?.fromTopNav === true ||
        transitionState?.fromPost === true ||
        (lastPathname ? isBlogPostPath(lastPathname) : false),
    };
  }

  const shouldAnimateEntry =
    entryFadeDecisionByLocationKeyRef.current?.shouldAnimate ?? false;
  const entryFadeStyle = useEntryFade(shouldAnimateEntry, 525);

  return (
    <main
      style={{
        ...entryFadeStyle,
        paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
      }}
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
