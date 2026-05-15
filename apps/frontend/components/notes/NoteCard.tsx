import Link from "next/link";
import { Archive, Sparkles } from "lucide-react";
import type { Note } from "@/lib/types";
import { formatDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function NoteCard({ note }: { note: Note }) {
  return (
    <Link href={`/notes/${note.id}`}>
      <Card className="transition hover:border-accent/30 hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold line-clamp-1">
            {note.title || "Untitled"}
          </h3>
          <div className="flex shrink-0 gap-1">
            {note.archived && (
              <Archive className="h-4 w-4 text-muted" aria-label="Archived" />
            )}
            {note.aiSummary && (
              <Sparkles className="h-4 w-4 text-accent" aria-label="AI summary" />
            )}
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{note.content}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {note.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
          <span className={cn("text-xs text-muted", note.tags.length && "ml-auto")}>
            {formatDate(note.updatedAt)}
          </span>
        </div>
      </Card>
    </Link>
  );
}
