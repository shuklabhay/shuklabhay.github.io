import { useCallback, useEffect, useRef, useState } from "react";
import { scrollOffet, useScrollContext } from "../utils/scrollContext.tsx";
import { Container } from "@mantine/core";
import Contact from "./Contact.tsx";
import Home from "./Home.tsx";
import Projects from "./Projects.tsx";
import Qualifications from "./Qualifications.tsx";

export default function PageStack() {
  // Hooks
  const { setScrollInformation } = useScrollContext();
  const landingRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const qualificationsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isSafari, setISafari] = useState(false);

  // Scroll control
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    scrollToTop();
    window.addEventListener("beforeunload", scrollToTop);

    return () => {
      window.removeEventListener("beforeunload", scrollToTop);
    };
  }, []);

  useEffect(() => {
    const updateScrollInformation = () => {
      if (
        landingRef.current &&
        projectsRef.current &&
        qualificationsRef.current &&
        contactRef.current
      ) {
        const newLandingPositon = landingRef.current.offsetTop - scrollOffet;
        const newProjectsPositon = projectsRef.current.offsetTop - scrollOffet;
        const newQualificationsPositon =
          qualificationsRef.current.offsetTop - scrollOffet;
        const newContactPositon = contactRef.current.offsetTop - scrollOffet;
        const scrollTop = window.scrollY;
        const scrollBottom = scrollTop + window.innerHeight;

        setScrollInformation({
          landingPosition: newLandingPositon,
          projectsPosition: newProjectsPositon,
          qualificationsPositon: newQualificationsPositon,
          contactPosition: newContactPositon,
          isLandingFocused: scrollTop < newProjectsPositon,
          isProjectsFocused:
            scrollTop >= newProjectsPositon &&
            scrollBottom < newQualificationsPositon + window.innerHeight,
          isQualificationsFocused:
            scrollTop >= newQualificationsPositon &&
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

  // Client checks
  const checkMobile = useCallback(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  useEffect(() => {
    checkMobile();
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setISafari(isSafari);

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [checkMobile]);

  return (
    <div>
      <div ref={landingRef}>
        <Home isMobile={isMobile} isSafari={isSafari} />
      </div>

      <Container size="sx" ref={projectsRef}>
        <Projects />
      </Container>

      <Container size="sx" ref={qualificationsRef}>
        <Qualifications />
      </Container>

      <Container size="sx" ref={contactRef}>
        <Contact />
      </Container>
    </div>
  );
}
