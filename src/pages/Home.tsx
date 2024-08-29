import { Stack, Text, useMantineTheme } from "@mantine/core";
import { HomeBackground } from "../components/HomeBackground";
import { useScrollContext } from "../utils/scrollContext";
import { useEffect, useState, useCallback } from "react";
import {
  calculateScrollProgressOpacity,
  scrollViewportTo,
} from "../utils/scrolling";
import DownArrowButton from "../components/DownArrowButton";

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
  const { scrollInformation, setScrollProgress } = useScrollContext();
  const [darkWrapperOpacity, setDarkWrapperOpacity] = useState(1);
  const [arrowInOpacity, setArrowInOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile checks
  const checkMobile = useCallback(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [checkMobile]);

  // Scrolling things
  useEffect(() => {
    const handleScroll = throttle(() => {
      setDarkWrapperOpacity(
        scrollInformation.projectsPosition !== 0
          ? calculateScrollProgressOpacity(scrollInformation.projectsPosition)
          : 1,
      );

      // Update scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableDistance = documentHeight - windowHeight;
      const newProgress = (window.scrollY / scrollableDistance) * 100;
      setScrollProgress(Math.min(newProgress, 100));
    }, 16);

    window.addEventListener("scroll", handleScroll, { passive: true });

    const timer = setTimeout(() => {
      setArrowInOpacity(1);
    }, 750);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [scrollInformation.projectsPosition, setScrollProgress]);

  const handleArrowClick = useCallback(() => {
    scrollViewportTo(scrollInformation.projectsPosition);
  }, [scrollInformation.projectsPosition, setScrollProgress]);

  if (theme.colors.main) {
    return (
      <div>
        <Stack
          align="center"
          gap={2}
          style={{
            zIndex: 0,
            position: "relative",
            height: "100svh",
            overflow: "hidden",
          }}
        >
          <HomeBackground isMobile={isMobile} />

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
                mixBlendMode: "plus-lighter",
                textAlign: "center",
                userSelect: "none",
                width: isMobile ? "90%" : "65%",
              }}
            >
              High School Student, AI Researcher, Roboticist, Digital Audio
              Producer, Full Stack Developer, Nonprofit Founder, Speaker, and
              Innovator.
            </Text>
          </Stack>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: `rgba(0, 0, 0, ${darkWrapperOpacity * 0.15})`,
              zIndex: 1,
            }}
          />
          <DownArrowButton
            isMobile={isMobile}
            onClick={handleArrowClick}
            opacity={arrowInOpacity}
          />
        </Stack>
      </div>
    );
  }
  return null;
}
