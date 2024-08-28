import { Navbar } from "../components/Navbar.tsx";

import Landing from "./Landing.tsx";
import Projects from "./Projects.tsx";
import Contact from "./Contact.tsx";
import { Stack } from "@mantine/core";
import { useEffect, useRef } from "react";
import { useScrollContext } from "../utils/scrollContext.tsx";

export default function PageStack() {
  const { setVerticalPositions: setPositions } = useScrollContext();
  const landingRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePositions = () => {
      const positionOffset = -54;

      const computeVerticalPosition = (
        ref: React.RefObject<HTMLDivElement>,
      ) => {
        const offsetTop = ref.current?.offsetTop;
        return offsetTop ? offsetTop + positionOffset : 0;
      };

      setPositions({
        landing: computeVerticalPosition(landingRef),
        projects: computeVerticalPosition(projectsRef),
        contact: computeVerticalPosition(contactRef),
      });
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);

    return () => window.removeEventListener("resize", updatePositions);
  }, [setPositions]);

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
