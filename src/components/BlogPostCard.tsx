import { Link } from "react-router-dom";
import type { BlogPostCardProps } from "../utils/types";
import { preloadImage } from "../utils/imagePreload";

const DEFAULT_POST_HERO_IMAGE = "/static/landing-1280.avif";

export default function BlogPostCard({
  post,
  formatPostDate,
}: BlogPostCardProps) {
  const postPath = `/blog/${post.slug}`;
  const heroSrc = post.cover ?? DEFAULT_POST_HERO_IMAGE;

  const warmHeroImage = () => {
    void preloadImage(heroSrc);
  };

  return (
    <Link
      to={postPath}
      viewTransition
      state={{ fromBlog: true }}
      className={`post-card${post.cover ? "" : " post-card-no-cover"}`}
      onMouseEnter={warmHeroImage}
      onFocus={warmHeroImage}
      onTouchStart={warmHeroImage}
      onPointerDown={warmHeroImage}
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
