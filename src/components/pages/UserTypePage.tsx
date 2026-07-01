/**
 * UserTypePage.tsx — اختيار نوع الحساب
 * ملاحظة: هذا الملف محتفظ به للتوافق مع الإصدارات السابقة
 * التنفيذ الفعلي الآن في OnboardingScreen.tsx
 */
import { motion } from 'motion/react';
import { UserCircle, Briefcase, Building2, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
import type { UserType, ProviderType } from '../../App';

interface UserTypePageProps {
  onBack: () => void;
  onSelectUserType: (type: UserType) => void;
  onSelectProviderType: (type: ProviderType) => void;
  selectedUserType: UserType;
}

const font = 'Cairo, Tajawal, sans-serif';

export function UserTypePage({ onBack, onSelectUserType, onSelectProviderType, selectedUserType }: UserTypePageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-[500px]"
      style={{ fontFamily: font }}
    >
      {/* Glow effects */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(212, 175, 55, 0.08), transparent 60%)',
          filter: 'blur(40px)',
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Card */}
      <div
        className="relative bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-8 border border-white/[0.08]"
        style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)' }}
      >
        {/* Back */}
        <button
          onClick={onBack}
          className="absolute top-6 right-6 p-2 text-white/30 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-8 mt-2">
          <h1 className="text-2xl font-black text-white mb-2">
            {selectedUserType ? 'نوع حساب المزود' : 'من أنت؟'}
          </h1>
          <p className="text-sm text-white/40 font-bold">
            {selectedUserType ? 'حدد نوع مزود الخدمة' : 'اختر نوع حسابك للمتابعة'}
          </p>
        </div>

        {/* User Type Selection */}
        {!selectedUserType && (
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectUserType('client')}
              className="relative w-full group"
            >
              <div className="absolute inset-0 rounded-2xl bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <div className="relative flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 group-hover:border-[#D4AF37]/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/20 flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-white font-black text-sm mb-0.5">أنا عميل</h3>
                  <p className="text-white/40 text-xs font-bold">أبحث عن مقاول أو خدمة بناء</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-white/20 group-hover:text-[#D4AF37] transition-colors" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectUserType('provider')}
              className="relative w-full group"
            >
              <div className="absolute inset-0 rounded-2xl bg-[#3B5BFE]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <div className="relative flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 group-hover:border-[#3B5BFE]/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#3B5BFE]/15 border border-[#3B5BFE]/20 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-[#3B5BFE]" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-white font-black text-sm mb-0.5">أنا مزود خدمة</h3>
                  <p className="text-white/40 text-xs font-bold">شركة أو حرفي يقدم خدمات البناء</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-white/20 group-hover:text-[#3B5BFE] transition-colors" />
              </div>
            </motion.button>
          </div>
        )}

        {/* Provider Type Selection */}
        {selectedUserType === 'provider' && (
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectProviderType('company')}
              className="relative w-full group"
            >
              <div className="absolute inset-0 rounded-2xl bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <div className="relative flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 group-hover:border-[#D4AF37]/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-white font-black text-sm mb-0.5">شركة برخصة</h3>
                  <p className="text-white/40 text-xs font-bold">شركة مسجلة بسجل تجاري ورخصة</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-white/20 group-hover:text-[#D4AF37] transition-colors" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectProviderType('craftsman')}
              className="relative w-full group"
            >
              <div className="absolute inset-0 rounded-2xl bg-[#3B5BFE]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <div className="relative flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 group-hover:border-[#3B5BFE]/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#3B5BFE]/15 border border-[#3B5BFE]/20 flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-[#3B5BFE]" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-white font-black text-sm mb-0.5">حرفي — عامل ماهر</h3>
                  <p className="text-white/40 text-xs font-bold">فرد متخصص في مجال البناء</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-white/20 group-hover:text-[#3B5BFE] transition-colors" />
              </div>
            </motion.button>

            <button
              onClick={() => onSelectUserType(null)}
              className="w-full text-center text-sm text-white/30 hover:text-white/60 transition-colors py-2 font-bold"
            >
              العودة لاختيار نوع الحساب
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
