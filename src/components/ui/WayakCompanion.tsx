/**
 * WayakCompanion.tsx — نظام رفيق ياك الذكي ثلاثي الأبعاد
 * ═══════════════════════════════════════════════════════════
 * شخصية إماراتية 3D حقيقية تمشي على الشاشة أثناء التحميل
 * كل قسم في المنصة له ألوان وتوهج ورسائل مختلفة
 * أنيميشن طفو + تنفس + تمايل + ظل + توهج + صوت
 */

import { useState, useEffect, useCallback, createContext, useContext, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Building2, Wrench, Settings, Cpu, ShoppingCart, MapPin,
  Shield, Sparkles, Layers as FolderKanban, FileText, Wallet, User,
} from 'lucide-react';
import { Icon3D } from './Icon3D';

// Wayak Agent Logo
import wayakCharacterImg from 'figma:asset/c33d475de03bd99055b12c89eb52fa7b9aa3f848.png';

// ═══════════════════════════════════════
// Knowledge Base Integration
// ═══════════════════════════════════════
import { APP_SECTIONS, type AppSection } from './WayakKnowledge';

/** Map WayakSection → APP_SECTIONS ID for knowledge enrichment */
const SECTION_TO_KNOWLEDGE: Record<string, string> = {
  construction: 'services',
  services: 'services',
  tools: 'tools',
  'ai-tools': 'tools',
  shop: 'shop',
  maps: 'maps',
  auth: 'profile',
  general: 'home',
  projects: 'workspace',
  rfq: 'offers',
  wallet: 'wallet',
  profile: 'profile',
};

/** Get enriched tips from knowledge base for a given section */
function getKnowledgeTips(section: WayakSection, isEn: boolean): string[] {
  const knowledgeId = SECTION_TO_KNOWLEDGE[section];
  if (!knowledgeId) return [];
  const appSection = APP_SECTIONS.find(s => s.id === knowledgeId);
  if (!appSection) return [];
  return isEn ? appSection.tips_en : appSection.tips_ar;
}

/** Get section description from knowledge base */
function getKnowledgeDescription(section: WayakSection, isEn: boolean): string | null {
  const knowledgeId = SECTION_TO_KNOWLEDGE[section];
  if (!knowledgeId) return null;
  const appSection = APP_SECTIONS.find(s => s.id === knowledgeId);
  if (!appSection) return null;
  return isEn ? appSection.description_en : appSection.description_ar;
}

// ═══════════════════════════════════════
// Section Types
// ═══════════════════════════════════════
export type WayakSection =
  | 'construction' | 'services' | 'tools' | 'ai-tools'
  | 'shop' | 'maps' | 'auth' | 'general' | 'projects'
  | 'rfq' | 'wallet' | 'profile';

// ═══════════════════════════════════════
// Section Configuration
// ═══════════════════════════════════════
interface SectionConfig {
  color: string;
  glowColor: string;
  ringColor: string;
  messagesAr: string[];
  messagesEn: string[];
  iconComp: any;
  iconTheme: string;
}

const SECTION_CONFIG: Record<WayakSection, SectionConfig> = {
  construction: {
    color: '#D4AF37',
    glowColor: 'rgba(212,175,55,0.35)',
    ringColor: 'rgba(212,175,55,0.5)',
    messagesAr: ['ياك يجهّز مشروعك...', 'نبني حلمك حجر على حجر', 'خبراء البناء بخدمتك'],
    messagesEn: ['Wayak is preparing your project...', 'Building your dream step by step', 'Experts at your service'],
    iconComp: Building2,
    iconTheme: 'gold',
  },
  services: {
    color: '#3B5BFE',
    glowColor: 'rgba(59,91,254,0.35)',
    ringColor: 'rgba(59,91,254,0.5)',
    messagesAr: ['ياك يبحث لك عن الأفضل...', 'نختار لك الأنسب من بين المئات', 'الخدمة اللي تستاهلها'],
    messagesEn: ['Wayak finding the best...', 'Selecting the most suitable', 'The service you deserve'],
    iconComp: Wrench,
    iconTheme: 'blue',
  },
  tools: {
    color: '#8B5CF6',
    glowColor: 'rgba(139,92,246,0.35)',
    ringColor: 'rgba(139,92,246,0.5)',
    messagesAr: ['ياك يجهّز الأدوات الذكية...', 'أدوات احترافية في الطريق', 'كل شي تحتاجه هنا'],
    messagesEn: ['Wayak preparing smart tools...', 'Pro tools on the way', 'Everything you need is here'],
    iconComp: Settings,
    iconTheme: 'purple',
  },
  'ai-tools': {
    color: '#8B5CF6',
    glowColor: 'rgba(139,92,246,0.35)',
    ringColor: 'rgba(139,92,246,0.5)',
    messagesAr: ['ياك يشتغل بكامل طاقته...', 'الذكاء الاصطناعي في خدمتك', 'أدوات ذكية تفهم احتياجاتك'],
    messagesEn: ['Wayak at full power...', 'AI at your service', 'Smart tools that understand you'],
    // Bot not available in this lucide version — using Cpu as alias
    iconComp: Cpu,
    iconTheme: 'violet',
  },
  shop: {
    color: '#D4AF37',
    glowColor: 'rgba(212,175,55,0.35)',
    ringColor: 'rgba(212,175,55,0.5)',
    messagesAr: ['ياك يتفحّص أفضل العروض...', 'أسعار حصرية جايّة في الطريق', 'تسوّق بذكاء مع بيت الريف'],
    messagesEn: ['Wayak checking best deals...', 'Exclusive prices incoming', 'Shop smart with Beit Al Reef'],
    iconComp: ShoppingCart,
    iconTheme: 'gold',
  },
  maps: {
    color: '#3B5BFE',
    glowColor: 'rgba(59,91,254,0.35)',
    ringColor: 'rgba(59,91,254,0.5)',
    messagesAr: ['ياك يستكشف المنطقة...', 'نحدد لك أقرب الخدمات', 'كل الإمارات تحت ناظرك'],
    messagesEn: ['Wayak exploring the area...', 'Finding nearest services', 'All Emirates at your sight'],
    iconComp: MapPin,
    iconTheme: 'blue',
  },
  auth: {
    color: '#D4AF37',
    glowColor: 'rgba(212,175,55,0.35)',
    ringColor: 'rgba(212,175,55,0.5)',
    messagesAr: ['ياك يتحقق من هويتك...', 'أمانك أولويتنا', 'حسابك محمي بأعلى المعايير'],
    messagesEn: ['Wayak verifying your identity...', 'Security is our priority', 'Account protected'],
    iconComp: Shield,
    iconTheme: 'gold',
  },
  general: {
    color: '#3B5BFE',
    glowColor: 'rgba(59,91,254,0.35)',
    ringColor: 'rgba(59,91,254,0.5)',
    messagesAr: ['ياك يجهّز كل شي...', 'لحظة واحدة والنتيجة جاهزة', 'الذكاء الاصطناعي يعمل لأجلك'],
    messagesEn: ['Wayak preparing everything...', 'One moment, results ready', 'AI working for you'],
    iconComp: Sparkles,
    iconTheme: 'blue',
  },
  projects: {
    color: '#D4AF37',
    glowColor: 'rgba(212,175,55,0.35)',
    ringColor: 'rgba(212,175,55,0.5)',
    messagesAr: ['ياك يراج مشاريعك...', 'كل مشروع تحت المتابعة', 'إدارة ذكية لمشاريعك'],
    messagesEn: ['Wayak reviewing projects...', 'Every project tracked', 'Smart project management'],
    iconComp: FolderKanban,
    iconTheme: 'gold',
  },
  rfq: {
    color: '#3B5BFE',
    glowColor: 'rgba(59,91,254,0.35)',
    ringColor: 'rgba(59,91,254,0.5)',
    messagesAr: ['ياك يجهّز عرض السعر...', 'نقارن لك أفضل العروض', 'أسعار تنافسية بانتظارك'],
    messagesEn: ['Wayak preparing quote...', 'Comparing best offers', 'Competitive prices await'],
    iconComp: FileText,
    iconTheme: 'blue',
  },
  wallet: {
    color: '#D4AF37',
    glowColor: 'rgba(212,175,55,0.35)',
    ringColor: 'rgba(212,175,55,0.5)',
    messagesAr: ['ياك يراجع حسابك...', 'كل معاملاتك آمنة', 'محفظتك تحت الحماية'],
    messagesEn: ['Wayak checking account...', 'Transactions secure', 'Wallet protected'],
    iconComp: Wallet,
    iconTheme: 'gold',
  },
  profile: {
    color: '#8B5CF6',
    glowColor: 'rgba(139,92,246,0.35)',
    ringColor: 'rgba(139,92,246,0.5)',
    messagesAr: ['ياك يحدّث ملفك...', 'بياناتك تحت السيطرة', 'ملفك الشخصي يتحسّن'],
    messagesEn: ['Wayak updating profile...', 'Data under control', 'Profile improving'],
    iconComp: User,
    iconTheme: 'violet',
  },
};

// ═══════════════════════════════════════
// Sound System
// ═══════════════════════════════════════
function playWayakChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.5);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.6);
    });
  } catch {
    // silent
  }
}

function playWayakExitChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [783.99, 659.25];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + i * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.4);
    });
  } catch {
    // silent
  }
}

// ═══════════════════════════════════════
// 3D Character Component (Real Image)
// ═══════════════════════════════════════
function WayakCharacter({ config, phase }: { config: SectionConfig; phase: 'walking' | 'talking' | 'waving' }) {
  const { color, glowColor, ringColor } = config;
  const isWalking = phase === 'walking';
  const isWaving = phase === 'waving';

  return (
    <div className="relative" style={{ width: 100, height: 140 }}>

      {/* ═══ Ground shadow — elongated ellipse ═══ */}
      <motion.div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-[50%]"
        style={{
          width: 60,
          height: 10,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.25), transparent 70%)',
          filter: 'blur(3px)',
        }}
        animate={{
          scaleX: isWalking ? [0.6, 1.3, 0.6] : [0.85, 1.15, 0.85],
          opacity: isWalking ? [0.2, 0.35, 0.2] : [0.18, 0.28, 0.18],
        }}
        transition={{ duration: isWalking ? 0.55 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ═══ Character body group — float + tilt ═══ */}
      <motion.div
        className="relative w-full h-full"
        animate={{
          y: isWalking ? [0, -8, 0] : [0, -6, 0],
          rotateZ: isWalking ? [-2, 2, -2] : [0, 1, 0, -1, 0],
        }}
        transition={{
          y: { duration: isWalking ? 0.55 : 2.8, repeat: Infinity, ease: 'easeInOut' },
          rotateZ: { duration: isWalking ? 0.55 : 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {/* ═══ Glow aura — section-colored ═══ */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 60%, ${glowColor}, transparent 65%)`,
            filter: 'blur(15px)',
            transform: 'scale(1.4)',
          }}
          animate={{
            opacity: [0.25, 0.55, 0.25],
            scale: [1.3, 1.5, 1.3],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ═══ Shimmer ring — rotating colored ring ═══ */}
        <motion.div
          className="absolute inset-[-6px] rounded-full pointer-events-none"
          style={{
            border: `2px solid transparent`,
            borderTopColor: ringColor,
            borderRightColor: ringColor,
            filter: 'blur(1px)',
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* ═══ Character Image — 3D rendered PNG ═══ */}
        <motion.img
          src={wayakCharacterImg}
          alt="ياك — رفيق بيت الريف الذكي"
          className="w-full h-full object-contain relative z-10 drop-shadow-lg select-none"
          draggable={false}
          animate={{
            // Breathing effect
            scale: isWaving
              ? [1, 1.05, 0.97, 1.05, 1]
              : [1, 1.02, 1],
          }}
          transition={{
            scale: {
              duration: isWaving ? 0.5 : 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          style={{
            filter: `drop-shadow(0 6px 12px rgba(0,0,0,0.25)) drop-shadow(0 0 20px ${glowColor})`,
          }}
        />

        {/* ═══ Sparkle particles around character ═══ */}
        {(phase === 'talking' || phase === 'waving') && (
          <>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full pointer-events-none z-20"
                style={{
                  background: color,
                  boxShadow: `0 0 6px ${color}`,
                  top: `${15 + (i * 15) % 70}%`,
                  left: `${5 + (i * 20) % 90}%`,
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.2, 0],
                  y: [0, -12 - i * 3],
                  x: [0, (i % 2 === 0 ? 6 : -6)],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════
// Particle Trail (behind walking character)
// ═══════════════════════════════════════
function ParticleTrail({ color, isActive }: { color: string; isActive: boolean }) {
  if (!isActive) return null;
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + i,
            height: 4 + i,
            background: `radial-gradient(circle, ${color}, transparent)`,
            top: `${(i - 3) * 6}px`,
          }}
          animate={{
            opacity: [0, 0.5, 0],
            x: [-8, -30 - i * 8],
            scale: [0.5, 1, 0.3],
          }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.12,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// Speech Bubble
// ═══════════════════════════════════════
function SpeechBubble({ message, color, isEn }: { message: string; color: string; isEn: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap"
      style={{ direction: isEn ? 'ltr' : 'rtl' }}
    >
      <div
        className="relative px-4 py-2 rounded-2xl text-white text-xs font-bold"
        style={{
          fontFamily: 'Cairo, sans-serif',
          background: `linear-gradient(135deg, rgba(28,28,32,0.93), rgba(48,48,52,0.93))`,
          backdropFilter: 'blur(24px) saturate(180%)',
          border: `1.5px solid ${color}50`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 20px ${color}15, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        {/* Shimmer line on top */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl overflow-hidden"
          style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        {message}
        {/* Bubble tail */}
        <div
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
          style={{
            background: 'rgba(38,38,42,0.93)',
            borderRight: `1.5px solid ${color}50`,
            borderBottom: `1.5px solid ${color}50`,
          }}
        />
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// Companion Scene (orchestrates animation)
// ═══════════════════════════════════════
interface WayakSceneProps {
  section: WayakSection;
  isVisible: boolean;
  customMessage?: string;
  isEn: boolean;
  onComplete?: () => void;
  enableSound?: boolean;
  position?: 'top' | 'bottom' | 'center';
  duration?: number;
}

function WayakScene({
  section,
  isVisible,
  customMessage,
  isEn,
  onComplete,
  enableSound = true,
  position = 'bottom',
  duration = 5000,
}: WayakSceneProps) {
  const [phase, setPhase] = useState<'enter' | 'talk' | 'wave' | 'exit' | 'idle'>('idle');
  const [message, setMessage] = useState('');
  const cleanupRef = useRef<(() => void) | null>(null);
  const config = SECTION_CONFIG[section];

  useEffect(() => {
    if (!isVisible) {
      setPhase('idle');
      return;
    }

    // Pick a random message — merge config messages with knowledge base tips
    const configMsgs = isEn ? config.messagesEn : config.messagesAr;
    const knowledgeTips = getKnowledgeTips(section, isEn);
    const allMessages = [...configMsgs, ...knowledgeTips];
    setMessage(customMessage || allMessages[Math.floor(Math.random() * allMessages.length)]);

    // Play entrance sound
    if (enableSound) playWayakChime();

    // Animation timeline
    setPhase('enter');

    const timers: NodeJS.Timeout[] = [];

    timers.push(setTimeout(() => setPhase('talk'), 1200));
    timers.push(setTimeout(() => setPhase('wave'), 1200 + duration * 0.6));
    timers.push(setTimeout(() => {
      setPhase('exit');
      if (enableSound) playWayakExitChime();
    }, 1200 + duration));
    timers.push(setTimeout(() => {
      setPhase('idle');
      onComplete?.();
    }, 1200 + duration + 900));

    cleanupRef.current = () => timers.forEach(clearTimeout);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isVisible, section, isEn]);

  const positionClass =
    position === 'top' ? 'top-16' :
    position === 'center' ? 'top-1/2 -translate-y-1/2' :
    'bottom-20';

  // Calculate stop position (center of screen, slightly right for RTL feel)
  const stopX = 'calc(50vw - 50px)';

  return (
    <AnimatePresence>
      {phase !== 'idle' && (
        <motion.div
          className={`fixed ${positionClass} z-[9999] pointer-events-none`}
          initial={{ x: '105vw' }}
          animate={{
            x: phase === 'exit'
              ? '-15vw'
              : phase === 'enter'
              ? ['105vw', stopX]
              : stopX,
          }}
          exit={{ x: '-15vw' }}
          transition={{
            x: {
              duration: phase === 'enter' ? 1.2 : phase === 'exit' ? 0.8 : 0.3,
              ease: phase === 'enter' ? [0.22, 0.68, 0.36, 1.0] : 'easeIn',
            },
          }}
          style={{ direction: 'ltr' }}
        >
          <div className="relative">
            {/* Particle trail — shows during movement */}
            <ParticleTrail color={config.color} isActive={phase === 'enter' || phase === 'exit'} />

            {/* Speech bubble — shows during talk/wave */}
            <AnimatePresence>
              {(phase === 'talk' || phase === 'wave') && (
                <SpeechBubble message={message} color={config.color} isEn={isEn} />
              )}
            </AnimatePresence>

            {/* 3D Character */}
            <WayakCharacter
              config={config}
              phase={
                phase === 'enter' || phase === 'exit' ? 'walking' :
                phase === 'talk' ? 'talking' :
                'waving'
              }
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════
// Context & Provider
// ═══════════════════════════════════════
interface WayakCompanionContextType {
  show: (options: {
    section?: WayakSection;
    message?: string;
    duration?: number;
    position?: 'top' | 'bottom' | 'center';
    enableSound?: boolean;
  }) => void;
  hide: () => void;
  isActive: boolean;
}

const WayakCompanionContext = createContext<WayakCompanionContextType>({
  show: () => {},
  hide: () => {},
  isActive: false,
});

export function useWayakCompanion() {
  return useContext(WayakCompanionContext);
}

interface WayakProviderProps {
  children: ReactNode;
}

export function WayakCompanionProvider({ children }: WayakProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [section, setSection] = useState<WayakSection>('general');
  const [customMessage, setCustomMessage] = useState<string | undefined>();
  const [position, setPosition] = useState<'top' | 'bottom' | 'center'>('bottom');
  const [duration, setDuration] = useState(5000);
  const [enableSound, setEnableSound] = useState(true);
  const { language } = useLanguage();
  const isEn = language === 'en';

  const show = useCallback(({
    section: s = 'general',
    message,
    duration: d = 5000,
    position: p = 'bottom',
    enableSound: es = true,
  }: {
    section?: WayakSection;
    message?: string;
    duration?: number;
    position?: 'top' | 'bottom' | 'center';
    enableSound?: boolean;
  }) => {
    setSection(s);
    setCustomMessage(message);
    setDuration(d);
    setPosition(p);
    setEnableSound(es);
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <WayakCompanionContext.Provider value={{ show, hide, isActive: isVisible }}>
      {children}
      <WayakScene
        section={section}
        isVisible={isVisible}
        customMessage={customMessage}
        isEn={isEn}
        onComplete={() => setIsVisible(false)}
        enableSound={enableSound}
        position={position}
        duration={duration}
      />
    </WayakCompanionContext.Provider>
  );
}

// ═══════════════════════════════════════
// Demo Component
// ═══════════════════════════════════════
export function WayakCompanionDemo() {
  const wayak = useWayakCompanion();
  const sections: WayakSection[] = [
    'construction', 'services', 'tools', 'ai-tools',
    'shop', 'maps', 'auth', 'general', 'projects',
    'rfq', 'wallet', 'profile',
  ];

  const sectionLabels: Record<WayakSection, string> = {
    construction: 'بناء',
    services: 'خدمات',
    tools: 'أدوات',
    'ai-tools': 'ذكاء اصطناعي',
    shop: 'متجر',
    maps: 'خرائط',
    auth: 'تسجيل دخول',
    general: 'عام',
    projects: 'مشاريع',
    rfq: 'عروض أسعار',
    wallet: 'محفظة',
    profile: 'ملف شخصي',
  };

  return (
    <div className="p-6 space-y-4" dir="rtl">
      <h3
        className="text-lg font-black text-[#1A1A1A] dark:text-white"
        style={{ fontFamily: 'Cairo, sans-serif' }}
      >
        رفيق ياك الذكي — اختبار الأقسام
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400" style={{ fontFamily: 'Cairo, sans-serif' }}>
        اضغط على أي قسم لتشوف ياك يمشي على الشاشة مع رسالة تحفيزية
      </p>
      <div className="flex flex-wrap gap-2">
        {sections.map(s => {
          const cfg = SECTION_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => wayak.show({ section: s, position: 'center' })}
              disabled={wayak.isActive}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border-[3px] border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{
                fontFamily: 'Cairo, sans-serif',
                background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}CC)`,
                color: 'white',
                boxShadow: `0 4px 15px ${cfg.glowColor}`,
              }}
            >
              <Icon3D icon={cfg.iconComp} theme={cfg.iconTheme} size="xs" hoverable={false} />
              {sectionLabels[s]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { WayakScene, SECTION_CONFIG };
export type { WayakSceneProps, SectionConfig };