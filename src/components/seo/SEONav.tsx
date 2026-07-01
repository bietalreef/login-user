/**
 * SEONav.tsx — الهيدر والفوتر الموحّد لجميع صفحات SEO الخارجية
 * ════════════════════════════════════════════════════════════════
 * يُستخدم في: SEOServicePage / SEOProductPage / SEOMapPage / SEOLandingPage
 * القواعد:   لا أخضر | لا إيموجي | أيقونات lucide فقط
 */

import { useState } from 'react';
import { useNavigate } from 'react-router@7.1.1';
import {
  ChevronDown, ChevronLeft, Menu, X, MapPin, ShoppingBag,
  Wrench, Home, Hammer, Truck, Brush, Package, Sparkles,
  Building2, Search, Phone,
} from 'lucide-react';
import { SITE_NAME_AR, EMIRATES_AND_CITIES, SERVICES_SEO } from '../../utils/seoConstants';
import { supabase } from '../../utils/supabase/client';

const bietAlreefLogo = '/assets/logo-alt.png';

const font = 'Cairo, Tajawal, sans-serif';

// ── جميع صفحات الخدمات الـ 11 ──
const ALL_SERVICE_PAGES = [
  { slug: 'contractors-in-uae', label: 'شركات المقاولات', icon: Building2 },
  { slug: 'interior-design-uae', label: 'التصميم الداخلي', icon: Sparkles },
  { slug: 'marble-suppliers-uae', label: 'رخام وجرانيت', icon: Package },
  { slug: 'electrical-contractors-uae', label: 'مقاولو الكهرباء', icon: Wrench },
  { slug: 'villa-renovation-uae', label: 'ترميم الفلل', icon: Home },
  { slug: 'building-materials-uae', label: 'مواد البناء', icon: Package },
  { slug: 'maintenance-services-uae', label: 'خدمات الصيانة', icon: Hammer },
  { slug: 'craftsmen-uae', label: 'حرفيون ومهنيون', icon: Wrench },
  { slug: 'cleaning-services-uae', label: 'خدمات التنظيف', icon: Brush },
  { slug: 'equipment-rental-uae', label: 'تأجير المعدات', icon: Truck },
  { slug: 'furniture-decor-uae', label: 'أثاث وديكور', icon: ShoppingBag },
];

// ── فوتر كامل مع جميع الروابط
export function SEOFooter() {
  return (
    <footer
      className="bg-[#1F3D2B] text-white/60 py-14 mt-12 border-t-4 border-[#D4AF37]/20"
      dir="rtl"
      style={{ fontFamily: font }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-1.5 rounded-xl shadow-sm">
                <img src={bietAlreefLogo} alt={SITE_NAME_AR} className="w-10 h-10 object-contain" />
              </div>
              <div>
                <div className="text-white font-black text-lg leading-none">{SITE_NAME_AR}</div>
                <div className="text-white/40 text-xs font-bold mt-1 tracking-wider">BEIT AL REEF</div>
              </div>
            </div>
            <p className="text-sm leading-[2] mb-4 text-white/50">
              منصة البناء والتشطيب الذكية في الإمارات. نربطك بأفضل المقاولين والحرفيين
              والموردين في دبي وأبوظبي والشارقة وجميع الإمارات.
            </p>
            <a
              href="/agents"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C8A86A] text-[#1F3D2B] font-black text-xs shadow-lg"
            >
              <Search className="w-3.5 h-3.5" />
              دخول المنصة
            </a>
          </div>

          {/* الخدمات — العمود الأول */}
          <div>
            <h3 className="text-sm font-black text-white mb-4 pb-2 border-b border-white/10">الخدمات</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="/contractors-in-uae" className="hover:text-[#D4AF37] transition-colors font-bold">شركات المقاولات</a></li>
              <li><a href="/interior-design-uae" className="hover:text-[#D4AF37] transition-colors font-bold">التصميم الداخلي</a></li>
              <li><a href="/marble-suppliers-uae" className="hover:text-[#D4AF37] transition-colors font-bold">رخام وجرانيت</a></li>
              <li><a href="/electrical-contractors-uae" className="hover:text-[#D4AF37] transition-colors font-bold">مقاولو الكهرباء</a></li>
              <li><a href="/villa-renovation-uae" className="hover:text-[#D4AF37] transition-colors font-bold">ترميم الفلل</a></li>
              <li><a href="/building-materials-uae" className="hover:text-[#D4AF37] transition-colors font-bold">مواد البناء</a></li>
              <li><a href="/maintenance-services-uae" className="hover:text-[#D4AF37] transition-colors font-bold">خدمات الصيانة</a></li>
              <li><a href="/craftsmen-uae" className="hover:text-[#D4AF37] transition-colors font-bold">حرفيون ومهنيون</a></li>
              <li><a href="/cleaning-services-uae" className="hover:text-[#D4AF37] transition-colors font-bold">خدمات التنظيف</a></li>
              <li><a href="/equipment-rental-uae" className="hover:text-[#D4AF37] transition-colors font-bold">تأجير المعدات</a></li>
              <li><a href="/furniture-decor-uae" className="hover:text-[#D4AF37] transition-colors font-bold">أثاث وديكور</a></li>
            </ul>
          </div>

          {/* الخريطة حسب المدينة */}
          <div>
            <h3 className="text-sm font-black text-white mb-4 pb-2 border-b border-white/10">الخريطة بالمدن</h3>
            <ul className="space-y-2 text-xs">
              {EMIRATES_AND_CITIES.map(c => (
                <li key={c.slug}>
                  <a href={`/map/${c.slug}`} className="hover:text-[#D4AF37] transition-colors font-bold flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#D4AF37]/50 flex-shrink-0" />
                    {c.nameAr}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* روابط سريعة + قانونية */}
          <div>
            <h3 className="text-sm font-black text-white mb-4 pb-2 border-b border-white/10">روابط سريعة</h3>
            <ul className="space-y-2 text-xs mb-6">
              <li><a href="/" className="hover:text-[#D4AF37] font-bold">الرئيسية</a></li>
              <li><a href="/seo/platform" className="hover:text-[#D4AF37] font-bold">نظرة عامة على المنصة</a></li>
              <li><a href="/seo/marketplace" className="hover:text-[#D4AF37] font-bold">سوق المقاولات</a></li>
              <li><a href="/seo/store" className="hover:text-[#D4AF37] font-bold">متجر بيت الريف</a></li>
              <li><a href="/seo/tools" className="hover:text-[#D4AF37] font-bold">الأدوات الذكية</a></li>
              <li><a href="/seo/dashboards" className="hover:text-[#D4AF37] font-bold">لوحات التحكم</a></li>
            </ul>
            <h3 className="text-sm font-black text-white mb-3">قانوني</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="/privacy" className="hover:text-[#D4AF37] font-bold">سياسة الخصوصية</a></li>
              <li><a href="/terms" className="hover:text-[#D4AF37] font-bold">الشروط والأحكام</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <p className="text-white/30 font-bold">
            &copy; {new Date().getFullYear()} {SITE_NAME_AR} — جميع الحقوق محفوظة
          </p>
          <div className="flex flex-wrap gap-4 text-white/30 font-bold">
            <span>الإمارات العربية المتحدة</span>
            <span>|</span>
            <span>UAE Construction & Building Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── هيدر موحّد
interface SEOHeaderProps {
  activeSlug?: string;
}

export function SEOHeader({ activeSlug }: SEOHeaderProps) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── زر دخول التطبيق ──
  // /agents → AppShell يعرض LoginApp تلقائياً لو غير مسجّل
  const handleEnterApp = () => {
    window.location.href = '/agents';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm" style={{ fontFamily: font }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Logo & Menu Button */}
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 group flex-shrink-0">
            <img src={bietAlreefLogo} alt={SITE_NAME_AR} className="w-10 h-10 object-contain" />
            <div className="hidden sm:block">
              <div className="text-[#1A1A1A] font-black text-sm leading-none">{SITE_NAME_AR}</div>
              <div className="text-[#1A1A1A]/40 text-[9px] font-bold leading-none mt-0.5 tracking-wider">BEIT AL REEF</div>
            </div>
          </a>
          <button
            className="p-2 rounded-xl text-[#1F3D2B]/80 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all bg-gray-50 border border-gray-100 shadow-sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="القائمة"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleEnterApp}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C8A86A] text-white text-xs font-black shadow-md hover:shadow-lg hover:scale-[1.02] transition-all whitespace-nowrap flex items-center gap-2"
          >
            دخول التطبيق
            <ChevronLeft className="w-4 h-4 hidden sm:block" />
          </button>
        </div>
      </div>

      {/* Global Dropdown Menu (Mobile & Desktop) */}
      {mobileOpen && (
        <div className="absolute top-full right-0 w-full md:w-[480px] bg-white/95 backdrop-blur-xl border-b md:border md:border-t-0 border-gray-200 shadow-2xl md:rounded-b-3xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <div className="p-6 space-y-8">
            
            {/* 1. أقسام المنصة */}
            <div>
              <p className="text-[11px] font-black text-[#1A1A1A]/40 mb-3 px-2 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-[#D4AF37]" />
                أقسام المنصة
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a href="/seo/platform" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-[#3B5BFE]/5 hover:text-[#3B5BFE] text-[#1A1A1A]/80 font-bold text-xs transition-all">
                  <Building2 className="w-4 h-4 text-[#3B5BFE]" />
                  المنظومة الشاملة
                </a>
                <a href="/seo/marketplace" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] text-[#1A1A1A]/80 font-bold text-xs transition-all">
                  <Search className="w-4 h-4 text-[#D4AF37]" />
                  سوق المقاولات
                </a>
                <a href="/seo/store" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] text-[#1A1A1A]/80 font-bold text-xs transition-all">
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  متجر مواد البناء
                </a>
                <a href="/seo/tools" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-[#3B5BFE]/5 hover:text-[#3B5BFE] text-[#1A1A1A]/80 font-bold text-xs transition-all">
                  <Wrench className="w-4 h-4 text-[#3B5BFE]" />
                  الأدوات الذكية
                </a>
                <a href="/seo/dashboards" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] text-[#1A1A1A]/80 font-bold text-xs transition-all col-span-2">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  لوحات التحكم والمقاييس
                </a>
              </div>
            </div>

            {/* 2. الخدمات الأساسية */}
            <div>
              <p className="text-[11px] font-black text-[#1A1A1A]/40 mb-3 px-2 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-[#3B5BFE]" />
                الخدمات والمقاولون
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {ALL_SERVICE_PAGES.map(s => (
                  <a key={s.slug} href={`/${s.slug}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeSlug === s.slug 
                        ? 'bg-[#3B5BFE]/10 text-[#3B5BFE] border border-[#3B5BFE]/20' 
                        : 'text-[#1A1A1A]/70 hover:bg-gray-50'
                    }`}>
                    <s.icon className={`w-3.5 h-3.5 ${activeSlug === s.slug ? 'text-[#3B5BFE]' : 'text-gray-400'}`} />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* 3. الخريطة والتصفح حسب المدينة */}
            <div>
              <p className="text-[11px] font-black text-[#1A1A1A]/40 mb-3 px-2 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-[#D4AF37]" />
                التصفح بالمدن
              </p>
              <div className="flex flex-wrap gap-2">
                {EMIRATES_AND_CITIES.map(c => (
                  <a key={c.slug} href={`/map/${c.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-100 text-[11px] font-bold text-[#1A1A1A]/60 hover:border-[#D4AF37]/30 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {c.nameAr}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}