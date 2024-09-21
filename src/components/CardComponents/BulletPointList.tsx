import { List, Text } from "@mantine/core";
import { BulletPoint } from "../../utils/types";

export default function BulletPointList({
  HeaderComponent,
  details,
}: {
  HeaderComponent: () => React.JSX.Element;
  details: BulletPoint[];
}) {
  return (
    <>
      <HeaderComponent />
      <List mr={40} withPadding>
        {details.map(({ point }, index) => (
          <List.Item key={`Point ${index + 1}`}>
            <Text fz={{ base: 12, sm: 16 }} mb={{ base: 0, sm: 5 }}>
              {point}
            </Text>
          </List.Item>
        ))}
      </List>
    </>
  );
}
