import { useMantineTheme } from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import { useScrollContext } from "../utils/scrollContext";
import { hexToRgb } from "../utils/theme";

const gradientAngleRange = 30;
const gradientAngle =
  Math.random() * (2 * gradientAngleRange) + (180 - gradientAngleRange);
const startX = Math.random() * 90;
const startY = Math.random() * 90;

export function HomeBackground() {
  const { scrollInformation } = useScrollContext();
  const theme = useMantineTheme();
  const [gradientActiveX, setGradientActiveX] = useState(startX);
  const [gradientActiveY, setGradientActiveY] = useState(startY);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [isMouseInactive, setIsMouseInactive] = useState(false);

  const mouseTimer = useRef<number | undefined>(undefined);
  const animationRef = useRef<number | undefined>(undefined);
  const lastUpdateTime = useRef(Date.now());
  const direction = useRef({ x: 0, y: 0 });
  const directionDuration = useRef(0);
  const lastActivePosition = useRef({ x: startX, y: startY });

  useEffect(() => {
    let targetX = startX;
    let targetY = startY;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrollOpacity(
        1 - Math.min(1.2 * (scrollTop / scrollInformation.projectsPosition), 1)
      );
    };

    const handleMouseMove = (event: MouseEvent) => {
      targetX = (event.clientX / window.innerWidth) * 100;
      targetY = (event.clientY / window.innerHeight) * 100;
      lastActivePosition.current = { x: targetX, y: targetY };
      setIsMouseInactive(false);
      clearTimeout(mouseTimer.current);
      mouseTimer.current = setTimeout(() => setIsMouseInactive(true), 5000);
    };

    const changeDirection = () => {
      const angle = Math.random() * 2 * Math.PI;
      direction.current = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
      const magnitude = Math.sqrt(
        direction.current.x ** 2 + direction.current.y ** 2
      );
      direction.current.x /= magnitude;
      direction.current.y /= magnitude;
      directionDuration.current = Math.random() * 5000 + 3000;
    };

    const animateGradient = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime.current;
      lastUpdateTime.current = currentTime;

      if (isMouseInactive) {
        if (currentTime - lastUpdateTime.current > directionDuration.current) {
          changeDirection();
        }

        const speed = 0.03;
        targetX += direction.current.x * speed * deltaTime;
        targetY += direction.current.y * speed * deltaTime;

        if (targetX < 0 || targetX > 100) {
          direction.current.x *= -1;
          targetX = Math.max(0, Math.min(100, targetX));
        }
        if (targetY < 0 || targetY > 100) {
          direction.current.y *= -1;
          targetY = Math.max(0, Math.min(100, targetY));
        }
      } else {
        targetX = lastActivePosition.current.x;
        targetY = lastActivePosition.current.y;
      }

      const followSpeed = 0.01;
      setGradientActiveX((prev) => prev + (targetX - prev) * followSpeed);
      setGradientActiveY((prev) => prev + (targetY - prev) * followSpeed);

      animationRef.current = requestAnimationFrame(animateGradient);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    animationRef.current = requestAnimationFrame(animateGradient);

    handleScroll();
    changeDirection();

    return () => {
      if (animationRef.current && mouseTimer.current) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("scroll", handleScroll);
        clearTimeout(mouseTimer.current);
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMouseInactive, scrollInformation.projectsPosition]);

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
          at ${gradientActiveX}% ${gradientActiveY}%,
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
            opacity: scrollOpacity,
            transition: "opacity 0.3s ease",
            clipPath: "inset(0 0 0 0)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: `rgb(0, 0, 0, ${scrollOpacity * 0.2})`,
          }}
        />
      </>
    );
  }

  return null;
}
