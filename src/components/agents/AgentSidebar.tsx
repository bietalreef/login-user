/**
 * AgentSidebar.tsx — قائمة وكلاء وياك
 * ══════════════════════════════════════
 * Section 1: الوكلاء المفعلون  (Agent Instances — name + status badge + 2 buttons)
 * Section 2: المحادثات الأخيرة (Sessions — last message preview + time)
 * Footer:   + إضافة وكيل
 */
import { useState } from 'react';
import { useNavigate } from 'react-router@7.1.1';
import {
  Plus, Bot, MessageCircle, Zap, Clock,
  CheckCircle, AlertCircle, Shield, Loader2,
  ChevronDown, ChevronUp, Settings,
} from 'lucide-react';
import { useAgentActivation, AGENT_TEMPLATES } from '../../contexts/AgentActivationContext';
import { useIntegrations } from '../../contexts/IntegrationContext';
import { usePreview } from '../../contexts/PreviewContext';
import { useWeyaakIdentity } from '../../contexts/WeyaakIdentityContext';
import type { AgentInstance, AgentStatus, AgentType } from '../../types/agent-runtime';

const C = {
  bg:      '#060E1A',
  surface: '#0F1A2E',
  card:    '#111827',
  border:  'rgba(255,255,255,0.07)',
  text:    '#F1F5F9',
  textDim: '#64748B',
  gold:    '#D4AF37',
  green:   '#22C55E',
  red:     '#EF4444',
};

const STATUS_META: Record<AgentStatus, { label: string; color: string; Icon: React.ElementType }> = {
  created:     { label: 'جديد',    color: '#64748B', Icon: Shield },
  chat_active: { label: 'نشط',     color: '#22C55E', Icon: CheckCircle },
  ready:       { label: 'جاهز',    color: '#3B82F6', Icon: CheckCircle },
  blocked:     { label: 'محظور',   color: '#EF4444', Icon: AlertCircle },
  active:      { label: 'يعمل',    color: '#D4AF37', Icon: Loader2 },
  running:     { label: 'يُنفّذ',  color: '#8B5CF6', Icon: Loader2 },
  completed:   { label: 'مكتمل',   color: '#22C55E', Icon: CheckCircle },
  failed:      { label: 'فشل',     color: '#EF4444', Icon: AlertCircle },
};

function fmtTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'الآن';
  if (m < 60) return `${m}د`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}س`;
  return `${Math.floor(h / 24)}ي`;
}

// ── Compact agent row ─────────────────────────────────────────────
function AgentRow({
  agent, isActive, onChat, onActivate,
}: {
  agent: AgentInstance;
  isActive: boolean;
  onChat: (id: string) => void;
  onActivate: (id: string) => void;
}) {
  const tpl    = AGENT_TEMPLATES.find(t => t.key === agent.agentType);
  const sm     = STATUS_META[agent.status];
  const color  = tpl?.color ?? C.gold;
  const isRun  = agent.status === 'running' || agent.status === 'active';

  return (
    <div style={{
      background: isActive ? `${color}10` : C.card,
      border: `1px solid ${isActive ? color + '35' : C.border}`,
      borderRadius: 12, padding: '10px 12px',
      transition: 'all 0.15s',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Active indicator strip */}
      {isActive && (
        <div style={{
          position: 'absolute', top: 0, bottom: 0, right: 0,
          width: 3, background: color, borderRadius: '0 12px 12px 0',
        }} />
      )}

      {/* Top row: icon + name + status + time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, direction: 'rtl' }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: `${color}18`, border: `1px solid ${color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
        }}>
          {tpl?.icon ?? '🤖'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 12, color: C.text,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {agent.nameAr}
            {agent.unreadCount > 0 && !isActive && (
              <span style={{
                marginRight: 5, background: color, color: '#000',
                borderRadius: 99, fontSize: 9, fontWeight: 800,
                padding: '1px 5px', verticalAlign: 'middle',
              }}>
                {agent.unreadCount}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <sm.Icon
              size={10} color={sm.color}
              style={{ animation: isRun ? 'spin 1.5s linear infinite' : undefined }}
            />
            <span style={{ fontSize: 10, color: sm.color, fontFamily: "'Cairo', sans-serif" }}>
              {sm.label}
            </span>
            <span style={{ fontSize: 10, color: C.textDim, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Clock size={9} />
              {fmtTime(agent.lastUsedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 5 }}>
        {/* Chat */}
        <button
          onClick={() => onChat(agent.id)}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            padding: '6px 0', borderRadius: 7,
            border: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.03)',
            color: C.text, fontFamily: "'Cairo', sans-serif", fontSize: 11, fontWeight: 600,
            cursor: 'pointer', transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = color)}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = C.border)}
        >
          <MessageCircle size={11} />
          دردشة
        </button>

        {/* Activate — execution agents only */}
        {agent.canExecute ? (
          <button
            onClick={() => onActivate(agent.id)}
            disabled={agent.status === 'running'}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: '6px 0', borderRadius: 7, border: 'none',
              background: agent.status === 'running'
                ? 'rgba(255,255,255,0.05)'
                : agent.status === 'blocked'
                  ? 'rgba(239,68,68,0.15)'
                  : `linear-gradient(135deg, ${color}, ${color}bb)`,
              color: agent.status === 'running' ? C.textDim
                : agent.status === 'blocked' ? C.red : '#000',
              fontFamily: "'Cairo', sans-serif", fontSize: 11, fontWeight: 700,
              cursor: agent.status === 'running' ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {agent.status === 'running'
              ? <><Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> يعمل</>
              : agent.status === 'blocked'
                ? <><AlertCircle size={11} /> إعداد</>
                : <><Zap size={11} /> تفعيل</>}
          </button>
        ) : (
          /* Setup button for non-executable agents */
          <button
            onClick={() => onActivate(agent.id)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: '6px 0', borderRadius: 7,
              border: `1px solid rgba(212,175,55,0.2)`,
              background: 'rgba(212,175,55,0.06)', color: C.gold,
              fontFamily: "'Cairo', sans-serif", fontSize: 11, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Settings size={11} />
            إعداد
          </button>
        )}
      </div>
    </div>
  );
}

// ── Add agent menu ────────────────────────────────────────────────
function AddAgentMenu({ onAdd, onClose }: { onAdd: (type: AgentType) => void; onClose: () => void }) {
  return (
    <div
      style={{
        position: 'absolute', bottom: '100%', right: 0, left: 0,
        background: '#1A2540', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 12, padding: 8, marginBottom: 6,
        boxShadow: '0 -12px 40px rgba(0,0,0,0.5)', zIndex: 100,
      }}
      onClick={e => e.stopPropagation()}
    >
      <p style={{
        fontSize: 10, color: C.textDim, fontFamily: "'Cairo', sans-serif",
        textAlign: 'right', padding: '4px 8px 8px',
        borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 6,
      }}>
        إضافة وكيل جديد
      </p>
      {AGENT_TEMPLATES.filter(t => t.key !== 'ui_assistant').map(tpl => (
        <button
          key={tpl.key}
          onClick={() => { onAdd(tpl.key); onClose(); }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 10px', borderRadius: 8, border: 'none',
            background: 'transparent', color: C.text, cursor: 'pointer',
            fontFamily: "'Cairo', sans-serif", fontSize: 12, direction: 'rtl',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
        >
          <span style={{
            width: 28, height: 28, borderRadius: 8, fontSize: 15,
            background: `${tpl.color}18`, border: `1px solid ${tpl.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {tpl.icon}
          </span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 12 }}>{tpl.nameAr}</div>
            <div style={{ fontSize: 10, color: C.textDim }}>{tpl.descriptionAr}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────────
function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{
      fontSize: 9, color: C.textDim, fontFamily: "'Cairo', sans-serif",
      textAlign: 'right', padding: '6px 4px 4px',
      textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700,
    }}>
      {children}
    </p>
  );
}

// ── Main sidebar ──────────────────────────────────────────────────
export function AgentSidebar() {
  const {
    agents, sessions, activeAgentId,
    setActiveAgent, startChat, activateChat,
  } = useAgentActivation();
  const { agentReadiness } = useIntegrations();
  const { openPreview } = usePreview();
  const { userId } = useWeyaakIdentity();
  const navigate = useNavigate();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAllAgents, setShowAllAgents] = useState(false);

  const ownerId = userId ?? 'local_user';
  const myAgents = agents.filter(a => a.ownerId === ownerId);
  const visibleAgents = showAllAgents ? myAgents : myAgents.slice(0, 5);

  // Recent sessions — sorted by last message timestamp
  const recentSessions = sessions
    .filter(s => myAgents.some(a => a.id === s.agentInstanceId))
    .map(s => ({
      session: s,
      agent: myAgents.find(a => a.id === s.agentInstanceId)!,
      lastMsg: s.messages[s.messages.length - 1] ?? null,
      lastTime: s.messages.length > 0
        ? s.messages[s.messages.length - 1].timestamp
        : s.createdAt,
    }))
    .sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime())
    .slice(0, 4);

  // ── Handlers ────────────────────────────────────────────────
  function handleChat(agentId: string) {
    activateChat(agentId);
    setActiveAgent(agentId);
  }

  function handleActivate(agentId: string) {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;
    const tpl = AGENT_TEMPLATES.find(t => t.key === agent.agentType);
    if (!tpl) return;

    // فتح الشات أولاً
    activateChat(agentId);
    setActiveAgent(agentId);

    if (agent.canExecute) {
      const ar = agentReadiness(agent.agentType);
      if (!ar.isReady && ar.missing.length > 0) {
        // أول أداة ناقصة → الوكيل يشرحها
        const firstMissing = ar.missing[0].key;
        navigate(`/agents?connect=${firstMissing}`);
      } else {
        openPreview({
          mode: 'execution',
          title: `تنفيذ ${tpl.nameAr}`,
          agentId,
          taskId: null,
          status: 'running',
          toolKey: null,
        });
      }
    } else {
      openPreview({
        mode: 'setup',
        title: `إعداد ${tpl.nameAr}`,
        agentId,
        taskId: null,
        status: 'idle',
        toolKey: null,
      });
    }
  }

  function handleAddAgent(type: AgentType) {
    startChat(type, ownerId);
  }

  // System readiness score
  const connectedCount = agents.filter(a => a.status === 'chat_active' || a.status === 'ready').length;

  return (
    <div style={{
      width: 248, flexShrink: 0, background: C.bg,
      borderLeft: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: '14px 14px 10px', borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Bot size={15} color={C.gold} />
        <span style={{
          fontFamily: "'Cairo', sans-serif", fontWeight: 800,
          fontSize: 13, color: C.text, flex: 1, textAlign: 'right',
        }}>
          وكلائي
        </span>
        <span style={{
          background: 'rgba(212,175,55,0.12)', color: C.gold,
          borderRadius: 99, fontSize: 10, fontWeight: 700, padding: '2px 7px',
        }}>
          {myAgents.length}
        </span>
      </div>

      {/* ── Scrollable content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px 0' }}>

        {/* ── Section 1: Agent Instances ── */}
        <SectionLabel>الوكلاء المفعلون</SectionLabel>

        {myAgents.length === 0 ? (
          <div style={{
            padding: '12px 8px', textAlign: 'right',
            fontFamily: "'Cairo', sans-serif", fontSize: 11, color: C.textDim,
          }}>
            لا يوجد وكلاء بعد. أضف وكيلاً من الأسفل.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 4 }}>
            {visibleAgents.map(agent => (
              <AgentRow
                key={agent.id}
                agent={agent}
                isActive={activeAgentId === agent.id}
                onChat={handleChat}
                onActivate={handleActivate}
              />
            ))}
            {myAgents.length > 5 && (
              <button
                onClick={() => setShowAllAgents(s => !s)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '6px', borderRadius: 8, border: `1px dashed ${C.border}`,
                  background: 'transparent', color: C.textDim, cursor: 'pointer',
                  fontFamily: "'Cairo', sans-serif", fontSize: 11,
                }}
              >
                {showAllAgents ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {showAllAgents ? 'إخفاء' : `${myAgents.length - 5} وكلاء آخرون`}
              </button>
            )}
          </div>
        )}

        {/* ── Section 2: Recent Conversations ── */}
        {recentSessions.length > 0 && (
          <>
            <SectionLabel>المحادثات الأخيرة</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
              {recentSessions.map(({ session, agent, lastMsg, lastTime }) => {
                const tpl   = AGENT_TEMPLATES.find(t => t.key === agent?.agentType);
                const color = tpl?.color ?? C.gold;
                const isActive = activeAgentId === agent?.id;
                return (
                  <button
                    key={session.id}
                    onClick={() => agent && handleChat(agent.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 10px', borderRadius: 9,
                      border: `1px solid ${isActive ? color + '30' : C.border}`,
                      background: isActive ? `${color}08` : 'transparent',
                      cursor: 'pointer', direction: 'rtl', textAlign: 'right',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{tpl?.icon ?? '🤖'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: "'Cairo', sans-serif", fontSize: 11, fontWeight: 700,
                        color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {agent?.nameAr ?? '—'}
                      </div>
                      {lastMsg && (
                        <div style={{
                          fontFamily: "'Cairo', sans-serif", fontSize: 10, color: C.textDim,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {lastMsg.role === 'user' ? 'أنت: ' : ''}{lastMsg.content.slice(0, 28)}...
                        </div>
                      )}
                    </div>
                    <span style={{
                      fontSize: 9, color: C.textDim,
                      fontFamily: "'Cairo', sans-serif", flexShrink: 0,
                    }}>
                      {fmtTime(lastTime)}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Footer: Add agent ── */}
      <div style={{ padding: 10, borderTop: `1px solid ${C.border}`, position: 'relative' }}>
        {showAddMenu && (
          <AddAgentMenu onAdd={handleAddAgent} onClose={() => setShowAddMenu(false)} />
        )}
        <button
          onClick={() => setShowAddMenu(s => !s)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            padding: '9px', borderRadius: 10,
            border: `1px dashed rgba(212,175,55,0.3)`,
            background: 'rgba(212,175,55,0.05)', color: C.gold,
            fontFamily: "'Cairo', sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}
        >
          <Plus size={13} />
          إضافة وكيل
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
