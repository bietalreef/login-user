import { useState } from 'react';
import { useShopStore } from './ShopStore';
import { ArrowRight, ShoppingCart, Heart, Share2, Star, Minus, Plus, Truck, ShieldCheck, CreditCard, Camera } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { VRProductViewer } from './VRProductViewer';
import { useTranslation } from '../../../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

export function ProductDetails() {
  const { selectedProduct, setCurrentView, addToCart, favorites, toggleFavorite } = useShopStore();
  const [quantity, setQuantity] = useState(1);
  const [showVR, setShowVR] = useState(false);
  const { language, textAlign } = useTranslation('store');
  const isEn = language === 'en';
  const fontFamily = 'Cairo, sans-serif';
  const fw6: React.CSSProperties = { fontFamily, fontWeight: 600 };
  const fw7: React.CSSProperties = { fontFamily, fontWeight: 700 };
  const fw8: React.CSSProperties = { fontFamily, fontWeight: 800 };
  const currency = isEn ? 'AED' : 'د.إ';

  if (!selectedProduct) return null;

  const productName = isEn ? (selectedProduct.nameEn || selectedProduct.name) : selectedProduct.name;
  const productDesc = isEn ? (selectedProduct.descriptionEn || selectedProduct.description) : selectedProduct.description;
  const isFav = favorites.includes(selectedProduct.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(selectedProduct);
    toast.success(
      isEn ? `${quantity} item(s) added to cart` : `تمت إضافة ${quantity} منتج للسلة`,
      {
        duration: 2000,
        style: { background: '#252525', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      }
    );
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) addToCart(selectedProduct);
    setCurrentView('checkout');
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white overflow-y-auto pb-28 relative" style={{ fontFamily }}>
      {/* Header Image */}
      <div className="relative h-[45vh]">
         <ImageWithFallback src={selectedProduct.image} className="w-full h-full object-cover" />
         
         <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
            <button onClick={() => setCurrentView('home')} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
               <ArrowRight className="w-5 h-5 text-white" />
            </button>
            <div className="flex gap-2">
               <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Share2 className="w-5 h-5 text-white" />
               </button>
               <button 
                 onClick={() => toggleFavorite(selectedProduct.id)}
                 className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                   isFav ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20'
                 }`}
               >
                  <Heart className={`w-5 h-5 text-white ${isFav ? 'fill-current' : ''}`} />
               </button>
            </div>
         </div>

         {/* VR Button */}
         <button 
           onClick={() => setShowVR(true)}
           className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[#D4AF37] border border-[#D4AF37] text-black px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2.5 hover:bg-[#B5952F] transition-all shadow-lg shadow-[#D4AF37]/30"
           style={{ fontFamily }}
         >
            <Camera className="w-5 h-5" />
            <span>{isEn ? 'View in AR' : 'مشاهدة الواقع المعزز'}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
         </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#1A1A1A] -mt-6 rounded-t-[30px] relative z-10 px-6 py-8">
         <div className="flex justify-between items-start mb-4">
            <div>
               <h1 className="text-2xl mb-1" style={{ ...fw8, textAlign }}>{productName}</h1>
               <div className="flex items-center gap-1.5 text-[#D4AF37]">
                  <div className="w-6 h-6 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="text-base" style={fw7}>4.8</span>
                  <span className="text-gray-500 text-sm" style={fw6}>({isEn ? '125 reviews' : '125 تقييم'})</span>
               </div>
            </div>
            <div className="text-left">
               <div className="text-2xl text-[#D4AF37]" style={fw8}>{selectedProduct.price.toLocaleString()}</div>
               <div className="text-sm text-gray-500" style={fw6}>{currency}</div>
            </div>
         </div>

         {/* Quantity & Add */}
         <div className="flex gap-3 mb-4">
            <div className="flex items-center bg-[#252525] rounded-xl px-2 h-13 border border-white/5">
               <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-full flex items-center justify-center text-gray-400 hover:text-white"><Minus className="w-4.5 h-4.5"/></button>
               <span className="w-9 text-center text-lg" style={fw7}>{quantity}</span>
               <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-full flex items-center justify-center text-gray-400 hover:text-[#D4AF37]"><Plus className="w-4.5 h-4.5"/></button>
            </div>
            <button 
               onClick={handleAddToCart}
               className="flex-1 bg-[#252525] border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl h-13 flex items-center justify-center gap-2 transition-colors hover:bg-[#D4AF37]/10"
               style={fw7}
            >
               <ShoppingCart className="w-5 h-5" />
               <span className="text-base">{isEn ? 'Add to Cart' : 'أضف للسلة'}</span>
            </button>
         </div>

         {/* Buy Now Button */}
         <button 
           onClick={handleBuyNow}
           className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-black rounded-xl h-13 flex items-center justify-center gap-2 transition-colors mb-8"
           style={fw8}
         >
           <span className="text-lg">{isEn ? 'Buy Now' : 'اشتر الآن'}</span>
         </button>

         {/* Specs */}
         <div className="space-y-6">
            <div>
               <h3 className="text-xl mb-3 border-r-4 border-[#D4AF37] pr-3" style={{ ...fw8, textAlign }}>
                 {isEn ? 'Specifications' : 'المواصفات الفنية'}
               </h3>
               <div className="grid grid-cols-2 gap-3">
                  {selectedProduct.specs?.map((spec: any, idx: number) => (
                      <div key={idx} className="bg-[#252525] p-3.5 rounded-xl border border-white/5">
                         <span className="text-gray-500 text-sm block mb-1" style={{ ...fw6, textAlign }}>
                           {isEn ? (spec.labelEn || spec.label) : spec.label}
                         </span>
                         <span className="text-base" style={{ ...fw7, textAlign }}>
                           {isEn ? (spec.valueEn || spec.value) : spec.value}
                         </span>
                      </div>
                  ))}
               </div>
            </div>

            <div>
               <h3 className="text-xl mb-3 border-r-4 border-[#D4AF37] pr-3" style={{ ...fw8, textAlign }}>
                 {isEn ? 'About This Product' : 'عن المنتج'}
               </h3>
               <p className="text-gray-400 text-base leading-relaxed" style={{ ...fw6, textAlign }}>
                  {productDesc}
               </p>
            </div>

            <div className="flex gap-3 overflow-x-auto py-4">
               <div className="flex items-center gap-2.5 min-w-max text-sm text-gray-400 bg-[#252525] px-4 py-2.5 rounded-xl" style={fw6}>
                  <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  {isEn ? 'Free Delivery' : 'توصيل مجاني'}
               </div>
               <div className="flex items-center gap-2.5 min-w-max text-sm text-gray-400 bg-[#252525] px-4 py-2.5 rounded-xl" style={fw6}>
                  <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  {isEn ? '2-Year Warranty' : 'ضمان سنتين'}
               </div>
               <div className="flex items-center gap-2.5 min-w-max text-sm text-gray-400 bg-[#252525] px-4 py-2.5 rounded-xl" style={fw6}>
                  <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  {isEn ? 'Secure Payment' : 'دفع آمن'}
               </div>
            </div>
         </div>
      </div>
      
      {showVR && <VRProductViewer product={selectedProduct} onClose={() => setShowVR(false)} />}
    </div>
  );
}