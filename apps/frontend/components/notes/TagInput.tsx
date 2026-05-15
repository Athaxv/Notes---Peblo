"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

export function TagInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const name = raw.trim().toLowerCase();
    if (!name || tags.includes(name)) return;
    onChange([...tags, name]);
    setInput("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor="tag-input" className="text-sm font-medium text-muted">
        Tags
      </label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            className="flex items-center gap-1 pr-1"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove tag ${tag}`}
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="min-h-6 min-w-6 cursor-pointer rounded-full p-0.5 hover:bg-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="h-3 w-3" aria-hidden />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        id="tag-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => input && addTag(input)}
        placeholder="Add tag and press Enter"
        aria-describedby="tag-input-hint"
      />
      <p id="tag-input-hint" className="text-xs text-muted">
        Press Enter or comma to add a tag
      </p>
    </div>
  );
}
