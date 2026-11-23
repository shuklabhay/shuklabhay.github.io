import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import type { ImageLightboxProps } from "../utils/types";
import { MOBILE_QUERY } from "../utils/breakpoints";

const FADE_MS = 100;
const MAX_SCALE = 4;
const TAP_ZOOM_SCALE = 2.5;
const TAP_SLOP_PX = 6;

type View = { scale: number; x: number; y: number };

const IDENTITY: View = { scale: 1, x: 0, y: 0 };

function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function getViewportSize() {
  if (typeof window === "undefined") return { width: 0, height: 0 };
  return { width: window.innerWidth, height: window.innerHeight };
}

function getLightboxPaddingPx(viewportWidth: number) {
  return Math.min(28.8, Math.max(14.4, viewportWidth * 0.024));
}

function isTouchAware(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.(MOBILE_QUERY).matches === true ||
    window.matchMedia?.("(pointer: coarse)").matches === true
  );
}

function zoomAround(
  view: View,
  nextScale: number,
  originX: number,
  originY: number,
): View {
  const scale = Math.min(MAX_SCALE, Math.max(1, nextScale));
  if (scale === 1) return IDENTITY;
  const ratio = scale / view.scale;
  return {
    scale,
    x: originX - (originX - view.x) * ratio,
    y: originY - (originY - view.y) * ratio,
  };
}

export default function ImageLightbox({
  opened,
  setOpened,
  images,
  currentIndex,
}: ImageLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState(getViewportSize);
  const [closing, setClosing] = useState(false);
  const [view, setView] = useState<View>(IDENTITY);
  const viewRef = useRef(view);
  viewRef.current = view;

  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => setOpened(false), FADE_MS);
  };
  const closeRef = useRef(handleClose);
  closeRef.current = handleClose;

  useEffect(() => {
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      event.preventDefault();
      closeButtonRef.current?.focus({ preventScroll: true });
    };
    const syncViewportSize = () => setViewportSize(getViewportSize());
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", syncViewportSize);
    window.addEventListener("orientationchange", syncViewportSize);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", syncViewportSize);
      window.removeEventListener("orientationchange", syncViewportSize);
      opener?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinch: { distance: number; scale: number } | null = null;
    let drag: { x: number; y: number; moved: boolean } | null = null;
    const touchAware = isTouchAware();

    const center = () => {
      const rect = stageEl.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    };
    const relative = (clientX: number, clientY: number) => {
      const c = center();
      return { x: clientX - c.x, y: clientY - c.y };
    };
    const distance = () => {
      const [a, b] = Array.from(pointers.values());
      return Math.hypot(a.x - b.x, a.y - b.y);
    };
    const midpoint = () => {
      const [a, b] = Array.from(pointers.values());
      return relative((a.x + b.x) / 2, (a.y + b.y) / 2);
    };
    const onImage = (target: EventTarget | null) =>
      target instanceof Element && target.closest(".lightbox-image") !== null;

    const onPointerDown = (event: PointerEvent) => {
      if (!onImage(event.target)) return;
      event.preventDefault();
      stageEl.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2) {
        pinch = { distance: distance(), scale: viewRef.current.scale };
        drag = null;
      } else if (pointers.size === 1) {
        drag = { x: event.clientX, y: event.clientY, moved: false };
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pinch && pointers.size === 2) {
        const origin = midpoint();
        setView((current) =>
          zoomAround(
            current,
            (pinch!.scale * distance()) / pinch!.distance,
            origin.x,
            origin.y,
          ),
        );
        return;
      }
      if (!drag) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < TAP_SLOP_PX) return;
      drag.moved = true;
      drag.x = event.clientX;
      drag.y = event.clientY;
      if (viewRef.current.scale === 1) return;
      setView((current) => ({
        ...current,
        x: current.x + dx,
        y: current.y + dy,
      }));
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return;
      pointers.delete(event.pointerId);
      if (pointers.size < 2) pinch = null;
      if (drag && !drag.moved && touchAware && event.type === "pointerup") {
        const origin = relative(event.clientX, event.clientY);
        setView((current) =>
          current.scale > 1
            ? IDENTITY
            : zoomAround(current, TAP_ZOOM_SCALE, origin.x, origin.y),
        );
      }
      drag = null;
    };
    const onDoubleClick = (event: MouseEvent) => {
      if (touchAware || !onImage(event.target)) return;
      const origin = relative(event.clientX, event.clientY);
      setView((current) =>
        current.scale > 1
          ? IDENTITY
          : zoomAround(current, TAP_ZOOM_SCALE, origin.x, origin.y),
      );
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (!event.ctrlKey && viewRef.current.scale === 1) return;
      if (!event.ctrlKey) {
        setView((current) => ({
          ...current,
          x: current.x - event.deltaX,
          y: current.y - event.deltaY,
        }));
        return;
      }
      const origin = relative(event.clientX, event.clientY);
      setView((current) =>
        zoomAround(
          current,
          current.scale * Math.exp(-event.deltaY * 0.01),
          origin.x,
          origin.y,
        ),
      );
    };

    stageEl.addEventListener("pointerdown", onPointerDown);
    stageEl.addEventListener("pointermove", onPointerMove);
    stageEl.addEventListener("pointerup", onPointerUp);
    stageEl.addEventListener("pointercancel", onPointerUp);
    stageEl.addEventListener("dblclick", onDoubleClick);
    stageEl.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      stageEl.removeEventListener("pointerdown", onPointerDown);
      stageEl.removeEventListener("pointermove", onPointerMove);
      stageEl.removeEventListener("pointerup", onPointerUp);
      stageEl.removeEventListener("pointercancel", onPointerUp);
      stageEl.removeEventListener("dblclick", onDoubleClick);
      stageEl.removeEventListener("wheel", onWheel);
    };
  }, []);

  const activeImage = images[currentIndex];
  if (!opened || !activeImage) return null;

  const paddingPx = getLightboxPaddingPx(viewportSize.width || 0);
  const availableWidth = Math.max(0, viewportSize.width - paddingPx * 2);
  const availableHeight = Math.max(0, viewportSize.height - paddingPx * 2 - 50);
  const widthScale =
    activeImage.width > 0
      ? availableWidth / activeImage.width
      : Number.POSITIVE_INFINITY;
  const heightScale =
    activeImage.height > 0
      ? availableHeight / activeImage.height
      : Number.POSITIVE_INFINITY;

  const imageStyle: CSSProperties = {
    display: "block",
    height: "auto",
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    margin: "0 auto",
    transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
    transition: view.scale === 1 ? "transform 120ms ease-out" : undefined,
    cursor: view.scale > 1 ? "grab" : "zoom-in",
    touchAction: "none",
    userSelect: "none",
  };

  if (
    activeImage.width > 0 &&
    activeImage.height > 0 &&
    availableWidth > 0 &&
    availableHeight > 0
  ) {
    if (widthScale <= heightScale) {
      imageStyle.width = `${Math.max(1, Math.round(activeImage.width * widthScale))}px`;
    } else {
      imageStyle.height = `${Math.max(1, Math.round(activeImage.height * heightScale))}px`;
    }
  }

  const handleTintClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button !== undefined && event.button !== 0) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest(".lightbox-image, .lightbox-close")) return;
    handleClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={activeImage.alt || "Image"}
      onClick={handleTintClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        background: "rgba(8, 10, 18, 0.78)",
        touchAction: "none",
        overscrollBehavior: "none",
        overflow: "hidden",
        padding: "round(clamp(12px, 2.4vw, 36px), 12px)",
        boxSizing: "border-box",
        opacity: closing ? 0 : 1,
        transition: `opacity ${FADE_MS}ms`,
        animation: `lightbox-fade-in ${FADE_MS}ms`,
      }}
    >
      <style>{"@keyframes lightbox-fade-in{from{opacity:0}}"}</style>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close image"
          className="lightbox-close"
          onClick={handleClose}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: 0,
            backgroundColor: "transparent",
            color: "white",
            cursor: "pointer",
            padding: "12px",
            lineHeight: 1,
          }}
        >
          <CloseIcon size={20} />
        </button>
      </div>
      <div
        ref={stageRef}
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          className="lightbox-image"
          src={activeImage.src}
          alt={activeImage.alt}
          draggable={false}
          style={imageStyle}
        />
      </div>
    </div>
  );
}
