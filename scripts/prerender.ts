import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

type PrerenderRoute = {
  canonicalPath: string;
  description: string;
  path: string;
  socialTitle: string;
  title: string;
  type: "article" | "website";
};

type ServerEntry = {
  getPrerenderRoutes: () => PrerenderRoute[];
  renderRoute: (pathname: string) => Promise<string>;
};

const SITE_ORIGIN = "https://shuklabhay.github.io";
const DEFAULT_SOCIAL_IMAGE_PATH = "/static/landing-1280.webp";
const SOCIAL_IMAGE_ALT = "Abhay Shukla portfolio landing image";
const PROJECT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const DIST_DIR = path.join(PROJECT_ROOT, "dist");
const DIST_SSR_DIR = path.join(PROJECT_ROOT, "dist-ssr");
const DIST_ASSETS_DIR = path.join(DIST_DIR, "assets");

const KATEX_FONTS_BY_CLASS: Record<string, string[]> = {
  katex: ["Main-Regular"],
  mathnormal: ["Math-Italic"],
  mathit: ["Main-Italic"],
  mathbf: ["Main-Bold"],
  textbf: ["Main-Bold"],
  boldsymbol: ["Math-BoldItalic"],
  amsrm: ["AMS-Regular"],
  mathbb: ["AMS-Regular"],
  textbb: ["AMS-Regular"],
  mathcal: ["Caligraphic-Regular"],
  mathfrak: ["Fraktur-Regular"],
  textfrak: ["Fraktur-Regular"],
  mathscr: ["Script-Regular"],
  textscr: ["Script-Regular"],
  mathsf: ["SansSerif-Regular"],
  textsf: ["SansSerif-Regular"],
  mathtt: ["Typewriter-Regular"],
  texttt: ["Typewriter-Regular"],
  "small-op": ["Size1-Regular"],
  "large-op": ["Size2-Regular"],
};

const KATEX_DELIMITER_FONTS: Record<string, string> = {
  size1: "Size1-Regular",
  size2: "Size2-Regular",
  size3: "Size3-Regular",
  size4: "Size4-Regular",
};

function usedKatexFonts(appHtml: string): Set<string> {
  const fonts = new Set<string>();
  for (const match of appHtml.matchAll(/\sclass="([^"]*)"/g)) {
    const classes = match[1].split(/\s+/);
    for (const className of classes) {
      for (const font of KATEX_FONTS_BY_CLASS[className] ?? []) {
        fonts.add(font);
      }
    }
    if (classes.includes("delimsizing")) {
      for (const className of classes) {
        const font = KATEX_DELIMITER_FONTS[className];
        if (font) fonts.add(font);
      }
    }
  }
  return fonts;
}

function katexFontPreloads(appHtml: string, assetFiles: string[]): string {
  return [...usedKatexFonts(appHtml)]
    .map((font) =>
      assetFiles.find(
        (file) => file.startsWith(`KaTeX_${font}-`) && file.endsWith(".woff2"),
      ),
    )
    .filter((file): file is string => Boolean(file))
    .map(
      (file) =>
        `    <link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />\n`,
    )
    .join("");
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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

function routeFilePath(routePath: string): string {
  if (routePath === "/") return path.join(DIST_DIR, "index.html");
  return path.join(DIST_DIR, routePath.replace(/^\/+/, ""), "index.html");
}

function addClassToTag(
  html: string,
  tagName: string,
  className: string,
): string {
  return html.replace(
    new RegExp(`<${tagName}([^>]*)>`),
    (_match: string, attrs: string): string => {
      const classMatch = attrs.match(/\sclass="([^"]*)"/);
      if (classMatch) {
        const classes = new Set(classMatch[1].split(/\s+/).filter(Boolean));
        classes.add(className);
        return `<${tagName}${attrs.replace(
          /\sclass="[^"]*"/,
          ` class="${Array.from(classes).join(" ")}"`,
        )}>`;
      }
      return `<${tagName}${attrs} class="${className}">`;
    },
  );
}

function createPrerenderedHtml(
  appShellHtml: string,
  route: PrerenderRoute,
  appHtml: string,
  assetFiles: string[],
): string {
  const canonicalUrl = `${SITE_ORIGIN}${route.canonicalPath}`;
  const socialImageUrl = `${SITE_ORIGIN}${DEFAULT_SOCIAL_IMAGE_PATH}`;
  const escapedTitle = escapeHtmlAttribute(route.title);
  const escapedSocialTitle = escapeHtmlAttribute(route.socialTitle);
  const escapedDescription = escapeHtmlAttribute(route.description);
  const escapedImageAlt = escapeHtmlAttribute(SOCIAL_IMAGE_ALT);
  const isHomeVisualRoute = route.path === "/";
  let html = appShellHtml;

  if (!isHomeVisualRoute) {
    html = html.replace(
      /\s*<link\s+rel="preload"\s+href="\/static\/landing-1280\.webp"[\s\S]*?\/>\n/,
      "\n",
    );
  }

  html = replaceRequiredHtml(
    html,
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
    `<meta property="og:type" content="${route.type}" />`,
    "Open Graph type meta",
  );
  html = replaceRequiredHtml(
    html,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapedSocialTitle}" />`,
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
    `<meta name="twitter:title" content="${escapedSocialTitle}" />`,
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
  html = replaceRequiredHtml(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    "canonical link",
  );
  html = replaceRequiredHtml(
    html,
    /<div id="root"><\/div>/,
    `<div id="root" data-prerendered="true" data-prerendered-path="${escapeHtmlAttribute(route.canonicalPath)}">${appHtml}</div>`,
    "root element",
  );

  const fontPreloads = katexFontPreloads(appHtml, assetFiles);
  if (fontPreloads) {
    html = html.replace("</head>", `${fontPreloads}  </head>`);
  }

  if (isHomeVisualRoute) {
    html = addClassToTag(html, "html", "route-home");
    html = addClassToTag(html, "body", "route-home");
  }

  return html;
}

function createRedirectHtml(targetPath: string): string {
  const targetUrl = escapeHtmlAttribute(`${SITE_ORIGIN}${targetPath}`);
  return [
    "<!doctype html>",
    '<html lang="en">',
    "  <head>",
    '    <meta charset="utf-8" />',
    "    <title>Redirecting…</title>",
    '    <meta name="robots" content="noindex" />',
    `    <link rel="canonical" href="${targetUrl}" />`,
    `    <meta http-equiv="refresh" content="0; url=${escapeHtmlAttribute(targetPath)}" />`,
    `    <script>location.replace(${JSON.stringify(targetPath)} + location.search + location.hash);</script>`,
    "  </head>",
    "  <body></body>",
    "</html>",
    "",
  ].join("\n");
}

async function writeLegacyBlogRedirects(
  routes: PrerenderRoute[],
): Promise<void> {
  const redirects: Array<[string, string]> = [
    ["/blog/index.html", "/gallery"],
    ["/contact/index.html", "/about#contact"],
  ];

  for (const route of routes) {
    if (!route.canonicalPath.startsWith("/gallery/")) continue;
    const slugPath = route.canonicalPath.slice("/gallery".length);
    redirects.push([`/blog${slugPath}/index.html`, route.canonicalPath]);

    const slideshowPath = `${route.canonicalPath}/slideshow.html`;
    try {
      await fs.access(path.join(DIST_DIR, slideshowPath));
      redirects.push([`/blog${slugPath}/slideshow.html`, slideshowPath]);
    } catch {
      continue;
    }
  }

  for (const [legacyPath, targetPath] of redirects) {
    const outputPath = path.join(DIST_DIR, legacyPath);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, createRedirectHtml(targetPath));
  }
}

async function findServerEntryPath(): Promise<string> {
  const candidates = ["entry-server.js", "entry-server.mjs"].map(
    (fileName: string): string => path.join(DIST_SSR_DIR, fileName),
  );

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }

  throw new Error("Missing SSR entry build output");
}

async function main(): Promise<void> {
  const appShellHtml = await fs.readFile(
    path.join(DIST_DIR, "index.html"),
    "utf8",
  );
  const serverEntryPath = await findServerEntryPath();
  const { getPrerenderRoutes, renderRoute } = (await import(
    pathToFileURL(serverEntryPath).href
  )) as ServerEntry;
  const routes = getPrerenderRoutes();
  const assetFiles = await fs.readdir(DIST_ASSETS_DIR);

  for (const route of routes) {
    const appHtml = await renderRoute(route.path);
    const outputPath = routeFilePath(route.canonicalPath);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(
      outputPath,
      createPrerenderedHtml(appShellHtml, route, appHtml, assetFiles),
    );
  }

  await writeLegacyBlogRedirects(routes);

  const canonicalPaths = [
    ...new Set(routes.map((route) => route.canonicalPath)),
  ];
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...canonicalPaths.map(
      (canonicalPath) =>
        `  <url><loc>${escapeHtmlAttribute(`${SITE_ORIGIN}${canonicalPath}`)}</loc></url>`,
    ),
    "</urlset>",
    "",
  ].join("\n");
  await fs.writeFile(path.join(DIST_DIR, "sitemap.xml"), sitemap);

  console.log(`Prerendered ${routes.length} routes.`);
}

main().catch((error: unknown): void => {
  console.error(error);
  process.exitCode = 1;
});
