import { useEffect, useMemo, useState } from "react";
import BulletPointList from "./BulletPointList";
import ImageGallery, { LRArrowButton } from "./ImageGallery";
import type { RichImage, ProjectRecord } from "../utils/types";
import { BulletPoint, ABOUT_ALLOWED_TAGS } from "../utils/types";
import { selectDesired, filterItemsByDetailTags } from "../utils/tags";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectList({
  selectedTags = [],
}: {
  selectedTags: string[];
}) {
  const [items, setItems] = useState<ProjectRecord[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [lightboxImages, setGalleryImages] = useState<RichImage[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [thumbIndex, setThumbIndex] = useState<Record<number, number>>({});

  const THUMB_W = 192;
  const THUMB_H = 108;

  useEffect(() => {
    fetch("/sitedata/projects.json")
      .then((r) => r.json())
      .then((d: ProjectRecord[]) => setItems(d.filter((i: any) => !i.hide)))
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const desired = selectDesired(selectedTags, ABOUT_ALLOWED_TAGS);
    if (desired.size === 0) return [] as ProjectRecord[];
    return filterItemsByDetailTags(items, desired, ABOUT_ALLOWED_TAGS);
  }, [items, selectedTags]);

  return (
    <motion.div
      layout="position"
      transition={{ layout: { duration: 0.3, ease: [0.2, 0, 0.2, 1] } }}
      style={{ display: "grid", rowGap: "1.25rem", paddingRight: "0.25rem" }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {filtered.length !== 0 &&
          filtered.map((item, idx) => {
            const points: BulletPoint[] = item.details.map((d) => ({
              point: d.point,
              tags: (d.tags || []).map((t) => t.toLowerCase()),
            }));

            const hasImages = !!(item.images && item.images.length > 0);
            const images = hasImages ? (item.images as RichImage[]) : [];
            const totalImages = images.length;
            const currentThumb = thumbIndex[idx] ?? 0;
            const currentImage = hasImages
              ? images[
                  ((currentThumb % totalImages) + totalImages) % totalImages
                ]
              : null;
            const dateText =
              item.startYear && item.endYear
                ? `${item.startYear} – ${item.endYear}`
                : null;

            return (
              <motion.div
                key={item.title}
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.2, 0, 0.2, 1] }}
                style={{
                  display: "grid",
                  gridTemplateColumns: hasImages ? `${THUMB_W}px 1fr` : "1fr",
                  columnGap: hasImages ? "0.75rem" : 0,
                }}
              >
                {hasImages ? (
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
                        {item.link.map((l, i) => (
                          <a
                            key={i}
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: "#dbeafe",
                              textDecoration: "none",
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.12)",
                              padding: "2px 6px",
                              borderRadius: 6,
                              fontSize: "0.875rem",
                              lineHeight: 1.2,
                              display: "block",
                              width: "100%",
                              boxSizing: "border-box",
                            }}
                          >
                            {l.description}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div style={{ position: "relative" }}>
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
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "white",
                        opacity: 0.9,
                        fontSize: "1rem",
                        fontStyle: "italic",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dateText}
                    </div>
                  ) : null}

                  <div style={{ marginTop: 4 }}>
                    <BulletPointList points={points} />
                  </div>
                </div>
              </motion.div>
            );
          })}
      </AnimatePresence>

      <ImageGallery
        opened={galleryOpen}
        setOpened={setGalleryOpen}
        images={lightboxImages}
        initialSlideIndex={slideIndex}
        setSlideIndex={setSlideIndex}
      />
    </motion.div>
  );
}
