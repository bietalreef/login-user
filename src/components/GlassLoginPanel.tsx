import { Lock, Loader2 } from 'lucide-react';
import { BietAlreefLogo } from './BietAlreefLogo';
import { GoogleIcon } from './GoogleIcon';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
const logoImage = '/assets/logo.png';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { UserRole, UserTier } from './EntryPathSelection';
import { useUser } from '../utils/UserContext';

interface GlassLoginPanelProps {
  onNext?: () => void;
  onBack?: () => void;
  initialData?: { role: UserRole; tier: UserTier };
}

export function GlassLoginPanel({ onNext, onBack, initialData }: GlassLoginPanelProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('signup'); // Default to signup for new entry path
  const [isLoading, setIsLoading] = useState(false);
  const { updateProfile } = useUser();

  const tierLabels = {
    visitor: 'زائر',
    verified: 'موثق',
    pro: 'احترافي'
  };

  const handleAuth = async () => {
    if (!email || !password) {
      toast.error('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        // Sign Up
        const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({ email, password, name: email.split('@')[0] })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'فشل إنشاء الحساب');
        
        toast.success('تم إنشاء الحساب بنجاح!');
        
        // Auto login
        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (loginError) throw loginError;

        // Apply Role & Tier immediately if provided
        if (initialData) {
            const mappedTier: any = initialData.tier === 'visitor' ? 'guest' : initialData.tier;
            await updateProfile({
                role: initialData.role,
                tier: mappedTier,
                is_verified: initialData.tier !== 'visitor'
            });
        }

        onNext?.();
      } else {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
            if (error.message.includes('Invalid login')) {
                throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            }
            throw error;
        }
        
        // Check if we need to update role/tier on login too? 
        if (initialData) {
             const mappedTier: any = initialData.tier === 'visitor' ? 'guest' : initialData.tier;
             await updateProfile({
                role: initialData.role,
                tier: mappedTier,
                is_verified: initialData.tier !== 'visitor'
            });
        }

        onNext?.();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
     const { error } = await supabase.auth.signInWithOAuth({
       provider: 'google',
       options: { redirectTo: window.location.origin },
     });
     if (error) toast.error(error.message);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-[420px] h-auto relative"
    >
      {onBack && (
        <button 
            onClick={onBack}
            className="absolute -left-16 top-0 p-3 bg-white/40 hover:bg-white/60 rounded-full backdrop-blur-md transition-colors text-amber-900"
        >
            <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      {/* Glass Panel */}
      <div
        className="relative backdrop-blur-[22px] bg-white/35 rounded-[28px] p-10 border border-white/15"
        style={{
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <ImageWithFallback
            src={logoImage}
            alt="بيت الريف"
            className="w-[80px] h-[80px] object-contain"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 
            className="text-[20px] text-[#1A1A1A] mb-2"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
          >
            {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h1>
          {initialData && (
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5B7FE8]/10 rounded-full border border-[#5B7FE8]/20">
                <span className="w-2 h-2 rounded-full bg-[#5B7FE8]" />
                <span className="text-xs text-[#5B7FE8] font-medium" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    مسار: {initialData.role === 'client' ? 'عميل' : 'مزود'} {tierLabels[initialData.tier]}
                </span>
             </div>
          )}
        </div>

        {/* Google Button */}
        <motion.button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white rounded-[16px] shadow-sm hover:shadow-md transition-shadow duration-200 mb-6"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <GoogleIcon />
          <span className="text-[#1A1A1A] text-[15px]" style={{ fontFamily: 'Cairo, sans-serif' }}>
            متابعة عبر جوجل
          </span>
        </motion.button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#6F6F6F]/20" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white/40 backdrop-blur-sm px-4 text-xs text-[#6F6F6F]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
              أو عبر البريد الإلكتروني
            </span>
          </div>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label 
            className="block text-[13px] text-[#1A1A1A]/80 mb-2 text-right"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            البريد الإلكتروني
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-5 py-3.5 pr-12 bg-white/50 border border-[#6F6F6F]/20 rounded-[16px] focus:border-[#00A77B]/50 focus:outline-none transition-all duration-200 text-[#1A1A1A]"
              style={{ fontFamily: 'Cairo, sans-serif' }}
              dir="ltr"
            />
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F6F6F]/50" />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label 
            className="block text-[13px] text-[#1A1A1A]/80 mb-2 text-right"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            كلمة المرور
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3.5 pr-12 bg-white/50 border border-[#6F6F6F]/20 rounded-[16px] focus:border-[#00A77B]/50 focus:outline-none transition-all duration-200 text-[#1A1A1A]"
              style={{ fontFamily: 'Cairo, sans-serif' }}
              dir="ltr"
            />
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F6F6F]/50" />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={handleAuth}
          disabled={isLoading}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#5B7FE8] to-[#7B5FE8] text-white rounded-[20px] hover:opacity-90 transition-opacity duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
             mode === 'login' ? 'إكمال الدخول' : 'إنشاء وبدء'
          )}
        </motion.button>

        {/* Toggle Mode */}
        <div className="mt-4 text-center">
            <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-sm text-[#5B7FE8] hover:underline"
                style={{ fontFamily: 'Cairo, sans-serif' }}
            >
                {mode === 'login' ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخول'}
            </button>
        </div>

        {/* Terms */}
        <p 
          className="text-center text-[11px] text-[#6F6F6F]/60 mt-6 leading-relaxed"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          بالمتابعة، أنت توافق على{' '}
          <a href="/terms" className="text-[#5B7FE8] hover:underline">
            الشروط والأحكام
          </a>
          {' '}و{' '}
          <a href="/privacy" className="text-[#5B7FE8] hover:underline">
            سياسة الخصوصية
          </a>
        </p>
      </div>
    </motion.div>
  );
}