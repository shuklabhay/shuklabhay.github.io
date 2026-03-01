import { Link, useParams } from "react-router-dom";
import { getPostBySlug } from "../posts";

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

export default function Post() {
  const { slug = "" } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <main className="post-page post-page-enter" key={slug}>
        <Link className="post-back-link" to="/blog">
          ← Back to blog
        </Link>
        <h1 className="post-missing-title">Post not found</h1>
      </main>
    );
  }

  const Content = post.Component;
  const heroImage = post.cover ?? "/static/landing-1280.avif";

  return (
    <main className="post-page post-page-enter" key={slug}>
      <Link className="post-back-link" to="/blog">
        ← Back to blog
      </Link>
      <div
        className="post-hero"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
        aria-hidden
      />
      <div className="post-title-block">
        <h1 className="post-title">{post.title}</h1>
        {post.date ? <p className="post-date">{formatPostDate(post.date)}</p> : null}
      </div>
      <article className="post-content">
        <Content />
      </article>
    </main>
  );
}
