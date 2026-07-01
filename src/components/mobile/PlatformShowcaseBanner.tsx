import { useState } from 'react';
import { useNavigate } from 'react-router@7.1.1';
import {
  Award, ChevronLeft, Shield, Video, Wallet as WalletIcon,
  Sparkles, Eye, Download, Star, Zap, BarChart3, Users,
  Cpu, MessageCircle, Layers, Camera, MapPin,
  CheckCircle, Smartphone
} from 'lucide-react';
// Crown & Bot not available — using safe aliases
const Crown = Award;
const Bot = Cpu;
// FolderKanban not available — using Layers as alias
const FolderKanban = Layers;
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../contexts/LanguageContext';
import { Icon3D } from '../ui/Icon3D';
import { useTheme } from '../../contexts/ThemeContext';

const fontCairo = 'Cairo, sans-serif';

interface PlatformShowcaseBannerProps {
  variant?: 'full' | 'compact' | 'mini';
  className?: string;
}

export function PlatformShowcaseBanner({ variant = 'full', className = '' }: PlatformShowcaseBannerProps) {
  const navigate = useNavigate();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const { isDark } = useTheme();
  const [activeFeature, setActiveFeature] = useState(0);

  if (variant === 'mini') {
    return (
      <div className={`px-5 ${className}`}>
        <button
          onClick={() => navigate('/platform')}
          className={`w-full rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden border-[4px] ${
            isDark
              ? 'bg-[#1a1d24] border-gray-700/60'
              : 'bg-white border-gray-200/60'
          }`}
        >
          <div className="absolute top-0 left-0 w-16 h-16 bg-[#D4AF37]/8 rounded-full blur-xl" />
          <div className="relative flex items-center gap-3">
            <Icon3D icon={Sparkles} theme="gold" size="sm" hoverable={false} />
            <div className="flex-1 text-right">
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#1C1710]'}`} style={{ fontFamily: fontCairo }}>
                {isEn ? 'Explore Features' : 'اكتشف المميزات'}
              </h3>
              <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-[#1C1710]/40'}`} style={{ fontFamily: fontCairo }}>
                {isEn ? 'AI + Projects + Wallet' : 'ذكاء اصطناعي + مشاريع + محفظة'}
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 text-[#D4AF37] group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`px-5 ${className}`}>
        <button
          onClick={() => navigate('/platform')}
          className={`w-full rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden border-[4px] ${
            isDark
              ? 'bg-[#1a1d24] border-gray-700/60'
              : 'bg-white border-gray-200/60'
          }`}
        >
          <div className="absolute top-0 left-0 w-24 h-24 bg-[#D4AF37]/8 rounded-full blur-2xl group-hover:bg-[#D4AF37]/12 transition-all" />
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#C8A86A]/8 rounded-full blur-2xl" />
          
          <div className="relative flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#1C1710] rounded-2xl flex items-center justify-center shadow-lg">
                <div className="grid grid-cols-2 gap-1">
                  <Video className="w-4 h-4 text-white/80" />
                  <FolderKanban className="w-4 h-4 text-white/80" />
                  <WalletIcon className="w-4 h-4 text-[#FFD700]" />
                  <Shield className="w-4 h-4 text-white/80" />
                </div>
              </div>
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <Crown className="w-4 h-4 text-[#D4AF37]" />
                <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-[#1C1710]'}`} style={{ fontFamily: fontCairo }}>
                  {isEn ? 'Explore Beit Al Reef Features' : 'اكتشف مميزات بيت الريف'}
                </h3>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#1C1710]/50'}`} style={{ fontFamily: fontCairo }}>
                {isEn
                  ? 'AI Video Creator + Project Management + Financial Center + Verification & more'
                  : 'AI Video Creator + إدارة مشاريع + مركز مالي + نظام توثيق وأكثر'
                }
              </p>
            </div>
            <ChevronLeft className="w-5 h-5 text-[#D4AF37] flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // FULL VARIANT — Premium App Guide Card
  // ═══════════════════════════════════════════

  const appFeatures = [
    {
      icon: Bot,
      theme: 'purple',
      title: isEn ? 'Weyaak AI Assistant' : 'مساعد وياك الذكي',
      desc: isEn ? 'AI-powered smart assistant for project planning, cost estimation, and decision support' : 'مساعد ذكي بالذكاء الاصطناعي لتخطيط المشاريع وتقدير التكاليف ودعم القرارات',
      badge: isEn ? 'AI' : 'ذكاء',
    },
    {
      icon: FolderKanban,
      theme: 'green',
      title: isEn ? 'Project Management' : 'إدارة المشاريع',
      desc: isEn ? 'Track progress, manage timelines, daily logs with photo documentation' : 'تتبع التقدم، إدارة الجداول الزمنية، سجلات يومية بتوثيق الصور',
      badge: isEn ? 'Pro' : 'احترافي',
    },
    {
      icon: WalletIcon,
      theme: 'gold',
      title: isEn ? 'Financial Center' : 'المركز المالي',
      desc: isEn ? 'Revenue analytics, expense tracking, profit forecasting & Dar Coins rewards' : 'تحليل الإيرادات، تتبع المصروفات، توقعات الأرباح ومكافآت كوينز الدار',
      badge: isEn ? 'Finance' : 'مالي',
    },
    {
      icon: Video,
      theme: 'pink',
      title: isEn ? 'AI Video Creator' : 'صانع الفيديو الذكي',
      desc: isEn ? 'Create professional marketing videos for your services with one click' : 'أنشئ فيديوهات تسويقية احترافية لخدماتك بضغطة واحدة',
      badge: isEn ? 'Exclusive' : 'حصري',
    },
    {
      icon: Users,
      theme: 'blue',
      title: isEn ? 'Team Management' : 'إدارة الفريق',
      desc: isEn ? 'Worker registry, shift scheduling, performance reviews & communication' : 'سجل العمال، جدولة الورديات، تقييم الأداء والتواصل',
      badge: isEn ? 'Team' : 'فريق',
    },
    {
      icon: Shield,
      theme: 'emerald',
      title: isEn ? 'Verification System' : 'نظام التوثيق',
      desc: isEn ? 'Identity verification, trust badges, quality assessment & escrow protection' : 'توثيق الهوية، شارات الموثوقية، تقييم الجودة وحماية المعاملات',
      badge: isEn ? 'Security' : 'أمان',
    },
  ];

  const platformStats = [
    { value: '50+', label: isEn ? 'Smart Tools' : 'أداة ذكية', icon: Sparkles, theme: 'purple' },
    { value: '2,500+', label: isEn ? 'Providers' : 'مزود خدمة', icon: Users, theme: 'blue' },
    { value: '15K+', label: isEn ? 'Projects' : 'مشروع منجز', icon: FolderKanban, theme: 'green' },
    { value: '4.8', label: isEn ? 'Rating' : 'تقييم', icon: Star, theme: 'gold' },
  ];

  const appOnlyHighlights = [
    { icon: Video, theme: 'pink', text: isEn ? 'AI Video Creator' : 'صانع الفيديو' },
    { icon: BarChart3, theme: 'teal', text: isEn ? 'Analytics' : 'تحليلات' },
    { icon: Camera, theme: 'orange', text: isEn ? 'Photo Docs' : 'توثيق بالصور' },
    { icon: Layers, theme: 'indigo', text: isEn ? 'AR/3D View' : 'عرض AR/3D' },
    { icon: MessageCircle, theme: 'cyan', text: isEn ? 'Voice Rooms' : 'غرف صوتية' },
    { icon: MapPin, theme: 'red', text: isEn ? 'Live Maps' : 'خرائط حية' },
  ];

  return (
    <div className={`px-4 pb-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* ─── Main Card Container ─── */}
        <div className={`rounded-3xl overflow-hidden shadow-xl border-[4px] ${
          isDark ? 'border-gray-700/60' : 'border-gray-200/60'
        }`}>

          {/* ─── Hero Section ─── */}
          <div className="relative bg-gradient-to-bl from-[#1C1710] via-[#181510] to-[#0F0D08] p-6 pb-8 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C8A86A]/8 rounded-full blur-3xl" />
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.04]">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="showcaseGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#showcaseGrid)" />
              </svg>
            </div>
            {/* Top gold accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-[#C8A86A] via-[#D4AF37] to-[#C8A86A]" />

            <div className="relative z-10">
              {/* Platform badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-4"
              >
                <div className="bg-white/10 backdrop-blur-md border border-[#D4AF37]/20 rounded-full px-3 py-1.5 flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-md flex items-center justify-center">
                    <Smartphone className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[#D4AF37] text-[10px] font-bold" style={{ fontFamily: fontCairo }}>
                    {isEn ? 'MOBILE APP GUIDE' : 'دليل تطبيق المتجر'}
                  </span>
                </div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-white text-2xl font-black mb-2 leading-tight" style={{ fontFamily: fontCairo }}>
                  {isEn ? 'Discover' : 'اكتشف'}
                  {' '}
                  <span className="bg-gradient-to-l from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
                    {isEn ? 'Beit Al Reef' : 'بيت الريف'}
                  </span>
                </h2>
                <p className="text-white/50 text-xs leading-relaxed max-w-[85%]" style={{ fontFamily: fontCairo }}>
                  {isEn
                    ? 'The complete platform for construction & finishing — AI tools, project management, financial center and more'
                    : 'المنصة المتكاملة للبناء والتشطيب — أدوات ذكاء اصطناعي، إدارة مشاريع، مركز مالي وأكثر'
                  }
                </p>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-2 mt-5"
              >
                {platformStats.map((stat, idx) => (
                  <div key={idx} className="flex-1 bg-white/[0.07] backdrop-blur-sm border border-[#D4AF37]/10 rounded-2xl py-2.5 px-2 text-center">
                    <div className="flex justify-center mb-1.5">
                      <Icon3D icon={stat.icon} theme={stat.theme} size="xs" hoverable={false} />
                    </div>
                    <div className="text-white text-sm font-black" style={{ fontFamily: fontCairo }}>{stat.value}</div>
                    <div className="text-white/30 text-[8px] font-semibold" style={{ fontFamily: fontCairo }}>{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ─── App-Only Highlights Ribbon ─── */}
          <div className={`px-5 py-4 ${isDark ? 'bg-[#1e2128]' : 'bg-white'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#1C1710]'}`} style={{ fontFamily: fontCairo }}>
                {isEn ? 'Exclusive App Features' : 'مميزات حصرية في التطبيق'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {appOnlyHighlights.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className={`rounded-xl p-2.5 text-center border-[2px] ${
                    isDark
                      ? 'bg-[#1a1d24] border-gray-700/60'
                      : 'bg-[#F5EEE1]/40 border-gray-200/60'
                  }`}
                >
                  <div className="flex justify-center mb-1.5">
                    <Icon3D icon={item.icon} theme={item.theme} size="xs" hoverable={false} />
                  </div>
                  <span className={`text-[9px] font-bold leading-tight block ${isDark ? 'text-gray-300' : 'text-[#1C1710]/70'}`} style={{ fontFamily: fontCairo }}>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ─── Feature Cards (Interactive) ─── */}
          <div className={`px-5 py-4 ${isDark ? 'bg-[#1a1d24]' : 'bg-[#F5EEE1]/30'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Icon3D icon={Layers} theme="indigo" size="xs" hoverable={false} />
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#1C1710]'}`} style={{ fontFamily: fontCairo }}>
                {isEn ? 'Platform Capabilities' : 'إمكانيات المنصة'}
              </span>
            </div>

            {/* Feature tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide mb-3">
              {appFeatures.map((feature, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFeature(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border-[2px] ${
                    activeFeature === idx
                      ? isDark
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40'
                        : 'bg-[#D4AF37]/10 text-[#B8940E] border-[#D4AF37]/30'
                      : isDark
                        ? 'bg-[#1e2128] text-gray-400 border-gray-700/60'
                        : 'bg-white text-gray-500 border-gray-200/60'
                  }`}
                  style={{ fontFamily: fontCairo }}
                >
                  <Icon3D icon={feature.icon} theme={feature.theme} size="xs" hoverable={false} as="span" />
                  {feature.badge}
                </button>
              ))}
            </div>

            {/* Active feature detail */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className={`rounded-2xl p-4 border-[4px] ${
                  isDark
                    ? 'bg-[#1e2128] border-gray-700/60'
                    : 'bg-white border-gray-200/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon3D icon={appFeatures[activeFeature].icon} theme={appFeatures[activeFeature].theme} size="md" hoverable={false} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1C1710]'}`} style={{ fontFamily: fontCairo }}>
                        {appFeatures[activeFeature].title}
                      </h4>
                      <span className="bg-gradient-to-l from-[#D4AF37] to-[#B8940E] text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                        {appFeatures[activeFeature].badge}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontFamily: fontCairo }}>
                      {appFeatures[activeFeature].desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─── Browser vs App Comparison ─── */}
          <div className={`px-5 py-4 ${isDark ? 'bg-[#1e2128]' : 'bg-white'}`}>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Browser */}
              <div className={`rounded-2xl p-3 border-[2px] ${
                isDark ? 'bg-[#1a1d24] border-gray-700/60' : 'bg-gray-50 border-gray-200/60'
              }`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-5 h-5 bg-gray-200 rounded-md flex items-center justify-center">
                    <Eye className="w-3 h-3 text-gray-500" />
                  </div>
                  <span className={`text-[10px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontFamily: fontCairo }}>
                    {isEn ? 'Browser' : 'المتصفح'}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {[
                    isEn ? 'Browse services' : 'تصفح الخدمات',
                    isEn ? 'View providers' : 'عرض المزودين',
                    isEn ? 'Read reviews' : 'قراءة التقييمات',
                    isEn ? 'Contact providers' : 'التواصل المباشر',
                  ].map((f, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className={`text-[9px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`} style={{ fontFamily: fontCairo }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* App */}
              <div className="rounded-2xl p-3 border-2 border-[#D4AF37]/30 bg-gradient-to-b from-[#D4AF37]/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-l from-[#D4AF37] to-[#FFD700]" />
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-5 h-5 bg-[#D4AF37]/15 rounded-md flex items-center justify-center">
                    <Smartphone className="w-3 h-3 text-[#D4AF37]" />
                  </div>
                  <span className="text-[10px] font-bold text-[#D4AF37]" style={{ fontFamily: fontCairo }}>
                    {isEn ? 'Mobile App' : 'التطبيق'}
                  </span>
                  <Crown className="w-3 h-3 text-[#D4AF37]" />
                </div>
                <div className="space-y-1.5">
                  {[
                    isEn ? 'All browser features +' : 'كل مميزات المتصفح +',
                    isEn ? 'AI Video Creator' : 'صانع الفيديو الذكي',
                    isEn ? 'Project management' : 'إدارة المشاريع',
                    isEn ? 'Financial center' : 'المركز المالي',
                    isEn ? 'Team management' : 'إدارة الفريق',
                    isEn ? 'Dar Coins rewards' : 'كوينز الدار',
                  ].map((f, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle className={`w-3 h-3 flex-shrink-0 ${idx === 0 ? 'text-[#FFD700]' : 'text-[#D4AF37]'}`} />
                      <span className={`text-[9px] ${idx === 0 ? 'text-[#D4AF37] font-bold' : isDark ? 'text-gray-300' : 'text-[#1C1710]/60'}`} style={{ fontFamily: fontCairo }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Download CTA ─── */}
          <div className="bg-gradient-to-bl from-[#1C1710] via-[#181510] to-[#0F0D08] p-5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="ctaGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1" fill="#D4AF37" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ctaGrid)" />
              </svg>
            </div>

            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-3"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-[18px] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                  <Download className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <h3 className="text-white text-lg font-black mb-1" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Download Beit Al Reef' : 'حمّل تطبيق بيت الريف'}
              </h3>
              <p className="text-white/40 text-[11px] mb-4" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Available on iOS & Android — Free' : 'متوفر على iOS و Android — مجاناً'}
              </p>

              <div className="flex gap-2.5 justify-center">
                <button className="bg-white text-[#1C1710] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:shadow-lg transition-all" style={{ fontFamily: fontCairo }}>
                  <Download className="w-4 h-4" />
                  {isEn ? 'App Store' : 'آب ستور'}
                </button>
                <button className="bg-white text-[#1C1710] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:shadow-lg transition-all" style={{ fontFamily: fontCairo }}>
                  <Download className="w-4 h-4" />
                  {isEn ? 'Google Play' : 'جوجل بلاي'}
                </button>
              </div>

              <button
                onClick={() => navigate('/platform')}
                className="mt-3 text-[#D4AF37] text-[11px] font-bold flex items-center gap-1.5 justify-center mx-auto hover:text-[#FFD700] transition-colors"
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Explore Full Platform Guide' : 'استكشف الدليل الكامل للمنصة'}
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}