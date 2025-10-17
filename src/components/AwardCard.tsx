import { Card, Text } from "@mantine/core";
import React, { memo } from "react";
import { AwardItem } from "../utils/types";
import CardTitle from "./CardComponents/CardTitle";
import { isSmallScreen } from "../utils/scroll";

function AwardCard({ awardInfo }: { awardInfo: AwardItem }) {
  const { title, receivedYear } = awardInfo;

  return (
    <Card padding="16" radius="md" c="white">
      <CardTitle
        title={title}
        smallerText={receivedYear}
        mb={0}
        highlight={false}
      />
    </Card>
  );
}

export default memo(AwardCard);
