/**
 * AdminAIAssistant — وياك: وكيل تنفيذي ذكي للمدير
 * - Thread موحد محفوظ (يشترك مع WayakComputer)
 * - Function Calling: admin API + n8n webhooks + فتح المواقع
 * - صلاحيات كاملة: إحصائيات، مزودون، نظام، مواقع
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon3D } from '../ui/Icon3D';
import { getStats, getProviders } from './adminApi';
import { toast } from 'sonner@2.0.3';
import {
  Bot, Send, Zap, RefreshCw, Copy,
  Settings2, ChevronDown, ChevronUp, Workflow,
  Globe, ExternalLink, X, Database, Activity,
  Link, Key,
} from 'lucide-react';
import { projectId } from '../../utils/supabase/info';

const fontCairo = 'Cairo, Tajawal, sans-serif';

// ── Shared thread key (used by both AdminAIAssistant + WayakComputer) ──
export const WAYAK_THREAD_KEY = 'wayak_main_thread_v1';

// ── N8N Workflows ──
const N8N_WORKFLOWS = [
  { name: 'Weyaak.MainFlow',              desc: 'المنسق الرئيسي' },
  { name: 'Weyaak.TaskRouter',            desc: 'توجيه المهام' },
  { name: 'Weyaak.ExecutionManager',      desc: 'إدارة التنفيذ' },
  { name: 'Weyaak.CoinsManager',          desc: 'إدارة الكوينز' },
  { name: 'Weyaak.IntentAnalyzer',        desc: 'تحليل النوايا' },
  { name: 'Weyaak.DB.Leads',             desc: 'قاعدة بيانات العملاء' },
  { name: 'Weyaak.Lead.Capture',          desc: 'التقاط العملاء' },
  { name: 'Weyaak.Report.Build',          desc: 'بناء التقارير' },
  { name: 'Weyaak.DB.SEO_Plan',          desc: 'خطة SEO' },
  { name: 'Weyaak.GoogleAnalysis.Intake', desc: 'تحليل Google Analytics' },
  { name: 'Weyaak.DomainAnalysis.Intake', desc: 'تحليل النطاق' },
  { name: 'Weyaak.Confirmation.Submit',   desc: 'تأكيد الطلبات' },
  { name: 'CRM.CreateTicket',             desc: 'إنشاء تذاكر CRM' },
  { name: 'CRM.AssignAgent',              desc: 'تعيين الوكيل' },
  { name: 'Build.AssignProvider',         desc: 'تعيين المزود' },
  { name: 'Media.GenerateImages',         desc: 'توليد الصور' },
  { name: 'Media.PublishSocial',          desc: 'النشر على السوشيال' },
  { name: 'SEO.AnalyzeDomain',            desc: 'تحليل SEO للنطاق' },
];

// ── Connected Websites ──
const CONNECTED_SITES = [
  { name: 'بيت الريف — التطبيق',  url: 'https://app.bietalreef.ae',      icon: '🏠' },
  { name: 'بيت الريف — الرئيسي', url: 'https://bietalreef.ae',           icon: '🌐' },
  { name: 'وياك',                  url: 'https://weyaak.bietalreef.ae',   icon: '⚡' },
  { name: 'Supabase Dashboard',    url: `https://supabase.com/dashboard/project/${projectId}`, icon: '🗄' },
];

// ── Tool Definitions for Function Calling ──
const AGENT_TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'get_platform_stats',
      description: 'احصل على إحصائيات المنصة الحية: المستخدمون، المزودون، النشاط',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_providers',
      description: 'احصل على قائمة مزودي الخدمات مع التفاصيل',
      parameters: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['all', 'pending', 'verified'], description: 'حالة المزودين' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'open_website',
      description: 'افتح موقعاً إلكترونياً في لوحة المعاينة',
      parameters: {
        type: 'object',
        properties: {
          url:    { type: 'string', description: 'رابط الموقع الكامل' },
          reason: { type: 'string', description: 'سبب الفتح' },
        },
        required: ['url'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'trigger_n8n',
      description: 'تشغيل سير عمل n8n لتنفيذ مهمة تلقائية',
      parameters: {
        type: 'object',
        properties: {
          workflow: { type: 'string', description: 'اسم سير العمل مثل Weyaak.MainFlow' },
          payload:  { type: 'object', description: 'البيانات المرسلة للـ workflow' },
        },
        required: ['workflow'],
      },
    },
  },
];

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolResults?: Array<{ name: string; result: string }>;
}

// ── Execute tool call ──
async function executeTool(name: string, args: any): Promise<string> {
  try {
    switch (name) {
      case 'get_platform_stats': {
        const stats = await getStats();
        return JSON.stringify({
          total_users: stats.total_users,
          new_today: stats.new_today,
          total_providers: stats.total_providers,
          pending_providers: stats.pending_providers,
          activity_today: stats.activity_today,
          total_wallet_balance: stats.total_wallet_balance,
        });
      }
      case 'get_providers': {
        const res = await getProviders(1, 10, args.status || 'all');
        return JSON.stringify({
          total: res.total,
          providers: (res.providers || []).slice(0, 5).map((p: any) => ({
            name: p.full_name || p.email,
            type: p.provider_type,
            is_verified: p.is_verified,
            emirate: p.primary_emirate,
            created: p.created_at?.slice(0, 10),
          })),
        });
      }
      case 'open_website': {
        // Side-effect handled by caller via onOpenSite callback
        return JSON.stringify({ opened: args.url, status: 'success' });
      }
      case 'trigger_n8n': {
        // Webhook path map — مسارات n8n الحقيقية
        const N8N_BASE = 'https://bietalreefapp.app.n8n.cloud/webhook';
        const WEBHOOK_PATHS: Record<string, string> = {
          'Weyaak.MainFlow':              'weyaak/main',
          'Weyaak.TaskRouter':            'weyaak/main',
          'Weyaak.ExecutionManager':      'weyaak/main',
          'Weyaak.IntentAnalyzer':        'weyaak/main',
          'Weyaak.CoinsManager':          'weyaak/main',
          'Weyaak.Lead.Capture':          'weyaak/main',
          'Weyaak.Report.Build':          'weyaak/main',
          'Weyaak.DB.SEO_Plan':           'weyaak/main',
          'Weyaak.GoogleAnalysis.Intake': 'weyaak/main',
          'Weyaak.DomainAnalysis.Intake': 'weyaak/main',
          'Weyaak.Confirmation.Submit':   'weyaak/main',
          'CRM.CreateTicket':             'weyaak/main',
          'CRM.AssignAgent':              'weyaak/main',
          'Build.AssignProvider':         'weyaak/main',
          'Media.GenerateImages':         'weyaak/main',
          'Media.PublishSocial':          'weyaak/main',
          'SEO.AnalyzeDomain':            'weyaak/main',
        };
        // Save base for future use
        localStorage.setItem('n8n_webhook_base', N8N_BASE);
        const path = WEBHOOK_PATHS[args.workflow] || 'weyaak/main';
        const payload = {
          type: 'text',
          text: args.payload?.text || `تنفيذ: ${args.workflow}`,
          user_id: args.payload?.user_id || 'admin',
          project_id: args.payload?.project_id || '',
          workflow: args.workflow,
          ...args.payload,
        };
        const res = await fetch(`${N8N_BASE}/${path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) return JSON.stringify({ error: `HTTP ${res.status} — تحقق من n8n` });
        const data = await res.json().catch(() => ({}));
        return JSON.stringify({ status: 'triggered', workflow: args.workflow, response: data });
      }
      default:
        return JSON.stringify({ error: 'أداة غير معروفة' });
    }
  } catch (e: any) {
    return JSON.stringify({ error: e.message });
  }
}

// ── OpenAI with function calling ──
async function callOpenAIAgent(
  messages: any[],
  apiKey: string,
  onOpenSite: (url: string) => void,
): Promise<{ reply: string; toolResults?: Array<{ name: string; result: string }> }> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      tools: AGENT_TOOLS,
      tool_choice: 'auto',
      max_tokens: 1200,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI error ${res.status}`);
  }

  const data = await res.json();
  const choice = data.choices?.[0];

  // Handle tool calls
  if (choice?.finish_reason === 'tool_calls') {
    const toolCalls = choice.message.tool_calls || [];
    const toolResults: Array<{ name: string; result: string }> = [];
    const toolMessages: any[] = [choice.message];

    for (const tc of toolCalls) {
      const args = JSON.parse(tc.function.arguments || '{}');

      // Side effect: open website
      if (tc.function.name === 'open_website' && args.url) {
        onOpenSite(args.url);
      }

      const result = await executeTool(tc.function.name, args);
      toolResults.push({ name: tc.function.name, result });
      toolMessages.push({ role: 'tool', tool_call_id: tc.id, content: result });
    }

    // Continue with tool results
    const finalRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [...messages, ...toolMessages],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    });
    const finalData = await finalRes.json();
    return { reply: finalData.choices?.[0]?.message?.content || 'تم التنفيذ', toolResults };
  }

  return { reply: choice?.message?.content || 'لا يوجد رد' };
}

function buildSystemPrompt(stats: any) {
  const now = new Date().toLocaleDateString('ar-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return `أنت وياك، الوكيل التنفيذي الذكي الرئيسي لمنصة "بيت الريف".

## هويتك
- اسمك: وياك — مساعد تنفيذي متصل بحساب المدير (info@bietalreef.ae)
- تعمل في كل مكان: لوحة الأدمن + كمبيوتر وياك + واجهة المستخدم
- لديك ذاكرة مستمرة عبر الجلسات (thread موحد)

## بيانات المنصة الحالية (${now})
- إجمالي المستخدمين: ${stats?.total_users ?? '...'}
- تسجيلات اليوم: ${stats?.new_today ?? 0}
- مزودو الخدمات: ${stats?.total_providers ?? 0}
- بانتظار التوثيق: ${stats?.pending_providers ?? 0}
- أنشطة اليوم: ${stats?.activity_today ?? 0}
- رصيد الكوينز: ${stats?.total_wallet_balance ?? 0}

## المواقع المتصلة
- app.bietalreef.ae — التطبيق الرئيسي
- bietalreef.ae — الموقع التعريفي
- weyaak.bietalreef.ae — واجهة وياك

## أدواتك (Functions)
- get_platform_stats: إحصائيات المنصة الحية
- get_providers: قائمة مزودي الخدمات
- open_website: فتح أي موقع في لوحة المعاينة
- trigger_n8n: تشغيل workflows في n8n — يرسل للـ webhook الحقيقي

## كيف تستخدم trigger_n8n:
- workflow: اسم الـ workflow (مثل "Weyaak.MainFlow")
- payload.text: النص الوصفي للمهمة (REQUIRED — هذا ما يفسره n8n)
- payload.user_id: معرف المستخدم إن وجد
- مثال: trigger_n8n("Weyaak.MainFlow", { text: "أنشئ تذكرة CRM للعميل أحمد", user_id: "admin" })

## سير عمل n8n المتاح (${N8N_WORKFLOWS.length} workflow)
${N8N_WORKFLOWS.map(w => `- ${w.name}: ${w.desc}`).join('\n')}

## قواعد التواصل
- تحدث بالعربية دائماً
- كل طلب = مهمة قابلة للتنفيذ — استخدم الأدوات مباشرة بدون استئذان
- استخدم trigger_n8n تلقائياً عند أي طلب تنفيذي
- عند فتح موقع، اشرح ماذا ستفعل فيه
- أعطِ توصيات محددة وقابلة للتنفيذ الفوري`;
}

export function AdminAIAssistant() {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = localStorage.getItem(WAYAK_THREAD_KEY);
      if (!raw) return [];
      const parsed: Message[] = JSON.parse(raw);
      return parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
    } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('admin_openai_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [showWorkflows, setShowWorkflows] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [platformStats, setPlatformStats] = useState<any>(null);
  const [openedSite, setOpenedSite] = useState<string | null>(null);
  const [n8nBase, setN8nBase] = useState(() => localStorage.getItem('n8n_webhook_base') || '');
  const bottomRef = useRef<HTMLDivElement>(null);

  const cardClass = isDark
    ? 'bg-white/[0.13] backdrop-blur-xl border border-white/[0.18]'
    : 'bg-white border-[4px] border-gray-200/60';

  const inputClass = isDark
    ? 'bg-white/[0.10] border border-white/[0.15] text-white placeholder-white/30'
    : 'bg-white border-[3px] border-gray-200/60 text-[#1F3D2B] placeholder-gray-400';

  // Load stats
  useEffect(() => { getStats().then(setPlatformStats).catch(() => {}); }, []);

  // Persist thread
  useEffect(() => {
    try { localStorage.setItem(WAYAK_THREAD_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('admin_openai_key', key);
    setShowKeyInput(false);
    toast.success('تم حفظ مفتاح OpenAI');
  };

  const saveN8nBase = (url: string) => {
    setN8nBase(url);
    localStorage.setItem('n8n_webhook_base', url);
    toast.success('تم حفظ رابط n8n');
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    if (!apiKey) { setShowKeyInput(true); toast.error('أدخل مفتاح OpenAI أولاً'); return; }

    const userMsg: Message = { role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg]
        .filter(m => m.role !== 'system')
        .slice(-16)
        .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));

      const apiMessages = [
        { role: 'system', content: buildSystemPrompt(platformStats) },
        ...history,
      ];

      const { reply, toolResults } = await callOpenAIAgent(
        apiMessages,
        apiKey,
        (url) => setOpenedSite(url),
      );

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
        toolResults,
      }]);
    } catch (err: any) {
      toast.error('خطأ في OpenAI: ' + err.message);
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ خطأ: ${err.message}`, timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, apiKey, platformStats]);

  const formatTime = (d: Date) => d.toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' });
  const copyMsg = (c: string) => { navigator.clipboard.writeText(c); toast.success('تم النسخ'); };

  const QUICK_PROMPTS = [
    'ما هو ملخص حالة المنصة اليوم؟',
    'كم عدد مزودي الخدمة بانتظار التوثيق؟',
    'ماذا يجب أن أفعل الآن كأولوية؟',
    'افتح موقع بيت الريف وحلله',
    'أعطني تقريراً عن n8n workflows',
    'كيف يمكنني تحسين تجربة المستخدم؟',
  ];

  return (
    <div className="space-y-4 h-full flex flex-col" style={{ fontFamily: fontCairo }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Icon3D icon={Bot} theme="blue" size="md" hoverable={false} />
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--bait-text)' }}>
              وياك — الوكيل التنفيذي
              {messages.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
                  {messages.length} رسالة محفوظة
                </span>
              )}
            </h2>
            <p className="text-xs" style={{ color: 'var(--bait-text-muted)' }}>
              متصل دائماً بحسابك — Admin + كمبيوتر وياك + n8n
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowWorkflows(!showWorkflows)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
            style={{ background: 'var(--bait-surface)', color: 'var(--bait-text)', border: '2px solid var(--bait-border)' }}>
            <Workflow size={13} />n8n
            {showWorkflows ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          <button onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
            style={{ background: 'var(--bait-surface)', color: 'var(--bait-text)', border: '2px solid var(--bait-border)' }}>
            <Settings2 size={13} />إعدادات
          </button>
          <button onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
            style={{ background: apiKey ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: apiKey ? '#10B981' : '#F59E0B', border: `2px solid ${apiKey ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
            <Key size={13} />
            {apiKey ? 'API Key ✓' : 'أضف API Key'}
          </button>
          {messages.length > 0 && (
            <button onClick={() => { setMessages([]); localStorage.removeItem(WAYAK_THREAD_KEY); }}
              className="p-2 rounded-xl transition-all hover:scale-[1.02]"
              style={{ background: 'var(--bait-surface)', color: 'var(--bait-text-muted)', border: '2px solid var(--bait-border)' }}>
              <RefreshCw size={13} />
            </button>
          )}
        </div>
      </div>

      {/* API Key Input */}
      {showKeyInput && (
        <div className={`${cardClass} rounded-2xl p-4`}>
          <p className="text-sm font-bold mb-3" style={{ color: 'var(--bait-text)' }}>🔑 مفتاح OpenAI API</p>
          <div className="flex gap-2">
            <input type="password" placeholder="sk-..." id="openai-key-input" defaultValue={apiKey}
              className={`flex-1 px-3 py-2 rounded-xl text-sm font-[Cairo] outline-none ${inputClass}`} />
            <button onClick={() => saveApiKey((document.getElementById('openai-key-input') as HTMLInputElement).value)}
              className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '2px solid rgba(16,185,129,0.3)' }}>
              حفظ
            </button>
          </div>
          <p className="text-[10px] mt-2" style={{ color: 'var(--bait-text-muted)' }}>محفوظ محلياً فقط</p>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className={`${cardClass} rounded-2xl p-4 space-y-3`}>
          <h4 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--bait-text)' }}>
            <Link size={14} className="text-[#D4AF37]" />إعدادات الأدوات
          </h4>
          {/* n8n Webhook URL */}
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: 'var(--bait-text-muted)' }}>رابط n8n Webhook Base URL</p>
            <div className="flex gap-2">
              <input type="text" placeholder="https://bietalreefapp.app.n8n.cloud/webhook"
                defaultValue={n8nBase} id="n8n-url-input"
                className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono outline-none ${inputClass}`} />
              <button onClick={() => saveN8nBase((document.getElementById('n8n-url-input') as HTMLInputElement).value)}
                className="px-3 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                حفظ
              </button>
            </div>
            {n8nBase && <p className="text-[10px] mt-1 text-[#10B981]">✓ متصل: {n8nBase.slice(0, 40)}...</p>}
          </div>
          {/* Connected websites */}
          <div>
            <p className="text-xs font-bold mb-2" style={{ color: 'var(--bait-text-muted)' }}>المواقع المتصلة</p>
            <div className="grid grid-cols-2 gap-2">
              {CONNECTED_SITES.map(site => (
                <button key={site.url} onClick={() => setOpenedSite(site.url)}
                  className="flex items-center gap-2 p-2 rounded-xl text-right transition-all hover:scale-[1.01]"
                  style={{ background: 'var(--bait-surface)', border: '1px solid var(--bait-border)' }}>
                  <span>{site.icon}</span>
                  <div className="text-right min-w-0">
                    <p className="text-[10px] font-bold truncate" style={{ color: 'var(--bait-text)' }}>{site.name}</p>
                    <p className="text-[9px] truncate" style={{ color: 'var(--bait-text-muted)' }}>{site.url.replace('https://', '')}</p>
                  </div>
                  <ExternalLink size={10} className="shrink-0" style={{ color: 'var(--bait-text-muted)' }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* N8N Workflows Panel */}
      {showWorkflows && (
        <div className={`${cardClass} rounded-2xl p-4`}>
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--bait-text)' }}>
            <Workflow size={14} className="text-[#D4AF37]" />
            سير عمل n8n ({N8N_WORKFLOWS.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {N8N_WORKFLOWS.map(w => (
              <button key={w.name}
                onClick={() => sendMessage(`شغّل workflow: ${w.name} — ${w.desc}`)}
                className="flex items-center gap-2 p-2 rounded-xl text-right transition-all hover:scale-[1.01] text-start"
                style={{ background: 'var(--bait-surface)', border: '1px solid var(--bait-border)' }}>
                <div className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
                <div>
                  <p className="text-[11px] font-bold" style={{ color: 'var(--bait-text)' }}>{w.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--bait-text-muted)' }}>{w.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Website Preview Panel */}
      {openedSite && (
        <div className={`${cardClass} rounded-2xl overflow-hidden`}>
          <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: 'var(--bait-border)' }}>
            <div className="flex items-center gap-2">
              <Globe size={13} className="text-[#3B5BFE]" />
              <span className="text-xs font-mono" style={{ color: 'var(--bait-text-muted)' }}>{openedSite}</span>
            </div>
            <div className="flex gap-2">
              <a href={openedSite} target="_blank" rel="noopener noreferrer"
                className="p-1 rounded hover:scale-110 transition-transform"
                style={{ color: 'var(--bait-text-muted)' }}>
                <ExternalLink size={12} />
              </a>
              <button onClick={() => setOpenedSite(null)} className="p-1 rounded" style={{ color: 'var(--bait-text-muted)' }}>
                <X size={12} />
              </button>
            </div>
          </div>
          <iframe src={openedSite} title="preview" className="w-full" style={{ height: 280, border: 'none' }}
            sandbox="allow-scripts allow-same-origin allow-forms" />
        </div>
      )}

      {/* Platform Stats Bar */}
      {platformStats && (
        <div className={`${cardClass} rounded-xl p-3 flex flex-wrap gap-4 text-xs`}>
          {[
            { label: 'مستخدمون',    value: platformStats.total_users,       color: '#3B5BFE' },
            { label: 'مزودون',      value: platformStats.total_providers,   color: '#D4AF37' },
            { label: 'بانتظار توثيق', value: platformStats.pending_providers, color: platformStats.pending_providers > 0 ? '#F59E0B' : '#10B981' },
            { label: 'نشاط اليوم',  value: platformStats.activity_today,   color: '#8B5CF6' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span style={{ color: 'var(--bait-text-muted)' }}>{s.label}:</span>
              <span className="font-bold" style={{ color: s.color }}>{s.value ?? '...'}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 mr-auto">
            <Activity size={10} className="text-[#10B981]" />
            <span className="text-[10px] text-[#10B981] font-bold">وياك نشط</span>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className={`${cardClass} rounded-2xl flex-1 flex flex-col min-h-[380px] overflow-hidden`}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '500px' }}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-8">
              <Icon3D icon={Bot} theme="blue" size="xl" hoverable={false} />
              <div>
                <p className="font-bold text-base" style={{ color: 'var(--bait-text)' }}>أهلاً بك يا مدير بيت الريف</p>
                <p className="text-sm mt-1" style={{ color: 'var(--bait-text-muted)' }}>
                  أنا وياك — متصل بحسابك، بـ n8n، وبجميع مواقعك. أنفذ بدل ما أرد فقط.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg mt-2">
                {QUICK_PROMPTS.map(p => (
                  <button key={p} onClick={() => sendMessage(p)}
                    className="px-3 py-2 rounded-xl text-xs text-right transition-all hover:scale-[1.02]"
                    style={{ background: 'var(--bait-surface)', color: 'var(--bait-text)', border: '1px solid var(--bait-border)' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-[#D4AF37] to-[#FFD700] text-[#5D4037]'
                    : 'bg-gradient-to-br from-[#3B5BFE] to-[#6366F1] text-white'
                }`}>
                  {msg.role === 'user' ? 'م' : 'AI'}
                </div>
                <div className={`group relative max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {/* Tool results badge */}
                  {msg.toolResults && msg.toolResults.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {msg.toolResults.map((tr, ti) => (
                        <span key={ti} className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                          style={{ background: 'rgba(59,91,254,0.1)', color: '#3B5BFE', border: '1px solid rgba(59,91,254,0.2)' }}>
                          ⚡ {tr.name.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? isDark
                        ? 'bg-[#D4AF37]/20 text-white border border-[#D4AF37]/30'
                        : 'bg-[#D4AF37]/15 text-[#3D2B00] border border-[#D4AF37]/30'
                      : isDark
                        ? 'bg-white/[0.08] text-white border border-white/[0.1]'
                        : 'bg-gray-50 text-[#1F3D2B] border border-gray-200/60'
                  }`}>
                    {msg.content}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px]" style={{ color: 'var(--bait-text-muted)' }}>{formatTime(msg.timestamp)}</span>
                    {msg.role === 'assistant' && (
                      <button onClick={() => copyMsg(msg.content)} className="p-0.5 rounded hover:text-[#D4AF37]"
                        style={{ color: 'var(--bait-text-muted)' }}>
                        <Copy size={10} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-[#3B5BFE] to-[#6366F1] text-white shrink-0">AI</div>
              <div className={`px-4 py-3 rounded-2xl ${isDark ? 'bg-white/[0.08] border border-white/[0.1]' : 'bg-gray-50 border border-gray-200/60'}`}>
                <div className="flex gap-1.5 items-center">
                  <span className="text-xs" style={{ color: 'var(--bait-text-muted)' }}>وياك ينفذ...</span>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-[#3B5BFE] animate-bounce" style={{ animationDelay: `${delay}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t" style={{ borderColor: 'var(--bait-border)' }}>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
            {QUICK_PROMPTS.slice(0, 4).map(p => (
              <button key={p} onClick={() => sendMessage(p)}
                className="shrink-0 px-3 py-1 rounded-full text-[11px] whitespace-nowrap transition-all hover:scale-[1.02]"
                style={{ background: 'var(--bait-surface)', color: 'var(--bait-text-secondary)', border: '1px solid var(--bait-border)' }}>
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="اطلب من وياك أي شيء — سينفذ مباشرة..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              disabled={loading}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-[Cairo] outline-none ${inputClass}`} />
            <button onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-[1.05] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #FFD700)', color: '#5D4037' }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
