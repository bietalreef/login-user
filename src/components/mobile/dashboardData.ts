/**
 * dashboardData.ts — بيانات ديمو مخصصة لكل نوع داشبورد
 * ═══════════════════════════════════════════════════════════
 * كل نوع نشاط له بيانات واقعية خاصة به
 */

import {
  Building2, FileText as FileCheck, Users, DollarSign, Wrench, Key,
  Hammer, FileText, TrendingUp, Package, AlertCircle,
  Paintbrush, Image, Palette, Layers, Box,
  Stethoscope, Calendar, Heart, ClipboardList, UserCheck,
  Scale, Scale as Gavel, FileText as FileSignature, BookOpen, AlertTriangle,
  GraduationCap, Bookmark, Award, TrendingUp as Chart,
  ShoppingCart, ShoppingCart as ShoppingBag2, Package as Inventory, CreditCard,
  Users as Team, Briefcase, Clock, Target,
  Megaphone, Mail, BarChart2, Mouse,
  Sparkles, Ticket, MapPin, Music,
  Wallet, Receipt, Wallet as PiggyBank2, ArrowUpDown,
  Droplets, CheckCircle, Star, Droplets as Droplets2
} from 'lucide-react';
// Safe aliases for unavailable icons
const Pill = Heart;
const ShoppingBag = ShoppingCart;
const BookMarked = Bookmark;
const MousePointerClick = Mouse;
const PartyPopper = Sparkles;
const SprayCan = Droplets;
const BarChart3 = BarChart2;
const PiggyBank = PiggyBank2;

export interface DashboardItem {
  id: string;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  icon: any;
  status: 'active' | 'pending' | 'completed';
  value?: string;
}

export interface DashboardStats {
  total: string;
  active: string;
  pending: string;
  revenue: string;
  label_ar: {
    total: string;
    active: string;
    pending: string;
    revenue: string;
  };
  label_en: {
    total: string;
    active: string;
    pending: string;
    revenue: string;
  };
}

export interface CustomDashboardData {
  stats: DashboardStats;
  recentItems: DashboardItem[];
  chartLabel_ar: string;
  chartLabel_en: string;
  recommendedDocuments?: string[]; // IDs من DOCUMENT_TEMPLATES
  recommendedTools?: string[]; // IDs من TOOL_FEATURES
}

// ═══════════════════════════════════════════════════════════
// بيانات كل داشبورد
// ═══════════════════════════════════════════════════════════

export const DASHBOARD_DATA: Record<string, CustomDashboardData> = {
  real_estate: {
    stats: {
      total: '24',
      active: '18',
      pending: '6',
      revenue: '850K',
      label_ar: {
        total: 'عقارات مسجلة',
        active: 'مؤجرة',
        pending: 'متاحة',
        revenue: 'إيرادات شهرية'
      },
      label_en: {
        total: 'Properties',
        active: 'Rented',
        pending: 'Available',
        revenue: 'Monthly Revenue'
      }
    },
    recentItems: [
      {
        id: '1',
        title_ar: 'فيلا الزهور - دبي',
        title_en: 'Villa Al Zuhour - Dubai',
        subtitle_ar: 'عقد ينتهي في 20 يناير 2025',
        subtitle_en: 'Lease ends Jan 20, 2025',
        icon: Building2,
        status: 'active',
        value: '120,000 AED'
      },
      {
        id: '2',
        title_ar: 'شقة النخيل - أبوظبي',
        title_en: 'Palm Apartment - Abu Dhabi',
        subtitle_ar: 'متاحة للإيجار',
        subtitle_en: 'Available for rent',
        icon: Key,
        status: 'pending',
        value: '85,000 AED'
      },
      {
        id: '3',
        title_ar: 'مبنى التجارة - الشارقة',
        title_en: 'Trade Building - Sharjah',
        subtitle_ar: 'صيانة مطلوبة',
        subtitle_en: 'Maintenance required',
        icon: Wrench,
        status: 'pending',
        value: '15,000 AED'
      },
      {
        id: '4',
        title_ar: 'استوديو المرسى',
        title_en: 'Marina Studio',
        subtitle_ar: 'عقد م��دد حديثاً',
        subtitle_en: 'Recently renewed',
        icon: FileCheck,
        status: 'completed',
        value: '55,000 AED'
      }
    ],
    chartLabel_ar: 'إيرادات الإيجار الشهرية',
    chartLabel_en: 'Monthly Rental Revenue',
    recommendedDocuments: ['contract_rental', 'invoice', 'receipt', 'quotation', 'maintenance_schedule'],
    recommendedTools: ['project_management', 'basic_analytics', 'weyaak_chat', 'team_chat']
  },

  contracting: {
    stats: {
      total: '16',
      active: '12',
      pending: '4',
      revenue: '1.2M',
      label_ar: {
        total: 'مشاريع',
        active: 'قيد التنفيذ',
        pending: 'قيد المناقصة',
        revenue: 'قيمة العقود'
      },
      label_en: {
        total: 'Projects',
        active: 'In Progress',
        pending: 'Bidding',
        revenue: 'Contract Value'
      }
    },
    recentItems: [
      {
        id: '1',
        title_ar: 'مشروع فيلا الريان',
        title_en: 'Al Rayan Villa Project',
        subtitle_ar: 'تقدم الإنجاز: 65% — موقع العين',
        subtitle_en: 'Progress: 65% — Al Ain Site',
        icon: Hammer,
        status: 'active',
        value: '450K AED'
      },
      {
        id: '2',
        title_ar: 'مناقصة مجمع سكني',
        title_en: 'Residential Complex Bid',
        subtitle_ar: 'تنتهي المناقصة في 15 مارس',
        subtitle_en: 'Bid closes Mar 15',
        icon: FileText,
        status: 'pending',
        value: '2.8M AED'
      },
      {
        id: '3',
        title_ar: 'تشطيب مول التجارة',
        title_en: 'Trade Mall Finishing',
        subtitle_ar: 'مرحلة الدهان والسيراميك',
        subtitle_en: 'Paint & tiles phase',
        icon: Paintbrush,
        status: 'active',
        value: '680K AED'
      },
      {
        id: '4',
        title_ar: 'مشروع فيلا النخيل',
        title_en: 'Palm Villa Project',
        subtitle_ar: 'تم التسليم بنجاح',
        subtitle_en: 'Successfully delivered',
        icon: Award,
        status: 'completed',
        value: '520K AED'
      }
    ],
    chartLabel_ar: 'قيمة المشاريع حسب الشهر',
    chartLabel_en: 'Project Values by Month'
  },

  interior: {
    stats: {
      total: '28',
      active: '14',
      pending: '8',
      revenue: '620K',
      label_ar: {
        total: 'مشاريع تصميم',
        active: 'قيد التنفيذ',
        pending: 'بانتظار الموافقة',
        revenue: 'إيرادات'
      },
      label_en: {
        total: 'Design Projects',
        active: 'In Progress',
        pending: 'Awaiting Approval',
        revenue: 'Revenue'
      }
    },
    recentItems: [
      {
        id: '1',
        title_ar: 'تصميم شقة عصرية - دبي',
        title_en: 'Modern Apartment - Dubai',
        subtitle_ar: 'مرحلة اختيار الأثاث',
        subtitle_en: 'Furniture selection phase',
        icon: Paintbrush,
        status: 'active',
        value: '85,000 AED'
      },
      {
        id: '2',
        title_ar: 'فيلا كلاسيكية - أبوظبي',
        title_en: 'Classic Villa - Abu Dhabi',
        subtitle_ar: 'انتظار موافقة العميل',
        subtitle_en: 'Awaiting client approval',
        icon: Image,
        status: 'pending',
        value: '180,000 AED'
      },
      {
        id: '3',
        title_ar: 'تصميم مكتب شركة',
        title_en: 'Corporate Office Design',
        subtitle_ar: 'مرحلة الإضاءة والألوان',
        subtitle_en: 'Lighting & colors phase',
        icon: Palette,
        status: 'active',
        value: '120,000 AED'
      },
      {
        id: '4',
        title_ar: 'معرض فني',
        title_en: 'Art Gallery',
        subtitle_ar: 'تم التسليم والتصوير',
        subtitle_en: 'Delivered & photographed',
        icon: Award,
        status: 'completed',
        value: '95,000 AED'
      }
    ],
    chartLabel_ar: 'مشاريع التصميم الشهرية',
    chartLabel_en: 'Monthly Design Projects'
  },

  healthcare: {
    stats: {
      total: '1,240',
      active: '186',
      pending: '42',
      revenue: '520K',
      label_ar: {
        total: 'مرضى مسجلين',
        active: 'مواعيد هذا الشهر',
        pending: 'قوائم انتظار',
        revenue: 'إيرادات شهرية'
      },
      label_en: {
        total: 'Registered Patients',
        active: 'Appointments This Month',
        pending: 'Waiting Lists',
        revenue: 'Monthly Revenue'
      }
    },
    recentItems: [
      {
        id: '1',
        title_ar: 'أحمد محمد الشامسي',
        title_en: 'Ahmed Mohammed Al Shamsi',
        subtitle_ar: 'موعد فحص دوري - الأحد 10:00 ص',
        subtitle_en: 'Routine checkup - Sun 10:00 AM',
        icon: Stethoscope,
        status: 'active',
        value: 'ملف #A1234'
      },
      {
        id: '2',
        title_ar: 'فاطمة علي النعيمي',
        title_en: 'Fatima Ali Al Nuaimi',
        subtitle_ar: 'متابعة علاج - قيد الانتظار',
        subtitle_en: 'Follow-up treatment - Waiting',
        icon: Pill,
        status: 'pending',
        value: 'ملف #B5678'
      },
      {
        id: '3',
        title_ar: 'خالد سعيد المزروعي',
        title_en: 'Khaled Saeed Al Mazrouei',
        subtitle_ar: 'تحاليل معملية مطلوبة',
        subtitle_en: 'Lab tests required',
        icon: ClipboardList,
        status: 'pending',
        value: 'ملف #C9012'
      },
      {
        id: '4',
        title_ar: 'مريم حسن الكتبي',
        title_en: 'Maryam Hassan Al Ketbi',
        subtitle_ar: 'اكتملت الزيارة والوصفة',
        subtitle_en: 'Visit completed & prescription',
        icon: UserCheck,
        status: 'completed',
        value: 'ملف #D3456'
      }
    ],
    chartLabel_ar: 'عدد المرضى الشهري',
    chartLabel_en: 'Monthly Patient Count'
  },

  legal: {
    stats: {
      total: '64',
      active: '28',
      pending: '18',
      revenue: '1.8M',
      label_ar: {
        total: 'قضايا',
        active: 'نشطة',
        pending: 'جلسات قادمة',
        revenue: 'قيمة العقود'
      },
      label_en: {
        total: 'Cases',
        active: 'Active',
        pending: 'Upcoming Hearings',
        revenue: 'Contract Value'
      }
    },
    recentItems: [
      {
        id: '1',
        title_ar: 'قضية عقارية #2024/145',
        title_en: 'Real Estate Case #2024/145',
        subtitle_ar: 'جلسة محكمة - 15 مارس',
        subtitle_en: 'Court hearing - Mar 15',
        icon: Gavel,
        status: 'active',
        value: '450K AED'
      },
      {
        id: '2',
        title_ar: 'عقد تجاري - شركة النور',
        title_en: 'Commercial Contract - Al Noor Co.',
        subtitle_ar: 'مراجعة قانونية',
        subtitle_en: 'Legal review',
        icon: FileSignature,
        status: 'pending',
        value: '280K AED'
      },
      {
        id: '3',
        title_ar: 'قضية عمالية #2024/089',
        title_en: 'Labor Case #2024/089',
        subtitle_ar: 'مرحلة التفاوض',
        subtitle_en: 'Negotiation phase',
        icon: Users,
        status: 'active',
        value: '120K AED'
      },
      {
        id: '4',
        title_ar: 'استشارة قانونية - مشروع',
        title_en: 'Legal Consultation - Project',
        subtitle_ar: 'تم إغلاقها بنجاح',
        subtitle_en: 'Successfully closed',
        icon: BookOpen,
        status: 'completed',
        value: '85K AED'
      }
    ],
    chartLabel_ar: 'القضايا النشطة',
    chartLabel_en: 'Active Cases'
  },

  education: {
    stats: {
      total: '450',
      active: '380',
      pending: '52',
      revenue: '1.2M',
      label_ar: {
        total: 'طلاب مسجلين',
        active: 'طلاب نشطين',
        pending: 'قوائم انتظار',
        revenue: 'إيرادات فصلية'
      },
      label_en: {
        total: 'Enrolled Students',
        active: 'Active Students',
        pending: 'Waiting Lists',
        revenue: 'Quarterly Revenue'
      }
    },
    recentItems: [
      {
        id: '1',
        title_ar: 'دورة البرمجة المتقدمة',
        title_en: 'Advanced Programming Course',
        subtitle_ar: '28 طالب — تنتهي في 20 مارس',
        subtitle_en: '28 students — Ends Mar 20',
        icon: BookMarked,
        status: 'active',
        value: '85,000 AED'
      },
      {
        id: '2',
        title_ar: 'دورة التصميم الجرافيكي',
        title_en: 'Graphic Design Course',
        subtitle_ar: 'تبدأ في 10 أبريل',
        subtitle_en: 'Starts Apr 10',
        icon: Palette,
        status: 'pending',
        value: '65,000 AED'
      },
      {
        id: '3',
        title_ar: 'دورة إدارة المشاريع',
        title_en: 'Project Management Course',
        subtitle_ar: '35 طالب — جاري التدريس',
        subtitle_en: '35 students — Ongoing',
        icon: Briefcase,
        status: 'active',
        value: '95,000 AED'
      },
      {
        id: '4',
        title_ar: 'دورة التسويق الرقمي',
        title_en: 'Digital Marketing Course',
        subtitle_ar: 'اكتملت — 42 شهادة',
        subtitle_en: 'Completed — 42 certificates',
        icon: Award,
        status: 'completed',
        value: '72,000 AED'
      }
    ],
    chartLabel_ar: 'التسجيلات الشهرية',
    chartLabel_en: 'Monthly Enrollments'
  },

  retail: {
    stats: {
      total: '8,450',
      active: '1,240',
      pending: '186',
      revenue: '2.4M',
      label_ar: {
        total: 'منتجات',
        active: 'مبيعات هذا الشهر',
        pending: 'طلبات قيد التوصيل',
        revenue: 'إيرادات شهرية'
      },
      label_en: {
        total: 'Products',
        active: 'Sales This Month',
        pending: 'Orders In Transit',
        revenue: 'Monthly Revenue'
      }
    },
    recentItems: [
      {
        id: '1',
        title_ar: 'طلب #ORD-2024-1542',
        title_en: 'Order #ORD-2024-1542',
        subtitle_ar: 'أحمد الشامسي — قيد التوصيل',
        subtitle_en: 'Ahmed Al Shamsi — In Transit',
        icon: ShoppingCart,
        status: 'active',
        value: '1,850 AED'
      },
      {
        id: '2',
        title_ar: 'طلب #ORD-2024-1543',
        title_en: 'Order #ORD-2024-1543',
        subtitle_ar: 'فاطمة النعيمي — انتظار الدفع',
        subtitle_en: 'Fatima Al Nuaimi — Awaiting Payment',
        icon: CreditCard,
        status: 'pending',
        value: '3,200 AED'
      },
      {
        id: '3',
        title_ar: 'تنبيه مخزون منخفض',
        title_en: 'Low Stock Alert',
        subtitle_ar: '12 منتج تحتاج إعادة طلب',
        subtitle_en: '12 products need reorder',
        icon: AlertCircle,
        status: 'pending',
        value: '—'
      },
      {
        id: '4',
        title_ar: 'طلب #ORD-2024-1540',
        title_en: 'Order #ORD-2024-1540',
        subtitle_ar: 'تم التسليم — تقييم 5 نجوم',
        subtitle_en: 'Delivered — 5 stars rating',
        icon: Award,
        status: 'completed',
        value: '2,750 AED'
      }
    ],
    chartLabel_ar: 'المبيعات الشهرية',
    chartLabel_en: 'Monthly Sales'
  },

  hr: {
    stats: {
      total: '128',
      active: '115',
      pending: '8',
      revenue: '450K',
      label_ar: {
        total: 'موظفين',
        active: 'على رأس العمل',
        pending: 'طلبات إجازة',
        revenue: 'كشف الرواتب الشهري'
      },
      label_en: {
        total: 'Employees',
        active: 'On Duty',
        pending: 'Leave Requests',
        revenue: 'Monthly Payroll'
      }
    },
    recentItems: [
      {
        id: '1',
        title_ar: 'أحمد خالد — مطور',
        title_en: 'Ahmed Khaled — Developer',
        subtitle_ar: 'تقييم أداء ممتاز',
        subtitle_en: 'Excellent performance review',
        icon: Target,
        status: 'active',
        value: '18,000 AED'
      },
      {
        id: '2',
        title_ar: 'فاطمة علي — مصممة',
        title_en: 'Fatima Ali — Designer',
        subtitle_ar: 'طلب إجازة — 5 أيام',
        subtitle_en: 'Leave request — 5 days',
        icon: Clock,
        status: 'pending',
        value: '15,500 AED'
      },
      {
        id: '3',
        title_ar: 'محمد سعيد — مدير مبيعات',
        title_en: 'Mohammed Saeed — Sales Manager',
        subtitle_ar: 'تدريب قيادي هذا الشهر',
        subtitle_en: 'Leadership training this month',
        icon: Briefcase,
        status: 'active',
        value: '22,000 AED'
      },
      {
        id: '4',
        title_ar: 'مريم حسن — محاسبة',
        title_en: 'Maryam Hassan — Accountant',
        subtitle_ar: 'اكتمل التدريب السنوي',
        subtitle_en: 'Annual training completed',
        icon: Award,
        status: 'completed',
        value: '16,000 AED'
      }
    ],
    chartLabel_ar: 'الحضور والأداء',
    chartLabel_en: 'Attendance & Performance'
  },

  marketing: {
    stats: {
      total: '18',
      active: '12',
      pending: '4',
      revenue: '680K',
      label_ar: {
        total: 'حملات',
        active: 'نشطة',
        pending: 'قيد التخطيط',
        revenue: 'ميزانية شهرية'
      },
      label_en: {
        total: 'Campaigns',
        active: 'Active',
        pending: 'Planning',
        revenue: 'Monthly Budget'
      }
    },
    recentItems: [
      {
        id: '1',
        title_ar: 'حملة إطلاق المنتج',
        title_en: 'Product Launch Campaign',
        subtitle_ar: '15,500 نقرة — معدل تحويل 3.2%',
        subtitle_en: '15,500 clicks — 3.2% conversion',
        icon: Megaphone,
        status: 'active',
        value: '120,000 AED'
      },
      {
        id: '2',
        title_ar: 'حملة البريد الإلكتروني',
        title_en: 'Email Campaign',
        subtitle_ar: 'قيد المراجعة — تبدأ غداً',
        subtitle_en: 'Under review — Starts tomorrow',
        icon: Mail,
        status: 'pending',
        value: '35,000 AED'
      },
      {
        id: '3',
        title_ar: 'إعلانات سوشيال ميديا',
        title_en: 'Social Media Ads',
        subtitle_ar: '42,000 ظهور — 850 تفاعل',
        subtitle_en: '42,000 impressions — 850 engagements',
        icon: BarChart3,
        status: 'active',
        value: '85,000 AED'
      },
      {
        id: '4',
        title_ar: 'حملة الصيف الكبرى',
        title_en: 'Grand Summer Campaign',
        subtitle_ar: 'اكتملت — ROI 280%',
        subtitle_en: 'Completed — ROI 280%',
        icon: Award,
        status: 'completed',
        value: '220,000 AED'
      }
    ],
    chartLabel_ar: 'أداء الحملات',
    chartLabel_en: 'Campaign Performance'
  },

  events: {
    stats: {
      total: '32',
      active: '8',
      pending: '12',
      revenue: '1.5M',
      label_ar: {
        total: 'فعاليات',
        active: 'جارية',
        pending: 'قادمة',
        revenue: 'إيرادات متوقعة'
      },
      label_en: {
        total: 'Events',
        active: 'Ongoing',
        pending: 'Upcoming',
        revenue: 'Expected Revenue'
      }
    },
    recentItems: [
      {
        id: '1',
        title_ar: 'حفل زفاف — قصر الإمارات',
        title_en: 'Wedding — Emirates Palace',
        subtitle_ar: 'جاري الآن — 450 ضيف',
        subtitle_en: 'Ongoing — 450 guests',
        icon: PartyPopper,
        status: 'active',
        value: '380,000 AED'
      },
      {
        id: '2',
        title_ar: 'مؤتمر تقني — 25 مارس',
        title_en: 'Tech Conference — Mar 25',
        subtitle_ar: 'تأكيد الحجوزات قيد التقدم',
        subtitle_en: 'Booking confirmations ongoing',
        icon: Users,
        status: 'pending',
        value: '550,000 AED'
      },
      {
        id: '3',
        title_ar: 'حفلة عيد ميلاد VIP',
        title_en: 'VIP Birthday Party',
        subtitle_ar: 'جاري التجهيز — 8 أبريل',
        subtitle_en: 'In preparation — Apr 8',
        icon: Ticket,
        status: 'active',
        value: '95,000 AED'
      },
      {
        id: '4',
        title_ar: 'معرض فني',
        title_en: 'Art Exhibition',
        subtitle_ar: 'اكتمل بنجاح — 1,200 زائر',
        subtitle_en: 'Completed — 1,200 visitors',
        icon: Award,
        status: 'completed',
        value: '180,000 AED'
      }
    ],
    chartLabel_ar: 'الفعاليات الشهرية',
    chartLabel_en: 'Monthly Events'
  },

  finance: {
    stats: {
      total: '5,240',
      active: '1,850',
      pending: '420',
      revenue: '8.6M',
      label_ar: {
        total: 'معاملات',
        active: 'هذا الشهر',
        pending: 'معلقة',
        revenue: 'إيرادات ربعية'
      },
      label_en: {
        total: 'Transactions',
        active: 'This Month',
        pending: 'Pending',
        revenue: 'Quarterly Revenue'
      }
    },
    recentItems: [
      {
        id: '1',
        title_ar: 'فاتورة #INV-2024-1542',
        title_en: 'Invoice #INV-2024-1542',
        subtitle_ar: 'شركة النور — مدفوعة',
        subtitle_en: 'Al Noor Co. — Paid',
        icon: Receipt,
        status: 'completed',
        value: '125,000 AED'
      },
      {
        id: '2',
        title_ar: 'فاتورة #INV-2024-1543',
        title_en: 'Invoice #INV-2024-1543',
        subtitle_ar: 'شركة المستقبل — مستحقة',
        subtitle_en: 'Future Co. — Due',
        icon: AlertCircle,
        status: 'pending',
        value: '85,000 AED'
      },
      {
        id: '3',
        title_ar: 'تحويل مالي — مشروع البناء',
        title_en: 'Transfer — Construction Project',
        subtitle_ar: 'قيد المعالجة',
        subtitle_en: 'Processing',
        icon: ArrowUpDown,
        status: 'active',
        value: '450,000 AED'
      },
      {
        id: '4',
        title_ar: 'تقرير ربعي Q1 2024',
        title_en: 'Q1 2024 Quarterly Report',
        subtitle_ar: 'نمو 24% عن العام الماضي',
        subtitle_en: '24% growth YoY',
        icon: BarChart3,
        status: 'completed',
        value: '2.1M AED'
      }
    ],
    chartLabel_ar: 'التدفقات المالية',
    chartLabel_en: 'Financial Flows'
  },

  cleaning: {
    stats: {
      total: '85',
      active: '62',
      pending: '23',
      revenue: '420K',
      label_ar: {
        total: 'عقود نظافة',
        active: 'نشطة',
        pending: 'قيد التجديد',
        revenue: 'إيرادات شهرية'
      },
      label_en: {
        total: 'Cleaning Contracts',
        active: 'Active',
        pending: 'Renewal Pending',
        revenue: 'Monthly Revenue'
      }
    },
    recentItems: [
      {
        id: '1',
        title_ar: 'برج الخليج — تنظيف يومي',
        title_en: 'Gulf Tower — Daily Cleaning',
        subtitle_ar: '14 طابق · فريق 8 عمال',
        subtitle_en: '14 floors · 8-worker crew',
        icon: Building2,
        status: 'active',
        value: '18,500 د.إ/شهر'
      },
      {
        id: '2',
        title_ar: 'فيلا النخيل — تنظيف أسبوعي',
        title_en: 'Al Nakheel Villa — Weekly',
        subtitle_ar: 'فيلا 5 غرف · فريق 3 عمال',
        subtitle_en: '5-room villa · 3-worker crew',
        icon: SprayCan,
        status: 'active',
        value: '3,200 د.إ/شهر'
      },
      {
        id: '3',
        title_ar: 'مول الإمارات — عقد سنوي',
        title_en: 'Emirates Mall — Annual Contract',
        subtitle_ar: 'تجديد العقد قيد المراجعة',
        subtitle_en: 'Contract renewal under review',
        icon: FileText,
        status: 'pending',
        value: '95,000 د.إ/سنة'
      },
      {
        id: '4',
        title_ar: 'مبنى الواحة السكني — تنظيف شامل',
        title_en: 'Oasis Residential — Deep Clean',
        subtitle_ar: 'خدمة التعقيم الشامل مكتملة',
        subtitle_en: 'Full sanitization completed',
        icon: CheckCircle,
        status: 'completed',
        value: '12,800 د.إ'
      }
    ],
    chartLabel_ar: 'عقود النظافة الشهرية',
    chartLabel_en: 'Monthly Cleaning Contracts'
  }
};