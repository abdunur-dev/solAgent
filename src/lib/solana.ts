import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  StakeProgram,
  Authorized,
  Keypair,
} from "@solana/web3.js";
import type { TokenBalance, TransactionRecord } from "./types";

const DEVNET_URL = "https://api.devnet.solana.com";

let _connection: Connection | null = null;

export function getConnection(): Connection {
  if (!_connection) {
    _connection = new Connection(DEVNET_URL, "confirmed");
  }
  return _connection;
}

export async function getSolBalance(address: string): Promise<number> {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch {
    return 0;
  }
}

export async function getTokenBalances(
  address: string
): Promise<TokenBalance[]> {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(address);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
    );

    const tokens: TokenBalance[] = tokenAccounts.value
      .map((account) => {
        const info = account.account.data.parsed.info;
        const amount = info.tokenAmount;
        if (amount.uiAmount === 0) return null;
        return {
          symbol: info.mint.slice(0, 4).toUpperCase(),
          name: info.mint,
          balance: amount.uiAmount ?? 0,
          mint: info.mint,
          decimals: amount.decimals,
        };
      })
      .filter(Boolean) as TokenBalance[];

    return tokens.slice(0, 10);
  } catch {
    return [];
  }
}

export async function getRecentTransactions(
  address: string,
  limit = 5
): Promise<TransactionRecord[]> {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(address);
    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit,
    });

    return signatures.map((sig) => ({
      signature: sig.signature,
      type: sig.memo ? "Memo" : "Transfer",
      timestamp: sig.blockTime ?? Date.now() / 1000,
      status: sig.err ? ("error" as const) : ("success" as const),
    }));
  } catch {
    return [];
  }
}

/** Build a SOL transfer transaction (unsigned) */
export async function buildTransferTransaction(
  from: string,
  to: string,
  amountSol: number
): Promise<Transaction> {
  const connection = getConnection();
  const fromPubkey = new PublicKey(from);
  const toPubkey = new PublicKey(to);
  const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = fromPubkey;

  return transaction;
}

/** Build a mock swap transaction on Devnet */
export async function buildSwapTransaction(
  walletAddress: string,
  fromToken: string,
  toToken: string,
  amount: number
): Promise<Transaction> {
  const connection = getConnection();
  const pubkey = new PublicKey(walletAddress);
  
  const transaction = new Transaction();
  
  // Add a memo instruction to record the mock swap on devnet
  transaction.add(
    new TransactionInstruction({
      keys: [{ pubkey, isSigner: true, isWritable: true }],
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      data: Buffer.from(`Mock Swap: ${amount} ${fromToken} to ${toToken}`, "utf-8"),
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = pubkey;

  return transaction;
}

/** Build a mock Prediction Market transaction on Devnet */
export async function buildPredictionTransaction(
  walletAddress: string,
  amountSol: number,
  predictionEvent: string
): Promise<Transaction> {
  const connection = getConnection();
  const pubkey = new PublicKey(walletAddress);
  
  const transaction = new Transaction();
  
  // Add a memo instruction to record the prediction on devnet
  transaction.add(
    new TransactionInstruction({
      keys: [{ pubkey, isSigner: true, isWritable: true }],
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      data: Buffer.from(`Prediction: ${amountSol} SOL on "${predictionEvent}"`, "utf-8"),
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = pubkey;

  return transaction;
}

/** Build a real stake transaction on Devnet */
export async function buildStakeTransaction(
  walletAddress: string,
  amountSol: number
): Promise<{ transaction: Transaction; stakeKeypair: Keypair }> {
  const connection = getConnection();
  const pubkey = new PublicKey(walletAddress);
  const stakeKeypair = Keypair.generate();
  const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);

  // Minimum delegation required
  const minimumRent = await connection.getMinimumBalanceForRentExemption(
    StakeProgram.space
  );

  const transaction = new Transaction();

  // Create the stake account
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: pubkey,
      newAccountPubkey: stakeKeypair.publicKey,
      lamports: lamports + minimumRent,
      space: StakeProgram.space,
      programId: StakeProgram.programId,
    })
  );

  // Initialize the stake account
  transaction.add(
    StakeProgram.initialize({
      stakePubkey: stakeKeypair.publicKey,
      authorized: new Authorized(pubkey, pubkey),
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = pubkey;

  // The stake keypair must partially sign
  transaction.partialSign(stakeKeypair);

  return { transaction, stakeKeypair };
}

/** Build a transaction to deactivate a stake account */
export async function buildUnstakeTransaction(
  walletAddress: string,
  stakeAccountAddress: string
): Promise<Transaction> {
  const connection = getConnection();
  const pubkey = new PublicKey(walletAddress);
  const stakePubkey = new PublicKey(stakeAccountAddress);

  const deactivateTx = StakeProgram.deactivate({
    stakePubkey,
    authorizedPubkey: pubkey,
  });

  const transaction = new Transaction().add(...deactivateTx.instructions);

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = pubkey;

  return transaction;
}

/** Find stake accounts owned by a wallet */
export async function findStakeAccounts(walletAddress: string) {
  const connection = getConnection();
  const pubkey = new PublicKey(walletAddress);
  
  const accounts = await connection.getParsedProgramAccounts(
    StakeProgram.programId,
    {
      filters: [
        {
          dataSize: 200, // Stake account size
        },
        {
          memcmp: {
            offset: 44, // Offset for authorized staker
            bytes: pubkey.toBase58(),
          },
        },
      ],
    }
  );

  return accounts;
}

/** Request a Devnet SOL airdrop */
export async function requestDevnetAirdrop(
  address: string,
  amountSol: number = 1
): Promise<string> {
  const connection = getConnection();
  const pubkey = new PublicKey(address);
  // Devnet limits each airdrop to 2 SOL max
  const clampedAmount = Math.min(amountSol, 2);
  const lamports = Math.round(clampedAmount * LAMPORTS_PER_SOL);

  const signature = await connection.requestAirdrop(pubkey, lamports);
  await connection.confirmTransaction(signature, "confirmed");
  return signature;
}

export function isValidPublicKey(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function getSolscanUrl(signature: string): string {
  return `https://solscan.io/tx/${signature}?cluster=devnet`;
}

export function getSolscanAddressUrl(address: string): string {
  return `https://solscan.io/account/${address}?cluster=devnet`;
}
