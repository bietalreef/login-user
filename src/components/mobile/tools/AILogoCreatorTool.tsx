/**
 * AILogoCreatorTool.tsx — مولّد اللوجو بالذكاء الاصطناعي
 * ═════════════════════════════════════════════════════
 * أداة إنشاء شعارات احترافية بتقنية AI
 * تصميم داكن فاخر متوافق مع نظام بيت الريف
 */

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, Sparkles, Download, Share2, Copy, X,
  Building2, Paintbrush, Hammer, ShoppingCart, Stethoscope,
  GraduationCap, Scale, Truck, UtensilsCrossed, Camera,
  Music, Plane, Star, Check, RotateCw, Settings2,
  Type, Palette, Layers, Grid3x3, Hexagon, Circle,
  Square, Triangle, Pentagon, Diamond, Zap, Award,
  Heart, Shield, Eye, FileImage, ChevronDown, Wand2,
} from 'lucide-react';
// Crown & ShoppingBag not available — using safe aliases
const Crown = Award;
const ShoppingBag = ShoppingCart;
import { Icon3D } from '../../ui/Icon3D';
import { useLanguage } from '../../../contexts/LanguageContext';

const fontCairo = 'Cairo, sans-serif';

// ═══════════════════════════════════════
// Types
// ═══════════════════════════════════════
type LogoStyle = 'modern' | 'classic' | 'minimal' | 'bold' | 'playful' | 'luxury';
type IndustryType = 'construction' | 'realestate' | 'interior' | 'healthcare' | 'legal' | 'education' | 'retail' | 'food' | 'tech' | 'creative';
type LayoutType = 'icon-text' | 'text-only' | 'icon-only' | 'badge' | 'monogram';

interface LogoVariation {
  id: string;
  style: string;
  layout: LayoutType;
  primaryColor: string;
  secondaryColor: string;
  icon: any;
  fontWeight: number;
  borderRadius: number;
}

interface AILogoCreatorToolProps {
  onBack: () => void;
}

export function AILogoCreatorTool({ onBack }: AILogoCreatorToolProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  // State
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState('');
  const [industry, setIndustry] = useState<IndustryType>('construction');
  const [logoStyle, setLogoStyle] = useState<LogoStyle>('modern');
  const [layout, setLayout] = useState<LayoutType>('icon-text');
  const [primaryColor, setPrimaryColor] = useState('#D4AF37');
  const [secondaryColor, setSecondaryColor] = useState('#1E3A8A');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [step, setStep] = useState(1); // 1: info, 2: style, 3: colors

  const PRESET_COLORS = ['#D4AF37', '#3B5BFE', '#8B5CF6', '#E04545', '#1E3A8A', '#0891B2', '#8D6E63', '#F59E0B', '#0A0A0F', '#FFFFFF'];

  const industries = [
    { id: 'construction' as IndustryType, ar: 'البناء والمقاولات', en: 'Construction', icon: Building2, color: '#D4AF37' },
    { id: 'realestate' as IndustryType, ar: 'العقارات', en: 'Real Estate', icon: Building2, color: '#3B5BFE' },
    { id: 'interior' as IndustryType, ar: 'التصميم الداخلي', en: 'Interior Design', icon: Paintbrush, color: '#8B5CF6' },
    { id: 'healthcare' as IndustryType, ar: 'الرعاية الصحية', en: 'Healthcare', icon: Stethoscope, color: '#8D6E63' },
    { id: 'legal' as IndustryType, ar: 'خدمات قانونية', en: 'Legal', icon: Scale, color: '#1E3A8A' },
    { id: 'education' as IndustryType, ar: 'التعليم', en: 'Education', icon: GraduationCap, color: '#F59E0B' },
    { id: 'retail' as IndustryType, ar: 'التجزئة', en: 'Retail', icon: ShoppingBag, color: '#EC4899' },
    { id: 'food' as IndustryType, ar: 'المطاعم', en: 'Food & Dining', icon: UtensilsCrossed, color: '#EF4444' },
    { id: 'tech' as IndustryType, ar: 'التقنية', en: 'Technology', icon: Zap, color: '#06B6D4' },
    { id: 'creative' as IndustryType, ar: 'الإبداعي', en: 'Creative', icon: Camera, color: '#EC4899' },
  ];

  const logoStyles = [
    { id: 'modern' as LogoStyle, ar: 'عصري', en: 'Modern', desc_ar: 'خطوط نظيفة وأشكال هندسية', desc_en: 'Clean lines and geometric shapes' },
    { id: 'classic' as LogoStyle, ar: 'كلاسيكي', en: 'Classic', desc_ar: 'أنيق وخالد مع تفاصيل دقيقة', desc_en: 'Elegant and timeless with fine details' },
    { id: 'minimal' as LogoStyle, ar: 'بسيط', en: 'Minimal', desc_ar: 'بساطة مطلقة وتأثير قوي', desc_en: 'Pure simplicity with strong impact' },
    { id: 'bold' as LogoStyle, ar: 'جريء', en: 'Bold', desc_ar: 'خطوط ثقيلة وحضور قوي', desc_en: 'Heavy strokes and strong presence' },
    { id: 'playful' as LogoStyle, ar: 'مرح', en: 'Playful', desc_ar: 'ألوان حيوية وأشكال ديناميكية', desc_en: 'Vibrant colors and dynamic shapes' },
    { id: 'luxury' as LogoStyle, ar: 'فاخر', en: 'Luxury', desc_ar: 'لمسات ذهبية وتصميم راقي', desc_en: 'Golden touches and premium design' },
  ];

  const layouts = [
    { id: 'icon-text' as LayoutType, ar: 'أيقونة + نص', en: 'Icon + Text', icon: Grid3x3 },
    { id: 'text-only' as LayoutType, ar: 'نص فقط', en: 'Text Only', icon: Type },
    { id: 'icon-only' as LayoutType, ar: 'أيقونة فقط', en: 'Icon Only', icon: Hexagon },
    { id: 'badge' as LayoutType, ar: 'شارة', en: 'Badge', icon: Shield },
    { id: 'monogram' as LayoutType, ar: 'مونوجرام', en: 'Monogram', icon: Diamond },
  ];

  const industryData = industries.find(i => i.id === industry);
  const IndustryIcon = industryData?.icon || Building2;

  // Generate logo variations
  const variations: LogoVariation[] = useMemo(() => {
    const icons = [IndustryIcon, Hexagon, Diamond, Shield, Star, Crown];
    const colorSets = [
      [primaryColor, secondaryColor],
      [secondaryColor, primaryColor],
      ['#D4AF37', '#1E3A8A'],
      ['#0A0A0F', primaryColor],
      [primaryColor, '#FFFFFF'],
      ['#8B5CF6', '#D4AF37'],
    ];

    return Array.from({ length: 6 }, (_, i) => ({
      id: `var-${i}`,
      style: logoStyle,
      layout: layout,
      primaryColor: colorSets[i][0],
      secondaryColor: colorSets[i][1],
      icon: icons[i],
      fontWeight: logoStyle === 'bold' ? 900 : logoStyle === 'minimal' ? 300 : logoStyle === 'luxury' ? 600 : 700,
      borderRadius: logoStyle === 'modern' ? 16 : logoStyle === 'classic' ? 8 : logoStyle === 'minimal' ? 0 : logoStyle === 'playful' ? 24 : 12,
    }));
  }, [logoStyle, layout, primaryColor, secondaryColor, IndustryIcon]);

  const handleGenerate = useCallback(() => {
    if (!businessName.trim()) return;
    setIsGenerating(true);
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setShowResults(true);
          return 100;
        }
        return prev + Math.random() * 5 + 2;
      });
    }, 150);
  }, [businessName]);

  // Render a single logo variation
  const renderLogoPreview = (v: LogoVariation, size: 'sm' | 'lg' = 'sm') => {
    const name = businessName || (isEn ? 'Your Brand' : 'اسم العلامة');
    const initials = name.slice(0, 2).toUpperCase();
    const IconComp = v.icon;
    const dim = size === 'lg' ? 200 : 120;
    const iconSize = size === 'lg' ? 40 : 24;
    const fontSize = size === 'lg' ? 20 : 12;
    const tagSize = size === 'lg' ? 10 : 7;

    return (
      <div
        className="flex items-center justify-center"
        style={{ width: dim, height: dim }}
      >
        {v.layout === 'icon-text' && (
          <div className="flex flex-col items-center gap-1">
            <div
              className="flex items-center justify-center"
              style={{
                width: iconSize * 1.8,
                height: iconSize * 1.8,
                borderRadius: v.borderRadius / 2,
                backgroundColor: v.primaryColor,
              }}
            >
              <IconComp style={{ width: iconSize, height: iconSize, color: v.secondaryColor === '#FFFFFF' ? '#fff' : v.secondaryColor === '#0A0A0F' ? '#fff' : v.secondaryColor }} />
            </div>
            <span style={{ fontFamily: fontCairo, fontWeight: v.fontWeight, fontSize, color: v.primaryColor, letterSpacing: v.style === 'minimal' ? 3 : 0 }}>
              {name}
            </span>
            {tagline && (
              <span style={{ fontFamily: fontCairo, fontWeight: 400, fontSize: tagSize, color: `${v.primaryColor}80`, letterSpacing: 1 }}>
                {tagline}
              </span>
            )}
          </div>
        )}
        {v.layout === 'text-only' && (
          <div className="flex flex-col items-center gap-0.5">
            <span style={{ fontFamily: fontCairo, fontWeight: v.fontWeight, fontSize: fontSize * 1.3, color: v.primaryColor, letterSpacing: v.style === 'minimal' ? 4 : v.style === 'luxury' ? 6 : 0 }}>
              {name}
            </span>
            {tagline && (
              <span style={{ fontFamily: fontCairo, fontWeight: 400, fontSize: tagSize, color: `${v.primaryColor}60`, letterSpacing: 2 }}>
                {tagline}
              </span>
            )}
            <div className="mt-1" style={{ width: '40%', height: 1.5, backgroundColor: v.primaryColor, opacity: 0.3 }} />
          </div>
        )}
        {v.layout === 'icon-only' && (
          <div
            className="flex items-center justify-center"
            style={{
              width: dim * 0.6,
              height: dim * 0.6,
              borderRadius: v.borderRadius,
              backgroundColor: v.primaryColor,
              boxShadow: `0 8px 24px ${v.primaryColor}40`,
            }}
          >
            <IconComp style={{ width: iconSize * 1.5, height: iconSize * 1.5, color: '#fff' }} />
          </div>
        )}
        {v.layout === 'badge' && (
          <div
            className="flex flex-col items-center justify-center relative"
            style={{
              width: dim * 0.65,
              height: dim * 0.65,
              borderRadius: '50%',
              border: `3px solid ${v.primaryColor}`,
              padding: 8,
            }}
          >
            <IconComp style={{ width: iconSize, height: iconSize, color: v.primaryColor }} />
            <span style={{ fontFamily: fontCairo, fontWeight: v.fontWeight, fontSize: fontSize * 0.8, color: v.primaryColor, marginTop: 2, textAlign: 'center', lineHeight: 1.1 }}>
              {name}
            </span>
          </div>
        )}
        {v.layout === 'monogram' && (
          <div
            className="flex items-center justify-center"
            style={{
              width: dim * 0.55,
              height: dim * 0.55,
              borderRadius: v.borderRadius,
              background: `linear-gradient(135deg, ${v.primaryColor}, ${v.secondaryColor})`,
              boxShadow: `0 12px 32px ${v.primaryColor}30`,
            }}
          >
            <span style={{ fontFamily: fontCairo, fontWeight: 900, fontSize: fontSize * 2, color: '#fff', letterSpacing: 2 }}>
              {initials}
            </span>
          </div>
        )}
      </div>
    );
  };

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
            <div className="w-8 h-8 bg-gradient-to-br from-[#8B5CF6] to-[#3B5BFE] rounded-lg flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-extrabold text-sm" style={{ fontFamily: fontCairo }}>
              {isEn ? 'AI Logo Creator' : 'مولّد اللوجو بالذكاء الاصطناعي'}
            </span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* ═══ Step indicator ═══ */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`flex-1 h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700]' : 'bg-white/5'
              }`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 px-1">
          <span className={`text-[9px] font-bold ${step >= 1 ? 'text-[#D4AF37]' : 'text-white/20'}`} style={{ fontFamily: fontCairo }}>
            {isEn ? 'Business Info' : 'معلومات النشاط'}
          </span>
          <span className={`text-[9px] font-bold ${step >= 2 ? 'text-[#D4AF37]' : 'text-white/20'}`} style={{ fontFamily: fontCairo }}>
            {isEn ? 'Style & Layout' : 'النمط والتخطيط'}
          </span>
          <span className={`text-[9px] font-bold ${step >= 3 ? 'text-[#D4AF37]' : 'text-white/20'}`} style={{ fontFamily: fontCairo }}>
            {isEn ? 'Colors' : 'الألوان'}
          </span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-6">
        <AnimatePresence mode="wait">
          {/* ═══ Step 1: Business Info ═══ */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <section>
                <h3 className="text-white/90 font-extrabold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: fontCairo }}>
                  <Type className="w-4 h-4 text-[#D4AF37]" />
                  {isEn ? 'Business Name' : 'اسم النشاط التجاري'}
                </h3>
                <input
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder={isEn ? 'e.g. Beit Al Reef' : 'مثال: بيت الريف'}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#D4AF37]/40 transition-colors"
                  style={{ fontFamily: fontCairo }}
                />
              </section>

              <section>
                <h3 className="text-white/90 font-extrabold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: fontCairo }}>
                  <Type className="w-4 h-4 text-[#3B5BFE]" />
                  {isEn ? 'Tagline (Optional)' : 'الشعار النصي (اختياري)'}
                </h3>
                <input
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder={isEn ? 'e.g. Building Dreams' : 'مثال: نبني الأحلام'}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#3B5BFE]/40 transition-colors"
                  style={{ fontFamily: fontCairo }}
                />
              </section>

              <section>
                <h3 className="text-white/90 font-extrabold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: fontCairo }}>
                  <Building2 className="w-4 h-4 text-[#D4AF37]" />
                  {isEn ? 'Industry' : 'القطاع'}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {industries.map(ind => (
                    <button
                      key={ind.id}
                      onClick={() => setIndustry(ind.id)}
                      className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border transition-all ${
                        industry === ind.id
                          ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40'
                          : 'bg-white/3 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <ind.icon className={`w-4 h-4 flex-shrink-0 ${
                        industry === ind.id ? 'text-[#D4AF37]' : 'text-white/30'
                      }`} />
                      <span className={`text-xs font-bold truncate ${
                        industry === ind.id ? 'text-[#D4AF37]' : 'text-white/40'
                      }`} style={{ fontFamily: fontCairo }}>
                        {isEn ? ind.en : ind.ar}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <button
                onClick={() => setStep(2)}
                disabled={!businessName.trim()}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0A0A0F] rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(212,175,55,0.2)] disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Next: Choose Style' : 'التالي: اختيار النمط'}
                <ArrowRight className={`w-4 h-4 ${isEn ? 'rotate-180' : ''}`} />
              </button>
            </motion.div>
          )}

          {/* ═══ Step 2: Style & Layout ═══ */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <section>
                <h3 className="text-white/90 font-extrabold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: fontCairo }}>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  {isEn ? 'Logo Style' : 'نمط اللوجو'}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {logoStyles.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setLogoStyle(s.id)}
                      className={`py-3.5 px-2 rounded-xl border transition-all text-center ${
                        logoStyle === s.id
                          ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40'
                          : 'bg-white/3 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <span className={`text-xs font-extrabold block ${
                        logoStyle === s.id ? 'text-[#D4AF37]' : 'text-white/40'
                      }`} style={{ fontFamily: fontCairo }}>
                        {isEn ? s.en : s.ar}
                      </span>
                      <span className="text-[8px] text-white/20 block mt-1" style={{ fontFamily: fontCairo }}>
                        {isEn ? s.desc_en : s.desc_ar}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-white/90 font-extrabold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: fontCairo }}>
                  <Layers className="w-4 h-4 text-[#3B5BFE]" />
                  {isEn ? 'Layout' : 'التخطيط'}
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {layouts.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setLayout(l.id)}
                      className={`flex-shrink-0 flex flex-col items-center gap-2 py-3 px-4 rounded-xl border transition-all min-w-[80px] ${
                        layout === l.id
                          ? 'bg-[#3B5BFE]/10 border-[#3B5BFE]/40'
                          : 'bg-white/3 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <l.icon className={`w-5 h-5 ${layout === l.id ? 'text-[#3B5BFE]' : 'text-white/30'}`} />
                      <span className={`text-[9px] font-bold ${layout === l.id ? 'text-[#3B5BFE]' : 'text-white/30'}`} style={{ fontFamily: fontCairo }}>
                        {isEn ? l.en : l.ar}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Live preview */}
              <div className="bg-white/3 border border-white/5 rounded-2xl p-6 flex items-center justify-center">
                <div className="bg-white rounded-xl p-4">
                  {renderLogoPreview(variations[0], 'lg')}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white/60 font-bold text-sm flex items-center justify-center gap-2"
                  style={{ fontFamily: fontCairo }}
                >
                  <ArrowRight className={`w-4 h-4 ${isEn ? '' : 'rotate-180'}`} />
                  {isEn ? 'Back' : 'رجوع'}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0A0A0F] rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  style={{ fontFamily: fontCairo }}
                >
                  {isEn ? 'Next: Colors' : 'التالي: الألوان'}
                  <ArrowRight className={`w-4 h-4 ${isEn ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ Step 3: Colors ═══ */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <section>
                <h3 className="text-white/90 font-extrabold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: fontCairo }}>
                  <Palette className="w-4 h-4 text-[#D4AF37]" />
                  {isEn ? 'Primary Color' : 'اللون الأساسي'}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={`p-${c}`}
                      onClick={() => setPrimaryColor(c)}
                      className={`w-10 h-10 rounded-xl border-2 transition-all ${
                        primaryColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {primaryColor === c && <Check className="w-4 h-4 text-white mx-auto" style={{ filter: c === '#FFFFFF' ? 'invert(1)' : 'none' }} />}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-white/90 font-extrabold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: fontCairo }}>
                  <Palette className="w-4 h-4 text-[#3B5BFE]" />
                  {isEn ? 'Secondary Color' : 'اللون الثانوي'}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={`s-${c}`}
                      onClick={() => setSecondaryColor(c)}
                      className={`w-10 h-10 rounded-xl border-2 transition-all ${
                        secondaryColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {secondaryColor === c && <Check className="w-4 h-4 text-white mx-auto" style={{ filter: c === '#FFFFFF' ? 'invert(1)' : 'none' }} />}
                    </button>
                  ))}
                </div>
              </section>

              {/* Color preview */}
              <div className="bg-white/3 border border-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: primaryColor }} />
                  <div className="flex-1">
                    <div className="w-full h-3 rounded-full" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }} />
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-white/30 font-mono">{primaryColor}</span>
                      <span className="text-[9px] text-white/30 font-mono">{secondaryColor}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: secondaryColor }} />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white/60 font-bold text-sm flex items-center justify-center gap-2"
                  style={{ fontFamily: fontCairo }}
                >
                  <ArrowRight className={`w-4 h-4 ${isEn ? '' : 'rotate-180'}`} />
                  {isEn ? 'Back' : 'رجوع'}
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0A0A0F] rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(212,175,55,0.2)] active:scale-[0.98] transition-all disabled:opacity-50"
                  style={{ fontFamily: fontCairo }}
                >
                  <Sparkles className="w-4 h-4" />
                  {isEn ? 'Generate Logos' : 'توليد اللوجوهات'}
                </button>
              </div>

              {/* Generation progress */}
              {isGenerating && (
                <div className="relative w-full h-12 bg-white/5 border border-[#D4AF37]/20 rounded-xl overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D4AF37]/30 to-[#D4AF37]/60"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(generationProgress, 100)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2">
                    <RotateCw className="w-4 h-4 text-[#D4AF37] animate-spin" />
                    <span className="text-white/60 text-xs font-bold" style={{ fontFamily: fontCairo }}>
                      {isEn ? 'Generating...' : 'جاري التوليد...'}
                      <span className="text-[#D4AF37] ms-2">{Math.round(Math.min(generationProgress, 100))}%</span>
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ Results Modal ═══ */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0A0A0F]/95 backdrop-blur-xl overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 sticky top-0 z-10 bg-[#0A0A0F]/80 backdrop-blur-xl">
              <button onClick={() => setShowResults(false)} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <X className="w-5 h-5 text-white" />
              </button>
              <span className="text-white font-extrabold text-sm" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Your Logo Variations' : 'تنويعات اللوجو'}
              </span>
              <button
                onClick={() => { setShowResults(false); setStep(1); }}
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"
              >
                <RotateCw className="w-4 h-4 text-white/60" />
              </button>
            </div>

            <div className="px-4 pb-6">
              {/* Selected large preview */}
              <div className="bg-white rounded-3xl p-8 mb-6 flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                {renderLogoPreview(variations[selectedVariation], 'lg')}
              </div>

              {/* Variations grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {variations.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariation(i)}
                    className={`bg-white rounded-xl p-3 flex items-center justify-center aspect-square transition-all ${
                      selectedVariation === i
                        ? 'ring-2 ring-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)] scale-105'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {renderLogoPreview(v, 'sm')}
                  </button>
                ))}
              </div>

              {/* Dark preview */}
              <div className="bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 mb-6 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-white/20 text-[9px] font-bold mb-2" style={{ fontFamily: fontCairo }}>
                    {isEn ? 'DARK BACKGROUND PREVIEW' : 'معاينة على خلفية داكنة'}
                  </span>
                  {renderLogoPreview({ ...variations[selectedVariation], secondaryColor: '#FFFFFF' }, 'lg')}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0A0A0F] rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(212,175,55,0.3)]" style={{ fontFamily: fontCairo }}>
                  <Download className="w-5 h-5" />
                  {isEn ? 'Download Logo Pack (PNG, SVG)' : 'تحميل حزمة اللوجو (PNG, SVG)'}
                </button>
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white/60 text-sm font-bold" style={{ fontFamily: fontCairo }}>
                    <Share2 className="w-4 h-4" />
                    {isEn ? 'Share' : 'مشاركة'}
                  </button>
                  <button
                    onClick={() => { setShowResults(false); handleGenerate(); }}
                    className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white/60 text-sm font-bold"
                    style={{ fontFamily: fontCairo }}
                  >
                    <RotateCw className="w-4 h-4" />
                    {isEn ? 'Regenerate' : 'إعادة توليد'}
                  </button>
                  <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white/60 text-sm font-bold" style={{ fontFamily: fontCairo }}>
                    <Copy className="w-4 h-4" />
                    {isEn ? 'Copy' : 'نسخ'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}