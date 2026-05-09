import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  getSolBalance,
  getTokenBalances,
  getRecentTransactions,
} from "@/lib/solana";
import type { WalletData } from "@/lib/types";

const CACHE_TTL = 30_000; // 30 seconds

export function useWalletData() {
  const { publicKey } = useWallet();
  const address = publicKey?.toBase58() ?? "";

  const [data, setData] = useState<WalletData>({
    address: "",
    solBalance: 0,
    tokens: [],
    transactions: [],
    lastFetched: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(
    async (silent = false) => {
      if (!address) return;

      if (!silent) setLoading(true);
      else setRefreshing(true);

      try {
        const [solBalance, tokens, transactions] = await Promise.all([
          getSolBalance(address),
          getTokenBalances(address),
          getRecentTransactions(address, 5),
        ]);

        setData({
          address,
          solBalance,
          tokens,
          transactions,
          lastFetched: Date.now(),
        });
      } catch {
        // Keep existing data on error
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [address]
  );

  // Initial fetch
  useEffect(() => {
    if (address) {
      fetchAll();
    }
  }, [address, fetchAll]);

  /** Force refresh wallet data */
  const refresh = useCallback(() => {
    return fetchAll(true);
  }, [fetchAll]);

  /** Check if cache is stale */
  const isStale = Date.now() - data.lastFetched > CACHE_TTL;

  return {
    ...data,
    loading,
    refreshing,
    refresh,
    isStale,
  };
}
