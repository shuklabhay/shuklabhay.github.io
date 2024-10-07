import { Card, CloseButton, Grid, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { RichImage } from "../../utils/types";
import Lightbox from "react-spring-lightbox";
import LRArrowButton from "../IconButtons/LRArrowButton";

function LightboxHeader({
  images,
  currentIndex,
  onClose,
}: {
  images: RichImage[];
  currentIndex: number;
  onClose: () => void;
}) {
  const titleText = images[currentIndex]?.alt;
  return (
    <Card
      style={{
        position: "relative",
        textAlign: "center",
        padding: 10,
        backgroundColor: "rgba(100, 100, 100, 0.5)",
        marginTop: 10,
        marginInline: 10,
        borderRadius: 50,
        justifyContent: "center",
        zIndex: 200,
      }}
    >
      <Text size="lg" mr={25} ml={25}>
        {titleText}
      </Text>

      <CloseButton
        size="md"
        onClick={onClose}
        variant="transparent"
        style={{
          position: "absolute",
          right: "10px",
        }}
      />
    </Card>
  );
}

export default function ImageLightboxGallery({
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

  const navigateSlides = (scrollAmount: number) => {
    setCurrentSlide((prevSlide) => {
      const newSlide = (prevSlide + scrollAmount) % images.length;
      return newSlide < 0 ? images.length - 1 : newSlide;
    });
  };

  useEffect(() => {
    if (!opened) {
      setCurrentSlide(initialSlideIndex);
    }
  }, [initialSlideIndex]);

  return (
    <Lightbox
      isOpen={opened}
      onPrev={() => {
        navigateSlides(-1);
      }}
      onNext={() => {
        navigateSlides(1);
      }}
      images={images}
      currentIndex={currentSlide}
      onClose={handleClose}
      renderHeader={() => (
        <LightboxHeader
          images={images}
          currentIndex={currentSlide}
          onClose={handleClose}
        />
      )}
      renderPrevButton={() => (
        <LRArrowButton
          direction="left"
          onClick={() => {
            navigateSlides(-1);
          }}
        />
      )}
      renderNextButton={() => (
        <LRArrowButton
          direction="right"
          onClick={() => {
            navigateSlides(1);
          }}
        />
      )}
      style={{ background: "rgba(15, 15, 15, 0.7)" }}
      singleClickToZoom
      pageTransitionConfig={{
        from: { opacity: 0 },
        enter: { transform: "scale(1)", opacity: 1 },
        leave: { transform: "scale(0.55)", opacity: 0 },
        config: { mass: 1, tension: 320, friction: 32 },
      }}
    />
  );
}
