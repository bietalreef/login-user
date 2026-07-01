/**
 * PresenceDot.tsx — Presence indicator dot + "last seen" text
 * ════════════════════════════════════════════════════════════
 * Shared across Marketplace + Workspace
 * Does NOT read from any identity source — pure presentational
 *
 * Color defaults:
 *   online  = gold (#D4AF37)  — project default (no green rule)
 *   away    = amber (#F59E0B)
 *   offline = gray (#9CA3AF)
 *
 * Configurable: pass onlineColor='#22C55E' for green if desired.
 */

const fontCairo = 'Cairo, Tajawal, sans-serif';

const DEFAULT_COLORS: Record<string, string> = {
  online: '#D4AF37',   // gold — project default
  away: '#F59E0B',     // amber
  offline: '#9CA3AF',  // gray
};

interface PresenceDotProps {
  status: 'online' | 'away' | 'offline';
  lastSeenAt?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  isEn?: boolean;
  className?: string;
  /** Override the online-status color. Default: gold (#D4AF37). Pass '#22C55E' for green. */
  onlineColor?: string;
  /** Override the away-status color. Default: amber (#F59E0B). */
  awayColor?: string;
  /** Override the offline-status color. Default: gray (#9CA3AF). */
  offlineColor?: string;
}

export function PresenceDot({
  status,
  lastSeenAt,
  size = 'sm',
  showText = false,
  isEn = false,
  className = '',
  onlineColor,
  awayColor,
  offlineColor,
}: PresenceDotProps) {
  const sizes = { sm: 'w-2.5 h-2.5', md: 'w-3 h-3', lg: 'w-3.5 h-3.5' };

  const colors: Record<string, string> = {
    online: onlineColor || DEFAULT_COLORS.online,
    away: awayColor || DEFAULT_COLORS.away,
    offline: offlineColor || DEFAULT_COLORS.offline,
  };

  const color = colors[status] || colors.offline;

  const lastSeenText = (() => {
    if (status === 'online') return isEn ? 'Online' : 'متصل';
    if (status === 'away') return isEn ? 'Away' : 'بعيد';
    if (!lastSeenAt) return isEn ? 'Offline' : 'غير متصل';
    const diff = Date.now() - new Date(lastSeenAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return isEn ? 'Just now' : 'الآن';
    if (mins < 60) return isEn ? `${mins}m ago` : `منذ ${mins} د`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return isEn ? `${hours}h ago` : `منذ ${hours} س`;
    const days = Math.floor(hours / 24);
    return isEn ? `${days}d ago` : `منذ ${days} ي`;
  })();

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="relative">
        <div
          className={`${sizes[size]} rounded-full`}
          style={{ backgroundColor: color }}
        />
        {status === 'online' && (
          <div
            className={`absolute inset-0 ${sizes[size]} rounded-full animate-ping opacity-40`}
            style={{ backgroundColor: color }}
          />
        )}
      </div>
      {showText && (
        <span
          className="text-[10px] font-semibold"
          style={{ fontFamily: fontCairo, color }}
        >
          {lastSeenText}
        </span>
      )}
    </div>
  );
}
