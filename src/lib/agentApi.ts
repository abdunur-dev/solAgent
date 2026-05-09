import type { ChatMessage, StoredMessage, TokenBalance, TransactionRecord, AgentAction } from "./types";
import { shortenAddress } from "./solana";

const generateId = () => Math.random().toString(36).substring(2, 12);

interface AgentContext {
  walletAddress: string;
  solBalance: number;
  tokenBalances: TokenBalance[];
  recentTransactions: TransactionRecord[];
  conversationHistory: StoredMessage[];
}

/**
 * Smart local agent that parses commands and returns structured responses.
 * Architecture ready for Claude API backend when available.
 */
export async function processAgentMessage(
  userMessage: string,
  context: AgentContext
): Promise<ChatMessage> {
  // Simulate thinking time
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

  const lower = userMessage.toLowerCase().trim();
  const { walletAddress, solBalance, tokenBalances, recentTransactions } = context;
  const shortAddr = shortenAddress(walletAddress, 4);

  // --- CONFIRMATION RESPONSES ---
  if (lower === "yes" || lower === "confirm" || lower === "y" || lower === "proceed") {
    // Look back for a pending action
    const lastAgentMsg = [...context.conversationHistory]
      .reverse()
      .find((m) => m.role === "agent" && m.action?.requiresConfirmation);

    if (lastAgentMsg?.action) {
      return createConfirmExecution(lastAgentMsg.action, walletAddress);
    }
    return textResponse("There is no pending action to confirm. What would you like to do?");
  }

  if (lower === "no" || lower === "cancel" || lower === "n") {
    return textResponse("Transaction cancelled. What else can I help with?");
  }

  // --- BALANCE CHECK ---
  if (lower.includes("balance") || lower.includes("how much") || lower.includes("how many sol")) {
    const tokenList = tokenBalances
      .slice(0, 5)
      .map((t) => `  ${t.symbol}: ${formatBalance(t.balance)}`)
      .join("\n");

    return textResponse(
      `Wallet: ${shortAddr}\n\nSOL Balance: ${solBalance.toFixed(4)} SOL\n\nToken Balances:\n${tokenList || "  No SPL tokens found"}\n\nNetwork: Solana Devnet`
    );
  }

  // --- SEND / TRANSFER ---
  if (lower.includes("send") || lower.includes("transfer")) {
    const amountMatch = lower.match(/([\d.]+)\s*sol/) || lower.match(/send\s+([\d.]+)/) || lower.match(/transfer\s+([\d.]+)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : null;

    // Try to extract recipient address (base58 pattern)
    const addrMatch = userMessage.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/g);
    const recipient = addrMatch
      ? addrMatch.find((a) => a !== walletAddress)
      : null;

    if (!amount) {
      return textResponse(
        "How much SOL would you like to send? Please specify the amount, for example: Send 0.5 SOL to [address]"
      );
    }

    if (amount > solBalance) {
      return textResponse(
        `Insufficient balance. You have ${solBalance.toFixed(4)} SOL but tried to send ${amount} SOL. Please enter a smaller amount.`
      );
    }

    if (!recipient) {
      return textResponse(
        `Please provide the recipient wallet address in the full command. For example: Send ${amount} SOL to [address]`
      );
    }

    const fee = 0.000005;
    return {
      id: generateId(),
      role: "agent",
      content: `Ready to send ${amount} SOL to ${shortenAddress(recipient, 6)}.\n\nDetails:\n  From: ${shortAddr}\n  To: ${shortenAddress(recipient, 6)}\n  Amount: ${amount} SOL\n  Est. Fee: ${fee} SOL\n  Remaining: ${(solBalance - amount - fee).toFixed(4)} SOL\n\nReply "confirm" to execute this transaction.`,
      timestamp: Date.now(),
      action: {
        action: "send",
        params: { amount, recipient, fromToken: "SOL" },
        requiresConfirmation: true,
      },
    };
  }

  // --- SWAP ---
  if (lower.includes("swap")) {
    const swapMatch = lower.match(/swap\s+([\d.]+)\s*(\w+)\s*(?:to|for|into)?\s*(\w+)/) || lower.match(/([\d.]+)\s*(\w+)\s*(?:to|for|into)\s*(\w+)/);

    if (swapMatch) {
      const amount = parseFloat(swapMatch[1]);
      const fromToken = swapMatch[2].toUpperCase();
      const toToken = swapMatch[3].toUpperCase();

      // Check if user has enough of the from token
      if (fromToken === "SOL" && amount > solBalance) {
        return textResponse(
          `Insufficient SOL balance. You have ${solBalance.toFixed(4)} SOL but tried to swap ${amount} SOL.`
        );
      }

      const mockRate = fromToken === "SOL" ? 156.23 : 0.0064;
      const estimated = fromToken === "SOL" ? (amount * mockRate).toFixed(2) : (amount * mockRate).toFixed(4);

      return {
        id: generateId(),
        role: "agent",
        content: `I've prepared a **Simulated Swap** for you on Devnet.\n\nDetails:\n  Sell: ${amount} ${fromToken}\n  Buy: ~${estimated} ${toToken}\n  Rate: 1 ${fromToken} = ${mockRate} ${toToken}\n  Route: Jupiter Aggregator (Mock)\n\n**Note:** Because we are on Devnet, this is an on-chain simulation. Your real balance won't change, but the swap will be permanently recorded via a Memo.\n\nReply "confirm" to execute.`,
        timestamp: Date.now(),
        action: {
          action: "swap",
          params: { amount, fromToken, toToken },
          requiresConfirmation: true,
        },
      };
    }

    return textResponse(
      "Please specify your swap details. For example: Swap 10 USDC to SOL"
    );
  }

  // --- BRIDGE / CROSS-CHAIN ---
  if (lower.includes("bridge") || lower.includes("cross-chain")) {
    const bridgeMatch = lower.match(/bridge\s+([\d.]+)\s*(\w+)\s*(?:to|into)?\s*(\w+)/) || lower.match(/transfer\s+([\d.]+)\s*(\w+)\s*to\s*(\w+)/);
    
    if (bridgeMatch) {
      const amount = parseFloat(bridgeMatch[1]);
      const fromToken = bridgeMatch[2].toUpperCase();
      const toChain = bridgeMatch[3].charAt(0).toUpperCase() + bridgeMatch[3].slice(1).toLowerCase();

      return {
        id: generateId(),
        role: "agent",
        content: `I've prepared a cross-chain bridge route via **LI.FI**.\n\nDetails:\n  From: ${amount} ${fromToken} (Solana)\n  To: ${toChain} Network\n  Aggregator: LI.FI (60+ Chains Supported)\n  Est. Time: 5-10 minutes\n\n**Note:** This is a simulated cross-chain route for Devnet. In a live environment, LI.FI would find the cheapest and fastest bridge (Stargate, Across, etc.) for you.\n\nReply "confirm" to simulate this bridge.`,
        timestamp: Date.now(),
        action: {
          action: "swap", 
          params: { amount, fromToken, toToken: `to ${toChain}` },
          requiresConfirmation: true,
        },
      };
    }

    return textResponse("Where would you like to bridge your assets? For example: Bridge 1 SOL to Ethereum");
  }

  // --- STAKE ---
  if (lower.includes("stake")) {
    const stakeMatch = lower.match(/([\d.]+)\s*sol/) || lower.match(/stake\s+([\d.]+)/);
    const amount = stakeMatch ? parseFloat(stakeMatch[1]) : null;

    if (!amount) {
      return textResponse("How much SOL would you like to stake? For example: Stake 2 SOL");
    }

    if (amount > solBalance) {
      return textResponse(
        `Insufficient balance for staking. You have ${solBalance.toFixed(4)} SOL but tried to stake ${amount} SOL.`
      );
    }

    return {
      id: generateId(),
      role: "agent",
      content: `Ready to stake ${amount} SOL with a Solana validator.\n\nDetails:\n  Amount: ${amount} SOL\n  Est. APY: ~7.2%\n  Warmup Period: 1 epoch (~2 days)\n  Remaining SOL: ${(solBalance - amount).toFixed(4)}\n\nReply "confirm" to stake.`,
      timestamp: Date.now(),
      action: {
        action: "stake",
        params: { amount, fromToken: "SOL" },
        requiresConfirmation: true,
      },
    };
  }

  // --- PREDICT ---
  if (lower.includes("predict") || lower.includes("bet")) {
    const amountMatch = lower.match(/([\d.]+)\s*sol/) || lower.match(/(?:predict|bet)\s+([\d.]+)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : null;

    const eventMatch = lower.match(/(?:that|on|for)\s+(.+)/);
    const predictionEvent = eventMatch ? eventMatch[1].trim() : null;

    if (!amount) {
      return textResponse("How much SOL would you like to predict? For example: Predict 1 SOL that BTC hits 100k");
    }

    if (amount > solBalance) {
      return textResponse(`Insufficient balance. You have ${solBalance.toFixed(4)} SOL but tried to predict ${amount} SOL.`);
    }

    if (!predictionEvent) {
      return textResponse(`Please specify the event. For example: Predict ${amount} SOL that BTC hits 100k`);
    }

    return {
      id: generateId(),
      role: "agent",
      content: `Ready to place prediction on Devnet.\n\nDetails:\n  Amount: ${amount} SOL\n  Event: "${predictionEvent}"\n  Remaining SOL: ${(solBalance - amount).toFixed(4)}\n\nReply "confirm" to place prediction.`,
      timestamp: Date.now(),
      action: {
        action: "predict",
        params: { amount, predictionEvent, fromToken: "PREDICT" },
        requiresConfirmation: true,
      },
    };
  }

  // --- NFTs ---
  if (lower.includes("nft")) {
    return textResponse(
      `Scanning NFTs for wallet ${shortAddr}...\n\nNo NFTs found on Devnet for this wallet. On mainnet, this would display your full NFT collection with metadata from Metaplex.`
    );
  }

  // --- TRANSACTION HISTORY ---
  if (lower.includes("transaction") || lower.includes("history") || lower.includes("recent")) {
    if (recentTransactions.length === 0) {
      return textResponse(
        `No recent transactions found for ${shortAddr}. Transactions will appear here after you execute your first on-chain action.`
      );
    }

    const txList = recentTransactions
      .slice(0, 5)
      .map((tx, i) => {
        const date = new Date(tx.timestamp * 1000).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        const statusIcon = tx.status === "success" ? "[OK]" : "[ERR]";
        return `  ${i + 1}. ${statusIcon} ${shortenAddress(tx.signature, 8)} - ${date}`;
      })
      .join("\n");

    return textResponse(
      `Recent transactions for ${shortAddr}:\n\n${txList}\n\nView full history on Solscan or click any transaction in the sidebar.`
    );
  }

  // --- RECEIVE / PAYMENT REQUEST ---
  if (lower.includes("receive") || lower.includes("deposit") || lower.includes("my address") || lower.includes("show address") || lower.includes("request")) {
    const amountMatch = lower.match(/([\d.]+)\s*sol/) || lower.match(/request\s+([\d.]+)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : undefined;

    return {
      id: generateId(),
      role: "agent",
      content: amount 
        ? `I've generated a payment request for ${amount} SOL.\n\nShare the QR code below with the sender. It is encoded with your address and the requested amount using Solana Pay.`
        : `Your public wallet address is ready for deposits.\n\nYou can use this address to receive SOL and other SPL tokens on the Solana Devnet.`,
      timestamp: Date.now(),
      action: {
        action: "receive",
        params: { recipient: walletAddress, amount },
        requiresConfirmation: false,
      },
    };
  }

  // --- KNOWLEDGE BASE / ABOUT ---
  if (lower.includes("who are you") || lower.includes("what is solagent") || (lower.includes("tell me") && lower.includes("about"))) {
    return textResponse(
      "I am SolAgent, your advanced AI companion on the Solana blockchain. My mission is to bridge the gap between complex DeFi protocols and everyday users through natural language.\n\nI can help you navigate the Solana ecosystem—from simple transfers to complex staking and token swaps—all while you keep full control of your keys. I currently operate on the Solana Devnet for testing and development."
    );
  }

  if (lower.includes("safe") || lower.includes("security") || lower.includes("trust")) {
    return textResponse(
      "Safety is my top priority. I am **non-custodial**, meaning I never store your private keys or access your funds without your permission. \n\nEvery transaction I prepare must be signed and approved by your connected wallet (like Phantom or Solflare) before it hits the blockchain. You have the final say on every single lamport."
    );
  }

  if (lower.includes("mission") || lower.includes("goal") || lower.includes("future")) {
    return textResponse(
      "My goal is to become the primary interface for the decentralized world. In the future, I will support multi-chain operations, automated yield farming, and even AI-driven portfolio rebalancing. \n\nWe believe that the future of finance should be as simple as sending a text message."
    );
  }

  if (lower.includes("creator") || lower.includes("who made you") || lower.includes("developer")) {
    return textResponse(
      "I was developed by the SolAgent team (led by @abdunur-dev) to simplify the Web3 experience. You can find my source code and contribute to my growth on [GitHub](https://github.com/abdunur-dev/solAgent)."
    );
  }

  // --- HELP / GENERAL ---
  if (lower.includes("help") || lower.includes("what can you")) {
    return textResponse(
      `I am SolAgent, your AI wallet agent on Solana Devnet. Here is what I can do:\n\n  - Receive SOL ("Show my address")
  - Send SOL to any wallet address
  - Swap tokens (on-chain memo on devnet)
  - Stake SOL with validators
  - Place predictions ("Predict 1 SOL on BTC > 100k")
  - View your NFT collection
  - Show transaction history`
    );
  }

  // --- DEFAULT ---
  return textResponse(
    `I understand your message. As SolAgent, I can help you with:\n\n  - Receive tokens ("How can I receive SOL?")
  - Checking balances ("What is my SOL balance?")
  - Sending tokens ("Send 0.5 SOL to [address]")
  - Swapping tokens ("Swap 10 USDC to SOL")
  - Staking SOL ("Stake 2 SOL")
  - Placing predictions ("Predict 1 SOL on event")
  - Viewing NFTs ("Show my NFTs")
  - Transaction history ("Show my transactions")\n\nWhat would you like to do?`
  );
}

function textResponse(content: string): ChatMessage {
  return {
    id: generateId(),
    role: "agent",
    content,
    timestamp: Date.now(),
  };
}

function createConfirmExecution(
  action: AgentAction,
  _walletAddress: string
): ChatMessage {
  const { action: actionType, params } = action;

  switch (actionType) {
    case "send":
      return {
        id: generateId(),
        role: "agent",
        content: `Executing transfer of ${params.amount} SOL to ${shortenAddress(params.recipient ?? "", 6)}...\n\nTransaction submitted. Waiting for on-chain confirmation. Your wallet will prompt you to sign.`,
        timestamp: Date.now(),
        action: { action: "confirm", params, requiresConfirmation: false },
        status: "pending",
      };

    case "swap":
      return {
        id: generateId(),
        role: "agent",
        content: `Executing swap: ${params.amount} ${params.fromToken} to ${params.toToken} via Jupiter...\n\nTransaction submitted. Your wallet will prompt you to sign.`,
        timestamp: Date.now(),
        action: { action: "confirm", params, requiresConfirmation: false },
        status: "pending",
      };

    case "stake":
      return {
        id: generateId(),
        role: "agent",
        content: `Executing stake of ${params.amount} SOL with validator...\n\nTransaction submitted. Your wallet will prompt you to sign.`,
        timestamp: Date.now(),
        action: { action: "confirm", params: { ...params, fromToken: "SOL" }, requiresConfirmation: false },
        status: "pending",
      };

    case "predict":
      return {
        id: generateId(),
        role: "agent",
        content: `Executing prediction of ${params.amount} SOL on "${params.predictionEvent}"...\n\nTransaction submitted. Your wallet will prompt you to sign.`,
        timestamp: Date.now(),
        action: { action: "confirm", params, requiresConfirmation: false },
        status: "pending",
      };

    default:
      return textResponse("Executing your request...");
  }
}

function formatBalance(balance: number): string {
  if (balance >= 1_000_000) return `${(balance / 1_000_000).toFixed(1)}M`;
  if (balance >= 1_000) return `${(balance / 1_000).toFixed(1)}K`;
  return balance.toFixed(2);
}
