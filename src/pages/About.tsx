import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { shouldSkipEntryAnimation, useEntryFade } from "../utils/useEntryFade";
import { getLastPathname, isBlogPostPath } from "../utils/routeTransitions";
import type { ContactInfo, RouteTransitionState } from "../utils/types";

const contactPromise = fetch("/static/sitedata/contact.json").then((res) =>
  res.json(),
);

export default function About() {
  const location = useLocation();
  const transitionState = location.state as RouteTransitionState | null;
  const entryFadeDecisionByLocationKeyRef = useRef<{
    key: string;
    shouldAnimate: boolean;
  } | null>(null);
  const [contactData, setContactData] = useState<ContactInfo[]>([]);

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
  useEffect(() => {
    contactPromise
      .then((data) => setContactData(data))
      .catch((err) => console.error("Failed to load contact data:", err));
  }, []);

  const rawEmail = contactData.find((c) => c.title === "Email")?.link;
  const email = rawEmail ? `mailto:${rawEmail}` : undefined;
  const twitter = contactData.find((c) => c.title === "Twitter")?.link;

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
              maxWidth: "100%",
              lineHeight: 1.6,
              marginTop: "0.5rem",
              fontSize: "1.1rem",
            }}
          >
            <p style={{ marginTop: 0, marginBottom: "1rem" }}>
              I've been <strong>experimenting with computers</strong> since I
              was 9: first making games, later (at 12){" "}
              <strong>producing music,</strong> programming audio effects, and{" "}
              building synthesizers, <strong>all self-taught</strong>. Nowadays,
              as a <strong>senior @ Leland High School,</strong> I've been using{" "}
              <strong>machine learning </strong> to do interesting, imaginative
              things. For example, I've:
            </p>
            <ul style={{ marginTop: 0, paddingLeft: "1.25rem" }}>
              <li>
                Combined ViTs & PDEs to{" "}
                <strong>simulate biological tissue</strong> and generate{" "}
                <strong>synthetic medical imagery</strong>
                at Stanford
              </li>
              <li>
                Worked with <strong>Prime Intellect,</strong> building{" "}
                <strong>RL environments</strong> and fine-tuning small LLMs
              </li>
              <li>
                Built <strong>multimodal agents</strong> to{" "}
                <strong>translate music</strong> while preserving musicality,
                reaching <strong>1M+ listeners</strong>
              </li>
              <li>
                <strong>Simulated rat neurons</strong> at UCLA; trained{" "}
                <strong>CNN-based world models</strong> on my own
              </li>
            </ul>
            <p style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              I'm primarily <strong>motivated by/curious about:</strong>
            </p>
            <ul style={{ marginTop: 0, paddingLeft: "1.25rem" }}>
              <li>
                Understanding the <strong>incomplete and the unknown, </strong>
                regardless of field or form: I dive deep into questions across{" "}
                biology, psychology, physics, history.
              </li>
              <li>
                <strong>Craft:</strong> I grew up learning to row, caring deeply
                about every element of every thing I work on, though more
                recently I've been learning to steer.
              </li>
              <li>
                <strong>Thinking</strong>, dreaming, imagining,{" "}
                <strong>
                  following intuition, listening and telling stories.
                </strong>
              </li>
              <li>
                How we <strong>perceive, interpret, and understand</strong> the
                world; the boundary between what we can feel and formalize.
              </li>
              <li>
                <strong>Technically:</strong> the new primitives machine
                learning makes possible. <strong>Philosophically:</strong> what
                we learn about ourselves, our world, and the nature of
                intelligence when we teach machines to perceive &amp; interact
                with the world.
              </li>
              <li>
                <strong>Being human:</strong> living life, making mistakes,
                making memories, learning to understand and appreciate oneself.
              </li>
            </ul>
            <p style={{ marginTop: "1.5rem", marginBottom: 0 }}>
              My <strong>resume</strong> is available here, and I’m reachable
              via{" "}
              <a href={email} className="about-contact-link">
                <strong>email</strong>
              </a>{" "}
              or{" "}
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-link"
              >
                <strong>Twitter/X</strong>
              </a>
              .
            </p>
          </div>
        }
      />
    </main>
  );
}
