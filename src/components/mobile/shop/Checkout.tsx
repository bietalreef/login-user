import { useState } from 'react';
import { useShopStore, CustomerInfo } from './ShopStore';
import { ArrowRight, MapPin, CreditCard, Lock, CheckCircle, User, Phone, Mail, Building, FileText, ChevronLeft, Banknote } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { useTranslation } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

type CheckoutStep = 'info' | 'address' | 'payment' | 'summary';

export function Checkout() {
  const { cart, placeOrder, setCurrentView } = useShopStore();
  const [step, setStep] = useState<CheckoutStep>('info');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('cod');
  const { language, textAlign } = useTranslation('store');
  const isEn = language === 'en';
  const fontFamily = 'Cairo, sans-serif';
  const fw6: React.CSSProperties = { fontFamily, fontWeight: 600 };
  const fw7: React.CSSProperties = { fontFamily, fontWeight: 700 };
  const fw8: React.CSSProperties = { fontFamily, fontWeight: 800 };
  const currency = isEn ? 'AED' : 'د.إ';

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vat = total * 0.05;
  const shipping = total > 500 ? 0 : 50;
  const grandTotal = total + vat + shipping;

  const steps: { id: CheckoutStep; label: string; icon: any }[] = [
    { id: 'info', label: isEn ? 'Info' : 'البيانات', icon: User },
    { id: 'address', label: isEn ? 'Address' : 'العنوان', icon: MapPin },
    { id: 'payment', label: isEn ? 'Payment' : 'الدفع', icon: CreditCard },
    { id: 'summary', label: isEn ? 'Confirm' : 'التأكيد', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white" style={{ fontFamily }}>
        <p className="mb-4">{isEn ? 'Your cart is empty' : 'سلة التسوق فارغة'}</p>
        <button onClick={() => setCurrentView('home')} className="text-[#D4AF37] underline" style={{ fontFamily }}>
          {isEn ? 'Browse Products' : 'تصفح المنتجات'}
        </button>
      </div>
    );
  }

  const validateInfo = () => {
    const newErrors: Record<string, string> = {};
    if (!customerInfo.fullName.trim()) newErrors.fullName = isEn ? 'Name is required' : 'الاسم مطلوب';
    if (!customerInfo.phone.trim()) newErrors.phone = isEn ? 'Phone is required' : 'رقم الهاتف مطلوب';
    if (customerInfo.phone && !/^[\+]?[0-9\s\-]{8,15}$/.test(customerInfo.phone.trim())) {
      newErrors.phone = isEn ? 'Invalid phone number' : 'رقم الهاتف غير صحيح';
    }
    if (customerInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = isEn ? 'Invalid email' : 'البريد الإلكتروني غير صحيح';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddress = () => {
    const newErrors: Record<string, string> = {};
    if (!customerInfo.city.trim()) newErrors.city = isEn ? 'City is required' : 'المدينة مطلوبة';
    if (!customerInfo.address.trim()) newErrors.address = isEn ? 'Address is required' : 'العنوان مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 'info') {
      if (validateInfo()) setStep('address');
    } else if (step === 'address') {
      if (validateAddress()) setStep('payment');
    } else if (step === 'payment') {
      setStep('summary');
    }
  };

  const handleBack = () => {
    if (step === 'address') setStep('info');
    else if (step === 'payment') setStep('address');
    else if (step === 'summary') setStep('payment');
    else setCurrentView('cart');
  };

  const handlePlaceOrder = () => {
    placeOrder({
      id: `ORD-${Math.floor(Math.random() * 100000)}`,
      items: [...cart],
      total: grandTotal,
      status: 'processing',
      date: new Date().toISOString().split('T')[0],
      trackingStep: 0,
      customer: customerInfo,
    });
  };

  const uaeCities = isEn
    ? ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Al Ain']
    : ['دبي', 'أبوظبي', 'الشارقة', 'عجمان', 'رأس الخيمة', 'الفجيرة', 'أم القيوين', 'العين'];

  const InputField = ({ label, icon: Icon, value, onChange, error, placeholder, type = 'text', dir: inputDir }: any) => (
    <div className="mb-4">
      <label className="flex items-center gap-2 text-gray-400 text-xs mb-2" style={{ fontFamily, textAlign }}>
        <Icon className="w-3.5 h-3.5" /> {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        dir={inputDir}
        className={`w-full bg-[#252525] border rounded-xl p-3.5 text-sm focus:border-[#D4AF37] outline-none transition-colors ${
          error ? 'border-red-500/50' : 'border-white/10'
        }`}
        style={{ fontFamily, textAlign: inputDir === 'ltr' ? 'left' : textAlign }}
      />
      {error && <p className="text-red-400 text-xs mt-1" style={{ fontFamily }}>{error}</p>}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white overflow-y-auto" style={{ fontFamily }}>
      {/* Header */}
      <div className="p-4 flex items-center gap-4 border-b border-white/5 bg-[#1A1A1A]/95 backdrop-blur-md sticky top-0 z-10">
        <button onClick={handleBack} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg flex-1" style={{ fontFamily, textAlign }}>
          {isEn ? 'Checkout' : 'إتمام الطلب'}
        </h1>
      </div>

      {/* Progress Steps */}
      <div className="px-4 py-4 bg-[#1A1A1A]">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCompleted ? 'bg-[#D4AF37] text-white' :
                    isCurrent ? 'bg-[#D4AF37] text-black' :
                    'bg-[#252525] text-gray-500'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[9px] mt-1 font-bold ${
                    isCurrent ? 'text-[#D4AF37]' : isCompleted ? 'text-[#D4AF37]' : 'text-gray-600'
                  }`} style={{ fontFamily }}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 mb-4 ${idx < currentStepIndex ? 'bg-[#D4AF37]' : 'bg-[#252525]'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 p-5 pb-32">
        <AnimatePresence mode="wait">
          {step === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              <h2 className="text-lg font-bold mb-1" style={{ fontFamily, textAlign }}>
                {isEn ? 'Personal Information' : 'البيانات الشخصية'}
              </h2>
              <p className="text-gray-500 text-xs mb-6" style={{ fontFamily, textAlign }}>
                {isEn ? 'Enter your details to complete the order' : 'أدخل بياناتك لإتمام الطلب'}
              </p>

              <InputField
                label={isEn ? 'Full Name' : 'الاسم الكامل'}
                icon={User}
                value={customerInfo.fullName}
                onChange={(e: any) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                error={errors.fullName}
                placeholder={isEn ? 'e.g. Ahmed Mohammed' : 'مثال: أحمد محمد'}
              />
              <InputField
                label={isEn ? 'Phone Number' : 'رقم الهاتف'}
                icon={Phone}
                value={customerInfo.phone}
                onChange={(e: any) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                error={errors.phone}
                placeholder="+971 55 123 4567"
                type="tel"
                dir="ltr"
              />
              <InputField
                label={isEn ? 'Email (Optional)' : 'البريد الإلكتروني (اختياري)'}
                icon={Mail}
                value={customerInfo.email}
                onChange={(e: any) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                error={errors.email}
                placeholder={isEn ? 'example@email.com' : 'example@email.com'}
                type="email"
                dir="ltr"
              />
            </motion.div>
          )}

          {step === 'address' && (
            <motion.div
              key="address"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              <h2 className="text-lg font-bold mb-1" style={{ fontFamily, textAlign }}>
                {isEn ? 'Delivery Address' : 'عنوان التوصيل'}
              </h2>
              <p className="text-gray-500 text-xs mb-6" style={{ fontFamily, textAlign }}>
                {isEn ? 'Where should we deliver your order?' : 'أين تريد أن نوصل طلبك؟'}
              </p>

              <div className="mb-4">
                <label className="flex items-center gap-2 text-gray-400 text-xs mb-2" style={{ fontFamily, textAlign }}>
                  <Building className="w-3.5 h-3.5" /> {isEn ? 'City / Emirate' : 'المدينة / الإمارة'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {uaeCities.map(city => (
                    <button
                      key={city}
                      onClick={() => { setCustomerInfo({ ...customerInfo, city }); setErrors({ ...errors, city: '' }); }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        customerInfo.city === city
                          ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]'
                          : 'bg-[#252525] border-white/5 text-gray-400 hover:border-white/20'
                      }`}
                      style={{ fontFamily }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
                {errors.city && <p className="text-red-400 text-xs mt-1" style={{ fontFamily }}>{errors.city}</p>}
              </div>

              <InputField
                label={isEn ? 'Detailed Address' : 'العنوان التفصيلي'}
                icon={MapPin}
                value={customerInfo.address}
                onChange={(e: any) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                error={errors.address}
                placeholder={isEn ? 'Building, Street, Area...' : 'المبنى، الشارع، المنطقة...'}
              />

              <div className="mb-4">
                <label className="flex items-center gap-2 text-gray-400 text-xs mb-2" style={{ fontFamily, textAlign }}>
                  <FileText className="w-3.5 h-3.5" /> {isEn ? 'Notes (Optional)' : 'ملاحظات (اختياري)'}
                </label>
                <textarea
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                  placeholder={isEn ? 'Any special delivery instructions...' : 'أي تعليمات خاصة للتوصيل...'}
                  className="w-full bg-[#252525] border border-white/10 rounded-xl p-3.5 text-sm focus:border-[#D4AF37] outline-none min-h-[80px] resize-none"
                  style={{ fontFamily, textAlign }}
                />
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              <h2 className="text-lg font-bold mb-1" style={{ fontFamily, textAlign }}>
                {isEn ? 'Payment Method' : 'طريقة الدفع'}
              </h2>
              <p className="text-gray-500 text-xs mb-6" style={{ fontFamily, textAlign }}>
                {isEn ? 'Choose how you want to pay' : 'اختر طريقة الدفع المفضلة'}
              </p>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-[#D4AF37]/5 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/5'
                      : 'bg-[#252525] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === 'cod' ? 'bg-[#D4AF37]/20' : 'bg-[#1A1A1A]'
                  }`}>
                    <Banknote className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="font-bold text-sm" style={{ fontFamily, textAlign }}>
                      {isEn ? 'Cash on Delivery' : 'الدفع عند الاستلام'}
                    </h3>
                    <p className="text-gray-500 text-xs" style={{ fontFamily, textAlign }}>
                      {isEn ? 'Pay when your order arrives' : 'ادفع عند وصول طلبك'}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'cod' ? 'border-[#D4AF37]' : 'border-gray-600'
                  }`}>
                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full" />}
                  </div>
                </button>

                {/* Credit Card */}
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#D4AF37]/5 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/5'
                      : 'bg-[#252525] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === 'card' ? 'bg-[#D4AF37]/20' : 'bg-[#1A1A1A]'
                  }`}>
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="font-bold text-sm" style={{ fontFamily, textAlign }}>
                      {isEn ? 'Credit / Debit Card' : 'بطاقة ائتمان / خصم'}
                    </h3>
                    <p className="text-gray-500 text-xs" style={{ fontFamily, textAlign }}>
                      {isEn ? 'Visa, Mastercard, etc.' : 'فيزا، ماستركارد، وغيرها'}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-[#D4AF37]' : 'border-gray-600'
                  }`}>
                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full" />}
                  </div>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-[#252525] rounded-2xl p-4 border border-white/5 mt-4 space-y-4"
                >
                  <div>
                    <label className="text-gray-400 text-xs mb-2 block" style={{ fontFamily, textAlign }}>
                      {isEn ? 'Card Number' : 'رقم البطاقة'}
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-sm focus:border-[#D4AF37] outline-none"
                      dir="ltr"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-gray-400 text-xs mb-2 block" style={{ fontFamily, textAlign }}>
                        {isEn ? 'Expiry' : 'تاريخ الانتهاء'}
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-sm focus:border-[#D4AF37] outline-none"
                        dir="ltr"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-gray-400 text-xs mb-2 block" style={{ fontFamily, textAlign }}>
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-sm focus:border-[#D4AF37] outline-none"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4" style={{ fontFamily }}>
                <Lock className="w-3 h-3" />
                <span>{isEn ? 'All transactions are encrypted and secure' : 'جميع المعاملات مشفرة وآمنة'}</span>
              </div>
            </motion.div>
          )}

          {step === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold mb-1" style={{ fontFamily, textAlign }}>
                {isEn ? 'Order Summary' : 'ملخص الطلب'}
              </h2>

              {/* Customer Info Summary */}
              <div className="bg-[#252525] rounded-2xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm flex items-center gap-2 text-[#D4AF37]" style={{ fontFamily }}>
                    <User className="w-4 h-4" /> {isEn ? 'Customer Info' : 'بيانات العميل'}
                  </h3>
                  <button onClick={() => setStep('info')} className="text-xs text-[#D4AF37]" style={{ fontFamily }}>
                    {isEn ? 'Edit' : 'تعديل'}
                  </button>
                </div>
                <div className="space-y-1 text-sm text-gray-300" style={{ fontFamily, textAlign }}>
                  <p>{customerInfo.fullName}</p>
                  <p dir="ltr" className="text-gray-400">{customerInfo.phone}</p>
                  {customerInfo.email && <p dir="ltr" className="text-gray-400">{customerInfo.email}</p>}
                </div>
              </div>

              {/* Address Summary */}
              <div className="bg-[#252525] rounded-2xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm flex items-center gap-2 text-[#D4AF37]" style={{ fontFamily }}>
                    <MapPin className="w-4 h-4" /> {isEn ? 'Delivery Address' : 'عنوان التوصيل'}
                  </h3>
                  <button onClick={() => setStep('address')} className="text-xs text-[#D4AF37]" style={{ fontFamily }}>
                    {isEn ? 'Edit' : 'تعديل'}
                  </button>
                </div>
                <div className="space-y-1 text-sm text-gray-300" style={{ fontFamily, textAlign }}>
                  <p>{customerInfo.city}</p>
                  <p className="text-gray-400">{customerInfo.address}</p>
                  {customerInfo.notes && <p className="text-gray-500 text-xs mt-1">{customerInfo.notes}</p>}
                </div>
              </div>

              {/* Cart Items */}
              <div className="bg-[#252525] rounded-2xl p-4 border border-white/5">
                <h3 className="font-bold text-sm mb-3 text-[#D4AF37]" style={{ fontFamily }}>
                  {isEn ? `Items (${cart.length})` : `المنتجات (${cart.length})`}
                </h3>
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 mb-3 pb-3 border-b border-white/5 last:border-0 last:mb-0 last:pb-0">
                    <ImageWithFallback src={item.image} className="w-14 h-14 rounded-lg object-cover bg-black flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate" style={{ fontFamily, textAlign }}>
                        {isEn ? (item.nameEn || item.name) : item.name}
                      </h4>
                      <p className="text-xs text-gray-500">{item.quantity} x {item.price.toLocaleString()}</p>
                    </div>
                    <span className="text-sm font-bold text-[#D4AF37] flex-shrink-0">{(item.price * item.quantity).toLocaleString()} {currency}</span>
                  </div>
                ))}
              </div>

              {/* Payment Method */}
              <div className="bg-[#252525] rounded-2xl p-4 border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {paymentMethod === 'cod' ? (
                      <Banknote className="w-5 h-5 text-[#D4AF37]" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                    )}
                    <span className="font-bold text-sm" style={{ fontFamily }}>
                      {paymentMethod === 'cod'
                        ? (isEn ? 'Cash on Delivery' : 'الدفع عند الاستلام')
                        : (isEn ? 'Credit Card' : 'بطاقة ائتمان')}
                    </span>
                  </div>
                  <button onClick={() => setStep('payment')} className="text-xs text-[#D4AF37]" style={{ fontFamily }}>
                    {isEn ? 'Change' : 'تغيير'}
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-[#252525] rounded-2xl p-4 border border-white/5 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400" style={{ fontFamily }}>
                  <span>{isEn ? 'Subtotal' : 'المجموع الفرعي'}</span>
                  <span>{total.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between text-gray-400" style={{ fontFamily }}>
                  <span>{isEn ? 'VAT (5%)' : 'ضريبة القيمة المضافة (5%)'}</span>
                  <span>{vat.toFixed(2)} {currency}</span>
                </div>
                <div className="flex justify-between text-gray-400" style={{ fontFamily }}>
                  <span>{isEn ? 'Delivery' : 'التوصيل'}</span>
                  <span className={shipping === 0 ? 'text-green-400' : ''}>
                    {shipping === 0 ? (isEn ? 'Free' : 'مجاني') : `${shipping} ${currency}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10 mt-2" style={{ fontFamily }}>
                  <span>{isEn ? 'Total' : 'الإجمالي'}</span>
                  <span className="text-[#D4AF37]">{grandTotal.toFixed(2)} {currency}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-[72px] left-0 right-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A] to-transparent pt-8 pb-4 px-4 z-20">
        {step === 'summary' ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handlePlaceOrder}
            className="w-full bg-gradient-to-r from-[#2AA676] to-[#1E8A5E] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-[#2AA676]/20 text-base"
            style={{ fontFamily }}
          >
            <Lock className="w-5 h-5" />
            <span>{isEn ? 'Confirm & Place Order' : 'تأكيد وإرسال الطلب'}</span>
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8940E] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-[#D4AF37]/20 text-base"
            style={{ fontFamily }}
          >
            <Lock className="w-5 h-5" />
            <span>{isEn ? 'Confirm & Place Order' : 'تأكيد وإرسال الطلب'}</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}