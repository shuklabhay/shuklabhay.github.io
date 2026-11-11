type RouterHistoryState = { idx?: unknown; key?: unknown } | null;

export type GallerySpot = {
  pathname: string;
  state: unknown;
  scroll: number;
};

const scrollByKey = new Map<string, number>();
const pathByIndex = new Map<number, string>();
let currentKey = "default";
let currentPathname = "/";
let currentState: unknown = null;
let gallerySpot: GallerySpot | null = null;

export function isGallerySectionPath(pathname: string): boolean {
  return pathname === "/gallery" || pathname.startsWith("/gallery/");
}

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

export function setCurrentPlace(
  key: string,
  pathname: string,
  state: unknown,
): void {
  currentKey = key;
  currentPathname = pathname;
  currentState = state;
}

export function rememberCurrentPlace(): void {
  if (typeof window === "undefined") return;
  scrollByKey.set(currentKey, window.scrollY);
  if (isGallerySectionPath(currentPathname)) {
    gallerySpot = {
      pathname: currentPathname,
      state: currentState,
      scroll: window.scrollY,
    };
  }
}

export function getGallerySpot(): GallerySpot | null {
  return gallerySpot;
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
