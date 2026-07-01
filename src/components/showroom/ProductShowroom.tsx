/**
 * ProductShowroom.tsx — معرض المنتجات ثلاثي الأبعاد
 * ══════════════════════════════════════════════════
 * MyHome-inspired product viewer for Biet Al Reef
 * Wall + Floor mockup with product placement
 * 2D/3D toggle, product library, commerce actions
 * 
 * NO emoji. Icon3D only. RTL. Cairo font.
 * Gold accents (#D4AF37 / #FFD700). NO green.
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon3D } from '../ui/Icon3D';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  X, ShoppingCart, Phone, RotateCw, ZoomIn, ZoomOut,
  Box, Grid3x3, Palette, Ruler, ChevronDown, ChevronUp,
  Layers, Home, Maximize2, Minimize2, Move, Trash2,
  Sun, Moon, DoorOpen, Square, Frame, Columns,
} from 'lucide-react';

// ═══════════════════════════════════════════════
// Types & Data
// ═══════════════════════════════════════════════

interface ShowroomProduct {
  id: string;
  name: string;
  category: 'doors' | 'windows' | 'cladding' | 'exterior';
  material: string;
  width: number;   // cm
  height: number;   // cm
  price: number;    // AED
  supplier: string;
  color: string;    // hex for rendering
  frameColor: string;
  glassOpacity: number;
  panes: { cols: number; rows: number };
  style: 'modern' | 'classic' | 'french' | 'arch' | 'sliding' | 'panel';
}

interface PlacedProduct {
  productId: string;
  x: number; // 0-1 normalized position on wall
  y: number;
  scale: number;
}

type FloorType = 'tile' | 'wood' | 'marble';
type ViewMode = '2d' | '3d';
type PanelTab = 'products' | 'colors' | 'floor';

// ─── Product Catalog ───
const PRODUCTS: ShowroomProduct[] = [
  // Doors
  { id: 'd1', name: 'باب فرنسي كلاسيك', category: 'doors', material: 'خشب صلب', width: 220, height: 280, price: 4800, supplier: 'الإمارات للأبواب', color: '#5D4037', frameColor: '#4E342E', glassOpacity: 0, panes: { cols: 1, rows: 1 }, style: 'french' },
  { id: 'd2', name: 'باب حديث مزدوج', category: 'doors', material: 'ألمنيوم + زجاج', width: 200, height: 260, price: 6200, supplier: 'تيك هاوس', color: '#37474F', frameColor: '#263238', glassOpacity: 0.3, panes: { cols: 2, rows: 3 }, style: 'modern' },
  { id: 'd3', name: 'باب منزلق زجاجي', category: 'doors', material: 'زجاج مزدوج', width: 240, height: 270, price: 7500, supplier: 'جلاس ورلد', color: '#546E7A', frameColor: '#37474F', glassOpacity: 0.6, panes: { cols: 2, rows: 1 }, style: 'sliding' },
  { id: 'd4', name: 'باب لوحي خشبي', category: 'doors', material: 'خشب بلوط', width: 100, height: 250, price: 3200, supplier: 'وود كرافت', color: '#6D4C41', frameColor: '#5D4037', glassOpacity: 0, panes: { cols: 1, rows: 1 }, style: 'panel' },

  // Windows
  { id: 'w1', name: 'شباك فرنسي تقليدي', category: 'windows', material: 'خشب + زجاج', width: 160, height: 180, price: 3400, supplier: 'النوافذ الذهبية', color: '#4E342E', frameColor: '#3E2723', glassOpacity: 0.5, panes: { cols: 3, rows: 4 }, style: 'french' },
  { id: 'w2', name: 'نافذة ألمنيوم عصرية', category: 'windows', material: 'ألمنيوم', width: 120, height: 140, price: 2100, supplier: 'ألو تك', color: '#78909C', frameColor: '#546E7A', glassOpacity: 0.4, panes: { cols: 2, rows: 2 }, style: 'modern' },
  { id: 'w3', name: 'نافذة قوسية', category: 'windows', material: 'خشب + زجاج ملون', width: 100, height: 200, price: 5600, supplier: 'التراث للنوافذ', color: '#5D4037', frameColor: '#4E342E', glassOpacity: 0.35, panes: { cols: 2, rows: 3 }, style: 'arch' },
  { id: 'w4', name: 'نافذة كبيرة ثابتة', category: 'windows', material: 'زجاج مزدوج عازل', width: 200, height: 160, price: 4200, supplier: 'بانوراما', color: '#455A64', frameColor: '#37474F', glassOpacity: 0.6, panes: { cols: 1, rows: 1 }, style: 'modern' },

  // Wall Cladding
  { id: 'c1', name: 'كلادينج حجري طبيعي', category: 'cladding', material: 'حجر طبيعي', width: 300, height: 300, price: 850, supplier: 'ستون وورلد', color: '#A1887F', frameColor: '#8D6E63', glassOpacity: 0, panes: { cols: 4, rows: 4 }, style: 'panel' },
  { id: 'c2', name: 'كلادينج خشبي', category: 'cladding', material: 'خشب معالج', width: 300, height: 300, price: 620, supplier: 'وود ماستر', color: '#8D6E63', frameColor: '#6D4C41', glassOpacity: 0, panes: { cols: 6, rows: 1 }, style: 'panel' },
  { id: 'c3', name: 'بلاط سيراميك جداري', category: 'cladding', material: 'سيراميك', width: 300, height: 300, price: 380, supplier: 'سيراميكا الخليج', color: '#EFEBE9', frameColor: '#D7CCC8', glassOpacity: 0, panes: { cols: 5, rows: 5 }, style: 'panel' },

  // Exterior Finishes
  { id: 'e1', name: 'واجهة GRC', category: 'exterior', material: 'خرسانة مقواة', width: 300, height: 300, price: 1200, supplier: 'فاساد تك', color: '#E0E0E0', frameColor: '#BDBDBD', glassOpacity: 0, panes: { cols: 3, rows: 2 }, style: 'modern' },
  { id: 'e2', name: 'واجهة زجاج كرتن وول', category: 'exterior', material: 'زجاج + ألمنيوم', width: 300, height: 300, price: 2400, supplier: 'سكاي فرونت', color: '#90CAF9', frameColor: '#42A5F5', glassOpacity: 0.7, panes: { cols: 3, rows: 3 }, style: 'modern' },
  { id: 'e3', name: 'تكسية حجر هاشمي', category: 'exterior', material: 'حجر هاشمي', width: 300, height: 300, price: 950, supplier: 'الحجر العربي', color: '#D7CCC8', frameColor: '#BCAAA4', glassOpacity: 0, panes: { cols: 3, rows: 3 }, style: 'classic' },
];

// ─── Wall Colors ───
const WALL_COLORS = {
  interior: [
    { name: 'أبيض ناصع', hex: '#FAFAFA' },
    { name: 'بيج رملي', hex: '#F5EEE1' },
    { name: 'رمادي فاتح', hex: '#E8E8E8' },
    { name: 'كريمي', hex: '#FFF8E7' },
    { name: 'لافندر', hex: '#E8DEF8' },
    { name: 'سماوي فاتح', hex: '#E3F2FD' },
    { name: 'وردي فاتح', hex: '#FCE4EC' },
    { name: 'أخضر نعناعي', hex: '#E8F5E9' },
    { name: 'خوخي', hex: '#FBE9E7' },
    { name: 'رمادي دافئ', hex: '#E0DBCF' },
  ],
  exterior: [
    { name: 'أبيض', hex: '#F5F5F5' },
    { name: 'بيج صحراوي', hex: '#E8D5B7' },
    { name: 'رملي ذهبي', hex: '#D4AF37' },
    { name: 'بني طيني', hex: '#A68B6B' },
    { name: 'رمادي حجري', hex: '#9E9E9E' },
    { name: 'بني داكن', hex: '#6D4C41' },
    { name: 'زيتوني', hex: '#8D8B63' },
    { name: 'أزرق بحري', hex: '#37474F' },
    { name: 'تراكوتا', hex: '#C75B39' },
    { name: 'أنثراسايت', hex: '#424242' },
  ],
};

// ─── Floor Textures ───
const FLOOR_OPTIONS: { type: FloorType; name: string; image: string; pattern: string }[] = [
  { type: 'tile', name: 'بلاط سيراميك', image: 'https://images.unsplash.com/photo-1580686679575-56530638446e?w=400&q=60', pattern: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 60px)' },
  { type: 'wood', name: 'باركيه خشبي', image: 'https://images.unsplash.com/photo-1548268364-3acee266b695?w=400&q=60', pattern: 'repeating-linear-gradient(90deg, rgba(139,90,43,0.08) 0px, transparent 2px, transparent 30px)' },
  { type: 'marble', name: 'رخام أبيض', image: 'https://images.unsplash.com/photo-1708919268837-2b4857323447?w=400&q=60', pattern: '' },
];

// ─── Category Config ───
const CATEGORIES: { key: ShowroomProduct['category']; name: string; icon: any; theme: string }[] = [
  { key: 'doors', name: 'أبواب', icon: DoorOpen, theme: 'brown' },
  { key: 'windows', name: 'شبابيك', icon: Frame, theme: 'blue' },
  { key: 'cladding', name: 'تكسيات جدارية', icon: Layers, theme: 'amber' },
  { key: 'exterior', name: 'واجهات خارجية', icon: Columns, theme: 'purple' },
];

// ═══════════════════════════════════════════════
// SVG Product Renderer
// ═══════════════════════════════════════════════
function ProductSVG({ product, width, height }: { product: ShowroomProduct; width: number; height: number }) {
  const { glassOpacity, panes, frameColor, color, style } = product;
  const fw = 6; // frame width
  const innerW = width - fw * 2;
  const innerH = height - fw * 2;
  const paneW = innerW / panes.cols;
  const paneH = innerH / panes.rows;

  const isGlass = glassOpacity > 0;
  const glassColor = `rgba(173,216,230,${glassOpacity})`;
  const panelColor = color;

  // Arch top for arch style
  const isArch = style === 'arch';
  const archR = isArch ? Math.min(innerW / 2, 40) : 0;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ display: 'block' }}>
      {/* Outer frame */}
      <rect x={0} y={isArch ? archR : 0} width={width} height={height - (isArch ? archR : 0)} rx={3} fill={frameColor} />
      {isArch && (
        <path d={`M 0 ${archR + fw} Q 0 0, ${width / 2} 0 Q ${width} 0, ${width} ${archR + fw} Z`} fill={frameColor} />
      )}

      {/* Inner area */}
      <rect x={fw} y={fw + (isArch ? archR * 0.3 : 0)} width={innerW} height={innerH - (isArch ? archR * 0.3 : 0)} fill={isGlass ? glassColor : panelColor} />

      {/* Panes grid */}
      {Array.from({ length: panes.cols }).map((_, ci) =>
        Array.from({ length: panes.rows }).map((_, ri) => (
          <g key={`${ci}-${ri}`}>
            {/* Pane border */}
            <rect
              x={fw + ci * paneW}
              y={fw + ri * paneH + (isArch ? archR * 0.3 : 0)}
              width={paneW}
              height={paneH - (isArch && ri === 0 ? archR * 0.3 : 0)}
              fill="none"
              stroke={frameColor}
              strokeWidth={2.5}
            />
            {/* Glass shine */}
            {isGlass && (
              <rect
                x={fw + ci * paneW + 3}
                y={fw + ri * paneH + 3 + (isArch ? archR * 0.3 : 0)}
                width={paneW * 0.3}
                height={paneH * 0.4}
                fill="rgba(255,255,255,0.25)"
                rx={2}
              />
            )}
            {/* Panel texture for non-glass */}
            {!isGlass && product.category === 'doors' && (
              <rect
                x={fw + ci * paneW + 6}
                y={fw + ri * paneH + 6}
                width={paneW - 12}
                height={paneH - 12}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={1.5}
                rx={2}
              />
            )}
          </g>
        ))
      )}

      {/* Door handle */}
      {product.category === 'doors' && (
        <g>
          <circle cx={width - fw - 14} cy={height * 0.52} r={5} fill="#B0BEC5" stroke="#78909C" strokeWidth={1} />
          <circle cx={width - fw - 14} cy={height * 0.52} r={2} fill="#E0E0E0" />
        </g>
      )}

      {/* Cladding texture */}
      {product.category === 'cladding' && (
        <>
          {Array.from({ length: panes.cols * panes.rows }).map((_, i) => {
            const col = i % panes.cols;
            const row = Math.floor(i / panes.cols);
            const offset = row % 2 === 0 ? 0 : paneW * 0.5;
            return (
              <rect
                key={i}
                x={fw + col * paneW + offset}
                y={fw + row * paneH}
                width={paneW - 2}
                height={paneH - 2}
                fill={color}
                stroke={frameColor}
                strokeWidth={1}
                rx={1}
                opacity={0.7 + Math.random() * 0.3}
              />
            );
          })}
        </>
      )}

      {/* Sliding door track */}
      {style === 'sliding' && (
        <>
          <line x1={width / 2} y1={fw} x2={width / 2} y2={height - fw} stroke={frameColor} strokeWidth={3} />
          <rect x={width / 2 - 8} y={height * 0.48} width={16} height={12} rx={2} fill="#B0BEC5" />
        </>
      )}
    </svg>
  );
}

// ═══════════════════════════════════════════════
// Measurement Label Component
// ═══════════════════════════════════════════════
function MeasurementLabel({ value, unit, horizontal, style: customStyle }: { value: number; unit: string; horizontal?: boolean; style?: React.CSSProperties }) {
  return (
    <div
      className="absolute flex items-center gap-1 pointer-events-none"
      style={{
        ...customStyle,
        whiteSpace: 'nowrap',
      }}
    >
      {horizontal ? (
        <div className="flex items-center gap-1">
          <div className="h-[1px] w-4 bg-[#D4AF37]" />
          <span className="text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-[#D4AF37]/20 text-[#5D4037]">
            {value} {unit}
          </span>
          <div className="h-[1px] w-4 bg-[#D4AF37]" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <div className="w-[1px] h-4 bg-[#D4AF37]" />
          <span className="text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-[#D4AF37]/20 text-[#5D4037] -rotate-90">
            {value} {unit}
          </span>
          <div className="w-[1px] h-4 bg-[#D4AF37]" />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════
interface ProductShowroomProps {
  onClose?: () => void;
  onAddToCart?: (product: ShowroomProduct) => void;
  onContactSupplier?: (product: ShowroomProduct) => void;
}

export function ProductShowroom({ onClose, onAddToCart, onContactSupplier }: ProductShowroomProps) {
  const { isDark, toggleTheme } = useTheme();

  // ─── State ───
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [wallColor, setWallColor] = useState('#FAFAFA');
  const [wallType, setWallType] = useState<'interior' | 'exterior'>('interior');
  const [floorType, setFloorType] = useState<FloorType>('wood');
  const [selectedCategory, setSelectedCategory] = useState<ShowroomProduct['category']>('doors');
  const [panelTab, setPanelTab] = useState<PanelTab>('products');
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ShowroomProduct | null>(null);
  const [placedProducts, setPlacedProducts] = useState<PlacedProduct[]>([]);
  const [zoom, setZoom] = useState(1);
  const [cameraRotY, setCameraRotY] = useState(0);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [dragInfo, setDragInfo] = useState<{ idx: number; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const wallRef = useRef<HTMLDivElement>(null);

  // Wall dimensions in cm
  const WALL_WIDTH = 400;
  const WALL_HEIGHT = 300;

  const cardClass = isDark
    ? 'bg-white/[0.13] backdrop-blur-xl border border-white/[0.18]'
    : 'bg-white border-[4px] border-gray-200/60';

  const floorOption = FLOOR_OPTIONS.find(f => f.type === floorType) || FLOOR_OPTIONS[0];
  const filteredProducts = PRODUCTS.filter(p => p.category === selectedCategory);

  // ─── Place product on wall ───
  const placeProduct = useCallback((product: ShowroomProduct) => {
    setPlacedProducts(prev => [
      ...prev,
      { productId: product.id, x: 0.5, y: 0.5, scale: 1 }
    ]);
    toast.success(`تم وضع "${product.name}" على الحائط`);
  }, []);

  const removePlaced = useCallback((idx: number) => {
    setPlacedProducts(prev => prev.filter((_, i) => i !== idx));
  }, []);

  // ─── Drag placed products ───
  const handlePointerDown = useCallback((idx: number, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const placed = placedProducts[idx];
    setDragInfo({ idx, startX: e.clientX, startY: e.clientY, origX: placed.x, origY: placed.y });
  }, [placedProducts]);

  useEffect(() => {
    if (!dragInfo) return;

    const handleMove = (e: PointerEvent) => {
      if (!wallRef.current) return;
      const rect = wallRef.current.getBoundingClientRect();
      const dx = (e.clientX - dragInfo.startX) / rect.width;
      const dy = (e.clientY - dragInfo.startY) / rect.height;
      setPlacedProducts(prev => prev.map((p, i) =>
        i === dragInfo.idx
          ? { ...p, x: Math.max(0.05, Math.min(0.95, dragInfo.origX + dx)), y: Math.max(0.05, Math.min(0.95, dragInfo.origY + dy)) }
          : p
      ));
    };

    const handleUp = () => setDragInfo(null);

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [dragInfo]);

  // ─── Scale placed product ───
  const scalePlaced = useCallback((idx: number, delta: number) => {
    setPlacedProducts(prev => prev.map((p, i) =>
      i === idx ? { ...p, scale: Math.max(0.4, Math.min(2, p.scale + delta)) } : p
    ));
  }, []);

  // ─── 3D Camera rotation ───
  const handleViewerDrag = useCallback((e: React.PointerEvent) => {
    if (viewMode !== '3d') return;
    const startX = e.clientX;
    const startRot = cameraRotY;

    const onMove = (me: PointerEvent) => {
      const dx = me.clientX - startX;
      setCameraRotY(Math.max(-25, Math.min(25, startRot + dx * 0.15)));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [viewMode, cameraRotY]);

  // ─── Render ───
  return (
    <div className="fixed inset-0 z-50 flex flex-col font-[Cairo]" dir="rtl"
         style={{ background: isDark ? '#1a1a3e' : '#E8E0D0' }}>

      {/* ─── Top Bar ─── */}
      <header className={`h-14 px-4 flex items-center justify-between shrink-0
        ${isDark ? 'bg-[#2A44CC]/90 backdrop-blur-xl border-b border-white/[0.12]' : 'bg-white/90 backdrop-blur-xl border-b-[4px] border-gray-200/60'}`}>
        <div className="flex items-center gap-3">
          {onClose && (
            <button onClick={onClose}
              className="p-2 rounded-xl hover:bg-[var(--bait-surface-hover)] transition-all">
              <X size={20} style={{ color: 'var(--bait-text)' }} />
            </button>
          )}
          <Icon3D icon={Box} theme="gold" size="sm" hoverable={false} />
          <h1 className="text-sm font-bold" style={{ color: 'var(--bait-text)' }}>
            معرض المنتجات
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className={`flex rounded-xl overflow-hidden ${isDark ? 'bg-white/[0.10]' : 'bg-[#F5EEE1]'} border-[3px] ${isDark ? 'border-white/[0.15]' : 'border-gray-200/60'}`}>
            <button
              onClick={() => setViewMode('2d')}
              className={`px-3 py-1.5 text-xs font-bold transition-all
                ${viewMode === '2d'
                  ? 'bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-[#5D4037]'
                  : ''}`}
              style={{ color: viewMode === '2d' ? undefined : 'var(--bait-text-secondary)' }}
            >
              2D
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1.5 text-xs font-bold transition-all
                ${viewMode === '3d'
                  ? 'bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-[#5D4037]'
                  : ''}`}
              style={{ color: viewMode === '3d' ? undefined : 'var(--bait-text-secondary)' }}
            >
              3D
            </button>
          </div>

          {/* Measurements toggle */}
          <button onClick={() => setShowMeasurements(!showMeasurements)}
            className={`p-2 rounded-xl transition-all ${showMeasurements
              ? 'bg-[#D4AF37]/20 border-[2px] border-[#D4AF37]/40'
              : isDark ? 'bg-white/[0.08]' : 'bg-[#F5EEE1]'}`}>
            <Ruler size={16} color={showMeasurements ? '#D4AF37' : undefined} style={{ color: showMeasurements ? undefined : 'var(--bait-text-muted)' }} />
          </button>

          {/* Zoom controls */}
          <button onClick={() => setZoom(z => Math.min(2, z + 0.15))}
            className={`p-2 rounded-xl ${isDark ? 'bg-white/[0.08]' : 'bg-[#F5EEE1]'}`}>
            <ZoomIn size={16} style={{ color: 'var(--bait-text-muted)' }} />
          </button>
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.15))}
            className={`p-2 rounded-xl ${isDark ? 'bg-white/[0.08]' : 'bg-[#F5EEE1]'}`}>
            <ZoomOut size={16} style={{ color: 'var(--bait-text-muted)' }} />
          </button>

          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className={`p-2 rounded-xl ${isDark ? 'bg-white/[0.08]' : 'bg-[#F5EEE1]'}`}>
            {isDark ? <Sun size={16} color="#FFD700" /> : <Moon size={16} style={{ color: 'var(--bait-text-muted)' }} />}
          </button>
        </div>
      </header>

      {/* ─── Main Area: Viewer + Panel ─── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* ═══ 3D/2D Viewer ═══ */}
        <div className="flex-1 relative overflow-hidden"
             onPointerDown={handleViewerDrag}
             style={{ cursor: viewMode === '3d' ? 'grab' : 'default', touchAction: 'none' }}>

          {/* Perspective Container */}
          <div className="absolute inset-0 flex items-center justify-center"
               style={{
                 perspective: viewMode === '3d' ? '900px' : 'none',
                 perspectiveOrigin: '50% 45%',
                 transform: `scale(${zoom})`,
                 transition: 'transform 0.3s ease',
               }}>

            <div style={{
              transform: viewMode === '3d'
                ? `rotateX(8deg) rotateY(${cameraRotY}deg)`
                : 'none',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.4s ease',
              position: 'relative',
            }}>

              {/* ─── Floor ─── */}
              <div
                className="absolute overflow-hidden"
                style={{
                  width: viewMode === '3d' ? 480 : 360,
                  height: viewMode === '3d' ? 200 : 80,
                  bottom: viewMode === '3d' ? -160 : -60,
                  left: '50%',
                  transform: viewMode === '3d'
                    ? `translateX(-50%) rotateX(75deg) translateZ(-10px)`
                    : 'translateX(-50%)',
                  transformOrigin: 'top center',
                  borderRadius: viewMode === '3d' ? '0 0 12px 12px' : '0 0 8px 8px',
                  backgroundImage: `url(${floorOption.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: isDark ? 'inset 0 0 40px rgba(0,0,0,0.3)' : 'inset 0 0 30px rgba(0,0,0,0.08)',
                }}
              >
                {/* Floor grid overlay */}
                <div className="absolute inset-0" style={{ backgroundImage: floorOption.pattern }} />
              </div>

              {/* ─── Wall ─── */}
              <div
                ref={wallRef}
                className="relative"
                style={{
                  width: viewMode === '3d' ? 440 : 360,
                  height: viewMode === '3d' ? 300 : 260,
                  backgroundColor: wallColor,
                  borderRadius: '12px 12px 0 0',
                  boxShadow: isDark
                    ? '0 20px 60px rgba(0,0,0,0.5), inset 0 0 80px rgba(0,0,0,0.05)'
                    : '0 20px 60px rgba(0,0,0,0.12), inset 0 0 60px rgba(0,0,0,0.02)',
                  border: isDark ? '2px solid rgba(255,255,255,0.12)' : '3px solid rgba(0,0,0,0.08)',
                  transition: 'background-color 0.5s ease, width 0.3s ease, height 0.3s ease',
                }}
              >
                {/* Wall texture overlay */}
                <div className="absolute inset-0 rounded-t-[12px]" style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.01) 40px, rgba(0,0,0,0.01) 41px)',
                  pointerEvents: 'none',
                }} />

                {/* Ceiling line */}
                <div className="absolute top-0 left-0 right-0 h-8" style={{
                  background: isDark
                    ? 'linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)'
                    : 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
                  borderRadius: '12px 12px 0 0',
                  pointerEvents: 'none',
                }} />

                {/* Baseboard */}
                <div className="absolute bottom-0 left-0 right-0 h-3" style={{
                  background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  pointerEvents: 'none',
                }} />

                {/* ─── Placed Products ─── */}
                {placedProducts.map((placed, idx) => {
                  const product = PRODUCTS.find(p => p.id === placed.productId);
                  if (!product) return null;

                  const wallW = wallRef.current?.offsetWidth || 400;
                  const wallH = wallRef.current?.offsetHeight || 300;
                  const pW = (product.width / WALL_WIDTH) * wallW * placed.scale;
                  const pH = (product.height / WALL_HEIGHT) * wallH * placed.scale;

                  return (
                    <div
                      key={idx}
                      className="absolute cursor-move group"
                      style={{
                        left: `${placed.x * 100}%`,
                        top: `${placed.y * 100}%`,
                        width: pW,
                        height: pH,
                        transform: 'translate(-50%, -50%)',
                        zIndex: dragInfo?.idx === idx ? 20 : 10,
                        filter: viewMode === '3d' ? 'drop-shadow(4px 8px 12px rgba(0,0,0,0.25))' : 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))',
                        transition: dragInfo?.idx === idx ? 'none' : 'all 0.15s ease',
                      }}
                      onPointerDown={(e) => handlePointerDown(idx, e)}
                    >
                      <ProductSVG product={product} width={product.width} height={product.height} />

                      {/* Product controls overlay */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); scalePlaced(idx, 0.1); }}
                          className="w-6 h-6 rounded-full bg-[#D4AF37] text-white flex items-center justify-center text-xs shadow-lg">
                          +
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); scalePlaced(idx, -0.1); }}
                          className="w-6 h-6 rounded-full bg-[#D4AF37] text-white flex items-center justify-center text-xs shadow-lg">
                          -
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); removePlaced(idx); }}
                          className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                          <Trash2 size={10} />
                        </button>
                      </div>

                      {/* Size label */}
                      {showMeasurements && (
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#5D4037] whitespace-nowrap">
                          {Math.round(product.width * placed.scale)} x {Math.round(product.height * placed.scale)} سم
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* ─── Wall Measurements ─── */}
                {showMeasurements && (
                  <>
                    {/* Width */}
                    <div className="absolute -bottom-7 left-0 right-0 flex items-center justify-center pointer-events-none">
                      <div className="flex items-center gap-1">
                        <div className="h-[1px] flex-1 bg-[#D4AF37]/50" style={{ minWidth: 20 }} />
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#5D4037]">
                          {WALL_WIDTH} سم
                        </span>
                        <div className="h-[1px] flex-1 bg-[#D4AF37]/50" style={{ minWidth: 20 }} />
                      </div>
                    </div>
                    {/* Height */}
                    <div className="absolute top-0 bottom-0 -left-9 flex flex-col items-center justify-center pointer-events-none">
                      <div className="w-[1px] flex-1 bg-[#D4AF37]/50" style={{ minHeight: 10 }} />
                      <span className="text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-[#D4AF37]/20 text-[#5D4037] -rotate-90 whitespace-nowrap">
                        {WALL_HEIGHT} سم
                      </span>
                      <div className="w-[1px] flex-1 bg-[#D4AF37]/50" style={{ minHeight: 10 }} />
                    </div>
                  </>
                )}
              </div>

              {/* ─── 3D Shadow ─── */}
              {viewMode === '3d' && (
                <div className="absolute" style={{
                  width: 440,
                  height: 30,
                  bottom: -170,
                  left: '50%',
                  transform: 'translateX(-50%) rotateX(75deg)',
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 70%)',
                  filter: 'blur(10px)',
                  pointerEvents: 'none',
                }} />
              )}
            </div>
          </div>

          {/* ─── Hint Overlay ─── */}
          {placedProducts.length === 0 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
              <p className="text-xs px-4 py-2 rounded-xl"
                 style={{
                   background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                   color: 'var(--bait-text-muted)',
                   backdropFilter: 'blur(8px)',
                 }}>
                اختر منتج من المكتبة ثم اضغط "ضع على الحائط"
              </p>
            </div>
          )}
        </div>

        {/* ═══ Side Panel (Product Library) ═══ */}
        <aside className={`w-full lg:w-96 flex flex-col overflow-hidden
          ${isDark
            ? 'bg-[#1E3A8A]/80 backdrop-blur-xl border-t lg:border-t-0 lg:border-r border-white/[0.12]'
            : 'bg-white/95 backdrop-blur-xl border-t-[4px] lg:border-t-0 lg:border-r-[4px] border-gray-200/60'
          }`}
          style={{ maxHeight: panelExpanded ? '50vh' : '56px', transition: 'max-height 0.3s ease' }}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0 cursor-pointer lg:cursor-default"
               onClick={() => setPanelExpanded(!panelExpanded)}>
            <div className="flex items-center gap-2">
              <Icon3D icon={Layers} theme="gold" size="xs" hoverable={false} />
              <span className="text-sm font-bold" style={{ color: 'var(--bait-text)' }}>
                مكتبة المنتجات
              </span>
            </div>
            <button className="lg:hidden p-1">
              {panelExpanded ? <ChevronDown size={18} style={{ color: 'var(--bait-text-muted)' }} /> : <ChevronUp size={18} style={{ color: 'var(--bait-text-muted)' }} />}
            </button>
          </div>

          {/* Panel Tabs */}
          <div className="flex px-3 gap-1 shrink-0"
               style={{ borderBottom: `1px solid var(--bait-border)` }}>
            {([
              { key: 'products' as PanelTab, label: 'المنتجات', icon: Box },
              { key: 'colors' as PanelTab, label: 'ألوان الحائط', icon: Palette },
              { key: 'floor' as PanelTab, label: 'الأرضية', icon: Grid3x3 },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setPanelTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-lg transition-all
                  ${panelTab === tab.key
                    ? isDark
                      ? 'bg-white/[0.12] text-white border-b-2 border-[#FFD700]'
                      : 'bg-[#D4AF37]/10 text-[#5D4037] border-b-2 border-[#D4AF37]'
                    : ''}`}
                style={{ color: panelTab === tab.key ? undefined : 'var(--bait-text-muted)' }}
              >
                <tab.icon size={12} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">

            {/* ─── Products Tab ─── */}
            {panelTab === 'products' && (
              <>
                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border-[2px]
                        ${selectedCategory === cat.key
                          ? 'bg-gradient-to-l from-[#D4AF37]/15 to-[#FFD700]/15 border-[#D4AF37]/40 text-[#5D4037]'
                          : isDark ? 'border-white/[0.10] hover:border-white/[0.20]' : 'border-gray-200/60 hover:border-gray-300'}`}
                      style={{ color: selectedCategory === cat.key ? undefined : 'var(--bait-text-secondary)' }}
                    >
                      <Icon3D icon={cat.icon} theme={selectedCategory === cat.key ? 'gold' : cat.theme} size="xs" hoverable={false} />
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`${cardClass} rounded-xl p-2 cursor-pointer transition-all hover:scale-[1.02]
                        ${selectedProduct?.id === product.id ? 'ring-2 ring-[#D4AF37]' : ''}`}
                    >
                      {/* Product SVG Preview */}
                      <div className={`aspect-square rounded-lg overflow-hidden flex items-center justify-center p-2
                        ${isDark ? 'bg-white/[0.06]' : 'bg-[#F5EEE1]/50'}`}>
                        <div style={{ width: '80%', height: '80%' }}>
                          <ProductSVG product={product} width={product.width} height={product.height} />
                        </div>
                      </div>

                      <div className="mt-2 space-y-0.5">
                        <p className="text-[11px] font-bold truncate" style={{ color: 'var(--bait-text)' }}>
                          {product.name}
                        </p>
                        <p className="text-[10px]" style={{ color: 'var(--bait-text-muted)' }}>
                          {product.material}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px]" style={{ color: 'var(--bait-text-muted)' }}>
                            {product.width}x{product.height} سم
                          </span>
                          <span className="text-[11px] font-bold" style={{ color: isDark ? '#FFD700' : '#D4AF37' }}>
                            {product.price.toLocaleString()} د.إ
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ─── Colors Tab ─── */}
            {panelTab === 'colors' && (
              <>
                {/* Interior / Exterior toggle */}
                <div className={`flex rounded-xl overflow-hidden ${isDark ? 'bg-white/[0.08]' : 'bg-[#F5EEE1]'} border-[3px] ${isDark ? 'border-white/[0.12]' : 'border-gray-200/60'}`}>
                  <button
                    onClick={() => setWallType('interior')}
                    className={`flex-1 py-2 text-xs font-bold transition-all
                      ${wallType === 'interior' ? 'bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-[#5D4037]' : ''}`}
                    style={{ color: wallType === 'interior' ? undefined : 'var(--bait-text-secondary)' }}
                  >
                    داخلي
                  </button>
                  <button
                    onClick={() => setWallType('exterior')}
                    className={`flex-1 py-2 text-xs font-bold transition-all
                      ${wallType === 'exterior' ? 'bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-[#5D4037]' : ''}`}
                    style={{ color: wallType === 'exterior' ? undefined : 'var(--bait-text-secondary)' }}
                  >
                    خارجي
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {WALL_COLORS[wallType].map(c => (
                    <button
                      key={c.hex}
                      onClick={() => setWallColor(c.hex)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all
                        ${wallColor === c.hex ? 'ring-2 ring-[#D4AF37] scale-105' : 'hover:scale-105'}`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg border-[3px]"
                        style={{
                          backgroundColor: c.hex,
                          borderColor: wallColor === c.hex ? '#D4AF37' : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                          boxShadow: wallColor === c.hex ? '0 0 12px rgba(212,175,55,0.4)' : 'none',
                        }}
                      />
                      <span className="text-[9px] text-center leading-tight" style={{ color: 'var(--bait-text-muted)' }}>
                        {c.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom hex */}
                <div className="flex items-center gap-2">
                  <label className="text-xs" style={{ color: 'var(--bait-text-secondary)' }}>لون مخصص:</label>
                  <input
                    type="color"
                    value={wallColor}
                    onChange={(e) => setWallColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-2"
                    style={{ borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}
                  />
                  <span className="text-xs font-mono" style={{ color: 'var(--bait-text-muted)' }}>
                    {wallColor}
                  </span>
                </div>
              </>
            )}

            {/* ─── Floor Tab ─── */}
            {panelTab === 'floor' && (
              <div className="space-y-3">
                {FLOOR_OPTIONS.map(f => (
                  <button
                    key={f.type}
                    onClick={() => setFloorType(f.type)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all
                      ${cardClass}
                      ${floorType === f.type ? 'ring-2 ring-[#D4AF37]' : ''}`}
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border-[2px]"
                         style={{ borderColor: floorType === f.type ? '#D4AF37' : 'transparent' }}>
                      <ImageWithFallback src={f.image} alt={f.name}
                        className="w-full h-full object-cover" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: 'var(--bait-text)' }}>
                        {f.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--bait-text-muted)' }}>
                        اضغط للتطبيق على الأرضية
                      </p>
                    </div>
                    {floorType === f.type && (
                      <div className="mr-auto w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Selected Product Details + Actions ─── */}
          {selectedProduct && panelTab === 'products' && (
            <div className="shrink-0 px-3 pb-3 pt-2 space-y-2"
                 style={{ borderTop: `1px solid var(--bait-border)` }}>
              <div className="flex items-start gap-3">
                <div className={`w-14 h-14 rounded-lg overflow-hidden flex items-center justify-center p-1
                  ${isDark ? 'bg-white/[0.08]' : 'bg-[#F5EEE1]'}`}>
                  <ProductSVG product={selectedProduct} width={selectedProduct.width} height={selectedProduct.height} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--bait-text)' }}>
                    {selectedProduct.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--bait-text-muted)' }}>
                    {selectedProduct.material} / {selectedProduct.supplier}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs" style={{ color: 'var(--bait-text-muted)' }}>
                      {selectedProduct.width} x {selectedProduct.height} سم
                    </span>
                    <span className="text-sm font-bold" style={{ color: isDark ? '#FFD700' : '#D4AF37' }}>
                      {selectedProduct.price.toLocaleString()} د.إ
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => placeProduct(selectedProduct)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold
                    bg-gradient-to-l from-[#D4AF37] to-[#FFD700] text-[#5D4037]
                    border-[4px] border-[#D4AF37]/30
                    hover:scale-[1.02] active:scale-95 transition-transform"
                >
                  <Move size={14} />
                  ضع على الحائط
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (onAddToCart) onAddToCart(selectedProduct);
                    toast.success(`تم إضافة "${selectedProduct.name}" إلى السلة`);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold
                    ${isDark
                      ? 'bg-white/[0.12] border border-white/[0.18] text-white'
                      : 'bg-[#F5EEE1] border-[3px] border-gray-200/60 text-[#5D4037]'
                    } hover:scale-[1.02] active:scale-95 transition-transform`}
                >
                  <ShoppingCart size={13} />
                  أضف للسلة
                </button>
                <button
                  onClick={() => {
                    if (onContactSupplier) onContactSupplier(selectedProduct);
                    const phone = '971501234567';
                    const msg = encodeURIComponent(`مرحبا، أرغب بالاستفسار عن: ${selectedProduct.name} (${selectedProduct.price} د.إ) - بيت الريف`);
                    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold
                    ${isDark
                      ? 'bg-white/[0.12] border border-white/[0.18] text-white'
                      : 'bg-[#F5EEE1] border-[3px] border-gray-200/60 text-[#5D4037]'
                    } hover:scale-[1.02] active:scale-95 transition-transform`}
                >
                  <Phone size={13} />
                  تواصل مع المزود
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
