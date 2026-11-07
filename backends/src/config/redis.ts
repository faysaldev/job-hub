import Redis from "ioredis";

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB || 0),
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  retryStrategy: (attempt: number) => Math.min(attempt * 500, 5000),
};
const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 })
  : new Redis(redisConfig);
redis.on("error", () => { /* cache is optional; avoid leaking connection details */ });
redis.connect().catch(() => { /* reconnect strategy handles transient failures */ });
export default redis;
