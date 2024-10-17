import { Card, Text } from "@mantine/core";
import React from "react";
import { AwardItem } from "../utils/types";
import CardTitle from "./CardComponents/CardTitle";
import { isSmallScreen } from "../utils/scroll";

export default function AwardCard({ awardInfo }: { awardInfo: AwardItem }) {
  const { title, recievedYear } = awardInfo;

  return (
    <Card padding="15" radius="md" c="white">
      <CardTitle
        title={title}
        smallerText={recievedYear}
        mb={isSmallScreen ? -10 : -20}
      />
    </Card>
  );
}
