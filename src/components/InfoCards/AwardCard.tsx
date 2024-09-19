import { Card, Text } from "@mantine/core";
import { AwardItem } from "../../utils/types";
import CardTitle from "./CardTitle";

export default function AwardCard({ awardInfo }: { awardInfo: AwardItem }) {
  const { title, recievedMonth, description } = awardInfo;

  return (
    <Card padding="15" radius="md" c="white">
      <CardTitle title={title} smallerText={recievedMonth} />

      <Text fz={{ base: 12, sm: 16 }}>{description}</Text>
    </Card>
  );
}
