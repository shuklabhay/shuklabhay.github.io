import { postsManifest } from "virtual:posts-manifest";
import type { PostEntry, PostMeta, PostModule } from "../utils/types";

const postModuleLoaders: Record<string, () => Promise<PostModule>> = import.meta
  .env.DEV
  ? import.meta.glob<PostModule>("./*/index.mdx")
  : {};

function slugFromPath(filePath: string): string {
  return filePath.split("/").slice(-2, -1)[0] ?? "";
}

const postModuleLoaderBySlug = new Map(
  Object.entries(postModuleLoaders).map(
    ([filePath, loader]) => [slugFromPath(filePath), loader] as const,
  ),
);

export const allPosts: PostMeta[] = [...postsManifest].sort((a, b) =>
  b.date.localeCompare(a.date),
);

const postBySlug = new Map(allPosts.map((post) => [post.slug, post] as const));
const postEntryBySlug = new Map<string, PostEntry>();
const pendingPostEntryBySlug = new Map<
  string,
  Promise<PostEntry | undefined>
>();

export type LightboxComponent =
  typeof import("../components/ImageLightbox").default;

let lightboxPromise: Promise<LightboxComponent> | null = null;

export function loadLightbox(): Promise<LightboxComponent> {
  lightboxPromise ??= import("../components/ImageLightbox").then(
    (module) => module.default,
    (error: unknown) => {
      lightboxPromise = null;
      throw error;
    },
  );
  return lightboxPromise;
}

let mathStylesPromise: Promise<unknown> | null = null;
let mathCopyPromise: Promise<unknown> | null = null;

function loadMathCopy(): Promise<unknown> {
  mathCopyPromise ??= import("../mathCopy").catch(() => {
    mathCopyPromise = null;
  });
  return mathCopyPromise;
}

export function loadMathStyles(): Promise<unknown> {
  mathStylesPromise ??= Promise.all([
    import("../mathStyles"),
    loadMathCopy(),
  ]).catch(() => {
    mathStylesPromise = null;
  });
  return mathStylesPromise;
}

export function adoptInlinedMathStyles(): void {
  mathStylesPromise ??= loadMathCopy();
}

function storePostEntry(
  slug: string,
  content: Pick<PostEntry, "Component" | "html">,
): PostEntry {
  const entry: PostEntry = {
    ...(postBySlug.get(slug) as PostMeta),
    ...content,
  };
  postEntryBySlug.set(slug, entry);
  return entry;
}

export function registerPostModules(modules: Record<string, PostModule>): void {
  for (const [filePath, postModule] of Object.entries(modules)) {
    const slug = slugFromPath(filePath);
    if (postBySlug.has(slug)) {
      storePostEntry(slug, { Component: postModule.default });
    }
  }
}

export function registerPostHtml(slug: string, html: string): void {
  if (postBySlug.has(slug)) storePostEntry(slug, { html });
}

export function getPostBySlug(slug: string): PostMeta | undefined {
  return postBySlug.get(slug);
}

function fetchPostContent(
  slug: string,
): Promise<Pick<PostEntry, "Component" | "html">> {
  const loader = postModuleLoaderBySlug.get(slug);
  if (loader) return loader().then((module) => ({ Component: module.default }));
  return fetch(`/gallery/${encodeURIComponent(slug)}/body.html`).then(
    (response) => {
      if (!response.ok) throw new Error(`Failed to load post ${slug}`);
      return response.text().then((html) => ({ html }));
    },
  );
}

export function loadPostBySlug(slug: string): Promise<PostEntry | undefined> {
  const loaded = postEntryBySlug.get(slug);
  if (loaded) return Promise.resolve(loaded);

  const pending = pendingPostEntryBySlug.get(slug);
  if (pending) return pending;

  const post = postBySlug.get(slug);
  if (!post) return Promise.resolve(undefined);

  const promise = Promise.all([
    fetchPostContent(slug),
    post.hasMath ? loadMathStyles() : undefined,
  ])
    .then(([content]) => storePostEntry(slug, content))
    .catch(() => undefined)
    .finally(() => {
      pendingPostEntryBySlug.delete(slug);
    });
  pendingPostEntryBySlug.set(slug, promise);
  return promise;
}

export function getLoadedPostBySlug(slug: string): PostEntry | undefined {
  return postEntryBySlug.get(slug);
}

export function readPostBySlug(slug: string): PostEntry | undefined {
  return postEntryBySlug.get(slug);
}
