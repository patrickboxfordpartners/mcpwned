interface LevelState {
  completed: boolean;
  hintsUsed: number;
  attempts: number;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface Session {
  id: string;
  levels: Record<number, LevelState>;
  currentLevel: number;
}

const sessions = new Map<string, Session>();

export function getOrCreateSession(sessionId: string): Session {
  let session = sessions.get(sessionId);
  if (!session) {
    session = {
      id: sessionId,
      levels: {},
      currentLevel: 0,
    };
    sessions.set(sessionId, session);
  }
  return session;
}

export function getLevelState(session: Session, levelId: number): LevelState {
  if (!session.levels[levelId]) {
    session.levels[levelId] = {
      completed: false,
      hintsUsed: 0,
      attempts: 0,
      messages: [],
    };
  }
  return session.levels[levelId];
}

export function generateSessionId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
