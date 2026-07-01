/**
 * WayakComputer.tsx — وياك: Cloud Computer الذكي
 * ═══════════════════════════════════════════════════════
 * واجهة خماسية: Chat | Dashboard | Desktop | AI Agents | Browser
 * بناءً على screenshots من tasklet.ai — تنفيذ واقعي
 */

import {
  useState, useEffect, useCallback, useRef,
  lazy, Suspense, startTransition, type CSSProperties,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Minimize2, Maximize2, Loader2,
  Search, Briefcase, Megaphone,
  Sparkles, Clock, CheckCircle, AlertCircle,
  ChevronLeft, ChevronRight, Activity, Zap,
  BarChart2, ArrowUp, Cpu, Monitor, Database,
  Plug, Mail, MessageCircle, Globe, FileText,
  Server, Play, Users, Shield,
  Plus, Settings, Send, Mic, Paperclip,
  LayoutDashboard, MessageSquare,
  TrendingUp, Bell, Star, RefreshCw,
  Terminal, Folder, Home,
  Music, Trash2, HelpCircle,
  Volume2, Wifi, Battery, Power,
  Grid, List, MoreVertical, Square,
  type LucideIcon,
} from 'lucide-react';

// Aliases for unavailable icons
const BarChart3 = BarChart2;
const AppWindow = Monitor;
const FolderOpen = Folder;
const Image = FileText; // placeholder for image icon

import { useEffectiveState } from '../../contexts/EffectiveState';
import { useOptionalTaskContext, type Task } from '../../contexts/TaskContext';
import type { WindowState } from '../wayak-desktop/DesktopWindow';
import { callWayakAgent, getStoredApiKey, WAYAK_THREAD_KEY } from '../../lib/wayak-agent';
import { getStats } from '../admin/adminApi';

const DesktopWindowComp = lazy(() => import('../wayak-desktop/DesktopWindow').then(m => ({ default: m.DesktopWindow })));
const AccountManagerAgent = lazy(() => import('../wayak-desktop/WayakAgents').then(m => ({ default: m.AccountManagerAgent })));
const SEOOptimizerAgent   = lazy(() => import('../wayak-desktop/WayakAgents').then(m => ({ default: m.SEOOptimizerAgent })));
const SocialMediaAgent    = lazy(() => import('../wayak-desktop/WayakAgents').then(m => ({ default: m.SocialMediaAgent })));
const AIAgentEngine       = lazy(() => import('./AIAgentEngine').then(m => ({ default: m.AIAgentEngine })));
const CloudBrowser        = lazy(() => import('./CloudBrowser').then(m => ({ default: m.CloudBrowser })));

import wayakCharacterImg from 'figma:asset/c33d475de03bd99055b12c89eb52fa7b9aa3f848.png';

// ═══════════════════════════════════════════
// Design Tokens
// ═══════════════════════════════════════════
const fontCairo = "'Cairo', 'Tajawal', system-ui, sans-serif";
const fontMono  = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";

const C = {
  bg:         '#F5F3EF',   // رملي فاتح
  bgDesk:     '#FAFAF8',   // أبيض مائل للرملي
  surface:    '#FFFFFF',   // أبيض نقي
  surfaceHi:  '#EEF6FF',   // أزرق سماوي خفيف
  border:     'rgba(0,0,0,0.08)',
  borderHi:   'rgba(0,0,0,0.14)',
  text:       '#1E293B',   // نص داكن
  textDim:    '#64748B',
  textMut:    'rgba(30,41,59,0.40)',
  gold:       '#B8860B',   // ذهبي يظهر على أبيض
  goldLight:  '#D4A017',
  goldSoft:   'rgba(184,134,11,0.10)',
  goldBorder: 'rgba(184,134,11,0.22)',
  blue:       '#0EA5E9',   // سماوي
  blueSoft:   'rgba(14,165,233,0.10)',
  blueBorder: 'rgba(14,165,233,0.22)',
  red:        '#EF4444',
  redSoft:    'rgba(239,68,68,0.10)',
  amber:      '#F59E0B',
  amberSoft:  'rgba(245,158,11,0.10)',
};

// Desktop-specific colors (light theme)
const D = {
  dockBg:       'rgba(255,255,255,0.90)',
  panelBg:      'rgba(250,250,248,0.96)',
  winChrome:    '#E8F4FD',
  winBg:        '#FFFFFF',
  termBg:       '#1a1a2e',
  termText:     '#e0e0e0',
  termPrompt:   '#0EA5E9',
  termCyan:     '#0EA5E9',
  filesBg:      '#f6f5f4',
  filesText:    '#222',
  filesSidebar: '#e8e5e2',
  launcherBg:   'rgba(255,255,255,0.97)',
};

// ═══════════════════════════════════════════
// Session Handoff Types
// ═══════════════════════════════════════════
type ControlState = 'user_controlled' | 'agent_controlled' | 'shared_control' | 'paused';

interface SessionState {
  controlState: ControlState;
  currentTask: string | null;
  currentStep: number;
  totalSteps: number;
  activeApp: string | null;
  pausedReason: string | null;
  lastAgentStep: number;
}

const DEFAULT_SESSION: SessionState = {
  controlState: 'user_controlled',
  currentTask: null,
  currentStep: 0,
  totalSteps: 0,
  activeApp: null,
  pausedReason: null,
  lastAgentStep: 0,
};

// ═══════════════════════════════════════════
// Agent Definitions
// ═══════════════════════════════════════════
type AgentId = 'agent-accounts' | 'agent-seo' | 'agent-social';
type MainView = 'dashboard' | 'chat' | 'desktop' | 'ai-agents' | 'browser';

interface AgentDef {
  id: AgentId;
  title: string;
  subtitle: string;
  desc: string;
  icon: LucideIcon;
}

const AGENTS: AgentDef[] = [
  { id: 'agent-accounts', title: 'وكيل مدير الحسابات', subtitle: 'Account Manager', desc: 'إدارة الملف التجاري والتوصيات', icon: Briefcase },
  { id: 'agent-seo',      title: 'وكيل تحسين الظهور',  subtitle: 'SEO & GEO Agent', desc: 'تحليل محركات البحث والذكاء الاصطناعي', icon: Search },
  { id: 'agent-social',   title: 'وكيل السوشيال ميديا', subtitle: 'Social Media Agent', desc: 'توليد محتوى وجدولة عبر المنصات', icon: Megaphone },
];

const WIN_DEFS: Record<AgentId, { defaultSize: { w: number; h: number }; defaultPos: { x: number; y: number }; minSize: { w: number; h: number } }> = {
  'agent-accounts': { defaultSize: { w: 620, h: 500 }, defaultPos: { x: 40, y: 30 }, minSize: { w: 380, h: 340 } },
  'agent-seo':      { defaultSize: { w: 620, h: 500 }, defaultPos: { x: 70, y: 40 }, minSize: { w: 380, h: 340 } },
  'agent-social':   { defaultSize: { w: 620, h: 500 }, defaultPos: { x: 60, y: 50 }, minSize: { w: 380, h: 340 } },
};

// ═══════════════════════════════════════════
// Chat Message Types
// ═══════════════════════════════════════════
interface TaskCard {
  id: string;
  status: 'creating' | 'assigning' | 'running' | 'done' | 'failed';
  assignedAgent: string;
  agentIcon?: LucideIcon;
  agentColor?: string;
  tokensUsed?: number;
  duration?: number; // seconds
  steps: Array<{ label: string; done: boolean; active: boolean }>;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'wayak' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'thinking';
  agentId?: AgentId;
  computerPreview?: { url: string; title: string; screenshot?: string };
  task?: TaskCard;
}

const WAYAK_SUGGESTIONS = [
  'حلّل أداء ملفي التجاري',
  'اكتب وصفاً لخدماتي',
  'ما هي أفضل الكلمات المفتاحية؟',
  'اقترح محتوى لإنستغرام',
  'راجع بيانات عملائي',
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'sys-1',
    role: 'wayak',
    content: 'مرحباً! أنا وياك، وكيلك التنفيذي الذكي في بيت الريف. أستطيع تحليل بياناتك، كتابة محتوى تسويقي، تحسين ظهورك في البحث، وتنفيذ مهام معقدة نيابةً عنك.',
    timestamp: new Date(),
    status: 'sent',
  },
];

// ═══════════════════════════════════════════
// Cloud Desktop Window Types
// ═══════════════════════════════════════════
type CloudAppType = 'terminal' | 'files' | 'browser' | 'launcher';

interface CloudWin {
  id: string;
  type: CloudAppType;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

const CLOUD_WIN_DEFAULTS: Record<CloudAppType, { title: string; w: number; h: number; x: number; y: number }> = {
  terminal: { title: 'Terminal', w: 520, h: 360, x: 60, y: 30 },
  files:    { title: 'Files — Home', w: 540, h: 420, x: 80, y: 40 },
  browser:  { title: 'bietalreef.ae — Firefox', w: 560, h: 440, x: 50, y: 20 },
  launcher: { title: 'App Launcher', w: 400, h: 460, x: 80, y: 30 },
};

// ═══════════════════════════════════════════
// Props
// ═══════════════════════════════════════════
interface WayakComputerProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleSize?: () => void;
  isFullScreen?: boolean;
  sessionId?: string | null;
  currentTask?: string;
  taskSteps?: any[];
  initialWindow?: string;
  defaultView?: MainView;
}

// ══════════════════���════════════════════════
// Shared Panel Style
// ═══════════════════════════════════════════
const panel = (extra?: CSSProperties): CSSProperties => ({
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: '14px 16px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  ...extra,
});

const sectionTitle = (text: string, Icon: LucideIcon, accent = C.blue) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
    <Icon style={{ width: 13, height: 13, color: accent }} />
    <span style={{ fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: 0.2 }}>{text}</span>
  </div>
);

// ═══════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════
export function WayakComputer({
  isOpen, onClose, onToggleSize, isFullScreen = false, initialWindow, defaultView,
}: WayakComputerProps) {
  const { state: userState } = useEffectiveState();
  const taskCtx = useOptionalTaskContext();

  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZ, setNextZ] = useState(100);
  const [mainView, setMainView] = useState<MainView>(defaultView ?? 'dashboard');
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  // ── Session Handoff State ──
  const [session, setSession] = useState<SessionState>(DEFAULT_SESSION);
  const [showHandoffNotif, setShowHandoffNotif] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-pause when user interacts during agent execution
  useEffect(() => {
    if (session.controlState !== 'agent_controlled') return;
    const el = containerRef.current;
    if (!el) return;
    let triggered = false;
    const handleInteraction = () => {
      if (triggered) return;
      triggered = true;
      setSession(prev => ({
        ...prev,
        controlState: 'paused',
        lastAgentStep: prev.currentStep,
        pausedReason: 'تدخل المستخدم',
      }));
      setShowHandoffNotif(true);
      setTimeout(() => setShowHandoffNotif(false), 4000);
    };
    el.addEventListener('mousemove', handleInteraction, { once: true });
    el.addEventListener('keydown', handleInteraction, { once: true });
    return () => {
      el.removeEventListener('mousemove', handleInteraction);
      el.removeEventListener('keydown', handleInteraction);
    };
  }, [session.controlState]);

  const handleTakeControl = () => {
    setSession(prev => ({ ...prev, controlState: 'user_controlled', pausedReason: null }));
    setShowHandoffNotif(false);
  };
  const handleHandToAgent = () => {
    setSession(prev => ({ ...prev, controlState: 'agent_controlled', pausedReason: null }));
  };
  const handlePauseSession = () => {
    setSession(prev => ({ ...prev, controlState: 'paused', lastAgentStep: prev.currentStep, pausedReason: 'إيقاف يدوي' }));
  };
  const handleResumeSession = () => {
    setSession(prev => ({ ...prev, controlState: 'agent_controlled', pausedReason: null, currentStep: prev.lastAgentStep }));
  };
  const startAgentTask = (taskName: string, totalSteps = 5, appName?: string) => {
    setSession({ controlState: 'agent_controlled', currentTask: taskName, currentStep: 0, totalSteps, activeApp: appName ?? null, pausedReason: null, lastAgentStep: 0 });
  };

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('ar-AE', { weekday: 'short', day: 'numeric', month: 'short' }));
    };
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!isOpen || !initialWindow) return;
    if (initialWindow.startsWith('agent-')) {
      setTimeout(() => {
        startTransition(() => {
          openAgent(initialWindow as AgentId);
          setMainView('desktop');
        });
      }, 150);
    }
  }, [isOpen, initialWindow]);

  const tasks     = taskCtx?.tasks || [];
  const stats     = taskCtx?.stats;
  const isLoading = taskCtx?.isLoading || false;

  const pendingCount = stats?.pending || 0;
  const runningCount = stats?.running || 0;
  const doneCount    = stats?.done || 0;
  const totalTasks   = stats?.total || 0;
  const displayName  = userState.name ? userState.name.split(' ')[0] : '';
  const recentTasks  = [...tasks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  // Window management
  const openAgent = useCallback((id: AgentId) => {
    startTransition(() => {
      setWindows(prev => {
        const existing = prev.find(w => w.id === id);
        if (existing) return prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZ } : w);
        const def = WIN_DEFS[id];
        const agent = AGENTS.find(a => a.id === id)!;
        return [...prev, {
          id, title: agent.title, icon: agent.icon, iconColor: C.blue,
          isOpen: true, isMinimized: false, isMaximized: false,
          zIndex: nextZ, position: { ...def.defaultPos }, size: { ...def.defaultSize }, minSize: def.minSize,
        }];
      });
      setNextZ(z => z + 1);
    });
  }, [nextZ]);

  const closeWindow    = useCallback((id: string) => setWindows(p => p.map(w => w.id === id ? { ...w, isOpen: false } : w)), []);
  const minimizeWindow = useCallback((id: string) => setWindows(p => p.map(w => w.id === id ? { ...w, isMinimized: true } : w)), []);
  const maximizeWindow = useCallback((id: string) => setWindows(p => p.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)), []);
  const focusWindow    = useCallback((id: string) => { setWindows(p => p.map(w => w.id === id ? { ...w, zIndex: nextZ } : w)); setNextZ(z => z + 1); }, [nextZ]);
  const moveWindow     = useCallback((id: string, pos: { x: number; y: number }) => setWindows(p => p.map(w => w.id === id ? { ...w, position: pos } : w)), []);
  const resizeWindow   = useCallback((id: string, size: { w: number; h: number }) => setWindows(p => p.map(w => w.id === id ? { ...w, size } : w)), []);

  if (!isOpen) return null;

  const NAV_TABS: { id: MainView; label: string; icon: LucideIcon }[] = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'chat',      label: 'وياك AI',     icon: MessageSquare },
    { id: 'ai-agents', label: 'الوكلاء',     icon: Sparkles },
    { id: 'browser',   label: 'المتصفح',     icon: Globe },
    { id: 'desktop',   label: 'سطح المكتب',  icon: Monitor },
  ];

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: isFullScreen ? 'fixed' : 'relative',
          inset: isFullScreen ? 0 : undefined,
          zIndex: isFullScreen ? 999 : 10,
          width: '100%',
          height: isFullScreen ? '100dvh' : '100%',
          minHeight: isFullScreen ? undefined : '80vh',
          display: 'flex', flexDirection: 'column',
          borderRadius: isFullScreen ? 0 : 20,
          overflow: 'hidden',
          background: C.bg,
          border: isFullScreen ? 'none' : `1px solid ${C.borderHi}`,
          boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
          fontFamily: fontCairo, direction: 'rtl',
        }}
      >
        {/* TOP BAR */}
        <TopBar
          displayName={displayName}
          timeStr={timeStr}
          dateStr={dateStr}
          runningCount={runningCount}
          isFullScreen={isFullScreen}
          onToggleSize={onToggleSize}
          onClose={onClose}
          onGoHome={() => startTransition(() => setMainView('dashboard'))}
        />

        {/* SESSION HANDOFF BAR */}
        <SessionHandoffBar
          session={session}
          onTakeControl={handleTakeControl}
          onHandToAgent={handleHandToAgent}
          onPause={handlePauseSession}
          onResume={handleResumeSession}
        />

        {/* USER TAKEOVER NOTIFICATION */}
        <AnimatePresence>
          {showHandoffNotif && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              style={{
                position: 'absolute', top: 96, left: '50%', transform: 'translateX(-50%)',
                zIndex: 500, background: 'rgba(245,158,11,0.95)', color: '#000',
                padding: '8px 16px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 7,
                fontFamily: fontCairo, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
                boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
              }}
            >
              <Shield style={{ width: 13, height: 13 }} />
              استلمت التحكم — الوكيل في وضع الإيقاف المؤقت
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAV TABS */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '6px 14px',
          borderBottom: `1px solid ${C.border}`,
          background: `linear-gradient(180deg, ${C.surface} 0%, #EEF6FF 100%)`,
          flexShrink: 0,
        }}>
          {NAV_TABS.map(tab => {
            const isActive = mainView === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => startTransition(() => setMainView(tab.id))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 8,
                  background: isActive ? C.goldSoft : 'transparent',
                  border: isActive ? `1px solid ${C.goldBorder}` : '1px solid transparent',
                  cursor: 'pointer', fontFamily: fontCairo,
                }}
              >
                <tab.icon style={{ width: 13, height: 13, color: isActive ? C.gold : C.textDim }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: isActive ? C.gold : C.textDim }}>
                  {tab.label}
                </span>
              </motion.button>
            );
          })}

          {runningCount > 0 && (
            <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, background: C.blueSoft, border: `1px solid ${C.blueBorder}` }}>
              <Loader2 className="animate-spin" style={{ width: 9, height: 9, color: C.blue }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: C.blue }}>{runningCount} مهمة جارية</span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <AnimatePresence mode="wait">
            {mainView === 'dashboard' && (
              <motion.div key="dashboard"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ height: '100%', overflow: 'auto' }}
              >
                <DashboardView
                  tasks={recentTasks}
                  totalTasks={totalTasks}
                  pendingCount={pendingCount}
                  runningCount={runningCount}
                  doneCount={doneCount}
                  isLoading={isLoading}
                  onOpenAgent={(id) => startTransition(() => { openAgent(id); setMainView('desktop'); })}
                  displayName={displayName}
                  onGoToChat={() => startTransition(() => setMainView('chat'))}
                  onGoToDesktop={() => startTransition(() => setMainView('desktop'))}
                />
              </motion.div>
            )}

            {mainView === 'chat' && (
              <motion.div key="chat"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <ChatView
                  onOpenAgent={(id) => startTransition(() => { openAgent(id); setMainView('desktop'); })}
                  onOpenDesktop={() => startTransition(() => setMainView('desktop'))}
                  onStartAgentTask={startAgentTask}
                />
              </motion.div>
            )}

            {mainView === 'ai-agents' && (
              <motion.div key="ai-agents"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ height: '100%', overflow: 'hidden' }}
              >
                <Suspense fallback={<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" style={{ color: C.gold }} /></div>}>
                  <AIAgentEngine onOpenBrowser={() => startTransition(() => setMainView('browser'))} />
                </Suspense>
              </motion.div>
            )}

            {mainView === 'browser' && (
              <motion.div key="browser"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ height: '100%', overflow: 'hidden' }}
              >
                <Suspense fallback={<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" style={{ color: C.blue }} /></div>}>
                  <CloudBrowser />
                </Suspense>
              </motion.div>
            )}

            {mainView === 'desktop' && (
              <motion.div key="desktop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ height: '100%', position: 'relative' }}
              >
                <CloudDesktopView
                  agentWindows={windows}
                  agents={AGENTS}
                  onOpenAgent={openAgent}
                  onCloseAgentWindow={closeWindow}
                  onMinimizeAgentWindow={minimizeWindow}
                  onMaximizeAgentWindow={maximizeWindow}
                  onFocusAgentWindow={focusWindow}
                  onMoveAgentWindow={moveWindow}
                  onResizeAgentWindow={resizeWindow}
                  timeStr={timeStr}
                  dateStr={dateStr}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM TASKBAR — removed */}
      </motion.div>
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════
// Top Bar
// ═══════════════════════════════════════════════════════
function TopBar({ displayName, timeStr, dateStr, runningCount, isFullScreen, onToggleSize, onClose, onGoHome }: {
  displayName: string; timeStr: string; dateStr: string; runningCount: number;
  isFullScreen: boolean; onToggleSize?: () => void; onClose: () => void; onGoHome: () => void;
}) {
  return (
    <div style={{
      background: `linear-gradient(180deg, #E8F4FD 0%, ${C.surface} 100%)`,
      borderBottom: `1px solid ${C.border}`,
      padding: '8px 14px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <motion.div
          whileHover={{ scale: 1.08, rotate: 3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGoHome}
          style={{
            width: 38, height: 38, borderRadius: 11,
            background: `linear-gradient(135deg, ${C.goldSoft}, ${C.blueSoft})`,
            border: `1px solid ${C.goldBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', overflow: 'hidden',
            boxShadow: `0 0 16px ${C.goldBorder}`,
          }}
        >
          <img src={wayakCharacterImg} alt="وياك" style={{ width: 28, height: 28, objectFit: 'contain' }} />
        </motion.div>

        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.text, lineHeight: 1.3 }}>
            {displayName ? (
              <>وياك — <span style={{ color: C.gold }}>{displayName}</span></>
            ) : 'وياك'}
          </div>
          <div style={{ fontSize: 14, color: C.textDim, fontWeight: 600, letterSpacing: 0.3 }}>
            Cloud Computer · الوكيل التنفيذي الذكي
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '3px 8px', borderRadius: 20,
          background: C.blueSoft, border: `1px solid ${C.blueBorder}`,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.blue, boxShadow: `0 0 6px ${C.blue}` }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: C.blue }}>ACTIVE</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: 14, color: C.text, fontFamily: fontMono, fontWeight: 700, direction: 'ltr' }}>{timeStr}</span>
          <span style={{ fontSize: 14, color: C.textDim, fontWeight: 600 }}>{dateStr}</span>
        </div>

        <div style={{ width: 1, height: 18, background: C.border }} />

        {onToggleSize && (
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onToggleSize}
            style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(0,0,0,0.05)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            {isFullScreen
              ? <Minimize2 style={{ width: 11, height: 11, color: C.textDim }} />
              : <Maximize2 style={{ width: 11, height: 11, color: C.textDim }} />}
          </motion.button>
        )}

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
          style={{ width: 26, height: 26, borderRadius: 7, background: C.redSoft, border: `1px solid rgba(239,68,68,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X style={{ width: 11, height: 11, color: C.red }} />
        </motion.button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Session Handoff Bar
// ═══════════════════════════════════════════════════════
function SessionHandoffBar({ session, onTakeControl, onHandToAgent, onPause, onResume }: {
  session: SessionState;
  onTakeControl: () => void;
  onHandToAgent: () => void;
  onPause: () => void;
  onResume: () => void;
}) {
  const { controlState, currentTask, currentStep, totalSteps, activeApp, pausedReason } = session;
  if (controlState === 'user_controlled' && !currentTask) return null;

  const STATE_CONFIG: Record<ControlState, { bg: string; border: string; dot: string; label: string }> = {
    agent_controlled: { bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.22)', dot: C.blue,   label: 'الوكيل يتحكم' },
    user_controlled:  { bg: 'rgba(22,163,74,0.08)',  border: 'rgba(22,163,74,0.22)',   dot: '#16A34A', label: 'تحكم المستخدم' },
    shared_control:   { bg: 'rgba(184,134,11,0.08)', border: 'rgba(184,134,11,0.22)',  dot: C.gold,   label: 'تحكم مشترك' },
    paused:           { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.22)',  dot: C.amber,  label: 'موقوف مؤقتاً' },
  };
  const cfg = STATE_CONFIG[controlState];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ flexShrink: 0, background: cfg.bg, borderBottom: `1px solid ${cfg.border}`, overflow: 'hidden' }}
    >
      <div style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 10, direction: 'rtl' }}>
        {/* State indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}`, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.text, fontFamily: fontCairo }}>{cfg.label}</span>
        </div>

        {/* Task info */}
        {currentTask && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 11.5, color: C.textDim, fontFamily: fontCairo, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
              {activeApp && <span style={{ color: C.blue, fontWeight: 700 }}>[{activeApp}] </span>}
              {currentTask}
            </span>
            {totalSteps > 0 && (
              <div style={{ marginTop: 2, height: 2, background: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(currentStep / totalSteps) * 100}%`, background: cfg.dot, transition: 'width 0.4s ease', borderRadius: 2 }} />
              </div>
            )}
          </div>
        )}
        {pausedReason && !currentTask && (
          <span style={{ flex: 1, fontSize: 11, color: C.textDim, fontFamily: fontCairo }}>{pausedReason}</span>
        )}

        {/* Control buttons */}
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          {controlState === 'agent_controlled' && (
            <>
              <HandoffBtn label="استلام التحكم" color={C.amber} onClick={onTakeControl} />
              <HandoffBtn label="إيقاف" color={C.red} onClick={onPause} />
            </>
          )}
          {controlState === 'paused' && (
            <>
              <HandoffBtn label="استئناف التنفيذ" color={C.blue} onClick={onResume} />
              <HandoffBtn label="استلام التحكم" color={C.amber} onClick={onTakeControl} />
            </>
          )}
          {controlState === 'shared_control' && (
            <>
              <HandoffBtn label="تسليم للوكيل" color={C.blue} onClick={onHandToAgent} />
              <HandoffBtn label="إيقاف" color={C.red} onClick={onPause} />
            </>
          )}
          {controlState === 'user_controlled' && currentTask && (
            <HandoffBtn label="تسليم للوكيل" color={C.blue} onClick={onHandToAgent} />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function HandoffBtn({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        padding: '4px 10px', borderRadius: 7, border: `1px solid ${color}30`,
        background: `${color}15`, color, fontFamily: fontCairo, fontSize: 11, fontWeight: 700,
        cursor: 'pointer', flexShrink: 0,
      }}
    >
      {label}
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════
// Dashboard View
// ═══════════════════════════════════════════════════════
function DashboardView({ tasks, totalTasks, pendingCount, runningCount, doneCount, isLoading, onOpenAgent, displayName, onGoToChat, onGoToDesktop }: {
  tasks: Task[]; totalTasks: number; pendingCount: number; runningCount: number; doneCount: number;
  isLoading: boolean; onOpenAgent: (id: AgentId) => void; displayName: string;
  onGoToChat: () => void; onGoToDesktop: () => void;
}) {
  const CONNECTIONS = [
    { name: 'Gmail', icon: Mail, connected: true },
    { name: 'Outlook', icon: Mail, connected: false },
    { name: 'Notion', icon: FileText, connected: false },
    { name: 'Slack', icon: MessageCircle, connected: false },
    { name: 'WhatsApp', icon: MessageCircle, connected: true },
    { name: 'QuickBooks', icon: BarChart3, connected: false },
  ];

  const TASK_PIPELINE = [
    { label: 'استلام الطلب', icon: ArrowUp, done: true },
    { label: 'تحليل المهمة', icon: Search, done: true },
    { label: 'تحديد الوكيل', icon: Cpu, done: true },
    { label: 'تنفيذ الإجراء', icon: Play, done: runningCount > 0 },
    { label: 'إرسال النتيجة', icon: CheckCircle, done: doneCount > 0 },
  ];

  const STATUS_CARDS = [
    { label: 'إجمالي المهام', value: totalTasks, icon: Activity, accent: C.blue },
    { label: 'جارية الآن',    value: runningCount, icon: Loader2, accent: C.blue, spin: true },
    { label: 'في الانتظار',   value: pendingCount, icon: Clock, accent: C.amber },
    { label: 'مكتملة',       value: doneCount, icon: CheckCircle, accent: C.gold },
  ];

  return (
    <div style={{ padding: '14px', fontFamily: fontCairo }}>

      {/* Welcome Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{
          ...panel({ marginBottom: 12, padding: '16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }),
          background: `linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(59,91,254,0.06) 100%)`,
          border: `1px solid ${C.goldBorder}`,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.06), transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <img src={wayakCharacterImg} alt="" style={{ width: 40, height: 40, objectFit: 'contain', margin: '0 auto 8px' }} />
          <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 3 }}>
            Weyak Agent Runtime Environment
          </div>
          <div style={{ fontSize: 16, color: C.textDim, marginBottom: 12 }}>
            نظام تشغيل متكامل للوكلاء — وليس مجرد شات
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onGoToChat}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 8, background: C.goldSoft, border: `1px solid ${C.goldBorder}`, cursor: 'pointer', fontFamily: fontCairo }}>
              <MessageSquare style={{ width: 12, height: 12, color: C.gold }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: C.gold }}>ابدأ محادثة</span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onGoToDesktop}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 8, background: C.blueSoft, border: `1px solid ${C.blueBorder}`, cursor: 'pointer', fontFamily: fontCairo }}>
              <Monitor style={{ width: 12, height: 12, color: C.blue }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: C.blue }}>افتح سطح المكتب</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
        {STATUS_CARDS.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ ...panel({ padding: '10px 12px', textAlign: 'center' }), borderColor: `${card.accent}25` }}>
            <card.icon
              style={{ width: 18, height: 18, color: card.accent, margin: '0 auto 4px' }}
              className={card.spin && runningCount > 0 ? 'animate-spin' : ''}
            />
            <div style={{ fontSize: 22, fontWeight: 800, color: card.accent, lineHeight: 1.1 }}>{card.value}</div>
            <div style={{ fontSize: 14, color: C.textDim, fontWeight: 600, marginTop: 2 }}>{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        {/* Task Pipeline */}
        <div style={panel()}>
          {sectionTitle('محرك المهام', Activity, C.blue)}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {TASK_PIPELINE.map((step, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 8px', borderRadius: 8,
                background: step.done ? C.blueSoft : 'rgba(255,255,255,0.02)',
                border: `1px solid ${step.done ? C.blueBorder : 'transparent'}`,
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  background: step.done ? C.blue : 'rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <step.icon style={{ width: 10, height: 10, color: step.done ? '#fff' : C.textDim }} />
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: step.done ? C.text : C.textDim }}>{step.label}</span>
                {step.done && (
                  <div style={{ marginRight: 'auto', width: 5, height: 5, borderRadius: '50%', background: C.blue, boxShadow: `0 0 6px ${C.blue}` }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Agent Manager */}
        <div style={panel()}>
          {sectionTitle('مدير الوكلاء', Users, C.gold)}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {AGENTS.map(agent => (
              <motion.button key={agent.id} whileHover={{ scale: 1.02, x: -2 }} whileTap={{ scale: 0.98 }}
                onClick={() => onOpenAgent(agent.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 9,
                  background: 'rgba(0,0,0,0.03)', border: `1px solid ${C.border}`,
                  cursor: 'pointer', fontFamily: fontCairo, textAlign: 'right',
                }}
              >
                <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: C.blueSoft, border: `1px solid ${C.blueBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <agent.icon style={{ width: 13, height: 13, color: C.blue }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.title}</div>
                  <div style={{ fontSize: 14, color: C.textDim }}>{agent.subtitle}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Sparkles style={{ width: 9, height: 9, color: C.gold }} />
                </div>
              </motion.button>
            ))}
            <motion.button whileHover={{ scale: 1.02 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '6px', borderRadius: 8, border: `1px dashed ${C.border}`, background: 'transparent', cursor: 'pointer', fontFamily: fontCairo }}>
              <Plus style={{ width: 10, height: 10, color: C.textDim }} />
              <span style={{ fontSize: 11.5, color: C.textDim, fontWeight: 600 }}>وكيل جديد</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        {/* Cloud Computer Preview */}
        <div style={panel()}>
          {sectionTitle('الكمبيوتر السحابي', Monitor, C.blue)}
          <div style={{ borderRadius: 10, overflow: 'hidden', background: 'rgba(59,91,254,0.05)', border: `1px solid ${C.blueBorder}`, padding: '8px', marginBottom: 8 }}>
            <MiniDesktopPreview onGoToDesktop={onGoToDesktop} />
          </div>
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {['Terminal', 'Browser', 'Files', 'AI Agents'].map(cap => (
              <span key={cap} style={{ fontSize: 16, color: C.textDim, background: 'rgba(0,0,0,0.04)', borderRadius: 4, padding: '2px 5px' }}>{cap}</span>
            ))}
          </div>
        </div>

        {/* Active Connections */}
        <div style={panel()}>
          {sectionTitle('الاتصالات النشطة', Plug, C.gold)}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
            {CONNECTIONS.map((conn, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '7px 4px', borderRadius: 8, cursor: 'pointer',
                background: conn.connected ? C.blueSoft : 'rgba(255,255,255,0.03)',
                border: `1px solid ${conn.connected ? C.blueBorder : 'transparent'}`,
              }}>
                <conn.icon style={{ width: 13, height: 13, color: conn.connected ? C.blue : C.textMut }} />
                <span style={{ fontSize: 16, fontWeight: 600, color: conn.connected ? C.text : C.textDim, textAlign: 'center' }}>{conn.name}</span>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: conn.connected ? C.blue : 'rgba(255,255,255,0.10)', boxShadow: conn.connected ? `0 0 5px ${C.blue}` : 'none' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div style={panel()}>
          {sectionTitle('الذاكرة وقواعد البيانات', Database, C.blue)}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {AGENTS.map(agent => (
              <div key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}` }}>
                <Database style={{ width: 10, height: 10, color: C.blue, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: C.text }}>ذاكرة: {agent.subtitle}</div>
                  <div style={{ fontSize: 16, color: C.textDim }}>leads / history / context</div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 8, background: C.goldSoft, border: `1px solid ${C.goldBorder}` }}>
              <Server style={{ width: 10, height: 10, color: C.gold }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: C.gold }}>SQL · Supabase Database</span>
            </div>
          </div>
        </div>

        <div style={panel()}>
          {sectionTitle('الحالة والفوترة', Shield, C.gold)}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { label: 'Current Status', value: 'ACTIVE', accent: C.blue, badge: true },
              { label: 'Active Agents',  value: String(AGENTS.length), accent: C.text },
              { label: 'Running Tasks',  value: String(runningCount), accent: C.blue },
              { label: 'Total Tasks',    value: String(totalTasks), accent: C.text },
              { label: 'Credits Used',   value: tasks.reduce((s, t) => s + (t.cost_coins || 0), 0).toLocaleString(), accent: C.gold },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: i < 4 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                <span style={{ fontSize: 14, color: C.textDim, fontWeight: 600 }}>{row.label}</span>
                <span style={{
                  fontSize: row.badge ? 7 : 9, fontWeight: 800, color: row.accent,
                  ...(row.badge ? { background: C.blueSoft, border: `1px solid ${C.blueBorder}`, borderRadius: 4, padding: '1px 6px' } : {}),
                }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <motion.div whileHover={{ scale: 1.01 }} onClick={onGoToChat}
        style={{ ...panel({ cursor: 'pointer', padding: '14px 16px' }), background: `linear-gradient(135deg, ${C.goldSoft}, ${C.blueSoft})`, border: `1px solid ${C.goldBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <img src={wayakCharacterImg} alt="وياك" style={{ width: 30, height: 30, objectFit: 'contain' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.gold }}>نواة وياك التنفيذية</div>
            <div style={{ fontSize: 14, color: C.textDim }}>الشات يرد — وياك ينفذ</div>
          </div>
          <Zap style={{ width: 16, height: 16, color: C.gold, marginRight: 'auto' }} />
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Mini Desktop Preview (in dashboard)
// ═══════════════════════════════════════════
function MiniDesktopPreview({ onGoToDesktop }: { onGoToDesktop: () => void }) {
  return (
    <div style={{ borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
      {/* Mini desktop background */}
      <div style={{
        width: '100%', height: 70, position: 'relative',
        background: 'radial-gradient(ellipse at 30% 60%, #c0392b 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, #1565c0 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, #e67e22 0%, transparent 60%), #1a0a2e',
      }}>
        {/* Mini dock */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 14, background: 'rgba(20,20,30,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 2px' }}>
          <div style={{ width: 9, height: 9, borderRadius: 3, background: '#4285F4' }} />
          <div style={{ width: 9, height: 9, borderRadius: 3, background: '#2d2d3a', border: '0.5px solid rgba(255,255,255,0.2)' }} />
          <div style={{ width: 9, height: 9, borderRadius: 3, background: '#2d2d3a', border: '0.5px solid rgba(255,255,255,0.2)' }} />
        </div>
        {/* Mini terminal window */}
        <div style={{ position: 'absolute', left: 18, top: 8, width: 70, height: 48, borderRadius: 4, background: '#1a0a2e', border: '0.5px solid rgba(255,255,255,0.2)', overflow: 'hidden' }}>
          <div style={{ background: '#2d2d3a', height: 9, display: 'flex', alignItems: 'center', paddingLeft: 4, gap: 2 }}>
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#3B5BFE' }} />
          </div>
          <div style={{ padding: '3px 4px', fontFamily: fontMono, fontSize: 5, color: '#5bc8f5', lineHeight: 1.4 }}>
            user@cloud:~$<br/>
            <span style={{ color: '#e0e0e0' }}>ls -la</span>
          </div>
        </div>
        {/* Mini top bar */}
        <div style={{ position: 'absolute', top: 0, left: 14, right: 0, height: 7, background: 'rgba(15,15,25,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 5, color: 'rgba(255,255,255,0.6)', fontFamily: fontMono }}>Mar 8  15:33</span>
        </div>
      </div>
      {/* Open button */}
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onGoToDesktop}
        style={{ width: '100%', padding: '5px', borderRadius: '0 0 7px 7px', background: C.blue, border: 'none', cursor: 'pointer', fontFamily: fontCairo, fontSize: 14, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <Play style={{ width: 9, height: 9 }} /> فتح سطح المكتب السحابي
      </motion.button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Chat View — مع Computer Preview
// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════
// Agent Routing — maps request keywords to agents
// ═══════════════════════════════════════════
interface AgentRoute {
  agentName: string;
  agentColor: string;
  agentIcon: LucideIcon;
  response: string;
}
const AGENT_ROUTES: Array<{ keywords: string[]; route: AgentRoute }> = [
  {
    keywords: ['حلّل', 'تحليل', 'أداء', 'بيانات', 'تقرير', 'إحصائيات'],
    route: { agentName: 'وكيل التحليل', agentColor: '#6366f1', agentIcon: BarChart2,
      response: 'تم إجراء التحليل الكامل. درجة الصحة الرقمية: 78/100 ✓\n\n📊 النتائج الرئيسية:\n• معدل التحويل: 3.2% (أعلى من المتوسط)\n• أكثر الصفحات زيارةً: الخدمات والتواصل\n• فرص تحسين الظهور: 12 كلمة مفتاحية عالية الأثر\n\n💡 التوصية الأولى: تفعيل إعلانات Google للمقاولين في أبوظبي.' },
  },
  {
    keywords: ['اكتب', 'محتوى', 'منشور', 'إنستغرام', 'تيك توك', 'سوشيال'],
    route: { agentName: 'وكيل المحتوى', agentColor: '#ec4899', agentIcon: Megaphone,
      response: 'تم إنشاء المحتوى المطلوب ✓\n\n✍️ منشور إنستغرام:\n"بيت الريف — حيث تلتقي الأصالة بالجودة العصرية. نقدم لكم أفضل الخدمات في الإمارات بخبرة تمتد لأكثر من 10 سنوات. 🏡✨\n\n📞 تواصل معنا الآن\n#بيت_الريف #الإمارات #عقارات"\n\n🖼 3 صور مقترحة جاهزة للتصميم.' },
  },
  {
    keywords: ['كلمات مفتاحية', 'سيو', 'SEO', 'بحث', 'ظهور', 'جوجل'],
    route: { agentName: 'وكيل السيو', agentColor: '#10b981', agentIcon: Search,
      response: 'تحليل الكلمات المفتاحية مكتمل ✓\n\n🔍 أفضل 5 كلمات مفتاحية:\n1. "خدمات بناء ابوظبي" — 2,400/شهر | منافسة: منخفضة\n2. "مقاول معتمد الإمارات" — 1,800/شهر | منافسة: متوسطة\n3. "تشطيبات فلل دبي" — 3,200/شهر | منافسة: عالية\n4. "شركة صيانة الشارقة" — 980/شهر | منافسة: منخفضة\n5. "ترميم منازل الإمارات" — 1,100/شهر | منافسة: منخفضة\n\n⚡ الأولوية: الكلمتان 1 و4 للنتائج السريعة.' },
  },
  {
    keywords: ['بيت الريف', 'الموقع', 'افتح', 'تصفح', 'رابط'],
    route: { agentName: 'وكيل المتصفح', agentColor: '#3b82f6', agentIcon: Globe,
      response: 'تم فتح الموقع وتحليله ✓\n\n🌐 bietalreef.ae\n• سرعة التحميل: 2.3s (تحتاج تحسين)\n• درجة SEO: 71/100\n• الصفحات المفهرسة: 24\n• آخر تحديث: منذ 3 أيام\n\n⚠️ 3 مشكلات وجدتها:\n1. صور بدون Alt text (14 صورة)\n2. Meta description مكررة في صفحتين\n3. رابط مكسور في صفحة الخدمات' },
  },
  {
    keywords: ['مهمة', 'نفّذ', 'اعمل', 'ابدأ', 'قم بـ', 'اعمل على'],
    route: { agentName: 'وكيل التنفيذ', agentColor: C.gold, agentIcon: Zap,
      response: 'تم تنفيذ المهمة بنجاح ✓\n\n⚙️ الخطوات المنجزة:\n1. ✅ تحليل المتطلبات\n2. ✅ إعداد خطة التنفيذ\n3. ✅ تنفيذ المهمة\n4. ✅ مراجعة النتائج\n\n📋 التقرير النهائي جاهز. يمكنني تكرار هذه المهمة تلقائياً كل يوم إذا أردت.' },
  },
];

const DEFAULT_ROUTE: AgentRoute = {
  agentName: 'وياك العام',
  agentColor: C.gold,
  agentIcon: Sparkles,
  response: 'فهمت طلبك وأقوم بمعالجته الآن. لقد حللت طلبك وجهزت لك خطة عمل متكاملة. هل تريد أن أبدأ بالتنفيذ الفوري، أم تفضل مراجعة الخطة أولاً؟',
};

function routeRequest(text: string): AgentRoute {
  for (const { keywords, route } of AGENT_ROUTES) {
    if (keywords.some(k => text.includes(k))) return route;
  }
  return DEFAULT_ROUTE;
}

function genTaskId(): string {
  return `TSK-${Math.floor(1000 + Math.random() * 9000)}`;
}

function estimateTokens(text: string): number {
  // rough estimate: 1 token ≈ 4 chars Arabic
  return Math.max(50, Math.round(text.length * 0.6) + Math.floor(120 + Math.random() * 280));
}

// WAYAK_THREAD_KEY and agent logic imported from ../../lib/wayak-agent

function ChatView({ onOpenAgent, onOpenDesktop, onStartAgentTask }: { onOpenAgent: (id: AgentId) => void; onOpenDesktop: () => void; onStartAgentTask?: (task: string, steps?: number, app?: string) => void }) {
  // Load shared thread from localStorage
  const [thread, setThread] = useState<Array<{role: string; content: string}>>(() => {
    try {
      const raw = localStorage.getItem(WAYAK_THREAD_KEY);
      if (raw) return JSON.parse(raw).filter((m: any) => m.role === 'user' || m.role === 'assistant');
    } catch {}
    return [];
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = localStorage.getItem(WAYAK_THREAD_KEY);
      if (raw) {
        const parsed = JSON.parse(raw).filter((m: any) => m.role === 'user' || m.role === 'assistant');
        if (parsed.length > 0) {
          return parsed.map((m: any, i: number) => ({
            id: `loaded-${i}`,
            role: m.role === 'assistant' ? 'wayak' : 'user',
            content: m.content,
            timestamp: new Date(),
            status: 'sent',
          } as ChatMessage));
        }
      }
    } catch {}
    return INITIAL_MESSAGES;
  });

  const [wayakKey] = useState<string>(getStoredApiKey);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [platformStats, setPlatformStats] = useState<any>(null);

  // Load platform stats for the agent system prompt
  useEffect(() => { getStats().then(setPlatformStats).catch(() => {}); }, []);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentId | 'wayak'>('wayak');
  const [computerPreview, setComputerPreview] = useState<{ url: string; title: string; show: boolean } | null>(null);
  const [totalTokens, setTotalTokens] = useState(0);
  const [tokenLimit] = useState(10000);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sync thread to localStorage whenever it changes
  useEffect(() => {
    if (thread.length > 0) {
      localStorage.setItem(WAYAK_THREAD_KEY, JSON.stringify(thread));
    }
  }, [thread]);

  const callAgent = async (userInput: string): Promise<{ reply: string; toolResults?: Array<{ name: string; result: string }> }> => {
    const key = wayakKey || getStoredApiKey();
    if (!key) return { reply: routeRequest(userInput).response };

    const updatedThread = [...thread, { role: 'user', content: userInput }];
    try {
      const result = await callWayakAgent(
        updatedThread.slice(-20),
        key,
        (url) => { setPreviewUrl(url); setPreviewLoading(true); },
        platformStats,
      );
      const newThread = [...updatedThread, { role: 'assistant', content: result.reply }];
      setThread(newThread);
      return result;
    } catch {
      const fallback = routeRequest(userInput).response;
      const newThread = [...updatedThread, { role: 'assistant', content: fallback }];
      setThread(newThread);
      return { reply: fallback };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userInput = input.trim();
    const taskId = genTaskId();
    const route = routeRequest(userInput);
    const startTime = Date.now();

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`, role: 'user', content: userInput, timestamp: new Date(), status: 'sent',
    };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setIsThinking(true);
    onStartAgentTask?.(userInput.slice(0, 50), 4, route.agentName);

    // 2. Inject task card — status: creating
    const taskMsgId = `task-${Date.now()}`;
    const taskCard: TaskCard = {
      id: taskId,
      status: 'creating',
      assignedAgent: route.agentName,
      agentIcon: route.agentIcon,
      agentColor: route.agentColor,
      steps: [
        { label: 'إنشاء المهمة', done: false, active: true },
        { label: 'تكليف الوكيل', done: false, active: false },
        { label: 'تنفيذ المهمة', done: false, active: false },
        { label: 'مكتمل', done: false, active: false },
      ],
    };
    setMessages(p => [...p, { id: taskMsgId, role: 'system', content: '', timestamp: new Date(), task: taskCard }]);

    // 3. assigning
    setTimeout(() => {
      setMessages(p => p.map(m => m.id === taskMsgId ? {
        ...m, task: { ...m.task!, status: 'assigning', steps: [
          { label: 'إنشاء المهمة', done: true, active: false },
          { label: 'تكليف الوكيل', done: false, active: true },
          { label: 'تنفيذ المهمة', done: false, active: false },
          { label: 'مكتمل', done: false, active: false },
        ]}
      } : m));
    }, 600);

    // 4. running
    setTimeout(() => {
      setMessages(p => p.map(m => m.id === taskMsgId ? {
        ...m, task: { ...m.task!, status: 'running', steps: [
          { label: 'إنشاء المهمة', done: true, active: false },
          { label: 'تكليف الوكيل', done: true, active: false },
          { label: 'تنفيذ المهمة', done: false, active: true },
          { label: 'مكتمل', done: false, active: false },
        ]}
      } : m));
    }, 1300);

    // 5. done + final response (real agent with function calling + n8n)
    const minDelay = new Promise<void>(r => setTimeout(r, 1400));
    const [agentResult] = await Promise.all([callAgent(userInput), minDelay]);

    const replyText = agentResult.reply;
    const tokensUsed = estimateTokens(userInput + replyText);
    const duration = Math.round((Date.now() - startTime) / 1000);
    const wantsComputer = userInput.includes('بيت الريف') || userInput.includes('الموقع') || userInput.includes('افتح') || userInput.includes('تصفح');

    // Update task card to done
    setMessages(p => p.map(m => m.id === taskMsgId ? {
      ...m, task: { ...m.task!, status: 'done', tokensUsed, duration, steps: [
        { label: 'إنشاء المهمة', done: true, active: false },
        { label: 'تكليف الوكيل', done: true, active: false },
        { label: 'تنفيذ المهمة', done: true, active: false },
        { label: 'مكتمل', done: true, active: false },
      ]}
    } : m));

    // Add agent response with tool results if any
    const toolInfo = agentResult.toolResults?.length
      ? `\n\n---\n🔧 أدوات مستخدمة: ${agentResult.toolResults.map(t => t.name).join('، ')}`
      : '';
    const wayakMsg: ChatMessage = {
      id: `w-${Date.now()}`,
      role: 'wayak',
      content: replyText + toolInfo,
      timestamp: new Date(),
      status: 'sent',
      computerPreview: wantsComputer ? { url: 'bietalreef.ae', title: 'Cloud Computer' } : undefined,
    };
    setMessages(p => [...p, wayakMsg]);
    setIsThinking(false);
    setTotalTokens(t => t + tokensUsed);

    if (wantsComputer) {
      setComputerPreview({ url: 'bietalreef.ae', title: 'Cloud Computer', show: true });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Open preview when computerPreview changes
  useEffect(() => {
    if (computerPreview?.show) {
      setPreviewUrl('https://bietalreef.ae');
    }
  }, [computerPreview?.show]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* API Key Banner */}
      {!wayakKey && (
        <div style={{
          padding: '8px 14px', background: C.amberSoft, borderBottom: `1px solid rgba(245,158,11,0.2)`,
          display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
        }}>
          <Zap style={{ width: 12, height: 12, color: C.amber, flexShrink: 0 }} />
          {showKeyInput ? (
            <>
              <input
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                placeholder="sk-..."
                style={{ flex: 1, padding: '4px 8px', borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, fontFamily: fontMono, outline: 'none', background: C.surface }}
              />
              <button onClick={() => {
                if (keyInput.startsWith('sk-')) {
                  localStorage.setItem('wayak_openai_key', keyInput);
                  setShowKeyInput(false);
                  // Reload to use key
                  (window as any).location?.reload?.();
                }
              }} style={{ padding: '4px 10px', borderRadius: 6, background: C.blue, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: fontCairo }}>
                حفظ
              </button>
            </>
          ) : (
            <>
              <span style={{ fontSize: 11, color: C.amber, fontWeight: 600, flex: 1 }}>لا يوجد مفتاح OpenAI — الوياك يعمل بردود مُعدَّة مسبقاً</span>
              <button onClick={() => setShowKeyInput(true)} style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(245,158,11,0.15)', color: C.amber, border: `1px solid rgba(245,158,11,0.3)`, cursor: 'pointer', fontSize: 10, fontWeight: 700, fontFamily: fontCairo }}>
                أضف مفتاح
              </button>
            </>
          )}
        </div>
      )}

      {/* Agent Selector */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
        borderBottom: `1px solid ${C.border}`,
        background: C.bg, flexShrink: 0,
      }}>
        <span style={{ fontSize: 14, color: C.textDim, fontWeight: 600 }}>التحدث مع:</span>
        {[
          { id: 'wayak' as const, label: 'وياك', icon: Sparkles },
          ...AGENTS.map(a => ({ id: a.id as AgentId | 'wayak', label: a.subtitle.split(' ')[0], icon: a.icon })),
        ].map(opt => {
          const isActive = selectedAgent === opt.id;
          return (
            <motion.button key={opt.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedAgent(opt.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20,
                background: isActive ? C.goldSoft : 'rgba(0,0,0,0.03)',
                border: `1px solid ${isActive ? C.goldBorder : C.border}`,
                cursor: 'pointer', fontFamily: fontCairo,
              }}>
              <opt.icon style={{ width: 10, height: 10, color: isActive ? C.gold : C.textDim }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: isActive ? C.gold : C.textDim }}>{opt.label}</span>
            </motion.button>
          );
        })}

        <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Token Counter */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 8,
            background: C.goldSoft, border: `1px solid ${C.goldBorder}`,
          }}>
            <Zap style={{ width: 8, height: 8, color: C.gold }} />
            <span style={{ fontSize: 14, color: C.gold, fontWeight: 700, fontFamily: fontMono }}>
              {totalTokens.toLocaleString()}/{(tokenLimit/1000).toFixed(0)}k
            </span>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setMessages(INITIAL_MESSAGES); setTotalTokens(0); }}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 7, background: 'transparent', border: `1px solid ${C.border}`, cursor: 'pointer', fontFamily: fontCairo }}>
            <RefreshCw style={{ width: 9, height: 9, color: C.textDim }} />
            <span style={{ fontSize: 14, color: C.textDim }}>جديد</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content Row: Chat + Preview Panel */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

      {/* Chat Column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', position: 'relative',
        background: C.bgDesk,
      }}>
        {/* preview moved to side panel */}
        {false && (<div>
              {/* Card title bar */}
              <div style={{
                background: '#f5f5f5', padding: '8px 12px',
                display: 'flex', alignItems: 'center', gap: 8,
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                direction: 'ltr',
              }}>
                <Monitor style={{ width: 14, height: 14, color: '#333' }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#333', flex: 1 }}>Cloud Computer</span>
                <button onClick={() => setComputerPreview(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                  <X style={{ width: 12, height: 12, color: '#666' }} />
                </button>
              </div>
              {/* Simulated browser content */}
              <div style={{ height: 120, position: 'relative', overflow: 'hidden',
                background: 'radial-gradient(ellipse at 30% 60%, #c0392b 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, #1565c0 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, #e67e22 0%, transparent 60%), #1a0a2e',
              }}>
                {/* Mini desktop */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 20, background: 'rgba(20,20,30,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '6px 2px' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 4, background: '#4285F4' }} />
                  <div style={{ width: 12, height: 12, borderRadius: 4, background: '#2d2d3a', border: '0.5px solid rgba(255,255,255,0.2)' }} />
                </div>
                {/* Browser window preview */}
                <div style={{ position: 'absolute', left: 24, top: 10, right: 8, height: 96, borderRadius: 6, background: '#fff', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div style={{ background: '#f0f0f0', height: 18, display: 'flex', alignItems: 'center', paddingLeft: 6, gap: 3, direction: 'ltr' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#6b7280' }} />
                    <div style={{ flex: 1, background: '#e0e0e0', borderRadius: 3, height: 10, margin: '0 4px', display: 'flex', alignItems: 'center', paddingLeft: 4 }}>
                      <span style={{ fontSize: 6, color: '#666' }}>bietalreef.ae</span>
                    </div>
                  </div>
                  <div style={{ padding: 6, background: '#1a2744' }}>
                    <div style={{ background: C.gold, height: 4, borderRadius: 2, width: '60%', marginBottom: 3 }} />
                    <div style={{ background: 'rgba(255,255,255,0.2)', height: 3, borderRadius: 2, width: '80%', marginBottom: 2 }} />
                    <div style={{ background: 'rgba(255,255,255,0.2)', height: 3, borderRadius: 2, width: '70%' }} />
                  </div>
                </div>
                {/* Status indicator */}
                <div style={{ position: 'absolute', bottom: 6, left: 28, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.blue, boxShadow: `0 0 6px ${C.blue}` }} />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontFamily: fontMono }}>loading...</span>
                </div>
              </div>
              {/* Actions */}
              <div style={{ padding: '8px 12px', display: 'flex', gap: 8, direction: 'ltr', alignItems: 'center' }}>
                <button onClick={onOpenDesktop}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 6,
                    background: 'rgba(59,91,254,0.08)', border: '1px solid rgba(59,91,254,0.2)',
                    cursor: 'pointer', fontSize: 14, color: C.blue, fontWeight: 600,
                  }}>
                  <Square style={{ width: 11, height: 11 }} />
                  Open in Desktop
                </button>
                <span style={{ fontSize: 16, color: '#666', flex: 1 }}>bietalreef.ae</span>
              </div>
            </div>
          )}

        <AnimatePresence initial={false}>
          {messages.map(msg => {
            // ── Task Card (system message with task data) ──────────────────
            if (msg.role === 'system' && msg.task) {
              const tk = msg.task;
              const AgIcon = tk.agentIcon || Sparkles;
              const isDone = tk.status === 'done';
              const isFailed = tk.status === 'failed';
              return (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginBottom: 10 }}
                >
                  <div style={{
                    borderRadius: 12,
                    border: `1px solid ${isDone ? 'rgba(212,175,55,0.25)' : isFailed ? 'rgba(239,68,68,0.25)' : C.border}`,
                    background: isDone ? C.goldSoft : C.surface,
                    overflow: 'hidden',
                  }}>
                    {/* Task header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ width: 22, height: 22, borderRadius: 7, background: `${tk.agentColor}18`, border: `1px solid ${tk.agentColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <AgIcon style={{ width: 11, height: 11, color: tk.agentColor }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: C.textDim, fontFamily: fontMono }}>{tk.id}</span>
                          <span style={{ fontSize: 14, color: tk.agentColor, fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: `${tk.agentColor}18` }}>
                            {tk.assignedAgent}
                          </span>
                        </div>
                      </div>
                      {/* Status badge */}
                      {isDone ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <CheckCircle style={{ width: 11, height: 11, color: C.gold }} />
                          <span style={{ fontSize: 14, color: C.gold, fontWeight: 700 }}>مكتمل</span>
                        </div>
                      ) : isFailed ? (
                        <AlertCircle style={{ width: 11, height: 11, color: C.red }} />
                      ) : (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
                          <Loader2 style={{ width: 11, height: 11, color: C.blue }} />
                        </motion.div>
                      )}
                    </div>
                    {/* Steps — vertical list */}
                    <div style={{ padding: '6px 12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {tk.steps.map((step, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                            background: step.done ? C.gold : step.active ? C.blue : 'transparent',
                            border: `1.5px solid ${step.done ? C.gold : step.active ? C.blue : C.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: step.active ? `0 0 6px ${C.blue}50` : 'none',
                          }}>
                            {step.done && <CheckCircle style={{ width: 8, height: 8, color: '#fff' }} />}
                            {step.active && (
                              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.7, repeat: Infinity }}
                                style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />
                            )}
                          </div>
                          <span style={{ fontSize: 12, color: step.done ? C.gold : step.active ? C.blue : C.textMut, fontFamily: fontCairo, fontWeight: step.active ? 700 : 500 }}>
                            {step.label}
                          </span>
                          {i < tk.steps.length - 1 && step.done && (
                            <div style={{ flex: 1, height: 1, background: `${C.gold}40` }} />
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Token + duration footer */}
                    {isDone && tk.tokensUsed && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderTop: `1px solid ${C.border}`, background: C.bg }}>
                        <Zap style={{ width: 8, height: 8, color: C.gold }} />
                        <span style={{ fontSize: 14, color: C.textDim, fontFamily: fontMono }}>{tk.tokensUsed.toLocaleString()} tokens</span>
                        <Clock style={{ width: 8, height: 8, color: C.textMut, marginRight: 'auto' }} />
                        <span style={{ fontSize: 14, color: C.textMut, fontFamily: fontMono }}>{tk.duration}s</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            }

            // ── Regular chat message ─────────────────────────────────────
            const isUser = msg.role === 'user';
            return (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 10,
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                {/* Agent avatar — left side only */}
                {!isUser && (
                  <div style={{ width: 28, height: 28, borderRadius: 9, background: C.goldSoft, border: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img src={wayakCharacterImg} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                  </div>
                )}

                <div style={{ maxWidth: '72%' }}>
                  <div style={{
                    padding: '10px 13px',
                    borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: isUser
                      ? `linear-gradient(135deg, ${C.blue}, #0284c7)`
                      : C.surface,
                    border: isUser ? 'none' : `1px solid ${C.border}`,
                    boxShadow: isUser ? `0 3px 12px rgba(14,165,233,0.22)` : '0 1px 3px rgba(0,0,0,0.06)',
                  }}>
                    <p style={{ fontSize: 14, color: isUser ? '#fff' : C.text, lineHeight: 1.65, margin: 0, fontWeight: isUser ? 600 : 500, whiteSpace: 'pre-line' }}>
                      {msg.content}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3, justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 10, color: isUser ? 'rgba(255,255,255,0.55)' : C.textMut }}>
                        {msg.timestamp.toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {isThinking && (
            <motion.div key="thinking" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 9, background: C.goldSoft, border: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={wayakCharacterImg} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
              </div>
              <div style={{ padding: '10px 14px', borderRadius: '14px 14px 14px 4px', background: 'rgba(0,0,0,0.05)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 5 }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding: '8px 12px 0', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0, background: C.bgDesk }}>
          {WAYAK_SUGGESTIONS.map((s, i) => (
            <motion.button key={i} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setInput(s); inputRef.current?.focus(); }}
              style={{ padding: '5px 10px', borderRadius: 20, background: C.blueSoft, border: `1px solid ${C.blueBorder}`, cursor: 'pointer', fontFamily: fontCairo, whiteSpace: 'nowrap', flexShrink: 0 }}>
              <span style={{ fontSize: 14, color: C.blue, fontWeight: 600 }}>{s}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div style={{
        padding: '10px 12px',
        borderTop: `1px solid ${C.border}`,
        background: C.surface,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0,0,0,0.05)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <Paperclip style={{ width: 14, height: 14, color: C.textDim }} />
          </motion.button>

          {/* Computer Use Button */}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onOpenDesktop}
            style={{ width: 34, height: 34, borderRadius: 10, background: C.blueSoft, border: `1px solid ${C.blueBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
            title="Computer Use">
            <Monitor style={{ width: 14, height: 14, color: C.blue }} />
          </motion.button>

          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب رسالتك لوياك... (Enter للإرسال)"
              rows={1}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '9px 12px', borderRadius: 10,
                background: 'rgba(0,0,0,0.05)',
                border: `1px solid ${input ? C.blueBorder : C.border}`,
                color: C.text, fontSize: 14, fontFamily: fontCairo, direction: 'rtl',
                resize: 'none', outline: 'none',
                transition: 'border-color 0.2s',
                minHeight: 38, maxHeight: 100,
              }}
            />
          </div>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0,0,0,0.05)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <Mic style={{ width: 14, height: 14, color: C.textDim }} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            style={{
              width: 38, height: 38, borderRadius: 11, flexShrink: 0,
              background: input.trim() && !isThinking ? C.blue : 'rgba(0,0,0,0.07)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !isThinking ? 'pointer' : 'default',
              boxShadow: input.trim() && !isThinking ? `0 4px 14px rgba(59,91,254,0.35)` : 'none',
              transition: 'all 0.2s',
            }}
          >
            {isThinking
              ? <Loader2 className="animate-spin" style={{ width: 15, height: 15, color: C.textDim }} />
              : <Send style={{ width: 15, height: 15, color: input.trim() ? '#fff' : C.textDim }} />}
          </motion.button>
        </div>

        {/* Agent shortcuts */}
        <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap', alignItems: 'center' }}>
          <Zap style={{ width: 9, height: 9, color: C.textDim }} />
          <span style={{ fontSize: 14, color: C.textDim, fontWeight: 600 }}>Advanced</span>
          {AGENTS.map(agent => (
            <motion.button key={agent.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => onOpenAgent(agent.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 6, background: C.blueSoft, border: `1px solid ${C.blueBorder}`, cursor: 'pointer', fontFamily: fontCairo }}>
              <agent.icon style={{ width: 9, height: 9, color: C.blue }} />
              <span style={{ fontSize: 14, color: C.blue, fontWeight: 600 }}>{agent.subtitle}</span>
            </motion.button>
          ))}
        </div>
      </div>
      {/* ── END Chat Column ── */}
      </div>

      {/* ── Preview Panel (side) ── */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '42%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden',
              borderRight: `1px solid ${C.border}`,
              background: C.surface,
            }}
          >
            {/* Panel title bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
              background: C.surfaceHi, borderBottom: `1px solid ${C.border}`,
              flexShrink: 0, direction: 'ltr',
            }}>
              <Globe style={{ width: 13, height: 13, color: C.blue }} />
              <span style={{ flex: 1, fontSize: 11, fontWeight: 700, color: C.text, fontFamily: fontMono, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {previewUrl.replace('https://', '')}
              </span>
              {/* URL input */}
              <input
                defaultValue={previewUrl}
                onKeyDown={e => { if (e.key === 'Enter') { setPreviewUrl((e.target as HTMLInputElement).value); setPreviewLoading(true); } }}
                style={{ flex: 1, maxWidth: 160, padding: '3px 7px', borderRadius: 5, border: `1px solid ${C.border}`, fontSize: 10, fontFamily: fontMono, outline: 'none', background: C.bg, color: C.text }}
              />
              <button onClick={() => onOpenDesktop()} title="افتح في سطح المكتب"
                style={{ padding: '3px 7px', borderRadius: 5, background: C.blueSoft, border: `1px solid ${C.blueBorder}`, cursor: 'pointer', fontSize: 10, color: C.blue, fontWeight: 700, fontFamily: fontCairo }}>
                توسيع
              </button>
              <button onClick={() => setPreviewUrl(null)}
                style={{ width: 22, height: 22, borderRadius: 5, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X style={{ width: 12, height: 12, color: C.textDim }} />
              </button>
            </div>

            {/* iFrame */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              {previewLoading && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg, zIndex: 5 }}>
                  <Loader2 className="animate-spin" style={{ color: C.blue, width: 24, height: 24 }} />
                </div>
              )}
              <iframe
                key={previewUrl}
                src={previewUrl}
                onLoad={() => setPreviewLoading(false)}
                onLoadStart={() => setPreviewLoading(true)}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                title="Preview"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── END Main Content Row ── */}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CLOUD DESKTOP VIEW — سطح المكتب السحابي الواقعي
// ═══════════════════════════════════════════════════════
function CloudDesktopView({
  agentWindows, agents, onOpenAgent,
  onCloseAgentWindow, onMinimizeAgentWindow, onMaximizeAgentWindow,
  onFocusAgentWindow, onMoveAgentWindow, onResizeAgentWindow,
  timeStr, dateStr,
}: {
  agentWindows: WindowState[]; agents: AgentDef[];
  onOpenAgent: (id: AgentId) => void;
  onCloseAgentWindow: (id: string) => void;
  onMinimizeAgentWindow: (id: string) => void;
  onMaximizeAgentWindow: (id: string) => void;
  onFocusAgentWindow: (id: string) => void;
  onMoveAgentWindow: (id: string, pos: { x: number; y: number }) => void;
  onResizeAgentWindow: (id: string, size: { w: number; h: number }) => void;
  timeStr: string; dateStr: string;
}) {
  const [cloudWins, setCloudWins] = useState<CloudWin[]>([]);
  const [showLauncher, setShowLauncher] = useState(false);
  const [nextZ, setNextZ] = useState(200);

  const openCloudApp = useCallback((type: CloudAppType) => {
    if (type === 'launcher') {
      setShowLauncher(p => !p);
      return;
    }
    setCloudWins(prev => {
      const existing = prev.find(w => w.type === type);
      if (existing) {
        return prev.map(w => w.type === type
          ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZ }
          : w
        );
      }
      const def = CLOUD_WIN_DEFAULTS[type];
      return [...prev, {
        id: `${type}-${Date.now()}`, type, title: def.title,
        isOpen: true, isMinimized: false, isMaximized: false,
        zIndex: nextZ, x: def.x, y: def.y, w: def.w, h: def.h,
      }];
    });
    setNextZ(z => z + 1);
  }, [nextZ]);

  const closeCloudWin = useCallback((id: string) => setCloudWins(p => p.map(w => w.id === id ? { ...w, isOpen: false } : w)), []);
  const minimizeCloudWin = useCallback((id: string) => setCloudWins(p => p.map(w => w.id === id ? { ...w, isMinimized: true } : w)), []);
  const toggleMaximizeCloudWin = useCallback((id: string) => setCloudWins(p => p.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)), []);
  const focusCloudWin = useCallback((id: string) => { setCloudWins(p => p.map(w => w.id === id ? { ...w, zIndex: nextZ } : w)); setNextZ(z => z + 1); }, [nextZ]);

  const openWindows = cloudWins.filter(w => w.isOpen && !w.isMinimized);
  const minimizedWins = cloudWins.filter(w => w.isMinimized);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* === DESKTOP BACKGROUND === */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse at 25% 65%, rgba(192,57,43,0.85) 0%, rgba(192,57,43,0.2) 30%, transparent 55%),
          radial-gradient(ellipse at 75% 25%, rgba(21,101,192,0.85) 0%, rgba(21,101,192,0.2) 30%, transparent 55%),
          radial-gradient(ellipse at 55% 55%, rgba(230,126,34,0.7) 0%, rgba(230,126,34,0.15) 35%, transparent 60%),
          radial-gradient(ellipse at 15% 20%, rgba(59,91,254,0.6) 0%, transparent 40%),
          radial-gradient(ellipse at 85% 80%, rgba(155,27,110,0.6) 0%, transparent 40%),
          radial-gradient(ellipse at 40% 10%, rgba(230,57,43,0.5) 0%, transparent 35%),
          #1a0a2e
        `,
        zIndex: 0,
      }} />

      {/* === DESKTOP AREA (full width, no side dock) === */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>

        {/* TOP STATUS BAR */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 26,
          background: D.panelBg,
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', zIndex: 50,
          direction: 'ltr',
        }}>
          {/* Activities */}
          <div style={{ paddingLeft: 10, fontSize: 16, color: 'rgba(255,255,255,0.8)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setShowLauncher(p => !p)}>
            Activities
          </div>
          {/* App name */}
          <div style={{ flex: 1, textAlign: 'center', fontSize: 16, color: 'rgba(255,255,255,0.7)', fontFamily: fontMono, fontWeight: 600 }}>
            {openWindows.length > 0 ? openWindows[openWindows.length - 1].title : `${dateStr}  ${timeStr}`}
          </div>
          {/* System tray */}
          <div style={{ paddingRight: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Wifi style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.7)' }} />
            <Volume2 style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.7)' }} />
            <Battery style={{ width: 13, height: 11, color: 'rgba(255,255,255,0.7)' }} />
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontFamily: fontMono }}>{timeStr}</span>
          </div>
        </div>

        {/* WINDOWS AREA */}
        <div style={{ position: 'absolute', inset: 0, top: 26 }}>

          {/* Empty state when no windows */}
          {openWindows.length === 0 && agentWindows.filter(w => w.isOpen && !w.isMinimized).length === 0 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontFamily: fontCairo, textAlign: 'center' }}>
                <Monitor style={{ width: 32, height: 32, color: 'rgba(255,255,255,0.15)', margin: '0 auto 8px' }} />
                انقر على أحد التطبيقات في الشريط الجانبي لبدء العمل
              </div>
            </div>
          )}

          {/* Cloud App Windows */}
          <AnimatePresence>
            {openWindows.map(win => (
              <CloudWindow
                key={win.id}
                win={win}
                onClose={() => closeCloudWin(win.id)}
                onMinimize={() => minimizeCloudWin(win.id)}
                onMaximize={() => toggleMaximizeCloudWin(win.id)}
                onFocus={() => focusCloudWin(win.id)}
                onMove={(x, y) => setCloudWins(p => p.map(w => w.id === win.id ? { ...w, x, y } : w))}
              />
            ))}
          </AnimatePresence>

          {/* WayakAgent Windows */}
          <Suspense fallback={null}>
            <AnimatePresence>
              {agentWindows.filter(w => w.isOpen).map(ws => (
                <DesktopWindowComp
                  key={ws.id}
                  windowState={ws}
                  onClose={() => onCloseAgentWindow(ws.id)}
                  onMinimize={() => onMinimizeAgentWindow(ws.id)}
                  onMaximize={() => onMaximizeAgentWindow(ws.id)}
                  onFocus={() => onFocusAgentWindow(ws.id)}
                  onMove={pos => onMoveAgentWindow(ws.id, pos)}
                  onResize={size => onResizeAgentWindow(ws.id, size)}
                  badge="AI Agent"
                >
                  {ws.id === 'agent-accounts' && <AccountManagerAgent />}
                  {ws.id === 'agent-seo'      && <SEOOptimizerAgent />}
                  {ws.id === 'agent-social'   && <SocialMediaAgent />}
                </DesktopWindowComp>
              ))}
            </AnimatePresence>
          </Suspense>
        </div>

        {/* App Launcher Overlay */}
        <AnimatePresence>
          {showLauncher && (
            <AppLauncher
              onClose={() => setShowLauncher(false)}
              onOpenApp={openCloudApp}
              onOpenAgent={(id) => { onOpenAgent(id); setShowLauncher(false); }}
              agents={agents}
            />
          )}
        </AnimatePresence>

        {/* === FLOATING APP LAUNCHER BUTTON (بديل الـ side dock) === */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLauncher(p => !p)}
          style={{
            position: 'absolute', bottom: 14, right: 12, zIndex: 40,
            width: 46, height: 46, borderRadius: 14,
            background: showLauncher
              ? `linear-gradient(135deg, ${C.goldSoft}, ${C.blueSoft})`
              : 'rgba(15,15,26,0.88)',
            border: showLauncher ? `1px solid ${C.goldBorder}` : '1px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            backdropFilter: 'blur(14px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.55)',
          }}
        >
          <Grid style={{ width: 18, height: 18, color: showLauncher ? C.gold : 'rgba(255,255,255,0.85)' }} />
        </motion.button>

        {/* App shortcuts bar (bottom) */}
        <div style={{
          position: 'absolute', bottom: 14, left: 12, zIndex: 40,
          display: 'flex', gap: 6, alignItems: 'center',
          background: 'rgba(15,15,26,0.85)', backdropFilter: 'blur(14px)',
          borderRadius: 14, padding: '5px 8px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          {[
            { icon: Globe, label: 'Browser', action: () => openCloudApp('browser'), color: '#4285F4' },
            { icon: Terminal, label: 'Terminal', action: () => openCloudApp('terminal'), color: '#5bc8f5' },
            { icon: Folder, label: 'Files', action: () => openCloudApp('files'), color: C.gold },
          ].map((item, i) => (
            <motion.button key={i} whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.9 }}
              onClick={item.action}
              title={item.label}
              style={{
                width: 34, height: 34, borderRadius: 9,
                background: 'rgba(0,0,0,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
              <item.icon style={{ width: 15, height: 15, color: item.color }} />
            </motion.button>
          ))}
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)' }} />
          {agents.map(agent => {
            const isOpen = agentWindows.some(w => w.id === agent.id && w.isOpen);
            return (
              <motion.button key={agent.id} whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.9 }}
                onClick={() => onOpenAgent(agent.id)}
                title={agent.title}
                style={{
                  width: 34, height: 34, borderRadius: 9, position: 'relative',
                  background: isOpen ? C.blueSoft : 'rgba(255,255,255,0.06)',
                  border: isOpen ? `1px solid ${C.blueBorder}` : '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                <agent.icon style={{ width: 15, height: 15, color: isOpen ? C.blue : '#94A3B8' }} />
                <div style={{
                  position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${C.gold}, ${C.blue})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles style={{ width: 4, height: 4, color: '#fff' }} />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Minimized windows bar */}
        {minimizedWins.length > 0 && (
          <div style={{
            position: 'absolute', bottom: 6, left: 8, right: 8,
            display: 'flex', gap: 4, zIndex: 30,
          }}>
            {minimizedWins.map(win => (
              <motion.button key={win.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCloudWins(p => p.map(w => w.id === win.id ? { ...w, isMinimized: false } : w))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8,
                  background: D.dockBg, border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer', fontFamily: fontCairo,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <CloudAppIcon type={win.type} size={12} />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{win.title}</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Dock Icon
// ═══════════════════════════════════════════
function DockIcon({ Icon, label, color, onClick }: { Icon: LucideIcon; label: string; color: string; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        whileHover={{ scale: 1.15, y: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'rgba(0,0,0,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}
      >
        <Icon style={{ width: 18, height: 18, color }} />
      </motion.button>
      {/* Tooltip */}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            style={{
              position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)',
              marginLeft: 8, pointerEvents: 'none',
              background: 'rgba(20,20,30,0.95)', borderRadius: 6, padding: '3px 8px',
              whiteSpace: 'nowrap', fontSize: 14, color: '#fff', fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.1)',
              zIndex: 100,
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════
// Cloud App Icon helper
// ═══════════════════════════════════════════
function CloudAppIcon({ type, size = 14 }: { type: CloudAppType; size?: number }) {
  const icons: Record<CloudAppType, LucideIcon> = {
    terminal: Terminal,
    files: Folder,
    browser: Globe,
    launcher: Grid,
  };
  const colors: Record<CloudAppType, string> = {
    terminal: '#5bc8f5',
    files: C.gold,
    browser: '#4285F4',
    launcher: C.gold,
  };
  const Icon = icons[type];
  return <Icon style={{ width: size, height: size, color: colors[type] }} />;
}

// ═══════════════════════════════════════════
// Cloud Window Chrome
// ═══════════════════════════════════════════
function CloudWindow({
  win, onClose, onMinimize, onMaximize, onFocus, onMove,
}: {
  win: CloudWin;
  onClose: () => void; onMinimize: () => void; onMaximize: () => void;
  onFocus: () => void; onMove: (x: number, y: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const style: CSSProperties = win.isMaximized
    ? { position: 'absolute', inset: 0, borderRadius: 0, zIndex: win.zIndex }
    : {
        position: 'absolute',
        left: win.x, top: win.y, width: win.w, height: win.h,
        borderRadius: 12, zIndex: win.zIndex,
      };

  const handleDragStart = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    isDragging.current = true;
    dragOffset.current = { x: e.clientX - win.x, y: e.clientY - win.y };
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      onMove(e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y);
    };
    const onMouseUp = () => { isDragging.current = false; };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMove]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onClick={onFocus}
      style={{
        ...style,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
        background: D.winChrome,
      }}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleDragStart}
        onDoubleClick={onMaximize}
        style={{
          background: D.winChrome,
          height: 32, flexShrink: 0,
          display: 'flex', alignItems: 'center', padding: '0 10px', gap: 8,
          cursor: 'move', userSelect: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          direction: 'ltr',
        }}
      >
        {/* Title */}
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {win.title}
        </span>
        {/* Window controls (GNOME style — right side) */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <WindowCtrlBtn color="#f59e0b" icon={Minimize2} onClick={e => { e.stopPropagation(); onMinimize(); }} />
          <WindowCtrlBtn color="#6b7280" icon={Maximize2} onClick={e => { e.stopPropagation(); onMaximize(); }} />
          <WindowCtrlBtn color="#ef4444" icon={X} onClick={e => { e.stopPropagation(); onClose(); }} />
        </div>
      </div>

      {/* Window Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {win.type === 'terminal' && <TerminalApp />}
        {win.type === 'files'    && <FilesApp />}
        {win.type === 'browser'  && <BrowserApp url="bietalreef.ae" />}
      </div>
    </motion.div>
  );
}

function WindowCtrlBtn({ color, icon: Icon, onClick }: { color: string; icon: LucideIcon; onClick: (e: React.MouseEvent) => void }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      style={{
        width: 14, height: 14, borderRadius: '50%',
        background: color,
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 1px 3px rgba(0,0,0,0.3)`,
      }}
    >
      {hover && <Icon style={{ width: 8, height: 8, color: 'rgba(0,0,0,0.6)' }} />}
    </motion.button>
  );
}

// ═══════════════════════════════════════════
// Terminal App — محاكي الطرفية
// ═══════════════════════════════════════════
const HOSTNAME = 'vm-weyaak-cloud';
const TERM_USER = 'weyaak';
const TERM_PROMPT = `${TERM_USER}@${HOSTNAME}:~$`;

interface TermLine { type: 'prompt' | 'output' | 'error'; text: string }

const FILESYSTEM: Record<string, string[]> = {
  '~': ['Documents', 'Downloads', 'Desktop', 'projects', 'bietalreef.conf', 'README.md'],
  '~/Documents': ['report.pdf', 'contract.docx', 'budget.xlsx'],
  '~/Downloads': ['nodejs-v20.tar.gz', 'chrome.deb'],
  '~/Desktop': ['bietalreef-shortcut.desktop'],
  '~/projects': ['bietalreef-api', 'weyaak-agent', 'crm-dashboard'],
};

const CMD_HELP = `الأوامر المتاحة:
  ls, ls -la    — عرض محتوى المجلد
  cd [مجلد]    — تغيير المجلد
  pwd           — عرض المسار الحالي
  cat [ملف]    — عرض محتوى ملف
  echo [نص]    — طباعة نص
  whoami        — اسم المستخدم
  uname -a      — معلومات النظام
  date          — التاريخ والوقت
  clear         — مسح الشاشة
  weyaak [أمر] — تشغيل وكيل ذكي`;

function TerminalApp() {
  const [cwd, setCwd] = useState('~');
  const [history, setHistory] = useState<TermLine[]>([
    { type: 'output', text: 'Weyaak Cloud Computer v2.0 — بيت الريف' },
    { type: 'output', text: `Connected to ${HOSTNAME}. اكتب "help" للمساعدة.` },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const runCmd = (cmd: string) => {
    const trimmed = cmd.trim();
    const newLines: TermLine[] = [{ type: 'prompt', text: `${TERM_PROMPT} ${trimmed}` }];
    const parts = trimmed.split(/\s+/);
    const base = parts[0];
    const arg = parts.slice(1).join(' ');

    if (!trimmed) {
      // nothing
    } else if (base === 'clear') {
      setHistory([]);
      setInput('');
      setCmdHistory(p => [trimmed, ...p]);
      setHistIdx(-1);
      return;
    } else if (base === 'ls') {
      const files = FILESYSTEM[cwd] || [];
      if (arg === '-la' || arg === '-l') {
        files.forEach(f => {
          const isDir = !f.includes('.');
          newLines.push({ type: 'output', text: `${isDir ? 'd' : '-'}rw-r--r-- 1 ${TERM_USER} ${TERM_USER}   ${isDir ? '4096' : '1234'} Mar  8 15:33 ${f}` });
        });
      } else {
        newLines.push({ type: 'output', text: files.join('  ') || '(فارغ)' });
      }
    } else if (base === 'pwd') {
      newLines.push({ type: 'output', text: `/home/${TERM_USER}/${cwd.replace('~/', '').replace('~', '')}` });
    } else if (base === 'cd') {
      const target = arg ? (arg === '..' ? '~' : `${cwd}/${arg}`.replace('~//','~/')) : '~';
      const normalized = target === '~' ? '~' : (target.startsWith('~/') ? target : `~/${target}`);
      if (FILESYSTEM[normalized] || normalized === '~') {
        setCwd(normalized);
      } else {
        newLines.push({ type: 'error', text: `cd: ${arg}: No such file or directory` });
      }
    } else if (base === 'cat') {
      if (!arg) { newLines.push({ type: 'error', text: 'cat: يرجى تحديد اسم ملف' }); }
      else if (arg === 'README.md') {
        newLines.push({ type: 'output', text: '# Weyaak Cloud Computer\nبيت الريف — منصة البناء الذكية في الإمارات\nVersion: 2.0.0\nAgent Runtime: ACTIVE' });
      } else if (arg === 'bietalreef.conf') {
        newLines.push({ type: 'output', text: '[server]\nhost = bietalreef.ae\nport = 443\nprotocol = https\n\n[agent]\nruntime = weyaak-v2\nmax_tasks = 50' });
      } else {
        newLines.push({ type: 'error', text: `cat: ${arg}: No such file or directory` });
      }
    } else if (base === 'echo') {
      newLines.push({ type: 'output', text: arg || '' });
    } else if (base === 'whoami') {
      newLines.push({ type: 'output', text: TERM_USER });
    } else if (base === 'date') {
      newLines.push({ type: 'output', text: new Date().toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Dubai' }) + ' +04' });
    } else if (base === 'uname') {
      newLines.push({ type: 'output', text: 'Linux vm-weyaak-cloud 6.1.0-weyaak-amd64 #1 SMP x86_64 GNU/Linux — Weyaak Cloud Runtime' });
    } else if (base === 'help') {
      newLines.push({ type: 'output', text: CMD_HELP });
    } else if (base === 'weyaak') {
      newLines.push({ type: 'output', text: `[Weyaak Agent] تنفيذ: "${arg}" ...` });
      newLines.push({ type: 'output', text: '... analyzing request ...' });
      newLines.push({ type: 'output', text: `[OK] المهمة "${arg}" تمت جدولتها.` });
    } else {
      newLines.push({ type: 'error', text: `${base}: command not found. اكتب "help" للمساعدة.` });
    }

    newLines.push({ type: 'output', text: '' });
    setHistory(p => [...p, ...newLines]);
    setCmdHistory(p => [trimmed, ...p]);
    setHistIdx(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCmd(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIdx = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(newIdx);
      setInput(cmdHistory[newIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIdx = Math.max(histIdx - 1, -1);
      setHistIdx(newIdx);
      setInput(newIdx === -1 ? '' : cmdHistory[newIdx] || '');
    }
  };

  return (
    <div
      style={{
        width: '100%', height: '100%',
        background: D.termBg,
        fontFamily: fontMono, fontSize: 11.5, direction: 'ltr',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        padding: 10,
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* History */}
      <div style={{ flex: 1, overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {history.map((line, i) => (
          <div key={i} style={{
            color: line.type === 'prompt' ? D.termPrompt : line.type === 'error' ? C.red : D.termText,
            lineHeight: 1.5, marginBottom: 0,
          }}>
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {/* Input row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginTop: 4 }}>
        <span style={{ color: D.termPrompt, whiteSpace: 'nowrap' }}>{TERM_PROMPT}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: D.termText, fontFamily: fontMono, fontSize: 11.5,
            caretColor: D.termPrompt,
          }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Files App — محاكي مدير الملفات (Nautilus)
// ═══════════════════════════════════════════
const FILES_TREE = [
  { label: 'Recent', icon: Clock },
  { label: 'Starred', icon: Star },
  { label: 'Home', icon: Home, active: true },
  { label: 'Desktop', icon: Monitor },
  { label: 'Documents', icon: FileText },
  { label: 'Downloads', icon: ArrowUp },
  { label: 'Music', icon: Music },
  { label: 'Pictures', icon: Image },
  { label: 'Videos', icon: Play },
  { label: 'Trash', icon: Trash2 },
];

const HOME_FOLDERS = ['Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Public', 'Templates', 'Videos', 'thinclient_drives'];

function FilesApp() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<string | null>(null);
  const [activeFolder, setActiveFolder] = useState('Home');

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', direction: 'ltr', background: '#fafafa' }}>
      {/* Sidebar */}
      <div style={{ width: 160, flexShrink: 0, background: D.filesSidebar, borderRight: '1px solid rgba(0,0,0,0.1)', overflow: 'auto', padding: '8px 0' }}>
        <div style={{ padding: '4px 12px', fontSize: 14, fontWeight: 700, color: '#555', marginBottom: 4 }}>Files</div>
        {FILES_TREE.map((item, i) => {
          const isActive = activeFolder === item.label;
          return (
            <div key={i} onClick={() => setActiveFolder(item.label)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', cursor: 'pointer', fontSize: 14,
                color: isActive ? '#1565c0' : '#444',
                background: isActive ? 'rgba(21,101,192,0.1)' : 'transparent',
                borderRadius: 4, margin: '1px 4px',
              }}>
              <item.icon style={{ width: 13, height: 13 }} />
              {item.label}
            </div>
          );
        })}
        <div style={{ height: 1, background: 'rgba(0,0,0,0.1)', margin: '8px 8px' }} />
        <div style={{ padding: '4px 12px', fontSize: 14, color: '#999', marginBottom: 4 }}>thinclient</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 16, color: '#666' }}>
          <Plus style={{ width: 10, height: 10 }} /> Other Locations
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: D.filesBg }}>
        {/* Toolbar */}
        <div style={{ height: 38, flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 8, background: '#f0f0f0' }}>
          <ChevronLeft style={{ width: 14, height: 14, color: '#888', cursor: 'pointer' }} />
          <ChevronRight style={{ width: 14, height: 14, color: '#888', cursor: 'pointer' }} />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#333' }}>{activeFolder}</span>
          <Search style={{ width: 13, height: 13, color: '#888', cursor: 'pointer' }} />
          <Grid style={{ width: 13, height: 13, color: view === 'grid' ? '#1565c0' : '#888', cursor: 'pointer' }} onClick={() => setView('grid')} />
          <List style={{ width: 13, height: 13, color: view === 'list' ? '#1565c0' : '#888', cursor: 'pointer' }} onClick={() => setView('list')} />
          <MoreVertical style={{ width: 13, height: 13, color: '#888', cursor: 'pointer' }} />
        </div>

        {/* File grid */}
        <div style={{ flex: 1, overflow: 'auto', padding: 14 }}>
          {view === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))', gap: 8 }}>
              {HOME_FOLDERS.map(folder => (
                <div key={folder}
                  onClick={() => setSelected(folder)}
                  onDoubleClick={() => setActiveFolder(folder)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '8px 4px', borderRadius: 8, cursor: 'pointer',
                    background: selected === folder ? 'rgba(21,101,192,0.12)' : 'transparent',
                    border: selected === folder ? '1px solid rgba(21,101,192,0.3)' : '1px solid transparent',
                  }}>
                  <FolderIconSVG />
                  <span style={{ fontSize: 14, color: D.filesText, textAlign: 'center', wordBreak: 'break-word', lineHeight: 1.3 }}>{folder}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {HOME_FOLDERS.map(folder => (
                <div key={folder}
                  onClick={() => setSelected(folder)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6, cursor: 'pointer',
                    background: selected === folder ? 'rgba(21,101,192,0.12)' : 'transparent',
                  }}>
                  <Folder style={{ width: 16, height: 16, color: '#D4AF37' }} />
                  <span style={{ fontSize: 14, color: D.filesText, flex: 1 }}>{folder}</span>
                  <span style={{ fontSize: 14, color: '#999' }}>—</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FolderIconSVG() {
  return (
    <div style={{ width: 44, height: 38, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 40, height: 30, borderRadius: '3px 8px 8px 8px',
        background: 'linear-gradient(180deg, #D4AF37 0%, #b8962e 100%)',
        position: 'absolute', bottom: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
      }} />
      <div style={{
        width: 20, height: 8, borderRadius: '3px 3px 0 0',
        background: '#D4AF37',
        position: 'absolute', bottom: 30, left: 0,
      }} />
    </div>
  );
}

// ═══════════════════════════════════════════
// Browser App — محاكي المتصفح
// ═══════════════════════════════════════════
function BrowserApp({ url }: { url: string }) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [loading, setLoading] = useState(true);
  const [urlInput, setUrlInput] = useState(url);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, [currentUrl]);

  const navigate = (u: string) => {
    setCurrentUrl(u);
    setUrlInput(u);
    setLoading(true);
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', direction: 'ltr', background: '#fff' }}>
      {/* Browser toolbar */}
      <div style={{ background: '#f5f5f5', borderBottom: '1px solid rgba(0,0,0,0.15)', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <ChevronLeft style={{ width: 14, height: 14, color: '#666', cursor: 'pointer' }} />
        <ChevronRight style={{ width: 14, height: 14, color: '#ccc' }} />
        <RefreshCw style={{ width: 12, height: 12, color: '#666', cursor: 'pointer' }} className={loading ? 'animate-spin' : ''} />
        {/* URL bar */}
        <div style={{ flex: 1, background: '#fff', border: '1px solid rgba(0,0,0,0.2)', borderRadius: 6, height: 22, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 4 }}>
          {!loading && <CheckCircle style={{ width: 10, height: 10, color: '#1565c0' }} />}
          {loading && <Loader2 style={{ width: 10, height: 10, color: '#666' }} className="animate-spin" />}
          <input value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && navigate(urlInput)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, color: '#333', background: 'transparent', fontFamily: fontMono }} />
        </div>
        <Globe style={{ width: 13, height: 13, color: '#666' }} />
      </div>

      {/* Page content (simulated) */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        {loading ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
            <div style={{ textAlign: 'center' }}>
              <Loader2 style={{ width: 24, height: 24, color: C.blue, margin: '0 auto 8px' }} className="animate-spin" />
              <div style={{ fontSize: 16, color: '#666' }}>Connecting to {currentUrl}...</div>
            </div>
          </div>
        ) : (
          <div style={{ padding: 20 }}>
            {/* Simulated bietalreef.ae page */}
            <div style={{ background: '#1a2744', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ padding: '24px 20px', background: 'linear-gradient(135deg, #1a2744, #0d1830)' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.gold, marginBottom: 6, fontFamily: fontCairo, textAlign: 'right' }}>
                  وياك — مساعدك الذكي
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'right', fontFamily: fontCairo, lineHeight: 1.7 }}>
                  بيت الريف — منصة البناء الذكية في الإمارات<br/>
                  اكتشف أفضل مزودي الخدمات والمواد والاستشارات
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
                  <div style={{ padding: '6px 16px', borderRadius: 6, background: C.gold, fontSize: 14, fontWeight: 700, color: '#000', fontFamily: fontCairo, cursor: 'pointer' }}>
                    ابدأ الآن
                  </div>
                  <div style={{ padding: '6px 16px', borderRadius: 6, border: `1px solid ${C.gold}`, fontSize: 14, fontWeight: 700, color: C.gold, fontFamily: fontCairo, cursor: 'pointer' }}>
                    تسجيل الدخول
                  </div>
                </div>
              </div>
            </div>
            {/* Quick links */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {['الخدمات', 'السوق', 'المشاريع', 'التواصل'].map(item => (
                <div key={item} style={{ padding: '10px', background: '#f5f5f5', borderRadius: 6, textAlign: 'center', fontSize: 16, color: '#333', fontFamily: fontCairo, cursor: 'pointer', border: '1px solid rgba(0,0,0,0.08)' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// App Launcher — GNOME-like
// ═══════════════════════════════════════════
const LAUNCHER_APPS = [
  { label: 'Terminal', icon: Terminal, color: '#5bc8f5', action: 'terminal' as CloudAppType },
  { label: 'Files', icon: Folder, color: '#D4AF37', action: 'files' as CloudAppType },
  { label: 'Browser', icon: Globe, color: '#4285F4', action: 'browser' as CloudAppType },
  { label: 'Settings', icon: Settings, color: '#94A3B8', action: null },
  { label: 'Calculator', icon: BarChart2, color: '#f59e0b', action: null },
  { label: 'System', icon: Cpu, color: '#3B5BFE', action: null },
  { label: 'Help', icon: HelpCircle, color: '#94A3B8', action: null },
  { label: 'Mail', icon: Mail, color: '#ef4444', action: null },
  { label: 'Htop', icon: Activity, color: '#3B5BFE', action: null },
  { label: 'Vim', icon: FileText, color: '#94A3B8', action: null },
  { label: 'Network', icon: Wifi, color: '#D4AF37', action: null },
  { label: 'Power', icon: Power, color: '#ef4444', action: null },
];

function AppLauncher({
  onClose, onOpenApp, onOpenAgent, agents,
}: {
  onClose: () => void;
  onOpenApp: (type: CloudAppType) => void;
  onOpenAgent: (id: AgentId) => void;
  agents: AgentDef[];
}) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = search
    ? [...LAUNCHER_APPS, ...agents.map(a => ({ label: a.title, icon: a.icon, color: C.gold, action: null, agentId: a.id }))].filter(a => a.label.includes(search) || (search.length > 1 && a.label.toLowerCase().includes(search.toLowerCase())))
    : LAUNCHER_APPS;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute', inset: 0, zIndex: 100,
        background: D.launcherBg,
        backdropFilter: 'blur(30px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '40px 20px 20px', direction: 'ltr',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{
          width: '100%', maxWidth: 300, marginBottom: 30,
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24, padding: '8px 14px',
        }}
      >
        <Search style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.5)' }} />
        <input
          ref={inputRef}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Escape' && onClose()}
          placeholder="Type to search"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: '#fff', fontSize: 16, fontFamily: fontCairo,
          }}
        />
      </motion.div>

      {/* Weyaak logo area */}
      {!search && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 24 }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: `linear-gradient(135deg, ${C.goldSoft}, ${C.blueSoft})`,
            border: `1px solid ${C.goldBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 30px ${C.goldBorder}`,
          }}>
            <img src={wayakCharacterImg} alt="" style={{ width: 46, height: 46, objectFit: 'contain' }} />
          </div>
        </motion.div>
      )}

      {/* Apps grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12, width: '100%', maxWidth: 380, overflow: 'auto',
        maxHeight: 320,
      }}>
        {filtered.map((app, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if ((app as any).agentId) {
                onOpenAgent((app as any).agentId as AgentId);
              } else if ((app as any).action) {
                onOpenApp((app as any).action as CloudAppType);
              }
              onClose();
            }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '10px 4px', borderRadius: 10,
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer', fontFamily: fontCairo,
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `${app.color}20`,
              border: `1px solid ${app.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <app.icon style={{ width: 18, height: 18, color: app.color }} />
            </div>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
              {app.label}
            </span>
          </motion.button>
        ))}

        {/* Weyaak Agents section */}
        {!search && agents.map((agent, i) => (
          <motion.button
            key={`agent-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (LAUNCHER_APPS.length + i) * 0.03 }}
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { onOpenAgent(agent.id); onClose(); }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '10px 4px', borderRadius: 10,
              background: C.goldSoft,
              border: `1px solid ${C.goldBorder}`,
              cursor: 'pointer', fontFamily: fontCairo, position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: `linear-gradient(135deg, ${C.gold}, ${C.blue})` }} />
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.blueSoft, border: `1px solid ${C.blueBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <agent.icon style={{ width: 18, height: 18, color: C.blue }} />
            </div>
            <span style={{ fontSize: 14, color: C.gold, textAlign: 'center', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%', fontWeight: 700 }}>
              {agent.subtitle.split(' ')[0]}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Close hint */}
      <div style={{ marginTop: 20, fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
        Press Esc to close
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// Bottom Taskbar
// ═══════════════════════════════════════════════════════
function BottomTaskbar({ activeView, windows, agents, timeStr, onSetView, onOpenAgent, onClose }: {
  activeView: MainView; windows: WindowState[]; agents: AgentDef[];
  timeStr: string;
  onSetView: (v: MainView) => void; onOpenAgent: (id: AgentId) => void; onClose: () => void;
}) {
  const NAV_ITEMS: { id: MainView; icon: LucideIcon; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'لوحة' },
    { id: 'chat',      icon: MessageSquare,   label: 'وياك' },
    { id: 'ai-agents', icon: Sparkles,        label: 'وكلاء' },
    { id: 'browser',   icon: Globe,           label: 'متصفح' },
    { id: 'desktop',   icon: Monitor,         label: 'مكتب' },
  ];

  return (
    <div style={{
      background: `linear-gradient(180deg, #0d1425 0%, #080E1C 100%)`,
      borderTop: `1px solid ${C.border}`,
      padding: '6px 10px',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      flexShrink: 0, gap: 4,
    }}>
      {/* Weyak logo */}
      <motion.button whileHover={{ scale: 1.1, y: -3 }} whileTap={{ scale: 0.9 }}
        onClick={() => onSetView('dashboard')}
        style={{
          width: 42, height: 42, borderRadius: 12,
          background: activeView === 'dashboard' ? C.goldSoft : 'rgba(255,255,255,0.05)',
          border: activeView === 'dashboard' ? `1px solid ${C.goldBorder}` : '1px solid transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative',
        }}>
        <img src={wayakCharacterImg} alt="وياك" style={{ width: 24, height: 24, objectFit: 'contain' }} />
        {activeView === 'dashboard' && (
          <div style={{ position: 'absolute', bottom: 3, width: 4, height: 4, borderRadius: '50%', background: C.gold, boxShadow: `0 0 6px ${C.gold}` }} />
        )}
      </motion.button>

      <div style={{ width: 1, height: 20, background: C.border }} />

      {/* Nav tabs */}
      {NAV_ITEMS.slice(1).map(item => {
        const isActive = activeView === item.id;
        return (
          <motion.button key={item.id} whileHover={{ scale: 1.12, y: -4 }} whileTap={{ scale: 0.9 }}
            onClick={() => onSetView(item.id)}
            style={{
              width: 42, height: 42, borderRadius: 12,
              background: isActive ? C.blueSoft : 'rgba(255,255,255,0.05)',
              border: isActive ? `1px solid ${C.blueBorder}` : '1px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative',
            }}>
            <item.icon style={{ width: 16, height: 16, color: isActive ? C.blue : C.textDim }} />
            {isActive && (
              <div style={{ position: 'absolute', bottom: 3, width: 4, height: 4, borderRadius: '50%', background: C.blue, boxShadow: `0 0 6px ${C.blue}` }} />
            )}
          </motion.button>
        );
      })}

      <div style={{ width: 1, height: 20, background: C.border }} />

      {/* Agent dock */}
      {agents.map(agent => {
        const win = windows.find(w => w.id === agent.id);
        const isOpen = win?.isOpen;
        const isMini = win?.isMinimized;
        return (
          <motion.button key={agent.id} whileHover={{ scale: 1.15, y: -5 }} whileTap={{ scale: 0.9 }}
            onClick={() => { onOpenAgent(agent.id); onSetView('desktop'); }}
            title={agent.title}
            style={{
              width: 42, height: 42, borderRadius: 12,
              background: isOpen && !isMini ? C.blueSoft : 'rgba(255,255,255,0.05)',
              border: isOpen && !isMini ? `1px solid ${C.blueBorder}` : '1px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative',
            }}>
            <agent.icon style={{ width: 16, height: 16, color: isOpen ? C.blue : C.textDim }} />
            <div style={{ position: 'absolute', top: 4, left: 4, width: 9, height: 9, borderRadius: '50%', background: `linear-gradient(135deg, ${C.gold}, ${C.blue})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles style={{ width: 5, height: 5, color: '#fff' }} />
            </div>
            {(isOpen || isMini) && (
              <div style={{ position: 'absolute', bottom: 3, width: isMini ? 3 : 5, height: isMini ? 3 : 5, borderRadius: '50%', background: isMini ? C.textDim : C.blue, boxShadow: isMini ? 'none' : `0 0 6px ${C.blue}` }} />
            )}
          </motion.button>
        );
      })}

      <div style={{ width: 1, height: 20, background: C.border }} />

      {/* Close */}
      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} onClick={onClose}
        style={{ width: 36, height: 36, borderRadius: 10, background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <X style={{ width: 13, height: 13, color: C.textMut }} />
      </motion.button>
    </div>
  );
}
