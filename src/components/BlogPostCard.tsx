import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { PostMeta } from "../utils/types";
import { loadPostBySlug } from "../posts";
import { preloadImage } from "../utils/imagePreload";
import { runWithRootViewTransition } from "../utils/viewTransitions";

type BlogPostCardProps = {
  post: PostMeta;
  formatPostDate: (raw: string) => string;
  prioritizeImage?: boolean;
  shouldUseViewTransition?: boolean;
};

const DEFAULT_POST_HERO_IMAGE = "/static/landing-1280.avif";

export default function BlogPostCard({
  post,
  formatPostDate,
  prioritizeImage = false,
  shouldUseViewTransition = true,
}: BlogPostCardProps) {
  const navigate = useNavigate();
  const postPath = `/blog/${post.slug}`;
  const heroSrc = post.cover ?? DEFAULT_POST_HERO_IMAGE;
  const [isHovered, setIsHovered] = useState(false);
  const postMetaParts = [
    post.date ? formatPostDate(post.date) : undefined,
    typeof post.wordCount === "number"
      ? `${post.wordCount.toLocaleString()} ${
          post.wordCount === 1 ? "word" : "words"
        }`
      : undefined,
  ].filter((part): part is string => Boolean(part));

  const warmPostResources = () => {
    void preloadImage(heroSrc);
    void loadPostBySlug(post.slug);
    void import("../pages/Post.tsx");
  };

  const onCardClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      return;

    event.preventDefault();
    const navigateToPost = () => {
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
        width: "100%",
        gridTemplateColumns: post.cover
          ? "clamp(105px, 13.75vw, 120px) minmax(0, 1fr)"
          : "1fr",
        gap: post.cover ? "0.9rem" : "0.75rem",
        alignItems: "start",
        color: "white",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "12px",
        padding: "0.7rem",
        background: "rgba(0, 0, 0, 0.12)",
        backdropFilter: "blur(1px)",
        textDecoration: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
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
      {post.cover ? (
        <img
          src={post.cover}
          alt={post.title}
          loading={prioritizeImage ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={prioritizeImage ? "high" : "auto"}
          draggable={false}
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            objectFit: "cover",
            backgroundColor: "rgba(82, 102, 139, 0.2)",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.28)",
            display: "block",
          }}
        />
      ) : null}
      <div
        style={{
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.42rem",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "clamp(1.18rem, 2.6vw, 2.24rem)",
            lineHeight: 1.14,
          }}
        >
          <span
            style={{
              color: isHovered ? "#d7e4ff" : "white",
              textDecoration: "none",
              transition: "color 140ms ease",
            }}
          >
            {post.title}
          </span>
        </h2>
        {postMetaParts.length ? (
          <p
            style={{
              margin: 0,
              opacity: 0.85,
              fontSize: "0.82rem",
              letterSpacing: "0.01em",
            }}
          >
            {postMetaParts.join(" · ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
