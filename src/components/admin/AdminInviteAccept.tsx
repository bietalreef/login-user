/**
 * AdminInviteAccept — Page for accepting an admin invite via URL
 * Route: /admin/invite/:code
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router@7.1.1';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon3D } from '../ui/Icon3D';
import { acceptInvite } from './adminApi';
import { supabase } from '../../utils/supabase/client';
import { Award, Shield, Star } from 'lucide-react';
// Crown not available — using Award as alias
const Crown = Award;

export function AdminInviteAccept() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [status, setStatus] = useState<'checking' | 'ready' | 'accepting' | 'success' | 'error'>('checking');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const cardClass = isDark
    ? 'bg-white/[0.13] backdrop-blur-xl border border-white/[0.18]'
    : 'bg-white border-[4px] border-gray-200/60';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setStatus('ready');
      } else {
        setStatus('ready');
      }
    });
  }, []);

  const handleAccept = async () => {
    if (!code) {
      setErrorMsg('رمز الدعوة غير صالح');
      setStatus('error');
      return;
    }

    if (!isLoggedIn) {
      setErrorMsg('يجب تسجيل الدخول أولاً');
      setStatus('error');
      return;
    }

    setStatus('accepting');
    try {
      await acceptInvite(code);
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل في قبول الدعوة');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-[Cairo]"
         dir="rtl"
         style={{ background: 'var(--bait-bg)' }}>
      <div className={`${cardClass} rounded-3xl p-8 max-w-md w-full text-center space-y-6`}>
        {status === 'checking' && (
          <>
            <div className="flex justify-center">
              <Icon3D icon={Shield} theme="blue" size="xl" hoverable={false} />
            </div>
            <p style={{ color: 'var(--bait-text-secondary)' }}>جاري التحقق...</p>
          </>
        )}

        {status === 'ready' && (
          <>
            <div className="flex justify-center">
              <Icon3D icon={Crown} theme="gold" size="xl" hoverable={false} />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--bait-text)' }}>
              دعوة أدمن
            </h2>
            <p style={{ color: 'var(--bait-text-secondary)' }}>
              {isLoggedIn
                ? 'تم دعوتك للانضمام كأدمن في منصة بيت الريف'
                : 'يجب تسجيل الدخول أولاً لقبول الدعوة'
              }
            </p>
            <div className="font-mono text-xs px-4 py-2 rounded-lg"
                 style={{ background: 'var(--bait-badge-bg)', color: 'var(--bait-text-muted)' }}>
              {code}
            </div>
            {isLoggedIn ? (
              <button onClick={handleAccept}
                className="w-full py-4 rounded-xl font-bold
                  bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-[#5D4037]
                  border-[4px] border-[#D4AF37]/30
                  hover:scale-[1.02] active:scale-95 transition-transform">
                قبول الدعوة والانضمام كأدمن
              </button>
            ) : (
              <button onClick={() => navigate('/')}
                className="w-full py-4 rounded-xl font-bold
                  bg-gradient-to-l from-[#3B5BFE] to-[#5A78FF] text-white
                  border-[4px] border-[#3B5BFE]/30
                  hover:scale-[1.02] active:scale-95 transition-transform">
                تسجيل الدخول أولاً
              </button>
            )}
          </>
        )}

        {status === 'accepting' && (
          <>
            <div className="flex justify-center">
              <Icon3D icon={Shield} theme="blue" size="xl" hoverable={false} />
            </div>
            <p style={{ color: 'var(--bait-text-secondary)' }}>جاري تفعيل صلاحيات الأدمن...</p>
            <div className="w-48 h-1 bg-[var(--bait-border)] rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-l from-[#D4AF37] to-[#FFD700] rounded-full animate-pulse"
                   style={{ width: '70%' }} />
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center">
              <Icon3D icon={Star} theme="gold" size="xl" hoverable={false} />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: isDark ? '#FFD700' : '#D4AF37' }}>
              تم التفعيل بنجاح
            </h2>
            <p style={{ color: 'var(--bait-text-secondary)' }}>
              أنت الآن أدمن في منصة بيت الريف
            </p>
            <button onClick={() => navigate('/admin')}
              className="w-full py-4 rounded-xl font-bold
                bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-[#5D4037]
                border-[4px] border-[#D4AF37]/30
                hover:scale-[1.02] active:scale-95 transition-transform">
              الذهاب للوحة التحكم
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center">
              <Icon3D icon={Shield} theme="red" size="xl" hoverable={false} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--bait-text)' }}>
              خطأ
            </h2>
            <p style={{ color: 'var(--bait-text-secondary)' }}>{errorMsg}</p>
            <div className="flex gap-3">
              <button onClick={() => navigate('/home')}
                className="flex-1 py-3 rounded-xl font-bold
                  bg-[var(--bait-surface)] border-[4px] border-gray-200/60
                  hover:scale-[1.02] active:scale-95 transition-transform"
                style={{ color: 'var(--bait-text)' }}>
                الرئيسية
              </button>
              <button onClick={() => { setStatus('ready'); setErrorMsg(''); }}
                className="flex-1 py-3 rounded-xl font-bold
                  bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-[#5D4037]
                  border-[4px] border-[#D4AF37]/30
                  hover:scale-[1.02] active:scale-95 transition-transform">
                إعادة المحاولة
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
