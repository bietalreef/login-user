/**
 * NotificationsCenter — Beit Al Reef Notification System
 * Connected to Backend (KV Store)
 * Design: Frosted Glass dark mode, Gold accents, Icon3D, no green, no emoji
 */
import { useState, useEffect, useCallback } from 'react';
import {
  ArrowRight, Bell, Trash2, Check, CheckCheck, Clock, X,
  Home, Rocket, Cpu, MessageCircle, Flame, User, Wallet,
  Zap, ShoppingCart, Star, Shield, Award, RefreshCw, Loader2,
} from 'lucide-react';
// Bot, Crown not available — using safe aliases
const Bot = Cpu;
const Crown = Award;
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { Icon3D } from '../ui/Icon3D';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';

const fontCairo = 'Cairo, sans-serif';
const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

// ─── API helpers ───
async function getToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || '';
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...(token ? { 'X-User-Token': token } : {}),
      ...(options.headers || {}),
    },
  });
  return res.json();
}

interface NotificationsCenterProps {
  onBack: () => void;
  initialCategory?: 'platform' | 'weyaak' | 'other' | 'all';
}

interface Notification {
  id: string;
  category: 'platform' | 'weyaak' | 'other';
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  icon: string;
  read: boolean;
  created_at: string;
  actionTarget?: string;
}

// ─── Category styles (NO GREEN — gold/blue/purple/amber) ───
const CATEGORY_META: Record<string, {
  icon: any; labelAr: string; labelEn: string;
  gradient: string; theme: string; bgLight: string; bgDark: string;
}> = {
  all: {
    icon: Bell, labelAr: 'الكل', labelEn: 'All',
    gradient: 'from-[#D4AF37] to-[#B8940E]', theme: 'gold',
    bgLight: 'bg-[#D4AF37]/10', bgDark: 'bg-[#FFD700]/10',
  },
  platform: {
    icon: Crown, labelAr: 'المنصة', labelEn: 'Platform',
    gradient: 'from-[#3B5BFE] to-[#2A44CC]', theme: 'blue',
    bgLight: 'bg-[#3B5BFE]/10', bgDark: 'bg-[#3B5BFE]/15',
  },
  weyaak: {
    icon: Bot, labelAr: 'وياك', labelEn: 'Weyaak',
    gradient: 'from-[#7C5ADA] to-[#5E3EBF]', theme: 'purple',
    bgLight: 'bg-purple-50', bgDark: 'bg-purple-500/10',
  },
  other: {
    icon: Star, labelAr: 'أخرى', labelEn: 'Other',
    gradient: 'from-[#D4AF37] to-[#B8940E]', theme: 'amber',
    bgLight: 'bg-amber-50', bgDark: 'bg-amber-500/10',
  },
};

// Icon mapping
const ICON_MAP: Record<string, any> = {
  home: Home, rocket: Rocket, bot: Bot, message: MessageCircle,
  bell: Bell, flame: Flame, user: User, wallet: Wallet,
  zap: Zap, cart: ShoppingCart, star: Star, shield: Shield,
  crown: Crown,
};
const ICON_THEME: Record<string, string> = {
  home: 'blue', rocket: 'purple', bot: 'violet', message: 'indigo',
  bell: 'gold', flame: 'orange', user: 'blue', wallet: 'gold',
  zap: 'amber', cart: 'teal', star: 'gold', shield: 'blue',
  crown: 'gold',
};

function formatTimeAgo(dateStr: string, isEn: boolean): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return isEn ? 'Just now' : 'الآن';
  if (mins < 60) return isEn ? `${mins}m ago` : `منذ ${mins} دقيقة`;
  if (hrs < 24) return isEn ? `${hrs}h ago` : `منذ ${hrs} ساعة`;
  if (days < 7) return isEn ? `${days}d ago` : `منذ ${days} يوم`;
  return new Date(dateStr).toLocaleDateString(isEn ? 'en-AE' : 'ar-AE', { month: 'short', day: 'numeric' });
}

export function NotificationsCenter({ onBack, initialCategory = 'all' }: NotificationsCenterProps) {
  const { language } = useTranslation('notifications');
  const { isDark } = useTheme();
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, Segoe UI, sans-serif' : fontCairo;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // ─── Fetch from Backend ───
  const fetchNotifications = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await apiFetch('/notifications');
      if (res.notifications) {
        setNotifications(res.notifications);
      } else if (res.error) {
        console.error('Notifications error:', res.error);
      }
    } catch (err: any) {
      console.error('Notifications fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // ─── Actions ───
  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await apiFetch('/notifications/read', { method: 'POST', body: JSON.stringify({ id }) });
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await apiFetch('/notifications/read-all', { method: 'POST' });
    toast.success(isEn ? 'All marked as read' : 'تم تحديد الكل كمقروء');
  };

  const removeNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    await apiFetch(`/notifications/${id}`, { method: 'DELETE' });
    toast.info(isEn ? 'Notification removed' : 'تم حذف الإشعار');
  };

  const clearAll = async () => {
    setNotifications([]);
    await apiFetch('/notifications', { method: 'DELETE' });
    toast.info(isEn ? 'All cleared' : 'تم حذف الكل');
  };

  // ─── Filtering ───
  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = (() => {
    let result = notifications;
    if (activeCategory !== 'all') result = result.filter(n => n.category === activeCategory);
    if (filter === 'unread') result = result.filter(n => !n.read);
    if (filter === 'read') result = result.filter(n => n.read);
    return result;
  })();

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return unreadCount;
    return notifications.filter(n => n.category === catId && !n.read).length;
  };

  // ─── Design Tokens ───
  const headerBg = isDark
    ? 'bg-gradient-to-l from-[#0F172A] to-[#0B1120]'
    : 'bg-gradient-to-l from-[#D4AF37] to-[#B8940E]';
  const pageBg = isDark
    ? 'bg-[#0B1120]'
    : 'bg-gradient-to-b from-[#F5EEE1] to-white';
  const cardClass = isDark
    ? 'bg-white/[0.13] backdrop-blur-xl border border-white/[0.18]'
    : 'bg-white border-[4px] border-gray-200/60';
  const cardUnread = isDark
    ? 'bg-white/[0.18] backdrop-blur-xl border-[#FFD700]/30 border'
    : 'bg-white border-[4px] border-[#D4AF37]/30';

  return (
    <div className={`min-h-screen ${pageBg} pb-20`} dir="rtl">

      {/* ═══ HEADER ═══ */}
      <div className={`sticky top-0 z-10 ${headerBg} text-white shadow-lg`}>
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <ArrowRight className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <Icon3D icon={Bell} theme="gold" size="sm" hoverable={false} />
                <h1 className="text-xl font-bold" style={{ fontFamily }}>
                  {isEn ? 'Notifications' : 'الإشعارات'}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchNotifications(false)}
                disabled={refreshing}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                {refreshing
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <RefreshCw className="w-4 h-4" />
                }
              </button>
              {unreadCount > 0 && (
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ fontFamily }}>
                  {unreadCount} {isEn ? 'new' : 'جديد'}
                </span>
              )}
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 pb-1">
            {Object.entries(CATEGORY_META).map(([catId, meta]) => {
              const count = getCategoryCount(catId);
              const isActive = activeCategory === catId;
              const CatIcon = meta.icon;
              return (
                <button
                  key={catId}
                  onClick={() => setActiveCategory(catId as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive ? 'bg-white text-[#5D4037] shadow-md' : 'bg-white/15 text-white/90 hover:bg-white/25'
                  }`}
                  style={{ fontFamily }}
                >
                  <CatIcon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-white'}`} />
                  <span>{isEn ? meta.labelEn : meta.labelAr}</span>
                  {count > 0 && (
                    <span className={`min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold ${
                      isActive ? 'bg-[#D4AF37] text-white' : 'bg-white/25 text-white'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ FILTER BAR ═══ */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex gap-2">
          {([
            ['all', isEn ? 'All' : 'الكل'],
            ['unread', isEn ? 'Unread' : 'غير مقروءة'],
            ['read', isEn ? 'Read' : 'مقروءة'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === key
                  ? isDark
                    ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30'
                    : 'bg-[#5D4037] text-white'
                  : isDark
                    ? 'bg-white/[0.08] text-white/60 border border-white/[0.1]'
                    : 'bg-white text-[#5D4037] border-[3px] border-gray-200/60'
              }`}
              style={{ fontFamily }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-[#D4AF37] text-[11px] font-bold flex items-center gap-1" style={{ fontFamily }}>
              <CheckCheck className="w-3.5 h-3.5" />{isEn ? 'Read all' : 'قراءة الكل'}
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={clearAll} className="text-red-400 text-[11px] font-bold flex items-center gap-1" style={{ fontFamily }}>
              <Trash2 className="w-3.5 h-3.5" />{isEn ? 'Clear' : 'حذف'}
            </button>
          )}
        </div>
      </div>

      {/* ═══ LIST ═══ */}
      <div className="px-4 space-y-2.5">
        {loading ? (
          <div className="space-y-3 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`${cardClass} rounded-2xl p-4 animate-pulse`}>
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl ${isDark ? 'bg-white/[0.1]' : 'bg-gray-100'}`} />
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 w-40 rounded ${isDark ? 'bg-white/[0.1]' : 'bg-gray-100'}`} />
                    <div className={`h-3 w-56 rounded ${isDark ? 'bg-white/[0.08]' : 'bg-gray-50'}`} />
                    <div className={`h-3 w-20 rounded ${isDark ? 'bg-white/[0.06]' : 'bg-gray-50'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-16 text-center">
                <Icon3D icon={Bell} theme="gold" size="xl" hoverable={false} />
                <h3 className="text-lg mt-4 mb-2 font-bold" style={{ fontFamily, color: isDark ? '#fff' : '#5D4037' }}>
                  {isEn ? 'No Notifications' : 'لا توجد إشعارات'}
                </h3>
                <p className="text-sm max-w-[250px]" style={{ fontFamily, color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}>
                  {isEn ? "You're all caught up!" : 'لا يوجد شيء جديد حالياً.'}
                </p>
              </motion.div>
            ) : (
              filteredNotifications.map((notif, index) => {
                const catMeta = CATEGORY_META[notif.category];
                const IconComp = ICON_MAP[notif.icon] || Bell;
                const iconTheme = ICON_THEME[notif.icon] || 'gold';
                return (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100, height: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`${!notif.read ? cardUnread : cardClass} rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.01]`}
                    onClick={() => { if (!notif.read) markAsRead(notif.id); }}
                  >
                    <div className="flex items-start gap-3">
                      <Icon3D icon={IconComp} theme={iconTheme} size="sm" hoverable={false} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            className={`text-sm leading-tight ${!notif.read ? 'font-bold' : 'font-semibold'}`}
                            style={{
                              fontFamily,
                              color: isDark
                                ? (!notif.read ? '#FFD700' : 'rgba(255,255,255,0.7)')
                                : (!notif.read ? '#5D4037' : 'rgba(0,0,0,0.5)'),
                            }}
                          >
                            {isEn ? notif.titleEn : notif.titleAr}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {!notif.read && <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />}
                            <button
                              onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                              className={`p-1 rounded-lg transition-all ${isDark ? 'hover:bg-white/10 text-white/30 hover:text-red-400' : 'hover:bg-red-50 text-gray-300 hover:text-red-400'}`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p
                          className="text-xs leading-relaxed mb-2 line-clamp-2"
                          style={{ fontFamily, color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}
                        >
                          {isEn ? notif.messageEn : notif.messageAr}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px]" style={{ fontFamily }}>
                              {formatTimeAgo(notif.created_at, isEn)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-l ${catMeta?.gradient || ''} text-white`}>
                              {isEn ? catMeta?.labelEn : catMeta?.labelAr}
                            </span>
                            {!notif.read && (
                              <button
                                onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                                className="text-[10px] text-[#D4AF37] font-bold flex items-center gap-0.5"
                                style={{ fontFamily }}
                              >
                                <Check className="w-3 h-3" />{isEn ? 'Read' : 'قراءة'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        )}
      </div>

      {notifications.length > 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-xs" style={{ fontFamily, color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>
            {isEn
              ? `${notifications.length} notifications · ${unreadCount} unread`
              : `${notifications.length} إشعار · ${unreadCount} غير مقروء`
            }
          </p>
        </div>
      )}
    </div>
  );
}