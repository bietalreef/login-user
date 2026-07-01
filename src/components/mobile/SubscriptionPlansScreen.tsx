// ====================================
// 💎 Subscription Plans Screen Component
// بيت الريف - شاشة الباقات والإشتراكات
// ====================================

import { useState } from 'react';
import { ChevronLeft, Info, CreditCard, Calendar } from 'lucide-react';
import { SUBSCRIPTION_PLANS, PlanId, getFeatureComparison } from '../../data/subscriptionPlans';
import { SubscriptionPlanCard } from './SubscriptionPlanCard';

interface SubscriptionPlansScreenProps {
  onBack: () => void;
  currentPlanId?: PlanId;
}

export function SubscriptionPlansScreen({ onBack, currentPlanId = 'free' }: SubscriptionPlansScreenProps) {
  const [showYearlyPrice, setShowYearlyPrice] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleUpgrade = (planId: PlanId) => {
    // TODO: Implement payment flow
    // - Navigate to payment screen
    // - Integrate with Stripe or other payment gateway
    // - POST /api/subscriptions/subscribe
    
    console.log('💳 [TODO] Upgrade to plan:', planId);
    
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (plan) {
      alert(`🚀 سيتم توجيهك لصفحة الدفع\n\nالخطة: ${plan.name}\nالسعر: ${plan.priceMonthly} درهم شهرياً\n\n💡 TODO: ربط بوابة الدفع (Stripe)`);
    }
  };

  const comparison = getFeatureComparison();

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-[#F5EEE1] to-white overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#C8A86A] via-[#D4AF37] to-[#C8A86A] px-5 pt-6 pb-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white transform rotate-180" />
          </button>
          <h1 className="flex-1 text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '24px' }}>
            الباقات والإشتراكات
          </h1>
        </div>

        {/* Billing Toggle */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-1 flex items-center gap-1">
          <button
            onClick={() => setShowYearlyPrice(false)}
            className={`flex-1 px-4 py-2.5 rounded-xl transition-all ${
              !showYearlyPrice
                ? 'bg-white text-[#C8A86A]'
                : 'text-white'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '13px' }}
          >
            شهري
          </button>
          <button
            onClick={() => setShowYearlyPrice(true)}
            className={`flex-1 px-4 py-2.5 rounded-xl transition-all relative ${
              showYearlyPrice
                ? 'bg-white text-[#C8A86A]'
                : 'text-white'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '13px' }}
          >
            سنوي
            <span className="absolute -top-2 -left-2 bg-[#D4AF37] text-white text-xs px-2 py-0.5 rounded-full">
              وفّر 17%
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Info Banner */}
        <div className="p-4">
          <div className="bg-gradient-to-r from-[#4A90E2]/10 to-[#56CCF2]/10 border border-[#4A90E2]/30 rounded-2xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#1F3D2B] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                اختر الخطة المناسبة لنشاطك
              </p>
              <p className="text-xs text-[#1F3D2B]/70" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                يمكنك الترقية أو التخفيض في أي وقت. جميع الأسعار تجريبية ويمكن تعديلها لاحقاً.
              </p>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="px-4 pb-6 space-y-4">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={plan.id === currentPlanId}
              onUpgrade={() => handleUpgrade(plan.id)}
              showYearlyPrice={showYearlyPrice}
            />
          ))}
        </div>

        {/* Comparison Table Button */}
        <div className="px-4 pb-6">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="w-full bg-white border-2 border-[#4A90E2] text-[#4A90E2] px-6 py-3.5 rounded-xl hover:bg-[#4A90E2] hover:text-white transition-all"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
          >
            {showComparison ? 'إخفاء' : 'عرض'} جدول المقارنة التفصيلي
          </button>
        </div>

        {/* Comparison Table */}
        {showComparison && (
          <div className="px-4 pb-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#F5EEE1]">
              <div className="bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] px-4 py-3">
                <h3 className="text-white text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
                  مقارنة تفصيلية للخطط
                </h3>
              </div>
              
              <table className="w-full">
                <thead className="bg-[#F5EEE1]">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                      الميزة
                    </th>
                    <th className="px-2 py-3 text-center text-xs text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                      مجاني
                    </th>
                    <th className="px-2 py-3 text-center text-xs text-[#4A90E2]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                      مميزة
                    </th>
                    <th className="px-2 py-3 text-center text-xs text-[#C8A86A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                      أعمال
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#F5EEE1]">
                    <td className="px-4 py-3 text-xs text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      أولوية البحث
                    </td>
                    <td className="px-2 py-3 text-xs text-center text-[#1F3D2B]/60">{comparison.searchPriority.free}</td>
                    <td className="px-2 py-3 text-xs text-center text-[#1F3D2B]/60">{comparison.searchPriority.standard}</td>
                    <td className="px-2 py-3 text-xs text-center text-[#1F3D2B]/60">{comparison.searchPriority.pro}</td>
                  </tr>
                  <tr className="border-t border-[#F5EEE1] bg-[#F5EEE1]/30">
                    <td className="px-4 py-3 text-xs text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      عدد المنتجات
                    </td>
                    <td className="px-2 py-3 text-xs text-center text-[#1F3D2B]/60">{comparison.maxProducts.free}</td>
                    <td className="px-2 py-3 text-xs text-center text-[#1F3D2B]/60">{comparison.maxProducts.standard}</td>
                    <td className="px-2 py-3 text-xs text-center text-[#1F3D2B]/60">{comparison.maxProducts.pro}</td>
                  </tr>
                  <tr className="border-t border-[#F5EEE1]">
                    <td className="px-4 py-3 text-xs text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      بانوراما 360°
                    </td>
                    <td className="px-2 py-3 text-center">{comparison.panorama360.free}</td>
                    <td className="px-2 py-3 text-center">{comparison.panorama360.standard}</td>
                    <td className="px-2 py-3 text-center">{comparison.panorama360.pro}</td>
                  </tr>
                  <tr className="border-t border-[#F5EEE1] bg-[#F5EEE1]/30">
                    <td className="px-4 py-3 text-xs text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      الدعم الفني
                    </td>
                    <td className="px-2 py-3 text-xs text-center text-[#1F3D2B]/60">{comparison.support.free}</td>
                    <td className="px-2 py-3 text-xs text-center text-[#1F3D2B]/60">{comparison.support.standard}</td>
                    <td className="px-2 py-3 text-xs text-center text-[#1F3D2B]/60">{comparison.support.pro}</td>
                  </tr>
                  <tr className="border-t border-[#F5EEE1]">
                    <td className="px-4 py-3 text-xs text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      الشارة
                    </td>
                    <td className="px-2 py-3 text-xs text-center text-[#1F3D2B]/60">{comparison.badge.free}</td>
                    <td className="px-2 py-3 text-xs text-center text-[#1F3D2B]/60">{comparison.badge.standard}</td>
                    <td className="px-2 py-3 text-xs text-center text-[#1F3D2B]/60">{comparison.badge.pro}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Info */}
        <div className="px-4 pb-6">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-[#F5EEE1]">
            <h3 className="text-sm text-[#1F3D2B] mb-3 flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
              <CreditCard className="w-4 h-4 text-[#4A90E2]" />
              معلومات الدفع
            </h3>
            <ul className="space-y-2 text-xs text-[#1F3D2B]/70" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37]">✓</span>
                جميع طرق الدفع مؤمنة بالكامل
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37]">✓</span>
                إمكانية الإلغاء في أي وقت
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37]">✓</span>
                استرجاع كامل المبلغ خلال 14 يوم
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37]">✓</span>
                فواتير تفصيلية لكل دفعة
              </li>
            </ul>
          </div>
        </div>

        {/* TODO Notice */}
        <div className="px-4 pb-6">
          <div className="bg-[#F2994A]/10 border border-[#F2994A]/30 rounded-2xl p-4">
            <p className="text-xs text-[#1F3D2B]/60 text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              💡 TODO: سيتم ربط الإشتراكات مع بوابة الدفع (Stripe) + Backend API لاحقاً
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}