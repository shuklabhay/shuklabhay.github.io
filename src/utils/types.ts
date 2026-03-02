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
  fromPost?: boolean;
  fromBlog?: boolean;
  fromTopNav?: boolean;
};

export type ContactInfo = {
  title: string;
  link: string;
};

export type RichImage = {
  src: string;
  alt: string;
};

export type PostButton = {
  title: string;
  link: string;
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  author: string;
  buttons: PostButton[];
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

export type CheckboxSubtitleLinkProps<T extends string = string> = {
  items: ReadonlyArray<CheckboxItem<T>>;
  hoverFill?: boolean;
  activeIndexes?: number[];
  marginTop?: string;
  marginBottom?: string;
};

export type CheckboxSubtitleToggleProps<T extends string = string> = {
  items: ReadonlyArray<CheckboxItem<T>>;
  storageKey?: string;
  hoverFill?: boolean;
  selectedTags?: T[];
  setSelectedTags?: (value: T[] | ((prev: T[]) => T[])) => void;
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
  setCurrentIndex: (
    value: SetStateAction<number>,
  ) => void;
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

export type ResizeEdge = "left" | "right";

export type ResizeState = {
  edge: ResizeEdge;
  startX: number;
  startWidth: number;
};

export type BlogPostProps = {
  isEntryReady: boolean;
  title: string;
  byline?: string;
  buttons: PostButton[];
  heroImage: string;
  contentRef: RefObject<HTMLElement>;
  onContentClick?: MouseEventHandler<HTMLElement>;
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
  startViewTransition?: (update: () => void | Promise<void>) => unknown;
};
