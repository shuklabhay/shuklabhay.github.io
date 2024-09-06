import { Group, Text } from "@mantine/core";

export default function CardTitle({
  title,
  timeframe,
}: {
  title: string;
  timeframe: string;
}) {
  return (
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
        {timeframe}
      </Text>
    </Group>
  );
}
