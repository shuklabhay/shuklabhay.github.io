import { Text } from "@mantine/core";
import { isSmallScreen } from "../../utils/scroll";

export default function CardTitle({
  title,
  smallerText,
}: {
  title: string;
  smallerText: string;
}) {
  const flexDirection = isSmallScreen ? "column" : undefined;

  return (
    <div
      style={{
        display: "flex",
        marginTop: -10,
        justifyContent: "space-between",
        flexDirection: flexDirection,
      }}
    >
      <Text fz={{ base: 16, sm: 20 }} fw={700}>
        {title}
      </Text>

      <Text
        fz={{ base: 12, sm: 14 }}
        c="gray"
        mt={{ base: 0, sm: 5 }}
        px={{ base: 5, sm: 0 }}
        mb={5}
        style={{ fontStyle: "italic" }}
      >
        {smallerText}
      </Text>
    </div>
  );
}
