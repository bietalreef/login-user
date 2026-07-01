/**
 * WsProfile.tsx — Workspace Identity Screen
 * ═══════════════════════════════════════════
 * READS ONLY: ws_member:{wsId}:{memberId} + presence:{userId}
 * NEVER reads from marketplace_profile (except link out)
 *
 * Shows: workspace_display_name, workspace_avatar_url, role,
 *        job_title, last_active_at, presence
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../contexts/LanguageContext';
import { useWorkspace } from '../WorkspaceContext';
import { usePresence } from '../../../contexts/PresenceContext';
import { useEffectiveState } from '../../../contexts/EffectiveState';
import { Icon3D } from '../../ui/Icon3D';
import { PresenceDot } from '../../ui/PresenceDot';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import {
  getMyWorkspaceIdentity,
  updateMyWorkspaceIdentity,
  type WorkspaceIdentity,
  type PresenceData,
} from '../../../utils/identityApi';
import {
  User, Shield, Crown, Briefcase, Clock, Edit3, Save,
  X, Loader2, ExternalLink, Calendar, Building2,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { WorkspaceRole } from '../types';

const fontCairo = 'Cairo, Tajawal, sans-serif';

const ROLE_CONFIG: Record<WorkspaceRole, { labelAr: string; labelEn: string; color: string; icon: any }> = {
  owner: { labelAr: 'المالك', labelEn: 'Owner', color: '#D4AF37', icon: Crown },
  admin: { labelAr: 'مدير', labelEn: 'Admin', color: '#3B5BFE', icon: Shield },
  staff: { labelAr: 'موظف', labelEn: 'Staff', color: '#8B5CF6', icon: User },
};

export function WsProfile() {
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const ws = useWorkspace();
  const { workspace } = ws;
  const { fetchPresence, myStatus } = usePresence();
  const { state } = useEffectiveState();

  const [identity, setIdentity] = useState<WorkspaceIdentity | null>(null);
  const [presence, setPresence] = useState<PresenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ workspace_display_name: '', workspace_avatar_url: '' });

  useEffect(() => {
    if (!workspace?.id) return;
    setLoading(true);
    (async () => {
      try {
        const { identity: id } = await getMyWorkspaceIdentity(workspace.id);
        setIdentity(id);
        setForm({
          workspace_display_name: id.workspace_display_name || '',
          workspace_avatar_url: id.workspace_avatar_url || '',
        });
        // Get own presence
        if (id.user_id) {
          const presences = await fetchPresence([id.user_id]);
          setPresence(presences[id.user_id] || null);
        }
      } catch (err: any) {
        console.error('WsProfile load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [workspace?.id]);

  const handleSave = async () => {
    if (!workspace?.id) return;
    setSaving(true);
    try {
      const { identity: updated } = await updateMyWorkspaceIdentity(workspace.id, form);
      setIdentity(updated);
      setEditing(false);
      toast.success(isEn ? 'Workspace profile updated' : 'تم تحديث ملف مساحة العمل');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/50' : 'text-[#1F3D2B]/50';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const cardClass = isDark
    ? 'bg-white/10 backdrop-blur-xl border border-white/15'
    : 'bg-white border-[4px] border-gray-200/60 shadow-sm';
  const inputClass = `w-full px-4 py-3 rounded-xl border-2 text-sm ${
    isDark
      ? 'bg-white/10 border-white/15 text-white placeholder-white/30'
      : 'bg-[#F5EEE1]/50 border-gray-200 text-[#1F3D2B] placeholder-[#1F3D2B]/30'
  }`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className={`w-8 h-8 animate-spin ${goldClass}`} />
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Icon3D icon={User} theme="gold" size="lg" />
        <p className={`text-sm font-bold ${textClass}`} style={{ fontFamily: fontCairo }}>
          {isEn ? 'Workspace identity not found' : 'هوية مساحة العمل غير موجودة'}
        </p>
      </div>
    );
  }

  const roleConfig = ROLE_CONFIG[identity.role as WorkspaceRole] || ROLE_CONFIG.staff;
  const RoleIcon = roleConfig.icon;
  const displayName = identity.workspace_display_name || identity.full_name || '';
  const displayAvatar = identity.workspace_avatar_url || '';
  const effectivePresence = presence?.status || myStatus;

  return (
    <div
      className="pb-24"
      dir={isEn ? 'ltr' : 'rtl'}
      style={{ fontFamily: fontCairo }}
    >
      {/* ── Page Header ── */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h1 className={`text-xl font-black ${textClass}`}>
          {isEn ? 'Workspace Profile' : 'ملف مساحة العمل'}
        </h1>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
          >
            <Edit3 className={`w-4.5 h-4.5 ${goldClass}`} />
          </button>
        )}
      </div>

      {/* ── Identity Card ── */}
      <div className="px-4 mt-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardClass} rounded-3xl overflow-hidden`}
        >
          {/* Workspace banner */}
          <div
            className="h-16 relative"
            style={{
              background: `linear-gradient(135deg, ${roleConfig.color}40, ${roleConfig.color}15)`,
            }}
          >
            <div className="absolute top-2 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{ background: `${roleConfig.color}20` }}
            >
              <RoleIcon className="w-3 h-3" style={{ color: roleConfig.color }} />
              <span className="text-[10px] font-black" style={{ color: roleConfig.color }}>
                {isEn ? roleConfig.labelEn : roleConfig.labelAr}
              </span>
            </div>
          </div>

          <div className="px-5 pb-5 -mt-8 relative">
            {/* Avatar */}
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl overflow-hidden border-4 ${
                  isDark ? 'border-[#1a1a2e]' : 'border-white'
                } shadow-lg`}>
                  {displayAvatar ? (
                    <ImageWithFallback
                      src={displayAvatar}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${roleConfig.color}, ${roleConfig.color}80)` }}
                    >
                      <span className="text-white text-xl font-black">
                        {displayName?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5">
                  <PresenceDot status={effectivePresence} size="md" />
                </div>
              </div>

              <div className="flex-1 pt-8">
                {editing ? (
                  <div className="space-y-2">
                    <label className={`text-[10px] font-bold ${mutedClass}`}>
                      {isEn ? 'Workspace Display Name' : 'اسم العرض في مساحة العمل'}
                    </label>
                    <input
                      value={form.workspace_display_name}
                      onChange={(e) => setForm(p => ({ ...p, workspace_display_name: e.target.value }))}
                      className={inputClass}
                      placeholder={isEn ? 'Display name in workspace' : 'اسم العرض'}
                    />
                  </div>
                ) : (
                  <>
                    <h2 className={`text-lg font-black ${textClass}`}>{displayName}</h2>
                    <p className={`text-xs font-semibold ${mutedClass}`}>
                      <Briefcase className="w-3 h-3 inline" />{' '}
                      {identity.job_title || (isEn ? 'No title' : 'بدون مسمى')}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Presence */}
            <div className="mt-3">
              <PresenceDot
                status={effectivePresence}
                lastSeenAt={presence?.last_seen_at || identity.last_active_at}
                showText
                isEn={isEn}
              />
            </div>

            {/* Avatar URL (edit mode) */}
            {editing && (
              <div className="mt-3">
                <label className={`text-[10px] font-bold ${mutedClass}`}>
                  {isEn ? 'Workspace Avatar URL' : 'رابط صورة مساحة العمل'}
                </label>
                <input
                  value={form.workspace_avatar_url}
                  onChange={(e) => setForm(p => ({ ...p, workspace_avatar_url: e.target.value }))}
                  className={`${inputClass} mt-1`}
                  placeholder={isEn ? 'https://...' : 'https://...'}
                  dir="ltr"
                />
              </div>
            )}

            {/* Edit Actions */}
            {editing && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C8A86A] text-white text-sm font-bold disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isEn ? 'Save' : 'حفظ'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold ${
                    isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-[#1F3D2B]'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Workspace Details ── */}
      <div className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${cardClass} rounded-2xl p-5`}
        >
          <h3 className={`text-sm font-black mb-4 ${textClass}`}>
            {isEn ? 'Workspace Details' : 'تفاصيل مساحة العمل'}
          </h3>

          <div className="space-y-3">
            {/* Workspace Name */}
            <DetailRow
              icon={Building2}
              label={isEn ? 'Workspace' : 'مساحة العمل'}
              value={workspace?.name || '-'}
              color={goldClass}
              isDark={isDark}
              textClass={textClass}
              mutedClass={mutedClass}
            />

            {/* Role */}
            <DetailRow
              icon={RoleIcon}
              label={isEn ? 'Role' : 'الدور'}
              value={isEn ? roleConfig.labelEn : roleConfig.labelAr}
              color={`text-[${roleConfig.color}]`}
              isDark={isDark}
              textClass={textClass}
              mutedClass={mutedClass}
            />

            {/* Job Title */}
            <DetailRow
              icon={Briefcase}
              label={isEn ? 'Job Title' : 'المسمى الوظيفي'}
              value={identity.job_title || '-'}
              color={goldClass}
              isDark={isDark}
              textClass={textClass}
              mutedClass={mutedClass}
            />

            {/* Joined At */}
            {identity.joined_at && (
              <DetailRow
                icon={Calendar}
                label={isEn ? 'Joined' : 'تاريخ الانضمام'}
                value={new Date(identity.joined_at).toLocaleDateString(isEn ? 'en-US' : 'ar-AE')}
                color={goldClass}
                isDark={isDark}
                textClass={textClass}
                mutedClass={mutedClass}
              />
            )}

            {/* Last Active */}
            {identity.last_active_at && (
              <DetailRow
                icon={Clock}
                label={isEn ? 'Last Active' : 'آخر نشاط'}
                value={new Date(identity.last_active_at).toLocaleString(isEn ? 'en-US' : 'ar-AE')}
                color={goldClass}
                isDark={isDark}
                textClass={textClass}
                mutedClass={mutedClass}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Link to Public Profile ── */}
      {state.userId && (
        <div className="px-4 mt-4">
          <a
            href={`/profile/${state.userId}`}
            className={`${cardClass} rounded-2xl p-4 flex items-center gap-3 transition-all hover:scale-[1.01]`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-[#3B5BFE]/20' : 'bg-[#3B5BFE]/10'
            }`}>
              <ExternalLink className="w-4 h-4 text-[#3B5BFE]" />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-bold ${textClass}`}>
                {isEn ? 'View Public Profile' : 'عرض الملف العام'}
              </p>
              <p className={`text-[10px] font-semibold ${mutedClass}`}>
                {isEn ? 'Your marketplace identity visible to others' : 'هويتك العامة في السوق المرئية للآخرين'}
              </p>
            </div>
            <ChevronIcon isEn={isEn} isDark={isDark} />
          </a>
        </div>
      )}

      {/* ── Source Label ── */}
      <div className="px-4 mt-6">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
          isDark ? 'bg-white/5' : 'bg-[#3B5BFE]/5'
        }`}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#3B5BFE]" />
          <span className={`text-[10px] font-bold ${mutedClass}`}>
            {isEn
              ? 'Source: Workspace Member Identity'
              : 'المصدر: هوية عضو مساحة العمل'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Detail Row ──
function DetailRow({
  icon: Icon,
  label,
  value,
  color,
  isDark,
  textClass,
  mutedClass,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
  isDark: boolean;
  textClass: string;
  mutedClass: string;
}) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${
      isDark ? 'bg-white/5' : 'bg-[#F5EEE1]/50'
    }`}>
      <Icon className={`w-4 h-4 ${color}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-[10px] font-semibold ${mutedClass}`}>{label}</p>
        <p className={`text-sm font-bold truncate ${textClass}`}>{value}</p>
      </div>
    </div>
  );
}

// ── Chevron ──
function ChevronIcon({ isEn, isDark }: { isEn: boolean; isDark: boolean }) {
  return (
    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
      isDark ? 'bg-white/10' : 'bg-gray-100'
    }`}>
      <svg
        className={`w-3 h-3 ${isDark ? 'text-white/50' : 'text-[#1F3D2B]/40'} ${isEn ? '' : 'rotate-180'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </div>
  );
}
