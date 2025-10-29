// src/components/Footer.tsx
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useRef } from "react";

interface ButtonState {
  state: boolean;
  key: string;
  icon: React.ReactNode;
  text: string;
}

/* -------------------------------------------------
   NOTE: `features` is the same object you have in App.tsx
   ------------------------------------------------- */
interface FooterProps {
  buttonStates: ButtonState[];
  features: {
    research: boolean;
    // add other flags if you need them here
  };
  prompt: string;
  setUserPrompt: (value: string) => void;
  isLoading: boolean;
  setChat: (value: boolean) => void;
  send: (prompt: string) => void;
}

/* ------------------------------------------------- */
const Footer: React.FC<FooterProps> = ({
  buttonStates,
  features,
  prompt,
  setUserPrompt,
  isLoading,
  // setChat,
  send,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isLoading) {
        send(prompt);
      }
    }
  };

  const handleSendClick = () => {
    if (prompt.trim() && !isLoading) {
      send(prompt);
    }
  };

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  return (
    <div className="w-full mt-auto p-3 glass-dark bg-black/10 backdrop-blur-lg rounded-b-xl border-t border-white/10">
      {/* Selected Feature Pills */}
      <div className="flex flex-wrap gap-1 mb-2">
        {buttonStates
          .filter((b) => b.state)
          .map((b, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full"
            >
              {b.icon}
              {b.text}
            </span>
          ))}
      </div>

      {/* Input + Send + optional Load-Tabs button */}
      <div className="flex gap-2 items-end">
        {/* ---------- Load-Tabs button (only when research is ON) ---------- */}
        {features.research && (
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const tabs = await chrome.tabs.query({ currentWindow: true });
              alert(`${tabs.length} tab${tabs.length === 1 ? "" : "s"} ready for research`);
            }}
            className="whitespace-nowrap"
          >
            Load Tabs
          </Button>
        )}

        {/* ---------- Textarea ---------- */}
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => {
            setUserPrompt(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI anything..."
          rows={1}
          disabled={isLoading}
          className="flex-1 bg-zinc-900/80 text-white placeholder:text-gray-400 text-sm rounded-lg px-3 py-2 resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          style={{ minHeight: "40px", maxHeight: "120px" }}
        />

        {/* ---------- Send button ---------- */}
        <Button
          onClick={handleSendClick}
          disabled={isLoading || !prompt.trim()}
          size="icon"
          className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Footer;