import { useShopStore } from './ShopStore';
import { ArrowRight, MapPin, Truck, CheckCircle, Phone, MessageCircle, Package, Clock } from 'lucide-react';
// CheckCircle2 not available — using CheckCircle as alias
const CheckCircle2 = CheckCircle;
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { useTranslation } from '../../../contexts/LanguageContext';
import { motion } from 'motion/react';

export function OrderTracking() {
  const { selectedOrder, setCurrentView } = useShopStore();
  const { language, textAlign } = useTranslation('store');
  const isEn = language === 'en';
  const fontFamily = 'Cairo, sans-serif';
  const fw6: React.CSSProperties = { fontFamily, fontWeight: 600 };
  const fw7: React.CSSProperties = { fontFamily, fontWeight: 700 };
  const fw8: React.CSSProperties = { fontFamily, fontWeight: 800 };

  if (!selectedOrder) return null;

  const steps = [
    { label: isEn ? 'Order Received' : 'تم استلام الطلب', time: '10:30 AM', active: true },
    { label: isEn ? 'Preparing' : 'جاري التجهيز', time: '11:45 AM', active: true },
    { label: isEn ? 'Out for Delivery' : 'خرج للتوصيل', time: '02:15 PM', active: selectedOrder.trackingStep !== undefined && selectedOrder.trackingStep >= 1 },
    { label: isEn ? 'Delivered' : 'تم التوصيل', time: '---', active: selectedOrder.trackingStep !== undefined && selectedOrder.trackingStep >= 2 },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white overflow-y-auto pb-4 relative" style={{ fontFamily }}>
      {/* Map Background */}
      <div className="absolute top-0 left-0 w-full h-[55vh] z-0">
        <ImageWithFallback src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-20 grayscale invert" />
        {/* Driver Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-12 -translate-y-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            className="relative"
          >
            <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg shadow-[#D4AF37]/30 animate-pulse">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#D4AF37] rotate-45" />
          </motion.div>
          <div className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded-md mt-2 absolute left-1/2 -translate-x-1/2 whitespace-nowrap shadow-sm" style={{ fontFamily }}>
            {isEn ? 'Delivery Driver' : 'مندوب التوصيل'}
          </div>
        </div>
        
        {/* Home Marker */}
        <div className="absolute top-1/3 right-1/4">
          <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <MapPin className="w-4 h-4 text-black" />
          </div>
        </div>
      </div>

      {/* Top Bar */}
      <div className="relative z-10 p-4 flex justify-between items-center">
        <button onClick={() => setCurrentView('home')} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold border border-white/10" style={{ fontFamily }}>
          {isEn ? 'Live Order Tracking' : 'تتبع حالة الطلب المباشر'}
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="mt-auto relative z-10 bg-[#1A1A1A] rounded-t-[30px] p-6 pb-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5 min-h-[45vh]">
        <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6" />
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-gray-400 text-xs block mb-1" style={{ fontFamily, textAlign }}>
              {isEn ? 'Order Number' : 'رقم الطلب'}
            </span>
            <h2 className="text-xl font-bold text-[#D4AF37]">{selectedOrder.id}</h2>
          </div>
          <div className="text-left">
            <span className="text-gray-400 text-xs block mb-1" style={{ fontFamily }}>
              {isEn ? 'Estimated Arrival' : 'موعد الوصول المتوقع'}
            </span>
            <span className="font-bold">03:30 PM</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6 relative pl-4 border-r border-dashed border-white/10 mr-2 pr-6 mb-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="relative flex items-center justify-between"
            >
              <div className={`absolute -right-[29px] w-4 h-4 rounded-full border-2 ${step.active ? 'bg-[#D4AF37] border-[#D4AF37]' : 'bg-[#1A1A1A] border-gray-600'} flex items-center justify-center`}>
                {step.active && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              <div className={`${step.active ? 'text-white' : 'text-gray-500'}`}>
                <p className="font-bold text-sm" style={{ fontFamily, textAlign }}>{step.label}</p>
              </div>
              <span className="text-xs text-gray-500 font-mono">{step.time}</span>
            </motion.div>
          ))}
        </div>

        {/* Driver Info */}
        <div className="bg-[#252525] p-4 rounded-xl flex items-center justify-between border border-white/5 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ fontFamily, textAlign }}>
                {isEn ? 'Ghazi Al-Mujahir' : 'غازي المجهر'}
              </p>
              <p className="text-xs text-gray-400" style={{ fontFamily, textAlign }}>
                {isEn ? 'Delivery Driver' : 'مندوب التوصيل'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('rating')}
          className="w-full bg-[#D4AF37] text-white font-bold py-3.5 rounded-xl hover:bg-[#B8940E] transition-colors"
          style={{ fontFamily }}
        >
          {isEn ? 'Confirm Receipt' : 'تأكيد الاستلام'}
        </button>
      </div>
    </div>
  );
}