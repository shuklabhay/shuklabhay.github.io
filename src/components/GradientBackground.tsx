import { Stack } from "@mantine/core";
import { useEffect, useState } from "react";

export function GradientBackground() {
  const [fadeStart, setFadeStart] = useState(100);

  useEffect(() => {
    const handleScroll = () => {
      const value = Math.max(100 - window.scrollY / 10, 0);
      setFadeStart(value);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const useMask = fadeStart < 100;
  const mask = `linear-gradient(to bottom, black ${fadeStart}%, transparent 100%)`;

  return (
    <Stack
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        ...(useMask && {
          maskImage: mask,
          WebkitMaskImage: mask,
        }),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(-54deg, #06300d -50%, #9A37FD 55%, #D60DC4 75%, #E7F26D 100%)",
          filter: "blur(120px)",
          transform: "translateZ(0)",
          zIndex: -3,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "120vmin",
          height: "120vmin",
          top: "-40vmin",
          right: "-20vmin",
          background: "#ABE4FF",
          borderRadius: "50%",
          mixBlendMode: "overlay",
          filter: "blur(160px)",
          zIndex: -2,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "120vmin",
          height: "120vmin",
          bottom: "-40vmin",
          left: "-20vmin",
          background: "#420084",
          borderRadius: "50%",
          mixBlendMode: "overlay",
          filter: "blur(160px)",
          zIndex: -1,
        }}
      />
    </Stack>
  );
}
