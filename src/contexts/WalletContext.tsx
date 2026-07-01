import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError';
}

interface LedgerEntry {
  type: 'earn' | 'spend' | 'adjust';
  amount: number;
  reason: string;
  created_at: string;
  user_id: string;
}

interface WalletContextType {
  balance: number;
  isLoading: boolean;
  ledger: LedgerEntry[];
  ledgerLoading: boolean;
  fetchBalance: () => Promise<void>;
  fetchLedger: () => Promise<void>;
  spendCoins: (amount: number, reason: string) => Promise<{ success: boolean; error?: string }>;
  topUpCoins: (amount: number, reason: string) => Promise<{ success: boolean; error?: string }>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

async function getAccessToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch {
    return null;
  }
}

function buildHeaders(userToken: string | null, extra?: Record<string, string>): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...(userToken ? { 'X-User-Token': userToken } : {}),
    ...extra,
  };
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);

  const fetchBalance = useCallback(async (signal?: AbortSignal) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setBalance(0);
        setIsLoading(false);
        return;
      }
      const res = await fetch(`${API_BASE}/wallet/balance`, {
        headers: buildHeaders(token),
        signal,
      });
      if (!res.ok) {
        // 401 is expected when session is stale — not a real error
        if (res.status === 401) {
          console.log('Wallet: user not authenticated, skipping balance fetch');
        } else {
          const data = await res.json().catch(() => ({}));
          console.error('Wallet balance error:', data.error || `HTTP ${res.status}`);
        }
        setBalance(0);
        return;
      }
      const data = await res.json();
      setBalance(data.balance ?? 0);
    } catch (err) {
      if (isAbortError(err)) return; // Component unmounted — ignore
      // Suppress network errors silently (e.g. edge function cold start / no connectivity)
      if (err instanceof TypeError && (err as TypeError).message === 'Failed to fetch') {
        setBalance(0);
        return;
      }
      console.error('Wallet fetch failed:', err);
      setBalance(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLedger = useCallback(async (signal?: AbortSignal) => {
    setLedgerLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        setLedgerLoading(false);
        return;
      }
      const res = await fetch(`${API_BASE}/wallet/ledger`, {
        headers: buildHeaders(token),
        signal,
      });
      if (!res.ok) {
        if (res.status === 401) {
          console.log('Wallet: user not authenticated, skipping ledger fetch');
        } else {
          const data = await res.json().catch(() => ({}));
          console.error('Wallet ledger error:', data.error || `HTTP ${res.status}`);
        }
        return;
      }
      const data = await res.json();
      setLedger(data.entries || []);
    } catch (err) {
      if (isAbortError(err)) return;
      console.error('Ledger fetch failed:', err);
    } finally {
      setLedgerLoading(false);
    }
  }, []);

  const spendCoins = useCallback(async (amount: number, reason: string) => {
    try {
      const token = await getAccessToken();
      if (!token) return { success: false, error: 'Not authenticated' };
      const res = await fetch(`${API_BASE}/wallet/spend`, {
        method: 'POST',
        headers: buildHeaders(token),
        body: JSON.stringify({ amount, reason }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBalance(data.balance);
        return { success: true };
      }
      return { success: false, error: data.error || 'فشل في خصم الكوينز' };
    } catch (err: any) {
      console.error('Spend coins error:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const topUpCoins = useCallback(async (amount: number, reason: string) => {
    try {
      const token = await getAccessToken();
      if (!token) return { success: false, error: 'Not authenticated' };
      const res = await fetch(`${API_BASE}/wallet/topup`, {
        method: 'POST',
        headers: buildHeaders(token),
        body: JSON.stringify({ amount, reason, type: 'earn' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBalance(data.balance);
        return { success: true };
      }
      return { success: false, error: data.error || 'فشل في شحن الكوينز' };
    } catch (err: any) {
      console.error('TopUp coins error:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Fetch balance on mount + when auth changes
  useEffect(() => {
    const controller = new AbortController();

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && !controller.signal.aborted) {
          fetchBalance(controller.signal);
        } else {
          setIsLoading(false);
        }
      } catch {
        setIsLoading(false);
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (controller.signal.aborted) return;
      if (session?.user) {
        fetchBalance(controller.signal);
      } else {
        setBalance(0);
        setLedger([]);
        setIsLoading(false);
      }
    });

    return () => {
      controller.abort();
      subscription.unsubscribe();
    };
  }, [fetchBalance]);

  return (
    <WalletContext.Provider value={{
      balance,
      isLoading,
      ledger,
      ledgerLoading,
      fetchBalance,
      fetchLedger,
      spendCoins,
      topUpCoins,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}