import { useState } from 'react';
import { X, ChevronLeft, User, ArrowRight, Download, Smartphone, Sun, Moon, Shield, ShoppingCart, Settings, Eraser, Copy } from 'lucide-react';
// ShoppingBag not available — using ShoppingCart as alias
const ShoppingBag = ShoppingCart;
import { sectionsTree, MainSection, SubSection } from '../../data/sectionsTree';
import { useTranslation } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../utils/UserContext';
import { Icon3D, NAV_ICONS, SERVICE_ICONS } from '../ui/Icon3D';
import { Layers as FolderKanban, Wallet, Cpu, BarChart2 as BarChart3, Wrench, Home as HomeIcon, LayoutDashboard } from 'lucide-react';
// Bot not available — using Cpu as alias
const Bot = Cpu;
import bietAlreefLogoImg from 'figma:asset/67fe2af1d169e9257cfb304dda040baf67b4e599.png';
const bietAlreefLogo = bietAlreefLogoImg;
import { toast } from 'sonner@2.0.3';
import { supabase } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  currentRoute?: string;
}

export function SideDrawer({ isOpen, onClose, onNavigate, currentRoute }: SideDrawerProps) {
  const { t, language } = useTranslation('common');
  const theme = useTheme();
  const { profile, isAdmin, refreshProfile } = useUser();
  const [showServicesOverlay, setShowServicesOverlay] = useState(false);
  const [showAppCTA, setShowAppCTA] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif';
  
  // Pull name from profile context, fallback to Guest
  const displayName = profile?.full_name || (isEn ? 'Guest User' : 'مستخدم زائر');
  const userRole = profile?.role || 'guest';
  const roleLabel = userRole === 'guest'
    ? (isEn ? 'Guest' : 'زائر')
    : userRole === 'client'
    ? (isEn ? 'Client' : 'عميل')
    : userRole === 'provider'
    ? (isEn ? 'Provider' : 'مزود خدمة')
    : (isEn ? 'Guest' : 'زائر');

  // Override role label if admin
  const displayRoleLabel = isAdmin ? (isEn ? 'Admin' : 'مسؤول النظام') : roleLabel;

  const handleSectionClick = (section: MainSection) => {
    if (!section.guestAllowed) {
      setShowAppCTA(true);
      return;
    }
    // توجيه مباشر لصفحة الخدمات بدون overlay
    onNavigate(section.route);
    onClose();
  };

  const handleSubSectionClick = (subSection: SubSection) => {
    onNavigate(subSection.route);
    setShowServicesOverlay(false);
    onClose();
  };

  const handleViewAllServices = () => {
    onNavigate('/services');
    setShowServicesOverlay(false);
    onClose();
  };

  const handleClose = () => {
    setShowServicesOverlay(false);
    setShowAppCTA(false);
    onClose();
  };

  // ─── Admin Bootstrap Handler ───
  const handleBootstrapAdmin = async () => {
    if (isBootstrapping || !profile) return;
    setIsBootstrapping(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (!token) {
        toast.error(isEn ? 'Please log in first' : 'سجّل دخول أولاً');
        return;
      }
      const SERVER_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;
      const res = await fetch(`${SERVER_BASE}/admin/bootstrap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': token,
        },
      });
      const json = await res.json();
      if (res.ok && (json.success || json.message?.includes('already'))) {
        toast.success(isEn ? 'Admin activated!' : 'تم تفعيل صلاحيات الأدمن!');
        await refreshProfile();
      } else {
        toast.error(json.error || (isEn ? 'Failed to activate admin' : 'فشل تفعيل الأدمن'));
        console.error('Bootstrap error:', json);
      }
    } catch (err: any) {
      console.error('Bootstrap admin error:', err);
      toast.error(isEn ? 'Network error' : 'خطأ في الاتصال');
    } finally {
      setIsBootstrapping(false);
    }
  };

  const servicesSection = sectionsTree.find(s => s.id === 'services');

  // Filter: show guest-allowed only, exclude 'projects'
  const visibleSections = sectionsTree.filter(s => s.guestAllowed && s.id !== 'projects');

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-hidden flex flex-col ${
          theme.isDark ? 'bg-[var(--bait-surface)]' : 'bg-white'
        }`}
        dir="rtl"
      >
        {/* ═══ APP CTA OVERLAY ═══ */}
        <AnimatePresence>
          {showAppCTA && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white z-70 flex flex-col"
            >
              <div className="bg-white border-b border-[#E6DCC8] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowAppCTA(false)} className="p-1.5 hover:bg-[#F5EEE1] rounded-lg transition-colors">
                    <ArrowRight className="w-5 h-5 text-[#5D4037]" />
                  </button>
                  <h2 className="text-[#5D4037] font-bold text-lg" style={{ fontFamily }}>
                    {isEn ? 'App Features' : 'ميزات التطبيق'}
                  </h2>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-[#F5EEE1] rounded-lg transition-colors">
                  <X className="w-5 h-5 text-[#5D4037]" />
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#5D4037] rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-[#D4AF37]/20">
                  <Smartphone className="w-11 h-11 text-white" />
                </div>

                <h3 className="text-xl font-extrabold text-[#5D4037] mb-2" style={{ fontFamily }}>
                  {isEn ? 'Get the Full Experience' : 'احصل على التجربة الكاملة'}
                </h3>
                <p className="text-[#5D4037]/40 text-sm leading-relaxed mb-6" style={{ fontFamily }}>
                  {isEn
                    ? 'Download Beit Al Reef app to unlock projects, wallet, AI agent, CRM, and more.'
                    : 'حمّل تطبيق بيت الريف لفتح المشاريع، المحفظة، الوكيل الذكي، CRM، وأكثر.'}
                </p>

                {/* App-only features list */}
                <div className="w-full space-y-2 mb-6">
                  {[
                    { iconComp: FolderKanban, theme: 'indigo', ar: 'إدارة المشاريع', en: 'Project Management' },
                    { iconComp: Wallet, theme: 'gold', ar: 'محظة الدار', en: 'Dar Wallet' },
                    { iconComp: Bot, theme: 'amber', ar: 'وكيل ذكي متكامل', en: 'Full AI Agent' },
                    { iconComp: User, theme: 'blue', ar: 'ملف شخصي محترف', en: 'Professional Profile' },
                    { iconComp: BarChart3, theme: 'purple', ar: 'CRM والأتمتة', en: 'CRM & Automation' },
                  ].map((feat) => (
                    <div key={feat.en} className="flex items-center gap-3 bg-[#F5EEE1] px-4 py-2.5 rounded-xl">
                      <Icon3D icon={feat.iconComp} theme={feat.theme} size="xs" hoverable={false} />
                      <span className="text-sm font-bold text-[#5D4037]" style={{ fontFamily }}>
                        {isEn ? feat.en : feat.ar}
                      </span>
                    </div>
                  ))}
                </div>

                <button onClick={() => setShowAppCTA(false)}
                  className="w-full bg-[#F5EEE1] border border-[#D4AF37]/30 text-[#5D4037] py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
                  style={{ fontFamily }}>
                  {isEn ? 'Continue Browsing' : 'استمر في التصفح'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ MAIN DRAWER ═══ */}

        {/* Header */}
        <div className="bg-gradient-to-l from-[#D4AF37] to-[#5D4037] p-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg" style={{ fontFamily }}>
            {t('mainMenu')}
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Guest / User Card — REMOVED */}

        {/* Sections — all visible, no projects, no profile */}
        <div className="flex-1 overflow-y-auto p-2">
          <nav>
            {/* ═══ ADMIN PANEL LINK — only for admins ═══ */}
            {isAdmin && (
              <button
                onClick={() => { onNavigate('/admin'); onClose(); }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 mb-1 rounded-xl transition-all duration-200 border-[2px] ${
                  currentRoute === '/admin'
                    ? 'bg-gradient-to-l from-[#D4AF37]/20 to-[#FFD700]/10 border-[#D4AF37] text-[#D4AF37]'
                    : theme.isDark
                    ? 'bg-white/5 border-[#D4AF37]/30 hover:border-[#D4AF37]/60 text-[#FFD700]'
                    : 'bg-gradient-to-l from-[#FFF8E1] to-[#F5EEE1] border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#8B6914]'
                }`}
              >
                <div className="flex items-center gap-2 flex-1">
                  <Icon3D icon={Shield} theme="gold" size="sm" hoverable={false} />
                  <span className="font-bold text-xs" style={{ fontFamily }}>
                    {isEn ? 'Admin Panel' : 'لوحة التحكم'}
                  </span>
                </div>
                <ChevronLeft className="w-3.5 h-3.5 opacity-60" />
              </button>
            )}

            {/* ═══ DASHBOARD CONTROL PANEL ═══ */}
            <button
              onClick={() => {
                onNavigate('/dashboard');
                onClose();
              }}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 mb-1 rounded-xl transition-all duration-200 border-[2px] ${
                currentRoute === '/dashboard'
                  ? 'bg-gradient-to-l from-[#3B5BFE]/15 to-[#5A78FF]/10 border-[#3B5BFE] text-[#3B5BFE]'
                  : theme.isDark
                  ? 'bg-white/5 border-[#3B5BFE]/30 hover:border-[#3B5BFE]/60 text-[#5A78FF]'
                  : 'bg-gradient-to-l from-[#EEF2FF] to-[#F5EEE1] border-[#3B5BFE]/30 hover:border-[#3B5BFE] text-[#3B5BFE]'
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <Icon3D icon={LayoutDashboard} theme="blue" size="sm" hoverable={false} />
                <div className="text-right">
                  <span className="font-bold text-xs block" style={{ fontFamily }}>
                    {isEn ? 'Control Panel' : 'لوحة التحكم'}
                  </span>
                  <span className="text-[9px] opacity-50" style={{ fontFamily }}>
                    {isEn ? 'Build your dashboard with Weyaak' : 'أنشئ داشبوردك مع وياك'}
                  </span>
                </div>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 opacity-60" />
            </button>

            {visibleSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${ 
                  currentRoute === section.route
                    ? 'bg-[#D4AF37]/10 border-r-4 border-[#D4AF37] text-[#D4AF37]'
                    : theme.isDark
                    ? 'hover:bg-white/5 text-[var(--bait-text-secondary)]'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 flex-1">
                  {NAV_ICONS[section.id] ? (
                    <Icon3D
                      icon={NAV_ICONS[section.id].icon}
                      theme={NAV_ICONS[section.id].theme}
                      size="xs"
                      hoverable={false}
                    />
                  ) : (
                    <Icon3D icon={HomeIcon} theme="gold" size="xs" hoverable={false} />
                  )}
                  <span className="font-semibold text-xs" style={{ fontFamily }}>
                    {isEn ? section.nameEn : section.nameAr}
                  </span>
                </div>
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </nav>

          {/* ═══ QUICK ACTIONS — removed (موجودة في الملف الشخصي) ═══ */}
        </div>

        {/* Footer — Theme Toggle + Branding (بدون زر التحميل) */}
        <div className={`border-t p-3 ${
          theme.isDark ? 'border-[var(--bait-border-strong)] bg-[var(--bait-bg-alt)]' : 'border-gray-200 bg-[#F5EEE1]/30'
        }`}>
          {/* Branding + Theme Toggle side by side */}
          <div className="flex items-center gap-2">
            {/* Logo & Branding */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <img src={bietAlreefLogo} alt="بيت الريف" className="w-9 h-9 object-contain shrink-0" />
              <div className="min-w-0">
                <p className={`font-bold text-xs truncate ${theme.isDark ? 'text-[var(--bait-text)]' : 'text-[#5D4037]'}`} style={{ fontFamily }}>
                  {isEn ? 'Beit Al Reef' : 'بيت الريف'}
                </p>
                <p className={`text-[9px] truncate ${theme.isDark ? 'text-[var(--bait-text-muted)]' : 'text-gray-500'}`} style={{ fontFamily }}>
                  {isEn ? 'Smart Building Platform' : 'منصة البناء الذكي'}
                </p>
              </div>
            </div>

            {/* Compact Theme Toggle */}
            <div className={`flex items-center rounded-full p-0.5 shadow-sm shrink-0 ${
              theme.isDark ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-[#E6DCC8]'
            }`}>
              <button
                onClick={() => { if (theme.theme !== 'light') theme.toggleTheme(); }}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold transition-all duration-200 ${
                  theme.theme === 'light' ? 'bg-[#D4AF37] text-white shadow-md' : 'text-gray-400 hover:text-[#D4AF37]'
                }`}
                style={{ fontFamily }}
              >
                <Sun className="w-3 h-3" />
                {isEn ? 'Light' : 'فاتح'}
              </button>
              <button
                onClick={() => { if (theme.theme !== 'dark') theme.toggleTheme(); }}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold transition-all duration-200 ${
                  theme.theme === 'dark' ? 'bg-[#D4AF37] text-white shadow-md' : 'text-gray-400 hover:text-[#D4AF37]'
                }`}
                style={{ fontFamily }}
              >
                <Moon className="w-3 h-3" />
                {isEn ? 'Dark' : 'داكن'}
              </button>
            </div>
          </div>

          <p className="text-[9px] text-center text-gray-400 mt-2" style={{ fontFamily }}>
            {isEn ? '© 2025 All Rights Reserved' : '© 2025 جميع الحقوق محفوظة'}
          </p>
        </div>
      </div>
    </>
  );
}