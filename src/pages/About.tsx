import TransitionLink from "../components/TransitionLink";
import PageTitle from "../components/PageTitle";
import { contactData, getContactLink } from "../utils/contactData";
import { useRouteEntryFade } from "../utils/useEntryFade";

export default function About(): JSX.Element {
  const entryFadeStyle = useRouteEntryFade(450);

  const rawEmail = getContactLink(contactData, "Email");
  const email = rawEmail ? `mailto:${rawEmail}` : undefined;
  const twitter = getContactLink(contactData, "Twitter");
  const youtube = getContactLink(contactData, "YouTube");
  const github = getContactLink(contactData, "GitHub");

  return (
    <main className="about-page route-page" style={entryFadeStyle}>
      <PageTitle
        title="Hi, I'm Abhay"
        subtitle={
          <div className="about-subtitle">
            <p>
              I've been <strong>manipulating computers since I was 9:</strong>{" "}
              making video games,{" "}
              <strong>producing many musical genres,</strong> programming audio
              effects, building circuits, training neural networks, designing
              webapps, and much more,{" "}
              <strong>almost entirely self-taught!</strong>
            </p>

            <p>
              I hope to spend my life doing{" "}
              <strong>interesting, imaginative things</strong> that have never
              been done before but are{" "}
              <strong>overwhelmingly worth doing,</strong>{" "}
              <TransitionLink
                to="/gallery/rcbi"
                state={{ fromBlog: true, fromPath: "/about" }}
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
                Simulated{" "}
                <strong>breast/lung tissue and blood cell dynamics </strong>{" "}
                using PDEs & neural networks
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
                (Rapid fire:) <strong>Simulated rodent neurons,</strong>{" "}
                post-trained language models, built/sold RL envs
              </li>

              <li>
                (In my youth:) Wrote code/apps for a <strong>FRC team;</strong>{" "}
                taught elementary schoolers{" "}
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
              I'm primarily <strong>motivated by/curious about:</strong>
            </p>
            <ul>
              <li>
                Analyzing systems,{" "}
                <strong>understanding the incomplete/unknown</strong>, and doing
                so <strong>regardless of field or form.</strong> I value finding{" "}
                <strong>common threads</strong> across far-flung ideas and
                building <strong>lasting, transferrable intuition.</strong>
              </li>
              <li>
                Rowing, <strong>caring about each and every element</strong> of
                each and every thing I work on, but also steering, zooming out
                and adjusting when{" "}
                <strong>pieces don't serve the whole.</strong>
              </li>
              <li>
                The <strong>fundamentally new possibilities</strong> associated
                with neural networks &amp; agents; the chance to{" "}
                <strong>
                  better understand ourselves, our world, and the nature of
                  intelligence
                </strong>{" "}
                as we teach machines to perceive and interact with the world.
              </li>
              <li>
                <strong>Being human:</strong> living life, making
                mistake/memories, <strong>facing fears,</strong> learning to{" "}
                <strong>understand and appreciate oneself.</strong> I believe
                it's incredibly important to{" "}
                <strong>understand one's self</strong> &amp; goals, then{" "}
                <strong>push past every superficial barrier.</strong>
              </li>
              <li>
                <strong>Thinking</strong>, dreaming, listening, imagining;{" "}
                <strong>understanding and telling stories.</strong>
              </li>
            </ul>
            <p className="about-links about-section-start">
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
                <strong>Twitter</strong>
              </a>{" "}
              |{" "}
              <a
                href={youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-link"
              >
                <strong>YouTube</strong>
              </a>{" "}
              |{" "}
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
