import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is SolAgent?",
    answer: "SolAgent is an AI-powered interface that lets you interact with the Solana blockchain using natural language. Instead of clicking through complex menus, you simply tell the agent what you want to do.",
  },
  {
    question: "Is this safe to use?",
    answer: "Yes! SolAgent only prepares the transactions. It never has access to your private keys. Every transaction requires your explicit approval and signature through your connected wallet (like Phantom or Solflare) before execution.",
  },
  {
    question: "Does it work on Mainnet?",
    answer: "Currently, SolAgent operates exclusively on the Solana Devnet for testing and demonstration purposes. All tokens used are testnet tokens with no real-world value.",
  },
  {
    question: "How do I get Devnet SOL?",
    answer: "You can easily get Devnet SOL directly through the agent. Just type 'Airdrop 2 SOL' in the chat, and the agent will request it from the official Solana faucet for you.",
  },
  {
    question: "What kind of transactions can I do?",
    answer: "You can check balances, request airdrops, send SOL to other wallets, swap tokens, stake your SOL, and even place mock predictions on-chain.",
  },
];

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="py-20 sm:py-28 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-14">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
              <span className="text-primary">{">"}</span> Support
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
              Everything you need to know about SolAgent.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-border/60 bg-card/40 px-6 transition-all duration-300 hover:border-primary/30 data-[state=open]:border-primary/40 card-border-glow"
              >
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline hover:text-primary transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-6 text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
