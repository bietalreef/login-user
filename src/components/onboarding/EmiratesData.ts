/**
 * EmiratesData.ts — بيانات الإمارات والمدن والمناطق
 * ════════════════════════════════════════════════════
 * Cascading: إمارة → مدينة → منطقة
 */

export interface EmirateData {
  id: string;
  nameAr: string;
  nameEn: string;
  cities: CityData[];
}

export interface CityData {
  id: string;
  nameAr: string;
  nameEn: string;
  districts: DistrictData[];
}

export interface DistrictData {
  id: string;
  nameAr: string;
  nameEn: string;
}

export const UAE_EMIRATES: EmirateData[] = [
  {
    id: 'abu_dhabi',
    nameAr: 'أبوظبي',
    nameEn: 'Abu Dhabi',
    cities: [
      {
        id: 'abu_dhabi_city',
        nameAr: 'مدينة أبوظبي',
        nameEn: 'Abu Dhabi City',
        districts: [
          { id: 'al_reem', nameAr: 'جزيرة الريم', nameEn: 'Al Reem Island' },
          { id: 'al_raha', nameAr: 'الراحة', nameEn: 'Al Raha' },
          { id: 'khalifa_city', nameAr: 'مدينة خليفة', nameEn: 'Khalifa City' },
          { id: 'al_shamkha', nameAr: 'الشامخة', nameEn: 'Al Shamkha' },
          { id: 'al_mushrif', nameAr: 'المشرف', nameEn: 'Al Mushrif' },
          { id: 'al_karamah', nameAr: 'الكرامة', nameEn: 'Al Karamah' },
          { id: 'saadiyat', nameAr: 'جزيرة السعديات', nameEn: 'Saadiyat Island' },
          { id: 'yas_island', nameAr: 'جزيرة ياس', nameEn: 'Yas Island' },
          { id: 'al_bateen', nameAr: 'البطين', nameEn: 'Al Bateen' },
          { id: 'al_nahyan', nameAr: 'النهيان', nameEn: 'Al Nahyan' },
        ],
      },
      {
        id: 'al_ain',
        nameAr: 'العين',
        nameEn: 'Al Ain',
        districts: [
          { id: 'al_jimi', nameAr: 'الجيمي', nameEn: 'Al Jimi' },
          { id: 'al_muwaiji', nameAr: 'المويجعي', nameEn: 'Al Muwaiji' },
          { id: 'al_towayya', nameAr: 'الطوية', nameEn: 'Al Towayya' },
          { id: 'zakher', nameAr: 'زاخر', nameEn: 'Zakher' },
          { id: 'al_mutawaa', nameAr: 'المطوعة', nameEn: 'Al Mutawaa' },
          { id: 'hili', nameAr: 'هيلي', nameEn: 'Hili' },
        ],
      },
      {
        id: 'al_dhafra',
        nameAr: 'الظفرة',
        nameEn: 'Al Dhafra',
        districts: [
          { id: 'madinat_zayed', nameAr: 'مدينة زايد', nameEn: 'Madinat Zayed' },
          { id: 'liwa', nameAr: 'ليوا', nameEn: 'Liwa' },
          { id: 'ruwais', nameAr: 'الرويس', nameEn: 'Ruwais' },
        ],
      },
    ],
  },
  {
    id: 'dubai',
    nameAr: 'دبي',
    nameEn: 'Dubai',
    cities: [
      {
        id: 'dubai_city',
        nameAr: 'مدينة دبي',
        nameEn: 'Dubai City',
        districts: [
          { id: 'downtown', nameAr: 'وسط المدينة', nameEn: 'Downtown Dubai' },
          { id: 'marina', nameAr: 'مرسى دبي', nameEn: 'Dubai Marina' },
          { id: 'jbr', nameAr: 'جي بي آر', nameEn: 'JBR' },
          { id: 'business_bay', nameAr: 'الخليج التجاري', nameEn: 'Business Bay' },
          { id: 'deira', nameAr: 'ديرة', nameEn: 'Deira' },
          { id: 'bur_dubai', nameAr: 'بر دبي', nameEn: 'Bur Dubai' },
          { id: 'al_barsha', nameAr: 'البرشاء', nameEn: 'Al Barsha' },
          { id: 'jumeirah', nameAr: 'جميرا', nameEn: 'Jumeirah' },
          { id: 'al_quoz', nameAr: 'القوز', nameEn: 'Al Quoz' },
          { id: 'silicon_oasis', nameAr: 'واحة السيليكون', nameEn: 'Silicon Oasis' },
          { id: 'jvc', nameAr: 'قرية جميرا الدائرية', nameEn: 'JVC' },
          { id: 'dubai_hills', nameAr: 'دبي هيلز', nameEn: 'Dubai Hills' },
          { id: 'al_nahda', nameAr: 'النهدة', nameEn: 'Al Nahda' },
          { id: 'international_city', nameAr: 'المدينة العالمية', nameEn: 'International City' },
        ],
      },
      {
        id: 'hatta',
        nameAr: 'حتا',
        nameEn: 'Hatta',
        districts: [
          { id: 'hatta_center', nameAr: 'وسط حتا', nameEn: 'Hatta Center' },
        ],
      },
    ],
  },
  {
    id: 'sharjah',
    nameAr: 'الشارقة',
    nameEn: 'Sharjah',
    cities: [
      {
        id: 'sharjah_city',
        nameAr: 'مدينة الشارقة',
        nameEn: 'Sharjah City',
        districts: [
          { id: 'al_majaz', nameAr: 'المجاز', nameEn: 'Al Majaz' },
          { id: 'al_nahda_sh', nameAr: 'النهدة', nameEn: 'Al Nahda' },
          { id: 'al_qasimia', nameAr: 'القاسمية', nameEn: 'Al Qasimia' },
          { id: 'muwaileh', nameAr: 'مويلح', nameEn: 'Muwaileh' },
          { id: 'al_taawun', nameAr: 'التعاون', nameEn: 'Al Taawun' },
          { id: 'al_khan', nameAr: 'الخان', nameEn: 'Al Khan' },
          { id: 'university_city', nameAr: 'المدينة الجامعية', nameEn: 'University City' },
        ],
      },
      {
        id: 'kalba',
        nameAr: 'كلباء',
        nameEn: 'Kalba',
        districts: [
          { id: 'kalba_center', nameAr: 'وسط كلباء', nameEn: 'Kalba Center' },
        ],
      },
      {
        id: 'khorfakkan',
        nameAr: 'خورفكان',
        nameEn: 'Khorfakkan',
        districts: [
          { id: 'khorfakkan_center', nameAr: 'وسط خورفكان', nameEn: 'Khorfakkan Center' },
        ],
      },
    ],
  },
  {
    id: 'ajman',
    nameAr: 'عجمان',
    nameEn: 'Ajman',
    cities: [
      {
        id: 'ajman_city',
        nameAr: 'مدينة عجمان',
        nameEn: 'Ajman City',
        districts: [
          { id: 'al_nuaimia', nameAr: 'النعيمية', nameEn: 'Al Nuaimia' },
          { id: 'al_rashidiya_aj', nameAr: 'الراشدية', nameEn: 'Al Rashidiya' },
          { id: 'al_jurf', nameAr: 'الجرف', nameEn: 'Al Jurf' },
          { id: 'ajman_corniche', nameAr: 'كورنيش عجمان', nameEn: 'Ajman Corniche' },
          { id: 'al_hamidiyah', nameAr: 'الحميدية', nameEn: 'Al Hamidiyah' },
        ],
      },
      {
        id: 'masfout',
        nameAr: 'مصفوت',
        nameEn: 'Masfout',
        districts: [
          { id: 'masfout_center', nameAr: 'وسط مصفوت', nameEn: 'Masfout Center' },
        ],
      },
    ],
  },
  {
    id: 'rak',
    nameAr: 'رأس الخيمة',
    nameEn: 'Ras Al Khaimah',
    cities: [
      {
        id: 'rak_city',
        nameAr: 'مدينة رأس الخيمة',
        nameEn: 'RAK City',
        districts: [
          { id: 'al_nakheel_rak', nameAr: 'النخيل', nameEn: 'Al Nakheel' },
          { id: 'al_hamra_rak', nameAr: 'الحمرا', nameEn: 'Al Hamra' },
          { id: 'al_jazeera_rak', nameAr: 'الجزيرة', nameEn: 'Al Jazeera' },
          { id: 'khuzam', nameAr: 'خزام', nameEn: 'Khuzam' },
          { id: 'al_dhait', nameAr: 'الضيت', nameEn: 'Al Dhait' },
        ],
      },
    ],
  },
  {
    id: 'fujairah',
    nameAr: 'الفجيرة',
    nameEn: 'Fujairah',
    cities: [
      {
        id: 'fujairah_city',
        nameAr: 'مدينة الفجيرة',
        nameEn: 'Fujairah City',
        districts: [
          { id: 'al_faseel', nameAr: 'الفصيل', nameEn: 'Al Faseel' },
          { id: 'merashid', nameAr: 'مرشد', nameEn: 'Merashid' },
          { id: 'sakamkam', nameAr: 'سكمكم', nameEn: 'Sakamkam' },
        ],
      },
      {
        id: 'dibba_fuj',
        nameAr: 'دبا الفجيرة',
        nameEn: 'Dibba Al-Fujairah',
        districts: [
          { id: 'dibba_center', nameAr: 'وسط دبا', nameEn: 'Dibba Center' },
        ],
      },
    ],
  },
  {
    id: 'uaq',
    nameAr: 'أم القيوين',
    nameEn: 'Umm Al Quwain',
    cities: [
      {
        id: 'uaq_city',
        nameAr: 'مدينة أم القيوين',
        nameEn: 'UAQ City',
        districts: [
          { id: 'al_salama_uaq', nameAr: 'السلامة', nameEn: 'Al Salama' },
          { id: 'al_raas_uaq', nameAr: 'الراس', nameEn: 'Al Raas' },
          { id: 'al_surra', nameAr: 'السرة', nameEn: 'Al Surra' },
        ],
      },
    ],
  },
];

// ─── Service Specializations ───
export const SPECIALIZATIONS = [
  { id: 'construction', ar: 'مقاولات وبناء', en: 'Construction & Building' },
  { id: 'engineering', ar: 'استشارات هندسية', en: 'Engineering Consulting' },
  { id: 'maintenance', ar: 'صيانة عامة', en: 'General Maintenance' },
  { id: 'plumbing', ar: 'سباكة', en: 'Plumbing' },
  { id: 'electricity', ar: 'كهرباء', en: 'Electricity' },
  { id: 'painting', ar: 'دهان وطلاء', en: 'Painting' },
  { id: 'carpentry', ar: 'نجارة', en: 'Carpentry' },
  { id: 'ac', ar: 'تكييف وتبريد', en: 'AC & Cooling' },
  { id: 'interior', ar: 'تصميم داخلي', en: 'Interior Design' },
  { id: 'exterior', ar: 'تصميم خارجي', en: 'Exterior Design' },
  { id: 'cleaning', ar: 'تنظيف', en: 'Cleaning' },
  { id: 'equipment', ar: 'تأجير معدات', en: 'Equipment Rental' },
  { id: 'materials', ar: 'مواد بناء', en: 'Building Materials' },
  { id: 'furniture', ar: 'أثاث وديكور', en: 'Furniture & Decor' },
  { id: 'landscaping', ar: 'تنسيق حدائق', en: 'Landscaping' },
  { id: 'security', ar: 'أنظمة أمان', en: 'Security Systems' },
  { id: 'smart_home', ar: 'منزل ذكي', en: 'Smart Home' },
  { id: 'flooring', ar: 'أرضيات', en: 'Flooring' },
  { id: 'glass', ar: 'زجاج وألمنيوم', en: 'Glass & Aluminum' },
  { id: 'waterproofing', ar: 'عزل مائي', en: 'Waterproofing' },
];

// ─── General Specializations (for Companies) ───
export const GENERAL_SPECIALIZATIONS = [
  { id: 'general_contracting', ar: 'مقاولات عامة', en: 'General Contracting' },
  { id: 'design', ar: 'تصميم', en: 'Design' },
  { id: 'maintenance_gen', ar: 'صيانة', en: 'Maintenance' },
  { id: 'supply', ar: 'توريد', en: 'Supply' },
  { id: 'consulting', ar: 'استشارات', en: 'Consulting' },
  { id: 'real_estate', ar: 'عقارات', en: 'Real Estate' },
];

// ─── Social Media Platforms ───
export const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', placeholder: '@username', icon: 'instagram' },
  { id: 'tiktok', label: 'TikTok', placeholder: '@username', icon: 'tiktok' },
  { id: 'youtube', label: 'YouTube', placeholder: 'channel URL', icon: 'youtube' },
  { id: 'x_twitter', label: 'X (Twitter)', placeholder: '@handle', icon: 'twitter' },
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'profile URL', icon: 'linkedin' },
  { id: 'website', label: 'Website', placeholder: 'https://...', icon: 'globe' },
];

// ─── Years of Experience Options ───
export const EXPERIENCE_OPTIONS = [
  { value: 1, ar: 'أقل من سنة', en: 'Less than 1 year' },
  { value: 2, ar: '1-2 سنة', en: '1-2 years' },
  { value: 5, ar: '3-5 سنوات', en: '3-5 years' },
  { value: 10, ar: '6-10 سنوات', en: '6-10 years' },
  { value: 15, ar: '11-15 سنة', en: '11-15 years' },
  { value: 20, ar: '16-20 سنة', en: '16-20 years' },
  { value: 25, ar: 'أكثر من 20 سنة', en: 'More than 20 years' },
];
