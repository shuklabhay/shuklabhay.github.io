export type TriangleIconDirection = "up" | "down" | "left";

type TriangleIconGeometry = {
  viewBox: string;
  path: string;
  transform?: string;
};

const DOWN_TRIANGLE: TriangleIconGeometry = {
  viewBox: "0 0 10 10",
  path: "M5 8L1.4 3h7.2L5 8z",
};

const LEFT_TRIANGLE: TriangleIconGeometry = {
  viewBox: "0 0 10 10",
  path: "M7.8 1.4L2.6 5l5.2 3.6V1.4z",
};

export function getTriangleIconGeometry(
  direction: TriangleIconDirection,
): TriangleIconGeometry {
  if (direction === "up") {
    return {
      ...DOWN_TRIANGLE,
      transform: "rotate(180 5 5)",
    };
  }
  if (direction === "left") {
    return LEFT_TRIANGLE;
  }
  return DOWN_TRIANGLE;
}
