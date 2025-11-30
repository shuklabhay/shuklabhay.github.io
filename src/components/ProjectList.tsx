import { useMemo, useState, useEffect } from "react";
import BulletPointList from "./BulletPointList";
import ImageGallery from "./ImageGallery";
import ProjectCarousel from "./ProjectCarousel";
import type { RichImage, ProjectRecord } from "../utils/types";
import { BulletPoint, ABOUT_ALLOWED_TAGS } from "../utils/types";
import { selectDesired, filterItemsByDetailTags } from "../utils/tags";
import { useData } from "../pages/About";
import { formatDateRange } from "../utils/dates";

export default function ProjectList({
  selectedTags = [],
}: {
  selectedTags: string[];
}) {
  const { projects: items } = useData();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [lightboxImages, setGalleryImages] = useState<RichImage[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [thumbIndex, setThumbIndex] = useState<Record<number, number>>({});
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const THUMB_W = 192;
  const THUMB_H = 108;

  const filtered = useMemo(() => {
    const desired = selectDesired(selectedTags, ABOUT_ALLOWED_TAGS);
    if (desired.size === 0) return [] as ProjectRecord[];
    const filtered = items.filter((i: ProjectRecord) => !i.hide);
    return filterItemsByDetailTags(filtered, desired, ABOUT_ALLOWED_TAGS);
  }, [items, selectedTags]);

  const isSmallScreen = windowWidth < 768;

  return (
    <div
      style={{ display: "grid", rowGap: "1.25rem", paddingRight: "0.25rem" }}
    >
      {filtered.length !== 0 &&
        filtered.map((item, idx) => {
          const points: BulletPoint[] = item.details.map((d: any) => ({
            point: d.point,
            tags: (d.tags || []).map((t: any) => t.toLowerCase()),
          }));

          const images =
            item.images && item.images.length > 0 ? item.images : [];
          const totalImages = images.length;
          const currentThumb = thumbIndex[idx] ?? 0;
          const dateText =
            item.startYear && item.endYear !== undefined
              ? formatDateRange(item.startYear, item.endYear, isSmallScreen)
              : null;

          const hasImages = (item.images?.length ?? 0) > 0;

          const carouselComponent = hasImages ? (
            <ProjectCarousel
              images={images}
              currentThumb={currentThumb}
              totalImages={totalImages}
              isSmallScreen={isSmallScreen}
              thumbW={THUMB_W}
              thumbH={THUMB_H}
              links={item.link}
              onImageClick={() => {
                setGalleryImages(images);
                setSlideIndex(currentThumb);
                setGalleryOpen(true);
              }}
              onPrevClick={() => {
                setThumbIndex((prev) => {
                  const cur = prev[idx] ?? 0;
                  const next = (cur - 1 + totalImages) % totalImages;
                  return { ...prev, [idx]: next };
                });
              }}
              onNextClick={() => {
                setThumbIndex((prev) => {
                  const cur = prev[idx] ?? 0;
                  const next = (cur + 1) % totalImages;
                  return { ...prev, [idx]: next };
                });
              }}
            />
          ) : null;

          return (
            <div
              key={item.title}
              style={{
                display: "grid",
                gridTemplateColumns:
                  item.images && item.images.length > 0 && !isSmallScreen
                    ? `${THUMB_W}px 1fr`
                    : "1fr",
                columnGap:
                  item.images && item.images.length > 0 && !isSmallScreen
                    ? "0.75rem"
                    : 0,
                overflow: "hidden",
              }}
            >
              {!isSmallScreen && carouselComponent}

              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  {item.title}
                </h2>

                {dateText ? (
                  <div
                    style={{
                      color: "white",
                      opacity: 0.9,
                      fontSize: "1.05rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {dateText}
                  </div>
                ) : null}

                {isSmallScreen && carouselComponent ? (
                  <div style={{ marginTop: "0.5rem", marginBottom: "0.25rem" }}>
                    {carouselComponent}
                    <hr
                      style={{
                        border: "none",
                        borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                        margin: "0.5rem 0",
                      }}
                    />
                  </div>
                ) : null}

                <div
                  style={{
                    marginTop: "0.25rem",
                    marginLeft: "0.5rem",
                    marginRight: "0.5rem",
                  }}
                >
                  <BulletPointList points={points} />
                </div>
              </div>
            </div>
          );
        })}

      <ImageGallery
        opened={galleryOpen}
        setOpened={setGalleryOpen}
        images={lightboxImages}
        initialSlideIndex={slideIndex}
        setSlideIndex={setSlideIndex}
      />
    </div>
  );
}
