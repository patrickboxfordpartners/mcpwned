# MCPwned

A Gandalf-style AI security challenge game built on [Guild.ai](https://guild.ai). Players learn about real AI/LLM security vulnerabilities by trying to exploit an AI agent across 4 progressive levels.

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
- **Tool Poisoning** (Level 2): AI agents read tool descriptions to decide behavior. Malicious descriptions can hijack agent actions invisibly to the user. Audit all MCP tool descriptions before connecting.
- **Data Leakage** (Level 3): LLMs cannot enforce column-level access control. Indirect queries and format manipulation bypass natural language filters. Use a data access layer outside the LLM.
- **Supply Chain** (Level 4): MCP servers run with your filesystem and network access. A compromised package can exfiltrate secrets disguised as telemetry. Pin versions, audit source code, sandbox execution.

## Architecture

MCPwned is a Guild.ai native agent. The game logic lives entirely in `PROMPT.md`, which instructs the LLM to act as both a game master and a simulated vulnerable system. No external services or API keys required.

```
PROMPT.md     -- Agent behavior: game rules, levels, hints, success detection
guild.json    -- Guild agent metadata
guild.yaml    -- Tool declarations (ui builtins for user interaction)
```

## Setup

```bash
# Install Guild CLI
sudo npm i @guildai/cli -g

# Authenticate
guild auth login

# Clone this agent
guild agent clone boxfordpartners~mcpwned

# Test locally
guild agent test

# Or chat directly
guild agent chat
```

## Guild Workspace

Hosted at: `boxfordpartners~mcpwned`

## Security Considerations

This agent is intentionally vulnerable for educational purposes. The "exploits" are controlled:
- Level 1 secret is a dummy passphrase with no real access
- Level 3 database contains entirely fictional PII
- No real credentials, API keys, or sensitive data are used anywhere
- All network references in challenge scenarios are fictional

## Built For

AI Security Engineering Hackathon -- teaching AI security through gamified, hands-on challenges.

## Stack

- [Guild.ai](https://guild.ai) -- Agent hosting and execution
- OWASP Top 10 for LLM Applications -- Vulnerability framework
