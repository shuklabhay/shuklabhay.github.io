import type { TriangleIconProps } from "../utils/types";

export default function TriangleIcon({
  direction,
  size = 9,
}: TriangleIconProps) {
  const viewBox = "0 0 10 10";
  const isLeft = direction === "left";
  const path = isLeft ? "M7.8 1.4L2.6 5l5.2 3.6V1.4z" : "M5 8L1.4 3h7.2L5 8z";
  const transform = direction === "up" ? "rotate(180 5 5)" : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      aria-hidden
      focusable="false"
    >
      <path d={path} fill="currentColor" transform={transform} />
    </svg>
  );
}
