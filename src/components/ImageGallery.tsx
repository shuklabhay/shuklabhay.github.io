import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Lightbox from "react-spring-lightbox";
import type { RichImage } from "../utils/types";

function LeftArrowIcon({ large = true }: { large: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={large ? 24 : 18}
      height={large ? 24 : 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12l14 0" />
      <path d="M5 12l6 6" />
      <path d="M5 12l6 -6" />
    </svg>
  );
}

function RightArrowIcon({ large = true }: { large: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={large ? 24 : 18}
      height={large ? 24 : 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12l14 0" />
      <path d="M13 18l6 -6" />
      <path d="M13 6l6 6" />
    </svg>
  );
}

function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export function LRArrowButton({
  direction,
  onClick,
  large = true,
}: {
  direction: "left" | "right";
  onClick: () => void;
  large?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: large ? 42 : 28,
        height: large ? 42 : 28,
        borderRadius: large ? 12 : 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        color: "white",
        border: 0,
        cursor: "pointer",
        zIndex: 200,
        marginLeft: direction === "left" && large === true ? 24 : 0,
        marginRight: direction === "right" && large === true ? 24 : 0,
      }}
    >
      {direction === "left" ? (
        <LeftArrowIcon large={large} />
      ) : (
        <RightArrowIcon large={large} />
      )}
    </button>
  );
}

export default function ImageGallery({
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
  }, [initialSlideIndex, opened]);

  return (
    <Lightbox
      isOpen={opened}
      onPrev={() => {
        navigateSlides(-1);
      }}
      onNext={() => {
        navigateSlides(1);
      }}
      renderPrevButton={() => (
        <LRArrowButton direction="left" onClick={() => navigateSlides(-1)} />
      )}
      renderNextButton={() => (
        <LRArrowButton direction="right" onClick={() => navigateSlides(1)} />
      )}
      renderImageOverlay={() =>
        typeof document !== "undefined"
          ? createPortal(
              <>
                <div
                  style={{
                    position: "fixed",
                    bottom: "5vh",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    padding: "8px 10px",
                    borderRadius: 8,
                    width: "min(720px, 80vw)",
                    textAlign: "center",
                    pointerEvents: "none",
                    fontSize: "1rem",
                    lineHeight: 1.25,
                    zIndex: 1000,
                  }}
                >
                  {images[currentSlide] ? images[currentSlide].alt : ""}
                </div>

                <button
                  type="button"
                  aria-label="Close"
                  onClick={handleClose}
                  style={{
                    position: "fixed",
                    top: 16,
                    right: 16,
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255,255,255,0.12)",
                    color: "white",
                    border: 0,
                    cursor: "pointer",
                    zIndex: 1100,
                  }}
                >
                  <CloseIcon size={18} />
                </button>
              </>,
              document.body,
            )
          : null
      }
      images={images}
      currentIndex={currentSlide}
      onClose={handleClose}
      style={{ background: "rgba(15, 15, 15, 0.7)" }}
      singleClickToZoom
      pageTransitionConfig={{
        from: { opacity: 1 },
        enter: { opacity: 1 },
        leave: { opacity: 1 },
      }}
    />
  );
}
