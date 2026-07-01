import { useState, useEffect } from 'react';
import { NewTopHeader } from './NewTopHeader';
import {
  ChevronLeft, Phone, MessageCircle, MapPin, Star, Users,
  Palette, Building2, Ruler, Calculator, HardHat, Home,
  Box, Sparkles, Package, Hammer, Truck, Wrench, Lightbulb,
  Droplets, Wind, Settings, Paintbrush, PenTool, Zap,
  LayoutGrid, Layers as FolderKanban, Cpu, Award, Compass,
  type LucideIcon,
} from 'lucide-react';
import { Icon3D } from '../ui/Icon3D';

const f = 'Cairo, sans-serif';

export function NewHomeScreen() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-slide for main banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const mainSlides = [
    { title: 'مقاولات', bg: 'linear-gradient(135deg, #2C1810 0%, #D4AF37 100%)' },
    { title: 'استشارات هندسية', bg: 'linear-gradient(135deg, #3B5BFE 0%, #5B9CF6 100%)' },
    { title: 'عقارات', bg: 'linear-gradient(135deg, #D4AF37 0%, #2C1810 100%)' },
    { title: 'متجر مواد البناء', bg: 'linear-gradient(135deg, #8D6E63 0%, #D4AF37 100%)' },
    { title: 'عروض موردين', bg: 'linear-gradient(135deg, #2C1810 0%, #3B5BFE 100%)' },
  ];

  const engineeringServices: { Icon: LucideIcon; title: string; theme: string }[] = [
    { Icon: Palette, title: 'تصميم داخلي', theme: 'blue' },
    { Icon: Building2, title: 'تصميم خارجي', theme: 'indigo' },
    { Icon: Ruler, title: 'مخططات هندسية', theme: 'teal' },
    { Icon: Calculator, title: 'BOQ', theme: 'orange' },
    { Icon: Compass, title: 'مكتب هندسي', theme: 'purple' },
    { Icon: HardHat, title: 'إشراف هندسي', theme: 'amber' },
  ];

  const contractingServices: { Icon: LucideIcon; title: string; theme: string }[] = [
    { Icon: Building2, title: 'مقاولات عامة', theme: 'orange' },
    { Icon: Home, title: 'بناء فيلا', theme: 'blue' },
    { Icon: Box, title: 'أعمال العظم', theme: 'brown' },
    { Icon: Sparkles, title: 'التشطيبات', theme: 'gold' },
    { Icon: Palette, title: 'الديكور', theme: 'purple' },
    { Icon: Package, title: 'الإضافات', theme: 'teal' },
    { Icon: Hammer, title: 'ترميم', theme: 'amber' },
    { Icon: Truck, title: 'مظلات وهناجر', theme: 'indigo' },
  ];

  const storeCategories: { Icon: LucideIcon; title: string; theme: string }[] = [
    { Icon: Package, title: 'مواد البناء', theme: 'orange' },
    { Icon: Settings, title: 'الحديد', theme: 'brown' },
    { Icon: Wrench, title: 'الأدوات', theme: 'amber' },
    { Icon: Lightbulb, title: 'الكهرباء', theme: 'gold' },
    { Icon: Droplets, title: 'السباكة', theme: 'blue' },
    { Icon: Palette, title: 'البلاط', theme: 'pink' },
    { Icon: Settings, title: 'الأجهزة', theme: 'purple' },
  ];

  const maintenanceServices: { Icon: LucideIcon; title: string; theme: string }[] = [
    { Icon: Droplets, title: 'السباكة', theme: 'blue' },
    { Icon: Lightbulb, title: 'الكهرباء', theme: 'gold' },
    { Icon: Wind, title: 'التكييف', theme: 'cyan' },
    { Icon: Hammer, title: 'النجارة', theme: 'brown' },
    { Icon: Settings, title: 'الحدادة', theme: 'amber' },
    { Icon: Box, title: 'الزجاج', theme: 'teal' },
    { Icon: LayoutGrid, title: 'الألومنيوم', theme: 'indigo' },
    { Icon: Paintbrush, title: 'الدهانات', theme: 'pink' },
    { Icon: Box, title: 'الجبس', theme: 'purple' },
    { Icon: Building2, title: 'الورش الصناعية', theme: 'orange' },
  ];

  const workers: { Icon: LucideIcon; title: string; theme: string }[] = [
    { Icon: HardHat, title: 'عامل بناء', theme: 'orange' },
    { Icon: PenTool, title: 'عامل جبس', theme: 'purple' },
    { Icon: Paintbrush, title: 'عامل دهانات', theme: 'pink' },
    { Icon: Wrench, title: 'عامل تركيب', theme: 'amber' },
    { Icon: Zap, title: 'عامل كهرباء', theme: 'gold' },
    { Icon: Droplets, title: 'عامل سباكة', theme: 'blue' },
  ];

  const chatRooms: { Icon: LucideIcon; title: string; theme: string }[] = [
    { Icon: Building2, title: 'غرفة المقاولين', theme: 'orange' },
    { Icon: Package, title: 'غرفة مواد البناء', theme: 'brown' },
    { Icon: FolderKanban, title: 'غرفة عروض الموردين', theme: 'gold' },
    { Icon: Users, title: 'غرفة العملاء', theme: 'blue' },
    { Icon: Compass, title: 'غرفة استشارات هندسية', theme: 'teal' },
    { Icon: Cpu, title: 'غرفة Weyaak AI', theme: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-[#F5EEE1]" dir="rtl">
      {/* Top Header */}
      <NewTopHeader isScrolled={isScrolled} />

      {/* Main Content - Starts below header */}
      <div className="pt-32 pb-24 md:pt-36">
        
        {/* SECTION 1 - Main Slider */}
        <div className="px-6 mb-6">
          <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg border-[4px] border-gray-200/60">
            {mainSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  currentSlide === idx ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ background: slide.bg }}
              >
                <div className="flex items-center justify-center h-full">
                  <h2 className="text-white text-3xl" style={{ fontFamily: f, fontWeight: 700 }}>
                    {slide.title}
                  </h2>
                </div>
              </div>
            ))}
            
            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {mainSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === idx ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2 - Golden Opportunity */}
        <div className="px-6 mb-6">
          <div className="bg-gradient-to-br from-[#2C1810] via-[#5C3A20] to-[#D4AF37] rounded-3xl p-8 shadow-xl border-[4px] border-[#D4AF37]/30">
            <h2 className="text-white text-2xl mb-3" style={{ fontFamily: f, fontWeight: 700 }}>
              احصل على عرض السعر الذهبي خلال دقائق
            </h2>
            <p className="text-white/90 text-sm mb-6" style={{ fontFamily: f, fontWeight: 500 }}>
              ارفع صور مشروعك - واحصل على أفضل 3 عروض جاهزة للمقارنة
            </p>

            {/* Timeline */}
            <div className="space-y-4 mb-6">
              {[
                { num: '٢', text: 'ارفع صور الموقع' },
                { num: '٣', text: 'اختر نوع الخدمة' },
                { num: '٤', text: 'استلم العروض خلال 24 ساعة' },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-[#D4AF37] text-lg" style={{ fontFamily: f, fontWeight: 700 }}>
                      {step.num}
                    </span>
                  </div>
                  <p className="text-white" style={{ fontFamily: f, fontWeight: 600 }}>
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="w-full bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-[#2C1810] py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-[3px] border-[#D4AF37]/40" style={{ fontFamily: f, fontWeight: 700 }}>
              ابدأ الآن
            </button>
          </div>
        </div>

        {/* SECTION 3 - Engineering Consultations */}
        <div className="px-6 mb-6">
          <h2 className="text-[#2C1810] text-xl mb-4" style={{ fontFamily: f, fontWeight: 700 }}>
            الاستشارات الهندسية
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {engineeringServices.map((service, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow border-[3px] border-gray-200/60">
                <Icon3D icon={service.Icon} theme={service.theme} size="md" className="mx-auto mb-3" />
                <h3 className="text-[#2C1810] text-sm mb-3" style={{ fontFamily: f, fontWeight: 600 }}>
                  {service.title}
                </h3>
                <button className="text-[#3B5BFE] text-xs flex items-center justify-center gap-1 mx-auto" style={{ fontFamily: f, fontWeight: 600 }}>
                  عرض التفاصيل
                  <ChevronLeft className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4 - Contracting */}
        <div className="px-6 mb-6">
          <h2 className="text-[#2C1810] text-xl mb-4" style={{ fontFamily: f, fontWeight: 700 }}>
            المقاولات
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contractingServices.map((service, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border-[3px] border-gray-200/60">
                <div className="bg-gradient-to-br from-[#2C1810] to-[#D4AF37] h-32 flex items-center justify-center">
                  <Icon3D icon={service.Icon} theme={service.theme} size="xl" hoverable={false} />
                </div>
                <div className="p-4">
                  <h3 className="text-[#2C1810] text-sm mb-3" style={{ fontFamily: f, fontWeight: 600 }}>
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="flex-1 bg-[#25D366] text-white p-2 rounded-lg flex items-center justify-center gap-1 border-[2px] border-[#25D366]/30">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="flex-1 bg-[#3B5BFE] text-white p-2 rounded-lg flex items-center justify-center gap-1 border-[2px] border-[#3B5BFE]/30">
                      <MapPin className="w-4 h-4" />
                    </button>
                    <button className="flex-1 bg-[#D4AF37] text-[#2C1810] p-2 rounded-lg text-xs border-[2px] border-[#D4AF37]/40" style={{ fontFamily: f, fontWeight: 600 }}>
                      تعاقد
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5 - Real Estate */}
        <div className="px-6 mb-6">
          <h2 className="text-[#2C1810] text-xl mb-4" style={{ fontFamily: f, fontWeight: 700 }}>
            العقارات
          </h2>
          
          {/* Properties Slider */}
          <div className="mb-4">
            <div className="bg-gradient-to-br from-[#2C1810] to-[#D4AF37] rounded-3xl p-6 text-white shadow-lg border-[4px] border-[#D4AF37]/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg mb-1" style={{ fontFamily: f, fontWeight: 700 }}>
                    فيلا فاخرة في دبي
                  </h3>
                  <p className="text-sm opacity-90" style={{ fontFamily: f, fontWeight: 500 }}>
                    المساحة: 500 متر مربع
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-2xl" style={{ fontFamily: f, fontWeight: 700 }}>
                    2.5M
                  </p>
                  <p className="text-xs opacity-90">درهم</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span style={{ fontFamily: f, fontWeight: 500 }}>دبي - البرشاء</span>
              </div>
            </div>
          </div>

          {/* Property Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-2xl shadow-md overflow-hidden border-[3px] border-gray-200/60">
                <div className="bg-[#F5EEE1] h-32 flex items-center justify-center">
                  <Icon3D icon={Home} theme="blue" size="lg" hoverable={false} />
                </div>
                <div className="p-3">
                  <h4 className="text-[#2C1810] text-sm mb-2" style={{ fontFamily: f, fontWeight: 600 }}>
                    فيلا للبيع
                  </h4>
                  <div className="flex items-center justify-between text-xs text-[#2C1810]/60 mb-2">
                    <span>300 م</span>
                    <span style={{ fontFamily: f, fontWeight: 700 }}>1.8M</span>
                  </div>
                  <div className="flex gap-1">
                    <button className="flex-1 bg-[#3B5BFE] text-white py-1.5 rounded-lg text-xs border-[2px] border-[#3B5BFE]/30">
                      تفاصيل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6 - Store & Offers */}
        <div className="bg-[#F5EEE1]/60 px-6 py-8 mb-6">
          <h2 className="text-[#2C1810] text-xl mb-4" style={{ fontFamily: f, fontWeight: 700 }}>
            المتجر والعروض
          </h2>

          {/* Offers Slider */}
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#2C1810] rounded-3xl p-6 mb-6 shadow-lg border-[4px] border-[#D4AF37]/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white text-lg mb-2" style={{ fontFamily: f, fontWeight: 700 }}>
                  عرض خاص على مواد البناء
                </h3>
                <p className="text-white/90 text-sm" style={{ fontFamily: f, fontWeight: 500 }}>
                  خصم حتى 40% لفترة محدودة
                </p>
              </div>
              <Icon3D icon={Sparkles} theme="gold" size="lg" hoverable={false} />
            </div>
          </div>

          {/* Store Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {storeCategories.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow border-[3px] border-gray-200/60">
                <Icon3D icon={cat.Icon} theme={cat.theme} size="md" className="mx-auto mb-3" />
                <h3 className="text-[#2C1810] text-sm" style={{ fontFamily: f, fontWeight: 600 }}>
                  {cat.title}
                </h3>
              </div>
            ))}
          </div>

          <button className="w-full bg-gradient-to-l from-[#D4AF37] to-[#2C1810] text-white py-3 rounded-2xl shadow-lg border-[3px] border-[#D4AF37]/30" style={{ fontFamily: f, fontWeight: 700 }}>
            عرض الكل
          </button>
        </div>

        {/* SECTION 7 - Maintenance & Craftsmen */}
        <div className="px-6 mb-6">
          <h2 className="text-[#2C1810] text-xl mb-4" style={{ fontFamily: f, fontWeight: 700 }}>
            الصيانة والحرفيين والورش
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {maintenanceServices.map((service, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 text-center shadow-md border-[3px] border-gray-200/60">
                <Icon3D icon={service.Icon} theme={service.theme} size="sm" className="mx-auto mb-2" />
                <h3 className="text-[#2C1810] text-sm mb-3" style={{ fontFamily: f, fontWeight: 600 }}>
                  {service.title}
                </h3>
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#3B5BFE] text-white p-2 rounded-lg border-[2px] border-[#3B5BFE]/30">
                    <Phone className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 bg-[#25D366] text-white p-2 rounded-lg border-[2px] border-[#25D366]/30">
                    <MessageCircle className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 8 - Workers */}
        <div className="px-6 mb-6">
          <h2 className="text-[#2C1810] text-xl mb-4" style={{ fontFamily: f, fontWeight: 700 }}>
            العمالة الحرفية
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {workers.map((worker, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 text-center border-[3px] border-gray-200/60">
                <div className="flex items-center justify-center mx-auto mb-2">
                  <Icon3D icon={worker.Icon} theme={worker.theme} size="lg" />
                </div>
                <h3 className="text-[#2C1810] text-xs" style={{ fontFamily: f, fontWeight: 600 }}>
                  {worker.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 9 - Maps */}
        <div className="px-6 mb-6">
          <h2 className="text-[#2C1810] text-xl mb-4" style={{ fontFamily: f, fontWeight: 700 }}>
            الخرائط
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {['خريطة المقاولين', 'خريطة الورش', 'خريطة العقارات', 'خريطة المتاجر'].map((map, idx) => (
              <div key={idx} className="min-w-[280px] bg-gradient-to-br from-[#2C1810] to-[#D4AF37] rounded-2xl p-6 text-white shadow-lg border-[3px] border-[#D4AF37]/30">
                <Icon3D icon={MapPin} theme="red" size="md" hoverable={false} className="mb-3" />
                <h3 className="text-lg" style={{ fontFamily: f, fontWeight: 700 }}>
                  {map}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 10 - Voice Chat Rooms */}
        <div className="px-6 mb-6">
          <h2 className="text-[#2C1810] text-xl mb-4" style={{ fontFamily: f, fontWeight: 700 }}>
            غرف الدردشة الصوتية
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {chatRooms.map((room, idx) => (
              <div key={idx} className="min-w-[200px] bg-white rounded-2xl p-4 text-center shadow-md border-[3px] border-gray-200/60">
                <div className="flex items-center justify-center mx-auto mb-3">
                  <Icon3D icon={room.Icon} theme={room.theme} size="lg" />
                </div>
                <h3 className="text-[#2C1810] text-sm mb-3" style={{ fontFamily: f, fontWeight: 600 }}>
                  {room.title}
                </h3>
                <button className="w-full bg-gradient-to-l from-[#D4AF37] to-[#2C1810] text-white py-2 rounded-xl text-xs border-[2px] border-[#D4AF37]/30" style={{ fontFamily: f, fontWeight: 600 }}>
                  انضم الآن
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 11 - VIP Providers */}
        <div className="px-6 mb-6">
          <h2 className="text-[#2C1810] text-xl mb-4" style={{ fontFamily: f, fontWeight: 700 }}>
            مزودين VIP
          </h2>
          <div className="bg-gradient-to-br from-white to-[#F5EEE1] rounded-3xl p-6 border-[4px] border-[#D4AF37]/60 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <Icon3D icon={Award} theme="gold" size="xl" />
              <div className="flex-1">
                <h3 className="text-[#2C1810] text-lg mb-1" style={{ fontFamily: f, fontWeight: 700 }}>
                  شركة النخبة للمقاولات
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <span className="text-xs text-[#2C1810]/60">5.0</span>
                </div>
                <p className="text-xs text-[#2C1810]/70" style={{ fontFamily: f, fontWeight: 500 }}>
                  خبرة 15 عام في المقاولات والبناء
                </p>
              </div>
            </div>
            <button className="w-full bg-gradient-to-l from-[#D4AF37] to-[#2C1810] text-white py-3 rounded-2xl shadow-lg border-[3px] border-[#D4AF37]/30" style={{ fontFamily: f, fontWeight: 700 }}>
              عرض الملف
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}