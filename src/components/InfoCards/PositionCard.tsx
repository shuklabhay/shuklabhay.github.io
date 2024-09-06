import { Card, Text } from "@mantine/core";
import { PositionsData } from "../../utils/types";
import CardTitle from "./CardTitle";

export default function PositionCard({
  positionInfo,
}: {
  positionInfo: PositionsData;
}) {
  const { title, startMonth, endMonth, ongoing, description, icon } =
    positionInfo;

  const timeframeLabel = `${startMonth} - ${endMonth}${ongoing ? ": Ongoing" : ""}`;

  return (
    <Card padding="15" radius="md" c="white">
      <CardTitle title={title} timeframe={timeframeLabel} />

      <Text fz={{ base: 12, sm: 16 }} mb={10} style={{ paddingInline: 5 }}>
        {description}
      </Text>
    </Card>
  );
}
