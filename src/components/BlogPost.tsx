import type { CSSProperties } from "react";
import type { BlogPostProps } from "../utils/types";

const IMAGE_TYPE_BY_EXTENSION: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

function heroStyle(src: string, avifSrc?: string): CSSProperties {
  const style: Record<string, string> = { "--hero-image": `url("${src}")` };
  if (avifSrc) {
    const extension = src.split("?")[0]?.split(".").pop()?.toLowerCase() ?? "";
    const type = IMAGE_TYPE_BY_EXTENSION[extension];
    style["--hero-image-set"] =
      `image-set(url("${avifSrc}") type("image/avif"), url("${src}")${type ? ` type("${type}")` : ""})`;
  }
  return style as CSSProperties;
}

export default function BlogPost({
  title,
  byline,
  buttons,
  heroImage,
  heroImageAvif,
  onHeroClick,
  contentRef,
  onContentClick,
  header,
  html,
  children,
}: BlogPostProps): JSX.Element {
  return (
    <main className="route-page-post">
      <div className="post-column">
        {header}
        {heroImage ? (
          <button
            type="button"
            className="post-hero"
            style={heroStyle(heroImage, heroImageAvif)}
            aria-label={`Open image: ${title}`}
            onClick={onHeroClick}
          />
        ) : null}
        <div className="post-title-block">
          <h1 className="page-heading">{title}</h1>
          {byline ? <p className="post-byline">{byline}</p> : null}
          {buttons.length ? (
            <div className="post-header-buttons">
              {buttons.map((button, index) => (
                <a
                  key={`${button.link}-${index}`}
                  href={button.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="post-header-button"
                >
                  {`${button.title} ↗`}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <article
          ref={contentRef}
          className="post-content"
          data-post-content
          onClick={onContentClick}
          dangerouslySetInnerHTML={
            html === undefined ? undefined : { __html: html }
          }
        >
          {html === undefined ? children : undefined}
        </article>
      </div>
    </main>
  );
}
