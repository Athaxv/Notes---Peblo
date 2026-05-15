export const AI_QUEUE_NAME = "ai-processing" as const;

export const JobName = {
  GENERATE_NOTE_AI: "generate-note-ai",
} as const;

export type GenerateNoteAIJobData = {
  noteId: string;
};
