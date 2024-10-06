import { Text } from "@mantine/core";
import { isSmallScreen } from "../../utils/scroll";
import { useMantineTheme } from "@mantine/core";

export default function CardTitle({
  title,
  smallerText,
  linkTo,
}: {
  title: string;
  smallerText: string;
  linkTo: "none" | string;
}) {
  const theme = useMantineTheme();
  const isLink = linkTo !== "none";
  const titleSize = { base: 16, sm: 20 };
  const labelSize = { base: 12, sm: 14 };

  const highlightColor = theme.colors.main ? theme.colors.main[3] : "inherit";

  return (
    <div
      style={{
        display: "flex",
        marginTop: -10,
        justifyContent: "space-between",
        flexDirection: isSmallScreen ? "column" : "row",
      }}
    >
      <Text
        component="a"
        href={isLink ? linkTo : undefined}
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
        fz={titleSize}
        fw={700}
      >
        {title}
      </Text>

      <Text
        fz={labelSize}
        c="gray"
        mt={5}
        mb={5}
        style={{ fontStyle: "italic" }}
      >
        {smallerText}
      </Text>
    </div>
  );
}
