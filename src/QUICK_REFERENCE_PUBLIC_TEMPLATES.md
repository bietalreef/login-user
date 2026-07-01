# 🚀 دليل سريع — Templates العامة لبيت الريف

## 📍 المسارات والصفحات

| المسار | الملف | الوصف |
|--------|-------|-------|
| `/` | `SEOLandingPage.tsx` | الصفحة الرئيسية |
| `/provider/:slug` | `SEOProviderProfile.tsx` | ملف مزود الخدمة |
| `/product/:slug` | `SEOProductPage.tsx` | صفحة المنتج |
| `/map/:city` | `SEOMapPage.tsx` | خريطة المدينة |
| `/map/:city/:service` | `SEOMapPage.tsx` | خريطة المدينة + الخدمة |

---

## 🎨 الألوان السريعة

```css
/* الخلفيات */
#F5EEE1  /* رملي فاتح - الخلفية الرئيسية */
#EFE7D8  /* رملي داكن - الخلفية البديلة */
#ffffff  /* أبيض - البطاقات */

/* الألوان الأساسية */
#D4AF37  /* ذهبي */
#3B5BFE  /* أزرق ملكي */
#1F3D2B  /* نص أخضر داكن */

/* Frosted Glass */
rgba(255, 255, 255, 0.70)  /* خلفية البطاقات */
```

---

## 📦 المكونات الجاهزة

### Stars Component
```tsx
import { Stars } from './Stars';

<Stars rating={4.8} size="md" />
```

### SEO Helper Functions
```tsx
setMeta('description', 'النص...');
setLink('canonical', 'https://...');
injectJsonLd('id', { schema... });
```

---

## 🔍 أمثلة URLs

### مزودو الخدمات:
```
/provider/elite-contracting-dubai
/provider/emirates-building-group
/provider/quality-maintenance
```

### المنتجات:
```
/product/cement-bag-50kg
/product/marble-tile-carrara
```

### الخرائط:
```
/map/dubai
/map/abu-dhabi
/map/sharjah/contractors-in-uae
```

---

## 📊 البيانات التجريبية

### المزودون (6):
```tsx
DEMO_PROVIDERS = {
  'elite-contracting-dubai': {
    nameAr: 'شركة النخبة للمقاولات',
    rating: 4.9,
    reviewCount: 127,
    verified: true,
    ...
  },
  ...
}
```

### المنتجات (2):
```tsx
DEMO_PRODUCTS = {
  'cement-bag-50kg': {
    nameAr: 'كيس إسمنت بورتلاند 50 كجم',
    price: 28,
    discountPrice: 25,
    rating: 4.8,
    ...
  },
  ...
}
```

---

## 🎯 JSON-LD Schemas

### LocalBusiness (المزود):
```json
{
  "@type": "LocalBusiness",
  "name": "شركة النخبة للمقاولات",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.9,
    "reviewCount": 127
  }
}
```

### Product (المنتج):
```json
{
  "@type": "Product",
  "name": "كيس إسمنت بورتلاند 50 كجم",
  "offers": {
    "@type": "Offer",
    "price": 25,
    "priceCurrency": "AED"
  }
}
```

---

## 📱 Breakpoints

```css
sm:  640px   /* Mobile large */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Desktop large */
```

---

## ✅ Checklist التصميم

- [ ] ثيم رملي فاتح (#F5EEE1)
- [ ] Frosted Glass على البطاقات
- [ ] ألوان: ذهبي (#D4AF37) + أزرق (#3B5BFE)
- [ ] خط Cairo للعربية
- [ ] أيقونات من lucide-react
- [ ] Responsive (mobile/tablet/desktop)
- [ ] SEO: Title + Description + JSON-LD
- [ ] بدون Dark Mode
- [ ] بدون Emoji في الكود

---

## 🛠️ أوامر سريعة

```bash
# تطوير محلي
npm run dev

# بناء للإنتاج
npm run build

# معاينة البناء
npm run preview

# اختبار المسارات العامة
# افتح المتصفح على:
http://localhost:5173/
http://localhost:5173/provider/elite-contracting-dubai
http://localhost:5173/product/cement-bag-50kg
http://localhost:5173/map/dubai
```

---

## 📝 إضافة مزود جديد

```tsx
// في SEOProviderProfile.tsx
const DEMO_PROVIDERS: Record<string, ProviderData> = {
  'your-provider-slug': {
    slug: 'your-provider-slug',
    nameAr: 'اسم المزود',
    nameEn: 'Provider Name',
    specialty: 'التخصص',
    city: 'المدينة',
    rating: 4.8,
    reviewCount: 100,
    verified: true,
    yearsExperience: 10,
    projectsCompleted: 200,
    phone: '+971-XX-XXX-XXXX',
    email: 'info@example.ae',
    description: 'الوصف...',
    services: [...],
    portfolio: [...],
    reviews: [...],
  },
};
```

---

## 📝 إضافة منتج جديد

```tsx
// في SEOProductPage.tsx
const DEMO_PRODUCTS: Record<string, ProductData> = {
  'product-slug': {
    slug: 'product-slug',
    nameAr: 'اسم المنتج',
    nameEn: 'Product Name',
    category: 'الفئة',
    description: 'الوصف...',
    price: 100,
    discountPrice: 80,
    currency: 'AED',
    rating: 4.5,
    reviewCount: 50,
    availability: 'InStock',
    brand: 'العلامة',
    sku: 'SKU-001',
    delivery: 'التوصيل...',
    warranty: 'الضمان...',
    image: 'https://...',
    gallery: [...],
    specs: [...],
    features: [...],
    reviews: [...],
  },
};
```

---

## 🔗 روابط مهمة

- **التوثيق الكامل:** `/PUBLIC_TEMPLATES_REDESIGN.md`
- **الملخص العربي:** `/REDESIGN_SUMMARY_AR.md`
- **الملفات الأساسية:**
  - `/components/seo/SEOLandingPage.tsx`
  - `/components/seo/SEOProviderProfile.tsx`
  - `/components/seo/SEOProductPage.tsx`
  - `/components/seo/SEOMapPage.tsx`
  - `/components/seo/SEOHeader.tsx` (المشترك)
  - `/components/seo/SEOFooter.tsx` (المشترك)

---

## 🎯 نصائح سريعة

1. **للتطوير:**
   - استخدم بيانات تجريبية موجودة
   - اختبر Responsive على أحجام مختلفة
   - تحقق من SEO في Chrome DevTools

2. **للإنتاج:**
   - انقل الصور إلى `/public/assets/`
   - حوّل الصور إلى WebP
   - اختبر Lighthouse (يجب > 90)
   - تحقق من Google Search Console

3. **للـ SEO:**
   - تأكد من وجود H1 واحد فقط
   - استخدم H2 للأقسام الرئيسية
   - أضف alt text لجميع الصور
   - راجع JSON-LD في Schema.org validator

---

**آخر تحديث:** 25 مارس 2026  
**الحالة:** ✅ جاهز للاستخدام
