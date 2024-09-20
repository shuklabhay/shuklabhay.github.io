import { Carousel } from "@mantine/carousel";
import { Button, Card, Grid, Group, Image, Text } from "@mantine/core";
import { useState } from "react";
import { ProjectItem } from "../utils/types";
import BulletPointList from "./CardComponents/BulletpointList";
import CardTitle from "./CardComponents/CardTitle";
import ImageCarouselModal from "./CardComponents/ImageCarouselModal";

export default function ProjectCard({
  projectInfo,
}: {
  projectInfo: ProjectItem;
}) {
  const { title, type, broadDescription, details, images, links } = projectInfo;
  const [opened, setOpened] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  function formatBroadDescription(broadDescriptionString: string) {
    if (broadDescriptionString.length === 0) {
      return broadDescriptionString;
    }
    let modifiedStr =
      broadDescriptionString.charAt(0).toLowerCase() +
      broadDescriptionString.slice(1);

    if (modifiedStr.endsWith(".")) {
      modifiedStr = modifiedStr.slice(0, -1);
    }

    return modifiedStr;
  }

  const bulletPointListHeader = () => {
    return (
      <Text fz={{ base: 14, sm: 16 }} lh={1.5}>
        {`${title} is a ${formatBroadDescription(broadDescription)}:`}
      </Text>
    );
  };

  return (
    <Card padding="15" radius="md" c="white" mb={5}>
      <CardTitle title={title} smallerText={type} />

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

        <Grid.Col span={{ base: 12, sm: 9 }} mb={-10}>
          <BulletPointList
            HeaderComponent={bulletPointListHeader}
            details={details}
          />
        </Grid.Col>
      </Grid>

      <Group gap={10} grow>
        {links.map((linkObject) => (
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
