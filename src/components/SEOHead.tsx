import { useEffect } from 'react';
import { useLocation } from 'react-router@7.1.1';
import {
  SITE_DOMAIN,
  SITE_NAME_AR,
  SITE_PHONE,
  EMIRATES_AND_CITIES,
  findCityBySlug,
} from '../utils/seoConstants';

interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceSEOProps {
  title: string;
  description: string;
  serviceId: string;
  serviceName: string;
  serviceType: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  keywords?: string[];
  faqs: FAQItem[];
  providerCount?: number;
  projectCount?: number;
  /** City slug for localized pages */
  citySlug?: string;
}

export function ServiceSEOHead({
  title,
  description,
  serviceId,
  serviceName,
  serviceType,
  priceRange,
  rating,
  reviewCount,
  imageUrl,
  keywords = [],
  faqs,
  providerCount = 0,
  projectCount = 0,
  citySlug,
}: ServiceSEOProps) {
  const location = useLocation();
  const city = citySlug ? findCityBySlug(citySlug) : null;
  const currentUrl = `${SITE_DOMAIN}${location.pathname}`;

  // Extract slug from URL for proper breadcrumb
  const routeSlug = location.pathname.split('/services/')[1]?.split('/')[0] || serviceId;

  useEffect(() => {
    // Dynamic title with city if available
    const pageTitle = city
      ? `${serviceName} في ${city.nameAr} | أفضل مزودي الخدمة | ${SITE_NAME_AR}`
      : title;

    document.title = pageTitle;

    // Meta description
    const pageDesc = city
      ? `ابحث عن أفضل ${serviceName} في ${city.nameAr}. ${providerCount}+ مزود معتمد. قارن الأسعار والتقييمات. ${description}`
      : description;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', pageDesc);

    // Meta keywords
    if (keywords && keywords.length > 0 && Array.isArray(keywords)) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      const allKeywords = city
        ? [...keywords, city.nameAr, `${serviceName} ${city.nameAr}`]
        : keywords;
      metaKeywords.setAttribute('content', allKeywords.join(', '));
    }

    // Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', currentUrl);

    // Open Graph
    const ogTags = [
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: pageDesc },
      { property: 'og:image', content: imageUrl },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME_AR },
      { property: 'og:locale', content: 'ar_AE' },
    ];

    ogTags.forEach(tag => {
      let ogTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', tag.property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', tag.content);
    });

    // Twitter Card
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: pageDesc },
      { name: 'twitter:image', content: imageUrl },
      { name: 'twitter:site', content: '@baitalreef' },
    ];

    twitterTags.forEach(tag => {
      let el = document.querySelector(`meta[name="${tag.name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', tag.name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', tag.content);
    });

  }, [title, description, imageUrl, keywords, city, serviceName]);

  // ──────────────────────────────────────────
  // Structured Data
  // ──────────────────────────────────────────

  // 1. Service Schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: serviceType,
    name: city ? `${serviceName} في ${city.nameAr}` : serviceName,
    description: description,
    url: currentUrl,
    provider: {
      '@type': 'LocalBusiness',
      name: `${SITE_NAME_AR} - ${serviceName}`,
      description: `${providerCount}+ مزود خدمة معتمد لـ${serviceName} في الإمارات`,
      url: SITE_DOMAIN,
      telephone: SITE_PHONE,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'AE',
        ...(city ? {
          addressRegion: city.region,
          addressLocality: city.nameAr,
        } : {
          addressLocality: 'الإمارات العربية المتحدة',
        }),
      },
      ...(city ? {
        geo: { '@type': 'GeoCoordinates', latitude: city.lat, longitude: city.lng },
      } : {
        geo: { '@type': 'GeoCoordinates', latitude: '25.2048', longitude: '55.2708' },
      }),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.toString(),
        reviewCount: reviewCount.toString(),
        bestRating: '5',
        worstRating: '1',
      },
      priceRange: priceRange,
    },
    areaServed: city
      ? [{ '@type': 'City', name: city.nameAr }]
      : EMIRATES_AND_CITIES.map(c => ({ '@type': 'City', name: c.nameAr })),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'AED',
      lowPrice: priceRange.split(' - ')[0]?.replace(/[^\d]/g, '') || '0',
      highPrice: priceRange.split(' - ')[1]?.replace(/[^\d]/g, '') || '0',
      offerCount: providerCount.toString(),
    },
  };

  // 2. FAQ Schema
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  // 3. Breadcrumb Schema
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_DOMAIN}/home` },
    { '@type': 'ListItem', position: 2, name: 'الخدمات', item: `${SITE_DOMAIN}/services` },
    { '@type': 'ListItem', position: 3, name: serviceName, item: `${SITE_DOMAIN}/services/${routeSlug}` },
  ];

  if (city) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 4,
      name: `${serviceName} في ${city.nameAr}`,
      item: currentUrl,
    });
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  // 4. ProfessionalService Schema (for local search ranking)
  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: city
      ? `${serviceName} في ${city.nameAr} - ${SITE_NAME_AR}`
      : `${serviceName} - ${SITE_NAME_AR}`,
    image: imageUrl,
    description: `أفضل مزودي ${serviceName}${city ? ` في ${city.nameAr}` : ' في الإمارات'}. ${providerCount} مزود معتمد، ${projectCount} مشروع منجز. ${description}`,
    url: currentUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    priceRange: priceRange,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AE',
      ...(city ? { addressLocality: city.nameAr, addressRegion: city.region } : {}),
    },
    ...(city ? {
      geo: { '@type': 'GeoCoordinates', latitude: city.lat, longitude: city.lng },
    } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `كتالوج ${serviceName}`,
      itemListElement: [{
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: serviceName,
          description: description,
        },
      }],
    },
    // Provider availability across UAE
    areaServed: city
      ? { '@type': 'City', name: city.nameAr }
      : { '@type': 'Country', name: 'الإمارات العربية المتحدة' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
    </>
  );
}