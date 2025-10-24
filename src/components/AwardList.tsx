import { useMemo } from "react";
import { AwardRecord, AWARD_ALLOWED_TAGS } from "../utils/types";
import { selectDesired } from "../utils/tags";
import { useData } from "../pages/About";

export default function AwardList({
  selectedTags = [],
}: {
  selectedTags: string[];
}) {
  const { awards: items } = useData();

  const filtered = useMemo(() => {
    const desired = selectDesired(selectedTags, AWARD_ALLOWED_TAGS);
    if (desired.size === 0) return [] as AwardRecord[];
    const desiredLower = new Set(Array.from(desired));
    const filtered = items.filter((i: AwardRecord) => !i.hide);
    return filtered.filter((it: any) => {
      const tags = (it.tags || []).map((t: any) => t.toLowerCase());
      if (tags.includes("always")) return true;
      for (const d of desiredLower) if (tags.includes(d)) return true;
      return false;
    });
  }, [items, selectedTags]);

  return (
    <div
      style={{
        display: "grid",
        rowGap: "0.5rem",
        paddingRight: "0.25rem",
      }}
    >
      {filtered.map((item) => (
        <div
          key={`${item.title}-${item.receivedYear}`}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) auto",
            alignItems: "start",
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 6,
            padding: "0.5rem 0.75rem",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "grid", rowGap: 2 }}>
            <div
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: "1.25rem",
                lineHeight: 1.1,
              }}
            >
              {item.title}
            </div>
            <div style={{ color: "white", opacity: 0.9, fontSize: "1rem" }}>
              {item.issuer}
            </div>
          </div>

          <div
            style={{
              color: "white",
              opacity: 0.9,
              fontSize: "1rem",
              fontStyle: "italic",
              whiteSpace: "nowrap",
              alignSelf: "start",
            }}
          >
            {item.receivedYear}
          </div>
        </div>
      ))}
    </div>
  );
}
