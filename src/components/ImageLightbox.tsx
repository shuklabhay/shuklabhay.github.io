import Lightbox from "react-spring-lightbox";
import type { ImageLightboxProps } from "../utils/types";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";

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
  images,
  currentIndex,
}: ImageLightboxProps) {
  const handleClose = () => {
    setOpened(false);
  };

  const isTouchAware = () => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(max-width: 860px)").matches ||
      window.matchMedia?.("(pointer: coarse)").matches
    );
  };

  const imageStyle: CSSProperties = {
    width: "auto",
    height: "auto",
    maxWidth: "100vw",
    maxHeight: "100dvh",
    objectFit: "contain",
    margin: "0 auto",
  };

  const activeImage = images[currentIndex];
  const lightboxImages = activeImage
    ? [{ ...activeImage, style: imageStyle, draggable: false }]
    : [];

  const handleNoop = () => {};

  const handleTintClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button !== undefined && event.button !== 0) return;

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest(".lightbox-image")) return;

    handleClose();
  };

  return (
    <div onClick={handleTintClick}>
      <Lightbox
        isOpen={opened}
        onPrev={handleNoop}
        onNext={handleNoop}
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
        singleClickToZoom={isTouchAware()}
        renderPrevButton={() => null}
        renderNextButton={() => null}
        renderFooter={() => null}
        images={lightboxImages}
        currentIndex={0}
        onClose={handleClose}
        style={{
          background: "rgba(8, 10, 18, 0.78)",
          touchAction: "none",
          overscrollBehavior: "none",
          overflow: "hidden",
        }}
        pageTransitionConfig={{
          from: { opacity: 0 },
          enter: { opacity: 1 },
          leave: { opacity: 0 },
          config: { duration: 170 },
        }}
      />
    </div>
  );
}
