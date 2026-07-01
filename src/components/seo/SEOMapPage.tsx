/**
 * SEOMapPage.tsx — صفحة الخريطة/المدينة العامة
 * ════════════════════════════════════════════════════════════════════
 * Template 4/4: صفحة خريطة/مدينة عامة (Public Map/City Page)
 * Routes: /map/:city  و  /map/:city/:service
 * Design: Sandy Beige + Frosted Glass + Gold/Royal Blue accents
 * SEO: LocalBusiness + GeoCoordinates + Service schemas
 * Sections: Hero / Filters / Map / Providers / Cities / CTA
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router@7.1.1';
import { SEOHeader, SEOFooter } from './SEONav';
import { SEOHead } from './SEOHead';
import {
  SITE_DOMAIN,
  SITE_NAME_AR,
  EMIRATES_AND_CITIES,
  SERVICES_SEO,
  type CityInfo,
  type ServiceSEOInfo,
} from '../../utils/seoConstants';
import {
  MapPin, Star, Filter, ChevronLeft, Building2,
  Phone, Award, Shield, Clock, Home, Search,
  Users, BadgeCheck, ArrowLeft, Navigation,
  Layers, TrendingUp,
} from 'lucide-react';
import { DecorativeMap } from './DecorativeMap';

const font = 'Cairo, Tajawal, sans-serif';

// ══════════════════════════════════════════════
// SEO helpers
// ═════════════════════════════════════════════
function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function injectJsonLd(id: string, data: object) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data, null, 2);
}

// ══════════════════════════════════════════════
// Demo Providers
// ══════════════════════════════════════════════
interface DemoProvider {
  name: string;
  rating: number;
  reviews: number;
  verified: boolean;
  specialty: string;
  phone: string;
  slug: string;
}

const DEMO_PROVIDERS: DemoProvider[] = [
  {
    name: 'شركة النخبة للمقاولات',
    rating: 4.9,
    reviews: 127,
    verified: true,
    specialty: 'مقاولات عامة',
    phone: '+971-50-123-4567',
    slug: 'elite-contracting-dubai',
  },
  {
    name: 'مجموعة الإمارات للبناء',
    rating: 4.8,
    reviews: 98,
    verified: true,
    specialty: 'تشطيب فلل',
    phone: '+971-50-234-5678',
    slug: 'emirates-building-group',
  },
  {
    name: 'دار الجودة للصيانة',
    rating: 4.7,
    reviews: 156,
    verified: true,
    specialty: 'صيانة شاملة',
    phone: '+971-50-345-6789',
    slug: 'quality-maintenance',
  },
  {
    name: 'فريق الحرفيين المتحدون',
    rating: 4.6,
    reviews: 73,
    verified: false,
    specialty: 'تكييف وكهرباء',
    phone: '+971-50-456-7890',
    slug: 'united-craftsmen',
  },
  {
    name: 'مؤسسة الأفق للبناء',
    rating: 4.5,
    reviews: 42,
    verified: true,
    specialty: 'مقاولات بناء',
    phone: '+971-50-567-8901',
    slug: 'horizon-construction',
  },
  {
    name: 'شركة الرياض للتشطيب',
    rating: 4.8,
    reviews: 89,
    verified: true,
    specialty: 'تصميم داخلي',
    phone: '+971-50-678-9012',
    slug: 'riyadh-finishing',
  },
];

// ══════════════════════════════════════════════
// Stars Component
// ══════════════════════════════════════════════
function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-5 h-5' };
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${sizeMap[size]} ${
            i <= Math.round(rating)
              ? 'fill-[#D4AF37] text-[#D4AF37]'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════
// Hero Section
// ══════════════════════════════════════════════
function HeroSection({
  cityName,
  serviceName,
  citySlug,
}: {
  cityName: string;
  serviceName: string;
  citySlug: string;
}) {
  const navigate = useNavigate();

  // ── City hero images ────────────────────────────────────
  const CITY_IMAGES: Record<string, string> = {
    'dubai': 'https://images.unsplash.com/photo-1768069794857-9306ac167c6e?w=1200&q=80',
    'abu-dhabi': 'https://images.unsplash.com/photo-1735163968182-a7da197d71ab?w=1200&q=80',
    'sharjah': 'https://images.unsplash.com/photo-1598018284560-3d640a13c52e?w=1200&q=80',
    'default': 'https://images.unsplash.com/photo-1762536859942-8076505f7c62?w=1200&q=80',
  };

  const heroImage = CITY_IMAGES[citySlug] || CITY_IMAGES.default;

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt={cityName}
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5EEE1]/95 via-[#F5EEE1]/90 to-[#F5EEE1]" />
      </div>

      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ fontFamily: font }}>
          <Home className="w-4 h-4 text-[#D4AF37]" />
          <ChevronLeft className="w-3 h-3 text-gray-400" />
          <span className="text-[#1F3D2B]/60">الخريطة</span>
          <ChevronLeft className="w-3 h-3 text-gray-400" />
          <span className="text-[#1F3D2B] font-semibold">{cityName}</span>
        </div>

        {/* Heading */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          style={{ fontFamily: font, color: '#1F3D2B' }}
        >
          مزودو {serviceName}
          <span className="block mt-2 bg-gradient-to-l from-[#D4AF37] to-[#3B5BFE] bg-clip-text text-transparent">
            في {cityName}
          </span>
        </h1>

        <p
          className="text-xl sm:text-2xl mb-10 max-w-3xl leading-relaxed"
          style={{ fontFamily: font, color: 'rgba(31, 61, 43, 0.70)' }}
        >
          اعثر على أفضل المزودين القريبين منك على الخريطة التفاعلية.
          مقارنة التقييمات، الأسعار، وعروض الأسعار الفورية.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
          {[
            { icon: Building2, label: 'مزود نشط', value: '240+' },
            { icon: Users, label: 'عميل راضٍ', value: '5,800+' },
            { icon: Award, label: 'مشروع مكتمل', value: '12,000+' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-[#D4AF37]" />
              <div className="text-3xl font-bold text-[#1F3D2B] mb-1 text-center" style={{ fontFamily: font }}>
                {stat.value}
              </div>
              <div className="text-sm text-[#1F3D2B]/60 text-center" style={{ fontFamily: font }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Map Placeholder Section → الخريطة الجمالية
// ══════════════════════════════════════════════
function MapSection({ cityName }: { cityName: string }) {
  return (
    <section className="py-16 bg-gradient-to-b from-[#F5EEE1] to-[#EFE7D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DecorativeMap cityName={cityName} />
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Providers List Section
// ══════════════════════════════════════════════
function ProvidersListSection({ cityName }: { cityName: string }) {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-[#F5EEE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#1F3D2B] mb-8" style={{ fontFamily: font }}>
          المزودون في {cityName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_PROVIDERS.map((provider) => (
            <div
              key={provider.slug}
              className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 hover:border-[#D4AF37]/40 shadow-sm hover:shadow-lg transition-all text-right"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3
                      className="text-lg font-bold text-[#1F3D2B]"
                      style={{ fontFamily: font }}
                    >
                      {provider.name}
                    </h3>
                    {provider.verified && (
                      <BadgeCheck className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-[#1F3D2B]/60" style={{ fontFamily: font }}>
                    {provider.specialty}
                  </p>
                </div>
              </div>

              {/* شارة شركة مرخصة موثوقة */}
              <div
                className="flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-xl w-fit"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(59,91,254,0.08) 100%)',
                  border: '1.5px solid rgba(212,175,55,0.35)',
                }}
              >
                <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                <span
                  className="text-xs font-bold"
                  style={{ fontFamily: font, color: '#8B6914' }}
                >
                  شركة مرخصة وموثوقة
                </span>
                <Award className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#3B5BFE' }} />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <Stars rating={provider.rating} />
                <span className="text-lg font-bold text-[#1F3D2B]" style={{ fontFamily: font }}>
                  {provider.rating}
                </span>
                <span className="text-sm text-[#1F3D2B]/50" style={{ fontFamily: font }}>
                  ({provider.reviews})
                </span>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/30">
                  <span className="text-xs font-semibold text-[#D4AF37]" style={{ fontFamily: font }}>
                    استجابة سريعة
                  </span>
                </div>
                <div className="px-3 py-1 bg-[#3B5BFE]/10 rounded-full border border-[#3B5BFE]/30">
                  <span className="text-xs font-semibold text-[#3B5BFE]" style={{ fontFamily: font }}>
                    عروض فورية
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1F3D2B]/10 gap-2">

                {/* اطلع على الخريطة — عرض فقط بدون تفاعل */}
                <div
                  className="flex items-center gap-1.5 text-[#1F3D2B]/40 cursor-default select-none"
                  title="سجّل دخولك لعرض الخريطة"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-semibold" style={{ fontFamily: font }}>
                    اطلع على الخريطة
                  </span>
                </div>

                {/* زر التفاصيل — ينقل إلى تسجيل الدخول */}
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-bold transition-all hover:shadow-md active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #b8960f 100%)',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(212,175,55,0.25)',
                    fontFamily: font,
                  }}
                >
                  <span>التفاصيل</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-10">
          <button
            className="px-8 py-3 bg-white/80 backdrop-blur-md text-[#1F3D2B] font-semibold rounded-xl border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-md transition-all"
            style={{ fontFamily: font }}
          >
            عرض المزيد
            <ArrowLeft className="inline-block w-4 h-4 mr-2" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Other Cities Section
// ══════════════════════════════════════════════
function OtherCitiesSection() {
  const navigate = useNavigate();
  const otherCities = EMIRATES_AND_CITIES.filter((c) =>
    ['dubai', 'abu-dhabi', 'sharjah', 'ajman'].includes(c.slug)
  );

  return (
    <section className="py-16 bg-gradient-to-b from-[#EFE7D8] to-[#F5EEE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#1F3D2B] mb-8 text-center" style={{ fontFamily: font }}>
          استكشف مدن أخرى
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {otherCities.map((city) => (
            <button
              key={city.slug}
              onClick={() => navigate(`/map/${city.slug}`)}
              className="group bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/60 hover:border-[#D4AF37]/40 shadow-sm hover:shadow-md transition-all text-center"
            >
              <MapPin className="w-10 h-10 mx-auto mb-3 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <div
                className="font-semibold text-base group-hover:text-[#D4AF37] transition-colors"
                style={{ fontFamily: font, color: '#1F3D2B' }}
              >
                {city.nameAr}
              </div>
              <div className="text-xs text-[#1F3D2B]/50 mt-1" style={{ fontFamily: font }}>
                {city.nameEn}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════
export function SEOMapPage() {
  const { city: citySlug, service: serviceSlug } = useParams<{ city: string; service?: string }>();
  const navigate = useNavigate();

  const cityInfo = EMIRATES_AND_CITIES.find((c) => c.slug === citySlug);
  const serviceInfo = serviceSlug ? SERVICES_SEO.find((s) => s.slug === serviceSlug) : undefined;

  const cityName = cityInfo?.nameAr || citySlug || 'الإمارات';
  const serviceName = serviceInfo?.nameAr || 'خدمات البناء والصيانة';

  const canonicalUrl = serviceSlug
    ? `${SITE_DOMAIN}/map/${citySlug}/${serviceSlug}`
    : `${SITE_DOMAIN}/map/${citySlug}`;

  // ── SEO Injection
  useEffect(() => {
    const h1 = `مزودو ${serviceName} في ${cityName}`;
    const title = `${h1} | خريطة تفاعلية 2026 | ${SITE_NAME_AR}`;
    const desc = `اعثر على أفضل مزودي ${serviceName} في ${cityName} على الخريطة التفاعلية. مقارنة التقييمات، الأسعار، وعروض أسعار فورية من مزودين موثّقين في ${cityName}.`;

    document.title = title;
    setMeta('description', desc);
    setMeta('keywords', `${serviceName}, ${cityName}, مقاولات, خريطة, مزودين, بناء, صيانة`);
    setMeta('robots', 'index, follow, max-image-preview:large');
    setLink('canonical', canonicalUrl);

    setMeta('og:title', title, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:type', 'website', 'property');

    injectJsonLd('ld-map-service', {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: serviceName,
      areaServed: {
        '@type': 'City',
        name: cityName,
        containedIn: {
          '@type': 'Country',
          name: 'United Arab Emirates',
        },
      },
      provider: {
        '@type': 'Organization',
        name: SITE_NAME_AR,
        url: SITE_DOMAIN,
      },
    });

    injectJsonLd('ld-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: SITE_NAME_AR,
          item: SITE_DOMAIN,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'الخريطة',
          item: `${SITE_DOMAIN}/maps`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: cityName,
          item: `${SITE_DOMAIN}/map/${citySlug}`,
        },
        ...(serviceSlug
          ? [
              {
                '@type': 'ListItem',
                position: 4,
                name: serviceName,
                item: canonicalUrl,
              },
            ]
          : []),
      ],
    });
  }, [cityName, serviceName, citySlug, serviceSlug, canonicalUrl]);

  return (
    <div className="min-h-screen bg-[#F5EEE1]" style={{ fontFamily: font }}>
      <SEOHead
        title={`مزودو ${serviceName} في ${cityName}`}
        description={`اعثر على أفضل مزودي ${serviceName} في ${cityName} على الخريطة التفاعلية. مقارنة التقييمات والأسعار وعروض فورية.`}
        canonicalPath={serviceSlug ? `/map/${citySlug}/${serviceSlug}` : `/map/${citySlug}`}
        keywords={[serviceName, cityName, 'خريطة مقاولين', 'مزودي خدمات', `${serviceName} ${cityName}`]}
        geo={cityInfo ? { lat: parseFloat(cityInfo.lat), lng: parseFloat(cityInfo.lng), city: cityName, region: 'AE' } : undefined}
        breadcrumbs={[
          { name: 'الخريطة', url: '/maps' },
          { name: cityName, url: `/map/${citySlug}` },
          ...(serviceSlug && serviceName ? [{ name: serviceName, url: `/map/${citySlug}/${serviceSlug}` }] : []),
        ]}
        localBusiness={{
          name: `${serviceName} في ${cityName} — ${SITE_NAME_AR}`,
          description: `أفضل مزودي ${serviceName} في ${cityName}`,
          url: canonicalUrl,
          address: { addressLocality: cityName, addressCountry: 'AE' },
          geo: cityInfo ? { lat: parseFloat(cityInfo.lat), lng: parseFloat(cityInfo.lng) } : undefined,
        }}
      />
      <SEOHeader />
      <main>
        <HeroSection cityName={cityName} serviceName={serviceName} citySlug={citySlug || 'dubai'} />
        <MapSection cityName={cityName} />
        <ProvidersListSection cityName={cityName} />
        <OtherCitiesSection />
      </main>
      <SEOFooter />
    </div>
  );
}