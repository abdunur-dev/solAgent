import React from "react";
import { motion } from "framer-motion";
import { Github } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-border/40">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Logo and tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="text-primary font-bold text-xs">S</span>
              </div>
              <span className="text-base font-bold text-foreground text-glow-cyan">
                SolAgent
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your AI-powered agent on Solana
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
              aria-label="Discord"
            >
              {/* Discord icon as simple SVG */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </a>
          </div>

          {/* Built on Solana + Copyright */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/15 bg-primary/5 text-xs text-primary">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Built on Solana
            </div>
            <p className="text-xs text-muted-foreground">
              2025 SolAgent. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
