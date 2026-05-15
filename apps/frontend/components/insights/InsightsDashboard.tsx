"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brain, FileText, Tag, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import type { Insights } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";

export function InsightsDashboard() {
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.insights
      .get()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <EmptyState title="Could not load insights" description={error ?? undefined} />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted">Your productivity at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex items-start gap-4">
          <div className="rounded-xl bg-accent/15 p-3">
            <FileText className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted">Total notes</p>
            <p className="text-3xl font-bold">{data.totalNotes}</p>
          </div>
        </Card>
        <Card className="flex items-start gap-4">
          <div className="rounded-xl bg-accent/15 p-3">
            <Brain className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted">AI-enhanced</p>
            <p className="text-3xl font-bold">{data.aiUsage.percentWithAi}%</p>
            <p className="text-xs text-muted">{data.aiUsage.notesWithAi} notes</p>
          </div>
        </Card>
        <Card className="flex items-start gap-4">
          <div className="rounded-xl bg-accent/15 p-3">
            <Tag className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted">Top tags</p>
            <p className="text-3xl font-bold">{data.mostUsedTags.length}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <TrendingUp className="h-4 w-4 text-accent" />
            Recently edited
          </h2>
          {data.recentlyEdited.length === 0 ? (
            <p className="text-sm text-muted">No notes yet</p>
          ) : (
            <ul className="space-y-3">
              {data.recentlyEdited.map((note) => (
                <li key={note.id}>
                  <Link
                    href={`/notes/${note.id}`}
                    className="block rounded-lg border border-border px-3 py-2 transition hover:border-accent/50 hover:bg-muted-bg"
                  >
                    <p className="font-medium">{note.title || "Untitled"}</p>
                    <p className="text-xs text-muted">
                      {formatDate(note.updatedAt)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold">Most used tags</h2>
          {data.mostUsedTags.length === 0 ? (
            <p className="text-sm text-muted">No tags yet</p>
          ) : (
            <ul className="space-y-2">
              {data.mostUsedTags.map((t) => (
                <li
                  key={t.name}
                  className="flex items-center justify-between rounded-lg bg-muted-bg px-3 py-2"
                >
                  <Badge>{t.name}</Badge>
                  <span className="text-sm text-muted">{t.count}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 font-semibold">Weekly activity</h2>
        {data.weeklyActivity.length === 0 ? (
          <p className="text-sm text-muted">No activity in the last 4 weeks</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="pb-2 pr-4">Week</th>
                  <th className="pb-2 pr-4">Created</th>
                  <th className="pb-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {data.weeklyActivity.map((row) => (
                  <tr key={row.week} className="border-b border-border/50">
                    <td className="py-2 pr-4">{row.week}</td>
                    <td className="py-2 pr-4">{row.notesCreated}</td>
                    <td className="py-2">{row.notesUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
