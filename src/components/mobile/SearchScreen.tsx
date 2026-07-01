import { useState } from 'react';
import { Search, ArrowRight, X, SlidersHorizontal, Star, MapPin, Tag } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTranslation } from '../../contexts/LanguageContext';

interface SearchScreenProps {
  onBack: () => void;
  onNavigate?: (tab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers') => void;
}

export function SearchScreen({ onBack, onNavigate }: SearchScreenProps) {
  const { t, dir, language } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const results = [
    {
      id: 1,
      type: 'service',
      title: t('generalContracting'),
      provider: language === 'ar' ? 'شركة البناء الحديث' : 'Modern Construction Company',
      rating: 4.9,
      reviews: 234,
      location: t('dubai'),
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300',
      badge: t('verified'),
      price: t('perProject'),
    },
    {
      id: 2,
      type: 'offer',
      title: language === 'ar' ? 'عرض دهانات شامل' : 'Complete Painting Offer',
      provider: language === 'ar' ? 'ألوان الإمارات' : 'Emirates Colors',
      rating: 4.7,
      location: t('abudhabi'),
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300',
      tag: t('limitedOffer'),
      price: `3500 ${t('dhs')}`,
      discount: '20%',
    },
    {
      id: 3,
      type: 'material',
      title: language === 'ar' ? 'أسمنت بورتلاند' : 'Portland Cement',
      supplier: language === 'ar' ? 'مواد البناء المتحدة' : 'United Building Materials',
      rating: 4.5,
      reviews: 89,
      location: t('sharjah'),
      image: 'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?w=300',
      price: `25 ${t('dhs')}/${t('perBag')}`,
    },
    {
      id: 4,
      type: 'worker',
      title: language === 'ar' ? 'كهربائي محترف' : 'Professional Electrician',
      provider: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed',
      rating: 5.0,
      reviews: 156,
      location: t('dubai'),
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300',
      badge: t('expert'),
      price: `150 ${t('dhs')}/${t('perDay')}`,
    },
  ];

  const categories = [
    { id: 'all', label: t('all') },
    { id: 'services', label: t('services') },
    { id: 'offers', label: t('offer') },
    { id: 'materials', label: t('materials') },
    { id: 'workers', label: language === 'ar' ? 'عمال' : 'Workers' },
    { id: 'realestate', label: t('realEstate') },
    { id: 'projects', label: language === 'ar' ? 'مشاريع' : 'Projects' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#F5EEE1] to-white" dir={dir}>
      {/* Header */}
      <div className="bg-white shadow-sm p-5">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-[#F5EEE1] rounded-full transition-colors">
            <ArrowRight className="w-5 h-5 text-[#1A1A1A]" />
          </button>
          <h1 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
            {t('search')}
          </h1>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchForAnything')}
            className="w-full bg-[#F5EEE1] rounded-[24px] pr-12 pl-12 py-3 text-[#1A1A1A] placeholder:text-[#6B7280] outline-none"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 py-3 bg-white border-b border-[#F5EEE1]">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                (category.id === 'all' && !selectedCategory) || selectedCategory === category.id
                  ? 'bg-gradient-to-r from-[#5B7FE8] to-[#7B5FE8] text-white'
                  : 'bg-[#F5EEE1] text-[#1A1A1A]'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '13px' }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 py-3 bg-white border-b border-[#F5EEE1]">
        <button className="flex items-center gap-2 text-[#5B7FE8]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}>
          <SlidersHorizontal className="w-4 h-4" />
          {t('advancedFilters')}
        </button>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs text-[#6B7280] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              {t('price')}
            </label>
            <select className="w-full bg-[#F5EEE1] rounded-xl px-3 py-2 text-xs outline-none" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              <option>{t('all')}</option>
              <option>{t('lessThan1000')}</option>
              <option>1000 - 5000</option>
              <option>{t('moreThan5000')}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#6B7280] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              {t('rating')}
            </label>
            <select className="w-full bg-[#F5EEE1] rounded-xl px-3 py-2 text-xs outline-none" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              <option>{t('all')}</option>
              <option>5+</option>
              <option>4+</option>
              <option>3+</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#6B7280] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              {t('location')}
            </label>
            <select className="w-full bg-[#F5EEE1] rounded-xl px-3 py-2 text-xs outline-none" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              <option>{t('all')}</option>
              <option>{t('dubai')}</option>
              <option>{t('abudhabi')}</option>
              <option>{t('sharjah')}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#6B7280] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              {t('verification')}
            </label>
            <select className="w-full bg-[#F5EEE1] rounded-xl px-3 py-2 text-xs outline-none" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              <option>{t('all')}</option>
              <option>{t('verifiedOnly')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="text-[#6B7280] text-sm mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
          {results.length} {t('results')}
        </p>
        <div className="space-y-4">
          {results.map((item) => (
            <div key={item.id} className="bg-white rounded-[24px] overflow-hidden shadow-md">
              <div className="flex gap-4 p-4">
                <div className="relative flex-shrink-0 w-24 h-24 rounded-[16px] overflow-hidden">
                  <ImageWithFallback 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.badge && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-[#C8A24A] to-[#D3A55A] text-white text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      {item.badge}
                    </div>
                  )}
                  {item.tag && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-[#FF6B9D] to-[#C44569] text-white text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      {item.tag}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                      {item.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 bg-[#F5EEE1] rounded-full" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      {item.type === 'service' ? t('service') :
                       item.type === 'offer' ? t('offer') :
                       item.type === 'material' ? t('material') : t('worker')}
                    </span>
                  </div>
                  <p className="text-[#5B7FE8] text-xs mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                    {item.provider || item.supplier}
                  </p>
                  <div className="flex items-center gap-3 text-xs mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />
                      <span style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>{item.rating}</span>
                      {item.reviews && <span className="text-[#6B7280]">({item.reviews})</span>}
                    </div>
                    <div className="flex items-center gap-1 text-[#6B7280]">
                      <MapPin className="w-3 h-3" />
                      <span style={{ fontFamily: 'Cairo, sans-serif' }}>{item.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                      {item.price}
                    </span>
                    {item.discount && (
                      <span className="flex items-center gap-1 text-[#FF6B9D] text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        <Tag className="w-3 h-3" />
                        {t('discount')} {item.discount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}