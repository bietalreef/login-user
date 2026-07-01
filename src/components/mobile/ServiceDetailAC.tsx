import { useState } from 'react';
import { Star, Heart, CheckCircle, Users, Sparkles, Snowflake, BookOpen, Info, Target, ChevronLeft, Share2, Send, AlertTriangle, MessageCircle, MapPin, Copy, Check, Wind, Droplet, Volume2, Zap, Search, Flame } from 'lucide-react';
import { BietAlreefLogo } from '../BietAlreefLogo';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ServiceSEOHead } from '../SEOHead';
import { IDCopyBox } from './IDCopyBox';
import { ProvidersTabContent } from './ProviderProfileCard';
import { PlatformShowcaseBanner } from './PlatformShowcaseBanner';
import { Icon3D } from '../ui/Icon3D';

interface ServiceDetailACProps {
  onBack: () => void;
  onOpenSearch?: () => void;
}

export function ServiceDetailAC({ onBack, onOpenSearch }: ServiceDetailACProps) {
  // ✅ PROOF: AC Service page updated - Version 3.0
  console.log("AC Service - UPDATED v3.0 - " + new Date().toISOString());
  
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
    navigator.clipboard.writeText('SRV-AC-001');
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // SEO Data
  const seoData = {
    title: 'خدمات التكييف والتبريد في الإمارات | فني تكييف معتمد | بيت الريف - تركيب وصيانة مكيفات دبي أبوظبي',
    description: 'أفضل خدمات التكييف والتبريد في الإمارات. 234 فني تكييف معتمد. تركيب، صيانة، إصلاح جميع أنواع المكيفات. خدمة 24/7. أسعار منافسة. احجز الآن!',
    serviceId: 'SRV-AC-001',
    serviceName: 'التكييف والتبريد',
    serviceType: 'خدمات التكييف والتبريد',
    priceRange: '180 - 800 د.إ',
    rating: 4.8,
    reviewCount: 3456,
    imageUrl: 'https://images.unsplash.com/photo-1545280405-f06710f1779d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    keywords: [
      'تكييف في الإمارات',
      'فني تكييف دبي',
      'صيانة مكيفات',
      'تركيب مكيفات',
      'تنظيف مكيفات',
      'إصلاح كيفات',
      'مكيف سبليت',
      'مكيف مركزي',
      'شحن فريون',
      'فني تكييف معتمد',
      'صيانة تكييف 24 ساعة',
      'بيت الريف تكييف'
    ],
    faqs: [
      {
        question: 'كم تكلفة صيانة المكيف؟',
        answer: 'صيانة المكيف العادية تتراوح من 150-250 درهم، تشمل التنظيف وفحص الفلتر والفريون. الصيانة الشاملة مع شحن فريون قد تصل 400-600 درهم.'
      },
      {
        question: 'متى يجب صيانة المكيف؟',
        answer: 'يُنصح بصيانة المكيف كل 3-6 أشهر حسب الاستخدام. في الصيف يفضل كل 3 أشهر، وفي الشتاء كل 6 أشهر. الصيانة الدورية تزيد كفاءة التبريد وتوفر الكهرباء.'
      },
      {
        question: 'هل تتوفر خدمة صيانة طوارئ؟',
        answer: 'نعم، نوفر خدمة صيانة طوارئ على مدار الساعة. الفني يصل خلال 30-60 دقيقة في حالات الطوارئ مثل توقف التبريد الكامل أو التسريبات.'
      },
      {
        question: 'كم يستغرق تركيب مكيف جديد؟',
        answer: 'تركيب مكيف سبليت عادي يستغرق 2-4 ساعات. المكيفات الأكبر أو المركزية قد تحتاج يوم عمل كامل. يشمل التركيب الفحص الكامل والضمان.'
      },
      {
        question: 'ما هي مدة الضمان؟',
        answer: 'نقدم ضمان سنة على أعمال التركيب والصيانة، وسنتين على قطع الغيار الأصلية. الضمان يشمل الزيارات المجانية في حال وجود أي مشاكل.'
      }
    ],
    providerCount: 234,
    projectCount: 12567
  };
  
  const topProviders = [
    {
      id: 'BR-AC-001',
      name: 'مركز التكييف المتقدم',
      rating: 4.9,
      reviews: 567,
      price: '220',
      distance: '1.8 كم',
      availability: 'online',
      responseTime: '8 دقائق',
      projectsCount: 890,
      image: 'https://images.unsplash.com/photo-1659353587484-a83a0ddf8aca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialties: ['سبليت', 'مركزي', 'صيانة']
    },
    {
      id: 'BR-AC-002',
      name: 'شركة التبريد الشامل',
      rating: 4.8,
      reviews: 423,
      price: '250',
      distance: '2.4 كم',
      availability: 'online',
      responseTime: '12 دقيقة',
      projectsCount: 674,
      image: 'https://images.unsplash.com/photo-1675869940341-d495d49010b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialties: ['تركيب', 'إصلاح', 'تنظيف']
    },
    {
      id: 'BR-AC-003',
      name: 'فني التكييف الخبير',
      rating: 5.0,
      reviews: 398,
      price: '280',
      distance: '3.1 كم',
      availability: 'busy',
      responseTime: '25 دقيقة',
      projectsCount: 532,
      image: 'https://images.unsplash.com/photo-1560072362-53f3810f8b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialties: ['فريون', 'كمبروسر', 'طوارئ']
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'عبدالله الشامسي',
      userId: 'BR-234891',
      rating: 5,
      date: 'منذ يومين',
      comment: 'فني محترف! نظف المكيفات كلها وشحن فريون. البرودة صارت ممتازة والأسعار معقولة جداً.',
      verified: true,
      helpful: 54
    },
    {
      id: 2,
      name: 'مريم المنصوري',
      userId: 'BR-345892',
      rating: 5,
      date: 'منذ 4 أيام',
      comment: 'ركبوا لي مكيفات جديدة في كل البيت. الشغل نظيف والفريق سريع ومحترف.',
      verified: true,
      helpful: 38
    },
    {
      id: 3,
      name: 'سعيد العلي',
      userId: 'BR-456893',
      rating: 4,
      date: 'منذ أسبوع',
      comment: 'خدمة جيدة وأسعار مناسبة. التكييف شغّال زين لكن كان في تأخير بسيط بالموعد.',
      verified: false,
      helpful: 22
    }
  ];

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-[#4A90E2]';
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
      
      {/* SEO Head */}
      <ServiceSEOHead {...seoData} />
      
      {/* HERO SECTION */}
      <div className="relative h-[320px]">
        <div className="absolute inset-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1545280405-f06710f1779d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="التكييف والتبريد"
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
              <Users className="w-3.5 h-3.5 text-[#4A90E2]" />
              <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '12px' }}>
                234 مزود
              </span>
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-[14px] px-3 py-2 shadow-lg">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#4A90E2]" />
              <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '12px' }}>
                12,567 مشروع
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 z-20">
          <div className="bg-white rounded-[28px] p-5 shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[18px] flex items-center justify-center shadow-lg flex-shrink-0">
                <Snowflake className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '20px' }}>
                  التكييف والتبريد
                </h2>
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1.5 text-[#4A90E2] text-xs mb-2 hover:text-[#2E5F8D] transition-colors"
                  style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
                >
                  <span>ID: SRV-AC-001</span>
                  {copiedId ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#56CCF2] text-[#56CCF2]" />
                    <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>4.8</span>
                    <span className="text-[#1A1A1A]/40 text-xs">(3,456)</span>
                  </div>
                  <div className="bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white px-3 py-1 rounded-full text-xs shadow-md" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                    180 - 800 د.إ
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
                <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-[#56CCF2] text-[#56CCF2]' : 'text-[#1A1A1A]'}`} />
              </button>
              <button className="flex-1 bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white py-3 rounded-[16px] shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '15px' }}>
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
                ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white shadow-md'
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
                ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white shadow-md'
                : 'bg-[#F5EEE1] text-[#1A1A1A] hover:bg-[#E8DFD0]'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
          >
            المزودون
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 px-4 rounded-[18px] transition-all ${
              activeTab === 'reviews'
                ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white shadow-md'
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
                <div className="w-12 h-12 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[16px] flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }}>
                  الشرح والتعريف
                </h2>
              </div>

              <div className="bg-white rounded-[24px] p-6 shadow-md mb-4">
                <h3 className="text-[#1A1A1A] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  ما هي خدمات التكييف والتبريد؟
                </h3>
                <p className="text-[#1A1A1A]/70 mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '15px', lineHeight: 1.8 }}>
                  خدمات التكييف والتبريد تشمل تركيب وصيانة وإصلاح جميع أنواع المكيفات: المكيفات المركزية، السبليت، الشباك، الدولابي، الكاسيت. نوفر فنيين معتمدين لتنظيف وصيانة دورية، إصلاح الأعطال، شحن الفريون، ركيب وحدات جديدة.
                </p>
                <div className="bg-gradient-to-br from-[#4A90E2]/10 to-[#56CCF2]/10 rounded-[16px] p-4 border-2 border-[#4A90E2]/20">
                  <div className="flex items-center gap-2">
                    <Icon3D icon={Snowflake} theme="cyan" size="xs" hoverable={false} />
                    <p className="text-[#1A1A1A] flex-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}>
                      <strong>هل تعلم؟</strong> الصيانة الدورية للمكيفات كل 3-6 أشهر تزيد كفاءة التبريد 30% وتوفر استهلاك الكهرباء 25%!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[24px] p-6 shadow-md mb-4">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  أنواع خدمات التكييف
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Snowflake,
                      title: 'تركيب المكيفات',
                      desc: 'تركيب مكيفات جديدة بجميع الأنواع: سبليت، مركزي، شباك، كاسيت. مع ضمان على التركيب والأداء.',
                      tags: ['سبليت', 'مركزي', 'شباك']
                    },
                    {
                      icon: Wind,
                      title: 'الصيانة والتنظيف',
                      desc: 'تنظيف عميق للفلاتر والوحدات، فحص الفريون، صيانة الكمبروسر، معالجة التسريبات.',
                      tags: ['تنظيف', 'فحص', 'صيانة دورية']
                    },
                    {
                      icon: Flame,
                      title: 'الإصلاح والطوارئ',
                      desc: 'إصلاح جميع الأعطال، شحن فريون، استبدال قطع غيار، خدمة طوارئ 24/7.',
                      tags: ['إصلاح', 'فريون', 'طوارئ']
                    }
                  ].map((service, idx) => {
                    const Icon = service.icon;
                    return (
                      <div key={idx} className="bg-gradient-to-r from-[#F5EEE1] to-white rounded-[18px] p-5 border-2 border-[#F5EEE1]">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[12px] flex items-center justify-center flex-shrink-0">
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
                                <span key={i} className="bg-[#4A90E2]/10 text-[#4A90E2] px-3 py-1 rounded-full text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
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
                  علامات تحتاج صيانة فورية
                </h3>
                <div className="space-y-3">
                  {[
                    { Icon: Flame, theme: 'orange', title: 'ضعف التبريد', desc: 'المكيف يعمل لكن التبريد ضعيف أو الهواء غير بارد' },
                    { Icon: Droplet, theme: 'blue', title: 'تسريب ماء', desc: 'تسريب ماء من الوحدة الداخلية أو الخارجية' },
                    { Icon: Volume2, theme: 'red', title: 'أصوات غريبة', desc: 'أصوات طقطقة أو صفير أو اهتزاز غير طبيعي' },
                    { Icon: Zap, theme: 'amber', title: 'ارتفاع الفاتورة', desc: 'زيادة استهلاك الكهرباء بشكل ملحوظ' }
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
                  نصائح الصيانة الدورية
                </h3>
                <div className="space-y-3">
                  {[
                    { Icon: Wind, theme: 'cyan', text: 'نظف الفلاتر كل أسبوعين - يحسن كفاءة التبريد ويوفر الطاقة' },
                    { Icon: Search, theme: 'indigo', text: 'افحص الوحدة الخارجية شهرياً - تأكد من عدم وجود أوساخ' },
                    { Icon: Snowflake, theme: 'blue', text: 'اطلب صيانة شاملة كل 3-6 أشهر من فني معتمد' },
                    { Icon: Flame, theme: 'orange', text: 'اضبط الحرارة على 24 درجة - التوازن المثالي بين الراحة والتوفير' }
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
                <div className="w-12 h-12 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[16px] flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }}>
                  الإرشاد والدليل
                </h2>
              </div>

              <div className="bg-white rounded-[24px] p-6 shadow-md mb-4">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  كيف تطلب الخدمة؟
                </h3>
                <div className="space-y-3">
                  {[
                    { step: '1', text: 'اضغط "احجز الآن" واختر نوع الخدمة', time: '30 ث' },
                    { step: '2', text: 'تصفح قائمة الفنيين المعتمدين', time: '2 د' },
                    { step: '3', text: 'حدد الموعد المناسب أو اطلب طوارئ', time: '1 د' },
                    { step: '4', text: 'أكد الطلب وانتظر قبول الفني', time: '1 د' },
                    { step: '5', text: 'استقبل الفني في الموعد المحدد', time: 'حسب الموعد' },
                    { step: '6', text: 'قيّم الخدمة بعد الانتهاء', time: '1 د' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#F5EEE1] to-white rounded-[16px] border-2 border-[#F5EEE1]">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}>
                          {item.step}
                        </span>
                      </div>
                      <p className="flex-1 text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}>
                        {item.text}
                      </p>
                      <span className="bg-[#4A90E2]/10 text-[#4A90E2] px-3 py-1 rounded-full text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
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
                        <ChevronLeft className="w-5 h-5 transform group-open:rotate-90 transition-transform text-[#4A90E2]" />
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
          <>
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => {
                  setShowReviewForm(!showReviewForm);
                  setShowComplaintForm(false);
                }}
                className="flex-1 bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white py-4 rounded-[20px] shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2"
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '15px' }}
              >
                <Star className="w-5 h-5" />
                <span>{showReviewForm ? 'إلغاء' : 'أضف تقييمك'}</span>
              </button>
              <button
                onClick={() => {
                  setShowComplaintForm(!showComplaintForm);
                  setShowReviewForm(false);
                }}
                className="flex-1 bg-gradient-to-r from-[#EB5757] to-[#F2994A] text-white py-4 rounded-[20px] shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2"
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '15px' }}
              >
                <AlertTriangle className="w-5 h-5" />
                <span>{showComplaintForm ? 'إلغاء' : 'شكوى أو مقترح'}</span>
              </button>
            </div>

            {showReviewForm && (
              <div className="bg-white rounded-[24px] p-6 shadow-lg mb-6 border-2 border-[#4A90E2]">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  شارك تجربتك
                </h3>
                
                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    تقييمك
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="transition-all active:scale-110"
                      >
                        <Star 
                          className={`w-8 h-8 ${star <= newReview.rating ? 'fill-[#56CCF2] text-[#56CCF2]' : 'fill-[#E5E7EB] text-[#E5E7EB]'}`}
                        />
                      </button>
                    ))}
                    <span className="mr-3 text-[#4A90E2]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '18px' }}>
                      {newReview.rating}/5
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    الاسم
                  </label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="أدخل اسمك"
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#4A90E2] transition-all"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px' }}
                  />
                </div>

                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    تعليقك
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="شاركنا تجربتك مع هذه الخدمة..."
                    rows={4}
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#4A90E2] transition-all resize-none"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: 1.7 }}
                  />
                </div>

                <button
                  onClick={handleSubmitReview}
                  disabled={!newReview.name || !newReview.comment}
                  className="w-full bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white py-4 rounded-[16px] shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}
                >
                  <Send className="w-5 h-5" />
                  <span>إرسال التقييم</span>
                </button>
              </div>
            )}

            {showComplaintForm && (
              <div className="bg-white rounded-[24px] p-6 shadow-lg mb-6 border-2 border-[#EB5757]">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  تقديم شكوى أو مقترح
                </h3>
                
                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    الاسم
                  </label>
                  <input
                    type="text"
                    value={newComplaint.name}
                    onChange={(e) => setNewComplaint({ ...newComplaint, name: e.target.value })}
                    placeholder="أدخل اسمك"
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#EB5757] transition-all"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px' }}
                  />
                </div>

                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    رقم المستخدم (User ID)
                  </label>
                  <input
                    type="text"
                    value={newComplaint.userId}
                    onChange={(e) => setNewComplaint({ ...newComplaint, userId: e.target.value })}
                    placeholder="مثال: BR-123456"
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#EB5757] transition-all"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px' }}
                  />
                </div>

                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    نوع البلاغ
                  </label>
                  <select
                    value={newComplaint.complaintType}
                    onChange={(e) => setNewComplaint({ ...newComplaint, complaintType: e.target.value })}
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#EB5757] transition-all"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px' }}
                  >
                    <option value="provider">شكوى عن مزود خدمة</option>
                    <option value="service">شكوى عن الخدمة</option>
                    <option value="suggestion">مقترح أو تحسين</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    الموضوع
                  </label>
                  <input
                    type="text"
                    value={newComplaint.subject}
                    onChange={(e) => setNewComplaint({ ...newComplaint, subject: e.target.value })}
                    placeholder="عنوان الشكوى أو المقترح"
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#EB5757] transition-all"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px' }}
                  />
                </div>

                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    التفاصيل
                  </label>
                  <textarea
                    value={newComplaint.message}
                    onChange={(e) => setNewComplaint({ ...newComplaint, message: e.target.value })}
                    placeholder="اكتب تفاصيل الشكوى أو المقترح..."
                    rows={4}
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#EB5757] transition-all resize-none"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: 1.7 }}
                  />
                </div>

                <button
                  onClick={handleSubmitComplaint}
                  disabled={!newComplaint.name || !newComplaint.userId || !newComplaint.message}
                  className="w-full bg-gradient-to-r from-[#EB5757] to-[#F2994A] text-white py-4 rounded-[16px] shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}
                >
                  <Send className="w-5 h-5" />
                  <span>إرسال</span>
                </button>
              </div>
            )}

            {!showReviewForm && !showComplaintForm && (
              <>
                <div className="bg-white rounded-[24px] p-6 shadow-md mb-6">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-[#4A90E2] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '48px' }}>
                        4.8
                      </div>
                      <div className="flex items-center gap-1 justify-center mb-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className="w-5 h-5 fill-[#56CCF2] text-[#56CCF2]" />
                        ))}
                      </div>
                      <p className="text-[#1A1A1A]/60 text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        3,456 تقييم
                      </p>
                    </div>
                    <div className="flex-1">
                      {[5,4,3,2,1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2 mb-2">
                          <span className="text-[#1A1A1A] text-sm w-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                            {rating}
                          </span>
                          <div className="flex-1 h-2 bg-[#F5EEE1] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] transition-all"
                              style={{ width: rating === 5 ? '80%' : rating === 4 ? '12%' : rating === 3 ? '5%' : '3%' }}
                            />
                          </div>
                          <span className="text-[#1A1A1A]/60 text-xs w-10" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                            {rating === 5 ? '80%' : rating === 4 ? '12%' : rating === 3 ? '5%' : '3%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                    آراء العملاء
                  </h3>
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-[24px] p-5 shadow-md">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-full flex items-center justify-center text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '16px' }}>
                          {review.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '15px' }}>
                              {review.name}
                            </h4>
                            {review.verified && (
                              <div className="w-5 h-5 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-full flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-[#4A90E2] text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                            ID: {review.userId}
                          </p>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? 'fill-[#56CCF2] text-[#56CCF2]' : 'fill-[#E5E7EB] text-[#E5E7EB]'}`} />
                            ))}
                          </div>
                          <p className="text-[#1A1A1A]/50 text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <p className="text-[#1A1A1A]/80 mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: 1.7 }}>
                        {review.comment}
                      </p>
                      <button className="text-[#4A90E2] text-sm flex items-center gap-1 hover:text-[#2E5F8D] transition-colors" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        مفيد ({review.helpful})
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

      </div>

      <PlatformShowcaseBanner variant="mini" className="pb-6" />
    </div>
  );
}