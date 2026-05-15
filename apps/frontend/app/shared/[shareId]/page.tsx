"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import type { Note } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SharedNotePage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.notes
      .getPublic(shareId)
      .then(setNote)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center app-gradient">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex min-h-screen items-center justify-center app-gradient p-4">
        <EmptyState
          title="Note not found"
          description="This share link may be invalid or has been revoked."
          action={
            <Link href="/login" className="text-accent font-medium">
              Sign in to Peblo
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen app-gradient">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Sparkles className="h-5 w-5 text-accent" />
            Peblo
          </Link>
          <span className="text-xs text-muted">Shared note</span>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">
          {note.title || "Untitled"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Updated {formatDate(note.updatedAt)}
        </p>
        {note.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
        <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed">
          {note.content}
        </div>
        {note.aiSummary && (
          <div className="mt-10 rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-2 flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-accent" />
              AI Summary
            </h2>
            <p className="text-muted">{note.aiSummary}</p>
            {note.aiActionItems && note.aiActionItems.length > 0 && (
              <ul className="mt-4 list-inside list-disc space-y-1 text-sm">
                {note.aiActionItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </article>
    </div>
  );
}
