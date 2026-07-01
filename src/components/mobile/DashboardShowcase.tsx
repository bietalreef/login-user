/**
 * DashboardShowcase.tsx — عرض جميع داشبوردات بيت الريف
 * ════════════════════════════════════════════════════════
 * دائرة أفقية واحدة بكروت ثلاثية الأبعاد احترافية
 * تعرض جميع قوالب الداشبورد (11 داشبورد) مع المواصفات
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2, Paintbrush, FileText, Stethoscope, Scale, GraduationCap,
  ShoppingCart, Users, TrendingUp, Calendar, BarChart2, ChevronRight,
  ArrowLeft, Sparkles, Zap, Award, Star, Package, Briefcase,
  Home, DollarSign, Clock, Download, Eye, Layers,
  Wallet, Shield, Target, Cpu, ChevronLeft,
  Droplets, CheckCircle, Flame
} from 'lucide-react';
// Crown, ShoppingBag, CheckCircle2 not available — using safe aliases
const Crown = Award;
const ShoppingBag = ShoppingCart;
const CheckCircle2 = CheckCircle;
// FolderKanban, SprayCan, Rocket, BarChart3 not available
const FolderKanban = Layers;
const SprayCan = Droplets;
const Rocket = Flame;
const BarChart3 = BarChart2;
import { DASHBOARD_DATA } from './dashboardData';
import { triggerPWAInstall } from './InstallPWAPrompt';
import { DocumentsToolsSection } from './DocumentsToolsSection';
import COMPLETE_DASHBOARD_DATA from './dashboardData_complete';
import { ProfilePreview } from './ProfilePreview';
import { Icon3D } from '../ui/Icon3D';

const fontCairo = 'Cairo, sans-serif';

interface DashboardTemplate {
  id: string;
  name_ar: string;
  name_en: string;
  desc_ar: string;
  desc_en: string;
  icon: any;
  icon3dTheme: string;
  color: string;
  gradient: string;
  premium?: boolean;
  features_ar: string[];
  features_en: string[];
  modules_ar: string;
  modules_en: string;
}

const DASHBOARDS: DashboardTemplate[] = [
  {
    id: 'real_estate',
    name_ar: 'العقارات',
    name_en: 'Real Estate',
    desc_ar: 'إدارة عقارات، مستأجرين، وعقود الإيجار',
    desc_en: 'Manage properties, tenants, and leases',
    icon: Building2,
    icon3dTheme: 'blue',
    color: '#3B5BFE',
    gradient: 'from-[#3B5BFE] to-[#5A78FF]',
    features_ar: ['إدارة الوحدات العقارية', 'عقود الإيجار الذكية', 'تحصيل الإيجارات', 'تقارير مالية شاملة'],
    features_en: ['Property unit management', 'Smart lease contracts', 'Rent collection', 'Financial reports'],
    modules_ar: '12 وحدة',
    modules_en: '12 Modules',
  },
  {
    id: 'contracting',
    name_ar: 'المقاولات',
    name_en: 'Contracting',
    desc_ar: 'مشاريع، مناقصات، وإدارة فرق العمل',
    desc_en: 'Projects, bids, and team management',
    icon: FolderKanban,
    icon3dTheme: 'gold',
    color: '#D4AF37',
    gradient: 'from-[#D4AF37] to-[#FFD700]',
    premium: true,
    features_ar: ['إدارة المشاريع الذكية', 'نظام المناقصات', 'جدولة الفرق', 'تتبع التكاليف'],
    features_en: ['Smart project management', 'Bidding system', 'Team scheduling', 'Cost tracking'],
    modules_ar: '15 وحدة',
    modules_en: '15 Modules',
  },
  {
    id: 'interior',
    name_ar: 'التصميم الداخلي',
    name_en: 'Interior Design',
    desc_ar: 'مشاريع تصميم، عملاء، وملفات إبداعية',
    desc_en: 'Design projects, clients, portfolios',
    icon: Paintbrush,
    icon3dTheme: 'purple',
    color: '#8B5CF6',
    gradient: 'from-[#8B5CF6] to-[#A78BFA]',
    features_ar: ['معرض الأعمال الرقمي', 'إدارة العملاء', 'لوحات الإلهام', 'عروض الأسعار'],
    features_en: ['Digital portfolio', 'Client management', 'Mood boards', 'Price quotations'],
    modules_ar: '10 وحدات',
    modules_en: '10 Modules',
  },
  {
    id: 'healthcare',
    name_ar: 'الرعاية الصحية',
    name_en: 'Healthcare',
    desc_ar: 'مرضى، مواعيد، وملفات طبية',
    desc_en: 'Patients, appointments, medical records',
    icon: Stethoscope,
    icon3dTheme: 'brown',
    color: '#8D6E63',
    gradient: 'from-[#8D6E63] to-[#A1887F]',
    features_ar: ['سجلات المرضى', 'جدولة المواعيد', 'الوصفات الإلكترونية', 'الفوترة الطبية'],
    features_en: ['Patient records', 'Appointment scheduling', 'E-prescriptions', 'Medical billing'],
    modules_ar: '14 وحدة',
    modules_en: '14 Modules',
  },
  {
    id: 'legal',
    name_ar: 'الخدمات القانونية',
    name_en: 'Legal Services',
    desc_ar: 'قضايا، عملاء، ومواعيد محكمة',
    desc_en: 'Cases, clients, court dates',
    icon: Scale,
    icon3dTheme: 'indigo',
    color: '#1E3A8A',
    gradient: 'from-[#1E3A8A] to-[#3B82F6]',
    features_ar: ['إدارة القضايا', 'متابعة الجلسات', 'أرشيف المستندات', 'فواتير الأتعاب'],
    features_en: ['Case management', 'Session tracking', 'Document archive', 'Fee invoicing'],
    modules_ar: '11 وحدة',
    modules_en: '11 Modules',
  },
  {
    id: 'education',
    name_ar: 'التعليم',
    name_en: 'Education',
    desc_ar: 'طلاب، دورات، ونتائج الاختبارات',
    desc_en: 'Students, courses, exam results',
    icon: GraduationCap,
    icon3dTheme: 'amber',
    color: '#F59E0B',
    gradient: 'from-[#F59E0B] to-[#FBBF24]',
    features_ar: ['سجلات الطلاب', 'إدارة الدورات', 'نظام الاختبارات', 'شهادات إلكترونية'],
    features_en: ['Student records', 'Course management', 'Exam system', 'Digital certificates'],
    modules_ar: '13 وحدة',
    modules_en: '13 Modules',
  },
  {
    id: 'retail',
    name_ar: 'التجزئة',
    name_en: 'Retail',
    desc_ar: 'مبيعات، مخزون، وعملاء',
    desc_en: 'Sales, inventory, customers',
    icon: ShoppingBag,
    icon3dTheme: 'pink',
    color: '#EC4899',
    gradient: 'from-[#EC4899] to-[#F472B6]',
    features_ar: ['نقاط البيع POS', 'إدارة المخزون', 'برنامج الولاء', 'تقارير المبيعات'],
    features_en: ['POS system', 'Inventory management', 'Loyalty program', 'Sales reports'],
    modules_ar: '12 وحدة',
    modules_en: '12 Modules',
  },
  {
    id: 'hr',
    name_ar: 'الموارد البشرية',
    name_en: 'Human Resources',
    desc_ar: 'موظفين، رواتب، وإجازات',
    desc_en: 'Employees, payroll, leaves',
    icon: Users,
    icon3dTheme: 'cyan',
    color: '#06B6D4',
    gradient: 'from-[#06B6D4] to-[#22D3EE]',
    features_ar: ['ملفات الموظفين', 'مسيّر الرواتب', 'إدارة الإجازات', 'تقييم الأداء'],
    features_en: ['Employee profiles', 'Payroll system', 'Leave management', 'Performance review'],
    modules_ar: '14 وحدة',
    modules_en: '14 Modules',
  },
  {
    id: 'marketing',
    name_ar: 'التسويق',
    name_en: 'Marketing',
    desc_ar: 'حملات، عملاء محتملين، وتحليلات',
    desc_en: 'Campaigns, leads, analytics',
    icon: TrendingUp,
    icon3dTheme: 'red',
    color: '#EF4444',
    gradient: 'from-[#EF4444] to-[#F87171]',
    premium: true,
    features_ar: ['إدارة الحملات', 'تتبع العملاء المحتملين', 'تحليلات متقدمة', 'أتمتة التسويق'],
    features_en: ['Campaign management', 'Lead tracking', 'Advanced analytics', 'Marketing automation'],
    modules_ar: '13 وحدة',
    modules_en: '13 Modules',
  },
  {
    id: 'events',
    name_ar: 'الفعاليات',
    name_en: 'Events',
    desc_ar: 'فعاليات، حجوزات، وضيوف',
    desc_en: 'Events, bookings, guests',
    icon: Calendar,
    icon3dTheme: 'violet',
    color: '#8B5CF6',
    gradient: 'from-[#8B5CF6] to-[#A78BFA]',
    features_ar: ['تخطيط الفعاليات', 'نظام الحجوزات', 'إدارة الضيوف', 'الدعوات الرقمية'],
    features_en: ['Event planning', 'Booking system', 'Guest management', 'Digital invitations'],
    modules_ar: '10 وحدات',
    modules_en: '10 Modules',
  },
  {
    id: 'finance',
    name_ar: 'المالية',
    name_en: 'Finance',
    desc_ar: 'معاملات، تقارير، وميزانيات',
    desc_en: 'Transactions, reports, budgets',
    icon: Wallet,
    icon3dTheme: 'gold',
    color: '#C8A86A',
    gradient: 'from-[#C8A86A] to-[#D4AF37]',
    features_ar: ['إدارة المعاملات', 'التقارير المالية', 'إعداد الميزانيات', 'تتبع المصروفات'],
    features_en: ['Transaction management', 'Financial reports', 'Budget planning', 'Expense tracking'],
    modules_ar: '11 وحدة',
    modules_en: '11 Modules',
  },
  {
    id: 'cleaning',
    name_ar: 'شركات النظافة',
    name_en: 'Cleaning Services',
    desc_ar: 'عقود تنظيف، جداول فرق، ومتابعة المواقع',
    desc_en: 'Cleaning contracts, team schedules, site tracking',
    icon: SprayCan,
    icon3dTheme: 'cyan',
    color: '#0891B2',
    gradient: 'from-[#0891B2] to-[#06B6D4]',
    features_ar: ['إدارة عقود النظافة', 'جدولة فرق التنظيف', 'تتبع المواقع والمباني', 'تقارير جودة الخدمة'],
    features_en: ['Cleaning contract management', 'Crew scheduling', 'Site & building tracking', 'Service quality reports'],
    modules_ar: '12 وحدة',
    modules_en: '12 Modules',
  },
];

// ═══════════════════════════════════════════════════════
// 3D Card Component
// ═══════════════════════════════════════════════════════
function Dashboard3DCard({
  dash,
  index,
  isEn,
  isDark,
  onSelect,
}: {
  dash: DashboardTemplate;
  index: number;
  isEn: boolean;
  isDark: boolean;
  onSelect: () => void;
}) {
  const [isPressed, setIsPressed] = useState(false);

  const features = isEn ? dash.features_en : dash.features_ar;
  const modules = isEn ? dash.modules_en : dash.modules_ar;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: -8 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 120, damping: 18 }}
      className="min-w-[280px] max-w-[300px] snap-center flex-shrink-0"
      style={{ perspective: '1200px' }}
    >
      <motion.button
        onClick={onSelect}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        onPointerLeave={() => setIsPressed(false)}
        animate={{
          rotateX: isPressed ? 4 : 0,
          rotateY: isPressed ? -2 : 0,
          scale: isPressed ? 0.97 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-full text-right relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ═══ 3D Card Body ═══ */}
        <div
          className={`relative rounded-[24px] overflow-hidden border-[4px] ${
            isDark ? 'border-gray-700/60' : 'border-gray-200/60'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: isDark
              ? `0 8px 0 0 rgba(0,0,0,0.3), 0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`
              : `0 6px 0 0 ${dash.color}22, 0 10px 35px ${dash.color}18, 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)`,
          }}
        >
          {/* ── Top Accent Strip ── */}
          <div
            className={`h-[5px] bg-gradient-to-r ${dash.gradient}`}
            style={{
              boxShadow: `0 2px 12px ${dash.color}40`,
            }}
          />

          {/* ── Card Content ── */}
          <div
            className={`p-5 ${
              isDark
                ? 'bg-gradient-to-b from-[#1a1d24] to-[#15171c]'
                : 'bg-gradient-to-b from-white to-[#FAFAF7]'
            }`}
          >
            {/* Header: Icon + Name + Badge */}
            <div className="flex items-start gap-3 mb-4">
              <Icon3D icon={dash.icon} theme={dash.icon3dTheme} size="lg" hoverable={false} />
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`text-[17px] font-extrabold leading-tight ${
                      isDark ? 'text-white' : 'text-[#1A1A1A]'
                    }`}
                    style={{ fontFamily: fontCairo }}
                  >
                    {isEn ? dash.name_en : dash.name_ar}
                  </h3>
                  {dash.premium && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full">
                      <Crown className="w-3 h-3 text-white" />
                      <span className="text-[9px] font-bold text-white" style={{ fontFamily: fontCairo }}>
                        PRO
                      </span>
                    </div>
                  )}
                </div>
                <p
                  className={`text-[11px] leading-relaxed ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                  style={{ fontFamily: fontCairo }}
                >
                  {isEn ? dash.desc_en : dash.desc_ar}
                </p>
              </div>
            </div>

            {/* Modules Count Badge */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold ${
                  isDark ? 'bg-white/8 text-gray-300' : 'bg-[#F5EEE1] text-[#8D6E63]'
                }`}
                style={{ fontFamily: fontCairo }}
              >
                <Layers className="w-3 h-3" />
                {modules}
              </div>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold ${
                  isDark ? 'bg-white/8 text-gray-300' : 'bg-[#F5EEE1] text-[#8D6E63]'
                }`}
                style={{ fontFamily: fontCairo }}
              >
                <Cpu className="w-3 h-3" />
                {isEn ? 'AI Powered' : 'مدعوم بالذكاء'}
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-2 mb-4">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0`}
                    style={{
                      background: `linear-gradient(135deg, ${dash.color}20, ${dash.color}10)`,
                    }}
                  >
                    <Zap className="w-3 h-3" style={{ color: dash.color }} />
                  </div>
                  <span
                    className={`text-[11px] font-semibold ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                    style={{ fontFamily: fontCairo }}
                  >
                    {feat}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom: CTA Button */}
            <div
              className={`flex items-center justify-between p-3 -mx-5 -mb-5 ${
                isDark ? 'bg-white/[0.03] border-t border-white/5' : 'bg-[#FAFAF5] border-t border-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" style={{ color: dash.color }} />
                <span
                  className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  style={{ fontFamily: fontCairo }}
                >
                  {isEn ? 'Live Preview' : 'معاينة حية'}
                </span>
              </div>
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white bg-gradient-to-r ${dash.gradient}`}
                style={{
                  fontFamily: fontCairo,
                  boxShadow: `0 3px 12px ${dash.color}35`,
                }}
              >
                {isEn ? 'Try' : 'جرّب'}
                <ChevronLeft className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ 3D Bottom Edge (Depth illusion) ═══ */}
        <div
          className="absolute -bottom-[6px] left-[6px] right-[6px] h-[6px] rounded-b-[20px]"
          style={{
            background: `linear-gradient(135deg, ${dash.color}30, ${dash.color}15)`,
            filter: 'blur(1px)',
            transform: 'translateZ(-10px)',
          }}
        />
        <div
          className="absolute -bottom-[3px] left-[3px] right-[3px] h-[3px] rounded-b-[22px]"
          style={{
            background: `linear-gradient(135deg, ${dash.color}20, ${dash.color}10)`,
          }}
        />
      </motion.button>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════
// Dashboard Preview Component (kept from original)
// ═══════════════════════════════════════════════════════
function DashboardPreview({
  dashboard,
  onBack,
  isEn,
  isDark,
}: {
  dashboard: DashboardTemplate;
  onBack: () => void;
  isEn: boolean;
  isDark: boolean;
}) {
  const Icon = dashboard.icon;
  const [showProfilePreview, setShowProfilePreview] = useState(false);

  const dashData = DASHBOARD_DATA[dashboard.id];
  if (!dashData) return null;

  const stats = dashData.stats;
  const statsLabels = isEn ? stats.label_en : stats.label_ar;
  const completeData = COMPLETE_DASHBOARD_DATA[dashboard.id];

  if (showProfilePreview) {
    return <ProfilePreview dashboardId={dashboard.id} onBack={() => setShowProfilePreview(false)} />;
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[var(--bait-bg)]' : 'bg-[#F5EEE1]'}`}>
      {/* Header */}
      <div
        className={`sticky top-0 z-50 ${isDark ? 'bg-[#1a1d24]/95' : 'bg-white/95'} backdrop-blur-lg border-b-[3px] ${
          isDark ? 'border-white/10' : 'border-gray-200/60'
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={onBack}
            className={`p-2.5 rounded-xl ${isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
          >
            <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`} />
          </button>
          <div className="flex-1">
            <h1
              className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}
              style={{ fontFamily: fontCairo }}
            >
              {isEn ? dashboard.name_en : dashboard.name_ar}
            </h1>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontFamily: fontCairo }}>
              {isEn ? 'Demo Dashboard' : 'داشبورد تجريبي'}
            </p>
          </div>
          {dashboard.premium && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full">
              <Crown className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-bold text-white" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Premium' : 'مميز'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: statsLabels.total, value: stats.total, icon: Package, thm: 'blue' },
            { label: statsLabels.active, value: stats.active, icon: Zap, thm: 'gold' },
            { label: statsLabels.pending, value: stats.pending, icon: Clock, thm: 'amber' },
            { label: statsLabels.revenue, value: stats.revenue, icon: DollarSign, thm: 'indigo' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`${isDark ? 'bg-white/5' : 'bg-white'} rounded-2xl p-4 border-[4px] ${
                isDark ? 'border-white/10' : 'border-gray-200/60'
              }`}
            >
              <Icon3D icon={stat.icon} theme={stat.thm} size="sm" hoverable={false} />
              <p
                className={`text-2xl font-bold mt-2 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}
                style={{ fontFamily: fontCairo }}
              >
                {stat.value}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontFamily: fontCairo }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Recent Items */}
        <div
          className={`${isDark ? 'bg-white/5' : 'bg-white'} rounded-2xl p-4 border-[4px] ${
            isDark ? 'border-white/10' : 'border-gray-200/60'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Icon3D icon={Icon} theme={dashboard.icon3dTheme} size="sm" hoverable={false} />
            <h2
              className={`text-base font-bold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}
              style={{ fontFamily: fontCairo }}
            >
              {isEn ? 'Recent Activity' : 'النشاط الأخير'}
            </h2>
          </div>
          <div className="space-y-3">
            {dashData.recentItems.map((item, idx) => {
              const ItemIcon = item.icon;
              const statusColors: Record<string, string> = {
                active: 'bg-[#D4AF37]/10 text-[#D4AF37]',
                pending: 'bg-yellow-500/10 text-yellow-500',
                completed: 'bg-blue-500/10 text-blue-500',
              };
              const statusLabels: Record<string, string> = {
                active: isEn ? 'Active' : 'نشط',
                pending: isEn ? 'Pending' : 'قيد المعالجة',
                completed: isEn ? 'Completed' : 'مكتمل',
              };

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${dashboard.gradient} flex items-center justify-center`}
                  >
                    <ItemIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1A1A1A]'} truncate`}
                      style={{ fontFamily: fontCairo }}
                    >
                      {isEn ? item.title_en : item.title_ar}
                    </p>
                    <p
                      className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}
                      style={{ fontFamily: fontCairo }}
                    >
                      {isEn ? item.subtitle_en : item.subtitle_ar}
                    </p>
                    {item.value && (
                      <p
                        className={`text-xs font-bold mt-0.5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                        style={{ fontFamily: fontCairo }}
                      >
                        {item.value}
                      </p>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 ${statusColors[item.status]} rounded-lg text-xs font-bold whitespace-nowrap`}
                  >
                    {statusLabels[item.status]}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Documents & Tools Section */}
        {completeData?.recommendedDocuments && completeData?.recommendedTools && (
          <DocumentsToolsSection
            documentIds={completeData.recommendedDocuments}
            toolIds={completeData.recommendedTools}
            userTier="free"
            onUpgrade={() => alert(isEn ? 'Upgrade to unlock all features!' : 'قم بالترقية لفتح جميع المميزات!')}
          />
        )}

        {/* ═══ ACTIVATE THIS SYSTEM — Choose & Try CTA ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl overflow-hidden border-[4px] ${
            isDark ? 'border-[#D4AF37]/30' : 'border-[#D4AF37]/40'
          }`}
          style={{
            boxShadow: isDark
              ? '0 6px 0 0 rgba(212,175,55,0.15), 0 10px 30px rgba(212,175,55,0.2)'
              : '0 6px 0 0 rgba(212,175,55,0.12), 0 10px 30px rgba(212,175,55,0.15)',
          }}
        >
          <div className="h-[4px] bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37]" />
          <div className={`p-5 ${isDark ? 'bg-[#1a1d24]' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-4">
              <Icon3D icon={Rocket} theme="gold" size="md" hoverable={false} />
              <div className="flex-1">
                <h3
                  className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}
                  style={{ fontFamily: fontCairo }}
                >
                  {isEn ? 'Activate This System' : 'تفعيل هذا النظام'}
                </h3>
                <p
                  className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  style={{ fontFamily: fontCairo }}
                >
                  {isEn
                    ? `Start using ${dashboard.name_en} dashboard for your business`
                    : `ابدأ باستخدام داشبورد ${dashboard.name_ar} لعملك`}
                </p>
              </div>
            </div>

            {/* Features checklist */}
            <div className="space-y-2 mb-4">
              {(isEn ? dashboard.features_en : dashboard.features_ar).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span
                    className={`text-[12px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                    style={{ fontFamily: fontCairo }}
                  >
                    {feat}
                  </span>
                </div>
              ))}
            </div>

            {/* Activate button */}
            <button
              onClick={() => window.location.href = '/workspace'}
              className="w-full bg-gradient-to-l from-[#D4AF37] to-[#5D4037] text-white py-3.5 rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2.5"
              style={{
                fontFamily: fontCairo,
                boxShadow: '0 4px 0 0 #4E342E, 0 6px 16px rgba(212,175,55,0.3)',
              }}
            >
              <Rocket className="w-4.5 h-4.5" />
              {isEn ? 'Choose & Start Now' : 'اختر وابدأ الآن'}
            </button>

            {/* Trial note */}
            <p
              className={`text-center text-[10px] mt-2.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
              style={{ fontFamily: fontCairo }}
            >
              {isEn ? 'Free trial included • No credit card required' : 'تجربة مجانية • بدون بطاقة ائتمان'}
            </p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <div className={`bg-gradient-to-br ${dashboard.gradient} rounded-2xl p-5 text-white`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold" style={{ fontFamily: fontCairo }}>
                {isEn ? 'See Your Future Profile' : 'شاهد ملفك الشخصي'}
              </h3>
              <p className="text-sm text-white/80" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Preview how your business will appear' : 'معاينة كيف سيظهر نشاطك التجاري'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowProfilePreview(true)}
            className="w-full bg-white text-[#1A1A1A] py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform flex items-center justify-center gap-2 mb-2"
            style={{ fontFamily: fontCairo }}
          >
            <Users className="w-4 h-4" />
            {isEn ? 'Preview Profile' : 'معاينة الملف الشخصي'}
          </button>
          <button
            onClick={triggerPWAInstall}
            className="w-full bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 py-3 rounded-xl font-bold text-sm hover:bg-white/30 transition-all flex items-center justify-center gap-2"
            style={{ fontFamily: fontCairo }}
          >
            <Download className="w-4 h-4" />
            {isEn ? 'Download App' : 'حمّل التطبيق'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Main Showcase Component — Single Carousel
// ═══════════════════════════════════════════════════════
export function DashboardShowcase({ onBack }: { onBack?: () => void }) {
  const [selectedDash, setSelectedDash] = useState<DashboardTemplate | null>(null);
  const isEn = document.documentElement.lang === 'en';
  const isDark = document.documentElement.classList.contains('dark');
  const scrollRef = useRef<HTMLDivElement>(null);

  if (selectedDash) {
    return (
      <DashboardPreview
        dashboard={selectedDash}
        onBack={() => setSelectedDash(null)}
        isEn={isEn}
        isDark={isDark}
      />
    );
  }

  return (
    <div className={`min-h-screen pb-24 ${isDark ? 'bg-[var(--bait-bg)]' : 'bg-[#F5EEE1]'}`}>
      {/* ═══ Compact Header ═══ */}
      <div
        className={`sticky top-0 z-50 ${
          isDark ? 'bg-[#1a1d24]/95' : 'bg-white/95'
        } backdrop-blur-lg border-b-[3px] ${isDark ? 'border-white/10' : 'border-gray-200/60'}`}
      >
        <div className="flex items-center gap-3 px-4 py-3.5">
          {onBack && (
            <button
              onClick={onBack}
              className={`p-2.5 rounded-xl ${
                isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors border-[3px] ${isDark ? 'border-white/5' : 'border-gray-200/60'}`}
            >
              <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`} />
            </button>
          )}
          <div className="flex-1">
            <h1
              className={`text-lg font-extrabold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}
              style={{ fontFamily: fontCairo }}
            >
              {isEn ? 'Dashboard Templates' : 'قوالب الداشبورد'}
            </h1>
            <p
              className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              style={{ fontFamily: fontCairo }}
            >
              {isEn ? 'Choose your industry • Tap to preview' : 'اختر نوع نشاطك • اضغط للمعاينة'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full shadow-lg shadow-[#D4AF37]/20">
            <Icon3D icon={Sparkles} theme="gold" size="xs" hoverable={false} />
            <span className="text-xs font-bold text-white" style={{ fontFamily: fontCairo }}>
              {DASHBOARDS.length}
            </span>
          </div>
        </div>
      </div>

      {/* ═══ Section Title ═══ */}
      <div className="px-4 pt-5 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <Icon3D icon={Layers} theme="blue" size="sm" hoverable={false} />
          <div>
            <h2
              className={`text-[17px] font-extrabold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}
              style={{ fontFamily: fontCairo }}
            >
              {isEn ? 'All Dashboard Templates' : 'جميع قوالب الداشبورد'}
            </h2>
            <p
              className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
              style={{ fontFamily: fontCairo }}
            >
              {isEn
                ? '11 industry-specific CRM templates with AI tools'
                : '11 قالب CRM متخصص مع أدوات ذكاء اصطناعي'}
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Single Horizontal 3D Carousel ═══ */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-6 pt-2 px-4 scrollbar-hide snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {DASHBOARDS.map((dash, index) => (
            <Dashboard3DCard
              key={dash.id}
              dash={dash}
              index={index}
              isEn={isEn}
              isDark={isDark}
              onSelect={() => setSelectedDash(dash)}
            />
          ))}
        </div>

        {/* Scroll Indicators (dots) */}
        <div className="flex justify-center gap-1.5 pb-4">
          {DASHBOARDS.map((dash, i) => (
            <button
              key={dash.id}
              onClick={() => {
                const container = scrollRef.current;
                if (container) {
                  const cardWidth = 296; // 280 + 16 gap
                  container.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isDark ? 'bg-white/20 hover:bg-white/40' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              style={{ width: i === 0 ? 24 : 8 }}
            />
          ))}
        </div>
      </div>

      {/* ═══ Bottom CTA ═══ */}
      <div className="fixed bottom-20 left-4 right-4 z-40">
        <div
          className={`rounded-2xl p-4 border-[4px] ${
            isDark
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] border-[#FFD700]/30'
              : 'bg-gradient-to-r from-[#3B5BFE] to-[#5A78FF] border-[#3B5BFE]/30'
          }`}
          style={{
            boxShadow: isDark
              ? '0 8px 32px rgba(212,175,55,0.3)'
              : '0 8px 32px rgba(59,91,254,0.3)',
          }}
        >
          <div className="flex items-center gap-3">
            <Icon3D icon={Sparkles} theme={isDark ? 'gold' : 'blue'} size="sm" hoverable={false} />
            <div className="flex-1">
              <p className="text-sm font-bold text-white" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Ready to start?' : 'جاهز للبدء؟'}
              </p>
              <p className="text-xs text-white/80" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Create your workspace now' : 'أنشئ مساحة عملك الآن'}
              </p>
            </div>
            <button
              onClick={() => (window.location.href = '/workspace')}
              className="px-5 py-2.5 bg-white text-[#3B5BFE] rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-lg"
              style={{ fontFamily: fontCairo }}
            >
              {isEn ? 'Create' : 'إنشاء'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}