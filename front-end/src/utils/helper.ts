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

export function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export function formatSalary(min?: number, max?: number, period?: string) {
  if (!min || !max) return "Salary disclosed";
  const compact = (value: number) =>
    value >= 1000 ? `$${Math.round(value / 1000)}k` : `$${value}`;
  const periodLabel =
    period === "hourly" ? "/hr" : period === "yearly" ? "/yr" : "/mo";
  return `${compact(min)} - ${compact(max)}${periodLabel}`;
}
