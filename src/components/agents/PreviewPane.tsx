/**
 * PreviewPane.tsx — لوحة المعاينة
 * ══════════════════════════════════════════════════════════
 * دائماً مرئية — تعرض المحتوى المناسب حسب الوضع:
 *
 *  welcome   → شاشة ترحيب + جاهزية النظام (لما مفيش agent مختار)
 *  guided    → زر واحد كبير لربط أداة (للمقاولين بدون خلفية تقنية)
 *  setup     → قائمة الأدوات المطلوبة للوكيل
 *  execution → خطوات التنفيذ
 *  result    → النتيجة
 *  browser   → متصفح
 */
import { useState } from 'react';
import { useNavigate } from 'react-router@7.1.1';
import {
  CheckCircle, Loader2, Globe, Cpu, FileText,
  Settings, Zap, Link, ShieldAlert, Phone, MessageCircle, MapPin, Star, Users,
} from 'lucide-react';
import { usePreview } from '../../contexts/PreviewContext';
import { useIntegrations } from '../../contexts/IntegrationContext';
import { useAgentActivation, AGENT_TEMPLATES } from '../../contexts/AgentActivationContext';
import type { IntegrationKey, PreviewMode, ProviderResult } from '../../types/agent-runtime';

const C = {
  bg:      '#060E1A',
  surface: '#0F1A2E',
  card:    '#1A2540',
  border:  'rgba(255,255,255,0.08)',
  text:    '#F1F5F9',
  textDim: '#64748B',
  gold:    '#D4AF37',
  green:   '#22C55E',
  red:     '#EF4444',
};

// ── وصف بسيط لكل أداة (للمقاولين) ──────────────────────────────
const TOOL_GUIDE: Record<string, { desc: string; btnLabel: string; color: string }> = {
  google:        { desc: 'اربط حسابك على Google ليظهر متجرك في نتائج البحث ويصلك عملاء جدد', btnLabel: 'ربط مع Google', color: '#4285F4' },
  searchConsole: { desc: 'راقب ترتيب موقعك في Google واعرف ماذا يبحث عنه عملاؤك', btnLabel: 'ربط Search Console', color: '#4285F4' },
  analytics:     { desc: 'اعرف كم شخص زار موقعك اليوم ومن أين جاؤوا', btnLabel: 'ربط Analytics', color: '#E37400' },
  maps:          { desc: 'اجعل متجرك يظهر على خريطة Google عندما يبحث العملاء في منطقتك', btnLabel: 'ربط خرائط Google', color: '#34A853' },
  domain:        { desc: 'أخبرني برابط موقعك الإلكتروني وسأبدأ في تحسينه', btnLabel: 'أضف رابط موقعك', color: '#8B5CF6' },
  whatsapp:      { desc: 'دع الوكيل يرد على رسائل عملائك على واتساب ويحجز المواعيد نيابةً عنك', btnLabel: 'ربط واتساب', color: '#25D366' },
  social:        { desc: 'اربط حساباتك على السوشيال ميديا وسأنشر المحتوى تلقائياً', btnLabel: 'ربط السوشيال ميديا', color: '#E91E63' },
  browser:       { desc: 'سأتصفح الإنترنت بدلاً عنك وأجمع المعلومات التي تحتاجها', btnLabel: 'تفعيل المتصفح', color: '#9B51E0' },
  cloud:         { desc: 'حاسوب سحابي يعمل 24 ساعة ينفذ مهامك حتى وأنت نائم', btnLabel: 'تفعيل الحاسوب السحابي', color: '#06B6D4' },
};

// ── Welcome Mode — شاشة البداية ──────────────────────────────────
function WelcomeMode() {
  const { integrations, readinessScore } = useIntegrations();
  const navigate = useNavigate();
  const score = readinessScore();
  const connected = integrations.filter(i => i.status === 'connected').length;
  const notConnected = integrations.filter(i => i.status !== 'connected').slice(0, 3);

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero */}
      <div style={{
        textAlign: 'center', padding: '24px 16px',
        background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03))',
        borderRadius: 16, border: '1px solid rgba(212,175,55,0.15)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>✨</div>
        <div style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 900, fontSize: 18, color: C.text, marginBottom: 6 }}>
          أهلاً! أنا وياك
        </div>
        <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 13, color: C.textDim, lineHeight: 1.7 }}>
          اختر وكيلاً من القائمة على اليمين<br />وسأساعدك خطوة بخطوة
        </div>
      </div>

      {/* Readiness */}
      <div style={{
        padding: '14px 16px', borderRadius: 12,
        background: C.card, border: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, direction: 'rtl' }}>
          <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 13, fontWeight: 700, color: C.text }}>
            جاهزية نظامك
          </span>
          <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 18, fontWeight: 900, color: score > 50 ? C.gold : C.red }}>
            {score}%
          </span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, marginBottom: 12 }}>
          <div style={{
            height: '100%', width: `${score}%`, borderRadius: 99,
            background: `linear-gradient(90deg, ${C.gold}, ${score > 70 ? C.green : C.gold})`,
            transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 12, color: C.textDim, direction: 'rtl' }}>
          {connected} من {integrations.length} أداة متصلة
        </div>
      </div>

      {/* Quick connect suggestions */}
      {notConnected.length > 0 && (
        <div>
          <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 11, color: C.textDim, textAlign: 'right', marginBottom: 8 }}>
            ابدأ بربط هذه الأدوات:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notConnected.map(tool => {
              const g = TOOL_GUIDE[tool.key];
              return (
                <button
                  key={tool.key}
                  onClick={() => navigate(`/agents?connect=${tool.key}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 12, border: 'none',
                    background: 'rgba(212,175,55,0.06)',
                    cursor: 'pointer', direction: 'rtl', textAlign: 'right',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.12)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.06)')}
                >
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{tool.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 2 }}>
                      {tool.nameAr}
                    </div>
                    <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 11, color: C.textDim }}>
                      اضغط لربطه عبر الوكيل
                    </div>
                  </div>
                  <Zap size={14} color={C.gold} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Guided Mode — زر واحد كبير فقط ──────────────────────────────
function GuidedMode({ toolKey }: { toolKey: string }) {
  const navigate = useNavigate();
  const { integrations, connectTool, connectWithData } = useIntegrations();
  const { updatePreview } = usePreview();

  const tool  = integrations.find(i => i.key === toolKey);
  const guide = TOOL_GUIDE[toolKey];

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(tool?.status === 'connected');

  if (!tool || !guide) return null;

  // Domain: one simple input
  const [domainVal, setDomainVal] = useState('');
  const [showDomainInput, setShowDomainInput] = useState(false);

  // ── OAuth scopes per tool ────────────────────────────────────────
  const GOOGLE_SCOPES: Partial<Record<string, string>> = {
    google:        'email profile',
    searchConsole: 'email profile https://www.googleapis.com/auth/webmasters.readonly',
    analytics:     'email profile https://www.googleapis.com/auth/analytics.readonly',
    maps:          'email profile https://www.googleapis.com/auth/business.manage',
  };

  function openGoogleOAuth(key: string) {
    const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string | undefined;
    if (!clientId) {
      alert('يرجى إضافة VITE_GOOGLE_OAUTH_CLIENT_ID في ملف .env لتفعيل ربط Google');
      return;
    }
    const redirectUri = `${window.location.origin}/oauth/callback`;
    const scope = encodeURIComponent(GOOGLE_SCOPES[key] ?? 'email profile');
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}&state=${key}&prompt=select_account`;
    const popup = window.open(url, 'wayak_oauth', 'width=500,height=600,top=100,left=200');

    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== 'weyaak_oauth_callback') return;
      window.removeEventListener('message', onMessage);
      if (e.data.success && e.data.token) {
        // Get email from Google userinfo
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${e.data.token}` },
        }).then(r => r.json()).then(info => {
          // For Analytics, also ask for GA4 property ID
          let propertyId = '';
          if (key === 'analytics') {
            propertyId = window.prompt(
              'أدخل رقم Property ID الخاص بـ Google Analytics 4\n(مثال: 123456789 — تجده في إعدادات GA4 → Property Details)',
              ''
            ) ?? '';
          }
          // For Search Console, ask for the verified site URL
          let siteUrl = '';
          if (key === 'searchConsole') {
            siteUrl = window.prompt(
              'أدخل رابط الموقع المضاف في Search Console\n(مثال: https://app.bietalreef.ae/)',
              'https://app.bietalreef.ae/'
            ) ?? 'https://app.bietalreef.ae/';
          }
          connectWithData(key as IntegrationKey, {
            connectedEmail: info.email,
            metadata: {
              token: e.data.token,
              email: info.email,
              ...(propertyId ? { propertyId } : {}),
              ...(siteUrl ? { siteUrl } : {}),
            },
          });
          setDone(true);
          setLoading(false);
        }).catch(() => {
          // Don't fake-connect on OAuth failure
          setLoading(false);
        });
      } else {
        setLoading(false);
        if (popup && !popup.closed) popup.close();
      }
    }
    window.addEventListener('message', onMessage);
    setLoading(true);
  }

  function handleAction() {
    // Domain → show one simple input
    if (toolKey === 'domain') {
      setShowDomainInput(true);
      return;
    }

    // All other tools → navigate to real connectors page
    navigate('/connectors');
  }

  function handleDomainSubmit() {
    const val = domainVal.trim().replace(/^https?:\/\//, '');
    if (!val) return;
    connectWithData(toolKey as IntegrationKey, { metadata: { url: val } });
    setDone(true);
  }

  if (done || tool.status === 'connected') {
    return (
      <div style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(34,197,94,0.12)', border: '2px solid #22C55E',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckCircle size={40} color={C.green} />
        </div>
        <div style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 900, fontSize: 20, color: C.text }}>
          تم الربط بنجاح! 🎉
        </div>
        <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 13, color: C.textDim, lineHeight: 1.7 }}>
          {tool.nameAr} جاهزة الآن.<br />يمكن للوكيل استخدامها نيابةً عنك.
        </div>
        <button
          onClick={() => updatePreview({ toolKey: null, mode: 'setup', title: 'إعداد الوكيل' })}
          style={{
            marginTop: 8, padding: '10px 24px', borderRadius: 10, border: 'none',
            background: `linear-gradient(135deg, ${C.gold}, ${C.gold}bb)`,
            color: '#000', fontFamily: "'Cairo', sans-serif", fontSize: 14, fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          متابعة →
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {/* Icon */}
      <div style={{
        width: 90, height: 90, borderRadius: 24, fontSize: 50,
        background: `${guide.color}15`, border: `2px solid ${guide.color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {tool.icon}
      </div>

      {/* Name */}
      <div style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 900, fontSize: 22, color: C.text, textAlign: 'center' }}>
        {tool.nameAr}
      </div>

      {/* Simple description */}
      <div style={{
        fontFamily: "'Cairo', sans-serif", fontSize: 14, color: C.textDim,
        textAlign: 'center', lineHeight: 1.9, direction: 'rtl',
        padding: '0 8px',
      }}>
        {guide.desc}
      </div>

      {/* Domain input (shown only for domain tool) */}
      {showDomainInput && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            autoFocus
            value={domainVal}
            onChange={e => setDomainVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleDomainSubmit()}
            placeholder='مثال: mybusiness.ae'
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 12,
              border: `1px solid ${C.gold}50`, background: C.surface,
              color: C.text, fontFamily: "'Cairo', sans-serif", fontSize: 15,
              outline: 'none', textAlign: 'center', direction: 'ltr',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleDomainSubmit}
            disabled={!domainVal.trim()}
            style={{
              width: '100%', padding: '16px', borderRadius: 14, border: 'none',
              background: domainVal.trim()
                ? `linear-gradient(135deg, ${C.gold}, ${C.gold}bb)`
                : 'rgba(255,255,255,0.05)',
              color: domainVal.trim() ? '#000' : C.textDim,
              fontFamily: "'Cairo', sans-serif", fontSize: 17, fontWeight: 900,
              cursor: domainVal.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            تأكيد →
          </button>
        </div>
      )}

      {/* BIG action button */}
      {!showDomainInput && (
        <button
          onClick={handleAction}
          disabled={loading}
          style={{
            width: '100%', padding: '20px 16px', borderRadius: 16, border: 'none',
            background: loading
              ? 'rgba(255,255,255,0.05)'
              : `linear-gradient(135deg, ${guide.color}, ${guide.color}cc)`,
            color: loading ? C.textDim : '#fff',
            fontFamily: "'Cairo', sans-serif", fontSize: 18, fontWeight: 900,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: loading ? 'none' : `0 8px 30px ${guide.color}40`,
            transition: 'all 0.2s',
          }}
        >
          {loading
            ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> جارٍ الاتصال...</>
            : <>{guide.btnLabel} ←</>}
        </button>
      )}

      {/* Skip */}
      <button
        onClick={() => updatePreview({ toolKey: null, mode: 'setup', title: 'إعداد الوكيل' })}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: C.textDim, fontFamily: "'Cairo', sans-serif", fontSize: 12, marginTop: -8,
        }}
      >
        تخطي الآن
      </button>
    </div>
  );
}

// ── Setup Mode — قائمة الأدوات المطلوبة ──────────────────────────
function SetupMode({ agentId }: { agentId: string | null }) {
  const navigate = useNavigate();
  const { integrations, agentReadiness, readinessScore } = useIntegrations();
  const { agents } = useAgentActivation();
  const { openPreview } = usePreview();

  const agent = agentId ? agents.find(a => a.id === agentId) : null;
  const tpl   = agent ? AGENT_TEMPLATES.find(t => t.key === agent.agentType) : null;
  const ar    = tpl ? agentReadiness(agent!.agentType) : null;
  const score = readinessScore();
  const agentKeys = new Set(ar?.required.map(i => i.key) ?? []);
  const otherTools = integrations.filter(i => !agentKeys.has(i.key) && i.status !== 'connected').slice(0, 3);

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Agent readiness card */}
      {ar && tpl && (
        <div style={{
          padding: '12px 14px', borderRadius: 12,
          background: ar.isReady ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.06)',
          border: `1px solid ${ar.isReady ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
          direction: 'rtl',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: ar.isReady ? 0 : 8 }}>
            <span style={{ fontSize: 22 }}>{tpl.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: 13, color: C.text }}>
                {tpl.nameAr}
              </div>
              <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 11, color: ar.isReady ? C.green : C.red }}>
                {ar.isReady ? '✓ جاهز للتنفيذ' : `يحتاج ${ar.missing.length} أداة`}
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: ar.isReady ? C.green : C.red, fontFamily: "'Cairo', sans-serif" }}>
              {ar.score}%
            </div>
          </div>

          {/* Required tools */}
          {!ar.isReady && ar.required.map(tool => (
            <button
              key={tool.key}
              onClick={() => openPreview({ mode: 'setup', title: `ربط ${tool.nameAr}`, toolKey: tool.key, agentId: agentId ?? null })}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, border: 'none',
                background: tool.status === 'connected' ? 'rgba(34,197,94,0.08)' : 'rgba(212,175,55,0.08)',
                cursor: tool.status === 'connected' ? 'default' : 'pointer',
                direction: 'rtl', marginTop: 6, transition: 'background 0.15s',
              }}
            >
              <span style={{ fontSize: 18 }}>{tool.icon}</span>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 12, fontWeight: 700, color: C.text }}>
                  {tool.nameAr}
                </div>
              </div>
              {tool.status === 'connected'
                ? <CheckCircle size={14} color={C.green} />
                : <span style={{ fontSize: 11, color: C.gold, fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>اضغط للربط →</span>}
            </button>
          ))}
        </div>
      )}

      {/* System readiness bar */}
      <div style={{ padding: '12px 14px', borderRadius: 12, background: C.card, border: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, direction: 'rtl' }}>
          <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 12, color: C.text, fontWeight: 700 }}>جاهزية النظام</span>
          <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 14, fontWeight: 900, color: C.gold }}>{score}%</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
          <div style={{ height: '100%', width: `${score}%`, borderRadius: 99, background: `linear-gradient(90deg, ${C.gold}, ${C.green})`, transition: 'width 0.4s' }} />
        </div>
      </div>

      {/* Quick-connect suggestions */}
      {otherTools.length > 0 && !ar && (
        <div>
          <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 11, color: C.textDim, direction: 'rtl', marginBottom: 8 }}>
            أدوات تستحق الربط:
          </p>
          {otherTools.map(tool => (
            <button
              key={tool.key}
              onClick={() => openPreview({ mode: 'setup', title: `ربط ${tool.nameAr}`, toolKey: tool.key, agentId: null })}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, border: 'none',
                background: 'rgba(255,255,255,0.03)', cursor: 'pointer',
                direction: 'rtl', marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 18 }}>{tool.icon}</span>
              <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 12, color: C.text, flex: 1, textAlign: 'right' }}>
                {tool.nameAr}
              </span>
              <span style={{ fontSize: 11, color: C.gold, fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>ربط →</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Execution Mode ────────────────────────────────────────────────
function ExecutionMode({ status, agentId }: { status: string; agentId: string | null }) {
  const { agents } = useAgentActivation();
  const { agentReadiness } = useIntegrations();
  const agent = agentId ? agents.find(a => a.id === agentId) : null;
  const ar    = agent ? agentReadiness(agent.agentType) : null;
  const isBlocked = ar && !ar.isReady;
  const steps = [
    { label: 'إنشاء المهمة',       done: true },
    { label: 'التحقق من الأدوات',  done: !isBlocked },
    { label: 'تشغيل الوكيل',      done: status === 'running' || status === 'completed' },
    { label: 'الانتهاء',           done: status === 'completed' },
  ];
  return (
    <div style={{ padding: 20 }}>
      {isBlocked && (
        <div style={{
          marginBottom: 14, padding: '10px 14px', borderRadius: 10,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          display: 'flex', gap: 8, direction: 'rtl',
        }}>
          <ShieldAlert size={16} color={C.red} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 12, color: C.red, fontWeight: 700 }}>
              الوكيل يحتاج ربط أدوات أولاً
            </div>
            <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 11, color: C.textDim }}>
              {ar.missing.map(t => t.nameAr).join(' · ')}
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, direction: 'rtl' }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: step.done ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${step.done ? C.green : 'rgba(255,255,255,0.1)'}`,
            }}>
              {step.done
                ? <CheckCircle size={15} color={C.green} />
                : <span style={{ fontSize: 11, color: C.textDim, fontWeight: 700 }}>{i + 1}</span>}
            </div>
            <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 13, color: step.done ? C.text : C.textDim }}>
              {step.label}
            </span>
            {i === 2 && status === 'running' && (
              <Loader2 size={14} color='#8B5CF6' style={{ animation: 'spin 1s linear infinite' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Result Mode ───────────────────────────────────────────────────
function ResultMode() {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <CheckCircle size={52} color={C.green} style={{ marginBottom: 14 }} />
      <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 16, color: C.text, fontWeight: 700, marginBottom: 8 }}>
        اكتملت المهمة بنجاح 🎉
      </p>
      <div style={{
        marginTop: 14, padding: 14, borderRadius: 10,
        background: C.card, border: `1px solid ${C.border}`,
        textAlign: 'right', direction: 'rtl',
      }}>
        <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 12, color: C.textDim }}>
          ستظهر هنا نتائج المهمة عند اكتمالها.
        </p>
      </div>
    </div>
  );
}

// ── Browser Mode ──────────────────────────────────────────────────
function BrowserMode({ url }: { url: string | null }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
        <Link size={12} color={C.textDim} />
        <div style={{
          flex: 1, padding: '4px 10px', borderRadius: 6,
          background: C.card, border: `1px solid ${C.border}`,
          fontSize: 11, color: url ? C.text : C.textDim,
          fontFamily: 'monospace', direction: 'ltr',
        }}>
          {url ?? 'في انتظار تفعيل المهمة...'}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Globe size={40} color='rgba(59,91,254,0.25)' />
      </div>
    </div>
  );
}

// ── Provider Result Card ──────────────────────────────────────────
function ProviderResultCard({ provider }: { provider: ProviderResult }) {
  const rating  = provider.rating ?? 4.0;
  const reviews = provider.reviewCount ?? 0;
  const stars   = Math.round(rating);
  const phone   = provider.phone ?? '';
  const wa      = provider.whatsapp ?? provider.phone ?? '';
  const location = [provider.district, provider.city].filter(Boolean).join(' - ');

  function openCall() { if (phone) window.location.href = `tel:${phone}`; }
  function openWA()   { if (wa)    window.open(`https://wa.me/${wa.replace(/\D/g,'')}`, '_blank'); }
  function openMap()  {
    const q = encodeURIComponent(`${provider.name} ${location}`);
    window.open(`https://maps.google.com/?q=${q}`, '_blank');
  }

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
      padding: '14px 16px', marginBottom: 10, direction: 'rtl',
      transition: 'border-color 0.15s',
    }}>
      {/* Name + verified */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>🔧</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              fontFamily: "'Cairo',sans-serif", fontWeight: 800, fontSize: 13.5, color: C.text,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{provider.name}</span>
            {provider.isVerified && (
              <CheckCircle size={13} color='#22C55E' style={{ flexShrink: 0 }} />
            )}
          </div>
          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <div style={{ display: 'flex', gap: 1 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i} size={10}
                  fill={i < stars ? '#D4AF37' : 'none'}
                  color={i < stars ? '#D4AF37' : C.dim}
                />
              ))}
            </div>
            <span style={{ fontFamily: "'Cairo',sans-serif", fontSize: 10.5, color: C.gold, fontWeight: 700 }}>
              {rating.toFixed(1)}
            </span>
            {reviews > 0 && (
              <span style={{ fontFamily: "'Cairo',sans-serif", fontSize: 9.5, color: C.textDim }}>
                • {reviews} تقييم
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Location */}
      {location && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7,
          padding: '4px 8px', borderRadius: 6,
          background: 'rgba(255,255,255,0.03)',
        }}>
          <MapPin size={10} color={C.textDim} />
          <span style={{ fontFamily: "'Cairo',sans-serif", fontSize: 11, color: C.textDim }}>
            {location}
          </span>
        </div>
      )}

      {/* Services tags */}
      {provider.services && provider.services.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
          {provider.services.slice(0, 4).map((s, i) => (
            <span key={i} style={{
              padding: '2px 9px', borderRadius: 99, fontSize: 10,
              background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)',
              color: C.gold, fontFamily: "'Cairo',sans-serif", fontWeight: 600,
            }}>{s}</span>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={openCall}
          disabled={!phone}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: '8px 4px', borderRadius: 9, border: 'none',
            background: phone ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
            color: phone ? C.green : C.textDim,
            fontFamily: "'Cairo',sans-serif", fontSize: 10.5, fontWeight: 700,
            cursor: phone ? 'pointer' : 'default', transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (phone) e.currentTarget.style.background = 'rgba(34,197,94,0.22)'; }}
          onMouseLeave={e => { if (phone) e.currentTarget.style.background = 'rgba(34,197,94,0.12)'; }}
        >
          <Phone size={11} />اتصل الآن
        </button>
        <button
          onClick={openWA}
          disabled={!wa}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: '8px 4px', borderRadius: 9, border: 'none',
            background: wa ? 'rgba(37,211,102,0.1)' : 'rgba(255,255,255,0.04)',
            color: wa ? '#25D366' : C.textDim,
            fontFamily: "'Cairo',sans-serif", fontSize: 10.5, fontWeight: 700,
            cursor: wa ? 'pointer' : 'default', transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (wa) e.currentTarget.style.background = 'rgba(37,211,102,0.2)'; }}
          onMouseLeave={e => { if (wa) e.currentTarget.style.background = 'rgba(37,211,102,0.1)'; }}
        >
          <MessageCircle size={11} />واتساب
        </button>
        <button
          onClick={openMap}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: '8px 4px', borderRadius: 9, border: `1px solid ${C.border}`,
            background: 'transparent', color: C.textDim,
            fontFamily: "'Cairo',sans-serif", fontSize: 10.5, fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.color = '#3B82F6'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}
        >
          <MapPin size={11} />الخريطة
        </button>
      </div>
    </div>
  );
}

// ── Providers Mode — نتائج البحث عن مزودي الخدمة ─────────────────
function ProvidersMode({ providers, query }: { providers: ProviderResult[]; query?: string }) {
  return (
    <div style={{ padding: '14px 14px 20px' }}>
      {/* Search summary */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
        padding: '8px 12px', borderRadius: 10,
        background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)',
        direction: 'rtl',
      }}>
        <Users size={13} color={C.gold} />
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: "'Cairo',sans-serif", fontSize: 12, fontWeight: 700, color: C.text }}>
            {providers.length} مزود خدمة
          </span>
          {query && (
            <span style={{ fontFamily: "'Cairo',sans-serif", fontSize: 10.5, color: C.textDim, marginRight: 6 }}>
              لـ "{query.slice(0, 30)}"
            </span>
          )}
        </div>
      </div>

      {providers.map(p => (
        <ProviderResultCard key={p.id} provider={p} />
      ))}

      {providers.length === 0 && (
        <div style={{ textAlign: 'center', padding: 24, color: C.textDim, fontFamily: "'Cairo',sans-serif", fontSize: 13 }}>
          لا توجد نتائج
        </div>
      )}
    </div>
  );
}

// ── Mode tabs ────────────────────────────────────────────────────
const MODE_META: Record<PreviewMode, { labelAr: string; Icon: React.ElementType; color: string }> = {
  setup:     { labelAr: 'الإعداد',   Icon: Settings,     color: '#D4AF37' },
  browser:   { labelAr: 'المتصفح',  Icon: Globe,        color: '#3B82F6' },
  execution: { labelAr: 'التنفيذ',  Icon: Cpu,          color: '#8B5CF6' },
  result:    { labelAr: 'النتائج',  Icon: FileText,     color: '#22C55E' },
  providers: { labelAr: 'مزودو الخدمة', Icon: Users,   color: '#D4AF37' },
};

// ── Main PreviewPane ──────────────────────────────────────────────
export function PreviewPane() {
  const { preview, closePreview, setPreviewMode } = usePreview();

  if (!preview.isOpen) return null;

  const isGuided  = !!preview.toolKey;
  const isWelcome = !preview.agentId && !preview.toolKey;
  const meta      = MODE_META[preview.mode];
  const ModeIcon  = meta.Icon;

  return (
    <div style={{
      width: 340, flexShrink: 0,
      background: C.bg, borderLeft: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px', borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: `${meta.color}18`, border: `1px solid ${meta.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ModeIcon size={14} color={meta.color} />
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: C.text, fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
            {preview.title || (isWelcome ? 'مرحباً بك في وياك' : meta.labelAr)}
          </div>
        </div>
      </div>

      {/* Mode tabs — hidden in guided/welcome mode */}
      {!isGuided && !isWelcome && (
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, padding: '6px 10px', gap: 4 }}>
          {(Object.entries(MODE_META) as [PreviewMode, typeof MODE_META[PreviewMode]][]).map(([mode, m]) => {
            const Icon = m.Icon;
            const isActive = preview.mode === mode;
            return (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  padding: '5px 4px', borderRadius: 7, border: 'none',
                  background: isActive ? `${m.color}18` : 'transparent',
                  color: isActive ? m.color : C.textDim,
                  fontFamily: "'Cairo', sans-serif", fontSize: 10, cursor: 'pointer',
                }}
              >
                <Icon size={11} />
                {m.labelAr}
              </button>
            );
          })}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {isWelcome && <WelcomeMode />}
        {isGuided && <GuidedMode toolKey={preview.toolKey!} />}
        {!isGuided && !isWelcome && preview.mode === 'setup'      && <SetupMode agentId={preview.agentId} />}
        {!isGuided && !isWelcome && preview.mode === 'browser'    && <BrowserMode url={preview.previewUrl} />}
        {!isGuided && !isWelcome && preview.mode === 'execution'  && <ExecutionMode status={preview.status} agentId={preview.agentId} />}
        {!isGuided && !isWelcome && preview.mode === 'result'     && <ResultMode />}
        {!isGuided && !isWelcome && preview.mode === 'providers'  && (
          <ProvidersMode
            providers={preview.providerResults ?? []}
            query={preview.searchQuery}
          />
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
