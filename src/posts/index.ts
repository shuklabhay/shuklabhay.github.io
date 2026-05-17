import { postsManifest } from "virtual:posts-manifest";
import type { PostEntry, PostMeta, PostModule } from "../utils/types";

const postModules = import.meta.glob<PostModule>("./*/index.mdx", {
  eager: true,
});

const postModuleBySlug = new Map(
  Object.entries(postModules).map(([filePath, postModule]) => {
    const slug = filePath.split("/").slice(-2, -1)[0];
    return [slug, postModule] as const;
  }),
);

export const allPosts: PostMeta[] = [...postsManifest].sort((a, b) =>
  b.date.localeCompare(a.date),
);

const postBySlug = new Map(allPosts.map((post) => [post.slug, post] as const));
const postEntryBySlug = new Map(
  allPosts.flatMap((post): Array<readonly [string, PostEntry]> => {
    const postModule = postModuleBySlug.get(post.slug);
    if (!postModule) return [];

    return [
      [
        post.slug,
        {
          ...post,
          Component: postModule.default,
        },
      ],
    ];
  }),
);

export function getPostBySlug(slug: string): PostMeta | undefined {
  return postBySlug.get(slug);
}

export function loadPostBySlug(slug: string): Promise<PostEntry | undefined> {
  return Promise.resolve(postEntryBySlug.get(slug));
}

export function getLoadedPostBySlug(slug: string): PostEntry | undefined {
  return postEntryBySlug.get(slug);
}

export function readPostBySlug(slug: string): PostEntry | undefined {
  return postEntryBySlug.get(slug);
}
