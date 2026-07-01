/**
 * WsMore — More Menu + Sub-Screens (Files, Diary, Settings)
 * ═══════════════════════════════════════════════════════════
 * Unified component for all "More" menu items
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router@7.1.1';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../contexts/LanguageContext';
import { useWorkspace } from '../WorkspaceContext';
import { PLANS, BUSINESS_TYPES } from '../config';
import { Icon3D } from '../../ui/Icon3D';
import * as api from '../workspaceApi';
import { toast } from 'sonner@2.0.3';
import { useEffectiveState } from '../../../contexts/EffectiveState';
import { motion, AnimatePresence } from 'motion/react';
import {
  MoreHorizontal, FolderOpen, BookOpen, Settings, Globe,
  FileSignature, Zap, Lock, ChevronLeft, ArrowRight,
  Plus, X, Loader2, CloudSun, Users, User,
  FileText, LogOut, Building2, AlertTriangle, Send, Clock, CheckCircle,
} from 'lucide-react';

// CheckCircle2 not available — using CheckCircle as alias
const CheckCircle2 = CheckCircle;

const fontCairo = 'Cairo, Tajawal, sans-serif';

interface WsMoreProps {
  screen: string;
}

export function WsMore({ screen }: WsMoreProps) {
  switch (screen) {
    case 'site_diary': return <SiteDiaryScreen />;
    case 'files': return <FilesScreen />;
    case 'settings': return <SettingsScreen />;
    default: return <MoreMenu />;
  }
}

// ═══════════════════════════════════════════
// More Menu
// ═══════════════════════════════════════════
function MoreMenu() {
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const ws = useWorkspace();
  const navigate = useNavigate();

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/60' : 'text-[#1F3D2B]/60';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const cardClass = isDark
    ? 'bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl'
    : 'bg-white border-[4px] border-gray-200/60 rounded-2xl shadow-sm';

  const menuItems = [
    { id: 'ws_profile', label: isEn ? 'Workspace Profile' : 'ملف مساحة العمل', icon: User, theme: 'blue', module: 'dashboard' },
    { id: 'site_diary', label: isEn ? 'Site Diary' : 'اليوميات', icon: BookOpen, theme: 'gold', module: 'site_diary' },
    { id: 'files', label: isEn ? 'Files' : 'الملفات', icon: FolderOpen, theme: 'orange', module: 'files' },
    { id: 'quotes_contracts', label: isEn ? 'Quotes & Contracts' : 'العقود والعروض', icon: FileSignature, theme: 'indigo', module: 'quotes_contracts' },
    { id: 'public_profile', label: isEn ? 'Public Profile' : 'البروفايل العام', icon: Globe, theme: 'teal', module: 'public_profile' },
    { id: 'settings', label: isEn ? 'Settings' : 'الإعدادات', icon: Settings, theme: 'brown', module: 'settings' },
  ].filter(item => ws.canAccessModule(item.module));

  // Automation (locked if not entitled)
  const automationEnabled = ws.workspace?.automation_enabled && (ws.myRole === 'owner');

  return (
    <div className="px-5 pt-8 pb-4 space-y-5" style={{ fontFamily: fontCairo }}>
      <div className="flex items-center gap-3">
        <Icon3D icon={MoreHorizontal} theme="brown" size="md" />
        <h1 className={`text-lg font-bold ${textClass}`}>
          {isEn ? 'More' : 'المزيد'}
        </h1>
      </div>

      <div className="space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => ws.setActiveSubScreen(item.id)}
            className={`${cardClass} p-4 w-full flex items-center gap-3 hover:scale-[1.01] transition-transform active:scale-95`}
          >
            <Icon3D icon={item.icon} theme={item.theme} size="sm" />
            <span className={`flex-1 text-right font-bold text-sm ${textClass}`}>{item.label}</span>
            <ChevronLeft className={`w-4 h-4 ${mutedClass}`} />
          </button>
        ))}

        {/* Automation — always visible but locked */}
        <button
          onClick={() => {
            if (!automationEnabled) {
              toast.info(isEn ? 'Upgrade your plan to access Automation' : 'قم بترقية باقتك للوصول إلى الأتمتة');
              return;
            }
            toast.info(isEn ? 'Automation coming soon via n8n' : 'الأتمتة قريباً عبر n8n');
          }}
          className={`${cardClass} p-4 w-full flex items-center gap-3 ${!automationEnabled ? 'opacity-50' : 'hover:scale-[1.01]'} transition-transform`}
        >
          <Icon3D icon={Zap} theme="amber" size="sm" />
          <span className={`flex-1 text-right font-bold text-sm ${textClass}`}>
            {isEn ? 'Automation' : 'الأتمتة'}
          </span>
          {!automationEnabled ? (
            <Lock className={`w-4 h-4 ${mutedClass}`} />
          ) : (
            <ChevronLeft className={`w-4 h-4 ${mutedClass}`} />
          )}
        </button>
      </div>

      {/* Exit Workspace */}
      <button
        onClick={() => navigate('/home')}
        className={`w-full p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold ${isDark ? 'bg-white/5 text-white/50 hover:bg-white/10' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'} transition-colors`}
      >
        <LogOut className="w-4 h-4" />
        {isEn ? 'Back to Main App' : 'العودة للتطبيق الرئيسي'}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════
// Site Diary Screen
// ═══════════════════════════════════════════
function SiteDiaryScreen() {
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const ws = useWorkspace();
  const { workspace, diaryEntries, projects } = ws;

  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    project_id: '', date: new Date().toISOString().split('T')[0],
    weather: '', workers_count: '', tasks_completed: '', notes: '',
  });

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/60' : 'text-[#1F3D2B]/60';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const cardClass = isDark
    ? 'bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl'
    : 'bg-white border-[4px] border-gray-200/60 rounded-2xl shadow-sm';
  const inputClass = `w-full px-4 py-3 rounded-xl border-[4px] border-gray-200/60 text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-white text-[#1F3D2B]'}`;

  useEffect(() => {
    ws.loadDiary();
    ws.loadProjects();
  }, []);

  const handleAdd = async () => {
    if (!form.project_id || !form.tasks_completed.trim() || !workspace) return;
    setAdding(true);
    try {
      const proj = projects.find(p => p.id === form.project_id);
      await api.createDiaryEntry(workspace.id, {
        project_id: form.project_id,
        project_name: proj?.name,
        date: form.date,
        weather: form.weather,
        workers_count: Number(form.workers_count) || 0,
        tasks_completed: form.tasks_completed,
        notes: form.notes,
      });
      toast.success(isEn ? 'Diary entry added!' : 'تمت إضافة اليومية!');
      setShowAdd(false);
      setForm({ project_id: '', date: new Date().toISOString().split('T')[0], weather: '', workers_count: '', tasks_completed: '', notes: '' });
      await ws.loadDiary();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="px-5 pt-8 pb-4 space-y-5" style={{ fontFamily: fontCairo }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => ws.setActiveSubScreen(null)}
            className={`p-2 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
            <ArrowRight className="w-4 h-4" />
          </button>
          <Icon3D icon={BookOpen} theme="gold" size="md" />
          <h1 className={`text-lg font-bold ${textClass}`}>
            {isEn ? 'Site Diary' : 'اليوميات'}
          </h1>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`p-2.5 rounded-xl border-[4px] transition-all ${
            showAdd ? 'bg-red-500/10 border-red-200/60 text-red-500'
              : isDark ? 'bg-[#FFD700]/15 border-[#FFD700]/30 text-[#FFD700]' : 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]'
          }`}
        >
          {showAdd ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className={`${cardClass} p-4 space-y-3`}>
          <select className={inputClass} value={form.project_id}
            onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))}>
            <option value="">{isEn ? 'Select Project *' : 'اختر المشروع *'}</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input type="date" className={inputClass} value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            <input className={inputClass} value={form.weather}
              onChange={e => setForm(f => ({ ...f, weather: e.target.value }))}
              placeholder={isEn ? 'Weather' : 'الطقس'} />
          </div>

          <input type="number" className={inputClass} value={form.workers_count}
            onChange={e => setForm(f => ({ ...f, workers_count: e.target.value }))}
            placeholder={isEn ? 'Workers Count' : 'عدد العمال'} />

          <textarea className={`${inputClass} min-h-[80px]`} value={form.tasks_completed}
            onChange={e => setForm(f => ({ ...f, tasks_completed: e.target.value }))}
            placeholder={isEn ? 'Tasks Completed *' : 'المهام المنجزة *'} />

          <textarea className={`${inputClass} min-h-[60px]`} value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder={isEn ? 'Notes (optional)' : 'ملاحظات (اختياري)'} />

          <button onClick={handleAdd} disabled={adding || !form.project_id || !form.tasks_completed.trim()}
            className="w-full py-3 rounded-xl font-bold text-sm bg-[#D4AF37] text-white hover:bg-[#C8A86A] disabled:opacity-50 transition-colors">
            {adding ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : isEn ? 'Save Diary Entry' : 'حفظ اليومية'}
          </button>
        </div>
      )}

      {/* Entries */}
      {diaryEntries.length === 0 ? (
        <div className={`${cardClass} p-8 text-center`}>
          <Icon3D icon={BookOpen} theme="gold" size="xl" className="mx-auto mb-4" />
          <p className={`font-bold ${textClass}`}>{isEn ? 'No diary entries yet' : 'لا توجد يوميات بعد'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {diaryEntries.map(entry => (
            <div key={entry.id} className={`${cardClass} p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold ${goldClass}`}>{entry.project_name || entry.project_id}</span>
                <span className={`text-[10px] ${mutedClass}`}>{entry.date}</span>
              </div>
              <p className={`text-sm ${textClass}`}>{entry.tasks_completed}</p>
              <div className="flex gap-3 mt-2">
                {entry.weather && (
                  <span className={`text-[10px] flex items-center gap-1 ${mutedClass}`}>
                    <CloudSun className="w-3 h-3" />{entry.weather}
                  </span>
                )}
                <span className={`text-[10px] flex items-center gap-1 ${mutedClass}`}>
                  <Users className="w-3 h-3" />{entry.workers_count} {isEn ? 'workers' : 'عامل'}
                </span>
              </div>
              {entry.notes && (
                <p className={`text-xs mt-2 pt-2 border-t ${isDark ? 'border-white/8' : 'border-gray-100'} ${mutedClass}`}>
                  {entry.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// Files Screen
// ═══════════════════════════════════════════
function FilesScreen() {
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const ws = useWorkspace();

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/60' : 'text-[#1F3D2B]/60';
  const cardClass = isDark
    ? 'bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl'
    : 'bg-white border-[4px] border-gray-200/60 rounded-2xl shadow-sm';

  useEffect(() => { ws.loadFiles(); }, []);

  return (
    <div className="px-5 pt-8 pb-4 space-y-5" style={{ fontFamily: fontCairo }}>
      <div className="flex items-center gap-3">
        <button onClick={() => ws.setActiveSubScreen(null)}
          className={`p-2 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
          <ArrowRight className="w-4 h-4" />
        </button>
        <Icon3D icon={FolderOpen} theme="orange" size="md" />
        <h1 className={`text-lg font-bold ${textClass}`}>{isEn ? 'Files' : 'الملفات'}</h1>
      </div>

      {ws.files.length === 0 ? (
        <div className={`${cardClass} p-8 text-center`}>
          <Icon3D icon={FolderOpen} theme="orange" size="xl" className="mx-auto mb-4" />
          <p className={`font-bold ${textClass}`}>{isEn ? 'No files yet' : 'لا توجد ملفات بعد'}</p>
          <p className={`text-sm mt-1 ${mutedClass}`}>
            {isEn ? 'File management coming soon' : 'إدارة الملفات قريباً'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {ws.files.map(file => (
            <div key={file.id} className={`${cardClass} p-3.5 flex items-center gap-3`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-500/15' : 'bg-orange-50'}`}>
                <FileText className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${textClass}`}>{file.name}</p>
                <p className={`text-[10px] ${mutedClass}`}>{file.file_type} · {file.created_at?.split('T')[0]}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════
// Settings Screen
// ═══════════════════════════════════════════
function SettingsScreen() {
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const ws = useWorkspace();
  const { workspace, myRole } = ws;
  const navigate = useNavigate();

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/60' : 'text-[#1F3D2B]/60';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const cardClass = isDark
    ? 'bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl'
    : 'bg-white border-[4px] border-gray-200/60 rounded-2xl shadow-sm';

  if (!workspace) return null;
  const plan = PLANS[workspace.plan];
  const bt = BUSINESS_TYPES.find(b => b.value === workspace.business_type);

  return (
    <div className="px-5 pt-8 pb-4 space-y-5" style={{ fontFamily: fontCairo }}>
      <div className="flex items-center gap-3">
        <button onClick={() => ws.setActiveSubScreen(null)}
          className={`p-2 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
          <ArrowRight className="w-4 h-4" />
        </button>
        <Icon3D icon={Settings} theme="brown" size="md" />
        <h1 className={`text-lg font-bold ${textClass}`}>{isEn ? 'Settings' : 'الإعدادات'}</h1>
      </div>

      {/* Workspace Info */}
      <div className={`${cardClass} p-4 space-y-3`}>
        <div className="flex items-center gap-3 mb-2">
          <Icon3D icon={Building2} theme={bt?.iconTheme || 'gold'} size="md" />
          <div>
            <h2 className={`font-bold ${textClass}`}>{workspace.name}</h2>
            <p className={`text-xs ${mutedClass}`}>{bt?.[isEn ? 'labelEn' : 'labelAr']}</p>
          </div>
        </div>

        <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className={`text-[10px] ${mutedClass}`}>{isEn ? 'Plan' : 'الباقة'}</p>
              <p className={`font-bold ${goldClass}`}>{plan[isEn ? 'nameEn' : 'nameAr']}</p>
            </div>
            <div>
              <p className={`text-[10px] ${mutedClass}`}>{isEn ? 'Your Role' : 'دورك'}</p>
              <p className={`font-bold ${textClass}`}>
                {myRole === 'owner' ? (isEn ? 'Owner' : 'المالك') :
                 myRole === 'admin' ? (isEn ? 'Admin' : 'مدير') :
                 isEn ? 'Staff' : 'موظف'}
              </p>
            </div>
            <div>
              <p className={`text-[10px] ${mutedClass}`}>{isEn ? 'Max Members' : 'الحد الأقصى للأعضاء'}</p>
              <p className={`font-bold ${textClass}`}>{plan.maxMembers}</p>
            </div>
            <div>
              <p className={`text-[10px] ${mutedClass}`}>{isEn ? 'Max Projects' : 'الحد الأقصى للمشاريع'}</p>
              <p className={`font-bold ${textClass}`}>{plan.maxProjects}</p>
            </div>
          </div>
        </div>

        {workspace.phone && (
          <p className={`text-xs ${mutedClass}`}>
            {isEn ? 'Phone' : 'الهاتف'}: {workspace.phone}
          </p>
        )}
        {workspace.email && (
          <p className={`text-xs ${mutedClass}`}>
            {isEn ? 'Email' : 'البريد'}: {workspace.email}
          </p>
        )}
      </div>

      {/* Workspace ID (for invitations) */}
      <div className={`${cardClass} p-4`}>
        <p className={`text-xs font-bold mb-2 ${goldClass}`}>
          {isEn ? 'Workspace ID (for support)' : 'معرّف مساحة العمل'}
        </p>
        <div className={`p-3 rounded-xl text-center font-mono text-sm ${isDark ? 'bg-white/5 text-white/80' : 'bg-gray-50 text-[#1F3D2B]/80'}`}>
          {workspace.id}
        </div>
      </div>

      {/* Danger Zone */}
      {myRole === 'owner' && (
        <DangerZone workspace={workspace} isEn={isEn} isDark={isDark} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// Danger Zone — Workspace Deletion Request
// ═══════════════════════════════════════════
function DangerZone({
  workspace,
  isEn,
  isDark,
}: {
  workspace: any;
  isEn: boolean;
  isDark: boolean;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const { refresh: refreshEffectiveState } = useEffectiveState();

  const mutedClass = isDark ? 'text-white/60' : 'text-[#1F3D2B]/60';
  const cardClass = isDark
    ? 'bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl'
    : 'bg-white border-[4px] border-gray-200/60 rounded-2xl shadow-sm';
  const inputClass = `w-full px-4 py-3 rounded-xl border-[4px] border-gray-200/60 text-sm ${
    isDark ? 'bg-white/10 text-white border-white/15' : 'bg-white text-[#1F3D2B]'
  }`;

  // Check existing pending request on mount
  useEffect(() => {
    if (!workspace?.id) return;
    setCheckingStatus(true);
    api.getDeletionRequestStatus(workspace.id)
      .then(data => {
        setPendingRequest(data.request);
      })
      .catch(() => {})
      .finally(() => setCheckingStatus(false));
  }, [workspace?.id]);

  const handleSubmitRequest = async () => {
    if (!workspace?.id) return;
    setSubmitting(true);
    try {
      const result = await api.requestWorkspaceDeletion(workspace.id, reason);
      setPendingRequest(result.request);
      setShowConfirm(false);
      setReason('');
      toast.success(
        isEn
          ? 'Deletion request submitted. Our team will review it shortly.'
          : 'تم ارسال طلب الالغاء الى فريق العمل، وسيتم مراجعته قريبا.'
      );
    } catch (err: any) {
      if (err.message?.includes('already exists')) {
        toast.error(
          isEn
            ? 'A pending deletion request already exists for this workspace.'
            : 'يوجد طلب حذف معلّق بالفعل لمساحة العمل هذه.'
        );
      } else {
        toast.error(err.message || (isEn ? 'Failed to submit request' : 'فشل ارسال الطلب'));
      }
      console.error('Deletion request error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className={`${cardClass} p-4 border-red-500/20`}>
        <Loader2 className="w-4 h-4 animate-spin text-red-400 mx-auto" />
      </div>
    );
  }

  // If there's a pending request → show status card
  if (pendingRequest) {
    return (
      <div className={`${cardClass} p-4 border-[#D4AF37]/20`}>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-[#D4AF37]" />
          <p className="text-xs font-bold text-[#D4AF37]">
            {isEn ? 'Deletion Request Pending' : 'طلب الحذف قيد المراجعة'}
          </p>
        </div>
        <p className={`text-xs ${mutedClass} mb-2`}>
          {isEn
            ? 'Your workspace deletion request is being reviewed by our team.'
            : 'طلب حذف مساحة العمل قيد المراجعة من فريق العمل.'}
        </p>
        <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} text-xs space-y-1`}>
          <p className={mutedClass}>
            {isEn ? 'Request ID' : 'رقم الطلب'}: <span className="font-mono">{pendingRequest.id}</span>
          </p>
          <p className={mutedClass}>
            {isEn ? 'Submitted' : 'تاريخ الطلب'}:{' '}
            {new Date(pendingRequest.requested_at).toLocaleDateString('ar-AE', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          {pendingRequest.reason && (
            <p className={mutedClass}>
              {isEn ? 'Reason' : 'السبب'}: {pendingRequest.reason}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${cardClass} p-4 border-red-500/20`}>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <p className="text-xs font-bold text-red-400">
            {isEn ? 'Danger Zone' : 'منطقة الخطر'}
          </p>
        </div>
        <p className={`text-xs ${mutedClass} mb-3`}>
          {isEn
            ? 'Request workspace deletion. This will be reviewed by our team before processing.'
            : 'طلب حذف مساحة العمل. سيتم مراجعته من فريقنا قبل التنفيذ.'}
        </p>
        <button
          className="text-xs font-bold text-red-400 px-4 py-2.5 rounded-xl border border-red-500/30 hover:bg-red-500/10 transition-colors active:scale-95"
          onClick={() => setShowConfirm(true)}
        >
          {isEn ? 'Request Deletion' : 'طلب حذف مساحة العمل'}
        </button>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`fixed left-4 right-4 top-1/2 -translate-y-1/2 z-[101] rounded-3xl p-6 max-w-md mx-auto ${
                isDark
                  ? 'bg-[#1a1a2e] border border-white/15'
                  : 'bg-white border-[4px] border-gray-200/60 shadow-2xl'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif' }}
              dir={isEn ? 'ltr' : 'rtl'}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`}>
                    {isEn ? 'Confirm Deletion Request' : 'تأكيد طلب الحذف'}
                  </h3>
                  <p className={`text-xs ${mutedClass}`}>
                    {workspace.name}
                  </p>
                </div>
              </div>

              <p className={`text-xs mb-4 ${mutedClass} leading-relaxed`}>
                {isEn
                  ? 'This will send a deletion request to our team. The workspace will NOT be deleted immediately. You can cancel while the request is under review.'
                  : 'سيتم ارسال طلب الحذف الى فريقنا. لن يتم حذف مساحة العمل فورا. يمكنك الالغاء بينما الطلب قيد المراجعة.'}
              </p>

              <textarea
                className={`${inputClass} min-h-[80px] mb-4`}
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder={isEn ? 'Reason for deletion (optional)' : 'سبب الحذف (اختياري)'}
              />

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitRequest}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {isEn ? 'Submit Request' : 'ارسال الطلب'}
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className={`px-5 py-3 rounded-xl font-bold text-sm ${
                    isDark ? 'bg-white/10 text-white/70' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isEn ? 'Cancel' : 'الغاء'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}