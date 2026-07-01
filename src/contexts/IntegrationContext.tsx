/**
 * IntegrationContext.tsx — Integration + Readiness System
 * ════════════════════════════════════════════════════════
 * - Tracks connection status per tool
 * - getMissingForAgent(agentType) → tools missing for a specific agent type
 * - agentReadiness(agentType) → { isReady, score, missing, required }
 * - readinessScore() → overall % (only tools used by at least one agent)
 * - localStorage persistence
 */
import {
  createContext, useContext, useState, useCallback, useMemo,
  type ReactNode,
} from 'react';
import type { Integration, IntegrationKey, IntegrationStatus, AgentType } from '../types/agent-runtime';
import { AGENT_TEMPLATES } from './AgentActivationContext';

// ── Default integrations ─────────────────────────────────────────
const DEFAULT_INTEGRATIONS: Integration[] = [
  {
    key: 'google',
    nameAr: 'Google',
    nameEn: 'Google',
    descriptionAr: 'حساب Google + OAuth',
    descriptionEn: 'Google Account + OAuth',
    status: 'not_connected',
    icon: '🔵',
  },
  {
    key: 'searchConsole',
    nameAr: 'Search Console',
    nameEn: 'Search Console',
    descriptionAr: 'أداء البحث في Google',
    descriptionEn: 'Google Search Console',
    status: 'not_connected',
    icon: '📊',
  },
  {
    key: 'analytics',
    nameAr: 'Google Analytics',
    nameEn: 'Google Analytics',
    descriptionAr: 'تحليلات الموقع',
    descriptionEn: 'Website Analytics',
    status: 'not_connected',
    icon: '📈',
  },
  {
    key: 'domain',
    nameAr: 'النطاق',
    nameEn: 'Domain',
    descriptionAr: 'نطاق موقعك الإلكتروني',
    descriptionEn: 'Your website domain',
    status: 'not_connected',
    icon: '🌐',
  },
  {
    key: 'maps',
    nameAr: 'خرائط Google',
    nameEn: 'Google Maps',
    descriptionAr: 'الحضور المحلي والخرائط',
    descriptionEn: 'Local presence & Maps',
    status: 'not_connected',
    icon: '📍',
  },
  {
    key: 'whatsapp',
    nameAr: 'واتساب',
    nameEn: 'WhatsApp',
    descriptionAr: 'التواصل عبر واتساب',
    descriptionEn: 'WhatsApp communication',
    status: 'not_connected',
    icon: '💬',
  },
  {
    key: 'social',
    nameAr: 'السوشيال ميديا',
    nameEn: 'Social Media',
    descriptionAr: 'حسابات التواصل الاجتماعي',
    descriptionEn: 'Social media accounts',
    status: 'not_connected',
    icon: '📱',
  },
  {
    key: 'browser',
    nameAr: 'متصفح السحابة',
    nameEn: 'Cloud Browser',
    descriptionAr: 'متصفح تحكم عن بُعد',
    descriptionEn: 'Remote browser session',
    status: 'not_connected',
    icon: '🌍',
  },
  {
    key: 'cloud',
    nameAr: 'الحاسوب السحابي',
    nameEn: 'Cloud Computer',
    descriptionAr: 'بيئة عمل سحابية',
    descriptionEn: 'Cloud computing environment',
    status: 'not_connected',
    icon: '☁️',
  },
];

// ── Storage ──────────────────────────────────────────────────────
const STORAGE_KEY = 'weyaak_integrations';

function loadFromStorage(): Integration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INTEGRATIONS;
    const saved: Partial<Record<IntegrationKey, IntegrationStatus>> = JSON.parse(raw);
    return DEFAULT_INTEGRATIONS.map(i => ({ ...i, status: saved[i.key] ?? i.status }));
  } catch {
    return DEFAULT_INTEGRATIONS;
  }
}

type PersistedEntry = {
  status: IntegrationStatus;
  connectedAt?: string;
  connectedEmail?: string;
  metadata?: Record<string, string>;
};

function saveToStorage(integrations: Integration[]) {
  try {
    const map: Partial<Record<IntegrationKey, PersistedEntry>> = {};
    integrations.forEach(i => {
      map[i.key] = {
        status: i.status,
        connectedAt: i.connectedAt,
        connectedEmail: i.connectedEmail,
        metadata: i.metadata,
      };
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch { /* silent */ }
}

function loadFromStorageNew(): Integration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INTEGRATIONS;
    const saved: Partial<Record<IntegrationKey, PersistedEntry | IntegrationStatus>> = JSON.parse(raw);
    return DEFAULT_INTEGRATIONS.map(i => {
      const entry = saved[i.key];
      if (!entry) return i;
      // Handle legacy format (just a status string)
      if (typeof entry === 'string') return { ...i, status: entry };
      return {
        ...i,
        status: entry.status ?? i.status,
        connectedAt: entry.connectedAt,
        connectedEmail: entry.connectedEmail,
        metadata: entry.metadata,
      };
    });
  } catch {
    return DEFAULT_INTEGRATIONS;
  }
}

// ── Readiness result ─────────────────────────────────────────────
export interface AgentReadiness {
  isReady: boolean;
  score: number;            // 0–100
  required: Integration[];  // all tools this agent needs
  missing: Integration[];   // required but not connected
  connected: Integration[]; // required and connected
}

// ── Context type ─────────────────────────────────────────────────
interface IntegrationContextType {
  integrations: Integration[];

  /** Get status of a single tool */
  getStatus: (key: IntegrationKey) => IntegrationStatus;

  /** Set tool status (use 'connected' | 'not_connected' | 'pending') */
  setStatus: (key: IntegrationKey, status: IntegrationStatus) => void;

  /** Connect a tool and save metadata (email, url, etc.) */
  connectWithData: (
    key: IntegrationKey,
    data: { connectedEmail?: string; metadata?: Record<string, string> },
  ) => void;

  /** Shorthand: mark a tool as connected (no metadata) */
  connectTool: (key: IntegrationKey) => void;

  /** Shorthand: mark a tool as disconnected */
  disconnectTool: (key: IntegrationKey) => void;

  /** True if ALL the given tool keys are connected */
  isReady: (keys: IntegrationKey[]) => boolean;

  /** Missing tools from a given key list */
  missingTools: (keys: IntegrationKey[]) => Integration[];

  /** Readiness info for a specific agent type */
  agentReadiness: (agentType: AgentType) => AgentReadiness;

  /** Missing tools for a specific agent type (convenience wrapper) */
  getMissingForAgent: (agentType: AgentType) => Integration[];

  /**
   * Overall system readiness score (0–100).
   * Denominator = only tools required by at least one executable agent.
   */
  readinessScore: () => number;
}

const IntegrationContext = createContext<IntegrationContextType | null>(null);

// ── Provider ─────────────────────────────────────────────────────
export function IntegrationProvider({ children }: { children: ReactNode }) {
  const [integrations, setIntegrations] = useState<Integration[]>(loadFromStorageNew);

  // All tool keys required by at least one executable agent
  const relevantKeys = useMemo<IntegrationKey[]>(() => {
    const keys = new Set<IntegrationKey>();
    AGENT_TEMPLATES
      .filter(t => t.canExecute)
      .forEach(t => (t.requiredTools as readonly IntegrationKey[]).forEach(k => keys.add(k)));
    return Array.from(keys);
  }, []);

  // ── Mutations ────────────────────────────────────────────────
  const setStatus = useCallback((key: IntegrationKey, status: IntegrationStatus) => {
    setIntegrations(prev => {
      const next = prev.map(i => i.key === key ? { ...i, status } : i);
      saveToStorage(next);
      return next;
    });
  }, []);

  const connectWithData = useCallback((
    key: IntegrationKey,
    data: { connectedEmail?: string; metadata?: Record<string, string> },
  ) => {
    setIntegrations(prev => {
      const next = prev.map(i =>
        i.key === key
          ? {
              ...i,
              status: 'connected' as IntegrationStatus,
              connectedAt: new Date().toISOString(),
              connectedEmail: data.connectedEmail,
              metadata: data.metadata,
            }
          : i
      );
      saveToStorage(next);
      return next;
    });
  }, []);

  const connectTool    = useCallback((key: IntegrationKey) => setStatus(key, 'connected'), [setStatus]);
  const disconnectTool = useCallback((key: IntegrationKey) => {
    setIntegrations(prev => {
      const next = prev.map(i =>
        i.key === key
          ? { ...i, status: 'not_connected' as IntegrationStatus, connectedAt: undefined, connectedEmail: undefined, metadata: undefined }
          : i
      );
      saveToStorage(next);
      return next;
    });
  }, []);

  // ── Queries (derive from state — no stale closure risk) ──────
  const getStatus = useCallback((key: IntegrationKey): IntegrationStatus => {
    return integrations.find(i => i.key === key)?.status ?? 'not_connected';
  }, [integrations]);

  const isReady = useCallback((keys: IntegrationKey[]): boolean => {
    return keys.length === 0 || keys.every(k => {
      const found = integrations.find(i => i.key === k);
      return found?.status === 'connected';
    });
  }, [integrations]);

  const missingTools = useCallback((keys: IntegrationKey[]): Integration[] => {
    return integrations.filter(i => keys.includes(i.key) && i.status !== 'connected');
  }, [integrations]);

  const agentReadiness = useCallback((agentType: AgentType): AgentReadiness => {
    const tpl = AGENT_TEMPLATES.find(t => t.key === agentType);
    const requiredKeys = (tpl?.requiredTools ?? []) as IntegrationKey[];
    const required  = integrations.filter(i => requiredKeys.includes(i.key));
    const missing   = required.filter(i => i.status !== 'connected');
    const connected = required.filter(i => i.status === 'connected');
    const score     = required.length === 0 ? 100 : Math.round((connected.length / required.length) * 100);
    return { isReady: missing.length === 0, score, required, missing, connected };
  }, [integrations]);

  const getMissingForAgent = useCallback((agentType: AgentType): Integration[] => {
    return agentReadiness(agentType).missing;
  }, [agentReadiness]);

  const readinessScore = useCallback((): number => {
    if (relevantKeys.length === 0) return 100;
    const connectedCount = relevantKeys.filter(k => {
      const found = integrations.find(i => i.key === k);
      return found?.status === 'connected';
    }).length;
    return Math.round((connectedCount / relevantKeys.length) * 100);
  }, [integrations, relevantKeys]);

  return (
    <IntegrationContext.Provider value={{
      integrations,
      getStatus, setStatus, connectWithData, connectTool, disconnectTool,
      isReady, missingTools, agentReadiness, getMissingForAgent, readinessScore,
    }}>
      {children}
    </IntegrationContext.Provider>
  );
}

export function useIntegrations() {
  const ctx = useContext(IntegrationContext);
  if (!ctx) throw new Error('useIntegrations must be used inside IntegrationProvider');
  return ctx;
}
