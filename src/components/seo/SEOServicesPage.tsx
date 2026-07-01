/**
 * SEOServicesPage.tsx — صفحة قائمة الخدمات العامة لمحركات البحث
 * ══════════════════════════════════════════════════════════════
 * Route: /services  (public — بدون auth)
 * 9 فئات خدمات + SEOHeader + SEOFooter + JSON-LD + Breadcrumb
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router@7.1.1';
import { SEOHeader, SEOFooter } from './SEONav';
import {
  Building2, Compass, Wrench, HardHat, Hammer, Truck, Package,
  Sofa, Sparkles, MapPin, Star, Shield, Clock, ChevronLeft,
  Search, ArrowLeft,
} from 'lucide-react';
import { SITE_DOMAIN, SITE_NAME_AR, EMIRATES_AND_CITIES } from '../../utils/seoConstants';

const font = 'Cairo, Tajawal, sans-serif';

// ── helpers ──────────────────────────────────────────────
function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
  el.setAttribute('href', href);
}
function injectJsonLd(id: string, data: object) {
  let el = document.getElementById(id);
  if (!el) { el = document.createElement('script'); el.id = id; el.setAttribute('type', 'application/ld+json'); document.head.appendChild(el); }
  el.textContent = JSON.stringify(data, null, 2);
}

// ── 9 فئات الخدمات الرئيسية ──────────────────────────────
const SERVICE_CATEGORIES = [
  {
    id: 'construction-contracting',
    slug: 'construction-contracting',
    icon: Building2,
    iconColor: '#FFB347',
    bgColor: 'rgba(255,179,71,0.12)',
    titleAr: 'مقاولات البناء',
    titleEn: 'Construction Contracting',
    descAr: 'شركات مقاولات معتمدة لبناء الفلل والمباني السكنية والتجارية في الإمارات',
    descEn: 'Licensed contractors for villa and building construction across UAE',
    subsections: 4,
    providersCount: '+180',
  },
  {
    id: 'engineering-consultation',
    slug: 'engineering-consultation',
    icon: Compass,
    iconColor: '#5B9CF6',
    bgColor: 'rgba(91,156,246,0.12)',
    titleAr: 'الاستشارات الهندسية',
    titleEn: 'Engineering Consultation',
    descAr: 'مكاتب هندسية معتمدة للتصميم المعماري والإشراف الهندسي وإعداد المخططات',
    descEn: 'Certified engineering offices for architectural design and supervision',
    subsections: 4,
    providersCount: '+95',
  },
  {
    id: 'maintenance-companies',
    slug: 'maintenance-companies',
    icon: Wrench,
    iconColor: '#D4AF37',
    bgColor: 'rgba(212,175,55,0.12)',
    titleAr: 'شركات الصيانة',
    titleEn: 'Maintenance Companies',
    descAr: 'صيانة شاملة للمنازل والمباني — سباكة وكهرباء وتكييف ودهانات وجبس',
    descEn: 'Full home and building maintenance — plumbing, electrical, AC, painting',
    subsections: 8,
    providersCount: '+240',
  },
  {
    id: 'craftsmen',
    slug: 'craftsmen',
    icon: HardHat,
    iconColor: '#FFD54F',
    bgColor: 'rgba(255,213,79,0.12)',
    titleAr: 'العمالة الحرفية',
    titleEn: 'Skilled Craftsmen',
    descAr: 'حرفيون مهرة — نجارين وحدادين وكهربائيين وسباكين ودهانين وعمال بناء',
    descEn: 'Skilled craftsmen — carpenters, electricians, plumbers, painters and builders',
    subsections: 8,
    providersCount: '+320',
  },
  {
    id: 'workshops',
    slug: 'workshops',
    icon: Hammer,
    iconColor: '#FF6B6B',
    bgColor: 'rgba(255,107,107,0.12)',
    titleAr: 'الورش الصناعية',
    titleEn: 'Industrial Workshops',
    descAr: 'ورش حدادة ونجارة وألمنيوم وزجاج وأعمال حديد بجودة عالية وأسعار تنافسية',
    descEn: 'Metal, carpentry, aluminium and glass workshops at competitive prices',
    subsections: 5,
    providersCount: '+110',
  },
  {
    id: 'equipment-rental',
    slug: 'equipment-rental',
    icon: Truck,
    iconColor: '#D4AF37',
    bgColor: 'rgba(212,175,55,0.10)',
    titleAr: 'تأجير المعدات',
    titleEn: 'Equipment Rental',
    descAr: 'تأجير معدات البناء الثقيلة والخفيفة — رافعات وحفارات وسقالات وخلاطات',
    descEn: 'Heavy and light construction equipment rental — cranes, excavators, scaffolding',
    subsections: 3,
    providersCount: '+65',
  },
  {
    id: 'building-materials',
    slug: 'building-materials',
    icon: Package,
    iconColor: '#A0785A',
    bgColor: 'rgba(160,120,90,0.12)',
    titleAr: 'مواد البناء',
    titleEn: 'Building Materials',
    descAr: 'موردو مواد البناء — إسمنت وحديد وبلاط ورخام وأدوات صحية وكهربائية',
    descEn: 'Building materials suppliers — cement, steel, tiles, marble, plumbing fittings',
    subsections: 4,
    providersCount: '+150',
  },
  {
    id: 'furniture-stores',
    slug: 'furniture-stores',
    icon: Sofa,
    iconColor: '#9B7AED',
    bgColor: 'rgba(155,122,237,0.12)',
    titleAr: 'محلات الأثاث والديكور',
    titleEn: 'Furniture & Decor Stores',
    descAr: 'أثاث منزلي فاخر وأثاث مكتبي وقطع ديكور مع توصيل وتركيب لجميع الإمارات',
    descEn: 'Luxury home furniture, office furniture and decor with delivery and installation',
    subsections: 4,
    providersCount: '+200',
  },
  {
    id: 'cleaning-services',
    slug: 'cleaning-services',
    icon: Sparkles,
    iconColor: '#4ECDC4',
    bgColor: 'rgba(78,205,196,0.12)',
    titleAr: 'خدمات النظافة',
    titleEn: 'Cleaning Services',
    descAr: 'تنظيف منازل وفلل ومكاتب — تنظيف عميق وما بعد البناء وتعقيم وتلميع',
    descEn: 'Home, villa and office cleaning — deep clean, post-construction, sanitization',
    subsections: 3,
    providersCount: '+175',
  },
];

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════
export function SEOServicesPage() {
  const navigate = useNavigate();
  const canonicalUrl = `${SITE_DOMAIN}/services`;

  // ── Inject SEO meta ──
  useEffect(() => {
    document.title = 'خدمات البناء والصيانة في الإمارات | بيت الريف';
    setMeta('description', 'اكتشف جميع خدمات البناء والصيانة والتشطيب في الإمارات. مقاولون وحرفيون ومواد بناء وخدمات نظافة معتمدة في دبي وأبوظبي والشارقة وجميع الإمارات.');
    setMeta('keywords', 'خدمات بناء الإمارات, مقاولات, صيانة منازل, حرفيون, مواد بناء, تنظيف, أثاث, معدات بناء, استشارات هندسية');
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('language', 'ar');
    setMeta('geo.region', 'AE');
    setLink('canonical', canonicalUrl);

    setMeta('og:title', 'خدمات البناء والصيانة في الإمارات | بيت الريف', 'property');
    setMeta('og:description', 'اكتشف جميع خدمات البناء والصيانة والتشطيب في الإمارات. مزودون موثّقون في دبي وأبوظبي والشارقة وجميع الإمارات.', 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:site_name', SITE_NAME_AR, 'property');
    setMeta('og:locale', 'ar_AE', 'property');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', 'خدمات البناء والصيانة في الإمارات | بيت الريف');
    setMeta('twitter:description', 'مقاولون وحرفيون ومواد بناء معتمدة في جميع الإمارات.');

    // JSON-LD: ItemList of services
    injectJsonLd('ld-services-list', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'خدمات البناء والصيانة في الإمارات',
      description: 'قائمة شاملة بجميع خدمات البناء والصيانة والتشطيب المتاحة في منصة بيت الريف',
      url: canonicalUrl,
      numberOfItems: SERVICE_CATEGORIES.length,
      itemListElement: SERVICE_CATEGORIES.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: s.titleAr,
        url: `${SITE_DOMAIN}/services/${s.slug}`,
        description: s.descAr,
      })),
    });

    // JSON-LD: BreadcrumbList
    injectJsonLd('ld-services-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: SITE_DOMAIN },
        { '@type': 'ListItem', position: 2, name: 'الخدمات', item: canonicalUrl },
      ],
    });

    // JSON-LD: WebPage
    injectJsonLd('ld-services-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'خدمات البناء والصيانة في الإمارات',
      url: canonicalUrl,
      description: 'دليل شامل لخدمات البناء والصيانة في الإمارات العربية المتحدة',
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME_AR,
        url: SITE_DOMAIN,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: SITE_DOMAIN },
          { '@type': 'ListItem', position: 2, name: 'الخدمات', item: canonicalUrl },
        ],
      },
    });

    return () => {
      ['ld-services-list', 'ld-services-breadcrumb', 'ld-services-webpage']
        .forEach(id => document.getElementById(id)?.remove());
    };
  }, [canonicalUrl]);

  return (
    <div className="min-h-screen bg-[#F5EEE1]" dir="rtl" style={{ fontFamily: font }}>

      {/* ══ HEADER ══ */}
      <SEOHeader activeSlug={undefined} />

      {/* ══ HERO ══ */}
      <section className="relative bg-gradient-to-b from-[#1F3D2B] to-[#2A5A3B] overflow-hidden">
        {/* خلفية زخرفية */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#D4AF37] blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#3B5BFE] blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-10 pb-14">
          {/* Breadcrumb */}
          <nav aria-label="مسار التنقل" className="flex items-center gap-2 text-xs text-white/40 font-bold mb-6">
            <a href="/" className="hover:text-[#D4AF37] transition-colors">الرئيسية</a>
            <ChevronLeft className="w-3 h-3" />
            <span className="text-[#D4AF37]" aria-current="page">الخدمات</span>
          </nav>

          {/* H1 */}
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 max-w-3xl">
            خدمات البناء والصيانة في الإمارات
          </h1>
          <p className="text-base md:text-lg text-white/60 leading-[1.9] max-w-2xl mb-8">
            دليلك الشامل للعثور على أفضل المقاولين والحرفيين وموردي مواد البناء وشركات الصيانة والتنظيف المعتمدين في جميع الإمارات.
          </p>

          {/* إشارات الثقة */}
          <div className="flex flex-wrap gap-5 mb-8">
            {[
              { icon: Shield, text: '+1,300 مزود موثّق' },
              { icon: Star, text: 'تقييمات حقيقية' },
              { icon: Clock, text: 'رد خلال 24 ساعة' },
              { icon: MapPin, text: 'جميع الإمارات السبع' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/60 text-sm font-bold">
                <item.icon className="w-4 h-4 text-[#D4AF37]" />
                {item.text}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3">
            <a href="/home"
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1F3D2B] font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <Search className="w-4 h-4" />
              ابحث عن مزودين
            </a>
            <a href="/"
              className="px-7 py-3 rounded-xl bg-white/10 backdrop-blur text-white font-bold text-sm border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              عن المنصة
            </a>
          </div>
        </div>
      </section>

      {/* ══ MAIN ══ */}
      <main className="max-w-6xl mx-auto px-4 py-12">

        {/* ── إحصائيات سريعة ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { n: '9', l: 'فئة خدمية', sub: 'قطاعات البناء' },
            { n: '+1,300', l: 'مزود معتمد', sub: 'موثّق ومقيّم' },
            { n: '7', l: 'إمارات', sub: 'تغطية شاملة' },
            { n: '+15,000', l: 'مشروع منجز', sub: 'بنجاح' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <div className="text-2xl font-black text-[#D4AF37] mb-1">{s.n}</div>
              <div className="text-sm font-black text-[#1F3D2B]">{s.l}</div>
              <div className="text-xs text-[#1F3D2B]/40 font-bold mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── H2: الفئات الرئيسية ── */}
        <section aria-labelledby="categories-heading" className="mb-16">
          <h2 id="categories-heading" className="text-2xl md:text-3xl font-black text-[#1F3D2B] mb-3 flex items-start gap-3">
            <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#C8A86A] flex-shrink-0 mt-1" />
            <span>جميع فئات الخدمات</span>
          </h2>
          <p className="text-sm text-[#1F3D2B]/50 font-bold mb-8 mr-5">
            اختر الفئة التي تحتاجها للتصفح والتواصل مع المزودين المعتمدين
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICE_CATEGORIES.map((service) => {
              const Icon = service.icon;
              return (
                <a
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#D4AF37]/30 transition-all duration-200 p-6 flex flex-col"
                  aria-label={`${service.titleAr} — ${service.descAr}`}
                >
                  {/* أيقونة */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                    style={{ backgroundColor: service.bgColor }}
                  >
                    <Icon className="w-6 h-6" style={{ color: service.iconColor }} />
                  </div>

                  {/* المحتوى */}
                  <div className="flex-1">
                    <h3 className="text-base font-black text-[#1F3D2B] mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {service.titleAr}
                    </h3>
                    <p className="text-xs text-[#1F3D2B]/50 leading-[1.9] mb-4">
                      {service.descAr}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-[#D4AF37]">{service.providersCount} مزود</span>
                      <span className="text-[10px] text-[#1F3D2B]/30 font-bold">{service.subsections} تخصص</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#3B5BFE] group-hover:gap-2.5 transition-all">
                      <span>استكشف</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── H2: نخدمك في جميع الإمارات ── */}
        <section className="mb-16" aria-labelledby="cities-heading">
          <h2 id="cities-heading" className="text-xl font-black text-[#1F3D2B] mb-6 flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#3B5BFE] to-[#3B5BFE]/60 flex-shrink-0" />
            خدماتنا في جميع الإمارات
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {EMIRATES_AND_CITIES.filter(c => ['dubai', 'abu-dhabi', 'sharjah', 'ajman', 'al-ain', 'ras-al-khaimah', 'fujairah', 'umm-al-quwain'].includes(c.slug)).map(city => (
              <a key={city.slug} href={`/map/${city.slug}/construction-contracting`}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:border-[#3B5BFE]/30 transition-all text-center group shadow-sm">
                <MapPin className="w-5 h-5 text-[#3B5BFE] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-black text-[#1F3D2B]">{city.nameAr}</p>
                <p className="text-[10px] text-[#1F3D2B]/30 font-bold">{city.nameEn}</p>
                <p className="text-[9px] text-[#3B5BFE] font-black mt-1">عرض على الخريطة</p>
              </a>
            ))}
          </div>
        </section>

        {/* ── H2: لماذا بيت الريف ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-16">
          <h2 className="text-xl font-black text-[#1F3D2B] mb-6 flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#C8A86A] flex-shrink-0" />
            لماذا تختار بيت الريف لخدمات البناء؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'توثيق شامل للمزودين',
                desc: 'كل مزود خدمة على المنصة مرّ بعملية تحقق كاملة تشمل الهوية والرخصة التجارية وسجل المشاريع السابقة.',
              },
              {
                title: 'تقييمات حقيقية من عملاء موثّقين',
                desc: 'تقييمات لا يستطيع كتابتها إلا عملاء تحققنا من تعاملهم الفعلي مع المزود، لضمان الشفافية الكاملة.',
              },
              {
                title: 'مقارنة عروض الأسعار بسهولة',
                desc: 'أرسل طلب عرض سعر واحداً واستقبل عروضاً من عدة مزودين في مكان واحد لتختار الأنسب لميزانيتك.',
              },
              {
                title: 'تغطية جميع الإمارات',
                desc: 'شبكة موسّعة من المزودين في دبي وأبوظبي والشارقة وعجمان والعين ورأس الخيمة والفجيرة وأم القيوين.',
              },
              {
                title: 'دعم فني متخصص في البناء',
                desc: 'فريق متخصص يفهم متطلبات قطاع البناء والتشطيب الإماراتي ويساعدك في اتخاذ القرار الصحيح.',
              },
              {
                title: 'حاسبة تكاليف ذكية',
                desc: 'أدوات تقدير تكلفة البناء والصيانة الذكية تساعدك في التخطيط لميزانية مشروعك قبل التواصل مع المزودين.',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[#F5EEE1]/60 border border-gray-50">
                <div className="w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-black text-white">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#1F3D2B] mb-1">{item.title}</h3>
                  <p className="text-xs text-[#1F3D2B]/50 leading-[1.9]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── H2: كيف تعمل المنصة ── */}
        <section className="mb-16">
          <h2 className="text-xl font-black text-[#1F3D2B] mb-6 flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#3B5BFE] to-[#3B5BFE]/60 flex-shrink-0" />
            كيف تستفيد من منصة بيت الريف؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'اختر الخدمة', desc: 'تصفح الفئات واختر نوع الخدمة التي تحتاجها' },
              { step: '02', title: 'ابحث وقارن', desc: 'استعرض المزودين وقارن تقييماتهم وأسعارهم' },
              { step: '03', title: 'تواصل مباشرة', desc: 'أرسل رسالة أو اطلب عرض سعر من المزود المناسب' },
              { step: '04', title: 'وظّف بثقة', desc: 'اتفق على الشروط وتابع المشروع حتى اكتماله' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#C8A86A] text-white font-black text-sm flex items-center justify-center mx-auto mb-3 shadow-md">
                  {item.step}
                </div>
                <h3 className="text-sm font-black text-[#1F3D2B] mb-2">{item.title}</h3>
                <p className="text-xs text-[#1F3D2B]/50 leading-[1.8]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-gradient-to-l from-[#1F3D2B] to-[#2A5A3B] rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-black text-white mb-3">
            ابدأ رحلة مشروعك الآن
          </h2>
          <p className="text-white/60 text-sm mb-7 max-w-md mx-auto leading-[2]">
            سجّل مجاناً في بيت الريف وتواصل مع أفضل المزودين المعتمدين في الإمارات
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/home"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1F3D2B] font-black text-sm shadow-lg hover:shadow-xl transition-all">
              ابحث عن مزودين الآن
            </a>
            <a href="/"
              className="px-8 py-3.5 rounded-xl bg-white/10 text-white font-bold text-sm border border-white/20 hover:bg-white/20 transition-all">
              تعرّف على المنصة
            </a>
          </div>
        </section>

      </main>

      {/* ══ FOOTER ══ */}
      <SEOFooter />
    </div>
  );
}
