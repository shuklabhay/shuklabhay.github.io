import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type EducationRecord = {
  school: string;
  degree: string;
  gpa: string;
  location: string;
};

export default function EducationList() {
  const [items, setItems] = useState<EducationRecord[]>([]);

  useEffect(() => {
    fetch("/sitedata/education.json")
      .then((r) => r.json())
      .then((d: EducationRecord[]) => setItems(d));
  }, []);

  return (
    <div
      style={{ display: "grid", rowGap: "1.25rem", paddingRight: "0.25rem" }}
    >
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.school}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              rowGap: "0.25rem",
              alignItems: "start",
              columnGap: "1rem",
              overflow: "hidden",
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
              {item.school}
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
              {item.location}
            </div>

            <div
              style={{
                gridColumn: "1 / 3",
                color: "white",
                opacity: 0.9,
                fontSize: "1.05rem",
              }}
            >
              {item.degree}
            </div>

            <div
              style={{
                gridColumn: "1 / 3",
                color: "white",
                opacity: 0.9,
                fontSize: "1.05rem",
              }}
            >
              GPA: {item.gpa}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
