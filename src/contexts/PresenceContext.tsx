/**
 * PresenceContext.tsx — Global Presence Layer
 * ═══════════════════════════════════════════
 * Lifecycle contract:
 *   SIGNED_IN          → start heartbeat, status=online
 *   SIGNED_OUT         → STOP heartbeat, status=offline, fire offline API
 *   visibilitychange   → hidden=away, visible=online (only if authenticated)
 *   beforeunload       → best-effort offline via navigator.sendBeacon fallback
 *   component unmount  → clear interval, unsubscribe auth listener
 *
 * Shared across Marketplace + Workspace (single source of presence truth).
 */

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '../utils/supabase/client';
import { updatePresence, batchGetPresence, type PresenceData } from '../utils/identityApi';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const HEARTBEAT_INTERVAL = 30_000; // 30 seconds

interface PresenceContextType {
  /** Batch-fetch presence for a set of user IDs */
  fetchPresence: (userIds: string[]) => Promise<Record<string, PresenceData>>;
  /** Current user's presence status */
  myStatus: 'online' | 'away' | 'offline';
}

const PresenceCtx = createContext<PresenceContextType | undefined>(undefined);

export function PresenceProvider({ children }: { children: ReactNode }) {
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAuthenticatedRef = useRef(false);
  const lastTokenRef = useRef<string | null>(null);
  const [myStatus, setMyStatus] = useState<'online' | 'away' | 'offline'>('offline');

  // ── Stop heartbeat (deterministic) ──
  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  // ── Go Online ──
  const goOnline = useCallback(async () => {
    isAuthenticatedRef.current = true;
    setMyStatus('online');
    // Cache token for sendBeacon fallback
    try {
      const { data } = await supabase.auth.getSession();
      lastTokenRef.current = data?.session?.access_token || null;
    } catch { /* best-effort */ }
    await updatePresence('online');
    // Start heartbeat (clear any existing first)
    stopHeartbeat();
    heartbeatRef.current = setInterval(() => {
      if (isAuthenticatedRef.current) {
        updatePresence('online');
      }
    }, HEARTBEAT_INTERVAL);
  }, [stopHeartbeat]);

  // ── Go Offline (full cleanup) ──
  const goOffline = useCallback(async () => {
    const wasAuthenticated = isAuthenticatedRef.current;
    isAuthenticatedRef.current = false;
    setMyStatus('offline');
    stopHeartbeat();
    if (wasAuthenticated) {
      // Fire-and-forget: tell server we're offline
      try {
        await updatePresence('offline');
      } catch { /* best-effort */ }
    }
    lastTokenRef.current = null;
  }, [stopHeartbeat]);

  // ── Go Away (tab hidden) ──
  const goAway = useCallback(() => {
    if (!isAuthenticatedRef.current) return;
    setMyStatus('away');
    updatePresence('away'); // fire-and-forget
  }, []);

  // ── Resume Online (tab visible) ──
  const resumeOnline = useCallback(() => {
    if (!isAuthenticatedRef.current) return;
    setMyStatus('online');
    updatePresence('online'); // fire-and-forget
  }, []);

  // ── Visibility Change Handler ──
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        goAway();
      } else {
        resumeOnline();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [goAway, resumeOnline]);

  // ── Auth State Listener ──
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        goOnline();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        goOnline();
      } else if (event === 'SIGNED_OUT') {
        // CRITICAL: stop heartbeat immediately on sign-out
        goOffline();
      }
    });

    return () => {
      subscription.unsubscribe();
      stopHeartbeat();
    };
  }, [goOnline, goOffline, stopHeartbeat]);

  // ── beforeunload: best-effort offline ──
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isAuthenticatedRef.current) return;
      // Try sendBeacon first (works during unload, unlike fetch)
      const token = lastTokenRef.current;
      if (token) {
        const url = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a/presence/update`;
        const body = JSON.stringify({ status: 'offline' });
        const headers = {
          type: 'application/json',
        };
        const blob = new Blob([body], headers);
        // sendBeacon doesn't support custom auth headers, so try fetch with keepalive
        try {
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
              'X-User-Token': token,
            },
            body,
            keepalive: true, // allows request to outlive the page
          });
        } catch {
          // Last resort: sendBeacon without auth (server will reject, but we tried)
          navigator.sendBeacon?.(url, blob);
        }
      }
      isAuthenticatedRef.current = false;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // ── Batch Presence Fetch ──
  const fetchPresence = useCallback(async (userIds: string[]) => {
    return batchGetPresence(userIds);
  }, []);

  return (
    <PresenceCtx.Provider value={{ fetchPresence, myStatus }}>
      {children}
    </PresenceCtx.Provider>
  );
}

export function usePresence() {
  const ctx = useContext(PresenceCtx);
  if (!ctx) {
    throw new Error('usePresence must be used within PresenceProvider');
  }
  return ctx;
}
