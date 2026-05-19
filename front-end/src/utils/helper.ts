export function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function formatEduYear(yearStr: string) {
  if (!yearStr) return "";
  const parseAndFormat = (str: string) => {
    const trimmed = str.trim();
    if (!trimmed) return "";
    const date = new Date(trimmed);
    if (isNaN(date.getTime())) return trimmed;
    const months = [
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
    if (trimmed.length <= 4) return trimmed;
    return `${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  };

  if (yearStr.includes(" - ")) {
    return yearStr.split(" - ").map(parseAndFormat).join(" - ");
  }
  return parseAndFormat(yearStr);
}
