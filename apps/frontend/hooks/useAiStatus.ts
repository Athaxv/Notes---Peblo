"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { AiStatusResponse } from "@/lib/types";

/**
 * Sync mode: call applyResult() with POST /generate-summary response — no polling.
 * Worker mode: call startPolling() after status === "processing".
 */
export function useAiStatus(noteId: string) {
  const [data, setData] = useState<AiStatusResponse | null>(null);
  const [polling, setPolling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const applyResult = useCallback((result: AiStatusResponse) => {
    setData(result);
  }, []);

  const fetchStatus = useCallback(async () => {
    const result = await api.notes.aiStatus(noteId);
    setData(result);
    return result;
  }, [noteId]);

  const startPolling = useCallback(() => {
    setPolling(true);
    void fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    if (!polling) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(async () => {
      const result = await fetchStatus();
      if (result.status !== "processing") {
        setPolling(false);
      }
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [polling, fetchStatus]);

  return {
    data,
    polling,
    applyResult,
    startPolling,
    fetchStatus,
    status: data?.status ?? "idle",
  };
}
