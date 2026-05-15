import { prisma } from "db";

export const TagRepository = {
  async findOrCreateByNames(names: string[]) {
    const normalized = [
      ...new Set(names.map((n) => n.trim().toLowerCase()).filter(Boolean)),
    ];
    if (normalized.length === 0) return [];

    const tags = await Promise.all(
      normalized.map((name) =>
        prisma.tag.upsert({
          where: { name },
          create: { name },
          update: {},
        }),
      ),
    );
    return tags;
  },

  async setNoteTags(noteId: string, tagIds: string[]) {
    await prisma.noteTag.deleteMany({ where: { noteId } });
    if (tagIds.length === 0) return;
    await prisma.noteTag.createMany({
      data: tagIds.map((tagId) => ({ noteId, tagId })),
    });
  },

  async findManyForUser(userId: string) {
    const rows = await prisma.noteTag.groupBy({
      by: ["tagId"],
      where: { note: { userId } },
      _count: { tagId: true },
    });

    const tagIds = rows.map((r) => r.tagId);
    const tags = await prisma.tag.findMany({
      where: { id: { in: tagIds } },
    });

    return rows
      .map((row) => {
        const tag = tags.find((t) => t.id === row.tagId);
        if (!tag) return null;
        return { name: tag.name, count: row._count.tagId };
      })
      .filter((t): t is { name: string; count: number } => t !== null)
      .sort((a, b) => b.count - a.count);
  },
};
