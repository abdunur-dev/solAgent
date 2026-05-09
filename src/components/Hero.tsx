import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ChatMockup from "./ChatMockup";

const roles = ["Just Talk. It Executes.", "Say It. Get It Done.", "Words Become Actions."];

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetText = roles[currentRole];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < targetText.length) {
            setDisplayText(targetText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2500);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentRole((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isDeleting ? 40 : 80,
    );
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRole]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid-hero animate-grid-move opacity-60" />

      {/* Radial gradient overlays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,_hsl(180_100%_50%_/_0.06)_0%,_transparent_70%)]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_hsl(263_100%_63%_/_0.05)_0%,_transparent_70%)]" />

      {/* Floating orbs */}
      <div className="absolute top-32 left-16 w-2 h-2 rounded-full bg-primary/60 animate-float" />
      <div className="absolute top-48 right-24 w-1.5 h-1.5 rounded-full bg-secondary/60 animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-40 left-1/3 w-1 h-1 rounded-full bg-accent/60 animate-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-xs font-medium text-primary tracking-wide uppercase font-mono">
                  Powered by Solana
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="text-foreground">Your AI Agent</span>
                <br />
                <span className="text-foreground">on </span>
                <span className="text-shimmer">Solana</span>
              </h1>
              <p className="mt-3 text-xl sm:text-2xl lg:text-3xl font-semibold">
                <span className="typing-cursor text-gradient-cyan">
                  {displayText}
                </span>
              </p>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              Connect your wallet and let AI handle swaps, transfers, staking
              and more — all in plain English.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => navigate("/app")}
                className="btn-neon-primary text-base flex items-center gap-2 group"
              >
                Launch App
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-neon-ghost text-base flex items-center gap-2 group"
              >
                How it Works
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex gap-8 pt-4"
            >
              {[
                { value: "50K+", label: "Transactions" },
                { value: "12K+", label: "Users" },
                { value: "<1s", label: "Execution" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Chat mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:block"
          >
            <ChatMockup />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-primary/50 to-transparent animate-scroll-pulse" />
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
