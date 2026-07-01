/**
 * LocationStep.tsx — الخطوة 2: الموقع الجغرافي
 * ═══════════════════════════════════════════════
 * Cascading: إمارة → مدينة → منطقة
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon3D } from '../ui/Icon3D';
import { MapPin, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { UAE_EMIRATES } from './EmiratesData';

const fontCairo = 'Cairo, Tajawal, sans-serif';

interface LocationStepProps {
  data: {
    emirate: string;
    city: string;
    district: string;
  };
  onChange: (data: Partial<LocationStepProps['data']>) => void;
  onNext: () => void;
  isEn: boolean;
  isDark: boolean;
}

export function LocationStep({ data, onChange, onNext, isEn, isDark }: LocationStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/50' : 'text-[#1F3D2B]/50';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const cardClass = isDark
    ? 'bg-white/8 border-white/10'
    : 'bg-white border-gray-200/60';

  // Get cities based on selected emirate
  const selectedEmirate = useMemo(
    () => UAE_EMIRATES.find(e => e.id === data.emirate),
    [data.emirate]
  );

  // Get districts based on selected city
  const selectedCity = useMemo(
    () => selectedEmirate?.cities.find(c => c.id === data.city),
    [selectedEmirate, data.city]
  );

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!data.emirate) errs.emirate = isEn ? 'Select an emirate' : 'اختر الإمارة';
    if (!data.city) errs.city = isEn ? 'Select a city' : 'اختر المدينة';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
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
          <Icon3D icon={MapPin} theme="blue" size="xl" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xl font-black mb-1 ${textClass}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'Your Location' : 'موقعك الجغرافي'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-sm ${mutedClass}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'This helps connect you with nearby services' : 'هذا يساعدنا في ربطك بالخدمات القريبة منك'}
        </motion.p>
      </div>

      {/* Emirate Selection */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-5"
      >
        <label
          className={`text-sm font-bold mb-3 block ${isDark ? 'text-white/70' : 'text-[#1F3D2B]/70'}`}
          style={{ fontFamily: fontCairo }}
        >
          <MapPin className="w-4 h-4 inline-block ml-1.5" style={{ color: isDark ? '#FFD700' : '#D4AF37' }} />
          {isEn ? 'Emirate' : 'الإمارة'}
          <span className="text-red-400 mr-1">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {UAE_EMIRATES.map((emirate, idx) => {
            const isSelected = data.emirate === emirate.id;
            return (
              <motion.button
                key={emirate.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.03 }}
                onClick={() => {
                  onChange({ emirate: emirate.id, city: '', district: '' });
                  setErrors(e => ({ ...e, emirate: '' }));
                }}
                className={`px-3 py-3 rounded-2xl text-sm font-bold transition-all border-[4px] ${
                  isSelected
                    ? 'border-[#3B5BFE] bg-[#3B5BFE]/10 text-[#3B5BFE]'
                    : `${cardClass} ${textClass} hover:border-[#3B5BFE]/30`
                }`}
                style={{ fontFamily: fontCairo }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-center gap-2">
                  {isSelected && <Check className="w-4 h-4" />}
                  <span>{isEn ? emirate.nameEn : emirate.nameAr}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
        {errors.emirate && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-400 font-bold mt-2 flex items-center gap-1"
            style={{ fontFamily: fontCairo }}
          >
            <AlertCircle className="w-3 h-3" />
            {errors.emirate}
          </motion.p>
        )}
      </motion.div>

      {/* City Selection */}
      <AnimatePresence>
        {selectedEmirate && selectedEmirate.cities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5"
          >
            <label
              className={`text-sm font-bold mb-3 block ${isDark ? 'text-white/70' : 'text-[#1F3D2B]/70'}`}
              style={{ fontFamily: fontCairo }}
            >
              {isEn ? 'City' : 'المدينة'}
              <span className="text-red-400 mr-1">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedEmirate.cities.map(city => {
                const isSelected = data.city === city.id;
                return (
                  <motion.button
                    key={city.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => {
                      onChange({ city: city.id, district: '' });
                      setErrors(e => ({ ...e, city: '' }));
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-[3px] ${
                      isSelected
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                        : `${cardClass} ${isDark ? 'text-white/60' : 'text-[#1F3D2B]/60'}`
                    }`}
                    style={{ fontFamily: fontCairo }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSelected && <Check className="w-3 h-3 inline-block ml-1" />}
                    {isEn ? city.nameEn : city.nameAr}
                  </motion.button>
                );
              })}
            </div>
            {errors.city && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-400 font-bold mt-2 flex items-center gap-1"
                style={{ fontFamily: fontCairo }}
              >
                <AlertCircle className="w-3 h-3" />
                {errors.city}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* District Selection */}
      <AnimatePresence>
        {selectedCity && selectedCity.districts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5"
          >
            <label
              className={`text-sm font-bold mb-3 block ${isDark ? 'text-white/70' : 'text-[#1F3D2B]/70'}`}
              style={{ fontFamily: fontCairo }}
            >
              {isEn ? 'District / Area (Optional)' : 'المنطقة / الحي (اختياري)'}
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedCity.districts.map(dist => {
                const isSelected = data.district === dist.id;
                return (
                  <button
                    key={dist.id}
                    onClick={() => onChange({ district: dist.id })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border-[3px] ${
                      isSelected
                        ? 'border-[#3B5BFE] bg-[#3B5BFE]/8 text-[#3B5BFE]'
                        : `${cardClass} ${isDark ? 'text-white/50' : 'text-[#1F3D2B]/50'}`
                    }`}
                    style={{ fontFamily: fontCairo }}
                  >
                    {isEn ? dist.nameEn : dist.nameAr}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleNext}
        className="w-full mt-6 py-4 rounded-2xl text-white font-bold text-base transition-all"
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
