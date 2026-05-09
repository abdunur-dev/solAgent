import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, QrCode, Download } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface ReceiveCardProps {
  address: string;
}

const ReceiveCard: React.FC<ReceiveCardProps> = ({ address }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}&bgcolor=0a0a0a&color=ffffff`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card-hover rounded-xl border border-primary/20 p-6 max-w-sm flex flex-col items-center gap-4"
    >
      <div className="flex items-center gap-2 self-start mb-2">
        <QrCode size={18} className="text-primary" />
        <span className="text-sm font-semibold text-foreground">Receive Assets</span>
      </div>

      <div className="relative group p-4 bg-white rounded-lg">
        <img 
          src={qrUrl} 
          alt="Wallet QR Code" 
          className="w-40 h-40 rounded-sm"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all rounded-lg" />
      </div>

      <div className="w-full space-y-2">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Your Wallet Address</p>
        <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg border border-border/50">
          <code className="text-xs text-foreground font-mono truncate flex-1">
            {address}
          </code>
          <CopyToClipboard text={address} onCopy={handleCopy}>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </CopyToClipboard>
        </div>
      </div>

      <div className="flex gap-2 w-full mt-2">
        <a 
          href={qrUrl} 
          download="solagent-qr.png"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-all"
        >
          <Download size={12} />
          Save QR
        </a>
      </div>

      <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
        Only send <span className="text-primary font-semibold">Solana (SOL)</span> and <span className="text-primary font-semibold">SPL tokens</span> to this address on the <span className="text-white">Devnet</span> network.
      </p>
    </motion.div>
  );
};

export default ReceiveCard;
