import { Search, SlidersHorizontal, ShoppingCart, Star, TrendingUp, Tag, Store } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { MaterialsIcon, PaintingIcon, PlumbingIcon, ElectricityIcon, CarpentryIcon } from '../icons/ServiceIcons';
import { useTranslation } from '../../contexts/LanguageContext';
import { supabase } from '../../utils/supabase/client';
import { MarketplacePromoBanner, EStoreBanner, BrandPromiseBanner } from '../ui/PromoBanners';
import { SmartCTA } from '../ui/SmartCTA';

const categories = [
  { id: 1, name: 'الكل', Icon: MaterialsIcon },
  { id: 2, name: 'أسمنت', Icon: MaterialsIcon },
  { id: 3, name: 'أدوات', Icon: MaterialsIcon },
  { id: 4, name: 'دهانات', Icon: PaintingIcon },
  { id: 5, name: 'كهرباء', Icon: ElectricityIcon },
  { id: 6, name: 'سباكة', Icon: PlumbingIcon },
  { id: 7, name: 'أخشاب', Icon: CarpentryIcon },
];

export function MarketplaceScreen() {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const { t } = useTranslation();
  
  // Real Data State
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarketplaceItems() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('items') // Assume same table as ShopScreen
          .select('*')
          .limit(20);
          
        if (error && error.code !== '42P01' && error.code !== 'PGRST205') {
             console.error("Marketplace fetch error:", error);
        }
        
        setProducts(data || []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMarketplaceItems();
  }, []);

  return (
    <div className="flex-1 bg-[#F5EEE1] overflow-y-auto pb-24">
      {/* Page Title & Cart */}
      <div className="px-5 pt-5 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[#1A1A1A] text-xl" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
            المتجر
          </h1>
          <div className="relative">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <ShoppingCart className="w-5 h-5 text-[#5B7FE8]" />
            </button>
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-sm border border-white">
                <span className="text-white text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  {cartCount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" dir="rtl">
          {categories.map((category) => {
            const Icon = category.Icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all shadow-sm ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#5B7FE8] to-[#7B5FE8] text-white'
                    : 'bg-white text-[#6F6F6F]'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Banner */}
      <div className="px-5 py-4">
        <div className="bg-gradient-to-r from-[#C8A24A] to-[#D3A55A] rounded-[32px] p-5 shadow-lg flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-white" />
              <span className="text-white text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                عرض الأسبوع
              </span>
            </div>
            <h3 className="text-white text-base mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              خصم 25% على كل المواد
            </h3>
            <p className="text-white/90 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
              لفترة محدودة فقط
            </p>
          </div>
          <TrendingUp className="w-12 h-12 text-white/80" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-5 pb-6">
        {/* MARKETPLACE PROMO */}
        <div className="mb-4">
          <MarketplacePromoBanner />
        </div>

        {loading ? (
             <div className="grid grid-cols-2 gap-4">
                 {[1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-100 rounded-[28px] animate-pulse" />)}
             </div>
        ) : products.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-10 opacity-60">
                 <Store className="w-12 h-12 text-slate-300 mb-2" />
                 <p className="text-sm text-slate-400" style={{ fontFamily: 'Cairo, sans-serif' }}>المتجر قيد التحديث</p>
             </div>
        ) : (
            <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
                <motion.div
                key={product.id}
                className="bg-white rounded-[28px] overflow-hidden shadow-md"
                whileTap={{ scale: 0.95 }}
                >
                {/* Product Image */}
                <div className="relative h-32">
                    <ImageWithFallback
                    src={product.image || 'https://via.placeholder.com/150'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    />
                    {product.tag && (
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[9px] bg-blue-500 text-white`} style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        {product.tag}
                    </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-3">
                    <h3 className="text-[#1A1A1A] text-xs mb-1 text-right line-clamp-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                    {product.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mt-2">
                    <button 
                        className={`px-3 py-1.5 rounded-[10px] text-xs bg-gradient-to-r from-[#5B7FE8] to-[#7B5FE8] text-white`}
                        style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
                    >
                        أضف
                    </button>
                    <div className="text-right">
                        <p className="text-sm text-[#5B7FE8]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                        {product.price} درهم
                        </p>
                    </div>
                    </div>
                </div>
                </motion.div>
            ))}
            </div>
        )}
      </div>

      {/* E-STORE BANNER */}
      <div className="px-5 pb-4">
        <EStoreBanner />
      </div>

      {/* BRAND PROMISE */}
      <div className="px-5 pb-6">
        <BrandPromiseBanner variant="compact" />
      </div>
    </div>
  );
}