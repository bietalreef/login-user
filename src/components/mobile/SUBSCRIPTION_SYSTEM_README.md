# نظام النماذج والأدوات حسب الباقات
## Subscription-Based Documents & Tools System

## 📋 نظرة عامة / Overview

تم تطوير نظام شامل لإدارة النماذج (Documents) والأدوات (Tools) داخل تطبيق بيت الريف، مع توزيعها حسب باقات الاشتراك (Free, Pro, Enterprise).

A comprehensive system for managing Documents and Tools in Beit Al Reef platform, distributed across subscription tiers (Free, Pro, Enterprise).

---

## 🏗️ البنية / Architecture

### 1. **subscriptionTiers.ts**
ملف أساسي يحتوي على:
- **DOCUMENT_TEMPLATES**: 30+ نموذج (عقود، فواتير، عروض أسعار، تقارير)
- **TOOL_FEATURES**: 20+ أداة (ذكاء اصطناعي، تحليلات، أتمتة)
- **SUBSCRIPTION_TIERS**: 3 باقات (Free, Pro, Enterprise)
- **Utility Functions**: دوال للتحقق من الصلاحيات

### 2. **dashboardData_complete.ts**
يربط كل داشبورد بالنماذج والأدوات الموصى بها:
- `real_estate`: عقود إيجار، فواتير، إدارة مشاريع
- `contracting`: عقود مقاولة، عروض أسعار، حاسبة تكاليف
- `interior`: عقود خدمات، مولد تصاميم
- `healthcare`, `legal`, `education`, `retail`, `hr`, `marketing`, `events`, `finance`

### 3. **DocumentsToolsSection.tsx**
مكون React يعرض:
- تبويبات للنماذج والأدوات
- مؤشرات الباقات (Free/Pro/Enterprise)
- قفل العناصر غير المتاحة
- نافذة منبثقة للتفاصيل

### 4. **DashboardShowcase.tsx** (Updated)
تم دمج `DocumentsToolsSection` في معاينة كل داشبورد

---

## 📦 النماذج / Documents

### المالية (Financial) - 8 نماذج
| النموذج | الباقة | الوصف |
|---------|--------|-------|
| فاتورة ضريبية | FREE | متوافقة مع الضريبة الإماراتية |
| عرض سعر | FREE | مع جدول بنود وشروط دفع |
| إيصال استلام | FREE | إثبات استلام مدفوعات |
| فاتورة مبدئية | PRO | قبل التنفيذ |
| أمر شراء | PRO | للموردين |
| تقرير مصروفات | PRO | تفصيلي مع مرفقات |
| قائمة مالية | ENTERPRISE | دخل ومصروفات شاملة |
| خطة ميزانية | ENTERPRISE | للمشاريع والأقسام |

### القانونية (Legal) - 7 نماذج
- عقد عمل قياسي (FREE)
- عقد مقاولة (PRO)
- عقد خدمات (PRO)
- اتفاقية سرية NDA (PRO)
- عقد إيجار (PRO)
- عقد توظيف (ENTERPRISE)
- عقد شراكة (ENTERPRISE)
- إنذار قانوني (ENTERPRISE)

### التشغيلية (Operational) - 8 نماذج
- إشعار تسليم (FREE)
- أمر عمل (FREE)
- عرض مشروع (PRO)
- تقرير معاينة (PRO)
- تقرير تقدم (PRO)
- شهادة إنجاز (PRO)
- جدول صيانة (ENTERPRISE)
- قائمة جودة (ENTERPRISE)

### التسويقية (Marketing) - 4 نماذج
- بروفايل الشركة (PRO)
- بروشور تعريفي (PRO)
- دراسة حالة (ENTERPRISE)
- عرض تقديمي (ENTERPRISE)

---

## 🔧 الأدوات / Tools

### الذكاء الاصطناعي (AI) - 6 أدوات
| الأداة | الباقة | الوصف |
|--------|--------|-------|
| وياك المحادثة | FREE | مساعد ذكي |
| البحث الذكي | FREE | بالنص أو الصورة |
| حاسبة التكاليف | PRO | مع توصيات ذكية |
| مولد التصاميم | PRO | سوشيال ميديا وعروض |
| Weyaak Video Creator | ENTERPRISE | فيديوهات تسويقية |
| مساعد الأعمال الذكي | ENTERPRISE | إدارة شاملة |

### التحليلات (Analytics) - 4 أدوات
- تحليلات أساسية (FREE)
- تحليلات متقدمة (PRO)
- التحليل المالي الشامل (ENTERPRISE)
- تقارير مخصصة (ENTERPRISE)

### الأتمتة (Automation) - 3 أدوات
- تذكيرات تلقائية (PRO)
- أتمتة سير العمل (ENTERPRISE)
- فواتير تلقائية (ENTERPRISE)

### التعاون (Collaboration) - 3 أدوات
- محادثات الفريق (FREE)
- مشاركة الملفات (PRO)
- اجتماعات مرئية (ENTERPRISE)

### الإدارة (Management) - 4 أدوات
- إدارة المشاريع (FREE)
- إدارة المخزون (PRO)
- CRM (ENTERPRISE)
- إدارة الموارد البشرية (ENTERPRISE)

---

## 💎 الباقات / Subscription Tiers

### Free Plan (مجاني)
**السعر**: 0 AED/شهر
**المميزات**:
- 5 نماذج/شهر
- 3 مشاريع نشطة
- تحليلات أساسية
- وياك المحادثة + البحث الذكي
- 1 GB تخزين
- دعم عبر البريد
- 50 AI Credits/شهر

### Pro Plan (احترافي)
**السعر**: 299 AED/شهر | 2,990 AED/سنة
**المميزات**:
- نماذج غير محدودة
- مشاريع غير محدودة
- جميع النماذج المتقدمة (Free + Pro)
- حاسبة التكاليف + مولد التصاميم
- تحليلات متقدمة + أتمتة
- إدارة المخزون
- 50 GB تخزين
- حتى 10 مستخدمين
- دعم ذو أولوية
- 500 AI Credits/شهر

### Enterprise Plan (مؤسسات)
**السعر**: 999 AED/شهر | 9,990 AED/سنة
**المميزات**:
- كل مميزات Pro +
- Weyaak Video Creator
- مساعد الأعمال الذكي
- تحليل مالي شامل + تقارير مخصصة
- أتمتة الفواتير + CRM كامل
- إدارة الموارد البشرية
- اجتماعات مرئية
- هوية تجارية مخصصة
- API للتكامل
- تخزين غير محدود
- مستخدمين غير محدودين
- دعم مخصص 24/7
- مدير حساب شخصي
- 5,000 AI Credits/شهر

---

## 🔐 دوال الصلاحيات / Permission Functions

```typescript
// التحقق من صلاحية نموذج
canAccessDocument(documentId: string, userTier: SubscriptionTier): boolean

// التحقق من صلاحية أداة
canAccessTool(toolId: string, userTier: SubscriptionTier): boolean

// الحصول على النماذج المتاحة
getAvailableDocuments(userTier: SubscriptionTier): DocumentTemplate[]

// الحصول على الأدوات المتاحة
getAvailableTools(userTier: SubscriptionTier): ToolFeature[]

// الحصول على النماذج المقفلة
getLockedDocuments(userTier: SubscriptionTier): DocumentTemplate[]

// الحصول على الأدوات المقفلة
getLockedTools(userTier: SubscriptionTier): ToolFeature[]

// تفاصيل الباقة
getTierDetails(tier: SubscriptionTier): TierFeatures | undefined
```

---

## 📱 الاستخدام / Usage

### في الداشبورد:

```typescript
import { DocumentsToolsSection } from './components/mobile/DocumentsToolsSection';
import COMPLETE_DASHBOARD_DATA from './components/mobile/dashboardData_complete';

const completeData = COMPLETE_DASHBOARD_DATA['contracting'];

<DocumentsToolsSection
  documentIds={completeData.recommendedDocuments}
  toolIds={completeData.recommendedTools}
  userTier="free"
  onUpgrade={() => navigate('/pricing')}
/>
```

### التحقق من الصلاحيات:

```typescript
import { canAccessDocument, canAccessTool } from './components/mobile/subscriptionTiers';

const userTier = 'pro';

if (canAccessDocument('invoice', userTier)) {
  // المستخدم يمكنه الوصول للفاتورة
  generateInvoice();
} else {
  // عرض شاشة ترقية
  showUpgradePrompt();
}
```

---

## 🎨 التصميم / Design

### الألوان حسب الباقة:
- **Free**: `#2AA676` (أخضر)
- **Pro**: `#3B5BFE` (أزرق)
- **Enterprise**: `#C8A86A` (ذهبي)

### الأيقونات:
- **Free**: `Sparkles`
- **Pro**: `Crown`
- **Enterprise**: `Building2` / `TrendingUp`

### مؤشرات القفل:
- أيقونة `Lock` للعناصر المقفلة
- شفافية 60% على البطاقات المقفلة
- CTA للترقية عند الضغط

---

## 🚀 ميزات إضافية / Additional Features

### 1. نافذة التفاصيل المنبثقة
- عرض كامل لوصف النموذج/الأداة
- أيقونة ملونة كبيرة
- شارة الباقة المطلوبة
- فئة النموذج (مالي، قانوني، تشغيلي، تسويقي)
- زر "استخدم النموذج"

### 2. Upgrade CTA
- يظهر تلقائياً إذا كان هناك عناصر مقفلة
- تصميم جذاب بألوان متدرجة
- دعوة واضحة للترقية

### 3. التبويبات
- تبويب النماذج (Documents)
- تبويب الأدوات (Tools)
- عداد لكل تبويب

---

## 📊 إحصائيات النظام / System Stats

- **إجمالي النماذج**: 30
  - Free: 6
  - Pro: 15
  - Enterprise: 9

- **إجمالي الأدوات**: 20
  - Free: 4
  - Pro: 9
  - Enterprise: 7

- **عدد الداشبوردات**: 11
  - كل داشبورد له 4-9 نماذج موصى بها
  - كل داشبورد له 4-6 أدوات موصى بها

---

## ✅ الخلاصة / Summary

تم تطوير نظام شامل ومتكامل يوفر:
1. ✅ **30 نموذج احترافي** موزعة على 3 باقات
2. ✅ **20 أداة ذكية** من AI والتحليلات والأتمتة
3. ✅ **11 داشبورد مخصص** بنماذج وأدوات موصى بها
4. ✅ **نظام صلاحيات متقدم** للتحقق من الوصول
5. ✅ **واجهة مستخدم احترافية** مع مؤشرات وإشعارات واضحة
6. ✅ **دعم كامل للعربية والإنجليزية**
7. ✅ **تكامل سلس مع الداشبوردات الحالية**

النظام جاهز للاستخدام الفوري ويمكن توسيعه بسهولة! 🎉
