import { Carousel } from "@mantine/carousel";
import { Button, Card, Grid, Group, Image, List, Text } from "@mantine/core";
import { useState } from "react";
import { ProjectItem, RichLink } from "../../utils/types";
import CardTitle from "./CardTitle";
import ImageCarouselModal from "./ImageCarouselModal";

export default function ProjectCard({
  projectInfo,
}: {
  projectInfo: ProjectItem;
}) {
  const { title, description, images, links } = projectInfo;
  const [opened, setOpened] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <Card padding="15" radius="md" c="white" mb={5}>
      <CardTitle title={title} timeframe={""} />

      <Grid mb="20">
        <Grid.Col span={{ base: 12, sm: 3 }} w={"100%"}>
          <Carousel
            slideSize="100%"
            slideGap="15"
            loop
            controlSize={25}
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
                    aspectRatio: 10 / 6,
                  }}
                />
              </Carousel.Slide>
            ))}
          </Carousel>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 9 }} mb={5}>
          <Text fz={{ base: 12, sm: 16 }}>Project breakdown:</Text>
          <List mr={15} withPadding>
            {description.map(({ point }, index) => (
              <List.Item key={`Point ${index + 1}`}>
                <Text fz={{ base: 12, sm: 16 }} mb={5}>
                  {point}
                </Text>
              </List.Item>
            ))}
          </List>
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
