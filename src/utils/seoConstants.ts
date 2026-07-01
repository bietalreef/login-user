// ──────────────────────────────────────────────────
// بيت الريف — SEO Constants (محدّث)
// بنية شاملة لتهيئة محركات البحث المحلي في الإمارات
// ──────────────────────────────────────────────────

// الدومين الرسمي للتطبيق
export const SITE_DOMAIN = 'https://app.bietalreef.ae';
export const SITE_NAME_AR = 'بيت الريف';
export const SITE_NAME_EN = 'Bait Al Reef';
export const SITE_TAGLINE_AR = 'منصة البناء والصيانة الذكية في الإمارات';
export const SITE_TAGLINE_EN = 'UAE Smart Construction & Maintenance Platform';
export const SITE_PHONE = '+971-50-000-0000'; // TODO: Replace with real phone
export const SITE_EMAIL = 'info@bietalreef.ae';

// ──────────────────────────────────────────────────
// الإمارات والمدن
// ──────────────────────────────────────────────────
export interface CityInfo {
  slug: string;
  nameAr: string;
  nameEn: string;
  region: string;
  lat: string;
  lng: string;
  // أحياء شهيرة لاستهداف SEO محلي
  neighborhoods?: { nameAr: string; nameEn: string }[];
}

export const EMIRATES_AND_CITIES: CityInfo[] = [
  {
    slug: 'dubai', nameAr: 'دبي', nameEn: 'Dubai', region: 'Dubai',
    lat: '25.2048', lng: '55.2708',
    neighborhoods: [
      { nameAr: 'البرشاء', nameEn: 'Al Barsha' },
      { nameAr: 'جميرا', nameEn: 'Jumeirah' },
      { nameAr: 'ديرة', nameEn: 'Deira' },
      { nameAr: 'بر دبي', nameEn: 'Bur Dubai' },
      { nameAr: 'المرابع العربية', nameEn: 'Arabian Ranches' },
    ]
  },
  {
    slug: 'abu-dhabi', nameAr: 'أبوظبي', nameEn: 'Abu Dhabi', region: 'Abu Dhabi',
    lat: '24.4539', lng: '54.3773',
    neighborhoods: [
      { nameAr: 'الريف', nameEn: 'Al Reef' },
      { nameAr: 'مدينة خليفة', nameEn: 'Khalifa City' },
      { nameAr: 'المصفح', nameEn: 'Musaffah' },
    ]
  },
  {
    slug: 'al-ain', nameAr: 'العين', nameEn: 'Al Ain', region: 'Abu Dhabi',
    lat: '24.2075', lng: '55.7447',
  },
  {
    slug: 'sharjah', nameAr: 'الشارقة', nameEn: 'Sharjah', region: 'Sharjah',
    lat: '25.3573', lng: '55.4033',
  },
  {
    slug: 'ajman', nameAr: 'عجمان', nameEn: 'Ajman', region: 'Ajman',
    lat: '25.4052', lng: '55.5136',
  },
  {
    slug: 'ras-al-khaimah', nameAr: 'رأس الخيمة', nameEn: 'Ras Al Khaimah', region: 'Ras Al Khaimah',
    lat: '25.7953', lng: '55.9432',
  },
  {
    slug: 'umm-al-quwain', nameAr: 'أم القيوين', nameEn: 'Umm Al Quwain', region: 'Umm Al Quwain',
    lat: '25.5647', lng: '55.5552',
  },
  {
    slug: 'fujairah', nameAr: 'الفجيرة', nameEn: 'Fujairah', region: 'Fujairah',
    lat: '25.1164', lng: '56.3414',
  },
];

// ──────────────────────────────────────────────────
// الخدمات الفعلية (9 أقسام رئيسية) — تطابق sectionsTree + ServiceRouteHandler
// ──────────────────────────────────────────────────
export interface ServiceSEOInfo {
  /** slug يطابق المسار في Router: /services/{slug} */
  slug: string;
  /** الاسم المعروض (عربي) */
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  /** كلمات مفتاحية عربية لـ meta keywords */
  keywordsAr: string[];
  /** كلمات مفتاحية إنجليزية */
  keywordsEn: string[];
  /** نطاق أسعار تقديري */
  priceRange: string;
}

export const SERVICES_SEO: ServiceSEOInfo[] = [
  {
    slug: 'construction-contracting',
    nameAr: 'مقاولات البناء',
    nameEn: 'Construction Contracting',
    descAr: 'مقاولون معتمدون لبناء الفلل والمباني في الإمارات. عروض أسعار فورية ومقارنة بين أفضل شركات المقاولات.',
    descEn: 'Licensed contractors for villa and building construction in UAE. Instant quotes and comparison between top contracting companies.',
    icon: '🏗️',
    keywordsAr: ['مقاولات', 'بناء فلل', 'مقاول عام', 'شركة مقاولات', 'بناء في الإمارات', 'مقاول بناء دبي'],
    keywordsEn: ['construction', 'contractor', 'villa construction UAE', 'building contractor Dubai'],
    priceRange: '50000 - 5000000 د.إ',
  },
  {
    slug: 'engineering-consultation',
    nameAr: 'الاستشارات الهندسية',
    nameEn: 'Engineering Consultation',
    descAr: 'مكاتب استشارات هندسية معتمدة. تصميم معماري، تصميم داخلي وخارجي، إشراف هندسي ومخططات BOQ.',
    descEn: 'Licensed engineering consulting offices. Architectural design, interior/exterior design, supervision and BOQ.',
    icon: '📐',
    keywordsAr: ['استشارات هندسية', 'مكتب هندسي', 'تصميم معماري', 'مهندس معماري', 'تصميم داخلي'],
    keywordsEn: ['engineering consultation', 'architecture firm', 'interior design UAE', 'engineering office'],
    priceRange: '5000 - 500000 د.إ',
  },
  {
    slug: 'maintenance-companies',
    nameAr: 'شركات الصيانة',
    nameEn: 'Maintenance Companies',
    descAr: 'شركات صيانة شاملة في الإمارات. سباكة، كهرباء، تكييف، نجارة، حدادة، دهانات وأكثر.',
    descEn: 'Comprehensive maintenance companies in UAE. Plumbing, electrical, AC, carpentry, welding, painting and more.',
    icon: '🔧',
    keywordsAr: ['صيانة منازل', 'شركة صيانة', 'صيانة فلل', 'سباكة', 'كهرباء', 'تكييف'],
    keywordsEn: ['home maintenance', 'maintenance company', 'villa maintenance', 'plumbing', 'electrical', 'AC repair'],
    priceRange: '100 - 50000 د.إ',
  },
  {
    slug: 'craftsmen',
    nameAr: 'العمالة الحرفية',
    nameEn: 'Craftsmen & Workers',
    descAr: 'عمال وحرفيين مهرة: بناء، جبس، دهانات، تركيب، كهرباء وسباكة. استأجر بالساعة أو المشروع.',
    descEn: 'Skilled workers and craftsmen: masonry, gypsum, painting, installation, electrical and plumbing.',
    icon: '👷',
    keywordsAr: ['عامل بناء', 'حرفي', 'عامل دهانات', 'عامل جبس', 'فني كهرباء', 'فني سباكة'],
    keywordsEn: ['craftsman', 'mason', 'painter', 'electrician', 'plumber', 'worker hire'],
    priceRange: '50 - 5000 د.إ',
  },
  {
    slug: 'workshops',
    nameAr: 'الورش الصناعية',
    nameEn: 'Industrial Workshops',
    descAr: 'ورش حدادة، نجارة، ألمنيوم، زجاج وورش صناعية متخصصة في الإمارات.',
    descEn: 'Welding, carpentry, aluminum, glass and specialized industrial workshops in UAE.',
    icon: '🔨',
    keywordsAr: ['ورشة حدادة', 'ورشة نجارة', 'ورشة ألمنيوم', 'ورشة زجاج', 'ورشة صناعية'],
    keywordsEn: ['welding workshop', 'carpentry workshop', 'aluminum workshop', 'glass workshop'],
    priceRange: '200 - 100000 د.إ',
  },
  {
    slug: 'equipment-rental',
    nameAr: 'تأجير المعدات',
    nameEn: 'Equipment Rental',
    descAr: 'تأجير معدات بناء ثقيلة وخفيفة: رافعات، حفارات، خلاطات إسمنت وسقالات في الإمارات.',
    descEn: 'Heavy and light construction equipment rental: cranes, excavators, concrete mixers and scaffolding in UAE.',
    icon: '🚜',
    keywordsAr: ['تأجير معدات', 'معدات بناء', 'رافعة', 'حفارة', 'سقالات', 'خلاطة إسمنت'],
    keywordsEn: ['equipment rental', 'crane rental', 'excavator rental', 'scaffolding rental UAE'],
    priceRange: '500 - 50000 د.إ',
  },
  {
    slug: 'building-materials',
    nameAr: 'محلات مواد البناء',
    nameEn: 'Building Materials Stores',
    descAr: 'محلات ومتاجر مواد البناء في الإمارات. إسمنت، حديد، طابوق، بلاط، أدوات صحية وكهربائية.',
    descEn: 'Building materials stores in UAE. Cement, steel, bricks, tiles, sanitary and electrical supplies.',
    icon: '🧱',
    keywordsAr: ['مواد بناء', 'محل مواد بناء', 'إسمنت', 'حديد', 'بلاط', 'أدوات صحية'],
    keywordsEn: ['building materials', 'construction supplies', 'cement', 'steel', 'tiles UAE'],
    priceRange: '10 - 500000 د.إ',
  },
  {
    slug: 'furniture-stores',
    nameAr: 'محلات الأثاث والديكور',
    nameEn: 'Furniture & Decor Stores',
    descAr: 'محلات أثاث وديكور في الإمارات. أثاث منزلي، مكتبي، إضاءة، ستائر وإكسسوارات.',
    descEn: 'Furniture and decor stores in UAE. Home furniture, office furniture, lighting, curtains and accessories.',
    icon: '🪑',
    keywordsAr: ['أثاث', 'محل أثاث', 'ديكور', 'أثاث منزلي', 'إضاءة', 'ستائر'],
    keywordsEn: ['furniture store', 'home decor', 'furniture UAE', 'lighting', 'curtains'],
    priceRange: '100 - 200000 د.إ',
  },
  {
    slug: 'cleaning-services',
    nameAr: 'خدمات النظافة',
    nameEn: 'Cleaning Services',
    descAr: 'شركات تنظيف منازل، فلل، مباني وما بعد البناء في الإمارات. تنظيف عميق وتعقيم.',
    descEn: 'House, villa, building and post-construction cleaning companies in UAE. Deep cleaning and sanitization.',
    icon: '✨',
    keywordsAr: ['تنظيف منازل', 'شركة تنظيف', 'تنظيف فلل', 'تنظيف بعد البناء', 'تعقيم'],
    keywordsEn: ['cleaning service', 'house cleaning', 'villa cleaning', 'deep cleaning UAE'],
    priceRange: '200 - 10000 د.إ',
  },
];

// Older individual service pages (mapped to maintenance sub-pages)
export const INDIVIDUAL_SERVICES_SEO: ServiceSEOInfo[] = [
  {
    slug: 'plumbing',
    nameAr: 'سباكة',
    nameEn: 'Plumbing',
    descAr: 'أفضل فنيي السباكة في الإمارات. تركيب، إصلاح، صيانة أنابيب المياه والصرف الصحي.',
    descEn: 'Best plumbers in UAE. Installation, repair, water pipes and sewage maintenance.',
    icon: '🚿',
    keywordsAr: ['سباك', 'سباكة', 'تسريب مياه', 'صيانة سباكة', 'فني سباكة دبي'],
    keywordsEn: ['plumber', 'plumbing', 'water leak repair', 'plumber Dubai'],
    priceRange: '100 - 5000 د.إ',
  },
  {
    slug: 'electricity',
    nameAr: 'كهرباء',
    nameEn: 'Electrical',
    descAr: 'فنيي كهرباء معتمدين في الإمارات. تمديدات كهربائية، لوحات توزيع، إصلاح أعطال.',
    descEn: 'Licensed electricians in UAE. Electrical wiring, distribution boards, fault repair.',
    icon: '⚡',
    keywordsAr: ['كهربائي', 'فني كهرباء', 'تمديدات كهربائية', 'كهرباء منازل'],
    keywordsEn: ['electrician', 'electrical work', 'wiring', 'electrician Dubai'],
    priceRange: '100 - 10000 د.إ',
  },
  {
    slug: 'ac',
    nameAr: 'تكييف وتبريد',
    nameEn: 'Air Conditioning',
    descAr: 'تركيب وصيانة أجهزة التكييف في الإمارات. تكييف مركزي، سبليت، تنظيف وإصلاح.',
    descEn: 'AC installation and maintenance in UAE. Central AC, split units, cleaning and repair.',
    icon: '❄️',
    keywordsAr: ['تكييف', 'صيانة تكييف', 'تركيب مكيف', 'تكييف مركزي', 'فني تكييف'],
    keywordsEn: ['AC repair', 'AC installation', 'air conditioning', 'AC maintenance Dubai'],
    priceRange: '150 - 15000 د.إ',
  },
  {
    slug: 'painting',
    nameAr: 'دهانات',
    nameEn: 'Painting',
    descAr: 'دهانات داخلية وخارجية في الإمارات. عمال دهان محترفين، جوتن، دهان تكسچر.',
    descEn: 'Interior and exterior painting in UAE. Professional painters, Jotun, texture paint.',
    icon: '🎨',
    keywordsAr: ['دهان', 'عامل دهان', 'دهانات منازل', 'دهان جوتن', 'طلاء'],
    keywordsEn: ['painter', 'painting service', 'house painting', 'Jotun paint Dubai'],
    priceRange: '500 - 30000 د.إ',
  },
  {
    slug: 'construction',
    nameAr: 'بناء وتشييد',
    nameEn: 'Construction',
    descAr: 'خدمات البناء والتشييد في الإمارات. بناء فلل، مباني سكنية وتجارية.',
    descEn: 'Construction services in UAE. Villa construction, residential and commercial buildings.',
    icon: '🏗️',
    keywordsAr: ['بناء', 'تشييد', 'بناء فيلا', 'مقاول بناء'],
    keywordsEn: ['construction', 'building', 'villa construction'],
    priceRange: '50000 - 5000000 د.إ',
  },
  {
    slug: 'carpentry',
    nameAr: 'نجارة',
    nameEn: 'Carpentry',
    descAr: 'نجارين محترفين في الإمارات. أبواب، خزائن، مطابخ، أثاث خشبي مخصص.',
    descEn: 'Professional carpenters in UAE. Doors, wardrobes, kitchens, custom wooden furniture.',
    icon: '🪵',
    keywordsAr: ['نجار', 'نجارة', 'أبواب خشب', 'خزائن', 'مطابخ'],
    keywordsEn: ['carpenter', 'carpentry', 'wooden doors', 'wardrobes'],
    priceRange: '200 - 50000 د.إ',
  },
  {
    slug: 'interior',
    nameAr: 'تصميم داخلي',
    nameEn: 'Interior Design',
    descAr: 'مصممين داخليين في الإمارات. تصميم غرف، صالات، مطابخ وحمامات.',
    descEn: 'Interior designers in UAE. Room, living, kitchen and bathroom design.',
    icon: '🏠',
    keywordsAr: ['تصميم داخلي', 'ديكور', 'مصمم داخلي', 'تصميم فيلا'],
    keywordsEn: ['interior design', 'interior designer', 'decor', 'villa design'],
    priceRange: '5000 - 500000 د.إ',
  },
  {
    slug: 'exterior',
    nameAr: 'تصميم خارجي',
    nameEn: 'Exterior Design',
    descAr: 'تصميم واجهات خارجية في الإمارات. لاندسكيب، حدائق، واجهات مباني.',
    descEn: 'Exterior design in UAE. Landscape, gardens, building facades.',
    icon: '🏛️',
    keywordsAr: ['تصميم خارجي', 'واجهات', 'لاندسكيب', 'حدائق'],
    keywordsEn: ['exterior design', 'landscape', 'facade design', 'garden design'],
    priceRange: '5000 - 300000 د.إ',
  },
  {
    slug: 'consultation',
    nameAr: 'استشارة هندسية',
    nameEn: 'Engineering Consultation',
    descAr: 'استشارات هندسية متخصصة في الإمارات.',
    descEn: 'Specialized engineering consultation in UAE.',
    icon: '📐',
    keywordsAr: ['استشارة هندسية', 'مهندس استشاري'],
    keywordsEn: ['engineering consultant', 'consultation'],
    priceRange: '1000 - 100000 د.إ',
  },
];

// جميع الخدمات (أقسام + فرعية)
export const ALL_SERVICES_SEO = [...SERVICES_SEO, ...INDIVIDUAL_SERVICES_SEO];

// ──────────────────────────────────────────────────
// أدوات الذكاء الاصطناعي
// ──────────────────────────────────────────────────
export const AI_TOOLS_LINKS = [
  { 
    slug: 'wayak-ai-assistant', 
    nameAr: 'وياك - المساعد الذكي',
    nameEn: 'Weyaak AI Assistant',
    description: 'مساعد شخصي لإدارة مشاريع البناء والصيانة بالذكاء الاصطناعي',
    route: '/weyaak',
  },
  { 
    slug: 'building-cost-calculator', 
    nameAr: 'حاسبة تكاليف البناء',
    nameEn: 'Building Cost Calculator',
    description: 'حساب كميات الطابوق والأسمنت والحديد وتكلفة البناء في الإمارات',
    route: '/tools',
  },
  { 
    slug: 'ai-interior-designer', 
    nameAr: 'مصمم الديكور الذكي',
    nameEn: 'AI Interior Designer',
    description: 'تخيل مساحتك وتصميمك الداخلي بالذكاء الاصطناعي قبل التنفيذ',
    route: '/tools',
  },
  { 
    slug: 'quote-analyzer', 
    nameAr: 'محلل عروض الأسعار',
    nameEn: 'Quote Analyzer',
    description: 'مقارنة وتحليل عروض أسعار المقاولين واختيار أفضل عرض',
    route: '/tools',
  },
];

// PRIORITY_SERVICES alias (backward compatibility)
export const PRIORITY_SERVICES = SERVICES_SEO.map(s => ({
  slug: s.slug,
  nameAr: s.nameAr,
  nameEn: s.nameEn,
}));

// ──────────────────────────────────────────────────
// Helper: توليد URLs
// ──────────────────────────────────────────────────

/** /services/{slug} */
export const generateServiceUrl = (serviceSlug: string) => {
  return `/services/${serviceSlug}`;
};

/** /services/{slug}/{citySlug} */
export const generateCityServiceUrl = (serviceSlug: string, citySlug: string) => {
  return `/services/${serviceSlug}/${citySlug}`;
};

/** /ae/{citySlug} — صفحة المدينة */
export const generateCityUrl = (citySlug: string) => {
  return `/services?city=${citySlug}`;
};

export const generateToolUrl = (toolSlug: string) => {
  return `/tools`;
};

// ──────────────────────────────────────────────────
// Lookup Helpers
// ──────────────────────────────────────────────────
export function findServiceBySlug(slug: string): ServiceSEOInfo | undefined {
  return ALL_SERVICES_SEO.find(s => s.slug === slug);
}

export function findCityBySlug(slug: string): CityInfo | undefined {
  return EMIRATES_AND_CITIES.find(c => c.slug === slug);
}