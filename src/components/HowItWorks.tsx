import React from "react";
import { motion } from "framer-motion";
import { Wallet, MessageSquareText, Zap } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Wallet,
    title: "Connect Wallet",
    description: "Connect any Solana wallet in one click. Phantom, Backpack, Solflare and more.",
  },
  {
    num: "02",
    icon: MessageSquareText,
    title: "Type Your Command",
    description: "Tell SolAgent what to do in plain English. No confusing interfaces, no technical steps.",
  },
  {
    num: "03",
    icon: Zap,
    title: "AI Executes On-Chain",
    description: "SolAgent understands your intent and executes the transaction securely on Solana.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.2 },
  }),
};

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-pixel-grid opacity-40" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
            <span className="text-primary">{">"}</span> Simple by Design
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            How It Works
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto relative">
          <div className="hidden md:block absolute top-[76px] left-[16%] right-[16%] h-[2px]">
            <div className="w-full h-full neon-line rounded-full" />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="relative z-10 mb-6">
                  <div className="w-[88px] h-[88px] rounded-2xl border border-border/60 bg-card/40 flex items-center justify-center transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:scale-105 hover-lift">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-primary tracking-widest font-mono">
                        {step.num}
                      </span>
                      <Icon size={28} className="text-primary" />
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors group-hover:text-gradient-purple">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
