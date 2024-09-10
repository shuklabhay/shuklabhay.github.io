import { Card, Text } from "@mantine/core";
import { AwardData } from "../../utils/types";
import CardTitle from "./CardTitle";

export default function AwardCard({ awardInfo }: { awardInfo: AwardData }) {
  const { title, recievedMonth, description } = awardInfo;

  return (
    <Card padding="15" radius="md" c="white" mb={5}>
      <CardTitle title={title} timeframe={recievedMonth} />

      <Text fz={{ base: 12, sm: 16 }} mb={10}>
        {description}
      </Text>
    </Card>
  );
}
