/**
 * SmartCTA.tsx — أزرار CTA ذكية حسب السياق
 * ═══════════════════════════════════════════
 * عند الضغط على أي زر تفاعلي → تظهر شاشة "إعداد الحساب"
 * المستخدم يتصفح بحرية كاملة — فقط الإجراءات تتطلب حساب
 */

import { 
  Zap, Award, Sparkles, Gift, 
  Search, ShoppingCart, Tag, Users, MessageCircle
} from 'lucide-react';
// Crown & ShoppingBag not available — using safe aliases
const Crown = Award;
const ShoppingBag = ShoppingCart;
import { useEffectiveState } from '../../contexts/EffectiveState';
import { useNavigate } from 'react-router@7.1.1';

const font = 'Cairo, sans-serif';

/** أنواع السياقات */
export type CTAContext = 
  | 'hero'           // الصفحة الرئيسية - Hero
  | 'provider'       // هل تبحث عن مزود؟
  | 'client'         // هل تبحث عن عميل؟
  | 'product'        // هل تبحث عن منتج؟
  | 'offer'          // هل تبحث عن عروض؟
  | 'dashboard'      // تجربة الداشبورد
  | 'book'           // احجز الآن
  | 'subscribe'      // اشترك الآن
  | 'contact';       // تواصل

/** النصوص حسب السياق */
const CTA_TEXT: Record<CTAContext, { ar: string; en: string; icon: any; subAr: string; subEn: string; contextMsgAr: string; contextMsgEn: string }> = {
  hero: {
    ar: 'اشترك الآن مجاناً',
    en: 'Subscribe Free Now',
    icon: Zap,
    subAr: '15 يوم فترة تجريبية مجانية',
    subEn: '15-day free trial period',
    contextMsgAr: 'سجّل مجاناً وابدأ تجربتك — 15 يوم بدون بطاقة بنكية',
    contextMsgEn: 'Register free & start your trial — 15 days, no credit card',
  },
  provider: {
    ar: 'هل تبحث عن مزود؟',
    en: 'Looking for a provider?',
    icon: Search,
    subAr: 'سجّل مجاناً وتواصل مباشرة',
    subEn: 'Register free & connect directly',
    contextMsgAr: 'سجّل مجاناً لتتواصل مباشرة مع المزودين الموثقين',
    contextMsgEn: 'Register free to connect directly with verified providers',
  },
  client: {
    ar: 'هل تبحث عن عميل؟',
    en: 'Looking for clients?',
    icon: Users,
    subAr: 'سجّل مجاناً واستقبل الطلبات',
    subEn: 'Register free & receive requests',
    contextMsgAr: 'سجّل مجاناً واعرض أعمالك باحترافية واستقبل طلبات العملاء',
    contextMsgEn: 'Register free, showcase your work & receive client requests',
  },
  product: {
    ar: 'هل تبحث عن منتج؟',
    en: 'Looking for a product?',
    icon: ShoppingBag,
    subAr: 'تصفح واشترِ بأفضل الأسعار',
    subEn: 'Browse & buy at best prices',
    contextMsgAr: 'سجّل مجاناً لتتمكن من الشراء والتواصل مع المتاجر',
    contextMsgEn: 'Register free to buy & connect with stores',
  },
  offer: {
    ar: 'هل تبحث عن عروض؟',
    en: 'Looking for offers?',
    icon: Tag,
    subAr: 'سجّل مجاناً للخصومات الحصرية',
    subEn: 'Register free for exclusive discounts',
    contextMsgAr: 'سجّل مجاناً لتفتح العروض الحصرية والخصومات',
    contextMsgEn: 'Register free to unlock exclusive offers & discounts',
  },
  dashboard: {
    ar: 'ابدأ تجربتك مجاناً',
    en: 'Start Free Trial',
    icon: Crown,
    subAr: 'فترة تجريبية 15 يوم — بدون بطاقة بنكية',
    subEn: '15-day trial — no credit card needed',
    contextMsgAr: 'سجّل مجاناً للوصول لداشبوردك الشخصي وأدوات الإدارة',
    contextMsgEn: 'Register free to access your dashboard & management tools',
  },
  book: {
    ar: 'احجز الآن',
    en: 'Book Now',
    icon: Sparkles,
    subAr: 'سجّل مجاناً واحجز فوراً',
    subEn: 'Register free & book instantly',
    contextMsgAr: 'سجّل مجاناً لتتمكن من الحجز والتواصل المباشر',
    contextMsgEn: 'Register free to book & connect directly',
  },
  subscribe: {
    ar: 'اشترك الآن مجاناً',
    en: 'Subscribe Free Now',
    icon: Gift,
    subAr: 'ابدأ فترتك التجريبية — 15 يوم مجاناً',
    subEn: 'Start your trial — 15 days free',
    contextMsgAr: 'ابدأ تجربتك المجانية 15 يوم — بدون بطاقة بنكية',
    contextMsgEn: 'Start your 15-day free trial — no credit card required',
  },
  contact: {
    ar: 'تواصل الآن',
    en: 'Contact Now',
    icon: MessageCircle,
    subAr: 'سجّل مجاناً وتواصل مباشرة',
    subEn: 'Register free & connect directly',
    contextMsgAr: 'سجّل مجاناً لتتواصل مباشرة مع المزودين الموثقين',
    contextMsgEn: 'Register free to connect directly with verified providers',
  },
};

interface SmartCTAProps {
  context: CTAContext;
  variant?: 'primary' | 'secondary' | 'compact' | 'inline';
  className?: string;
  isEn?: boolean;
  showSubtext?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

export function SmartCTA({ 
  context, 
  variant = 'primary', 
  className = '', 
  isEn = false, 
  showSubtext = true,
  fullWidth = false,
  onClick,
}: SmartCTAProps) {
  const { state } = useEffectiveState();
  const navigate = useNavigate();
  const data = CTA_TEXT[context];
  const Icon = data.icon;

  // ✅ EffectiveState: single source of truth for auth check
  const isLoggedIn = state.isAuthenticated && !!state.role;

  // ✅ Logged-in users see action-oriented text instead of "register" text
  const LOGGED_IN_TEXT: Record<CTAContext, { ar: string; en: string; subAr: string; subEn: string }> = {
    hero:      { ar: 'ابدأ مشروعك',       en: 'Start Your Project',  subAr: 'تصفح الخدمات والمزودين', subEn: 'Browse services & providers' },
    provider:  { ar: 'تصفح المزودين',      en: 'Browse Providers',    subAr: 'اعثر على أفضل مزود لك',   subEn: 'Find the best provider' },
    client:    { ar: 'استقبل الطلبات',      en: 'Receive Requests',    subAr: 'ابدأ استقبال طلبات العملاء', subEn: 'Start receiving client requests' },
    product:   { ar: 'تصفح المنتجات',      en: 'Browse Products',     subAr: 'أفضل الأسعار والعروض',     subEn: 'Best prices & offers' },
    offer:     { ar: 'اكتشف العروض',       en: 'Discover Offers',     subAr: 'عروض وخصومات حصرية',       subEn: 'Exclusive offers & discounts' },
    dashboard: { ar: 'لوحة التحكم',        en: 'Dashboard',           subAr: 'أدر مشاريعك وأعمالك',      subEn: 'Manage your projects' },
    book:      { ar: 'احجز الآن',          en: 'Book Now',            subAr: 'احجز الخدمة مباشرة',        subEn: 'Book service directly' },
    subscribe: { ar: 'ترقية الباقة',        en: 'Upgrade Plan',        subAr: 'اكتشف المزايا المتقدمة',    subEn: 'Discover advanced features' },
    contact:   { ar: 'تواصل الآن',         en: 'Contact Now',         subAr: 'تواصل مباشرة مع المزود',    subEn: 'Connect directly with provider' },
  };

  const displayAr = isLoggedIn ? LOGGED_IN_TEXT[context].ar : data.ar;
  const displayEn = isLoggedIn ? LOGGED_IN_TEXT[context].en : data.en;
  const displaySubAr = isLoggedIn ? LOGGED_IN_TEXT[context].subAr : data.subAr;
  const displaySubEn = isLoggedIn ? LOGGED_IN_TEXT[context].subEn : data.subEn;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (isLoggedIn) {
      // User already registered — navigate to relevant section
      const routeMap: Record<CTAContext, string> = {
        hero: '/home',
        provider: '/services',
        client: '/services',
        product: '/shop',
        offer: '/offers',
        dashboard: '/workspace',
        book: '/services',
        subscribe: '/subscriptions',
        contact: '/messages',
      };
      navigate(routeMap[context] || '/home');
    } else {
      navigate('/home');
    }
  };

  const contextMsg = isEn ? data.contextMsgEn : data.contextMsgAr;

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 bg-gradient-to-r from-[#D4AF37] to-[#C8A86A] text-white shadow-md border-2 border-[#FFD700]/30 ${fullWidth ? 'w-full justify-center' : ''} ${className}`}
          style={{ fontFamily: font }}
        >
          <Icon className="w-3.5 h-3.5" />
          {isEn ? displayEn : displayAr}
        </button>
      </>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={handleClick}
        className={`text-[#D4AF37] text-xs font-bold hover:underline flex items-center gap-1 ${className}`}
        style={{ fontFamily: font }}
      >
        <Icon className="w-3 h-3" />
        {isEn ? displayEn : displayAr}
      </button>
    );
  }

  if (variant === 'secondary') {
    return (
      <button
        onClick={handleClick}
        className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 bg-[#F5EEE1] text-[#1F3D2B] border-[3px] border-gray-200/60 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 ${fullWidth ? 'w-full' : ''} ${className}`}
        style={{ fontFamily: font }}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[#D4AF37]" />
          <span>{isEn ? displayEn : displayAr}</span>
        </div>
        {showSubtext && (
          <span className="text-[10px] text-[#1F3D2B]/40 font-semibold">
            {isEn ? displaySubEn : displaySubAr}
          </span>
        )}
      </button>
    );
  }

  // primary (default)
  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center gap-1 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-white shadow-xl border-[3px] border-[#FFD700]/40 hover:shadow-2xl ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{ fontFamily: font }}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span className="text-sm">{isEn ? displayEn : displayAr}</span>
      </div>
      {showSubtext && (
        <span className="text-[10px] text-white/70 font-semibold">
          {isEn ? displaySubEn : displaySubAr}
        </span>
      )}
    </button>
  );
}