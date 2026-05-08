import { postsManifest } from "virtual:posts-manifest";
import type { PostEntry, PostMeta, PostModule } from "../utils/types";

const moduleLoaders = import.meta.glob<PostModule>("./*/index.mdx");

const moduleLoaderBySlug = new Map(
  Object.entries(moduleLoaders).map(([filePath, loadModule]) => {
    const slug = filePath.split("/").slice(-2, -1)[0];
    return [slug, loadModule] as const;
  }),
);

export const allPosts: PostMeta[] = [...postsManifest].sort((a, b) =>
  b.date.localeCompare(a.date),
);

const postBySlug = new Map(allPosts.map((post) => [post.slug, post] as const));
const postEntryPromiseBySlug = new Map<
  string,
  Promise<PostEntry | undefined>
>();
const postEntryBySlug = new Map<string, PostEntry>();

export function getPostBySlug(slug: string): PostMeta | undefined {
  return postBySlug.get(slug);
}

export function loadPostBySlug(slug: string): Promise<PostEntry | undefined> {
  const loadedPostEntry = postEntryBySlug.get(slug);
  if (loadedPostEntry) return Promise.resolve(loadedPostEntry);

  const inFlightTask = postEntryPromiseBySlug.get(slug);
  if (inFlightTask) return inFlightTask;

  const postSummary = postBySlug.get(slug);
  const loadModule = moduleLoaderBySlug.get(slug);

  if (!postSummary || !loadModule) {
    return Promise.resolve(undefined);
  }

  const task = loadModule()
    .then((module) => {
      const postEntry: PostEntry = {
        ...postSummary,
        Component: module.default,
      };
      postEntryBySlug.set(slug, postEntry);
      return postEntry;
    })
    .catch((error: unknown) => {
      console.error(`Failed to load post module for slug "${slug}"`, error);
      return undefined;
    });

  postEntryPromiseBySlug.set(slug, task);
  return task;
}

export function getLoadedPostBySlug(slug: string): PostEntry | undefined {
  return postEntryBySlug.get(slug);
}

export function readPostBySlug(slug: string): PostEntry | undefined {
  const loadedPostEntry = getLoadedPostBySlug(slug);
  if (loadedPostEntry || !postBySlug.has(slug)) return loadedPostEntry;

  throw loadPostBySlug(slug);
}
