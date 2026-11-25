import { renderToString } from "preact-render-to-string";
import { StaticRouter } from "./router";
import { AppShell, getRouteDocumentTitle } from "./App";
import { allPosts, readPostBySlug, registerPostModules } from "./posts";
import type { PostModule } from "./utils/types";
import { readHeadingsFromHtml, seedPostHeadings } from "./utils/postHeadings";
import { loadPostPage } from "./pages/postPage";

registerPostModules(
  import.meta.glob<PostModule>("./posts/*/index.mdx", { eager: true }),
);

export type PrerenderRoute = {
  canonicalPath: string;
  description?: string;
  path: string;
  socialTitle: string;
  title: string;
  type: "article" | "website";
};

const SITE_TITLE = "Abhay Shukla";

function withoutTrailingSlash(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

export function getPrerenderRoutes(): PrerenderRoute[] {
  return [
    {
      canonicalPath: "/",
      path: "/",
      socialTitle: SITE_TITLE,
      title: SITE_TITLE,
      type: "website",
    },
    {
      canonicalPath: "/bio",
      path: "/bio",
      socialTitle: `${SITE_TITLE} · Bio`,
      title: `${SITE_TITLE} · Bio`,
      type: "website",
    },
    {
      canonicalPath: "/gallery",
      path: "/gallery",
      socialTitle: `${SITE_TITLE} · Gallery`,
      title: `${SITE_TITLE} · Gallery`,
      type: "website",
    },
    ...allPosts.map((post): PrerenderRoute => {
      const canonicalPath = withoutTrailingSlash(`/gallery/${post.slug}`);
      return {
        canonicalPath,
        description: post.description,
        path: canonicalPath,
        socialTitle: post.title,
        title: getRouteDocumentTitle(canonicalPath),
        type: "article",
      };
    }),
  ];
}

function renderOnce(pathname: string): string {
  return renderToString(
    <StaticRouter location={pathname}>
      <AppShell />
    </StaticRouter>,
  );
}

export function renderPostBody(slug: string): string {
  const Content = readPostBySlug(slug)?.Component;
  if (!Content) throw new Error(`Missing post module for ${slug}`);
  return renderToString(<Content components={{ h1: () => null }} />);
}

export async function renderRoute(pathname: string): Promise<string> {
  await loadPostPage();
  const html = renderOnce(pathname);
  const postSlug = pathname.match(/^\/gallery\/([^/]+)$/)?.[1];
  if (!postSlug) return html;
  seedPostHeadings(decodeURIComponent(postSlug), readHeadingsFromHtml(html));
  return renderOnce(pathname);
}
