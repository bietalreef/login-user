/**
 * CloudDesktopSetup.tsx — معالج إعداد بيئة الحوسبة السحابية
 * ═══════════════════════════════════════════════════════════════
 * خطوات: مرحبا → Google Cloud → Project ID → API Key → جاهز
 * تصميم: Frosted Glass داكن، ذهبي (#D4AF37)، أزرق (#3B5BFE)
 * لا ألوان خضراء — لا إيموجي — أيقونات Lucide فقط
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cloud, Server, KeyRound, ShieldCheck,
  ChevronRight, ChevronLeft, ExternalLink,
  Terminal, Cpu, Globe, Lock, Loader2,
  Eye, EyeOff, CheckCircle2, AlertTriangle,
  Monitor, Zap, ArrowRight,
} from 'lucide-react';
import { supabase } from '../../utils/supabase/client';
import { projectId as supaProjectId, publicAnonKey } from '../../utils/supabase/info';

const API = `https://${supaProjectId}.supabase.co/functions/v1/make-server-ad34c09a`;
const fontCairo = "'Cairo','Tajawal',system-ui,sans-serif";
const fontMono  = "'JetBrains Mono','Fira Code','Courier New',monospace";

// ─── Design tokens ───
const T = {
  bg:         '#060C1A',
  bgPanel:    'rgba(15,20,40,0.85)',
  bgCard:     'rgba(255,255,255,0.03)',
  border:     'rgba(255,255,255,0.07)',
  borderHi:   'rgba(212,175,55,0.25)',
  text:       '#F1F5F9',
  textDim:    '#94A3B8',
  textMut:    'rgba(255,255,255,0.28)',
  gold:       '#D4AF37',
  goldSoft:   'rgba(212,175,55,0.10)',
  goldBorder: 'rgba(212,175,55,0.22)',
  blue:       '#3B5BFE',
  blueSoft:   'rgba(59,91,254,0.10)',
  blueBorder: 'rgba(59,91,254,0.22)',
  amber:      '#F59E0B',
  amberSoft:  'rgba(245,158,11,0.10)',
  inputBg:    'rgba(255,255,255,0.04)',
  inputBdr:   'rgba(255,255,255,0.10)',
};

type Step = 'welcome' | 'cloud-id' | 'api-key' | 'service-account' | 'launching';

interface SetupData {
  projectId: string;
  apiKey: string;
  serviceAccountJson: string;
}

interface CloudDesktopSetupProps {
  onComplete: (config: SetupData) => void;
}

// ─── Step Definitions ───
const STEPS: { id: Step; labelAr: string; icon: typeof Cloud }[] = [
  { id: 'welcome',         labelAr: 'البيئة',   icon: Monitor   },
  { id: 'cloud-id',        labelAr: 'المشروع',  icon: Cloud     },
  { id: 'api-key',         labelAr: 'المفتاح',  icon: KeyRound  },
  { id: 'service-account', labelAr: 'الحساب',   icon: ShieldCheck },
  { id: 'launching',       labelAr: 'الانطلاق', icon: Zap       },
];

// ─── What they get ───
const FEATURES = [
  { icon: Terminal, label: 'طرفية سحابية',     desc: 'أوامر bash حقيقية على خادمك السحابي' },
  { icon: Globe,    label: 'متصفح سحابي',      desc: 'تصفح الإنترنت بهوية سحابية معزولة'   },
  { icon: Server,   label: 'تخزين Google Drive', desc: 'ملفاتك في السحابة دائماً متاحة'     },
  { icon: Cpu,      label: 'وكلاء ذكية',        desc: 'AI agents تعمل على بيئتك الخاصة'    },
  { icon: Lock,     label: 'عزل كامل',          desc: 'بيئة مستقلة ومشفرة لحمايتك'         },
  { icon: Zap,      label: 'تنفيذ فوري',        desc: 'مهام تعمل تلقائياً 24/7 نيابة عنك'  },
];

// ─── InputField ───
function InputField({
  label, hint, value, onChange, type = 'text', placeholder, mono = false, rows,
  linkLabel, linkUrl, warning,
}: {
  label: string; hint?: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; mono?: boolean; rows?: number;
  linkLabel?: string; linkUrl?: string; warning?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: fontCairo }}>
          {label}
        </label>
        {linkLabel && linkUrl && (
          <a
            href={linkUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: T.blue, textDecoration: 'none', fontFamily: fontCairo }}
          >
            <ExternalLink size={11} />
            {linkLabel}
          </a>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        {rows ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: T.inputBg, border: `1px solid ${value ? T.goldBorder : T.inputBdr}`,
              borderRadius: 12, padding: '12px 16px',
              color: T.text, fontSize: 12, fontFamily: mono ? fontMono : fontCairo,
              resize: 'vertical', outline: 'none', transition: 'border-color 0.2s',
            }}
          />
        ) : (
          <input
            type={actualType}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: T.inputBg, border: `1px solid ${value ? T.goldBorder : T.inputBdr}`,
              borderRadius: 12, padding: isPassword ? '12px 44px 12px 16px' : '12px 16px',
              color: T.text, fontSize: 13, fontFamily: mono ? fontMono : fontCairo,
              outline: 'none', transition: 'border-color 0.2s',
            }}
          />
        )}
        {isPassword && (
          <button
            onClick={() => setShow(s => !s)}
            style={{
              position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: T.textDim, padding: 0,
            }}
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>

      {warning && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 8,
          background: T.amberSoft, border: `1px solid rgba(245,158,11,0.22)`,
          borderRadius: 10, padding: '10px 14px',
        }}>
          <AlertTriangle size={13} style={{ color: T.amber, flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 11.5, color: T.amber, fontFamily: fontCairo, lineHeight: 1.5 }}>{warning}</span>
        </div>
      )}

      {hint && !warning && (
        <span style={{ fontSize: 11, color: T.textMut, fontFamily: fontCairo, lineHeight: 1.5 }}>{hint}</span>
      )}
    </div>
  );
}

// ─── Primary Button ───
function PrimaryBtn({
  label, onClick, disabled, loading, icon: Icon,
}: {
  label: string; onClick: () => void; disabled?: boolean; loading?: boolean;
  icon?: typeof ChevronRight;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: '100%', height: 52,
        background: disabled
          ? 'rgba(255,255,255,0.05)'
          : 'linear-gradient(135deg, #D4AF37 0%, #B8961E 100%)',
        border: disabled ? `1px solid ${T.border}` : '1px solid rgba(212,175,55,0.3)',
        borderRadius: 14, cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: disabled ? 'none' : '0 8px 24px rgba(212,175,55,0.25)',
        transition: 'all 0.2s',
      }}
    >
      {loading
        ? <Loader2 size={18} style={{ color: '#080E1C', animation: 'spin 1s linear infinite' }} />
        : <>
            <span style={{ fontSize: 15, fontWeight: 800, color: disabled ? T.textMut : '#080E1C', fontFamily: fontCairo }}>
              {label}
            </span>
            {Icon && <Icon size={16} style={{ color: disabled ? T.textMut : '#080E1C' }} />}
          </>
      }
    </motion.button>
  );
}

// ─── Step Indicator ───
function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.findIndex(s => s.id === current);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
      {STEPS.map((s, i) => {
        const done    = i < idx;
        const active  = i === idx;
        const Icon    = s.icon;
        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: active ? 36 : 28, height: 28, borderRadius: 20,
              background: done ? T.goldSoft : active ? T.gold : T.bgCard,
              border: `1px solid ${done || active ? T.goldBorder : T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s',
            }}>
              {done
                ? <CheckCircle2 size={13} style={{ color: T.gold }} />
                : <Icon size={13} style={{ color: active ? '#080E1C' : T.textDim }} />
              }
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 20, height: 1, background: i < idx ? T.goldBorder : T.border }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════
export function CloudDesktopSetup({ onComplete }: CloudDesktopSetupProps) {
  const [step, setStep]   = useState<Step>('welcome');
  const [data, setData]   = useState<SetupData>({ projectId: '', apiKey: '', serviceAccountJson: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  // ── Save to server ──
  async function handleLaunch() {
    setSaving(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`${API}/cloud-desktop/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...(token ? { 'X-User-Token': token } : {}),
        },
        body: JSON.stringify({
          projectId:          data.projectId,
          apiKey:             data.apiKey,
          serviceAccountJson: data.serviceAccountJson || null,
          provider:           'google-cloud',
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || 'فشل الحفظ');

      setStep('launching');
      // animate then open desktop
      setTimeout(() => onComplete(data), 2200);
    } catch (e: any) {
      setError(e.message || 'حدث خطأ، أعد المحاولة');
      setSaving(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: T.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: fontCairo, direction: 'rtl',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(rgba(212,175,55,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.6) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
      }} />

      {/* Glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 300, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(59,91,254,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <WelcomeStep key="welcome" onNext={() => setStep('cloud-id')} />
        )}
        {step === 'cloud-id' && (
          <ProjectIdStep key="cloud-id"
            value={data.projectId}
            onChange={v => setData(d => ({ ...d, projectId: v }))}
            onNext={() => setStep('api-key')}
            onBack={() => setStep('welcome')}
          />
        )}
        {step === 'api-key' && (
          <ApiKeyStep key="api-key"
            value={data.apiKey}
            onChange={v => setData(d => ({ ...d, apiKey: v }))}
            onNext={() => setStep('service-account')}
            onBack={() => setStep('cloud-id')}
          />
        )}
        {step === 'service-account' && (
          <ServiceAccountStep key="service-account"
            value={data.serviceAccountJson}
            onChange={v => setData(d => ({ ...d, serviceAccountJson: v }))}
            onNext={handleLaunch}
            onBack={() => setStep('api-key')}
            loading={saving}
            error={error}
          />
        )}
        {step === 'launching' && (
          <LaunchingStep key="launching" />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CARD WRAPPER ───
function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 520,
        background: T.bgPanel,
        border: `1px solid ${T.border}`,
        borderRadius: 24,
        backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        padding: '36px 40px',
        display: 'flex', flexDirection: 'column', gap: 28,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── STEP 0: WELCOME ───
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <Card>
      {/* Logo / Title */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(59,91,254,0.15))',
          border: `1px solid ${T.goldBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Monitor size={28} style={{ color: T.gold }} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: T.text, margin: '0 0 6px', fontFamily: fontCairo }}>
          بيئتك السحابية الخاصة
        </h1>
        <p style={{ fontSize: 13, color: T.textDim, margin: 0, lineHeight: 1.7, fontFamily: fontCairo }}>
          سطح مكتب مستضاف على Google Cloud — يعمل 24/7 نيابة عنك
        </p>
      </div>

      {/* Features Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {FEATURES.map(f => (
          <div key={f.label} style={{
            background: T.bgCard, border: `1px solid ${T.border}`,
            borderRadius: 14, padding: '14px 16px',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: T.goldSoft, border: `1px solid ${T.goldBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <f.icon size={15} style={{ color: T.gold }} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: fontCairo }}>{f.label}</div>
              <div style={{ fontSize: 10.5, color: T.textDim, marginTop: 2, fontFamily: fontCairo, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PrimaryBtn label="ابدأ الإعداد" onClick={onNext} icon={ArrowRight} />
        <p style={{ textAlign: 'center', fontSize: 11, color: T.textMut, margin: 0, fontFamily: fontCairo }}>
          تحتاج حساباً على Google Cloud — الإعداد يستغرق دقيقتين فقط
        </p>
      </div>
    </Card>
  );
}

// ─── STEP 1: PROJECT ID ───
function ProjectIdStep({
  value, onChange, onNext, onBack,
}: { value: string; onChange: (v: string) => void; onNext: () => void; onBack: () => void }) {
  return (
    <Card>
      <StepIndicator current="cloud-id" />

      <div>
        <h2 style={{ fontSize: 19, fontWeight: 800, color: T.text, margin: '0 0 8px', fontFamily: fontCairo }}>
          ربط مشروع Google Cloud
        </h2>
        <p style={{ fontSize: 13, color: T.textDim, margin: 0, lineHeight: 1.7, fontFamily: fontCairo }}>
          أدخل معرّف المشروع الخاص بك. إذا لم يكن لديك مشروع، أنشئه من Console أولاً.
        </p>
      </div>

      {/* Instructions Card */}
      <div style={{
        background: T.blueSoft, border: `1px solid ${T.blueBorder}`,
        borderRadius: 14, padding: '16px 18px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.blue, fontFamily: fontCairo }}>
          كيفية الحصول على Project ID:
        </div>
        {[
          'افتح console.cloud.google.com',
          'انقر على القائمة المنسدلة للمشروع (أعلى الصفحة)',
          'انسخ الـ Project ID (ليس الاسم)',
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: fontCairo }}>
            <span style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
              background: T.blue, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 800, color: '#fff',
            }}>{i + 1}</span>
            <span style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>{step}</span>
          </div>
        ))}
        <a
          href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: T.blue, textDecoration: 'none', marginTop: 4, fontFamily: fontCairo }}
        >
          <ExternalLink size={12} /> فتح Google Cloud Console
        </a>
      </div>

      <InputField
        label="Project ID"
        placeholder="my-project-123456"
        value={value}
        onChange={onChange}
        mono
        hint="مثال: beit-alreef-prod أو weyaak-platform-2025"
      />

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{
          flex: '0 0 48px', height: 52, borderRadius: 14,
          background: T.bgCard, border: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: T.textDim,
        }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <PrimaryBtn label="التالي" onClick={onNext} disabled={!value.trim()} icon={ChevronRight} />
        </div>
      </div>
    </Card>
  );
}

// ─── STEP 2: API KEY ───
function ApiKeyStep({
  value, onChange, onNext, onBack,
}: { value: string; onChange: (v: string) => void; onNext: () => void; onBack: () => void }) {
  return (
    <Card>
      <StepIndicator current="api-key" />

      <div>
        <h2 style={{ fontSize: 19, fontWeight: 800, color: T.text, margin: '0 0 8px', fontFamily: fontCairo }}>
          إنشاء API Key
        </h2>
        <p style={{ fontSize: 13, color: T.textDim, margin: 0, lineHeight: 1.7, fontFamily: fontCairo }}>
          المفتاح يسمح لبيئتك السحابية بالتواصل مع خدمات Google.
        </p>
      </div>

      <div style={{
        background: T.blueSoft, border: `1px solid ${T.blueBorder}`,
        borderRadius: 14, padding: '16px 18px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.blue, fontFamily: fontCairo }}>
          خطوات إنشاء API Key:
        </div>
        {[
          'افتح Credentials في Cloud Console',
          'انقر "+ Create Credentials" ← API Key',
          'انسخ المفتاح وألصقه أدناه',
          '(اختياري) قيّد المفتاح على APIs المطلوبة فقط',
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: fontCairo }}>
            <span style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
              background: T.blue, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 800, color: '#fff',
            }}>{i + 1}</span>
            <span style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>{s}</span>
          </div>
        ))}
        <a
          href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: T.blue, textDecoration: 'none', marginTop: 4, fontFamily: fontCairo }}
        >
          <ExternalLink size={12} /> فتح صفحة Credentials
        </a>
      </div>

      <InputField
        label="API Key"
        placeholder="AIzaSyD..."
        value={value}
        onChange={onChange}
        type="password"
        mono
        warning="لا تشارك هذا المفتاح مع أحد — يُخزَّن بشكل مشفر في بيئتك الخاصة فقط"
      />

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{
          flex: '0 0 48px', height: 52, borderRadius: 14,
          background: T.bgCard, border: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: T.textDim,
        }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <PrimaryBtn label="التالي" onClick={onNext} disabled={!value.trim()} icon={ChevronRight} />
        </div>
      </div>
    </Card>
  );
}

// ─── STEP 3: SERVICE ACCOUNT ───
function ServiceAccountStep({
  value, onChange, onNext, onBack, loading, error,
}: {
  value: string; onChange: (v: string) => void;
  onNext: () => void; onBack: () => void;
  loading: boolean; error: string;
}) {
  return (
    <Card>
      <StepIndicator current="service-account" />

      <div>
        <h2 style={{ fontSize: 19, fontWeight: 800, color: T.text, margin: '0 0 8px', fontFamily: fontCairo }}>
          Service Account (اختياري)
        </h2>
        <p style={{ fontSize: 13, color: T.textDim, margin: 0, lineHeight: 1.7, fontFamily: fontCairo }}>
          أضف Service Account JSON لصلاحيات متقدمة. يمكنك تخطي هذه الخطوة والإضافة لاحقاً.
        </p>
      </div>

      <InputField
        label="Service Account JSON"
        placeholder={'{\n  "type": "service_account",\n  "project_id": "...",\n  ...\n}'}
        value={value}
        onChange={onChange}
        rows={5}
        mono
        linkLabel="إنشاء Service Account"
        linkUrl="https://console.cloud.google.com/iam-admin/serviceaccounts"
        hint="من Credentials → Service Accounts → Create → نزّل مفتاح JSON"
      />

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)',
          borderRadius: 12, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertTriangle size={14} style={{ color: '#EF4444' }} />
          <span style={{ fontSize: 12, color: '#EF4444', fontFamily: fontCairo }}>{error}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onBack} disabled={loading} style={{
          flex: '0 0 48px', height: 52, borderRadius: 14,
          background: T.bgCard, border: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: loading ? 'not-allowed' : 'pointer', color: T.textDim,
        }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <PrimaryBtn
            label={loading ? 'جاري الإعداد...' : 'تشغيل البيئة السحابية'}
            onClick={onNext}
            loading={loading}
            icon={Zap}
          />
        </div>
      </div>
    </Card>
  );
}

// ─── STEP 4: LAUNCHING ───
function LaunchingStep() {
  const [prog, setProg] = useState(0);
  const msgs = [
    'تهيئة البيئة السحابية...',
    'الاتصال بـ Google Cloud...',
    'إعداد الطرفية...',
    'تحميل مدير الملفات...',
    'تشغيل الوكلاء الذكية...',
    'البيئة جاهزة!',
  ];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProg(p => {
        const next = Math.min(p + 18, 100);
        const idx = Math.floor((next / 100) * (msgs.length - 1));
        setMsgIdx(idx);
        return next;
      });
    }, 320);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 420,
        background: T.bgPanel,
        border: `1px solid ${T.goldBorder}`,
        borderRadius: 24,
        backdropFilter: 'blur(40px)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(212,175,55,0.08)',
        padding: '48px 40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        textAlign: 'center',
      }}
    >
      {/* Animated monitor */}
      <div style={{ position: 'relative' }}>
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 72, height: 72, borderRadius: 22,
            background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(59,91,254,0.2))',
            border: `1.5px solid ${T.goldBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Monitor size={32} style={{ color: T.gold }} />
        </motion.div>
        <div style={{
          position: 'absolute', inset: -8,
          borderRadius: 30, border: `1px solid ${T.goldBorder}`,
          opacity: 0.4, animation: 'pulse 2s ease-in-out infinite',
        }} />
      </div>

      <div>
        <div style={{ fontSize: 20, fontWeight: 900, color: T.text, marginBottom: 8, fontFamily: fontCairo }}>
          {msgs[msgIdx]}
        </div>
        <div style={{ fontSize: 13, color: T.textDim, fontFamily: fontCairo }}>
          جاري تجهيز بيئتك السحابية الخاصة
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%' }}>
        <div style={{
          width: '100%', height: 6, borderRadius: 99,
          background: 'rgba(255,255,255,0.05)', overflow: 'hidden',
        }}>
          <motion.div
            animate={{ width: `${prog}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              height: '100%', borderRadius: 99,
              background: 'linear-gradient(90deg, #3B5BFE, #D4AF37)',
            }}
          />
        </div>
        <div style={{ textAlign: 'left', marginTop: 6, fontSize: 11, color: T.textMut, fontFamily: fontMono }}>
          {prog}%
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.04)} }`}</style>
    </motion.div>
  );
}
