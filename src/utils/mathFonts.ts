const MATH_FONTS = [
  "16px KaTeX_Main",
  "italic 16px KaTeX_Math",
  "16px KaTeX_AMS",
  "16px KaTeX_Caligraphic",
  "16px KaTeX_Size1",
  "16px KaTeX_Size2",
];

let warmed = false;

export function warmMathFonts(): void {
  if (warmed || typeof document === "undefined" || !document.fonts) return;
  warmed = true;
  for (const font of MATH_FONTS) {
    void document.fonts.load(font).catch(() => undefined);
  }
}
