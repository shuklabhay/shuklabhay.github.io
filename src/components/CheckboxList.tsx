import { useState } from "react";

interface CheckboxItem {
  label: string;
  defaultChecked?: boolean;
  href?: string;
}

interface CheckboxListProps {
  items: CheckboxItem[];
  mode?: "toggle" | "link";
  hoverFill?: boolean;
}

export default function CheckboxList({
  items,
  mode = "toggle",
  hoverFill = true,
}: CheckboxListProps) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    items.map((i) => !!i.defaultChecked),
  );
  const [hovered, setHovered] = useState<number | null>(null);

  const onClick = (index: number) => {
    if (mode === "link") {
      const href = items[index]?.href;
      if (href) window.open(href, "_blank", "noopener,noreferrer");
    } else {
      setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
      {items.map((item, idx) => {
        const isOn = mode === "toggle" ? checked[idx] : false;
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
