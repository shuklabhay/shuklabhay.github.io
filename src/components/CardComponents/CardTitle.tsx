import { Text } from "@mantine/core";
import { isSmallScreen } from "../../utils/scroll";

export default function CardTitle({
  title,
  smallerText,
}: {
  title: string;
  smallerText: string;
}) {
  const titleSize = { base: 16, sm: 20 };
  const labelSize = { base: 12, sm: 14 };

  if (isSmallScreen) {
    return (
      <div
        style={{
          display: "flex",
          marginTop: -10,
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <Text fz={titleSize} fw={700}>
          {title}
        </Text>

        <Text
          fz={labelSize}
          c="gray"
          px={5}
          mb={5}
          style={{ fontStyle: "italic" }}
        >
          {smallerText}
        </Text>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          marginTop: -10,
          justifyContent: "space-between",
        }}
      >
        <Text fz={titleSize} fw={700}>
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
}
