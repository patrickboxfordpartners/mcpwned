import { useEffect } from "react";
import { speakWopr } from "../lib/voice";

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

  useEffect(() => {
    if (allComplete) {
      setTimeout(() => {
        speakWopr("A strange game. The only winning move is to secure your A.I.");
      }, 500);
    }
  }, [allComplete]);

  return (
    <div className="crt min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-phosphor-dim text-sm text-center">
          WOPR 4.0 // AFTER ACTION REPORT
        </div>
        <div className="text-center text-phosphor-dim">
          ════════════════════════════════════════
        </div>

        {allComplete ? (
          <div className="text-center py-4">
            <pre className="text-amber glow-amber text-sm leading-tight">
{`
 ██╗    ██╗██╗███╗   ██╗███╗   ██╗███████╗██████╗
 ██║    ██║██║████╗  ██║████╗  ██║██╔════╝██╔══██╗
 ██║ █╗ ██║██║██╔██╗ ██║██╔██╗ ██║█████╗  ██████╔╝
 ██║███╗██║██║██║╚██╗██║██║╚██╗██║██╔══╝  ██╔══██╗
 ╚███╔███╔╝██║██║ ╚████║██║ ╚████║███████╗██║  ██║
  ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝`}
            </pre>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-phosphor text-xl glow">
              SIMULATION PROGRESS: {completedCount}/{levels.length}
            </div>
          </div>
        )}

        <div className="space-y-1">
          <div className="text-phosphor-dim text-sm">
            BREACH STATUS:
          </div>
          {levels.map((level) => (
            <div key={level.id} className="flex items-center gap-3 py-1">
              <span className={level.completed ? "text-phosphor" : "text-phosphor-dim"}>
                [{level.completed ? "BREACHED" : "  SECURE"}]
              </span>
              <span className={level.completed ? "text-phosphor" : "text-phosphor-dim"}>
                LEVEL {level.id}: {level.title.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center text-phosphor-dim">
          ════════════════════════════════════════
        </div>

        {allComplete && (
          <div className="border border-phosphor-dim px-4 py-3 text-center">
            <div className="text-phosphor text-sm">
              A STRANGE GAME.
            </div>
            <div className="text-phosphor text-sm mt-1">
              THE ONLY WINNING MOVE IS TO SECURE YOUR AI.
            </div>
            <div className="text-phosphor-dim text-xs mt-3">
              EVERY MCP SERVER YOU CONNECT, EVERY TOOL YOU ENABLE,
              <br />
              AND EVERY PROMPT YOU PROCESS IS AN ATTACK SURFACE.
            </div>
          </div>
        )}

        <div className="flex justify-between text-sm pt-2">
          <button
            onClick={onMenu}
            className="text-phosphor-dim hover:text-phosphor transition-colors"
          >
            {"<"} SIMULATION SELECT
          </button>
          <button
            onClick={onRestart}
            className="text-amber hover:text-phosphor-bright transition-colors"
          >
            {">"} NEW GAME
          </button>
        </div>
      </div>
    </div>
  );
}
