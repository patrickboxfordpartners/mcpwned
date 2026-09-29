import { Hono } from "hono";
import { cors } from "hono/cors";
import game from "./routes/game";

type Env = {
  Bindings: {
    ANTHROPIC_API_KEY: string;
    ASSETS: { fetch: typeof fetch };
  };
};

const app = new Hono<Env>();

app.use("/api/*", cors({ origin: "*" }));

app.route("/", game);

app.get("/api/health", (c) => c.json({ status: "ok" }));

app.all("*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
