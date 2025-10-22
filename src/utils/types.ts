// GitHub stats
export type GitHubRestReturn = any;
export type GitHubRepo = any;
export interface GHData {
  lastUpdated: string;
  contributions: number;
  linesModified: number;
}

// Tags
export type Tag = string;
export type CheckboxItem<T extends string = string> = {
  label: T;
  defaultChecked?: boolean;
  href?: string;
};

export const ABOUT_TAGS: readonly Tag[] = ["ML", "MechE", "Growth"];
export type AboutTagItems = ReadonlyArray<CheckboxItem<Tag>>;
export const ABOUT_TAG_ITEMS: AboutTagItems = ABOUT_TAGS.map((t) => ({
  label: t,
  defaultChecked: t === "ML",
}));
export const ABOUT_ALLOWED_TAGS: readonly Tag[] = [
  "always",
  ...ABOUT_TAGS.map((t) => t.toLowerCase()),
];

export type AwardRecord = {
  title: string;
  issuer: string;
  receivedYear: string;
  hide: boolean;
  tags: string[];
};

export const AWARD_ALLOWED_TAGS: readonly Tag[] = ["always", "ml", "meche"];
export const BLOG_TAGS: readonly Tag[] = ["ML", "Life"];
export type BlogTagItems = ReadonlyArray<CheckboxItem<Tag>>;
export const BLOG_TAG_ITEMS: BlogTagItems = BLOG_TAGS.map((t) => ({
  label: t,
  defaultChecked: t === "ML" || t === "Life",
}));

// Experience types
export type BulletPoint = { point: string; tags: string[] };
export type ExperienceIcon = { src: string; link: string } | null;
export type ExperienceRecord = {
  org: string;
  position: string;
  startYear: string;
  endYear: string | "Present";
  ongoing: boolean;
  details: BulletPoint[];
  icon: ExperienceIcon;
  hide: boolean;
};

// Media
export type RichImage = { src: string; alt: string };

export type ProjectLink = { url: string; description: string };
export type ProjectRecord = {
  title: string;
  details: { point: string; tags?: string[] }[];
  images?: RichImage[];
  link?: ProjectLink[];
  startYear: string;
  endYear: string | "Present";
  hide: boolean;
  tags: string[];
  broadDescription?: string;
};
