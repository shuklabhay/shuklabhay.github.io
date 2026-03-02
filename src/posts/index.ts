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

export function getPostBySlug(slug: string): PostMeta | undefined {
  return postBySlug.get(slug);
}

export function loadPostBySlug(slug: string): Promise<PostEntry | undefined> {
  const inFlightTask = postEntryPromiseBySlug.get(slug);
  if (inFlightTask) return inFlightTask;

  const postSummary = postBySlug.get(slug);
  const loadModule = moduleLoaderBySlug.get(slug);

  if (!postSummary || !loadModule) {
    return Promise.resolve(undefined);
  }

  const task = loadModule()
    .then((module) => ({
      ...postSummary,
      Component: module.default,
    }))
    .catch((error: unknown) => {
      console.error(`Failed to load post module for slug "${slug}"`, error);
      return undefined;
    });

  postEntryPromiseBySlug.set(slug, task);
  return task;
}
