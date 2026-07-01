/**
 * VerificationPage.tsx — توثيق وإكمال بيانات المستخدم
 * ملاحظة: هذا الملف محتفظ به للتوافق — التنفيذ الفعلي في OnboardingScreen.tsx
 */
import { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, MapPin, Upload, ChevronRight, CheckCircle, Loader2, Shield } from 'lucide-react';
import type { UserType, ProviderType } from '../../App';

const font = 'Cairo, Tajawal, sans-serif';

interface VerificationPageProps {
  onBack: () => void;
  userType: UserType;
  providerType: ProviderType;
  onComplete?: (phone: string, city: string) => Promise<void>;
}

export function VerificationPage({ onBack, userType, providerType, onComplete }: VerificationPageProps) {
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const [idUploaded, setIdUploaded] = useState(false);
  const [licenseUploaded, setLicenseUploaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const isProvider = userType === 'provider';
  const isCompany = providerType === 'company';
  const canSubmit = phone.length >= 9 && city !== '';

  const handleSubmit = async () => {
    if (!canSubmit || saving || !onComplete) return;
    setSaving(true);
    try {
      await onComplete(phone, city);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `w-full px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 outline-none bg-white/5 border text-white placeholder-white/20`;
  const borderClass = (f: string) => focused === f
    ? 'border-[#D4AF37]/50 shadow-[0_0_0_3px_rgba(212,175,55,0.08)]'
    : 'border-white/10 hover:border-white/20';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-[500px]"
      style={{ fontFamily: font }}
    >
      <div
        className="relative bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-8 border border-white/[0.08]"
        style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)' }}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-6 right-6 p-2 text-white/30 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-7 mt-2">
          <h1 className="text-2xl font-black text-white mb-2">التوثيق والتحقق</h1>
          <p className="text-sm text-white/40 font-bold">
            {isProvider ? 'أكمل بيانات توثيق مزود الخدمة' : 'أكمل بياناتك للمتابعة'}
          </p>
        </div>

        <div className="space-y-4">
          {/* Phone */}
          <div>
            <label className="block text-white/50 text-xs font-black mb-1.5 text-right">رقم الهاتف</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onFocus={() => setFocused('phone')}
                onBlur={() => setFocused(null)}
                placeholder="+971 50 123 4567"
                className={`${inputClass} ${borderClass('phone')} pl-10`}
                dir="ltr"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-white/50 text-xs font-black mb-1.5 text-right">المدينة</label>
            <div className="relative">
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                onFocus={() => setFocused('city')}
                onBlur={() => setFocused(null)}
                className={`${inputClass} ${borderClass('city')} appearance-none pl-10`}
                dir="rtl"
              >
                <option value="" className="bg-[#0F172A] text-white/50">اختر المدينة</option>
                {['دبي', 'أبوظبي', 'الشارقة', 'عجمان', 'رأس الخيمة', 'الفجيرة', 'أم القيوين'].map(c => (
                  <option key={c} value={c} className="bg-[#0F172A] text-white">{c}</option>
                ))}
              </select>
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
            </div>
          </div>

          {/* Emirates ID Upload */}
          <div>
            <label className="block text-white/50 text-xs font-black mb-1.5 text-right">
              صورة الهوية الإماراتية
            </label>
            <button
              onClick={() => setIdUploaded(true)}
              className={`w-full flex items-center justify-center gap-3 p-5 rounded-xl border-2 border-dashed transition-all duration-300 ${
                idUploaded
                  ? 'bg-[#D4AF37]/8 border-[#D4AF37]/40'
                  : 'bg-white/3 border-white/10 hover:bg-white/5 hover:border-white/20'
              }`}
            >
              {idUploaded ? (
                <>
                  <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-sm font-bold">تم رفع الهوية بنجاح</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-white/30" />
                  <span className="text-white/40 text-sm font-bold">اضغط لرفع صورة الهوية</span>
                </>
              )}
            </button>
          </div>

          {/* License Upload (companies only) */}
          {isProvider && isCompany && (
            <div>
              <label className="block text-white/50 text-xs font-black mb-1.5 text-right">
                رخصة العمل / السجل التجاري
              </label>
              <button
                onClick={() => setLicenseUploaded(true)}
                className={`w-full flex items-center justify-center gap-3 p-5 rounded-xl border-2 border-dashed transition-all duration-300 ${
                  licenseUploaded
                    ? 'bg-[#D4AF37]/8 border-[#D4AF37]/40'
                    : 'bg-white/3 border-white/10 hover:bg-white/5 hover:border-white/20'
                }`}
              >
                {licenseUploaded ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-[#D4AF37] text-sm font-bold">تم رفع الرخصة بنجاح</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-white/30" />
                    <span className="text-white/40 text-sm font-bold">اضغط لرفع صورة الرخصة</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Privacy note */}
          <p className="text-center text-white/20 text-xs font-bold flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3 text-[#D4AF37]/40" />
            جميع بياناتك محمية ومشفرة بأعلى معايير الأمان
          </p>

          {/* Submit */}
          <motion.button
            whileHover={canSubmit ? { scale: 1.02 } : {}}
            whileTap={canSubmit ? { scale: 0.98 } : {}}
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
            className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-all duration-300 ${
              canSubmit && !saving
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#C8A86A] text-[#1F3D2B] shadow-lg shadow-[#D4AF37]/20'
                : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                إتمام التسجيل
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
