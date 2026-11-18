import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { Types } from "mongoose";
import MailOutbox, { EmailPurpose } from "./mail.outbox.model";
import { sendEmail } from "./mail.service";

// Outbox messages include short-lived verification links. Encrypt the body at rest;
// do not log codes, links, or SMTP payloads. Use a stable, dedicated secret in production.
const encryptionKey = () => {
  const secret = process.env.MAIL_OUTBOX_KEY || process.env.JWT_REFRESH_SECRET;
  if (!secret || secret.length < 24) throw new Error("MAIL_OUTBOX_KEY/JWT_REFRESH_SECRET must be at least 24 characters");
  return createHash("sha256").update(`jobhub:email-outbox:v1:${secret}`).digest();
};
const encrypt = (value: string): string => {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const body = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), body.toString("base64url")].join(".");
};
const decrypt = (value: string): string => {
  const [nonce, tag, data] = value.split(".");
  if (!nonce || !tag || !data) throw new Error("Invalid encrypted mail payload");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(nonce, "base64url"));
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(data, "base64url")), decipher.final()]).toString("utf8");
};

export const enqueueAuthEmail = async (data: {
  userId: Types.ObjectId; to: string; purpose: EmailPurpose;
  subject: string; body: string; expiresAt: Date;
}): Promise<void> => {
  // An old, unsent code is invalidated when a new one is generated.
  await MailOutbox.updateMany({ userId: data.userId, purpose: data.purpose,
    status: { $in: ["pending"] } }, { $set: { status: "failed" }, $unset: { encryptedBody: "" } });
  await MailOutbox.create({ userId: data.userId, purpose: data.purpose,
    to: data.to, subject: data.subject, encryptedBody: encrypt(data.body),
    status: "pending", attempts: 0, availableAt: new Date(), expiresAt: data.expiresAt,
    retainUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) });
  // Scheduler is also running; this nudges delivery on new registrations.
  void deliverQueuedEmails().catch(() => console.error("[JobHub mail] queue delivery cycle failed"));
};

const MAX_ATTEMPTS = 5;
const BACKOFF_MS = [15_000, 45_000, 120_000, 180_000, 240_000];
let deliveryRunning = false;

export const deliverQueuedEmails = async (): Promise<number> => {
  if (deliveryRunning) return 0;
  deliveryRunning = true;
  let completed = 0;
  try {
    // Bounded batches avoid monopolizing the API process during SMTP outages.
    for (let i = 0; i < 20; i++) {
      const now = new Date();
      const mail = await MailOutbox.findOneAndUpdate({
        availableAt: { $lte: now }, expiresAt: { $gt: now },
        $or: [{ status: "pending" }, { status: "sending", leaseUntil: { $lte: now } }],
      }, { $set: { status: "sending", leaseUntil: new Date(Date.now() + 90_000) }, $inc: { attempts: 1 } },
      { new: true, sort: { availableAt: 1 } }).select("+encryptedBody");
      if (!mail) break;
      try {
        await sendEmail(mail.to, mail.subject, decrypt(mail.encryptedBody));
        await MailOutbox.updateOne({ _id: mail._id, status: "sending" },
          { $set: { status: "sent", sentAt: new Date() }, $unset: { encryptedBody: "", leaseUntil: "" } });
        completed++;
      } catch {
        const retryAt = new Date(Date.now() + BACKOFF_MS[Math.min(mail.attempts - 1, BACKOFF_MS.length - 1)]);
        const final = mail.attempts >= MAX_ATTEMPTS || retryAt >= mail.expiresAt;
        await MailOutbox.updateOne({ _id: mail._id, status: "sending" }, {
          $set: { status: final ? "failed" : "pending", availableAt: retryAt },
          $unset: final ? { encryptedBody: "", leaseUntil: "" } : { leaseUntil: "" },
        });
        console.error(`[JobHub mail] ${mail.purpose} delivery ${final ? "failed" : "will retry"} (job ${mail._id.toString()}, attempt ${mail.attempts})`);
      }
    }
    // Expired messages must never be delivered, even if SMTP comes back later.
    await MailOutbox.updateMany({ status: { $in: ["pending", "sending"] }, expiresAt: { $lte: new Date() } },
      { $set: { status: "failed" }, $unset: { encryptedBody: "", leaseUntil: "" } });
  } finally { deliveryRunning = false; }
  return completed;
};

export const startMailOutboxWorker = (): void => {
  void deliverQueuedEmails().catch(() => console.error("[JobHub mail] initial delivery cycle failed"));
  const interval = setInterval(() => {
    void deliverQueuedEmails().catch(() => console.error("[JobHub mail] delivery cycle failed"));
  }, 15_000);
  interval.unref();
};
