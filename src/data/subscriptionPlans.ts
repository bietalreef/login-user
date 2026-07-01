// ====================================
// 💎 Subscription Plans Data Model
// بيت الريف - نظام الإشتراكات والباقات
// ====================================

export type PlanId = 'free' | 'standard' | 'pro';

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  nameEn: string;
  priceMonthly: number;
  priceYearly?: number; // خصم على الدفع السنوي
  color: string;
  gradient: string;
  badge?: string;
  icon: string;
  features: string[];
  limitations: string[];
  popular?: boolean;
}

// ====================================
// 📊 Subscription Plans Data
// ====================================

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'الخطة المجانية',
    nameEn: 'Free Plan',
    priceMonthly: 0,
    color: '#9E9E9E',
    gradient: 'from-gray-400 to-gray-500',
    icon: '🆓',
    features: [
      'ظهور محدود في نتائج البحث',
      'إدارة ملف شخصي أساسي',
      'استقبال طلبات محدودة شهرياً (حتى 10 طلبات)',
      'ردود تلقائية على الاستفسارات',
      'إحصائيات أساسية'
    ],
    limitations: [
      'لا تظهر في أولويات الخرائط',
      'لا يمكن تفعيل بانوراما 360°',
      'عدد محدود من المنتجات في المتجر (5 منتجات فقط)',
      'لا يوجد دعم فني مباشر',
      'عدم ظهور شعار "موثوق"'
    ]
  },
  {
    id: 'standard',
    name: 'الخطة المميزة',
    nameEn: 'Standard Plan',
    priceMonthly: 199,
    priceYearly: 1990, // خصم 17% على السنوي
    color: '#4A90E2',
    gradient: 'from-[#4A90E2] to-[#56CCF2]',
    badge: 'الأكثر استخداماً ⭐',
    icon: '⚡',
    popular: true,
    features: [
      'أولوية متوسطة في الخرائط والبحث',
      'عدد أكبر من المنتجات (حتى 50 منتج)',
      'إشعارات فورية بالطلبات',
      'تحليلات متقدمة ومعدلات التحويل',
      'شارة "موثوق" على الملف الشخصي',
      'دعم عبر الإيميل خلال 24 ساعة',
      'إمكانية إضافة 5 صور لكل منتج',
      'ظهور في قسم "المميزون"'
    ],
    limitations: [
      'بدون بانوراما 360°',
      'بدون دعم فني مباشر على الواتساب'
    ]
  },
  {
    id: 'pro',
    name: 'خطة الأعمال',
    nameEn: 'Business Plan',
    priceMonthly: 399,
    priceYearly: 3990, // خصم 17% على السنوي
    color: '#C8A86A',
    gradient: 'from-[#C8A86A] to-[#D4AF37]',
    badge: 'خطة الشركات 👑',
    icon: '👑',
    features: [
      'أعلى أولوية في الخرائط والمتجر',
      'عدد غير محدود من المنتجات',
      'بانوراما 360° مفعّلة للمحل',
      'شارة "شريك ذهبي" مميزة',
      'دعم فني مخصص عبر الواتساب',
      'تقارير شهرية متقدمة',
      'إمكانية إضافة فيديو للمنتجات',
      'ظهور في الصفحة الرئيسية',
      'أولوية في الإشعارات للعملاء',
      'حملات تسويقية مخصصة',
      'إمكانية إدارة فريق (3 حسابات فرعية)'
    ],
    limitations: []
  }
];

// ====================================
// 📊 Helper Functions
// ====================================

export function getPlanById(planId: PlanId): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
}

export function calculateYearlySavings(planId: PlanId): number {
  const plan = getPlanById(planId);
  if (!plan || !plan.priceYearly) return 0;
  
  const monthlyTotal = plan.priceMonthly * 12;
  return monthlyTotal - plan.priceYearly;
}

export function getFeatureComparison() {
  return {
    searchPriority: {
      free: 'منخفضة',
      standard: 'متوسطة',
      pro: 'عالية جداً'
    },
    maxProducts: {
      free: '5',
      standard: '50',
      pro: 'غير محدود'
    },
    panorama360: {
      free: '❌',
      standard: '❌',
      pro: '✅'
    },
    support: {
      free: 'لا يوجد',
      standard: 'إيميل 24 ساعة',
      pro: 'واتساب مباشر'
    },
    badge: {
      free: '-',
      standard: 'موثوق',
      pro: 'شريك ذهبي'
    }
  };
}

// TODO: Backend Integration
// - POST /api/subscriptions/subscribe { planId, paymentMethod }
// - GET /api/subscriptions/current
// - POST /api/subscriptions/cancel
// - GET /api/subscriptions/invoices
