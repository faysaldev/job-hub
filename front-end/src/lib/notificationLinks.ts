/** Legacy notification links and untrusted persisted values must never become external redirects. */
export const safeNotificationHref = (value: string | undefined | null): string => {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\x00-\x1f]/.test(value) || /%(?:2f|5c)/i.test(value))
    return "/notifications";
  try {
    const parsed = new URL(value, "https://jobhub.invalid");
    if (parsed.origin !== "https://jobhub.invalid") return "/notifications";
    if (parsed.pathname === "/recruiter/applications" || parsed.pathname.startsWith("/recruiter/applications/"))
      return `/recruiter/applicants${parsed.search}${parsed.hash}`;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch { return "/notifications"; }
};
