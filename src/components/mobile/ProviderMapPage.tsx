import { ImageWithFallback } from '../figma/ImageWithFallback';
import { DecorativeMap } from '../seo/DecorativeMap';
import { useState } from 'react';
import { 
  ArrowRight,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Clock,
  CheckCircle,
  Award,
  TrendingUp,
  ExternalLink,
  Image as ImageIcon,
  Video,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// ====================================
// 📌 Types & Interfaces
// ====================================

interface ProviderMapPageProps {
  providerId: string;
  name: string;
  nameEn?: string;
  businessName: string;
  category: string;
  subcategories: string[];
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  completedProjects: number;
  responseTime: string;
  completionRate: number;
  
  // Location
  city: string;
  area: string;
  serviceRadius: string;
  workingHours: string;
  
  // Media
  panorama360Url?: string;
  galleryImages: string[];
  videoUrl?: string;
  
  // Contact
  phoneNumber: string;
  whatsappNumber: string;
  
  // Reviews
  reviews: Array<{
    id: string;
    userName: string;
    rating: number;
    date: string;
    comment: string;
  }>;
  
  // Related providers
  relatedProviders: Array<{
    id: string;
    name: string;
    rating: number;
    distance: number;
  }>;
  
  onBack: () => void;
  onCallClick?: () => void;
  onWhatsAppClick?: () => void;
  onRequestClick?: () => void;
  onMapClick?: () => void;
}

// ====================================
// 🎨 Provider Map Page Component
// ====================================

export function ProviderMapPage({
  providerId,
  name,
  nameEn,
  businessName,
  category,
  subcategories,
  avatarUrl,
  rating,
  reviewCount,
  completedProjects,
  responseTime,
  completionRate,
  city,
  area,
  serviceRadius,
  workingHours,
  panorama360Url,
  galleryImages = [],
  videoUrl,
  phoneNumber,
  whatsappNumber,
  reviews = [],
  relatedProviders = [],
  onBack,
  onCallClick,
  onWhatsAppClick,
  onRequestClick,
  onMapClick,
}: ProviderMapPageProps) {
  
  const [selectedTab, setSelectedTab] = useState<'info' | 'gallery' | 'reviews'>('info');
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ====================================
  // 🎨 Render Component
  // ====================================
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white" dir="rtl">
      {/* ====================================
          📱 Header
          ==================================== */}
      
      <div className="sticky top-0 bg-white border-b border-[#F5EEE1] z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#1F3D2B] hover:text-[#2AA676] transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            <span>رجوع</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button className="text-[#1F3D2B] hover:text-[#D4AF37] transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="text-[#1F3D2B] hover:text-[#D4AF37] transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ====================================
          🎭 Hero Section
          ==================================== */}
      
      <div className="bg-white">
        {/* 360 Panorama Placeholder */}
        {panorama360Url && (
          <div className="relative h-64 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-2">360°</div>
                <div className="text-sm">جولة افتراضية بانورامية</div>
                <div className="text-xs text-white/70 mt-1">
                  (يتم التكامل مع Panolens.js)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Provider Header */}
        <div className="px-4 py-4">
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[#F5EEE1] flex-shrink-0 shadow-md">
              {avatarUrl ? (
                <ImageWithFallback src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#1F3D2B] flex items-center justify-center text-white text-2xl font-bold">
                  {name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-[#1F3D2B] mb-1">
                {name}
              </h1>
              {nameEn && (
                <p className="text-sm text-gray-500 mb-2">{nameEn}</p>
              )}
              
              {/* Category Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A90E2]/10 text-[#4A90E2] text-sm mb-2">
                <CheckCircle className="w-4 h-4" />
                <span>{category}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-[#C8A86A] text-[#C8A86A]" />
                  <span className="font-bold text-[#1F3D2B]">{rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-500">({reviewCount} تقييم)</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-[#F5EEE1] rounded-xl p-3 text-center">
              <Award className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
              <div className="text-lg font-bold text-[#1F3D2B]">{completedProjects}</div>
              <div className="text-xs text-gray-600">مشروع منجز</div>
            </div>
            
            <div className="bg-[#F5EEE1] rounded-xl p-3 text-center">
              <Clock className="w-5 h-5 text-[#4A90E2] mx-auto mb-1" />
              <div className="text-sm font-bold text-[#1F3D2B]">{responseTime}</div>
              <div className="text-xs text-gray-600">وقت الاستجابة</div>
            </div>
            
            <div className="bg-[#F5EEE1] rounded-xl p-3 text-center">
              <TrendingUp className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
              <div className="text-lg font-bold text-[#1F3D2B]">{completionRate}%</div>
              <div className="text-xs text-gray-600">معدل الإنجاز</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2">
            <button
              onClick={onRequestClick}
              className="w-full bg-gradient-to-l from-[#D4AF37] to-[#1F3D2B] text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              طلب خدمة الآن
            </button>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onWhatsAppClick}
                className="py-2.5 px-4 bg-[#25D366] text-white rounded-xl text-sm font-medium hover:bg-[#20BA59] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب</span>
              </button>
              
              <button
                onClick={onCallClick}
                className="py-2.5 px-4 bg-[#4A90E2] text-white rounded-xl text-sm font-medium hover:bg-[#3A7BC8] transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>اتصال</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================
          📑 Tabs
          ==================================== */}
      
      <div className="bg-white border-b border-[#F5EEE1] sticky top-[57px] z-10">
        <div className="flex">
          {(['info', 'gallery', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 py-3 font-semibold transition-all relative ${
                selectedTab === tab
                  ? 'text-[#D4AF37] border-b-4 border-[#D4AF37]'
                  : 'text-gray-500 hover:text-[#1F3D2B]'
              }`}
            >
              {tab === 'info' && 'معلومات النشاط'}
              {tab === 'gallery' && 'معرض الصور'}
              {tab === 'reviews' && 'التقييمات'}
            </button>
          ))}
        </div>
      </div>

      {/* ====================================
          📋 Tab Content
          ==================================== */}
      
      <div className="p-4 space-y-6">
        {selectedTab === 'info' && (
          <>
            {/* Business Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-bold text-[#1F3D2B] mb-4">معلومات النشاط</h2>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500 mb-1">الاسم التجاري</div>
                  <div className="font-semibold text-[#1F3D2B]">{businessName}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">التخصصات الفرعية</div>
                  <div className="flex flex-wrap gap-2">
                    {subcategories.map((sub, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[#F5EEE1] text-[#1F3D2B] text-sm rounded-full">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">المدينة / المنطقة</div>
                  <div className="font-semibold text-[#1F3D2B]">{city} - {area}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">نطاق الخدمة</div>
                  <div className="font-semibold text-[#1F3D2B]">{serviceRadius}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">ساعات العمل</div>
                  <div className="font-semibold text-[#1F3D2B]">{workingHours}</div>
                </div>
              </div>
            </div>

            {/* Location on Map */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-bold text-[#1F3D2B] mb-4">موقع النشاط</h2>
              <DecorativeMap
                cityName={city}
                compact={true}
                hideHeader={true}
                hideStrip={false}
              />
              <button
                onClick={onMapClick}
                className="w-full mt-3 py-2.5 px-4 bg-[#F5EEE1] text-[#1F3D2B] rounded-xl text-sm font-medium hover:bg-[#D4AF37] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>عرض على الخرائط الكاملة</span>
              </button>
            </div>
          </>
        )}

        {selectedTab === 'gallery' && (
          <div className="space-y-4">
            {/* Main Image Carousel */}
            {galleryImages.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h2 className="text-lg font-bold text-[#1F3D2B] mb-4">صور النشاط</h2>
                
                <div className="relative">
                  <div className="relative h-64 bg-[#F5EEE1] rounded-xl overflow-hidden">
                    <ImageWithFallback
                      src={galleryImages[currentImageIndex]}
                      alt={`صورة ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-[#1F3D2B]" />
                      </button>
                      
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-[#1F3D2B]" />
                      </button>
                    </>
                  )}
                  
                  <div className="absolute bottom-3 right-1/2 translate-x-1/2 flex gap-2">
                    {galleryImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? 'w-6 bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Thumbnails */}
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        idx === currentImageIndex ? 'border-[#D4AF37]' : 'border-transparent'
                      }`}
                    >
                      <ImageWithFallback src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Video Section */}
            {videoUrl && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h2 className="text-lg font-bold text-[#1F3D2B] mb-4">فيديو تعريفي</h2>
                
                <div className="relative h-48 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="w-12 h-12 mx-auto mb-2" />
                      <div className="text-sm">فيديو تعريفي بالنشاط</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'reviews' && (
          <div className="space-y-4">
            {/* Rating Summary */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#D4AF37] mb-1">{rating.toFixed(1)}</div>
                  <div className="flex mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C8A86A] text-[#C8A86A]" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">{reviewCount} تقييم</div>
                </div>
                
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const percentage = Math.random() * 100; // Mock data
                    return (
                      <div key={stars} className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600 w-3">{stars}</span>
                        <Star className="w-3 h-3 fill-[#C8A86A] text-[#C8A86A]" />
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C8A86A] rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#D4AF37] font-semibold">{review.userName.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-[#1F3D2B]">{review.userName}</h4>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-[#C8A86A] text-[#C8A86A]' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Related Providers */}
        {relatedProviders.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-bold text-[#1F3D2B] mb-4">خدمات مشابهة قريبة</h2>
            
            <div className="space-y-3">
              {relatedProviders.map((provider) => (
                <button
                  key={provider.id}
                  className="w-full flex items-center justify-between p-3 bg-[#F5EEE1] rounded-xl hover:bg-[#D4AF37]/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#1F3D2B] flex items-center justify-center text-white font-bold">
                      {provider.name.charAt(0)}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[#1F3D2B] text-sm">{provider.name}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>⭐ {provider.rating.toFixed(1)}</span>
                        <span>•</span>
                        <span>{provider.distance.toFixed(1)} كم</span>
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ====================================
// 📦 Export Types
// ====================================

export type { ProviderMapPageProps };