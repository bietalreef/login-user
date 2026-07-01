import { useState } from 'react';
import { useShopStore } from './ShopStore';
import { Star, Upload, ArrowRight, CheckCircle, Heart } from 'lucide-react';
// CheckCircle2 not available — using CheckCircle as alias
const CheckCircle2 = CheckCircle;
import { useTranslation } from '../../../contexts/LanguageContext';
import { motion } from 'motion/react';

export function OrderRating() {
  const { setCurrentView, selectedOrder } = useShopStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { language, textAlign } = useTranslation('store');
  const isEn = language === 'en';
  const fontFamily = 'Cairo, sans-serif';
  const fw6: React.CSSProperties = { fontFamily, fontWeight: 600 };
  const fw7: React.CSSProperties = { fontFamily, fontWeight: 700 };
  const fw8: React.CSSProperties = { fontFamily, fontWeight: 800 };

  if (submitted) {
    return (
      <div className="flex flex-col h-full bg-[#1A1A1A] text-white items-center justify-center p-6" style={{ fontFamily }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mb-6"
        >
          <Heart className="w-12 h-12 text-[#D4AF37] fill-current" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-2 text-center"
          style={{ fontFamily }}
        >
          {isEn ? 'Thank you!' : 'شكراً لك!'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-sm text-center mb-8 max-w-xs"
          style={{ fontFamily }}
        >
          {isEn ? 'Your review helps us improve our service' : 'تقييمك يساعدنا على تحسين خدماتنا'}
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => setCurrentView('home')}
          className="bg-[#D4AF37] text-black font-bold px-8 py-3 rounded-xl hover:bg-[#B5952F] transition-colors"
          style={{ fontFamily }}
        >
          {isEn ? 'Back to Store' : 'العودة للمتجر'}
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white overflow-y-auto pb-4 items-center justify-center p-6" style={{ fontFamily }}>
      <button onClick={() => setCurrentView('home')} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
        <ArrowRight className="w-6 h-6" />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-[#252525] rounded-3xl p-6 text-center shadow-2xl border border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]" />
        
        <div className="w-20 h-20 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#D4AF37]" />
        </div>

        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily }}>
          {isEn ? 'Delivered Successfully!' : 'تم التوصيل بنجاح!'}
        </h2>
        <p className="text-gray-400 text-sm mb-8" style={{ fontFamily }}>
          {selectedOrder
            ? (isEn
              ? `Your order #${selectedOrder.id} has arrived. We hope you like it!`
              : `لقد وصل طلبك رقم #${selectedOrder.id}. نأمل أن يكون المنتج قد نال إعجابك.`)
            : (isEn
              ? 'Your order has arrived. We hope you like it!'
              : 'لقد وصل طلبك. نأمل أن يكون المنتج قد نال إعجابك.')}
        </p>

        <div className="mb-8">
          <p className="font-bold text-sm mb-4" style={{ fontFamily }}>
            {isEn ? 'How was your experience?' : 'كيف تقيم تجربتك؟'}
          </p>
          <div className="flex justify-center gap-2" dir="ltr">
            {[1, 2, 3, 4, 5].map(star => (
              <motion.button
                key={star}
                whileTap={{ scale: 0.8 }}
                whileHover={{ scale: 1.15 }}
                onClick={() => setRating(star)}
                className="transition-transform"
              >
                <Star className={`w-9 h-9 transition-colors ${rating >= star ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-600'}`} />
              </motion.button>
            ))}
          </div>
          {rating > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-[#D4AF37] mt-2"
              style={{ fontFamily }}
            >
              {rating >= 4 ? (isEn ? 'Excellent!' : 'ممتاز!') :
               rating >= 3 ? (isEn ? 'Good' : 'جيد') :
               (isEn ? 'We will do better!' : 'سنعمل على التحسين!')}
            </motion.p>
          )}
        </div>

        <div className="relative mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={isEn ? 'Write your comment here...' : 'اكتب تعليقك هنا...'}
            className="w-full bg-[#1A1A1A] rounded-xl p-3 text-sm min-h-[80px] border border-transparent focus:border-[#D4AF37] outline-none resize-none"
            style={{ fontFamily, textAlign }}
          />
        </div>

        <button
          onClick={() => setSubmitted(true)}
          disabled={rating === 0}
          className={`w-full font-bold py-3.5 rounded-xl transition-all ${
            rating > 0
              ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20 hover:bg-[#B8940E]'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
          style={{ fontFamily }}
        >
          {isEn ? 'Submit Review' : 'إرسال التقييم'}
        </button>
        
        <button onClick={() => setCurrentView('home')} className="w-full text-gray-500 text-xs font-bold py-3 mt-2 hover:text-gray-300 transition-colors" style={{ fontFamily }}>
          {isEn ? 'Back to Home' : 'العودة للرئيسية'}
        </button>
      </motion.div>
    </div>
  );
}