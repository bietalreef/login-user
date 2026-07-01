import { Icon3D, SERVICE_ICONS, TOOL_ICONS } from '../ui/Icon3D';
import { Cpu, Home as HomeIcon } from 'lucide-react';
// Bot not available — using Cpu as alias
const Bot = Cpu;
const bietAlreefLogo = '/assets/logo.png';
import { useTranslation } from '../../contexts/LanguageContext';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router@7.1.1';
import { useTheme } from '../../contexts/ThemeContext';
import {
  SITE_NAME_AR,
  SITE_NAME_EN,
  SITE_TAGLINE_AR,
  SITE_TAGLINE_EN,
  EMIRATES_AND_CITIES,
  SERVICES_SEO,
  INDIVIDUAL_SERVICES_SEO,
  AI_TOOLS_LINKS,
  generateServiceUrl,
  generateCityServiceUrl,
} from '../../utils/seoConstants';

/* ─── قسم قابل للطي — يعرض أول سطر فقط + "المزيد" ─── */
function CollapsibleFooterSection({
  title,
  ariaLabel,
  fontFamily,
  isEn,
  children,
}: {
  title: string;
  ariaLabel: string;
  fontFamily: string;
  isEn: boolean;
  children: (expanded: boolean) => React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav aria-label={ariaLabel} className="mb-6">
      <div className="flex items-center justify-between border-b border-[#E6DCC8] pb-2 mb-4">
        <h2 className="text-base font-bold text-[#1F3D2B]" style={{ fontFamily }}>
          {title}
        </h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[#2AA676] hover:text-[#1F3D2B] text-xs font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-[#1F3D2B]/5"
          style={{ fontFamily }}
          aria-expanded={expanded}
        >
          {expanded ? (isEn ? 'Show Less' : 'أقل') : (isEn ? 'More' : 'المزيد')}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {children(expanded)}
    </nav>
  );
}

export function FooterDirectory() {
  const { language } = useTranslation('common');
  const { isDark } = useTheme();
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif';

  return (
    <footer
      className={`border-t mt-0 ${
        isDark
          ? 'bg-[var(--bait-bg-alt)] border-[var(--bait-border)] text-[var(--bait-text)]'
          : 'bg-[#F5EEE1] border-[#E6DCC8] text-[#1F3D2B]'
      }`}
      dir="rtl"
      role="contentinfo"
      aria-label={isEn ? 'Site directory and links' : 'دليل الموقع والروابط'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ═══ Section: All Services ═══ */}
        <CollapsibleFooterSection
          title={isEn ? 'Services Across UAE' : 'خدماتنا في جميع الإمارات'}
          ariaLabel={isEn ? 'Services' : 'الخدمات'}
          fontFamily={fontFamily}
          isEn={isEn}
        >
          {(expanded) => (
            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[2000px]' : 'max-h-[52px]'}`}>
              {SERVICES_SEO.map((service) => (
                <Link
                  key={service.slug}
                  to={generateServiceUrl(service.slug)}
                  className="group flex items-center gap-2.5 bg-white hover:bg-white rounded-xl p-3 transition-all border border-[#E6DCC8] hover:border-[#2AA676]/40 shadow-sm hover:shadow-md"
                >
                  {SERVICE_ICONS[service.slug] ? (
                    <Icon3D
                      icon={SERVICE_ICONS[service.slug].icon}
                      theme={SERVICE_ICONS[service.slug].theme}
                      size="xs"
                      hoverable={false}
                    />
                  ) : (
                    <span className="text-xl flex-shrink-0">{service.icon}</span>
                  )}
                  <span className="text-[#1F3D2B]/70 group-hover:text-[#2AA676] text-xs font-semibold transition-colors" style={{ fontFamily }}>
                    {isEn ? service.nameEn : service.nameAr}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CollapsibleFooterSection>

        {/* ═══ Section: Individual Trade Services ═══ */}
        <CollapsibleFooterSection
          title={isEn ? 'Individual Trade Services' : 'خدمات الصيانة الفردية'}
          ariaLabel={isEn ? 'Individual Services' : 'خدمات فردية'}
          fontFamily={fontFamily}
          isEn={isEn}
        >
          {(expanded) => (
            <div className={`flex flex-wrap gap-2 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[2000px]' : 'max-h-[36px]'}`}>
              {INDIVIDUAL_SERVICES_SEO.map((service) => (
                <Link
                  key={service.slug}
                  to={generateServiceUrl(service.slug)}
                  className="bg-white hover:bg-white text-[#1F3D2B]/60 hover:text-[#2AA676] text-[11px] font-medium px-3 py-1.5 rounded-full transition-all border border-[#E6DCC8] hover:border-[#2AA676]/30 shadow-sm"
                  style={{ fontFamily }}
                >
                  {service.icon} {isEn ? service.nameEn : service.nameAr}
                </Link>
              ))}
            </div>
          )}
        </CollapsibleFooterSection>

        {/* ═══ Section: Services by City — Critical for Local SEO ═══ */}
        <CollapsibleFooterSection
          title={isEn ? 'Find Services Near You' : 'ابحث عن خدمات بالقرب منك'}
          ariaLabel={isEn ? 'Services by City' : 'الخدمات حسب المدينة'}
          fontFamily={fontFamily}
          isEn={isEn}
        >
          {(expanded) => (
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[4000px]' : 'max-h-[48px]'}`}>
              {EMIRATES_AND_CITIES.map((city) => (
                <div key={city.slug}>
                  <h3
                    className="font-bold text-[#1F3D2B] mb-2 text-sm flex items-center gap-2"
                    style={{ fontFamily }}
                  >
                    <span className="text-[#C8A86A]">📍</span>
                    {isEn ? `Services in ${city.nameEn}` : `خدمات في ${city.nameAr}`}
                  </h3>
                  {expanded && (
                    <ul className="space-y-1">
                      {SERVICES_SEO.slice(0, 5).map((service) => (
                        <li key={`${city.slug}-${service.slug}`}>
                          <Link
                            to={generateCityServiceUrl(service.slug, city.slug)}
                            className="text-[#1F3D2B]/40 hover:text-[#2AA676] text-[11px] transition-colors block py-0.5"
                            style={{ fontFamily }}
                          >
                            {isEn
                              ? `${service.nameEn} in ${city.nameEn}`
                              : `${service.nameAr} في ${city.nameAr}`
                            }
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          to={`/services?city=${city.slug}`}
                          className="text-[#2AA676] hover:text-[#1F3D2B] text-xs font-medium inline-flex items-center gap-1 mt-1"
                          style={{ fontFamily }}
                        >
                          {isEn ? `All services in ${city.nameEn}` : `كل خدمات ${city.nameAr}`}
                          <span>←</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </CollapsibleFooterSection>

        {/* ═══ Section: Smart AI Tools ═══ */}
        <CollapsibleFooterSection
          title={isEn ? 'Free Smart AI Tools' : 'أدوات ذكاء اصطناعي مجانية'}
          ariaLabel={isEn ? 'Smart Tools' : 'الأدوات الذكية'}
          fontFamily={fontFamily}
          isEn={isEn}
        >
          {(expanded) => (
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[2000px]' : 'max-h-[56px]'}`}>
              {AI_TOOLS_LINKS.map((tool) => (
                <Link
                  key={tool.slug}
                  to={tool.route}
                  className="group bg-white hover:bg-white rounded-xl p-4 transition-all border border-[#E6DCC8] hover:border-[#2AA676]/30 shadow-sm hover:shadow-md"
                >
                  <h4 className="text-[#1F3D2B]/80 group-hover:text-[#2AA676] text-sm font-bold mb-1 transition-colors" style={{ fontFamily }}>
                    {isEn ? tool.nameEn : tool.nameAr}
                  </h4>
                  {expanded && (
                    <p className="text-[#1F3D2B]/30 text-[10px] leading-relaxed" style={{ fontFamily }}>
                      {tool.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CollapsibleFooterSection>

        {/* ═══ Section: Quick Links ═══ */}
        <CollapsibleFooterSection
          title={isEn ? 'Quick Links' : 'روابط سريعة'}
          ariaLabel={isEn ? 'Quick Links' : 'روابط سريعة'}
          fontFamily={fontFamily}
          isEn={isEn}
        >
          {(expanded) => (
            <div className={`flex flex-wrap gap-2 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[1000px]' : 'max-h-[36px]'}`}>
              {[
                { to: '/home', ar: 'الرئيسية', en: 'Home' },
                { to: '/services', ar: 'جميع الخدمات', en: 'All Services' },
                { to: '/shop', ar: 'المتجر', en: 'Store' },
                { to: '/maps', ar: 'خريطة المزودين', en: 'Providers Map' },
                { to: '/tools', ar: 'الأدوات الذكية', en: 'Smart Tools' },
                { to: '/weyaak', ar: 'وياك AI', en: 'Weyaak AI' },
                { to: '/projects', ar: 'المشاريع', en: 'Projects' },
                { to: '/rfq', ar: 'طلب عرض سعر', en: 'Request Quote' },
                { to: '/platform', ar: 'مميزات المنصة', en: 'Platform Features' },
                { to: '/wallet', ar: 'محفظة الدار', en: 'Dar Wallet' },
                { to: '/offers', ar: 'العروض', en: 'Offers' },
                { to: '/recommendations', ar: 'التوصيات', en: 'Recommendations' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="bg-white hover:bg-white text-[#1F3D2B]/50 hover:text-[#2AA676] text-xs font-medium px-3 py-1.5 rounded-full transition-all border border-[#E6DCC8] hover:border-[#2AA676]/30 shadow-sm"
                  style={{ fontFamily }}
                >
                  {isEn ? link.en : link.ar}
                </Link>
              ))}
            </div>
          )}
        </CollapsibleFooterSection>

        {/* ─── Weyaak AI CTA ─── */}
        <div className="mb-6">
          <Link
            to="/weyaak"
            className="block bg-white rounded-2xl p-4 border border-[#E6DCC8] shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <Icon3D icon={Bot} theme="emerald" size="md" hoverable={false} />
              <div className="flex-1">
                <h3 className="text-[#1F3D2B] font-bold text-sm group-hover:text-[#2AA676] transition-colors" style={{ fontFamily }}>
                  {isEn ? 'Weyaak – Smart Assistant' : 'وياك - المساعد الذكي'}
                </h3>
                <p className="text-[#1F3D2B]/40 text-[10px]" style={{ fontFamily }}>
                  {isEn ? 'Get instant construction advice with AI' : 'احصل على استشارات بناء فورية بالذكاء الاصطناعي'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-[#2AA676] -rotate-90 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="border-t border-[#E6DCC8] pt-6 mt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo & tagline */}
            <div className="text-center md:text-right flex items-center gap-3">
              <img src={bietAlreefLogo} alt="بيت الريف" className="w-14 h-14 object-contain flex-shrink-0" />
              <div>
                <h2 className="text-xl font-black text-[#1F3D2B] mb-0.5" style={{ fontFamily }}>
                  {isEn ? SITE_NAME_EN : SITE_NAME_AR}
                </h2>
                <p className="text-[#1F3D2B]/40 text-xs" style={{ fontFamily }}>
                  {isEn ? SITE_TAGLINE_EN : SITE_TAGLINE_AR}
                </p>
              </div>
            </div>

            {/* Coverage note — important for Google */}
            <p className="text-[#1F3D2B]/25 text-[10px] text-center max-w-lg leading-relaxed" style={{ fontFamily }}>
              {isEn
                ? `${SITE_NAME_EN} covers all UAE emirates: Dubai, Abu Dhabi, Al Ain, Sharjah, Ajman, Ras Al Khaimah, Umm Al Quwain, and Fujairah. Licensed contractors, verified craftsmen, and quality building materials.`
                : `يغطي ${SITE_NAME_AR} جميع إمارات الدولة: دبي، أبوظبي، العين، الشارقة، عجمان، رأس الخيمة، أم القيوين، والفجيرة. مقاولون مرخصون، حرفيون موثقون، ومواد بناء عالية الجودة.`
              }
            </p>

            {/* Copyright */}
            <p className="text-[#1F3D2B]/20 text-[10px]" style={{ fontFamily }}>
              {isEn ? `© ${new Date().getFullYear()} All Rights Reserved` : `© ${new Date().getFullYear()} جميع الحقوق محفوظة`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}