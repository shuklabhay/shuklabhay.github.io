import PageTitle, { CheckboxSubtitle } from "../components/PageTitle";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { allPosts } from "../posts";

type SortField = "date" | "alpha";
type SortDirection = "desc" | "asc";

type BlogSortState = {
  sortField: SortField;
  dateDirection: SortDirection;
  alphaDirection: SortDirection;
};

const BLOG_SORT_STORAGE_KEY = "blog-sort-state-v1";
const DEFAULT_BLOG_SORT_STATE: BlogSortState = {
  sortField: "date",
  dateDirection: "desc",
  alphaDirection: "asc",
};

function isSortField(value: unknown): value is SortField {
  return value === "date" || value === "alpha";
}

function isSortDirection(value: unknown): value is SortDirection {
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

function formatPostDate(raw: string) {
  if (!raw) return "";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Blog() {
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

  return (
    <main className="blog-page">
      <div className="blog-page-title">
        <PageTitle title="I also write" />
      </div>
      <div className="blog-page-controls">
        <CheckboxSubtitle
          mode="link"
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
      <section className="posts-list">
        {sortedPosts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className={`post-card${post.cover ? "" : " post-card-no-cover"}`}
          >
            {post.cover ? (
              <img
                src={post.cover}
                alt={post.title}
                className="post-card-cover"
              />
            ) : null}
            <div className="post-card-content">
              <h2 className="post-card-title">
                <span className="post-card-title-link">{post.title}</span>
              </h2>
              {post.date ? (
                <p className="post-card-date">{formatPostDate(post.date)}</p>
              ) : null}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
