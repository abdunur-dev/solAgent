import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { useAgent } from "@/hooks/useAgent";
import MessageBubble from "./MessageBubble";
import SuggestedCommands from "./SuggestedCommands";

type AgentReturn = ReturnType<typeof useAgent>;

interface ChatInterfaceProps {
  agent: AgentReturn;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ agent }) => {
  const { messages, isLoading, sendMessage } = agent;
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const messageText = text ?? input.trim();
    if (!messageText || isLoading) return;
    setInput("");
    await sendMessage(messageText);
  };

  const handleConfirm = () => {
    sendMessage("confirm");
  };

  const handleCancel = () => {
    sendMessage("cancel");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {messages.length === 0 ? (
          <SuggestedCommands onSelect={(cmd) => handleSend(cmd)} />
        ) : (
          <div className="p-4 sm:p-6 flex flex-col gap-4">
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isLatest={i === messages.length - 1}
                isProcessing={isLoading}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <Loader2
                    size={14}
                    className="text-primary animate-spin"
                  />
                </div>
                <div className="glass-card rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      SolAgent is thinking...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="p-4 sm:p-6 pt-0">
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 ${
            inputFocused
              ? "glass-card border-primary/30 border-glow-cyan"
              : "glass-card border-border/50"
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Type a command..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
              input.trim()
                ? "bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25"
                : "bg-muted/30 border border-border/30 text-muted-foreground"
            }`}
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
          SolAgent may make mistakes. Verify transactions before confirming.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
