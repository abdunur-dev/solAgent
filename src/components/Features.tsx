import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Wallet,
  ArrowLeftRight,
  Send,
  ShieldCheck,
  QrCode,
  Zap,
  Landmark,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Agent",
    description:
      "Understands natural language and executes complex DeFi actions automatically.",
    color: "primary" as const,
  },
  {
    icon: Globe,
    title: "Cross-Chain Bridging",
    description:
      "Bridge assets across 60+ chains (Ethereum, Base, etc.) using LI.FI's powerful aggregation.",
    color: "primary" as const,
  },
  {
    icon: ArrowLeftRight,
    title: "On-Chain Swaps",
    description:
      "Execute token swaps via LI.FI & Jupiter Aggregator just by typing 'Swap 5 SOL to USDC'.",
    color: "secondary" as const,
  },
  {
    icon: Landmark,
    title: "Secure Staking",
    description:
      "Stake your SOL with top validators and start earning rewards with simple commands.",
    color: "primary" as const,
  },
  {
    icon: QrCode,
    title: "Payment Requests",
    description:
      "Generate Solana Pay compatible QR codes for specific amounts with 'Request 1 SOL'.",
    color: "accent" as const,
  },
  {
    icon: Zap,
    title: "Prediction Markets",
    description:
      "Place on-chain predictions on real-world events and crypto prices instantly.",
    color: "primary" as const,
  },
  {
    icon: Send,
    title: "Instant Transfers",
    description:
      "Send SOL or any SPL token to any address instantly. Just say 'Send 1 SOL to...'",
    color: "accent" as const,
  },
  {
    icon: Wallet,
    title: "Asset Management",
    description:
      "Check balances, view your transaction history, and manage your NFT collection in one place.",
    color: "secondary" as const,
  },
];

const colorMap = {
  primary: {
    iconBg: "bg-primary/10",
    iconBorder: "border-primary/20",
    iconText: "text-primary",
    hoverBorder: "hover:border-primary/30",
    glowBg: "bg-[radial-gradient(ellipse_at_top_left,_hsl(180_100%_50%_/_0.04)_0%,_transparent_50%)]",
  },
  secondary: {
    iconBg: "bg-secondary/10",
    iconBorder: "border-secondary/20",
    iconText: "text-secondary",
    hoverBorder: "hover:border-secondary/30",
    glowBg: "bg-[radial-gradient(ellipse_at_top_left,_hsl(263_100%_63%_/_0.04)_0%,_transparent_50%)]",
  },
  accent: {
    iconBg: "bg-accent/10",
    iconBorder: "border-accent/20",
    iconText: "text-accent",
    hoverBorder: "hover:border-accent/30",
    glowBg: "bg-[radial-gradient(ellipse_at_top_left,_hsl(300_100%_50%_/_0.04)_0%,_transparent_50%)]",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const Features: React.FC = () => {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,_hsl(180_100%_50%_/_0.03)_0%,_transparent_60%)]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">
            Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            What SolAgent Can Do
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
            One AI agent that replaces dozens of interfaces.
            Talk naturally and get things done on Solana.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 max-w-6xl mx-auto">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            const colors = colorMap[feat.color];
            return (
              <motion.div
                key={feat.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                className={`group relative rounded-2xl glass-card-hover p-6 sm:p-7 overflow-hidden ${colors.hoverBorder}`}
              >
                {/* Ambient glow inside card */}
                <div
                  className={`absolute inset-0 ${colors.glowBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl ${colors.iconBg} border ${colors.iconBorder} flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110`}
                  >
                    <Icon size={22} className={colors.iconText} />
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
