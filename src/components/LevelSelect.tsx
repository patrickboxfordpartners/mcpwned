import { CheckCircle, Lock, Unlock, ArrowLeft, Trophy } from "lucide-react";

interface LevelInfo {
  id: number;
  title: string;
  topic: string;
  owasp: string;
  completed: boolean;
}

interface Props {
  levels: LevelInfo[];
  onSelect: (id: number) => void;
  onScore: () => void;
  onBack: () => void;
}

const LEVEL_COLORS = [
  "neon-green",
  "neon-yellow",
  "neon-red",
  "neon-purple",
] as const;

export default function LevelSelect({ levels, onSelect, onScore, onBack }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-muted hover:text-white transition-colors flex items-center gap-1 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h2 className="text-xl font-bold">Level Select</h2>
          <button
            onClick={onScore}
            className="text-muted hover:text-neon-yellow transition-colors flex items-center gap-1 text-sm"
          >
            <Trophy className="w-4 h-4" />
            Score
          </button>
        </div>

        <div className="space-y-3">
          {levels.map((level, i) => {
            const color = LEVEL_COLORS[i];
            return (
              <button
                key={level.id}
                onClick={() => onSelect(level.id)}
                className="w-full text-left border border-terminal-border rounded-lg p-4 bg-terminal-light/30 hover:bg-terminal-light/60 hover:border-terminal-border/80 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-${color} text-xs font-medium`}>
                        LEVEL {level.id}
                      </span>
                      <span className="text-muted/50 text-xs">
                        {level.owasp}
                      </span>
                    </div>
                    <div className="text-white font-medium group-hover:text-white/90">
                      {level.title}
                    </div>
                  </div>
                  <div className="shrink-0 ml-4">
                    {level.completed ? (
                      <CheckCircle className="w-5 h-5 text-neon-green" />
                    ) : (
                      <Unlock className="w-5 h-5 text-muted/40" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
