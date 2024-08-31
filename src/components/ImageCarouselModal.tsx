import React, { useState, useEffect } from "react";
import { Modal, Image } from "@mantine/core";
import { InformativeImage } from "../utils/types";
import { Carousel } from "@mantine/carousel";

export default function ImageCarouselModal({
  opened,
  setOpened,
  images,
  initialSlideIndex,
  onSlideChange,
}: {
  opened: boolean;
  setOpened: (value: React.SetStateAction<boolean>) => void;
  images: InformativeImage[];
  initialSlideIndex: number;
  onSlideChange: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      size="xl"
      centered
      withCloseButton={false}
    >
      <Carousel
        loop
        withIndicators
        height="60vh"
        slideSize="100%"
        styles={{
          root: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          },
          control: {
            "&[data-inactive]": {
              opacity: 1,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            },
          },
          slide: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          indicators: {
            bottom: "auto",
            top: 10,
            zIndex: 1,
            mixBlendMode: "luminosity",
          },
        }}
        py={{ base: 0, sm: 20 }}
        initialSlide={initialSlideIndex}
        onSlideChange={onSlideChange}
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
