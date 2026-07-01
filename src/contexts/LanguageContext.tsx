import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import all translation files
import enCommon from '../locales/en/common';
import enServices from '../locales/en/services';
import enStore from '../locales/en/store';
import enShop from '../locales/en/shop';
import enRealEstate from '../locales/en/realEstate';
import enMaps from '../locales/en/maps';
import enTools from '../locales/en/tools';
import enHome from '../locales/en/home';
import enProfile from '../locales/en/profile';
import enYak from '../locales/en/yak';
import enNotifications from '../locales/en/notifications';
import enOffers from '../locales/en/offers';
import enProjects from '../locales/en/projects';

import arCommon from '../locales/ar/common';
import arServices from '../locales/ar/services';
import arStore from '../locales/ar/store';
import arShop from '../locales/ar/shop';
import arRealEstate from '../locales/ar/realEstate';
import arMaps from '../locales/ar/maps';
import arTools from '../locales/ar/tools';
import arHome from '../locales/ar/home';
import arProfile from '../locales/ar/profile';
import arYak from '../locales/ar/yak';
import arNotifications from '../locales/ar/notifications';
import arOffers from '../locales/ar/offers';
import arProjects from '../locales/ar/projects';

type Language = 'en' | 'ar';
type TranslationNamespace = 'common' | 'services' | 'store' | 'shop' | 'realEstate' | 'maps' | 'tools' | 'home' | 'profile' | 'yak' | 'notifications' | 'offers' | 'projects';

interface Translations {
  en: {
    common: typeof enCommon;
    services: typeof enServices;
    store: typeof enStore;
    shop: typeof enShop;
    realEstate: typeof enRealEstate;
    maps: typeof enMaps;
    tools: typeof enTools;
    home: typeof enHome;
    profile: typeof enProfile;
    yak: typeof enYak;
    notifications: typeof enNotifications;
    offers: typeof enOffers;
    projects: typeof enProjects;
  };
  ar: {
    common: typeof arCommon;
    services: typeof arServices;
    store: typeof arStore;
    shop: typeof arShop;
    realEstate: typeof arRealEstate;
    maps: typeof arMaps;
    tools: typeof arTools;
    home: typeof arHome;
    profile: typeof arProfile;
    yak: typeof arYak;
    notifications: typeof arNotifications;
    offers: typeof arOffers;
    projects: typeof arProjects;
  };
}

const translations: Translations = {
  en: {
    common: enCommon,
    services: enServices,
    store: enStore,
    shop: enShop,
    realEstate: enRealEstate,
    maps: enMaps,
    tools: enTools,
    home: enHome,
    profile: enProfile,
    yak: enYak,
    notifications: enNotifications,
    offers: enOffers,
    projects: enProjects,
  },
  ar: {
    common: arCommon,
    services: arServices,
    store: arStore,
    shop: arShop,
    realEstate: arRealEstate,
    maps: arMaps,
    tools: arTools,
    home: arHome,
    profile: arProfile,
    yak: arYak,
    notifications: arNotifications,
    offers: arOffers,
    projects: arProjects,
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, namespace?: TranslationNamespace) => string;
  dir: 'ltr' | 'rtl';
  textAlign: 'left' | 'right';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Get language from localStorage or default to Arabic
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  // Layout direction is ALWAYS RTL — only text alignment changes
  const dir: 'ltr' | 'rtl' = 'rtl';
  const textAlign: 'left' | 'right' = language === 'ar' ? 'right' : 'left';

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
    // Layout direction always RTL — icons and structure never change
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = language;
    // Add data attribute for CSS-based text alignment
    document.documentElement.setAttribute('data-text-dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  // Translation function
  const t = (key: string, namespace: TranslationNamespace = 'common'): string => {
    try {
      const keys = key.split('.');
      let value: any = translations[language][namespace];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          console.warn(`Translation key not found: ${namespace}.${key} in ${language}`);
          return key;
        }
      }
      
      return typeof value === 'string' ? value : key;
    } catch (error) {
      console.error(`Translation error for key: ${namespace}.${key}`, error);
      return key;
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, textAlign }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Shorthand hook for translation only
export function useTranslation(namespace: TranslationNamespace = 'common') {
  const { t, language, dir, textAlign } = useLanguage();
  return {
    t: (key: string) => t(key, namespace),
    language,
    dir,
    textAlign,
  };
}