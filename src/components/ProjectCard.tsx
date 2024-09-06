import { Carousel } from "@mantine/carousel";
import { Button, Card, Grid, Group, Image, Text } from "@mantine/core";
import { useState } from "react";
import { InformativeLink, ProjectData } from "../utils/types";
import ImageCarouselModal from "./ImageCarouselModal";

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <Card padding="15" radius="md" c="white">
      <Group justify="space-between" mt="-10" mb="5">
        <Text fz="22" fw={700}>
          {title}
        </Text>
        <Text
          fz={{ base: 12, sm: 14 }}
          c="gray"
          mt={{ base: "-15", sm: "-5" }}
          style={{ fontStyle: "italic" }}
        >
          {startMonth} - {endMonth}
          {ongoing ? ": Ongoing" : ""}
        </Text>
      </Group>

      <Grid mb="20">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Carousel
            withIndicators
            slideSize="100%"
            slideGap="15"
            loop
            controlSize={20}
            initialSlide={selectedImageIndex}
            onSlideChange={setSelectedImageIndex}
            styles={{
              viewport: { borderRadius: 10 },
              indicators: {
                bottom: "auto",
                top: 10,
                zIndex: 1,
                mixBlendMode: "luminosity",
              },
            }}
          >
            {images.map((image, index) => (
              <Carousel.Slide key={image.alt}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  onClick={() => {
                    setOpened(true);
                  }}
                  style={{
                    cursor: "pointer",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    aspectRatio: 10 / 7,
                    borderRadius: 10,
                  }}
                />
              </Carousel.Slide>
            ))}
          </Carousel>
        </Grid.Col>

        <Grid.Col
          span={{ base: 12, sm: 8 }}
          style={{ display: "flex", flexDirection: "column" }}
          mb={20}
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

      <ImageCarouselModal
        opened={opened}
        setOpened={setOpened}
        images={images}
        initialSlideIndex={selectedImageIndex}
        onSlideChange={setSelectedImageIndex}
      />
    </Card>
  );
}
