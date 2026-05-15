import { NoteRepository } from "../repositories/note";

export class NoteError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
  }
}

export const NoteService = {
  async create(userId: string, body: { title: string; content: string }) {
    if (!body.title?.trim() || !body.content?.trim()) {
      throw new NoteError("Title and content are required", 400);
    }

    return NoteRepository.createNotes({
      title: body.title.trim(),
      content: body.content.trim(),
      userId,
    });
  },

  async findManyNote(userId: string) {
    return NoteRepository.findManyNotes(userId);
  },

  async getById(noteId: string, userId: string) {
    const note = await NoteRepository.findOneNote(noteId, userId);
    if (!note) throw new NoteError("Note not found", 404);
    return note;
  },

  async update(
    noteId: string,
    userId: string,
    body: { title?: string; content?: string; archived?: boolean },
  ) {
    const note = await NoteRepository.updateNotes(noteId, userId, body);
    if (!note) throw new NoteError("Note not found", 404);
    return note;
  },

  async remove(noteId: string, userId: string) {
    const deleted = await NoteRepository.deleteNote(noteId, userId);
    if (!deleted) throw new NoteError("Note not found", 404);
  },
};
