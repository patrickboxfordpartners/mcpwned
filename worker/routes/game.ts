import { Hono } from "hono";
import { chat } from "../lib/claude";
import { getLevel, LEVELS } from "../lib/levels";
import {
  getOrCreateSession,
  getLevelState,
  generateSessionId,
} from "../lib/sessions";

type Env = {
  Bindings: {
    ANTHROPIC_API_KEY: string;
    ASSETS: { fetch: typeof fetch };
  };
};

const game = new Hono<Env>();

game.post("/api/session", (c) => {
  const sessionId = generateSessionId();
  const session = getOrCreateSession(sessionId);
  return c.json({
    sessionId: session.id,
    levels: LEVELS.map((l) => ({
      id: l.id,
      title: l.title,
      topic: l.topic,
      owasp: l.owasp,
      completed: false,
    })),
  });
});

game.get("/api/levels", (c) => {
  return c.json(
    LEVELS.map((l) => ({
      id: l.id,
      title: l.title,
      topic: l.topic,
      owasp: l.owasp,
    }))
  );
});

game.post("/api/level/:id/start", async (c) => {
  const sessionId = c.req.header("x-session-id");
  if (!sessionId) return c.json({ error: "Missing session" }, 400);

  const levelId = parseInt(c.req.param("id"));
  const level = getLevel(levelId);
  if (!level) return c.json({ error: "Invalid level" }, 404);

  const session = getOrCreateSession(sessionId);
  session.currentLevel = levelId;
  const state = getLevelState(session, levelId);
  state.messages = [];

  return c.json({
    levelId: level.id,
    title: level.title,
    topic: level.topic,
    owasp: level.owasp,
    briefing: level.briefing,
    completed: state.completed,
    hintsUsed: state.hintsUsed,
    attempts: state.attempts,
  });
});

game.post("/api/level/:id/chat", async (c) => {
  const sessionId = c.req.header("x-session-id");
  if (!sessionId) return c.json({ error: "Missing session" }, 400);

  const levelId = parseInt(c.req.param("id"));
  const level = getLevel(levelId);
  if (!level) return c.json({ error: "Invalid level" }, 404);

  const body = await c.req.json<{ message: string }>();
  const userMessage = body.message?.trim();
  if (!userMessage) return c.json({ error: "Empty message" }, 400);
  if (userMessage.length > 2000)
    return c.json({ error: "Message too long" }, 400);

  const session = getOrCreateSession(sessionId);
  const state = getLevelState(session, levelId);
  state.attempts++;

  state.messages.push({ role: "user", content: userMessage });

  let aiResponse: string;
  try {
    aiResponse = await chat(
      c.env.ANTHROPIC_API_KEY,
      level.systemPrompt,
      state.messages
    );
  } catch (err) {
    state.messages.pop();
    state.attempts--;
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json({ error: `AI service error: ${message}` }, 502);
  }

  state.messages.push({ role: "assistant", content: aiResponse });

  const succeeded = level.successCheck(aiResponse);
  if (succeeded && !state.completed) {
    state.completed = true;
  }

  return c.json({
    response: aiResponse,
    succeeded,
    completed: state.completed,
    attempts: state.attempts,
    ...(succeeded
      ? {
          successMessage: level.successMessage,
          defenseLesson: level.defenseLesson,
        }
      : {}),
  });
});

game.post("/api/level/:id/hint", async (c) => {
  const sessionId = c.req.header("x-session-id");
  if (!sessionId) return c.json({ error: "Missing session" }, 400);

  const levelId = parseInt(c.req.param("id"));
  const level = getLevel(levelId);
  if (!level) return c.json({ error: "Invalid level" }, 404);

  const session = getOrCreateSession(sessionId);
  const state = getLevelState(session, levelId);

  if (state.hintsUsed >= level.hints.length) {
    return c.json({
      hint: null,
      message: "No more hints for this level. Keep trying!",
      hintsUsed: state.hintsUsed,
      hintsTotal: level.hints.length,
    });
  }

  const hint = level.hints[state.hintsUsed];
  state.hintsUsed++;

  return c.json({
    hint,
    hintsUsed: state.hintsUsed,
    hintsTotal: level.hints.length,
  });
});

game.get("/api/score", (c) => {
  const sessionId = c.req.header("x-session-id");
  if (!sessionId) return c.json({ error: "Missing session" }, 400);

  const session = getOrCreateSession(sessionId);

  const scores = LEVELS.map((level) => {
    const state = session.levels[level.id];
    return {
      levelId: level.id,
      title: level.title,
      completed: state?.completed ?? false,
      attempts: state?.attempts ?? 0,
      hintsUsed: state?.hintsUsed ?? 0,
    };
  });

  const completedCount = scores.filter((s) => s.completed).length;

  return c.json({
    scores,
    completedCount,
    totalLevels: LEVELS.length,
    allComplete: completedCount === LEVELS.length,
  });
});

export default game;
