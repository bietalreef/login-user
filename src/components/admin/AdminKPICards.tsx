/**
 * AdminKPICards — Dashboard KPI metric cards
 */
import { useTheme } from '../../contexts/ThemeContext';
import { Icon3D } from '../ui/Icon3D';
import { Users, Zap, Wallet, Award, Star, Bell, Briefcase, Clock } from 'lucide-react';
// Crown not available — using Award as alias
const Crown = Award;

interface KPIData {
  total_users: number;
  new_today: number;
  total_providers: number;
  pending_providers: number;
  total_wallet_balance: number;
  activity_today: number;
}

interface AdminKPICardsProps {
  data: KPIData | null;
  loading: boolean;
}

const KPIS: {
  key: keyof KPIData;
  label: string;
  icon: any;
  theme: string;
  format?: (v: number) => string;
  alert?: (v: number) => boolean;
}[] = [
  { key: 'total_users', label: 'إجمالي المستخدمين', icon: Users, theme: 'blue' },
  { key: 'new_today', label: 'تسجيلات اليوم', icon: Star, theme: 'gold' },
  { key: 'total_providers', label: 'مزودو الخدمات', icon: Briefcase, theme: 'teal' },
  { key: 'pending_providers', label: 'بانتظار التوثيق', icon: Clock, theme: 'amber', alert: (v) => v > 0 },
  { key: 'total_wallet_balance', label: 'إجمالي الكوينز', icon: Wallet, theme: 'purple',
    format: (v) => v.toLocaleString('ar-AE') },
  { key: 'activity_today', label: 'أنشطة اليوم', icon: Bell, theme: 'red' },
];

export function AdminKPICards({ data, loading }: AdminKPICardsProps) {
  const { isDark } = useTheme();

  const cardClass = isDark
    ? 'bg-white/[0.13] backdrop-blur-xl border border-white/[0.18]'
    : 'bg-white border-[4px] border-gray-200/60';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {KPIS.map((kpi) => (
        <div key={kpi.key} className={`${cardClass} rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02]`}>
          <div className="flex items-start justify-between mb-3">
            <Icon3D icon={kpi.icon} theme={kpi.theme} size="sm" hoverable={false} />
          </div>
          {loading ? (
            <div className="space-y-2">
              <div className="h-7 w-16 rounded-lg animate-pulse"
                   style={{ background: 'var(--bait-skeleton)' }} />
              <div className="h-4 w-20 rounded animate-pulse"
                   style={{ background: 'var(--bait-skeleton)' }} />
            </div>
          ) : (
            <>
              <p className={`text-2xl font-bold ${kpi.alert && data && kpi.alert(data[kpi.key]) ? 'text-[#F59E0B]' : ''}`}
                 style={!(kpi.alert && data && kpi.alert(data[kpi.key])) ? { color: 'var(--bait-text)' } : {}}>
                {data ? (kpi.format ? kpi.format(data[kpi.key]) : data[kpi.key]) : '0'}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--bait-text-secondary)' }}>
                {kpi.label}
                {kpi.alert && data && kpi.alert(data[kpi.key]) && (
                  <span className="mr-1 text-[#F59E0B]">●</span>
                )}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
