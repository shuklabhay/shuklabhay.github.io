import { Text } from "@mantine/core";
import { isSmallScreen } from "../../utils/scroll";
import HoverHighlightText from "../HoverHighlightText";

export default function CardTitle({
  title,
  smallerText,
  linkTo,
}: {
  title: string;
  smallerText: string;
  linkTo?: string;
}) {
  const labelSize = { base: 12, sm: 14 };

  return (
    <div
      style={{
        display: "flex",
        marginTop: -10,
        justifyContent: "space-between",
        flexDirection: isSmallScreen ? "column" : "row",
      }}
    >
      <HoverHighlightText link={linkTo} text={title} shade="light" />

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
