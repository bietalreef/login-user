import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // التحقق من التثبيت المسبق
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
    }

    // الاستماع لحدث beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
      console.log('[PWA] Install prompt captured');
    };

    // الاستماع لحدث التثبيت
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('[PWA] App installed successfully');
    };

    // متابعة حالة الاتصال
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // دالة التثبيت
  const install = async () => {
    if (!deferredPrompt) {
      console.warn('[PWA] No install prompt available');
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`[PWA] User response: ${outcome}`);
      
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[PWA] Install error:', error);
      return false;
    }
  };

  // تسجيل Service Worker
  const registerServiceWorker = async () => {
    // فقط في بيئة الإنتاج وليس في Figma preview
    const isProduction = import.meta.env.PROD;
    
    if (!('serviceWorker' in navigator)) {
      console.warn('[PWA] Service Worker not supported');
      return null;
    }

    // فقط في HTTPS أو localhost
    const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost';
    if (!isSecureContext) {
      console.warn('[PWA] Service Worker requires HTTPS or localhost');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });

      console.log('[PWA] Service Worker registered:', registration.scope);

      // التحديث التلقائي
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] New version available');
            // يمكن عرض رسالة للمستخدم هنا
          }
        });
      });

      return registration;
    } catch (error) {
      // لا نعرض أخطاء مزعجة في بيئة التطوير
      if (isProduction) {
        console.error('[PWA] Service Worker registration failed:', error);
      } else {
        console.info('[PWA] Service Worker registration skipped in development');
      }
      return null;
    }
  };

  // طلب إذن الإشعارات
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('[PWA] Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  };

  // إرسال إشعار تجريبي
  const sendTestNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('بيت الريف', {
        body: 'مرحباً! التطبيق جاهز للاستخدام',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
      });
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    install,
    registerServiceWorker,
    requestNotificationPermission,
    sendTestNotification,
  };
}