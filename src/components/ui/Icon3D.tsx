/**
 * Icon3D.tsx — نظام أيقونات ثلاثية الأبعاد بستايل Clay
 * ═════════════════════════════════════════════════════
 * أيقونات بتأثير 3D واقعي: ظلال متعددة الطبقات، تدرجات، عمق
 * مستوحى من "FREE 3D Design Icon pack" — Figma Community
 */

import { type CSSProperties } from 'react';
import {
  FileText, Receipt, FileSignature, Calculator, DollarSign,
  Palette, PenTool, Box, RotateCw, LayoutGrid, Lightbulb,
  Megaphone, Users, Home, Wrench, ShoppingCart, MapPin,
  Ruler, Flame, Hammer, Building2, HardHat, Compass,
  Truck, Package, Sofa, Wallet, User,
  Layers, MessageCircle, Paintbrush, Settings,
  Sparkles, Cpu, Star, Zap, Droplets, Wind, Award,
  Shield, Gem, Search, Bell, Heart,
} from 'lucide-react';
// Bot & Crown not available in this lucide version — using safe aliases
const Bot = Cpu;
const Crown = Award;

// ═══════════════════════════════════════
// 3D Color Themes
// ═══════════════════════════════════════
export interface Icon3DTheme {
  /** Main face gradient - top color */
  faceTop: string;
  /** Main face gradient - bottom color */
  faceBottom: string;
  /** Side/depth color (darker) */
  depth: string;
  /** Highlight/shine color */
  shine: string;
  /** Shadow color for elevation */
  shadow: string;
  /** Icon color (typically white) */
  iconColor: string;
}

const THEMES: Record<string, Icon3DTheme> = {
  blue:    { faceTop: '#5B9CF6', faceBottom: '#3B7AE8', depth: '#2A5DB8', shine: 'rgba(255,255,255,0.4)', shadow: 'rgba(59,122,232,0.35)', iconColor: '#fff' },
  green:   { faceTop: '#E8C860', faceBottom: '#D4AF37', depth: '#B8940E', shine: 'rgba(255,255,255,0.4)', shadow: 'rgba(212,175,55,0.35)', iconColor: '#fff' },
  purple:  { faceTop: '#9B7AED', faceBottom: '#7C5ADA', depth: '#5E3EBF', shine: 'rgba(255,255,255,0.4)', shadow: 'rgba(124,90,218,0.35)', iconColor: '#fff' },
  teal:    { faceTop: '#4ECDC4', faceBottom: '#26A69A', depth: '#1D8A7F', shine: 'rgba(255,255,255,0.4)', shadow: 'rgba(38,166,154,0.35)', iconColor: '#fff' },
  orange:  { faceTop: '#FFB347', faceBottom: '#F09030', depth: '#CC7520', shine: 'rgba(255,255,255,0.4)', shadow: 'rgba(240,144,48,0.35)', iconColor: '#fff' },
  pink:    { faceTop: '#FF8AAE', faceBottom: '#E8537A', depth: '#C73E62', shine: 'rgba(255,255,255,0.4)', shadow: 'rgba(232,83,122,0.35)', iconColor: '#fff' },
  red:     { faceTop: '#FF6B6B', faceBottom: '#E04545', depth: '#C03030', shine: 'rgba(255,255,255,0.4)', shadow: 'rgba(224,69,69,0.35)', iconColor: '#fff' },
  amber:   { faceTop: '#FFD54F', faceBottom: '#F0B420', depth: '#CC9615', shine: 'rgba(255,255,255,0.5)', shadow: 'rgba(240,180,32,0.35)', iconColor: '#5D4037' },
  indigo:  { faceTop: '#7986CB', faceBottom: '#5C6BC0', depth: '#3F4FA0', shine: 'rgba(255,255,255,0.4)', shadow: 'rgba(92,107,192,0.35)', iconColor: '#fff' },
  cyan:    { faceTop: '#4DD0E1', faceBottom: '#26C6DA', depth: '#0097A7', shine: 'rgba(255,255,255,0.4)', shadow: 'rgba(38,198,218,0.35)', iconColor: '#fff' },
  gold:    { faceTop: '#FFD700', faceBottom: '#D4AF37', depth: '#B8940E', shine: 'rgba(255,255,255,0.5)', shadow: 'rgba(212,175,55,0.35)', iconColor: '#5D4037' },
  rose:    { faceTop: '#F48FB1', faceBottom: '#E91E90', depth: '#C2185B', shine: 'rgba(255,255,255,0.4)', shadow: 'rgba(233,30,144,0.35)', iconColor: '#fff' },
  brown:   { faceTop: '#A1887F', faceBottom: '#8D6E63', depth: '#6D4C41', shine: 'rgba(255,255,255,0.3)', shadow: 'rgba(141,110,99,0.35)', iconColor: '#fff' },
  emerald: { faceTop: '#C8A86A', faceBottom: '#B8940E', depth: '#8B6914', shine: 'rgba(255,255,255,0.4)', shadow: 'rgba(184,148,14,0.35)', iconColor: '#fff' },
  violet:  { faceTop: '#B388FF', faceBottom: '#9C64FF', depth: '#7C4DFF', shine: 'rgba(255,255,255,0.4)', shadow: 'rgba(156,100,255,0.35)', iconColor: '#fff' },
};

// ═══════════════════════════════════════
// Size Presets
// ═══════════════════════════════════════
type Icon3DSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_CONFIG: Record<Icon3DSize, { container: number; icon: number; radius: number; depth: number }> = {
  xs: { container: 32, icon: 16, radius: 8,  depth: 2 },
  sm: { container: 40, icon: 20, radius: 10, depth: 3 },
  md: { container: 52, icon: 26, radius: 14, depth: 4 },
  lg: { container: 64, icon: 32, radius: 18, depth: 5 },
  xl: { container: 80, icon: 40, radius: 22, depth: 6 },
};

// ═══════════════════════════════════════
// Icon3D Component
// ═══════════════════════════════════════
interface Icon3DProps {
  /** Lucide icon component */
  icon: any;
  /** Color theme name */
  theme?: string;
  /** Custom theme override */
  customTheme?: Icon3DTheme;
  /** Size preset */
  size?: Icon3DSize;
  /** Additional className */
  className?: string;
  /** Is hoverable (scale effect) */
  hoverable?: boolean;
  /** Render as a specific tag */
  as?: 'div' | 'span';
}

export function Icon3D({
  icon: IconComp,
  theme = 'blue',
  customTheme,
  size = 'md',
  className = '',
  hoverable = true,
  as: Tag = 'div',
}: Icon3DProps) {
  const t = customTheme || THEMES[theme] || THEMES.blue;
  const s = SIZE_CONFIG[size];

  const containerStyle: CSSProperties = {
    width: s.container,
    height: s.container,
    borderRadius: s.radius,
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    cursor: hoverable ? 'pointer' : 'default',
  };

  const faceStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: s.radius,
    background: `linear-gradient(135deg, ${t.faceTop} 0%, ${t.faceBottom} 100%)`,
    boxShadow: `
      0 ${s.depth}px 0 0 ${t.depth},
      0 ${s.depth + 2}px ${s.depth * 3}px ${t.shadow},
      inset 0 1px 1px ${t.shine},
      inset 0 -1px 2px rgba(0,0,0,0.1)
    `,
    transform: `translateY(-${Math.floor(s.depth / 2)}px)`,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  // Shine highlight (top-left corner)
  const shineStyle: CSSProperties = {
    position: 'absolute',
    top: 2,
    left: 2,
    width: '45%',
    height: '40%',
    borderRadius: `${s.radius - 2}px ${s.radius - 2}px ${s.radius}px 4px`,
    background: `linear-gradient(135deg, ${t.shine} 0%, transparent 100%)`,
    opacity: 0.6,
    pointerEvents: 'none',
    transform: `translateY(-${Math.floor(s.depth / 2)}px)`,
  };

  const iconStyle: CSSProperties = {
    position: 'relative',
    zIndex: 2,
    color: t.iconColor,
    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
    transform: `translateY(-${Math.floor(s.depth / 2)}px)`,
  };

  return (
    <Tag
      className={`icon-3d group/icon ${hoverable ? 'hover:scale-110 active:scale-95' : ''} ${className}`}
      style={containerStyle}
    >
      {/* Shadow base (ground shadow) */}
      <div
        style={{
          position: 'absolute',
          bottom: -1,
          left: '10%',
          right: '10%',
          height: s.depth + 2,
          borderRadius: '50%',
          background: t.shadow,
          filter: `blur(${s.depth}px)`,
          opacity: 0.5,
        }}
      />
      {/* 3D Face */}
      <div style={faceStyle} />
      {/* Shine highlight */}
      <div style={shineStyle} />
      {/* Icon */}
      <IconComp style={iconStyle} size={s.icon} strokeWidth={2.2} />
    </Tag>
  );
}

// ═══════════════════════════════════════
// Pre-configured Icon Mappings
// ═══════════════════════════════════════

/** Tool Icons — for AIToolsDashboard */
export const TOOL_ICONS: Record<string, { icon: any; theme: string }> = {
  'quote':       { icon: FileText,      theme: 'blue' },
  'invoice':     { icon: Receipt,       theme: 'teal' },
  'contract':    { icon: FileSignature, theme: 'purple' },
  'materials':   { icon: Calculator,    theme: 'emerald' },
  'cost':        { icon: DollarSign,    theme: 'cyan' },
  'paint':       { icon: Paintbrush,    theme: 'pink' },
  'design-2d':   { icon: PenTool,       theme: 'indigo' },
  'design-3d':   { icon: Box,           theme: 'violet' },
  'convert-2d-3d': { icon: RotateCw,    theme: 'green' },
  'room-layout': { icon: LayoutGrid,    theme: 'blue' },
  'color-palette': { icon: Palette,     theme: 'rose' },
  'lighting':    { icon: Lightbulb,     theme: 'amber' },
  'marketing':   { icon: Megaphone,     theme: 'pink' },
  'social-media': { icon: Users,        theme: 'indigo' },
};

/** Service Icons — for ServicesContent */
export const SERVICE_ICONS: Record<string, { icon: any; theme: string }> = {
  'construction-contracting': { icon: Building2,  theme: 'orange' },
  'engineering-consultation':  { icon: Compass,    theme: 'blue' },
  'maintenance-companies':     { icon: Wrench,     theme: 'gold' },
  'craftsmen':                 { icon: HardHat,    theme: 'amber' },
  'workshops':                 { icon: Hammer,     theme: 'red' },
  'equipment-rental':          { icon: Truck,      theme: 'gold' },
  'building-materials':        { icon: Package,    theme: 'brown' },
  'furniture-stores':          { icon: Sofa,       theme: 'purple' },
  'cleaning-services':         { icon: Sparkles,   theme: 'cyan' },
};

/** Navigation Section Icons — for SideDrawer & sectionsTree */
export const NAV_ICONS: Record<string, { icon: any; theme: string }> = {
  'home':        { icon: Home,          theme: 'gold' },
  'services':    { icon: Wrench,        theme: 'blue' },
  'shop':        { icon: ShoppingCart,  theme: 'gold' },
  'maps':        { icon: MapPin,        theme: 'red' },
  'design':      { icon: Ruler,         theme: 'purple' },
  'offers':      { icon: Flame,         theme: 'orange' },
  'tools':       { icon: Settings,      theme: 'teal' },
  'marketplace': { icon: ShoppingCart,  theme: 'blue' },
  'yak':         { icon: MessageCircle, theme: 'emerald' },
  'connectors':  { icon: Settings,      theme: 'indigo' },
  'projects':    { icon: Layers,        theme: 'indigo' },
  'wallet':      { icon: Wallet,        theme: 'gold' },
  'profile':     { icon: User,          theme: 'blue' },
};

/** Helper: Get a 3D icon for a tool ID */
export function getToolIcon(toolId: string, size: Icon3DSize = 'md') {
  const config = TOOL_ICONS[toolId];
  if (!config) return null;
  return <Icon3D icon={config.icon} theme={config.theme} size={size} />;
}

/** Helper: Get a 3D icon for a service ID */
export function getServiceIcon(serviceId: string, size: Icon3DSize = 'md') {
  const config = SERVICE_ICONS[serviceId];
  if (!config) return null;
  return <Icon3D icon={config.icon} theme={config.theme} size={size} />;
}

/** Helper: Get a 3D icon for a navigation section ID */
export function getNavIcon(sectionId: string, size: Icon3DSize = 'sm') {
  const config = NAV_ICONS[sectionId];
  if (!config) return null;
  return <Icon3D icon={config.icon} theme={config.theme} size={size} />;
}

export { THEMES as Icon3DThemes };