import crypto from "node:crypto";
import { AppError } from "../../lib/errors";
import { assertId } from "../../lib/query";
import Asset, { AssetKind, IAsset } from "./asset.model";
import { bucketFor, firstBytes, head, publicAssetUrl, putBuffer, remove, signedPut, signedRead, readObject } from "./asset.storage";
import { checkFile, looksLikeDocx, matchesFileSignature, uploadPolicies } from "./asset.policy";
import Application from "../Applications/application.model";
import Job from "../Jobs/job.model";
import { companyForActor } from "../Company/company.access";
import Conversation from "../Conversations/conversations.model";
import Message from "../Messages/message.model";

export const assetReference = (id: string) => `asset:${id}`;
export const assetIdFromReference = (value: unknown): string | null => {
  if (typeof value !== "string" || !value.startsWith("asset:")) return null;
  return assertId(value.slice(6), "asset ID");
};
const safeName = (value: string) => value.replace(/[\x00-\x1f\x7f/\\<>:"|?*]/g, "_").trim().slice(0, 180) || "upload";
const validateUpload = (kind: unknown, mimeType: unknown, size: unknown, name: unknown) => {
  const result = checkFile(String(kind ?? ""), String(mimeType ?? ""), Number(size), String(name ?? ""));
  if (!result.ok) throw new AppError(result.message, 422);
  const type = kind as AssetKind;
  return { type, config: uploadPolicies[type], extension: result.extension,
    name: safeName(name as string), mimeType: mimeType as string };
};

export const initiateUpload = async (userId: string, input: { kind: AssetKind; mimeType: string; size: number; fileName: string }) => {
  const { type, config, extension, name, mimeType } = validateUpload(input.kind, input.mimeType, input.size, input.fileName);
  const companyId = type === "job-banner" ? (await companyForActor(userId, "jobs")).company._id : undefined;
  const bucket = bucketFor(type);
  const key = `${type}/${userId}/${crypto.randomUUID()}.${extension}`;
  const asset = await Asset.create({ owner: userId, kind: type, status: "pending", visibility: config.visibility,
    bucket, key, companyId, fileName: name, mimeType, size: input.size, expiresAt: new Date(Date.now() + 15 * 60 * 1000) });
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
    if (valid) valid = matchesFileSignature(asset.mimeType, await firstBytes(asset.bucket, asset.key));
    if (valid && asset.mimeType.endsWith("wordprocessingml.document"))
      valid = looksLikeDocx(await readObject(asset.bucket, asset.key));
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    if (error?.$metadata?.httpStatusCode === 404 || error?.name === "NotFound" || error?.name === "NoSuchKey")
      throw new AppError("R2 has not received this upload; please retry", 409);
    throw new AppError("R2 verification is temporarily unavailable. Please try again.", 503);
  }
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
  if (!matchesFileSignature(file.mimetype, file.buffer)) throw new AppError("Invalid image contents", 400);
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
/** Never bind a banner from another company or an unconfirmed upload. */
export const assertCompanyBanner = async (url: unknown, companyId: string) => {
  if (url === undefined || url === null || url === "") return;
  if (typeof url !== "string" || url.length > 2048) throw new AppError("Invalid job banner", 422);
  const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, "");
  if (!base) throw new AppError("Public file storage is not configured", 503);
  const prefix = `${base}/job-banner/`;
  if (!url.startsWith(prefix) || url.includes("?") || url.includes("#"))
    throw new AppError("Upload a job banner using JobHub's image uploader", 422);
  let key: string;
  try { key = decodeURIComponent(url.slice(base.length + 1)); }
  catch { throw new AppError("Invalid job banner URL", 422); }
  const asset = await Asset.findOne({ key, kind: "job-banner", status: "ready", companyId, visibility: "public" }).select("+key");
  if (!asset || url !== publicAssetUrl(asset.key)) throw new AppError("Job banner does not belong to this company", 403);
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
  // Even platform administrators do not receive blanket access to private candidate files.
  let permitted = asset.owner.toString() === actorId;
  if (!permitted && asset.kind === "resume") {
    // One indexed application lookup + one job ownership lookup, not a potentially huge distinct list.
    const jobIds = await Application.distinct("job_id", { resume_url: assetReference(assetId), isWithdrawn: { $ne: true } });
    const membership = await companyForActor(actorId, "applications").catch(() => null);
    permitted = Boolean(membership && jobIds.length && await Job.exists({ _id: { $in: jobIds },
      $or: [{ author: membership.company.userId }, { companyId: membership.company._id }], isDeleted: { $ne: true } }));
  }
  if (!permitted && asset.kind === "attachment" && asset.conversationId) {
    permitted = Boolean((await Conversation.exists({ _id: asset.conversationId, participants: actorId })) &&
      (await Message.exists({ conversationId: asset.conversationId, "attachments.assetId": asset._id })));
  }
  if (!permitted) throw new AppError("File not found", 404);
  return { url: await signedRead(asset.bucket, asset.key, asset.fileName), expiresIn: 60 };
};
