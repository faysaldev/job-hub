import crypto from "node:crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import AuthSession from "./auth.session.model";
import User, { IAMUser } from "../User/user.model";
import { AppError } from "../../lib/errors";

const ACCESS_TTL_SECONDS = 15 * 60;
const REFRESH_TTL_SECONDS = 30 * 24 * 60 * 60;
const MAX_SESSIONS = 3;

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
    User.findById(claims.userId).select("_id name email image role phoneNumber isDeleted isEmailVerified").lean(),
    AuthSession.exists({ _id: claims.sid, userId: claims.userId, expiresAt: { $gt: new Date() }, revokedAt: { $exists: false } }),
  ]);
  if (!user || !session || user.isDeleted || !user.isEmailVerified || user.role !== claims.role) {
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
  // Revoke oldest active sessions beyond the per-user limit (server-enforced).
  const sessions = await AuthSession.find({ userId: user._id, revokedAt: { $exists: false } })
    .select("_id").sort({ createdAt: -1 }).skip(MAX_SESSIONS).lean();
  if (sessions.length) {
    await AuthSession.updateMany({ _id: { $in: sessions.map((session) => session._id) } }, { $set: { revokedAt: new Date() } });
  }
  return { accessToken: sign(user, sid, "access"), refreshToken };
};

export const rotateSession = async (oldRefresh: string) => {
  const claims = verifyClaims(oldRefresh, "refresh");
  const user = await User.findById(claims.userId).select("+password");
  if (!user || user.isDeleted || !user.isEmailVerified) throw new AppError("Session expired or revoked", 401);
  const newRefresh = sign(user, claims.sid, "refresh");
  const rotated = await AuthSession.findOneAndUpdate({ _id: claims.sid, userId: user._id,
    refreshHash: hash(oldRefresh), expiresAt: { $gt: new Date() }, revokedAt: { $exists: false } },
  { $set: { refreshHash: hash(newRefresh), expiresAt: new Date(Date.now() + REFRESH_TTL_SECONDS * 1000) } });
  if (!rotated) throw new AppError("Refresh token already used or revoked", 401);
  return { user, accessToken: sign(user, claims.sid, "access"), refreshToken: newRefresh };
};

export const revokeByRefreshToken = async (token: string) => {
  try {
    const claims = verifyClaims(token, "refresh");
    await AuthSession.updateOne({ _id: claims.sid, userId: claims.userId,
      refreshHash: hash(token) }, { $set: { revokedAt: new Date() } });
  } catch { /* Always clear the browser cookie even if the session has expired. */ }
};
export const revokeSession = async (sid: string, userId: string) => {
  await AuthSession.updateOne({ _id: sid, userId }, { $set: { revokedAt: new Date() } });
};
export const revokeAllSessions = async (userId: string) => {
  await AuthSession.updateMany({ userId, revokedAt: { $exists: false } }, { $set: { revokedAt: new Date() } });
};
