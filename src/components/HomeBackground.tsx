import { Stack, useMantineTheme } from "@mantine/core";
import { useEffect, useState, useRef, useCallback } from "react";
import { useScrollContext } from "../utils/scrollContext";
import { hexToRgb } from "../utils/theme";
import {
  calculateScrollProgressOpacity,
  scrollViewportTo,
} from "../utils/scroll";
import useThrottle from "../utils/throttle";
import DownArrowButton from "./DownArrowButton";

const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;
const gradientAngleRange = 30;
const gradientAngle = isSmallScreen
  ? Math.random() < 0.5
    ? Math.random() * gradientAngleRange
    : 360 - Math.random() * gradientAngleRange
  : Math.random() * (2 * gradientAngleRange) + (180 - gradientAngleRange);

const startX = isSmallScreen
  ? Math.random() * window.innerWidth
  : (() => {
      let x = Math.random() * window.innerWidth;
      if (x >= window.innerWidth / 3 && x <= window.innerWidth * (2 / 3)) {
        x = Math.random() < 0.5 ? x / 2 : x + window.innerWidth / 4;
      }
      return x;
    })();
const startY = isSmallScreen
  ? Math.random() * (window.innerHeight / 3)
  : (() => {
      let y = Math.random() * window.innerHeight;
      if (y >= window.innerHeight / 3 && y <= window.innerHeight * (2 / 3)) {
        y = Math.random() < 0.5 ? y / 2 : y + window.innerHeight / 4;
      }
      return y;
    })();

export function HomeBackground({}: {}) {
  // Hooks
  const { scrollInformation } = useScrollContext();
  const theme = useMantineTheme();
  const [gradientActivePos, setGradientActivePos] = useState({
    x: startX,
    y: startY,
  });
  const [gradientOpacity, setGradientOpacity] = useState(1);
  const [isMouseInactive, setIsMouseInactive] = useState(false);
  const [arrowInOpacity, setArrowInOpacity] = useState(0);

  const mouseTimer = useRef<number | undefined>(undefined);
  const animationRef = useRef<number | undefined>(undefined);
  const lastUpdateTime = useRef(Date.now());
  const directionDuration = useRef(0);
  const lastActivePosition = useRef({ x: startX, y: startY });

  // Scroll and Animation Control
  const handleArrowClick = useCallback(() => {
    scrollViewportTo(scrollInformation.projectsPosition);
  }, [scrollInformation.projectsPosition]);

  useEffect(() => {
    // Control scrolling
    const handleScroll = useThrottle(() => {
      const scrollProgress =
        scrollInformation.projectsPosition !== 0
          ? calculateScrollProgressOpacity(scrollInformation.projectsPosition)
          : 1;
      setGradientOpacity(scrollProgress);
    });

    // Control gradient/gradient animation
    const followSpeed = 0.02;
    let targetPos = { x: startX, y: startY };

    const handleMouseAction = useThrottle((event: MouseEvent) => {
      targetPos = { x: event.clientX, y: event.clientY };
      lastActivePosition.current = { x: targetPos.x, y: targetPos.y };
      setIsMouseInactive(false);
      clearTimeout(mouseTimer.current);
      mouseTimer.current = setTimeout(() => setIsMouseInactive(true), 5000);
    });

    const randomlyChangePosition = () => {
      const currentTime = Date.now();
      lastUpdateTime.current = currentTime;

      if (
        isMouseInactive &&
        currentTime - lastUpdateTime.current > directionDuration.current &&
        gradientOpacity == 1
      ) {
        targetPos = {
          x: isSmallScreen
            ? Math.random() * window.innerWidth
            : (Math.random() * window.innerWidth) / 2,
          y: isSmallScreen
            ? Math.random() * window.innerHeight
            : (Math.random() * window.innerHeight) / 2,
        };

        directionDuration.current = (Math.random() * 2 + 1) * 1000;
      }
    };

    const animateGradient = () => {
      randomlyChangePosition();

      setGradientActivePos((prev) => ({
        x: prev.x + (targetPos.x - prev.x) * followSpeed,
        y: prev.y + (targetPos.y - prev.y) * followSpeed,
      }));
      animationRef.current = requestAnimationFrame(animateGradient);
    };

    if (window.scrollY === 0) {
      window.addEventListener("mousemove", handleMouseAction, {
        passive: true,
      });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    animationRef.current = requestAnimationFrame(animateGradient);
    handleScroll();

    const arrowFadeInTimer = setTimeout(() => {
      setArrowInOpacity(1);
    }, 750);

    return () => {
      window.removeEventListener("mousemove", handleMouseAction);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(arrowFadeInTimer);

      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isMouseInactive]);

  // Define Gradient
  if (theme.colors.gradMain && theme.colors.main) {
    const gradientMainColor = hexToRgb(theme.colors.gradMain[9]);
    const gradientAccentColor = hexToRgb(theme.colors.main[8]);

    const grainGradient = {
      height: "100vh",
      filter: "contrast(120%) brightness(350%) blur(12px)",
      background: `
        linear-gradient(
          ${gradientAngle}deg,
          rgba(${gradientMainColor.r}, ${gradientMainColor.g}, ${gradientMainColor.b}, 1),
          rgba(${gradientAccentColor.r}, ${gradientAccentColor.g}, ${gradientAccentColor.b}, 0.7) 
        ),
        radial-gradient(
          at ${gradientActivePos.x}px ${gradientActivePos.y}px,
          rgba(50, 50, 50, 0.1), 
          rgba(0, 0, 0, 0.6)
        ),
        url("data:image/svg+xml,%3Csvg viewBox='0 0 350 350' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
      `,
      backgroundBlendMode: "overlay, normal, normal",
    };

    return (
      <Stack>
        <div
          style={{
            ...grainGradient,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: gradientOpacity,
            transition: "opacity 0.3s ease",
            clipPath: "inset(0 0 0 0)",
            willChange: "background",
            transform: "translateZ(0)",
            zIndex: -1,
          }}
        />
        <DownArrowButton
          onClick={handleArrowClick}
          opacity={Math.min(arrowInOpacity, gradientOpacity)}
        />
      </Stack>
    );
  }

  return null;
}
