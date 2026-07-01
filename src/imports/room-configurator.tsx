/**
 * room-configurator.tsx
 * مخطط الغرفة التفاعلي — مبني على Canvas بدون مكتبات ثلاثية الأبعاد خارجية
 * No @react-three/fiber | No @react-three/drei | No three.js
 */
import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { Cuboid, LayoutTemplate, Info, Move, MousePointer2, Ruler } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Dimensions {
  width: number;
  length: number;
  height: number;
}

type ViewMode = '2d' | '3d';

// ─── Stats Panel ─────────────────────────────────────────────────────────────
const StatsPanel = ({ dimensions }: { dimensions: Dimensions }) => {
  const area = (dimensions.width * dimensions.length).toFixed(1);
  const volume = (dimensions.width * dimensions.length * dimensions.height).toFixed(1);
  const perimeter = (2 * (dimensions.width + dimensions.length)).toFixed(1);
  const wallArea = (parseFloat(perimeter) * dimensions.height).toFixed(1);

  return (
    <div className="absolute top-20 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 w-56 z-10 select-none">
      <div className="flex items-center gap-2 mb-3 border-b pb-2 border-gray-100">
        <Info size={16} className="text-blue-600" />
        <h3 className="font-bold text-gray-800 text-xs">بيانات الغرفة</h3>
      </div>
      <div className="space-y-2 text-xs">
        {[
          { label: 'المساحة', value: `${area} م²` },
          { label: 'الحجم', value: `${volume} م³` },
          { label: 'المحيط', value: `${perimeter} م` },
          { label: 'مساحة الجدران', value: `${wallArea} م²` },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-gray-500">{label}</span>
            <span className="font-mono font-semibold text-gray-700">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Top Bar ──────────────────────────────────────────────────────────────────
const TopBar = ({ mode, setMode }: { mode: ViewMode; setMode: (m: ViewMode) => void }) => (
  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-xl border border-gray-200 p-1 flex gap-1 z-20">
    {([
      { id: '2d' as ViewMode, icon: LayoutTemplate, label: 'مخطط 2D' },
      { id: '3d' as ViewMode, icon: Cuboid, label: 'منظور 3D' },
    ] as { id: ViewMode; icon: typeof Cuboid; label: string }[]).map(({ id, icon: Icon, label }) => (
      <button
        key={id}
        onClick={() => setMode(id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium ${
          mode === id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Icon size={15} />
        <span>{label}</span>
      </button>
    ))}
  </div>
);

// ─── 2D Canvas Drawing ────────────────────────────────────────────────────────
function draw2D(canvas: HTMLCanvasElement, dim: Dimensions) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cw = rect.width;
  const ch = rect.height;

  // Background
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, cw, ch);

  // Grid
  const gridSize = 30;
  ctx.strokeStyle = 'rgba(148,163,184,0.3)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < cw; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke();
  }
  for (let y = 0; y < ch; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke();
  }

  // Room
  const pad = 80;
  const scale = Math.min((cw - pad * 2) / dim.width, (ch - pad * 2) / dim.length);
  const rw = dim.width * scale;
  const rl = dim.length * scale;
  const ox = (cw - rw) / 2;
  const oy = (ch - rl) / 2;

  // Floor
  ctx.fillStyle = '#e2d9c8';
  ctx.fillRect(ox, oy, rw, rl);

  // Floor tiles pattern
  ctx.strokeStyle = 'rgba(180,160,130,0.4)';
  ctx.lineWidth = 0.5;
  const tileSize = scale * 0.5;
  for (let x = ox; x <= ox + rw; x += tileSize) {
    ctx.beginPath(); ctx.moveTo(x, oy); ctx.lineTo(x, oy + rl); ctx.stroke();
  }
  for (let y = oy; y <= oy + rl; y += tileSize) {
    ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(ox + rw, y); ctx.stroke();
  }

  // Walls
  const wallW = 8;
  ctx.fillStyle = '#334155';
  ctx.fillRect(ox - wallW, oy - wallW, rw + wallW * 2, wallW); // top
  ctx.fillRect(ox - wallW, oy + rl, rw + wallW * 2, wallW);     // bottom
  ctx.fillRect(ox - wallW, oy, wallW, rl);                       // left
  ctx.fillRect(ox + rw, oy, wallW, rl);                          // right

  // Door gap in bottom wall
  const doorW = scale * 0.9;
  ctx.fillStyle = '#e2d9c8';
  ctx.fillRect(ox + rw / 3 - doorW / 2, oy + rl, doorW, wallW);
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(ox + rw / 3 - doorW / 2, oy + rl, doorW, -Math.PI / 2, 0);
  ctx.setLineDash([4, 3]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Window gap in top wall
  const winW = scale * 1.2;
  ctx.fillStyle = '#bfdbfe';
  ctx.fillRect(ox + rw / 2 - winW / 2, oy - wallW, winW, wallW);
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(ox + rw / 2 - winW / 2, oy - wallW / 2);
  ctx.lineTo(ox + rw / 2 + winW / 2, oy - wallW / 2);
  ctx.stroke();

  // Dimensions
  ctx.fillStyle = '#1e40af';
  ctx.font = `bold 12px Cairo, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Width label
  ctx.fillText(`${dim.width} م`, ox + rw / 2, oy - wallW - 14);
  // Length label
  ctx.save();
  ctx.translate(ox - wallW - 20, oy + rl / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(`${dim.length} م`, 0, 0);
  ctx.restore();

  // Area
  ctx.fillStyle = 'rgba(30,64,175,0.4)';
  ctx.font = `bold ${Math.max(14, scale * 0.3)}px Cairo, sans-serif`;
  ctx.fillText(`${(dim.width * dim.length).toFixed(1)} م²`, ox + rw / 2, oy + rl / 2);
}

// ─── 3D Canvas Drawing (isometric) ───────────────────────────────────────────
function draw3D(canvas: HTMLCanvasElement, dim: Dimensions) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cw = rect.width;
  const ch = rect.height;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, cw, ch);

  const scale = Math.min(cw, ch) / (dim.width + dim.length + dim.height) * 0.7;
  const isoX = (x: number, y: number) => (x - y) * Math.cos(Math.PI / 6) * scale;
  const isoY = (x: number, y: number, z: number) => -(z * scale) + (x + y) * Math.sin(Math.PI / 6) * scale;

  const ox = cw / 2;
  const oy = ch * 0.65;

  const W = dim.width;
  const L = dim.length;
  const H = dim.height;

  const pt = (x: number, y: number, z: number) => ({
    x: ox + isoX(x, y),
    y: oy + isoY(x, y, z),
  });

  // Floor
  ctx.beginPath();
  const fl = [pt(0,0,0), pt(W,0,0), pt(W,L,0), pt(0,L,0)];
  ctx.moveTo(fl[0].x, fl[0].y);
  fl.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.closePath();
  ctx.fillStyle = '#d2b48c';
  ctx.fill();
  ctx.strokeStyle = '#a0855a';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Left wall
  ctx.beginPath();
  const lw = [pt(0,0,0), pt(0,L,0), pt(0,L,H), pt(0,0,H)];
  ctx.moveTo(lw[0].x, lw[0].y);
  lw.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.closePath();
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Back wall
  ctx.beginPath();
  const bw = [pt(0,L,0), pt(W,L,0), pt(W,L,H), pt(0,L,H)];
  ctx.moveTo(bw[0].x, bw[0].y);
  bw.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.closePath();
  ctx.fillStyle = '#f1f5f9';
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Ceiling edges (open top)
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  [[pt(0,0,H), pt(W,0,H)], [pt(W,0,H), pt(W,L,H)], [pt(W,0,0), pt(W,0,H)], [pt(W,0,H), pt(W,L,H)]].forEach(([a,b]) => {
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  });
  ctx.setLineDash([]);

  // Dimension labels
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 11px Cairo, sans-serif';
  ctx.textAlign = 'center';
  const midW = pt(W/2, 0, 0);
  ctx.fillText(`${W} م`, midW.x, midW.y + 14);
  const midL = pt(0, L/2, 0);
  ctx.fillText(`${L} م`, midL.x - 20, midL.y);
  const midH = pt(0, 0, H/2);
  ctx.fillText(`${H} م`, midH.x - 22, midH.y);
}

// ─── Main Component ───────────────────────────────────────────────────────────
const RoomConfigurator = () => {
  const [mode, setMode] = useState<ViewMode>('3d');
  const [dim, setDim] = useState<Dimensions>({ width: 4, length: 5, height: 2.8 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  const redraw = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const c = canvasRef.current;
      if (!c) return;
      if (mode === '2d') draw2D(c, dim);
      else draw3D(c, dim);
    });
  }, [mode, dim]);

  useLayoutEffect(() => {
    redraw();
    const ro = new ResizeObserver(redraw);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [redraw]);

  const setDimField = (field: keyof Dimensions, value: number) =>
    setDim(prev => ({ ...prev, [field]: value }));

  return (
    <div className="w-full h-screen bg-slate-100 flex flex-col relative overflow-hidden font-sans" dir="rtl">
      <TopBar mode={mode} setMode={setMode} />
      <StatsPanel dimensions={dim} />

      {/* Controls Panel */}
      <div className="absolute bottom-6 right-6 bg-white/95 p-5 rounded-2xl shadow-xl border border-slate-200 w-64 z-10 backdrop-blur-md">
        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Ruler size={15} className="text-blue-600" /> الأبعاد (متر)
        </h4>
        <div className="space-y-4">
          {([
            { key: 'width' as keyof Dimensions, label: 'العرض', min: 2, max: 12 },
            { key: 'length' as keyof Dimensions, label: 'الطول', min: 2, max: 15 },
            { key: 'height' as keyof Dimensions, label: 'الارتفاع', min: 2, max: 5, step: 0.1 },
          ]).map(({ key, label, min, max, step = 0.5 }) => (
            <div key={key}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">{label}</span>
                <span className="font-mono font-bold text-blue-600">{dim[key]} م</span>
              </div>
              <input
                type="range" min={min} max={max} step={step}
                value={dim[key]}
                onChange={e => setDimField(key, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          ))}
        </div>
      </div>

      <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
    </div>
  );
};

export default RoomConfigurator;
