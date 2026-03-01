import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import fs from "fs";
import path from "path";

const VIRTUAL_POSTS_ID = "virtual:posts-manifest";
const RESOLVED_VIRTUAL_POSTS_ID = `\0${VIRTUAL_POSTS_ID}`;

function rewriteWikiEmbedsToMarkdown(source: string): string {
  return source.replace(/!\[\[([^[\]]+)\]\]/g, (_match, rawPath: string) => {
    const cleaned = rawPath.trim();
    const encoded = cleaned
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    return `![](./assets/${encoded})`;
  });
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

          this.addWatchFile(postPath);
          const source = fs.readFileSync(postPath, "utf8");
          const stat = fs.statSync(postPath);
          const title = extractPostTitle(source, slug);
          const excerpt = extractPostExcerpt(source);
          const date = stat.mtime.toISOString().slice(0, 10);

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
            importLines.push(`import ${importName} from ${JSON.stringify(coverPath)};`);
            coverExpr = importName;
            this.addWatchFile(path.join(postsDir, slug, coverFile));
          }

          itemLines.push(
            `{ slug: ${JSON.stringify(slug)}, title: ${JSON.stringify(
              title,
            )}, date: ${JSON.stringify(date)}, excerpt: ${JSON.stringify(
              excerpt,
            )}, cover: ${coverExpr} }`,
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
