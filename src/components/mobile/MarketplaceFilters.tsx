// ====================================
// 🎛️ Marketplace Filters Component
// بيت الريف - فلاتر المتجر (Bilingual)
// ====================================

import { useState } from 'react';
import { SlidersHorizontal, X, Flame, CheckCircle, Star, Store as StoreIcon } from 'lucide-react';
import { MarketplaceCategory, MarketplaceFilterState, CATEGORY_LABELS, CATEGORY_LABELS_EN, CATEGORY_ICONS, CATEGORY_ICON_COLORS } from '../../data/marketplace';
import { useTranslation } from '../../contexts/LanguageContext';

interface MarketplaceFiltersProps {
  filterState: MarketplaceFilterState;
  onFilterChange: (newFilter: MarketplaceFilterState) => void;
  itemsCount: number;
}

export function MarketplaceFilters({ filterState, onFilterChange, itemsCount }: MarketplaceFiltersProps) {
  const { t, language, textAlign } = useTranslation('store');
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, Segoe UI, sans-serif' : 'Cairo, sans-serif';
  const catLabels = isEn ? CATEGORY_LABELS_EN : CATEGORY_LABELS;

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const categories: (MarketplaceCategory | 'all')[] = [
    'all', 'materials', 'furniture', 'tools', 'equipment', 'decor', 'services'
  ];

  const sortOptions = [
    { value: 'popular', label: isEn ? 'Most Popular' : 'الأكثر طلباً' },
    { value: 'price_low', label: isEn ? 'Price: Low to High' : 'السعر: من الأقل' },
    { value: 'price_high', label: isEn ? 'Price: High to Low' : 'السعر: من الأعلى' },
    { value: 'rating', label: isEn ? 'Highest Rated' : 'الأعلى تقييماً' },
    { value: 'near_me', label: isEn ? 'Near Me' : 'الأقرب لي' }
  ] as const;

  return (
    <div className="bg-white border-b border-[#F5EEE1]" dir="rtl">
      {/* Categories Chips */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {categories.map((category) => {
            const isActive = filterState.category === category;
            const IconComp = category === 'all' ? StoreIcon : CATEGORY_ICONS[category];
            const iconColor = CATEGORY_ICON_COLORS[category];
            
            return (
              <button
                key={category}
                onClick={() => onFilterChange({ ...filterState, category })}
                className={`
                  px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-1.5
                  ${isActive
                    ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white shadow-md'
                    : 'bg-[#F5EEE1] text-[#1F3D2B] hover:bg-[#E5DED1]'
                  }
                `}
                style={{ fontFamily, fontWeight: 700 }}
              >
                <IconComp className="w-3.5 h-3.5" style={{ color: isActive ? 'white' : iconColor }} />
                {catLabels[category]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Filters & Sort */}
      <div className="px-4 py-2 flex items-center gap-2 border-t border-[#F5EEE1]/50">
        {/* Offers Filter */}
        <button
          onClick={() => onFilterChange({ ...filterState, hasOffer: !filterState.hasOffer })}
          className={`
            px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1
            ${filterState.hasOffer
              ? 'bg-[#F2994A] text-white'
              : 'bg-white border border-[#F2994A] text-[#F2994A]'
            }
          `}
          style={{ fontFamily, fontWeight: 700 }}
        >
          <Flame className="w-3 h-3" />
          {isEn ? 'Offers' : 'عروض'}
        </button>

        {/* In Stock Filter */}
        <button
          onClick={() => onFilterChange({ ...filterState, inStockOnly: !filterState.inStockOnly })}
          className={`
            px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1
            ${filterState.inStockOnly
              ? 'bg-[#D4AF37] text-white'
              : 'bg-white border border-[#D4AF37] text-[#D4AF37]'
            }
          `}
          style={{ fontFamily, fontWeight: 700 }}
        >
          <CheckCircle className="w-3 h-3" />
          {isEn ? 'Available' : 'متاح'}
        </button>

        {/* Sort Dropdown */}
        <div className="flex-1" />
        <select
          value={filterState.sortBy}
          onChange={(e) => onFilterChange({ 
            ...filterState, 
            sortBy: e.target.value as MarketplaceFilterState['sortBy']
          })}
          className="px-3 py-1.5 rounded-full text-xs bg-white border border-[#4A90E2] text-[#4A90E2] outline-none"
          style={{ fontFamily, fontWeight: 700 }}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="p-2 rounded-full bg-[#4A90E2]/10 text-[#4A90E2] hover:bg-[#4A90E2]/20 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="px-4 py-4 bg-[#F5EEE1]/30 border-t border-[#F5EEE1]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-[#1F3D2B]" style={{ fontFamily, textAlign }}>
              {isEn ? 'Advanced Filters' : 'فلاتر متقدمة'}
            </h3>
            <button
              onClick={() => setShowAdvancedFilters(false)}
              className="text-[#1F3D2B]/60 hover:text-[#1F3D2B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-4">
            <label className="block text-xs text-[#1F3D2B]/80 mb-2" style={{ fontFamily, fontWeight: 600, textAlign }}>
              {isEn ? 'Price Range (AED)' : 'نطاق السعر (درهم)'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder={isEn ? 'From' : 'من'}
                value={filterState.minPrice || ''}
                onChange={(e) => onFilterChange({ 
                  ...filterState, 
                  minPrice: e.target.value ? Number(e.target.value) : undefined 
                })}
                className="flex-1 px-3 py-2 rounded-lg border border-[#E5DED1] outline-none text-sm"
                style={{ fontFamily }}
              />
              <span className="text-[#1F3D2B]/60">-</span>
              <input
                type="number"
                placeholder={isEn ? 'To' : 'إلى'}
                value={filterState.maxPrice || ''}
                onChange={(e) => onFilterChange({ 
                  ...filterState, 
                  maxPrice: e.target.value ? Number(e.target.value) : undefined 
                })}
                className="flex-1 px-3 py-2 rounded-lg border border-[#E5DED1] outline-none text-sm"
                style={{ fontFamily }}
              />
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => onFilterChange({
              category: 'all',
              sortBy: 'popular',
              hasOffer: false,
              inStockOnly: false
            })}
            className="w-full px-4 py-2 rounded-lg bg-white border border-[#4A90E2] text-[#4A90E2] text-sm hover:bg-[#4A90E2]/10 transition-colors"
            style={{ fontFamily, fontWeight: 700 }}
          >
            {isEn ? 'Reset Filters' : 'إعادة تعيين الفلاتر'}
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="px-4 py-2 bg-[#F5EEE1]/50 text-center">
        <p className="text-xs text-[#1F3D2B]/70" style={{ fontFamily, fontWeight: 600 }}>
          {itemsCount} {isEn ? 'products available' : 'منتج متاح'}
        </p>
      </div>
    </div>
  );
}