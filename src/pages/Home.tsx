import { useRef } from "react";
import { useLocation } from "react-router-dom";
import PageTitle, { CheckboxSubtitleLink } from "../components/PageTitle";
import { contactData, getContactLink } from "../utils/contactData";
import { shouldSkipEntryAnimation, useEntryFade } from "../utils/useEntryFade";
import { getLastPathname, isBlogPostPath } from "../utils/routeTransitions";
import type { RouteTransitionState } from "../utils/types";

export default function Home(): JSX.Element {
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
    (entryFadeDecisionByLocationKeyRef.current?.shouldAnimate ?? false) &&
    !shouldSkipEntryAnimation() &&
    !(
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
    );
  const entryFadeStyle = useEntryFade(shouldAnimateEntry, 525);

  const rawEmail = getContactLink(contactData, "Email");
  const email = rawEmail ? `mailto:${rawEmail}` : undefined;
  const github = getContactLink(contactData, "GitHub");
  const linkedin = getContactLink(contactData, "Linkedin");

  return (
    <main
      style={{
        ...entryFadeStyle,
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <PageTitle
        title="Hi, I'm Abhay"
        subtitle={
          <CheckboxSubtitleLink
            hoverFill
            items={[
              { label: "Email", href: email },
              { label: "GitHub", href: github },
              { label: "LinkedIn", href: linkedin },
            ]}
          />
        }
      />
    </main>
  );
}
