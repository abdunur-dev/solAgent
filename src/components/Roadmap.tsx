import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Rocket, Globe, Shield } from "lucide-react";

const milestones = [
  {
    phase: "Phase 1",
    title: "Project Foundation",
    date: "Q1 2026",
    status: "completed",
    items: ["Core Agent Engine", "Devnet Integration", "Natural Language Parsing"],
    icon: CheckCircle2,
  },
  {
    phase: "Phase 2",
    title: "Alpha Release",
    date: "Q2 2026",
    status: "current",
    items: ["Staking & Swaps", "Payment Requests", "UI Overhaul"],
    icon: Rocket,
  },
  {
    phase: "Phase 3",
    title: "Mainnet Launch",
    date: "Q3 2026",
    status: "upcoming",
    items: ["Mainnet Liquidity", "Advanced Risk Analysis", "Referral Program"],
    icon: Globe,
  },
  {
    phase: "Phase 4",
    title: "AI Ecosystem",
    date: "Q4 2026",
    status: "upcoming",
    items: ["Yield Optimization", "Automated Rebalancing", "DAO Governance"],
    icon: Shield,
  },
];

const Roadmap: React.FC = () => {
  return (
    <section id="roadmap" className="py-24 sm:py-32 relative">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Roadmap
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our journey towards making DeFi accessible to everyone through the power of Artificial Intelligence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {milestones.map((m, i) => (
            <motion.div
              key={m.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-2xl border ${
                m.status === "current"
                  ? "border-primary/40 bg-primary/5 shadow-[0_0_20px_-5px_rgba(0,255,255,0.1)]"
                  : "border-border/50 glass-card"
              }`}
            >
              {m.status === "current" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-black text-[10px] font-bold rounded-full uppercase tracking-tighter">
                  In Progress
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  {m.phase}
                </span>
                <m.icon size={16} className={m.status === "completed" ? "text-primary" : "text-muted-foreground/30"} />
              </div>

              <h3 className="text-lg font-bold text-foreground mb-1">{m.title}</h3>
              <p className="text-xs text-muted-foreground mb-6">{m.date}</p>

              <ul className="space-y-3">
                {m.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/30 mt-1 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
