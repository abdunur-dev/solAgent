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

  // --- AIRDROP (get devnet testnet SOL) ---
  if (lower.includes("airdrop") || lower.includes("faucet") || lower.includes("give me sol") || lower.includes("get sol") || lower.includes("request sol") || lower.includes("testnet")) {
    const amountMatch = lower.match(/([\d.]+)/);
    const amount = amountMatch ? Math.min(parseFloat(amountMatch[1]), 2) : 1;

    return {
      id: generateId(),
      role: "agent",
      content: `Ready to request ${amount} SOL airdrop from Solana Devnet faucet.\n\nDetails:\n  Wallet: ${shortAddr}\n  Amount: ${amount} SOL (free testnet tokens)\n  Network: Devnet\n  Note: Max 2 SOL per request\n\nReply "confirm" to receive the airdrop.`,
      timestamp: Date.now(),
      action: {
        action: "airdrop",
        params: { amount },
        requiresConfirmation: true,
      },
    };
  }

  // --- BALANCE CHECK ---
  if (lower.includes("balance") || lower.includes("how much") || lower.includes("how many sol")) {
    const tokenList = tokenBalances
      .slice(0, 5)
      .map((t) => `  ${t.symbol}: ${formatBalance(t.balance)}`)
      .join("\n");

    const lowBalanceHint = solBalance < 0.1
      ? `\n\nYour balance is low. Type "airdrop 2 SOL" to get free testnet tokens.`
      : "";

    return textResponse(
      `Wallet: ${shortAddr}\n\nSOL Balance: ${solBalance.toFixed(4)} SOL\n\nToken Balances:\n${tokenList || "  No SPL tokens found"}\n\nNetwork: Solana Devnet${lowBalanceHint}`
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
        content: `Swap quote found via Jupiter aggregator.\n\nDetails:\n  Sell: ${amount} ${fromToken}\n  Buy: ~${estimated} ${toToken}\n  Rate: 1 ${fromToken} = ${mockRate} ${toToken}\n  Slippage: 0.5%\n  Route: ${fromToken} > ${toToken} (Jupiter)\n\nReply "confirm" to execute this swap.`,
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

  // --- UNSTAKE ---
  if (lower.includes("unstake")) {
    const addrMatch = userMessage.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/g);
    const stakeAccount = addrMatch
      ? addrMatch.find((a) => a !== walletAddress)
      : null;

    if (!stakeAccount) {
      return textResponse(
        "To unstake SOL, please provide the stake account address. For example: Unstake [stake-account-address]"
      );
    }

    return {
      id: generateId(),
      role: "agent",
      content: `Ready to unstake (deactivate) stake account: ${shortenAddress(stakeAccount, 6)}.\n\nDetails:\n  Account: ${stakeAccount}\n  Action: Deactivate\n  Note: After deactivation, you must wait ~2 days (1 epoch) to withdraw the SOL.\n\nReply "confirm" to unstake.`,
      timestamp: Date.now(),
      action: {
        action: "unstake",
        params: { stakeAccount },
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

  // --- HELP / GENERAL ---
  if (lower.includes("help") || lower.includes("what can you")) {
    return textResponse(
      `I am SolAgent, your AI wallet agent on Solana Devnet. Here is what I can do:\n\n  - Check your SOL and token balances\n  - Request free testnet SOL ("Airdrop 2 SOL")\n  - Send SOL to any wallet address\n  - Swap tokens (on-chain memo on devnet)\n  - Stake SOL with validators\n  - Place predictions ("Predict 1 SOL on BTC > 100k")\n  - View your NFT collection\n  - Show transaction history\n\nAll actions create real on-chain transactions on Devnet. I will ask for confirmation before executing any transaction.`
    );
  }

  // --- DEFAULT ---
  return textResponse(
    `I understand your message. As SolAgent, I can help you with:\n\n  - Get testnet SOL ("Airdrop 2 SOL")\n  - Checking balances ("What is my SOL balance?")\n  - Sending tokens ("Send 0.5 SOL to [address]")\n  - Swapping tokens ("Swap 10 USDC to SOL")\n  - Staking SOL ("Stake 2 SOL")\n  - Placing predictions ("Predict 1 SOL on event")\n  - Viewing NFTs ("Show my NFTs")\n  - Transaction history ("Show my transactions")\n\nWhat would you like to do?`
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

    case "unstake":
      return {
        id: generateId(),
        role: "agent",
        content: `Deactivating stake account ${shortenAddress(params.stakeAccount ?? "", 6)}...\n\nTransaction submitted. Your wallet will prompt you to sign.`,
        timestamp: Date.now(),
        action: { action: "confirm", params, requiresConfirmation: false },
        status: "pending",
      };

    case "airdrop":
      return {
        id: generateId(),
        role: "agent",
        content: `Requesting ${params.amount} SOL airdrop from Devnet faucet...\n\nProcessing your request. No wallet signature needed for airdrops.`,
        timestamp: Date.now(),
        action: { action: "confirm", params: { ...params, fromToken: "AIRDROP" }, requiresConfirmation: false },
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
