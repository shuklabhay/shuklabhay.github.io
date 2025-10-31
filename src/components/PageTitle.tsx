import { useEffect, useState } from "react";
import type { CheckboxItem } from "../utils/types";

export default function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: React.ReactNode;
}) {
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
}: {
  items: ReadonlyArray<CheckboxItem<T>>;
  storageKey?: string;
  mode?: "toggle" | "link";
  hoverFill?: boolean;
  selectedTags?: T[];
  setSelectedTags?: (value: T[] | ((prev: T[]) => T[])) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

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
    if (mode === "link") {
      const href = items[index]?.href;
      if (href) window.open(href, "_blank", "noopener,noreferrer");
    } else if (mode === "toggle" && setSelectedTags) {
      const label = items[index]?.label;
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
        marginTop: "0.5rem",
        marginBottom: "4rem",
      }}
    >
      {items.map((item, idx) => {
        const isOn =
          mode === "toggle" && selectedTags
            ? selectedTags.includes(item.label)
            : false;
        const isHover = hoverFill && hovered === idx;
        const bg = isOn || isHover ? "white" : "transparent";
        const fg = isOn || isHover ? "#5a6c99" : "white";
        return (
          <button
            key={item.label}
            onClick={() => onClick(idx)}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered((h) => (h === idx ? null : h))}
            aria-pressed={isOn}
            style={{
              padding: "0.25rem 0.5rem",
              borderRadius: "6px",
              border: "2px solid white",
              backgroundColor: bg,
              color: fg,
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background-color 150ms ease, color 150ms ease",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
