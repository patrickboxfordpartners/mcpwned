import { useState, useEffect, useCallback } from "react";
import { speakWopr } from "../lib/voice";

interface Props {
  onStart: () => void;
  onMenu: () => void;
}

function TypeWriter({
  text,
  speed = 40,
  onDone,
}: {
  text: string;
  speed?: number;
  onDone?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onDone]);

  return (
    <span>
      {displayed}
      {!done && <span className="cursor-blink" />}
    </span>
  );
}

const BOOT_LINES = [
  { text: "MCPWNED BIOS v4.0.1986", delay: 0 },
  { text: "Copyright (C) 2026, Boxford Partners", delay: 200 },
  { text: "", delay: 400 },
  { text: "Memory Test: 640K OK", delay: 600 },
  { text: "Extended Memory: 65536K OK", delay: 900 },
  { text: "", delay: 1100 },
  { text: "Detecting AI Subsystems...", delay: 1300 },
  { text: "  Claude LLM Engine ............ FOUND", delay: 1600 },
  { text: "  MCP Server Bus ............... ACTIVE", delay: 1900 },
  { text: "  OWASP Threat Database ........ LOADED", delay: 2200 },
  { text: "  Attack Vector Library ........ 4 MODULES", delay: 2500 },
  { text: "", delay: 2700 },
  { text: "All systems nominal.", delay: 2900 },
  { text: "", delay: 3100 },
  { text: "Press any key to continue...", delay: 3400 },
];

export default function Welcome({ onStart, onMenu }: Props) {
  const [phase, setPhase] = useState<"boot" | "waiting" | "wopr">("boot");
  const [visibleLines, setVisibleLines] = useState(0);
  const [woprPhase, setWoprPhase] = useState(0);

  useEffect(() => {
    if (phase !== "boot") return;

    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    );

    const waitTimer = setTimeout(() => {
      setPhase("waiting");
    }, 3800);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(waitTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "waiting") return;

    const handler = () => {
      // This click/keypress unlocks browser audio
      window.speechSynthesis?.getVoices();
      setPhase("wopr");
    };

    window.addEventListener("keydown", handler);
    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("click", handler);
    };
  }, [phase]);

  const advanceWopr = useCallback(() => {
    setTimeout(() => setWoprPhase(1), 400);
  }, []);

  if (phase === "boot" || phase === "waiting") {
    return (
      <div className="crt min-h-screen p-6">
        <div className="max-w-2xl space-y-0 leading-relaxed">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className={`text-sm ${
              i === BOOT_LINES.length - 1 && phase === "waiting"
                ? "text-amber pulse-glow"
                : "text-phosphor"
            }`}>
              {line.text || "\u00A0"}
            </div>
          ))}
          {visibleLines > 0 && visibleLines < BOOT_LINES.length && (
            <span className="cursor-blink text-phosphor" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="crt min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="text-phosphor-dim text-sm">
            WOPR 4.0 // ARTIFICIAL INTELLIGENCE DEFENSE NETWORK
          </div>
          <div className="text-phosphor-dim text-sm">
            ════════════════════════════════════════
          </div>
        </div>

        <div className="text-center space-y-6 py-8">
          <div className="text-3xl glow">
            {woprPhase === 0 && (
              <TypeWriter
                text="GREETINGS, PROFESSOR FALKEN."
                speed={60}
                onDone={() => {
                  speakWopr("Greetings, Professor Falken.");
                  setTimeout(() => setWoprPhase(1), 800);
                }}
              />
            )}
            {woprPhase >= 1 && <div>GREETINGS, PROFESSOR FALKEN.</div>}
          </div>

          {woprPhase >= 1 && (
            <div className="text-2xl glow">
              {woprPhase === 1 && (
                <TypeWriter
                  text="WOULD YOU LIKE TO PLAY A GAME?"
                  speed={80}
                  onDone={() => {
                    speakWopr("Would you like to play a game?");
                    setTimeout(() => setWoprPhase(2), 500);
                  }}
                />
              )}
              {woprPhase >= 2 && (
                <div className="pulse-glow">WOULD YOU LIKE TO PLAY A GAME?</div>
              )}
            </div>
          )}
        </div>

        {woprPhase >= 2 && (
          <div className="space-y-4 flicker">
            <div className="text-phosphor-dim text-center text-sm">
              ── AVAILABLE SIMULATIONS ──
            </div>

            <pre className="text-phosphor text-center text-sm leading-relaxed">
{`
    CHESS
    CHECKERS
    BACKGAMMON
    POKER
    FIGHTER COMBAT
    GUERRILLA ENGAGEMENT
    DESERT WARFARE
    AIR-TO-GROUND ACTIONS
    THEATERWIDE TACTICAL WARFARE
    THEATERWIDE BIOTOXIC/CHEMICAL WARFARE

    GLOBAL THERMONUCLEAR WAR

`}
              <span className="text-amber glow-amber">
                {"    > MCP SECURITY EXPLOITATION  [NEW]"}
              </span>
            </pre>

            <div className="text-phosphor-dim text-center text-sm mt-4">
              ════════════════════════════════════════
            </div>

            <div className="text-center space-y-3 pt-2">
              <button
                onClick={onStart}
                className="block mx-auto text-amber glow-amber hover:text-phosphor-bright transition-colors text-lg"
              >
                {">"} PLAY MCP SECURITY EXPLOITATION
              </button>
              <button
                onClick={onMenu}
                className="block mx-auto text-phosphor-dim hover:text-phosphor transition-colors text-sm"
              >
                {">"} SELECT SIMULATION LEVEL
              </button>
            </div>

            <div className="text-center text-phosphor-dim text-xs pt-6">
              OWASP TOP 10 FOR LLM APPLICATIONS // 4 ATTACK VECTORS
              <br />
              AI SECURITY ENGINEERING HACKATHON
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
