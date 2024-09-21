import { Card, Grid, Image, Text } from "@mantine/core";
import { getTimeframeLabel } from "../utils/dates";
import { PositionItem } from "../utils/types";
import BulletPointList from "./CardComponents/BulletPointList";
import CardTitle from "./CardComponents/CardTitle";

export default function PositionCard({
  positionInfo,
}: {
  positionInfo: PositionItem;
}) {
  const { org, position, startMonth, endMonth, ongoing, details, icon } =
    positionInfo;

  const timeframeLabel = getTimeframeLabel(startMonth, endMonth, ongoing);
  const listHeader = () => {
    return (
      <Text fz={{ base: 14, sm: 16 }} lh={1.5}>
        Experience as{" "}
        <Text span c="main.3" fw={700} inherit>
          {position}:
        </Text>
      </Text>
    );
  };

  return (
    <Card padding="15" radius="md" c="white" mb={5}>
      <CardTitle title={org} smallerText={timeframeLabel} />

      <Grid>
        <Grid.Col span={{ base: 2.5, sm: 0.75 }}>
          <a href={icon.link} target="_blank" rel="noopener noreferrer">
            <Image
              src={icon.src}
              style={{
                cursor: "pointer",
                width: "100",
                objectFit: "cover",
                aspectRatio: 1 / 1,
                borderRadius: 10,
              }}
            />
          </a>
        </Grid.Col>
        <Grid.Col span={{ base: 12 - 2.5, sm: 12 - 0.75 }} px={5}>
          <BulletPointList HeaderComponent={listHeader} details={details} />
        </Grid.Col>
      </Grid>
    </Card>
  );
}
