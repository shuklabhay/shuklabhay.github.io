import { useEffect, useState } from "react";
import type { CheckboxSubtitleProps, PageTitleProps } from "../utils/types";
import TriangleIcon from "./TriangleIcon";

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "700",
          color: "white",
          margin: 0,
        }}
      >
        {title}
      </h1>
      {subtitle ? subtitle : null}
    </div>
  );
}

export function CheckboxSubtitle<T extends string = string>({
  items,
  storageKey,
  mode = "toggle",
  hoverFill = true,
  selectedTags,
  setSelectedTags,
  activeIndexes,
  marginTop = "0.5rem",
  marginBottom = "4rem",
}: CheckboxSubtitleProps<T>) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onChange = (event: MediaQueryListEvent) => {
      setCanHover(event.matches);
      if (!event.matches) setHovered(null);
    };

    setCanHover(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined")
      return;

    const clearHover = () => setHovered(null);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") clearHover();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", clearHover);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", clearHover);
    };
  }, []);

  useEffect(() => {
    if (mode !== "toggle" || !storageKey) return;
    window.localStorage.setItem(storageKey, JSON.stringify(selectedTags));

    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const currentTags = hashParams.get("tags");
    const newTags =
      selectedTags && selectedTags.length > 0 ? selectedTags.join(",") : "";

    if (currentTags !== newTags) {
      if (newTags) {
        hashParams.set("tags", newTags);
      } else {
        hashParams.delete("tags");
      }
      const newHash = hashParams.toString();
      history.replaceState(
        null,
        "",
        newHash ? `#${newHash}` : window.location.pathname,
      );
    }
  }, [selectedTags, mode, storageKey]);

  const onClick = (index: number) => {
    const item = items[index];
    if (!item) return;

    if (item.onClick) {
      item.onClick();
      return;
    }

    if (mode === "toggle" && setSelectedTags) {
      const label = item.label;
      if (!label) return;
      const wasSelected = selectedTags ? selectedTags.includes(label) : false;
      setSelectedTags((prev) =>
        prev.includes(label)
          ? (prev.filter((t) => t !== label) as T[])
          : ([...prev, label] as T[]),
      );
      if (wasSelected && hoverFill && hovered === index) {
        setHovered(null);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        marginTop,
        marginBottom,
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {items.map((item, idx) => {
        const isOn =
          activeIndexes !== undefined
            ? activeIndexes.includes(idx)
            : mode === "toggle" && selectedTags
              ? selectedTags.includes(item.label)
              : false;
        const isHover = canHover && hoverFill && hovered === idx;
        const bg = isOn || isHover ? "white" : "transparent";
        const fg = isOn || isHover ? "#5a6c99" : "white";
        const sharedStyle = {
          padding: "0.25rem 0.5rem",
          borderRadius: "6px",
          border: "2px solid white",
          backgroundColor: bg,
          color: fg,
          fontSize: "1rem",
          fontWeight: 600,
          cursor: "pointer",
          userSelect: "none" as const,
          WebkitUserSelect: "none" as const,
          display: "inline-flex",
          alignItems: "center",
          gap: item.arrowDirection ? "0.33rem" : 0,
          transition: canHover
            ? "background-color 150ms ease, color 150ms ease"
            : "none",
          textDecoration: "none",
          WebkitTextFillColor: fg,
        };

        if (mode === "link" && item.href && !item.onClick) {
          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => {
                if (!canHover) return;
                setHovered(idx);
              }}
              onMouseLeave={() => setHovered((h) => (h === idx ? null : h))}
              onClick={() => setHovered(null)}
              onPointerDown={() => setHovered(null)}
              onTouchStart={() => setHovered(null)}
              onBlur={() => setHovered((h) => (h === idx ? null : h))}
              style={{
                ...sharedStyle,
                userSelect: "auto",
                WebkitUserSelect: "auto",
                WebkitTouchCallout: "default",
              }}
            >
              {item.label}
              {item.arrowDirection ? (
                <span
                  aria-hidden
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "0.6rem",
                    visibility:
                      item.arrowVisible === undefined || item.arrowVisible
                        ? "visible"
                        : "hidden",
                  }}
                >
                  <TriangleIcon direction={item.arrowDirection} />
                </span>
              ) : null}
            </a>
          );
        }

        return (
          <button
            key={item.label}
            onClick={() => onClick(idx)}
            onMouseEnter={() => {
              if (!canHover) return;
              setHovered(idx);
            }}
            onMouseLeave={() => setHovered((h) => (h === idx ? null : h))}
            aria-pressed={isOn}
            style={{
              ...sharedStyle,
              WebkitTouchCallout: "none",
            }}
          >
            {item.label}
            {item.arrowDirection ? (
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "0.6rem",
                  visibility:
                    item.arrowVisible === undefined || item.arrowVisible
                      ? "visible"
                      : "hidden",
                }}
              >
                <TriangleIcon direction={item.arrowDirection} />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
