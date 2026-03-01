import PageTitle from "../components/PageTitle";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { allPosts } from "../posts";

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
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  const sortedPosts = useMemo(() => {
    const sorted = [...allPosts];
    sorted.sort((a, b) =>
      sortDirection === "desc"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date),
    );
    return sorted;
  }, [sortDirection]);

  return (
    <main>
      <PageTitle title="I also write" />
      <button
        className="posts-sort-toggle"
        onClick={() =>
          setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"))
        }
      >
        date {sortDirection === "desc" ? "↓ newest first" : "↑ oldest first"}
      </button>
      <section className="posts-list">
        {sortedPosts.map((post) => (
          <article key={post.slug} className="post-card">
            {post.cover ? (
              <Link to={`/posts/${post.slug}`} className="post-card-cover-link">
                <img src={post.cover} alt={post.title} className="post-card-cover" />
              </Link>
            ) : null}
            <h2 className="post-card-title">
              <Link to={`/posts/${post.slug}`} className="post-card-title-link">
                {post.title}
              </Link>
            </h2>
            {post.date ? (
              <p className="post-card-date">{formatPostDate(post.date)}</p>
            ) : null}
            <p className="post-card-summary">{post.excerpt}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
