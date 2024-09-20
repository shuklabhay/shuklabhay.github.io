import { Carousel } from "@mantine/carousel";
import { Image, Modal } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { RichImage } from "../../utils/types";

export default function ImageCarouselModal({
  opened,
  setOpened,
  images,
  initialSlideIndex,
  setSlideIndex,
}: {
  opened: boolean;
  setOpened: (value: React.SetStateAction<boolean>) => void;
  images: RichImage[];
  initialSlideIndex: number;
  setSlideIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [currentSlide, setCurrentSlide] = useState(initialSlideIndex);

  const handleClose = () => {
    setOpened(false);
    setSlideIndex(currentSlide);
  };

  useEffect(() => {
    if (!opened) {
      setCurrentSlide(initialSlideIndex);
    }
  }, [initialSlideIndex]);

  return (
    <Modal opened={opened} onClose={() => handleClose()} size={"xl"} centered>
      <Carousel
        loop
        withIndicators
        height="60vh"
        slideSize="100%"
        slideGap="15"
        controlSize={25}
        initialSlide={currentSlide}
        onSlideChange={setCurrentSlide}
        styles={{
          controls: {
            position: "relative",
          },
          control: {
            marginTop: 10,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 1)",
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
