import { useState } from 'react';
import { ArrowLeft, Star, Heart, Share2, ChevronDown, BookOpen, AlertCircle, Check } from 'lucide-react';
import { NewTopHeader } from './NewTopHeader';
import { IDCopyBox } from './IDCopyBox';
import { ServiceSEOHead } from '../SEOHead';
import { ProvidersTabContent } from './ProviderProfileCard';
import { useTheme } from '../../contexts/ThemeContext';
import { SmartCTA } from '../ui/SmartCTA';

interface Provider {
  id: number;
  userId: string;
  name: string;
  nameEn: string;
  rating: number;
  reviews: number;
  projects: number;
  location: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ServiceDetailTemplateProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
  serviceId: string;
  serviceName: string;
  serviceNameEn: string;
  serviceIcon: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  providerCount: number;
  description: string;
  heroImage: string;
  mainDescription: string;
  importantNote?: string;
  features: string[];
  providers: Provider[];
  faqs: FAQ[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

/**
 * ServiceDetailTemplate - Unified template for all service detail pages
 * Based on original design with hero image, floating info card, and tabs
 */
export function ServiceDetailTemplate({
  onBack,
  onNavigate,
  serviceId,
  serviceName,
  serviceNameEn,
  serviceIcon,
  priceRange,
  rating,
  reviewCount,
  providerCount,
  description,
  heroImage,
  mainDescription,
  importantNote,
  features,
  providers,
  faqs,
  seoTitle,
  seoDescription,
  seoKeywords
}: ServiceDetailTemplateProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'providers' | 'reviews'>('details');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // SEO Data
  const seoData = {
    title: seoTitle,
    description: seoDescription,
    serviceId: serviceId,
    serviceName: serviceName,
    serviceType: `خدمات ${serviceName}`,
    priceRange: priceRange,
    rating: rating,
    reviewCount: reviewCount,
    imageUrl: heroImage,
    keywords: seoKeywords,
    faqs: faqs,
    providerCount: providerCount,
    projectCount: reviewCount
  };

  return (
    <div className="min-h-screen bg-[#F5EEE1] pb-20" dir="rtl">
      {/* SEO Head */}
      <ServiceSEOHead {...seoData} />

      {/* Top Header */}
      <NewTopHeader onNavigate={onNavigate} />

      {/* Hero Section with Image */}
      <div className="relative h-[45vh] min-h-[300px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-[#1F3D2B]" />
        </button>

        {/* Service Info Card - Floating */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-white/50">
            {/* Title & Icon */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[#1F3D2B] mb-1">
                  {serviceName}
                </h1>
                <p className="text-sm text-gray-600">{serviceNameEn}</p>
              </div>
              <div className="text-5xl ml-3">{serviceIcon}</div>
            </div>

            {/* Service ID - Copyable */}
            <div className="mb-3">
              <IDCopyBox 
                id={serviceId} 
                label="ID:"
                size="sm"
              />
            </div>

            {/* Price & Rating */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-0.5">السعر المتوقع</div>
                <div className="text-lg font-bold text-[#D4AF37]">
                  {priceRange}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-[#C8A86A] text-[#C8A86A]" />
                <span className="text-lg font-bold text-[#1F3D2B]">{rating}</span>
                <span className="text-sm text-gray-500">({reviewCount.toLocaleString()})</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SmartCTA context="book" variant="compact" isEn={false} fullWidth showSubtext={false} />
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3.5 rounded-2xl border-2 transition-all ${
                  isFavorite
                    ? 'bg-red-50 border-red-500 text-red-500'
                    : 'bg-white border-gray-200 text-gray-400 hover:border-red-300'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500' : ''}`} />
              </button>
              <button className="p-3.5 rounded-2xl bg-white border-2 border-gray-200 text-gray-600 hover:border-[#3B5BFE] transition-all">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex">
            {(['details', 'providers', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 font-semibold transition-all relative ${
                  activeTab === tab
                    ? 'text-[#3B5BFE] border-b-4 border-[#3B5BFE]'
                    : 'text-gray-500 hover:text-[#1F3D2B]'
                }`}
              >
                {tab === 'details' && 'تفاصيل الخدمة'}
                {tab === 'providers' && `المزودون (${providers.length})`}
                {tab === 'reviews' && `التقييمات (${reviewCount.toLocaleString()})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 space-y-4">
        {activeTab === 'details' && (
          <>
            {/* الشرح والتعريف */}
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-[#3B5BFE] to-[#1F3D2B] p-3 rounded-2xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#1F3D2B]">الشرح والتعريف</h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>{mainDescription}</p>
              </div>

              {/* Important Note */}
              {importantNote && (
                <div className="mt-5 bg-gradient-to-l from-amber-50 to-orange-50 border-r-4 border-amber-500 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900 mb-1">⚠️ هل تعلم؟</p>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        {importantNote}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ما تتضمنه الخدمة */}
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-[#1F3D2B] mb-4">✅ ما تتضمنه خدمة {serviceName}</h3>
              <div className="grid grid-cols-1 gap-3">
                {features.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-[#1F3D2B] mb-4">❓ أسئلة شائعة</h3>
              <div className="space-y-2">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-right hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-[#1F3D2B] flex-1">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#D4AF37] transition-transform flex-shrink-0 mr-3 ${
                          expandedFAQ === idx ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedFAQ === idx && (
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'providers' && (
          <ProvidersTabContent providers={providers} />
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm text-center">
            <div className="text-6xl font-bold text-[#3B5BFE] mb-2">{rating}</div>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-[#C8A86A] text-[#C8A86A]" />
              ))}
            </div>
            <p className="text-gray-500">{reviewCount.toLocaleString()} تقييم</p>
            <p className="text-sm text-gray-400 mt-2">من {providerCount} مزود معتمد</p>
          </div>
        )}
      </div>

    </div>
  );
}