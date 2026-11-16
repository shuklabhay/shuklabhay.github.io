import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { contactData, getContactLink } from "../utils/contactData";

export default function About(): JSX.Element {
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
    <main className="about-page route-page-about">
      <PageTitle
        title="Hi, I'm Abhay"
        subtitle={
          <div className="about-subtitle">
            <p className="about-list-intro">I've previously:</p>
            <ul>
              <li>
                Collected{" "}
                <a
                  href="https://condu.it/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-contact-link"
                >
                  neural data
                </a>
                , trained thought {"->"} action models
              </li>
              <li>
                Made <code>gemini-2.0-pro</code>{" "}
                <a
                  href="/static/sitedata/vt_poster.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-contact-link"
                >
                  translate songs
                </a>
                /
                <a
                  href="https://www.youtube.com/@translateanyaudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-contact-link"
                >
                  run a yt channel
                </a>
              </li>
              <li>
                Built simulations of{" "}
                <a
                  href="https://computationalmedicine.stanford.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-contact-link"
                >
                  breast &amp; lung tissue
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/shuklabhay/dtblkfx-osx-recompiled"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-contact-link"
                >
                  Decompiled audio plugins
                </a>
                , taught kids 2{" "}
                <a
                  href="https://bayareastemacademy.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-contact-link"
                >
                  vibecode
                </a>
              </li>
            </ul>
            <p className="about-list-intro about-section-start">I like:</p>
            <ul>
              <li>Making &amp; breaking things</li>
              <li>Understanding things</li>
              <li>Noticing things</li>
            </ul>
            <p>
              I want to become (at least rudimentarily) good at everything:)
            </p>
            <p id="contact" className="about-links about-section-start">
              <a href={email} className="about-contact-link">
                Email
              </a>{" "}
              |{" "}
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-link"
              >
                Twitter
              </a>{" "}
              |{" "}
              <a
                href={youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-link"
              >
                YouTube
              </a>{" "}
              |{" "}
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-link"
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
