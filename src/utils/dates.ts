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
) {
  if (ongoing) {
    return `${startDate} - ${getCurrentFormattedDate()}: Ongoing`;
  } else if (endDate) {
    return `${startDate} - ${endDate}`;
  } else {
    return "Error creating date label";
  }
}
