import "server-only";

/** Avoid leaking browser cookies or stale authentication to public metadata fetches. */
const origin = () => {
  const value = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  return value.replace(/\/+$/, "").replace(/\/api\/v1$/, "");
};

export async function publicEntity<T>(resource: "job" | "recruiter-company" | "job-seekers", id: string): Promise<T | null> {
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;
  try {
    const response = await fetch(`${origin()}/api/v1/${resource}/${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3500),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("data" in data)) return null;
    return (data as { data: T }).data || null;
  } catch {
    // Metadata failures must not break rendering or leak internal errors.
    return null;
  }
}
export function safeMetaText(value: unknown, maxLength = 158): string {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}
