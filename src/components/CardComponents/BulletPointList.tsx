import { List, Text } from "@mantine/core";
import { BulletPoint } from "../../utils/types";

export default function BulletPointList({
  HeaderComponent,
  details,
  mb = 0,
}: {
  HeaderComponent: () => React.JSX.Element;
  details: BulletPoint[];
  mb?: number;
}) {
  return (
    <>
      <HeaderComponent />
      <List mr={40} withPadding mb={mb}>
        {details.map(({ point }, index) => (
          <List.Item key={`Point ${index + 1}`}>
            <Text fz={{ base: 14, sm: 16 }} mb={{ base: 0, sm: 5 }} lh={1.5}>
              {point}
            </Text>
          </List.Item>
        ))}
      </List>
    </>
  );
}
