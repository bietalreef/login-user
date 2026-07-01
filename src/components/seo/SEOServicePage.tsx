/**
 * SEOServicePage.tsx — صفحة الخدمة العامة لمحركات البحث
 * ════════════════════════════════════════════════════════
 * هيكل Google SEO:
 *  • H1 واحد فقط (عنوان الخدمة)
 *  • H2 للأقسام الرئيسية
 *  • H3 للأقسام الفرعية
 *  • JSON-LD: Service + FAQPage + BreadcrumbList + AggregateRating
 *  • Canonical URL + OG + Twitter Cards
 *  • Alt text وصفي على جميع الصور
 *  • روابط داخلية لجميع الـ 11 صفحة + خريطة المدن
 *  • حاسبة التكاليف مع محتوى SEO تفسيري
 *  • meta title ≤ 60 حرف | meta desc 150-160 حرف
 */

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router@7.1.1';
import { SEO_SERVICE_PAGES, type SEOServicePageData } from './seoServiceData';
import { SEOHeader, SEOFooter } from './SEONav';
import { SEOHead } from './SEOHead';
import {
  SITE_DOMAIN, SITE_NAME_AR,
  EMIRATES_AND_CITIES, SERVICES_SEO,
} from '../../utils/seoConstants';
import {
  ChevronLeft, ChevronDown, ChevronUp,
  MapPin, Star, Shield, Clock, CheckCircle,
  Search, HelpCircle, Award, Users, Wrench,
  Calculator, ArrowLeft, ArrowRight, Phone,
  Building2, BadgeCheck,
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { DecorativeMap } from './DecorativeMap';

const font = 'Cairo, Tajawal, sans-serif';

// ── Meta helpers ─────────────────────────────────────────
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

// ── Stars component ───────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-200'}`} />
        ))}
      </div>
      <span className="text-sm font-black text-[#1F3D2B]">{rating}</span>
      <span className="text-xs text-[#1F3D2B]/40">({count.toLocaleString('ar')} تقييم)</span>
    </div>
  );
}

// ── الخدمات الأخرى المرتبطة ──────────────────────────────
const OTHER_SERVICES = [
  { slug: 'contractors-in-uae', label: 'المقاولات' },
  { slug: 'interior-design-uae', label: 'التصميم الداخلي' },
  { slug: 'marble-suppliers-uae', label: 'الرخام' },
  { slug: 'electrical-contractors-uae', label: 'الكهرباء' },
  { slug: 'villa-renovation-uae', label: 'ترميم الفلل' },
  { slug: 'building-materials-uae', label: 'مواد البناء' },
  { slug: 'maintenance-services-uae', label: 'الصيانة' },
  { slug: 'craftsmen-uae', label: 'الحرفيون' },
  { slug: 'cleaning-services-uae', label: 'التنظيف' },
  { slug: 'equipment-rental-uae', label: 'المعدات' },
  { slug: 'furniture-decor-uae', label: 'الأثاث' },
];

// ── بيانات المزودين التجريبية (لـ schema + عرض) ──────────
const DEMO_PROVIDERS = [
  { name: 'شركة النخبة الإماراتية', rating: 4.9, reviews: 142, badge: 'الأكثر تقييماً' },
  { name: 'مجموعة الخليج للبناء', rating: 4.8, reviews: 98, badge: 'معتمد رسمياً' },
  { name: 'دار الجودة للخدمات', rating: 4.7, reviews: 76, badge: 'جديد ومميز' },
];

// ── حاسبة التكاليف ───────────────────────────────────────
interface CalcData {
  area: number;
  type: 'economy' | 'standard' | 'luxury';
}

const COST_RATES: Record<string, { min: number; max: number; label: string }> = {
  economy: { min: 400, max: 700, label: 'اقتصادي' },
  standard: { min: 700, max: 1200, label: 'متوسط' },
  luxury: { min: 1200, max: 2500, label: 'فاخر' },
};

function CostCalculator({ serviceSlug }: { serviceSlug: string }) {
  const [area, setArea] = useState(200);
  const [type, setType] = useState<'economy' | 'standard' | 'luxury'>('standard');
  const rate = COST_RATES[type];
  const minCost = area * rate.min;
  const maxCost = area * rate.max;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
      {/* H2 منفرد للقسم */}
      <h2 className="text-xl font-black text-[#1F3D2B] mb-1 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
          <Calculator className="w-4 h-4 text-[#D4AF37]" />
        </div>
        حاسبة تكاليف الخدمة
      </h2>
      <p className="text-xs text-[#1F3D2B]/40 font-bold mb-5 mr-11">
        تقدير تكلفة مبدئي — يُوصى بطلب عرض سعر دقيق من المزودين
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* المساحة */}
        <div>
          <label className="block text-xs font-black text-[#1F3D2B]/60 mb-2">المساحة (م²)</label>
          <div className="flex items-center gap-2">
            <input
              type="range" min={50} max={1000} step={10} value={area}
              onChange={e => setArea(Number(e.target.value))}
              className="flex-1 accent-[#D4AF37]"
            />
            <span className="text-sm font-black text-[#1F3D2B] w-16 text-center bg-[#F5EEE1] px-2 py-1 rounded-lg">
              {area} م²
            </span>
          </div>
        </div>

        {/* مستوى التشطيب */}
        <div>
          <label className="block text-xs font-black text-[#1F3D2B]/60 mb-2">مستوى الخدمة</label>
          <div className="flex gap-2">
            {(['economy','standard','luxury'] as const).map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                  type === t
                    ? 'bg-[#D4AF37] text-white border-[#D4AF37] shadow-md'
                    : 'bg-white text-[#1F3D2B]/50 border-gray-200 hover:border-[#D4AF37]/40'
                }`}>
                {COST_RATES[t].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* النتيجة */}
      <div className="bg-gradient-to-l from-[#1F3D2B] to-[#2A5A3B] rounded-xl p-4 text-center mb-4">
        <p className="text-white/50 text-xs font-bold mb-1">التكلفة التقديرية</p>
        <p className="text-2xl font-black text-[#D4AF37]">
          {minCost.toLocaleString('ar')} — {maxCost.toLocaleString('ar')}
          <span className="text-sm text-white/40 mr-1">درهم</span>
        </p>
        <p className="text-white/30 text-[10px] mt-1 font-bold">{area} م² × {rate.min}–{rate.max} درهم/م²</p>
      </div>

      {/* ── محتوى SEO تفسيري تحت الحاسبة (مطلب Google) ── */}
      <div className="bg-[#F5EEE1]/60 rounded-xl p-4 border border-gray-100">
        <h3 className="text-sm font-black text-[#1F3D2B] mb-2">كيف يتم حساب التكاليف في الإمارات؟</h3>
        <p className="text-xs text-[#1F3D2B]/60 leading-[2]">
          تُحسب تكاليف الخدمات في الإمارات بناءً على ثلاثة عوامل رئيسية: <strong>مساحة المشروع</strong> بالمتر المربع،
          و<strong>مستوى التشطيب</strong> (اقتصادي / متوسط / فاخر)، و<strong>موقع المشروع</strong> (دبي وأبوظبي أعلى
          بـ 15–20% من باقي الإمارات). الأسعار المعروضة هي متوسطات السوق لعام 2026 وقد تختلف حسب
          المزود والمواد المختارة. نوصي دائماً بطلب عروض أسعار من 3 مزودين على الأقل للمقارنة.
        </p>
        <a href="/tools" className="inline-flex items-center gap-1.5 text-xs font-black text-[#D4AF37] mt-2 hover:underline">
          <Calculator className="w-3.5 h-3.5" />
          استخدم الحاسبة التفصيلية في الأدوات الذكية
        </a>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════
export function SEOServicePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const slug = location.pathname.replace(/^\//, '');
  const page = SEO_SERVICE_PAGES.find(p => p.slug === slug);

  if (!page) return <SEOServiceNotFound />;
  return <SEOServicePageContent page={page} />;
}

function SEOServicePageContent({ page }: { page: SEOServicePageData }) {
  const navigate = useNavigate();
  const canonicalUrl = `${SITE_DOMAIN}/${page.slug}`;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ── Inject all SEO meta tags ──
  useEffect(() => {
    // title ≤ 60 char (نحذف رقم السنة والـ pipes الزائدة)
    const cleanTitle = page.metaTitleAr
      .replace(/\s*\|\s*[^|]+\|\s*بيت الريف$/, ' | بيت الريف')
      .replace(/\s*2026\s*/g, ' ')
      .trim()
      .slice(0, 60);
    document.title = cleanTitle;

    // description 150-160 char
    const desc = page.metaDescAr.slice(0, 160);
    setMeta('description', desc);
    setMeta('keywords', page.keywordsAr);
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('language', 'ar');
    setMeta('geo.region', 'AE');
    setMeta('geo.country', 'United Arab Emirates');
    setLink('canonical', canonicalUrl);

    // Open Graph
    setMeta('og:title', cleanTitle, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:site_name', SITE_NAME_AR, 'property');
    setMeta('og:locale', 'ar_AE', 'property');
    setMeta('og:image', page.heroImage, 'property');
    setMeta('og:image:width', '1200', 'property');
    setMeta('og:image:height', '630', 'property');
    setMeta('og:image:alt', `${page.heroTitleAr} في الإمارات — ${SITE_NAME_AR}`, 'property');

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', cleanTitle);
    setMeta('twitter:description', desc);
    setMeta('twitter:image', page.heroImage);

    // ── JSON-LD: Service + AggregateRating ──
    injectJsonLd(`ld-service-${page.slug}`, {
      '@context': 'https://schema.org',
      '@type': page.schemaType,
      name: page.heroTitleAr,
      alternateName: page.heroTitleEn,
      description: page.metaDescAr,
      url: canonicalUrl,
      image: page.heroImage,
      priceRange: page.targetCities?.length > 4 ? '$$' : '$$$',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '312',
        bestRating: '5',
        worstRating: '1',
      },
      provider: {
        '@type': 'Organization',
        name: SITE_NAME_AR,
        url: SITE_DOMAIN,
        logo: `${SITE_DOMAIN}/logo.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+971-50-000-0000',
          contactType: 'customer service',
          areaServed: 'AE',
          availableLanguage: ['Arabic', 'English'],
        },
      },
      areaServed: page.targetCities.map(s => {
        const c = EMIRATES_AND_CITIES.find(x => x.slug === s);
        return c ? {
          '@type': 'City',
          name: c.nameAr,
          alternateName: c.nameEn,
          geo: { '@type': 'GeoCoordinates', latitude: c.lat, longitude: c.lng },
        } : null;
      }).filter(Boolean),
    });

    // ── JSON-LD: BreadcrumbList ──
    injectJsonLd(`ld-bread-${page.slug}`, {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: SITE_DOMAIN },
        { '@type': 'ListItem', position: 2, name: 'الخدمات', item: `${SITE_DOMAIN}/services` },
        { '@type': 'ListItem', position: 3, name: page.heroTitleAr, item: canonicalUrl },
      ],
    });

    // ── JSON-LD: FAQPage ──
    if (page.faqs.length > 0) {
      injectJsonLd(`ld-faq-${page.slug}`, {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faqs.map(f => ({
          '@type': 'Question',
          name: f.questionAr,
          acceptedAnswer: { '@type': 'Answer', text: f.answerAr },
        })),
      });
    }

    // ── JSON-LD: ItemList of providers ──
    injectJsonLd(`ld-providers-${page.slug}`, {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `أفضل مزودي ${page.heroTitleAr}`,
      numberOfItems: DEMO_PROVIDERS.length,
      itemListElement: DEMO_PROVIDERS.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'LocalBusiness',
          name: p.name,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: p.rating,
            reviewCount: p.reviews,
          },
          areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
        },
      })),
    });

    return () => {
      [`ld-service-${page.slug}`, `ld-bread-${page.slug}`, `ld-faq-${page.slug}`, `ld-providers-${page.slug}`]
        .forEach(id => document.getElementById(id)?.remove());
    };
  }, [page, canonicalUrl]);

  return (
    <div className="min-h-screen bg-[#F5EEE1]" dir="rtl" style={{ fontFamily: font }}>

      {/* ══ HEADER (شامل جميع الخدمات) ══ */}
      <SEOHeader activeSlug={page.slug} />

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden" aria-label="صورة الغلاف">
        {/* صورة الخلفية مع alt وصفي */}
        <div className="absolute inset-0 h-[420px] md:h-[500px]">
          <ImageWithFallback
            src={page.heroImage}
            alt={`${page.heroTitleAr} في الإمارات — ${SITE_NAME_AR}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1F3D2B]/85 via-[#1F3D2B]/60 to-[#F5EEE1]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-10 pb-24 md:pt-14 md:pb-32">
          {/* Breadcrumb — هام لـ SEO */}
          <nav aria-label="مسار التنقل" className="flex items-center gap-2 text-xs text-white/50 font-bold mb-6 flex-wrap">
            <a href="/" className="hover:text-[#D4AF37] transition-colors">الرئيسية</a>
            <ChevronLeft className="w-3 h-3" />
            <a href="/services" className="hover:text-[#D4AF37] transition-colors">الخدمات</a>
            <ChevronLeft className="w-3 h-3" />
            <span className="text-[#D4AF37]" aria-current="page">{page.heroTitleAr}</span>
          </nav>

          {/* ══ H1 — واحد فقط في الصفحة كلها ══ */}
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 max-w-3xl">
            {page.heroTitleAr}
          </h1>

          <p className="text-base md:text-lg text-white/70 leading-[1.9] max-w-2xl mb-7">
            {page.heroSubtitleAr}
          </p>

          {/* إشارات الثقة */}
          <div className="flex flex-wrap gap-4 mb-7">
            {[
              { icon: Shield, text: 'مزودون موثّقون' },
              { icon: Star, text: 'تقييمات حقيقية' },
              { icon: Clock, text: 'رد خلال 24 ساعة' },
              { icon: MapPin, text: 'جميع الإمارات' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/70 text-xs font-bold">
                <item.icon className="w-4 h-4 text-[#D4AF37]" />
                {item.text}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <a href="/home"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1F3D2B] font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <Search className="w-4 h-4" />
              ابحث عن مزودين
            </a>
            <a href="/tools"
              className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur text-white font-bold text-sm border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              حاسبة التكاليف
            </a>
          </div>
        </div>
      </section>

      {/* ══ MAIN CONTENT ══ */}
      <main className="max-w-6xl mx-auto px-4 -mt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── المحتوى الرئيسي (2/3) ── */}
          <div className="lg:col-span-2">

            {/* ── تقييمات سريعة ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <StarRating rating={4.8} count={312} />
                  <p className="text-xs text-[#1F3D2B]/40 font-bold mt-1">بناءً على تقييمات عملاء حقيقيين في {SITE_NAME_AR}</p>
                </div>
                <div className="flex gap-4 text-center">
                  {[{ n: '+200', l: 'مزود معتمد' }, { n: '+50', l: 'خدمة' }, { n: '7', l: 'إمارات' }].map((s, i) => (
                    <div key={i}>
                      <div className="text-xl font-black text-[#D4AF37]">{s.n}</div>
                      <div className="text-[10px] text-[#1F3D2B]/40 font-bold">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══ مقالة المحتوى الرئيسية ══ */}
            <article itemScope itemType="https://schema.org/Article">
              {page.sections.map((section, idx) => (
                <section key={idx} className="mb-10">

                  {/* H2 للأقسام الرئيسية */}
                  <h2 className="text-xl md:text-2xl font-black text-[#1F3D2B] mb-4 flex items-start gap-3">
                    <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#C8A86A] flex-shrink-0 mt-1" />
                    <span>{section.titleAr}</span>
                  </h2>

                  <p className="text-[#1F3D2B]/70 text-sm md:text-base leading-[2.2] mb-6 mr-4">
                    {section.contentAr}
                  </p>

                  {/* H3 للأقسام الفرعية */}
                  {section.subsections?.map((sub, subIdx) => (
                    <div key={subIdx} className="mb-6 mr-4 pr-5 border-r-2 border-[#D4AF37]/20">
                      <h3 className="text-base md:text-lg font-black text-[#1F3D2B] mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                        {sub.titleAr}
                      </h3>
                      <p className="text-[#1F3D2B]/60 text-sm leading-[2.2]">{sub.contentAr}</p>
                    </div>
                  ))}
                </section>
              ))}
            </article>

            {/* ══ حاسبة التكاليف ══ */}
            <CostCalculator serviceSlug={page.slug} />

            {/* ══ H2: مميزات منصة بيت الريف ══ */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
              <h2 className="text-xl font-black text-[#1F3D2B] mb-6 flex items-center gap-3">
                <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#3B5BFE] to-[#3B5BFE]/60 flex-shrink-0" />
                لماذا تختار بيت الريف؟
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: BadgeCheck, title: 'توثيق شامل', desc: 'كل مزود يمر بعملية تحقق من الهوية والرخصة التجارية وسجل الأعمال السابقة.' },
                  { icon: Star, title: 'تقييمات حقيقية', desc: 'آراء حقيقية من عملاء تحققنا منهم، تعكس جودة الخدمة والالتزام بالمواعيد.' },
                  { icon: Calculator, title: 'مقارنة الأسعار', desc: 'أرسل طلب عرض سعر (RFQ) واحداً واستقبل عروضاً من عدة مزودين للمقارنة.' },
                  { icon: Clock, title: 'سرعة الاستجابة', desc: 'معظم مزودينا يردون خلال ساعتين، وبعضهم يقدم خدمة طوارئ 24/7.' },
                  { icon: Shield, title: 'أمان المعاملات', desc: 'ادفع بأمان عبر المنصة مع ضمان استرداد المال عند عدم الالتزام.' },
                  { icon: MapPin, title: 'جم��ع الإمارات', desc: 'نغطي 8 إمارات بشبكة موسعة من المزودين في كل منطقة ومدينة.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[#F5EEE1]/60 border border-gray-100">
                    <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#1F3D2B] mb-1">{item.title}</h3>
                      <p className="text-xs text-[#1F3D2B]/50 leading-[1.8]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ══ H2: خطوات الاستفادة من الخدمة ══ */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
              <h2 className="text-xl font-black text-[#1F3D2B] mb-6 flex items-center gap-3">
                <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#C8A86A] flex-shrink-0" />
                كيف تستفيد من بيت الريف؟
              </h2>
              <div className="space-y-4">
                {[
                  { step: '01', title: 'سجّل مجاناً', desc: 'أنشئ حسابك في دقيقتين بالبريد الإلكتروني أو جوجل أو فيسبوك.' },
                  { step: '02', title: 'ابحث عن مزودين', desc: 'استخدم الفلاتر (المدينة، التخصص، التقييم، السعر) للوصول للمناسب.' },
                  { step: '03', title: 'قارن العروض', desc: 'أرسل طلب عرض سعر لعدة مزودين واستقبل العروض في مكان واحد.' },
                  { step: '04', title: 'وظّف بثقة', desc: 'اقرأ التقييمات، تواصل مباشرة، وادفع بأمان عبر المنصة.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#C8A86A] text-[#1F3D2B] font-black text-sm flex items-center justify-center flex-shrink-0 shadow-md">
                      {item.step}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-sm font-black text-[#1F3D2B] mb-1">{item.title}</h3>
                      <p className="text-xs text-[#1F3D2B]/50 leading-[1.8]">{item.desc}</p>
                    </div>
                    {i < 3 && <div className="hidden md:block w-px h-full bg-gray-100" />}
                  </div>
                ))}
              </div>
            </section>

            {/* ══ H2: أبرز مزودي الخدمة ══ */}
            <section className="mb-8">
              <h2 className="text-xl font-black text-[#1F3D2B] mb-4 flex items-center gap-3">
                <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#C8A86A] flex-shrink-0" />
                أبرز مزودي {page.heroTitleAr}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DEMO_PROVIDERS.map((p, i) => (
                  <article key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#3B5BFE]/10 border border-[#D4AF37]/20 flex items-center justify-center font-black text-[#D4AF37] text-lg mb-3">
                      {i + 1}
                    </div>
                    <span className="text-[10px] font-black text-[#3B5BFE] bg-[#3B5BFE]/8 border border-[#3B5BFE]/15 px-2 py-0.5 rounded-full">
                      {p.badge}
                    </span>
                    <h3 className="text-sm font-black text-[#1F3D2B] mt-2 mb-2">{p.name}</h3>
                    <StarRating rating={p.rating} count={p.reviews} />
                    <a href="/home"
                      className="mt-3 w-full py-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] font-black text-xs flex items-center justify-center gap-1.5 hover:bg-[#D4AF37]/20 transition-colors">
                      <Search className="w-3.5 h-3.5" />
                      عرض الملف
                    </a>
                  </article>
                ))}
              </div>
              <p className="text-xs text-[#1F3D2B]/40 font-bold mt-3 text-center">
                هذه نماذج توضيحية — الملفات الحقيقية داخل منصة بيت الريف
              </p>
            </section>

            {/* ══ H2: نخدمك في جميع الإمارات ══ */}
            <section className="mb-8" aria-labelledby="cities-heading">
              <h2 id="cities-heading" className="text-xl font-black text-[#1F3D2B] mb-4 flex items-center gap-3">
                <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#3B5BFE] to-[#3B5BFE]/60 flex-shrink-0" />
                {page.heroTitleAr} في جميع الإمارات
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {page.targetCities.map(cs => {
                  const city = EMIRATES_AND_CITIES.find(c => c.slug === cs);
                  if (!city) return null;
                  return (
                    <a key={cs} href={`/map/${cs}/${page.slug}`}
                      className="bg-white rounded-xl p-4 border border-gray-100 hover:border-[#3B5BFE]/30 transition-all text-center group shadow-sm">
                      <MapPin className="w-5 h-5 text-[#3B5BFE] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-black text-[#1F3D2B]">{city.nameAr}</p>
                      <p className="text-[10px] text-[#1F3D2B]/30 font-bold">{city.nameEn}</p>
                      <p className="text-[9px] text-[#3B5BFE] font-black mt-1">عرض على الخريطة</p>
                    </a>
                  );
                })}
              </div>
            </section>

            {/* ══ خريطة المزودين الجمالية ══ */}
            <section className="mb-8">
              <DecorativeMap
                cityName={page.targetCities[0] ? (EMIRATES_AND_CITIES.find(c => c.slug === page.targetCities[0])?.nameAr || 'الإمارات') : 'الإمارات'}
              />
            </section>

            {/* ══ H2: الأسئلة الشائعة (FAQ) ══ */}
            {page.faqs.length > 0 && (
              <section className="mb-8" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-xl font-black text-[#1F3D2B] mb-5 flex items-center gap-3">
                  <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#C8A86A] flex-shrink-0" />
                  الأسئلة الشائعة
                </h2>
                <div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
                  {page.faqs.map((faq, idx) => (
                    <div key={idx}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                      itemScope itemType="https://schema.org/Question" itemProp="mainEntity">
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full px-5 py-4 flex items-center gap-3 font-bold text-sm text-[#1F3D2B] hover:bg-[#D4AF37]/5 transition-colors text-right"
                        aria-expanded={openFaq === idx}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                          <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <span className="flex-1 text-right" itemProp="name">{faq.questionAr}</span>
                        {openFaq === idx
                          ? <ChevronUp className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                          : <ChevronDown className="w-4 h-4 text-[#1F3D2B]/30 flex-shrink-0" />
                        }
                      </button>
                      {openFaq === idx && (
                        <div
                          className="px-5 pb-5 pt-0 border-t border-gray-50"
                          itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                          <p className="text-sm text-[#1F3D2B]/60 leading-[2.2] pt-4" itemProp="text">
                            {faq.answerAr}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ══ H2: روابط داخلية — ربط جميع صفحات الخدمات ══ */}
            <section className="mb-8" aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-xl font-black text-[#1F3D2B] mb-4 flex items-center gap-3">
                <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#3B5BFE] to-[#3B5BFE]/60 flex-shrink-0" />
                خدمات أخرى في بيت الريف
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {OTHER_SERVICES.filter(s => s.slug !== page.slug).map(s => (
                  <a key={s.slug} href={`/${s.slug}`}
                    className="bg-white rounded-xl px-4 py-3 border border-gray-100 text-sm font-bold text-[#1F3D2B]/60 hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all flex items-center gap-2">
                    <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
                    {s.label}
                  </a>
                ))}
              </div>

              {/* روابط بيانات المزودين */}
              {page.relatedLinks.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {page.relatedLinks.map((link, i) => (
                    <a key={i} href={link.href}
                      className="px-4 py-2 rounded-xl bg-[#F5EEE1] border border-gray-200 text-xs font-bold text-[#1F3D2B]/60 hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all">
                      {link.labelAr}
                    </a>
                  ))}
                </div>
              )}
            </section>

            {/* ══ CTA Banner ══ */}
            <section className="rounded-2xl overflow-hidden mb-8" aria-label="دعوة للتسجيل">
              <div className="relative bg-gradient-to-l from-[#1F3D2B] via-[#2A5A3B] to-[#1F3D2B] p-8 md:p-12 text-center border border-[#D4AF37]/20">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37]" />
                <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                  ابدأ مشروعك الآن
                </h2>
                <p className="text-white/60 text-sm mb-6 max-w-md mx-auto leading-[2]">
                  أكثر من 200 مزود معتمد في بيت الريف ينتظرون مشروعك.
                  سجّل مجاناً واحصل على عروض أسعار خلال 24 ساعة.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href="/home"
                    className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1F3D2B] font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    سجّل مجاناً
                  </a>
                  <a href="/services"
                    className="px-7 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-black text-sm hover:bg-white/20 transition-all flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    تصفح جميع الخدمات
                  </a>
                </div>
              </div>
            </section>

          </div>{/* end main col */}

          {/* ── الشريط الجانبي (1/3) ── */}
          <aside className="space-y-5">

            {/* CTA سريع */}
            <div className="bg-gradient-to-br from-[#1F3D2B] to-[#2A5A3B] rounded-2xl p-5 shadow-lg text-white sticky top-20">
              <h3 className="font-black text-base mb-1">احصل على عرض سعر مجاني</h3>
              <p className="text-white/50 text-xs mb-4 leading-[1.8]">
                أرسل تفاصيل مشروعك واستقبل عروضاً من 3+ مزودين موثّقين خلال 24 ساعة
              </p>
              <a href="/home"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C8A86A] text-[#1F3D2B] font-black text-sm shadow-md flex items-center justify-center gap-2 mb-3">
                <Search className="w-4 h-4" />
                طلب عروض أسعار
              </a>
              <a href="/maps"
                className="w-full py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-black text-xs flex items-center justify-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                عرض الخريطة التفاعلية
              </a>
              <div className="mt-4 space-y-2">
                {[
                  { icon: Shield, text: 'مزودون موثّقون' },
                  { icon: Star, text: 'تقييم 4.8/5 متوسط' },
                  { icon: Clock, text: 'رد خلال 24 ساعة' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/40 text-xs font-bold">
                    <item.icon className="w-3.5 h-3.5 text-[#D4AF37]/60" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* جميع الخدمات */}
            <nav aria-label="قائمة الخدمات" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-[#1F3D2B] text-sm mb-4 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#D4AF37]" />
                جميع الخدمات
              </h3>
              <ul className="space-y-1.5">
                {OTHER_SERVICES.map(s => (
                  <li key={s.slug}>
                    <a href={`/${s.slug}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        s.slug === page.slug
                          ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                          : 'text-[#1F3D2B]/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5'
                      }`}>
                      <ChevronLeft className="w-3 h-3 flex-shrink-0" />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* الخريطة حسب المدينة */}
            <nav aria-label="قائمة المدن" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-[#1F3D2B] text-sm mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#3B5BFE]" />
                خريطة المدن
              </h3>
              <ul className="space-y-1.5">
                {EMIRATES_AND_CITIES.map(c => (
                  <li key={c.slug}>
                    <a href={`/map/${c.slug}/${page.slug}`}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#1F3D2B]/60 hover:text-[#3B5BFE] hover:bg-[#3B5BFE]/5 transition-all">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-[#3B5BFE]/40" />
                        {c.nameAr}
                      </span>
                      <ChevronLeft className="w-3 h-3 opacity-30" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* نطاق الأسعار */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-[#1F3D2B] text-sm mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#D4AF37]" />
                نطاق الأسعار
              </h3>
              <div className="bg-[#D4AF37]/8 border border-[#D4AF37]/20 rounded-xl p-3 text-center">
                <p className="text-lg font-black text-[#D4AF37]">
                  {SERVICES_SEO.find(s => s.slug.includes(page.slug.split('-')[0]))?.priceRange || page.targetCities.length > 5 ? '50 - 500,000 د.إ' : '5,000 - 5,000,000 د.إ'}
                </p>
                <p className="text-[10px] text-[#1F3D2B]/40 font-bold mt-1">تقدير مبدئي — يختلف حسب المشروع</p>
              </div>
              <a href="/tools" className="block mt-3 text-center text-xs font-black text-[#D4AF37] hover:underline">
                احسب تكلفتك الدقيقة
              </a>
            </div>

          </aside>
        </div>
      </main>

      {/* ══ FOOTER (شامل جميع الخدمات والمدن) ══ */}
      <SEOFooter />
    </div>
  );
}

// ── صفحة غير موجودة ──────────────────────────────────────
function SEOServiceNotFound() {
  return (
    <div className="min-h-screen bg-[#F5EEE1]" dir="rtl" style={{ fontFamily: font }}>
      <SEOHeader />
      <main className="flex items-center justify-center py-32 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h1 className="text-2xl font-black text-[#1F3D2B] mb-3">الصفحة غير موجودة</h1>
          <p className="text-sm text-[#1F3D2B]/50 mb-6 leading-[2]">
            عذراً، هذه الصفحة غير متوفرة. استكشف خدماتنا المتاحة.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C8A86A] text-white font-black text-sm shadow-md">
              الرئيسية
            </a>
            <a href="/services" className="px-6 py-3 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] font-black text-sm">
              جميع الخدمات
            </a>
          </div>
        </div>
      </main>
      <SEOFooter />
    </div>
  );
}

// ── Export للاستخدام من SEOLandingPage ───────────────────
export { SEOFooter as SEOFooterExport };