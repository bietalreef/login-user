import { Menu, Bell, ShoppingCart, Home, Briefcase, Cpu, Folder, User, Search } from 'lucide-react';
// Bot not available — using Cpu as alias
const Bot = Cpu;
import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';

const HEADER_NOTIF_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

interface NewTopHeaderProps {
  isScrolled: boolean;
  onOpenNotificationsCenter?: (category?: 'platform' | 'weyaak' | 'crm' | 'user' | 'alerts' | 'offers' | 'all') => void;
  onOpenSearch?: () => void;
  notificationCount?: number;
}

export function NewTopHeader({ isScrolled, onOpenNotificationsCenter, onOpenSearch, notificationCount }: NewTopHeaderProps) {
  const { t, dir } = useTranslation('common');
  const { isDark } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [liveCount, setLiveCount] = useState(notificationCount ?? 0);

  // Fetch real notification count from backend
  useEffect(() => {
    async function fetchCount() {
      try {
        const { data } = await supabase.auth.getSession();
        const userToken = data?.session?.access_token || '';
        const res = await fetch(`${HEADER_NOTIF_BASE}/notifications`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
            ...(userToken ? { 'X-User-Token': userToken } : {}),
          },
        });
        const json = await res.json();
        if (json.notifications) {
          setLiveCount(json.notifications.filter((n: any) => !n.read).length);
        }
      } catch (err) {
        console.error('NewTopHeader: fetch count error', err);
      }
    }
    if (notificationCount === undefined) fetchCount();
    else setLiveCount(notificationCount);
  }, [notificationCount]);

  // Language Toggle Logic
  const toggleLanguage = () => {
    const newLang = dir === 'rtl' ? 'en' : 'ar';
    window.location.search = `?lang=${newLang}`;
  };

  const menuItems = [
    { icon: Home, title: t('home'), path: '/' },
    { icon: Briefcase, title: t('services'), path: '/services' },
    { icon: Bot, title: t('weyaak'), path: '/weyaak' },
    { icon: Folder, title: t('projects'), path: '/projects' },
    { icon: User, title: t('profile'), path: '/profile' },
  ];

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark
          ? 'bg-[var(--bait-surface)] shadow-[0_1px_3px_rgba(0,0,0,0.3)]'
          : 'bg-white shadow-sm'
      }`}
    >
      {/* Main Header Container */}
      <div className="px-3 md:px-6 py-3 flex items-center justify-between gap-2 md:gap-4" dir="rtl">
        
        {/* RIGHT SECTION: Menu + Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Menu Button */}
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-gray-50'
              }`}
            >
              <Menu className={`w-6 h-6 ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1A1A1A]'}`} />
            </button>
             {/* Desktop Menu Dropdown */}
             {showMenu && (
                <div className={`hidden md:block absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-xl p-2 border z-50 ${
                  isDark
                    ? 'bg-[var(--bait-surface)] border-[var(--bait-border-strong)]'
                    : 'bg-white border-gray-100'
                }`}>
                  {menuItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button key={idx} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-right ${
                        isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50'
                      }`}>
                        <Icon className="w-4 h-4 text-blue-500" />
                        <span className={`text-sm font-bold font-cairo ${isDark ? 'text-[var(--bait-text)]' : 'text-gray-700'}`}>{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
          </div>

          {/* Logo */}
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg overflow-hidden bg-gradient-to-br from-[#4A90E2] to-[#7AB8FF] p-0.5 shadow-sm flex-shrink-0">
             <ImageWithFallback 
               src="https://images.unsplash.com/photo-1640184713822-174b6e94df51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
               alt="Logo"
               className="w-full h-full object-cover rounded-md"
             />
          </div>
        </div>

        {/* CENTER SECTION: Search Bar */}
        <div className="flex-1 max-w-md min-w-0">
          <button 
            onClick={onOpenSearch}
            className={`w-full h-9 md:h-10 rounded-full flex items-center px-3 md:px-4 gap-2 transition-colors group border ${
              isDark
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/30'
                : 'bg-[#F3F4F6] border-transparent hover:bg-[#E5E7EB] hover:border-blue-200'
            }`}
          >
            <Search className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-white/40 group-hover:text-[#D4AF37]' : 'text-gray-400 group-hover:text-blue-500'}`} />
            <span className={`text-xs font-cairo truncate text-right flex-1 block ${
              isDark ? 'text-white/40 group-hover:text-white/60' : 'text-gray-400 group-hover:text-gray-600'
            }`}>
              {dir === 'rtl' ? 'بحث...' : 'Search...'}
            </span>
          </button>
        </div>

        {/* LEFT SECTION: Language + Icons */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0" dir="ltr">
           {/* Language Switch */}
           <button 
             onClick={toggleLanguage}
             className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold font-cairo transition-colors ${
               isDark
                 ? 'bg-white/5 border border-white/10 text-white/60 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37]'
                 : 'bg-gray-50 border border-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
             }`}
           >
             {dir === 'rtl' ? 'EN' : 'AR'}
           </button>

           {/* Notification Bell - Enhanced */}
           <button 
             onClick={() => onOpenNotificationsCenter && onOpenNotificationsCenter()}
             className={`w-9 h-9 rounded-full flex items-center justify-center relative transition-all hover:shadow-md hover:scale-105 active:scale-95 group ${
               isDark
                 ? 'bg-gradient-to-br from-white/5 to-white/10 border border-white/10'
                 : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/80'
             }`}
           >
             <Bell className={`w-[18px] h-[18px] transition-colors ${
               isDark
                 ? 'text-white/70 group-hover:text-[#D4AF37]'
                 : 'text-gray-700 group-hover:text-[#D4AF37]'
             }`} />
             {liveCount > 0 && (
               <motion.span
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                 className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full ring-2 ring-white flex items-center justify-center px-1 shadow-sm"
               >
                 <span className="text-[9px] font-bold text-[#5D4037] leading-none">
                   {liveCount > 9 ? '9+' : liveCount}
                 </span>
               </motion.span>
             )}
           </button>
        </div>

      </div>
    </div>
  );
}