import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../utils/supabase/client';
import { Mail, ArrowLeft, Loader2, CheckCircle, Shield, Sparkles, Globe, Lock, Eye, EyeOff, Moon, Sun } from 'lucide-react';
// CheckCircle2 not available — using CheckCircle as alias
const CheckCircle2 = CheckCircle;
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
const logoImg = "/assets/logo.png";
import bietAlreefLogo from "figma:asset/67fe2af1d169e9257cfb304dda040baf67b4e599.png";
// Shader Sphere assets
const imgShaderCanvas = "/assets/shader-canvas.png";
const imgShaderBtn0 = "/assets/shader-btn-0.png";
const imgShaderBtn1 = "/assets/shader-btn-1.png";
const imgShaderBtn2 = "/assets/shader-btn-2.png";
const imgShaderBtn3 = "/assets/shader-btn-3.png";
import { useLanguage } from '../../contexts/LanguageContext';
import { LegalModals, useLegalModals } from '../LegalModals';
import { Unified3DScene } from './Unified3DScene';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthScreenProps {
  onComplete: () => void;
}

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'welcome' | 'email' | 'otp' | 'password'>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  // Auto-login check on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) onComplete();
    });
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error('خطأ في تسجيل الدخول بـ Google: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error('خطأ في تسجيل الدخول بـ Facebook: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || isLoading) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      
      setStep('otp');
      setCountdown(60);
      toast.success('✉️ تم إرسال رمز التحقق إلى بريدك');
    } catch (error: any) {
      toast.error('خطأ في إرسال الرمز: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
      verifyOtp(pasted);
    }
  };

  const verifyOtp = async (code: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      });
      if (error) throw error;
      if (data.session) {
        toast.success('🎉 تم تسجيل الدخول بنجاح!');
        onComplete();
      }
    } catch (error: any) {
      toast.error('رمز التحقق غير صحيح أو منتهي الصلاحية');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    handleSendOtp();
  };

  const handlePasswordLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !password || isLoading) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.session) {
        toast.success('🎉 تم تسجيل الدخول بنجاح!');
        onComplete();
      }
    } catch (error: any) {
      toast.error('البريد أو كلمة المرور غير صحيحة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] via-[#F8F3EB] to-white dark:from-[#0B1120] dark:via-[#0B1120] dark:to-[#0F172A] flex flex-col font-[Cairo,sans-serif]" dir="rtl">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <WelcomeScreen
            key="welcome"
            onGetStarted={() => setStep('email')}
            onPasswordLogin={() => setStep('password')}
            onGoogleLogin={handleGoogleLogin}
            onFacebookLogin={handleFacebookLogin}
            isLoading={isLoading}
          />
        )}

        {step === 'email' && (
          <EmailScreen
            key="email"
            email={email}
            setEmail={setEmail}
            onSubmit={handleSendOtp}
            onBack={() => setStep('welcome')}
            onGoogleLogin={handleGoogleLogin}
            onFacebookLogin={handleFacebookLogin}
            isLoading={isLoading}
          />
        )}

        {step === 'otp' && (
          <OtpScreen
            key="otp"
            email={email}
            otp={otp}
            otpRefs={otpRefs}
            onOtpChange={handleOtpChange}
            onOtpKeyDown={handleOtpKeyDown}
            onOtpPaste={handleOtpPaste}
            onResend={handleResend}
            onBack={() => { setStep('email'); setOtp(['', '', '', '', '', '']); }}
            countdown={countdown}
            isLoading={isLoading}
          />
        )}

        {step === 'password' && (
          <PasswordScreen
            key="password"
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onSubmit={handlePasswordLogin}
            onBack={() => { setStep('welcome'); setPassword(''); }}
            onGoogleLogin={handleGoogleLogin}
            onFacebookLogin={handleFacebookLogin}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   WELCOME SCREEN
   ================================================================ */
function WelcomeScreen({ onGetStarted, onPasswordLogin, onGoogleLogin, onFacebookLogin, isLoading }: {
  onGetStarted: () => void;
  onPasswordLogin: () => void;
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
  isLoading: boolean;
}) {
  const { language, setLanguage } = useLanguage();
  const isEn = language === 'en';
  const { openModal, openTerms, openPrivacy, closeModal } = useLegalModals();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#F5EEE1] dark:bg-[#0B1120] px-6 pt-4 pb-2 md:pt-8 md:pb-4">
        {/* Decorative circles */}
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-[#C8A86A]/10 dark:bg-[#D4AF37]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20px] left-[-30px] w-36 h-36 bg-[#D4AF37]/8 dark:bg-[#FFD700]/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-lg mx-auto text-center">
          {/* Logo + Text Row */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative cursor-pointer group"
            >
              {/* Outer golden glow ring — appears on hover */}
              <motion.div
                className="absolute -inset-2 rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, #D4AF37, #FFD700, #F5DEB3, #D4AF37)',
                  filter: 'blur(10px)',
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
                }}
              />
              {/* Inner shimmer pulse */}
              <div className="absolute -inset-1 rounded-[20px] opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,215,0,0.4), transparent 60%)',
                }}
              />
              {/* Logo container */}
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E6DCC8] dark:border-white/10 shadow-lg dark:shadow-black/30 flex items-center justify-center p-1.5 transition-all duration-500 group-hover:border-[#D4AF37]/60 dark:group-hover:border-[#FFD700]/40 group-hover:shadow-[0_0_25px_rgba(212,175,55,0.35),0_0_50px_rgba(212,175,55,0.15)] dark:group-hover:shadow-[0_0_30px_rgba(255,215,0,0.3),0_0_60px_rgba(255,215,0,0.1)]">
                <img 
                  src={bietAlreefLogo} 
                  alt="بيت الريف" 
                  width={80}
                  height={80}
                  decoding="async"
                  className="w-full h-full object-contain drop-shadow-lg transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] group-hover:brightness-110"
                />
              </div>
            </motion.div>
            <div className="text-right">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[#C8A86A] text-base md:text-lg mb-0.5"
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}
              >
                {isEn ? 'Welcome Home' : 'مرحباً بك في الدار'}
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[#1F3D2B]/60 dark:text-white/50 text-xs md:text-sm leading-relaxed max-w-[220px]"
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
              >
                {isEn ? 'Your smart digital platform — services, store & tools' : 'منصتك الرقمية الذكية — خدمات، متجر، وأدوات احترافية'}
              </motion.p>
            </div>
          </div>

          {/* Feature badges */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 mb-1"
          >
            {[
              { icon: Shield, label: isEn ? 'Verified' : 'موثوق' },
              { icon: Sparkles, label: isEn ? 'Full Store' : 'متجر متكامل' },
              { icon: Globe, label: isEn ? 'UAE' : 'الإمارات' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 bg-white/80 dark:bg-white/8 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#E6DCC8] dark:border-white/10 shadow-sm dark:shadow-none">
                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/10 dark:bg-[#FFD700]/15 flex items-center justify-center">
                  <badge.icon className="w-3 h-3 text-[#D4AF37] dark:text-[#FFD700]" />
                </div>
                <span className="text-[#1F3D2B] dark:text-white/80 text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ═══ Unified 3D Scene — Both Rings ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="relative z-10 -mx-6"
        >
          <div className="flex items-center justify-center gap-3 px-6 mb-0">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#3B5BFE]" />
              <span className="text-[#1F3D2B]/40 dark:text-white/35 text-[9px]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{isEn ? 'SaaS' : 'ساس'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span className="text-[#1F3D2B]/40 dark:text-white/35 text-[9px]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{isEn ? 'Dashboards' : 'داشبوردات'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
              <span className="text-[#1F3D2B]/40 dark:text-white/35 text-[9px]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{isEn ? 'AI' : 'ذكاء اصطناعي'}</span>
            </div>
            <span className="text-[#D4AF37] text-[8px] font-black bg-[#D4AF37]/10 px-1.5 py-0.5 rounded-full">12</span>
          </div>
          <Unified3DScene isEn={isEn} />
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 py-4 md:py-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md space-y-3"
        >
          {/* Welcome info card */}
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/30 border border-[#E6DCC8]/50 dark:border-white/10 p-3 mb-1">
            <div className="flex gap-2">
              <div className="flex-1 bg-[#F5EEE1] dark:bg-white/8 rounded-xl px-3 py-2 text-center">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>{isEn ? 'Services' : 'خدمات'}</span>
                <span className="text-base font-black text-[#D4AF37] dark:text-[#FFD700]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>+50</span>
              </div>
              <div className="flex-1 bg-[#F5EEE1] dark:bg-white/8 rounded-xl px-3 py-2 text-center">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>{isEn ? 'Providers' : 'مزود خدمة'}</span>
                <span className="text-base font-black text-[#D4AF37] dark:text-[#FFD700]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>+200</span>
              </div>
              <div className="flex-1 bg-[#F5EEE1] dark:bg-white/8 rounded-xl px-3 py-2 text-center">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>{isEn ? 'Emirates' : 'إمارة'}</span>
                <span className="text-base font-black text-[#D4AF37] dark:text-[#FFD700]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>7</span>
              </div>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex gap-3">
            {/* Google Login */}
            <button
              onClick={onGoogleLogin}
              disabled={isLoading}
              className="flex-1 bg-white dark:bg-[#0F172A] hover:bg-gray-50 dark:hover:bg-[#1E293B] border-2 border-gray-200 dark:border-white/12 hover:border-[#4285F4] text-gray-700 dark:text-white py-3 px-3 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-sm dark:shadow-black/20 disabled:opacity-70"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.2 0-9.7-3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.7 39.5 44 34 44 24c0-1.3-.2-2.7-.4-3.9z"/>
              </svg>
              <span className="text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>Google</span>
            </button>

            {/* Facebook Login */}
            <button
              onClick={onFacebookLogin}
              disabled={isLoading}
              className="flex-1 bg-white dark:bg-[#0F172A] hover:bg-gray-50 dark:hover:bg-[#1E293B] border-2 border-gray-200 dark:border-white/12 hover:border-[#1877F2] text-gray-700 dark:text-white py-3 px-3 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-sm dark:shadow-black/20 disabled:opacity-70"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
            >
              <FacebookIconSvg />
              <span className="text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-xs font-bold">{isEn ? 'or' : 'أو'}</span>
            <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
          </div>

          {/* Email Login */}
          <button
            onClick={onGetStarted}
            className="w-full bg-[#D4AF37] dark:bg-[#1E293B] hover:bg-[#B8940E] dark:hover:bg-[#334155] text-white py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-lg shadow-[#D4AF37]/20 dark:shadow-black/30 dark:border dark:border-white/10"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
          >
            <Mail className="w-5 h-5" />
            <span>{isEn ? 'Sign in with Email' : 'الدخول بالبريد الإلكتروني'}</span>
          </button>

          {/* Password Login */}
          <button
            onClick={onPasswordLogin}
            className="w-full bg-[#3B5BFE] dark:bg-[#1E293B] hover:bg-[#2A44CC] dark:hover:bg-[#334155] text-white py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-lg shadow-[#3B5BFE]/20 dark:shadow-black/30 dark:border dark:border-white/10"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
          >
            <Lock className="w-5 h-5" />
            <span>{isEn ? 'Sign in with Password' : 'الدخول بكلمة المرور'}</span>
          </button>

          {/* Terms */}
          <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed pt-2">
            {isEn ? 'By signing in, you agree to our ' : 'بالدخول فإنك توافق على '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline cursor-pointer hover:text-[#2E7D50] dark:hover:text-[#FFD700] text-gray-500 dark:text-gray-400 font-semibold transition-colors">
              {isEn ? 'Terms of Use' : 'شروط الاستخدام'}
            </a>
            {isEn ? ' and ' : ' و '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline cursor-pointer hover:text-[#2E7D50] dark:hover:text-[#FFD700] text-gray-500 dark:text-gray-400 font-semibold transition-colors">
              {isEn ? 'Privacy Policy' : 'سياسة الخصوصية'}
            </a>
          </p>

          {/* Language Switcher */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center pt-1"
          >
            <div className="flex items-center bg-white/80 dark:bg-[#0B1120] border border-[#E6DCC8] dark:border-white/10 rounded-full p-1 shadow-sm dark:shadow-black/20">
              <button
                onClick={() => setLanguage('ar')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  language === 'ar'
                    ? 'bg-[#D4AF37] dark:bg-white text-white dark:text-[#0B1120] shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-white'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                العربية
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-[#D4AF37] dark:bg-white text-white dark:text-[#0B1120] shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-white'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                English
              </button>
            </div>
          </motion.div>

          {/* Theme Switcher */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center pt-1"
          >
            <div className="flex items-center bg-white/80 dark:bg-[#0B1120] border border-[#E6DCC8] dark:border-white/10 rounded-full p-1 shadow-sm dark:shadow-black/20">
              <button
                onClick={() => { if (theme !== 'light') toggleTheme(); }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  theme === 'light'
                    ? 'bg-[#D4AF37] dark:bg-white text-white dark:text-[#0B1120] shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-white'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                <Sun className="w-3.5 h-3.5" />
                {isEn ? 'Light' : 'فاتح'}
              </button>
              <button
                onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-[#D4AF37] dark:bg-white text-white dark:text-[#0B1120] shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-white'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                <Moon className="w-3.5 h-3.5" />
                {isEn ? 'Dark' : 'داكن'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Legal Modals */}
      <LegalModals open={openModal} onClose={closeModal} language={language} />
    </motion.div>
  );
}

/* ================================================================
   SHARED: Google Icon SVG
   ================================================================ */
function GoogleIconSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.2 0-9.7-3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.7 39.5 44 34 44 24c0-1.3-.2-2.7-.4-3.9z"/>
    </svg>
  );
}

function FacebookIconSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#1877F2" d="M24 4C12.954 4 4 12.954 4 24c0 9.983 7.314 18.257 16.878 19.757V29.691h-5.08V24h5.08v-4.344c0-5.014 2.986-7.781 7.554-7.781 2.189 0 4.478.39 4.478.39v4.922h-2.522c-2.484 0-3.259 1.542-3.259 3.123V24h5.547l-.887 5.691h-4.66v14.066C36.686 42.257 44 33.983 44 24c0-11.046-8.954-20-20-20z"/>
      <path fill="#FFFFFF" d="M33.538 29.691L34.425 24h-5.547v-3.69c0-1.581.775-3.123 3.259-3.123h2.522v-4.922s-2.289-.39-4.478-.39c-4.568 0-7.554 2.767-7.554 7.781V24h-5.08v5.691h5.08v14.066a20.18 20.18 0 006.244 0V29.691h4.66z"/>
    </svg>
  );
}

/* ================================================================
   SHARED: Shader Sphere Hero — with Motivational Cards
   ================================================================ */
const shaderBtns = [imgShaderBtn0, imgShaderBtn1, imgShaderBtn2, imgShaderBtn3];
const glowColors = [
  { bg: 'rgba(255,255,255,0.4)', shadow: 'rgba(200,200,200,0.3)' },
  { bg: 'rgba(59,91,254,0.5)', shadow: 'rgba(59,91,254,0.3)' },
  { bg: 'rgba(212,175,55,0.5)', shadow: 'rgba(212,175,55,0.3)' },
  { bg: 'rgba(139,92,246,0.5)', shadow: 'rgba(139,92,246,0.3)' },
];

const MOTIVATIONAL_CARDS = [
  {
    titleAr: 'ابنِ حلمك بثقة',
    titleEn: 'Build Your Dream',
    subtitleAr: 'كل الأدوات الذكية بين يديك\nلتحويل رؤيتك إلى واقع',
    subtitleEn: 'All smart tools at your fingertips\nto turn your vision into reality',
    accentColor: '#FFFFFF',
    glowColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.35)',
    iconSymbol: '✦',
  },
  {
    titleAr: 'من الفكرة للواقع',
    titleEn: 'Idea to Reality',
    subtitleAr: 'بيت الريف شريكك الذكي\nفي كل خطوة من مشروعك',
    subtitleEn: 'Beit Al Reef is your smart partner\nin every step of your project',
    accentColor: '#3B5BFE',
    glowColor: 'rgba(59,91,254,0.2)',
    borderColor: 'rgba(59,91,254,0.5)',
    iconSymbol: '◆',
  },
  {
    titleAr: 'حلول استثنائية',
    titleEn: 'Exceptional Solutions',
    subtitleAr: 'تقنيات متطورة وأدوات احترافية\nتصنع الفرق في مشروعك',
    subtitleEn: 'Advanced tech & pro tools\nthat make the difference',
    accentColor: '#D4AF37',
    glowColor: 'rgba(212,175,55,0.2)',
    borderColor: 'rgba(212,175,55,0.5)',
    iconSymbol: '★',
  },
  {
    titleAr: 'مستقبل ذكي',
    titleEn: 'Smart Future',
    subtitleAr: 'ذكاء اصطناعي يُبسّط أعمالك\nويضاعف إنتاجيتك',
    subtitleEn: 'AI that simplifies your work\nand boosts your productivity',
    accentColor: '#8B5CF6',
    glowColor: 'rgba(139,92,246,0.2)',
    borderColor: 'rgba(139,92,246,0.5)',
    iconSymbol: '◈',
  },
];

function ShaderSphereHero({ activeShader, setActiveShader }: { activeShader: number; setActiveShader: (i: number) => void }) {
  const gc = glowColors[activeShader];
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleShaderClick = (i: number) => {
    setActiveShader(i);
    setActiveCard(prev => (prev === i ? null : i));
  };

  const card = activeCard !== null ? MOTIVATIONAL_CARDS[activeCard] : null;

  return (
    <div className="relative flex flex-col items-center justify-center gap-4">
      {/* Main Sphere + Card Container */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative"
        >
          {/* Outer glow ring — no scale pulsing */}
          <motion.div
            className="absolute -inset-4 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${gc.bg}, transparent 70%)`, filter: 'blur(20px)' }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Sphere / Card flip container */}
          <div className="relative w-44 h-44 md:w-56 md:h-56" style={{ perspective: '800px' }}>
            <AnimatePresence mode="wait">
              {activeCard === null ? (
                /* ═══ Sphere Face ═══ */
                <motion.div
                  key="sphere"
                  initial={{ rotateY: 180, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1, y: [0, -8, 0] }}
                  exit={{ rotateY: -180, opacity: 0 }}
                  transition={{
                    rotateY: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.3 },
                    y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="absolute inset-0 rounded-full overflow-hidden"
                  style={{
                    boxShadow: `0 0 60px 10px ${gc.shadow}, 0 20px 60px -10px rgba(0,0,0,0.5)`,
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <img
                    src={imgShaderCanvas}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                    style={{ filter: `hue-rotate(${activeShader * 40}deg) saturate(${1 + activeShader * 0.15})` }}
                  />
                  <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.12), transparent 55%)' }} />
                </motion.div>
              ) : (
                /* ═══ Motivational Card Face ═══ */
                <motion.div
                  key={`card-${activeCard}`}
                  initial={{ rotateY: -180, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1, y: [0, -6, 0] }}
                  exit={{ rotateY: 180, opacity: 0 }}
                  transition={{
                    rotateY: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.5, ease: 'easeOut' },
                    y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
                  }}
                  className="absolute inset-0 rounded-full overflow-hidden cursor-pointer"
                  onClick={() => setActiveCard(null)}
                  style={{
                    backfaceVisibility: 'hidden',
                    boxShadow: `0 0 50px 8px ${card!.glowColor}, 0 0 80px 20px ${card!.glowColor}, 0 20px 50px -10px rgba(0,0,0,0.4)`,
                  }}
                >
                  {/* Frosted glass background */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(ellipse at 30% 20%, ${card!.glowColor}, rgba(30,30,34,0.95) 80%)`,
                      backdropFilter: 'blur(40px) saturate(180%)',
                      border: `2px solid ${card!.borderColor}`,
                    }}
                  />

                  {/* Animated shimmer ring */}
                  <motion.div
                    className="absolute inset-1 rounded-full pointer-events-none"
                    style={{
                      background: `conic-gradient(from 0deg, transparent, ${card!.borderColor}, transparent, ${card!.borderColor}, transparent)`,
                      opacity: 0.3,
                    }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Inner content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center z-10">
                    {/* Decorative symbol */}
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                      className="text-2xl md:text-3xl mb-1.5 block"
                      style={{ color: card!.accentColor, textShadow: `0 0 20px ${card!.glowColor}` }}
                    >
                      {card!.iconSymbol}
                    </motion.span>

                    {/* Title */}
                    <motion.h3
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="text-white font-black text-sm md:text-base leading-tight mb-1.5"
                      style={{ fontFamily: 'Cairo, sans-serif', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                    >
                      {isEn ? card!.titleEn : card!.titleAr}
                    </motion.h3>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      className="text-white/60 text-[10px] md:text-xs leading-relaxed whitespace-pre-line"
                      style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
                    >
                      {isEn ? card!.subtitleEn : card!.subtitleAr}
                    </motion.p>

                    {/* Tap hint */}
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.5, 0] }}
                      transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
                      className="text-white/25 text-[8px] mt-2 block"
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    >
                      {isEn ? 'tap to return' : 'اضغط للعودة'}
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ═══ Horizontal Shader Buttons — Swipeable ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="relative z-20"
      >
        <motion.div
          ref={dragRef}
          className="flex items-center gap-3 px-2"
          drag="x"
          dragConstraints={{ left: -20, right: 20 }}
          dragElastic={0.3}
        >
          {shaderBtns.map((btn, i) => {
            const isActive = activeShader === i;
            const isCardActive = activeCard === i;
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShaderClick(i)}
                className="relative"
                animate={isCardActive ? { y: [0, -3, 0] } : {}}
                transition={isCardActive ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
              >
                {/* Active ring glow */}
                {isActive && (
                  <motion.div
                    layoutId="shaderRing"
                    className="absolute -inset-1.5 rounded-full"
                    style={{
                      background: `conic-gradient(from 0deg, ${glowColors[i].bg}, transparent 50%, ${glowColors[i].bg})`,
                      opacity: 0.7,
                    }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />
                )}

                {/* Pulse for card-active state */}
                {isCardActive && (
                  <motion.div
                    className="absolute -inset-2.5 rounded-full"
                    style={{ border: `1.5px solid ${glowColors[i].bg}` }}
                    animate={{ opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Button circle */}
                <div
                  className={`relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden transition-all duration-300 ${
                    isActive
                      ? 'border-2 border-white shadow-[0_0_14px_rgba(255,255,255,0.5)] scale-110'
                      : 'border-2 border-white/25 hover:border-white/60'
                  }`}
                >
                  <img src={btn} alt="" className="w-full h-full object-cover rounded-full" />

                  {/* Card-active indicator dot */}
                  {isCardActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Swipe hint dots */}
        <div className="flex justify-center gap-1 mt-2">
          {shaderBtns.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                activeShader === i ? 'bg-white/70 w-3' : 'bg-white/20 w-1'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ================================================================
   EMAIL SCREEN — Dark Hero + Shader Sphere
   ================================================================ */
function EmailScreen({ email, setEmail, onSubmit, onBack, onGoogleLogin, onFacebookLogin, isLoading }: {
  email: string;
  setEmail: (v: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onBack: () => void;
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
  isLoading: boolean;
}) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [activeShader, setActiveShader] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col min-h-screen"
    >
      {/* ═══ Dark Hero ═══ */}
      <div className="relative bg-[#0B1120] overflow-hidden px-6 pt-6 pb-16 md:pt-10 md:pb-20">
        <div className="absolute top-[-60px] left-[-40px] w-56 h-56 bg-[#3B5BFE]/15 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-30px] right-[-30px] w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-[60px]" />

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={onBack}
          className="relative z-20 flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5 rotate-180" />
          <span className="text-sm font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Back' : 'رجوع'}</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative z-10 flex justify-center"
        >
          <ShaderSphereHero activeShader={activeShader} setActiveShader={setActiveShader} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-[#3B5BFE] blur-xl opacity-50" />
            <div className="relative w-14 h-14 bg-[#0F172A] backdrop-blur-xl border border-white/15 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(59,91,254,0.4)]">
              <Mail className="w-7 h-7 text-[#3B5BFE]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ Form Card ═══ */}
      <div className="flex-1 bg-[#F5EEE1] dark:bg-[#1C1C1E] -mt-6 rounded-t-[28px] relative z-10">
        <div className="px-6 pt-10 pb-8 max-w-md mx-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6">
            <h2 className="text-2xl font-black text-[#1A1A1A] dark:text-white mb-1.5" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? "We'll send you a 6-digit verification code" : 'سنرسل لك رمز تحقق مكوّن من 6 أرقام للدخول بأمان'}
            </p>
          </motion.div>

          <motion.form initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="block w-full pr-12 pl-4 py-4 border-2 border-gray-200 dark:border-white/10 rounded-2xl text-base bg-white dark:bg-[#0F172A] text-[#1A1A1A] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#3B5BFE] focus:ring-4 focus:ring-[#3B5BFE]/10 transition-all"
                placeholder="name@example.com" dir="ltr" style={{ textAlign: 'left', fontFamily: 'Cairo, sans-serif' }} autoFocus required
              />
            </div>
            <button type="submit" disabled={isLoading || !email}
              className="w-full bg-[#0F172A] dark:bg-white hover:bg-[#1E293B] dark:hover:bg-gray-100 text-white dark:text-[#1A1A1A] font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>{isEn ? 'Send verification code' : 'إرسال رمز التحقق'}</span><ArrowLeft className="w-4 h-4" /></>}
            </button>
          </motion.form>

          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-gray-200 dark:border-white/10" />
            <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-xs font-bold">{isEn ? 'or' : 'أو'}</span>
            <div className="flex-grow border-t border-gray-200 dark:border-white/10" />
          </div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex gap-3"
          >
            <button
              onClick={onGoogleLogin}
              className="flex-1 bg-white dark:bg-[#111827] hover:bg-gray-50 dark:hover:bg-[#1E293B] border-2 border-gray-200 dark:border-white/10 hover:border-[#4285F4] text-gray-700 dark:text-white font-bold py-3.5 px-3 rounded-2xl flex items-center justify-center gap-2.5 transition-all"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              <GoogleIconSvg />
              <span className="text-sm">Google</span>
            </button>
            <button
              onClick={onFacebookLogin}
              className="flex-1 bg-white dark:bg-[#111827] hover:bg-gray-50 dark:hover:bg-[#1E293B] border-2 border-gray-200 dark:border-white/10 hover:border-[#1877F2] text-gray-700 dark:text-white font-bold py-3.5 px-3 rounded-2xl flex items-center justify-center gap-2.5 transition-all"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              <FacebookIconSvg />
              <span className="text-sm">Facebook</span>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   OTP SCREEN — Dark Hero + Shader Sphere
   ================================================================ */
function OtpScreen({ email, otp, otpRefs, onOtpChange, onOtpKeyDown, onOtpPaste, onResend, onBack, countdown, isLoading }: {
  email: string;
  otp: string[];
  otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onOtpChange: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent) => void;
  onOtpPaste: (e: React.ClipboardEvent) => void;
  onResend: () => void;
  onBack: () => void;
  countdown: number;
  isLoading: boolean;
}) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [activeShader, setActiveShader] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col min-h-screen"
    >
      {/* ═══ Dark Hero ═══ */}
      <div className="relative bg-[#0B1120] overflow-hidden px-6 pt-6 pb-16 md:pt-10 md:pb-20">
        <div className="absolute top-[-60px] right-[-40px] w-56 h-56 bg-[#D4AF37]/12 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-30px] left-[-30px] w-40 h-40 bg-[#8B5CF6]/10 rounded-full blur-[60px]" />

        <motion.button
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          onClick={onBack}
          className="relative z-20 flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5 rotate-180" />
          <span className="text-sm font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Change email' : 'تغيير البريد'}</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative z-10 flex justify-center"
        >
          <ShaderSphereHero activeShader={activeShader} setActiveShader={setActiveShader} />
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.35 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-[#D4AF37] blur-xl opacity-40" />
            <div className="relative w-14 h-14 bg-[#111827] backdrop-blur-xl border border-white/15 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(212,175,55,0.35)]">
              <Shield className="w-7 h-7 text-[#D4AF37]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ Form Card ═══ */}
      <div className="flex-1 bg-[#F5EEE1] dark:bg-[#1C1C1E] -mt-6 rounded-t-[28px] relative z-10">
        <div className="px-6 pt-10 pb-8 max-w-md mx-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mb-6">
            <h2 className="text-2xl font-black text-[#1A1A1A] dark:text-white mb-1.5" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Enter verification code' : 'أدخل رمز التحقق'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'A 6-digit code was sent to' : 'تم إرسال رمز مكوّن من 6 أرقام إلى'}
            </p>
            <p className="text-[#3B5BFE] dark:text-[#D4AF37] font-bold text-sm mt-1" dir="ltr">{email}</p>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
            className="flex gap-2.5 justify-center mb-6" dir="ltr"
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { otpRefs.current[index] = el; }}
                type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={(e) => onOtpChange(index, e.target.value)}
                onKeyDown={(e) => onOtpKeyDown(index, e)}
                onPaste={index === 0 ? onOtpPaste : undefined}
                className={`w-12 h-14 md:w-14 md:h-16 text-center text-xl font-black rounded-2xl border-2 transition-all duration-200 focus:outline-none ${
                  digit
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 dark:bg-[#D4AF37]/15 text-[#D4AF37]'
                    : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] text-gray-800 dark:text-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10'
                }`}
                autoFocus={index === 0}
              />
            ))}
          </motion.div>

          {isLoading && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
              <span className="text-sm text-gray-500 dark:text-gray-400" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Verifying...' : 'جاري التحقق...'}</span>
            </div>
          )}

          <div className="text-center mb-6">
            {countdown > 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {isEn ? 'Resend in' : 'إعادة الإرسال بعد'} <span className="font-bold text-[#D4AF37]">{countdown}</span> {isEn ? 's' : 'ثانية'}
              </p>
            ) : (
              <button onClick={onResend} className="text-[#3B5BFE] dark:text-[#D4AF37] font-bold text-sm hover:underline transition-colors" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {isEn ? 'Resend code' : 'إعادة إرسال الرمز'}
              </button>
            )}
          </div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            className="bg-white dark:bg-[#111827] rounded-2xl p-4 flex items-start gap-3 border border-[#E6DCC8] dark:border-white/10"
          >
            <Shield className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#1A1A1A] dark:text-white mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Secure login' : 'تسجيل دخول آمن'}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {isEn ? 'The code is valid for 10 minutes only. Do not share it.' : 'رمز التحقق صالح لمدة 10 دقائق فقط. لا تشارك هذا الرمز مع أي شخص.'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   PASSWORD SCREEN — Dark Hero + Shader Sphere + Glowing Lock
   ================================================================ */
function PasswordScreen({ email, setEmail, password, setPassword, onSubmit, onBack, onGoogleLogin, onFacebookLogin, isLoading }: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onBack: () => void;
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
  isLoading: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [activeShader, setActiveShader] = useState(2);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col min-h-screen"
    >
      {/* ═══ Dark Hero with 3D Illustration ═══ */}
      <div className="relative bg-[#0B1120] overflow-hidden px-6 pt-6 pb-16 md:pt-10 md:pb-20">
        <div className="absolute top-[-60px] right-[-40px] w-56 h-56 bg-[#D4AF37]/12 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-30px] left-[-30px] w-40 h-40 bg-[#3B5BFE]/10 rounded-full blur-[60px]" />
        <div className="absolute top-[30%] left-[20%] w-24 h-24 bg-[#8B5CF6]/8 rounded-full blur-[50px]" />

        <motion.button
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          onClick={onBack}
          className="relative z-20 flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5 rotate-180" />
          <span className="text-sm font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Back' : 'رجوع'}</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative z-10 flex justify-center"
        >
          <ShaderSphereHero activeShader={activeShader} setActiveShader={setActiveShader} />
        </motion.div>

        {/* Glowing Lock badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.4 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="relative group cursor-pointer">
            <motion.div
              className="absolute -inset-1.5 rounded-[18px] opacity-60"
              style={{ background: 'conic-gradient(from 0deg, #D4AF37, #FFD700, #3B5BFE, #D4AF37)', filter: 'blur(8px)' }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <div className="relative w-14 h-14 bg-[#111827]/90 backdrop-blur-xl border border-white/15 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(212,175,55,0.3)]">
              <Lock className="w-7 h-7 text-[#D4AF37]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ Form Card ═══ */}
      <div className="flex-1 bg-[#F5EEE1] dark:bg-[#1C1C1E] -mt-6 rounded-t-[28px] relative z-10">
        <div className="px-6 pt-10 pb-8 max-w-md mx-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6">
            <h2 className="text-2xl font-black text-[#1A1A1A] dark:text-white mb-1.5" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Sign In' : 'تسجيل الدخول'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Enter your email and password to access your account' : 'أدخل بريدك وكلمة المرور للدخول إلى حسابك'}
            </p>
          </motion.div>

          <motion.form initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
            onSubmit={onSubmit} className="space-y-3.5"
          >
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="block w-full pr-12 pl-4 py-4 border-2 border-gray-200 dark:border-white/10 rounded-2xl text-base bg-white dark:bg-[#111827] text-[#1A1A1A] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 transition-all"
                placeholder="name@example.com" dir="ltr" style={{ textAlign: 'left', fontFamily: 'Cairo, sans-serif' }} autoFocus required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                className="block w-full pr-12 pl-12 py-4 border-2 border-gray-200 dark:border-white/10 rounded-2xl text-base bg-white dark:bg-[#111827] text-[#1A1A1A] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 transition-all"
                placeholder={isEn ? 'Password' : 'كلمة المرور'} dir="ltr" style={{ textAlign: 'left', fontFamily: 'Cairo, sans-serif' }} required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button type="submit" disabled={isLoading || !email || !password}
              className="w-full bg-[#111827] dark:bg-white hover:bg-[#1E293B] dark:hover:bg-gray-100 text-white dark:text-[#1A1A1A] font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>{isEn ? 'Sign In' : 'تسجيل الدخول'}</span><ArrowLeft className="w-4 h-4" /></>}
            </button>
          </motion.form>

          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-gray-200 dark:border-white/10" />
            <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-xs font-bold">{isEn ? 'or' : 'أو'}</span>
            <div className="flex-grow border-t border-gray-200 dark:border-white/10" />
          </div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex gap-3"
          >
            <button
              onClick={onGoogleLogin}
              className="flex-1 bg-white dark:bg-[#111827] hover:bg-gray-50 dark:hover:bg-[#1E293B] border-2 border-gray-200 dark:border-white/10 hover:border-[#4285F4] text-gray-700 dark:text-white font-bold py-3.5 px-3 rounded-2xl flex items-center justify-center gap-2.5 transition-all"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              <GoogleIconSvg />
              <span className="text-sm">Google</span>
            </button>
            <button
              onClick={onFacebookLogin}
              className="flex-1 bg-white dark:bg-[#111827] hover:bg-gray-50 dark:hover:bg-[#1E293B] border-2 border-gray-200 dark:border-white/10 hover:border-[#1877F2] text-gray-700 dark:text-white font-bold py-3.5 px-3 rounded-2xl flex items-center justify-center gap-2.5 transition-all"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              <FacebookIconSvg />
              <span className="text-sm">Facebook</span>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}