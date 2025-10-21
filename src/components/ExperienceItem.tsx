import { ExperienceBullet } from "../utils/types";

type ExperienceItemProps = {
  bullets: ReadonlyArray<ExperienceBullet>;
};

export default function ExperienceItem({ bullets }: ExperienceItemProps) {
  if (!bullets || bullets.length === 0) return null;
  return (
    <ul
      style={{
        margin: 0,
        paddingLeft: "1.25rem",
        color: "white",
        fontSize: "1.125rem",
      }}
    >
      {bullets.map((d, idx) => (
        <li
          key={idx}
          style={{ marginBottom: idx < bullets.length - 1 ? "0.25rem" : 0 }}
        >
          {d.point}
        </li>
      ))}
    </ul>
  );
}
