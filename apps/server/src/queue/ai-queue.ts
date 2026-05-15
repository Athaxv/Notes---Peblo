import { Queue } from "bullmq";
import { AI_QUEUE_NAME } from "./jobs";
import { redisConnection } from "./redis";

export const aiQueue = new Queue(AI_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 200,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});
