import { Shield, Terminal, Zap } from "lucide-react";

interface Props {
  onStart: () => void;
  onMenu: () => void;
}

export default function Welcome({ onStart, onMenu }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-2">
          <div className="text-neon-green text-sm tracking-[0.3em] uppercase">
            AI Security Challenge
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            <span className="text-white">MCP</span>
            <span className="text-neon-red">wned</span>
          </h1>
          <p className="text-muted text-sm">
            Can you hack an AI agent?
          </p>
        </div>

        <div className="border border-terminal-border rounded-lg p-6 bg-terminal-light/50 text-left space-y-3">
          <div className="flex items-start gap-3">
            <Terminal className="w-4 h-4 text-neon-green mt-0.5 shrink-0" />
            <p className="text-sm text-slate-300">
              4 levels. 4 real attack vectors from the OWASP Top 10 for LLM
              Applications.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-4 h-4 text-neon-yellow mt-0.5 shrink-0" />
            <p className="text-sm text-slate-300">
              Exploit a live AI agent, then learn the defenses.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-neon-blue mt-0.5 shrink-0" />
            <p className="text-sm text-slate-300">
              Prompt injection, tool poisoning, data leakage, and supply chain
              attacks.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onStart}
            className="w-full py-3 px-6 bg-neon-green/10 border border-neon-green/30 rounded-lg text-neon-green font-medium hover:bg-neon-green/20 hover:border-neon-green/50 transition-all"
          >
            Start Level 1
          </button>
          <button
            onClick={onMenu}
            className="w-full py-2 px-6 text-muted text-sm hover:text-white transition-colors"
          >
            Level Select
          </button>
        </div>

        <p className="text-xs text-muted/50">
          Built for the AI Security Engineering Hackathon
        </p>
      </div>
    </div>
  );
}
