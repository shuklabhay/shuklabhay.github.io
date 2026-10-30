type PostExpandToggleProps = {
  expanded: boolean;
  onToggle: () => void;
};

export default function PostExpandToggle({
  expanded,
  onToggle,
}: PostExpandToggleProps): JSX.Element {
  return (
    <button
      type="button"
      className="post-expand-toggle"
      onClick={onToggle}
      aria-pressed={expanded}
      aria-label={expanded ? "Collapse post" : "Expand post"}
    >
      <svg viewBox="2 2 20 20" aria-hidden focusable="false">
        {expanded ? (
          <>
            <path d="M16 3V8H21" />
            <path d="M3 16H8V21" />
          </>
        ) : (
          <>
            <path d="M15 4H20V9" />
            <path d="M4 15V20H9" />
          </>
        )}
      </svg>
    </button>
  );
}
