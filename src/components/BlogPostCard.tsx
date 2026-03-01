import { useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { BlogPostCardProps } from "../utils/types";
import { preloadImage } from "../utils/imagePreload";

const DEFAULT_POST_HERO_IMAGE = "/static/landing-1280.avif";

export default function BlogPostCard({
  post,
  formatPostDate,
}: BlogPostCardProps) {
  const navigate = useNavigate();
  const isNavigatingRef = useRef(false);
  const postPath = `/blog/${post.slug}`;
  const heroSrc = post.cover ?? DEFAULT_POST_HERO_IMAGE;

  const warmHeroImage = () => {
    void preloadImage(heroSrc);
  };

  const onPostCardClick = async (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      return;
    if (isNavigatingRef.current) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    isNavigatingRef.current = true;
    await preloadImage(heroSrc);
    navigate(postPath);
    isNavigatingRef.current = false;
  };

  return (
    <Link
      to={postPath}
      className={`post-card${post.cover ? "" : " post-card-no-cover"}`}
      onMouseEnter={warmHeroImage}
      onFocus={warmHeroImage}
      onTouchStart={warmHeroImage}
      onClick={onPostCardClick}
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
