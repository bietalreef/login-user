/**
 * profilePreviewData.ts — بيانات نماذج الملفات الشخصية
 * ═══════════════════════════════════════════════════════════
 * ملف شخصي تجريبي لكل نوع داشبورد
 */

import {
  Building2, Hammer, Paintbrush, Stethoscope, Scale, GraduationCap,
  ShoppingBag, Users, TrendingUp, Calendar, BarChart3, 
  CheckCircle, Clock, Target, Star, Award, Package,
  Wrench, Key, FileText, Pill, Gavel, BookMarked,
  ShoppingCart, Briefcase, Megaphone, PartyPopper, Wallet,
  Calculator
} from 'lucide-react';

export interface ProfileStat {
  value: string;
  label_ar: string;
  label_en: string;
  icon: any;
  color: string;
}

export interface ProfileService {
  id: string;
  name_ar: string;
  name_en: string;
  price: string;
  icon: any;
}

export interface ProfileReview {
  id: string;
  name_ar: string;
  name_en: string;
  rating: number;
  comment_ar: string;
  comment_en: string;
  date: string;
  avatar: string;
}

export interface ProfilePreviewData {
  // معلومات أساسية
  businessName_ar: string;
  businessName_en: string;
  verified: boolean;
  profileId: string;
  rating: number;
  reviewCount: number;
  avatar: string;
  avatarBg: string;
  
  // إحصائيات
  stats: ProfileStat[];
  
  // وقت الاستجابة
  responseTime_ar: string;
  responseTime_en: string;
  
  // الخدمات
  services: ProfileService[];
  
  // التقييمات
  reviews: ProfileReview[];
  
  // معلومات النشاط
  about_ar: string;
  about_en: string;
  specialties_ar: string[];
  specialties_en: string[];
  workingHours_ar: string;
  workingHours_en: string;
  location_ar: string;
  location_en: string;
  
  // بيانات تجارية
  licenseNumber?: string;
  established?: string;
  employees?: string;
}

// ═══════════════════════════════════════════════════════════
// الملفات الشخصية لكل داشبورد
// ═══════════════════════════════════════════════════════════

export const PROFILE_PREVIEWS: Record<string, ProfilePreviewData> = {
  // ─────────────────────────────────────────────────────────
  // العقارات
  // ─────────────────────────────────────────────────────────
  real_estate: {
    businessName_ar: 'مكتب الإمارات العقاري',
    businessName_en: 'Emirates Real Estate Office',
    verified: true,
    profileId: 'RE-2024-1547',
    rating: 4.9,
    reviewCount: 342,
    avatar: 'ع',
    avatarBg: '#3B5BFE',
    
    stats: [
      { value: '287', label_ar: 'عقار مُدار', label_en: 'Properties Managed', icon: Building2, color: '#3B5BFE' },
      { value: '156', label_ar: 'عقد نشط', label_en: 'Active Contracts', icon: FileText, color: '#2AA676' },
      { value: '99%', label_ar: 'معدل التحصيل', label_en: 'Collection Rate', icon: Target, color: '#C8A86A' }
    ],
    
    responseTime_ar: 'خلال ساعة',
    responseTime_en: 'Within 1 hour',
    
    services: [
      { id: '1', name_ar: 'إدارة عقارية شاملة', name_en: 'Full Property Management', price: '5% من الإيجار', icon: Building2 },
      { id: '2', name_ar: 'إعادة تأجير', name_en: 'Re-leasing', price: '2,500 AED', icon: Key },
      { id: '3', name_ar: 'صيانة دورية', name_en: 'Regular Maintenance', price: 'حسب الطلب', icon: Wrench },
      { id: '4', name_ar: 'تحصيل إيجارات', name_en: 'Rent Collection', price: '3% من الإيجار', icon: Wallet }
    ],
    
    reviews: [
      {
        id: '1',
        name_ar: 'خالد أحمد',
        name_en: 'Khaled Ahmed',
        rating: 5,
        comment_ar: 'خدمة ممتازة وتحصيل دقيق للإيجارات. أنصح بهم بشدة!',
        comment_en: 'Excellent service and accurate rent collection. Highly recommended!',
        date: '2024-01-15',
        avatar: 'خ'
      },
      {
        id: '2',
        name_ar: 'فاطمة سالم',
        name_en: 'Fatima Salem',
        rating: 5,
        comment_ar: 'احترافية عالية في التعامل، وسرعة في حل المشاكل',
        comment_en: 'Highly professional and quick problem-solving',
        date: '2024-01-10',
        avatar: 'ف'
      }
    ],
    
    about_ar: 'مكتب عقاري رائد في دبي منذ 2015، متخصص في إدارة العقارات السكنية والتجارية. نوفر خدمات شاملة من التأجير إلى الصيانة والتحصيل.',
    about_en: 'Leading real estate office in Dubai since 2015, specializing in residential and commercial property management. We provide comprehensive services from leasing to maintenance and collection.',
    
    specialties_ar: ['إدارة عقارات سكنية', 'عقود تجارية', 'صيانة وقائية', 'تحصيل ذكي'],
    specialties_en: ['Residential Management', 'Commercial Contracts', 'Preventive Maintenance', 'Smart Collection'],
    
    workingHours_ar: 'السبت - الخميس: 8 ص - 6 م',
    workingHours_en: 'Sat - Thu: 8 AM - 6 PM',
    
    location_ar: 'دبي، الخليج التجاري',
    location_en: 'Dubai, Business Bay',
    
    licenseNumber: 'DLD-87654',
    established: '2015',
    employees: '28'
  },

  // ─────────────────────────────────────────────────────────
  // المقاولات
  // ─────────────────────────────────────────────────────────
  contracting: {
    businessName_ar: 'مؤسسة الريان للمقاولات',
    businessName_en: 'Al Rayan Contracting Est.',
    verified: true,
    profileId: 'CON-2024-8821',
    rating: 4.8,
    reviewCount: 230,
    avatar: 'ر',
    avatarBg: '#D4AF37',
    
    stats: [
      { value: '156', label_ar: 'مشروع مُنجز', label_en: 'Completed Projects', icon: Award, color: '#D4AF37' },
      { value: '12', label_ar: 'مشروع نشط', label_en: 'Active Projects', icon: Hammer, color: '#2AA676' },
      { value: '98%', label_ar: 'معدل الإنجاز', label_en: 'Completion Rate', icon: Target, color: '#3B5BFE' }
    ],
    
    responseTime_ar: 'خلال ساعة',
    responseTime_en: 'Within 1 hour',
    
    services: [
      { id: '1', name_ar: 'بناء فلل سكنية', name_en: 'Residential Villa Construction', price: 'يبدأ من 1.2M AED', icon: Building2 },
      { id: '2', name_ar: 'تشطيب شامل', name_en: 'Complete Finishing', price: '450 AED/م²', icon: Paintbrush },
      { id: '3', name_ar: 'توسعات وإضافات', name_en: 'Extensions & Additions', price: 'حسب التصميم', icon: Hammer },
      { id: '4', name_ar: 'صيانة شاملة', name_en: 'Full Maintenance', price: 'عقود سنوية', icon: Wrench }
    ],
    
    reviews: [
      {
        id: '1',
        name_ar: 'سعيد راشد',
        name_en: 'Saeed Rashid',
        rating: 5,
        comment_ar: 'أنجزوا فيلتي في الوقت المحدد وبجودة عالية جداً',
        comment_en: 'Completed my villa on time with exceptional quality',
        date: '2024-01-20',
        avatar: 'س'
      },
      {
        id: '2',
        name_ar: 'محمد علي',
        name_en: 'Mohammed Ali',
        rating: 5,
        comment_ar: 'فريق محترف والتزام تام بالمواصفات',
        comment_en: 'Professional team with full commitment to specifications',
        date: '2024-01-12',
        avatar: 'م'
      }
    ],
    
    about_ar: 'مؤسسة رائدة في مجال المقاولات العامة منذ 2010. نتخصص في بناء الفلل السكنية والمباني التجارية مع التزام صارم بالجودة والمواعيد.',
    about_en: 'Leading general contracting firm since 2010. We specialize in residential villas and commercial buildings with strict commitment to quality and deadlines.',
    
    specialties_ar: ['بناء فلل', 'تشطيب فاخر', 'مشاريع تجارية', 'صيانة شاملة'],
    specialties_en: ['Villa Construction', 'Luxury Finishing', 'Commercial Projects', 'Full Maintenance'],
    
    workingHours_ar: 'السبت - الخميس: 7 ص - 5 م',
    workingHours_en: 'Sat - Thu: 7 AM - 5 PM',
    
    location_ar: 'العين، المقام',
    location_en: 'Al Ain, Al Maqam',
    
    licenseNumber: 'MC-12345',
    established: '2010',
    employees: '85'
  },

  // ─────────────────────────────────────────────────────────
  // التصميم الداخلي
  // ─────────────────────────────────────────────────────────
  interior: {
    businessName_ar: 'استوديو الإبداع للتصميم',
    businessName_en: 'Creativity Design Studio',
    verified: true,
    profileId: 'INT-2024-4523',
    rating: 4.9,
    reviewCount: 189,
    avatar: 'إ',
    avatarBg: '#8B5CF6',
    
    stats: [
      { value: '142', label_ar: 'تصميم مُنفذ', label_en: 'Designs Executed', icon: Award, color: '#8B5CF6' },
      { value: '18', label_ar: 'مشروع نشط', label_en: 'Active Projects', icon: Paintbrush, color: '#2AA676' },
      { value: '100%', label_ar: 'رضا العملاء', label_en: 'Client Satisfaction', icon: Star, color: '#FFD700' }
    ],
    
    responseTime_ar: 'خلال ساعتين',
    responseTime_en: 'Within 2 hours',
    
    services: [
      { id: '1', name_ar: 'تصميم شقق عصرية', name_en: 'Modern Apartment Design', price: '180 AED/م²', icon: Building2 },
      { id: '2', name_ar: 'تصميم فلل فاخرة', name_en: 'Luxury Villa Design', price: '250 AED/م²', icon: Paintbrush },
      { id: '3', name_ar: 'تصميم مكاتب', name_en: 'Office Design', price: 'حسب المساحة', icon: Briefcase },
      { id: '4', name_ar: 'استشارة تصميم', name_en: 'Design Consultation', price: '500 AED/جلسة', icon: FileText }
    ],
    
    reviews: [
      {
        id: '1',
        name_ar: 'نورة سالم',
        name_en: 'Noura Salem',
        rating: 5,
        comment_ar: 'تصميم رائع وذوق راقي! حولوا شقتي لتحفة فنية',
        comment_en: 'Amazing design and elegant taste! They turned my apartment into a masterpiece',
        date: '2024-01-18',
        avatar: 'ن'
      },
      {
        id: '2',
        name_ar: 'عبدالله خالد',
        name_en: 'Abdullah Khaled',
        rating: 5,
        comment_ar: 'احترافية عالية واهتمام بأدق التفاصيل',
        comment_en: 'Highly professional with attention to finest details',
        date: '2024-01-08',
        avatar: 'ع'
      }
    ],
    
    about_ar: 'استوديو تصميم داخلي حائز على جوائز، متخصص في التصاميم العصرية والكلاسيكية. نحول مساحاتك إلى أعمال فنية تعكس شخصيتك.',
    about_en: 'Award-winning interior design studio specializing in modern and classic designs. We transform your spaces into artworks that reflect your personality.',
    
    specialties_ar: ['تصميم عصري', 'ديكور كلاسيكي', 'إضاءة ذكية', 'أثاث مخصص'],
    specialties_en: ['Modern Design', 'Classic Décor', 'Smart Lighting', 'Custom Furniture'],
    
    workingHours_ar: 'السبت - الخميس: 9 ص - 7 م',
    workingHours_en: 'Sat - Thu: 9 AM - 7 PM',
    
    location_ar: 'دبي، جميرا',
    location_en: 'Dubai, Jumeirah',
    
    licenseNumber: 'DES-45678',
    established: '2017',
    employees: '15'
  },

  // ─────────────────────────────────────────────────────────
  // الرعاية الصحية
  // ─────────────────────────────────────────────────────────
  healthcare: {
    businessName_ar: 'عيادة النور الطبية',
    businessName_en: 'Al Noor Medical Clinic',
    verified: true,
    profileId: 'MED-2024-7821',
    rating: 4.9,
    reviewCount: 856,
    avatar: 'ط',
    avatarBg: '#10B981',
    
    stats: [
      { value: '12,450', label_ar: 'مريض', label_en: 'Patients Served', icon: Users, color: '#10B981' },
      { value: '186', label_ar: 'موعد شهرياً', label_en: 'Monthly Appointments', icon: Calendar, color: '#3B5BFE' },
      { value: '99%', label_ar: 'رضا المرضى', label_en: 'Patient Satisfaction', icon: Star, color: '#FFD700' }
    ],
    
    responseTime_ar: 'خلال 30 دقيقة',
    responseTime_en: 'Within 30 minutes',
    
    services: [
      { id: '1', name_ar: 'فحص طبي شامل', name_en: 'Comprehensive Medical Checkup', price: '350 AED', icon: Stethoscope },
      { id: '2', name_ar: 'استشارة متخصصة', name_en: 'Specialist Consultation', price: '250 AED', icon: FileText },
      { id: '3', name_ar: 'تحاليل مخبرية', name_en: 'Lab Tests', price: 'حسب النوع', icon: Pill },
      { id: '4', name_ar: 'متابعة دورية', name_en: 'Regular Follow-up', price: '150 AED', icon: Clock }
    ],
    
    reviews: [
      {
        id: '1',
        name_ar: 'سارة أحمد',
        name_en: 'Sara Ahmed',
        rating: 5,
        comment_ar: 'دكتور ممتاز وطاقم تمريض محترف جداً',
        comment_en: 'Excellent doctor and highly professional nursing staff',
        date: '2024-01-22',
        avatar: 'س'
      },
      {
        id: '2',
        name_ar: 'يوسف محمد',
        name_en: 'Youssef Mohammed',
        rating: 5,
        comment_ar: 'عيادة نظيفة جداً واهتمام شخصي بكل مريض',
        comment_en: 'Very clean clinic and personal attention to each patient',
        date: '2024-01-19',
        avatar: 'ي'
      }
    ],
    
    about_ar: 'عيادة طبية متكاملة منذ 2012، توفر خدمات طبية عامة ومتخصصة بأحدث المعدات. فريق طبي مؤهل بخبرة تزيد عن 15 عاماً.',
    about_en: 'Complete medical clinic since 2012, providing general and specialized medical services with latest equipment. Qualified medical team with over 15 years experience.',
    
    specialties_ar: ['طب عام', 'طب أطفال', 'تحاليل', 'أشعة'],
    specialties_en: ['General Medicine', 'Pediatrics', 'Lab Tests', 'Radiology'],
    
    workingHours_ar: 'السبت - الخميس: 8 ص - 10 م | الجمعة: 4 م - 10 م',
    workingHours_en: 'Sat - Thu: 8 AM - 10 PM | Fri: 4 PM - 10 PM',
    
    location_ar: 'أبوظبي، المرور',
    location_en: 'Abu Dhabi, Al Muroor',
    
    licenseNumber: 'DOH-98765',
    established: '2012',
    employees: '24'
  },

  // ─────────────────────────────────────────────────────────
  // الخدمات القانونية
  // ─────────────────────────────────────────────���───────────
  legal: {
    businessName_ar: 'مكتب العدالة للمحاماة',
    businessName_en: 'Justice Law Firm',
    verified: true,
    profileId: 'LAW-2024-3421',
    rating: 4.8,
    reviewCount: 167,
    avatar: 'ق',
    avatarBg: '#1E3A8A',
    
    stats: [
      { value: '245', label_ar: 'قضية ناجحة', label_en: 'Successful Cases', icon: Award, color: '#1E3A8A' },
      { value: '28', label_ar: 'قضية نشطة', label_en: 'Active Cases', icon: Gavel, color: '#2AA676' },
      { value: '92%', label_ar: 'معدل الفوز', label_en: 'Win Rate', icon: Target, color: '#C8A86A' }
    ],
    
    responseTime_ar: 'خلال 3 ساعات',
    responseTime_en: 'Within 3 hours',
    
    services: [
      { id: '1', name_ar: 'قضايا عقارية', name_en: 'Real Estate Cases', price: 'حسب القضية', icon: Building2 },
      { id: '2', name_ar: 'قضايا تجارية', name_en: 'Commercial Cases', price: 'استشارة مجانية', icon: Briefcase },
      { id: '3', name_ar: 'عقود ومراجعة', name_en: 'Contracts & Review', price: 'يبدأ من 2,500 AED', icon: FileText },
      { id: '4', name_ar: 'تحكيم ووساطة', name_en: 'Arbitration & Mediation', price: 'حسب الاتفاق', icon: Scale }
    ],
    
    reviews: [
      {
        id: '1',
        name_ar: 'راشد سالم',
        name_en: 'Rashid Salem',
        rating: 5,
        comment_ar: 'محامي محترف جداً وخبرة واسعة. ربح قضيتي بكفاءة',
        comment_en: 'Highly professional lawyer with extensive experience. Won my case efficiently',
        date: '2024-01-16',
        avatar: 'ر'
      },
      {
        id: '2',
        name_ar: 'علي خالد',
        name_en: 'Ali Khaled',
        rating: 5,
        comment_ar: 'استشارة قانونية دقيقة وسرعة في الإجراءات',
        comment_en: 'Accurate legal consultation and fast procedures',
        date: '2024-01-11',
        avatar: 'ع'
      }
    ],
    
    about_ar: 'مكتب محاماة رائد منذ 2008، متخصص في القضايا العقارية والتجارية والعمالية. فريق من المحامين المرخصين بخبرة تزيد عن 20 عاماً.',
    about_en: 'Leading law firm since 2008, specializing in real estate, commercial and labor cases. Team of licensed lawyers with over 20 years experience.',
    
    specialties_ar: ['قضايا عقارية', 'قضايا تجارية', 'قضايا عمالية', 'عقود قانونية'],
    specialties_en: ['Real Estate Cases', 'Commercial Cases', 'Labor Cases', 'Legal Contracts'],
    
    workingHours_ar: 'الأحد - الخميس: 8 ص - 6 م',
    workingHours_en: 'Sun - Thu: 8 AM - 6 PM',
    
    location_ar: 'دبي، برج خليفة',
    location_en: 'Dubai, Burj Khalifa',
    
    licenseNumber: 'LAW-UAE-5678',
    established: '2008',
    employees: '12'
  },

  // ─────────────────────────────────────────────────────────
  // التعليم
  // ─────────────────────────────────────────────────────────
  education: {
    businessName_ar: 'أكاديمية النجاح التعليمية',
    businessName_en: 'Success Academy',
    verified: true,
    profileId: 'EDU-2024-9012',
    rating: 4.9,
    reviewCount: 521,
    avatar: 'أ',
    avatarBg: '#F59E0B',
    
    stats: [
      { value: '1,850', label_ar: 'طالب مُسجل', label_en: 'Enrolled Students', icon: Users, color: '#F59E0B' },
      { value: '42', label_ar: 'دورة نشطة', label_en: 'Active Courses', icon: BookMarked, color: '#2AA676' },
      { value: '96%', label_ar: 'معدل النجاح', label_en: 'Success Rate', icon: Award, color: '#C8A86A' }
    ],
    
    responseTime_ar: 'خلال ساعتين',
    responseTime_en: 'Within 2 hours',
    
    services: [
      { id: '1', name_ar: 'دورة البرمجة الشاملة', name_en: 'Complete Programming Course', price: '3,500 AED', icon: GraduationCap },
      { id: '2', name_ar: 'دورة التصميم الجرافيكي', name_en: 'Graphic Design Course', price: '2,800 AED', icon: Paintbrush },
      { id: '3', name_ar: 'دورة إدارة المشاريع', name_en: 'Project Management Course', price: '4,200 AED', icon: Briefcase },
      { id: '4', name_ar: 'دورة التسويق الرقمي', name_en: 'Digital Marketing Course', price: '3,000 AED', icon: TrendingUp }
    ],
    
    reviews: [
      {
        id: '1',
        name_ar: 'أحمد سعيد',
        name_en: 'Ahmed Saeed',
        rating: 5,
        comment_ar: 'دورات احترافية ومدربين أكفاء. تعلمت الكثير!',
        comment_en: 'Professional courses and competent trainers. Learned a lot!',
        date: '2024-01-21',
        avatar: 'أ'
      },
      {
        id: '2',
        name_ar: 'ليلى محمد',
        name_en: 'Layla Mohammed',
        rating: 5,
        comment_ar: 'شهادة معتمدة وتدريب عملي ممتاز',
        comment_en: 'Certified certificate and excellent practical training',
        date: '2024-01-14',
        avatar: 'ل'
      }
    ],
    
    about_ar: 'أكاديمية تعليمية رائدة منذ 2016، نقدم دورات احترافية في البرمجة والتصميم والإدارة. شهادات معتمدة ومدربين معتمدين دولياً.',
    about_en: 'Leading educational academy since 2016, offering professional courses in programming, design and management. Certified certificates and internationally certified trainers.',
    
    specialties_ar: ['برمجة', 'تصميم', 'إدارة أعمال', 'تسويق رقمي'],
    specialties_en: ['Programming', 'Design', 'Business Management', 'Digital Marketing'],
    
    workingHours_ar: 'السبت - الخميس: 8 ص - 9 م',
    workingHours_en: 'Sat - Thu: 8 AM - 9 PM',
    
    location_ar: 'الشارقة، المجاز',
    location_en: 'Sharjah, Al Majaz',
    
    licenseNumber: 'KHDA-34567',
    established: '2016',
    employees: '35'
  },

  // ─────────────────────────────────────────────────────────
  // التجزئة
  // ─────────────────────────────────────────────────────────
  retail: {
    businessName_ar: 'متجر الأناقة',
    businessName_en: 'Elegance Store',
    verified: true,
    profileId: 'RET-2024-6754',
    rating: 4.7,
    reviewCount: 1245,
    avatar: 'م',
    avatarBg: '#EC4899',
    
    stats: [
      { value: '8,450', label_ar: 'منتج', label_en: 'Products', icon: Package, color: '#EC4899' },
      { value: '1,240', label_ar: 'عميل نشط', label_en: 'Active Customers', icon: Users, color: '#2AA676' },
      { value: '4.7', label_ar: 'تقييم المنتجات', label_en: 'Product Rating', icon: Star, color: '#FFD700' }
    ],
    
    responseTime_ar: 'خلال ساعة',
    responseTime_en: 'Within 1 hour',
    
    services: [
      { id: '1', name_ar: 'ملابس رجالية', name_en: 'Men\'s Clothing', price: 'يبدأ من 150 AED', icon: ShoppingBag },
      { id: '2', name_ar: 'ملابس نسائية', name_en: 'Women\'s Clothing', price: 'يبدأ من 200 AED', icon: ShoppingBag },
      { id: '3', name_ar: 'اكسسوارات', name_en: 'Accessories', price: 'يبدأ من 50 AED', icon: Award },
      { id: '4', name_ar: 'توصيل مجاني', name_en: 'Free Delivery', price: 'للطلبات فوق 300 AED', icon: Package }
    ],
    
    reviews: [
      {
        id: '1',
        name_ar: 'منى أحمد',
        name_en: 'Mona Ahmed',
        rating: 5,
        comment_ar: 'جودة ممتازة وأسعار معقولة. توصيل سريع!',
        comment_en: 'Excellent quality and reasonable prices. Fast delivery!',
        date: '2024-01-23',
        avatar: 'م'
      },
      {
        id: '2',
        name_ar: 'عمر سالم',
        name_en: 'Omar Salem',
        rating: 4,
        comment_ar: 'منتجات عالية الجودة وتشكيلة واسعة',
        comment_en: 'High quality products and wide selection',
        date: '2024-01-17',
        avatar: 'ع'
      }
    ],
    
    about_ar: 'متجر أزياء عصري منذ 2014، نوفر أحدث صيحات الموضة بأسعار تنافسية. توصيل سريع لجميع أنحاء الإمارات.',
    about_en: 'Modern fashion store since 2014, offering latest fashion trends at competitive prices. Fast delivery across UAE.',
    
    specialties_ar: ['أزياء عصرية', 'ماركات عالمية', 'أسعار تنافسية', 'توصيل سريع'],
    specialties_en: ['Modern Fashion', 'International Brands', 'Competitive Prices', 'Fast Delivery'],
    
    workingHours_ar: 'السبت - الخميس: 10 ص - 10 م | الجمعة: 2 م - 11 م',
    workingHours_en: 'Sat - Thu: 10 AM - 10 PM | Fri: 2 PM - 11 PM',
    
    location_ar: 'دبي، مول الإمارات',
    location_en: 'Dubai, Mall of Emirates',
    
    licenseNumber: 'DED-123456',
    established: '2014',
    employees: '42'
  },

  // ─────────────────────────────────────────────────────────
  // الموارد البشرية
  // ─────────────────────────────────────────────────────────
  hr: {
    businessName_ar: 'شركة المواهب للموارد البشرية',
    businessName_en: 'Talents HR Solutions',
    verified: true,
    profileId: 'HR-2024-4423',
    rating: 4.8,
    reviewCount: 156,
    avatar: 'م',
    avatarBg: '#06B6D4',
    
    stats: [
      { value: '580', label_ar: 'موظف موظَّف', label_en: 'Employees Placed', icon: Users, color: '#06B6D4' },
      { value: '45', label_ar: 'شركة عميلة', label_en: 'Client Companies', icon: Building2, color: '#2AA676' },
      { value: '94%', label_ar: 'معدل الاحتفاظ', label_en: 'Retention Rate', icon: Target, color: '#C8A86A' }
    ],
    
    responseTime_ar: 'خلال 4 ساعات',
    responseTime_en: 'Within 4 hours',
    
    services: [
      { id: '1', name_ar: 'توظيف وتعيين', name_en: 'Recruitment & Hiring', price: '15% من الراتب السنوي', icon: Users },
      { id: '2', name_ar: 'إدارة رواتب', name_en: 'Payroll Management', price: '500 AED/موظف', icon: Wallet },
      { id: '3', name_ar: 'تدريب وتطوير', name_en: 'Training & Development', price: 'حسب البرنامج', icon: GraduationCap },
      { id: '4', name_ar: 'استشارات HR', name_en: 'HR Consultancy', price: '1,000 AED/جلسة', icon: Briefcase }
    ],
    
    reviews: [
      {
        id: '1',
        name_ar: 'سعيد محمد',
        name_en: 'Saeed Mohammed',
        rating: 5,
        comment_ar: 'وظفوا لنا فريق ممتاز. خدمة سريعة واحترافية',
        comment_en: 'Recruited an excellent team for us. Fast and professional service',
        date: '2024-01-19',
        avatar: 'س'
      },
      {
        id: '2',
        name_ar: 'فاطمة علي',
        name_en: 'Fatima Ali',
        rating: 5,
        comment_ar: 'إدارة رواتب دقيقة ودعم مستمر',
        comment_en: 'Accurate payroll management and continuous support',
        date: '2024-01-13',
        avatar: 'ف'
      }
    ],
    
    about_ar: 'شركة موارد بشرية رائدة منذ 2013، متخصصة في التوظيف وإدارة الرواتب والتدريب. نوفر حلول HR متكاملة لجميع أحجام الشركات.',
    about_en: 'Leading HR company since 2013, specializing in recruitment, payroll management and training. We provide comprehensive HR solutions for all company sizes.',
    
    specialties_ar: ['توظيف احترافي', 'إدارة رواتب', 'تدريب موظفين', 'استشارات HR'],
    specialties_en: ['Professional Recruitment', 'Payroll Management', 'Employee Training', 'HR Consultancy'],
    
    workingHours_ar: 'الأحد - الخميس: 8 ص - 5 م',
    workingHours_en: 'Sun - Thu: 8 AM - 5 PM',
    
    location_ar: 'أبوظبي، منطقة الكورنيش',
    location_en: 'Abu Dhabi, Corniche Area',
    
    licenseNumber: 'MOHRE-78901',
    established: '2013',
    employees: '18'
  },

  // ─────────────────────────────────────────────────────────
  // التسويق
  // ─────────────────────────────────────────────────────────
  marketing: {
    businessName_ar: 'وكالة الإبداع التسويقية',
    businessName_en: 'Creativity Marketing Agency',
    verified: true,
    profileId: 'MKT-2024-7712',
    rating: 4.9,
    reviewCount: 287,
    avatar: 'و',
    avatarBg: '#EF4444',
    
    stats: [
      { value: '124', label_ar: 'حملة ناجحة', label_en: 'Successful Campaigns', icon: Award, color: '#EF4444' },
      { value: '18', label_ar: 'حملة نشطة', label_en: 'Active Campaigns', icon: Megaphone, color: '#2AA676' },
      { value: '280%', label_ar: 'متوسط ROI', label_en: 'Average ROI', icon: TrendingUp, color: '#C8A86A' }
    ],
    
    responseTime_ar: 'خلال ساعتين',
    responseTime_en: 'Within 2 hours',
    
    services: [
      { id: '1', name_ar: 'إدارة سوشيال ميديا', name_en: 'Social Media Management', price: 'يبدأ من 3,500 AED/شهر', icon: Megaphone },
      { id: '2', name_ar: 'إعلانات مدفوعة', name_en: 'Paid Advertising', price: '20% من ميزانية الإعلانات', icon: TrendingUp },
      { id: '3', name_ar: 'تصميم محتوى', name_en: 'Content Design', price: '150 AED/تصميم', icon: Paintbrush },
      { id: '4', name_ar: 'استراتيجية تسويقية', name_en: 'Marketing Strategy', price: '5,000 AED', icon: BarChart3 }
    ],
    
    reviews: [
      {
        id: '1',
        name_ar: 'خالد سعيد',
        name_en: 'Khaled Saeed',
        rating: 5,
        comment_ar: 'حملتهم التسويقية زادت مبيعاتنا بنسبة 200%!',
        comment_en: 'Their marketing campaign increased our sales by 200%!',
        date: '2024-01-20',
        avatar: 'خ'
      },
      {
        id: '2',
        name_ar: 'نورة أحمد',
        name_en: 'Noura Ahmed',
        rating: 5,
        comment_ar: 'فريق مبدع وأفكار تسويقية مبتكرة',
        comment_en: 'Creative team and innovative marketing ideas',
        date: '2024-01-15',
        avatar: 'ن'
      }
    ],
    
    about_ar: 'وكالة تسويق رقمي حائزة على جوائز منذ 2015. نتخصص في إدارة السوشيال ميديا والإعلانات المدفوعة مع نتائج مثبتة.',
    about_en: 'Award-winning digital marketing agency since 2015. We specialize in social media management and paid advertising with proven results.',
    
    specialties_ar: ['سوشيال ميديا', 'إعلانات Google', 'تصميم محتوى', 'استراتيجية تسويق'],
    specialties_en: ['Social Media', 'Google Ads', 'Content Design', 'Marketing Strategy'],
    
    workingHours_ar: 'السبت - الخميس: 9 ص - 6 م',
    workingHours_en: 'Sat - Thu: 9 AM - 6 PM',
    
    location_ar: 'دبي، مركز دبي المالي',
    location_en: 'Dubai, DIFC',
    
    licenseNumber: 'DED-789012',
    established: '2015',
    employees: '22'
  },

  // ─────────────────────────────────────────────────────────
  // الفعاليات
  // ─────────────────────────────────────────────────────────
  events: {
    businessName_ar: 'شركة الأحلام لتنظيم الفعاليات',
    businessName_en: 'Dreams Events Company',
    verified: true,
    profileId: 'EVT-2024-5567',
    rating: 4.9,
    reviewCount: 412,
    avatar: 'ف',
    avatarBg: '#8B5CF6',
    
    stats: [
      { value: '186', label_ar: 'فعالية منظمة', label_en: 'Events Organized', icon: Award, color: '#8B5CF6' },
      { value: '8', label_ar: 'فعالية نشطة', label_en: 'Active Events', icon: Calendar, color: '#2AA676' },
      { value: '99%', label_ar: 'رضا العملاء', label_en: 'Client Satisfaction', icon: Star, color: '#FFD700' }
    ],
    
    responseTime_ar: 'خلال ساعة',
    responseTime_en: 'Within 1 hour',
    
    services: [
      { id: '1', name_ar: 'تنظيم أعراس', name_en: 'Wedding Planning', price: 'يبدأ من 25,000 AED', icon: PartyPopper },
      { id: '2', name_ar: 'مؤتمرات وفعاليات', name_en: 'Conferences & Events', price: 'يبدأ من 15,000 AED', icon: Users },
      { id: '3', name_ar: 'حفلات خاصة', name_en: 'Private Parties', price: 'يبدأ من 8,000 AED', icon: PartyPopper },
      { id: '4', name_ar: 'تجهيز كامل', name_en: 'Full Setup', price: 'حسب الفعالية', icon: Package }
    ],
    
    reviews: [
      {
        id: '1',
        name_ar: 'عائشة محمد',
        name_en: 'Aisha Mohammed',
        rating: 5,
        comment_ar: 'نظموا حفل زفافي بشكل رائع! كل التفاصيل كانت مثالية',
        comment_en: 'Organized my wedding wonderfully! Every detail was perfect',
        date: '2024-01-22',
        avatar: 'ع'
      },
      {
        id: '2',
        name_ar: 'راشد سالم',
        name_en: 'Rashid Salem',
        rating: 5,
        comment_ar: 'مؤتمرنا السنوي كان احترافي جداً بفضلهم',
        comment_en: 'Our annual conference was very professional thanks to them',
        date: '2024-01-18',
        avatar: 'ر'
      }
    ],
    
    about_ar: 'شركة رائدة في تنظيم الفعاليات منذ 2011. نتخصص في الأعراس والمؤتمرات والحفلات الخاصة مع اهتمام بأدق التفاصيل.',
    about_en: 'Leading events company since 2011. We specialize in weddings, conferences and private parties with attention to finest details.',
    
    specialties_ar: ['أعراس فاخرة', 'مؤتمرات', 'حفلات VIP', 'تنسيق كامل'],
    specialties_en: ['Luxury Weddings', 'Conferences', 'VIP Parties', 'Full Coordination'],
    
    workingHours_ar: 'السبت - الخميس: 9 ص - 8 م',
    workingHours_en: 'Sat - Thu: 9 AM - 8 PM',
    
    location_ar: 'أبوظبي، قصر الإمارات',
    location_en: 'Abu Dhabi, Emirates Palace',
    
    licenseNumber: 'DET-456789',
    established: '2011',
    employees: '38'
  },

  // ─────────────────────────────────────────────────────────
  // المالية
  // ─────────────────────────────────────────────────────────
  finance: {
    businessName_ar: 'مكتب الثقة المحاسبي',
    businessName_en: 'Trust Accounting Office',
    verified: true,
    profileId: 'FIN-2024-8923',
    rating: 4.9,
    reviewCount: 234,
    avatar: 'ث',
    avatarBg: '#059669',
    
    stats: [
      { value: '128', label_ar: 'شركة عميلة', label_en: 'Client Companies', icon: Building2, color: '#059669' },
      { value: '5,240', label_ar: 'معاملة شهرياً', label_en: 'Monthly Transactions', icon: BarChart3, color: '#3B5BFE' },
      { value: '100%', label_ar: 'دقة مالية', label_en: 'Financial Accuracy', icon: CheckCircle, color: '#C8A86A' }
    ],
    
    responseTime_ar: 'خلال 3 ساعات',
    responseTime_en: 'Within 3 hours',
    
    services: [
      { id: '1', name_ar: 'محاسبة شاملة', name_en: 'Complete Accounting', price: 'يبدأ من 2,500 AED/شهر', icon: BarChart3 },
      { id: '2', name_ar: 'تدقيق مالي', name_en: 'Financial Auditing', price: 'حسب حجم الشركة', icon: FileText },
      { id: '3', name_ar: 'إعداد ميزانيات', name_en: 'Budget Preparation', price: 'يبدأ من 3,000 AED', icon: Wallet },
      { id: '4', name_ar: 'استشارات ضريبية', name_en: 'Tax Consultancy', price: '1,500 AED/جلسة', icon: Calculator }
    ],
    
    reviews: [
      {
        id: '1',
        name_ar: 'محمد سالم',
        name_en: 'Mohammed Salem',
        rating: 5,
        comment_ar: 'خدمة محاسبية احترافية ودقة متناهية في التقارير',
        comment_en: 'Professional accounting service and utmost accuracy in reports',
        date: '2024-01-21',
        avatar: 'م'
      },
      {
        id: '2',
        name_ar: 'سارة أحمد',
        name_en: 'Sara Ahmed',
        rating: 5,
        comment_ar: 'ساعدونا في تنظيم حساباتنا بشكل ممتاز',
        comment_en: 'Helped us organize our accounts excellently',
        date: '2024-01-16',
        avatar: 'س'
      }
    ],
    
    about_ar: 'مكتب محاسبة معتمد منذ 2009، نوفر خدمات محاسبية وتدقيق ضريبي شاملة. فريق من المحاسبين المعتمدين بخبرة تزيد عن 15 عاماً.',
    about_en: 'Certified accounting office since 2009, providing comprehensive accounting and tax audit services. Team of certified accountants with over 15 years experience.',
    
    specialties_ar: ['محاسبة شركات', 'تدقيق مالي', 'ضرائب', 'ميزانيات'],
    specialties_en: ['Corporate Accounting', 'Financial Auditing', 'Taxation', 'Budgets'],
    
    workingHours_ar: 'الأحد - الخميس: 8 ص - 5 م',
    workingHours_en: 'Sun - Thu: 8 AM - 5 PM',
    
    location_ar: 'دبي، شارع الشيخ زايد',
    location_en: 'Dubai, Sheikh Zayed Road',
    
    licenseNumber: 'ACC-UAE-12345',
    established: '2009',
    employees: '16'
  }
};