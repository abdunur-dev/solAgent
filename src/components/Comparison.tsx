import React from "react";
import { motion } from "framer-motion";
import { Check, X,Zap, Brain } from "lucide-react";

const Comparison: React.FC = () => {
  const rows = [
    {
      feature: "Transaction Speed",
      manual: "Multiple clicks & approvals",
      agent: "One natural sentence",
      agentBetter: true,
    },
    {
      feature: "DeFi Complexity",
      manual: "Navigating 10+ tabs",
      agent: "Unified AI interface",
      agentBetter: true,
    },
    {
      feature: "Asset Tracking",
      manual: "Manual dashboard checks",
      agent: "Real-time AI insights",
      agentBetter: true,
    },
    {
      feature: "Security",
      manual: "Manual signature review",
      agent: "AI-assisted risk analysis",
      agentBetter: true,
    },
    {
      feature: "User Experience",
      manual: "Complex & Technical",
      agent: "Human-like & Intuitive",
      agentBetter: true,
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Why SolAgent?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare the traditional wallet experience with the new era of AI-driven blockchain interaction.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl overflow-hidden border border-border/50 shadow-2xl"
          >
            <div className="grid grid-cols-3 bg-white/[0.03] border-b border-border/50">
              <div className="p-6 font-semibold text-muted-foreground">Feature</div>
              <div className="p-6 font-semibold text-center border-x border-border/50 flex items-center justify-center gap-2">
                Traditional Wallet
              </div>
              <div className="p-6 font-semibold text-center text-primary flex items-center justify-center gap-2 bg-primary/5">
                <Brain size={18} />
                SolAgent AI
              </div>
            </div>

            {rows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 border-b border-border/50 last:border-0 transition-colors hover:bg-white/[0.02]`}
              >
                <div className="p-6 text-sm font-medium text-foreground flex items-center">
                  {row.feature}
                </div>
                <div className="p-6 text-sm text-muted-foreground text-center border-x border-border/50 flex items-center justify-center gap-2 italic">
                  <X size={14} className="text-destructive/50 flex-shrink-0" />
                  {row.manual}
                </div>
                <div className="p-6 text-sm text-foreground text-center flex items-center justify-center gap-2 font-medium bg-primary/[0.02]">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  {row.agent}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
