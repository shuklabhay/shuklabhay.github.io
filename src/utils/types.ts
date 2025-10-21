// GitHub stats
export type GitHubRestReturn = any;
export type GitHubRepo = any;
export interface GHData {
  lastUpdated: string;
  contributions: number;
  linesModified: number;
}

// Tags
export type CheckboxItem<T extends string = string> = {
  label: T;
  defaultChecked?: boolean;
  href?: string;
};

export const ABOUT_TAGS = ["ML", "Software", "MechE", "Growth"] as const;
export type AboutTag = (typeof ABOUT_TAGS)[number];
export type AboutTagItem = CheckboxItem<AboutTag>;
export type AboutTagItems = ReadonlyArray<AboutTagItem>;
export const ABOUT_TAG_ITEMS: AboutTagItems = ABOUT_TAGS.map((t) => ({
  label: t,
  defaultChecked: t === "ML",
}));

export const BLOG_TAGS = ["ML", "Life"] as const;
export type BlogTag = (typeof BLOG_TAGS)[number];
export type BlogTagItem = CheckboxItem<BlogTag>;
export type BlogTagItems = ReadonlyArray<BlogTagItem>;
export const BLOG_TAG_ITEMS: BlogTagItems = BLOG_TAGS.map((t) => ({
  label: t,
  defaultChecked: t === "ML" || t === "Life",
}));
