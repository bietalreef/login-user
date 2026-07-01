// ====================================
// ⭐ Rating Summary Component
// بيت الريف - ملخص التقييمات
// ====================================

import { Star } from 'lucide-react';
import { ReviewTargetType, calculateReviewSummary } from '../../../data/reviews';

interface RatingSummaryProps {
  targetType: ReviewTargetType;
  targetId: string;
}

export function RatingSummary({ targetType, targetId }: RatingSummaryProps) {
  const summary = calculateReviewSummary(targetType, targetId);

  if (summary.totalReviews === 0) {
    return (
      <div className="bg-[#F5EEE1] rounded-2xl p-6 text-center" dir="rtl">
        <Star className="w-12 h-12 text-[#1F3D2B]/30 mx-auto mb-3" />
        <p className="text-sm text-[#1F3D2B]/60" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
          لا توجد تقييمات بعد. كن أول من يقيّم!
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...summary.distribution.map(d => d.count));

  return (
    <div className="bg-gradient-to-br from-[#F5EEE1] to-[#E5DED1] rounded-2xl p-5 mb-4" dir="rtl">
      {/* Overall Rating */}
      <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#1F3D2B]/10">
        <div className="text-center">
          <div className="text-5xl text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
            {summary.averageRating}
          </div>
          <div className="flex items-center gap-1 justify-center mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(summary.averageRating)
                    ? 'text-[#F2C94C] fill-[#F2C94C]'
                    : 'text-[#1F3D2B]/20 fill-[#1F3D2B]/20'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            {summary.totalReviews} تقييم
          </p>
        </div>

        {/* Distribution Bars */}
        <div className="flex-1 space-y-2">
          {summary.distribution.map((dist) => {
            const percentage = maxCount > 0 ? (dist.count / maxCount) * 100 : 0;
            
            return (
              <div key={dist.stars} className="flex items-center gap-2">
                <div className="flex items-center gap-1 min-w-[50px]">
                  <span className="text-xs text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                    {dist.stars}
                  </span>
                  <Star className="w-3 h-3 text-[#F2C94C] fill-[#F2C94C]" />
                </div>
                <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F2C94C] to-[#F2994A] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-[#1F3D2B]/60 min-w-[30px] text-left" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  {dist.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-xl text-[#D4AF37] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
            {summary.distribution.filter(d => d.stars === 5).reduce((sum, d) => sum + d.count, 0)}
          </div>
          <p className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            ممتاز
          </p>
        </div>
        <div className="text-center">
          <div className="text-xl text-[#D4AF37] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
            {summary.distribution.filter(d => d.stars >= 4).reduce((sum, d) => sum + d.count, 0)}
          </div>
          <p className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            جيد جداً
          </p>
        </div>
        <div className="text-center">
          <div className="text-xl text-[#F2994A] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
            {Math.round((summary.averageRating / 5) * 100)}%
          </div>
          <p className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            رضا العملاء
          </p>
        </div>
      </div>
    </div>
  );
}