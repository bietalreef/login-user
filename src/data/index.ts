// ====================================
// 📦 Data Exports - بيت الريف
// تصدير جميع البيانات من مكان واحد
// ====================================

// البحث الذكي
export * from './searchData';

// السوق والمتجر
export * from './marketplace';

// شجرة الأقسام
export * from './sectionsTree';

// التقييمات
export * from './reviews';

// الإشعارات
export * from './notifications';

// باقات الاشتراك
export * from './subscriptionPlans';

// ====================================
// 🎯 Quick Access Exports
// ====================================

import { searchAll, SearchResult, SearchFilters } from './searchData';
import { MOCK_MARKETPLACE_ITEMS, MarketplaceItem } from './marketplace';
import { sectionsTree, MainSection } from './sectionsTree';

export const quickSearch = {
  searchAll,
  SearchResult,
  SearchFilters
};

export const quickMarketplace = {
  items: MOCK_MARKETPLACE_ITEMS,
  MarketplaceItem
};

export const quickSections = {
  tree: sectionsTree,
  MainSection
};
