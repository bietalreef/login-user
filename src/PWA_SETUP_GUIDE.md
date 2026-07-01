# 📱 دليل إعداد PWA - بيت الريف

## ✅ **تم تنفيذه:**

### 1️⃣ **Manifest.json** (`/public/manifest.json`)
- ✅ اسم التطبيق (عربي + إنجليزي)
- ✅ الألوان الرسمية (ذهبي `#D4AF37` + رملي `#F5EEE1`)
- ✅ الأيقونات بجميع المقاسات (72px → 512px)
- ✅ Screenshots (موبايل + ديسكتوب)
- ✅ Shortcuts (AI Agent, Projects, Services)
- ✅ Share Target (مشاركة المحتوى)
- ✅ Display Mode: `standalone` (تطبيق كامل)
- ✅ RTL Support (`dir: "rtl"`)

---

### 2️⃣ **Service Worker** (`/public/service-worker.js`)
- ✅ تخزين الملفات للاستخدام Offline
- ✅ استراتيجية: **Network First** مع **Cache Fallback**
- ✅ Background Sync (مزامنة تلقائية)
- ✅ Push Notifications (دعم الإشعارات)
- ✅ تحديث تلقائي عند وجود نسخة جديدة

---

### 3️⃣ **PWA Hook** (`/hooks/usePWA.ts`)
```typescript
const {
  isInstallable,     // هل التطبيق قابل للتثبيت؟
  isInstalled,       // هل تم التثبيت؟
  isOnline,          // هل المستخدم متصل؟
  install,           // دالة التثبيت
  registerServiceWorker,  // تسجيل Service Worker
  requestNotificationPermission,  // طلب إذن الإشعارات
  sendTestNotification,  // إرسال إشعار تجريبي
} = usePWA();
```

---

### 4️⃣ **Install Prompt** (`/components/mobile/InstallPWAPrompt.tsx`)
- ✅ زر عائم (FAB) للتثبيت
- ✅ Modal فاخر مع تصميم ذهبي
- ✅ 3 ميزات رئيسية (Offline, Fast, Native)
- ✅ مؤشر Offline/Online
- ✅ رسالة تأكيد بعد التثبيت
- ✅ دعم Dark Mode
- ✅ RTL Support

---

### 5️⃣ **تكامل في App.tsx**
- ✅ استيراد `InstallPWAPrompt`
- ✅ عرض المكون بعد `<Toaster />`
- ✅ متاح في جميع الصفحات

---

## 🚀 **الخطوات التالية:**

### **أ) إضافة الأيقونات:**
1. انتقل إلى `/public/icons/`
2. أضف الأيقونات بالمقاسات المطلوبة:
   - `icon-192x192.png` ⭐ (إلزامي)
   - `icon-512x512.png` ⭐ (إلزامي)
   - بقية المقاسات (اختياري)

**توليد تلقائي:**
```bash
npx pwa-asset-generator logo.svg ./public/icons --icon-only --background "#D4AF37" --padding "10%"
```

---

### **ب) إضافة Meta Tags في HTML:**

في ملف `index.html` الرئيسي (إذا موجود)، أضف:

```html
<head>
  <!-- PWA Meta Tags -->
  <meta name="application-name" content="بيت الريف - Beit Al Reef">
  <meta name="apple-mobile-web-app-title" content="بيت الريف">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#D4AF37">
  
  <!-- Manifest -->
  <link rel="manifest" href="/manifest.json">
  
  <!-- Apple Touch Icons -->
  <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png">
  <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png">
  <link rel="shortcut icon" href="/icons/icon-192x192.png">
</head>
```

---

### **ج) تفعيل HTTPS:**

⚠️ **PWA يعمل فقط على HTTPS!**

- ✅ Cloudflare Pages → HTTPS تلقائي
- ✅ Netlify → HTTPS تلقائي
- ✅ Localhost → يعمل بدون HTTPS

---

### **د) اختبار التثبيت:**

#### **Chrome Desktop:**
1. افتح DevTools → `Application` → `Manifest`
2. تحقق من عدم وجود أخطاء
3. اضغط `Lighthouse` → Run PWA Audit
4. في شريط URL، انقر أيقونة التثبيت (+)

#### **Chrome Mobile:**
1. افتح الموقع: `https://app.bietalreef.ae`
2. انتظر 5 ثوان → يظهر زر التثبيت
3. اضغط "ثبّت الآن"
4. التطبيق يُضاف للشاشة الرئيسية

#### **iOS Safari:**
1. افتح Safari
2. اضغط زر المشاركة
3. اختر "Add to Home Screen"
4. التطبيق يُضاف للشاشة الرئيسية

---

## 🔍 **التحقق من الجودة:**

### **Lighthouse Audit:**
```bash
# من Chrome DevTools
1. F12 → Lighthouse
2. اختر "Progressive Web App"
3. Run Audit
4. يجب أن تحصل على 100/100
```

### **Chrome PWA Checklist:**
- ✅ Manifest موجود
- ✅ Service Worker مسجل
- ✅ الأيقونات متوفرة (192px + 512px)
- ✅ يعمل Offline
- ✅ HTTPS مفعّل
- ✅ Viewport responsive

---

## 🎯 **الميزات المتقدمة:**

### **1. Background Sync:**
```javascript
// في Service Worker
navigator.serviceWorker.ready.then(registration => {
  registration.sync.register('sync-data');
});
```

### **2. Push Notifications:**
```javascript
// طلب الإذن
const permission = await requestNotificationPermission();

// إرسال إشعار
await sendTestNotification();
```

### **3. Share Target:**
```javascript
// في manifest.json (موجود بالفعل)
"share_target": {
  "action": "/share",
  "method": "POST"
}
```

---

## 📊 **المتطلبات الفنية:**

| المتطلب | الحالة |
|---------|--------|
| HTTPS | ✅ (Cloudflare) |
| Manifest | ✅ |
| Service Worker | ✅ |
| Icons (192px) | ⏳ (يدوي) |
| Icons (512px) | ⏳ (يدوي) |
| Offline Support | ✅ |
| Install Prompt | ✅ |
| Responsive | ✅ |
| Theme Color | ✅ (#D4AF37) |

---

## 🐛 **استكشاف الأخطاء:**

### **المشكلة: زر التثبيت لا يظهر**
✅ الحلول:
1. تحقق من وجود الأيقونات (192px + 512px)
2. تحقق من تسجيل Service Worker (DevTools → Application)
3. امسح Cache: DevTools → Application → Clear Storage
4. جرّب Incognito Mode

### **المشكلة: Service Worker لا يعمل**
✅ الحلول:
1. تحقق من HTTPS
2. افتح DevTools → Console → شوف الأخطاء
3. Unregister السابق: DevTools → Application → Service Workers → Unregister

### **المشكلة: لا يعمل Offline**
✅ الحلول:
1. تحقق من Cache Strategy في Service Worker
2. جرّب: DevTools → Network → Offline
3. افتح DevTools → Application → Cache Storage

---

## 📱 **دعم المنصات:**

| المنصة | التثبيت | Offline | Notifications |
|--------|---------|---------|---------------|
| Chrome Desktop | ✅ | ✅ | ✅ |
| Chrome Mobile | ✅ | ✅ | ✅ |
| Edge Desktop | ✅ | ✅ | ✅ |
| Safari iOS | 🟡 (Add to Home) | ✅ | ❌ |
| Samsung Internet | ✅ | ✅ | ✅ |
| Firefox | 🟡 (محدود) | ✅ | 🟡 |

---

## 🎉 **النتيجة النهائية:**

بعد إكمال الخطوات:
- ✅ التطبيق قابل للتثبيت على الجوال والكمبيوتر
- ✅ يعمل بدون إنترنت (Offline)
- ✅ يظهر في الشاشة الرئيسية مثل التطبيقات الأصلية
- ✅ تحميل سريع + تجربة سلسة
- ✅ إشعارات مباشرة (بعد الإذن)
- ✅ مشاركة المحتوى مع التطبيق

---

**🚀 بيت الريف أصبح الآن PWA احترافي!**

للمساعدة: [PWA Documentation](https://web.dev/progressive-web-apps/)
