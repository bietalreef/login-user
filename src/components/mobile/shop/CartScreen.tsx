import { useShopStore } from './ShopStore';
import { ArrowRight, Minus, Plus, Trash2, ShoppingCart, Truck, ShieldCheck, Tag } from 'lucide-react';
// ShoppingBag not available — using ShoppingCart as alias
const ShoppingBag = ShoppingCart;
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { useTranslation } from '../../../contexts/LanguageContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function CartScreen() {
  const { cart, removeFromCart, updateQuantity, setCurrentView, clearCart } = useShopStore();
  const { language, textAlign } = useTranslation('store');
  const isEn = language === 'en';
  const fontFamily = 'Cairo, sans-serif';
  const fw6: React.CSSProperties = { fontFamily, fontWeight: 600 };
  const fw7: React.CSSProperties = { fontFamily, fontWeight: 700 };
  const fw8: React.CSSProperties = { fontFamily, fontWeight: 800 };
  const currency = isEn ? 'AED' : 'د.إ';
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const vat = (subtotal - discount) * 0.05;
  const shipping = subtotal > 500 ? 0 : 50;
  const grandTotal = subtotal - discount + vat + shipping;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#1A1A1A] text-white px-8 py-20" style={{ fontFamily }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-28 h-28 bg-[#252525] rounded-full flex items-center justify-center mb-6 border border-white/5"
        >
          <ShoppingBag className="w-14 h-14 text-gray-600" />
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl mb-2"
          style={{ ...fw8, textAlign: 'center' }}
        >
          {isEn ? 'Your cart is empty' : 'سلة التسوق فارغة'}
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-base text-center mb-8 max-w-xs"
          style={fw6}
        >
          {isEn
            ? 'Explore our products and add items to your cart'
            : 'تصفّح منتجاتنا وأضف ما يعجبك إلى السلة'}
        </motion.p>
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => setCurrentView('home')}
          className="bg-[#D4AF37] text-black px-8 py-3.5 rounded-xl hover:bg-[#B5952F] transition-colors text-base"
          style={fw7}
        >
          {isEn ? 'Browse Products' : 'تصفح المنتجات'}
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white overflow-y-auto" style={{ fontFamily }}>
      {/* Header */}
      <div className="p-4 flex items-center gap-4 sticky top-0 bg-[#1A1A1A]/95 backdrop-blur-md z-10 border-b border-white/5">
        <button onClick={() => setCurrentView('home')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl flex-1" style={{ ...fw8, textAlign }}>
          {isEn ? 'Shopping Cart' : 'سلة التسوق'}
          <span className="text-sm text-gray-500 mr-2" style={fw6}>
            ({cartCount} {isEn ? 'items' : 'منتج'})
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-400 hover:text-red-300 transition-colors px-2 py-1"
          style={fw7}
        >
          {isEn ? 'Clear All' : 'مسح الكل'}
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4 space-y-3 pb-72">
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-[#252525] rounded-2xl p-3 border border-white/5 flex gap-3"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-black">
                <ImageWithFallback src={item.image} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="text-base truncate mb-1" style={{ ...fw7, textAlign }}>
                    {isEn ? (item.nameEn || item.name) : item.name}
                  </h3>
                  <p className="text-sm text-gray-500" style={{ ...fw6, textAlign }}>
                    {isEn ? (item.categoryEn || item.category) : item.category}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center bg-[#1A1A1A] rounded-lg border border-white/5">
                    <button
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeFromCart(item.id);
                        } else {
                          updateQuantity(item.id, -1);
                        }
                      }}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-400" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[#D4AF37] text-base" style={fw8}>
                    {(item.price * item.quantity).toLocaleString()} {currency}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Promo Code */}
        <div className="bg-[#252525] rounded-2xl p-4 border border-white/5 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm font-bold" style={{ fontFamily, textAlign }}>
              {isEn ? 'Promo Code' : 'كود الخصم'}
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder={isEn ? 'Enter code...' : 'أدخل الكود...'}
              className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none"
              style={{ fontFamily, textAlign }}
            />
            <button
              onClick={() => {
                if (promoCode.trim()) setPromoApplied(true);
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                promoApplied
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-[#D4AF37] text-black hover:bg-[#B5952F]'
              }`}
              style={{ fontFamily }}
            >
              {promoApplied ? (isEn ? 'Applied!' : 'تم!') : (isEn ? 'Apply' : 'تطبيق')}
            </button>
          </div>
        </div>

        {/* Info Badges */}
        <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar">
          <div className="flex items-center gap-2.5 min-w-max text-sm text-gray-400 bg-[#252525] px-4 py-3 rounded-xl border border-white/5" style={fw6}>
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
            </div>
            {subtotal > 500
              ? (isEn ? 'Free Delivery!' : 'توصيل مجاني!')
              : (isEn ? `${(500 - subtotal).toLocaleString()} AED for free delivery` : `${(500 - subtotal).toLocaleString()} د.إ للتوصيل المجاني`)}
          </div>
          <div className="flex items-center gap-2.5 min-w-max text-sm text-gray-400 bg-[#252525] px-4 py-3 rounded-xl border border-white/5" style={fw6}>
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            </div>
            {isEn ? 'Secure Payment' : 'دفع آمن 100%'}
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-[#252525] rounded-2xl p-5 border border-white/5 space-y-3">
          <div className="flex justify-between text-base text-gray-400" style={fw6}>
            <span>{isEn ? 'Subtotal' : 'المجموع الفرعي'}</span>
            <span>{subtotal.toLocaleString()} {currency}</span>
          </div>
          {promoApplied && (
            <div className="flex justify-between text-base text-green-400" style={fw6}>
              <span>{isEn ? 'Discount (10%)' : 'خصم (10%)'}</span>
              <span>-{discount.toLocaleString()} {currency}</span>
            </div>
          )}
          <div className="flex justify-between text-base text-gray-400" style={fw6}>
            <span>{isEn ? 'VAT (5%)' : 'ضريبة القيمة المضافة (5%)'}</span>
            <span>{vat.toFixed(2)} {currency}</span>
          </div>
          <div className="flex justify-between text-base text-gray-400" style={fw6}>
            <span>{isEn ? 'Delivery' : 'التوصيل'}</span>
            <span className={shipping === 0 ? 'text-green-400' : ''}>
              {shipping === 0 ? (isEn ? 'Free' : 'مجاني') : `${shipping} ${currency}`}
            </span>
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between text-xl" style={fw8}>
            <span>{isEn ? 'Total' : 'الإجمالي'}</span>
            <span className="text-[#D4AF37]">{grandTotal.toFixed(2)} {currency}</span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-[72px] left-0 right-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A] to-transparent pt-8 pb-4 px-4 z-20">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setCurrentView('checkout')}
          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B5952F] text-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-[#D4AF37]/20 text-lg"
          style={fw8}
        >
          <span>{isEn ? 'Continue to Checkout' : 'متابعة الشراء'}</span>
          <span className="bg-black/20 px-3.5 py-1.5 rounded-xl text-base" style={fw7}>
            {grandTotal.toFixed(2)} {currency}
          </span>
        </motion.button>
      </div>
    </div>
  );
}