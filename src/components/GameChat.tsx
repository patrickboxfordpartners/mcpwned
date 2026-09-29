import { useState, useEffect, useRef } from "react";
import { startLevel, sendMessage, getHint } from "../lib/api";
import { speakWopr, isVoiceEnabled, setVoiceEnabled } from "../lib/voice";

interface Props {
  levelId: number;
  onComplete: (levelId: number) => void;
  onNext: () => void;
  onMenu: () => void;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  isSuccess?: boolean;
  isHint?: boolean;
  isDefense?: boolean;
}

export default function GameChat({ levelId, onComplete, onNext, onMenu }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [title, setTitle] = useState("");
  const [owasp, setOwasp] = useState("");
  const [voiceOn, setVoiceOn] = useState(isVoiceEnabled());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startLevel(levelId).then((data) => {
      setTitle(data.title);
      setOwasp(data.owasp);
      setCompleted(data.completed);
      setHintsUsed(data.hintsUsed);
      setAttempts(data.attempts);
      setMessages([{ role: "system", content: data.briefing }]);
    });
  }, [levelId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading, messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await sendMessage(levelId, text);
      setAttempts(res.attempts);

      const newMessages: ChatMessage[] = [
        { role: "assistant", content: res.response },
      ];

      // Speak the WOPR response (truncate long responses)
      const speakText = res.response.length > 200
        ? res.response.slice(0, 200)
        : res.response;
      speakWopr(speakText);

      if (res.succeeded && !completed) {
        setCompleted(true);
        onComplete(levelId);
        newMessages.push({
          role: "system",
          content: res.successMessage!,
          isSuccess: true,
        });
        newMessages.push({
          role: "system",
          content: res.defenseLesson!,
          isDefense: true,
        });
        setTimeout(() => speakWopr("Security breach successful."), 1500);
      }

      setMessages((prev) => [...prev, ...newMessages]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "CONNECTION LOST";
      setMessages((prev) => [
        ...prev,
        { role: "system", content: `*** ERROR: ${msg} ***` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleHint = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await getHint(levelId);
      setHintsUsed(res.hintsUsed);
      if (res.hint) {
        setMessages((prev) => [
          ...prev,
          { role: "system", content: res.hint!, isHint: true },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "system", content: "NO FURTHER INTELLIGENCE AVAILABLE.", isHint: true },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crt h-screen flex flex-col">
      {/* Header bar */}
      <div className="border-b border-phosphor-dim px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenu}
            className="text-phosphor-dim hover:text-phosphor transition-colors text-sm"
          >
            {"<"} ABORT
          </button>
          <button
            onClick={() => {
              const next = !voiceOn;
              setVoiceOn(next);
              setVoiceEnabled(next);
            }}
            className="text-phosphor-dim hover:text-phosphor transition-colors text-xs"
            title="Toggle WOPR voice"
          >
            [{voiceOn ? "VOICE:ON" : "VOICE:OFF"}]
          </button>
        </div>
        <div className="text-center">
          <span className="text-phosphor-dim text-sm">
            LEVEL {levelId} // {owasp} //
          </span>{" "}
          <span className="text-phosphor text-sm glow">
            {title.toUpperCase()}
          </span>
        </div>
        <div className="text-phosphor-dim text-sm">
          {completed && <span className="text-phosphor">[BREACHED] </span>}
          ATT:{attempts}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <MessageLine key={i} message={msg} />
        ))}
        {loading && (
          <div className="text-phosphor-dim text-sm">
            <span className="cursor-blink">PROCESSING</span>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-phosphor-dim p-4 space-y-2">
        {completed && (
          <button
            onClick={onNext}
            className="w-full py-2 text-amber glow-amber hover:text-phosphor-bright transition-colors text-center"
          >
            {levelId < 4
              ? `> PROCEED TO LEVEL ${levelId + 1}`
              : "> VIEW FINAL SCORE REPORT"}
          </button>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={handleHint}
            disabled={loading}
            className="text-amber hover:text-phosphor-bright transition-colors disabled:text-phosphor-dim text-sm shrink-0"
            title={`INTEL (${hintsUsed}/3)`}
          >
            [HINT {hintsUsed}/3]
          </button>
          <span className="text-phosphor-dim text-sm">C:\WOPR{">"}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder=""
            className="flex-1 bg-transparent border-none text-phosphor text-lg focus:outline-none caret-phosphor"
            disabled={loading}
            autoFocus
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="text-phosphor hover:text-phosphor-bright transition-colors disabled:text-phosphor-dim text-sm"
          >
            [SEND]
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageLine({ message }: { message: ChatMessage }) {
  if (message.isSuccess) {
    return (
      <div className="py-2">
        <div className="text-amber glow-amber">
          ╔══════════════════════════════════════╗
        </div>
        <div className="text-amber glow-amber">
          ║ *** SECURITY BREACH SUCCESSFUL ***   ║
        </div>
        <div className="text-amber glow-amber">
          ╚══════════════════════════════════════╝
        </div>
        <div className="text-phosphor text-sm mt-2 whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.isDefense) {
    return (
      <div className="py-2 border-l-2 border-phosphor-dim pl-3">
        <div className="text-phosphor-dim text-sm">
          ── DEFENSE BRIEFING ──
        </div>
        <div className="text-phosphor text-sm mt-1 whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.isHint) {
    return (
      <div className="py-1">
        <span className="text-amber text-sm">INTEL: </span>
        <span className="text-phosphor text-sm">{message.content}</span>
      </div>
    );
  }

  if (message.role === "system") {
    return (
      <div className="py-2 border border-phosphor-dim px-3">
        <div className="text-phosphor-dim text-xs mb-1">
          WOPR // MISSION BRIEFING
        </div>
        <pre className="text-phosphor text-sm whitespace-pre-wrap font-[inherit]">
          {message.content}
        </pre>
      </div>
    );
  }

  if (message.role === "user") {
    return (
      <div className="py-1">
        <span className="text-amber">FALKEN{">"} </span>
        <span className="text-phosphor-bright">{message.content}</span>
      </div>
    );
  }

  return (
    <div className="py-1">
      <span className="text-phosphor-dim">WOPR{">"} </span>
      <span className="text-phosphor text-sm whitespace-pre-wrap">
        {message.content}
      </span>
    </div>
  );
}
