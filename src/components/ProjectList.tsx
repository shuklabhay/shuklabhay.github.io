import { useMemo, useState, useEffect } from "react";
import BulletPointList from "./BulletPointList";
import ImageGallery, { LRArrowButton } from "./ImageGallery";
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
          const currentImage =
            item.images && item.images.length > 0
              ? images[
                  ((currentThumb % totalImages) + totalImages) % totalImages
                ]
              : null;
          const dateText =
            item.startYear && item.endYear !== undefined
              ? formatDateRange(item.startYear, item.endYear, isSmallScreen)
              : null;

          return (
            <div
              key={item.title}
              style={{
                display: "grid",
                gridTemplateColumns:
                  item.images && item.images.length > 0
                    ? `${THUMB_W}px 1fr`
                    : "1fr",
                columnGap:
                  item.images && item.images.length > 0 ? "0.75rem" : 0,
                overflow: "hidden",
              }}
            >
              {(item.images?.length ?? 0) > 0 ? (
                <div style={{ width: THUMB_W }}>
                  <div style={{ position: "relative", width: THUMB_W }}>
                    <button
                      type="button"
                      onClick={() => {
                        setGalleryImages(images);
                        setSlideIndex(currentThumb);
                        setGalleryOpen(true);
                      }}
                      style={{
                        width: THUMB_W,
                        height: THUMB_H,
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
                            onClick={() => {
                              setThumbIndex((prev) => {
                                const cur = prev[idx] ?? 0;
                                const next =
                                  (cur - 1 + totalImages) % totalImages;
                                return { ...prev, [idx]: next };
                              });
                            }}
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
                            onClick={() => {
                              setThumbIndex((prev) => {
                                const cur = prev[idx] ?? 0;
                                const next = (cur + 1) % totalImages;
                                return { ...prev, [idx]: next };
                              });
                            }}
                            large={false}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>

                  {item.link && item.link.length > 0 ? (
                    <div
                      style={{
                        marginTop: 8,
                        display: "grid",
                        rowGap: 8,
                      }}
                    >
                      {item.link.map((l: any, i: any) => (
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
              ) : null}

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

                <div style={{ marginTop: "0.25rem" }}>
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
