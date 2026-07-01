/**
 * OnboardingScreen.tsx — شاشة التهيئة الإلزامية للمستخدمين الجدد
 * ═══════════════════════════════════════════════════════════════
 * Route: /onboarding  (بعد أي تسجيل دخول لأول مرة)
 * Flow:  من أنت؟ → نوع الحساب (للمزودين) → إكمال البيانات → /home
 * Theme: Dark Frosted Glass + Gold (#D4AF37) + Blue (#3B5BFE)
 * Rules: لا أخضر | لا إيموجي | أيقونات lucide-react فقط
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router@7.1.1';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../utils/supabase/client';
import { toast } from 'sonner@2.0.3';
import {
  UserCircle, Briefcase, Building2, Wrench, ChevronLeft,
  Phone, MapPin, CheckCircle, Loader2, ArrowLeft, Shield,
  Star, Award, BadgeCheck, Users, Home, Hammer, Sparkles,
  ChevronRight,
} from 'lucide-react';
import type { UserType, ProviderType } from '../../App';

const font = 'Cairo, Tajawal, sans-serif';

// ── UAE Cities
const UAE_CITIES = [
  { value: 'dubai', label: 'دبي' },
  { value: 'abu-dhabi', label: 'أبوظبي' },
  { value: 'sharjah', label: 'الشارقة' },
  { value: 'ajman', label: 'عجمان' },
  { value: 'ras-al-khaimah', label: 'رأس الخيمة' },
  { value: 'fujairah', label: 'الفجيرة' },
  { value: 'umm-al-quwain', label: 'أم القيوين' },
  { value: 'al-ain', label: 'العين' },
];

// ── Specialties for providers
const PROVIDER_SPECIALTIES = [
  'مقاولات البناء', 'التصميم الداخلي', 'الكهرباء', 'السباكة',
  'التكييف والتبريد', 'الرخام والسيراميك', 'الدهانات', 'النجارة',
  'الحدادة والألمنيوم', 'الصيانة العامة', 'التنظيف', 'المواد الإنشائية',
];

// ══════════════════════════════════════
// Step indicator
// ══════════════════════════════════════
function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-500 ${
            i < current
              ? 'bg-[#D4AF37] w-8'
              : i === current
              ? 'bg-[#D4AF37]/70 w-6'
              : 'bg-white/15 w-4'
          }`}
        />
      ))}
    </div>
  );
}

// ══════════════════════════════════════
// STEP 1 — من أنت؟ (مستخدم أم مزود)
// ══════════════════════════════════════
function StepWhoAreYou({
  onSelectClient,
  onSelectProvider,
}: {
  onSelectClient: () => void;
  onSelectProvider: () => void;
}) {
  return (
    <motion.div
      key="who"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="w-full"
    >
      <StepBar current={0} total={3} />

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#3B5BFE]/10 border border-[#D4AF37]/20 mb-4">
          <Users className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">من أنت؟</h1>
        <p className="text-white/50 text-sm">اختر نوع حسابك لنخصّص تجربتك</p>
      </div>

      <div className="space-y-3">
        {/* Client */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectClient}
          className="w-full relative group"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D4AF37]/10 to-[#C8A86A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
          <div className="relative flex items-center gap-4 p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-[#D4AF37]/40 transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#C8A86A]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
              <Home className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="text-white font-black text-base mb-0.5">أنا مستخدم / عميل</h3>
              <p className="text-white/40 text-xs font-bold">أبحث عن مقاول أو خدمة بناء أو تشطيب</p>
            </div>
            <ChevronLeft className="w-5 h-5 text-white/20 group-hover:text-[#D4AF37] transition-colors" />
          </div>
        </motion.button>

        {/* Provider */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectProvider}
          className="w-full relative group"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#3B5BFE]/10 to-[#3B5BFE]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
          <div className="relative flex items-center gap-4 p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-[#3B5BFE]/40 transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3B5BFE]/20 to-[#3B5BFE]/5 border border-[#3B5BFE]/20 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-7 h-7 text-[#3B5BFE]" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="text-white font-black text-base mb-0.5">أنا مزود خدمة</h3>
              <p className="text-white/40 text-xs font-bold">شركة أو حرفي يقدم خدمات البناء والتشطيب</p>
            </div>
            <ChevronLeft className="w-5 h-5 text-white/20 group-hover:text-[#3B5BFE] transition-colors" />
          </div>
        </motion.button>
      </div>

      {/* Trust badges */}
      <div className="flex justify-center gap-4 mt-8 flex-wrap">
        {[
          { icon: Shield, text: 'آمن ومشفر' },
          { icon: Star, text: '+200 مزود موثق' },
          { icon: Award, text: 'مرخص في الإمارات' },
        ].map((b, i) => (
          <div key={i} className="flex items-center gap-1.5 text-white/30 text-xs font-bold">
            <b.icon className="w-3.5 h-3.5 text-[#D4AF37]/50" />
            {b.text}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════
// STEP 2 — نوع مزود الخدمة
// ══════════════════════════════════════
function StepProviderType({
  onBack,
  onSelectCompany,
  onSelectCraftsman,
}: {
  onBack: () => void;
  onSelectCompany: () => void;
  onSelectCraftsman: () => void;
}) {
  return (
    <motion.div
      key="providerType"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="w-full"
    >
      <StepBar current={1} total={3} />

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 text-sm font-bold"
      >
        <ChevronRight className="w-4 h-4" />
        رجوع
      </button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B5BFE]/20 to-[#D4AF37]/10 border border-[#3B5BFE]/20 mb-4">
          <Briefcase className="w-8 h-8 text-[#3B5BFE]" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">نوع حساب المزود</h1>
        <p className="text-white/50 text-sm">حدد نوع عملك لنوفر لك الأدوات المناسبة</p>
      </div>

      <div className="space-y-3">
        {/* Company */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectCompany}
          className="w-full relative group"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D4AF37]/10 to-[#C8A86A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
          <div className="relative flex items-center gap-4 p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-[#D4AF37]/40 transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#C8A86A]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="text-white font-black text-base mb-0.5">شركة برخصة تجارية</h3>
              <p className="text-white/40 text-xs font-bold">منشأة مسجلة بسجل تجاري ورخصة مزاولة</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[9px] font-black text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/20">مزايا إضافية</span>
              <ChevronLeft className="w-4 h-4 text-white/20 group-hover:text-[#D4AF37] transition-colors" />
            </div>
          </div>
        </motion.button>

        {/* Craftsman */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectCraftsman}
          className="w-full relative group"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#3B5BFE]/10 to-[#3B5BFE]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
          <div className="relative flex items-center gap-4 p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-[#3B5BFE]/40 transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3B5BFE]/20 to-[#3B5BFE]/5 border border-[#3B5BFE]/20 flex items-center justify-center flex-shrink-0">
              <Hammer className="w-7 h-7 text-[#3B5BFE]" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="text-white font-black text-base mb-0.5">حرفي أو عامل ماهر</h3>
              <p className="text-white/40 text-xs font-bold">فرد متخصص أو فريق صغير بدون رخصة رسمية</p>
            </div>
            <ChevronLeft className="w-4 h-4 text-white/20 group-hover:text-[#3B5BFE] transition-colors" />
          </div>
        </motion.button>
      </div>

      {/* Provider perks */}
      <div className="mt-6 p-4 bg-[#3B5BFE]/5 border border-[#3B5BFE]/15 rounded-xl">
        <p className="text-[#3B5BFE] text-xs font-black mb-2 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          مميزات حساب مزود الخدمة
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {['لوحة تحكم متكاملة', 'إدارة الطلبات', 'عروض الأسعار', 'تقييمات العملاء'].map((f) => (
            <div key={f} className="flex items-center gap-1.5 text-white/40 text-xs font-bold">
              <CheckCircle className="w-3 h-3 text-[#D4AF37]/60 flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════
// STEP 3 — إكمال البيانات
// ══════════════════════════════════════
function StepCompleteProfile({
  userType,
  providerType,
  onBack,
  onComplete,
}: {
  userType: UserType;
  providerType: ProviderType;
  onBack: () => void;
  onComplete: (data: ProfileData) => Promise<void>;
}) {
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [saving, setSaving] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const isProvider = userType === 'provider';
  const isCompany = providerType === 'company';

  const canSubmit = phone.length >= 9 && city !== '' && displayName.trim().length >= 2;

  const handleSubmit = async () => {
    if (!canSubmit || saving) return;
    setSaving(true);
    try {
      await onComplete({
        phone,
        city,
        displayName,
        businessName: isCompany ? businessName : displayName,
        specialty,
      });
    } finally {
      setSaving(false);
    }
  };

  const inputBase = `w-full px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 outline-none
    bg-white/5 border text-white placeholder-white/20
  `;
  const inputFocus = (field: string) =>
    focused === field
      ? 'border-[#D4AF37]/50 bg-white/8 shadow-[0_0_0_3px_rgba(212,175,55,0.08)]'
      : 'border-white/10 hover:border-white/20';

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="w-full"
    >
      <StepBar current={2} total={3} />

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 text-sm font-bold"
      >
        <ChevronRight className="w-4 h-4" />
        رجوع
      </button>

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/20 mb-4">
          <BadgeCheck className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">
          {isProvider ? 'بيانات مزود الخدمة' : 'أكمل ملفك الشخصي'}
        </h1>
        <p className="text-white/50 text-sm">
          {isProvider
            ? 'هذه البيانات ستظهر لعملائك على المنصة'
            : 'خطوة أخيرة لنبدأ تجربتك في بيت الريف'}
        </p>
      </div>

      <div className="space-y-3">
        {/* Display Name */}
        <div>
          <label className="block text-white/50 text-xs font-black mb-1.5 text-right">
            {isCompany ? 'اسم صاحب الحساب' : 'الاسم الكامل'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              placeholder={isCompany ? 'محمد العامري' : 'أدخل اسمك الكامل'}
              className={`${inputBase} ${inputFocus('name')}`}
              dir="rtl"
              style={{ fontFamily: font }}
            />
          </div>
        </div>

        {/* Business Name for companies */}
        {isCompany && (
          <div>
            <label className="block text-white/50 text-xs font-black mb-1.5 text-right">
              اسم الشركة / المنشأة
            </label>
            <div className="relative">
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                onFocus={() => setFocused('business')}
                onBlur={() => setFocused(null)}
                placeholder="شركة النخبة للمقاولات"
                className={`${inputBase} ${inputFocus('business')}`}
                dir="rtl"
                style={{ fontFamily: font }}
              />
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            </div>
          </div>
        )}

        {/* Phone */}
        <div>
          <label className="block text-white/50 text-xs font-black mb-1.5 text-right">
            رقم الهاتف
          </label>
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
              onFocus={() => setFocused('phone')}
              onBlur={() => setFocused(null)}
              placeholder="+971 50 123 4567"
              className={`${inputBase} pr-4 pl-10 ${inputFocus('phone')}`}
              dir="ltr"
              style={{ fontFamily: font }}
            />
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-white/50 text-xs font-black mb-1.5 text-right">
            المدينة / الإمارة
          </label>
          <div className="relative">
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              onFocus={() => setFocused('city')}
              onBlur={() => setFocused(null)}
              className={`${inputBase} ${inputFocus('city')} appearance-none`}
              dir="rtl"
              style={{ fontFamily: font }}
            >
              <option value="" className="bg-[#0F172A] text-white/50">اختر الإمارة</option>
              {UAE_CITIES.map(c => (
                <option key={c.value} value={c.value} className="bg-[#0F172A] text-white">
                  {c.label}
                </option>
              ))}
            </select>
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
          </div>
        </div>

        {/* Specialty for providers */}
        {isProvider && (
          <div>
            <label className="block text-white/50 text-xs font-black mb-1.5 text-right">
              التخصص الرئيسي
            </label>
            <div className="relative">
              <select
                value={specialty}
                onChange={e => setSpecialty(e.target.value)}
                onFocus={() => setFocused('specialty')}
                onBlur={() => setFocused(null)}
                className={`${inputBase} ${inputFocus('specialty')} appearance-none`}
                dir="rtl"
                style={{ fontFamily: font }}
              >
                <option value="" className="bg-[#0F172A] text-white/50">اختر تخصصك</option>
                {PROVIDER_SPECIALTIES.map(s => (
                  <option key={s} value={s} className="bg-[#0F172A] text-white">{s}</option>
                ))}
              </select>
              <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Privacy note */}
      <p className="text-center text-white/25 text-xs font-bold mt-4 flex items-center justify-center gap-1.5">
        <Shield className="w-3 h-3 text-[#D4AF37]/40" />
        بياناتك محمية ومشفرة بأعلى معايير الأمان
      </p>

      {/* Submit */}
      <motion.button
        whileHover={canSubmit ? { scale: 1.02 } : {}}
        whileTap={canSubmit ? { scale: 0.98 } : {}}
        onClick={handleSubmit}
        disabled={!canSubmit || saving}
        className={`w-full mt-5 py-4 rounded-xl font-black text-base flex items-center justify-center gap-3 transition-all duration-300 ${
          canSubmit && !saving
            ? 'bg-gradient-to-r from-[#D4AF37] to-[#C8A86A] text-[#1F3D2B] shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30'
            : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
        }`}
        style={{ fontFamily: font }}
      >
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            جاري الحفظ...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            {isProvider ? 'ابدأ كمزود خدمة' : 'ابدأ الاستكشاف'}
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

// ══════════════════════════════════════
// STEP 4 — شاشة الترحيب (بعد الإكمال)
// ══════════════════════════════════════
function StepWelcomeDone({ userType }: { userType: UserType }) {
  const isProvider = userType === 'provider';
  return (
    <motion.div
      key="done"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full text-center py-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-[#D4AF37] to-[#C8A86A] shadow-xl shadow-[#D4AF37]/30 mb-6"
      >
        <CheckCircle className="w-12 h-12 text-[#1F3D2B]" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-3xl font-black text-white mb-3"
      >
        {isProvider ? 'حسابك جاهز!' : 'مرحباً بك!'}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="text-white/50 text-sm font-bold mb-8 max-w-xs mx-auto leading-relaxed"
      >
        {isProvider
          ? 'تم إنشاء حسابك كمزود خدمة بنجاح. استكشف لوحة التحكم وابدأ باستقبال الطلبات.'
          : 'تم إنشاء حسابك بنجاح. استكشف مزودي الخدمات وابدأ مشروعك.'}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {(isProvider
          ? ['لوحة التحكم', 'إضافة خدمة', 'إعدادات الحساب']
          : ['استعراض الخدمات', 'المتجر', 'الأدوات الذكية']
        ).map((item, i) => (
          <div
            key={i}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-black"
          >
            {item}
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-8 flex items-center justify-center gap-2 text-white/20 text-xs font-bold"
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]/50" />
        جاري التوجيه...
      </motion.div>
    </motion.div>
  );
}

// ══════════════════════════════════════
// Profile Data type
// ══════════════════════════════════════
interface ProfileData {
  phone: string;
  city: string;
  displayName: string;
  businessName: string;
  specialty: string;
}

// ══════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════
type OnboardingStep = 'who' | 'providerType' | 'profile' | 'done';

export function OnboardingScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>('who');
  const [userType, setUserType] = useState<UserType>(null);
  const [providerType, setProviderType] = useState<ProviderType>(null);

  // Guard: check session
  const handleSelectClient = () => {
    setUserType('client');
    setProviderType(null);
    setStep('profile');
  };

  const handleSelectProvider = () => {
    setUserType('provider');
    setStep('providerType');
  };

  const handleSelectCompany = () => {
    setProviderType('company');
    setStep('profile');
  };

  const handleSelectCraftsman = () => {
    setProviderType('craftsman');
    setStep('profile');
  };

  const handleCompleteProfile = async (data: ProfileData) => {
    try {
      // 1️⃣ Get current authenticated user
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) throw userErr ?? new Error('لم يتم العثور على المستخدم');

      // 2️⃣ Convert city value → Arabic label for searchability
      const cityLabel = UAE_CITIES.find(c => c.value === data.city)?.label ?? data.city;

      // 3️⃣ Update auth metadata (for session/guards)
      const { error: authErr } = await supabase.auth.updateUser({
        data: {
          onboarding_complete: true,
          role: userType,
          provider_type: providerType,
          phone: data.phone,
          city: cityLabel,
          full_name: data.displayName,
          business_name: data.businessName,
          specialty: data.specialty,
        },
      });
      if (authErr) throw authErr;

      // 4️⃣ Upsert directly into profiles table — هذا هو المصدر الحقيقي للبحث
      const { error: profileErr } = await supabase.from('profiles').upsert(
        {
          id: user.id,
          role: userType,                          // 'provider' | 'client'
          provider_type: providerType ?? null,      // 'company' | 'craftsman'
          full_name: data.displayName,
          business_name: data.businessName || data.displayName,
          phone: data.phone,
          whatsapp: data.phone,                    // افتراضياً نفس الهاتف
          city: cityLabel,                         // 'العين' | 'دبي' | ...
          services: data.specialty || null,         // التخصص
          verified: false,
          rating: null,
          review_count: 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

      if (profileErr) {
        // لا نوقف العملية — فقط نسجّل الخطأ ونكمل
        console.error('OnboardingScreen: profiles upsert error', profileErr);
      }

      setStep('done');

      // Navigate to home after 2.5 seconds
      setTimeout(() => {
        navigate('/agents', { replace: true });
      }, 2500);
    } catch (err: any) {
      console.error('OnboardingScreen: failed to save profile', err);
      toast.error('خطأ في حفظ البيانات: ' + err.message);
    }
  };

  const getStepBack = (): (() => void) | undefined => {
    if (step === 'providerType') return () => setStep('who');
    if (step === 'profile' && userType === 'client') return () => setStep('who');
    if (step === 'profile' && userType === 'provider') return () => setStep('providerType');
    return undefined;
  };

  return (
    <div
      className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4 py-8"
      dir="rtl"
      style={{ fontFamily: font }}
    >
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] right-[-80px] w-72 h-72 bg-[#D4AF37]/6 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-80px] left-[-60px] w-64 h-64 bg-[#3B5BFE]/6 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/3 rounded-full blur-[120px]" />
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-md">
        {/* Logo strip */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center">
              <Home className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="text-white font-black text-sm">بيت الريف</div>
              <div className="text-white/30 text-[10px] font-bold">Beit Al Reef</div>
            </div>
          </div>
        </div>

        {/* Glass card */}
        <div
          className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-7 shadow-2xl"
          style={{
            boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          <AnimatePresence mode="wait">
            {step === 'who' && (
              <StepWhoAreYou
                onSelectClient={handleSelectClient}
                onSelectProvider={handleSelectProvider}
              />
            )}

            {step === 'providerType' && (
              <StepProviderType
                onBack={() => setStep('who')}
                onSelectCompany={handleSelectCompany}
                onSelectCraftsman={handleSelectCraftsman}
              />
            )}

            {step === 'profile' && (
              <StepCompleteProfile
                userType={userType}
                providerType={providerType}
                onBack={getStepBack()!}
                onComplete={handleCompleteProfile}
              />
            )}

            {step === 'done' && (
              <StepWelcomeDone userType={userType} />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-center text-white/15 text-xs font-bold mt-5">
          بيت الريف — منصة البناء والتشطيب في الإمارات
        </p>
      </div>
    </div>
  );
}
