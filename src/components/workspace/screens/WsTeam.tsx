/**
 * WsTeam — Team & HR Management + Invitations
 * ═══════════════════════════════════════════════
 * Add member → enter data → link user ID → send invite
 * RBAC: Owner/Admin see this, Staff does not
 */

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../contexts/LanguageContext';
import { useWorkspace } from '../WorkspaceContext';
import { usePresence } from '../../../contexts/PresenceContext';
import { Icon3D } from '../../ui/Icon3D';
import { PresenceDot } from '../../ui/PresenceDot';
import * as api from '../workspaceApi';
import { toast } from 'sonner@2.0.3';
import type { WorkspaceMember, WorkspaceRole } from '../types';
import {
  Users, Plus, X, UserPlus, Shield, Crown, User,
  Phone, DollarSign, Link2, Send, Loader2, Trash2, Check,
} from 'lucide-react';

const fontCairo = 'Cairo, Tajawal, sans-serif';

const ROLE_CONFIG: Record<WorkspaceRole, { labelAr: string; labelEn: string; color: string; icon: any }> = {
  owner: { labelAr: 'المالك', labelEn: 'Owner', color: '#D4AF37', icon: Crown },
  admin: { labelAr: 'مدير', labelEn: 'Admin', color: '#3B82F6', icon: Shield },
  staff: { labelAr: 'موظف', labelEn: 'Staff', color: '#8B5CF6', icon: User },
};

export function WsTeam() {
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const ws = useWorkspace();
  const { workspace, members, myRole } = ws;
  const { fetchPresence } = usePresence();

  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [linkingMember, setLinkingMember] = useState<string | null>(null);
  const [linkUserId, setLinkUserId] = useState('');
  const [presenceMap, setPresenceMap] = useState<Record<string, any>>({});
  const [form, setForm] = useState({
    full_name: '', role: 'staff' as WorkspaceRole, job_title: '',
    phone: '', residency_number: '', salary: '', start_date: '', notes: '',
  });

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/60' : 'text-[#1F3D2B]/60';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const cardClass = isDark
    ? 'bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl'
    : 'bg-white border-[4px] border-gray-200/60 rounded-2xl shadow-sm';
  const inputClass = `w-full px-4 py-3 rounded-xl border-[4px] border-gray-200/60 text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-white text-[#1F3D2B]'}`;

  const handleAdd = async () => {
    if (!form.full_name.trim() || !form.job_title.trim() || !workspace) return;
    setAdding(true);
    try {
      await api.addMember(workspace.id, {
        full_name: form.full_name,
        role: form.role,
        job_title: form.job_title,
        phone: form.phone,
        residency_number: form.residency_number,
        salary: form.salary ? Number(form.salary) : undefined,
        start_date: form.start_date,
        notes: form.notes,
      });
      toast.success(isEn ? 'Member added!' : 'تمت إضافة العضو!');
      setShowAdd(false);
      setForm({ full_name: '', role: 'staff', job_title: '', phone: '', residency_number: '', salary: '', start_date: '', notes: '' });
      await ws.loadWorkspace(workspace.id);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleLink = async (memberId: string) => {
    if (!linkUserId.trim() || !workspace) return;
    try {
      await api.linkAndInvite(workspace.id, memberId, linkUserId.trim());
      toast.success(isEn ? 'Invitation sent!' : 'تم إرسال الدعوة!');
      setLinkingMember(null);
      setLinkUserId('');
      await ws.loadWorkspace(workspace.id);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!workspace) return;
    try {
      await api.removeMember(workspace.id, memberId);
      toast.success(isEn ? 'Member removed' : 'تم حذف العضو');
      await ws.loadWorkspace(workspace.id);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Fetch presence for all linked members
  useEffect(() => {
    const userIds = members.filter(m => m.user_id).map(m => m.user_id!);
    if (userIds.length > 0) {
      fetchPresence(userIds).then(setPresenceMap).catch(() => {});
    }
  }, [members, fetchPresence]);

  if (!workspace) return null;

  return (
    <div className="px-5 pt-8 pb-4 space-y-5" style={{ fontFamily: fontCairo }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon3D icon={Users} theme="purple" size="md" />
          <div>
            <h1 className={`text-lg font-bold ${textClass}`}>
              {isEn ? 'Team' : 'الفريق'}
            </h1>
            <p className={`text-xs ${mutedClass}`}>
              {members.length} {isEn ? 'members' : 'عضو'}
            </p>
          </div>
        </div>
        {(myRole === 'owner' || myRole === 'admin') && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            className={`p-2.5 rounded-xl border-[4px] transition-all ${
              showAdd
                ? 'bg-red-500/10 border-red-200/60 text-red-500'
                : isDark ? 'bg-[#FFD700]/15 border-[#FFD700]/30 text-[#FFD700]' : 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]'
            }`}
          >
            {showAdd ? <X className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Add Member Form */}
      {showAdd && (
        <div className={`${cardClass} p-4 space-y-3`}>
          <h3 className={`font-bold text-sm ${goldClass}`}>
            {isEn ? 'Add New Member' : 'إضافة عضو جديد'}
          </h3>

          <input className={inputClass} value={form.full_name}
            onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
            placeholder={isEn ? 'Full Name *' : 'الاسم الكامل *'} />

          <input className={inputClass} value={form.job_title}
            onChange={e => setForm(f => ({ ...f, job_title: e.target.value }))}
            placeholder={isEn ? 'Job Title *' : 'المسمى الوظيفي *'} />

          <div className="flex gap-2">
            {(['admin', 'staff'] as WorkspaceRole[]).map(role => {
              const cfg = ROLE_CONFIG[role];
              const selected = form.role === role;
              return (
                <button
                  key={role}
                  onClick={() => setForm(f => ({ ...f, role }))}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-[4px] transition-all ${
                    selected
                      ? `border-opacity-60 text-white` : isDark ? 'border-white/10 text-white/50' : 'border-gray-200/60 text-gray-400'
                  }`}
                  style={selected ? { backgroundColor: `${cfg.color}20`, borderColor: `${cfg.color}60`, color: cfg.color } : {}}
                >
                  {isEn ? cfg.labelEn : cfg.labelAr}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input className={inputClass} value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder={isEn ? 'Phone' : 'الهاتف'} />
            <input className={inputClass} value={form.residency_number}
              onChange={e => setForm(f => ({ ...f, residency_number: e.target.value }))}
              placeholder={isEn ? 'Residency No.' : 'رقم الإقامة'} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input type="number" className={inputClass} value={form.salary}
              onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
              placeholder={isEn ? 'Salary (AED)' : 'الراتب (د.إ)'} />
            <input type="date" className={inputClass} value={form.start_date}
              onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
          </div>

          <textarea className={`${inputClass} min-h-[60px]`} value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder={isEn ? 'Notes (optional)' : 'ملاحظات (اختياري)'} />

          <button onClick={handleAdd} disabled={adding || !form.full_name.trim() || !form.job_title.trim()}
            className="w-full py-3 rounded-xl font-bold text-sm bg-[#D4AF37] text-white hover:bg-[#C8A86A] disabled:opacity-50 transition-colors">
            {adding ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : isEn ? 'Add Member' : 'إضافة العضو'}
          </button>
        </div>
      )}

      {/* Members List */}
      {members.length === 0 ? (
        <div className={`${cardClass} p-8 text-center`}>
          <Icon3D icon={Users} theme="purple" size="xl" className="mx-auto mb-4" />
          <p className={`font-bold ${textClass}`}>{isEn ? 'No team members yet' : 'لا يوجد أعضاء بعد'}</p>
          <p className={`text-sm mt-1 ${mutedClass}`}>{isEn ? 'Add your first team member' : 'أضف أول عضو في الفريق'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map(member => {
            const roleConfig = ROLE_CONFIG[member.role];
            const RoleIcon = roleConfig.icon;
            const isLinking = linkingMember === member.id;

            return (
              <div key={member.id} className={`${cardClass} p-4`}>
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: `linear-gradient(135deg, ${roleConfig.color}80, ${roleConfig.color})` }}>
                      {member.full_name.charAt(0)}
                    </div>
                    {member.user_id && (
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <PresenceDot
                          status={presenceMap[member.user_id]?.status || 'offline'}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-sm ${textClass}`}>{member.full_name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                        style={{ backgroundColor: `${roleConfig.color}15`, color: roleConfig.color }}>
                        {isEn ? roleConfig.labelEn : roleConfig.labelAr}
                      </span>
                    </div>
                    <p className={`text-xs ${mutedClass}`}>{member.job_title}</p>

                    {/* Status & Details */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {member.phone && (
                        <span className={`text-[10px] flex items-center gap-1 ${mutedClass}`}>
                          <Phone className="w-3 h-3" />{member.phone}
                        </span>
                      )}
                      {member.salary && (
                        <span className={`text-[10px] flex items-center gap-1 ${mutedClass}`}>
                          <DollarSign className="w-3 h-3" />{member.salary.toLocaleString()} {isEn ? 'AED' : 'د.إ'}
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        member.status === 'active' ? 'bg-blue-500/15 text-blue-500' :
                        member.status === 'invited' ? 'bg-amber-500/15 text-amber-500' :
                        'bg-gray-500/15 text-gray-500'
                      }`}>
                        {member.status === 'active' ? (isEn ? 'Active' : 'نشط') :
                         member.status === 'invited' ? (isEn ? 'Invited' : 'مدعو') :
                         member.status === 'pending' ? (isEn ? 'Pending' : 'معلق') :
                         isEn ? 'Suspended' : 'معلّق'}
                      </span>
                    </div>

                    {/* Link User ID & Invite */}
                    {!member.user_id && member.role !== 'owner' && (myRole === 'owner' || myRole === 'admin') && (
                      <div className="mt-3">
                        {!isLinking ? (
                          <button
                            onClick={() => setLinkingMember(member.id)}
                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${isDark ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}`}
                          >
                            <Link2 className="w-3.5 h-3.5" />
                            {isEn ? 'Link User ID & Invite' : 'ربط المعرّف وإرسال دعوة'}
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              className={`flex-1 px-3 py-2 rounded-lg border-[4px] border-gray-200/60 text-xs ${isDark ? 'bg-white/10 text-white' : 'bg-white text-[#1F3D2B]'}`}
                              value={linkUserId}
                              onChange={e => setLinkUserId(e.target.value)}
                              placeholder={isEn ? 'User ID' : 'معرّف المستخدم'}
                            />
                            <button onClick={() => handleLink(member.id)}
                              className="p-2 rounded-lg bg-[#D4AF37] text-white">
                              <Send className="w-4 h-4" />
                            </button>
                            <button onClick={() => { setLinkingMember(null); setLinkUserId(''); }}
                              className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {member.user_id && (
                      <div className={`mt-2 flex items-center gap-1.5 text-[10px] ${isDark ? 'text-blue-300' : 'text-blue-500'}`}>
                        <Check className="w-3 h-3" />
                        {isEn ? 'Linked' : 'مربوط'}: {member.user_id.slice(0, 8)}...
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {member.role !== 'owner' && (myRole === 'owner' || myRole === 'admin') && (
                    <button onClick={() => handleRemove(member.id)}
                      className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-50'} text-red-400 transition-colors`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}