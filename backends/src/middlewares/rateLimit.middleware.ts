import { createHash } from "node:crypto";
import { Request, Response, NextFunction } from "express";
import redis from "../config/redis";
import { AppError } from "../lib/errors";

const fallback = new Map<string, { count: number; expiry: number }>();
// One Redis roundtrip enforces the email+IP, IP-only and email-across-IPs limits.
const incrementScript = `
  local limited = 0
  for i=1,#KEYS do
    local n = redis.call('INCR', KEYS[i])
    if n == 1 then redis.call('EXPIRE', KEYS[i], ARGV[1]) end
    if n > tonumber(ARGV[i+1]) then limited = 1 end
  end
  return limited
`;
const localIncrement = (key: string, seconds: number): number => {
  const now = Date.now();
  const previous = fallback.get(key);
  const count = previous && previous.expiry > now ? previous.count + 1 : 1;
  if (fallback.size > 10_000) fallback.clear();
  fallback.set(key, { count, expiry: previous && previous.expiry > now ? previous.expiry : now + seconds * 1000 });
  return count;
};
const hashed = (part: string) => createHash("sha256").update(part).digest("hex");

/** Redis atomic fixed-window limiter with bounded local fallback.
 * Distributed attempts against the same account cannot bypass the email ceiling
 * just by rotating IP addresses. Keep quotas per operation (login vs recovery).
 */
export const rateLimit = (max: number, windowSeconds: number, category: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase().slice(0, 180) : "";
    const prefix = `rate:${category}:`;
    const keys = [prefix + hashed(`ip-and-email:${ip}:${email}`), prefix + hashed(`ip:${ip}`)];
    const limits = [max, max * 6];
    if (email) { keys.push(prefix + hashed(`email:${email}`)); limits.push(max * 3); }
    const deny = () => { res.setHeader("Retry-After", String(windowSeconds));
      return next(new AppError("Too many attempts. Please retry later.", 429)); };
    try {
      if (redis.status === "ready") {
        const over = Number(await redis.eval(incrementScript, keys.length, ...keys,
          String(windowSeconds), ...limits.map(String)));
        if (over > 0) return deny();
      } else if (keys.map(key => localIncrement(key, windowSeconds)).some((count, index) => count > limits[index])) {
        return deny();
      }
      return next();
    } catch {
      // Redis failure never prevents verification or recovery altogether.
      if (keys.map(key => localIncrement(key, windowSeconds)).some((count, index) => count > limits[index])) return deny();
      return next();
    }
  };
