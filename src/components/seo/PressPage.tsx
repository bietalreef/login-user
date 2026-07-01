/**
 * PressPage.tsx — صفحة الصحافة والإعلام
 * ══════════════════════════════════════════════════
 * الغرض الأساسي: اكتساب روابط خلفية طبيعية
 * كيف تعمل:
 *   1. الصحفيون والمدونون يجدون الصفحة عبر Google
 *   2. يأخذون الـ Kit ويكتبون مقالات عن بيت الريف
 *   3. يضعون رابطاً لموقعك = Backlink طبيعي عالي الجودة
 *
 * تحتوي على:
 *   ✅ Press Kit قابل للتحميل
 *   ✅ Boilerplate (نص جاهز للصحفيين)
 *   ✅ إحصائيات المنصة للاستشهاد بها
 *   ✅ شارة "Verified on Beit Al Reef" للمزودين
 *   ✅ JSON-LD: Organization + NewsArticle ready
 *   ✅ ربط بالدلائل الإماراتية المعروفة
 */

import { useEffect, useState } from 'react';
import { SEOHead } from './SEOHead';
import { SEOHeader, SEOFooter } from './SEONav';
import { SITE_DOMAIN, SITE_NAME_AR, SITE_NAME_EN } from '../../utils/seoConstants';
import {
  Download, Copy, Check, ExternalLink, Award, BarChart3,
  Globe, Building2, Users, ShoppingBag, Star, Share2,
  FileText, Mail, Code2, Link2, Newspaper, BadgeCheck,
} from 'lucide-react';

const font = 'Cairo, Tajawal, sans-serif';

// ── إحصائيات المنصة ──
const STATS = [
  { value: '10,000+', labelAr: 'مزود خدمة مسجّل',   labelEn: 'Registered Service Providers', icon: Users },
  { value: '47+',     labelAr: 'أداة ذكاء اصطناعي',  labelEn: 'AI Tools', icon: BarChart3 },
  { value: '7',       labelAr: 'إمارات مغطّاة',       labelEn: 'Emirates Covered', icon: Globe },
  { value: '11',      labelAr: 'قطاع خدمي متخصص',    labelEn: 'Service Sectors', icon: Building2 },
  { value: '4.8/5',   labelAr: 'تقييم المستخدمين',   labelEn: 'User Rating', icon: Star },
  { value: '2023',    labelAr: 'سنة التأسيس',         labelEn: 'Founded', icon: Award },
];

// ── المنصات والدلائل الإماراتية ──
const UAE_DIRECTORIES = [
  { name: 'Clutch.co',        url: 'https://clutch.co',          desc: 'دليل شركات التقنية العالمي' },
  { name: 'G2.com',           url: 'https://g2.com',             desc: 'دليل مراجعات البرمجيات' },
  { name: 'UAE Business',     url: 'https://uaebusiness.ae',     desc: 'دليل الأعمال الإماراتي' },
  { name: 'Dubai Chamber',    url: 'https://www.dubaichamber.com', desc: 'غرفة تجارة دبي' },
  { name: 'Bayut',            url: 'https://bayut.com',          desc: 'منصة العقارات الإماراتية' },
  { name: 'Yalla Deals',      url: 'https://yalladeals.com',     desc: 'منصة العروض الإماراتية' },
];

// ── Boilerplate للصحفيين ──
const BOILERPLATE_AR = `بيت الريف هي منصة SaaS متخصصة في قطاع البناء والتشطيب بالإمارات العربية المتحدة. تربط المنصة أصحاب المشاريع والمقاولين والحرفيين وموردي مواد البناء في منظومة رقمية متكاملة تشمل: سوق التعاقدات، متجر مواد البناء، أدوات الذكاء الاصطناعي، ولوحات التحكم الاحترافية. تأسست عام 2023 وتغطي جميع إمارات الدولة.`;

const BOILERPLATE_EN = `Beit Al Reef is a UAE-based SaaS platform specializing in the construction and finishing sector. The platform connects project owners, contractors, craftsmen, and building material suppliers in an integrated digital ecosystem including: a contracting marketplace, building materials store, AI-powered tools, and professional dashboards. Founded in 2023, it covers all seven emirates of the UAE.`;

// ── شارة HTML للمزودين ──
const BADGE_HTML = `<a href="${SITE_DOMAIN}" title="Verified on Beit Al Reef" target="_blank" rel="noopener">
  <img 
    src="${SITE_DOMAIN}/assets/badge-verified.png" 
    alt="Verified Provider on Beit Al Reef" 
    width="180" height="60"
    style="border:none;"
  />
</a>`;

function CopyableBlock({ content, label }: { content: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative bg-[#F5EEE1] rounded-xl border border-[#E6DCC8] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-[#E6DCC8]">
        <p className="text-xs font-black text-[#1F3D2B]/60" style={{ fontFamily: font }}>{label}</p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all"
          style={{
            background: copied ? 'rgba(59,91,254,0.1)' : 'rgba(212,175,55,0.1)',
            color: copied ? '#3B5BFE' : '#D4AF37',
            fontFamily: font,
          }}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'تم النسخ' : 'نسخ'}
        </button>
      </div>
      <pre className="p-4 text-xs text-[#1F3D2B]/70 leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono" dir="ltr">
        {content}
      </pre>
    </div>
  );
}

function StatCard({ stat }: { stat: typeof STATS[0] }) {
  const Icon = stat.icon;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)' }}>
        <Icon className="w-5 h-5 text-[#D4AF37]" />
      </div>
      <p className="text-2xl font-black text-[#1F3D2B] mb-1" style={{ fontFamily: font }}>{stat.value}</p>
      <p className="text-xs font-bold text-[#1F3D2B]/50" style={{ fontFamily: font }}>{stat.labelAr}</p>
      <p className="text-[10px] text-[#1F3D2B]/30 font-medium mt-0.5">{stat.labelEn}</p>
    </div>
  );
}

export function PressPage() {
  // JSON-LD: Organization + NewsMediaTarget
  useEffect(() => {
    const scripts = [
      {
        id: 'ld-press-org',
        data: {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': SITE_NAME_AR,
          'alternateName': SITE_NAME_EN,
          'url': SITE_DOMAIN,
          'logo': `${SITE_DOMAIN}/assets/logo.png`,
          'description': BOILERPLATE_EN,
          'foundingDate': '2023',
          'areaServed': {
            '@type': 'Country',
            'name': 'United Arab Emirates',
          },
          'sameAs': [
            'https://bietalreef.ae',
            'https://www.bietalreef.ae',
            'https://linkedin.com/company/beit-al-reef',
            'https://twitter.com/BeitAlReef',
            'https://clutch.co',
          ],
          'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'Press',
            'email': 'press@bietalreef.ae',
            'availableLanguage': ['Arabic', 'English'],
          },
        },
      },
      {
        id: 'ld-press-faq',
        data: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'ما هي منصة بيت الريف؟',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': BOILERPLATE_AR,
              },
            },
            {
              '@type': 'Question',
              'name': 'What is Beit Al Reef platform?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': BOILERPLATE_EN,
              },
            },
            {
              '@type': 'Question',
              'name': 'كيف يمكنني الانضمام كمزود خدمة؟',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': `يمكنك التسجيل مجاناً على ${SITE_DOMAIN} كمزود خدمة سواء كنت مقاولاً أو حرفياً أو مورداً.`,
              },
            },
          ],
        },
      },
    ];

    scripts.forEach(({ id, data }) => {
      let el = document.getElementById(id) as HTMLScriptElement | null;
      if (!el) {
        el = document.createElement('script');
        el.id = id;
        el.setAttribute('type', 'application/ld+json');
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(data, null, 2);
    });

    return () => {
      scripts.forEach(({ id }) => document.getElementById(id)?.remove());
    };
  }, []);

  return (
    <>
      <SEOHead
        title="الصحافة والإعلام — Press Kit"
        description="كل ما يحتاجه الصحفيون والمدونون عن منصة بيت الريف: إحصائيات، نصوص جاهزة، شعارات، وأرقام بيانات للاستشهاد. UAE construction platform press kit."
        canonicalPath="/press"
        keywords={[
          'press kit بيت الريف', 'بيت الريف للصحافة', 'Beit Al Reef press',
          'UAE construction startup', 'منصة بناء إمارات صحافة', 'UAE proptech press',
          'building platform UAE media', 'بيت الريف أخبار',
        ]}
        ogType="article"
        breadcrumbs={[{ name: 'الصحافة والإعلام', url: '/press' }]}
      />

      <SEOHeader />

      <main dir="rtl" style={{ background: '#F5EEE1', minHeight: '100vh', fontFamily: font }}>

        {/* ── Hero ── */}
        <div
          className="relative overflow-hidden py-20"
          style={{ background: 'linear-gradient(135deg, #0f2419 0%, #1F3D2B 50%, #0a1a3e 100%)' }}
        >
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 30% 60%, rgba(212,175,55,0.12), transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(59,91,254,0.12), transparent 55%)' }} />
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-bold"
              style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
              <Newspaper className="w-3.5 h-3.5" />
              Press &amp; Media
            </div>
            <h1 className="text-4xl font-black text-white mb-4 leading-snug" style={{ fontFamily: font }}>
              بيت الريف في الصحافة
            </h1>
            <p className="text-white/50 text-base max-w-2xl mx-auto leading-[2]" style={{ fontFamily: font }}>
              كل ما تحتاجه لكتابة مقال، تقرير، أو منشور عن منصة بيت الريف.
              نصوص جاهزة، إحصائيات، شعارات وملف صحفي كامل.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <a
                href="mailto:press@bietalreef.ae"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37' }}
              >
                <Mail className="w-4 h-4" />
                press@bietalreef.ae
              </a>
              <a
                href={`${SITE_DOMAIN}/sitemap`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white/60"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Globe className="w-4 h-4" />
                خريطة الموقع
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

          {/* ── إحصائيات المنصة ── */}
          <section>
            <h2 className="text-xl font-black text-[#1F3D2B] mb-6 flex items-center gap-3" style={{ fontFamily: font }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)' }}>
                <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
              </div>
              أرقام ومعلومات للاستشهاد
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {STATS.map((s, i) => <StatCard key={i} stat={s} />)}
            </div>
          </section>

          {/* ── Boilerplate ── */}
          <section>
            <h2 className="text-xl font-black text-[#1F3D2B] mb-6 flex items-center gap-3" style={{ fontFamily: font }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,91,254,0.1)' }}>
                <FileText className="w-4 h-4 text-[#3B5BFE]" />
              </div>
              نص تعريفي جاهز (Boilerplate)
            </h2>
            <p className="text-sm text-[#1F3D2B]/50 mb-4 leading-relaxed" style={{ fontFamily: font }}>
              انسخ النص أدناه مباشرةً في مقالك أو تقريرك. يُنصح بإضافة رابط لـ
              <a href={SITE_DOMAIN} className="text-[#D4AF37] font-bold mx-1">{SITE_DOMAIN}</a>
              عند الاستخدام.
            </p>
            <div className="space-y-4">
              <CopyableBlock content={BOILERPLATE_AR} label="العربية" />
              <CopyableBlock content={BOILERPLATE_EN} label="English" />
            </div>
          </section>

          {/* ── شارة المزود الموثّق ── */}
          <section>
            <h2 className="text-xl font-black text-[#1F3D2B] mb-2 flex items-center gap-3" style={{ fontFamily: font }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)' }}>
                <BadgeCheck className="w-4 h-4 text-[#D4AF37]" />
              </div>
              شارة "مزود موثّق" للمواقع الخارجية
            </h2>
            <p className="text-sm text-[#1F3D2B]/50 mb-5 leading-relaxed" style={{ fontFamily: font }}>
              هل أنت مزود خدمة على بيت الريف؟ ضع هذه الشارة على موقعك لتُظهر للعملاء أنك موثّق.
              الشارة تحتوي تلقائياً على رابط لموقعنا.
            </p>

            {/* معاينة الشارة */}
            <div className="bg-white rounded-2xl border border-[#D4AF37]/20 p-6 mb-4 text-center">
              <div
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl shadow-md"
                style={{ background: 'linear-gradient(135deg, #1F3D2B, #2d5a3f)', border: '1px solid rgba(212,175,55,0.3)' }}
              >
                <BadgeCheck className="w-5 h-5 text-[#D4AF37]" />
                <div className="text-right">
                  <p className="text-[10px] text-white/50 font-bold" style={{ fontFamily: font }}>مزود موثّق على</p>
                  <p className="text-sm font-black text-white" style={{ fontFamily: font }}>بيت الريف</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <span className="text-[10px] font-mono text-white/30">{SITE_DOMAIN}</span>
              </div>
              <p className="text-xs text-[#1F3D2B]/30 mt-3 font-bold" style={{ fontFamily: font }}>معاينة</p>
            </div>

            <CopyableBlock content={BADGE_HTML} label="كود HTML للشارة — ضعه في موقعك" />

            <div className="mt-3 p-3 rounded-xl text-xs font-bold text-[#3B5BFE]/80 leading-relaxed"
              style={{ background: 'rgba(59,91,254,0.05)', border: '1px solid rgba(59,91,254,0.1)', fontFamily: font }}>
              كل موقع يضع الشارة يُنشئ رابطاً خلفياً طبيعياً لمنصتنا — يزيد من قوة الـ Domain Authority
            </div>
          </section>

          {/* ── روابط الدلائل الإماراتية ── */}
          <section>
            <h2 className="text-xl font-black text-[#1F3D2B] mb-2 flex items-center gap-3" style={{ fontFamily: font }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,91,254,0.1)' }}>
                <Link2 className="w-4 h-4 text-[#3B5BFE]" />
              </div>
              دلائل الأعمال — تسجيل الموقع
            </h2>
            <p className="text-sm text-[#1F3D2B]/50 mb-5 leading-relaxed" style={{ fontFamily: font }}>
              الروابط الخلفية من الدلائل المعتمدة ترفع تقييم الموقع في محركات البحث.
              سجّل بيت الريف في هذه المواقع للحصول على روابط خلفية قوية ومجانية.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {UAE_DIRECTORIES.map((d) => (
                <a
                  key={d.url}
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-sm transition-all group"
                >
                  <div>
                    <p className="text-sm font-black text-[#1F3D2B] group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: font }}>
                      {d.name}
                    </p>
                    <p className="text-xs text-[#1F3D2B]/40 font-bold mt-0.5" style={{ fontFamily: font }}>{d.desc}</p>
                    <p className="text-[10px] font-mono text-[#3B5BFE]/40 mt-1">{d.url}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          </section>

          {/* ── تضمين عداد الأعمال ── */}
          <section>
            <h2 className="text-xl font-black text-[#1F3D2B] mb-2 flex items-center gap-3" style={{ fontFamily: font }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)' }}>
                <Code2 className="w-4 h-4 text-[#D4AF37]" />
              </div>
              ويدجت مضمّن (Embeddable Widget)
            </h2>
            <p className="text-sm text-[#1F3D2B]/50 mb-5 leading-relaxed" style={{ fontFamily: font }}>
              ضع هذا الكود في مدونتك أو موقعك لعرض أحدث إحصائيات المنصة — مع رابط تلقائي لبيت الريف.
            </p>
            <CopyableBlock
              label="كود iFrame — يعمل على أي موقع"
              content={`<iframe
  src="${SITE_DOMAIN}/press"
  title="بيت الريف — منصة البناء في الإمارات"
  width="600" height="400"
  frameborder="0"
  style="border:1px solid #e5e7eb; border-radius:16px;"
></iframe>
<!-- رابط خلفي طبيعي: ${SITE_DOMAIN} -->`}
            />
          </section>

          {/* ── روابط داخلية (Internal Linking Hub) ── */}
          <section>
            <h2 className="text-xl font-black text-[#1F3D2B] mb-5 flex items-center gap-3" style={{ fontFamily: font }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,91,254,0.1)' }}>
                <Share2 className="w-4 h-4 text-[#3B5BFE]" />
              </div>
              صفحات المنصة — للربط الداخلي
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: '/',                   label: 'الصفحة الرئيسية',     desc: 'منصة البناء الذكية في الإمارات' },
                { href: '/contractors-in-uae', label: 'شركات المقاولات',     desc: 'أفضل مقاولي البناء في الإمارات' },
                { href: '/interior-design-uae', label: 'التصميم الداخلي',   desc: 'مصممون داخليون معتمدون' },
                { href: '/villa-renovation-uae', label: 'ترميم الفلل',       desc: 'شركات ترميم وتجديد الفلل' },
                { href: '/building-materials-uae', label: 'مواد البناء',     desc: 'موردو مواد البناء في الإمارات' },
                { href: '/map/dubai',           label: 'خريطة دبي',          desc: 'خريطة مزودي الخدمات في دبي' },
                { href: '/map/abu-dhabi',       label: 'خريطة أبوظبي',       desc: 'خريطة مزودي الخدمات في أبوظبي' },
                { href: '/seo/platform',        label: 'نظرة عامة على المنصة', desc: 'كل ميزات بيت الريف' },
                { href: '/sitemap',             label: 'خريطة الموقع',        desc: 'جميع صفحات بيت الريف' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={`${SITE_DOMAIN}${link.href}`}
                  className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-sm transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.08)' }}>
                    <Globe className="w-3.5 h-3.5 text-[#D4AF37]/60" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-[#1F3D2B] group-hover:text-[#D4AF37] transition-colors truncate" style={{ fontFamily: font }}>
                      {link.label}
                    </p>
                    <p className="text-[11px] text-[#1F3D2B]/40 font-mono truncate">{SITE_DOMAIN}{link.href}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

        </div>
      </main>

      <SEOFooter />
    </>
  );
}
