/**
 * ServiceGate.tsx — بوابة الخدمات المحمية
 * ═══════════════════════════════════════
 * Modal/Stepper خفيف يظهر فقط عند محاولة الوصول لخدمة محمية.
 * لا يظهر تلقائياً بعد تسجيل الدخول.
 *
 * Steps (conditional):
 *   1. Role Selection (if !role_selected)
 *   2. Basic Info     (if !profile_completed)
 *   3. Verification   (if service requires it + !verified)
 *
 * بدون اخضر — ذهبي + أزرق ملكي فقط
 * كل أيقونة = Icon3D
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, ChevronLeft, ChevronRight, Shield,
  User, Briefcase, Phone, CheckCircle, Loader2,
  Lock, ArrowRight,
} from 'lucide-react';
import { useEffectiveState } from '../../contexts/EffectiveState';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { Icon3D } from '../ui/Icon3D';
import { supabase } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

const fontCairo = 'Cairo, Tajawal, sans-serif';
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

// ═══════════════════════════════════════
// Protected Service Definitions
// ═══════════════════════════════════════

export type ProtectedService =
  | 'submit_rfq'
  | 'contact_provider'
  | 'create_project'
  | 'access_workspace'
  | 'subscribe'
  | 'upload_files'
  | 'send_message'
  | 'list_business'
  | 'payment'
  | 'vip_tools'
  | 'dash_templates'
  | 'create_shop'
  | 'create_product';

interface ServiceConfig {
  labelAr: string;
  labelEn: string;
  requiresAuth: boolean;
  requiresRole: boolean;
  requiresProfile: boolean;
  requiresVerification: boolean;
  /** If true, only role='provider' or 'admin' can access. Clients are blocked. */
  providerOnly: boolean;
}

const SERVICE_CONFIGS: Record<ProtectedService, ServiceConfig> = {
  submit_rfq:        { labelAr: 'طلب عرض سعر',        labelEn: 'Submit RFQ',         requiresAuth: true, requiresRole: true,  requiresProfile: true,  requiresVerification: false, providerOnly: false },
  contact_provider:  { labelAr: 'التواصل مع مزود',     labelEn: 'Contact Provider',   requiresAuth: true, requiresRole: true,  requiresProfile: true,  requiresVerification: false, providerOnly: false },
  create_project:    { labelAr: 'إنشاء مشروع',        labelEn: 'Create Project',     requiresAuth: true, requiresRole: true,  requiresProfile: true,  requiresVerification: false, providerOnly: false },
  access_workspace:  { labelAr: 'مساحة العمل',         labelEn: 'Workspace',          requiresAuth: true, requiresRole: true,  requiresProfile: true,  requiresVerification: false, providerOnly: true  },
  subscribe:         { labelAr: 'الاشتراك',            labelEn: 'Subscribe',          requiresAuth: true, requiresRole: true,  requiresProfile: true,  requiresVerification: false, providerOnly: false },
  upload_files:      { labelAr: 'رفع ملفات',           labelEn: 'Upload Files',       requiresAuth: true, requiresRole: false, requiresProfile: true,  requiresVerification: false, providerOnly: false },
  send_message:      { labelAr: 'إرسال رسالة',         labelEn: 'Send Message',       requiresAuth: true, requiresRole: true,  requiresProfile: true,  requiresVerification: false, providerOnly: false },
  list_business:     { labelAr: 'إدراج نشاط تجاري',   labelEn: 'List Business',      requiresAuth: true, requiresRole: true,  requiresProfile: true,  requiresVerification: true,  providerOnly: true  },
  payment:           { labelAr: 'الدفع',               labelEn: 'Payment',            requiresAuth: true, requiresRole: true,  requiresProfile: true,  requiresVerification: true,  providerOnly: false },
  vip_tools:         { labelAr: 'أدوات VIP',           labelEn: 'VIP Tools',          requiresAuth: true, requiresRole: true,  requiresProfile: true,  requiresVerification: true,  providerOnly: false },
  dash_templates:    { labelAr: 'قوالب الداشبورد',     labelEn: 'Dashboard Templates',requiresAuth: true, requiresRole: true,  requiresProfile: true,  requiresVerification: false, providerOnly: true  },
  create_shop:       { labelAr: 'إنشاء متجر',         labelEn: 'Create Shop',        requiresAuth: true, requiresRole: true,  requiresProfile: true,  requiresVerification: true,  providerOnly: true  },
  create_product:    { labelAr: 'إضافة منتج',         labelEn: 'Add Product',        requiresAuth: true, requiresRole: true,  requiresProfile: true,  requiresVerification: true,  providerOnly: true  },
};

// ═══════════════════════════════════════
// Gate Check — determines which steps are needed
// ═══════════════════════════════════════

export interface GateResult {
  passed: boolean;
  missingSteps: ('login' | 'role' | 'profile' | 'verification')[];
  /** True when a client tries a provider-only service */
  blockedClientAttempt: boolean;
}

export function checkGate(
  service: ProtectedService,
  state: {
    isAuthenticated: boolean;
    role: string | null;
    onboardingCompleted: boolean;
    isVerified: boolean;
    name: string | null;
  }
): GateResult {
  const config = SERVICE_CONFIGS[service];
  if (!config) return { passed: true, missingSteps: [], blockedClientAttempt: false };

  // Provider-only check: if user is client, they are blocked entirely
  if (config.providerOnly && state.role === 'client') {
    return { passed: false, missingSteps: [], blockedClientAttempt: true };
  }

  const missing: GateResult['missingSteps'] = [];

  if (config.requiresAuth && !state.isAuthenticated) {
    missing.push('login');
  }
  if (config.requiresRole && !state.role) {
    missing.push('role');
  }
  // Profile is "completed" if onboardingCompleted OR if the user has a name set
  if (config.requiresProfile && !state.onboardingCompleted && !state.name) {
    missing.push('profile');
  }
  if (config.requiresVerification && !state.isVerified) {
    missing.push('verification');
  }

  return { passed: missing.length === 0, missingSteps: missing, blockedClientAttempt: false };
}

// ═══════════════════════════════════════
// useServiceGate — hook to trigger the gate
// ═══════════════════════════════════════

interface UseServiceGateReturn {
  /** Call this to attempt a protected action */
  attempt: (service: ProtectedService, onSuccess: () => void) => void;
  /** The modal component to render */
  GateModal: React.FC;
}

export function useServiceGate(): UseServiceGateReturn {
  const { state, refresh } = useEffectiveState();
  const [isOpen, setIsOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ProtectedService | null>(null);
  const [onSuccessRef, setOnSuccessRef] = useState<(() => void) | null>(null);

  const attempt = useCallback((service: ProtectedService, onSuccess: () => void) => {
    const result = checkGate(service, state);
    if (result.passed) {
      // All gates passed — execute immediately
      onSuccess();
    } else if (result.blockedClientAttempt) {
      // Client trying provider-only service — show blocking modal
      setCurrentService(service);
      setOnSuccessRef(null);
      setIsOpen(true);
    } else if (result.missingSteps.includes('login')) {
      toast.error('يرجى تسجيل الدخول أولاً');
    } else {
      // Open the gate modal
      setCurrentService(service);
      setOnSuccessRef(() => onSuccess);
      setIsOpen(true);
    }
  }, [state]);

  const handleComplete = useCallback(async () => {
    setIsOpen(false);
    await refresh();
    // Small delay to let state update
    setTimeout(() => {
      onSuccessRef?.();
      setCurrentService(null);
      setOnSuccessRef(null);
    }, 300);
  }, [refresh, onSuccessRef]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setCurrentService(null);
    setOnSuccessRef(null);
  }, []);

  const GateModal = useCallback(() => {
    if (!isOpen || !currentService) return null;
    return (
      <ServiceGateModal
        isOpen={isOpen}
        service={currentService}
        onComplete={handleComplete}
        onClose={handleClose}
      />
    );
  }, [isOpen, currentService, handleComplete, handleClose]);

  return { attempt, GateModal };
}

// ═══════════════════════════════════════
// ServiceGateModal — The actual modal/stepper
// ═══════════════════════════════════════

interface ServiceGateModalProps {
  isOpen: boolean;
  service: ProtectedService;
  onComplete: () => void;
  onClose: () => void;
}

function ServiceGateModal({ isOpen, service, onComplete, onClose }: ServiceGateModalProps) {
  const { state } = useEffectiveState();
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const config = SERVICE_CONFIGS[service];

  // Determine needed steps
  const result = checkGate(service, state);
  const steps = result.missingSteps.filter(s => s !== 'login'); // login handled elsewhere

  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedRole, setSelectedRole] = useState<'client' | 'provider' | null>(null);
  const [formData, setFormData] = useState({
    full_name: state.name || '',
    phone: '',
    whatsapp: '',
  });

  const activeStep = steps[currentStep] || null;
  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;

  const bgOverlay = isDark ? 'bg-black/60' : 'bg-black/40';
  const cardBg = isDark
    ? 'bg-[#1a1a2e]/95 backdrop-blur-2xl border border-white/15'
    : 'bg-white border-[4px] border-gray-200/60';
  const textMain = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const textMuted = isDark ? 'text-white/50' : 'text-[#1F3D2B]/50';
  const inputBg = isDark
    ? 'bg-white/10 border-white/15 text-white placeholder:text-white/30'
    : 'bg-[#F5EEE1]/50 border-gray-200/60 text-[#1F3D2B] placeholder:text-[#1F3D2B]/30';

  // ── Save role ──
  const saveRole = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');
      // Use onboarding/complete with minimal data to set role
      await fetch(`${API_BASE}/onboarding/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': session.access_token,
        },
        body: JSON.stringify({
          role: selectedRole,
          full_name: formData.full_name || state.name || state.email?.split('@')[0] || 'User',
          phone: formData.phone || '',
        }),
      });
    } catch (err: any) {
      console.log('ServiceGate saveRole error:', err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Save profile ──
  const saveProfile = async () => {
    if (!formData.full_name.trim()) return;
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');
      await fetch(`${API_BASE}/onboarding/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': session.access_token,
        },
        body: JSON.stringify({
          role: selectedRole || state.role || 'client',
          full_name: formData.full_name,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
        }),
      });
    } catch (err: any) {
      console.log('ServiceGate saveProfile error:', err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Handle next step ──
  const handleNext = async () => {
    if (activeStep === 'role') {
      if (!selectedRole) {
        toast.error(isEn ? 'Please select account type' : 'اختر نوع الحساب');
        return;
      }
      await saveRole();
    }
    if (activeStep === 'profile') {
      if (!formData.full_name.trim()) {
        toast.error(isEn ? 'Please enter your name' : 'أدخل اسمك');
        return;
      }
      await saveProfile();
    }
    if (activeStep === 'verification') {
      // Verification is optional for most services; skip for now
    }

    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  if (!isOpen) return null;

  // ── CLIENT BLOCKED VIEW: provider-only service ──
  if (result.blockedClientAttempt) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`fixed inset-0 ${bgOverlay} backdrop-blur-sm z-[200]`}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 40 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={`fixed inset-x-3 top-[20%] max-w-sm mx-auto ${cardBg} rounded-3xl shadow-2xl z-[201] overflow-hidden`}
          dir={isEn ? 'ltr' : 'rtl'}
          style={{ fontFamily: fontCairo }}
        >
          <div className="h-1 bg-gradient-to-r from-[#D4AF37] via-[#3B5BFE] to-[#D4AF37]" />
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <Icon3D icon={Briefcase} theme="gold" size="lg" />
            </div>
            <h3 className={`text-lg font-black mb-2 ${textMain}`}>
              {isEn ? 'Provider-Only Feature' : 'خدمة خاصة بالمزوّدين'}
            </h3>
            <p className={`text-xs leading-relaxed mb-1 ${textMuted}`}>
              {isEn
                ? `"${config.labelEn}" is available exclusively for service providers (contractors, craftsmen, companies).`
                : `"${config.labelAr}" متاحة حصرياً لمزوّدي الخدمة (مقاولين، حرفيين، شركات).`}
            </p>
            <p className={`text-[10px] leading-relaxed mb-5 ${textMuted}`}>
              {isEn
                ? 'Your account is registered as a Client. If you are a provider, you can switch your account type.'
                : 'حسابك مسجّل كعميل. إذا كنت مزوّد خدمة، يمكنك تحويل نوع حسابك.'}
            </p>
            <button
              onClick={onClose}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-colors mb-2 ${
                isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-gray-100 text-[#1F3D2B] hover:bg-gray-200'
              }`}
            >
              {isEn ? 'Got it' : 'فهمت'}
            </button>
            <p className={`text-[9px] ${textMuted}`}>
              {isEn
                ? 'To switch to provider, visit Profile > Account Settings'
                : 'للتحويل لمزوّد، زر الملف الشخصي > إعدادات الحساب'}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

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
            className={`fixed inset-0 ${bgOverlay} backdrop-blur-sm z-[200]`}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`fixed inset-x-3 top-[15%] max-w-md mx-auto ${cardBg} rounded-3xl shadow-2xl z-[201] overflow-hidden`}
            dir={isEn ? 'ltr' : 'rtl'}
            style={{ fontFamily: fontCairo }}
          >
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-[#D4AF37] via-[#3B5BFE] to-[#D4AF37]" />

            {/* Header */}
            <div className="px-5 pt-4 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Icon3D icon={Lock} theme="gold" size="sm" />
                <div>
                  <h3 className={`text-sm font-bold ${textMain}`}>
                    {isEn ? 'Complete Your Profile' : 'أكمل ملفك'}
                  </h3>
                  <p className={`text-[10px] ${textMuted}`}>
                    {isEn ? `Required for: ${config.labelEn}` : `مطلوب لـ: ${config.labelAr}`}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step indicator */}
            {totalSteps > 1 && (
              <div className="px-5 pb-3 flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full flex-1 transition-all ${
                      i <= currentStep
                        ? 'bg-[#D4AF37]'
                        : isDark ? 'bg-white/10' : 'bg-gray-200'
                    }`}
                  />
                ))}
                <span className={`text-[10px] font-bold ms-2 ${textMuted}`}>
                  {currentStep + 1}/{totalSteps}
                </span>
              </div>
            )}

            {/* Step Content */}
            <div className="px-5 pb-5">
              <AnimatePresence mode="wait">
                {activeStep === 'role' && (
                  <motion.div
                    key="role"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <p className={`text-xs font-semibold ${textMuted} mb-3`}>
                      {isEn ? 'How will you use Beit Al Reef?' : 'كيف ستستخدم بيت الريف؟'}
                    </p>

                    {/* Client Option */}
                    <button
                      onClick={() => setSelectedRole('client')}
                      className={`w-full p-4 rounded-2xl border-[4px] flex items-center gap-3 transition-all ${
                        selectedRole === 'client'
                          ? isDark
                            ? 'border-[#3B5BFE]/60 bg-[#3B5BFE]/15'
                            : 'border-[#3B5BFE]/40 bg-[#3B5BFE]/5'
                          : isDark
                            ? 'border-white/10 hover:border-white/20'
                            : 'border-gray-200/60 hover:border-gray-300'
                      }`}
                    >
                      <Icon3D icon={User} theme="blue" size="md" />
                      <div className="flex-1 text-start">
                        <h4 className={`text-sm font-bold ${textMain}`}>
                          {isEn ? 'Client' : 'عميل'}
                        </h4>
                        <p className={`text-[10px] ${textMuted}`}>
                          {isEn ? 'Looking for services & providers' : 'أبحث عن خدمات ومزودين'}
                        </p>
                      </div>
                      {selectedRole === 'client' && (
                        <CheckCircle className="w-5 h-5 text-[#3B5BFE]" />
                      )}
                    </button>

                    {/* Provider Option */}
                    <button
                      onClick={() => setSelectedRole('provider')}
                      className={`w-full p-4 rounded-2xl border-[4px] flex items-center gap-3 transition-all ${
                        selectedRole === 'provider'
                          ? isDark
                            ? 'border-[#D4AF37]/60 bg-[#D4AF37]/15'
                            : 'border-[#D4AF37]/40 bg-[#D4AF37]/5'
                          : isDark
                            ? 'border-white/10 hover:border-white/20'
                            : 'border-gray-200/60 hover:border-gray-300'
                      }`}
                    >
                      <Icon3D icon={Briefcase} theme="gold" size="md" />
                      <div className="flex-1 text-start">
                        <h4 className={`text-sm font-bold ${textMain}`}>
                          {isEn ? 'Service Provider' : 'مزود خدمة'}
                        </h4>
                        <p className={`text-[10px] ${textMuted}`}>
                          {isEn ? 'Contractor, designer, or craftsman' : 'مقاول، مصمم، أو حرفي'}
                        </p>
                      </div>
                      {selectedRole === 'provider' && (
                        <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                      )}
                    </button>
                  </motion.div>
                )}

                {activeStep === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <p className={`text-xs font-semibold ${textMuted} mb-3`}>
                      {isEn ? 'Basic info to get started' : 'معلومات أساسية للبدء'}
                    </p>

                    <div>
                      <label className={`text-[10px] font-bold ${textMuted} mb-1 block`}>
                        {isEn ? 'Full Name *' : 'الاسم الكامل *'}
                      </label>
                      <input
                        className={`w-full px-4 py-3 rounded-xl border-[4px] text-sm font-semibold ${inputBg}`}
                        value={formData.full_name}
                        onChange={e => setFormData(f => ({ ...f, full_name: e.target.value }))}
                        placeholder={isEn ? 'Your full name' : 'اسمك الكامل'}
                      />
                    </div>

                    <div>
                      <label className={`text-[10px] font-bold ${textMuted} mb-1 block`}>
                        {isEn ? 'Phone Number *' : 'رقم الجوال *'}
                      </label>
                      <input
                        className={`w-full px-4 py-3 rounded-xl border-[4px] text-sm font-semibold ${inputBg}`}
                        value={formData.phone}
                        onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+971 5X XXX XXXX"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className={`text-[10px] font-bold ${textMuted} mb-1 flex items-center gap-1`}>
                        {isEn ? 'WhatsApp (optional)' : 'واتساب (اختياري)'}
                      </label>
                      <input
                        className={`w-full px-4 py-3 rounded-xl border-[4px] text-sm font-semibold ${inputBg}`}
                        value={formData.whatsapp}
                        onChange={e => setFormData(f => ({ ...f, whatsapp: e.target.value }))}
                        placeholder="+971 5X XXX XXXX"
                        dir="ltr"
                      />
                    </div>
                  </motion.div>
                )}

                {activeStep === 'verification' && (
                  <motion.div
                    key="verification"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <p className={`text-xs font-semibold ${textMuted} mb-3`}>
                      {isEn
                        ? 'This service requires identity verification'
                        : 'هذه الخدمة تحتاج توثيق الهوية'}
                    </p>

                    <div className={`p-4 rounded-2xl border-[4px] ${
                      isDark ? 'border-white/10 bg-white/5' : 'border-gray-200/60 bg-[#F5EEE1]/30'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <Icon3D icon={Shield} theme="blue" size="md" />
                        <div>
                          <h4 className={`text-sm font-bold ${textMain}`}>
                            {isEn ? 'UAE Pass / Emirates ID' : 'هوية إماراتية / UAE Pass'}
                          </h4>
                          <p className={`text-[10px] ${textMuted}`}>
                            {isEn ? 'Secure identity verification' : 'توثيق هوية آمن'}
                          </p>
                        </div>
                      </div>
                      <p className={`text-xs ${textMuted} leading-relaxed`}>
                        {isEn
                          ? 'Verification will be available soon. You can skip this step for now and verify later.'
                          : 'التوثيق سيتوفر قريباً. يمكنك تخطي هذه الخطوة والتوثيق لاحقاً.'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-5">
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className={`px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                      isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-gray-100 text-[#1F3D2B] hover:bg-gray-200'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleNext}
                  disabled={saving || (activeStep === 'role' && !selectedRole) || (activeStep === 'profile' && !formData.full_name.trim())}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#D4AF37] to-[#C8A86A] hover:from-[#C8A86A] hover:to-[#D4AF37] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isLastStep ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {isEn ? 'Continue' : 'متابعة'}
                    </>
                  ) : (
                    <>
                      {isEn ? 'Next' : 'التالي'}
                      <ChevronLeft className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Skip hint for verification */}
              {activeStep === 'verification' && (
                <button
                  onClick={onComplete}
                  className={`w-full mt-2 py-2 text-[10px] font-bold ${textMuted} hover:underline`}
                >
                  {isEn ? 'Skip for now' : 'تخطي الآن'}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════
// ServiceGateButton — wraps a button to gate it
// ═══════════════════════════════════════

interface ServiceGateButtonProps {
  service: ProtectedService;
  onAllowed: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export function ServiceGateButton({
  service,
  onAllowed,
  children,
  className = '',
  style,
  disabled,
}: ServiceGateButtonProps) {
  const { attempt, GateModal } = useServiceGate();

  return (
    <>
      <button
        onClick={() => attempt(service, onAllowed)}
        className={className}
        style={style}
        disabled={disabled}
      >
        {children}
      </button>
      <GateModal />
    </>
  );
}

// ═══════════════════════════════════════
// ServiceGateWrapper — wraps any clickable to gate it
// ═══════════════════════════════════════

interface ServiceGateWrapperProps {
  service: ProtectedService;
  onAllowed: () => void;
  children: (props: { onClick: () => void }) => React.ReactNode;
}

export function ServiceGateWrapper({ service, onAllowed, children }: ServiceGateWrapperProps) {
  const { attempt, GateModal } = useServiceGate();

  return (
    <>
      {children({ onClick: () => attempt(service, onAllowed) })}
      <GateModal />
    </>
  );
}

export default ServiceGateModal;