import { Queue } from "bullmq";
import { redisConnection } from "./redis";

export const aiQueue = new Queue(
    "ai-processing",
    {
        connection: redisConnection,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 200
            },
            removeOnComplete: 100,
            removeOnFail: 50
        }
    }
)