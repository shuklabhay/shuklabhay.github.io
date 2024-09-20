import { Text } from "@mantine/core";
import { getTimeframeLabel } from "../../utils/dates";
import { isSmallScreen } from "../../utils/scroll";

export default function PositionCardTitle({
  org,
  position,
  startMonth,
  endMonth,
  ongoing,
}: {
  org: string;
  position: string;
  startMonth: string;
  endMonth: string;
  ongoing: boolean;
}) {
  const flexDirection = isSmallScreen ? "column" : undefined;
  const timeframeLabel = getTimeframeLabel(startMonth, endMonth, ongoing);

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
      <div>
        <Text fz={{ base: 16, sm: 20 }} fw={700}>
          {org}
        </Text>

        <Text fz={{ base: 14, sm: 16 }} px={5}>
          {position}
        </Text>
      </div>

      <Text
        fz={{ base: 12, sm: 14 }}
        c="gray"
        mt={{ base: 0, sm: 5 }}
        px={{ base: 5, sm: 0 }}
        style={{ fontStyle: "italic" }}
      >
        {timeframeLabel}
      </Text>
    </div>
  );
}
