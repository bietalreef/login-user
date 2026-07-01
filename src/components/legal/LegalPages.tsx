/**
 * LegalPages.tsx — Standalone Privacy & Terms pages
 * ═══════════════════════════════════════════════════
 * Public pages accessible WITHOUT authentication.
 * Required for Google OAuth consent screen verification.
 * 
 * URLs:
 *   https://app.bietalreef.ae/privacy
 *   https://app.bietalreef.ae/terms
 */

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router@7.1.1';
import { ArrowLeft, Scale, Lock, Globe } from 'lucide-react';
import { TermsContent, PrivacyContent } from '../LegalModals';
const logoImg = "/assets/logo.png";

export function PrivacyPage() {
  return <LegalPage type="privacy" />;
}

export function TermsPage() {
  return <LegalPage type="terms" />;
}

function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isEn = lang === 'en';
  const isTerms = type === 'terms';

  // SEO: Set page title & meta
  useEffect(() => {
    const title = isTerms
      ? (isEn ? 'Terms & Conditions — Beit Al Reef' : 'الشروط والأحكام — بيت الر��ف')
      : (isEn ? 'Privacy Policy — Beit Al Reef' : 'سياسة الخصوصية — بيت الريف');
    document.title = title;

    // Meta description
    const desc = isTerms
      ? (isEn
          ? 'Terms and Conditions for Beit Al Reef platform — UAE construction and finishing SaaS workspace.'
          : 'الشروط والأحكام لمنصة بيت الريف — منصة البناء والتشطيب الإماراتية.')
      : (isEn
          ? 'Privacy Policy for Beit Al Reef platform — How we collect, use, and protect your data.'
          : 'سياسة الخصوصية لمنصة بيت الريف — كيف نجمع ونستخدم ونحمي بياناتك.');

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://app.bietalreef.ae/${type}`);

    return () => {
      document.title = 'بيت الريف — Beit Al Reef';
    };
  }, [type, isEn, isTerms]);

  const gradientFrom = isTerms ? 'from-green-500' : 'from-blue-500';
  const gradientTo = isTerms ? 'to-emerald-600' : 'to-indigo-600';
  const Icon = isTerms ? Scale : Lock;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] via-[#F8F3EB] to-white" dir="rtl">
      {/* Header */}
      <header className={`sticky top-0 z-50 bg-gradient-to-l ${gradientFrom} ${gradientTo} shadow-lg`}>
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {isTerms
                  ? (isEn ? 'Terms & Conditions' : 'الشروط والأحكام')
                  : (isEn ? 'Privacy Policy' : 'سياسة الخصوصية')
                }
              </h1>
              <p className="text-white/70 text-[11px]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {isEn ? 'Beit Al Reef Platform — app.bietalreef.ae' : 'منصة بيت الريف — app.bietalreef.ae'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white text-xs font-bold transition-colors"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-amber-200/40 sticky top-[72px] z-40">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="بيت الريف" className="w-8 h-8 object-contain" />
            <div className="flex items-center gap-2">
              <a
                href="/privacy"
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  type === 'privacy'
                    ? 'bg-blue-500/10 text-blue-600 border border-blue-200'
                    : 'text-gray-500 hover:text-blue-600'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                {isEn ? 'Privacy' : 'الخصوصية'}
              </a>
              <a
                href="/terms"
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  type === 'terms'
                    ? 'bg-green-500/10 text-green-600 border border-green-200'
                    : 'text-gray-500 hover:text-green-600'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                {isEn ? 'Terms' : 'الشروط'}
              </a>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-xs font-bold transition-colors"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            <span>{isEn ? 'Back to app' : 'العودة للتطبيق'}</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        {isTerms ? <TermsContent isEn={isEn} /> : <PrivacyContent isEn={isEn} />}
      </main>

      {/* Footer */}
      <footer className="bg-[#0B1120] text-white/60 py-8">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <img src={logoImg} alt="بيت الريف" className="w-12 h-12 object-contain mx-auto mb-3 opacity-60" />
          <p className="text-xs mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn
              ? 'Beit Al Reef Technology LLC — Dubai, UAE'
              : 'شركة بيت الريف للتقنية ذ.م.م — دبي، الإمارات'}
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px]">
            <a href="/privacy" className="hover:text-white transition-colors">
              {isEn ? 'Privacy Policy' : 'سياسة الخصوصية'}
            </a>
            <span className="text-white/30">|</span>
            <a href="/terms" className="hover:text-white transition-colors">
              {isEn ? 'Terms & Conditions' : 'الشروط والأحكام'}
            </a>
            <span className="text-white/30">|</span>
            <a href="/" className="hover:text-white transition-colors">
              {isEn ? 'Home' : 'الرئيسية'}
            </a>
          </div>
          <p className="text-[10px] mt-4 text-white/30" style={{ fontFamily: 'Cairo, sans-serif' }}>
            &copy; 2026 Beit Al Reef. {isEn ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}
          </p>
        </div>
      </footer>
    </div>
  );
}