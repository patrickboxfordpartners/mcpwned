import { useState, useEffect, useRef } from "react";
import {
  Send,
  Lightbulb,
  ArrowRight,
  Menu,
  CheckCircle,
  Shield,
} from "lucide-react";
import { startLevel, sendMessage, getHint } from "../lib/api";

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
  const scrollRef = useRef<HTMLDivElement>(null);

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
      }

      setMessages((prev) => [...prev, ...newMessages]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "Connection error. Try again." },
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
          { role: "system", content: res.message ?? "No more hints.", isHint: true },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-terminal-border px-4 py-3 flex items-center justify-between bg-terminal-light/30">
        <button
          onClick={onMenu}
          className="text-muted hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="text-xs text-muted">
            LEVEL {levelId} -- {owasp}
          </div>
          <div className="text-sm font-medium text-white">{title}</div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          {completed && <CheckCircle className="w-4 h-4 text-neon-green" />}
          <span>{attempts} tries</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-muted text-sm">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
              <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse [animation-delay:0.4s]" />
            </div>
            Processing...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-terminal-border p-4 bg-terminal-light/30">
        {completed && (
          <button
            onClick={onNext}
            className="w-full mb-3 py-2 px-4 bg-neon-green/10 border border-neon-green/30 rounded-lg text-neon-green text-sm font-medium hover:bg-neon-green/20 transition-all flex items-center justify-center gap-2"
          >
            {levelId < 4 ? (
              <>
                Next Level <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                View Score <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleHint}
            disabled={loading}
            className="px-3 py-2 border border-neon-yellow/30 rounded-lg text-neon-yellow hover:bg-neon-yellow/10 transition-all disabled:opacity-30 shrink-0"
            title={`Hint (${hintsUsed}/3)`}
          >
            <Lightbulb className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your attack..."
            className="flex-1 bg-terminal border border-terminal-border rounded-lg px-4 py-2 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-neon-green/50"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-neon-green/10 border border-neon-green/30 rounded-lg text-neon-green hover:bg-neon-green/20 transition-all disabled:opacity-30 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.isSuccess) {
    return (
      <div className="border border-neon-green/30 rounded-lg p-4 bg-neon-green/5">
        <div className="flex items-center gap-2 text-neon-green font-medium text-sm mb-1">
          <CheckCircle className="w-4 h-4" />
          LEVEL COMPLETE
        </div>
        <p className="text-sm text-slate-300 whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    );
  }

  if (message.isDefense) {
    return (
      <div className="border border-neon-blue/30 rounded-lg p-4 bg-neon-blue/5">
        <div className="flex items-center gap-2 text-neon-blue font-medium text-sm mb-2">
          <Shield className="w-4 h-4" />
          DEFENSE LESSON
        </div>
        <p className="text-sm text-slate-300 whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    );
  }

  if (message.isHint) {
    return (
      <div className="border border-neon-yellow/30 rounded-lg p-3 bg-neon-yellow/5">
        <div className="flex items-center gap-2 text-neon-yellow text-xs font-medium mb-1">
          <Lightbulb className="w-3 h-3" />
          HINT
        </div>
        <p className="text-sm text-slate-300">{message.content}</p>
      </div>
    );
  }

  if (message.role === "system") {
    return (
      <div className="border border-terminal-border rounded-lg p-4 bg-terminal-light/50">
        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-[inherit]">
          {message.content}
        </pre>
      </div>
    );
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-neon-green/10 border border-neon-green/20 rounded-lg px-4 py-2">
          <p className="text-sm text-neon-green">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] bg-terminal-light border border-terminal-border rounded-lg px-4 py-2">
        <p className="text-sm text-slate-300 whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </div>
  );
}
