import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AwardRecord, AWARD_ALLOWED_TAGS } from "../utils/types";
import { selectDesired } from "../utils/tags";

export default function AwardList({
  selectedTags = [],
}: {
  selectedTags: string[];
}) {
  const [items, setItems] = useState<AwardRecord[]>([]);

  useEffect(() => {
    fetch("/sitedata/awards.json")
      .then((r) => r.json())
      .then((d: AwardRecord[]) => setItems(d.filter((i) => !i.hide)));
  }, []);

  const filtered = useMemo(() => {
    const desired = selectDesired(selectedTags, AWARD_ALLOWED_TAGS);
    if (desired.size === 0) return [] as AwardRecord[];
    const desiredLower = new Set(Array.from(desired));
    return items.filter((it) => {
      const tags = (it.tags || []).map((t) => t.toLowerCase());
      if (tags.includes("always")) return true;
      for (const d of desiredLower) if (tags.includes(d)) return true;
      return false;
    });
  }, [items, selectedTags]);

  return (
    <motion.div
      layout="position"
      transition={{ layout: { duration: 0.3, ease: [0.2, 0, 0.2, 1] } }}
      style={{
        display: "grid",
        rowGap: "0.5rem",
        paddingRight: "0.25rem",
        paddingBottom: "1rem",
      }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {filtered.map((item) => (
          <motion.div
            key={`${item.title}-${item.receivedYear}`}
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0, 0.2, 1] }}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) auto",
              alignItems: "start",
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 6,
              padding: "0.5rem 0.75rem",
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
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
