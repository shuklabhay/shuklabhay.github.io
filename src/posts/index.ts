import { postsManifest } from "virtual:posts-manifest";
import type { PostEntry, PostModule } from "../utils/types";

const modules = import.meta.glob<PostModule>("./*/index.mdx", { eager: true });

const componentBySlug = new Map(
  Object.entries(modules).map(([filePath, module]) => {
    const slug = filePath.split("/").slice(-2, -1)[0];
    return [slug, module.default] as const;
  }),
);

export const allPosts: PostEntry[] = postsManifest
  .map((meta) => {
    const Component = componentBySlug.get(meta.slug);
    if (!Component) return null;
    return {
      ...meta,
      Component,
    };
  })
  .filter((entry): entry is PostEntry => entry !== null)
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPostBySlug(slug: string): PostEntry | undefined {
  return allPosts.find((post) => post.slug === slug);
}
