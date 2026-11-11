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
    >
      {expanded ? "exit wide" : "wide"}
    </button>
  );
}
