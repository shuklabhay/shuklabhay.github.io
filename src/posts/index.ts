import { postsManifest } from "virtual:posts-manifest";
import type { PostEntry, PostMeta, PostModule } from "../utils/types";

const postModuleLoaders = import.meta.glob<PostModule>("./*/index.mdx");

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

function storePostModule(slug: string, postModule: PostModule): PostEntry {
  const post = postBySlug.get(slug);
  const entry: PostEntry = {
    ...(post as PostMeta),
    Component: postModule.default,
  };
  postEntryBySlug.set(slug, entry);
  return entry;
}

export function registerPostModules(modules: Record<string, PostModule>): void {
  for (const [filePath, postModule] of Object.entries(modules)) {
    const slug = slugFromPath(filePath);
    if (postBySlug.has(slug)) storePostModule(slug, postModule);
  }
}

export function getPostBySlug(slug: string): PostMeta | undefined {
  return postBySlug.get(slug);
}

export function loadPostBySlug(slug: string): Promise<PostEntry | undefined> {
  const loaded = postEntryBySlug.get(slug);
  if (loaded) return Promise.resolve(loaded);

  const pending = pendingPostEntryBySlug.get(slug);
  if (pending) return pending;

  const loader = postModuleLoaderBySlug.get(slug);
  if (!loader || !postBySlug.has(slug)) return Promise.resolve(undefined);

  const promise = loader()
    .then((postModule) => storePostModule(slug, postModule))
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
