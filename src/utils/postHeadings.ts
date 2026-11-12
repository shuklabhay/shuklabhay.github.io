export type PostHeading = {
  id: string;
  text: string;
  level: number;
};

type RawHeading = {
  text: string;
  level: number;
  id?: string;
};

const HEADING_SELECTOR = "h2, h3, h4";
const HTML_HEADING_PATTERN = /<h([234])\b([^>]*)>([\s\S]*?)<\/h\1>/g;
const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#x27;": "'",
  "&#39;": "'",
  "&nbsp;": " ",
};

const seededHeadingsBySlug = new Map<string, PostHeading[]>();

function slugifyHeading(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return slug || "section";
}

export function withHeadingIds(rawHeadings: RawHeading[]): PostHeading[] {
  const slugCount = new Map<string, number>();
  return rawHeadings
    .filter((heading) => heading.text.length > 0)
    .map((heading) => {
      if (heading.id) return { ...heading, id: heading.id };
      const base = slugifyHeading(heading.text);
      const occurrence = slugCount.get(base) ?? 0;
      slugCount.set(base, occurrence + 1);
      return {
        ...heading,
        id: occurrence > 0 ? `${base}-${occurrence + 1}` : base,
      };
    });
}

export function readHeadingElements(
  contentEl: ParentNode,
): HTMLHeadingElement[] {
  return Array.from(
    contentEl.querySelectorAll<HTMLHeadingElement>(HEADING_SELECTOR),
  );
}

export function readHeadingsFromElement(contentEl: ParentNode): PostHeading[] {
  return withHeadingIds(
    readHeadingElements(contentEl).map((headingEl) => ({
      text: headingEl.textContent?.trim() ?? "",
      level: Number(headingEl.tagName.slice(1)),
      id: headingEl.id || undefined,
    })),
  );
}

function decodeHtml(text: string): string {
  return text.replace(/&[#\w]+;/g, (entity) => HTML_ENTITIES[entity] ?? entity);
}

export function readHeadingsFromHtml(html: string): PostHeading[] {
  const contentStart = html.indexOf('class="post-content"');
  if (contentStart === -1) return [];
  const contentHtml = html.slice(contentStart);
  return withHeadingIds(
    Array.from(contentHtml.matchAll(HTML_HEADING_PATTERN)).map((match) => ({
      text: decodeHtml((match[3] ?? "").replace(/<[^>]*>/g, "")).trim(),
      level: Number(match[1]),
      id: match[2]?.match(/\bid="([^"]*)"/)?.[1] || undefined,
    })),
  );
}

export function seedPostHeadings(slug: string, headings: PostHeading[]): void {
  seededHeadingsBySlug.set(slug, headings);
}

export function seededPostHeadings(slug: string): PostHeading[] {
  return seededHeadingsBySlug.get(slug) ?? [];
}
