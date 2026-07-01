/**
 * ====================================
 * Google Maps Loader Provider (v2)
 * ====================================
 * 
 * Fetches the API key from the server then loads the Google Maps JS API
 * dynamically via vanilla script injection. Provides error handling and retry.
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

// ====================================
// Types & Context
// ====================================

interface GoogleMapsContextType {
  isLoaded: boolean;
  mapId: string;
  error: string | null;
  retry: () => void;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  mapId: '',
  error: null,
  retry: () => {},
});

// ====================================
// Hook
// ====================================

export function useGoogleMaps() {
  return useContext(GoogleMapsContext);
}

// ====================================
// Provider Component
// ====================================

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const mapId = '650ecaedf345c51226884a26';
  const [isLoaded, setIsLoaded] = useState(() => !!(window as any).google?.maps);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'auth' | 'network' | 'key' | null>(null);
  const loadingRef = useRef(false);
  const attemptRef = useRef(0);

  // ─── Listen for Google Maps auth failure (RefererNotAllowedMapError etc.) ───
  useEffect(() => {
    const handleAuthFailure = () => {
      const currentUrl = window.location.href;
      console.error('[Maps] ❌ gm_authFailure — RefererNotAllowedMapError. Current URL:', currentUrl);
      setErrorType('auth');
      setError(
        `خطأ في صلاحيات مفتاح Google Maps (RefererNotAllowedMapError).\n` +
        `أضف هذا الرابط في Google Cloud Console → Credentials → HTTP referrers:\n` +
        `${window.location.origin}/*`
      );
      setIsLoaded(false);
    };
    (window as any).gm_authFailure = handleAuthFailure;
    return () => {
      if ((window as any).gm_authFailure === handleAuthFailure) {
        delete (window as any).gm_authFailure;
      }
    };
  }, []);

  const loadMaps = useCallback(async () => {
    // Already loaded
    if ((window as any).google?.maps) {
      setIsLoaded(true);
      setError(null);
      return;
    }

    // Prevent concurrent loads
    if (loadingRef.current) return;
    loadingRef.current = true;
    setError(null);

    try {
      // Step 1: Try Vite env var first
      let apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      let keySource = apiKey ? 'VITE_ENV' : '';

      // Step 2: If not available, fetch from server
      if (!apiKey) {
        console.log('[Maps] Fetching API key from server...');
        const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;
        const res = await fetch(`${BASE}/maps/config`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`سيرفر الخرائط أعاد خطأ ${res.status}`);
        }

        const data = await res.json();
        apiKey = data.apiKey || '';
        keySource = 'SERVER';

        if (!apiKey) {
          throw new Error(data.error || 'مفتاح Google Maps غير مُعد — تأكد من إضافته في Secrets');
        }
      }

      // Diagnostic logging (key masked for security)
      const maskedKey = apiKey ? `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}` : 'EMPTY';
      console.log(`[Maps] API Key source: ${keySource}, Key: ${maskedKey}`);
      console.log(`[Maps] Current origin: ${window.location.origin}`);
      console.log(`[Maps] Current referrer: ${document.referrer}`);
      console.log('[Maps] Loading Google Maps script...');

      // Step 3: Remove any existing (failed) script
      const old = document.querySelector('script[src*="maps.googleapis.com"]');
      if (old) old.remove();

      // Step 4: Create and inject script
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,marker&language=ar&region=AE`;
        script.async = true;
        script.defer = true;

        const timeout = setTimeout(() => {
          reject(new Error('انتهت مهلة تحميل Google Maps (15 ثانية)'));
        }, 15000);

        script.onload = () => {
          clearTimeout(timeout);
          console.log('[Maps] ✅ Google Maps API loaded successfully');
          resolve();
        };

        script.onerror = (e) => {
          clearTimeout(timeout);
          console.error('[Maps] ❌ Script load error:', e);
          reject(new Error('فشل تحميل Google Maps API — تأكد من المفتاح وإعدادات الشبكة'));
        };

        document.head.appendChild(script);
      });

      // Step 5: Verify google.maps is actually available
      if (!(window as any).google?.maps) {
        throw new Error('Google Maps لم يتم تحميله بشكل صحيح');
      }

      setIsLoaded(true);
      setError(null);
    } catch (err: any) {
      console.error('[Maps] Load error:', err.message);
      setError(err.message || 'خطأ غير متوقع في تحميل الخرائط');
      setIsLoaded(false);
    } finally {
      loadingRef.current = false;
    }
  }, []);

  const retry = useCallback(() => {
    attemptRef.current += 1;
    console.log(`[Maps] Retry attempt #${attemptRef.current}`);
    // Remove old script
    const old = document.querySelector('script[src*="maps.googleapis.com"]');
    if (old) old.remove();
    // Reset google maps object to force full reload
    if ((window as any).google?.maps) {
      delete (window as any).google.maps;
    }
    // Reset state
    loadingRef.current = false;
    setIsLoaded(false);
    setError(null);
    setErrorType(null);
    // Reload
    setTimeout(() => loadMaps(), 200);
  }, [loadMaps]);

  useEffect(() => {
    loadMaps();
  }, [loadMaps]);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, mapId, error, retry }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}