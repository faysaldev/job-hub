import { createHash } from "node:crypto";
import { Request, Response, NextFunction } from "express";
import redis from "../config/redis";
import { AppError } from "../lib/errors";

const fallback = new Map<string, { count: number; expiry: number }>();
const incrementScript = `
  local n = redis.call('INCR', KEYS[1])
  if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
  return n
`;
const localIncrement = (key: string, seconds: number): number => {
  const now = Date.now();
  const previous = fallback.get(key);
  const count = previous && previous.expiry > now ? previous.count + 1 : 1;
  if (fallback.size > 10000) fallback.clear();
  fallback.set(key, { count, expiry: previous && previous.expiry > now ? previous.expiry : now + seconds * 1000 });
  return count;
};
/** Redis atomic fixed-window limiter plus bounded in-process failover.
 * Protect both a specific email+IP and the IP across varied accounts. */
export const rateLimit = (max: number, windowSeconds: number, category: string) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const email = typeof req.body?.email === "string" ? req.body.email.toLowerCase().slice(0, 180) : "";
    const prefix = `rate:${category}:`;
    const keyed = prefix + createHash("sha256").update(`${ip}:${email}`).digest("hex");
    const ipKey = prefix + createHash("sha256").update(`ip:${ip}`).digest("hex");
    try {
      const incr = async (key: string): Promise<number> => redis.status === "ready"
        ? Number(await redis.eval(incrementScript, 1, key, String(windowSeconds)))
        : localIncrement(key, windowSeconds);
      const [accountCount, ipCount] = await Promise.all([incr(keyed), incr(ipKey)]);
      if (accountCount > max || ipCount > max * 6) {
        return next(new AppError("Too many attempts. Please retry later.", 429));
      }
      next();
    } catch (error) {
      // Redis connectivity failure should not block account recovery.
      const count = localIncrement(keyed, windowSeconds);
      const overall = localIncrement(ipKey, windowSeconds);
      if (count > max || overall > max * 6) return next(new AppError("Too many attempts", 429));
      next();
    }
  };
