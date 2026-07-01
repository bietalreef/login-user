/**
 * GuestGuard.tsx — بوابة حماية الزائر
 * ──────────────────────────────────────
 * أي فعل Verified-Only في تطبيق المتصفح
 * → يعرض CTA جميل "حمّل التطبيق واستكمل"
 * بدلاً من تنفيذ الفعل
 *
 * Updated: uses EffectiveState instead of BrowserSession
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Smartphone, Shield, ArrowLeft, Sparkles } from 'lucide-react';
import { useEffectiveState } from '../../contexts/EffectiveState';
import { useLanguage } from '../../contexts/LanguageContext';

// Re-export capability types for backward compatibility
export type AnyCapability = string;

export function getCapabilityLabel(capability: AnyCapability, isEn: boolean): string {
  const labels: Record<string, { ar: string; en: string }> = {
    create_project: { ar: 'انشاء مشروع', en: 'Create Project' },
    contact_provider: { ar: 'التواصل مع مزود', en: 'Contact Provider' },
    access_wallet: { ar: 'الوصول للمحفظة', en: 'Access Wallet' },
    manage_profile: { ar: 'ادارة الملف الشخصي', en: 'Manage Profile' },
    submit_rfq: { ar: 'طلب عرض سعر', en: 'Submit RFQ' },
  };
  return isEn ? (labels[capability]?.en || capability) : (labels[capability]?.ar || capability);
}

const f = 'Cairo, sans-serif';

/* ═══════════════════ TYPES ═══════════════════ */
interface GuestGuardProps {
  /** The capability being requested */
  capability: AnyCapability;
  /** Language */
  isEn?: boolean;
  /** If guest CAN do it, render children */
  children: React.ReactNode;
  /** Optional: custom fallback instead of download CTA */
  fallback?: React.ReactNode;
}

/* ═══════════════════ DOWNLOAD CTA MODAL ═══════════════════ */
function DownloadCTA({
  isOpen,
  onClose,
  capability,
  isEn = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  capability: AnyCapability;
  isEn?: boolean;
}) {
  const capLabel = getCapabilityLabel(capability, isEn);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden"
            dir={isEn ? 'ltr' : 'rtl'}
          >
            {/* Top gradient bar */}
            <div className="h-1.5 bg-gradient-to-l from-[#2AA676] via-[#D4AF37] to-[#2AA676]" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 end-4 w-8 h-8 bg-[#1F3D2B]/8 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-[#2AA676] to-[#1F3D2B] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#2AA676]/20">
                <Smartphone className="w-9 h-9 text-white" />
              </div>

              {/* Title */}
              <h3
                className="text-xl font-extrabold text-[#1F3D2B] mb-2"
                style={{ fontFamily: f }}
              >
                {isEn
                  ? 'This feature requires the app'
                  : 'هذي الميزة تحتاج التطبيق'}
              </h3>

              {/* What they're trying to do */}
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 text-[#8B7328] px-3 py-1.5 rounded-full text-xs font-bold mb-3"
                style={{ fontFamily: f }}>
                <Shield className="w-3.5 h-3.5" />
                {capLabel}
              </div>

              {/* Description */}
              <p
                className="text-[#1F3D2B]/50 text-sm leading-relaxed mb-6"
                style={{ fontFamily: f }}
              >
                {isEn
                  ? 'Download Beit Al Reef app to unlock full features: projects, wallet, AI agent, and much more.'
                  : 'حمّل تطبيق بيت الريف لفتح كل الميزات: المشاريع، المحفظة، الوكيل الذكي، وأكثر.'}
              </p>

              {/* Download Button */}
              <button
                className="w-full bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#2AA676]/20 hover:shadow-xl transition-all mb-3"
                style={{ fontFamily: f }}
              >
                <Download className="w-4 h-4" />
                {isEn ? 'Download the App' : 'حمّل التطبيق'}
              </button>

              {/* Continue browsing */}
              <button
                onClick={onClose}
                className="w-full py-2.5 text-sm font-bold text-[#1F3D2B]/40 hover:text-[#1F3D2B]/60 transition-colors"
                style={{ fontFamily: f }}
              >
                {isEn ? 'Continue Browsing' : 'استمر في التصفح'}
              </button>
            </div>

            {/* Features preview */}
            <div className="bg-[#F5EEE1]/50 px-6 py-4 border-t border-[#E6E0D4]">
              <p
                className="text-[10px] font-bold text-[#1F3D2B]/30 mb-2"
                style={{ fontFamily: f }}
              >
                {isEn ? 'APP EXCLUSIVE FEATURES' : 'ميزات حصرية في التطبيق'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(isEn
                  ? ['Projects', 'Wallet', 'AI Agent', 'CRM', 'Packages']
                  : ['المشاريع', 'المحفظة', 'وكيل ذكي', 'CRM', 'الباقات']
                ).map((feat) => (
                  <span
                    key={feat}
                    className="bg-white text-[#1F3D2B]/50 text-[10px] font-bold px-2 py-1 rounded-lg border border-[#E6E0D4]"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════ GUEST GUARD WRAPPER ═══════════════════ */
/**
 * Wraps content/actions — if the capability is guest-allowed, renders children.
 * If verified-only, replaces with a CTA button.
 */
export function GuestGuard({ capability, isEn = false, children, fallback }: GuestGuardProps) {
  const { state, can } = useEffectiveState();

  // Map legacy capability strings to EffectiveState feature flags
  const capabilityAllowed = mapCapability(capability, state, can);

  if (capabilityAllowed) {
    return <>{children}</>;
  }

  // Verified-only — show fallback or nothing
  return <>{fallback || null}</>; 
}

/** Map legacy capability strings to EffectiveState checks */
function mapCapability(
  capability: string,
  state: any,
  can: (key: any) => boolean
): boolean {
  switch (capability) {
    case 'create_project': return can('createProject');
    case 'contact_provider': return can('contactProviders');
    case 'access_wallet': return state.isAuthenticated;
    case 'manage_profile': return state.isAuthenticated;
    case 'submit_rfq': return can('contactProviders');
    case 'access_workspace': return can('accessWorkspace');
    case 'use_tools': return can('useTools');
    default:
      // Guest-safe capabilities (browsing, searching, etc.)
      return true;
  }
}

/* ═══════════════════ GUEST GATE BUTTON ═══════════════════ */
/**
 * A button that checks capability before executing.
 * If guest can do it → runs onClick.
 * If verified-only → shows download CTA modal.
 */
export function GuestGateButton({
  capability,
  isEn = false,
  onClick,
  children,
  className = '',
  style,
  disabled,
}: {
  capability: AnyCapability;
  isEn?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  const { state, can } = useEffectiveState();
  const [showCTA, setShowCTA] = useState(false);

  const handleClick = () => {
    if (mapCapability(capability, state, can)) {
      onClick?.();
    } else {
      setShowCTA(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={className}
        style={style}
        disabled={disabled}
      >
        {children}
      </button>
      <DownloadCTA
        isOpen={showCTA}
        onClose={() => setShowCTA(false)}
        capability={capability}
        isEn={isEn}
      />
    </>
  );
}

/* ═══════════════════ APP-ONLY REDIRECT PAGE ═══════════════════ */
/**
 * Full-page "This feature is in the app" — used as route element
 * for verified-only routes (projects, wallet, profile, etc.)
 */
export function AppOnlyPage() {
  let isEn = false;
  try {
    const { language } = useLanguage();
    isEn = language === 'en';
  } catch { /* fallback */ }

  return (
    <div
      className="min-h-[60vh] flex items-center justify-center px-4"
      dir={isEn ? 'ltr' : 'rtl'}
    >
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-[#2AA676] to-[#1F3D2B] rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#2AA676]/20">
          <Smartphone className="w-11 h-11 text-white" />
        </div>

        <h2
          className="text-2xl font-extrabold text-[#1F3D2B] mb-2"
          style={{ fontFamily: f }}
        >
          {isEn ? 'Available in the App' : 'متوفر في التطبيق'}
        </h2>

        <p
          className="text-[#1F3D2B]/40 text-sm leading-relaxed mb-6"
          style={{ fontFamily: f }}
        >
          {isEn
            ? 'This feature is exclusive to the Beit Al Reef app. Download it to manage projects, wallet, and more.'
            : 'هذي الميزة حصرية لتطبيق بيت الريف. حمّل التطبيق لإدارة المشاريع والمحفظة وأكثر.'}
        </p>

        <button
          className="bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 mx-auto shadow-lg shadow-[#2AA676]/20 hover:shadow-xl transition-all mb-4"
          style={{ fontFamily: f }}
        >
          <Download className="w-4 h-4" />
          {isEn ? 'Download Beit Al Reef' : 'حمّل بيت الريف'}
        </button>

        <div className="flex items-center justify-center gap-2 text-[#1F3D2B]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold" style={{ fontFamily: f }}>
            {isEn
              ? 'Projects • Wallet • AI Agent • CRM • Automation'
              : 'مشاريع • محفظة • وكيل ذكي • CRM • أتمتة'}
          </span>
        </div>
      </div>
    </div>
  );
}