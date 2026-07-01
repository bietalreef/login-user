/**
 * shopAssets.ts — سجل صور بيت الريف المركزي
 * ════════════════════════════════════════════
 * ⚠️  figmaHash هنا للتوثيق فقط — الاستخدام الفعلي عبر ES import في كل صفحة
 *
 * الصفحات التي تستخدم الصور فعلياً:
 *   SEOLandingPage.tsx   → الـ 12 صورة كلها (figma:asset imports)
 *   SEOPlatformFeatures.tsx → الـ 12 صورة موزعة على /seo/*
 *
 * حالة الاستلام: 12/12 ✅ مكتمل — جميعها مُضافة كـ ES imports
 */

export interface ShopAsset {
  /** figma:asset hash — للتوثيق فقط */
  figmaHash: string;
  /** Unsplash كاحتياطي عند الحاجة */
  unsplash: string;
  /** وصف الصورة للـ alt */
  alt: string;
  /** رقم الدفعة */
  batch: 1 | 2 | 3;
  /** الصفحة المستخدم فيها */
  page: string;
}

// ══════════════════════════════════════════════════════════
// LANDING_IMAGES — الصفحة الرئيسية (3 صور)
// مُستخدمة في: SEOLandingPage.tsx — HeroSection / WayakSection / PlatformSection
// ══════════════════════════════════════════════════════════
export const LANDING_IMAGES: Record<string, ShopAsset> = {
  'wayak-process-flow': {
    figmaHash: 'figma:asset/857da62419e11c0f1323b64b3627121b5eaec901.png',
    unsplash:  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&q=80',
    alt:       'وياك AI: من الطلب إلى التنفيذ — كيف يجلب لك وياك العملاء',
    batch:     1,
    page:      'SEOLandingPage → WayakSection',
  },
  'join-3d-commerce-revolution': {
    figmaHash: 'figma:asset/0fe50276157d83e1a0149a40269a37c893b37f5b.png',
    unsplash:  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1280&q=80',
    alt:       'مستقبل التجارة الإلكترونية لمزودي الخدمات في الإمارات',
    batch:     1,
    page:      'SEOLandingPage → HeroSection (الصورة الرئيسية)',
  },
  'smart-store-dashboard': {
    figmaHash: 'figma:asset/f7998f6c50462f801d5655f474e49f4624c18e2b.png',
    unsplash:  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&q=80',
    alt:       'منصة بيت الريف: الاستقلال المالي والتفوق التقني',
    batch:     1,
    page:      'SEOLandingPage → PlatformSection | SEOStorePage → banner1',
  },
};

// ══════════════════════════════════════════════════════════
// FEATURES_IMAGES — صفحات الميزات (5 صور)
// مُستخدمة في: SEOLandingPage + SEOPlatformFeatures
// ══════════════════════════════════════════════════════════
export const FEATURES_IMAGES: Record<string, ShopAsset> = {
  '3d-furniture-store-experience': {
    figmaHash: 'figma:asset/8a90ba843fa2f8bd419a15605e59ad11e05c4434.png',
    unsplash:  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1080&q=80',
    alt:       'ثورة العرض: متجرك المستقل بتقنية 3D',
    batch:     1,
    page:      'SEOLandingPage → StoreSection | SEOStorePage → banner2',
  },
  'smart-3d-store-benefits': {
    figmaHash: 'figma:asset/3da7a12695b83c6d2baf1208566a66731568f92e.png',
    unsplash:  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1080&q=80',
    alt:       'واجهة متجر 3D التفاعلي — Furniture Selector',
    batch:     2,
    page:      'SEOLandingPage → StoreSection full-width | SEODashboardsPage',
  },
  'real-business-benefits': {
    figmaHash: 'figma:asset/ce9a83b91675ad1720a5abe475b1c2de5eec750f.png',
    unsplash:  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1080&q=80',
    alt:       'منظومة متكاملة لنجاحك وحمايتك — صفر عمولة وتقنية 3D',
    batch:     2,
    page:      'SEOLandingPage → PlatformSection',
  },
  'start-selling-3d-store': {
    figmaHash: 'figma:asset/10a113df84d773b1e2bae2c5babe6f7d205ea95a.png',
    unsplash:  'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1080&q=80',
    alt:       'تشريح التجربة ثلاثية الأبعاد: من الإلهام إلى سلة المشتريات',
    batch:     2,
    page:      'SEOLandingPage → ToolsSection',
  },
  'digital-arsenal-47-tools': {
    figmaHash: 'figma:asset/246db758caca8bd7b7cbea143bcbaa77c7461727.png',
    unsplash:  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080&q=80',
    alt:       'ترسانتك الرقمية: 47 أداة ذكاء اصطناعي مجانية',
    batch:     3,
    page:      'SEOLandingPage → ToolsSection | SEODashboardsPage',
  },
};

// ══════════════════════════════════════════════════════════
// SEO_IMAGES — صفحات SEO/GEO (3 صور)
// مُستخدمة في: SEOLandingPage → GeoCompareSection + SEOPlatformPage
// ══════════════════════════════════════════════════════════
export const SEO_IMAGES: Record<string, ShopAsset> = {
  'bietalreef-vs-traditional-platforms': {
    figmaHash: 'figma:asset/bd7ce7d48bee793af56123f2f3ff1cd32c772ed6.png',
    unsplash:  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1280&q=80',
    alt:       'مصفوفة التحرر: بيت الريف مقابل المنصات التقليدية',
    batch:     2,
    page:      'SEOLandingPage → GeoCompareSection | SEODashboardsPage',
  },
  'wayak-ai-agent': {
    figmaHash: 'figma:asset/38e82910d7325f1e21fcb905d8948741624f1267.png',
    unsplash:  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1280&q=80',
    alt:       'وياك AI: وكيلك التنفيذي الذكي',
    batch:     3,
    page:      'SEOLandingPage → WayakAgentSection | SEOPlatformPage',
  },
  'geo-ai-results': {
    figmaHash: 'figma:asset/e7b46f6edd88ccc74a5ca1bf95d9f168217da44e.png',
    unsplash:  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1280&q=80',
    alt:       'تصدر نتائج الذكاء الاصطناعي GEO',
    batch:     3,
    page:      'SEOLandingPage → GeoCompareSection | SEOPlatformPage',
  },
};

// ══════════════���═══════════════════════════════════════════
// PROVIDER_IMAGES — مزود الخدمة (1 صورة)
// ══════════════════════════════════════════════════════════
export const PROVIDER_IMAGES: Record<string, ShopAsset> = {
  'start-digital-leadership': {
    figmaHash: 'figma:asset/89aba61c05b0e929c2073bcd17a3ae38d0fa25c9.png',
    unsplash:  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1080&q=80',
    alt:       'ابدأ رحلتك نحو القيادة الرقمية اليوم — تميّز في السوق وضاعف أرباحك',
    batch:     3,
    page:      'SEOLandingPage → CTASection',
  },
};

// ════════════════════════════════════
// ملخص التوزيع النهائي
// ════════════════════════════════════
export const BATCH_STATUS = {
  1: { received: 4, used: 4, done: true },
  2: { received: 4, used: 4, done: true },
  3: { received: 4, used: 4, done: true },
} as const;

export const ALL_ASSETS = {
  ...LANDING_IMAGES,
  ...FEATURES_IMAGES,
  ...SEO_IMAGES,
  ...PROVIDER_IMAGES,
} as const;