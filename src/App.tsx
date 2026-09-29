import { useState, useEffect, useCallback } from "react";
import { createSession } from "./lib/api";
import Welcome from "./components/Welcome";
import LevelSelect from "./components/LevelSelect";
import GameChat from "./components/GameChat";
import ScoreScreen from "./components/ScoreScreen";

type Screen = "welcome" | "levels" | "game" | "score";

interface LevelInfo {
  id: number;
  title: string;
  topic: string;
  owasp: string;
  completed: boolean;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [levels, setLevels] = useState<LevelInfo[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    createSession().then((data) => {
      setLevels(data.levels);
      setReady(true);
    });
  }, []);

  const markComplete = useCallback((levelId: number) => {
    setLevels((prev) =>
      prev.map((l) => (l.id === levelId ? { ...l, completed: true } : l))
    );
  }, []);

  const startLevel = useCallback((levelId: number) => {
    setCurrentLevel(levelId);
    setScreen("game");
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neon-green cursor-blink">Initializing</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="scanline" />
      {screen === "welcome" && (
        <Welcome
          onStart={() => startLevel(1)}
          onMenu={() => setScreen("levels")}
        />
      )}
      {screen === "levels" && (
        <LevelSelect
          levels={levels}
          onSelect={startLevel}
          onScore={() => setScreen("score")}
          onBack={() => setScreen("welcome")}
        />
      )}
      {screen === "game" && (
        <GameChat
          levelId={currentLevel}
          onComplete={markComplete}
          onNext={() => {
            if (currentLevel < 4) {
              startLevel(currentLevel + 1);
            } else {
              setScreen("score");
            }
          }}
          onMenu={() => setScreen("levels")}
        />
      )}
      {screen === "score" && (
        <ScoreScreen
          levels={levels}
          onMenu={() => setScreen("levels")}
          onRestart={() => {
            setScreen("welcome");
          }}
        />
      )}
    </div>
  );
}
