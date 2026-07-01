/**
 * AIAgentEngine.tsx — محرك الوكلاء الذكيين
 * ═══════════════════════════════════════════════════════
 * 6 وكلاء: SEO | Analysis | Content | Browser | Code | Research
 * يتكامل مع WayakComputer كـ view مستقل
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, BarChart2, FileText, Globe, Code2, BookOpen,
  Send, Loader2, ChevronDown, Copy, Download, Trash2,
  CheckCircle, Clock, Zap, Star, RefreshCw, X,
  type LucideIcon,
} from 'lucide-react';

// ─── Design Tokens (تطابق WayakComputer) ───
const C = {
  bg:         '#080E1C',
  surface:    '#111827',
  surfaceHi:  '#1E293B',
  border:     'rgba(255,255,255,0.08)',
  borderHi:   'rgba(255,255,255,0.14)',
  text:       '#F1F5F9',
  textDim:    '#94A3B8',
  textMut:    'rgba(255,255,255,0.30)',
  gold:       '#D4AF37',
  goldLight:  '#F5D76E',
  goldSoft:   'rgba(212,175,55,0.10)',
  goldBorder: 'rgba(212,175,55,0.20)',
  blue:       '#3B5BFE',
  blueSoft:   'rgba(59,91,254,0.10)',
  blueBorder: 'rgba(59,91,254,0.20)',
  purple:     '#8B5CF6',
  purpleSoft: 'rgba(139,92,246,0.10)',
  purpleBdr:  'rgba(139,92,246,0.20)',
  amber:      '#F59E0B',
  amberSoft:  'rgba(245,158,11,0.10)',
  red:        '#EF4444',
  redSoft:    'rgba(239,68,68,0.10)',
  teal:       '#14B8A6',
  tealSoft:   'rgba(20,184,166,0.10)',
  tealBdr:    'rgba(20,184,166,0.20)',
};
const fontCairo = "'Cairo','Tajawal',system-ui,sans-serif";
const fontMono  = "'JetBrains Mono','Fira Code','Courier New',monospace";

// ─── Agent Definitions ───
export type AgentType = 'seo' | 'analysis' | 'content' | 'browser' | 'code' | 'research';

interface AgentDef {
  id: AgentType;
  nameAr: string;
  nameEn: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  soft: string;
  border: string;
  prompts: string[];
}

const AGENTS: AgentDef[] = [
  {
    id: 'seo', nameAr: 'وكيل SEO', nameEn: 'SEO Agent',
    desc: 'تحليل الكلمات المفتاحية وتحسين محركات البحث',
    icon: Search, color: C.blue, soft: C.blueSoft, border: C.blueBorder,
    prompts: ['حلّل SEO لموقع bietalreef.ae', 'اقترح كلمات مفتاحية لخدمة التشطيب', 'ما المنافسون الرئيسيون في السوق؟'],
  },
  {
    id: 'analysis', nameAr: 'وكيل التحليل', nameEn: 'Analysis Agent',
    desc: 'تحليل البيانات وإنشاء تقارير إحصائية',
    icon: BarChart2, color: C.purple, soft: C.purpleSoft, border: C.purpleBdr,
    prompts: ['حلّل بيانات المبيعات الشهرية', 'قارن أداء الخدمات المختلفة', 'توقع نمو الطلب للربع القادم'],
  },
  {
    id: 'content', nameAr: 'وكيل المحتوى', nameEn: 'Content Agent',
    desc: 'كتابة وإنشاء محتوى تسويقي احترافي',
    icon: FileText, color: C.gold, soft: C.goldSoft, border: C.goldBorder,
    prompts: ['اكتب وصفاً لخدمة تشطيب الفلل', 'أنشئ محتوى إنستغرام لعرض جديد', 'اكتب نصاً إعلانياً مقنعاً'],
  },
  {
    id: 'browser', nameAr: 'وكيل المتصفح', nameEn: 'Browser Agent',
    desc: 'استخراج البيانات وتصفح المواقع تلقائياً',
    icon: Globe, color: C.teal, soft: C.tealSoft, border: C.tealBdr,
    prompts: ['استخرج بيانات من موقع المنافسين', 'ابحث عن أسعار مواد البناء', 'اجمع تقييمات العملاء من الإنترنت'],
  },
  {
    id: 'code', nameAr: 'وكيل الكود', nameEn: 'Code Agent',
    desc: 'مراجعة وكتابة وتحسين الكود البرمجي',
    icon: Code2, color: C.amber, soft: C.amberSoft, border: 'rgba(245,158,11,0.20)',
    prompts: ['راجع هذا الكود وأصلح الأخطاء', 'اكتب دالة لحساب تكلفة المشروع', 'حسّن أداء مكون React هذا'],
  },
  {
    id: 'research', nameAr: 'وكيل البحث', nameEn: 'Research Agent',
    desc: 'البحث المعمّق وجمع المعلومات والتوثيق',
    icon: BookOpen, color: '#F43F5E', soft: 'rgba(244,63,94,0.10)', border: 'rgba(244,63,94,0.20)',
    prompts: ['ابحث عن اتجاهات قطاع البناء في الإمارات', 'ما أفضل ممارسات إدارة مشاريع التشطيب؟', 'اجمع معلومات عن لوائح البناء في دبي'],
  },
];

// ─── Task Result Types ───
interface AgentTask {
  id: string;
  agentId: AgentType;
  query: string;
  result?: string;
  status: 'pending' | 'running' | 'done' | 'error';
  createdAt: Date;
  durationMs?: number;
}

// ─── Mock result generator ───
function generateMockResult(agent: AgentDef, query: string): string {
  const timestamp = new Date().toLocaleTimeString('ar-AE');
  switch (agent.id) {
    case 'seo':
      return `<div dir="rtl" style="font-family:Cairo,sans-serif;padding:16px;color:#F1F5F9;background:#111827;border-radius:12px;line-height:1.7">
<h2 style="color:#D4AF37;margin:0 0 12px;font-size:16px">تقرير SEO — ${query}</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px">
  <div style="background:rgba(59,91,254,0.1);border:1px solid rgba(59,91,254,0.2);border-radius:10px;padding:12px;text-align:center">
    <div style="font-size:24px;font-weight:800;color:#3B5BFE">87</div>
    <div style="font-size:11px;color:#94A3B8">نقاط SEO</div>
  </div>
  <div style="background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.2);border-radius:10px;padding:12px;text-align:center">
    <div style="font-size:24px;font-weight:800;color:#D4AF37">142</div>
    <div style="font-size:11px;color:#94A3B8">كلمة مفتاحية</div>
  </div>
  <div style="background:rgba(20,184,166,0.1);border:1px solid rgba(20,184,166,0.2);border-radius:10px;padding:12px;text-align:center">
    <div style="font-size:24px;font-weight:800;color:#14B8A6">324</div>
    <div style="font-size:11px;color:#94A3B8">رابط خارجي</div>
  </div>
</div>
<h3 style="color:#F1F5F9;font-size:13px;margin:0 0 8px">أهم الكلمات المفتاحية:</h3>
<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
  ${['تشطيب فلل', 'مقاول دبي', 'ديكور داخلي', 'بناء إمارات', 'تجديد منازل'].map(k =>
    `<span style="background:rgba(59,91,254,0.15);border:1px solid rgba(59,91,254,0.25);border-radius:20px;padding:3px 10px;font-size:11px;color:#94A3B8">${k}</span>`
  ).join('')}
</div>
<h3 style="color:#F1F5F9;font-size:13px;margin:0 0 8px">التوصيات:</h3>
<ul style="padding-right:18px;margin:0;color:#94A3B8;font-size:12px">
  <li>تحسين سرعة التحميل (حالياً 2.8 ثانية → الهدف أقل من 1.5)</li>
  <li>إضافة محتوى منتظم بالكلمات المفتاحية المستهدفة</li>
  <li>بناء روابط خلفية من مواقع العقارات الإماراتية</li>
  <li>تحسين وصف الميتا لصفحات الخدمات</li>
</ul>
<div style="margin-top:12px;font-size:10px;color:rgba(255,255,255,0.25);border-top:1px solid rgba(255,255,255,0.06);padding-top:8px">
  وكيل SEO · ${timestamp}
</div></div>`;

    case 'analysis':
      return `<div dir="rtl" style="font-family:Cairo,sans-serif;padding:16px;color:#F1F5F9;background:#111827;border-radius:12px;line-height:1.7">
<h2 style="color:#8B5CF6;margin:0 0 12px;font-size:16px">تقرير التحليل — ${query}</h2>
<div style="margin-bottom:14px">
  <h3 style="font-size:13px;color:#F1F5F9;margin:0 0 8px">مؤشرات الأداء الرئيسية</h3>
  ${[
    ['إجمالي الطلبات', '1,284', '+23%', '#8B5CF6'],
    ['متوسط قيمة الطلب', '45,200 AED', '+8%', '#D4AF37'],
    ['معدل الرضا', '94.7%', '+2.1%', '#14B8A6'],
    ['مدة إنجاز المشروع', '18 يوم', '-3 أيام', '#3B5BFE'],
  ].map(([label, value, change, color]) =>
    `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;margin-bottom:5px">
      <span style="font-size:12px;color:#94A3B8">${label}</span>
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:13px;font-weight:700;color:${color}">${value}</span>
        <span style="font-size:10px;color:#14B8A6;background:rgba(20,184,166,0.1);padding:2px 7px;border-radius:10px">${change}</span>
      </div>
    </div>`
  ).join('')}
</div>
<div style="margin-top:12px;font-size:10px;color:rgba(255,255,255,0.25);border-top:1px solid rgba(255,255,255,0.06);padding-top:8px">
  وكيل التحليل · ${timestamp}
</div></div>`;

    case 'content':
      return `<div dir="rtl" style="font-family:Cairo,sans-serif;padding:16px;color:#F1F5F9;background:#111827;border-radius:12px;line-height:1.8">
<h2 style="color:#D4AF37;margin:0 0 12px;font-size:16px">المحتوى المنشأ — ${query}</h2>
<div style="background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.15);border-radius:10px;padding:14px;margin-bottom:12px">
  <p style="font-size:13px;color:#F1F5F9;margin:0 0 10px">✨ <strong style="color:#D4AF37">بيت الريف</strong> — شريكك المثالي في رحلة التشطيب والبناء بالإمارات.</p>
  <p style="font-size:12px;color:#94A3B8;margin:0 0 8px">نقدّم لك تجربة استثنائية تجمع بين الجودة العالية والأسعار التنافسية، مع فريق من أمهر المقاولين والمصممين المعتمدين في جميع أنحاء الإمارات.</p>
  <p style="font-size:12px;color:#94A3B8;margin:0">🏠 فلل · 🏢 مكاتب · 🏗️ مشاريع تجارية — نحن معك من الفكرة حتى التسليم.</p>
</div>
<div style="display:flex;gap:8px;flex-wrap:wrap">
  ${['#تشطيب_فلل', '#ديكور_إمارات', '#بيت_الريف', '#مقاول_معتمد', '#دبي'].map(tag =>
    `<span style="background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.2);border-radius:20px;padding:3px 10px;font-size:11px;color:#D4AF37">${tag}</span>`
  ).join('')}
</div>
<div style="margin-top:12px;font-size:10px;color:rgba(255,255,255,0.25);border-top:1px solid rgba(255,255,255,0.06);padding-top:8px">
  وكيل المحتوى · ${timestamp}
</div></div>`;

    case 'browser':
      return `<div dir="rtl" style="font-family:Cairo,sans-serif;padding:16px;color:#F1F5F9;background:#111827;border-radius:12px;line-height:1.7">
<h2 style="color:#14B8A6;margin:0 0 12px;font-size:16px">نتائج الاستخراج — ${query}</h2>
<div style="background:rgba(20,184,166,0.05);border:1px solid rgba(20,184,166,0.15);border-radius:10px;padding:12px;margin-bottom:10px">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
    <div style="width:8px;height:8px;border-radius:50%;background:#14B8A6;box-shadow:0 0 8px #14B8A6"></div>
    <span style="font-size:11px;color:#14B8A6;font-weight:700">تم الاستخراج بنجاح — 23 سجل</span>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:11px">
    <thead>
      <tr style="border-bottom:1px solid rgba(255,255,255,0.08)">
        <th style="padding:6px 8px;text-align:right;color:#94A3B8;font-weight:600">المصدر</th>
        <th style="padding:6px 8px;text-align:right;color:#94A3B8;font-weight:600">البيانات</th>
        <th style="padding:6px 8px;text-align:right;color:#94A3B8;font-weight:600">الحالة</th>
      </tr>
    </thead>
    <tbody>
      ${[
        ['موقع 1', 'تم الاستخراج', '✓'],
        ['موقع 2', 'تم الاستخراج', '✓'],
        ['موقع 3', 'تم الاستخراج', '✓'],
      ].map(([src, data, status]) =>
        `<tr style="border-bottom:1px solid rgba(255,255,255,0.04)">
          <td style="padding:6px 8px;color:#F1F5F9">${src}</td>
          <td style="padding:6px 8px;color:#94A3B8">${data}</td>
          <td style="padding:6px 8px;color:#14B8A6">${status}</td>
        </tr>`
      ).join('')}
    </tbody>
  </table>
</div>
<div style="margin-top:12px;font-size:10px;color:rgba(255,255,255,0.25);border-top:1px solid rgba(255,255,255,0.06);padding-top:8px">
  وكيل المتصفح · ${timestamp}
</div></div>`;

    case 'code':
      return `<div dir="ltr" style="font-family:'JetBrains Mono',monospace;padding:16px;color:#F1F5F9;background:#111827;border-radius:12px;line-height:1.6">
<div dir="rtl" style="font-family:Cairo,sans-serif;margin-bottom:12px">
  <h2 style="color:#F59E0B;margin:0 0 6px;font-size:16px">مراجعة الكود — <span style="direction:ltr">${query}</span></h2>
  <p style="font-size:11px;color:#94A3B8;margin:0">تم الكشف عن 2 تحسينات و1 تحذير</p>
</div>
<div style="background:#0d1117;border:1px solid rgba(245,158,11,0.2);border-radius:8px;padding:12px;overflow-x:auto">
<pre style="margin:0;font-size:11px;color:#e6edf3"><code><span style="color:#ff7b72">function</span> <span style="color:#d2a8ff">calculateProjectCost</span>(<span style="color:#ffa657">area</span>: <span style="color:#79c0ff">number</span>, <span style="color:#ffa657">type</span>: <span style="color:#79c0ff">string</span>) {
  <span style="color:#8b949e">// ✅ تحسين: استخدام const بدل let</span>
  <span style="color:#ff7b72">const</span> <span style="color:#ffa657">baseRate</span> = <span style="color:#79c0ff">getBaseRate</span>(type);
  <span style="color:#ff7b72">const</span> <span style="color:#ffa657">total</span> = area * baseRate;

  <span style="color:#8b949e">// ⚠️ تحقق: أضف validation للمدخلات</span>
  <span style="color:#ff7b72">if</span> (area &lt;= <span style="color:#a5f3fc">0</span>) <span style="color:#ff7b72">throw new</span> Error(<span style="color:#a5f3fc">'المساحة يجب أن تكون موجبة'</span>);

  <span style="color:#ff7b72">return</span> { total, baseRate, area };
}</code></pre>
</div>
<div dir="rtl" style="margin-top:12px;font-size:10px;color:rgba(255,255,255,0.25);border-top:1px solid rgba(255,255,255,0.06);padding-top:8px;font-family:Cairo,sans-serif">
  وكيل الكود · ${timestamp}
</div></div>`;

    case 'research':
      return `<div dir="rtl" style="font-family:Cairo,sans-serif;padding:16px;color:#F1F5F9;background:#111827;border-radius:12px;line-height:1.8">
<h2 style="color:#F43F5E;margin:0 0 12px;font-size:16px">تقرير البحث — ${query}</h2>
<div style="display:flex;flex-direction:column;gap:10px">
  ${[
    ['الملخص التنفيذي', 'شهد قطاع البناء في الإمارات نمواً بنسبة 12% خلال 2024، مدفوعاً بمشاريع إكسبو ورؤية 2030.'],
    ['الاتجاهات الرئيسية', 'زيادة الطلب على التشطيبات الفاخرة، التوجه نحو المباني الذكية، ارتفاع أسعار المواد الخام.'],
    ['الفرص', 'نمو سوق الإسكان الميسّر، مشاريع البنية التحتية، طلب متزايد على خدمات التجديد.'],
  ].map(([title, content]) =>
    `<div style="background:rgba(244,63,94,0.05);border:1px solid rgba(244,63,94,0.15);border-radius:10px;padding:12px">
      <div style="font-size:12px;font-weight:700;color:#F43F5E;margin-bottom:5px">${title}</div>
      <div style="font-size:12px;color:#94A3B8">${content}</div>
    </div>`
  ).join('')}
</div>
<div style="margin-top:12px;font-size:10px;color:rgba(255,255,255,0.25);border-top:1px solid rgba(255,255,255,0.06);padding-top:8px">
  وكيل البحث · ${timestamp}
</div></div>`;

    default: return `<p>تم معالجة الطلب: ${query}</p>`;
  }
}

// ─── Props ───
interface AIAgentEngineProps {
  onOpenBrowser?: (url?: string) => void;
}

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════
export function AIAgentEngine({ onOpenBrowser }: AIAgentEngineProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('seo');
  const [input, setInput]     = useState('');
  const [tasks, setTasks]     = useState<AgentTask[]>([]);
  const [activeTask, setActiveTask] = useState<AgentTask | null>(null);
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const agent = AGENTS.find(a => a.id === selectedAgent)!;

  const runTask = useCallback(() => {
    if (!input.trim()) return;
    const query = input.trim();
    setInput('');

    const task: AgentTask = {
      id: Date.now().toString(),
      agentId: selectedAgent,
      query,
      status: 'running',
      createdAt: new Date(),
    };
    setTasks(prev => [task, ...prev]);
    setActiveTask(task);

    const start = Date.now();
    // Simulate processing delay
    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      const result = generateMockResult(agent, query);
      const updated: AgentTask = { ...task, status: 'done', result, durationMs: Date.now() - start };
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
      setActiveTask(updated);
    }, delay);
  }, [input, selectedAgent, agent]);

  // Scroll result into view
  useEffect(() => {
    if (activeTask?.status === 'done') {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }
  }, [activeTask?.status]);

  const copyResult = () => {
    if (activeTask?.result) {
      const text = activeTask.result.replace(/<[^>]*>/g, '');
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: fontCairo, direction: 'rtl', background: C.bg }}>

      {/* ── AGENT SELECTOR BAR ── */}
      <div style={{
        flexShrink: 0, padding: '10px 14px',
        borderBottom: `1px solid ${C.border}`,
        background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`,
      }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {AGENTS.map(a => {
            const active = a.id === selectedAgent;
            return (
              <motion.button
                key={a.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedAgent(a.id)}
                style={{
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 10px', borderRadius: 8,
                  background: active ? a.soft : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? a.border : C.border}`,
                  cursor: 'pointer', fontFamily: fontCairo,
                  transition: 'all 0.2s',
                }}
              >
                <a.icon style={{ width: 12, height: 12, color: active ? a.color : C.textDim, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: active ? a.color : C.textDim, whiteSpace: 'nowrap' }}>
                  {a.nameAr}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Active agent info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: agent.soft, border: `1px solid ${agent.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <agent.icon style={{ width: 13, height: 13, color: agent.color }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{agent.nameAr}</div>
            <div style={{ fontSize: 9.5, color: C.textDim }}>{agent.desc}</div>
          </div>
          <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 10, background: agent.soft, border: `1px solid ${agent.border}` }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: agent.color }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: agent.color }}>READY</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Result area */}
        <div style={{ flex: 1, padding: '14px', overflow: 'auto' }} ref={resultRef}>
          <AnimatePresence mode="wait">
            {!activeTask && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, paddingBottom: 30 }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: agent.soft, border: `1px solid ${agent.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <agent.icon style={{ width: 24, height: 24, color: agent.color }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{agent.nameAr} جاهز</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>{agent.desc}</div>
                </div>
                {/* Quick prompts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 360 }}>
                  {agent.prompts.map((p, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, x: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setInput(p); inputRef.current?.focus(); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 12px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
                        cursor: 'pointer', fontFamily: fontCairo, textAlign: 'right',
                      }}
                    >
                      <Star style={{ width: 10, height: 10, color: C.gold, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: C.textDim }}>{p}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTask && (
              <motion.div key={activeTask.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Task header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                  padding: '8px 12px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
                }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: agent.soft, border: `1px solid ${agent.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <agent.icon style={{ width: 11, height: 11, color: agent.color }} />
                  </div>
                  <span style={{ fontSize: 11, color: C.text, flex: 1 }}>{activeTask.query}</span>
                  {activeTask.status === 'running' && (
                    <Loader2 style={{ width: 13, height: 13, color: agent.color }} className="animate-spin" />
                  )}
                  {activeTask.status === 'done' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle style={{ width: 12, height: 12, color: C.teal }} />
                      <span style={{ fontSize: 9, color: C.teal, fontFamily: fontMono }}>
                        {((activeTask.durationMs || 0) / 1000).toFixed(1)}s
                      </span>
                    </div>
                  )}
                </div>

                {/* Running state */}
                {activeTask.status === 'running' && (
                  <div style={{
                    padding: '20px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                          style={{ width: 8, height: 8, borderRadius: '50%', background: agent.color }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: C.textDim }}>{agent.nameAr} يعالج طلبك...</span>
                  </div>
                )}

                {/* Done result */}
                {activeTask.status === 'done' && activeTask.result && (
                  <div>
                    {/* Action bar */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={copyResult}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, cursor: 'pointer', fontFamily: fontCairo }}>
                        <Copy style={{ width: 11, height: 11, color: C.textDim }} />
                        <span style={{ fontSize: 10, color: C.textDim }}>نسخ</span>
                      </motion.button>
                      {onOpenBrowser && (
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => onOpenBrowser()}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 7, background: agent.soft, border: `1px solid ${agent.border}`, cursor: 'pointer', fontFamily: fontCairo }}>
                          <Globe style={{ width: 11, height: 11, color: agent.color }} />
                          <span style={{ fontSize: 10, color: agent.color }}>فتح في المتصفح</span>
                        </motion.button>
                      )}
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setActiveTask(null)}
                        style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 7, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, cursor: 'pointer', fontFamily: fontCairo }}>
                        <RefreshCw style={{ width: 11, height: 11, color: C.textDim }} />
                        <span style={{ fontSize: 10, color: C.textDim }}>جديد</span>
                      </motion.button>
                    </div>
                    {/* HTML result */}
                    <div
                      dangerouslySetInnerHTML={{ __html: activeTask.result }}
                      style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}` }}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Task history */}
        {tasks.length > 1 && (
          <div style={{ flexShrink: 0, padding: '0 14px 8px', borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.textMut, letterSpacing: 0.5, padding: '8px 0 6px' }}>
              السجل الأخير
            </div>
            <div style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 2 }}>
              {tasks.slice(1, 6).map(t => {
                const a = AGENTS.find(ag => ag.id === t.agentId)!;
                return (
                  <motion.button
                    key={t.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTask(t)}
                    style={{
                      flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
                      padding: '4px 9px', borderRadius: 7,
                      background: activeTask?.id === t.id ? a.soft : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${activeTask?.id === t.id ? a.border : C.border}`,
                      cursor: 'pointer', fontFamily: fontCairo,
                    }}
                  >
                    <a.icon style={{ width: 10, height: 10, color: a.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 9.5, color: C.textDim, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.query}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── INPUT BAR ── */}
      <div style={{
        flexShrink: 0, padding: '10px 14px 12px',
        borderTop: `1px solid ${C.border}`,
        background: C.surface,
      }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 8,
          background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderHi}`,
          borderRadius: 12, padding: '8px 10px',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runTask(); } }}
            placeholder={`اسأل ${agent.nameAr}...`}
            rows={1}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: C.text, fontSize: 12, fontFamily: fontCairo, direction: 'rtl',
              resize: 'none', maxHeight: 80, lineHeight: 1.5,
            }}
          />
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={runTask}
            disabled={!input.trim() || tasks[0]?.status === 'running'}
            style={{
              width: 32, height: 32, borderRadius: 9, flexShrink: 0,
              background: input.trim() && tasks[0]?.status !== 'running' ? agent.color : 'rgba(255,255,255,0.06)',
              border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            {tasks[0]?.status === 'running'
              ? <Loader2 style={{ width: 14, height: 14, color: '#fff' }} className="animate-spin" />
              : <Send style={{ width: 14, height: 14, color: input.trim() ? '#fff' : C.textMut }} />
            }
          </motion.button>
        </div>
        <div style={{ fontSize: 9, color: C.textMut, marginTop: 5, textAlign: 'center' }}>
          Enter للإرسال · Shift+Enter لسطر جديد
        </div>
      </div>
    </div>
  );
}
