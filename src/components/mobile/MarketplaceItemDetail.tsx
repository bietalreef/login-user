// ====================================
// 📦 Marketplace Item Detail Component
// بيت الريف - صفحة تفاصيل المنتج (Bilingual)
// ====================================

import { useState } from 'react';
import { ChevronLeft, Star, MapPin, Share2, Heart, ShoppingCart, Store, Phone, MessageCircle } from 'lucide-react';
import { MarketplaceItem, MOCK_MARKETPLACE_ITEMS } from '../../data/marketplace';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { RatingSummary } from './reviews/RatingSummary';
import { ReviewList } from './reviews/ReviewList';
import { ReviewForm } from './reviews/ReviewForm';
import { useTranslation } from '../../contexts/LanguageContext';

interface MarketplaceItemDetailProps {
  item: MarketplaceItem;
  onBack: () => void;
  onProviderClick?: (providerId: string) => void;
}

export function MarketplaceItemDetail({ item, onBack, onProviderClick }: MarketplaceItemDetailProps) {
  const { language, textAlign } = useTranslation('store');
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, Segoe UI, sans-serif' : 'Cairo, sans-serif';
  const currency = isEn ? 'AED' : 'درهم';

  const title = isEn ? item.titleEn : item.title;
  const description = isEn ? item.descriptionEn : item.description;
  const unit = isEn ? item.unitEn : item.unit;
  const providerName = isEn ? item.providerNameEn : item.providerName;
  const cityName = isEn ? item.location?.cityEn : item.location?.city;

  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'similar'>('details');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const discount = item.oldPrice 
    ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
    : 0;

  // Get similar items
  const similarItems = MOCK_MARKETPLACE_ITEMS.filter(
    i => i.category === item.category && i.id !== item.id
  ).slice(0, 4);

  const tabs = [
    { id: 'details' as const, label: isEn ? 'Details' : 'التفاصيل' },
    { id: 'reviews' as const, label: isEn ? 'Reviews' : 'التقييمات' },
    { id: 'similar' as const, label: isEn ? 'Similar' : 'منتجات مشابهة' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F5EEE1] overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#F5EEE1] px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
        <button
          onClick={onBack}
          className="text-[#1F3D2B] hover:text-[#4A90E2] transition-colors"
        >
          <ChevronLeft className="w-6 h-6 transform rotate-180" />
        </button>
        <h2 className="flex-1 text-base text-[#1F3D2B] truncate" style={{ fontFamily, fontWeight: 700, textAlign }}>
          {title}
        </h2>
        <button className="p-2 rounded-full hover:bg-[#F5EEE1] transition-colors">
          <Share2 className="w-5 h-5 text-[#1F3D2B]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Image Gallery */}
        <div className="bg-white">
          <div className="relative w-full aspect-square bg-[#F5EEE1]">
            <ImageWithFallback
              src={item.images[selectedImageIndex]}
              alt={title}
              className="w-full h-full object-cover"
            />
            
            {item.hasOffer && (
              <div className="absolute top-4 left-4 bg-[#F2994A] text-white px-3 py-1.5 rounded-full" style={{ fontFamily, fontWeight: 700 }}>
                {isEn ? `${discount}% OFF` : `خصم ${discount}%`}
              </div>
            )}

            {item.isFeatured && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-[#C8A86A] to-[#D4AF37] text-white px-3 py-1.5 rounded-full flex items-center gap-1" style={{ fontFamily, fontWeight: 700 }}>
                <span>⭐</span>
                {isEn ? 'Featured' : 'مميز'}
              </div>
            )}

            {!item.isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-xl font-bold">{isEn ? 'Currently Unavailable' : 'غير متاح حالياً'}</span>
              </div>
            )}
          </div>

          {/* Image Thumbnails */}
          {item.images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex ? 'border-[#4A90E2]' : 'border-transparent'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="bg-white mt-2 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-xl text-[#1F3D2B] mb-2" style={{ fontFamily, fontWeight: 800, textAlign }}>
                {title}
              </h1>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#F2C94C] fill-[#F2C94C]" />
                  <span className="text-sm text-[#1F3D2B]" style={{ fontFamily, fontWeight: 700 }}>
                    {item.rating}
                  </span>
                </div>
                <span className="text-sm text-[#1F3D2B]/50" style={{ fontFamily, fontWeight: 600 }}>
                  ({item.reviewsCount} {isEn ? 'reviews' : 'تقييم'})
                </span>
              </div>

              {item.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#4A90E2]" />
                  <span className="text-sm text-[#1F3D2B]/70" style={{ fontFamily, fontWeight: 600 }}>
                    {cityName}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-3 rounded-full bg-[#F5EEE1] hover:bg-[#E5DED1] transition-colors"
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'text-[#F2994A] fill-[#F2994A]' : 'text-[#1F3D2B]'}`} />
            </button>
          </div>

          {/* Price */}
          <div className="bg-gradient-to-br from-[#F5EEE1] to-[#E5DED1] rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl text-[#D4AF37]" style={{ fontFamily, fontWeight: 800 }}>
                    {item.price}
                  </span>
                  <span className="text-lg text-[#D4AF37]" style={{ fontFamily, fontWeight: 700 }}>
                    {currency}
                  </span>
                  {item.oldPrice && (
                    <span className="text-base text-[#1F3D2B]/40 line-through" style={{ fontFamily, fontWeight: 600 }}>
                      {item.oldPrice}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#1F3D2B]/70" style={{ fontFamily, fontWeight: 600, textAlign }}>
                  {isEn ? `Price per ${unit}` : `السعر لكل ${unit}`}
                </p>
              </div>
              {item.hasOffer && (
                <div className="bg-[#F2994A] text-white px-4 py-2 rounded-xl" style={{ fontFamily, fontWeight: 800 }}>
                  {isEn ? `Save ${discount}%` : `وفّر ${discount}%`}
                </div>
              )}
            </div>
          </div>

          {/* Provider Info */}
          <div className="bg-[#F5EEE1] rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <Store className="w-6 h-6 text-[#4A90E2]" />
                </div>
                <div>
                  <p className="text-xs text-[#1F3D2B]/60 mb-0.5" style={{ fontFamily, fontWeight: 600 }}>
                    {isEn ? 'Provider' : 'المزود'}
                  </p>
                  <p className="text-sm text-[#1F3D2B]" style={{ fontFamily, fontWeight: 700, textAlign }}>
                    {providerName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onProviderClick?.(item.providerId)}
                className="px-4 py-2 rounded-xl bg-white text-[#4A90E2] text-sm hover:bg-[#4A90E2] hover:text-white transition-all"
                style={{ fontFamily, fontWeight: 700 }}
              >
                {isEn ? 'Visit Store' : 'زيارة المحل'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white mt-2">
          <div className="flex border-b border-[#F5EEE1]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm transition-all ${
                  activeTab === tab.id
                    ? 'text-[#4A90E2] border-b-2 border-[#4A90E2]'
                    : 'text-[#1F3D2B]/60'
                }`}
                style={{ fontFamily, fontWeight: 700 }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div>
                <h3 className="text-base text-[#1F3D2B] mb-3" style={{ fontFamily, fontWeight: 800, textAlign }}>
                  {isEn ? 'Product Description' : 'وصف المنتج'}
                </h3>
                <p className="text-sm text-[#1F3D2B]/80 leading-relaxed" style={{ fontFamily, fontWeight: 600, textAlign }}>
                  {description}
                </p>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <RatingSummary targetType="product" targetId={item.id} />
                <ReviewList targetType="product" targetId={item.id} />
                <ReviewForm targetType="product" targetId={item.id} />
              </div>
            )}

            {/* Similar Items Tab */}
            {activeTab === 'similar' && (
              <div>
                <h3 className="text-base text-[#1F3D2B] mb-4" style={{ fontFamily, fontWeight: 800, textAlign }}>
                  {isEn ? 'Similar Products' : 'منتجات مشابهة'}
                </h3>
                {similarItems.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {similarItems.map((similarItem) => (
                      <div
                        key={similarItem.id}
                        onClick={() => console.log('Navigate to:', similarItem.id)}
                        className="bg-[#F5EEE1] rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-square bg-white">
                          <ImageWithFallback
                            src={similarItem.images[0]}
                            alt={isEn ? similarItem.titleEn : similarItem.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-xs text-[#1F3D2B] truncate mb-1" style={{ fontFamily, fontWeight: 700, textAlign }}>
                            {isEn ? similarItem.titleEn : similarItem.title}
                          </p>
                          <p className="text-sm text-[#D4AF37]" style={{ fontFamily, fontWeight: 800 }}>
                            {similarItem.price} {currency}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#1F3D2B]/60 text-center py-8" style={{ fontFamily, fontWeight: 600 }}>
                    {isEn ? 'No similar products available' : 'لا توجد منتجات مشابهة حالياً'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="h-32" />
      </div>

      {/* Bottom Actions */}
      <div className="bg-white border-t border-[#F5EEE1] p-4 flex gap-3">
        <button className="flex-1 bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!item.isAvailable}
          style={{ fontFamily, fontWeight: 800 }}
        >
          <ShoppingCart className="w-5 h-5" />
          {item.isAvailable 
            ? (isEn ? 'Request Quote' : 'طلب عرض سعر') 
            : (isEn ? 'Unavailable' : 'غير متاح')
          }
        </button>
        <button className="p-3.5 rounded-2xl bg-[#D4AF37] text-white hover:bg-[#B8940E] transition-colors">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-3.5 rounded-2xl bg-[#25D366] text-white hover:bg-[#1faa52] transition-colors">
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}