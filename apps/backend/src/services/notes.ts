import { NoteError } from "../lib/errors";
import { NoteRepository } from "../repositories/note";
import { TagRepository } from "../repositories/tag";
import { mapNote } from "../utils/note-mapper";
import type { z } from "zod";
import type {
  createNoteSchema,
  listNotesQuerySchema,
  updateNoteSchema,
} from "../schemas/note.schema";

type CreateInput = z.infer<typeof createNoteSchema>;
type UpdateInput = z.infer<typeof updateNoteSchema>;
type ListQuery = z.infer<typeof listNotesQuerySchema>;

export const NoteService = {
  async create(userId: string, body: CreateInput) {
    const tagIds = body.tags?.length
      ? (await TagRepository.findOrCreateByNames(body.tags)).map((t) => t.id)
      : [];

    const note = await NoteRepository.create({
      userId,
      title: body.title.trim(),
      content: body.content.trim(),
      tagIds,
    });

    return mapNote(note);
  },

  async findMany(userId: string, query: ListQuery) {
    const notes = await NoteRepository.findManyNotes(userId, {
      q: query.q,
      tag: query.tag,
      archived: query.archived,
      sort: query.sort,
      order: query.order,
    });
    return notes.map(mapNote);
  },

  async getById(noteId: string, userId: string) {
    const note = await NoteRepository.findOneNote(noteId, userId);
    if (!note) throw new NoteError("Note not found", 404);
    return mapNote(note);
  },

  async update(noteId: string, userId: string, body: UpdateInput) {
    const existing = await NoteRepository.findOneNote(noteId, userId);
    if (!existing) throw new NoteError("Note not found", 404);

    if (body.tags !== undefined) {
      const tagIds = body.tags.length
        ? (await TagRepository.findOrCreateByNames(body.tags)).map((t) => t.id)
        : [];
      await TagRepository.setNoteTags(noteId, tagIds);
    }

    const note = await NoteRepository.updateNotes(noteId, userId, {
      title: body.title?.trim(),
      content: body.content?.trim(),
      archived: body.archived,
    });

    if (!note) throw new NoteError("Note not found", 404);

    const refreshed = await NoteRepository.findOneNote(noteId, userId);
    return mapNote(refreshed!);
  },

  async remove(noteId: string, userId: string) {
    const deleted = await NoteRepository.deleteNote(noteId, userId);
    if (!deleted) throw new NoteError("Note not found", 404);
  },
};
