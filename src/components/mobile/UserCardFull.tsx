import { 
  User, 
  Star, 
  CheckCircle, 
  Shield,
  Layers,
  ShoppingCart,
  Award,
  Clock,
  TrendingUp,
  FileText,
  Briefcase
} from 'lucide-react';
// FolderKanban not available — using Layers as alias
const FolderKanban = Layers;
// ShoppingBag not available — using ShoppingCart as alias
const ShoppingBag = ShoppingCart;
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { IDCopyBox } from './IDCopyBox';

// ====================================
// 📌 Types & Interfaces
// ====================================

type UserCardVariant = 'guest' | 'verified' | 'provider';
type UserRank = 'vip' | 'standard' | 'provider-pro';

interface UserStats {
  projectCount: number;
  orderCount: number;
  rating: number;
  reviewCount?: number;
}

interface ProviderInfo {
  businessName?: string;
  licenseNumber?: string;
  workCategory?: string;
  responseTime?: string;
  completionRate?: number;
}

interface UserCardFullProps {
  variant: UserCardVariant;
  userName?: string;
  userId?: string;
  avatarUrl?: string;
  rank?: UserRank;
  stats?: UserStats;
  providerInfo?: ProviderInfo;
  onActionClick?: () => void;
}

// ====================================
// 🎨 Full Profile Card Component
// ====================================

export function UserCardFull({
  variant,
  userName = 'مستخدم',
  userId = '#USER-0000',
  avatarUrl,
  rank = 'standard',
  stats = {
    projectCount: 0,
    orderCount: 0,
    rating: 0,
    reviewCount: 0,
  },
  providerInfo,
  onActionClick,
}: UserCardFullProps) {
  
  // ====================================
  // 🎯 Get Status Badge Config
  // ====================================
  
  const getStatusBadge = () => {
    switch (variant) {
      case 'guest':
        return {
          text: 'مستخدم زائر',
          bgColor: 'bg-[#BDBDBD]',
          textColor: 'text-white',
          icon: null,
        };
      case 'verified':
        return {
          text: 'موثّق',
          bgColor: 'bg-[#D4AF37]',
          textColor: 'text-white',
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case 'provider':
        return {
          text: 'مزود خدمة معتمد',
          bgColor: 'bg-[#4A90E2]',
          textColor: 'text-white',
          icon: <Shield className="w-4 h-4" />,
        };
      default:
        return {
          text: 'مستخدم',
          bgColor: 'bg-gray-400',
          textColor: 'text-white',
          icon: null,
        };
    }
  };

  // ====================================
  // 👑 Get Rank Badge Config
  // ====================================
  
  const getRankBadge = () => {
    switch (rank) {
      case 'vip':
        return {
          text: 'VIP',
          bgColor: 'bg-gradient-to-r from-[#C8A86A] to-[#D4AF37]',
          textColor: 'text-white',
          icon: <Award className="w-3 h-3" />,
        };
      case 'provider-pro':
        return {
          text: 'Provider Pro',
          bgColor: 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2]',
          textColor: 'text-white',
          icon: <Star className="w-3 h-3" />,
        };
      case 'standard':
      default:
        return {
          text: 'عضو',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          icon: null,
        };
    }
  };

  // ====================================
  // 🖼️ Get Avatar Content
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
    
    // Default avatar icon based on variant
    const iconClass = "w-12 h-12";
    
    if (variant === 'guest') {
      return <User className={`${iconClass} text-gray-400`} />;
    }
    
    if (variant === 'provider') {
      return <Briefcase className={`${iconClass} text-[#4A90E2]`} />;
    }
    
    return <User className={`${iconClass} text-[#D4AF37]`} />;
  };

  // ====================================
  // 🎯 Get CTA Button
  // ====================================
  
  const getCTAButton = () => {
    switch (variant) {
      case 'guest':
        return {
          text: 'أكمل التوثيق',
          bgColor: 'bg-gradient-to-l from-[#4A90E2] to-[#56CCF2]',
          textColor: 'text-white',
        };
      
      case 'verified':
        return {
          text: 'تعديل الملف الشخصي',
          bgColor: 'bg-gradient-to-l from-[#D4AF37] to-[#1F3D2B]',
          textColor: 'text-white',
        };
      
      case 'provider':
        return {
          text: 'زيارة صفحة المزود',
          bgColor: 'bg-gradient-to-l from-[#4A90E2] to-[#56CCF2]',
          textColor: 'text-white',
        };
      
      default:
        return {
          text: 'عرض الملف',
          bgColor: 'bg-gray-500',
          textColor: 'text-white',
        };
    }
  };

  const statusBadge = getStatusBadge();
  const rankBadge = getRankBadge();
  const ctaButton = getCTAButton();

  // ====================================
  // 🎨 Render Component
  // ====================================
  
  return (
    <div
      className="w-full min-h-[240px] bg-white rounded-[20px] p-5 flex flex-col gap-4"
      style={{
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
      }}
      dir="rtl"
    >
      {/* ====================================
          🎭 Header Section (Avatar + Info)
          ==================================== */}
      
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-25 h-25 rounded-full bg-gradient-to-br from-[#F5EEE1] to-[#E5DED1] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
          {getAvatarContent()}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl text-[#1A1A1A] mb-1 truncate">
            {userName}
          </h2>
          
          {/* ID Copy Box */}
          <div className="mb-2">
            <IDCopyBox id={userId} />
          </div>
          
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusBadge.bgColor} ${statusBadge.textColor} text-xs mb-2`}>
            {statusBadge.icon}
            <span>{statusBadge.text}</span>
          </div>
          
          {/* Rank Badge */}
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${rankBadge.bgColor} ${rankBadge.textColor} text-xs`}>
            {rankBadge.icon}
            <span>{rankBadge.text}</span>
          </div>
        </div>
      </div>

      {/* ====================================
          📊 Stats Section
          ==================================== */}
      
      {variant !== 'guest' && (
        <div className="grid grid-cols-3 gap-3">
          {/* Projects */}
          <div className="bg-[#F5EEE1] rounded-xl p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <FolderKanban className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="text-lg font-bold text-[#1F3D2B]">{stats.projectCount}</div>
            <div className="text-xs text-gray-600">مشروع</div>
          </div>

          {/* Orders */}
          <div className="bg-[#F5EEE1] rounded-xl p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <ShoppingBag className="w-5 h-5 text-[#4A90E2]" />
            </div>
            <div className="text-lg font-bold text-[#1F3D2B]">{stats.orderCount}</div>
            <div className="text-xs text-gray-600">طلب</div>
          </div>

          {/* Rating */}
          <div className="bg-[#F5EEE1] rounded-xl p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="w-5 h-5 fill-[#C8A86A] text-[#C8A86A]" />
            </div>
            <div className="text-lg font-bold text-[#1F3D2B]">{stats.rating.toFixed(1)}</div>
            <div className="text-xs text-gray-600">
              {stats.reviewCount ? `${stats.reviewCount} تقييم` : 'تقييم'}
            </div>
          </div>
        </div>
      )}

      {/* ====================================
          🏢 Provider Additional Info
          ==================================== */}
      
      {variant === 'provider' && providerInfo && (
        <div className="bg-gradient-to-l from-[#4A90E2]/5 to-[#56CCF2]/5 rounded-xl p-4 space-y-3">
          {/* Business Name */}
          {providerInfo.businessName && (
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#4A90E2] flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">اسم النشاط التجاري</div>
                <div className="text-sm font-semibold text-[#1F3D2B]">{providerInfo.businessName}</div>
              </div>
            </div>
          )}

          {/* License Number */}
          {providerInfo.licenseNumber && (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">رقم الرخصة</div>
                <div className="text-sm font-semibold text-[#1F3D2B]">{providerInfo.licenseNumber}</div>
              </div>
            </div>
          )}

          {/* Work Category */}
          {providerInfo.workCategory && (
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C8A86A] flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">التخصص</div>
                <div className="text-sm font-semibold text-[#1F3D2B]">{providerInfo.workCategory}</div>
              </div>
            </div>
          )}

          {/* Response Time & Completion Rate */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
            {providerInfo.responseTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F2994A] flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">وقت الاستجابة</div>
                  <div className="text-sm font-semibold text-[#1F3D2B]">{providerInfo.responseTime}</div>
                </div>
              </div>
            )}

            {providerInfo.completionRate !== undefined && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#27AE60] flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">معدل الإنجاز</div>
                  <div className="text-sm font-semibold text-[#1F3D2B]">{providerInfo.completionRate}%</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================
          🔘 CTA Button
          ==================================== */}
      
      <button
        onClick={onActionClick}
        className={`w-full ${ctaButton.bgColor} ${ctaButton.textColor} py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all`}
      >
        {ctaButton.text}
      </button>
    </div>
  );
}

// ====================================
// 📦 Export Types
// ====================================

export type { UserCardVariant, UserRank, UserStats, ProviderInfo, UserCardFullProps };