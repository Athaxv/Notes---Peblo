type NoteWithTags = {
  id: string;
  title: string;
  content: string;
  userId: string;
  archived: boolean;
  isPublic: boolean;
  publicShareId: string | null;
  aiSummary: string | null;
  aiActionItems: string | null;
  aiGeneratedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tag?: { tag: { id: string; name: string } }[];
};

export function mapNote(note: NoteWithTags) {
  return {
    note_id: note.id,
    id: note.id,
    title: note.title,
    content: note.content,
    archived: note.archived,
    isPublic: note.isPublic,
    publicShareId: note.publicShareId,
    aiSummary: note.aiSummary,
    aiActionItems: note.aiActionItems
      ? (JSON.parse(note.aiActionItems) as string[])
      : null,
    aiGeneratedAt: note.aiGeneratedAt,
    tags: (note.tag ?? []).map((t) => t.tag.name),
    updated_at: note.updatedAt,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}

export const noteInclude = {
  tag: { include: { tag: true } },
} as const;
