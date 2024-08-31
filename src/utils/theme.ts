import { createTheme } from "@mantine/core";

export function hexToRgb(hex: string): {
  r: number;
  g: number;
  b: number;
} {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

export const theme = createTheme({
  primaryColor: "main",
  primaryShade: 4,
  colors: {
    main: [
      "#f7eaff",
      "#e8cfff",
      "#cd9cff",
      "#b264fe",
      "#9a37fd",
      "#8b1bfd",
      "#840cfe",
      "#7100e3",
      "#6500cb",
      "#5700b2",
    ],
    gradMain: [
      "#eef0fb",
      "#d9dbf2",
      "#afb4e6",
      "#828bdc",
      "#5e67d3",
      "#4751ce",
      "#3c46cd",
      "#2e38b6",
      "#2832a3",
      "#1e2a90",
    ],
  },
});
