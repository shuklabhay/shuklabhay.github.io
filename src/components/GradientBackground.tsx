import { Stack } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import {
  calculateScrollProgressOpacity,
  scrollViewportTo,
} from "../utils/scroll";
import { useAppContext } from "../utils/appContext";
import DownArrowButton from "./IconButtons/DownArrowButton";

export function GradientBackground() {
  const { scrollInformation } = useAppContext();
  const [gradientOpacity, setGradientOpacity] = useState(1);
  const [arrowInOpacity, setArrowInOpacity] = useState(0);
  const nextSectionStart = scrollInformation.skillsPosition;

  const handleArrowClick = useCallback(() => {
    scrollViewportTo(nextSectionStart);
  }, [nextSectionStart]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollProgress =
        nextSectionStart !== 0
          ? calculateScrollProgressOpacity(nextSectionStart)
          : 1;
      setGradientOpacity(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const arrowFadeInTimer = setTimeout(() => {
      setArrowInOpacity(1);
    }, 750);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(arrowFadeInTimer);
    };
  }, [nextSectionStart]);

  const colorPalette = {
    deepPurple: ["#4338CA", "#5B21B6"],
    richPurple: ["#7C3AED", "#8B5CF6", "#A855F7"],
    vibrantBlue: ["#1D4ED8", "#2563EB", "#3B82F6"],
    saturatedBlue: ["#1E40AF", "#2563EB", "#60A5FA"],
    mediumPurple: ["#9333EA", "#A855F7", "#A462F5"],
    lightBlue: ["#60A5FA", "#6FA8FC", "#8FB5FD"],
    accent: ["#B8C4F0"],
  };

  const gradientLayers = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: gradientOpacity,
    transition: "opacity 0.3s ease",
    zIndex: -1,
  };

  const grainOverlay = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.3 * gradientOpacity,
    mixBlendMode: "overlay" as const,
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.45' numOctaves='8' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    filter: "contrast(1.2) brightness(1.05) saturate(1.1) blur(0.5px)",
    pointerEvents: "none" as const,
    transition: "opacity 0.3s ease",
  };

  return (
    <Stack
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          ...gradientLayers,
          background: `linear-gradient(135deg, ${colorPalette.deepPurple[0]} 0%, ${colorPalette.deepPurple[1]} 100%)`,
        }}
      />

      <div
        style={{
          ...gradientLayers,
          background: `
            radial-gradient(circle 1000px, ${colorPalette.richPurple[0]} 0%, ${colorPalette.richPurple[0]}22 40%, transparent 85%),
            radial-gradient(circle 1200px, ${colorPalette.saturatedBlue[0]} 0%, ${colorPalette.saturatedBlue[0]}18 45%, transparent 90%),
            radial-gradient(circle 800px, ${colorPalette.mediumPurple[0]} 0%, ${colorPalette.mediumPurple[0]}25 35%, transparent 80%)
          `,
          backgroundSize: "200% 200%, 250% 250%, 180% 180%",
          animation: "moveBackground1 120s ease-in-out infinite",
        }}
      />

      <div
        style={{
          ...gradientLayers,
          background: `
            radial-gradient(circle 1100px, ${colorPalette.richPurple[1]} 0%, ${colorPalette.richPurple[1]}20 42%, transparent 88%),
            radial-gradient(circle 900px, ${colorPalette.vibrantBlue[1]} 0%, ${colorPalette.vibrantBlue[1]}16 38%, transparent 82%),
            radial-gradient(circle 700px, ${colorPalette.lightBlue[0]} 0%, ${colorPalette.lightBlue[0]}28 32%, transparent 78%)
          `,
          backgroundSize: "220% 220%, 190% 190%, 160% 160%",
          animation: "moveBackground2 150s ease-in-out infinite",
          animationDelay: "-8s",
        }}
      />

      <div
        style={{
          ...gradientLayers,
          background: `
            radial-gradient(circle 600px, ${colorPalette.mediumPurple[1]}77 0%, ${colorPalette.mediumPurple[1]}33 28%, transparent 75%),
            radial-gradient(circle 800px, ${colorPalette.saturatedBlue[2]}55 0%, ${colorPalette.saturatedBlue[2]}22 35%, transparent 80%),
            radial-gradient(circle 500px, ${colorPalette.lightBlue[1]}66 0%, ${colorPalette.lightBlue[1]}28 25%, transparent 70%)
          `,
          backgroundSize: "150% 150%, 170% 170%, 130% 130%",
          animation: "moveBackground3 100s ease-in-out infinite",
          animationDelay: "-12s",
        }}
      />

      <div style={grainOverlay} />

      <div
        style={{
          ...gradientLayers,
          background: "rgba(121, 0, 208, 0.25)",
          mixBlendMode: "multiply" as const,
        }}
      />

      <style>{`
        @keyframes moveBackground1 {
          0% {
            background-position: 40% 40%, 80% 80%, 50% 50%;
          }
          25% {
            background-position: 50% 60%, 70% 30%, 60% 40%;
          }
          50% {
            background-position: 60% 50%, 30% 70%, 40% 60%;
          }
          75% {
            background-position: 50% 70%, 40% 20%, 80% 40%;
          }
          100% {
            background-position: 40% 40%, 80% 80%, 50% 50%;
          }
        }

        @keyframes moveBackground2 {
          0% {
            background-position: 60% 50%, 20% 70%, 60% 40%;
          }
          20% {
            background-position: 50% 65%, 35% 25%, 30% 65%;
          }
          40% {
            background-position: 45% 55%, 75% 40%, 85% 25%;
          }
          60% {
            background-position: 55% 45%, 55% 75%, 25% 75%;
          }
          80% {
            background-position: 65% 60%, 15% 30%, 70% 50%;
          }
          100% {
            background-position: 60% 50%, 20% 70%, 60% 40%;
          }
        }

        @keyframes moveBackground3 {
          0% {
            background-position: 20% 90%, 80% 10%, 10% 40%;
          }
          30% {
            background-position: 90% 20%, 10% 80%, 85% 65%;
          }
          60% {
            background-position: 5% 80%, 95% 20%, 35% 15%;
          }
          90% {
            background-position: 75% 45%, 25% 55%, 70% 85%;
          }
          100% {
            background-position: 20% 90%, 80% 10%, 10% 40%;
          }
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <DownArrowButton
          onClick={handleArrowClick}
          opacity={Math.min(arrowInOpacity, gradientOpacity)}
        />
      </div>
    </Stack>
  );
}
