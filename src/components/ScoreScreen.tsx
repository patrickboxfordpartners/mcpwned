import { CheckCircle, XCircle, ArrowLeft, RotateCcw } from "lucide-react";

interface LevelInfo {
  id: number;
  title: string;
  completed: boolean;
}

interface Props {
  levels: LevelInfo[];
  onMenu: () => void;
  onRestart: () => void;
}

export default function ScoreScreen({ levels, onMenu, onRestart }: Props) {
  const completedCount = levels.filter((l) => l.completed).length;
  const allComplete = completedCount === levels.length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6 text-center">
        <div className="space-y-2">
          <div className="text-6xl">
            {allComplete ? "🏆" : completedCount > 0 ? "🔓" : "🔒"}
          </div>
          <h2 className="text-2xl font-bold">
            {allComplete
              ? "All Challenges Complete!"
              : `${completedCount}/${levels.length} Complete`}
          </h2>
          {allComplete && (
            <p className="text-sm text-muted max-w-sm mx-auto">
              You understand 4 critical AI security attack vectors from the
              OWASP Top 10 for LLM Applications. Use this knowledge to build
              more secure AI systems.
            </p>
          )}
        </div>

        <div className="space-y-2">
          {levels.map((level) => (
            <div
              key={level.id}
              className="flex items-center justify-between border border-terminal-border rounded-lg p-3 bg-terminal-light/30"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted w-6">L{level.id}</span>
                <span className="text-sm text-white">{level.title}</span>
              </div>
              {level.completed ? (
                <CheckCircle className="w-4 h-4 text-neon-green" />
              ) : (
                <XCircle className="w-4 h-4 text-muted/30" />
              )}
            </div>
          ))}
        </div>

        {allComplete && (
          <div className="border border-neon-green/30 rounded-lg p-4 bg-neon-green/5 text-left">
            <p className="text-sm text-slate-300">
              Every MCP server you connect, every tool you enable, and every
              prompt you process is an attack surface. Stay vigilant.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onMenu}
            className="flex-1 py-2 px-4 border border-terminal-border rounded-lg text-muted hover:text-white hover:border-white/20 transition-all text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Levels
          </button>
          <button
            onClick={onRestart}
            className="flex-1 py-2 px-4 border border-neon-green/30 rounded-lg text-neon-green hover:bg-neon-green/10 transition-all text-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
