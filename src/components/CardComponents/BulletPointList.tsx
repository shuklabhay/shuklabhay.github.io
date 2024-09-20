import { List, Text } from "@mantine/core";
import { BulletPoint } from "../../utils/types";

export default function BulletPointList({
  header,
  details,
}: {
  header: string;
  details: BulletPoint[];
}) {
  return (
    <>
      <Text fz={{ base: 12, sm: 16 }}>{header}</Text>
      <List mr={40} withPadding>
        {details.map(({ point }, index) => (
          <List.Item key={`Point ${index + 1}`}>
            <Text fz={{ base: 12, sm: 16 }} mb={5}>
              {point}
            </Text>
          </List.Item>
        ))}
      </List>
    </>
  );
}
