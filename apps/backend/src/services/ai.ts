import { prisma } from "db";
import { GenerateNoteAIService } from "server/ai";
import { env } from "../config/env";
import { AIError } from "../lib/errors";
import { NoteRepository } from "../repositories/note";
import { mapNote, noteInclude } from "../utils/note-mapper";

const jobIdForNote = (noteId: string) => `note-ai-${noteId}`;

type AiStatus = "idle" | "processing" | "done" | "failed";

async function loadNoteForUser(noteId: string, userId: string) {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId },
  });

  if (!note) {
    throw new AIError("Note not found", 404);
  }

  if (!note.content.trim()) {
    throw new AIError("Add some note content before generating a summary", 400);
  }

  return note;
}

export const AIService = {
  async generate(noteId: string, userId: string) {
    if (env.useAiWorker) {
      return this.enqueueNoteGeneration(noteId, userId);
    }
    return this.generateNoteSummary(noteId, userId);
  },

  async generateNoteSummary(noteId: string, userId: string) {
    if (!env.groqApiKey) {
      throw new AIError("GROQ_API_KEY is not configured", 500);
    }

    const note = await loadNoteForUser(noteId, userId);

    try {
      const ai = new GenerateNoteAIService();
      const result = await ai.execute(note.content);

      const updated = await prisma.note.update({
        where: { id: noteId },
        data: {
          aiSummary: result.summary,
          aiActionItems: JSON.stringify(result.action_items),
          title: note.title || result.suggested_title,
          aiGeneratedAt: new Date(),
        },
        include: noteInclude,
      });

      return {
        status: "done" as const,
        note: mapNote(updated),
      };
    } catch (error) {
      if (error instanceof AIError) throw error;
      const message =
        error instanceof Error ? error.message : "AI generation failed";
      throw new AIError(message, 502);
    }
  },

  async enqueueNoteGeneration(noteId: string, userId: string) {
    const note = await loadNoteForUser(noteId, userId);

    const { aiQueue, JobName } = await import("server/queue");

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
      { noteId: note.id },
      { jobId },
    );

    const refreshed = await NoteRepository.findOneNote(noteId, userId);
    if (!refreshed) throw new AIError("Note not found", 404);

    return {
      status: "processing" as const,
      note: mapNote(refreshed),
    };
  },

  async getStatus(noteId: string, userId: string) {
    const note = await NoteRepository.findOneNote(noteId, userId);
    if (!note) throw new AIError("Note not found", 404);

    let status: AiStatus = note.aiSummary ? "done" : "idle";

    if (env.useAiWorker) {
      const { aiQueue } = await import("server/queue");
      const job = await aiQueue.getJob(jobIdForNote(noteId));

      status = "idle";
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
    }

    return {
      status,
      note: mapNote(note),
    };
  },
};
