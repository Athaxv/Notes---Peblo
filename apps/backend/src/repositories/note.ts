import { prisma } from "db";

type CreateNoteData = {
  title: string;
  content: string;
  userId: string;
};

export const NoteRepository = {
  createNotes(data: CreateNoteData) {
    return prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        userId: data.userId,
        archived: false,
      },
    });
  },

  findManyNotes(userId: string) {
    return prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  },

  findOneNote(noteId: string, userId: string) {
    return prisma.note.findFirst({
      where: { id: noteId, userId },
    });
  },

  async updateNotes(
    noteId: string,
    userId: string,
    data: { title?: string; content?: string; archived?: boolean },
  ) {
    const existing = await this.findOneNote(noteId, userId);
    if (!existing) return null;

    return prisma.note.update({
      where: { id: noteId },
      data,
    });
  },

  async deleteNote(noteId: string, userId: string) {
    const existing = await this.findOneNote(noteId, userId);
    if (!existing) return false;

    await prisma.note.delete({ where: { id: noteId } });
    return true;
  },
};
