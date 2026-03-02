import PageTitle, { CheckboxSubtitleLink } from "../components/PageTitle";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import BlogPostCard from "../components/BlogPostCard";
import { allPosts } from "../posts";
import { shouldSkipEntryAnimation, useEntryFade } from "../utils/useEntryFade";
import { getLastPathname, isBlogPostPath } from "../utils/routeTransitions";
import { formatPostDate } from "../utils/formatPostDate";
import { preloadImage } from "../utils/imagePreload";
import type {
  BlogSortDirection,
  BlogSortField,
  BlogSortState,
  RouteTransitionState,
} from "../utils/types";

const BLOG_SORT_STORAGE_KEY = "blog-sort-state-v1";
const BLOG_ENTRY_FADE_MS = 620;
const DEFAULT_BLOG_SORT_STATE: BlogSortState = {
  sortField: "date",
  dateDirection: "desc",
  alphaDirection: "asc",
};

function isSortField(value: unknown): value is BlogSortField {
  return value === "date" || value === "alpha";
}

function isSortDirection(value: unknown): value is BlogSortDirection {
  return value === "desc" || value === "asc";
}

function readBlogSortStateFromStorage(): BlogSortState {
  if (typeof window === "undefined") return DEFAULT_BLOG_SORT_STATE;

  try {
    const raw = window.localStorage.getItem(BLOG_SORT_STORAGE_KEY);
    if (!raw) return DEFAULT_BLOG_SORT_STATE;

    const parsed = JSON.parse(raw) as Partial<BlogSortState>;
    return {
      sortField: isSortField(parsed.sortField)
        ? parsed.sortField
        : DEFAULT_BLOG_SORT_STATE.sortField,
      dateDirection: isSortDirection(parsed.dateDirection)
        ? parsed.dateDirection
        : DEFAULT_BLOG_SORT_STATE.dateDirection,
      alphaDirection: isSortDirection(parsed.alphaDirection)
        ? parsed.alphaDirection
        : DEFAULT_BLOG_SORT_STATE.alphaDirection,
    };
  } catch {
    return DEFAULT_BLOG_SORT_STATE;
  }
}

export default function Blog() {
  const location = useLocation();
  const blogTransitionState = location.state as RouteTransitionState | null;
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  const entryFadeDecisionByLocationKeyRef = useRef<{
    key: string;
    shouldAnimate: boolean;
  } | null>(null);

  if (entryFadeDecisionByLocationKeyRef.current?.key !== location.key) {
    const lastPathname = getLastPathname();
    entryFadeDecisionByLocationKeyRef.current = {
      key: location.key,
      shouldAnimate:
        blogTransitionState?.fromTopNav === true ||
        blogTransitionState?.fromPost === true ||
        (lastPathname ? isBlogPostPath(lastPathname) : false),
    };
  }

  const shouldAnimateBlogEntry =
    (entryFadeDecisionByLocationKeyRef.current?.shouldAnimate ?? false) &&
    !prefersReducedMotion &&
    !shouldSkipEntryAnimation();
  const blogEntryFadeStyle = useEntryFade(
    shouldAnimateBlogEntry,
    BLOG_ENTRY_FADE_MS,
  );
  const [sortState, setSortState] = useState<BlogSortState>(
    readBlogSortStateFromStorage,
  );
  const { sortField, dateDirection, alphaDirection } = sortState;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      BLOG_SORT_STORAGE_KEY,
      JSON.stringify({
        sortField,
        dateDirection,
        alphaDirection,
      } satisfies BlogSortState),
    );
  }, [sortField, dateDirection, alphaDirection]);

  const onDateSortClick = () => {
    setSortState((prev) =>
      prev.sortField === "date"
        ? {
            ...prev,
            dateDirection: prev.dateDirection === "desc" ? "asc" : "desc",
          }
        : {
            ...prev,
            sortField: "date",
          },
    );
  };

  const onAlphaSortClick = () => {
    setSortState((prev) =>
      prev.sortField === "alpha"
        ? {
            ...prev,
            alphaDirection: prev.alphaDirection === "desc" ? "asc" : "desc",
          }
        : {
            ...prev,
            sortField: "alpha",
          },
    );
  };

  const sortedPosts = useMemo(() => {
    const sorted = [...allPosts];
    sorted.sort((a, b) => {
      if (sortField === "date") {
        const dateCompare =
          dateDirection === "desc"
            ? b.date.localeCompare(a.date)
            : a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.title.localeCompare(b.title);
      }

      const alphaCompare =
        alphaDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      if (alphaCompare !== 0) return alphaCompare;
      return b.date.localeCompare(a.date);
    });

    return sorted;
  }, [sortField, dateDirection, alphaDirection]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const topPostsToPrime = 4;
    for (const post of sortedPosts.slice(0, topPostsToPrime)) {
      void preloadImage(post.cover ?? "/static/landing-1280.avif");
    }
  }, [sortedPosts]);

  return (
    <main
      style={{
        ...blogEntryFadeStyle,
        width: "100%",
        color: "white",
        paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
      }}
    >
      <div style={{ position: "relative" }}>
        <PageTitle title="I write" />
      </div>
      <div style={{ position: "relative" }}>
        <CheckboxSubtitleLink
          hoverFill
          activeIndexes={[sortField === "date" ? 0 : 1]}
          marginBottom="0.8rem"
          items={[
            {
              label: "date",
              arrowDirection: dateDirection === "desc" ? "down" : "up",
              onClick: onDateSortClick,
            },
            {
              label: `alphabetical ${alphaDirection === "asc" ? "a-z" : "z-a"}`,
              onClick: onAlphaSortClick,
            },
          ]}
        />
      </div>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "0.65rem",
          marginTop: "1rem",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
      >
        {sortedPosts.map((post, index) => (
          <BlogPostCard
            key={post.slug}
            post={post}
            formatPostDate={formatPostDate}
            prioritizeImage={index < 4}
            shouldUseViewTransition={
              !prefersReducedMotion && !shouldSkipEntryAnimation()
            }
          />
        ))}
      </section>
    </main>
  );
}
