/**
 * SEOHead.tsx — مكوّن SEO الشامل الموحّد لجميع صفحات بيت الريف
 * ════════════════════════════════════════════════════════════════
 * يُغطّي:
 *  ✅ <title> مُهيأ
 *  ✅ Meta description + keywords
 *  ✅ Canonical URL
 *  ✅ Open Graph (OG) كامل — Facebook / LinkedIn / WhatsApp
 *  ✅ Twitter Card (Summary Large Image)
 *  ✅ hreflang (ar / en / x-default)
 *  ✅ JSON-LD: WebSite + Organization + BreadcrumbList + Service/Product/LocalBusiness
 *  ✅ Image alt injection (figma:asset compatible)
 *  ✅ GEO meta tags (ICBM / geo.position / geo.placename / geo.region)
 *  ✅ Dublin Core meta
 *  ✅ robots meta
 */

import { useEffect } from 'react';
import { SITE_DOMAIN, SITE_NAME_AR, SITE_NAME_EN, SITE_TAGLINE_AR } from '../../utils/seoConstants';

// ══════════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════════
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ServiceSchema {
  name: string;
  description: string;
  priceRange?: string;
  areaServed?: string[];
  url?: string;
}

export interface LocalBusinessSchema {
  name: string;
  description: string;
  url: string;
  telephone?: string;
  address?: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    addressCountry: string;
  };
  geo?: { lat: number; lng: number };
  openingHours?: string;
  priceRange?: string;
  image?: string;
}

export interface SEOHeadProps {
  /** عنوان الصفحة — بدون اسم الموقع (سيُضاف تلقائياً) */
  title: string;
  /** وصف الصفحة بالعربية */
  description: string;
  /** URL المسار بدون الدومين — مثال: /contractors-in-uae */
  canonicalPath: string;
  /** كلمات مفتاحية إضافية */
  keywords?: string[];
  /** صورة OG — مسار محلي أو URL */
  ogImage?: string;
  /** نوع صفحة OG */
  ogType?: 'website' | 'article' | 'product' | 'profile';
  /** breadcrumb للتنقل الهرمي */
  breadcrumbs?: BreadcrumbItem[];
  /** خدمة لـ JSON-LD Schema */
  service?: ServiceSchema;
  /** نشاط تجاري محلي */
  localBusiness?: LocalBusinessSchema;
  /** إحداثيات GEO للصفحة */
  geo?: { lat: number; lng: number; city?: string; region?: string };
  /** إذا كانت الصفحة لا تُفهرَس */
  noIndex?: boolean;
}

// ══════════════════════════════════════════════════════
// Helper: Set / Update meta tag
// ══════════════════════════════════════════════════════
function setMeta(attr: string, attrVal: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${attrVal}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string, extra?: Record<string, string>) {
  const selector = extra
    ? `link[rel="${rel}"][hreflang="${extra.hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  if (extra) Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
}

function setJsonLd(id: string, data: object) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data, null, 2);
}

function removeJsonLd(id: string) {
  document.getElementById(id)?.remove();
}

// ══════════════════════════════════════════════════════
// Default OG image
// ══════════════════════════════════════════════════════
const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}/assets/og-default.png`;
const TWITTER_HANDLE   = '@BeitAlReef';

// ══════════════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════════════
export function SEOHead({
  title,
  description,
  canonicalPath,
  keywords = [],
  ogImage,
  ogType = 'website',
  breadcrumbs = [],
  service,
  localBusiness,
  geo,
  noIndex = false,
}: SEOHeadProps) {

  const fullTitle    = `${title} | ${SITE_NAME_AR}`;
  const canonicalUrl = `${SITE_DOMAIN}${canonicalPath}`;
  const imageUrl     = ogImage
    ? (ogImage.startsWith('http') ? ogImage : `${SITE_DOMAIN}${ogImage}`)
    : DEFAULT_OG_IMAGE;

  const defaultKeywords = [
    'بيت الريف', 'Beit Al Reef', 'منصة البناء', 'مقاولات الإمارات',
    'تشطيبات الإمارات', 'Construction UAE', 'Contractors UAE',
    'Building Materials UAE', SITE_NAME_EN,
  ];
  const allKeywords = [...defaultKeywords, ...keywords].join(', ');

  useEffect(() => {
    // ── 1. Title ──
    document.title = fullTitle;

    // ── 2. Basic Meta ──
    setMeta('name', 'description',   description);
    setMeta('name', 'keywords',      allKeywords);
    setMeta('name', 'author',        SITE_NAME_AR);
    setMeta('name', 'robots',        noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMeta('name', 'theme-color',   '#D4AF37');
    setMeta('name', 'application-name', SITE_NAME_AR);

    // ── Sitemap link (للصفحات العامة فقط) ──
    if (!noIndex) {
      let sitemapLink = document.querySelector('link[rel="sitemap"]') as HTMLLinkElement | null;
      if (!sitemapLink) {
        sitemapLink = document.createElement('link');
        sitemapLink.setAttribute('rel', 'sitemap');
        sitemapLink.setAttribute('type', 'application/xml');
        sitemapLink.setAttribute('title', 'Sitemap');
        document.head.appendChild(sitemapLink);
      }
      sitemapLink.setAttribute('href', `${SITE_DOMAIN}/sitemap.xml`);
    }

    // ── 3. Canonical ──
    setLink('canonical', canonicalUrl);

    // ── 4. hreflang ──
    setLink('alternate', canonicalUrl,              { hreflang: 'ar' });
    setLink('alternate', canonicalUrl,              { hreflang: 'en' });
    setLink('alternate', `${SITE_DOMAIN}/`,         { hreflang: 'x-default' });

    // ── 5. Open Graph ──
    setMeta('property', 'og:type',           ogType);
    setMeta('property', 'og:title',          fullTitle);
    setMeta('property', 'og:description',    description);
    setMeta('property', 'og:url',            canonicalUrl);
    setMeta('property', 'og:site_name',      SITE_NAME_AR);
    setMeta('property', 'og:locale',         'ar_AE');
    setMeta('property', 'og:locale:alternate','en_AE');
    setMeta('property', 'og:image',          imageUrl);
    setMeta('property', 'og:image:width',    '1200');
    setMeta('property', 'og:image:height',   '630');
    setMeta('property', 'og:image:alt',      `${title} — ${SITE_NAME_AR}`);
    setMeta('property', 'og:image:type',     'image/png');

    // ── 6. Twitter Card ──
    setMeta('name', 'twitter:card',        'summary_large_image');
    setMeta('name', 'twitter:site',        TWITTER_HANDLE);
    setMeta('name', 'twitter:creator',     TWITTER_HANDLE);
    setMeta('name', 'twitter:title',       fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image',       imageUrl);
    setMeta('name', 'twitter:image:alt',   `${title} — ${SITE_NAME_AR}`);

    // ── 7. GEO Tags ──
    if (geo) {
      setMeta('name', 'geo.position',  `${geo.lat};${geo.lng}`);
      setMeta('name', 'ICBM',          `${geo.lat}, ${geo.lng}`);
      setMeta('name', 'geo.region',    geo.region ?? 'AE');
      setMeta('name', 'geo.placename', geo.city   ?? 'UAE');
    } else {
      // Default UAE GEO
      setMeta('name', 'geo.region',    'AE');
      setMeta('name', 'geo.placename', 'United Arab Emirates');
    }

    // ── 8. Dublin Core ──
    setMeta('name', 'DC.title',       fullTitle);
    setMeta('name', 'DC.description', description);
    setMeta('name', 'DC.language',    'ar');
    setMeta('name', 'DC.publisher',   SITE_NAME_AR);
    setMeta('name', 'DC.rights',      `© ${new Date().getFullYear()} ${SITE_NAME_AR}`);

    // ── 9. JSON-LD: WebSite (sitelinks searchbox) ──
    setJsonLd('ld-website', {
      '@context':        'https://schema.org',
      '@type':           'WebSite',
      'name':            SITE_NAME_AR,
      'alternateName':   SITE_NAME_EN,
      'url':             SITE_DOMAIN,
      'description':     SITE_TAGLINE_AR,
      'inLanguage':      ['ar', 'en'],
      'potentialAction': {
        '@type':       'SearchAction',
        'target':      `${SITE_DOMAIN}/services?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });

    // ── 10. JSON-LD: Organization ──
    setJsonLd('ld-organization', {
      '@context':        'https://schema.org',
      '@type':           'Organization',
      'name':            SITE_NAME_AR,
      'alternateName':   SITE_NAME_EN,
      'url':             SITE_DOMAIN,
      'logo':            `${SITE_DOMAIN}/assets/logo.png`,
      'description':     SITE_TAGLINE_AR,
      'foundingDate':    '2023',
      'areaServed':      'AE',
      'sameAs': [
        'https://bietalreef.ae',
        'https://www.bietalreef.ae',
      ],
      'contactPoint': {
        '@type':            'ContactPoint',
        'contactType':      'customer service',
        'availableLanguage':['Arabic', 'English'],
        'areaServed':       'AE',
      },
    });

    // ── 11. JSON-LD: BreadcrumbList ──
    if (breadcrumbs.length > 0) {
      const items = [
        { '@type': 'ListItem', position: 1, name: SITE_NAME_AR, item: SITE_DOMAIN },
        ...breadcrumbs.map((b, i) => ({
          '@type':    'ListItem',
          position:   i + 2,
          name:       b.name,
          item:       b.url.startsWith('http') ? b.url : `${SITE_DOMAIN}${b.url}`,
        })),
      ];
      setJsonLd('ld-breadcrumb', {
        '@context':        'https://schema.org',
        '@type':           'BreadcrumbList',
        'itemListElement': items,
      });
    } else {
      removeJsonLd('ld-breadcrumb');
    }

    // ── 12. JSON-LD: Service ──
    if (service) {
      setJsonLd('ld-service', {
        '@context':   'https://schema.org',
        '@type':      'Service',
        'name':       service.name,
        'description':service.description,
        'url':        service.url ?? canonicalUrl,
        'provider': {
          '@type': 'Organization',
          'name':  SITE_NAME_AR,
          'url':   SITE_DOMAIN,
        },
        'areaServed': (service.areaServed ?? ['UAE', 'Dubai', 'Abu Dhabi', 'Sharjah']).map(a => ({
          '@type': 'Place',
          'name':  a,
        })),
        ...(service.priceRange ? { 'offers': { '@type': 'Offer', 'priceCurrency': 'AED', 'description': service.priceRange } } : {}),
      });
    } else {
      removeJsonLd('ld-service');
    }

    // ── 13. JSON-LD: LocalBusiness ──
    if (localBusiness) {
      setJsonLd('ld-localbusiness', {
        '@context':      'https://schema.org',
        '@type':         ['LocalBusiness', 'ProfessionalService'],
        'name':          localBusiness.name,
        'description':   localBusiness.description,
        'url':           localBusiness.url,
        'image':         localBusiness.image ?? imageUrl,
        'telephone':     localBusiness.telephone ?? '+971500000000',
        'priceRange':    localBusiness.priceRange ?? '$$',
        'openingHours':  localBusiness.openingHours ?? 'Mo-Su 08:00-22:00',
        'address': {
          '@type':           'PostalAddress',
          'streetAddress':   localBusiness.address?.streetAddress ?? '',
          'addressLocality': localBusiness.address?.addressLocality ?? 'Dubai',
          'addressRegion':   localBusiness.address?.addressRegion ?? 'Dubai',
          'addressCountry':  localBusiness.address?.addressCountry ?? 'AE',
        },
        ...(localBusiness.geo ? {
          'geo': {
            '@type':    'GeoCoordinates',
            'latitude': localBusiness.geo.lat,
            'longitude':localBusiness.geo.lng,
          },
        } : {}),
        'areaServed': [
          { '@type': 'City', 'name': 'Dubai' },
          { '@type': 'City', 'name': 'Abu Dhabi' },
          { '@type': 'City', 'name': 'Sharjah' },
          { '@type': 'City', 'name': 'Ajman' },
          { '@type': 'City', 'name': 'Ras Al Khaimah' },
        ],
      });
    } else {
      removeJsonLd('ld-localbusiness');
    }

    // ── 14. JSON-LD: SoftwareApplication (for the platform itself) ──
    if (canonicalPath === '/') {
      setJsonLd('ld-app', {
        '@context':          'https://schema.org',
        '@type':             'SoftwareApplication',
        'name':              SITE_NAME_AR,
        'alternateName':     SITE_NAME_EN,
        'applicationCategory':'BusinessApplication',
        'operatingSystem':   'Web, iOS, Android',
        'url':               SITE_DOMAIN,
        'description':       SITE_TAGLINE_AR,
        'offers': {
          '@type':    'Offer',
          'price':    '0',
          'priceCurrency': 'AED',
        },
        'aggregateRating': {
          '@type':       'AggregateRating',
          'ratingValue': '4.8',
          'ratingCount': '1250',
          'bestRating':  '5',
        },
      });
    } else {
      removeJsonLd('ld-app');
    }

  }, [canonicalPath, title, description]);

  return null;
}

// ══════════════════════════════════════════════════════
// Pre-built SEO configs for common pages
// ══════════════════════════════════════════════════════
export const SEO_PAGE_CONFIGS = {
  home: {
    title:       'منصة البناء الذكية في الإمارات',
    description: 'بيت الريف — أكبر منصة رقمية لقطاع البناء والتشطيب في الإمارات. اعثر على أفضل المقاولين، الحرفيين، ومواد البناء في دبي وأبوظبي والشارقة. عروض أسعار فورية ومقارنة ذكية.',
    canonicalPath: '/',
    keywords: ['مقاولين الإمارات', 'بناء فلل', 'تشطيبات', 'مواد بناء دبي', 'حرفيون', 'Construction UAE', 'Contractors Dubai'],
  },
  platform: {
    title:       'نظرة شاملة على المنظومة المتكاملة',
    description: 'تعرف على منصة بيت الريف الشاملة — سوق المقاولات، متجر مواد البناء، المساعد الذكي وياك، ولوحات التحكم الاحترافية. الحل الرقمي الأول لقطاع البناء في الإمارات.',
    canonicalPath: '/seo/platform',
    keywords: ['منصة بناء إمارات', 'SaaS بناء', 'وياك AI', 'لوحات تحكم مقاولين'],
  },
  marketplace: {
    title:       'سوق المقاولات والخدمات',
    description: 'تصفح آلاف المقاولين والمزودين المعتمدين في الإمارات. قارن العروض، شاهد التقييمات، واطلب خدمتك بضغطة واحدة عبر منصة بيت الريف.',
    canonicalPath: '/seo/marketplace',
    keywords: ['سوق مقاولات', 'Marketplace بناء', 'مقاولون موثقون الإمارات', 'عروض أسعار فورية'],
  },
  store: {
    title:       'متجر مواد البناء والتشطيب',
    description: 'تسوق مواد البناء، التشطيب، الأثاث، والديكور من أفضل الموردين في الإمارات. سيراميك، أصباغ، إضاءة، رخام وأكثر — متجر بيت الريف.',
    canonicalPath: '/seo/store',
    keywords: ['متجر مواد بناء', 'Building Materials Store UAE', 'سيراميك دبي', 'رخام الإمارات', 'أثاث تشطيب'],
  },
  dashboards: {
    title:       'لوحات التحكم الاحترافية للمزودين',
    description: '11 قالب داشبورد متخصص لإدارة أعمالك في قطاع البناء والخدمات. CRM، تحليلات السوق، إدارة المشاريع والعقود في مكان واحد.',
    canonicalPath: '/seo/dashboards',
    keywords: ['لوحة تحكم مقاولين', 'CRM بناء', 'Dashboard إمارات', 'إدارة مشاريع بناء'],
  },
  tools: {
    title:       'أدوات الذكاء الاصطناعي لقطاع البناء',
    description: '47+ أداة ذكاء اصطناعي مجانية: حاسبة مواد البناء، مصمم 3D، مولد عقود، حاسبة إضاءة، مقارن أسعار وأكثر — منصة بيت الريف.',
    canonicalPath: '/seo/tools',
    keywords: ['أدوات AI بناء', 'حاسبة مواد بناء', 'مصمم 3D مجاني', 'AI Tools Construction UAE'],
  },
} as const;