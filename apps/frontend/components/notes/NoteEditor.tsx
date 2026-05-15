"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  Copy,
  Link2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Note } from "@/lib/types";
import { copyToClipboard } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useAiStatus } from "@/hooks/useAiStatus";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { TagInput } from "./TagInput";

type SaveState = "idle" | "saving" | "saved" | "error";

export function NoteEditor({ noteId }: { noteId: string }) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [archived, setArchived] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiError, setAiError] = useState<string | null>(null);

  const debouncedTitle = useDebounce(title, 600);
  const debouncedContent = useDebounce(content, 600);
  const debouncedTags = useDebounce(tags, 600);

  const { data: aiData, polling, startPolling, status } = useAiStatus(
    noteId,
    Boolean(note),
  );

  const load = useCallback(async () => {
    const n = await api.notes.get(noteId);
    setNote(n);
    setTitle(n.title);
    setContent(n.content);
    setTags(n.tags);
    setArchived(n.archived);
    if (n.isPublic && n.publicShareId) {
      setShareUrl(`${window.location.origin}/shared/${n.publicShareId}`);
    }
  }, [noteId]);

  useEffect(() => {
    load()
      .catch(() => router.push("/notes"))
      .finally(() => setLoading(false));
  }, [load, router]);

  useEffect(() => {
    if (!note || loading) return;
    if (
      debouncedTitle === note.title &&
      debouncedContent === note.content &&
      JSON.stringify(debouncedTags) === JSON.stringify(note.tags)
    ) {
      return;
    }

    setSaveState("saving");
    api.notes
      .update(noteId, {
        title: debouncedTitle,
        content: debouncedContent,
        tags: debouncedTags,
      })
      .then((updated) => {
        setNote(updated);
        setSaveState("saved");
      })
      .catch(() => setSaveState("error"));
  }, [debouncedTitle, debouncedContent, debouncedTags, noteId, note, loading]);

  useEffect(() => {
    if (aiData?.note) {
      setNote(aiData.note);
      setTitle(aiData.note.title);
      if (aiData.note.aiSummary) {
        /* content unchanged */
      }
    }
  }, [aiData]);

  async function toggleArchive() {
    const next = !archived;
    setArchived(next);
    const updated = await api.notes.update(noteId, { archived: next });
    setNote(updated);
  }

  async function handleGenerateAi() {
    setAiError(null);
    try {
      // Flush pending auto-save so the worker reads the latest content from the DB
      const saved = await api.notes.update(noteId, {
        title,
        content,
        tags,
      });
      setNote(saved);

      await api.notes.generateSummary(noteId);
      startPolling();
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "AI failed");
    }
  }

  async function handleShare() {
    setShareCopied(false);
    setShareError(null);
    try {
      let url = shareUrl;
      if (!url) {
        const res = await api.notes.enableShare(noteId);
        url = `${window.location.origin}${res.shareUrl}`;
        setShareUrl(url);
      }
      const copied = await copyToClipboard(url);
      setShareCopied(copied);
      if (copied) {
        window.setTimeout(() => setShareCopied(false), 2000);
      } else {
        setShareError("Copy failed — select the link above and copy manually.");
      }
    } catch (e) {
      setShareError(e instanceof Error ? e.message : "Could not share note");
    }
  }

  async function revokeShare() {
    await api.notes.disableShare(noteId);
    setShareUrl(null);
    setShareCopied(false);
    setShareError(null);
    await load();
  }

  async function handleDelete() {
    if (!confirm("Delete this note permanently?")) return;
    await api.notes.delete(noteId);
    router.push("/notes");
  }

  if (loading || !note) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const displayNote = aiData?.note ?? note;

  return (
    <div className="space-y-6">
      <div className="glass-strong flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/notes")}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <span className="text-sm text-muted" aria-live="polite" aria-atomic="true">
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "Saved"}
          {saveState === "error" && "Save failed"}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="text-lg font-semibold"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing…"
            rows={16}
          />
          <TagInput tags={tags} onChange={setTags} />

          <div className="flex flex-wrap gap-2">
            <Button
              variant={archived ? "primary" : "secondary"}
              size="sm"
              onClick={() => void toggleArchive()}
            >
              <Archive className="h-4 w-4" />
              {archived ? "Archived" : "Archive"}
            </Button>
            <Button variant="danger" size="sm" onClick={() => void handleDelete()}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-accent" />
              AI Assistant
            </h2>
            <Button
              className="w-full"
              onClick={() => void handleGenerateAi()}
              disabled={polling || status === "processing"}
            >
              {polling || status === "processing" ? (
                <>
                  <Spinner />
                  Processing…
                </>
              ) : (
                "Generate summary"
              )}
            </Button>
            {aiError && (
              <p className="mt-2 text-sm text-danger">{aiError}</p>
            )}
            {(polling || status === "processing") && !displayNote.aiSummary && (
              <p className="mt-4 text-sm text-muted">Generating summary from your note…</p>
            )}
            {displayNote.aiSummary &&
              status !== "processing" &&
              !polling && (
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="font-medium text-muted">Summary</p>
                  <p className="mt-1">{displayNote.aiSummary}</p>
                </div>
                {displayNote.aiActionItems && displayNote.aiActionItems.length > 0 && (
                  <div>
                    <p className="font-medium text-muted">Action items</p>
                    <ul className="mt-1 list-inside list-disc space-y-1">
                      {displayNote.aiActionItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <Link2 className="h-4 w-4" />
              Share
            </h2>
            {shareError && (
              <p className="mb-2 text-sm text-danger" role="alert">
                {shareError}
              </p>
            )}
            {shareUrl ? (
              <div className="space-y-2">
                <p className="break-all text-xs text-muted">{shareUrl}</p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => void handleShare()}>
                    <Copy className="h-4 w-4" />
                    {shareCopied ? "Copied!" : "Copy link"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => void revokeShare()}>
                    Revoke
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="secondary" className="w-full" onClick={() => void handleShare()}>
                Enable public link
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
