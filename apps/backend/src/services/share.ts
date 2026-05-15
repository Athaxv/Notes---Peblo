import { NoteError } from "../lib/errors";
import { NoteRepository } from "../repositories/note";
import { mapNote } from "../utils/note-mapper";
import { generateShareId } from "../utils/token";

export const ShareService = {
  async enableShare(noteId: string, userId: string) {
    const note = await NoteRepository.findOneNote(noteId, userId);
    if (!note) throw new NoteError("Note not found", 404);

    const shareId = note.publicShareId ?? generateShareId();
    const updated = await NoteRepository.updateNotes(noteId, userId, {
      isPublic: true,
      publicShareId: shareId,
    });

    if (!updated) throw new NoteError("Note not found", 404);
    return {
      publicShareId: shareId,
      shareUrl: `/shared/${shareId}`,
    };
  },

  async disableShare(noteId: string, userId: string) {
    const note = await NoteRepository.findOneNote(noteId, userId);
    if (!note) throw new NoteError("Note not found", 404);

    await NoteRepository.updateNotes(noteId, userId, {
      isPublic: false,
      publicShareId: null,
    });
  },

  async getPublicNote(shareId: string) {
    const note = await NoteRepository.findByShareId(shareId);
    if (!note) throw new NoteError("Shared note not found", 404);
    return mapNote(note);
  },
};
