const image_1d3f7ac269fcb8922cef991f788ec0c45ba06aa3 = '/assets/placeholder.png';
import bietAlreefLogo from 'figma:asset/67fe2af1d169e9257cfb304dda040baf67b4e599.png';
import { ShoppingCart, Search, Bell, Menu, Mic, Check, CheckCheck, ChevronLeft, X, Clock, Sparkles, MessageSquare, AlertTriangle, Zap, Home, Rocket, Cpu, MessageCircle, Flame, User, Wallet, Star, Award } from 'lucide-react';
// Bot & Crown not available — using safe aliases
const Bot = Cpu;
const Crown = Award;
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router@7.1.1';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useTranslation } from '../../contexts/LanguageContext';
import { useSearchStore } from '../../stores/search-store';
import { WalletWidget } from './WalletWidget';
import { useShopStore } from './shop/ShopStore';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon3D } from '../ui/Icon3D';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';

const NOTIF_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

async function getNotifHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const userToken = data?.session?.access_token || '';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...(userToken ? { 'X-User-Token': userToken } : {}),
  };
}

// ─── Notification Data Types ───
interface NotificationItem {
  id: string;
  category: 'platform' | 'weyaak' | 'other';
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  read: boolean;
  icon: string;
  created_at: string;
}

// ─── Icon mapping for notification types ───
const NOTIF_ICON_MAP: Record<string, { icon: any; theme: string }> = {
  home: { icon: Home, theme: 'blue' },
  rocket: { icon: Rocket, theme: 'purple' },
  bot: { icon: Bot, theme: 'violet' },
  message: { icon: MessageCircle, theme: 'indigo' },
  bell: { icon: Bell, theme: 'gold' },
  flame: { icon: Flame, theme: 'orange' },
  user: { icon: User, theme: 'blue' },
  wallet: { icon: Wallet, theme: 'gold' },
  zap: { icon: Zap, theme: 'amber' },
  star: { icon: Star, theme: 'gold' },
  crown: { icon: Crown, theme: 'gold' },
};

function formatTimeAgo(dateStr: string, isEn: boolean): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return isEn ? 'Just now' : 'الآن';
  if (mins < 60) return isEn ? `${mins}m ago` : `منذ ${mins} د`;
  if (hrs < 24) return isEn ? `${hrs}h ago` : `منذ ${hrs} س`;
  if (days < 7) return isEn ? `${days}d ago` : `منذ ${days} ي`;
  return new Date(dateStr).toLocaleDateString(isEn ? 'en-AE' : 'ar-AE', { month: 'short', day: 'numeric' });
}

const CATEGORY_META: Record<string, { icon: any; labelAr: string; labelEn: string; color: string }> = {
  all:       { icon: Bell, labelAr: 'الكل',   labelEn: 'All',      color: 'from-[#D4AF37] to-[#B8940E]' },
  platform:  { icon: Crown, labelAr: 'المنصة', labelEn: 'Platform', color: 'from-[#3B5BFE] to-[#2A44CC]' },
  weyaak:    { icon: Bot, labelAr: 'وياك',   labelEn: 'Weyaak',   color: 'from-[#7C5ADA] to-[#5E3EBF]' },
  other:     { icon: Star, labelAr: 'أخرى',   labelEn: 'Other',    color: 'from-[#D4AF37] to-[#B8940E]' },
};

interface TopNavProps {
  onOpenDrawer?: () => void;
  onOpenNotificationsCenter?: (category?: 'platform' | 'weyaak' | 'other' | 'all') => void;
  showCart?: boolean;
}

export function TopNav({ onOpenDrawer, onOpenNotificationsCenter, showCart = false }: TopNavProps) {
  const { t, language, textAlign } = useTranslation('common');
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, Segoe UI, sans-serif' : 'Cairo, sans-serif';
  const { isDark } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Shop store for cart count
  const cart = useShopStore((state) => state.cart);
  const setCurrentView = useShopStore((state) => state.setCurrentView);
  const cartCount = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
  
  // Search store — global
  const setOpen = useSearchStore((state) => state.setOpen);
  const scope = useSearchStore((state) => state.scope);
  const globalQuery = useSearchStore((state) => state.query);
  const setGlobalQuery = useSearchStore((state) => state.setQuery);
  const openSearch = () => setOpen(true);
  const clearSearch = () => { setGlobalQuery(''); };

  // ─── Fetch notifications from backend ───
  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data?.session?.access_token) return; // No session — skip silently
      const headers = await getNotifHeaders();
      const res = await fetch(`${NOTIF_BASE}/notifications`, { headers });
      if (!res.ok) return; // Server returned error — skip silently
      const json = await res.json();
      if (json.notifications) setNotifications(json.notifications);
    } catch (err) {
      // Suppress network errors (Failed to fetch) silently
      if (err instanceof TypeError && err.message === 'Failed to fetch') return;
      console.error('TopNav: fetch notifications error', err);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // ─── Click outside to close ───
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  // ─── Dynamic counts ───
  const unreadCount = notifications.filter(n => !n.read).length;
  const totalCount = notifications.length;

  const getFilteredNotifications = useCallback(() => {
    if (activeFilter === 'all') return notifications;
    return notifications.filter(n => n.category === activeFilter);
  }, [notifications, activeFilter]);

  const filteredNotifications = getFilteredNotifications();

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return notifications.filter(n => !n.read).length;
    return notifications.filter(n => n.category === catId && !n.read).length;
  };

  // ─── Actions (backend-connected) ───
  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const headers = await getNotifHeaders();
    fetch(`${NOTIF_BASE}/notifications/read`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id }),
    }).catch(console.error);
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const headers = await getNotifHeaders();
    fetch(`${NOTIF_BASE}/notifications/read-all`, {
      method: 'POST',
      headers,
    }).catch(console.error);
  };

  const removeNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const headers = await getNotifHeaders();
    fetch(`${NOTIF_BASE}/notifications/${id}`, {
      method: 'DELETE',
      headers,
    }).catch(console.error);
  };

  const handleViewAll = (category?: string) => {
    setShowNotifications(false);
    if (onOpenNotificationsCenter) {
      onOpenNotificationsCenter((category || 'all') as any);
    }
  };

  const getPlaceholder = () => {
    switch(scope) {
      case 'PROJECTS': return t('search.placeholderProjects') || (isEn ? 'Search projects...' : 'بحث في المشاريع...');
      case 'MATERIALS': return t('search.placeholderMaterials') || (isEn ? 'Search materials...' : 'بحث في المواد...');
      case 'CLIENTS': return t('search.placeholderClients') || (isEn ? 'Search clients...' : 'بحث في العملاء...');
      default: return t('search.placeholder');
    }
  };

  return (
    <div className={`backdrop-blur-md px-3 md:px-6 py-3 sticky top-0 z-40 border-b ${
      isDark
        ? 'bg-[var(--bait-glass)] shadow-[0_1px_3px_rgba(0,0,0,0.3)] border-[var(--bait-border)]'
        : 'bg-white/90 shadow-sm border-[#F5EEE1]'
    }`}>
      {/* Single Row: Logo | Search | Icons — Layout always RTL */}
      <div className="flex items-center justify-between gap-2 md:gap-4" dir="rtl">
        {/* Right Side (RTL) - Side Drawer Button + Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={onOpenDrawer}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-[#D4AF37]/15' : 'hover:bg-[#D4AF37]/10'}`}
            aria-label={isEn ? 'Open menu' : 'فتح القائمة'}
          >
            <Menu className={`w-6 h-6 ${isDark ? 'text-[var(--bait-text)]' : 'text-[#5D4037]'}`} />
          </button>
          <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <ImageWithFallback 
              src={bietAlreefLogo}
              alt="بيت الريف"
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Center - Global Search Bar (Single Source of Truth) */}
        <div className="flex-1 min-w-0 max-w-xl mx-2 md:mx-4">
          <button
            onClick={openSearch}
            className={`w-full rounded-2xl px-3 md:px-4 py-2 md:py-2.5 flex items-center gap-2 md:gap-3 hover:shadow-md transition-all border h-9 md:h-11 ${
              globalQuery
                ? isDark
                  ? 'bg-[#FFD700]/10 border-[#FFD700]/30 shadow-sm'
                  : 'bg-[#D4AF37]/5 border-[#D4AF37]/30 shadow-sm'
                : isDark
                  ? 'bg-white/5 border-white/10 hover:border-[#D4AF37]/30'
                  : 'bg-gradient-to-r from-[#F5EEE1] to-[#E5DED1] border-[#D4AF37]/20'
            }`}
          >
            <Search className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 ${globalQuery ? 'text-[#D4AF37]' : 'text-[#D4AF37]'}`} />
            {globalQuery ? (
              <span
                className={`flex-1 text-xs md:text-sm truncate block font-bold ${isDark ? 'text-[#FFD700]' : 'text-[#2C1810]'}`}
                style={{ fontFamily, textAlign }}
              >
                {globalQuery}
              </span>
            ) : (
              <span
                className={`flex-1 text-xs md:text-sm truncate block ${isDark ? 'text-white/50' : 'text-[#5D4037]/60'}`}
                style={{ fontFamily, fontWeight: 600, textAlign }}
              >
                {getPlaceholder()}
              </span>
            )}
            {globalQuery ? (
              <button
                onClick={(e) => { e.stopPropagation(); clearSearch(); }}
                className={`p-1 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
              </button>
            ) : (
              <Mic className="w-4 h-4 md:w-5 md:h-5 text-[#D4AF37] flex-shrink-0" />
            )}
          </button>
        </div>

        {/* Left Side (RTL) - Icons */}
        <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
          
          {/* Wallet Widget */}
          <WalletWidget />

          {/* Language Switch */}
          <div className="transform scale-90 md:scale-100">
             <LanguageSwitcher variant="compact" />
          </div>

          {/* Cart Icon - ONLY SHOWN IF showCart IS TRUE */}
          {showCart && (
            <button 
              className="relative flex-shrink-0 p-1.5 md:p-2"
              onClick={() => {
                if (!location.pathname.startsWith('/store') && !location.pathname.startsWith('/shop')) {
                  navigate('/store');
                }
                setCurrentView('cart');
              }}
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-[#1A5490]" />
              {cartCount > 0 && (
                <div className="absolute top-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-[#D4AF37] to-[#B5952F] rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                  <span className="text-black text-[8px] md:text-[9px]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                </div>
              )}
            </button>
          )}

          {/* ═══════════ NOTIFICATIONS ═══════════ */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) fetchNotifications(); }}
              className={`relative flex-shrink-0 p-1.5 md:p-2 rounded-xl transition-colors ${showNotifications ? (isDark ? 'bg-[#FFD700]/15' : 'bg-[#D4AF37]/10') : (isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50')}`}
              aria-label={isEn ? 'Notifications' : 'الإشعارات'}
            >
              <Bell className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${showNotifications ? 'text-[#D4AF37]' : (isDark ? 'text-[var(--bait-text)]' : 'text-[#1A5490]')}`} />
              {unreadCount > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center shadow-md"
                >
                  <span className="text-[#5D4037] text-[8px] md:text-[9px]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                </motion.div>
              )}
            </button>

            {/* ─── Notification Panel ─── */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className={`absolute left-0 top-full mt-2 w-[340px] md:w-[400px] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden z-50 ${
                    isDark ? 'bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.15]' : 'bg-white border-[4px] border-gray-200/60'
                  }`}
                  dir="rtl"
                >
                  {/* Panel Header */}
                  <div className={`p-4 ${isDark ? 'bg-gradient-to-l from-[#0F172A] to-[#0B1120]' : 'bg-gradient-to-l from-[#D4AF37] to-[#B8940E]'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon3D icon={Bell} theme="gold" size="xs" hoverable={false} />
                        <h3 className="text-white font-bold text-base" style={{ fontFamily }}>
                          {isEn ? 'Notifications' : 'الإشعارات'}
                        </h3>
                        {unreadCount > 0 && (
                          <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ fontFamily }}>
                            {unreadCount} {isEn ? 'new' : 'جديد'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-1 text-white/80 hover:text-white text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
                            style={{ fontFamily }}
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            {isEn ? 'Read all' : 'قراءة الكل'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                      {Object.entries(CATEGORY_META).map(([catId, meta]) => {
                        const count = getCategoryCount(catId);
                        const isActive = activeFilter === catId;
                        const CatIcon = meta.icon;
                        return (
                          <button
                            key={catId}
                            onClick={() => setActiveFilter(catId)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                              isActive
                                ? 'bg-white text-[#5D4037] shadow-md'
                                : 'bg-white/15 text-white/90 hover:bg-white/25'
                            }`}
                            style={{ fontFamily }}
                          >
                            <CatIcon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-white'}`} />
                            <span>{isEn ? meta.labelEn : meta.labelAr}</span>
                            {count > 0 && (
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
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

                  {/* Notifications List */}
                  <div className="max-h-[380px] overflow-y-auto">
                    {filteredNotifications.length === 0 ? (
                      <div className="py-12 text-center">
                        <Icon3D icon={Bell} theme="gold" size="lg" hoverable={false} className="mx-auto mb-3" />
                        <p className={`text-sm font-semibold ${isDark ? 'text-white/40' : 'text-gray-400'}`} style={{ fontFamily }}>
                          {isEn ? 'No notifications' : 'لا توجد إشعارات'}
                        </p>
                      </div>
                    ) : (
                      filteredNotifications.map((notif, index) => {
                        const iconConfig = NOTIF_ICON_MAP[notif.icon] || { icon: Bell, theme: 'gold' };
                        return (
                        <motion.div
                          key={notif.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className={`group relative px-4 py-3 border-b last:border-0 cursor-pointer transition-colors ${
                            isDark
                              ? `border-white/[0.06] ${!notif.read ? 'bg-[#FFD700]/[0.05]' : ''} hover:bg-white/[0.05]`
                              : `border-gray-50 ${!notif.read ? 'bg-[#D4AF37]/[0.04]' : ''} hover:bg-gray-50/80`
                          }`}
                          onClick={() => {
                            if (!notif.read) markAsRead(notif.id);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon3D */}
                            <Icon3D icon={iconConfig.icon} theme={iconConfig.theme} size="xs" hoverable={false} />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={`text-sm leading-tight ${!notif.read ? 'font-bold' : 'font-semibold'}`}
                                    style={{ fontFamily, color: isDark ? (!notif.read ? '#FFD700' : 'rgba(255,255,255,0.6)') : (!notif.read ? '#5D4037' : '#888') }}>
                                  {isEn ? notif.titleEn : notif.titleAr}
                                </h4>
                                {!notif.read && (
                                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0 mt-1.5 animate-pulse" />
                                )}
                              </div>
                              <p className="text-xs mt-0.5 leading-relaxed line-clamp-1" style={{ fontFamily, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                                {isEn ? notif.messageEn : notif.messageAr}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <Clock className="w-3 h-3" style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }} />
                                <span className="text-[10px]" style={{ fontFamily, color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>
                                  {formatTimeAgo(notif.created_at, isEn)}
                                </span>
                                {!notif.read && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                                    className="text-[10px] text-[#D4AF37] hover:text-[#B8940E] font-semibold flex items-center gap-0.5 transition-colors"
                                    style={{ fontFamily }}
                                  >
                                    <Check className="w-3 h-3" />
                                    {isEn ? 'Mark read' : 'قراءة'}
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                              className={`opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all flex-shrink-0 ${
                                isDark ? 'hover:bg-white/10 text-white/20 hover:text-red-400' : 'hover:bg-red-50 text-gray-300 hover:text-red-400'
                              }`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                        );
                      })
                    )}
                  </div>

                  {/* Panel Footer */}
                  <div className={`p-3 ${isDark ? 'border-t border-white/[0.08] bg-white/[0.03]' : 'border-t border-gray-100 bg-gray-50/50'}`}>
                    <button
                      onClick={() => handleViewAll(activeFilter)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-[#5D4037] py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                      style={{ fontFamily }}
                    >
                      <span>{isEn ? 'View All Notifications' : 'عرض جميع الإشعارات'}</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}