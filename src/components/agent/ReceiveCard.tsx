import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, QrCode, Download, ExternalLink } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface ReceiveCardProps {
  address: string;
  amount?: number;
}

const ReceiveCard: React.FC<ReceiveCardProps> = ({ address, amount }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const solanaPayUri = amount 
    ? `solana:${address}?amount=${amount}&label=SolAgent&message=Payment%20Request`
    : `solana:${address}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(solanaPayUri)}&bgcolor=ffffff&color=000000`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card-hover rounded-xl border border-primary/20 p-6 max-w-sm flex flex-col items-center gap-4"
    >
      <div className="flex items-center gap-2 self-start mb-2">
        <QrCode size={18} className="text-primary" />
        <span className="text-sm font-semibold text-foreground">
          {amount ? `Payment Request: ${amount} SOL` : "Receive Assets"}
        </span>
      </div>

      <div className="relative group p-4 bg-white rounded-xl shadow-lg border-4 border-white">
        <img 
          src={qrUrl} 
          alt="Wallet QR Code" 
          className="w-44 h-44 rounded-sm"
        />
        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-yellow-500 text-[10px] font-bold text-black rounded uppercase tracking-tighter border border-white shadow-sm">
          Devnet Only
        </div>
      </div>

      <div className="w-full space-y-2">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Public Address</p>
        <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg border border-border/50">
          <code className="text-xs text-foreground font-mono truncate flex-1">
            {address}
          </code>
          <CopyToClipboard text={address} onCopy={handleCopy}>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
            </button>
          </CopyToClipboard>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full mt-2">
        <a 
          href={solanaPayUri} 
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/20 transition-all"
        >
          Open in Wallet
          <ExternalLink size={12} />
        </a>
        <a 
          href={qrUrl} 
          download="solagent-payment.png"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border/50 text-[10px] text-muted-foreground hover:text-foreground hover:border-border transition-all"
        >
          <Download size={12} />
          Save QR Code
        </a>
      </div>

      <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
        ⚠️ <span className="text-yellow-500 font-bold uppercase">Important:</span> The sender must switch their wallet to <span className="text-white font-semibold">Devnet</span> before scanning, or the transaction will fail.
      </p>
    </motion.div>
  );
};

export default ReceiveCard;
