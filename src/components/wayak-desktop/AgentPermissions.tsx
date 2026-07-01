/**
 * AgentPermissions.tsx — نظام صلاحيات الوكيل وياك
 * ══════════════════════════════════════════════════
 * Permission system: what the agent can access / control
 * Toggle permissions per section, view audit log
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, ShieldCheck, ShieldOff, Eye, EyeOff,
  Wrench, ShoppingCart, MapPin, MessageSquare,
  Wallet, FileText, BarChart3, Cpu, Users,
  Plug, HardHat, Settings, Lock, Unlock,
  AlertTriangle, Clock, ChevronDown,
  type LucideIcon,
} from 'lucide-react';

const fontCairo = "'Cairo', 'Tajawal', system-ui, sans-serif";
const fontMono  = "'JetBrains Mono', 'Fira Code', monospace";

// ═══════════════════════════════════════════
// Permission Types
// ═══════════════════════════════════════════
export interface AgentPermission {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  level: 'read' | 'write' | 'execute' | 'full';
  enabled: boolean;
  category: 'data' | 'action' | 'system';
  risk: 'low' | 'medium' | 'high';
}

export const DEFAULT_PERMISSIONS: AgentPermission[] = [
  // Data Access
  {
    id: 'services_read', label: 'قراءة الخدمات', labelEn: 'Read Services',
    description: 'الوصول لبيانات الخدمات والمقاولين',
    icon: Wrench, iconColor: '#D4AF37', level: 'read', enabled: true,
    category: 'data', risk: 'low',
  },
  {
    id: 'shop_read', label: 'قراءة المتجر', labelEn: 'Read Shop',
    description: 'تصفح المنتجات والاسعار',
    icon: ShoppingCart, iconColor: '#3B5BFE', level: 'read', enabled: true,
    category: 'data', risk: 'low',
  },
  {
    id: 'maps_access', label: 'الوصول للخرائط', labelEn: 'Map Access',
    description: 'البحث في الخريطة وتحديد المواقع',
    icon: MapPin, iconColor: '#EF4444', level: 'read', enabled: true,
    category: 'data', risk: 'low',
  },
  {
    id: 'wallet_read', label: 'قراءة المحفظة', labelEn: 'Read Wallet',
    description: 'عرض رصيد المحفظة والمعاملات',
    icon: Wallet, iconColor: '#D4AF37', level: 'read', enabled: false,
    category: 'data', risk: 'medium',
  },
  {
    id: 'messages_read', label: 'قراءة الرسائل', labelEn: 'Read Messages',
    description: 'الاطلاع على المحادثات والرسائل',
    icon: MessageSquare, iconColor: '#8B5CF6', level: 'read', enabled: false,
    category: 'data', risk: 'medium',
  },
  {
    id: 'profile_read', label: 'قراءة الملف الشخصي', labelEn: 'Read Profile',
    description: 'الوصول لبيانات الملف الشخصي',
    icon: Users, iconColor: '#3B5BFE', level: 'read', enabled: true,
    category: 'data', risk: 'low',
  },
  // Actions
  {
    id: 'quote_generate', label: 'انشاء عروض اسعار', labelEn: 'Generate Quotes',
    description: 'انشاء عروض اسعار تلقائيا',
    icon: FileText, iconColor: '#E67E22', level: 'execute', enabled: true,
    category: 'action', risk: 'medium',
  },
  {
    id: 'rfq_submit', label: 'ارسال طلبات عروض', labelEn: 'Submit RFQs',
    description: 'ارسال طلبات عروض اسعار للمقاولين',
    icon: BarChart3, iconColor: '#9B51E0', level: 'execute', enabled: false,
    category: 'action', risk: 'high',
  },
  {
    id: 'project_manage', label: 'ادارة المشاريع', labelEn: 'Manage Projects',
    description: 'انشاء وتحديث المشاريع',
    icon: HardHat, iconColor: '#D4AF37', level: 'write', enabled: false,
    category: 'action', risk: 'high',
  },
  {
    id: 'connectors_use', label: 'استخدام الموصلات', labelEn: 'Use Connectors',
    description: 'الوصول لخدمات خارجية عبر الموصلات',
    icon: Plug, iconColor: '#3B5BFE', level: 'execute', enabled: false,
    category: 'system', risk: 'high',
  },
  // System
  {
    id: 'ai_tools', label: 'تشغيل الادوات الذكية', labelEn: 'Run AI Tools',
    description: 'تشغيل ادوات الذكاء الاصطناعي نيابة عنك',
    icon: Cpu, iconColor: '#D4AF37', level: 'execute', enabled: true,
    category: 'system', risk: 'medium',
  },
  {
    id: 'settings_modify', label: 'تعديل الاعدادات', labelEn: 'Modify Settings',
    description: 'تغيير اعدادات التطبيق والتفضيلات',
    icon: Settings, iconColor: '#6B7280', level: 'write', enabled: false,
    category: 'system', risk: 'high',
  },
];

// ═══════════════════════════════════════════
// Audit Log
// ═══════════════════════════════════════════
interface AuditEntry {
  id: string;
  action: string;
  permission: string;
  timestamp: string;
  result: 'granted' | 'denied' | 'used';
}

const DEMO_AUDIT: AuditEntry[] = [
  { id: 'a1', action: 'وياك طلب قراءة بيانات الخدمات', permission: 'services_read', timestamp: '10:45', result: 'granted' },
  { id: 'a2', action: 'وياك استخدم اداة حساب التكلفة', permission: 'ai_tools', timestamp: '10:43', result: 'used' },
  { id: 'a3', action: 'وياك طلب ارسال طلب عرض سعر', permission: 'rfq_submit', timestamp: '10:40', result: 'denied' },
  { id: 'a4', action: 'وياك قرا بيانات المتجر', permission: 'shop_read', timestamp: '10:38', result: 'used' },
  { id: 'a5', action: 'وياك طلب الوصول للمحفظة', permission: 'wallet_read', timestamp: '10:35', result: 'denied' },
  { id: 'a6', action: 'وياك شغّل اداة تصميم ثنائي الابعاد', permission: 'ai_tools', timestamp: '10:30', result: 'used' },
];

// ═══════════════════════════════════════════
// Component
// ═══════════════════════════════════════════
interface AgentPermissionsProps {
  permissions: AgentPermission[];
  onToggle: (id: string) => void;
  onSetAll: (enabled: boolean) => void;
}

export function AgentPermissionsPanel({ permissions, onToggle, onSetAll }: AgentPermissionsProps) {
  const [view, setView] = useState<'permissions' | 'audit'>('permissions');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('data');

  const enabledCount = permissions.filter(p => p.enabled).length;
  const highRiskEnabled = permissions.filter(p => p.enabled && p.risk === 'high').length;

  const categories = [
    { id: 'data', label: 'الوصول للبيانات', icon: Eye, color: '#3B5BFE' },
    { id: 'action', label: 'تنفيذ الاجراءات', icon: Cpu, color: '#D4AF37' },
    { id: 'system', label: 'النظام', icon: Settings, color: '#9B51E0' },
  ];

  const p = {
    bg: '#0A0D15',
    surface: '#0E1018',
    border: 'rgba(255,255,255,0.05)',
    text: '#E8ECF2',
    textDim: '#5C6370',
    gold: '#D4AF37',
    blue: '#3B5BFE',
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: fontCairo }}>
      {/* ═══ Header Stats ═══ */}
      <div style={{
        padding: '14px 18px',
        background: 'linear-gradient(180deg, rgba(212,175,55,0.04), transparent)',
        borderBottom: `1px solid ${p.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(212,175,55,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldCheck style={{ width: 18, height: 18, color: p.gold }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: p.text }}>
              صلاحيات الوكيل وياك
            </div>
            <div style={{ fontSize: 11, color: p.textDim }}>
              {enabledCount} من {permissions.length} صلاحية مفعّلة
            </div>
          </div>
        </div>

        {/* Risk warning */}
        {highRiskEnabled > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderRadius: 10,
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.12)',
          }}>
            <AlertTriangle style={{ width: 13, height: 13, color: '#EF4444' }} />
            <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 600 }}>
              {highRiskEnabled} صلاحية عالية الخطورة مفعّلة
            </span>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, marginTop: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 3 }}>
          {[
            { id: 'permissions' as const, label: 'الصلاحيات', icon: Shield },
            { id: 'audit' as const, label: 'سجل النشاط', icon: Clock },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontFamily: fontCairo, fontSize: 11.5, fontWeight: 600,
                background: view === tab.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: view === tab.id ? p.text : p.textDim,
                transition: 'all 0.15s',
              }}
            >
              <tab.icon style={{ width: 12, height: 12 }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <button
            onClick={() => onSetAll(true)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              padding: '7px 10px', borderRadius: 9, border: `1px solid rgba(212,175,55,0.15)`,
              background: 'rgba(212,175,55,0.06)', cursor: 'pointer',
              fontFamily: fontCairo, fontSize: 11, fontWeight: 600, color: p.gold,
            }}
          >
            <Unlock style={{ width: 11, height: 11 }} />
            تفعيل الكل
          </button>
          <button
            onClick={() => onSetAll(false)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              padding: '7px 10px', borderRadius: 9, border: `1px solid rgba(239,68,68,0.15)`,
              background: 'rgba(239,68,68,0.06)', cursor: 'pointer',
              fontFamily: fontCairo, fontSize: 11, fontWeight: 600, color: '#EF4444',
            }}
          >
            <Lock style={{ width: 11, height: 11 }} />
            تعطيل الكل
          </button>
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 14px' }}>
        {view === 'permissions' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {categories.map(cat => {
              const catPerms = permissions.filter(p => p.category === cat.id);
              const isExpanded = expandedCategory === cat.id;
              return (
                <div key={cat.id} style={{
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.015)',
                  border: `1px solid ${p.border}`,
                  overflow: 'hidden',
                }}>
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 14px', border: 'none', cursor: 'pointer',
                      background: 'transparent', fontFamily: fontCairo,
                    }}
                  >
                    <cat.icon style={{ width: 14, height: 14, color: cat.color }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: p.text, flex: 1, textAlign: 'right' }}>
                      {cat.label}
                    </span>
                    <span style={{ fontSize: 10, color: p.textDim }}>
                      {catPerms.filter(p => p.enabled).length}/{catPerms.length}
                    </span>
                    <ChevronDown style={{
                      width: 13, height: 13, color: p.textDim,
                      transition: 'transform 0.2s',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    }} />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '4px 10px 10px' }}>
                          {catPerms.map(perm => (
                            <PermissionRow key={perm.id} permission={perm} onToggle={() => onToggle(perm.id)} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {DEMO_AUDIT.map(entry => (
              <div key={entry.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.015)',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 7,
                  background: entry.result === 'granted' ? 'rgba(212,175,55,0.08)'
                    : entry.result === 'denied' ? 'rgba(239,68,68,0.08)'
                    : 'rgba(59,91,254,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {entry.result === 'granted' && <ShieldCheck style={{ width: 12, height: 12, color: p.gold }} />}
                  {entry.result === 'denied' && <ShieldOff style={{ width: 12, height: 12, color: '#EF4444' }} />}
                  {entry.result === 'used' && <Eye style={{ width: 12, height: 12, color: p.blue }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: p.text }}>{entry.action}</div>
                </div>
                <span style={{ fontSize: 10, color: p.textDim, fontFamily: fontMono, direction: 'ltr' }}>
                  {entry.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Permission Row ──
function PermissionRow({ permission: perm, onToggle }: { permission: AgentPermission; onToggle: () => void }) {
  const Icon = perm.icon;
  return (
    <motion.div
      whileHover={{ background: 'rgba(255,255,255,0.03)' }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 10px', borderRadius: 10, cursor: 'pointer',
      }}
      onClick={onToggle}
    >
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: `${perm.iconColor}0A`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon style={{ width: 13, height: 13, color: perm.enabled ? perm.iconColor : '#5C6370' }} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 12, fontWeight: 600,
          color: perm.enabled ? '#E8ECF2' : '#5C6370',
        }}>
          {perm.label}
        </div>
        <div style={{ fontSize: 10, color: '#5C6370', marginTop: 1 }}>{perm.description}</div>
      </div>

      {/* Risk Badge */}
      <span style={{
        fontSize: 9, fontWeight: 700, borderRadius: 100, padding: '2px 7px',
        background: perm.risk === 'high' ? 'rgba(239,68,68,0.08)' : perm.risk === 'medium' ? 'rgba(212,175,55,0.08)' : 'rgba(59,91,254,0.08)',
        color: perm.risk === 'high' ? '#EF4444' : perm.risk === 'medium' ? '#D4AF37' : '#3B5BFE',
        border: `1px solid ${perm.risk === 'high' ? 'rgba(239,68,68,0.15)' : perm.risk === 'medium' ? 'rgba(212,175,55,0.15)' : 'rgba(59,91,254,0.15)'}`,
      }}>
        {perm.risk === 'high' ? 'عالي' : perm.risk === 'medium' ? 'متوسط' : 'منخفض'}
      </span>

      {/* Toggle */}
      <div style={{
        width: 36, height: 20, borderRadius: 10,
        background: perm.enabled ? 'rgba(212,175,55,0.20)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${perm.enabled ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.08)'}`,
        position: 'relative', flexShrink: 0,
        transition: 'all 0.2s',
      }}>
        <motion.div
          animate={{ x: perm.enabled ? -17 : -1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            position: 'absolute', top: 2,
            width: 16, height: 16, borderRadius: '50%',
            background: perm.enabled ? '#D4AF37' : '#5C6370',
            boxShadow: perm.enabled ? '0 0 8px rgba(212,175,55,0.4)' : 'none',
          }}
        />
      </div>
    </motion.div>
  );
}
