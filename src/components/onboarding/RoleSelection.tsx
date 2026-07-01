/**
 * RoleSelection.tsx — اختيار الدور (عميل / مزود خدمة)
 */

import { motion } from 'motion/react';
import { Icon3D } from '../ui/Icon3D';
import { User, Wrench, Search, ShoppingCart, Star, FileText, Briefcase, Users, BarChart3, Award } from 'lucide-react';

interface RoleSelectionProps {
  onSelect: (role: 'client' | 'provider') => void;
  isEn: boolean;
  isDark: boolean;
}

export function RoleSelection({ onSelect, isEn, isDark }: RoleSelectionProps) {
  const fontFamily = isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif';

  const roles = [
    {
      id: 'client' as const,
      title: isEn ? "I'm a Client" : 'أنا عميل',
      subtitle: isEn ? 'Looking for services & providers' : 'أبحث عن خدمات ومزودين',
      icon: User,
      theme: 'blue',
      gradient: isDark 
        ? 'from-[#3B5BFE]/20 to-[#3B5BFE]/5' 
        : 'from-[#3B5BFE]/10 to-[#3B5BFE]/3',
      borderColor: '#3B5BFE',
      features: isEn
        ? ['Browse verified providers', 'Get quotes & compare', 'Rate & review services', 'Track your projects']
        : ['تصفح المزودين الموثقين', 'احصل على عروض أسعار وقارن', 'قيّم وراجع الخدمات', 'تابع مشاريعك'],
      featureIcons: [Search, FileText, Star, ShoppingCart],
    },
    {
      id: 'provider' as const,
      title: isEn ? "I'm a Service Provider" : 'أنا مزود خدمة',
      subtitle: isEn ? 'Offering my services to clients' : 'أقدم خدماتي للعملاء',
      icon: Wrench,
      theme: 'gold',
      gradient: isDark
        ? 'from-[#D4AF37]/20 to-[#D4AF37]/5'
        : 'from-[#D4AF37]/10 to-[#D4AF37]/3',
      borderColor: '#D4AF37',
      features: isEn
        ? ['Create your business profile', 'Receive client requests', 'Build your portfolio', 'Grow your reputation']
        : ['أنشئ ملفك التجاري', 'استقبل طلبات العملاء', 'ابنِ معرض أعمالك', 'طوّر سمعتك المهنية'],
      featureIcons: [Briefcase, Users, BarChart3, Award],
    },
  ];

  return (
    <div className="px-5 py-8">
      {/* Welcome Message */}
      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl font-black mb-3 ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`}
          style={{ fontFamily }}
        >
          {isEn ? 'Welcome to Beit Al Reef!' : 'مرحباً بك في بيت الريف!'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-sm ${isDark ? 'text-white/60' : 'text-[#1F3D2B]/60'}`}
          style={{ fontFamily }}
        >
          {isEn
            ? 'Choose your account type to get started'
            : 'اختر نوع حسابك للبدء'}
        </motion.p>
      </div>

      {/* Role Cards */}
      <div className="space-y-4">
        {roles.map((role, idx) => (
          <motion.button
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + idx * 0.1 }}
            onClick={() => onSelect(role.id)}
            className={`w-full text-right rounded-3xl overflow-hidden transition-all border-[4px] ${
              isDark
                ? 'bg-white/8 border-white/15 hover:border-white/30'
                : 'bg-white border-gray-200/60 hover:border-gray-300'
            }`}
            style={{ backdropFilter: isDark ? 'blur(20px) saturate(180%)' : undefined }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Top Section with Icon */}
            <div className={`bg-gradient-to-l ${role.gradient} p-5 flex items-center gap-4`}>
              <Icon3D icon={role.icon} theme={role.theme} size="lg" hoverable={false} />
              <div className="flex-1">
                <h2
                  className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`}
                  style={{ fontFamily }}
                >
                  {role.title}
                </h2>
                <p
                  className={`text-sm mt-1 ${isDark ? 'text-white/50' : 'text-[#1F3D2B]/50'}`}
                  style={{ fontFamily }}
                >
                  {role.subtitle}
                </p>
              </div>
            </div>

            {/* Features List */}
            <div className="px-5 py-4 space-y-3">
              {role.features.map((feature, i) => {
                const FeatureIcon = role.featureIcons[i];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${role.borderColor}15` }}
                    >
                      <FeatureIcon className="w-4 h-4" style={{ color: role.borderColor }} />
                    </div>
                    <span
                      className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-[#1F3D2B]/80'}`}
                      style={{ fontFamily }}
                    >
                      {feature}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Select Button */}
            <div className="px-5 pb-5">
              <div
                className="w-full py-3 rounded-2xl text-center font-bold text-white text-sm"
                style={{
                  background: `linear-gradient(135deg, ${role.borderColor}, ${role.id === 'client' ? '#2845C7' : '#B8940E'})`,
                  fontFamily,
                }}
              >
                {isEn ? 'Select' : 'اختيار'}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`text-center text-xs mt-6 ${isDark ? 'text-white/30' : 'text-[#1F3D2B]/30'}`}
        style={{ fontFamily }}
      >
        {isEn
          ? 'You can change your account type later from Settings'
          : 'يمكنك تغيير نوع حسابك لاحقاً من الإعدادات'}
      </motion.p>
    </div>
  );
}
