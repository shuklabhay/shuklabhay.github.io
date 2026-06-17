import { renderToReadableStream } from "react-dom/server.browser";
import { StaticRouter } from "react-router-dom/server.js";
import { AppShell } from "./App";
import { allPosts } from "./posts";

export type PrerenderRoute = {
  canonicalPath: string;
  description: string;
  path: string;
  title: string;
  type: "article" | "website";
};

type ReactReadableStream = ReadableStream<Uint8Array> & {
  allReady: Promise<void>;
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
      description: "ㅤ",
      path: "/",
      title: SITE_TITLE,
      type: "website",
    },
    {
      canonicalPath: "/about",
      description: "about",
      path: "/about",
      title: `${SITE_TITLE} · About`,
      type: "website",
    },
    {
      canonicalPath: "/blog",
      description: "blog",
      path: "/blog",
      title: `${SITE_TITLE} · Blog`,
      type: "website",
    },
    {
      canonicalPath: "/contact",
      description: "contact",
      path: "/contact",
      title: `${SITE_TITLE} · Contact`,
      type: "website",
    },
    ...allPosts.map((post): PrerenderRoute => {
      const canonicalPath = withoutTrailingSlash(`/blog/${post.slug}`);
      return {
        canonicalPath,
        description: post.title,
        path: canonicalPath,
        title: post.title,
        type: "article",
      };
    }),
  ];
}

export async function renderRoute(pathname: string): Promise<string> {
  const stream = (await renderToReadableStream(
    <StaticRouter location={pathname}>
      <AppShell />
    </StaticRouter>,
  )) as ReactReadableStream;

  await stream.allReady;
  return new Response(stream).text();
}
