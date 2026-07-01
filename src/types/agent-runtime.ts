// agent-runtime.ts — Weyaak Agent OS Types

export type AgentStatus =
  | 'created'
  | 'chat_active'
  | 'ready'
  | 'blocked'
  | 'active'
  | 'running'
  | 'completed'
  | 'failed';

export type TaskStatus =
  | 'created'
  | 'validated'
  | 'blocked'
  | 'ready'
  | 'running'
  | 'waiting_input'
  | 'completed'
  | 'failed';

export type IntegrationStatus = 'connected' | 'not_connected' | 'pending';

export type PreviewMode = 'setup' | 'browser' | 'execution' | 'result' | 'providers';

export type AgentType =
  | 'ui_assistant'
  | 'seo'
  | 'social'
  | 'browser'
  | 'cloud'
  | 'analysis'
  | 'content';

export type IntegrationKey =
  | 'google'
  | 'searchConsole'
  | 'analytics'
  | 'domain'
  | 'maps'
  | 'whatsapp'
  | 'social'
  | 'browser'
  | 'cloud';

// ── Templates ──────────────────────────────────────────────────
export interface AgentTemplate {
  id: string;                     // unique template ID
  key: AgentType;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  capabilities: string[];         // what this agent can do
  icon: string;
  color: string;
  requiredTools: IntegrationKey[];
  canExecute: boolean;
}

// ── Instances ───────────────────────────────────────────────────
export interface AgentInstance {
  id: string;
  agentType: AgentType;
  ownerId: string;
  nameAr: string;
  nameEn: string;
  status: AgentStatus;
  isDefault: boolean;
  canExecute: boolean;
  createdAt: string;
  lastUsedAt: string;
  unreadCount: number;
}

// ── Sessions ────────────────────────────────────────────────────
export interface AgentMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export interface AgentSession {
  id: string;
  agentInstanceId: string;
  userId: string;               // Supabase user ID (or ownerId fallback)
  messages: AgentMessage[];
  createdAt: string;
}

// ── Tasks ───────────────────────────────────────────────────────
export interface AgentTask {
  id: string;
  agentInstanceId: string;
  titleAr: string;
  titleEn: string;
  status: TaskStatus;
  blockedReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Integrations ────────────────────────────────────────────────
export interface Integration {
  key: IntegrationKey;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  status: IntegrationStatus;
  icon: string;
  /** Metadata saved at connect time (email, url, platform, etc.) */
  connectedAt?: string;
  connectedEmail?: string;
  metadata?: Record<string, string>;
}

// ── Provider Search Results ──────────────────────────────────────
export interface ProviderResult {
  id: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  district?: string;
  rating?: number;
  reviewCount?: number;
  services?: string[];
  isVerified?: boolean;
}

// ── Preview ─────────────────────────────────────────────────────
export interface PreviewState {
  isOpen: boolean;
  mode: PreviewMode;
  title: string;
  taskId: string | null;
  agentId: string | null;
  status: 'idle' | 'running' | 'waiting' | 'completed' | 'failed';
  previewUrl: string | null;
  previewComponent: string | null;
  /** tool key for guided connect mode (e.g. 'google', 'whatsapp') */
  toolKey: string | null;
  /** provider search results for 'providers' mode */
  providerResults?: ProviderResult[];
  /** search query used to find providers */
  searchQuery?: string;
}
