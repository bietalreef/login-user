// ====================================
// 📋 Marketplace List View Component
// بيت الريف - عرض List للمتجر
// ====================================

import { MarketplaceItem } from '../../data/marketplace';
import { MarketplaceItemCard } from './MarketplaceItemCard';
import { useTranslation } from '../../contexts/LanguageContext';

interface MarketplaceListProps {
  items: MarketplaceItem[];
  onItemClick: (item: MarketplaceItem) => void;
}

export function MarketplaceList({ items, onItemClick }: MarketplaceListProps) {
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
    <div className="flex flex-col gap-3 p-4" dir="rtl">
      {items.map((item) => (
        <MarketplaceItemCard
          key={item.id}
          item={item}
          viewMode="list"
          onClick={() => onItemClick(item)}
        />
      ))}
    </div>
  );
}