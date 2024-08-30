import React from "react";
import {
  Card,
  Text,
  Group,
  Stack,
  Button,
  Image,
  Grid,
  Space,
} from "@mantine/core";

export default function ProjectCard() {
  return (
    <Card padding="15" radius="md" c="white">
      <Group justify="space-between" mb="10" mt="-10">
        <Text fz="22" fw={700}>
          Project title
        </Text>
        <Text fz={{ base: 12, sm: 16 }} c="gray">
          start date - end date
        </Text>
      </Group>

      <Grid mb="20">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card
            withBorder
            radius="md"
            p="md"
            bg="white"
            c="dark"
            style={{ aspectRatio: 5 / 3 }}
          >
            <Text ta="center">Image carousel</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 8 }}>
          <Text fz={{ base: 12, sm: 16 }} mb={10}>
            dscription fill text fill text fill text fill text fill text fill
            text fill text text fill text fill text fill text fill text fill
            text fill text fill fill text fill text fill text fill text fill
            text fill text fill text text fill text fill text fill text fill
            text fill text fill text fill fill text fill text fill text fill
            text fill text fill text fill text
          </Text>
          <Text fz={{ base: 12, sm: 16 }}>
            my contrib/stuff learned fill text fill text fill text fill text
            fill text fill text fill text text fill text fill text fill text
            fill text fill text fill text fill fill text fill text fill text
            fill text fill text fill text fill text text fill text fill text
            fill text fill text fill text fill text fill fill text fill text
            fill text fill text fill text fill text fill text
          </Text>
        </Grid.Col>
      </Grid>

      <Group gap={10} grow>
        <Button variant="filled">button1</Button>

        <Button variant="filled">button1</Button>

        <Button variant="filled">button1</Button>
      </Group>
    </Card>
  );
}
