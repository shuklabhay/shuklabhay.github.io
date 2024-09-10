import { Carousel } from "@mantine/carousel";
import { Button, Card, Grid, Group, Image, List, Text } from "@mantine/core";
import { useState } from "react";
import { getTimeframeLabel } from "../../utils/dates";
import { ProjectData, RichLink } from "../../utils/types";
import CardTitle from "./CardTitle";
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

  const timeframeLabel = getTimeframeLabel(startMonth, endMonth, ongoing);

  return (
    <Card padding="15" radius="md" c="white" mb={5}>
      <CardTitle title={title} timeframe={timeframeLabel} />

      <Grid mb="20">
        <Grid.Col span={{ base: 12, sm: 4 }} w={"100%"}>
          <Carousel
            slideSize="100%"
            slideGap="15"
            loop
            controlSize={20}
            initialSlide={selectedImageIndex}
            onSlideChange={setSelectedImageIndex}
            styles={{
              viewport: { borderRadius: 10 },
              control: {
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                },
              },
            }}
          >
            {images.map((image) => (
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
                  }}
                />
              </Carousel.Slide>
            ))}
          </Carousel>
        </Grid.Col>

        <Grid.Col
          span={{ base: 12, sm: 8 }}
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          mb={20}
        >
          <Text fz={{ base: 12, sm: 16 }}>Project description:</Text>
          <List mr={15} withPadding>
            {description.map(({ point }) => (
              <List.Item key={point}>
                <Text fz={{ base: 12, sm: 16 }}>{point}</Text>
              </List.Item>
            ))}
          </List>

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
        {links.map((linkObject: RichLink) => (
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
        setSlideIndex={setSelectedImageIndex}
      />
    </Card>
  );
}
