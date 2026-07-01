import { useState, lazy, Suspense } from 'react';
import { toast } from 'sonner@2.0.3';
import { useShopStore } from './ShopStore';
import { Search, Heart, Plus, Star, Flame, X, Box, Glasses } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { useTranslation } from '../../../contexts/LanguageContext';
import { useNavigate } from 'react-router@7.1.1';
import { EStoreBanner, BrandPromiseBanner } from '../../ui/PromoBanners';

// Lazy load heavy 3D/canvas components — only loaded when modals open
const VR3DShowroom = lazy(() => import('./VR3DShowroom').then(m => ({ default: m.VR3DShowroom })));
const IsometricShowcase = lazy(() => import('./IsometricShowcase').then(m => ({ default: m.IsometricShowcase })));
const IsometricBannerLazy = lazy(() => import('./IsometricShowcase').then(m => ({ default: m.IsometricBanner })));

// Products relevant to construction & home finishing — UAE market
const DEMO_PRODUCTS = [
  {
    id: 'p1',
    name: 'كاونتر رخام كرارا إيطالي',
    nameEn: 'Italian Carrara Marble Countertop',
    price: 850,
    category: 'رخام وحجر',
    categoryEn: 'Marble & Stone',
    image: 'https://images.unsplash.com/photo-1760072513457-651955c7074d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'كاونتر مطبخ رخام كرارا إيطالي أصلي، سماكة 3 سم، مصقول بلمعان عالي. مثالي للمطابخ الفاخرة.',
    descriptionEn: 'Genuine Italian Carrara marble kitchen countertop, 3cm thickness, high-gloss polished. Ideal for luxury kitchens.',
    specs: [
      { label: 'السماكة', labelEn: 'Thickness', value: '3 سم', valueEn: '3 cm' },
      { label: 'التشطيب', labelEn: 'Finish', value: 'مصقول لامع', valueEn: 'Polished Gloss' },
      { label: 'الوحدة', labelEn: 'Unit', value: 'متر مربع', valueEn: 'sqm' }
    ]
  },
  {
    id: 'p2',
    name: 'طاولة طعام خشب جوز طبيعي',
    nameEn: 'Natural Walnut Wood Dining Table',
    price: 4200,
    category: 'أثاث',
    categoryEn: 'Furniture',
    image: 'https://images.unsplash.com/photo-1758977403438-1b8546560d31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'طاولة طعام من خشب الجوز الطبيعي تتسع لـ 8 أشخاص، تصميم عصري أنيق مع أرجل معدنية.',
    descriptionEn: 'Natural walnut wood dining table seats 8, elegant modern design with metal legs.',
    specs: [
      { label: 'الأبعاد', labelEn: 'Dimensions', value: '220 x 100 x 76 سم', valueEn: '220 x 100 x 76 cm' },
      { label: 'المادة', labelEn: 'Material', value: 'خشب جوز طبيعي', valueEn: 'Natural Walnut' },
      { label: 'السعة', labelEn: 'Seats', value: '8 أشخاص', valueEn: '8 persons' }
    ]
  },
  {
    id: 'p3',
    name: 'خزائن مطبخ MDF لاكر أبيض',
    nameEn: 'White Lacquer MDF Kitchen Cabinets',
    price: 12000,
    category: 'مطابخ',
    categoryEn: 'Kitchens',
    image: 'https://images.unsplash.com/photo-1682888818602-b4492fadf2f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'خزائن مطبخ MDF عالي الكثافة، لاكر أبيض لامع، مفصلات سوفت كلوز، أدراج بنظام البلام بوكس.',
    descriptionEn: 'High-density MDF kitchen cabinets, glossy white lacquer, soft-close hinges, Blum box drawer system.',
    specs: [
      { label: 'المادة', labelEn: 'Material', value: 'MDF عالي الكثافة', valueEn: 'High-density MDF' },
      { label: 'التشطيب', labelEn: 'Finish', value: 'لاكر لامع', valueEn: 'Glossy Lacquer' },
      { label: 'الوحدة', labelEn: 'Unit', value: 'متر طولي', valueEn: 'linear meter' }
    ]
  },
  {
    id: 'p4',
    name: 'بلاط بورسلان إيطالي 60×120',
    nameEn: 'Italian Porcelain Tiles 60×120',
    price: 95,
    category: 'أرضيات',
    categoryEn: 'Flooring',
    image: 'https://images.unsplash.com/photo-1604589977707-d161da2edb0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'بلاط بورسلان إيطالي عالي الجودة، مقاس 60×120 سم، تشطيب مات مقاوم للانزلاق.',
    descriptionEn: 'High-quality Italian porcelain tiles, 60x120cm, anti-slip matte finish.',
    specs: [
      { label: 'المقاس', labelEn: 'Size', value: '60 × 120 سم', valueEn: '60 × 120 cm' },
      { label: 'التشطيب', labelEn: 'Finish', value: 'مات مقاوم للانزلاق', valueEn: 'Anti-slip Matte' },
      { label: 'المنشأ', labelEn: 'Origin', value: 'إيطاليا', valueEn: 'Italy' }
    ]
  },
  {
    id: 'p5',
    name: 'وحدة حمام فاخرة مع مرآة LED',
    nameEn: 'Luxury Bathroom Vanity with LED Mirror',
    price: 3800,
    category: 'حمامات',
    categoryEn: 'Bathrooms',
    image: 'https://images.unsplash.com/photo-1768413292551-10011d6c354e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'وحدة حمام خشبية مع حوض سيراميك مدمج ومرآة LED مضيئة، أدراج سوفت كلوز، تصميم إيطالي.',
    descriptionEn: 'Wooden bathroom vanity with integrated ceramic basin and LED mirror, soft-close drawers, Italian design.',
    specs: [
      { label: 'المقاس', labelEn: 'Size', value: '120 × 50 سم', valueEn: '120 × 50 cm' },
      { label: 'المرآة', labelEn: 'Mirror', value: 'LED مع مفتاح لمس', valueEn: 'LED with touch switch' },
      { label: 'التصميم', labelEn: 'Design', value: 'إيطالي', valueEn: 'Italian' }
    ]
  },
  {
    id: 'p6',
    name: 'جبس بورد مودرن مع إضاءة مخفية',
    nameEn: 'Modern Gypsum Board with Hidden Lighting',
    price: 120,
    category: 'ديكور',
    categoryEn: 'Decor',
    image: 'https://images.unsplash.com/photo-1561208885-a4a5a0ccc359?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'تصميم وتنفيذ أسقف جبس بورد مع إضاءة مخفية LED. تصاميم عصرية متنوعة، يشمل المواد والتركيب.',
    descriptionEn: 'Design and installation of gypsum board ceilings with hidden LED lighting. Various modern designs, includes materials and installation.',
    specs: [
      { label: 'النوع', labelEn: 'Type', value: 'جبس بورد مقاوم للرطوبة', valueEn: 'Moisture-resistant Gypsum' },
      { label: 'الإضاءة', labelEn: 'Lighting', value: 'LED مخفية', valueEn: 'Hidden LED' },
      { label: 'الوحدة', labelEn: 'Unit', value: 'متر مربع', valueEn: 'sqm' }
    ]
  }
];

const CATEGORIES = {
  ar: [
    { id: 'all', label: 'الكل' },
    { id: 'marble', label: 'رخام' },
    { id: 'kitchens', label: 'مطابخ' },
    { id: 'flooring', label: 'أرضيات' },
    { id: 'bathrooms', label: 'حمامات' },
    { id: 'decor', label: 'ديكور' },
    { id: 'furniture', label: 'أثاث' },
  ],
  en: [
    { id: 'all', label: 'All' },
    { id: 'marble', label: 'Marble' },
    { id: 'kitchens', label: 'Kitchens' },
    { id: 'flooring', label: 'Flooring' },
    { id: 'bathrooms', label: 'Bathrooms' },
    { id: 'decor', label: 'Decor' },
    { id: 'furniture', label: 'Furniture' },
  ]
};

function ModalLoader() {
  return (
    <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D4AF37]" />
    </div>
  );
}

export function StoreHome() {
  const { setSelectedProduct, setCurrentView, addToCart, favorites, toggleFavorite } = useShopStore();
  const [activeCat, setActiveCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [show3DShowroom, setShow3DShowroom] = useState(false);
  const [showIsometric, setShowIsometric] = useState(false);
  const { language, textAlign } = useTranslation('store');
  const isEn = language === 'en';
  const fontFamily = 'Cairo, sans-serif';
  const fw6: React.CSSProperties = { fontFamily, fontWeight: 600 };
  const fw7: React.CSSProperties = { fontFamily, fontWeight: 700 };
  const fw8: React.CSSProperties = { fontFamily, fontWeight: 800 };
  const currency = isEn ? 'AED' : 'د.إ';
  const cats = isEn ? CATEGORIES.en : CATEGORIES.ar;
  const navigate = useNavigate();

  const filteredProducts = DEMO_PRODUCTS.filter(p => {
    const matchesCat = activeCat === 'all' || 
      (activeCat === 'marble' && p.category === 'رخام وحجر') ||
      (activeCat === 'kitchens' && p.category === 'مطابخ') ||
      (activeCat === 'flooring' && p.category === 'أرضيات') ||
      (activeCat === 'bathrooms' && p.category === 'حمامات') ||
      (activeCat === 'decor' && p.category === 'ديكور') ||
      (activeCat === 'furniture' && p.category === 'أثاث');
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(isEn ? 'Added to cart!' : 'تمت الإضافة للسلة!', {
      duration: 1500,
      style: { background: '#252525', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white overflow-y-auto pb-4" style={{ fontFamily }}>
      {/* Header */}
      <div className="p-5 sticky top-0 bg-[#1A1A1A]/95 backdrop-blur-md z-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl text-[#D4AF37]" style={fw8}>
              {isEn ? 'Bait Al Reef Store' : 'متجر بيت الريف'}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5" style={fw6}>
              {isEn ? `${DEMO_PRODUCTS.length} products available` : `${DEMO_PRODUCTS.length} منتج متاح`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#D4AF37]/10 px-3.5 py-2 rounded-full flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <span className="text-[#D4AF37] text-sm" style={fw7}>
                {isEn ? 'Sale' : 'عروض'}
              </span>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 bg-white/10 hover:bg-red-500/20 rounded-full flex items-center justify-center transition-all group border border-white/10"
              aria-label={isEn ? 'Close store' : 'إغلاق المتجر'}
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? 'Search for your product...' : 'ابحث عن منتجك المفضل...'} 
            className="w-full bg-[#252525] border border-white/10 rounded-xl py-3.5 pr-11 pl-4 text-base focus:outline-none focus:border-[#D4AF37] transition-colors"
            style={{ ...fw6, textAlign }}
          />
          <div className="absolute right-3 top-3.5 w-7 h-7 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
            <Search className="w-4 h-4 text-[#D4AF37]" />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
           {cats.map(cat => (
             <button
               key={cat.id}
               onClick={() => setActiveCat(cat.id)}
               className={`px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all ${
                 activeCat === cat.id 
                 ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' 
                 : 'bg-[#252525] text-gray-400 hover:bg-[#333] border border-white/5'
               }`}
               style={fw7}
             >
               {cat.label}
             </button>
           ))}
        </div>
      </div>

      {/* Featured Banner */}
      <div className="px-5 mb-4">
        <div className="w-full h-40 bg-gradient-to-r from-[#D4AF37] to-[#8A701E] rounded-2xl flex items-center justify-between p-6 relative overflow-hidden">
           <div className="relative z-10">
              <span className="text-black/60 text-sm mb-1 block" style={fw7}>
                {isEn ? 'Season Sale' : 'تخفيضات الموسم'}
              </span>
              <h2 className="text-3xl text-black mb-3" style={fw8}>
                {isEn ? '30% OFF' : 'خصم 30%'}
              </h2>
              <button 
                onClick={() => setActiveCat('all')}
                className="bg-black text-white px-5 py-2 rounded-xl text-sm hover:bg-black/80 transition-colors" 
                style={fw7}
              >
                {isEn ? 'Shop Now' : 'تسوق الآن'}
              </button>
           </div>
           <ImageWithFallback src={DEMO_PRODUCTS[0].image} className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-30 mix-blend-multiply" />
        </div>
      </div>

      {/* 3D VR Showroom Banner */}
      <div className="px-5 mb-6">
        <button
          onClick={() => setShow3DShowroom(true)}
          className="w-full rounded-2xl overflow-hidden relative group active:scale-[0.98] transition-transform"
          style={{ height: 100 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#111318] via-[#1a2e24] to-[#111318] group-hover:via-[#1f3d2b] transition-all duration-500" />
          <div className="absolute top-3 right-6 w-8 h-8 border border-[#D4AF37]/30 rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-700" />
          <div className="absolute bottom-4 right-14 w-5 h-5 border border-[#D4AF37]/20 rounded rotate-45 group-hover:rotate-90 transition-transform duration-500" />
          <div className="absolute top-6 right-28 w-4 h-4 bg-[#D4AF37]/10 rounded group-hover:scale-150 transition-transform duration-500" />
          
          <div className="relative z-10 flex items-center h-full px-5 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <div className="relative">
                <Box className="w-7 h-7 text-[#D4AF37]" />
                <Glasses className="w-4 h-4 text-[#D4AF37] absolute -bottom-1 -right-1.5" />
              </div>
            </div>
            
            <div className="flex-1 text-right">
              <h3 className="text-white text-base mb-0.5" style={{ fontWeight: 800, fontFamily }}>
                {isEn ? '3D VR Showroom' : 'المعرض ثلاثي الأبعاد'}
              </h3>
              <p className="text-white/40 text-xs" style={{ fontWeight: 600, fontFamily }}>
                {isEn ? '6 Premium Models · Interactive VR' : '٦ نماذج فاخرة · واقع افتراضي تفاعلي'}
              </p>
            </div>

            <div className="flex-shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8940E] text-white text-sm group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all" style={{ fontWeight: 700, fontFamily }}>
              {isEn ? 'Enter' : 'ادخل'}
            </div>
          </div>

          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        </button>
      </div>

      {/* 3D Showroom Modal - lazy loaded */}
      {show3DShowroom && (
        <Suspense fallback={<ModalLoader />}>
          <VR3DShowroom onClose={() => setShow3DShowroom(false)} isEn={isEn} />
        </Suspense>
      )}

      {/* Isometric Gallery Banner - lazy loaded */}
      <div className="px-5 mb-6">
        <Suspense fallback={
          <div className="w-full h-[100px] rounded-2xl bg-[#252525] animate-pulse" />
        }>
          <IsometricBannerLazy onClick={() => setShowIsometric(true)} isEn={isEn} />
        </Suspense>
      </div>

      {/* Isometric Showcase Modal - lazy loaded */}
      {showIsometric && (
        <Suspense fallback={<ModalLoader />}>
          <IsometricShowcase onClose={() => setShowIsometric(false)} isEn={isEn} />
        </Suspense>
      )}

      {/* Home Planner Banner */}
      <div className="px-5 mb-6">
        <button
          onClick={() => setCurrentView('room-configurator')}
          className="w-full rounded-2xl overflow-hidden relative group active:scale-[0.98] transition-transform"
          style={{ height: 100 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#111827] to-[#0B1120] group-hover:via-[#1E293B] transition-all duration-500" />
          <div className="absolute top-3 right-6 w-6 h-6 border border-[#3B5BFE]/25 rounded rotate-12 group-hover:rotate-45 transition-transform duration-700" />
          <div className="absolute bottom-4 right-16 w-4 h-4 border border-[#3B5BFE]/15 rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-500" />
          
          <div className="relative z-10 flex items-center h-full px-5 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B5BFE]/20 to-[#3B5BFE]/5 border border-[#3B5BFE]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Box className="w-7 h-7 text-[#3B5BFE]" />
            </div>
            
            <div className="flex-1 text-right">
              <h3 className="text-white text-base mb-0.5" style={{ fontWeight: 800, fontFamily }}>
                {isEn ? 'Home Planner' : 'مخطط المنزل التفاعلي'}
              </h3>
              <p className="text-white/40 text-xs" style={{ fontWeight: 600, fontFamily }}>
                {isEn ? 'Design · Furnish · Shop' : 'صمم · أثث · تسوق'}
              </p>
            </div>

            <div className="flex-shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3B5BFE] to-[#5B78FF] text-white text-sm group-hover:shadow-[0_0_20px_rgba(59,91,254,0.3)] transition-all" style={{ fontWeight: 700, fontFamily }}>
              {isEn ? 'Start' : 'ابدأ'}
            </div>
          </div>

          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3B5BFE]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3B5BFE]/20 to-transparent" />
        </button>
      </div>

      {/* Products Grid — no motion.div, simple CSS for perf */}
      <div className="px-5 grid grid-cols-2 gap-3">
         {filteredProducts.map((product) => {
           const isFav = favorites.includes(product.id);
           return (
             <div 
               key={product.id} 
               onClick={() => {
                  setSelectedProduct(product);
                  setCurrentView('product');
               }}
               className="bg-[#252525] rounded-2xl overflow-hidden group cursor-pointer border border-transparent hover:border-[#D4AF37]/30 transition-all"
             >
                <div className="relative h-36 overflow-hidden">
                   <ImageWithFallback src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       toggleFavorite(product.id);
                     }}
                     className={`absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                       isFav ? 'bg-red-500 text-white' : 'bg-black/50 backdrop-blur-sm text-white hover:bg-[#D4AF37] hover:text-black'
                     }`}
                   >
                      <Heart className={`w-4.5 h-4.5 ${isFav ? 'fill-current' : ''}`} />
                   </button>
                </div>
                <div className="p-3.5">
                   <h3 className="text-base mb-0.5 truncate" style={{ ...fw7, textAlign }}>
                     {isEn ? product.nameEn : product.name}
                   </h3>
                   <p className="text-sm text-gray-500 mb-2" style={{ ...fw6, textAlign }}>
                     {isEn ? product.categoryEn : product.category}
                   </p>
                   <div className="flex items-center gap-1.5 mb-2">
                     <div className="w-5 h-5 rounded bg-[#D4AF37]/15 flex items-center justify-center">
                       <Star className="w-3 h-3 text-[#D4AF37] fill-current" />
                     </div>
                     <span className="text-xs text-gray-400" style={fw6}>4.8</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[#D4AF37] text-base" style={fw8}>
                        {product.price.toLocaleString()} {currency}
                      </span>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-9 h-9 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] transition-all"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                   </div>
                </div>
             </div>
           );
         })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Search className="w-14 h-14 mb-4 opacity-30" />
          <p className="text-base" style={fw7}>{isEn ? 'No products found' : 'لا توجد منتجات'}</p>
        </div>
      )}

      {/* E-STORE BANNER */}
      <div className="px-5 mt-6 mb-4">
        <EStoreBanner isEn={isEn} />
      </div>

      {/* BRAND PROMISE */}
      <div className="px-5 mb-6">
        <BrandPromiseBanner isEn={isEn} variant="compact" />
      </div>
    </div>
  );
}
