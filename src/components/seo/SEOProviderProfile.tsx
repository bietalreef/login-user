/**
 * SEOProviderProfile.tsx — صفحة مزود الخدمة العامة
 * ════════════════════════════════════════════════════════════════════
 * Template 2/4: صفحة مزود خدمة عامة (Public Provider Profile)
 * Route: /provider/:slug
 * Design: Sandy Beige + Frosted Glass + Gold/Royal Blue accents
 * SEO: LocalBusiness + Review + Breadcrumb schemas
 * Sections: Hero / About / Services / Portfolio / Location / Reviews / Contact
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router@7.1.1';
import { SEOHeader, SEOFooter } from './SEONav';
import {
  SITE_DOMAIN,
  SITE_NAME_AR,
  SERVICES_SEO,
  EMIRATES_AND_CITIES,
} from '../../utils/seoConstants';
import {
  Star, MapPin, Shield, Clock, Phone, CheckCircle,
  ChevronLeft, Building2, Users, Award, Wrench,
  Mail, ArrowLeft, Home, Briefcase, Calendar,
  BadgeCheck, Hammer, MessageCircle, ExternalLink,
} from 'lucide-react';
import { DecorativeMap } from './DecorativeMap';

const font = 'Cairo, Tajawal, sans-serif';

// ══════════════════════════════════════════════
// SEO helpers
// ══════════════════════════════════════════════
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
// Demo Provider Data
// ══════════════════════════════════════════════
interface ProviderData {
  slug: string;
  nameAr: string;
  nameEn: string;
  specialty: string;
  city: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  yearsExperience: number;
  projectsCompleted: number;
  phone: string;
  email: string;
  description: string;
  services: string[];
  portfolio: { title: string; image: string; desc: string }[];
  reviews: { name: string; rating: number; comment: string; date: string }[];
}

const DEMO_PROVIDERS: Record<string, ProviderData> = {
  'elite-contracting-dubai': {
    slug: 'elite-contracting-dubai',
    nameAr: 'شركة النخبة للمقاولات',
    nameEn: 'Elite Contracting LLC',
    specialty: 'مقاولات عامة',
    city: 'دبي',
    rating: 4.9,
    reviewCount: 127,
    verified: true,
    yearsExperience: 12,
    projectsCompleted: 340,
    phone: '+971-50-123-4567',
    email: 'info@elitecontractingdubai.ae',
    description:
      'شركة النخبة للمقاولات — شريكك الموثوق في البناء والتشطيب منذ 2012. نقدم خدمات مقاولات متكاملة تشمل بناء الفلل، التشطيبات الفاخرة، الصيانة الشاملة، وإدارة المشاريع. فريق عمل محترف، مواد بناء عالية الجودة، والتزام كامل بمواعيد التسليم.',
    services: [
      'بناء الفلل والقصور',
      'التشطيبات الداخلية الفاخرة',
      'الصيانة الشاملة',
      'إدارة المشاريع',
      'التصميم المعماري',
      'الديكور الداخلي',
    ],
    portfolio: [
      {
        title: 'فيلا سكنية فاخرة — دبي لاند',
        image: 'https://images.unsplash.com/photo-1727444879868-bbd6e27b1347?w=600&q=80',
        desc: 'بناء فيلا سكنية بمساحة 650 متر مربع مع تشطيبات فاخرة',
      },
      {
        title: 'مشروع تجديد مبنى تجاري — الخليج التجاري',
        image: 'https://images.unsplash.com/photo-1770823556202-2eba715a415b?w=600&q=80',
        desc: 'تجديد شامل لمبنى تجاري من 4 طوابق',
      },
      {
        title: 'قصر فاخر — المرابع العربية',
        image: 'https://images.unsplash.com/photo-1649663724528-3bd2ce98b6e3?w=600&q=80',
        desc: 'بناء قصر فاخر بمساحة 1200 متر مربع',
      },
    ],
    reviews: [
      {
        name: 'أحمد الكعبي',
        rating: 5,
        comment:
          'عمل احترافي ممتاز. الفريق ملتزم بالمواعيد والجودة عالية. أنصح بشدة بالتعامل معهم.',
        date: '2026-03-10',
      },
      {
        name: 'فاطمة النعيمي',
        rating: 5,
        comment:
          'بنوا لنا فيلا أحلامنا! تشطيبات فاخرة وأسعار معقولة. شكراً لفريق النخبة.',
        date: '2026-02-28',
      },
      {
        name: 'سالم المنصوري',
        rating: 4,
        comment: 'خدمة جيدة جداً. التسليم كان في الموعد المحدد. راضي عن النتيجة.',
        date: '2026-02-15',
      },
    ],
  },
};

// ══════════════════════════════════════════════
// Stars Component
// ══════════════════════════════════════════════
function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
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
function HeroSection({ provider }: { provider: ProviderData }) {
  return (
    <section className="relative pt-32 pb-16 bg-gradient-to-b from-[#F5EEE1] via-[#EFE7D8] to-[#F5EEE1] overflow-hidden">
      {/* Pattern Background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left: Info */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-6" style={{ fontFamily: font }}>
              <Home className="w-4 h-4 text-[#D4AF37]" />
              <ChevronLeft className="w-3 h-3 text-gray-400" />
              <span className="text-[#1F3D2B]/60">مزود الخدمات</span>
              <ChevronLeft className="w-3 h-3 text-gray-400" />
              <span className="text-[#1F3D2B] font-semibold">{provider.nameAr}</span>
            </div>

            {/* Name + Verified Badge */}
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-[#1F3D2B]" style={{ fontFamily: font }}>
                {provider.nameAr}
              </h1>
              {provider.verified && (
                <div className="flex items-center gap-1 px-3 py-1 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/30">
                  <BadgeCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-semibold text-[#D4AF37]" style={{ fontFamily: font }}>
                    موثّق
                  </span>
                </div>
              )}
            </div>

            {/* English Name */}
            <p className="text-lg text-[#1F3D2B]/50 mb-6" style={{ fontFamily: font }}>
              {provider.nameEn}
            </p>

            {/* Rating + Reviews */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Stars rating={provider.rating} size="md" />
                <span className="text-2xl font-bold text-[#1F3D2B]" style={{ fontFamily: font }}>
                  {provider.rating}
                </span>
              </div>
              <div className="text-sm text-[#1F3D2B]/60" style={{ fontFamily: font }}>
                ({provider.reviewCount} تقييم)
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Calendar, label: 'سنوات الخبرة', value: provider.yearsExperience },
                { icon: Briefcase, label: 'مشروع مكتمل', value: provider.projectsCompleted },
                { icon: MapPin, label: 'المدينة', value: provider.city },
                { icon: Wrench, label: 'التخصص', value: provider.specialty },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/60"
                >
                  <stat.icon className="w-5 h-5 text-[#D4AF37] mb-2" />
                  <div className="text-lg font-bold text-[#1F3D2B]" style={{ fontFamily: font }}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: font }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`tel:${provider.phone}`}
                className="px-6 py-3 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-[#0B1120] font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                style={{ fontFamily: font }}
              >
                <Phone className="w-4 h-4" />
                <span>اتصل الآن</span>
              </a>

              <a
                href={`mailto:${provider.email}`}
                className="px-6 py-3 bg-white/80 backdrop-blur-md text-[#1F3D2B] font-semibold rounded-xl border-2 border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-md transition-all flex items-center gap-2"
                style={{ fontFamily: font }}
              >
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>راسلنا</span>
              </a>

              <button
                className="px-6 py-3 bg-[#3B5BFE]/10 text-[#3B5BFE] font-semibold rounded-xl border-2 border-[#3B5BFE]/20 hover:border-[#3B5BFE] hover:shadow-md transition-all flex items-center gap-2"
                style={{ fontFamily: font }}
              >
                <MessageCircle className="w-4 h-4" />
                <span>طلب عرض سعر</span>
              </button>
            </div>
          </div>

          {/* Right: Logo placeholder */}
          <div className="w-full lg:w-auto">
            <div className="w-64 h-64 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-white/60 shadow-lg flex items-center justify-center">
              <Building2 className="w-24 h-24 text-[#D4AF37]/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// About Section
// ══════════════════════════════════════════════
function AboutSection({ provider }: { provider: ProviderData }) {
  return (
    <section className="py-16 bg-[#F5EEE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#1F3D2B] mb-6" style={{ fontFamily: font }}>
          نبذة عن الشركة
        </h2>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/60 shadow-sm">
          <p
            className="text-lg leading-relaxed text-[#1F3D2B]/80"
            style={{ fontFamily: font }}
          >
            {provider.description}
          </p>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Services Section
// ══════════════════════════════════════════════
function ServicesOfferedSection({ provider }: { provider: ProviderData }) {
  return (
    <section className="py-16 bg-gradient-to-b from-[#F5EEE1] to-[#EFE7D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#1F3D2B] mb-8" style={{ fontFamily: font }}>
          الخدمات المقدمة
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {provider.services.map((service, i) => (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/60 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
            >
              <CheckCircle className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
              <span className="text-lg font-semibold text-[#1F3D2B]" style={{ fontFamily: font }}>
                {service}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Portfolio Section
// ══════════════════════════════════════════════
function PortfolioSection({ provider }: { provider: ProviderData }) {
  return (
    <section className="py-16 bg-[#F5EEE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#1F3D2B] mb-8" style={{ fontFamily: font }}>
          معرض المشاريع
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {provider.portfolio.map((project, i) => (
            <div
              key={i}
              className="group bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/60 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="relative h-56 bg-gray-200 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#1F3D2B] mb-2" style={{ fontFamily: font }}>
                  {project.title}
                </h3>
                <p className="text-sm text-[#1F3D2B]/60" style={{ fontFamily: font }}>
                  {project.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Location Map Section
// ══════════════════════════════════════════════
function LocationSection({ provider }: { provider: ProviderData }) {
  return (
    <section className="py-16 bg-gradient-to-b from-[#F5EEE1] to-[#EFE7D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#C8A86A]" />
          <div>
            <h2 className="text-2xl font-bold text-[#1F3D2B]" style={{ fontFamily: font }}>
              موقع {provider.nameAr}
            </h2>
            <p className="text-sm text-[#1F3D2B]/50 mt-1" style={{ fontFamily: font }}>
              {provider.city} — تحقق من موقع المزود وابحث عن مزودين قريبين
            </p>
          </div>
        </div>
        <DecorativeMap
          cityName={provider.city}
          compact={false}
          hideHeader={true}
          hideStrip={false}
        />
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Reviews Section
// ══════════════════════════════════════════════
function ReviewsSection({ provider }: { provider: ProviderData }) {
  return (
    <section className="py-16 bg-gradient-to-b from-[#EFE7D8] to-[#F5EEE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#1F3D2B] mb-8" style={{ fontFamily: font }}>
          آراء العملاء
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {provider.reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#3B5BFE]/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#1F3D2B]" style={{ fontFamily: font }}>
                      {review.name}
                    </div>
                    <div className="text-xs text-[#1F3D2B]/50" style={{ fontFamily: font }}>
                      {review.date}
                    </div>
                  </div>
                </div>
                <Stars rating={review.rating} />
              </div>
              <p className="text-sm text-[#1F3D2B]/70 leading-relaxed" style={{ fontFamily: font }}>
                "{review.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════
export function SEOProviderProfile() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const provider = DEMO_PROVIDERS[slug || 'elite-contracting-dubai'] || DEMO_PROVIDERS['elite-contracting-dubai'];

  // ── SEO Injection
  useEffect(() => {
    const title = `${provider.nameAr} — ${provider.specialty} في ${provider.city} | ${SITE_NAME_AR}`;
    const desc = `${provider.nameAr} في ${provider.city}. تقييم ${provider.rating}/5 من ${provider.reviewCount} عميل. ${provider.yearsExperience} سنوات خبرة، ${provider.projectsCompleted} مشروع مكتمل. ${provider.description.slice(0, 120)}...`;

    document.title = title;
    setMeta('description', desc);
    setMeta(
      'keywords',
      `${provider.nameAr}, ${provider.specialty}, ${provider.city}, مقاولات, بناء, تشطيب, صيانة`
    );
    setMeta('robots', 'index, follow, max-image-preview:large');
    setLink('canonical', `${SITE_DOMAIN}/provider/${provider.slug}`);

    setMeta('og:title', title, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:url', `${SITE_DOMAIN}/provider/${provider.slug}`, 'property');
    setMeta('og:type', 'profile', 'property');

    injectJsonLd('ld-provider', {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: provider.nameAr,
      alternateName: provider.nameEn,
      description: provider.description,
      telephone: provider.phone,
      email: provider.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: provider.city,
        addressCountry: 'AE',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: provider.rating,
        reviewCount: provider.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
      url: `${SITE_DOMAIN}/provider/${provider.slug}`,
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
          name: 'مزودو الخدمات',
          item: `${SITE_DOMAIN}/marketplace`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: provider.nameAr,
          item: `${SITE_DOMAIN}/provider/${provider.slug}`,
        },
      ],
    });
  }, [provider]);

  return (
    <div className="min-h-screen bg-[#F5EEE1]" style={{ fontFamily: font }}>
      <SEOHeader />
      <main>
        <HeroSection provider={provider} />
        <AboutSection provider={provider} />
        <ServicesOfferedSection provider={provider} />
        <PortfolioSection provider={provider} />
        <LocationSection provider={provider} />
        <ReviewsSection provider={provider} />
      </main>
      <SEOFooter />
    </div>
  );
}