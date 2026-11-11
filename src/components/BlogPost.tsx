import type { BlogPostProps } from "../utils/types";

export default function BlogPost({
  title,
  byline,
  buttons,
  heroImage,
  contentRef,
  onContentClick,
  header,
  children,
}: BlogPostProps): JSX.Element {
  return (
    <main className="route-page-post">
      <div className="post-column">
        {header}
        {heroImage ? (
          <div
            className="post-hero"
            style={{ backgroundImage: `url(${heroImage})` }}
            aria-hidden
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
                  {button.title} ↗
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
        >
          {children}
        </article>
      </div>
    </main>
  );
}
