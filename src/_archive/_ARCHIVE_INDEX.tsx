/**
 * ============================================================
 *   _archive - ملفات مؤرشفة (غير مستخدمة في المشروع الحالي)
 *   Biet Alreef - Archived / Orphaned Files Index
 *   تاريخ المراجعة: 2026-02-05
 * ============================================================
 * 
 * هذا الملف يوثق جميع الملفات المعزولة (Orphaned) التي لم تعد
 * مستخدمة في شجرة الاستيراد الحالية للمشروع (App.tsx).
 * 
 * تم نقل هذه الملفات إلى مجلد _archive لتنظيم المشروع
 * ومنع الأخطاء والتضاربات.
 * 
 * ⚠️ لا تستورد من هذا المجلد! هذه ملفات للمرجعية فقط.
 * 
 * ============================================================
 *   الملفات المؤرشفة مقسمة حسب الفئة:
 * ============================================================
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │  الفئة 1: نسخ قديمة من App (Root Entry Points)             │
 * ├─────────────────────────────────────────────────────────────┤
 * │  /NewApp.tsx              → App قديم (يستورد NewBottomNav)  │
 * │  /NavigationDemo.tsx      → ملف تجريبي للتنقل              │
 * │  /DesignSystem.tsx        → عرض نظام التصميم               │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │  الفئة 2: مكونات Login/Auth قديمة                          │
 * ├─────────────────────────────────────────────────────────────┤
 * │  /components/GlassLoginPanel.tsx    → لوحة دخول زجاجية     │
 * │  /components/EntryPathSelection.tsx → اختيار مسار الدخول   │
 * │  /components/LoginCard.tsx          → بطاقة تسجيل الدخول   │
 * │  /components/PackageSelection.tsx   → اختيار الباقات       │
 * │  /components/UserTypeSelection.tsx  → اختيار نوع المستخدم  │
 * │  /components/VerificationPanel.tsx  → لوحة التحقق          │
 * │  /components/VerificationPromptChat.tsx → محادثة التحقق    │
 * │  /components/WelcomeChat.tsx        → محادثة الترحيب       │
 * │  /components/pages/LoginPage.tsx    → صفحة تسجيل دخول     │
 * │  /components/pages/UserTypePage.tsx → صفحة نوع المستخدم    │
 * │  /components/pages/VerificationPage.tsx → صفحة التوثيق     │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │  الفئة 3: مكونات تصميم/خلفيات قديمة                       │
 * ├─────────────────────────────────────────────────────────────┤
 * │  /components/ArchitecturalBackground.tsx → خلفية معمارية   │
 * │  /components/BackgroundCardsGrid.tsx     → شبكة بطاقات    │
 * │  /components/FloatingCards.tsx           → بطاقات عائمة   │
 * │  /components/VoiceRoomsPanel.tsx         → غرف صوتية      │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │  الفئة 4: شاشات Mobile بديلة/قديمة                        │
 * ├─────────────────────────────────────────────────────────────┤
 * │  /components/mobile/HomeScreen.tsx        → استُبدل بـ NewHomeContent   │
 * │  /components/mobile/NewHomeScreen.tsx      → نسخة وسطى (مهجورة)       │
 * │  /components/mobile/NewTopHeader.tsx       → استُبدل بـ TopNav         │
 * │  /components/mobile/NotificationsScreen.tsx → استُبدل بـ NotificationsCenter │
 * │  /components/mobile/SearchScreen.tsx       → استُبدل بـ FullSearchScreen    │
 * │  /components/mobile/ShopScreenNew.tsx      → نسخة بديلة (مهجورة)     │
 * │  /components/mobile/ShopScreenTranslated.tsx → نسخة مترجمة (مهجورة)  │
 * │  /components/mobile/StyleGuide.tsx         → دليل أنماط مستقل        │
 * │  /components/mobile/ProfileSection.tsx     → استُبدل بـ ProfileScreen │
 * │  /components/mobile/UserCardFull.tsx       → غير مستخدم              │
 * │  /components/mobile/UserCardMini.tsx       → غير مستخدم              │
 * │  /components/mobile/YAKAssistant.tsx       → غير مستخدم              │
 * │  /components/mobile/ProviderMapCard.tsx    → غير مستخدم              │
 * │  /components/mobile/ProviderMapPage.tsx    → غير مستخدم              │
 * │  /components/mobile/ServiceDetailTemplate.tsx → قالب خدمات غير مستخدم│
 * │  /components/mobile/ServiceDetailGuest.tsx   → شاشة ضيف غير مستخدم  │
 * │  /components/mobile/NotificationListItem.tsx → مكون فرعي مهجور      │
 * │  /components/mobile/SubscriptionPlansScreen.tsx → استُبدل بـ SubscriptionsScreen │
 * │  /components/mobile/SubscriptionPlanCard.tsx → مكون فرعي مهجور      │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │  الفئة 5: مكونات Marketplace فرعية (من ShopScreenNew)      │
 * ├─────────────────────────────────────────────────────────────┤
 * │  /components/mobile/MarketplaceFilters.tsx   → فلاتر سوق   │
 * │  /components/mobile/MarketplaceGrid.tsx      → شبكة سوق    │
 * │  /components/mobile/MarketplaceList.tsx      → قائمة سوق   │
 * │  /components/mobile/MarketplaceItemCard.tsx  → بطاقة منتج  │
 * │  /components/mobile/MarketplaceItemDetail.tsx → تفاصيل منتج│
 * │  ** ملاحظة: هذه تُستخدم فقط في ShopScreenNew المهجور **   │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │  الفئة 6: ملفات أنواع ومساعدة غير مستخدمة                 │
 * ├─────────────────────────────────────────────────────────────┤
 * │  /types/new-file.tsx       → ملف فارغ                      │
 * │  /update_colors_script.txt → سكريبت تحديث ألوان            │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │  الفئة 7: ملفات توثيق/تقارير (.md) في الجذر               │
 * ├─────────────────────────────────────────────────────────────┤
 * │  /AI-LOG-SERVICE-SECTION.md                                │
 * │  /Attributions.md                                          │
 * │  /BACKEND_INTEGRATION_PLAN.md                              │
 * │  /BATCH_UPDATE_SERVICES.md                                 │
 * │  /CHANGELOG_SEARCH.md                                      │
 * │  /COLOR_UPDATE_GUIDE.md                                    │
 * │  /COMPLETED_WORK_REPORT.md                                 │
 * │  /COMPLETE_STATUS.md                                       │
 * │  /DESIGN_SYSTEM.md                                         │
 * │  /DEVELOPER_CHECKLIST.md                                   │
 * │  /ERRORS_FIXED_REPORT.md                                   │
 * │  /EXECUTION_STATUS.md                                      │
 * │  /EXECUTIVE_PROJECT_REPORT_AR.md                           │
 * │  /FINAL_IMPLEMENTATION_REPORT.md                           │
 * │  /FINAL_STATUS_AR.md                                       │
 * │  /FIXES_COMPLETED.md                                       │
 * │  /IMPLEMENTATION_SUMMARY.md                                │
 * │  /MARKETING_AUTOMATION_REPORT.md                           │
 * │  /MULTILANGUAGE_IMPLEMENTATION.md                          │
 * │  /PROJECT_STATISTICS_DETAILED.md                           │
 * │  /QUICK_START.md                                           │
 * │  /SEARCH_DOCUMENTATION.md                                  │
 * │  /SEARCH_README.md                                         │
 * │  /SERVICE_PAGE_TRANSLATION_TEMPLATE.md                     │
 * │  /STRATEGIC_RECOMMENDATIONS.md                             │
 * │  /TRANSLATION_IMPLEMENTATION_REPORT.md                     │
 * │  /TRANSLATION_IMPLEMENTATION_STATUS.md                     │
 * │  /TRANSLATION_QUICK_START.md                               │
 * │  /TRANSLATION_STATUS.md                                    │
 * │  /TRANSLATION_STATUS_UPDATED.md                            │
 * │  /UPDATE_SUMMARY.md                                        │
 * │  /tests/README.md                                          │
 * │  /guidelines/Guidelines.md                                 │
 * │  ** ملاحظة: README.md يُحتفظ به كملف رئيسي **            │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │  الفئة 8: ملفات اختبار                                     │
 * ├─────────────────────────────────────────────────────────────┤
 * │  /tests/searchTests.ts → اختبارات البحث                    │
 * │  /tests/README.md      → توثيق الاختبارات                  │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * ============================================================
 *   الملفات النشطة (Active Import Tree من App.tsx):
 * ============================================================
 * 
 * App.tsx
 *  ├── LoginApp.tsx → AuthScreen.tsx → FooterDirectory.tsx
 *  ├── BrowserLayout.tsx
 *  │    ├── TopNav.tsx → LanguageSwitcher.tsx
 *  │    ├── SideDrawer.tsx → UserContext, sectionsTree
 *  │    ├── WeyaakBubble.tsx
 *  │    ├── FullSearchScreen.tsx → searchData
 *  │    └── NotificationsCenter.tsx → GlassCard.tsx
 *  ├── NewHomeContent.tsx → PackagesSection, CommunityFeed
 *  ├── ServicesContent.tsx
 *  ├── ServiceRouteHandler.tsx
 *  │    ├── ServiceDetailPlumbing.tsx → BietAlreefLogo, SEOHead, AccessModal, usePermissionGuard
 *  │    ├── ServiceDetailElectricity.tsx → BietAlreefLogo, SEOHead
 *  │    ├── ServiceDetailAC.tsx → BietAlreefLogo, SEOHead
 *  │    ├── ServiceDetailPainting.tsx → BietAlreefLogo, SEOHead
 *  │    ├── ServiceDetailCleaning.tsx → SEOHead, GlassCard
 *  │    ├── ServiceDetailCarpentry.tsx → BietAlreefLogo, SEOHead
 *  │    ├── ServiceDetailInterior.tsx → BietAlreefLogo, SEOHead
 *  │    ├── ServiceDetailExterior.tsx → BietAlreefLogo, SEOHead
 *  │    ├── ServiceDetailConstruction.tsx → BietAlreefLogo, SEOHead
 *  │    ├── ServiceDetailConsultation.tsx → BietAlreefLogo, SEOHead
 *  │    ├── ServiceDetailConstructionContracting.tsx → SEOHead, GlassCard
 *  │    ├── ServiceDetailEngineeringConsultation.tsx → SEOHead, GlassCard
 *  │    ├── ServiceDetailMaintenance.tsx → SEOHead, GlassCard
 *  │    ├── ServiceDetailCraftsmen.tsx → SEOHead, GlassCard
 *  │    ├── ServiceDetailWorkshops.tsx → SEOHead, GlassCard
 *  │    ├── ServiceDetailEquipmentRental.tsx → SEOHead, GlassCard
 *  │    ├── ServiceDetailBuildingMaterials.tsx → SEOHead, GlassCard
 *  │    └── ServiceDetailFurnitureDecor.tsx → SEOHead, GlassCard
 *  ├── ShopScreen.tsx → shop/*
 *  ├── ToolsScreen.tsx → tools/*
 *  ├── WayakScreen.tsx
 *  ├── ProjectsScreen.tsx
 *  ├── ProfileScreen.tsx → SubscriptionsScreen, AIToolsDashboard, ProfileLocationSetup
 *  ├── MapsScreen.tsx → MapSearch, BottomNav⚠️(قد يسبب خطأ إذا محذوف)
 *  ├── RecommendationsScreen.tsx
 *  ├── OffersScreen.tsx
 *  ├── MarketplaceScreen.tsx → ServiceIcons
 *  ├── RFQScreen.tsx
 *  ├── ProjectDetail.tsx
 *  └── SystemTest.tsx
 * 
 * ============================================================
 *   ⚠️ تنبيهات مهمة:
 * ============================================================
 * 
 * 1. MapsScreen.tsx يستورد BottomNav الذي قد يكون محذوفاً → قد يسبب خطأ
 * 2. الترجمات realEstate (عربي/إنجليزي) لا تزال مسجلة في LanguageContext
 *    رغم إلغاء قسم العقارات → يمكن إزالتها لاحقاً
 * 3. GoogleIcon يُستخدم فقط من الملفات المؤرشفة (LoginCard, GlassLoginPanel, LoginPage)
 *    لكنه مكون صغير يمكن الاحتفاظ به احتياطياً
 * 
 * ============================================================
 */

export {};
