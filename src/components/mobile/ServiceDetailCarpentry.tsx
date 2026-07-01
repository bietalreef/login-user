import { useState } from 'react';
import { ArrowRight, Star, Search, Mic, SlidersHorizontal, Globe } from 'lucide-react';
import { Icon3D } from '../ui/Icon3D';
import { Hammer } from 'lucide-react';
import { BietAlreefLogo } from '../BietAlreefLogo';
import { ServiceSEOHead } from '../SEOHead';

interface ServiceDetailCarpentryProps {
  onBack: () => void;
  onOpenSearch?: () => void;
}

export function ServiceDetailCarpentry({ onBack, onOpenSearch }: ServiceDetailCarpentryProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'providers' | 'reviews'>('details');
  const [serviceNavTab, setServiceNavTab] = useState<'home' | 'projects' | 'maps' | 'recommend' | 'offers'>('home');

  const handleSearchClick = () => {
    if (onOpenSearch) {
      onOpenSearch();
    }
  };

  // SEO Data
  const seoData = {
    title: 'خدمة النجارة والأثاث الخشبي في الإمارات | نجار معتمد | بيت الريف - مطابخ خشبية غرف نوم دبي أبوظبي',
    description: 'أفضل خدمات النجارة في الإمارات - تفصيل مطابخ خشبية، غرف نوم، خزائن ملابس، أبواب، ديكورات خشبية، جبس بورد، باركيه. نجارين معتمدين بأفضل الأسعار وأعلى جودة. احجز الآن!',
    serviceId: 'SRV-CARP-001',
    serviceName: 'النجارة والأثاث الخشبي',
    serviceType: 'خدمات النجارة والأعمال الخشبية',
    priceRange: '500 - 5000 د.إ',
    rating: 4.9,
    reviewCount: 1097,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    keywords: [
      'نجارة في الإمارات',
      'نجار دبي',
      'نجار أبوظبي',
      'مطابخ خشبية',
      'غرف نوم خشبية',
      'خزائن ملابس',
      'ديكورات خشبية',
      'أبواب خشبية',
      'جبس بورد',
      'باركيه',
      'نجار معتمد',
      'تفصيل أثاث',
      'أثاث خشبي مخصص',
      'بيت الريف نجارة',
      'أفضل نجار الإمارات'
    ],
    faqs: [
      {
        question: 'ما هي خدمات النجارة المتوفرة؟',
        answer: 'نوفر جميع خدمات النجارة: تفصيل مطابخ خشبية، غرف نوم، خزائن ملابس، أبواب وشبابيك، ديكورات خشبية، جبس بورد، أرضيات باركيه، أثاث مكتبي، وتصاميم مخصصة حسب الطلب.'
      },
      {
        question: 'ما هي أنواع الخشب المستخدمة؟',
        answer: 'نستخدم أجود أنواع الخشب: الخشب الماليزي (MDF)، الخشب الطبيعي (الزان، السنديان، الصاج)، الكونتر، والخشب المضغوط. يتم اختيار النوع حسب الميزانية والاستخدام.'
      },
      {
        question: 'هل تقدمون تصاميم مخصصة؟',
        answer: 'نعم، نوفر خدمة التصميم المخصص بالكامل حسب المساحة والذوق الشخصي، مع رسومات ثلاثية الأبعاد قبل التنفيذ لضمان رضا العميل.'
      },
      {
        question: 'كم تستغرق مدة التنفيذ؟',
        answer: 'تختلف المدة حسب حجم المشروع: قطعة أثاث صغيرة (5-7 أيام)، مطبخ كامل (14-21 يوم)، غرفة نوم كاملة (10-14 يوم)، مشاريع كبيرة (شهر أو أكثر).'
      },
      {
        question: 'هل يوجد ضمان على الأعمال؟',
        answer: 'نعم، نقدم ضمان يتراوح من سنة إلى 5 سنوات حسب نوع الخشب والعمل المنفذ، مع صيانة مجانية خلال فترة الضمان.'
      }
    ],
    providerCount: 156,
    projectCount: 2847
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir="rtl">
      {/* SEO Head */}
      <ServiceSEOHead {...seoData} />

      {/* Fixed Top Header with Search Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#F5EEE1] shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex-shrink-0 w-10 h-10">
              <BietAlreefLogo />
            </div>

            {/* Compact Search Bar */}
            <button
              onClick={handleSearchClick}
              className="flex-1 flex items-center gap-2 bg-[#F5EEE1] hover:bg-[#EAE3D6] rounded-full px-4 py-2.5 transition-colors max-w-md"
            >
              <Search className="w-4 h-4 text-[#1F3D2B]/60" />
              <span className="text-sm text-[#1F3D2B]/60">ابحث هنا...</span>
              <div className="mr-auto flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#D4AF37]" />
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
              </div>
            </button>

            {/* Language Toggle */}
            <button className="flex-shrink-0 p-2 hover:bg-[#F5EEE1] rounded-lg transition-colors">
              <Globe className="w-5 h-5 text-[#1F3D2B]" />
            </button>
          </div>
        </div>
      </div>

      {/* Content with padding for fixed header */}
      <div className="pt-16">
        {/* Back Button - Medium Size with Gradient */}
        <div className="container mx-auto px-4 pt-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="bg-white border-b border-[#F5EEE1] mt-4">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <button onClick={onBack} className="text-[#D4AF37] hover:underline">الرئيسية</button>
              <span className="text-gray-400">/</span>
              <button onClick={onBack} className="text-[#D4AF37] hover:underline">الخدمات</button>
              <span className="text-gray-400">/</span>
              <span className="text-[#1F3D2B] font-medium">النجارة</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-l from-[#8B4513]/10 to-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-[#1F3D2B] mb-3">
                  خدمة النجارة والأثاث الخشبي | Carpentry Service
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
                  احصل على أفضل خدمات النجارة الاحترافية في الإمارات. نوفر تفصيل وتصنيع مطابخ خشبية، غرف نوم، خزائن ملابس، أبواب وشبابيك، ديكورات خشبية فاخرة بأعلى جودة.
                </p>
              </div>
              <div className="text-6xl"><Icon3D icon={Hammer} theme="brown" size="xl" hoverable={false} /></div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#C8A86A] text-[#C8A86A]" />
                  ))}
                </div>
                <span className="text-[#1F3D2B] font-semibold">4.9</span>
                <span className="text-gray-500">(1,097 تقييم)</span>
              </div>
              <div className="bg-[#8B4513] text-white px-4 py-1 rounded-full text-sm font-medium">معتمد ✓</div>
            </div>

            <button className="bg-gradient-to-l from-[#8B4513] to-[#1F3D2B] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow">
              احصل على عرض سعر مجاني
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white border-b border-[#F5EEE1] sticky top-16 z-30">
          <div className="container mx-auto px-4">
            <div className="flex gap-0">
              {(['details', 'providers', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 font-semibold transition-all relative ${
                    activeTab === tab ? 'text-[#8B4513] border-b-4 border-[#8B4513]' : 'text-gray-500 hover:text-[#1F3D2B]'
                  }`}
                >
                  {tab === 'details' && 'التفاصيل'}
                  {tab === 'providers' && 'المزودون'}
                  {tab === 'reviews' && 'التقييمات'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="container mx-auto px-4 py-8">
          {activeTab === 'details' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1F3D2B] mb-4">ما تتضمنه خدمة النجارة</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'تفصيل مطابخ خشبية كاملة',
                    'تصنيع غرف نوم مخصصة',
                    'خزائن ملابس حسب الطلب',
                    'أبواب وشبابيك خشبية',
                    'ديكورات جدارية خشبية',
                    'أسقف جبس بورد',
                    'أرضيات باركيه',
                    'مكاتب وطاولات',
                    'رفوف وخزائن',
                    'أعمال الترميم والصيانة',
                    'تصاميم ثلاثية الأبعاد',
                    'التوصيل والتركيب المجاني',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#8B4513]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#8B4513] text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'providers' && (
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <p className="text-gray-600">156 نجار معتمد</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="text-5xl font-bold text-[#8B4513] mb-2">4.9</div>
              <p className="text-sm text-gray-500">1,097 تقييم</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-l from-[#8B4513] to-[#1F3D2B] py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">جاهز لبدء مشروعك؟</h2>
            <p className="text-white/90 mb-6 text-lg">احصل على عرض سعر مجاني من أفضل ورش النجارة</p>
            <button className="bg-white text-[#8B4513] px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-shadow">
              احصل على عرض سعر مجاني
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}