import { Carousel } from "@mantine/carousel";
import { Button, Card, Grid, Image, Text } from "@mantine/core";
import React, { useState } from "react";
import { ProjectItem } from "../utils/types";
import BulletPointList from "./CardComponents/BulletPointList";
import ImageLightboxGallery from "./CardComponents/ImageLightboxGallery";
import { LeftArrowIcon, RightArrowIcon } from "./IconButtons/LRArrowButton";
import CardTitle from "./CardComponents/CardTitle";
import { isSmallScreen } from "../utils/scroll";

const formatBroadDescription = (description: string) => {
  if (description.charAt(0) == "A") {
    return description.charAt(0).toLowerCase() + description.slice(1);
  }
  return description;
};

export default function ProjectCard({
  projectInfo,
}: {
  projectInfo: ProjectItem;
}) {
  const { title, broadDescription, details, images, link } = projectInfo;
  const [opened, setOpened] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const areImages = images.length !== 0;
  const isLink = link.length == 1;
  const formattedBroadDescription = formatBroadDescription(broadDescription);
  const bulletPointListHeader = () => {
    return (
      <Text fz={{ base: 14, sm: 16 }} lh={1.5}>
        {title} is {formattedBroadDescription}:
      </Text>
    );
  };

  return (
    <Card padding="15" radius="md" c="white" mb={5}>
      <div style={{ marginBottom: isSmallScreen ? 0 : 10 }}>
        <CardTitle
          title={title}
          smallerText={""}
          linkTo={isLink ? link[0].url : undefined}
        />
      </div>

      <Grid mb={areImages && isLink ? 20 : 0} mt={areImages ? 5 : 0}>
        {areImages && (
          <Grid.Col span={{ base: 12, sm: 3 }} w={"100%"}>
            <Carousel
              slideSize="100%"
              slideGap="15"
              loop
              controlSize={25}
              initialSlide={selectedImageIndex}
              onSlideChange={setSelectedImageIndex}
              previousControlIcon={<LeftArrowIcon large={false} />}
              nextControlIcon={<RightArrowIcon large={false} />}
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
        )}

        <Grid.Col span={{ base: 12, sm: areImages ? 9 : 12 }} mb={-5}>
          <BulletPointList
            HeaderComponent={bulletPointListHeader}
            details={details}
          />
        </Grid.Col>
      </Grid>

      {isLink && (
        <Button
          component="a"
          href={link[0].url}
          target="_blank"
          variant="filled"
          rel="noopener noreferrer"
          key={link[0].description}
        >
          {link[0].description}
        </Button>
      )}

      {opened && (
        <ImageLightboxGallery
          opened={opened}
          setOpened={setOpened}
          images={images}
          initialSlideIndex={selectedImageIndex}
          setSlideIndex={setSelectedImageIndex}
        />
      )}
    </Card>
  );
}
