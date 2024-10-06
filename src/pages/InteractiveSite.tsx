import { Container } from "@mantine/core";
import { useEffect, useRef } from "react";
import { scrollOffet, useScrollContext } from "../utils/scrollContext.tsx";
import Contact from "./Contact.tsx";

import Experience from "./Experience.tsx";
import Landing from "./Landing.tsx";
import Skills from "./Skills.tsx";
import { Navbar } from "../components/Navbar.tsx";

export default function InteractiveSite() {
  // Hooks
  const { setScrollInformation } = useScrollContext();
  const landingRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

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
        skillsRef.current &&
        experienceRef.current &&
        contactRef.current
      ) {
        const newLandingPosition = landingRef.current.offsetTop - scrollOffet;
        const newSkillsPosition = skillsRef.current.offsetTop - scrollOffet;
        const newExperiencePosition =
          experienceRef.current.offsetTop - scrollOffet;
        const newContactPosition = contactRef.current.offsetTop - scrollOffet;
        const scrollTop = window.scrollY;
        const scrollBottom = scrollTop + window.innerHeight;

        const newIsLandingFocused = scrollTop < newSkillsPosition;
        const newIsSkillsFocused =
          scrollTop >= newSkillsPosition &&
          scrollBottom < newExperiencePosition + window.innerHeight;
        const newIsExperienceFocused =
          scrollTop >= newExperiencePosition &&
          scrollBottom < newContactPosition + scrollOffet;
        const newIsContactFocused =
          !newIsLandingFocused &&
          !newIsSkillsFocused &&
          !newIsExperienceFocused;

        setScrollInformation({
          landingPosition: newLandingPosition,
          skillsPosition: newSkillsPosition,
          experiencePosition: newExperiencePosition,
          contactPosition: newContactPosition,
          isLandingFocused: newIsLandingFocused,
          isSkillsFocused: newIsSkillsFocused,
          isExperienceFocused: newIsExperienceFocused,
          isContactFocused: newIsContactFocused,
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
  }, [landingRef, experienceRef, contactRef]);

  return (
    <div>
      <Navbar />

      <div ref={landingRef}>
        <Landing />
      </div>

      <Container size="sx" ref={skillsRef}>
        <Skills />
      </Container>

      <Container size="sx" ref={experienceRef}>
        <Experience />
      </Container>

      <Container size="sx" ref={contactRef}>
        <Contact />
      </Container>
    </div>
  );
}
