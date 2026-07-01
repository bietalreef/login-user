/**
 * WeyaakIdentityContext.tsx — هوية وياك المحلية
 * ═══════════════════════════════════════════════
 * طبقة localStorage فوق Supabase auth.
 * مسؤولة عن:
 *   - تحديد إذا كان المستخدم جديداً أو عائداً
 *   - تخزين role / workspaceMode / profileId لكل userId
 *   - تهيئة وكيل UI الافتراضي عند التسجيل الأول
 *   - استعادة الحالة الكاملة لو المستخدم عائد
 *
 * لا يستبدل UserContext — يكمله.
 * لا يتصل بـ Supabase مباشرة — يقرأ session فقط.
 */

import {
  createContext, useContext, useState, useEffect, useCallback,
  type ReactNode,
} from 'react';
import { supabase } from '../utils/supabase/client';

// ── Types ────────────────────────────────────────────────────────
export type WeyaakRole = 'customer' | 'provider';
export type WorkspaceMode = 'customer' | 'provider';

export interface ProviderPresence {
  publicProfile: 'draft' | 'incomplete' | 'pending_review' | 'ready' | 'live';
  providerCard: 'hidden' | 'visible';
  mapsPresence: 'not_started' | 'pending' | 'active';
  discoverability: boolean;
}

export interface WeyaakProfile {
  userId: string;
  role: WeyaakRole;
  workspaceMode: WorkspaceMode;
  email: string;
  name: string;
  avatarUrl: string;
  customerProfileId: string | null;
  providerProfileId: string | null;
  defaultAgentId: string | null;
  lastActiveSessionId: string | null;
  isNewUser: boolean;
  // Provider-specific — null for customers
  providerPresence: ProviderPresence | null;
  createdAt: string;
  lastSeenAt: string;
}

// ── Storage helpers ──────────────────────────────────────────────
function storageKey(userId: string) { return `weyaak_identity_${userId}`; }

function loadProfile(userId: string): WeyaakProfile | null {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveProfile(profile: WeyaakProfile) {
  try {
    localStorage.setItem(storageKey(profile.userId), JSON.stringify(profile));
  } catch { /* silent */ }
}

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

// ── Context ──────────────────────────────────────────────────────
interface WeyaakIdentityContextType {
  weyaakProfile: WeyaakProfile | null;
  userId: string | null;
  isIdentityReady: boolean;
  isNewUser: boolean;
  /** Called after role selection to initialize new user */
  initializeUser: (
    userId: string,
    role: WeyaakRole,
    email: string,
    name: string,
    avatarUrl: string,
  ) => WeyaakProfile;
  /** Update defaultAgentId after agent is created */
  linkDefaultAgent: (agentId: string) => void;
  /** Update last active session */
  linkSession: (sessionId: string) => void;
  /** Touch lastSeenAt on navigation */
  touchSeen: () => void;
}

const WeyaakIdentityContext = createContext<WeyaakIdentityContextType | null>(null);

// ── Provider ─────────────────────────────────────────────────────
export function WeyaakIdentityProvider({ children }: { children: ReactNode }) {
  const [weyaakProfile, setWeyaakProfileState] = useState<WeyaakProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isIdentityReady, setIsIdentityReady] = useState(false);

  function setAndSave(p: WeyaakProfile) {
    saveProfile(p);
    setWeyaakProfileState(p);
  }

  // ── Boot: watch Supabase session ──────────────────────────────
  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session?.user ?? null);
    });

    // Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  function handleSession(user: { id: string; email?: string; user_metadata?: any } | null) {
    if (!user) {
      setUserId(null);
      setWeyaakProfileState(null);
      setIsIdentityReady(true);
      return;
    }

    setUserId(user.id);

    // Try to restore existing profile
    const existing = loadProfile(user.id);
    if (existing) {
      // Returning user — restore and touch lastSeenAt
      const updated = { ...existing, lastSeenAt: new Date().toISOString() };
      setAndSave(updated);
      setIsIdentityReady(true);
      return;
    }

    // New user — identity not yet initialized (waiting for role selection)
    // We mark identity as ready but with null profile so gate can show role selection
    setIsIdentityReady(true);
  }

  // ── Initialize new user ───────────────────────────────────────
  const initializeUser = useCallback((
    uid_: string,
    role: WeyaakRole,
    email: string,
    name: string,
    avatarUrl: string,
  ): WeyaakProfile => {
    const now = new Date().toISOString();
    const profile: WeyaakProfile = {
      userId: uid_,
      role,
      workspaceMode: role,
      email,
      name,
      avatarUrl,
      customerProfileId: role === 'customer' ? `cpid_${uid()}` : null,
      providerProfileId: role === 'provider' ? `ppid_${uid()}` : null,
      defaultAgentId: null,
      lastActiveSessionId: null,
      isNewUser: false,
      providerPresence: role === 'provider' ? {
        publicProfile: 'draft',
        providerCard: 'hidden',
        mapsPresence: 'not_started',
        discoverability: false,
      } : null,
      createdAt: now,
      lastSeenAt: now,
    };
    setAndSave(profile);
    setUserId(uid_);
    return profile;
  }, []);

  // ── Link default agent after creation ────────────────────────
  const linkDefaultAgent = useCallback((agentId: string) => {
    setWeyaakProfileState(prev => {
      if (!prev) return prev;
      const updated = { ...prev, defaultAgentId: agentId };
      saveProfile(updated);
      return updated;
    });
  }, []);

  // ── Link session ──────────────────────────────────────────────
  const linkSession = useCallback((sessionId: string) => {
    setWeyaakProfileState(prev => {
      if (!prev) return prev;
      const updated = { ...prev, lastActiveSessionId: sessionId };
      saveProfile(updated);
      return updated;
    });
  }, []);

  // ── Touch seen ────────────────────────────────────────────────
  const touchSeen = useCallback(() => {
    setWeyaakProfileState(prev => {
      if (!prev) return prev;
      const updated = { ...prev, lastSeenAt: new Date().toISOString() };
      saveProfile(updated);
      return updated;
    });
  }, []);

  const isNewUser = isIdentityReady && !!userId && !weyaakProfile;

  return (
    <WeyaakIdentityContext.Provider value={{
      weyaakProfile, userId, isIdentityReady, isNewUser,
      initializeUser, linkDefaultAgent, linkSession, touchSeen,
    }}>
      {children}
    </WeyaakIdentityContext.Provider>
  );
}

export function useWeyaakIdentity() {
  const ctx = useContext(WeyaakIdentityContext);
  if (!ctx) throw new Error('useWeyaakIdentity must be used inside WeyaakIdentityProvider');
  return ctx;
}
