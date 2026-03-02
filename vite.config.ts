import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import fs from "fs";
import path from "path";

const VIRTUAL_POSTS_ID = "virtual:posts-manifest";
const RESOLVED_VIRTUAL_POSTS_ID = `\0${VIRTUAL_POSTS_ID}`;

function rewriteWikiEmbedsToMarkdown(source: string): string {
  const importByPath = new Map<string, string>();
  const importLines: string[] = [];
  let importIndex = 0;

  const rewrittenBody = source.replace(
    /!\[\[([^[\]]+)\]\]/g,
    (_match, rawPath: string) => {
      const cleaned = rawPath.trim();
      const embedName = cleaned.toLowerCase();

      let importName = importByPath.get(cleaned);
      if (!importName) {
        importName = `__wikiEmbed${importIndex++}`;
        importByPath.set(cleaned, importName);
        importLines.push(
          `import ${importName} from ${JSON.stringify(`./assets/${cleaned}`)};`,
        );
      }

	  return `<img className="post-embed-image" data-embed={${JSON.stringify(embedName)}} src={${importName}} alt="" loading="lazy" decoding="async" />`;
    },
  );

  if (importLines.length === 0) return source;
  return `${importLines.join("\n")}\n\n${rewrittenBody}`;
}

function formatSlug(slug: string): string {
  return slug
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function extractPostTitle(source: string, slug: string): string {
  const heading = source.match(/^#\s+(.+)$/m);
  return heading?.[1]?.trim() ?? formatSlug(slug);
}

function extractPostExcerpt(source: string): string {
  const withoutCode = source.replace(/```[\s\S]*?```/g, " ");
  const normalized = withoutCode
    .replace(/^import\s.+$/gm, " ")
    .replace(/^export\s+const\s+meta\s*=\s*{[\s\S]*?};?/m, " ")
    .replace(/^#.*$/gm, " ")
    .replace(/!\[\[[^\]]+\]\]/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/^>\s?/gm, " ")
    .replace(/[*_`~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (normalized.length <= 240) return normalized;
  return `${normalized.slice(0, 237).trimEnd()}...`;
}

function extractPostWordCount(source: string): number {
  const withoutCode = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ");

  const normalized = withoutCode
    .replace(/^import\s.+$/gm, " ")
    .replace(/^export\s+const\s+meta\s*=\s*{[\s\S]*?};?/m, " ")
    .replace(/^export\s.+$/gm, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/<[\w.-]+[\s\S]*?\/>/g, " ")
    .replace(/<\/?[\w.-]+[^>]*>/g, " ")
    .replace(/!\[\[[^\]]+\]\]/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\{[^{}]*\}/g, " ")
    .replace(/^>\s?/gm, " ")
    .replace(/^\s*[-*+]\s+/gm, " ")
    .replace(/^\s*\d+\.\s+/gm, " ")
    .replace(/[|*_~#]/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return 0;
  return normalized.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;
}

type PostMetaFile = {
  title?: unknown;
  excerpt?: unknown;
  author?: unknown;
  date?: unknown;
  dateCreated?: unknown;
};

type ParsedPostMeta = {
  title?: string;
  excerpt?: string;
  author?: string;
  date?: string;
};

function asOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toIsoDateString(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10);
}

function readPostMeta(metaPath: string): ParsedPostMeta {
  if (!fs.existsSync(metaPath)) return {};

  try {
    const raw = fs.readFileSync(metaPath, "utf8");
    const parsed = JSON.parse(raw) as PostMetaFile;
    const title = asOptionalString(parsed.title);
    const excerpt = asOptionalString(parsed.excerpt);
    const author = asOptionalString(parsed.author);
    const dateSource =
      asOptionalString(parsed.dateCreated) ?? asOptionalString(parsed.date);
    const date = dateSource ? toIsoDateString(dateSource) : undefined;

    return {
      title,
      excerpt,
      author,
      date,
    };
  } catch {
    return {};
  }
}

export default defineConfig({
  plugins: [
    {
      name: "rewrite-obsidian-image-embeds",
      enforce: "pre",
      transform(code, id) {
        if (!id.endsWith(".mdx")) return null;
        if (!id.includes("/src/posts/")) return null;

        const transformed = rewriteWikiEmbedsToMarkdown(code);
        if (transformed === code) return null;

        return {
          code: transformed,
          map: null,
        };
      },
    },
    mdx(),
    react(),
    {
      name: "virtual-posts-manifest",
      resolveId(id) {
        if (id === VIRTUAL_POSTS_ID) return RESOLVED_VIRTUAL_POSTS_ID;
      },
      load(id) {
        if (id !== RESOLVED_VIRTUAL_POSTS_ID) return null;

        const postsDir = path.resolve(process.cwd(), "src/posts");
        if (!fs.existsSync(postsDir)) {
          return "export const postsManifest = [];";
        }

        const importLines: string[] = [];
        const itemLines: string[] = [];
        let coverImportIndex = 0;

        const dirs = fs
          .readdirSync(postsDir, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name)
          .sort();

        for (const slug of dirs) {
          const postPath = path.join(postsDir, slug, "index.mdx");
          if (!fs.existsSync(postPath)) continue;
          const metaPath = path.join(postsDir, slug, "meta.json");

          this.addWatchFile(postPath);
          const source = fs.readFileSync(postPath, "utf8");
          const stat = fs.statSync(postPath);
          this.addWatchFile(metaPath);

          const postMeta = readPostMeta(metaPath);
          const title = postMeta.title ?? extractPostTitle(source, slug);
          const excerpt = postMeta.excerpt ?? extractPostExcerpt(source);
          const wordCount = extractPostWordCount(source);
          const date = postMeta.date ?? stat.mtime.toISOString().slice(0, 10);
          const authorExpr = postMeta.author
            ? JSON.stringify(postMeta.author)
            : "undefined";

          const coverCandidates = [
            "banner.png",
            "banner.jpg",
            "banner.jpeg",
            "banner.webp",
          ];
          const coverFile = coverCandidates.find((fileName) =>
            fs.existsSync(path.join(postsDir, slug, fileName)),
          );

          let coverExpr = "undefined";
          if (coverFile) {
            const importName = `cover${coverImportIndex++}`;
            const coverPath = `/src/posts/${slug}/${coverFile}`;
            importLines.push(
              `import ${importName} from ${JSON.stringify(coverPath)};`,
            );
            coverExpr = importName;
            this.addWatchFile(path.join(postsDir, slug, coverFile));
          }

          itemLines.push(
            `{ slug: ${JSON.stringify(slug)}, title: ${JSON.stringify(
              title,
            )}, date: ${JSON.stringify(date)}, excerpt: ${JSON.stringify(
              excerpt,
            )}, author: ${authorExpr}, cover: ${coverExpr}, wordCount: ${wordCount} }`,
          );
        }

        return `${importLines.join("\n")}\nexport const postsManifest = [\n${itemLines.join(
          ",\n",
        )}\n];`;
      },
    },
    {
      name: "copy-static-deps",
      closeBundle: () => {
        fs.copyFileSync("404.html", "dist/404.html");
      },
    },
  ],
  base: "/",
});
