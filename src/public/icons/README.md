# أيقونات PWA - بيت الريف

## المطلوب:

لتفعيل ميزة PWA بالكامل، يجب إضافة الأيقونات التالية في هذا المجلد:

### الأيقونات الأساسية:
- `icon-72x72.png` - 72×72 بكسل
- `icon-96x96.png` - 96×96 بكسل
- `icon-128x128.png` - 128×128 بكسل
- `icon-144x144.png` - 144×144 بكسل
- `icon-152x152.png` - 152×152 بكسل
- `icon-192x192.png` - 192×192 بكسل ⭐ (مهم)
- `icon-384x384.png` - 384×384 بكسل
- `icon-512x512.png` - 512×512 بكسل ⭐ (مهم جداً)

### أيقونات إضافية:
- `badge-72x72.png` - لإشعارات Android
- `shortcut-ai.png` - اختصار AI Agent
- `shortcut-projects.png` - اختصار المشاريع
- `shortcut-services.png` - اختصار الخدمات

### Screenshots (اختياري):
- `screenshots/mobile-home.png` - 390×844 بكسل
- `screenshots/desktop-dashboard.png` - 1920×1080 بكسل

---

## كيفية إنشاء الأيقونات:

1. **استخدم شعار "بيت الريف"** (مع الخلفية الذهبية `#D4AF37`)
2. **اجعلها مربعة** (Safe Area: 80% من الحجم)
3. **استخدم خلفية شفافة أو ذهبية**
4. **Tools:**
   - Figma → Export 2x, 3x
   - [RealFaviconGenerator.net](https://realfavicongenerator.net/)
   - [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)

---

## توليد تلقائي:

```bash
# باستخدام pwa-asset-generator
npx pwa-asset-generator logo.svg ./public/icons --icon-only --background "#D4AF37" --padding "10%"
```

---

## ملاحظات:

- الأيقونات **icon-192x192.png** و **icon-512x512.png** **إلزامية** للـ PWA
- استخدم format **PNG** فقط
- تأكد من الخلفية الشفافة أو الذهبية (`#D4AF37`)
- Android يدعم **Maskable Icons** (مع Safe Area)

---

**بعد إضافة الأيقونات:**
1. امسح Cache المتصفح
2. افتح الموقع من جديد
3. اختبر التثبيت (على Chrome Mobile أو Desktop)
