import { ActionIcon, Stack, Text, useMantineTheme } from "@mantine/core";
import { HomeBackground } from "../components/HomeBackground";
import {
  useScrollContext,
  scrollTo,
  handleScrollProgressOpacity,
} from "../utils/scrollContext";
import { useEffect, useState } from "react";

export default function Home() {
  const theme = useMantineTheme();
  const { scrollInformation } = useScrollContext();
  const [scrollProgressOpacity, setScrollProgressOpacity] = useState(1);
  const [buttonOpacity, setButtonOpacity] = useState(0); // Initial opacity 0 (hidden)

  // Scroll Progress Listener
  useEffect(() => {
    const scrollEventListener = () => {
      handleScrollProgressOpacity(
        scrollInformation.projectsPosition,
        setScrollProgressOpacity,
      );
    };

    scrollEventListener();
    window.addEventListener("scroll", scrollEventListener, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollEventListener);
    };
  }, [scrollInformation.projectsPosition]);

  // Arrow icon button opacity control
  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonOpacity(1);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (theme.colors.main) {
    return (
      <Stack
        align="center"
        gap={2}
        style={{ position: "relative", height: "100vh" }}
      >
        <HomeBackground />

        <Stack
          align="center"
          gap={2}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: window.matchMedia("(max-width: 767px)").matches
              ? "95vh"
              : "85vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text
            fz="54"
            style={{
              mixBlendMode: "overlay",
              userSelect: "none",
              fontWeight: "bold",
            }}
          >
            Abhay Shukla
          </Text>
          <Text
            fz="18"
            style={{
              textAlign: "center",
              width: "65%",
              mixBlendMode: "luminosity",
              userSelect: "none",
            }}
          >
            High School Student, AI Researcher, Roboticist, Digital Audio
            Producer, Full Stack Developer, Nonprofit Founder, Speaker, Debater,
            Entrepreneur, and Multilingual
          </Text>
        </Stack>

        <ActionIcon
          radius="xl"
          size="sm"
          onClick={() => scrollTo(scrollInformation.projectsPosition)}
          style={{
            position: "absolute",
            bottom: 20,
            backgroundColor: "transparent",
            opacity: Math.min(scrollProgressOpacity, buttonOpacity),
            transition: "opacity 3s ease",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 5l0 14" />
            <path d="M18 13l-6 6" />
            <path d="M6 13l6 6" />
          </svg>
        </ActionIcon>
      </Stack>
    );
  }
  return null;
}
