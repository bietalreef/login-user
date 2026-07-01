/**
 * IsometricShowcase.tsx — معرض الغرف الإيزومتريك التفاعلي
 * ─────────────────────────────────────────────────────────
 * مستوحى من "3D Minimal Isometric Interior" بأسلوب مينيمال
 * 6 غرف داخلية بتأثير إيزومتريك ثلاثي الأبعاد حقيقي
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, ChevronLeft, ChevronRight, Maximize2, Minimize2,
  Home, UtensilsCrossed, Bed, Bath, Monitor, Armchair,
  Layers, Eye, Palette, Ruler, ShoppingCart, Heart,
  RotateCw, ZoomIn, Grid3x3, Sparkles, ArrowUpRight,
} from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

// ═══════════════════════════════════════
// Room Data
// ═══════════════════════════════════════
interface IsometricRoom {
  id: string;
  name: string;
  nameEn: string;
  subtitle: string;
  subtitleEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  icon: any;
  color: string;
  colorLight: string;
  priceFrom: number;
  features: { ar: string; en: string }[];
  materials: { name: string; nameEn: string; color: string }[];
  dimensions: { ar: string; en: string };
}

const ROOMS: IsometricRoom[] = [
  {
    id: 'living',
    name: 'صالة المعيشة',
    nameEn: 'Living Room',
    subtitle: 'تصميم عصري مفتوح',
    subtitleEn: 'Modern Open Design',
    description: 'صالة معيشة بتصميم مينيمال عصري مع إضاءة طبيعية وألوان دافئة. أثاث إيطالي فاخر مع لمسات خشبية.',
    descriptionEn: 'Minimal modern living room with natural lighting and warm colors. Luxury Italian furniture with wooden accents.',
    image: 'https://images.unsplash.com/photo-1667510436110-79d3dabc2008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    icon: Armchair,
    color: '#2AA676',
    colorLight: 'rgba(42, 166, 118, 0.15)',
    priceFrom: 45000,
    features: [
      { ar: 'إضاءة مخفية LED', en: 'Hidden LED Lighting' },
      { ar: 'أرضيات باركيه بلوط', en: 'Oak Parquet Flooring' },
      { ar: 'جبس بورد مزخرف', en: 'Decorative Gypsum Board' },
      { ar: 'نوافذ بانورامية', en: 'Panoramic Windows' },
    ],
    materials: [
      { name: 'رخام', nameEn: 'Marble', color: '#E8E0D0' },
      { name: 'خشب بلوط', nameEn: 'Oak Wood', color: '#8B6914' },
      { name: 'جلد إيطالي', nameEn: 'Italian Leather', color: '#3C2415' },
    ],
    dimensions: { ar: '٦ × ٨ متر', en: '6 × 8 m' },
  },
  {
    id: 'kitchen',
    name: 'المطبخ',
    nameEn: 'Kitchen',
    subtitle: 'مطبخ ذكي متكامل',
    subtitleEn: 'Smart Integrated Kitchen',
    description: 'مطبخ حديث بتقنيات ذكية وخامات عالية الجودة. كاونتر رخام كرارا مع خزائن MDF لاكر.',
    descriptionEn: 'Modern kitchen with smart technology and premium materials. Carrara marble counter with MDF lacquer cabinets.',
    image: 'https://images.unsplash.com/photo-1643034738686-d69e7bc047e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    icon: UtensilsCrossed,
    color: '#D4AF37',
    colorLight: 'rgba(212, 175, 55, 0.15)',
    priceFrom: 65000,
    features: [
      { ar: 'كاونتر رخام كرارا', en: 'Carrara Marble Counter' },
      { ar: 'أجهزة مدمجة', en: 'Built-in Appliances' },
      { ar: 'إضاءة LED تحت الخزائن', en: 'Under-cabinet LED' },
      { ar: 'نظام سحب سوفت كلوز', en: 'Soft-close System' },
    ],
    materials: [
      { name: 'رخام كرارا', nameEn: 'Carrara Marble', color: '#F0EDE8' },
      { name: 'لاكر أبيض', nameEn: 'White Lacquer', color: '#FAFAFA' },
      { name: 'ستيل مصقول', nameEn: 'Polished Steel', color: '#C0C0C0' },
    ],
    dimensions: { ar: '٤ × ٥ متر', en: '4 × 5 m' },
  },
  {
    id: 'bedroom',
    name: 'غرفة النوم',
    nameEn: 'Bedroom',
    subtitle: 'واحة الراحة والهدوء',
    subtitleEn: 'Oasis of Comfort',
    description: 'غرفة نوم رئيسية بتصميم فندقي فاخر. إضاءة محيطية هادئة مع خامات طبيعية.',
    descriptionEn: 'Master bedroom with luxury hotel design. Ambient calm lighting with natural materials.',
    image: 'https://images.unsplash.com/photo-1766928210443-0be92ed5884a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    icon: Bed,
    color: '#8B6FBF',
    colorLight: 'rgba(139, 111, 191, 0.15)',
    priceFrom: 38000,
    features: [
      { ar: 'سرير كينج مع هيدبورد', en: 'King Bed with Headboard' },
      { ar: 'خزانة ملابس مدمجة', en: 'Built-in Wardrobe' },
      { ar: 'إضاءة محيطية', en: 'Ambient Lighting' },
      { ar: 'ستائر بلاك آوت', en: 'Blackout Curtains' },
    ],
    materials: [
      { name: 'قماش مخمل', nameEn: 'Velvet Fabric', color: '#4A3B6B' },
      { name: 'خشب جوز', nameEn: 'Walnut Wood', color: '#5C3D2E' },
      { name: 'كتان طبيعي', nameEn: 'Natural Linen', color: '#E8DCC8' },
    ],
    dimensions: { ar: '٥ × ٦ متر', en: '5 × 6 m' },
  },
  {
    id: 'bathroom',
    name: 'الحمام',
    nameEn: 'Bathroom',
    subtitle: 'سبا منزلي فاخر',
    subtitleEn: 'Luxury Home Spa',
    description: 'حمام فاخر بتصميم سبا مع رخام إيطالي وتجهيزات ألمانية. دش مطري وبانيو قائم.',
    descriptionEn: 'Luxury spa-style bathroom with Italian marble and German fixtures. Rain shower and freestanding bathtub.',
    image: 'https://images.unsplash.com/photo-1572742482459-e04d6cfdd6f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    icon: Bath,
    color: '#3B8CD4',
    colorLight: 'rgba(59, 140, 212, 0.15)',
    priceFrom: 35000,
    features: [
      { ar: 'رخام إيطالي أصلي', en: 'Genuine Italian Marble' },
      { ar: 'دش مطري كبير', en: 'Large Rain Shower' },
      { ar: 'بانيو قائم', en: 'Freestanding Bathtub' },
      { ar: 'تدفئة أرضية', en: 'Floor Heating' },
    ],
    materials: [
      { name: 'رخام أبيض', nameEn: 'White Marble', color: '#F5F0EA' },
      { name: 'كروم مصقول', nameEn: 'Polished Chrome', color: '#D0D0D0' },
      { name: 'زجاج مقسى', nameEn: 'Tempered Glass', color: '#E0EBF0' },
    ],
    dimensions: { ar: '٣ × ٤ متر', en: '3 × 4 m' },
  },
  {
    id: 'office',
    name: 'المكتب',
    nameEn: 'Office',
    subtitle: 'مساحة عمل إبداعية',
    subtitleEn: 'Creative Workspace',
    description: 'مكتب منزلي بتصميم عصري يجمع بين الأناقة والوظيفية. إضاءة مركزة مع تنظيم ذكي.',
    descriptionEn: 'Modern home office combining elegance and functionality. Focused lighting with smart organization.',
    image: 'https://images.unsplash.com/photo-1516798705208-066b05ced1cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    icon: Monitor,
    color: '#E0924A',
    colorLight: 'rgba(224, 146, 74, 0.15)',
    priceFrom: 28000,
    features: [
      { ar: 'مكتب عمل كبير', en: 'Large Work Desk' },
      { ar: 'رفوف مدمجة', en: 'Built-in Shelves' },
      { ar: 'إضاءة مركزة', en: 'Task Lighting' },
      { ar: 'عزل صوتي', en: 'Sound Insulation' },
    ],
    materials: [
      { name: 'خشب أبيض', nameEn: 'White Wood', color: '#F0ECE2' },
      { name: 'معدن أسود', nameEn: 'Black Metal', color: '#2A2A2A' },
      { name: 'جلد بني', nameEn: 'Brown Leather', color: '#6B4226' },
    ],
    dimensions: { ar: '٣ × ٤ متر', en: '3 × 4 m' },
  },
  {
    id: 'dining',
    name: 'غرفة الطعام',
    nameEn: 'Dining Room',
    subtitle: 'أجواء عائلية دافئة',
    subtitleEn: 'Warm Family Ambiance',
    description: 'غرفة طعام أنيقة بطاولة خشب جوز تتسع لـ ٨ أشخاص. ثريا كريستال مع إضاءة دافئة.',
    descriptionEn: 'Elegant dining room with walnut table seating 8. Crystal chandelier with warm lighting.',
    image: 'https://images.unsplash.com/photo-1758977403438-1b8546560d31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    icon: Home,
    color: '#C4625D',
    colorLight: 'rgba(196, 98, 93, 0.15)',
    priceFrom: 32000,
    features: [
      { ar: 'طاولة خشب جوز ٨ أشخاص', en: 'Walnut Table for 8' },
      { ar: 'ثريا كريستال', en: 'Crystal Chandelier' },
      { ar: 'خزانة عرض زجاجية', en: 'Glass Display Cabinet' },
      { ar: 'سجاد حرير يدوي', en: 'Handmade Silk Rug' },
    ],
    materials: [
      { name: 'خشب جوز', nameEn: 'Walnut', color: '#5C3D2E' },
      { name: 'كريستال', nameEn: 'Crystal', color: '#E8E4F0' },
      { name: 'حرير', nameEn: 'Silk', color: '#D4C8A0' },
    ],
    dimensions: { ar: '٤ × ٥ متر', en: '4 × 5 m' },
  },
];

// ═══════════════════════════════════════
// Isometric Room Card — CSS 3D Transform
// ═══════════════════════════════════════
function IsometricCard({
  room,
  isActive,
  onClick,
  isEn,
  index,
}: {
  room: IsometricRoom;
  isActive: boolean;
  onClick: () => void;
  isEn: boolean;
  index: number;
}) {
  const IconComp = room.icon;
  const currency = isEn ? 'AED' : 'د.إ';
  const fontFamily = 'Cairo, sans-serif';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="cursor-pointer group"
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          transform: isActive
            ? 'rotateX(0deg) rotateY(0deg) scale(1.02)'
            : 'rotateX(8deg) rotateY(-5deg) scale(1)',
          transformStyle: 'preserve-3d',
          boxShadow: isActive
            ? `0 20px 60px ${room.color}30, 0 0 0 1px ${room.color}40`
            : '0 8px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        {/* Image with isometric overlay */}
        <div className="relative h-44 overflow-hidden">
          <ImageWithFallback
            src={room.image}
            alt={isEn ? room.nameEn : room.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Isometric grid overlay */}
          <div
            className="absolute inset-0 opacity-20 group-hover:opacity-10 transition-opacity"
            style={{
              backgroundImage: `
                linear-gradient(30deg, ${room.color}15 12%, transparent 12.5%, transparent 87%, ${room.color}15 87.5%),
                linear-gradient(150deg, ${room.color}15 12%, transparent 12.5%, transparent 87%, ${room.color}15 87.5%),
                linear-gradient(30deg, ${room.color}15 12%, transparent 12.5%, transparent 87%, ${room.color}15 87.5%),
                linear-gradient(150deg, ${room.color}15 12%, transparent 12.5%, transparent 87%, ${room.color}15 87.5%)
              `,
              backgroundSize: '40px 70px',
              backgroundPosition: '0 0, 0 0, 20px 35px, 20px 35px',
            }}
          />

          {/* Top gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-transparent" />

          {/* Isometric "3D" corner decoration */}
          <div
            className="absolute top-0 left-0 w-full h-12"
            style={{
              background: `linear-gradient(180deg, ${room.color}15, transparent)`,
            }}
          />

          {/* Icon badge */}
          <div
            className="absolute top-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            style={{
              background: `${room.color}25`,
              borderColor: `${room.color}40`,
            }}
          >
            <IconComp className="w-5 h-5" style={{ color: room.color }} />
          </div>

          {/* Price tag */}
          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10 bg-black/50">
            <span className="text-white/60 text-[10px] block" style={{ fontFamily, fontWeight: 600 }}>
              {isEn ? 'From' : 'يبدأ من'}
            </span>
            <span className="text-white text-sm" style={{ fontFamily, fontWeight: 800 }}>
              {room.priceFrom.toLocaleString()} <span className="text-[10px] opacity-60">{currency}</span>
            </span>
          </div>

          {/* 3D Perspective lines */}
          <svg className="absolute bottom-0 right-0 w-20 h-20 opacity-20 group-hover:opacity-40 transition-opacity" viewBox="0 0 80 80">
            <line x1="80" y1="0" x2="40" y2="80" stroke={room.color} strokeWidth="0.5" />
            <line x1="80" y1="20" x2="50" y2="80" stroke={room.color} strokeWidth="0.5" />
            <line x1="80" y1="40" x2="60" y2="80" stroke={room.color} strokeWidth="0.5" />
          </svg>
        </div>

        {/* Content */}
        <div className="p-4 bg-[#1C2026] relative">
          {/* Subtle top border glow */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(to right, transparent, ${room.color}50, transparent)` }}
          />

          <h3 className="text-white text-base mb-0.5" style={{ fontFamily, fontWeight: 800, textAlign: isEn ? 'left' : 'right' }}>
            {isEn ? room.nameEn : room.name}
          </h3>
          <p className="text-white/40 text-xs mb-3" style={{ fontFamily, fontWeight: 600, textAlign: isEn ? 'left' : 'right' }}>
            {isEn ? room.subtitleEn : room.subtitle}
          </p>

          {/* Materials swatches */}
          <div className="flex items-center gap-1.5">
            {room.materials.map((mat, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 border-[#252A32] transition-transform hover:scale-125"
                style={{ background: mat.color }}
                title={isEn ? mat.nameEn : mat.name}
              />
            ))}
            <span className="text-white/30 text-[10px] mr-auto ml-1" style={{ fontFamily, fontWeight: 600 }}>
              {isEn ? `${room.materials.length} materials` : `${room.materials.length} خامات`}
            </span>
            <ArrowUpRight
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: room.color }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// Room Detail Panel
// ═══════════════════════════════════════
function RoomDetailPanel({
  room,
  onClose,
  isEn,
}: {
  room: IsometricRoom;
  onClose: () => void;
  isEn: boolean;
}) {
  const IconComp = room.icon;
  const currency = isEn ? 'AED' : 'د.إ';
  const fontFamily = 'Cairo, sans-serif';
  const [selectedMaterial, setSelectedMaterial] = useState(0);
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] bg-[#111318] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
      >
        {/* Hero Image */}
        <div className="relative h-56 flex-shrink-0">
          <ImageWithFallback
            src={room.image}
            alt={isEn ? room.nameEn : room.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/30 to-transparent" />

          {/* Header controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className={`w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
                liked ? 'bg-red-500/20 border-red-500/40' : 'bg-black/50 border-white/10 hover:bg-white/10'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'text-red-400 fill-current' : 'text-white'}`} />
            </button>
          </div>

          {/* Room badge */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                style={{ background: `${room.color}20`, borderColor: `${room.color}30` }}
              >
                <IconComp className="w-6 h-6" style={{ color: room.color }} />
              </div>
              <div>
                <h2 className="text-white text-xl" style={{ fontFamily, fontWeight: 800 }}>
                  {isEn ? room.nameEn : room.name}
                </h2>
                <p className="text-white/50 text-sm" style={{ fontFamily, fontWeight: 600 }}>
                  {isEn ? room.subtitleEn : room.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Description */}
          <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily, fontWeight: 500, textAlign: isEn ? 'left' : 'right' }}>
            {isEn ? room.descriptionEn : room.description}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1C2026] rounded-xl p-3 text-center border border-white/5">
              <Ruler className="w-4 h-4 text-white/40 mx-auto mb-1" />
              <span className="text-white text-xs block" style={{ fontFamily, fontWeight: 700 }}>
                {isEn ? room.dimensions.en : room.dimensions.ar}
              </span>
              <span className="text-white/30 text-[10px]" style={{ fontFamily, fontWeight: 600 }}>
                {isEn ? 'Dimensions' : 'الأبعاد'}
              </span>
            </div>
            <div className="bg-[#1C2026] rounded-xl p-3 text-center border border-white/5">
              <Layers className="w-4 h-4 text-white/40 mx-auto mb-1" />
              <span className="text-white text-xs block" style={{ fontFamily, fontWeight: 700 }}>
                {room.materials.length}
              </span>
              <span className="text-white/30 text-[10px]" style={{ fontFamily, fontWeight: 600 }}>
                {isEn ? 'Materials' : 'خامات'}
              </span>
            </div>
            <div className="bg-[#1C2026] rounded-xl p-3 text-center border border-white/5">
              <Sparkles className="w-4 h-4 text-white/40 mx-auto mb-1" />
              <span className="text-white text-xs block" style={{ fontFamily, fontWeight: 700 }}>
                {room.features.length}
              </span>
              <span className="text-white/30 text-[10px]" style={{ fontFamily, fontWeight: 600 }}>
                {isEn ? 'Features' : 'مميزات'}
              </span>
            </div>
          </div>

          {/* Materials Selection */}
          <div>
            <h4 className="text-white/80 text-sm mb-3" style={{ fontFamily, fontWeight: 700, textAlign: isEn ? 'left' : 'right' }}>
              <Palette className="w-4 h-4 inline-block ml-1 opacity-50" />
              {isEn ? ' Materials & Finishes' : ' الخامات والتشطيبات'}
            </h4>
            <div className="flex gap-3">
              {room.materials.map((mat, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMaterial(i)}
                  className={`flex-1 p-3 rounded-xl border transition-all ${
                    selectedMaterial === i
                      ? 'border-white/20 bg-[#1C2026]'
                      : 'border-white/5 bg-[#1C2026]/50 hover:border-white/10'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg mx-auto mb-2 border-2 transition-all ${
                      selectedMaterial === i ? 'border-white/40 scale-110' : 'border-[#252A32]'
                    }`}
                    style={{ background: mat.color }}
                  />
                  <span className="text-white/60 text-[11px] block text-center" style={{ fontFamily, fontWeight: 600 }}>
                    {isEn ? mat.nameEn : mat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Features List */}
          <div>
            <h4 className="text-white/80 text-sm mb-3" style={{ fontFamily, fontWeight: 700, textAlign: isEn ? 'left' : 'right' }}>
              <Grid3x3 className="w-4 h-4 inline-block ml-1 opacity-50" />
              {isEn ? ' Included Features' : ' المميزات المتضمنة'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {room.features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-[#1C2026] rounded-xl px-3 py-2.5 border border-white/5"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: room.color }}
                  />
                  <span className="text-white/60 text-xs" style={{ fontFamily, fontWeight: 600 }}>
                    {isEn ? feat.en : feat.ar}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex-shrink-0 p-5 border-t border-white/5 bg-[#111318]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-white/40 text-xs block" style={{ fontFamily, fontWeight: 600 }}>
                {isEn ? 'Starting from' : 'يبدأ من'}
              </span>
              <span className="text-2xl text-white" style={{ fontFamily, fontWeight: 800 }}>
                {room.priceFrom.toLocaleString()}{' '}
                <span className="text-sm opacity-40">{currency}</span>
              </span>
            </div>
            <div
              className="px-3 py-1 rounded-lg text-[10px]"
              style={{ background: room.colorLight, color: room.color, fontFamily, fontWeight: 700 }}
            >
              {isEn ? 'Full Package' : 'باقة متكاملة'}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="flex-1 py-3.5 rounded-xl text-white text-sm transition-all hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, ${room.color}, ${room.color}CC)`,
                fontFamily,
                fontWeight: 700,
                boxShadow: `0 8px 24px ${room.color}30`,
              }}
            >
              <Eye className="w-4 h-4 inline-block ml-1" />
              {isEn ? ' View in 3D' : ' معاينة ثلاثية الأبعاد'}
            </button>
            <button
              className="px-5 py-3.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] text-sm hover:bg-[#D4AF37]/20 transition-colors border border-[#D4AF37]/20"
              style={{ fontFamily, fontWeight: 700 }}
            >
              <ShoppingCart className="w-4 h-4 inline-block ml-1" />
              {isEn ? ' Order' : ' اطلب'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// Main Showcase Component
// ═══════════════════════════════════════
export function IsometricShowcase({
  onClose,
  isEn = false,
}: {
  onClose: () => void;
  isEn?: boolean;
}) {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [detailRoom, setDetailRoom] = useState<IsometricRoom | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const fontFamily = 'Cairo, sans-serif';

  const handleRoomClick = (room: IsometricRoom) => {
    setActiveRoom(room.id);
    setDetailRoom(room);
  };

  const nextCarousel = () => setCarouselIndex((prev) => (prev + 1) % ROOMS.length);
  const prevCarousel = () => setCarouselIndex((prev) => (prev - 1 + ROOMS.length) % ROOMS.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-[#0A0C0F] flex flex-col overflow-hidden"
    >
      {/* ═══ Header ═══ */}
      <div className="flex-shrink-0 px-5 pt-5 pb-3 flex items-center justify-between relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#D4AF37]/5 blur-3xl" />
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#D4AF37]/5 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2AA676]/20 to-[#D4AF37]/10 border border-[#2AA676]/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-[#2AA676]" />
            </div>
            <h1 className="text-white text-xl" style={{ fontFamily, fontWeight: 800 }}>
              {isEn ? 'Interior Design Gallery' : 'معرض التصميم الداخلي'}
            </h1>
          </div>
          <p className="text-white/40 text-xs mr-10" style={{ fontFamily, fontWeight: 600 }}>
            {isEn
              ? '6 Isometric 3D Rooms · Tap to explore'
              : '٦ غرف إيزومتريك ثلاثية الأبعاد · اضغط للاستكشاف'}
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          {/* View toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'carousel' : 'grid')}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            {viewMode === 'grid' ? (
              <RotateCw className="w-4.5 h-4.5 text-white/50" />
            ) : (
              <Grid3x3 className="w-4.5 h-4.5 text-white/50" />
            )}
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 transition-colors group"
          >
            <X className="w-5 h-5 text-white/50 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* ═══ Room Type Pills ═══ */}
      <div className="flex-shrink-0 px-5 pb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {ROOMS.map((room) => {
            const IconComp = room.icon;
            const isActive = activeRoom === room.id;
            return (
              <button
                key={room.id}
                onClick={() => {
                  setActiveRoom(room.id);
                  const idx = ROOMS.findIndex((r) => r.id === room.id);
                  if (idx >= 0) setCarouselIndex(idx);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-all border ${
                  isActive
                    ? 'border-white/20 text-white'
                    : 'border-white/5 text-white/40 hover:border-white/10 hover:text-white/60'
                }`}
                style={{
                  background: isActive ? `${room.color}15` : 'rgba(255,255,255,0.03)',
                  fontFamily,
                  fontWeight: 700,
                }}
              >
                <IconComp className="w-3.5 h-3.5" style={{ color: isActive ? room.color : undefined }} />
                {isEn ? room.nameEn : room.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-2 gap-3">
            {ROOMS.map((room, idx) => (
              <IsometricCard
                key={room.id}
                room={room}
                isActive={activeRoom === room.id}
                onClick={() => handleRoomClick(room)}
                isEn={isEn}
                index={idx}
              />
            ))}
          </div>
        ) : (
          /* Carousel View */
          <div className="relative h-full flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0, x: 100, rotateY: -15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -100, rotateY: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full"
                style={{ perspective: '1200px' }}
              >
                <div
                  className="relative rounded-3xl overflow-hidden mx-auto max-w-sm"
                  style={{
                    transform: 'rotateX(5deg) rotateY(-3deg)',
                    transformStyle: 'preserve-3d',
                    boxShadow: `0 30px 80px ${ROOMS[carouselIndex].color}20, 0 0 0 1px ${ROOMS[carouselIndex].color}20`,
                  }}
                >
                  {/* Large Image */}
                  <div className="relative h-72">
                    <ImageWithFallback
                      src={ROOMS[carouselIndex].image}
                      alt={isEn ? ROOMS[carouselIndex].nameEn : ROOMS[carouselIndex].name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/20 to-transparent" />

                    {/* Room counter */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                      <span className="text-white text-xs" style={{ fontFamily, fontWeight: 700 }}>
                        {carouselIndex + 1} / {ROOMS.length}
                      </span>
                    </div>

                    {/* Icon */}
                    <div
                      className="absolute top-4 right-4 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md border"
                      style={{
                        background: `${ROOMS[carouselIndex].color}20`,
                        borderColor: `${ROOMS[carouselIndex].color}30`,
                      }}
                    >
                      {(() => {
                        const IC = ROOMS[carouselIndex].icon;
                        return <IC className="w-6 h-6" style={{ color: ROOMS[carouselIndex].color }} />;
                      })()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 bg-[#1C2026]">
                    <h2 className="text-white text-2xl mb-1" style={{ fontFamily, fontWeight: 800, textAlign: isEn ? 'left' : 'right' }}>
                      {isEn ? ROOMS[carouselIndex].nameEn : ROOMS[carouselIndex].name}
                    </h2>
                    <p className="text-white/40 text-sm mb-4" style={{ fontFamily, fontWeight: 600, textAlign: isEn ? 'left' : 'right' }}>
                      {isEn ? ROOMS[carouselIndex].subtitleEn : ROOMS[carouselIndex].subtitle}
                    </p>

                    {/* Materials */}
                    <div className="flex items-center gap-2 mb-4">
                      {ROOMS[carouselIndex].materials.map((mat, i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full border-2 border-[#252A32]"
                          style={{ background: mat.color }}
                          title={isEn ? mat.nameEn : mat.name}
                        />
                      ))}
                      <span className="text-white/30 text-xs mr-2" style={{ fontFamily, fontWeight: 600 }}>
                        {isEn ? 'Available finishes' : 'التشطيبات المتاحة'}
                      </span>
                    </div>

                    {/* Features preview */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {ROOMS[carouselIndex].features.slice(0, 2).map((f, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 text-white/50 border border-white/5"
                          style={{ fontFamily, fontWeight: 600 }}
                        >
                          {isEn ? f.en : f.ar}
                        </span>
                      ))}
                      <span
                        className="text-[11px] px-2.5 py-1 rounded-lg text-white/30 border border-white/5"
                        style={{ fontFamily, fontWeight: 600 }}
                      >
                        +{ROOMS[carouselIndex].features.length - 2}
                      </span>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white/40 text-xs block" style={{ fontFamily, fontWeight: 600 }}>
                          {isEn ? 'From' : 'يبدأ من'}
                        </span>
                        <span className="text-white text-xl" style={{ fontFamily, fontWeight: 800 }}>
                          {ROOMS[carouselIndex].priceFrom.toLocaleString()}{' '}
                          <span className="text-xs opacity-40">{isEn ? 'AED' : 'د.إ'}</span>
                        </span>
                      </div>
                      <button
                        onClick={() => handleRoomClick(ROOMS[carouselIndex])}
                        className="px-5 py-3 rounded-xl text-white text-sm transition-all hover:brightness-110"
                        style={{
                          background: `linear-gradient(135deg, ${ROOMS[carouselIndex].color}, ${ROOMS[carouselIndex].color}CC)`,
                          fontFamily,
                          fontWeight: 700,
                          boxShadow: `0 8px 24px ${ROOMS[carouselIndex].color}25`,
                        }}
                      >
                        {isEn ? 'Explore' : 'استكشف'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <button
              onClick={prevCarousel}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5 text-white/50" />
            </button>
            <button
              onClick={nextCarousel}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5 text-white/50" />
            </button>
          </div>
        )}

        {/* Bottom decorative element */}
        <div className="mt-6 mb-4 flex justify-center">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/3 border border-white/5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]/50" />
            <span className="text-white/25 text-[11px]" style={{ fontFamily, fontWeight: 600 }}>
              {isEn
                ? 'Inspired by 3D Minimal Isometric Interior Design'
                : 'مستوحى من التصميم الداخلي الإيزومتريك المينيمال'}
            </span>
          </div>
        </div>
      </div>

      {/* ═══ Room Detail Modal ═══ */}
      <AnimatePresence>
        {detailRoom && (
          <RoomDetailPanel
            room={detailRoom}
            onClose={() => setDetailRoom(null)}
            isEn={isEn}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// Compact Banner for StoreHome
// ═══════════════════════════════════════
export function IsometricBanner({
  onClick,
  isEn = false,
}: {
  onClick: () => void;
  isEn?: boolean;
}) {
  const fontFamily = 'Cairo, sans-serif';
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full rounded-2xl overflow-hidden relative group"
      style={{ height: 110 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#111318] via-[#1a1d24] to-[#111318]" />

      {/* Isometric grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="iso-grid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="skewX(-30)">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#iso-grid)" />
      </svg>

      {/* Floating room previews */}
      <div className="absolute right-4 top-2 flex gap-1.5">
        {ROOMS.slice(0, 4).map((room, i) => (
          <motion.div
            key={room.id}
            animate={{
              y: hovered ? [0, -3, 0] : 0,
              rotate: hovered ? [-2, 2, -2] : 0,
            }}
            transition={{ delay: i * 0.1, duration: 1.5, repeat: Infinity }}
            className="w-[42px] h-[42px] rounded-lg overflow-hidden border border-white/10 shadow-lg"
            style={{
              transform: `perspective(400px) rotateX(10deg) rotateY(-8deg) translateZ(${i * 5}px)`,
            }}
          >
            <ImageWithFallback
              src={room.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-5 gap-4">
        {/* Isometric cube icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37]/15 to-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform relative">
          <Home className="w-6 h-6 text-[#D4AF37]" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center">
            <Layers className="w-3 h-3 text-[#D4AF37]" />
          </div>
        </div>

        <div className="flex-1" style={{ textAlign: isEn ? 'left' : 'right' }}>
          <h3 className="text-white text-[15px] mb-0.5" style={{ fontFamily, fontWeight: 800 }}>
            {isEn ? 'Isometric Interior Gallery' : 'معرض التصميم الداخلي'}
          </h3>
          <p className="text-white/35 text-[11px]" style={{ fontFamily, fontWeight: 600 }}>
            {isEn ? '6 Rooms · 3D Isometric · Interactive' : '٦ غرف · إيزومتريك ثلاثي الأبعاد · تفاعلي'}
          </p>
        </div>

        {/* CTA pill */}
        <div
          className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C8A030] text-black text-sm group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
          style={{ fontFamily, fontWeight: 700 }}
        >
          {isEn ? 'Explore' : 'استكشف'}
        </div>
      </div>

      {/* Shine lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent" />
    </motion.button>
  );
}