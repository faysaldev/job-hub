/** Centralized upload policy. Shared by presign and R2 completion verification. */
import type { AssetKind } from "./asset.model";

export const uploadPolicies: Record<AssetKind, { mimes: Readonly<Record<string, readonly string[]>>; maxBytes: number; visibility: "public" | "private" }> = {
  avatar: { mimes: { "image/jpeg": ["jpg", "jpeg"], "image/png": ["png"], "image/webp": ["webp"] }, maxBytes: 5_000_000, visibility: "public" },
  "company-logo": { mimes: { "image/jpeg": ["jpg", "jpeg"], "image/png": ["png"], "image/webp": ["webp"] }, maxBytes: 5_000_000, visibility: "public" },
  "job-banner": { mimes: { "image/jpeg": ["jpg", "jpeg"], "image/png": ["png"], "image/webp": ["webp"] }, maxBytes: 5_000_000, visibility: "public" },
  resume: { mimes: { "application/pdf": ["pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"] }, maxBytes: 10_000_000, visibility: "private" },
  attachment: { mimes: { "image/jpeg": ["jpg", "jpeg"], "image/png": ["png"], "image/webp": ["webp"], "application/pdf": ["pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"] }, maxBytes: 10_000_000, visibility: "private" },
};

export const checkFile = (kind: string, mimeType: string, size: number, filename: string): { ok: true; extension: string } | { ok: false; message: string } => {
  if (!Object.prototype.hasOwnProperty.call(uploadPolicies, kind)) return { ok: false, message: "Unsupported upload purpose" };
  const policy = uploadPolicies[kind as AssetKind];
  if (!Number.isSafeInteger(size) || size < 1 || size > policy.maxBytes)
    return { ok: false, message: `File must be smaller than ${policy.maxBytes / 1_000_000} MB and not empty` };
  if (typeof filename !== "string" || !filename.trim() || filename.length > 255)
    return { ok: false, message: "Provide a valid file name" };
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  const extensions = policy.mimes[mimeType];
  if (!extensions || !extensions.includes(extension))
    return { ok: false, message: kind === "resume" ? "Resume must be a PDF or DOCX file" : "File extension does not match an accepted format" };
  return { ok: true, extension: extensions[0] };
};

export const matchesFileSignature = (mime: string, bytes: Buffer): boolean => {
  if (mime === "image/jpeg") return bytes.length >= 3 && bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  if (mime === "image/png") return bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"));
  if (mime === "image/webp") return bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (mime === "application/pdf") return bytes.length >= 5 && bytes.toString("ascii", 0, 5) === "%PDF-";
  if (mime.endsWith("wordprocessingml.document")) return bytes.length >= 4 && bytes.toString("hex", 0, 4) === "504b0304";
  return false;
};

/** A ZIP signature alone does not mean a ZIP is a DOCX. Inspect the central directory. */
export const looksLikeDocx = (zip: Buffer): boolean => {
  if (zip.length < 22 || zip.length > 10_000_000 || !matchesFileSignature("application/vnd.openxmlformats-officedocument.wordprocessingml.document", zip)) return false;
  const min = Math.max(0, zip.length - 65557);
  let eocd = -1;
  for (let i = zip.length - 22; i >= min; i--) {
    if (zip.readUInt32LE(i) === 0x06054b50 && i + 22 + zip.readUInt16LE(i + 20) === zip.length) { eocd = i; break; }
  }
  if (eocd < 0) return false;
  const count = zip.readUInt16LE(eocd + 10);
  const centralSize = zip.readUInt32LE(eocd + 12);
  let cursor = zip.readUInt32LE(eocd + 16);
  if (!count || count > 5000 || cursor + centralSize > eocd) return false;
  const names = new Set<string>();
  let totalUncompressed = 0;
  for (let i = 0; i < count; i++) {
    if (cursor + 46 > eocd || zip.readUInt32LE(cursor) !== 0x02014b50) return false;
    const flags = zip.readUInt16LE(cursor + 8);
    const method = zip.readUInt16LE(cursor + 10);
    const nameLen = zip.readUInt16LE(cursor + 28);
    const extraLen = zip.readUInt16LE(cursor + 30);
    const commentLen = zip.readUInt16LE(cursor + 32);
    const next = cursor + 46 + nameLen + extraLen + commentLen;
    if ((flags & 1) || (method !== 0 && method !== 8) || next > eocd || !nameLen) return false;
    const name = zip.toString("utf8", cursor + 46, cursor + 46 + nameLen);
    if (name.startsWith("/") || name.includes("\\") || name.split("/").includes("..")) return false;
    names.add(name);
    totalUncompressed += zip.readUInt32LE(cursor + 24);
    if (totalUncompressed > 50_000_000) return false;
    cursor = next;
  }
  return cursor === zip.readUInt32LE(eocd + 16) + centralSize && names.has("[Content_Types].xml") && names.has("word/document.xml");
};
