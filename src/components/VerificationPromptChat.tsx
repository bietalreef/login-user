import { motion } from 'framer-motion';
import { User, Cpu, CheckCircle, Shield } from 'lucide-react';
const Bot = Cpu;
const CheckCircle2 = CheckCircle;
import { useState, useEffect } from 'react';
const logoImage = '/assets/logo.png';

interface Message {
  id: number;
  type: 'bot' | 'system';
  text: string;
  delay: number;
}

const chatMessages: Message[] = [
  {
    id: 1,
    type: 'bot',
    text: 'تهانينا! تم إنشاء حسابك بنجاح',
    delay: 0.3,
  },
  {
    id: 2,
    type: 'bot',
    text: 'لكن هناك خطوة أخيرة مهمة...',
    delay: 1.5,
  },
  {
    id: 3,
    type: 'system',
    text: 'لماذا التوثيق مهم؟',
    delay: 2.5,
  },
  {
    id: 4,
    type: 'bot',
    text: '✅ حماية حسابك من الوصول غير المصرح',
    delay: 3.2,
  },
  {
    id: 5,
    type: 'bot',
    text: '✅ زيادة الثقة مع المقاولين والحرفيين',
    delay: 4.0,
  },
  {
    id: 6,
    type: 'bot',
    text: '✅ الوصول الكامل لجميع ميزات المنصة',
    delay: 4.8,
  },
  {
    id: 7,
    type: 'bot',
    text: '✅ تفعيل نظام الدفع الآمن',
    delay: 5.6,
  },
  {
    id: 8,
    type: 'bot',
    text: 'الأمر يستغرق أقل من دقيقة!',
    delay: 6.8,
  },
];

interface VerificationPromptChatProps {
  onVerify: () => void;
  onSkip: () => void;
}

export function VerificationPromptChat({ onVerify, onSkip }: VerificationPromptChatProps) {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);

  useEffect(() => {
    chatMessages.forEach((msg) => {
      setTimeout(() => {
        setVisibleMessages(prev => [...prev, msg.id]);
      }, msg.delay * 1000);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-[500px] h-auto max-h-[85vh]"
    >
      {/* Glass Panel */}
      <div
        className="relative backdrop-blur-[22px] bg-white/35 rounded-[28px] p-8 border border-white/15 flex flex-col"
        style={{
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-center mb-6 pb-4 border-b border-white/20">
          <ImageWithFallback
            src={logoImage}
            alt="بيت الريف"
            className="w-[60px] h-[60px] object-contain"
          />
          <div className="mr-3 text-right">
            <h2 
              className="text-[18px] text-[#1A1A1A]"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
            >
              مساعد بيت الريف
            </h2>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-[11px] text-[#D4AF37]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                متصل الآن
              </span>
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 max-h-[400px] px-2" dir="rtl">
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={visibleMessages.includes(msg.id) ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex justify-end"
            >
              <div className="flex items-end gap-2 max-w-[90%] flex-row-reverse">
                {/* Avatar - only for bot messages */}
                {msg.type === 'bot' && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#5B7FE8] to-[#7B5FE8]">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`px-4 py-3 rounded-[18px] shadow-sm ${
                  msg.type === 'system'
                    ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 border-2 border-[#FFD700]/40 text-[#1A1A1A] w-full text-center'
                    : 'bg-gradient-to-br from-[#5B7FE8] to-[#7B5FE8] text-white'
                }`}>
                  <p 
                    className={`text-[13px] leading-relaxed ${msg.type === 'system' ? 'font-semibold' : ''}`}
                    style={{ fontFamily: 'Cairo, sans-serif' }}
                  >
                    {msg.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: visibleMessages.length >= chatMessages.length ? 1 : 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          {/* Verify Button */}
          <motion.button
            onClick={onVerify}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#5B7FE8] to-[#7B5FE8] text-white rounded-[20px] hover:opacity-90 transition-opacity duration-200 shadow-md flex items-center justify-center gap-2"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>توثيق الحساب الآن</span>
          </motion.button>

          {/* Skip Button */}
          <motion.button
            onClick={onSkip}
            className="w-full px-6 py-3 bg-white/50 backdrop-blur-sm border border-white/40 text-[#6F6F6F] rounded-[20px] hover:bg-white/70 transition-all duration-200 flex items-center justify-center gap-2"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span>ربما لاحقاً</span>
          </motion.button>
        </motion.div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: visibleMessages.length >= chatMessages.length ? 1 : 0 }}
          transition={{ delay: 0.8 }}
          className="mt-4 p-3 bg-blue-50/50 rounded-[12px] border border-blue-200/30"
        >
          <p 
            className="text-[11px] text-[#5B7FE8] text-center leading-relaxed"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            الحسابات الموثقة تحصل على أولوية في الردود والعروض
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}