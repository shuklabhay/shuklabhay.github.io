import { Card, Group, Text } from "@mantine/core";
import { AwardData } from "../utils/types";

export default function AwardCard({ awardInfo }: { awardInfo: AwardData }) {
  const { title, recievedMonth, description } = awardInfo;

  return (
    <Card padding="15" radius="md" c="white">
      <Group justify="space-between" mt="-10" mb="5">
        <Text fz="22" fw={700}>
          {title}
        </Text>
        <Text
          fz={{ base: 12, sm: 14 }}
          c="gray"
          mt={{ base: "-15", sm: "-5" }}
          style={{ fontStyle: "italic" }}
        >
          {recievedMonth}
        </Text>
      </Group>

      <Text fz={{ base: 12, sm: 16 }} mb={10} style={{ paddingInline: 5 }}>
        {description}
      </Text>
    </Card>
  );
}
