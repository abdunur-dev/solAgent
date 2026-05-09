import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CTA: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-hero opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse_at_center,_hsl(180_100%_50%_/_0.08)_0%,_transparent_60%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_center,_hsl(263_100%_63%_/_0.06)_0%,_transparent_60%)]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Ready to Talk to{" "}
            <span className="text-shimmer">Solana</span>?
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mb-10 leading-relaxed">
            Connect your wallet and start executing on-chain in seconds.
            No learning curve, no complex UIs.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/app")}
            className="btn-neon-primary text-base px-10 py-4 inline-flex items-center gap-2.5 group"
          >
            Launch App
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>

          <div className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              Non-custodial
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              Open source
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              Built on Solana
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
