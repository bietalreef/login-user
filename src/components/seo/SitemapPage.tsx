/**
 * SitemapPage.tsx — خريطة الموقع البصرية
 * ══════════════════════════════════════════════
 * صفحة HTML تعرض جميع روابط الموقع العامة
 * مع structured data لـ SiteNavigationElement
 * متاحة على /sitemap
 */

import { useEffect } from 'react';
import { SEOHead } from './SEOHead';
import { SEOHeader, SEOFooter } from './SEONav';
import { SITE_DOMAIN, EMIRATES_AND_CITIES, SERVICES_SEO } from '../../utils/seoConstants';
import { Map, Layers, Globe, FileText, Star, Wrench, MapPin, ChevronLeft, ExternalLink } from 'lucide-react';

const font = 'Cairo, Tajawal, sans-serif';

// ── جميع الروابط العامة للموقع ──
const SEO_SLUGS = [
  { slug: 'contractors-in-uae',       ar: 'مقاولات البناء في الإمارات',       en: 'Contractors in UAE' },
  { slug: 'interior-design-uae',      ar: 'تصميم داخلي في الإمارات',          en: 'Interior Design UAE' },
  { slug: 'marble-suppliers-uae',     ar: 'موردو الرخام في الإمارات',          en: 'Marble Suppliers UAE' },
  { slug: 'electrical-contractors-uae', ar: 'مقاولو الكهرباء في الإمارات',    en: 'Electrical Contractors UAE' },
  { slug: 'villa-renovation-uae',     ar: 'تجديد الفلل في الإمارات',          en: 'Villa Renovation UAE' },
  { slug: 'building-materials-uae',   ar: 'مواد البناء في الإمارات',          en: 'Building Materials UAE' },
  { slug: 'maintenance-services-uae', ar: 'خدمات الصيانة في الإمارات',        en: 'Maintenance Services UAE' },
  { slug: 'craftsmen-uae',            ar: 'العمالة الحرفية في الإمارات',       en: 'Craftsmen UAE' },
  { slug: 'cleaning-services-uae',    ar: 'خدمات التنظيف في الإمارات',        en: 'Cleaning Services UAE' },
  { slug: 'equipment-rental-uae',     ar: 'تأجير المعدات في الإمارات',        en: 'Equipment Rental UAE' },
  { slug: 'furniture-decor-uae',      ar: 'الأثاث والديكور في الإمارات',      en: 'Furniture & Decor UAE' },
];

const PLATFORM_PAGES = [
  { path: '/seo/marketplace', ar: 'سوق التعاقد', en: 'Marketplace' },
  { path: '/seo/store',       ar: 'المتجر الذكي', en: 'Smart Store' },
  { path: '/seo/dashboards',  ar: 'لوحات التحكم',  en: 'Dashboards' },
  { path: '/seo/platform',    ar: 'عرض المنصة',   en: 'Platform Showcase' },
  { path: '/seo/tools',       ar: 'الأدوات الذكية', en: 'AI Tools' },
];

const LEGAL_PAGES = [
  { path: '/privacy', ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
  { path: '/terms',   ar: 'شروط الاستخدام',  en: 'Terms of Service' },
  { path: '/about',   ar: 'عن المنصة',       en: 'About Us' },
  { path: '/webp',    ar: 'محوّل WebP',      en: 'WebP Converter' },
];

interface SectionProps {
  icon: React.ReactNode;
  titleAr: string;
  count: number;
  color: string;
  children: React.ReactNode;
}

function Section({ icon, titleAr, count, color, children }: SectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50" style={{ background: `${color}08` }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <div>
          <p className="font-black text-[#1F3D2B] text-sm" style={{ fontFamily: font }}>{titleAr}</p>
          <p className="text-[11px] text-[#1F3D2B]/40 font-semibold" style={{ fontFamily: font }}>{count} رابط</p>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function LinkRow({ href, labelAr, labelEn, external = false }: { href: string; labelAr: string; labelEn?: string; external?: boolean }) {
  return (
    <a
      href={external ? href : `${SITE_DOMAIN}${href}`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#F5EEE1] transition-colors group"
    >
      <div>
        <p className="text-sm font-bold text-[#1F3D2B] group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: font }}>
          {labelAr}
        </p>
        {labelEn && (
          <p className="text-[11px] text-[#1F3D2B]/40 font-medium mt-0.5" style={{ fontFamily: font }}>{labelEn}</p>
        )}
        <p className="text-[10px] text-[#3B5BFE]/60 font-mono mt-0.5 break-all">{external ? href : `${SITE_DOMAIN}${href}`}</p>
      </div>
      {external
        ? <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]/50 flex-shrink-0" />
        : <ChevronLeft className="w-4 h-4 text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors flex-shrink-0" />
      }
    </a>
  );
}

export function SitemapPage() {
  // inject SiteNavigationElement JSON-LD
  useEffect(() => {
    const allUrls = [
      `${SITE_DOMAIN}/`,
      ...SEO_SLUGS.map(s => `${SITE_DOMAIN}/${s.slug}`),
      ...EMIRATES_AND_CITIES.map(c => `${SITE_DOMAIN}/map/${c.slug}`),
      ...SERVICES_SEO.map(s => `${SITE_DOMAIN}/map/dubai/${s.slug}`),
      ...PLATFORM_PAGES.map(p => `${SITE_DOMAIN}${p.path}`),
      ...LEGAL_PAGES.map(p => `${SITE_DOMAIN}${p.path}`),
    ];

    let el = document.getElementById('ld-sitemap-nav') as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = 'ld-sitemap-nav';
      el.setAttribute('type', 'application/ld+json');
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'خريطة موقع بيت الريف',
      'numberOfItems': allUrls.length,
      'itemListElement': allUrls.map((url, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'url': url,
      })),
    }, null, 2);

    return () => { document.getElementById('ld-sitemap-nav')?.remove(); };
  }, []);

  const totalLinks =
    1 + // رئيسية
    SEO_SLUGS.length +
    EMIRATES_AND_CITIES.length +
    SERVICES_SEO.length * EMIRATES_AND_CITIES.length +
    PLATFORM_PAGES.length +
    LEGAL_PAGES.length;

  return (
    <>
      <SEOHead
        title="خريطة الموقع — بيت الريف"
        description="جميع روابط منصة بيت الريف: صفحات الخدمات، صفحات المدن والإمارات، صفحات المزودين، وكافة أقسام المنصة."
        canonicalPath="/sitemap"
        keywords={['خريطة الموقع', 'sitemap', 'بيت الريف', 'روابط المنصة']}
        breadcrumbs={[{ name: 'خريطة الموقع', url: '/sitemap' }]}
      />

      <SEOHeader />

      <main dir="rtl" style={{ background: '#F5EEE1', minHeight: '100vh', fontFamily: font }}>
        {/* Hero */}
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1F3D2B 0%, #2d5a3f 60%, #3B5BFE 100%)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #D4AF37, transparent 55%)' }} />
          <div className="relative max-w-4xl mx-auto px-5 py-16 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.3)' }}>
              <Globe className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h1 className="text-3xl font-black text-white mb-3" style={{ fontFamily: font }}>
              خريطة الموقع
            </h1>
            <p className="text-white/60 text-base max-w-xl mx-auto" style={{ fontFamily: font }}>
              جميع الصفحات العامة لمنصة بيت الريف — متاحة لمحركات البحث وزوار الموقع
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
              <Layers className="w-4 h-4" />
              <span>{totalLinks}+ رابط مفهرَس</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

          {/* ── الصفحة الرئيسية ── */}
          <Section icon={<Globe className="w-5 h-5" />} titleAr="الصفحة الرئيسية" count={1} color="#3B5BFE">
            <LinkRow href="/" labelAr="بيت الريف — منصة البناء والتشطيب في الإمارات" labelEn="Beit Al Reef — UAE Construction Platform" />
          </Section>

          {/* ── خدمات SEO ── */}
          <Section icon={<Wrench className="w-5 h-5" />} titleAr="صفحات الخدمات" count={SEO_SLUGS.length} color="#D4AF37">
            <div className="space-y-1">
              {SEO_SLUGS.map((s) => (
                <LinkRow key={s.slug} href={`/${s.slug}`} labelAr={s.ar} labelEn={s.en} />
              ))}
            </div>
          </Section>

          {/* ── خرائط المدن ── */}
          <Section icon={<MapPin className="w-5 h-5" />} titleAr="صفحات الخريطة (المدن والإمارات)" count={EMIRATES_AND_CITIES.length} color="#EF4444">
            <div className="space-y-1">
              {EMIRATES_AND_CITIES.map((c) => (
                <LinkRow
                  key={c.slug}
                  href={`/map/${c.slug}`}
                  labelAr={`خريطة مزودي الخدمات — ${c.nameAr}`}
                  labelEn={`Service Providers Map — ${c.nameEn}`}
                />
              ))}
            </div>
          </Section>

          {/* ── خرائط الخدمات بالمدن ── */}
          <Section icon={<Map className="w-5 h-5" />} titleAr="صفحات الخريطة (الخدمة × المدينة)" count={SERVICES_SEO.length * EMIRATES_AND_CITIES.length} color="#8B5CF6">
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
              {SERVICES_SEO.slice(0, 3).map((svc) =>
                EMIRATES_AND_CITIES.slice(0, 4).map((city) => (
                  <LinkRow
                    key={`${svc.slug}-${city.slug}`}
                    href={`/map/${city.slug}/${svc.slug}`}
                    labelAr={`${svc.nameAr} في ${city.nameAr}`}
                    labelEn={`${svc.nameEn} in ${city.nameEn}`}
                  />
                ))
              )}
              <p className="text-center text-xs text-[#1F3D2B]/30 py-2 font-bold" style={{ fontFamily: font }}>
                + {SERVICES_SEO.length * EMIRATES_AND_CITIES.length - 12} صفحة إضافية
              </p>
            </div>
          </Section>

          {/* ── ميزات المنصة ── */}
          <Section icon={<Star className="w-5 h-5" />} titleAr="صفحات ميزات المنصة" count={PLATFORM_PAGES.length} color="#F59E0B">
            <div className="space-y-1">
              {PLATFORM_PAGES.map((p) => (
                <LinkRow key={p.path} href={p.path} labelAr={p.ar} labelEn={p.en} />
              ))}
            </div>
          </Section>

          {/* ── صفحات قانونية ── */}
          <Section icon={<FileText className="w-5 h-5" />} titleAr="الصفحات القانونية والعامة" count={LEGAL_PAGES.length} color="#6B7280">
            <div className="space-y-1">
              {LEGAL_PAGES.map((p) => (
                <LinkRow key={p.path} href={p.path} labelAr={p.ar} labelEn={p.en} />
              ))}
            </div>
          </Section>

          {/* ── XML Sitemap Link ── */}
          <div className="bg-white rounded-2xl border border-[#3B5BFE]/20 p-5 text-center shadow-sm">
            <p className="text-sm font-bold text-[#1F3D2B]/60 mb-3" style={{ fontFamily: font }}>
              ملف Sitemap XML لمحركات البحث
            </p>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #1F3D2B, #3B5BFE)', color: '#fff', fontFamily: font }}
            >
              <Globe className="w-4 h-4" />
              sitemap.xml
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
            <p className="text-[11px] text-[#1F3D2B]/30 mt-3 font-mono">{SITE_DOMAIN}/sitemap.xml</p>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200 mt-4">
          <p className="text-xs text-[#1F3D2B]/30 font-bold" style={{ fontFamily: font }}>
            © {new Date().getFullYear()} بيت الريف — جميع الحقوق محفوظة
          </p>
          <p className="text-[11px] text-[#1F3D2B]/20 mt-1 font-mono">{SITE_DOMAIN}/sitemap</p>
        </div>
      </main>

      <SEOFooter />
    </>
  );
}