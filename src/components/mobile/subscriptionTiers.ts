/**
 * subscriptionTiers.ts — نظام الباقات والنماذج
 * ═══════════════════════════════════════════════════════════
 * يحدد الأدوات والنماذج المتاحة لكل باقة
 */

import {
  FileText, FileSignature, Receipt, FileCheck, Calculator,
  FileBarChart, ClipboardList, Scroll, FileSpreadsheet,
  CreditCard, Banknote, PiggyBank, Wallet, DollarSign,
  Building2, Home, Key, Hammer, Wrench, Paintbrush,
  Users, UserCheck, Calendar, Clock, Target,
  Package, ShoppingCart, Truck, Box, Layers,
  Stethoscope, Pill, HeartPulse, Activity,
  Scale, Gavel, BookOpen, Shield, AlertTriangle,
  GraduationCap, BookMarked, Award, Trophy,
  Megaphone, BarChart3, TrendingUp, LineChart,
  PartyPopper, Music, MapPin, Camera,
  Sparkles, Brain, Cpu, Zap, Crown, Lock
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// أنواع البيانات
// ═══════════════════════════════════════════════════════════

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface DocumentTemplate {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  icon: any;
  category: 'financial' | 'legal' | 'operational' | 'marketing';
  requiredTier: SubscriptionTier;
  color: string;
  popular?: boolean;
}

export interface ToolFeature {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  icon: any;
  category: 'ai' | 'analytics' | 'automation' | 'collaboration' | 'management';
  requiredTier: SubscriptionTier;
  color: string;
  comingSoon?: boolean;
}

export interface TierFeatures {
  tier: SubscriptionTier;
  name_ar: string;
  name_en: string;
  price_monthly: number;
  price_yearly: number;
  color: string;
  gradient: string;
  icon: any;
  features_ar: string[];
  features_en: string[];
  documentsLimit: number | 'unlimited';
  templatesAccess: string[];
  toolsAccess: string[];
  storage_gb: number;
  users: number | 'unlimited';
  support: 'email' | 'priority' | 'dedicated';
  ai_credits_monthly: number;
  customBranding: boolean;
  apiAccess: boolean;
  advancedAnalytics: boolean;
}

// ═══════════════════════════════════════════════════════════
// النماذج المتاحة (DOCUMENT TEMPLATES)
// ═══════════════════════════════════════════════════════════

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  // ─────────────────────────────────────────────────────────
  // المالية (Financial Documents)
  // ─────────────────────────────────────────────────────────
  {
    id: 'invoice',
    name_ar: 'فاتورة ضريبية',
    name_en: 'Tax Invoice',
    description_ar: 'فاتورة احترافية متوافقة مع الضريبة الإماراتية',
    description_en: 'Professional invoice compliant with UAE tax',
    icon: Receipt,
    category: 'financial',
    requiredTier: 'free',
    color: '#2AA676',
    popular: true
  },
  {
    id: 'quotation',
    name_ar: 'عرض سعر',
    name_en: 'Price Quotation',
    description_ar: 'عرض سعر تفصيلي مع جدول بنود وشروط الدفع',
    description_en: 'Detailed price quote with items and payment terms',
    icon: FileText,
    category: 'financial',
    requiredTier: 'free',
    color: '#2AA676',
    popular: true
  },
  {
    id: 'receipt',
    name_ar: 'إيصال استلام',
    name_en: 'Payment Receipt',
    description_ar: 'إيصال رسمي لإثبات استلام المدفوعات',
    description_en: 'Official receipt for payment confirmation',
    icon: CreditCard,
    category: 'financial',
    requiredTier: 'free',
    color: '#2AA676'
  },
  {
    id: 'proforma',
    name_ar: 'فاتورة مبدئية',
    name_en: 'Proforma Invoice',
    description_ar: 'فاتورة أولية قبل التنفيذ',
    description_en: 'Preliminary invoice before execution',
    icon: FileBarChart,
    category: 'financial',
    requiredTier: 'pro',
    color: '#3B5BFE'
  },
  {
    id: 'purchase_order',
    name_ar: 'أمر شراء',
    name_en: 'Purchase Order',
    description_ar: 'أمر شراء رسمي للموردين',
    description_en: 'Official purchase order for suppliers',
    icon: ShoppingCart,
    category: 'financial',
    requiredTier: 'pro',
    color: '#3B5BFE'
  },
  {
    id: 'expense_report',
    name_ar: 'تقرير مصروفات',
    name_en: 'Expense Report',
    description_ar: 'تقرير تفصيلي بالمصروفات مع المرفقات',
    description_en: 'Detailed expense report with attachments',
    icon: Wallet,
    category: 'financial',
    requiredTier: 'pro',
    color: '#3B5BFE'
  },
  {
    id: 'financial_statement',
    name_ar: 'قائمة مالية',
    name_en: 'Financial Statement',
    description_ar: 'قائمة مالية شاملة للدخل والمصروفات',
    description_en: 'Comprehensive income and expense statement',
    icon: FileSpreadsheet,
    category: 'financial',
    requiredTier: 'enterprise',
    color: '#C8A86A'
  },
  {
    id: 'budget_plan',
    name_ar: 'خطة ميزانية',
    name_en: 'Budget Plan',
    description_ar: 'خطة ميزانية تفصيلية للمشاريع والأقسام',
    description_en: 'Detailed budget plan for projects and departments',
    icon: PiggyBank,
    category: 'financial',
    requiredTier: 'enterprise',
    color: '#C8A86A'
  },

  // ─────────────────────────────────────────────────────────
  // القانونية (Legal Documents)
  // ─────────────────────────────────────────────────────────
  {
    id: 'contract_standard',
    name_ar: 'عقد عمل قياسي',
    name_en: 'Standard Contract',
    description_ar: 'عقد عمل قياسي متوافق مع القانون الإماراتي',
    description_en: 'Standard work contract UAE-compliant',
    icon: FileSignature,
    category: 'legal',
    requiredTier: 'free',
    color: '#2AA676',
    popular: true
  },
  {
    id: 'contract_construction',
    name_ar: 'عقد مقاولة',
    name_en: 'Construction Contract',
    description_ar: 'عقد مقاولة شامل مع جداول التنفيذ والدفعات',
    description_en: 'Comprehensive construction contract with schedules',
    icon: Hammer,
    category: 'legal',
    requiredTier: 'pro',
    color: '#3B5BFE'
  },
  {
    id: 'contract_service',
    name_ar: 'عقد خدمات',
    name_en: 'Service Agreement',
    description_ar: 'عقد تقديم خدمات احترافية',
    description_en: 'Professional services agreement',
    icon: Wrench,
    category: 'legal',
    requiredTier: 'pro',
    color: '#3B5BFE'
  },
  {
    id: 'nda',
    name_ar: 'اتفاقية سرية',
    name_en: 'NDA Agreement',
    description_ar: 'اتفاقية عدم إفشاء المعلومات السرية',
    description_en: 'Non-disclosure agreement',
    icon: Shield,
    category: 'legal',
    requiredTier: 'pro',
    color: '#3B5BFE'
  },
  {
    id: 'contract_rental',
    name_ar: 'عقد إيجار',
    name_en: 'Rental Agreement',
    description_ar: 'عقد إيجار عقاري أو معدات',
    description_en: 'Property or equipment rental contract',
    icon: Key,
    category: 'legal',
    requiredTier: 'pro',
    color: '#3B5BFE'
  },
  {
    id: 'contract_employment',
    name_ar: 'عقد توظيف',
    name_en: 'Employment Contract',
    description_ar: 'عقد توظيف شامل للموارد البشرية',
    description_en: 'Comprehensive HR employment contract',
    icon: UserCheck,
    category: 'legal',
    requiredTier: 'enterprise',
    color: '#C8A86A'
  },
  {
    id: 'contract_partnership',
    name_ar: 'عقد شراكة',
    name_en: 'Partnership Agreement',
    description_ar: 'عقد شراكة تجارية شامل',
    description_en: 'Comprehensive business partnership agreement',
    icon: Users,
    category: 'legal',
    requiredTier: 'enterprise',
    color: '#C8A86A'
  },
  {
    id: 'legal_notice',
    name_ar: 'إنذار قانوني',
    name_en: 'Legal Notice',
    description_ar: 'إنذار قانوني رسمي',
    description_en: 'Official legal notice',
    icon: AlertTriangle,
    category: 'legal',
    requiredTier: 'enterprise',
    color: '#C8A86A'
  },

  // ─────────────────────────────────────────────────────────
  // التشغيلية (Operational Documents)
  // ─────────────────────────────────────────────────────────
  {
    id: 'delivery_note',
    name_ar: 'إشعار تسليم',
    name_en: 'Delivery Note',
    description_ar: 'إشعار تسليم بضائع أو خدمات',
    description_en: 'Goods or services delivery note',
    icon: Truck,
    category: 'operational',
    requiredTier: 'free',
    color: '#2AA676'
  },
  {
    id: 'work_order',
    name_ar: 'أمر عمل',
    name_en: 'Work Order',
    description_ar: 'أمر عمل للفريق أو المقاولين',
    description_en: 'Work order for team or contractors',
    icon: ClipboardList,
    category: 'operational',
    requiredTier: 'free',
    color: '#2AA676'
  },
  {
    id: 'project_proposal',
    name_ar: 'عرض مشروع',
    name_en: 'Project Proposal',
    description_ar: 'عرض مشروع احترافي مع الجداول والتكاليف',
    description_en: 'Professional project proposal with schedules and costs',
    icon: FileCheck,
    category: 'operational',
    requiredTier: 'pro',
    color: '#3B5BFE',
    popular: true
  },
  {
    id: 'inspection_report',
    name_ar: 'تقرير معاينة',
    name_en: 'Inspection Report',
    description_ar: 'تقرير معاينة شامل مع الصور والملاحظات',
    description_en: 'Comprehensive inspection report with photos',
    icon: Camera,
    category: 'operational',
    requiredTier: 'pro',
    color: '#3B5BFE'
  },
  {
    id: 'progress_report',
    name_ar: 'تقرير تقدم',
    name_en: 'Progress Report',
    description_ar: 'تقرير دوري لتقدم المشروع',
    description_en: 'Periodic project progress report',
    icon: TrendingUp,
    category: 'operational',
    requiredTier: 'pro',
    color: '#3B5BFE'
  },
  {
    id: 'completion_certificate',
    name_ar: 'شهادة إنجاز',
    name_en: 'Completion Certificate',
    description_ar: 'شهادة إتمام المشروع',
    description_en: 'Project completion certificate',
    icon: Award,
    category: 'operational',
    requiredTier: 'pro',
    color: '#3B5BFE'
  },
  {
    id: 'maintenance_schedule',
    name_ar: 'جدول صيانة',
    name_en: 'Maintenance Schedule',
    description_ar: 'جدول صيانة دورية',
    description_en: 'Periodic maintenance schedule',
    icon: Calendar,
    category: 'operational',
    requiredTier: 'enterprise',
    color: '#C8A86A'
  },
  {
    id: 'quality_checklist',
    name_ar: 'قائمة جودة',
    name_en: 'Quality Checklist',
    description_ar: 'قائمة فحص الجودة والمعايير',
    description_en: 'Quality and standards checklist',
    icon: FileCheck,
    category: 'operational',
    requiredTier: 'enterprise',
    color: '#C8A86A'
  },

  // ─────────────────────────────────────────────────────────
  // التسويقية (Marketing Documents)
  // ─────────────────────────────────────────────────────────
  {
    id: 'company_profile',
    name_ar: 'بروفايل الشركة',
    name_en: 'Company Profile',
    description_ar: 'بروفايل احترافي للشركة',
    description_en: 'Professional company profile',
    icon: Building2,
    category: 'marketing',
    requiredTier: 'pro',
    color: '#3B5BFE'
  },
  {
    id: 'brochure',
    name_ar: 'بروشور تعريفي',
    name_en: 'Marketing Brochure',
    description_ar: 'بروشور تسويقي احترافي',
    description_en: 'Professional marketing brochure',
    icon: Megaphone,
    category: 'marketing',
    requiredTier: 'pro',
    color: '#3B5BFE'
  },
  {
    id: 'case_study',
    name_ar: 'دراسة حالة',
    name_en: 'Case Study',
    description_ar: 'دراسة حالة تفصيلية لمشروع ناجح',
    description_en: 'Detailed case study of successful project',
    icon: BookOpen,
    category: 'marketing',
    requiredTier: 'enterprise',
    color: '#C8A86A'
  },
  {
    id: 'presentation',
    name_ar: 'عرض تقديمي',
    name_en: 'Business Presentation',
    description_ar: 'عرض تقديمي احترافي للعملاء',
    description_en: 'Professional client presentation',
    icon: Layers,
    category: 'marketing',
    requiredTier: 'enterprise',
    color: '#C8A86A'
  }
];

// ═══════════════════════════════════════════════════════════
// الأدوات والمميزات (TOOL FEATURES)
// ═══════════════════════════════════════════════════════════

export const TOOL_FEATURES: ToolFeature[] = [
  // ─────────────────────────────────────────────────────────
  // الذكاء الاصطناعي (AI Tools)
  // ─────────────────────────────────────────────────────────
  {
    id: 'weyaak_chat',
    name_ar: 'وياك المحادثة',
    name_en: 'Weyaak Chat',
    description_ar: 'مساعد ذكي يجيب على أسئلتك ويساعدك في اتخاذ القرارات',
    description_en: 'Smart assistant for questions and decision-making',
    icon: Brain,
    category: 'ai',
    requiredTier: 'free',
    color: '#9B59B6'
  },
  {
    id: 'smart_search',
    name_ar: 'البحث الذكي',
    name_en: 'Smart Search',
    description_ar: 'بحث بالنص أو الصورة عن المنتجات والخدمات',
    description_en: 'Text or image search for products and services',
    icon: Sparkles,
    category: 'ai',
    requiredTier: 'free',
    color: '#9B59B6'
  },
  {
    id: 'cost_calculator',
    name_ar: 'حاسبة التكاليف الذكية',
    name_en: 'Smart Cost Calculator',
    description_ar: 'احسب تكاليف المشروع بدقة مع توصيات',
    description_en: 'Calculate project costs with recommendations',
    icon: Calculator,
    category: 'ai',
    requiredTier: 'pro',
    color: '#9B59B6'
  },
  {
    id: 'design_generator',
    name_ar: 'مولد التصاميم',
    name_en: 'Design Generator',
    description_ar: 'تصاميم سوشيال ميديا وعروض أسعار بالذكاء الاصطناعي',
    description_en: 'AI-powered social media designs and quotes',
    icon: Paintbrush,
    category: 'ai',
    requiredTier: 'pro',
    color: '#9B59B6'
  },
  {
    id: 'video_creator',
    name_ar: 'Weyaak Video Creator',
    name_en: 'Weyaak Video Creator',
    description_ar: 'أنشئ فيديوهات تسويقية احترافية بالذكاء الاصطناعي',
    description_en: 'Create professional marketing videos with AI',
    icon: Camera,
    category: 'ai',
    requiredTier: 'enterprise',
    color: '#9B59B6',
    popular: true
  },
  {
    id: 'ai_assistant',
    name_ar: 'مساعد الأعمال الذكي',
    name_en: 'Business AI Assistant',
    description_ar: 'مساعد ذكي متقدم لإدارة جميع جوانب عملك',
    description_en: 'Advanced AI assistant for all business aspects',
    icon: Cpu,
    category: 'ai',
    requiredTier: 'enterprise',
    color: '#9B59B6'
  },

  // ─────────────────────────────────────────────────────────
  // التحليلات (Analytics)
  // ─────────────────────────────────────────────────────────
  {
    id: 'basic_analytics',
    name_ar: 'تحليلات أساسية',
    name_en: 'Basic Analytics',
    description_ar: 'إحصائيات ومقاييس أداء أساسية',
    description_en: 'Basic performance statistics and metrics',
    icon: BarChart3,
    category: 'analytics',
    requiredTier: 'free',
    color: '#2AA676'
  },
  {
    id: 'advanced_analytics',
    name_ar: 'تحليلات متقدمة',
    name_en: 'Advanced Analytics',
    description_ar: 'تقارير تفاعلية وتوقعات ذكية',
    description_en: 'Interactive reports and smart predictions',
    icon: TrendingUp,
    category: 'analytics',
    requiredTier: 'pro',
    color: '#2AA676'
  },
  {
    id: 'financial_analytics',
    name_ar: 'التحليل المالي الشامل',
    name_en: 'Comprehensive Financial Analytics',
    description_ar: 'تحليل مالي شامل مع توقعات الأرباح',
    description_en: 'Full financial analysis with profit forecasting',
    icon: LineChart,
    category: 'analytics',
    requiredTier: 'enterprise',
    color: '#2AA676'
  },
  {
    id: 'custom_reports',
    name_ar: 'تقارير مخصصة',
    name_en: 'Custom Reports',
    description_ar: 'أنشئ تقاريرك الخاصة وجدولها تلقائياً',
    description_en: 'Create and schedule custom reports',
    icon: FileBarChart,
    category: 'analytics',
    requiredTier: 'enterprise',
    color: '#2AA676'
  },

  // ─────────────────────────────────────────────────────────
  // الأتمتة (Automation)
  // ─────────────────────────────────────────────────────────
  {
    id: 'auto_reminders',
    name_ar: 'تذكيرات تلقائية',
    name_en: 'Auto Reminders',
    description_ar: 'تذكيرات تلقائية للمواعيد والمدفوعات',
    description_en: 'Automatic reminders for appointments and payments',
    icon: Clock,
    category: 'automation',
    requiredTier: 'pro',
    color: '#3B5BFE'
  },
  {
    id: 'workflow_automation',
    name_ar: 'أتمتة سير العمل',
    name_en: 'Workflow Automation',
    description_ar: 'أتمتة المهام المتكررة وسير العمل',
    description_en: 'Automate repetitive tasks and workflows',
    icon: Zap,
    category: 'automation',
    requiredTier: 'enterprise',
    color: '#3B5BFE'
  },
  {
    id: 'auto_invoicing',
    name_ar: 'فواتير تلقائية',
    name_en: 'Auto Invoicing',
    description_ar: 'إنشاء وإرسال الفواتير تلقائياً',
    description_en: 'Create and send invoices automatically',
    icon: Receipt,
    category: 'automation',
    requiredTier: 'enterprise',
    color: '#3B5BFE'
  },

  // ─────────────────────────────────────────────────────────
  // التعاون (Collaboration)
  // ─────────────────────────────────────────────────────────
  {
    id: 'team_chat',
    name_ar: 'محادثات الفريق',
    name_en: 'Team Chat',
    description_ar: 'محادثات فورية مع أفراد الفريق',
    description_en: 'Instant messaging with team members',
    icon: Users,
    category: 'collaboration',
    requiredTier: 'free',
    color: '#E67E22'
  },
  {
    id: 'file_sharing',
    name_ar: 'مشاركة الملفات',
    name_en: 'File Sharing',
    description_ar: 'مشاركة وإدارة ملفات المشاريع',
    description_en: 'Share and manage project files',
    icon: Box,
    category: 'collaboration',
    requiredTier: 'pro',
    color: '#E67E22'
  },
  {
    id: 'video_meetings',
    name_ar: 'اجتماعات مرئية',
    name_en: 'Video Meetings',
    description_ar: 'اجتماعات صوتية ومرئية مع الفريق والعملاء',
    description_en: 'Audio and video meetings with team and clients',
    icon: Camera,
    category: 'collaboration',
    requiredTier: 'enterprise',
    color: '#E67E22'
  },

  // ─────────────────────────────────────────────────────────
  // الإدارة (Management)
  // ─────────────────────────────────────────────────────────
  {
    id: 'project_management',
    name_ar: 'إدارة المشاريع',
    name_en: 'Project Management',
    description_ar: 'إدارة كاملة للمشاريع والمهام',
    description_en: 'Full project and task management',
    icon: Target,
    category: 'management',
    requiredTier: 'free',
    color: '#C8A86A'
  },
  {
    id: 'inventory_management',
    name_ar: 'إدارة المخزون',
    name_en: 'Inventory Management',
    description_ar: 'تتبع وإدارة المخزون والمواد',
    description_en: 'Track and manage inventory and materials',
    icon: Package,
    category: 'management',
    requiredTier: 'pro',
    color: '#C8A86A'
  },
  {
    id: 'crm',
    name_ar: 'إدارة العملاء CRM',
    name_en: 'Customer CRM',
    description_ar: 'نظام إدارة علاقات العملاء الشامل',
    description_en: 'Comprehensive customer relationship management',
    icon: Users,
    category: 'management',
    requiredTier: 'enterprise',
    color: '#C8A86A'
  },
  {
    id: 'hr_management',
    name_ar: 'إدارة الموارد البشرية',
    name_en: 'HR Management',
    description_ar: 'إدارة شاملة للموظفين والرواتب',
    description_en: 'Complete employee and payroll management',
    icon: UserCheck,
    category: 'management',
    requiredTier: 'enterprise',
    color: '#C8A86A'
  }
];

// ═══════════════════════════════════════════════════════════
// تعريف الباقات (SUBSCRIPTION TIERS)
// ═══════════════════════════════════════════════════════════

export const SUBSCRIPTION_TIERS: TierFeatures[] = [
  // ─────────────────────────────────────────────────────────
  // FREE - باقة مجانية
  // ─────────────────────────────────────────────────────────
  {
    tier: 'free',
    name_ar: 'باقة مجانية',
    name_en: 'Free Plan',
    price_monthly: 0,
    price_yearly: 0,
    color: '#2AA676',
    gradient: 'from-[#2AA676] to-[#1F3D2B]',
    icon: Sparkles,
    features_ar: [
      '5 نماذج شهرياً',
      '3 مشاريع نشطة',
      'تحليلات أساسية',
      'وياك المحادثة',
      'البحث الذكي',
      '1 جيجا تخزين',
      'دعم عبر البريد'
    ],
    features_en: [
      '5 documents/month',
      '3 active projects',
      'Basic analytics',
      'Weyaak Chat',
      'Smart Search',
      '1 GB storage',
      'Email support'
    ],
    documentsLimit: 5,
    templatesAccess: DOCUMENT_TEMPLATES.filter(t => t.requiredTier === 'free').map(t => t.id),
    toolsAccess: TOOL_FEATURES.filter(t => t.requiredTier === 'free').map(t => t.id),
    storage_gb: 1,
    users: 1,
    support: 'email',
    ai_credits_monthly: 50,
    customBranding: false,
    apiAccess: false,
    advancedAnalytics: false
  },

  // ─────────────────────────────────────────────────────────
  // PRO - باقة احترافية
  // ─────────────────────────────────────────────────────────
  {
    tier: 'pro',
    name_ar: 'باقة احترافية',
    name_en: 'Pro Plan',
    price_monthly: 299,
    price_yearly: 2990,
    color: '#3B5BFE',
    gradient: 'from-[#3B5BFE] to-[#2845C7]',
    icon: Crown,
    features_ar: [
      'نماذج غير محدودة',
      'مشاريع غير محدودة',
      'جميع النماذج المتقدمة',
      'حاسبة التكاليف الذكية',
      'مولد التصاميم',
      'تحليلات متقدمة',
      'أتمتة سير العمل',
      'إدارة المخزون',
      '50 جيجا تخزين',
      'حتى 10 مستخدمين',
      'دعم ذو أولوية'
    ],
    features_en: [
      'Unlimited documents',
      'Unlimited projects',
      'All advanced templates',
      'Smart cost calculator',
      'Design generator',
      'Advanced analytics',
      'Workflow automation',
      'Inventory management',
      '50 GB storage',
      'Up to 10 users',
      'Priority support'
    ],
    documentsLimit: 'unlimited',
    templatesAccess: DOCUMENT_TEMPLATES.filter(t => t.requiredTier === 'free' || t.requiredTier === 'pro').map(t => t.id),
    toolsAccess: TOOL_FEATURES.filter(t => t.requiredTier === 'free' || t.requiredTier === 'pro').map(t => t.id),
    storage_gb: 50,
    users: 10,
    support: 'priority',
    ai_credits_monthly: 500,
    customBranding: false,
    apiAccess: false,
    advancedAnalytics: true
  },

  // ─────────────────────────────────────────────────────────
  // ENTERPRISE - باقة مؤسسات
  // ─────────────────────────────────────────────────────────
  {
    tier: 'enterprise',
    name_ar: 'باقة مؤسسات',
    name_en: 'Enterprise Plan',
    price_monthly: 999,
    price_yearly: 9990,
    color: '#C8A86A',
    gradient: 'from-[#C8A86A] to-[#a88d55]',
    icon: Building2,
    features_ar: [
      'كل مميزات Pro +',
      'Weyaak Video Creator',
      'مساعد الأعمال الذكي',
      'تحليل مالي شامل',
      'تقارير مخصصة',
      'أتمتة الفواتير',
      'إدارة CRM كاملة',
      'إدارة الموارد البشرية',
      'اجتماعات مرئية',
      'هوية تجارية مخصصة',
      'API للتكامل',
      'تخزين غير محدود',
      'مستخدمين غير محدودين',
      'دعم مخصص 24/7',
      'مدير حساب شخصي'
    ],
    features_en: [
      'All Pro features +',
      'Weyaak Video Creator',
      'Business AI Assistant',
      'Comprehensive financial analytics',
      'Custom reports',
      'Auto invoicing',
      'Full CRM management',
      'HR Management',
      'Video meetings',
      'Custom branding',
      'API integration',
      'Unlimited storage',
      'Unlimited users',
      'Dedicated 24/7 support',
      'Personal account manager'
    ],
    documentsLimit: 'unlimited',
    templatesAccess: DOCUMENT_TEMPLATES.map(t => t.id),
    toolsAccess: TOOL_FEATURES.map(t => t.id),
    storage_gb: 999999,
    users: 'unlimited',
    support: 'dedicated',
    ai_credits_monthly: 5000,
    customBranding: true,
    apiAccess: true,
    advancedAnalytics: true
  }
];

// ═══════════════════════════════════════════════════════════
// دوال مساعدة (UTILITY FUNCTIONS)
// ═══════════════════════════════════════════════════════════

/**
 * تحقق من صلاحية الوصول لنموذج معين
 */
export function canAccessDocument(documentId: string, userTier: SubscriptionTier): boolean {
  const doc = DOCUMENT_TEMPLATES.find(d => d.id === documentId);
  if (!doc) return false;

  const tierOrder = { free: 0, pro: 1, enterprise: 2 };
  return tierOrder[userTier] >= tierOrder[doc.requiredTier];
}

/**
 * تحقق من صلاحية الوصول لأداة معينة
 */
export function canAccessTool(toolId: string, userTier: SubscriptionTier): boolean {
  const tool = TOOL_FEATURES.find(t => t.id === toolId);
  if (!tool) return false;

  const tierOrder = { free: 0, pro: 1, enterprise: 2 };
  return tierOrder[userTier] >= tierOrder[tool.requiredTier];
}

/**
 * احصل على النماذج المتاحة حسب الباقة
 */
export function getAvailableDocuments(userTier: SubscriptionTier): DocumentTemplate[] {
  const tierOrder = { free: 0, pro: 1, enterprise: 2 };
  return DOCUMENT_TEMPLATES.filter(doc => tierOrder[userTier] >= tierOrder[doc.requiredTier]);
}

/**
 * احصل على الأدوات المتاحة حسب الباقة
 */
export function getAvailableTools(userTier: SubscriptionTier): ToolFeature[] {
  const tierOrder = { free: 0, pro: 1, enterprise: 2 };
  return TOOL_FEATURES.filter(tool => tierOrder[userTier] >= tierOrder[tool.requiredTier]);
}

/**
 * احصل على النماذج المقفلة (غير متاحة) حسب الباقة
 */
export function getLockedDocuments(userTier: SubscriptionTier): DocumentTemplate[] {
  const tierOrder = { free: 0, pro: 1, enterprise: 2 };
  return DOCUMENT_TEMPLATES.filter(doc => tierOrder[userTier] < tierOrder[doc.requiredTier]);
}

/**
 * احصل على الأدوات المقفلة (غير متاحة) حسب الباقة
 */
export function getLockedTools(userTier: SubscriptionTier): ToolFeature[] {
  const tierOrder = { free: 0, pro: 1, enterprise: 2 };
  return TOOL_FEATURES.filter(tool => tierOrder[userTier] < tierOrder[tool.requiredTier]);
}

/**
 * احصل على تفاصيل الباقة
 */
export function getTierDetails(tier: SubscriptionTier): TierFeatures | undefined {
  return SUBSCRIPTION_TIERS.find(t => t.tier === tier);
}

/**
 * احصل على النماذج حسب الفئة
 */
export function getDocumentsByCategory(category: DocumentTemplate['category']): DocumentTemplate[] {
  return DOCUMENT_TEMPLATES.filter(doc => doc.category === category);
}

/**
 * احصل على الأدوات حسب الفئة
 */
export function getToolsByCategory(category: ToolFeature['category']): ToolFeature[] {
  return TOOL_FEATURES.filter(tool => tool.category === category);
}
