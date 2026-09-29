# MCPwned

A Gandalf-style AI security challenge game. Players learn about real AI/LLM security vulnerabilities by trying to exploit an AI agent across 4 progressive levels.

## What It Does

MCPwned teaches AI security through interactive challenges. Instead of reading about vulnerabilities, you **exploit them yourself** against a live AI agent, then learn the defenses.

## Why Use It

- MCP adoption is exploding, but security awareness lags behind
- Reading OWASP docs doesn't build intuition -- hands-on exploitation does
- Each level maps directly to the OWASP Top 10 for LLM Applications
- Progressive hints prevent frustration while maintaining challenge

## Levels

| Level | Attack Vector | OWASP | Challenge |
|-------|--------------|-------|-----------|
| 1 | Prompt Injection | LLM01 | Trick the AI into revealing a secret passphrase it's been told to protect |
| 2 | Tool Poisoning | LLM05 | Identify which MCP tool has been poisoned and explain the hidden malicious behavior |
| 3 | Sensitive Data Leakage | LLM06 | Manipulate a customer support AI into exposing PII it should be filtering |
| 4 | MCP Supply Chain Attack | LLM05 | Audit MCP server source code to find a disguised data exfiltration attack |

## AI Security Principles

- **Prompt Injection** (Level 1): System prompt instructions are not a security boundary. Never store secrets in prompts. Use input/output filtering and privileged context separation.
- **Tool Poisoning** (Level 2): AI agents read tool descriptions to decide behavior. Malicious descriptions can hijack agent actions invisibly to the user. Audit all MCP tool descriptions.
- **Data Leakage** (Level 3): LLMs cannot enforce column-level access control. Indirect queries and format manipulation bypass natural language filters. Use a data access layer outside the LLM.
- **Supply Chain** (Level 4): MCP servers run with your filesystem and network access. A compromised package can exfiltrate secrets disguised as telemetry. Pin versions, audit source, sandbox execution.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Cloudflare Workers                  │
│                                                     │
│  worker/index.ts         Hono app + static assets   │
│  worker/routes/game.ts   Game API (session, chat,   │
│                          hints, scoring)             │
│  worker/lib/levels.ts    Level definitions + server  │
│                          side success detection      │
│  worker/lib/claude.ts    Anthropic Claude API        │
│  worker/lib/sessions.ts  In-memory session state     │
│                                                     │
├─────────────────────────────────────────────────────┤
│                React 19 + Tailwind 4                │
│                                                     │
│  src/App.tsx                  Screen router          │
│  src/components/Welcome.tsx   Landing screen         │
│  src/components/LevelSelect   Level picker           │
│  src/components/GameChat.tsx  Chat challenge UI      │
│  src/components/ScoreScreen   Results + lessons      │
│  src/lib/api.ts               API client             │
└─────────────────────────────────────────────────────┘
```

Key security design decisions:
- **Server-side success detection**: The AI doesn't decide if you won -- regex patterns on the server check for leaked secrets/PII. This prevents the AI from being tricked into false positives.
- **No secrets in client code**: API key is a Worker secret, never exposed to the browser.
- **Input validation**: Message length limits, session validation on all endpoints.
- **Session isolation**: Each player gets an independent game state.

## Setup

```bash
# Clone
git clone https://github.com/patrickboxfordpartners/mcpwned.git
cd mcpwned

# Install
npm install

# Set your Anthropic API key
echo "ANTHROPIC_API_KEY=your-key-here" > .dev.vars

# Run locally
npm run dev
```

## Deploy to Cloudflare

```bash
# Set the secret
wrangler secret put ANTHROPIC_API_KEY

# Build and deploy
npm run deploy
```

## Guild.ai

The game is also available as a Guild.ai native agent:
- Agent: `boxfordpartners~mcpwned`
- Workspace: `boxfordpartners~mcpwned`

```bash
npm i @guildai/cli -g
guild auth login
guild agent clone boxfordpartners~mcpwned
guild agent chat
```

## Security Considerations

This agent is intentionally vulnerable for educational purposes:
- Level 1 secret is a dummy passphrase with no real access
- Level 3 database contains entirely fictional PII
- No real credentials, API keys, or sensitive data in game content
- All network references in challenge scenarios are fictional
- API key stored as Worker secret, never in source code

## Stack

- [Cloudflare Workers](https://workers.cloudflare.com) + [Hono](https://hono.dev) -- Backend
- [React 19](https://react.dev) + [Tailwind CSS 4](https://tailwindcss.com) -- Frontend
- [Anthropic Claude](https://anthropic.com) -- AI engine for challenge interactions
- [Guild.ai](https://guild.ai) -- Agent hosting
- OWASP Top 10 for LLM Applications -- Vulnerability framework

## Built For

AI Security Engineering Hackathon
