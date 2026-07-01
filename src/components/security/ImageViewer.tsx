/**
 * ImageViewer.tsx
 * Full-screen image viewer with pinch-to-zoom enabled.
 * This is the ONLY place where zoom is allowed (via .allow-zoom class).
 * Used globally via ImageViewerContext.
 */
import { useState, useRef, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// ===== Context for global image viewer =====
interface ImageViewerContextType {
  openImage: (src: string, alt?: string) => void;
  closeImage: () => void;
}

const ImageViewerContext = createContext<ImageViewerContextType | null>(null);

export function useImageViewer() {
  const ctx = useContext(ImageViewerContext);
  if (!ctx) {
    throw new Error('useImageViewer must be used within ImageViewerProvider');
  }
  return ctx;
}

interface ImageViewerProviderProps {
  children: ReactNode;
}

export function ImageViewerProvider({ children }: ImageViewerProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  const openImage = useCallback((src: string, alt?: string) => {
    setImageSrc(src);
    setImageAlt(alt || '');
    setIsOpen(true);
  }, []);

  const closeImage = useCallback(() => {
    setIsOpen(false);
    setImageSrc('');
    setImageAlt('');
  }, []);

  return (
    <ImageViewerContext.Provider value={{ openImage, closeImage }}>
      {children}
      {isOpen && (
        <ImageViewerModal src={imageSrc} alt={imageAlt} onClose={closeImage} />
      )}
    </ImageViewerContext.Provider>
  );
}

// ===== Modal Component =====
interface ImageViewerModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

function ImageViewerModal({ src, alt, onClose }: ImageViewerModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastTouchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 5;

  // Handle pinch zoom
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;

      if (lastTouchRef.current) {
        const scaleFactor = dist / lastTouchRef.current.dist;
        setScale(prev => Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * scaleFactor)));
        
        // Pan while zooming
        const dx = centerX - lastTouchRef.current.x;
        const dy = centerY - lastTouchRef.current.y;
        setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      }

      lastTouchRef.current = { x: centerX, y: centerY, dist };
    } else if (e.touches.length === 1 && scale > 1) {
      // Pan when zoomed in
      const touch = e.touches[0];
      if (lastTouchRef.current) {
        const dx = touch.clientX - lastTouchRef.current.x;
        const dy = touch.clientY - lastTouchRef.current.y;
        setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      }
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY, dist: 0 };
    }
  }, [scale]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      lastTouchRef.current = { x: centerX, y: centerY, dist };
    } else if (e.touches.length === 1) {
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dist: 0 };
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    lastTouchRef.current = null;
  }, []);

  // Double-tap to zoom
  const lastTapRef = useRef(0);
  const handleDoubleTap = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      e.preventDefault();
      if (scale > 1) {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      } else {
        setScale(2.5);
      }
    }
    lastTapRef.current = now;
  }, [scale]);

  // Reset
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[99998] bg-black/95 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm z-10">
        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(prev => Math.min(MAX_SCALE, prev + 0.5))}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => setScale(prev => Math.max(MIN_SCALE, prev - 0.5))}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ZoomOut className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Image Area — .allow-zoom enables pinch zoom here */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden allow-zoom"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            transformOrigin: 'center center',
          }}
          onTouchEnd={handleDoubleTap}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[80vh] object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Scale Indicator */}
      {scale !== 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
          {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  );
}
