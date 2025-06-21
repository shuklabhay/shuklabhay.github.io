import { Stack, Text } from "@mantine/core";
import { useEffect } from "react";
import { GradientBackground } from "../components/GradientBackground";
import { useAppContext } from "../utils/appContext";

export default function Landing() {
  // Hooks and constants
  const { scrollInformation: scrollInformation, setScrollProgress } =
    useAppContext();

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
  }, [scrollInformation.skillsPosition, setScrollProgress]);

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
          gap={8}
          h={{ base: "75vh", sm: "90vh" }}
          w={"100%"}
          justify="center"
          p={{ base: "1.5rem", sm: "2rem" }}
        >
          <Text
            fz={{ base: 32, sm: 54 }}
            fw={700}
            ta="center"
            lh={1.2}
            style={{
              mixBlendMode: "overlay",
              userSelect: "none",
            }}
          >
            Abhay Shukla
          </Text>
        </Stack>
      </Stack>
    </div>
  );
}
