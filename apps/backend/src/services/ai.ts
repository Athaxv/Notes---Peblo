import { prisma } from "db";
import { aiQueue, JobName, type GenerateNoteAIJobData } from "server/queue";
import { AIError } from "../lib/errors";
import { NoteRepository } from "../repositories/note";
import { mapNote } from "../utils/note-mapper";

const jobIdForNote = (noteId: string) => `note-ai-${noteId}`;

export const AIService = {
  async enqueueNoteGeneration(noteId: string, userId: string) {
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
    });

    if (!note) {
      throw new AIError("Note not found", 404);
    }

    if (!note.content.trim()) {
      throw new AIError("Add some note content before generating a summary", 400);
    }

    const jobId = jobIdForNote(noteId);
    const existingJob = await aiQueue.getJob(jobId);

    if (existingJob) {
      const state = await existingJob.getState();
      if (state === "waiting" || state === "active") {
        throw new AIError("AI generation already running", 400);
      }
      await existingJob.remove();
    }

    await prisma.note.update({
      where: { id: noteId },
      data: {
        aiSummary: null,
        aiActionItems: null,
        aiGeneratedAt: null,
      },
    });

    await aiQueue.add(
      JobName.GENERATE_NOTE_AI,
      { noteId } satisfies GenerateNoteAIJobData,
      { jobId },
    );

    return { success: true, message: "AI generation started" };
  },

  async getStatus(noteId: string, userId: string) {
    const note = await NoteRepository.findOneNote(noteId, userId);
    if (!note) throw new AIError("Note not found", 404);

    const job = await aiQueue.getJob(jobIdForNote(noteId));

    let status: "idle" | "processing" | "done" | "failed" = "idle";
    if (job) {
      const state = await job.getState();
      if (state === "waiting" || state === "active") {
        status = "processing";
      } else if (state === "failed") {
        status = "failed";
      } else if (state === "completed") {
        status = note.aiSummary ? "done" : "idle";
      }
    }

    if (note.aiSummary && status !== "processing") {
      status = "done";
    }

    return {
      status,
      note: mapNote(note),
    };
  },
};
