import { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Paintbrush, DoorOpen, Ruler, Droplets, Award,
  Layers, Sun, CircleDot, Sparkles, ShieldCheck,
  Check, Copy, Share2,
  RotateCcw, Zap, Star, RectangleHorizontal,
  Trash2, Plus, SplitSquareHorizontal,
  Square, ArrowRight,
} from 'lucide-react';
// Crown not available — using Award as alias
const Crown = Award;
import {
  SimpleToolShell, InputCard, SliderInput,
  ActionButton, Divider, formatAED,
} from './SimpleToolShell';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Icon3D } from '../../ui/Icon3D';

const FC = 'Cairo, sans-serif';

// ═══════════════════════════════════════
// Data Types
// ═══════════════════════════════════════

interface WallElement {
  id: string;
  type: 'door' | 'window' | 'opening';
  position: number;   // meters from left edge
  width: number;
  height: number;
  fromFloor: number;  // meters from floor
}

interface Wall {
  id: 'north' | 'south' | 'east' | 'west';
  labelAr: string;
  labelEn: string;
  length: number;
  elements: WallElement[];
}

type ViewMode = 'plan' | 'wall';
type ActiveStep = 'room' | 'paint' | 'results';

// ═══════════════════════════════════════
// Constants
// ═══════════════════════════════════════

const WALL_THICKNESS = 0.20; // meters

const PAINT_COLORS = [
  { name: 'أبيض كلاسيكي', nameEn: 'Classic White', hex: '#FAFAFA' },
  { name: 'أبيض عاجي', nameEn: 'Ivory White', hex: '#FFFFF0' },
  { name: 'بيج رملي', nameEn: 'Sand Beige', hex: '#E8D5B7' },
  { name: 'رمادي فاتح', nameEn: 'Light Grey', hex: '#D3D3D3' },
  { name: 'رمادي دافئ', nameEn: 'Warm Grey', hex: '#B8AFA7' },
  { name: 'كريمي', nameEn: 'Creamy', hex: '#FFFDD0' },
  { name: 'أزرق سماوي', nameEn: 'Sky Blue', hex: '#B3D9F2' },
  { name: 'خوخي', nameEn: 'Peach', hex: '#FFDAB9' },
  { name: 'وردي فاتح', nameEn: 'Blush Pink', hex: '#F4C2C2' },
  { name: 'ترابي', nameEn: 'Earthy', hex: '#C4A882' },
  { name: 'رمادي داكن', nameEn: 'Charcoal', hex: '#707070' },
  { name: 'كحلي', nameEn: 'Navy', hex: '#2C3E6B' },
  { name: 'تركواز', nameEn: 'Turquoise', hex: '#7EC8C8' },
  { name: 'لافندر', nameEn: 'Lavender', hex: '#C8A2C8' },
  { name: 'أخضر مريمية', nameEn: 'Sage', hex: '#B2C9AB' },
  { name: 'ذهبي رملي', nameEn: 'Sandy Gold', hex: '#D4B896' },
];

interface PaintFinish { id: string; ar: string; en: string; icon: any; theme: string; coverageFactor: number; priceFactor: number; }
const FINISHES: PaintFinish[] = [
  { id: 'matte', ar: 'مطفي', en: 'Matte', icon: CircleDot, theme: 'blue', coverageFactor: 1.0, priceFactor: 1.0 },
  { id: 'satin', ar: 'ساتان', en: 'Satin', icon: Sun, theme: 'amber', coverageFactor: 0.95, priceFactor: 1.15 },
  { id: 'semi-gloss', ar: 'نصف لامع', en: 'Semi-Gloss', icon: Sparkles, theme: 'teal', coverageFactor: 0.90, priceFactor: 1.25 },
  { id: 'gloss', ar: 'لامع', en: 'Gloss', icon: Star, theme: 'gold', coverageFactor: 0.85, priceFactor: 1.40 },
];

interface PaintQuality { id: string; ar: string; en: string; icon: any; theme: string; pricePerLiter: number; coveragePerLiter: number; }
const QUALITIES: PaintQuality[] = [
  { id: 'economy', ar: 'اقتصادي', en: 'Economy', icon: Droplets, theme: 'blue', pricePerLiter: 18, coveragePerLiter: 9 },
  { id: 'standard', ar: 'قياسي', en: 'Standard', icon: ShieldCheck, theme: 'teal', pricePerLiter: 32, coveragePerLiter: 11 },
  { id: 'premium', ar: 'ممتاز', en: 'Premium', icon: Sparkles, theme: 'purple', pricePerLiter: 52, coveragePerLiter: 13 },
  { id: 'luxury', ar: 'فاخر', en: 'Luxury', icon: Crown, theme: 'gold', pricePerLiter: 85, coveragePerLiter: 14 },
];

interface PaintBrand { id: string; name: string; nameEn: string; origin: string; originEn: string; mult: number; color: string; }
const BRANDS: PaintBrand[] = [
  { id: 'jotun', name: 'جوتن', nameEn: 'Jotun', origin: 'النرويج', originEn: 'Norway', mult: 1.20, color: '#0072CE' },
  { id: 'national', name: 'ناشيونال', nameEn: 'National Paints', origin: 'الإمارات', originEn: 'UAE', mult: 1.00, color: '#E8363A' },
  { id: 'hempel', name: 'هامبل', nameEn: 'Hempel', origin: 'الدنمارك', originEn: 'Denmark', mult: 1.15, color: '#004B87' },
  { id: 'caparol', name: 'كابارول', nameEn: 'Caparol', origin: 'ألمانيا', originEn: 'Germany', mult: 1.35, color: '#F5A623' },
  { id: 'rak', name: 'راك', nameEn: 'RAK Paints', origin: 'الإمارات', originEn: 'UAE', mult: 0.85, color: '#8D6E63' },
];

let _elId = 0;
const genId = () => `el_${++_elId}_${Date.now()}`;

// ═══════════════════════════════════════
// Main Component
// ═══════════════════════════════════════

export function PaintFlooringCalc({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  // Room
  const [roomLength, setRoomLength] = useState(3.93);
  const [roomWidth, setRoomWidth] = useState(7.36);
  const [roomHeight, setRoomHeight] = useState(2.97);

  // Walls
  const [walls, setWalls] = useState<Wall[]>(() => [
    { id: 'north', labelAr: 'الجدار الشمالي', labelEn: 'North Wall', length: 3.93, elements: [] },
    { id: 'south', labelAr: 'الجدار الجنوبي', labelEn: 'South Wall', length: 3.93, elements: [] },
    { id: 'east', labelAr: 'الجدار الشرقي', labelEn: 'East Wall', length: 7.36, elements: [] },
    { id: 'west', labelAr: 'الجدار الغربي', labelEn: 'West Wall', length: 7.36, elements: [] },
  ]);

  const [selectedWall, setSelectedWall] = useState<Wall['id']>('north');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('plan');
  const [activeStep, setActiveStep] = useState<ActiveStep>('room');
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Paint
  const [paintColor, setPaintColor] = useState(0);
  const [finish, setFinish] = useState('matte');
  const [quality, setQuality] = useState('standard');
  const [brand, setBrand] = useState('jotun');
  const [coats, setCoats] = useState(2);
  const [includeCeiling, setIncludeCeiling] = useState(true);
  const [includePrimer, setIncludePrimer] = useState(true);

  // Results
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Sync wall lengths when room dimensions change
  const updateRoomDimensions = useCallback((l: number, w: number) => {
    setRoomLength(l);
    setRoomWidth(w);
    setWalls(prev => prev.map(wall => {
      if (wall.id === 'north' || wall.id === 'south') return { ...wall, length: l };
      return { ...wall, length: w };
    }));
  }, []);

  // Current wall
  const currentWall = walls.find(w => w.id === selectedWall)!;

  // Add element to wall
  const addElement = (type: 'door' | 'window' | 'opening') => {
    const defaults = {
      door: { width: 0.90, height: 2.13, fromFloor: 0 },
      window: { width: 1.20, height: 1.20, fromFloor: 0.90 },
      opening: { width: 1.00, height: 2.50, fromFloor: 0 },
    };
    const d = defaults[type];
    const el: WallElement = {
      id: genId(),
      type,
      position: currentWall.length / 2 - d.width / 2,
      ...d,
    };
    setWalls(prev => prev.map(w =>
      w.id === selectedWall ? { ...w, elements: [...w.elements, el] } : w
    ));
    setSelectedElement(el.id);
    setShowAddMenu(false);
  };

  // Remove element
  const removeElement = (elId: string) => {
    setWalls(prev => prev.map(w =>
      w.id === selectedWall
        ? { ...w, elements: w.elements.filter(e => e.id !== elId) }
        : w
    ));
    setSelectedElement(null);
  };

  // Move element
  const moveElement = (elId: string, newPos: number) => {
    setWalls(prev => prev.map(w =>
      w.id === selectedWall
        ? {
          ...w,
          elements: w.elements.map(e =>
            e.id === elId
              ? { ...e, position: Math.max(0, Math.min(newPos, w.length - e.width)) }
              : e
          ),
        }
        : w
    ));
  };

  // Calculate
  const handleCalculate = () => {
    setLoading(true);
    setTimeout(() => {
      const finishData = FINISHES.find(f => f.id === finish)!;
      const qualityData = QUALITIES.find(q => q.id === quality)!;
      const brandData = BRANDS.find(b => b.id === brand)!;

      const wallResults = walls.map(wall => {
        const totalWallArea = wall.length * roomHeight;
        const elemArea = wall.elements.reduce((sum, el) => sum + el.width * el.height, 0);
        const netArea = Math.max(0, totalWallArea - elemArea);
        return { wallId: wall.id, totalArea: totalWallArea, elemArea, netArea };
      });

      const totalNetWall = wallResults.reduce((s, w) => s + w.netArea, 0);
      const ceilingArea = roomLength * roomWidth;
      const totalPaintArea = totalNetWall + (includeCeiling ? ceilingArea : 0);

      const coverage = qualityData.coveragePerLiter * finishData.coverageFactor;
      const paintLiters = Math.ceil((totalPaintArea * coats) / coverage);
      const primerLiters = includePrimer ? Math.ceil(totalPaintArea / 14) : 0;

      const pricePerL = qualityData.pricePerLiter * finishData.priceFactor * brandData.mult;
      const paintCost = Math.round(paintLiters * pricePerL);
      const primerCost = includePrimer ? Math.round(primerLiters * 22) : 0;
      const laborCost = Math.round(totalPaintArea * (coats === 3 ? 12 : 8));
      const suppliesCost = Math.round(totalPaintArea * 1.5);

      const brandComp = BRANDS.map(b => ({
        brand: b,
        cost: Math.round(paintLiters * qualityData.pricePerLiter * finishData.priceFactor * b.mult),
      })).sort((a, b) => a.cost - b.cost);

      setResult({
        wallResults,
        totalNetWall: Number(totalNetWall.toFixed(1)),
        ceilingArea: Number(ceilingArea.toFixed(1)),
        totalPaintArea: Number(totalPaintArea.toFixed(1)),
        paintLiters,
        buckets4L: Math.ceil(paintLiters / 4),
        buckets18L: Math.ceil(paintLiters / 18),
        primerLiters,
        primerBuckets: Math.ceil(primerLiters / 18),
        costs: { paint: paintCost, primer: primerCost, labor: laborCost, supplies: suppliesCost, total: paintCost + primerCost + laborCost + suppliesCost },
        brandComp,
        coverage: Number(coverage.toFixed(1)),
      });
      setActiveStep('results');
      setLoading(false);
      setTimeout(() => document.getElementById('paint-results')?.scrollIntoView({ behavior: 'smooth' }), 200);
    }, 500);
  };

  const totalElements = walls.reduce((s, w) => s + w.elements.length, 0);

  return (
    <SimpleToolShell
      title="حاسبة الدهانات التفاعلية"
      titleEn="Interactive Paint Calculator"
      subtitle="ارسم غرفتك وأضف الأبواب والنوافذ بصرياً"
      subtitleEn="Draw your room & add doors/windows visually"
      toolId="paint"
      gradientFrom="#7B2D8E"
      gradientTo="#C040A0"
      onBack={onBack}
    >

      {/* ══════════ Step Tabs ══════════ */}
      <div className="flex gap-2 mb-4">
        {([
          { id: 'room' as ActiveStep, ar: 'تصميم الغرفة', en: 'Room Design', icon: Ruler },
          { id: 'paint' as ActiveStep, ar: 'إعدادات الدهان', en: 'Paint Settings', icon: Paintbrush },
          { id: 'results' as ActiveStep, ar: 'النتائج', en: 'Results', icon: Zap },
        ] as const).map(step => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className={`flex-1 py-2.5 px-2 rounded-xl border-[4px] transition-all flex flex-col items-center gap-1 ${
              activeStep === step.id
                ? 'border-[#C040A0] bg-[#C040A0]/10 shadow-sm'
                : 'border-gray-200/60 bg-white'
            }`}
          >
            <step.icon className={`w-4 h-4 ${activeStep === step.id ? 'text-[#C040A0]' : 'text-gray-400'}`} />
            <span className={`text-[10px] font-bold ${activeStep === step.id ? 'text-[#C040A0]' : 'text-gray-500'}`} style={{ fontFamily: FC }}>
              {isEn ? step.en : step.ar}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ═════════════════════════════════ */}
        {/* STEP 1: ROOM DESIGN              */}
        {/* ═════════════════════════════════ */}
        {activeStep === 'room' && (
          <motion.div key="room" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>

            {/* Room Dimensions */}
            <InputCard>
              <div className="flex items-center gap-2 mb-3">
                <Icon3D icon={Ruler} theme="indigo" size="sm" hoverable={false} />
                <h3 className="font-bold text-base text-[#1A1A1A]" style={{ fontFamily: FC }}>
                  {isEn ? 'Room Dimensions' : 'أبعاد الغرفة'}
                </h3>
              </div>
              <SliderInput label={isEn ? 'Length' : 'الطول'} value={roomLength} onChange={v => updateRoomDimensions(v, roomWidth)} min={2} max={15} step={0.01} suffix={isEn ? 'm' : 'م'} />
              <SliderInput label={isEn ? 'Width' : 'العرض'} value={roomWidth} onChange={v => updateRoomDimensions(roomLength, v)} min={2} max={15} step={0.01} suffix={isEn ? 'm' : 'م'} />
              <SliderInput label={isEn ? 'Height' : 'الارتفاع'} value={roomHeight} onChange={setRoomHeight} min={2.4} max={5} step={0.01} suffix={isEn ? 'm' : 'م'} />
            </InputCard>

            {/* ── View Mode Toggle ── */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setViewMode('plan')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-[4px] transition-all ${
                  viewMode === 'plan' ? 'border-[#C040A0] bg-[#C040A0]/10' : 'border-gray-200/60 bg-white'
                }`}
              >
                <Icon3D icon={Square} theme={viewMode === 'plan' ? 'purple' : 'brown'} size="xs" hoverable={false} />
                <span className={`text-xs font-bold ${viewMode === 'plan' ? 'text-[#C040A0]' : 'text-gray-500'}`} style={{ fontFamily: FC }}>
                  {isEn ? 'Plan View' : 'المسقط الأفقي'}
                </span>
              </button>
              <button
                onClick={() => setViewMode('wall')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-[4px] transition-all ${
                  viewMode === 'wall' ? 'border-[#C040A0] bg-[#C040A0]/10' : 'border-gray-200/60 bg-white'
                }`}
              >
                <Icon3D icon={RectangleHorizontal} theme={viewMode === 'wall' ? 'purple' : 'brown'} size="xs" hoverable={false} />
                <span className={`text-xs font-bold ${viewMode === 'wall' ? 'text-[#C040A0]' : 'text-gray-500'}`} style={{ fontFamily: FC }}>
                  {isEn ? 'Wall View' : 'عرض الجدار'}
                </span>
              </button>
            </div>

            {/* ── SVG Views ── */}
            <div className="bg-white rounded-[20px] border-[4px] border-gray-200/60 shadow-sm overflow-hidden mb-4">
              {viewMode === 'plan' ? (
                <RoomPlanView
                  roomLength={roomLength}
                  roomWidth={roomWidth}
                  walls={walls}
                  selectedWall={selectedWall}
                  onSelectWall={(id) => { setSelectedWall(id); setViewMode('wall'); }}
                  paintColor={PAINT_COLORS[paintColor].hex}
                  isEn={isEn}
                />
              ) : (
                <WallElevationView
                  wall={currentWall}
                  roomHeight={roomHeight}
                  paintColor={PAINT_COLORS[paintColor].hex}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  onMoveElement={moveElement}
                  isEn={isEn}
                />
              )}
            </div>

            {/* ── Wall Tabs (in wall view) ── */}
            {viewMode === 'wall' && (
              <>
                <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide">
                  {walls.map(w => (
                    <button
                      key={w.id}
                      onClick={() => { setSelectedWall(w.id); setSelectedElement(null); }}
                      className={`flex-shrink-0 flex items-center gap-1.5 py-2 px-3 rounded-xl border-[4px] transition-all ${
                        selectedWall === w.id
                          ? 'border-[#C040A0] bg-[#C040A0]/10'
                          : 'border-gray-200/60 bg-white'
                      }`}
                    >
                      <span className={`text-xs font-bold ${selectedWall === w.id ? 'text-[#C040A0]' : 'text-gray-500'}`} style={{ fontFamily: FC }}>
                        {isEn ? w.labelEn : w.labelAr}
                      </span>
                      {w.elements.length > 0 && (
                        <span className="text-[9px] bg-[#C040A0]/20 text-[#C040A0] px-1.5 py-0.5 rounded-full font-bold">
                          {w.elements.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* ── Add Elements ── */}
                <InputCard>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon3D icon={Plus} theme="pink" size="sm" hoverable={false} />
                      <h3 className="font-bold text-sm text-[#1A1A1A]" style={{ fontFamily: FC }}>
                        {isEn ? 'Wall Elements' : 'عناصر الجدار'}
                      </h3>
                    </div>
                    <span className="text-[10px] text-gray-400" style={{ fontFamily: FC }}>
                      {currentWall.length.toFixed(2)}{isEn ? 'm' : 'م'} × {roomHeight.toFixed(2)}{isEn ? 'm' : 'م'}
                    </span>
                  </div>

                  {/* Add Buttons */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {([
                      { type: 'door' as const, ar: 'أضف باب', en: 'Add Door', icon: DoorOpen, theme: 'orange' },
                      { type: 'window' as const, ar: 'أضف نافذة', en: 'Add Window', icon: RectangleHorizontal, theme: 'cyan' },
                      { type: 'opening' as const, ar: 'أضف فتحة', en: 'Add Opening', icon: SplitSquareHorizontal, theme: 'purple' },
                    ]).map(btn => (
                      <button
                        key={btn.type}
                        onClick={() => addElement(btn.type)}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-[4px] border-gray-200/60 bg-white hover:border-[#C040A0]/40 hover:bg-[#C040A0]/5 transition-all active:scale-95"
                      >
                        <Icon3D icon={btn.icon} theme={btn.theme} size="xs" hoverable={false} />
                        <span className="text-[10px] font-bold text-gray-600" style={{ fontFamily: FC }}>
                          {isEn ? btn.en : btn.ar}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Elements List */}
                  {currentWall.elements.length > 0 && (
                    <div className="space-y-2">
                      {currentWall.elements.map(el => (
                        <div
                          key={el.id}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border-[4px] transition-all cursor-pointer ${
                            selectedElement === el.id
                              ? 'border-[#C040A0] bg-[#C040A0]/5'
                              : 'border-gray-200/60 bg-gray-50 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedElement(selectedElement === el.id ? null : el.id)}
                        >
                          <Icon3D
                            icon={el.type === 'door' ? DoorOpen : el.type === 'window' ? RectangleHorizontal : SplitSquareHorizontal}
                            theme={el.type === 'door' ? 'orange' : el.type === 'window' ? 'cyan' : 'purple'}
                            size="xs"
                            hoverable={false}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-gray-700" style={{ fontFamily: FC }}>
                              {el.type === 'door' ? (isEn ? 'Door' : 'باب') : el.type === 'window' ? (isEn ? 'Window' : 'نافذة') : (isEn ? 'Opening' : 'فتحة')}
                            </div>
                            <div className="text-[9px] text-gray-400" style={{ fontFamily: FC }}>
                              {el.width.toFixed(2)} × {el.height.toFixed(2)}{isEn ? 'm' : 'م'} • {isEn ? 'pos' : 'موضع'}: {el.position.toFixed(2)}{isEn ? 'm' : 'م'}
                            </div>
                          </div>

                          {selectedElement === el.id && (
                            <div className="flex gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); moveElement(el.id, el.position - 0.1); }}
                                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); moveElement(el.id, el.position + 0.1); }}
                                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                              >
                                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}
                                className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {currentWall.elements.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-xs text-gray-400" style={{ fontFamily: FC }}>
                        {isEn ? 'No elements on this wall yet' : 'لا توجد عناصر على هذا الجدار بعد'}
                      </p>
                    </div>
                  )}
                </InputCard>
              </>
            )}

            {/* ── Summary Stats ── */}
            <div className="bg-gradient-to-l from-[#7B2D8E] to-[#C040A0] rounded-2xl p-4 mb-4 relative overflow-hidden">
              <div className="absolute -top-8 -left-8 w-28 h-28 bg-white/5 rounded-full" />
              <div className="relative z-10 grid grid-cols-3 gap-3 text-center text-white">
                <div>
                  <div className="text-[10px] text-white/50" style={{ fontFamily: FC }}>{isEn ? 'Floor Area' : 'مساحة الأرض'}</div>
                  <div className="text-lg font-black" style={{ fontFamily: FC }}>{(roomLength * roomWidth).toFixed(1)}</div>
                  <div className="text-[9px] text-white/40">{isEn ? 'm²' : 'م²'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/50" style={{ fontFamily: FC }}>{isEn ? 'Walls Area' : 'مساحة الجدران'}</div>
                  <div className="text-lg font-black" style={{ fontFamily: FC }}>{(2 * (roomLength + roomWidth) * roomHeight).toFixed(1)}</div>
                  <div className="text-[9px] text-white/40">{isEn ? 'm²' : 'م²'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/50" style={{ fontFamily: FC }}>{isEn ? 'Elements' : 'العناصر'}</div>
                  <div className="text-lg font-black" style={{ fontFamily: FC }}>{totalElements}</div>
                  <div className="text-[9px] text-white/40">{isEn ? 'doors/windows' : 'باب/نافذة'}</div>
                </div>
              </div>
            </div>

            <ActionButton
              onClick={() => setActiveStep('paint')}
              text="التالي: إعدادات الدهان"
              textEn="Next: Paint Settings"
              iconComponent={Paintbrush}
            />
          </motion.div>
        )}

        {/* ═════════════════════════════════ */}
        {/* STEP 2: PAINT SETTINGS           */}
        {/* ═════════════════════════════════ */}
        {activeStep === 'paint' && (
          <motion.div key="paint" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>

            {/* Color Palette */}
            <InputCard>
              <div className="flex items-center gap-2 mb-4">
                <Icon3D icon={Droplets} theme="rose" size="sm" hoverable={false} />
                <h3 className="font-bold text-base text-[#1A1A1A]" style={{ fontFamily: FC }}>
                  {isEn ? 'Paint Color' : 'لون الدهان'}
                </h3>
              </div>

              <div className="flex items-center gap-3 mb-4 bg-gray-50 rounded-xl p-3 border-[4px] border-gray-200/60">
                <div className="w-14 h-14 rounded-xl shadow-inner border-2 border-white" style={{ backgroundColor: PAINT_COLORS[paintColor].hex }} />
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-700" style={{ fontFamily: FC }}>
                    {isEn ? PAINT_COLORS[paintColor].nameEn : PAINT_COLORS[paintColor].name}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">{PAINT_COLORS[paintColor].hex}</div>
                </div>
              </div>

              <div className="grid grid-cols-8 gap-1.5">
                {PAINT_COLORS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setPaintColor(i)}
                    className={`aspect-square rounded-lg transition-all ${paintColor === i ? 'ring-2 ring-[#C040A0] ring-offset-2 scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: c.hex, border: c.hex === '#FAFAFA' || c.hex === '#FFFFF0' || c.hex === '#FFFDD0' ? '1px solid #e5e7eb' : 'none' }}
                  />
                ))}
              </div>
            </InputCard>

            {/* Finish Type */}
            <InputCard>
              <div className="flex items-center gap-2 mb-3">
                <Icon3D icon={Sparkles} theme="amber" size="sm" hoverable={false} />
                <h3 className="font-bold text-base text-[#1A1A1A]" style={{ fontFamily: FC }}>
                  {isEn ? 'Finish Type' : 'نوع اللمعة'}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {FINISHES.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFinish(f.id)}
                    className={`p-3 rounded-xl border-[4px] transition-all flex items-center gap-2 ${
                      finish === f.id ? 'border-[#C040A0] bg-[#C040A0]/5 shadow-sm' : 'border-gray-200/60 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Icon3D icon={f.icon} theme={f.theme} size="xs" hoverable={false} />
                    <div className="flex-1 text-right">
                      <div className={`text-xs font-bold ${finish === f.id ? 'text-[#C040A0]' : 'text-gray-600'}`} style={{ fontFamily: FC }}>{isEn ? f.en : f.ar}</div>
                      <div className="text-[9px] text-gray-400" style={{ fontFamily: FC }}>×{f.priceFactor.toFixed(2)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </InputCard>

            {/* Quality */}
            <InputCard>
              <div className="flex items-center gap-2 mb-3">
                <Icon3D icon={ShieldCheck} theme="teal" size="sm" hoverable={false} />
                <h3 className="font-bold text-base text-[#1A1A1A]" style={{ fontFamily: FC }}>
                  {isEn ? 'Paint Quality' : 'جودة الدهان'}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {QUALITIES.map(q => (
                  <button
                    key={q.id}
                    onClick={() => setQuality(q.id)}
                    className={`p-3 rounded-xl border-[4px] transition-all flex items-center gap-2 ${
                      quality === q.id ? 'border-[#C040A0] bg-[#C040A0]/5 shadow-sm' : 'border-gray-200/60 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Icon3D icon={q.icon} theme={q.theme} size="xs" hoverable={false} />
                    <div className="flex-1 text-right">
                      <div className={`text-xs font-bold ${quality === q.id ? 'text-[#C040A0]' : 'text-gray-600'}`} style={{ fontFamily: FC }}>{isEn ? q.en : q.ar}</div>
                      <div className="text-[9px] text-gray-400" style={{ fontFamily: FC }}>~{q.pricePerLiter} {isEn ? 'AED/L' : 'د.إ/لتر'}</div>
                    </div>
                  </button>
                ))}
              </div>
            </InputCard>

            {/* Coats */}
            <InputCard>
              <div className="flex items-center gap-2 mb-3">
                <Icon3D icon={Layers} theme="indigo" size="sm" hoverable={false} />
                <h3 className="font-bold text-base text-[#1A1A1A]" style={{ fontFamily: FC }}>
                  {isEn ? 'Coats & Options' : 'الأوجه والخيارات'}
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {[1, 2, 3].map(n => (
                  <button key={n} onClick={() => setCoats(n)}
                    className={`p-3 rounded-xl border-[4px] transition-all text-center ${coats === n ? 'border-[#C040A0] bg-[#C040A0]/5' : 'border-gray-200/60 bg-white'}`}>
                    <div className="flex justify-center mb-1">
                      {Array.from({ length: n }).map((_, i) => (
                        <div key={i} className={`w-5 h-2 rounded-full -mx-0.5 ${coats === n ? 'bg-[#C040A0]' : 'bg-gray-300'}`} style={{ opacity: 0.5 + i * 0.25 }} />
                      ))}
                    </div>
                    <div className={`text-xs font-bold ${coats === n ? 'text-[#C040A0]' : 'text-gray-600'}`} style={{ fontFamily: FC }}>
                      {n === 1 ? (isEn ? '1 Coat' : 'وجه') : n === 2 ? (isEn ? '2 Coats' : 'وجهين') : (isEn ? '3 Coats' : '3 أوجه')}
                    </div>
                  </button>
                ))}
              </div>

              {/* Toggles */}
              {[
                { val: includeCeiling, set: () => setIncludeCeiling(!includeCeiling), icon: Layers, ar: 'دهان السقف', en: 'Ceiling Paint', theme: 'pink' as const },
                { val: includePrimer, set: () => setIncludePrimer(!includePrimer), icon: ShieldCheck, ar: 'طبقة برايمر', en: 'Primer Coat', theme: 'emerald' as const },
              ].map((t, i) => (
                <button key={i} onClick={t.set}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-[4px] mb-2 transition-all ${t.val ? 'border-[#C040A0] bg-[#C040A0]/5' : 'border-gray-200/60 bg-white'}`}>
                  <div className="flex items-center gap-2">
                    <Icon3D icon={t.icon} theme={t.val ? t.theme : 'brown'} size="xs" hoverable={false} />
                    <span className="font-bold text-sm text-gray-700" style={{ fontFamily: FC }}>{isEn ? t.en : t.ar}</span>
                  </div>
                  <div className={`w-11 h-6 rounded-full relative transition-colors ${t.val ? 'bg-[#C040A0]' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${t.val ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </button>
              ))}
            </InputCard>

            {/* Brand */}
            <InputCard>
              <div className="flex items-center gap-2 mb-3">
                <Icon3D icon={Star} theme="gold" size="sm" hoverable={false} />
                <h3 className="font-bold text-base text-[#1A1A1A]" style={{ fontFamily: FC }}>
                  {isEn ? 'Brand' : 'العلامة التجارية'}
                </h3>
              </div>
              <div className="space-y-2">
                {BRANDS.map(b => (
                  <button key={b.id} onClick={() => setBrand(b.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-[4px] transition-all ${
                      brand === b.id ? 'border-[#C040A0] bg-[#C040A0]/5' : 'border-gray-200/60 bg-white hover:border-gray-300'
                    }`}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: b.color, fontFamily: FC }}>
                      {(isEn ? b.nameEn : b.name).charAt(0)}
                    </div>
                    <div className="flex-1 text-right">
                      <div className={`text-sm font-bold ${brand === b.id ? 'text-[#C040A0]' : 'text-gray-700'}`} style={{ fontFamily: FC }}>{isEn ? b.nameEn : b.name}</div>
                      <div className="text-[9px] text-gray-400" style={{ fontFamily: FC }}>{isEn ? b.originEn : b.origin}</div>
                    </div>
                    {brand === b.id && <Check className="w-5 h-5 text-[#C040A0]" />}
                  </button>
                ))}
              </div>
            </InputCard>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <ActionButton onClick={() => setActiveStep('room')} text="السابق" textEn="Previous" iconComponent={ArrowRight} variant="secondary" />
              <ActionButton onClick={handleCalculate} text="احسب النتائج" textEn="Calculate" iconComponent={Zap} loading={loading} />
            </div>
          </motion.div>
        )}

        {/* ═════════════════════════════════ */}
        {/* STEP 3: RESULTS                  */}
        {/* ═════════════════════════════════ */}
        {activeStep === 'results' && result && (
          <motion.div key="results" id="paint-results" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>

            {/* Hero Cost */}
            <div className="bg-gradient-to-l from-[#7B2D8E] to-[#C040A0] rounded-[24px] p-6 mb-4 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -ml-10 -mt-10" />
              <div className="relative z-10">
                <div className="text-white/50 text-xs mb-1" style={{ fontFamily: FC }}>{isEn ? 'Total Estimated Cost' : 'التكلفة الإجمالية التقديرية'}</div>
                <div className="text-3xl font-black text-white mb-4" style={{ fontFamily: FC }}>{formatAED(result.costs.total)}</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: isEn ? 'Paint' : 'الدهان', val: result.costs.paint },
                    ...(result.costs.primer > 0 ? [{ label: isEn ? 'Primer' : 'البرايمر', val: result.costs.primer }] : []),
                    { label: isEn ? 'Labor' : 'العمالة', val: result.costs.labor },
                    { label: isEn ? 'Supplies' : 'مستلزمات', val: result.costs.supplies },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 text-center">
                      <div className="text-[10px] text-white/50" style={{ fontFamily: FC }}>{item.label}</div>
                      <div className="text-sm font-bold text-white" style={{ fontFamily: FC }}>{formatAED(item.val)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Paint Quantities */}
            <InputCard>
              <div className="flex items-center gap-2 mb-3">
                <Icon3D icon={Paintbrush} theme="pink" size="sm" hoverable={false} />
                <h3 className="font-bold text-base text-[#1A1A1A]" style={{ fontFamily: FC }}>{isEn ? 'Paint Quantities' : 'كميات الدهان'}</h3>
              </div>

              {/* Per-wall breakdown */}
              <div className="space-y-1.5 mb-3">
                {result.wallResults.map((wr: any) => {
                  const wall = walls.find(w => w.id === wr.wallId)!;
                  return (
                    <div key={wr.wallId} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                      <span className="text-xs text-gray-600" style={{ fontFamily: FC }}>{isEn ? wall.labelEn : wall.labelAr}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-gray-400" style={{ fontFamily: FC }}>
                          {wr.totalArea.toFixed(1)} - {wr.elemArea.toFixed(1)} =
                        </span>
                        <span className="text-xs font-bold text-gray-700" style={{ fontFamily: FC }}>{wr.netArea.toFixed(1)} {isEn ? 'm²' : 'م²'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="h-px bg-gray-200 mb-3" />

              <Row label={isEn ? 'Net Wall Area' : 'المساحة الصافية'} value={`${result.totalNetWall} ${isEn ? 'm²' : 'م²'}`} bold />
              {includeCeiling && <Row label={isEn ? 'Ceiling' : 'السقف'} value={`+${result.ceilingArea} ${isEn ? 'm²' : 'م²'}`} />}
              <Row label={isEn ? 'Total Paint Area' : 'إجمالي المساحة'} value={`${result.totalPaintArea} ${isEn ? 'm²' : 'م²'}`} bold />

              <div className="bg-purple-50 rounded-xl p-3 mt-3 border-[4px] border-purple-100/60">
                <Row label={isEn ? 'Paint Needed' : 'كمية الدهان'} value={`${result.paintLiters} ${isEn ? 'L' : 'لتر'}`} highlight />
                <div className="flex gap-3 mt-2">
                  <div className="flex-1 bg-white rounded-lg p-2 text-center">
                    <div className="text-lg font-black text-purple-700" style={{ fontFamily: FC }}>{result.buckets4L}</div>
                    <div className="text-[9px] text-gray-500" style={{ fontFamily: FC }}>{isEn ? '4L Cans' : 'جالون 4 لتر'}</div>
                  </div>
                  <div className="text-gray-300 flex items-center text-xs font-bold">{isEn ? 'or' : 'أو'}</div>
                  <div className="flex-1 bg-white rounded-lg p-2 text-center">
                    <div className="text-lg font-black text-purple-700" style={{ fontFamily: FC }}>{result.buckets18L}</div>
                    <div className="text-[9px] text-gray-500" style={{ fontFamily: FC }}>{isEn ? '18L Pails' : 'دلو 18 لتر'}</div>
                  </div>
                </div>
              </div>

              {result.primerLiters > 0 && (
                <div className="bg-emerald-50 rounded-xl p-3 mt-2 border-[4px] border-emerald-100/60">
                  <Row label={isEn ? 'Primer' : 'البرايمر'} value={`${result.primerLiters} ${isEn ? 'L' : 'لتر'} ≈ ${result.primerBuckets} ${isEn ? 'pails' : 'دلو'}`} highlight highlightColor="emerald" />
                </div>
              )}
            </InputCard>

            {/* Brand Comparison */}
            <InputCard>
              <div className="flex items-center gap-2 mb-3">
                <Icon3D icon={Star} theme="gold" size="sm" hoverable={false} />
                <h3 className="font-bold text-base text-[#1A1A1A]" style={{ fontFamily: FC }}>{isEn ? 'Brand Comparison' : 'مقارنة العلامات'}</h3>
              </div>
              <div className="space-y-2">
                {result.brandComp.map((item: any, idx: number) => {
                  const isSel = item.brand.id === brand;
                  return (
                    <div key={item.brand.id} className={`flex items-center gap-2.5 p-2.5 rounded-xl border-[4px] ${isSel ? 'border-[#C040A0] bg-[#C040A0]/5' : idx === 0 ? 'border-amber-200 bg-amber-50/50' : 'border-gray-200/60 bg-white'}`}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: item.brand.color }}>
                        {(isEn ? item.brand.nameEn : item.brand.name).charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-gray-700 truncate" style={{ fontFamily: FC }}>{isEn ? item.brand.nameEn : item.brand.name}</div>
                      </div>
                      <div className={`text-sm font-black ${isSel ? 'text-[#C040A0]' : idx === 0 ? 'text-amber-700' : 'text-gray-700'}`} style={{ fontFamily: FC }}>{formatAED(item.cost)}</div>
                    </div>
                  );
                })}
                <p className="text-[9px] text-gray-400" style={{ fontFamily: FC }}>{isEn ? '* Paint cost only' : '* تكلفة الدهان فقط'}</p>
              </div>
            </InputCard>

            {/* Share */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <ActionButton onClick={() => {
                const brandData = BRANDS.find(b => b.id === brand)!;
                const finishData = FINISHES.find(f => f.id === finish)!;
                const text = isEn
                  ? `Paint Calc — Beit Al Reef\nRoom: ${roomLength}×${roomWidth}×${roomHeight}m\nPaint: ${result.paintLiters}L (${result.buckets18L} pails)\nBrand: ${brandData.nameEn} (${finishData.en})\nTotal: ${formatAED(result.costs.total)}`
                  : `حاسبة الدهانات — بيت الريف\nالغرفة: ${roomLength}×${roomWidth}×${roomHeight}م\nالدهان: ${result.paintLiters} لتر (${result.buckets18L} دلو)\nالعلامة: ${brandData.name} (${finishData.ar})\nالتكلفة: ${formatAED(result.costs.total)}`;
                navigator.clipboard?.writeText(text);
              }} text="نسخ" textEn="Copy" iconComponent={Copy} variant="secondary" />
              <ActionButton onClick={() => {
                const brandData = BRANDS.find(b => b.id === brand)!;
                const text = isEn
                  ? `🎨 Paint Calc — Beit Al Reef\n📐 ${roomLength}×${roomWidth}m\n🪣 ${result.paintLiters}L (${brandData.nameEn})\n💰 ${formatAED(result.costs.total)}`
                  : `🎨 حاسبة الدهانات — بيت الريف\n📐 ${roomLength}×${roomWidth}م\n🪣 ${result.paintLiters} لتر (${brandData.name})\n💰 ${formatAED(result.costs.total)}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }} text="واتساب" textEn="WhatsApp" iconComponent={Share2} variant="dark" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ActionButton onClick={() => setActiveStep('room')} text="تعديل الغرفة" textEn="Edit Room" iconComponent={Ruler} variant="secondary" />
              <ActionButton onClick={() => {
                setResult(null);
                setWalls(prev => prev.map(w => ({ ...w, elements: [] })));
                setRoomLength(3.93); setRoomWidth(7.36); setRoomHeight(2.97);
                setActiveStep('room');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} text="حساب جديد" textEn="New Calc" iconComponent={RotateCcw} variant="secondary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SimpleToolShell>
  );
}


// ═══════════════════════════════════════
// SVG: Room Plan View (Top-Down)
// ═══════════════════════════════════════

function RoomPlanView({ roomLength, roomWidth, walls, selectedWall, onSelectWall, paintColor, isEn }: {
  roomLength: number; roomWidth: number; walls: Wall[]; selectedWall: string;
  onSelectWall: (id: Wall['id']) => void; paintColor: string; isEn: boolean;
}) {
  const padding = 55;
  const maxW = 340;
  const maxH = 300;
  const scale = Math.min((maxW - padding * 2) / roomLength, (maxH - padding * 2) / roomWidth);
  const rw = roomLength * scale;
  const rh = roomWidth * scale;
  const cx = maxW / 2;
  const cy = maxH / 2;
  const rx = cx - rw / 2;
  const ry = cy - rh / 2;
  const wt = WALL_THICKNESS * scale;

  // Grid
  const gridLines = [];
  const gridStep = 40;
  for (let x = 0; x < maxW; x += gridStep) gridLines.push(<line key={`gx${x}`} x1={x} y1={0} x2={x} y2={maxH} stroke="#E8E8E8" strokeWidth={0.5} />);
  for (let y = 0; y < maxH; y += gridStep) gridLines.push(<line key={`gy${y}`} x1={0} y1={y} x2={maxW} y2={y} stroke="#E8E8E8" strokeWidth={0.5} />);

  // Door arcs on plan
  const doorArcs: JSX.Element[] = [];
  walls.forEach(wall => {
    wall.elements.forEach(el => {
      if (el.type !== 'door') return;
      const doorW = el.width * scale;
      const pos = el.position * scale;
      let dx = 0, dy = 0, sa = 0, ea = 0;
      if (wall.id === 'north') { dx = rx + pos; dy = ry; sa = 0; ea = Math.PI / 2; }
      else if (wall.id === 'south') { dx = rx + pos + doorW; dy = ry + rh; sa = Math.PI; ea = Math.PI * 1.5; }
      else if (wall.id === 'east') { dx = rx + rw; dy = ry + pos; sa = Math.PI / 2; ea = Math.PI; }
      else if (wall.id === 'west') { dx = rx; dy = ry + pos + doorW; sa = Math.PI * 1.5; ea = Math.PI * 2; }

      const r = doorW;
      const x1 = dx + r * Math.cos(sa);
      const y1 = dy + r * Math.sin(sa);
      const x2 = dx + r * Math.cos(ea);
      const y2 = dy + r * Math.sin(ea);
      doorArcs.push(
        <g key={el.id}>
          <path d={`M ${dx} ${dy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`} fill="rgba(192,64,160,0.08)" stroke="#C040A0" strokeWidth={1} strokeDasharray="3,2" />
        </g>
      );
    });
  });

  // Window marks on plan
  const windowMarks: JSX.Element[] = [];
  walls.forEach(wall => {
    wall.elements.forEach(el => {
      if (el.type !== 'window') return;
      const pos = el.position * scale;
      const elW = el.width * scale;
      let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
      if (wall.id === 'north') { x1 = rx + pos; y1 = ry - wt / 2; x2 = x1 + elW; y2 = y1; }
      else if (wall.id === 'south') { x1 = rx + pos; y1 = ry + rh + wt / 2; x2 = x1 + elW; y2 = y1; }
      else if (wall.id === 'east') { x1 = rx + rw + wt / 2; y1 = ry + pos; x2 = x1; y2 = y1 + elW; }
      else if (wall.id === 'west') { x1 = rx - wt / 2; y1 = ry + pos; x2 = x1; y2 = y1 + elW; }
      windowMarks.push(
        <line key={el.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0072CE" strokeWidth={4} strokeLinecap="round" />
      );
    });
  });

  const wallClickable = (id: Wall['id'], x: number, y: number, w: number, h: number) => (
    <rect key={id} x={x} y={y} width={w} height={h}
      fill={selectedWall === id ? 'rgba(192,64,160,0.25)' : 'transparent'}
      stroke="transparent" strokeWidth={0}
      style={{ cursor: 'pointer' }}
      onClick={() => onSelectWall(id)}
    />
  );

  return (
    <div className="p-3">
      <svg width="100%" viewBox={`0 0 ${maxW} ${maxH}`} className="select-none">
        {/* Grid */}
        {gridLines}

        {/* Room fill */}
        <rect x={rx} y={ry} width={rw} height={rh} fill={paintColor} opacity={0.15} />

        {/* Walls */}
        <rect x={rx - wt} y={ry - wt} width={rw + wt * 2} height={rh + wt * 2}
          fill="none" stroke="#2C2C2C" strokeWidth={wt} rx={2} />

        {/* Door arcs */}
        {doorArcs}

        {/* Window marks */}
        {windowMarks}

        {/* Clickable wall zones */}
        {wallClickable('north', rx, ry - wt * 2, rw, wt * 4)}
        {wallClickable('south', rx, ry + rh - wt * 2, rw, wt * 4)}
        {wallClickable('east', rx + rw - wt * 2, ry, wt * 4, rh)}
        {wallClickable('west', rx - wt * 2, ry, wt * 4, rh)}

        {/* Dimension labels */}
        {/* Top */}
        <DimLabel x={cx} y={ry - wt - 12} text={`${roomLength.toFixed(2)}`} />
        <line x1={rx} y1={ry - wt - 6} x2={rx + rw} y2={ry - wt - 6} stroke="#888" strokeWidth={0.5} markerStart="url(#arrow)" markerEnd="url(#arrow)" />

        {/* Bottom */}
        <DimLabel x={cx} y={ry + rh + wt + 18} text={`${roomLength.toFixed(2)}`} />
        <line x1={rx} y1={ry + rh + wt + 10} x2={rx + rw} y2={ry + rh + wt + 10} stroke="#888" strokeWidth={0.5} />

        {/* Left */}
        <DimLabelV x={rx - wt - 18} y={cy} text={`${roomWidth.toFixed(2)}`} />
        <line x1={rx - wt - 10} y1={ry} x2={rx - wt - 10} y2={ry + rh} stroke="#888" strokeWidth={0.5} />

        {/* Right */}
        <DimLabelV x={rx + rw + wt + 18} y={cy} text={`${roomWidth.toFixed(2)}`} />
        <line x1={rx + rw + wt + 10} y1={ry} x2={rx + rw + wt + 10} y2={ry + rh} stroke="#888" strokeWidth={0.5} />

        {/* Corner handles */}
        {[[rx, ry], [rx + rw, ry], [rx, ry + rh], [rx + rw, ry + rh]].map(([hx, hy], i) => (
          <circle key={i} cx={hx} cy={hy} r={4} fill="white" stroke="#888" strokeWidth={1.5} />
        ))}

        {/* Unit label */}
        <text x={8} y={14} fontSize={10} fill="#999" style={{ fontFamily: FC }}>{isEn ? 'm' : 'م'}</text>

        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="none" stroke="#888" strokeWidth={0.5} />
          </marker>
        </defs>
      </svg>
    </div>
  );
}


// ═══════════════════════════════════════
// SVG: Wall Elevation View
// ═══════════════════════════════════════

function WallElevationView({ wall, roomHeight, paintColor, selectedElement, onSelectElement, onMoveElement, isEn }: {
  wall: Wall; roomHeight: number; paintColor: string; selectedElement: string | null;
  onSelectElement: (id: string | null) => void; onMoveElement: (id: string, pos: number) => void; isEn: boolean;
}) {
  const padding = 40;
  const svgW = 340;
  const svgH = 280;
  const scale = Math.min((svgW - padding * 2) / wall.length, (svgH - padding * 2) / roomHeight);
  const ww = wall.length * scale;
  const wh = roomHeight * scale;
  const wx = (svgW - ww) / 2;
  const wy = (svgH - wh) / 2;

  // Wall texture pattern (subtle tile lines)
  const texLines: JSX.Element[] = [];
  const tileSize = 0.5 * scale; // 50cm tiles
  for (let x = 0; x < ww; x += tileSize) {
    texLines.push(<line key={`tx${x}`} x1={wx + x} y1={wy} x2={wx + x} y2={wy + wh} stroke="rgba(0,0,0,0.03)" strokeWidth={0.5} />);
  }
  for (let y = 0; y < wh; y += tileSize) {
    texLines.push(<line key={`ty${y}`} x1={wx} y1={wy + y} x2={wx + ww} y2={wy + y} stroke="rgba(0,0,0,0.03)" strokeWidth={0.5} />);
  }

  // Handle touch/click for dragging
  const svgRef = useRef<SVGSVGElement>(null);
  const handleWallClick = (e: React.MouseEvent<SVGRectElement>) => {
    // Clicking on wall background deselects
    onSelectElement(null);
  };

  return (
    <div className="p-3">
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${svgW} ${svgH}`} className="select-none">
        {/* Grid background */}
        {Array.from({ length: Math.ceil(svgW / 30) }).map((_, i) => (
          <line key={`gx${i}`} x1={i * 30} y1={0} x2={i * 30} y2={svgH} stroke="#F0F0F0" strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.ceil(svgH / 30) }).map((_, i) => (
          <line key={`gy${i}`} x1={0} y1={i * 30} x2={svgW} y2={i * 30} stroke="#F0F0F0" strokeWidth={0.5} />
        ))}

        {/* Wall background with paint color */}
        <rect x={wx} y={wy} width={ww} height={wh} fill={paintColor} rx={2} />

        {/* Wall border */}
        <rect x={wx} y={wy} width={ww} height={wh} fill="none" stroke="#333" strokeWidth={3} rx={2}
          onClick={handleWallClick} style={{ cursor: 'default' }} />

        {/* Texture */}
        {texLines}

        {/* Subtle light effect */}
        <defs>
          <linearGradient id="light" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect x={wx} y={wy} width={ww} height={wh} fill="url(#light)" rx={2} />

        {/* Elements */}
        {wall.elements.map(el => {
          const ex = wx + el.position * scale;
          const elW = el.width * scale;
          const elH = el.height * scale;
          const ey = wy + wh - elH - (el.fromFloor * scale);
          const isSel = selectedElement === el.id;

          return (
            <g key={el.id} onClick={(e) => { e.stopPropagation(); onSelectElement(isSel ? null : el.id); }} style={{ cursor: 'pointer' }}>
              {/* Element background */}
              <rect x={ex} y={ey} width={elW} height={elH}
                fill={el.type === 'opening' ? 'white' : el.type === 'window' ? '#E3F2FD' : '#FFF8E1'}
                stroke={isSel ? '#C040A0' : el.type === 'window' ? '#0072CE' : '#8D6E63'}
                strokeWidth={isSel ? 2.5 : 1.5}
                strokeDasharray={el.type === 'opening' ? '4,3' : 'none'}
                rx={1}
              />

              {/* Door details */}
              {el.type === 'door' && (
                <>
                  {/* Door panel lines */}
                  <line x1={ex + elW * 0.15} y1={ey + elH * 0.15} x2={ex + elW * 0.15} y2={ey + elH * 0.85} stroke="#D7CCC8" strokeWidth={0.8} />
                  <line x1={ex + elW * 0.85} y1={ey + elH * 0.15} x2={ex + elW * 0.85} y2={ey + elH * 0.85} stroke="#D7CCC8" strokeWidth={0.8} />
                  {/* Handle */}
                  <circle cx={ex + elW * 0.8} cy={ey + elH * 0.55} r={2.5} fill="#8D6E63" />
                </>
              )}

              {/* Window details */}
              {el.type === 'window' && (
                <>
                  {/* Cross */}
                  <line x1={ex + elW / 2} y1={ey} x2={ex + elW / 2} y2={ey + elH} stroke="#90CAF9" strokeWidth={1} />
                  <line x1={ex} y1={ey + elH / 2} x2={ex + elW} y2={ey + elH / 2} stroke="#90CAF9" strokeWidth={1} />
                  {/* Glass effect */}
                  <rect x={ex + 2} y={ey + 2} width={elW / 2 - 3} height={elH / 2 - 3} fill="#BBDEFB" opacity={0.3} />
                </>
              )}

              {/* Element dimensions */}
              <text x={ex + elW / 2} y={ey + elH + 12} textAnchor="middle" fontSize={8} fill="#666" style={{ fontFamily: FC }}>
                {el.width.toFixed(2)}
              </text>
              <text x={ex - 5} y={ey + elH / 2} textAnchor="end" fontSize={8} fill="#666" style={{ fontFamily: FC }} transform={`rotate(-90, ${ex - 5}, ${ey + elH / 2})`}>
                {el.height.toFixed(2)}
              </text>

              {/* Selection indicator */}
              {isSel && (
                <>
                  {[[ex, ey], [ex + elW, ey], [ex, ey + elH], [ex + elW, ey + elH]].map(([hx, hy], i) => (
                    <circle key={i} cx={hx} cy={hy} r={4} fill="white" stroke="#C040A0" strokeWidth={2} />
                  ))}
                </>
              )}
            </g>
          );
        })}

        {/* Wall dimension labels */}
        {/* Top */}
        <DimLabel x={wx + ww / 2} y={wy - 12} text={`${wall.length.toFixed(2)}`} />
        <line x1={wx} y1={wy - 6} x2={wx + ww} y2={wy - 6} stroke="#888" strokeWidth={0.5} />

        {/* Bottom */}
        <DimLabel x={wx + ww / 2} y={wy + wh + 22} text={`${wall.length.toFixed(2)}`} />
        <line x1={wx} y1={wy + wh + 14} x2={wx + ww} y2={wy + wh + 14} stroke="#888" strokeWidth={0.5} />

        {/* Left height */}
        <DimLabelV x={wx - 18} y={wy + wh / 2} text={`${roomHeight.toFixed(2)}`} />
        <line x1={wx - 10} y1={wy} x2={wx - 10} y2={wy + wh} stroke="#888" strokeWidth={0.5} />

        {/* Right height */}
        <DimLabelV x={wx + ww + 18} y={wy + wh / 2} text={`${roomHeight.toFixed(2)}`} />
        <line x1={wx + ww + 10} y1={wy} x2={wx + ww + 10} y2={wy + wh} stroke="#888" strokeWidth={0.5} />

        {/* Corner handles */}
        {[[wx, wy], [wx + ww, wy], [wx, wy + wh], [wx + ww, wy + wh]].map(([hx, hy], i) => (
          <circle key={i} cx={hx} cy={hy} r={4} fill="white" stroke="#888" strokeWidth={1.5} />
        ))}
      </svg>

      {/* Wall label */}
      <div className="text-center -mt-1">
        <span className="text-[10px] text-gray-400 font-bold" style={{ fontFamily: FC }}>
          {isEn ? wall.labelEn : wall.labelAr} — {wall.length.toFixed(2)} × {roomHeight.toFixed(2)}{isEn ? 'm' : 'م'}
        </span>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════
// SVG Helpers
// ═══════════════════════════════════════

function DimLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={10} fill="#555" fontWeight={600} style={{ fontFamily: FC }}>
      {text}
    </text>
  );
}

function DimLabelV({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={10} fill="#555" fontWeight={600} style={{ fontFamily: FC }} transform={`rotate(-90, ${x}, ${y})`}>
      {text}
    </text>
  );
}

function Row({ label, value, bold, highlight, highlightColor = 'purple', muted }: {
  label: string; value: string; bold?: boolean; highlight?: boolean; highlightColor?: string; muted?: boolean;
}) {
  const colors: Record<string, string> = { purple: 'text-purple-700', emerald: 'text-emerald-700', pink: 'text-[#C040A0]' };
  return (
    <div className={`flex justify-between items-center py-1.5 ${bold ? 'border-t border-gray-200 pt-2' : ''}`}>
      <span className={`text-sm ${muted ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: FC }}>{label}</span>
      <span className={`font-bold text-sm ${highlight ? (colors[highlightColor] || 'text-purple-700') : bold ? 'text-[#1A1A1A]' : 'text-gray-700'}`} style={{ fontFamily: FC }}>{value}</span>
    </div>
  );
}
