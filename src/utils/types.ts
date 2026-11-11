import type {
  ComponentType,
  MouseEventHandler,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";

export type GitHubRestReturn = unknown;
export type GitHubRepo = { full_name: string };

export type RouteTransitionState = {
  fromPath?: string;
};

export type ContactInfo = {
  title: string;
  link: string;
};

export type RichImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type PostButton = {
  title: string;
  link: string;
};

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  buttons: PostButton[];
  showInlineToc: boolean;
  hidden: boolean;
  cover?: string;
  wordCount?: number;
};

export type MDXContentComponent = ComponentType<{
  components?: Record<string, ComponentType>;
}>;

export type PostEntry = PostMeta & {
  Component: MDXContentComponent;
};

export type PostModule = {
  default: MDXContentComponent;
};

export type BlogPostCardProps = {
  post: PostMeta;
  formatPostDate: (raw: string) => string;
};

type CheckboxArrowDirection = "up" | "down";

type CheckboxItem<T extends string = string> = {
  label: T;
  onClick?: () => void;
  arrowDirection?: CheckboxArrowDirection;
};

export type PageTitleProps = {
  title: string;
  subtitle?: ReactNode;
};

export type CheckboxSubtitleLinkProps<T extends string = string> = {
  items: ReadonlyArray<CheckboxItem<T>>;
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
  images: RichImage[];
  currentIndex: number;
};

export type BlogPostProps = {
  title: string;
  byline?: string;
  buttons: PostButton[];
  heroImage?: string;
  contentRef: RefObject<HTMLElement>;
  onContentClick?: MouseEventHandler<HTMLElement>;
  header?: ReactNode;
  children: ReactNode;
};

export type BlogSortField = "date" | "alpha";
export type BlogSortDirection = "desc" | "asc";

export type BlogSortState = {
  sortField: BlogSortField;
  dateDirection: BlogSortDirection;
  alphaDirection: BlogSortDirection;
};

export type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => {
    finished: Promise<void>;
    ready: Promise<void>;
    skipTransition?: () => void;
  };
};
