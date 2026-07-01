/**
 * AdminUsersTable — Full user management with search, drawer, plan control,
 * ban/freeze, workspace management, behavior, verification review
 */
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon3D } from '../ui/Icon3D';
import {
  getUsers, getUserFull, adjustWallet, banUser, freezeUser,
  updateUserPlan, manageWorkspace, deleteUser,
} from './adminApi';
import { toast } from 'sonner@2.0.3';
import {
  Users, Search, X, Wallet, Crown, ChevronLeft, ChevronRight,
  Mail, User, Shield, Ban, Snowflake, CreditCard, Building2,
  Fingerprint, Monitor, Globe, Clock, Copy, Eye, Trash2,
  CheckCircle, XCircle, AlertTriangle, Lock, Unlock,
  Smartphone, Laptop, FileCheck, Activity, Hash,
} from 'lucide-react';

const fontCairo = 'Cairo, Tajawal, sans-serif';

interface UserRow {
  id: string;
  email: string;
  phone: string;
  created_at: string;
  last_sign_in_at: string;
  display_name: string;
  avatar_url: string | null;
  balance_coins: number;
  roles: string[];
  provider: string;
}

type DrawerTab = 'info' | 'plan' | 'actions' | 'behavior' | 'workspaces' | 'verification';

const STATUS_BADGES: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  active: { label: 'نشط', color: '#D4AF37', bg: 'rgba(212,175,55,0.12)', icon: CheckCircle },
  banned: { label: 'محظور', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', icon: Ban },
  frozen: { label: 'مجمّد', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', icon: Snowflake },
};

const PLAN_OPTIONS = [
  { value: 'free', labelAr: 'مجاني', color: '#6B7280' },
  { value: 'starter', labelAr: 'بداية', color: '#D4AF37' },
  { value: 'pro', labelAr: 'احترافي', color: '#3B5BFE' },
  { value: 'enterprise', labelAr: 'مؤسسات', color: '#C8A86A' },
];

export function AdminUsersTable() {
  const { isDark } = useTheme();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQ, setSearchQ] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState<DrawerTab>('info');

  // Wallet adjust state
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustCoins, setAdjustCoins] = useState('');
  const [adjustDir, setAdjustDir] = useState<'credit' | 'debit'>('credit');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  // Action modal state
  const [actionModal, setActionModal] = useState<{ type: string; open: boolean }>({ type: '', open: false });
  const [actionReason, setActionReason] = useState('');
  const [actionDuration, setActionDuration] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Delete user confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Plan edit
  const [planEditing, setPlanEditing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [planReason, setPlanReason] = useState('');
  const [planExpiry, setPlanExpiry] = useState('');

  const cardClass = isDark
    ? 'bg-white/[0.13] backdrop-blur-xl border border-white/[0.18]'
    : 'bg-white border-[4px] border-gray-200/60';

  const inputClass = isDark
    ? 'bg-white/[0.10] border border-white/[0.15] text-white'
    : 'bg-white border-[3px] border-gray-200/60 text-[#1F3D2B]';

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers(page, 20, searchQ);
      setUsers(res.users || []);
    } catch (err: any) {
      toast.error('خطأ في تحميل المستخدمين: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, searchQ]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openDrawer = async (userId: string) => {
    setDrawerOpen(true);
    setDrawerLoading(true);
    setActiveDrawerTab('info');
    try {
      const detail = await getUserFull(userId);
      setSelectedUser(detail);
      setSelectedPlan(detail.subscription?.plan || 'free');
    } catch (err: any) {
      toast.error('خطأ في تحميل تفاصيل المستخدم');
      console.error('getUserFull error:', err);
    } finally {
      setDrawerLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!selectedUser?.id) return;
    try {
      const detail = await getUserFull(selectedUser.id);
      setSelectedUser(detail);
      setSelectedPlan(detail.subscription?.plan || 'free');
    } catch (e) { console.error(e); }
  };

  const handleAdjust = async () => {
    if (!selectedUser?.id || !adjustCoins || !adjustReason) return;
    setAdjusting(true);
    try {
      const result = await adjustWallet(selectedUser.id, Number(adjustCoins), adjustDir, adjustReason);
      const oldBal = result?.old_balance ?? '?';
      const newBal = result?.new_balance ?? '?';
      toast.success(`تم ${adjustDir === 'credit' ? 'إضافة' : 'خصم'} ${adjustCoins} كوينز — الرصيد: ${oldBal} → ${newBal}`);
      // Immediately update local state so UI reflects the change
      if (result?.new_balance !== undefined) {
        setSelectedUser((prev: any) => prev ? {
          ...prev,
          wallet: { ...(prev.wallet || {}), balance: result.new_balance },
        } : prev);
      }
      setAdjustOpen(false); setAdjustCoins(''); setAdjustReason('');
      await refreshUser(); fetchUsers();
    } catch (err: any) { toast.error('خطأ في تعديل الرصيد: ' + err.message); }
    finally { setAdjusting(false); }
  };

  const handleBan = async () => {
    if (!selectedUser?.id) return;
    setActionLoading(true);
    try {
      const isBanned = selectedUser.account_status?.status === 'banned';
      await banUser(selectedUser.id, isBanned ? 'unban' : 'ban', actionReason, actionDuration ? Number(actionDuration) : undefined);
      toast.success(isBanned ? 'تم رفع الحظر' : 'تم حظر المستخدم');
      setActionModal({ type: '', open: false }); setActionReason(''); setActionDuration('');
      await refreshUser(); fetchUsers();
    } catch (err: any) { toast.error(err.message); }
    finally { setActionLoading(false); }
  };

  const handleFreeze = async () => {
    if (!selectedUser?.id) return;
    setActionLoading(true);
    try {
      const isFrozen = selectedUser.account_status?.status === 'frozen';
      await freezeUser(selectedUser.id, isFrozen ? 'unfreeze' : 'freeze', actionReason, actionDuration || undefined);
      toast.success(isFrozen ? 'تم فك التجميد' : 'تم تجميد الحساب');
      setActionModal({ type: '', open: false }); setActionReason(''); setActionDuration('');
      await refreshUser();
    } catch (err: any) { toast.error(err.message); }
    finally { setActionLoading(false); }
  };

  const handlePlanUpdate = async () => {
    if (!selectedUser?.id || !selectedPlan) return;
    setActionLoading(true);
    try {
      await updateUserPlan(selectedUser.id, selectedPlan, planExpiry || undefined, planReason || undefined);
      toast.success(`تم تحديث الباقة إلى ${PLAN_OPTIONS.find(p => p.value === selectedPlan)?.labelAr}`);
      setPlanEditing(false); setPlanReason(''); setPlanExpiry('');
      await refreshUser();
    } catch (err: any) { toast.error(err.message); }
    finally { setActionLoading(false); }
  };

  const handleWorkspaceAction = async (wsId: string, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      await manageWorkspace(wsId, action, `بواسطة الأدمن`);
      toast.success(action === 'delete' ? 'تم حذف مساحة العمل' : action === 'activate' ? 'تم تفعيل مساحة العمل' : 'تم إيقاف مساحة العمل');
      await refreshUser();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?.id || deleteConfirmText !== 'حذف') return;
    setDeleteLoading(true);
    try {
      await deleteUser(selectedUser.id);
      toast.success('تم حذف المستخدم نهائياً');
      setDeleteConfirmOpen(false);
      setDeleteConfirmText('');
      setDrawerOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) { toast.error('خطأ في الحذف: ' + err.message); }
    finally { setDeleteLoading(false); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('تم النسخ');
  };

  const formatDate = (d: string) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('ar-AE', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getUserStatus = (u: any) => {
    if (!u) return 'active';
    return u.account_status?.status || 'active';
  };

  const DRAWER_TABS: { key: DrawerTab; label: string; icon: any }[] = [
    { key: 'info', label: 'البيانات', icon: User },
    { key: 'plan', label: 'الباقة', icon: CreditCard },
    { key: 'actions', label: 'الإجراءات', icon: Shield },
    { key: 'behavior', label: 'السلوك', icon: Activity },
    { key: 'workspaces', label: 'مساحات العمل', icon: Building2 },
    { key: 'verification', label: 'التوثيق', icon: FileCheck },
  ];

  return (
    <div className="space-y-4" style={{ fontFamily: fontCairo }}>
      {/* Search bar */}
      <div className={`${cardClass} rounded-2xl p-4 flex items-center gap-4`}>
        <Icon3D icon={Users} theme="purple" size="sm" hoverable={false} />
        <h2 className="text-lg font-bold" style={{ color: 'var(--bait-text)' }}>
          المستخدمون
        </h2>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl flex-1 max-w-sm
          ${isDark ? 'bg-white/[0.10] border border-white/[0.15]' : 'bg-[#F5EEE1]/50 border-[3px] border-gray-200/60'}`}>
          <Search size={16} style={{ color: 'var(--bait-text-muted)' }} />
          <input
            type="text"
            placeholder="بحث بالاسم أو الإيميل أو ID..."
            value={searchQ}
            onChange={(e) => { setSearchQ(e.target.value); setPage(1); }}
            className="bg-transparent outline-none text-sm flex-1 font-[Cairo]"
            style={{ color: 'var(--bait-text)' }}
          />
        </div>
        <span className="text-sm" style={{ color: 'var(--bait-text-muted)' }}>
          {users.length} مستخدم
        </span>
      </div>

      {/* Table */}
      <div className={`${cardClass} rounded-2xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid var(--bait-border)` }}>
                {['المستخدم', 'ID', 'الإيميل', 'الدور', 'الباقة', 'الحالة', 'الكوينز', 'تاريخ التسجيل', 'آخر دخول'].map((h) => (
                  <th key={h} className="px-3 py-3 text-right font-semibold text-xs"
                      style={{ color: 'var(--bait-text-secondary)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-3 py-3">
                        <div className="h-5 w-20 rounded animate-pulse"
                             style={{ background: 'var(--bait-skeleton)' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center"
                      style={{ color: 'var(--bait-text-muted)' }}>
                    لا يوجد مستخدمون
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}
                      onClick={() => openDrawer(u.id)}
                      className="cursor-pointer hover:bg-[var(--bait-surface-hover)] transition-colors"
                      style={{ borderBottom: `1px solid var(--bait-border)` }}>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                          ${isDark ? 'bg-white/[0.15]' : 'bg-[#F5EEE1]'}`}
                             style={{ color: 'var(--bait-text)' }}>
                          {(u.display_name || '?')[0]}
                        </div>
                        <span className="font-semibold text-xs" style={{ color: 'var(--bait-text)' }}>
                          {u.display_name || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--bait-badge-bg)', color: 'var(--bait-text-muted)' }}>
                        {u.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs" style={{ color: 'var(--bait-text-secondary)' }}>
                      {u.email}
                    </td>
                    <td className="px-3 py-3">
                      {u.roles.includes('admin') ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-l from-[#D4AF37]/20 to-[#FFD700]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                          <Crown size={9} /> أدمن
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
                              style={{ background: 'var(--bait-badge-bg)', color: 'var(--bait-text-secondary)' }}>
                          <User size={9} /> مستخدم
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: isDark ? 'rgba(59,91,254,0.15)' : 'rgba(59,91,254,0.08)', color: '#3B5BFE' }}>
                        {u.provider === 'google' ? 'Google' : 'Email'}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{ background: STATUS_BADGES.active.bg, color: STATUS_BADGES.active.color }}>
                        <CheckCircle size={9} /> نشط
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono font-bold text-xs" style={{ color: isDark ? '#FFD700' : '#D4AF37' }}>
                      {Number(u.balance_coins).toLocaleString('ar-AE')}
                    </td>
                    <td className="px-3 py-3 text-[10px]" style={{ color: 'var(--bait-text-muted)' }}>
                      {formatDate(u.created_at)}
                    </td>
                    <td className="px-3 py-3 text-[10px]" style={{ color: 'var(--bait-text-muted)' }}>
                      {formatDate(u.last_sign_in_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3"
             style={{ borderTop: `1px solid var(--bait-border)` }}>
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm disabled:opacity-30
              hover:bg-[var(--bait-surface-hover)] transition-all"
            style={{ color: 'var(--bait-text)' }}>
            <ChevronRight size={14} /> السابق
          </button>
          <span className="text-sm" style={{ color: 'var(--bait-text-muted)' }}>صفحة {page}</span>
          <button onClick={() => setPage(page + 1)} disabled={users.length < 20}
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm disabled:opacity-30
              hover:bg-[var(--bait-surface-hover)] transition-all"
            style={{ color: 'var(--bait-text)' }}>
            التالي <ChevronLeft size={14} />
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════ */}
      {/* Enhanced User Detail Drawer */}
      {/* ═════════════════════════════════════════════ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex" dir="rtl">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className={`relative mr-auto w-full max-w-lg h-full overflow-y-auto
            ${isDark
              ? 'bg-[#2A44CC] border-r border-white/[0.15]'
              : 'bg-[#F5EEE1] border-r-[4px] border-gray-200/60'
            }`}>
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 sticky top-0 z-10"
                 style={{ background: isDark ? 'rgba(42,68,204,0.95)' : 'rgba(245,238,225,0.95)', backdropFilter: 'blur(12px)' }}>
              <h3 className="font-bold text-lg" style={{ color: 'var(--bait-text)' }}>
                تفاصيل المستخدم
              </h3>
              <button onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl hover:bg-[var(--bait-surface-hover)] transition-all">
                <X size={18} style={{ color: 'var(--bait-text)' }} />
              </button>
            </div>

            {drawerLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-xl animate-pulse"
                       style={{ background: 'var(--bait-skeleton)' }} />
                ))}
              </div>
            ) : selectedUser ? (
              <div className="p-4 space-y-4">
                {/* User Quick Info Card */}
                <div className={`${cardClass} rounded-2xl p-4`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold
                      ${isDark ? 'bg-white/[0.15]' : 'bg-[#F5EEE1]'}`}
                         style={{ color: 'var(--bait-text)' }}>
                      {(selectedUser.profile?.display_name || selectedUser.user_metadata?.name || selectedUser.email || '?')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base" style={{ color: 'var(--bait-text)' }}>
                        {selectedUser.profile?.display_name || selectedUser.user_metadata?.name || selectedUser.email}
                      </p>
                      <p className="text-xs flex items-center gap-1" style={{ color: 'var(--bait-text-muted)' }}>
                        <Mail size={10} /> {selectedUser.email}
                      </p>
                      {/* Status badge */}
                      {(() => {
                        const s = getUserStatus(selectedUser);
                        const badge = STATUS_BADGES[s] || STATUS_BADGES.active;
                        const BadgeIcon = badge.icon;
                        return (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mt-1"
                                style={{ background: badge.bg, color: badge.color }}>
                            <BadgeIcon size={10} /> {badge.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  {/* User ID — copyable */}
                  <div className="flex items-center gap-2 mt-2 p-2 rounded-lg"
                       style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' }}>
                    <Hash size={12} style={{ color: 'var(--bait-text-muted)' }} />
                    <span className="font-mono text-[11px] flex-1 select-all" style={{ color: 'var(--bait-text-secondary)' }}>
                      {selectedUser.id}
                    </span>
                    <button onClick={() => copyToClipboard(selectedUser.id)}
                      className="p-1 rounded hover:bg-[var(--bait-surface-hover)] transition-all">
                      <Copy size={12} style={{ color: 'var(--bait-text-muted)' }} />
                    </button>
                  </div>
                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-[10px]">
                    <div className="text-center">
                      <span style={{ color: 'var(--bait-text-muted)' }}>الموفّر</span>
                      <p className="font-bold" style={{ color: 'var(--bait-text)' }}>{selectedUser.provider}</p>
                    </div>
                    <div className="text-center">
                      <span style={{ color: 'var(--bait-text-muted)' }}>التسجيل</span>
                      <p className="font-bold" style={{ color: 'var(--bait-text)' }}>{formatDate(selectedUser.created_at)}</p>
                    </div>
                    <div className="text-center">
                      <span style={{ color: 'var(--bait-text-muted)' }}>آخر دخول</span>
                      <p className="font-bold" style={{ color: 'var(--bait-text)' }}>{formatDate(selectedUser.last_sign_in_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {DRAWER_TABS.map(tab => {
                    const isActive = activeDrawerTab === tab.key;
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveDrawerTab(tab.key)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all
                          ${isActive
                            ? isDark ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30' : 'bg-[#D4AF37]/10 text-[#D4AF37] border-[3px] border-[#D4AF37]/30'
                            : isDark ? 'text-white/50 hover:bg-white/5' : 'text-[#1F3D2B]/50 hover:bg-gray-100'
                          }`}
                      >
                        <TabIcon size={12} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                {activeDrawerTab === 'info' && (
                  <div className="space-y-4">
                    {/* Wallet */}
                    <div className={`${cardClass} rounded-2xl p-4`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon3D icon={Wallet} theme="gold" size="sm" hoverable={false} />
                          <span className="font-bold" style={{ color: 'var(--bait-text)' }}>المحفظة</span>
                        </div>
                        <button onClick={() => setAdjustOpen(!adjustOpen)}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-[#5D4037] hover:scale-105 active:scale-95 transition-transform">
                          تعديل الرصيد
                        </button>
                      </div>
                      <p className="text-3xl font-bold font-mono" style={{ color: isDark ? '#FFD700' : '#D4AF37' }}>
                        {Number(selectedUser.wallet?.balance || selectedUser.wallet?.balance_coins || 0).toLocaleString('ar-AE')}
                        <span className="text-sm mr-1" style={{ color: 'var(--bait-text-muted)' }}>كوينز</span>
                      </p>

                      {adjustOpen && (
                        <div className="mt-3 pt-3 space-y-2" style={{ borderTop: `1px solid var(--bait-border)` }}>
                          <div className="flex gap-2">
                            <button onClick={() => setAdjustDir('credit')}
                              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border-[3px]
                                ${adjustDir === 'credit' ? 'bg-gradient-to-l from-[#D4AF37]/20 to-[#FFD700]/20 border-[#D4AF37]/50 text-[#D4AF37]' : 'border-transparent'}`}
                              style={{ color: adjustDir === 'credit' ? undefined : 'var(--bait-text-secondary)' }}>
                              إضافة +
                            </button>
                            <button onClick={() => setAdjustDir('debit')}
                              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border-[3px]
                                ${adjustDir === 'debit' ? 'bg-red-500/10 border-red-400/50 text-red-400' : 'border-transparent'}`}
                              style={{ color: adjustDir === 'debit' ? undefined : 'var(--bait-text-secondary)' }}>
                              خصم -
                            </button>
                          </div>
                          <input type="number" placeholder="عدد الكوينز" value={adjustCoins}
                            onChange={(e) => setAdjustCoins(e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg text-sm font-[Cairo] outline-none ${inputClass}`} />
                          <input type="text" placeholder="السبب" value={adjustReason}
                            onChange={(e) => setAdjustReason(e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg text-sm font-[Cairo] outline-none ${inputClass}`} />
                          <button onClick={handleAdjust} disabled={adjusting || !adjustCoins || !adjustReason}
                            className="w-full py-2 rounded-lg text-sm font-bold bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-[#5D4037] disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-transform">
                            {adjusting ? 'جاري التنفيذ...' : 'تنفيذ'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Ledger */}
                    <div className={`${cardClass} rounded-2xl p-4`}>
                      <h4 className="font-bold text-sm mb-3" style={{ color: 'var(--bait-text)' }}>آخر العمليات</h4>
                      {(selectedUser.ledger || []).length === 0 ? (
                        <p className="text-xs text-center py-4" style={{ color: 'var(--bait-text-muted)' }}>لا توجد عمليات</p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {selectedUser.ledger.map((entry: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-xs py-1"
                                 style={{ borderBottom: `1px solid var(--bait-border)` }}>
                              <div>
                                <span className={`font-bold ${entry.direction === 'credit' || entry.amount > 0 ? 'text-[#D4AF37]' : 'text-red-400'}`}>
                                  {entry.direction === 'credit' || entry.amount > 0 ? '+' : '-'}{entry.coins || Math.abs(entry.amount || 0)}
                                </span>
                                <span className="mr-2" style={{ color: 'var(--bait-text-secondary)' }}>{entry.reason}</span>
                              </div>
                              <span style={{ color: 'var(--bait-text-muted)' }}>{formatDate(entry.created_at)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeDrawerTab === 'plan' && (
                  <div className="space-y-4">
                    {/* Current Plan */}
                    <div className={`${cardClass} rounded-2xl p-4`}>
                      <div className="flex items-center gap-2 mb-4">
                        <Icon3D icon={CreditCard} theme="blue" size="sm" hoverable={false} />
                        <span className="font-bold" style={{ color: 'var(--bait-text)' }}>الباقة الحالية</span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold" style={{ color: isDark ? '#FFD700' : '#D4AF37' }}>
                          {PLAN_OPTIONS.find(p => p.value === (selectedUser.subscription?.plan || 'free'))?.labelAr || 'مجاني'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                              style={{ background: selectedUser.subscription?.status === 'active' ? 'rgba(212,175,55,0.12)' : 'rgba(107,114,128,0.12)',
                                       color: selectedUser.subscription?.status === 'active' ? '#D4AF37' : '#6B7280' }}>
                          {selectedUser.subscription?.status === 'active' ? 'نشطة' : 'مجانية'}
                        </span>
                      </div>
                      {selectedUser.subscription?.expires_at && (
                        <p className="text-xs" style={{ color: 'var(--bait-text-muted)' }}>
                          تنتهي: {formatDate(selectedUser.subscription.expires_at)}
                        </p>
                      )}
                      {selectedUser.subscription?.updated_by && (
                        <p className="text-[10px] mt-1" style={{ color: 'var(--bait-text-muted)' }}>
                          آخر تعديل بواسطة: {selectedUser.subscription.updated_by?.slice(0, 8)}...
                        </p>
                      )}
                    </div>

                    {/* Change Plan */}
                    <div className={`${cardClass} rounded-2xl p-4`}>
                      <h4 className="font-bold text-sm mb-3" style={{ color: 'var(--bait-text)' }}>تغيير الباقة</h4>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {PLAN_OPTIONS.map(p => (
                          <button key={p.value}
                            onClick={() => setSelectedPlan(p.value)}
                            className={`p-3 rounded-xl text-xs font-bold transition-all border-[3px]
                              ${selectedPlan === p.value
                                ? `border-[${p.color}]/50`
                                : isDark ? 'border-white/10' : 'border-gray-200/60'
                              }`}
                            style={{
                              borderColor: selectedPlan === p.value ? p.color + '80' : undefined,
                              background: selectedPlan === p.value ? p.color + '15' : undefined,
                              color: selectedPlan === p.value ? p.color : 'var(--bait-text-secondary)',
                            }}>
                            {p.labelAr}
                          </button>
                        ))}
                      </div>
                      <input type="date" placeholder="تاريخ الانتهاء (اختياري)" value={planExpiry}
                        onChange={(e) => setPlanExpiry(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-[Cairo] outline-none mb-2 ${inputClass}`} />
                      <input type="text" placeholder="سبب التغيير (اختياري)" value={planReason}
                        onChange={(e) => setPlanReason(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-[Cairo] outline-none mb-3 ${inputClass}`} />
                      <button onClick={handlePlanUpdate} disabled={actionLoading || selectedPlan === (selectedUser.subscription?.plan || 'free')}
                        className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-l from-[#3B5BFE] to-[#5B7BFE] text-white disabled:opacity-40 hover:scale-[1.02] active:scale-95 transition-transform">
                        {actionLoading ? 'جاري التحديث...' : 'تحديث الباقة'}
                      </button>
                    </div>
                  </div>
                )}

                {activeDrawerTab === 'actions' && (
                  <div className="space-y-4">
                    {/* Account Actions */}
                    <div className={`${cardClass} rounded-2xl p-4`}>
                      <h4 className="font-bold text-sm mb-4" style={{ color: 'var(--bait-text)' }}>إجراءات الحساب</h4>
                      <div className="space-y-3">
                        {/* Ban/Unban */}
                        <div className={`p-3 rounded-xl border-[3px] ${isDark ? 'border-white/10' : 'border-gray-200/60'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon3D icon={Ban} theme="orange" size="xs" hoverable={false} />
                              <span className="text-sm font-bold" style={{ color: 'var(--bait-text)' }}>
                                {getUserStatus(selectedUser) === 'banned' ? 'رفع الحظر' : 'حظر الحساب'}
                              </span>
                            </div>
                            {getUserStatus(selectedUser) === 'banned' && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}>
                                محظور حالياً
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] mb-2" style={{ color: 'var(--bait-text-muted)' }}>
                            {getUserStatus(selectedUser) === 'banned'
                              ? `السبب: ${selectedUser.account_status?.reason || '-'}`
                              : 'حظر الحساب يمنع المستخدم من تسجيل الدخول نهائياً أو لفترة محددة'}
                          </p>
                          {actionModal.type === 'ban' && actionModal.open ? (
                            <div className="space-y-2 pt-2" style={{ borderTop: `1px solid var(--bait-border)` }}>
                              <input type="text" placeholder="سبب الحظر" value={actionReason}
                                onChange={(e) => setActionReason(e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs font-[Cairo] outline-none ${inputClass}`} />
                              {getUserStatus(selectedUser) !== 'banned' && (
                                <input type="number" placeholder="مدة الحظر بالساعات (اختياري - فارغ = دائم)" value={actionDuration}
                                  onChange={(e) => setActionDuration(e.target.value)}
                                  className={`w-full px-3 py-2 rounded-lg text-xs font-[Cairo] outline-none ${inputClass}`} />
                              )}
                              <div className="flex gap-2">
                                <button onClick={handleBan} disabled={actionLoading}
                                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-transform hover:scale-[1.02] disabled:opacity-50
                                    ${getUserStatus(selectedUser) === 'banned'
                                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                                      : 'bg-red-500/15 text-red-400 border border-red-400/30'}`}>
                                  {actionLoading ? 'جاري...' : getUserStatus(selectedUser) === 'banned' ? 'رفع الحظر' : 'تأكيد الحظر'}
                                </button>
                                <button onClick={() => setActionModal({ type: '', open: false })}
                                  className="px-4 py-2 rounded-lg text-xs" style={{ color: 'var(--bait-text-muted)' }}>إلغاء</button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => setActionModal({ type: 'ban', open: true })}
                              className={`w-full py-2 rounded-lg text-xs font-bold transition-all hover:scale-[1.02]
                                ${getUserStatus(selectedUser) === 'banned'
                                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                                  : 'bg-red-500/10 text-red-400 border border-red-400/20'}`}>
                              {getUserStatus(selectedUser) === 'banned' ? 'رفع الحظر' : 'حظر المستخدم'}
                            </button>
                          )}
                        </div>

                        {/* Freeze/Unfreeze */}
                        <div className={`p-3 rounded-xl border-[3px] ${isDark ? 'border-white/10' : 'border-gray-200/60'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon3D icon={Snowflake} theme="blue" size="xs" hoverable={false} />
                              <span className="text-sm font-bold" style={{ color: 'var(--bait-text)' }}>
                                {getUserStatus(selectedUser) === 'frozen' ? 'فك التجميد' : 'تجميد الحساب'}
                              </span>
                            </div>
                            {getUserStatus(selectedUser) === 'frozen' && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}>
                                مجمّد حالياً
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] mb-2" style={{ color: 'var(--bait-text-muted)' }}>
                            {getUserStatus(selectedUser) === 'frozen'
                              ? `السبب: ${selectedUser.account_status?.reason || '-'}`
                              : 'تجميد مؤقت - يمنع استخدام الخدمات مع إبقاء الحساب'}
                          </p>
                          {actionModal.type === 'freeze' && actionModal.open ? (
                            <div className="space-y-2 pt-2" style={{ borderTop: `1px solid var(--bait-border)` }}>
                              <input type="text" placeholder="سبب التجميد" value={actionReason}
                                onChange={(e) => setActionReason(e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg text-xs font-[Cairo] outline-none ${inputClass}`} />
                              {getUserStatus(selectedUser) !== 'frozen' && (
                                <input type="datetime-local" placeholder="تاريخ فك التجميد (اختياري)" value={actionDuration}
                                  onChange={(e) => setActionDuration(e.target.value)}
                                  className={`w-full px-3 py-2 rounded-lg text-xs font-[Cairo] outline-none ${inputClass}`} />
                              )}
                              <div className="flex gap-2">
                                <button onClick={handleFreeze} disabled={actionLoading}
                                  className="flex-1 py-2 rounded-lg text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-400/30 transition-transform hover:scale-[1.02] disabled:opacity-50">
                                  {actionLoading ? 'جاري...' : getUserStatus(selectedUser) === 'frozen' ? 'فك التجميد' : 'تأكيد التجميد'}
                                </button>
                                <button onClick={() => setActionModal({ type: '', open: false })}
                                  className="px-4 py-2 rounded-lg text-xs" style={{ color: 'var(--bait-text-muted)' }}>إلغاء</button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => setActionModal({ type: 'freeze', open: true })}
                              className={`w-full py-2 rounded-lg text-xs font-bold transition-all hover:scale-[1.02]
                                ${getUserStatus(selectedUser) === 'frozen'
                                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-400/20'}`}>
                              {getUserStatus(selectedUser) === 'frozen' ? 'فك التجميد' : 'تجميد الحساب'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone — Delete User */}
                    <div className="rounded-2xl p-4 border-2 border-red-500/30 bg-red-500/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon3D icon={Trash2} theme="red" size="xs" hoverable={false} />
                        <h4 className="font-bold text-sm text-red-400">منطقة الخطر — حذف المستخدم</h4>
                      </div>
                      <p className="text-[10px] mb-3" style={{ color: 'var(--bait-text-muted)' }}>
                        الحذف نهائي ولا يمكن التراجع عنه. سيُحذف الحساب وجميع بياناته.
                      </p>
                      {deleteConfirmOpen ? (
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-red-400">اكتب كلمة <span className="font-mono bg-red-500/20 px-1 rounded">حذف</span> للتأكيد:</p>
                          <input
                            type="text"
                            placeholder="اكتب: حذف"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg text-xs font-[Cairo] outline-none ${inputClass}`}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleDeleteUser}
                              disabled={deleteLoading || deleteConfirmText !== 'حذف'}
                              className="flex-1 py-2 rounded-lg text-xs font-bold bg-red-500/20 text-red-400 border border-red-400/40 transition-transform hover:scale-[1.02] disabled:opacity-40"
                            >
                              {deleteLoading ? 'جاري الحذف...' : 'تأكيد الحذف النهائي'}
                            </button>
                            <button
                              onClick={() => { setDeleteConfirmOpen(false); setDeleteConfirmText(''); }}
                              className="px-4 py-2 rounded-lg text-xs" style={{ color: 'var(--bait-text-muted)' }}
                            >إلغاء</button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmOpen(true)}
                          className="w-full py-2 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-400/20 transition-all hover:scale-[1.02]"
                        >
                          حذف المستخدم نهائياً
                        </button>
                      )}
                    </div>

                    {/* Admin Actions History */}
                    <div className={`${cardClass} rounded-2xl p-4`}>
                      <h4 className="font-bold text-sm mb-3" style={{ color: 'var(--bait-text)' }}>سجل الإجراءات الإدارية</h4>
                      {(selectedUser.admin_actions || []).length === 0 ? (
                        <p className="text-xs text-center py-4" style={{ color: 'var(--bait-text-muted)' }}>لا توجد إجراءات سابقة</p>
                      ) : (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedUser.admin_actions.map((a: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-xs py-1"
                                 style={{ borderBottom: `1px solid var(--bait-border)` }}>
                              <span className="font-mono px-2 py-0.5 rounded text-[10px]"
                                    style={{ background: 'var(--bait-badge-bg)', color: 'var(--bait-text-secondary)' }}>
                                {a.type}
                              </span>
                              <span style={{ color: 'var(--bait-text-muted)' }}>{formatDate(a.created_at)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeDrawerTab === 'behavior' && (
                  <div className="space-y-4">
                    {/* Login Info */}
                    <div className={`${cardClass} rounded-2xl p-4`}>
                      <div className="flex items-center gap-2 mb-4">
                        <Icon3D icon={Activity} theme="purple" size="sm" hoverable={false} />
                        <span className="font-bold" style={{ color: 'var(--bait-text)' }}>سلوك المستخدم</span>
                      </div>
                      <div className="space-y-3">
                        {/* IP Address */}
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Globe size={12} style={{ color: 'var(--bait-text-muted)' }} />
                            <span className="text-xs font-bold" style={{ color: 'var(--bait-text)' }}>عنوان IP</span>
                          </div>
                          <p className="font-mono text-sm" style={{ color: 'var(--bait-text-secondary)' }}>
                            {selectedUser.behavior?.ip_address || 'غير متوفر'}
                          </p>
                        </div>
                        {/* User Agent / Device */}
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Monitor size={12} style={{ color: 'var(--bait-text-muted)' }} />
                            <span className="text-xs font-bold" style={{ color: 'var(--bait-text)' }}>الجهاز / المتصفح</span>
                          </div>
                          <p className="text-[11px] break-all" style={{ color: 'var(--bait-text-secondary)' }}>
                            {selectedUser.behavior?.user_agent || 'غير متوفر'}
                          </p>
                          {selectedUser.behavior?.user_agent && (
                            <div className="flex gap-2 mt-2">
                              {selectedUser.behavior.user_agent.toLowerCase().includes('mobile') ? (
                                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,91,254,0.1)', color: '#3B5BFE' }}>
                                  <Smartphone size={9} /> موبايل
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                                  <Laptop size={9} /> كمبيوتر
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {/* Session Info */}
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Clock size={12} style={{ color: 'var(--bait-text-muted)' }} />
                            <span className="text-xs font-bold" style={{ color: 'var(--bait-text)' }}>تفاصيل الجلسة</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                              <span style={{ color: 'var(--bait-text-muted)' }}>تاريخ الإنشاء</span>
                              <p className="font-bold" style={{ color: 'var(--bait-text)' }}>{formatDate(selectedUser.behavior?.created_at)}</p>
                            </div>
                            <div>
                              <span style={{ color: 'var(--bait-text-muted)' }}>آخر دخول</span>
                              <p className="font-bold" style={{ color: 'var(--bait-text)' }}>{formatDate(selectedUser.behavior?.last_sign_in_at)}</p>
                            </div>
                            <div>
                              <span style={{ color: 'var(--bait-text-muted)' }}>تأكيد الحساب</span>
                              <p className="font-bold" style={{ color: 'var(--bait-text)' }}>{formatDate(selectedUser.behavior?.confirmed_at)}</p>
                            </div>
                            <div>
                              <span style={{ color: 'var(--bait-text-muted)' }}>الحظر حتى</span>
                              <p className="font-bold" style={{ color: selectedUser.behavior?.banned_until ? '#EF4444' : 'var(--bait-text)' }}>
                                {selectedUser.behavior?.banned_until ? formatDate(selectedUser.behavior.banned_until) : '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Identity Providers */}
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Fingerprint size={12} style={{ color: 'var(--bait-text-muted)' }} />
                            <span className="text-xs font-bold" style={{ color: 'var(--bait-text)' }}>مزودو الهوية</span>
                          </div>
                          {(selectedUser.behavior?.identities || []).length === 0 ? (
                            <p className="text-xs" style={{ color: 'var(--bait-text-muted)' }}>لا توجد هويات</p>
                          ) : (
                            <div className="space-y-2">
                              {selectedUser.behavior.identities.map((identity: any, idx: number) => (
                                <div key={idx} className="text-[10px] p-2 rounded-lg" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }}>
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold" style={{ color: 'var(--bait-text)' }}>{identity.provider}</span>
                                    <span style={{ color: 'var(--bait-text-muted)' }}>{formatDate(identity.last_sign_in_at)}</span>
                                  </div>
                                  {identity.identity_data?.email && (
                                    <p className="mt-0.5" style={{ color: 'var(--bait-text-secondary)' }}>
                                      {identity.identity_data.email}
                                    </p>
                                  )}
                                  {identity.identity_data?.full_name && (
                                    <p style={{ color: 'var(--bait-text-secondary)' }}>
                                      {identity.identity_data.full_name}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeDrawerTab === 'workspaces' && (
                  <div className="space-y-4">
                    <div className={`${cardClass} rounded-2xl p-4`}>
                      <div className="flex items-center gap-2 mb-4">
                        <Icon3D icon={Building2} theme="blue" size="sm" hoverable={false} />
                        <span className="font-bold" style={{ color: 'var(--bait-text)' }}>مساحات العمل</span>
                      </div>
                      {(selectedUser.workspaces || []).length === 0 ? (
                        <p className="text-xs text-center py-6" style={{ color: 'var(--bait-text-muted)' }}>لا توجد مساحات عمل</p>
                      ) : (
                        <div className="space-y-3">
                          {selectedUser.workspaces.map((ws: any) => (
                            <div key={ws.id || ws.name} className={`p-3 rounded-xl border-[3px] ${isDark ? 'border-white/10' : 'border-gray-200/60'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-bold text-sm" style={{ color: 'var(--bait-text)' }}>{ws.name}</p>
                                  <p className="text-[10px]" style={{ color: 'var(--bait-text-muted)' }}>
                                    {ws.business_type} · {ws.plan || 'starter'}
                                  </p>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                                  ${ws.status === 'active' || !ws.status
                                    ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                                    : 'bg-red-500/10 text-red-400'}`}>
                                  {ws.status === 'active' || !ws.status ? 'نشط' : 'متوقف'}
                                </span>
                              </div>
                              {/* Workspace ID */}
                              <div className="flex items-center gap-1 mb-2">
                                <Hash size={10} style={{ color: 'var(--bait-text-muted)' }} />
                                <span className="font-mono text-[9px]" style={{ color: 'var(--bait-text-muted)' }}>
                                  {ws.id?.slice(0, 16) || '-'}...
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleWorkspaceAction(ws.id, ws.status === 'active' ? 'deactivate' : 'activate')}
                                  className="flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:scale-[1.02]"
                                  style={{ background: 'rgba(59,91,254,0.08)', color: '#3B5BFE' }}>
                                  {ws.status === 'active' || !ws.status ? 'إيقاف' : 'تفعيل'}
                                </button>
                                <button onClick={() => { if (confirm('هل أنت متأكد من حذف مساحة العمل؟')) handleWorkspaceAction(ws.id, 'delete'); }}
                                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-red-500/10 text-red-400 transition-all hover:scale-[1.02]">
                                  <Trash2 size={10} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeDrawerTab === 'verification' && (
                  <div className="space-y-4">
                    <div className={`${cardClass} rounded-2xl p-4`}>
                      <div className="flex items-center gap-2 mb-4">
                        <Icon3D icon={FileCheck} theme="gold" size="sm" hoverable={false} />
                        <span className="font-bold" style={{ color: 'var(--bait-text)' }}>بيانات التوثيق</span>
                      </div>
                      {!selectedUser.verification || Object.keys(selectedUser.verification).length === 0 ? (
                        <div className="text-center py-6">
                          <Icon3D icon={AlertTriangle} theme="amber" size="md" className="mx-auto mb-2" />
                          <p className="text-xs" style={{ color: 'var(--bait-text-muted)' }}>لم يكمل المستخدم عملية التوثيق بعد</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {Object.entries(selectedUser.verification).map(([key, value]: [string, any]) => (
                            <div key={key} className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold" style={{ color: 'var(--bait-text)' }}>
                                  {key === 'user_type' ? 'نوع المستخدم'
                                    : key === 'full_name' ? 'الاسم الكامل'
                                    : key === 'phone' ? 'الهاتف'
                                    : key === 'emirate' ? 'الإمارة'
                                    : key === 'provider_type' ? 'نوع المزود'
                                    : key === 'company_name' ? 'اسم الشركة'
                                    : key === 'license_number' ? 'رقم الرخصة'
                                    : key === 'services' ? 'الخدمات'
                                    : key === 'experience_years' ? 'سنوات الخبرة'
                                    : key === 'completed_at' ? 'تاريخ الإكمال'
                                    : key}
                                </span>
                                {typeof value === 'boolean' && (
                                  value ? <CheckCircle size={12} color="#D4AF37" /> : <XCircle size={12} color="#EF4444" />
                                )}
                              </div>
                              <p className="text-xs break-all" style={{ color: 'var(--bait-text-secondary)' }}>
                                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Profile from KV */}
                    {selectedUser.profile && Object.keys(selectedUser.profile).length > 0 && (
                      <div className={`${cardClass} rounded-2xl p-4`}>
                        <h4 className="font-bold text-sm mb-3" style={{ color: 'var(--bait-text)' }}>بيانات البروفايل</h4>
                        <div className="space-y-2">
                          {Object.entries(selectedUser.profile).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex items-start justify-between text-xs py-1"
                                 style={{ borderBottom: `1px solid var(--bait-border)` }}>
                              <span className="font-bold" style={{ color: 'var(--bait-text-muted)' }}>{key}</span>
                              <span className="text-left max-w-[60%] break-all" style={{ color: 'var(--bait-text-secondary)' }}>
                                {typeof value === 'object' ? JSON.stringify(value) : String(value || '-')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* User Metadata from Auth */}
                    {selectedUser.user_metadata && Object.keys(selectedUser.user_metadata).length > 0 && (
                      <div className={`${cardClass} rounded-2xl p-4`}>
                        <h4 className="font-bold text-sm mb-3" style={{ color: 'var(--bait-text)' }}>بيانات Auth الوصفية</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {Object.entries(selectedUser.user_metadata).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex items-start justify-between text-[10px] py-1"
                                 style={{ borderBottom: `1px solid var(--bait-border)` }}>
                              <span className="font-mono" style={{ color: 'var(--bait-text-muted)' }}>{key}</span>
                              <span className="text-left max-w-[55%] break-all" style={{ color: 'var(--bait-text-secondary)' }}>
                                {typeof value === 'object' ? JSON.stringify(value) : String(value || '-')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
