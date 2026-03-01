import { Link } from "react-router-dom";
import type { BlogPostCardProps } from "../utils/types";

export default function BlogPostCard({
  post,
  formatPostDate,
}: BlogPostCardProps) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`post-card${post.cover ? "" : " post-card-no-cover"}`}
    >
      {post.cover ? (
        <img src={post.cover} alt={post.title} className="post-card-cover" />
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
  );
}
