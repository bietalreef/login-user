import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { Star, Heart, CheckCircle, Users, Sparkles, Droplets, BookOpen, Info, Target, ChevronLeft, Share2, Send, AlertTriangle, MessageCircle, MapPin, Copy, Check, Wrench, Search, ShieldAlert, Calendar, Droplet } from 'lucide-react';
// ShowerHead not available in this lucide version — using Droplet as alias
const ShowerHead = Droplet;
import { BietAlreefLogo } from '../BietAlreefLogo';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ServiceSEOHead } from '../SEOHead';
import { usePermissionGuard } from '../../hooks/usePermissionGuard';
import { AccessModal } from '../ui/AccessModal';
import { IDCopyBox } from './IDCopyBox';
import { ProvidersTabContent } from './ProviderProfileCard';
import { PlatformShowcaseBanner } from './PlatformShowcaseBanner';
import { Icon3D } from '../ui/Icon3D';

interface ServiceDetailPlumbingProps {
  onBack: () => void;
  onOpenSearch?: () => void;
}

export function ServiceDetailPlumbing({ onBack, onOpenSearch }: ServiceDetailPlumbingProps) {
  // ✅ PROOF: Plumbing Service page updated - Version 4.0 with Strict Security
  console.log("Plumbing Service - SECURED v4.0 - " + new Date().toISOString());
  
  const { guard, modalState, closeModal } = usePermissionGuard();
  
  const [activeTab, setActiveTab] = useState<'details' | 'providers' | 'reviews'>('details');
  const [serviceNavTab, setServiceNavTab] = useState<'home' | 'projects' | 'maps' | 'recommend' | 'offers'>('home');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, name: '', comment: '' });
  const [newComplaint, setNewComplaint] = useState({ 
    name: '', 
    userId: '', 
    complaintType: 'provider', 
    subject: '', 
    message: '' 
  });

  const handleSearchClick = () => {
    if (onOpenSearch) {
      onOpenSearch();
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText('SRV-PLUMB-001');
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleBookNow = () => {
      guard('create_project', 'حجز خدمة السباكة', () => {
          toast.success('تم بدء إجراءات الحجز');
          // Navigate to booking flow
      });
  };

  const handleContactProvider = (providerName: string) => {
      guard('contact_providers', `التواصل مع ${providerName}`, () => {
          toast.success(`جاري الاتصال بـ ${providerName}`);
          // Open chat or show phone
      });
  };

  // SEO Data
  const seoData = {
    title: 'خدمات السباكة في الإمارات | سباك معتمد | بيت الريف - إصلاح تسريبات وأعمال سباكة دبي أبوظبي',
    description: 'أفضل خدمات السباكة في الإمارات. 312 سباك معتمد. إصلاح تسريبات، تركيب أدوات صحية، تسليك مجاري. خدمة 24/7. أسعار منافسة. احجز الآن!',
    serviceId: 'SRV-PLUMB-001',
    serviceName: 'السباكة وأعمال المياه',
    serviceType: 'خدمات السباكة وأعمال المياه والصرف',
    priceRange: '150 - 600 د.إ',
    rating: 4.8,
    reviewCount: 4123,
    imageUrl: 'https://images.unsplash.com/photo-1750749761538-3aea36066a4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    keywords: [
      'سباك في الإمارات',
      'سباك دبي',
      'سباك أبوظبي',
      'إصلاح تسريبات',
      'تسليك مجاري',
      'سباك معتمد',
      'فني سباكة',
      'تركيب أدوات صحية',
      'كشف تسريبات',
      'سباك طوارئ',
      'صيانة سباكة',
      'بيت الريف سباكة'
    ],
    faqs: [
      {
        question: 'كم تكلفة إصلاح تسريب المياه؟',
        answer: 'تكلفة إصلاح التسريب البسيط تتراوح من 150-300 درهم. التسريبات الكبيرة أو المخفية قد تحتاج كشف إلكتروني وتكلف 400-600 درهم شاملة الإصلاح.'
      },
      {
        question: 'هل تتوفر خدمة سباك طوارئ 24/7؟',
        answer: 'نعم، نوفر خدمة سباك طوارئ على مدار الساعة. الفني يصل خلال 30-60 دقيقة في حالات الطوارئ مثل التسريبات الكبيرة أو انسداد المجاري.'
      },
      {
        question: 'كم يستغرق تركيب حوض أو مغسلة؟',
        answer: 'تركيب حوض أو مغسلة عادي يستغرق 30-60 دقيقة. التركيبات الأكثر تعقيداً مثل الجاكوزي أو الدش المطري قد تحتاج 2-3 ساعات.'
      },
      {
        question: 'كيف أعرف إذا عندي تسريب مخفي؟',
        answer: 'علامات التسريب المخفي: ارتفاع فاتورة المياه، بقع رطوبة على الجدران أو الأسقف، رائحة عفن، صوت مياه جارية. نوفر خدمة كشف تسريبات إلكتروني دقيق.'
      },
      {
        question: 'ما هي مدة الضمان على الأعمال؟',
        answer: 'نقدم ضمان 6 أشهر على أعمال الإصلاح، وسنة على التركيبات الجديدة. الضمان يشمل الزيارات المجانية وإعادة الإصلاح إن لزم الأمر.'
      }
    ],
    providerCount: 312,
    projectCount: 15789
  };
  
  const topProviders = [
    {
      id: 'BR-PLB-001',
      name: 'مركز السباكة المتقدم',
      rating: 4.9,
      reviews: 712,
      price: '280',
      distance: '1.2 كم',
      availability: 'online',
      responseTime: '5 دقائق',
      projectsCount: 1234,
      image: 'https://images.unsplash.com/photo-1635221798248-8a3452ad07cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialties: ['تسريبات', 'تسليك', 'تركيب']
    },
    {
      id: 'BR-PLB-002',
      name: 'شركة المياه الشاملة',
      rating: 4.8,
      reviews: 589,
      price: '250',
      distance: '2.0 كم',
      availability: 'online',
      responseTime: '10 دقائق',
      projectsCount: 987,
      image: 'https://images.unsplash.com/photo-1560072362-53f3810f8b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialties: ['صيانة', 'فلاتر', 'سخانات']
    },
    {
      id: 'BR-PLB-003',
      name: 'فني السباكة الخبير',
      rating: 5.0,
      reviews: 445,
      price: '320',
      distance: '2.7 كم',
      availability: 'busy',
      responseTime: '20 دقيقة',
      projectsCount: 756,
      image: 'https://images.unsplash.com/photo-1748640857973-93524ef0fe7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialties: ['كشف', 'إصلاح', 'طوارئ']
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'راشد الشامسي',
      userId: 'BR-234671',
      rating: 5,
      date: 'منذ يوم',
      comment: 'سباك ممتاز! حل مشكلة التسريب بسرعة واحترافية. الأسعار معقولة والشغل نظيف جداً.',
      verified: true,
      helpful: 62
    },
    {
      id: 2,
      name: 'لطيفة المنصوري',
      userId: 'BR-345672',
      rating: 5,
      date: 'منذ 3 أيام',
      comment: 'ركب لي مغاسل ومراحيض جديدة. الشغل احترافي والفريق نظيف ومحترم.',
      verified: true,
      helpful: 41
    },
    {
      id: 3,
      name: 'ناصر العلي',
      userId: 'BR-456673',
      rating: 4,
      date: 'منذ أسبوع',
      comment: 'خدمة جيدة، حل مشكلة انسداد المجاري بسرعة. تأخر قليلاً بس النتيجة ممتازة.',
      verified: false,
      helpful: 25
    }
  ];

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-[#56CCF2]';
      case 'busy': return 'bg-[#F2994A]';
      default: return 'bg-[#6B7280]';
    }
  };

  const getAvailabilityLabel = (status: string) => {
    switch (status) {
      case 'online': return 'متاح الآن';
      case 'busy': return 'مشغول';
      default: return 'غير متاح';
    }
  };

  const handleSubmitReview = () => {
    console.log('تم إرسال التقييم:', newReview);
    setShowReviewForm(false);
    setNewReview({ rating: 5, name: '', comment: '' });
  };

  const handleSubmitComplaint = () => {
    console.log('تم إرسال الشكوى:', newComplaint);
    setShowComplaintForm(false);
    setNewComplaint({ name: '', userId: '', complaintType: 'provider', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir="rtl">
      
      {/* Access Guard Modal */}
      <AccessModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        featureName={modalState.feature}
      />

      {/* SEO Head */}
      <ServiceSEOHead {...seoData} />
      
      {/* HERO SECTION */}
      <div className="relative h-[320px]">
        <div className="absolute inset-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1750749761538-3aea36066a4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="السباكة وأعمال المياه"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>

        <button 
          onClick={onBack}
          className="absolute top-4 right-4 z-30 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-[#1A1A1A]" />
        </button>

        <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-[14px] px-3 py-2 shadow-lg">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#56CCF2]" />
              <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '12px' }}>
                312 مزود
              </span>
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-[14px] px-3 py-2 shadow-lg">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#56CCF2]" />
              <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '12px' }}>
                15,789 مشروع
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 z-20">
          <div className="bg-white rounded-[28px] p-5 shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#56CCF2] to-[#2F80ED] rounded-[18px] flex items-center justify-center shadow-lg flex-shrink-0">
                <Droplets className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '20px' }}>
                  السباكة وأعمال المياه
                </h2>
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1.5 text-[#56CCF2] text-xs mb-2 hover:text-[#2F80ED] transition-colors"
                  style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
                >
                  <span>ID: SRV-PLUMB-001</span>
                  {copiedId ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#2F80ED] text-[#2F80ED]" />
                    <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>4.8</span>
                    <span className="text-[#1A1A1A]/40 text-xs">(4,123)</span>
                  </div>
                  <div className="bg-gradient-to-r from-[#56CCF2] to-[#2F80ED] text-white px-3 py-1 rounded-full text-xs shadow-md" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                    150 - 600 د.إ
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="w-10 h-10 bg-white border-2 border-[#F5EEE1] rounded-[14px] flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95">
                <Share2 className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-10 h-10 bg-white border-2 border-[#F5EEE1] rounded-[14px] flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-[#2F80ED] text-[#2F80ED]' : 'text-[#1A1A1A]'}`} />
              </button>
              <button 
                onClick={handleBookNow}
                className="flex-1 bg-gradient-to-r from-[#56CCF2] to-[#2F80ED] text-white py-3 rounded-[16px] shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '15px' }}>
                <Sparkles className="w-4.5 h-4.5" />
                <span>احجز الآن</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-[#F5EEE1] shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 px-4 rounded-[18px] transition-all ${
              activeTab === 'details'
                ? 'bg-gradient-to-r from-[#56CCF2] to-[#2F80ED] text-white shadow-md'
                : 'bg-[#F5EEE1] text-[#1A1A1A] hover:bg-[#E8DFD0]'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
          >
            تفاصيل الخدمة
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`flex-1 py-3 px-4 rounded-[18px] transition-all ${
              activeTab === 'providers'
                ? 'bg-gradient-to-r from-[#56CCF2] to-[#2F80ED] text-white shadow-md'
                : 'bg-[#F5EEE1] text-[#1A1A1A] hover:bg-[#E8DFD0]'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
          >
            المودون
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 px-4 rounded-[18px] transition-all ${
              activeTab === 'reviews'
                ? 'bg-gradient-to-r from-[#56CCF2] to-[#2F80ED] text-white shadow-md'
                : 'bg-[#F5EEE1] text-[#1A1A1A] hover:bg-[#E8DFD0]'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
          >
            التقييمات
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-5 py-6">
        
        {/* TAB 1: تفاصيل الخدمة */}
        {activeTab === 'details' && (
          <>
            {/* القسم 1: الشرح */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#56CCF2] to-[#2F80ED] rounded-[16px] flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }}>
                  الشرح والتعريف
                </h2>
              </div>

              <div className="bg-white rounded-[24px] p-6 shadow-md mb-4">
                <h3 className="text-[#1A1A1A] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  ما هي خدمات السباكة؟
                </h3>
                <p className="text-[#1A1A1A]/70 mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '15px', lineHeight: 1.8 }}>
                  خدمات السباكة تشمل جميع أعمال المياه والصرف الصحي: إصلاح تسريبات المياه، تركيب وصيانة الأدوات الصحية، تسليك مجاري، تركيب فلاتر مياه، صيانة سخانات، تمديدات مواسير جديدة. نوفر سباكين معتمدين متاحين 24/7 لحالات الطوارئ.
                </p>
                <div className="bg-gradient-to-br from-[#56CCF2]/10 to-[#2F80ED]/10 rounded-[16px] p-4 border-2 border-[#56CCF2]/20">
                  <div className="flex items-center gap-2">
                    <Icon3D icon={Droplets} theme="cyan" size="xs" hoverable={false} />
                    <p className="text-[#1A1A1A] flex-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}>
                      <strong>هل تعلم؟</strong> تسريب صغير بحجم 1 ملم يهدر أكثر من 34 لتر ماء يومياً - أي 12,000 لتر سنوياً!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[24px] p-6 shadow-md mb-4">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  أنواع خدمات السباكة
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Droplets,
                      title: 'إصلاح التسريبات',
                      desc: 'كشف وإصلاح تسريبات المياه بأحدث الأجهزة الإلكترونية، معالجة تسريبات الحمامات والمطابخ والخزانات.',
                      tags: ['كشف تسريبات', 'إصلاح', 'عزل']
                    },
                    {
                      icon: ShowerHead,
                      title: 'التركيبات الصحية',
                      desc: 'تركيب وصيانة جميع الأدوات الصحية: مراحيض، مغاسل، دشات، بانيو، خلاطات، سخانات.',
                      tags: ['تركيب', 'صيانة', 'استبدال']
                    },
                    {
                      icon: Wrench,
                      title: 'التسليك والصيانة',
                      desc: 'تسليك مجاري ومراحيض، تنظيف بيارات، صيانة دورية للمواسير والخزانات، فحص شامل.',
                      tags: ['تسليك', 'نظيف', 'صيانة']
                    }
                  ].map((service, idx) => {
                    const Icon = service.icon;
                    return (
                      <div key={idx} className="bg-gradient-to-r from-[#F5EEE1] to-white rounded-[18px] p-5 border-2 border-[#F5EEE1]">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#56CCF2] to-[#2F80ED] rounded-[12px] flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-[#1A1A1A] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '16px' }}>
                              {service.title}
                            </h4>
                            <p className="text-[#1A1A1A]/70 mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: 1.7 }}>
                              {service.desc}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {service.tags.map((tag, i) => (
                                <span key={i} className="bg-[#56CCF2]/10 text-[#2F80ED] px-3 py-1 rounded-full text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* القسم 2: التوعية */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F2994A] to-[#EB5757] rounded-[16px] flex items-center justify-center shadow-lg">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }}>
                  التوعية والسلامة
                </h2>
              </div>

              <div className="bg-gradient-to-br from-[#F2994A]/10 to-[#EB5757]/10 rounded-[24px] p-6 shadow-md mb-4 border-2 border-[#F2994A]/30">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  علامات تحتاج سباك فوراً
                </h3>
                <div className="space-y-3">
                  {[
                    { Icon: Droplets, theme: 'blue', title: 'تسريب مياه', desc: 'تسريب مياه مستمر من الجدران أو الأسقف أو المواسير' },
                    { Icon: ShowerHead, theme: 'indigo', title: 'انسداد مجاري', desc: 'بطء تصريف المياه أو انسداد كامل للمراحيض' },
                    { Icon: AlertTriangle, theme: 'orange', title: 'ارتفاع الفاتورة', desc: 'زيادة غير مبررة في فاتورة المياه' },
                    { Icon: ShieldAlert, theme: 'red', title: 'رائحة كريهة', desc: 'رائحة صرف صحي أو عفن من البيارات أو المجاري' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-[16px] p-4 border-2 border-[#F2994A]/20">
                      <div className="flex items-start gap-3">
                        <Icon3D icon={item.Icon} theme={item.theme} size="xs" hoverable={false} />
                        <div className="flex-1">
                          <h4 className="text-[#EB5757] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '15px' }}>
                            {item.title}
                          </h4>
                          <p className="text-[#1A1A1A]/70 text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500 }}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[24px] p-6 shadow-md">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  نصائح الصيانة الوقائية
                </h3>
                <div className="space-y-3">
                  {[
                    { Icon: Search, theme: 'blue', text: 'افحص المواسير والخلاطات شهرياً - ابحث عن أي تسريبات صغيرة' },
                    { Icon: Sparkles, theme: 'teal', text: 'نظف مصافي المجاري أسبوعياً - امنع تراكم الشعر والأوساخ' },
                    { Icon: ShieldAlert, theme: 'red', text: 'لا ترمي زيوت أو دهون في المغسلة - تسبب انسداد المواسير' },
                    { Icon: Droplets, theme: 'cyan', text: 'اختبر ضغط المياه دورياً - الضغط المرتفع يتلف المواسير' },
                    { Icon: Calendar, theme: 'gold', text: 'اطلب فحص سنوي شامل - وقاية خير من علاج' }
                  ].map((tip, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#F5EEE1]/50 to-transparent rounded-[16px]">
                      <Icon3D icon={tip.Icon} theme={tip.theme} size="xs" hoverable={false} />
                      <p className="text-[#1A1A1A] flex-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}>
                        {tip.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* القسم 3: الإرشاد */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#56CCF2] to-[#2F80ED] rounded-[16px] flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }}>
                  الإرشاد والدليل
                </h2>
              </div>

              <div className="bg-white rounded-[24px] p-6 shadow-md mb-4">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  كيف تطلب ��لخدمة؟
                </h3>
                <div className="space-y-3">
                  {[
                    { step: '1', text: 'اضغط "احجز الآن" واختر نوع الخدمة', time: '30 ث' },
                    { step: '2', text: 'تصفح قائمة السباكين المعتمدين', time: '2 د' },
                    { step: '3', text: 'حدد الموعد أو اطلب خدمة طوارئ', time: '1 د' },
                    { step: '4', text: 'أكد الطلب وانتظر قبول السباك', time: '1 د' },
                    { step: '5', text: 'استقبل السباك في الموعد', time: 'حسب الموعد' },
                    { step: '6', text: 'قيّم الخدمة بعد الانتهاء', time: '1 د' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#F5EEE1] to-white rounded-[16px] border-2 border-[#F5EEE1]">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#56CCF2] to-[#2F80ED] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}>
                          {item.step}
                        </span>
                      </div>
                      <p className="flex-1 text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}>
                        {item.text}
                      </p>
                      <span className="bg-[#56CCF2]/10 text-[#2F80ED] px-3 py-1 rounded-full text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[24px] p-6 shadow-md">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  الأسئلة الشائعة
                </h3>
                <div className="space-y-3">
                  {seoData.faqs.map((faq, idx) => (
                    <details key={idx} className="bg-gradient-to-r from-[#F5EEE1] to-white rounded-[18px] p-5 shadow-sm group border-2 border-[#F5EEE1]">
                      <summary className="cursor-pointer text-[#1A1A1A] list-none flex items-center justify-between" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '15px' }}>
                        <span className="flex-1">{faq.question}</span>
                        <ChevronLeft className="w-5 h-5 transform group-open:rotate-90 transition-transform text-[#56CCF2]" />
                      </summary>
                      <p className="mt-3 text-[#1A1A1A]/70 pr-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: 1.7 }}>
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: المزودون */}
        {activeTab === 'providers' && (
          <ProvidersTabContent />
        )}

        {/* TAB 3: التقييمات */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[24px] p-6 shadow-md text-center">
              <h3 className="text-[#1A1A1A] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '24px' }}>
                4.8
              </h3>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-[#F2C94C] text-[#F2C94C]" />
                ))}
              </div>
              <p className="text-[#1A1A1A]/60 text-sm mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                بناءً على 4,123 تقييم
              </p>
              <button 
                onClick={() => setShowReviewForm(true)}
                className="w-full bg-gradient-to-r from-[#56CCF2] to-[#2F80ED] text-white py-3 rounded-[16px] shadow-md font-bold"
              >
                أضف تقييمك
              </button>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-[20px] p-5 shadow-sm border border-[#F5EEE1]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F5EEE1] rounded-full flex items-center justify-center font-bold text-[#1A1A1A]">
                        {review.name[0]}
                      </div>
                      <div>
                        <h4 className="text-[#1A1A1A] text-sm font-bold flex items-center gap-1">
                          {review.name}
                          {review.verified && <CheckCircle className="w-3 h-3 text-[#56CCF2]" />}
                        </h4>
                        <p className="text-[#1A1A1A]/40 text-xs">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-[#F2C94C] text-[#F2C94C]' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#1A1A1A]/80 text-sm leading-relaxed mb-3 font-medium">
                    {review.comment}
                  </p>
                  <button className="flex items-center gap-1 text-[#1A1A1A]/40 text-xs hover:text-[#56CCF2]">
                    <MessageCircle className="w-3 h-3" />
                    <span>مفيد ({review.helpful})</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-8" />
      <PlatformShowcaseBanner variant="mini" className="pb-6" />
    </div>
  );
}