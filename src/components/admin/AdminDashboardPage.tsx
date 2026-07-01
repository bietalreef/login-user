/**
 * AdminDashboardPage — Main overview with KPIs + Charts
 */
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon3D } from '../ui/Icon3D';
import { getStats } from './adminApi';
import { AdminKPICards } from './AdminKPICards';
import { toast } from 'sonner@2.0.3';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts@2.15.2';
import { Zap, Bell, Users, Award, Star } from 'lucide-react';
// Crown not available — using Award as alias
const Crown = Award;

const PIE_COLORS = ['#3B5BFE', '#D4AF37', '#FF6B6B', '#7C5ADA', '#4ECDC4', '#FFB347'];

export function AdminDashboardPage() {
  const { isDark } = useTheme();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const cardClass = isDark
    ? 'bg-white/[0.13] backdrop-blur-xl border border-white/[0.18]'
    : 'bg-white border-[4px] border-gray-200/60';

  const fetchStats = useCallback(async () => {
    try {
      const res = await getStats();
      setStats(res);
    } catch (err: any) {
      console.error('Stats fetch error:', err);
      toast.error('خطأ في تحميل الإحصائيات');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const formatDate = (d: string) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('ar-AE', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Activity action labels
  const getActionLabel = (action: string) => {
    const map: Record<string, string> = {
      login: 'تسجيل دخول',
      signup: 'تسجيل جديد',
      use_tool: 'استخدام أداة',
      buy_coins: 'شراء كوينز',
      admin_invite_create: 'إنشاء دعوة',
      admin_invite_accept: 'قبول دعوة',
      admin_wallet_adjust: 'تعديل محفظة',
      update_profile: 'تحديث ملف',
    };
    return map[action] || action;
  };

  const PROVIDER_TYPE_LABELS: Record<string, string> = {
    plumber: 'سباك', electrician: 'كهربائي', painter: 'دهان',
    carpenter: 'نجار', cleaner: 'تنظيف', ac: 'مكيفات',
    construction: 'بناء', landscaping: 'حدائق', tiles: 'بلاط', maintenance: 'صيانة',
  };

  const distributionData = stats?.service_distribution?.length
    ? stats.service_distribution.map((d: any) => ({
        name: PROVIDER_TYPE_LABELS[d.name] || d.name,
        value: d.value,
      }))
    : [
        { name: 'بناء وتشطيب', value: 35 },
        { name: 'صيانة', value: 25 },
        { name: 'استشارات', value: 15 },
        { name: 'أدوات', value: 12 },
        { name: 'متجر', value: 13 },
      ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--bait-text)' }}>
            لوحة التحكم
          </h1>
          <p className="text-sm" style={{ color: 'var(--bait-text-muted)' }}>
            نظرة عامة على منصة بيت الريف
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-xs" style={{ color: 'var(--bait-text-muted)' }}>
            تحديث تلقائي كل 30 ثانية
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <AdminKPICards data={stats} loading={loading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend Line Chart */}
        <div className={`${cardClass} rounded-2xl p-5`}>
          <div className="flex items-center gap-2 mb-4">
            <Icon3D icon={Users} theme="blue" size="sm" hoverable={false} />
            <h3 className="font-bold" style={{ color: 'var(--bait-text)' }}>
              نمو المستخدمين (7 أيام)
            </h3>
          </div>
          {loading ? (
            <div className="h-48 rounded-xl animate-pulse" style={{ background: 'var(--bait-skeleton)' }} />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats?.weekly_trend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', fontSize: 10 }}
                  tickFormatter={(d) => new Date(d).toLocaleDateString('ar-AE', { day: 'numeric', month: 'short' })}
                />
                <YAxis tick={{ fill: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: isDark ? 'rgba(59,91,254,0.9)' : '#fff',
                    border: 'none',
                    borderRadius: 12,
                    color: isDark ? '#fff' : '#1F3D2B',
                    fontFamily: 'Cairo',
                    fontSize: 12,
                  }}
                  labelFormatter={(d) => new Date(d).toLocaleDateString('ar-AE', { weekday: 'long', day: 'numeric', month: 'short' })}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={isDark ? '#FFD700' : '#D4AF37'}
                  strokeWidth={3}
                  dot={{ fill: isDark ? '#FFD700' : '#D4AF37', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Distribution Pie Chart */}
        <div className={`${cardClass} rounded-2xl p-5`}>
          <div className="flex items-center gap-2 mb-4">
            <Icon3D icon={Star} theme="purple" size="sm" hoverable={false} />
            <h3 className="font-bold" style={{ color: 'var(--bait-text)' }}>
              توزيع الخدمات
            </h3>
          </div>
          {loading ? (
            <div className="h-48 rounded-xl animate-pulse" style={{ background: 'var(--bait-skeleton)' }} />
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distributionData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: isDark ? 'rgba(59,91,254,0.9)' : '#fff',
                      border: 'none',
                      borderRadius: 12,
                      fontFamily: 'Cairo',
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {distributionData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span style={{ color: 'var(--bait-text-secondary)' }}>{d.name}</span>
                    <span className="font-bold mr-auto" style={{ color: 'var(--bait-text)' }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Bar Chart */}
      <div className={`${cardClass} rounded-2xl p-5`}>
        <div className="flex items-center gap-2 mb-4">
          <Icon3D icon={Crown} theme="gold" size="sm" hoverable={false} />
          <h3 className="font-bold" style={{ color: 'var(--bait-text)' }}>
            التسجيلات اليومية
          </h3>
        </div>
        {loading ? (
          <div className="h-48 rounded-xl animate-pulse" style={{ background: 'var(--bait-skeleton)' }} />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats?.weekly_trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'} />
              <XAxis
                dataKey="date"
                tick={{ fill: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', fontSize: 10 }}
                tickFormatter={(d) => new Date(d).toLocaleDateString('ar-AE', { weekday: 'short' })}
              />
              <YAxis tick={{ fill: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: isDark ? 'rgba(59,91,254,0.9)' : '#fff',
                  border: 'none',
                  borderRadius: 12,
                  fontFamily: 'Cairo',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill={isDark ? '#FFD700' : '#D4AF37'} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent Activity Feed */}
      <div className={`${cardClass} rounded-2xl p-5`}>
        <div className="flex items-center gap-2 mb-4">
          <Icon3D icon={Bell} theme="amber" size="sm" hoverable={false} />
          <h3 className="font-bold" style={{ color: 'var(--bait-text)' }}>
            آخر الأنشطة
          </h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg animate-pulse"
                   style={{ background: 'var(--bait-skeleton)' }} />
            ))}
          </div>
        ) : (stats?.recent_activity || []).length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: 'var(--bait-text-muted)' }}>
            لا توجد أنشطة حديثة
          </p>
        ) : (
          <div className="space-y-2">
            {(stats?.recent_activity || []).slice(0, 10).map((act: any) => (
              <div key={act.id}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[var(--bait-surface-hover)] transition-colors">
                <Icon3D icon={Zap} theme="amber" size="xs" hoverable={false} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold" style={{ color: 'var(--bait-text)' }}>
                    {getActionLabel(act.action)}
                  </span>
                  <span className="text-xs mr-2" style={{ color: 'var(--bait-text-muted)' }}>
                    {act.actor_user_id ? `#${act.actor_user_id.slice(0, 6)}` : ''}
                  </span>
                </div>
                <span className="text-xs whitespace-nowrap" style={{ color: 'var(--bait-text-muted)' }}>
                  {formatDate(act.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}