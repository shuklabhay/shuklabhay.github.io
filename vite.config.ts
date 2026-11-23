import { defineConfig, type ViteDevServer } from "vite";
import preact from "@preact/preset-vite";
import mdx from "@mdx-js/rollup";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import fs from "fs";
import path from "path";

type MarkdownNode = {
  type: string;
  value?: string;
  children?: MarkdownNode[];
  position?: { start: { offset?: number } };
  data?: Record<string, unknown>;
};

function remarkDoubleDollarDisplayMath() {
  return (tree: MarkdownNode, file: { value: unknown }) => {
    const source = String(file.value);
    const visit = (node: MarkdownNode): void => {
      const start = node.position?.start.offset;
      if (
        node.type === "inlineMath" &&
        start !== undefined &&
        source.startsWith("$$", start)
      ) {
        node.data = {
          ...node.data,
          hName: "code",
          hProperties: { className: ["language-math", "math-display"] },
          hChildren: [{ type: "text", value: node.value ?? "" }],
        };
        return;
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: { className?: unknown };
  children?: HastNode[];
};

const MATH_SYNTAX = /\$\$[\s\S]+?\$\$|\$[^\s$][^$\n]*?\$/;
const TRAILING_PUNCTUATION = /^[.,:;!?)\]]+/;

function isInlineKatex(node: HastNode): boolean {
  const className = node.properties?.className;
  return (
    node.type === "element" &&
    Array.isArray(className) &&
    className.includes("katex")
  );
}

function rehypeKeepPunctuationWithMath() {
  return (tree: HastNode) => {
    const visit = (node: HastNode): void => {
      const children = node.children;
      if (!children) return;
      for (let i = 0; i < children.length - 1; i++) {
        const next = children[i + 1];
        if (!isInlineKatex(children[i]) || next.type !== "text") continue;
        const match = next.value?.match(TRAILING_PUNCTUATION);
        if (!match) continue;
        next.value = `\u2060${next.value}`;
      }
      children.forEach((child) => {
        if (isInlineKatex(child)) return;
        visit(child);
      });
    };
    visit(tree);
  };
}

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
    canonicalPath: "/bio",
    title: "Abhay Shukla · Bio",
    description:
      "I've been manipulating computers since I was 9, almost entirely self-taught.",
  },
  {
    canonicalPath: "/gallery",
    title: "Abhay Shukla · Gallery",
    description: "Projects and writing by Abhay Shukla.",
  },
];

type SocialPageMeta = {
  canonicalPath: string;
  title: string;
  description: string;
  type: "article" | "website";
  imagePath?: string;
  imageAlt?: string;
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

const AVIF_UPGRADABLE_IMAGE = /\.(webp|png|jpe?g|gif)$/i;

function addImageEnhancements(source: string, postDir: string): string {
  const avifImportByName = new Map<string, string>();
  const sizeByName = new Map<string, { width: number; height: number }>();
  const importLines: string[] = [];
  const importPattern =
    /^import\s+(\w+)\s+from\s+["'](\.\/assets\/[^"']+)["'];?$/gm;

  for (const match of source.matchAll(importPattern)) {
    const [, importName, importPath] = match;
    if (!AVIF_UPGRADABLE_IMAGE.test(importPath)) continue;
    const size = readImageSize(path.join(postDir, importPath));
    if (size) sizeByName.set(importName, size);
    const avifPath = importPath.replace(AVIF_UPGRADABLE_IMAGE, ".avif");
    if (!fs.existsSync(path.join(postDir, avifPath))) continue;
    const avifImportName = `${importName}__avif`;
    avifImportByName.set(importName, avifImportName);
    importLines.push(
      `import ${avifImportName} from ${JSON.stringify(avifPath)};`,
    );
  }

  if (avifImportByName.size === 0 && sizeByName.size === 0) return source;

  const rewrittenBody = source.replace(
    /<img\b[^>]*?\bsrc=\{(\w+)\}[^>]*?\/>/g,
    (tag: string, importName: string) => {
      const size = sizeByName.get(importName);
      let img = tag;
      if (size && !/\b(width|height)=/.test(img)) {
        img = img.replace(
          /^<img\b/,
          `<img width={${size.width}} height={${size.height}}`,
        );
      }
      const avifImportName = avifImportByName.get(importName);
      if (!avifImportName) return img;
      return `<picture><source type="image/avif" srcSet={${avifImportName}} />${img}</picture>`;
    },
  );
  return `${importLines.join("\n")}\n${rewrittenBody}`;
}

function addAvifSourcesToHtml(html: string, projectRoot: string): string {
  let upgraded = false;
  const rewritten = html.replace(
    /<img\b[^>]*?\bsrc="([^"]+)"[^>]*>/g,
    (tag: string, src: string) => {
      if (!src.startsWith("/") || !AVIF_UPGRADABLE_IMAGE.test(src)) return tag;
      const avifSrc = src.replace(AVIF_UPGRADABLE_IMAGE, ".avif");
      const avifPath = path.join(projectRoot, decodeURIComponent(avifSrc));
      if (!fs.existsSync(avifPath)) return tag;
      upgraded = true;
      return `<picture><source type="image/avif" srcset="${avifSrc}" />${tag}</picture>`;
    },
  );
  if (!upgraded) return html;
  return rewritten.replace(
    "</head>",
    "  <style>picture{display:contents}</style>\n  </head>",
  );
}

function readImageSize(
  filePath: string,
): { width: number; height: number } | undefined {
  const header = fs.readFileSync(filePath).subarray(0, 32);
  if (header.toString("ascii", 12, 16) === "IHDR") {
    return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
  }
  if (
    header.toString("ascii", 0, 4) !== "RIFF" ||
    header.toString("ascii", 8, 12) !== "WEBP"
  ) {
    return undefined;
  }
  const chunk = header.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return {
      width: header.readUIntLE(24, 3) + 1,
      height: header.readUIntLE(27, 3) + 1,
    };
  }
  if (chunk === "VP8 ") {
    return {
      width: header.readUInt16LE(26) & 0x3fff,
      height: header.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    const bits = header.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return undefined;
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

function extractPostDescription(source: string, title: string): string {
  const paragraph = source
    .replace(/^import\s.+$/gm, "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block.length > 0 && /^[A-Za-z0-9'‘"“]/.test(block));
  if (!paragraph) return title;

  const plain = paragraph
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= 160) return plain;
  const cut = plain.slice(0, 157);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
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
  hidden?: unknown;
};

type ParsedPostMeta = {
  title?: string;
  author?: string;
  date?: string;
  buttons: Array<{ title: string; link: string }>;
  showInlineToc: boolean;
  hidden: boolean;
};
type PostBuildData = {
  slug: string;
  sourcePostDir: string;
  postPath: string;
  metaPath: string;
  meta: ParsedPostMeta;
  title: string;
  description: string;
  wordCount: number;
  hasMath: boolean;
  date: string;
  coverFile?: string;
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
      hidden: asOptionalBoolean(parsed.hidden) ?? false,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to read post metadata: ${metaPath}`);
  }
}

function collectPostBuildData(postsDir: string): PostBuildData[] {
  if (!fs.existsSync(postsDir)) return [];

  return fs
    .readdirSync(postsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .flatMap((slug): PostBuildData[] => {
      const sourcePostDir = path.join(postsDir, slug);
      const postPath = path.join(sourcePostDir, "index.mdx");
      if (!fs.existsSync(postPath)) return [];

      const metaPath = path.join(sourcePostDir, "meta.json");
      const source = fs.readFileSync(postPath, "utf8");
      const stat = fs.statSync(postPath);
      const meta = readPostMeta(metaPath);
      const title = meta.title ?? extractPostTitle(source, slug);

      return [
        {
          slug,
          sourcePostDir,
          postPath,
          metaPath,
          meta,
          title,
          description: extractPostDescription(source, title),
          wordCount: extractPostWordCount(source),
          hasMath: MATH_SYNTAX.test(
            source.replace(/```[\s\S]*?```/g, " ").replace(/`[^`]*`/g, " "),
          ),
          date: meta.date ?? stat.mtime.toISOString().slice(0, 10),
          coverFile: POST_COVER_CANDIDATES.find((fileName) =>
            fs.existsSync(path.join(sourcePostDir, fileName)),
          ),
        },
      ];
    });
}

function replaceRequiredHtml(
  html: string,
  pattern: RegExp,
  replacement: string,
  label: string,
): string {
  if (!pattern.test(html)) {
    throw new Error(`Missing ${label} in app shell HTML`);
  }
  return html.replace(pattern, replacement);
}

function createSocialHtml(meta: SocialPageMeta, appShellHtml: string): string {
  const canonicalUrl = `${SITE_ORIGIN}${meta.canonicalPath}`;
  const socialImageUrl = `${SITE_ORIGIN}${meta.imagePath ?? DEFAULT_SOCIAL_IMAGE_PATH}`;
  const escapedTitle = escapeHtmlAttribute(meta.title);
  const escapedDescription = escapeHtmlAttribute(meta.description);
  const escapedImageAlt = escapeHtmlAttribute(
    meta.imageAlt ?? SOCIAL_IMAGE_ALT,
  );

  let html = replaceRequiredHtml(
    appShellHtml,
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapedTitle}</title>`,
    "title",
  );
  html = replaceRequiredHtml(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapedDescription}" />`,
    "description meta",
  );
  html = replaceRequiredHtml(
    html,
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:type" content="${meta.type}" />`,
    "Open Graph type meta",
  );
  html = replaceRequiredHtml(
    html,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapedTitle}" />`,
    "Open Graph title meta",
  );
  html = replaceRequiredHtml(
    html,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapedDescription}" />`,
    "Open Graph description meta",
  );
  html = replaceRequiredHtml(
    html,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    "Open Graph URL meta",
  );
  html = replaceRequiredHtml(
    html,
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${socialImageUrl}" />`,
    "Open Graph image meta",
  );
  html = replaceRequiredHtml(
    html,
    /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image:alt" content="${escapedImageAlt}" />`,
    "Open Graph image alt meta",
  );
  html = replaceRequiredHtml(
    html,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapedTitle}" />`,
    "Twitter title meta",
  );
  html = replaceRequiredHtml(
    html,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapedDescription}" />`,
    "Twitter description meta",
  );
  html = replaceRequiredHtml(
    html,
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${socialImageUrl}" />`,
    "Twitter image meta",
  );
  return replaceRequiredHtml(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    "canonical link",
  );
}

function writeSocialHtml(
  distDir: string,
  meta: SocialPageMeta,
  appShellHtml: string,
): void {
  const routeDir = path.join(distDir, meta.canonicalPath.slice(1));
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(
    path.join(routeDir, "index.html"),
    createSocialHtml(meta, appShellHtml),
  );
}

export default defineConfig({
  plugins: [
    {
      name: "rewrite-obsidian-image-embeds",
      enforce: "pre",
      transform(code: string, id: string): { code: string; map: null } | null {
        if (!id.endsWith(".mdx")) return null;
        if (!id.includes("/src/posts/")) return null;

        const transformed = addImageEnhancements(
          rewriteWikiEmbedsToMarkdown(code),
          path.dirname(id),
        );
        if (transformed === code) return null;

        return {
          code: transformed,
          map: null,
        };
      },
    },
    mdx({
      jsxImportSource: "preact",
      remarkPlugins: [remarkGfm, remarkMath, remarkDoubleDollarDisplayMath],
      rehypePlugins: [rehypeKatex, rehypeKeepPunctuationWithMath],
    }),
    preact(),
    {
      name: "virtual-posts-manifest",
      resolveId(id: string): string | undefined {
        if (id === VIRTUAL_POSTS_ID) return RESOLVED_VIRTUAL_POSTS_ID;
      },
      load(id: string): string | null {
        if (id !== RESOLVED_VIRTUAL_POSTS_ID) return null;

        const postsDir = path.resolve(process.cwd(), "src/posts");
        const importLines: string[] = [];
        const itemLines: string[] = [];
        let coverImportIndex = 0;
        let posts: PostBuildData[];

        try {
          posts = collectPostBuildData(postsDir);
        } catch (error) {
          this.error(error instanceof Error ? error.message : String(error));
          return null;
        }

        for (const post of posts) {
          this.addWatchFile(post.postPath);
          this.addWatchFile(post.metaPath);
          let coverExpr = "undefined";
          let coverAvifExpr = "undefined";
          let coverSizeExpr = "undefined";
          if (post.coverFile) {
            const importName = `cover${coverImportIndex++}`;
            const coverPath = `/src/posts/${post.slug}/${post.coverFile}`;
            importLines.push(
              `import ${importName} from ${JSON.stringify(coverPath)};`,
            );
            coverExpr = importName;
            const coverFilePath = path.join(post.sourcePostDir, post.coverFile);
            this.addWatchFile(coverFilePath);
            coverSizeExpr = JSON.stringify(readImageSize(coverFilePath));
            const avifFile = post.coverFile.replace(/\.[^.]+$/, ".avif");
            if (fs.existsSync(path.join(post.sourcePostDir, avifFile))) {
              importLines.push(
                `import ${importName}Avif from ${JSON.stringify(`/src/posts/${post.slug}/${avifFile}`)};`,
              );
              coverAvifExpr = `${importName}Avif`;
            }
          }

          itemLines.push(
            `{ slug: ${JSON.stringify(post.slug)}, title: ${JSON.stringify(
              post.title,
            )}, description: ${JSON.stringify(post.description)}, date: ${JSON.stringify(post.date)}, author: ${JSON.stringify(
              post.meta.author ?? "",
            )}, buttons: ${JSON.stringify(
              post.meta.buttons,
            )}, showInlineToc: ${JSON.stringify(
              post.meta.showInlineToc,
            )}, hidden: ${JSON.stringify(post.meta.hidden)}, cover: ${coverExpr}, coverAvif: ${coverAvifExpr}, coverSize: ${coverSizeExpr}, wordCount: ${post.wordCount}, hasMath: ${post.hasMath} }`,
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
          const match = rawUrl.match(
            /^\/(?:gallery|blog)\/([^/]+)\/slideshow\.html$/,
          );
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
        const appShellHtml = fs.readFileSync(
          path.join(distDir, "index.html"),
          "utf8",
        );
        const posts = collectPostBuildData(postsDir);

        for (const post of posts) {
          const distPostDir = path.join(distDir, "gallery", post.slug);
          fs.mkdirSync(distPostDir, { recursive: true });
          if (post.coverFile) {
            fs.copyFileSync(
              path.join(post.sourcePostDir, post.coverFile),
              path.join(distPostDir, post.coverFile),
            );
          }
          fs.writeFileSync(
            path.join(distPostDir, "index.html"),
            createSocialHtml(
              {
                canonicalPath: `/gallery/${post.slug}`,
                title: post.title,
                description: post.description,
                type: "article",
                imagePath: post.coverFile
                  ? `/gallery/${post.slug}/${post.coverFile}`
                  : undefined,
                imageAlt: post.coverFile ? post.title : undefined,
              },
              appShellHtml,
            ),
          );

          const slideshowSrcPath = path.join(
            post.sourcePostDir,
            "slideshow.html",
          );
          if (!fs.existsSync(slideshowSrcPath)) continue;

          fs.writeFileSync(
            path.join(distPostDir, "slideshow.html"),
            addAvifSourcesToHtml(
              fs.readFileSync(slideshowSrcPath, "utf8"),
              process.cwd(),
            ),
          );
          fs.cpSync(
            post.sourcePostDir,
            path.join(distDir, "src", "posts", post.slug),
            { recursive: true },
          );
        }

        for (const page of TOP_LEVEL_SOCIAL_PAGES) {
          writeSocialHtml(distDir, { ...page, type: "website" }, appShellHtml);
        }
      },
    },
  ],
  base: "/",
  build: {
    modulePreload: {
      resolveDependencies: (_filename: string, dependencies: string[]) =>
        dependencies.filter(
          (dependency) => !/^assets\/index-[\w-]+\.css$/.test(dependency),
        ),
    },
  },
  ssr: {
    noExternal: true,
    external: ["subset-font"],
  },
});
