import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { Bot, Menu } from "lucide-react";
import { shortenAddress } from "@/lib/solana";

interface AgentHeaderProps {
  onToggleSidebar: () => void;
}

const AgentHeader: React.FC<AgentHeaderProps> = ({ onToggleSidebar }) => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const address = publicKey?.toBase58() ?? "";

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border/40 glass-card flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-muted-foreground hover:text-primary transition-colors"
        >
          <Menu size={18} />
        </button>

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 group"
        >
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <span className="text-primary font-bold text-xs">S</span>
          </div>
          <span className="text-sm font-bold text-foreground text-glow-cyan hidden sm:inline">
            SolAgent
          </span>
        </button>

        <div className="h-5 w-px bg-border/40 mx-1" />

        <div className="flex items-center gap-1.5">
          <Bot size={14} className="text-primary" />
          <span className="text-xs text-muted-foreground font-medium">
            AI Agent
          </span>
        </div>
      </div>

      {/* Wallet address */}
      {address && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/40">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-xs font-mono text-foreground">
            {shortenAddress(address)}
          </span>
        </div>
      )}
    </header>
  );
};

export default AgentHeader;
