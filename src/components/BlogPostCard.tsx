import TransitionLink from "./TransitionLink";
import { loadPostBySlug } from "../posts";
import { formatPostMonthYear } from "../utils/formatPostDate";
import { preloadImage } from "../utils/imagePreload";
import type { PostMeta } from "../utils/types";

type BlogPostCardProps = {
  post: PostMeta;
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

export default function BlogPostCard({ post }: BlogPostCardProps): JSX.Element {
  const postPath = `/gallery/${post.slug}`;
  const heroSrc = post.cover ?? DEFAULT_POST_HERO_IMAGE;
  const truncatedTitle = splitTitleForMiddleEllipsis(post.title);
  const monthYear = formatPostMonthYear(post.date);

  const warmPostResources = (): void => {
    void preloadImage(heroSrc);
    void loadPostBySlug(post.slug);
  };

  return (
    <TransitionLink
      to={postPath}
      state={{ fromPath: "/gallery" }}
      className="gallery-row"
      onMouseEnter={warmPostResources}
      onFocus={warmPostResources}
      onTouchStart={warmPostResources}
      onPointerDown={warmPostResources}
    >
      <span className="gallery-row-date">{monthYear}</span>
      <span title={post.title} className="gallery-row-title">
        <span className="gallery-row-title-start">{truncatedTitle.prefix}</span>
        {truncatedTitle.suffix ? (
          <span className="gallery-row-title-end">
            {`\u00a0${truncatedTitle.suffix}`}
          </span>
        ) : null}
      </span>
    </TransitionLink>
  );
}
