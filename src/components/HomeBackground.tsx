import { Stack, useMantineTheme } from "@mantine/core";
import { useEffect, useState, useRef, useCallback } from "react";
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

const throttleDelay = 64;

export function HomeBackground({ isMobile }: { isMobile: boolean }) {
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

  // Helpers
  const throttle = useCallback((func: Function, limit: number) => {
    let lastFunc: number;
    let lastRan: number;
    return function (this: any, ...args: any[]) {
      if (!lastRan) {
        func.apply(this, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = window.setTimeout(
          () => {
            if (Date.now() - lastRan >= limit) {
              func.apply(this, args);
              lastRan = Date.now();
            }
          },
          limit - (Date.now() - lastRan)
        );
      }
    };
  }, []);

  // Scroll and Animation Control
  useEffect(() => {
    // Control scrolling
    const handleScroll = () => {
      handleScrollProgressOpacity(
        scrollInformation.projectsPosition,
        setScrollProgressOpacity
      );
    };

    // Control gradient/gradient animation
    const followSpeed = 0.05;
    let targetX = startX;
    let targetY = startY;

    const handleMouseAction = throttle((event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      lastActivePosition.current = { x: targetX, y: targetY };
      setIsMouseInactive(false);
      clearTimeout(mouseTimer.current);
      mouseTimer.current = setTimeout(() => setIsMouseInactive(true), 5000);
    }, throttleDelay);

    const randomlyChangePosition = () => {
      const currentTime = Date.now();
      lastUpdateTime.current = currentTime;

      if (
        (isMouseInactive || isMobile) &&
        currentTime - lastUpdateTime.current > directionDuration.current
      ) {
        targetX = Math.random() * window.innerWidth;
        targetY = Math.random() * window.innerHeight;
        directionDuration.current = (Math.random() * 2 + 1) * 1000;
      }
    };

    const animateGradient = () => {
      randomlyChangePosition();

      setGradientActiveX((prev) => prev + (targetX - prev) * followSpeed);
      setGradientActiveY((prev) => prev + (targetY - prev) * followSpeed);
      animationRef.current = requestAnimationFrame(animateGradient);
    };

    window.addEventListener("mousemove", handleMouseAction, { passive: true });
    window.addEventListener("touchmove", handleMouseAction, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    animationRef.current = requestAnimationFrame(animateGradient);
    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseAction);
      window.removeEventListener("touchmove", handleMouseAction);
      window.removeEventListener("scroll", handleScroll);

      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isMouseInactive, throttle]);

  // Define Gradient
  if (theme.colors.gradMain && theme.colors.main) {
    const gradientMainColor = hexToRgb(theme.colors.gradMain[6]);
    const gradientAccentColor = hexToRgb(theme.colors.main[6]);

    const grainGradient = {
      height: "100vh",
      filter: "contrast(120%) brightness(350%) blur(10px)",
      background: `
        linear-gradient(
          ${gradientAngle}deg,
          rgba(${gradientMainColor.r}, ${gradientMainColor.g}, ${gradientMainColor.b}, 1),
          rgba(${gradientAccentColor.r}, ${gradientAccentColor.g}, ${gradientAccentColor.b}, 0.6) 
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
      <Stack>
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
            willChange: "background-position",
            zIndex: -1,
          }}
        />
      </Stack>
    );
  }

  return null;
}
