/**
 * ChatWithPreviewLayout.tsx
 * ─────────────────────────────────────────────────────
 * Left: ChatPanel | Right: PreviewPane (when open)
 *
 * PreviewPane opens when:
 *   1. User clicks ⚙️ setup button in header
 *   2. Active agent is blocked (missing tools) → auto-open setup
 *   3. Activate button is clicked in sidebar
 */
import { useState, useRef, useEffect } from 'react';
import { Settings, ArrowRight, Mic, Sparkles, X } from 'lucide-react';
import { useAgentActivation, AGENT_TEMPLATES } from '../../contexts/AgentActivationContext';
import { useIntegrations } from '../../contexts/IntegrationContext';
import { usePreview } from '../../contexts/PreviewContext';
import { PreviewPane } from './PreviewPane';
import type { AgentMessage } from '../../types/agent-runtime';

const C = {
  bg:      '#080F1E',
  surface: '#0F1A2E',
  card:    '#1A2540',
  border:  'rgba(255,255,255,0.08)',
  text:    '#F1F5F9',
  textDim: '#64748B',
  gold:    '#D4AF37',
  red:     '#EF4444',
};

// ── Message bubble ────────────────────────────────────────────────
function MessageBubble({ msg, color }: { msg: AgentMessage; color: string }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-start', gap: 8, marginBottom: 12,
    }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>✨</div>
      )}
      <div style={{ maxWidth: '75%' }}>
        <div style={{
          padding: '10px 14px',
          borderRadius: isUser ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
          background: isUser ? `linear-gradient(135deg, ${color}cc, ${color}88)` : C.card,
          border: isUser ? 'none' : `1px solid ${C.border}`,
          color: isUser ? '#000' : C.text,
          fontFamily: "'Cairo', sans-serif", fontSize: 13, lineHeight: 1.6, direction: 'rtl',
        }}>
          {msg.content}
        </div>

        {msg.suggestions && msg.suggestions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {msg.suggestions.map((s, i) => (
              <button key={i} style={{
                padding: '5px 12px', borderRadius: 99,
                border: `1px solid ${color}40`, background: `${color}10`,
                color, fontSize: 11, fontFamily: "'Cairo', sans-serif",
                cursor: 'pointer', fontWeight: 600,
              }}>{s}</button>
            ))}
          </div>
        )}

        <div style={{
          fontSize: 10, color: C.textDim, marginTop: 4,
          textAlign: isUser ? 'left' : 'right', fontFamily: "'Cairo', sans-serif",
        }}>
          {new Date(msg.timestamp).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32 }}>
      <div style={{
        width: 64, height: 64, borderRadius: 20,
        background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 16,
      }}>✨</div>
      <p style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 6 }}>
        اختر وكيلاً من القائمة
      </p>
      <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 12, color: C.textDim, textAlign: 'center' }}>
        اضغط "دردشة" لفتح محادثة، أو "تفعيل" لبدء مهمة تنفيذية
      </p>
    </div>
  );
}

// ── Chat panel ────────────────────────────────────────────────────
function ChatPanel() {
  const { activeAgentId, agents, getSession, sendMessage, addAgentReply } = useAgentActivation();
  const { agentReadiness } = useIntegrations();
  const { preview, openPreview, closePreview } = usePreview();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const agent   = agents.find(a => a.id === activeAgentId);
  const session = activeAgentId ? getSession(activeAgentId) : null;
  const tpl     = agent ? AGENT_TEMPLATES.find(t => t.key === agent.agentType) : null;
  const color   = tpl?.color ?? C.gold;

  // Auto-open setup pane when active agent is blocked
  useEffect(() => {
    if (!agent || !tpl) return;
    if (agent.status === 'blocked' && !preview.isOpen) {
      openPreview({
        mode: 'setup',
        title: `إعداد ${tpl.nameAr}`,
        agentId: agent.id,
        taskId: null,
        status: 'waiting',
      });
    }
  }, [agent?.status, agent?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages?.length]);

  function handleSend() {
    if (!input.trim() || !activeAgentId) return;
    sendMessage(activeAgentId, input.trim());
    const q = input.trim();
    setInput('');
    setTimeout(() => {
      addAgentReply(activeAgentId, `استلمت رسالتك: "${q}". سأساعدك في ذلك.`, ['تفاصيل أكثر', 'ابدأ التنفيذ', 'إلغاء']);
    }, 800);
  }

  function handleToggleSetup() {
    if (preview.isOpen) {
      closePreview();
    } else {
      openPreview({
        mode: 'setup',
        title: agent ? `إعداد ${tpl?.nameAr ?? ''}` : 'إعداد النظام',
        agentId: activeAgentId ?? null,
        taskId: null,
        status: 'idle',
      });
    }
  }

  if (!activeAgentId || !agent) return <EmptyState />;

  // Readiness badge for header
  const ar = tpl ? agentReadiness(agent.agentType) : null;
  const isBlocked = ar && !ar.isReady && agent.canExecute;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 10, direction: 'rtl',
        flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, fontSize: 20, flexShrink: 0,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {tpl?.icon ?? '🤖'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: 14, color: C.text }}>
            {agent.nameAr}
          </div>
          <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 11, color: C.textDim }}>
            {tpl?.descriptionAr}
          </div>
        </div>

        {/* Blocked warning */}
        {isBlocked && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 99,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.red }} />
            <span style={{ fontSize: 10, color: C.red, fontFamily: "'Cairo', sans-serif" }}>
              {ar!.missing.length} أداة ناقصة
            </span>
          </div>
        )}

        {/* Preview active badge */}
        {preview.isOpen && !isBlocked && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 99,
            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
          }}>
            <Sparkles size={10} color='#8B5CF6' />
            <span style={{ fontSize: 10, color: '#8B5CF6', fontFamily: "'Cairo', sans-serif" }}>
              المعاينة نشطة
            </span>
          </div>
        )}

        {/* Setup toggle button — always visible */}
        <button
          onClick={handleToggleSetup}
          title={preview.isOpen ? 'إغلاق المعاينة' : 'فتح الإعداد'}
          style={{
            width: 32, height: 32, borderRadius: 8, border: `1px solid ${preview.isOpen ? color + '50' : C.border}`,
            background: preview.isOpen ? `${color}15` : 'rgba(255,255,255,0.04)',
            color: preview.isOpen ? color : C.textDim,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
          }}
        >
          {preview.isOpen ? <X size={14} /> : <Settings size={14} />}
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', direction: 'rtl' }}>
        {session?.messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} color={color} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 14px', borderTop: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'flex-end', gap: 8, flexShrink: 0,
      }}>
        <button style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          border: `1px solid ${C.border}`, background: C.card,
          color: C.textDim, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Mic size={16} />
        </button>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder='اكتب رسالتك...'
          rows={1}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 12,
            border: `1px solid ${C.border}`, background: C.card,
            color: C.text, fontFamily: "'Cairo', sans-serif", fontSize: 13,
            resize: 'none', outline: 'none', direction: 'rtl',
            maxHeight: 100, overflowY: 'auto',
          }}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0, border: 'none',
            background: input.trim() ? `linear-gradient(135deg, ${color}, ${color}cc)` : 'rgba(255,255,255,0.06)',
            color: input.trim() ? '#000' : C.textDim,
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
        >
          <ArrowRight size={16} style={{ transform: 'scaleX(-1)' }} />
        </button>
      </div>
    </div>
  );
}

// ── Main layout ───────────────────────────────────────────────────
export function ChatWithPreviewLayout() {
  const { preview } = usePreview();

  return (
    <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden', background: C.bg }}>
      {/* Chat — shrinks when preview is open */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <ChatPanel />
      </div>

      {/* Preview pane — slides in from right */}
      {preview.isOpen && <PreviewPane />}
    </div>
  );
}
