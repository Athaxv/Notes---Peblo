import { prisma } from "db";

export const TagRepository = {
  async findOrCreateByNames(names: string[]) {
    const normalized = [
      ...new Set(names.map((n) => n.trim().toLowerCase()).filter(Boolean)),
    ];
    if (normalized.length === 0) return [];

    // createMany + skipDuplicates avoids upsert races when tags are created in parallel
    await prisma.tag.createMany({
      data: normalized.map((name) => ({ name })),
      skipDuplicates: true,
    });

    return prisma.tag.findMany({
      where: { name: { in: normalized } },
    });
  },

  async setNoteTags(noteId: string, tagIds: string[]) {
    const uniqueTagIds = [...new Set(tagIds)];

    await prisma.$transaction(async (tx) => {
      await tx.noteTag.deleteMany({ where: { noteId } });
      if (uniqueTagIds.length === 0) return;
      await tx.noteTag.createMany({
        data: uniqueTagIds.map((tagId) => ({ noteId, tagId })),
        skipDuplicates: true,
      });
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
