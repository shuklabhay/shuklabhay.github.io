type RouterHistoryState = { idx?: unknown; key?: unknown } | null;

const scrollByKey = new Map<string, number>();
let currentKey = "default";
const pathByIndex = new Map<number, string>();
let lastVisitedPostSlug: string | null = null;

function readHistoryState(): RouterHistoryState {
  if (typeof window === "undefined") return null;
  return window.history.state as RouterHistoryState;
}

export function currentHistoryIndex(): number | null {
  const index = readHistoryState()?.idx;
  return typeof index === "number" ? index : null;
}

export function currentHistoryKey(): string {
  const key = readHistoryState()?.key;
  return typeof key === "string" ? key : "default";
}

export function setCurrentKey(key: string): void {
  currentKey = key;
}

export function rememberCurrentScroll(): void {
  if (typeof window === "undefined") return;
  scrollByKey.set(currentKey, window.scrollY);
}

export function recallScroll(key: string): number {
  return scrollByKey.get(key) ?? 0;
}

export function rememberPathAt(index: number, pathname: string): void {
  pathByIndex.set(index, pathname);
}

export function pathAt(index: number): string | undefined {
  return pathByIndex.get(index);
}

export function setLastVisitedPost(slug: string): void {
  lastVisitedPostSlug = slug;
}

export function getLastVisitedPost(): string | null {
  return lastVisitedPostSlug;
}
