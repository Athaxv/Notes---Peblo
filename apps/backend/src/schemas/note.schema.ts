import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().max(100_000).default(""),
  tags: z.array(z.string().min(1).max(50)).optional(),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  content: z.string().max(100_000).optional(),
  archived: z.boolean().optional(),
  tags: z.array(z.string().min(1).max(50)).optional(),
});

export const listNotesQuerySchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
  archived: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  sort: z.enum(["updatedAt", "createdAt", "title"]).optional().default("updatedAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});
