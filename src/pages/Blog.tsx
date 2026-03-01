import PageTitle, { CheckboxSubtitle } from "../components/PageTitle";
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
  const [sortField, setSortField] = useState<"date" | "alpha">("date");
  const [dateDirection, setDateDirection] = useState<"desc" | "asc">("desc");
  const [alphaDirection, setAlphaDirection] = useState<"desc" | "asc">("asc");

  const onDateSortClick = () => {
    if (sortField === "date") {
      setDateDirection((prev) => (prev === "desc" ? "asc" : "desc"));
      return;
    }
    setSortField("date");
  };

  const onAlphaSortClick = () => {
    if (sortField === "alpha") {
      setAlphaDirection((prev) => (prev === "desc" ? "asc" : "desc"));
      return;
    }
    setSortField("alpha");
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
    <main>
      <PageTitle title="I also write" />
      <CheckboxSubtitle
        mode="link"
        hoverFill
        activeIndexes={[sortField === "date" ? 0 : 1]}
        marginBottom="0.8rem"
        items={[
          {
            label: "date",
            arrowDirection: dateDirection === "desc" ? "down" : "up",
            arrowVisible: sortField === "date",
            onClick: onDateSortClick,
          },
          {
            label: `alphabetical ${alphaDirection === "asc" ? "a-z" : "z-a"}`,
            onClick: onAlphaSortClick,
          },
        ]}
      />
      <section className="posts-list">
        {sortedPosts.map((post) => (
          <article
            key={post.slug}
            className={`post-card${post.cover ? "" : " post-card-no-cover"}`}
          >
            {post.cover ? (
              <Link to={`/blog/${post.slug}`} className="post-card-cover-link">
                <img src={post.cover} alt={post.title} className="post-card-cover" />
              </Link>
            ) : null}
            <div className="post-card-content">
              <h2 className="post-card-title">
                <Link to={`/blog/${post.slug}`} className="post-card-title-link">
                  {post.title}
                </Link>
              </h2>
              {post.date ? (
                <p className="post-card-date">{formatPostDate(post.date)}</p>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
