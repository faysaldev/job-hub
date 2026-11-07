/** Cloudflare R2 S3 compatibility layer. Never send these credentials to the browser. */
import {
  DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppError } from "../../lib/errors";

const mandatory = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) throw new AppError("File storage is not configured", 503);
  return value;
};
let client: S3Client | undefined;
export const r2Client = () => {
  if (!client) client = new S3Client({
    region: "auto",
    endpoint: `https://${mandatory("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: mandatory("R2_ACCESS_KEY_ID"), secretAccessKey: mandatory("R2_SECRET_ACCESS_KEY") },
    // R2 uses path style for the S3-compatible endpoint.
    forcePathStyle: true,
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  return client;
};
export const bucketFor = (kind: string) => {
  const publicBucket = mandatory("R2_PUBLIC_BUCKET");
  const privateBucket = mandatory("R2_PRIVATE_BUCKET");
  if (publicBucket === privateBucket) throw new AppError("R2 public and private buckets must be separate", 503);
  return kind === "avatar" || kind === "company-logo" ? publicBucket : privateBucket;
};
export const publicAssetUrl = (key: string) => {
  const base = mandatory("R2_PUBLIC_BASE_URL");
  const origin = new URL(base);
  if (origin.protocol !== "https:" || origin.username || origin.password || origin.search || origin.hash) {
    throw new AppError("Invalid public storage configuration", 503);
  }
  return `${base.replace(/\/+$/, "")}/${key.split("/").map(encodeURIComponent).join("/")}`;
};
export const signedPut = (bucket: string, key: string, type: string) =>
  getSignedUrl(r2Client(), new PutObjectCommand({ Bucket: bucket, Key: key,
    ContentType: type, IfNoneMatch: "*" }), { expiresIn: 90 });
export const signedRead = (bucket: string, key: string, name: string) => {
  const safeName = name.replace(/[\r\n"\\]/g, "_").slice(0, 140) || "document";
  return getSignedUrl(r2Client(), new GetObjectCommand({ Bucket: bucket, Key: key,
    ResponseContentDisposition: `attachment; filename="${safeName}"`,
  }), { expiresIn: 60 });
};
export const head = (bucket: string, key: string) =>
  r2Client().send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
export const remove = (bucket: string, key: string) =>
  r2Client().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
export const putBuffer = (bucket: string, key: string, mimeType: string, buffer: Buffer) =>
  r2Client().send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: mimeType }));
export const firstBytes = async (bucket: string, key: string): Promise<Buffer> => {
  const obj = await r2Client().send(new GetObjectCommand({ Bucket: bucket, Key: key, Range: "bytes=0-31" }));
  if (!obj.Body) throw new AppError("File is empty", 400);
  return Buffer.from(await obj.Body.transformToByteArray());
};
