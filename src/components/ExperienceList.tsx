import { useEffect, useMemo, useState } from "react";
import BulletPointList from "./BulletPointList";
import { ExperienceRecord, ABOUT_ALLOWED_TAGS } from "../utils/types";

function extractTags(item: ExperienceRecord): Set<string> {
  const tags = new Set<string>();
  for (const d of item.details) {
    for (const raw of d.tags) {
      for (const p of raw.split(/[\s,]+/)) {
        const t = p.trim().toLowerCase();
        if (t) tags.add(t);
      }
    }
  }
  return tags;
}

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
    const allowed = new Set(ABOUT_ALLOWED_TAGS);
    const want = new Set(
      selectedTags.map((t) => t.toLowerCase()).filter((t) => allowed.has(t)),
    );
    if (want.size === 0) return [] as ExperienceRecord[];
    return items.filter((it) => {
      const tags = extractTags(it);
      const validTags = new Set(Array.from(tags).filter((t) => allowed.has(t)));
      if (validTags.has("always")) return true;
      for (const w of want) if (validTags.has(w)) return true;
      return false;
    });
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
        filtered.map((item, idx) => {
          const dateText = `${item.startYear} – ${item.endYear}`;
          const want = new Set(selectedTags.map((t) => t.toLowerCase()));

          const points = item.details.filter((d) => {
            const tags = new Set<string>();
            for (const raw of d.tags) {
              for (const p of raw.split(/[\s,]+/)) {
                const t = p.trim().toLowerCase();
                if (t) tags.add(t);
              }
            }
            if (tags.has("always")) return true;
            for (const w of want) if (tags.has(w)) return true;
            return false;
          });

          return (
            <div
              key={`${item.org}-${idx}`}
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
                  gridTemplateColumns: "1fr auto",
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

                <BulletPointList points={points} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
