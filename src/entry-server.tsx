import { renderToReadableStream } from "react-dom/server.browser";
import { StaticRouter } from "react-router-dom/server.js";
import { AppShell, getRouteDocumentTitle } from "./App";
import { allPosts } from "./posts";

export type PrerenderRoute = {
  canonicalPath: string;
  description: string;
  path: string;
  socialTitle: string;
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
      description:
        "I make video games, music, circuits, neural networks, webapps, and many other things.",
      path: "/",
      socialTitle: SITE_TITLE,
      title: SITE_TITLE,
      type: "website",
    },
    {
      canonicalPath: "/about",
      description:
        "I've been manipulating computers since I was 9, almost entirely self-taught.",
      path: "/about",
      socialTitle: `${SITE_TITLE} · About`,
      title: `${SITE_TITLE} · About`,
      type: "website",
    },
    {
      canonicalPath: "/gallery",
      description: "Projects and writing by Abhay Shukla.",
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

export async function renderRoute(pathname: string): Promise<string> {
  const stream = (await renderToReadableStream(
    <StaticRouter location={pathname}>
      <AppShell />
    </StaticRouter>,
  )) as ReactReadableStream;

  await stream.allReady;
  return new Response(stream).text();
}
