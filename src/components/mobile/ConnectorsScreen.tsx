/**
 * ConnectorsScreen.tsx — نظام الموصلات والمهارات
 * ═══════════════════════════════════════════════
 * تصميم مستوحى من Manus Connectors — قائمة الموصلات
 * مع إمكانية الربط والفصل وإدارة الإعدادات
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, ChevronRight, Plus, Check, X, Loader2,
  Link2, Unlink, Settings, Shield, Zap, ExternalLink,
  Mail, Cloud, Calendar, Database, CreditCard, Workflow,
  Globe, FileText, MessageSquare, Search, RefreshCw,
  AlertTriangle, Copy, Eye, EyeOff, Plug,
} from 'lucide-react';
import { useNavigate } from 'react-router@7.1.1';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { supabase } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

const API = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;
const fontCairo = 'Cairo, sans-serif';

// ── Connector Definitions ──
export interface ConnectorDef {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: React.ElementType;
  color: string;
  category: 'communication' | 'storage' | 'automation' | 'payment' | 'development' | 'ai';
  authType: 'oauth' | 'api_key' | 'webhook';
  skills: string[];
  skillsEn: string[];
  configFields?: { key: string; label: string; labelEn: string; type: 'text' | 'password' | 'url'; placeholder: string }[];
}

// ── Google OAuth Config ──
const GOOGLE_CLIENT_ID = '848332516469-itj5coetd7cfomco0822it2f9equ6fcs.apps.googleusercontent.com';

const GOOGLE_SCOPES: Record<string, string> = {
  google_drive:     'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file',
  gmail:            'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send',
  google_calendar:  'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
};

const CONNECTORS: ConnectorDef[] = [
  {
    id: 'google_drive',
    name: 'Google Drive',
    nameEn: 'Google Drive',
    description: 'ادارة الملفات والمستندات من Google Drive',
    descriptionEn: 'Manage files and documents from Google Drive',
    icon: Cloud,
    color: '#4285F4',
    category: 'storage',
    authType: 'oauth',
    skills: ['رفع الملفات', 'تنظيم المجلدات', 'مشاركة الملفات', 'النسخ الاحتياطي'],
    skillsEn: ['Upload files', 'Organize folders', 'Share files', 'Backup'],
  },
  {
    id: 'gmail',
    name: 'Gmail',
    nameEn: 'Gmail',
    description: 'ارسال واستقبال البريد الالكتروني وتلخيص الرسائل',
    descriptionEn: 'Send, receive emails and summarize threads',
    icon: Mail,
    color: '#EA4335',
    category: 'communication',
    authType: 'oauth',
    skills: ['ارسال بريد', 'قراءة البريد', 'تلخيص المحادثات', 'البحث في الرسائل'],
    skillsEn: ['Send email', 'Read emails', 'Summarize threads', 'Search messages'],
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    nameEn: 'Google Calendar',
    description: 'ادارة المواعيد والجداول والتذكيرات',
    descriptionEn: 'Manage appointments, schedules and reminders',
    icon: Calendar,
    color: '#4285F4',
    category: 'communication',
    authType: 'oauth',
    skills: ['اضافة موعد', 'عرض الجدول', 'تذكيرات', 'حجز اجتماعات'],
    skillsEn: ['Add event', 'View schedule', 'Reminders', 'Book meetings'],
  },
  {
    id: 'n8n',
    name: 'n8n',
    nameEn: 'n8n',
    description: 'اتمتة سير العمل وربط التطبيقات المختلفة',
    descriptionEn: 'Automate workflows and connect different applications',
    icon: Workflow,
    color: '#FF6D5A',
    category: 'automation',
    authType: 'api_key',
    skills: ['تنفيذ سير عمل', 'اتمتة المهام', 'ربط الخدمات', 'جدولة العمليات'],
    skillsEn: ['Execute workflow', 'Automate tasks', 'Connect services', 'Schedule operations'],
    configFields: [
      { key: 'api_key', label: 'رمز الوصول', labelEn: 'Access Token', type: 'password', placeholder: 'n8n_api_...' },
    ],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    nameEn: 'Stripe',
    description: 'ادارة المدفوعات والفواتير واشتراكات العملاء',
    descriptionEn: 'Manage payments, invoices and customer subscriptions',
    icon: CreditCard,
    color: '#635BFF',
    category: 'payment',
    authType: 'api_key',
    skills: ['انشاء فاتورة', 'تتبع المدفوعات', 'ادارة الاشتراكات', 'استرداد الاموال'],
    skillsEn: ['Create invoice', 'Track payments', 'Manage subscriptions', 'Process refunds'],
    configFields: [
      { key: 'api_key', label: 'رمز الوصول', labelEn: 'Access Token', type: 'password', placeholder: 'sk_live_...' },
    ],
  },
  {
    id: 'supabase',
    name: 'Supabase',
    nameEn: 'Supabase',
    description: 'ادارة قواعد البيانات والمصادقة والتخزين',
    descriptionEn: 'Manage databases, authentication, and storage',
    icon: Database,
    color: '#3ECF8E',
    category: 'development',
    authType: 'api_key',
    skills: ['استعلامات البيانات', 'ادارة المستخدمين', 'رفع الملفات', 'الاشعارات الفورية'],
    skillsEn: ['Data queries', 'Manage users', 'File uploads', 'Realtime notifications'],
    configFields: [
      { key: 'api_key', label: 'رمز الوصول', labelEn: 'Access Token', type: 'password', placeholder: 'eyJ...' },
    ],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    nameEn: 'WhatsApp Business',
    description: 'ارسال رسائل واشعارات للعملاء عبر واتساب',
    descriptionEn: 'Send messages and notifications to customers via WhatsApp',
    icon: MessageSquare,
    color: '#25D366',
    category: 'communication',
    authType: 'api_key',
    skills: ['ارسال رسائل', 'ارسال قوالب', 'استقبال الردود', 'اشعارات الطلبات'],
    skillsEn: ['Send messages', 'Send templates', 'Receive replies', 'Order notifications'],
    configFields: [
      { key: 'api_token', label: 'رمز الوصول', labelEn: 'Access Token', type: 'password', placeholder: 'EAAx...' },
    ],
  },
  {
    id: 'webhook',
    name: 'Webhook مخصص',
    nameEn: 'Custom Webhook',
    description: 'ربط اي خدمة خارجية عبر HTTP webhooks',
    descriptionEn: 'Connect any external service via HTTP webhooks',
    icon: Globe,
    color: '#D4AF37',
    category: 'automation',
    authType: 'webhook',
    skills: ['استقبال البيانات', 'ارسال الاحداث', 'تكامل مخصص', 'اتمتة مخصصة'],
    skillsEn: ['Receive data', 'Send events', 'Custom integration', 'Custom automation'],
    configFields: [
      { key: 'url', label: 'رابط Webhook', labelEn: 'Webhook URL', type: 'url', placeholder: 'https://...' },
    ],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'الكل', labelEn: 'All' },
  { id: 'communication', label: 'التواصل', labelEn: 'Communication' },
  { id: 'storage', label: 'التخزين', labelEn: 'Storage' },
  { id: 'automation', label: 'الاتمتة', labelEn: 'Automation' },
  { id: 'payment', label: 'المدفوعات', labelEn: 'Payments' },
  { id: 'development', label: 'التطوير', labelEn: 'Development' },
];

interface ConnectorStatus {
  connected: boolean;
  config?: Record<string, string>;
  connected_at?: string;
}

async function getToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

export function ConnectorsScreen() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';

  const [statuses, setStatuses] = useState<Record<string, ConnectorStatus>>({});
  const [loading, setLoading] = useState(true);
  const [selectedConnector, setSelectedConnector] = useState<ConnectorDef | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Theme tokens
  const pageBg = isDark ? '#0C0D12' : '#F5F0E8';
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.85)';
  const cardBdr = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const textMain = isDark ? '#FFFFFF' : '#0F172A';
  const textSub = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(15,23,42,0.5)';

  // Fetch all connector statuses
  const fetchStatuses = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${API}/connectors`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': token,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setStatuses(data.connectors || {});
      }
    } catch (e) {
      console.log('Error fetching connector statuses:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatuses(); }, [fetchStatuses]);

  // Save connector config
  const handleSave = async () => {
    if (!selectedConnector) return;
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) { toast.error(isEn ? 'Not authenticated' : 'يرجى تسجيل الدخول'); return; }

      const res = await fetch(`${API}/connectors/${selectedConnector.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': token,
        },
        body: JSON.stringify({ config: configValues }),
      });

      if (res.ok) {
        toast.success(isEn ? `${selectedConnector.nameEn} connected successfully` : `تم ربط ${selectedConnector.name} بنجاح`);
        setStatuses(prev => ({
          ...prev,
          [selectedConnector.id]: { connected: true, config: configValues, connected_at: new Date().toISOString() },
        }));
        setSelectedConnector(null);
        setConfigValues({});
      } else {
        const err = await res.json();
        toast.error(err.error || (isEn ? 'Failed to save' : 'فشل في الحفظ'));
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  // Disconnect connector
  const handleDisconnect = async (connectorId: string) => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API}/connectors/${connectorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': token,
        },
      });

      if (res.ok) {
        toast.success(isEn ? 'Disconnected' : 'تم الفصل');
        setStatuses(prev => {
          const next = { ...prev };
          delete next[connectorId];
          return next;
        });
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  // ── Google OAuth Flow ──
  const [oauthLoading, setOauthLoading] = useState(false);

  const startGoogleOAuth = (connector: ConnectorDef) => {
    setOauthLoading(true);
    const scopes = GOOGLE_SCOPES[connector.id] || '';
    const redirectUri = `${window.location.origin}/auth/callback`;
    const state = JSON.stringify({ connectorId: connector.id, returnTo: '/connectors' });

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: `openid email profile ${scopes}`,
      access_type: 'offline',
      prompt: 'consent',
      state,
    });

    // Listen for the OAuth callback
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'oauth-callback' && event.data?.connectorId === connector.id) {
        window.removeEventListener('message', handleMessage);
        try {
          const token = await getToken();
          if (!token) { toast.error(isEn ? 'Not authenticated' : 'يرجى تسجيل الدخول'); return; }

          // Send the auth code to backend to exchange for tokens
          const res = await fetch(`${API}/connectors/${connector.id}/oauth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
              'X-User-Token': token,
            },
            body: JSON.stringify({ code: event.data.code, redirect_uri: redirectUri }),
          });

          if (res.ok) {
            const data = await res.json();
            toast.success(isEn ? `${connector.nameEn} connected!` : `تم ربط ${connector.name} بنجاح!`);
            setStatuses(prev => ({
              ...prev,
              [connector.id]: { connected: true, config: { email: data.email || '' }, connected_at: new Date().toISOString() },
            }));
            setSelectedConnector(null);
          } else {
            const err = await res.json().catch(() => ({}));
            toast.error(err.error || (isEn ? 'Authorization failed' : 'فشل التفويض'));
          }
        } catch (e: any) {
          toast.error(e.message);
        } finally {
          setOauthLoading(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Open OAuth popup
    const popup = window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      'google-oauth',
      'width=500,height=600,scrollbars=yes'
    );

    // Fallback: if popup is blocked, redirect instead
    if (!popup) {
      window.removeEventListener('message', handleMessage);
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      return;
    }

    // Poll for popup close
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        setOauthLoading(false);
      }
    }, 1000);
  };

  // Open config modal — Google OAuth starts directly without modal
  const openConfig = (connector: ConnectorDef) => {
    if (connector.authType === 'oauth' && !statuses[connector.id]?.connected) {
      startGoogleOAuth(connector);
      return;
    }
    const existing = statuses[connector.id]?.config || {};
    setConfigValues(existing);
    setSelectedConnector(connector);
    setShowPasswords({});
  };

  // Filter connectors
  const filtered = CONNECTORS.filter(c => {
    if (filter !== 'all' && c.category !== filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.description.includes(q) ||
        c.descriptionEn.toLowerCase().includes(q);
    }
    return true;
  });

  const connectedCount = Object.values(statuses).filter(s => s.connected).length;

  return (
    <div
      className="min-h-screen w-full pb-24"
      style={{ background: pageBg, fontFamily: fontCairo, direction: 'rtl' }}
    >
      {/* ── Header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: isDark ? 'rgba(12,13,18,0.9)' : 'rgba(245,240,232,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${cardBdr}`,
        padding: '16px 20px',
      }}>
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              style={{
                width: 38, height: 38, borderRadius: 12,
                background: cardBg, border: `1px solid ${cardBdr}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronRight style={{ width: 18, height: 18, color: textMain }} />
            </button>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: textMain, fontFamily: fontCairo }}>
                {isEn ? 'Connectors' : 'الموصلات'}
              </h1>
              <p style={{ fontSize: 12, color: textSub, fontFamily: fontCairo }}>
                {isEn
                  ? `${connectedCount} connected of ${CONNECTORS.length}`
                  : `${connectedCount} متصل من ${CONNECTORS.length}`
                }
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(212,175,55,0.1)',
            border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: 20, padding: '5px 14px',
          }}>
            <Plug style={{ width: 14, height: 14, color: '#D4AF37' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#D4AF37', fontFamily: fontCairo }}>
              MCP
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-5">
        {/* ── Search ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: cardBg, border: `1px solid ${cardBdr}`,
          borderRadius: 14, padding: '10px 14px', marginBottom: 16,
          backdropFilter: 'blur(12px)',
        }}>
          <Search style={{ width: 16, height: 16, color: textSub, flexShrink: 0 }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={isEn ? 'Search connectors...' : 'ابحث في الموصلات...'}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 14, color: textMain, fontFamily: fontCairo,
            }}
          />
        </div>

        {/* ── Category Filter ── */}
        <div style={{
          display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
          marginBottom: 20, scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              style={{
                padding: '6px 16px', borderRadius: 20, whiteSpace: 'nowrap',
                fontSize: 13, fontWeight: 700, fontFamily: fontCairo,
                background: filter === cat.id
                  ? 'linear-gradient(135deg, #D4AF37, #B8940E)'
                  : cardBg,
                color: filter === cat.id ? '#fff' : textMain,
                border: filter === cat.id
                  ? 'none'
                  : `1px solid ${cardBdr}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {isEn ? cat.labelEn : cat.label}
            </button>
          ))}
        </div>

        {/* ── Connectors List ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin" style={{ width: 32, height: 32, color: '#D4AF37' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((connector, i) => {
              const status = statuses[connector.id];
              const isConnected = status?.connected;
              const IconComp = connector.icon;

              return (
                <motion.div
                  key={connector.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    background: cardBg,
                    border: `1px solid ${isConnected ? `${connector.color}40` : cardBdr}`,
                    borderRadius: 16,
                    backdropFilter: 'blur(12px)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onClick={() => openConfig(connector)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
                    {/* Icon */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                      background: `${connector.color}15`,
                      border: `1.5px solid ${connector.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <IconComp style={{ width: 22, height: 22, color: connector.color }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: textMain, fontFamily: fontCairo }}>
                          {isEn ? connector.nameEn : connector.name}
                        </span>
                        {isConnected && (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            background: 'rgba(212,175,55,0.12)',
                            border: '1px solid rgba(212,175,55,0.3)',
                            borderRadius: 12, padding: '2px 8px',
                          }}>
                            <div style={{
                              width: 6, height: 6, borderRadius: '50%',
                              background: '#D4AF37',
                              boxShadow: '0 0 6px rgba(212,175,55,0.6)',
                            }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#D4AF37', fontFamily: fontCairo }}>
                              {isEn ? 'Connected' : 'متصل'}
                            </span>
                          </div>
                        )}
                      </div>
                      <p style={{
                        fontSize: 12, color: textSub, fontFamily: fontCairo,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {isEn ? connector.descriptionEn : connector.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ChevronLeft style={{ width: 18, height: 18, color: textSub, flexShrink: 0 }} />
                  </div>

                  {/* Skills strip */}
                  {isConnected && (
                    <div style={{
                      display: 'flex', gap: 6, padding: '0 18px 14px',
                      overflowX: 'auto', scrollbarWidth: 'none',
                    }}>
                      {(isEn ? connector.skillsEn : connector.skills).slice(0, 3).map((skill, si) => (
                        <span
                          key={si}
                          style={{
                            fontSize: 10, fontWeight: 600, fontFamily: fontCairo,
                            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                            borderRadius: 8, padding: '3px 10px',
                            color: textSub, whiteSpace: 'nowrap',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── Add Custom Connector CTA ── */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => {
            const webhookConn = CONNECTORS.find(c => c.id === 'webhook');
            if (webhookConn) openConfig(webhookConn);
          }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '16px', borderRadius: 16, marginTop: 16,
            background: 'rgba(212,175,55,0.06)',
            border: '1.5px dashed rgba(212,175,55,0.3)',
            cursor: 'pointer', fontFamily: fontCairo,
          }}
        >
          <Plus style={{ width: 18, height: 18, color: '#D4AF37' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#D4AF37' }}>
            {isEn ? 'Add Custom Connector' : 'اضافة موصل مخصص'}
          </span>
        </motion.button>

        {/* ── Agent Skills Summary ── */}
        <div style={{ marginTop: 28, marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: textMain, fontFamily: fontCairo, marginBottom: 4 }}>
            {isEn ? 'Active Skills' : 'المهارات النشطة'}
          </h2>
          <p style={{ fontSize: 12, color: textSub, fontFamily: fontCairo }}>
            {isEn
              ? 'Skills unlocked by your connected services'
              : 'المهارات المفعّلة من الخدمات المتصلة'
            }
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 32 }}>
          {CONNECTORS.filter(c => statuses[c.id]?.connected).flatMap(c =>
            (isEn ? c.skillsEn : c.skills).map((skill, i) => ({
              skill,
              color: c.color,
              connectorName: isEn ? c.nameEn : c.name,
              key: `${c.id}-${i}`,
            }))
          ).slice(0, 8).map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px', borderRadius: 12,
                background: cardBg, border: `1px solid ${cardBdr}`,
                backdropFilter: 'blur(8px)',
              }}
            >
              <Zap style={{ width: 14, height: 14, color: item.color, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: textMain, fontFamily: fontCairo, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.skill}
                </p>
                <p style={{ fontSize: 10, color: textSub, fontFamily: fontCairo }}>
                  {item.connectorName}
                </p>
              </div>
            </motion.div>
          ))}

          {connectedCount === 0 && (
            <div style={{
              gridColumn: '1 / -1', textAlign: 'center', padding: '24px 16px',
              color: textSub, fontSize: 13, fontFamily: fontCairo,
            }}>
              {isEn
                ? 'Connect services to unlock agent skills'
                : 'قم بربط الخدمات لتفعيل مهارات الوكيل'
              }
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          CONFIG MODAL
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {selectedConnector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setSelectedConnector(null); setConfigValues({}); }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 16,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: 480,
                background: isDark ? '#1A1B23' : '#FFFFFF',
                borderRadius: 24,
                border: `1px solid ${cardBdr}`,
                overflow: 'hidden',
                maxHeight: '85vh', overflowY: 'auto',
              }}
            >
              {/* Modal Header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '20px 24px',
                borderBottom: `1px solid ${cardBdr}`,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${selectedConnector.color}15`,
                  border: `1.5px solid ${selectedConnector.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <selectedConnector.icon style={{ width: 22, height: 22, color: selectedConnector.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: textMain, fontFamily: fontCairo }}>
                    {isEn ? selectedConnector.nameEn : selectedConnector.name}
                  </h3>
                  <p style={{ fontSize: 12, color: textSub, fontFamily: fontCairo }}>
                    {isEn ? selectedConnector.descriptionEn : selectedConnector.description}
                  </p>
                </div>
                <button
                  onClick={() => { setSelectedConnector(null); setConfigValues({}); }}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X style={{ width: 16, height: 16, color: textSub }} />
                </button>
              </div>

              {/* Skills */}
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${cardBdr}` }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: textMain, fontFamily: fontCairo, marginBottom: 10 }}>
                  {isEn ? 'Skills Unlocked' : 'المهارات المتاحة'}
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(isEn ? selectedConnector.skillsEn : selectedConnector.skills).map((skill, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11, fontWeight: 600, fontFamily: fontCairo,
                        background: `${selectedConnector.color}10`,
                        border: `1px solid ${selectedConnector.color}25`,
                        borderRadius: 10, padding: '4px 12px',
                        color: selectedConnector.color,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── OAuth vs API Key Section ── */}
              {selectedConnector.authType === 'oauth' ? (
                /* ━━━ Google OAuth ━━━ */
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                    <Shield style={{ width: 14, height: 14, color: '#4285F4' }} />
                    <span style={{ fontSize: 12, color: textSub, fontFamily: fontCairo }}>
                      {isEn
                        ? 'Secure OAuth — we never see your password'
                        : 'تفويض آمن — لا نطّلع على كلمة مرورك'
                      }
                    </span>
                  </div>

                  {statuses[selectedConnector.id]?.connected ? (
                    /* Already connected */
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
                      background: 'rgba(52,168,83,0.08)', border: '1px solid rgba(52,168,83,0.2)',
                      borderRadius: 14, marginBottom: 16,
                    }}>
                      <Check style={{ width: 18, height: 18, color: '#34A853' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#34A853', fontFamily: fontCairo }}>
                          {isEn ? 'Connected' : 'متصل'}
                        </p>
                        {statuses[selectedConnector.id]?.config?.email && (
                          <p style={{ fontSize: 11, color: textSub, fontFamily: fontCairo, direction: 'ltr', textAlign: 'right' }}>
                            {statuses[selectedConnector.id]?.config?.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* OAuth connect button */
                    <button
                      onClick={() => startGoogleOAuth(selectedConnector)}
                      disabled={oauthLoading}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        padding: '14px 20px', borderRadius: 14, marginBottom: 16,
                        background: '#FFFFFF', border: '1.5px solid #DADCE0',
                        cursor: oauthLoading ? 'wait' : 'pointer', fontFamily: fontCairo,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        transition: 'box-shadow 0.2s',
                        opacity: oauthLoading ? 0.7 : 1,
                      }}
                    >
                      {oauthLoading ? (
                        <Loader2 className="animate-spin" style={{ width: 18, height: 18, color: '#4285F4' }} />
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      )}
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#3C4043' }}>
                        {isEn ? 'Sign in with Google' : 'تسجيل الدخول بحساب Google'}
                      </span>
                    </button>
                  )}
                </div>
              ) : selectedConnector.configFields ? (
                /* ━━━ Token Authorization ━━━ */
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                    <Shield style={{ width: 14, height: 14, color: selectedConnector.color }} />
                    <span style={{ fontSize: 12, color: textSub, fontFamily: fontCairo }}>
                      {isEn
                        ? 'Authorize access — credentials are encrypted'
                        : 'تفويض الوصول — البيانات مشفرة ومحفوظة بامان'
                      }
                    </span>
                  </div>

                  {statuses[selectedConnector.id]?.connected ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
                      background: 'rgba(52,168,83,0.08)', border: '1px solid rgba(52,168,83,0.2)',
                      borderRadius: 14, marginBottom: 8,
                    }}>
                      <Check style={{ width: 18, height: 18, color: '#34A853' }} />
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#34A853', fontFamily: fontCairo }}>
                        {isEn ? 'Authorized & Connected' : 'مفوّض ومتصل'}
                      </p>
                    </div>
                  ) : (
                    selectedConnector.configFields.map(field => (
                      <div key={field.key} style={{ marginBottom: 14 }}>
                        <label style={{
                          display: 'block', fontSize: 12, fontWeight: 700,
                          color: textMain, fontFamily: fontCairo, marginBottom: 6,
                        }}>
                          {isEn ? field.labelEn : field.label}
                        </label>
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
                          border: `1px solid ${cardBdr}`,
                          borderRadius: 12, overflow: 'hidden',
                        }}>
                          <input
                            type={field.type === 'password' && !showPasswords[field.key] ? 'password' : 'text'}
                            value={configValues[field.key] || ''}
                            onChange={e => setConfigValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                            dir="ltr"
                            style={{
                              flex: 1, padding: '11px 14px',
                              background: 'transparent', border: 'none', outline: 'none',
                              fontSize: 13, color: textMain, fontFamily: 'monospace',
                            }}
                          />
                          {field.type === 'password' && (
                            <button
                              onClick={() => setShowPasswords(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                              style={{ padding: '0 12px', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              {showPasswords[field.key]
                                ? <EyeOff style={{ width: 15, height: 15, color: textSub }} />
                                : <Eye style={{ width: 15, height: 15, color: textSub }} />
                              }
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : null}

              {/* Actions */}
              <div style={{
                display: 'flex', gap: 10, padding: '16px 24px 24px',
                borderTop: `1px solid ${cardBdr}`,
              }}>
                {statuses[selectedConnector.id]?.connected && (
                  <button
                    onClick={() => {
                      handleDisconnect(selectedConnector.id);
                      setSelectedConnector(null);
                      setConfigValues({});
                    }}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '12px 16px', borderRadius: 14,
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.25)',
                      cursor: 'pointer', fontFamily: fontCairo,
                    }}
                  >
                    <Unlink style={{ width: 16, height: 16, color: '#EF4444' }} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>
                      {isEn ? 'Disconnect' : 'فصل'}
                    </span>
                  </button>
                )}

                {/* Show save button only for non-OAuth connectors */}
                {selectedConnector.authType !== 'oauth' && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '12px 16px', borderRadius: 14,
                      background: 'linear-gradient(135deg, #D4AF37, #B8940E)',
                      border: 'none', cursor: saving ? 'wait' : 'pointer',
                      fontFamily: fontCairo, opacity: saving ? 0.7 : 1,
                      boxShadow: '0 4px 16px rgba(212,175,55,0.3)',
                    }}
                  >
                    {saving ? (
                      <Loader2 className="animate-spin" style={{ width: 18, height: 18, color: '#fff' }} />
                    ) : (
                      <>
                        <Shield style={{ width: 16, height: 16, color: '#fff' }} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                          {statuses[selectedConnector.id]?.connected
                            ? (isEn ? 'Update' : 'تحديث')
                            : (isEn ? 'Authorize' : 'تفويض')
                          }
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ConnectorsScreen;
