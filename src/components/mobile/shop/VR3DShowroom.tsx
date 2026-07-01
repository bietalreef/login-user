/**
 * VR3DShowroom.tsx — معرض ثلاثي الأبعاد احترافي
 * ─────────────────────────────────────────────
 * 6 نماذج أثاث ثلاثية الأبعاد حقيقية مع وضع VR تفاعلي
 * محرك رسم 3D مخصص بدون مكتبات خارجية
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import {
  X, RotateCw, ZoomIn, ZoomOut, Minimize2,
  Glasses, Info, ChevronLeft, ChevronRight,
  Move, Eye, Sun, Moon, RotateCcw, Box, Grid3x3,
} from 'lucide-react';
// Move3d not available in this lucide version
const Move3d = Move;
import { ImageWithFallback } from '../../figma/ImageWithFallback';

// ═══════════════════════════════════════
// 3D Math Types & Utilities
// ═══════════════════════════════════════
type Vec3 = [number, number, number];

interface Face3D {
  verts: number[];
  color: [number, number, number]; // RGB 0-255
  shininess?: number;
}

interface Model3D {
  vertices: Vec3[];
  faces: Face3D[];
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  material: string;
  materialEn: string;
  dimensions: string;
  dimensionsEn: string;
  image: string;
}

// Vector operations
function vecAdd(a: Vec3, b: Vec3): Vec3 { return [a[0]+b[0], a[1]+b[1], a[2]+b[2]]; }
function vecSub(a: Vec3, b: Vec3): Vec3 { return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]; }
function vecCross(a: Vec3, b: Vec3): Vec3 {
  return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
}
function vecDot(a: Vec3, b: Vec3): number { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }
function vecNormalize(v: Vec3): Vec3 {
  const l = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
  return l > 0 ? [v[0]/l, v[1]/l, v[2]/l] : [0,0,0];
}

function rotateX(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [v[0], v[1]*c - v[2]*s, v[1]*s + v[2]*c];
}
function rotateY(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [v[0]*c + v[2]*s, v[1], -v[0]*s + v[2]*c];
}

// Create a box (cuboid) mesh
function createBox(
  cx: number, cy: number, cz: number,
  w: number, h: number, d: number,
  color: [number,number,number],
  shininess = 0.3
): { vertices: Vec3[]; faces: Face3D[] } {
  const hw = w/2, hh = h/2, hd = d/2;
  const vertices: Vec3[] = [
    [cx-hw, cy-hh, cz-hd], [cx+hw, cy-hh, cz-hd],
    [cx+hw, cy+hh, cz-hd], [cx-hw, cy+hh, cz-hd],
    [cx-hw, cy-hh, cz+hd], [cx+hw, cy-hh, cz+hd],
    [cx+hw, cy+hh, cz+hd], [cx-hw, cy+hh, cz+hd],
  ];
  const faces: Face3D[] = [
    { verts: [0,1,2,3], color, shininess }, // front
    { verts: [5,4,7,6], color, shininess }, // back
    { verts: [4,0,3,7], color, shininess }, // left
    { verts: [1,5,6,2], color, shininess }, // right
    { verts: [3,2,6,7], color: [Math.min(255,color[0]+20), Math.min(255,color[1]+20), Math.min(255,color[2]+20)], shininess }, // top
    { verts: [4,5,1,0], color: [Math.max(0,color[0]-30), Math.max(0,color[1]-30), Math.max(0,color[2]-30)], shininess }, // bottom
  ];
  return { vertices, faces };
}

// Create a cylinder mesh
function createCylinder(
  cx: number, cy: number, cz: number,
  radius: number, height: number,
  segments: number,
  color: [number,number,number],
  shininess = 0.5
): { vertices: Vec3[]; faces: Face3D[] } {
  const vertices: Vec3[] = [];
  const faces: Face3D[] = [];
  const hh = height / 2;

  // Bottom and top circle vertices
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = cx + Math.cos(angle) * radius;
    const z = cz + Math.sin(angle) * radius;
    vertices.push([x, cy - hh, z]); // bottom
    vertices.push([x, cy + hh, z]); // top
  }

  // Side faces
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    faces.push({
      verts: [i*2, next*2, next*2+1, i*2+1],
      color,
      shininess,
    });
  }

  // Top cap
  const topCenter = vertices.length;
  vertices.push([cx, cy + hh, cz]);
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    faces.push({
      verts: [topCenter, i*2+1, next*2+1],
      color: [Math.min(255,color[0]+15), Math.min(255,color[1]+15), Math.min(255,color[2]+15)],
      shininess,
    });
  }

  // Bottom cap
  const botCenter = vertices.length;
  vertices.push([cx, cy - hh, cz]);
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    faces.push({
      verts: [botCenter, next*2, i*2],
      color: [Math.max(0,color[0]-20), Math.max(0,color[1]-20), Math.max(0,color[2]-20)],
      shininess,
    });
  }

  return { vertices, faces };
}

// Merge multiple meshes
function mergeMeshes(...meshes: { vertices: Vec3[]; faces: Face3D[] }[]): { vertices: Vec3[]; faces: Face3D[] } {
  const allVerts: Vec3[] = [];
  const allFaces: Face3D[] = [];
  let offset = 0;
  for (const m of meshes) {
    allVerts.push(...m.vertices);
    for (const f of m.faces) {
      allFaces.push({ ...f, verts: f.verts.map(v => v + offset) });
    }
    offset += m.vertices.length;
  }
  return { vertices: allVerts, faces: allFaces };
}

// ═══════════════════════════════════════
// 3D Furniture Model Generators
// ═══════════════════════════════════════

function createMarbleTable(): { vertices: Vec3[]; faces: Face3D[] } {
  const marble: [number,number,number] = [235, 225, 215];
  const marbleAccent: [number,number,number] = [200, 190, 175];
  const gold: [number,number,number] = [195, 165, 75];

  const top = createBox(0, 0.85, 0, 1.4, 0.08, 0.8, marble, 0.8);
  const topEdge = createBox(0, 0.79, 0, 1.44, 0.04, 0.84, marbleAccent, 0.7);
  const leg1 = createCylinder(-0.5, 0.38, -0.25, 0.04, 0.78, 8, gold, 0.9);
  const leg2 = createCylinder(0.5, 0.38, -0.25, 0.04, 0.78, 8, gold, 0.9);
  const leg3 = createCylinder(-0.5, 0.38, 0.25, 0.04, 0.78, 8, gold, 0.9);
  const leg4 = createCylinder(0.5, 0.38, 0.25, 0.04, 0.78, 8, gold, 0.9);
  const crossBar = createBox(0, 0.2, 0, 1.0, 0.03, 0.03, gold, 0.9);
  const crossBar2 = createBox(0, 0.2, 0, 0.03, 0.03, 0.5, gold, 0.9);

  return mergeMeshes(top, topEdge, leg1, leg2, leg3, leg4, crossBar, crossBar2);
}

function createSofa(): { vertices: Vec3[]; faces: Face3D[] } {
  const leather: [number,number,number] = [85, 65, 50];
  const leatherDark: [number,number,number] = [65, 48, 35];
  const wood: [number,number,number] = [110, 75, 45];
  const cushion: [number,number,number] = [95, 75, 58];

  const base = createBox(0, 0.22, 0, 2.0, 0.35, 0.85, leather, 0.4);
  const back = createBox(0, 0.65, -0.35, 2.0, 0.55, 0.15, leatherDark, 0.3);
  const armL = createBox(-0.92, 0.42, 0.05, 0.18, 0.45, 0.7, leatherDark, 0.3);
  const armR = createBox(0.92, 0.42, 0.05, 0.18, 0.45, 0.7, leatherDark, 0.3);
  
  // Seat cushions
  const cush1 = createBox(-0.42, 0.43, 0.05, 0.72, 0.1, 0.6, cushion, 0.3);
  const cush2 = createBox(0.42, 0.43, 0.05, 0.72, 0.1, 0.6, cushion, 0.3);
  
  // Back cushions
  const bcush1 = createBox(-0.42, 0.62, -0.25, 0.65, 0.35, 0.1, cushion, 0.3);
  const bcush2 = createBox(0.42, 0.62, -0.25, 0.65, 0.35, 0.1, cushion, 0.3);
  
  // Feet
  const foot1 = createBox(-0.85, 0.03, 0.3, 0.08, 0.06, 0.08, wood, 0.5);
  const foot2 = createBox(0.85, 0.03, 0.3, 0.08, 0.06, 0.08, wood, 0.5);
  const foot3 = createBox(-0.85, 0.03, -0.3, 0.08, 0.06, 0.08, wood, 0.5);
  const foot4 = createBox(0.85, 0.03, -0.3, 0.08, 0.06, 0.08, wood, 0.5);

  return mergeMeshes(base, back, armL, armR, cush1, cush2, bcush1, bcush2, foot1, foot2, foot3, foot4);
}

function createChair(): { vertices: Vec3[]; faces: Face3D[] } {
  const wood: [number,number,number] = [160, 110, 60];
  const woodDark: [number,number,number] = [130, 85, 45];
  const fabric: [number,number,number] = [60, 90, 80];

  const seat = createBox(0, 0.48, 0, 0.5, 0.06, 0.5, fabric, 0.3);
  const backRest = createBox(0, 0.82, -0.22, 0.46, 0.62, 0.05, wood, 0.5);
  const backSlat1 = createBox(-0.12, 0.78, -0.2, 0.06, 0.45, 0.04, woodDark, 0.5);
  const backSlat2 = createBox(0.12, 0.78, -0.2, 0.06, 0.45, 0.04, woodDark, 0.5);
  const leg1 = createBox(-0.2, 0.22, 0.2, 0.05, 0.46, 0.05, wood, 0.5);
  const leg2 = createBox(0.2, 0.22, 0.2, 0.05, 0.46, 0.05, wood, 0.5);
  const leg3 = createBox(-0.2, 0.22, -0.2, 0.05, 0.46, 0.05, wood, 0.5);
  const leg4 = createBox(0.2, 0.22, -0.2, 0.05, 0.46, 0.05, wood, 0.5);
  
  // Cross bars
  const crossF = createBox(0, 0.12, 0.2, 0.35, 0.03, 0.03, woodDark, 0.4);
  const crossB = createBox(0, 0.12, -0.2, 0.35, 0.03, 0.03, woodDark, 0.4);
  const crossL = createBox(-0.2, 0.12, 0, 0.03, 0.03, 0.35, woodDark, 0.4);
  const crossR = createBox(0.2, 0.12, 0, 0.03, 0.03, 0.35, woodDark, 0.4);

  return mergeMeshes(seat, backRest, backSlat1, backSlat2, leg1, leg2, leg3, leg4, crossF, crossB, crossL, crossR);
}

function createWardrobe(): { vertices: Vec3[]; faces: Face3D[] } {
  const wood: [number,number,number] = [140, 100, 65];
  const woodLight: [number,number,number] = [170, 130, 85];
  const handle: [number,number,number] = [195, 165, 75];
  const interior: [number,number,number] = [200, 185, 165];

  const body = createBox(0, 0.65, 0, 1.2, 1.3, 0.55, wood, 0.4);
  const top = createBox(0, 1.33, 0, 1.26, 0.06, 0.58, woodLight, 0.5);
  const base = createBox(0, 0.03, 0, 1.26, 0.06, 0.58, woodLight, 0.5);
  
  // Doors
  const doorL = createBox(-0.3, 0.65, 0.28, 0.58, 1.2, 0.03, woodLight, 0.45);
  const doorR = createBox(0.3, 0.65, 0.28, 0.58, 1.2, 0.03, woodLight, 0.45);
  
  // Door line (center)
  const divider = createBox(0, 0.65, 0.295, 0.02, 1.22, 0.02, wood, 0.3);
  
  // Handles
  const handleL = createBox(-0.05, 0.65, 0.31, 0.02, 0.12, 0.03, handle, 0.9);
  const handleR = createBox(0.05, 0.65, 0.31, 0.02, 0.12, 0.03, handle, 0.9);
  
  // Feet
  const foot1 = createBox(-0.52, -0.02, 0.2, 0.1, 0.04, 0.1, woodLight, 0.4);
  const foot2 = createBox(0.52, -0.02, 0.2, 0.1, 0.04, 0.1, woodLight, 0.4);
  const foot3 = createBox(-0.52, -0.02, -0.2, 0.1, 0.04, 0.1, woodLight, 0.4);
  const foot4 = createBox(0.52, -0.02, -0.2, 0.1, 0.04, 0.1, woodLight, 0.4);

  // Crown molding
  const crown = createBox(0, 1.37, 0, 1.3, 0.03, 0.6, handle, 0.8);

  return mergeMeshes(body, top, base, doorL, doorR, divider, handleL, handleR, foot1, foot2, foot3, foot4, crown);
}

function createBed(): { vertices: Vec3[]; faces: Face3D[] } {
  const frame: [number,number,number] = [130, 90, 55];
  const frameDark: [number,number,number] = [100, 68, 40];
  const mattress: [number,number,number] = [240, 235, 225];
  const pillow: [number,number,number] = [245, 240, 232];
  const sheet: [number,number,number] = [215, 205, 190];
  const headboard: [number,number,number] = [80, 60, 45];

  // Frame
  const frameBase = createBox(0, 0.18, 0, 1.8, 0.22, 1.4, frame, 0.4);
  // Headboard
  const hb = createBox(0, 0.7, -0.65, 1.82, 0.85, 0.1, headboard, 0.3);
  const hbCap = createBox(0, 1.15, -0.65, 1.86, 0.06, 0.14, frameDark, 0.5);
  // Footboard
  const fb = createBox(0, 0.35, 0.68, 1.82, 0.24, 0.06, frame, 0.4);
  // Mattress
  const matt = createBox(0, 0.38, 0, 1.7, 0.18, 1.25, mattress, 0.2);
  // Sheet
  const sh = createBox(0, 0.48, 0.15, 1.68, 0.04, 0.85, sheet, 0.2);
  // Pillows
  const p1 = createBox(-0.45, 0.52, -0.42, 0.55, 0.1, 0.3, pillow, 0.2);
  const p2 = createBox(0.45, 0.52, -0.42, 0.55, 0.1, 0.3, pillow, 0.2);
  // Legs
  const l1 = createBox(-0.82, 0.04, 0.62, 0.08, 0.08, 0.08, frameDark, 0.5);
  const l2 = createBox(0.82, 0.04, 0.62, 0.08, 0.08, 0.08, frameDark, 0.5);
  const l3 = createBox(-0.82, 0.04, -0.62, 0.08, 0.08, 0.08, frameDark, 0.5);
  const l4 = createBox(0.82, 0.04, -0.62, 0.08, 0.08, 0.08, frameDark, 0.5);

  return mergeMeshes(frameBase, hb, hbCap, fb, matt, sh, p1, p2, l1, l2, l3, l4);
}

function createDesk(): { vertices: Vec3[]; faces: Face3D[] } {
  const wood: [number,number,number] = [160, 120, 70];
  const woodDark: [number,number,number] = [120, 85, 50];
  const metal: [number,number,number] = [60, 60, 65];
  const drawer: [number,number,number] = [145, 108, 62];
  const handle: [number,number,number] = [180, 155, 65];

  // Desktop
  const top = createBox(0, 0.78, 0, 1.5, 0.05, 0.7, wood, 0.6);
  const topEdge = createBox(0, 0.74, 0, 1.52, 0.03, 0.72, woodDark, 0.5);
  
  // Left panel
  const panelL = createBox(-0.7, 0.38, 0, 0.05, 0.72, 0.65, wood, 0.4);
  
  // Right drawer unit
  const drawerBody = createBox(0.55, 0.38, 0, 0.35, 0.72, 0.65, wood, 0.4);
  const drawer1 = createBox(0.55, 0.58, 0.33, 0.3, 0.2, 0.02, drawer, 0.35);
  const drawer2 = createBox(0.55, 0.32, 0.33, 0.3, 0.2, 0.02, drawer, 0.35);
  
  // Drawer handles
  const h1 = createBox(0.55, 0.58, 0.355, 0.1, 0.02, 0.02, handle, 0.9);
  const h2 = createBox(0.55, 0.32, 0.355, 0.1, 0.02, 0.02, handle, 0.9);
  
  // Back panel
  const back = createBox(0, 0.38, -0.33, 1.45, 0.7, 0.03, woodDark, 0.3);
  
  // Metal legs
  const legL1 = createBox(-0.7, 0.03, 0.28, 0.04, 0.06, 0.04, metal, 0.7);
  const legL2 = createBox(-0.7, 0.03, -0.28, 0.04, 0.06, 0.04, metal, 0.7);
  const legR1 = createBox(0.72, 0.03, 0.28, 0.04, 0.06, 0.04, metal, 0.7);
  const legR2 = createBox(0.72, 0.03, -0.28, 0.04, 0.06, 0.04, metal, 0.7);

  return mergeMeshes(top, topEdge, panelL, drawerBody, drawer1, drawer2, h1, h2, back, legL1, legL2, legR1, legR2);
}

// ═══════════════════════════════════════
// All 6 Models
// ═══════════════════════════════════════
const MODELS: Model3D[] = [
  {
    ...createMarbleTable(),
    name: 'طاولة رخام إيطالي',
    nameEn: 'Italian Marble Table',
    description: 'طاولة قهوة من رخام كرارا الإيطالي الأصلي مع أرجل ذهبية مطلية',
    descriptionEn: 'Coffee table made of genuine Italian Carrara marble with gold-plated legs',
    price: 2800,
    material: 'رخام كرارا + ذهب مطلي',
    materialEn: 'Carrara Marble + Gold Plated',
    dimensions: '140 × 80 × 45 سم',
    dimensionsEn: '140 × 80 × 45 cm',
    image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400&h=300&fit=crop',
  },
  {
    ...createSofa(),
    name: 'كنبة جلد طبيعي',
    nameEn: 'Genuine Leather Sofa',
    description: 'كنبة فاخرة من الجلد الطبيعي بتصميم إيطالي عصري مع وسائد مريحة',
    descriptionEn: 'Luxury genuine leather sofa with modern Italian design and comfortable cushions',
    price: 8500,
    material: 'جلد طبيعي إيطالي',
    materialEn: 'Italian Genuine Leather',
    dimensions: '200 × 85 × 90 سم',
    dimensionsEn: '200 × 85 × 90 cm',
    image: 'https://images.unsplash.com/photo-1759722665935-0967b4e0da93?w=400&h=300&fit=crop',
  },
  {
    ...createChair(),
    name: 'كرسي خشب كلاسيكي',
    nameEn: 'Classic Wooden Chair',
    description: 'كرسي من خشب البلوط الطبيعي بمقعد مُنجّد بقماش فاخر',
    descriptionEn: 'Natural oak wood chair with premium upholstered fabric seat',
    price: 1200,
    material: 'خشب بلوط + قماش مُنجّد',
    materialEn: 'Oak Wood + Upholstered Fabric',
    dimensions: '50 × 50 × 95 سم',
    dimensionsEn: '50 × 50 × 95 cm',
    image: 'https://images.unsplash.com/photo-1758977403438-1b8546560d31?w=400&h=300&fit=crop',
  },
  {
    ...createWardrobe(),
    name: 'خزانة ملابس فاخرة',
    nameEn: 'Luxury Wardrobe',
    description: 'خزانة ملابس من خشب الجوز مع إكليل ذهبي وأبواب مزدوجة',
    descriptionEn: 'Walnut wood wardrobe with gold crown molding and double doors',
    price: 6200,
    material: 'خشب جوز + إكسسوارات ذهبية',
    materialEn: 'Walnut Wood + Gold Accessories',
    dimensions: '120 × 55 × 200 سم',
    dimensionsEn: '120 × 55 × 200 cm',
    image: 'https://images.unsplash.com/photo-1770085196443-bfa169a75d79?w=400&h=300&fit=crop',
  },
  {
    ...createBed(),
    name: 'سرير ملكي فاخر',
    nameEn: 'Royal Luxury Bed',
    description: 'سرير بحجم كينغ مع رأسية مُنجّدة بالجلد ومرتبة طبية',
    descriptionEn: 'King-size bed with leather-upholstered headboard and orthopedic mattress',
    price: 12000,
    material: 'خشب زان + جلد + مرتبة طبية',
    materialEn: 'Beech Wood + Leather + Orthopedic',
    dimensions: '180 × 200 × 120 سم',
    dimensionsEn: '180 × 200 × 120 cm',
    image: 'https://images.unsplash.com/photo-1680503146476-abb8c752e1f4?w=400&h=300&fit=crop',
  },
  {
    ...createDesk(),
    name: 'مكتب عمل حديث',
    nameEn: 'Modern Work Desk',
    description: 'مكتب عمل من خشب البلوط مع وحدة أدراج وأرجل معدنية',
    descriptionEn: 'Oak wood work desk with drawer unit and metal legs',
    price: 3500,
    material: 'خشب بلوط + معدن',
    materialEn: 'Oak Wood + Metal',
    dimensions: '150 × 70 × 78 سم',
    dimensionsEn: '150 × 70 × 78 cm',
    image: 'https://images.unsplash.com/photo-1621743018966-29194999d736?w=400&h=300&fit=crop',
  },
];

// ═══════════════════════════════════════
// 3D Canvas Renderer
// ═══════════════════════════════════════
function render3D(
  ctx: CanvasRenderingContext2D,
  model: Model3D,
  rotX: number,
  rotY: number,
  zoom: number,
  width: number,
  height: number,
  lightAngle: number,
  showGrid: boolean,
  bgColor: string,
) {
  ctx.clearRect(0, 0, width, height);

  // Background gradient
  const bgGrad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width*0.7);
  if (bgColor === 'dark') {
    bgGrad.addColorStop(0, '#1e2028');
    bgGrad.addColorStop(1, '#0d0e12');
  } else {
    bgGrad.addColorStop(0, '#f7f2ea');
    bgGrad.addColorStop(1, '#e8dfcf');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Grid floor
  if (showGrid) {
    const gridY = 0;
    const gridSize = 3;
    const gridStep = 0.3;
    const isDark = bgColor === 'dark';
    ctx.strokeStyle = isDark ? 'rgba(42,166,118,0.08)' : 'rgba(42,166,118,0.12)';
    ctx.lineWidth = 0.5;

    for (let x = -gridSize; x <= gridSize; x += gridStep) {
      for (let z = -gridSize; z <= gridSize; z += gridStep) {
        const v1 = project3D([x, gridY, z], rotX, rotY, zoom, width, height);
        const v2 = project3D([x + gridStep, gridY, z], rotX, rotY, zoom, width, height);
        const v3 = project3D([x, gridY, z + gridStep], rotX, rotY, zoom, width, height);
        if (v1 && v2) {
          ctx.beginPath();
          ctx.moveTo(v1[0], v1[1]);
          ctx.lineTo(v2[0], v2[1]);
          ctx.stroke();
        }
        if (v1 && v3) {
          ctx.beginPath();
          ctx.moveTo(v1[0], v1[1]);
          ctx.lineTo(v3[0], v3[1]);
          ctx.stroke();
        }
      }
    }
  }

  // Ground shadow (soft ellipse)
  const shadowCenter = project3D([0, -0.02, 0], rotX, rotY, zoom, width, height);
  if (shadowCenter) {
    const shadowGrad = ctx.createRadialGradient(shadowCenter[0], shadowCenter[1], 0, shadowCenter[0], shadowCenter[1], zoom * 120);
    shadowGrad.addColorStop(0, 'rgba(0,0,0,0.15)');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(shadowCenter[0], shadowCenter[1], zoom * 120, zoom * 40, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Light direction
  const lightDir = vecNormalize([
    Math.cos(lightAngle) * 0.7,
    0.8,
    Math.sin(lightAngle) * 0.5,
  ]);

  // Transform and sort faces
  const transformedFaces: {
    projVerts: [number, number][];
    depth: number;
    color: [number, number, number];
    shininess: number;
    normal: Vec3;
  }[] = [];

  for (const face of model.faces) {
    const transformed = face.verts.map(vi => {
      let v = model.vertices[vi];
      v = rotateY(v, rotY);
      v = rotateX(v, rotX);
      return v;
    });

    // Face normal
    if (transformed.length < 3) continue;
    const edge1 = vecSub(transformed[1], transformed[0]);
    const edge2 = vecSub(transformed[2], transformed[0]);
    const normal = vecNormalize(vecCross(edge1, edge2));

    // Back-face culling
    const viewDir: Vec3 = [0, 0, -1];
    if (vecDot(normal, viewDir) > 0.05) continue;

    // Project
    const projVerts = transformed.map(v => project3D_raw(v, zoom, width, height)).filter(Boolean) as [number, number][];
    if (projVerts.length < 3) continue;

    // Depth (average Z)
    const avgZ = transformed.reduce((sum, v) => sum + v[2], 0) / transformed.length;

    transformedFaces.push({
      projVerts,
      depth: avgZ,
      color: face.color,
      shininess: face.shininess || 0.3,
      normal,
    });
  }

  // Sort by depth (painter's algorithm)
  transformedFaces.sort((a, b) => a.depth - b.depth);

  // Render faces
  for (const face of transformedFaces) {
    const dot = Math.max(0, vecDot(face.normal, lightDir));
    const ambient = 0.35;
    const diffuse = dot * 0.55;
    const specular = Math.pow(Math.max(0, dot), 32) * face.shininess * 0.6;

    const light = ambient + diffuse;
    const r = Math.min(255, Math.round(face.color[0] * light + specular * 255));
    const g = Math.min(255, Math.round(face.color[1] * light + specular * 255));
    const b = Math.min(255, Math.round(face.color[2] * light + specular * 255));

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.strokeStyle = `rgba(${Math.max(0, r-40)},${Math.max(0, g-40)},${Math.max(0, b-40)}, 0.4)`;
    ctx.lineWidth = 0.5;

    ctx.beginPath();
    ctx.moveTo(face.projVerts[0][0], face.projVerts[0][1]);
    for (let i = 1; i < face.projVerts.length; i++) {
      ctx.lineTo(face.projVerts[i][0], face.projVerts[i][1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

function project3D(v: Vec3, rotX: number, rotY: number, zoom: number, w: number, h: number): [number, number] | null {
  let transformed = rotateY(v, rotY);
  transformed = rotateX(transformed, rotX);
  return project3D_raw(transformed, zoom, w, h);
}

function project3D_raw(v: Vec3, zoom: number, w: number, h: number): [number, number] | null {
  const fov = 3.5;
  const distance = fov;
  const z = v[2] + distance;
  if (z <= 0.1) return null;
  const scale = (distance / z) * zoom * Math.min(w, h) * 0.35;
  return [w / 2 + v[0] * scale, h / 2 - v[1] * scale + h * 0.08];
}

// ═══════════════════════════════════════
// VR 3D Showroom Component
// ═══════════════════════════════════════
interface VR3DShowroomProps {
  onClose: () => void;
  isEn?: boolean;
}

export function VR3DShowroom({ onClose, isEn = false }: VR3DShowroomProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedModel, setSelectedModel] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [vrMode, setVrMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [darkBg, setDarkBg] = useState(true);
  const [, forceUpdate] = useState(0);

  // Use refs for continuously animated values (no re-renders)
  const rotYRef = useRef(0.5);
  const rotXRef = useRef(-0.3);
  const zoomRef = useRef(1.0);
  const lightAngleRef = useRef(0.8);
  const autoRotateRef = useRef(true);
  const showGridRef = useRef(true);
  const darkBgRef = useRef(true);
  const selectedModelRef = useRef(0);

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const rotAtDragStart = useRef({ x: 0, y: 0 });

  const model = MODELS[selectedModel];
  const fontFamily = 'Cairo, sans-serif';

  // Sync state -> refs
  useEffect(() => { autoRotateRef.current = autoRotate; }, [autoRotate]);
  useEffect(() => { showGridRef.current = showGrid; }, [showGrid]);
  useEffect(() => { darkBgRef.current = darkBg; }, [darkBg]);
  useEffect(() => { selectedModelRef.current = selectedModel; }, [selectedModel]);

  // Rendering loop — runs independently via refs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let running = true;

    function animate(now: number) {
      if (!running) return;
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (autoRotateRef.current && !isDragging.current) {
        rotYRef.current += dt * 0.5;
        lightAngleRef.current += dt * 0.2;
      }

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas!.width = rect.width * dpr;
        canvas!.height = rect.height * dpr;
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

        render3D(
          ctx!,
          MODELS[selectedModelRef.current],
          rotXRef.current,
          rotYRef.current,
          zoomRef.current,
          rect.width,
          rect.height,
          lightAngleRef.current,
          showGridRef.current,
          darkBgRef.current ? 'dark' : 'light',
        );
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, []);

  // Drag handlers
  const handlePointerDown = useCallback((clientX: number, clientY: number) => {
    isDragging.current = true;
    dragStart.current = { x: clientX, y: clientY };
    rotAtDragStart.current = { x: rotXRef.current, y: rotYRef.current };
  }, []);

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    rotYRef.current = rotAtDragStart.current.y + dx * 0.008;
    rotXRef.current = Math.max(-1.2, Math.min(0.8, rotAtDragStart.current.x + dy * 0.006));
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Zoom with wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    zoomRef.current = Math.max(0.4, Math.min(3.0, zoomRef.current - e.deltaY * 0.002));
  }, []);

  // VR Mode toggle
  const toggleVR = useCallback(() => {
    setVrMode(prev => {
      if (!prev) {
        setDarkBg(true);
        darkBgRef.current = true;
        zoomRef.current = 1.2;
        setShowGrid(false);
        showGridRef.current = false;
      } else {
        setShowGrid(true);
        showGridRef.current = true;
        zoomRef.current = 1.0;
      }
      return !prev;
    });
  }, []);

  const resetView = useCallback(() => {
    rotXRef.current = -0.3;
    rotYRef.current = 0.5;
    zoomRef.current = 1.0;
    setAutoRotate(true);
    autoRotateRef.current = true;
  }, []);

  const currency = isEn ? 'AED' : 'د.إ';

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex flex-col ${vrMode ? 'bg-black' : 'bg-[#111318]'}`}
      style={{ fontFamily }}
    >
      {/* ─── Top Bar ─── */}
      {!vrMode && (
        <div className="flex items-center justify-between px-4 py-3 bg-[#111318]/95 backdrop-blur-md border-b border-white/5 z-20">
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="text-center">
            <h1 className="text-[#D4AF37] text-lg" style={{ fontWeight: 800 }}>
              {isEn ? '3D Showroom' : 'المعرض ثلاثي الأبعاد'}
            </h1>
            <p className="text-white/40 text-[10px]" style={{ fontWeight: 600 }}>
              {isEn ? '6 Premium Furniture Models' : '٦ نماذج أثاث فاخرة'}
            </p>
          </div>
          <button
            onClick={toggleVR}
            className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center hover:bg-[#D4AF37]/30 transition-colors"
          >
            <Glasses className="w-5 h-5 text-[#D4AF37]" />
          </button>
        </div>
      )}

      {/* ─── 3D Canvas ─── */}
      <div
        className={`flex-1 relative select-none ${vrMode ? '' : 'mx-2 my-2 rounded-2xl overflow-hidden'}`}
        style={{ touchAction: 'none' }}
        onMouseDown={(e) => { e.preventDefault(); handlePointerDown(e.clientX, e.clientY); }}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => { e.preventDefault(); handlePointerMove(e.touches[0].clientX, e.touches[0].clientY); }}
        onTouchEnd={handlePointerUp}
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ imageRendering: 'auto' }}
        />

        {/* VR Mode overlay controls */}
        {vrMode && (
          <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-4 z-20">
            <button onClick={toggleVR} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10">
              <Minimize2 className="w-5 h-5 text-white" />
            </button>
            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <span className="text-[#D4AF37] text-sm" style={{ fontWeight: 700 }}>
                {isEn ? 'VR Mode' : 'وضع الواقع الافتراضي'}
              </span>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        {/* Model name overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10">
            <p className="text-white text-center text-sm" style={{ fontWeight: 700 }}>
              {isEn ? model.nameEn : model.name}
            </p>
            <p className="text-[#D4AF37] text-center text-xs mt-0.5" style={{ fontWeight: 800 }}>
              {model.price.toLocaleString()} {currency}
            </p>
          </div>
        </div>

        {/* Drag hint */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5">
            <div className="flex items-center gap-2">
              <Move3d className="w-3 h-3 text-[#D4AF37]" />
              <span className="text-white/50 text-[10px]" style={{ fontWeight: 600 }}>
                {isEn ? 'Drag to rotate · Scroll to zoom' : 'اسحب للتدوير · مرر للتكبير'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Controls Bar ─── */}
      {!vrMode && (
        <div className="px-3 py-2 bg-[#111318]/95 backdrop-blur-md border-t border-white/5 flex items-center justify-center gap-1.5 z-20">
          <button
            onClick={() => setAutoRotate(p => !p)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${autoRotate ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/8 text-white/40'}`}
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => { zoomRef.current = Math.min(3, zoomRef.current + 0.2); }}
            className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center text-white/50 hover:bg-white/12 hover:text-white transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => { zoomRef.current = Math.max(0.4, zoomRef.current - 0.2); }}
            className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center text-white/50 hover:bg-white/12 hover:text-white transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <button
            onClick={() => setShowGrid(p => !p)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${showGrid ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/8 text-white/40'}`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDarkBg(p => !p)}
            className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center text-white/50 hover:bg-white/12 hover:text-white transition-colors"
          >
            {darkBg ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={resetView}
            className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center text-white/50 hover:bg-white/12 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowInfo(p => !p)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${showInfo ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/8 text-white/40'}`}
          >
            <Info className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <button
            onClick={toggleVR}
            className="px-3 h-9 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8940E] flex items-center gap-1.5 text-white transition-all hover:opacity-90"
          >
            <Glasses className="w-4 h-4" />
            <span className="text-xs" style={{ fontWeight: 700 }}>VR</span>
          </button>
        </div>
      )}

      {/* ─── Info Panel ─── */}
      {showInfo && !vrMode && (
        <div className="absolute left-3 top-20 w-64 bg-[#1a1c22]/95 backdrop-blur-xl rounded-2xl border border-white/10 p-4 z-30 shadow-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10">
              <ImageWithFallback src={model.image} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-sm" style={{ fontWeight: 800 }}>{isEn ? model.nameEn : model.name}</h3>
              <p className="text-[#D4AF37] text-lg" style={{ fontWeight: 800 }}>
                {model.price.toLocaleString()} {currency}
              </p>
            </div>
          </div>
          <p className="text-white/60 text-xs leading-relaxed mb-3" style={{ fontWeight: 500 }}>
            {isEn ? model.descriptionEn : model.description}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-[11px]" style={{ fontWeight: 600 }}>{isEn ? 'Material' : 'المادة'}</span>
              <span className="text-white/80 text-[11px]" style={{ fontWeight: 700 }}>{isEn ? model.materialEn : model.material}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-[11px]" style={{ fontWeight: 600 }}>{isEn ? 'Dimensions' : 'الأبعاد'}</span>
              <span className="text-white/80 text-[11px]" style={{ fontWeight: 700 }}>{isEn ? model.dimensionsEn : model.dimensions}</span>
            </div>
          </div>
          <button
            onClick={() => setShowInfo(false)}
            className="mt-3 w-full py-2 rounded-xl bg-white/5 text-white/50 text-xs hover:bg-white/10 transition-colors"
            style={{ fontWeight: 600 }}
          >
            {isEn ? 'Close' : 'إغلاق'}
          </button>
        </div>
      )}

      {/* ─── Model Selection Strip ─── */}
      {!vrMode && (
        <div className="px-2 py-3 bg-[#111318] border-t border-white/5 z-20">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {MODELS.map((m, i) => (
              <button
                key={m.name}
                onClick={() => {
                  setSelectedModel(i);
                  selectedModelRef.current = i;
                  rotYRef.current = 0.5;
                  rotXRef.current = -0.3;
                  zoomRef.current = 1.0;
                }}
                className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  i === selectedModel
                    ? 'border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                    : 'border-white/8 hover:border-white/20'
                }`}
                style={{ width: 72, height: 72 }}
              >
                <div className="w-full h-full relative">
                  <ImageWithFallback src={m.image} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 ${i === selectedModel ? 'bg-[#D4AF37]/10' : 'bg-black/30'}`} />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                    <p className="text-white text-[8px] text-center truncate" style={{ fontWeight: 700 }}>
                      {isEn ? m.nameEn : m.name}
                    </p>
                    <p className="text-[#D4AF37] text-[7px] text-center" style={{ fontWeight: 800 }}>
                      {m.price.toLocaleString()}
                    </p>
                  </div>
                  {i === selectedModel && (
                    <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#D4AF37] flex items-center justify-center">
                      <Eye className="w-2 h-2 text-black" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="flex justify-center items-center gap-4 mt-2">
            <button
              onClick={() => setSelectedModel(p => (p - 1 + MODELS.length) % MODELS.length)}
              className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/50 hover:bg-white/15 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {MODELS.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === selectedModel
                      ? 'w-5 h-1.5 bg-[#D4AF37]'
                      : 'w-1.5 h-1.5 bg-white/20'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setSelectedModel(p => (p + 1) % MODELS.length)}
              className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/50 hover:bg-white/15 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VR Bottom nav */}
      {vrMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {MODELS.map((m, i) => (
            <button
              key={m.name}
              onClick={() => {
                setSelectedModel(i);
                selectedModelRef.current = i;
                rotYRef.current = 0.5;
              }}
              className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                i === selectedModel ? 'border-[#D4AF37] scale-110' : 'border-white/10 opacity-60'
              }`}
            >
              <ImageWithFallback src={m.image} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}