import { useEffect, useLayoutEffect, useState } from "react";
import type { CheckboxItem } from "../utils/types";

export default function CheckboxList<T extends string = string>({
  selectedTags,
  setSelectedTags,
  items,
  storageKey,
  mode = "toggle",
  hoverFill = true,
}: {
  selectedTags: T[];
  setSelectedTags: (value: T[] | ((prev: T[]) => T[])) => void;
  items: ReadonlyArray<CheckboxItem<T>>;
  storageKey?: string;
  mode?: "toggle" | "link";
  hoverFill?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (mode !== "toggle" || !storageKey) return;
    window.localStorage.setItem(storageKey, JSON.stringify(selectedTags));
  }, [selectedTags, mode, storageKey]);

  useLayoutEffect(() => {
    if (mode !== "toggle" || !storageKey) return;
    const raw = window.localStorage.getItem(storageKey);

    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        if (arr.length > 0) {
          const isDifferent =
            !Array.isArray(selectedTags) ||
            arr.length !== selectedTags.length ||
            arr.some((v, i) => v !== selectedTags[i]);
          if (isDifferent) setSelectedTags(arr);
          return;
        }
      }
    }
    if (Array.isArray(selectedTags) && selectedTags.length > 0) return;
    const defaults = items.filter((i) => i.defaultChecked).map((i) => i.label);
    if (defaults.length > 0) setSelectedTags(defaults);
  }, [items, mode, selectedTags, setSelectedTags, storageKey]);

  const onClick = (index: number) => {
    if (mode === "link") {
      const href = items[index]?.href;
      if (href) window.open(href, "_blank", "noopener,noreferrer");
    } else if (setSelectedTags) {
      const label = items[index]?.label;
      if (!label) return;
      setSelectedTags((prev) =>
        prev.includes(label)
          ? (prev.filter((t) => t !== label) as T[])
          : ([...prev, label] as T[])
      );
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
      {items.map((item, idx) => {
        const isOn =
          mode === "toggle" && selectedTags
            ? selectedTags.includes(item.label)
            : false;
        const isHover = hoverFill && hovered === idx;
        const bg = isOn || isHover ? "white" : "transparent";
        const fg = isOn || isHover ? "#9ba7d4" : "white";
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
