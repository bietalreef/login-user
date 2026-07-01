/**
 * AdminLayout — RTL Sidebar + Topbar layout for admin dashboard
 */
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon3D } from '../ui/Icon3D';
import {
  LayoutGrid, Users, Zap, Settings, Shield,
  Moon, Sun, ChevronRight, ChevronLeft, Crown,
  Bell, Search, Home, Trash2, Briefcase, Bot,
} from 'lucide-react';
import { useNavigate } from 'react-router@7.1.1';

type AdminTab = 'dashboard' | 'users' | 'providers' | 'ai-assistant' | 'activity' | 'deletion-requests' | 'settings';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  adminName?: string;
  adminEmail?: string;
  children: React.ReactNode;
}

const NAV_ITEMS: { key: AdminTab; label: string; icon: any; theme: string }[] = [
  { key: 'dashboard', label: 'لوحة التحكم', icon: LayoutGrid, theme: 'blue' },
  { key: 'users', label: 'المستخدمون', icon: Users, theme: 'purple' },
  { key: 'providers', label: 'مزودو الخدمات', icon: Briefcase, theme: 'gold' },
  { key: 'ai-assistant', label: 'وياك AI', icon: Bot, theme: 'blue' },
  { key: 'activity', label: 'سجل الأنشطة', icon: Zap, theme: 'amber' },
  { key: 'deletion-requests', label: 'طلبات الحذف', icon: Trash2, theme: 'red' },
  { key: 'settings', label: 'الإعدادات', icon: Settings, theme: 'brown' },
];

export function AdminLayout({ activeTab, onTabChange, adminName, adminEmail, children }: AdminLayoutProps) {
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const cardClass = isDark
    ? 'bg-white/[0.13] backdrop-blur-xl border border-white/[0.18]'
    : 'bg-white border-[4px] border-gray-200/60';

  return (
    <div className="flex min-h-screen font-[Cairo]" dir="rtl"
         style={{ background: 'var(--bait-bg)' }}>

      {/* Sidebar */}
      <aside
        className={`${collapsed ? 'w-20' : 'w-64'} 
          transition-all duration-300 flex flex-col
          ${isDark
            ? 'bg-white/[0.08] backdrop-blur-xl border-l border-white/[0.12]'
            : 'bg-white border-l-[4px] border-gray-200/60'
          }`}
        style={{ minHeight: '100vh' }}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3">
          <Icon3D icon={Crown} theme="gold" size="md" hoverable={false} />
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold" style={{ color: 'var(--bait-text)' }}>
                بيت الريف
              </h1>
              <span className="text-xs" style={{ color: 'var(--bait-text-muted)' }}>
                لوحة الأدمن
              </span>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? isDark
                      ? 'bg-white/[0.15] border border-white/[0.20]'
                      : 'bg-gradient-to-l from-[#D4AF37]/10 to-[#FFD700]/10 border-[3px] border-[#D4AF37]/30'
                    : 'hover:bg-[var(--bait-surface-hover)]'
                  }`}
              >
                <Icon3D
                  icon={item.icon}
                  theme={isActive ? 'gold' : item.theme}
                  size="sm"
                  hoverable={false}
                />
                {!collapsed && (
                  <span className={`text-sm font-semibold transition-colors
                    ${isActive
                      ? isDark ? 'text-[#FFD700]' : 'text-[#5D4037]'
                      : ''
                    }`}
                    style={{ color: isActive ? undefined : 'var(--bait-text)' }}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Back to app */}
        <div className="px-3 pb-2">
          <button
            onClick={() => navigate('/home')}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl
              hover:bg-[var(--bait-surface-hover)] transition-all"
          >
            <Icon3D icon={Home} theme="blue" size="sm" hoverable={false} />
            {!collapsed && (
              <span className="text-sm" style={{ color: 'var(--bait-text-secondary)' }}>
                العودة للتطبيق
              </span>
            )}
          </button>
        </div>

        {/* Collapse Toggle */}
        <div className="px-3 pb-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center px-3 py-2 rounded-xl
              hover:bg-[var(--bait-surface-hover)] transition-all"
          >
            {collapsed
              ? <ChevronLeft size={18} style={{ color: 'var(--bait-text-muted)' }} />
              : <ChevronRight size={18} style={{ color: 'var(--bait-text-muted)' }} />
            }
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header
          className={`h-16 px-6 flex items-center justify-between
            ${isDark
              ? 'bg-white/[0.08] backdrop-blur-xl border-b border-white/[0.12]'
              : 'bg-white border-b-[4px] border-gray-200/60'
            }`}
        >
          {/* Search */}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl max-w-md flex-1
            ${isDark
              ? 'bg-white/[0.10] border border-white/[0.15]'
              : 'bg-[#F5EEE1]/50 border-[3px] border-gray-200/60'
            }`}>
            <Search size={18} style={{ color: 'var(--bait-text-muted)' }} />
            <input
              type="text"
              placeholder="بحث..."
              className="bg-transparent outline-none text-sm flex-1 font-[Cairo]"
              style={{ color: 'var(--bait-text)' }}
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all hover:scale-105
                ${isDark
                  ? 'bg-white/[0.10] hover:bg-white/[0.15]'
                  : 'bg-[#F5EEE1] hover:bg-[#EDE5D5]'
                }`}
            >
              {isDark
                ? <Sun size={18} color="#FFD700" />
                : <Moon size={18} style={{ color: 'var(--bait-text)' }} />
              }
            </button>

            {/* Notifications */}
            <button className={`p-2 rounded-xl transition-all hover:scale-105 relative
              ${isDark
                ? 'bg-white/[0.10] hover:bg-white/[0.15]'
                : 'bg-[#F5EEE1] hover:bg-[#EDE5D5]'
              }`}>
              <Bell size={18} style={{ color: 'var(--bait-text)' }} />
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#D4AF37] rounded-full border-2"
                   style={{ borderColor: isDark ? '#3B5BFE' : '#fff' }} />
            </button>

            {/* Admin info */}
            <div className="flex items-center gap-3 pr-3 border-r"
                 style={{ borderColor: 'var(--bait-border)' }}>
              <div className="text-left">
                <p className="text-sm font-bold" style={{ color: 'var(--bait-text)' }}>
                  {adminName || 'Admin'}
                </p>
                <p className="text-xs" style={{ color: 'var(--bait-text-muted)' }}>
                  {adminEmail || ''}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                ${isDark ? 'bg-gradient-to-br from-[#FFD700]/30 to-[#D4AF37]/30' : 'bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/20'}
                border-[3px] border-[#D4AF37]/30`}>
                <Shield size={18} color="#D4AF37" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}