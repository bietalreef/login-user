/**
 * wayak-agent.ts — وكيل وياك المشترك
 * ═══════════════════════════════════════
 * OpenAI Function Calling + n8n webhooks + Supabase admin API
 * يُستخدم في: WayakComputer + AdminAIAssistant + أي واجهة أخرى
 */
import { getStats, getProviders } from '../components/admin/adminApi';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

// ── Shared thread key ──
export const WAYAK_THREAD_KEY = 'wayak_main_thread_v1';

// ── N8N Config ──
const N8N_BASE = 'https://bietalreefapp.app.n8n.cloud/webhook';

const WEBHOOK_PATHS: Record<string, string> = {
  'Weyaak.MainFlow':              'weyaak/main',
  'Weyaak.TaskRouter':            'weyaak/main',
  'Weyaak.ExecutionManager':      'weyaak/main',
  'Weyaak.CoinsManager':          'weyaak/main',
  'Weyaak.IntentAnalyzer':        'weyaak/main',
  'Weyaak.DB.Leads':              'weyaak/main',
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

export const N8N_WORKFLOWS = [
  { name: 'Weyaak.MainFlow',              desc: 'المنسق الرئيسي' },
  { name: 'Weyaak.TaskRouter',            desc: 'توجيه المهام' },
  { name: 'Weyaak.ExecutionManager',      desc: 'إدارة التنفيذ' },
  { name: 'Weyaak.CoinsManager',          desc: 'إدارة الكوينز' },
  { name: 'Weyaak.IntentAnalyzer',        desc: 'تحليل النوايا' },
  { name: 'Weyaak.DB.Leads',              desc: 'قاعدة بيانات العملاء' },
  { name: 'Weyaak.Lead.Capture',          desc: 'التقاط العملاء' },
  { name: 'Weyaak.Report.Build',          desc: 'بناء التقارير' },
  { name: 'Weyaak.DB.SEO_Plan',           desc: 'خطة SEO' },
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

export const CONNECTED_SITES = [
  { name: 'بيت الريف — التطبيق',  url: 'https://app.bietalreef.ae',      icon: '🏠' },
  { name: 'بيت الريف — الرئيسي', url: 'https://bietalreef.ae',           icon: '🌐' },
  { name: 'وياك',                  url: 'https://weyaak.bietalreef.ae',   icon: '⚡' },
  { name: 'Supabase Dashboard',    url: `https://supabase.com/dashboard/project/${projectId}`, icon: '🗄' },
  { name: 'n8n Workflows',         url: 'https://bietalreefapp.app.n8n.cloud', icon: '⚙️' },
];

// ── OpenAI Tool Definitions ──
export const AGENT_TOOLS = [
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
      description: 'افتح موقعاً إلكترونياً في لوحة المعاينة أو في المتصفح السحابي',
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
      description: 'تشغيل سير عمل n8n لتنفيذ مهمة تلقائية (CRM، تقارير، SEO، نشر، تحليل، إلخ)',
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
  {
    type: 'function' as const,
    function: {
      name: 'query_database',
      description: 'استعلام من قاعدة بيانات Supabase: جدول معين مع فلاتر',
      parameters: {
        type: 'object',
        properties: {
          table:   { type: 'string', description: 'اسم الجدول (profiles, providers, leads, tasks, etc.)' },
          select:  { type: 'string', description: 'الأعمدة المطلوبة (مثل: *, id,name,email)' },
          filters: { type: 'object', description: 'فلاتر (مثل: { status: "active" })' },
          limit:   { type: 'number', description: 'عدد النتائج (افتراضي: 10)' },
          order:   { type: 'string', description: 'ترتيب حسب عمود (مثل: created_at.desc)' },
        },
        required: ['table'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'list_tables',
      description: 'عرض قائمة جداول قاعدة البيانات المتاحة',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
];

// ── Execute tool call ──
export async function executeTool(
  name: string,
  args: any,
  onOpenSite?: (url: string) => void,
): Promise<string> {
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
        onOpenSite?.(args.url);
        return JSON.stringify({ opened: args.url, status: 'success' });
      }
      case 'trigger_n8n': {
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
      case 'query_database': {
        let query = supabase
          .from(args.table)
          .select(args.select || '*');
        if (args.filters) {
          for (const [key, value] of Object.entries(args.filters)) {
            query = query.eq(key, value);
          }
        }
        if (args.order) {
          const [col, dir] = args.order.split('.');
          query = query.order(col, { ascending: dir !== 'desc' });
        }
        query = query.limit(args.limit || 10);
        const { data, error } = await query;
        if (error) return JSON.stringify({ error: error.message });
        return JSON.stringify({ table: args.table, count: data?.length ?? 0, rows: data });
      }
      case 'list_tables': {
        const knownTables = [
          'profiles', 'providers', 'leads', 'tasks', 'notifications',
          'wallet_transactions', 'service_requests', 'reviews',
          'categories', 'sub_categories', 'provider_services',
        ];
        return JSON.stringify({ tables: knownTables });
      }
      default:
        return JSON.stringify({ error: 'أداة غير معروفة' });
    }
  } catch (e: any) {
    return JSON.stringify({ error: e.message });
  }
}

// ── Build system prompt ──
export function buildSystemPrompt(stats?: any): string {
  const now = new Date().toLocaleDateString('ar-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return `أنت وياك، الوكيل التنفيذي الذكي الرئيسي لمنصة "بيت الريف".

## هويتك
- اسمك: وياك — مساعد تنفيذي متصل بحساب المدير (info@bietalreef.ae)
- تعمل داخل "كمبيوتر وياك" — نظام تشغيل سحابي للوكلاء
- لديك ذاكرة مستمرة عبر الجلسات (thread موحد)
- متصل بـ: Supabase + n8n + OpenAI + GitHub + Cloudflare + Stripe

## بيانات المنصة الحالية (${now})
- إجمالي المستخدمين: ${stats?.total_users ?? '...'}
- تسجيلات اليوم: ${stats?.new_today ?? 0}
- مزودو الخدمات: ${stats?.total_providers ?? 0}
- بانتظار التوثيق: ${stats?.pending_providers ?? 0}
- أنشطة اليوم: ${stats?.activity_today ?? 0}
- رصيد الكوينز: ${stats?.total_wallet_balance ?? 0}

## المواقع المتصلة
${CONNECTED_SITES.map(s => `- ${s.name}: ${s.url}`).join('\n')}

## أدواتك (Functions)
- get_platform_stats: إحصائيات المنصة الحية
- get_providers: قائمة مزودي الخدمات
- open_website: فتح موقع في المتصفح السحابي
- trigger_n8n: تشغيل workflows في n8n — يرسل للـ webhook الحقيقي
- query_database: استعلام مباشر من Supabase
- list_tables: عرض الجداول المتاحة

## كيف تستخدم trigger_n8n:
- workflow: اسم الـ workflow (مثل "Weyaak.MainFlow")
- payload.text: النص الوصفي للمهمة (REQUIRED)
- payload.user_id: معرف المستخدم إن وجد
- مثال: trigger_n8n("Weyaak.MainFlow", { text: "أنشئ تذكرة CRM للعميل أحمد", user_id: "admin" })

## سير عمل n8n المتاح (${N8N_WORKFLOWS.length} workflow)
${N8N_WORKFLOWS.map(w => `- ${w.name}: ${w.desc}`).join('\n')}

## قواعد التواصل
- تحدث بالعربية دائماً
- كل طلب = مهمة قابلة للتنفيذ — استخدم الأدوات مباشرة بدون استئذان
- استخدم trigger_n8n تلقائياً عند أي طلب تنفيذي
- استخدم query_database للرد على أسئلة عن البيانات
- عند فتح موقع، اشرح ماذا ستفعل فيه
- أعطِ توصيات محددة وقابلة للتنفيذ الفوري`;
}

// ── OpenAI with function calling (complete agent loop) ──
export interface AgentResult {
  reply: string;
  toolResults?: Array<{ name: string; result: string }>;
}

export async function callWayakAgent(
  messages: Array<{ role: string; content: string }>,
  apiKey: string,
  onOpenSite?: (url: string) => void,
  stats?: any,
): Promise<AgentResult> {
  const systemMsg = { role: 'system', content: buildSystemPrompt(stats) };
  const fullMessages = [systemMsg, ...messages];

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: fullMessages,
      tools: AGENT_TOOLS,
      tool_choice: 'auto',
      max_tokens: 1200,
      temperature: 0.7,
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
      if (tc.function.name === 'open_website' && args.url) onOpenSite?.(args.url);
      const result = await executeTool(tc.function.name, args, onOpenSite);
      toolResults.push({ name: tc.function.name, result });
      toolMessages.push({ role: 'tool', tool_call_id: tc.id, content: result });
    }

    // Continue with tool results
    const finalRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [...fullMessages, ...toolMessages],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    });
    const finalData = await finalRes.json();
    return { reply: finalData.choices?.[0]?.message?.content || 'تم التنفيذ', toolResults };
  }

  return { reply: choice?.message?.content || 'لا يوجد رد' };
}

// ── Get stored API key ──
export function getStoredApiKey(): string {
  return localStorage.getItem('admin_openai_key')
    || localStorage.getItem('wayak_openai_key')
    || localStorage.getItem('openai_api_key')
    || '';
}
