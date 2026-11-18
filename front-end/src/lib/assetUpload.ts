/** UX-only preflight; backend and R2 completion enforce the authoritative rules. */
export type AssetKind = "avatar" | "company-logo" | "job-banner" | "resume" | "attachment";
const imageMimes: Record<string, string[]> = { "image/jpeg": ["jpg", "jpeg"], "image/png": ["png"], "image/webp": ["webp"] };
const documentMimes: Record<string, string[]> = {
  "application/pdf": ["pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"],
};
const policy: Record<AssetKind, { types: Record<string, string[]>; max: number }> = {
  avatar: { types: imageMimes, max: 5_000_000 },
  "company-logo": { types: imageMimes, max: 5_000_000 },
  "job-banner": { types: imageMimes, max: 5_000_000 },
  resume: { types: documentMimes, max: 10_000_000 },
  attachment: { types: { ...imageMimes, ...documentMimes }, max: 10_000_000 },
};
export const resolvedMime = (file: Pick<File, "name" | "type">): string => {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  // OS/browser MIME sniffing occasionally labels DOCX as ZIP and JPEG as image/jpg.
  // Let a known extension select the expected content type; signature verification
  // happens in both browser and backend and rejects renamed files.
  const expected = Object.entries({ ...imageMimes, ...documentMimes })
    .find(([, extensions]) => extensions.includes(ext))?.[0] || "";
  if (!expected) return file.type || "";
  if (!file.type || ["application/octet-stream", "application/zip", "image/jpg", "application/x-pdf"].includes(file.type))
    return expected;
  return file.type;
};
export const validateAssetFile = (file: Pick<File, "name" | "type" | "size">, kind: AssetKind): string | null => {
  const rule = policy[kind];
  const type = resolvedMime(file);
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!Number.isSafeInteger(file.size) || file.size === 0 || file.size > rule.max)
    return `Choose a non-empty file up to ${rule.max / 1_000_000} MB.`;
  if (!file.name.trim() || file.name.length > 255) return "Choose a file with a valid name.";
  if (!rule.types[type]?.includes(ext || "")) return kind === "resume"
    ? "Only PDF and DOCX resumes are supported (maximum 10 MB)."
    : "Use a JPEG, PNG or WebP image with the correct extension.";
  return null;
};
export const fileSignatureMatches = (mime: string, bytes: Uint8Array): boolean => {
  const prefix = (...data: number[]) => data.every((byte, idx) => bytes[idx] === byte);
  if (mime === "image/jpeg") return prefix(255, 216, 255);
  if (mime === "image/png") return prefix(137, 80, 78, 71, 13, 10, 26, 10);
  if (mime === "image/webp") return prefix(82, 73, 70, 70) && [87, 69, 66, 80].every((v, i) => bytes[8 + i] === v);
  if (mime === "application/pdf") return prefix(37, 80, 68, 70, 45);
  if (mime.endsWith("wordprocessingml.document")) return prefix(80, 75, 3, 4);
  return false;
};
export const assetErrorMessage = (error: unknown, fallback = "Unable to upload the file"): string => {
  if (typeof error === "object" && error !== null) {
    const value = error as { data?: { message?: string }; error?: string; message?: string };
    return value.data?.message || value.error || value.message || fallback;
  }
  return fallback;
};
