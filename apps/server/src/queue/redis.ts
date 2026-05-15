import IORedis from "ioredis";

function createRedisConnection() {
  const url = process.env.REDIS_URL;
  if (url) {
    return new IORedis(url, { maxRetriesPerRequest: null });
  }

  return new IORedis({
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT ?? 6379),
    maxRetriesPerRequest: null,
  });
}

export const redisConnection = createRedisConnection();
