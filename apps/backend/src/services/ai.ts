import { prisma } from "db";
import { aiQueue, JobName, type GenerateNoteAIJobData } from "server/queue";
import { AIError } from "../lib/errors";
import { NoteRepository } from "../repositories/note";
import { mapNote } from "../utils/note-mapper";

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

  async getStatus(noteId: string, userId: string) {
    const note = await NoteRepository.findOneNote(noteId, userId);
    if (!note) throw new AIError("Note not found", 404);

    const jobs = await aiQueue.getJobs(["waiting", "active", "completed", "failed"]);
    const job = jobs.find(
      (j) => (j.data as GenerateNoteAIJobData).noteId === noteId,
    );

    let status: "idle" | "processing" | "done" | "failed" = "idle";
    if (job) {
      const state = await job.getState();
      if (state === "waiting" || state === "active") status = "processing";
      else if (state === "completed") status = note.aiSummary ? "done" : "idle";
      else if (state === "failed") status = "failed";
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
