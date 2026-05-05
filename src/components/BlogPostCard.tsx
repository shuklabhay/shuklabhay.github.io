import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { MouseEvent as ReactMouseEvent } from "react";
import { loadPostBySlug } from "../posts";
import { preloadImage } from "../utils/imagePreload";
import type { PostMeta } from "../utils/types";
import { runWithRootViewTransition } from "../utils/viewTransitions";

type BlogPostCardProps = {
  post: PostMeta;
  shouldUseViewTransition?: boolean;
};

const DEFAULT_POST_HERO_IMAGE = "/static/landing-1280.avif";

function splitTitleForMiddleEllipsis(title: string): {
  prefix: string;
  suffix: string;
} {
  const words = title.trim().split(/\s+/);

  if (words.length <= 2) {
    return { prefix: title, suffix: "" };
  }

  return {
    prefix: words.slice(0, -1).join(" "),
    suffix: words[words.length - 1] ?? "",
  };
}

export default function BlogPostCard({
  post,
  shouldUseViewTransition = true,
}: BlogPostCardProps): JSX.Element {
  const navigate = useNavigate();
  const postPath = `/blog/${post.slug}`;
  const heroSrc = post.cover ?? DEFAULT_POST_HERO_IMAGE;
  const [isHovered, setIsHovered] = useState(false);
  const truncatedTitle = splitTitleForMiddleEllipsis(post.title);

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
        display: "block",
        width: "100%",
        color: "white",
        padding: "0.18rem 0",
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
          display: "flex",
          width: "100%",
          minWidth: 0,
          maxWidth: "100%",
          columnGap: truncatedTitle.suffix ? "0.24em" : 0,
          overflow: "hidden",
          whiteSpace: "nowrap",
          color: isHovered ? "#d7e4ff" : "white",
          fontSize: "clamp(1.08rem, 2vw, 1.82rem)",
          fontWeight: 700,
          lineHeight: 1.24,
          transition: "color 140ms ease",
        }}
      >
        <span
          style={{
            flex: "0 1 auto",
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {truncatedTitle.prefix}
        </span>
        {truncatedTitle.suffix ? (
          <span
            style={{
              flex: "0 0 auto",
              whiteSpace: "nowrap",
            }}
          >
            {truncatedTitle.suffix}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
