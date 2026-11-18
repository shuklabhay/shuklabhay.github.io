import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { contactData, getContactLink } from "../utils/contactData";

export default function Bio(): JSX.Element {
  const rawEmail = getContactLink(contactData, "Email");
  const email = rawEmail ? `mailto:${rawEmail}` : undefined;
  const twitter = getContactLink(contactData, "Twitter");
  const youtube = getContactLink(contactData, "YouTube");
  const github = getContactLink(contactData, "GitHub");
  const location = useLocation();

  useEffect(() => {
    if (location.hash !== "#contact") return;
    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById("contact")
        ?.scrollIntoView({ block: "center", behavior: "instant" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.key]);

  return (
    <main className="bio-page route-page-bio">
      <PageTitle
        title="Hi, I'm Abhay"
        subtitle={
          <div className="bio-subtitle">
            <p>I want to become (at least rudimentarily) good at everything!</p>
            <p className="bio-list-intro">I've previously:</p>
            <ul>
              <li>
                Collected{" "}
                <a
                  href="https://condu.it/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bio-contact-link"
                >
                  neural data
                </a>
                , trained thought {"->"} action models
              </li>
              <li>
                Built physics sims for{" "}
                <a
                  href="https://computationalmedicine.stanford.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bio-contact-link"
                >
                  breast+lung tissue augmentations
                </a>
              </li>
              <li>
                Made <code>gemini-2.0-pro</code>{" "}
                <a
                  href="/static/sitedata/vt_poster.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bio-contact-link"
                >
                  translate songs
                </a>
                /
                <a
                  href="https://www.youtube.com/@translateanyaudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bio-contact-link"
                >
                  run a yt channel
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/shuklabhay/dtblkfx-osx-recompiled"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bio-contact-link"
                >
                  Decompiled audio plugins
                </a>
                ,{" "}
                <a
                  href="https://www.youtube.com/@01shuklabhay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bio-contact-link"
                >
                  produced music
                </a>
                , helped kids{" "}
                <a
                  href="https://bayareastemacademy.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bio-contact-link"
                >
                  vibecode
                </a>
              </li>
            </ul>
            <p className="bio-list-intro bio-section-start">I like:</p>
            <ul>
              <li>Making things</li>
              <li>Breaking things</li>
              <li>Understanding things</li>
              <li>Noticing things</li>
              <li>Texture</li>
              <li>Aesthetics</li>
              <li>Intensity</li>
              <li>Balance</li>
            </ul>
            <p id="contact" className="bio-links bio-section-start">
              <a href={email} className="bio-contact-link">
                Email
              </a>{" "}
              |{" "}
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bio-contact-link"
              >
                Twitter
              </a>{" "}
              |{" "}
              <a
                href={youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="bio-contact-link"
              >
                YouTube
              </a>{" "}
              |{" "}
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="bio-contact-link"
              >
                GitHub
              </a>
            </p>
          </div>
        }
      />
    </main>
  );
}
