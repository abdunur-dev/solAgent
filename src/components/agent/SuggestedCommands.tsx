import React from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Send,
  ArrowLeftRight,
  History,
  Landmark,
  ImageIcon,
  Zap,
  QrCode,
} from "lucide-react";

interface SuggestedCommandsProps {
  onSelect: (command: string) => void;
}

const suggestions = [
  {
    icon: Send,
    text: "Send 0.5 SOL to ABC123...",
    color: "secondary" as const,
  },
  {
    icon: ArrowLeftRight,
    text: "Swap 10 USDC to SOL",
    color: "primary" as const,
  },
  {
    icon: Landmark,
    text: "Stake 2 SOL",
    color: "secondary" as const,
  },
  {
    icon: ImageIcon,
    text: "Show my NFTs",
    color: "primary" as const,
  },
  {
    icon: History,
    text: "Show my transaction history",
    color: "secondary" as const,
  },
  {
    icon: Zap,
    text: "Predict 1 SOL on BTC > 100k",
    color: "primary" as const,
  },
  {
    icon: QrCode,
    text: "Request 1 SOL",
    color: "secondary" as const,
  },
];

const colorStyles = {
  primary: {
    iconBg: "bg-primary/10",
    iconBorder: "border-primary/20",
    iconText: "text-primary",
    hover: "hover:border-primary/30",
  },
  secondary: {
    iconBg: "bg-secondary/10",
    iconBorder: "border-secondary/20",
    iconText: "text-secondary",
    hover: "hover:border-secondary/30",
  },
};

const SuggestedCommands: React.FC<SuggestedCommandsProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-primary font-bold text-xl">S</span>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-1">
          How can I help?
        </h2>
        <p className="text-sm text-muted-foreground">
          Try one of these commands or type your own
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl w-full">
        {suggestions.map((suggestion, i) => {
          const Icon = suggestion.icon;
          const styles = colorStyles[suggestion.color];
          return (
            <motion.button
              key={suggestion.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              onClick={() => onSelect(suggestion.text)}
              className={`glass-card-hover rounded-xl px-4 py-3 text-left flex items-center gap-3 group ${styles.hover}`}
            >
              <div
                className={`w-8 h-8 rounded-lg ${styles.iconBg} border ${styles.iconBorder} flex items-center justify-center flex-shrink-0`}
              >
                <Icon size={14} className={styles.iconText} />
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                {suggestion.text}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedCommands;
