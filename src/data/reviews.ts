// ====================================
// ⭐ Reviews System Data Model
// بيت الريف - نظام التقييمات الموحّد
// ====================================

export type ReviewTargetType = 'service' | 'provider' | 'product';

export interface Review {
  id: string;
  targetType: ReviewTargetType;
  targetId: string; // serviceId أو providerId أو productId
  userName: string;
  userId?: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  helpfulCount?: number;
  isVerified?: boolean; // هل المستخدم موثق
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: { stars: 1 | 2 | 3 | 4 | 5; count: number }[];
}

// ====================================
// 📊 Mock Data - بيانات تجريبية
// ====================================

export const MOCK_REVIEWS: Review[] = [
  // تقييمات الخدمات
  {
    id: 'REV-001',
    targetType: 'service',
    targetId: 'plumbing',
    userName: 'أحمد محمد',
    userId: 'USER-001',
    userAvatar: '👨',
    rating: 5,
    comment: 'خدمة ممتازة جداً، فني محترف وسريع في الأداء. أنصح بالتعامل معهم',
    createdAt: '2024-01-15T10:30:00Z',
    helpfulCount: 12,
    isVerified: true
  },
  {
    id: 'REV-002',
    targetType: 'service',
    targetId: 'plumbing',
    userName: 'فاطمة علي',
    userId: 'USER-002',
    userAvatar: '👩',
    rating: 4,
    comment: 'جيد جداً، لكن الأسعار أعلى قليلاً من المتوسط',
    createdAt: '2024-01-14T14:20:00Z',
    helpfulCount: 8,
    isVerified: true
  },
  {
    id: 'REV-003',
    targetType: 'service',
    targetId: 'electricity',
    userName: 'خالد سعيد',
    rating: 5,
    comment: 'خدمة احترافية، حل المشكلة بسرعة',
    createdAt: '2024-01-13T09:15:00Z',
    helpfulCount: 5,
    isVerified: false
  },

  // تقييمات المزودين
  {
    id: 'REV-004',
    targetType: 'provider',
    targetId: 'PROV-001',
    userName: 'محمد الشامسي',
    userId: 'USER-003',
    rating: 5,
    comment: 'أفضل محل مواد بناء في المنطقة، أسعار منافسة وجودة عالية',
    createdAt: '2024-01-16T11:00:00Z',
    helpfulCount: 15,
    isVerified: true
  },
  {
    id: 'REV-005',
    targetType: 'provider',
    targetId: 'PROV-001',
    userName: 'سارة أحمد',
    rating: 4,
    comment: 'جيد جداً، لكن التوصيل أخذ وقت أطول من المتوقع',
    createdAt: '2024-01-15T16:30:00Z',
    helpfulCount: 7,
    isVerified: true
  },

  // تقييمات المنتجات
  {
    id: 'REV-006',
    targetType: 'product',
    targetId: 'MAT-001',
    userName: 'عبدالله المري',
    userId: 'USER-004',
    rating: 5,
    comment: 'أسمنت ممتاز، استخدمته في مشروعي والنتيجة رائعة',
    createdAt: '2024-01-17T08:45:00Z',
    helpfulCount: 20,
    isVerified: true
  },
  {
    id: 'REV-007',
    targetType: 'product',
    targetId: 'MAT-001',
    userName: 'راشد خليفة',
    rating: 4,
    comment: 'جودة جيدة لكن السعر مرتفع قليلاً',
    createdAt: '2024-01-16T13:20:00Z',
    helpfulCount: 6,
    isVerified: false
  },
  {
    id: 'REV-008',
    targetType: 'product',
    targetId: 'TOOL-001',
    userName: 'يوسف الكعبي',
    rating: 5,
    comment: 'دريل ممتاز وقوي، يستحق السعر',
    createdAt: '2024-01-15T10:00:00Z',
    helpfulCount: 18,
    isVerified: true
  },
  {
    id: 'REV-009',
    targetType: 'product',
    targetId: 'FURN-001',
    userName: 'منى سالم',
    userId: 'USER-005',
    rating: 5,
    comment: 'طقم أريكة فاخر جداً، الجودة ممتازة والراحة لا توصف',
    createdAt: '2024-01-14T15:30:00Z',
    helpfulCount: 25,
    isVerified: true
  },
  {
    id: 'REV-010',
    targetType: 'product',
    targetId: 'DECOR-002',
    userName: 'حمد الظاهري',
    rating: 4,
    comment: 'إضاءة جميلة وعصرية، لكن التركيب يحتاج فني',
    createdAt: '2024-01-13T12:15:00Z',
    helpfulCount: 9,
    isVerified: true
  }
];

// ====================================
// 📊 Helper Functions
// ====================================

export function getReviewsByTarget(
  targetType: ReviewTargetType,
  targetId: string
): Review[] {
  return MOCK_REVIEWS.filter(
    review => review.targetType === targetType && review.targetId === targetId
  );
}

export function calculateReviewSummary(
  targetType: ReviewTargetType,
  targetId: string
): ReviewSummary {
  const reviews = getReviewsByTarget(targetType, targetId);
  
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: [
        { stars: 5, count: 0 },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 }
      ]
    };
  }

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalRating / reviews.length;

  const distribution = [5, 4, 3, 2, 1].map(stars => ({
    stars: stars as 1 | 2 | 3 | 4 | 5,
    count: reviews.filter(r => r.rating === stars).length
  }));

  return {
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews: reviews.length,
    distribution
  };
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `قبل ${diffMins} دقيقة`;
  } else if (diffHours < 24) {
    return `قبل ${diffHours} ساعة`;
  } else if (diffDays < 30) {
    return `قبل ${diffDays} يوم`;
  } else {
    return date.toLocaleDateString('ar-AE');
  }
}
