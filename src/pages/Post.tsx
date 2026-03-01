import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageGallery from "../components/ImageGallery";
import { getPostBySlug } from "../posts";
import type { RichImage } from "../utils/types";

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
  const navigate = useNavigate();
  const { slug = "" } = useParams();
  const post = getPostBySlug(slug);
  const postContentRef = useRef<HTMLElement>(null);
  const [lightboxOpened, setLightboxOpened] = useState(false);
  const [lightboxSlideIndex, setLightboxSlideIndex] = useState(0);
  const [postImages, setPostImages] = useState<RichImage[]>([]);

  const onBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/blog", { state: { fromPost: true } });
  };

  useEffect(() => {
    if (!post) {
      setPostImages([]);
      setLightboxSlideIndex(0);
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
    setLightboxSlideIndex(0);
    setLightboxOpened(false);
  }, [slug, post]);

  if (!post) {
    return (
      <main className="post-page post-page-enter" key={slug}>
        <button type="button" className="post-back-link" onClick={onBackClick}>
          ← Back to blog
        </button>
        <h1 className="post-missing-title">Post not found</h1>
      </main>
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
    setLightboxSlideIndex(index);
    setLightboxOpened(true);
  };

  return (
    <main className="post-page post-page-enter" key={slug}>
      <button type="button" className="post-back-link" onClick={onBackClick}>
        ← Back to blog
      </button>
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
          <p className="post-date">{formatPostDate(post.date)}</p>
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
        <ImageGallery
          opened={lightboxOpened}
          setOpened={setLightboxOpened}
          images={postImages}
          initialSlideIndex={lightboxSlideIndex}
          setSlideIndex={setLightboxSlideIndex}
        />
      ) : null}
    </main>
  );
}
