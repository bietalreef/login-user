import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  ArrowRight, ZoomIn, ZoomOut, Undo2, Redo2, Trash2,
  Grid3X3, ChevronUp, ChevronDown, Eye, RotateCcw,
  Maximize2, Ruler, Pencil, MoreHorizontal, HelpCircle,
  SlidersHorizontal, FileText, Calendar, Hash, Copy, Printer,
  X as XIcon, Layers, Home, LayoutGrid,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon3D } from '../../ui/Icon3D';

const f = 'Cairo, sans-serif';

/* ═══════════════════ TYPES ═══════════════════ */
interface Pt { x: number; y: number }
interface Wall {
  id: string; p1: Pt; p2: Pt; thickness: number;
}
interface Door {
  id: string; wallId: string;
  /** 0-1 position along wall centerline */
  pos: number;
  width: number;
  /** opening direction relative to wall normal */
  flipSide: boolean;
  /** swing left or right from hinge */
  flipSwing: boolean;
}
interface Win {
  id: string; wallId: string;
  pos: number; width: number;
}
interface Furn {
  id: string; x: number; y: number; w: number; h: number;
  rot: number; typeId: string; label: string;
}
interface RoomLabel {
  name: string; height: number; area: number; center: Pt;
}

type Tool = 'select' | 'wall' | 'door' | 'window' | 'pan' | 'erase';

/* ═══════════════════ CATALOG ═══════════════════ */
interface CatItem {
  id: string; ar: string; en: string;
  w: number; h: number; icon: string; cat: string;
}

const CATALOG: CatItem[] = [
  { id:'sofa3', ar:'كنبة 3', en:'3-Seat Sofa', w:2200, h:900, icon:'🛋️', cat:'furniture' },
  { id:'sofa2', ar:'كنبة 2', en:'2-Seat Sofa', w:1600, h:850, icon:'🛋️', cat:'furniture' },
  { id:'sofaL', ar:'كنبة L', en:'L-Sofa', w:2800, h:2000, icon:'🛋️', cat:'furniture' },
  { id:'arm', ar:'كرسي', en:'Armchair', w:800, h:800, icon:'💺', cat:'furniture' },
  { id:'ctable', ar:'طاولة قهوة', en:'Coffee Table', w:1200, h:600, icon:'☕', cat:'furniture' },
  { id:'din4', ar:'طاولة طعام 4', en:'Dining 4P', w:1200, h:900, icon:'🍽️', cat:'furniture' },
  { id:'din6', ar:'طاولة طعام 6', en:'Dining 6P', w:1800, h:900, icon:'🍽️', cat:'furniture' },
  { id:'tv', ar:'وحدة تلفزيون', en:'TV Unit', w:1800, h:400, icon:'📺', cat:'furniture' },
  { id:'shelf', ar:'مكتبة', en:'Bookshelf', w:1200, h:350, icon:'📚', cat:'furniture' },
  { id:'bking', ar:'سرير كينج', en:'King Bed', w:2000, h:2100, icon:'🛏️', cat:'bedroom' },
  { id:'bqueen', ar:'سرير كوين', en:'Queen Bed', w:1600, h:2000, icon:'🛏️', cat:'bedroom' },
  { id:'bsingle', ar:'سرير مفرد', en:'Single Bed', w:1000, h:2000, icon:'🛏️', cat:'bedroom' },
  { id:'ward', ar:'خزانة ملابس', en:'Wardrobe', w:1800, h:600, icon:'🗄️', cat:'bedroom' },
  { id:'night', ar:'كومودينو', en:'Nightstand', w:500, h:400, icon:'🔲', cat:'bedroom' },
  { id:'dresser', ar:'تسريحة', en:'Dresser', w:1200, h:500, icon:'🪞', cat:'bedroom' },
  { id:'desk', ar:'مكتب عمل', en:'Work Desk', w:1400, h:700, icon:'🖥️', cat:'office' },
  { id:'ochair', ar:'كرسي مكتب', en:'Office Chair', w:550, h:550, icon:'🪑', cat:'office' },
  { id:'filing', ar:'خزانة ملفات', en:'Filing', w:400, h:600, icon:'🗄️', cat:'office' },
  { id:'kcounter', ar:'كاونتر', en:'Counter', w:2400, h:600, icon:'🍳', cat:'kitchen' },
  { id:'island', ar:'جزيرة مطبخ', en:'Island', w:1500, h:800, icon:'🏝️', cat:'kitchen' },
  { id:'fridge', ar:'ثلاجة', en:'Fridge', w:700, h:700, icon:'🧊', cat:'kitchen' },
  { id:'stove', ar:'فرن', en:'Stove', w:600, h:600, icon:'🔥', cat:'kitchen' },
  { id:'ksink', ar:'حوض مطبخ', en:'Sink', w:600, h:500, icon:'🚰', cat:'kitchen' },
  { id:'toilet', ar:'مرحاض', en:'Toilet', w:400, h:700, icon:'🚽', cat:'bathroom' },
  { id:'tub', ar:'بانيو', en:'Bathtub', w:800, h:1700, icon:'🛁', cat:'bathroom' },
  { id:'shower', ar:'دش', en:'Shower', w:900, h:900, icon:'🚿', cat:'bathroom' },
  { id:'basin', ar:'حوض', en:'Basin', w:500, h:450, icon:'🧼', cat:'bathroom' },
  { id:'washer', ar:'غسالة', en:'Washer', w:600, h:600, icon:'🫧', cat:'appliance' },
  { id:'ac', ar:'مكيف', en:'AC', w:1000, h:200, icon:'❄️', cat:'appliance' },
];

const CATS = [
  { id:'furniture', ar:'أثاث', en:'Furniture' },
  { id:'bedroom', ar:'غرف نوم', en:'Bedroom' },
  { id:'office', ar:'مكتب', en:'Office' },
  { id:'kitchen', ar:'مطبخ', en:'Kitchen' },
  { id:'bathroom', ar:'حمام', en:'Bathroom' },
  { id:'appliance', ar:'أجهزة', en:'Appliances' },
];

/* ═══════════════════ TEMPLATES ═══════════════════ */
interface Tpl {
  id: string; ar: string; en: string;
  walls: Omit<Wall,'id'>[];
  doors: { wallIdx: number; pos: number; width: number }[];
  windows: { wallIdx: number; pos: number; width: number }[];
  rooms: RoomLabel[];
}
const TPLS: Tpl[] = [
  {
    id:'room1', ar:'غرفة واحدة', en:'Single Room',
    walls: [
      { p1:{x:1000,y:1000}, p2:{x:5867,y:1000}, thickness:200 },
      { p1:{x:5867,y:1000}, p2:{x:5867,y:6955}, thickness:200 },
      { p1:{x:5867,y:6955}, p2:{x:1000,y:6955}, thickness:200 },
      { p1:{x:1000,y:6955}, p2:{x:1000,y:1000}, thickness:200 },
    ],
    doors:[{ wallIdx:2, pos:0.25, width:900 }],
    windows:[{ wallIdx:0, pos:0.5, width:1500 }],
    rooms:[{ name:'Room1', height:2800, area:26.60, center:{x:3434,y:3978} }],
  },
  {
    id:'apt1', ar:'شقة غرفة وصالة', en:'1 BHK',
    walls: [
      { p1:{x:500,y:500}, p2:{x:8500,y:500}, thickness:250 },
      { p1:{x:8500,y:500}, p2:{x:8500,y:7000}, thickness:250 },
      { p1:{x:8500,y:7000}, p2:{x:500,y:7000}, thickness:250 },
      { p1:{x:500,y:7000}, p2:{x:500,y:500}, thickness:250 },
      { p1:{x:4500,y:500}, p2:{x:4500,y:4500}, thickness:150 },
      { p1:{x:4500,y:4500}, p2:{x:8500,y:4500}, thickness:150 },
      { p1:{x:500,y:4500}, p2:{x:2500,y:4500}, thickness:150 },
    ],
    doors:[
      { wallIdx:4, pos:0.6, width:900 },
      { wallIdx:6, pos:0.5, width:800 },
    ],
    windows:[
      { wallIdx:0, pos:0.25, width:1500 },
      { wallIdx:0, pos:0.75, width:1200 },
    ],
    rooms:[
      { name:'Living', height:2800, area:24.0, center:{x:2500,y:2500} },
      { name:'Bedroom', height:2800, area:16.0, center:{x:6500,y:2500} },
      { name:'Kitchen', height:2700, area:12.0, center:{x:1500,y:5750} },
      { name:'Hall', height:2800, area:10.0, center:{x:6500,y:5750} },
    ],
  },
  {
    id:'villa', ar:'فيلا', en:'Villa',
    walls: [
      { p1:{x:500,y:500}, p2:{x:11000,y:500}, thickness:300 },
      { p1:{x:11000,y:500}, p2:{x:11000,y:9000}, thickness:300 },
      { p1:{x:11000,y:9000}, p2:{x:500,y:9000}, thickness:300 },
      { p1:{x:500,y:9000}, p2:{x:500,y:500}, thickness:300 },
      { p1:{x:5500,y:500}, p2:{x:5500,y:5500}, thickness:200 },
      { p1:{x:5500,y:5500}, p2:{x:11000,y:5500}, thickness:200 },
      { p1:{x:500,y:5500}, p2:{x:3500,y:5500}, thickness:200 },
      { p1:{x:3500,y:5500}, p2:{x:3500,y:9000}, thickness:200 },
      { p1:{x:8000,y:5500}, p2:{x:8000,y:9000}, thickness:200 },
    ],
    doors:[
      { wallIdx:4, pos:0.55, width:1000 },
      { wallIdx:7, pos:0.4, width:900 },
      { wallIdx:8, pos:0.4, width:900 },
    ],
    windows:[
      { wallIdx:0, pos:0.25, width:2000 },
      { wallIdx:0, pos:0.75, width:2000 },
      { wallIdx:1, pos:0.3, width:1500 },
    ],
    rooms:[
      { name:'Majlis', height:3200, area:25.0, center:{x:3000,y:3000} },
      { name:'Living', height:3200, area:27.5, center:{x:8250,y:3000} },
      { name:'Kitchen', height:2800, area:10.5, center:{x:2000,y:7250} },
      { name:'Master', height:3000, area:15.75, center:{x:5750,y:7250} },
      { name:'Guest', height:3000, area:10.5, center:{x:9500,y:7250} },
    ],
  },
];

/* ═══════════════════ UTILS ═══════════════════ */
let _uid = 0;
const uid = () => `e${++_uid}_${Date.now().toString(36)}`;
const snap = (v: number, g: number) => Math.round(v / g) * g;
const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** polyfill for roundRect */
const rrect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

/** normalized direction and normal of a wall */
const wallVec = (w: { p1: Pt; p2: Pt }) => {
  const len = dist(w.p1, w.p2);
  if (len < 0.01) return { dx: 1, dy: 0, nx: 0, ny: 1, len };
  const dx = (w.p2.x - w.p1.x) / len;
  const dy = (w.p2.y - w.p1.y) / len;
  return { dx, dy, nx: -dy, ny: dx, len };
};

/** find the nearest endpoint among all walls within radius */
const findNearEndpoint = (pt: Pt, walls: Wall[], radius: number): Pt | null => {
  let best: Pt | null = null;
  let bestD = radius;
  for (const w of walls) {
    for (const p of [w.p1, w.p2]) {
      const d = dist(pt, p);
      if (d < bestD) { bestD = d; best = { ...p }; }
    }
  }
  return best;
};

/** project a point onto a wall segment, return 0-1 parameter */
const projectOnWall = (pt: Pt, w: Wall): { t: number; d: number; closest: Pt } => {
  const v = wallVec(w);
  const t = Math.max(0.05, Math.min(0.95,
    ((pt.x - w.p1.x) * v.dx + (pt.y - w.p1.y) * v.dy) / v.len
  ));
  const closest = { x: lerp(w.p1.x, w.p2.x, t), y: lerp(w.p1.y, w.p2.y, t) };
  return { t, d: dist(pt, closest), closest };
};

/* ═══════════════════ COMPONENT ═══════════════════ */
export function Design2DTool({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  /* ---- state ---- */
  const [walls, setWalls] = useState<Wall[]>([]);
  const [doors, setDoors] = useState<Door[]>([]);
  const [wins, setWins] = useState<Win[]>([]);
  const [furns, setFurns] = useState<Furn[]>([]);
  const [rooms, setRooms] = useState<RoomLabel[]>([]);

  const [tool, setTool] = useState<Tool>('wall');
  const [zoom, setZoom] = useState(0.055);
  const [offset, setOffset] = useState<Pt>({ x: 60, y: 40 });
  const [gridSnap] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showDims, setShowDims] = useState(true);
  const [wallThick, setWallThick] = useState(200);

  const [drawStart, setDrawStart] = useState<Pt | null>(null);
  const [cursor, setCursor] = useState<Pt>({ x: 0, y: 0 });
  const [sel, setSel] = useState<{ type: 'wall' | 'door' | 'win' | 'furn'; id: string } | null>(null);
  const [isPan, setIsPan] = useState(false);
  const [panPrev, setPanPrev] = useState<Pt | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOff, setDragOff] = useState<Pt>({ x: 0, y: 0 });
  const [dragDoorWin, setDragDoorWin] = useState<string | null>(null);

  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogCat, setCatalogCat] = useState('furniture');
  const [showHelp, setShowHelp] = useState(false);

  /* dimensions for property panel */
  const [editDoorWidth, setEditDoorWidth] = useState(900);
  const [showProps, setShowProps] = useState(false);

  /* ---- design report ---- */
  const [showReport, setShowReport] = useState(false);
  const [reportId] = useState(() => `DR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`);

  /* ---- canvas size ---- */
  const [cSize, setCSize] = useState({ w: 400, h: 600 });
  useEffect(() => {
    const onResize = () => {
      if (boxRef.current) {
        const r = boxRef.current.getBoundingClientRect();
        setCSize({ w: Math.floor(r.width), h: Math.floor(r.height) });
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ---- history ---- */
  const histRef = useRef<string[]>([]);
  const histIdx = useRef(-1);
  const pushH = useCallback(() => {
    const snap = JSON.stringify({ walls, doors, wins, furns, rooms });
    histRef.current = histRef.current.slice(0, histIdx.current + 1);
    histRef.current.push(snap);
    histIdx.current++;
  }, [walls, doors, wins, furns, rooms]);

  const restoreH = (idx: number) => {
    const s = JSON.parse(histRef.current[idx]);
    setWalls(s.walls); setDoors(s.doors); setWins(s.wins);
    setFurns(s.furns); setRooms(s.rooms);
    histIdx.current = idx;
  };
  const undo = () => { if (histIdx.current > 0) restoreH(histIdx.current - 1); };
  const redo = () => { if (histIdx.current < histRef.current.length - 1) restoreH(histIdx.current + 1); };

  /* ---- coordinate transforms ---- */
  const w2s = useCallback((p: Pt): Pt => ({ x: p.x * zoom + offset.x, y: p.y * zoom + offset.y }), [zoom, offset]);
  const s2w = useCallback((sx: number, sy: number): Pt => ({ x: (sx - offset.x) / zoom, y: (sy - offset.y) / zoom }), [zoom, offset]);

  /* ═══════════════════ RENDER ═══════════════════ */
  const render = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = cv.width / dpr, H = cv.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    /* background */
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(0, 0, W, H);

    /* ── grid ── */
    if (showGrid) {
      const tl = s2w(0, 0), br = s2w(W, H);
      // fine 100mm
      if (zoom > 0.018) {
        ctx.strokeStyle = '#EAEAEA';
        ctx.lineWidth = 0.4;
        for (let x = snap(tl.x, 100); x <= br.x; x += 100) {
          const sx = w2s({ x, y: 0 }).x;
          ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, H); ctx.stroke();
        }
        for (let y = snap(tl.y, 100); y <= br.y; y += 100) {
          const sy = w2s({ x: 0, y }).y;
          ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(W, sy); ctx.stroke();
        }
      }
      // coarse 1m
      ctx.strokeStyle = '#D5D5D5';
      ctx.lineWidth = 0.6;
      for (let x = snap(tl.x, 1000); x <= br.x; x += 1000) {
        const sx = w2s({ x, y: 0 }).x;
        ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, H); ctx.stroke();
      }
      for (let y = snap(tl.y, 1000); y <= br.y; y += 1000) {
        const sy = w2s({ x: 0, y }).y;
        ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(W, sy); ctx.stroke();
      }
    }

    /* helper: draw wall as filled polygon */
    const drawWallPoly = (w: Wall, highlight: boolean) => {
      const v = wallVec(w);
      const ht = w.thickness / 2;
      const pts = [
        w2s({ x: w.p1.x + v.nx * ht, y: w.p1.y + v.ny * ht }),
        w2s({ x: w.p2.x + v.nx * ht, y: w.p2.y + v.ny * ht }),
        w2s({ x: w.p2.x - v.nx * ht, y: w.p2.y - v.ny * ht }),
        w2s({ x: w.p1.x - v.nx * ht, y: w.p1.y - v.ny * ht }),
      ];
      ctx.fillStyle = highlight ? '#4A5568' : '#5C636B';
      ctx.strokeStyle = highlight ? '#2AA676' : '#3A3F45';
      ctx.lineWidth = highlight ? 2.5 : 1;
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath(); ctx.fill(); ctx.stroke();

      /* endpoint squares */
      for (const ep of [w.p1, w.p2]) {
        const sp = w2s(ep);
        const sz = Math.max(3, 4 * zoom * 40);
        ctx.fillStyle = highlight ? '#2AA676' : '#3A3F45';
        ctx.fillRect(sp.x - sz / 2, sp.y - sz / 2, sz, sz);
      }
    };

    /* ── walls ── */
    walls.forEach(w => drawWallPoly(w, sel?.type === 'wall' && sel.id === w.id));

    /* ── doors ── */
    doors.forEach(door => {
      const w = walls.find(ww => ww.id === door.wallId);
      if (!w) return;
      const v = wallVec(w);
      const cx = lerp(w.p1.x, w.p2.x, door.pos);
      const cy = lerp(w.p1.y, w.p2.y, door.pos);
      const hw = door.width / 2;
      const ht = w.thickness / 2 + 30;
      const isSel = sel?.type === 'door' && sel.id === door.id;

      /* clear wall area for door gap */
      const gap = [
        w2s({ x: cx - v.dx * hw - v.nx * ht, y: cy - v.dy * hw - v.ny * ht }),
        w2s({ x: cx + v.dx * hw - v.nx * ht, y: cy + v.dy * hw - v.ny * ht }),
        w2s({ x: cx + v.dx * hw + v.nx * ht, y: cy + v.dy * hw + v.ny * ht }),
        w2s({ x: cx - v.dx * hw + v.nx * ht, y: cy - v.dy * hw + v.ny * ht }),
      ];
      ctx.fillStyle = '#F5F5F5';
      ctx.beginPath();
      gap.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath(); ctx.fill();

      /* door sill (red/colored bar) */
      const sillSide = door.flipSide ? 1 : -1;
      const sillOff = w.thickness / 2;
      const sill = [
        w2s({ x: cx - v.dx * hw + v.nx * sillOff * sillSide, y: cy - v.dy * hw + v.ny * sillOff * sillSide }),
        w2s({ x: cx + v.dx * hw + v.nx * sillOff * sillSide, y: cy + v.dy * hw + v.ny * sillOff * sillSide }),
        w2s({ x: cx + v.dx * hw + v.nx * (sillOff + 60) * sillSide, y: cy + v.dy * hw + v.ny * (sillOff + 60) * sillSide }),
        w2s({ x: cx - v.dx * hw + v.nx * (sillOff + 60) * sillSide, y: cy - v.dy * hw + v.ny * (sillOff + 60) * sillSide }),
      ];
      ctx.fillStyle = isSel ? '#C0392B' : '#E74C3C';
      ctx.beginPath();
      sill.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath(); ctx.fill();

      /* swing arc */
      const hingeDir = door.flipSwing ? 1 : -1;
      const hinge = {
        x: cx + v.dx * hw * hingeDir,
        y: cy + v.dy * hw * hingeDir,
      };
      const hs = w2s(hinge);
      const arcR = door.width * zoom;
      const wallAng = Math.atan2(v.dy, v.dx);
      const normAng = wallAng + Math.PI / 2 * sillSide;
      const startA = door.flipSwing ? wallAng + Math.PI : wallAng;
      const endA = normAng + (door.flipSwing ? Math.PI : 0);

      ctx.strokeStyle = isSel ? '#C0392B' : '#E74C3C';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(hs.x, hs.y, arcR, startA, endA, door.flipSwing !== door.flipSide);
      ctx.stroke();
      ctx.setLineDash([]);

      /* leaf line */
      const leafEnd = {
        x: hinge.x + v.nx * door.width * sillSide,
        y: hinge.y + v.ny * door.width * sillSide,
      };
      const les = w2s(leafEnd);
      ctx.strokeStyle = isSel ? '#C0392B' : '#E74C3C';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(hs.x, hs.y); ctx.lineTo(les.x, les.y); ctx.stroke();

      /* drag indicator when selected */
      if (isSel) {
        const center = w2s({ x: cx, y: cy });
        const arrowLen = 14;
        const arrAngle = Math.atan2(v.dy, v.dx);
        ctx.fillStyle = '#3B82F6';
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2.5;
        // double arrow along wall
        for (const dir of [-1, 1]) {
          const ex = center.x + Math.cos(arrAngle) * arrowLen * dir;
          const ey = center.y + Math.sin(arrAngle) * arrowLen * dir;
          ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.lineTo(ex, ey); ctx.stroke();
          // arrowhead
          const headA = arrAngle + Math.PI + dir * 0.5;
          const headB = arrAngle + Math.PI - dir * 0.5;
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex + Math.cos(headA) * 5, ey + Math.sin(headA) * 5);
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex + Math.cos(headB) * 5, ey + Math.sin(headB) * 5);
          ctx.stroke();
        }
      }
    });

    /* ── windows ── */
    wins.forEach(win => {
      const w = walls.find(ww => ww.id === win.wallId);
      if (!w) return;
      const v = wallVec(w);
      const cx = lerp(w.p1.x, w.p2.x, win.pos);
      const cy = lerp(w.p1.y, w.p2.y, win.pos);
      const hw = win.width / 2;
      const ht = w.thickness / 2 + 15;
      const isSel = sel?.type === 'win' && sel.id === win.id;

      /* clear gap */
      const gap = [
        w2s({ x: cx - v.dx * hw - v.nx * ht, y: cy - v.dy * hw - v.ny * ht }),
        w2s({ x: cx + v.dx * hw - v.nx * ht, y: cy + v.dy * hw - v.ny * ht }),
        w2s({ x: cx + v.dx * hw + v.nx * ht, y: cy + v.dy * hw + v.ny * ht }),
        w2s({ x: cx - v.dx * hw + v.nx * ht, y: cy - v.dy * hw + v.ny * ht }),
      ];
      ctx.fillStyle = '#F5F5F5';
      ctx.beginPath();
      gap.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath(); ctx.fill();

      /* 3 parallel lines */
      const spacing = w.thickness / 3;
      for (let i = -1; i <= 1; i++) {
        const off = i * spacing;
        const l1 = w2s({ x: cx - v.dx * hw + v.nx * off, y: cy - v.dy * hw + v.ny * off });
        const l2 = w2s({ x: cx + v.dx * hw + v.nx * off, y: cy + v.dy * hw + v.ny * off });
        ctx.strokeStyle = i === 0 ? (isSel ? '#2980B9' : '#3498DB') : (isSel ? '#5DADE2' : '#85C1E9');
        ctx.lineWidth = i === 0 ? 2.5 : 1.2;
        ctx.beginPath(); ctx.moveTo(l1.x, l1.y); ctx.lineTo(l2.x, l2.y); ctx.stroke();
      }

      /* drag indicator */
      if (isSel) {
        const center = w2s({ x: cx, y: cy });
        const arrAngle = Math.atan2(v.dy, v.dx);
        ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 2.5;
        for (const dir of [-1, 1]) {
          const ex = center.x + Math.cos(arrAngle) * 14 * dir;
          const ey = center.y + Math.sin(arrAngle) * 14 * dir;
          ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.lineTo(ex, ey); ctx.stroke();
        }
      }
    });

    /* ── furniture ── */
    furns.forEach(item => {
      const isSel2 = sel?.type === 'furn' && sel.id === item.id;
      ctx.save();
      const c = w2s({ x: item.x + item.w / 2, y: item.y + item.h / 2 });
      ctx.translate(c.x, c.y);
      ctx.rotate((item.rot * Math.PI) / 180);
      const sw = item.w * zoom, sh = item.h * zoom;
      ctx.fillStyle = isSel2 ? 'rgba(42,166,118,0.18)' : 'rgba(200,168,106,0.12)';
      ctx.strokeStyle = isSel2 ? '#2AA676' : '#C8A86A';
      ctx.lineWidth = isSel2 ? 2 : 1;
      ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
      ctx.strokeRect(-sw / 2, -sh / 2, sw, sh);
      // cross lines for identification
      ctx.strokeStyle = isSel2 ? 'rgba(42,166,118,0.3)' : 'rgba(200,168,106,0.2)';
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(-sw/2, -sh/2); ctx.lineTo(sw/2, sh/2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sw/2, -sh/2); ctx.lineTo(-sw/2, sh/2); ctx.stroke();
      if (sw > 25) {
        const fsz = Math.max(7, Math.min(11, sw / 7));
        ctx.fillStyle = '#4A5A6A';
        ctx.font = `bold ${fsz}px Cairo,sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(item.label.slice(0, 12), 0, 0);
      }
      ctx.restore();
    });

    /* ── dimension lines ── */
    if (showDims) {
      walls.forEach(w => {
        const v = wallVec(w);
        if (v.len < 150) return;

        /* outer dimension (from outer face) */
        const outerOff = w.thickness / 2 + 350;
        const drawDimLine = (offsetDist: number, label: string, color: string, bgColor: string) => {
          const p1 = w2s({ x: w.p1.x + v.nx * offsetDist, y: w.p1.y + v.ny * offsetDist });
          const p2 = w2s({ x: w.p2.x + v.nx * offsetDist, y: w.p2.y + v.ny * offsetDist });

          // extension ticks
          const extA = 6;
          ctx.strokeStyle = '#8896A4';
          ctx.lineWidth = 0.6;
          for (const p of [p1, p2]) {
            const a = Math.atan2(v.ny, v.nx);
            ctx.beginPath();
            ctx.moveTo(p.x + Math.cos(a) * extA, p.y + Math.sin(a) * extA);
            ctx.lineTo(p.x - Math.cos(a) * extA, p.y - Math.sin(a) * extA);
            ctx.stroke();
          }

          // dimension line
          ctx.strokeStyle = '#8896A4';
          ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();

          // arrows
          const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
          const arSz = 5;
          for (const [pt, d] of [[p1, 1], [p2, -1]] as const) {
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(pt.x + Math.cos(angle + 2.7) * arSz * d, pt.y + Math.sin(angle + 2.7) * arSz * d);
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(pt.x + Math.cos(angle - 2.7) * arSz * d, pt.y + Math.sin(angle - 2.7) * arSz * d);
            ctx.stroke();
          }

          // label with background
          const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
          ctx.save();
          ctx.translate(mid.x, mid.y);
          let ta = angle;
          if (ta > Math.PI / 2) ta -= Math.PI;
          if (ta < -Math.PI / 2) ta += Math.PI;
          ctx.rotate(ta);

          ctx.font = 'bold 10px Cairo,sans-serif';
          const tw = ctx.measureText(label).width + 8;
          const th = 16;
          ctx.fillStyle = bgColor;
          rrect(ctx, -tw / 2, -th / 2, tw, th, 3);
          ctx.fill();
          ctx.fillStyle = color;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(label, 0, 0);
          ctx.restore();
        };

        // outer dim (full wall length including thickness at corners)
        drawDimLine(outerOff, `${Math.round(v.len)}`, '#F5F5F5', '#4A5568');

        // inner dim (wall length minus thickness)
        const innerLen = Math.max(0, v.len - w.thickness);
        if (innerLen > 100) {
          drawDimLine(-(w.thickness / 2 + 350), `${Math.round(innerLen)}`, 'white', '#2563EB');
        }
      });

      /* side labels on walls (blue rotated badges like Planner 5D) */
      walls.forEach(w => {
        const v = wallVec(w);
        if (v.len < 400) return;
        const mid = { x: (w.p1.x + w.p2.x) / 2, y: (w.p1.y + w.p2.y) / 2 };
        // label on each side of the wall
        for (const side of [1, -1]) {
          const labelOff = w.thickness / 2 + 50;
          const lp = w2s({ x: mid.x + v.nx * labelOff * side, y: mid.y + v.ny * labelOff * side });
          ctx.save();
          ctx.translate(lp.x, lp.y);
          let a = Math.atan2(v.dy, v.dx);
          if (a > Math.PI / 2) a -= Math.PI;
          if (a < -Math.PI / 2) a += Math.PI;
          ctx.rotate(a);
          const txt = `${Math.round(v.len)}`;
          ctx.font = 'bold 8px Cairo,sans-serif';
          const tw2 = ctx.measureText(txt).width + 6;
          ctx.fillStyle = '#2563EB';
          rrect(ctx, -tw2 / 2, -7, tw2, 14, 2);
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(txt, 0, 0);
          ctx.restore();
        }
      });
    }

    /* ── room labels ── */
    rooms.forEach(r => {
      const c = w2s(r.center);
      ctx.fillStyle = '#3C4A5A';
      ctx.font = 'bold 13px Cairo,sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(r.name, c.x, c.y - 18);
      ctx.font = '11px Cairo,sans-serif';
      ctx.fillStyle = '#6B7B8D';
      ctx.fillText(`H=${r.height}`, c.x, c.y);
      ctx.fillText(`S=${r.area.toFixed(2)}m\u00B2`, c.x, c.y + 16);
    });

    /* ── drawing preview ── */
    if (drawStart && tool === 'wall') {
      const v = { x: cursor.x - drawStart.x, y: cursor.y - drawStart.y };
      const len = Math.hypot(v.x, v.y);
      if (len > 10) {
        const dx = v.x / len, dy = v.y / len;
        const nx = -dy, ny = dx;
        const ht = wallThick / 2;
        const pts = [
          w2s({ x: drawStart.x + nx * ht, y: drawStart.y + ny * ht }),
          w2s({ x: cursor.x + nx * ht, y: cursor.y + ny * ht }),
          w2s({ x: cursor.x - nx * ht, y: cursor.y - ny * ht }),
          w2s({ x: drawStart.x - nx * ht, y: drawStart.y - ny * ht }),
        ];
        ctx.fillStyle = 'rgba(42,166,118,0.2)';
        ctx.strokeStyle = '#2AA676';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.setLineDash([]);

        // dimension preview
        const mid = w2s({ x: (drawStart.x + cursor.x) / 2, y: (drawStart.y + cursor.y) / 2 });
        ctx.font = 'bold 12px Cairo,sans-serif';
        ctx.fillStyle = '#2AA676';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(len)} mm`, mid.x, mid.y - 18);

        // angle preview
        const angle = Math.round((Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360);
        ctx.font = '10px Cairo,sans-serif';
        ctx.fillText(`${angle}°`, mid.x, mid.y - 32);
      }
    }

    /* snap cursor crosshair */
    if (tool === 'wall' || tool === 'door' || tool === 'window') {
      const cs = w2s(cursor);
      ctx.strokeStyle = '#2AA676';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cs.x - 15, cs.y); ctx.lineTo(cs.x + 15, cs.y);
      ctx.moveTo(cs.x, cs.y - 15); ctx.lineTo(cs.x, cs.y + 15);
      ctx.stroke();
      ctx.setLineDash([]);
      // snap indicator circle
      ctx.strokeStyle = '#2AA676';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cs.x, cs.y, 4, 0, Math.PI * 2); ctx.stroke();
    }
  }, [walls, doors, wins, furns, rooms, zoom, offset, showGrid, showDims, sel, drawStart, cursor, tool, wallThick, w2s, s2w, isEn]);

  useEffect(() => { render(); }, [render, cSize]);

  /* ═══════════════════ EVENTS ═══════════════════ */
  const getPos = (e: React.MouseEvent | React.TouchEvent): Pt => {
    const cv = canvasRef.current;
    if (!cv) return { x: 0, y: 0 };
    const r = cv.getBoundingClientRect();
    if ('touches' in e && e.touches.length > 0) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
    if ('clientX' in e) return { x: (e as React.MouseEvent).clientX - r.left, y: (e as React.MouseEvent).clientY - r.top };
    return { x: 0, y: 0 };
  };

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e);
    const raw = s2w(pos.x, pos.y);
    const snapped = { x: snap(raw.x, gridSnap), y: snap(raw.y, gridSnap) };

    if (tool === 'pan') {
      setIsPan(true); setPanPrev(pos); return;
    }

    if (tool === 'wall') {
      if (!drawStart) {
        // snap to existing endpoint
        const ep = findNearEndpoint(snapped, walls, 300);
        setDrawStart(ep || snapped);
      } else {
        // snap end to existing endpoint
        const ep = findNearEndpoint(snapped, walls, 300);
        const end = ep || snapped;
        const nw: Wall = { id: uid(), p1: drawStart, p2: end, thickness: wallThick };
        if (dist(nw.p1, nw.p2) > 50) {
          setWalls(prev => [...prev, nw]);
          pushH();
        }
        // check if closed to starting point → stop, else chain
        const startSnap = findNearEndpoint(end, walls, 200);
        if (startSnap && dist(startSnap, end) < 200 && walls.length >= 2) {
          setDrawStart(null);
        } else {
          setDrawStart(end);
        }
      }
      return;
    }

    if (tool === 'door' || tool === 'window') {
      let bestW: Wall | null = null, bestD = 500, bestT = 0.5;
      walls.forEach(w => {
        const p = projectOnWall(raw, w);
        if (p.d < bestD) { bestD = p.d; bestW = w; bestT = p.t; }
      });
      if (bestW) {
        if (tool === 'door') {
          const nd: Door = { id: uid(), wallId: bestW!.id, pos: bestT, width: editDoorWidth, flipSide: false, flipSwing: false };
          setDoors(prev => [...prev, nd]);
          setSel({ type: 'door', id: nd.id });
        } else {
          const nw2: Win = { id: uid(), wallId: bestW!.id, pos: bestT, width: 1500 };
          setWins(prev => [...prev, nw2]);
          setSel({ type: 'win', id: nw2.id });
        }
        pushH();
      }
      return;
    }

    if (tool === 'select') {
      // check doors
      for (const d of doors) {
        const w = walls.find(ww => ww.id === d.wallId);
        if (!w) continue;
        const cx = lerp(w.p1.x, w.p2.x, d.pos);
        const cy = lerp(w.p1.y, w.p2.y, d.pos);
        if (dist(raw, { x: cx, y: cy }) < d.width / 2 + 200) {
          setSel({ type: 'door', id: d.id }); setDragDoorWin(d.id);
          setShowProps(true); setEditDoorWidth(d.width);
          return;
        }
      }
      // check windows
      for (const win of wins) {
        const w = walls.find(ww => ww.id === win.wallId);
        if (!w) continue;
        const cx = lerp(w.p1.x, w.p2.x, win.pos);
        const cy = lerp(w.p1.y, w.p2.y, win.pos);
        if (dist(raw, { x: cx, y: cy }) < win.width / 2 + 200) {
          setSel({ type: 'win', id: win.id }); setDragDoorWin(win.id);
          setShowProps(true);
          return;
        }
      }
      // check furniture
      const cf = [...furns].reverse().find(it =>
        raw.x >= it.x && raw.x <= it.x + it.w && raw.y >= it.y && raw.y <= it.y + it.h
      );
      if (cf) {
        setSel({ type: 'furn', id: cf.id }); setDragId(cf.id);
        setDragOff({ x: raw.x - cf.x, y: raw.y - cf.y });
        return;
      }
      // check walls
      const cw = walls.find(w => {
        const p = projectOnWall(raw, w);
        return p.d < w.thickness;
      });
      if (cw) { setSel({ type: 'wall', id: cw.id }); setShowProps(true); }
      else { setSel(null); setShowProps(false); }
      return;
    }

    if (tool === 'erase') {
      // same hit-test order: doors, windows, furniture, walls
      for (const d of doors) {
        const w = walls.find(ww => ww.id === d.wallId);
        if (!w) continue;
        const cx = lerp(w.p1.x, w.p2.x, d.pos);
        const cy = lerp(w.p1.y, w.p2.y, d.pos);
        if (dist(raw, { x: cx, y: cy }) < d.width / 2 + 200) {
          setDoors(prev => prev.filter(dd => dd.id !== d.id)); pushH(); return;
        }
      }
      for (const wi of wins) {
        const w = walls.find(ww => ww.id === wi.wallId);
        if (!w) continue;
        const cx = lerp(w.p1.x, w.p2.x, wi.pos);
        const cy = lerp(w.p1.y, w.p2.y, wi.pos);
        if (dist(raw, { x: cx, y: cy }) < wi.width / 2 + 200) {
          setWins(prev => prev.filter(ww => ww.id !== wi.id)); pushH(); return;
        }
      }
      const cf2 = [...furns].reverse().find(it =>
        raw.x >= it.x && raw.x <= it.x + it.w && raw.y >= it.y && raw.y <= it.y + it.h
      );
      if (cf2) { setFurns(prev => prev.filter(ff => ff.id !== cf2.id)); pushH(); return; }
      const cw2 = walls.find(w => projectOnWall(raw, w).d < w.thickness);
      if (cw2) {
        setWalls(prev => prev.filter(ww => ww.id !== cw2.id));
        setDoors(prev => prev.filter(d => d.wallId !== cw2.id));
        setWins(prev => prev.filter(w => w.wallId !== cw2.id));
        pushH();
      }
    }
  };

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e);
    const raw = s2w(pos.x, pos.y);
    const snapped = { x: snap(raw.x, gridSnap), y: snap(raw.y, gridSnap) };

    // snap to existing endpoint when drawing walls
    if (tool === 'wall') {
      const ep = findNearEndpoint(snapped, walls, 300);
      setCursor(ep || snapped);
    } else {
      setCursor(snapped);
    }

    if (isPan && panPrev) {
      setOffset(prev => ({ x: prev.x + pos.x - panPrev.x, y: prev.y + pos.y - panPrev.y }));
      setPanPrev(pos);
      return;
    }

    // drag door/window along wall
    if (dragDoorWin) {
      const door = doors.find(d => d.id === dragDoorWin);
      if (door) {
        const w = walls.find(ww => ww.id === door.wallId);
        if (w) {
          const p = projectOnWall(raw, w);
          setDoors(prev => prev.map(d => d.id === dragDoorWin ? { ...d, pos: p.t } : d));
        }
        return;
      }
      const win = wins.find(wi => wi.id === dragDoorWin);
      if (win) {
        const w = walls.find(ww => ww.id === win.wallId);
        if (w) {
          const p = projectOnWall(raw, w);
          setWins(prev => prev.map(wi2 => wi2.id === dragDoorWin ? { ...wi2, pos: p.t } : wi2));
        }
        return;
      }
    }

    // drag furniture
    if (dragId) {
      setFurns(prev => prev.map(it =>
        it.id === dragId ? { ...it, x: snap(raw.x - dragOff.x, gridSnap), y: snap(raw.y - dragOff.y, gridSnap) } : it
      ));
    }
  };

  const onUp = () => {
    if (isPan) { setIsPan(false); setPanPrev(null); }
    if (dragId) { setDragId(null); pushH(); }
    if (dragDoorWin) { setDragDoorWin(null); pushH(); }
  };

  /* pinch zoom */
  const lastPinch = useRef(0);
  const onTouchMove2 = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (lastPinch.current > 0) {
        const factor = d / lastPinch.current;
        setZoom(z => Math.min(0.25, Math.max(0.008, z * factor)));
      }
      lastPinch.current = d;
      return;
    }
    onMove(e);
  };
  const onTouchEnd2 = () => { lastPinch.current = 0; onUp(); };

  /* ── zoom buttons ── */
  const zoomIn = () => setZoom(z => Math.min(0.25, z * 1.3));
  const zoomOut = () => setZoom(z => Math.max(0.008, z / 1.3));
  const resetView = () => { setZoom(0.055); setOffset({ x: 60, y: 40 }); };

  /* ── templates ── */
  const loadTpl = (t: Tpl) => {
    const nw = t.walls.map(w => ({ ...w, id: uid() }));
    setWalls(nw);
    setDoors(t.doors.map(d => ({
      id: uid(), wallId: nw[d.wallIdx]?.id || '', pos: d.pos, width: d.width,
      flipSide: false, flipSwing: false,
    })));
    setWins(t.windows.map(w => ({
      id: uid(), wallId: nw[w.wallIdx]?.id || '', pos: w.pos, width: w.width,
    })));
    setFurns([]);
    setRooms(t.rooms);
    setSel(null); setDrawStart(null); setShowProps(false);
    pushH();
  };

  /* ── add furniture ── */
  const addFurn = (c: CatItem) => {
    const center = s2w(cSize.w / 2, cSize.h / 2);
    const nf: Furn = {
      id: uid(), x: snap(center.x - c.w / 2, gridSnap), y: snap(center.y - c.h / 2, gridSnap),
      w: c.w, h: c.h, rot: 0, typeId: c.id, label: isEn ? c.en : c.ar,
    };
    setFurns(prev => [...prev, nf]);
    setSel({ type: 'furn', id: nf.id });
    setTool('select'); setCatalogOpen(false); pushH();
  };

  /* ── selected actions ── */
  const deleteSel = () => {
    if (!sel) return;
    if (sel.type === 'wall') {
      setWalls(p => p.filter(w => w.id !== sel.id));
      setDoors(p => p.filter(d => d.wallId !== sel.id));
      setWins(p => p.filter(w => w.wallId !== sel.id));
    } else if (sel.type === 'door') setDoors(p => p.filter(d => d.id !== sel.id));
    else if (sel.type === 'win') setWins(p => p.filter(w => w.id !== sel.id));
    else if (sel.type === 'furn') setFurns(p => p.filter(f2 => f2.id !== sel.id));
    setSel(null); setShowProps(false); pushH();
  };

  const rotateSel = () => {
    if (sel?.type === 'furn') {
      setFurns(p => p.map(it => it.id === sel.id ? { ...it, rot: (it.rot + 90) % 360, w: it.h, h: it.w } : it));
      pushH();
    }
  };

  const flipDoor = () => {
    if (sel?.type === 'door') {
      setDoors(p => p.map(d => d.id === sel.id ? { ...d, flipSide: !d.flipSide } : d));
      pushH();
    }
  };

  const flipDoorSwing = () => {
    if (sel?.type === 'door') {
      setDoors(p => p.map(d => d.id === sel.id ? { ...d, flipSwing: !d.flipSwing } : d));
      pushH();
    }
  };

  const updateDoorWidth = (w: number) => {
    if (sel?.type === 'door') {
      setDoors(p => p.map(d => d.id === sel.id ? { ...d, width: w } : d));
      setEditDoorWidth(w);
      pushH();
    }
  };

  const clearAll = () => {
    setWalls([]); setDoors([]); setWins([]); setFurns([]); setRooms([]);
    setSel(null); setDrawStart(null); setShowProps(false);
  };

  /* ── generate design report ── */
  const generateReport = useCallback(() => {
    const totalWallLength = walls.reduce((sum, w) => sum + dist(w.p1, w.p2), 0);
    const totalArea = rooms.reduce((sum, r) => sum + r.area, 0);
    const now = new Date();
    const dateStr = now.toLocaleDateString('ar-AE', {
      year: 'numeric', month: 'long', day: 'numeric',
      weekday: 'long',
    });
    const timeStr = now.toLocaleTimeString('ar-AE', {
      hour: '2-digit', minute: '2-digit',
    });
    return {
      id: reportId,
      date: dateStr,
      time: timeStr,
      wallsCount: walls.length,
      doorsCount: doors.length,
      windowsCount: wins.length,
      furnitureCount: furns.length,
      roomsCount: rooms.length,
      totalWallLength: Math.round(totalWallLength),
      totalArea: totalArea.toFixed(2),
      rooms: rooms.map(r => ({
        name: r.name,
        area: r.area.toFixed(2),
        height: r.height,
      })),
      furniture: furns.map(fi => ({
        label: fi.label,
        width: fi.w,
        height: fi.h,
      })),
      wallDetails: walls.map(w => ({
        length: Math.round(dist(w.p1, w.p2)),
        thickness: w.thickness,
      })),
    };
  }, [walls, doors, wins, furns, rooms, reportId]);

  /* ── tool list ── */
  const TOOLS: { id: Tool; icon: string; ar: string; en: string }[] = [
    { id: 'select', icon: '👆', ar: 'تحديد', en: 'Select' },
    { id: 'wall', icon: '🧱', ar: 'جدار', en: 'Wall' },
    { id: 'door', icon: '🚪', ar: 'باب', en: 'Door' },
    { id: 'window', icon: '🪟', ar: 'نافذة', en: 'Window' },
    { id: 'pan', icon: '✋', ar: 'تحريك', en: 'Pan' },
    { id: 'erase', icon: '🗑️', ar: 'مسح', en: 'Erase' },
  ];

  /* selected item info for floating toolbar */
  const selScreenPos = useCallback((): Pt | null => {
    if (!sel) return null;
    if (sel.type === 'wall') {
      const w = walls.find(ww => ww.id === sel.id);
      if (!w) return null;
      return w2s({ x: (w.p1.x + w.p2.x) / 2, y: Math.min(w.p1.y, w.p2.y) - 500 });
    }
    if (sel.type === 'door') {
      const d = doors.find(dd => dd.id === sel.id);
      if (!d) return null;
      const w = walls.find(ww => ww.id === d.wallId);
      if (!w) return null;
      const cx = lerp(w.p1.x, w.p2.x, d.pos);
      const cy = lerp(w.p1.y, w.p2.y, d.pos);
      return w2s({ x: cx, y: cy - 600 });
    }
    if (sel.type === 'win') {
      const wi = wins.find(ww => ww.id === sel.id);
      if (!wi) return null;
      const w = walls.find(ww => ww.id === wi.wallId);
      if (!w) return null;
      const cx = lerp(w.p1.x, w.p2.x, wi.pos);
      const cy = lerp(w.p1.y, w.p2.y, wi.pos);
      return w2s({ x: cx, y: cy - 600 });
    }
    if (sel.type === 'furn') {
      const it = furns.find(ff => ff.id === sel.id);
      if (!it) return null;
      return w2s({ x: it.x + it.w / 2, y: it.y - 300 });
    }
    return null;
  }, [sel, walls, doors, wins, furns, w2s]);

  return (
    <div className="fixed inset-0 bg-[#F5F5F5] flex flex-col z-50" dir="rtl">
      {/* ═══ HEADER ═══ */}
      <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between shrink-0"
        style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-lg"><ArrowRight className="w-5 h-5 text-[#4A5A6A]" /></button>
          <h1 className="text-[#1F3D2B] text-sm font-bold" style={{ fontFamily: f }}>{isEn ? '2D Floor Plan' : 'مخطط ثنائي الأبعاد'}</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <span className="bg-white shadow-sm text-[#E74C3C] px-2 py-0.5 rounded text-[10px] font-bold" style={{ fontFamily: f }}>2D</span>
            <span className="text-gray-400 px-2 py-0.5 rounded text-[10px] font-bold" style={{ fontFamily: f }}>3D</span>
          </div>
          <span className="bg-gray-100 text-[10px] font-bold px-2 py-1 rounded-lg text-[#4A5A6A]" style={{ fontFamily: f }}>1F</span>
          <button onClick={() => setShowReport(true)} className="p-1 hover:bg-green-50 rounded-lg" title={isEn ? 'Design Report' : 'تقرير التصميم'}>
            <FileText className="w-4 h-4 text-[#2AA676]" />
          </button>
          <button onClick={() => setShowHelp(h => !h)} className="p-1 hover:bg-gray-100 rounded-lg">
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* ═══ TEMPLATES ═══ */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-3 py-1.5 flex gap-2 overflow-x-auto shrink-0">
        {TPLS.map(t => (
          <button key={t.id} onClick={() => loadTpl(t)}
            className="whitespace-nowrap bg-white border-[4px] border-gray-200/60 px-3 py-1 rounded-lg text-[10px] font-bold text-[#1F3D2B] hover:border-[#2AA676] hover:bg-green-50 shrink-0"
            style={{ fontFamily: f }}>{isEn ? t.en : t.ar}</button>
        ))}
        <button onClick={clearAll} className="whitespace-nowrap bg-red-50 border-[4px] border-red-200/60 px-3 py-1 rounded-lg text-[10px] font-bold text-red-500 shrink-0"
          style={{ fontFamily: f }}>{isEn ? 'Clear All' : 'مسح الكل'}</button>
      </div>

      {/* ═══ TOOL BAR ═══ */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 px-2 py-1 flex gap-1 shrink-0 overflow-x-auto">
        {TOOLS.map(t => (
          <button key={t.id} onClick={() => { setTool(t.id); if (t.id !== 'wall') setDrawStart(null); }}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap shrink-0 transition-all ${
              tool === t.id ? 'bg-[#2AA676] text-white shadow-md border-[4px] border-[#238c63]/30' : 'bg-gray-50 text-[#4A5A6A] border-[4px] border-gray-200/60'
            }`} style={{ fontFamily: f }}>
            <span className="text-sm">{t.icon}</span>{isEn ? t.en : t.ar}
          </button>
        ))}
        {tool === 'wall' && (
          <div className="flex items-center gap-1 px-1.5 shrink-0">
            <span className="text-[9px] text-gray-400" style={{ fontFamily: f }}>{isEn ? 'T:' : 'س:'}</span>
            <select value={wallThick} onChange={e => setWallThick(+e.target.value)}
              className="text-[10px] bg-gray-50 border-[4px] border-gray-200/60 rounded px-1 py-0.5 text-[#1F3D2B] font-bold">
              {[100, 150, 200, 250, 300].map(v => <option key={v} value={v}>{v}mm</option>)}
            </select>
          </div>
        )}
        {drawStart && (
          <button onClick={() => setDrawStart(null)}
            className="px-2 py-1.5 bg-red-50 text-red-500 border-[4px] border-red-200/60 rounded-lg text-[10px] font-bold whitespace-nowrap shrink-0"
            style={{ fontFamily: f }}>{isEn ? 'End' : 'إنهاء'}</button>
        )}
      </div>

      {/* ═══ CANVAS ═══ */}
      <div ref={boxRef} className="flex-1 relative overflow-hidden touch-none"
        style={{ cursor: tool === 'pan' ? (isPan ? 'grabbing' : 'grab') : tool === 'wall' ? 'crosshair' : tool === 'erase' ? 'not-allowed' : 'default' }}>
        <canvas ref={canvasRef}
          width={cSize.w * (window.devicePixelRatio || 1)}
          height={cSize.h * (window.devicePixelRatio || 1)}
          style={{ width: cSize.w, height: cSize.h }}
          onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
          onTouchStart={onDown} onTouchMove={onTouchMove2} onTouchEnd={onTouchEnd2}
        />

        {/* ─── Side buttons ─── */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          <button onClick={zoomIn} className="w-8 h-8 bg-white rounded-xl shadow border-[4px] border-gray-200/60 flex items-center justify-center"><ZoomIn className="w-3.5 h-3.5 text-[#4A5A6A]" /></button>
          <button onClick={zoomOut} className="w-8 h-8 bg-white rounded-xl shadow border-[4px] border-gray-200/60 flex items-center justify-center"><ZoomOut className="w-3.5 h-3.5 text-[#4A5A6A]" /></button>
          <button onClick={resetView} className="w-8 h-8 bg-white rounded-xl shadow border-[4px] border-gray-200/60 flex items-center justify-center"><Maximize2 className="w-3.5 h-3.5 text-[#4A5A6A]" /></button>
          <div className="h-px bg-gray-200 mx-0.5 my-0.5" />
          <button onClick={() => setShowGrid(g => !g)} className={`w-8 h-8 rounded-xl shadow border-[4px] flex items-center justify-center ${showGrid ? 'bg-[#2AA676] border-[#2AA676]/50 text-white' : 'bg-white border-gray-200/60 text-[#4A5A6A]'}`}><Grid3X3 className="w-3.5 h-3.5" /></button>
          <button onClick={() => setShowDims(d => !d)} className={`w-8 h-8 rounded-xl shadow border-[4px] flex items-center justify-center ${showDims ? 'bg-[#2AA676] border-[#2AA676]/50 text-white' : 'bg-white border-gray-200/60 text-[#4A5A6A]'}`}><Eye className="w-3.5 h-3.5" /></button>
        </div>

        {/* undo / redo */}
        <div className="absolute left-2 bottom-2 flex flex-col gap-1">
          <button onClick={undo} className="w-8 h-8 bg-white rounded-xl shadow border-[4px] border-gray-200/60 flex items-center justify-center"><Undo2 className="w-3.5 h-3.5 text-[#4A5A6A]" /></button>
          <button onClick={redo} className="w-8 h-8 bg-white rounded-xl shadow border-[4px] border-gray-200/60 flex items-center justify-center"><Redo2 className="w-3.5 h-3.5 text-[#4A5A6A]" /></button>
        </div>

        {/* ── Floating toolbar on selection ── */}
        {sel && (() => {
          const sp = selScreenPos();
          if (!sp) return null;
          const x = Math.max(40, Math.min(cSize.w - 140, sp.x - 70));
          const y = Math.max(8, Math.min(cSize.h - 50, sp.y));
          return (
            <div className="absolute z-30 flex items-center gap-0.5 bg-white rounded-xl shadow-lg border-[4px] border-gray-200/60 px-1 py-0.5"
              style={{ left: x, top: y }}>
              {sel.type === 'door' && (
                <>
                  <button onClick={flipDoor} className="p-1.5 hover:bg-gray-100 rounded-lg" title={isEn ? 'Flip side' : 'عكس الجانب'}>
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#4A5A6A]" />
                  </button>
                  <button onClick={flipDoorSwing} className="p-1.5 hover:bg-gray-100 rounded-lg" title={isEn ? 'Flip swing' : 'عكس الفتح'}>
                    <RotateCcw className="w-3.5 h-3.5 text-[#4A5A6A]" />
                  </button>
                </>
              )}
              {sel.type === 'furn' && (
                <button onClick={rotateSel} className="p-1.5 hover:bg-gray-100 rounded-lg" title={isEn ? 'Rotate' : 'تدوير'}>
                  <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
                </button>
              )}
              <button onClick={() => setShowProps(p2 => !p2)} className="p-1.5 hover:bg-gray-100 rounded-lg" title={isEn ? 'Properties' : 'خصائص'}>
                <Ruler className="w-3.5 h-3.5 text-[#4A5A6A]" />
              </button>
              <button onClick={() => {}} className="p-1.5 hover:bg-gray-100 rounded-lg" title={isEn ? 'Edit' : 'تعديل'}>
                <Pencil className="w-3.5 h-3.5 text-[#4A5A6A]" />
              </button>
              <button onClick={deleteSel} className="p-1.5 hover:bg-red-50 rounded-lg" title={isEn ? 'Delete' : 'حذف'}>
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                <MoreHorizontal className="w-3.5 h-3.5 text-[#4A5A6A]" />
              </button>
            </div>
          );
        })()}

        {/* properties panel */}
        <AnimatePresence>
          {showProps && sel && (
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="absolute right-2 top-2 bg-white rounded-xl shadow-lg border-[4px] border-gray-200/60 p-3 w-44 z-30 space-y-2"
            >
              <h4 className="text-[10px] font-bold text-[#1F3D2B]" style={{ fontFamily: f }}>
                {sel.type === 'wall' ? (isEn ? 'Wall Properties' : 'خصائص الجدار') :
                 sel.type === 'door' ? (isEn ? 'Door Properties' : 'خصائص الباب') :
                 sel.type === 'win' ? (isEn ? 'Window Properties' : 'خصائص النافذة') :
                 (isEn ? 'Furniture' : 'أثاث')}
              </h4>

              {sel.type === 'wall' && (() => {
                const w = walls.find(ww => ww.id === sel.id);
                if (!w) return null;
                const v = wallVec(w);
                return (
                  <div className="space-y-1.5 text-[9px] text-gray-600" style={{ fontFamily: f }}>
                    <p>{isEn ? 'Length' : 'الطول'}: <strong>{Math.round(v.len)} mm</strong></p>
                    <p>{isEn ? 'Inner' : 'داخلي'}: <strong>{Math.round(v.len - w.thickness)} mm</strong></p>
                    <p>{isEn ? 'Thickness' : 'السماكة'}: <strong>{w.thickness} mm</strong></p>
                    <p>{isEn ? 'Angle' : 'الزاوية'}: <strong>{Math.round((Math.atan2(v.dy, v.dx) * 180 / Math.PI + 360) % 360)}°</strong></p>
                  </div>
                );
              })()}

              {sel.type === 'door' && (() => {
                const d = doors.find(dd => dd.id === sel.id);
                if (!d) return null;
                return (
                  <div className="space-y-2" style={{ fontFamily: f }}>
                    <div>
                      <label className="text-[9px] text-gray-500 block mb-0.5">{isEn ? 'Width' : 'العرض'}</label>
                      <div className="flex gap-1">
                        {[700, 800, 900, 1000, 1200].map(w2 => (
                          <button key={w2} onClick={() => updateDoorWidth(w2)}
                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${d.width === w2 ? 'bg-[#2AA676] text-white' : 'bg-gray-100 text-gray-600'}`}>
                            {w2}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={flipDoor} className="flex-1 py-1 bg-gray-50 border-[4px] border-gray-200/60 rounded text-[9px] font-bold text-gray-600">
                        {isEn ? 'Flip Side' : 'عكس الجانب'}
                      </button>
                      <button onClick={flipDoorSwing} className="flex-1 py-1 bg-gray-50 border-[4px] border-gray-200/60 rounded text-[9px] font-bold text-gray-600">
                        {isEn ? 'Flip Swing' : 'عكس الفتح'}
                      </button>
                    </div>
                    <p className="text-[8px] text-gray-400">{isEn ? 'Drag the door along the wall to move it' : 'اسحب الباب على الجدار لتحريكه'}</p>
                  </div>
                );
              })()}

              {sel.type === 'win' && (() => {
                const wi = wins.find(ww => ww.id === sel.id);
                if (!wi) return null;
                return (
                  <div className="space-y-2" style={{ fontFamily: f }}>
                    <div>
                      <label className="text-[9px] text-gray-500 block mb-0.5">{isEn ? 'Width' : 'العرض'}</label>
                      <div className="flex gap-1">
                        {[800, 1000, 1200, 1500, 2000].map(w2 => (
                          <button key={w2} onClick={() => { setWins(p => p.map(w3 => w3.id === sel.id ? { ...w3, width: w2 } : w3)); pushH(); }}
                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${wi.width === w2 ? 'bg-[#3498DB] text-white' : 'bg-gray-100 text-gray-600'}`}>
                            {w2}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[8px] text-gray-400">{isEn ? 'Drag the window along the wall' : 'اسحب النافذة على الجدار لتحريكها'}</p>
                  </div>
                );
              })()}

              <button onClick={() => setShowProps(false)} className="w-full py-1 bg-gray-100 rounded-lg text-[9px] font-bold text-gray-500" style={{ fontFamily: f }}>
                {isEn ? 'Close' : 'إغلاق'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help overlay */}
        <AnimatePresence>
          {showHelp && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
              onClick={() => setShowHelp(false)}>
              <div className="bg-white rounded-2xl p-5 max-w-xs text-right space-y-2" onClick={e => e.stopPropagation()}>
                <h3 className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily: f }}>{isEn ? 'How to Use' : 'كيفية الاستخدام'}</h3>
                <div className="text-[10px] text-gray-600 space-y-1" style={{ fontFamily: f }}>
                  <p>🧱 {isEn ? 'Wall: tap start point → tap end point. Chain walls by continuing.' : 'جدار: انقر نقطة البداية ← انقر نقطة النهاية. تسلسل الجدران بالاستمرار.'}</p>
                  <p>🚪 {isEn ? 'Door: select tool → tap on a wall. Use Select to drag it.' : 'باب: اختر الأداة ← انقر على جدار. استخدم التحديد لسحبه.'}</p>
                  <p>🪟 {isEn ? 'Window: select tool → tap on a wall. Drag to move.' : 'نافذة: اختر الأداة ← انقر على جدار. اسحب للتحريك.'}</p>
                  <p>👆 {isEn ? 'Select: tap element → floating toolbar appears. Drag doors/windows along walls.' : 'تحديد: انقر على عنصر ← يظهر شريط أدوات عائم. اسحب الأبواب/النوافذ على الجدران.'}</p>
                  <p>✋ {isEn ? 'Pan: drag canvas. Pinch to zoom.' : 'تحريك: اسحب اللوحة. ضم الأصابع للتكبير.'}</p>
                  <p>📐 {isEn ? 'Dimensions: outer (gray) + inner (blue) auto-displayed.' : 'الأبعاد: خارجية (رمادي) + داخلية (أزرق) تظهر تلقائياً.'}</p>
                </div>
                <button onClick={() => setShowHelp(false)} className="w-full py-1.5 bg-[#2AA676] text-white rounded-xl text-[11px] font-bold" style={{ fontFamily: f }}>
                  {isEn ? 'Got it!' : 'فهمت!'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* status bar */}
        <div className="absolute right-2 bottom-2 bg-white/90 rounded-lg px-2 py-1 shadow-sm border-[4px] border-gray-200/60">
          <span className="text-[8px] text-[#7B8794] font-bold" style={{ fontFamily: f }}>
            {walls.length}W {doors.length}D {wins.length}Win {furns.length}F | {Math.round(zoom * 1000)}%
          </span>
        </div>

        {/* ═══ DESIGN REPORT MODAL ═══ */}
        <AnimatePresence>
          {showReport && (() => {
            const report = generateReport();
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 z-50 flex items-start justify-center pt-4 pb-4 px-3 overflow-y-auto"
                onClick={() => setShowReport(false)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="bg-white rounded-3xl shadow-2xl w-full max-w-md border-[4px] border-[#2AA676]/30 overflow-hidden"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Report Header */}
                  <div className="bg-gradient-to-l from-[#1F3D2B] to-[#2AA676] p-5 relative overflow-hidden">
                    <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />
                    <div className="absolute -bottom-8 -right-4 w-20 h-20 bg-white/5 rounded-full" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon3D icon={FileText} theme="green" size="md" hoverable={false} />
                        <div>
                          <h2 className="text-white text-base font-extrabold" style={{ fontFamily: f }}>
                            {isEn ? 'Design Report' : 'تقرير التصميم'}
                          </h2>
                          <p className="text-white/60 text-[10px]" style={{ fontFamily: f }}>
                            {isEn ? 'Detailed 2D Floor Plan Report' : 'تقرير مفصّل عن المخطط ثنائي الأبعاد'}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => setShowReport(false)} className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center hover:bg-white/25 transition-colors">
                        <XIcon className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Report Body */}
                  <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">

                    {/* Tool ID & Date */}
                    <div className="bg-gray-50 rounded-2xl p-4 border-[4px] border-gray-200/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-[#2AA676]" />
                          <span className="text-[11px] font-bold text-gray-500" style={{ fontFamily: f }}>
                            {isEn ? 'Report ID' : 'معرّف التقرير'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <code className="text-[11px] font-extrabold text-[#1F3D2B] bg-[#2AA676]/10 px-2.5 py-1 rounded-lg" style={{ fontFamily: 'monospace' }}>
                            {report.id}
                          </code>
                          <button onClick={() => navigator.clipboard?.writeText(report.id)}
                            className="p-1 hover:bg-gray-200 rounded-lg transition-colors" title={isEn ? 'Copy' : 'نسخ'}>
                            <Copy className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#5B9CF6]" />
                          <span className="text-[11px] font-bold text-gray-500" style={{ fontFamily: f }}>
                            {isEn ? 'Date & Time' : 'التاريخ والوقت'}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-[#1F3D2B]" style={{ fontFamily: f }}>
                          {report.date} — {report.time}
                        </span>
                      </div>
                    </div>

                    {/* Design Summary Stats */}
                    <div className="bg-white rounded-2xl p-4 border-[4px] border-[#2AA676]/20 space-y-3">
                      <h3 className="text-[12px] font-extrabold text-[#1F3D2B] flex items-center gap-2" style={{ fontFamily: f }}>
                        <Layers className="w-4 h-4 text-[#2AA676]" />
                        {isEn ? 'Design Summary' : 'ملخص التصميم'}
                      </h3>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: isEn ? 'Walls' : 'الجدران', value: report.wallsCount, color: '#5C636B', icon: Layers },
                          { label: isEn ? 'Doors' : 'الأبواب', value: report.doorsCount, color: '#E74C3C', icon: Home },
                          { label: isEn ? 'Windows' : 'النوافذ', value: report.windowsCount, color: '#3498DB', icon: LayoutGrid },
                          { label: isEn ? 'Furniture' : 'الأثاث', value: report.furnitureCount, color: '#C8A86A', icon: LayoutGrid },
                        ].map((stat, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-xl p-3 border-[4px] border-gray-100/80 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                            </div>
                            <div>
                              <div className="text-[9px] text-gray-400 font-bold" style={{ fontFamily: f }}>{stat.label}</div>
                              <div className="text-sm font-extrabold text-[#1F3D2B]" style={{ fontFamily: f }}>{stat.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1 bg-[#2AA676]/10 rounded-xl p-3 border-[4px] border-[#2AA676]/20 text-center">
                          <div className="text-[9px] text-[#2AA676] font-bold" style={{ fontFamily: f }}>
                            {isEn ? 'Total Wall Length' : 'إجمالي طول الجدران'}
                          </div>
                          <div className="text-sm font-extrabold text-[#1F3D2B]" style={{ fontFamily: f }}>
                            {(report.totalWallLength / 1000).toFixed(2)} {isEn ? 'm' : 'م'}
                          </div>
                        </div>
                        <div className="flex-1 bg-[#5B9CF6]/10 rounded-xl p-3 border-[4px] border-[#5B9CF6]/20 text-center">
                          <div className="text-[9px] text-[#5B9CF6] font-bold" style={{ fontFamily: f }}>
                            {isEn ? 'Total Area' : 'إجمالي المساحة'}
                          </div>
                          <div className="text-sm font-extrabold text-[#1F3D2B]" style={{ fontFamily: f }}>
                            {report.totalArea} {isEn ? 'm²' : 'م²'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rooms Details */}
                    {report.rooms.length > 0 && (
                      <div className="bg-white rounded-2xl p-4 border-[4px] border-[#9B7AED]/20 space-y-2">
                        <h3 className="text-[12px] font-extrabold text-[#1F3D2B] flex items-center gap-2" style={{ fontFamily: f }}>
                          <Home className="w-4 h-4 text-[#9B7AED]" />
                          {isEn ? 'Rooms' : 'الغرف'}
                          <span className="text-[9px] bg-[#9B7AED]/10 text-[#9B7AED] px-1.5 py-0.5 rounded-full font-bold">{report.rooms.length}</span>
                        </h3>
                        {report.rooms.map((room, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 border-[4px] border-gray-100/80">
                            <span className="text-[11px] font-bold text-[#1F3D2B]" style={{ fontFamily: f }}>{room.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] text-gray-400 font-bold" style={{ fontFamily: f }}>
                                {isEn ? 'H' : 'ع'}: {room.height}mm
                              </span>
                              <span className="text-[10px] font-extrabold text-[#2AA676] bg-[#2AA676]/10 px-2 py-0.5 rounded-full" style={{ fontFamily: f }}>
                                {room.area} {isEn ? 'm²' : 'م²'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Walls Details */}
                    {report.wallDetails.length > 0 && (
                      <div className="bg-white rounded-2xl p-4 border-[4px] border-[#4A5568]/20 space-y-2">
                        <h3 className="text-[12px] font-extrabold text-[#1F3D2B] flex items-center gap-2" style={{ fontFamily: f }}>
                          <Ruler className="w-4 h-4 text-[#4A5568]" />
                          {isEn ? 'Wall Details' : 'تفاصيل الجدران'}
                          <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-bold">{report.wallDetails.length}</span>
                        </h3>
                        <div className="space-y-1">
                          {report.wallDetails.map((w, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5 border-[4px] border-gray-100/80">
                              <span className="text-[10px] font-bold text-gray-500" style={{ fontFamily: f }}>
                                {isEn ? `Wall ${idx + 1}` : `جدار ${idx + 1}`}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-gray-400" style={{ fontFamily: f }}>
                                  {isEn ? 'T' : 'س'}: {w.thickness}mm
                                </span>
                                <span className="text-[10px] font-bold text-[#1F3D2B]" style={{ fontFamily: f }}>
                                  {w.length}mm
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Furniture Details */}
                    {report.furniture.length > 0 && (
                      <div className="bg-white rounded-2xl p-4 border-[4px] border-[#C8A86A]/20 space-y-2">
                        <h3 className="text-[12px] font-extrabold text-[#1F3D2B] flex items-center gap-2" style={{ fontFamily: f }}>
                          <LayoutGrid className="w-4 h-4 text-[#C8A86A]" />
                          {isEn ? 'Furniture List' : 'قائمة الأثاث'}
                          <span className="text-[9px] bg-[#C8A86A]/10 text-[#C8A86A] px-1.5 py-0.5 rounded-full font-bold">{report.furniture.length}</span>
                        </h3>
                        {report.furniture.map((fi, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5 border-[4px] border-gray-100/80">
                            <span className="text-[10px] font-bold text-[#1F3D2B]" style={{ fontFamily: f }}>{fi.label}</span>
                            <span className="text-[9px] text-gray-400" style={{ fontFamily: f }}>
                              {fi.width / 10}×{fi.height / 10} cm
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Empty state */}
                    {report.wallsCount === 0 && report.furnitureCount === 0 && (
                      <div className="text-center py-8">
                        <div className="mx-auto mb-3">
                          <Icon3D icon={Pencil} theme="orange" size="lg" hoverable={false} />
                        </div>
                        <p className="text-sm font-bold text-gray-400" style={{ fontFamily: f }}>
                          {isEn ? 'No design elements yet' : 'لا توجد عناصر تصميم بعد'}
                        </p>
                        <p className="text-[10px] text-gray-300 mt-1" style={{ fontFamily: f }}>
                          {isEn ? 'Start drawing walls or load a template' : 'ابدأ برسم الجدران أو حمّل قالب جاهز'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Report Footer Actions */}
                  <div className="p-4 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => {
                        const report2 = generateReport();
                        const text = [
                          `📐 ${isEn ? 'Design Report' : 'تقرير التصميم'} — ${isEn ? 'Beit Al Reef' : 'بيت الريف'}`,
                          `━━━━━━━━━━━━━━━━━━━━━`,
                          `🆔 ${isEn ? 'ID' : 'المعرّف'}: ${report2.id}`,
                          `📅 ${isEn ? 'Date' : 'التاريخ'}: ${report2.date} — ${report2.time}`,
                          ``,
                          `📊 ${isEn ? 'Summary' : 'الملخص'}:`,
                          `   ${isEn ? 'Walls' : 'الجدران'}: ${report2.wallsCount} (${(report2.totalWallLength / 1000).toFixed(2)}${isEn ? 'm' : 'م'})`,
                          `   ${isEn ? 'Doors' : 'الأبواب'}: ${report2.doorsCount}`,
                          `   ${isEn ? 'Windows' : 'النوافذ'}: ${report2.windowsCount}`,
                          `   ${isEn ? 'Furniture' : 'الأثاث'}: ${report2.furnitureCount}`,
                          `   ${isEn ? 'Area' : 'المساحة'}: ${report2.totalArea}${isEn ? 'm²' : 'م²'}`,
                          report2.rooms.length > 0 ? `\n🏠 ${isEn ? 'Rooms' : 'الغرف'}:` : '',
                          ...report2.rooms.map(r => `   • ${r.name}: ${r.area}${isEn ? 'm²' : 'م²'} (H=${r.height}mm)`),
                        ].filter(Boolean).join('\n');
                        navigator.clipboard?.writeText(text);
                      }}
                      className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-[11px] font-bold text-[#1F3D2B] flex items-center justify-center gap-1.5 transition-colors border-[4px] border-gray-200/60"
                      style={{ fontFamily: f }}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {isEn ? 'Copy Report' : 'نسخ التقرير'}
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-2.5 bg-[#2AA676] hover:bg-[#238c63] rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition-colors border-[4px] border-[#238c63]/30"
                      style={{ fontFamily: f }}
                    >
                      <Printer className="w-3.5 h-3.5" />
                      {isEn ? 'Print' : 'طباعة'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>

      {/* ═══ CATALOG ═══ */}
      <div className="shrink-0 bg-white border-t border-gray-200" style={{ paddingBottom: 'max(0rem, env(safe-area-inset-bottom))' }}>
        <button onClick={() => setCatalogOpen(o => !o)}
          className="w-full flex items-center justify-center gap-2 py-1.5 text-[#4A5A6A] hover:bg-gray-50">
          <span className="w-8 h-1 bg-gray-300 rounded-full" />
          <span className="text-[10px] font-bold" style={{ fontFamily: f }}>{isEn ? 'Furniture Catalog' : 'كتالوج الأثاث'}</span>
          {catalogOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
        <AnimatePresence>
          {catalogOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex gap-1 px-3 pb-1.5 overflow-x-auto">
                {CATS.map(c => (
                  <button key={c.id} onClick={() => setCatalogCat(c.id)}
                    className={`whitespace-nowrap px-2.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${catalogCat === c.id ? 'bg-[#2AA676] text-white' : 'bg-gray-100 text-[#4A5A6A]'}`}
                    style={{ fontFamily: f }}>{isEn ? c.en : c.ar}</button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1.5 px-3 pb-3 max-h-36 overflow-y-auto">
                {CATALOG.filter(c => c.cat === catalogCat).map(item => (
                  <button key={item.id} onClick={() => addFurn(item)}
                    className="bg-gray-50 border-[4px] border-gray-200/60 rounded-xl p-1.5 flex flex-col items-center gap-0.5 hover:border-[#2AA676] hover:bg-green-50 active:scale-95 transition-all">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[8px] font-bold text-[#4A5A6A] leading-tight text-center line-clamp-2" style={{ fontFamily: f }}>
                      {isEn ? item.en : item.ar}
                    </span>
                    <span className="text-[7px] text-gray-400">{item.w / 10}×{item.h / 10}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
