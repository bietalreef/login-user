import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Award, X, ArrowRight, CheckCircle } from 'lucide-react';
// Crown & CheckCircle2 not available — using safe aliases
const Crown = Award;
const CheckCircle2 = CheckCircle;

export type AccessType = 'login' | 'verify' | 'upgrade';

interface AccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: AccessType;
  featureName: string;
}

export function AccessModal({ isOpen, onClose, type, featureName }: AccessModalProps) {
  if (!isOpen) return null;

  const content = {
    login: {
      icon: <ShieldCheck className="w-12 h-12 text-gray-500" />,
      title: 'تسجيل الدخول مطلوب',
      desc: `ميزة "${featureName}" تتطلب تسجيل الدخول للمتابعة.`,
      btn: 'تسجيل الدخول',
      color: 'bg-gray-900',
    },
    verify: {
      icon: <ShieldCheck className="w-12 h-12 text-[#5B7FE8]" />,
      title: 'توثيق الحساب مطلوب',
      desc: `لضمان الجودة والأمان، يجب توثيق هويتك لاستخدام "${featureName}".`,
      btn: 'توثيق الهوية الآن (مجاناً)',
      color: 'bg-[#5B7FE8]',
      features: ['تفعيل الطلبات', 'التواصل مع المزودين', 'حماية التعاملات']
    },
    upgrade: {
      icon: <Crown className="w-12 h-12 text-amber-500" />,
      title: 'ميزة حصرية للأعضاء',
      desc: `"${featureName}" متاحة فقط في الباقة الاحترافية.`,
      btn: 'ترقية للباقة الاحترافية',
      color: 'bg-gradient-to-r from-amber-500 to-amber-600',
      features: ['أولوية قصوى', 'مدير حساب شخصي', 'تحليلات متقدمة']
    }
  };

  const current = content[type];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl z-10"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8 flex flex-col items-center text-center">
          <div className="mb-6 p-4 rounded-3xl bg-gray-50 shadow-inner">
            {current.icon}
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {current.title}
          </h3>
          
          <p className="text-gray-500 mb-8 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {current.desc}
          </p>

          {current.features && (
            <div className="w-full bg-gray-50 rounded-2xl p-4 mb-8">
              {current.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 mb-2 last:mb-0">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="text-sm text-gray-700" style={{ fontFamily: 'Cairo, sans-serif' }}>{f}</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => {
                // Here we would route to the actual verify/upgrade screens
                // For now, we simulate the action or close
                console.log(`Action: ${type}`);
                onClose();
            }}
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity ${current.color}`}
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            <span>{current.btn}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}