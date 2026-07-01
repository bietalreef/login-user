/**
 * BrowserLayout.tsx — الهيكل الرئيسي لتطبيق المتصفح
 * ═══════════════════════════════════════════════════
 * - شريط TopNav + SideDrawer + شريط عنوان الصفحة (بدون emoji)
 * - كل الأيقونات Lucide — ممنوع emoji (القاعدة الذهبية)
 * - يعرض AccountSetupModal تلقائياً للمستخدمين الجدد (onboarding_completed === false)
 */

import { useState, useEffect, useRef, type ComponentType } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router@7.1.1';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { TopNav } from '../mobile/TopNav';
import { SideDrawer } from '../mobile/SideDrawer';
import { FullSearchScreen } from '../mobile/FullSearchScreen';
import { NotificationsCenter } from '../mobile/NotificationsCenter';
import { useSearchStore } from '../../stores/search-store';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ShareButton } from '../ui/ShareButton';
import { AccountSetupModal } from '../ui/AccountSetupModal';
import { useUser } from '../../utils/UserContext';
import { AgentActivationProvider } from '../../contexts/AgentActivationContext';
import { IntegrationProvider } from '../../contexts/IntegrationContext';
import { PreviewProvider } from '../../contexts/PreviewContext';
import { useWeyaakIdentity, type WeyaakRole } from '../../contexts/WeyaakIdentityContext';
import { supabase } from '../../utils/supabase/client';
import InstallProviderAppPrompt from '../InstallProviderAppPrompt';

import {
  X, Wrench, ShoppingCart, Hammer, MapPin, MessageSquare,
  Store, Star, Flame, Ruler, Smartphone, User, Wallet,
  FileText, LayoutDashboard, type LucideProps,
} from 'lucide-react';
const MessageSquareText = MessageSquare;

/* ══════════ Page Title Map — Lucide icons فقط ══════════ */
interface PageInfo {
  ar: string;
  en: string;
  Icon: ComponentType<LucideProps>;
  iconColor: string;
}

const PAGE_TITLES: Record<string, PageInfo> = {
  '/services':        { ar: 'الخدمات',          en: 'Services',        Icon: Wrench,            iconColor: '#D4AF37' },
  '/shop':            { ar: 'المتجر',           en: 'Store',           Icon: ShoppingCart,      iconColor: '#4A90E2' },
  '/store':           { ar: 'المتجر',           en: 'Store',           Icon: ShoppingCart,      iconColor: '#4A90E2' },
  '/tools':           { ar: 'الأدوات الذكية',   en: 'Smart Tools',     Icon: Hammer,            iconColor: '#D4AF37' },
  '/maps':            { ar: 'خريطة المحلات',    en: 'Stores Map',      Icon: MapPin,            iconColor: '#EF4444' },
  '/marketplace':     { ar: 'السوق',            en: 'Marketplace',     Icon: Store,             iconColor: '#8B5CF6' },
  '/recommendations': { ar: 'التوصيات',         en: 'Recommendations', Icon: Star,              iconColor: '#F59E0B' },
  '/offers':          { ar: 'العروض',           en: 'Offers',          Icon: Flame,             iconColor: '#EF4444' },
  '/design':          { ar: 'استوديو التصميم',  en: 'Design Studio',   Icon: Ruler,             iconColor: '#9B7AED' },
  '/wallet':          { ar: 'محفظة الدار',      en: 'Dar Wallet',      Icon: Wallet,            iconColor: '#D4AF37' },
  '/profile':         { ar: 'الملف الشخصي',     en: 'Profile',         Icon: User,              iconColor: '#3B5BFE' },
  '/messages':        { ar: 'الرسائل',          en: 'Messages',        Icon: MessageSquareText, iconColor: '#3B5BFE' },
  '/projects':        { ar: 'متوفر في التطبيق', en: 'Available in App', Icon: Smartphone,       iconColor: '#6B7280' },
  '/rfq':             { ar: 'متوفر في التطبيق', en: 'Available in App', Icon: FileText,          iconColor: '#6B7280' },
  '/dashboard':       { ar: 'لوحة التحكم',      en: 'Control Panel',   Icon: LayoutDashboard,   iconColor: '#3B5BFE' },
};

function getPageInfo(pathname: string): PageInfo | null {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  for (const [prefix, info] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(prefix) && prefix !== '/') return info;
  }
  return null;
}

export function BrowserLayout() {
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCategory, setNotificationCategory] = useState<any>('all');
  const [showSetupModal, setShowSetupModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen: isSearchOpen, setOpen: setSearchOpen } = useSearchStore();
  const { language } = useTranslation('common');
  const { isDark } = useTheme();
  const { profile, refreshProfile } = useUser();
  const { initializeUser, userId } = useWeyaakIdentity();
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, Segoe UI, sans-serif' : 'Cairo, sans-serif';
  const mainRef = useRef<HTMLElement>(null);
  const setupCheckedRef = useRef(false);

  // ── noindex لجميع صفحات التطبيق الداخلية ──
  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, nofollow');
    // إزالة canonical لمنع التضارب
    document.querySelector('link[rel="canonical"]')?.remove();
  }, [location.pathname]);

  // ── Scroll to top on route change ──
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    mainRef.current?.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  // ── Show AccountSetupModal for NEW users (first login) ──
  useEffect(() => {
    if (setupCheckedRef.current) return;
    if (!profile) return;
    setupCheckedRef.current = true;

    const alreadyDismissed = sessionStorage.getItem('setup_modal_dismissed');
    if (alreadyDismissed) return;

    if (!profile.onboarding_completed) {
      // Delay 600ms so the home screen renders first
      const t = setTimeout(() => setShowSetupModal(true), 600);
      return () => clearTimeout(t);
    }
  }, [profile]);

  const handleSetupClose = () => {
    setShowSetupModal(false);
    sessionStorage.setItem('setup_modal_dismissed', '1');
  };

  const handleRoleSelected = async (role: 'client' | 'provider') => {
    setShowSetupModal(false);
    sessionStorage.setItem('setup_modal_dismissed', '1');
    // Refresh profile so the rest of the app gets the new role
    await refreshProfile();
    // Initialize Weyaak identity with basic info (will be enriched after onboarding)
    if (userId) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const email     = user?.email ?? '';
        const name      = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? email.split('@')[0];
        const avatarUrl = user?.user_metadata?.avatar_url ?? '';
        const weyaakRole: WeyaakRole = role === 'provider' ? 'provider' : 'customer';
        initializeUser(userId, weyaakRole, email, name, avatarUrl);
      } catch { /* non-fatal */ }
    }
    // Navigate to full onboarding to collect all remaining profile data
    navigate(`/onboarding?role=${role}`);
  };

  const handleNavigate = (route: string) => {
    navigate(route);
    setIsSideDrawerOpen(false);
  };

  const handleOpenNotifications = (category: any = 'all') => {
    setNotificationCategory(category);
    setShowNotifications(true);
  };

  const { isDesktop } = useBreakpoint();
  const isStore = location.pathname.startsWith('/store') || location.pathname.startsWith('/shop');
  const isHome = location.pathname === '/home' || location.pathname === '/';
  const pageInfo = getPageInfo(location.pathname);

  // If notifications screen is open, show it full screen
  if (showNotifications) {
    return (
      <NotificationsCenter
        onBack={() => setShowNotifications(false)}
        initialCategory={notificationCategory}
      />
    );
  }

  return (
    <AgentActivationProvider>
    <IntegrationProvider>
    <PreviewProvider>
    <div className={`relative w-full min-h-screen flex flex-col ${isDark ? 'bg-[var(--bait-bg)]' : 'bg-background'}`}>
      {/* Account Setup Modal — first-time users only */}
      <AccountSetupModal
        isOpen={showSetupModal}
        onClose={handleSetupClose}
        isEn={isEn}
        onRoleSelected={handleRoleSelected}
        contextMessage={
          isEn
            ? 'Register for free to access exclusive features'
            : 'سجل مجاناً للوصول إلى المتاجر الموثقة'
        }
      />

      {/* Side Drawer */}
      <SideDrawer
        isOpen={isSideDrawerOpen}
        onClose={() => setIsSideDrawerOpen(false)}
        onNavigate={handleNavigate}
        currentRoute={location.pathname}
      />

      {/* Top Navigation */}
      <TopNav
        onOpenDrawer={() => setIsSideDrawerOpen(true)}
        onOpenNotificationsCenter={handleOpenNotifications}
        showCart={isStore}
      />

      {/* Page Close Bar — appears on ALL pages except Home */}
      {!isHome && pageInfo && (() => {
        const { Icon, iconColor } = pageInfo;
        return (
          <div className={`backdrop-blur-sm border-b px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 ${
            isDark
              ? 'bg-[var(--bait-glass)] border-[var(--bait-border)]'
              : 'bg-white/80 border-[#F5EEE1]'
          }`}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${iconColor}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: iconColor }} />
              </div>
              <h2
                className={`text-sm font-bold ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}
                style={{ fontFamily }}
              >
                {isEn ? pageInfo.en : pageInfo.ar}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <ShareButton
                variant="compact"
                isEn={isEn}
                title={isEn ? `${pageInfo.en} | Bait Al Reef` : `${pageInfo.ar} | بيت الريف`}
              />
              <button
                onClick={() => navigate('/agents')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 group ${
                  isDark
                    ? 'bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400'
                    : 'bg-[#1F3D2B]/8 hover:bg-red-50 hover:text-red-600 text-[#1F3D2B]/70'
                }`}
                aria-label={isEn ? 'Close page' : 'إغلاق الصفحة'}
              >
                <span className="text-xs font-semibold group-hover:text-red-600" style={{ fontFamily }}>
                  {isEn ? 'Close' : 'إغلاق'}
                </span>
                <X className="w-4 h-4 group-hover:text-red-600 transition-colors" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* Main Content Area */}
      <main ref={mainRef} className="flex-1">
        {/* على الشاشات الكبيرة (≥1280px): حاوية مركزية بعرض أقصى */}
        {isDesktop ? (
          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            width: '100%',
            minHeight: '100%',
          }}>
            <Outlet />
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      {/* PWA Install Prompt */}
      <InstallProviderAppPrompt />

      {/* Smart Search — Global Overlay */}
      {isSearchOpen && (
        <FullSearchScreen
          onClose={() => setSearchOpen(false)}
          context={
            location.pathname.startsWith('/maps') ? 'maps'
            : location.pathname.startsWith('/store') || location.pathname.startsWith('/shop') ? 'store'
            : location.pathname.startsWith('/services') ? 'services'
            : 'home'
          }
          onNavigate={(route, id) => {
            setSearchOpen(false);
            if (route === 'service' && id) navigate(`/services/${id}`);
            else if (route === 'shop') navigate('/shop');
            else if (route === 'provider') navigate(`/provider/${id}`);
            else if (route.startsWith('/')) navigate(route);
          }}
        />
      )}
    </div>
    </PreviewProvider>
    </IntegrationProvider>
    </AgentActivationProvider>
  );
}