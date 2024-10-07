import { Text, useMantineTheme } from "@mantine/core";

export default function HoverHighlightText({
  link,
  text,
  size,
  shade,
  onClick,
}: {
  link?: string;
  text: string;
  size?: number | "inherit";
  shade?: "light" | "normal" | "dark";
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
  const highlightColor = theme.colors.main
    ? theme.colors.main[shadeNumber] || "inherit"
    : "inherit";

  return (
    <Text
      component="a"
      href={isLink ? link : undefined}
      target={isLink ? "_blank" : undefined}
      rel="noopener noreferrer"
      c={"white"}
      style={{
        cursor: isLink ? "pointer" : "default",
        transition: "color 0.2s",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = highlightColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "white";
      }}
      fz={size ? size : defaultTitleSize}
      fw={700}
    >
      {text}
    </Text>
  );
}
