/**
 * WorkspaceShell — Main Workspace Container
 * ═══════════════════════════════════════════
 * Full-screen layout with bottom nav (5 items)
 * Each page has its own header — no global top header
 * RTL layout, Cairo font, Gold/Brown accents
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router@7.1.1';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { WorkspaceProvider, useWorkspace } from './WorkspaceContext';
import { getBottomNav, BUSINESS_TYPES, PLANS } from './config';
import { Icon3D } from '../ui/Icon3D';
import { toast } from 'sonner@2.0.3';
import * as api from './workspaceApi';
import type { BusinessType, PlanId } from './types';
import {
  LayoutDashboard, Layers, Users, DollarSign, MoreHorizontal,
  Plus, ArrowRight, Building2, Briefcase,
  ChevronRight, ChevronDown, Loader2,
  Settings, Bell, RefreshCw, Share2, Home, ArrowLeft, Award,
} from 'lucide-react';
// FolderKanban & Crown not available — using safe aliases
const FolderKanban = Layers;
const Crown = Award;
// ArrowLeftFromLine not available — using ArrowLeft as alias
const ArrowLeftFromLine = ArrowLeft;

// Screen imports
import { WsDashboard } from './screens/WsDashboard';
import { WsProjects } from './screens/WsProjects';
import { WsTeam } from './screens/WsTeam';
import { WsFinance } from './screens/WsFinance';
import { WsMore } from './screens/WsMore';
import { WsProfile } from './screens/WsProfile';

const fontCairo = 'Cairo, Tajawal, sans-serif';

// ─── Icon Map for Bottom Nav ───
const TAB_ICONS: Record<string, any> = {
  dashboard: LayoutDashboard,
  projects: FolderKanban,
  team: Users,
  finance: DollarSign,
  more: MoreHorizontal,
};

export default function WorkspaceShellWrapper() {
  return (
    <WorkspaceProvider>
      <WorkspaceShellInner />
    </WorkspaceProvider>
  );
}

function WorkspaceShellInner() {
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const ws = useWorkspace();

  // Show loading
  if (ws.loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-[#3B5BFE]' : 'bg-[#F5EEE1]'}`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className={`w-10 h-10 animate-spin ${isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]'}`} />
          <p className={`text-sm ${isDark ? 'text-white/60' : 'text-[#1F3D2B]/60'}`} style={{ fontFamily: fontCairo }}>
            {isEn ? 'Loading workspace...' : 'جاري تحميل مساحة العمل...'}
          </p>
        </div>
      </div>
    );
  }

  // No workspace — show create/select
  if (!ws.workspace) {
    return <WorkspaceSelector />;
  }

  return <WorkspaceApp />;
}

// ═══════════════════════════════════════════
// Workspace Selector (Create / Select / Invitations)
// ═══════════════════════════════════════════
function WorkspaceSelector() {
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const navigate = useNavigate();
  const isEn = language === 'en';
  const ws = useWorkspace();

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', business_type: 'construction' as BusinessType, plan: 'starter' as PlanId, description: '', phone: '', email: '' });
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      toast.error(isEn ? 'Workspace name is required' : 'اسم مساحة العمل مطلوب');
      return;
    }
    setCreating(true);
    try {
      await api.createWorkspace({
        name: createForm.name,
        business_type: createForm.business_type,
        plan: createForm.plan,
        description: createForm.description,
        phone: createForm.phone,
        email: createForm.email,
      });
      toast.success(isEn ? 'Workspace created!' : 'تم إنشاء مساحة العمل!');
      await ws.loadMyWorkspaces();
      setShowCreate(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await api.respondToInvitation(inviteId, true);
      toast.success(isEn ? 'Invitation accepted!' : 'تم قبول الدعوة!');
      await ws.loadMyWorkspaces();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRejectInvite = async (inviteId: string) => {
    try {
      await api.respondToInvitation(inviteId, false);
      toast.info(isEn ? 'Invitation rejected' : 'تم رفض الدعوة');
      await ws.loadMyWorkspaces();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const bgClass = isDark ? 'bg-[#3B5BFE]' : 'bg-[#F5EEE1]';
  const cardClass = isDark
    ? 'bg-white/10 backdrop-blur-xl border border-white/15'
    : 'bg-white border-[4px] border-gray-200/60 shadow-lg';
  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/60' : 'text-[#1F3D2B]/60';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col`} style={{ fontFamily: fontCairo }} dir="rtl">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${textClass}`}>
              {isEn ? 'Workspace' : 'مساحة العمل'}
            </h1>
            <p className={`text-sm mt-1 ${mutedClass}`}>
              {isEn ? 'Manage your business from one place' : 'أدر أعمالك من مكان واحد'}
            </p>
          </div>
          <button
            onClick={() => navigate('/home')}
            className={`px-3 py-1.5 rounded-xl text-sm ${isDark ? 'bg-white/10 text-white/70 hover:bg-white/20' : 'bg-[#1F3D2B]/8 text-[#1F3D2B]/70 hover:bg-[#1F3D2B]/15'}`}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 px-5 pb-8 space-y-4 overflow-y-auto">
        {/* Pending Invitations */}
        {ws.invitations.length > 0 && (
          <div className="space-y-3">
            <h3 className={`text-sm font-bold ${goldClass}`}>
              {isEn ? 'Pending Invitations' : 'دعوات انضمام'}
            </h3>
            {ws.invitations.map(inv => (
              <div key={inv.id} className={`${cardClass} rounded-2xl p-4`}>
                <div className="flex items-center gap-3 mb-3">
                  <Icon3D icon={Building2} theme="blue" size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${textClass}`}>{inv.workspace_name}</p>
                    <p className={`text-xs ${mutedClass}`}>{isEn ? `Role: ${inv.role}` : `الدور: ${inv.job_title}`}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptInvite(inv.id)}
                    className="flex-1 py-2 rounded-xl text-sm font-bold bg-[#D4AF37] text-white hover:bg-[#C8A86A] transition-colors"
                  >
                    {isEn ? 'Accept' : 'قبول'}
                  </button>
                  <button
                    onClick={() => handleRejectInvite(inv.id)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold ${isDark ? 'bg-white/10 text-white/70' : 'bg-gray-100 text-gray-500'} hover:opacity-80 transition-colors`}
                  >
                    {isEn ? 'Reject' : 'رفض'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Owned Workspaces */}
        {ws.ownedWorkspaces.length > 0 && (
          <div className="space-y-3">
            <h3 className={`text-sm font-bold ${textClass}`}>
              {isEn ? 'Your Workspaces' : 'مساحات العمل الخاصة بك'}
            </h3>
            {ws.ownedWorkspaces.map(w => (
              <button
                key={w.id}
                onClick={() => ws.selectWorkspace(w.id)}
                className={`${cardClass} rounded-2xl p-4 w-full text-right hover:scale-[1.01] transition-transform`}
              >
                <div className="flex items-center gap-3">
                  <Icon3D icon={Building2} theme={BUSINESS_TYPES.find(b => b.value === w.business_type)?.iconTheme || 'gold'} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold ${textClass}`}>{w.name}</p>
                    <p className={`text-xs ${mutedClass}`}>
                      {BUSINESS_TYPES.find(b => b.value === w.business_type)?.[isEn ? 'labelEn' : 'labelAr']}
                      {' · '}
                      {PLANS[w.plan][isEn ? 'nameEn' : 'nameAr']}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${mutedClass} rotate-180`} />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Memberships */}
        {ws.memberships.length > 0 && (
          <div className="space-y-3">
            <h3 className={`text-sm font-bold ${textClass}`}>
              {isEn ? 'Member In' : 'عضو في'}
            </h3>
            {ws.memberships.map(m => (
              <button
                key={m.workspace_id}
                onClick={() => ws.selectWorkspace(m.workspace_id)}
                className={`${cardClass} rounded-2xl p-4 w-full text-right hover:scale-[1.01] transition-transform`}
              >
                <div className="flex items-center gap-3">
                  <Icon3D icon={Briefcase} theme="purple" size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${textClass}`}>{m.workspace_name}</p>
                    <p className={`text-xs ${mutedClass}`}>{m.role}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${mutedClass} rotate-180`} />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Create New Workspace */}
        {!showCreate ? (
          <button
            onClick={() => setShowCreate(true)}
            className={`w-full py-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 transition-all
              ${isDark ? 'border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10' : 'border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10'}`}
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold text-sm">
              {isEn ? 'Create New Workspace' : 'إنشاء مساحة عمل جديدة'}
            </span>
          </button>
        ) : (
          <div className={`${cardClass} rounded-2xl p-5 space-y-4`}>
            <h3 className={`font-bold ${textClass}`}>
              {isEn ? 'New Workspace' : 'مساحة عمل جديدة'}
            </h3>

            {/* Name */}
            <div>
              <label className={`text-xs font-bold mb-1 block ${mutedClass}`}>
                {isEn ? 'Workspace Name' : 'اسم مساحة العمل'}
              </label>
              <input
                className={`w-full px-4 py-3 rounded-xl border-[4px] border-gray-200/60 text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-white text-[#1F3D2B]'}`}
                value={createForm.name}
                onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                placeholder={isEn ? 'e.g. Al Reef Construction' : 'مثال: الريف للمقاولات'}
              />
            </div>

            {/* Business Type */}
            <div>
              <label className={`text-xs font-bold mb-2 block ${mutedClass}`}>
                {isEn ? 'Business Type' : 'نوع النشاط'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BUSINESS_TYPES.map(bt => (
                  <button
                    key={bt.value}
                    onClick={() => setCreateForm(f => ({ ...f, business_type: bt.value }))}
                    className={`p-3 rounded-xl text-xs font-bold border-[4px] transition-all ${
                      createForm.business_type === bt.value
                        ? isDark ? 'border-[#FFD700]/60 bg-[#FFD700]/15 text-[#FFD700]' : 'border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#D4AF37]'
                        : isDark ? 'border-white/10 text-white/60' : 'border-gray-200/60 text-[#1F3D2B]/60'
                    }`}
                  >
                    {isEn ? bt.labelEn : bt.labelAr}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan */}
            <div>
              <label className={`text-xs font-bold mb-2 block ${mutedClass}`}>
                {isEn ? 'Plan' : 'الباقة'}
              </label>
              <div className="space-y-2">
                {(['starter', 'business', 'enterprise'] as PlanId[]).map(planId => {
                  const plan = PLANS[planId];
                  const selected = createForm.plan === planId;
                  return (
                    <button
                      key={planId}
                      onClick={() => setCreateForm(f => ({ ...f, plan: planId }))}
                      className={`w-full p-3 rounded-xl flex items-center justify-between border-[4px] transition-all ${
                        selected
                          ? isDark ? 'border-[#FFD700]/60 bg-[#FFD700]/15' : 'border-[#D4AF37]/60 bg-[#D4AF37]/10'
                          : isDark ? 'border-white/10' : 'border-gray-200/60'
                      }`}
                    >
                      <div className="text-right">
                        <p className={`font-bold text-sm ${selected ? goldClass : textClass}`}>
                          {isEn ? plan.nameEn : plan.nameAr}
                        </p>
                        <p className={`text-xs ${mutedClass}`}>
                          {plan.maxMembers} {isEn ? 'members' : 'عضو'} · {plan.maxProjects} {isEn ? 'projects' : 'مشاريع'}
                          {plan.automation && ` · ${isEn ? 'Automation' : 'أتمتة'}`}
                        </p>
                      </div>
                      <div className={`text-sm font-bold ${goldClass}`}>
                        {plan.priceAED} {isEn ? 'AED/mo' : 'د.إ/شهر'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#D4AF37] text-white hover:bg-[#C8A86A] disabled:opacity-50 transition-colors"
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  isEn ? 'Create' : 'إنشاء'
                )}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className={`px-6 py-3 rounded-xl font-bold text-sm ${isDark ? 'bg-white/10 text-white/70' : 'bg-gray-100 text-gray-500'}`}
              >
                {isEn ? 'Cancel' : 'إلغاء'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Global Workspace Dropdown (appears on all tabs)
// ═══════════════════════════════════════════
function WorkspaceGlobalDropdown() {
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const ws = useWorkspace();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!ws.workspace) return null;

  const { workspace, myRole } = ws;
  const plan = PLANS[workspace.plan];
  const businessType = BUSINESS_TYPES.find(b => b.value === workspace.business_type);
  const planLabel = plan[isEn ? 'nameEn' : 'nameAr'];
  const businessLabel = businessType?.[isEn ? 'labelEn' : 'labelAr'] || '';
  const iconTheme = businessType?.iconTheme || 'gold';

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/60' : 'text-[#1F3D2B]/60';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const menuBg = isDark
    ? 'bg-[#1E2030]/95 backdrop-blur-2xl border border-white/15 shadow-2xl'
    : 'bg-white border-[4px] border-gray-200/60 shadow-2xl';

  const menuItems = [
    ...(myRole === 'owner' || myRole === 'admin' ? [
      { icon: Settings, label: isEn ? 'Workspace Settings' : 'إعدادات مساحة العمل', action: () => { setOpen(false); ws.setActiveSubScreen('settings'); }, theme: 'gold' },
    ] : []),
    { icon: LayoutDashboard, label: isEn ? 'Dashboard' : 'لوحة التحكم', action: () => { setOpen(false); ws.setActiveSubScreen(null); ws.setActiveTab('dashboard'); }, theme: 'blue' },
    { icon: FolderKanban, label: isEn ? 'Projects' : 'المشاريع', action: () => { setOpen(false); ws.setActiveSubScreen(null); ws.setActiveTab('projects'); }, theme: 'blue' },
    { icon: Users, label: isEn ? 'Team' : 'الفريق', action: () => { setOpen(false); ws.setActiveSubScreen(null); ws.setActiveTab('team'); }, theme: 'purple' },
    { icon: DollarSign, label: isEn ? 'Finance' : 'المالية', action: () => { setOpen(false); ws.setActiveSubScreen(null); ws.setActiveTab('finance'); }, theme: 'gold' },
    { icon: Bell, label: isEn ? 'Notifications' : 'الإشعارات', action: () => { setOpen(false); navigate('/notifications'); }, theme: 'amber' },
    { icon: RefreshCw, label: isEn ? 'Switch Workspace' : 'تبديل مساحة العمل', action: () => { setOpen(false); ws.selectWorkspace(''); }, theme: 'purple' },
    { icon: Share2, label: isEn ? 'Share Workspace' : 'مشاركة مساحة العمل', action: () => { setOpen(false); }, theme: 'amber' },
  ];

  return (
    <div ref={ref} className="relative z-40" style={{ fontFamily: fontCairo }}>
      {/* Trigger — Company Name + Icon + Dropdown Arrow */}
      <div className="flex items-center justify-between px-5 pt-10 pb-3">
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-3 rounded-2xl px-3 py-2 transition-all border-[3px] flex-1 ${
            open
              ? isDark ? 'bg-white/10 border-[#FFD700]/30' : 'bg-[#D4AF37]/5 border-[#D4AF37]/30'
              : isDark ? 'border-transparent hover:bg-white/5' : 'border-transparent hover:bg-gray-50'
          }`}
        >
          <Icon3D icon={Building2} theme={iconTheme} size="md" />
          <div className="text-right min-w-0 flex-1">
            <h1 className={`text-lg font-bold truncate ${textClass}`}>{workspace.name}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[11px] ${mutedClass}`}>{businessLabel}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${isDark ? 'bg-[#FFD700]/15 text-[#FFD700]' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}`}>
                {planLabel}
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${goldClass}`}
          />
        </button>

        {/* Owner Crown Badge */}
        {myRole === 'owner' && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${isDark ? 'bg-[#FFD700]/15' : 'bg-[#D4AF37]/10'}`}>
            <Crown className={`w-4 h-4 ${goldClass}`} />
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div
          className={`absolute top-full mt-1 right-5 left-5 rounded-2xl overflow-hidden z-50 ${menuBg}`}
          style={{ fontFamily: fontCairo }}
        >
          {/* Dashboard-specific Menu Items */}
          <div className="py-1.5">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                  isDark ? 'hover:bg-white/8' : 'hover:bg-gray-50'
                }`}
              >
                <Icon3D icon={item.icon} theme={item.theme} size="xs" hoverable={false} />
                <span className={`text-sm font-semibold ${textClass}`}>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className={`mx-4 ${isDark ? 'border-t border-white/10' : 'border-t border-gray-100'}`} />

          {/* Return to App — Always at bottom */}
          <button
            onClick={() => { setOpen(false); navigate('/home'); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all ${
              isDark ? 'hover:bg-white/8' : 'hover:bg-[#D4AF37]/5'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#FFD700]/15' : 'bg-[#D4AF37]/10'}`}>
              <Home className={`w-4 h-4 ${goldClass}`} />
            </div>
            <div className="flex-1 text-right">
              <span className={`text-sm font-bold ${goldClass}`}>
                {isEn ? 'Return to App' : 'العودة للتطبيق'}
              </span>
              <p className={`text-[10px] ${mutedClass}`}>
                {isEn ? 'Back to Beit Al Reef home' : 'الرجوع لشاشة بيت الريف الرئيسية'}
              </p>
            </div>
            <ArrowLeftFromLine className={`w-4 h-4 ${goldClass}`} />
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// Active Workspace App (with Bottom Nav)
// ═══════════════════════════════════════════
function WorkspaceApp() {
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const ws = useWorkspace();

  const navItems = ws.workspace ? getBottomNav(ws.workspace.business_type) : [];

  const bgClass = isDark ? 'bg-[#3B5BFE]' : 'bg-[#F5EEE1]';
  const navBg = isDark
    ? 'bg-[#3B5BFE]/95 backdrop-blur-xl border-t border-white/10'
    : 'bg-white/95 backdrop-blur-xl border-t border-gray-200/60 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]';

  // Load data when tab changes
  useEffect(() => {
    if (ws.activeTab === 'projects') ws.loadProjects();
    if (ws.activeTab === 'finance') ws.loadFinance();
  }, [ws.activeTab]);

  const renderScreen = () => {
    if (ws.activeSubScreen) {
      switch (ws.activeSubScreen) {
        case 'site_diary': return <WsMore screen="site_diary" />;
        case 'files': return <WsMore screen="files" />;
        case 'settings': return <WsMore screen="settings" />;
        case 'public_profile': return <WsMore screen="public_profile" />;
        case 'quotes_contracts': return <WsMore screen="quotes_contracts" />;
        case 'ws_profile': return <WsProfile />;
        default: return <WsMore screen="menu" />;
      }
    }

    switch (ws.activeTab) {
      case 'dashboard': return <WsDashboard />;
      case 'projects': return <WsProjects />;
      case 'team': return <WsTeam />;
      case 'finance': return <WsFinance />;
      case 'more': return <WsMore screen="menu" />;
      default: return <WsDashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col`} style={{ fontFamily: fontCairo }} dir="rtl">
      {/* Global Header — Company Dropdown (always visible) */}
      <WorkspaceGlobalDropdown />

      {/* Main Content — CSS transition instead of motion */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div
          key={ws.activeSubScreen || ws.activeTab}
          className="animate-[fadeIn_0.2s_ease-out]"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          {renderScreen()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 ${navBg}`} style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {navItems.map(item => {
            const isActive = ws.activeSubScreen
              ? false
              : ws.activeTab === item.id;
            const IconComp = TAB_ICONS[item.id] || MoreHorizontal;

            return (
              <button
                key={item.id}
                onClick={() => {
                  ws.setActiveSubScreen(null);
                  ws.setActiveTab(item.id);
                }}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]'
                    : isDark ? 'text-white/40' : 'text-[#1F3D2B]/40'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${
                  isActive
                    ? isDark ? 'bg-[#FFD700]/15' : 'bg-[#D4AF37]/10'
                    : ''
                }`}>
                  <IconComp className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className={`text-[10px] font-bold leading-tight ${isActive ? '' : 'font-medium'}`}>
                  {isEn ? item.labelEn : item.labelAr}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* CSS keyframe for fade-in */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}