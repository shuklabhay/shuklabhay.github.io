export function getCurrentFormattedDate() {
  const currentDate = new Date();
  const options = { month: "long", year: "numeric" } as const;
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  return formattedDate;
}

export function getTimeframeLabel(
  startDate: string,
  endDate: string | null,
  ongoing: boolean,
  compact = false,
) {
  if (ongoing) {
    if (compact) {
      return `${startDate}-`;
    } else {
      return `${startDate} - Present`;
    }
  } else if (endDate) {
    if (startDate !== endDate) {
      return `${startDate} - ${endDate}`;
    } else {
      return `${startDate}`;
    }
  } else {
    return "Error creating date label";
  }
}
