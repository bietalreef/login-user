import { motion } from 'motion/react';
import { User, ShieldCheck, Award, ArrowRight, Check } from 'lucide-react';
// Crown not available — using Award as alias
const Crown = Award;
import { useState } from 'react';

export type UserRole = 'client' | 'provider';
export type UserTier = 'visitor' | 'verified' | 'pro';

interface EntryPathSelectionProps {
  onSelect: (role: UserRole, tier: UserTier) => void;
}

export function EntryPathSelection({ onSelect }: EntryPathSelectionProps) {
  const [role, setRole] = useState<UserRole>('client');

  return (
    <div className="w-full max-w-6xl px-4 flex flex-col items-center z-20">
      
      {/* 1. Header & Role Toggle */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold text-amber-900 mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
          مرحباً بك في بيت الريف
        </h1>
        
        {/* Role Toggle Switch */}
        <div className="inline-flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/50 shadow-sm">
          <button
            onClick={() => setRole('client')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              role === 'client' 
                ? 'bg-[#5B7FE8] text-white shadow-md' 
                : 'text-amber-900/60 hover:bg-white/30'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            أنا عميل
          </button>
          <button
            onClick={() => setRole('provider')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              role === 'provider' 
                ? 'bg-[#7B5FE8] text-white shadow-md' 
                : 'text-amber-900/60 hover:bg-white/30'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            أنا مزود خدمة
          </button>
        </div>
      </motion.div>

      {/* 2. Three Path Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        
        {/* Path 1: Visitor (Guest) */}
        <PathCard
          icon={<User className="w-8 h-8" />}
          title="دخول زائر"
          subtitle="غير موثق"
          description={role === 'client' ? "تصفح المتجر والمنتجات فقط" : "إنشاء ملف تعريفي محدود"}
          color="gray"
          delay={0.1}
          onClick={() => onSelect(role, 'visitor')}
        />

        {/* Path 2: Verified Free */}
        <PathCard
          icon={<ShieldCheck className="w-8 h-8" />}
          title="دخول موثق"
          subtitle="باقة مجانية"
          description={role === 'client' ? "طلب مشاريع وتواصل مباشر" : "استقبال الطلبات والظهور"}
          color="blue"
          delay={0.2}
          isRecommended
          onClick={() => onSelect(role, 'verified')}
        />

        {/* Path 3: Professional (Pro) */}
        <PathCard
          icon={<Crown className="w-8 h-8" />}
          title="باقة احترافية"
          subtitle="عضوية مميزة"
          description={role === 'client' ? "خدمات VIP ومدير حساب" : "ظهور غير محدود وأدوات ذكية"}
          color="gold"
          delay={0.3}
          onClick={() => onSelect(role, 'pro')}
        />

      </div>
    </div>
  );
}

interface PathCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  color: 'gray' | 'blue' | 'gold';
  delay: number;
  isRecommended?: boolean;
  onClick: () => void;
}

function PathCard({ icon, title, subtitle, description, color, delay, isRecommended, onClick }: PathCardProps) {
  const styles = {
    gray: {
      bg: 'bg-white/60 border-white/50',
      iconBg: 'bg-gray-100 text-gray-600',
      btn: 'bg-gray-800 text-white hover:bg-gray-900',
      accent: 'text-gray-500'
    },
    blue: {
      bg: 'bg-white/80 border-blue-200 shadow-blue-200/50',
      iconBg: 'bg-blue-100 text-blue-600',
      btn: 'bg-[#5B7FE8] text-white hover:bg-blue-700',
      accent: 'text-blue-600'
    },
    gold: {
      bg: 'bg-amber-50/90 border-amber-200 shadow-amber-200/50',
      iconBg: 'bg-amber-100 text-amber-600',
      btn: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:opacity-90',
      accent: 'text-amber-600'
    }
  };

  const style = styles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onClick={onClick}
      className={`relative group cursor-pointer rounded-[32px] p-8 border shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 ${style.bg} ${isRecommended ? 'scale-105 z-10 border-2' : ''}`}
    >
      {isRecommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5B7FE8] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
          <Check className="w-3 h-3" />
          موصى به
        </div>
      )}

      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${style.iconBg}`}>
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
        {title}
      </h3>
      <p className={`text-sm font-bold mb-4 ${style.accent}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
        {subtitle}
      </p>

      <p className="text-gray-500 text-sm leading-relaxed mb-8 h-10" style={{ fontFamily: 'Cairo, sans-serif' }}>
        {description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-gray-400 font-medium" style={{ fontFamily: 'Cairo, sans-serif' }}>
          اضغط للمتابعة
        </span>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${style.btn}`}>
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
