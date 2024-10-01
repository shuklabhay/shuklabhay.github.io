import { Card, Text } from "@mantine/core";
import React from "react";
import { Skill } from "../utils/types";

export default function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Card
      padding="15"
      radius="md"
      c="white"
      h={{ base: 50, sm: 65 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text fz={{ base: 12, sm: 18 }} fw={700} ta={"center"}>
        {skill}
      </Text>
    </Card>
  );
}
