import PageTitle, { CheckboxSubtitleLink } from "../components/PageTitle";
import { useEffect, useMemo, useState } from "react";
import BlogPostCard from "../components/BlogPostCard";
import { allPosts } from "../posts";
import { preloadImage } from "../utils/imagePreload";
import type {
  BlogSortDirection,
  BlogSortField,
  BlogSortState,
} from "../utils/types";

const BLOG_SORT_STORAGE_KEY = "blog-sort-state-v1";
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
  const [sortState, setSortState] = useState<BlogSortState>(
    DEFAULT_BLOG_SORT_STATE,
  );
  const [hasLoadedSortState, setHasLoadedSortState] = useState(false);
  const { sortField, dateDirection, alphaDirection } = sortState;

  useEffect(() => {
    setSortState(readBlogSortStateFromStorage());
    setHasLoadedSortState(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedSortState) return;
    window.localStorage.setItem(
      BLOG_SORT_STORAGE_KEY,
      JSON.stringify({
        sortField,
        dateDirection,
        alphaDirection,
      } satisfies BlogSortState),
    );
  }, [sortField, dateDirection, alphaDirection, hasLoadedSortState]);

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
    const sorted = allPosts.filter((post) => !post.hidden);
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
      className="route-page-gallery"
      style={{
        width: "100%",
        color: "var(--ink)",
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
          maxWidth: "var(--reading-width)",
          gap: "0.18rem",
          marginTop: "1.2rem",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
      >
        {sortedPosts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}
