import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, X, ArrowRight } from "lucide-react";
import type { AgentAction } from "@/lib/types";

interface ConfirmCardProps {
  action: AgentAction;
  onConfirm: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

const ConfirmCard: React.FC<ConfirmCardProps> = ({
  action,
  onConfirm,
  onCancel,
  disabled,
}) => {
  const { action: actionType, params } = action;

  const getTitle = () => {
    switch (actionType) {
      case "send":
        return "Confirm Transfer";
      case "swap":
        return "Confirm Swap";
      case "stake":
        return "Confirm Staking";
      case "airdrop":
        return "Confirm Airdrop";
      case "predict":
        return "Confirm Prediction";
      case "unstake":
        return "Confirm Unstaking";
      default:
        return "Confirm Action";
    }
  };

  const getDetails = () => {
    switch (actionType) {
      case "send":
        return [
          { label: "Amount", value: `${params.amount ?? 0} SOL` },
          {
            label: "To",
            value: params.recipient
              ? `${params.recipient.slice(0, 6)}...${params.recipient.slice(-6)}`
              : "N/A",
          },
          { label: "Est. Fee", value: "0.000005 SOL" },
        ];
      case "swap":
        return [
          { label: "Sell", value: `${params.amount ?? 0} ${params.fromToken ?? ""}` },
          { label: "Buy", value: `${params.toToken ?? ""}` },
          { label: "Slippage", value: "0.5%" },
        ];
      case "stake":
        return [
          { label: "Amount", value: `${params.amount ?? 0} SOL` },
          { label: "Est. APY", value: "~7.2%" },
          { label: "Warmup", value: "~2 days" },
        ];
      case "airdrop":
        return [
          { label: "Network", value: "Devnet" },
          { label: "Amount", value: `${params.amount ?? 0} SOL` },
          { label: "Cost", value: "Free" },
        ];
      case "predict":
        return [
          { label: "Amount", value: `${params.amount ?? 0} SOL` },
          { label: "Event", value: params.predictionEvent ?? "Unknown" },
          { label: "Network", value: "Devnet" },
        ];
      case "unstake":
        return [
          { label: "Action", value: "Deactivate Stake" },
          {
            label: "Account",
            value: params.stakeAccount
              ? `${params.stakeAccount.slice(0, 6)}...${params.stakeAccount.slice(-6)}`
              : "Unknown",
          },
          { label: "Cooldown", value: "~2 days" },
        ];
      default:
        return [];
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card-hover rounded-xl border border-primary/20 p-4 max-w-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={16} className="text-primary" />
        <span className="text-sm font-semibold text-foreground">
          {getTitle()}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {getDetails().map((detail) => (
          <div
            key={detail.label}
            className="flex items-center justify-between text-xs"
          >
            <span className="text-muted-foreground">{detail.label}</span>
            <span className="text-foreground font-mono">{detail.value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg btn-neon-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm
          <ArrowRight size={12} />
        </button>
        <button
          onClick={onCancel}
          disabled={disabled}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={12} />
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default ConfirmCard;
