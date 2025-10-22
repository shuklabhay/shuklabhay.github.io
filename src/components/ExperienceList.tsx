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
      .then((d: ExperienceRecord[]) =>
        setItems(d.filter((i) => !i.hideOnSite && !i.hide)),
      );
  }, []);

  const filtered = useMemo(() => {
    const desired = selectDesired(selectedTags, ABOUT_ALLOWED_TAGS);
    if (desired.size === 0) return [] as ExperienceRecord[];
    return filterItemsByDetailTags(items, desired, ABOUT_ALLOWED_TAGS);
  }, [items, selectedTags]);

  return (
    <motion.div
      layout="position"
      transition={{ layout: { duration: 0.3, ease: [0.2, 0, 0.2, 1] } }}
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
        <AnimatePresence initial={false} mode="popLayout">
          {filtered.map((item) => {
            const dateText = `${item.startYear} – ${item.endYear}`;

            return (
              <motion.div
                key={item.org}
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.2, 0, 0.2, 1] }}
                style={{
                  display: "grid",
                  gridTemplateColumns: item.icon ? "48px 1fr" : "1fr",
                  columnGap: item.icon ? "0.75rem" : 0,
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
                    gridTemplateColumns: "minmax(0,1fr) auto",
                    rowGap: "0.25rem",
                    alignItems: "start",
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
    </motion.div>
  );
}
