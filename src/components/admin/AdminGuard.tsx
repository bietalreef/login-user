/**
 * AdminGuard — Protects admin routes
 * Verifies user is authenticated + has admin role via user_roles table
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router@7.1.1';
import { verifyAdmin } from './adminApi';
import { Icon3D } from '../ui/Icon3D';
import { Shield, Award } from 'lucide-react';
// Crown not available — using Award as alias
const Crown = Award;

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [status, setStatus] = useState<'loading' | 'authorized' | 'forbidden' | 'error'>('loading');
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await verifyAdmin();
        if (cancelled) return;

        if (res.is_admin) {
          setAdminInfo(res);
          setStatus('authorized');
        } else {
          setStatus('forbidden');
        }
      } catch (err: any) {
        console.error('AdminGuard check failed:', err);
        if (cancelled) return;
        setStatus('error');
      }
    }

    check();
    return () => { cancelled = true; };
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bait-bg)]" dir="rtl">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Icon3D icon={Shield} theme="blue" size="xl" hoverable={false} />
          </div>
          <p className="text-[var(--bait-text-secondary)] font-[Cairo] text-lg">
            جاري التحقق من الصلاحيات...
          </p>
          <div className="w-48 h-1 bg-[var(--bait-border)] rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-l from-[#D4AF37] to-[#FFD700] rounded-full animate-pulse" 
                 style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (status === 'forbidden' || status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bait-bg)]" dir="rtl">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          <div className="flex justify-center">
            <Icon3D icon={Crown} theme="red" size="xl" hoverable={false} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--bait-text)] font-[Cairo]">
            {status === 'forbidden' ? 'غير مصرح بالوصول' : 'خطأ في التحقق'}
          </h2>
          <p className="text-[var(--bait-text-secondary)] font-[Cairo]">
            {status === 'forbidden'
              ? 'ليس لديك صلاحيات الأدمن للوصول إلى لوحة التحكم. تواصل مع المسؤول للحصول على رابط دعوة.'
              : 'حدث خطأ أثناء التحقق من صلاحياتك. تأكد من تسجيل الدخول وحاول مرة أخرى.'
            }
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 rounded-xl font-[Cairo] font-bold
                bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-[#5D4037]
                border-[4px] border-gray-200/60
                hover:scale-105 active:scale-95 transition-transform"
            >
              العودة للرئيسية
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl font-[Cairo] font-bold
                bg-[var(--bait-surface)] text-[var(--bait-text)]
                border-[4px] border-gray-200/60
                hover:scale-105 active:scale-95 transition-transform"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
