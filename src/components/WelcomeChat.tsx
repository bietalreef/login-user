import { motion } from 'framer-motion';
import { Cpu, CheckCircle } from 'lucide-react';
const Bot = Cpu;
import { useState, useEffect } from 'react';
const logoImage = '/assets/logo.png';

interface Message {
  id: number;
  type: 'bot' | 'user';
  text: string;
  delay: number;
}

const chatMessages: Message[] = [
  {
    id: 1,
    type: 'bot',
    text: 'مرحباً بك في بيت الريف!',
    delay: 0.3,
  },
  {
    id: 2,
    type: 'bot',
    text: 'منصتك الذكية للبناء والتشييد في الإمارات',
    delay: 1.2,
  },
  {
    id: 3,
    type: 'user',
    text: 'أهلاً! ماذا يمكنك أن تقدم لي؟',
    delay: 2.2,
  },
  {
    id: 4,
    type: 'bot',
    text: 'نربطك بأفضل المقاولين والحرفيين المرخصين في كل الإمارات',
    delay: 3.0,
  },
  {
    id: 5,
    type: 'bot',
    text: 'خدماتنا تشمل: البناء، التصميم، الكهرباء، السباكة، النجارة وأكثر!',
    delay: 4.2,
  },
  {
    id: 6,
    type: 'user',
    text: 'رائع! كيف أبدأ؟',
    delay: 5.4,
  },
  {
    id: 7,
    type: 'bot',
    text: 'سهل جداً! اختر نوع حسابك وابدأ رحلتك معنا',
    delay: 6.2,
  },
];

interface WelcomeChatProps {
  onContinue: () => void;
}

export function WelcomeChat({ onContinue }: WelcomeChatProps) {
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
      className="w-[480px] h-auto max-h-[85vh]"
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
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 max-h-[450px] px-2" dir="rtl">
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={visibleMessages.includes(msg.id) ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`flex ${msg.type === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex items-end gap-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.type === 'bot' 
                    ? 'bg-gradient-to-br from-[#5B7FE8] to-[#7B5FE8]' 
                    : 'bg-white/60 border border-white/40'
                }`}>
                  {msg.type === 'bot' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-[#5B7FE8]" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`px-4 py-3 rounded-[18px] shadow-sm ${
                  msg.type === 'bot'
                    ? 'bg-gradient-to-br from-[#5B7FE8] to-[#7B5FE8] text-white'
                    : 'bg-white/70 backdrop-blur-sm border border-white/40 text-[#1A1A1A]'
                }`}>
                  <p 
                    className="text-[13px] leading-relaxed"
                    style={{ fontFamily: 'Cairo, sans-serif' }}
                  >
                    {msg.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Continue Button */}
        <motion.button
          onClick={onContinue}
          initial={{ opacity: 0 }}
          animate={{ opacity: visibleMessages.length >= chatMessages.length ? 1 : 0 }}
          transition={{ delay: 0.5 }}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#5B7FE8] to-[#7B5FE8] text-white rounded-[20px] hover:opacity-90 transition-opacity duration-200 shadow-md flex items-center justify-center gap-2"
          style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <span>ابدأ الآن</span>
          <Sparkles className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}