import {
  clearSession,
  getAccessToken,
  setSession,
} from "./auth";
import type {
  AiStatusResponse,
  ApiError,
  AuthResponse,
  Insights,
  Note,
  NotesListParams,
  ShareResponse,
  TagCount,
  User,
} from "./types";

/** Browser uses same-origin proxy (/api) to avoid CORS; SSR uses BACKEND_URL. */
function getApiBase(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? "/api";
  }
  return (
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:5000"
  );
}

type FetchOptions = RequestInit & {
  skipAuth?: boolean;
  skipRetry?: boolean;
};

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as ApiError;
    return data.message ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { skipAuth, skipRetry, ...init } = options;
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${getApiBase()}${path}`, {
      ...init,
      headers,
      credentials: init.credentials ?? "include",
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Cannot reach the API. Start the backend with `bun run dev:api` (default port 5000).",
    );
  }

  if (res.status === 401 && !skipAuth && !skipRetry) {
    const refreshed = await refreshSession();
    if (refreshed) return apiFetch<T>(path, { ...options, skipRetry: true });
    clearSession();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Session expired");
  }

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return res.json() as Promise<T>;
}

async function refreshSession(): Promise<boolean> {
  try {
    const data = await apiFetch<AuthResponse>("/auth/refresh", {
      method: "POST",
      skipAuth: true,
      skipRetry: true,
      credentials: "include",
    });
    setSession(data.accessToken, data.user);
    return true;
  } catch {
    return false;
  }
}

export const api = {
  auth: {
    register: (body: { email: string; password: string; name?: string }) =>
      apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
        skipAuth: true,
        credentials: "include",
      }),

    login: (body: { email: string; password: string }) =>
      apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
        skipAuth: true,
        credentials: "include",
      }),

    refresh: () =>
      apiFetch<AuthResponse>("/auth/refresh", {
        method: "POST",
        skipAuth: true,
        skipRetry: true,
        credentials: "include",
      }),

    logout: () =>
      apiFetch<void>("/auth/logout", {
        method: "POST",
        credentials: "include",
      }),
  },

  notes: {
    list: (params: NotesListParams = {}) => {
      const search = new URLSearchParams();
      if (params.q) search.set("q", params.q);
      if (params.tag) search.set("tag", params.tag);
      if (params.archived !== undefined)
        search.set("archived", String(params.archived));
      if (params.sort) search.set("sort", params.sort);
      if (params.order) search.set("order", params.order);
      const qs = search.toString();
      return apiFetch<Note[]>(`/notes${qs ? `?${qs}` : ""}`);
    },

    create: (body: { title: string; content: string; tags?: string[] }) =>
      apiFetch<Note>("/notes", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    get: (id: string) => apiFetch<Note>(`/notes/${id}`),

    update: (
      id: string,
      body: {
        title?: string;
        content?: string;
        archived?: boolean;
        tags?: string[];
      },
    ) =>
      apiFetch<Note>(`/notes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),

    delete: (id: string) =>
      apiFetch<void>(`/notes/${id}`, { method: "DELETE" }),

    generateSummary: (id: string) =>
      apiFetch<AiStatusResponse>(`/notes/${id}/generate-summary`, {
        method: "POST",
      }),

    aiStatus: (id: string) =>
      apiFetch<AiStatusResponse>(`/notes/${id}/ai-status`),

    enableShare: (id: string) =>
      apiFetch<ShareResponse>(`/notes/${id}/share`, { method: "POST" }),

    disableShare: (id: string) =>
      apiFetch<void>(`/notes/${id}/share`, { method: "DELETE" }),

    getPublic: (shareId: string) =>
      apiFetch<Note>(`/shared/${shareId}`, { skipAuth: true }),
  },

  tags: {
    list: () => apiFetch<TagCount[]>("/tags"),
  },

  insights: {
    get: () => apiFetch<Insights>("/insights"),
  },
};

export { refreshSession };
