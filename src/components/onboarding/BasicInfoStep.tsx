/**
 * BasicInfoStep.tsx — الخطوة 1: البيانات الأساسية
 * ═══════════════════════════════════════════════
 * الاسم الكامل، رقم الهاتف، رقم واتساب، نبذة تعريفية
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Icon3D } from '../ui/Icon3D';
import {
  User, Phone, MessageCircle, FileText,
  ChevronDown, Check, AlertCircle,
} from 'lucide-react';

const fontCairo = 'Cairo, Tajawal, sans-serif';

interface BasicInfoStepProps {
  data: {
    full_name: string;
    phone: string;
    whatsapp: string;
    bio: string;
  };
  onChange: (data: Partial<BasicInfoStepProps['data']>) => void;
  onNext: () => void;
  isEn: boolean;
  isDark: boolean;
}

export function BasicInfoStep({ data, onChange, onNext, isEn, isDark }: BasicInfoStepProps) {
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/50' : 'text-[#1F3D2B]/50';
  const inputClass = `w-full px-4 py-3.5 rounded-2xl border-[4px] text-sm font-semibold transition-all ${
    isDark
      ? 'bg-white/8 border-white/10 text-white placeholder:text-white/30 focus:border-[#D4AF37]/50'
      : 'bg-white border-gray-200/60 text-[#1F3D2B] placeholder:text-[#1F3D2B]/30 focus:border-[#D4AF37]/50'
  }`;
  const labelClass = `text-sm font-bold mb-2 block ${isDark ? 'text-white/70' : 'text-[#1F3D2B]/70'}`;

  useEffect(() => {
    if (sameAsPhone && data.phone) {
      onChange({ whatsapp: data.phone });
    }
  }, [sameAsPhone, data.phone]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!data.full_name.trim()) {
      errs.full_name = isEn ? 'Name is required' : 'الاسم مطلوب';
    }
    if (!data.phone.trim()) {
      errs.phone = isEn ? 'Phone is required' : 'رقم الهاتف مطلوب';
    } else if (!/^(\+971|05|5)\d{7,9}$/.test(data.phone.replace(/\s/g, ''))) {
      errs.phone = isEn ? 'Enter a valid UAE phone number' : 'أدخل رقم هاتف إماراتي صحيح';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const fields = [
    {
      key: 'full_name',
      label: isEn ? 'Full Name' : 'الاسم الكامل',
      placeholder: isEn ? 'Enter your full name' : 'أدخل اسمك الكامل',
      icon: User,
      type: 'text',
      required: true,
    },
    {
      key: 'phone',
      label: isEn ? 'Phone Number' : 'رقم الهاتف',
      placeholder: isEn ? '+971 5X XXX XXXX' : '+971 5X XXX XXXX',
      icon: Phone,
      type: 'tel',
      required: true,
    },
    {
      key: 'bio',
      label: isEn ? 'About You (Interests & Preferences)' : 'نبذة عنك (الاهتمامات والتفضيلات)',
      placeholder: isEn
        ? 'Tell us about your interests, e.g. villa renovation, modern design...'
        : 'أخبرنا عن اهتماماتك، مثل: ترميم فلل، تصميم حديث، حدائق...',
      icon: FileText,
      type: 'textarea',
      required: false,
    },
  ];

  return (
    <div className="px-5 py-6">
      {/* Title */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto mb-3"
        >
          <Icon3D icon={User} theme="blue" size="xl" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xl font-black mb-1 ${textClass}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'Personal Information' : 'البيانات الشخصية'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-sm ${mutedClass}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'Help us know you better' : 'ساعدنا نتعرف عليك أكثر'}
        </motion.p>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {fields.map((field, idx) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.08 }}
          >
            <label className={labelClass} style={{ fontFamily: fontCairo }}>
              <field.icon className="w-4 h-4 inline-block ml-1.5" style={{ color: isDark ? '#FFD700' : '#D4AF37' }} />
              {field.label}
              {field.required && <span className="text-red-400 mr-1">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={(data as any)[field.key] || ''}
                onChange={e => onChange({ [field.key]: e.target.value })}
                placeholder={field.placeholder}
                rows={3}
                className={`${inputClass} resize-none`}
                style={{ fontFamily: fontCairo }}
                dir="rtl"
              />
            ) : (
              <input
                type={field.type}
                value={(data as any)[field.key] || ''}
                onChange={e => onChange({ [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className={inputClass}
                style={{ fontFamily: fontCairo }}
                dir={field.type === 'tel' ? 'ltr' : 'rtl'}
              />
            )}
            {errors[field.key] && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 font-bold mt-1 flex items-center gap-1"
                style={{ fontFamily: fontCairo }}
              >
                <AlertCircle className="w-3 h-3" />
                {errors[field.key]}
              </motion.p>
            )}
          </motion.div>
        ))}

        {/* WhatsApp Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <label className={labelClass} style={{ fontFamily: fontCairo }}>
            <MessageCircle className="w-4 h-4 inline-block ml-1.5" style={{ color: '#25D366' }} />
            {isEn ? 'WhatsApp Number' : 'رقم واتساب'}
          </label>

          {/* Same as phone toggle */}
          <button
            onClick={() => {
              const newVal = !sameAsPhone;
              setSameAsPhone(newVal);
              if (newVal) onChange({ whatsapp: data.phone });
              else onChange({ whatsapp: '' });
            }}
            className={`flex items-center gap-2 mb-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              sameAsPhone
                ? 'bg-[#25D366]/10 text-[#25D366]'
                : isDark ? 'bg-white/5 text-white/50' : 'bg-gray-50 text-[#1F3D2B]/50'
            }`}
            style={{ fontFamily: fontCairo }}
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
              sameAsPhone ? 'border-[#25D366] bg-[#25D366]' : isDark ? 'border-white/20' : 'border-gray-300'
            }`}>
              {sameAsPhone && <Check className="w-3 h-3 text-white" />}
            </div>
            {isEn ? 'Same as phone number' : 'نفس رقم الهاتف'}
          </button>

          {!sameAsPhone && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <input
                type="tel"
                value={data.whatsapp || ''}
                onChange={e => onChange({ whatsapp: e.target.value })}
                placeholder="+971 5X XXX XXXX"
                className={inputClass}
                style={{ fontFamily: fontCairo }}
                dir="ltr"
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Continue Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleNext}
        className="w-full mt-8 py-4 rounded-2xl text-white font-bold text-base transition-all"
        style={{
          background: 'linear-gradient(135deg, #D4AF37, #B8940E)',
          fontFamily: fontCairo,
        }}
      >
        {isEn ? 'Continue' : 'متابعة'}
      </motion.button>
    </div>
  );
}
