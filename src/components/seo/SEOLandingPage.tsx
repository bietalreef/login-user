/**
 * SEOLandingPage.tsx — الصفحة الرئيسية لمنصة بيت الريف
 * Route: /
 * الصور: 10 صور Unsplash مفتوحة المصدر → ستُستبدل بـ /public/images/landing/*.webp
 */

import { useNavigate } from 'react-router@7.1.1';
import { SEOHeader, SEOFooter } from './SEONav';
import { SEOHead } from './SEOHead';
import { WebPImage, WebPPrefetch } from './WebPImage';
import { SERVICES_SEO, EMIRATES_AND_CITIES } from '../../utils/seoConstants';
import {
  Search, Star, MapPin, Shield, Award, Wrench,
  Store, ChevronLeft, ArrowLeft, Phone,
  Zap, Cpu, CheckCircle, BarChart3,
} from 'lucide-react';

const font = 'Cairo, Tajawal, sans-serif';

// ══════════════════════════════════════════════════════════
// 10 صور Unsplash — سيتم استبدالها بـ /public/images/landing/
// ══════════════════════════════════════════════════════════
const IMGS = {
  // 01 — Hero الصورة الرئيسية
  hero:         'https://images.unsplash.com/photo-1762536859942-8076505f7c62?w=1440&q=85',
  // 02 — وياك: من الطلب إلى التنفيذ
  wayakProcess: 'https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?w=900&q=85',
  // 03 — لوحة التحكم الذكية
  dashboard:    'https://images.unsplash.com/photo-1758691736483-5f600b509962?w=900&q=85',
  // 04 — منظومة متكاملة للأعمال
  bizSystem:    'https://images.unsplash.com/photo-1758873268663-5a362616b5a7?w=900&q=85',
  // 05 — متجر الأثاث ومواد البناء 3D
  store3d:      'https://images.unsplash.com/photo-1670222061552-c273834aee0c?w=900&q=85',
  // 06 — عرض منتجات التشطيب الداخلي
  interior:     'https://images.unsplash.com/photo-1760072513367-55182245e76c?w=1440&q=85',
  // 07 — ترسانة الأدوات الرقمية (47 أداة)
  tools47:      'https://images.unsplash.com/photo-1763568258143-904ea924ac53?w=900&q=85',
  // 08 — التصميم ثلاثي الأبعاد (رحلة العميل)
  design3d:     'https://images.unsplash.com/photo-1769149068959-b11392164add?w=900&q=85',
  // 09 — وياك AI الوكيل الذكي
  wayakAgent:   'https://images.unsplash.com/photo-1525338078858-d762b5e32f2c?w=900&q=85',
  // 10 — تصدر محركات البحث والذكاء الاصطناعي
  geoSeo:       'https://images.unsplash.com/photo-1674027001860-f9e3a94f4084?w=900&q=85',
};

// ══════════════════════════════════════════════
// Hero — صورة 01
// ══════════════════════════════════════════════
function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#F5EEE1] via-[#EFE7D8] to-[#F5EEE1]" dir="rtl">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-6">
          <Shield className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm font-bold text-[#8B6914]" style={{ fontFamily: font }}>منصة مرخصة وموثوقة — الإمارات العربية المتحدة</span>
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight" style={{ fontFamily: font, color: '#1F3D2B' }}>
          بيت الريف
          <span className="block text-3xl sm:text-4xl lg:text-5xl mt-3 bg-gradient-to-l from-[#D4AF37] to-[#3B5BFE] bg-clip-text text-transparent">
            منصة البناء الذكية في الإمارات
          </span>
        </h1>
        <p className="text-xl sm:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: font, color: 'rgba(31, 61, 43, 0.70)' }}>
          اعثر على أفضل المقاولين، الحرفيين، ومواد البناء في دبي وأبوظبي والشارقة.
          <br className="hidden sm:block" />
          عروض أسعار فورية — مقارنة ذكية — توثيق كامل
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button onClick={() => navigate('/services')} className="group px-8 py-4 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2" style={{ fontFamily: font }}>
            <Search className="w-5 h-5" /><span>ابحث عن خدمة</span><ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button onClick={() => navigate('/map/dubai')} className="group px-8 py-4 bg-white/80 backdrop-blur-md text-[#1F3D2B] font-semibold rounded-2xl border-2 border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-lg transition-all flex items-center gap-2" style={{ fontFamily: font }}>
            <MapPin className="w-5 h-5 text-[#D4AF37]" /><span>استكشف الخريطة</span>
          </button>
        </div>
        {/* ✅ صورة 01 — Hero */}
        <div className="relative mx-auto max-w-5xl">
          <div className="bg-white/50 backdrop-blur-sm p-3 rounded-3xl border border-white/80 shadow-2xl">
            <WebPImage src={IMGS.hero} alt="مشاريع بناء حديثة في الإمارات العربية المتحدة — بيت الريف" className="w-full h-auto rounded-2xl object-cover" loading="eager" fetchPriority="high" />
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-6 py-3 shadow-xl border border-gray-100 flex items-center gap-8 whitespace-nowrap">
            {[{ label: 'مزود نشط', value: '500+' }, { label: 'عميل راضٍ', value: '10,000+' }, { label: 'مشروع مكتمل', value: '25,000+' }].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-lg font-black text-[#D4AF37]" style={{ fontFamily: font }}>{s.value}</div>
                <div className="text-xs text-gray-500 font-bold" style={{ fontFamily: font }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Wayak Process — صورة 02
// ══════════════════════════════════════════════
function WayakSection() {
  const navigate = useNavigate();
  return (
    <section className="py-28 bg-[#F5EEE1]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B5BFE]/10 border border-[#3B5BFE]/20 mb-6">
              <Cpu className="w-4 h-4 text-[#3B5BFE]" />
              <span className="text-sm font-bold text-[#3B5BFE]" style={{ fontFamily: font }}>المساعد الذكي وياك</span>
            </div>
            <h2 className="text-4xl font-black text-[#1F3D2B] mb-6 leading-tight" style={{ fontFamily: font }}>
              من الطلب إلى التنفيذ<span className="block text-[#3B5BFE]">في دقائق لا أيام</span>
            </h2>
            <p className="text-lg text-[#1F3D2B]/70 leading-relaxed mb-8" style={{ fontFamily: font }}>
              وياك وكيلك التنفيذي الذكي يفهم طلباتك المعقدة، يُحللها، ويربطك بأفضل المزودين المعتمدين في الإمارات — كل ذلك تلقائياً.
            </p>
            {['تحليل طلبك تلقائياً بالذكاء الاصطناعي', 'إرسال الطلب لأفضل 5 مزودين', 'مقارنة العروض في مكان واحد', 'توثيق العقد رقمياً بضغطة'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <span className="text-[#1F3D2B]/80 font-semibold" style={{ fontFamily: font }}>{item}</span>
              </div>
            ))}
            <button onClick={() => navigate('/seo/platform')} className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3B5BFE] text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all" style={{ fontFamily: font }}>
              اكتشف وياك <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          {/* ✅ صورة 02 */}
          <div className="bg-white/50 p-3 rounded-3xl border border-white shadow-xl">
            <WebPImage src={IMGS.wayakProcess} alt="وياك AI: آلية عمل ذكية من الطلب إلى التنفيذ — مساعد بناء رقمي" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Platform — صورة 03 + 04
// ══════════════════════════════════════════════
function PlatformSection() {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-gradient-to-b from-[#EFE7D8] to-[#F5EEE1]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-[#1F3D2B] mb-4" style={{ fontFamily: font }}>منصة متكاملة لكل احتياجاتك</h2>
          <p className="text-lg text-[#1F3D2B]/60 max-w-2xl mx-auto" style={{ fontFamily: font }}>الاستقلال المالي والتفوق التقني في منصة واحدة</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* ✅ صورة 03 */}
          <div className="bg-white/50 p-3 rounded-3xl border border-white shadow-xl">
            <WebPImage src={IMGS.dashboard} alt="لوحة التحكم الذكية لمنصة بيت الريف — إدارة مشاريع البناء في الإمارات" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
          </div>
          {/* ✅ صورة 04 */}
          <div className="bg-white/50 p-3 rounded-3xl border border-white shadow-xl">
            <WebPImage src={IMGS.bizSystem} alt="منظومة الأعمال المتكاملة — إدارة فريق العمل والمشاريع بذكاء" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
          </div>
        </div>
        <div className="text-center">
          <button onClick={() => navigate('/seo/platform')} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#D4AF37] text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all" style={{ fontFamily: font }}>
            تعرف على المنصة الشاملة <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Store — صورة 05 + 06
// ══════════════════════════════════════════════
function StoreSection() {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-[#F5EEE1]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6">
              <Store className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-bold text-[#D4AF37]" style={{ fontFamily: font }}>متجر مواد البناء</span>
            </div>
            <h2 className="text-4xl font-black text-[#1F3D2B] mb-6 leading-tight" style={{ fontFamily: font }}>
              تجربة تسوق ثلاثية الأبعاد<span className="block text-[#D4AF37]">لا مثيل لها في الإمارات</span>
            </h2>
            <p className="text-lg text-[#1F3D2B]/70 leading-relaxed mb-8" style={{ fontFamily: font }}>
              تسوق مواد البناء، التشطيب، الأثاث والديكور من أفضل الموردين. صور 360°، مقارنة الأسعار، وعروض أسعار فورية للجملة.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: BarChart3, label: 'مقارنة أسعار فورية', color: '#D4AF37' },
                { icon: MapPin, label: 'خرائط المعارض', color: '#3B5BFE' },
                { icon: Star, label: 'تقييمات المنتجات', color: '#D4AF37' },
                { icon: Zap, label: 'تسليم سريع', color: '#3B5BFE' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/60 p-4 rounded-xl border border-white">
                  <f.icon className="w-5 h-5 flex-shrink-0" style={{ color: f.color }} />
                  <span className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily: font }}>{f.label}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/seo/store')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all" style={{ fontFamily: font }}>
              تصفح المتجر <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          {/* ✅ صورة 05 */}
          <div className="bg-white/50 p-3 rounded-3xl border border-white shadow-xl">
            <WebPImage src={IMGS.store3d} alt="متجر الأثاث ومواد البناء ثلاثي الأبعاد — تجربة تسوق مبتكرة في الإمارات" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
          </div>
        </div>
        {/* ✅ صورة 06 — full width */}
        <div className="mt-12 bg-white/50 p-3 rounded-3xl border border-white shadow-xl">
          <WebPImage src={IMGS.interior} alt="تصميم داخلي فاخر — معرض مواد التشطيب والديكور في بيت الريف" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Services Grid
// ══════════════════════════════════════════════
function ServicesSection() {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-[#F5EEE1]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-black text-center mb-4" style={{ fontFamily: font, color: '#1F3D2B' }}>خدمات البناء والتشطيب</h2>
        <p className="text-center text-lg mb-12 max-w-2xl mx-auto" style={{ fontFamily: font, color: 'rgba(31, 61, 43, 0.60)' }}>استكشف مجموعة شاملة من الخدمات المتخصصة مع مزودين موثّقين وعروض أسعار فورية</p>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_SEO.slice(0, 8).map((service) => (
            <button key={service.slug} onClick={() => navigate(`/${service.slug}`)} className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 hover:border-[#D4AF37]/40 shadow-sm hover:shadow-lg transition-all text-right">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4AF37]/10 to-[#3B5BFE]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Wrench className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold mb-1 group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: font, color: '#1F3D2B' }}>{service.nameAr}</h3>
              <p className="text-xs" style={{ fontFamily: font, color: 'rgba(31, 61, 43, 0.50)' }}>{service.nameEn}</p>
              <ChevronLeft className="w-5 h-5 text-[#D4AF37] opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all absolute left-4 bottom-6" />
            </button>
          ))}
        </div>
        <div className="text-center mt-10">
          <button onClick={() => navigate('/services')} className="px-8 py-3 bg-white/80 backdrop-blur-md text-[#1F3D2B] font-semibold rounded-xl border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-md transition-all" style={{ fontFamily: font }}>
            عرض جميع الخدمات <ArrowLeft className="inline-block w-4 h-4 mr-2" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Tools — صورة 07 + 08
// ══════════════════════════════════════════════
function ToolsSection() {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-gradient-to-b from-[#F5EEE1] to-[#EFE7D8]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B5BFE]/10 border border-[#3B5BFE]/20 mb-6">
            <Cpu className="w-4 h-4 text-[#3B5BFE]" />
            <span className="text-sm font-bold text-[#3B5BFE]" style={{ fontFamily: font }}>47 أداة ذكاء اصطناعي مجانية</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#1F3D2B] mb-4" style={{ fontFamily: font }}>ترسانتك الرقمية الشاملة</h2>
          <p className="text-lg text-[#1F3D2B]/60 max-w-2xl mx-auto" style={{ fontFamily: font }}>حاسبة مواد البناء، مصمم 3D، مولد عقود، حاسبة إضاءة، مقارن أسعار — كلها مجاناً</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* ✅ صورة 07 */}
          <div className="bg-white/50 p-3 rounded-3xl border border-white shadow-xl">
            <WebPImage src={IMGS.tools47} alt="ترسانة الأدوات الرقمية الذكية — 47 أداة مجانية لقطاع البناء والتشطيب" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
          </div>
          {/* ✅ صورة 08 */}
          <div className="bg-white/50 p-3 rounded-3xl border border-white shadow-xl">
            <WebPImage src={IMGS.design3d} alt="تصميم المشاريع ثلاثي الأبعاد — من الإلهام إلى التنفيذ في بيت الريف" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
          </div>
        </div>
        <div className="text-center mt-10">
          <button onClick={() => navigate('/seo/tools')} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#3B5BFE] text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all" style={{ fontFamily: font }}>
            استكشف جميع الأدوات <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Wayak Agent — صورة 09
// ══════════════════════════════════════════════
function WayakAgentSection() {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-[#F5EEE1]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ✅ صورة 09 */}
          <div className="bg-white/50 p-3 rounded-3xl border border-white shadow-xl">
            <WebPImage src={IMGS.wayakAgent} alt="وياك AI: الوكيل الذكي للبناء — استشارات 24/7 ومعالجة الطلبات تلقائياً" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6">
              <Star className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-bold text-[#D4AF37]" style={{ fontFamily: font }}>وكيل تنفيذي 24/7</span>
            </div>
            <h2 className="text-4xl font-black text-[#1F3D2B] mb-6 leading-tight" style={{ fontFamily: font }}>
              وياك AI<span className="block text-[#3B5BFE]">ليس مجرد روبوت محادثة</span>
            </h2>
            <p className="text-lg text-[#1F3D2B]/70 leading-relaxed mb-8" style={{ fontFamily: font }}>
              وياك يفهم لهجتك ويُحوّل محادثتك إلى طلب عمل قابل للتنفيذ فوراً. يُدير حملاتك، يُحلل السوق، ويربطك بأفضل المزودين تلقائياً.
            </p>
            <button onClick={() => navigate('/seo/platform')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#3B5BFE] text-[#3B5BFE] font-bold hover:bg-[#3B5BFE] hover:text-white transition-all" style={{ fontFamily: font }}>
              تعرف على وياك <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// GEO — صورة 10
// ══════════════════════════════════════════════
function GeoSection() {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-gradient-to-b from-[#EFE7D8] to-[#F5EEE1]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B5BFE]/10 border border-[#3B5BFE]/20 mb-6">
              <Search className="w-4 h-4 text-[#3B5BFE]" />
              <span className="text-sm font-bold text-[#3B5BFE]" style={{ fontFamily: font }}>SEO + GEO مُدمجان</span>
            </div>
            <h2 className="text-4xl font-black text-[#1F3D2B] mb-6 leading-tight" style={{ fontFamily: font }}>
              تصدّر محركات البحث<span className="block text-[#3B5BFE]">والذكاء الاصطناعي</span>
            </h2>
            <p className="text-lg text-[#1F3D2B]/70 leading-relaxed mb-8" style={{ fontFamily: font }}>
              اجعل عملاءك يجدونك في Google وChatGPT وPerplexity. بيت الريف يُهيّئ ملفك لتصدر نتائج البحث التقليدي والذكاء الاصطناعي.
            </p>
            <button onClick={() => navigate('/seo/dashboards')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3B5BFE] text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all" style={{ fontFamily: font }}>
              استعرض لوحات التحكم <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          {/* ✅ صورة 10 */}
          <div className="bg-white/50 p-3 rounded-3xl border border-white shadow-xl">
            <WebPImage src={IMGS.geoSeo} alt="تصدر محركات البحث والذكاء الاصطناعي GEO — منصة بيت الريف للبناء في الإمارات" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Cities
// ══════════════════════════════════════════════
function CitiesSection() {
  const navigate = useNavigate();
  const majorCities = EMIRATES_AND_CITIES.filter((c) =>
    ['dubai', 'abu-dhabi', 'sharjah', 'ajman', 'ras-al-khaimah', 'fujairah'].includes(c.slug)
  );
  return (
    <section className="py-20 bg-[#F5EEE1]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-black text-center mb-4" style={{ fontFamily: font, color: '#1F3D2B' }}>مزودو الخدمات في جميع الإمارات</h2>
        <p className="text-center text-lg mb-12 max-w-2xl mx-auto" style={{ fontFamily: font, color: 'rgba(31, 61, 43, 0.60)' }}>اختر مدينتك واعثر على أفضل المقاولين والحرفيين القريبين منك</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {majorCities.map((city) => (
            <button key={city.slug} onClick={() => navigate(`/map/${city.slug}`)} className="group bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/60 hover:border-[#D4AF37]/40 shadow-sm hover:shadow-md transition-all text-center">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <div className="font-bold text-sm group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: font, color: '#1F3D2B' }}>{city.nameAr}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// CTA
// ══════════════════════════════════════════════
function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-gradient-to-b from-[#EFE7D8] to-[#F5EEE1]" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-[#1F3D2B] mb-6" style={{ fontFamily: font }}>ابدأ رحلتك نحو<span className="block text-[#D4AF37]">القيادة الرقمية اليوم</span></h2>
        <p className="text-xl mb-10 leading-relaxed" style={{ fontFamily: font, color: 'rgba(31, 61, 43, 0.70)' }}>انضم إلى آلاف العملاء الراضين واحصل على عروض أسعار مجانية من أفضل المزودين</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => navigate('/home')} className="px-10 py-4 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105" style={{ fontFamily: font }}>
            ابدأ الآن — مجاناً
          </button>
          <a href="tel:+971500000000" className="px-10 py-4 bg-white/80 backdrop-blur-md text-[#1F3D2B] font-semibold rounded-2xl border-2 border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-lg transition-all flex items-center gap-2" style={{ fontFamily: font }}>
            <Phone className="w-5 h-5 text-[#D4AF37]" /><span>اتصل بنا</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════
export function SEOLandingPage() {
  return (
    <div className="min-h-screen bg-[#F5EEE1]" style={{ fontFamily: font }}>
      <SEOHead
        title="منصة البناء الذكية في الإمارات"
        description="بيت الريف — أكبر منصة رقمية لقطاع البناء والتشطيب في الإمارات. اعثر على أفضل المقاولين، الحرفيين، ومواد البناء في دبي وأبوظبي والشارقة. عروض أسعار فورية ومقارنة ذكية."
        canonicalPath="/"
        keywords={['مقاولين الإمارات', 'بناء فلل', 'تشطيبات', 'مواد بناء دبي', 'حرفيون', 'Construction UAE', 'Contractors Dubai', 'وياك AI']}
        ogType="website"
        breadcrumbs={[]}
      />
      <WebPPrefetch srcs={[IMGS.wayakProcess, IMGS.dashboard, IMGS.bizSystem]} />
      <SEOHeader />
      <main>
        <HeroSection />
        <WayakSection />
        <PlatformSection />
        <StoreSection />
        <ServicesSection />
        <ToolsSection />
        <WayakAgentSection />
        <GeoSection />
        <CitiesSection />
        <CTASection />
      </main>
      <SEOFooter />
    </div>
  );
}
