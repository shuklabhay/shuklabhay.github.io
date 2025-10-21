import { useEffect, useMemo, useState } from "react";
import ExperienceItem from "./ExperienceItem";

type ExperienceBullet = { point: string; tag?: string[] };

type ExperienceIcon = { src: string; link: string } | null;

type ExperienceRecord = {
  org: string;
  position: string;
  startYear: string;
  endYear: string | "Present";
  ongoing: boolean;
  details: ExperienceBullet[];
  icon: ExperienceIcon;
  hideOnSite: boolean;
  hideOnResume: boolean;
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
  selectedTags = [] as string[],
}: {
  selectedTags?: string[];
}) {
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
    <div style={{ display: "grid", rowGap: "1.25rem" }}>
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
        filtered.map((item, idx) => (
          <ExperienceItem
            key={`${item.org}-${idx}`}
            item={item}
            selectedTags={selectedTags}
          />
        ))
      )}
    </div>
  );
}
