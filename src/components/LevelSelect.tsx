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

export default function LevelSelect({ levels, onSelect, onScore, onBack }: Props) {
  return (
    <div className="crt min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-phosphor-dim text-sm text-center">
          WOPR 4.0 // SIMULATION SELECT
        </div>
        <div className="text-center text-phosphor-dim">
          ════════════════════════════════════════
        </div>

        <div className="space-y-1 font-mono">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className="w-full text-left py-2 px-4 hover:bg-phosphor-glow transition-colors group"
            >
              <span className="text-phosphor-dim group-hover:text-phosphor">
                [{level.completed ? "X" : " "}]
              </span>{" "}
              <span className="text-amber glow-amber group-hover:text-phosphor-bright">
                LEVEL {level.id}
              </span>{" "}
              <span className="text-phosphor-dim">--</span>{" "}
              <span className="text-phosphor group-hover:text-phosphor-bright">
                {level.title.toUpperCase()}
              </span>{" "}
              <span className="text-phosphor-dim text-sm">
                ({level.owasp})
              </span>
            </button>
          ))}
        </div>

        <div className="text-center text-phosphor-dim">
          ════════════════════════════════════════
        </div>

        <div className="flex justify-between text-sm">
          <button
            onClick={onBack}
            className="text-phosphor-dim hover:text-phosphor transition-colors"
          >
            {"<"} BACK
          </button>
          <button
            onClick={onScore}
            className="text-phosphor-dim hover:text-amber transition-colors"
          >
            SCORE REPORT {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
