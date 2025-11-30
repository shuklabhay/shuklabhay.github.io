import { LRArrowButton } from "./ImageGallery";
import type { RichImage } from "../utils/types";

interface ProjectCarouselProps {
  images: RichImage[];
  currentThumb: number;
  totalImages: number;
  isSmallScreen: boolean;
  thumbW: number;
  thumbH: number;
  links?: { url: string; description: string }[];
  onImageClick: () => void;
  onPrevClick: () => void;
  onNextClick: () => void;
}

export default function ProjectCarousel({
  images,
  currentThumb,
  totalImages,
  isSmallScreen,
  thumbW,
  thumbH,
  links,
  onImageClick,
  onPrevClick,
  onNextClick,
}: ProjectCarouselProps) {
  const currentImage =
    images.length > 0
      ? images[((currentThumb % totalImages) + totalImages) % totalImages]
      : null;

  return (
    <div style={{ width: isSmallScreen ? "100%" : thumbW }}>
      <div
        style={{
          position: "relative",
          width: isSmallScreen ? "100%" : thumbW,
        }}
      >
        <button
          type="button"
          onClick={onImageClick}
          style={{
            width: isSmallScreen ? "100%" : thumbW,
            height: isSmallScreen ? "auto" : thumbH,
            aspectRatio: isSmallScreen ? `${thumbW} / ${thumbH}` : undefined,
            borderRadius: 6,
            overflow: "hidden",
            padding: 0,
            border: 0,
            cursor: "pointer",
            background: "none",
            display: "block",
          }}
        >
          {currentImage ? (
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : null}
        </button>

        {totalImages > 1 ? (
          <>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 4,
                transform: "translateY(-50%)",
                zIndex: 2,
              }}
            >
              <LRArrowButton
                direction="left"
                onClick={onPrevClick}
                large={false}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: 4,
                transform: "translateY(-50%)",
                zIndex: 2,
              }}
            >
              <LRArrowButton
                direction="right"
                onClick={onNextClick}
                large={false}
              />
            </div>
          </>
        ) : null}
      </div>

      {links && links.length > 0 ? (
        <div
          style={{
            marginTop: 8,
            display: "grid",
            rowGap: 8,
          }}
        >
          {links.map((l, i) => (
            <a
              key={i}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "white",
                textDecoration: "none",
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.25)",
                padding: "0.25rem 0.5rem",
                borderRadius: 6,
                fontSize: "0.9rem",
                lineHeight: 1.1,
                display: "block",
                width: "100%",
                boxSizing: "border-box",
                textAlign: "center",
              }}
            >
              {l.description}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
