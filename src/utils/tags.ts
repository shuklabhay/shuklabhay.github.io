export function loadTagsFromStorage<T extends string>(
  storageKey: string,
  items: ReadonlyArray<{ label: T; defaultChecked?: boolean }>,
): T[] {
  const raw =
    typeof window !== "undefined"
      ? window.localStorage.getItem(storageKey)
      : null;
  if (raw) {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr as T[];
  }
  return items.filter((i) => i.defaultChecked).map((i) => i.label);
}
