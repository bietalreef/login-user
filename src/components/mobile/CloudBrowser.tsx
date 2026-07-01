/**
 * CloudBrowser.tsx — متصفح سحابي متعدد التبويبات
 * ════════════════════════════════════════════════════
 * - Tabs متعددة مع إضافة وإغلاق
 * - شريط عناوين + أزرار تنقل
 * - صفحات محاكاة لـ bietalreef + weyaak
 * - DevTools console
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, ChevronRight, RefreshCw, X, Plus,
  Globe, Lock, Code2,
  ExternalLink, Bookmark, Trash2,
} from 'lucide-react';

// ─── Design Tokens ───
const C = {
  bg:         '#080E1C',
  surface:    '#111827',
  surfaceHi:  '#1E293B',
  tabBg:      '#0e1628',
  border:     'rgba(255,255,255,0.08)',
  borderHi:   'rgba(255,255,255,0.14)',
  text:       '#F1F5F9',
  textDim:    '#94A3B8',
  textMut:    'rgba(255,255,255,0.30)',
  gold:       '#D4AF37',
  goldSoft:   'rgba(212,175,55,0.10)',
  goldBorder: 'rgba(212,175,55,0.20)',
  blue:       '#3B5BFE',
  blueSoft:   'rgba(59,91,254,0.10)',
  blueBorder: 'rgba(59,91,254,0.20)',
  teal:       '#14B8A6',
  tealSoft:   'rgba(20,184,166,0.10)',
};
const fontCairo = "'Cairo','Tajawal',system-ui,sans-serif";
const fontMono  = "'JetBrains Mono','Fira Code','Courier New',monospace";

// ─── Built-in pages ───
interface BuiltinPage {
  url: string;
  title: string;
  favicon: string;
  html: string;
}

const BUILTIN_PAGES: Record<string, BuiltinPage> = {
  'https://bietalreef.ae': {
    url: 'https://bietalreef.ae',
    title: 'بيت الريف — منصة البناء',
    favicon: '🏠',
    html: `<div dir="rtl" style="font-family:Cairo,sans-serif;background:#F5EEE1;min-height:100%;padding:24px;color:#1a1a1a">
      <div style="max-width:800px;margin:0 auto">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;padding:16px;background:#fff;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
          <div style="width:40px;height:40px;border-radius:12px;background:#D4AF37;display:flex;align-items:center;justify-content:center;font-size:20px">🏠</div>
          <div>
            <div style="font-size:18px;font-weight:800;color:#1a1a1a">بيت الريف</div>
            <div style="font-size:12px;color:#888">منصة البناء والتشطيب في الإمارات</div>
          </div>
          <div style="margin-right:auto;background:#D4AF37;color:#fff;padding:6px 16px;border-radius:20px;font-size:12px;font-weight:700">مجاني</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
          ${[['🏗️','مقاولون','200+'],['⭐','تقييم','4.9'],['🏙️','إمارات','7']].map(([icon,label,val]) =>
            `<div style="background:#fff;border-radius:12px;padding:16px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
              <div style="font-size:24px;margin-bottom:6px">${icon}</div>
              <div style="font-size:20px;font-weight:800;color:#D4AF37">${val}</div>
              <div style="font-size:11px;color:#888">${label}</div>
            </div>`
          ).join('')}
        </div>
        <div style="background:#fff;border-radius:16px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
          <div style="font-size:15px;font-weight:700;margin-bottom:14px">الخدمات الرئيسية</div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
            ${['تشطيب فلل','سباكة','كهرباء','ديكور داخلي','رخام وسيراميك','نجارة'].map(s =>
              `<div style="padding:10px 14px;background:#F5EEE1;border-radius:10px;font-size:12px;color:#333">✦ ${s}</div>`
            ).join('')}
          </div>
        </div>
      </div>
    </div>`,
  },
  'https://weyaak.ai': {
    url: 'https://weyaak.ai',
    title: 'وياك AI — مساعدك الذكي',
    favicon: '🤖',
    html: `<div dir="rtl" style="font-family:Cairo,sans-serif;background:#060C1A;min-height:100%;padding:24px;color:#F1F5F9">
      <div style="max-width:800px;margin:0 auto">
        <div style="text-align:center;margin-bottom:32px;padding:40px 20px">
          <div style="font-size:48px;margin-bottom:12px">🤖</div>
          <h1 style="font-size:28px;font-weight:900;color:#D4AF37;margin:0 0 8px">وياك AI</h1>
          <p style="color:#94A3B8;font-size:14px;margin:0">وكيلك التنفيذي الذكي لقطاع البناء والتشطيب</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
          ${[
            ['🔍','تحليل SEO','تحسين ظهورك في محركات البحث'],
            ['📊','تحليل البيانات','تقارير ذكية واحصائيات فورية'],
            ['✍️','إنشاء محتوى','محتوى تسويقي احترافي'],
            ['🌐','وكيل المتصفح','استخراج البيانات تلقائياً'],
          ].map(([icon,title,desc]) =>
            `<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px">
              <div style="font-size:24px;margin-bottom:8px">${icon}</div>
              <div style="font-size:13px;font-weight:700;color:#F1F5F9;margin-bottom:4px">${title}</div>
              <div style="font-size:11px;color:#94A3B8">${desc}</div>
            </div>`
          ).join('')}
        </div>
      </div>
    </div>`,
  },
  'https://analytics.bietalreef.ae': {
    url: 'https://analytics.bietalreef.ae',
    title: 'Analytics — بيت الريف',
    favicon: '📊',
    html: `<div dir="rtl" style="font-family:Cairo,sans-serif;background:#0B1120;min-height:100%;padding:24px;color:#F1F5F9">
      <div style="max-width:900px;margin:0 auto">
        <h2 style="font-size:18px;font-weight:800;color:#D4AF37;margin:0 0 20px">لوحة التحليلات</h2>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px">
          ${[['1,284','الطلبات','#3B5BFE'],['45,200','متوسط AED','#D4AF37'],['94.7%','الرضا','#14B8A6'],['18 يوم','مدة الإنجاز','#8B5CF6']].map(([v,l,c]) =>
            `<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px;text-align:center">
              <div style="font-size:22px;font-weight:800;color:${c};margin-bottom:4px">${v}</div>
              <div style="font-size:10px;color:#94A3B8">${l}</div>
            </div>`
          ).join('')}
        </div>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px">
          <div style="font-size:13px;font-weight:700;margin-bottom:12px">أداء الخدمات</div>
          ${[['تشطيب فلل',78,'#D4AF37'],['سباكة',65,'#3B5BFE'],['كهرباء',54,'#8B5CF6'],['ديكور',43,'#14B8A6']].map(([label,pct,color]) =>
            `<div style="margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px">
                <span style="color:#94A3B8">${label}</span>
                <span style="color:${color}">${pct}%</span>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:99px;overflow:hidden">
                <div style="width:${pct}%;height:100%;background:${color};border-radius:99px"></div>
              </div>
            </div>`
          ).join('')}
        </div>
      </div>
    </div>`,
  },
};

const NEW_TAB_HTML = `<div dir="rtl" style="font-family:Cairo,sans-serif;background:#080E1C;min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#F1F5F9;padding:24px">
  <div style="font-size:48px;margin-bottom:16px">🌐</div>
  <div style="font-size:16px;font-weight:700;color:#94A3B8;margin-bottom:24px">علامة تبويب جديدة</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:400px;width:100%">
    ${Object.values(BUILTIN_PAGES).map(p =>
      `<div onclick="window.location='${p.url}'" style="cursor:pointer;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px;text-align:center">
        <div style="font-size:22px;margin-bottom:6px">${p.favicon}</div>
        <div style="font-size:10px;color:#94A3B8;word-break:break-all">${p.url.replace('https://','')}</div>
      </div>`
    ).join('')}
  </div>
</div>`;

// ─── Types ───
interface BrowserTab {
  id: string;
  url: string;
  title: string;
  favicon: string;
  isLoading: boolean;
  html: string;           // للصفحات الداخلية فقط
  isExternal: boolean;    // true = iframe src مباشر للموقع
  history: string[];
  histIdx: number;
}

function makeTab(url = 'newtab'): BrowserTab {
  const page = url !== 'newtab' ? BUILTIN_PAGES[url] : null;
  return {
    id: Date.now().toString() + Math.random(),
    url: url === 'newtab' ? '' : url,
    title: page?.title ?? 'علامة تبويب جديدة',
    favicon: page?.favicon ?? '🌐',
    isLoading: false,
    html: page?.html ?? NEW_TAB_HTML,
    isExternal: false,
    history: url !== 'newtab' ? [url] : [],
    histIdx: url !== 'newtab' ? 0 : -1,
  };
}

// ─── ConsoleLog ───
interface ConsoleLine { type: 'log' | 'warn' | 'error' | 'info'; text: string; ts: string }

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════
export function CloudBrowser() {
  const [tabs, setTabs]       = useState<BrowserTab[]>(() => [makeTab('https://bietalreef.ae')]);
  const [activeId, setActiveId] = useState<string>(() => tabs[0].id);
  const [addressInput, setAddressInput] = useState('');
  const [showDevTools, setShowDevTools] = useState(false);
  const [consoleLogs, setConsoleLogs]   = useState<ConsoleLine[]>([
    { type: 'info',  text: 'متصفح وياك السحابي v1.0 — جاهز', ts: new Date().toLocaleTimeString('ar-AE') },
    { type: 'log',   text: 'تم تحميل الصفحة بنجاح', ts: new Date().toLocaleTimeString('ar-AE') },
  ]);
  const addressRef = useRef<HTMLInputElement>(null);
  const iframeRef  = useRef<HTMLIFrameElement>(null);

  const activeTab = tabs.find(t => t.id === activeId) ?? tabs[0];

  useEffect(() => {
    setAddressInput(activeTab?.url ?? '');
  }, [activeId, activeTab?.url]);

  const navigate = useCallback((url: string, tabId?: string) => {
    const id = tabId ?? activeId;
    const clean = url.startsWith('http') ? url : `https://${url}`;
    const page = BUILTIN_PAGES[clean];

    setTabs(prev => prev.map(t => {
      if (t.id !== id) return t;
      const newHist = [...t.history.slice(0, t.histIdx + 1), clean];
      return {
        ...t, url: clean, isLoading: true,
        title: 'جاري التحميل...', favicon: '⏳', isExternal: false,
        history: newHist, histIdx: newHist.length - 1,
      };
    }));

    const delay = page ? 500 : 800;
    setTimeout(() => {
      setTabs(prev => prev.map(t => {
        if (t.id !== id) return t;
        // موقع داخلي معرّف
        if (page) {
          return { ...t, isLoading: false, title: page.title, favicon: page.favicon, html: page.html, isExternal: false };
        }
        // موقع خارجي — نفتحه مباشرة في iframe
        return {
          ...t, isLoading: false,
          title: new URL(clean).hostname,
          favicon: `https://www.google.com/s2/favicons?domain=${clean}&sz=32`,
          html: '',
          isExternal: true,
        };
      }));
      setConsoleLogs(prev => [...prev, {
        type: 'log', text: `تم تحميل: ${clean}`, ts: new Date().toLocaleTimeString('ar-AE'),
      }]);
    }, delay);
  }, [activeId]);

  const goBack = () => {
    const t = activeTab;
    if (t.histIdx <= 0) return;
    navigate(t.history[t.histIdx - 1]);
    setTabs(prev => prev.map(tab => tab.id === t.id ? { ...tab, histIdx: tab.histIdx - 1 } : tab));
  };

  const goForward = () => {
    const t = activeTab;
    if (t.histIdx >= t.history.length - 1) return;
    navigate(t.history[t.histIdx + 1]);
    setTabs(prev => prev.map(tab => tab.id === t.id ? { ...tab, histIdx: tab.histIdx + 1 } : tab));
  };

  const addTab = () => {
    const t = makeTab();
    setTabs(prev => [...prev, t]);
    setActiveId(t.id);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) { setTabs([makeTab()]); return; }
    const idx = tabs.findIndex(t => t.id === id);
    const next = tabs[idx === tabs.length - 1 ? idx - 1 : idx + 1];
    setTabs(prev => prev.filter(t => t.id !== id));
    if (activeId === id) setActiveId(next.id);
  };

  const handleAddressKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && addressInput.trim()) navigate(addressInput.trim());
  };

  const isSecure = activeTab.url.startsWith('https://');
  const canBack    = activeTab.histIdx > 0;
  const canForward = activeTab.histIdx < activeTab.history.length - 1;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, fontFamily: fontCairo }}>

      {/* ── TAB BAR ── */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center',
        background: C.tabBg, borderBottom: `1px solid ${C.border}`,
        padding: '0 6px', gap: 2, minHeight: 36, overflowX: 'auto',
      }}>
        {tabs.map(tab => {
          const active = tab.id === activeId;
          return (
            <motion.div
              key={tab.id}
              whileHover={!active ? { backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
              onClick={() => setActiveId(tab.id)}
              style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 10px', borderRadius: '7px 7px 0 0',
                background: active ? C.surface : 'transparent',
                border: active ? `1px solid ${C.border}` : '1px solid transparent',
                borderBottom: active ? `1px solid ${C.surface}` : '1px solid transparent',
                cursor: 'pointer', maxWidth: 160, position: 'relative',
                marginBottom: active ? -1 : 0,
              }}
            >
              <span style={{ fontSize: 12, flexShrink: 0 }}>{tab.favicon}</span>
              <span style={{
                fontSize: 10, color: active ? C.text : C.textDim,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
              }}>
                {tab.isLoading ? 'جاري التحميل...' : tab.title}
              </span>
              {tab.isLoading && (
                <div style={{ width: 8, height: 8, border: `1.5px solid ${C.blue}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
              )}
              {!tab.isLoading && (
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={e => { e.stopPropagation(); closeTab(tab.id); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, borderRadius: 4, flexShrink: 0, opacity: active ? 1 : 0, pointerEvents: active ? 'auto' : 'none' }}
                >
                  <X style={{ width: 9, height: 9, color: C.textDim }} />
                </motion.button>
              )}
            </motion.div>
          );
        })}
        <motion.button
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          whileTap={{ scale: 0.9 }}
          onClick={addTab}
          style={{ width: 26, height: 26, borderRadius: 7, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <Plus style={{ width: 12, height: 12, color: C.textDim }} />
        </motion.button>
      </div>

      {/* ── ADDRESS BAR ── */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 10px',
        background: C.surface, borderBottom: `1px solid ${C.border}`,
      }}>
        {/* Nav buttons */}
        {[
          { icon: ChevronLeft,  action: goBack,    can: canBack },
          { icon: ChevronRight, action: goForward, can: canForward },
        ].map(({ icon: Icon, action, can }, i) => (
          <motion.button key={i} whileTap={can ? { scale: 0.9 } : {}} onClick={action}
            disabled={!can}
            style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: can ? 'pointer' : 'not-allowed', opacity: can ? 1 : 0.4, flexShrink: 0 }}>
            <Icon style={{ width: 13, height: 13, color: C.textDim }} />
          </motion.button>
        ))}

        <motion.button whileTap={{ scale: 0.9 }} onClick={() => activeTab.url && navigate(activeTab.url)}
          style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          {activeTab.isLoading
            ? <div style={{ width: 11, height: 11, border: `1.5px solid ${C.blue}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            : <RefreshCw style={{ width: 11, height: 11, color: C.textDim }} />
          }
        </motion.button>

        {/* Address input */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderHi}`,
          borderRadius: 8, padding: '4px 10px',
        }}>
          {isSecure
            ? <Lock style={{ width: 10, height: 10, color: C.teal, flexShrink: 0 }} />
            : <Globe style={{ width: 10, height: 10, color: C.textDim, flexShrink: 0 }} />
          }
          <input
            ref={addressRef}
            value={addressInput}
            onChange={e => setAddressInput(e.target.value)}
            onKeyDown={handleAddressKey}
            onFocus={e => e.target.select()}
            placeholder="أدخل URL أو ابحث..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: C.text, fontSize: 11, fontFamily: fontMono, direction: 'ltr',
            }}
          />
        </div>

        {/* Bookmarks */}
        <motion.button whileTap={{ scale: 0.9 }}
          style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <Bookmark style={{ width: 11, height: 11, color: C.textDim }} />
        </motion.button>

        {/* DevTools toggle */}
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowDevTools(s => !s)}
          style={{ width: 26, height: 26, borderRadius: 7, background: showDevTools ? C.blueSoft : 'rgba(255,255,255,0.04)', border: `1px solid ${showDevTools ? C.blueBorder : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <Code2 style={{ width: 11, height: 11, color: showDevTools ? C.blue : C.textDim }} />
        </motion.button>
      </div>

      {/* ── BOOKMARKS BAR (built-in sites) ── */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4,
        padding: '4px 10px', borderBottom: `1px solid ${C.border}`,
        background: 'rgba(0,0,0,0.2)', overflowX: 'auto',
      }}>
        {Object.values(BUILTIN_PAGES).map(p => (
          <motion.button key={p.url}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(p.url)}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', borderRadius: 6,
              background: activeTab.url === p.url ? C.goldSoft : 'transparent',
              border: `1px solid ${activeTab.url === p.url ? C.goldBorder : 'transparent'}`,
              cursor: 'pointer', fontFamily: fontCairo,
            }}>
            <span style={{ fontSize: 11 }}>{p.favicon}</span>
            <span style={{ fontSize: 9.5, color: activeTab.url === p.url ? C.gold : C.textDim, whiteSpace: 'nowrap' }}>
              {p.url.replace('https://', '')}
            </span>
          </motion.button>
        ))}
      </div>

      {/* ── CONTENT + DEVTOOLS ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* Page content */}
        <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id + activeTab.url}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ height: '100%' }}
            >
              {activeTab.isLoading ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                  <div style={{ width: 36, height: 36, border: `3px solid ${C.blueBorder}`, borderTopColor: C.blue, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <span style={{ fontSize: 12, color: C.textDim, fontFamily: fontCairo }}>جاري التحميل...</span>
                </div>
              ) : activeTab.isExternal ? (
                /* موقع خارجي — iframe src مباشر */
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <iframe
                    key={activeTab.url}
                    src={activeTab.url}
                    style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
                    title={activeTab.title}
                    referrerPolicy="no-referrer"
                    onError={() => {
                      // إذا حجب الموقع الـ iframe أظهر رسالة مع رابط فتح مباشر
                    }}
                  />
                  {/* شريط فتح مباشر — يظهر دائماً لمواقع قد تحجب الـ iframe */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(8,14,28,0.92)', backdropFilter: 'blur(8px)',
                    borderTop: `1px solid ${C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '6px 12px', gap: 8,
                  }}>
                    <span style={{ fontSize: 10, color: C.textDim, fontFamily: fontMono, direction: 'ltr', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {activeTab.url}
                    </span>
                    <button
                      onClick={() => window.open(activeTab.url, '_blank', 'noopener')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
                        padding: '4px 10px', borderRadius: 6, border: `1px solid ${C.goldBorder}`,
                        background: C.goldSoft, color: C.gold,
                        fontFamily: fontCairo, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      <ExternalLink size={10} />
                      فتح في نافذة جديدة
                    </button>
                  </div>
                </div>
              ) : (
                /* صفحة داخلية — srcDoc */
                <iframe
                  ref={iframeRef}
                  srcDoc={activeTab.html}
                  sandbox="allow-scripts allow-same-origin"
                  style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
                  title={activeTab.title}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* DevTools */}
        <AnimatePresence>
          {showDevTools && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 160, opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{
                flexShrink: 0, borderTop: `2px solid ${C.blue}`,
                background: '#0a0e1a', overflow: 'hidden',
              }}
            >
              {/* DevTools header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderBottom: `1px solid ${C.border}` }}>
                {['Console', 'Network', 'Elements'].map(tab => (
                  <button key={tab} style={{
                    background: tab === 'Console' ? C.blueSoft : 'transparent',
                    border: 'none', color: tab === 'Console' ? C.blue : C.textDim,
                    fontSize: 10, fontWeight: 700, fontFamily: fontMono, cursor: 'pointer',
                    padding: '3px 8px', borderRadius: 5,
                  }}>{tab}</button>
                ))}
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setConsoleLogs([])}
                  style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: C.textDim }}>
                  <Trash2 style={{ width: 11, height: 11 }} />
                </motion.button>
              </div>
              {/* Console output */}
              <div style={{ height: 120, overflow: 'auto', padding: '6px 10px', fontFamily: fontMono, fontSize: 11 }}>
                {consoleLogs.map((log, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 8, padding: '2px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    color: log.type === 'error' ? '#EF4444' : log.type === 'warn' ? '#F59E0B' : log.type === 'info' ? C.blue : C.textDim,
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>{log.ts}</span>
                    <span>{log.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
