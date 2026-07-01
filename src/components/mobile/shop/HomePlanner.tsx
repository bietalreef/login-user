/**
 * HomePlanner.tsx — مخطط المنزل التفاعلي (Home Planner)
 * ═══════════════════════════════════════════════════════
 * Reverse-engineered from VOX Box (voxbox-global.vox.pl)
 * Architecture: TopBar + LeftNav + SidePanel + Canvas + PropertiesPanel
 * Dark theme: #0B1120 / #111827 / #1E293B
 * No emoji. Lucide icons only.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import {
  ShoppingCart, X,
  Plus, Trash2, Move,
  ChevronLeft,
  Grid3x3,
  Ruler, Maximize,
  ArrowRight,
  DoorOpen, Layers,
  Sofa, Leaf,
  RotateCcw, RotateCw,
  Save, FolderOpen,
  Search, Sun,
  Eye,
  Home
} from 'lucide-react';
// TreePine not available in this lucide version — using Leaf as alias
const TreePine = Leaf;
import { useShopStore } from './ShopStore';

const FONT = 'Cairo, sans-serif';
const BLUE = '#3B5BFE';
const GOLD = '#D4AF37';
const BG0 = '#0B1120';
const BG1 = '#111827';
const BG2 = '#1E293B';
const BRD = 'rgba(255,255,255,0.08)';
const RED_ACCENT = '#ef4444';

// ═══════════════════════════════════════════
// Data Types
// ═══════════════════════════════════════════
interface WallElement {
  id: string;
  type: 'window' | 'door';
  wall: 'top' | 'bottom' | 'left' | 'right';
  position: number; // 0-1 along wall
  width: number; // meters
}

interface FurnitureItem {
  id: string;
  type: string;
  name: string;
  nameEn: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  price: number;
  rotation: number;
  category: string;
  image: string;
}

interface RoomConfig {
  width: number;
  length: number;
  height: number;
  wallThickness: number;
  wallColor: string;
  floorColor: string;
}

type ViewMode = '2d' | '3d';
type NavTab = 'windows' | 'doors' | 'walls' | 'furniture' | 'decorations' | 'search';

// ═══════════════════════════════════════════
// Image URLs
// ═══════════════════════════════════════════
const IMG = {
  chair: 'https://images.unsplash.com/photo-1760716478137-d861d5b354e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  armchair: 'https://images.unsplash.com/photo-1760981159144-44e623f5961e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  sofa2: 'https://images.unsplash.com/photo-1686040175058-eaa5fa57e7be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  sofa3: 'https://images.unsplash.com/photo-1759722665623-c4c1075c0a6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  lshape: 'https://images.unsplash.com/photo-1698936061086-2bf99c7b9fc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  coffeetable: 'https://images.unsplash.com/photo-1658367754793-1200cee7b3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  dining4: 'https://images.unsplash.com/photo-1697861293135-08739a7265a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  dining6: 'https://images.unsplash.com/photo-1771365155377-d58bdc1e09b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  desk: 'https://images.unsplash.com/photo-1556559322-b5071efadc88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  bed_single: 'https://images.unsplash.com/photo-1655450075012-c0393e3cc1ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  bed_double: 'https://images.unsplash.com/photo-1587552370813-a5140dbbc82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  bed_king: 'https://images.unsplash.com/photo-1766928210452-2470f91bae26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  nightstand: 'https://images.unsplash.com/photo-1766431015004-6cd4c33ae158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  wardrobe: 'https://images.unsplash.com/photo-1765766600589-ddad380d6534?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  rug_round: 'https://images.unsplash.com/photo-1764581186205-b26952a1f507?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  plant: 'https://images.unsplash.com/photo-1647105405377-a07f1d2a91a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  tvunit: 'https://images.unsplash.com/photo-1760155089939-1c9d2a45c0e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  bookshelf: 'https://images.unsplash.com/photo-1760822600750-0bc72f1fad9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
};

// ═══════════════════════════════════════════
// Furniture Catalog
// ═══════════════════════════════════════════
const FURNITURE_CATALOG: Omit<FurnitureItem, 'id' | 'x' | 'y' | 'rotation'>[] = [
  { type: 'chair', name: 'كرسي عصري', nameEn: 'Modern Chair', w: 0.5, h: 0.5, color: '#6366f1', price: 450, category: 'chairs', image: IMG.chair },
  { type: 'armchair', name: 'كرسي مريح', nameEn: 'Armchair', w: 0.8, h: 0.8, color: '#8b5cf6', price: 1200, category: 'chairs', image: IMG.armchair },
  { type: 'sofa2', name: 'كنبة مقعدين', nameEn: '2-Seat Sofa', w: 1.6, h: 0.8, color: '#64748b', price: 3500, category: 'sofas', image: IMG.sofa2 },
  { type: 'sofa3', name: 'كنبة 3 مقاعد', nameEn: '3-Seat Sofa', w: 2.2, h: 0.9, color: '#475569', price: 5200, category: 'sofas', image: IMG.sofa3 },
  { type: 'lshape', name: 'كنبة L شكل', nameEn: 'L-Shape Sofa', w: 2.5, h: 2.0, color: '#334155', price: 8500, category: 'sofas', image: IMG.lshape },
  { type: 'coffeetable', name: 'طاولة قهوة', nameEn: 'Coffee Table', w: 1.0, h: 0.6, color: '#92400e', price: 800, category: 'tables', image: IMG.coffeetable },
  { type: 'dining4', name: 'طاولة طعام 4', nameEn: 'Dining Table 4', w: 1.2, h: 0.9, color: '#78350f', price: 2800, category: 'tables', image: IMG.dining4 },
  { type: 'dining6', name: 'طاولة طعام 6', nameEn: 'Dining Table 6', w: 1.8, h: 1.0, color: '#451a03', price: 4200, category: 'tables', image: IMG.dining6 },
  { type: 'desk', name: 'مكتب عمل', nameEn: 'Work Desk', w: 1.4, h: 0.7, color: '#7c3aed', price: 1800, category: 'tables', image: IMG.desk },
  { type: 'bed_single', name: 'سرير مفرد', nameEn: 'Single Bed', w: 1.0, h: 2.0, color: '#be185d', price: 2200, category: 'bedroom', image: IMG.bed_single },
  { type: 'bed_double', name: 'سرير مزدوج', nameEn: 'Double Bed', w: 1.6, h: 2.1, color: '#9f1239', price: 4500, category: 'bedroom', image: IMG.bed_double },
  { type: 'bed_king', name: 'سرير كينج', nameEn: 'King Bed', w: 2.0, h: 2.2, color: '#881337', price: 6800, category: 'bedroom', image: IMG.bed_king },
  { type: 'nightstand', name: 'كومودينو', nameEn: 'Nightstand', w: 0.5, h: 0.4, color: '#a16207', price: 650, category: 'bedroom', image: IMG.nightstand },
  { type: 'wardrobe', name: 'خزانة ملابس', nameEn: 'Wardrobe', w: 1.8, h: 0.6, color: '#44403c', price: 5500, category: 'storage', image: IMG.wardrobe },
  { type: 'rug_round', name: 'سجادة دائرية', nameEn: 'Round Rug', w: 2.0, h: 2.0, color: '#d97706', price: 1200, category: 'decor', image: IMG.rug_round },
  { type: 'plant', name: 'نبتة زينة', nameEn: 'Plant', w: 0.4, h: 0.4, color: '#166534', price: 180, category: 'decor', image: IMG.plant },
  { type: 'tvunit', name: 'وحدة تلفاز', nameEn: 'TV Unit', w: 1.8, h: 0.45, color: '#1c1917', price: 3200, category: 'storage', image: IMG.tvunit },
  { type: 'bookshelf', name: 'رف كتب', nameEn: 'Bookshelf', w: 1.2, h: 0.35, color: '#292524', price: 1800, category: 'storage', image: IMG.bookshelf },
];

const WALL_COLORS = [
  { hex: '#8fa3bd', name: 'أزرق رمادي' },
  { hex: '#fdfbf7', name: 'أوف وايت' },
  { hex: '#d1c7bd', name: 'بيج دافئ' },
  { hex: '#b8c5d6', name: 'رمادي سماوي' },
  { hex: '#e8ddd3', name: 'كريمي' },
  { hex: '#c4b5a2', name: 'رملي' },
];

const FLOOR_COLORS = [
  { hex: '#d2b48c', name: 'خشب طبيعي' },
  { hex: '#8b5a2b', name: 'خشب داكن' },
  { hex: '#e8e5df', name: 'رخام فاتح' },
  { hex: '#696969', name: 'أسمنت' },
  { hex: '#b89470', name: 'باركيه فاتح' },
  { hex: '#5c4033', name: 'جوز' },
];

const NAV_ITEMS: { id: NavTab; label: string; icon: typeof Layers }[] = [
  { id: 'windows', label: 'نوافذ', icon: Maximize },
  { id: 'doors', label: 'أبواب', icon: DoorOpen },
  { id: 'walls', label: 'جدران', icon: Layers },
  { id: 'furniture', label: 'أثاث', icon: Sofa },
  { id: 'decorations', label: 'ديكورات', icon: TreePine },
  { id: 'search', label: 'بحث', icon: Search },
];

const CAT_MAP: Record<string, NavTab[]> = {
  chairs: ['furniture'],
  sofas: ['furniture'],
  tables: ['furniture'],
  bedroom: ['furniture'],
  storage: ['furniture'],
  decor: ['decorations'],
};

let _idCounter = 0;
const genId = () => `f_${++_idCounter}_${Date.now()}`;

// ═══════════════════════════════════════════
// Canvas Drawing — VOX-style 2D Technical Plan
// ═══════════════════════════════════════════
function drawFloorPlan(
  canvas: HTMLCanvasElement,
  room: RoomConfig,
  furniture: FurnitureItem[],
  wallElements: WallElement[],
  selectedId: string | null,
  cornerHover: number,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const cw = rect.width;
  const ch = rect.height;

  canvas.width = Math.round(cw * dpr);
  canvas.height = Math.round(ch * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const pad = 80;
  const maxDim = Math.max(room.width, room.length);
  const scale = Math.min((cw - pad * 2) / maxDim, (ch - pad * 2) / maxDim);
  const rw = room.width * scale;
  const rl = room.length * scale;
  const ox = (cw - rw) / 2;
  const oy = (ch - rl) / 2;

  // ── Background ──
  ctx.fillStyle = '#0f1520';
  ctx.fillRect(0, 0, cw, ch);

  // ── Subtle grid ──
  ctx.strokeStyle = 'rgba(59,91,254,0.03)';
  ctx.lineWidth = 0.5;
  const gs = scale;
  for (let x = ox; x <= ox + rw; x += gs) {
    ctx.beginPath(); ctx.moveTo(x, oy); ctx.lineTo(x, oy + rl); ctx.stroke();
  }
  for (let y = oy; y <= oy + rl; y += gs) {
    ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(ox + rw, y); ctx.stroke();
  }

  // ── Floor fill ──
  ctx.fillStyle = room.floorColor + '18';
  ctx.fillRect(ox, oy, rw, rl);

  // ── Floor grid (0.5m fine grid) ──
  ctx.strokeStyle = room.floorColor + '0d';
  ctx.lineWidth = 0.3;
  const fgs = scale * 0.5;
  for (let x = ox; x <= ox + rw; x += fgs) {
    ctx.beginPath(); ctx.moveTo(x, oy); ctx.lineTo(x, oy + rl); ctx.stroke();
  }
  for (let y = oy; y <= oy + rl; y += fgs) {
    ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(ox + rw, y); ctx.stroke();
  }

  // ── Furniture ──
  for (const f of furniture) {
    const fx = ox + f.x * scale;
    const fy = oy + f.y * scale;
    const fw = f.w * scale;
    const fh = f.h * scale;
    const isSel = f.id === selectedId;

    ctx.save();
    ctx.translate(fx, fy);
    if (f.rotation) ctx.rotate((f.rotation * Math.PI) / 180);

    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 3;

    ctx.beginPath();
    // roundRect polyfill
    if (ctx.roundRect) {
      ctx.roundRect(-fw / 2, -fh / 2, fw, fh, 4);
    } else {
      ctx.rect(-fw / 2, -fh / 2, fw, fh);
    }
    ctx.fillStyle = isSel ? f.color : f.color + 'cc';
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Selection highlight (VOX uses green highlight, we use blue)
    if (isSel) {
      ctx.strokeStyle = BLUE;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Selection handles (corners)
      const corners = [
        [-fw/2, -fh/2], [fw/2, -fh/2], [-fw/2, fh/2], [fw/2, fh/2]
      ];
      for (const [cx, cy] of corners) {
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = BLUE;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // Inner detail
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    if (f.type.startsWith('bed')) {
      ctx.fillRect(-fw / 2 + 4, -fh / 2 + 4, fw - 8, fh * 0.22);
    } else if (f.type.startsWith('sofa') || f.type === 'lshape') {
      ctx.fillRect(-fw / 2 + 3, fh / 2 - fh * 0.2, fw - 6, fh * 0.16);
    } else if (f.type === 'rug_round') {
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(fw, fh) / 2 - 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fill();
    } else if (f.type === 'plant') {
      ctx.beginPath();
      ctx.arc(0, 0, fw / 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fill();
    }

    // Label
    if (fw > 35 && fh > 22) {
      ctx.fillStyle = isSel ? '#fff' : 'rgba(255,255,255,0.5)';
      ctx.font = `bold ${Math.max(8, Math.min(11, fw / 7))}px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = f.name.length > 12 ? f.name.slice(0, 12) + '..' : f.name;
      ctx.fillText(label, 0, 0);
    }

    ctx.restore();
  }

  // ── Walls (VOX style: thin red/dark lines) ──
  const wallW = Math.max(3, room.wallThickness * scale * 0.01);
  ctx.fillStyle = room.wallColor + '80';

  // Top wall
  ctx.fillRect(ox - wallW/2, oy - wallW/2, rw + wallW, wallW);
  // Bottom wall
  ctx.fillRect(ox - wallW/2, oy + rl - wallW/2, rw + wallW, wallW);
  // Left wall
  ctx.fillRect(ox - wallW/2, oy - wallW/2, wallW, rl + wallW);
  // Right wall
  ctx.fillRect(ox + rw - wallW/2, oy - wallW/2, wallW, rl + wallW);

  // Wall outline
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(ox, oy, rw, rl);

  // ── Wall Elements (Doors & Windows) ──
  for (const el of wallElements) {
    const elW = el.width * scale;

    if (el.wall === 'top' || el.wall === 'bottom') {
      const elX = ox + el.position * rw - elW / 2;
      const elY = el.wall === 'top' ? oy : oy + rl;

      if (el.type === 'window') {
        // Window: double parallel lines (VOX style)
        ctx.fillStyle = BG0;
        ctx.fillRect(elX, elY - wallW/2 - 1, elW, wallW + 2);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(elX, elY - 2); ctx.lineTo(elX + elW, elY - 2);
        ctx.moveTo(elX, elY + 2); ctx.lineTo(elX + elW, elY + 2);
        ctx.stroke();
        // Center line
        ctx.strokeStyle = '#94a3b880';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(elX + elW/2, elY - 4); ctx.lineTo(elX + elW/2, elY + 4);
        ctx.stroke();
      } else {
        // Door: gap in wall + swing arc (VOX red dashed arc)
        ctx.fillStyle = BG0;
        ctx.fillRect(elX, elY - wallW/2 - 1, elW, wallW + 2);
        // Door leaf
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(elX, elY - 1.5, elW, 3);
        // Swing arc
        ctx.strokeStyle = RED_ACCENT + '60';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        const arcDir = el.wall === 'top' ? 1 : -1;
        ctx.arc(elX, elY, elW, 0, (Math.PI / 2) * arcDir, arcDir < 0);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    } else {
      const elY = oy + el.position * rl - elW / 2;
      const elX = el.wall === 'left' ? ox : ox + rw;

      if (el.type === 'window') {
        ctx.fillStyle = BG0;
        ctx.fillRect(elX - wallW/2 - 1, elY, wallW + 2, elW);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(elX - 2, elY); ctx.lineTo(elX - 2, elY + elW);
        ctx.moveTo(elX + 2, elY); ctx.lineTo(elX + 2, elY + elW);
        ctx.stroke();
      } else {
        ctx.fillStyle = BG0;
        ctx.fillRect(elX - wallW/2 - 1, elY, wallW + 2, elW);
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(elX - 1.5, elY, 3, elW);
        ctx.strokeStyle = RED_ACCENT + '60';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        const arcDir = el.wall === 'left' ? 1 : -1;
        ctx.arc(elX, elY, elW, -Math.PI / 2, 0);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  // ── Corner handles (VOX: hollow circles) ──
  const corners = [
    { x: ox, y: oy, idx: 0 },
    { x: ox + rw, y: oy, idx: 1 },
    { x: ox, y: oy + rl, idx: 2 },
    { x: ox + rw, y: oy + rl, idx: 3 },
  ];
  for (const c of corners) {
    const isHov = cornerHover === c.idx;
    ctx.beginPath();
    ctx.arc(c.x, c.y, isHov ? 8 : 6, 0, Math.PI * 2);
    ctx.fillStyle = isHov ? '#fff' : BG0;
    ctx.fill();
    ctx.strokeStyle = isHov ? BLUE : 'rgba(255,255,255,0.6)';
    ctx.lineWidth = isHov ? 2.5 : 1.5;
    ctx.stroke();
  }

  // ── Dimension labels (VOX style: lines with values in boxes) ──
  const widthCm = Math.round(room.width * 100);
  const lengthCm = Math.round(room.length * 100);

  ctx.fillStyle = '#fff';
  ctx.font = `bold 11px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Top dimension line
  const dimY_top = oy - 30;
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 0.8;
  // Left tick
  ctx.beginPath(); ctx.moveTo(ox, dimY_top - 5); ctx.lineTo(ox, dimY_top + 5); ctx.stroke();
  // Right tick
  ctx.beginPath(); ctx.moveTo(ox + rw, dimY_top - 5); ctx.lineTo(ox + rw, dimY_top + 5); ctx.stroke();
  // Line
  ctx.beginPath(); ctx.moveTo(ox, dimY_top); ctx.lineTo(ox + rw, dimY_top); ctx.stroke();
  // Label box
  const labelW = 50;
  ctx.fillStyle = BG0;
  ctx.fillRect(ox + rw/2 - labelW/2, dimY_top - 10, labelW, 20);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(ox + rw/2 - labelW/2, dimY_top - 10, labelW, 20);
  ctx.fillStyle = '#fff';
  ctx.fillText(`${widthCm}`, ox + rw/2, dimY_top);

  // Bottom dimension line
  const dimY_bot = oy + rl + 30;
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(ox, dimY_bot - 5); ctx.lineTo(ox, dimY_bot + 5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox + rw, dimY_bot - 5); ctx.lineTo(ox + rw, dimY_bot + 5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox, dimY_bot); ctx.lineTo(ox + rw, dimY_bot); ctx.stroke();
  ctx.fillStyle = BG0;
  ctx.fillRect(ox + rw/2 - labelW/2, dimY_bot - 10, labelW, 20);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.strokeRect(ox + rw/2 - labelW/2, dimY_bot - 10, labelW, 20);
  ctx.fillStyle = '#fff';
  ctx.fillText(`${widthCm}`, ox + rw/2, dimY_bot);

  // Left dimension
  const dimX_left = ox - 30;
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(dimX_left - 5, oy); ctx.lineTo(dimX_left + 5, oy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dimX_left - 5, oy + rl); ctx.lineTo(dimX_left + 5, oy + rl); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dimX_left, oy); ctx.lineTo(dimX_left, oy + rl); ctx.stroke();
  // Rotated label
  ctx.save();
  ctx.translate(dimX_left, oy + rl/2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = BG0;
  ctx.fillRect(-labelW/2, -10, labelW, 20);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.strokeRect(-labelW/2, -10, labelW, 20);
  ctx.fillStyle = '#fff';
  ctx.fillText(`${lengthCm}`, 0, 0);
  ctx.restore();

  // Right dimension
  const dimX_right = ox + rw + 30;
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(dimX_right - 5, oy); ctx.lineTo(dimX_right + 5, oy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dimX_right - 5, oy + rl); ctx.lineTo(dimX_right + 5, oy + rl); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dimX_right, oy); ctx.lineTo(dimX_right, oy + rl); ctx.stroke();
  ctx.save();
  ctx.translate(dimX_right, oy + rl/2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = BG0;
  ctx.fillRect(-labelW/2, -10, labelW, 20);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.strokeRect(-labelW/2, -10, labelW, 20);
  ctx.fillStyle = '#fff';
  ctx.fillText(`${lengthCm}`, 0, 0);
  ctx.restore();

  // ── Scale bar (bottom center) ──
  const scaleBarW = scale; // 1 meter
  const sbX = cw / 2 - scaleBarW / 2;
  const sbY = ch - 20;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(sbX, sbY, scaleBarW, 2);
  ctx.fillRect(sbX, sbY - 4, 1, 10);
  ctx.fillRect(sbX + scaleBarW, sbY - 4, 1, 10);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = `bold 10px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('1 م', sbX + scaleBarW / 2, sbY - 10);

  // ── Area label ──
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.font = `bold 14px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${(room.width * room.length).toFixed(1)} م\u00B2`, ox + rw / 2, oy + rl / 2);
}

// ═══════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════
export function HomePlanner({ onBack }: { onBack?: () => void }) {
  const addToCartShop = useShopStore((s) => s.addToCart);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const isDraggingRef = useRef(false);

  const [room, setRoom] = useState<RoomConfig>({
    width: 5, length: 5, height: 268, wallThickness: 15,
    wallColor: '#8fa3bd', floorColor: '#d2b48c',
  });
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [wallElements, setWallElements] = useState<WallElement[]>([
    { id: 'w1', type: 'window', wall: 'top', position: 0.5, width: 1.2 },
    { id: 'd1', type: 'door', wall: 'left', position: 0.3, width: 0.9 },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<NavTab | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('2d');
  const [cornerHover, setCornerHover] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [undoStack, setUndoStack] = useState<FurnitureItem[][]>([]);
  const [redoStack, setRedoStack] = useState<FurnitureItem[][]>([]);

  const currency = 'د.إ';

  // Refs for canvas
  const furnitureRef = useRef(furniture);
  const roomRef = useRef(room);
  const wallElRef = useRef(wallElements);
  const selectedIdRef = useRef(selectedId);
  const cornerHoverRef = useRef(cornerHover);
  const dragRef = useRef<{ id: string; offX: number; offY: number } | null>(null);

  furnitureRef.current = furniture;
  roomRef.current = room;
  wallElRef.current = wallElements;
  selectedIdRef.current = selectedId;
  cornerHoverRef.current = cornerHover;

  const getLayout = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { scale: 60, ox: 40, oy: 40 };
    const rect = canvas.getBoundingClientRect();
    const pad = 80;
    const r = roomRef.current;
    const maxDim = Math.max(r.width, r.length);
    const scale = Math.min((rect.width - pad * 2) / maxDim, (rect.height - pad * 2) / maxDim);
    const rw = r.width * scale;
    const rl = r.length * scale;
    return { scale, ox: (rect.width - rw) / 2, oy: (rect.height - rl) / 2 };
  }, []);

  const toRoom = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { rx: 0, ry: 0 };
    const rect = canvas.getBoundingClientRect();
    const { scale, ox, oy } = getLayout();
    return { rx: (clientX - rect.left - ox) / scale, ry: (clientY - rect.top - oy) / scale };
  }, [getLayout]);

  const scheduleRedraw = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (canvas) drawFloorPlan(canvas, roomRef.current, furnitureRef.current, wallElRef.current, selectedIdRef.current, cornerHoverRef.current);
    });
  }, []);

  useEffect(() => { scheduleRedraw(); }, [room, furniture, wallElements, selectedId, cornerHover, scheduleRedraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => scheduleRedraw());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [scheduleRedraw]);

  // Pointer events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const hitTest = (rx: number, ry: number): string | null => {
      const items = furnitureRef.current;
      for (let i = items.length - 1; i >= 0; i--) {
        const f = items[i];
        if (rx >= f.x - f.w / 2 && rx <= f.x + f.w / 2 && ry >= f.y - f.h / 2 && ry <= f.y + f.h / 2) return f.id;
      }
      return null;
    };

    const onDown = (e: PointerEvent) => {
      const { rx, ry } = toRoom(e.clientX, e.clientY);
      const hit = hitTest(rx, ry);
      setSelectedId(hit);
      selectedIdRef.current = hit;
      if (hit) {
        // Save undo state
        setUndoStack(prev => [...prev.slice(-20), [...furnitureRef.current]]);
        setRedoStack([]);
        const f = furnitureRef.current.find(item => item.id === hit);
        if (f) {
          dragRef.current = { id: hit, offX: rx - f.x, offY: ry - f.y };
          isDraggingRef.current = true;
          canvas.setPointerCapture(e.pointerId);
        }
      }
      scheduleRedraw();
    };

    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const r = roomRef.current;
      const { rx, ry } = toRoom(e.clientX, e.clientY);
      const nx = Math.round(Math.max(0, Math.min(r.width, rx - dragRef.current.offX)) * 20) / 20;
      const ny = Math.round(Math.max(0, Math.min(r.length, ry - dragRef.current.offY)) * 20) / 20;
      const items = furnitureRef.current;
      const idx = items.findIndex(item => item.id === dragRef.current!.id);
      if (idx !== -1) {
        items[idx] = { ...items[idx], x: nx, y: ny };
        furnitureRef.current = [...items];
      }
      scheduleRedraw();
    };

    const onUp = () => {
      if (isDraggingRef.current) {
        setFurniture([...furnitureRef.current]);
        isDraggingRef.current = false;
      }
      dragRef.current = null;
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    };
  }, [toRoom, scheduleRedraw]);

  // Actions
  const pushUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-20), [...furnitureRef.current]]);
    setRedoStack([]);
  }, []);

  const addFurniture = useCallback((item: Omit<FurnitureItem, 'id' | 'x' | 'y' | 'rotation'>) => {
    pushUndo();
    const newItem: FurnitureItem = {
      ...item, id: genId(), x: roomRef.current.width / 2, y: roomRef.current.length / 2, rotation: 0,
    };
    setFurniture(prev => [...prev, newItem]);
    toast.success(`تم إضافة ${item.name}`, {
      duration: 1200,
      style: { background: BG2, color: '#fff', border: `1px solid ${BRD}`, fontFamily: FONT },
    });
  }, [pushUndo]);

  const removeFurniture = useCallback((id: string) => {
    pushUndo();
    setFurniture(prev => prev.filter(f => f.id !== id));
    setSelectedId(prev => (prev === id ? null : prev));
  }, [pushUndo]);

  const rotateFurniture = useCallback((id: string, delta: number) => {
    pushUndo();
    setFurniture(prev => prev.map(f => f.id === id ? { ...f, rotation: (f.rotation + delta + 360) % 360 } : f));
  }, [pushUndo]);

  const undo = useCallback(() => {
    setUndoStack(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setRedoStack(r => [...r, [...furnitureRef.current]]);
      setFurniture(last);
      return prev.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setRedoStack(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setUndoStack(u => [...u, [...furnitureRef.current]]);
      setFurniture(last);
      return prev.slice(0, -1);
    });
  }, []);

  const addWallElement = useCallback((type: 'window' | 'door', wall: WallElement['wall']) => {
    setWallElements(prev => [...prev, {
      id: genId(),
      type,
      wall,
      position: 0.5,
      width: type === 'window' ? 1.2 : 0.9,
    }]);
  }, []);

  const removeWallElement = useCallback((id: string) => {
    setWallElements(prev => prev.filter(el => el.id !== id));
  }, []);

  const selectedItem = furniture.find(f => f.id === selectedId);
  const totalPrice = furniture.reduce((sum, f) => sum + f.price, 0);

  // Filter catalog based on active nav tab and search
  const filteredCatalog = FURNITURE_CATALOG.filter(item => {
    if (searchQuery) {
      return item.name.includes(searchQuery) || item.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (activeNav === 'furniture') {
      return ['chairs', 'sofas', 'tables', 'bedroom', 'storage'].includes(item.category);
    }
    if (activeNav === 'decorations') {
      return item.category === 'decor';
    }
    return true;
  });

  const handleNavClick = (id: NavTab) => {
    if (activeNav === id && panelOpen) {
      setPanelOpen(false);
      setActiveNav(null);
    } else {
      setActiveNav(id);
      setPanelOpen(true);
    }
  };

  const addAllToShopCart = useCallback(() => {
    furnitureRef.current.forEach(f => {
      addToCartShop({ id: `planner_${f.id}`, name: f.name, nameEn: f.nameEn, price: f.price, image: f.image, category: f.category });
    });
    toast.success(`تمت إضافة ${furnitureRef.current.length} منتج للسلة`, {
      duration: 2000,
      style: { background: BG2, color: '#fff', border: `1px solid ${GOLD}40`, fontFamily: FONT },
    });
  }, [addToCartShop]);

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════
  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: BG0, fontFamily: FONT }} dir="rtl">

      {/* ═══ TOP BAR (VOX-style) ═══ */}
      <header
        className="flex items-center justify-between h-12 px-3 flex-shrink-0 z-30"
        style={{ background: BG1, borderBottom: `1px solid ${BRD}` }}
      >
        {/* Right: Logo + Mode tabs */}
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ArrowRight size={16} className="text-white/60" />
            </button>
          )}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: BLUE }}>
            <Home size={14} className="text-white" />
          </div>

          {/* Mode tabs */}
          <div className="flex items-center rounded-lg overflow-hidden" style={{ border: `1px solid ${BRD}` }}>
            <button
              onClick={() => setViewMode('2d')}
              className="px-4 py-1.5 text-[11px] font-bold transition-colors"
              style={{
                background: viewMode === '2d' ? BLUE : 'transparent',
                color: viewMode === '2d' ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            >
              مخطط تقني
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className="px-4 py-1.5 text-[11px] font-bold transition-colors"
              style={{
                background: viewMode === '3d' ? BLUE : 'transparent',
                color: viewMode === '3d' ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            >
              تصميم داخلي
            </button>
          </div>
        </div>

        {/* Left: Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30"
            title="تراجع"
          >
            <RotateCcw size={14} className="text-white/60" />
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30"
            title="إعادة"
          >
            <RotateCw size={14} className="text-white/60" />
          </button>

          <div className="w-px h-5 mx-1" style={{ background: BRD }} />

          <button
            onClick={() => toast.success('تم حفظ المشروع', { style: { background: BG2, color: '#fff', fontFamily: FONT } })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Save size={13} className="text-white/60" />
            <span className="text-[10px] font-bold text-white/60">حفظ</span>
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <FolderOpen size={13} className="text-white/60" />
            <span className="text-[10px] font-bold text-white/60">مشروع</span>
          </button>

          {/* Cart summary */}
          {furniture.length > 0 && (
            <>
              <div className="w-px h-5 mx-1" style={{ background: BRD }} />
              <button
                onClick={addAllToShopCart}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: `${BLUE}20` }}
              >
                <ShoppingCart size={13} style={{ color: BLUE }} />
                <span className="text-[10px] font-bold" style={{ color: BLUE }}>
                  {furniture.length} | {totalPrice.toLocaleString()} {currency}
                </span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* ═══ MAIN AREA ═══ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ═══ RIGHT: Icon Nav (VOX left nav equivalent) ═══ */}
        <nav
          className="w-16 flex-shrink-0 flex flex-col items-center py-3 gap-1 overflow-y-auto"
          style={{ background: BG1, borderLeft: `1px solid ${BRD}` }}
        >
          {NAV_ITEMS.map(item => {
            const isActive = activeNav === item.id && panelOpen;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="relative flex flex-col items-center py-2 w-full group transition-colors"
              >
                {isActive && (
                  <div className="absolute right-0 top-[15%] h-[70%] w-[3px] rounded-l" style={{ background: BLUE }} />
                )}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-1 transition-all group-hover:scale-105"
                  style={{
                    background: isActive ? `${BLUE}20` : 'rgba(255,255,255,0.04)',
                    border: isActive ? `1px solid ${BLUE}40` : `1px solid transparent`,
                  }}
                >
                  <item.icon size={18} style={{ color: isActive ? BLUE : 'rgba(255,255,255,0.45)' }} />
                </div>
                <span
                  className="text-[8px] font-bold"
                  style={{ color: isActive ? BLUE : 'rgba(255,255,255,0.35)' }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}

          <div className="flex-1" />

          {/* Light settings (like VOX) */}
          <button className="flex flex-col items-center py-2 w-full group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-1 group-hover:scale-105 transition-transform"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <Sun size={18} className="text-white/35" />
            </div>
            <span className="text-[8px] font-bold text-white/30">إضاءة</span>
          </button>
        </nav>

        {/* ═══ SIDE PANEL (VOX expandable panel) ═══ */}
        <AnimatePresence>
          {panelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 h-full overflow-hidden"
              style={{ background: BG1, borderLeft: `1px solid ${BRD}` }}
            >
              <div className="w-[300px] h-full flex flex-col">
                {/* Panel header */}
                <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ borderBottom: `1px solid ${BRD}` }}>
                  <div className="flex items-center gap-2">
                    <ChevronLeft
                      size={16}
                      className="text-white/40 cursor-pointer hover:text-white/70 transition-colors"
                      onClick={() => { setPanelOpen(false); setActiveNav(null); }}
                    />
                    <h3 className="text-sm font-bold text-white/90">
                      {activeNav === 'windows' && 'نوافذ'}
                      {activeNav === 'doors' && 'أبواب'}
                      {activeNav === 'walls' && 'جدران وتشطيب'}
                      {activeNav === 'furniture' && 'أثاث'}
                      {activeNav === 'decorations' && 'ديكورات'}
                      {activeNav === 'search' && 'بحث'}
                    </h3>
                  </div>
                  <button
                    onClick={() => { setPanelOpen(false); setActiveNav(null); }}
                    className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <X size={13} className="text-white/40" />
                  </button>
                </div>

                {/* Panel content */}
                <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>

                  {/* ── WINDOWS TAB ── */}
                  {activeNav === 'windows' && (
                    <div className="p-4 space-y-3">
                      <p className="text-[11px] text-white/40 font-semibold leading-relaxed">
                        أضف نوافذ على جدران الغرفة. اضغط على الجدار المطلوب لإضافة نافذة.
                      </p>
                      {(['top', 'bottom', 'left', 'right'] as const).map(wall => {
                        const label = { top: 'الجدار العلوي', bottom: 'الجدار السفلي', left: 'الجدار الأيسر', right: 'الجدار الأيمن' }[wall];
                        const existing = wallElements.filter(e => e.wall === wall && e.type === 'window');
                        return (
                          <div key={wall} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BRD}` }}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[11px] font-bold text-white/60">{label}</span>
                              <button
                                onClick={() => addWallElement('window', wall)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors"
                                style={{ background: `${BLUE}20`, color: BLUE }}
                              >
                                <Plus size={10} /> إضافة
                              </button>
                            </div>
                            {existing.map(el => (
                              <div key={el.id} className="flex items-center justify-between py-1.5">
                                <div className="flex items-center gap-2">
                                  <Maximize size={12} className="text-white/30" />
                                  <span className="text-[10px] text-white/50">{(el.width * 100).toFixed(0)} سم</span>
                                </div>
                                <button onClick={() => removeWallElement(el.id)} className="text-red-400/60 hover:text-red-400">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ── DOORS TAB ── */}
                  {activeNav === 'doors' && (
                    <div className="p-4 space-y-3">
                      <p className="text-[11px] text-white/40 font-semibold leading-relaxed">
                        أضف أبواب على جدران الغرفة. قوس الفتح يظهر تلقائيا.
                      </p>
                      {(['top', 'bottom', 'left', 'right'] as const).map(wall => {
                        const label = { top: 'الجدار العلوي', bottom: 'الجدار السفلي', left: 'الجدار الأيسر', right: 'الجدار الأيمن' }[wall];
                        const existing = wallElements.filter(e => e.wall === wall && e.type === 'door');
                        return (
                          <div key={wall} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BRD}` }}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[11px] font-bold text-white/60">{label}</span>
                              <button
                                onClick={() => addWallElement('door', wall)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors"
                                style={{ background: `${BLUE}20`, color: BLUE }}
                              >
                                <Plus size={10} /> إضافة
                              </button>
                            </div>
                            {existing.map(el => (
                              <div key={el.id} className="flex items-center justify-between py-1.5">
                                <div className="flex items-center gap-2">
                                  <DoorOpen size={12} className="text-white/30" />
                                  <span className="text-[10px] text-white/50">{(el.width * 100).toFixed(0)} سم</span>
                                </div>
                                <button onClick={() => removeWallElement(el.id)} className="text-red-400/60 hover:text-red-400">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ── WALLS TAB ── */}
                  {activeNav === 'walls' && (
                    <div className="p-4 space-y-4">
                      {/* Room height (VOX style) */}
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BRD}` }}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-bold text-white/60 flex items-center gap-1.5">
                            <Ruler size={12} style={{ color: BLUE }} />
                            ارتفاع الغرفة
                          </span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={room.height}
                              onChange={e => setRoom(p => ({ ...p, height: parseFloat(e.target.value) || 268 }))}
                              className="w-14 text-center text-[11px] font-bold py-1 rounded outline-none"
                              style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: `1px solid ${BRD}` }}
                            />
                            <span className="text-[10px] text-white/30 font-bold">سم</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-white/60 flex items-center gap-1.5">
                            <Ruler size={12} style={{ color: BLUE }} />
                            سمك الجدار
                          </span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={room.wallThickness}
                              onChange={e => setRoom(p => ({ ...p, wallThickness: parseFloat(e.target.value) || 15 }))}
                              className="w-14 text-center text-[11px] font-bold py-1 rounded outline-none"
                              style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: `1px solid ${BRD}` }}
                            />
                            <span className="text-[10px] text-white/30 font-bold">سم</span>
                          </div>
                        </div>
                      </div>

                      {/* Room dimensions */}
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BRD}` }}>
                        <h4 className="text-[11px] font-bold text-white/60 mb-3">أبعاد الغرفة</h4>
                        {(['width', 'length'] as const).map(k => (
                          <div key={k} className="mb-3">
                            <div className="flex justify-between text-[10px] mb-1.5">
                              <span className="text-white/40 font-semibold">{k === 'width' ? 'العرض' : 'الطول'}</span>
                              <span className="font-bold font-mono" style={{ color: BLUE }}>{room[k].toFixed(1)} م</span>
                            </div>
                            <input
                              type="range" min="2" max="15" step="0.1" value={room[k]}
                              onChange={e => setRoom(p => ({ ...p, [k]: parseFloat(e.target.value) }))}
                              className="w-full h-1 rounded appearance-none cursor-pointer"
                              style={{ accentColor: BLUE }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Wall colors */}
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BRD}` }}>
                        <h4 className="text-[11px] font-bold text-white/60 mb-3">ألوان الجدران</h4>
                        <div className="flex flex-wrap gap-2">
                          {WALL_COLORS.map(c => (
                            <button
                              key={c.hex}
                              onClick={() => setRoom(p => ({ ...p, wallColor: c.hex }))}
                              title={c.name}
                              className="flex flex-col items-center gap-1"
                            >
                              <div
                                className="w-8 h-8 rounded-full transition-all"
                                style={{
                                  background: c.hex,
                                  border: room.wallColor === c.hex ? `2px solid ${BLUE}` : '2px solid rgba(255,255,255,0.15)',
                                  boxShadow: room.wallColor === c.hex ? `0 0 0 2px ${BG1}, 0 0 0 4px ${BLUE}` : 'none',
                                }}
                              />
                              <span className="text-[7px] text-white/25 font-bold">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Floor colors */}
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BRD}` }}>
                        <h4 className="text-[11px] font-bold text-white/60 mb-3">ألوان الأرضيات</h4>
                        <div className="flex flex-wrap gap-2">
                          {FLOOR_COLORS.map(c => (
                            <button
                              key={c.hex}
                              onClick={() => setRoom(p => ({ ...p, floorColor: c.hex }))}
                              title={c.name}
                              className="flex flex-col items-center gap-1"
                            >
                              <div
                                className="w-8 h-8 rounded-full transition-all"
                                style={{
                                  background: c.hex,
                                  border: room.floorColor === c.hex ? `2px solid ${BLUE}` : '2px solid rgba(255,255,255,0.15)',
                                  boxShadow: room.floorColor === c.hex ? `0 0 0 2px ${BG1}, 0 0 0 4px ${BLUE}` : 'none',
                                }}
                              />
                              <span className="text-[7px] text-white/25 font-bold">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── FURNITURE / DECORATIONS / SEARCH TAB ── */}
                  {(activeNav === 'furniture' || activeNav === 'decorations' || activeNav === 'search') && (
                    <div className="flex flex-col h-full">
                      {/* Search / Filters (VOX style) */}
                      <div className="p-3 flex-shrink-0" style={{ borderBottom: `1px solid ${BRD}` }}>
                        <div className="relative mb-2">
                          <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="ابحث عن المنتجات..."
                            className="w-full pr-9 pl-3 py-2 rounded-lg text-[11px] outline-none"
                            style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: `1px solid ${BRD}`, fontFamily: FONT }}
                          />
                        </div>
                        {activeNav === 'furniture' && (
                          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                            {[
                              { id: '', label: 'الكل' },
                              { id: 'chairs', label: 'كراسي' },
                              { id: 'sofas', label: 'كنب' },
                              { id: 'tables', label: 'طاولات' },
                              { id: 'bedroom', label: 'غرف نوم' },
                              { id: 'storage', label: 'خزائن' },
                            ].map(cat => (
                              <button
                                key={cat.id}
                                onClick={() => setSearchQuery(cat.id ? cat.label : '')}
                                className="px-3 py-1 rounded-md text-[10px] font-bold whitespace-nowrap transition-colors"
                                style={{
                                  background: searchQuery === cat.label || (!searchQuery && !cat.id) ? `${BLUE}20` : 'rgba(255,255,255,0.04)',
                                  color: searchQuery === cat.label || (!searchQuery && !cat.id) ? BLUE : 'rgba(255,255,255,0.4)',
                                  border: `1px solid ${searchQuery === cat.label || (!searchQuery && !cat.id) ? `${BLUE}40` : BRD}`,
                                }}
                              >
                                {cat.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Product list (VOX card style with images) */}
                      <div className="flex-1 overflow-y-auto p-3 space-y-2.5" style={{ scrollbarWidth: 'thin' }}>
                        {filteredCatalog.map((item, i) => (
                          <div
                            key={i}
                            className="rounded-xl overflow-hidden transition-all hover:scale-[1.01]"
                            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BRD}` }}
                          >
                            {/* Product image */}
                            <div className="relative h-28 overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold text-white/50"
                                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                              >
                                {(item.w * 100).toFixed(0)}x{(item.h * 100).toFixed(0)} سم
                              </div>
                            </div>

                            {/* Product info + ADD button */}
                            <div className="p-2.5">
                              <p className="text-[11px] font-bold text-white/80 mb-0.5">{item.name}</p>
                              <p className="text-[9px] text-white/35 mb-2">{item.nameEn}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold" style={{ color: GOLD }}>
                                  {item.price.toLocaleString()} {currency}
                                </span>
                                <button
                                  onClick={() => addFurniture(item)}
                                  className="px-4 py-1.5 rounded-md text-[10px] font-bold text-white transition-all hover:brightness-110 active:scale-95"
                                  style={{ background: BLUE }}
                                >
                                  إضافة
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {filteredCatalog.length === 0 && (
                          <div className="flex flex-col items-center py-10 text-white/30">
                            <Search size={24} className="mb-2 opacity-40" />
                            <p className="text-[11px] font-bold">لا توجد نتائج</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ CANVAS AREA ═══ */}
        <div className="flex-1 relative" style={{ minWidth: 0 }}>
          <canvas ref={canvasRef} className="w-full h-full touch-none" style={{ background: '#0f1520' }} />

          {/* Bottom hint (VOX style) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-lg z-10"
            style={{ background: `${BG1}cc`, border: `1px solid ${BRD}`, backdropFilter: 'blur(8px)' }}
          >
            <p className="text-[9px] text-white/30 font-semibold flex items-center gap-2">
              <Move size={10} />
              اسحب الأثاث لتحريكه داخل الغرفة
            </p>
          </div>

          {/* View controls (VOX top-right) */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
            <div className="flex items-center rounded-lg overflow-hidden" style={{ background: `${BG1}ee`, border: `1px solid ${BRD}` }}>
              <button
                className="px-3 py-1.5 text-[10px] font-bold"
                style={{ background: viewMode === '2d' ? BLUE : 'transparent', color: viewMode === '2d' ? '#fff' : 'rgba(255,255,255,0.4)' }}
                onClick={() => setViewMode('2d')}
              >
                2D
              </button>
              <button
                className="px-3 py-1.5 text-[10px] font-bold"
                style={{ background: viewMode === '3d' ? BLUE : 'transparent', color: viewMode === '3d' ? '#fff' : 'rgba(255,255,255,0.4)' }}
                onClick={() => setViewMode('3d')}
              >
                3D
              </button>
            </div>

            <div className="flex items-center gap-0.5 px-1 rounded-lg" style={{ background: `${BG1}ee`, border: `1px solid ${BRD}` }}>
              <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                <Eye size={12} className="text-white/40" />
              </button>
              <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                <Grid3x3 size={12} className="text-white/40" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══ LEFT: Properties Panel (VOX right panel equivalent) ═══ */}
        <AnimatePresence>
          {selectedItem && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 h-full overflow-hidden"
              style={{ background: BG1, borderRight: `1px solid ${BRD}` }}
            >
              <div className="w-[260px] h-full flex flex-col">
                {/* Selected item header */}
                <div className="p-4 flex-shrink-0" style={{ borderBottom: `1px solid ${BRD}` }}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-bold text-white/90 leading-tight">{selectedItem.name}</h3>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                    >
                      <X size={12} className="text-white/40" />
                    </button>
                  </div>
                  <p className="text-[10px] text-white/35 font-semibold">{selectedItem.nameEn}</p>
                </div>

                {/* Item image */}
                <div className="px-4 pt-3">
                  <div className="h-32 rounded-lg overflow-hidden mb-3" style={{ border: `1px solid ${BRD}` }}>
                    <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Position & Rotation (VOX style) */}
                <div className="px-4 space-y-3 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                  {/* Position */}
                  <div className="space-y-2">
                    {[
                      { label: 'الموضع X', value: Math.round(selectedItem.x * 100), unit: 'سم' },
                      { label: 'الموضع Y', value: Math.round(selectedItem.y * 100), unit: 'سم' },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between">
                        <span className="text-[10px] text-white/50 font-bold">{row.label}</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={row.value}
                            readOnly
                            className="w-16 text-center text-[11px] font-bold py-1 rounded outline-none"
                            style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: `1px solid ${BRD}` }}
                          />
                          <span className="text-[9px] text-white/30">{row.unit}</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50 font-bold">الدوران</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => rotateFurniture(selectedItem.id, -15)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
                          style={{ border: `1px solid ${BRD}` }}
                        >
                          <RotateCcw size={10} className="text-white/40" />
                        </button>
                        <input
                          type="number"
                          value={selectedItem.rotation}
                          readOnly
                          className="w-12 text-center text-[11px] font-bold py-1 rounded outline-none"
                          style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: `1px solid ${BRD}` }}
                        />
                        <button
                          onClick={() => rotateFurniture(selectedItem.id, 15)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
                          style={{ border: `1px solid ${BRD}` }}
                        >
                          <RotateCw size={10} className="text-white/40" />
                        </button>
                        <span className="text-[9px] text-white/30">°</span>
                      </div>
                    </div>
                  </div>

                  {/* Dimensions (VOX style) */}
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BRD}` }}>
                    <h4 className="text-[10px] font-bold text-white/60 mb-2">الأبعاد (سم)</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[9px] text-white/30">العرض</span>
                        <p className="text-[12px] font-bold text-white/80">{(selectedItem.w * 100).toFixed(0)}</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-white/30">العمق</span>
                        <p className="text-[12px] font-bold text-white/80">{(selectedItem.h * 100).toFixed(0)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="p-3 rounded-xl" style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}15` }}>
                    <span className="text-[10px] text-white/40 font-bold">السعر</span>
                    <p className="text-lg font-bold" style={{ color: GOLD }}>
                      {selectedItem.price.toLocaleString()} <span className="text-[11px]">{currency}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pb-4">
                    <button
                      onClick={() => {
                        addToCartShop({
                          id: `planner_${selectedItem.id}`, name: selectedItem.name, nameEn: selectedItem.nameEn,
                          price: selectedItem.price, image: selectedItem.image, category: selectedItem.category,
                        });
                        toast.success('تمت الإضافة لسلة المنصة', { duration: 1200, style: { background: BG2, color: '#fff', fontFamily: FONT } });
                      }}
                      className="w-full py-2.5 rounded-lg text-[11px] font-bold text-white flex items-center justify-center gap-2 transition-all hover:brightness-110"
                      style={{ background: BLUE }}
                    >
                      <ShoppingCart size={13} />
                      إضافة لسلة المنصة
                    </button>
                    <button
                      onClick={() => removeFurniture(selectedItem.id)}
                      className="w-full py-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-2 transition-colors hover:bg-red-500/20"
                      style={{ color: RED_ACCENT, border: `1px solid ${RED_ACCENT}30` }}
                    >
                      <Trash2 size={13} />
                      حذف من المخطط
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default HomePlanner;
