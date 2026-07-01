/**
 * PromoBanners.tsx — رسائل ترويجية احترافية لبيت الريف
 * ═══════════════════════════════════════════════════════
 * بانرات إعلامية (لا تحجب المحتوى!) — تظهر كمعلومات ترويجية
 * عند الضغط على أزرارها → تفتح شاشة إعداد الحساب
 * 
 * القاعدة: المستخدم يتصفح بحرية كاملة → فقط الإجراءات = تسجيل
 */

import { motion } from 'motion/react';
import {
  Store, CreditCard, Shield, Award,
  Sparkles, Star, Gift, Zap, CheckCircle,
  ShoppingCart, Camera, TrendingUp,
  Briefcase, Users,
} from 'lucide-react';
// Crown, BadgeCheck, ShoppingBag not available — using safe aliases
const Crown = Award;
const ShoppingBag = ShoppingCart;

const font = 'Cairo, sans-serif';


/* ═══════════════════════════════════════════════════════
   1. بانر المزود — "اعرض أعمالك باحترافية"
   ═══════════════════════════════════════════════════════ */
export function ProviderShowcaseBanner({ isEn = false }: { isEn?: boolean }) {

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden rounded-[24px] border-[4px] border-[#3B5BFE]/20 shadow-lg"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1d2e] via-[#252850] to-[#1a1d2e]" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B5BFE] via-[#FFD700] to-[#3B5BFE]" />
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#3B5BFE]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl" />

        <div className="relative z-10 p-5">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#3B5BFE] to-[#5B78FF] rounded-2xl flex items-center justify-center border-2 border-white/20 flex-shrink-0 shadow-lg shadow-[#3B5BFE]/20">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-base font-black mb-1" style={{ fontFamily: font }}>
                {isEn ? 'Showcase Your Work Professionally!' : 'اعرض أعمالك باحترافية!'}
                <span className="inline-block mr-2 text-[#FFD700]">✦</span>
              </h3>
              <p className="text-white/50 text-xs leading-relaxed" style={{ fontFamily: font, fontWeight: 600 }}>
                {isEn 
                  ? 'Create your professional profile, add your portfolio, receive client requests, and grow your business.'
                  : 'أنشئ ملفك المهني، أضف معرض أعمالك، استقبل طلبات العملاء، ونمّي أعمالك على بيت الريف.'}
              </p>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {(isEn ? [
              { icon: Briefcase, title: 'Professional Profile', sub: 'Full portfolio & gallery' },
              { icon: Users, title: 'Reach Clients', sub: 'Direct client requests' },
              { icon: Star, title: 'Build Reputation', sub: 'Reviews & ratings' },
              { icon: TrendingUp, title: 'Grow Business', sub: 'Analytics & insights' },
            ] : [
              { icon: Briefcase, title: 'ملف مهني احترافي', sub: 'معرض أعمال كامل' },
              { icon: Users, title: 'وصول للعملاء', sub: 'طلبات مباشرة' },
              { icon: Star, title: 'بناء سمعة', sub: 'تقييمات ومراجعات' },
              { icon: TrendingUp, title: 'نمو أعمالك', sub: 'تحليلات وإحصائيات' },
            ]).map((item, idx) => (
              <div key={idx} className="bg-white/[0.06] border border-white/[0.08] rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#3B5BFE]/15 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-[#5B78FF]" />
                </div>
                <div>
                  <p className="text-white text-[11px] font-bold" style={{ fontFamily: font }}>{item.title}</p>
                  <p className="text-white/30 text-[9px] font-semibold" style={{ fontFamily: font }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            className="w-full bg-gradient-to-l from-[#3B5BFE] to-[#5B78FF] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#3B5BFE]/20 flex items-center justify-center gap-2 border-2 border-white/20 active:scale-[0.97] transition-all"
            style={{ fontFamily: font, fontWeight: 800 }}
          >
            <Sparkles className="w-5 h-5" />
            {isEn ? 'Register Free — Start Now' : 'سجّل مجاناً — ابدأ الآن'}
          </button>
        </div>
      </motion.div>
    </>
  );
}


/* ═══════════════════════════════════════════════════════
   2. بانر المتجر — "تريد متجر إلكتروني؟"
   ═══════════════════════════════════════════════════════ */
export function EStoreBanner({ isEn = false }: { isEn?: boolean }) {

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-[24px] border-[4px] border-[#D4AF37]/20 shadow-xl"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A1F10] via-[#1F2A1A] to-[#1A2010]" />
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37]" />
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#D4AF37]/8 rounded-full blur-3xl" />
        
        <div className="relative z-10 p-5">
          {/* Title with Store icon */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#8A701E] rounded-2xl flex items-center justify-center border-2 border-[#FFD700]/30 flex-shrink-0 shadow-lg shadow-[#D4AF37]/20">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-lg font-black mb-1" style={{ fontFamily: font }}>
                {isEn ? 'Want Your Own Online Store?' : 'تريد أن يكون لك متجر إلكتروني؟'}

              </h3>
              <p className="text-white/50 text-xs leading-relaxed" style={{ fontFamily: font, fontWeight: 600 }}>
                {isEn 
                  ? 'Join now and get a professional online store — receive payments with zero commission, zero sales percentage.'
                  : 'انضم الآن واحصل على متجر احترافي — استقبل مدفوعات بدون عمولة، بدون نسبة على المبيعات.'}
              </p>
            </div>
          </div>

          {/* Zero Commission highlights */}
          <div className="bg-white/[0.06] border border-[#D4AF37]/20 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
              <h4 className="text-[#D4AF37] text-sm font-black" style={{ fontFamily: font }}>
                {isEn ? 'Beit Al Reef — We Are Here For You' : 'بيت الريف — نحن هنا لأجلك'}
              </h4>
            </div>
            <div className="space-y-2.5">
              {(isEn ? [
                { icon: CheckCircle, text: 'Zero Commission — ever', highlight: true },
                { icon: CheckCircle, text: 'Zero Hidden Fees', highlight: true },
                { icon: CheckCircle, text: 'Zero Extra Charges', highlight: true },
                { icon: CheckCircle, text: 'Just subscribe & show up professionally', highlight: false },
              ] : [
                { icon: CheckCircle, text: 'لا عمولة — أبداً', highlight: true },
                { icon: CheckCircle, text: 'لا مبالغ مخفية', highlight: true },
                { icon: CheckCircle, text: 'لا رسوم إضافية', highlight: true },
                { icon: CheckCircle, text: 'فقط اشترك واظهر باحترافية', highlight: false },
              ]).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.highlight ? 'bg-[#D4AF37]/15' : 'bg-white/10'
                  }`}>
                    <item.icon className={`w-4 h-4 ${item.highlight ? 'text-[#D4AF37]' : 'text-white/50'}`} />
                  </div>
                  <span className={`text-sm font-bold ${
                    item.highlight ? 'text-white' : 'text-[#D4AF37]'
                  }`} style={{ fontFamily: font }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Store features */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {(isEn ? [
              { icon: ShoppingBag, label: 'Pro Store', sub: 'Your brand' },
              { icon: CreditCard, label: '0% Fee', sub: 'On payments' },
              { icon: TrendingUp, label: 'Analytics', sub: 'Sales reports' },
            ] : [
              { icon: ShoppingBag, label: 'متجر احترافي', sub: 'بعلامتك' },
              { icon: CreditCard, label: '0% عمولة', sub: 'على المدفوعات' },
              { icon: TrendingUp, label: 'تحليلات', sub: 'تقارير مبيعات' },
            ]).map((item, idx) => (
              <div key={idx} className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-3 text-center">
                <item.icon className="w-5 h-5 text-[#D4AF37] mx-auto mb-1.5" />
                <p className="text-white text-[11px] font-bold" style={{ fontFamily: font }}>{item.label}</p>
                <p className="text-white/30 text-[9px] font-semibold" style={{ fontFamily: font }}>{item.sub}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            className="w-full bg-gradient-to-l from-[#D4AF37] to-[#B8940E] text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2.5 border-2 border-[#FFD700]/30 active:scale-[0.97] transition-all"
            style={{ fontFamily: font, fontWeight: 800 }}
          >
            <Crown className="w-5 h-5" />
            {isEn ? 'Join Now — Free Trial' : 'انضم الآن — تجربة مجانية'}
          </button>

          <p className="text-center text-white/20 text-[10px] font-bold mt-2.5" style={{ fontFamily: font }}>
            {isEn 
              ? 'Subscribe & appear professionally • No commission • No hidden fees'
              : 'فقط اشترك واظهر باحترافية • لا عمولة • لا مبالغ خفية'}
          </p>
        </div>
      </motion.div>
    </>
  );
}


/* ═══════════════════════════════════════════════════════
   3. بانر العروض — "اشترك واحصل على عروض حصرية"
   ═══════════════════════════════════════════════════════ */
export function OffersPromoBanner({ isEn = false }: { isEn?: boolean }) {

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative overflow-hidden rounded-[24px] border-[4px] border-[#D4AF37]/15 shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-[#3a1f1a] via-[#2a1f10] to-[#1a1510]" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-[#FFD700] to-red-500" />
        
        <div className="relative z-10 p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-white/20 shadow-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-sm font-black mb-0.5" style={{ fontFamily: font }}>
                {isEn ? 'Exclusive Offers Await You!' : 'عروض حصرية بانتظارك!'}
              </h3>
              <p className="text-white/40 text-[11px] leading-relaxed" style={{ fontFamily: font, fontWeight: 600 }}>
                {isEn 
                  ? 'Register free to unlock VIP discounts and exclusive partner offers.'
                  : 'سجّل مجاناً لتفتح خصومات VIP وعروض الشركاء الحصرية.'}
              </p>
            </div>
          </div>

          <button
            className="w-full bg-gradient-to-l from-red-500 to-orange-500 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 border-white/15 active:scale-[0.97] transition-all"
            style={{ fontFamily: font, fontWeight: 800 }}
          >
            <Zap className="w-4 h-4" />
            {isEn ? 'Register Free & Save' : 'سجّل مجاناً ووفّر'}
          </button>
        </div>
      </motion.div>
    </>
  );
}


/* ═══════════════════════════════════════════════════════
   4. بانر الوعد — "بيت الريف — لا عمولة"
   ═══════════════════════════════════════════════════════ */
export function BrandPromiseBanner({ isEn = false, variant = 'full' }: { isEn?: boolean; variant?: 'full' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-[#D4AF37]/5 via-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-2xl px-4 py-3 flex items-center gap-3"
      >
        <Shield className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
        <p className="text-[11px] font-bold text-[#1F3D2B]/60" style={{ fontFamily: font }}>
          {isEn 
            ? 'Beit Al Reef — No commission • No hidden fees • No extra charges'
            : 'بيت الريف — لا عمولة • لا مبالغ مخفية • لا رسوم إضافية'}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[20px] border-[3px] border-[#D4AF37]/15"
    >
      <div className="absolute inset-0 bg-gradient-to-bl from-[#F5EEE1] to-white" />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      
      <div className="relative z-10 p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-[#D4AF37]" />
          <h4 className="text-[#1F3D2B] text-sm font-black" style={{ fontFamily: font }}>
            {isEn ? 'Beit Al Reef Promise' : 'وعد بيت الريف'}
          </h4>
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap text-[11px] font-bold text-[#1F3D2B]/50" style={{ fontFamily: font }}>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            {isEn ? 'No Commission' : 'لا عمولة'}
          </span>
          <span className="text-[#D4AF37]">•</span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            {isEn ? 'No Hidden Fees' : 'لا مبالغ مخفية'}
          </span>
          <span className="text-[#D4AF37]">•</span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            {isEn ? 'No Extra Charges' : 'لا رسوم إضافية'}
          </span>
        </div>
        <p className="text-[10px] text-[#D4AF37] font-bold mt-2" style={{ fontFamily: font }}>
          {isEn ? 'Just subscribe & appear professionally' : 'فقط اشترك واظهر باحترافية'}
        </p>
      </div>
    </motion.div>
  );
}


/* ═══════════════════════════════════════════════════════
   5. بانر الماركت بليس — "هل تبحث عن منتج؟"
   ═══════════════════════════════════════════════════════ */
export function MarketplacePromoBanner({ isEn = false }: { isEn?: boolean }) {

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-[24px] border-[4px] border-[#3B5BFE]/15 shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#3B5BFE]/5 to-white" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B5BFE] via-[#D4AF37] to-[#3B5BFE]" />
        
        <div className="relative z-10 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 bg-gradient-to-br from-[#3B5BFE] to-[#5B78FF] rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-white/20">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#1A1A1A] text-sm font-black" style={{ fontFamily: font }}>
                {isEn ? 'Looking for a Product?' : 'هل تبحث عن منتج؟'}
              </h3>
              <p className="text-[#1A1A1A]/40 text-[11px] font-semibold" style={{ fontFamily: font }}>
                {isEn ? 'Browse verified stores at best prices' : 'تصفح متاجر موثقة بأفضل الأسعار'}
              </p>
            </div>
            <button
              className="px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C8A86A] text-white rounded-xl text-xs font-bold border-2 border-[#FFD700]/30 active:scale-95 transition-all flex-shrink-0"
              style={{ fontFamily: font }}
            >
              {isEn ? 'Join Free' : 'انضم مجاناً'}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}