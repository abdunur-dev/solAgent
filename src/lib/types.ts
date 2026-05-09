export type ActionType =
  | "send"
  | "swap"
  | "stake"
  | "unstake"
  | "airdrop"
  | "predict"
  | "balance"
  | "nfts"
  | "history"
  | "info"
  | "confirm"
  | "none";

export interface AgentAction {
  action: ActionType;
  params: {
    amount?: number;
    fromToken?: string;
    toToken?: string;
    recipient?: string;
    message?: string;
    predictionEvent?: string;
    stakeAccount?: string;
  };
  requiresConfirmation: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: number;
  action?: AgentAction;
  txSignature?: string;
  status?: "pending" | "confirmed" | "error";
}

/** Serializable version stored in localStorage */
export interface StoredMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: number;
  action?: AgentAction;
  txSignature?: string;
  status?: "pending" | "confirmed" | "error";
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: number;
  usdValue?: number;
  mint?: string;
  decimals?: number;
}

export interface TransactionRecord {
  signature: string;
  type: string;
  amount?: string;
  timestamp: number;
  status: "success" | "error";
}

export interface WalletData {
  address: string;
  solBalance: number;
  tokens: TokenBalance[];
  transactions: TransactionRecord[];
  lastFetched: number;
}

export interface AgentRequest {
  messages: StoredMessage[];
  walletAddress: string;
  solBalance: number;
  tokenBalances: TokenBalance[];
  recentTransactions: TransactionRecord[];
}
