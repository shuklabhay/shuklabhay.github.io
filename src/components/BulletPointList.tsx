import { BulletPoint } from "../utils/types";

export default function BulletPointList({ points }: { points: BulletPoint[] }) {
  return (
    <ul
      style={{
        margin: 0,
        paddingLeft: "1.25rem",
        color: "white",
        fontSize: "1.125rem",
      }}
    >
      {points.map((d, idx) => (
        <li
          key={`${d.point}-${idx}`}
          style={{ marginBottom: idx < points.length - 1 ? "0.25rem" : 0 }}
        >
          {d.point}
        </li>
      ))}
    </ul>
  );
}
