import { motion } from 'motion/react';
import { Mail, ArrowRight } from 'lucide-react';
import { GoogleIcon } from '../GoogleIcon';
import { BietAlreefLogo } from '../BietAlreefLogo';
import { useState } from 'react';
import { LegalModals, useLegalModals } from '../LegalModals';
import { useLanguage } from '../../contexts/LanguageContext';

interface LoginPageProps {
  onContinue: () => void;
}

export function LoginPage({ onContinue }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { openModal, openTerms, openPrivacy, closeModal } = useLegalModals();
  const { language, setLanguage } = useLanguage();
  const isEn = language === 'en';

  return (
    <>
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-[520px] relative"
    >
      {/* Outer glow effect - Gold */}
      <motion.div
        className="absolute inset-0 rounded-[48px] opacity-25"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(218, 165, 32, 0.25), transparent 60%)',
          filter: 'blur(40px)',
        }}
        animate={{
          opacity: [0.2, 0.3, 0.2],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Outer glow effect - Gold Secondary */}
      <motion.div
        className="absolute inset-0 rounded-[48px] opacity-20"
        style={{
          background: 'radial-gradient(circle at 70% 80%, rgba(212, 175, 55, 0.2), transparent 60%)',
          filter: 'blur(40px)',
        }}
        animate={{
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />

      {/* Main glassmorphic card */}
      <motion.div
        className="relative backdrop-blur-2xl bg-white/30 rounded-[48px] p-12 border border-white/40"
        style={{
          boxShadow: `
            0 40px 80px rgba(0, 0, 0, 0.12),
            0 20px 40px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.6),
            inset 0 -1px 0 rgba(255, 255, 255, 0.2),
            0 0 0 1px rgba(218, 165, 32, 0.1),
            0 0 0 2px rgba(200, 168, 106, 0.08)
          `,
        }}
      >
        {/* Holographic light rays */}
        <div className="absolute inset-0 rounded-[48px] overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/4 w-[200px] h-[200px]"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
            animate={{
              x: [0, 80, 0],
              y: [0, -30, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-[180px] h-[180px]"
            style={{
              background: 'radial-gradient(circle, rgba(218, 165, 32, 0.1) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
            animate={{
              x: [0, -60, 0],
              y: [0, 30, 0],
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo Area */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <BietAlreefLogo />
          </motion.div>

          {/* Title - Arabic */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 
              className="text-3xl mb-3 bg-gradient-to-r from-amber-800 via-amber-700 to-[#B8940E] bg-clip-text text-transparent"
              style={{ fontFamily: 'serif' }}
            >
              تسجيل الدخول إلى بيت الريف
            </h1>
            <p className="text-sm text-amber-900/70">
              منصة البناء الذكية في الإمارات
            </p>
          </motion.div>

          {/* Google Login Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative w-full group mb-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/15 to-[#C8A86A]/15 rounded-[20px] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center justify-center gap-3 px-6 py-4 bg-white/50 backdrop-blur-xl rounded-[20px] border border-white/60 shadow-lg transition-all duration-300 group-hover:bg-white/70 group-hover:border-white/80">
              <div className="p-1 bg-white rounded-full">
                <GoogleIcon />
              </div>
              <span className="text-amber-900">{isEn ? 'Continue with Google' : 'متابعة عبر جوجل'}</span>
            </div>
          </motion.button>

          {/* Divider */}
          <motion.div
            className="relative my-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-900/20" style={{ 
                backgroundImage: 'linear-gradient(to right, transparent, rgba(218, 165, 32, 0.3), transparent)',
                height: '1px',
                border: 'none'
              }} />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white/40 backdrop-blur-sm px-4 text-xs text-amber-900/70">
                أو عبر البريد الإلكتروني
              </span>
            </div>
          </motion.div>

          {/* Email Input */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <label className="block text-sm text-amber-900/80 mb-2 text-right">
              {isEn ? 'Email Address' : 'البريد الإلكتروني'}
            </label>
            <motion.div
              className="relative"
              animate={{
                scale: focusedField === 'email' ? 1.01 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {focusedField === 'email' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-[#C8A86A]/10 rounded-[18px] blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}
              
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="example@email.com"
                  className="w-full px-5 py-4 pr-12 bg-white/40 backdrop-blur-xl border border-white/50 rounded-[18px] focus:border-[#D4AF37]/50 focus:bg-white/60 focus:outline-none transition-all duration-300 text-amber-900 placeholder:text-amber-900/40"
                  dir="ltr"
                />
                <Mail className="absolute right-4 w-5 h-5 text-amber-900/40" />
              </div>
            </motion.div>
          </motion.div>

          {/* Verification Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="relative w-full group mb-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
          >
            <motion.div
              className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.3), rgba(200, 168, 106, 0.3))',
                filter: 'blur(12px)',
              }}
            />
            
            <motion.div
              className="absolute inset-0 rounded-[20px]"
              animate={{
                boxShadow: [
                  '0 0 15px rgba(218, 165, 32, 0.15)',
                  '0 0 25px rgba(218, 165, 32, 0.25)',
                  '0 0 15px rgba(218, 165, 32, 0.15)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <div className="relative flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8940E] text-white rounded-[20px] shadow-xl border border-[#D4AF37]/50">
              <span>{isEn ? 'Send Verification Code' : 'إرسال رمز التحقق'}</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ←
              </motion.div>
            </div>
          </motion.button>

          {/* Terms */}
          <motion.p
            className="text-center text-xs text-amber-900/50 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {isEn ? 'By continuing, you agree to our ' : 'بالمتابعة، أنت توافق على '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#B8940E] transition-colors underline-offset-2 hover:underline">
              {isEn ? 'Terms & Conditions' : 'الشروط والأحكام'}
            </a>
            {isEn ? ' and ' : ' و '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#B8940E] transition-colors underline-offset-2 hover:underline">
              {isEn ? 'Privacy Policy' : 'سياسة الخصوصية'}
            </a>
          </motion.p>

          {/* Language Switcher */}
          <motion.div
            className="flex items-center justify-center pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <div className="flex items-center bg-white/50 backdrop-blur-sm border border-white/60 rounded-full p-1 shadow-sm">
              <button
                onClick={() => setLanguage('ar')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  language === 'ar'
                    ? 'bg-[#D4AF37] text-white shadow-md'
                    : 'text-amber-900/60 hover:text-[#B8940E]'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                العربية
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-[#D4AF37] text-white shadow-md'
                    : 'text-amber-900/60 hover:text-[#B8940E]'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                English
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-6 flex items-center justify-center gap-2 text-xs text-amber-900/60"
      >
        <motion.div
          className="w-2 h-2 bg-[#D4AF37] rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        <span>نظام آمن ومشفر</span>
      </motion.div>
    </motion.div>

    <LegalModals open={openModal} onClose={closeModal} language={language} />
    </>
  );
}