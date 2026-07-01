/**
 * AgentActivationContext.tsx — Agent Foundation Layer
 * ════════════════════════════════════════════════════
 * Uses useReducer to eliminate stale-closure bugs.
 * Manages: AgentInstance lifecycle + AgentSession lifecycle.
 *
 * Separation:
 *   Chat Activation  → startChat / activateChat  (creates/opens session)
 *   Agent Execution  → NOT here (future: AgentExecutionContext)
 */
import {
  createContext, useContext, useReducer, useCallback,
  useEffect, useRef, type ReactNode,
} from 'react';
import type {
  AgentInstance, AgentSession, AgentMessage,
  AgentType, AgentStatus,
} from '../types/agent-runtime';

// ── Templates ────────────────────────────────────────────────────
export const AGENT_TEMPLATES = [
  {
    id: 'tpl_ui_assistant',
    key: 'ui_assistant' as AgentType,
    nameAr: 'وياك المساعد',
    nameEn: 'Weyaak Assistant',
    descriptionAr: 'يشرح ويوجه ويفتح الأدوات المناسبة',
    descriptionEn: 'Explains, guides, and opens the right tools',
    capabilities: ['chat', 'navigate', 'explain', 'guide'],
    color: '#D4AF37',
    icon: '✨',
    requiredTools: [] as const,
    canExecute: false,
  },
  {
    id: 'tpl_seo',
    key: 'seo' as AgentType,
    nameAr: 'وكيل SEO',
    nameEn: 'SEO Agent',
    descriptionAr: 'تحسين محركات البحث وتحليل الكلمات المفتاحية',
    descriptionEn: 'Search engine optimization & keyword analysis',
    capabilities: ['keyword_research', 'rank_tracking', 'content_audit', 'backlink_analysis'],
    color: '#3B5BFE',
    icon: '🔍',
    requiredTools: ['google', 'searchConsole', 'domain'] as const,
    canExecute: true,
  },
  {
    id: 'tpl_social',
    key: 'social' as AgentType,
    nameAr: 'وكيل السوشيال',
    nameEn: 'Social Agent',
    descriptionAr: 'إدارة حسابات التواصل الاجتماعي والمحتوى',
    descriptionEn: 'Social media management & content',
    capabilities: ['post_scheduling', 'content_creation', 'engagement_tracking'],
    color: '#E91E63',
    icon: '📱',
    requiredTools: ['social'] as const,
    canExecute: true,
  },
  {
    id: 'tpl_browser',
    key: 'browser' as AgentType,
    nameAr: 'وكيل المتصفح',
    nameEn: 'Browser Agent',
    descriptionAr: 'التصفح والاستخراج والتفاعل مع المواقع',
    descriptionEn: 'Browse, extract, and interact with websites',
    capabilities: ['web_scraping', 'form_fill', 'screenshot', 'data_extract'],
    color: '#9B51E0',
    icon: '🌍',
    requiredTools: ['browser'] as const,
    canExecute: true,
  },
  {
    id: 'tpl_cloud',
    key: 'cloud' as AgentType,
    nameAr: 'وكيل السحابة',
    nameEn: 'Cloud Agent',
    descriptionAr: 'تشغيل المهام على بيئة عمل سحابية',
    descriptionEn: 'Run tasks on a cloud computing environment',
    capabilities: ['file_management', 'script_execution', 'env_setup', 'deploy'],
    color: '#06B6D4',
    icon: '☁️',
    requiredTools: ['cloud'] as const,
    canExecute: true,
  },
  {
    id: 'tpl_analysis',
    key: 'analysis' as AgentType,
    nameAr: 'وكيل التحليل',
    nameEn: 'Analysis Agent',
    descriptionAr: 'تحليل البيانات والتقارير والإحصاءات',
    descriptionEn: 'Data analysis, reports & statistics',
    capabilities: ['data_analysis', 'chart_generation', 'report_export', 'trend_detection'],
    color: '#E67E22',
    icon: '📊',
    requiredTools: ['analytics'] as const,
    canExecute: true,
  },
] as const;

// ── Storage ──────────────────────────────────────────────────────
const AGENTS_KEY  = 'weyaak_agent_instances';
const SESSIONS_KEY = 'weyaak_agent_sessions';
const ACTIVE_KEY  = 'weyaak_active_agent_id';

function load<T>(key: string, fallback: T): T {
  try { const r = localStorage.getItem(key); return r ? (JSON.parse(r) as T) : fallback; }
  catch { return fallback; }
}
function save(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* silent */ }
}
function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

// ── Reducer ──────────────────────────────────────────────────────
interface AgentState {
  agents: AgentInstance[];
  sessions: AgentSession[];
  activeAgentId: string | null;
  hydrated: boolean;
}

type AgentAction =
  | { type: 'HYDRATE'; agents: AgentInstance[]; sessions: AgentSession[]; activeId: string | null }
  | { type: 'ADD_AGENT'; agent: AgentInstance }
  | { type: 'ADD_SESSION'; session: AgentSession }
  | { type: 'PATCH_AGENT'; id: string; patch: Partial<AgentInstance> }
  | { type: 'ADD_MESSAGE'; agentId: string; msg: AgentMessage }
  | { type: 'SET_ACTIVE'; id: string | null };

function reducer(state: AgentState, action: AgentAction): AgentState {
  switch (action.type) {

    case 'HYDRATE':
      return { agents: action.agents, sessions: action.sessions, activeAgentId: action.activeId, hydrated: true };

    case 'ADD_AGENT':
      return { ...state, agents: [...state.agents, action.agent] };

    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.session] };

    case 'PATCH_AGENT':
      return {
        ...state,
        agents: state.agents.map(a => a.id === action.id ? { ...a, ...action.patch } : a),
      };

    case 'ADD_MESSAGE': {
      const isActive = action.agentId === state.activeAgentId;
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.agentInstanceId === action.agentId
            ? { ...s, messages: [...s.messages, action.msg] }
            : s
        ),
        agents: state.agents.map(a =>
          a.id === action.agentId
            ? {
                ...a,
                lastUsedAt: new Date().toISOString(),
                unreadCount: action.msg.role === 'agent' && !isActive
                  ? a.unreadCount + 1
                  : a.unreadCount,
              }
            : a
        ),
      };
    }

    case 'SET_ACTIVE':
      return {
        ...state,
        activeAgentId: action.id,
        agents: action.id
          ? state.agents.map(a => a.id === action.id ? { ...a, unreadCount: 0 } : a)
          : state.agents,
      };
  }
}

// ── Context type ─────────────────────────────────────────────────
interface AgentActivationContextType {
  agents: AgentInstance[];
  sessions: AgentSession[];
  activeAgentId: string | null;
  hydrated: boolean;

  /** Creates Agent Instance + Session in one step. Use for "Add Agent" flow. */
  startChat: (type: AgentType, ownerId: string, userId?: string) => AgentInstance;

  /** Opens existing session (or creates one if missing). Use for "Chat" button. */
  activateChat: (agentId: string) => void;

  setActiveAgent: (id: string | null) => void;
  sendMessage: (agentId: string, content: string) => void;
  addAgentReply: (agentId: string, content: string, suggestions?: string[]) => void;
  getSession: (agentId: string) => AgentSession | null;
  updateAgentStatus: (agentId: string, status: AgentStatus) => void;
  markRead: (agentId: string) => void;

  /** Ensures the default ui_assistant exists for this user. Called on first login. */
  ensureDefaultAgent: (ownerId: string, userId?: string) => void;
}

const AgentActivationContext = createContext<AgentActivationContextType | null>(null);

// ── Provider ─────────────────────────────────────────────────────
export function AgentActivationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    agents: [], sessions: [], activeAgentId: null, hydrated: false,
  });

  // Sync ref — always points to latest state, no stale closure
  const s = useRef(state);
  s.current = state;

  // Hydrate from localStorage once on mount
  useEffect(() => {
    dispatch({
      type: 'HYDRATE',
      agents:   load<AgentInstance[]>(AGENTS_KEY, []),
      sessions: load<AgentSession[]>(SESSIONS_KEY, []),
      activeId: load<string | null>(ACTIVE_KEY, null),
    });
  }, []);

  // Persist every state change
  useEffect(() => {
    if (!state.hydrated) return;
    save(AGENTS_KEY, state.agents);
    save(SESSIONS_KEY, state.sessions);
    save(ACTIVE_KEY, state.activeAgentId);
  }, [state]);

  // ── ensureDefaultAgent ───────────────────────────────────────
  const ensureDefaultAgent = useCallback((ownerId: string, userId?: string) => {
    const hasDefault = s.current.agents.some(a => a.ownerId === ownerId && a.isDefault);
    if (hasDefault) {
      const def = s.current.agents.find(a => a.ownerId === ownerId && a.isDefault);
      if (def) dispatch({ type: 'SET_ACTIVE', id: def.id });
      return;
    }

    const tpl = AGENT_TEMPLATES.find(t => t.key === 'ui_assistant')!;
    const agentId = uid();
    const now = new Date().toISOString();

    const agent: AgentInstance = {
      id: agentId, agentType: 'ui_assistant', ownerId,
      nameAr: tpl.nameAr, nameEn: tpl.nameEn,
      status: 'chat_active', isDefault: true, canExecute: false,
      createdAt: now, lastUsedAt: now, unreadCount: 1,
    };
    const session: AgentSession = {
      id: uid(), agentInstanceId: agentId,
      userId: userId ?? ownerId,
      messages: [{
        id: uid(), role: 'agent',
        content: 'مرحباً! أنا وياك، مساعدك الذكي في بيت الريف. كيف يمكنني مساعدتك اليوم؟',
        timestamp: now,
        suggestions: ['ابحث عن مزود خدمة', 'فعّل وكيل SEO', 'استعرض الأدوات'],
      }],
      createdAt: now,
    };

    dispatch({ type: 'ADD_AGENT', agent });
    dispatch({ type: 'ADD_SESSION', session });
    dispatch({ type: 'SET_ACTIVE', id: agentId });
  }, []);

  // ── startChat — create instance + session together ───────────
  const startChat = useCallback((
    type: AgentType, ownerId: string, userId?: string,
  ): AgentInstance => {
    const tpl = AGENT_TEMPLATES.find(t => t.key === type)!;
    const agentId = uid();
    const now = new Date().toISOString();

    const agent: AgentInstance = {
      id: agentId, agentType: type, ownerId,
      nameAr: tpl.nameAr, nameEn: tpl.nameEn,
      status: 'chat_active', isDefault: false, canExecute: tpl.canExecute,
      createdAt: now, lastUsedAt: now, unreadCount: 0,
    };
    const session: AgentSession = {
      id: uid(), agentInstanceId: agentId,
      userId: userId ?? ownerId,
      messages: [{
        id: uid(), role: 'agent',
        content: `مرحباً! أنا ${tpl.nameAr}. ${tpl.descriptionAr}. كيف أساعدك؟`,
        timestamp: now,
        suggestions: ['ابدأ مهمة', 'عرض الإمكانيات', 'المساعدة'],
      }],
      createdAt: now,
    };

    dispatch({ type: 'ADD_AGENT', agent });
    dispatch({ type: 'ADD_SESSION', session });
    dispatch({ type: 'SET_ACTIVE', id: agentId });
    return agent;
  }, []);

  // ── activateChat — open existing session (or create if absent) ─
  const activateChat = useCallback((agentId: string) => {
    const hasSession = s.current.sessions.some(ss => ss.agentInstanceId === agentId);
    if (!hasSession) {
      const agent = s.current.agents.find(a => a.id === agentId);
      const tpl   = agent ? AGENT_TEMPLATES.find(t => t.key === agent.agentType) : null;
      const now   = new Date().toISOString();
      const session: AgentSession = {
        id: uid(), agentInstanceId: agentId,
        userId: agent?.ownerId ?? 'unknown',
        messages: [{
          id: uid(), role: 'agent',
          content: tpl
            ? `مرحباً! أنا ${tpl.nameAr}. ${tpl.descriptionAr}. كيف أساعدك؟`
            : 'مرحباً! كيف أساعدك؟',
          timestamp: now,
          suggestions: ['ابدأ مهمة', 'تحقق من الإعدادات', 'عرض الإمكانيات'],
        }],
        createdAt: now,
      };
      dispatch({ type: 'ADD_SESSION', session });
      dispatch({ type: 'PATCH_AGENT', id: agentId, patch: { status: 'chat_active', lastUsedAt: new Date().toISOString() } });
    }
    dispatch({ type: 'SET_ACTIVE', id: agentId });
  }, []);

  // ── Messages ──────────────────────────────────────────────────
  const sendMessage = useCallback((agentId: string, content: string) => {
    dispatch({
      type: 'ADD_MESSAGE',
      agentId,
      msg: { id: uid(), role: 'user', content, timestamp: new Date().toISOString() },
    });
  }, []);

  const addAgentReply = useCallback((agentId: string, content: string, suggestions?: string[]) => {
    dispatch({
      type: 'ADD_MESSAGE',
      agentId,
      msg: { id: uid(), role: 'agent', content, timestamp: new Date().toISOString(), suggestions },
    });
  }, []);

  // ── Helpers ───────────────────────────────────────────────────
  const getSession = useCallback((agentId: string): AgentSession | null =>
    s.current.sessions.find(ss => ss.agentInstanceId === agentId) ?? null,
  []);

  const updateAgentStatus = useCallback((agentId: string, status: AgentStatus) => {
    dispatch({ type: 'PATCH_AGENT', id: agentId, patch: { status } });
  }, []);

  const markRead = useCallback((agentId: string) => {
    dispatch({ type: 'PATCH_AGENT', id: agentId, patch: { unreadCount: 0 } });
  }, []);

  const setActiveAgent = useCallback((id: string | null) => {
    dispatch({ type: 'SET_ACTIVE', id });
  }, []);

  return (
    <AgentActivationContext.Provider value={{
      agents: state.agents,
      sessions: state.sessions,
      activeAgentId: state.activeAgentId,
      hydrated: state.hydrated,
      startChat, activateChat, setActiveAgent,
      sendMessage, addAgentReply, getSession,
      updateAgentStatus, markRead, ensureDefaultAgent,
    }}>
      {children}
    </AgentActivationContext.Provider>
  );
}

export function useAgentActivation() {
  const ctx = useContext(AgentActivationContext);
  if (!ctx) throw new Error('useAgentActivation must be used inside AgentActivationProvider');
  return ctx;
}
