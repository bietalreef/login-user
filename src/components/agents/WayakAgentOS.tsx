/**
 * WayakAgentOS.tsx — وياك نظام الوكلاء
 * ══════════════════════════════════════════════════════
 * UX:
 *  • الدخول: input في المنتصف (مثل Claude.ai)
 *  • بعد الإرسال: input ينتقل للأسفل والمحادثة تبدأ
 *  • زر "وكيل تنفيذ" أو "وكيل دردشة"
 *  • Plan card → تأكيد → Preview تنفيذ
 */
import { useEffect, useRef, useState, useCallback, createContext, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router@7.1.1';
import {
  Plus, Search, ChevronLeft, ChevronRight,
  ArrowUp, Mic, Settings, X, Zap, Menu,
  Home, Cpu, MessageSquare, ThumbsUp, ThumbsDown, Sun, Moon,
} from 'lucide-react';
import { supabase } from '../../utils/supabase/client';
import type { ProviderResult } from '../../types/agent-runtime';
import { useAgentActivation, AGENT_TEMPLATES } from '../../contexts/AgentActivationContext';
import { useWeyaakIdentity } from '../../contexts/WeyaakIdentityContext';
import { usePreview } from '../../contexts/PreviewContext';
import { PreviewPane } from './PreviewPane';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useIntegrations } from '../../contexts/IntegrationContext';
import type { IntegrationKey, AgentMessage } from '../../types/agent-runtime';

// ── Google API helpers ────────────────────────────────────────────
const GSC_INTENT = /سيرش كنسول|search.?console|كلمات البحث|استفسارات|queries|ترتيب الموقع|نتائج البحث|clicks|impressions|ظهور الموقع|أداء البحث|seo تقرير|تقرير seo/i;
const GA_INTENT  = /analytics|تحليل|زوار|الزوار|visitors|sessions|جلسات|traffic|من أين|مصادر الزوار|pageview|صفحات مشاهدة|google analytics/i;

async function fetchGSCData(token: string, siteUrl: string): Promise<string> {
  try {
    const endDate   = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 28 * 864e5).toISOString().split('T')[0];
    const res = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate, dimensions: ['query'], rowLimit: 10, startRow: 0 }),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return `GSC error ${res.status}: ${JSON.stringify(err)}`;
    }
    const data = await res.json();
    const rows: Array<{ keys: string[]; clicks: number; impressions: number; position: number }> = data.rows ?? [];
    if (rows.length === 0) return 'لا توجد بيانات GSC متاحة للفترة المحددة.';
    const summary = rows.slice(0, 10).map((r, i) =>
      `${i + 1}. "${r.keys[0]}" — ${r.clicks} نقرة | ${r.impressions} ظهور | ترتيب ${r.position.toFixed(1)}`
    ).join('\n');
    const totals = rows.reduce((acc, r) => ({ c: acc.c + r.clicks, i: acc.i + r.impressions }), { c: 0, i: 0 });
    return `📊 بيانات Search Console (آخر 28 يوم — ${startDate} إلى ${endDate}):\n\nإجمالي: ${totals.c} نقرة | ${totals.i} ظهور\n\nأبرز الكلمات المفتاحية:\n${summary}`;
  } catch (e) {
    return `GSC fetch error: ${String(e)}`;
  }
}

async function fetchAnalyticsData(token: string, propertyId: string): Promise<string> {
  try {
    const endDate   = 'today';
    const startDate = '28daysAgo';
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateRanges:  [{ startDate, endDate }],
          metrics:     [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'screenPageViews' }, { name: 'bounceRate' }],
          dimensions:  [{ name: 'sessionDefaultChannelGroup' }],
          limit: 10,
        }),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return `Analytics error ${res.status}: ${JSON.stringify(err)}`;
    }
    const data = await res.json();
    const rows = data.rows ?? [];
    if (rows.length === 0) return 'لا توجد بيانات Analytics متاحة.';
    const totals = rows.reduce((acc: { s: number; u: number; p: number }, r: { metricValues: Array<{ value: string }> }) => ({
      s: acc.s + Number(r.metricValues[0].value),
      u: acc.u + Number(r.metricValues[1].value),
      p: acc.p + Number(r.metricValues[2].value),
    }), { s: 0, u: 0, p: 0 });
    const channels = rows.slice(0, 8).map((r: { dimensionValues: Array<{ value: string }>; metricValues: Array<{ value: string }> }) =>
      `• ${r.dimensionValues[0].value}: ${r.metricValues[0].value} جلسة | ${r.metricValues[1].value} مستخدم`
    ).join('\n');
    return `📈 بيانات Google Analytics (آخر 28 يوم):\n\nإجمالي الجلسات: ${totals.s.toLocaleString('ar')} | المستخدمون النشطون: ${totals.u.toLocaleString('ar')} | مشاهدات الصفحة: ${totals.p.toLocaleString('ar')}\n\nمصادر الزيارات:\n${channels}`;
  } catch (e) {
    return `Analytics fetch error: ${String(e)}`;
  }
}

// ── Color themes ─────────────────────────────────────────────────
type Colors = {
  bg: string; sidebar: string; surface: string;
  card: string; cardHov: string;
  border: string; borderA: string;
  text: string; dim: string; mid: string;
  gold: string; goldBg: string; green: string;
  hoverBg: string; planStepBg: string; planStepBorder: string;
  headerBg: string; disabledBtn: string; inputBorder: string;
  tokenBadge: string;
};

const DARK: Colors = {
  bg:           '#09101E',
  sidebar:      '#0C1220',
  surface:      '#111827',
  card:         '#162032',
  cardHov:      '#1C2940',
  border:       'rgba(255,255,255,0.07)',
  borderA:      'rgba(255,255,255,0.13)',
  text:         '#F0F4FA',
  dim:          '#64748B',
  mid:          '#94A3B8',
  gold:         '#D4AF37',
  goldBg:       'rgba(212,175,55,0.1)',
  green:        '#22C55E',
  hoverBg:      'rgba(255,255,255,0.04)',
  planStepBg:   'rgba(255,255,255,0.025)',
  planStepBorder: 'rgba(255,255,255,0.05)',
  headerBg:     'rgba(9,16,30,0.85)',
  disabledBtn:  'rgba(255,255,255,0.06)',
  inputBorder:  'rgba(255,255,255,0.12)',
  tokenBadge:   'rgba(255,255,255,0.04)',
};

const LIGHT: Colors = {
  bg:           '#F0F4FA',
  sidebar:      '#E8EEF7',
  surface:      '#FFFFFF',
  card:         '#FFFFFF',
  cardHov:      '#EEF2FA',
  border:       'rgba(0,0,0,0.08)',
  borderA:      'rgba(0,0,0,0.14)',
  text:         '#0F172A',
  dim:          '#94A3B8',
  mid:          '#475569',
  gold:         '#B8941F',
  goldBg:       'rgba(184,148,31,0.1)',
  green:        '#16A34A',
  hoverBg:      'rgba(0,0,0,0.04)',
  planStepBg:   'rgba(0,0,0,0.025)',
  planStepBorder: 'rgba(0,0,0,0.07)',
  headerBg:     'rgba(240,244,250,0.9)',
  disabledBtn:  'rgba(0,0,0,0.07)',
  inputBorder:  'rgba(0,0,0,0.13)',
  tokenBadge:   'rgba(0,0,0,0.05)',
};

const ThemeCtx = createContext<Colors>(DARK);
const useC = () => useContext(ThemeCtx);

// ── Agent guided messages ────────────────────────────────────────
const CONNECT_MSGS: Partial<Record<IntegrationKey, string>> = {
  google:        'أهلاً! سأساعدك في ربط حساب Google الخاص بك 🔵\n\nهذا يجعل متجرك يظهر في نتائج البحث ويصل إليك عملاء جدد كل يوم.\n\nاضغط الزر الكبير في اليمين — ما يأخذ غير دقيقتين! 👈',
  searchConsole: 'أهلاً! سنربط Search Console الآن 📊\n\nبعد الربط سأعلمك الكلمات التي يبحث بها العملاء للوصول إليك.\n\nاضغط الزر في اليمين للبدء 👈',
  analytics:     'أهلاً! سنربط Google Analytics 📈\n\nستعرف كم شخص زار موقعك اليوم ومن أين جاؤوا.\n\nاضغط الزر في اليمين 👈',
  maps:          'أهلاً! سنضع متجرك على خريطة Google 📍\n\nكل من يبحث عن خدماتك في منطقتك سيجدك مباشرة.\n\nاضغط الزر في اليمين 👈',
  domain:        'أهلاً! أحتاج رابط موقعك الإلكتروني 🌐\n\nأدخل اسم موقعك في الخانة في اليمين — مثال: mybusiness.ae\n\nبعدها سأبدأ في تحليل الموقع وتحسينه 👈',
  whatsapp:      'أهلاً! سنربط واتساب بزنس الخاص بك 💬\n\nبعد الربط سأرد على رسائل عملائك وأحجز المواعيد نيابةً عنك — 24 ساعة.\n\nاضغط الزر في اليمين للبدء 👈',
  social:        'أهلاً! سنربط حساباتك على السوشيال ميديا 📱\n\nبعد الربط سأنشر المحتوى وأرد على التعليقات تلقائياً.\n\nاضغط الزر في اليمين 👈',
  browser:       'أهلاً! سأفعّل المتصفح السحابي لك 🌍\n\nسيتصفح الإنترنت نيابةً عنك.\n\nاضغط "تفعيل" في اليمين وسيكون جاهزاً فوراً 👈',
  cloud:         'أهلاً! سأفعّل الحاسوب السحابي الخاص بك ☁️\n\nيعمل 24 ساعة حتى وأنت نائم.\n\nاضغط "تفعيل" في اليمين 👈',
};
const SOCIAL_PLATFORM_MSGS: Record<string, string> = {
  instagram: 'أهلاً! سنربط حساب الإنستغرام 📸\n\nبعد الربط سأنشر الصور والريلز تلقائياً.\n\nاضغط الزر في اليمين للبدء 👈',
  facebook:  'أهلاً! سنربط صفحة الفيسبوك 👥\n\nسأنشر إعلاناتك وأرد على رسائل العملاء تلقائياً.\n\nاضغط الزر في اليمين 👈',
  tiktok:    'أهلاً! سنربط حساب تيك توك 🎵\n\nتيك توك يعطيك وصول هائل لعملاء جدد.\n\nاضغط الزر في اليمين 👈',
  x:         'أهلاً! سنربط حساب إكس 💬\n\nسأتابع التحديثات وأنشر المحتوى تلقائياً.\n\nاضغط الزر في اليمين 👈',
  youtube:   'أهلاً! سنربط قناة يوتيوب 📹\n\nسأساعدك في النشر وتحسين ظهور الفيديوهات.\n\nاضغط الزر في اليمين 👈',
  linkedin:  'أهلاً! سنربط حساب لينكد إن 💼\n\nسأنشر المحتوى المهني تلقائياً.\n\nاضغط الزر في اليمين 👈',
  snapchat:  'أهلاً! سنربط حساب سناب شات 👻\n\nسأساعدك في الوصول لجمهور الخليج الشبابي.\n\nاضغط الزر في اليمين 👈',
};

// ── Task templates ────────────────────────────────────────────────
const TEMPLATES = [
  { icon: '🔍', text: 'حسّن موقعي في Google', plan: ['ربط Search Console وAnalytics','تحليل الكلمات المفتاحية','رصد المنافسين','كتابة 5 مقالات محسّنة','رفع التقرير'], color: '#3B82F6' },
  { icon: '📱', text: 'إدارة السوشيال تلقائياً', plan: ['ربط حسابات السوشيال','تحليل أفضل أوقات النشر','تصميم 10 منشورات','جدولة النشر الأسبوعي','تتبع التفاعل'], color: '#E91E63' },
  { icon: '💬', text: 'ردود واتساب تلقائية', plan: ['ربط واتساب بزنس API','إعداد رسائل الترحيب','بناء نظام حجز المواعيد','ربط التقويم','تفعيل النظام'], color: '#25D366' },
  { icon: '🎯', text: 'استقطاب عملاء جدد', plan: ['تحديد الجمهور المستهدف','جمع بيانات العملاء المحتملين','إنشاء رسائل تواصل','تتبع معدلات الاستجابة','تحسين الحملة'], color: '#EF4444' },
  { icon: '📊', text: 'تقرير أداء أسبوعي', plan: ['ربط مصادر البيانات','بناء لوحة مقاييس','إعداد تقرير تلقائي','تحديد فرص النمو','إرسال التقرير واتساب'], color: '#D4AF37' },
  { icon: '📍', text: 'تحسين خريطة Google', plan: ['ربط Google Business','تحسين الصور والبيانات','جمع التقييمات','نشر منشورات أسبوعية','مراقبة الترتيب'], color: '#34A853' },
];

// ── Provider Search — Real Supabase Queries ──────────────────────
const SERVICE_MAP: { service: string; nameAr: string; keywords: string[] }[] = [
  { service: 'سباك',      nameAr: 'سباكة',      keywords: ['سباك', 'سباكة', 'تسرب', 'صنبور', 'أنابيب', 'مياه'] },
  { service: 'كهربائي',   nameAr: 'كهرباء',     keywords: ['كهربائي', 'كهرباء', 'كهربجي', 'تمديد كهربائي'] },
  { service: 'نجار',      nameAr: 'نجارة',      keywords: ['نجار', 'نجارة', 'أثاث', 'خشب'] },
  { service: 'نقاش',      nameAr: 'دهانات',     keywords: ['نقاش', 'دهن', 'طلاء', 'صباغ', 'دهانات'] },
  { service: 'تنظيف',     nameAr: 'تنظيف',      keywords: ['تنظيف', 'نظافة', 'تنظيف منازل'] },
  { service: 'تكييف',     nameAr: 'تكييف',      keywords: ['تكييف', 'مكيف', 'تبريد', 'تسخين'] },
  { service: 'صيانة',     nameAr: 'صيانة عامة', keywords: ['صيانة', 'إصلاح', 'تصليح'] },
  { service: 'بلاط',      nameAr: 'بلاط وسيراميك', keywords: ['بلاط', 'سيراميك', 'بلاطة'] },
  { service: 'سباكة',     nameAr: 'سباكة',      keywords: ['حوض', 'مرحاض', 'بالوعة'] },
];

const CITY_KEYWORDS: Record<string, string> = {
  'العين': 'العين', 'عين': 'العين',
  'أبوظبي': 'أبوظبي', 'ابوظبي': 'أبوظبي', 'أبو ظبي': 'أبوظبي',
  'دبي': 'دبي',
  'الشارقة': 'الشارقة', 'شارقة': 'الشارقة',
  'عجمان': 'عجمان',
  'رأس الخيمة': 'رأس الخيمة', 'راس الخيمة': 'رأس الخيمة',
  'الفجيرة': 'الفجيرة', 'فجيرة': 'الفجيرة',
  'أم القيوين': 'أم القيوين',
};

function detectServiceSearch(text: string): { service: string; serviceAr: string; city: string } | null {
  let detectedService: string | null = null;
  let detectedServiceAr = '';
  for (const s of SERVICE_MAP) {
    if (s.keywords.some(kw => text.includes(kw))) {
      detectedService = s.service;
      detectedServiceAr = s.nameAr;
      break;
    }
  }
  if (!detectedService) {
    const searchIntent = text.match(/(?:أبحث عن|ابحث عن|محتاج|أجد|أريد|اريد)\s+(\S+)/);
    if (searchIntent) {
      const keyword = searchIntent[1];
      for (const s of SERVICE_MAP) {
        if (s.keywords.some(kw => kw.includes(keyword) || keyword.includes(kw))) {
          detectedService = s.service;
          detectedServiceAr = s.nameAr;
          break;
        }
      }
    }
  }
  if (!detectedService) return null;

  let detectedCity = '';
  for (const [kw, city] of Object.entries(CITY_KEYWORDS)) {
    if (text.includes(kw)) { detectedCity = city; break; }
  }

  return { service: detectedService, serviceAr: detectedServiceAr, city: detectedCity };
}

async function searchProviders(service: string, city: string): Promise<ProviderResult[]> {
  try {
    let query = supabase
      .from('profiles')
      .select('id, full_name, city, district, phone, services, rating, review_count, verified, whatsapp')
      .eq('role', 'provider');

    if (service) query = query.ilike('services', `%${service}%`);
    if (city)    query = query.ilike('city', `%${city}%`);

    const { data, error } = await query.limit(5);
    if (error || !data || data.length === 0) return [];

    return data.map(row => ({
      id: row.id ?? '',
      name: row.full_name ?? 'مزود خدمة',
      city: row.city ?? city,
      district: row.district ?? '',
      phone: row.phone ?? '',
      whatsapp: row.whatsapp ?? row.phone ?? '',
      rating: typeof row.rating === 'number' ? row.rating : (3.5 + Math.random() * 1.5),
      reviewCount: row.review_count ?? Math.floor(Math.random() * 50 + 5),
      services: row.services
        ? (Array.isArray(row.services) ? row.services : [row.services])
        : [service],
      isVerified: row.verified ?? false,
    }));
  } catch {
    return [];
  }
}

function estimateTokens(text: string): number {
  return Math.max(10, Math.ceil(text.length / 3.5));
}

// ── Sidebar ─────────────────────────────────────────────────────
function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const C = useC();
  const navigate = useNavigate();
  const { agents, sessions, setActiveAgent, activeAgentId, ensureDefaultAgent } = useAgentActivation();
  const { userId } = useWeyaakIdentity();
  const ownerId = userId ?? 'local_user';
  const recent = [...agents]
    .filter(a => a.ownerId === ownerId)
    .sort((a, b) => new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime())
    .slice(0, 15);

  return (
    <div style={{
      width: collapsed ? 48 : 220, flexShrink: 0, height: '100%',
      background: C.sidebar, borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.2s ease', overflow: 'hidden',
    }}>
      {/* Logo row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: '13px 10px', borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7, fontSize: 14,
              background: C.goldBg, border: '1px solid rgba(212,175,55,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✨</div>
            <span style={{ fontFamily: "'Cairo',sans-serif", fontWeight: 800, fontSize: 14, color: C.text }}>وياك</span>
          </div>
        )}
        <button onClick={onToggle} style={{
          width: 24, height: 24, borderRadius: 5, border: `1px solid ${C.border}`,
          background: 'transparent', color: C.dim, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>
      </div>

      {/* New */}
      <div style={{ padding: collapsed ? '8px 5px' : '8px 8px', flexShrink: 0 }}>
        <button
          onClick={() => { ensureDefaultAgent(ownerId); setActiveAgent(null); }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 6,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 8 : '7px 11px',
            borderRadius: 7, border: `1px solid ${C.border}`,
            background: C.goldBg, color: C.gold,
            fontFamily: "'Cairo',sans-serif", fontSize: 12, fontWeight: 700,
            cursor: 'pointer', transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.goldBg; }}
        >
          <Plus size={13} />
          {!collapsed && 'جديد'}
        </button>
      </div>

      {/* Nav */}
      {!collapsed && (
        <div style={{ padding: '0 7px 4px', flexShrink: 0 }}>
          {[
            { icon: <Home size={12} />, label: 'الرئيسية', onClick: () => navigate('/agents') },
            { icon: <Search size={12} />, label: 'بحث' },
            { icon: <Settings size={12} />, label: 'الموصلات', onClick: () => navigate('/connectors') },
          ].map(item => (
            <button key={item.label} onClick={item.onClick} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 7,
              padding: '6px 9px', borderRadius: 6, border: 'none',
              background: 'transparent', color: C.mid,
              fontFamily: "'Cairo',sans-serif", fontSize: 11.5, cursor: 'pointer', marginBottom: 1,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.hoverBg; e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.mid; }}
            >{item.icon}{item.label}</button>
          ))}
        </div>
      )}

      <div style={{ height: 1, background: C.border, margin: collapsed ? '3px 7px' : '3px 10px', flexShrink: 0 }} />

      {/* Recent list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: collapsed ? '5px 4px' : '5px 7px' }}>
        {!collapsed && recent.length > 0 && (
          <div style={{
            fontFamily: "'Cairo',sans-serif", fontSize: 9, color: C.dim,
            fontWeight: 700, padding: '3px 5px 5px', letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}>المحادثات</div>
        )}
        {recent.map(agent => {
          const tpl = AGENT_TEMPLATES.find(t => t.key === agent.agentType);
          const session = sessions.find(s => s.agentInstanceId === agent.id);
          const lastMsg = session?.messages.slice(-1)[0];
          const isActive = agent.id === activeAgentId;
          if (collapsed) return (
            <button key={agent.id} onClick={() => setActiveAgent(agent.id)} title={agent.nameAr}
              style={{
                width: '100%', display: 'flex', justifyContent: 'center',
                padding: 6, borderRadius: 6, border: 'none',
                background: isActive ? `${tpl?.color ?? C.gold}15` : 'transparent',
                cursor: 'pointer', marginBottom: 2,
              }}>
              <span style={{ fontSize: 14 }}>{tpl?.icon ?? '🤖'}</span>
            </button>
          );
          return (
            <button key={agent.id} onClick={() => setActiveAgent(agent.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 7,
                padding: '6px 7px', borderRadius: 6, border: 'none',
                background: isActive ? `${tpl?.color ?? C.gold}10` : 'transparent',
                cursor: 'pointer', marginBottom: 1,
                borderLeft: `2px solid ${isActive ? (tpl?.color ?? C.gold) : 'transparent'}`,
                transition: 'all 0.1s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.hoverBg; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 13, flexShrink: 0 }}>{tpl?.icon ?? '🤖'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Cairo',sans-serif", fontSize: 11,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? C.text : C.mid,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {lastMsg ? lastMsg.content.slice(0, 24) + (lastMsg.content.length > 24 ? '…' : '') : agent.nameAr}
                </div>
              </div>
              {agent.unreadCount > 0 && (
                <div style={{
                  minWidth: 15, height: 15, borderRadius: 99, padding: '0 3px',
                  background: tpl?.color ?? C.gold,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, fontWeight: 800, color: '#000',
                }}>{agent.unreadCount}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Plan confirmation card ───────────────────────────────────────
function PlanCard({ steps, color, onConfirm, onCancel }: {
  steps: string[]; color: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  const C = useC();
  return (
    <div style={{
      background: C.card, border: `1px solid ${color}25`,
      borderRadius: 14, padding: '18px 20px', marginBottom: 16,
      direction: 'rtl', boxShadow: `0 4px 24px ${color}10`,
    }}>
      <div style={{
        fontFamily: "'Cairo',sans-serif", fontWeight: 800, fontSize: 12.5,
        color: C.text, marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 7,
      }}>
        <Zap size={13} color={color} />خطة التنفيذ
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
        {steps.map((step, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 8,
            background: C.planStepBg,
            border: `1px solid ${C.planStepBorder}`,
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              background: `${color}15`, border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Cairo',sans-serif", fontSize: 9.5, fontWeight: 800, color,
            }}>{i + 1}</div>
            <span style={{ fontFamily: "'Cairo',sans-serif", fontSize: 12, color: C.mid }}>{step}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 7 }}>
        <button onClick={onConfirm} style={{
          flex: 1, padding: '10px', borderRadius: 9, border: 'none',
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          color: '#fff', fontFamily: "'Cairo',sans-serif", fontSize: 13.5, fontWeight: 800,
          cursor: 'pointer',
        }}>✓ ابدأ التنفيذ</button>
        <button onClick={onCancel} style={{
          padding: '10px 16px', borderRadius: 9,
          border: `1px solid ${C.border}`, background: 'transparent',
          color: C.dim, fontFamily: "'Cairo',sans-serif", fontSize: 12,
          cursor: 'pointer',
        }}>تعديل</button>
      </div>
    </div>
  );
}

// ── Message bubble ────────────────────────────────────────────────
function Bubble({
  msg, color, reaction, onReact,
}: {
  msg: AgentMessage; color: string;
  reaction?: 'like' | 'dislike';
  onReact?: (id: string, r: 'like' | 'dislike') => void;
}) {
  const C = useC();
  const isUser = msg.role === 'user';
  const tokens = estimateTokens(msg.content);
  const cost   = ((tokens / 1000) * 0.002).toFixed(4);

  return (
    <div style={{
      display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-start', gap: 9, marginBottom: 16,
    }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: `${color}15`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>✨</div>
      )}
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          padding: '11px 15px',
          borderRadius: isUser ? '14px 3px 14px 14px' : '3px 14px 14px 14px',
          background: isUser ? `linear-gradient(135deg, ${color}cc, ${color}88)` : C.card,
          border: isUser ? 'none' : `1px solid ${C.border}`,
          color: isUser ? '#fff' : C.text,
          fontFamily: "'Cairo',sans-serif", fontSize: 13.5,
          lineHeight: 1.8, direction: 'rtl', whiteSpace: 'pre-line',
          boxShadow: isUser ? 'none' : `0 1px 4px ${C.border}`,
        }}>{msg.content}</div>

        {msg.suggestions && msg.suggestions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 7 }}>
            {msg.suggestions.map((s, i) => (
              <span key={i} style={{
                padding: '4px 12px', borderRadius: 99,
                border: `1px solid ${color}30`, background: `${color}0d`,
                color, fontSize: 11, fontFamily: "'Cairo',sans-serif", fontWeight: 700,
                cursor: 'pointer',
              }}>{s}</span>
            ))}
          </div>
        )}

        {/* Time + reactions + token cost */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginTop: 5,
          flexDirection: isUser ? 'row-reverse' : 'row',
        }}>
          <span style={{ fontSize: 9.5, color: C.dim, fontFamily: "'Cairo',sans-serif" }}>
            {new Date(msg.timestamp).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
          </span>

          {!isUser && onReact && (
            <>
              <div style={{ display: 'flex', gap: 3 }}>
                <button
                  onClick={() => onReact(msg.id, 'like')}
                  title='مفيد'
                  style={{
                    width: 22, height: 22, borderRadius: 5, border: 'none',
                    background: reaction === 'like' ? 'rgba(34,197,94,0.15)' : 'transparent',
                    color: reaction === 'like' ? C.green : C.dim,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.12s',
                  }}
                ><ThumbsUp size={11} /></button>
                <button
                  onClick={() => onReact(msg.id, 'dislike')}
                  title='غير مفيد'
                  style={{
                    width: 22, height: 22, borderRadius: 5, border: 'none',
                    background: reaction === 'dislike' ? 'rgba(239,68,68,0.15)' : 'transparent',
                    color: reaction === 'dislike' ? '#EF4444' : C.dim,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.12s',
                  }}
                ><ThumbsDown size={11} /></button>
              </div>
              <span style={{
                fontSize: 9, color: C.dim, fontFamily: 'monospace',
                background: C.tokenBadge, padding: '1px 6px',
                borderRadius: 4, border: `1px solid ${C.border}`,
              }}>
                {tokens} توكن · ${cost}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Input box (reusable) ─────────────────────────────────────────
function InputBox({
  value, onChange, onSend, onKeyDown, placeholder, color, compact,
  onExecAgent, onChatAgent,
}: {
  value: string; onChange: (v: string) => void;
  onSend: () => void; onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder: string; color: string; compact?: boolean;
  onExecAgent?: () => void; onChatAgent?: () => void;
}) {
  const C = useC();
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.inputBorder}`,
      borderRadius: compact ? 14 : 18,
      padding: compact ? '4px 4px 4px 12px' : '8px 8px 8px 18px',
      boxShadow: compact ? 'none' : `0 16px 48px ${C.border}`,
      transition: 'all 0.2s',
    }}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        rows={compact ? 1 : 3}
        autoFocus={!compact}
        style={{
          width: '100%', background: 'transparent', border: 'none', outline: 'none',
          color: C.text, fontFamily: "'Cairo',sans-serif", fontSize: compact ? 14 : 15.5,
          resize: 'none', padding: compact ? '8px 0' : '10px 0 6px',
          direction: 'rtl', lineHeight: 1.7, maxHeight: 130, overflowY: 'auto',
        }}
      />
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', paddingTop: 4,
      }}>
        {/* Left: agent type buttons (only on home) */}
        <div style={{ display: 'flex', gap: 5 }}>
          {onExecAgent && (
            <button onClick={onExecAgent} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 11px', borderRadius: 7,
              border: `1px solid ${C.border}`, background: 'transparent',
              color: C.mid, fontFamily: "'Cairo',sans-serif", fontSize: 11.5,
              cursor: 'pointer', transition: 'all 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.color = '#8B5CF6'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.mid; }}
            >
              <Cpu size={12} />وكيل تنفيذ
            </button>
          )}
          {onChatAgent && (
            <button onClick={onChatAgent} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 11px', borderRadius: 7,
              border: `1px solid ${C.border}`, background: 'transparent',
              color: C.mid, fontFamily: "'Cairo',sans-serif", fontSize: 11.5,
              cursor: 'pointer', transition: 'all 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.mid; }}
            >
              <MessageSquare size={12} />وكيل دردشة
            </button>
          )}
          {compact && (
            <button style={{
              width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.border}`,
              background: 'transparent', color: C.dim, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Mic size={12} /></button>
          )}
        </div>

        {/* Right: send */}
        <button
          onClick={onSend}
          disabled={!value.trim()}
          style={{
            width: compact ? 32 : 38, height: compact ? 32 : 38,
            borderRadius: compact ? 8 : 11, border: 'none',
            background: value.trim()
              ? `linear-gradient(135deg, ${color}, ${color}cc)`
              : C.disabledBtn,
            color: value.trim() ? '#fff' : C.dim,
            cursor: value.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
        >
          <ArrowUp size={compact ? 14 : 16} />
        </button>
      </div>
    </div>
  );
}

// ── Main chat area ────────────────────────────────────────────────
function ChatArea({
  pendingPlan, onPlanConfirm, onPlanCancel,
  onSend, mode,
}: {
  pendingPlan: { steps: string[]; color: string } | null;
  onPlanConfirm: () => void; onPlanCancel: () => void;
  onSend: (text: string, exec?: boolean) => void;
  mode: 'home' | 'chat';
}) {
  const C = useC();
  const { activeAgentId, agents, getSession } = useAgentActivation();
  const { preview, openPreview, closePreview } = usePreview();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const agent     = agents.find(a => a.id === activeAgentId);
  const session   = activeAgentId ? getSession(activeAgentId) : null;
  const tpl       = agent ? AGENT_TEMPLATES.find(t => t.key === agent.agentType) : null;
  const color     = tpl?.color ?? C.gold;
  const [reactions, setReactions] = useState<Record<string, 'like' | 'dislike'>>({});

  const handleReact = useCallback((msgId: string, r: 'like' | 'dislike') => {
    setReactions(prev => ({
      ...prev,
      [msgId]: prev[msgId] === r ? undefined as unknown as 'like' : r,
    }));
  }, []);

  useEffect(() => {
    if (mode === 'chat') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.messages?.length, pendingPlan, mode]);

  function handleSend() {
    if (!input.trim()) return;
    const t = input.trim();
    setInput('');
    onSend(t);
  }

  function handleExecAgent() {
    if (!input.trim()) {
      onSend('أريد وكيل تنفيذ يساعدني في إدارة أعمالي', true);
    } else {
      const t = input.trim();
      setInput('');
      onSend(t, true);
    }
  }

  function handleChatAgent() {
    if (!input.trim()) {
      onSend('أريد التحدث مع وكيل مساعد');
    } else {
      const t = input.trim();
      setInput('');
      onSend(t);
    }
  }

  // ── Home view: input centered ──────────────────────────────
  if (mode === 'home') {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 40px', gap: 28,
      }}>
        {/* Input — centered, large */}
        <div style={{ width: '100%', maxWidth: 680 }}>
          <InputBox
            value={input}
            onChange={setInput}
            onSend={handleSend}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder='اشرح مهمتك... الوكيل سيضع خطة ويطلب تأكيدك'
            color={C.gold}
            onExecAgent={handleExecAgent}
            onChatAgent={handleChatAgent}
          />
        </div>

        {/* Quick templates */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 7,
          justifyContent: 'center', maxWidth: 660,
        }}>
          {TEMPLATES.map((t, i) => (
            <button
              key={i}
              onClick={() => onSend(t.text, true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 99,
                border: `1px solid ${C.border}`, background: C.card,
                color: C.mid, fontFamily: "'Cairo',sans-serif", fontSize: 12.5,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = t.color + '50';
                e.currentTarget.style.color = C.text;
                e.currentTarget.style.background = C.cardHov;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.mid;
                e.currentTarget.style.background = C.card;
              }}
            >
              <span style={{ fontSize: 13 }}>{t.icon}</span>
              {t.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Chat view: messages + input at bottom ─────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Agent header */}
      <div style={{
        padding: '11px 20px', borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 10, direction: 'rtl',
        flexShrink: 0, background: C.headerBg, backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, fontSize: 16,
          background: `${color}15`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{tpl?.icon ?? '✨'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cairo',sans-serif", fontWeight: 800, fontSize: 13, color: C.text }}>
            {agent?.nameAr ?? 'وياك المساعد'}
          </div>
          <div style={{ fontFamily: "'Cairo',sans-serif", fontSize: 10.5, color: C.dim }}>
            {tpl?.descriptionAr ?? 'يشرح ويوجه ويفتح الأدوات المناسبة'}
          </div>
        </div>
        <button
          onClick={() => preview.isOpen ? closePreview() : openPreview({
            mode: 'execution', title: 'التنفيذ',
            agentId: activeAgentId ?? null, taskId: null, status: 'running',
          })}
          style={{
            width: 28, height: 28, borderRadius: 6,
            border: `1px solid ${preview.isOpen ? color + '40' : C.border}`,
            background: preview.isOpen ? `${color}12` : 'transparent',
            color: preview.isOpen ? color : C.dim,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          {preview.isOpen ? <X size={11} /> : <Settings size={11} />}
        </button>
      </div>

      {/* Messages area */}
      <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 12px', direction: 'rtl' }}>
        {session?.messages.map(msg => (
          <Bubble
            key={msg.id} msg={msg} color={color}
            reaction={reactions[msg.id]}
            onReact={msg.role === 'agent' ? handleReact : undefined}
          />
        ))}
        {pendingPlan && (
          <PlanCard
            steps={pendingPlan.steps} color={pendingPlan.color}
            onConfirm={onPlanConfirm} onCancel={onPlanCancel}
          />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input — sticks to bottom */}
      <div style={{ padding: '10px 20px 14px', borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <InputBox
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder='اكتب رسالتك...'
          color={color}
          compact
        />
      </div>
    </div>
  );
}

// ── Main OS ───────────────────────────────────────────────────────
function AgentOSInner({ onClose }: { onClose?: () => void }) {
  const {
    ensureDefaultAgent, agents, addAgentReply,
    activateChat, setActiveAgent, activeAgentId, sendMessage,
  } = useAgentActivation();
  const { userId } = useWeyaakIdentity();
  const { openPreview, preview, closePreview } = usePreview();
  const { isMobile, isTablet } = useBreakpoint();
  const { integrations } = useIntegrations();
  const [searchParams, setSearchParams] = useSearchParams();
  // على الموبايل: السايدبار مطوي دائماً في البداية
  const [collapsed, setCollapsed] = useState(false);
  // overlay للسايدبار على الموبايل
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState<'home' | 'chat'>('home');
  const [pendingPlan, setPendingPlan] = useState<{ steps: string[]; color: string } | null>(null);
  const [isLight, setIsLight] = useState(() => {
    try { return localStorage.getItem('wayak_theme') === 'light'; } catch { return false; }
  });

  const C = isLight ? LIGHT : DARK;
  const ownerId    = userId ?? 'local_user';
  const handledRef = useRef('');

  // على الموبايل: طيّ السايدبار تلقائياً
  useEffect(() => {
    if (isMobile) { setCollapsed(true); setSidebarOpen(false); }
    else { setCollapsed(isTablet); }
  }, [isMobile, isTablet]);

  function toggleTheme() {
    setIsLight(v => {
      const next = !v;
      try { localStorage.setItem('wayak_theme', next ? 'light' : 'dark'); } catch {}
      return next;
    });
  }

  useEffect(() => {
    ensureDefaultAgent(ownerId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId]);

  useEffect(() => {
    if (!activeAgentId) setMode('home');
  }, [activeAgentId]);

  // ── URL params ────────────────────────────────────────────────
  useEffect(() => {
    const connectKey  = searchParams.get('connect');
    const activateKey = searchParams.get('activate');
    const platformId  = searchParams.get('platform');
    const msgParam    = searchParams.get('msg')
      ?? sessionStorage.getItem('wayak_initial_message');

    if (msgParam && handledRef.current !== `msg:${msgParam}`) {
      sessionStorage.removeItem('wayak_initial_message');
      handledRef.current = `msg:${msgParam}`;
      const def = agents.find(a => a.ownerId === ownerId && a.isDefault);
      if (def) {
        setTimeout(() => {
          handleSend(msgParam);
          setTimeout(() => setSearchParams({}, { replace: true }), 300);
        }, 300);
      }
      return;
    }

    const param = connectKey ?? activateKey;
    if (!param || handledRef.current === param) return;

    const def = agents.find(a => a.ownerId === ownerId && a.isDefault);
    if (!def) return;

    handledRef.current = param;
    activateChat(def.id);
    setActiveAgent(def.id);
    setMode('chat');
    setPendingPlan(null);

    if (connectKey) {
      const msg = (platformId ? SOCIAL_PLATFORM_MSGS[platformId] : undefined)
        ?? CONNECT_MSGS[connectKey as IntegrationKey];
      if (msg) setTimeout(() => addAgentReply(def.id, msg, []), 400);
      setTimeout(() => openPreview({
        mode: 'setup', title: 'اضغط الزر أدناه',
        agentId: def.id, toolKey: connectKey, taskId: null, status: 'idle',
      }), 200);
    }

    if (activateKey) {
      setTimeout(() => addAgentReply(
        def.id,
        'أهلاً! سأساعدك في تفعيل هذا الوكيل وإعداد الأدوات المطلوبة.\n\nشاهد في اليمين ما تحتاجه — اضغط على كل أداة وسأوضح لك الخطوات 👈',
        [],
      ), 400);
      setTimeout(() => openPreview({
        mode: 'setup', title: 'إعداد الوكيل',
        agentId: def.id, toolKey: null, taskId: null, status: 'idle',
      }), 200);
    }

    setTimeout(() => setSearchParams({}, { replace: true }), 600);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agents, ownerId]);

  // ── Handle send ───────────────────────────────────────────────
  const handleSend = useCallback(async (text: string, wantsExec = false) => {
    const def = agents.find(a => a.ownerId === ownerId && a.isDefault);
    if (!def) { ensureDefaultAgent(ownerId); return; }

    activateChat(def.id);
    setActiveAgent(def.id);
    setMode('chat');
    sendMessage(def.id, text);
    setPendingPlan(null);

    // ── Provider search detection ─────────────────────────────
    const searchIntent = detectServiceSearch(text);
    if (searchIntent) {
      const { service, serviceAr, city } = searchIntent;
      setTimeout(async () => {
        addAgentReply(
          def.id,
          `🔍 أبحث عن ${serviceAr}${city ? ` في ${city}` : ''} في قاعدة بيانات وياك...`,
          [],
        );

        const results = await searchProviders(service, city);

        if (results.length === 0) {
          addAgentReply(
            def.id,
            `لم أجد مزودين مسجّلين لخدمة "${serviceAr}"${city ? ` في ${city}` : ''} حتى الآن.\n\nيمكنك دعوة مزود خدمة للتسجيل في وياك، أو جرّب بحثاً أوسع! 🔍`,
            ['بحث في مدينة أخرى', 'دعوة مزود', 'خدمة مختلفة'],
          );
          return;
        }

        const cityText = city ? ` في ${city}` : '';
        addAgentReply(
          def.id,
          `وجدت ${results.length} مزود${results.length > 1 ? 'ين' : ''} لخدمة ${serviceAr}${cityText} ✅\n\nتحقق من البطاقات في اليمين للتواصل المباشر 👈`,
          [],
        );

        openPreview({
          mode: 'providers',
          title: `${serviceAr}${cityText} — ${results.length} نتيجة`,
          agentId: def.id,
          taskId: null,
          status: 'completed',
          toolKey: null,
          providerResults: results,
          searchQuery: text,
        });
      }, 500);
      return;
    }

    // ── Execution template ────────────────────────────────────
    if (wantsExec) {
      const match = TEMPLATES.find(t => text.includes(t.text) || t.text.includes(text.slice(0, 8)));
      const plan = match ?? TEMPLATES[0];

      setTimeout(() => {
        addAgentReply(
          def.id,
          `فهمت طلبك: "${text}" 🎯\n\nوضعت خطة تنفيذية من ${plan.plan.length} خطوات — راجعها وأكّد للبدء:`,
          [],
        );
        setPendingPlan({ steps: plan.plan, color: plan.color });
      }, 600);
    } else {
      // ── Check if user is asking about GSC / Analytics → fetch real data first ──
      const gscIntegration      = integrations.find(i => i.key === 'searchConsole');
      const analyticsIntegration = integrations.find(i => i.key === 'analytics');
      const wantsGSC      = GSC_INTENT.test(text) && gscIntegration?.status === 'connected';
      const wantsAnalytics = GA_INTENT.test(text) && analyticsIntegration?.status === 'connected';

      let toolContext = '';

      if (wantsGSC || wantsAnalytics) {
        addAgentReply(def.id, wantsGSC ? '⏳ جاري جلب بيانات Search Console...' : '⏳ جاري جلب بيانات Analytics...', []);
      }

      const toolFetches: Promise<void>[] = [];

      if (wantsGSC && gscIntegration?.metadata?.token) {
        const siteUrl = gscIntegration.metadata?.siteUrl ?? 'https://app.bietalreef.ae/';
        toolFetches.push(
          fetchGSCData(gscIntegration.metadata.token, siteUrl).then(d => { toolContext += '\n\n' + d; })
        );
      }

      if (wantsAnalytics && analyticsIntegration?.metadata?.token) {
        const propertyId = analyticsIntegration.metadata?.propertyId ?? '';
        if (propertyId) {
          toolFetches.push(
            fetchAnalyticsData(analyticsIntegration.metadata.token, propertyId).then(d => { toolContext += '\n\n' + d; })
          );
        } else {
          toolContext += '\n\nتنبيه: لم يُضبط Property ID لـ Analytics. يرجى إضافته في الإعدادات.';
        }
      }

      await Promise.all(toolFetches);

      // ── OpenAI gpt-4o-mini with shared thread ──────────────────
      const openaiKey = localStorage.getItem('wayak_openai_key') || localStorage.getItem('openai_api_key');
      if (openaiKey) {
        let thread: Array<{ role: string; content: string }> = [];
        try {
          const raw = localStorage.getItem('wayak_main_thread_v1');
          if (raw) thread = JSON.parse(raw);
        } catch { /* silent */ }
        thread.push({ role: 'user', content: text });

        const systemContent = toolContext
          ? `أنت وياك، وكيل تنفيذي ذكي لمنصة بيت الريف في الإمارات. ساعد المستخدم بشكل عملي ومختصر. أجب دائماً بالعربية.\n\nبيانات حقيقية متاحة لك الآن:${toolContext}`
          : 'أنت وياك، وكيل تنفيذي ذكي لمنصة بيت الريف في الإمارات. ساعد المستخدم بشكل عملي ومختصر. أجب دائماً بالعربية.';

        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemContent },
              ...thread.slice(-20),
            ],
            max_tokens: 800,
          }),
        }).then(r => r.ok ? r.json() : null).then(data => {
          const reply = data?.choices?.[0]?.message?.content;
          if (reply) {
            thread.push({ role: 'assistant', content: reply });
            localStorage.setItem('wayak_main_thread_v1', JSON.stringify(thread.slice(-40)));
            addAgentReply(def.id, reply, []);
          } else {
            addAgentReply(def.id, `فهمت: "${text}"\n\nكيف يمكنني مساعدتك بالتفصيل؟`, ['شرح أكثر', 'ابدأ تنفيذاً', 'اقتراح خطة']);
          }
        }).catch(() => {
          addAgentReply(def.id, `فهمت: "${text}"\n\nكيف يمكنني مساعدتك بالتفصيل؟`, ['شرح أكثر', 'ابدأ تنفيذاً', 'اقتراح خطة']);
        });
      } else {
        if (toolContext) {
          // show raw data even without OpenAI key
          addAgentReply(def.id, toolContext.trim(), ['تحليل البيانات', 'تقرير كامل']);
        } else {
          setTimeout(() => {
            addAgentReply(def.id, `فهمت: "${text}"\n\nكيف يمكنني مساعدتك بالتفصيل؟`, ['شرح أكثر', 'ابدأ تنفيذاً', 'اقتراح خطة']);
          }, 700);
        }
      }
    }
  }, [agents, ownerId, activateChat, setActiveAgent, sendMessage, addAgentReply, ensureDefaultAgent, openPreview, integrations]);

  // ── Plan confirmed → execution preview ───────────────────────
  const handlePlanConfirm = useCallback(() => {
    const def = agents.find(a => a.ownerId === ownerId && a.isDefault);
    if (!def || !pendingPlan) return;
    addAgentReply(def.id, 'ممتاز! بدأت التنفيذ الآن 🚀\n\nتابع التقدم في اللوحة على اليمين.', []);
    setPendingPlan(null);
    openPreview({
      mode: 'execution', title: 'جارٍ التنفيذ...',
      agentId: def.id, taskId: null, status: 'running',
    });
  }, [agents, ownerId, pendingPlan, addAgentReply, openPreview]);

  return (
    <ThemeCtx.Provider value={C}>
      <div style={{ display: 'flex', height: '100%', width: '100%', background: C.bg, overflow: 'hidden', position: 'relative' }}>

        {/* ── موبايل: overlay خلف السايدبار ─── */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)',
            }}
          />
        )}

        {/* ── السايدبار: على الموبايل يطفو كـ overlay ── */}
        <div style={{
          position: isMobile ? 'fixed' : 'relative',
          top: 0, right: 0, height: '100%', zIndex: 50,
          transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(100%)') : 'none',
          transition: isMobile ? 'transform 0.25s ease' : 'none',
        }}>
          <Sidebar
            collapsed={isMobile ? false : collapsed}
            onToggle={() => isMobile ? setSidebarOpen(false) : setCollapsed(p => !p)}
          />
        </div>

        {/* ── المنطقة الرئيسية ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minWidth: 0, flexDirection: 'column' }}>

          {/* ── TopBar الموبايل ── */}
          {isMobile && (
            <div style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderBottom: `1px solid ${C.border}`,
              background: C.headerBg, backdropFilter: 'blur(10px)',
            }}>
              <button
                onClick={toggleTheme}
                style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.mid, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {isLight ? <Sun size={13} /> : <Moon size={13} />}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: C.goldBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✨</div>
                <span style={{ fontFamily: "'Cairo',sans-serif", fontWeight: 800, fontSize: 14, color: C.text }}>وياك</span>
              </div>
              <button
                onClick={() => setSidebarOpen(true)}
                style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.mid, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Menu size={14} />
              </button>
            </div>
          )}

          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0 }}>

              {/* Theme toggle — desktop only (top-left) */}
              {!isMobile && (
                <div style={{ position: 'absolute', top: 10, left: 14, zIndex: 10 }}>
                  <button
                    onClick={toggleTheme}
                    title={isLight ? 'الوضع الداكن' : 'الوضع الفاتح'}
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      border: `1px solid ${C.border}`, background: C.card,
                      color: isLight ? C.gold : C.mid, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.cardHov; e.currentTarget.style.color = C.gold; }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.card; e.currentTarget.style.color = isLight ? C.gold : C.mid; }}
                  >
                    {isLight ? <Sun size={14} /> : <Moon size={14} />}
                  </button>
                </div>
              )}

              <ChatArea
                mode={mode}
                pendingPlan={pendingPlan}
                onPlanConfirm={handlePlanConfirm}
                onPlanCancel={() => setPendingPlan(null)}
                onSend={handleSend}
              />
            </div>

          </div>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}

interface WayakAgentOSProps { onClose?: () => void; }
export function WayakAgentOS({ onClose }: WayakAgentOSProps) {
  return <AgentOSInner onClose={onClose} />;
}
export default WayakAgentOS;
