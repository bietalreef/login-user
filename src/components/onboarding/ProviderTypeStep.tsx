/**
 * ProviderTypeStep.tsx — اختيار نوع المزود (شركة / حرفي)
 * ═══════════════════════════════════════════════════════
 * City removed — already collected in LocationStep
 * Specialties use centralized EmiratesData
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Icon3D } from '../ui/Icon3D';
import { Building2, HardHat, Shield, FileText, Award, Users, Wrench } from 'lucide-react';
import type { OnboardingData } from './OnboardingFlow';
import { SPECIALIZATIONS } from './EmiratesData';

const fontCairo = 'Cairo, Tajawal, sans-serif';

interface ProviderTypeStepProps {
  onSelect: (type: 'company' | 'craftsman') => void;
  data: OnboardingData;
  onDataChange: (data: OnboardingData) => void;
  isEn: boolean;
  isDark: boolean;
}

export function ProviderTypeStep({ onSelect, data, onDataChange, isEn, isDark }: ProviderTypeStepProps) {
  const [selectedType, setSelectedType] = useState<'company' | 'craftsman' | null>(data.provider_type);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(data.specialties || []);
  const [businessName, setBusinessName] = useState(data.business_name || '');

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/50' : 'text-[#1F3D2B]/50';
  const cardClass = isDark
    ? 'bg-white/8 border-white/10'
    : 'bg-white border-gray-200/60';

  const types = [
    {
      id: 'company' as const,
      title: isEn ? 'Licensed Company' : 'شركة برخصة',
      subtitle: isEn
        ? 'Officially registered company with trade license'
        : 'شركة مسجلة رسمياً مع رخصة تجارية',
      icon: Building2,
      theme: 'blue',
      color: '#3B5BFE',
      features: isEn
        ? ['Trade License Badge', 'Priority in search', 'Company profile']
        : ['شارة الرخصة التجارية', 'أولوية في البحث', 'ملف شركة'],
      featureIcons: [Shield, Award, FileText],
    },
    {
      id: 'craftsman' as const,
      title: isEn ? 'Craftsman / Skilled Worker' : 'حرفي / عامل ماهر',
      subtitle: isEn
        ? 'Individual providing craft services without trade license'
        : 'فرد يقدم خدمات حرفية بدون رخصة تجارية',
      icon: HardHat,
      theme: 'gold',
      color: '#D4AF37',
      features: isEn
        ? ['Personal portfolio', 'Skills showcase', 'Client reviews']
        : ['معرض أعمال شخصي', 'عرض المهارات', 'تقييمات العملاء'],
      featureIcons: [Users, Award, FileText],
    },
  ];

  const toggleSpecialty = (id: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (!selectedType) return;
    onDataChange({
      ...data,
      provider_type: selectedType,
      business_name: businessName,
      specialties: selectedSpecialties,
    });
    onSelect(selectedType);
  };

  return (
    <div className="px-5 py-6">
      {/* Title */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto mb-3"
        >
          <Icon3D icon={Wrench} theme="gold" size="xl" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xl font-black mb-2 ${textClass}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'Your Business Type' : 'نوع نشاطك'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-sm ${mutedClass}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'This helps us customize your experience' : 'هذا يساعدنا في تخصيص تجربتك'}
        </motion.p>
      </div>

      {/* Type Cards */}
      <div className="space-y-3 mb-6">
        {types.map((type, idx) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            onClick={() => setSelectedType(type.id)}
            className={`w-full text-right rounded-2xl p-4 transition-all border-[4px] ${
              selectedType === type.id
                ? isDark
                  ? 'border-[#D4AF37] bg-white/10'
                  : 'bg-white'
                : isDark
                  ? 'border-white/10 bg-white/5'
                  : 'border-gray-200/60 bg-white'
            }`}
            style={{
              borderColor: selectedType === type.id ? type.color : undefined,
              backdropFilter: isDark ? 'blur(20px) saturate(180%)' : undefined,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <Icon3D icon={type.icon} theme={type.theme} size="md" hoverable={false} />
              <div className="flex-1">
                <h3
                  className={`font-bold ${textClass}`}
                  style={{ fontFamily: fontCairo }}
                >
                  {type.title}
                </h3>
                <p
                  className={`text-xs mt-0.5 ${isDark ? 'text-white/40' : 'text-[#1F3D2B]/40'}`}
                  style={{ fontFamily: fontCairo }}
                >
                  {type.subtitle}
                </p>
              </div>
              {/* Radio indicator */}
              <div
                className={`w-6 h-6 rounded-full border-[3px] flex items-center justify-center flex-shrink-0 ${
                  selectedType === type.id
                    ? 'border-[#D4AF37]'
                    : isDark
                      ? 'border-white/20'
                      : 'border-gray-300'
                }`}
              >
                {selectedType === type.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 rounded-full bg-[#D4AF37]"
                  />
                )}
              </div>
            </div>

            {/* Features */}
            {selectedType === type.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-3 pt-3 border-t border-dashed"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E6DCC8' }}
              >
                {type.features.map((f, i) => {
                  const FIcon = type.featureIcons[i];
                  return (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <FIcon className="w-3.5 h-3.5" style={{ color: type.color }} />
                      <span
                        className={`text-xs ${isDark ? 'text-white/60' : 'text-[#1F3D2B]/60'}`}
                        style={{ fontFamily: fontCairo }}
                      >
                        {f}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Business Name + Specialties */}
      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-6"
        >
          <div>
            <label
              className={`text-sm font-bold mb-2 block ${isDark ? 'text-white/70' : 'text-[#1F3D2B]/70'}`}
              style={{ fontFamily: fontCairo }}
            >
              {selectedType === 'company'
                ? (isEn ? 'Company Name' : 'اسم الشركة')
                : (isEn ? 'Your Professional Name' : 'اسمك المهني')}
              <span className="text-red-400 mr-1">*</span>
            </label>
            <input
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              placeholder={isEn ? 'Enter name...' : 'أدخل الاسم...'}
              className={`w-full px-4 py-3.5 rounded-2xl border-[4px] text-sm font-semibold transition-all ${
                isDark
                  ? 'bg-white/8 border-white/10 text-white placeholder:text-white/30 focus:border-[#D4AF37]/50'
                  : 'bg-white border-gray-200/60 text-[#1F3D2B] placeholder:text-[#1F3D2B]/30 focus:border-[#D4AF37]/50'
              }`}
              style={{ fontFamily: fontCairo }}
              dir="rtl"
            />
          </div>

          {/* Specialties */}
          <div>
            <label
              className={`text-sm font-bold mb-2 block ${isDark ? 'text-white/70' : 'text-[#1F3D2B]/70'}`}
              style={{ fontFamily: fontCairo }}
            >
              {isEn ? 'Specialties (select all that apply)' : 'التخصصات (اختر ما ينطبق)'}
            </label>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map(spec => {
                const isSelected = selectedSpecialties.includes(spec.id);
                return (
                  <button
                    key={spec.id}
                    onClick={() => toggleSpecialty(spec.id)}
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
          </div>
        </motion.div>
      )}

      {/* Continue Button */}
      {selectedType && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleContinue}
          disabled={!businessName.trim()}
          className="w-full py-4 rounded-2xl text-white font-bold text-base disabled:opacity-40 transition-all"
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #B8940E)',
            fontFamily: fontCairo,
          }}
        >
          {isEn ? 'Continue' : 'متابعة'}
        </motion.button>
      )}
    </div>
  );
}
