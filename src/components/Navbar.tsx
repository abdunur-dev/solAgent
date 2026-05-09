import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { shortenAddress } from "@/lib/solana";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();
  const address = publicKey?.toBase58() ?? "";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-card border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:border-glow-cyan transition-all duration-300">
            <span className="text-primary font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-bold text-foreground text-glow-cyan">
            SolAgent
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right side: wallet address or Launch App */}
        <div className="hidden md:flex items-center gap-3">
          {connected && address && (
            <button
              onClick={() => navigate("/agent")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/40 text-xs font-mono text-foreground hover:border-primary/30 transition-all"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
              {shortenAddress(address)}
            </button>
          )}
          <button
            onClick={() => navigate("/app")}
            className="btn-neon-primary text-sm neon-pulse"
          >
            Launch App
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-card border-t border-border/50 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors text-left py-2"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { setMobileOpen(false); navigate("/app"); }}
                className="btn-neon-primary text-sm mt-2 neon-pulse"
              >
                Launch App
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;