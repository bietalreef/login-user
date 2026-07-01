/**
 * AccountSetupModal.tsx — نافذة إعداد الحساب
 * ═══════════════════════════════════════════════
 * تظهر تلقائياً لأول مرة بعد تسجيل الدخول (onboarding_completed === false)
 * المستخدم يختار دوره → يُحفظ في الـ KV → يُغلق المودال نهائياً
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Wrench, Search, ShoppingCart, Star, FileText,
  Briefcase, Users, BarChart3, Award, X, Shield,
  CheckCircle, Gift, Loader2
} from 'lucide-react';
const Crown = Award;
import { useTranslation } from '../../contexts/LanguageContext';
import { Icon3D } from './Icon3D';
import { supabase } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

const font = 'Cairo, sans-serif';
const SERVER_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

export const PENDING_ROLE_KEY = 'beit_al_reef_pending_role';

interface AccountSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEn?: boolean;
  /** السياق — يحدد الرسالة التي تظهر أعلى المودال */
  contextMessage?: string;
  /** يُستدعى بعد حفظ الدور بنجاح */
  onRoleSelected?: (role: 'client' | 'provider') => void;
}

export function AccountSetupModal({
  isOpen, onClose, isEn = false, contextMessage, onRoleSelected
}: AccountSetupModalProps) {
  const [saving, setSaving] = useState(false);

  const roles = [
    {
      id: 'client' as const,
      title: isEn ? "I'm a Client" : 'أنا عميل',
      subtitle: isEn ? 'Looking for services & providers' : 'أبحث عن خدمات ومزودين',
      icon: User,
      theme: 'blue' as const,
      gradient: 'from-[#3B5BFE]/10 to-[#3B5BFE]/3',
      borderColor: '#3B5BFE',
      btnGradient: 'from-[#3B5BFE] to-[#2845C7]',
      features: isEn
        ? ['Browse verified providers', 'Get quotes & compare', 'Rate & review services', 'Track your projects']
        : ['تصفح المزودين الموثقين', 'احصل على عروض أسعار وقارن', 'قيّم وراجع الخدمات', 'تابع مشاريعك'],
      featureIcons: [Search, FileText, Star, ShoppingCart],
    },
    {
      id: 'provider' as const,
      title: isEn ? "I'm a Service Provider" : 'أنا مزود خدمة',
      subtitle: isEn ? 'Offering my services to clients' : 'أقدم خدماتي للعملاء',
      icon: Wrench,
      theme: 'gold' as const,
      gradient: 'from-[#D4AF37]/10 to-[#D4AF37]/3',
      borderColor: '#D4AF37',
      btnGradient: 'from-[#D4AF37] to-[#B8940E]',
      features: isEn
        ? ['Create your business profile', 'Receive client requests', 'Build your portfolio', 'Grow your reputation']
        : ['أنشئ ملفك التجاري', 'استقبل طلبات العملاء', 'ابنِ معرض أعمالك', 'طوّر سمعتك المهنية'],
      featureIcons: [Briefcase, Users, BarChart3, Award],
    },
  ];

  const handleSelect = async (role: 'client' | 'provider') => {
    if (saving) return;
    setSaving(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (token) {
        // 1. Get existing profile first
        const getRes = await fetch(`${SERVER_BASE}/profile`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-User-Token': token,
          },
        });
        const existing = getRes.ok ? await getRes.json() : {};

        // 2. Save role + onboarding_completed = true
        await fetch(`${SERVER_BASE}/profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-User-Token': token,
          },
          body: JSON.stringify({
            ...existing,
            role,
            onboarding_completed: true,
          }),
        });

        // 3. Also update auth metadata
        await supabase.auth.updateUser({
          data: { role, onboarding_completed: true },
        });
      }

      onRoleSelected?.(role);
      onClose();
    } catch (err) {
      console.error('AccountSetupModal: error saving role:', err);
      // Still close on error — don't block the user
      onRoleSelected?.(role);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-3 top-[5%] bottom-[5%] z-[201] max-w-md mx-auto flex flex-col"
          >
            <div
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border-[4px] border-gray-200/60 flex flex-col max-h-full"
              dir={isEn ? 'ltr' : 'rtl'}
            >
              {/* Gold top bar */}
              <div className="h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] flex-shrink-0" />

              {/* Header */}
              <div className="px-5 pt-4 pb-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[11px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full"
                    style={{ fontFamily: font }}
                  >
                    1/3
                  </span>
                </div>
                <h2 className="text-lg font-black text-[#1F3D2B]" style={{ fontFamily: font }}>
                  {isEn ? 'Account Setup' : 'إعداد الحساب'}
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Context Message */}
              {contextMessage && (
                <div className="px-5 pb-2 flex-shrink-0">
                  <div className="bg-[#3B5BFE]/5 border border-[#3B5BFE]/15 rounded-xl px-3 py-2 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#3B5BFE] flex-shrink-0" />
                    <p className="text-[11px] font-bold text-[#3B5BFE]/70" style={{ fontFamily: font }}>
                      {contextMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-5 pb-4">
                {/* Role Cards */}
                <div className="space-y-3 mt-1">
                  {roles.map((role, idx) => (
                    <motion.div
                      key={role.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.1 }}
                      className={`bg-gradient-to-br ${role.gradient} rounded-2xl overflow-hidden border-[3px] border-gray-200/50 hover:border-gray-300/70 transition-all`}
                    >
                      {/* Top: Icon + Title */}
                      <div className="p-4 flex items-center gap-3">
                        <Icon3D icon={role.icon} theme={role.theme} size="md" hoverable={false} />
                        <div className="flex-1">
                          <h3 className="text-lg font-black text-[#1F3D2B]" style={{ fontFamily: font }}>
                            {role.title}
                          </h3>
                          <p className="text-xs text-[#1F3D2B]/50 font-semibold" style={{ fontFamily: font }}>
                            {role.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="px-4 pb-3 space-y-2">
                        {role.features.map((feature, i) => {
                          const FeatureIcon = role.featureIcons[i];
                          return (
                            <div key={i} className="flex items-center gap-2.5">
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: `${role.borderColor}12` }}
                              >
                                <FeatureIcon className="w-3.5 h-3.5" style={{ color: role.borderColor }} />
                              </div>
                              <span className="text-[13px] font-semibold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                                {feature}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Select Button */}
                      <div className="px-4 pb-4">
                        <button
                          onClick={() => handleSelect(role.id)}
                          disabled={saving}
                          className={`w-full py-3 rounded-xl text-center font-bold text-white text-sm shadow-md active:scale-[0.97] transition-all bg-gradient-to-r ${role.btnGradient} border-2 border-white/20 flex items-center justify-center gap-2 disabled:opacity-70`}
                          style={{ fontFamily: font }}
                        >
                          {saving ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {isEn ? 'Saving...' : 'جاري الحفظ...'}
                            </>
                          ) : (
                            isEn ? 'Select' : 'اختيار'
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Zero Commission Promise */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-black text-[#D4AF37]" style={{ fontFamily: font }}>
                      {isEn ? 'Beit Al Reef Promise' : 'وعد بيت الريف'}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {(isEn ? [
                      'No commission — ever',
                      'No hidden fees',
                      'No extra charges',
                    ] : [
                      'لا عمولة — أبداً',
                      'لا مبالغ مخفية',
                      'لا رسوم إضافية',
                    ]).map((text, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="text-[11px] font-bold text-[#1F3D2B]/60" style={{ fontFamily: font }}>
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-[#D4AF37] mt-2" style={{ fontFamily: font }}>
                    {isEn ? 'Just subscribe & appear professionally' : 'فقط اشترك واظهر باحترافية'}
                  </p>
                </motion.div>

                {/* Note */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-[10px] text-[#1F3D2B]/25 font-bold mt-3"
                  style={{ fontFamily: font }}
                >
                  {isEn
                    ? 'You can change your account type later from Settings'
                    : 'يمكنك تغيير نوع حسابك لاحقاً من الإعدادات'}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
