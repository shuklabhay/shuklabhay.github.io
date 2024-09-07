import { Carousel } from "@mantine/carousel";
import { Image, Modal } from "@mantine/core";
import React from "react";
import { RichImage } from "../../utils/types";

export default function ImageCarouselModal({
  opened,
  setOpened,
  images,
  initialSlideIndex,
  onSlideChange,
}: {
  opened: boolean;
  setOpened: (value: React.SetStateAction<boolean>) => void;
  images: RichImage[];
  initialSlideIndex: number;
  onSlideChange: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <Modal opened={opened} onClose={() => setOpened(false)} size="xl" centered>
      <Carousel
        loop
        withIndicators
        height="60vh"
        slideSize="100%"
        slideGap="15"
        py={{ base: 0, sm: 20 }}
        initialSlide={initialSlideIndex}
        onSlideChange={onSlideChange}
        styles={{
          controls: {
            position: "absolute",
            botom: -10,
          },
          control: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            },
          },
        }}
      >
        {images.map((image) => (
          <Carousel.Slide key={image.alt}>
            <Image
              src={image.src}
              alt={image.alt}
              fit="contain"
              height="100%"
              width="100%"
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Modal>
  );
}
