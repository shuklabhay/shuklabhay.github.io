import { useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { useScrollContext } from "../utils/scrollContext";

const scaleInt = Math.floor(Math.random() * 4) + 1;
const gradAngle = Math.random() * 70 * scaleInt;
const gradIntensity = Math.random() * 0.3 + 0.4;

const radius = Math.max(window.innerWidth, window.innerHeight) * 1;
const invertGradAngle = (gradAngle + 180) % 360;

const startX = Math.random() * 90;
const startY = Math.random() * 90;

export function HomeBackground() {
  const { scrollInformation } = useScrollContext();
  const theme = useMantineTheme();

  const [mouseX, setMouseX] = useState(startX);
  const [mouseY, setMouseY] = useState(startY);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouseX((event.clientX / window.innerWidth) * 100);
      setMouseY((event.clientY / window.innerHeight) * 100);
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrollOpacity(
        1 - Math.min(1.1 * (scrollTop / scrollInformation.projectsPosition), 1),
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const grainGradient = {
    height: "100vh",
    filter: "contrast(150%) brightness(450%) blur(15px)",
    background: `
    linear-gradient(
      ${gradAngle}deg,
      rgba(0, 0, 255, 1),
      rgba(170, 7, 236, ${gradIntensity}) 
    ),
    radial-gradient(
      at ${mouseX}% ${mouseY}%,
      rgba(150, 150, 150, 0.3), 
      rgba(0, 0, 0, 0.6)
    ),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 350 350' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
  `,
    backgroundBlendMode: "overlay, normal, normal",
  };

  return (
    <div
      style={{
        ...grainGradient,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: scrollOpacity,
        transition: "opacity 0.3s ease",
        overflow: "hidden",
      }}
    />
  );
}
