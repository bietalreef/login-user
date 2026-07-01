// ====================================
// ✍️ Review Form Component
// بيت الريف - فورم إضافة تقييم
// ====================================

import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { ReviewTargetType } from '../../../data/reviews';
import { motion } from 'motion/react';

interface ReviewFormProps {
  targetType: ReviewTargetType;
  targetId: string;
  onSubmit?: (review: { rating: number; comment: string }) => void;
}

export function ReviewForm({ targetType, targetId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim() || !userName.trim()) {
      alert('الرجاء ملء جميع الحقول واختيار تقييم');
      return;
    }

    setIsSubmitting(true);

    // TODO: Replace with actual API call
    // POST /api/reviews
    // Body: { targetType, targetId, rating, comment, userName }
    
    console.log('📤 [TODO] Submit review:', {
      targetType,
      targetId,
      rating,
      comment,
      userName
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    alert(`✅ شكراً لك! تم إرسال تقييمك بنجاح\n\nالتقييم: ${rating} نجوم\nالتعليق: ${comment}`);

    // Reset form
    setRating(0);
    setComment('');
    setUserName('');
    setIsSubmitting(false);

    if (onSubmit) {
      onSubmit({ rating, comment });
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#F5EEE1] to-[#E5DED1] rounded-2xl p-5" dir="rtl">
      <h3 className="text-base text-[#1F3D2B] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
        أضف تقييمك
      </h3>

      {/* Name Input */}
      <div className="mb-4">
        <label className="block text-sm text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
          الاسم
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="اكتب اسمك"
          className="w-full px-4 py-3 rounded-xl bg-white border-2 border-transparent focus:border-[#4A90E2] outline-none text-sm"
          style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
        />
      </div>

      {/* Rating Stars */}
      <div className="mb-4">
        <label className="block text-sm text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
          تقييمك
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              whileTap={{ scale: 0.9 }}
              className="transition-transform"
            >
              <Star
                className={`w-10 h-10 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'text-[#F2C94C] fill-[#F2C94C]'
                    : 'text-[#1F3D2B]/20 fill-[#1F3D2B]/20'
                }`}
              />
            </motion.button>
          ))}
          {rating > 0 && (
            <span className="mr-2 text-sm text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              {rating === 5 && '🤩 ممتاز'}
              {rating === 4 && '😊 جيد جداً'}
              {rating === 3 && '🙂 جيد'}
              {rating === 2 && '😐 مقبول'}
              {rating === 1 && '😞 ضعيف'}
            </span>
          )}
        </div>
      </div>

      {/* Comment Input */}
      <div className="mb-4">
        <label className="block text-sm text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
          تعليقك
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="شاركنا تجربتك..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-white border-2 border-transparent focus:border-[#4A90E2] outline-none text-sm resize-none"
          style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
        />
        <p className="text-xs text-[#1F3D2B]/50 mt-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
          {comment.length}/500 حرف
        </p>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || rating === 0 || !comment.trim() || !userName.trim()}
        className="w-full bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            جاري الإرسال...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            إرسال التقييم
          </>
        )}
      </button>

      {/* TODO Notice */}
      <p className="text-xs text-[#1F3D2B]/40 text-center mt-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
        💡 TODO: سيتم ربط هذا الفورم مع Backend API لاحقاً
      </p>
    </div>
  );
}
