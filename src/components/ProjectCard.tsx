import React, { useState } from "react";
import { Card, Text, Group, Button, Grid, Modal, Image } from "@mantine/core";
import { InformativeLink, ProjectData } from "../utils/types";
import { Carousel } from "@mantine/carousel";

export default function ProjectCard({
  projectInfo,
}: {
  projectInfo: ProjectData;
}) {
  const {
    title,
    startMonth,
    endMonth,
    ongoing,
    description,
    contribution,
    images,
    links,
  } = projectInfo;

  const [opened, setOpened] = useState(false);

  return (
    <Card padding="15" radius="md" c="white">
      <Group justify="space-between" mb="10" mt="-10">
        <Text fz="22" fw={700}>
          {title}
        </Text>
        <Text
          fz={{ base: 12, sm: 16 }}
          c="gray"
          style={{ fontStyle: "italic" }}
        >
          {startMonth} - {endMonth}
          {ongoing ? ": Ongoing" : ""}
        </Text>
      </Group>

      <Grid mb="20">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Carousel withIndicators height={160} slideSize="100%">
            {images.map((image) => (
              <Carousel.Slide key={image.alt}>
                <Image src={image.src} alt={image.alt} />
              </Carousel.Slide>
            ))}
          </Carousel>
        </Grid.Col>
        <Grid.Col
          span={{ base: 12, sm: 8 }}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Text fz={{ base: 12, sm: 16 }} mb={10}>
            {description}
          </Text>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flexGrow: 1,
            }}
          >
            <Text fz={{ base: 12, sm: 16 }}>{contribution}</Text>
          </div>
        </Grid.Col>
      </Grid>

      <Group gap={10} grow>
        {links.map((linkObject: InformativeLink) => (
          <Button
            component="a"
            href={linkObject.url}
            target="_blank"
            variant="filled"
            rel="noopener noreferrer"
            key={linkObject.displayText}
          >
            {linkObject.displayText}
          </Button>
        ))}
      </Group>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="xl"
        withCloseButton={false}
      >
        <Carousel
          withIndicators
          height={400}
          slideSize="100%"
          styles={{
            control: {
              "&[data-inactive]": {
                opacity: 1,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
              },
            },
          }}
        >
          {images.map((image) => (
            <Carousel.Slide key={image.alt}>
              <Image src={image.src} alt={image.alt} fit="fill" />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Modal>
    </Card>
  );
}
