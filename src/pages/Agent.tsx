import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { AnimatePresence, motion } from "framer-motion";
import { useWalletData } from "@/hooks/useWalletData";
import { useAgent } from "@/hooks/useAgent";
import AgentHeader from "@/components/agent/AgentHeader";
import AgentSidebar from "@/components/agent/AgentSidebar";
import ChatInterface from "@/components/agent/ChatInterface";

const Agent: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const walletData = useWalletData();
  const agent = useAgent(walletData);

  // Redirect if not connected
  useEffect(() => {
    if (!connected || !publicKey) {
      navigate("/app");
    }
  }, [connected, publicKey, navigate]);

  if (!connected || !publicKey) {
    return null;
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <AgentHeader
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main content */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex h-full">
          <AgentSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            walletData={walletData}
            onClearHistory={agent.clearHistory}
            messageCount={agent.messageCount}
          />
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="lg:hidden fixed left-0 top-14 bottom-0 z-50 w-[320px]"
              >
                <AgentSidebar
                  collapsed={false}
                  onToggle={() => setMobileSidebarOpen(false)}
                  walletData={walletData}
                  onClearHistory={agent.clearHistory}
                  messageCount={agent.messageCount}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Chat area */}
        <div className="flex-1 min-w-0">
          <ChatInterface agent={agent} />
        </div>
      </div>
    </div>
  );
};

export default Agent;
