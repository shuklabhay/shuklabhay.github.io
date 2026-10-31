import TransitionLink from "../components/TransitionLink";
import PageTitle from "../components/PageTitle";
import { contactData, getContactLink } from "../utils/contactData";

export default function About(): JSX.Element {
  const rawEmail = getContactLink(contactData, "Email");
  const email = rawEmail ? `mailto:${rawEmail}` : undefined;
  const twitter = getContactLink(contactData, "Twitter");
  const youtube = getContactLink(contactData, "YouTube");
  const github = getContactLink(contactData, "GitHub");

  return (
    <main className="about-page route-page-about">
      <PageTitle
        title="Hi, I'm Abhay"
        subtitle={
          <div className="about-subtitle">
            <p>
              I've been manipulating computers since I was 9: making video
              games, producing many musical genres, programming audio effects,
              building circuits, training neural networks, designing webapps,
              and much more, almost entirely self-taught!
            </p>

            <p>
              I hope to spend my life doing interesting, imaginative things that
              have never been done before but are overwhelmingly worth doing,{" "}
              <TransitionLink
                to="/gallery/rcbi"
                state={{ fromPath: "/about" }}
                className="about-contact-link"
              >
                regardless of form or function.
              </TransitionLink>{" "}
            </p>

            <p className="about-list-intro">Previously I've:</p>
            <ul>
              <li>
                Trained{" "}
                <a
                  href="https://condu.it/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-contact-link"
                >
                  neural activity {"-->"} action
                </a>{" "}
                models (mind control computers, robotic arms, etc)
              </li>

              <li>
                Simulated breast/lung tissue and blood cell dynamics using PDEs
                & neural networks
              </li>

              <li>
                Built{" "}
                <a
                  href="/static/sitedata/vt_poster.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-contact-link"
                >
                  multimodal agents
                </a>{" "}
                to translate songs, and marketing agents to reach a million
                listeners
              </li>

              <li>
                (Rapid fire:) Simulated rodent neurons, post-trained language
                models, built/sold RL envs
              </li>

              <li>
                (In my youth:) Wrote code/apps for a FRC team; taught elementary
                schoolers{" "}
                <a
                  href="https://bayareastemacademy.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-contact-link"
                >
                  to vibecode
                </a>
              </li>
            </ul>
            <p className="about-list-intro about-section-start">
              I'm primarily motivated by/curious about:
            </p>
            <ul>
              <li>
                Analyzing systems, understanding the incomplete/unknown, and
                doing so regardless of field or form. I value finding common
                threads across far-flung ideas and building lasting,
                transferrable intuition.
              </li>
              <li>
                Rowing, caring about each and every element of each and every
                thing I work on, but also steering, zooming out and adjusting
                when pieces don't serve the whole.
              </li>
              <li>
                The fundamentally new possibilities associated with neural
                networks &amp; agents; the chance to better understand
                ourselves, our world, and the nature of intelligence as we teach
                machines to perceive and interact with the world.
              </li>
              <li>
                Being human: living life, making mistake/memories, facing fears,
                learning to understand and appreciate oneself. I believe it's
                incredibly important to understand one's self &amp; goals, then{" "}
                push past every superficial barrier.
              </li>
              <li>
                Thinking, dreaming, listening, imagining; understanding and
                telling stories.
              </li>
            </ul>
            <p className="about-links about-section-start">
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
