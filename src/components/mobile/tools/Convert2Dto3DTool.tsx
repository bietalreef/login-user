import { useState, useRef, useEffect, useCallback } from 'react';
import { SimpleToolShell } from './SimpleToolShell';
import { useLanguage } from '../../../contexts/LanguageContext';

const fontCairo = 'Cairo, sans-serif';

interface Room2D {
  id: string;
  label: string;
  x: number; y: number;
  w: number; h: number;
  color: string;
  wallHeight: number;
  wallThickness: number;
}

const genId = () => `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

const TEMPLATES: { id: string; ar: string; en: string; rooms: Omit<Room2D, 'id'>[] }[] = [
  {
    id: 'studio', ar: 'استوديو', en: 'Studio',
    rooms: [
      { label: 'Living', x: 0, y: 0, w: 5000, h: 4000, color: '#2AA676', wallHeight: 2800, wallThickness: 200 },
      { label: 'Kitchen', x: 5000, y: 0, w: 2500, h: 2000, color: '#F59E0B', wallHeight: 2700, wallThickness: 150 },
      { label: 'Bath', x: 5000, y: 2000, w: 2500, h: 2000, color: '#3B82F6', wallHeight: 2600, wallThickness: 150 },
    ],
  },
  {
    id: '1bhk', ar: 'غرفة وصالة', en: '1 BHK',
    rooms: [
      { label: 'Living', x: 0, y: 0, w: 4500, h: 4000, color: '#2AA676', wallHeight: 2800, wallThickness: 200 },
      { label: 'Bedroom', x: 4500, y: 0, w: 3500, h: 3200, color: '#8B5CF6', wallHeight: 2800, wallThickness: 200 },
      { label: 'Kitchen', x: 0, y: 4000, w: 3000, h: 2500, color: '#F59E0B', wallHeight: 2700, wallThickness: 150 },
      { label: 'Bath', x: 4500, y: 3200, w: 2000, h: 2000, color: '#3B82F6', wallHeight: 2600, wallThickness: 150 },
      { label: 'Balcony', x: 6500, y: 3200, w: 1500, h: 2000, color: '#6B7280', wallHeight: 1200, wallThickness: 100 },
    ],
  },
  {
    id: '2bhk', ar: 'غرفتين وصالة', en: '2 BHK',
    rooms: [
      { label: 'Living', x: 0, y: 0, w: 5000, h: 4000, color: '#2AA676', wallHeight: 2800, wallThickness: 250 },
      { label: 'Master BR', x: 5000, y: 0, w: 4000, h: 3500, color: '#8B5CF6', wallHeight: 2800, wallThickness: 200 },
      { label: 'Bedroom 2', x: 0, y: 4000, w: 3500, h: 3000, color: '#EC4899', wallHeight: 2800, wallThickness: 200 },
      { label: 'Kitchen', x: 3500, y: 4000, w: 2500, h: 2000, color: '#F59E0B', wallHeight: 2700, wallThickness: 150 },
      { label: 'Bath 1', x: 3500, y: 6000, w: 1500, h: 1000, color: '#3B82F6', wallHeight: 2600, wallThickness: 150 },
      { label: 'Bath 2', x: 5000, y: 3500, w: 1500, h: 1500, color: '#3B82F6', wallHeight: 2600, wallThickness: 150 },
      { label: 'Corridor', x: 6500, y: 3500, w: 2500, h: 2000, color: '#C8A86A', wallHeight: 2800, wallThickness: 150 },
    ],
  },
  {
    id: 'villa', ar: 'فيلا', en: 'Villa',
    rooms: [
      { label: 'Majlis', x: 0, y: 0, w: 5000, h: 4500, color: '#C8A86A', wallHeight: 3200, wallThickness: 300 },
      { label: 'Living', x: 5000, y: 0, w: 5000, h: 4500, color: '#2AA676', wallHeight: 3200, wallThickness: 250 },
      { label: 'Master', x: 0, y: 4500, w: 4000, h: 3500, color: '#8B5CF6', wallHeight: 3000, wallThickness: 250 },
      { label: 'Bedroom', x: 4000, y: 4500, w: 3500, h: 3500, color: '#EC4899', wallHeight: 3000, wallThickness: 200 },
      { label: 'Kitchen', x: 7500, y: 4500, w: 2500, h: 2000, color: '#F59E0B', wallHeight: 2800, wallThickness: 200 },
      { label: 'Bath', x: 7500, y: 6500, w: 2500, h: 1500, color: '#3B82F6', wallHeight: 2600, wallThickness: 150 },
    ],
  },
];

const SCALE_3D = 0.028;

export function Convert2Dto3DTool({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const canvas2dRef = useRef<HTMLCanvasElement>(null);
  const canvas3dRef = useRef<HTMLCanvasElement>(null);

  const [rooms, setRooms] = useState<Room2D[]>([]);
  const [viewMode, setViewMode] = useState<'split' | '2d' | '3d'>('split');
  const [rotY, setRotY] = useState(35);
  const [rotX, setRotX] = useState(25);
  const [showLabels, setShowLabels] = useState(true);

  // Get overall bounds
  const getBounds = useCallback(() => {
    if (rooms.length === 0) return { minX: 0, minY: 0, maxX: 8000, maxY: 7000 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    rooms.forEach(r => {
      minX = Math.min(minX, r.x); minY = Math.min(minY, r.y);
      maxX = Math.max(maxX, r.x + r.w); maxY = Math.max(maxY, r.y + r.h);
    });
    return { minX, minY, maxX, maxY };
  }, [rooms]);

  // ═══ 2D RENDER ═══
  const draw2D = useCallback(() => {
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(0, 0, W, H);

    const bounds = getBounds();
    const bw = bounds.maxX - bounds.minX;
    const bh = bounds.maxY - bounds.minY;
    const padding = 800;
    const scale = Math.min((W - 40) / (bw + padding * 2), (H - 40) / (bh + padding * 2));
    const ox = (W - bw * scale) / 2 - bounds.minX * scale;
    const oy = (H - bh * scale) / 2 - bounds.minY * scale;

    const toScreen = (x: number, y: number) => ({ x: x * scale + ox, y: y * scale + oy });

    // Grid
    ctx.strokeStyle = '#E8ECEF';
    ctx.lineWidth = 0.3;
    const gridStep = 1000;
    for (let gx = Math.floor(bounds.minX / gridStep) * gridStep; gx <= bounds.maxX + padding; gx += gridStep) {
      const s = toScreen(gx, 0);
      ctx.beginPath(); ctx.moveTo(s.x, 0); ctx.lineTo(s.x, H); ctx.stroke();
    }
    for (let gy = Math.floor(bounds.minY / gridStep) * gridStep; gy <= bounds.maxY + padding; gy += gridStep) {
      const s = toScreen(0, gy);
      ctx.beginPath(); ctx.moveTo(0, s.y); ctx.lineTo(W, s.y); ctx.stroke();
    }

    // Draw rooms
    rooms.forEach(room => {
      const tl = toScreen(room.x, room.y);
      const sw = room.w * scale;
      const sh = room.h * scale;

      // Fill
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = room.color;
      ctx.fillRect(tl.x, tl.y, sw, sh);
      ctx.globalAlpha = 1;

      // Walls
      ctx.strokeStyle = '#5C636B';
      ctx.lineWidth = Math.max(2, room.wallThickness * scale);
      ctx.strokeRect(tl.x, tl.y, sw, sh);

      // Room info
      if (showLabels) {
        const cx = tl.x + sw / 2;
        const cy = tl.y + sh / 2;
        const area = (room.w / 1000) * (room.h / 1000);

        ctx.fillStyle = '#4A5A6A';
        ctx.font = `bold ${Math.max(8, Math.min(12, sw / 6))}px Cairo, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(room.label, cx, cy - 12);

        ctx.fillStyle = '#7B8794';
        ctx.font = `${Math.max(7, Math.min(10, sw / 8))}px Cairo, sans-serif`;
        ctx.fillText(`H=${room.wallHeight}`, cx, cy + 2);
        ctx.fillText(`S=${area.toFixed(1)}m\u00B2`, cx, cy + 14);
      }

      // Dimension lines
      const dimOff = Math.max(12, room.wallThickness * scale + 8);
      ctx.strokeStyle = '#7B8794';
      ctx.fillStyle = '#7B8794';
      ctx.lineWidth = 0.8;
      ctx.font = 'bold 8px Cairo, sans-serif';
      ctx.textAlign = 'center';

      // Top dimension
      ctx.beginPath(); ctx.moveTo(tl.x, tl.y - dimOff); ctx.lineTo(tl.x + sw, tl.y - dimOff); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tl.x, tl.y - dimOff - 4); ctx.lineTo(tl.x, tl.y - dimOff + 4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tl.x + sw, tl.y - dimOff - 4); ctx.lineTo(tl.x + sw, tl.y - dimOff + 4); ctx.stroke();
      ctx.fillText(`${room.w}`, tl.x + sw / 2, tl.y - dimOff - 5);

      // Left dimension
      ctx.save();
      ctx.translate(tl.x - dimOff, tl.y + sh / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.beginPath(); ctx.moveTo(-sh / 2, 0); ctx.lineTo(sh / 2, 0); ctx.stroke();
      ctx.fillText(`${room.h}`, 0, -5);
      ctx.restore();
    });

    // Title
    ctx.fillStyle = '#9CA3AF';
    ctx.font = 'bold 10px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isEn ? '2D Floor Plan (mm)' : 'مسقط أفقي 2D (مم)', W / 2, H - 8);
  }, [rooms, showLabels, getBounds, isEn]);

  // ═══ 3D RENDER ═══
  const project3D = useCallback((x: number, y: number, z: number, cx: number, cy: number) => {
    const bounds = getBounds();
    const mx = x - (bounds.minX + bounds.maxX) / 2;
    const mz = z - (bounds.minY + bounds.maxY) / 2;

    const radY = (rotY * Math.PI) / 180;
    const radX = (rotX * Math.PI) / 180;
    const rx = mx * Math.cos(radY) - mz * Math.sin(radY);
    const rz = mx * Math.sin(radY) + mz * Math.cos(radY);
    const ry = y * Math.cos(radX) - rz * Math.sin(radX);
    const rz2 = y * Math.sin(radX) + rz * Math.cos(radX);

    return { x: cx + rx * SCALE_3D, y: cy - ry * SCALE_3D, z: rz2 };
  }, [rotY, rotX, getBounds]);

  const draw3D = useCallback(() => {
    const canvas = canvas3dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H * 0.6;

    ctx.clearRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#1a1d23');
    grad.addColorStop(1, '#111318');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const drawPoly = (pts: { x: number; y: number }[], color: string) => {
      ctx.fillStyle = color;
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath(); ctx.fill(); ctx.stroke();
    };

    const shade = (hex: string, f: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)},0.8)`;
    };

    // Floor grid
    const bounds = getBounds();
    ctx.strokeStyle = 'rgba(42,166,118,0.06)';
    ctx.lineWidth = 0.3;
    for (let i = bounds.minX; i <= bounds.maxX; i += 1000) {
      const p1 = project3D(i, 0, bounds.minY, cx, cy);
      const p2 = project3D(i, 0, bounds.maxY, cx, cy);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }
    for (let j = bounds.minY; j <= bounds.maxY; j += 1000) {
      const p1 = project3D(bounds.minX, 0, j, cx, cy);
      const p2 = project3D(bounds.maxX, 0, j, cx, cy);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }

    // Sort rooms by depth
    const sorted = [...rooms].sort((a, b) => {
      const da = project3D(a.x + a.w / 2, 0, a.y + a.h / 2, cx, cy);
      const db = project3D(b.x + b.w / 2, 0, b.y + b.h / 2, cx, cy);
      return db.z - da.z;
    });

    sorted.forEach(room => {
      const wh = room.wallHeight;

      // Floor
      const fp = [
        project3D(room.x, 0, room.y, cx, cy),
        project3D(room.x + room.w, 0, room.y, cx, cy),
        project3D(room.x + room.w, 0, room.y + room.h, cx, cy),
        project3D(room.x, 0, room.y + room.h, cx, cy),
      ];
      drawPoly(fp, shade(room.color, 0.3));

      // 4 wall faces
      const wallFaces = [
        { pts: [
          project3D(room.x, 0, room.y, cx, cy), project3D(room.x + room.w, 0, room.y, cx, cy),
          project3D(room.x + room.w, wh, room.y, cx, cy), project3D(room.x, wh, room.y, cx, cy)], s: 0.6 },
        { pts: [
          project3D(room.x + room.w, 0, room.y, cx, cy), project3D(room.x + room.w, 0, room.y + room.h, cx, cy),
          project3D(room.x + room.w, wh, room.y + room.h, cx, cy), project3D(room.x + room.w, wh, room.y, cx, cy)], s: 0.5 },
        { pts: [
          project3D(room.x + room.w, 0, room.y + room.h, cx, cy), project3D(room.x, 0, room.y + room.h, cx, cy),
          project3D(room.x, wh, room.y + room.h, cx, cy), project3D(room.x + room.w, wh, room.y + room.h, cx, cy)], s: 0.55 },
        { pts: [
          project3D(room.x, 0, room.y + room.h, cx, cy), project3D(room.x, 0, room.y, cx, cy),
          project3D(room.x, wh, room.y, cx, cy), project3D(room.x, wh, room.y + room.h, cx, cy)], s: 0.65 },
      ];
      wallFaces.forEach(wf => drawPoly(wf.pts, shade(room.color, wf.s)));

      // Label
      if (showLabels) {
        const lp = project3D(room.x + room.w / 2, wh + 200, room.y + room.h / 2, cx, cy);
        ctx.fillStyle = '#E8E4D9';
        ctx.font = 'bold 9px Cairo, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(room.label, lp.x, lp.y);

        const area = (room.w / 1000) * (room.h / 1000);
        ctx.font = '7px Cairo, sans-serif';
        ctx.fillStyle = '#9CA3AF';
        ctx.fillText(`${area.toFixed(1)}m\u00B2`, lp.x, lp.y + 12);
      }
    });

    ctx.fillStyle = '#4B5563';
    ctx.font = 'bold 10px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isEn ? '3D View' : 'منظور 3D', W / 2, H - 8);
  }, [rooms, rotY, rotX, showLabels, project3D, getBounds, isEn]);

  useEffect(() => { draw2D(); draw3D(); }, [draw2D, draw3D]);

  const loadTemplate = (t: typeof TEMPLATES[0]) => {
    setRooms(t.rooms.map(r => ({ ...r, id: genId() })));
  };

  return (
    <SimpleToolShell
      title={isEn ? '2D to 3D Converter' : 'محوّل من 2D إلى 3D'}
      subtitle={isEn ? 'Convert floor plans to 3D models' : 'حوّل المخططات الأفقية إلى نماذج ثلاثية'}
      onBack={onBack}
      toolId="convert-2d-3d"
      gradientFrom="#2AA676"
      gradientTo="#1F6F50"
    >
      <div className="space-y-3 p-3" dir="rtl">
        {/* Templates */}
        <div className="flex gap-2 flex-wrap">
          {TEMPLATES.map(t => (
            <button key={t.id} onClick={() => loadTemplate(t)}
              className="bg-white border-[4px] border-gray-200/60 px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#1F3D2B] hover:bg-green-50 hover:border-green-300 transition-all"
              style={{ fontFamily: fontCairo }}>
              {isEn ? t.en : t.ar}
            </button>
          ))}
        </div>

        {/* View Mode */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-0.5">
          {([
            { id: 'split' as const, ar: 'مقسّم', en: 'Split' },
            { id: '2d' as const, ar: '2D', en: '2D' },
            { id: '3d' as const, ar: '3D', en: '3D' },
          ]).map(m => (
            <button key={m.id} onClick={() => setViewMode(m.id)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                viewMode === m.id ? 'bg-white text-[#2AA676] shadow-sm' : 'text-gray-500'
              }`} style={{ fontFamily: fontCairo }}>
              {isEn ? m.en : m.ar}
            </button>
          ))}
        </div>

        {/* Canvases */}
        <div className={viewMode === 'split' ? 'grid grid-cols-2 gap-2' : ''}>
          {(viewMode === 'split' || viewMode === '2d') && (
            <div className="bg-white rounded-2xl border-[4px] border-gray-200/60 shadow-sm overflow-hidden">
              <canvas ref={canvas2dRef} width={viewMode === 'split' ? 180 : 360} height={viewMode === 'split' ? 160 : 250} className="w-full" />
            </div>
          )}
          {(viewMode === 'split' || viewMode === '3d') && (
            <div className="bg-[#111318] rounded-2xl border-[4px] border-gray-700/60 shadow-sm overflow-hidden">
              <canvas ref={canvas3dRef} width={viewMode === 'split' ? 180 : 360} height={viewMode === 'split' ? 160 : 250} className="w-full" />
            </div>
          )}
        </div>

        {/* Rotation */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-gray-500 w-12" style={{ fontFamily: fontCairo }}>{isEn ? 'Angle' : 'زاوية'} Y</span>
            <input type="range" min={0} max={360} value={rotY} onChange={e => setRotY(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to left, #2AA676 ${(rotY/360)*100}%, #E5E7EB ${(rotY/360)*100}%)` }} />
            <span className="text-[9px] text-gray-400 w-7 text-center">{rotY}°</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-gray-500 w-12" style={{ fontFamily: fontCairo }}>{isEn ? 'Tilt' : 'إمالة'} X</span>
            <input type="range" min={5} max={80} value={rotX} onChange={e => setRotX(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to left, #2AA676 ${((rotX-5)/75)*100}%, #E5E7EB ${((rotX-5)/75)*100}%)` }} />
            <span className="text-[9px] text-gray-400 w-7 text-center">{rotX}°</span>
          </div>
        </div>

        {/* Room Wall Heights */}
        {rooms.length > 0 && (
          <div className="bg-white rounded-xl p-3 border-[4px] border-gray-100/60">
            <h4 className="text-[10px] font-bold text-[#1F3D2B] mb-2" style={{ fontFamily: fontCairo }}>
              {isEn ? 'Room Wall Heights' : 'ارتفاع جدران الغرف'}
            </h4>
            <div className="space-y-1.5">
              {rooms.map(r => (
                <div key={r.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: r.color }} />
                  <span className="text-[9px] font-bold text-gray-600 w-16 truncate" style={{ fontFamily: fontCairo }}>{r.label}</span>
                  <input type="range" min={1200} max={4000} step={100} value={r.wallHeight}
                    onChange={e => setRooms(prev => prev.map(rm => rm.id === r.id ? { ...rm, wallHeight: Number(e.target.value) } : rm))}
                    className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to left, ${r.color} ${((r.wallHeight-1200)/2800)*100}%, #E5E7EB ${((r.wallHeight-1200)/2800)*100}%)` }} />
                  <span className="text-[8px] text-gray-400 w-10 text-center">{r.wallHeight}mm</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Options */}
        <div className="flex gap-2">
          <button onClick={() => setShowLabels(l => !l)}
            className={`flex-1 py-2 rounded-xl text-[10px] font-bold ${showLabels ? 'bg-[#2AA676] text-white' : 'bg-gray-100 text-gray-400'}`}
            style={{ fontFamily: fontCairo }}>{isEn ? 'Labels' : 'تسميات'}</button>
          <button onClick={() => setRooms([])}
            className="flex-1 py-2 rounded-xl text-[10px] font-bold bg-red-50 text-red-500"
            style={{ fontFamily: fontCairo }}>{isEn ? 'Clear' : 'مسح'}</button>
        </div>

        <div className="bg-green-50 rounded-xl p-2.5 text-[10px] text-green-700" style={{ fontFamily: fontCairo }}>
          {isEn
            ? 'Choose a template to see 2D plan and 3D model side by side. Adjust wall heights per room.'
            : 'اختر قالباً لرؤية المخطط الأفقي والنموذج ثلاثي الأبعاد جنباً لجنب. عدّل الارتفاعات لكل غرفة.'}
        </div>
      </div>
    </SimpleToolShell>
  );
}