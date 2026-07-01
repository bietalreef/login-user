/**
 * BrowserSession.tsx — القاعدة الذهبية
 * ─────────────────────────────────────────
 * "The Web App is a Guest Experience. The Mobile App is the Platform."
 *
 * كل مستخدم في تطبيق المتصفح = زائر (Guest)
 * بدون توثيق • بدون باقات • بدون مشاريع • بدون CRM
 *
 * Guest Capabilities:
 *   ✅ browse      — تصفح الخدمات والمزودين
 *   ✅ view        — عرض التفاصيل والملفات
 *   ✅ buy         — شراء من المتجر
 *   ✅ inquire     — إرسال استفسار / طلب سعر
 *   ✅ design      — استخدام استوديو التصميم
 *   ✅ map         — عرض خريطة المحلات
 *   ✅ guide       — وياك كدليل (شرح + اقتراح)
 *
 * Verified-Only (Mobile App):
 *   ❌ create_project
 *   ❌ manage_wallet
 *   ❌ submit_bid
 *   ❌ crm / automation
 *   ❌ weyaak_execute (تنفيذ أوامر وياك)
 *   ❌ profile_edit
 */

import { createContext, useContext, ReactNode } from 'react';

/* ═══════════════════ TYPES ═══════════════════ */
export type GuestCapability =
  | 'browse'
  | 'view'
  | 'buy'
  | 'inquire'
  | 'design'
  | 'map'
  | 'guide';

export type VerifiedCapability =
  | 'create_project'
  | 'manage_wallet'
  | 'submit_bid'
  | 'crm'
  | 'automation'
  | 'weyaak_execute'
  | 'profile_edit'
  | 'voice_projects';

export type AnyCapability = GuestCapability | VerifiedCapability;

export type Platform = 'web_guest' | 'mobile_verified';

export interface BrowserSession {
  /** Always "guest" in the browser app */
  user_type: 'guest';
  /** Platform identifier for API tagging */
  platform: 'web_guest';
  /** Guest scope areas */
  scope: readonly string[];
  /** What the guest can do */
  capabilities: readonly GuestCapability[];
  /** Check if guest can perform this action */
  canDo: (cap: AnyCapability) => boolean;
  /** Check if this action requires the mobile app */
  requiresApp: (cap: AnyCapability) => boolean;
}

/* ═══════════════════ CONSTANTS ═══════════════════ */
const GUEST_CAPABILITIES: readonly GuestCapability[] = [
  'browse', 'view', 'buy', 'inquire', 'design', 'map', 'guide',
] as const;

const GUEST_SCOPE = ['browse', 'store', 'view', 'design', 'map'] as const;

/* ═══════════════════ SESSION SINGLETON ═══════════════════ */
const guestSession: BrowserSession = {
  user_type: 'guest',
  platform: 'web_guest',
  scope: GUEST_SCOPE,
  capabilities: GUEST_CAPABILITIES,
  canDo: (cap: AnyCapability) =>
    (GUEST_CAPABILITIES as readonly string[]).includes(cap),
  requiresApp: (cap: AnyCapability) =>
    !(GUEST_CAPABILITIES as readonly string[]).includes(cap),
};

/* ═══════════════════ CONTEXT ═══════════════════ */
const BrowserSessionContext = createContext<BrowserSession>(guestSession);

export function BrowserSessionProvider({ children }: { children: ReactNode }) {
  return (
    <BrowserSessionContext.Provider value={guestSession}>
      {children}
    </BrowserSessionContext.Provider>
  );
}

export function useBrowserSession(): BrowserSession {
  return useContext(BrowserSessionContext);
}

/* ═══════════════════ HELPERS ═══════════════════ */
/**
 * Returns platform header for API calls
 * Always "web_guest" — used to tag requests server-side
 */
export function getPlatformHeaders(): Record<string, string> {
  return {
    'X-Platform': 'web_guest',
    'X-User-Type': 'guest',
  };
}

/**
 * Readable labels for capabilities (AR/EN)
 */
export function getCapabilityLabel(cap: AnyCapability, isEn: boolean): string {
  const labels: Record<string, { ar: string; en: string }> = {
    create_project: { ar: 'إنشاء مشروع', en: 'Create Project' },
    manage_wallet: { ar: 'إدارة المحفظة', en: 'Manage Wallet' },
    submit_bid: { ar: 'تقديم عرض', en: 'Submit Bid' },
    crm: { ar: 'إدارة العملاء', en: 'CRM' },
    automation: { ar: 'الأتمتة', en: 'Automation' },
    weyaak_execute: { ar: 'تنفيذ أوامر وياك', en: 'Weyaak Execution' },
    profile_edit: { ar: 'تعديل الملف الشخصي', en: 'Edit Profile' },
    voice_projects: { ar: 'المشاريع الصوتية', en: 'Voice Projects' },
  };
  return labels[cap]?.[isEn ? 'en' : 'ar'] || cap;
}
