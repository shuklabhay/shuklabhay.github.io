import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  MouseEventHandler,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  RefObject,
} from "react";

const POST_READING_WIDTH_STORAGE_KEY = "blog-reading-width-v2";
const LEGACY_POST_READING_WIDTH_STORAGE_KEY = "blog-reading-width-v1";
const LEGACY_READING_WIDTH_DEFAULT = 980;
const READING_WIDTH_DEFAULT = 2200;
const READING_WIDTH_MIN = 760;
const READING_WIDTH_MAX = 2800;
const MOBILE_BREAKPOINT_PX = 860;

type ResizeEdge = "left" | "right";

type ResizeState = {
  edge: ResizeEdge;
  startX: number;
  startWidth: number;
};

type BlogPostProps = {
  pageClassName: string;
  title: string;
  byline?: string;
  heroImage: string;
  isHeroLoaded: boolean;
  contentRef: RefObject<HTMLElement>;
  onContentClick?: MouseEventHandler<HTMLElement>;
  children: ReactNode;
};

function clampReadingWidth(width: number) {
  return Math.round(
    Math.min(READING_WIDTH_MAX, Math.max(READING_WIDTH_MIN, width)),
  );
}

function readStoredReadingWidth() {
  if (typeof window === "undefined") return READING_WIDTH_DEFAULT;

  const nextRaw = window.localStorage.getItem(POST_READING_WIDTH_STORAGE_KEY);
  const legacyRaw = window.localStorage.getItem(
    LEGACY_POST_READING_WIDTH_STORAGE_KEY,
  );
  const raw = nextRaw ?? legacyRaw;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return READING_WIDTH_DEFAULT;
  if (nextRaw === null && parsed === LEGACY_READING_WIDTH_DEFAULT) {
    return READING_WIDTH_DEFAULT;
  }
  return clampReadingWidth(parsed);
}

function getCanResize() {
  if (typeof window === "undefined") return true;
  return window.innerWidth > MOBILE_BREAKPOINT_PX;
}

export default function BlogPost({
  pageClassName,
  title,
  byline,
  heroImage,
  isHeroLoaded,
  contentRef,
  onContentClick,
  children,
}: BlogPostProps) {
  const [readingWidth, setReadingWidth] = useState(readStoredReadingWidth);
  const [canResize, setCanResize] = useState(getCanResize);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStateRef = useRef<ResizeState | null>(null);

  const updateReadingWidth = useCallback((next: number) => {
    setReadingWidth(clampReadingWidth(next));
  }, []);

  const stopResize = useCallback(() => {
    resizeStateRef.current = null;
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      POST_READING_WIDTH_STORAGE_KEY,
      String(readingWidth),
    );
  }, [readingWidth]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onViewportResize = () => {
      setCanResize(getCanResize());
    };

    onViewportResize();
    window.addEventListener("resize", onViewportResize);
    return () => window.removeEventListener("resize", onViewportResize);
  }, []);

  useEffect(() => {
    if (!canResize) stopResize();
  }, [canResize, stopResize]);

  useEffect(() => {
    if (!isResizing) return;

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";

    const onPointerMove = (event: PointerEvent) => {
      const state = resizeStateRef.current;
      if (!state) return;

      const xDelta = event.clientX - state.startX;
      const edgeDelta = state.edge === "right" ? xDelta : -xDelta;
      updateReadingWidth(state.startWidth + edgeDelta * 2);
    };

    const onPointerUp = () => {
      stopResize();
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
    };
  }, [isResizing, stopResize, updateReadingWidth]);

  const onResizeHandlePointerDown =
    (edge: ResizeEdge) => (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!canResize) return;
      event.preventDefault();
      resizeStateRef.current = {
        edge,
        startX: event.clientX,
        startWidth: readingWidth,
      };
      setIsResizing(true);
    };

  const readingShellStyle = {
    "--post-reading-width": `${readingWidth}px`,
  } as CSSProperties;

  return (
    <main className={pageClassName}>
      <div
        className={`post-hero${isHeroLoaded ? " post-hero-loaded" : ""}`}
        style={{ backgroundImage: `url(${heroImage})` }}
        aria-hidden
      />
      <div className="post-title-block">
        <h1 className="post-title">{title}</h1>
        {byline ? <p className="post-date">{byline}</p> : null}
      </div>
      <section
        className={`post-reading-shell${canResize ? " post-reading-shell-resizable" : ""}${
          isResizing ? " post-reading-shell-resizing" : ""
        }`}
        style={readingShellStyle}
      >
        {canResize ? (
          <>
            <button
              type="button"
              className="post-reading-resize-handle post-reading-resize-handle-left"
              onPointerDown={onResizeHandlePointerDown("left")}
              aria-label="Shrink reading width"
            />
            <button
              type="button"
              className="post-reading-resize-handle post-reading-resize-handle-right"
              onPointerDown={onResizeHandlePointerDown("right")}
              aria-label="Expand reading width"
            />
          </>
        ) : null}
        <article
          ref={contentRef}
          className="post-content"
          onClick={onContentClick}
        >
          {children}
        </article>
      </section>
    </main>
  );
}
