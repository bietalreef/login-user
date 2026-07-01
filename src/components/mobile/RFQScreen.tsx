import { ArrowLeft, MapPin, Camera, DollarSign, Ruler, FileText, Sparkles, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

const serviceTypes = [
  'مقاولات عامة',
  'كهرباء',
  'سباكة',
  'دهانات',
  'نجارة',
  'تكييف',
  'تصميم داخلي',
  'صيانة عامة',
];

export function RFQScreen({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'form' | 'success' | 'subscription'>('form');
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [area, setArea] = useState('');

  const handleSubmit = () => {
    // Simulate first-time user getting free RFQ
    const isFirstRFQ = true; // In real app, check from backend
    
    if (isFirstRFQ) {
      setStep('success');
    } else {
      setStep('subscription');
    }
  };

  if (step === 'success') {
    return (
      <div className="flex-1 bg-[#F5EEE1] flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8940E] flex items-center justify-center mb-6"
        >
          <Check className="w-12 h-12 text-white" />
        </motion.div>
        <h1 className="text-[#1A1A1A] text-2xl mb-3 text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
          تم الإرسال بنجاح!
        </h1>
        <p className="text-[#6F6F6F] text-sm text-center mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
          أول طلب عرض سعر مجاني لك!
        </p>
        <p className="text-[#6F6F6F] text-sm text-center mb-8" style={{ fontFamily: 'Cairo, sans-serif' }}>
          سيتواصل معك المقاولون المعتمدون خلال 24 ساعة
        </p>
        <motion.button
          onClick={onBack}
          className="w-full max-w-sm bg-gradient-to-r from-[#5B7FE8] to-[#7B5FE8] text-white rounded-[20px] py-4 shadow-lg"
          style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
          whileTap={{ scale: 0.95 }}
        >
          العودة للرئيسية
        </motion.button>
      </div>
    );
  }

  if (step === 'subscription') {
    return (
      <div className="flex-1 bg-[#F5EEE1] overflow-y-auto pb-8">
        <div className="bg-gradient-to-br from-[#5B7FE8] to-[#7B5FE8] px-5 pt-12 pb-8 rounded-b-[32px]">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-2xl mb-2 text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            اختر باقتك
          </h1>
          <p className="text-white/90 text-sm text-center" style={{ fontFamily: 'Cairo, sans-serif' }}>
            للحصول على عروض أسعار غير محدودة
          </p>
        </div>

        <div className="px-5 -mt-8 space-y-4">
          {/* Monthly Plan */}
          <motion.div
            className="bg-white rounded-[24px] p-6 shadow-lg border-2 border-transparent"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-right">
                <h3 className="text-[#1A1A1A] text-lg mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  باقة شهرية
                </h3>
                <p className="text-[#6F6F6F] text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  مثالية للاستخدام المنتظم
                </p>
              </div>
              <div className="text-left">
                <p className="text-[#5B7FE8] text-2xl" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  150
                </p>
                <p className="text-[#6F6F6F] text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  درهم/شهر
                </p>
              </div>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <p className="text-[#1A1A1A] text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  طلبات عروض أسعار غير محدودة
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <p className="text-[#1A1A1A] text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  ردود سريعة خلال 12 ساعة
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <p className="text-[#1A1A1A] text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  دعم فني مميز
                </p>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-[#5B7FE8] to-[#7B5FE8] text-white rounded-[16px] py-3 shadow-md" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              اشتراك الآن
            </button>
          </motion.div>

          {/* Annual Plan */}
          <motion.div
            className="bg-gradient-to-br from-[#C8A24A] to-[#D3A55A] rounded-[24px] p-6 shadow-xl border-2 border-[#FFD700] relative overflow-hidden"
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <p className="text-[#C8A24A] text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                وفّر 50%
              </p>
            </div>
            <div className="flex items-start justify-between mb-4">
              <div className="text-right">
                <h3 className="text-white text-lg mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  باقة سنوية
                </h3>
                <p className="text-white/90 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  أفضل قيمة - موصى بها
                </p>
              </div>
              <div className="text-left">
                <p className="text-white text-2xl" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  900
                </p>
                <p className="text-white/90 text-xs line-through" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  1800 درهم
                </p>
              </div>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white flex-shrink-0" />
                <p className="text-white text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  كل مميزات الباقة الشهرية
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white flex-shrink-0" />
                <p className="text-white text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  أولوية في الردود
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white flex-shrink-0" />
                <p className="text-white text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  استشارات YAK AI مجانية
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white flex-shrink-0" />
                <p className="text-white text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  شارة "عميل مميز"
                </p>
              </div>
            </div>
            <button className="w-full bg-white text-[#C8A24A] rounded-[16px] py-3 shadow-md" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              اشتراك الآن - وفّر 900 درهم
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Form step
  return (
    <div className="flex-1 bg-[#F5EEE1] overflow-y-auto pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5B7FE8] to-[#7B5FE8] px-5 pt-12 pb-6 rounded-b-[40px]">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            طلب عرض سعر
          </h1>
        </div>
        <p className="text-white/90 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
          احصل على عروض من أفضل المقاولين في منطقتك
        </p>
      </div>

      {/* Form */}
      <div className="px-5 py-6 space-y-4">
        {/* Service Type */}
        <div>
          <label className="text-[#1A1A1A] text-sm mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            نوع الخدمة
          </label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full bg-white rounded-[20px] px-4 py-3 text-sm text-[#1A1A1A] border border-[#E5E5E5] outline-none focus:border-[#5B7FE8]"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            <option value="">اختر نوع الخدمة</option>
            {serviceTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="text-[#1A1A1A] text-sm mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            وصف المشروع
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="اشرح تفاصيل المشروع..."
            rows={4}
            className="w-full bg-white rounded-[20px] px-4 py-3 text-sm text-[#1A1A1A] border border-[#E5E5E5] outline-none focus:border-[#5B7FE8] resize-none"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-[#1A1A1A] text-sm mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            الموقع
          </label>
          <button className="w-full bg-white rounded-[20px] px-4 py-3 text-sm text-[#6F6F6F] border border-[#E5E5E5] flex items-center gap-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <MapPin className="w-5 h-5 text-[#5B7FE8]" />
            <span>حدد الموقع على الخريطة</span>
          </button>
        </div>

        {/* Area & Budget Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[#1A1A1A] text-sm mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              المساحة (م²)
            </label>
            <div className="relative">
              <Ruler className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F6F6F]" />
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="200"
                className="w-full bg-white rounded-[20px] px-4 py-3 pr-10 text-sm text-[#1A1A1A] border border-[#E5E5E5] outline-none focus:border-[#5B7FE8]"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              />
            </div>
          </div>
          <div>
            <label className="text-[#1A1A1A] text-sm mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              الميزانية
            </label>
            <div className="relative">
              <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F6F6F]" />
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="50000"
                className="w-full bg-white rounded-[16px] px-4 py-3 pr-10 text-sm text-[#1A1A1A] border border-[#E5E5E5] outline-none focus:border-[#5B7FE8]"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              />
            </div>
          </div>
        </div>

        {/* Upload Photos */}
        <div>
          <label className="text-[#1A1A1A] text-sm mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            صور (اختياري)
          </label>
          <button className="w-full bg-white rounded-[20px] px-4 py-8 border-2 border-dashed border-[#E5E5E5] flex flex-col items-center gap-2">
            <Camera className="w-8 h-8 text-[#6F6F6F]" />
            <p className="text-[#6F6F6F] text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
              اضغط لإضافة صور
            </p>
          </button>
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-[#5B7FE8] to-[#7B5FE8] text-white rounded-[28px] py-4 shadow-lg flex items-center justify-center gap-2"
          style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="w-5 h-5" />
          إرسال الطلب
        </motion.button>

        {/* Info */}
        <div className="bg-blue-50 rounded-[20px] p-4 border border-blue-200">
          <p className="text-[#5B7FE8] text-xs text-center leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
            سيتم إرسال طلبك لجميع المقاولين المعتمدين في منطقتك
          </p>
        </div>
      </div>
    </div>
  );
}