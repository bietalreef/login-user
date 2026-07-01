/**
 * AutomationWorkflow.tsx — مسار أتمتة عروض الأسعار في بيت الريف
 * ═════════════════════════════════════════════════════════════════
 * إنفوجرافيك تفاعلي يوضح رحلة طلب عرض السعر من البداية حتى بدء العمل
 * مع وياك كمحرك ذكي — بأسلوب Houzz Pro المطور
 * بدون أخضر — بدون إيموجي — كل الأيقونات Icon3D
 */

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import {
  Search, FileText, MessageCircle, Star, Cpu, Send, Users,
  CheckCircle, Clock, Award, Shield, Sparkles, Zap, Filter,
  ArrowDown, ArrowRight, ChevronDown, ChevronRight,
  User, UserCheck, Bell, FileSignature, ClipboardList,
  CalendarCheck, Wallet, Receipt, Building2, Wrench,
  Target, Eye, Lock, BarChart3, ThumbsUp,
  Play, PenTool, FolderKanban, ListChecks, ShieldCheck,
  CircleDot, GitBranch, Layers, Settings,
  Calculator, Paintbrush, Video, Lightbulb, Palette,
  Box, Layout, Megaphone, Share2, Ruler, Camera,
  type LucideIcon,
} from 'lucide-react';
// Bot, Crown, BadgeCheck not available — using safe aliases
const Bot = Cpu;
const Crown = Award;
const BadgeCheck = ShieldCheck;
import { Icon3D } from '../ui/Icon3D';
import { useTheme } from '../../contexts/ThemeContext';

const font = 'Cairo, sans-serif';

// ═════════════════════════════════════════
// Flow Step Data
// ═════════════════════════════════════════

interface FlowSubStep {
  icon: any;
  iconTheme: string;
  textAr: string;
  textEn: string;
}

interface FlowStep {
  id: string;
  number: number;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descAr: string;
  descEn: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  mainIcon: any;
  mainIconTheme: string;
  actor: 'client' | 'weyaak' | 'provider' | 'system';
  actorLabelAr: string;
  actorLabelEn: string;
  subSteps: FlowSubStep[];
  isSplit?: boolean;
  splitPaths?: {
    pathA: { labelAr: string; labelEn: string; descAr: string; descEn: string; icon: any; iconTheme: string };
    pathB: { labelAr: string; labelEn: string; descAr: string; descEn: string; icon: any; iconTheme: string };
  };
}

const FLOW_STEPS: FlowStep[] = [
  {
    id: 'request',
    number: 1,
    titleAr: 'طلب عرض السعر',
    titleEn: 'Request a Quote',
    subtitleAr: 'نقطة البداية',
    subtitleEn: 'Starting Point',
    descAr: 'العميل يبدأ رحلته — يوجد مساران للحصول على عرض سعر',
    descEn: 'The client starts their journey — two paths to get a quote',
    color: '#3B5BFE',
    gradientFrom: '#3B5BFE',
    gradientTo: '#5B7AFF',
    mainIcon: FileText,
    mainIconTheme: 'blue',
    actor: 'client',
    actorLabelAr: 'العميل',
    actorLabelEn: 'Client',
    subSteps: [
      { icon: Search, iconTheme: 'blue', textAr: 'يتصفح الخدمات والمزودين بحرية كاملة', textEn: 'Browse services and providers freely' },
      { icon: Filter, iconTheme: 'indigo', textAr: 'يفلتر حسب التخصص، الموقع، التقييم', textEn: 'Filter by specialty, location, rating' },
      { icon: Target, iconTheme: 'purple', textAr: 'يختار المسار المناسب لاحتياجاته', textEn: 'Choose the path that suits their needs' },
    ],
    isSplit: true,
    splitPaths: {
      pathA: {
        labelAr: 'طلب مباشر',
        labelEn: 'Direct Request',
        descAr: 'من الملف الشخصي للمزود مباشرة — أسرع وأبسط',
        descEn: 'From provider profile directly — faster and simpler',
        icon: User,
        iconTheme: 'blue',
      },
      pathB: {
        labelAr: 'إنشاء RFQ عام',
        labelEn: 'Create Public RFQ',
        descAr: 'طلب عرض سعر يُرسل لعدة مزودين متخصصين عبر وياك',
        descEn: 'Quote request sent to multiple specialized providers via Weyaak',
        icon: Send,
        iconTheme: 'gold',
      },
    },
  },
  {
    id: 'client-input',
    number: 2,
    titleAr: 'إدخال بيانات المشروع',
    titleEn: 'Enter Project Details',
    subtitleAr: 'تحديد الاحتياجات',
    subtitleEn: 'Define Requirements',
    descAr: 'العميل يملأ نموذج ذكي بتفاصيل مشروعه — وياك يساعده في كل خطوة',
    descEn: 'Client fills a smart form with project details — Weyaak assists at every step',
    color: '#3B5BFE',
    gradientFrom: '#3B5BFE',
    gradientTo: '#6B8AFF',
    mainIcon: ClipboardList,
    mainIconTheme: 'blue',
    actor: 'client',
    actorLabelAr: 'العميل',
    actorLabelEn: 'Client',
    subSteps: [
      { icon: Building2, iconTheme: 'blue', textAr: 'نوع المشروع: بناء، تشطيب، صيانة، تجديد', textEn: 'Project type: Construction, Finishing, Maintenance, Renovation' },
      { icon: PenTool, iconTheme: 'indigo', textAr: 'وصف تفصيلي للمتطلبات والمواصفات', textEn: 'Detailed description of requirements and specifications' },
      { icon: Wallet, iconTheme: 'gold', textAr: 'الميزانية التقديرية والموقع والجدول الزمني', textEn: 'Estimated budget, location, and timeline' },
      { icon: Bot, iconTheme: 'purple', textAr: 'وياك يقترح تفاصيل إضافية لتحسين الطلب', textEn: 'Weyaak suggests additional details to improve the request' },
    ],
  },
  {
    id: 'weyaak-analysis',
    number: 3,
    titleAr: 'وياك يحلل ويوزع',
    titleEn: 'Weyaak Analyzes & Distributes',
    subtitleAr: 'المحرك الذكي',
    subtitleEn: 'Smart Engine',
    descAr: 'وياك يستقبل الطلب، يحلل التخصص، ويرسله للمزودين الموثقين والمتخصصين في المجال المحدد',
    descEn: 'Weyaak receives the request, analyzes the specialty, and sends it to verified providers specialized in the specific field',
    color: '#9B59B6',
    gradientFrom: '#9B59B6',
    gradientTo: '#B07AED',
    mainIcon: Bot,
    mainIconTheme: 'purple',
    actor: 'weyaak',
    actorLabelAr: 'وياك AI',
    actorLabelEn: 'Weyaak AI',
    subSteps: [
      { icon: Cpu, iconTheme: 'purple', textAr: 'تحليل الطلب وتصنيف التخصص تلقائياً', textEn: 'Analyze request and classify specialty automatically' },
      { icon: Shield, iconTheme: 'blue', textAr: 'فلترة المزودين الموثقين والمعتمدين فقط', textEn: 'Filter verified and certified providers only' },
      { icon: Target, iconTheme: 'indigo', textAr: 'مطابقة ذكية بناءً على الموقع والتقييم والخبرة', textEn: 'Smart matching based on location, rating, and experience' },
      { icon: Send, iconTheme: 'gold', textAr: 'إرسال فوري للمزودين المناسبين مع إشعار ذكي', textEn: 'Instant delivery to suitable providers with smart notification' },
    ],
  },
  {
    id: 'provider-response',
    number: 4,
    titleAr: 'المزودون يردون بعروضهم',
    titleEn: 'Providers Submit Their Offers',
    subtitleAr: 'استجابة المزودين',
    subtitleEn: 'Provider Response',
    descAr: 'كل مزود يستقبل إشعاراً بالطلب، يراجع التفاصيل، يكتب شروطه وعرض سعره، ويرسله للعميل',
    descEn: 'Each provider receives a notification, reviews details, writes terms and pricing, and sends it to the client',
    color: '#D4AF37',
    gradientFrom: '#D4AF37',
    gradientTo: '#FFD700',
    mainIcon: Receipt,
    mainIconTheme: 'gold',
    actor: 'provider',
    actorLabelAr: 'المزود',
    actorLabelEn: 'Provider',
    subSteps: [
      { icon: Bell, iconTheme: 'gold', textAr: 'إشعار فوري للمزود بطلب عرض سعر جديد', textEn: 'Instant notification for new quote request' },
      { icon: Eye, iconTheme: 'amber', textAr: 'مراجعة تفاصيل المشروع والمتطلبات', textEn: 'Review project details and requirements' },
      { icon: PenTool, iconTheme: 'brown', textAr: 'كتابة عرض السعر مع الشروط والبنود', textEn: 'Write quote with terms and conditions' },
      { icon: Clock, iconTheme: 'orange', textAr: 'تحديد المدة الزمنية وطريقة الدفع', textEn: 'Set timeline and payment method' },
      { icon: Send, iconTheme: 'gold', textAr: 'إرسال العرض للعميل', textEn: 'Submit offer to client' },
    ],
  },
  {
    id: 'client-compare',
    number: 5,
    titleAr: 'المقارنة والاختيار مع وياك',
    titleEn: 'Compare & Select with Weyaak',
    subtitleAr: 'القرار الذكي',
    subtitleEn: 'Smart Decision',
    descAr: 'العميل يستقبل عروض من عدة مزودين — وياك يساعده في التصفية والمقارنة الذكية حسب متطلباته',
    descEn: 'Client receives offers from multiple providers — Weyaak helps filter and compare based on requirements',
    color: '#3B5BFE',
    gradientFrom: '#3B5BFE',
    gradientTo: '#5B7AFF',
    mainIcon: BarChart3,
    mainIconTheme: 'blue',
    actor: 'client',
    actorLabelAr: 'العميل + وياك',
    actorLabelEn: 'Client + Weyaak',
    subSteps: [
      { icon: Layers, iconTheme: 'blue', textAr: 'عرض جميع العروض المقدمة جنباً إلى جنب', textEn: 'View all submitted offers side by side' },
      { icon: Bot, iconTheme: 'purple', textAr: 'وياك يحلل ويقارن: السعر، الجودة، المدة، التقييم', textEn: 'Weyaak analyzes: price, quality, duration, rating' },
      { icon: Sparkles, iconTheme: 'gold', textAr: 'توصية ذكية بأفضل عرض يناسب الميزانية', textEn: 'Smart recommendation for best offer within budget' },
      { icon: ThumbsUp, iconTheme: 'blue', textAr: 'العميل يضغط "موافق" على العرض المختار', textEn: 'Client clicks "Approve" on selected offer' },
    ],
  },
  {
    id: 'auto-project',
    number: 6,
    titleAr: 'تحويل تلقائي إلى مشروع',
    titleEn: 'Auto-Convert to Project',
    subtitleAr: 'الأتمتة الذكية',
    subtitleEn: 'Smart Automation',
    descAr: 'بمجرد الموافقة، يتحول الطلب تلقائياً إلى مشروع في قسم المشاريع مع كل الملفات محدّثة',
    descEn: 'Upon approval, the request automatically converts to a project with all files updated',
    color: '#9B59B6',
    gradientFrom: '#9B59B6',
    gradientTo: '#B07AED',
    mainIcon: FolderKanban,
    mainIconTheme: 'purple',
    actor: 'system',
    actorLabelAr: 'النظام',
    actorLabelEn: 'System',
    subSteps: [
      { icon: Zap, iconTheme: 'gold', textAr: 'تحويل فوري تلقائي بدون أي إدخال يدوي', textEn: 'Instant automatic conversion without manual input' },
      { icon: FolderKanban, iconTheme: 'purple', textAr: 'إنشاء ملف المشروع في قسم "مشاريعي"', textEn: 'Create project file in "My Projects" section' },
      { icon: FileText, iconTheme: 'blue', textAr: 'نقل جميع البيانات والمراسلات والعروض', textEn: 'Transfer all data, communications, and offers' },
      { icon: CalendarCheck, iconTheme: 'indigo', textAr: 'إنشاء جدول زمني مبدئي من عرض السعر', textEn: 'Create initial timeline from the quote' },
    ],
  },
  {
    id: 'contract',
    number: 7,
    titleAr: 'إنشاء العقد الإلكتروني',
    titleEn: 'Generate Digital Contract',
    subtitleAr: 'التوثيق القانوني',
    subtitleEn: 'Legal Documentation',
    descAr: 'يُصدر عقد إلكتروني رسمي بين الطرفين بناءً على عرض السعر المتفق عليه — مع تشيك لست وتايم بلان',
    descEn: 'A formal digital contract is generated between both parties based on the agreed quote — with checklist and timeline',
    color: '#D4AF37',
    gradientFrom: '#D4AF37',
    gradientTo: '#C8A86A',
    mainIcon: FileSignature,
    mainIconTheme: 'gold',
    actor: 'system',
    actorLabelAr: 'النظام',
    actorLabelEn: 'System',
    subSteps: [
      { icon: FileSignature, iconTheme: 'gold', textAr: 'عقد إلكتروني يتضمن بنود عرض السعر المتفق عليه', textEn: 'Digital contract including agreed quote terms' },
      { icon: ListChecks, iconTheme: 'amber', textAr: 'تشيك لست بمراحل التنفيذ ومعايير الجودة', textEn: 'Checklist with execution stages and quality standards' },
      { icon: CalendarCheck, iconTheme: 'brown', textAr: 'تايم بلان مفصل بمواعيد التسليم لكل مرحلة', textEn: 'Detailed timeline with delivery dates per phase' },
      { icon: Wallet, iconTheme: 'gold', textAr: 'جدول دفعات مرتبط بمراحل الإنجاز', textEn: 'Payment schedule linked to completion milestones' },
      { icon: Shield, iconTheme: 'blue', textAr: 'بنود حماية الطرفين والضمانات', textEn: 'Protection clauses and guarantees for both parties' },
    ],
  },
  {
    id: 'review-approve',
    number: 8,
    titleAr: 'المعاينة والموافقة المتبادلة',
    titleEn: 'Mutual Review & Approval',
    subtitleAr: 'التأكيد النهائي',
    subtitleEn: 'Final Confirmation',
    descAr: 'العميل يراجع العقد ويرسله للمزود — المزود يراجع ويوافق ويضغط "بدء العمل" — كل شيء إلكتروني وموثق',
    descEn: 'Client reviews contract and sends to provider — Provider reviews, approves, and clicks "Start Work" — all electronic and documented',
    color: '#3B5BFE',
    gradientFrom: '#1F3D2B',
    gradientTo: '#D4AF37',
    mainIcon: UserCheck,
    mainIconTheme: 'gold',
    actor: 'client',
    actorLabelAr: 'الطرفان',
    actorLabelEn: 'Both Parties',
    subSteps: [
      { icon: Eye, iconTheme: 'blue', textAr: 'العميل يراجع العقد والتشيك لست والتايم بلان', textEn: 'Client reviews contract, checklist, and timeline' },
      { icon: Send, iconTheme: 'indigo', textAr: 'إرسال العقد للمزود المختار للمراجعة', textEn: 'Send contract to selected provider for review' },
      { icon: UserCheck, iconTheme: 'gold', textAr: 'المزود يراجع البنود ويضغط "موافقة وقبول"', textEn: 'Provider reviews terms and clicks "Approve & Accept"' },
      { icon: BadgeCheck, iconTheme: 'purple', textAr: 'توقيع إلكتروني من الطرفين — عقد موثق رسمياً', textEn: 'E-signature from both parties — officially documented contract' },
      { icon: Play, iconTheme: 'gold', textAr: 'المزود يضغط "بدء العمل" — المشروع ينطلق رسمياً', textEn: 'Provider clicks "Start Work" — project officially begins' },
    ],
  },
];

// Actor colors and labels
const ACTOR_CONFIG = {
  client:   { color: '#3B5BFE', bgColor: '#3B5BFE15', icon: User,      labelAr: 'العميل',   labelEn: 'Client' },
  weyaak:   { color: '#9B59B6', bgColor: '#9B59B615', icon: Bot,       labelAr: 'وياك AI',  labelEn: 'Weyaak AI' },
  provider: { color: '#D4AF37', bgColor: '#D4AF3715', icon: Wrench,    labelAr: 'المزود',   labelEn: 'Provider' },
  system:   { color: '#1F3D2B', bgColor: '#1F3D2B15', icon: Cpu,       labelAr: 'النظام',   labelEn: 'System' },
};


// ═════════════════════════════════════════
// Main Component
// ═════════════════════════════════════════
export function AutomationWorkflow({ isEn = false }: { isEn?: boolean }) {
  const { isDark } = useTheme();
  const [activeStep, setActiveStep] = useState<string | null>('request');

  return (
    <section
      className="w-full py-8 px-4"
      dir={isEn ? 'ltr' : 'rtl'}
      style={{ fontFamily: font }}
    >
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-6"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-l from-[#9B59B6]/10 to-[#3B5BFE]/10 border border-[#9B59B6]/20 mb-3">
          <Icon3D icon={Settings} theme="purple" size="xs" hoverable={false} />
          <span className={`text-xs font-bold ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
            {isEn ? 'Smart Automation' : 'الأتمتة الذكية'}
          </span>
        </div>

        <h2 className={`text-xl sm:text-2xl font-black mb-2 leading-tight ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
          {isEn ? 'Quote Automation with Weyaak' : 'أتمتة عروض الأسعار مع وياك'}
        </h2>
        <p className={`text-xs max-w-md mx-auto leading-relaxed ${isDark ? 'text-white/40' : 'text-[#1F3D2B]/45'}`}>
          {isEn
            ? 'From request to contract — Weyaak, your personal AI assistant, understands your needs and delivers the best every time'
            : 'من الطلب إلى العقد — وياك مساعدك الشخصي بالذكاء الاصطناعي يفهم احتياجاتك ويقدم الأفضل لك دائماً'
          }
        </p>

        {/* Actor Legend */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {Object.entries(ACTOR_CONFIG).map(([key, cfg]) => (
            <div
              key={key}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: cfg.bgColor, border: `1px solid ${cfg.color}20` }}
            >
              <Icon3D icon={cfg.icon} theme={key === 'client' ? 'blue' : key === 'weyaak' ? 'purple' : key === 'provider' ? 'gold' : 'brown'} size="xs" hoverable={false} />
              <span className="text-[10px] font-bold" style={{ color: cfg.color }}>
                {isEn ? cfg.labelEn : cfg.labelAr}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Flow Steps ─── */}
      <div className="max-w-lg mx-auto relative">
        {/* Vertical timeline line */}
        <div
          className={`absolute top-0 bottom-0 w-0.5 ${
            isEn ? 'left-[23px]' : 'right-[23px]'
          }`}
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, #3B5BFE40, #9B59B640, #D4AF3740, #3B5BFE40, #9B59B640, #D4AF3740, #3B5BFE40, #1F3D2B40)'
              : 'linear-gradient(to bottom, #3B5BFE20, #9B59B620, #D4AF3720, #3B5BFE20, #9B59B620, #D4AF3720, #3B5BFE20, #1F3D2B20)',
            zIndex: 0,
          }}
        />

        {FLOW_STEPS.map((step, idx) => (
          <FlowStepCard
            key={step.id}
            step={step}
            isEn={isEn}
            isDark={isDark}
            index={idx}
            isActive={activeStep === step.id}
            onToggle={() => setActiveStep(activeStep === step.id ? null : step.id)}
            isLast={idx === FLOW_STEPS.length - 1}
          />
        ))}
      </div>

      {/* ─── Bottom Summary ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-lg mx-auto mt-8"
      >
        <div className={`rounded-3xl border-[3px] p-5 ${
          isDark
            ? 'bg-[var(--bait-glass)] border-[var(--bait-border)]'
            : 'bg-gradient-to-br from-white to-[#F5EEE1]/50 border-gray-200/60'
        }`}>
          {/* Title */}
          <div className="flex items-center gap-2 mb-4">
            <Icon3D icon={Shield} theme="gold" size="sm" />
            <h3 className={`text-sm font-black ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
              {isEn ? 'Everything Electronic & Documented' : 'كل شيء إلكتروني وموثق'}
            </h3>
          </div>

          {/* Protection Points */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Lock, theme: 'blue', ar: 'حماية حقوق الطرفين', en: 'Rights Protection' },
              { icon: FileSignature, theme: 'gold', ar: 'عقود رقمية ملزمة', en: 'Binding Digital Contracts' },
              { icon: Eye, theme: 'purple', ar: 'شفافية كاملة في كل مرحلة', en: 'Full Transparency' },
              { icon: Bot, theme: 'indigo', ar: 'وياك يراقب ويساعد 24/7', en: 'Weyaak Monitors 24/7' },
              { icon: Wallet, theme: 'amber', ar: 'ضمان مالي عبر محفظة الدار', en: 'Financial Guarantee via Dar' },
              { icon: Award, theme: 'brown', ar: 'تقييم شفاف بعد كل مشروع', en: 'Transparent Rating After Each Project' },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 p-2.5 rounded-xl ${
                  isDark ? 'bg-white/3' : 'bg-white/80'
                }`}
              >
                <Icon3D icon={item.icon} theme={item.theme} size="xs" hoverable={false} />
                <span className={`text-[10px] font-bold ${isDark ? 'text-white/60' : 'text-[#1F3D2B]/60'}`}>
                  {isEn ? item.en : item.ar}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}


// ═════════════════════════════════════════
// Flow Step Card
// ═════════════════════════════════════════
function FlowStepCard({
  step,
  isEn,
  isDark,
  index,
  isActive,
  onToggle,
  isLast,
}: {
  step: FlowStep;
  isEn: boolean;
  isDark: boolean;
  index: number;
  isActive: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  const actorCfg = ACTOR_CONFIG[step.actor];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEn ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`relative mb-5 ${isEn ? 'pl-14' : 'pr-14'}`}
    >
      {/* ─── Step Number on Timeline ─── */}
      <div
        className={`absolute top-1 w-12 h-12 rounded-2xl flex items-center justify-center z-10 shadow-lg transition-transform duration-300 ${
          isActive ? 'scale-110' : ''
        } ${isEn ? 'left-0' : 'right-0'}`}
        style={{
          background: `linear-gradient(135deg, ${step.gradientFrom}, ${step.gradientTo})`,
          boxShadow: `0 4px 14px ${step.color}35`,
        }}
      >
        <span className="text-white font-black text-base" style={{ fontFamily: font }}>
          {step.number}
        </span>
      </div>

      {/* ─── Connector Arrow ─── */}
      {!isLast && (
        <div
          className={`absolute -bottom-3 w-6 h-6 flex items-center justify-center z-10 ${
            isEn ? 'left-[12px]' : 'right-[12px]'
          }`}
        >
          <ArrowDown className="w-4 h-4" style={{ color: `${step.color}40` }} />
        </div>
      )}

      {/* ─── Card ─── */}
      <div
        className={`rounded-3xl border-[3px] overflow-hidden transition-all duration-300 cursor-pointer ${
          isDark
            ? `bg-[var(--bait-glass)] hover:border-white/15 ${isActive ? 'border-white/20 shadow-xl' : 'border-[var(--bait-border)] shadow-md'}`
            : `bg-white hover:border-gray-300/80 ${isActive ? 'border-gray-300 shadow-xl' : 'border-gray-200/60 shadow-md'}`
        }`}
        onClick={onToggle}
      >
        {/* Card Header */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1">
              <Icon3D icon={step.mainIcon} theme={step.mainIconTheme} size="sm" />
              <div className="flex-1 min-w-0">
                {/* Actor badge + subtitle */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: actorCfg.bgColor, color: actorCfg.color }}
                  >
                    {isEn ? step.actorLabelEn : step.actorLabelAr}
                  </span>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${step.color}10`, color: step.color }}
                  >
                    {isEn ? step.subtitleEn : step.subtitleAr}
                  </span>
                </div>
                <h3 className={`text-[13px] font-black mt-1 leading-tight ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
                  {isEn ? step.titleEn : step.titleAr}
                </h3>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isActive ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-white/25' : 'text-[#1F3D2B]/25'}`} />
            </motion.div>
          </div>

          {/* Short desc always visible */}
          <p className={`text-[11px] leading-relaxed ${isDark ? 'text-white/35' : 'text-[#1F3D2B]/40'}`}>
            {isEn ? step.descEn : step.descAr}
          </p>
        </div>

        {/* ─── Expanded Content ─── */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* Split Paths (for step 1) */}
              {step.isSplit && step.splitPaths && (
                <div className="px-4 pb-3">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Path A */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className={`rounded-2xl p-3 border-2 ${
                        isDark
                          ? 'bg-[#3B5BFE]/5 border-[#3B5BFE]/15'
                          : 'bg-[#3B5BFE]/5 border-[#3B5BFE]/15'
                      }`}
                    >
                      <Icon3D icon={step.splitPaths.pathA.icon} theme={step.splitPaths.pathA.iconTheme} size="sm" hoverable={false} />
                      <h4 className={`text-[11px] font-black mt-2 ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
                        {isEn ? step.splitPaths.pathA.labelEn : step.splitPaths.pathA.labelAr}
                      </h4>
                      <p className={`text-[9px] mt-1 leading-relaxed ${isDark ? 'text-white/35' : 'text-[#1F3D2B]/40'}`}>
                        {isEn ? step.splitPaths.pathA.descEn : step.splitPaths.pathA.descAr}
                      </p>
                    </motion.div>

                    {/* Path B */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className={`rounded-2xl p-3 border-2 ${
                        isDark
                          ? 'bg-[#D4AF37]/5 border-[#D4AF37]/15'
                          : 'bg-[#D4AF37]/5 border-[#D4AF37]/15'
                      }`}
                    >
                      <Icon3D icon={step.splitPaths.pathB.icon} theme={step.splitPaths.pathB.iconTheme} size="sm" hoverable={false} />
                      <h4 className={`text-[11px] font-black mt-2 ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
                        {isEn ? step.splitPaths.pathB.labelEn : step.splitPaths.pathB.labelAr}
                      </h4>
                      <p className={`text-[9px] mt-1 leading-relaxed ${isDark ? 'text-white/35' : 'text-[#1F3D2B]/40'}`}>
                        {isEn ? step.splitPaths.pathB.descEn : step.splitPaths.pathB.descAr}
                      </p>
                    </motion.div>
                  </div>

                  {/* Merge arrow */}
                  <div className="flex items-center justify-center mt-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold ${
                      isDark ? 'bg-white/5 text-white/30' : 'bg-[#F5EEE1] text-[#1F3D2B]/30'
                    }`}>
                      <GitBranch className="w-3 h-3" />
                      {isEn ? 'Both paths merge here' : 'المساران يتحدان هنا'}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub Steps */}
              <div className="px-4 pb-4 space-y-2">
                {step.subSteps.map((sub, si) => (
                  <motion.div
                    key={si}
                    initial={{ opacity: 0, x: isEn ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: si * 0.06 + (step.isSplit ? 0.25 : 0.05) }}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${
                      isDark
                        ? 'bg-white/2 border-white/5'
                        : 'bg-[#F5EEE1]/40 border-[#F5EEE1]/60'
                    }`}
                  >
                    <Icon3D icon={sub.icon} theme={sub.iconTheme} size="xs" hoverable={false} />
                    <span className={`text-[11px] font-semibold flex-1 leading-relaxed ${isDark ? 'text-white/55' : 'text-[#1F3D2B]/60'}`}>
                      {isEn ? sub.textEn : sub.textAr}
                    </span>
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: `${step.color}40` }} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


// ═════════════════════════════════════════
// Contract Details Section
// ═════════════════════════════════════════
export function ContractDetails({ isEn = false }: { isEn?: boolean }) {
  const { isDark } = useTheme();

  const sections = [
    {
      titleAr: 'المعلومات التعريفية',
      titleEn: 'Identification Information',
      icon: User,
      iconTheme: 'blue',
      color: '#3B5BFE',
      items: [
        { ar: 'الاسم الكامل للعميل ورقم الهاتف والبريد الإلكتروني', en: 'Client full name, phone number, and email' },
        { ar: 'اسم المشروع وعنوان موقع العمل والنوع', en: 'Project name, work site address, and type' },
        { ar: 'بيانات المزود: الاسم التجاري، الرخصة، التصنيف', en: 'Provider data: trade name, license, classification' },
        { ar: 'تاريخ العقد لتوثيق بدء الالتزام القانوني', en: 'Contract date to document legal commitment start' },
      ],
    },
    {
      titleAr: 'نطاق العمل والتفاصيل الفنية',
      titleEn: 'Scope of Work & Technical Details',
      icon: ClipboardList,
      iconTheme: 'purple',
      color: '#9B59B6',
      items: [
        { ar: 'وصف تفصيلي للأعمال المطلوبة والمواصفات الفنية', en: 'Detailed description of required work and technical specs' },
        { ar: 'فئات العمالة ومخصصات المواد بشكل مفصل', en: 'Labor categories and material allocations in detail' },
        { ar: 'المخططات والرسومات والتصاميم ثلاثية الأبعاد المرفقة', en: 'Attached plans, drawings, and 3D designs' },
        { ar: 'معايير الجودة المطلوبة ومواصفات المواد', en: 'Required quality standards and material specifications' },
      ],
    },
    {
      titleAr: 'الشروط المالية والدفع',
      titleEn: 'Financial Terms & Payment',
      icon: Wallet,
      iconTheme: 'gold',
      color: '#D4AF37',
      items: [
        { ar: 'إجمالي القيمة المتفق عليها بالدرهم الإماراتي', en: 'Total agreed value in AED' },
        { ar: 'جدول دفعات مرتبط بمراحل الإنجاز المحددة', en: 'Payment schedule linked to defined milestones' },
        { ar: 'شروط الدفعة المقدمة والدفعات التالية', en: 'Down payment and subsequent payment terms' },
        { ar: 'آلية التعامل مع المصاريف الإضافية والتعديلات', en: 'Mechanism for handling additional expenses and changes' },
      ],
    },
    {
      titleAr: 'الجدول الزمني والتنفيذ',
      titleEn: 'Timeline & Execution',
      icon: CalendarCheck,
      iconTheme: 'indigo',
      color: '#5C6BC0',
      items: [
        { ar: 'تاريخ البدء المتفق عليه وتاريخ التسليم النهائي', en: 'Agreed start date and final delivery date' },
        { ar: 'المراحل الرئيسية مع مواعيد محددة لكل مرحلة', en: 'Key milestones with specific dates for each phase' },
        { ar: 'شروط أوامر التغيير وكيفية توثيقها وتكلفتها', en: 'Change order terms, documentation, and costs' },
        { ar: 'غرامات التأخير وشروط التمديد', en: 'Late penalties and extension conditions' },
      ],
    },
    {
      titleAr: 'الحماية والتوقيعات',
      titleEn: 'Protection & Signatures',
      icon: Shield,
      iconTheme: 'brown',
      color: '#8D6E63',
      items: [
        { ar: 'التوقيع الإلكتروني الملزم من الطرفين', en: 'Binding e-signature from both parties' },
        { ar: 'بنود ضمان الجودة وفترة الصيانة', en: 'Quality guarantee and maintenance period clauses' },
        { ar: 'آلية فض النزاعات والتحكيم', en: 'Dispute resolution and arbitration mechanism' },
        { ar: 'شروط الإلغاء والاسترداد لحماية الطرفين', en: 'Cancellation and refund terms to protect both parties' },
      ],
    },
  ];

  return (
    <section
      className="w-full py-6 px-4"
      dir={isEn ? 'ltr' : 'rtl'}
      style={{ fontFamily: font }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-5"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-2">
          <Icon3D icon={FileSignature} theme="gold" size="xs" hoverable={false} />
          <span className={`text-[10px] font-bold ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
            {isEn ? 'Smart Contracts' : 'العقود الذكية'}
          </span>
        </div>
        <h3 className={`text-lg font-black ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
          {isEn ? 'What Does the Contract Include?' : 'ماذا يتضمن العقد؟'}
        </h3>
      </motion.div>

      {/* Contract Sections */}
      <div className="max-w-lg mx-auto space-y-3">
        {sections.map((sec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            className={`rounded-2xl border-[3px] p-4 ${
              isDark
                ? 'bg-[var(--bait-glass)] border-[var(--bait-border)]'
                : 'bg-white border-gray-200/60'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <Icon3D icon={sec.icon} theme={sec.iconTheme} size="sm" hoverable={false} />
              <h4 className={`text-[13px] font-black ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
                {isEn ? sec.titleEn : sec.titleAr}
              </h4>
            </div>
            <div className="space-y-1.5">
              {sec.items.map((item, ii) => (
                <div key={ii} className="flex items-start gap-2">
                  <CircleDot className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: `${sec.color}60` }} />
                  <span className={`text-[11px] leading-relaxed ${isDark ? 'text-white/50' : 'text-[#1F3D2B]/50'}`}>
                    {isEn ? item.en : item.ar}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


// ═════════════════════════════════════════════════════════════
// Smart Tools & Templates Gallery — كل النماذج والأدوات الذكية
// ═════════════════════════════════════════════════════════════

interface ToolTemplate {
  id: string;
  /** Short code badge — from Figma design (TND, QTE, CNT…) */
  code: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: LucideIcon;
  iconTheme: string;
  color: string;
  gradient: string;
  category: 'documents' | 'calculators' | 'design' | 'marketing' | 'management';
  route: string;
  tier?: 'free' | 'basic' | 'pro' | 'enterprise';
}

const TOOL_TEMPLATES: ToolTemplate[] = [
  // ─── المستندات والعقود ───
  {
    id: 'tender-management',
    code: 'TND',
    nameAr: 'إنشاء مناقصة',
    nameEn: 'Create Tender',
    descAr: 'أنشئ مناقصات احترافية واستقبل عروض من مزودين معتمدين',
    descEn: 'Create professional tenders & receive bids from verified providers',
    icon: Award,
    iconTheme: 'amber',
    color: '#FF8F00',
    gradient: 'from-[#FFB347] to-[#F09030]',
    category: 'documents',
    route: '/rfq',
    tier: 'pro',
  },
  {
    id: 'quote-generator',
    code: 'QTE',
    nameAr: 'إنشاء عرض سعر',
    nameEn: 'Create Quote',
    descAr: 'أنشئ عروض أسعار احترافية بشعارك وبنودك — جاهزة للطباعة والمشاركة بصيغة PDF',
    descEn: 'Create professional quotes with your logo and terms — print & share-ready PDF',
    icon: FileText,
    iconTheme: 'blue',
    color: '#3B5BFE',
    gradient: 'from-[#3B5BFE] to-[#5B7AFF]',
    category: 'documents',
    route: '/tools',
    tier: 'basic',
  },
  {
    id: 'contract-generator',
    code: 'CTR',
    nameAr: 'مولّد العقود الذكية',
    nameEn: 'Smart Contract Generator',
    descAr: 'عقود إلكترونية ملزمة بين الطرفين — شروط، دفعات، جداول، وتوقيع رقمي',
    descEn: 'Binding digital contracts — terms, payments, schedules & e-signature',
    icon: FileSignature,
    iconTheme: 'gold',
    color: '#D4AF37',
    gradient: 'from-[#D4AF37] to-[#C8A86A]',
    category: 'documents',
    route: '/tools',
    tier: 'pro',
  },
  {
    id: 'invoice-generator',
    code: 'INV',
    nameAr: 'مولّد الفواتير',
    nameEn: 'Invoice Generator',
    descAr: 'فواتير احترافية بضريبة القيمة المضافة — أرقام تسلسلية وتفاصيل كاملة',
    descEn: 'Professional VAT invoices — serial numbers & full details',
    icon: Receipt,
    iconTheme: 'purple',
    color: '#9B59B6',
    gradient: 'from-[#9B59B6] to-[#B07AED]',
    category: 'documents',
    route: '/tools',
    tier: 'basic',
  },
  {
    id: 'rfq-form',
    code: 'RFQ',
    nameAr: 'نموذج طلب عرض سعر',
    nameEn: 'Request for Quote (RFQ)',
    descAr: 'أنشئ طلب عرض سعر يُرسل تلقائياً للمزودين المتخصصين عبر وياك',
    descEn: 'Create an RFQ auto-sent to specialized providers via Weyaak',
    icon: Send,
    iconTheme: 'indigo',
    color: '#5C6BC0',
    gradient: 'from-[#5C6BC0] to-[#7986CB]',
    category: 'documents',
    route: '/rfq',
    tier: 'free',
  },
  {
    id: 'inquiry-form',
    code: 'INQ',
    nameAr: 'نموذج الاستفسار',
    nameEn: 'Inquiry Form',
    descAr: 'استفسار سريع عن خدمة أو مزود — يُرسل مباشرة مع بياناتك',
    descEn: 'Quick service or provider inquiry — sent directly with your info',
    icon: ClipboardList,
    iconTheme: 'blue',
    color: '#2196F3',
    gradient: 'from-[#2196F3] to-[#42A5F5]',
    category: 'documents',
    route: '/services',
    tier: 'free',
  },
  // ─── أدوات البحث الذكي (داشبورد Figma) ───
  {
    id: 'search-contractor',
    code: 'CNT',
    nameAr: 'البحث عن مقاول',
    nameEn: 'Search Contractor',
    descAr: 'ابحث عن مقاولين معتمدين قريبين منك حسب التخصص والتقييم',
    descEn: 'Find verified contractors near you by specialty & rating',
    icon: Target,
    iconTheme: 'brown',
    color: '#2AA676',
    gradient: 'from-[#4CD080] to-[#2AA676]',
    category: 'management',
    route: '/services/construction',
    tier: 'free',
  },
  {
    id: 'search-service',
    code: 'SRV',
    nameAr: 'البحث عن خدمة',
    nameEn: 'Search Service',
    descAr: 'ابحث في جميع الخدمات — سباكة، كهرباء، تكييف، دهان والمزيد',
    descEn: 'Browse all services — plumbing, electrical, AC, painting & more',
    icon: Search,
    iconTheme: 'red',
    color: '#E04545',
    gradient: 'from-[#FF6B6B] to-[#E04545]',
    category: 'management',
    route: '/services',
    tier: 'free',
  },
  {
    id: 'search-consultant',
    code: 'CST',
    nameAr: 'البحث عن مستشار',
    nameEn: 'Search Consultant',
    descAr: 'استشر مهندسين ومصممين معتمدين للحصول على رأي خبير',
    descEn: 'Consult verified engineers & architects for expert advice',
    icon: Users,
    iconTheme: 'purple',
    color: '#7C5ADA',
    gradient: 'from-[#9B7AED] to-[#7C5ADA]',
    category: 'management',
    route: '/services/consultation',
    tier: 'free',
  },
  {
    id: 'search-product',
    code: 'PRD',
    nameAr: 'البحث عن منتج',
    nameEn: 'Search Product',
    descAr: 'ابحث عن مواد البناء والتشطيب بأفضل الأسعار من الموردين المعتمدين',
    descEn: 'Find building materials at best prices from verified suppliers',
    icon: Building2,
    iconTheme: 'blue',
    color: '#3B7AE8',
    gradient: 'from-[#5B9CF6] to-[#3B7AE8]',
    category: 'management',
    route: '/shop',
    tier: 'free',
  },
  {
    id: 'search-offers',
    code: 'OFR',
    nameAr: 'البحث عن عروض',
    nameEn: 'Search Offers',
    descAr: 'اكتشف أحدث العروض والخصومات من المزودين والمتاجر',
    descEn: 'Discover latest offers & discounts from providers & stores',
    icon: Star,
    iconTheme: 'red',
    color: '#E04545',
    gradient: 'from-[#FF6B6B] to-[#E04545]',
    category: 'management',
    route: '/offers',
    tier: 'free',
  },
  {
    id: 'search-craftsman',
    code: 'CRF',
    nameAr: 'البحث عن حرفي',
    nameEn: 'Search Craftsman',
    descAr: 'ابحث عن حرفيين ماهرين — نجارة، حدادة، سيراميك، جبس ومزيد',
    descEn: 'Find skilled craftsmen — carpentry, welding, ceramics, gypsum & more',
    icon: Wrench,
    iconTheme: 'gold',
    color: '#D4AF37',
    gradient: 'from-[#FFD700] to-[#D4AF37]',
    category: 'management',
    route: '/services/craftsmen',
    tier: 'free',
  },
  // ─── الحاسبات الذكية ───
  {
    id: 'cost-estimator',
    code: 'EST',
    nameAr: 'تقدير تكلفة البناء',
    nameEn: 'Building Cost Estimator',
    descAr: 'احسب التكلفة التقريبية لمشروعك بناءً على المساحة والنوع والموقع',
    descEn: 'Estimate project cost based on area, type & location',
    icon: Calculator,
    iconTheme: 'gold',
    color: '#D4AF37',
    gradient: 'from-[#D4AF37] to-[#FFD700]',
    category: 'calculators',
    route: '/tools',
    tier: 'free',
  },
  {
    id: 'material-calculator',
    code: 'MAT',
    nameAr: 'حاسبة المواد',
    nameEn: 'Material Calculator',
    descAr: 'احسب كميات الحديد والإسمنت والطوب والرمل المطلوبة لمشروعك بدقة',
    descEn: 'Calculate iron, cement, brick & sand quantities accurately',
    icon: Ruler,
    iconTheme: 'brown',
    color: '#8D6E63',
    gradient: 'from-[#8D6E63] to-[#A1887F]',
    category: 'calculators',
    route: '/tools',
    tier: 'free',
  },
  {
    id: 'paint-flooring-calc',
    code: 'PNT',
    nameAr: 'حاسبة الدهان والأرضيات',
    nameEn: 'Paint & Flooring Calculator',
    descAr: 'احسب كميات الدهان والبلاط والأرضيات المطلوبة حسب المساحة',
    descEn: 'Calculate paint & flooring quantities by area',
    icon: Paintbrush,
    iconTheme: 'amber',
    color: '#FF8F00',
    gradient: 'from-[#FF8F00] to-[#FFA726]',
    category: 'calculators',
    route: '/tools',
    tier: 'free',
  },
  {
    id: 'lighting-calc',
    code: 'LIT',
    nameAr: 'حاسبة الإضاءة',
    nameEn: 'Lighting Calculator',
    descAr: 'حدد عدد ونوع وحدات الإضاءة المناسبة لكل غرفة بذكاء',
    descEn: 'Determine lighting unit count & type for each room',
    icon: Lightbulb,
    iconTheme: 'gold',
    color: '#FFC107',
    gradient: 'from-[#FFC107] to-[#FFD54F]',
    category: 'calculators',
    route: '/tools',
    tier: 'free',
  },
  // ─── أدوات التصميم ───
  {
    id: 'design-2d',
    code: '2DD',
    nameAr: 'مخطط 2D تفاعلي',
    nameEn: '2D Interactive Planner',
    descAr: 'ارسم مخطط منزلك أو مشروعك بأدوات سحب وإفلات بسيطة',
    descEn: 'Draw your home or project plan with simple drag & drop tools',
    icon: Layout,
    iconTheme: 'blue',
    color: '#3B5BFE',
    gradient: 'from-[#3B5BFE] to-[#7C4DFF]',
    category: 'design',
    route: '/design',
    tier: 'free',
  },
  {
    id: 'design-3d',
    code: '3DD',
    nameAr: 'تصميم ثلاثي الأبعاد',
    nameEn: '3D Design Viewer',
    descAr: 'حوّل مخططك 2D إلى تصميم ثلاثي الأبعاد واقعي',
    descEn: 'Convert your 2D plan to a realistic 3D design',
    icon: Box,
    iconTheme: 'purple',
    color: '#9B59B6',
    gradient: 'from-[#9B59B6] to-[#CE93D8]',
    category: 'design',
    route: '/tools',
    tier: 'pro',
  },
  {
    id: 'color-palette',
    code: 'CLR',
    nameAr: 'لوحة الألوان',
    nameEn: 'Color Palette Tool',
    descAr: 'استكشف تناسقات الألوان المثالية لمشروعك — جدران، أثاث، ديكور',
    descEn: 'Explore ideal color harmonies for walls, furniture & décor',
    icon: Palette,
    iconTheme: 'red',
    color: '#E91E63',
    gradient: 'from-[#E91E63] to-[#F48FB1]',
    category: 'design',
    route: '/tools',
    tier: 'free',
  },
  {
    id: 'room-layout',
    code: 'ROM',
    nameAr: 'تخطيط الغرف',
    nameEn: 'Room Layout Tool',
    descAr: 'خطط ترتيب الأثاث والتجهيزات في كل غرفة بسهولة',
    descEn: 'Plan furniture & fixture arrangement in every room',
    icon: Layers,
    iconTheme: 'indigo',
    color: '#5C6BC0',
    gradient: 'from-[#5C6BC0] to-[#9FA8DA]',
    category: 'design',
    route: '/tools',
    tier: 'basic',
  },
  // ─── أدوات التسويق ───
  {
    id: 'ai-video-creator',
    code: 'VID',
    nameAr: 'صانع الفيديو بالذكاء الاصطناعي',
    nameEn: 'AI Video Creator',
    descAr: 'أنشئ فيديوهات تسويقية احترافية لخدماتك ومشاريعك تلقائياً',
    descEn: 'Create professional marketing videos for services & projects',
    icon: Video,
    iconTheme: 'purple',
    color: '#9B59B6',
    gradient: 'from-[#9B59B6] to-[#7B1FA2]',
    category: 'marketing',
    route: '/tools',
    tier: 'enterprise',
  },
  {
    id: 'ai-logo-creator',
    code: 'LGO',
    nameAr: 'صانع الشعارات',
    nameEn: 'AI Logo Creator',
    descAr: 'صمم شعار احترافي لشركتك أو مؤسستك بالذكاء الاصطناعي',
    descEn: 'Design a professional logo for your company with AI',
    icon: Sparkles,
    iconTheme: 'gold',
    color: '#D4AF37',
    gradient: 'from-[#D4AF37] to-[#FFD700]',
    category: 'marketing',
    route: '/tools',
    tier: 'pro',
  },
  {
    id: 'marketing-content',
    code: 'MKT',
    nameAr: 'مولّد المحتوى التسويقي',
    nameEn: 'Marketing Content Generator',
    descAr: 'أنشئ منشورات ونصوص تسويقية جذابة لشبكات التواصل الاجتماعي',
    descEn: 'Generate engaging social media posts & marketing copy',
    icon: Megaphone,
    iconTheme: 'blue',
    color: '#1E88E5',
    gradient: 'from-[#1E88E5] to-[#42A5F5]',
    category: 'marketing',
    route: '/tools',
    tier: 'pro',
  },
  {
    id: 'social-media-manager',
    code: 'SMM',
    nameAr: 'مدير السوشيال ميديا',
    nameEn: 'Social Media Manager',
    descAr: 'أدر جميع حساباتك في مكان واحد — جدولة، نشر، وتحليل الأداء',
    descEn: 'Manage all accounts in one place — schedule, post & analyze',
    icon: Share2,
    iconTheme: 'indigo',
    color: '#5C6BC0',
    gradient: 'from-[#5C6BC0] to-[#3F51B5]',
    category: 'marketing',
    route: '/tools',
    tier: 'enterprise',
  },
  // ─── إدارة المشاريع ───
  {
    id: 'project-dashboard',
    code: 'PRJ',
    nameAr: 'لوحة إدارة المشاريع',
    nameEn: 'Project Dashboard',
    descAr: 'تابع تقدم كل مشروع — المراحل، الجدول الزمني، نسب الإنجاز',
    descEn: 'Track project progress — phases, timeline, completion rates',
    icon: FolderKanban,
    iconTheme: 'purple',
    color: '#9B59B6',
    gradient: 'from-[#9B59B6] to-[#8E24AA]',
    category: 'management',
    route: '/projects',
    tier: 'basic',
  },
  {
    id: 'photo-documentation',
    code: 'DOC',
    nameAr: 'توثيق المشاريع بالصور',
    nameEn: 'Photo Documentation',
    descAr: 'وثّق تقدم المشروع بالصور مع طوابع التاريخ والملاحظات التلقائية',
    descEn: 'Document project progress with timestamped photos & auto-notes',
    icon: Camera,
    iconTheme: 'amber',
    color: '#FF8F00',
    gradient: 'from-[#FF8F00] to-[#F57C00]',
    category: 'management',
    route: '/projects',
    tier: 'pro',
  },
];

const CATEGORY_CONFIG: Record<string, { labelAr: string; labelEn: string; color: string; icon: LucideIcon; iconTheme: string }> = {
  documents:   { labelAr: 'المستندات والعقود',   labelEn: 'Documents & Contracts', color: '#3B5BFE', icon: FileText,     iconTheme: 'blue' },
  calculators: { labelAr: 'الحاسبات الذكية',     labelEn: 'Smart Calculators',     color: '#D4AF37', icon: Calculator,   iconTheme: 'gold' },
  design:      { labelAr: 'أدوات التصميم',       labelEn: 'Design Tools',          color: '#9B59B6', icon: Palette,      iconTheme: 'purple' },
  marketing:   { labelAr: 'أدوات التسويق',       labelEn: 'Marketing Tools',       color: '#1E88E5', icon: Megaphone,    iconTheme: 'blue' },
  management:  { labelAr: 'إدارة المشاريع',      labelEn: 'Project Management',    color: '#8D6E63', icon: FolderKanban, iconTheme: 'brown' },
};

const TIER_BADGE: Record<string, { labelAr: string; labelEn: string; color: string; bg: string }> = {
  free:       { labelAr: 'مجاني',     labelEn: 'Free',       color: '#3B5BFE', bg: '#3B5BFE15' },
  basic:      { labelAr: 'أساسي',     labelEn: 'Basic',      color: '#5C6BC0', bg: '#5C6BC015' },
  pro:        { labelAr: 'احترافي',    labelEn: 'Pro',        color: '#D4AF37', bg: '#D4AF3715' },
  enterprise: { labelAr: 'مؤسسي',     labelEn: 'Enterprise', color: '#9B59B6', bg: '#9B59B615' },
};

export function SmartToolsGallery({ isEn = false }: { isEn?: boolean }) {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const categories = ['all', 'documents', 'calculators', 'design', 'marketing', 'management'];

  const filtered = activeCategory === 'all'
    ? TOOL_TEMPLATES
    : TOOL_TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <section
      className="w-full py-8 px-4"
      dir={isEn ? 'ltr' : 'rtl'}
      style={{ fontFamily: font }}
    >
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-l from-[#D4AF37]/10 to-[#3B5BFE]/10 border border-[#D4AF37]/20 mb-3">
          <Icon3D icon={Sparkles} theme="gold" size="xs" hoverable={false} />
          <span className={`text-xs font-bold ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
            {isEn ? 'Smart Tools & Templates' : 'الأدوات والنماذج الذكية'}
          </span>
        </div>

        <h2 className={`text-xl sm:text-2xl font-black mb-2 leading-tight ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
          {isEn ? 'All Tools in One Place' : 'كل الأدوات في مكان واحد'}
        </h2>
        <p className={`text-xs max-w-md mx-auto leading-relaxed ${isDark ? 'text-white/40' : 'text-[#1F3D2B]/45'}`}>
          {isEn
            ? '20+ smart tools: quotes, contracts, invoices, calculators, AI design & marketing — everything you need to manage your projects professionally'
            : '+20 أداة ذكية: عروض أسعار، عقود، فواتير، حاسبات، تصميم وتسويق بالذكاء الاصطناعي — كل ما تحتاجه لإدارة مشاريعك باحترافية'
          }
        </p>

        {/* Category count */}
        <div className="flex justify-center gap-3 mt-4">
          {[
            { count: TOOL_TEMPLATES.length, labelAr: 'أداة ذكية', labelEn: 'Smart Tools' },
            { count: 5, labelAr: 'تصنيفات', labelEn: 'Categories' },
            { count: 4, labelAr: 'مستويات باقات', labelEn: 'Tier Levels' },
          ].map((stat, i) => (
            <div key={i} className={`text-center px-3 py-1.5 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white border border-[#E6DCC8]'}`}>
              <div className="text-base font-black text-[#D4AF37]">{stat.count}</div>
              <div className={`text-[9px] font-bold ${isDark ? 'text-white/40' : 'text-[#1F3D2B]/40'}`}>
                {isEn ? stat.labelEn : stat.labelAr}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Category Filters ─── */}
      <div className="max-w-lg mx-auto mb-5">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const isAll = cat === 'all';
            const cfg = isAll ? null : CATEGORY_CONFIG[cat];
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border-2 flex-shrink-0 ${
                  isActive
                    ? isDark
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#FFD700]'
                      : 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]'
                    : isDark
                      ? 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                      : 'bg-white border-gray-200/60 text-[#1F3D2B]/40 hover:bg-[#F5EEE1]/50'
                }`}
              >
                {cfg && <Icon3D icon={cfg.icon} theme={cfg.iconTheme} size="xs" hoverable={false} />}
                {isAll
                  ? (isEn ? 'All' : 'الكل')
                  : (isEn ? cfg!.labelEn : cfg!.labelAr)
                }
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                    : isDark ? 'bg-white/5 text-white/25' : 'bg-gray-100 text-gray-400'
                }`}>
                  {isAll ? TOOL_TEMPLATES.length : TOOL_TEMPLATES.filter(t => t.category === cat).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Tools Grid ─── */}
      <div className="max-w-lg mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((tool, idx) => {
              const tierInfo = TIER_BADGE[tool.tier || 'free'];
              return (
                <motion.div
                  key={tool.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                  className={`rounded-2xl border-[3px] p-4 cursor-pointer group hover:shadow-lg transition-all ${
                    isDark
                      ? 'bg-[var(--bait-glass)] border-[var(--bait-border)] hover:border-white/15'
                      : 'bg-white border-gray-200/60 hover:border-gray-300/80'
                  }`}
                >
                  {/* Top Row: Icon + Code Badge + Tier */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="relative">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br ${tool.gradient} border-2 border-white/20 group-hover:scale-110 transition-transform`}
                      >
                        <tool.icon className="w-5 h-5 text-white" />
                      </div>
                      {/* Code Badge — مثل TND, QTE, CNT */}
                      <span
                        className="absolute -top-1.5 -right-1.5 text-[7px] font-mono font-black px-1.5 py-0.5 rounded-md"
                        style={{
                          background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.95)',
                          color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)',
                          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                        }}
                      >
                        {tool.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[8px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: tierInfo.bg, color: tierInfo.color }}
                      >
                        {isEn ? tierInfo.labelEn : tierInfo.labelAr}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className={`text-[13px] font-black mb-1 leading-tight ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
                    {isEn ? tool.nameEn : tool.nameAr}
                  </h4>

                  {/* Description */}
                  <p className={`text-[10px] leading-relaxed mb-3 line-clamp-2 ${isDark ? 'text-white/35' : 'text-[#1F3D2B]/40'}`}>
                    {isEn ? tool.descEn : tool.descAr}
                  </p>

                  {/* Bottom: Category + CTA */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-white/5 text-white/25' : 'bg-[#F5EEE1] text-[#1F3D2B]/30'}`}>
                      {isEn ? CATEGORY_CONFIG[tool.category].labelEn : CATEGORY_CONFIG[tool.category].labelAr}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-bold" style={{ color: tool.color }}>
                      {isEn ? 'Open' : 'فتح'}
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ─── Total Summary Bar ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-6 rounded-2xl border-[3px] p-4 ${
            isDark
              ? 'bg-[var(--bait-glass)] border-[var(--bait-border)]'
              : 'bg-gradient-to-br from-[#F5EEE1] to-white border-gray-200/60'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <Icon3D icon={Crown} theme="gold" size="sm" hoverable={false} />
            <div>
              <h4 className={`text-sm font-black ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}>
                {isEn ? 'Tools Organized by Subscription' : 'الأدوات مرتبة حسب الباقات'}
              </h4>
              <p className={`text-[10px] ${isDark ? 'text-white/35' : 'text-[#1F3D2B]/35'}`}>
                {isEn ? 'Each tier unlocks more powerful tools' : 'كل باقة تفتح أدوات أكثر قوة'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(['free', 'basic', 'pro', 'enterprise'] as const).map((tier) => {
              const info = TIER_BADGE[tier];
              const count = TOOL_TEMPLATES.filter(t => t.tier === tier).length;
              return (
                <div
                  key={tier}
                  className={`text-center p-2 rounded-xl ${isDark ? 'bg-white/3' : 'bg-white'}`}
                >
                  <div className="text-base font-black" style={{ color: info.color }}>{count}</div>
                  <div className={`text-[9px] font-bold ${isDark ? 'text-white/40' : 'text-[#1F3D2B]/40'}`}>
                    {isEn ? info.labelEn : info.labelAr}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}