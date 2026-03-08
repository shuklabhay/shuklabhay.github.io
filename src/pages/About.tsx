import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const github = contactData.find((c) => c.title === "GitHub")?.link;

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
            className="about-subtitle"
            style={{
              color: "#f5f8ff",
              lineHeight: 1.6,
              marginTop: "0.5rem",
              fontSize: "1.1rem",
            }}
          >
            <p style={{ marginTop: 0, marginBottom: "1rem" }}>
              I've been <strong>manipulating computers</strong> since I was 9:
              first making games, later (at 12){" "}
              <strong>producing music,</strong> programming audio effects, and{" "}
              building synthesizers, <strong>all self-taught</strong>. Nowadays,
              as a <strong>senior @ Leland High School,</strong> I've been using{" "}
              <strong>machine learning </strong> to do{" "}
              <strong>interesting, imaginative things</strong>. For example,
              I've:
            </p>
            <ul
              style={{ marginTop: 0, paddingLeft: "1.25rem", lineHeight: 1.5 }}
            >
              <li>
                Combined ViTs & PDEs to{" "}
                <strong>simulate biological tissue</strong> and generate{" "}
                <strong>synthetic medical imagery</strong> at{" "}
                <a
                  href="https://postdocs.stanford.edu/stanford-departments/medicine-biomedical-informatics-research"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-contact-link"
                >
                  <strong>Stanford</strong>
                </a>
              </li>
              <li style={{ marginTop: "0.45rem" }}>
                Worked with <strong>Prime Intellect,</strong> building{" "}
                <a
                  href="https://app.primeintellect.ai/dashboard/environments"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-contact-link"
                >
                  <strong>RL Environments</strong>
                </a>{" "}
                and fine-tuning small LLMs
              </li>
              <li style={{ marginTop: "0.45rem" }}>
                Built{" "}
                <a
                  href="https://raw.githubusercontent.com/shuklabhay/shuklabhay.github.io/refs/heads/main/public/static/sitedata/vt_poster.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-contact-link"
                >
                  <strong>multimodal agents</strong>
                </a>{" "}
                to <strong>translate music</strong> while preserving musicality,{" "}
                <a
                  href="https://www.youtube.com/@translateanyaudio/shorts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-contact-link"
                >
                  <strong>reaching 1M+ listeners</strong>
                </a>
              </li>
              <li style={{ marginTop: "0.45rem" }}>
                <strong>Simulated rat neurons</strong> at UCLA; trained{" "}
                <Link
                  to="/blog/infinipaint"
                  viewTransition
                  state={{ fromBlog: true, fromPath: "/about" }}
                  className="about-contact-link"
                >
                  <strong>world models</strong>
                </Link>{" "}
                &{" "}
                <a
                  href="https://github.com/shuklabhay/percgan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-contact-link"
                >
                  <strong>music generators</strong>
                </a>{" "}
                on my own
              </li>
            </ul>
            <p style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              I'm primarily <strong>motivated by/curious about:</strong>
            </p>
            <ul
              style={{ marginTop: 0, paddingLeft: "1.25rem", lineHeight: 1.5 }}
            >
              <li>
                Understanding the <strong>incomplete and the unknown, </strong>
                regardless of field or form. Incessantly, I pursue the edges of
                my understanding across biology, psychology, physics, history.
              </li>
              <li style={{ marginTop: "0.45rem" }}>
                <strong>Craft:</strong> I grew up learning to row,{" "}
                <strong>
                  caring deeply about every element of every thing
                </strong>{" "}
                I work on, though more recently I've been learning to steer.
              </li>
              <li style={{ marginTop: "0.45rem" }}>
                How we <strong>perceive, interpret, and understand</strong> the
                world; the boundary between what we can feel and formalize.
              </li>
              <li style={{ marginTop: "0.45rem" }}>
                <strong>Thinking</strong>, dreaming, imagining,{" "}
                <strong>
                  following intuition, listening to and telling stories.
                </strong>
              </li>
              <li style={{ marginTop: "0.45rem" }}>
                <strong>Technically:</strong> the new primitives machine
                learning makes possible. <strong>Philosophically:</strong> what
                we learn about ourselves, our world, and the nature of
                intelligence when we teach machines to perceive &amp; interact
                with the world.
              </li>
              <li style={{ marginTop: "0.45rem" }}>
                <strong>Being human:</strong> living life, making mistakes,{" "}
                <strong>making memories,</strong> learning to understand and
                appreciate oneself.
              </li>
            </ul>
            <p
              style={{
                marginTop: "1.5rem",
                marginBottom: 0,
                paddingBottom: "0.3rem",
              }}
            >
              <a
                href="https://docs.google.com/document/d/1AmxSqHyPKsZIAPha-v2eDTIGKNvpwcFVRLMoa6gTJuk/edit?tab=t.0"
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-link"
              >
                <strong>Resume</strong>
              </a>{" "}
              |{" "}
              <a href={email} className="about-contact-link">
                <strong>Email</strong>
              </a>{" "}
              |{" "}
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-link"
              >
                <strong>Twitter/X</strong>
              </a>{" "}
              |
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-link"
              >
                <strong>GitHub</strong>
              </a>
            </p>
          </div>
        }
      />
    </main>
  );
}
