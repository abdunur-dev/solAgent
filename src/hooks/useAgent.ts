import { useState, useEffect, useCallback, useRef } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import type { ChatMessage, StoredMessage } from "@/lib/types";
import {
  loadMessages,
  appendMessage,
  clearMessages,
  toStored,
} from "@/lib/memory";
import { processAgentMessage } from "@/lib/agentApi";
import { buildTransferTransaction, buildSwapTransaction, buildStakeTransaction, buildPredictionTransaction, isValidPublicKey } from "@/lib/solana";
import type { useWalletData } from "@/hooks/useWalletData";

const generateId = () => Math.random().toString(36).substring(2, 12);

type WalletDataReturn = ReturnType<typeof useWalletData>;

export function useAgent(walletData: WalletDataReturn) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const address = publicKey?.toBase58() ?? "";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const initialized = useRef(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    if (!address || initialized.current) return;
    initialized.current = true;

    const stored = loadMessages(address);
    if (stored.length > 0) {
      const restored: ChatMessage[] = stored.map((m) => ({
        ...m,
        timestamp: m.timestamp,
      }));
      setMessages(restored);
    }
  }, [address]);

  // Reset initialization when wallet changes
  useEffect(() => {
    return () => {
      initialized.current = false;
    };
  }, [address]);

  /** Execute a real SOL transfer on-chain */
  const executeTransfer = useCallback(
    async (
      recipient: string,
      amount: number
    ): Promise<{ signature: string } | { error: string }> => {
      if (!publicKey || !sendTransaction) {
        return { error: "Wallet not connected" };
      }

      if (!isValidPublicKey(recipient)) {
        return { error: "Invalid recipient address" };
      }

      try {
        const tx = await buildTransferTransaction(
          address,
          recipient,
          amount
        );
        const signature = await sendTransaction(tx, connection);

        // Wait for confirmation
        await connection.confirmTransaction(signature, "confirmed");

        return { signature };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Transaction failed";

        if (msg.includes("User rejected")) {
          return { error: "Transaction rejected by wallet. No funds were sent." };
        }
        if (msg.includes("insufficient")) {
          return { error: "Insufficient balance to complete this transaction." };
        }
        return { error: msg };
      }
    },
    [publicKey, sendTransaction, connection, address]
  );

  /** Execute a mock swap transaction on-chain */
  const executeSwap = useCallback(
    async (
      fromToken: string,
      toToken: string,
      amount: number
    ): Promise<{ signature: string } | { error: string }> => {
      if (!publicKey || !sendTransaction) {
        return { error: "Wallet not connected" };
      }

      try {
        const tx = await buildSwapTransaction(
          address,
          fromToken,
          toToken,
          amount
        );
        const signature = await sendTransaction(tx, connection);

        // Wait for confirmation
        await connection.confirmTransaction(signature, "confirmed");

        return { signature };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Swap transaction failed";

        if (msg.includes("User rejected")) {
          return { error: "Transaction rejected by wallet." };
        }
        return { error: msg };
      }
    },
    [publicKey, sendTransaction, connection, address]
  );

  /** Execute a real stake transaction on-chain */
  const executeStake = useCallback(
    async (
      amount: number
    ): Promise<{ signature: string } | { error: string }> => {
      if (!publicKey || !sendTransaction) {
        return { error: "Wallet not connected" };
      }

      try {
        const { transaction, stakeKeypair } = await buildStakeTransaction(
          address,
          amount
        );
        // sendTransaction automatically handles the partial sign if we pass the signers
        const signature = await sendTransaction(transaction, connection, {
          signers: [stakeKeypair],
        });

        // Wait for confirmation
        await connection.confirmTransaction(signature, "confirmed");

        return { signature };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Stake transaction failed";

        if (msg.includes("User rejected")) {
          return { error: "Transaction rejected by wallet." };
        }
        return { error: msg };
      }
    },
    [publicKey, sendTransaction, connection, address]
  );

  /** Execute a mock prediction transaction on-chain */
  const executePrediction = useCallback(
    async (
      amount: number,
      predictionEvent: string
    ): Promise<{ signature: string } | { error: string }> => {
      if (!publicKey || !sendTransaction) {
        return { error: "Wallet not connected" };
      }

      try {
        const tx = await buildPredictionTransaction(
          address,
          amount,
          predictionEvent
        );
        const signature = await sendTransaction(tx, connection);

        // Wait for confirmation
        await connection.confirmTransaction(signature, "confirmed");

        return { signature };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Prediction transaction failed";

        if (msg.includes("User rejected")) {
          return { error: "Transaction rejected by wallet." };
        }
        return { error: msg };
      }
    },
    [publicKey, sendTransaction, connection, address]
  );

  /** Send a message and get agent response */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading || !address) return;

      // Create user message
      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      const updatedWithUser = [...messages, userMsg];
      setMessages(updatedWithUser);
      appendMessage(address, toStored(userMsg));
      setIsLoading(true);

      try {
        // Build conversation history for context
        const storedHistory: StoredMessage[] = updatedWithUser.map(toStored);

        // Get agent response with full context
        const agentResponse = await processAgentMessage(text.trim(), {
          walletAddress: address,
          solBalance: walletData.solBalance,
          tokenBalances: walletData.tokens,
          recentTransactions: walletData.transactions,
          conversationHistory: storedHistory,
        });

        // If this is a confirm execution, execute the original action on-chain
        if (agentResponse.action?.action === "confirm") {
          const actionParams = agentResponse.action.params;
          const originalAction = actionParams.originalAction;

          let result: { signature: string } | { error: string } | null = null;

          switch (originalAction) {
            case "send":
              result = await executeTransfer(actionParams.recipient!, actionParams.amount!);
              break;
            case "swap":
            case "bridge":
              result = await executeSwap(actionParams.fromToken!, actionParams.toToken!, actionParams.amount!);
              break;
            case "stake":
              result = await executeStake(actionParams.amount!);
              break;
            case "predict":
              result = await executePrediction(actionParams.amount!, actionParams.predictionEvent!);
              break;
          }

          if (result) {
            if ("signature" in result) {
              const label = originalAction === "swap" ? "Swap simulation" :
                originalAction === "bridge" ? "Bridge simulation" :
                originalAction === "send" ? "Transfer" :
                originalAction === "stake" ? "Stake" :
                "Prediction";
              agentResponse.content = `${label} confirmed on-chain.\n\nSignature: ${result.signature.slice(0, 16)}...\n\nView on Solscan for full details. Your balance will update shortly.`;
              agentResponse.txSignature = result.signature;
              agentResponse.status = "confirmed";
              walletData.refresh();
            } else {
              agentResponse.content = `Transaction failed: ${result.error}`;
              agentResponse.status = "error";
            }
          }
        }

        const updatedWithAgent = [...updatedWithUser, agentResponse];
        setMessages(updatedWithAgent);
        appendMessage(address, toStored(agentResponse));
      } catch {
        const errorMsg: ChatMessage = {
          id: generateId(),
          role: "agent",
          content:
            "Something went wrong processing your request. Please try again.",
          timestamp: Date.now(),
          status: "error",
        };
        const updatedWithError = [...updatedWithUser, errorMsg];
        setMessages(updatedWithError);
        appendMessage(address, toStored(errorMsg));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, address, walletData, executeTransfer, executeSwap, executeStake, executePrediction]
  );

  /** Clear all chat history */
  const clearHistory = useCallback(() => {
    if (!address) return;
    clearMessages(address);
    setMessages([]);
  }, [address]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearHistory,
    messageCount: messages.length,
  };
}
