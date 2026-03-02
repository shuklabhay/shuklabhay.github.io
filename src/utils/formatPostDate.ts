const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const PACIFIC_TIME_ZONE = "America/Los_Angeles";
const PACIFIC_DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  timeZone: PACIFIC_TIME_ZONE,
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatPostDate(raw: string) {
  if (!raw) return "";

  const dateOnlyMatch = raw.match(DATE_ONLY_PATTERN);
  if (dateOnlyMatch) {
    const [, yearText, monthText, dayText] = dateOnlyMatch;
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    // Treat date-only inputs as Pacific calendar dates regardless of viewer locale.
    const parsed = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    if (!Number.isNaN(parsed.getTime())) {
      return PACIFIC_DATE_FORMATTER.format(parsed);
    }
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return PACIFIC_DATE_FORMATTER.format(parsed);
}
