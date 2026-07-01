/**
 * AgentCard.tsx — بطاقة الوكيل مع زرين: Chat + Activate
 */
import { MessageCircle, Zap, Clock, AlertCircle, CheckCircle, Loader2, Shield } from 'lucide-react';
import type { AgentInstance, AgentStatus } from '../../types/agent-runtime';
import { AGENT_TEMPLATES } from '../../contexts/AgentActivationContext';

const C = {
  bg:       '#0B1120',
  surface:  '#1A2540',
  border:   'rgba(255,255,255,0.10)',
  borderHi: 'rgba(255,255,255,0.18)',
  text:     '#F1F5F9',
  textDim:  '#94A3B8',
  gold:     '#D4AF37',
  goldSoft: 'rgba(212,175,55,0.12)',
};

const STATUS_META: Record<AgentStatus, { label: string; color: string; icon: React.ElementType }> = {
  created:       { label: 'جديد',        color: '#64748B', icon: Shield },
  chat_active:   { label: 'نشط',         color: '#22C55E', icon: CheckCircle },
  ready:         { label: 'جاهز',        color: '#3B82F6', icon: CheckCircle },
  blocked:       { label: 'محظور',       color: '#EF4444', icon: AlertCircle },
  active:        { label: 'يعمل',        color: '#D4AF37', icon: Loader2 },
  running:       { label: 'يُنفّذ',      color: '#8B5CF6', icon: Loader2 },
  completed:     { label: 'مكتمل',       color: '#22C55E', icon: CheckCircle },
  failed:        { label: 'فشل',         color: '#EF4444', icon: AlertCircle },
};

interface AgentCardProps {
  agent: AgentInstance;
  isActive: boolean;
  onChat: (id: string) => void;
  onActivate: (id: string) => void;
}

function fmtTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return 'الآن';
  if (m < 60)  return `${m}د`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}س`;
  return `${Math.floor(h / 24)}ي`;
}

export function AgentCard({ agent, isActive, onChat, onActivate }: AgentCardProps) {
  const tpl    = AGENT_TEMPLATES.find(t => t.key === agent.agentType);
  const meta   = STATUS_META[agent.status];
  const Icon   = meta.icon;
  const color  = tpl?.color ?? C.gold;
  const isRunning = agent.status === 'running' || agent.status === 'active';

  return (
    <div
      style={{
        background: isActive ? `${color}12` : C.surface,
        border: `1px solid ${isActive ? color + '40' : C.border}`,
        borderRadius: 14,
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Active indicator */}
      {isActive && (
        <div style={{
          position: 'absolute', inset: 0, left: 0, top: 0, bottom: 0,
          width: 3, background: color, borderRadius: '14px 0 0 14px',
        }} />
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        {/* Icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>
          {tpl?.icon ?? '🤖'}
        </div>

        {/* Name + status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
          }}>
            <span style={{
              fontFamily: "'Cairo', sans-serif", fontWeight: 700,
              fontSize: 13, color: C.text, direction: 'rtl',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {agent.nameAr}
            </span>
            {/* Unread badge */}
            {agent.unreadCount > 0 && !isActive && (
              <span style={{
                background: color, color: '#000', borderRadius: 99,
                fontSize: 10, fontWeight: 800, minWidth: 18, height: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 5px',
              }}>
                {agent.unreadCount}
              </span>
            )}
          </div>

          {/* Status + time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
            <Icon
              size={11}
              color={meta.color}
              style={{ animation: isRunning ? 'spin 1.5s linear infinite' : undefined }}
            />
            <span style={{ fontSize: 11, color: meta.color, fontFamily: "'Cairo', sans-serif" }}>
              {meta.label}
            </span>
            <span style={{ fontSize: 11, color: C.textDim, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Clock size={10} />
              {fmtTime(agent.lastUsedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {tpl && (
        <p style={{
          fontSize: 11, color: C.textDim, fontFamily: "'Cairo', sans-serif",
          direction: 'rtl', lineHeight: 1.5, marginBottom: 10,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {tpl.descriptionAr}
        </p>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 6 }}>
        {/* Chat button */}
        <button
          onClick={(e) => { e.stopPropagation(); onChat(agent.id); }}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: '7px 0', borderRadius: 8, border: `1px solid ${C.border}`,
            background: 'rgba(255,255,255,0.04)', color: C.text,
            fontFamily: "'Cairo', sans-serif", fontSize: 12, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = color; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; }}
        >
          <MessageCircle size={13} />
          دردشة
        </button>

        {/* Activate button — only for execution agents */}
        {agent.canExecute && (
          <button
            onClick={(e) => { e.stopPropagation(); onActivate(agent.id); }}
            disabled={agent.status === 'running'}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              padding: '7px 0', borderRadius: 8, border: 'none',
              background: agent.status === 'running'
                ? 'rgba(255,255,255,0.06)'
                : `linear-gradient(135deg, ${color}, ${color}cc)`,
              color: agent.status === 'running' ? C.textDim : '#000',
              fontFamily: "'Cairo', sans-serif", fontSize: 12, fontWeight: 700,
              cursor: agent.status === 'running' ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {agent.status === 'running'
              ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> يعمل...</>
              : <><Zap size={13} /> تفعيل</>
            }
          </button>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
