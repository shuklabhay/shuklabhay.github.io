export function formatDate(
  date: string | null | undefined,
  short = false,
): string {
  if (!date) return "";
  if (date === "Present") return date;

  const [month, year] = date.split("-");
  if (!month || !year) return date;

  const dateObj = new Date(`${year}-${month}-01`);

  if (short) {
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  return dateObj.toLocaleDateString("en-US", {
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined,
  short = false,
): string {
  if (!start) return "";

  const formattedStart = formatDate(start, short);
  const formattedEnd = end ? formatDate(end, short) : "";

  if (!formattedEnd) return formattedStart;
  return `${formattedStart} – ${formattedEnd}`;
}
