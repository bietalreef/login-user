/**
 * PlatformRoadmap.tsx — مسار رحلة المستخدم في بيت الريف
 * ═══════════════════════════════════════════════════════
 * إنفوجرافيك تفاعلي بمسار متعرج يوضح مراحل استخدام المنصة
 * مستوحى من تصميم Houzz Pro — بلمسة بيت الريف الذهبية
 * بدون لون أخضر — بدون إيموجي — كل الأيقونات Icon3D
 */

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Search, FileText, MessageCircle, Star,
  ChevronDown, Sparkles, Shield, Zap,
  Users, Send, CheckCircle, Clock, Award,
  ArrowDown, Building2, Wrench, Wallet, Cpu,
  Eye, Filter, Heart, ThumbsUp,
  Phone, Video, CalendarCheck, Receipt,
  ShieldCheck, Lock, Headphones, TrendingUp,
} from 'lucide-react';
// Bot, Crown, BadgeCheck not available — using safe aliases
const Bot = Cpu;
const Crown = Award;
const BadgeCheck = ShieldCheck;
import { Icon3D } from '../ui/Icon3D';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTheme } from '../../contexts/ThemeContext';

const font = 'Cairo, sans-serif';

// ─────────────────────────────────────────
// Stage Data
// ─────────────────────────────────────────
interface StageFeature {
  icon: any;
  iconTheme: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
}

interface Stage {
  number: number;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  mainIcon: any;
  mainIconTheme: string;
  features: StageFeature[];
  imageUrl: string;
}

const STAGES: Stage[] = [
  {
    number: 1,
    titleAr: 'استكشاف الخدمات والمزودين',
    titleEn: 'Explore Services & Providers',
    subtitleAr: 'المرحلة الأولى',
    subtitleEn: 'Stage One',
    color: '#3B5BFE',
    gradientFrom: '#3B5BFE',
    gradientTo: '#5B7AFF',
    mainIcon: Search,
    mainIconTheme: 'blue',
    features: [
      {
        icon: Eye,
        iconTheme: 'blue',
        titleAr: 'تصفح حر بلا حواجز',
        titleEn: 'Free Browsing Without Barriers',
        descAr: 'استكشف جميع الخدمات والمزودين والمتاجر والعروض بحرية كاملة بدون تسجيل أو حساب.',
        descEn: 'Explore all services, providers, stores and offers freely without registration.',
      },
      {
        icon: Filter,
        iconTheme: 'indigo',
        titleAr: 'فلترة ذكية بالموقع والتقييم',
        titleEn: 'Smart Filtering by Location & Rating',
        descAr: 'فلتر حسب الإمارة، المدينة، التقييم، السعر، ونوع الخدمة للوصول لأفضل النتائج.',
        descEn: 'Filter by emirate, city, rating, price, and service type for the best results.',
      },
      {
        icon: Bot,
        iconTheme: 'purple',
        titleAr: 'مساعد وياك بالذكاء الاصطناعي',
        titleEn: 'Weyaak AI Assistant',
        descAr: 'اسأل وياك عن أي استفسار — يقترح لك المزودين المناسبين ويحسب التكاليف تلقائياً.',
        descEn: 'Ask Weyaak anything — it suggests suitable providers and calculates costs automatically.',
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1758411898021-ef0dadaaa295?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtb2JpbGUlMjBhcHAlMjBkYXNoYm9hcmQlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzcwNzExNTcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    number: 2,
    titleAr: 'طلب عرض سعر والمقارنة',
    titleEn: 'Request Quote & Compare',
    subtitleAr: 'المرحلة الثانية',
    subtitleEn: 'Stage Two',
    color: '#D4AF37',
    gradientFrom: '#D4AF37',
    gradientTo: '#FFD700',
    mainIcon: FileText,
    mainIconTheme: 'gold',
    features: [
      {
        icon: Send,
        iconTheme: 'gold',
        titleAr: 'طلب عرض سعر فوري (RFQ)',
        titleEn: 'Instant Quote Request (RFQ)',
        descAr: 'أرسل طلب عرض سعر لعدة مزودين بضغطة واحدة واحصل على ردود خلال 24 ساعة.',
        descEn: 'Send a quote request to multiple providers with one click and get responses within 24 hours.',
      },
      {
        icon: Award,
        iconTheme: 'amber',
        titleAr: 'مقارنة شفافة بين العروض',
        titleEn: 'Transparent Offer Comparison',
        descAr: 'قارن بين العروض المقدمة من حيث السعر، المدة الزمنية، التقييمات، والضمانات.',
        descEn: 'Compare offers by price, timeline, ratings, and guarantees.',
      },
      {
        icon: Sparkles,
        iconTheme: 'orange',
        titleAr: 'تحليل ذكي للعروض بالـ AI',
        titleEn: 'AI Smart Offer Analysis',
        descAr: 'يحلل الذكاء الاصطناعي العروض المقدمة ويقدم توصية بأفضل عرض يناسب ميزانيتك.',
        descEn: 'AI analyzes submitted offers and recommends the best one for your budget.',
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1758876734777-dcc6981f3671?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250cmFjdG9yJTIwY3JhZnRzbWFuJTIwd29ya2luZyUyMGNvbnN0cnVjdGlvbiUyMFVBRXxlbnwxfHx8fDE3NzA4MjI3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    number: 3,
    titleAr: 'التواصل والتنفيذ',
    titleEn: 'Communication & Execution',
    subtitleAr: 'المرحلة الثالثة',
    subtitleEn: 'Stage Three',
    color: '#3B5BFE',
    gradientFrom: '#3B5BFE',
    gradientTo: '#6B8AFF',
    mainIcon: MessageCircle,
    mainIconTheme: 'blue',
    features: [
      {
        icon: Phone,
        iconTheme: 'blue',
        titleAr: 'قنوات تواصل متعددة وآمنة',
        titleEn: 'Multiple Secure Communication Channels',
        descAr: 'تواصل مع المزود عبر الرسائل المباشرة، المكالمات الصوتية، أو الفيديو — كل شيء مشفّر.',
        descEn: 'Communicate with providers via direct messages, voice calls, or video — all encrypted.',
      },
      {
        icon: CalendarCheck,
        iconTheme: 'indigo',
        titleAr: 'جدولة وتتبع مراحل المشروع',
        titleEn: 'Schedule & Track Project Phases',
        descAr: 'تابع تقدم مشروعك لحظة بلحظة مع تحديثات مباشرة وصور من الموقع.',
        descEn: 'Track your project progress in real-time with live updates and site photos.',
      },
      {
        icon: Wallet,
        iconTheme: 'gold',
        titleAr: 'دفع آمن عبر محفظة الدار',
        titleEn: 'Secure Payment via Dar Wallet',
        descAr: 'ادفع بأمان عبر محفظة الدار الرقمية — مبالغ الضمان محمية حتى اكتمال العمل.',
        descEn: 'Pay securely through Dar digital wallet — escrow amounts protected until work completion.',
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhhbmRzaGFrZSUyMGFncmVlbWVudCUyMGRlYWx8ZW58MXx8fHwxNzcwODIyNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    number: 4,
    titleAr: 'التقييم والضمان',
    titleEn: 'Rating & Guarantee',
    subtitleAr: 'المرحلة الرابعة',
    subtitleEn: 'Stage Four',
    color: '#D4AF37',
    gradientFrom: '#D4AF37',
    gradientTo: '#C8A86A',
    mainIcon: Star,
    mainIconTheme: 'gold',
    features: [
      {
        icon: ThumbsUp,
        iconTheme: 'gold',
        titleAr: 'تقييم شفاف ثنائي الاتجاه',
        titleEn: 'Transparent Two-Way Rating',
        descAr: 'قيّم المزود بعد إتمام العمل وشارك تجربتك — يساهم في بناء مجتمع موثوق.',
        descEn: 'Rate the provider after work completion and share your experience — building a trusted community.',
      },
      {
        icon: Shield,
        iconTheme: 'blue',
        titleAr: 'ضمان بيت الريف للجودة',
        titleEn: 'Bait Al Reef Quality Guarantee',
        descAr: 'ضمان على جميع الأعمال المنفذة عبر المنصة — حماية كاملة لحقوقك كعميل.',
        descEn: 'Guarantee on all work executed through the platform — complete protection of your rights.',
      },
      {
        icon: Headphones,
        iconTheme: 'purple',
        titleAr: 'دعم فني مستمر 24/7',
        titleEn: '24/7 Continuous Technical Support',
        descAr: 'فريق دعم بيت الريف متواجد على مدار الساعة لمساعدتك في أي مشكلة أو استفسار.',
        descEn: 'Bait Al Reef support team available 24/7 to help with any issue or inquiry.',
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1633613286991-611fe299c4be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXZlJTIwc3RhciUyMHJhdGluZyUyMHJldmlldyUyMGN1c3RvbWVyJTIwc2F0aXNmYWN0aW9ufGVufDF8fHx8MTc3MDgyMjcyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];


// ═════════════════════════════════════════
// Main Component
// ═════════════════════════════════════════
export function PlatformRoadmap({ isEn = false }: { isEn?: boolean }) {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="w-full py-10 px-4"
      dir={isEn ? 'ltr' : 'rtl'}
      style={{ fontFamily: font }}
    >
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-l from-[#D4AF37]/10 to-[#3B5BFE]/10 border border-[#D4AF37]/20 mb-4">
          <Icon3D icon={TrendingUp} theme="gold" size="xs" hoverable={false} />
          <span className={`text-xs font-bold ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
            {isEn ? 'Your Journey with Bait Al Reef' : 'رحلتك مع بيت الريف'}
          </span>
        </div>

        <h2 className={`text-2xl sm:text-3xl font-black mb-3 ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
          {isEn ? 'How Does the Platform Work?' : 'كيف تعمل المنصة؟'}
        </h2>
        <p className={`text-sm max-w-lg mx-auto leading-relaxed ${isDark ? 'text-white/50' : 'text-[#1F3D2B]/50'}`}>
          {isEn 
            ? 'From exploration to guarantee — 4 simple stages to get the best construction & maintenance services in UAE'
            : 'من الاستكشاف إلى الضمان — 4 مراحل بسيطة للحصول على أفضل خدمات البناء والصيانة في الإمارات'
          }
        </p>
      </motion.div>

      {/* ─── Roadmap Stages ─── */}
      <div className="max-w-xl mx-auto relative">
        {/* Vertical connecting line */}
        <div
          className={`absolute top-0 bottom-0 w-1 rounded-full ${
            isEn ? 'left-6' : 'right-6'
          } ${isDark ? 'bg-white/8' : 'bg-[#1F3D2B]/8'}`}
          style={{ zIndex: 0 }}
        />

        {STAGES.map((stage, idx) => (
          <StageCard
            key={stage.number}
            stage={stage}
            isEn={isEn}
            isDark={isDark}
            isLast={idx === STAGES.length - 1}
            index={idx}
          />
        ))}
      </div>

      {/* ─── Bottom CTA ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-10"
      >
        <div className={`inline-flex flex-col items-center gap-3 px-8 py-6 rounded-3xl border-[3px] ${
          isDark 
            ? 'bg-[var(--bait-glass)] border-[var(--bait-border)]' 
            : 'bg-white border-gray-200/60'
        }`}>
          <div className="flex items-center gap-2">
            <Icon3D icon={Crown} theme="gold" size="sm" />
            <span className={`text-lg font-black ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
              {isEn ? 'Start Your Journey Now!' : 'ابدأ رحلتك الآن!'}
            </span>
          </div>
          <p className={`text-xs max-w-sm ${isDark ? 'text-white/40' : 'text-[#1F3D2B]/40'}`}>
            {isEn 
              ? 'No commission • No hidden fees • No extra charges — just subscribe and appear professionally'
              : 'لا عمولة • لا مبالغ مخفية • لا رسوم إضافية — فقط اشترك واظهر باحترافية'
            }
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            {['gold', 'blue', 'purple'].map((t, i) => (
              <Icon3D key={i} icon={Star} theme={t} size="xs" hoverable={false} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}


// ═════════════════════════════════════════
// Stage Card Component
// ═════════════════════════════════════════
function StageCard({
  stage,
  isEn,
  isDark,
  isLast,
  index,
}: {
  stage: Stage;
  isEn: boolean;
  isDark: boolean;
  isLast: boolean;
  index: number;
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEn ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`relative mb-8 ${isEn ? 'pl-16' : 'pr-16'}`}
    >
      {/* ─── Stage Number Circle (on the line) ─── */}
      <div
        className={`absolute top-0 w-12 h-12 rounded-2xl flex items-center justify-center z-10 shadow-lg ${
          isEn ? 'left-0' : 'right-0'
        }`}
        style={{
          background: `linear-gradient(135deg, ${stage.gradientFrom}, ${stage.gradientTo})`,
          boxShadow: `0 4px 15px ${stage.color}40`,
        }}
      >
        <span className="text-white font-black text-lg" style={{ fontFamily: font }}>
          {stage.number}
        </span>
      </div>

      {/* ─── Connector dot ─── */}
      {!isLast && (
        <div
          className={`absolute bottom-0 translate-y-4 w-3 h-3 rounded-full z-10 ${
            isEn ? 'left-[18px]' : 'right-[18px]'
          }`}
          style={{ background: stage.color, opacity: 0.3 }}
        />
      )}

      {/* ─── Card ─── */}
      <div
        className={`rounded-3xl border-[3px] overflow-hidden transition-all duration-300 cursor-pointer ${
          isDark
            ? 'bg-[var(--bait-glass)] border-[var(--bait-border)] hover:border-white/20'
            : 'bg-white border-gray-200/60 hover:border-gray-300/80'
        } ${expanded ? 'shadow-xl' : 'shadow-md hover:shadow-lg'}`}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Card Header */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Icon3D icon={stage.mainIcon} theme={stage.mainIconTheme} size="md" />
            <div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: `${stage.color}15`,
                  color: stage.color,
                }}
              >
                {isEn ? stage.subtitleEn : stage.subtitleAr}
              </span>
              <h3 className={`text-sm font-black mt-1 ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
                {isEn ? stage.titleEn : stage.titleAr}
              </h3>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className={`w-5 h-5 ${isDark ? 'text-white/30' : 'text-[#1F3D2B]/30'}`} />
          </motion.div>
        </div>

        {/* Expandable Content */}
        <motion.div
          initial={false}
          animate={{
            height: expanded ? 'auto' : 0,
            opacity: expanded ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          {/* Image */}
          <div className="px-4 pb-3">
            <div className="rounded-2xl overflow-hidden border-2 border-gray-100/60 h-36 relative">
              <ImageWithFallback
                src={stage.imageUrl}
                alt={isEn ? stage.titleEn : stage.titleAr}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${stage.color}30 0%, transparent 60%)`,
                }}
              />
            </div>
          </div>

          {/* Features */}
          <div className="px-4 pb-5 space-y-3">
            {stage.features.map((feat, fi) => (
              <motion.div
                key={fi}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: fi * 0.1 }}
                className={`flex gap-3 p-3 rounded-2xl border-2 ${
                  isDark
                    ? 'bg-white/3 border-white/5'
                    : 'bg-[#F5EEE1]/40 border-[#F5EEE1]/60'
                }`}
              >
                <Icon3D icon={feat.icon} theme={feat.iconTheme} size="sm" hoverable={false} />
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-black mb-1 ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
                    {isEn ? feat.titleEn : feat.titleAr}
                  </h4>
                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-white/40' : 'text-[#1F3D2B]/45'}`}>
                    {isEn ? feat.descEn : feat.descAr}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}


// ═════════════════════════════════════════
// Compact Horizontal version (for Home page)
// ═════════════════════════════════════════
export function PlatformRoadmapCompact({ isEn = false }: { isEn?: boolean }) {
  const { isDark } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="w-full py-8" dir={isEn ? 'ltr' : 'rtl'} style={{ fontFamily: font }}>
      {/* Header */}
      <div className="px-5 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Icon3D icon={TrendingUp} theme="gold" size="xs" hoverable={false} />
          <h3 className={`text-lg font-black ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
            {isEn ? 'How It Works' : 'كيف تعمل المنصة'}
          </h3>
        </div>
        <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1F3D2B]/40'}`}>
          {isEn ? '4 easy steps to the best service' : '4 خطوات سهلة للحصول على أفضل خدمة'}
        </p>
      </div>

      {/* Horizontal Scroll Cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-5 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {STAGES.map((stage, idx) => (
          <motion.div
            key={stage.number}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`flex-shrink-0 w-64 snap-center rounded-3xl border-[3px] overflow-hidden ${
              isDark
                ? 'bg-[var(--bait-glass)] border-[var(--bait-border)]'
                : 'bg-white border-gray-200/60'
            }`}
          >
            {/* Card Top */}
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{ background: `linear-gradient(135deg, ${stage.gradientFrom}08, ${stage.gradientTo}12)` }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${stage.gradientFrom}, ${stage.gradientTo})`,
                  boxShadow: `0 3px 10px ${stage.color}30`,
                }}
              >
                <span className="text-white font-black text-sm">{stage.number}</span>
              </div>
              <div>
                <span
                  className="text-[9px] font-bold"
                  style={{ color: stage.color }}
                >
                  {isEn ? stage.subtitleEn : stage.subtitleAr}
                </span>
                <h4 className={`text-xs font-black ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
                  {isEn ? stage.titleEn : stage.titleAr}
                </h4>
              </div>
            </div>

            {/* Features Preview */}
            <div className="px-4 py-3 space-y-2">
              {stage.features.map((feat, fi) => (
                <div key={fi} className="flex items-center gap-2">
                  <Icon3D icon={feat.icon} theme={feat.iconTheme} size="xs" hoverable={false} />
                  <span className={`text-[10px] font-bold ${isDark ? 'text-white/60' : 'text-[#1F3D2B]/60'}`}>
                    {isEn ? feat.titleEn : feat.titleAr}
                  </span>
                </div>
              ))}
            </div>

            {/* Image */}
            <div className="px-3 pb-3">
              <div className="rounded-xl overflow-hidden h-24 border border-gray-100/40">
                <ImageWithFallback
                  src={stage.imageUrl}
                  alt={isEn ? stage.titleEn : stage.titleAr}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}