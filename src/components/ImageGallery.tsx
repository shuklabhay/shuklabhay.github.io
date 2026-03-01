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
  image,
}: {
  opened: boolean;
  setOpened: (value: React.SetStateAction<boolean>) => void;
  image: RichImage | null;
}) {
  const handleClose = () => {
    setOpened(false);
  };

  const images = image ? [image] : [];

  return (
    <Lightbox
      isOpen={opened}
      onPrev={() => {}}
      onNext={() => {}}
      renderHeader={() => (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "1rem",
            pointerEvents: "auto",
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
