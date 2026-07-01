import { useState, useRef, useEffect, useCallback } from 'react';
import { SimpleToolShell } from './SimpleToolShell';
import { useLanguage } from '../../../contexts/LanguageContext';

const fontCairo = 'Cairo, sans-serif';

interface Wall3D {
  p1: { x: number; z: number };
  p2: { x: number; z: number };
  height: number;
  thickness: number;
  color: string;
}

interface FurnitureBox {
  id: string;
  x: number; y: number; z: number;
  w: number; h: number; d: number;
  color: string;
  label: string;
}

interface Template3D {
  id: string; ar: string; en: string;
  walls: Wall3D[];
  furniture: Omit<FurnitureBox, 'id'>[];
  floorSize: { w: number; d: number };
}

const TEMPLATES: Template3D[] = [
  {
    id: 'room1', ar: 'غرفة فارغة', en: 'Empty Room',
    floorSize: { w: 5000, d: 6000 },
    walls: [
      { p1: { x: 0, z: 0 }, p2: { x: 5000, z: 0 }, height: 2800, thickness: 200, color: '#D4CFC4' },
      { p1: { x: 5000, z: 0 }, p2: { x: 5000, z: 6000 }, height: 2800, thickness: 200, color: '#C4BFB3' },
      { p1: { x: 5000, z: 6000 }, p2: { x: 0, z: 6000 }, height: 2800, thickness: 200, color: '#B8B0A2' },
      { p1: { x: 0, z: 6000 }, p2: { x: 0, z: 0 }, height: 2800, thickness: 200, color: '#CCCAC0' },
    ],
    furniture: [],
  },
  {
    id: 'living', ar: 'غرفة معيشة', en: 'Living Room',
    floorSize: { w: 5000, d: 6000 },
    walls: [
      { p1: { x: 0, z: 0 }, p2: { x: 5000, z: 0 }, height: 2800, thickness: 200, color: '#D4CFC4' },
      { p1: { x: 5000, z: 0 }, p2: { x: 5000, z: 6000 }, height: 2800, thickness: 200, color: '#C4BFB3' },
      { p1: { x: 5000, z: 6000 }, p2: { x: 0, z: 6000 }, height: 2800, thickness: 200, color: '#B8B0A2' },
      { p1: { x: 0, z: 6000 }, p2: { x: 0, z: 0 }, height: 2800, thickness: 200, color: '#CCCAC0' },
    ],
    furniture: [
      { x: 500, y: 0, z: 500, w: 2200, h: 750, d: 900, color: '#8B5CF6', label: 'Sofa' },
      { x: 1200, y: 0, z: 2000, w: 1200, h: 450, d: 600, color: '#C8A86A', label: 'Table' },
      { x: 4300, y: 0, z: 1000, w: 200, h: 1200, d: 1800, color: '#3B82F6', label: 'TV' },
      { x: 4300, y: 0, z: 1000, w: 1800, h: 400, d: 400, color: '#6B7280', label: 'TV Unit' },
    ],
  },
  {
    id: 'bedroom', ar: 'غرفة نوم', en: 'Bedroom',
    floorSize: { w: 4500, d: 5500 },
    walls: [
      { p1: { x: 0, z: 0 }, p2: { x: 4500, z: 0 }, height: 2800, thickness: 200, color: '#D4CFC4' },
      { p1: { x: 4500, z: 0 }, p2: { x: 4500, z: 5500 }, height: 2800, thickness: 200, color: '#C4BFB3' },
      { p1: { x: 4500, z: 5500 }, p2: { x: 0, z: 5500 }, height: 2800, thickness: 200, color: '#B8B0A2' },
      { p1: { x: 0, z: 5500 }, p2: { x: 0, z: 0 }, height: 2800, thickness: 200, color: '#CCCAC0' },
    ],
    furniture: [
      { x: 1200, y: 0, z: 500, w: 2000, h: 500, d: 2100, color: '#2AA676', label: 'King Bed' },
      { x: 400, y: 0, z: 700, w: 500, h: 400, d: 400, color: '#C8A86A', label: 'Nightstand' },
      { x: 3500, y: 0, z: 700, w: 500, h: 400, d: 400, color: '#C8A86A', label: 'Nightstand' },
      { x: 200, y: 0, z: 3500, w: 1800, h: 2200, d: 600, color: '#6B7280', label: 'Wardrobe' },
      { x: 2500, y: 0, z: 3500, w: 1200, h: 800, d: 500, color: '#EC4899', label: 'Dresser' },
    ],
  },
  {
    id: 'office', ar: 'مكتب', en: 'Office',
    floorSize: { w: 4000, d: 4000 },
    walls: [
      { p1: { x: 0, z: 0 }, p2: { x: 4000, z: 0 }, height: 2800, thickness: 200, color: '#D4CFC4' },
      { p1: { x: 4000, z: 0 }, p2: { x: 4000, z: 4000 }, height: 2800, thickness: 200, color: '#C4BFB3' },
      { p1: { x: 4000, z: 4000 }, p2: { x: 0, z: 4000 }, height: 2800, thickness: 200, color: '#B8B0A2' },
      { p1: { x: 0, z: 4000 }, p2: { x: 0, z: 0 }, height: 2800, thickness: 200, color: '#CCCAC0' },
    ],
    furniture: [
      { x: 500, y: 0, z: 500, w: 1400, h: 750, d: 700, color: '#6B7280', label: 'Desk' },
      { x: 800, y: 0, z: 1400, w: 550, h: 550, d: 550, color: '#2AA676', label: 'Chair' },
      { x: 3000, y: 0, z: 500, w: 800, h: 2000, d: 350, color: '#C8A86A', label: 'Bookshelf' },
      { x: 2800, y: 0, z: 2500, w: 400, h: 1200, d: 600, color: '#8B5CF6', label: 'Filing' },
    ],
  },
];

const EXTRA_FURNITURE: { id: string; ar: string; en: string; w: number; h: number; d: number; color: string }[] = [
  { id: 'sofa', ar: 'كنبة', en: 'Sofa', w: 2200, h: 750, d: 900, color: '#8B5CF6' },
  { id: 'table', ar: 'طاولة', en: 'Table', w: 1200, h: 450, d: 600, color: '#C8A86A' },
  { id: 'bed', ar: 'سرير', en: 'Bed', w: 2000, h: 500, d: 2100, color: '#2AA676' },
  { id: 'wardrobe', ar: 'خزانة', en: 'Wardrobe', w: 1800, h: 2200, d: 600, color: '#6B7280' },
  { id: 'desk', ar: 'مكتب', en: 'Desk', w: 1400, h: 750, d: 700, color: '#6B7280' },
  { id: 'chair', ar: 'كرسي', en: 'Chair', w: 550, h: 550, d: 550, color: '#2AA676' },
  { id: 'tv', ar: 'تلفزيون', en: 'TV', w: 200, h: 1200, d: 1800, color: '#3B82F6' },
  { id: 'shelf', ar: 'رف', en: 'Shelf', w: 800, h: 2000, d: 350, color: '#C8A86A' },
];

const SCALE = 0.035;
const genId = () => `f3d_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export function Design3DTool({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [walls, setWalls] = useState<Wall3D[]>([]);
  const [furnItems, setFurnItems] = useState<FurnitureBox[]>([]);
  const [floorSize, setFloorSize] = useState({ w: 5000, d: 6000 });
  const [rotY, setRotY] = useState(40);
  const [rotX, setRotX] = useState(25);
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const project = useCallback((x: number, y: number, z: number, cx: number, cy: number) => {
    // Center the model
    const mx = x - floorSize.w / 2;
    const mz = z - floorSize.d / 2;

    const radY = (rotY * Math.PI) / 180;
    const radX = (rotX * Math.PI) / 180;
    const cosY = Math.cos(radY), sinY = Math.sin(radY);
    const cosX = Math.cos(radX), sinX = Math.sin(radX);

    const rx = mx * cosY - mz * sinY;
    const rz = mx * sinY + mz * cosY;
    const ry = y * cosX - rz * sinX;
    const rz2 = y * sinX + rz * cosX;

    return { x: cx + rx * SCALE, y: cy - ry * SCALE, z: rz2 };
  }, [rotY, rotX, floorSize]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H * 0.6;

    ctx.clearRect(0, 0, W, H);

    // Dark background
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#1a1d23');
    grad.addColorStop(1, '#111318');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Grid on floor
    if (showGrid) {
      ctx.strokeStyle = 'rgba(42,166,118,0.08)';
      ctx.lineWidth = 0.5;
      const step = 500;
      for (let i = 0; i <= floorSize.w; i += step) {
        const p1 = project(i, 0, 0, cx, cy);
        const p2 = project(i, 0, floorSize.d, cx, cy);
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      }
      for (let j = 0; j <= floorSize.d; j += step) {
        const p1 = project(0, 0, j, cx, cy);
        const p2 = project(floorSize.w, 0, j, cx, cy);
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      }
    }

    // Floor
    const floorPts = [
      project(0, 0, 0, cx, cy),
      project(floorSize.w, 0, 0, cx, cy),
      project(floorSize.w, 0, floorSize.d, cx, cy),
      project(0, 0, floorSize.d, cx, cy),
    ];
    ctx.fillStyle = 'rgba(232,228,217,0.15)';
    ctx.beginPath();
    floorPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.closePath(); ctx.fill();

    // Helper to draw a filled polygon
    const drawPoly = (pts: { x: number; y: number }[], color: string) => {
      ctx.fillStyle = color;
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath(); ctx.fill(); ctx.stroke();
    };

    const parseColor = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const shadeColor = (hex: string, factor: number) => {
      const { r, g, b } = parseColor(hex);
      return `rgb(${Math.round(r * factor)},${Math.round(g * factor)},${Math.round(b * factor)})`;
    };

    // Collect all drawable items for depth sorting
    type Drawable = { type: 'wall' | 'furniture'; depth: number; draw: () => void };
    const drawables: Drawable[] = [];

    // Walls
    walls.forEach(wall => {
      const { p1, p2, height: wh, thickness: t, color } = wall;
      const len = Math.sqrt((p2.x - p1.x) ** 2 + (p2.z - p1.z) ** 2);
      if (len < 1) return;
      const dx = (p2.x - p1.x) / len;
      const dz = (p2.z - p1.z) / len;
      const nx = -dz * t / 2, nz = dx * t / 2;

      const corners = [
        { x: p1.x + nx, z: p1.z + nz }, { x: p2.x + nx, z: p2.z + nz },
        { x: p2.x - nx, z: p2.z - nz }, { x: p1.x - nx, z: p1.z - nz },
      ];

      const midP = project((p1.x + p2.x) / 2, wh / 2, (p1.z + p2.z) / 2, cx, cy);

      drawables.push({
        type: 'wall', depth: midP.z,
        draw: () => {
          // Top face
          drawPoly(corners.map(c => project(c.x, wh, c.z, cx, cy)), shadeColor(color, 1.0));
          // Front face (0-1 bottom to top)
          drawPoly([
            project(corners[0].x, 0, corners[0].z, cx, cy),
            project(corners[1].x, 0, corners[1].z, cx, cy),
            project(corners[1].x, wh, corners[1].z, cx, cy),
            project(corners[0].x, wh, corners[0].z, cx, cy),
          ], shadeColor(color, 0.7));
          // Back face (2-3)
          drawPoly([
            project(corners[2].x, 0, corners[2].z, cx, cy),
            project(corners[3].x, 0, corners[3].z, cx, cy),
            project(corners[3].x, wh, corners[3].z, cx, cy),
            project(corners[2].x, wh, corners[2].z, cx, cy),
          ], shadeColor(color, 0.55));
          // Left face (0-3)
          drawPoly([
            project(corners[0].x, 0, corners[0].z, cx, cy),
            project(corners[3].x, 0, corners[3].z, cx, cy),
            project(corners[3].x, wh, corners[3].z, cx, cy),
            project(corners[0].x, wh, corners[0].z, cx, cy),
          ], shadeColor(color, 0.6));
          // Right face (1-2)
          drawPoly([
            project(corners[1].x, 0, corners[1].z, cx, cy),
            project(corners[2].x, 0, corners[2].z, cx, cy),
            project(corners[2].x, wh, corners[2].z, cx, cy),
            project(corners[1].x, wh, corners[1].z, cx, cy),
          ], shadeColor(color, 0.65));
        },
      });
    });

    // Furniture boxes
    furnItems.forEach(box => {
      const midP = project(box.x + box.w / 2, box.y + box.h / 2, box.z + box.d / 2, cx, cy);
      drawables.push({
        type: 'furniture', depth: midP.z,
        draw: () => {
          const corners3d = [
            { x: box.x, y: box.y, z: box.z },
            { x: box.x + box.w, y: box.y, z: box.z },
            { x: box.x + box.w, y: box.y, z: box.z + box.d },
            { x: box.x, y: box.y, z: box.z + box.d },
            { x: box.x, y: box.y + box.h, z: box.z },
            { x: box.x + box.w, y: box.y + box.h, z: box.z },
            { x: box.x + box.w, y: box.y + box.h, z: box.z + box.d },
            { x: box.x, y: box.y + box.h, z: box.z + box.d },
          ];
          const pts = corners3d.map(c => project(c.x, c.y, c.z, cx, cy));

          // Top
          drawPoly([pts[4], pts[5], pts[6], pts[7]], shadeColor(box.color, 1.0));
          // Front
          drawPoly([pts[0], pts[1], pts[5], pts[4]], shadeColor(box.color, 0.75));
          // Right
          drawPoly([pts[1], pts[2], pts[6], pts[5]], shadeColor(box.color, 0.6));
          // Left
          drawPoly([pts[3], pts[0], pts[4], pts[7]], shadeColor(box.color, 0.65));
          // Back
          drawPoly([pts[2], pts[3], pts[7], pts[6]], shadeColor(box.color, 0.5));

          // Label
          if (showLabels) {
            const labelP = project(box.x + box.w / 2, box.y + box.h + 100, box.z + box.d / 2, cx, cy);
            ctx.fillStyle = '#E8E4D9';
            ctx.font = 'bold 9px Cairo, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(box.label, labelP.x, labelP.y);
          }
        },
      });
    });

    // Sort by depth (far first)
    drawables.sort((a, b) => b.depth - a.depth);
    drawables.forEach(d => d.draw());

  }, [walls, furnItems, floorSize, rotY, rotX, showGrid, showLabels, project]);

  useEffect(() => { render(); }, [render]);

  const loadTemplate = (t: Template3D) => {
    setWalls(t.walls);
    setFurnItems(t.furniture.map(f => ({ ...f, id: genId() })));
    setFloorSize(t.floorSize);
  };

  const addFurniture = (f: typeof EXTRA_FURNITURE[0]) => {
    setFurnItems(prev => [...prev, {
      id: genId(),
      x: Math.random() * (floorSize.w - f.w),
      y: 0,
      z: Math.random() * (floorSize.d - f.d),
      w: f.w, h: f.h, d: f.d,
      color: f.color,
      label: isEn ? f.en : f.ar,
    }]);
  };

  return (
    <SimpleToolShell
      title={isEn ? '3D Room Visualizer' : 'عارض الغرف ثلاثي الأبعاد'}
      subtitle={isEn ? 'Visualize rooms & furniture in 3D' : 'تصوّر الغرف والأثاث بشكل ثلاثي الأبعاد'}
      onBack={onBack}
      toolId="design-3d"
      gradientFrom="#8B5CF6"
      gradientTo="#6D28D9"
    >
      <div className="space-y-3 p-3" dir="rtl">
        {/* Templates */}
        <div className="flex gap-2 flex-wrap">
          {TEMPLATES.map(t => (
            <button key={t.id} onClick={() => loadTemplate(t)}
              className="bg-white border-[4px] border-gray-200/60 px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#1F3D2B] hover:bg-purple-50 hover:border-purple-300 transition-all"
              style={{ fontFamily: fontCairo }}>
              {isEn ? t.en : t.ar}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div className="bg-[#111318] rounded-2xl border-[4px] border-gray-700/60 shadow-lg overflow-hidden">
          <canvas ref={canvasRef} width={360} height={280} className="w-full" />
        </div>

        {/* Rotation */}
        <div className="space-y-2 bg-white rounded-xl p-3 border-[4px] border-gray-100/60">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-gray-500 w-14" style={{ fontFamily: fontCairo }}>{isEn ? 'Rotate' : 'دوران'} Y</span>
            <input type="range" min={0} max={360} value={rotY} onChange={e => setRotY(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to left, #8B5CF6 ${(rotY/360)*100}%, #E5E7EB ${(rotY/360)*100}%)` }} />
            <span className="text-[10px] text-gray-400 w-8 text-center">{rotY}°</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-gray-500 w-14" style={{ fontFamily: fontCairo }}>{isEn ? 'Tilt' : 'إمالة'} X</span>
            <input type="range" min={5} max={80} value={rotX} onChange={e => setRotX(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to left, #8B5CF6 ${((rotX-5)/75)*100}%, #E5E7EB ${((rotX-5)/75)*100}%)` }} />
            <span className="text-[10px] text-gray-400 w-8 text-center">{rotX}°</span>
          </div>
        </div>

        {/* Add Furniture */}
        <div className="bg-white rounded-xl p-3 border-[4px] border-gray-100/60">
          <h4 className="text-[11px] font-bold text-[#1F3D2B] mb-2" style={{ fontFamily: fontCairo }}>
            {isEn ? 'Add Furniture' : 'إضافة أثاث'}
          </h4>
          <div className="grid grid-cols-4 gap-1.5">
            {EXTRA_FURNITURE.map(ef => (
              <button key={ef.id} onClick={() => addFurniture(ef)}
                className="bg-gray-50 border-[4px] border-gray-200/60 rounded-lg p-1.5 text-center hover:border-purple-300 transition-all active:scale-95">
                <div className="w-4 h-4 rounded mx-auto mb-0.5" style={{ backgroundColor: ef.color }} />
                <span className="text-[8px] font-bold text-gray-600 leading-tight block" style={{ fontFamily: fontCairo }}>
                  {isEn ? ef.en : ef.ar}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button onClick={() => setShowGrid(g => !g)}
            className={`flex-1 py-2 rounded-xl text-[10px] font-bold ${showGrid ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'}`}
            style={{ fontFamily: fontCairo }}>{isEn ? 'Grid' : 'شبكة'}</button>
          <button onClick={() => setShowLabels(l => !l)}
            className={`flex-1 py-2 rounded-xl text-[10px] font-bold ${showLabels ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'}`}
            style={{ fontFamily: fontCairo }}>{isEn ? 'Labels' : 'تسميات'}</button>
          <button onClick={() => setFurnItems(prev => prev.slice(0, -1))} disabled={furnItems.length === 0}
            className="flex-1 py-2 rounded-xl text-[10px] font-bold bg-gray-100 text-gray-500 disabled:opacity-30"
            style={{ fontFamily: fontCairo }}>{isEn ? 'Undo' : 'تراجع'}</button>
          <button onClick={() => { setFurnItems([]); setWalls([]); }}
            className="flex-1 py-2 rounded-xl text-[10px] font-bold bg-red-50 text-red-500"
            style={{ fontFamily: fontCairo }}>{isEn ? 'Clear' : 'مسح'}</button>
        </div>

        <div className="bg-purple-50 rounded-xl p-2.5 text-[10px] text-purple-700" style={{ fontFamily: fontCairo }}>
          {isEn
            ? `${walls.length} walls, ${furnItems.length} furniture items. Rotate with sliders.`
            : `${walls.length} جدار، ${furnItems.length} قطعة أثاث. استخدم المنزلقات للتدوير.`}
        </div>
      </div>
    </SimpleToolShell>
  );
}