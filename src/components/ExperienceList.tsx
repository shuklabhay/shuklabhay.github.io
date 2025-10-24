import { useEffect, useMemo, useState } from "react";
import BulletPointList from "./BulletPointList";
import { ExperienceRecord, ABOUT_ALLOWED_TAGS } from "../utils/types";
import { selectDesired, filterItemsByDetailTags } from "../utils/tags";
import { motion, AnimatePresence } from "framer-motion";

export default function ExperienceList({
  selectedTags = [],
}: {
  selectedTags: string[];
}) {
  const [items, setItems] = useState<ExperienceRecord[]>([]);

  useEffect(() => {
    fetch("/sitedata/experience.json")
      .then((r) => r.json())
      .then((d: ExperienceRecord[]) => setItems(d.filter((i) => !i.hide)));
  }, []);

  const filtered = useMemo(() => {
    const desired = selectDesired(selectedTags, ABOUT_ALLOWED_TAGS);
    if (desired.size === 0) return [] as ExperienceRecord[];
    return filterItemsByDetailTags(items, desired, ABOUT_ALLOWED_TAGS);
  }, [items, selectedTags]);

  return (
    <div
      style={{ display: "grid", rowGap: "1.25rem", paddingRight: "0.25rem" }}
    >
      {filtered.length === 0 ? (
        <div
          style={{
            color: "white",
            opacity: 0.9,
            fontStyle: "italic",
            fontSize: "1rem",
          }}
        >
          Select one or more tags.
        </div>
      ) : (
        <AnimatePresence initial={false}>
          {filtered.map((item) => {
            const dateText = `${item.startYear} – ${item.endYear}`;

            return (
              <motion.div
                key={item.org}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{
                  display: "grid",
                  gridTemplateColumns: item.icon ? "48px 1fr" : "1fr",
                  columnGap: item.icon ? "0.75rem" : 0,
                  overflow: "hidden",
                }}
              >
                {item.icon?.src ? (
                  item.icon.link ? (
                    <a
                      href={item.icon.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 6,
                        overflow: "hidden",
                        display: "block",
                      }}
                    >
                      <img
                        src={item.icon.src}
                        alt={item.org}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </a>
                  ) : (
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 6,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={item.icon.src}
                        alt={item.org}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )
                ) : null}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    rowGap: "0.25rem",
                    alignItems: "start",
                    columnGap: "1rem",
                  }}
                >
                  <h2
                    style={{
                      gridColumn: 1,
                      margin: 0,
                      color: "white",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      lineHeight: 1.1,
                    }}
                  >
                    {item.position}
                  </h2>

                  <div
                    style={{
                      gridColumn: 2,
                      color: "white",
                      opacity: 0.9,
                      fontSize: "1rem",
                      fontStyle: "italic",
                      alignSelf: "center",
                      justifySelf: "end",
                      whiteSpace: "nowrap",
                      minWidth: "max-content",
                    }}
                  >
                    {dateText}
                  </div>

                  <div
                    style={{
                      gridColumn: "1 / 3",
                      color: "white",
                      opacity: 0.9,
                      fontSize: "1.05rem",
                    }}
                  >
                    {item.org}
                  </div>

                  <BulletPointList points={item.details} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}
