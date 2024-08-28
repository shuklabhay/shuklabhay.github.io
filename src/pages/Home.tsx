import { Stack, Text, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { useScrollContext } from "../utils/scrollContext";

export default function Home() {
  const { scrollInformation } = useScrollContext();
  const theme = useMantineTheme();
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouseX((event.clientX / window.innerWidth) * 100);
      setMouseY((event.clientY / window.innerHeight) * 100);
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrollOpacity(
        1 - Math.min(1.1 * (scrollTop / scrollInformation.projectsPosition), 1)
      );
    };

    console.log(scrollInformation);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const grainGradient = {
    height: "100vh",
    filter: "contrast(160%) brightness(450%)", // Apply filter here
    background: `
      linear-gradient(
        to bottom right,
        rgba(0, 0, 255, 1),
        rgba(170, 7, 236, 0.47) 
      ),
      radial-gradient(
        at ${mouseX}% ${mouseY}%,
        rgba(255, 255, 255, 0.3), 
        rgba(0, 0, 0, 0.5)
      ),
      url("data:image/svg+xml,%3Csvg viewBox='0 0 350 350' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.35' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
    `,
    backgroundBlendMode: "overlay, normal, normal",
  };

  if (theme.colors.main) {
    return (
      <Stack
        align="center"
        gap={2}
        style={{ paddingTop: "17%", position: "relative", height: "100vh" }}
      >
        <div
          style={{
            ...grainGradient, // Apply grainGradient to the div
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: scrollOpacity,
            transition: "opacity 0.3s ease",
          }}
        />
        <Text fz="h1">Abhay Shukla</Text>

        <Text fz="body2" style={{ textAlign: "center", width: "65%" }}>
          High School Student, AI Researcher, Roboticist, Audio Engineer, Full
          Stack Developer, Nonprofit Founder, Speaker, Debator, Entrepreneur,
          and Multilingual
        </Text>
      </Stack>
    );
  }
}
