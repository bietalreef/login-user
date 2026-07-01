/**
 * GSCGuide.tsx — دليل Google Search Console التفاعلي
 * ══════════════════════════════════════════════════
 * صفحة داخلية تشرح بدقة ما يراه Google وما لا يراه
 * + الخطوات الفعلية في Google Search Console
 */

import { useState } from 'react';
import {
  CheckCircle2, XCircle, AlertTriangle, Globe, FileSearch,
  ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Copy, Check,
  Clock, Zap, Search, RefreshCw, Eye, EyeOff,
} from 'lucide-react';

const font = 'Cairo, Tajawal, sans-serif';

interface StepProps {
  number: number;
  title: string;
  detail: string;
  url?: string;
  urlLabel?: string;
  code?: string;
  warn?: string;
}

function Step({ number, title, detail, url, urlLabel, code, warn }: StepProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (code) navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  return (
    <div className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white" style={{ background: 'linear-gradient(135deg, #D4AF37, #C8A86A)' }}>
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-[#1F3D2B] text-sm mb-1" style={{ fontFamily: font }}>{title}</p>
        <p className="text-xs text-[#1F3D2B]/60 leading-relaxed mb-2" style={{ fontFamily: font }}>{detail}</p>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B5BFE] hover:underline">
            <ExternalLink className="w-3 h-3" />
            {urlLabel || url}
          </a>
        )}
        {code && (
          <div className="mt-2 bg-[#F5EEE1] rounded-lg p-3 flex items-center justify-between gap-2">
            <code className="text-xs font-mono text-[#1F3D2B]/80 break-all">{code}</code>
            <button onClick={handleCopy} className="flex-shrink-0 text-xs font-bold text-[#D4AF37] flex items-center gap-1">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        )}
        {warn && (
          <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg text-xs font-bold text-amber-700"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500" />
            <span style={{ fontFamily: font }}>{warn}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusRow({ icon, label, status, detail }: { icon: React.ReactNode; label: string; status: 'ok' | 'warn' | 'no'; detail: string }) {
  const colors = {
    ok:   { bg: 'rgba(59,91,254,0.06)', border: 'rgba(59,91,254,0.15)', icon: 'text-[#3B5BFE]' },
    warn: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)',  icon: 'text-amber-500' },
    no:   { bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.15)', icon: 'text-red-500' },
  }[status];

  const StatusIcon = status === 'ok' ? CheckCircle2 : status === 'warn' ? AlertTriangle : XCircle;

  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
      <div className={colors.icon}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-black text-[#1F3D2B]" style={{ fontFamily: font }}>{label}</p>
          <StatusIcon className={`w-3.5 h-3.5 ${colors.icon}`} />
        </div>
        <p className="text-xs text-[#1F3D2B]/50 mt-0.5" style={{ fontFamily: font }}>{detail}</p>
      </div>
    </div>
  );
}

export function GSCGuide({ onClose }: { onClose?: () => void }) {
  const [openSection, setOpenSection] = useState<string | null>('what-google-sees');

  const toggle = (id: string) => setOpenSection(p => p === id ? null : id);

  return (
    <div dir="rtl" style={{ background: '#F5EEE1', minHeight: '100vh', fontFamily: font }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1F3D2B, #0a1a3e)' }} className="px-5 pt-12 pb-8">
        {onClose && (
          <button onClick={onClose} className="flex items-center gap-2 text-white/50 text-xs font-bold mb-6 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </button>
        )}
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-bold"
            style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
            <Search className="w-3.5 h-3.5" />
            Google Search Console
          </div>
          <h1 className="text-2xl font-black text-white mb-2" style={{ fontFamily: font }}>
            هل Google تقرأ صفحاتك؟
          </h1>
          <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: font }}>
            إجابة واضحة + خطوات Google Search Console الفعلية
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* ── الجواب المباشر ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50" style={{ background: 'rgba(59,91,254,0.03)' }}>
            <p className="font-black text-[#1F3D2B]" style={{ fontFamily: font }}>الإجابة المباشرة</p>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(59,91,254,0.06)', border: '1px solid rgba(59,91,254,0.15)' }}>
              <CheckCircle2 className="w-5 h-5 text-[#3B5BFE] flex-shrink-0" />
              <div>
                <p className="font-black text-[#1F3D2B] text-sm" style={{ fontFamily: font }}>نعم — Google ستقرأ الصفحات</p>
                <p className="text-xs text-[#1F3D2B]/50 mt-0.5" style={{ fontFamily: font }}>
                  لكن الأمر يختلف عن موقع SSR — اقرأ التفاصيل أدناه
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <p className="font-black text-[#1F3D2B] text-sm" style={{ fontFamily: font }}>لكنه يحتاج وقتاً أطول</p>
                <p className="text-xs text-[#1F3D2B]/50 mt-0.5" style={{ fontFamily: font }}>
                  CSR (React) = Google تنفّذ JavaScript في "موجة ثانية" — قد تستغرق أيام لا ساعات
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── ماذا يرى Google ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => toggle('what-google-sees')}
            className="w-full flex items-center justify-between px-5 py-4 text-right"
          >
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-[#D4AF37]" />
              <p className="font-black text-[#1F3D2B] text-sm" style={{ fontFamily: font }}>ماذا يرى Google فعلاً؟</p>
            </div>
            {openSection === 'what-google-sees' ? <ChevronUp className="w-4 h-4 text-[#1F3D2B]/40" /> : <ChevronDown className="w-4 h-4 text-[#1F3D2B]/40" />}
          </button>
          {openSection === 'what-google-sees' && (
            <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-4">
              <StatusRow
                icon={<Globe className="w-4 h-4" />}
                label="sitemap.xml"
                status="ok"
                detail="موجود على app.bietalreef.ae/sitemap.xml — يحتوي فقط الصفحات العامة"
              />
              <StatusRow
                icon={<FileSearch className="w-4 h-4" />}
                label="robots.txt"
                status="ok"
                detail="موجود على app.bietalreef.ae/robots.txt — يوجّه Google بدقة"
              />
              <StatusRow
                icon={<Eye className="w-4 h-4" />}
                label="الصفحات العامة (SEO Public)"
                status="ok"
                detail="index, follow — Google تفهرسها بعد تشغيل JavaScript"
              />
              <StatusRow
                icon={<EyeOff className="w-4 h-4" />}
                label="صفحات التطبيق الداخلي"
                status="ok"
                detail="noindex, nofollow — Google تتجاهلها تماماً"
              />
              <StatusRow
                icon={<Zap className="w-4 h-4" />}
                label="الـ Meta Tags والـ JSON-LD"
                status="warn"
                detail="تُحقن بعد JavaScript — Google تقرأها في الموجة الثانية (أبطأ)"
              />
              <StatusRow
                icon={<RefreshCw className="w-4 h-4" />}
                label="الـ SSR (Server-Side Rendering)"
                status="warn"
                detail="غير مفعّل — الـ HTML الأولي فارغ. للفهرسة الفورية تحتاج SSR مستقبلاً"
              />
            </div>
          )}
        </div>

        {/* ── خطوات GSC ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => toggle('gsc-steps')}
            className="w-full flex items-center justify-between px-5 py-4 text-right"
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-[#3B5BFE]" />
              <p className="font-black text-[#1F3D2B] text-sm" style={{ fontFamily: font }}>خطوات Google Search Console (بالترتيب)</p>
            </div>
            {openSection === 'gsc-steps' ? <ChevronUp className="w-4 h-4 text-[#1F3D2B]/40" /> : <ChevronDown className="w-4 h-4 text-[#1F3D2B]/40" />}
          </button>
          {openSection === 'gsc-steps' && (
            <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-3">
              <Step
                number={1}
                title="افتح Google Search Console"
                detail="اذهب لـ search.google.com/search-console وسجّل الدخول بـ Google Account خاص بك"
                url="https://search.google.com/search-console"
                urlLabel="افتح Google Search Console"
              />
              <Step
                number={2}
                title="أضف Property جديدة"
                detail='اختر "Add Property" ثم اختر "URL prefix" وأدخل العنوان التالي'
                code="https://app.bietalreef.ae"
              />
              <Step
                number={3}
                title="تحقق من الملكية (Domain Verification)"
                detail='اختر طريقة HTML file — سيعطيك Google ملف HTML تضعه في /public. ملف التحقق موجود بالفعل:'
                code="https://app.bietalreef.ae/google72137e288e2b5848.html"
                warn="تأكد أن الملف يظهر عند فتح الرابط قبل الضغط على Verify"
              />
              <Step
                number={4}
                title='أرسل الـ Sitemap'
                detail='في القائمة الجانبية اضغط "Sitemaps" ثم أدخل الرابط التالي واضغط Submit'
                code="https://app.bietalreef.ae/sitemap.xml"
              />
              <Step
                number={5}
                title="افحص الصفحات المهمة (URL Inspection)"
                detail='في القائمة اضغط "URL Inspection" وأدخل رابط كل صفحة لتفحصها. ابدأ بهذه الصفحة:'
                code="https://app.bietalreef.ae/contractors-in-uae"
              />
              <Step
                number={6}
                title='اطلب الفهرسة يدوياً'
                detail='بعد فحص كل صفحة اضغط "Request Indexing" — هذا يعجّل الفهرسة بدلاً من الانتظار'
                warn="افعل هذا لأهم 10 صفحات فقط — Google تُحدّد عدد الطلبات اليومية"
              />
              <Step
                number={7}
                title="راقب Coverage Report"
                detail='في "Pages" ستجد الصفحات المفهرسة والمستبعدة. تحقق أن صفحات noindex (التطبيق) في قسم Excluded وليس Indexed'
                url="https://search.google.com/search-console/index"
                urlLabel="افتح Coverage Report"
              />
            </div>
          )}
        </div>

        {/* ── اختبر robots.txt ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => toggle('test-urls')}
            className="w-full flex items-center justify-between px-5 py-4 text-right"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <p className="font-black text-[#1F3D2B] text-sm" style={{ fontFamily: font }}>اختبر هذه الروابط الآن</p>
            </div>
            {openSection === 'test-urls' ? <ChevronUp className="w-4 h-4 text-[#1F3D2B]/40" /> : <ChevronDown className="w-4 h-4 text-[#1F3D2B]/40" />}
          </button>
          {openSection === 'test-urls' && (
            <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-2">
              {[
                { url: 'https://app.bietalreef.ae/robots.txt',       label: 'robots.txt',         status: 'يجب أن يفتح كنص عادي' },
                { url: 'https://app.bietalreef.ae/sitemap.xml',      label: 'sitemap.xml',        status: 'يجب أن يفتح كـ XML' },
                { url: 'https://app.bietalreef.ae/google72137e288e2b5848.html', label: 'ملف التحقق', status: 'يجب أن يظهر محتوى Google' },
                { url: 'https://app.bietalreef.ae/contractors-in-uae', label: 'صفحة خدمة (Public)', status: 'يجب أن يظهر المحتوى' },
                { url: 'https://app.bietalreef.ae/sitemap',           label: 'خريطة الموقع البصرية', status: 'يجب أن تظهر الصفحة' },
                { url: 'https://app.bietalreef.ae/press',             label: 'صفحة الصحافة',       status: 'يجب أن تظهر الصفحة' },
              ].map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F5EEE1] transition-colors group"
                >
                  <div>
                    <p className="text-sm font-black text-[#1F3D2B] group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: font }}>
                      {item.label}
                    </p>
                    <p className="text-[11px] text-[#3B5BFE]/60 font-mono">{item.url}</p>
                    <p className="text-[11px] text-[#1F3D2B]/30 mt-0.5" style={{ fontFamily: font }}>{item.status}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ── توقعات الوقت ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-[#1F3D2B] mb-4 flex items-center gap-2" style={{ fontFamily: font }}>
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            توقعات الوقت
          </p>
          <div className="space-y-3">
            {[
              { label: 'robots.txt + sitemap تُقرأ', time: 'فوري بعد التسجيل', color: '#3B5BFE' },
              { label: 'الصفحات تظهر في GSC', time: '1 – 3 أيام', color: '#D4AF37' },
              { label: 'الفهرسة الكاملة', time: '1 – 4 أسابيع', color: '#D4AF37' },
              { label: 'الظهور في نتائج البحث', time: '2 – 8 أسابيع', color: '#EF4444' },
              { label: 'مع SSR (إن أضفته لاحقاً)', time: '24 – 72 ساعة فقط', color: '#3B5BFE' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>{item.label}</p>
                <span className="text-xs font-black px-3 py-1 rounded-full" style={{ background: `${item.color}15`, color: item.color }}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
