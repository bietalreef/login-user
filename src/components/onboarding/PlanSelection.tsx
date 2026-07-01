/**
 * PlanSelection.tsx — اختيار الباقة
 * تجربة مجانية 15 يوم + 3 باقات مدفوعة
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Icon3D } from '../ui/Icon3D';
import {
  Sparkles, Crown, Building2, Star, Check, Zap,
  Clock, Shield, Users, Infinity, Phone, Loader2
} from 'lucide-react';

interface PlanSelectionProps {
  onSelect: (plan: string) => void;
  isSubmitting: boolean;
  isEn: boolean;
  isDark: boolean;
}

export function PlanSelection({ onSelect, isSubmitting, isEn, isDark }: PlanSelectionProps) {
  const fontFamily = isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif';
  const [selectedPlan, setSelectedPlan] = useState<string>('free_trial');

  const plans = [
    {
      id: 'free_trial',
      name: isEn ? 'Free Trial' : 'تجربة مجانية',
      subtitle: isEn ? '15 days free — no credit card' : '15 يوم مجاناً — بدون بطاقة',
      price: isEn ? 'Free' : 'مجاناً',
      priceNote: isEn ? '15 days' : '15 يوم',
      icon: Sparkles,
      theme: 'blue',
      color: '#3B5BFE',
      badge: isEn ? 'Recommended' : 'مُوصى به',
      features: isEn
        ? ['All basic features', '5 documents/month', 'Smart search', 'Weyaak AI chat']
        : ['جميع المميزات الأساسية', '5 نماذج شهرياً', 'بحث ذكي', 'وياك المحادثة'],
    },
    {
      id: 'basic',
      name: isEn ? 'Basic' : 'أساسية',
      subtitle: isEn ? 'For individuals & freelancers' : 'للأفراد والمستقلين',
      price: isEn ? '99 AED' : '99 د.إ',
      priceNote: isEn ? '/month' : '/شهرياً',
      icon: Star,
      theme: 'gold',
      color: '#D4AF37',
      badge: null,
      features: isEn
        ? ['Unlimited documents', 'Priority search listing', 'Advanced tools', 'Phone support']
        : ['نماذج غير محدودة', 'أولوية في نتائج البحث', 'أدوات متقدمة', 'دعم هاتفي'],
    },
    {
      id: 'pro',
      name: isEn ? 'Professional' : 'احترافية',
      subtitle: isEn ? 'For growing businesses' : 'للأعمال النامية',
      price: isEn ? '299 AED' : '299 د.إ',
      priceNote: isEn ? '/month' : '/شهرياً',
      icon: Crown,
      theme: 'purple',
      color: '#9B59B6',
      badge: isEn ? 'Popular' : 'الأكثر طلباً',
      features: isEn
        ? ['Everything in Basic +', 'AI cost calculator', 'Design generator', 'Team (up to 10)', 'Analytics dashboard']
        : ['كل مميزات الأساسية +', 'حاسبة التكاليف الذكية', 'مولد التصاميم', 'فريق (حتى 10)', 'لوحة تحليلات'],
    },
    {
      id: 'enterprise',
      name: isEn ? 'Enterprise' : 'مؤسسات',
      subtitle: isEn ? 'For companies & institutions' : 'للشركات والمؤسسات',
      price: isEn ? 'Contact Us' : 'تواصل معنا',
      priceNote: isEn ? 'Custom pricing' : 'أسعار مخصصة',
      icon: Building2,
      theme: 'gold',
      color: '#C8A86A',
      badge: null,
      features: isEn
        ? ['Everything in Pro +', 'Unlimited users', 'Custom branding', 'API access', 'Dedicated manager']
        : ['كل مميزات الاحترافية +', 'مستخدمين غير محدودين', 'هوية مخصصة', 'API للتكامل', 'مدير حساب مخصص'],
    },
  ];

  const handleActivate = () => {
    if (selectedPlan === 'enterprise') {
      // Enterprise = contact us
      window.open('https://wa.me/971501234567?text=أريد الاستفسار عن باقة المؤسسات', '_blank');
      return;
    }
    onSelect(selectedPlan);
  };

  return (
    <div className="px-5 py-6">
      {/* Title */}
      <div className="text-center mb-6">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`}
          style={{ fontFamily }}
        >
          {isEn ? 'Choose Your Plan' : 'اختر باقتك'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-sm ${isDark ? 'text-white/50' : 'text-[#1F3D2B]/50'}`}
          style={{ fontFamily }}
        >
          {isEn
            ? 'Start free, upgrade anytime'
            : 'ابدأ مجاناً، ترقّى في أي وقت'}
        </motion.p>
      </div>

      {/* Plan Cards */}
      <div className="space-y-3 mb-6">
        {plans.map((plan, idx) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.button
              key={plan.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + idx * 0.06 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full text-right rounded-2xl overflow-hidden transition-all border-[4px] ${
                isSelected
                  ? isDark
                    ? 'border-[#D4AF37] bg-white/10'
                    : 'bg-white'
                  : isDark
                    ? 'border-white/10 bg-white/5'
                    : 'border-gray-200/60 bg-white'
              }`}
              style={{
                borderColor: isSelected ? plan.color : undefined,
                backdropFilter: isDark ? 'blur(20px) saturate(180%)' : undefined,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Icon3D icon={plan.icon} theme={plan.theme} size="sm" hoverable={false} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-bold ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`}
                        style={{ fontFamily }}
                      >
                        {plan.name}
                      </h3>
                      {plan.badge && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                          style={{ background: plan.color }}
                        >
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1F3D2B]/40'}`}
                      style={{ fontFamily }}
                    >
                      {plan.subtitle}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-left flex-shrink-0">
                    <p
                      className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`}
                      style={{ fontFamily }}
                    >
                      {plan.price}
                    </p>
                    <p
                      className={`text-[10px] ${isDark ? 'text-white/30' : 'text-[#1F3D2B]/30'}`}
                      style={{ fontFamily }}
                    >
                      {plan.priceNote}
                    </p>
                  </div>

                  {/* Radio */}
                  <div
                    className={`w-6 h-6 rounded-full border-[3px] flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-[#D4AF37]' : isDark ? 'border-white/20' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 rounded-full bg-[#D4AF37]"
                      />
                    )}
                  </div>
                </div>

                {/* Features (expanded when selected) */}
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 pt-3 border-t border-dashed space-y-2"
                    style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E6DCC8' }}
                  >
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: plan.color }} />
                        <span
                          className={`text-xs ${isDark ? 'text-white/60' : 'text-[#1F3D2B]/60'}`}
                          style={{ fontFamily }}
                        >
                          {f}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Activate Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleActivate}
        disabled={isSubmitting}
        className="w-full py-4 rounded-2xl text-white font-bold text-base disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        style={{
          background: selectedPlan === 'enterprise'
            ? 'linear-gradient(135deg, #C8A86A, #a88d55)'
            : 'linear-gradient(135deg, #3B5BFE, #2845C7)',
          fontFamily,
        }}
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : selectedPlan === 'enterprise' ? (
          <>
            <Phone className="w-5 h-5" />
            {isEn ? 'Contact Sales' : 'تواصل مع المبيعات'}
          </>
        ) : selectedPlan === 'free_trial' ? (
          <>
            <Zap className="w-5 h-5" />
            {isEn ? 'Start Free Trial — 15 Days' : 'ابدأ التجربة المجانية — 15 يوم'}
          </>
        ) : (
          <>
            <Crown className="w-5 h-5" />
            {isEn ? 'Activate Plan' : 'تفعيل الباقة'}
          </>
        )}
      </motion.button>

      {/* Skip link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-4"
      >
        <button
          onClick={() => onSelect('free_trial')}
          disabled={isSubmitting}
          className={`text-xs underline ${isDark ? 'text-white/30' : 'text-[#1F3D2B]/30'}`}
          style={{ fontFamily }}
        >
          {isEn ? 'Skip — start with free trial' : 'تخطي — ابدأ بالتجربة المجانية'}
        </button>
      </motion.p>
    </div>
  );
}
