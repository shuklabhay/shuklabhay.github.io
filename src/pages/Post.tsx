import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useParams } from "react-router-dom";
import ImageLightbox from "../components/ImageLightbox";
import PostBackLink from "../components/PostBackLink";
import { getPostBySlug } from "../posts";
import type { RichImage } from "../utils/types";

const POST_RETURN_FLAG_KEY = "route-from-post-return";

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
  const postContentRef = useRef<HTMLElement>(null);
  const [lightboxOpened, setLightboxOpened] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<RichImage | null>(null);
  const [postImages, setPostImages] = useState<RichImage[]>([]);

  useEffect(() => {
    return () => {
      if (typeof window === "undefined") return;
      window.sessionStorage.setItem(POST_RETURN_FLAG_KEY, "1");
    };
  }, []);

  useEffect(() => {
    if (!post) {
      setPostImages([]);
      setLightboxImage(null);
      setLightboxOpened(false);
      return;
    }

    const contentEl = postContentRef.current;
    if (!contentEl) {
      setPostImages([]);
      return;
    }

    const imageElements = Array.from(contentEl.querySelectorAll("img"));
    const images: RichImage[] = imageElements.map((img) => ({
      src: img.currentSrc || img.src,
      alt: img.alt || "",
    }));

    imageElements.forEach((img, index) => {
      img.dataset.lightboxIndex = String(index);
    });

    setPostImages(images);
    setLightboxImage(null);
    setLightboxOpened(false);
  }, [slug, post]);

  if (!post) {
    return (
      <>
        <PostBackLink />
        <main className="post-page post-page-enter" key={slug}>
          <h1 className="post-missing-title">Post not found</h1>
        </main>
      </>
    );
  }

  const Content = post.Component;
  const heroImage = post.cover ?? "/static/landing-1280.avif";

  const onPostContentClick = (event: ReactMouseEvent<HTMLElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const imageEl = target.closest("img");
    if (!(imageEl instanceof HTMLImageElement)) return;
    if (!postContentRef.current?.contains(imageEl)) return;

    const rawIndex = imageEl.dataset.lightboxIndex;
    if (rawIndex === undefined) return;

    const index = Number(rawIndex);
    if (!Number.isFinite(index) || index < 0 || index >= postImages.length)
      return;

    event.preventDefault();
    setLightboxImage(postImages[index] ?? null);
    setLightboxOpened(true);
  };

  return (
    <>
      <PostBackLink />
      <main className="post-page post-page-enter" key={slug}>
        <div
          className="post-hero"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
          aria-hidden
        />
        <div className="post-title-block">
          <h1 className="post-title">{post.title}</h1>
          {post.date ? (
            <p className="post-date">
              Abhay Shukla · {formatPostDate(post.date)}
            </p>
          ) : null}
        </div>
        <article
          ref={postContentRef}
          className="post-content"
          onClick={onPostContentClick}
        >
          <Content />
        </article>
        {postImages.length > 0 ? (
          <ImageLightbox
            opened={lightboxOpened}
            setOpened={setLightboxOpened}
            image={lightboxImage}
          />
        ) : null}
      </main>
    </>
  );
}
