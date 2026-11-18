import crypto from "node:crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import AuthSession from "./auth.session.model";
import User, { IAMUser } from "../User/user.model";
import { AppError } from "../../lib/errors";

const ACCESS_TTL_SECONDS = 15 * 60;
const REFRESH_TTL_SECONDS = 30 * 24 * 60 * 60;
const MAX_SESSIONS = 3;
// Only used to return the same rotated cookie to nearly simultaneous refreshes,
// not to extend the lifetime of a used refresh token.
const ROTATION_GRACE_MS = 4_000;

const accessSecret = () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24) {
    throw new Error("JWT_SECRET must be configured (at least 24 characters)");
  }
  return process.env.JWT_SECRET;
};
const refreshSecret = () => {
  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.length < 24) {
    throw new Error("JWT_REFRESH_SECRET must be configured (at least 24 characters)");
  }
  return process.env.JWT_REFRESH_SECRET;
};

export const assertAuthSecrets = () => { accessSecret(); refreshSecret(); };

interface Claims extends JwtPayload {
  userId: string;
  sid: string;
  type: "access" | "refresh";
  role?: string;
}

const sign = (user: IAMUser, sid: string, type: "access" | "refresh") =>
  jwt.sign({ userId: user._id.toString(), sid, type, role: user.role, jti: crypto.randomUUID() },
    type === "access" ? accessSecret() : refreshSecret(),
    { algorithm: "HS256", expiresIn: type === "access" ? ACCESS_TTL_SECONDS : REFRESH_TTL_SECONDS });

const hash = (value: string) => crypto.createHash("sha256").update(value).digest("hex");
const cipherKey = () => crypto.createHash("sha256").update(`jobhub:session-rotation:v1:${refreshSecret()}`).digest();
const seal = (plaintext: string) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", cipherKey(), iv);
  const body = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), body.toString("base64url")].join(".");
};
const unseal = (encrypted: string) => {
  const [iv, tag, data] = encrypted.split(".");
  if (!iv || !tag || !data) throw new AppError("Refresh session expired", 401);
  const decipher = crypto.createDecipheriv("aes-256-gcm", cipherKey(), Buffer.from(iv, "base64url"));
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(data, "base64url")), decipher.final()]).toString("utf8");
};

export const verifyClaims = (token: string, type: "access" | "refresh"): Claims => {
  const decoded = jwt.verify(token, type === "access" ? accessSecret() : refreshSecret(), { algorithms: ["HS256"] });
  if (typeof decoded === "string" || decoded.type !== type ||
    !Types.ObjectId.isValid(decoded.userId) || !Types.ObjectId.isValid(decoded.sid)) {
    throw new AppError("Invalid session token", 401);
  }
  return decoded as Claims;
};

export const verifyAccess = async (token: string) => {
  const claims = verifyClaims(token, "access");
  const [user, session] = await Promise.all([
    User.findById(claims.userId).select("_id name email image role phoneNumber isDeleted suspendedAt isEmailVerified").lean(),
    AuthSession.exists({ _id: claims.sid, userId: claims.userId, expiresAt: { $gt: new Date() }, revokedAt: { $exists: false } }),
  ]);
  if (!user || !session || user.isDeleted || user.suspendedAt || !user.isEmailVerified || user.role !== claims.role) {
    throw new AppError("Session expired or revoked", 401);
  }
  return { _id: user._id.toString(), name: user.name, email: user.email, image: user.image,
    role: user.role, phoneNumber: user.phoneNumber, sessionId: claims.sid };
};

export const issueSession = async (user: IAMUser) => {
  const id = new Types.ObjectId();
  const sid = id.toString();
  const refreshToken = sign(user, sid, "refresh");
  await AuthSession.create({ _id: id, userId: user._id, refreshHash: hash(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TTL_SECONDS * 1000) });
  // DB-enforced revocation across devices; oldest session(s) are displaced.
  const sessions = await AuthSession.find({ userId: user._id, revokedAt: { $exists: false } })
    .select("_id").sort({ createdAt: -1, _id: -1 }).skip(MAX_SESSIONS).lean();
  if (sessions.length) {
    await AuthSession.updateMany({ _id: { $in: sessions.map((session) => session._id) } },
      { $set: { revokedAt: new Date() } });
  }
  return { accessToken: sign(user, sid, "access"), refreshToken };
};

export const rotateSession = async (oldRefresh: string) => {
  const claims = verifyClaims(oldRefresh, "refresh");
  const user = await User.findById(claims.userId);
  if (!user || user.isDeleted || user.suspendedAt || !user.isEmailVerified || user.role !== claims.role) {
    throw new AppError("Session expired or revoked", 401);
  }
  const oldHash = hash(oldRefresh);
  const newRefresh = sign(user, claims.sid, "refresh");
  const now = new Date();
  const updated = await AuthSession.findOneAndUpdate({ _id: claims.sid, userId: user._id,
    refreshHash: oldHash, expiresAt: { $gt: now }, revokedAt: { $exists: false } }, {
    $set: { refreshHash: hash(newRefresh), previousRefreshHash: oldHash,
      previousRefreshValidUntil: new Date(Date.now() + ROTATION_GRACE_MS),
      refreshCiphertext: seal(newRefresh), expiresAt: new Date(Date.now() + REFRESH_TTL_SECONDS * 1000) },
  });
  if (updated) return { user, accessToken: sign(user, claims.sid, "access"), refreshToken: newRefresh };

  // Multiple frontend tabs can send the same cookie before the first Set-Cookie is
  // received. Within a brief grace window, return the exact new token (no extra rotation).
  const concurrent = await AuthSession.findOne({ _id: claims.sid, userId: user._id,
    previousRefreshHash: oldHash, previousRefreshValidUntil: { $gt: new Date() },
    expiresAt: { $gt: new Date() }, revokedAt: { $exists: false } }).select("+refreshCiphertext");
  if (!concurrent?.refreshCiphertext) throw new AppError("Refresh session expired or already used", 401);
  return { user, accessToken: sign(user, claims.sid, "access"), refreshToken: unseal(concurrent.refreshCiphertext) };
};

export const revokeByRefreshToken = async (token: string) => {
  try {
    const claims = verifyClaims(token, "refresh");
    await AuthSession.updateOne({ _id: claims.sid, userId: claims.userId,
      $or: [{ refreshHash: hash(token) },
        { previousRefreshHash: hash(token), previousRefreshValidUntil: { $gt: new Date() } }] },
    { $set: { revokedAt: new Date() }, $unset: { refreshCiphertext: "" } });
  } catch { /* Always clear the browser cookie even if the session has expired. */ }
};
export const revokeSession = async (sid: string, userId: string) => {
  await AuthSession.updateOne({ _id: sid, userId },
    { $set: { revokedAt: new Date() }, $unset: { refreshCiphertext: "" } });
};
export const revokeAllSessions = async (userId: string) => {
  await AuthSession.updateMany({ userId, revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date() }, $unset: { refreshCiphertext: "" } });
};
