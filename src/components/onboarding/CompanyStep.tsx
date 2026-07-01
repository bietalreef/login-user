/**
 * CompanyStep.tsx — بيانات الشركة (للمزود نوع شركة)
 * ═══════════════════════════════════════════════════
 * الرخصة التجارية، عدد العمال، التخصص العام والخاص، شهادة التصنيف
 */

import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Icon3D } from '../ui/Icon3D';
import {
  Building2, Upload, Users, Award, FileText,
  Camera, X, Check, AlertCircle, Briefcase,
} from 'lucide-react';
import { GENERAL_SPECIALIZATIONS, SPECIALIZATIONS } from './EmiratesData';

const fontCairo = 'Cairo, Tajawal, sans-serif';

interface CompanyStepProps {
  data: {
    trade_license_file: File | null;
    num_workers: number;
    general_specialization: string;
    specific_specialization: string;
    classification_cert_file: File | null;
  };
  onChange: (data: Partial<CompanyStepProps['data']>) => void;
  onNext: () => void;
  isEn: boolean;
  isDark: boolean;
}

export function CompanyStep({ data, onChange, onNext, isEn, isDark }: CompanyStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tradeLicensePreview, setTradeLicensePreview] = useState<string | null>(null);
  const [classificationPreview, setClassificationPreview] = useState<string | null>(null);
  const tradeLicenseRef = useRef<HTMLInputElement>(null);
  const classificationRef = useRef<HTMLInputElement>(null);

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/50' : 'text-[#1F3D2B]/50';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const cardClass = isDark
    ? 'bg-white/8 border-white/10'
    : 'bg-white border-gray-200/60';
  const inputClass = `w-full px-4 py-3 rounded-xl border-[4px] text-sm font-semibold transition-all ${
    isDark
      ? 'bg-white/8 border-white/10 text-white placeholder:text-white/30 focus:border-[#D4AF37]/50'
      : 'bg-white border-gray-200/60 text-[#1F3D2B] placeholder:text-[#1F3D2B]/30 focus:border-[#D4AF37]/50'
  }`;
  const labelClass = `text-sm font-bold mb-2 block ${isDark ? 'text-white/70' : 'text-[#1F3D2B]/70'}`;

  const handleFileSelect = (type: 'trade_license' | 'classification', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      if (type === 'trade_license') {
        setTradeLicensePreview(preview);
        onChange({ trade_license_file: file });
      } else {
        setClassificationPreview(preview);
        onChange({ classification_cert_file: file });
      }
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!data.trade_license_file) {
      errs.trade_license = isEn ? 'Trade license is required' : 'الرخصة التجارية مطلوبة';
    }
    if (!data.num_workers || data.num_workers < 1) {
      errs.num_workers = isEn ? 'Enter number of workers' : 'أدخل عدد العمال';
    }
    if (!data.general_specialization) {
      errs.general_spec = isEn ? 'Select general specialization' : 'اختر التخصص العام';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  // File upload card component
  const FileUploadCard = ({
    title,
    subtitle,
    preview,
    onUpload,
    onRemove,
    inputRef,
    error,
    icon: IconComp,
    required,
  }: {
    title: string;
    subtitle: string;
    preview: string | null;
    onUpload: () => void;
    onRemove: () => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
    error?: string;
    icon: any;
    required?: boolean;
  }) => (
    <div>
      <div
        className={`rounded-2xl border-[4px] border-dashed overflow-hidden transition-all ${
          preview
            ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5'
            : error
              ? 'border-red-400/40'
              : `${cardClass}`
        }`}
      >
        {preview ? (
          <div className="relative">
            {preview.startsWith('data:image') ? (
              <img src={preview} alt={title} className="w-full h-32 object-cover" />
            ) : (
              <div className={`w-full h-32 flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <FileText className={`w-10 h-10 ${goldClass}`} />
              </div>
            )}
            <button
              onClick={onRemove}
              className="absolute top-2 left-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-[#D4AF37] text-white text-[10px] font-bold rounded-lg flex items-center gap-1">
              <Check className="w-3 h-3" />
              {isEn ? 'Uploaded' : 'تم الرفع'}
            </div>
          </div>
        ) : (
          <button
            onClick={onUpload}
            className="w-full py-6 flex flex-col items-center gap-2"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
              <IconComp className={`w-6 h-6 ${goldClass}`} />
            </div>
            <p className={`text-sm font-bold ${textClass}`} style={{ fontFamily: fontCairo }}>
              {title} {required && <span className="text-red-400">*</span>}
            </p>
            <p className={`text-xs ${mutedClass}`} style={{ fontFamily: fontCairo }}>
              {subtitle}
            </p>
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400 font-bold mt-1 flex items-center gap-1" style={{ fontFamily: fontCairo }}>
          <AlertCircle className="w-3 h-3" />{error}
        </p>
      )}
    </div>
  );

  return (
    <div className="px-5 py-6">
      {/* Title */}
      <div className="text-center mb-6">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto mb-3">
          <Icon3D icon={Building2} theme="blue" size="xl" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xl font-black mb-1 ${textClass}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'Company Details' : 'بيانات الشركة'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-sm ${mutedClass}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'Complete your company documentation' : 'أكمل وثائق شركتك'}
        </motion.p>
      </div>

      <div className="space-y-5">
        {/* Trade License Upload */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <input
            ref={tradeLicenseRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect('trade_license', file);
            }}
          />
          <FileUploadCard
            title={isEn ? 'Trade License' : 'الرخصة التجارية'}
            subtitle={isEn ? 'Upload your trade license (image or PDF)' : 'ارفع صورة الرخصة التجارية'}
            preview={tradeLicensePreview}
            onUpload={() => tradeLicenseRef.current?.click()}
            onRemove={() => {
              setTradeLicensePreview(null);
              onChange({ trade_license_file: null });
            }}
            inputRef={tradeLicenseRef}
            error={errors.trade_license}
            icon={Upload}
            required
          />
        </motion.div>

        {/* Number of Workers */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label className={labelClass} style={{ fontFamily: fontCairo }}>
            <Users className="w-4 h-4 inline-block ml-1.5" style={{ color: isDark ? '#FFD700' : '#D4AF37' }} />
            {isEn ? 'Number of Workers' : 'عدد العمال'}
            <span className="text-red-400 mr-1">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={data.num_workers || ''}
            onChange={e => onChange({ num_workers: Number(e.target.value) })}
            placeholder={isEn ? 'e.g. 25' : 'مثال: 25'}
            className={inputClass}
            dir="ltr"
          />
          {errors.num_workers && (
            <p className="text-xs text-red-400 font-bold mt-1 flex items-center gap-1" style={{ fontFamily: fontCairo }}>
              <AlertCircle className="w-3 h-3" />{errors.num_workers}
            </p>
          )}
        </motion.div>

        {/* General Specialization */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <label className={labelClass} style={{ fontFamily: fontCairo }}>
            <Briefcase className="w-4 h-4 inline-block ml-1.5" style={{ color: isDark ? '#FFD700' : '#D4AF37' }} />
            {isEn ? 'General Specialization' : 'التخصص العام'}
            <span className="text-red-400 mr-1">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {GENERAL_SPECIALIZATIONS.map(spec => {
              const isSelected = data.general_specialization === spec.id;
              return (
                <button
                  key={spec.id}
                  onClick={() => onChange({ general_specialization: spec.id })}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-[3px] ${
                    isSelected
                      ? 'border-[#3B5BFE] bg-[#3B5BFE]/10 text-[#3B5BFE]'
                      : `${cardClass} ${isDark ? 'text-white/50' : 'text-[#1F3D2B]/50'}`
                  }`}
                  style={{ fontFamily: fontCairo }}
                >
                  {isSelected && <Check className="w-3 h-3 inline-block ml-1" />}
                  {isEn ? spec.en : spec.ar}
                </button>
              );
            })}
          </div>
          {errors.general_spec && (
            <p className="text-xs text-red-400 font-bold mt-1 flex items-center gap-1" style={{ fontFamily: fontCairo }}>
              <AlertCircle className="w-3 h-3" />{errors.general_spec}
            </p>
          )}
        </motion.div>

        {/* Specific Specialization */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <label className={labelClass} style={{ fontFamily: fontCairo }}>
            <Award className="w-4 h-4 inline-block ml-1.5" style={{ color: isDark ? '#FFD700' : '#D4AF37' }} />
            {isEn ? 'Specific Specialization' : 'التخصص الخاص'}
          </label>
          <div className="flex flex-wrap gap-2">
            {SPECIALIZATIONS.map(spec => {
              const isSelected = data.specific_specialization === spec.id;
              return (
                <button
                  key={spec.id}
                  onClick={() => onChange({ specific_specialization: spec.id })}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border-[3px] ${
                    isSelected
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                      : `${cardClass} ${isDark ? 'text-white/50' : 'text-[#1F3D2B]/50'}`
                  }`}
                  style={{ fontFamily: fontCairo }}
                >
                  {isEn ? spec.en : spec.ar}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Classification Certificate Upload */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <input
            ref={classificationRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect('classification', file);
            }}
          />
          <FileUploadCard
            title={isEn ? 'Classification Certificate' : 'شهادة التصنيف'}
            subtitle={isEn ? 'Government classification certificate (optional)' : 'شهادة التصنيف الحكومية (اختياري)'}
            preview={classificationPreview}
            onUpload={() => classificationRef.current?.click()}
            onRemove={() => {
              setClassificationPreview(null);
              onChange({ classification_cert_file: null });
            }}
            inputRef={classificationRef}
            icon={Camera}
          />
        </motion.div>
      </div>

      {/* Continue */}
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
