/**
 * DesktopWindow.tsx — نافذة سطح مكتب وياك
 * ══════════════════════════════════════════
 * Draggable + Resizable window with title bar (traffic lights)
 * Custom drag implementation (no react-dnd needed for windows)
 */

import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minimize2, Maximize2, GripHorizontal, type LucideIcon } from 'lucide-react';

const fontCairo = "'Cairo', 'Tajawal', system-ui, sans-serif";

export interface WindowState {
  id: string;
  title: string;
  titleEn?: string;
  icon: LucideIcon;
  iconColor: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { w: number; h: number };
  minSize?: { w: number; h: number };
}

interface DesktopWindowProps {
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (pos: { x: number; y: number }) => void;
  onResize: (size: { w: number; h: number }) => void;
  children: ReactNode;
  badge?: string;
  containerRect?: DOMRect | null;
}

export function DesktopWindow({
  windowState: ws,
  onClose, onMinimize, onMaximize, onFocus,
  onMove, onResize,
  children, badge,
  containerRect,
}: DesktopWindowProps) {
  const dragRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // ── Drag handlers ──
  const onDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    onFocus();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragOffset.current = {
      x: clientX - ws.position.x,
      y: clientY - ws.position.y,
    };
    setIsDragging(true);
  }, [ws.position, onFocus]);

  useEffect(() => {
    if (!isDragging) return;
    const onDragMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      onMove({
        x: clientX - dragOffset.current.x,
        y: Math.max(0, clientY - dragOffset.current.y),
      });
    };
    const onDragEnd = () => setIsDragging(false);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
    window.addEventListener('touchmove', onDragMove);
    window.addEventListener('touchend', onDragEnd);
    return () => {
      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('mouseup', onDragEnd);
      window.removeEventListener('touchmove', onDragMove);
      window.removeEventListener('touchend', onDragEnd);
    };
  }, [isDragging, onMove]);

  // ── Resize handlers ──
  const onResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    resizeStart.current = { x: clientX, y: clientY, w: ws.size.w, h: ws.size.h };
    setIsResizing(true);
  }, [ws.size, onFocus]);

  useEffect(() => {
    if (!isResizing) return;
    const onResizeMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - resizeStart.current.x;
      const dy = clientY - resizeStart.current.y;
      const minW = ws.minSize?.w || 320;
      const minH = ws.minSize?.h || 240;
      onResize({
        w: Math.max(minW, resizeStart.current.w + dx),
        h: Math.max(minH, resizeStart.current.h + dy),
      });
    };
    const onResizeEnd = () => setIsResizing(false);
    window.addEventListener('mousemove', onResizeMove);
    window.addEventListener('mouseup', onResizeEnd);
    window.addEventListener('touchmove', onResizeMove);
    window.addEventListener('touchend', onResizeEnd);
    return () => {
      window.removeEventListener('mousemove', onResizeMove);
      window.removeEventListener('mouseup', onResizeEnd);
      window.removeEventListener('touchmove', onResizeMove);
      window.removeEventListener('touchend', onResizeEnd);
    };
  }, [isResizing, ws.minSize, onResize]);

  if (!ws.isOpen || ws.isMinimized) return null;

  const Icon = ws.icon;

  const style: React.CSSProperties = ws.isMaximized
    ? { position: 'absolute', inset: 0, zIndex: ws.zIndex }
    : {
        position: 'absolute',
        left: ws.position.x,
        top: ws.position.y,
        width: ws.size.w,
        height: ws.size.h,
        zIndex: ws.zIndex,
      };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 12 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={{
        ...style,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: ws.isMaximized ? 0 : 16,
        overflow: 'hidden',
        background: '#111827',
        border: ws.isMaximized ? 'none' : '1px solid rgba(255,255,255,0.14)',
        boxShadow: isDragging
          ? '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.10)'
          : '0 16px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
        fontFamily: fontCairo,
        direction: 'rtl',
        userSelect: isDragging || isResizing ? 'none' : 'auto',
      }}
      onMouseDown={onFocus}
    >
      {/* ═══ Title Bar ═══ */}
      <div
        ref={dragRef}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        style={{
          background: 'linear-gradient(180deg, #1E293B, #111827)',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: isDragging ? 'grabbing' : 'grab',
          flexShrink: 0,
          touchAction: 'none',
        }}
      >
        {/* Traffic Lights + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: 6, marginLeft: 4 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              onMouseDown={e => e.stopPropagation()}
              style={{
                width: 12, height: 12, borderRadius: '50%', border: 'none',
                background: '#FF5F56', cursor: 'pointer',
              }}
            />
            <button
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              onMouseDown={e => e.stopPropagation()}
              style={{
                width: 12, height: 12, borderRadius: '50%', border: 'none',
                background: '#FFBD2E', cursor: 'pointer',
              }}
            />
            <button
              onClick={(e) => { e.stopPropagation(); onMaximize(); }}
              onMouseDown={e => e.stopPropagation()}
              style={{
                width: 12, height: 12, borderRadius: '50%', border: 'none',
                background: '#27C93F', cursor: 'pointer',
              }}
            />
          </div>

          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.12)' }} />

          {/* Icon + Title */}
          <div style={{
            width: 24, height: 24, borderRadius: 7,
            background: `${ws.iconColor}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon style={{ width: 12, height: 12, color: ws.iconColor }} />
          </div>
          <span style={{
            fontSize: 12.5, fontWeight: 700, color: '#F1F5F9',
            fontFamily: fontCairo,
          }}>
            {ws.title}
          </span>
          {badge && (
            <span style={{
              fontSize: 9, fontWeight: 700, color: ws.iconColor,
              background: `${ws.iconColor}20`,
              border: `1px solid ${ws.iconColor}30`,
              borderRadius: 100, padding: '2px 8px',
            }}>
              {badge}
            </span>
          )}
        </div>

        {/* Window Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <GripHorizontal style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.12)' }} />
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        {children}
      </div>

      {/* ═══ Resize Handle (bottom-left corner for RTL) ═══ */}
      {!ws.isMaximized && (
        <div
          ref={resizeRef}
          onMouseDown={onResizeStart}
          onTouchStart={onResizeStart}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 18,
            height: 18,
            cursor: 'nwse-resize',
            touchAction: 'none',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ opacity: 0.2 }}>
            <line x1="14" y1="18" x2="18" y2="14" stroke="white" strokeWidth="1.5" />
            <line x1="10" y1="18" x2="18" y2="10" stroke="white" strokeWidth="1.5" />
            <line x1="6" y1="18" x2="18" y2="6" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}