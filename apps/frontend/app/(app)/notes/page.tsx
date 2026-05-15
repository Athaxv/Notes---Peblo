"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Note, TagCount } from "@/lib/types";
import { useDebounce } from "@/hooks/useDebounce";
import { NotesToolbar } from "@/components/notes/NotesToolbar";
import { NoteCard } from "@/components/notes/NoteCard";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<TagCount[]>([]);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [notesData, tagsData] = await Promise.all([
        api.notes.list({
          q: debouncedSearch || undefined,
          tag: selectedTag ?? undefined,
          archived: showArchived,
          sort: "updatedAt",
          order: "desc",
        }),
        api.tags.list(),
      ]);
      setNotes(notesData);
      setTags(tagsData);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedTag, showArchived]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate() {
    setCreating(true);
    try {
      const note = await api.notes.create({
        title: "Untitled",
        content: "",
      });
      router.push(`/notes/${note.id}`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <NotesToolbar
        search={search}
        onSearchChange={setSearch}
        showArchived={showArchived}
        onArchivedChange={setShowArchived}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        tags={tags}
        onCreateNote={() => void handleCreate()}
        creating={creating}
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : notes.length === 0 ? (
        <EmptyState
          title="No notes found"
          description={
            showArchived
              ? "No archived notes match your filters"
              : "Create your first note to get started"
          }
          action={
            !showArchived ? (
              <Button onClick={() => void handleCreate()}>New note</Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
