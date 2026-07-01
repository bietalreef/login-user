/**
 * WsProjects — Project Management (Entity Engine)
 * ═══════════════════════════════════════════════
 * CRUD direct — no approvals
 */

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../contexts/LanguageContext';
import { useWorkspace } from '../WorkspaceContext';
import { Icon3D } from '../../ui/Icon3D';
import * as api from '../workspaceApi';
import { toast } from 'sonner@2.0.3';
import type { Project } from '../types';
import {
  FolderKanban, Plus, X, MapPin, DollarSign,
  CheckCircle, Clock, PauseCircle, PlayCircle,
  Loader2, Trash2,
} from 'lucide-react';

const fontCairo = 'Cairo, Tajawal, sans-serif';

const STATUS_CONFIG = {
  planning: { labelAr: 'تخطيط', labelEn: 'Planning', color: '#D4AF37', icon: Clock },
  active: { labelAr: 'نشط', labelEn: 'Active', color: '#3B82F6', icon: PlayCircle },
  on_hold: { labelAr: 'معلّق', labelEn: 'On Hold', color: '#F59E0B', icon: PauseCircle },
  completed: { labelAr: 'مكتمل', labelEn: 'Completed', color: '#8B5CF6', icon: CheckCircle },
};

export function WsProjects() {
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const ws = useWorkspace();
  const { workspace, projects, myRole } = ws;

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', budget: '', location: '', start_date: '' });

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/60' : 'text-[#1F3D2B]/60';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const cardClass = isDark
    ? 'bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl'
    : 'bg-white border-[4px] border-gray-200/60 rounded-2xl shadow-sm';

  useEffect(() => { ws.loadProjects(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim() || !workspace) return;
    setCreating(true);
    try {
      await api.createProject(workspace.id, {
        name: form.name,
        description: form.description,
        budget: form.budget ? Number(form.budget) : undefined,
        location: form.location,
        start_date: form.start_date,
      });
      toast.success(isEn ? 'Project created!' : 'تم إنشاء المشروع!');
      setShowCreate(false);
      setForm({ name: '', description: '', budget: '', location: '', start_date: '' });
      await ws.loadProjects();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (project: Project, newStatus: string) => {
    if (!workspace) return;
    try {
      await api.updateProject(workspace.id, project.id, { status: newStatus as any });
      toast.success(isEn ? 'Status updated' : 'تم تحديث الحالة');
      await ws.loadProjects();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!workspace) return;
    try {
      await api.deleteProject(workspace.id, projectId);
      toast.success(isEn ? 'Project deleted' : 'تم حذف المشروع');
      await ws.loadProjects();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="px-5 pt-8 pb-4 space-y-5" style={{ fontFamily: fontCairo }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon3D icon={FolderKanban} theme="blue" size="md" />
          <div>
            <h1 className={`text-lg font-bold ${textClass}`}>
              {isEn ? 'Projects' : 'المشاريع'}
            </h1>
            <p className={`text-xs ${mutedClass}`}>
              {projects.length} {isEn ? 'total' : 'إجمالي'}
            </p>
          </div>
        </div>
        {(myRole === 'owner' || myRole === 'admin') && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className={`p-2.5 rounded-xl border-[4px] transition-all ${
              showCreate
                ? 'bg-red-500/10 border-red-200/60 text-red-500'
                : isDark ? 'bg-[#FFD700]/15 border-[#FFD700]/30 text-[#FFD700]' : 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]'
            }`}
          >
            {showCreate ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className={`${cardClass} p-4 space-y-3`}>
          <input
            className={`w-full px-4 py-3 rounded-xl border-[4px] border-gray-200/60 text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-white text-[#1F3D2B]'}`}
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder={isEn ? 'Project Name' : 'اسم المشروع'}
          />
          <input
            className={`w-full px-4 py-3 rounded-xl border-[4px] border-gray-200/60 text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-white text-[#1F3D2B]'}`}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder={isEn ? 'Description (optional)' : 'الوصف (اختياري)'}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              className={`w-full px-4 py-3 rounded-xl border-[4px] border-gray-200/60 text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-white text-[#1F3D2B]'}`}
              value={form.budget}
              onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
              placeholder={isEn ? 'Budget (AED)' : 'الميزانية (د.إ)'}
            />
            <input
              className={`w-full px-4 py-3 rounded-xl border-[4px] border-gray-200/60 text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-white text-[#1F3D2B]'}`}
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder={isEn ? 'Location' : 'الموقع'}
            />
          </div>
          <input
            type="date"
            className={`w-full px-4 py-3 rounded-xl border-[4px] border-gray-200/60 text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-white text-[#1F3D2B]'}`}
            value={form.start_date}
            onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
          />
          <button
            onClick={handleCreate}
            disabled={creating || !form.name.trim()}
            className="w-full py-3 rounded-xl font-bold text-sm bg-[#D4AF37] text-white hover:bg-[#C8A86A] disabled:opacity-50 transition-colors"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : isEn ? 'Create Project' : 'إنشاء المشروع'}
          </button>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className={`${cardClass} p-8 text-center`}>
          <Icon3D icon={FolderKanban} theme="blue" size="xl" className="mx-auto mb-4" />
          <p className={`font-bold ${textClass}`}>
            {isEn ? 'No projects yet' : 'لا توجد مشاريع بعد'}
          </p>
          <p className={`text-sm mt-1 ${mutedClass}`}>
            {isEn ? 'Create your first project to get started' : 'أنشئ مشروعك الأول للبدء'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(project => {
            const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.planning;
            const StatusIcon = status.icon;
            return (
              <div key={project.id} className={`${cardClass} p-4`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${status.color}15` }}>
                    <StatusIcon className="w-5 h-5" style={{ color: status.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm ${textClass}`}>{project.name}</h3>
                    {project.description && (
                      <p className={`text-xs mt-0.5 ${mutedClass} line-clamp-1`}>{project.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${status.color}15`, color: status.color }}>
                        {isEn ? status.labelEn : status.labelAr}
                      </span>
                      {project.budget && (
                        <span className={`text-[10px] flex items-center gap-1 ${mutedClass}`}>
                          <DollarSign className="w-3 h-3" />
                          {project.budget.toLocaleString()} {isEn ? 'AED' : 'د.إ'}
                        </span>
                      )}
                      {project.location && (
                        <span className={`text-[10px] flex items-center gap-1 ${mutedClass}`}>
                          <MapPin className="w-3 h-3" />
                          {project.location}
                        </span>
                      )}
                    </div>
                  </div>
                  {(myRole === 'owner' || myRole === 'admin') && (
                    <div className="flex gap-1">
                      <select
                        value={project.status}
                        onChange={e => handleStatusChange(project, e.target.value)}
                        className={`text-[10px] rounded-lg px-1.5 py-1 border ${isDark ? 'bg-white/10 border-white/15 text-white' : 'bg-gray-50 border-gray-200 text-[#1F3D2B]'}`}
                      >
                        <option value="planning">{isEn ? 'Planning' : 'تخطيط'}</option>
                        <option value="active">{isEn ? 'Active' : 'نشط'}</option>
                        <option value="on_hold">{isEn ? 'On Hold' : 'معلّق'}</option>
                        <option value="completed">{isEn ? 'Done' : 'مكتمل'}</option>
                      </select>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-50'} text-red-400 transition-colors`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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