import { Card, Grid, Image, Text } from "@mantine/core";
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

      <Grid>
        <Grid.Col span={{ base: 2.5, sm: 0.75 }}>
          <a href={icon.link} target="_blank" rel="noopener noreferrer">
            <Image
              src={icon.src}
              style={{
                cursor: "pointer",
                height: "100%",
                width: "100",
                objectFit: "cover",
                aspectRatio: 1 / 1,
                borderRadius: 10,
              }}
            />
          </a>
        </Grid.Col>
        <Grid.Col span={{ base: 12 - 2.5, sm: 12 - 0.75 }}>
          <Text fz={{ base: 12, sm: 16 }} mb={10}>
            {description}
          </Text>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
