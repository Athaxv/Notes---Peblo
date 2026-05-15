export type User = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
};

export type Note = {
  id: string;
  note_id?: string;
  title: string;
  content: string;
  archived: boolean;
  isPublic: boolean;
  publicShareId: string | null;
  aiSummary: string | null;
  aiActionItems: string[] | null;
  aiGeneratedAt: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  updated_at?: string;
};

export type TagCount = {
  name: string;
  count: number;
};

export type Insights = {
  totalNotes: number;
  recentlyEdited: Note[];
  mostUsedTags: TagCount[];
  aiUsage: {
    notesWithAi: number;
    percentWithAi: number;
  };
  weeklyActivity: {
    week: string;
    notesCreated: number;
    notesUpdated: number;
  }[];
};

export type AiStatusResponse = {
  status: "idle" | "processing" | "done" | "failed";
  note: Note;
};

export type AuthResponse = {
  accessToken: string;
  user: User | null;
};

export type ShareResponse = {
  publicShareId: string;
  shareUrl: string;
};

export type NotesListParams = {
  q?: string;
  tag?: string;
  archived?: boolean;
  sort?: "updatedAt" | "createdAt" | "title";
  order?: "asc" | "desc";
};

export type ApiError = {
  message: string;
};
