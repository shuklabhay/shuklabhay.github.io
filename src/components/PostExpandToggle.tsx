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
      <svg viewBox="3 3 18 18" aria-hidden focusable="false">
        {expanded ? (
          <>
            <path d="M15 4V9H20" />
            <path d="M4 15H9V20" />
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
