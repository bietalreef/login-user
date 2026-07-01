import { useState } from 'react';
import { 
  ExternalLink, Play, Building2, Paintbrush, Wrench, Hammer, Search, Store, MessageCircle, 
  CheckCircle, Users, TrendingUp, Star, Award, ChevronRight, Sparkles, Video, Calculator,
  Layers, Calendar, ClipboardList, Camera, FileText, Wallet, BarChart3,
  DollarSign, UserCheck, Target, Package, Truck, Globe, Shield, Eye, Lock,
  ChevronDown, ArrowLeft, Cpu, Home, UserCircle, Briefcase, Wrench as Tool, Smile,
  ThumbsUp, Megaphone, Download, SprayCan, Stethoscope, Scale, GraduationCap, ShoppingCart
} from 'lucide-react';
// Crown, ShoppingBag not available — using safe aliases
const Crown = Award;
const ShoppingBag = ShoppingCart;
// FolderKanban not available — using Layers as alias
const FolderKanban = Layers;
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../contexts/LanguageContext';
import { Icon3D } from '../ui/Icon3D';
import { triggerPWAInstall } from './InstallPWAPrompt';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { PlatformRoadmap } from '../marketing/PlatformRoadmap';
import { AutomationWorkflow, ContractDetails, SmartToolsGallery } from '../marketing/AutomationWorkflow';

// App screenshots from the real mobile app
const screenshotTenders = '/assets/screenshot-tenders.png';
const screenshotDashboard = '/assets/screenshot-dashboard.png';
const screenshotHome = '/assets/screenshot-home.png';

interface PlatformShowcaseProps {
  onBack?: () => void;
}

// ═══════════════════════════════════════════════════════════
// 1. HERO SECTION
// ══════════════════════════════════════════════════════════
function HeroSection() {
  const { language } = useTranslation('common');
  const isEn = language === 'en';

  return (
    <div className="relative overflow-hidden bg-[#F5EEE1]">
      {/* Subtle decorative elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-[#D4AF37]/8 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-[#C8A86A]/8 rounded-full blur-3xl" />

      <div className="relative px-5 pt-12 pb-10">
        {/* Logo badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-white border border-[#E6DCC8] shadow-sm rounded-2xl px-5 py-2.5 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#1F3D2B] rounded-xl flex items-center justify-center shadow-md">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#1F3D2B] font-bold text-sm">Beit Al Reef Platform</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-black text-[#1F3D2B] mb-3 leading-tight">
            {isEn ? 'Everything You Need to' : 'كل ما تحتاجه لإدارة'}
            <br />
            <span className="bg-gradient-to-l from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
              {isEn ? 'Manage & Grow' : 'وتنمية أعمالك'}
            </span>
          </h1>
          <p className="text-[#1F3D2B]/50 text-sm max-w-md mx-auto leading-relaxed">
            {isEn 
              ? 'AI-powered tools, smart project management, financial center, and much more — all in one platform'
              : 'أدوات ذكاء اصطناعي، إدارة مشاريع ذكية، مركز مالي، وأكثر — كل ذلك في منصة واحدة'
            }
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-8"
        >
          {[
            { value: '25+', label: isEn ? 'Smart Tools' : 'أداة ذكية' },
            { value: '2,500+', label: isEn ? 'Active Providers' : 'مزود نشط' },
            { value: '15K+', label: isEn ? 'Projects' : 'مشروع' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center bg-white rounded-2xl px-4 py-3 border border-[#E6DCC8] shadow-sm">
              <div className="text-xl font-black text-[#D4AF37]">{stat.value}</div>
              <div className="text-[10px] text-[#1F3D2B]/40 font-semibold">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 justify-center"
        >
          <button className="bg-gradient-to-l from-[#D4AF37] to-[#1F3D2B] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-[#D4AF37]/20 transition-all flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            {isEn ? 'Download App' : 'حمّل التطبيق'}
          </button>
          <button className="bg-white border border-[#E6DCC8] text-[#1F3D2B] px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white hover:shadow-md transition-all flex items-center gap-2 shadow-sm">
            <Play className="w-4 h-4 text-[#D4AF37]" />
            {isEn ? 'Watch Demo' : 'شاهد العرض'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 2. FEATURE CATEGORIES - Interactive expandable cards
// ═══════════════════════════════════════════════════════════

interface FeatureCategory {
  id: string;
  icon: React.ReactNode;
  emoji: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  color: string;
  gradient: string;
  features: { icon: React.ReactNode; name: string; nameEn: string; desc: string; descEn: string; tag?: string; tagEn?: string }[];
  screenshot?: string;
  appOnly?: boolean;
}

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'ai-tools',
    icon: <Sparkles className="w-6 h-6" />,
    emoji: '🤖',
    title: 'أدوات الذكاء الاصطناعي',
    titleEn: 'AI-Powered Tools',
    subtitle: 'Weyaak AI — مساعدك الذكي',
    subtitleEn: 'Weyaak AI — Your Smart Assistant',
    color: '#9B59B6',
    gradient: 'from-[#9B59B6] to-[#8E44AD]',
    features: [
      { icon: <Video className="w-5 h-5" />, name: 'Weyaak Video Creator', nameEn: 'Weyaak Video Creator', desc: 'أنشئ فيديوهات تسويقية احترافية لخدماتك ومشاريعك بالذكاء الاصطناعي. اختر الهدف، ربط حسابات التواصل، وحدد هوية العلامة التجارية — والباقي على وياك!', descEn: 'Create professional marketing videos for your services and projects with AI. Choose your goal, link social accounts, set brand identity — Weyaak handles the rest!', tag: 'حصري', tagEn: 'Exclusive' },
      { icon: <Paintbrush className="w-5 h-5" />, name: 'مولد التصاميم', nameEn: 'Design Generator', desc: 'تصاميم سوشيال ميديا، بطاقات أعمال، وعروض أسعار احترافية بضغطة واحدة', descEn: 'Social media designs, business cards, and professional quotes in one click', tag: 'AI', tagEn: 'AI' },
      { icon: <MessageCircle className="w-5 h-5" />, name: 'وياك المحادثة', nameEn: 'Weyaak Chat', desc: 'مساعد ذكي يجيب على أسئلتك، يقترح حلول، ويساعدك في اتخاذ القرارات', descEn: 'Smart assistant that answers questions, suggests solutions, and helps decision-making' },
      { icon: <Calculator className="w-5 h-5" />, name: 'حاسبة التكاليف الذكية', nameEn: 'Smart Cost Calculator', desc: 'احسب تكاليف مشروعك بدقة مع توصيات لتوفير الميزانية', descEn: 'Calculate project costs accurately with budget-saving recommendations' },
      { icon: <Search className="w-5 h-5" />, name: 'محرك البحث الذكي', nameEn: 'Smart Search Engine', desc: 'ابحث عن أي منتج أو خدمة أو مزود بالوصف النصي أو بالصورة', descEn: 'Search for any product, service, or provider by text or image' },
    ],
  },
  {
    id: 'project-management',
    icon: <FolderKanban className="w-6 h-6" />,
    emoji: '📋',
    title: 'إدارة المشاريع',
    titleEn: 'Project Management',
    subtitle: 'تتبع كل مشروع من البداية للنهاية',
    subtitleEn: 'Track every project from start to finish',
    color: '#D4AF37',
    gradient: 'from-[#D4AF37] to-[#1F3D2B]',
    features: [
      { icon: <Layers className="w-5 h-5" />, name: 'لوحة المشاريع', nameEn: 'Projects Dashboard', desc: 'عرض شامل لجميع مشاريعك — جاري، مكتمل، معلق — مع نسب الإنجاز والجداول الزمنية', descEn: 'Comprehensive view of all projects — active, completed, pending — with progress and timelines' },
      { icon: <Calendar className="w-5 h-5" />, name: 'الجدول الزمني', nameEn: 'Timeline & Scheduling', desc: 'خطط مراحل المشروع، حدد مواعيد التسليم، وتتبع التقدم اليومي', descEn: 'Plan project phases, set deadlines, and track daily progress' },
      { icon: <ClipboardList className="w-5 h-5" />, name: 'اليوميات والتقارير', nameEn: 'Daily Logs & Reports', desc: 'سجل يومي للأعمال المنجزة، المواد المستخدمة، والعمال المتواجدين', descEn: 'Daily log of completed work, materials used, and workers present' },
      { icon: <Camera className="w-5 h-5" />, name: 'توثيق بالصور', nameEn: 'Photo Documentation', desc: 'وثّق تقدم المشروع بالصور مع تاريخ وملاحظات تلقائية', descEn: 'Document project progress with photos, dates, and automatic notes' },
      { icon: <FileText className="w-5 h-5" />, name: 'المناقصات والعروض', nameEn: 'Tenders & Quotes', desc: 'أنشئ مناقصات احترافية وأرسل عروض أسعار مفصلة للعملاء', descEn: 'Create professional tenders and send detailed quotes to clients', tag: 'مهم', tagEn: 'Key' },
    ],
  },
  {
    id: 'financial',
    icon: <Wallet className="w-6 h-6" />,
    emoji: '💰',
    title: 'المركز المالي',
    titleEn: 'Financial Center',
    subtitle: 'تحكم كامل في الأرقام والأرباح',
    subtitleEn: 'Full control over numbers and profits',
    color: '#C8A86A',
    gradient: 'from-[#C8A86A] to-[#a88d55]',
    features: [
      { icon: <BarChart3 className="w-5 h-5" />, name: 'التحليل المالي', nameEn: 'Financial Analytics', desc: 'رسوم بيانية تفاعلية تعرض الإيرادات والمصروفات والأرباح بشكل لحظي', descEn: 'Interactive charts showing revenue, expenses, and profits in real-time' },
      { icon: <DollarSign className="w-5 h-5" />, name: 'إدارة المصروفات', nameEn: 'Expense Management', desc: 'تتبع مصروفات كل مشروع — مواد، عمالة، معدات — مع تقارير مفصلة', descEn: 'Track expenses per project — materials, labor, equipment — with detailed reports' },
      { icon: <TrendingUp className="w-5 h-5" />, name: 'توقعات الأرباح', nameEn: 'Profit Forecasting', desc: 'تنبؤات ذكية بالأرباح المتوقعة بناءً على المشاريع القائمة', descEn: 'Smart predictions of expected profits based on current projects' },
      { icon: <Crown className="w-5 h-5" />, name: 'كوينز الدار', nameEn: 'Dar Coins', desc: 'نظام مكافآت حصري — اكسب عملات مع كل مشروع واستبدلها بمزايا', descEn: 'Exclusive rewards system — earn coins with every project and redeem benefits', tag: 'حصري', tagEn: 'Exclusive' },
    ],
  },
  {
    id: 'team',
    icon: <Users className="w-6 h-6" />,
    emoji: '👥',
    title: 'إدارة الفريق',
    titleEn: 'Team Management',
    subtitle: 'نظّم فريقك وتابع الأداء',
    subtitleEn: 'Organize your team and track performance',
    color: '#3498DB',
    gradient: 'from-[#3498DB] to-[#2980B9]',
    features: [
      { icon: <UserCheck className="w-5 h-5" />, name: 'سجل العمال', nameEn: 'Worker Registry', desc: 'قاعدة بيانات لجميع أفراد الفريق — معلومات، مهارات، وتاريخ التوظيف', descEn: 'Database of all team members — info, skills, and employment history' },
      { icon: <Calendar className="w-5 h-5" />, name: 'جداول الدوام', nameEn: 'Work Schedules', desc: 'جدولة ذكية للورديات، تتبع الحضور والانصراف، وإدارة الإجازات', descEn: 'Smart shift scheduling, attendance tracking, and leave management' },
      { icon: <Target className="w-5 h-5" />, name: 'تقييم الأداء', nameEn: 'Performance Review', desc: 'تقييم دوري لأداء كل عامل مع توصيات تدريبية', descEn: 'Periodic performance reviews with training recommendations' },
      { icon: <MessageCircle className="w-5 h-5" />, name: 'قنوات التواصل', nameEn: 'Communication Channels', desc: 'محادثات فورية مع الفريق، غرف صوتية، وإشعارات ذكية', descEn: 'Instant messaging with team, voice rooms, and smart notifications' },
    ],
  },
  {
    id: 'marketplace',
    icon: <Package className="w-6 h-6" />,
    emoji: '🛒',
    title: 'المتجر والسوق',
    titleEn: 'Store & Marketplace',
    subtitle: 'كل ما تحتاجه في مكان واحد',
    subtitleEn: 'Everything you need in one place',
    color: '#E67E22',
    gradient: 'from-[#E67E22] to-[#D35400]',
    features: [
      { icon: <Package className="w-5 h-5" />, name: 'متجر بيت الريف', nameEn: 'Beit Al Reef Store', desc: 'تسوق مواد البناء، الأدوات، والمعدات بأسعار تنافسية مع توصيل مباشر', descEn: 'Shop for building materials, tools, and equipment at competitive prices with direct delivery' },
      { icon: <Truck className="w-5 h-5" />, name: 'تأجير المعدات', nameEn: 'Equipment Rental', desc: 'استأجر المعدات الثقيلة والخفيفة بأسعار يومية أو أسبوعية', descEn: 'Rent heavy and light equipment at daily or weekly rates' },
      { icon: <Globe className="w-5 h-5" />, name: 'سوق المناقصات', nameEn: 'Tender Market', desc: 'تصفح المناقصات المتاحة وقدم عروضك للفوز بمشاريع جديدة', descEn: 'Browse available tenders and submit bids to win new projects' },
      { icon: <Award className="w-5 h-5" />, name: 'برنامج الشراكة', nameEn: 'Partnership Program', desc: 'اشترك كشريك واحصل على خصومات حصرية وأولوية في المناقصات', descEn: 'Join as a partner for exclusive discounts and tender priority' },
    ],
  },
  {
    id: 'verification',
    icon: <Shield className="w-6 h-6" />,
    emoji: '✅',
    title: 'نظام التوثيق',
    titleEn: 'Verification System',
    subtitle: 'ثقة وأمان في كل تعامل',
    subtitleEn: 'Trust and security in every transaction',
    color: '#1F3D2B',
    gradient: 'from-[#1F3D2B] to-[#D4AF37]',
    features: [
      { icon: <Shield className="w-5 h-5" />, name: 'توثيق الهوية', nameEn: 'Identity Verification', desc: 'تحقق من الهوية الرسمية، الرخصة التجارية، وشهادات الخبرة', descEn: 'Verify official ID, trade license, and experience certificates' },
      { icon: <Award className="w-5 h-5" />, name: 'شارات الموثوقية', nameEn: 'Trust Badges', desc: 'شارات معتمدة تظهر مستوى التوثيق — برونزي، فضي، ذهبي، ماسي', descEn: 'Certified badges showing verification level — Bronze, Silver, Gold, Diamond' },
      { icon: <Eye className="w-5 h-5" />, name: 'تقييم الجودة', nameEn: 'Quality Assessment', desc: 'مراجعة أعمال سابقة ومتابعة جودة التنفيذ بشكل مستمر', descEn: 'Past work review and continuous execution quality monitoring' },
      { icon: <Lock className="w-5 h-5" />, name: 'حماية المعاملات', nameEn: 'Transaction Protection', desc: 'نظام ضمان يحمي حقوق المزود والعميل في كل صفقة', descEn: 'Escrow system that protects both provider and client rights', tag: 'أمان', tagEn: 'Secure' },
    ],
  },
];

function FeatureCategoryCard({ category, isExpanded, onToggle, index }: { 
  category: FeatureCategory; 
  isExpanded: boolean; 
  onToggle: () => void;
  index: number;
}) {
  const { language } = useTranslation('common');
  const isEn = language === 'en';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="overflow-hidden"
    >
      {/* Card Header - Always visible */}
      <button
        onClick={onToggle}
        className={`w-full rounded-3xl transition-all duration-300 ${
          isExpanded 
            ? 'rounded-b-none shadow-xl' 
            : 'shadow-md hover:shadow-lg'
        }`}
      >
        <div className={`bg-gradient-to-l ${category.gradient} p-5 rounded-3xl ${isExpanded ? 'rounded-b-none' : ''}`}>
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/10">
              {category.icon}
            </div>

            {/* Title */}
            <div className="flex-1 text-right">
              <h3 className="text-lg font-bold text-white">
                {isEn ? category.titleEn : category.title}
              </h3>
              <p className="text-white/60 text-xs mt-0.5">
                {isEn ? category.subtitleEn : category.subtitle}
              </p>
            </div>

            {/* Count & Arrow */}
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {category.features.length}
              </span>
              <ChevronDown className={`w-5 h-5 text-white/70 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-b-3xl shadow-xl border-x border-b border-gray-100">
              {/* Features list */}
              <div className="p-4 space-y-3">
                {category.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="bg-[#F5EEE1]/40 rounded-2xl p-4 border border-[#F5EEE1] hover:bg-[#F5EEE1]/70 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${category.color}15` }}
                      >
                        <div style={{ color: category.color }}>{feature.icon}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-bold text-[#1F3D2B]">
                            {isEn ? feature.nameEn : feature.name}
                          </h4>
                          {feature.tag && (
                            <span 
                              className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: category.color }}
                            >
                              {isEn ? feature.tagEn : feature.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {isEn ? feature.descEn : feature.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* App-only notice */}
              <div className="px-4 pb-4">
                <div className="bg-gradient-to-l from-[#1F3D2B]/5 to-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <p className="text-[11px] text-[#1F3D2B]/70 flex-1">
                    {isEn 
                      ? 'These features are available exclusively in the Beit Al Reef mobile app'
                      : 'هذه المميزات متاحة حصرياً في تطبيق بيت الريف'
                    }
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// 3. AI VIDEO CREATOR SPOTLIGHT
// ═══════════════════════════════════════════════════════════
function AIVideoSpotlight() {
  const { language } = useTranslation('common');
  const isEn = language === 'en';

  const dashboardPreviews = [
    {
      id: 'real_estate',
      label: isEn ? 'Real Estate Dashboard' : 'داشبورد العقارات',
      icon: Building2,
      color: '#3B5BFE',
      gradient: 'from-[#3B5BFE] to-[#1E3A8A]',
      stats: [
        { label: isEn ? 'Properties' : 'عقارات', value: '24' },
        { label: isEn ? 'Rented' : 'مؤجرة', value: '18' },
        { label: isEn ? 'Revenue' : 'إيرادات', value: '850K' },
      ],
      items: [
        { text: isEn ? 'Villa Al Zuhour - Dubai' : 'فيلا الزهور - دبي', status: 'active' },
        { text: isEn ? 'Palm Apartment' : 'شقة النخيل', status: 'pending' },
        { text: isEn ? 'Marina Studio' : 'استوديو المرسى', status: 'completed' },
      ],
    },
    {
      id: 'contracting',
      label: isEn ? 'Contracting Dashboard' : 'داشبورد المقاولات',
      icon: FolderKanban,
      color: '#D4AF37',
      gradient: 'from-[#D4AF37] to-[#8B6914]',
      premium: true,
      stats: [
        { label: isEn ? 'Projects' : 'مشاريع', value: '16' },
        { label: isEn ? 'Active' : 'نشطة', value: '12' },
        { label: isEn ? 'Value' : 'قمة', value: '1.2M' },
      ],
      items: [
        { text: isEn ? 'Al Rayan Villa - 65%' : 'فيلا الريان - 65%', status: 'active' },
        { text: isEn ? 'Residential Bid' : 'مناقصة سكنية', status: 'pending' },
        { text: isEn ? 'Palm Villa Done' : 'فيلا النخيل مكتمل', status: 'completed' },
      ],
    },
    {
      id: 'cleaning',
      label: isEn ? 'Cleaning Services' : 'داشبورد شركات النظافة',
      icon: SprayCan,
      color: '#0891B2',
      gradient: 'from-[#0891B2] to-[#0E7490]',
      stats: [
        { label: isEn ? 'Contracts' : 'عقود', value: '85' },
        { label: isEn ? 'Active' : 'نشطة', value: '62' },
        { label: isEn ? 'Revenue' : 'إيرادات', value: '420K' },
      ],
      items: [
        { text: isEn ? 'Gulf Tower — Daily' : 'برج الخليج — يومي', status: 'active' },
        { text: isEn ? 'Emirates Mall' : 'مول الإمارات', status: 'pending' },
        { text: isEn ? 'Oasis Deep Clean' : 'الواحة — شامل', status: 'completed' },
      ],
    },
    {
      id: 'interior',
      label: isEn ? 'Interior Design' : 'داشبورد التصميم الداخلي',
      icon: Paintbrush,
      color: '#8B5CF6',
      gradient: 'from-[#8B5CF6] to-[#5B21B6]',
      stats: [
        { label: isEn ? 'Projects' : 'مشاريع', value: '28' },
        { label: isEn ? 'Active' : 'جارية', value: '14' },
        { label: isEn ? 'Revenue' : 'إيرادات', value: '620K' },
      ],
      items: [
        { text: isEn ? 'Modern Apt — Dubai' : 'شقة عصرية — دبي', status: 'active' },
        { text: isEn ? 'Classic Villa' : 'فيلا كلاسيكية', status: 'pending' },
        { text: isEn ? 'Art Gallery' : 'معرض فني', status: 'completed' },
      ],
    },
    {
      id: 'healthcare',
      label: isEn ? 'Healthcare Dashboard' : 'داشبورد الرعاية الصحية',
      icon: Stethoscope,
      color: '#8D6E63',
      gradient: 'from-[#8D6E63] to-[#5D4037]',
      stats: [
        { label: isEn ? 'Patients' : 'مرضى', value: '1,240' },
        { label: isEn ? 'Appts' : 'مواعيد', value: '186' },
        { label: isEn ? 'Revenue' : 'إيرادات', value: '520K' },
      ],
      items: [
        { text: isEn ? 'Ahmed — Checkup' : 'أحمد — فحص دوري', status: 'active' },
        { text: isEn ? 'Fatima — Follow-up' : 'فاطمة — متابعة', status: 'pending' },
        { text: isEn ? 'Maryam — Done' : 'مريم — مكتمل', status: 'completed' },
      ],
    },
    {
      id: 'legal',
      label: isEn ? 'Legal Services' : 'داشبورد الخدمات القانونية',
      icon: Scale,
      color: '#1E3A8A',
      gradient: 'from-[#1E3A8A] to-[#1E1B4B]',
      stats: [
        { label: isEn ? 'Cases' : 'قضايا', value: '142' },
        { label: isEn ? 'Active' : 'نشطة', value: '38' },
        { label: isEn ? 'Revenue' : 'إيرادات', value: '1.8M' },
      ],
      items: [
        { text: isEn ? 'Commercial Dispute #87' : 'نزاع تجاري #87', status: 'active' },
        { text: isEn ? 'Contract Review' : 'مراجعة عقد', status: 'pending' },
        { text: isEn ? 'Case #82 Closed' : 'قضية #82 مغلقة', status: 'completed' },
      ],
    },
    {
      id: 'education',
      label: isEn ? 'Education Dashboard' : 'داشبورد التعليم',
      icon: GraduationCap,
      color: '#F59E0B',
      gradient: 'from-[#F59E0B] to-[#B45309]',
      stats: [
        { label: isEn ? 'Students' : 'طلاب', value: '3,200' },
        { label: isEn ? 'Courses' : 'دورات', value: '48' },
        { label: isEn ? 'Revenue' : 'إيرادات', value: '750K' },
      ],
      items: [
        { text: isEn ? 'AI Basics — Active' : 'أساسيات AI — نشط', status: 'active' },
        { text: isEn ? 'Design Course' : 'دورة التصميم', status: 'pending' },
        { text: isEn ? 'Excel Mastery' : 'احتراف Excel', status: 'completed' },
      ],
    },
    {
      id: 'retail',
      label: isEn ? 'Retail Dashboard' : 'داشبورد التجزئة',
      icon: ShoppingBag,
      color: '#EC4899',
      gradient: 'from-[#EC4899] to-[#9D174D]',
      stats: [
        { label: isEn ? 'Products' : 'منتجات', value: '1,850' },
        { label: isEn ? 'Orders' : 'طلبات', value: '342' },
        { label: isEn ? 'Revenue' : 'إيرادات', value: '2.1M' },
      ],
      items: [
        { text: isEn ? 'Order #4521 — Ship' : 'طلب #4521 — شحن', status: 'active' },
        { text: isEn ? 'Restock Alert' : 'تنبيه مخزون', status: 'pending' },
        { text: isEn ? 'Order #4520 Done' : 'طلب #4520 تم', status: 'completed' },
      ],
    },
    {
      id: 'hr',
      label: isEn ? 'HR Dashboard' : 'داشبورد الموارد البشرية',
      icon: Users,
      color: '#06B6D4',
      gradient: 'from-[#06B6D4] to-[#0E7490]',
      stats: [
        { label: isEn ? 'Employees' : 'موظفين', value: '248' },
        { label: isEn ? 'On Leave' : 'إجازة', value: '12' },
        { label: isEn ? 'Payroll' : 'رواتب', value: '1.4M' },
      ],
      items: [
        { text: isEn ? 'Ahmed — Review' : 'أحمد — تقييم أداء', status: 'active' },
        { text: isEn ? 'Sara — Leave Req' : 'سارة — طلب إجازة', status: 'pending' },
        { text: isEn ? 'Payroll Feb Sent' : 'رواتب فبراير تم', status: 'completed' },
      ],
    },
    {
      id: 'marketing',
      label: isEn ? 'Marketing Dashboard' : 'داشبورد التسويق',
      icon: TrendingUp,
      color: '#EF4444',
      gradient: 'from-[#EF4444] to-[#991B1B]',
      premium: true,
      stats: [
        { label: isEn ? 'Campaigns' : 'حملات', value: '32' },
        { label: isEn ? 'Leads' : 'عملاء', value: '1,450' },
        { label: isEn ? 'ROI' : 'عائد', value: '340%' },
      ],
      items: [
        { text: isEn ? 'Summer Campaign' : 'حملة الصيف', status: 'active' },
        { text: isEn ? 'Email Sequence' : 'سلسلة بريد', status: 'pending' },
        { text: isEn ? 'Q1 Campaign Done' : 'حملة Q1 مكتمل', status: 'completed' },
      ],
    },
    {
      id: 'events',
      label: isEn ? 'Events Dashboard' : 'داشبورد الفعاليات',
      icon: Calendar,
      color: '#7C3AED',
      gradient: 'from-[#7C3AED] to-[#4C1D95]',
      stats: [
        { label: isEn ? 'Events' : 'فعاليات', value: '18' },
        { label: isEn ? 'Guests' : 'ضيوف', value: '2,400' },
        { label: isEn ? 'Revenue' : 'إيرادات', value: '960K' },
      ],
      items: [
        { text: isEn ? 'Tech Summit 2026' : 'قمة التقنية 2026', status: 'active' },
        { text: isEn ? 'Gala Dinner' : 'حفل عشاء', status: 'pending' },
        { text: isEn ? 'Workshop Done' : 'ورشة عمل تم', status: 'completed' },
      ],
    },
    {
      id: 'finance',
      label: isEn ? 'Finance Dashboard' : 'داشبورد المالية',
      icon: Wallet,
      color: '#C8A86A',
      gradient: 'from-[#C8A86A] to-[#8B6914]',
      stats: [
        { label: isEn ? 'Transactions' : 'معاملات', value: '5,240' },
        { label: isEn ? 'Monthly' : 'الشهر', value: '1,850' },
        { label: isEn ? 'Revenue' : 'إيرادات', value: '8.6M' },
      ],
      items: [
        { text: isEn ? 'INV-1542 Paid' : 'فاتورة #1542 مدفوعة', status: 'completed' },
        { text: isEn ? 'INV-1543 Due' : 'فاتورة #1543 مستحقة', status: 'pending' },
        { text: isEn ? 'Transfer — Build' : 'تحويل — بناء', status: 'active' },
      ],
    },
  ];

  const statusColors: Record<string, string> = {
    active: '#D4AF37',
    pending: '#F59E0B',
    completed: '#3B5BFE',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Section Title */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Eye className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            {isEn ? 'Dashboard Previews' : 'نماذج الداشبوردات'}
          </span>
        </div>
        <h2 className="text-xl font-black text-[#1F3D2B]">
          {isEn ? '12 Industry Dashboards' : '12 داشبورد متخصص'}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {isEn ? 'Each industry gets a tailored AI-powered workspace' : 'كل صناعة تحصل على مساحة عمل مخصصة مدعومة بالذكاء الاصطناعي'}
        </p>
      </div>

      {/* Horizontal Scrolling Dashboard Previews */}
      <div className="flex gap-4 overflow-x-auto pb-4 px-5 scrollbar-hide snap-x snap-mandatory">
        {dashboardPreviews.map((dash, idx) => {
          const Icon = dash.icon;
          return (
            <motion.div
              key={dash.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="flex-shrink-0 w-[78%] max-w-[300px] snap-center"
            >
              <div className="bg-[#1a1d24] rounded-[28px] overflow-hidden shadow-xl border-[3px] border-gray-700/50" style={{ minHeight: 420 }}>
                {/* Phone Status Bar Mock */}
                <div className="flex items-center justify-between px-5 pt-3 pb-1">
                  <span className="text-white/40 text-[10px] font-bold">9:41</span>
                  <div className="w-20 h-5 bg-black rounded-full" />
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border border-white/30 rounded-sm" />
                    <div className="w-4 h-2 border border-white/30 rounded-sm relative">
                      <div className="absolute inset-0.5 bg-[#D4AF37] rounded-[1px]" style={{ width: '60%' }} />
                    </div>
                  </div>
                </div>

                {/* Dashboard Header */}
                <div className={`mx-3 mt-2 rounded-2xl bg-gradient-to-l ${dash.gradient} p-3.5`}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {dash.label}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-white/60" />
                        <span className="text-white/60 text-[9px]">AI Powered</span>
                        {dash.premium && (
                          <span className="bg-white/20 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold mr-1">PRO</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2">
                    {dash.stats.map((stat, si) => (
                      <div key={si} className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
                        <div className="text-white text-lg font-black" style={{ fontFamily: 'Cairo, sans-serif' }}>{stat.value}</div>
                        <div className="text-white/50 text-[9px] font-semibold">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart Mock */}
                <div className="mx-3 mt-3 bg-white/5 rounded-2xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/50 text-[10px] font-bold">{isEn ? 'Analytics' : 'التحليلات'}</span>
                    <BarChart3 className="w-3.5 h-3.5 text-white/30" />
                  </div>
                  <div className="flex items-end gap-1 h-12">
                    {[35, 55, 40, 70, 50, 80, 60, 90, 45, 75, 65, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm"
                        style={{
                          height: `${h}%`,
                          background: i === 7 ? dash.color : `${dash.color}40`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mx-3 mt-3 bg-white/5 rounded-2xl p-3">
                  <span className="text-white/50 text-[10px] font-bold block mb-2">{isEn ? 'Recent' : 'الأير'}</span>
                  <div className="space-y-2">
                    {dash.items.map((item, ii) => (
                      <div key={ii} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: statusColors[item.status] }}
                        />
                        <span className="text-white/70 text-[11px] flex-1 truncate" style={{ fontFamily: 'Cairo, sans-serif' }}>{item.text}</span>
                        <span
                          className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: `${statusColors[item.status]}20`, color: statusColors[item.status] }}
                        >
                          {item.status === 'active' ? (isEn ? 'Active' : 'نشط') : item.status === 'pending' ? (isEn ? 'Pending' : 'معلق') : (isEn ? 'Done' : 'مكتمل')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Nav Mock */}
                <div className="mx-3 mt-3 mb-3 bg-white/5 rounded-2xl p-2.5 flex items-center justify-around">
                  {[Home, BarChart3, FolderKanban, Users, Wallet].map((NavIcon, ni) => (
                    <div key={ni} className={`p-1.5 rounded-xl ${ni === 1 ? 'bg-white/10' : ''}`}>
                      <NavIcon className={`w-4 h-4 ${ni === 1 ? 'text-white' : 'text-white/30'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dashboard types grid below */}
      <div className="px-5 mt-2">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Building2, text: isEn ? 'Real Estate' : 'عقارات', color: '#3B5BFE' },
              { icon: FolderKanban, text: isEn ? 'Contracting' : 'مقاولات', color: '#D4AF37' },
              { icon: SprayCan, text: isEn ? 'Cleaning' : 'نظافة', color: '#0891B2' },
              { icon: Paintbrush, text: isEn ? 'Design' : 'تصميم', color: '#8B5CF6' },
              { icon: Stethoscope, text: isEn ? 'Health' : 'صحة', color: '#8D6E63' },
              { icon: Scale, text: isEn ? 'Legal' : 'قانوني', color: '#1E3A8A' },
              { icon: GraduationCap, text: isEn ? 'Education' : 'تعليم', color: '#F59E0B' },
              { icon: ShoppingBag, text: isEn ? 'Retail' : 'تجزئة', color: '#EC4899' },
              { icon: Users, text: isEn ? 'HR' : 'موارد', color: '#06B6D4' },
              { icon: TrendingUp, text: isEn ? 'Marketing' : 'تسويق', color: '#EF4444' },
              { icon: Calendar, text: isEn ? 'Events' : 'فعاليات', color: '#7C3AED' },
              { icon: Wallet, text: isEn ? 'Finance' : 'مالية', color: '#C8A86A' },
            ].map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-1" style={{ backgroundColor: `${item.color}12` }}>
                    <ItemIcon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div className="text-[10px] font-bold text-[#1F3D2B]">{item.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// 4. Browser vs App
// ═══════════════════════════════════════════════════════════
function BrowserVsApp() {
  const { language } = useTranslation('common');
  const isEn = language === 'en';

  const browserFeatures = [
    isEn ? 'Browse services' : 'تصفح الخدمات',
    isEn ? 'View provider profiles' : 'عرض ملفات المزودين',
    isEn ? 'Read reviews' : 'قراءة التقييمات',
    isEn ? 'Browse store' : 'تصفح المتجر',
    isEn ? 'Contact providers' : 'التواصل مع المزودين',
  ];

  const appFeatures = [
    isEn ? 'Everything in browser +' : 'كل مميزات المتصفح +',
    isEn ? 'AI Video Creator' : 'Weyaak Video Creator',
    isEn ? 'Full Project Management' : 'إدارة المشاريع الكاملة',
    isEn ? 'Financial Center' : 'المركز المالي',
    isEn ? 'Team Management' : 'إدارة الفريق',
    isEn ? 'AR & 3D Experience' : 'تجربة AR و 3D',
    isEn ? 'Dar Coins & Wallet' : 'كوينز الدار والمحفظة',
    isEn ? 'Smart Notifications' : 'إشعارات ذكية',
    isEn ? 'Offline Support' : 'دعم بدون إنترنت',
  ];

  return (
    <div className="mx-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5"
      >
        <h2 className="text-xl font-black text-[#1F3D2B] mb-1">
          {isEn ? 'Browser vs App' : 'المتصفح مقابل التطبيق'}
        </h2>
        <p className="text-xs text-gray-500">
          {isEn ? 'See what you unlock with the full app' : 'شاهد ما تفتحه مع التطبيق الكامل'}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {/* Browser */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-gray-400" />
            <span className="font-bold text-sm text-gray-600">
              {isEn ? 'Browser' : 'المتصفح'}
            </span>
          </div>
          <div className="text-xs text-gray-400 mb-3 font-semibold">
            {isEn ? '"Welcome to Al Dar"' : '"مرحباً بك في الدار"'}
          </div>
          <div className="space-y-2">
            {browserFeatures.map((f, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-[11px] text-gray-500">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* App */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-4 shadow-md border-2 border-[#D4AF37]/30 relative overflow-hidden"
        >
          {/* Subtle gold accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-[#D4AF37] to-[#1F3D2B]" />
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-bold text-sm text-[#1F3D2B]">
              {isEn ? 'Mobile App' : 'التطبيق'}
            </span>
          </div>
          <div className="text-xs text-[#C8A86A] mb-3 font-semibold flex items-center gap-1">
            <Crown className="w-3 h-3" />
            {isEn ? 'Full Experience' : 'التجربة الكاملة'}
          </div>
          <div className="space-y-2">
            {appFeatures.map((f, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${idx === 0 ? 'text-[#C8A86A]' : 'text-[#D4AF37]'}`} />
                <span className={`text-[11px] ${idx === 0 ? 'text-[#C8A86A] font-bold' : 'text-[#1F3D2B]/60'}`}>{f}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 4.5. How Platform Works — Full Roadmap
// ═══════════════════════════════════════════════════════════
function PlatformRoadmapSection({ isEn }: { isEn: boolean }) {
  return (
    <div className="mx-5 pb-6">
      <PlatformRoadmap isEn={isEn} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 4.6. Quote Automation Workflow
// ═══════════════════════════════════════════════════════════
function AutomationWorkflowSection({ isEn }: { isEn: boolean }) {
  return (
    <div className="mx-5 pb-6">
      <AutomationWorkflow isEn={isEn} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// 4.7. Contract Details
// ═══════════════════════════════════════════════════════════
function ContractDetailsSection({ isEn }: { isEn: boolean }) {
  return (
    <div className="mx-5 pb-6">
      <ContractDetails isEn={isEn} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// 4.8. Smart Tools & Templates Gallery
// ═══════════════════════════════════════════════════════════
function SmartToolsGallerySection({ isEn }: { isEn: boolean }) {
  return (
    <div className="mx-5 pb-6">
      <SmartToolsGallery isEn={isEn} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 5. PROVIDER JOURNEY
// ═════════════���═════════════════════════════════════════════
function ProviderJourney() {
  const { language } = useTranslation('common');
  const isEn = language === 'en';

  const steps = [
    { icon: '📲', title: isEn ? 'Download' : 'حمّل التطبيق', desc: isEn ? 'Get the app free' : 'مجاناً من لمتجر', color: '#3498DB' },
    { icon: '📋', title: isEn ? 'Register' : 'سجّل حسابك', desc: isEn ? 'Quick sign up' : 'تسجيل سريع', color: '#9B59B6' },
    { icon: '✅', title: isEn ? 'Get Verified' : 'احصل على التوثيق', desc: isEn ? 'Upload documents' : 'ارفع وثائقك', color: '#D4AF37' },
    { icon: '📂', title: isEn ? 'Build Portfolio' : 'أنشئ معرضك', desc: isEn ? 'Show your work' : 'اعرض أعمالك', color: '#E67E22' },
    { icon: '📣', title: isEn ? 'Get Clients' : 'استقبل العملاء', desc: isEn ? 'Start earning' : 'ابدأ الكسب', color: '#C8A86A' },
    { icon: '🚀', title: isEn ? 'Grow' : 'نمو وتوسع', desc: isEn ? 'Scale your business' : 'وسّع أعمالك', color: '#1F3D2B' },
  ];

  return (
    <div className="mx-5">
      <div className="text-center mb-5">
        <h2 className="text-xl font-black text-[#1F3D2B] mb-1">
          {isEn ? 'Your Journey with Beit Al Reef' : 'رحلتك مع بيت الريف'}
        </h2>
        <p className="text-xs text-gray-500">
          {isEn ? 'From sign up to business growth' : 'من التسجيل إلى تنمية أعمالك'}
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-5 right-5 bottom-5 w-0.5 bg-gradient-to-b from-[#3498DB] via-[#D4AF37] to-[#1F3D2B] rounded-full" />

        <div className="space-y-4">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-4 relative"
            >
              {/* Circle */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg z-10 text-lg"
                style={{ backgroundColor: step.color }}
              >
                {step.icon}
              </div>

              {/* Content */}
              <div className="flex-1 bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100">
                <h4 className="text-sm font-bold text-[#1F3D2B]">{step.title}</h4>
                <p className="text-[10px] text-gray-500">{step.desc}</p>
              </div>

              {/* Step number */}
              <div className="text-3xl font-black text-gray-100 flex-shrink-0 w-8 text-center">
                {idx + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// 6. FINAL CTA
// ═══════════════════════════════════════════════════════════
function FinalCTA() {
  const { language } = useTranslation('common');
  const isEn = language === 'en';

  return (
    <div className="mx-5 mb-10">
      <div className="bg-white rounded-3xl p-6 text-center shadow-md relative overflow-hidden border border-[#E6DCC8]">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C8A86A]/8 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="text-4xl mb-3">🏡</div>
          <h2 className="text-2xl font-black text-[#1F3D2B] mb-2">
            {isEn ? 'Ready to Start?' : 'جاهز تبدأ؟'}
          </h2>
          <p className="text-[#1F3D2B]/50 text-sm mb-5 max-w-xs mx-auto">
            {isEn 
              ? 'Join thousands of providers and clients on Beit Al Reef'
              : 'انضم لآلاف المزودين والعملاء على بيت الريف'
            }
          </p>

          <div className="flex flex-col gap-3">
            <button 
              onClick={triggerPWAInstall}
              className="w-full bg-gradient-to-l from-[#D4AF37] to-[#1F3D2B] text-white py-4 rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              {isEn ? 'Download Beit Al Reef App' : 'حمّل تطبيق بيت الريف'}
            </button>
            <button className="w-full bg-[#F5EEE1] border border-[#E6DCC8] text-[#1F3D2B] py-3.5 rounded-2xl font-bold text-sm hover:bg-[#F5EEE1]/80 transition-all flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
              {isEn ? 'Contact Us' : 'تواصل معنا'}
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {['😊', '👷', '👨‍💼', '👩‍🔧'].map((e, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-[#F5EEE1] border-2 border-white flex items-center justify-center text-sm shadow-sm">
                  {e}
                </div>
              ))}
            </div>
            <p className="text-xs text-[#1F3D2B]/40">
              {isEn ? '+2,500 joined this month' : '+2,500 انضموا هذا الشهر'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export function PlatformShowcase({ onBack }: PlatformShowcaseProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('ai-tools');
  const { language } = useTranslation('common');
  const isEn = language === 'en';

  return (
    <div className="min-h-screen bg-[#F5EEE1] pb-20">
      {/* Back Button - Floating */}
      {onBack && (
        <button
          onClick={onBack}
          className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-[#1F3D2B]" />
        </button>
      )}

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. AI Video Creator Spotlight */}
      <div className="py-6">
        <AIVideoSpotlight />
      </div>

      {/* 3. Feature Categories */}
      <div className="px-5 pb-6">
        <div className="text-center mb-5">
          <h2 className="text-xl font-black text-[#1F3D2B] mb-1">
            {isEn ? 'Platform Features' : 'مميزات المنصة'}
          </h2>
          <p className="text-xs text-gray-500">
            {isEn ? 'Tap any category to explore' : 'اضغط على أي قسم لاستكشافه'}
          </p>
        </div>

        <div className="space-y-3">
          {FEATURE_CATEGORIES.map((category, idx) => (
            <FeatureCategoryCard
              key={category.id}
              category={category}
              isExpanded={expandedCategory === category.id}
              onToggle={() => setExpandedCategory(
                expandedCategory === category.id ? null : category.id
              )}
              index={idx}
            />
          ))}
        </div>
      </div>

      {/* 4. Browser vs App */}
      <div className="pb-6">
        <BrowserVsApp />
      </div>

      {/* 4.5. How Platform Works — Full Roadmap */}
      <PlatformRoadmapSection isEn={isEn} />

      {/* 4.6. Quote Automation Workflow */}
      <AutomationWorkflowSection isEn={isEn} />

      {/* 4.7. Contract Details */}
      <ContractDetailsSection isEn={isEn} />

      {/* 4.8. Smart Tools & Templates Gallery */}
      <SmartToolsGallerySection isEn={isEn} />

      {/* 5. Provider Journey */}
      <div className="pb-6">
        <ProviderJourney />
      </div>

      {/* 6. Final CTA */}
      <FinalCTA />
    </div>
  );
}