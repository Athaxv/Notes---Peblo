"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { TagCount } from "@/lib/types";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  showArchived: boolean;
  onArchivedChange: (v: boolean) => void;
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  tags: TagCount[];
  onCreateNote: () => void;
  creating?: boolean;
};

export function NotesToolbar({
  search,
  onSearchChange,
  showArchived,
  onArchivedChange,
  selectedTag,
  onTagSelect,
  tags,
  onCreateNote,
  creating,
}: Props) {
  return (
    <div className="glass-strong space-y-4 rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
          <p className="text-sm text-muted">Create, search, and organize your notes</p>
        </div>
        <Button onClick={onCreateNote} disabled={creating}>
          {creating ? "Creating…" : "New note"}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          className="pl-10"
          placeholder="Search notes…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onArchivedChange(false)}
          className={cn(
            "rounded-full px-3 py-1 text-sm transition",
            !showArchived ? "bg-accent text-accent-foreground" : "bg-muted-bg text-muted",
          )}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => onArchivedChange(true)}
          className={cn(
            "rounded-full px-3 py-1 text-sm transition",
            showArchived ? "bg-accent text-accent-foreground" : "bg-muted-bg text-muted",
          )}
        >
          Archived
        </button>
        <span className="mx-1 h-4 w-px bg-border" />
        <button
          type="button"
          onClick={() => onTagSelect(null)}
          className={cn(
            "rounded-full px-3 py-1 text-sm transition",
            !selectedTag ? "bg-accent/15 text-accent" : "text-muted hover:bg-muted-bg",
          )}
        >
          All tags
        </button>
        {tags.map((t) => (
          <button
            key={t.name}
            type="button"
            onClick={() => onTagSelect(t.name)}
            className={cn(
              "rounded-full px-3 py-1 text-sm transition",
              selectedTag === t.name
                ? "bg-accent text-accent-foreground"
                : "text-muted hover:bg-muted-bg",
            )}
          >
            {t.name} ({t.count})
          </button>
        ))}
      </div>
    </div>
  );
}
