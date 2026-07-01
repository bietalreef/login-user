/**
 * useSmartUI.ts — هوك الواجهة الذكية
 * ═══════════════════════════════════════
 * يجلب سياق المستخدم من السيرفر ويوفر:
 * - حالة المستخدم (زائر/مسجل/مزود)
 * - الباقة الحالية والصلاحيات
 * - Feature flags ذكية
 * - دوال مساعدة للتحقق
 */

import { useState, useEffect, useCallback } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';

const SERVER_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

export interface SmartUIFeatures {
  canBrowse: boolean;
  canSearch: boolean;
  canViewProviders: boolean;
  canContactProviders: boolean;
  canCreateProject: boolean;
  canUseTools: boolean;
  canAccessWorkspace: boolean;
  canListBusiness: boolean;
  maxDocuments: number;  // -1 = unlimited
  aiCredits: number;
  canExport?: boolean;
  canCustomBrand?: boolean;
  canAdvancedAnalytics?: boolean;
}

export interface SmartUIContext {
  isGuest: boolean;
  userId?: string;
  email?: string;
  name?: string;
  avatar?: string;
  role?: 'client' | 'provider' | 'admin' | null;
  tier: 'guest' | 'free' | 'pro' | 'enterprise';
  isVerified: boolean;
  onboardingCompleted?: boolean;
  subscription: {
    plan: string;
    status: string;
    expiresAt?: string;
  };
  features: SmartUIFeatures;
}

const DEFAULT_GUEST_CONTEXT: SmartUIContext = {
  isGuest: true,
  role: null,
  tier: 'guest',
  isVerified: false,
  subscription: { plan: 'free', status: 'none' },
  features: {
    canBrowse: true,
    canSearch: true,
    canViewProviders: true,
    canContactProviders: false,
    canCreateProject: false,
    canUseTools: false,
    canAccessWorkspace: false,
    canListBusiness: false,
    maxDocuments: 0,
    aiCredits: 0,
  },
};

let cachedContext: SmartUIContext | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useSmartUI() {
  const [context, setContext] = useState<SmartUIContext>(cachedContext || DEFAULT_GUEST_CONTEXT);
  const [isLoading, setIsLoading] = useState(!cachedContext);

  const fetchContext = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const headers: Record<string, string> = {
        'Authorization': `Bearer ${publicAnonKey}`,
      };
      if (token) {
        headers['X-User-Token'] = token;
      }

      const res = await fetch(`${SERVER_BASE}/user/context`, { headers });
      const data = await res.json();

      const ctx: SmartUIContext = {
        isGuest: data.isGuest ?? true,
        userId: data.userId,
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        role: data.role || null,
        tier: data.tier || 'guest',
        isVerified: data.isVerified || false,
        onboardingCompleted: data.onboardingCompleted,
        subscription: data.subscription || { plan: 'free', status: 'none' },
        features: {
          canBrowse: true,
          canSearch: true,
          canViewProviders: true,
          canContactProviders: data.features?.canContactProviders ?? false,
          canCreateProject: data.features?.canCreateProject ?? false,
          canUseTools: data.features?.canUseTools ?? false,
          canAccessWorkspace: data.features?.canAccessWorkspace ?? false,
          canListBusiness: data.features?.canListBusiness ?? false,
          maxDocuments: data.features?.maxDocuments ?? 0,
          aiCredits: data.features?.aiCredits ?? 0,
          canExport: data.features?.canExport,
          canCustomBrand: data.features?.canCustomBrand,
          canAdvancedAnalytics: data.features?.canAdvancedAnalytics,
        },
      };

      cachedContext = ctx;
      cacheTimestamp = Date.now();
      setContext(ctx);
    } catch (err) {
      console.warn('SmartUI context fetch failed:', err);
      // Keep existing context or default
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check cache freshness
    if (cachedContext && Date.now() - cacheTimestamp < CACHE_TTL) {
      setContext(cachedContext);
      setIsLoading(false);
      return;
    }
    fetchContext();
  }, [fetchContext]);

  // Helper functions
  const isGuest = context.isGuest;
  const isRegistered = !context.isGuest;
  const isProvider = context.role === 'provider';
  const isClient = context.role === 'client';
  const isPro = context.tier === 'pro' || context.tier === 'enterprise';
  const isEnterprise = context.tier === 'enterprise';
  const isFree = context.tier === 'free' || context.tier === 'guest';

  const canAccess = useCallback((feature: keyof SmartUIFeatures): boolean => {
    return !!context.features[feature];
  }, [context]);

  const getTierLabel = useCallback((isEn: boolean): string => {
    const labels: Record<string, { ar: string; en: string }> = {
      guest: { ar: 'زائر', en: 'Guest' },
      free: { ar: 'مجاني', en: 'Free' },
      pro: { ar: 'احترافي', en: 'Pro' },
      enterprise: { ar: 'مؤسسات', en: 'Enterprise' },
    };
    return isEn ? (labels[context.tier]?.en || 'Free') : (labels[context.tier]?.ar || 'مجاني');
  }, [context.tier]);

  const getTierColor = useCallback((): string => {
    const colors: Record<string, string> = {
      guest: '#6B7280',
      free: '#D4AF37',
      pro: '#3B5BFE',
      enterprise: '#C8A86A',
    };
    return colors[context.tier] || '#D4AF37';
  }, [context.tier]);

  const refreshContext = useCallback(() => {
    cachedContext = null;
    cacheTimestamp = 0;
    setIsLoading(true);
    fetchContext();
  }, [fetchContext]);

  return {
    context,
    isLoading,
    isGuest,
    isRegistered,
    isProvider,
    isClient,
    isPro,
    isEnterprise,
    isFree,
    canAccess,
    getTierLabel,
    getTierColor,
    refreshContext,
  };
}
