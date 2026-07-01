import { CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { BietAlreefLogo } from './BietAlreefLogo';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
const logoImage = '/assets/logo.png';

export function VerificationPanel() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-[460px] h-auto"
    >
      {/* Glass Panel */}
      <div
        className="relative backdrop-blur-[22px] bg-white/35 rounded-[28px] p-10 border border-white/15"
        style={{
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <ImageWithFallback
            src={logoImage}
            alt="بيت الريف"
            className="w-[80px] h-[80px] object-contain"
          />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5B7FE8]/20 to-[#7B5FE8]/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[#5B7FE8]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 
            className="text-[24px] text-[#1A1A1A] mb-2"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
          >
            التحقق من الحساب
          </h1>
          <p 
            className="text-[14px] text-[#6F6F6F]/70 leading-relaxed"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            أدخل رمز التحقق المرسل إلى<br />
            <span className="text-[#5B7FE8]">example@email.com</span>
          </p>
        </div>

        {/* Verification Code Inputs */}
        <div className="flex justify-center gap-3 mb-8" dir="ltr">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              className="w-12 h-14 text-center text-[22px] bg-white/50 border border-[#6F6F6F]/20 rounded-[12px] focus:border-[#5B7FE8] focus:outline-none transition-all duration-200 text-[#1A1A1A]"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
            />
          ))}
        </div>

        {/* Verify Button */}
        <motion.button
          onClick={handleVerify}
          disabled={code.some(d => !d) || isVerifying}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#5B7FE8] to-[#7B5FE8] text-white rounded-[20px] hover:opacity-90 transition-opacity duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
          whileHover={{ scale: code.some(d => !d) ? 1 : 1.01 }}
          whileTap={{ scale: code.some(d => !d) ? 1 : 0.99 }}
        >
          {isVerifying ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <span>جاري التحقق...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>تحقق من الحساب</span>
            </>
          )}
        </motion.button>

        {/* Resend Code */}
        <div className="text-center mt-6">
          <p 
            className="text-[13px] text-[#6F6F6F]/60 mb-2"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            لم تستلم الرمز؟
          </p>
          <button 
            className="text-[13px] text-[#5B7FE8] hover:underline"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
          >
            إعادة إرسال الرمز
          </button>
        </div>

        {/* Terms */}
        <p 
          className="text-center text-[11px] text-[#6F6F6F]/60 mt-6 leading-relaxed"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          نحن نحمي خصوصيتك. لن يتم مشاركة بياناتك
        </p>
      </div>
    </motion.div>
  );
}