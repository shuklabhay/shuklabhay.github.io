import { defineConfig, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import fs from "fs";
import path from "path";

const VIRTUAL_POSTS_ID = "virtual:posts-manifest";
const RESOLVED_VIRTUAL_POSTS_ID = `\0${VIRTUAL_POSTS_ID}`;
const SITE_ORIGIN = "https://shuklabhay.github.io";
const DEFAULT_SOCIAL_IMAGE_PATH = "/static/landing-1280.webp";
const SOCIAL_IMAGE_ALT = "Abhay Shukla portfolio landing image";
const POST_COVER_CANDIDATES = [
  "banner.png",
  "banner.jpg",
  "banner.jpeg",
  "banner.webp",
];
const TOP_LEVEL_SOCIAL_PAGES = [
  {
    canonicalPath: "/about",
    title: "Abhay Shukla · About",
    description: "about",
  },
  { canonicalPath: "/blog", title: "Abhay Shukla · Blog", description: "blog" },
  {
    canonicalPath: "/contact",
    title: "Abhay Shukla · Contact",
    description: "contact",
  },
  {
    canonicalPath: "/resume",
    title: "Abhay Shukla · Resume",
    description: "resume",
  },
];

type SocialPageMeta = {
  canonicalPath: string;
  title: string;
  description: string;
  type: "article" | "website";
};

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

function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type PostMetaFile = {
  title?: unknown;
  author?: unknown;
  date?: unknown;
  dateCreated?: unknown;
  buttons?: unknown;
  show_inline_toc?: unknown;
};

type ParsedPostMeta = {
  title?: string;
  author?: string;
  date?: string;
  buttons: Array<{ title: string; link: string }>;
  showInlineToc: boolean;
};

function asOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function asOptionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function toIsoDateString(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10);
}

function readPostButtons(
  value: unknown,
): Array<{ title: string; link: string }> {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const maybeButton = entry as { title?: unknown; link?: unknown };
      const title = asOptionalString(maybeButton.title);
      const link = asOptionalString(maybeButton.link);
      if (!title || !link) return null;
      return { title, link };
    })
    .filter(
      (button): button is { title: string; link: string } => button !== null,
    );
}

function readPostMeta(metaPath: string): ParsedPostMeta {
  if (!fs.existsSync(metaPath)) {
    throw new Error(`Missing required post metadata file: ${metaPath}`);
  }

  try {
    const raw = fs.readFileSync(metaPath, "utf8");
    const parsed = JSON.parse(raw) as PostMetaFile;
    const title = asOptionalString(parsed.title);
    const author = asOptionalString(parsed.author);
    const buttons = readPostButtons(parsed.buttons);
    const dateSource =
      asOptionalString(parsed.dateCreated) ?? asOptionalString(parsed.date);
    const date = dateSource ? toIsoDateString(dateSource) : undefined;
    const showInlineToc = asOptionalBoolean(parsed.show_inline_toc);

    if (showInlineToc === undefined) {
      throw new Error(
        `Expected boolean "show_inline_toc" in post metadata: ${metaPath}`,
      );
    }

    return {
      title,
      author,
      date,
      buttons,
      showInlineToc,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to read post metadata: ${metaPath}`);
  }
}

function createSpaRedirectScript(): string {
  return `<script type="text/javascript">
      (function () {
        var l = window.location;
        if (l.search[1] === "/") return;
        l.replace(
          l.protocol +
            "//" +
            l.hostname +
            (l.port ? ":" + l.port : "") +
            "/?/" +
            l.pathname.slice(1).replace(/&/g, "~and~") +
            (l.search ? "&" + l.search.slice(1).replace(/&/g, "~and~") : "") +
            l.hash,
        );
      })();
    </script>`;
}

function createSocialHtml(meta: SocialPageMeta): string {
  const canonicalUrl = `${SITE_ORIGIN}${meta.canonicalPath}`;
  const socialImageUrl = `${SITE_ORIGIN}${DEFAULT_SOCIAL_IMAGE_PATH}`;
  const escapedTitle = escapeHtmlAttribute(meta.title);
  const escapedDescription = escapeHtmlAttribute(meta.description);
  const escapedImageAlt = escapeHtmlAttribute(SOCIAL_IMAGE_ALT);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapedTitle}</title>
    <meta name="description" content="${escapedDescription}" />
    <meta property="og:type" content="${meta.type}" />
    <meta property="og:title" content="${escapedTitle}" />
    <meta property="og:description" content="${escapedDescription}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${socialImageUrl}" />
    <meta property="og:image:alt" content="${escapedImageAlt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapedTitle}" />
    <meta name="twitter:description" content="${escapedDescription}" />
    <meta name="twitter:image" content="${socialImageUrl}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="robots" content="index,follow" />
    ${createSpaRedirectScript()}
  </head>
  <body></body>
</html>
`;
}

function writeSocialHtml(distDir: string, meta: SocialPageMeta): void {
  const routeDir = path.join(distDir, meta.canonicalPath.slice(1));
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, "index.html"), createSocialHtml(meta));
}

export default defineConfig({
  plugins: [
    {
      name: "rewrite-obsidian-image-embeds",
      enforce: "pre",
      transform(code: string, id: string): { code: string; map: null } | null {
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
      resolveId(id: string): string | undefined {
        if (id === VIRTUAL_POSTS_ID) return RESOLVED_VIRTUAL_POSTS_ID;
      },
      load(id: string): string | null {
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

          let postMeta: ParsedPostMeta;
          try {
            postMeta = readPostMeta(metaPath);
          } catch (error) {
            this.error(error instanceof Error ? error.message : String(error));
            continue;
          }
          const title = postMeta.title ?? extractPostTitle(source, slug);
          const wordCount = extractPostWordCount(source);
          const date = postMeta.date ?? stat.mtime.toISOString().slice(0, 10);
          const authorExpr = JSON.stringify(postMeta.author ?? "");
          const buttonsExpr = JSON.stringify(postMeta.buttons);
          const showInlineTocExpr = JSON.stringify(postMeta.showInlineToc);

          const coverFile = POST_COVER_CANDIDATES.find((fileName) =>
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
            )}, date: ${JSON.stringify(date)}, author: ${authorExpr}, buttons: ${buttonsExpr}, showInlineToc: ${showInlineTocExpr}, cover: ${coverExpr}, wordCount: ${wordCount} }`,
          );
        }

        return `${importLines.join("\n")}\nexport const postsManifest = [\n${itemLines.join(
          ",\n",
        )}\n];`;
      },
    },
    {
      name: "copy-static-deps",
      configureServer(server: ViteDevServer): void {
        server.middlewares.use((req, res, next) => {
          const rawUrl = req.url?.split("?")[0] ?? "";
          const match = rawUrl.match(/^\/blog\/([^/]+)\/slideshow\.html$/);
          if (!match) {
            next();
            return;
          }

          const slug = decodeURIComponent(match[1] ?? "");
          const slideshowPath = path.resolve(
            process.cwd(),
            "src/posts",
            slug,
            "slideshow.html",
          );

          if (!fs.existsSync(slideshowPath)) {
            next();
            return;
          }

          try {
            const html = fs.readFileSync(slideshowPath, "utf8");
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
          } catch (error) {
            next(error as Error);
          }
        });
      },
      closeBundle: (): void => {
        fs.copyFileSync("404.html", "dist/404.html");

        const distDir = path.resolve(process.cwd(), "dist");
        const postsDir = path.resolve(process.cwd(), "src/posts");
        if (!fs.existsSync(distDir) || !fs.existsSync(postsDir)) return;

        const slugs = fs
          .readdirSync(postsDir, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name)
          .sort();

        for (const slug of slugs) {
          const postPath = path.join(postsDir, slug, "index.mdx");
          if (!fs.existsSync(postPath)) continue;

          const source = fs.readFileSync(postPath, "utf8");
          const title =
            readPostMeta(path.join(postsDir, slug, "meta.json")).title ??
            extractPostTitle(source, slug);
          const distPostDir = path.join(distDir, "blog", slug);
          fs.mkdirSync(distPostDir, { recursive: true });

          fs.writeFileSync(
            path.join(distPostDir, "index.html"),
            createSocialHtml({
              canonicalPath: `/blog/${slug}`,
              title,
              description: title,
              type: "article",
            }),
          );
        }

        for (const page of TOP_LEVEL_SOCIAL_PAGES) {
          writeSocialHtml(distDir, { ...page, type: "website" });
        }

        for (const slug of slugs) {
          const sourcePostDir = path.join(postsDir, slug);
          const slideshowSrcPath = path.join(sourcePostDir, "slideshow.html");
          if (!fs.existsSync(slideshowSrcPath)) continue;

          const distSlideshowDir = path.join(distDir, "blog", slug);
          fs.mkdirSync(distSlideshowDir, { recursive: true });
          fs.copyFileSync(
            slideshowSrcPath,
            path.join(distSlideshowDir, "slideshow.html"),
          );

          const distSrcPostDir = path.join(distDir, "src", "posts", slug);
          fs.cpSync(sourcePostDir, distSrcPostDir, { recursive: true });
        }
      },
    },
  ],
  base: "/",
});
