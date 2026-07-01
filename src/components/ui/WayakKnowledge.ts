/**
 * WayakKnowledge.ts — قاعدة معرفة مساعد وياك
 * ═══════════════════════════════════════════════
 * كل ما يحتاجه وياك ليعرف عن التطبيق بالكامل
 * يُستخدم في WayakCompanion و WayakScreen
 */

export interface AppSection {
  id: string;
  route: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  features_ar: string[];
  features_en: string[];
  tips_ar: string[];
  tips_en: string[];
  requiredTier: 'guest' | 'free' | 'pro' | 'enterprise';
  icon: string; // lucide icon name
  category: 'main' | 'tools' | 'commerce' | 'social' | 'admin';
}

export interface FAQ {
  id: string;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
  section: string;
  tags: string[];
}

// ═══════════════════════════════════════
// أقسام التطبيق الكاملة
// ═══════════════════════════════════════

export const APP_SECTIONS: AppSection[] = [
  {
    id: 'home',
    route: '/home',
    name_ar: 'الرئيسية',
    name_en: 'Home',
    description_ar: 'الصفحة الرئيسية — نظرة شاملة على كل خدمات بيت الريف مع عروض ومقترحات ذكية',
    description_en: 'Home page — overview of all Beit Al Reef services with smart suggestions',
    features_ar: ['عروض مخصصة لك', 'أحدث المزودين', 'أدوات ذكية سريعة', 'توصيات وياك', 'بانر العروض'],
    features_en: ['Personalized offers', 'Latest providers', 'Quick smart tools', 'Wayak recommendations', 'Offers banner'],
    tips_ar: ['اسحب لأسفل لتحديث المحتوى', 'اضغط على أي بطاقة للتفاصيل'],
    tips_en: ['Pull down to refresh', 'Tap any card for details'],
    requiredTier: 'guest',
    icon: 'Home',
    category: 'main',
  },
  {
    id: 'services',
    route: '/services',
    name_ar: 'الخدمات',
    name_en: 'Services',
    description_ar: '9 أقسام رئيسية لخدمات البناء والتشطيب في الإمارات — من المقاولات للأثاث',
    description_en: '9 main construction & finishing service categories across UAE',
    features_ar: [
      'مقاولات البناء والتشييد', 'الاستشارات الهندسية', 'شركات الصيانة',
      'العمالة الحرفية (سباكة، كهرباء، نجارة...)', 'الورش المتخصصة',
      'تأجير المعدات الثقيلة', 'محلات مواد البناء', 'محلات الأثاث والديكور',
      'خدمات النظافة والتعقيم',
    ],
    features_en: [
      'Construction contracting', 'Engineering consultation', 'Maintenance companies',
      'Craftsmen (plumbing, electrical, carpentry...)', 'Specialized workshops',
      'Heavy equipment rental', 'Building materials stores', 'Furniture & decor stores',
      'Cleaning & sanitization services',
    ],
    tips_ar: ['كل قسم فيه مزودين موثقين بتقييمات حقيقية', 'استخدم الفلاتر للتصفية حسب الإمارة'],
    tips_en: ['Each section has verified providers with real ratings', 'Use filters by emirate'],
    requiredTier: 'guest',
    icon: 'Wrench',
    category: 'main',
  },
  {
    id: 'maps',
    route: '/maps',
    name_ar: 'خريطة المزودين',
    name_en: 'Providers Map',
    description_ar: 'خريطة Google Maps تفاعلية تعرض كل مزودي الخدمات والمتاجر في الإمارات السبع',
    description_en: 'Interactive Google Maps showing all service providers and stores across 7 emirates',
    features_ar: [
      'خريطة تفاعلية بتصميم Biet Al Reef Clean',
      'ماركرات ملونة حسب فئة المزود',
      'بحث فوري عن مزودين ومواد ومناطق',
      'فلاتر (تقييم، موثق فقط)',
      'بطاقة تفاصيل المزود مع إحصائيات',
      'أزرار اتصال وواتساب واتجاهات مباشرة',
      'زر "بالقرب مني" لتحديد موقعك',
      'عرض قائمة جانبية لكل المزودين',
    ],
    features_en: [
      'Interactive map with Biet Al Reef Clean style',
      'Color-coded markers by provider category',
      'Instant search for providers, materials, areas',
      'Filters (rating, verified only)',
      'Provider detail card with stats',
      'Direct call, WhatsApp, navigation buttons',
      '"Near me" location button',
      'Side panel list view',
    ],
    tips_ar: ['اضغط على أي ماركر لمشاهدة تفاصيل المزود', 'فعّل "بالقرب مني" لأفضل تجربة'],
    tips_en: ['Tap any marker to see provider details', 'Enable "Near me" for best experience'],
    requiredTier: 'guest',
    icon: 'MapPin',
    category: 'main',
  },
  {
    id: 'shop',
    route: '/shop',
    name_ar: 'المتجر',
    name_en: 'Store',
    description_ar: 'متجر إلكتروني لمواد البناء والأدوات والأثاث — أسعار حصرية وشحن لكل الإمارات',
    description_en: 'E-commerce store for building materials, tools, furniture — exclusive prices, UAE-wide delivery',
    features_ar: ['منتجات مواد البناء', 'أدوات ومعدات', 'أثاث وديكور', 'عروض حصرية', 'سلة مشتريات', 'تتبع الطلبات', 'تقييم المنتجات'],
    features_en: ['Building materials', 'Tools & equipment', 'Furniture & decor', 'Exclusive offers', 'Shopping cart', 'Order tracking', 'Product reviews'],
    tips_ar: ['تابع العروض اليومية للحصول على أفضل الأسعار', 'استخدم كوبونات الخصم'],
    tips_en: ['Check daily deals for best prices', 'Use discount coupons'],
    requiredTier: 'guest',
    icon: 'ShoppingCart',
    category: 'commerce',
  },
  {
    id: 'tools',
    route: '/tools',
    name_ar: 'الأدوات الذكية',
    name_en: 'Smart Tools',
    description_ar: '14+ أداة ذكية بالذكاء الاصطناعي — حاسبات، مولدات عقود وفواتير، تصميم، تسويق',
    description_en: '14+ AI-powered tools — calculators, contract/invoice generators, design, marketing',
    features_ar: [
      'عرض سعر ذكي', 'فاتورة ضريبية', 'مولد عقود', 'حاسبة مواد بناء',
      'حاسبة تكاليف', 'حاسبة دهان/أرضيات', 'تصميم 2D', 'تصميم 3D',
      'تحويل 2D إلى 3D', 'تخطيط غرف', 'لوحة ألوان', 'حاسبة إضاءة',
      'محتوى تسويقي', 'مدير سوشيال ميديا',
    ],
    features_en: [
      'Smart quotation', 'Tax invoice', 'Contract generator', 'Material calculator',
      'Cost estimator', 'Paint/flooring calculator', '2D design', '3D design',
      '2D to 3D converter', 'Room layout', 'Color palette', 'Lighting calculator',
      'Marketing content', 'Social media manager',
    ],
    tips_ar: ['بعض الأدوات مجانية وبعضها يتطلب باقة Pro', 'كل أداة تصدّر PDF احترافي'],
    tips_en: ['Some tools are free, others require Pro plan', 'Each tool exports professional PDF'],
    requiredTier: 'free',
    icon: 'Settings',
    category: 'tools',
  },
  {
    id: 'wallet',
    route: '/wallet',
    name_ar: 'محفظة الدار',
    name_en: 'Dar Wallet',
    description_ar: 'محفظة رقمية لإدارة الكوينز — اشحن واستخدم في الأدوات والخدمات المميزة',
    description_en: 'Digital wallet to manage coins — top up and use on tools and premium services',
    features_ar: ['رصيد الكوينز', 'شحن الرصيد', 'سجل المعاملات', 'استخدام في الأدوات', 'مكافآت وبونص'],
    features_en: ['Coin balance', 'Top up', 'Transaction history', 'Use on tools', 'Rewards & bonuses'],
    tips_ar: ['أكمل مهام معينة لكسب كوينز مجانية', 'الكوينز تُستخدم لتشغيل الأدوات الذكية'],
    tips_en: ['Complete tasks to earn free coins', 'Coins are used to power smart tools'],
    requiredTier: 'free',
    icon: 'Wallet',
    category: 'commerce',
  },
  {
    id: 'offers',
    route: '/offers',
    name_ar: 'العروض',
    name_en: 'Offers',
    description_ar: 'عروض حصرية من المزودين والمتاجر — خصومات وباقات مميزة',
    description_en: 'Exclusive offers from providers and stores — discounts and special packages',
    features_ar: ['عروض يومية', 'كوبونات خصم', 'باقات مميزة', 'عروض موسمية'],
    features_en: ['Daily deals', 'Discount coupons', 'Special packages', 'Seasonal offers'],
    tips_ar: ['فعّل الإشعارات لتصلك العروض أولاً'],
    tips_en: ['Enable notifications to get offers first'],
    requiredTier: 'guest',
    icon: 'Flame',
    category: 'commerce',
  },
  {
    id: 'marketplace',
    route: '/marketplace',
    name_ar: 'السوق',
    name_en: 'Marketplace',
    description_ar: 'سوق مواد البناء والأثاث المستعمل والجديد — بيع واشترِ من مزودين موثقين',
    description_en: 'New & used building materials and furniture marketplace — buy and sell',
    features_ar: ['منتجات جديدة ومستعملة', 'فلاتر متقدمة', 'تقييمات البائعين', 'دفع آمن'],
    features_en: ['New & used products', 'Advanced filters', 'Seller ratings', 'Secure payment'],
    tips_ar: ['قارن الأسعار قبل الشراء'],
    tips_en: ['Compare prices before buying'],
    requiredTier: 'guest',
    icon: 'Store',
    category: 'commerce',
  },
  {
    id: 'subscriptions',
    route: '/subscriptions',
    name_ar: 'الاشتراكات',
    name_en: 'Subscriptions',
    description_ar: '3 باقات — مجاني (15 يوم تجربة)، احترافي (299 د.إ/شهر)، مؤسسات (999 د.إ/شهر)',
    description_en: '3 plans — Free (15-day trial), Pro (AED 299/mo), Enterprise (AED 999/mo)',
    features_ar: [
      'مجاني: 5 مستندات، أدوات أساسية، 1GB تخزين',
      'احترافي: مستندات غير محدودة، كل الأدوات، 50GB، حتى 10 مستخدمين',
      'مؤسسات: كل شيء + CRM + فيديو AI + API + دعم 24/7',
    ],
    features_en: [
      'Free: 5 documents, basic tools, 1GB storage',
      'Pro: Unlimited docs, all tools, 50GB, up to 10 users',
      'Enterprise: Everything + CRM + AI Video + API + 24/7 support',
    ],
    tips_ar: ['الدفع عبر Stripe بأمان تام', 'الباقة السنوية توفر شهرين مجاناً'],
    tips_en: ['Secure payment via Stripe', 'Annual plan saves 2 months'],
    requiredTier: 'guest',
    icon: 'Crown',
    category: 'commerce',
  },
  {
    id: 'profile',
    route: '/profile',
    name_ar: 'الملف الشخصي',
    name_en: 'Profile',
    description_ar: 'إدارة حسابك — البيانات الشخصية، صورة الملف، الإعدادات، التوثيق',
    description_en: 'Manage your account — personal info, avatar, settings, verification',
    features_ar: ['تعديل البيانات', 'رفع صورة شخصية', 'توثيق الحساب', 'إعدادات اللغة', 'الهوية الإماراتية'],
    features_en: ['Edit info', 'Upload avatar', 'Account verification', 'Language settings', 'Emirates ID'],
    tips_ar: ['وثّق حسابك للحصول على صلاحيات أكبر'],
    tips_en: ['Verify your account for more features'],
    requiredTier: 'free',
    icon: 'User',
    category: 'social',
  },
  {
    id: 'messages',
    route: '/messages',
    name_ar: 'الرسائل',
    name_en: 'Messages',
    description_ar: 'نظام مراسلة ذكي مع ترجمة تلقائية — تواصل مع المزودين والعملاء',
    description_en: 'Smart messaging with auto-translation — communicate with providers and clients',
    features_ar: ['محادثات فورية', 'ترجمة ذكية AR↔EN', 'إرسال صور وملفات', 'إشعارات فورية'],
    features_en: ['Instant chat', 'Smart translation AR↔EN', 'Send photos & files', 'Push notifications'],
    tips_ar: ['الترجمة الذكية تساعدك في التواصل مع أي شخص بأي لغة'],
    tips_en: ['Smart translation helps you communicate in any language'],
    requiredTier: 'free',
    icon: 'MessageCircle',
    category: 'social',
  },
  {
    id: 'workspace',
    route: '/workspace',
    name_ar: 'مساحة العمل CRM',
    name_en: 'CRM Workspace',
    description_ar: 'مساحة عمل احترافية لإدارة المشاريع والعملاء والفريق — متاحة لباقة Pro وأعلى',
    description_en: 'Professional workspace for project, client, and team management — Pro plan and above',
    features_ar: ['لوحة تحكم ذكية', 'إدارة مشاريع', 'إدارة عملاء CRM', 'إدارة فريق', 'تقارير مالية'],
    features_en: ['Smart dashboard', 'Project management', 'CRM', 'Team management', 'Financial reports'],
    tips_ar: ['مساحة العمل تدعم 12 نوع داشبورد مختلف حسب نوع العمل'],
    tips_en: ['Workspace supports 12 different dashboard types by business type'],
    requiredTier: 'pro',
    icon: 'FolderKanban',
    category: 'admin',
  },
  {
    id: 'weyaak',
    route: '/weyaak',
    name_ar: 'وياك — المساعد الذكي',
    name_en: 'Weyaak — AI Assistant',
    description_ar: 'مساعد ذكي إماراتي يعرف كل شيء عن البناء والتشطيب — اسأل أي سؤال!',
    description_en: 'UAE AI assistant that knows everything about construction & finishing — ask anything!',
    features_ar: ['إجابة أسئلة البناء', 'تقدير التكاليف', 'توصيات مزودين', 'نصائح تشطيب', 'مقارنة مواد'],
    features_en: ['Answer construction questions', 'Cost estimation', 'Provider recommendations', 'Finishing tips', 'Material comparison'],
    tips_ar: ['وياك يتعلم من أسئلتك ويصبح أكثر ذكاءً', 'اسأل بالعربي أو الإنجليزي'],
    tips_en: ['Weyaak learns from your questions', 'Ask in Arabic or English'],
    requiredTier: 'free',
    icon: 'Bot',
    category: 'tools',
  },
  {
    id: 'design',
    route: '/design',
    name_ar: 'استوديو التصميم',
    name_en: 'Design Studio',
    description_ar: 'أداة تصميم داخلي وخارجي — 2D و 3D مع واقع افتراضي',
    description_en: 'Interior & exterior design tool — 2D and 3D with virtual reality',
    features_ar: ['تصميم غرف ثنائي الأبعاد', 'عرض ثلاثي الأبعاد', 'واقع افتراضي VR', 'مشاركة التصاميم'],
    features_en: ['2D room design', '3D rendering', 'VR walkthrough', 'Share designs'],
    tips_ar: ['ابدأ بالتصميم 2D ثم حوّله لـ 3D بضغطة'],
    tips_en: ['Start with 2D then convert to 3D with one click'],
    requiredTier: 'free',
    icon: 'Ruler',
    category: 'tools',
  },
  {
    id: 'notifications',
    route: '/notifications',
    name_ar: 'الإشعارات',
    name_en: 'Notifications',
    description_ar: 'مركز الإشعارات — تنبيهات المنصة، رسائل وياك، تحديثات الطلبات',
    description_en: 'Notification center — platform alerts, Wayak messages, order updates',
    features_ar: ['إشعارات فورية', 'تصنيف حسب النوع', 'قراءة/مسح الكل', 'إشعارات وياك الذكية'],
    features_en: ['Push notifications', 'Category filter', 'Read/clear all', 'Smart Wayak alerts'],
    tips_ar: ['فعّل إشعارات المتصفح لتصلك التنبيهات فوراً'],
    tips_en: ['Enable browser notifications for instant alerts'],
    requiredTier: 'free',
    icon: 'Bell',
    category: 'main',
  },
];

// ═══════════════════════════════════════
// الأسئلة الشائعة
// ═══════════════════════════════════════

export const FAQS: FAQ[] = [
  {
    id: 'what-is',
    question_ar: 'ما هو بيت الريف؟',
    question_en: 'What is Beit Al Reef?',
    answer_ar: 'بيت الريف هو منصة إماراتية SaaS متخصصة في قطاع البناء والتشطيب. تجمع مزودي الخدمات والعملاء في مكان واحد مع أدوات ذكية بالذكاء الاصطناعي.',
    answer_en: 'Beit Al Reef is a UAE SaaS platform specialized in construction & finishing. It connects service providers and clients with AI-powered smart tools.',
    section: 'general',
    tags: ['about', 'platform', 'construction'],
  },
  {
    id: 'how-register',
    question_ar: 'كيف أسجل في بيت الريف؟',
    question_en: 'How do I register?',
    answer_ar: 'اضغط "إنشاء حساب" في شاشة الدخول. يمكنك التسجيل بالبريد الإلكتروني أو حساب Google. بعد التسجيل ستختار نوعك: عميل أو مزود خدمة.',
    answer_en: 'Click "Create Account" on the login screen. Register with email or Google. After registration, choose your type: client or service provider.',
    section: 'auth',
    tags: ['register', 'signup', 'account'],
  },
  {
    id: 'subscription-plans',
    question_ar: 'ما هي باقات الاشتراك؟',
    question_en: 'What are the subscription plans?',
    answer_ar: 'لدينا 3 باقات: مجاني (15 يوم تجربة)، احترافي (299 د.إ/شهر)، مؤسسات (999 د.إ/شهر). الدفع عبر Stripe بالدرهم الإماراتي.',
    answer_en: 'We have 3 plans: Free (15-day trial), Pro (AED 299/month), Enterprise (AED 999/month). Payment via Stripe in AED.',
    section: 'subscriptions',
    tags: ['pricing', 'plans', 'subscription', 'payment'],
  },
  {
    id: 'how-verify',
    question_ar: 'كيف أوثّق حسابي؟',
    question_en: 'How do I verify my account?',
    answer_ar: 'اذهب للملف الشخصي > التوثيق. ارفع صورة الهوية الإماراتية (الأمام والخلف) أو استخدم UAE Pass. المراجعة تأخذ 24-48 ساعة.',
    answer_en: 'Go to Profile > Verification. Upload Emirates ID (front & back) or use UAE Pass. Review takes 24-48 hours.',
    section: 'profile',
    tags: ['verify', 'id', 'uae-pass', 'emirates-id'],
  },
  {
    id: 'how-map',
    question_ar: 'كيف أستخدم الخريطة؟',
    question_en: 'How do I use the map?',
    answer_ar: 'اذهب لـ "خريطة المزودين". استخدم فلاتر الفئات لتصفية المزودين. اضغط على أي ماركر لمشاهدة التفاصيل. فعّل "بالقرب مني" لأقرب مزود.',
    answer_en: 'Go to "Providers Map". Use category filters to find providers. Tap any marker for details. Enable "Near me" for closest providers.',
    section: 'maps',
    tags: ['map', 'location', 'providers', 'near-me'],
  },
  {
    id: 'how-payment',
    question_ar: 'كيف أدفع للاشتراك؟',
    question_en: 'How do I pay for subscription?',
    answer_ar: 'اذهب للاشتراكات > اختر الباقة > اضغط "اشترك الآن". ستنتقل لصفحة Stripe الآمنة للدفع بالبطاقة البنكية.',
    answer_en: 'Go to Subscriptions > choose plan > click "Subscribe Now". You will be redirected to secure Stripe page for card payment.',
    section: 'subscriptions',
    tags: ['payment', 'stripe', 'card', 'subscribe'],
  },
  {
    id: 'provider-listing',
    question_ar: 'كيف أضيف نشاطي كمزود خدمة؟',
    question_en: 'How do I list my business as a provider?',
    answer_ar: 'سجّل كمزود خدمة > أكمل بياناتك > حدد موقعك على الخريطة > ارفع صور نشاطك. بعد التوثيق سيظهر نشاطك على الخريطة والبحث.',
    answer_en: 'Register as provider > complete your info > set your location on map > upload business photos. After verification, your business appears on map and search.',
    section: 'maps',
    tags: ['provider', 'listing', 'business', 'storefront'],
  },
];

// ═══════════════════════════════════════
// معلومات المنصة
// ═══════════════════════════════════════

export const PLATFORM_INFO = {
  name_ar: 'بيت الريف',
  name_en: 'Beit Al Reef',
  tagline_ar: 'منصة البناء والتشطيب الإماراتية',
  tagline_en: 'UAE Construction & Finishing Platform',
  domain: 'app.bietalreef.ae',
  email: 'support@bietalreef.ae',
  currency: 'AED',
  currency_ar: 'درهم إماراتي',
  country: 'UAE',
  country_ar: 'الإمارات العربية المتحدة',
  emirates: ['أبوظبي', 'دبي', 'الشارقة', 'عجمان', 'أم القيوين', 'رأس الخيمة', 'الفجيرة'],
  emirates_en: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'],
  totalServices: 9,
  totalTools: 14,
  totalPlans: 3,
  paymentGateway: 'Stripe',
  aiAssistant: 'وياك (Weyaak)',
};

// ═══════════════════════════════════════
// دوال مساعدة
// ═══════════════════════════════════════

/** Get a section by ID */
export function getSection(id: string): AppSection | undefined {
  return APP_SECTIONS.find(s => s.id === id);
}

/** Get sections accessible by a tier */
export function getAccessibleSections(tier: string): AppSection[] {
  const tierOrder: Record<string, number> = { guest: 0, free: 1, pro: 2, enterprise: 3 };
  const userLevel = tierOrder[tier] ?? 0;
  return APP_SECTIONS.filter(s => (tierOrder[s.requiredTier] ?? 0) <= userLevel);
}

/** Search FAQs */
export function searchFAQs(query: string, isEn: boolean): FAQ[] {
  const q = query.toLowerCase();
  return FAQS.filter(faq => {
    const text = isEn
      ? `${faq.question_en} ${faq.answer_en} ${faq.tags.join(' ')}`.toLowerCase()
      : `${faq.question_ar} ${faq.answer_ar} ${faq.tags.join(' ')}`.toLowerCase();
    return text.includes(q);
  });
}

/** Get contextual help for current route */
export function getContextualHelp(route: string, isEn: boolean): { section: AppSection | null; faqs: FAQ[] } {
  const sectionId = route.split('/').filter(Boolean)[0] || 'home';
  const section = APP_SECTIONS.find(s => s.id === sectionId) || null;
  const faqs = FAQS.filter(f => f.section === sectionId || f.section === 'general');
  return { section, faqs };
}

/** Generate Wayak greeting based on context */
export function getWayakGreeting(ctx: {
  isEn: boolean;
  name?: string;
  tier?: string;
  route?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
}): string {
  const { isEn, name, tier, route, timeOfDay } = ctx;
  const section = route ? APP_SECTIONS.find(s => route.includes(s.id)) : null;

  if (isEn) {
    const greeting = timeOfDay === 'morning' ? 'Good morning' : timeOfDay === 'evening' ? 'Good evening' : 'Hello';
    const who = name ? `, ${name}` : '';
    const where = section ? ` You're in ${section.name_en}.` : '';
    const tierMsg = tier === 'pro' ? ' Your Pro features are active.' : tier === 'enterprise' ? ' Full Enterprise access unlocked.' : '';
    return `${greeting}${who}!${where}${tierMsg} How can I help you today?`;
  } else {
    const greeting = timeOfDay === 'morning' ? 'صباح الخير' : timeOfDay === 'evening' ? 'مساء الخير' : 'أهلاً';
    const who = name ? ` ${name}` : '';
    const where = section ? ` أنت في ${section.name_ar}.` : '';
    const tierMsg = tier === 'pro' ? ' باقتك الاحترافية مفعّلة.' : tier === 'enterprise' ? ' صلاحيات المؤسسات مفتوحة.' : '';
    return `${greeting}${who}!${where}${tierMsg} كيف أقدر أساعدك اليوم؟`;
  }
}
