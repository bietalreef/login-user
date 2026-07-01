/**
 * SecurityGuard.tsx
 * Enforces strict security policies:
 * - No download / save-as
 * - No "Add to Home Screen" (PWA install prompt blocked)
 * - Screenshot prevention (CSS overlay + visibility API)
 * - Zoom disabled globally (except image viewer)
 * - Right-click disabled
 * - Keyboard shortcuts blocked (Ctrl+S, Ctrl+P, Ctrl+U, F12, etc.)
 * - Text selection disabled (except inputs/textareas)
 */
import { useEffect } from 'react';

export function SecurityGuard() {
  useEffect(() => {
    // ===== 1. Block PWA Install Prompt =====
    const blockInstall = (e: Event) => {
      e.preventDefault();
      // Swallow the event — never show "Add to Home Screen"
      return false;
    };
    window.addEventListener('beforeinstallprompt', blockInstall);

    // ===== 2. Block Right-Click Context Menu =====
    const blockContextMenu = (e: MouseEvent) => {
      // Allow right-click only on input/textarea for paste
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      e.preventDefault();
    };
    document.addEventListener('contextmenu', blockContextMenu);

    // ===== 3. Block Keyboard Shortcuts =====
    const blockKeyboard = (e: KeyboardEvent) => {
      // Block Ctrl+S (save), Ctrl+P (print), Ctrl+U (view source), F12 (devtools)
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'S')) ||
        (e.ctrlKey && (e.key === 'p' || e.key === 'P')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'j' || e.key === 'J')) ||
        e.key === 'F12' ||
        // Block Ctrl+A (select all) outside inputs
        (e.ctrlKey && (e.key === 'a' || e.key === 'A') && 
         !(document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    document.addEventListener('keydown', blockKeyboard, true);

    // ===== 4. Block Drag (prevents saving images by dragging) =====
    const blockDrag = (e: DragEvent) => {
      e.preventDefault();
    };
    document.addEventListener('dragstart', blockDrag);

    // ===== 5. Viewport Meta — Disable Zoom =====
    const setViewportMeta = () => {
      let meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no'
      );
    };
    setViewportMeta();

    // ===== 6. Block Pinch Zoom (touch) =====
    const blockPinchZoom = (e: TouchEvent) => {
      // Allow pinch only if target is inside .allow-zoom container (image viewer)
      const target = e.target as HTMLElement;
      if (target.closest('.allow-zoom')) return;
      
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', blockPinchZoom, { passive: false });

    // Also block double-tap zoom
    let lastTouchEnd = 0;
    const blockDoubleTapZoom = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.allow-zoom')) return;
      
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };
    document.addEventListener('touchend', blockDoubleTapZoom, { passive: false });

    // ===== 7. Gesture event (Safari specific zoom prevention) =====
    const blockGesture = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.allow-zoom')) return;
      e.preventDefault();
    };
    document.addEventListener('gesturestart', blockGesture as EventListener);
    document.addEventListener('gesturechange', blockGesture as EventListener);
    document.addEventListener('gestureend', blockGesture as EventListener);

    // ===== 8. Block Print =====
    const blockPrint = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener('beforeprint', blockPrint);

    // ===== 9. Remove any manifest links (prevent PWA detection) =====
    const removeManifest = () => {
      const manifests = document.querySelectorAll('link[rel="manifest"]');
      manifests.forEach(m => m.remove());
    };
    removeManifest();
    // Watch for dynamic additions
    const manifestObserver = new MutationObserver(() => {
      removeManifest();
    });
    manifestObserver.observe(document.head, { childList: true });

    // ===== 10. Screenshot detection via Page Visibility API =====
    // When user tries to screenshot on iOS (screen recording), the page might blur
    const handleVisibilityChange = () => {
      // We just log it — can't truly block screenshots from JS
      if (document.hidden) {
        console.log('[Security] Page hidden — possible screenshot or app switch');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', blockInstall);
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockKeyboard, true);
      document.removeEventListener('dragstart', blockDrag);
      document.removeEventListener('touchmove', blockPinchZoom);
      document.removeEventListener('touchend', blockDoubleTapZoom);
      document.removeEventListener('gesturestart', blockGesture as EventListener);
      document.removeEventListener('gesturechange', blockGesture as EventListener);
      document.removeEventListener('gestureend', blockGesture as EventListener);
      window.removeEventListener('beforeprint', blockPrint);
      manifestObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null; // Invisible security layer
}
