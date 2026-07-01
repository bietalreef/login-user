# دليل الأصول — /public/assets/

## البنية المطلوبة لمجلدات المتجر

```
/public/assets/
├── shop/
│   ├── products/          ← صور منتجات المتجر (WebP)
│   │   ├── marble-countertop.webp
│   │   ├── walnut-dining-table.webp
│   │   ├── white-lacquer-kitchen.webp
│   │   ├── porcelain-tiles-60x120.webp
│   │   ├── bathroom-vanity-led.webp
│   │   └── gypsum-board-led.webp
│   ├── banners/           ← بانرات العروض والترويج
│   │   ├── summer-sale.webp
│   │   └── new-arrivals.webp
│   └── categories/        ← صور فئات المتجر
│       ├── marble.webp
│       ├── kitchens.webp
│       ├── flooring.webp
│       ├── bathrooms.webp
│       ├── decor.webp
│       └── furniture.webp
├── seo/                   ← صور صفحات SEO العامة
└── README.md              ← هذا الملف
```

---

## خطوات إضافة صورة جديدة

### 1. تحويل الصورة إلى WebP
- افتح أداة المحوّل: `/webp` أو `/tools/webp-converter`
- ارفع الصورة الأصلية (PNG/JPG)
- اختر مجلد الوجهة من قائمة الإعدادات
- حمّل الملف المحوّل

### 2. ضع الملف في المسار الصحيح
```
/public/assets/shop/products/اسم-الصورة.webp
```

### 3. حدّث سجل الأصول
افتح `/data/shopAssets.ts` وغيّر `local: null` إلى المسار:
```ts
p1: {
  local: '/assets/shop/products/marble-countertop.webp',  // ← بعد التفعيل
  unsplash: 'https://images.unsplash.com/...'              // ← احتياطي تلقائي
}
```

---

## نظام الـ Fallback

```
الصورة المحلية (WebP) ←← إذا لم تُحدَّد أو غير موجودة ←← Unsplash CDN
```

دالة `resolveAsset()` في `shopAssets.ts` تتولى ذلك تلقائياً.

---

## معايير الصور

| المعيار     | المنتجات      | البانرات       | الفئات        |
|-------------|---------------|----------------|---------------|
| الصيغة      | WebP          | WebP           | WebP          |
| الأبعاد     | 800×600 px    | 1280×480 px    | 400×400 px    |
| الحجم الأقصى | 200 KB        | 300 KB         | 80 KB         |
| الجودة      | 85%           | 80%            | 80%           |
| التسمية     | kebab-case    | kebab-case     | kebab-case    |

---

## ملاحظات مهمة

1. **لا تستخدم** `figma:asset` في الطبقة العامة (SEO/Shop)
2. **لا تستخدم** صور بحجم أكبر من 500 KB في أي حال
3. **احتفظ دائماً** بـ Unsplash fallback في `shopAssets.ts`
4. **اسم الملف** يجب أن يكون kebab-case بالإنجليزية لـ SEO

---

**آخر تحديث:** 25 مارس 2026
