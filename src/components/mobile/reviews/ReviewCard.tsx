// ====================================
// 💬 Review Card Component
// بيت الريف - بطاقة تقييم واحدة
// ====================================

import { Star, ThumbsUp, Shield } from 'lucide-react';
import { Review, formatTimeAgo } from '../../../data/reviews';
import { useState } from 'react';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [isHelpful, setIsHelpful] = useState(false);

  const handleHelpful = () => {
    if (!isHelpful) {
      setHelpfulCount(prev => prev + 1);
      setIsHelpful(true);
      // TODO: Backend API call
      console.log('Mark review as helpful:', review.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#F5EEE1]" dir="rtl">
      {/* User Info */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] flex items-center justify-center flex-shrink-0">
          <span className="text-xl">{review.userAvatar || '👤'}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm text-[#1F3D2B] truncate" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              {review.userName}
            </h4>
            {review.isVerified && (
              <div className="bg-[#4A90E2]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#4A90E2]" />
                <span className="text-xs text-[#4A90E2]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  موثق
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-[#1F3D2B]/50" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            {formatTimeAgo(review.createdAt)}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 bg-[#F5EEE1] px-2 py-1 rounded-lg">
          <Star className="w-3.5 h-3.5 text-[#F2C94C] fill-[#F2C94C]" />
          <span className="text-sm text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            {review.rating}
          </span>
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-[#1F3D2B]/80 leading-relaxed mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
        {review.comment}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-3 border-t border-[#F5EEE1]">
        <button
          onClick={handleHelpful}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            isHelpful
              ? 'bg-[#4A90E2] text-white'
              : 'bg-[#F5EEE1] text-[#1F3D2B]/70 hover:bg-[#4A90E2]/10'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${isHelpful ? 'fill-white' : ''}`} />
          <span className="text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            مفيد ({helpfulCount})
          </span>
        </button>
      </div>
    </div>
  );
}
