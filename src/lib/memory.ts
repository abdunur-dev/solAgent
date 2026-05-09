import type { StoredMessage } from "./types";

const MAX_MESSAGES = 50;
const STORAGE_PREFIX = "solAgent_chat_";

function getKey(walletAddress: string): string {
  return `${STORAGE_PREFIX}${walletAddress}`;
}

/** Load stored messages for a wallet from localStorage */
export function loadMessages(walletAddress: string): StoredMessage[] {
  try {
    const raw = localStorage.getItem(getKey(walletAddress));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(-MAX_MESSAGES) as StoredMessage[];
  } catch {
    return [];
  }
}

/** Save messages to localStorage for a wallet */
export function saveMessages(
  walletAddress: string,
  messages: StoredMessage[]
): void {
  try {
    const trimmed = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(getKey(walletAddress), JSON.stringify(trimmed));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

/** Append a single message and persist */
export function appendMessage(
  walletAddress: string,
  message: StoredMessage
): StoredMessage[] {
  const existing = loadMessages(walletAddress);
  const updated = [...existing, message].slice(-MAX_MESSAGES);
  saveMessages(walletAddress, updated);
  return updated;
}

/** Clear all chat history for a wallet */
export function clearMessages(walletAddress: string): void {
  try {
    localStorage.removeItem(getKey(walletAddress));
  } catch {
    // Silently fail
  }
}

/** Convert a ChatMessage to storable format */
export function toStored(msg: {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: number | Date;
  action?: StoredMessage["action"];
  txSignature?: string;
  status?: StoredMessage["status"];
}): StoredMessage {
  return {
    id: msg.id,
    role: msg.role,
    content: msg.content,
    timestamp:
      typeof msg.timestamp === "number"
        ? msg.timestamp
        : msg.timestamp.getTime(),
    action: msg.action,
    txSignature: msg.txSignature,
    status: msg.status,
  };
}
