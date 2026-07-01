/**
 * IdentityStep.tsx — الخطوة 3: التوثيق (اختياري)
 * ═══════════════════════════════════════════════════
 * UAE Pass (فوري) أو رفع صور الهوية (24-48 ساعة) أو "لاحقاً"
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon3D } from '../ui/Icon3D';
import {
  Shield, Upload, Camera, Fingerprint, Clock,
  Check, X, AlertCircle, Image as ImageIcon, ExternalLink,
  SkipForward,
} from 'lucide-react';

const fontCairo = 'Cairo, Tajawal, sans-serif';

interface IdentityStepProps {
  data: {
    verification_method: 'none' | 'uae_pass' | 'id_upload';
    emirates_id_front: File | null;
    emirates_id_back: File | null;
    uae_pass_verified: boolean;
  };
  onChange: (data: Partial<IdentityStepProps['data']>) => void;
  onNext: () => void;
  onSkip: () => void;
  isEn: boolean;
  isDark: boolean;
}

export function IdentityStep({ data, onChange, onNext, onSkip, isEn, isDark }: IdentityStepProps) {
  const [selectedMethod, setSelectedMethod] = useState<'none' | 'uae_pass' | 'id_upload'>(data.verification_method || 'none');
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [uaePassLoading, setUaePassLoading] = useState(false);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/50' : 'text-[#1F3D2B]/50';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const cardClass = isDark
    ? 'bg-white/8 border-white/10'
    : 'bg-white border-gray-200/60';

  const handleFileSelect = (side: 'front' | 'back', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (side === 'front') {
        setFrontPreview(e.target?.result as string);
        onChange({ emirates_id_front: file });
      } else {
        setBackPreview(e.target?.result as string);
        onChange({ emirates_id_back: file });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUaePass = async () => {
    setUaePassLoading(true);
    // UAE Pass integration placeholder
    // In production: redirect to UAE Pass OAuth
    setTimeout(() => {
      setUaePassLoading(false);
      onChange({ uae_pass_verified: true, verification_method: 'uae_pass' });
    }, 2000);
  };

  const handleContinue = () => {
    onChange({ verification_method: selectedMethod });
    onNext();
  };

  const canProceed = selectedMethod === 'uae_pass'
    ? data.uae_pass_verified
    : selectedMethod === 'id_upload'
      ? data.emirates_id_front && data.emirates_id_back
      : false;

  const methods = [
    {
      id: 'uae_pass' as const,
      title: isEn ? 'UAE Pass (Instant)' : 'UAE Pass (فوري)',
      subtitle: isEn
        ? 'Verify instantly via UAE digital identity'
        : 'التوثيق الفوري عبر بوابة الهوية الرقمية',
      icon: Fingerprint,
      theme: 'blue',
      color: '#3B5BFE',
      badge: isEn ? 'Recommended' : 'مُوصى به',
      details: isEn
        ? ['Instant verification', 'Pulls: Name, Gender, Age, Area', 'Most secure method']
        : ['توثيق فوري', 'يسحب: الاسم، النوع، العمر، المنطقة', 'الطريقة الأكثر أماناً'],
    },
    {
      id: 'id_upload' as const,
      title: isEn ? 'Upload Emirates ID' : 'رفع الهوية الإماراتية',
      subtitle: isEn
        ? 'Upload front & back of your Emirates ID'
        : 'ارفع الوجه الأمامي والخلفي للهوية',
      icon: Upload,
      theme: 'gold',
      color: '#D4AF37',
      badge: null,
      details: isEn
        ? ['Upload 2 photos (front + back)', 'Review within 24-48 hours', 'Your data is encrypted']
        : ['ارفع صورتين (أمامي + خلفي)', 'المراجعة خلال 24-48 ساعة', 'بياناتك مشفرة'],
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
          <Icon3D icon={Shield} theme="gold" size="xl" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xl font-black mb-1 ${textClass}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'Identity Verification' : 'توثيق الهوية'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-sm ${mutedClass}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn
            ? 'Optional — you can verify later from Settings'
            : 'اختياري — يمكنك التوثيق لاحقاً من الإعدادات'}
        </motion.p>
      </div>

      {/* Method Selection */}
      <div className="space-y-3 mb-5">
        {methods.map((method, idx) => {
          const isSelected = selectedMethod === method.id;
          return (
            <motion.button
              key={method.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.08 }}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full text-right rounded-2xl overflow-hidden transition-all border-[4px] ${
                isSelected
                  ? isDark
                    ? 'border-[#D4AF37] bg-white/10'
                    : `bg-white`
                  : isDark
                    ? 'border-white/10 bg-white/5'
                    : 'border-gray-200/60 bg-white'
              }`}
              style={{
                borderColor: isSelected ? method.color : undefined,
                backdropFilter: isDark ? 'blur(20px)' : undefined,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Icon3D icon={method.icon} theme={method.theme} size="sm" hoverable={false} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-bold text-sm ${textClass}`}
                        style={{ fontFamily: fontCairo }}
                      >
                        {method.title}
                      </h3>
                      {method.badge && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white"
                          style={{ background: method.color }}
                        >
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-0.5 ${mutedClass}`}
                      style={{ fontFamily: fontCairo }}
                    >
                      {method.subtitle}
                    </p>
                  </div>
                  {/* Radio */}
                  <div
                    className={`w-6 h-6 rounded-full border-[3px] flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-[#D4AF37]' : isDark ? 'border-white/20' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 rounded-full bg-[#D4AF37]"
                      />
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 pt-3 border-t border-dashed space-y-1.5"
                      style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E6DCC8' }}
                    >
                      {method.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: method.color }} />
                          <span
                            className={`text-xs ${isDark ? 'text-white/60' : 'text-[#1F3D2B]/60'}`}
                            style={{ fontFamily: fontCairo }}
                          >
                            {detail}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* UAE Pass Action */}
      <AnimatePresence>
        {selectedMethod === 'uae_pass' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5"
          >
            {data.uae_pass_verified ? (
              <div className={`p-4 rounded-2xl border-[4px] border-[#3B5BFE]/30 bg-[#3B5BFE]/5`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3B5BFE]/15 flex items-center justify-center">
                    <Check className="w-5 h-5 text-[#3B5BFE]" />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${textClass}`} style={{ fontFamily: fontCairo }}>
                      {isEn ? 'UAE Pass Verified!' : 'تم التوثيق عبر UAE Pass!'}
                    </p>
                    <p className={`text-xs ${mutedClass}`} style={{ fontFamily: fontCairo }}>
                      {isEn ? 'Your identity has been confirmed' : 'تم تأكيد هويتك بنجاح'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleUaePass}
                disabled={uaePassLoading}
                className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #3B5BFE, #2845C7)',
                  fontFamily: fontCairo,
                }}
              >
                {uaePassLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    {isEn ? 'Connect with UAE Pass' : 'التوثيق عبر UAE Pass'}
                  </>
                )}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ID Upload Section */}
      <AnimatePresence>
        {selectedMethod === 'id_upload' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 mb-5"
          >
            {/* Front Side */}
            <div
              className={`p-4 rounded-2xl border-[4px] border-dashed transition-all ${
                frontPreview
                  ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5'
                  : `${cardClass}`
              }`}
            >
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect('front', file);
                }}
              />
              {frontPreview ? (
                <div className="relative">
                  <img src={frontPreview} alt="Front" className="w-full h-32 object-cover rounded-xl" />
                  <button
                    onClick={() => {
                      setFrontPreview(null);
                      onChange({ emirates_id_front: null });
                    }}
                    className="absolute top-2 left-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-[#D4AF37] text-white text-[10px] font-bold rounded-lg">
                    {isEn ? 'Front Side' : 'الوجه الأمامي'}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => frontInputRef.current?.click()}
                  className="w-full py-6 flex flex-col items-center gap-2"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <Camera className={`w-6 h-6 ${goldClass}`} />
                  </div>
                  <p className={`text-sm font-bold ${textClass}`} style={{ fontFamily: fontCairo }}>
                    {isEn ? 'Front Side of Emirates ID' : 'الوجه الأمامي للهوية'}
                  </p>
                  <p className={`text-xs ${mutedClass}`} style={{ fontFamily: fontCairo }}>
                    {isEn ? 'Tap to upload or take photo' : 'اضغط لرفع الصورة أو التقاطها'}
                  </p>
                </button>
              )}
            </div>

            {/* Back Side */}
            <div
              className={`p-4 rounded-2xl border-[4px] border-dashed transition-all ${
                backPreview
                  ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5'
                  : `${cardClass}`
              }`}
            >
              <input
                ref={backInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect('back', file);
                }}
              />
              {backPreview ? (
                <div className="relative">
                  <img src={backPreview} alt="Back" className="w-full h-32 object-cover rounded-xl" />
                  <button
                    onClick={() => {
                      setBackPreview(null);
                      onChange({ emirates_id_back: null });
                    }}
                    className="absolute top-2 left-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-[#D4AF37] text-white text-[10px] font-bold rounded-lg">
                    {isEn ? 'Back Side' : 'الوجه الخلفي'}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => backInputRef.current?.click()}
                  className="w-full py-6 flex flex-col items-center gap-2"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <ImageIcon className={`w-6 h-6 ${goldClass}`} />
                  </div>
                  <p className={`text-sm font-bold ${textClass}`} style={{ fontFamily: fontCairo }}>
                    {isEn ? 'Back Side of Emirates ID' : 'الوجه الخلفي للهوية'}
                  </p>
                  <p className={`text-xs ${mutedClass}`} style={{ fontFamily: fontCairo }}>
                    {isEn ? 'Tap to upload or take photo' : 'اضغط لرفع الصورة أو التقاطها'}
                  </p>
                </button>
              )}
            </div>

            {/* Time Notice */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isDark ? 'bg-white/5' : 'bg-[#D4AF37]/5'}`}>
              <Clock className={`w-4 h-4 ${goldClass}`} />
              <p className={`text-xs font-bold ${goldClass}`} style={{ fontFamily: fontCairo }}>
                {isEn ? 'Review takes 24-48 hours' : 'المراجعة تستغرق من 24 إلى 48 ساعة'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
      >
        <Shield className={`w-4 h-4 flex-shrink-0 ${goldClass}`} />
        <p className={`text-[11px] font-semibold ${mutedClass}`} style={{ fontFamily: fontCairo }}>
          {isEn
            ? 'Your data is encrypted and stored securely. We never share your personal information.'
            : 'بياناتك مشفرة ومحفوظة بأمان. لن نشارك معلوماتك الشخصية أبداً.'}
        </p>
      </motion.div>

      {/* Buttons */}
      <div className="space-y-3">
        {/* Continue (if method selected and requirements met) */}
        {canProceed && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #B8940E)',
              fontFamily: fontCairo,
            }}
          >
            {isEn ? 'Continue' : 'متابعة'}
          </motion.button>
        )}

        {/* ID Upload Continue (even without filling) */}
        {selectedMethod === 'id_upload' && !canProceed && (data.emirates_id_front || data.emirates_id_back) && (
          <p className={`text-xs text-center font-bold ${mutedClass}`} style={{ fontFamily: fontCairo }}>
            {isEn ? 'Please upload both sides of your Emirates ID' : 'يرجى رفع الوجهين (الأمامي والخلفي) للهوية'}
          </p>
        )}

        {/* Skip */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={onSkip}
          className={`w-full py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            isDark ? 'bg-white/5 text-white/40 hover:bg-white/10' : 'bg-gray-50 text-[#1F3D2B]/40 hover:bg-gray-100'
          }`}
          style={{ fontFamily: fontCairo }}
        >
          <SkipForward className="w-4 h-4" />
          {isEn ? 'Skip — verify later from Settings' : 'تخطي — التوثيق لاحقاً من الإعدادات'}
        </motion.button>
      </div>
    </div>
  );
}
