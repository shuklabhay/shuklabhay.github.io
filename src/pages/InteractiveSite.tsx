import { Container } from "@mantine/core";
import { useEffect, useRef } from "react";
import { scrollOffet, useAppContext } from "../utils/appContext.tsx";
import { Navbar } from "../components/Navbar.tsx";
import AboutMe from "./AboutMe.tsx";
import Experience from "./Experience.tsx";
import Landing from "./Landing.tsx";
import Skills from "./Skills.tsx";
import PageHelmet from "../utils/PageHelmet.tsx";

export default function InteractiveSite() {
  // Hooks
  const { setScrollInformation: setScrollInformation } = useAppContext();

  const landingRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const aboutMeRef = useRef<HTMLDivElement>(null);

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
        aboutMeRef.current
      ) {
        const newLandingPosition = landingRef.current.offsetTop - scrollOffet;
        const newSkillsPosition = skillsRef.current.offsetTop - scrollOffet;
        const newExperiencePosition =
          experienceRef.current.offsetTop - scrollOffet;
        const newAboutMePosition = aboutMeRef.current.offsetTop - scrollOffet;
        const scrollTop = window.scrollY;
        const scrollBottom = scrollTop + window.innerHeight;

        const newIsLandingFocused = scrollTop < newSkillsPosition;
        const newIsSkillsFocused =
          scrollTop >= newSkillsPosition &&
          scrollBottom < newExperiencePosition + window.innerHeight;
        const newIsExperienceFocused =
          scrollTop >= newExperiencePosition &&
          scrollBottom < newAboutMePosition + scrollOffet;
        const newIsAboutMeFocused =
          !newIsLandingFocused &&
          !newIsSkillsFocused &&
          !newIsExperienceFocused;

        setScrollInformation({
          landingPosition: newLandingPosition,
          skillsPosition: newSkillsPosition,
          experiencePosition: newExperiencePosition,
          aboutMePosition: newAboutMePosition,
          isLandingFocused: newIsLandingFocused,
          isSkillsFocused: newIsSkillsFocused,
          isExperienceFocused: newIsExperienceFocused,
          isAboutMeFocused: newIsAboutMeFocused,
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
  }, [landingRef, experienceRef, aboutMeRef]);

  return (
    <div>
      <PageHelmet
        title="Interactive Portfolio Webpage"
        description=""
        page="/"
      />
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

      <Container size="sx" ref={aboutMeRef}>
        <AboutMe />
      </Container>
    </div>
  );
}
