import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PageTitle, { CheckboxSubtitleLink } from "../components/PageTitle";
import { contactPromise, getContactLink } from "../utils/contactData";
import { shouldSkipEntryAnimation, useEntryFade } from "../utils/useEntryFade";
import { getLastPathname, isBlogPostPath } from "../utils/routeTransitions";
import type { ContactInfo, RouteTransitionState } from "../utils/types";

export default function Home() {
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
  const [contactData, setContactData] = useState<ContactInfo[]>([]);

  useEffect(() => {
    contactPromise
      .then((data) => setContactData(data))
      .catch((err) => console.error("Failed to load contact data:", err));
  }, []);

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
