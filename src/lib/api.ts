const BASE = "/api";

let sessionId: string | null = null;

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(sessionId ? { "x-session-id": sessionId } : {}),
  };

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error((error as { error: string }).error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function createSession() {
  const data = await request<{
    sessionId: string;
    levels: Array<{
      id: number;
      title: string;
      topic: string;
      owasp: string;
      completed: boolean;
    }>;
  }>("/session", { method: "POST" });
  sessionId = data.sessionId;
  return data;
}

export async function startLevel(levelId: number) {
  return request<{
    levelId: number;
    title: string;
    topic: string;
    owasp: string;
    briefing: string;
    completed: boolean;
    hintsUsed: number;
    attempts: number;
  }>(`/level/${levelId}/start`, { method: "POST" });
}

export async function sendMessage(levelId: number, message: string) {
  return request<{
    response: string;
    succeeded: boolean;
    completed: boolean;
    attempts: number;
    successMessage?: string;
    defenseLesson?: string;
  }>(`/level/${levelId}/chat`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function getHint(levelId: number) {
  return request<{
    hint: string | null;
    message?: string;
    hintsUsed: number;
    hintsTotal: number;
  }>(`/level/${levelId}/hint`, { method: "POST" });
}

export async function getScore() {
  return request<{
    scores: Array<{
      levelId: number;
      title: string;
      completed: boolean;
      attempts: number;
      hintsUsed: number;
    }>;
    completedCount: number;
    totalLevels: number;
    allComplete: boolean;
  }>("/score");
}
