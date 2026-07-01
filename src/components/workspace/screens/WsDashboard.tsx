/**
 * WsDashboard — Workspace Dashboard with KPIs
 * ═════════════════════════════════════════════
 * Gold/Brown accents, Icon3D, RTL, Cairo font
 */

import { useEffect, useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../contexts/LanguageContext';
import { useWorkspace } from '../WorkspaceContext';
import { PLANS, BUSINESS_TYPES } from '../config';
import { Icon3D } from '../../ui/Icon3D';
import {
  FolderKanban, Users, DollarSign, TrendingUp, BookOpen,
  ChevronLeft, Activity, Crown,
} from 'lucide-react';

const fontCairo = 'Cairo, Tajawal, sans-serif';

export function WsDashboard() {
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const ws = useWorkspace();
  const { workspace, members, projects, financeEntries, myRole } = ws;

  // Load data on mount
  useEffect(() => {
    ws.loadProjects();
    ws.loadFinance();
  }, []);

  if (!workspace) return null;

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/60' : 'text-[#1F3D2B]/60';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const cardClass = isDark
    ? 'bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl'
    : 'bg-white border-[4px] border-gray-200/60 rounded-2xl shadow-sm';

  // KPIs
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalBudget = projects.reduce((s, p) => s + (p.budget || 0), 0);
  const totalIncome = financeEntries.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const totalExpenses = financeEntries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const activeMembers = members.filter(m => m.status === 'active').length;
  const plan = PLANS[workspace.plan];
  const businessLabel = BUSINESS_TYPES.find(b => b.value === workspace.business_type);

  const kpiCards = [
    { label: isEn ? 'Active Projects' : 'مشاريع نشطة', value: activeProjects, icon: FolderKanban, theme: 'blue' },
    { label: isEn ? 'Team Members' : 'أعضاء الفريق', value: activeMembers, icon: Users, theme: 'purple' },
    { label: isEn ? 'Income' : 'الإيرادات', value: `${totalIncome.toLocaleString()} ${isEn ? 'AED' : 'د.إ'}`, icon: TrendingUp, theme: 'gold' },
    { label: isEn ? 'Expenses' : 'المصروفات', value: `${totalExpenses.toLocaleString()} ${isEn ? 'AED' : 'د.إ'}`, icon: DollarSign, theme: 'orange' },
  ];

  return (
    <div className="px-5 pt-4 pb-4 space-y-5" style={{ fontFamily: fontCairo }}>
      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3">
        {kpiCards.map((kpi, i) => (
          <div key={i} className={`${cardClass} p-4`}>
            <div className="flex items-center gap-2 mb-3">
              <Icon3D icon={kpi.icon} theme={kpi.theme} size="xs" />
              <span className={`text-xs ${mutedClass}`}>{kpi.label}</span>
            </div>
            <p className={`text-xl font-bold ${textClass}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className={`text-sm font-bold mb-3 ${textClass}`}>
          {isEn ? 'Quick Actions' : 'إجراءات سريعة'}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: isEn ? 'New Project' : 'مشروع جديد', icon: FolderKanban, theme: 'blue', action: () => { ws.setActiveTab('projects'); } },
            { label: isEn ? 'Add Member' : 'إضافة عضو', icon: Users, theme: 'purple', action: () => { ws.setActiveTab('team'); } },
            { label: isEn ? 'Site Diary' : 'يومية جديدة', icon: BookOpen, theme: 'gold', action: () => { ws.setActiveSubScreen('site_diary'); } },
          ].map((qa, i) => (
            <button
              key={i}
              onClick={qa.action}
              className={`${cardClass} p-3 flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform active:scale-95`}
            >
              <Icon3D icon={qa.icon} theme={qa.theme} size="sm" />
              <span className={`text-[11px] font-bold ${textClass}`}>{qa.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className={`text-sm font-bold mb-3 ${textClass}`}>
          {isEn ? 'Recent Activity' : 'النشاط الأخير'}
        </h3>
        <div className={`${cardClass} p-4 space-y-3`}>
          {projects.length === 0 && members.length <= 1 ? (
            <div className="text-center py-6">
              <Icon3D icon={Activity} theme="gold" size="lg" className="mx-auto mb-3" />
              <p className={`text-sm ${mutedClass}`}>
                {isEn ? 'No activity yet. Start by creating a project!' : 'لا يوجد نشاط بعد. ابدأ بإنشاء مشروع!'}
              </p>
            </div>
          ) : (
            <>
              {projects.slice(0, 3).map(p => (
                <div key={p.id} className={`flex items-center gap-3 pb-3 border-b last:border-0 ${isDark ? 'border-white/8' : 'border-gray-100'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-blue-500/15' : 'bg-blue-50'}`}>
                    <FolderKanban className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${textClass}`}>{p.name}</p>
                    <p className={`text-xs ${mutedClass}`}>
                      {p.status === 'active' ? (isEn ? 'Active' : 'نشط') :
                       p.status === 'planning' ? (isEn ? 'Planning' : 'تخطيط') :
                       p.status === 'completed' ? (isEn ? 'Completed' : 'مكتمل') :
                       isEn ? 'On Hold' : 'معلّق'}
                    </p>
                  </div>
                  <ChevronLeft className={`w-4 h-4 ${mutedClass}`} />
                </div>
              ))}
              {members.filter(m => m.status === 'active').slice(0, 2).map(m => (
                <div key={m.id} className={`flex items-center gap-3 pb-3 border-b last:border-0 ${isDark ? 'border-white/8' : 'border-gray-100'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-500/15' : 'bg-purple-50'}`}>
                    <Users className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${textClass}`}>{m.full_name}</p>
                    <p className={`text-xs ${mutedClass}`}>{m.job_title}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Plan Usage */}
      <div className={`${cardClass} p-4`}>
        <div className="flex items-center gap-2 mb-3">
          <Icon3D icon={Crown} theme="gold" size="xs" />
          <span className={`text-sm font-bold ${goldClass}`}>
            {isEn ? `${plan.nameEn} Plan` : `باقة ${plan.nameAr}`}
          </span>
        </div>
        <div className="space-y-2">
          <UsageBar label={isEn ? 'Members' : 'الأعضاء'} current={activeMembers} max={plan.maxMembers} isDark={isDark} />
          <UsageBar label={isEn ? 'Projects' : 'المشاريع'} current={projects.length} max={plan.maxProjects} isDark={isDark} />
        </div>
      </div>
    </div>
  );
}

function UsageBar({ label, current, max, isDark }: { label: string; current: number; max: number; isDark: boolean }) {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className={`text-xs ${isDark ? 'text-white/60' : 'text-[#1F3D2B]/60'}`}>{label}</span>
        <span className={`text-xs font-bold ${isDark ? 'text-white/80' : 'text-[#1F3D2B]/80'}`}>{current}/{max}</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: pct > 80 ? '#EF4444' : 'linear-gradient(90deg, #D4AF37, #C8A86A)',
          }}
        />
      </div>
    </div>
  );
}