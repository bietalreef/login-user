# نموذج تطبيق الترجمة على صفحات الخدمات

## المثال: ServiceDetailCleaning.tsx

### قبل التعديل (يحتوي نصوص ثابتة):
```typescript
// ❌ خطأ - نصوص ثابتة
export function ServiceDetailCleaning() {
  return (
    <div>
      <h1>خدمات التنظيف</h1>
      <p>أفضل خدمات تنظيف في الإمارات</p>
      <button>احجز الآن</button>
    </div>
  );
}
```

### بعد التعديل (يستخدم نظام الترجمة):
```typescript
// ✅ صحيح - يستخدم الترجمة
import { useTranslation } from '../../contexts/LanguageContext';

export function ServiceDetailCleaning() {
  const { t, dir } = useTranslation('services');
  
  return (
    <div dir={dir}>
      <h1>{t('cleaning')}</h1>
      <p>{t('cleaningServices.description')}</p>
      <button>{t('bookNow')}</button>
    </div>
  );
}
```

## المفاتيح المطلوب إضافتها في services.ts

### لكل خدمة من التسع خدمات:

```typescript
// في /locales/en/services.ts
export const services = {
  // ... existing code ...
  
  // General CTAs (مشتركة بين جميع الخدمات)
  getQuote: "Get a Quote",
  bookNow: "Book Now",
  contactUs: "Contact Us",
  requestService: "Request Service",
  viewDetails: "View Details",
  
  // Common Descriptions
  bestInUAE: "Best in UAE",
  certifiedProviders: "Certified Providers",
  highQuality: "High Quality Service",
  bestPrices: "Best Prices",
  fastResponse: "Fast Response",
  available24_7: "Available 24/7",
  
  // Reviews Section
  reviews_count: "reviews",
  rating: "Rating",
  
  // Provider Info
  provider: "Provider",
  providers: "Providers",
  topProviders: "Top Providers",
  
  // Tabs (موجودة بالفعل)
  tabs: {
    details: "Details",
    providers: "Providers",
    reviews: "Reviews",
  },
};
```

```typescript
// في /locales/ar/services.ts
export const services = {
  // ... existing code ...
  
  // General CTAs
  getQuote: "احصل على عرض سعر",
  bookNow: "احجز الآن",
  contactUs: "اتصل بنا",
  requestService: "اطلب الخدمة",
  viewDetails: "عرض التفاصيل",
  
  // Common Descriptions
  bestInUAE: "الأفضل في الإمارات",
  certifiedProviders: "مزودون معتمدون",
  highQuality: "خدمة عالية الجودة",
  bestPrices: "أفضل الأسعار",
  fastResponse: "استجابة سريعة",
  available24_7: "متاح 24/7",
  
  // Reviews Section
  reviews_count: "تقييم",
  rating: "التقييم",
  
  // Provider Info
  provider: "مزود",
  providers: "المزودون",
  topProviders: "أفضل المزودين",
  
  // Tabs
  tabs: {
    details: "التفاصيل",
    providers: "المزودون",
    reviews: "التقييمات",
  },
};
```

## نمط التطبيق الموحد

### 1. استيراد useTranslation
```typescript
import { useTranslation } from '../../contexts/LanguageContext';
```

### 2. استخدام Hook
```typescript
const { t, dir } = useTranslation('services');
```

### 3. تطبيق dir على العناصر الرئيسية
```typescript
<div className="..." dir={dir}>
```

### 4. استبدال النصوص
```typescript
// ❌ قبل
{dir === 'rtl' ? 'خدمات التنظيف' : 'Cleaning Services'}

// ✅ بعد
{t('cleaning')}
```

### 5. الأزرار والعناصر التفاعلية
```typescript
// ❌ قبل
<button>{dir === 'rtl' ? 'احجز الآن' : 'Book Now'}</button>

// ✅ بعد
<button>{t('bookNow')}</button>
```

## النصوص التي يجب تجنبها

### ❌ لا تترك هذه الأنماط:
1. `dir === 'rtl' ? 'نص عربي' : 'English text'`
2. نصوص عربية مكتوبة مباشرة: `<h1>مقاولات البناء</h1>`
3. نصوص إنجليزية مكتوبة مباشرة: `<h1>Construction Contracting</h1>`
4. استخدام `${}` template literals مع نصوص ثابتة

### ✅ استخدم بدلاً من ذلك:
1. `{t('key')}`
2. `{t('section.key')}`
3. `{t('key', { variable: value })}` (إذا كان يدعم interpolation)

## قائمة التحقق لكل صفحة خدمة

- [ ] استيراد `useTranslation`
- [ ] إضافة `const { t, dir } = useTranslation('services')`
- [ ] تطبيق `dir={dir}` على العنصر الرئيسي
- [ ] استبدال العنوان الرئيسي بـ `t()`
- [ ] استبدال الوصف بـ `t()`
- [ ] استبدال جميع الأزرار بـ `t()`
- [ ] استبدال الـ Tabs بـ `t('tabs.details')` إلخ
- [ ] استبدال عناصر القائمة/الخدمات الفرعية
- [ ] استبدال نصوص التقييمات
- [ ] التأكد من عدم وجود أي `dir === 'rtl' ? ... : ...`

## مثال كامل لملف محدث

```typescript
import { useState } from 'react';
import { ArrowRight, Star, Sparkles } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { GlassCard } from './GlassCard';
import { useTranslation } from '../../contexts/LanguageContext';

interface ServiceDetailCleaningProps {
  onBack: () => void;
  onNavigate?: (tab: string) => void;
  onOpenSearch?: () => void;
}

export function ServiceDetailCleaning({ 
  onBack, 
  onNavigate, 
  onOpenSearch 
}: ServiceDetailCleaningProps) {
  const { t, dir } = useTranslation('services');
  const [activeTab, setActiveTab] = useState<'details' | 'providers' | 'reviews'>('details');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir={dir}>
      {/* Header */}
      <div className="bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack}>
              <ArrowRight className={`w-6 h-6 ${dir === 'rtl' ? '' : 'rotate-180'}`} />
            </button>
            <h1 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              {t('cleaning')}
            </h1>
            <div className="w-6" />
          </div>
          
          <p style={{ fontFamily: 'Cairo, sans-serif' }}>
            {t('cleaningServices.description')}
          </p>
          
          <button 
            className="mt-4 bg-white text-[#1F3D2B] px-6 py-2 rounded-full"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
          >
            {t('bookNow')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-2">
          {(['details', 'providers', 'reviews'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full ${
                activeTab === tab
                  ? 'bg-[#2AA676] text-white'
                  : 'bg-white text-[#1F3D2B]'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
            >
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="container mx-auto px-4">
        {activeTab === 'details' && (
          <div className="space-y-4">
            <GlassCard className="p-4">
              <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {t('cleaningServices.title')}
              </h3>
              {/* More content... */}
            </GlassCard>
          </div>
        )}
        
        {/* Similar for other tabs... */}
      </div>

      <BottomNav 
        activeTab="services" 
        onTabChange={(tab) => onNavigate?.(tab)} 
      />
    </div>
  );
}
```

## ملاحظات هامة

1. **لا تنس `dir={dir}`**: يجب تطبيقه على العنصر الرئيسي
2. **الأيقونات**: قد تحتاج لتدوير السهم حسب الاتجاه: `${dir === 'rtl' ? '' : 'rotate-180'}`
3. **الخطوط**: استخدم `fontFamily: 'Cairo, sans-serif'` للنصوص العربية
4. **SEO**: استخدم `t()` حتى في metadata و SEO tags
5. **الاختبار**: اختبر كل صفحة في كلا اللغتين قبل الانتقال للتالية

## قائمة الخدمات التسع التي تحتاج هذا التطبيق

1. ✅ ServiceDetailConstructionContracting.tsx - (نموذج لباقي الصفحات)
2. ⏳ ServiceDetailEngineeringConsultation.tsx
3. ⏳ ServiceDetailMaintenance.tsx
4. ⏳ ServiceDetailCraftsmen.tsx
5. ⏳ ServiceDetailWorkshops.tsx
6. ⏳ ServiceDetailEquipmentRental.tsx
7. ⏳ ServiceDetailBuildingMaterials.tsx
8. ⏳ ServiceDetailFurnitureDecor.tsx
9. ⏳ ServiceDetailCleaning.tsx
