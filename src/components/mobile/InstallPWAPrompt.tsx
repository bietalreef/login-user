/**
 * InstallPWAPrompt.tsx — نافذة تثبيت تطبيق بيت الريف
 * ══════════════════════════════════════════════════
 * تظهر فوراً عند أول زيارة على أي جهاز (موبايل / تابلت / ديسكتوب)
 * ثيم: زجاج رملي فاتح — ذهبي #D4AF37 — أزرق ملكي #3B5BFE
 * لا ثيم داكن · لا إيموجي · أيقونات lucide-react فقط
 */
import { useState, useEffect, startTransition } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Download, Share, Monitor, Smartphone,
  Wifi, Star, Shield, Clock, Check,
  ArrowDown, Plus, Home,
} from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

const font = 'Cairo, Tajawal, sans-serif';

const SHOW_DELAY_MS = 1200;
const DISMISS_DURATION_DAYS = 7;
const LS_KEY = 'bietalreef-pwa-dismissed';

// ── نوع آمن للجهاز ──────────────────────────────────────────
interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  isSafari: boolean;
}

const DEFAULT_DEVICE: DeviceInfo = {
  isIOS: false,
  isAndroid: false,
  isMobile: false,
  isDesktop: true,
  isSafari: false,
};

// ── كشف الجهاز — يُستدعى فقط في useEffect (client-side) ────
function detectDevice(): DeviceInfo {
  try {
    const ua = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);
    const isMobile = isIOS || isAndroid || window.innerWidth < 768;
    const isDesktop = !isMobile;
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    return { isIOS, isAndroid, isMobile, isDesktop, isSafari };
  } catch {
    return DEFAULT_DEVICE;
  }
}

function wasDismissedRecently(): boolean {
  try {
    const val = localStorage.getItem(LS_KEY);
    if (!val) return false;
    const ts = parseInt(val, 10);
    const days = (Date.now() - ts) / (1000 * 60 * 60 * 24);
    return days < DISMISS_DURATION_DAYS;
  } catch {
    return false;
  }
}

function markDismissed() {
  try { localStorage.setItem(LS_KEY, Date.now().toString()); } catch {}
}

function isAlreadyInstalled(): boolean {
  try {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  } catch {
    return false;
  }
}

// ── أيقونة التطبيق ──────────────────────────────────────────
function AppIcon() {
  return (
    <div style={{ width: 80, height: 80, position: 'relative', flexShrink: 0 }}>
      <div
        style={{
          position: 'absolute', inset: 0, borderRadius: 22,
          background: 'linear-gradient(135deg, #D4AF37 0%, #b8960f 50%, #3B5BFE 100%)',
          padding: 2,
        }}
      >
        <div
          style={{
            width: '100%', height: '100%', borderRadius: 20,
            background: 'linear-gradient(145deg, #1a2d1a 0%, #0f1f0f 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center', lineHeight: 1 }}>
            <div style={{ color: '#D4AF37', fontFamily: font, fontWeight: 900, fontSize: 11, letterSpacing: 1 }}>بيت</div>
            <div style={{ color: '#fff', fontFamily: font, fontWeight: 900, fontSize: 10, letterSpacing: 1 }}>الريف</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StarRating() {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13} style={{ fill: '#D4AF37', color: '#D4AF37' }} />
      ))}
    </div>
  );
}

function IOSGuide() {
  return (
    <div style={{
      borderRadius: 16, padding: '12px 14px', marginTop: 4,
      background: 'rgba(212,175,55,0.07)',
      border: '1px solid rgba(212,175,55,0.25)',
    }}>
      <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#8B6914', marginBottom: 10, fontFamily: font }}>
        خطوات التثبيت على iPhone / iPad
      </p>
      {[
        { num: '1', Icon: Share,  text: 'اضغط زر المشاركة في Safari' },
        { num: '2', Icon: Plus,   text: 'اختر "إضافة إلى الشاشة الرئيسية"' },
        { num: '3', Icon: Home,   text: 'اضغط "إضافة" لتأكيد التثبيت' },
      ].map(({ num, Icon, text }) => (
        <div key={num} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%', background: '#D4AF37',
            color: '#fff', fontSize: 11, fontWeight: 900,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>{num}</div>
          <Icon size={14} style={{ color: '#8B6914', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#5a4020', fontFamily: font }}>{text}</span>
        </div>
      ))}
    </div>
  );
}

const FEATURES = [
  { Icon: Wifi,     title: 'يعمل بدون إنترنت',  desc: 'حتى في المناطق ذات الإشارة الضعيفة', color: '#3B5BFE' },
  { Icon: Clock,    title: 'وصول فوري',           desc: 'تحميل أسرع بـ 3 مرات من المتصفح',    color: '#D4AF37' },
  { Icon: Shield,   title: 'آمن وموثوق',          desc: 'تشفير كامل وحماية بياناتك',           color: '#059669' },
  { Icon: Star,     title: 'تجربة أصلية',         desc: 'مثل تطبيقات المتجر بدون تنزيل',       color: '#D4AF37' },
];

// ── Export trigger ──────────────────────────────────────────
export const triggerPWAInstall = () => {
  window.dispatchEvent(new CustomEvent('bietalreef-show-install'));
};

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════
export function InstallPWAPrompt() {
  const { isInstallable, isInstalled, install, registerServiceWorker } = usePWA();

  const [visible, setVisible]       = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled]   = useState(false);
  // device detection happens only inside useEffect (safe, client-side)
  const [device, setDevice]         = useState<DeviceInfo>(DEFAULT_DEVICE);

  // Service Worker disabled — was causing stale cache issues
  // useEffect(() => { registerServiceWorker().catch(() => {}); }, []);

  // كشف الجهاز بأمان بعد الـ mount
  useEffect(() => {
    setDevice(detectDevice());
  }, []);

  // إظهار النافذة بعد SHOW_DELAY_MS
  useEffect(() => {
    if (isAlreadyInstalled()) return;
    if (wasDismissedRecently()) return;

    const timer = setTimeout(() => {
      // كشف الجهاز للتحقق من iOS
      const dev = detectDevice();
      const iosWithSafari = dev.isIOS && dev.isSafari;

      // لا تُظهر النافذة إلا إذا:
      // 1) المتصفح أطلق beforeinstallprompt (isInstallable = true)
      // 2) أو المستخدم على iOS + Safari (التثبيت اليدوي)
      if (isInstallable || iosWithSafari) {
        startTransition(() => setVisible(true));
      }
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isInstallable]);

  // استماع للحدث الخارجي
  useEffect(() => {
    const handler = () => {
      if (!isAlreadyInstalled()) {
        startTransition(() => setVisible(true));
      }
    };
    window.addEventListener('bietalreef-show-install', handler);
    return () => window.removeEventListener('bietalreef-show-install', handler);
  }, []);

  const handleInstall = async () => {
    if (device.isIOS) return;
    setInstalling(true);
    const ok = await install();
    setInstalling(false);
    if (ok) {
      setInstalled(true);
      setTimeout(() => startTransition(() => setVisible(false)), 2500);
    }
  };

  const handleDismiss = () => {
    markDismissed();
    startTransition(() => setVisible(false));
  };

  if (isAlreadyInstalled()) return null;

  const showIOSGuide    = device.isIOS && device.isSafari;
  const canNativeInstall = isInstallable && !device.isIOS;
  const isMobile        = device.isMobile;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="pwa-bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleDismiss}
            style={{
              position: 'fixed', inset: 0, zIndex: 9998,
              background: 'rgba(30,20,10,0.55)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
            }}
          />

          {/* Modal */}
          <motion.div
            key="pwa-modal"
            initial={isMobile ? { y: '100%', opacity: 0 } : { scale: 0.9, opacity: 0, y: 20 }}
            animate={isMobile ? { y: 0, opacity: 1 }       : { scale: 1,   opacity: 1, y: 0 }}
            exit   ={isMobile ? { y: '100%', opacity: 0 }  : { scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={e => e.stopPropagation()}
            dir="rtl"
            style={{
              position: 'fixed',
              zIndex: 9999,
              fontFamily: font,
              ...(isMobile
                ? { bottom: 0, left: 0, right: 0, maxHeight: '92dvh', overflowY: 'auto' }
                : {
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '92%', maxWidth: 460,
                    maxHeight: '90dvh', overflowY: 'auto',
                  }
              ),
            }}
          >
            <div style={{
              background: 'rgba(252,247,238,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: isMobile ? '24px 24px 0 0' : 24,
              border: '1.5px solid rgba(212,175,55,0.28)',
              boxShadow: '0 20px 60px rgba(30,20,5,0.2), 0 0 0 1px rgba(212,175,55,0.12)',
              overflow: 'hidden',
            }}>

              {/* شريط ذهبي أعلى */}
              <div style={{
                height: 3,
                background: 'linear-gradient(90deg, #D4AF37 0%, #3B5BFE 50%, #D4AF37 100%)',
              }} />

              {/* مقبض السحب (موبايل) */}
              {isMobile && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(180,140,60,0.3)' }} />
                </div>
              )}

              {/* زر الإغلاق */}
              <button
                onClick={handleDismiss}
                aria-label="إغلاق"
                style={{
                  position: 'absolute', top: isMobile ? 14 : 12, left: 14,
                  width: 30, height: 30, borderRadius: '50%',
                  border: 'none', cursor: 'pointer', background: 'rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#9a7840',
                }}
              >
                <X size={16} />
              </button>

              {/* ── Hero ── */}
              <div style={{
                padding: '16px 20px 18px',
                background: 'linear-gradient(160deg, rgba(212,175,55,0.07) 0%, rgba(59,91,254,0.03) 100%)',
                borderBottom: '1px solid rgba(212,175,55,0.13)',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* خلفية زخرفية */}
                <div style={{
                  position: 'absolute', top: -30, right: -30, width: 120, height: 120,
                  borderRadius: '50%', opacity: 0.18,
                  background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
                  <AppIcon />
                  <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#1a1208', fontFamily: font }}>
                      بيت الريف
                    </h2>
                    <p style={{ margin: '2px 0 6px', fontSize: 11, fontWeight: 600, color: '#7a6030', fontFamily: font }}>
                      منصة البناء الذكي في الإمارات
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <StarRating />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#D4AF37' }}>4.9</span>
                      <span style={{ fontSize: 11, color: '#9a7840' }}>(5,800+ تقييم)</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 3,
                        padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                        background: 'rgba(212,175,55,0.12)', color: '#8B6914',
                        border: '1px solid rgba(212,175,55,0.3)',
                      }}>
                        <Shield size={9} /> تطبيق رسمي
                      </span>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 3,
                        padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                        background: 'rgba(59,91,254,0.07)', color: '#3B5BFE',
                        border: '1px solid rgba(59,91,254,0.2)',
                      }}>
                        <Download size={9} /> مجاني
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Body ── */}
              <div style={{ padding: '18px 20px 20px' }}>

                {/* حالة مثبّت */}
                {installed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '16px 0' }}
                  >
                    <div style={{
                      width: 60, height: 60, borderRadius: '50%',
                      background: 'rgba(212,175,55,0.13)', border: '2px solid #D4AF37',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={28} color="#D4AF37" />
                    </div>
                    <p style={{ fontSize: 17, fontWeight: 900, color: '#1a1208', margin: 0 }}>تم التثبيت بنجاح</p>
                    <p style={{ fontSize: 12, color: '#7a6030', margin: 0, textAlign: 'center' }}>
                      ابحث عن أيقونة بيت الريف على شاشتك الرئيسية
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* عنوان */}
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                      <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 900, color: '#1a1208', fontFamily: font }}>
                        ثبّت التطبيق الآن
                      </h3>
                      <p style={{ margin: 0, fontSize: 12, color: '#7a6030', lineHeight: 1.6, fontFamily: font }}>
                        احصل على تجربة أسرع مباشرة من شاشتك الرئيسية
                      </p>
                    </div>

                    {/* خصائص 2×2 */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16,
                    }}>
                      {FEATURES.map(({ Icon, title, desc, color }) => (
                        <div key={title} style={{
                          borderRadius: 14, padding: '10px 12px',
                          background: 'rgba(255,255,255,0.72)',
                          border: '1px solid rgba(212,175,55,0.18)',
                          boxShadow: '0 2px 6px rgba(180,140,60,0.05)',
                        }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: 10, marginBottom: 6,
                            background: `${color}14`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Icon size={15} style={{ color }} />
                          </div>
                          <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#1a1208', fontFamily: font }}>{title}</p>
                          <p style={{ margin: 0, fontSize: 10, color: '#9a7840', lineHeight: 1.4, fontFamily: font }}>{desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* دليل iOS */}
                    {showIOSGuide && <IOSGuide />}
                    {showIOSGuide && (
                      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
                          <ArrowDown size={16} style={{ color: '#D4AF37' }} />
                        </motion.div>
                      </div>
                    )}

                    {/* أزرار */}
                    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {/* زر iOS */}
                      {showIOSGuide && (
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          padding: '13px 0', borderRadius: 16, fontWeight: 900, fontSize: 14,
                          background: 'linear-gradient(135deg, #D4AF37 0%, #b8960f 100%)',
                          color: '#fff', boxShadow: '0 4px 18px rgba(212,175,55,0.32)', fontFamily: font,
                        }}>
                          <Share size={16} />
                          اضغط زر المشاركة في Safari
                        </div>
                      )}

                      {/* زر native install */}
                      {(canNativeInstall || (!showIOSGuide && !canNativeInstall)) && (
                        <button
                          onClick={handleInstall}
                          disabled={installing}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            width: '100%', padding: '13px 0', borderRadius: 16,
                            border: 'none', cursor: installing ? 'not-allowed' : 'pointer',
                            fontWeight: 900, fontSize: 15, fontFamily: font,
                            background: 'linear-gradient(135deg, #D4AF37 0%, #b8960f 60%, #3B5BFE 180%)',
                            color: '#fff',
                            boxShadow: '0 4px 18px rgba(212,175,55,0.32)',
                            opacity: installing ? 0.75 : 1,
                            transition: 'opacity .2s, transform .1s',
                          }}
                        >
                          {installing ? (
                            <>
                              <div style={{
                                width: 18, height: 18, borderRadius: '50%',
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderTopColor: '#fff',
                                animation: 'pwa-spin 0.8s linear infinite',
                              }} />
                              جاري التثبيت...
                            </>
                          ) : (
                            <>
                              <Download size={17} />
                              ثبّت التطبيق — مجاناً
                            </>
                          )}
                        </button>
                      )}

                      {/* تأجيل */}
                      <button
                        onClick={handleDismiss}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          padding: '10px 0', fontSize: 12, fontWeight: 600,
                          color: '#9a7840', fontFamily: font, borderRadius: 12,
                        }}
                      >
                        لاحقاً
                      </button>
                    </div>

                    {/* أيقونات الأجهزة */}
                    <div style={{
                      marginTop: 14, paddingTop: 14,
                      borderTop: '1px solid rgba(212,175,55,0.13)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
                    }}>
                      {[
                        { Icon: Monitor,    label: 'ديسكتوب' },
                        { Icon: Smartphone, label: 'موبايل'   },
                        { Icon: Smartphone, label: 'تابلت'    },
                      ].map(({ Icon, label }) => (
                        <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <Icon size={14} style={{ color: '#c8a86a' }} />
                          <span style={{ fontSize: 10, color: '#b89060', fontFamily: font }}>{label}</span>
                        </div>
                      ))}
                      <span style={{ fontSize: 10, color: '#9a7840', fontFamily: font }}>يعمل على جميع الأجهزة</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* CSS للانيميشن */}
          <style>{`@keyframes pwa-spin { to { transform: rotate(360deg) } }`}</style>
        </>
      )}
    </AnimatePresence>
  );
}