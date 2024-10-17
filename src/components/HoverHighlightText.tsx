import { Text, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { isSmallScreen } from "../utils/scroll";

export default function HoverHighlightText({
  link,
  text,
  size,
  shade,
  highlight = true,
  onClick,
}: {
  link?: string;
  text: string;
  size?: number | "inherit";
  shade?: "light" | "normal" | "dark";
  highlight?: boolean;
  onClick?: () => void;
}) {
  const isLink = link !== undefined;
  const theme = useMantineTheme();
  const defaultTitleSize = { base: 16, sm: 20 };

  let shadeNumber = 4;
  switch (shade) {
    case "light":
      shadeNumber = 3;
      break;
    case "normal":
      shadeNumber = 4;
      break;
    case undefined:
      shadeNumber = 4;
      break;
    case "dark":
      shadeNumber = 5;
      break;
  }
  const highlightColor =
    theme.colors.main && theme.colors.main[shadeNumber] && highlight
      ? theme.colors.main[shadeNumber] || "inherit"
      : "inherit";

  const [color, setColor] = useState("white");

  useEffect(() => {
    const handleBlur = () => setColor("white");

    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const handleClick = () => {
    setColor("white");
    if (onClick) {
      onClick();
    }
  };

  return (
    <Text
      component="a"
      href={isLink ? link : undefined}
      target={isLink ? "_blank" : undefined}
      rel="noopener noreferrer"
      c={color}
      style={{
        cursor: highlight ? "pointer" : undefined,
        transition: "color 0.2s",
      }}
      onClick={handleClick}
      onMouseEnter={() => setColor(highlightColor)}
      onMouseLeave={() => setColor("white")}
      fz={size ? size : defaultTitleSize}
      fw={700}
      mb={isSmallScreen ? 0 : -10}
    >
      {text}
    </Text>
  );
}
