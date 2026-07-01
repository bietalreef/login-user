import { useState, useMemo, Component, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Search, X, Sparkles, FileText, Calculator, Paintbrush, Megaphone, ArrowLeft, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Icon3D, TOOL_ICONS } from '../ui/Icon3D';

// Tools — static imports
import { MaterialCalculatorV2 } from './tools/MaterialCalculatorV2';
import { PaintFlooringCalc } from './tools/PaintFlooringCalc';
import { CostEstimatorTool } from './tools/CostEstimatorTool';
import { QuoteGeneratorTool } from './tools/QuoteGeneratorTool';
import { MarketingContentTool } from './tools/MarketingContentTool';
import { ContractGeneratorTool } from './tools/ContractGeneratorTool';
import { InvoiceGeneratorTool } from './tools/InvoiceGeneratorTool';
import { SocialMediaManager } from './tools/SocialMediaManager';
import { ColorPaletteTool } from './tools/ColorPaletteTool';
import { LightingCalcTool } from './tools/LightingCalcTool';
import { RoomLayoutTool } from './tools/RoomLayoutTool';
import { Design2DTool } from './tools/Design2DTool';
import { Design3DTool } from './tools/Design3DTool';
import { Convert2Dto3DTool } from './tools/Convert2Dto3DTool';
import { AIVideoCreatorTool } from './tools/AIVideoCreatorTool';
import { AILogoCreatorTool } from './tools/AILogoCreatorTool';

type ActiveTool = null
  | 'materials' | 'paint' | 'cost'
  | 'quote' | 'marketing' | 'contract' | 'invoice'
  | 'social-media'
  | 'color-palette' | 'lighting' | 'room-layout'
  | 'design-2d' | 'design-3d' | 'convert-2d-3d'
  | 'video-creator' | 'logo-creator';

type Category = 'all' | 'documents' | 'calculators' | 'design' | 'marketing';

interface ToolDef {
  id: ActiveTool;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  category: Category;
  badgeAr?: string;
  badgeEn?: string;
}

const CATEGORIES: { id: Category; ar: string; en: string; icon: any; color: string }[] = [
  { id: 'all', ar: 'الكل', en: 'All', icon: Sparkles, color: '#D4AF37' },
  { id: 'documents', ar: 'المستندات', en: 'Documents', icon: FileText, color: '#5B9CF6' },
  { id: 'calculators', ar: 'الحاسبات', en: 'Calculators', icon: Calculator, color: '#4ECDC4' },
  { id: 'design', ar: 'التصميم', en: 'Design', icon: Paintbrush, color: '#9B7AED' },
  { id: 'marketing', ar: 'التسويق', en: 'Marketing', icon: Megaphone, color: '#FF8AAE' },
];

// ═══════════════════════════════════════════════
// ترتيب الأدوات حسب الأهمية — الأهم أولاً
// ═══════════════════════════════════════════════
const ALL_TOOLS: ToolDef[] = [
  // Documents
  {
    id: 'quote',
    titleAr: 'مولّد عروض الأسعار',
    titleEn: 'Quotation Generator',
    subtitleAr: 'عرض سعر احترافي A4 جاهز للطباعة',
    subtitleEn: 'Professional A4 quotation ready to print',
    category: 'documents',
    badgeAr: 'مطوّر',
    badgeEn: 'Enhanced',
  },
  {
    id: 'invoice',
    titleAr: 'مولّد الفواتير',
    titleEn: 'Invoice Generator',
    subtitleAr: 'فواتير ضريبية احترافية بضغطة واحدة',
    subtitleEn: 'Professional tax invoices in one click',
    category: 'documents',
    badgeAr: 'جديد',
    badgeEn: 'New',
  },
  {
    id: 'contract',
    titleAr: 'مولّد العقود',
    titleEn: 'Contract Generator',
    subtitleAr: 'عقود صيانة وبناء واستشارات',
    subtitleEn: 'Maintenance, construction & consulting',
    category: 'documents',
    badgeAr: 'مطوّر',
    badgeEn: 'Enhanced',
  },
  // Calculators
  {
    id: 'materials',
    titleAr: 'حاسبة مواد البناء',
    titleEn: 'Materials Calculator',
    subtitleAr: 'كميات وتكاليف تقديرية دقيقة',
    subtitleEn: 'Accurate quantities & cost estimates',
    category: 'calculators',
    badgeAr: 'الأكثر استخداماً',
    badgeEn: 'Most Used',
  },
  {
    id: 'cost',
    titleAr: 'مقدّر تكلفة البناء',
    titleEn: 'Cost Estimator',
    subtitleAr: 'ميزانية شاملة لمشروعك بالكامل',
    subtitleEn: 'Complete project budget breakdown',
    category: 'calculators',
  },
  {
    id: 'paint',
    titleAr: 'حاسبة الدهانات التفاعلية',
    titleEn: 'Interactive Paint Calculator',
    subtitleAr: 'ارسم غرفتك وأضف الأبواب والنوافذ بصرياً',
    subtitleEn: 'Draw rooms & add doors/windows visually',
    category: 'calculators',
    badgeAr: 'تفاعلي',
    badgeEn: 'Interactive',
  },
  {
    id: 'lighting',
    titleAr: 'حاسبة الإضاءة',
    titleEn: 'Lighting Calculator',
    subtitleAr: 'حساب الإضاءة المثالية لكل غرفة',
    subtitleEn: 'Calculate optimal room lighting',
    category: 'calculators',
  },
  // Design
  {
    id: 'design-2d',
    titleAr: 'تصميم ثنائي الأبعاد',
    titleEn: '2D Floor Plan Designer',
    subtitleAr: 'ارسم مخططات الغرف والجدران والأثاث',
    subtitleEn: 'Draw rooms, walls & furniture layouts',
    category: 'design',
    badgeAr: 'جديد',
    badgeEn: 'New',
  },
  {
    id: 'design-3d',
    titleAr: 'تصميم ثلاثي الأبعاد',
    titleEn: '3D Room Visualizer',
    subtitleAr: 'تصوّر الغرف بشكل ثلاثي واقعي',
    subtitleEn: 'Visualize rooms in realistic 3D',
    category: 'design',
    badgeAr: 'جديد',
    badgeEn: 'New',
  },
  {
    id: 'convert-2d-3d',
    titleAr: 'تحويل 2D إلى 3D',
    titleEn: '2D to 3D Converter',
    subtitleAr: 'حوّل المخططات لنماذج ثلاثية الأبعاد',
    subtitleEn: 'Convert floor plans to 3D models',
    category: 'design',
    badgeAr: 'جديد',
    badgeEn: 'New',
  },
  {
    id: 'room-layout',
    titleAr: 'تخطيط الغرفة',
    titleEn: 'Room Layout Planner',
    subtitleAr: 'صمم تخطيط غرفتك واحسب المساحات',
    subtitleEn: 'Design your room layout & calculate areas',
    category: 'design',
  },
  {
    id: 'color-palette',
    titleAr: 'لوحة الألوان',
    titleEn: 'Color Palette Designer',
    subtitleAr: 'اختر الألوان المثالية لكل غرفة',
    subtitleEn: 'Choose perfect colors for every room',
    category: 'design',
  },
  // Marketing
  {
    id: 'marketing',
    titleAr: 'مولّد المحتوى التسويقي',
    titleEn: 'Marketing Content Generator',
    subtitleAr: 'منشورات جاهزة للنشر على السوشيال',
    subtitleEn: 'Ready-to-publish social media posts',
    category: 'marketing',
  },
  {
    id: 'social-media',
    titleAr: 'مدير وسائل التواصل',
    titleEn: 'Social Media Manager',
    subtitleAr: 'إدارة حساباتك ومتابعة الأداء',
    subtitleEn: 'Manage accounts & track performance',
    category: 'marketing',
  },
  // AI Tools
  {
    id: 'video-creator',
    titleAr: 'إنشاء فيديوهات ذكية',
    titleEn: 'AI Video Creator',
    subtitleAr: 'إنشاء فيديوهات تعليمية وعروض تقديمية',
    subtitleEn: 'Create educational & presentation videos',
    category: 'design',
    badgeAr: 'جديد',
    badgeEn: 'New',
  },
  {
    id: 'logo-creator',
    titleAr: 'إنشاء شعارات ذكية',
    titleEn: 'AI Logo Creator',
    subtitleAr: 'تصميم شعارات فريدة ومبتكرة',
    subtitleEn: 'Design unique & creative logos',
    category: 'design',
    badgeAr: 'جديد',
    badgeEn: 'New',
  },
];

interface AIToolsDashboardProps {
  onFullscreenToggle?: (isFullscreen: boolean) => void;
  onBack?: () => void;
}

/* ── Tool Error Boundary — يمنع crash الأداة من تعطيل الداشبورد ── */
interface ToolErrorBoundaryProps {
  children: ReactNode;
  onBack: () => void;
  toolName: string;
}
interface ToolErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
class ToolErrorBoundary extends Component<ToolErrorBoundaryProps, ToolErrorBoundaryState> {
  constructor(props: ToolErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): ToolErrorBoundaryState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: any) {
    console.error(`❌ Tool Error [${this.props.toolName}]:`, error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6" dir="rtl">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
              حدث خطأ في الأداة
            </h3>
            <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {this.props.toolName}
            </p>
            <p className="text-xs text-gray-400 mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
              حدث خطأ أثناء تحميل هذه الأداة. جرّب مرة ثانية أو ارجع لقائمة الأدوات.
            </p>
            {this.state.error && (
              <details className="text-left mb-4 bg-red-50 border border-red-200 rounded-xl p-3">
                <summary className="cursor-pointer text-xs font-bold text-red-700 mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  تفاصيل تقنية
                </summary>
                <pre className="text-[10px] text-red-600 overflow-auto mt-1 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="flex-1 py-3 bg-[#D4AF37] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#B8940E] transition-colors"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                <RefreshCw className="w-4 h-4" />
                إعادة المحاولة
              </button>
              <button
                onClick={this.props.onBack}
                className="flex-1 py-3 bg-gray-100 text-[#1F3D2B] rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                <ArrowRight className="w-4 h-4" />
                رجوع
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function AIToolsDashboard({ onFullscreenToggle, onBack }: AIToolsDashboardProps) {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();
  const isEn = language === 'en';

  const handleBack = () => setActiveTool(null);

  // ══════════ Filtered tools (hooks MUST be before any early return) ══════════
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter(tool => {
      if (activeCategory !== 'all' && tool.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = isEn ? tool.titleEn.toLowerCase() : tool.titleAr;
        const subtitle = isEn ? tool.subtitleEn.toLowerCase() : tool.subtitleAr;
        if (!title.includes(q) && !subtitle.includes(q)) return false;
      }
      return true;
    });
  }, [activeCategory, searchQuery, isEn]);

  // Group tools by category for display
  const groupedTools = useMemo(() => {
    if (activeCategory !== 'all') return [{ category: activeCategory, tools: filteredTools }];
    const groups: { category: Category; tools: ToolDef[] }[] = [];
    const cats: Category[] = ['documents', 'calculators', 'design', 'marketing'];
    for (const cat of cats) {
      const tools = filteredTools.filter(t => t.category === cat);
      if (tools.length > 0) groups.push({ category: cat, tools });
    }
    return groups;
  }, [activeCategory, filteredTools]);

  const wrapTool = (toolName: string, component: ReactNode) => (
    <ToolErrorBoundary onBack={handleBack} toolName={toolName}>
      {component}
    </ToolErrorBoundary>
  );

  // ══════════ Route to individual tools ══════════
  if (activeTool === 'materials') return wrapTool('حاسبة مواد البناء', <MaterialCalculatorV2 onBack={handleBack} />);
  if (activeTool === 'paint') return wrapTool('حاسبة الدهانات', <PaintFlooringCalc onBack={handleBack} />);
  if (activeTool === 'cost') return wrapTool('مقدّر التكلفة', <CostEstimatorTool onBack={handleBack} />);
  if (activeTool === 'quote') return wrapTool('مولّد عروض الأسعار', <QuoteGeneratorTool onBack={handleBack} />);
  if (activeTool === 'invoice') return wrapTool('مولّد الفواتير', <InvoiceGeneratorTool onBack={handleBack} />);
  if (activeTool === 'marketing') return wrapTool('المحتوى التسويقي', <MarketingContentTool onBack={handleBack} />);
  if (activeTool === 'contract') return wrapTool('مولّد العقود', <ContractGeneratorTool onBack={handleBack} />);
  if (activeTool === 'social-media') return wrapTool('مد��ر التواصل', <SocialMediaManager onBack={handleBack} />);
  if (activeTool === 'color-palette') return wrapTool('لوحة الألوان', <ColorPaletteTool onBack={handleBack} />);
  if (activeTool === 'lighting') return wrapTool('حاسبة الإضاءة', <LightingCalcTool onBack={handleBack} />);
  if (activeTool === 'room-layout') return wrapTool('تخطيط الغرفة', <RoomLayoutTool onBack={handleBack} />);
  if (activeTool === 'design-2d') return wrapTool('تصميم 2D', <Design2DTool onBack={handleBack} />);
  if (activeTool === 'design-3d') return wrapTool('تصميم 3D', <Design3DTool onBack={handleBack} />);
  if (activeTool === 'convert-2d-3d') return wrapTool('تحويل 2D→3D', <Convert2Dto3DTool onBack={handleBack} />);
  if (activeTool === 'video-creator') return wrapTool('إنشاء فيديوهات ذكية', <AIVideoCreatorTool onBack={handleBack} />);
  if (activeTool === 'logo-creator') return wrapTool('إنشاء شعارات ذكية', <AILogoCreatorTool onBack={handleBack} />);

  // ══════════ Main Dashboard ══════════
  return (
    <div className="min-h-screen bg-background pb-32" dir="rtl">

      {/* Page Header */}
      <div className="bg-gradient-to-l from-[#1F3D2B] to-[#D4AF37] px-5 pt-8 pb-14 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 -right-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute top-20 right-1/4 w-60 h-60 bg-white/3 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Icon3D icon={Sparkles} theme="gold" size="md" hoverable={false} />
              <div>
                <h1 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '24px' }}>
                  {isEn ? 'Smart Tools' : 'الأدوات الذكية'}
                </h1>
                <p className="text-white/60 text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500 }}>
                  {isEn ? 'Real tools with instant results' : 'أدوات حقيقية بنتائج فورية'}
                </p>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <span className="text-white/90 text-xs font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {ALL_TOOLS.length} {isEn ? 'tools' : 'أداة'}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4.5 h-4.5 text-white/40" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search tools...' : 'ابحث عن أدا...'}
              className="w-full ps-11 pe-10 py-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 end-3">
                <X className="w-4 h-4 text-white/40 hover:text-white/70 transition-colors" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Tabs - overlapping header */}
      <div className="px-4 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-1.5 flex gap-1 border border-gray-100/80 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => {
            const CatIcon = cat.icon;
            const isActive = activeCategory === cat.id;
            const count = cat.id === 'all' ? ALL_TOOLS.length : ALL_TOOLS.filter(t => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex-1 min-w-0 py-2.5 px-2 rounded-xl text-[11px] transition-all flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 700,
                  backgroundColor: isActive ? cat.color : undefined,
                }}
              >
                <CatIcon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} style={{ color: isActive ? undefined : cat.color }} />
                <span className="truncate">{isEn ? cat.en : cat.ar}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="px-4 mt-5 relative z-10">
        <AnimatePresence mode="wait">
          {filteredTools.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {isEn ? 'No tools found' : 'لا توجد أدوات'}
              </p>
              <p className="text-gray-300 text-xs mt-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {isEn ? 'Try a different search term' : 'جرب كلمة بحث مختلفة'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {groupedTools.map(group => {
                const catData = CATEGORIES.find(c => c.id === group.category);
                return (
                  <div key={group.category}>
                    {/* Category Title (only in 'all' view) */}
                    {activeCategory === 'all' && catData && (
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${catData.color}15` }}>
                          <catData.icon className="w-4 h-4" style={{ color: catData.color }} />
                        </div>
                        <h3 className="text-[#1A1A1A] font-bold text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          {isEn ? catData.en : catData.ar}
                        </h3>
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-[10px] text-gray-400 font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          {group.tools.length}
                        </span>
                      </div>
                    )}

                    {/* Tools Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {group.tools.map((tool, index) => {
                        const badge = isEn ? tool.badgeEn : tool.badgeAr;
                        const toolIcon = TOOL_ICONS[tool.id as string];
                        return (
                          <motion.button
                            key={tool.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            onClick={() => setActiveTool(tool.id)}
                            className="bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100/80 hover:shadow-lg hover:border-[#D4AF37]/20 transition-all group active:scale-[0.97] flex flex-col items-center text-center relative overflow-hidden"
                          >
                            {/* Hover glow */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/3 group-hover:to-[#D4AF37]/6 transition-all duration-300 rounded-[20px]" />

                            {/* Badge */}
                            {badge && (
                              <span className={`absolute top-2.5 left-2.5 text-[8px] font-bold px-2 py-0.5 rounded-full z-10 ${
                                badge === 'جديد' || badge === 'New' ? 'bg-amber-100 text-amber-700' :
                                badge === 'الأكثر استخداماً' || badge === 'Most Used' ? 'bg-amber-100 text-amber-700' :
                                badge === 'مطوّر' || badge === 'Enhanced' ? 'bg-blue-100 text-blue-700' :
                                badge === 'تفاعلي' || badge === 'Interactive' ? 'bg-purple-100 text-purple-700' :
                                'bg-gray-100 text-gray-600'
                              }`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                                {badge}
                              </span>
                            )}

                            {/* Icon */}
                            <div className="mb-3 relative group-hover:scale-110 transition-transform duration-300">
                              {toolIcon ? (
                                <Icon3D
                                  icon={toolIcon.icon}
                                  theme={toolIcon.theme}
                                  size="lg"
                                  hoverable={false}
                                />
                              ) : (
                                <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#1F3D2B] rounded-2xl flex items-center justify-center shadow-lg">
                                  <Sparkles className="w-7 h-7 text-white" />
                                </div>
                              )}
                            </div>

                            {/* Title */}
                            <h4 className="font-bold text-[12px] text-[#1A1A1A] leading-tight mb-1 line-clamp-2 min-h-[32px] flex items-center relative z-10"
                              style={{ fontFamily: 'Cairo, sans-serif' }}>
                              {isEn ? tool.titleEn : tool.titleAr}
                            </h4>

                            {/* Subtitle */}
                            <p className="text-[10px] text-gray-400 leading-tight line-clamp-2 relative z-10"
                              style={{ fontFamily: 'Cairo, sans-serif' }}>
                              {isEn ? tool.subtitleEn : tool.subtitleAr}
                            </p>

                            {/* Bottom accent line */}
                            <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/0 to-transparent group-hover:via-[#D4AF37]/40 transition-all duration-500 rounded-full" />
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Tip */}
      <div className="px-4 mt-8">
        <div className="bg-gradient-to-l from-[#F5EEE1] to-[#FFF8F0] rounded-[20px] p-5 border border-[#E8DCC8]">
          <div className="flex items-start gap-3">
            <Icon3D icon={TOOL_ICONS['lighting'].icon} theme="amber" size="md" hoverable={false} />
            <div>
              <h4 className="font-bold text-sm text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {isEn ? 'Beit Al Reef Tip' : 'نصيحة بيت الريف'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {isEn
                  ? 'All tools work fully and give you instant results. Copy results or share them via WhatsApp directly. Print as PDF for professional A4 documents.'
                  : 'جميع الأدوات تعمل بشكل كامل وتعطيك نتائج فورية. يمكنك نسخ النتائج أو مشاركتها عبر واتساب مباشرة. اطبع كـ PDF للحصول على مستندات A4 احترافية.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}