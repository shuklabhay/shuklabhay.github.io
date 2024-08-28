import { Navbar } from "../components/Navbar.tsx";

import Landing from "./Landing.tsx";
import Projects from "./Projects.tsx";
import Contact from "./Contact.tsx";
import { Stack } from "@mantine/core";
import { useEffect, useRef } from "react";
import { scrollOffet, useScrollContext } from "../utils/scrollContext.tsx";

export default function PageStack() {
  const { setScrollInformation } = useScrollContext();
  const landingRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePositions = () => {
      if (landingRef.current && projectsRef.current && contactRef.current) {
        setScrollInformation({
          landingPosition: landingRef.current.offsetTop,
          projectsPosition: projectsRef.current.offsetTop,
          contactPosition: contactRef.current.offsetTop,
        });
      }
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);
    window.addEventListener("scroll", updatePositions);

    return () => {
      window.removeEventListener("resize", updatePositions);
      window.removeEventListener("scroll", updatePositions);
    };
  }, [landingRef, projectsRef, contactRef]);

  console.log();

  return (
    <Stack gap={2}>
      <div ref={landingRef}>
        <Landing />
      </div>

      <div ref={projectsRef}>
        <Projects />
      </div>

      <div ref={contactRef}>
        <Contact />
      </div>
    </Stack>
  );
}
function setVerticalPositions(arg0: {
  landing: number;
  projects: number;
  contact: number;
}) {
  throw new Error("Function not implemented.");
}
