import { useState } from 'react';
import {
  Star, Shield, CheckCircle, MapPin, Clock,
  MessageCircle, Share2, Wrench, Phone,
  Award, Briefcase, ChevronLeft, UserPlus
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';

/* ═══════════════════════════════════════════════
   WhatsApp Helper — فتح محادثة واتساب مع المزود
   ═══════════════════════════════════════════════ */
function openWhatsApp(phone: string, providerName: string, isEn: boolean) {
  // Clean phone number (remove spaces, dashes, etc.)
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  const message = isEn
    ? `Hello ${providerName}, I found you on Beit Al Reef platform and I'm interested in your services. Can we discuss the details?`
    : `مرحباً ${providerName}، وجدتك عبر منصة بيت الريف وأنا مهتم بخدماتك. هل يمكننا مناقشة التفاصيل؟`;
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
}

// ──────────────────────────────────────────
// Provider Profile Card (individual)
// ──────────────────────────────────────────
interface ProviderProfileCardProps {
  provider: {
    id: string;
    name: string;
    specialty: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    location: string;
    isVerified: boolean;
    experience: string;
    completedProjects: number;
    status: 'online' | 'busy' | 'offline';
    hourlyRate: number;
    phone?: string;
  };
  onContact?: (id: string) => void;
  onViewProfile?: (id: string) => void;
}

export function ProviderProfileCard({ provider, onContact, onViewProfile }: ProviderProfileCardProps) {
  const { language } = useTranslation('services');
  const { isDark } = useTheme();
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif';
  const [isFriend, setIsFriend] = useState(false);

  const getProviderType = () => {
    if (provider.isVerified) {
      return isEn ? 'Verified Provider' : 'مزود موثق';
    }
    return isEn ? 'Unverified' : 'غير موثق';
  };

  const handleContact = () => {
    if (provider.phone) {
      openWhatsApp(provider.phone, provider.name, isEn);
    }
    onContact?.(provider.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl shadow-md overflow-hidden transition-all border-[4px] ${
        isDark
          ? 'bg-[var(--bait-surface)] border-[var(--bait-border-strong)]'
          : 'bg-white border-gray-200/60'
      }`}
    >
      <div className="flex">
        {/* Image */}
        <div className="relative w-[130px] flex-shrink-0">
          <ImageWithFallback
            src={provider.avatar}
            alt={provider.name}
            className="w-full h-full object-cover min-h-[160px]"
          />
          {provider.isVerified && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, delay: 0.2 }}
              className="absolute top-2 right-2 w-7 h-7 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-full flex items-center justify-center shadow-lg ring-2 ring-white"
            >
              <CheckCircle className="w-4 h-4 text-white" />
            </motion.div>
          )}
          {/* Status indicator */}
          <div className="absolute bottom-2 right-2">
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold backdrop-blur-sm ${
              provider.status === 'online' ? 'bg-[#D4AF37]/90 text-white' :
              provider.status === 'busy' ? 'bg-amber-500/90 text-white' :
              'bg-gray-500/90 text-white'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                provider.status === 'online' ? 'bg-white animate-pulse' :
                provider.status === 'busy' ? 'bg-white' : 'bg-white/60'
              }`} />
              {provider.status === 'online' ? (isEn ? 'Online' : 'متصل') :
               provider.status === 'busy' ? (isEn ? 'Busy' : 'مشغول') :
               (isEn ? 'Offline' : 'غير متصل')}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className={`font-bold text-[15px] mb-1 ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1A1A1A]'}`} style={{ fontFamily }}>
            {provider.name}
          </h3>
          <p className={`text-xs mb-2 ${isDark ? 'text-[var(--bait-text-secondary)]' : 'text-[#1A1A1A]/60'}`} style={{ fontFamily }}>
            {provider.specialty}
          </p>

          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#C8A86A] text-[#C8A86A]" />
              <span className={`text-xs font-bold ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1A1A1A]'}`}>{provider.rating}</span>
              <span className={`text-[10px] ${isDark ? 'text-[var(--bait-text-muted)]' : 'text-[#1A1A1A]/40'}`}>({provider.reviewCount})</span>
            </div>
            {provider.isVerified && (
              <CheckCircle className="w-3.5 h-3.5 text-[#4A90E2]" />
            )}
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#4A90E2]" />
              <span className={`text-[10px] ${isDark ? 'text-[var(--bait-text-secondary)]' : 'text-[#1A1A1A]/60'}`}>{provider.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-[#C8A86A]" />
              <span className={`text-[10px] ${isDark ? 'text-[var(--bait-text-secondary)]' : 'text-[#1A1A1A]/60'}`}>{provider.experience}</span>
            </div>
            <div className="flex items-center gap-1">
              <Wrench className="w-3 h-3 text-[#F2994A]" />
              <span className={`text-[10px] ${isDark ? 'text-[var(--bait-text-secondary)]' : 'text-[#1A1A1A]/60'}`}>{provider.completedProjects} {isEn ? 'projects' : 'مشروع'}</span>
            </div>
          </div>

          {/* Verification Type Badge */}
          <div className="mb-3">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${
              provider.isVerified 
                ? 'bg-[#4A90E2]/10 text-[#4A90E2]' 
                : 'bg-[#F2994A]/10 text-[#F2994A]'
            }`} style={{ fontFamily }}>
              {provider.isVerified && <CheckCircle className="w-3 h-3" />}
              {getProviderType()}
            </span>
          </div>

          {/* Price + WhatsApp + Add Friend */}
          <div className="mt-auto flex items-center gap-2">
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#C8A86A] text-white px-3 py-1.5 rounded-xl text-xs font-bold">
              {provider.hourlyRate} {isEn ? 'AED' : 'د.إ'}
            </div>
            <motion.button
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleContact}
              className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all border-[2px] border-[#25D366]/30"
              style={{ fontFamily }}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {isEn ? 'WhatsApp' : 'واتساب'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsFriend(!isFriend)}
              className={`flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border-[2px] ${
                isFriend
                  ? 'bg-[#3B5BFE] text-white border-[#3B5BFE]/30'
                  : 'bg-[#F5EEE1] text-[#2C1810] border-gray-200/60 hover:bg-[#3B5BFE]/10 hover:border-[#3B5BFE]/30'
              }`}
              style={{ fontFamily }}
            >
              <UserPlus className="w-3.5 h-3.5" />
              {isFriend ? (isEn ? 'Friend' : 'صديق') : (isEn ? 'Add' : 'أضف')}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────
// Providers Tab Content (used in service detail pages)
// ──────────────────────────────────────────
export function ProvidersTabContent() {
  const { language } = useTranslation('services');
  const { isDark } = useTheme();
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif';

  // Demo providers data — with UAE phone numbers
  const providers = [
    {
      id: 'prov-1',
      name: isEn ? 'Ahmed Al Hammadi' : 'أحمد الحمادي',
      specialty: isEn ? 'General Contractor' : 'مقاول عام',
      avatar: 'https://images.unsplash.com/photo-1659353587484-a83a0ddf8aca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      rating: 4.9,
      reviewCount: 156,
      location: isEn ? 'Dubai' : 'دبي',
      isVerified: true,
      experience: isEn ? '15 years' : '15 سنة',
      completedProjects: 234,
      status: 'online' as const,
      hourlyRate: 150,
      phone: '971501234567',
    },
    {
      id: 'prov-2',
      name: isEn ? 'Al Noor Engineering' : 'النور للهندسة',
      specialty: isEn ? 'Engineering Consultancy' : 'استشارات هندسية',
      avatar: 'https://images.unsplash.com/photo-1606309028742-4039c7b625b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      rating: 5.0,
      reviewCount: 89,
      location: isEn ? 'Abu Dhabi' : 'أبوظبي',
      isVerified: true,
      experience: isEn ? '20 years' : '20 سنة',
      completedProjects: 456,
      status: 'online' as const,
      hourlyRate: 200,
      phone: '971502345678',
    },
    {
      id: 'prov-3',
      name: isEn ? 'Khalid Contracting' : 'خالد للمقاولات',
      specialty: isEn ? 'Building & Renovation' : 'بناء وترميم',
      avatar: 'https://images.unsplash.com/photo-1748640857973-93524ef0fe7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      rating: 4.7,
      reviewCount: 67,
      location: isEn ? 'Sharjah' : 'الشارقة',
      isVerified: false,
      experience: isEn ? '8 years' : '8 سنوات',
      completedProjects: 98,
      status: 'busy' as const,
      hourlyRate: 120,
      phone: '971503456789',
    },
    {
      id: 'prov-4',
      name: isEn ? 'Al Waha Maintenance' : 'الواحة للصيانة',
      specialty: isEn ? 'Maintenance & Repair' : 'صيانة وإصلاح',
      avatar: 'https://images.unsplash.com/photo-1651596082386-f83cfa746e64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      rating: 4.8,
      reviewCount: 112,
      location: isEn ? 'Ajman' : 'عجمان',
      isVerified: true,
      experience: isEn ? '12 years' : '12 سنة',
      completedProjects: 178,
      status: 'online' as const,
      hourlyRate: 180,
      phone: '971504567890',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-bold text-lg ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`} style={{ fontFamily }}>
          {isEn ? 'Available Providers' : 'المزودون المتاحون'}
        </h3>
        <div className="flex items-center gap-1 bg-[#D4AF37]/10 px-3 py-1 rounded-full">
          <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[#D4AF37] text-xs font-bold" style={{ fontFamily }}>
            {providers.filter(p => p.isVerified).length} {isEn ? 'verified' : 'موثق'}
          </span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={`flex items-center gap-4 rounded-2xl p-3 mb-4 ${
        isDark
          ? 'bg-gradient-to-l from-[var(--bait-surface)] to-[var(--bait-bg-alt)]'
          : 'bg-gradient-to-l from-[#F5EEE1] to-white'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#4A90E2]/10 rounded-xl flex items-center justify-center">
            <Award className="w-4 h-4 text-[#4A90E2]" />
          </div>
          <div>
            <p className={`text-xs font-bold ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1A1A1A]'}`}>{providers.length}+</p>
            <p className={`text-[10px] ${isDark ? 'text-[var(--bait-text-muted)]' : 'text-[#1A1A1A]/40'}`}>{isEn ? 'Providers' : 'مزود'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#C8A86A]/10 rounded-xl flex items-center justify-center">
            <Star className="w-4 h-4 text-[#C8A86A]" />
          </div>
          <div>
            <p className={`text-xs font-bold ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1A1A1A]'}`}>4.8</p>
            <p className={`text-[10px] ${isDark ? 'text-[var(--bait-text-muted)]' : 'text-[#1A1A1A]/40'}`}>{isEn ? 'Avg Rating' : 'متوسط التقييم'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F2994A]/10 rounded-xl flex items-center justify-center">
            <Clock className="w-4 h-4 text-[#F2994A]" />
          </div>
          <div>
            <p className={`text-xs font-bold ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1A1A1A]'}`}>{isEn ? '< 2hrs' : '< ساعتين'}</p>
            <p className={`text-[10px] ${isDark ? 'text-[var(--bait-text-muted)]' : 'text-[#1A1A1A]/40'}`}>{isEn ? 'Response' : 'استجابة'}</p>
          </div>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid gap-4">
        {providers.map((provider, idx) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
          >
            <ProviderProfileCard provider={provider} />
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
          isDark
            ? 'bg-[var(--bait-surface)] text-[var(--bait-text)] hover:bg-[var(--bait-surface-hover)]'
            : 'bg-[#F5EEE1] text-[#1F3D2B] hover:bg-[#E8DFD0]'
        }`}
        style={{ fontFamily }}
      >
        {isEn ? 'View More Providers' : 'عرض المزيد من المزودين'}
        <ChevronLeft className="w-4 h-4" />
      </motion.button>
    </div>
  );
}