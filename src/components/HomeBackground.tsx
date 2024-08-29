import { useMantineTheme } from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import {
  handleScrollProgressOpacity,
  useScrollContext,
} from "../utils/scrollContext";
import { hexToRgb } from "../utils/theme";

const gradientAngleRange = 30;
const gradientAngle = window.matchMedia("(max-width: 767px)").matches
  ? Math.random() < 0.5
    ? Math.random() * gradientAngleRange
    : 360 - Math.random() * gradientAngleRange
  : Math.random() * (2 * gradientAngleRange) + (180 - gradientAngleRange);
const startX = Math.random() * window.innerWidth;
const startY = Math.random() * window.innerHeight;

export function HomeBackground() {
  // Hooks
  const { scrollInformation } = useScrollContext();
  const theme = useMantineTheme();
  const [gradientActiveX, setGradientActiveX] = useState(startX);
  const [gradientActiveY, setGradientActiveY] = useState(startY);
  const [scrollProgressOpacity, setScrollProgressOpacity] = useState(1);
  const [isMouseInactive, setIsMouseInactive] = useState(false);

  const mouseTimer = useRef<number | undefined>(undefined);
  const animationRef = useRef<number | undefined>(undefined);
  const lastUpdateTime = useRef(Date.now());
  const directionDuration = useRef(0);
  const lastActivePosition = useRef({ x: startX, y: startY });

  // Animation and Scrolling Control
  useEffect(() => {
    const scrollEventListener = () => {
      handleScrollProgressOpacity(
        scrollInformation.projectsPosition,
        setScrollProgressOpacity,
      );
    };

    let targetX = startX;
    let targetY = startY;

    const handleMouseMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      lastActivePosition.current = { x: targetX, y: targetY };
      setIsMouseInactive(false);
      clearTimeout(mouseTimer.current);
      mouseTimer.current = setTimeout(() => setIsMouseInactive(true), 5000);
    };

    const changePosition = () => {
      targetX = Math.random() * window.innerWidth;
      targetY = Math.random() * window.innerHeight;
      directionDuration.current = (Math.random() * 2 + 2) * 1000;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        changePosition();
      }
    };

    const animateGradient = () => {
      const currentTime = Date.now();
      lastUpdateTime.current = currentTime;

      if (isMouseInactive) {
        if (currentTime - lastUpdateTime.current > directionDuration.current) {
          changePosition();
        }
      } else {
        targetX = lastActivePosition.current.x;
        targetY = lastActivePosition.current.y;
      }

      const followSpeed = 0.005;
      setGradientActiveX((prev) => prev + (targetX - prev) * followSpeed);
      setGradientActiveY((prev) => prev + (targetY - prev) * followSpeed);

      animationRef.current = requestAnimationFrame(animateGradient);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", scrollEventListener, {
      passive: true,
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    animationRef.current = requestAnimationFrame(animateGradient);

    scrollEventListener();

    return () => {
      if (animationRef.current && mouseTimer.current) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("scroll", scrollEventListener);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
        clearTimeout(mouseTimer.current);
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMouseInactive, scrollInformation.projectsPosition]);

  // Background Rendering
  if (theme.colors.gradMain && theme.colors.main) {
    const gradientMainColor = hexToRgb(theme.colors.gradMain[8]);
    const gradientAccentColor = hexToRgb(theme.colors.main[4]);

    const grainGradient = {
      height: "100vh",
      filter: "contrast(150%) brightness(450%) blur(15px)",
      background: `
        linear-gradient(
          ${gradientAngle}deg,
          rgba(${gradientMainColor.r}, ${gradientMainColor.g}, ${gradientMainColor.b}, 1),
          rgba(${gradientAccentColor.r}, ${gradientAccentColor.g}, ${gradientAccentColor.b}, 0.7) 
        ),
        radial-gradient(
          at ${gradientActiveX}px ${gradientActiveY}px,
          rgba(50, 50, 50, 0.1), 
          rgba(0, 0, 0, 0.6)
        ),
        url("data:image/svg+xml,%3Csvg viewBox='0 0 350 350' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
      `,
      backgroundBlendMode: "overlay, normal, normal",
    };

    return (
      <>
        <div
          style={{
            ...grainGradient,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: scrollProgressOpacity,
            transition: "opacity 0.3s ease",
            clipPath: "inset(0 0 0 0)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: `rgb(0, 0, 0, ${scrollProgressOpacity * 0.2})`,
          }}
        />
      </>
    );
  }

  return null;
}
