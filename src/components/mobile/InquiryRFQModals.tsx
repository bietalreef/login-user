import { X, Send, ClipboardList, FileText, Phone, User, Mail, MapPin, Briefcase, DollarSign, Calendar, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
// CheckCircle2 not available — using CheckCircle as alias
const CheckCircle2 = CheckCircle;
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { useTranslation } from '../../contexts/LanguageContext';

const fontCairo = 'Cairo, sans-serif';

// ─── SERVICE OPTIONS ───
const SERVICE_OPTIONS_AR = [
  'مقاولات عامة',
  'تشطيبات داخلية',
  'سباكة',
  'كهرباء',
  'تكييف وتبريد',
  'دهانات',
  'تصميم داخلي',
  'صيانة عامة',
  'حدائق وتنسيق',
  'حمامات سباحة',
  'أعمال حديد',
  'ألمنيوم وزجاج',
  'أخرى',
];

const SERVICE_OPTIONS_EN = [
  'General Contracting',
  'Interior Finishing',
  'Plumbing',
  'Electrical',
  'AC & Cooling',
  'Painting',
  'Interior Design',
  'General Maintenance',
  'Landscaping',
  'Swimming Pools',
  'Steel Works',
  'Aluminum & Glass',
  'Other',
];

const BUDGET_OPTIONS_AR = [
  'أقل من 10,000 د.إ',
  '10,000 - 50,000 د.إ',
  '50,000 - 100,000 د.إ',
  '100,000 - 500,000 د.إ',
  'أكثر من 500,000 د.إ',
  'غير محدد بعد',
];

const BUDGET_OPTIONS_EN = [
  'Less than 10,000 AED',
  '10,000 - 50,000 AED',
  '50,000 - 100,000 AED',
  '100,000 - 500,000 AED',
  'More than 500,000 AED',
  'Not determined yet',
];

const TIMELINE_OPTIONS_AR = [
  'فوري / عاجل',
  'خلال أسبوع',
  'خلال شهر',
  'خلال 3 أشهر',
  'مرن / غير محدد',
];

const TIMELINE_OPTIONS_EN = [
  'Immediate / Urgent',
  'Within a week',
  'Within a month',
  'Within 3 months',
  'Flexible / Not determined',
];

const EMIRATES_AR = ['أبوظبي', 'دبي', 'الشارقة', 'عجمان', 'أم القيوين', 'رأس الخيمة', 'الفجيرة'];
const EMIRATES_EN = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];

// ═══════════════════════════════════════════
// ─── INQUIRY FORM MODAL ───
// ═══════════════════════════════════════════
interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InquiryFormModal({ isOpen, onClose }: InquiryModalProps) {
  const { language } = useTranslation('home');
  const isEn = language === 'en';
  const font = isEn ? 'Inter, sans-serif' : fontCairo;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    emirate: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const update = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));

  const services = isEn ? SERVICE_OPTIONS_EN : SERVICE_OPTIONS_AR;
  const emirates = isEn ? EMIRATES_EN : EMIRATES_AR;

  const handleSubmit = async () => {
    if (!formData.name.trim()) { toast.error(isEn ? 'Please enter your name' : 'يرجى إدخال الاسم'); return; }
    if (!formData.phone.trim()) { toast.error(isEn ? 'Please enter your phone' : 'يرجى إدخال رقم الهاتف'); return; }
    if (!formData.service) { toast.error(isEn ? 'Please select a service' : 'يرجى اختيار الخدمة'); return; }
    if (!formData.message.trim()) { toast.error(isEn ? 'Please describe your inquiry' : 'يرجى كتابة تفاصيل الاستفسار'); return; }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success(isEn ? 'Inquiry submitted successfully!' : 'تم إرسال الاستفسار بنجاح!');
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: '', phone: '', email: '', service: '', emirate: '', message: '' });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full md:max-w-lg max-h-[92vh] bg-white rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
            dir="rtl"
          >
            {/* Header */}
            <div className="bg-gradient-to-l from-[#4A90E2] to-[#56CCF2] px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-white" />
                <h2 className="text-white text-lg font-bold" style={{ fontFamily: font }}>
                  {isEn ? 'Inquiry Form' : 'نموذج استفسار'}
                </h2>
              </div>
              <button onClick={handleClose} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {isSuccess ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F3D2B] mb-2" style={{ fontFamily: font }}>
                    {isEn ? 'Inquiry Sent!' : 'تم إرسال الاستفسار!'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-[280px]" style={{ fontFamily: font }}>
                    {isEn
                      ? 'We will contact you within 24 hours. Thank you for your trust.'
                      : 'سنتواصل معك خلال 24 ساعة. شكراً لثقتك بنا.'}
                  </p>
                  <button
                    onClick={handleClose}
                    className="bg-[#2AA676] text-white px-8 py-3 rounded-2xl font-bold text-sm"
                    style={{ fontFamily: font }}
                  >
                    {isEn ? 'Close' : 'إغلاق'}
                  </button>
                </motion.div>
              ) : (
                <>
                  <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: font }}>
                    {isEn ? 'Fill in the details and we will get back to you shortly.' : 'املأ البيانات التالية وسنعود إليك في أقرب وقت.'}
                  </p>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                      {isEn ? 'Full Name' : 'الاسم الكامل'} <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2 bg-[#F5EEE1]/50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-[#4A90E2] transition-colors">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        value={formData.name}
                        onChange={e => update('name', e.target.value)}
                        placeholder={isEn ? 'e.g. Ahmed Mohammed' : 'مثال: أحمد محمد'}
                        className="flex-1 bg-transparent outline-none text-sm text-[#1F3D2B]"
                        style={{ fontFamily: font }}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                      {isEn ? 'Phone Number' : 'رقم الهاتف'} <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2 bg-[#F5EEE1]/50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-[#4A90E2] transition-colors">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        value={formData.phone}
                        onChange={e => update('phone', e.target.value)}
                        placeholder="+971 5X XXX XXXX"
                        className="flex-1 bg-transparent outline-none text-sm text-[#1F3D2B]"
                        style={{ fontFamily: font }}
                        dir="ltr"
                        type="tel"
                      />
                    </div>
                  </div>

                  {/* Email (optional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                      {isEn ? 'Email (Optional)' : 'البريد الإلكتروني (اختياري)'}
                    </label>
                    <div className="flex items-center gap-2 bg-[#F5EEE1]/50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-[#4A90E2] transition-colors">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        value={formData.email}
                        onChange={e => update('email', e.target.value)}
                        placeholder="example@email.com"
                        className="flex-1 bg-transparent outline-none text-sm text-[#1F3D2B]"
                        style={{ fontFamily: font }}
                        dir="ltr"
                        type="email"
                      />
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                      {isEn ? 'Service Type' : 'نوع الخدمة'} <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2 bg-[#F5EEE1]/50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-[#4A90E2] transition-colors">
                      <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <select
                        value={formData.service}
                        onChange={e => update('service', e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-[#1F3D2B] appearance-none cursor-pointer"
                        style={{ fontFamily: font }}
                      >
                        <option value="">{isEn ? 'Select a service...' : 'اختر الخدمة...'}</option>
                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Emirate */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                      {isEn ? 'Emirate' : 'الإمارة'}
                    </label>
                    <div className="flex items-center gap-2 bg-[#F5EEE1]/50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-[#4A90E2] transition-colors">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <select
                        value={formData.emirate}
                        onChange={e => update('emirate', e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-[#1F3D2B] appearance-none cursor-pointer"
                        style={{ fontFamily: font }}
                      >
                        <option value="">{isEn ? 'Select emirate...' : 'اختر الإمارة...'}</option>
                        {emirates.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                      {isEn ? 'Inquiry Details' : 'تفاصيل الاستفسار'} <span className="text-red-400">*</span>
                    </label>
                    <div className="bg-[#F5EEE1]/50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-[#4A90E2] transition-colors">
                      <textarea
                        value={formData.message}
                        onChange={e => update('message', e.target.value)}
                        placeholder={isEn ? 'Describe what you need in detail...' : 'اشرح ما تحتاجه بالتفصيل...'}
                        rows={4}
                        className="w-full bg-transparent outline-none text-sm text-[#1F3D2B] resize-none"
                        style={{ fontFamily: font }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {!isSuccess && (
              <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-l from-[#4A90E2] to-[#56CCF2] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg"
                  style={{ fontFamily: font }}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {isEn ? 'Send Inquiry' : 'إرسال الاستفسار'}
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════
// ─── RFQ (REQUEST FOR QUOTE) FORM MODAL ───
// ═══════════════════════════════════════════
interface RFQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RFQFormModal({ isOpen, onClose }: RFQModalProps) {
  const { language } = useTranslation('home');
  const isEn = language === 'en';
  const font = isEn ? 'Inter, sans-serif' : fontCairo;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: '',
    emirate: '',
    budget: '',
    timeline: '',
    description: '',
    attachNote: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const update = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));

  const services = isEn ? SERVICE_OPTIONS_EN : SERVICE_OPTIONS_AR;
  const budgets = isEn ? BUDGET_OPTIONS_EN : BUDGET_OPTIONS_AR;
  const timelines = isEn ? TIMELINE_OPTIONS_EN : TIMELINE_OPTIONS_AR;
  const emirates = isEn ? EMIRATES_EN : EMIRATES_AR;

  const handleSubmit = async () => {
    if (!formData.name.trim()) { toast.error(isEn ? 'Please enter your name' : 'يرجى إدخال الاسم'); return; }
    if (!formData.phone.trim()) { toast.error(isEn ? 'Please enter your phone' : 'يرجى إدخال رقم الهاتف'); return; }
    if (!formData.projectType) { toast.error(isEn ? 'Please select project type' : 'يرجى اختيار نوع المشروع'); return; }
    if (!formData.description.trim()) { toast.error(isEn ? 'Please describe your project' : 'يرجى وصف المشروع'); return; }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success(isEn ? 'Quote request submitted!' : 'تم إرسال طلب عرض السعر!');
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: '', phone: '', email: '', projectType: '', emirate: '', budget: '', timeline: '', description: '', attachNote: '' });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full md:max-w-lg max-h-[92vh] bg-white rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
            dir="rtl"
          >
            {/* Header */}
            <div className="bg-gradient-to-l from-[#C8A86A] to-[#A88B4A] px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-white" />
                <h2 className="text-white text-lg font-bold" style={{ fontFamily: font }}>
                  {isEn ? 'Request for Quote' : 'طلب عرض سعر'}
                </h2>
              </div>
              <button onClick={handleClose} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {isSuccess ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F3D2B] mb-2" style={{ fontFamily: font }}>
                    {isEn ? 'Quote Request Sent!' : 'تم إرسال طلب عرض السعر!'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 max-w-[280px]" style={{ fontFamily: font }}>
                    {isEn
                      ? 'You will receive quotes from verified providers within 24-48 hours.'
                      : 'ستصلك عروض أسعار من مزودين معتمدين خلال 24-48 ساعة.'}
                  </p>
                  <p className="text-xs text-[#C8A86A] font-bold mb-6" style={{ fontFamily: font }}>
                    {isEn ? 'Reference #: RFQ-2026-' + Math.floor(Math.random()*9000+1000) : 'رقم الطلب: RFQ-2026-' + Math.floor(Math.random()*9000+1000)}
                  </p>
                  <button
                    onClick={handleClose}
                    className="bg-[#C8A86A] text-white px-8 py-3 rounded-2xl font-bold text-sm"
                    style={{ fontFamily: font }}
                  >
                    {isEn ? 'Close' : 'إغلاق'}
                  </button>
                </motion.div>
              ) : (
                <>
                  <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: font }}>
                    {isEn
                      ? 'Describe your project and receive competitive quotes from verified providers.'
                      : 'صِف مشروعك واحصل على عروض أسعار تنافسية من مزودين معتمدين.'}
                  </p>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                      {isEn ? 'Full Name' : 'الاسم الكامل'} <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2 bg-[#F5EEE1]/50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-[#C8A86A] transition-colors">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        value={formData.name}
                        onChange={e => update('name', e.target.value)}
                        placeholder={isEn ? 'e.g. Ahmed Mohammed' : 'مثال: أحمد محمد'}
                        className="flex-1 bg-transparent outline-none text-sm text-[#1F3D2B]"
                        style={{ fontFamily: font }}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                      {isEn ? 'Phone Number' : 'رقم الهاتف'} <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2 bg-[#F5EEE1]/50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-[#C8A86A] transition-colors">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        value={formData.phone}
                        onChange={e => update('phone', e.target.value)}
                        placeholder="+971 5X XXX XXXX"
                        className="flex-1 bg-transparent outline-none text-sm text-[#1F3D2B]"
                        style={{ fontFamily: font }}
                        dir="ltr"
                        type="tel"
                      />
                    </div>
                  </div>

                  {/* Email (optional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                      {isEn ? 'Email (Optional)' : 'البريد الإلكتروني (اختياري)'}
                    </label>
                    <div className="flex items-center gap-2 bg-[#F5EEE1]/50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-[#C8A86A] transition-colors">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        value={formData.email}
                        onChange={e => update('email', e.target.value)}
                        placeholder="example@email.com"
                        className="flex-1 bg-transparent outline-none text-sm text-[#1F3D2B]"
                        style={{ fontFamily: font }}
                        dir="ltr"
                        type="email"
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                      {isEn ? 'Project Type' : 'نوع المشروع'} <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2 bg-[#F5EEE1]/50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-[#C8A86A] transition-colors">
                      <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <select
                        value={formData.projectType}
                        onChange={e => update('projectType', e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-[#1F3D2B] appearance-none cursor-pointer"
                        style={{ fontFamily: font }}
                      >
                        <option value="">{isEn ? 'Select type...' : 'اختر النوع...'}</option>
                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Emirate */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                      {isEn ? 'Emirate / Location' : 'الإمارة / الموقع'}
                    </label>
                    <div className="flex items-center gap-2 bg-[#F5EEE1]/50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-[#C8A86A] transition-colors">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <select
                        value={formData.emirate}
                        onChange={e => update('emirate', e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-[#1F3D2B] appearance-none cursor-pointer"
                        style={{ fontFamily: font }}
                      >
                        <option value="">{isEn ? 'Select emirate...' : 'اختر الإمارة...'}</option>
                        {emirates.map(em => <option key={em} value={em}>{em}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                      {isEn ? 'Expected Budget' : 'الميزانية المتوقعة'}
                    </label>
                    <div className="flex items-center gap-2 bg-[#F5EEE1]/50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-[#C8A86A] transition-colors">
                      <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <select
                        value={formData.budget}
                        onChange={e => update('budget', e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-[#1F3D2B] appearance-none cursor-pointer"
                        style={{ fontFamily: font }}
                      >
                        <option value="">{isEn ? 'Select range...' : 'اختر النطاق...'}</option>
                        {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                      {isEn ? 'Desired Timeline' : 'المدة الزمنية المطلوبة'}
                    </label>
                    <div className="flex items-center gap-2 bg-[#F5EEE1]/50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-[#C8A86A] transition-colors">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <select
                        value={formData.timeline}
                        onChange={e => update('timeline', e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-[#1F3D2B] appearance-none cursor-pointer"
                        style={{ fontFamily: font }}
                      >
                        <option value="">{isEn ? 'Select timeline...' : 'اختر المدة...'}</option>
                        {timelines.map(tl => <option key={tl} value={tl}>{tl}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                      {isEn ? 'Project Description' : 'وصف المشروع'} <span className="text-red-400">*</span>
                    </label>
                    <div className="bg-[#F5EEE1]/50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-[#C8A86A] transition-colors">
                      <textarea
                        value={formData.description}
                        onChange={e => update('description', e.target.value)}
                        placeholder={isEn
                          ? 'Describe the project scope, requirements, and any special notes...'
                          : 'صف نطاق المشروع والمتطلبات وأي ملاحظات خاصة...'}
                        rows={4}
                        className="w-full bg-transparent outline-none text-sm text-[#1F3D2B] resize-none"
                        style={{ fontFamily: font }}
                      />
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                      {isEn ? 'Additional Notes' : 'ملاحظات إضافية'}
                    </label>
                    <div className="bg-[#F5EEE1]/50 rounded-xl px-3 py-2.5 border border-gray-100 focus-within:border-[#C8A86A] transition-colors">
                      <textarea
                        value={formData.attachNote}
                        onChange={e => update('attachNote', e.target.value)}
                        placeholder={isEn ? 'Any additional details or preferences...' : 'أي تفاصيل أو تفضيلات إضافية...'}
                        rows={2}
                        className="w-full bg-transparent outline-none text-sm text-[#1F3D2B] resize-none"
                        style={{ fontFamily: font }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {!isSuccess && (
              <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-l from-[#C8A86A] to-[#A88B4A] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg"
                  style={{ fontFamily: font }}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {isEn ? 'Submit Quote Request' : 'إرسال طلب عرض السعر'}
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}