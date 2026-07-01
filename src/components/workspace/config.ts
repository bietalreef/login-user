/**
 * Workspace Config — Module System + RBAC + Plans
 * ═════════════════════════════════════════════════
 * Core Modules = fixed code, enabled/disabled per business type
 * Specialized Modules = Plug & Play per business type
 * Any new business = Config only, NOT new code
 */

import type { BusinessType, ModuleId, WorkspaceRole, PlanId } from './types';

// ─── Module Definition ───
export interface ModuleDef {
  id: ModuleId;
  labelAr: string;
  labelEn: string;
  iconName: string;      // lucide icon name (for Icon3D mapping)
  iconTheme: string;     // Icon3D color theme
  isCore: boolean;
  enabledFor: BusinessType[];
}

// ─── All Modules ───
export const MODULES: ModuleDef[] = [
  // ════ Core ════
  { id: 'dashboard',        labelAr: 'لوحة التحكم',    labelEn: 'Dashboard',         iconName: 'LayoutDashboard', iconTheme: 'gold',   isCore: true,  enabledFor: ['construction','shop','engineering','freelancer','client','clinic','restaurant','other'] },
  { id: 'team',             labelAr: 'الفريق',         labelEn: 'Team',              iconName: 'Users',           iconTheme: 'purple', isCore: true,  enabledFor: ['construction','shop','engineering','clinic','restaurant','other'] },
  { id: 'settings',         labelAr: 'الإعدادات',      labelEn: 'Settings',          iconName: 'Settings',        iconTheme: 'brown',  isCore: true,  enabledFor: ['construction','shop','engineering','freelancer','client','clinic','restaurant','other'] },
  { id: 'public_profile',   labelAr: 'البروفايل العام', labelEn: 'Public Profile',    iconName: 'Globe',           iconTheme: 'teal',   isCore: true,  enabledFor: ['construction','shop','engineering','freelancer','clinic','restaurant','other'] },
  { id: 'notifications',    labelAr: 'الإشعارات',      labelEn: 'Notifications',     iconName: 'Bell',            iconTheme: 'gold',   isCore: true,  enabledFor: ['construction','shop','engineering','freelancer','client','clinic','restaurant','other'] },
  { id: 'files',            labelAr: 'الملفات',        labelEn: 'Files',             iconName: 'FolderOpen',      iconTheme: 'orange', isCore: true,  enabledFor: ['construction','shop','engineering','freelancer','client','clinic','restaurant','other'] },
  { id: 'quotes_contracts', labelAr: 'العقود والعروض',  labelEn: 'Quotes & Contracts', iconName: 'FileSignature',  iconTheme: 'indigo', isCore: true,  enabledFor: ['construction','shop','engineering','freelancer','client','clinic','restaurant','other'] },

  // ════ Specialized ════
  { id: 'projects',     labelAr: 'المشاريع',   labelEn: 'Projects',          iconName: 'FolderKanban', iconTheme: 'blue',   isCore: false, enabledFor: ['construction','engineering','client','other'] },
  { id: 'jobs',         labelAr: 'المهام',      labelEn: 'Jobs',              iconName: 'Briefcase',    iconTheme: 'teal',   isCore: false, enabledFor: ['construction','freelancer'] },
  { id: 'site_diary',   labelAr: 'اليوميات',    labelEn: 'Site Diary',        iconName: 'BookOpen',     iconTheme: 'gold',   isCore: false, enabledFor: ['construction','engineering','client'] },
  { id: 'inventory',    labelAr: 'المخزون',     labelEn: 'Inventory',         iconName: 'Package',      iconTheme: 'amber',  isCore: false, enabledFor: ['shop','restaurant'] },
  { id: 'catalog',      labelAr: 'الكتالوج',    labelEn: 'Catalog',           iconName: 'ShoppingBag',  iconTheme: 'pink',   isCore: false, enabledFor: ['shop','restaurant'] },
  { id: 'orders',       labelAr: 'الطلبات',     labelEn: 'Orders',            iconName: 'ShoppingCart', iconTheme: 'red',    isCore: false, enabledFor: ['shop','restaurant'] },
  { id: 'finance',      labelAr: 'المالية',     labelEn: 'Finance',           iconName: 'DollarSign',   iconTheme: 'gold',   isCore: false, enabledFor: ['construction','shop','engineering','freelancer','clinic','restaurant','other'] },
  { id: 'drawings',     labelAr: 'المخططات',    labelEn: 'Drawings',          iconName: 'PenTool',      iconTheme: 'violet', isCore: false, enabledFor: ['engineering','client'] },
  { id: 'appointments', labelAr: 'المواعيد',    labelEn: 'Appointments',      iconName: 'Calendar',     iconTheme: 'cyan',   isCore: false, enabledFor: ['construction','engineering','freelancer','clinic'] },
  { id: 'automation',   labelAr: 'الأتمتة',     labelEn: 'Automation',        iconName: 'Zap',          iconTheme: 'amber',  isCore: false, enabledFor: [] }, // Entitlement + Role check
];

// ─── Get Enabled Modules for a Business Type ───
export function getEnabledModules(businessType: BusinessType): ModuleDef[] {
  return MODULES.filter(m => m.enabledFor.includes(businessType));
}

// ─── Get Module by ID ───
export function getModule(id: ModuleId): ModuleDef | undefined {
  return MODULES.find(m => m.id === id);
}

// ─── RBAC Permissions ───
// true = has access to this module
const RBAC: Record<string, Record<WorkspaceRole, boolean>> = {
  dashboard:        { owner: true,  admin: true,  staff: true  },
  projects:         { owner: true,  admin: true,  staff: true  },
  jobs:             { owner: true,  admin: true,  staff: true  },
  team:             { owner: true,  admin: true,  staff: false },
  finance:          { owner: true,  admin: true,  staff: false },
  files:            { owner: true,  admin: true,  staff: true  },
  settings:         { owner: true,  admin: true,  staff: false },
  public_profile:   { owner: true,  admin: true,  staff: false },
  site_diary:       { owner: true,  admin: true,  staff: true  },
  appointments:     { owner: true,  admin: true,  staff: true  },
  quotes_contracts: { owner: true,  admin: true,  staff: true  },
  notifications:    { owner: true,  admin: true,  staff: true  },
  inventory:        { owner: true,  admin: true,  staff: true  },
  catalog:          { owner: true,  admin: true,  staff: true  },
  orders:           { owner: true,  admin: true,  staff: true  },
  drawings:         { owner: true,  admin: true,  staff: true  },
  automation:       { owner: true,  admin: false, staff: false }, // + Entitlement check
};

export function canAccess(moduleId: string, role: WorkspaceRole): boolean {
  const perm = RBAC[moduleId];
  if (!perm) return role === 'owner' || role === 'admin';
  return perm[role] || false;
}

// ─── Subscription Plans ───
export interface PlanDef {
  id: PlanId;
  nameAr: string;
  nameEn: string;
  maxMembers: number;
  maxProjects: number;
  automation: boolean;
  priceAED: number;
}

export const PLANS: Record<PlanId, PlanDef> = {
  starter: {
    id: 'starter',
    nameAr: 'المبتدئ',
    nameEn: 'Starter',
    maxMembers: 5,
    maxProjects: 3,
    automation: false,
    priceAED: 99,
  },
  business: {
    id: 'business',
    nameAr: 'الأعمال',
    nameEn: 'Business',
    maxMembers: 20,
    maxProjects: 15,
    automation: true,
    priceAED: 299,
  },
  enterprise: {
    id: 'enterprise',
    nameAr: 'المؤسسات',
    nameEn: 'Enterprise',
    maxMembers: 100,
    maxProjects: 999,
    automation: true,
    priceAED: 799,
  },
};

// ─── Business Type Labels ───
export const BUSINESS_TYPES: { value: BusinessType; labelAr: string; labelEn: string; iconTheme: string }[] = [
  { value: 'construction', labelAr: 'مقاولات وبناء',    labelEn: 'Construction',       iconTheme: 'orange' },
  { value: 'shop',         labelAr: 'محل مواد وتجزئة',  labelEn: 'Shop / Retail',      iconTheme: 'amber'  },
  { value: 'engineering',  labelAr: 'مكتب هندسي',       labelEn: 'Engineering Office',  iconTheme: 'blue'   },
  { value: 'freelancer',   labelAr: 'مزود خدمة مستقل',  labelEn: 'Freelancer',          iconTheme: 'teal'   },
  { value: 'client',       labelAr: 'عميل (صاحب بيت)',  labelEn: 'Client (Homeowner)',   iconTheme: 'gold'   },
  { value: 'clinic',       labelAr: 'عيادة',            labelEn: 'Clinic',              iconTheme: 'cyan'   },
  { value: 'restaurant',   labelAr: 'مطعم',             labelEn: 'Restaurant',          iconTheme: 'red'    },
  { value: 'other',        labelAr: 'نشاط آخر',         labelEn: 'Other',               iconTheme: 'brown'  },
];

// ─── Bottom Nav Config per Business Type ───
export interface NavItem {
  id: WsNavTab;
  labelAr: string;
  labelEn: string;
  iconTheme: string;
}

export type WsNavTab = 'dashboard' | 'projects' | 'team' | 'finance' | 'more';

export function getBottomNav(businessType: BusinessType): NavItem[] {
  const base: NavItem[] = [
    { id: 'dashboard', labelAr: 'الرئيسية', labelEn: 'Home',     iconTheme: 'gold'   },
  ];

  // Projects tab (varies by type)
  if (['construction', 'engineering', 'client', 'other'].includes(businessType)) {
    base.push({ id: 'projects', labelAr: 'المشاريع', labelEn: 'Projects', iconTheme: 'blue' });
  } else if (['freelancer'].includes(businessType)) {
    base.push({ id: 'projects', labelAr: 'المهام', labelEn: 'Jobs', iconTheme: 'teal' });
  } else if (['shop', 'restaurant'].includes(businessType)) {
    base.push({ id: 'projects', labelAr: 'الطلبات', labelEn: 'Orders', iconTheme: 'red' });
  }

  // Team (only for businesses with employees)
  if (['construction', 'shop', 'engineering', 'clinic', 'restaurant', 'other'].includes(businessType)) {
    base.push({ id: 'team', labelAr: 'الفريق', labelEn: 'Team', iconTheme: 'purple' });
  }

  // Finance
  if (businessType !== 'client') {
    base.push({ id: 'finance', labelAr: 'المالية', labelEn: 'Finance', iconTheme: 'gold' });
  }

  // More
  base.push({ id: 'more', labelAr: 'المزيد', labelEn: 'More', iconTheme: 'brown' });

  return base;
}

// ─── Finance Categories per Business Type ───
export function getFinanceCategories(businessType: BusinessType, isEn: boolean): { value: string; label: string }[] {
  const common = [
    { value: 'salary', label: isEn ? 'Salaries' : 'رواتب' },
    { value: 'rent', label: isEn ? 'Rent' : 'إيجار' },
    { value: 'utilities', label: isEn ? 'Utilities' : 'مرافق' },
    { value: 'other', label: isEn ? 'Other' : 'أخرى' },
  ];

  if (businessType === 'construction') {
    return [
      { value: 'materials', label: isEn ? 'Materials' : 'مواد بناء' },
      { value: 'labor', label: isEn ? 'Labor' : 'عمالة' },
      { value: 'equipment', label: isEn ? 'Equipment' : 'معدات' },
      { value: 'subcontract', label: isEn ? 'Subcontract' : 'مقاولة باطن' },
      { value: 'client_payment', label: isEn ? 'Client Payment' : 'دفعة عميل' },
      ...common,
    ];
  }

  if (businessType === 'shop') {
    return [
      { value: 'sales', label: isEn ? 'Sales' : 'مبيعات' },
      { value: 'purchase', label: isEn ? 'Purchase' : 'مشتريات' },
      { value: 'shipping', label: isEn ? 'Shipping' : 'شحن' },
      ...common,
    ];
  }

  return [
    { value: 'service_income', label: isEn ? 'Service Income' : 'إيراد خدمة' },
    { value: 'project_payment', label: isEn ? 'Project Payment' : 'دفعة مشروع' },
    ...common,
  ];
}
