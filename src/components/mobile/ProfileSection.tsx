import { 
  User, 
  Heart, 
  Clock, 
  Settings, 
  Headphones, 
  LogOut,
  FileText,
  ShoppingCart,
  Layers,
  MapPin,
  Receipt,
  MessageSquare,
  Shield,
  LayoutDashboard,
  Briefcase,
  Star,
  Gift,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// ====================================
// 📌 Types & Interfaces
// ====================================

type ProfileVariant = 'guest' | 'verified' | 'provider';

interface ProfileSectionProps {
  variant: ProfileVariant;
  userName?: string;
  userId?: string;
  avatarUrl?: string;
  onMenuItemClick?: (itemId: string) => void;
  onVerificationClick?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'danger';
}

// ====================================
// 🧩 Profile Menu Item Component
// ====================================

interface ProfileMenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}

function ProfileMenuItem({ icon, label, onClick, variant = 'default' }: ProfileMenuItemProps) {
  const isDanger = variant === 'danger';
  
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all hover:bg-[#F5EEE1] group ${
        isDanger ? 'hover:bg-red-50' : ''
      }`}
      dir="rtl"
    >
      <div className={`flex-shrink-0 ${isDanger ? 'text-red-500' : 'text-[#1F3D2B]'} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className={`flex-1 text-right ${isDanger ? 'text-red-500' : 'text-[#1F3D2B]'}`}>
        {label}
      </span>
      <svg
        className={`w-5 h-5 flex-shrink-0 ${isDanger ? 'text-red-400' : 'text-gray-400'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

// ====================================
// 🎨 Main ProfileSection Component
// ====================================

export function ProfileSection({
  variant,
  userName = 'مرحباً بك',
  userId = '#GUEST-0000',
  avatarUrl,
  onMenuItemClick,
  onVerificationClick,
}: ProfileSectionProps) {
  
  // ====================================
  // 📋 Menu Items Configuration
  // ====================================
  
  const guestMenuItems: MenuItem[] = [
    { id: 'favorites', label: 'المفضلة', icon: <Heart className="w-5 h-5" /> },
    { id: 'history', label: 'سجل التصفح', icon: <Clock className="w-5 h-5" /> },
    { id: 'settings', label: 'الإعدادات', icon: <Settings className="w-5 h-5" /> },
    { id: 'support', label: 'الدعم الفني', icon: <Headphones className="w-5 h-5" /> },
    { id: 'logout', label: 'تسجيل الخروج', icon: <LogOut className="w-5 h-5" />, variant: 'danger' },
  ];

  const verifiedMenuItems: MenuItem[] = [
    { id: 'my-info', label: 'معلوماتي', icon: <User className="w-5 h-5" /> },
    { id: 'orders', label: 'طلباتي', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'projects', label: 'مشاريعي', icon: <Layers className="w-5 h-5" /> },
    { id: 'addresses', label: 'العناوين', icon: <MapPin className="w-5 h-5" /> },
    { id: 'invoices', label: 'الفواتير', icon: <Receipt className="w-5 h-5" /> },
    { id: 'favorites', label: 'المفضلة', icon: <Heart className="w-5 h-5" /> },
    { id: 'complaints', label: 'الشكاوى والمقترحات', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'history', label: 'سجل التصفح', icon: <Clock className="w-5 h-5" /> },
    { id: 'settings', label: 'الإعدادات', icon: <Settings className="w-5 h-5" /> },
    { id: 'support', label: 'الدعم الفني', icon: <Headphones className="w-5 h-5" /> },
    { id: 'logout', label: 'تسجيل الخروج', icon: <LogOut className="w-5 h-5" />, variant: 'danger' },
  ];

  const providerMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'business-profile', label: 'ملف النشاط التجاري', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'customer-requests', label: 'طلبات العملاء', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'projects', label: 'مشاريعي', icon: <Layers className="w-5 h-5" /> },
    { id: 'invoices', label: 'الفواتير', icon: <Receipt className="w-5 h-5" /> },
    { id: 'reviews', label: 'تقييمات العملاء', icon: <Star className="w-5 h-5" /> },
    { id: 'offers', label: 'العروض', icon: <Gift className="w-5 h-5" /> },
    { id: 'library', label: 'مكتبتي', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'settings', label: 'الإعدادات', icon: <Settings className="w-5 h-5" /> },
    { id: 'support', label: 'الدعم الفني', icon: <Headphones className="w-5 h-5" /> },
    { id: 'logout', label: 'تسجيل الخروج', icon: <LogOut className="w-5 h-5" />, variant: 'danger' },
  ];

  // ====================================
  // 🎯 Get Current Menu Items
  // ====================================
  
  const getCurrentMenuItems = (): MenuItem[] => {
    switch (variant) {
      case 'guest':
        return guestMenuItems;
      case 'verified':
        return verifiedMenuItems;
      case 'provider':
        return providerMenuItems;
      default:
        return guestMenuItems;
    }
  };

  // ====================================
  // 🎨 Get Status Badge Config
  // ====================================
  
  const getStatusBadge = () => {
    switch (variant) {
      case 'guest':
        return {
          text: 'مستخدم زائر',
          bgColor: 'bg-[#BDBDBD]',
          textColor: 'text-white',
        };
      case 'verified':
        return {
          text: 'موثّق',
          bgColor: 'bg-[#D4AF37]',
          textColor: 'text-white',
        };
      case 'provider':
        return {
          text: 'مزود خدمة',
          bgColor: 'bg-[#4A90E2]',
          textColor: 'text-white',
        };
      default:
        return {
          text: 'مستخدم',
          bgColor: 'bg-gray-400',
          textColor: 'text-white',
        };
    }
  };

  const statusBadge = getStatusBadge();
  const menuItems = getCurrentMenuItems();

  // ====================================
  // 🖼️ Get Avatar Display
  // ====================================
  
  const getAvatarContent = () => {
    if (avatarUrl) {
      return (
        <ImageWithFallback
          src={avatarUrl}
          alt={userName}
          className="w-full h-full object-cover"
        />
      );
    }
    
    // Default avatar based on variant
    if (variant === 'guest') {
      return (
        <User className="w-10 h-10 text-gray-400" />
      );
    }
    
    if (variant === 'provider') {
      return (
        <Briefcase className="w-10 h-10 text-[#4A90E2]" />
      );
    }
    
    return (
      <User className="w-10 h-10 text-[#D4AF37]" />
    );
  };

  // ====================================
  // 🎯 Handle Menu Click
  // ====================================
  
  const handleMenuClick = (itemId: string) => {
    if (onMenuItemClick) {
      onMenuItemClick(itemId);
    }
  };

  // ====================================
  // 🎨 Render Component
  // ====================================
  
  return (
    <div
      className="w-full bg-white rounded-2xl p-5 flex flex-col gap-3"
      style={{
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
      }}
      dir="rtl"
    >
      {/* ====================================
          🎭 Header Section
          ==================================== */}
      
      <div className="flex items-center gap-4 mb-2">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F5EEE1] to-[#E5DED1] flex items-center justify-center flex-shrink-0 overflow-hidden border-4 border-white shadow-md">
          {getAvatarContent()}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-xl text-[#1A1A1A] mb-1">
            {userName}
          </h2>
          <p className="text-sm text-gray-500 mb-2">{userId}</p>
          
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${statusBadge.bgColor} ${statusBadge.textColor} text-xs`}>
            {variant === 'verified' && <CheckCircle className="w-3 h-3" />}
            {variant === 'provider' && <Shield className="w-3 h-3" />}
            <span>{statusBadge.text}</span>
          </div>
        </div>
      </div>

      {/* ====================================
          🔘 Verification Button (Guest Only)
          ==================================== */}
      
      {variant === 'guest' && (
        <button
          onClick={onVerificationClick}
          className="w-full bg-gradient-to-l from-[#4A90E2] to-[#56CCF2] text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          أكمل التوثيق
        </button>
      )}

      {/* ====================================
          ➖ Divider
          ==================================== */}
      
      <div className="w-full h-px bg-[#F5EEE1] my-2" />

      {/* ====================================
          📋 Menu Items List
          ==================================== */}
      
      <div className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <ProfileMenuItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            onClick={() => handleMenuClick(item.id)}
            variant={item.variant}
          />
        ))}
      </div>
    </div>
  );
}

// ====================================
// 📦 Export
// ====================================

export type { ProfileVariant, ProfileSectionProps };