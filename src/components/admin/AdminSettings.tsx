/**
 * AdminSettings — System health, admin invite, platform config
 */
import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon3D } from '../ui/Icon3D';
import { getSystemHealth, createInvite, purgeAllUsers } from './adminApi';
import { toast } from 'sonner@2.0.3';
import {
  Settings, Shield, Crown, Zap, Box,
  Users, Wallet, Bell, Star, Heart, Trash2, AlertTriangle,
} from 'lucide-react';

export function AdminSettings() {
  const { isDark } = useTheme();
  const [health, setHealth] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteExpires, setInviteExpires] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [purgeConfirmOpen, setPurgeConfirmOpen] = useState(false);
  const [purgeConfirmText, setPurgeConfirmText] = useState('');
  const [purgeLoading, setPurgeLoading] = useState(false);
  const [purgeResult, setPurgeResult] = useState<any>(null);

  const cardClass = isDark
    ? 'bg-white/[0.13] backdrop-blur-xl border border-white/[0.18]'
    : 'bg-white border-[4px] border-gray-200/60';

  useEffect(() => {
    setHealthLoading(true);
    getSystemHealth()
      .then(setHealth)
      .catch((err) => toast.error('خطأ في تحميل حالة النظام'))
      .finally(() => setHealthLoading(false));
  }, []);

  const handleCreateInvite = async () => {
    setInviteLoading(true);
    try {
      const res = await createInvite();
      setInviteCode(res.invite_code);
      setInviteExpires(res.expires_at);
      toast.success('تم إنشاء رابط الدعوة');
    } catch (err: any) {
      toast.error('خطأ: ' + err.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/admin/invite/${inviteCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('تم نسخ الرابط');
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePurgeAll = async () => {
    if (purgeConfirmText !== 'حذف الكل') return;
    setPurgeLoading(true);
    try {
      const res = await purgeAllUsers();
      setPurgeResult(res);
      toast.success(`تم حذف ${res.deleted} مستخدم بنجاح`);
      setPurgeConfirmOpen(false);
      setPurgeConfirmText('');
    } catch (err: any) {
      toast.error('خطأ في الحذف: ' + err.message);
    } finally {
      setPurgeLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'healthy') return isDark ? '#FFD700' : '#D4AF37';
    return '#EF4444';
  };

  const formatLatency = (ms: number) => {
    if (ms < 100) return { text: `${ms}ms`, status: 'fast' };
    if (ms < 500) return { text: `${ms}ms`, status: 'ok' };
    return { text: `${ms}ms`, status: 'slow' };
  };

  return (
    <div className="space-y-6">
      {/* Section: Admin Invite */}
      <div className={`${cardClass} rounded-2xl p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <Icon3D icon={Crown} theme="gold" size="md" hoverable={false} />
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--bait-text)' }}>
              دعوة أدمن جديد
            </h2>
            <p className="text-xs" style={{ color: 'var(--bait-text-muted)' }}>
              أنشئ رابط دعوة يُستخدم مرة واحدة فقط - صالح لمدة 24 ساعة
            </p>
          </div>
        </div>

        {inviteCode ? (
          <div className="space-y-3">
            <div className={`p-4 rounded-xl font-mono text-sm break-all
              ${isDark ? 'bg-white/[0.08] border border-white/[0.12]' : 'bg-[#F5EEE1] border-[3px] border-gray-200/60'}`}
                 style={{ color: 'var(--bait-text)' }}>
              {`${window.location.origin}/admin/invite/${inviteCode}`}
            </div>
            <div className="flex gap-3">
              <button onClick={copyInviteLink}
                className={`flex-1 py-3 rounded-xl font-bold text-sm
                  bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-[#5D4037]
                  border-[4px] border-[#D4AF37]/30
                  hover:scale-[1.02] active:scale-95 transition-transform`}>
                {copied ? 'تم النسخ' : 'نسخ الرابط'}
              </button>
              <button onClick={handleCreateInvite}
                className={`px-6 py-3 rounded-xl font-bold text-sm
                  ${isDark ? 'bg-white/[0.10] border border-white/[0.15]' : 'bg-[#F5EEE1] border-[4px] border-gray-200/60'}
                  hover:scale-[1.02] active:scale-95 transition-transform`}
                style={{ color: 'var(--bait-text)' }}>
                إنشاء جديد
              </button>
            </div>
            {inviteExpires && (
              <p className="text-xs" style={{ color: 'var(--bait-text-muted)' }}>
                ينتهي: {new Date(inviteExpires).toLocaleDateString('ar-AE', {
                  year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
            )}
          </div>
        ) : (
          <button onClick={handleCreateInvite} disabled={inviteLoading}
            className="w-full py-4 rounded-xl font-bold text-sm
              bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-[#5D4037]
              border-[4px] border-[#D4AF37]/30
              disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-transform">
            {inviteLoading ? 'جاري الإنشاء...' : 'إنشاء رابط دعوة أدمن'}
          </button>
        )}
      </div>

      {/* Section: System Health */}
      <div className={`${cardClass} rounded-2xl p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <Icon3D icon={Shield} theme="blue" size="md" hoverable={false} />
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--bait-text)' }}>
              حالة النظام
            </h2>
            {health && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" 
                     style={{ background: getStatusColor(health.status) }} />
                <span className="text-xs font-bold"
                      style={{ color: getStatusColor(health.status) }}>
                  {health.status === 'healthy' ? 'يعمل بشكل طبيعي' : 'يوجد مشاكل'}
                </span>
              </div>
            )}
          </div>
        </div>

        {healthLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl animate-pulse"
                   style={{ background: 'var(--bait-skeleton)' }} />
            ))}
          </div>
        ) : health ? (
          <div className="space-y-4">
            {/* Latency Cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'قاعدة البيانات', ms: health.latency?.database_ms, icon: Box },
                { label: 'التخزين', ms: health.latency?.storage_ms, icon: Star },
                { label: 'المصادقة', ms: health.latency?.auth_ms, icon: Shield },
              ].map((item) => {
                const { text, status } = formatLatency(item.ms || 0);
                return (
                  <div key={item.label} className={`p-3 rounded-xl text-center
                    ${isDark ? 'bg-white/[0.08]' : 'bg-[#F5EEE1]/50'}`}>
                    <Icon3D icon={item.icon} theme={status === 'fast' ? 'blue' : status === 'ok' ? 'amber' : 'red'}
                            size="xs" hoverable={false} className="mx-auto mb-2" />
                    <p className="text-lg font-bold font-mono" style={{ color: 'var(--bait-text)' }}>
                      {text}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--bait-text-muted)' }}>
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Table Counts */}
            <div>
              <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--bait-text)' }}>
                الجداول
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.entries(health.tables || {}).map(([table, count]) => (
                  <div key={table} className={`p-3 rounded-xl text-center
                    ${isDark ? 'bg-white/[0.06]' : 'bg-[#F5EEE1]/30'}`}>
                    <p className="text-lg font-bold font-mono" style={{ color: isDark ? '#FFD700' : '#D4AF37' }}>
                      {String(count)}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--bait-text-muted)' }}>
                      {table}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage Buckets */}
            {health.storage?.buckets?.length > 0 && (
              <div>
                <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--bait-text)' }}>
                  الحاويات (Storage Buckets)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {health.storage.buckets.map((b: string) => (
                    <span key={b} className="px-3 py-1 rounded-lg text-xs font-mono"
                          style={{ background: 'var(--bait-badge-bg)', color: 'var(--bait-text-secondary)' }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {health.db_error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/30">
                <p className="text-xs text-red-400 font-mono">{health.db_error}</p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* ⚠️ Danger Zone — Purge All Users */}
      <div className="rounded-2xl p-6 border-2 border-red-500/40 bg-red-500/5">
        <div className="flex items-center gap-3 mb-4">
          <Icon3D icon={Trash2} theme="red" size="md" hoverable={false} />
          <div>
            <h2 className="text-lg font-bold text-red-400">منطقة الخطر</h2>
            <p className="text-xs" style={{ color: 'var(--bait-text-muted)' }}>
              حذف جميع المستخدمين ما عدا المدير — لا يمكن التراجع
            </p>
          </div>
        </div>

        {purgeResult && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-400/30">
            <p className="text-sm font-bold text-green-400">
              ✓ تم حذف {purgeResult.deleted} مستخدم
              {purgeResult.failed > 0 && ` — فشل ${purgeResult.failed}`}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--bait-text-muted)' }}>
              الحساب المحفوظ: {purgeResult.kept}
            </p>
          </div>
        )}

        {purgeConfirmOpen ? (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-400/20">
              <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-400">
                سيُحذف جميع المستخدمين المسجلين نهائياً من قاعدة البيانات.
                لن يتمكنوا من تسجيل الدخول مجدداً.
              </p>
            </div>
            <p className="text-sm font-bold" style={{ color: 'var(--bait-text)' }}>
              اكتب <span className="font-mono bg-red-500/20 px-1 rounded text-red-400">حذف الكل</span> للتأكيد:
            </p>
            <input
              type="text"
              placeholder="اكتب: حذف الكل"
              value={purgeConfirmText}
              onChange={(e) => setPurgeConfirmText(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl text-sm font-[Cairo] outline-none
                ${isDark ? 'bg-white/[0.10] border border-white/[0.15] text-white' : 'bg-white border-[3px] border-gray-200/60 text-[#1F3D2B]'}`}
            />
            <div className="flex gap-3">
              <button
                onClick={handlePurgeAll}
                disabled={purgeLoading || purgeConfirmText !== 'حذف الكل'}
                className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-40
                  bg-red-500/20 text-red-400 border-2 border-red-400/40"
              >
                {purgeLoading ? 'جاري الحذف...' : 'تأكيد الحذف النهائي'}
              </button>
              <button
                onClick={() => { setPurgeConfirmOpen(false); setPurgeConfirmText(''); }}
                className="px-6 py-3 rounded-xl text-sm font-bold"
                style={{ background: 'var(--bait-surface)', color: 'var(--bait-text)' }}
              >
                إلغاء
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setPurgeConfirmOpen(true)}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]
              bg-red-500/10 text-red-400 border-2 border-red-400/20"
          >
            حذف جميع المستخدمين ما عدا المدير
          </button>
        )}
      </div>

      {/* Platform Info */}
      <div className={`${cardClass} rounded-2xl p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <Icon3D icon={Heart} theme="red" size="md" hoverable={false} />
          <h2 className="text-lg font-bold" style={{ color: 'var(--bait-text)' }}>
            معلومات المنصة
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span style={{ color: 'var(--bait-text-muted)' }}>اسم المنصة:</span>
            <p className="font-bold" style={{ color: 'var(--bait-text)' }}>بيت الريف</p>
          </div>
          <div>
            <span style={{ color: 'var(--bait-text-muted)' }}>الإصدار:</span>
            <p className="font-bold" style={{ color: 'var(--bait-text)' }}>1.0.0 Beta</p>
          </div>
          <div>
            <span style={{ color: 'var(--bait-text-muted)' }}>وضع الإطلاق:</span>
            <p className="font-bold" style={{ color: isDark ? '#FFD700' : '#D4AF37' }}>
              فترة مجانية (10-15 يوم)
            </p>
          </div>
          <div>
            <span style={{ color: 'var(--bait-text-muted)' }}>كوينز الترحيب:</span>
            <p className="font-bold" style={{ color: isDark ? '#FFD700' : '#D4AF37' }}>
              300 كوينز لكل مستخدم جديد
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
