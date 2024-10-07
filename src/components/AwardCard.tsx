import { Card, Text } from "@mantine/core";
import React from "react";
import { AwardItem } from "../utils/types";
import CardTitle from "./CardComponents/CardTitle";

export default function AwardCard({ awardInfo }: { awardInfo: AwardItem }) {
  const { title, recievedYear, description } = awardInfo;

  return (
    <Card padding="15" radius="md" c="white">
      <CardTitle title={title} smallerText={recievedYear} />

      <Text fz={{ base: 12, sm: 16 }}>{description}</Text>
    </Card>
  );
}
