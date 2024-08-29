import { ActionIcon, Stack, Text, useMantineTheme } from "@mantine/core";
import { HomeBackground } from "../components/HomeBackground";
import {
  useScrollContext,
  scrollTo,
  handleScrollProgressOpacity,
} from "../utils/scrollContext";
import { useEffect, useState, useCallback } from "react";

function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export default function Home() {
  const theme = useMantineTheme();
  const { scrollInformation } = useScrollContext();
  const [scrollProgressOpacity, setScrollProgressOpacity] = useState(1);
  const [buttonOpacity, setButtonOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const checkMobile = useCallback(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [checkMobile]);

  useEffect(() => {
    const handleScroll = () => {
      handleScrollProgressOpacity(
        scrollInformation.projectsPosition,
        setScrollProgressOpacity
      );
    };

    const throttledHandleScroll = throttle(handleScroll, 100);

    throttledHandleScroll();
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    const timer = setTimeout(() => {
      setButtonOpacity(1);
    }, 750);

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      clearTimeout(timer);
    };
  }, [scrollInformation.projectsPosition]);

  if (theme.colors.main) {
    return (
      <Stack
        align="center"
        gap={2}
        style={{
          position: "relative",
          height: "100svh",
          overflow: "hidden",
        }}
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
            height: isMobile ? "75vh" : "85vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: isMobile ? "0 1rem" : 0,
          }}
        >
          <Text
            fz={isMobile ? 42 : 54}
            style={{
              mixBlendMode: "overlay",
              fontWeight: "bold",
              textAlign: "center",
              userSelect: "none",
            }}
          >
            Abhay Shukla
          </Text>
          <Text
            fz={isMobile ? 16 : 18}
            style={{
              mixBlendMode: "luminosity",
              textAlign: "center",
              userSelect: "none",
              width: isMobile ? "90%" : "65%",
            }}
          >
            High School Student, AI Researcher, Roboticist, Digital Audio
            Producer, Full Stack Developer, Nonprofit Founder, Speaker, Debater,
            Entrepreneur, and Multilingual
          </Text>
        </Stack>
        <ActionIcon
          radius="xl"
          size={isMobile ? "md" : "sm"}
          onClick={() => scrollTo(scrollInformation.projectsPosition)}
          style={{
            position: "absolute",
            bottom: isMobile ? 40 : 20,
            backgroundColor: "transparent",
            opacity: Math.min(scrollProgressOpacity, buttonOpacity),
            transition: "opacity 3s ease",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={isMobile ? 32 : 24}
            height={isMobile ? 32 : 24}
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
