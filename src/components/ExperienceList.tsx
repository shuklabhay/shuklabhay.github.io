import { useEffect, useMemo, useState } from "react";
import ExperienceItem from "./ExperienceItem";
import { ExperienceRecord } from "../utils/types";

type ExperienceListProps = {
  selectedTags?: string[];
};

function extractTags(item: ExperienceRecord): Set<string> {
  const tags = new Set<string>();
  for (const d of item.details) {
    const arr = Array.isArray(d.tag) ? d.tag : [];
    for (const raw of arr) {
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
}: ExperienceListProps) {
  const [items, setItems] = useState<ExperienceRecord[]>([]);

  useEffect(() => {
    fetch("/sitedata/experience.json")
      .then((r) => r.json())
      .then((d: ExperienceRecord[]) => setItems(d.filter((i) => !i.hideOnSite)))
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const wanted = new Set((selectedTags ?? []).map((t) => t.toLowerCase()));
    if (wanted.size === 0) return [] as ExperienceRecord[];
    return items.filter((it) => {
      const tags = extractTags(it);
      if (tags.has("always")) return true;
      for (const w of wanted) if (tags.has(w)) return true;
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
          const want = new Set(
            (selectedTags ?? []).map((t) => t.toLowerCase()),
          );
          const bullets = item.details.filter((d) => {
            const arr = Array.isArray(d.tag) ? d.tag : [];
            const tags = new Set<string>();
            for (const raw of arr) {
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
                gridTemplateColumns: "48px 1fr",
                columnGap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.6)",
                  overflow: "hidden",
                }}
              >
                {item.icon?.src ? (
                  <img
                    src={item.icon.src}
                    alt={item.org}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : null}
              </div>

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
                    fontSize: "2rem",
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

                <ExperienceItem bullets={bullets} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
