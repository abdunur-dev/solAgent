import React from "react";
import { motion } from "framer-motion";

const wallets = [
  "Phantom",
  "Backpack",
  "Solflare",
  "Ledger",
  "Magic Eden",
  "Atomic",
  "Exodus",
  "Trust Wallet",
];

const WalletBanner: React.FC = () => {
  return (
    <div className="py-12 border-y border-border/30 bg-white/[0.01] overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      
      <div className="container mx-auto px-4 mb-8 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
          Compatible with all major Solana Wallets
        </p>
      </div>

      <div className="flex overflow-hidden group">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex whitespace-nowrap gap-16 items-center"
        >
          {/* Double the array for seamless loop */}
          {[...wallets, ...wallets].map((wallet, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-xl font-bold text-muted-foreground/40 hover:text-primary/60 transition-colors cursor-default"
            >
              <div className="w-2 h-2 rounded-full bg-primary/20" />
              {wallet}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default WalletBanner;
