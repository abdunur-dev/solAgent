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
    <section className="py-20 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked <span className="text-glow-primary text-primary">Questions</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about SolAgent.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card px-6 rounded-xl border border-primary/20 data-[state=open]:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-6">
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
