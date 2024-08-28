import { useEffect, useRef } from "react";
import { scrollOffet, useScrollContext } from "../utils/scrollContext.tsx";
import { Container } from "@mantine/core";
import Contact from "./Contact.tsx";
import Home from "./Home.tsx";
import Projects from "./Projects.tsx";

export default function PageStack() {
  const { setScrollInformation } = useScrollContext();
  const landingRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScrollInformation = () => {
      if (landingRef.current && projectsRef.current && contactRef.current) {
        const newLandingPositon = landingRef.current.offsetTop - scrollOffet;
        const newProjectsPositon = projectsRef.current.offsetTop - scrollOffet;
        const newContactPositon = contactRef.current.offsetTop - scrollOffet;
        const scrollTop = window.scrollY;
        const scrollBottom = scrollTop + window.innerHeight;

        setScrollInformation({
          landingPosition: newLandingPositon,
          projectsPosition: newProjectsPositon,
          contactPosition: newContactPositon,
          isLandingFocused: scrollTop < newProjectsPositon,
          isProjectsFocused:
            scrollTop >= newProjectsPositon &&
            scrollBottom < newContactPositon + scrollOffet,
          isContactFocused: scrollBottom >= newContactPositon + scrollOffet,
        });
      }
    };

    updateScrollInformation();
    window.addEventListener("resize", updateScrollInformation);
    window.addEventListener("scroll", updateScrollInformation);

    return () => {
      window.removeEventListener("resize", updateScrollInformation);
      window.removeEventListener("scroll", updateScrollInformation);
    };
  }, [landingRef, projectsRef, contactRef]);

  console.log();

  return (
    <div>
      <div ref={landingRef}>
        <Home />
      </div>

      <Container size="sx" ref={projectsRef}>
        <Projects />
      </Container>

      <Container size="sx" ref={contactRef}>
        <Contact />
      </Container>
    </div>
  );
}
function setVerticalPositions(arg0: {
  landing: number;
  projects: number;
  contact: number;
}) {
  throw new Error("Function not implemented.");
}
