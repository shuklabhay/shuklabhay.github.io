export function loadTagsFromStorage<T extends string>(
  storageKey: string,
  items: ReadonlyArray<{ label: T; defaultChecked?: boolean }>,
): T[] {
  if (typeof window === "undefined") {
    return items.filter((i) => i.defaultChecked).map((i) => i.label);
  }

  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const tagsParam = hashParams.get("tags");

  if (tagsParam) {
    const urlTags = tagsParam.split(",").map((t) => t.trim());
    const validLabels = new Set(items.map((i) => i.label));
    const validTags = urlTags.filter((t) => validLabels.has(t as T));
    if (validTags.length > 0) return validTags as T[];
  }

  const raw = window.localStorage.getItem(storageKey);
  if (raw) {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      const validLabels = new Set(items.map((i) => i.label));
      const validTags = arr.filter((t) => validLabels.has(t as T));
      if (validTags.length > 0) return validTags as T[];
    }
  }
  return items.filter((i) => i.defaultChecked).map((i) => i.label);
}

export function normalizeTag(t: string): string {
  return t.trim().toLowerCase();
}

export function parseTags(raw?: string[]): string[] {
  if (!raw || raw.length === 0) return [];
  const set = new Set<string>();
  for (const r of raw) {
    for (const p of r.split(/[\s,]+/)) {
      const t = normalizeTag(p);
      if (t) set.add(t);
    }
  }
  return Array.from(set);
}

export function selectDesired(
  selected: string[],
  allowed: readonly string[],
): Set<string> {
  const allowedSet = new Set(allowed.map(normalizeTag));
  const desired = new Set<string>();
  for (const s of selected) {
    const t = normalizeTag(s);
    if (allowedSet.has(t)) desired.add(t);
  }
  return desired;
}

export function detailMatches(
  detailTags: string[] | undefined,
  desired: ReadonlySet<string>,
  allowed: readonly string[],
): boolean {
  const allowedSet = new Set(allowed.map(normalizeTag));
  const tags = parseTags(detailTags).filter((t) => allowedSet.has(t));
  if (tags.includes("always")) return true;
  for (const d of desired) if (tags.includes(d)) return true;
  return false;
}

export function filterDetailsByTags<
  D extends { point: string; tags?: string[] },
>(details: D[], desired: ReadonlySet<string>, allowed: readonly string[]): D[] {
  return details.filter((d) => detailMatches(d.tags, desired, allowed));
}

export function filterItemsByDetailTags<
  T extends { details: { point: string; tags?: string[] }[] },
>(items: T[], desired: ReadonlySet<string>, allowed: readonly string[]): T[] {
  const out: T[] = [];
  for (const it of items) {
    const details = filterDetailsByTags(it.details, desired, allowed);
    if (details.length === 0) continue;
    out.push({ ...(it as any), details } as T);
  }
  return out;
}
