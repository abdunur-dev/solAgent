import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  LogOut,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  shortenAddress,
  getSolscanUrl,
  getSolscanAddressUrl,
} from "@/lib/solana";
import type { useWalletData } from "@/hooks/useWalletData";

type WalletDataReturn = ReturnType<typeof useWalletData>;

interface AgentSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  walletData: WalletDataReturn;
  onClearHistory: () => void;
  messageCount: number;
}

const AgentSidebar: React.FC<AgentSidebarProps> = ({
  collapsed,
  onToggle,
  walletData,
  onClearHistory,
  messageCount,
}) => {
  const { disconnect } = useWallet();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const {
    address,
    solBalance,
    tokens,
    transactions,
    loading,
    refreshing,
    refresh,
  } = walletData;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = () => {
    disconnect();
    navigate("/app");
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts * 1000);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 320 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative h-full border-r border-border/40 glass-card flex flex-col overflow-hidden flex-shrink-0"
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute top-4 -right-0 z-10 w-7 h-7 rounded-l-lg bg-muted/50 border border-border/50 border-r-0 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full p-4 gap-4 overflow-y-auto min-w-[304px]"
          >
            {/* Wallet address */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wallet size={14} className="text-primary" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Wallet
                  </span>
                </div>
                <a
                  href={getSolscanAddressUrl(address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink size={11} />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-foreground">
                  {shortenAddress(address, 6)}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {copied ? (
                    <Check size={12} className="text-primary" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </div>
            </div>

            {/* SOL Balance */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  SOL Balance
                </p>
                <button
                  onClick={refresh}
                  disabled={refreshing}
                  className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    size={12}
                    className={refreshing ? "animate-spin" : ""}
                  />
                </button>
              </div>
              {loading ? (
                <div className="h-7 w-24 rounded bg-muted/40 animate-pulse" />
              ) : (
                <p className="text-xl font-bold text-foreground">
                  {solBalance.toFixed(4)}{" "}
                  <span className="text-sm text-primary font-medium">SOL</span>
                </p>
              )}
            </div>

            {/* Token Balances */}
            <div>
              <p className="text-xs text-muted-foreground mb-2.5 uppercase tracking-wider font-medium px-1">
                Tokens
              </p>
              <div className="flex flex-col gap-2">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-12 rounded-xl bg-muted/20 animate-pulse"
                      />
                    ))
                  : tokens.slice(0, 5).map((token) => (
                      <div
                        key={token.symbol}
                        className="glass-card rounded-xl px-4 py-2.5 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {token.symbol}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {token.name}
                          </p>
                        </div>
                        <p className="text-sm font-mono text-foreground">
                          {token.balance >= 1_000_000
                            ? `${(token.balance / 1_000_000).toFixed(1)}M`
                            : token.balance >= 1_000
                            ? `${(token.balance / 1_000).toFixed(1)}K`
                            : token.balance.toFixed(2)}
                        </p>
                      </div>
                    ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="flex-1 min-h-0">
              <p className="text-xs text-muted-foreground mb-2.5 uppercase tracking-wider font-medium px-1">
                Recent Transactions
              </p>
              <div className="flex flex-col gap-2">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-10 rounded-xl bg-muted/20 animate-pulse"
                    />
                  ))
                ) : transactions.length > 0 ? (
                  transactions.slice(0, 5).map((tx) => (
                    <a
                      key={tx.signature}
                      href={getSolscanUrl(tx.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card rounded-xl px-3 py-2.5 flex items-center gap-2 hover:border-primary/20 transition-all group"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          tx.status === "success"
                            ? "bg-primary"
                            : "bg-destructive"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground truncate font-mono">
                          {shortenAddress(tx.signature, 8)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatTime(tx.timestamp)}
                        </p>
                      </div>
                      <ExternalLink
                        size={10}
                        className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                      />
                    </a>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No recent transactions
                  </p>
                )}
              </div>
            </div>

            {/* Bottom actions */}
            <div className="flex flex-col gap-2 mt-auto">
              {/* Clear history */}
              {messageCount > 0 && (
                <button
                  onClick={onClearHistory}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border/40 text-muted-foreground text-xs font-medium hover:text-foreground hover:border-border/60 transition-all"
                >
                  <Trash2 size={12} />
                  Clear Chat History
                </button>
              )}

              {/* Disconnect button */}
              <button
                onClick={handleDisconnect}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-xs font-medium hover:bg-destructive/10 transition-all"
              >
                <LogOut size={12} />
                Disconnect Wallet
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed state icons */}
      {collapsed && (
        <div className="flex flex-col items-center gap-3 pt-14 px-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Wallet size={14} className="text-primary" />
          </div>
        </div>
      )}
    </motion.aside>
  );
};

export default AgentSidebar;
