type ArrowFromLineIconProps = {
  direction: "left" | "right";
  size?: number | string;
};

export default function ArrowFromLineIcon({
  direction,
  size = 16,
}: ArrowFromLineIconProps) {
  const isRight = direction === "right";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      focusable="false"
      style={{ display: "block" }}
    >
      <path
        d={isRight ? "M4.5 3v12" : "M13.5 3v12"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d={
          isRight
            ? "M7 9h6.5M10.5 5.5L14 9l-3.5 3.5"
            : "M11 9H4.5M8 5.5L4.5 9 8 12.5"
        }
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
