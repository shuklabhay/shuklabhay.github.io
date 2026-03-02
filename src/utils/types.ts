import type { ComponentType, ReactNode, SetStateAction } from "react";

export type GitHubRestReturn = unknown;
export type GitHubRepo = { full_name: string };

export type RouteTransitionState = {
  fromPost?: boolean;
  fromBlog?: boolean;
};

export type ContactInfo = {
  title: string;
  link: string;
};

export type RichImage = {
  src: string;
  alt: string;
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  excerpt: string;
  cover?: string;
  wordCount?: number;
};

export type PostEntry = PostMeta & {
  Component: ComponentType;
};

export type PostModule = {
  default: ComponentType;
};

export type BlogPostCardProps = {
  post: PostMeta;
  formatPostDate: (raw: string) => string;
};

type CheckboxArrowDirection = "up" | "down";

type CheckboxItem<T extends string = string> = {
  label: T;
  defaultChecked?: boolean;
  href?: string;
  onClick?: () => void;
  arrowDirection?: CheckboxArrowDirection;
  arrowVisible?: boolean;
};

export type PageTitleProps = {
  title: string;
  subtitle?: ReactNode;
};

export type CheckboxSubtitleProps<T extends string = string> = {
  items: ReadonlyArray<CheckboxItem<T>>;
  storageKey?: string;
  mode?: "toggle" | "link";
  hoverFill?: boolean;
  selectedTags?: T[];
  setSelectedTags?: (value: T[] | ((prev: T[]) => T[])) => void;
  activeIndexes?: number[];
  marginTop?: string;
  marginBottom?: string;
};

type TriangleDirection = "up" | "down" | "left";

export type TriangleIconProps = {
  direction: TriangleDirection;
  size?: number | string;
};

export type ImageLightboxProps = {
  opened: boolean;
  setOpened: (value: SetStateAction<boolean>) => void;
  image: RichImage | null;
};

type UnderlineMode = "none" | "fade" | "move";

export type UnderlineStyle = {
  left: number;
  width: number;
  opacity: number;
  mode: UnderlineMode;
};

export type NavUnderlineState = {
  left: number;
  width: number;
  visible: boolean;
  animate: boolean;
};

export type BlogSortField = "date" | "alpha";
export type BlogSortDirection = "desc" | "asc";

export type BlogSortState = {
  sortField: BlogSortField;
  dateDirection: BlogSortDirection;
  alphaDirection: BlogSortDirection;
};

export type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => unknown;
};
