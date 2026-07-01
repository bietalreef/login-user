/**
 * useBreakpoint — كشف حجم الشاشة في الوقت الفعلي
 * يُستخدم في جميع المكونات التي تحتاج تخطيط مختلف حسب الجهاز
 */
import { useState, useEffect } from 'react';

export function useBreakpoint() {
  const [width, setWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    let rafId: number;
    const handler = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener('resize', handler, { passive: true });
    return () => {
      window.removeEventListener('resize', handler);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const isMobile  = width < 768;   // هاتف
  const isTablet  = width >= 768 && width < 1024; // تابلت
  const isDesktop = width >= 1024;  // سطح مكتب
  const isWide    = width >= 1280;  // شاشة عريضة

  return { width, isMobile, isTablet, isDesktop, isWide };
}
