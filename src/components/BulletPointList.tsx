import { BulletPoint } from "../utils/types";
import { motion, AnimatePresence } from "framer-motion";

export default function BulletPointList({ points }: { points: BulletPoint[] }) {
  return (
    <motion.ul
      layout="position"
      transition={{ layout: { duration: 0.3, ease: [0.2, 0, 0.2, 1] } }}
      style={{
        margin: 0,
        paddingLeft: "1.25rem",
        color: "white",
        fontSize: "1.125rem",
      }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {points.map((d, idx) => (
          <motion.li
            key={`${d.point}-${idx}`}
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0.2, 1] }}
            style={{ marginBottom: idx < points.length - 1 ? "0.25rem" : 0 }}
          >
            {d.point}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
