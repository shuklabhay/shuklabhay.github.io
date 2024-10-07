import { Text, useMantineTheme } from "@mantine/core";

export default function HoverHighlightText({
  link,
  text,
  size,
}: {
  link?: string;
  text: string;
  size?: number;
}) {
  const isLink = link !== undefined;
  const theme = useMantineTheme();
  const highlightColor = theme.colors.main ? theme.colors.main[3] : "inherit";

  const defaultTitleSize = { base: 16, sm: 20 };

  return (
    <Text
      component="a"
      href={isLink ? link : undefined}
      target={isLink ? "_blank" : undefined}
      rel="noopener noreferrer"
      style={{
        cursor: isLink ? "pointer" : "default",
        color: "white",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => {
        if (isLink) {
          e.currentTarget.style.color = highlightColor;
        }
      }}
      onMouseLeave={(e) => {
        if (isLink) {
          e.currentTarget.style.color = "white";
        }
      }}
      fz={size ? size : defaultTitleSize}
      fw={700}
    >
      {text}
    </Text>
  );
}
