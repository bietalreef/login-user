import { useEffect, useState } from 'react';
import { Download, X, HelpCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallProviderAppPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ── التحقق من أن التطبيق مثبت أو على جهاز محمول ──
  useEffect(() => {
    // التحقق من الجهاز المحمول
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(isMobileDevice);
    };

    // التحقق من أن التطبيق مثبت
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      if (navigator.standalone === true) {
        setIsInstalled(true);
      }
    };

    checkMobile();
    checkInstalled();

    // الاستماع لحدث beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);

      // التحقق من أن الرسالة لم تُغلق قبل 7 أيام
      const lastDismissed = localStorage.getItem('install_prompt_dismissed');
      if (lastDismissed) {
        const dismissedDate = new Date(lastDismissed);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff < 7) {
          return;
        }
      }

      // عرض الرسالة فقط على الهاتف
      if (isMobile && !isInstalled) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isMobile, isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // إذا لم يكن هناك beforeinstallprompt، عرض إرشادات يدوية
      setShowManualInstructions(true);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setShowPrompt(false);
        localStorage.removeItem('install_prompt_dismissed');
      } else {
        handleDismiss();
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error('خطأ في محاولة التثبيت:', error);
      setShowManualInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('install_prompt_dismissed', new Date().toISOString());
  };

  // عدم عرض الرسالة إذا كان التطبيق مثبتاً أو على سطح المكتب
  if (!showPrompt || isInstalled || !isMobile) {
    return null;
  }

  return (
    <>
      {/* ── الرسالة الرئيسية ── */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={handleDismiss}
      >
        <div
          className="w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4"
          style={{ backgroundColor: '#FDFAF4', border: '1px solid #d8cdb8' }}
          onClick={e => e.stopPropagation()}
        >
          {/* ── رأس الرسالة ── */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#1F3D2B' }}
              >
                <Download size={24} style={{ color: '#D4AF37' }} />
              </div>
              <div>
                <h2 className="font-bold text-base" style={{ color: '#1F3D2B' }}>
                  ثبّت التطبيق
                </h2>
                <p className="text-xs mt-0.5" style={{ color: '#6b7c6e' }}>
                  لأفضل تجربة
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg transition-all"
              style={{ color: '#6b7c6e' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* ── النص الرئيسي ── */}
          <div className="mb-4">
            <p className="font-bold text-sm mb-2" style={{ color: '#1F3D2B' }}>
              لأفضل تجربة، قم بتثبيت تطبيق مزودي بيت الريف على جهازك.
            </p>
            <p className="text-xs" style={{ color: '#6b7c6e', lineHeight: '1.6' }}>
              استقبل المناقصات، أنشئ عروض السعر، تابع المستندات، وادخل لحسابك بسرعة من الشاشة الرئيسية.
            </p>
          </div>

          {/* ── الفوائد ── */}
          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-2 text-xs" style={{ color: '#15803d' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#15803d' }} />
              <span>وصول سريع من الشاشة الرئيسية</span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: '#15803d' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#15803d' }} />
              <span>يعمل بدون اتصال إنترنت (جزئياً)</span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: '#15803d' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#15803d' }} />
              <span>تجربة أسرع وأكثر سلاسة</span>
            </div>
          </div>

          {/* ── الأزرار ── */}
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all"
              style={{
                backgroundColor: '#F5EEE1',
                color: '#1F3D2B',
                border: '1px solid #d8cdb8',
              }}
            >
              متابعة من المتصفح
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#1F3D2B',
                color: 'white',
              }}
            >
              <Download size={16} />
              تثبيت التطبيق
            </button>
          </div>
        </div>
      </div>

      {/* ── رسالة الإرشادات اليدوية ── */}
      {showManualInstructions && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowManualInstructions(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{ backgroundColor: '#FDFAF4', border: '1px solid #d8cdb8' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#eff6ff' }}
              >
                <HelpCircle size={20} style={{ color: '#1d4ed8' }} />
              </div>
              <h2 className="font-bold text-base" style={{ color: '#1F3D2B' }}>
                كيفية التثبيت
              </h2>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: '#1F3D2B' }}>
                  على هاتفك:
                </p>
                <ol className="text-xs space-y-1" style={{ color: '#6b7c6e' }}>
                  <li>1. اضغط على قائمة المتصفح (الثلاث نقاط)</li>
                  <li>2. اختر "Add to Home Screen" أو "إضافة إلى الشاشة الرئيسية"</li>
                  <li>3. أكّد الإضافة</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowManualInstructions(false)}
              className="w-full py-2.5 rounded-lg font-semibold text-sm"
              style={{
                backgroundColor: '#1F3D2B',
                color: 'white',
              }}
            >
              فهمت
            </button>
          </div>
        </div>
      )}
    </>
  );
}
