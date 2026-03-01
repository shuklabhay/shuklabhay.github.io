import Lightbox from "react-spring-lightbox";
import type { ImageLightboxProps } from "../utils/types";
import type { CSSProperties } from "react";

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

export default function ImageLightbox({
  opened,
  setOpened,
  image,
}: ImageLightboxProps) {
  const handleClose = () => {
    setOpened(false);
  };

  const imageStyle: CSSProperties = {
    width: "auto",
    height: "auto",
    maxWidth: "calc(100vw - 2.5rem)",
    maxHeight: "calc(100dvh - 2.5rem)",
    objectFit: "contain",
    margin: "0 auto",
  };

  const images = image
    ? [
        {
          ...image,
          style: imageStyle,
          draggable: false,
        },
      ]
    : [];

  return (
    <Lightbox
      isOpen={opened}
      onPrev={() => {}}
      onNext={() => {}}
      renderHeader={() => (
        <div
          style={{
            position: "absolute",
            top: "0.9rem",
            right: "1rem",
            pointerEvents: "auto",
            zIndex: 100,
          }}
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={handleClose}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: 0,
              backgroundColor: "transparent",
              color: "white",
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}
          >
            <CloseIcon size={20} />
          </button>
        </div>
      )}
      renderPrevButton={() => null}
      renderNextButton={() => null}
      renderFooter={() => null}
      images={images}
      currentIndex={0}
      onClose={handleClose}
      style={{ background: "rgba(8, 10, 18, 0.9)" }}
      pageTransitionConfig={{
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 170 },
      }}
    />
  );
}
