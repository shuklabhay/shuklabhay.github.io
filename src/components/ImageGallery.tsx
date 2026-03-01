import { useEffect, useState } from "react";
import Lightbox from "react-spring-lightbox";
import type { RichImage } from "../utils/types";

function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
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
    if (images.length <= 1) return;
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
      onPrev={() => navigateSlides(-1)}
      onNext={() => navigateSlides(1)}
      renderHeader={() => (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "1rem",
            pointerEvents: "none",
          }}
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={handleClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255, 255, 255, 0.35)",
              backgroundColor: "rgba(8, 10, 18, 0.52)",
              color: "white",
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          >
            <CloseIcon size={18} />
          </button>
        </div>
      )}
      images={images}
      currentIndex={currentSlide}
      onClose={handleClose}
      style={{ background: "rgba(10, 12, 20, 0.88)" }}
      pageTransitionConfig={{
        from: { transform: "scale(0.94)", opacity: 0 },
        enter: { transform: "scale(1)", opacity: 1 },
        leave: { transform: "scale(0.94)", opacity: 0 },
        config: { mass: 1, tension: 320, friction: 32 },
      }}
    />
  );
}
