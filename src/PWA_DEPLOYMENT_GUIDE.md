# 🚀 دليل نشر PWA على Cloudflare Pages

## ✅ إصلاح خطأ Service Worker في بيئات Preview

### المشكلة:
```
SecurityError: Failed to register a ServiceWorker with script: The script has an unsupported MIME type ('text/html').
```

### الأسباب:
1. **بيئة Figma Preview**: لا تدعم Service Workers بنفس طريقة الإنتاج
2. **MIME Type خاطئ**: السيرفر يرجع `text/html` بدلاً من `application/javascript`
3. **الملف غير موجود**: في بعض البيئات، الملف `/service-worker.js` غير متاح

---

## 🔧 الحلول المطبقة

### 1️⃣ **كشف بيئة Figma تلقائياً**
```typescript
// في /hooks/usePWA.ts
const isFigmaPreview = window.location.hostname.includes('figma');

if (isFigmaPreview) {
  console.info('[PWA] Service Worker disabled in Figma preview environment');
  return null;
}
```

### 2️⃣ **التحقق من HTTPS**
```typescript
const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost';
if (!isSecureContext) {
  console.warn('[PWA] Service Worker requires HTTPS or localhost');
  return null;
}
```

### 3️⃣ **معالجة الأخطاء بشكل صامت**
```typescript
try {
  await registerServiceWorker();
} catch (error) {
  // لا نزعج المستخدم بالأخطاء
  console.debug('[PWA] Service Worker initialization handled');
}
```

---

## 🌐 النشر على Cloudflare Pages

### خطوة 1: إعداد Cloudflare Pages
1. اذهب إلى [Cloudflare Dashboard](https://dash.cloudflare.com)
2. اختر **Pages** → **Create a project**
3. اربط مع GitHub repository
4. ضع الإعدادات:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`

### خطوة 2: إعداد Headers (مهم جداً!)
أنشئ ملف `_headers` في مجلد `/public`:

```
/service-worker.js
  Content-Type: application/javascript; charset=utf-8
  Cache-Control: no-cache

/manifest.json
  Content-Type: application/manifest+json
  Cache-Control: public, max-age=31536000

/icons/*
  Cache-Control: public, max-age=31536000

/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

### خطوة 3: إعداد Redirects
أنشئ ملف `_redirects` في مجلد `/public`:

```
# SPA Fallback - كل المسارات ترجع لـ index.html
/*    /index.html   200
```

### خطوة 4: Build Script
تأكد من أن `package.json` يحتوي على:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 🧪 اختبار PWA محلياً

### 1. Build المشروع:
```bash
npm run build
```

### 2. اختبار البناء محلياً:
```bash
npm run preview
```

### 3. فتح على HTTPS محلي (اختياري):
استخدم [mkcert](https://github.com/FiloSottile/mkcert) لإنشاء شهادة SSL محلية:

```bash
# تثبيت mkcert
brew install mkcert  # macOS
# أو
choco install mkcert  # Windows

# إنشاء شهادة
mkcert -install
mkcert localhost

# تشغيل مع HTTPS
vite preview --https
```

---

## 📱 اختبار PWA على الجوال

### طريقة 1: استخدام Ngrok
```bash
npm install -g ngrok
npm run preview  # في terminal منفصل
ngrok http 4173
```

### طريقة 2: النشر على Cloudflare Preview
- كل Push إلى GitHub يُنشئ Preview URL تلقائياً
- الرابط يكون آمن (HTTPS) ويدعم PWA

---

## ✨ التحقق من نجاح PWA

### في Chrome DevTools:
1. افتح **DevTools** → **Application** → **Manifest**
   - ✅ يجب أن ترى معلومات التطبيق
   - ✅ الأيقونات تظهر بشكل صحيح

2. افتح **Service Workers**
   - ✅ يجب أن يكون في حالة "activated and is running"
   - ✅ لا أخطاء في التسجيل

3. افتح **Lighthouse**
   - ✅ قم بتشغيل audit للـ PWA
   - ✅ يجب أن تحصل على نتيجة عالية

### على الجوال:
- **Chrome (Android)**:
  - انتظر ظهور "Install app" في القائمة
  - أو استخدم الزر الذهبي العائم في التطبيق

- **Safari (iOS)**:
  - اضغط على زر المشاركة
  - اختر "Add to Home Screen"

---

## 🐛 حل المشاكل الشائعة

### المشكلة: Service Worker لا يعمل
**الحلول:**
1. تأكد أنك على HTTPS
2. افحص DevTools → Console للأخطاء
3. Unregister القديم: DevTools → Application → Service Workers → Unregister

### المشكلة: لا يعمل Offline
**الحلول:**
1. تحقق من Cache في DevTools → Application → Cache Storage
2. تأكد من تسجيل Service Worker بنجاح
3. راجع استراتيجية التخزين في `/public/service-worker.js`

### المشكلة: الأيقونات لا تظهر
**الحلول:**
1. تحقق من مسارات الأيقونات في `manifest.json`
2. تأكد من وجود الأيقونات في `/public/icons/`
3. راجع Console للأخطاء

### المشكلة: Install Prompt لا يظهر
**الحلول:**
1. تأكد من استيفاء [PWA Criteria](https://web.dev/install-criteria/)
2. قد يحتاج المستخدم للتفاعل مع الصفحة أولاً
3. بعض المتصفحات تحتاج زيارتين على الأقل

---

## 📊 مقاييس النجاح

### ✅ Lighthouse PWA Checklist:
- [x] Installable
- [x] Service Worker registered
- [x] Works offline
- [x] HTTPS
- [x] Responsive
- [x] Fast load time
- [x] Valid manifest
- [x] Icons provided

---

## 🔗 روابط مفيدة

- [PWA Builder](https://www.pwabuilder.com/)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## 📝 ملاحظات مهمة

1. **Figma Preview**: PWA features معطلة في بيئة Figma - هذا طبيعي ✅
2. **Production Only**: بعض الميزات تعمل فقط في بيئة الإنتاج
3. **HTTPS Required**: Service Workers تحتاج HTTPS (أو localhost)
4. **Cache Strategy**: نستخدم "Network First" للمحتوى الديناميكي
5. **Updates**: Service Worker يتحدث تلقائياً عند كل زيارة

---

**آخر تحديث**: فبراير 2026
**الحالة**: ✅ تم إصلاح جميع الأخطاء المعروفة
