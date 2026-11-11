const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatMonthYear(value: string): string {
  const match = value.trim().match(/^(\d{2})-(\d{2})$/);
  if (!match) return value;
  const month = MONTHS[Number(match[1]) - 1];
  return month ? `${month} 20${match[2]}` : value;
}

function formatTag(tag: string): string {
  return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
}

type MetaLineProps = {
  date: string;
  tags: string[];
};

export default function MetaLine({ date, tags }: MetaLineProps): JSX.Element {
  const dates = date.split("/").map(formatMonthYear).join(" / ");
  return (
    <p className="post-meta-line">
      {dates} · {tags.map(formatTag).join(", ")}
    </p>
  );
}
