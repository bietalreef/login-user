/**
 * ProfilePreview.tsx — معاينة الملف الشخصي لكل داشبورد
 * ═══════════════════════════════════════════════════════════
 * يعرض كيف سيبدو الملف الشخصي للمستخدم في نوع النشاط
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Star, Heart, Share2, CheckCircle, Phone, MessageCircle,
  Calendar, Clock, MapPin, Award, Users, TrendingUp, ChevronRight,
  X, ShoppingCart, Sparkles
} from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';
import { PROFILE_PREVIEWS, type ProfilePreviewData } from './profilePreviewData';

interface ProfilePreviewProps {
  dashboardId: string;
  onBack: () => void;
}

export function ProfilePreview({ dashboardId, onBack }: ProfilePreviewProps) {
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const fontCairo = 'Cairo, sans-serif';
  
  const [activeTab, setActiveTab] = useState<'info' | 'services' | 'gallery' | 'reviews'>('info');
  const [showServiceDetail, setShowServiceDetail] = useState<any>(null);
  
  const profile = PROFILE_PREVIEWS[dashboardId];
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F5EEE1] flex items-center justify-center">
        <p className="text-gray-500">ملف غير متوفر</p>
      </div>
    );
  }

  const tabs = [
    { id: 'info', label_ar: 'معلومات النشاط', label_en: 'Activity Info' },
    { id: 'services', label_ar: 'المتجر', label_en: 'Services' },
    { id: 'gallery', label_ar: 'معرض الصور', label_en: 'Gallery' },
    { id: 'reviews', label_ar: 'التقييمات', label_en: 'Reviews' }
  ];

  return (
    <div className="min-h-screen bg-[#F5EEE1] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/60">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
          </button>
          
          <h1 className="text-base font-bold text-[#1A1A1A]" style={{ fontFamily: fontCairo }}>
            {isEn ? 'Profile Preview' : 'معاينة الملف الشخصي'}
          </h1>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white px-5 py-6 border-b border-gray-100">
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0"
            style={{ background: profile.avatarBg }}
          >
            {profile.avatar}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-[#1A1A1A] truncate" style={{ fontFamily: fontCairo }}>
                {isEn ? profile.businessName_en : profile.businessName_ar}
              </h2>
              {profile.verified && (
                <CheckCircle className="w-5 h-5 text-[#2AA676] flex-shrink-0" fill="#2AA676" />
              )}
            </div>
            
            <p className="text-xs text-[#3B5BFE] mb-2" style={{ fontFamily: fontCairo }}>
              ID: {profile.profileId}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#FFD700]/10 px-2 py-1 rounded-lg">
                <span className="text-base font-bold text-[#1A1A1A]" style={{ fontFamily: fontCairo }}>
                  {profile.rating}
                </span>
                <Star className="w-4 h-4 text-[#FFD700]" fill="#FFD700" />
              </div>
              <span className="text-xs text-gray-500" style={{ fontFamily: fontCairo }}>
                ({profile.reviewCount} {isEn ? 'reviews' : 'تقييم'})
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {profile.stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-50 rounded-2xl p-3 text-center"
              >
                <div
                  className="w-8 h-8 rounded-xl mx-auto mb-1.5 flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <p className="text-base font-bold text-[#1A1A1A] mb-0.5" style={{ fontFamily: fontCairo }}>
                  {stat.value}
                </p>
                <p className="text-[10px] text-gray-500 leading-tight" style={{ fontFamily: fontCairo }}>
                  {isEn ? stat.label_en : stat.label_ar}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Response Time */}
        <div className="bg-blue-50 rounded-2xl p-3 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-[#3B5BFE]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-0.5" style={{ fontFamily: fontCairo }}>
              {isEn ? 'Response Time' : 'وقت الاستجابة'}
            </p>
            <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: fontCairo }}>
              {isEn ? profile.responseTime_en : profile.responseTime_ar}
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 gap-2 mb-2">
          <button className="bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all">
            <Calendar className="w-4 h-4" />
            {isEn ? 'Request Service Now' : 'طلب خدمة الآن'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button className="bg-[#25D366] text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all">
            <MessageCircle className="w-4 h-4" />
            {isEn ? 'WhatsApp' : 'واتساب'}
          </button>
          <button className="bg-[#3B5BFE] text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all">
            <Phone className="w-4 h-4" />
            {isEn ? 'Call' : 'اتصال'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-[60px] z-40">
        <div className="flex overflow-x-auto hide-scrollbar px-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-bold transition-all relative ${
                activeTab === tab.id
                  ? 'text-[#2AA676]'
                  : 'text-gray-400'
              }`}
              style={{ fontFamily: fontCairo }}
            >
              {isEn ? tab.label_en : tab.label_ar}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2AA676]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          {activeTab === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <InfoTab profile={profile} isEn={isEn} />
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ServicesTab 
                profile={profile} 
                isEn={isEn} 
                onServiceClick={setShowServiceDetail} 
              />
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <GalleryTab isEn={isEn} />
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ReviewsTab profile={profile} isEn={isEn} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {showServiceDetail && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowServiceDetail(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[70vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1A1A1A]" style={{ fontFamily: fontCairo }}>
                  {isEn ? showServiceDetail.name_en : showServiceDetail.name_ar}
                </h3>
                <button
                  onClick={() => setShowServiceDetail(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="p-5">
                <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: fontCairo }}>
                    {isEn ? 'Price' : 'السعر'}
                  </p>
                  <p className="text-xl font-bold text-[#2AA676]" style={{ fontFamily: fontCairo }}>
                    {showServiceDetail.price}
                  </p>
                </div>
                <button className="w-full bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white py-3.5 rounded-2xl font-bold hover:shadow-xl transition-all">
                  {isEn ? 'Book Now' : 'احجز الآن'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Info Tab
// ═══════════════════════════════════════════════════════════

function InfoTab({ profile, isEn }: { profile: ProfilePreviewData; isEn: boolean }) {
  const fontCairo = 'Cairo, sans-serif';
  
  return (
    <div className="space-y-4">
      {/* About */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <h3 className="text-sm font-bold text-[#1A1A1A] mb-2 flex items-center gap-2" style={{ fontFamily: fontCairo }}>
          <Sparkles className="w-4 h-4 text-[#2AA676]" />
          {isEn ? 'About' : 'نبذة'}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: fontCairo }}>
          {isEn ? profile.about_en : profile.about_ar}
        </p>
      </div>

      {/* Specialties */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <h3 className="text-sm font-bold text-[#1A1A1A] mb-3" style={{ fontFamily: fontCairo }}>
          {isEn ? 'Specialties' : 'التخصصات'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {(isEn ? profile.specialties_en : profile.specialties_ar).map((specialty, idx) => (
            <span
              key={idx}
              className="bg-[#2AA676]/10 text-[#2AA676] px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ fontFamily: fontCairo }}
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {/* Business Data */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
        <h3 className="text-sm font-bold text-[#1A1A1A] mb-3 flex items-center gap-2" style={{ fontFamily: fontCairo }}>
          <Award className="w-4 h-4 text-[#3B5BFE]" />
          {isEn ? 'Business Data' : 'بيانات تجارية'}
        </h3>
        <div className="space-y-2">
          {profile.licenseNumber && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500" style={{ fontFamily: fontCairo }}>
                {isEn ? 'License' : 'الرخصة'}
              </span>
              <span className="text-xs font-bold text-[#1A1A1A]" style={{ fontFamily: fontCairo }}>
                {profile.licenseNumber}
              </span>
            </div>
          )}
          {profile.established && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Established' : 'التأسيس'}
              </span>
              <span className="text-xs font-bold text-[#1A1A1A]" style={{ fontFamily: fontCairo }}>
                {profile.established}
              </span>
            </div>
          )}
          {profile.employees && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Employees' : 'الموظفين'}
              </span>
              <span className="text-xs font-bold text-[#1A1A1A]" style={{ fontFamily: fontCairo }}>
                {profile.employees}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Working Hours & Location */}
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#3B5BFE] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: fontCairo }}>
              {isEn ? 'Working Hours' : 'ساعات العمل'}
            </p>
            <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: fontCairo }}>
              {isEn ? profile.workingHours_en : profile.workingHours_ar}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#2AA676] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: fontCairo }}>
              {isEn ? 'Location' : 'الموقع'}
            </p>
            <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: fontCairo }}>
              {isEn ? profile.location_en : profile.location_ar}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Services Tab
// ═══════════════════════════════════════════════════════════

function ServicesTab({ 
  profile, 
  isEn, 
  onServiceClick 
}: { 
  profile: ProfilePreviewData; 
  isEn: boolean;
  onServiceClick: (service: any) => void;
}) {
  const fontCairo = 'Cairo, sans-serif';
  
  return (
    <div className="space-y-3">
      {profile.services.map((service, idx) => {
        const Icon = service.icon;
        return (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onServiceClick(service)}
            className="w-full bg-white rounded-2xl p-4 border border-gray-100 hover:border-[#2AA676] hover:shadow-md transition-all text-right"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#2AA676]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-[#2AA676]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[#1A1A1A] mb-1 truncate" style={{ fontFamily: fontCairo }}>
                  {isEn ? service.name_en : service.name_ar}
                </h4>
                <p className="text-xs text-[#2AA676] font-bold" style={{ fontFamily: fontCairo }}>
                  {service.price}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Gallery Tab
// ═══════════════════════════════════════════════════════════

function GalleryTab({ isEn }: { isEn: boolean }) {
  const fontCairo = 'Cairo, sans-serif';
  
  // صور وهمية للديمو
  const demoImages = Array(9).fill(null).map((_, i) => ({
    id: i + 1,
    color: ['#3B5BFE', '#2AA676', '#C8A86A', '#8B5CF6', '#EC4899', '#F59E0B'][i % 6]
  }));
  
  return (
    <div>
      <p className="text-center text-gray-400 text-sm mb-4" style={{ fontFamily: fontCairo }}>
        {isEn ? 'Demo gallery - Add your own images' : 'معرض تجريبي - أضف صورك الخاصة'}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {demoImages.map((img) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: img.id * 0.05 }}
            className="aspect-square rounded-2xl"
            style={{ background: `linear-gradient(135deg, ${img.color}40, ${img.color}20)` }}
          />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Reviews Tab
// ═══════════════════════════════════════════════════════════

function ReviewsTab({ profile, isEn }: { profile: ProfilePreviewData; isEn: boolean }) {
  const fontCairo = 'Cairo, sans-serif';
  
  return (
    <div className="space-y-3">
      {profile.reviews.map((review, idx) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white rounded-2xl p-4 border border-gray-100"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3B5BFE] to-[#2AA676] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {review.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: fontCairo }}>
                {isEn ? review.name_en : review.name_ar}
              </h4>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array(review.rating).fill(null).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-[#FFD700]" fill="#FFD700" />
                  ))}
                </div>
                <span className="text-xs text-gray-400" style={{ fontFamily: fontCairo }}>
                  {review.date}
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: fontCairo }}>
            {isEn ? review.comment_en : review.comment_ar}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
