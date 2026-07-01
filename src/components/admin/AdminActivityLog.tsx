/**
 * AdminActivityLog — Platform activity timeline
 */
import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon3D } from '../ui/Icon3D';
import { getActivity } from './adminApi';
import { toast } from 'sonner@2.0.3';
import {
  Zap, Search, Users, Wallet, Shield, Settings,
  Bell, Star, ChevronLeft, ChevronRight, Crown,
} from 'lucide-react';

const ACTION_META: Record<string, { label: string; icon: any; theme: string }> = {
  login: { label: 'تسجيل دخول', icon: Users, theme: 'blue' },
  signup: { label: 'تسجيل جديد', icon: Star, theme: 'gold' },
  use_tool: { label: 'استخدام أداة', icon: Zap, theme: 'amber' },
  buy_coins: { label: 'شراء كوينز', icon: Wallet, theme: 'purple' },
  update_profile: { label: 'تحديث الملف', icon: Settings, theme: 'brown' },
  admin_invite_create: { label: 'إنشاء دعوة', icon: Crown, theme: 'gold' },
  admin_invite_accept: { label: 'قبول دعوة', icon: Shield, theme: 'blue' },
  admin_wallet_adjust: { label: 'تعديل محفظة', icon: Wallet, theme: 'red' },
};

const FILTER_OPTIONS = [
  { key: '', label: 'الكل' },
  { key: 'login', label: 'تسجيل دخول' },
  { key: 'signup', label: 'تسجيل جديد' },
  { key: 'use_tool', label: 'استخدام أداة' },
  { key: 'admin_wallet_adjust', label: 'تعديل محفظة' },
  { key: 'admin_invite_create', label: 'دعوات' },
];

export function AdminActivityLog() {
  const { isDark } = useTheme();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterType, setFilterType] = useState('');

  const cardClass = isDark
    ? 'bg-white/[0.13] backdrop-blur-xl border border-white/[0.18]'
    : 'bg-white border-[4px] border-gray-200/60';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getActivity(page, 30, filterType)
      .then((res) => {
        if (cancelled) return;
        setActivities(res.activities || []);
        setTotal(res.total || 0);
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error('خطأ في تحميل الأنشطة');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [page, filterType]);

  const formatDate = (d: string) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('ar-AE', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  const getActionMeta = (action: string) =>
    ACTION_META[action] || { label: action, icon: Bell, theme: 'brown' };

  return (
    <div className="space-y-4">
      {/* Header + filters */}
      <div className={`${cardClass} rounded-2xl p-4`}>
        <div className="flex items-center gap-4 flex-wrap">
          <Icon3D icon={Zap} theme="amber" size="sm" hoverable={false} />
          <h2 className="text-lg font-bold" style={{ color: 'var(--bait-text)' }}>
            سجل الأنشطة
          </h2>
          <span className="text-sm" style={{ color: 'var(--bait-text-muted)' }}>
            {total} نشاط
          </span>
          <div className="flex-1" />
          <div className="flex gap-2 flex-wrap">
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f.key}
                onClick={() => { setFilterType(f.key); setPage(1); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border-[2px]
                  ${filterType === f.key
                    ? isDark
                      ? 'bg-white/[0.15] border-white/[0.25] text-white'
                      : 'bg-gradient-to-l from-[#D4AF37]/10 to-[#FFD700]/10 border-[#D4AF37]/30 text-[#5D4037]'
                    : 'border-transparent hover:bg-[var(--bait-surface-hover)]'
                  }`}
                style={{ color: filterType === f.key ? undefined : 'var(--bait-text-secondary)' }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className={`${cardClass} rounded-2xl`}>
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg animate-pulse" style={{ background: 'var(--bait-skeleton)' }} />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-48 rounded animate-pulse" style={{ background: 'var(--bait-skeleton)' }} />
                  <div className="h-3 w-32 rounded animate-pulse" style={{ background: 'var(--bait-skeleton)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--bait-text-muted)' }}>
            لا توجد أنشطة
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--bait-border)' }}>
            {activities.map((act) => {
              const meta = getActionMeta(act.action);
              return (
                <div key={act.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bait-surface-hover)] transition-colors">
                  <Icon3D icon={meta.icon} theme={meta.theme} size="xs" hoverable={false} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm" style={{ color: 'var(--bait-text)' }}>
                        {meta.label}
                      </span>
                      {act.meta?.entity_type && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono"
                              style={{ background: 'var(--bait-badge-bg)', color: 'var(--bait-text-muted)' }}>
                          {act.meta.entity_type}
                        </span>
                      )}
                    </div>
                    <p className="text-xs truncate" style={{ color: 'var(--bait-text-muted)' }}>
                      {act.actor_user_id ? `User: ${act.actor_user_id.slice(0, 8)}...` : 'System'}
                      {act.meta && Object.keys(act.meta).length > 0 && (
                        <span className="mr-2">
                          {JSON.stringify(act.meta).slice(0, 60)}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-xs whitespace-nowrap" style={{ color: 'var(--bait-text-muted)' }}>
                    {formatDate(act.created_at)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3"
             style={{ borderTop: `1px solid var(--bait-border)` }}>
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm disabled:opacity-30
              hover:bg-[var(--bait-surface-hover)] transition-all"
            style={{ color: 'var(--bait-text)' }}>
            <ChevronRight size={14} /> السابق
          </button>
          <span className="text-sm" style={{ color: 'var(--bait-text-muted)' }}>
            صفحة {page} من {Math.ceil(total / 30) || 1}
          </span>
          <button onClick={() => setPage(page + 1)} disabled={activities.length < 30}
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm disabled:opacity-30
              hover:bg-[var(--bait-surface-hover)] transition-all"
            style={{ color: 'var(--bait-text)' }}>
            التالي <ChevronLeft size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}