/**
 * NewHomeContent.tsx — وياك · نظام التشغيل الذكي
 * ════════════════════════════════════════════════════
 * Agent OS — واجهة وكيل تنفيذي بتصميم Frosted Glass مع
 * Session Engine + Sidebar + Dock + inline tools + delegation
 * ════════════════════════════════════════════════════
 */

import { useState, useRef, useEffect, useCallback, lazy, Suspense, startTransition } from 'react';
import {
  Mic, Paperclip,
  HardHat, Calculator, FileText, Palette, MapPin,
  Layers, ArrowUp, Sparkles, Hammer, Wrench,
  ShoppingCart, Globe, Building2, BarChart3,
  Plus, Plug, Loader2,
  CheckCircle, AlertCircle,
  Monitor, X, Image, FileUp, Maximize2,
  Zap, Users, Terminal,
  Store, Star, MessageSquare,
  Shield, Clock, Send,
  Cpu, Activity,
  ChevronDown, RotateCcw,
  Share2, Search, Target, UserCheck,
  Trash2, ChevronLeft,
  MoreHorizontal, Pencil, Pin, Copy,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router@7.1.1';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useEffectiveState } from '../../contexts/EffectiveState';
import { useIntegrations } from '../../contexts/IntegrationContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { supabase } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import wayakCharacterImg from 'figma:asset/c33d475de03bd99055b12c89eb52fa7b9aa3f848.png';
function lazyRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  return fn().catch((err) => {
    if (retries <= 0) throw err;
    return new Promise<T>((resolve) =>
      setTimeout(() => resolve(lazyRetry(fn, retries - 1, delay)), delay)
    );
  });
}
const WayakComputer = lazy(() => lazyRetry(() => import('./WayakComputer').then(m => ({ default: m.WayakComputer }))));

// ═══════════════════════════════════════════
// Typography
// ═══════════════════════════════════════════
const fontCairo = "'Cairo', 'Tajawal', system-ui, sans-serif";
const fontMono  = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace";

const API = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

// ═══════════════════════════════════════════
// OpenAI Fallback (shared thread with WayakComputer)
// ═══════════════════════════════════════════
const WAYAK_THREAD_KEY = 'wayak_main_thread_v1';
const HOME_SYSTEM_PROMPT = `أنت وياك، الوكيل التنفيذي الذكي لمنصة بيت الريف.
مهمتك تحويل كل طلب من المستخدم إلى مهمة قابلة للتنفيذ.
الوكلاء المتاحون: وكيل الحسابات، وكيل SEO، وكيل السوشيال ميديا، وكيل المتصفح.
باقات المنصة: 99/299/599/999 درهم — bietalreef.ae
أجب دائماً بالعربية، مختصر، عملي، موجه للتنفيذ.`;

async function callOpenAIFallback(userText: string): Promise<string | null> {
  try {
    const key = localStorage.getItem('wayak_openai_key') || localStorage.getItem('openai_api_key');
    if (!key) return null;
    let thread: Array<{ role: string; content: string }> = [];
    try {
      const raw = localStorage.getItem(WAYAK_THREAD_KEY);
      if (raw) thread = JSON.parse(raw);
    } catch { /* silent */ }
    thread.push({ role: 'user', content: userText });
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: HOME_SYSTEM_PROMPT }, ...thread.slice(-20)],
        max_tokens: 600,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || null;
    if (reply) {
      thread.push({ role: 'assistant', content: reply });
      localStorage.setItem(WAYAK_THREAD_KEY, JSON.stringify(thread.slice(-40)));
    }
    return reply;
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════
// Quick Suggestion Chips
// ═══════════════════════════════════════════
const CHIPS = [
  { id: 'task',       label: 'كلّف بمهمة تنفيذية',     icon: Zap,          prompt: 'اريد تنفيذ مهمة جديدة',                    color: '#D4AF37' },
  { id: 'accounts',   label: 'تشغيل الحسابات',         icon: UserCheck,    prompt: 'شغّل حساباتي التجارية وتابع العملاء',       color: '#3B5BFE' },
  { id: 'seo',        label: 'تحليل الظهور الرقمي',    icon: Search,       prompt: 'حلل ظهوري في محركات البحث و AI',            color: '#9B51E0' },
  { id: 'competitor', label: 'مراقبة المنافسين',        icon: Target,       prompt: 'راقب نشاط المنافسين وحلل استراتيجياتهم',    color: '#E67E22' },
  { id: 'report',     label: 'تجهيز تقرير احترافي',     icon: FileText,     prompt: 'جهّز لي تقرير اداء شامل',                   color: '#C8A86A' },
  { id: 'connect',    label: 'ربط خدمة جديدة',         icon: Plug,         prompt: 'اريد ربط خدمة او تطبيق جديد',               color: '#3B5BFE' },
  { id: 'trigger',    label: 'اعداد محفّز تلقائي',     icon: Activity,     prompt: 'اعد لي محفز يعمل تلقائيا حسب جدول زمني',    color: '#EF4444' },
];

// ═══════════════════════════════════════════
// Agent Capabilities
// ═══════════════════════════════════════════
const CAPABILITIES = [
  { icon: UserCheck, label: 'وكيل ادارة الحسابات',      labelEn: 'CRM Agent',             desc: 'تشغيل الحسابات ومتابعة العملاء وتحليل الاداء',    descEn: 'Run accounts, follow up clients & analytics',     color: '#D4AF37', agentId: 'agent-accounts' },
  { icon: Search,    label: 'وكيل تحسين SEO',           labelEn: 'SEO Agent',             desc: 'تحليل الظهور في Google و AI وتحسين الترتيب',     descEn: 'Analyze Google & AI visibility, boost rankings',  color: '#3B5BFE', agentId: 'agent-seo' },
  { icon: Share2,    label: 'وكيل التسويق والمحتوى',     labelEn: 'Marketing Agent',       desc: 'ادارة المحتوى والنشر والحملات التسويقية',         descEn: 'Content, publishing & marketing campaigns',       color: '#9B51E0', agentId: 'agent-social' },
  { icon: Target,    label: 'مراقبة المنافسين',          labelEn: 'Competitor Monitor',    desc: 'رصد وتحليل نشاط المنافسين بشكل مستمر',           descEn: 'Continuous competitor activity monitoring',        color: '#E67E22', agentId: 'agent-competitor' },
  { icon: Monitor,   label: 'الحوسبة السحابية',          labelEn: 'Cloud Computer',        desc: 'كمبيوتر سحابي معزول يتصفح وينفذ نيابة عنك',      descEn: 'Isolated cloud computer that browses & executes', color: '#3B5BFE', agentId: 'wayak-computer' },
  { icon: Plug,      label: 'اعداد تكامل جديد',         labelEn: 'New Integration',       desc: 'ربط API او خادم MCP او اي خدمة خارجية',           descEn: 'Connect any API, MCP server, or service',        color: '#C8A86A', agentId: 'agent-integration' },
  { icon: FileText,  label: 'معالجة الملفات والتقارير',  labelEn: 'Files & Reports',       desc: 'انشاء وتحليل وتحويل الملفات والتقارير',           descEn: 'Create, analyze & transform files & reports',    color: '#D4AF37', agentId: 'agent-files' },
  { icon: Activity,  label: 'المحفزات التلقائية',        labelEn: 'Auto Triggers',         desc: 'جدولة مهام وأحداث تعمل تلقائيا بدون تدخل',        descEn: 'Schedule tasks & events that run automatically', color: '#EF4444', agentId: 'agent-triggers' },
];

// ═══════════════════════════════════════════
// Dock Apps
// ═══════════════════════════════════════════
const DOCK_APPS = [
  { id: 'computer',   icon: Monitor,        label: 'كمبيوتر',      route: '/wayak-computer', color: '#D4AF37' },
  { id: 'connectors', icon: Plug,           label: 'الاتصالات',    route: '/connectors',     color: '#3B5BFE' },
  { id: 'services',   icon: Wrench,        label: 'الخدمات',      route: '/services',       color: '#C8A86A' },
  { id: 'tools',      icon: Zap,           label: 'الادوات',      route: '/tools',          color: '#3B5BFE' },
  { id: 'shop',       icon: ShoppingCart,   label: 'المتجر',      route: '/shop',           color: '#9B51E0' },
  { id: 'market',     icon: Store,         label: 'السوق',        route: '/marketplace',    color: '#E67E22' },
  { id: 'messages',   icon: MessageSquare,  label: 'الرسائل',     route: '/messages',       color: '#D4AF37' },
  { id: 'maps',       icon: MapPin,         label: 'الخريطة',     route: '/maps',           color: '#EF4444' },
];

// ═══════════════════════════════════════════
// Types
// ═══════════════════════════════════════════
interface TaskCard {
  id: string;
  status: 'creating' | 'assigning' | 'running' | 'done' | 'failed';
  assignedAgent: string;
  agentColor: string;
  tokensUsed?: number;
  duration?: number;
  steps: Array<{ label: string; done: boolean; active: boolean }>;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'task';
  content: string;
  tools_used?: string[];
  attachments?: AttachedFile[];
  status?: 'sending' | 'executing' | 'done' | 'error';
  steps?: { label: string; status: 'done' | 'running' | 'pending' }[];
  created_at: string;
  task?: TaskCard;
  audioUrl?: string;
}

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  sessionId: string | null;
  agentMode: 'chat' | 'exec' | 'computer';
  created_at: string;
  updated_at: string;
}

// ═══════════════════════════════════════════
// Auth Helper
// ═══════════════════════════════════════════
async function getToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

// ── Google API helpers (real data for GSC/Analytics) ──────────────
const GSC_INTENT = /سيرش كنسول|search.?console|كلمات البحث|استفسارات|queries|ترتيب الموقع|نتائج البحث|clicks|impressions|ظهور الموقع|أداء البحث|seo تقرير|تقرير seo/i;
const GA_INTENT  = /analytics|تحليل|زوار|الزوار|visitors|sessions|جلسات|traffic|من أين|مصادر الزوار|pageview|صفحات مشاهدة|google analytics/i;

async function fetchGSCData(token: string, siteUrl: string): Promise<string> {
  try {
    const endDate   = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 28 * 864e5).toISOString().split('T')[0];
    const res = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate, dimensions: ['query'], rowLimit: 10 }) }
    );
    if (!res.ok) return `GSC error ${res.status}`;
    const data = await res.json();
    const rows: Array<{ keys: string[]; clicks: number; impressions: number; position: number }> = data.rows ?? [];
    if (!rows.length) return 'لا توجد بيانات GSC للفترة المحددة.';
    const totals = rows.reduce((a, r) => ({ c: a.c + r.clicks, i: a.i + r.impressions }), { c: 0, i: 0 });
    const summary = rows.slice(0, 10).map((r, i) =>
      `${i + 1}. "${r.keys[0]}" — ${r.clicks} نقرة | ${r.impressions} ظهور | ترتيب ${r.position.toFixed(1)}`
    ).join('\n');
    return `📊 Search Console (آخر 28 يوم):\nإجمالي: ${totals.c} نقرة | ${totals.i} ظهور\n\n${summary}`;
  } catch (e) { return `GSC error: ${String(e)}`; }
}

async function fetchAnalyticsData(token: string, propertyId: string): Promise<string> {
  try {
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
          metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'screenPageViews' }],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }], limit: 8,
        }) }
    );
    if (!res.ok) return `Analytics error ${res.status}`;
    const data = await res.json();
    const rows = data.rows ?? [];
    if (!rows.length) return 'لا توجد بيانات Analytics.';
    const totals = rows.reduce((a: { s: number; u: number }, r: { metricValues: Array<{ value: string }> }) => ({ s: a.s + Number(r.metricValues[0].value), u: a.u + Number(r.metricValues[1].value) }), { s: 0, u: 0 });
    const channels = rows.slice(0, 6).map((r: { dimensionValues: Array<{ value: string }>; metricValues: Array<{ value: string }> }) =>
      `• ${r.dimensionValues[0].value}: ${r.metricValues[0].value} جلسة`
    ).join('\n');
    return `📈 Google Analytics (آخر 28 يوم):\nجلسات: ${totals.s.toLocaleString('ar')} | مستخدمون: ${totals.u.toLocaleString('ar')}\n\nالمصادر:\n${channels}`;
  } catch (e) { return `Analytics error: ${String(e)}`; }
}

// ═══════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════
export function NewHomeContent() {
  const { language } = useTranslation('home');
  const { isDark } = useTheme();
  const { state } = useEffectiveState();
  const { integrations, connectTool, setStatus } = useIntegrations();
  const { isMobile, isTablet } = useBreakpoint();
  const navigate = useNavigate();
  const isEn = language === 'en';

  const [inputText, setInputText]       = useState('');
  const [isFocused, setIsFocused]       = useState(false);
  const [isRecording, setIsRecording]   = useState(false);
  const [connectedCount, setConnectedCount] = useState(0);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId]       = useState<string | null>(null);
  const [isChatMode, setIsChatMode]     = useState(false);
  const [isSending, setIsSending]       = useState(false);
  const [totalTokens, setTotalTokens]   = useState(0);
  const [tokenLimit]                    = useState(10000);

  // Agent mode: chat | exec | computer
  const [chatMode, setChatMode] = useState<'chat' | 'exec' | 'computer'>('chat');

  // Sidebar state
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => isTablet || isMobile);
  const [chatHistory, setChatHistory]   = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('wayak_chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [contextMenuChatId, setContextMenuChatId] = useState<string | null>(null);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [pinnedChats, setPinnedChats] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wayak_pinned_chats');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // ── Connect Service Preview ─────────────────────────────────────
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewConnKey, setPreviewConnKey] = useState<IntegrationKey | null>(null);
  const [previewStep, setPreviewStep] = useState<'list' | 'connecting' | 'done'>('list');

  // Computer & Attachments
  const [showComputer, setShowComputer] = useState(false);
  const [computerFullScreen, setComputerFullScreen] = useState(false);
  const [computerInitialWindow, setComputerInitialWindow] = useState<string | undefined>(undefined);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Voice Recording ──
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const duration = recordingTime;

        // Add as voice message
        const voiceMsg: ChatMessage = {
          id: `voice_${Date.now()}`,
          role: 'user',
          content: `🎙️ رسالة صوتية (${duration} ثانية)`,
          audioUrl,
          status: 'sent',
          created_at: new Date().toISOString(),
        };
        setChatHistory(prev => [...prev, voiceMsg]);
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch {
      alert(isEn ? 'Microphone access denied' : 'تم رفض الوصول للميكروفون');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
      audioChunksRef.current = [];
      setIsRecording(false);
      setRecordingTime(0);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  // Persist chat history & pinned
  useEffect(() => {
    localStorage.setItem('wayak_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);
  useEffect(() => {
    localStorage.setItem('wayak_pinned_chats', JSON.stringify(pinnedChats));
  }, [pinnedChats]);

  // Auto-grow textarea
  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = 'auto';
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 180)}px`;
  }, [inputText]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Fetch connected connector count
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch(`${API}/agent/skills`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-User-Token': token,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setConnectedCount(data.total_connected || 0);
        }
      } catch { /* ignore */ }
    })();
  }, []);

  // Save current chat to history
  const saveCurrentChat = useCallback((msgs: ChatMessage[], sid: string | null, chatId?: string, mode?: 'chat' | 'exec' | 'computer') => {
    if (msgs.length === 0) return;
    const firstUserMsg = msgs.find(m => m.role === 'user');
    const title = firstUserMsg?.content.slice(0, 60) || (isEn ? 'New Chat' : 'محادثة جديدة');
    const now = new Date().toISOString();
    const id = chatId || activeChatId || `chat_${Date.now()}`;

    setChatHistory(prev => {
      const existing = prev.findIndex(c => c.id === id);
      const session: ChatSession = {
        id,
        title,
        messages: msgs,
        sessionId: sid,
        agentMode: mode ?? prev.find(c => c.id === id)?.agentMode ?? 'chat',
        created_at: existing >= 0 ? prev[existing].created_at : now,
        updated_at: now,
      };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = session;
        return updated;
      }
      return [session, ...prev];
    });
    return id;
  }, [activeChatId, isEn]);

  // Send message to agent
  const handleSend = useCallback(async (text = inputText) => {
    if (!text.trim()) return;
    const trimmed = text.trim();
    setInputText('');

    setIsSending(true);

    // If not in chat mode, create new chat
    const isNewChat = !isChatMode;
    setIsChatMode(true);

    const userMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      role: 'user',
      content: trimmed,
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
      created_at: new Date().toISOString(),
    };

    // ── Connect Service Intent ─────────────────────────────────────
    const CONNECT_RE = /ربط|اربط|connect|خدمة|موصل|integration|وصّل|واتساب|whatsapp|google|جوجل|analytics|maps|خرائط|سوشيال|social|domain|نطاق/i;
    if (CONNECT_RE.test(trimmed)) {
      let preselect: IntegrationKey | null = null;
      if (/واتساب|whatsapp/i.test(trimmed))            preselect = 'whatsapp';
      else if (/analytics|تحليلات/i.test(trimmed))    preselect = 'analytics';
      else if (/search.?console|سيرش/i.test(trimmed)) preselect = 'searchConsole';
      else if (/maps|خرائط/i.test(trimmed))           preselect = 'maps';
      else if (/social|سوشيال/i.test(trimmed))        preselect = 'social';
      else if (/domain|نطاق/i.test(trimmed))          preselect = 'domain';
      else if (/google|جوجل/i.test(trimmed))          preselect = 'google';

      const selectedName = preselect ? integrations.find(i => i.key === preselect)?.nameAr : null;
      const agentReply: ChatMessage = {
        id: `ca_${Date.now()}`, role: 'agent',
        content: selectedName
          ? `سأساعدك في ربط **${selectedName}**. اضغط "ربط" في اللوحة ${isMobile ? 'أعلاه' : 'المجاورة'} لبدء الإعداد.`
          : `سأساعدك في ربط خدمة جديدة. اختر الخدمة من قائمة الموصلات.`,
        status: 'done', created_at: new Date().toISOString(),
      };
      const newMsgs = [...chatMessages, userMsg, agentReply];
      setChatMessages(newMsgs);
      setAttachedFiles([]);
      if (isNewChat) {
        const newId = `chat_${Date.now()}`;
        setActiveChatId(newId);
        saveCurrentChat(newMsgs, sessionId, newId);
      } else {
        saveCurrentChat(newMsgs, sessionId);
      }
      setPreviewOpen(true);
      setPreviewStep('list');
      setPreviewConnKey(preselect);
      setIsSending(false);
      return;
    }

    // ── Task card ─────────────────────────────────────────────────
    const taskId = `TSK-${Math.floor(1000 + Math.random() * 9000)}`;
    const startTime = Date.now();
    const agentRoutes: Array<{ keywords: string[]; name: string; color: string }> = [
      { keywords: ['حلّل','تحليل','أداء','بيانات','تقرير','إحصائيات'], name: 'وكيل التحليل', color: '#6366f1' },
      { keywords: ['اكتب','محتوى','منشور','إنستغرام','تيك توك','سوشيال','تسويق'], name: 'وكيل المحتوى', color: '#ec4899' },
      { keywords: ['كلمات','سيو','seo','بحث','ظهور','جوجل','google'], name: 'وكيل السيو', color: '#10b981' },
      { keywords: ['افتح','تصفح','الموقع','بيت الريف','bietalreef'], name: 'وكيل المتصفح', color: '#3b82f6' },
      { keywords: ['منافس','مراقبة','مراقب','competitor'], name: 'وكيل المنافسين', color: '#f97316' },
      { keywords: ['ربط','خدمة','تكامل','api','مزود'], name: 'وكيل التكامل', color: '#a855f7' },
    ];
    const lower = trimmed.toLowerCase();
    const matched = agentRoutes.find(r => r.keywords.some(k => lower.includes(k.toLowerCase())));
    const agentName = matched?.name ?? 'وياك العام';
    const agentColor = matched?.color ?? '#D4AF37';

    const taskMsgId = `task-${Date.now()}`;
    const taskMsg: ChatMessage = {
      id: taskMsgId, role: 'task', content: '', created_at: new Date().toISOString(),
      task: {
        id: taskId, status: 'creating', assignedAgent: agentName, agentColor,
        steps: [
          { label: 'إنشاء المهمة', done: false, active: true },
          { label: 'تكليف الوكيل', done: false, active: false },
          { label: 'تنفيذ المهمة', done: false, active: false },
          { label: 'مكتمل', done: false, active: false },
        ],
      },
    };

    const newMessages = [...chatMessages, userMsg, taskMsg];
    setChatMessages(newMessages);
    setAttachedFiles([]);

    // Create/update chat in history
    if (isNewChat) {
      const newId = `chat_${Date.now()}`;
      setActiveChatId(newId);
      saveCurrentChat(newMessages, sessionId, newId);
    } else {
      saveCurrentChat(newMessages, sessionId);
    }

    // Animated steps
    setTimeout(() => setChatMessages(p => p.map(m => m.id === taskMsgId ? { ...m, task: { ...m.task!, status: 'assigning', steps: [
      { label: 'إنشاء المهمة', done: true, active: false }, { label: 'تكليف الوكيل', done: false, active: true },
      { label: 'تنفيذ المهمة', done: false, active: false }, { label: 'مكتمل', done: false, active: false },
    ]}} : m)), 600);
    setTimeout(() => setChatMessages(p => p.map(m => m.id === taskMsgId ? { ...m, task: { ...m.task!, status: 'running', steps: [
      { label: 'إنشاء المهمة', done: true, active: false }, { label: 'تكليف الوكيل', done: true, active: false },
      { label: 'تنفيذ المهمة', done: false, active: true }, { label: 'مكتمل', done: false, active: false },
    ]}} : m)), 1300);

    // ── GSC / Analytics: inject real data as context ───────────────
    let toolContext = '';
    const gscInt      = integrations.find(i => i.key === 'searchConsole');
    const analyticsInt = integrations.find(i => i.key === 'analytics');
    if (GSC_INTENT.test(trimmed) && gscInt?.status === 'connected' && gscInt.metadata?.token) {
      const siteUrl = gscInt.metadata?.siteUrl ?? 'https://app.bietalreef.ae/';
      toolContext += '\n\n' + await fetchGSCData(gscInt.metadata.token, siteUrl);
    }
    if (GA_INTENT.test(trimmed) && analyticsInt?.status === 'connected' && analyticsInt.metadata?.token && analyticsInt.metadata?.propertyId) {
      toolContext += '\n\n' + await fetchAnalyticsData(analyticsInt.metadata.token, analyticsInt.metadata.propertyId);
    }

    try {
      const token = await getToken();
      if (!token) {
        navigate('/home', { state: { initialMessage: trimmed } });
        return;
      }

      const res = await fetch(`${API}/agent/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': token,
        },
        body: JSON.stringify({ message: trimmed, session_id: sessionId }),
      });

      const tokensUsed = Math.max(80, Math.round(trimmed.length * 0.6) + Math.floor(120 + Math.random() * 280));
      const duration = Math.round((Date.now() - startTime) / 1000);
      const doneSteps = [
        { label: 'إنشاء المهمة', done: true, active: false }, { label: 'تكليف الوكيل', done: true, active: false },
        { label: 'تنفيذ المهمة', done: true, active: false }, { label: 'مكتمل', done: true, active: false },
      ];

      if (res.ok) {
        const data = await res.json();
        setSessionId(data.session_id);
        setTotalTokens(t => t + tokensUsed);
        const agentMsg: ChatMessage = {
          id: data.response.id, role: 'agent',
          content: data.response.content, tools_used: data.connected_tools,
          status: 'done', created_at: data.response.created_at,
        };
        setChatMessages(p => {
          const withDone = p.map(m => m.id === taskMsgId ? { ...m, task: { ...m.task!, status: 'done' as const, tokensUsed, duration, steps: doneSteps }} : m);
          return [...withDone, agentMsg];
        });
        saveCurrentChat([...newMessages, agentMsg], data.session_id);
      } else {
        // Try OpenAI fallback before showing error
        const aiReply = await callOpenAIFallback(trimmed);
        if (aiReply) {
          const agentMsg: ChatMessage = {
            id: `ai_${Date.now()}`, role: 'agent',
            content: aiReply, status: 'done', created_at: new Date().toISOString(),
          };
          setChatMessages(p => {
            const withDone = p.map(m => m.id === taskMsgId ? { ...m, task: { ...m.task!, status: 'done' as const, tokensUsed, duration, steps: doneSteps }} : m);
            return [...withDone, agentMsg];
          });
          saveCurrentChat([...newMessages, agentMsg], sessionId);
        } else {
          const err = await res.json().catch(() => ({}));
          const errMsg: ChatMessage = { id: `err_${Date.now()}`, role: 'agent', content: err.error || 'حدث خطأ في معالجة الطلب.', status: 'error', created_at: new Date().toISOString() };
          setChatMessages(p => {
            const withFail = p.map(m => m.id === taskMsgId ? { ...m, task: { ...m.task!, status: 'failed' as const }} : m);
            return [...withFail, errMsg];
          });
          saveCurrentChat(newMessages, sessionId);
        }
      }
    } catch {
      // Try OpenAI fallback on network error too
      const aiReply = await callOpenAIFallback(trimmed);
      if (aiReply) {
        const tokensUsed2 = Math.max(80, Math.round(trimmed.length * 0.6) + 200);
        const dur2 = Math.round((Date.now() - startTime) / 1000);
        const doneSteps2 = [
          { label: 'إنشاء المهمة', done: true, active: false }, { label: 'تكليف الوكيل', done: true, active: false },
          { label: 'تنفيذ المهمة', done: true, active: false }, { label: 'مكتمل', done: true, active: false },
        ];
        const agentMsg: ChatMessage = {
          id: `ai_${Date.now()}`, role: 'agent',
          content: aiReply, status: 'done', created_at: new Date().toISOString(),
        };
        setChatMessages(p => {
          const withDone = p.map(m => m.id === taskMsgId ? { ...m, task: { ...m.task!, status: 'done' as const, tokensUsed: tokensUsed2, duration: dur2, steps: doneSteps2 }} : m);
          return [...withDone, agentMsg];
        });
        saveCurrentChat([...newMessages, agentMsg], sessionId);
      } else {
        const errMsg: ChatMessage = { id: `err_${Date.now()}`, role: 'agent', content: 'فشل الاتصال. أضف مفتاح OpenAI في إعدادات كمبيوتر وياك لتفعيل الرد الفوري.', status: 'error', created_at: new Date().toISOString() };
        setChatMessages(p => {
          const withFail = p.map(m => m.id === taskMsgId ? { ...m, task: { ...m.task!, status: 'failed' as const }} : m);
          return [...withFail, errMsg];
        });
        saveCurrentChat(newMessages, sessionId);
      }
    } finally {
      setIsSending(false);
    }
  }, [inputText, sessionId, navigate, attachedFiles, isChatMode, chatMessages, saveCurrentChat, integrations]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ═══ Auto-send task from ShopScreen / DashboardScreen via sessionStorage ═══
  const autoTaskFiredRef = useRef(false);
  useEffect(() => {
    if (autoTaskFiredRef.current) return;
    try {
      const stored = sessionStorage.getItem('weyaak_initial_task');
      if (stored) {
        const parsed = JSON.parse(stored);
        const task: string = parsed.initialTask;
        if (task) {
          autoTaskFiredRef.current = true;
          sessionStorage.removeItem('weyaak_initial_task');
          // delay so component is fully mounted before sending
          setTimeout(() => handleSend(task), 400);
        }
      }
    } catch { /* silent */ }
  }, [handleSend]);

  // File attachment handlers
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: AttachedFile[] = Array.from(files).map(file => ({
      id: `file_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));
    setAttachedFiles(prev => [...prev, ...newFiles]);
    setShowAttachMenu(false);
    e.target.value = '';
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Start new session → clear chat + thread
  const startNewSession = useCallback(() => {
    setChatMessages([]);
    setSessionId(null);
    setIsChatMode(false);
    setInputText('');
    setActiveChatId(null);
    try { localStorage.removeItem(WAYAK_THREAD_KEY); } catch { /* silent */ }
  }, []);

  // Load a saved chat from sidebar
  const loadChat = useCallback((chat: ChatSession) => {
    setChatMessages(chat.messages);
    setSessionId(chat.sessionId);
    setActiveChatId(chat.id);
    setIsChatMode(true);
    setSidebarOpen(false);
  }, []);

  // Delete a chat from history
  const deleteChat = useCallback((chatId: string) => {
    setChatHistory(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) {
      startNewSession();
    }
  }, [activeChatId, startNewSession]);

  // Rename a chat
  const renameChat = useCallback((chatId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setChatHistory(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle.trim() } : c));
    setRenamingChatId(null);
    setRenameValue('');
  }, []);

  // Toggle pin
  const togglePin = useCallback((chatId: string) => {
    setPinnedChats(prev => prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]);
    setContextMenuChatId(null);
  }, []);

  // Connect an integration — navigate to connectors page for real OAuth
  const handleConnectIntegration = useCallback((key: IntegrationKey) => {
    const integration = integrations.find(i => i.key === key);
    if (!integration || integration.status === 'connected') return;
    // Navigate to real connectors page for actual OAuth/API connection
    navigate('/connectors');
  }, [integrations, navigate]);

  // Copy first message
  const copyChat = useCallback((chat: ChatSession) => {
    const text = chat.messages.map(m => `${m.role === 'user' ? '>' : 'وياك:'} ${m.content}`).join('\n\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setContextMenuChatId(null);
  }, []);

  // Group chats by time
  const groupChats = useCallback((chats: ChatSession[]) => {
    const now = Date.now();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);

    const pinned: ChatSession[] = [];
    const todayChats: ChatSession[] = [];
    const yesterdayChats: ChatSession[] = [];
    const thisWeekChats: ChatSession[] = [];
    const olderChats: ChatSession[] = [];

    chats.forEach(chat => {
      if (pinnedChats.includes(chat.id)) { pinned.push(chat); return; }
      const d = new Date(chat.updated_at).getTime();
      if (d >= today.getTime()) todayChats.push(chat);
      else if (d >= yesterday.getTime()) yesterdayChats.push(chat);
      else if (d >= weekAgo.getTime()) thisWeekChats.push(chat);
      else olderChats.push(chat);
    });

    const groups: { label: string; chats: ChatSession[] }[] = [];
    if (pinned.length) groups.push({ label: isEn ? 'Pinned' : 'مثبّتة', chats: pinned });
    if (todayChats.length) groups.push({ label: isEn ? 'Today' : 'اليوم', chats: todayChats });
    if (yesterdayChats.length) groups.push({ label: isEn ? 'Yesterday' : 'امس', chats: yesterdayChats });
    if (thisWeekChats.length) groups.push({ label: isEn ? 'This Week' : 'هذا الاسبوع', chats: thisWeekChats });
    if (olderChats.length) groups.push({ label: isEn ? 'Earlier' : 'سابقا', chats: olderChats });
    return groups;
  }, [pinnedChats, isEn]);

  // Filtered and grouped chats
  const filteredHistory = sidebarSearch.trim()
    ? chatHistory.filter(c => c.title.includes(sidebarSearch) || c.messages.some(m => m.content.includes(sidebarSearch)))
    : chatHistory;
  const chatGroups = groupChats(filteredHistory);

  // Open agent in computer
  const openAgentInComputer = useCallback((agentId: string) => {
    setComputerInitialWindow(agentId);
    startTransition(() => {
      setShowComputer(true);
      setComputerFullScreen(true);
    });
  }, []);

  // Greeting
  const hour = new Date().getHours();
  const greeting = isEn
    ? (hour < 6 ? 'Good evening' : hour < 12 ? 'Good morning' : hour < 17 ? 'Hello' : 'Good evening')
    : (hour < 6 ? 'مساء الخير' : hour < 12 ? 'صباح الخير' : hour < 17 ? 'مرحبا' : 'مساء الخير');
  const firstName = state.name?.split(' ')[0] || '';

  // ═══════════════════════════════════════════
  // Theme Palette — Refined Frosted Glass
  // ═══════════════════════════════════════════
  const t = {
    pageBg:    isDark ? '#07080D' : '#F5F6FA',
    glass:     isDark ? 'rgba(255,255,255,0.028)' : 'rgba(255,255,255,0.95)',
    glassBdr:  isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)',
    glassHov:  isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
    text:      isDark ? '#F2F4F8' : '#0F172A',
    textSub:   isDark ? 'rgba(255,255,255,0.50)' : 'rgba(15,23,42,0.55)',
    textMuted: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(15,23,42,0.28)',
    inputBg:   isDark ? 'rgba(255,255,255,0.035)' : '#FFFFFF',
    inputBdr:  isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.10)',
    chipBg:    isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
    chipBdr:   isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)',
    gold:      '#D4AF37',
    goldSoft:  isDark ? 'rgba(212,175,55,0.10)' : 'rgba(212,175,55,0.08)',
    blue:      '#3B5BFE',
    blueSoft:  isDark ? 'rgba(59,91,254,0.10)' : 'rgba(59,91,254,0.06)',
    purple:    '#9B51E0',
    purpleSoft: isDark ? 'rgba(155,81,224,0.10)' : 'rgba(155,81,224,0.06)',
    userBubble: isDark
      ? 'linear-gradient(135deg, rgba(59,91,254,0.12), rgba(59,91,254,0.05))'
      : 'linear-gradient(135deg, rgba(59,91,254,0.08), rgba(59,91,254,0.03))',
    agentBubble: isDark
      ? 'rgba(255,255,255,0.025)'
      : '#FFFFFF',
    cardBg: isDark
      ? 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))'
      : '#FFFFFF',
    cardShadow: isDark
      ? 'none'
      : '0 1px 3px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.03)',
    sidebarBg: isDark ? '#0A0C14' : '#FFFFFF',
    sidebarBdr: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.08)',
  };

  // Format relative time for sidebar
  const formatRelativeTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return isEn ? 'Just now' : 'الان';
    if (mins < 60) return isEn ? `${mins}m ago` : `منذ ${mins} د`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return isEn ? `${hrs}h ago` : `منذ ${hrs} س`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return isEn ? `${days}d ago` : `منذ ${days} ي`;
    return new Date(dateStr).toLocaleDateString('ar-AE', { month: 'short', day: 'numeric' });
  };

  // Sidebar width helper
  const SB_W = isMobile ? 0 : sidebarCollapsed ? 64 : 260;

  // ─── Connector Preview Panel ────────────────────────────────────
  function renderConnectorPreview() {
    const connItem = previewConnKey ? integrations.find(i => i.key === previewConnKey) : null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: isDark ? '#0A0C14' : '#FFFFFF' }}>
        {/* Header */}
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${t.glassBdr}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(59,91,254,0.10)', border: '1px solid rgba(59,91,254,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plug style={{ width: 15, height: 15, color: t.blue }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: fontCairo, fontSize: 13.5, fontWeight: 800, color: t.text }}>ربط خدمة</p>
            <p style={{ fontFamily: fontCairo, fontSize: 10.5, color: t.textSub }}>
              {`${integrations.filter(i => i.status === 'connected').length} / ${integrations.length} متصل`}
            </p>
          </div>
          <button onClick={() => setPreviewOpen(false)} style={{ width: 28, height: 28, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X style={{ width: 14, height: 14, color: t.textSub }} />
          </button>
        </div>

        {/* List */}
        {previewStep === 'list' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
            {integrations.map(intg => (
              <div key={intg.key}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, marginBottom: 4,
                  background: previewConnKey === intg.key ? (isDark ? 'rgba(59,91,254,0.08)' : 'rgba(59,91,254,0.04)') : 'transparent',
                  border: `1px solid ${previewConnKey === intg.key ? 'rgba(59,91,254,0.2)' : t.glassBdr}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onClick={() => setPreviewConnKey(intg.key)}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{intg.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: fontCairo, fontSize: 12.5, fontWeight: 700, color: t.text }}>{intg.nameAr}</p>
                  <p style={{ fontFamily: fontCairo, fontSize: 10.5, color: t.textSub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{intg.descriptionAr}</p>
                </div>
                {intg.status === 'connected' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, background: 'rgba(22,163,74,0.10)', border: '1px solid rgba(22,163,74,0.25)', flexShrink: 0 }}>
                    <CheckCircle style={{ width: 11, height: 11, color: '#16A34A' }} />
                    <span style={{ fontFamily: fontCairo, fontSize: 10, fontWeight: 700, color: '#16A34A' }}>متصل</span>
                  </div>
                ) : (
                  <button
                    onClick={e => { e.stopPropagation(); handleConnectIntegration(intg.key); }}
                    style={{
                      padding: '5px 13px', borderRadius: 8, border: 'none', flexShrink: 0,
                      background: 'linear-gradient(135deg, #D4AF37, #C49B20)',
                      color: '#000', fontFamily: fontCairo, fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                    }}
                  >ربط</button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No more fake connecting/done animations — real connection happens in /connectors */}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex', height: '100dvh', width: '100%', overflow: 'hidden',
        background: t.pageBg, fontFamily: fontCairo, direction: 'rtl',
        position: 'relative',
      }}
    >
      {/* ══════════════════════════════════════
          AMBIENT GLOW — Background
      ══════════════════════════════════════ */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div style={{ position: 'absolute', top: '-20%', right: '-15%', width: 700, height: 700, borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(59,91,254,0.07) 0%, transparent 60%)' : 'radial-gradient(circle, rgba(59,91,254,0.04) 0%, transparent 60%)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-15%', width: 600, height: 600, borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(155,81,224,0.05) 0%, transparent 60%)' : 'radial-gradient(circle, rgba(155,81,224,0.03) 0%, transparent 60%)', filter: 'blur(100px)' }} />
      </div>

      {/* ══════════════════════════════════════
          MOBILE OVERLAY (when sidebar open)
      ══════════════════════════════════════ */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* ══════════════════════════════════════
          LEFT SIDEBAR — Chat History + Nav
      ══════════════════════════════════════ */}
      <aside
        style={{
          position: isMobile ? 'fixed' : 'relative',
          top: 0, right: isMobile ? 0 : undefined, left: isMobile ? undefined : 0,
          height: '100%', zIndex: 51,
          width: isMobile ? 280 : SB_W,
          transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(110%)') : 'none',
          transition: isMobile ? 'transform 0.27s cubic-bezier(0.16,1,0.3,1)' : 'width 0.22s ease',
          display: 'flex', flexDirection: 'column',
          background: t.sidebarBg,
          borderLeft: isMobile ? `1px solid ${t.sidebarBdr}` : 'none',
          borderRight: isMobile ? 'none' : `1px solid ${t.sidebarBdr}`,
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {/* ── Sidebar Header ── */}
        <div style={{
          padding: sidebarCollapsed && !isMobile ? '16px 8px' : '16px 14px',
          borderBottom: `1px solid ${t.sidebarBdr}`,
          display: 'flex', alignItems: 'center',
          justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'space-between',
          gap: 8, flexShrink: 0,
        }}>
          {(!sidebarCollapsed || isMobile) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: t.goldSoft, border: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={wayakCharacterImg} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: t.text, fontFamily: fontCairo, whiteSpace: 'nowrap' }}>وكلاء وياك</p>
                <p style={{ fontSize: 10, color: t.textSub, fontFamily: fontCairo }}>{chatHistory.length} جلسة</p>
              </div>
            </div>
          )}
          {sidebarCollapsed && !isMobile && (
            <div style={{ width: 32, height: 32, borderRadius: 10, background: t.goldSoft, border: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={wayakCharacterImg} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
            </div>
          )}
          {(!sidebarCollapsed || isMobile) && (
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => isMobile ? setSidebarOpen(false) : setSidebarCollapsed(true)}
              style={{ width: 28, height: 28, borderRadius: 8, background: t.chipBg, border: `1px solid ${t.chipBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
            >
              <ChevronLeft style={{ width: 14, height: 14, color: t.textSub, transform: isMobile ? 'rotate(180deg)' : 'none' }} />
            </motion.button>
          )}
          {sidebarCollapsed && !isMobile && (
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => setSidebarCollapsed(false)}
              style={{ width: 28, height: 28, borderRadius: 8, background: t.chipBg, border: `1px solid ${t.chipBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ChevronLeft style={{ width: 14, height: 14, color: t.textSub, transform: 'rotate(180deg)' }} />
            </motion.button>
          )}
        </div>

        {/* ── Active Agent Badge ── */}
        {(!sidebarCollapsed || isMobile) && (
          <div style={{ padding: '8px 12px 4px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 12, background: isDark ? 'rgba(212,175,55,0.06)' : 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <div style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageSquare style={{ width: 13, height: 13, color: t.gold }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: t.gold, fontFamily: fontCairo }}>وكيل الدردشة</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#16A34A', flexShrink: 0 }} />
                  <p style={{ fontSize: 9.5, color: t.textSub, fontFamily: fontCairo }}>نشط · جاهز للمحادثة</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── New Chat Button ── */}
        <div style={{ padding: sidebarCollapsed && !isMobile ? '10px 8px' : '10px 12px', flexShrink: 0 }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => { startNewSession(); setSidebarOpen(false); }}
            style={{
              width: '100%', padding: sidebarCollapsed && !isMobile ? '10px 0' : '10px 14px',
              borderRadius: 12, background: isDark ? 'rgba(212,175,55,0.09)' : 'rgba(212,175,55,0.07)',
              border: '1px solid rgba(212,175,55,0.20)',
              display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start', gap: 8, cursor: 'pointer',
            }}
          >
            <Plus style={{ width: 15, height: 15, color: t.gold, flexShrink: 0 }} />
            {(!sidebarCollapsed || isMobile) && (
              <span style={{ fontSize: 12.5, fontWeight: 700, color: t.gold, fontFamily: fontCairo }}>محادثة جديدة</span>
            )}
          </motion.button>
        </div>

        {/* ── Search (expanded only) ── */}
        {(!sidebarCollapsed || isMobile) && (
          <div style={{ padding: '4px 12px 8px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px', borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.03)', border: `1px solid ${t.sidebarBdr}` }}>
              <Search style={{ width: 13, height: 13, color: t.textMuted, flexShrink: 0 }} />
              <input value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)}
                placeholder="بحث في المحادثات..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: t.text, fontFamily: fontCairo }} />
              {sidebarSearch && (
                <button onClick={() => setSidebarSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <X style={{ width: 11, height: 11, color: t.textMuted }} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Chat History List ── */}
        {(!sidebarCollapsed || isMobile) ? (
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 8px' }} onClick={() => setContextMenuChatId(null)}>
            {filteredHistory.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 40, gap: 10 }}>
                <MessageSquare style={{ width: 28, height: 28, color: t.textMuted }} />
                <p style={{ fontSize: 12, color: t.textSub, fontFamily: fontCairo, textAlign: 'center' }}>
                  {sidebarSearch ? 'لا توجد نتائج' : 'لا توجد محادثات بعد'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {chatGroups.map(group => (
                  <div key={group.label}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 6px 5px' }}>
                      {group.label === 'مثبّتة' && <Pin style={{ width: 10, height: 10, color: t.gold, transform: 'rotate(-45deg)' }} />}
                      <span style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, fontFamily: fontCairo, textTransform: 'uppercase' }}>{group.label}</span>
                      <div style={{ flex: 1, height: 1, background: t.sidebarBdr }} />
                    </div>
                    {group.chats.map(chat => (
                      <div key={chat.id} style={{ position: 'relative' }}>
                        <motion.div whileHover={{ scale: 1.005 }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 12,
                            background: activeChatId === chat.id ? (isDark ? 'rgba(212,175,55,0.06)' : 'rgba(212,175,55,0.05)') : 'transparent',
                            border: activeChatId === chat.id ? '1px solid rgba(212,175,55,0.12)' : '1px solid transparent',
                            cursor: 'pointer', transition: 'all 0.12s',
                          }}
                          onClick={() => loadChat(chat)}
                          onMouseEnter={e => { if (activeChatId !== chat.id) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(15,23,42,0.02)'; }}
                          onMouseLeave={e => { if (activeChatId !== chat.id) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: activeChatId === chat.id ? (isDark ? 'rgba(212,175,55,0.10)' : 'rgba(212,175,55,0.08)') : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.03)'), border: `1px solid ${activeChatId === chat.id ? 'rgba(212,175,55,0.15)' : t.sidebarBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MessageSquare style={{ width: 13, height: 13, color: activeChatId === chat.id ? t.gold : t.textSub }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {renamingChatId === chat.id ? (
                              <input autoFocus value={renameValue} onChange={e => setRenameValue(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') renameChat(chat.id, renameValue); if (e.key === 'Escape') { setRenamingChatId(null); setRenameValue(''); } }}
                                onBlur={() => renameChat(chat.id, renameValue)} onClick={e => e.stopPropagation()}
                                style={{ width: '100%', fontSize: 12, fontWeight: 600, color: t.text, fontFamily: fontCairo, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)', border: `1.5px solid ${t.gold}`, borderRadius: 7, padding: '3px 7px', outline: 'none' }} />
                            ) : (
                              <p style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: fontCairo, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.title}</p>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 9, fontWeight: 700, color: chat.agentMode === 'exec' ? '#8B5CF6' : chat.agentMode === 'computer' ? t.blue : t.gold, background: chat.agentMode === 'exec' ? 'rgba(139,92,246,0.10)' : chat.agentMode === 'computer' ? t.blueSoft : t.goldSoft, padding: '1px 6px', borderRadius: 5, fontFamily: fontCairo }}>
                                {chat.agentMode === 'exec' ? 'تنفيذ' : chat.agentMode === 'computer' ? 'كمبيوتر' : 'دردشة'}
                              </span>
                              <span style={{ fontSize: 9.5, color: t.textMuted, fontFamily: fontCairo }}>{formatRelativeTime(chat.updated_at)}</span>
                            </div>
                          </div>
                          {pinnedChats.includes(chat.id) && <Pin style={{ width: 10, height: 10, color: t.gold, flexShrink: 0, transform: 'rotate(-45deg)', opacity: 0.6 }} />}
                          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
                            onClick={e => { e.stopPropagation(); setContextMenuChatId(contextMenuChatId === chat.id ? null : chat.id); }}
                            style={{ width: 26, height: 26, borderRadius: 7, background: contextMenuChatId === chat.id ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)') : 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, opacity: contextMenuChatId === chat.id ? 1 : 0.3, transition: 'opacity 0.12s' }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={e => { if (contextMenuChatId !== chat.id) e.currentTarget.style.opacity = '0.3'; }}
                          >
                            <MoreHorizontal style={{ width: 13, height: 13, color: t.textSub }} />
                          </motion.button>
                        </motion.div>
                        {/* Context Menu */}
                        <AnimatePresence>
                          {contextMenuChatId === chat.id && (
                            <motion.div initial={{ opacity: 0, y: -5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.95 }} transition={{ duration: 0.13 }}
                              onClick={e => e.stopPropagation()}
                              style={{ position: 'absolute', top: '100%', left: 8, zIndex: 60, minWidth: 190, background: isDark ? '#14161E' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.10)'}`, borderRadius: 14, padding: 5, boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.10)' }}
                            >
                              {[
                                { icon: Copy, label: 'نسخ', color: t.textSub, action: () => copyChat(chat) },
                                { icon: Pencil, label: 'اعادة تسمية', color: t.textSub, action: () => { setRenamingChatId(chat.id); setRenameValue(chat.title); setContextMenuChatId(null); } },
                                { icon: Pin, label: pinnedChats.includes(chat.id) ? 'الغاء التثبيت' : 'تثبيت', color: pinnedChats.includes(chat.id) ? t.gold : t.textSub, action: () => togglePin(chat.id) },
                                { divider: true },
                                { icon: Trash2, label: 'حذف', color: '#EF4444', action: () => { deleteChat(chat.id); setContextMenuChatId(null); } },
                              ].map((item, idx) => {
                                if ('divider' in item) return <div key={idx} style={{ height: 1, background: t.sidebarBdr, margin: '3px 8px' }} />;
                                const mi = item as { icon: any; label: string; color: string; action: () => void };
                                return (
                                  <button key={idx} onClick={mi.action} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 10, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: fontCairo, transition: 'background 0.1s' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                  >
                                    <mi.icon style={{ width: 13, height: 13, color: mi.color, ...(mi.icon === Pin ? { transform: 'rotate(-45deg)' } : {}) }} />
                                    <span style={{ fontSize: 12.5, fontWeight: 600, color: mi.color === '#EF4444' ? '#EF4444' : t.text }}>{mi.label}</span>
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Collapsed: show icons only */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '8px 0', overflowY: 'auto' }}>
            {chatHistory.slice(0, 10).map(chat => (
              <button key={chat.id} onClick={() => { loadChat(chat); }}
                title={chat.title}
                style={{ width: 40, height: 40, borderRadius: 11, background: activeChatId === chat.id ? (isDark ? 'rgba(212,175,55,0.10)' : 'rgba(212,175,55,0.08)') : 'transparent', border: `1px solid ${activeChatId === chat.id ? 'rgba(212,175,55,0.15)' : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.12s' }}>
                <MessageSquare style={{ width: 15, height: 15, color: activeChatId === chat.id ? t.gold : t.textSub }} />
              </button>
            ))}
          </div>
        )}

        {/* ── Nav Links at bottom ── */}
        <div style={{ padding: sidebarCollapsed && !isMobile ? '10px 8px' : '10px 12px', borderTop: `1px solid ${t.sidebarBdr}`, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { icon: Share2, label: 'الموصلات', action: () => { setPreviewOpen(true); setPreviewStep('list'); setPreviewConnKey(null); setSidebarOpen(false); } },
            { icon: Monitor, label: 'كمبيوتر وياك', action: () => { navigate('/wayak-computer'); setSidebarOpen(false); } },
          ].map((item, i) => (
            <button key={i} onClick={item.action}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: sidebarCollapsed && !isMobile ? '9px 0' : '9px 12px', borderRadius: 10, background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start', transition: 'background 0.12s' }}
              onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <item.icon style={{ width: 15, height: 15, color: t.textSub, flexShrink: 0 }} />
              {(!sidebarCollapsed || isMobile) && <span style={{ fontSize: 12.5, fontWeight: 600, color: t.text, fontFamily: fontCairo }}>{item.label}</span>}
            </button>
          ))}
          {/* User info */}
          {(!sidebarCollapsed || isMobile) && state.isAuthenticated && state.name && (
            <div onClick={() => { setSidebarOpen(false); navigate('/profile'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 10, cursor: 'pointer', marginTop: 4, transition: 'background 0.12s' }}
              onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: state.avatar ? `url(${state.avatar}) center/cover` : `linear-gradient(135deg, ${t.gold}30, ${t.gold}10)`, border: `1.5px solid ${t.gold}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {!state.avatar && <span style={{ fontSize: 11, fontWeight: 800, color: t.gold }}>{state.name.charAt(0)}</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 11.5, fontWeight: 700, color: t.text, fontFamily: fontCairo, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{state.name}</p>
                <p style={{ fontSize: 9.5, color: t.textMuted, fontFamily: fontCairo }}>وياك v2.0</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ══════════════════════════════════════
          MAIN AREA
      ══════════════════════════════════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, position: 'relative' }}>

        {/* ── Mobile TopBar ── */}
        {isMobile && (
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: `1px solid ${t.sidebarBdr}`, background: isDark ? 'rgba(10,12,20,0.95)' : 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', zIndex: 10 }}>
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => setSidebarOpen(true)}
              style={{ width: 36, height: 36, borderRadius: 10, background: t.chipBg, border: `1px solid ${t.chipBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <MoreHorizontal style={{ width: 16, height: 16, color: t.textSub }} />
            </motion.button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: t.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={wayakCharacterImg} alt="" style={{ width: 18, height: 18, objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: t.text, fontFamily: fontCairo }}>وياك</span>
            </div>
            {isChatMode ? (
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={startNewSession}
                style={{ width: 36, height: 36, borderRadius: 10, background: t.chipBg, border: `1px solid ${t.chipBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Plus style={{ width: 16, height: 16, color: t.gold }} />
              </motion.button>
            ) : (
              <div style={{ width: 36 }} />
            )}
          </div>
        )}

        {/* ── Scrollable Content ── */}
        <div
          style={{
            flex: 1, overflowY: 'auto', overflowX: 'hidden',
            padding: isChatMode ? '16px 16px 8px' : '24px 16px 8px',
          }}
        >
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center"
            style={{ minHeight: isChatMode ? undefined : 'calc(100dvh - 80px)', justifyContent: isChatMode ? undefined : 'center', display: 'flex', flexDirection: 'column', paddingBottom: isChatMode ? 0 : '40px' }}
          >
          {!isChatMode && (
            <motion.div
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center mb-6"
            >
              {/* Floating Wayak Avatar */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative mb-3"
              >
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.05, 0.15] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{
                    position: 'absolute', inset: -14, borderRadius: 36,
                    border: '1px solid rgba(212,175,55,0.12)',
                    background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)',
                  }}
                />
                <div style={{
                  width: 72, height: 72, borderRadius: 22,
                  background: isDark
                    ? 'linear-gradient(145deg, rgba(212,175,55,0.10), rgba(59,91,254,0.06))'
                    : 'linear-gradient(145deg, rgba(212,175,55,0.12), rgba(59,91,254,0.06))',
                  border: '1.5px solid rgba(212,175,55,0.25)',
                  boxShadow: `
                    0 0 50px rgba(212,175,55,0.10),
                    0 24px 60px rgba(0,0,0,${isDark ? 0.35 : 0.06}),
                    inset 0 1px 0 rgba(255,255,255,0.08)
                  `,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                  backdropFilter: 'blur(24px)',
                }}>
                  <img src={wayakCharacterImg} alt="وياك" style={{ width: 52, height: 52, objectFit: 'contain' }} draggable={false} />
                  <motion.div
                    animate={{ x: [-140, 140] }}
                    transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute', top: 0, bottom: 0, width: 50,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
                      transform: 'skewX(-15deg)',
                    }}
                  />
                </div>
                <div style={{
                  position: 'absolute', bottom: 6, left: 6,
                  width: 14, height: 14, borderRadius: '50%',
                  background: t.gold,
                  border: `2.5px solid ${t.pageBg}`,
                  boxShadow: '0 0 14px rgba(212,175,55,0.65)',
                }} />
              </motion.div>

              {/* System badge + Connectors */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => navigate('/home')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    background: t.goldSoft,
                    border: '1px solid rgba(212,175,55,0.18)',
                    borderRadius: 100, padding: '5px 14px',
                    backdropFilter: 'blur(12px)',
                    cursor: 'pointer',
                  }}
                >
                  <Sparkles style={{ width: 11, height: 11, color: t.gold }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: t.gold, fontFamily: fontCairo }}>
                    {isEn ? 'Wayak — Executive AI Agent' : 'وياك — وكيلك التنفيذي الذكي'}
                  </span>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => { setPreviewOpen(true); setPreviewStep('list'); setPreviewConnKey(null); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: connectedCount > 0 ? t.blueSoft : t.chipBg,
                    border: `1px solid ${connectedCount > 0 ? 'rgba(59,91,254,0.18)' : t.chipBdr}`,
                    borderRadius: 100, padding: '5px 12px',
                    cursor: 'pointer', backdropFilter: 'blur(12px)',
                  }}
                >
                  <Plug style={{ width: 11, height: 11, color: connectedCount > 0 ? t.blue : t.textSub }} />
                  <span style={{ fontSize: 11, fontWeight: 700, fontFamily: fontCairo, color: connectedCount > 0 ? t.blue : t.textSub }}>
                    {connectedCount > 0
                      ? (isEn ? `${connectedCount} connected` : `${connectedCount} موصل`)
                      : (isEn ? 'Connect Services' : 'ربط الخدمات')}
                  </span>
                </motion.button>
              </div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.6 }}
                style={{
                  fontSize: 'clamp(22px, 5vw, 36px)',
                  fontWeight: 800, color: t.text, textAlign: 'center',
                  lineHeight: 1.3, marginBottom: 10, fontFamily: fontCairo,
                  letterSpacing: '-0.02em',
                }}
              >
                {state.isAuthenticated && firstName
                  ? <>{greeting}{isEn ? ', ' : '، '}<span style={{
                      background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>{firstName}</span></>
                  : <>{isEn ? 'Your AI Executive Agent' : <>وكيل تنفيذي ذكي يتصل بأدواتك{'\n'}ويُنجز <span style={{
                      background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>المهام</span> نيابةً عنك</>}</>}
              </motion.h1>

              {state.isAuthenticated && firstName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    fontSize: 13.5, color: t.textSub, textAlign: 'center',
                    fontFamily: fontCairo, fontWeight: 500, lineHeight: 1.7, maxWidth: 380,
                  }}
                >
                  {isEn ? 'Connect your tools, activate your agents, and run your business from one place' : 'اتصل بأدواتك، فعّل وكلاءك، وشغّل أعمالك من مكان واحد'}
                </motion.p>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════
              MOBILE PREVIEW PANEL (above messages)
          ══════════════════════════════════════ */}
          {isMobile && previewOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
              style={{ maxWidth: 720, height: 380, borderRadius: 18, overflow: 'hidden', border: `1px solid ${t.glassBdr}`, marginBottom: 14, flexShrink: 0 }}
            >
              {renderConnectorPreview()}
            </motion.div>
          )}

          {/* ══════════════════════════════════════
              CHAT MESSAGES (scrollable area)
          ══════════════════════════════════════ */}
          {isChatMode && (
            <div className="w-full pt-4 pb-4" style={{ maxWidth: 720 }}>
              {/* Chat Header */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 28, padding: '14px 20px', borderRadius: 20,
                  background: t.glass, border: `1px solid ${t.glassBdr}`,
                  backdropFilter: 'blur(24px)',
                  boxShadow: `0 4px 24px rgba(0,0,0,${isDark ? 0.15 : 0.04})`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 15,
                    background: isDark
                      ? 'linear-gradient(145deg, rgba(212,175,55,0.10), rgba(59,91,254,0.06))'
                      : 'linear-gradient(145deg, rgba(212,175,55,0.12), rgba(59,91,254,0.06))',
                    border: '1.5px solid rgba(212,175,55,0.20)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(212,175,55,0.08)',
                  }}>
                    <img src={wayakCharacterImg} alt="" style={{ width: 36, height: 36, objectFit: 'contain' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: t.text, fontFamily: fontCairo }}>
                      {isEn ? 'Wayak — Execution Session' : 'وياك — جلسة تنفيذ'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3 }}>
                      <motion.div
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: t.blue,
                          boxShadow: '0 0 10px rgba(59,91,254,0.6)',
                        }}
                      />
                      <span style={{ fontSize: 11.5, color: t.textSub, fontFamily: fontCairo, fontWeight: 500 }}>
                        {isEn ? 'Active' : 'نشط'} — {connectedCount} {isEn ? 'connections' : 'اتصال'} — {isEn ? 'Session' : 'جلسة'} {sessionId?.slice(-6) || (isEn ? 'new' : 'جديدة')}
                      </span>
                    </div>
                    {/* Token counter */}
                    {totalTokens > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 8, background: 'rgba(212,175,55,0.10)', border: '1px solid rgba(212,175,55,0.20)' }}>
                          <Zap style={{ width: 9, height: 9, color: t.gold }} />
                          <span style={{ fontSize: 10, color: t.gold, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                            {totalTokens.toLocaleString()} / {(tokenLimit/1000).toFixed(0)}k tokens
                          </span>
                        </div>
                        <div style={{ flex: 1, height: 3, borderRadius: 3, background: t.glassBdr, overflow: 'hidden', maxWidth: 80 }}>
                          <div style={{ height: '100%', width: `${Math.min(100, (totalTokens / tokenLimit) * 100)}%`, background: `linear-gradient(90deg, ${t.gold}, #FFD700)`, borderRadius: 3, transition: 'width 0.5s' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  {[
                    { icon: Plug, color: t.blue, bg: t.blueSoft, action: () => { setPreviewOpen(true); setPreviewStep('list'); setPreviewConnKey(null); }, tip: isEn ? 'Connectors' : 'الموصلات' },
                    { icon: RotateCcw, color: t.textSub, bg: t.chipBg, action: startNewSession, tip: isEn ? 'New Session' : 'جلسة جديدة' },
                  ].map((btn, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={btn.action}
                      title={btn.tip}
                      style={{
                        width: 38, height: 38, borderRadius: 12,
                        background: btn.bg,
                        border: `1px solid ${btn.color}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <btn.icon style={{ width: 15, height: 15, color: btn.color }} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Messages List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20, minHeight: 200 }}>
                {chatMessages.map(msg => {
                  // ── Task Card — minimal status line ──
                  if (msg.role === 'task' && msg.task) {
                    const tk = msg.task;
                    const isDone = tk.status === 'done';
                    const isFailed = tk.status === 'failed';
                    const stepsDone = tk.steps.filter(s => s.done).length;
                    return (
                      <motion.div key={msg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '8px 14px', margin: '2px 0',
                          borderRadius: 10,
                          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
                        }}>
                          {isDone ? (
                            <CheckCircle style={{ width: 14, height: 14, color: '#34A853', flexShrink: 0 }} />
                          ) : isFailed ? (
                            <AlertCircle style={{ width: 14, height: 14, color: '#EF4444', flexShrink: 0 }} />
                          ) : (
                            <Loader2 className="animate-spin" style={{ width: 14, height: 14, color: t.textSub, flexShrink: 0 }} />
                          )}
                          <span style={{ fontSize: 12, color: t.textSub, fontFamily: fontCairo, fontWeight: 600, flex: 1 }}>
                            {tk.assignedAgent} · {stepsDone}/{tk.steps.length}
                          </span>
                          {isDone && tk.tokensUsed && (
                            <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
                              {tk.tokensUsed} tok · {tk.duration}s
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  }

                  // ── Regular message ──
                  const isUser = msg.role === 'user';
                  return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: 'flex', justifyContent: isUser ? 'flex-start' : 'flex-end' }}
                  >
                    <div style={{
                      maxWidth: '80%',
                      padding: isUser ? '10px 16px' : '12px 16px',
                      borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: isUser
                        ? (isDark ? 'rgba(59,91,254,0.15)' : '#E8EDFF')
                        : (isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF'),
                      border: `1px solid ${isUser ? 'rgba(59,91,254,0.15)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')}`,
                      boxShadow: isUser ? 'none' : `0 1px 4px rgba(0,0,0,${isDark ? 0.08 : 0.03})`,
                    }}>
                      {/* Agent name — small, subtle */}
                      {!isUser && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: t.textSub, fontFamily: fontCairo }}>
                            {isEn ? 'Wayak' : 'وياك'}
                          </span>
                          {msg.status === 'error' && <AlertCircle style={{ width: 11, height: 11, color: '#EF4444' }} />}
                        </div>
                      )}

                      {/* User attachments */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                          {msg.attachments.map(att => (
                            <div key={att.id} style={{
                              display: 'flex', alignItems: 'center', gap: 5,
                              padding: '3px 10px', borderRadius: 8,
                              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                              fontSize: 10, fontWeight: 600, color: t.textSub, fontFamily: fontCairo,
                            }}>
                              <FileText style={{ width: 10, height: 10 }} />
                              {att.name}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Message content */}
                      <p style={{
                        fontSize: 13.5, lineHeight: 1.7, fontFamily: fontCairo,
                        color: t.text, whiteSpace: 'pre-line', fontWeight: 500,
                        margin: 0,
                      }}>
                        {msg.content}
                      </p>

                      {/* Execution steps */}
                      {msg.steps && msg.steps.length > 0 && (
                        <div style={{
                          marginTop: 14, paddingTop: 14,
                          borderTop: `1px solid ${t.glassBdr}`,
                          display: 'flex', flexDirection: 'column', gap: 7,
                        }}>
                          {msg.steps.map((step, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                              {step.status === 'done' && <CheckCircle style={{ width: 13, height: 13, color: t.blue, flexShrink: 0 }} />}
                              {step.status === 'running' && <Loader2 className="animate-spin" style={{ width: 13, height: 13, color: t.blue, flexShrink: 0 }} />}
                              {step.status === 'pending' && <Clock style={{ width: 13, height: 13, color: t.textMuted, flexShrink: 0 }} />}
                              <span style={{
                                fontSize: 12.5, fontWeight: 600, fontFamily: fontCairo,
                                color: step.status === 'done' ? t.blue : step.status === 'running' ? t.blue : t.textMuted,
                              }}>
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Connected tools badges */}
                      {msg.tools_used && msg.tools_used.length > 0 && (
                        <div style={{
                          display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 14,
                          paddingTop: 12, borderTop: `1px solid ${t.glassBdr}`,
                        }}>
                          <Plug style={{ width: 11, height: 11, color: t.textMuted, marginTop: 3 }} />
                          {msg.tools_used.map(tool => (
                            <span key={tool} style={{
                              fontSize: 10.5, fontWeight: 600, fontFamily: fontCairo,
                              background: t.blueSoft, border: '1px solid rgba(59,91,254,0.10)',
                              borderRadius: 8, padding: '3px 10px', color: t.blue,
                            }}>
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                  );
                })}

                {/* Typing / Executing indicator */}
                {isSending && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <div style={{
                      padding: '18px 24px', borderRadius: '24px 24px 24px 6px',
                      background: t.agentBubble, border: `1px solid ${t.glassBdr}`,
                      backdropFilter: 'blur(20px)',
                      display: 'flex', alignItems: 'center', gap: 12,
                      boxShadow: `0 4px 24px rgba(0,0,0,${isDark ? 0.12 : 0.03})`,
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 10,
                        background: t.blueSoft,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Cpu style={{ width: 16, height: 16, color: t.blue }} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
                          {[0, 1, 2].map(i => (
                            <motion.div
                              key={i}
                              animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1, 0.7] }}
                              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                              style={{ width: 5, height: 5, borderRadius: '50%', background: t.blue }}
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: 11.5, color: t.textSub, fontFamily: fontCairo, fontWeight: 600 }}>
                          {isEn ? 'Wayak is executing...' : 'وياك ينفّذ المهمة...'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
          )}

          {/* ── Centered Input (welcome state only) ── */}
          {!isChatMode && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full mb-6"
              style={{ maxWidth: 700 }}
            >
              {renderInputBox()}
            </motion.div>
          )}

          {/* ── Quick Chips (welcome state only) ── */}
          {!isChatMode && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.38 }}
                className="w-full mb-12"
                style={{ maxWidth: 720 }}
              >
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {CHIPS.map((chip, i) => (
                    <motion.button
                      key={chip.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.38 + i * 0.04 }}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSend(chip.prompt)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '7px 14px', borderRadius: 100,
                        background: t.chipBg, border: `1px solid ${t.chipBdr}`,
                        cursor: 'pointer', fontFamily: fontCairo,
                        backdropFilter: 'blur(12px)', transition: 'border-color 0.2s, box-shadow 0.2s',
                        boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = `${chip.color}30`)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = t.chipBdr)}
                    >
                      <div style={{
                        width: 22, height: 22, borderRadius: 7,
                        background: `${chip.color}14`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <chip.icon style={{ width: 12, height: 12, color: chip.color }} />
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: t.text, whiteSpace: 'nowrap' }}>
                        {chip.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* ── Agent Capabilities Grid ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="w-full mb-10"
                style={{ maxWidth: 720 }}
              >
                {/* Section header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 9,
                    background: t.goldSoft,
                    border: '1px solid rgba(212,175,55,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Cpu style={{ width: 14, height: 14, color: t.gold }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: t.text, fontFamily: fontCairo }}>
                    {isEn ? 'Agents & Capabilities' : 'الوكلاء والقدرات التنفيذية'}
                  </span>
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${t.glassBdr}, transparent)` }} />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 12,
                }}>
                  {CAPABILITIES.map((cap, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 + i * 0.06 }}
                      whileHover={{ y: -3, scale: 1.01 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '16px 18px', borderRadius: 18,
                        background: t.cardBg, border: `1px solid ${t.glassBdr}`,
                        backdropFilter: 'blur(20px)', cursor: 'pointer',
                        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                        boxShadow: t.cardShadow,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = `${cap.color}30`;
                        e.currentTarget.style.boxShadow = isDark ? 'none' : `0 4px 16px ${cap.color}10`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = t.glassBdr;
                        e.currentTarget.style.boxShadow = t.cardShadow;
                      }}
                      onClick={() => openAgentInComputer(cap.agentId)}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                        background: `${cap.color}14`, border: `1px solid ${cap.color}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <cap.icon style={{ width: 20, height: 20, color: cap.color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 700, color: t.text, fontFamily: fontCairo, marginBottom: 3 }}>
                          {isEn ? cap.labelEn : cap.label}
                        </p>
                        <p style={{ fontSize: 11.5, color: t.textSub, fontFamily: fontCairo, fontWeight: 500, lineHeight: 1.5 }}>
                          {isEn ? cap.descEn : cap.desc}
                        </p>
                      </div>
                      <ChevronLeft style={{ width: 14, height: 14, color: t.textMuted, flexShrink: 0, opacity: 0.5 }} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
          </div>
        </div>

        {/* ── Bottom Input Bar — chat mode only ── */}
        {isChatMode && (
          <div style={{
            flexShrink: 0,
            padding: '10px 16px 14px',
            background: isDark ? 'rgba(7,8,13,0.97)' : 'rgba(255,255,255,0.99)',
            borderTop: `1px solid ${t.sidebarBdr}`,
            backdropFilter: 'blur(24px)',
          }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              {renderInputBox()}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          DESKTOP PREVIEW PANE (beside chat)
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {!isMobile && previewOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 320, flexShrink: 0,
              borderRight: `1px solid ${t.glassBdr}`,
              display: 'flex', flexDirection: 'column',
              background: isDark ? '#0A0C14' : '#FFFFFF',
              overflow: 'hidden',
            }}
          >
            {renderConnectorPreview()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ HIDDEN FILE INPUTS ═══════ */}
      <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip,.rar" onChange={handleFileSelect} style={{ display: 'none' }} />
      <input ref={imageInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />

      {/* ═══════ WAYAK COMPUTER OVERLAY ═══════ */}
      <AnimatePresence>
        {showComputer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: computerFullScreen ? 0 : undefined,
              bottom: computerFullScreen ? 0 : 80,
              left: computerFullScreen ? 0 : 12,
              right: computerFullScreen ? 0 : 12,
              top: computerFullScreen ? 0 : undefined,
              height: computerFullScreen ? '100dvh' : 'calc(100dvh - 160px)',
              zIndex: computerFullScreen ? 999 : 55,
            }}
          >
            <Suspense fallback={
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', background:'rgba(11,17,32,0.95)', borderRadius:24 }}>
                <Loader2 size={32} className="animate-spin" style={{ color:'#D4AF37' }} />
              </div>
            }>
              <WayakComputer
                isOpen={showComputer}
                onClose={() => { setShowComputer(false); setComputerInitialWindow(undefined); }}
                onToggleSize={() => setComputerFullScreen(prev => !prev)}
                isFullScreen={computerFullScreen}
                sessionId={sessionId}
                initialWindow={computerInitialWindow}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ═══════════════════════════════════════════
  // Input Box — "+" menu design (Claude-style)
  // ═══════════════════════════════════════════
  function renderInputBox() {
    return (
      <div style={{
        background: t.inputBg,
        border: isFocused
          ? '1.5px solid rgba(59,91,254,0.35)'
          : `1.5px solid ${t.inputBdr}`,
        borderRadius: 20,
        backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
        boxShadow: isFocused
          ? `0 0 0 3px rgba(59,91,254,0.06), 0 8px 32px rgba(0,0,0,${isDark ? 0.15 : 0.04})`
          : `0 2px 8px rgba(0,0,0,${isDark ? 0.10 : 0.03})`,
        transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
        overflow: 'visible',
        position: 'relative',
      }}>
        {/* ── "+" Menu (popup above) ── */}
        <AnimatePresence>
          {showAttachMenu && (
            <>
              <div onClick={() => setShowAttachMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute', bottom: 'calc(100% + 8px)', right: 0,
                  background: isDark ? '#0E1018' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(15,23,42,0.10)'}`,
                  borderRadius: 14, padding: '4px 3px', zIndex: 50,
                  width: 175,
                  boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.55)' : '0 12px 40px rgba(0,0,0,0.10)',
                  backdropFilter: 'blur(24px)',
                  direction: 'rtl',
                }}
              >
                {/* Compact items */}
                {([
                  { icon: Image, label: isEn ? 'Photo / File' : 'صورة / ملف', color: '#3B82F6', onClick: () => { imageInputRef.current?.click(); setShowAttachMenu(false); } },
                  { icon: Mic, label: isEn ? 'Voice message' : 'رسالة صوتية', color: '#EF4444', onClick: () => { startRecording(); setShowAttachMenu(false); } },
                  { icon: Share2, label: isEn ? 'Connectors' : 'الموصلات', color: '#9B51E0', onClick: () => { navigate('/connectors'); setShowAttachMenu(false); } },
                  { icon: Monitor, label: isEn ? 'Wayak Computer' : 'كمبيوتر وياك', color: t.blue, onClick: () => { setShowComputer(true); setComputerFullScreen(true); setShowAttachMenu(false); } },
                ] as const).map((item, i) => (
                  <button key={i} onClick={item.onClick}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 9, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: fontCairo, transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width: 24, height: 24, borderRadius: 7, background: `${item.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.icon style={{ width: 12, height: 12, color: item.color }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{item.label}</span>
                  </button>
                ))}

                <div style={{ height: 1, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.07)', margin: '2px 8px' }} />

                {/* Agent mode — compact row */}
                <div style={{ display: 'flex', gap: 2, padding: '3px 6px' }}>
                  {([
                    { key: 'chat', icon: MessageSquare, tip: isEn ? 'Chat' : 'دردشة', color: t.gold },
                    { key: 'exec', icon: Zap, tip: isEn ? 'Exec' : 'تنفيذ', color: '#8B5CF6' },
                    { key: 'computer', icon: Monitor, tip: isEn ? 'PC' : 'كمبيوتر', color: t.blue },
                  ] as const).map(opt => (
                    <button key={opt.key} onClick={() => { setChatMode(opt.key); setShowAttachMenu(false); }}
                      title={opt.tip}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
                        padding: '4px 2px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: fontCairo,
                        background: chatMode === opt.key ? `${opt.color}18` : 'transparent',
                        transition: 'all 0.12s',
                      }}>
                      <opt.icon style={{ width: 11, height: 11, color: chatMode === opt.key ? opt.color : t.textSub }} />
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: chatMode === opt.key ? opt.color : t.textSub }}>{opt.tip}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Attached Files Preview */}
        {attachedFiles.length > 0 && (
          <div style={{ padding: '10px 14px 0', display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {attachedFiles.map(file => (
              <motion.div key={file.id} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 12, background: t.blueSoft, border: '1px solid rgba(59,91,254,0.12)', maxWidth: 180 }}>
                {file.preview ? (
                  <img src={file.preview} alt="" style={{ width: 24, height: 24, borderRadius: 6, objectFit: 'cover' }} />
                ) : (
                  <FileText style={{ width: 14, height: 14, color: t.blue, flexShrink: 0 }} />
                )}
                <p style={{ fontSize: 11, fontWeight: 600, color: t.text, fontFamily: fontCairo, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{file.name}</p>
                <button onClick={() => removeAttachment(file.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}>
                  <X style={{ width: 12, height: 12, color: '#EF4444' }} />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <div style={{ padding: '14px 16px 4px' }}>
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={1}
            placeholder={chatMode === 'computer' ? 'اكتب أمرًا لكمبيوتر وياك...' : chatMode === 'exec' ? 'كلّف الوكيل بمهمة تنفيذية...' : 'اكتب رسالتك لوياك...'}
            style={{
              width: '100%', background: 'transparent',
              border: 'none', outline: 'none', resize: 'none',
              fontSize: 15, lineHeight: 1.75,
              color: t.text, fontFamily: fontCairo,
              minHeight: 40, maxHeight: 160, fontWeight: 500,
            }}
          />
        </div>

        {/* Action bar */}
        {isRecording ? (
          /* ── Recording bar ── */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px 10px', gap: 8 }}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={cancelRecording}
              style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <X style={{ width: 16, height: 16, color: '#EF4444' }} />
            </motion.button>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }}
              />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#EF4444', fontFamily: fontCairo, fontVariantNumeric: 'tabular-nums' }}>
                {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}
              </span>
              <span style={{ fontSize: 11, color: t.textSub, fontFamily: fontCairo }}>
                {isEn ? 'Recording...' : 'جارٍ التسجيل...'}
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={stopRecording}
              style={{
                width: 40, height: 40, borderRadius: 13,
                background: 'linear-gradient(145deg, #3B5BFE, #2845E0)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(59,91,254,0.28)',
              }}
            >
              <ArrowUp style={{ width: 18, height: 18, color: '#fff' }} />
            </motion.button>
          </div>
        ) : (
          /* ── Normal action bar ── */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px 10px', gap: 8 }}>
            {/* RIGHT (RTL): "+" button + mode */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <motion.button
                whileHover={{ scale: 1.08, rotate: showAttachMenu ? -45 : 0 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setShowAttachMenu(prev => !prev)}
                style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: showAttachMenu ? t.blueSoft : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)'),
                  border: `1px solid ${showAttachMenu ? 'rgba(59,91,254,0.25)' : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.10)')}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <Plus style={{ width: 17, height: 17, color: showAttachMenu ? t.blue : t.textSub, transition: 'transform 0.2s', transform: showAttachMenu ? 'rotate(45deg)' : 'none' }} />
              </motion.button>

              {/* Mode indicator badge */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                onClick={() => setShowAttachMenu(prev => !prev)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 8,
                  background: chatMode === 'exec' ? 'rgba(139,92,246,0.10)' : chatMode === 'computer' ? t.blueSoft : t.goldSoft,
                  border: `1px solid ${chatMode === 'exec' ? 'rgba(139,92,246,0.20)' : chatMode === 'computer' ? 'rgba(59,91,254,0.15)' : 'rgba(212,175,55,0.18)'}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {chatMode === 'exec' ? <Zap style={{ width: 11, height: 11, color: '#8B5CF6' }} /> : chatMode === 'computer' ? <Monitor style={{ width: 11, height: 11, color: t.blue }} /> : <MessageSquare style={{ width: 11, height: 11, color: t.gold }} />}
                <span style={{ fontSize: 11.5, fontWeight: 700, fontFamily: fontCairo, color: chatMode === 'exec' ? '#8B5CF6' : chatMode === 'computer' ? t.blue : t.gold }}>
                  {chatMode === 'exec' ? 'وكيل تنفيذ' : chatMode === 'computer' ? 'كمبيوتر وياك' : 'وكيل دردشة'}
                </span>
              </motion.button>
            </div>

            {/* LEFT (RTL): Mic + Send */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Mic button — shows when no text */}
              {!inputText.trim() && (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={startRecording}
                  style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.10)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <Mic style={{ width: 16, height: 16, color: t.textSub }} />
                </motion.button>
              )}

              {/* Send button */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (chatMode === 'computer') { setShowComputer(true); setComputerFullScreen(true); }
                  else { handleSend(); }
                }}
                disabled={isSending}
                style={{
                  width: 40, height: 40, borderRadius: 13,
                  background: inputText.trim()
                    ? 'linear-gradient(145deg, #3B5BFE, #2845E0)'
                    : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)',
                  border: 'none',
                  cursor: inputText.trim() && !isSending ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: inputText.trim() ? '0 6px 20px rgba(59,91,254,0.28)' : 'none',
                  transition: 'all 0.2s ease', flexShrink: 0,
                }}
              >
                {isSending ? (
                  <Loader2 className="animate-spin" style={{ width: 17, height: 17, color: '#fff' }} />
                ) : (
                  <ArrowUp style={{ width: 18, height: 18, color: inputText.trim() ? '#fff' : t.textMuted }} />
                )}
              </motion.button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
