import { Stack, useMantineTheme } from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  calculateScrollProgressOpacity,
  isSmallScreen,
  scrollViewportTo,
} from "../utils/scroll";
import { useAppContext } from "../utils/appContext";
import { hexToRgb } from "../utils/theme";
import useThrottle from "../utils/throttle";
import DownArrowButton from "./IconButtons/DownArrowButton";

const gradientAngleRange = 30;

const gradientAngle = isSmallScreen
  ? Math.random() < 0.5
    ? 315 - Math.random() * gradientAngleRange // Top right
    : 45 + Math.random() * gradientAngleRange // Top left
  : (() => {
      const random = Math.random();
      if (random < 0.333) {
        // Top
        return Math.random() < 0.5
          ? Math.random() * gradientAngleRange
          : 360 - Math.random() * gradientAngleRange;
      } else if (random < 0.666) {
        // Right
        return 240 + Math.random() * 60;
      } else {
        // Left
        return 60 + Math.random() * 60;
      }
    })();

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
  ? Math.random() * (window.innerHeight / 3) + window.innerHeight / 8
  : (() => {
      let y = Math.random() * window.innerHeight;
      if (y >= window.innerHeight / 3 && y <= window.innerHeight * (2 / 3)) {
        y = Math.random() < 0.5 ? y / 2 : y + window.innerHeight / 4;
      }
      return y;
    })();

export function GradientBackground() {
  // Hooks
  const {
    appInformation: appInformation,
    scrollInformation: scrollInformation,
  } = useAppContext();
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
  const nextSectionStart = scrollInformation.skillsPosition;

  // Scroll and Animation Control
  const handleArrowClick = useCallback(() => {
    scrollViewportTo(nextSectionStart);
  }, [nextSectionStart]);

  useEffect(() => {
    // Control scrolling
    if (!appInformation.isViewingSelectOpen) {
      const handleScroll = useThrottle(() => {
        const scrollProgress =
          nextSectionStart !== 0
            ? calculateScrollProgressOpacity(nextSectionStart)
            : 1;
        setGradientOpacity(scrollProgress);

        if (window.scrollY === 0) {
          window.addEventListener("mousemove", handleMouseAction, {
            passive: true,
          });
        } else {
          window.removeEventListener("mousemove", handleMouseAction);
        }
      });

      // Control gradient/gradient animation
      const followSpeed = 0.03;
      let targetPos = { x: startX, y: startY };

      // Follow mouse
      const handleMouseAction = useThrottle((event: MouseEvent) => {
        targetPos = { x: event.clientX, y: event.clientY };
        lastActivePosition.current = { x: targetPos.x, y: targetPos.y };
        setIsMouseInactive(false);
        clearTimeout(mouseTimer.current);
        setTimeout(() => {
          setIsMouseInactive(true);
        }, 5000);
      });

      // Randomly move
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
    }
  }, [isMouseInactive]);

  // Define Gradient
  if (theme.colors.gradMain && theme.colors.main) {
    const gradientMainColor = hexToRgb(theme.colors.gradMain[9]);
    const gradientAccentColor = hexToRgb(theme.colors.main[8]);

    const grainGradient = {
      height: "100vh",
      filter: "contrast(125%) brightness(365%) blur(12px)",
      background: `
        linear-gradient(
          ${gradientAngle}deg,
          rgba(${gradientMainColor.r}, ${gradientMainColor.g}, ${gradientMainColor.b}, 1),
          rgba(${gradientAccentColor.r}, ${gradientAccentColor.g}, ${gradientAccentColor.b}, 0.6) 
        ),
        radial-gradient(
          at ${gradientActivePos.x}px ${gradientActivePos.y}px,
          rgba(50, 50, 50, 0.2), 
          rgba(0, 0, 0, 0.5)
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
        <div style={{ display: "flex", justifyContent: "center" }}>
          <DownArrowButton
            onClick={handleArrowClick}
            opacity={Math.min(arrowInOpacity, gradientOpacity)}
          />
        </div>
      </Stack>
    );
  }

  return null;
}
