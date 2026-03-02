import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PageTitle, { CheckboxSubtitle } from "../components/PageTitle";
import { useEntryFade } from "../utils/useEntryFade";
import { getLastPathname, isBlogPostPath } from "../utils/routeTransitions";
import type { ContactInfo, RouteTransitionState } from "../utils/types";

const contactPromise = fetch("/static/sitedata/contact.json").then((res) =>
  res.json(),
);

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
        transitionState?.fromPost === true ||
        (lastPathname ? isBlogPostPath(lastPathname) : false),
    };
  }

  const shouldAnimateEntry =
    entryFadeDecisionByLocationKeyRef.current?.shouldAnimate ?? false;
  const entryFadeStyle = useEntryFade(shouldAnimateEntry, 525);
  const [contactData, setContactData] = useState<ContactInfo[]>([]);

  useEffect(() => {
    contactPromise
      .then((data) => setContactData(data))
      .catch((err) => console.error("Failed to load contact data:", err));
  }, []);

  const rawEmail = contactData.find((c) => c.title === "Email")?.link;
  const email = rawEmail ? `mailto:${rawEmail}` : undefined;
  const github = contactData.find((c) => c.title === "GitHub")?.link;
  const linkedin = contactData.find((c) => c.title === "Linkedin")?.link;

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
          <CheckboxSubtitle
            mode="link"
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
