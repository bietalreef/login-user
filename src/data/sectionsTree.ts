// شجرة الأقسام — بيت الريف (تطبيق المتصفح)
// ══════════════════════════════════════════════════
// القاعدة الذهبية: Web App = Guest Experience
// كل قسم يحمل علامة guestAllowed
// الأقسام غير المسموحة تعرض CTA "حمّل التطبيق"

export interface SubSection {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  route: string;
}

export interface MainSection {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  route: string;
  subSections?: SubSection[];
  expandable?: boolean;
  /** Can a guest (browser visitor) access this? */
  guestAllowed: boolean;
  /** If not guest-allowed, what does the CTA say? */
  appOnlyLabel?: { ar: string; en: string };
}

export const sectionsTree: MainSection[] = [
  {
    id: 'home',
    nameAr: 'الرئيسية',
    nameEn: 'Home',
    icon: '🏠',
    route: '/home',
    guestAllowed: true,
  },
  {
    id: 'services',
    nameAr: 'الخدمات',
    nameEn: 'Services',
    icon: '🔧',
    route: '/services',
    guestAllowed: true,
    expandable: true,
    subSections: [
      { id: 'construction-contracting', nameAr: 'مقاولات البناء', nameEn: 'Construction Contracting', icon: '🏗️', route: '/services/construction-contracting' },
      { id: 'engineering-consultation', nameAr: 'الاستشارات الهندسية', nameEn: 'Engineering Consultation', icon: '📐', route: '/services/engineering-consultation' },
      { id: 'maintenance-companies', nameAr: 'شركات الصيانة', nameEn: 'Maintenance Companies', icon: '🔧', route: '/services/maintenance-companies' },
      { id: 'craftsmen', nameAr: 'العمالة الحرفية', nameEn: 'Craftsmen', icon: '👷', route: '/services/craftsmen' },
      { id: 'workshops', nameAr: 'الورش', nameEn: 'Workshops', icon: '🔨', route: '/services/workshops' },
      { id: 'equipment-rental', nameAr: 'تأجير المعدات', nameEn: 'Equipment Rental', icon: '🚜', route: '/services/equipment-rental' },
      { id: 'building-materials', nameAr: 'محلات مواد البناء', nameEn: 'Building Materials Stores', icon: '🧱', route: '/services/building-materials' },
      { id: 'furniture-stores', nameAr: 'محلات الأثاث', nameEn: 'Furniture Stores', icon: '🪑', route: '/services/furniture-stores' },
      { id: 'cleaning-services', nameAr: 'خدمات النظافة', nameEn: 'Cleaning Services', icon: '🧹', route: '/services/cleaning-services' },
    ],
  },
  {
    id: 'shop',
    nameAr: 'المتجر',
    nameEn: 'Shop',
    icon: '🛒',
    route: '/shop',
    guestAllowed: true,
  },
  {
    id: 'maps',
    nameAr: 'خريطة المحلات',
    nameEn: 'Stores Map',
    icon: '📍',
    route: '/maps',
    guestAllowed: true,
  },
  {
    id: 'design',
    nameAr: 'استوديو التصميم',
    nameEn: 'Design Studio',
    icon: '📐',
    route: '/design',
    guestAllowed: true,
  },
  {
    id: 'offers',
    nameAr: 'العروض',
    nameEn: 'Offers',
    icon: '🔥',
    route: '/offers',
    guestAllowed: true,
  },
  {
    id: 'tools',
    nameAr: 'الأدوات',
    nameEn: 'Tools',
    icon: '🛠️',
    route: '/tools',
    guestAllowed: true,
  },
  {
    id: 'marketplace',
    nameAr: 'السوق',
    nameEn: 'Marketplace',
    icon: '🏪',
    route: '/marketplace',
    guestAllowed: true,
  },
  {
    id: 'connectors',
    nameAr: 'الموصلات',
    nameEn: 'Connectors',
    icon: '🔌',
    route: '/connectors',
    guestAllowed: true,
  },
  // ─── APP-ONLY SECTIONS (shown with lock icon + CTA) ───
  {
    id: 'projects',
    nameAr: 'المشاريع',
    nameEn: 'Projects',
    icon: '📁',
    route: '/projects',
    guestAllowed: false,
    appOnlyLabel: { ar: 'إدارة المشاريع في التطبيق', en: 'Manage Projects in App' },
  },
  {
    id: 'wallet',
    nameAr: 'محفظة الدار',
    nameEn: 'Dar Wallet',
    icon: '🪙',
    route: '/wallet',
    guestAllowed: true,
  },
  {
    id: 'profile',
    nameAr: 'الملف الشخصي',
    nameEn: 'Profile',
    icon: '👤',
    route: '/profile',
    guestAllowed: true,
  },
];

/** Only guest-allowed sections (for navigation menus) */
export const guestSections = sectionsTree.filter(s => s.guestAllowed);

/** App-only sections (for "download app" hints) */
export const appOnlySections = sectionsTree.filter(s => !s.guestAllowed);