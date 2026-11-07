import crypto from "node:crypto";
import { AppError } from "../../lib/errors";
import { assertId } from "../../lib/query";
import Asset, { AssetKind, IAsset } from "./asset.model";
import { bucketFor, firstBytes, head, publicAssetUrl, putBuffer, remove, signedPut, signedRead } from "./asset.storage";
import Application from "../Applications/application.model";
import Job from "../Jobs/job.model";
import Conversation from "../Conversations/conversations.model";
import Message from "../Messages/message.model";

const kinds: Record<AssetKind, { mimes: Record<string, string>; max: number; visibility: "public" | "private" }> = {
  avatar: { mimes: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }, max: 5_000_000, visibility: "public" },
  "company-logo": { mimes: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }, max: 5_000_000, visibility: "public" },
  resume: { mimes: { "application/pdf": "pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx" }, max: 10_000_000, visibility: "private" },
  attachment: { mimes: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx" }, max: 10_000_000, visibility: "private" },
};
export const assetReference = (id: string) => `asset:${id}`;
export const assetIdFromReference = (value: unknown): string | null => {
  if (typeof value !== "string" || !value.startsWith("asset:")) return null;
  return assertId(value.slice(6), "asset ID");
};
const safeName = (value: string) => value.replace(/[\x00-\x1f\x7f/\\<>:"|?*]/g, "_").trim().slice(0, 180) || "upload";
const validateUpload = (kind: unknown, mimeType: unknown, size: unknown, name: unknown) => {
  if (typeof kind !== "string" || !(kind in kinds)) throw new AppError("Invalid file purpose", 400);
  const type = kind as AssetKind;
  const config = kinds[type];
  if (typeof mimeType !== "string" || !config.mimes[mimeType]) throw new AppError("Unsupported file type", 400);
  if (typeof size !== "number" || !Number.isSafeInteger(size) || size < 1 || size > config.max) throw new AppError("File exceeds size limit", 400);
  if (typeof name !== "string" || name.length > 255) throw new AppError("Invalid file name", 400);
  return { type, config, extension: config.mimes[mimeType], name: safeName(name), mimeType };
};
const matchesSignature = (type: string, bytes: Buffer) => {
  if (type === "image/jpeg") return bytes.length >= 3 && bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  if (type === "image/png") return bytes.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"));
  if (type === "image/webp") return bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (type === "application/pdf") return bytes.toString("ascii", 0, 5) === "%PDF-";
  // DOCX is a ZIP container. A malware/document-scanning service is additionally required in production.
  if (type.endsWith("wordprocessingml.document")) return bytes.toString("hex", 0, 4) === "504b0304";
  return false;
};
export const initiateUpload = async (userId: string, input: { kind: AssetKind; mimeType: string; size: number; fileName: string }) => {
  const { type, config, extension, name, mimeType } = validateUpload(input.kind, input.mimeType, input.size, input.fileName);
  const bucket = bucketFor(type);
  const key = `${type}/${userId}/${crypto.randomUUID()}.${extension}`;
  const asset = await Asset.create({ owner: userId, kind: type, status: "pending", visibility: config.visibility,
    bucket, key, fileName: name, mimeType, size: input.size, expiresAt: new Date(Date.now() + 15 * 60 * 1000) });
  try {
    const uploadUrl = await signedPut(bucket, key, mimeType);
    return { assetId: asset._id.toString(), uploadUrl, method: "PUT", headers: { "Content-Type": mimeType, "If-None-Match": "*" }, expiresIn: 90 };
  } catch (error) { await Asset.deleteOne({ _id: asset._id }); throw error; }
};
export const confirmUpload = async (userId: string, id: string) => {
  const asset = await Asset.findOne({ _id: assertId(id, "asset ID"), owner: userId }).select("+bucket +key");
  if (!asset) throw new AppError("Upload not found", 404);
  if (asset.status === "ready") return toUploadResponse(asset);
  if (!asset.expiresAt || asset.expiresAt.getTime() < Date.now()) throw new AppError("Upload expired; start again", 410);
  let valid = false;
  try {
    const meta = await head(asset.bucket, asset.key);
    valid = Number(meta.ContentLength) === asset.size && meta.ContentType?.split(";")[0] === asset.mimeType;
    if (valid) valid = matchesSignature(asset.mimeType, await firstBytes(asset.bucket, asset.key));
  } catch { throw new AppError("File not found in R2; retry the upload", 409); }
  if (!valid) { await remove(asset.bucket, asset.key).catch(() => undefined); throw new AppError("Uploaded file failed validation", 400); }
  const ready = await Asset.findOneAndUpdate({ _id: asset._id, status: "pending", owner: userId },
    { $set: { status: "ready" }, $unset: { expiresAt: "" } }, { new: true }).select("+bucket +key");
  return toUploadResponse(ready || asset);
};
const toUploadResponse = (asset: IAsset) => ({ assetId: asset._id.toString(), kind: asset.kind,
  url: asset.visibility === "public" ? publicAssetUrl(asset.key) : assetReference(asset._id.toString()),
  publicId: asset._id.toString(), fileName: asset.fileName, mimeType: asset.mimeType, size: asset.size });

/** Legacy multipart clients: continue working but store in R2; new clients upload direct. */
export const uploadLegacyImage = async (userId: string, kind: "avatar" | "company-logo", file: Express.Multer.File) => {
  const { config, extension, name } = validateUpload(kind, file.mimetype, file.size, file.originalname);
  if (!matchesSignature(file.mimetype, file.buffer)) throw new AppError("Invalid image contents", 400);
  const bucket = bucketFor(kind);
  const key = `${kind}/${userId}/${crypto.randomUUID()}.${extension}`;
  await putBuffer(bucket, key, file.mimetype, file.buffer);
  try {
    const asset = await Asset.create({ owner: userId, kind, status: "ready", visibility: config.visibility,
      bucket, key, fileName: name, mimeType: file.mimetype, size: file.size });
    return toUploadResponse(asset);
  } catch (error) { await remove(bucket, key).catch(() => undefined); throw error; }
};
/** Only the uploader can bind a new private file to their resume or an application. */
export const assertOwnedResume = async (value: unknown, ownerId: string) => {
  const id = assetIdFromReference(value);
  if (!id) return; // Leave preexisting external HTTPS resume links readable during migration.
  if (!(await Asset.exists({ _id: id, owner: ownerId, status: "ready", kind: "resume" }))) {
    throw new AppError("Resume is not available to this account", 403);
  }
};
export const assertOwnedPublicImage = async (url: unknown, ownerId: string, kind: "avatar" | "company-logo") => {
  if (typeof url !== "string" || !url) return;
  // Only enforce ownership for managed R2 URLs; legacy Cloudinary images continue working.
  const prefix = `${process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, "") || "__not_configured__"}/`;
  if (!url.startsWith(prefix)) return;
  if (!(await Asset.exists({ owner: ownerId, status: "ready", kind, visibility: "public", key: decodeURIComponent(url.slice(prefix.length)) }))) {
    throw new AppError("Image does not belong to this account", 403);
  }
};
export const validateMessageAttachments = async (assetIds: string[], userId: string, conversationId: string) => {
  if (!Array.isArray(assetIds) || assetIds.length > 3 || new Set(assetIds).size !== assetIds.length) throw new AppError("Too many attachments", 400);
  assetIds.forEach((id) => assertId(id, "attachment ID"));
  const files = await Asset.find({ _id: { $in: assetIds }, owner: userId, kind: "attachment", status: "ready",
    $or: [{ conversationId: { $exists: false } }, { conversationId }] }).select("_id fileName mimeType size").lean();
  if (files.length !== assetIds.length) throw new AppError("Attachment not accessible", 403);
  return files.map((asset) => ({ assetId: asset._id, name: asset.fileName, mimeType: asset.mimeType, size: asset.size }));
};
export const linkMessageAttachments = async (assetIds: string[], userId: string, conversationId: string) => {
  if (assetIds.length) await Asset.updateMany({ _id: { $in: assetIds }, owner: userId, kind: "attachment",
    status: "ready", $or: [{ conversationId: { $exists: false } }, { conversationId }] },
  { $set: { conversationId } });
};
export const getAssetAccess = async (assetId: string, actorId: string, role: string) => {
  const asset = await Asset.findOne({ _id: assertId(assetId, "asset ID"), status: "ready" }).select("+bucket +key");
  if (!asset) throw new AppError("File not found", 404);
  if (asset.visibility === "public") return { url: publicAssetUrl(asset.key), expiresIn: null };
  let permitted = asset.owner.toString() === actorId || role === "admin";
  if (!permitted && asset.kind === "resume") {
    // One indexed application lookup + one job ownership lookup, not a potentially huge distinct list.
    const jobIds = await Application.distinct("job_id", { resume_url: assetReference(assetId), isWithdrawn: { $ne: true } });
    permitted = Boolean(jobIds.length && await Job.exists({ _id: { $in: jobIds }, author: actorId, isDeleted: { $ne: true } }));
  }
  if (!permitted && asset.kind === "attachment" && asset.conversationId) {
    permitted = Boolean((await Conversation.exists({ _id: asset.conversationId, participants: actorId })) &&
      (await Message.exists({ conversationId: asset.conversationId, "attachments.assetId": asset._id })));
  }
  if (!permitted) throw new AppError("File not found", 404);
  return { url: await signedRead(asset.bucket, asset.key, asset.fileName), expiresIn: 60 };
};
