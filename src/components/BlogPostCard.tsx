import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { MouseEvent as ReactMouseEvent } from "react";
import { loadPostBySlug } from "../posts";
import { preloadImage } from "../utils/imagePreload";
import type { PostMeta } from "../utils/types";
import { runWithRootViewTransition } from "../utils/viewTransitions";

type BlogPostCardProps = {
  post: PostMeta;
  formatPostDate: (raw: string) => string;
  shouldUseViewTransition?: boolean;
};

const DEFAULT_POST_HERO_IMAGE = "/static/landing-1280.avif";

function getPostYear(raw: string): string {
  return raw.match(/^\d{4}/)?.[0] ?? raw;
}

export default function BlogPostCard({
  post,
  formatPostDate,
  shouldUseViewTransition = true,
}: BlogPostCardProps): JSX.Element {
  const navigate = useNavigate();
  const postPath = `/blog/${post.slug}`;
  const heroSrc = post.cover ?? DEFAULT_POST_HERO_IMAGE;
  const [isHovered, setIsHovered] = useState(false);
  const dateLabel = post.date ? formatPostDate(post.date) : "";
  const yearLabel = post.date ? getPostYear(post.date) : "";

  const warmPostResources = (): void => {
    void preloadImage(heroSrc);
    void loadPostBySlug(post.slug);
    void import("../pages/Post.tsx");
  };

  const onCardClick = (event: ReactMouseEvent<HTMLAnchorElement>): void => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      return;

    event.preventDefault();
    const navigateToPost = (): void => {
      navigate(postPath, { state: { fromBlog: true } });
    };
    if (shouldUseViewTransition) {
      runWithRootViewTransition(navigateToPost);
      return;
    }
    navigateToPost();
  };

  return (
    <Link
      to={postPath}
      viewTransition={false}
      state={{ fromBlog: true }}
      onClick={onCardClick}
      style={{
        display: "grid",
        position: "relative",
        width: "100%",
        gridTemplateColumns: "minmax(0, 1fr) clamp(4rem, 10vw, 6.25rem)",
        alignItems: "baseline",
        columnGap: "clamp(0.75rem, 2vw, 1.6rem)",
        color: "white",
        borderBottom: "1px solid rgba(255, 255, 255, 0.24)",
        padding: "0.52rem 0",
        textDecoration: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        transition: "color 140ms ease, opacity 140ms ease",
      }}
      onMouseEnter={() => {
        warmPostResources();
        setIsHovered(true);
      }}
      onPointerLeave={() => setIsHovered(false)}
      onFocus={() => {
        warmPostResources();
        setIsHovered(true);
      }}
      onBlur={() => setIsHovered(false)}
      onTouchStart={warmPostResources}
      onPointerDown={warmPostResources}
    >
      <span
        title={post.title}
        style={{
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: isHovered ? "#d7e4ff" : "white",
          fontSize: "clamp(1.35rem, 2.45vw, 2.25rem)",
          fontWeight: 700,
          lineHeight: 1.24,
          transition: "color 140ms ease",
        }}
      >
        {post.title}
      </span>
      <span
        title={dateLabel}
        style={{
          minWidth: 0,
          paddingLeft: "clamp(0.8rem, 2vw, 1.4rem)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.22)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: "rgba(255, 255, 255, 0.86)",
          fontSize: "clamp(1.05rem, 1.9vw, 1.55rem)",
          fontWeight: 700,
          lineHeight: 1.24,
          textAlign: "left",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {yearLabel}
      </span>
    </Link>
  );
}
