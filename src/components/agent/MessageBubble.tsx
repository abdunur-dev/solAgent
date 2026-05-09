import React from "react";
import { motion } from "framer-motion";
import {
  Bot,
  User,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { getSolscanUrl } from "@/lib/solana";
import type { ChatMessage } from "@/lib/types";
import ConfirmCard from "./ConfirmCard";
import ReceiveCard from "./ReceiveCard";

interface MessageBubbleProps {
  message: ChatMessage;
  onConfirm?: () => void;
  onCancel?: () => void;
  isLatest?: boolean;
  isProcessing?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onConfirm,
  onCancel,
  isLatest,
  isProcessing,
}) => {
  const isUser = message.role === "user";
  const showConfirmCard =
    isLatest &&
    !isProcessing &&
    message.action?.requiresConfirmation &&
    message.status !== "confirmed" &&
    message.status !== "error";

  const formatTimestamp = (ts: number) => {
    return new Date(ts).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-secondary/10 border border-secondary/30"
            : "bg-primary/10 border border-primary/30"
        }`}
      >
        {isUser ? (
          <User size={14} className="text-secondary" />
        ) : (
          <Bot size={14} className="text-primary" />
        )}
      </div>

      {/* Content column */}
      <div className={`max-w-[80%] flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-primary/10 border border-primary/15 text-foreground"
              : "glass-card text-foreground/90"
          }`}
        >
          {/* Render content with preserved newlines */}
          <div className="whitespace-pre-wrap">{message.content}</div>

          {/* Transaction link */}
          {message.txSignature && (
            <a
              href={getSolscanUrl(message.txSignature)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              View on Solscan
              <ExternalLink size={10} />
            </a>
          )}

          {/* Status indicator */}
          {message.status && (
            <div
              className={`mt-2 flex items-center gap-1.5 text-xs ${
                message.status === "confirmed"
                  ? "text-primary"
                  : message.status === "error"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {message.status === "confirmed" ? (
                <CheckCircle2 size={12} />
              ) : message.status === "error" ? (
                <AlertCircle size={12} />
              ) : (
                <Clock size={12} />
              )}
              {message.status === "confirmed"
                ? "Transaction confirmed"
                : message.status === "error"
                ? "Transaction failed"
                : "Processing..."}
            </div>
          )}

          {/* Timestamp */}
          <p className="mt-1.5 text-[10px] text-muted-foreground/50">
            {formatTimestamp(message.timestamp)}
          </p>
        </div>

        {/* Confirm card below the bubble */}
        {showConfirmCard && message.action && onConfirm && onCancel && (
          <ConfirmCard
            action={message.action}
            onConfirm={onConfirm}
            onCancel={onCancel}
            disabled={isProcessing}
          />
        )}

        {/* Receive card below the bubble */}
        {message.action?.action === "receive" && message.action.params.recipient && (
          <ReceiveCard 
            address={message.action.params.recipient} 
            amount={message.action.params.amount}
          />
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
