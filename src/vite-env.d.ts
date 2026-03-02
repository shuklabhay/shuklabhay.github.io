/// <reference types="vite/client" />

declare module "*.mdx" {
  import type { ComponentType } from "react";

  export const meta:
    | {
        slug?: string;
        title: string;
        date: string;
        summary: string;
        cover?: string;
        tags?: string[];
      }
    | undefined;

  const MDXComponent: ComponentType;
  export default MDXComponent;
}

declare module "virtual:posts-manifest" {
  export const postsManifest: Array<{
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    author?: string;
    cover?: string;
    wordCount?: number;
  }>;
}
