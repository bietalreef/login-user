// ====================================
// 📋 Review List Component
// بيت الريف - قائمة التقييمات
// ====================================

import { ReviewTargetType, getReviewsByTarget } from '../../../data/reviews';
import { ReviewCard } from './ReviewCard';

interface ReviewListProps {
  targetType: ReviewTargetType;
  targetId: string;
  limit?: number;
}

export function ReviewList({ targetType, targetId, limit }: ReviewListProps) {
  let reviews = getReviewsByTarget(targetType, targetId);
  
  if (limit) {
    reviews = reviews.slice(0, limit);
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-[#F5EEE1] rounded-2xl p-8 text-center" dir="rtl">
        <div className="text-4xl mb-3">💬</div>
        <p className="text-sm text-[#1F3D2B]/60" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
          لا توجد تقييمات بعد
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-4" dir="rtl">
      <h3 className="text-base text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
        آراء العملاء ({reviews.length})
      </h3>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
