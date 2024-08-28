import { useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { useScrollContext } from "../utils/scrollContext";
import { hexToRgb } from "../utils/theme";

const gradAngleRange = 30;
const gradAngle = Math.random() * (2 * gradAngleRange) + (180 - gradAngleRange);

const startX = Math.random() * 90;
const startY = Math.random() * 90;

export function HomeBackground() {
  const { scrollInformation } = useScrollContext();
  const theme = useMantineTheme();

  const [mouseX, setMouseX] = useState(startX);
  const [mouseY, setMouseY] = useState(startY);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  if (theme.colors.gradMain && theme.colors.main) {
    const gradientMainColor = hexToRgb(theme.colors.gradMain[7]);
    const gradientAccentColor = hexToRgb(theme.colors.main[4]);

    useEffect(() => {
      const scrollTop = window.scrollY;
      const handleMouseMove = (event: MouseEvent) => {
        setMouseX((event.clientX / window.innerWidth) * 100);
        setMouseY((event.clientY / window.innerHeight) * 100);
      };
      const handleScroll = () => {
        setScrollOpacity(
          1 - Math.min(1 * (scrollTop / scrollInformation.projectsPosition), 1)
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
            rgba(${gradientMainColor.r}, ${gradientMainColor.g}, ${gradientMainColor.b}, 1),
            rgba(${gradientAccentColor.r}, ${gradientAccentColor.g}, ${gradientAccentColor.b}, 0.7) 
          ),
          radial-gradient(
            at ${mouseX}% ${mouseY}%,
            rgba(50, 50, 50, 0.1), 
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
          clipPath: "inset(0 0 0 0)",
        }}
      />
    );
  }
}
