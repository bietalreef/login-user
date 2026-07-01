/**
 * WayakScreen.tsx — واجهة دردشة وياك المحسّنة
 * ═══════════════════════════════════════════════
 * - وياك يرد ببطاقات عرض (Provider Cards) عند البحث عن مزودين
 * - شريط الإدخال ثابت أسفل الشاشة مع أزرار: دردشة جديدة، إعدادات، إغلاق
 * - تنفيذ مباشر بدون رسائل نصية فقط
 */

import {
  X, Mic, Send, Volume2, Settings,
  Lightbulb,
  Palette, Phone, MessageCircle, MapPin, Star,
  Paperclip, Monitor, Plus,
  Zap,
  Shield, Navigation, Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Icon3D } from '../ui/Icon3D';
import wayakCharacterImg from 'figma:asset/c33d475de03bd99055b12c89eb52fa7b9aa3f848.png';

// ═══════════════════════════════════════
// Types
// ═══════════════════════════════════════
interface ProviderCard {
  id: string;
  name: string;
  rating: number;
  location: string;
  city: string;
  description: string;
  services: string[];
  phone: string;
  hasWhatsapp: boolean;
  hasMap: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'wayak';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  /** Card-based response */
  responseType?: 'text' | 'cards' | 'action';
  cards?: ProviderCard[];
  actionTitle?: string;
}

interface WayakScreenProps {
  onClose: () => void;
  onOpenComputer?: () => void;
  initialTask?: string;
}

// ═══════════════════════════════════════
// Provider Mock Data
// ═══════════════════════════════════════
const PLUMBER_PROVIDERS: ProviderCard[] = [
  {
    id: 'p1', name: 'شركة الهدى', rating: 4.3, location: 'الجيمي', city: 'العين',
    description: 'سبّاك بالعين شاطر ومعتمد يقوم بتركيب الألمنيوم والأدوات والخلاطات',
    services: ['كشف تسربات', 'تركيب ألمنيوم', 'أدوات صحية'],
    phone: '0557821580', hasWhatsapp: true, hasMap: true,
  },
  {
    id: 'p2', name: 'شركة صقر الإمارات', rating: 4.8, location: 'الشارقة', city: 'العين',
    description: 'أفضل شركة لتوفير أفضل السباكين مع أسعار منخفضة وخدمة ممتازة',
    services: ['صيانة', 'خدمة 24 ساعة', 'سباكة محترفة'],
    phone: '0547426362', hasWhatsapp: true, hasMap: true,
  },
  {
    id: 'p3', name: 'المحترف للصيانة', rating: 4.5, location: 'الكرامة', city: 'العين',
    description: 'خدمة 24 ساعة — أعمال السباكة وتصليح المواسير والكشف عن تسربات المياه بجودة عالية',
    services: ['كشف التسربات', 'تصليح المواسير', 'تركيب الأدوات الصحية'],
    phone: '0553609903', hasWhatsapp: true, hasMap: true,
  },
  {
    id: 'p4', name: 'شركة تبارك', rating: 4.6, location: 'المرابة', city: 'العين',
    description: 'من أفضل الشركات المتخصصة في السباكة في الإمارات مع فريق محترف',
    services: ['تصليح السباكة', 'تركيب', 'صيانة شاملة', 'سباكين محترفين'],
    phone: '0563361992', hasWhatsapp: true, hasMap: true,
  },
  {
    id: 'p5', name: 'شركة بيت الخبره', rating: 4.2, location: 'الهيلي', city: 'العين',
    description: 'شركة متخصصة في الديكورات والتشطيبات والسباكة بجودة عالية',
    services: ['ديكورات', 'تشطيبات', 'سباكة وتشطيبات'],
    phone: '0506691641', hasWhatsapp: true, hasMap: true,
  },
  {
    id: 'p6', name: 'فنون ليزا', rating: 4.6, location: 'المرابة', city: 'العين',
    description: 'من أفضل الشركات المتخصصة في السباكة في الإمارات مع فريق محترف',
    services: ['تصليح السباكة', 'تركيب', 'صيانة شاملة'],
    phone: '0566225211', hasWhatsapp: true, hasMap: true,
  },
];

const ELECTRICIAN_PROVIDERS: ProviderCard[] = [
  {
    id: 'e1', name: 'الكهربائي المحترف', rating: 4.7, location: 'النهدة', city: 'دبي',
    description: 'خدمات كهربائية شاملة — تمديدات، صيانة، وتركيب أنظمة إضاءة حديثة',
    services: ['تمديدات كهربائية', 'صيانة', 'إضاءة حديثة'],
    phone: '0501234567', hasWhatsapp: true, hasMap: true,
  },
  {
    id: 'e2', name: 'شركة النور للكهرباء', rating: 4.5, location: 'ديرة', city: 'دبي',
    description: 'متخصصون في الأنظمة الكهربائية للفلل والمباني التجارية',
    services: ['أنظمة ذكية', 'لوحات كهربائية', 'طوارئ 24/7'],
    phone: '0509876543', hasWhatsapp: true, hasMap: true,
  },
];

const CONTRACTOR_PROVIDERS: ProviderCard[] = [
  {
    id: 'c1', name: 'مقاولات الخليج', rating: 4.9, location: 'شارع الشيخ زايد', city: 'دبي',
    description: 'مقاولات عامة — بناء فلل ومباني تجارية مع ضمان 10 سنوات',
    services: ['بناء فلل', 'تشطيبات', 'إشراف هندسي'],
    phone: '0551112233', hasWhatsapp: true, hasMap: true,
  },
  {
    id: 'c2', name: 'شركة الإعمار للمقاولات', rating: 4.6, location: 'جزيرة الريم', city: 'أبوظبي',
    description: 'خبرة 15 سنة في المقاولات العامة والتشطيبات الفاخرة',
    services: ['مقاولات عامة', 'تشطيبات فاخرة', 'ترميم'],
    phone: '0554445566', hasWhatsapp: true, hasMap: true,
  },
];

// Search keyword mapping
function detectProviderSearch(text: string): { found: boolean; type: string; providers: ProviderCard[] } {
  const lower = text.toLowerCase();
  const plumberKeywords = ['سباك', 'سباكة', 'سبّاك', 'مواسير', 'تسربات', 'plumber', 'plumbing'];
  const electricianKeywords = ['كهربائي', 'كهرباء', 'تمديدات', 'electrician', 'electrical'];
  const contractorKeywords = ['مقاول', 'مقاولات', 'بناء', 'contractor', 'مقاولين'];
  const paintKeywords = ['دهان', 'دهانات', 'صباغ', 'طلاء', 'painter', 'painting'];
  const searchKeywords = ['ابحث', 'بحث', 'دور', 'ابي', 'ابغي', 'أبي', 'أبغي', 'وين', 'أحتاج', 'احتاج', 'search', 'find'];

  const hasSearchIntent = searchKeywords.some(k => lower.includes(k)) || true; // always detect if provider type found

  if (plumberKeywords.some(k => lower.includes(k))) return { found: true, type: 'السباكين', providers: PLUMBER_PROVIDERS };
  if (electricianKeywords.some(k => lower.includes(k))) return { found: true, type: 'الكهربائيين', providers: ELECTRICIAN_PROVIDERS };
  if (contractorKeywords.some(k => lower.includes(k))) return { found: true, type: 'المقاولين', providers: CONTRACTOR_PROVIDERS };
  if (paintKeywords.some(k => lower.includes(k))) return { found: true, type: 'الصباغين', providers: PLUMBER_PROVIDERS.map(p => ({ ...p, id: 'paint-' + p.id, services: ['دهانات داخلية', 'دهانات خارجية', 'ورق جدران'] })) };

  return { found: false, type: '', providers: [] };
}

// ═══════════════════════════════════════
// Main Component
// ═══════════════════════════════════════
export function WayakScreen({ onClose, onOpenComputer, initialTask }: WayakScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'wayak',
      content: 'وياك — جلسة تنفيذ',
      timestamp: new Date(),
      responseType: 'text',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const initialTaskSentRef = useRef(false);

  // Settings State
  const [aiModel, setAiModel] = useState('gpt-4');
  const [temperature, setTemperature] = useState(0.7);
  const [responseLength, setResponseLength] = useState('medium');
  const [voiceGender, setVoiceGender] = useState('male');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [autoPlayVoice, setAutoPlayVoice] = useState(false);
  const [bgTheme, setBgTheme] = useState('cream');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingDuration(0);
    }
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setChatStarted(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    const query = inputText;
    setInputText('');
    setIsTyping(true);

    // Check for provider search
    const searchResult = detectProviderSearch(query);

    setTimeout(() => {
      if (searchResult.found) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'wayak',
          content: `محرك البحث عن ${searchResult.type}`,
          timestamp: new Date(),
          responseType: 'cards',
          cards: searchResult.providers,
          actionTitle: `محرك البحث عن ${searchResult.type}`,
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Default smart text responses
        const responses = [
          'فهمت طلبك. الموصلات النشطة: لا يوجد بعد.\nيمكنك ربط المزيد من الخدمات.',
          'تم تحليل طلبك. سأقوم بتنفيذ المهمة مباشرة.',
          'جاهز للتنفيذ. هل تريد تفاصيل إضافية؟',
        ];

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'wayak',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          responseType: 'text',
        };
        setMessages(prev => [...prev, aiMessage]);
      }
      setIsTyping(false);
    }, 1200);
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setChatStarted(true);

      const voiceMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: 'رسالة صوتية',
        timestamp: new Date(),
        isVoice: true,
      };

      setMessages(prev => [...prev, voiceMessage]);
      setIsTyping(true);

      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'wayak',
          content: 'تم استلام رسالتك الصوتية. كيف يمكنني مساعدتك؟',
          timestamp: new Date(),
          responseType: 'text',
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 2000);
    } else {
      setIsRecording(true);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'wayak',
      content: 'وياك — جلسة تنفيذ',
      timestamp: new Date(),
      responseType: 'text',
    }]);
    setChatStarted(false);
  };

  // Background Themes — warm tones, no green
  const bgThemes: Record<string, { bg: string; surface: string }> = {
    cream: { bg: 'bg-gradient-to-b from-[#F5F0E8] via-[#FFF8EE] to-[#F5F0E8]', surface: '#FFF8EE' },
    dark: { bg: 'bg-gradient-to-b from-[#0B1120] via-[#111827] to-[#0B1120]', surface: '#111827' },
    royal: { bg: 'bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#1E293B]', surface: '#0F172A' },
  };

  const currentBg = bgThemes[bgTheme] || bgThemes.cream;
  const isDarkMode = bgTheme === 'dark' || bgTheme === 'royal';

  // ── Auto-send initialTask (from ShopScreen or Dashboard button) ──
  useEffect(() => {
    if (!initialTask || initialTaskSentRef.current) return;
    initialTaskSentRef.current = true;

    // Pre-fill the input so the user sees the task
    setInputText(initialTask);
    setChatStarted(true);

    // Auto-send after a short delay so the user sees what was typed
    const timer = setTimeout(() => {
      const userMsg: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: initialTask,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMsg]);
      setInputText('');
      setIsTyping(true);

      const searchResult = detectProviderSearch(initialTask);

      setTimeout(() => {
        if (searchResult.found) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'wayak',
            content: `محرك البحث عن ${searchResult.type}`,
            timestamp: new Date(),
            responseType: 'cards',
            cards: searchResult.providers,
            actionTitle: `محرك البحث عن ${searchResult.type}`,
          };
          setMessages(prev => [...prev, aiMessage]);
        } else {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'wayak',
            content: 'تم استلام مهمتك. سأبدأ العمل عليها فوراً — هل تريد إضافة تفاصيل أو متطلبات خاصة؟',
            timestamp: new Date(),
            responseType: 'text',
          };
          setMessages(prev => [...prev, aiMessage]);
        }
        setIsTyping(false);
      }, 1200);
    }, 800);

    return () => clearTimeout(timer);
  }, [initialTask]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${currentBg.bg} overflow-hidden`} dir="rtl">

      {/* ═══ Top Header — Compact ═══ */}
      <div className="relative z-10 px-4 py-2.5 flex items-center justify-between" style={{ background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'transparent' }}>
        {/* Right: Back + notification */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}
          >
            <X className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Center: Wayak avatar + status */}
        <div className="flex items-center gap-2">
          <motion.div
            className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(59,91,254,0.15))',
              border: '2px solid rgba(212,175,55,0.4)',
            }}
          >
            <img
              src={wayakCharacterImg}
              alt="وياك"
              className="w-7 h-7 object-contain"
              draggable={false}
            />
            <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-[#D4AF37] border-2 border-white" />
          </motion.div>
          <div className="flex items-center gap-1.5">
            <Search className={`w-3.5 h-3.5 ${isDarkMode ? 'text-white/60' : 'text-gray-400'}`} />
            <MapPin className={`w-3.5 h-3.5 ${isDarkMode ? 'text-white/60' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Left: Menu */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSettings(true)}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}
          >
            <Settings className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>

      {/* ═══ Messages Area — Scrollable ═══ */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 relative z-10">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.type === 'user' ? (
                /* ── User Message Bubble ── */
                <div className="flex justify-start">
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
                    isDarkMode
                      ? 'bg-white/10 text-white'
                      : 'bg-[#FFF3D0] text-[#5D4037]'
                  }`}>
                    {message.isVoice ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
                          <Volume2 className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-0.5">
                            {[...Array(15)].map((_, i) => (
                              <div key={i} className="w-0.5 bg-[#D4AF37] rounded-full" style={{ height: `${Math.random() * 16 + 6}px` }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {message.content}
                      </p>
                    )}
                  </div>
                </div>
              ) : message.responseType === 'cards' && message.cards ? (
                /* ── Wayak Card Response ── */
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0"
                      style={{ background: 'rgba(212,175,55,0.15)', border: '1.5px solid rgba(212,175,55,0.3)' }}>
                      <img src={wayakCharacterImg} alt="" className="w-full h-full object-contain" />
                    </div>
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#D4AF37]'}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                      وياك
                    </span>
                    <Shield className="w-3 h-3 text-[#D4AF37]" />
                  </div>

                  {/* Action Title Bar */}
                  <div className={`rounded-xl px-4 py-2.5 flex items-center gap-2 ${
                    isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'
                  }`}>
                    <Search className={`w-4 h-4 ${isDarkMode ? 'text-white/60' : 'text-gray-400'}`} />
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {message.actionTitle}
                    </span>
                    <span className={`text-xs mr-auto ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>
                      برنامج
                    </span>
                  </div>

                  {/* Provider Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {message.cards.map(card => (
                      <ProviderCardComponent key={card.id} card={card} isDark={isDarkMode} />
                    ))}
                  </div>
                </div>
              ) : (
                /* ── Wayak Text Bubble ── */
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0"
                    style={{ background: 'rgba(212,175,55,0.15)', border: '1.5px solid rgba(212,175,55,0.3)' }}>
                    <img src={wayakCharacterImg} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                    isDarkMode
                      ? 'bg-white/10 backdrop-blur-md text-white'
                      : 'bg-white text-[#5D4037]'
                  }`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-bold text-[#D4AF37]" style={{ fontFamily: 'Cairo, sans-serif' }}>وياك</span>
                      <Shield className="w-2.5 h-2.5 text-[#D4AF37]" />
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {message.content}
                    </p>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <p className={`text-[10px] mt-1 px-10 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0"
              style={{ background: 'rgba(212,175,55,0.15)', border: '1.5px solid rgba(212,175,55,0.3)' }}>
              <motion.img
                src={wayakCharacterImg}
                alt=""
                className="w-full h-full object-contain"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </div>
            <div className={`rounded-2xl px-4 py-3 shadow-sm ${isDarkMode ? 'bg-white/10' : 'bg-white'}`}>
              <div className="flex gap-1.5">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-[#D4AF37] rounded-full"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ═══ Bottom Fixed Chat Input Bar ═══ */}
      <div className={`relative z-10 border-t px-3 py-3 ${
        isDarkMode
          ? 'bg-[#0B1120]/90 backdrop-blur-xl border-white/10'
          : 'bg-white/90 backdrop-blur-xl border-gray-200'
      }`}>
        {/* Text Input Row */}
        <div className="flex items-end gap-2">
          {/* Send / Arrow Up */}
          <motion.button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
              inputText.trim()
                ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8940E] shadow-lg'
                : isDarkMode ? 'bg-white/10' : 'bg-gray-100'
            }`}
            whileTap={{ scale: inputText.trim() ? 0.9 : 1 }}
          >
            <Send className={`w-4 h-4 ${inputText.trim() ? 'text-white' : isDarkMode ? 'text-white/30' : 'text-gray-400'}`} />
          </motion.button>

          {/* Text Area */}
          <div className={`flex-1 rounded-2xl px-4 py-2.5 ${
            isDarkMode
              ? 'bg-white/5 border border-white/10'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="كلّف وياك بمهمة — ابحث عن مقاول، قدّر تكلفة، أنشئ عقداً..."
              className={`w-full bg-transparent outline-none resize-none text-sm ${
                isDarkMode
                  ? 'text-white placeholder:text-white/30'
                  : 'text-[#5D4037] placeholder:text-gray-400'
              }`}
              rows={1}
              style={{ maxHeight: '80px', fontFamily: 'Cairo, sans-serif' }}
            />
          </div>

          {/* Voice */}
          <motion.button
            onClick={handleVoiceRecord}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isRecording
                ? 'bg-red-500 shadow-lg shadow-red-500/50'
                : isDarkMode ? 'bg-white/10' : 'bg-gray-100'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <Mic className={`w-4 h-4 ${isRecording ? 'text-white' : isDarkMode ? 'text-white/60' : 'text-gray-500'}`} />
          </motion.button>

          {/* Attachment */}
          <button className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isDarkMode ? 'bg-white/10' : 'bg-gray-100'
          }`}>
            <Paperclip className={`w-4 h-4 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`} />
          </button>
        </div>

        {/* Bottom Action Buttons Row: Computer + New Chat + Settings + Close */}
        <div className="flex items-center justify-center gap-3 mt-2.5 pt-2 border-t border-dashed"
          style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>

          {/* Computer وياك */}
          {onOpenComputer && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenComputer}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                isDarkMode
                  ? 'bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37]'
                  : 'bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#B8940E]'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              <Monitor className="w-3.5 h-3.5" />
              كمبيوتر
            </motion.button>
          )}

          {/* Connectors */}
          <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
            isDarkMode
              ? 'bg-white/5 border-white/10 text-white/60'
              : 'bg-gray-50 border-gray-200 text-gray-500'
          }`} style={{ fontFamily: 'Cairo, sans-serif' }}>
            <Zap className="w-3.5 h-3.5" />
            الموصلات
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* New Chat */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={clearChat}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title="دردشة جديدة"
          >
            <Plus className={`w-4 h-4 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`} />
          </motion.button>

          {/* Settings */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSettings(!showSettings)}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title="الإعدادات"
          >
            <Settings className={`w-4 h-4 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`} />
          </motion.button>

          {/* Close */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-red-500/10 hover:bg-red-500/20' : 'bg-red-50 hover:bg-red-100'
            }`}
            title="إغلاق"
          >
            <X className={`w-4 h-4 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
          </motion.button>
        </div>
      </div>

      {/* ═══ Settings Panel ═══ */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20"
              onClick={() => setShowSettings(false)}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full md:w-[400px] bg-white/95 backdrop-blur-xl z-30 overflow-y-auto shadow-2xl"
              dir="rtl"
            >
              {/* Panel Header */}
              <div className="sticky top-0 bg-gradient-to-br from-[#D4AF37] to-[#5D4037] px-6 py-5 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon3D icon={Settings} theme="gold" size="sm" hoverable={false} />
                    <h2 className="text-white font-bold text-xl" style={{ fontFamily: 'Cairo, sans-serif' }}>الإعدادات</h2>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Panel Content */}
              <div className="p-6 space-y-6">
                {/* Background Theme */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-200">
                  <h3 className="font-bold text-[#5D4037] mb-4 flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    <Icon3D icon={Palette} theme="rose" size="xs" hoverable={false} />
                    ألوان الخلفية
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'cream', name: 'فاتح كريمي', colors: ['#F5F0E8', '#FFF8EE', '#F5F0E8'] },
                      { id: 'dark', name: 'داكن', colors: ['#0B1120', '#111827', '#0B1120'] },
                      { id: 'royal', name: 'أزرق ملكي', colors: ['#1E293B', '#0F172A', '#1E293B'] },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setBgTheme(theme.id)}
                        className={`p-3 rounded-xl transition-all relative overflow-hidden ${
                          bgTheme === theme.id ? 'ring-4 ring-[#D4AF37] scale-105' : 'ring-1 ring-gray-300'
                        }`}
                      >
                        <div
                          className="w-full h-12 rounded-lg mb-2"
                          style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]}, ${theme.colors[2]})` }}
                        />
                        <p className="text-xs font-bold text-[#5D4037] text-center" style={{ fontFamily: 'Cairo, sans-serif' }}>{theme.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Model */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-200">
                  <h3 className="font-bold text-[#5D4037] mb-4 flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    <Icon3D icon={Lightbulb} theme="amber" size="xs" hoverable={false} />
                    نموذج الذكاء الاصطناعي
                  </h3>
                  <div className="space-y-3">
                    {[
                      { id: 'gpt-4', name: 'GPT-4 Turbo', desc: 'الأكثر ذكاءً وتطوراً' },
                      { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', desc: 'سريع ومتوازن' },
                      { id: 'claude', name: 'Claude 3', desc: 'ممتاز للمحادثات الطويلة' },
                    ].map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setAiModel(model.id)}
                        className={`w-full p-3 rounded-xl text-right transition-all ${
                          aiModel === model.id
                            ? 'bg-gradient-to-br from-[#D4AF37] to-[#3B5BFE] text-white shadow-lg'
                            : 'bg-white/80 text-[#5D4037] hover:bg-white'
                        }`}
                      >
                        <div className="font-bold text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>{model.name}</div>
                        <div className={`text-xs ${aiModel === model.id ? 'text-white/80' : 'text-gray-500'}`}>{model.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Temperature */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-200">
                  <h3 className="font-bold text-[#5D4037] mb-3 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>درجة الإبداع</h3>
                  <div className="flex justify-between text-xs text-gray-600 mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    <span>دقيق</span>
                    <span className="font-bold text-[#D4AF37]">{temperature.toFixed(1)}</span>
                    <span>مبدع</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-[#D4AF37]"
                  />
                </div>

                {/* Save */}
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-gradient-to-br from-[#D4AF37] to-[#3B5BFE] text-white font-bold py-3 rounded-xl shadow-lg"
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  حفظ الإعدادات
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ Voice Recording Overlay ═══ */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl">
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(239, 68, 68, 0.4)',
                    '0 0 0 20px rgba(239, 68, 68, 0)',
                    '0 0 0 0 rgba(239, 68, 68, 0)'
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Mic className="w-10 h-10 text-white" />
              </motion.div>
              <p className="text-2xl font-bold text-[#5D4037]" style={{ fontFamily: 'Cairo, sans-serif' }}>{formatDuration(recordingDuration)}</p>
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>جاري التسجيل...</p>
              <button
                onClick={handleVoiceRecord}
                className="px-8 py-3 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                إيقاف التسجيل
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// Provider Card Component — بطاقة مزود الخدمة
// ═══════════════════════════════════════════════════════
function ProviderCardComponent({ card, isDark }: { card: ProviderCard; isDark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.5)' : '0 8px 30px rgba(0,0,0,0.1)' }}
      className={`rounded-xl overflow-hidden transition-all ${
        isDark
          ? 'bg-white/5 border border-white/10'
          : 'bg-white border border-gray-200 shadow-sm'
      }`}
      style={{ fontFamily: 'Cairo, sans-serif' }}
    >
      {/* Card Header: Name + Rating */}
      <div className="p-3 pb-2">
        <div className="flex items-start justify-between mb-1">
          <h3 className={`text-sm font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {card.name}
          </h3>
          <div className="flex items-center gap-0.5 flex-shrink-0 mr-2">
            <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{card.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mb-2">
          <MapPin className={`w-3 h-3 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
          <span className={`text-[11px] ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
            {card.location}، {card.city}
          </span>
        </div>
        <p className={`text-[11px] leading-relaxed mb-2 line-clamp-2 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
          {card.description}
        </p>

        {/* Services Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          <span className={`text-[10px] font-bold ${isDark ? 'text-white/40' : 'text-gray-400'}`}>الخدمات</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {card.services.map((svc, i) => (
            <span
              key={i}
              className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                isDark
                  ? 'bg-white/5 text-white/60 border border-white/10'
                  : 'bg-gray-50 text-gray-600 border border-gray-100'
              }`}
            >
              {svc}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t px-2 py-2 flex flex-col gap-1.5"
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>

        {/* Call Now — Gold/Brown button */}
        <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white text-xs font-bold transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #B8940E)' }}>
          <Phone className="w-3.5 h-3.5" />
          اتصل الآن: {card.phone}
        </button>

        {/* WhatsApp + Map Row */}
        <div className="flex gap-1.5">
          {card.hasWhatsapp && (
            <button className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold ${
              isDark ? 'bg-white/5 text-white/70 hover:bg-white/10' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}>
              <MessageCircle className="w-3.5 h-3.5" />
              واتساب
            </button>
          )}
          {card.hasMap && (
            <button className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold ${
              isDark ? 'bg-white/5 text-white/70 hover:bg-white/10' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}>
              <Navigation className="w-3.5 h-3.5" />
              الموقع على الخريطة
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}