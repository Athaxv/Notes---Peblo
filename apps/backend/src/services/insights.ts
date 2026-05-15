import { prisma } from "db";
import { NoteRepository } from "../repositories/note";
import { TagRepository } from "../repositories/tag";
import { mapNote } from "../utils/note-mapper";

export const InsightsService = {
  async getForUser(userId: string) {
    const [totalNotes, notesWithAi, recentlyEdited, mostUsedTags] =
      await Promise.all([
        NoteRepository.countForUser(userId),
        NoteRepository.countWithAiForUser(userId),
        NoteRepository.findRecentForUser(userId, 5),
        TagRepository.findManyForUser(userId),
      ]);

    const weeklyActivity = await getWeeklyActivity(userId);

    return {
      totalNotes,
      recentlyEdited: recentlyEdited.map(mapNote),
      mostUsedTags,
      aiUsage: {
        notesWithAi,
        percentWithAi:
          totalNotes === 0
            ? 0
            : Math.round((notesWithAi / totalNotes) * 100),
      },
      weeklyActivity,
    };
  },
};

async function getWeeklyActivity(userId: string) {
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const notes = await prisma.note.findMany({
    where: { userId, updatedAt: { gte: fourWeeksAgo } },
    select: { createdAt: true, updatedAt: true },
  });

  const weeks = new Map<
    string,
    { week: string; notesCreated: number; notesUpdated: number }
  >();

  for (const note of notes) {
    const createdKey = weekKey(note.createdAt);
    const updatedKey = weekKey(note.updatedAt);

    const created = weeks.get(createdKey) ?? {
      week: createdKey,
      notesCreated: 0,
      notesUpdated: 0,
    };
    created.notesCreated += 1;
    weeks.set(createdKey, created);

    const updated = weeks.get(updatedKey) ?? {
      week: updatedKey,
      notesCreated: 0,
      notesUpdated: 0,
    };
    updated.notesUpdated += 1;
    weeks.set(updatedKey, updated);
  }

  return [...weeks.values()].sort((a, b) => a.week.localeCompare(b.week));
}

function weekKey(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
