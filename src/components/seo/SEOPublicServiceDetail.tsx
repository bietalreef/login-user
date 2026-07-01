/**
 * SEOPublicServiceDetail.tsx
 * ═══════════════════════════════════════════════════════════
 * Wrapper عام يكشف جميع صفحات تفاصيل الخدمات بدون تسجيل دخول
 * Route: /services/:id   (public — لا تحتاج auth)
 *
 * يعرض نفس محتوى صفحات الخدمات الداخلية مُضافاً عليها:
 *  - SEOHeader  (nav كامل مع كل الخدمات والمدن)
 *  - Meta SEO كاملة (title, description, keywords, JSON-LD)
 *  - SEOFooter (روابط داخلية شاملة لكل الصفحات)
 *  - لا BrowserLayout / لا BottomNav
 */

import { useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router@7.1.1';
import { SEOHeader, SEOFooter } from './SEONav';
import {
  SITE_DOMAIN, SITE_NAME_AR, EMIRATES_AND_CITIES, SERVICES_SEO,
} from '../../utils/seoConstants';
import { Home, Loader2 } from 'lucide-react';

const font = 'Cairo, Tajawal, sans-serif';

// ── Lazy load service detail components ─────────────────
const ServiceDetailConstructionContracting = lazy(() =>
  import('../mobile/ServiceDetailConstructionContracting').then(m => ({ default: m.ServiceDetailConstructionContracting }))
);
const ServiceDetailEngineeringConsultation = lazy(() =>
  import('../mobile/ServiceDetailEngineeringConsultation').then(m => ({ default: m.ServiceDetailEngineeringConsultation }))
);
const ServiceDetailMaintenance = lazy(() =>
  import('../mobile/ServiceDetailMaintenance').then(m => ({ default: m.ServiceDetailMaintenance }))
);
const ServiceDetailCraftsmen = lazy(() =>
  import('../mobile/ServiceDetailCraftsmen').then(m => ({ default: m.ServiceDetailCraftsmen }))
);
const ServiceDetailWorkshops = lazy(() =>
  import('../mobile/ServiceDetailWorkshops').then(m => ({ default: m.ServiceDetailWorkshops }))
);
const ServiceDetailEquipmentRental = lazy(() =>
  import('../mobile/ServiceDetailEquipmentRental').then(m => ({ default: m.ServiceDetailEquipmentRental }))
);
const ServiceDetailBuildingMaterials = lazy(() =>
  import('../mobile/ServiceDetailBuildingMaterials').then(m => ({ default: m.ServiceDetailBuildingMaterials }))
);
const ServiceDetailFurnitureDecor = lazy(() =>
  import('../mobile/ServiceDetailFurnitureDecor').then(m => ({ default: m.ServiceDetailFurnitureDecor }))
);
const ServiceDetailCleaning = lazy(() =>
  import('../mobile/ServiceDetailCleaning').then(m => ({ default: m.ServiceDetailCleaning }))
);
const ServiceDetailPlumbing = lazy(() =>
  import('../mobile/ServiceDetailPlumbing').then(m => ({ default: m.ServiceDetailPlumbing }))
);
const ServiceDetailElectricity = lazy(() =>
  import('../mobile/ServiceDetailElectricity').then(m => ({ default: m.ServiceDetailElectricity }))
);
const ServiceDetailAC = lazy(() =>
  import('../mobile/ServiceDetailAC').then(m => ({ default: m.ServiceDetailAC }))
);
const ServiceDetailPainting = lazy(() =>
  import('../mobile/ServiceDetailPainting').then(m => ({ default: m.ServiceDetailPainting }))
);
const ServiceDetailCarpentry = lazy(() =>
  import('../mobile/ServiceDetailCarpentry').then(m => ({ default: m.ServiceDetailCarpentry }))
);
const ServiceDetailInterior = lazy(() =>
  import('../mobile/ServiceDetailInterior').then(m => ({ default: m.ServiceDetailInterior }))
);
const ServiceDetailExterior = lazy(() =>
  import('../mobile/ServiceDetailExterior').then(m => ({ default: m.ServiceDetailExterior }))
);
const ServiceDetailConstruction = lazy(() =>
  import('../mobile/ServiceDetailConstruction').then(m => ({ default: m.ServiceDetailConstruction }))
);
const ServiceDetailConsultation = lazy(() =>
  import('../mobile/ServiceDetailConsultation').then(m => ({ default: m.ServiceDetailConsultation }))
);

// ── SEO meta map ─────────────────────────────────────────
const SERVICE_SEO_META: Record<string, {
  titleAr: string;
  descAr: string;
  keywords: string;
  h1Ar: string;
  schemaType: 'Service' | 'LocalBusiness';
}> = {
  'construction-contracting': {
    titleAr: 'مقاولات البناء في الإمارات | بيت الريف',
    descAr: 'اعثر على أفضل شركات مقاولات البناء في الإمارات. مقاولون معتمدون لبناء الفلل والمباني في دبي وأبوظبي والشارقة. عروض أسعار مجانية خلال 24 ساع��.',
    keywords: 'مقاولات بناء, مقاول الإمارات, بناء فلل, شركة مقاولات دبي',
    h1Ar: 'خدمات مقاولات البناء في الإمارات',
    schemaType: 'Service',
  },
  'constructionContracting': {
    titleAr: 'مقاولات البناء في الإمارات | بيت الريف',
    descAr: 'اعثر على أفضل شركات مقاولات البناء في الإمارات. مقاولون معتمدون لبناء الفلل والمباني في دبي وأبوظبي والشارقة. عروض أسعار مجانية خلال 24 ساعة.',
    keywords: 'مقاولات بناء, مقاول الإمارات, بناء فلل, شركة مقاولات دبي',
    h1Ar: 'خدمات مقاولات البناء في الإمارات',
    schemaType: 'Service',
  },
  'engineering-consultation': {
    titleAr: 'استشارات هندسية الإمارات | بيت الريف',
    descAr: 'مكاتب استشارات هندسية معتمدة في الإمارات. تصميم معماري وداخلي وخارجي، إشراف هندسي ومخططات BOQ في دبي وأبوظبي والشارقة.',
    keywords: 'استشارات هندسية, مكتب هندسي, تصميم معماري, مهندس الإمارات',
    h1Ar: 'خدمات الاستشارات الهندسية في الإمارات',
    schemaType: 'Service',
  },
  'maintenance-companies': {
    titleAr: 'صيانة منازل الإمارات | بيت الريف',
    descAr: 'أفضل شركات الصيانة المنزلية في الإمارات. سباكة وكهرباء وتكييف ونجارة ودهانات وصيانة شاملة. خدمة طوارئ 24/7 في دبي وأبوظبي.',
    keywords: 'صيانة منازل, شركة صيانة, سباكة كهرباء تكييف, صيانة فلل دبي',
    h1Ar: 'خدمات الصيانة المنزلية في الإمارات',
    schemaType: 'Service',
  },
  'craftsmen': {
    titleAr: 'حرفيون ومهنيون مهرة في الإمارات | بيت الريف',
    descAr: 'حرفيون مهرة في الإمارات. نجارين وحدادين وكهربائيين وسباكين ودهانين وعمال بناء. استئجار بالساعة أو المشروع في دبي وأبوظبي.',
    keywords: 'حرفي الإمارات, عامل ماهر, نجار, كهربائي, سباك, دهان دبي',
    h1Ar: 'حرفيون ومهنيون مهرة في الإمارات',
    schemaType: 'Service',
  },
  'workshops': {
    titleAr: 'ورش صناعية في الإمارات | بيت الريف',
    descAr: 'ورش حدادة ونجارة وألمنيوم وزجاج متخصصة في الإمارات. جودة عالية وأسعار تنافسية مع التوصيل لجميع الإمارات.',
    keywords: 'ورشة حدادة, ورشة نجارة, ورشة ألمنيوم, ورشة صناعية الإمارات',
    h1Ar: 'الورش الصناعية في الإمارات',
    schemaType: 'Service',
  },
  'equipment-rental': {
    titleAr: 'تأجير معدات بناء الإمارات | بيت الريف',
    descAr: 'تأجير معدات البناء الثقيلة والخفيفة في الإمارات. رافعات وحفارات وخلاطات إسمنت وسقالات بأسعار يومية وأسبوعية وشهرية.',
    keywords: 'تأجير معدات, رافعة, حفارة, سقالات, خلاطة إسمنت, معدات بناء الإمارات',
    h1Ar: 'تأجير معدات البناء في الإمارات',
    schemaType: 'Service',
  },
  'building-materials': {
    titleAr: 'مواد البناء في الإمارات | بيت الريف',
    descAr: 'أفضل موردي ومحلات مواد البناء في الإمارات. إسمنت وحديد وبلاط وأدوات صحية وكهربائية بأسعار تنافسية مع التوصيل.',
    keywords: 'مواد بناء, إسمنت, حديد, بلاط, أدوات صحية, محل مواد بناء الإمارات',
    h1Ar: 'مواد البناء في الإمارات',
    schemaType: 'LocalBusiness',
  },
  'furniture-stores': {
    titleAr: 'أثاث وديكور الإمارات | بيت الريف',
    descAr: 'أفضل محلات الأثاث والديكور في الإمارات. أثاث منزلي فاخر وأثاث مكتبي وأثاث مخصص مع توصيل وتركيب لجميع الإمارات.',
    keywords: 'أثاث الإمارات, محل أثاث, ديكور, أثاث فاخر, أثاث مخصص دبي',
    h1Ar: 'الأثاث والديكور في الإمارات',
    schemaType: 'LocalBusiness',
  },
  'cleaning-services': {
    titleAr: 'تنظيف منازل الإمارات | بيت الريف',
    descAr: 'شركات تنظيف منازل وفلل معتمدة في الإمارات. تنظيف عميق وتنظيف بعد البناء وتعقيم وتلميع بأسعار تنافسية.',
    keywords: 'تنظيف منازل, شركة تنظيف دبي, تنظيف فلل, تنظيف عميق, تعقيم الإمارات',
    h1Ar: 'خدمات تنظيف المنازل والفلل في الإمارات',
    schemaType: 'Service',
  },
  'plumbing': {
    titleAr: 'سباكة الإمارات | فنيو سباكة معتمدون | بيت الريف',
    descAr: 'أفضل فنيي السباكة في الإمارات. تركيب وإصلاح وصيانة أنابيب المياه والصرف الصحي في دبي وأبوظبي والشارقة.',
    keywords: 'سباك, سباكة, تسريب مياه, صيانة سباكة, فني سباكة دبي',
    h1Ar: 'خدمات السباكة في الإما��ات',
    schemaType: 'Service',
  },
  'electricity': {
    titleAr: 'كهرباء الإمارات | فنيون معتمدون | بيت الريف',
    descAr: 'فنيو كهرباء معتمدون في الإمارات. تمديدات كهربائية ولوحات توزيع وإصلاح أعطال كهربائية في دبي وأبوظبي والشارقة.',
    keywords: 'كهربائي, فني كهرباء, تمديدات كهربائية, كهرباء منازل, DEWA',
    h1Ar: 'خدمات الكهرباء في الإمارات',
    schemaType: 'Service',
  },
  'ac': {
    titleAr: 'تكييف وتبريد الإمارات | بيت الريف',
    descAr: 'تركيب وصيانة أجهزة التكييف في الإمارات. تكييف مركزي وسبليت وتنظيف وإصلاح في دبي وأبوظبي والشارقة.',
    keywords: 'تكييف, صيانة مكيف, تركيب مكيف, تكييف مركزي, فني تكييف دبي',
    h1Ar: 'خدمات التكييف والتبريد في الإمارات',
    schemaType: 'Service',
  },
  'painting': {
    titleAr: 'دهانات الإمارات | دهانون محترفون | بيت الريف',
    descAr: 'دهانات داخلية وخارجية في الإمارات. دهانون محترفون ودهان جوتن ودهان تكستشر في دبي وأبوظبي والشارقة.',
    keywords: 'دهان, عامل دهان, دهانات منازل, دهان جوتن, دهانات فلل الإمارات',
    h1Ar: 'خدمات الدهانات في الإمارات',
    schemaType: 'Service',
  },
  'carpentry': {
    titleAr: 'نجارة الإمارات | نجارون محترفون | بيت الريف',
    descAr: 'نجارون محترفون في الإمارات. أبواب وخزائن ومطابخ وأثاث خشبي مخصص في دبي وأبوظبي والشارقة.',
    keywords: 'نجار, نجارة, أبواب خشب, خزائن, مطابخ خشبية, نجارة الإمارات',
    h1Ar: 'خدمات النجارة في الإمارات',
    schemaType: 'Service',
  },
  'interior': {
    titleAr: 'تصميم داخلي الإمارات | بيت الريف',
    descAr: 'مصممون داخليون معتمدون في الإمارات. تصميم فلل وشقق ومكاتب في دبي وأبوظبي والشارقة باحترافية عالية.',
    keywords: 'تصميم داخلي, مصمم داخلي, ديكور فلل, تصميم شقق الإمارات',
    h1Ar: 'خدمات التصميم الداخلي في الإمارات',
    schemaType: 'Service',
  },
  'exterior': {
    titleAr: 'تصميم خارجي الإمارات | بيت الريف',
    descAr: 'تصميم واجهات خارجية في الإمارات. لاندسكيب وحدائق وواجهات مباني في دبي وأبوظبي والشارقة.',
    keywords: 'تصميم خارجي, واجهات, لاندسكيب, حدائق, تصميم مباني الإمارات',
    h1Ar: 'خدمات التصميم الخارجي في الإمارات',
    schemaType: 'Service',
  },
  'construction': {
    titleAr: 'بناء وتشييد الإمارات | بيت الريف',
    descAr: 'خدمات البناء والتشييد في الإمارات. بناء فلل ومباني سكنية وتجارية في دبي وأبوظبي والشارقة.',
    keywords: 'بناء, تشييد, بناء فيلا, م��اول بناء, إنشاءات الإمارات',
    h1Ar: 'خدمات البناء والتشييد في الإمارات',
    schemaType: 'Service',
  },
  'consultation': {
    titleAr: 'استشارة هندسية الإمارات | بيت الريف',
    descAr: 'استشارات هندسية متخصصة في الإمارات. مهندسون معتمدون للتصميم والإشراف وإعداد المخططات في دبي وأبوظبي.',
    keywords: 'استشارة هندسية, مهندس استشاري, تصميم مباني, إشراف هندسي',
    h1Ar: 'خدمات الاستشارات الهندسية المتخصصة',
    schemaType: 'Service',
  },
};

// ── SEO helpers ───────────────────────────────────────────
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

// ── Loader while service detail loads ────────────────────
function DetailLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        <p className="text-sm text-[#1F3D2B]/40 font-bold" style={{ fontFamily: font }}>
          جاري تحميل الخدمة...
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════
export function SEOPublicServiceDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const meta = SERVICE_SEO_META[id] || {
    titleAr: `خدمة بيت الريف | الإمارات`,
    descAr: 'خدمات البناء والتشطيب والصيانة في الإمارات. اعثر على أفضل المزودين المعتمدين في بيت الريف.',
    keywords: 'خدمات بناء, الإمارات, بيت الريف',
    h1Ar: 'خدمات البناء والتشطيب في الإمارات',
    schemaType: 'Service' as const,
  };
  const canonicalUrl = `${SITE_DOMAIN}/services/${id}`;

  // ── Public navigation callbacks (لا ترسل للتطبيق بل للصفحات العامة) ──
  const handleBack = () => {
    // إذا كان هناك تاريخ تنقل، ارجع للخلف؛ وإلا اذهب للرئيسية
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };
  const handleNavigate = (tab: string) => {
    const publicRouteMap: Record<string, string> = {
      services: '/',
      home: '/',
      shop: '/shop',
      maps: '/maps',
      tools: '/tools',
      weyaak: '/',
    };
    navigate(publicRouteMap[tab] || '/');
  };
  const handleOpenSearch = () => navigate('/');

  // ── Inject SEO ──
  useEffect(() => {
    const titleClean = meta.titleAr.slice(0, 60);
    const descClean = meta.descAr.slice(0, 160);

    document.title = titleClean;
    setMeta('description', descClean);
    setMeta('keywords', meta.keywords);
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1');
    setMeta('language', 'ar');
    setMeta('geo.region', 'AE');
    setLink('canonical', canonicalUrl);

    setMeta('og:title', titleClean, 'property');
    setMeta('og:description', descClean, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:site_name', SITE_NAME_AR, 'property');
    setMeta('og:locale', 'ar_AE', 'property');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', titleClean);
    setMeta('twitter:description', descClean);

    // JSON-LD: Service
    injectJsonLd(`ld-svc-detail-${id}`, {
      '@context': 'https://schema.org',
      '@type': meta.schemaType,
      name: meta.h1Ar,
      description: meta.descAr,
      url: canonicalUrl,
      provider: { '@type': 'Organization', name: SITE_NAME_AR, url: SITE_DOMAIN },
      areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '250',
        bestRating: '5',
      },
    });

    // JSON-LD: BreadcrumbList
    injectJsonLd(`ld-bread-svc-${id}`, {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: SITE_DOMAIN },
        { '@type': 'ListItem', position: 2, name: 'الخدمات', item: `${SITE_DOMAIN}/services` },
        { '@type': 'ListItem', position: 3, name: meta.h1Ar, item: canonicalUrl },
      ],
    });

    return () => {
      [`ld-svc-detail-${id}`, `ld-bread-svc-${id}`].forEach(eid => document.getElementById(eid)?.remove());
    };
  }, [id, meta, canonicalUrl]);

  // ── Pick the right service detail component ──
  const renderDetail = () => {
    switch (id) {
      case 'construction-contracting':
      case 'constructionContracting':
        return (
          <ServiceDetailConstructionContracting
            onBack={handleBack}
            onNavigate={handleNavigate as any}
            onOpenSearch={handleOpenSearch}
          />
        );
      case 'engineering-consultation':
      case 'engineeringConsultation':
        return (
          <ServiceDetailEngineeringConsultation
            onBack={handleBack}
            onNavigate={handleNavigate as any}
            onOpenSearch={handleOpenSearch}
          />
        );
      case 'maintenance':
      case 'maintenance-companies':
        return (
          <ServiceDetailMaintenance
            onBack={handleBack}
            onNavigate={handleNavigate as any}
            onOpenSearch={handleOpenSearch}
          />
        );
      case 'craftsmen':
        return (
          <ServiceDetailCraftsmen
            onBack={handleBack}
            onNavigate={handleNavigate as any}
            onOpenSearch={handleOpenSearch}
          />
        );
      case 'workshops':
        return (
          <ServiceDetailWorkshops
            onBack={handleBack}
            onNavigate={handleNavigate as any}
            onOpenSearch={handleOpenSearch}
          />
        );
      case 'equipment-rental':
      case 'equipmentRental':
        return (
          <ServiceDetailEquipmentRental
            onBack={handleBack}
            onNavigate={handleNavigate as any}
            onOpenSearch={handleOpenSearch}
          />
        );
      case 'building-materials':
      case 'buildingMaterials':
        return (
          <ServiceDetailBuildingMaterials
            onBack={handleBack}
            onNavigate={handleNavigate as any}
            onOpenSearch={handleOpenSearch}
          />
        );
      case 'furniture-stores':
      case 'furnitureDecor':
        return (
          <ServiceDetailFurnitureDecor
            onBack={handleBack}
            onNavigate={handleNavigate as any}
            onOpenSearch={handleOpenSearch}
          />
        );
      case 'cleaning':
      case 'cleaning-services':
        return (
          <ServiceDetailCleaning
            onBack={handleBack}
            onNavigate={handleNavigate as any}
            onOpenSearch={handleOpenSearch}
          />
        );
      case 'plumbing':
        return (
          <ServiceDetailPlumbing
            onBack={handleBack}
            onOpenSearch={handleOpenSearch}
          />
        );
      case 'electricity':
        return (
          <ServiceDetailElectricity
            onBack={handleBack}
            onOpenSearch={handleOpenSearch}
          />
        );
      case 'ac':
        return (
          <ServiceDetailAC
            onBack={handleBack}
            onOpenSearch={handleOpenSearch}
          />
        );
      case 'painting':
        return (
          <ServiceDetailPainting
            onBack={handleBack}
            onOpenSearch={handleOpenSearch}
          />
        );
      case 'carpentry':
        return <ServiceDetailCarpentry onBack={handleBack} />;
      case 'interior':
        return <ServiceDetailInterior onBack={handleBack} />;
      case 'exterior':
        return <ServiceDetailExterior onBack={handleBack} />;
      case 'construction':
        return (
          <ServiceDetailConstruction
            onBack={handleBack}
            onOpenSearch={handleOpenSearch}
          />
        );
      case 'consultation':
        return <ServiceDetailConsultation onBack={handleBack} />;
      default:
        return <ServiceNotFoundFallback id={id} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EEE1]" dir="rtl" style={{ fontFamily: font }}>
      {/* ══ HEADER (with all 11 services + cities dropdown) ══ */}
      <SEOHeader activeSlug={undefined} />

      {/* ══ H1 مخفي للـ SEO (ينشره الـ schema + المحتوى الداخلي) ══ */}
      <h1 className="sr-only">{meta.h1Ar}</h1>

      {/* ══ SERVICE DETAIL CONTENT ══ */}
      <main>
        <Suspense fallback={<DetailLoader />}>
          {renderDetail()}
        </Suspense>
      </main>

      {/* ══ FOOTER (all services + cities internal links) ══ */}
      <SEOFooter />
    </div>
  );
}

// ── صفحة 404 للخدمات المجهولة ───────────────────────────
function ServiceNotFoundFallback({ id }: { id: string }) {
  return (
    <div className="flex items-center justify-center py-32 px-4" style={{ fontFamily: font }}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
          <Home className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h2 className="text-xl font-black text-[#1F3D2B] mb-3">الخدمة غير موجودة</h2>
        <p className="text-sm text-[#1F3D2B]/50 mb-6 leading-[2]">
          لم يتم العثور على الخدمة "{id}". استكشف جميع خدماتنا.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="/services" className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C8A86A] text-white font-black text-sm shadow-md">
            جميع الخدمات
          </a>
          <a href="/" className="px-5 py-3 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] font-black text-sm">
            الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}