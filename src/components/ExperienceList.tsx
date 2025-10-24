import { useMemo, useState, useEffect } from "react";
import BulletPointList from "./BulletPointList";
import { ExperienceRecord, ABOUT_ALLOWED_TAGS } from "../utils/types";
import { selectDesired, filterItemsByDetailTags } from "../utils/tags";
import { useData } from "../pages/About";
import { formatDateRange } from "../utils/dates";

export default function ExperienceList({
  selectedTags = [],
}: {
  selectedTags: string[];
}) {
  const { experience: items } = useData();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filtered = useMemo(() => {
    const desired = selectDesired(selectedTags, ABOUT_ALLOWED_TAGS);
    if (desired.size === 0) return [] as ExperienceRecord[];
    const filtered = items.filter((i: ExperienceRecord) => !i.hide);
    return filterItemsByDetailTags(filtered, desired, ABOUT_ALLOWED_TAGS);
  }, [items, selectedTags]);

  const isSmallScreen = windowWidth < 768;

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
        <>
          {filtered.map((item) => {
            const dateText = formatDateRange(
              item.startYear,
              item.endYear ?? "Present",
              isSmallScreen,
            );

            return (
              <div
                key={item.org}
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

                  <div style={{ gridColumn: "1 / 3" }}>
                    <BulletPointList points={item.details} />
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
