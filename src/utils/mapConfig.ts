export const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ['places', 'geometry'];

export const getGoogleMapsApiKey = (): string => {
  try {
    let apiKey = '';

    // 1. Try import.meta.env (Standard Vite)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
               import.meta.env.GOOGLE_MAPS_API_KEY || 
               '';
    }

    // 2. Try process.env (Fallback)
    if (!apiKey && typeof process !== 'undefined' && process.env) {
      apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || 
               process.env.GOOGLE_MAPS_API_KEY || 
               '';
    }

    // 3. Fallback for some specific environments that might inject it differently
    if (!apiKey && typeof window !== 'undefined') {
      // @ts-ignore
      apiKey = window.VITE_GOOGLE_MAPS_API_KEY || window.GOOGLE_MAPS_API_KEY || '';
    }

    // Only log warning if API key is truly empty
    if (!apiKey || apiKey.trim() === '') {
      // Silently fail - UI components will handle the graceful fallback
      if (import.meta.env.DEV) {
        console.info('ℹ️ Google Maps API Key not configured. Maps features disabled.');
      }
    } else {
      // Confirm API key is loaded (only in development)
      if (import.meta.env.DEV) {
        console.log('✅ Google Maps API Key loaded successfully');
      }
    }

    return apiKey;
  } catch (error) {
    console.error('❌ Error reading Google Maps API Key:', error);
    return '';
  }
};