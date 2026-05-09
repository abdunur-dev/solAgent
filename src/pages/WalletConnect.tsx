import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import type { WalletName } from "@solana/wallet-adapter-base";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

const WalletConnect: React.FC = () => {
  const { wallets, select, wallet, connect, connecting, connected, publicKey, disconnect } =
    useWallet();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);

  // Auto-connect when wallet is selected
  useEffect(() => {
    if (wallet && !connected && !connecting) {
      connect().catch((err) => {
        console.error("Wallet Connection Error:", err);
        setError(err instanceof Error ? err.message : "Connection failed");
      });
    }
  }, [wallet, connected, connecting, connect]);

  // Redirect if already connected
  useEffect(() => {
    if (connected && publicKey) {
      const timer = setTimeout(() => navigate("/agent"), 800);
      return () => clearTimeout(timer);
    }
  }, [connected, publicKey, navigate]);

  // Sort wallets: installed first
  const sortedWallets = [...wallets].sort((a, b) => {
    const aInstalled =
      a.readyState === WalletReadyState.Installed ? 0 : 1;
    const bInstalled =
      b.readyState === WalletReadyState.Installed ? 0 : 1;
    return aInstalled - bInstalled;
  });

  const handleConnect = useCallback(
    async (walletName: WalletName) => {
      try {
        setError(null);
        setConnectingWallet(walletName as string);
        select(walletName);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to connect wallet";
        setError(message);
        setConnectingWallet(null);
      }
    },
    [select]
  );

  // Clear connecting state on error
  useEffect(() => {
    if (!connecting && connectingWallet && !connected) {
      const timer = setTimeout(() => setConnectingWallet(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [connecting, connectingWallet, connected]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,_hsl(180_100%_50%_/_0.06)_0%,_transparent_60%)]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,_hsl(263_100%_63%_/_0.04)_0%,_transparent_60%)]" />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-20 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </motion.button>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        {/* Glow behind card */}
        <div className="absolute -inset-1 bg-[radial-gradient(ellipse_at_center,_hsl(180_100%_50%_/_0.1)_0%,_transparent_60%)] rounded-3xl blur-xl" />

        <div className="relative glass-card rounded-2xl border border-primary/10 overflow-hidden">
          {/* Neon top line */}
          <div className="h-[2px] neon-line" />

          <div className="p-6 sm:p-8">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8 justify-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold text-foreground text-glow-cyan">
                SolAgent
              </span>
            </div>

            {/* Headline */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Connect Your Wallet
              </h1>
              <p className="text-sm text-muted-foreground">
                Choose your Solana wallet to access the AI agent
              </p>
            </div>

            {/* Connected success state */}
            <AnimatePresence>
              {connected && publicKey && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-8"
                >
                  <CheckCircle2 size={40} className="text-primary" />
                  <p className="text-sm text-foreground font-medium">
                    Connected
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {publicKey.toBase58().slice(0, 8)}...
                    {publicKey.toBase58().slice(-8)}
                  </p>
                  <p className="text-xs text-primary mt-2">
                    Redirecting to agent...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive"
                >
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wallet grid */}
            {!connected && (
              <div className="grid gap-3">
                {sortedWallets.map((wallet) => {
                  const installed =
                    wallet.readyState === WalletReadyState.Installed;
                  const isConnecting =
                    connectingWallet === (wallet.adapter.name as string) &&
                    connecting;
                  const walletUrl = wallet.adapter.url;

                  return (
                    <motion.div
                      key={wallet.adapter.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <button
                        onClick={() => {
                          if (installed) {
                            handleConnect(wallet.adapter.name);
                          } else if (walletUrl && walletUrl !== "") {
                            window.open(
                              walletUrl,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }
                        }}
                        disabled={isConnecting}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-300 group ${
                          installed
                            ? "glass-card-hover border-border/50 hover:border-primary/30 cursor-pointer"
                            : "bg-muted/20 border-border/20 opacity-50 cursor-pointer hover:opacity-70"
                        }`}
                      >
                        {/* Wallet icon */}
                        <div className="w-9 h-9 rounded-lg bg-muted/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {wallet.adapter.icon ? (
                            <img
                              src={wallet.adapter.icon}
                              alt={wallet.adapter.name as string}
                              className="w-6 h-6"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded bg-primary/20" />
                          )}
                        </div>

                        {/* Name */}
                        <div className="flex-1 text-left">
                          <p
                            className={`text-sm font-medium ${
                              installed
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {wallet.adapter.name as string}
                          </p>
                          {installed && (
                            <p className="text-[10px] text-primary/70">
                              Detected
                            </p>
                          )}
                        </div>

                        {/* Action */}
                        {isConnecting ? (
                          <Loader2
                            size={16}
                            className="text-primary animate-spin"
                          />
                        ) : installed ? (
                          <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Connect
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            Install
                            <ExternalLink size={10} />
                          </span>
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Footer note */}
            {!connected && (
              <p className="text-[11px] text-muted-foreground text-center mt-6 leading-relaxed">
                Your keys stay with you. SolAgent never has access to your
                private keys or funds.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WalletConnect;
