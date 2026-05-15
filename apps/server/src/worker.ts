import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "db";
import { GenerateNoteAIService } from "./ai/generate-notes";
import { AI_QUEUE_NAME, JobName, type GenerateNoteAIJobData } from "./queue/jobs";
import { redisConnection } from "./queue/redis";

const aiService = new GenerateNoteAIService();

const worker = new Worker<GenerateNoteAIJobData>(
  AI_QUEUE_NAME,
  async (job) => {
    switch (job.name) {
      case JobName.GENERATE_NOTE_AI: {
        const { noteId } = job.data;
        console.log(`[AI] Processing note ${noteId} (job ${job.id})`);

        const note = await prisma.note.findUnique({
          where: { id: noteId },
        });

        if (!note) {
          throw new Error("Note not found");
        }

        if (!note.content.trim()) {
          throw new Error("Note has no content to summarize");
        }

        const result = await aiService.execute(note.content);

        await prisma.note.update({
          where: { id: noteId },
          data: {
            aiSummary: result.summary,
            aiActionItems: JSON.stringify(result.action_items),
            title: note.title || result.suggested_title,
            aiGeneratedAt: new Date(),
          },
        });

        return result;
      }
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

console.log("AI worker listening on queue:", AI_QUEUE_NAME);
