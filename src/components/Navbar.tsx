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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();
  const address = publicKey?.toBase58() ?? "";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-nav border-b border-border/50 shadow-lg shadow-black/10"
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
          <div className="w-8 h-8 rounded-lg bg-muted/30 border border-border/40 flex items-center justify-center">
            <span className="text-foreground font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-bold text-foreground">
            Sol<span className="text-gradient-purple">Agent</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, index) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-all duration-300 rounded-lg hover:bg-primary/5"
            >
              <span className={`absolute left-1 text-primary transition-all duration-200 ${
                hoveredIndex === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              }`}>
                {">"}
              </span>
              <span className={`transition-transform duration-200 ${hoveredIndex === index ? "translate-x-2" : ""}`}>
                {link.label}
              </span>
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/20 border border-border/40 font-mono text-[10px] text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Solana
          </div>

          {connected && address && (
            <button
              onClick={() => navigate("/agent")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/40 text-xs font-mono text-foreground hover:border-primary/30 transition-all"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {shortenAddress(address)}
            </button>
          )}
          <button
            onClick={() => navigate("/app")}
            className="btn-neon-primary text-sm"
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
            className="md:hidden border-t border-border/50 overflow-hidden glass-nav"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 font-mono text-sm uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all text-left"
                >
                  <span className="text-primary">{">"}</span>
                  {link.label}
                </button>
              ))}
              <div className="border-t border-border/30 my-2 pt-3 flex items-center gap-2 px-4 py-2 font-mono text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Solana
              </div>
              <button
                onClick={() => { setMobileOpen(false); navigate("/app"); }}
                className="btn-neon-primary text-sm mt-2"
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
