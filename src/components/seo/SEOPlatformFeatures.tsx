import { useEffect } from 'react';
import { SEOHeader, SEOFooter } from './SEONav';
import { Building2, Store, LayoutDashboard, MapPin, Search, Star, Shield, ArrowLeft, Filter, ShoppingCart, BarChart3, TrendingUp, Users, Cpu, Wrench, BookOpen, Truck } from 'lucide-react';
import { SITE_DOMAIN, SITE_NAME_AR, EMIRATES_AND_CITIES, SERVICES_SEO } from '../../utils/seoConstants';
import { SEOHead, SEO_PAGE_CONFIGS } from './SEOHead';
import { WebPImage } from './WebPImage';

// ══════════════════════════════════════════════════════════
// صور Unsplash مفتوحة المصدر — ستُستبدل بـ /public/images/{page}/*.webp
// ══════════════════════════════════════════════════════════

// ── Marketplace (9 صور) ──
const MP = {
  hero:     'https://images.unsplash.com/photo-1762536859942-8076505f7c62?w=1440&q=85',
  overview: 'https://images.unsplash.com/photo-1657812159075-7f0abd98f7b8?w=900&q=85',
  map:      'https://images.unsplash.com/photo-1588276894612-a4b26f4cf7a0?w=900&q=85',
  verified: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?w=900&q=85',
  workers:  'https://images.unsplash.com/photo-1758876734777-dcc6981f3671?w=900&q=85',
  quote:    'https://images.unsplash.com/photo-1738618139780-dc7478cf72f2?w=900&q=85',
  compare:  'https://images.unsplash.com/photo-1532795986-dbef1643a596?w=900&q=85',
  collab:   'https://images.unsplash.com/photo-1758873268663-5a362616b5a7?w=900&q=85',
  villa:    'https://images.unsplash.com/photo-1635286729762-d3e53c422b43?w=900&q=85',
};

// ── Store (9 صور) ──
const ST = {
  hero:      'https://images.unsplash.com/photo-1774314250523-a5f112b41c16?w=1440&q=85',
  store3d:   'https://images.unsplash.com/photo-1670222061552-c273834aee0c?w=900&q=85',
  catalog:   'https://images.unsplash.com/photo-1701994459683-5515866e7093?w=900&q=85',
  interior:  'https://images.unsplash.com/photo-1760072513367-55182245e76c?w=1440&q=85',
  materials: 'https://images.unsplash.com/photo-1643902917449-98c7ef8c9685?w=900&q=85',
  delivery:  'https://images.unsplash.com/photo-1681514583222-0579e6835666?w=900&q=85',
  compare:   'https://images.unsplash.com/photo-1532795986-dbef1643a596?w=900&q=85',
  smart:     'https://images.unsplash.com/photo-1753039495488-434a2fe53e41?w=900&q=85',
  map:       'https://images.unsplash.com/photo-1588276894612-a4b26f4cf7a0?w=900&q=85',
};

// ── Dashboards (9 صور) ──
const DB = {
  main:       'https://images.unsplash.com/photo-1758691736483-5f600b509962?w=1440&q=85',
  financial:  'https://images.unsplash.com/photo-1763038311036-6d18805537e5?w=900&q=85',
  crm:        'https://images.unsplash.com/photo-1529465230221-a0d10e46fcbb?w=900&q=85',
  aiTools:    'https://images.unsplash.com/photo-1763568258143-904ea924ac53?w=900&q=85',
  seoRank:    'https://images.unsplash.com/photo-1674027001860-f9e3a94f4084?w=900&q=85',
  team:       'https://images.unsplash.com/photo-1758873268663-5a362616b5a7?w=900&q=85',
  contract:   'https://images.unsplash.com/photo-1710447503676-1efbd5cd8a46?w=900&q=85',
  realestate: 'https://images.unsplash.com/photo-1635286729762-d3e53c422b43?w=900&q=85',
  analytics:  'https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?w=900&q=85',
};

// ── Platform (10 صور) ──
const PL = {
  overview:    'https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?w=1440&q=85',
  wayakAgent:  'https://images.unsplash.com/photo-1525338078858-d762b5e32f2c?w=900&q=85',
  aiTools:     'https://images.unsplash.com/photo-1753039495488-434a2fe53e41?w=900&q=85',
  complex:     'https://images.unsplash.com/photo-1763568258143-904ea924ac53?w=900&q=85',
  taskMgmt:    'https://images.unsplash.com/photo-1529465230221-a0d10e46fcbb?w=900&q=85',
  geoDecoding: 'https://images.unsplash.com/photo-1674027001860-f9e3a94f4084?w=900&q=85',
  seoVsGeo:    'https://images.unsplash.com/photo-1532795986-dbef1643a596?w=900&q=85',
  audience:    'https://images.unsplash.com/photo-1758873268663-5a362616b5a7?w=900&q=85',
  aiEvol:      'https://images.unsplash.com/photo-1758691736483-5f600b509962?w=900&q=85',
  quote:       'https://images.unsplash.com/photo-1738618139780-dc7478cf72f2?w=900&q=85',
};

// ── Tools (8 صور) ──
const TL = {
  hero:     'https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=1440&q=85',
  design3d: 'https://images.unsplash.com/photo-1769149068959-b11392164add?w=900&q=85',
  compare:  'https://images.unsplash.com/photo-1532795986-dbef1643a596?w=900&q=85',
  lighting: 'https://images.unsplash.com/photo-1655181743924-e51e11075697?w=900&q=85',
  contract: 'https://images.unsplash.com/photo-1710447503676-1efbd5cd8a46?w=900&q=85',
  whyUs:    'https://images.unsplash.com/photo-1762536859942-8076505f7c62?w=900&q=85',
  collab:   'https://images.unsplash.com/photo-1758873268663-5a362616b5a7?w=900&q=85',
  digital:  'https://images.unsplash.com/photo-1763568258143-904ea924ac53?w=900&q=85',
};

// mapping للأسماء القديمة → الجديدة (لتوافق الكود أدناه)
const uaeNetworkImg           = MP.workers;
const storeDigitalImg         = ST.hero;
const createStoreImg          = ST.store3d;
const dashboardSeoImg         = DB.main;
const crmTemplatesImg         = DB.crm;
const aiSearchImg             = DB.aiTools;
const aiProfileImg            = PL.wayakAgent;
const weyyakIntroImg          = PL.overview;
const complexRequestsImg      = PL.complex;
const weyyakTaskImg           = PL.taskMgmt;
const smartAgentsTeamImg      = PL.aiTools;
const decodingGeoImg          = PL.geoDecoding;
const seoVsGeoImg             = PL.seoVsGeo;
const audienceTriadImg        = PL.audience;
const aiVisibilityEvolutionImg = PL.aiEvol;
const amirQuoteImg            = PL.quote;
const whyBietAlreefImg        = TL.whyUs;
const comprehensiveSolutionImg = TL.collab;
const buildingCalculatorImg   = TL.hero;
const priceComparatorImg      = TL.compare;
const lightingCalculatorImg   = TL.lighting;
const threeDDesignImg         = TL.design3d;
const contractsManagementImg  = TL.contract;
const createStoreImgAlt       = ST.catalog;

const font = 'Cairo, Tajawal, sans-serif';

function setSEO(title: string, desc: string, urlPath: string) {
  document.title = `${title} | ${SITE_NAME_AR}`;
  let el = document.querySelector(`meta[name="description"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', 'description'); document.head.appendChild(el); }
  el.setAttribute('content', desc);
  
  let canon = document.querySelector(`link[rel="canonical"]`);
  if (!canon) { canon = document.createElement('link'); canon.setAttribute('rel', 'canonical'); document.head.appendChild(canon); }
  canon.setAttribute('href', `${SITE_DOMAIN}${urlPath}`);
}

// ══════════════════════════════════════════
// 1. SEO Marketplace Page
// ══════════════════════════════════════════
export function SEOMarketplacePage() {
  useEffect(() => {
    setSEO(
      'سوق المقاولات والخدمات (Marketplace)',
      'تصفح سوق المقاولات والخدمات في منصة بيت الريف. اعثر على آلاف المقاولين والحرفيين المعتمدين مع نظام خرائط تفاعلي للوصول لأقرب المزودين في الإمارات.',
      '/seo/marketplace'
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#F5EEE1] text-[#1A1A1A]" dir="rtl" style={{ fontFamily: font }}>
      <SEOHead {...SEO_PAGE_CONFIGS.marketplace}
        breadcrumbs={[{ name: 'سوق المقاولات', url: '/seo/marketplace' }]}
        service={{ name: 'سوق المقاولات والخدمات', description: 'سوق رقمي يجمع أصحاب المشاريع بأفضل المقاولين والمزودين في الإمارات', areaServed: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'UAE'] }}
      />
      <SEOHeader />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-[#3B5BFE]/10 flex items-center justify-center mb-6">
            <Building2 className="w-8 h-8 text-[#3B5BFE]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            سوق المقاولات والخدمات <span className="text-[#3B5BFE]">Marketplace</span>
          </h1>
          <p className="text-[#1A1A1A]/70 text-lg max-w-3xl leading-relaxed mb-8">
            الماركت بليس في منصة بيت الريف هو السوق الذكي والأكبر في الإمارات الذي يجمع أصحاب المشاريع بأفضل المقاولين، المكاتب الهندسية، والحرفيين. صُمم الماركت بليس ليكون محرك بحث تفاعلي يتيح لك مقارنة عروض الأسعار واختيار الأنسب لمشروعك بسهولة.
          </p>

          {/* صورة 1: Hero الماركت بليس */}
          <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm mb-10">
            <WebPImage src={MP.hero} alt="منصة بيت الريف لسوق المقاولات والبناء في الإمارات العربية المتحدة" className="w-full h-auto rounded-2xl object-cover" loading="eager" />
          </div>

          {/* صورة 2: نظرة عامة على المنصة */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <WebPImage src={MP.overview} alt="نظرة عامة على سوق بيت الريف — أكبر منصة مقاولات في الإمارات" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
            {/* صورة 3: الخريطة */}
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <WebPImage src={MP.map} alt="خريطة تفاعلية ذكية لتوزيع المقاولين والمزودين في كافة الإمارات" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all">
              <MapPin className="w-6 h-6 text-[#D4AF37] mb-3" />
              <h3 className="font-bold mb-2">نظام الخرائط الذكي</h3>
              <p className="text-sm text-[#1A1A1A]/60">شاهد توزيع المقاولين والمزودين على خريطة تفاعلية لاكتشاف الأقرب لموقع مشروعك في كافة الإمارات.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all">
              <Filter className="w-6 h-6 text-[#D4AF37] mb-3" />
              <h3 className="font-bold mb-2">فلاتر بحث متقدمة</h3>
              <p className="text-sm text-[#1A1A1A]/60">تصفية النتائج بناءً على التقييم، سابقة الأعمال، الميزانية، أو توفر شهادات اعتماد معينة للشركات.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all">
              <Shield className="w-6 h-6 text-[#D4AF37] mb-3" />
              <h3 className="font-bold mb-2">مزودون موثقون</h3>
              <p className="text-sm text-[#1A1A1A]/60">كل المقاولين والشركات المدرجة في السوق تم التحقق من تراخيصهم الرسمية لضمان جودة العمل والثقة.</p>
            </div>
          </div>

          {/* صورة 4: مزودون موثقون */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <WebPImage src={MP.verified} alt="مزودو الخدمات الموثقون والمعتمدون في بيت الريف — ضمان الجودة" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
            {/* صورة 5: فريق العمل */}
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <WebPImage src={MP.workers} alt="فرق عمل البناء المحترفة في مواقع الإنشاء بالإمارات" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
          </div>

          {/* صورة 6: طلب عرض سعر */}
          <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm mb-10">
            <WebPImage src={MP.quote} alt="طلب عروض الأسعار بسهولة من أفضل المقاولين في الإمارات" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
          </div>

          {/* صورة 7 + 8: مقارنة + تعاون */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <WebPImage src={MP.compare} alt="مقارنة عروض الأسعار من مزودين متعددين — اختر الأفضل" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <WebPImage src={MP.collab} alt="إدارة مشاريع البناء بشكل احترافي وتعاوني" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
          </div>

          {/* صورة 9: عقارات وفلل */}
          <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
            <WebPImage src={MP.villa} alt="مشاريع الفلل والعقارات الفاخرة في الإمارات — بيت الريف" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
          </div>
        </div>
      </div>
      <SEOFooter />
    </div>
  );
}

// ══════════════════════════════════════════
// 2. SEO Store Page
// ══════════════════════════════════════════
export function SEOStorePage() {
  useEffect(() => {
    setSEO(
      'المتجر ومواد البناء (Store)',
      'تسوق من متجر بيت الريف كافة مواد البناء، التشطيب، والديكور الداخلي من أفضل الموردين في الإمارات مع إمكانية عرض معارض المواد على الخريطة.',
      '/seo/store'
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#F5EEE1] text-[#1A1A1A]" dir="rtl" style={{ fontFamily: font }}>
      <SEOHead {...SEO_PAGE_CONFIGS.store}
        breadcrumbs={[{ name: 'متجر مواد البناء', url: '/seo/store' }]}
        service={{ name: 'متجر مواد البناء والتشطيب', description: 'تسوق مواد البناء والتشطيب والأثاث والديكور من أفضل الموردين في الإمارات', priceRange: '10 - 500000 AED', areaServed: ['Dubai', 'Abu Dhabi', 'Sharjah', 'UAE'] }}
      />
      <SEOHeader />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-6">
            <Store className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            متجر مواد البناء والتشطيب <span className="text-[#D4AF37]">Store</span>
          </h1>
          <p className="text-[#1A1A1A]/70 text-lg max-w-3xl leading-relaxed mb-8">
            المتجر الشامل لكل احتياجاتك من مواد البناء الأساسية، منتجات التشطيب، الأثاث، والديكور الداخلي. يوفر التطبيق تجربة تسوق سلسة مع تصنيفات دقيقة تغطي السيراميك، الأصباغ، الإضاءة، والمزيد بأسعار تنافسية من الموردين مباشرة.
          </p>

          {/* صورة 1: Hero المتجر */}
          <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm mb-10">
            <WebPImage src={ST.hero} alt="متجر مواد البناء والتشطيب في بيت الريف — تسوق من أفضل الموردين" className="w-full h-auto rounded-2xl object-cover" loading="eager" />
          </div>

          {/* صورة 2 + 3 */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <WebPImage src={ST.store3d} alt="متجر الأثاث ومواد الديكور ثلاثي الأبعاد — تجربة تسوق مبتكرة" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <WebPImage src={ST.catalog} alt="كتالوج السيراميك والبلاط وأدوات التشطيب — أسعار مباشرة من المورد" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all">
              <ShoppingCart className="w-6 h-6 text-[#3B5BFE] mb-3" />
              <h3 className="font-bold mb-2">تسوق مباشر وسهل</h3>
              <p className="text-sm text-[#1A1A1A]/60">أضف المنتجات لسلة التسوق، قارن بين العلامات التجارية، واطلب تسعرة للجملة للمشاريع الكبيرة.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all">
              <MapPin className="w-6 h-6 text-[#3B5BFE] mb-3" />
              <h3 className="font-bold mb-2">خرائط المعارض</h3>
              <p className="text-sm text-[#1A1A1A]/60">استكشف مواقع معارض المواد ومخازن الموردين الأقرب إليك على خريطة المتجر التفاعلية.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all">
              <Star className="w-6 h-6 text-[#3B5BFE] mb-3" />
              <h3 className="font-bold mb-2">تقييمات المنتجات</h3>
              <p className="text-sm text-[#1A1A1A]/60">اعتمد على تجارب وآراء المشترين السابقين قبل اتخاذ قرار الشراء لضمان أفضل جودة.</p>
            </div>
          </div>

          {/* صورة 4: تصميم داخلي */}
          <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm mb-10">
            <WebPImage src={ST.interior} alt="تصميم داخلي فاخر — معرض مواد التشطيب والديكور في بيت الريف" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
          </div>

          {/* صورة 5 + 6 + 7 */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <WebPImage src={ST.materials} alt="عينات الطلاء والسيراميك والأرضيات — اختر مواد تشطيبك بثقة" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <WebPImage src={ST.compare} alt="مقارنة أسعار مواد البناء — احصل على أفضل سعر" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <WebPImage src={ST.smart} alt="منتجات المنزل الذكي والتقنيات الحديثة للبناء" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
          </div>

          {/* صورة 8 + 9 */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <WebPImage src={ST.delivery} alt="خدمة توصيل مواد البناء السريع — الإمارات" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <WebPImage src={ST.map} alt="خريطة معارض الموردين في الإمارات — ابحث عن الأقرب" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
      <SEOFooter />
    </div>
  );
}

// ══════════════════════════════════════════
// 3. SEO Dashboards Page
// ══════════════════════════════════════════
export function SEODashboardsPage() {
  useEffect(() => {
    setSEO(
      'لوحات التحكم الذكية (Dashboards)',
      'استكشف لوحات التحكم الاحترافية للمزودين في منصة بيت الريف. تحليلات السوق، إدارة المشاريع، ومتابعة الأداء المالي بتقارير دقيقة ومباشرة.',
      '/seo/dashboards'
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#F5EEE1] text-[#1A1A1A]" dir="rtl" style={{ fontFamily: font }}>
      <SEOHead {...SEO_PAGE_CONFIGS.dashboards}
        breadcrumbs={[{ name: 'لوحات التحكم', url: '/seo/dashboards' }]}
        service={{ name: 'لوحات التحكم الاحترافية', description: '11 قالب داشبورد متخصص لإدارة الأعمال في قطاع البناء والخدمات في الإمارات' }}
      />
      <SEOHeader />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-[#3B5BFE]/10 flex items-center justify-center mb-6">
            <LayoutDashboard className="w-8 h-8 text-[#3B5BFE]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            لوحات التحكم الاحترافية <span className="text-[#3B5BFE]">Dashboards</span>
          </h1>
          <h2 className="text-xl text-[#1A1A1A]/80 font-bold mb-6">
            11 قالب داشبورد متخصص لإدارة أعمالك بذكاء في الإمارات
          </h2>
          <p className="text-[#1A1A1A]/70 text-lg max-w-3xl leading-relaxed mb-8">
            توفر منصة بيت الريف للمقاولين ومزودي الخدمات لوحات تحكم (Dashboards) متطورة تُعد بمثابة مركز قيادة كامل. من خلالها يمكنك متابعة عملياتك، تحليل بيانات السوق الإماراتي، ومراقبة نمو أعمالك بشكل لحظي. استكشف قوالب الـ CRM المتخصصة المصممة لكل قطاع.
          </p>

          {/* 11 Dashboards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              { id: 'real_estate', name: 'العقارات', desc: 'إدارة عقارات، مستأجرين، وعقود الإيجار بذكاء.', icon: Building2, color: 'text-[#3B5BFE]', bg: 'bg-[#3B5BFE]/10' },
              { id: 'contracting', name: 'المقاولات', desc: 'إدارة المشاريع، المناقصات، وجدولة فرق العمل.', icon: Wrench, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10' },
              { id: 'interior', name: 'التصميم الداخلي', desc: 'مشاريع تصميم، عملاء، وملفات إبداعية وعروض أسعار.', icon: Star, color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10' },
              { id: 'healthcare', name: 'الرعاية الصحية', desc: 'سجلات المرضى، المواعيد، والفوترة الطبية.', icon: Users, color: 'text-[#8D6E63]', bg: 'bg-[#8D6E63]/10' },
              { id: 'legal', name: 'الخدمات القانونية', desc: 'إدارة القضايا، متابعة الجلسات، وأرشيف المستندات.', icon: Shield, color: 'text-[#1E3A8A]', bg: 'bg-[#1E3A8A]/10' },
              { id: 'education', name: 'التعليم', desc: 'سجلات الطلاب، الدورات، ونتائج الاختبارات.', icon: BookOpen, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
              { id: 'retail', name: 'التجزئة', desc: 'إدارة المبيعات، المخزون، وتحليلات العملاء.', icon: Store, color: 'text-[#EC4899]', bg: 'bg-[#EC4899]/10' },
              { id: 'automotive', name: 'السيارات', desc: 'صيانة المركبات، المبيعات، وإدارة العملاء.', icon: Truck, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
              { id: 'finance', name: 'الخدمات المالية', desc: 'المحاسبة، الفواتير، والتقارير المالية الدقيقة.', icon: BarChart3, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
              { id: 'it', name: 'تقنية المعلومات', desc: 'إدارة المشاريع البرمجية، الدعم الفني، والتذاكر.', icon: Cpu, color: 'text-[#06B6D4]', bg: 'bg-[#06B6D4]/10' },
              { id: 'fitness', name: 'الصحة واللياقة', desc: 'إدارة الأعضاء، الاشتراكات، وجداول التدريب.', icon: TrendingUp, color: 'text-[#F43F5E]', bg: 'bg-[#F43F5E]/10' },
            ].map(d => (
              <div key={d.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${d.bg}`}>
                  <d.icon className={`w-6 h-6 ${d.color}`} />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{d.name}</h3>
                <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-black mb-6 text-[#1A1A1A]">كيف يرى Google والذكاء الاصطناعي نشاطك التجاري؟</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <WebPImage src={dashboardSeoImg} alt="كيف يرى Google والذكاء الاصطناعي نشاطك" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
              <WebPImage src={crmTemplatesImg} alt="قوالب الداشبورد المتعددة" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm md:col-span-2">
              <WebPImage src={aiSearchImg} alt="عصر جديد للبحث: تهيئة نشاطك التجاري لتصدر محركات الذكاء الاصطناعي" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all">
              <BarChart3 className="w-6 h-6 text-[#D4AF37] mb-3" />
              <h3 className="font-bold mb-2">إدارة المشاريع والمهام</h3>
              <p className="text-sm text-[#1A1A1A]/60">تتبع تقدم مشاريعك الجارية، أدر فرق العمل، ونظم جداول التسليم في واجهة مرئية سهلة القراءة.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all">
              <TrendingUp className="w-6 h-6 text-[#D4AF37] mb-3" />
              <h3 className="font-bold mb-2">تحليلات الأداء والسوق</h3>
              <p className="text-sm text-[#1A1A1A]/60">تقارير بيانية دقيقة توضح مستوى تفاعل العملاء مع بروفايل شركتك ومقارنة أدائك بالمنافسين في السوق.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all">
              <Users className="w-6 h-6 text-[#D4AF37] mb-3" />
              <h3 className="font-bold mb-2">إدارة علاقات العملاء</h3>
              <p className="text-sm text-[#1A1A1A]/60">نظام CRM مدمج لمتابعة استفسارات العملاء، إدارة عروض الأسعار المفتوحة، وتاريخ المعاملات لكل عميل.</p>
            </div>
          </div>
        </div>
      </div>
      <SEOFooter />
    </div>
  );
}

// ══════════════════════════════════════════
// 4. SEO Platform Overview Page
// ══════════════════════════════════════════
export function SEOPlatformPage() {
  useEffect(() => {
    setSEO(
      'نظرة شاملة على منصة بيت الريف (Biet Alreef Platform)',
      'تعرف على منصة بيت الريف، المنظومة الرقمية الشاملة لقطاع البناء في الإمارات. اكتشف النظام المتكامل، الماركت بليس، المساعد الذكي وياك، ولوحات التحكم.',
      '/seo/platform'
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#F5EEE1] text-[#1A1A1A]" dir="rtl" style={{ fontFamily: font }}>
      <SEOHead {...SEO_PAGE_CONFIGS.platform}
        breadcrumbs={[{ name: 'نظرة عامة على المنصة', url: '/seo/platform' }]}
      />
      <SEOHeader />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-6">
            <Cpu className="w-8 h-8 text-[#D4AF37]" />
          </div>
          
          {/* SEO H1 Tag */}
          <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            دليل المنظومة المتكاملة لمنصة بيت الريف <span className="text-[#3B5BFE] block mt-2 text-2xl md:text-3xl">السوق الأكبر لقطاع البناء والمقاولات في الإمارات</span>
          </h1>
          
          <div className="prose prose-lg text-[#1A1A1A]/70 max-w-none mb-12">
            <p>
              تتجاوز "بيت الريف" كونها مجرد تطبيق، فهي منظومة عمل سحابية متكاملة (SaaS) صُممت خصيصاً لتطوير ورقمنة قطاع المقاولات، التشطيب، والصيانة في دولة الإمارات العربية المتحدة. تجمع المنصة بذكاء بين سوق خدمات البناء (الماركت بليس)، متجر مواد البناء، ونظام الخرائط التفاعلية الذكية لتوفير الوقت والجهد على أصحاب المشاريع والمزودين.
            </p>
            <p>
              بفضل اعتمادها على أحدث تقنيات الذكاء الاصطناعي من خلال المساعد الذكي "وياك"، تقدم المنصة أدوات تسويق وتحليل بيانات متطورة تتيح للمحترفين تصدر نتائج البحث (SEO) والذكاء الاصطناعي (GEO)، وتغيير قواعد اللعبة في إدارة المشاريع والتسويق الرقمي للمحترفين.
            </p>
          </div>

          <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm mb-12">
            <WebPImage src={aiProfileImg} alt="إنشاء ملف نشاط متوافق مع بحث الذكاء الاصطناعي في منصة بيت الريف" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
          </div>

          {/* SEO H2 Tag - Section 1 */}
          <h2 className="text-2xl md:text-3xl font-black text-[#1A1A1A] mb-8 border-b-2 border-[#D4AF37] pb-3 inline-block">
            المكونات الرئيسية لمنظومة بيت الريف
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center hover:shadow-md transition-shadow">
              <Building2 className="w-10 h-10 text-[#3B5BFE] mb-4" />
              <h3 className="text-xl font-bold mb-3">سوق المقاولات والخدمات (Marketplace)</h3>
              <p className="text-[#1A1A1A]/70 leading-relaxed text-sm">
                سواء كنت صاحب فيلا يبحث عن مقاول موثوق، أو شركة تبحث عن مورد لمواد البناء، أو حتى محترف يرغب في تسويق خدماته وإدارة فريق عمله — سوق بيت الريف يجمع كل ذلك في مكان واحد بميزات استثنائية وثيم زجاجي عصري وسلس. يمكنك طلب عروض أسعار ومقارنة أفضل المزودين.
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center hover:shadow-md transition-shadow">
              <MapPin className="w-10 h-10 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-3">منظومة الخرائط المتصلة الدقيقة</h3>
              <p className="text-[#1A1A1A]/70 leading-relaxed text-sm">
                كل خدمة، مقاول، متجر، أو عرض أسعار في المنصة مرتبط بنظام خرائط دقيق. هذا الربط الجغرافي يتيح لك رؤية نطاق العمل للمقاولين، تقليل تكاليف النقل عبر اختيار الأقرب، واكتشاف الموردين في دبي، أبوظبي، الشارقة وكافة الإمارات بضغطة زر.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center hover:shadow-md transition-shadow">
              <LayoutDashboard className="w-10 h-10 text-[#3B5BFE] mb-4" />
              <h3 className="text-xl font-bold mb-3">لوحات التحكم الاحترافية (Dashboards & CRM)</h3>
              <p className="text-[#1A1A1A]/70 leading-relaxed text-sm">
                أكثر من 11 نموذجاً للوحات التحكم مصممة خصيصاً لمختلف القطاعات مثل المقاولات، العقارات، التصميم الداخلي وغيرها. تتيح للمزودين إدارة المشاريع، تتبع العقود، ومراقبة أداء المبيعات بفضل أدوات CRM المتطورة المدمجة بالكامل.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center hover:shadow-md transition-shadow">
              <Star className="w-10 h-10 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-3">الأدوات الذكية وحاسبة التكاليف</h3>
              <p className="text-[#1A1A1A]/70 leading-relaxed text-sm">
                توفر المنصة ترسانة من الأدوات التي تدير مشروعك مثل حاسبة مواد البناء، أداة مقارنة الأسعار، حاسبة الإضاءة، ونظام إدارة وتوثيق العقود الرقمية لحفظ حقوق جميع الأطراف.
              </p>
            </div>
          </div>

          {/* ═══ How the Platform Works ═══ */}
          <div className="mt-20 border-t border-gray-200 pt-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B5BFE]/10 border border-[#3B5BFE]/20 mb-4 shadow-sm">
                <Search className="w-4 h-4 text-[#3B5BFE]" />
                <span className="text-sm font-bold text-[#3B5BFE]">دليل الاستخدام والخطوات</span>
              </div>
              
              {/* SEO H2 Tag - Section 2 */}
              <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-4">
                كيف تعمل منصة بيت الريف؟
              </h2>
              <p className="text-[#1A1A1A]/60 max-w-2xl mx-auto text-lg">
                آلية عمل المنصة مصممة لتكون سلسة وشفافة. من مرحلة الاستكشاف الأولى إلى مرحلة الضمان الختامي عبر 4 مراحل بسيطة:
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Stage 1 */}
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-[#3B5BFE] to-[#5B7AFF]" />
                <div className="w-12 h-12 rounded-full bg-[#3B5BFE]/10 flex items-center justify-center mb-4 text-[#3B5BFE] font-black text-xl">
                  1
                </div>
                <h3 className="font-black text-xl mb-2 text-[#1A1A1A]">استكشاف الخدمات</h3>
                <p className="text-sm text-[#1A1A1A]/70 mb-4">تصفح حر وبدون حواجز لكافة الخدمات، وفلترة ذكية باستخدام مساعد الذكاء الاصطناعي.</p>
              </div>

              {/* Stage 2 */}
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-[#D4AF37] to-[#F1D570]" />
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4 text-[#D4AF37] font-black text-xl">
                  2
                </div>
                <h3 className="font-black text-xl mb-2 text-[#1A1A1A]">طلب عرض سعر</h3>
                <p className="text-sm text-[#1A1A1A]/70 mb-4">قدم طلبك بسهولة أو استخدم وياك لتحليل طلبك المعقد وإرساله لأفضل المزودين المعتمدين.</p>
              </div>

              {/* Stage 3 */}
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-[#9C27B0] to-[#B05BCE]" />
                <div className="w-12 h-12 rounded-full bg-[#9C27B0]/10 flex items-center justify-center mb-4 text-[#9C27B0] font-black text-xl">
                  3
                </div>
                <h3 className="font-black text-xl mb-2 text-[#1A1A1A]">التنفيذ وإدارة المشروع</h3>
                <p className="text-sm text-[#1A1A1A]/70 mb-4">توقيع العقود رقمياً، متابعة الإنجاز خطوة بخطوة، مع لوحات تحكم دقيقة لكل الأطراف.</p>
              </div>

              {/* Stage 4 */}
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-[#3B5BFE] to-[#D4AF37]" />
                <div className="w-12 h-12 rounded-full bg-[#3B5BFE]/10 flex items-center justify-center mb-4 text-[#3B5BFE] font-black text-xl">
                  4
                </div>
                <h3 className="font-black text-xl mb-2 text-[#1A1A1A]">الاستلام والضمان</h3>
                <p className="text-sm text-[#1A1A1A]/70 mb-4">دفع آمن، استلام نهائي موثق، وتفعيل فوري للضمان على الخدمات المنفذة.</p>
              </div>
            </div>
          </div>

          {/* ═══ Weyyak AI Dedicated Section ═══ */}
          <div className="mt-20 border-t border-gray-200 pt-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B5BFE]/10 border border-[#3B5BFE]/20 mb-4 shadow-sm">
                <Cpu className="w-4 h-4 text-[#3B5BFE]" />
                <span className="text-sm font-bold text-[#3B5BFE]">ذكاء اصطناعي حصري</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-4">
                المساعد الذكي <span className="text-[#3B5BFE]">وياك (Weyyak)</span>
              </h2>
              <p className="text-[#1A1A1A]/60 max-w-2xl mx-auto text-lg">
                وكيلك التنفيذي الخاص الذي يعمل على مدار الساعة. ليس مجرد روبوت محادثة، بل نظام متكامل يفهم طلباتك المعقدة، يُدير حملاتك، ويربطك بأفضل المزودين.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Weyyak Intro */}
              <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <WebPImage src={weyyakIntroImg} alt="تعرف على وياك: وكيلك التنفيذي وليس مجرد شات" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
              </div>

              {/* Complex Requests */}
              <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <WebPImage src={complexRequestsImg} alt="كيف يفهم وياك طلباتك المعقدة؟" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Weyyak Task */}
              <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <WebPImage src={weyyakTaskImg} alt="كيف يحول وياك كل طلب إلى مهمة واضحة" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
              </div>

              {/* Smart Agents Team */}
              <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <WebPImage src={smartAgentsTeamImg} alt="فريق وكلائك الذكي" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
              </div>
            </div>
          </div>

          {/* ═══ GEO (Generative Engine Optimization) Section ═══ */}
          <div className="mt-20 border-t border-gray-200 pt-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4 shadow-sm">
                <Search className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm font-bold text-[#D4AF37]">الظهور في عصر الذكاء الاصطناعي</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-4">
                تهيئة محركات التوليد <span className="text-[#D4AF37]">(GEO)</span>
              </h2>
              <p className="text-[#1A1A1A]/60 max-w-2xl mx-auto text-lg">
                مع تغير سلوك المستخدمين واعتمادهم على مساعدات الذكاء الاصطناعي، بيت الريف هو بوابتك لتصدر نتائج البحث في النماذج اللغوية الكبيرة (LLMs) لضمان وصولك للعملاء بدقة.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Decoding GEO */}
              <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <WebPImage src={decodingGeoImg} alt="فك شفرة الـ GEO" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
              </div>

              {/* SEO vs GEO */}
              <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <WebPImage src={seoVsGeoImg} alt="الـ GEO هو أمين المكتبة، والـ SEO هو الفهرس" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8 items-center">
              {/* Audience Triad */}
              <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <WebPImage src={audienceTriadImg} alt="ثلاثية الجماهير الجديدة: الإنسان، الخوارزمية، الذكاء الاصطناعي" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
              </div>

              {/* AI Visibility Evolution & Quote */}
              <div className="space-y-8">
                <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                  <WebPImage src={aiVisibilityEvolutionImg} alt="تطور الظهور في عصر الذكاء الاصطناعي" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
                </div>
                <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                  <WebPImage src={amirQuoteImg} alt="الزيارات العضوية ستزيد ولن تقل في عصر الذكاء الاصطناعي" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
             <a
              href="/home"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#3B5BFE] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              انضم للمنصة الآن مجاناً
              <ArrowLeft className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <SEOFooter />
    </div>
  );
}

// ══════════════════════════════════════════
// 5. SEO External Tools Page
// ══════════════════════════════════════════
export function SEOExternalToolsPage() {
  useEffect(() => {
    setSEO(
      'الأدوات الخارجية وإدارة المشاريع (External Tools)',
      'استخدم أدوات بيت الريف الخارجية مثل حاسبة مواد البناء وإدارة العقود الرقمية لتسهيل مشاريعك. حلول ذكية شفافة وآمنة للمقاولين وأصحاب المشاريع.',
      '/seo/tools'
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#F5EEE1] text-[#1A1A1A]" dir="rtl" style={{ fontFamily: font }}>
      <SEOHead {...SEO_PAGE_CONFIGS.tools}
        breadcrumbs={[{ name: 'الأدوات الذكية', url: '/seo/tools' }]}
        service={{ name: 'أدوات الذكاء الاصطناعي لقطاع البناء', description: '47 أداة ذكاء اصطناعي مجانية لقطاع البناء: حاسبة مواد، مصمم 3D، مولد عقود، حاسبة إضاءة' }}
      />
      <SEOHeader />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200 mb-12">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B5BFE]/10 border border-[#3B5BFE]/20 mb-4 shadow-sm">
              <Star className="w-4 h-4 text-[#3B5BFE]" />
              <span className="text-sm font-bold text-[#3B5BFE]">حلول متكاملة للمشاريع</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-4">
              الأدوات الخارجية <span className="text-[#3B5BFE]">External Tools</span>
            </h1>
            <p className="text-[#1A1A1A]/70 text-lg max-w-3xl mx-auto leading-relaxed">
              توفر منصة بيت الريف مجموعة من الأدوات الخارجية والذكية المصممة خصيصاً لتسهيل إدارة مشاريع البناء، حساب التكاليف بدقة، وتوثيق العقود بآمان تام بين جميع الأطراف.
            </p>
          </div>

          {/* Why Biet Alreef & Comprehensive Solution */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <WebPImage src={whyBietAlreefImg} alt="لماذا بيت الريف؟ التسهيل، الشفافية، الأمان، الإدارة الذكية والدعم" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <WebPImage src={comprehensiveSolutionImg} alt="منصة بيت الريف - حلك الشامل للخدمات الذكية" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
            </div>
          </div>

          {/* Advanced Tools Section */}
          <div className="mt-16 border-t border-gray-200 pt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-[#1A1A1A] mb-4">
                أدوات الإدارة والتحكم الذكية
              </h2>
              <p className="text-[#1A1A1A]/60 max-w-2xl mx-auto text-lg">
                تمتع بتحكم كامل في تفاصيل مشروعك بدءاً من حساب الكميات المطلوبة بدقة وحتى أرشفة وتوثيق العقود في بيئة رقمية آمنة.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8 items-center">
              {/* Building Calculator */}
              <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <WebPImage src={buildingCalculatorImg} alt="حاسبة مواد البناء - احسب احتياجاتك بدقة ووفر المال" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
              </div>

              {/* Price Comparator */}
              <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <WebPImage src={priceComparatorImg} alt="أداة مقارن الأسعار - قارن الأسعار واختر الأفضل" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
              </div>
              
              {/* Lighting Calculator */}
              <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <WebPImage src={lightingCalculatorImg} alt="حاسبة الإضاءة - صمم إضاءة مثالية لمشروعك" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
              </div>

              {/* 3D Design */}
              <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <WebPImage src={threeDDesignImg} alt="التصميم ثلاثي الأبعاد - تصور مشروعك قبل التنفيذ" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
              </div>

              {/* Contracts Management */}
              <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow md:col-span-2 max-w-3xl mx-auto">
                <WebPImage src={contractsManagementImg} alt="إدارة عقودك بسهولة وأمان - توقيع، أرشفة، تتبع وتنبيهات" className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
             <a
              href="/home"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#D4AF37] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              ابدأ باستخدام الأدوات مجاناً
              <ArrowLeft className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
      <SEOFooter />
    </div>
  );
}