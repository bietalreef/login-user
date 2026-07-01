/**
 * ConnectorsPage.tsx — قائمة الأدوات
 * زر "ربط" → ينقل لشات الوكيل الذي يشرح ويساعد
 * زر "فصل" → يفصل مباشرة مع تأكيد
 */
import { useState } from 'react';
import { useNavigate } from 'react-router@7.1.1';
import { ArrowRight, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { useIntegrations } from '../../contexts/IntegrationContext';
import type { Integration, IntegrationKey } from '../../types/agent-runtime';

const C = {
  bg:      '#F8F9FB',
  card:    '#FFFFFF',
  border:  'rgba(0,0,0,0.08)',
  text:    '#0F172A',
  textDim: '#64748B',
  gold:    '#B8860B',
  green:   '#16A34A',
  red:     '#DC2626',
};

const GOOGLE_SCOPES: Partial<Record<string, string>> = {
  google:        'email profile',
  searchConsole: 'email profile https://www.googleapis.com/auth/webmasters.readonly',
  analytics:     'email profile https://www.googleapis.com/auth/analytics.readonly',
  maps:          'email profile https://www.googleapis.com/auth/business.manage',
};

const GROUPS = [
  { label: 'Google Workspace', icon: '🔵', keys: ['google', 'searchConsole', 'analytics', 'maps'] as IntegrationKey[] },
  { label: 'التواصل والمحتوى', icon: '💬', keys: ['whatsapp', 'social', 'domain'] as IntegrationKey[]  },
  { label: 'منصة وياك',        icon: '⚡', keys: ['browser', 'cloud'] as IntegrationKey[]              },
];

// ── Disconnect confirm ────────────────────────────────────────────
function DisconnectConfirm({ tool, onClose, onConfirm }: {
  tool: Integration; onClose: () => void; onConfirm: () => void;
}) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: C.card, border: '1px solid rgba(239,68,68,0.3)', borderRadius: 16, padding: 24, width: '100%', maxWidth: 340, direction: 'rtl', textAlign: 'center' }}
      >
        <div style={{ fontSize: 36, marginBottom: 10 }}>{tool.icon}</div>
        <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 8 }}>
          فصل {tool.nameAr}؟
        </p>
        <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 12, color: C.textDim, marginBottom: 20 }}>
          لن يتمكن الوكيل من استخدام هذه الأداة بعد الفصل.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 10, border: `1px solid ${C.border}`, background: 'transparent', color: C.text, fontFamily: "'Cairo', sans-serif", fontWeight: 600, cursor: 'pointer' }}>
            إلغاء
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: 'rgba(239,68,68,0.15)', color: C.red, fontFamily: "'Cairo', sans-serif", fontWeight: 700, cursor: 'pointer' }}>
            فصل
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tool row ──────────────────────────────────────────────────────
function ToolRow({ tool, onConnect, onDisconnect }: {
  tool: Integration;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const isConnected = tool.status === 'connected';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', direction: 'rtl' }}>
      <span style={{ fontSize: 24, flexShrink: 0 }}>{tool.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 13, color: C.text }}>
            {tool.nameAr}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {isConnected
              ? <><CheckCircle size={11} color={C.green} /><span style={{ fontSize: 10, color: C.green, fontFamily: "'Cairo', sans-serif" }}>متصل</span></>
              : <><AlertCircle size={11} color={C.textDim} /><span style={{ fontSize: 10, color: C.textDim, fontFamily: "'Cairo', sans-serif" }}>غير متصل</span></>}
          </span>
        </div>
        <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 11, color: C.textDim }}>
          {isConnected && tool.connectedEmail
            ? tool.connectedEmail
            : isConnected && tool.metadata?.url
            ? tool.metadata.url
            : tool.descriptionAr}
        </div>
      </div>

      {isConnected ? (
        <button
          onClick={onDisconnect}
          style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', color: C.textDim, fontFamily: "'Cairo', sans-serif", fontSize: 12, cursor: 'pointer', flexShrink: 0 }}
        >
          فصل
        </button>
      ) : (
        <button
          onClick={onConnect}
          style={{
            padding: '7px 16px', borderRadius: 8, border: 'none',
            background: `linear-gradient(135deg, ${C.gold}, ${C.gold}cc)`,
            color: '#000', fontFamily: "'Cairo', sans-serif", fontSize: 12, fontWeight: 700,
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          ربط
        </button>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export function ConnectorsPage() {
  const { integrations, disconnectTool, connectTool, connectWithData } = useIntegrations();
  const navigate = useNavigate();
  const [disconnectTarget, setDisconnectTarget] = useState<Integration | null>(null);
  const [toast, setToast] = useState('');
  const [connecting, setConnecting] = useState<IntegrationKey | null>(null);
  const [domainTarget, setDomainTarget] = useState<IntegrationKey | null>(null);
  const [domainVal, setDomainVal] = useState('');

  const connected = integrations.filter(i => i.status === 'connected').length;

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  function openGoogleOAuth(key: IntegrationKey) {
    const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string | undefined;
    if (!clientId) { showToast('يرجى إضافة VITE_GOOGLE_OAUTH_CLIENT_ID في .env'); return; }
    const redirectUri = `${window.location.origin}/oauth/callback`;
    const scope = encodeURIComponent(GOOGLE_SCOPES[key] ?? 'email profile');
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}&state=${key}&prompt=select_account`;
    const popup = window.open(url, 'wayak_oauth', 'width=500,height=600,top=100,left=200');
    setConnecting(key);
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin || e.data?.type !== 'weyaak_oauth_callback') return;
      window.removeEventListener('message', onMessage);
      setConnecting(null);
      if (e.data.success && e.data.token) {
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${e.data.token}` } })
          .then(r => r.json()).then(info => {
            let propertyId = '';
            if (key === 'analytics') propertyId = window.prompt('أدخل رقم Property ID الخاص بـ Google Analytics 4', '') ?? '';
            let siteUrl = '';
            if (key === 'searchConsole') siteUrl = window.prompt('أدخل رابط الموقع في Search Console', 'https://app.bietalreef.ae/') ?? '';
            connectWithData(key, { connectedEmail: info.email, metadata: { token: e.data.token, email: info.email, ...(propertyId ? { propertyId } : {}), ...(siteUrl ? { siteUrl } : {}) } });
            showToast(`✓ تم ربط ${integrations.find(i => i.key === key)?.nameAr ?? key}`);
          }).catch(() => { connectTool(key); showToast('✓ تم الربط'); });
      } else { if (popup && !popup.closed) popup.close(); }
    }
    window.addEventListener('message', onMessage);
  }

  function handleConnect(key: IntegrationKey) {
    if (key === 'domain') { setDomainTarget(key); return; }
    // All tools → navigate to real connectors page for OAuth/API key connection
    navigate('/connectors');
  }

  function handleDisconnectConfirm() {
    if (!disconnectTarget) return;
    disconnectTool(disconnectTarget.key);
    showToast(`تم فصل ${disconnectTarget.nameAr}`);
    setDisconnectTarget(null);
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', direction: 'rtl' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textDim, padding: 4 }}>
          <ArrowRight size={20} style={{ transform: 'scaleX(-1)' }} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontFamily: "'Cairo', sans-serif", fontWeight: 900, fontSize: 20, color: C.text }}>
            الموصلات
          </h1>
          <p style={{ margin: 0, fontFamily: "'Cairo', sans-serif", fontSize: 12, color: C.textDim }}>
            {connected} / {integrations.length} أداة متصلة
          </p>
        </div>
        {/* Overall % */}
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: `conic-gradient(${C.gold} ${(connected / integrations.length) * 360}deg, rgba(255,255,255,0.05) 0)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: C.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Cairo', sans-serif", fontSize: 10, fontWeight: 800, color: C.gold,
          }}>
            {Math.round((connected / integrations.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Groups */}
      <div style={{ padding: '16px 16px 60px' }}>
        {GROUPS.map(group => {
          const tools = group.keys.map(k => integrations.find(i => i.key === k)!).filter(Boolean);
          const cnt   = tools.filter(t => t.status === 'connected').length;
          return (
            <div key={group.label} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '0 4px' }}>
                <span style={{ fontSize: 16 }}>{group.icon}</span>
                <span style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 14, color: C.text, flex: 1 }}>{group.label}</span>
                <span style={{ fontSize: 10, color: cnt === tools.length ? C.green : C.textDim, fontFamily: "'Cairo', sans-serif" }}>
                  {cnt}/{tools.length}
                </span>
              </div>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
                {tools.map((tool, i) => (
                  <div key={tool.key}>
                    {i > 0 && <div style={{ height: 1, background: C.border, marginLeft: 16 }} />}
                    <ToolRow
                      tool={tool}
                      onConnect={() => handleConnect(tool.key)}
                      onDisconnect={() => setDisconnectTarget(tool)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Disconnect modal */}
      {disconnectTarget && (
        <DisconnectConfirm
          tool={disconnectTarget}
          onClose={() => setDisconnectTarget(null)}
          onConfirm={handleDisconnectConfirm}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(34,197,94,0.95)', color: '#000', zIndex: 2000,
          padding: '10px 20px', borderRadius: 99,
          fontFamily: "'Cairo', sans-serif", fontSize: 13, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <CheckCircle size={15} />
          {toast}
        </div>
      )}
    </div>
  );
}
