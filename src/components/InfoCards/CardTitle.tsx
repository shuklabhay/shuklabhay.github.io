import { Text } from "@mantine/core";
import { isSmallScreen } from "../../utils/scroll";

export default function CardTitle({
  title,
  timeframe,
}: {
  title: string;
  timeframe: string;
}) {
  const flexDirection = isSmallScreen ? "column" : undefined;

  return (
    <div
      style={{
        display: "flex",
        marginTop: -10,
        marginBottom: 5,
        justifyContent: "space-between",
        flexDirection: flexDirection,
      }}
    >
      <Text fz={{ base: 18, sm: 22 }} fw={700}>
        {title}
      </Text>

      <Text
        fz={{ base: 12, sm: 14 }}
        c="gray"
        mt={{ base: 0, sm: 5 }}
        px={{ base: 5, sm: 0 }}
        style={{ fontStyle: "italic" }}
      >
        {timeframe}
      </Text>
    </div>
  );
}
