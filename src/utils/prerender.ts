export function isHydratingPrerenderedPage(): boolean {
  if (typeof document === "undefined") return false;
  return document.getElementById("root")?.dataset.prerendered === "true";
}
