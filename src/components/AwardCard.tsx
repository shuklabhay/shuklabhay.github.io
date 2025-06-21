import { Card, Text } from "@mantine/core";
import React from "react";
import { AwardItem } from "../utils/types";
import CardTitle from "./CardComponents/CardTitle";
import { isSmallScreen } from "../utils/scroll";

export default function AwardCard({ awardInfo }: { awardInfo: AwardItem }) {
  const { title, recievedYear } = awardInfo;

  return (
    <Card padding="16" radius="md" c="white">
      <CardTitle
        title={title}
        smallerText={recievedYear}
        mb={0}
        highlight={false}
      />
    </Card>
  );
}
