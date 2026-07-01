// ====================================
// 🛒 Marketplace Data Model
// بيت الريف - نظام المتجر (UAE)
// ====================================

import { Package, Wrench, Armchair, Palette, Settings, Truck, Store, type LucideIcon } from 'lucide-react';

export type MarketplaceCategory = 
  | 'materials'    // مواد بناء
  | 'tools'        // أدوات
  | 'furniture'    // أثاث
  | 'decor'        // ديكور
  | 'services'     // باقات خدمة
  | 'equipment';   // تأجير معدات

export interface MarketplaceItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: MarketplaceCategory;
  price: number;
  oldPrice?: number;
  unit: string;
  unitEn: string;
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  hasOffer?: boolean;
  providerId: string;
  providerName: string;
  providerNameEn: string;
  images: string[];
  location?: { lat: number; lng: number; city: string; cityEn: string };
}

export interface MarketplaceFilterState {
  category: MarketplaceCategory | 'all';
  sortBy: 'popular' | 'price_low' | 'price_high' | 'rating' | 'near_me';
  minPrice?: number;
  maxPrice?: number;
  hasOffer?: boolean;
  inStockOnly?: boolean;
}

// ====================================
// 📊 Mock Data - بيانات تجريبية (UAE)
// ====================================

export const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  // ===== مواد بناء =====
  {
    id: 'MAT-001',
    title: 'كاونتر رخام طبيعي - كرارا إيطالي',
    titleEn: 'Natural Marble Countertop - Italian Carrara',
    description: 'كاونتر مطبخ رخام كرارا إيطالي أصلي، سماكة 3 سم، مصقول بلمعان عالي، مقاوم للحرارة والبقع، مثالي للمطابخ والحمامات الفاخرة في الفلل والشقق',
    descriptionEn: 'Genuine Italian Carrara marble kitchen countertop, 3cm thickness, high-gloss polished, heat and stain resistant, ideal for luxury kitchens and bathrooms in villas and apartments',
    category: 'materials',
    price: 850,
    oldPrice: 1100,
    unit: 'متر مربع',
    unitEn: 'sqm',
    rating: 4.9,
    reviewsCount: 187,
    isAvailable: true,
    isFeatured: true,
    hasOffer: true,
    providerId: 'PROV-001',
    providerName: 'رخام الإمارات للحجر الطبيعي',
    providerNameEn: 'Emirates Natural Stone',
    images: ['https://images.unsplash.com/photo-1760072513457-651955c7074d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي', cityEn: 'Dubai' }
  },
  {
    id: 'MAT-002',
    title: 'بلاط بورسلان إيطالي - تشطيب مات',
    titleEn: 'Italian Porcelain Tiles - Matte Finish',
    description: 'بلاط بورسلان إيطالي عالي الجودة، مقاس 60×120 سم، تشطيب مات مقاوم للانزلاق، مثالي للأرضيات والجدران، متوفر بألوان متعددة',
    descriptionEn: 'High-quality Italian porcelain tiles, 60x120cm size, matte anti-slip finish, ideal for floors and walls, available in multiple colors',
    category: 'materials',
    price: 95,
    oldPrice: 120,
    unit: 'متر مربع',
    unitEn: 'sqm',
    rating: 4.8,
    reviewsCount: 234,
    isAvailable: true,
    isFeatured: true,
    hasOffer: true,
    providerId: 'PROV-002',
    providerName: 'RAK سيراميكس',
    providerNameEn: 'RAK Ceramics',
    images: ['https://images.unsplash.com/photo-1604589977707-d161da2edb0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    location: { lat: 25.7617, lng: 55.9478, city: 'رأس الخيمة', cityEn: 'Ras Al Khaimah' }
  },
  {
    id: 'MAT-003',
    title: 'باركيه خشب طبيعي - بلوط أوروبي',
    titleEn: 'Natural Wood Parquet - European Oak',
    description: 'باركيه خشب بلوط أوروبي أصلي، سماكة 15 مم، طبقة علوية 4 مم، مقاوم للرطوبة، تركيب سهل بنظام القفل، ضمان 15 سنة',
    descriptionEn: 'Genuine European oak wood parquet, 15mm thickness, 4mm top layer, moisture resistant, easy click-lock installation, 15-year warranty',
    category: 'materials',
    price: 185,
    unit: 'متر مربع',
    unitEn: 'sqm',
    rating: 4.7,
    reviewsCount: 156,
    isAvailable: true,
    providerId: 'PROV-003',
    providerName: 'الخليج للأرضيات',
    providerNameEn: 'Gulf Flooring',
    images: ['https://images.unsplash.com/photo-1693948568453-a3564f179a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي', cityEn: 'Dubai' }
  },
  {
    id: 'MAT-004',
    title: 'أسمنت بورتلاند - درجة أولى',
    titleEn: 'Portland Cement - Grade 1',
    description: 'أسمنت بورتلاند عالي الجودة من مصنع الإمارات، مقاوم للرطوبة والحرارة، مناسب لجميع أعمال البناء والتشطيب',
    descriptionEn: 'High-quality Portland cement from Emirates Factory, moisture and heat resistant, suitable for all construction and finishing works',
    category: 'materials',
    price: 25,
    oldPrice: 30,
    unit: 'كيس 50 كجم',
    unitEn: '50kg bag',
    rating: 4.8,
    reviewsCount: 312,
    isAvailable: true,
    hasOffer: true,
    providerId: 'PROV-004',
    providerName: 'مواد البناء الإماراتية',
    providerNameEn: 'UAE Building Materials',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'],
    location: { lat: 24.4539, lng: 54.3773, city: 'أبوظبي', cityEn: 'Abu Dhabi' }
  },
  {
    id: 'MAT-005',
    title: 'نوافذ ألمنيوم مزدوجة العزل',
    titleEn: 'Double-Glazed Aluminum Windows',
    description: 'نوافذ ألمنيوم مزدوجة الزجاج، عزل حراري وصوتي ممتاز، مقاومة للتآكل، مناسبة لمناخ الإمارات، تشمل التركيب',
    descriptionEn: 'Double-glazed aluminum windows, excellent thermal and sound insulation, corrosion resistant, suitable for UAE climate, installation included',
    category: 'materials',
    price: 650,
    unit: 'متر مربع',
    unitEn: 'sqm',
    rating: 4.6,
    reviewsCount: 98,
    isAvailable: true,
    providerId: 'PROV-005',
    providerName: 'الفجر للألمنيوم',
    providerNameEn: 'Al Fajr Aluminum',
    images: ['https://images.unsplash.com/photo-1758998256408-ab2c9fbec19b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    location: { lat: 25.3463, lng: 55.4209, city: 'الشارقة', cityEn: 'Sharjah' }
  },

  // ===== أثاث =====
  {
    id: 'FURN-001',
    title: 'طاولة طعام خشب ماسيف - 8 أشخاص',
    titleEn: 'Solid Wood Dining Table - 8 Seater',
    description: 'طاولة طعام من خشب الجوز الطبيعي، تتسع لـ 8 أشخاص، تصميم عصري أنيق، أرجل معدنية مطلية، صناعة يدوية متقنة',
    descriptionEn: 'Natural walnut wood dining table, seats 8, elegant modern design, powder-coated metal legs, fine craftsmanship',
    category: 'furniture',
    price: 4200,
    oldPrice: 5500,
    unit: 'طاولة كاملة',
    unitEn: 'complete table',
    rating: 4.8,
    reviewsCount: 89,
    isAvailable: true,
    isFeatured: true,
    hasOffer: true,
    providerId: 'PROV-006',
    providerName: 'الفخامة للأثاث',
    providerNameEn: 'Al Fakhama Furniture',
    images: ['https://images.unsplash.com/photo-1758977403438-1b8546560d31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي', cityEn: 'Dubai' }
  },
  {
    id: 'FURN-002',
    title: 'خزائن مطبخ حديثة - تصميم كامل',
    titleEn: 'Modern Kitchen Cabinets - Full Design',
    description: 'خزائن مطبخ MDF عالي الكثافة، لاكر أبيض لامع، مفصلات سوفت كلوز، أدراج بنظام البلام بوكس، يشمل التصميم والتركيب',
    descriptionEn: 'High-density MDF kitchen cabinets, glossy white lacquer, soft-close hinges, Blum box drawer system, includes design and installation',
    category: 'furniture',
    price: 12000,
    oldPrice: 15000,
    unit: 'متر طولي',
    unitEn: 'linear meter',
    rating: 4.9,
    reviewsCount: 145,
    isAvailable: true,
    isFeatured: true,
    hasOffer: true,
    providerId: 'PROV-007',
    providerName: 'المطابخ الذكية',
    providerNameEn: 'Smart Kitchens',
    images: ['https://images.unsplash.com/photo-1682888818602-b4492fadf2f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي', cityEn: 'Dubai' }
  },
  {
    id: 'FURN-003',
    title: 'وحدة حمام فاخرة مع مرآة LED',
    titleEn: 'Luxury Bathroom Vanity with LED Mirror',
    description: 'وحدة حمام خشبية مع حوض سيراميك مدمج، مرآة LED مضيئة، أدراج سوفت كلوز، مقاسات متعددة، تصميم إيطالي',
    descriptionEn: 'Wooden bathroom vanity with integrated ceramic basin, LED illuminated mirror, soft-close drawers, multiple sizes, Italian design',
    category: 'furniture',
    price: 3800,
    oldPrice: 4500,
    unit: 'وحدة كاملة',
    unitEn: 'complete unit',
    rating: 4.7,
    reviewsCount: 112,
    isAvailable: true,
    hasOffer: true,
    providerId: 'PROV-008',
    providerName: 'سانيتاري هاوس',
    providerNameEn: 'Sanitary House',
    images: ['https://images.unsplash.com/photo-1768413292551-10011d6c354e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي', cityEn: 'Dubai' }
  },

  // ===== ديكور =====
  {
    id: 'DECOR-001',
    title: 'جبس بورد - أسقف مستعارة مودرن',
    titleEn: 'Gypsum Board - Modern False Ceiling',
    description: 'تصميم وتنفيذ أسقف جبس بورد مع إضاءة مخفية LED، تصاميم عصرية متنوعة، مقاوم للرطوبة، يشمل المواد والتركيب',
    descriptionEn: 'Design and installation of gypsum board ceilings with hidden LED lighting, various modern designs, moisture resistant, includes materials and installation',
    category: 'decor',
    price: 120,
    oldPrice: 160,
    unit: 'متر مربع',
    unitEn: 'sqm',
    rating: 4.8,
    reviewsCount: 198,
    isAvailable: true,
    isFeatured: true,
    hasOffer: true,
    providerId: 'PROV-009',
    providerName: 'ديكور الإمارات',
    providerNameEn: 'Emirates Decor',
    images: ['https://images.unsplash.com/photo-1561208885-a4a5a0ccc359?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي', cityEn: 'Dubai' }
  },
  {
    id: 'DECOR-002',
    title: 'إضاءة LED كريستال معلقة',
    titleEn: 'Crystal LED Pendant Chandelier',
    description: 'ثريا كريستال LED حديثة، تحكم بالريموت وتطبيق الهاتف، 3 درجات إضاءة، توفير طاقة 80%، ضمان 3 سنوات',
    descriptionEn: 'Modern crystal LED chandelier, remote & app control, 3 brightness levels, 80% energy saving, 3-year warranty',
    category: 'decor',
    price: 1450,
    oldPrice: 1900,
    unit: 'قطعة',
    unitEn: 'piece',
    rating: 4.7,
    reviewsCount: 134,
    isAvailable: true,
    hasOffer: true,
    providerId: 'PROV-009',
    providerName: 'ديكور الإمارات',
    providerNameEn: 'Emirates Decor',
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي', cityEn: 'Dubai' }
  },

  // ===== أدوات =====
  {
    id: 'TOOL-001',
    title: 'دريل كهربائي بوش احترافي',
    titleEn: 'Bosch Professional Electric Drill',
    description: 'دريل بوش 750 واط، مع مجموعة ملحقات 100 قطعة، ظرف 13 مم، سرعتان، ضمان سنتين من الوكيل المعتمد',
    descriptionEn: 'Bosch 750W drill, with 100-piece accessory set, 13mm chuck, 2-speed, 2-year authorized dealer warranty',
    category: 'tools',
    price: 450,
    oldPrice: 550,
    unit: 'قطعة',
    unitEn: 'piece',
    rating: 4.9,
    reviewsCount: 267,
    isAvailable: true,
    isFeatured: true,
    hasOffer: true,
    providerId: 'PROV-010',
    providerName: 'أدوات الخليج',
    providerNameEn: 'Gulf Tools',
    images: ['https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي', cityEn: 'Dubai' }
  },
  {
    id: 'TOOL-002',
    title: 'منشار كهربائي دائري ماكيتا',
    titleEn: 'Makita Circular Electric Saw',
    description: 'منشار دائري ماكيتا 1800 واط، قطر القرص 185 مم، عمق قطع 65 مم، مثالي للخشب والبلاستيك، ضمان سنة',
    descriptionEn: 'Makita 1800W circular saw, 185mm blade diameter, 65mm cutting depth, ideal for wood and plastic, 1-year warranty',
    category: 'tools',
    price: 380,
    unit: 'قطعة',
    unitEn: 'piece',
    rating: 4.7,
    reviewsCount: 145,
    isAvailable: true,
    providerId: 'PROV-010',
    providerName: 'أدوات الخليج',
    providerNameEn: 'Gulf Tools',
    images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي', cityEn: 'Dubai' }
  },

  // ===== خدمات =====
  {
    id: 'SRV-001',
    title: 'باقة صيانة شاملة - فيلا/شقة',
    titleEn: 'Comprehensive Maintenance Package - Villa/Apartment',
    description: 'باقة صيانة سنوية شاملة: كهرباء، سباكة، تكييف، دهانات. 4 زيارات سنوية + طوارئ 24/7. تغطي جميع إمارات الدولة',
    descriptionEn: 'Annual comprehensive maintenance package: electrical, plumbing, AC, painting. 4 annual visits + 24/7 emergency. Covers all UAE emirates',
    category: 'services',
    price: 1200,
    oldPrice: 1500,
    unit: 'باقة سنوية',
    unitEn: 'annual package',
    rating: 4.9,
    reviewsCount: 289,
    isAvailable: true,
    isFeatured: true,
    hasOffer: true,
    providerId: 'PROV-011',
    providerName: 'الصيانة المتكاملة',
    providerNameEn: 'Integrated Maintenance',
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي', cityEn: 'Dubai' }
  },
  {
    id: 'SRV-002',
    title: 'خدمة تنظيف عميق للفلل',
    titleEn: 'Deep Cleaning Service for Villas',
    description: 'خدمة تنظيف عميق احترافية للفلل والشقق، فريق مدرب، مواد آمنة، تشمل: الأرضيات، النوافذ، المطابخ، الحمامات',
    descriptionEn: 'Professional deep cleaning service for villas and apartments, trained team, safe materials, includes: floors, windows, kitchens, bathrooms',
    category: 'services',
    price: 450,
    unit: 'جلسة',
    unitEn: 'session',
    rating: 4.8,
    reviewsCount: 356,
    isAvailable: true,
    providerId: 'PROV-012',
    providerName: 'التنظيف المثالي',
    providerNameEn: 'Perfect Cleaning',
    images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي', cityEn: 'Dubai' }
  },

  // ===== تأجير معدات =====
  {
    id: 'EQ-001',
    title: 'رافعة شوكية - 3 طن',
    titleEn: 'Forklift - 3 Ton',
    description: 'رافعة شوكية حمولة 3 طن، ارتفاع رفع 6 متر، سائق محترف متوفر، توصيل لموقع المشروع في جميع الإمارات',
    descriptionEn: 'Forklift 3-ton capacity, 6m lift height, professional driver available, delivery to project site across all UAE emirates',
    category: 'equipment',
    price: 500,
    unit: 'يوم',
    unitEn: 'day',
    rating: 4.7,
    reviewsCount: 78,
    isAvailable: true,
    providerId: 'PROV-013',
    providerName: 'تأجير المعدات الثقيلة',
    providerNameEn: 'Heavy Equipment Rental',
    images: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800'],
    location: { lat: 24.4539, lng: 54.3773, city: 'أبوظبي', cityEn: 'Abu Dhabi' }
  },
  {
    id: 'EQ-002',
    title: 'خلاطة إسمنت احترافية',
    titleEn: 'Professional Cement Mixer',
    description: 'خلاطة إسمنت احترافية، سعة 350 لتر، محرك كهربائي قوي، سهلة النقل، مثالية لمشاريع البناء المتوسطة',
    descriptionEn: 'Professional cement mixer, 350L capacity, powerful electric motor, easy to transport, ideal for medium construction projects',
    category: 'equipment',
    price: 180,
    unit: 'يوم',
    unitEn: 'day',
    rating: 4.6,
    reviewsCount: 45,
    isAvailable: true,
    providerId: 'PROV-013',
    providerName: 'تأجير المعدات الثقيلة',
    providerNameEn: 'Heavy Equipment Rental',
    images: ['https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800'],
    location: { lat: 24.4539, lng: 54.3773, city: 'أبوظبي', cityEn: 'Abu Dhabi' }
  }
];

// ====================================
// 🏷️ Category Labels (Bilingual)
// ====================================

export const CATEGORY_LABELS: Record<MarketplaceCategory | 'all', string> = {
  all: 'الكل',
  materials: 'مواد بناء',
  tools: 'أدوات',
  furniture: 'أثاث',
  decor: 'ديكور',
  services: 'باقات خدمة',
  equipment: 'تأجير معدات'
};

export const CATEGORY_LABELS_EN: Record<MarketplaceCategory | 'all', string> = {
  all: 'All',
  materials: 'Building Materials',
  tools: 'Tools',
  furniture: 'Furniture',
  decor: 'Decor',
  services: 'Service Packages',
  equipment: 'Equipment Rental'
};

export const CATEGORY_ICONS: Record<MarketplaceCategory, LucideIcon> = {
  materials: Package,
  tools: Wrench,
  furniture: Armchair,
  decor: Palette,
  services: Settings,
  equipment: Truck,
};

export const CATEGORY_ICON_COLORS: Record<MarketplaceCategory | 'all', string> = {
  all: '#4A90E2',
  materials: '#D97706',
  tools: '#2AA676',
  furniture: '#8B5CF6',
  decor: '#EC4899',
  services: '#6B7280',
  equipment: '#059669',
};