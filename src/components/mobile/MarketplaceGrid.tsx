// ====================================
// 📱 Marketplace Grid View Component
// بيت الريف - عرض Grid للمتجر
// ====================================

import { MarketplaceItem } from '../../data/marketplace';
import { MarketplaceItemCard } from './MarketplaceItemCard';
import { useTranslation } from '../../contexts/LanguageContext';

interface MarketplaceGridProps {
  items: MarketplaceItem[];
  onItemClick: (item: MarketplaceItem) => void;
}

export function MarketplaceGrid({ items, onItemClick }: MarketplaceGridProps) {
  const { language, textAlign } = useTranslation('store');
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, Segoe UI, sans-serif' : 'Cairo, sans-serif';

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6" dir="rtl">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg text-[#1F3D2B] mb-2" style={{ fontFamily, fontWeight: 700 }}>
          {isEn ? 'No products found' : 'لم نجد منتجات'}
        </h3>
        <p className="text-sm text-[#1F3D2B]/60 text-center" style={{ fontFamily, fontWeight: 600 }}>
          {isEn ? 'Try changing filters or search for something else' : 'جرب تغيير الفلاتر أو البحث عن شيء آخر'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4" dir="rtl">
      {items.map((item) => (
        <MarketplaceItemCard
          key={item.id}
          item={item}
          viewMode="grid"
          onClick={() => onItemClick(item)}
        />
      ))}
    </div>
  );
}