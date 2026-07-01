// ====================================
// 🔍 Smart Search Data
// بيت الريف - بيانات البحث الذكي
// ====================================

import { sectionsTree } from './sectionsTree';
import { MOCK_MARKETPLACE_ITEMS } from './marketplace';

// نوع نتيجة البحث
export interface SearchResult {
  id: string;
  type: 'service' | 'provider' | 'product' | 'category';
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon?: string;
  image?: string;
  rating?: number;
  reviews?: number;
  price?: number;
  distance?: string;
  verified?: boolean;
  availability?: 'online' | 'busy' | 'offline';
  category?: string;
  route?: string;
  serviceId?: string; // لربط الخدمة بصفحتها
  tags?: string[]; // كلمات مفتاحية للبحث
}

// ====================================
// 📋 Services Data - بيانات الخدمات
// ====================================

export const SERVICES_SEARCH_DATA: SearchResult[] = [
  {
    id: 'constructionContracting',
    type: 'service',
    titleAr: 'مقاولات البناء',
    titleEn: 'Construction Contracting',
    descriptionAr: 'مقاولو بناء معتمدون للفلل والمباني السكنية والتجارية',
    descriptionEn: 'Certified construction contractors for villas and residential/commercial buildings',
    icon: '🏗️',
    serviceId: 'constructionContracting',
    route: '/services/construction-contracting',
    tags: ['بناء', 'مقاول', 'فلل', 'عمارات', 'construction', 'contractor', 'building']
  },
  {
    id: 'engineeringConsultation',
    type: 'service',
    titleAr: 'الاستشارات الهندسية',
    titleEn: 'Engineering Consultation',
    descriptionAr: 'استشارات هندسية معمارية وإنشائية وميكانيكية وكهربائية',
    descriptionEn: 'Architectural, structural, mechanical and electrical engineering consultations',
    icon: '📐',
    serviceId: 'engineeringConsultation',
    route: '/services/engineering-consultation',
    tags: ['استشارات', 'هندسة', 'معماري', 'مهندس', 'تصميم', 'engineering', 'consultant', 'architect']
  },
  {
    id: 'maintenance',
    type: 'service',
    titleAr: 'شركات الصيانة',
    titleEn: 'Maintenance Companies',
    descriptionAr: 'صيانة شاملة: سباكة، كهرباء، تكييف، دهان وأكثر',
    descriptionEn: 'Comprehensive maintenance: plumbing, electrical, AC, painting and more',
    icon: '🔧',
    serviceId: 'maintenance',
    route: '/services/maintenance-companies',
    tags: ['صيانة', 'سباكة', 'كهرباء', 'تكييف', 'دهان', 'maintenance', 'plumbing', 'electrical', 'ac', 'painting']
  },
  {
    id: 'craftsmen',
    type: 'service',
    titleAr: 'العمالة الحرفية',
    titleEn: 'Craftsmen',
    descriptionAr: 'حرفيون ماهرون: نجارة، حدادة، بلاط، جبس وأكثر',
    descriptionEn: 'Skilled craftsmen: carpentry, metalwork, tiling, gypsum and more',
    icon: '👷',
    serviceId: 'craftsmen',
    route: '/services/craftsmen',
    tags: ['عمالة', 'حرفي', 'نجار', 'حداد', 'بلاط', 'جبس', 'craftsmen', 'labor', 'carpenter', 'tiling']
  },
  {
    id: 'workshops',
    type: 'service',
    titleAr: 'الورش',
    titleEn: 'Workshops',
    descriptionAr: 'ورش متخصصة: نجارة، حدادة، ألمنيوم، رخام وجرانيت',
    descriptionEn: 'Specialized workshops: carpentry, metalwork, aluminum, marble and granite',
    icon: '⚙️',
    serviceId: 'workshops',
    route: '/services/workshops',
    tags: ['ورشة', 'نجارة', 'حدادة', 'ألمنيوم', 'رخام', 'workshop', 'carpentry', 'aluminum', 'marble']
  },
  {
    id: 'equipmentRental',
    type: 'service',
    titleAr: 'تأجير المعدات',
    titleEn: 'Equipment Rental',
    descriptionAr: 'تأجير معدات البناء الثقيلة والخفيفة بأفضل الأسعار',
    descriptionEn: 'Heavy and light construction equipment rental at best prices',
    icon: '🚜',
    serviceId: 'equipmentRental',
    route: '/services/equipment-rental',
    tags: ['تأجير', 'معدات', 'رافعة', 'جرافة', 'equipment', 'rental', 'crane', 'excavator']
  },
  {
    id: 'buildingMaterials',
    type: 'service',
    titleAr: 'محلات مواد البناء',
    titleEn: 'Building Materials Stores',
    descriptionAr: 'مواد بناء عالية الجودة: أسمنت، طوب، رمل، حديد وأكثر',
    descriptionEn: 'High quality building materials: cement, bricks, sand, steel and more',
    icon: '🧱',
    serviceId: 'buildingMaterials',
    route: '/services/building-materials',
    tags: ['مواد', 'بناء', 'أسمنت', 'طوب', 'رمل', 'حديد', 'materials', 'cement', 'bricks', 'sand', 'steel']
  },
  {
    id: 'furnitureDecor',
    type: 'service',
    titleAr: 'محلات الأثاث والديكور',
    titleEn: 'Furniture & Decor Stores',
    descriptionAr: 'أثاث وديكور فاخر لجميع الأذواق والميزانيات',
    descriptionEn: 'Luxury furniture and decor for all tastes and budgets',
    icon: '🛋️',
    serviceId: 'furnitureDecor',
    route: '/services/furniture-stores',
    tags: ['أثاث', 'ديكور', 'كنب', 'طاولة', 'مطبخ', 'furniture', 'decor', 'sofa', 'table', 'kitchen']
  },
  {
    id: 'cleaning',
    type: 'service',
    titleAr: 'خدمات التنظيف',
    titleEn: 'Cleaning Services',
    descriptionAr: 'خدمات تنظيف احترافية للمنازل والمكاتب والفلل',
    descriptionEn: 'Professional cleaning services for homes, offices and villas',
    icon: '✨',
    serviceId: 'cleaning',
    route: '/services/cleaning-services',
    tags: ['تنظيف', 'نظافة', 'تعقيم', 'منازل', 'cleaning', 'sterilization', 'homes']
  }
];

// ====================================
// 👷 Service Providers - مزودو الخدمات
// ====================================

export const PROVIDERS_SEARCH_DATA: SearchResult[] = [
  // سباكة
  {
    id: 'BR-000245',
    type: 'provider',
    titleAr: 'أحمد المهندس',
    titleEn: 'Ahmad Al Muhandis',
    descriptionAr: 'سباكة وصيانة عامة - خبرة 15 سنة',
    descriptionEn: 'Plumbing and general maintenance - 15 years experience',
    image: 'https://images.unsplash.com/photo-1731694411560-050e5b91e943?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    rating: 4.9,
    reviews: 156,
    price: 150,
    distance: '2.3 كم',
    verified: true,
    availability: 'online',
    category: 'سباكة',
    tags: ['سباك', 'سباكة', 'تسليك', 'مواسير', 'plumber', 'plumbing', 'pipes']
  },
  {
    id: 'BR-001823',
    type: 'provider',
    titleAr: 'مؤسسة النور للكهرباء',
    titleEn: 'Al Noor Electrical',
    descriptionAr: 'كهرباء منزلية وصناعية - معتمد من هيئة الكهرباء',
    descriptionEn: 'Residential and industrial electrical - Certified by Electricity Authority',
    image: 'https://images.unsplash.com/photo-1758101755915-462eddc23f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    rating: 4.8,
    reviews: 234,
    price: 200,
    distance: '1.2 كم',
    verified: true,
    availability: 'online',
    category: 'كهرباء',
    tags: ['كهرباء', 'كهربائي', 'أعطال', 'تركيب', 'electrical', 'electrician', 'installation']
  },
  {
    id: 'BR-002456',
    type: 'provider',
    titleAr: 'خالد التكييف',
    titleEn: 'Khaled AC Services',
    descriptionAr: 'صيانة وتركيب مكيفات - جميع الأنواع',
    descriptionEn: 'AC maintenance and installation - All types',
    image: 'https://images.unsplash.com/photo-1647022528152-52ed9338611d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    rating: 4.7,
    reviews: 189,
    price: 180,
    distance: '3.5 كم',
    verified: true,
    availability: 'busy',
    category: 'تكييف',
    tags: ['تكييف', 'مكيف', 'تبريد', 'صيانة', 'ac', 'air conditioning', 'cooling', 'maintenance']
  },
  {
    id: 'BR-003789',
    type: 'provider',
    titleAr: 'شركة الألوان الجميلة',
    titleEn: 'Beautiful Colors Company',
    descriptionAr: 'دهانات داخلية وخارجية - جودة عالية',
    descriptionEn: 'Interior and exterior painting - High quality',
    image: 'https://images.unsplash.com/photo-1643804475756-ca849847c78a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    rating: 4.9,
    reviews: 278,
    price: 250,
    distance: '4.8 كم',
    verified: true,
    availability: 'online',
    category: 'دهان',
    tags: ['دهان', 'طلاء', 'ديكور', 'ألوان', 'painting', 'paint', 'colors', 'decor']
  },
  {
    id: 'BR-004512',
    type: 'provider',
    titleAr: 'نجارة الفخامة',
    titleEn: 'Luxury Carpentry',
    descriptionAr: 'نجارة مطابخ وخزائن - تصميم وتنفيذ',
    descriptionEn: 'Kitchen and cabinet carpentry - Design and execution',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    rating: 4.8,
    reviews: 145,
    price: 300,
    distance: '5.2 كم',
    verified: true,
    availability: 'online',
    category: 'نجارة',
    tags: ['نجارة', 'نجار', 'مطبخ', 'خزائن', 'أخشاب', 'carpentry', 'carpenter', 'kitchen', 'cabinets']
  },
  {
    id: 'BR-005623',
    type: 'provider',
    titleAr: 'مقاولات البناء المتحدة',
    titleEn: 'United Construction Contractors',
    descriptionAr: 'مقاولات عامة - فلل ومباني تجارية',
    descriptionEn: 'General contracting - Villas and commercial buildings',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    rating: 4.9,
    reviews: 312,
    price: 50000,
    distance: '6.1 كم',
    verified: true,
    availability: 'online',
    category: 'مقاولات',
    tags: ['مقاول', 'بناء', 'فلل', 'عمارات', 'contractor', 'construction', 'building', 'villas']
  },
  {
    id: 'BR-006734',
    type: 'provider',
    titleAr: 'شركة النظافة المثالية',
    titleEn: 'Perfect Cleaning Company',
    descriptionAr: 'تنظيف شامل - منازل ومكاتب وفلل',
    descriptionEn: 'Comprehensive cleaning - Homes, offices and villas',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    rating: 4.7,
    reviews: 267,
    price: 350,
    distance: '3.8 كم',
    verified: true,
    availability: 'online',
    category: 'تنظيف',
    tags: ['تنظيف', 'نظافة', 'تعقيم', 'cleaning', 'sterilization']
  },
  {
    id: 'BR-007845',
    type: 'provider',
    titleAr: 'بلاط الإمارات',
    titleEn: 'Emirates Tiling',
    descriptionAr: 'تركيب بلاط ورخام وجرانيت - جودة عالية',
    descriptionEn: 'Tiling, marble and granite installation - High quality',
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    rating: 4.8,
    reviews: 198,
    price: 220,
    distance: '4.5 كم',
    verified: true,
    availability: 'busy',
    category: 'بلاط',
    tags: ['بلاط', 'رخام', 'جرانيت', 'سيراميك', 'tiling', 'marble', 'granite', 'ceramic']
  }
];

// ====================================
// 🛒 Marketplace Products - منتجات المتجر
// ====================================

export const PRODUCTS_SEARCH_DATA: SearchResult[] = MOCK_MARKETPLACE_ITEMS.map(item => ({
  id: item.id,
  type: 'product',
  titleAr: item.title,
  titleEn: item.title, // في الإنتاج، ستكون هناك ترجمات
  descriptionAr: item.description,
  descriptionEn: item.description,
  image: item.images[0],
  rating: item.rating,
  reviews: item.reviewsCount,
  price: item.price,
  category: item.category,
  verified: true,
  tags: [item.title, item.category, item.providerName]
}));

// ====================================
// 🔍 Search Function - دالة البحث
// ====================================

export interface SearchFilters {
  rating?: number;
  priceRange?: 'budget' | 'mid' | 'premium' | 'all';
  verified?: boolean;
  availability?: 'online' | 'all';
  type?: 'service' | 'provider' | 'product' | 'all';
  category?: string;
}

export function searchAll(query: string, filters?: SearchFilters): SearchResult[] {
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery && !filters) {
    return [];
  }

  // دمج جميع البيانات
  const allData = [
    ...SERVICES_SEARCH_DATA,
    ...PROVIDERS_SEARCH_DATA,
    ...PRODUCTS_SEARCH_DATA
  ];

  let results = allData;

  // البحث النصي + البحث بالـ ID
  if (lowerQuery) {
    results = results.filter(item => {
      // Search by ID first (exact or partial match)
      if (item.id.toLowerCase().includes(lowerQuery)) return true;
      if (item.serviceId && item.serviceId.toLowerCase().includes(lowerQuery)) return true;

      const searchIn = [
        item.titleAr,
        item.titleEn,
        item.descriptionAr,
        item.descriptionEn,
        item.category || '',
        ...(item.tags || [])
      ].join(' ').toLowerCase();

      return searchIn.includes(lowerQuery);
    });
  }

  // تطبيق الفلاتر
  if (filters) {
    // فلتر التقييم
    if (filters.rating && filters.rating > 0) {
      results = results.filter(item => (item.rating || 0) >= filters.rating!);
    }

    // فلتر السعر
    if (filters.priceRange && filters.priceRange !== 'all') {
      results = results.filter(item => {
        if (!item.price) return false;
        
        if (filters.priceRange === 'budget') {
          return item.price < 500;
        } else if (filters.priceRange === 'mid') {
          return item.price >= 500 && item.price < 2000;
        } else if (filters.priceRange === 'premium') {
          return item.price >= 2000;
        }
        return true;
      });
    }

    // فلتر الموثوق
    if (filters.verified) {
      results = results.filter(item => item.verified === true);
    }

    // فلتر المتاح الآن
    if (filters.availability === 'online') {
      results = results.filter(item => item.availability === 'online');
    }

    // فلتر النوع
    if (filters.type && filters.type !== 'all') {
      results = results.filter(item => item.type === filters.type);
    }
  }

  // ترتيب النتائج حسب الأهمية
  results.sort((a, b) => {
    // الخدمات أولاً، ثم المزودين، ثم المنتجات
    const typeOrder = { service: 0, provider: 1, product: 2, category: 3 };
    const aOrder = typeOrder[a.type] || 999;
    const bOrder = typeOrder[b.type] || 999;
    
    if (aOrder !== bOrder) return aOrder - bOrder;
    
    // ثم حسب التقييم
    return (b.rating || 0) - (a.rating || 0);
  });

  return results;
}

// ====================================
// 💡 Search Suggestions - اقتراحات البحث
// ====================================

export const POPULAR_SEARCHES = [
  'سباك في دبي',
  'كهربائي قريب مني',
  'دهان فلل',
  'تكييف صيانة',
  'نجار مطابخ',
  'مقاول بناء',
  'تنظيف منازل',
  'بلاط ورخام'
];

export const TRENDING_SEARCHES = [
  'سباكة طوارئ',
  'كهربائي معتمد',
  'دهان فلل فاخرة',
  'تنظيف عميق',
  'نجارة مطابخ',
  'مقاولات بناء'
];

export const QUICK_CATEGORIES = [
  { id: 'plumbing', label: 'سباكة', labelEn: 'Plumbing', icon: '💧', searchQuery: 'سباكة' },
  { id: 'electrical', label: 'كهرباء', labelEn: 'Electrical', icon: '⚡', searchQuery: 'كهرباء' },
  { id: 'ac', label: 'تكييف', labelEn: 'AC', icon: '❄️', searchQuery: 'تكييف' },
  { id: 'painting', label: 'دهان', labelEn: 'Painting', icon: '🎨', searchQuery: 'دهان' },
  { id: 'cleaning', label: 'تنظيف', labelEn: 'Cleaning', icon: '✨', searchQuery: 'تنظيف' },
  { id: 'carpentry', label: 'نجارة', labelEn: 'Carpentry', icon: '🪵', searchQuery: 'نجارة' },
];

export const UAE_CITIES = [
  'دبي',
  'أبوظبي',
  'الشارقة',
  'عجمان',
  'رأس الخيمة',
  'الفجيرة',
  'أم القيوين'
];
