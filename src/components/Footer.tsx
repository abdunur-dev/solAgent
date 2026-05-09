import React from "react";
import { motion } from "framer-motion";
import { Github, Heart } from "lucide-react";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/abdunur-dev/solAgent", icon: Github },
];

const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-border/30">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="text-primary font-bold text-xs">S</span>
              </div>
              <span className="text-base font-bold text-foreground">
                Sol<span className="text-gradient-purple">Agent</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Your AI-powered agent on Solana
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span>Forged with</span>
            <Heart className="h-3 w-3 text-destructive" />
            <span>& code</span>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-border/60 bg-card/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300 hover:scale-105"
                aria-label={link.label}
              >
                <link.icon size={16} />
              </a>
            ))}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 text-[10px] text-primary font-mono">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Built on Solana
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-muted-foreground font-mono">
            &copy; {new Date().getFullYear()} SolAgent. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
