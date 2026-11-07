import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB || 0),
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  retryStrategy: (attempt) => Math.min(attempt * 500, 5000),
});
redis.on("error", () => { /* cache is optional; avoid leaking connection details */ });
redis.connect().catch(() => { /* reconnect strategy handles transient failures */ });
export default redis;
