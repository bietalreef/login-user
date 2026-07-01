import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface ZoomContextValue {
  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setZoom: (level: number) => void;
}

const STORAGE_KEY = 'bietalreef_zoom_level';
const MIN_ZOOM = 70;
const MAX_ZOOM = 150;
const DEFAULT_ZOOM = 100;
const ZOOM_STEP = 10;

const ZoomContext = createContext<ZoomContextValue>({
  zoomLevel: DEFAULT_ZOOM,
  zoomIn: () => {},
  zoomOut: () => {},
  resetZoom: () => {},
  setZoom: () => {},
});

export function ZoomProvider({ children }: { children: ReactNode }) {
  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= MIN_ZOOM && parsed <= MAX_ZOOM) return parsed;
      }
    } catch {}
    return DEFAULT_ZOOM;
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(zoomLevel));
    } catch {}
  }, [zoomLevel]);

  // Apply zoom to <html> element for global effect
  useEffect(() => {
    document.documentElement.style.fontSize = `${zoomLevel}%`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [zoomLevel]);

  const zoomIn = useCallback(() => setZoomLevel(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM)), []);
  const zoomOut = useCallback(() => setZoomLevel(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM)), []);
  const resetZoom = useCallback(() => setZoomLevel(DEFAULT_ZOOM), []);
  const setZoom = useCallback((level: number) => setZoomLevel(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, level))), []);

  return (
    <ZoomContext.Provider value={{ zoomLevel, zoomIn, zoomOut, resetZoom, setZoom }}>
      {children}
    </ZoomContext.Provider>
  );
}

export function useZoom() {
  return useContext(ZoomContext);
}
