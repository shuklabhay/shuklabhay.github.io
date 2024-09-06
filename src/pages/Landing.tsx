import { Stack, Text } from "@mantine/core";
import { useEffect } from "react";
import { GradientBackground } from "../components/GradientBackground";
import { useScrollContext } from "../utils/scrollContext";

export default function Landing() {
  // Hooks and constants
  const { scrollInformation, setScrollProgress } = useScrollContext();

  // Scrolling control
  useEffect(() => {
    const handleScroll = () => {
      // Update scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableDistance = documentHeight - windowHeight;
      const newProgress = (window.scrollY / scrollableDistance) * 100;
      setScrollProgress(Math.min(newProgress, 100));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollInformation.acomplishmentsPosition, setScrollProgress]);

  return (
    <div>
      <Stack
        align="center"
        gap={2}
        h={"100svh"}
        style={{
          zIndex: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GradientBackground />

        <Stack
          align="center"
          gap={2}
          h={{ base: "95vh", sm: "90vh" }}
          w={"100%"}
          justify="center"
          p={{ base: "0 1rem", sm: 0 }}
        >
          <Text
            fz={{ base: 32, sm: 54 }}
            fw={700}
            ta="center"
            style={{
              mixBlendMode: "overlay",
              userSelect: "none",
            }}
          >
            Abhay Shukla
          </Text>
          <Text
            fz={{ base: 14, sm: 18 }}
            ta="center"
            w={{ base: "60%", sm: "65%" }}
            style={{
              mixBlendMode: "plus-lighter",
              userSelect: "none",
            }}
          >
            High School Student, AI Researcher, Roboticist, Digital Audio
            Producer, Full Stack Developer, Nonprofit Founder, Speaker, and
            Innovator.
          </Text>
        </Stack>
      </Stack>
    </div>
  );
}
