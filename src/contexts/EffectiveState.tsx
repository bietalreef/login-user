/**
 * EffectiveState.tsx — مصدر الحقيقة الوحيد لقرارات الواجهة
 * ═══════════════════════════════════════════════════════════
 * READ-ONLY provider — يحل محل useSmartUI + BrowserSession + usePermissionGuard
 * لا يحل محل UserContext (الكتابة تبقى هناك)
 *
 * Hydration:
 *   1. supabase.auth.getSession() → userId
 *   2. GET /user/context           → single server truth
 *
 * Rules:
 *   - Cache = 0 (always fresh in P0)
 *   - isReady = false until hydration completes
 *   - Auth listener re-hydrates on login/logout
 *   - All UI gating reads from this provider ONLY
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const SERVER_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

// ─── Retry-aware fetch helper ───
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2,
  delay = 1500,
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // 10-second timeout per attempt — avoids hanging on cold-start
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10_000);
      try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timer);
        return res;
      } finally {
        clearTimeout(timer);
      }
    } catch (err) {
      const isNetwork =
        err instanceof TypeError ||
        (err instanceof DOMException && err.name === 'AbortError');

      if (attempt === retries) throw err;

      // Log only on first retry and only at debug level — cold starts are expected
      if (attempt === 0 && isNetwork) {
        console.debug(
          `EffectiveState: server cold-start detected, retrying in ${delay}ms…`,
        );
      } else if (!isNetwork) {
        console.warn(
          `EffectiveState fetch attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
        );
      }
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error('fetchWithRetry: unreachable');
}

// ─── Feature Keys (P0 — fixed set) ───
export interface FeatureFlags {
  accessWorkspace: boolean;
  contactProviders: boolean;
  createProject: boolean;
  useTools: boolean;
  listBusiness: boolean;
  viewPlans: boolean;        // derived: true when subscription is NOT active
  canExport: boolean;
  canCustomBrand: boolean;
  canAdvancedAnalytics: boolean;
}

// ─── Subscription Snapshot ───
export interface SubscriptionState {
  plan: string;
  status: 'none' | 'trial' | 'active' | 'expired' | 'cancelled' | 'free';
  expiresAt: string | null;
  isActive: boolean;         // computed: status in ['active', 'trial']
}

// ─── The Single State Object ───
export interface EffectiveState {
  // Core Identity
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  name: string | null;
  avatar: string | null;

  // Role & Tier
  role: 'client' | 'provider' | 'admin' | null;
  tier: 'guest' | 'free' | 'verified' | 'pro' | 'enterprise';

  // Verification
  isVerified: boolean;

  // Onboarding
  onboardingCompleted: boolean;

  // Subscription
  subscription: SubscriptionState;

  // Entitlements (computed from server response)
  can: FeatureFlags;
}

// ─── Default Guest State ───
const GUEST_STATE: EffectiveState = {
  isAuthenticated: false,
  userId: null,
  email: null,
  name: null,
  avatar: null,
  role: null,
  tier: 'guest',
  isVerified: false,
  onboardingCompleted: false,
  subscription: {
    plan: 'free',
    status: 'none',
    expiresAt: null,
    isActive: false,
  },
  can: {
    accessWorkspace: false,
    contactProviders: false,
    createProject: false,
    useTools: false,
    listBusiness: false,
    viewPlans: true,          // guests CAN view plans (to convert)
    canExport: false,
    canCustomBrand: false,
    canAdvancedAnalytics: false,
  },
};

// ─── Context Type ───
interface EffectiveStateContextType {
  state: EffectiveState;
  isReady: boolean;
  refresh: () => Promise<void>;
  can: (key: keyof FeatureFlags) => boolean;
}

const EffectiveStateCtx = createContext<EffectiveStateContextType | undefined>(
  undefined,
);

// ─── Provider ───
export function EffectiveStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EffectiveState>(GUEST_STATE);
  const [isReady, setIsReady] = useState(false);

  // ── Hydrate from server ──
  const hydrate = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        // No session → guest
        setState(GUEST_STATE);
        setIsReady(true);
        return;
      }

      // Fetch single source of truth
      const res = await fetchWithRetry(`${SERVER_BASE}/user/context`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          'X-User-Token': session.access_token,
        },
      });

      if (!res.ok) {
        console.warn(
          `EffectiveState: /user/context returned ${res.status}`,
        );
        // Authenticated but server error — set authenticated with defaults
        setState({
          ...GUEST_STATE,
          isAuthenticated: true,
          userId: session.user?.id ?? null,
          email: session.user?.email ?? null,
        });
        setIsReady(true);
        return;
      }

      const data = await res.json();

      // ── Compute subscription ──
      const subStatus: SubscriptionState['status'] =
        data.subscription?.status || 'none';
      const subIsActive =
        subStatus === 'active' || subStatus === 'trial';

      // ── Compute features ──
      const features = data.features || {};

      const newState: EffectiveState = {
        isAuthenticated: !data.isGuest,
        userId: data.userId || null,
        email: data.email || null,
        name: data.name || null,
        avatar: data.avatar || null,
        role: data.role || null,
        tier: data.tier || 'guest',
        isVerified: data.isVerified || false,
        onboardingCompleted: data.onboardingCompleted || false,
        subscription: {
          plan: data.subscription?.plan || 'free',
          status: subStatus,
          expiresAt: data.subscription?.expiresAt || null,
          isActive: subIsActive,
        },
        can: {
          // Workspace access: derived locally (NOT from server's canAccessWorkspace)
          // Rule: authenticated + onboarded + valid role
          accessWorkspace:
            !data.isGuest &&
            (data.onboardingCompleted || false) &&
            ['client', 'provider', 'admin'].includes(data.role || ''),

          contactProviders: features.canContactProviders ?? false,
          createProject: features.canCreateProject ?? false,
          useTools: features.canUseTools ?? false,
          listBusiness: features.canListBusiness ?? false,

          // viewPlans: true if subscription is NOT active (user should see upgrade options)
          viewPlans: !subIsActive,

          canExport: features.canExport ?? false,
          canCustomBrand: features.canCustomBrand ?? false,
          canAdvancedAnalytics: features.canAdvancedAnalytics ?? false,
        },
      };

      setState(newState);
      setIsReady(true);
    } catch (err) {
      console.warn('EffectiveState: hydration fetch failed after retries (falling back to local session):', (err as Error)?.message || err);
      // On error — try to use local session info so we're not fully guest
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setState({
            ...GUEST_STATE,
            isAuthenticated: true,
            userId: session.user.id ?? null,
            email: session.user.email ?? null,
            name: session.user.user_metadata?.name ?? session.user.user_metadata?.full_name ?? null,
            avatar: session.user.user_metadata?.avatar_url ?? null,
            role: session.user.user_metadata?.role ?? null,
            can: {
              ...GUEST_STATE.can,
              useTools: true,
              contactProviders: true,
            },
          });
        } else {
          setState(GUEST_STATE);
        }
      } catch {
        setState(GUEST_STATE);
      }
      setIsReady(true);
    }
  }, []);

  // ── Initial hydration ──
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // ── Auth listener — re-hydrate on login/logout ──
  useEffect(() => {
    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        // Reset ready flag so loading gate re-engages
        setIsReady(false);
        hydrate();
      }
      // TOKEN_REFRESHED → no-op (keep current state)
    });

    return () => {
      authSub.unsubscribe();
    };
  }, [hydrate]);

  // ── Public refresh (for after subscription change, verification, etc.) ──
  const refresh = useCallback(async () => {
    setIsReady(false);
    await hydrate();
  }, [hydrate]);

  // ── Feature check shorthand ──
  const can = useCallback(
    (key: keyof FeatureFlags): boolean => {
      return !!state.can[key];
    },
    [state],
  );

  return (
    <EffectiveStateCtx.Provider value={{ state, isReady, refresh, can }}>
      {children}
    </EffectiveStateCtx.Provider>
  );
}

// ─── Hook ───
export function useEffectiveState() {
  const ctx = useContext(EffectiveStateCtx);
  if (!ctx) {
    throw new Error(
      'useEffectiveState must be used within EffectiveStateProvider',
    );
  }
  return ctx;
}