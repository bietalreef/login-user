// ====================================
// 🛍️ Marketplace Item Card Component
// بيت الريف - بطاقة منتج المتجر (Bilingual)
// ====================================

import { Star, MapPin, ShoppingCart, Heart } from 'lucide-react';
import { MarketplaceItem } from '../../data/marketplace';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useTranslation } from '../../contexts/LanguageContext';

interface MarketplaceItemCardProps {
  item: MarketplaceItem;
  viewMode?: 'grid' | 'list';
  onClick?: () => void;
}

export function MarketplaceItemCard({ item, viewMode = 'grid', onClick }: MarketplaceItemCardProps) {
  const { language, textAlign } = useTranslation('store');
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, Segoe UI, sans-serif' : 'Cairo, sans-serif';
  const currency = isEn ? 'AED' : 'درهم';

  const title = isEn ? item.titleEn : item.title;
  const unit = isEn ? item.unitEn : item.unit;
  const cityName = isEn ? item.location?.cityEn : item.location?.city;
  const unavailableText = isEn ? 'Unavailable' : 'غير متاح';
  const featuredText = isEn ? 'Featured' : 'مميز';

  const discount = item.oldPrice 
    ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <motion.div
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-[20px] shadow-md overflow-hidden flex gap-3 p-3 cursor-pointer hover:shadow-lg transition-all border border-[#F5EEE1]"
        dir="rtl"
      >
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-[12px] overflow-hidden bg-[#F5EEE1]">
          <ImageWithFallback
            src={item.images[0]}
            alt={title}
            className="w-full h-full object-cover"
          />
          
          {item.hasOffer && (
            <div className="absolute top-1 left-1 bg-[#F2994A] text-white text-xs px-2 py-0.5 rounded-full" style={{ fontFamily, fontWeight: 700 }}>
              -{discount}%
            </div>
          )}

          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{unavailableText}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm text-[#1F3D2B] mb-1 truncate" style={{ fontFamily, fontWeight: 700, textAlign }}>
            {title}
          </h3>
          
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 text-[#F2C94C] fill-[#F2C94C]" />
            <span className="text-xs text-[#1F3D2B]" style={{ fontFamily, fontWeight: 600 }}>
              {item.rating}
            </span>
            <span className="text-xs text-[#1F3D2B]/50" style={{ fontFamily, fontWeight: 600 }}>
              ({item.reviewsCount})
            </span>
          </div>

          {item.location && (
            <div className="flex items-center gap-1 mb-2">
              <MapPin className="w-3 h-3 text-[#4A90E2]" />
              <span className="text-xs text-[#1F3D2B]/70" style={{ fontFamily, fontWeight: 600 }}>
                {cityName}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-base text-[#2AA676]" style={{ fontFamily, fontWeight: 800 }}>
                {item.price}
              </span>
              <span className="text-xs text-[#2AA676]/70" style={{ fontFamily, fontWeight: 600 }}>
                {currency}
              </span>
            </div>
            {item.oldPrice && (
              <span className="text-xs text-[#1F3D2B]/40 line-through" style={{ fontFamily, fontWeight: 600 }}>
                {item.oldPrice}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button className="p-2 rounded-full bg-[#F5EEE1] hover:bg-[#4A90E2]/10 transition-colors">
            <Heart className="w-4 h-4 text-[#4A90E2]" />
          </button>
          <button className="p-2 rounded-full bg-[#4A90E2] hover:bg-[#56CCF2] transition-colors">
            <ShoppingCart className="w-4 h-4 text-white" />
          </button>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="bg-white rounded-[20px] shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all border border-[#F5EEE1]"
      dir="rtl"
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-[#F5EEE1]">
        <ImageWithFallback
          src={item.images[0]}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {item.isFeatured && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-[#C8A86A] to-[#D4AF37] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1" style={{ fontFamily, fontWeight: 700 }}>
            <span>⭐</span>
            {featuredText}
          </div>
        )}

        {item.hasOffer && (
          <div className="absolute top-2 left-2 bg-[#F2994A] text-white text-xs px-2 py-1 rounded-full" style={{ fontFamily, fontWeight: 700 }}>
            -{discount}%
          </div>
        )}

        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold">{unavailableText}</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-2 right-2 flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); }}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-md"
          >
            <Heart className="w-4 h-4 text-[#F2994A]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm text-[#1F3D2B] mb-1.5 line-clamp-2" style={{ fontFamily, fontWeight: 700, textAlign }}>
          {title}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 text-[#F2C94C] fill-[#F2C94C]" />
          <span className="text-xs text-[#1F3D2B]" style={{ fontFamily, fontWeight: 600 }}>
            {item.rating}
          </span>
          <span className="text-xs text-[#1F3D2B]/50" style={{ fontFamily, fontWeight: 600 }}>
            ({item.reviewsCount})
          </span>
        </div>

        {item.location && (
          <div className="flex items-center gap-1 mb-3">
            <MapPin className="w-3 h-3 text-[#4A90E2]" />
            <span className="text-xs text-[#1F3D2B]/70 truncate" style={{ fontFamily, fontWeight: 600 }}>
              {cityName}
            </span>
          </div>
        )}

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-base text-[#D4AF37]" style={{ fontFamily, fontWeight: 800 }}>
                {item.price}
              </span>
              <span className="text-xs text-[#D4AF37]/70" style={{ fontFamily, fontWeight: 600 }}>
                {currency}
              </span>
            </div>
            {item.oldPrice && (
              <span className="text-xs text-[#1F3D2B]/40 line-through" style={{ fontFamily, fontWeight: 600 }}>
                {item.oldPrice} {currency}
              </span>
            )}
            <p className="text-xs text-[#1F3D2B]/50 mt-0.5" style={{ fontFamily, fontWeight: 600, textAlign }}>
              {unit}
            </p>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); }}
            className="p-2.5 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] hover:shadow-md transition-all"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}