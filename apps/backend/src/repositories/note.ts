import { prisma } from "db";
import type { Prisma } from "db";
import { noteInclude } from "../utils/note-mapper";

type ListFilters = {
  q?: string;
  tag?: string;
  archived?: boolean;
  sort: "updatedAt" | "createdAt" | "title";
  order: "asc" | "desc";
};

export const NoteRepository = {
  create(data: {
    title: string;
    content: string;
    userId: string;
    tagIds?: string[];
  }) {
    return prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        userId: data.userId,
        archived: false,
        tag: data.tagIds?.length
          ? {
              create: data.tagIds.map((tagId) => ({ tagId })),
            }
          : undefined,
      },
      include: noteInclude,
    });
  },

  findManyNotes(userId: string, filters: ListFilters) {
    const where: Prisma.NoteWhereInput = { userId };

    if (filters.archived !== undefined) {
      where.archived = filters.archived;
    }

    if (filters.tag) {
      where.tag = {
        some: { tag: { name: filters.tag.trim().toLowerCase() } },
      };
    }

    if (filters.q?.trim()) {
      const q = filters.q.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ];
    }

    return prisma.note.findMany({
      where,
      include: noteInclude,
      orderBy: { [filters.sort]: filters.order },
    });
  },

  findOneNote(noteId: string, userId: string) {
    return prisma.note.findFirst({
      where: { id: noteId, userId },
      include: noteInclude,
    });
  },

  findByShareId(shareId: string) {
    return prisma.note.findFirst({
      where: { publicShareId: shareId, isPublic: true },
      include: noteInclude,
    });
  },

  async updateNotes(
    noteId: string,
    userId: string,
    data: {
      title?: string;
      content?: string;
      archived?: boolean;
      isPublic?: boolean;
      publicShareId?: string | null;
    },
  ) {
    const existing = await this.findOneNote(noteId, userId);
    if (!existing) return null;

    return prisma.note.update({
      where: { id: noteId },
      data,
      include: noteInclude,
    });
  },

  async deleteNote(noteId: string, userId: string) {
    const existing = await this.findOneNote(noteId, userId);
    if (!existing) return false;
    await prisma.note.delete({ where: { id: noteId } });
    return true;
  },

  countForUser(userId: string) {
    return prisma.note.count({ where: { userId } });
  },

  countWithAiForUser(userId: string) {
    return prisma.note.count({
      where: { userId, aiSummary: { not: null } },
    });
  },

  findRecentForUser(userId: string, limit: number) {
    return prisma.note.findMany({
      where: { userId },
      include: noteInclude,
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
  },
};
