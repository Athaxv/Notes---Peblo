import { prisma } from "db";
import { aiQueue, JobName, type GenerateNoteAIJobData } from "server/queue";

export class AIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
  }
}

export const AIService = {
  async enqueueNoteGeneration(noteId: string, userId: string) {
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
    });

    if (!note) {
      throw new AIError("Note not found", 404);
    }

    const existingJobs = await aiQueue.getJobs(["waiting", "active"]);
    const duplicate = existingJobs.find(
      (job) => (job.data as GenerateNoteAIJobData).noteId === noteId,
    );

    if (duplicate) {
      throw new AIError("AI generation already running", 400);
    }

    await aiQueue.add(
      JobName.GENERATE_NOTE_AI,
      { noteId } satisfies GenerateNoteAIJobData,
      { jobId: `note-ai-${noteId}` },
    );

    return { success: true, message: "AI generation started" };
  },
};
