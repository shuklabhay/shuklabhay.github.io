import { useMemo } from "react";
import type { CheckboxSubtitleLinkProps, PageTitleProps } from "../utils/types";
import TriangleIcon from "./TriangleIcon";

export default function PageTitle({
  title,
  subtitle,
}: PageTitleProps): JSX.Element {
  return (
    <div>
      <h1 className="page-heading">{title}</h1>
      {subtitle ? subtitle : null}
    </div>
  );
}

export function CheckboxSubtitleLink<T extends string = string>({
  items,
  activeIndexes,
  marginTop = "6px",
  marginBottom = "48px",
}: CheckboxSubtitleLinkProps<T>): JSX.Element {
  const activeIndexSet = useMemo(
    () => new Set(activeIndexes ?? []),
    [activeIndexes],
  );

  return (
    <div className="page-filter-row" style={{ marginTop, marginBottom }}>
      {items.map((item, idx) => (
        <button
          key={item.label}
          type="button"
          onClick={item.onClick}
          aria-pressed={activeIndexSet.has(idx)}
          className="page-filter-toggle"
        >
          {item.label}
          {item.arrowDirection ? (
            <span aria-hidden className="page-filter-arrow">
              <TriangleIcon direction={item.arrowDirection} />
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
