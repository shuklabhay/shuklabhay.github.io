import { Card, Grid, Image, Text } from "@mantine/core";
import React from "react";
import { getTimeframeLabel } from "../utils/dates";
import { isSmallScreen } from "../utils/scroll";
import { ActivityItem } from "../utils/types";
import BulletPointList from "./CardComponents/BulletPointList";
import CardTitle from "./CardComponents/CardTitle";

export default function ActivityCard({
  activityInfo,
}: {
  activityInfo: ActivityItem;
}) {
  const { org, position, startMonth, endMonth, ongoing, details, icon } =
    activityInfo;

  const timeframeLabel = getTimeframeLabel(startMonth, endMonth, ongoing);
  const ListHeader = () => {
    return (
      <Text fz={{ base: 14, sm: 16 }} lh={1.5}>
        <Text span c="main.3" fw={700} inherit>
          {position}
        </Text>
      </Text>
    );
  };

  const OrgImage = () => {
    return (
      <a href={icon.link} target="_blank" rel="noopener noreferrer">
        <Image
          src={icon.src}
          style={{
            cursor: "pointer",
            width: "100%",
            objectFit: "cover",
            aspectRatio: 1 / 1,
            borderRadius: 10,
          }}
        />
      </a>
    );
  };

  const CardHeader = () => {
    if (isSmallScreen) {
      return (
        <Grid>
          <Grid.Col span={2} mt={-5}>
            <OrgImage />
          </Grid.Col>
          <Grid.Col span={10} mx={-5}>
            <CardTitle title={org} smallerText={timeframeLabel} />
          </Grid.Col>
        </Grid>
      );
    } else {
      return <CardTitle title={org} smallerText={timeframeLabel} />;
    }
  };

  const InfoGrid = () => {
    if (isSmallScreen) {
      return (
        <Grid>
          <Grid.Col span={12} px={5}>
            <BulletPointList HeaderComponent={ListHeader} details={details} />
          </Grid.Col>
        </Grid>
      );
    } else {
      return (
        <Grid>
          <Grid.Col span={{ base: 2.5, sm: 0.75 }}>
            <OrgImage />
          </Grid.Col>
          <Grid.Col span={{ base: 12 - 2.5, sm: 12 - 0.75 }} px={5}>
            <BulletPointList HeaderComponent={ListHeader} details={details} />
          </Grid.Col>
        </Grid>
      );
    }
  };

  return (
    <Card padding="15" radius="md" c="white" mb={5}>
      <CardHeader />

      <InfoGrid />
    </Card>
  );
}
