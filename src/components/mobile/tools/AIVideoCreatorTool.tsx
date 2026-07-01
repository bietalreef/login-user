/**
 * AIVideoCreatorTool.tsx — وياك AI Video Creator
 * ════════════════════════════════════════════════
 * أداة توليد فيديو ترويجي بالذكاء الاصطناعي
 * تعتمد على Gemini Nano Banana — تصميم داكن فاخر
 */

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, Video, Image as ImageIcon, Upload, Sparkles, Link2,
  Play, Pause, ChevronDown, ChevronUp, X, Check, Clock,
  Clapperboard, Palette, Type, Music, Share2, Download,
  Eye, RotateCw, Wand2, Film, MonitorPlay, Smartphone,
  Globe, MapPin, Scissors, Layers, Volume2, VolumeX,
  CircleDot, Square, Triangle, Star, Zap, Award, Settings2,
  Instagram, Camera, FileVideo, AlertCircle, Copy
} from 'lucide-react';
// Crown not available — using Award as alias
const Crown = Award;
import { Icon3D } from '../../ui/Icon3D';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

const fontCairo = 'Cairo, sans-serif';

// ═══════════════════════════════════════
// Types & Data
// ═══════════════════════════════════════
type GoalType = 'promote' | 'showcase' | 'tutorial';
type StyleType = 'cinematic' | 'minimalist' | 'dynamic' | 'elegant';
type AspectType = '16:9' | '9:16' | '1:1';
type DurationType = '15' | '30' | '60';

interface TimelineClip {
  id: string;
  type: 'intro' | 'content' | 'outro';
  duration: number;
  label: string;
  labelEn: string;
  color: string;
}

interface AIVideoCreatorToolProps {
  onBack: () => void;
}

const SAMPLE_CLIPS: TimelineClip[] = [
  { id: 'intro', type: 'intro', duration: 3, label: 'مقدمة مع اللوجو', labelEn: 'Logo Intro', color: '#D4AF37' },
  { id: 'scene1', type: 'content', duration: 5, label: 'عرض الخدمة', labelEn: 'Service Showcase', color: '#3B5BFE' },
  { id: 'scene2', type: 'content', duration: 5, label: 'صور المشاريع', labelEn: 'Project Photos', color: '#8B5CF6' },
  { id: 'scene3', type: 'content', duration: 4, label: 'شهادات العملاء', labelEn: 'Testimonials', color: '#D4AF37' },
  { id: 'outro', type: 'outro', duration: 3, label: 'معلومات التواصل', labelEn: 'Contact Info', color: '#3B5BFE' },
];

export function AIVideoCreatorTool({ onBack }: AIVideoCreatorToolProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  // State
  const [goal, setGoal] = useState<GoalType>('promote');
  const [style, setStyle] = useState<StyleType>('cinematic');
  const [aspect, setAspect] = useState<AspectType>('9:16');
  const [duration, setDuration] = useState<DurationType>('30');
  const [primaryColor, setPrimaryColor] = useState('#D4AF37');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [linkedAccount, setLinkedAccount] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [audioNarration, setAudioNarration] = useState(true);
  const [bgMusic, setBgMusic] = useState(true);
  const [textOverlay, setTextOverlay] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const PRESET_COLORS = ['#D4AF37', '#3B5BFE', '#8B5CF6', '#E04545', '#F09030', '#06B6D4', '#1E3A8A', '#8D6E63'];

  const goals = [
    { id: 'promote' as GoalType, ar: 'ترويج خدمة', en: 'Promote Service', icon: Zap, color: '#D4AF37' },
    { id: 'showcase' as GoalType, ar: 'عرض مشروع', en: 'Showcase Project', icon: MonitorPlay, color: '#3B5BFE' },
    { id: 'tutorial' as GoalType, ar: 'شرح تعليمي', en: 'Tutorial', icon: Film, color: '#8B5CF6' },
  ];

  const styles = [
    { id: 'cinematic' as StyleType, ar: 'سينمائي', en: 'CINEMATIC', desc_ar: 'حركة كاميرا بطيئة مع تأثيرات درامية', desc_en: 'Slow camera movements with dramatic effects' },
    { id: 'minimalist' as StyleType, ar: 'بسيط', en: 'MINIMALIST', desc_ar: 'نظيف ومتناغم بخطوط واضحة', desc_en: 'Clean and harmonious with clear lines' },
    { id: 'dynamic' as StyleType, ar: 'حيوي', en: 'DYNAMIC', desc_ar: 'حركات سريعة مع انتقالات مثيرة', desc_en: 'Fast movements with exciting transitions' },
    { id: 'elegant' as StyleType, ar: 'فاخر', en: 'ELEGANT', desc_ar: 'أنيق ومميز بلمسات ذهبية', desc_en: 'Elegant with golden touches' },
  ];

  const aspects = [
    { id: '16:9' as AspectType, ar: 'أفقي', en: 'Landscape', icon: MonitorPlay },
    { id: '9:16' as AspectType, ar: 'عمودي', en: 'Portrait', icon: Smartphone },
    { id: '1:1' as AspectType, ar: 'مربع', en: 'Square', icon: Square },
  ];

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((_, i) => 
      `https://images.unsplash.com/photo-1762536859942-8076505f7c62?w=200&h=200&fit=crop&q=80&r=${Date.now() + i}`
    );
    setUploadedImages(prev => [...prev, ...newImages].slice(0, 6));
  }, []);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setShowPreview(true);
          return 100;
        }
        return prev + Math.random() * 3 + 1;
      });
    }, 200);
  }, []);

  const totalDuration = SAMPLE_CLIPS.reduce((a, c) => a + c.duration, 0);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-32" dir={isEn ? 'ltr' : 'rtl'}>
      {/* ═══ Header ═══ */}
      <div className="sticky top-0 z-50 bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowRight className={`w-5 h-5 text-white/70 ${isEn ? 'rotate-180' : ''}`} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#0A0A0F]" />
            </div>
            <span className="text-white font-extrabold text-sm" style={{ fontFamily: fontCairo }}>
              Weyaak AI Video Creator
            </span>
          </div>
          <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Settings2 className="w-4.5 h-4.5 text-white/50" />
          </button>
        </div>
      </div>

      <div className="px-4 py-5 space-y-6">

        {/* ═══ 1. Quick Start: Goal ═══ */}
        <section>
          <h3 className="text-white/90 font-extrabold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: fontCairo }}>
            <span className="text-[#D4AF37]">✦</span>
            {isEn ? 'Quick Start: What is your goal?' : 'ما هو هدفك؟ (البداية السريعة)'}
          </h3>
          <div className="flex gap-2">
            {goals.map(g => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id)}
                className={`flex-1 py-3 px-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  goal === g.id
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37]/60 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                    : 'bg-white/3 border-white/8 hover:border-white/15'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  goal === g.id ? 'bg-[#D4AF37]/20' : 'bg-white/5'
                }`}>
                  <g.icon className={`w-5 h-5 ${goal === g.id ? 'text-[#D4AF37]' : 'text-white/40'}`} />
                </div>
                <span className={`text-xs font-bold ${goal === g.id ? 'text-[#D4AF37]' : 'text-white/50'}`} style={{ fontFamily: fontCairo }}>
                  {isEn ? g.en : g.ar}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ═══ 2. Smart Account Linking ═══ */}
        <section>
          <h3 className="text-white/90 font-extrabold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: fontCairo }}>
            <Link2 className="w-4 h-4 text-[#D4AF37]" />
            {isEn ? 'Smart Account Linking' : 'ربط حساباتك الذكية'}
          </h3>
          <p className="text-white/30 text-xs mb-3" style={{ fontFamily: fontCairo }}>
            {isEn ? 'Link your accounts so Weyaak can fetch your brand assets' : 'اربط حساباتك ليقوم وياك بجلب أصول علامتك التجارية'}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-2xl px-4 py-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] rounded-lg flex items-center justify-center">
                <Instagram className="w-4 h-4 text-white" />
              </div>
              <input
                value={linkedAccount}
                onChange={e => setLinkedAccount(e.target.value)}
                placeholder={isEn ? '@your_account' : '@حسابك'}
                className="flex-1 bg-transparent text-white text-sm placeholder:text-white/20 outline-none"
                style={{ fontFamily: fontCairo }}
                dir="ltr"
              />
              <button className="text-[#D4AF37] text-xs font-bold px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Link' : 'ربط'}
              </button>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-2xl px-4 py-3">
              <div className="w-8 h-8 bg-[#4285F4] rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="flex-1 text-white/40 text-sm" style={{ fontFamily: fontCairo }}>Google Maps</span>
              <div className="w-5 h-5 rounded bg-[#D4AF37]/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-[#D4AF37]" />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 3. Brand Consistency ═══ */}
        <section>
          <h3 className="text-white/90 font-extrabold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: fontCairo }}>
            <Palette className="w-4 h-4 text-[#D4AF37]" />
            {isEn ? 'Brand Consistency' : 'اتساق العلامة التجارية'}
          </h3>

          <div className="space-y-3">
            <input
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              placeholder={isEn ? '@biet_alreef_sa' : '@biet_alreef_sa'}
              className="w-full bg-white/5 border border-white/8 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#D4AF37]/30 transition-colors"
              style={{ fontFamily: fontCairo }}
              dir="ltr"
            />

            {/* Brand Identity: Colors */}
            <div>
              <p className="text-white/50 text-xs mb-2 font-bold" style={{ fontFamily: fontCairo }}>
                {isEn ? 'BRAND IDENTITY — PRIMARY COLOR' : 'هوية العلامة التجارية'}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setPrimaryColor(color)}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      primaryColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <div className="w-9 h-9 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
                  <span className="text-white/30 text-lg">+</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 4. Add Visuals ═══ */}
        <section>
          <h3 className="text-white/90 font-extrabold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: fontCairo }}>
            <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
            {isEn ? 'Add Visuals' : 'إضافة المرئيات'}
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={handleImageUpload}
              className="flex flex-col items-center gap-2 py-5 px-4 bg-white/5 border border-white/8 rounded-2xl hover:bg-white/8 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#3B5BFE]/10 border border-[#3B5BFE]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5 text-[#3B5BFE]" />
              </div>
              <span className="text-white/60 text-xs font-bold" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Upload Media' : 'رفع وسائط'}
              </span>
            </button>

            <button className="flex flex-col items-center gap-2 py-5 px-4 bg-white/5 border border-white/8 rounded-2xl hover:bg-white/8 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wand2 className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <span className="text-white/60 text-xs font-bold" style={{ fontFamily: fontCairo }}>
                {isEn ? 'AI Generate' : 'توليد بالذكاء الاصطناعي'}
              </span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={isEn 
              ? 'Describe your service for AI generation... (e.g. Modern kitchen installation in Dubai)' 
              : 'صِف خدمتك لتوليد الذكاء الاصطناعي... (مثلاً: تركيب مطابخ حديثة في دبي)'
            }
            className="w-full bg-white/5 border border-white/8 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/15 outline-none focus:border-[#D4AF37]/30 transition-colors resize-none h-20"
            style={{ fontFamily: fontCairo }}
          />

          {/* Uploaded images grid */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {uploadedImages.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                  <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ═══ 5. Creative Style ═══ */}
        <section>
          <h3 className="text-white/90 font-extrabold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: fontCairo }}>
            <Clapperboard className="w-4 h-4 text-[#D4AF37]" />
            {isEn ? 'Creative Style' : 'النمط الإبداعي'}
          </h3>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {styles.map(s => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`flex-shrink-0 px-5 py-3 rounded-2xl border-2 transition-all min-w-[90px] ${
                  style === s.id
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37]/60 text-[#D4AF37]'
                    : 'bg-white/3 border-white/8 text-white/40 hover:border-white/15'
                }`}
              >
                <span className="text-xs font-extrabold block" style={{ fontFamily: fontCairo }}>
                  {isEn ? s.en : s.ar}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ═══ 6. Aspect Ratio & Duration ═══ */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            {/* Aspect Ratio */}
            <div>
              <p className="text-white/50 text-xs mb-2 font-bold" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Aspect Ratio' : 'نسبة العرض'}
              </p>
              <div className="flex gap-2">
                {aspects.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAspect(a.id)}
                    className={`flex-1 py-2.5 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                      aspect === a.id
                        ? 'bg-[#3B5BFE]/15 border-[#3B5BFE]/40 text-[#3B5BFE]'
                        : 'bg-white/3 border-white/8 text-white/30'
                    }`}
                  >
                    <a.icon className="w-4 h-4" />
                    <span className="text-[9px] font-bold">{a.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <p className="text-white/50 text-xs mb-2 font-bold" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Duration' : 'المدة'}
              </p>
              <div className="flex gap-2">
                {(['15', '30', '60'] as DurationType[]).map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-2.5 rounded-xl border transition-all text-center ${
                      duration === d
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]'
                        : 'bg-white/3 border-white/8 text-white/30'
                    }`}
                  >
                    <span className="text-xs font-bold">{d}s</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 7. Audio Settings ═══ */}
        <section>
          <h3 className="text-white/90 font-extrabold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: fontCairo }}>
            <Music className="w-4 h-4 text-[#D4AF37]" />
            {isEn ? 'Audio Settings' : 'التعليق الصوتي'}
          </h3>
          
          <div className="space-y-2">
            {[
              { label: isEn ? 'AI Narration' : 'صوت "حبر" - اخترنا هادي', state: audioNarration, toggle: () => setAudioNarration(!audioNarration) },
              { label: isEn ? 'Background Music' : 'موسيقى خلفية', state: bgMusic, toggle: () => setBgMusic(!bgMusic) },
              { label: isEn ? 'Text Overlay' : 'نصوص متحركة', state: textOverlay, toggle: () => setTextOverlay(!textOverlay) },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-white/3 border border-white/5 rounded-xl px-4 py-3">
                <span className="text-white/60 text-xs font-bold" style={{ fontFamily: fontCairo }}>{item.label}</span>
                <button
                  onClick={item.toggle}
                  className={`w-10 h-5.5 rounded-full transition-all relative ${
                    item.state ? 'bg-[#D4AF37]' : 'bg-white/10'
                  }`}
                >
                  <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-all ${
                    item.state ? (isEn ? 'right-0.5' : 'left-0.5') : (isEn ? 'left-0.5' : 'right-0.5')
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 8. Draft Timeline ═══ */}
        <section>
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="flex items-center justify-between w-full mb-3"
          >
            <h3 className="text-white/90 font-extrabold text-sm flex items-center gap-2" style={{ fontFamily: fontCairo }}>
              <Film className="w-4 h-4 text-[#D4AF37]" />
              {isEn ? 'DRAFT TIMELINE' : 'الجدول الزمني للمسودة'}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[#D4AF37] text-xs font-bold">0:{totalDuration < 10 ? '0' : ''}{totalDuration} sec</span>
              {showTimeline ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
            </div>
          </button>

          <AnimatePresence>
            {showTimeline && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {/* Timeline bar */}
                <div className="flex gap-1 mb-3 rounded-xl overflow-hidden">
                  {SAMPLE_CLIPS.map(clip => (
                    <div
                      key={clip.id}
                      className="h-14 rounded-lg relative overflow-hidden group cursor-pointer"
                      style={{
                        flex: clip.duration,
                        background: `linear-gradient(135deg, ${clip.color}30, ${clip.color}10)`,
                        border: `1px solid ${clip.color}40`,
                      }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                        <span className="text-[8px] text-white/60 font-bold truncate" style={{ fontFamily: fontCairo }}>
                          {isEn ? clip.labelEn : clip.label}
                        </span>
                        <span className="text-[7px] font-bold" style={{ color: clip.color }}>{clip.duration}s</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Timeline controls */}
                <div className="flex items-center gap-3">
                  <span className="text-white/20 text-[10px] font-mono">0:00</span>
                  <div className="flex-1 h-1 bg-white/5 rounded-full relative">
                    <div className="absolute left-0 top-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#3B5BFE] rounded-full" style={{ width: '0%' }} />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#D4AF37] rounded-full shadow-lg shadow-[#D4AF37]/30" />
                  </div>
                  <span className="text-white/20 text-[10px] font-mono">0:{totalDuration}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ═══ Generate Button ═══ */}
        <div className="pt-2">
          {isGenerating ? (
            <div className="space-y-3">
              <div className="relative w-full h-14 bg-white/5 border border-[#D4AF37]/20 rounded-2xl overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D4AF37]/30 to-[#D4AF37]/60"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(generationProgress, 100)}%` }}
                  transition={{ ease: 'easeOut' }}
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <RotateCw className="w-4 h-4 text-[#D4AF37] animate-spin" />
                  <span className="text-white/70 text-sm font-bold" style={{ fontFamily: fontCairo }}>
                    {isEn ? 'AI processing...' : 'المعالجة بالذكاء الاصطناعي...'}
                    <span className="text-[#D4AF37] ms-2">{Math.round(Math.min(generationProgress, 100))}%</span>
                  </span>
                </div>
              </div>
              <p className="text-center text-white/20 text-[10px]" style={{ fontFamily: fontCairo }}>
                {isEn ? 'AI processing usually takes 30-60 seconds' : 'المعالجة عادةً تأخذ ٣٠-٦٠ ثانية'}
              </p>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0A0A0F] rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(212,175,55,0.3)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.4)] active:scale-[0.98] transition-all"
              style={{ fontFamily: fontCairo }}
            >
              <Sparkles className="w-5 h-5" />
              {isEn ? 'Generate with Weyaak' : 'توليد الفيديو مع وياك'}
            </button>
          )}
        </div>
      </div>

      {/* ═══ Preview Modal ═══ */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4">
              <button onClick={() => setShowPreview(false)} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <X className="w-5 h-5 text-white" />
              </button>
              <span className="text-white font-extrabold text-sm" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Video Preview' : 'معاينة الفيديو'}
              </span>
              <div className="w-10" />
            </div>

            <div className="flex-1 flex items-center justify-center p-6">
              <div
                className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-[0_0_60px_rgba(212,175,55,0.15)]"
                style={{
                  width: aspect === '9:16' ? 220 : aspect === '1:1' ? 280 : 340,
                  height: aspect === '9:16' ? 390 : aspect === '1:1' ? 280 : 190,
                }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1669387448840-610c588f003d?w=600&h=800&fit=crop"
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/90 flex items-center justify-center shadow-2xl">
                    <Play className="w-7 h-7 text-[#0A0A0F] ms-1" fill="#0A0A0F" />
                  </div>
                </div>

                {/* Bottom overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-extrabold text-sm drop-shadow-lg" style={{ fontFamily: fontCairo }}>
                    {businessName || (isEn ? 'Your Business' : 'اسم شركتك')}
                  </p>
                  <p className="text-white/60 text-xs" style={{ fontFamily: fontCairo }}>
                    {isEn ? 'AI Generated Video' : 'فيديو مُولد بالذكاء الاصطناعي'}
                  </p>
                </div>

                {/* Duration badge */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#D4AF37]" />
                  <span className="text-white text-[10px] font-bold">0:{duration}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-4 space-y-3">
              <button className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0A0A0F] rounded-2xl font-extrabold text-base flex items-center justify-center gap-2" style={{ fontFamily: fontCairo }}>
                <Sparkles className="w-5 h-5" />
                {isEn ? 'Create Video Now' : 'إنشاء الفيديو الآن'}
              </button>
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white/60 text-sm font-bold" style={{ fontFamily: fontCairo }}>
                  <RotateCw className="w-4 h-4" />
                  {isEn ? 'Regenerate' : 'إعادة'}
                </button>
                <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white/60 text-sm font-bold" style={{ fontFamily: fontCairo }}>
                  <Share2 className="w-4 h-4" />
                  {isEn ? 'Share' : 'مشاركة'}
                </button>
                <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white/60 text-sm font-bold" style={{ fontFamily: fontCairo }}>
                  <Download className="w-4 h-4" />
                  {isEn ? 'Save' : 'حفظ'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}