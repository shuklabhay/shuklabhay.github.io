import TransitionLink from "./TransitionLink";
import { loadMathStyles, loadPostBySlug } from "../posts";
import { warmMathFonts } from "../utils/mathFonts";
import { loadPostPage } from "../pages/postPage";
import { formatPostMonthYear } from "../utils/formatPostDate";
import { preloadPostCover } from "../utils/imagePreload";
import type { PostMeta } from "../utils/types";

type BlogPostCardProps = {
  post: PostMeta;
};

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
  const truncatedTitle = splitTitleForMiddleEllipsis(post.title);
  const monthYear = formatPostMonthYear(post.date);

  const warmPostResources = (): void => {
    void preloadPostCover(post);
    void loadPostBySlug(post.slug);
    void loadPostPage().catch(() => undefined);
    if (post.hasMath) void loadMathStyles().then(warmMathFonts);
  };

  const preparePost = (): Promise<unknown> =>
    Promise.all([
      preloadPostCover(post),
      loadPostBySlug(post.slug),
      loadPostPage(),
    ]);

  return (
    <TransitionLink
      to={postPath}
      state={{ fromPath: "/gallery" }}
      prepare={preparePost}
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
