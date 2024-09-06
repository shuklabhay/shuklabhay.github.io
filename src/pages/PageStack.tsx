import { Container } from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { scrollOffet, useScrollContext } from "../utils/scrollContext.tsx";
import Contact from "./Contact.tsx";
import Landing from "./Landing.tsx";
import Acomplishments from "./Acomplishments.tsx";
import Skills from "./Skills.tsx";

export default function PageStack() {
  // Hooks
  const { setScrollInformation } = useScrollContext();
  const landingRef = useRef<HTMLDivElement>(null);
  const acomplishmentsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
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
        acomplishmentsRef.current &&
        skillsRef.current &&
        contactRef.current
      ) {
        const newLandingPositon = landingRef.current.offsetTop - scrollOffet;
        const newAcomplishmentsPositon =
          acomplishmentsRef.current.offsetTop - scrollOffet;
        const newSkillsPosition = skillsRef.current.offsetTop - scrollOffet;
        const newContactPositon = contactRef.current.offsetTop - scrollOffet;
        const scrollTop = window.scrollY;
        const scrollBottom = scrollTop + window.innerHeight;

        setScrollInformation({
          landingPosition: newLandingPositon,
          acomplishmentsPosition: newAcomplishmentsPositon,
          skillsPositon: newSkillsPosition,
          contactPosition: newContactPositon,
          isLandingFocused: scrollTop < newAcomplishmentsPositon,
          isAcomplishmentsFocused:
            scrollTop >= newAcomplishmentsPositon &&
            scrollBottom < newSkillsPosition + window.innerHeight,
          isSkillsFocused:
            scrollTop >= newSkillsPosition &&
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
  }, [landingRef, acomplishmentsRef, contactRef]);

  return (
    <div>
      <div ref={landingRef}>
        <Landing />
      </div>

      <Container size="sx" ref={acomplishmentsRef}>
        <Acomplishments />
      </Container>

      <Container size="sx" ref={skillsRef}>
        <Skills />
      </Container>

      <Container size="sx" ref={contactRef}>
        <Contact />
      </Container>
    </div>
  );
}
