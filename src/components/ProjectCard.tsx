import React from "react";
import { Card, Text, Group, Stack, Button, Image, Grid } from "@mantine/core";

export default function ProjectCard() {
  return (
    <Card padding="lg" radius="md" c="white">
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>
          Project title
        </Text>
        <Text size="xs" c="gray">
          start date-end date
        </Text>
      </Group>

      <Grid>
        <Grid.Col span={4}>
          <Card withBorder radius="md" p="md" bg="white" c="dark">
            <Text ta="center" h={175}>
              Image carousel
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={8}>
          <Text size="sm" mb="md">
            Short description short description short description short
            description short description short description short description
            short description short description short description short
            description short description
          </Text>
        </Grid.Col>
      </Grid>

      <Text mt="lg" fw={600} mb="xs">
        What I did/am most proud of
      </Text>
      <Text size="sm">
        fill text fill text fill text fill text fill text fill text fill text
        text fill text fill text fill text fill text fill text fill text fill
        fill text fill text fill text fill text fill text fill text fill text
        text fill text fill text fill text fill text fill text fill text fill
        fill text fill text fill text fill text fill text fill text fill text
      </Text>

      <Grid>
        <Button variant="filled" color="main" radius="xl" fullWidth></Button>
      </Grid>
    </Card>
  );
}
