/**
 * MapsScreen.tsx — خريطة المزودين الذكية
 * ═══════════════════════════════════════════════════════════
 * - أول دخول: طلب صلاحية الموقع بشكل جميل
 * - عرض مخصص حسب نوع المستخدم (مزود / عميل / زائر)
 * - جلب المزودين الحقيقيين من الباكند + البيانات الافتراضية
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Search, Star, Phone, X, Navigation, Filter,
  Store, Hammer, Paintbrush, Wrench, Sofa, Building2,
  Truck, Sparkles, MessageCircle, CheckCircle, Shield,
  HardHat, Package, Compass, Layers, Share2, Heart,
  ExternalLink, Eye, ChevronRight, Locate, RefreshCw,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../utils/UserContext';
import { useGoogleMaps } from '../providers/GoogleMapsLoader';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

const f = 'Cairo, sans-serif';
const PERM_KEY = 'beit_maps_location_perm';

// ═══════════════════ TYPES ═══════════════════
interface MapProvider {
  id: string;
  name_ar: string;
  name_en: string;
  category: string;
  emirate: string;
  area_ar: string;
  area_en: string;
  rating: number;
  reviews: number;
  phone?: string;
  verified: boolean;
  lat: number;
  lng: number;
  tags_ar: string[];
  tags_en: string[];
  completedProjects?: number;
  avatar_url?: string;
  isRealProvider?: boolean; // من الباكند
}

// ═══════════════════ STATIC DATA ═══════════════════
const CATEGORIES = [
  { id: 'all',               ar: 'الكل',               en: 'All',          Icon: Store,      color: '#D4AF37' },
  { id: 'construction',      ar: 'مقاولات',             en: 'Contracting',  Icon: Building2,  color: '#E67E22' },
  { id: 'engineering',       ar: 'استشارات هندسية',     en: 'Engineering',  Icon: Compass,    color: '#3B5BFE' },
  { id: 'maintenance',       ar: 'شركات صيانة',         en: 'Maintenance',  Icon: Wrench,     color: '#D4AF37' },
  { id: 'craftsmen',         ar: 'عمالة حرفية',         en: 'Craftsmen',    Icon: HardHat,    color: '#C68B3E' },
  { id: 'workshops',         ar: 'الورش',               en: 'Workshops',    Icon: Hammer,     color: '#8D6E63' },
  { id: 'building_materials',ar: 'مواد البناء',         en: 'Materials',    Icon: Package,    color: '#D97706' },
  { id: 'furniture',         ar: 'أثاث وديكور',         en: 'Furniture',    Icon: Sofa,       color: '#7C5ADA' },
  { id: 'paint',             ar: 'دهانات',              en: 'Paints',       Icon: Paintbrush, color: '#E91E90' },
  { id: 'equipment',         ar: 'تأجير معدات',         en: 'Equipment',    Icon: Truck,      color: '#C68B3E' },
  { id: 'cleaning',          ar: 'خدمات نظافة',         en: 'Cleaning',     Icon: Sparkles,   color: '#26A69A' },
];

const EMIRATES = [
  { id: 'all',             ar: 'كل الإمارات', en: 'All UAE',      lat: 24.5,    lng: 55.0,    zoom: 8  },
  { id: 'dubai',           ar: 'دبي',         en: 'Dubai',        lat: 25.2048, lng: 55.2708, zoom: 11 },
  { id: 'abu_dhabi',       ar: 'أبوظبي',      en: 'Abu Dhabi',    lat: 24.4539, lng: 54.3773, zoom: 11 },
  { id: 'sharjah',         ar: 'الشارقة',     en: 'Sharjah',      lat: 25.3463, lng: 55.4209, zoom: 12 },
  { id: 'ajman',           ar: 'عجمان',       en: 'Ajman',        lat: 25.4052, lng: 55.5136, zoom: 13 },
  { id: 'ras_al_khaimah',  ar: 'رأس الخيمة', en: 'RAK',          lat: 25.7895, lng: 55.9432, zoom: 12 },
  { id: 'umm_al_quwain',   ar: 'أم القيوين', en: 'UAQ',          lat: 25.5647, lng: 55.5554, zoom: 13 },
  { id: 'fujairah',        ar: 'الفجيرة',     en: 'Fujairah',     lat: 25.1288, lng: 56.3264, zoom: 12 },
];

const UAE_CENTER = { lat: 24.5, lng: 55.0 };

const STATIC_PROVIDERS: MapProvider[] = [
  { id:'s1', name_ar:'مصنع الإمارات لمواد البناء', name_en:'Emirates Building Materials', category:'building_materials', emirate:'abu_dhabi', area_ar:'مصفح الصناعية', area_en:'Musaffah Industrial', rating:4.8, reviews:312, phone:'+971-2-555-1234', verified:true, lat:24.3517, lng:54.5024, tags_ar:['اسمنت','حديد','رمل'], tags_en:['cement','steel','sand'], completedProjects:156 },
  { id:'s2', name_ar:'معرض الخليج للأثاث', name_en:'Gulf Furniture Gallery', category:'furniture', emirate:'abu_dhabi', area_ar:'شارع المطار', area_en:'Airport Road', rating:4.6, reviews:189, phone:'+971-2-555-2345', verified:true, lat:24.4539, lng:54.6532, tags_ar:['أثاث','ديكور'], tags_en:['furniture','decor'], completedProjects:89 },
  { id:'s3', name_ar:'مركز النخبة للدهانات', name_en:'Elite Paints Center', category:'paint', emirate:'abu_dhabi', area_ar:'المرور', area_en:'Al Muroor', rating:4.5, reviews:156, phone:'+971-2-555-3456', verified:false, lat:24.4650, lng:54.3730, tags_ar:['دهانات'], tags_en:['paints'] },
  { id:'s4', name_ar:'سوق الراس للأدوات', name_en:'Al Ras Tools Market', category:'workshops', emirate:'dubai', area_ar:'ديرة', area_en:'Deira', rating:4.9, reviews:428, phone:'+971-4-222-1111', verified:true, lat:25.2697, lng:55.2963, tags_ar:['عدد يدوية','لحام'], tags_en:['hand tools','welding'], completedProjects:342 },
  { id:'s5', name_ar:'الفارس لمواد البناء', name_en:'Al Fares Building Materials', category:'building_materials', emirate:'dubai', area_ar:'القوز', area_en:'Al Quoz', rating:4.7, reviews:367, phone:'+971-4-222-2222', verified:true, lat:25.1536, lng:55.2236, tags_ar:['بلاط','سيراميك'], tags_en:['tiles','ceramic'], completedProjects:203 },
  { id:'s6', name_ar:'هوم سنتر', name_en:'Home Centre', category:'furniture', emirate:'dubai', area_ar:'فستيفال سيتي', area_en:'Festival City', rating:4.4, reviews:892, verified:true, lat:25.2237, lng:55.3536, tags_ar:['أثاث','مطابخ'], tags_en:['furniture','kitchens'], completedProjects:1200 },
  { id:'s7', name_ar:'دراغون مارت', name_en:'Dragon Mart', category:'building_materials', emirate:'dubai', area_ar:'المدينة الدولية', area_en:'International City', rating:4.3, reviews:1200, phone:'+971-4-222-4444', verified:true, lat:25.1710, lng:55.4071, tags_ar:['جملة','إضاءة'], tags_en:['wholesale','lighting'] },
  { id:'s8', name_ar:'مقاولات الدار الذهبية', name_en:'Golden Home Contracting', category:'construction', emirate:'dubai', area_ar:'البرشاء', area_en:'Al Barsha', rating:4.8, reviews:245, phone:'+971-4-333-5555', verified:true, lat:25.1134, lng:55.2005, tags_ar:['بناء فلل','ترميم'], tags_en:['villa construction','renovation'], completedProjects:78 },
  { id:'s9', name_ar:'سوق الجبيل للأدوات', name_en:'Jubail Tools Souk', category:'workshops', emirate:'sharjah', area_ar:'الجبيل', area_en:'Al Jubail', rating:4.6, reviews:245, phone:'+971-6-555-1111', verified:true, lat:25.3614, lng:55.3882, tags_ar:['أدوات'], tags_en:['tools'] },
  { id:'s10', name_ar:'الصفا للأدوات الصحية', name_en:'Al Safa Sanitary', category:'maintenance', emirate:'sharjah', area_ar:'الصناعية', area_en:'Industrial Area', rating:4.5, reviews:178, phone:'+971-6-555-2222', verified:true, lat:25.3209, lng:55.4152, tags_ar:['حنفيات','سخانات'], tags_en:['faucets','heaters'], completedProjects:445 },
  { id:'s11', name_ar:'ناشيونال بينتس الشارقة', name_en:'National Paints Sharjah', category:'paint', emirate:'sharjah', area_ar:'الصناعية ١٨', area_en:'Industrial Area 18', rating:4.8, reviews:334, phone:'+971-6-555-3333', verified:true, lat:25.3001, lng:55.4325, tags_ar:['دهانات','عوازل'], tags_en:['paints','insulation'] },
  { id:'s12', name_ar:'سوق الصين عجمان', name_en:'China Mall Ajman', category:'building_materials', emirate:'ajman', area_ar:'الجرف', area_en:'Al Jurf', rating:4.2, reviews:567, phone:'+971-6-777-1111', verified:true, lat:25.4105, lng:55.4491, tags_ar:['جملة','إضاءة'], tags_en:['wholesale','lighting'] },
  { id:'s13', name_ar:'RAK سيراميكس', name_en:'RAK Ceramics Showroom', category:'building_materials', emirate:'ras_al_khaimah', area_ar:'المنطقة الحرة', area_en:'Free Zone', rating:4.9, reviews:445, phone:'+971-7-244-1111', verified:true, lat:25.7817, lng:55.9552, tags_ar:['سيراميك','بورسلين'], tags_en:['ceramics','porcelain'], completedProjects:890 },
  { id:'s14', name_ar:'دار الهندسة للاستشارات', name_en:'Dar Al Handasah', category:'engineering', emirate:'dubai', area_ar:'الخليج التجاري', area_en:'Business Bay', rating:4.9, reviews:178, phone:'+971-4-444-8888', verified:true, lat:25.1851, lng:55.2615, tags_ar:['تصميم معماري','إشراف'], tags_en:['architectural design','supervision'], completedProjects:234 },
  { id:'s15', name_ar:'معلم أبو أحمد — نجارة', name_en:'Abu Ahmad — Carpentry', category:'craftsmen', emirate:'sharjah', area_ar:'الخان', area_en:'Al Khan', rating:4.7, reviews:534, phone:'+971-50-123-4567', verified:true, lat:25.3389, lng:55.3812, tags_ar:['نجارة','أبواب'], tags_en:['carpentry','doors'], completedProjects:412 },
  { id:'s16', name_ar:'جوتن شوروم', name_en:'Jotun Showroom', category:'paint', emirate:'dubai', area_ar:'ش. الشيخ زايد', area_en:'Sheikh Zayed Rd', rating:4.9, reviews:445, phone:'+971-4-222-6666', verified:true, lat:25.2048, lng:55.2708, tags_ar:['دهانات','ديكور'], tags_en:['paints','decoration'] },
  { id:'s17', name_ar:'الإمارات لتأجير المعدات', name_en:'Emirates Equipment Rental', category:'equipment', emirate:'dubai', area_ar:'جبل علي', area_en:'Jebel Ali', rating:4.4, reviews:167, phone:'+971-4-222-7777', verified:true, lat:25.0101, lng:55.0940, tags_ar:['حفارات','رافعات'], tags_en:['excavators','cranes'] },
  { id:'s18', name_ar:'شركة النظافة المتميزة', name_en:'Premium Cleaning Co.', category:'cleaning', emirate:'dubai', area_ar:'جميرا', area_en:'Jumeirah', rating:4.6, reviews:289, phone:'+971-4-888-9999', verified:true, lat:25.2285, lng:55.2640, tags_ar:['تنظيف عميق'], tags_en:['deep cleaning'], completedProjects:1560 },
  { id:'s19', name_ar:'أبوظبي للمقاولات العامة', name_en:'Abu Dhabi General Contracting', category:'construction', emirate:'abu_dhabi', area_ar:'الخالدية', area_en:'Al Khalidiyah', rating:4.7, reviews:201, phone:'+971-2-555-5555', verified:true, lat:24.4676, lng:54.3551, tags_ar:['بناء','مقاولات'], tags_en:['construction','contracting'], completedProjects:67 },
  { id:'s20', name_ar:'ورشة الخبير للألمنيوم', name_en:'Al Khabeer Aluminum', category:'workshops', emirate:'dubai', area_ar:'القصيص', area_en:'Al Qusais', rating:4.5, reviews:312, phone:'+971-4-267-1234', verified:true, lat:25.2739, lng:55.3697, tags_ar:['ألمنيوم','نوافذ'], tags_en:['aluminum','windows'], completedProjects:198 },
  { id:'s21', name_ar:'مركز أم القيوين لمواد البناء', name_en:'UAQ Building Materials', category:'building_materials', emirate:'umm_al_quwain', area_ar:'الصناعية', area_en:'Industrial Area', rating:4.3, reviews:89, phone:'+971-6-766-1111', verified:true, lat:25.5550, lng:55.5500, tags_ar:['بلوك','اسمنت'], tags_en:['blocks','cement'], completedProjects:45 },
  { id:'s22', name_ar:'شركة النور للصيانة', name_en:'Al Nour Maintenance', category:'maintenance', emirate:'umm_al_quwain', area_ar:'القديمة', area_en:'Old Town', rating:4.4, reviews:67, phone:'+971-6-766-2222', verified:false, lat:25.5690, lng:55.5630, tags_ar:['كهرباء','سباكة'], tags_en:['electrical','plumbing'] },
  { id:'s23', name_ar:'الفجيرة للرخام والجرانيت', name_en:'Fujairah Marble & Granite', category:'building_materials', emirate:'fujairah', area_ar:'الصناعية', area_en:'Industrial Area', rating:4.7, reviews:198, phone:'+971-9-222-1111', verified:true, lat:25.1220, lng:56.3340, tags_ar:['رخام','جرانيت'], tags_en:['marble','granite'], completedProjects:234 },
  { id:'s24', name_ar:'ورشة الساحل الشرقي', name_en:'East Coast Workshop', category:'workshops', emirate:'fujairah', area_ar:'دبا', area_en:'Dibba', rating:4.5, reviews:112, phone:'+971-9-222-2222', verified:true, lat:25.5950, lng:56.2630, tags_ar:['حدادة','أبواب'], tags_en:['blacksmith','doors'], completedProjects:156 },
  { id:'s25', name_ar:'مقاولات عجمان الحديثة', name_en:'Modern Ajman Contracting', category:'construction', emirate:'ajman', area_ar:'النعيمية', area_en:'Al Nuaimiya', rating:4.6, reviews:145, phone:'+971-6-777-3333', verified:true, lat:25.3980, lng:55.4440, tags_ar:['مقاولات','تشطيب'], tags_en:['contracting','finishing'], completedProjects:53 },
  { id:'s26', name_ar:'معرض الديار للأثاث', name_en:'Al Diyar Furniture', category:'furniture', emirate:'ajman', area_ar:'الكورنيش', area_en:'Corniche', rating:4.4, reviews:201, phone:'+971-6-777-4444', verified:false, lat:25.4150, lng:55.4370, tags_ar:['أثاث','ستائر'], tags_en:['furniture','curtains'] },
  { id:'s27', name_ar:'النخلة لخدمات التنظيف', name_en:'Al Nakhla Cleaning', category:'cleaning', emirate:'ras_al_khaimah', area_ar:'الحمرا', area_en:'Al Hamra', rating:4.5, reviews:98, phone:'+971-7-244-2222', verified:true, lat:25.6990, lng:55.7940, tags_ar:['تنظيف فلل'], tags_en:['villa cleaning'], completedProjects:678 },
  { id:'s28', name_ar:'التقنية لتأجير المعدات', name_en:'Al Teqnia Equipment Rental', category:'equipment', emirate:'sharjah', area_ar:'الصناعية ٣', area_en:'Industrial Area 3', rating:4.3, reviews:134, phone:'+971-6-555-8888', verified:true, lat:25.2900, lng:55.4500, tags_ar:['رافعات','حفارات'], tags_en:['cranes','excavators'], completedProjects:320 },
];

// ═══════════════════ ADVANCED MARKER ═══════════════════
function AdvancedMarker({ map, position, onClick, color = '#D4AF37', size = 10, variant = 'circle', zIndex = 0, isOwner = false }: {
  map: any; position: { lat: number; lng: number }; onClick?: () => void;
  color?: string; size?: number; variant?: 'circle' | 'user' | 'owner'; zIndex?: number; isOwner?: boolean;
}) {
  const markerRef = useRef<any>(null);
  const listenerRef = useRef<any>(null);

  useEffect(() => {
    const g = (window as any).google;
    if (!map || !g?.maps?.marker?.AdvancedMarkerElement) return;

    let el: HTMLElement;
    if (variant === 'user') {
      el = document.createElement('div');
      el.style.cssText = 'position:relative;width:22px;height:22px';
      const pulse = document.createElement('div');
      pulse.style.cssText = 'position:absolute;inset:-8px;border-radius:50%;background:rgba(59,91,254,0.2);animation:bait-pulse 2s ease-in-out infinite';
      el.appendChild(pulse);
      const dot = document.createElement('div');
      dot.style.cssText = 'width:22px;height:22px;border-radius:50%;background:#3B5BFE;border:3px solid #FFF;box-shadow:0 2px 10px rgba(59,91,254,0.5);position:relative';
      el.appendChild(dot);
    } else if (variant === 'owner') {
      el = document.createElement('div');
      el.style.cssText = 'position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center';
      const ring = document.createElement('div');
      ring.style.cssText = 'position:absolute;inset:-4px;border-radius:50%;border:2px solid #D4AF37;animation:bait-pulse 2s ease-in-out infinite;opacity:0.6';
      el.appendChild(ring);
      const dot = document.createElement('div');
      dot.style.cssText = 'width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#D4AF37,#C8A86A);border:3px solid #FFF;box-shadow:0 2px 12px rgba(212,175,55,0.6);cursor:pointer;position:relative;display:flex;align-items:center;justify-content:center;font-size:14px';
      dot.textContent = '★';
      el.appendChild(dot);
    } else {
      el = document.createElement('div');
      el.style.cssText = `width:${size*2}px;height:${size*2}px;border-radius:50%;background:${color};border:2.5px solid #FFF;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.25);transition:transform 0.15s ease`;
    }

    const marker = new g.maps.marker.AdvancedMarkerElement({ map, position, content: el, zIndex });
    markerRef.current = marker;
    if (onClick) listenerRef.current = marker.addListener('click', onClick);
    return () => { listenerRef.current?.remove(); marker.map = null; markerRef.current = null; };
  }, [map, position.lat, position.lng, color, size, variant, zIndex]);

  useEffect(() => {
    if (!markerRef.current) return;
    listenerRef.current?.remove();
    if (onClick) listenerRef.current = markerRef.current.addListener('click', onClick);
  }, [onClick]);

  return null;
}

// ═══════════════════ PERMISSION DIALOG ═══════════════════
function LocationPermissionDialog({ isEn, onAllow, onSkip }: { isEn: boolean; onAllow: () => void; onSkip: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center px-5"
      style={{ background: 'rgba(31,61,43,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{ background: '#F5EEE1', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}
        dir={isEn ? 'ltr' : 'rtl'}
      >
        {/* Header gradient */}
        <div className="relative overflow-hidden px-6 pt-8 pb-10 text-center" style={{ background: 'linear-gradient(135deg, #1F3D2B 0%, #2d5a3f 50%, #3B5BFE 100%)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 80%, #D4AF37, transparent 60%)' }} />
          {/* Animated pin */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center relative z-10"
            style={{ background: 'rgba(212,175,55,0.2)', border: '2px solid rgba(212,175,55,0.4)' }}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #C8A86A)' }}>
              <MapPin className="w-7 h-7 text-white" />
            </div>
          </motion.div>
          <h2 className="text-white text-xl font-black mb-1 relative z-10" style={{ fontFamily: f }}>
            {isEn ? 'Find Nearby Providers' : 'اكتشف المزودين القريبين منك'}
          </h2>
          <p className="text-white/60 text-sm relative z-10" style={{ fontFamily: f }}>
            {isEn ? 'Allow location access to see providers near you on the map' : 'اسمح بالوصول لموقعك لرؤية المزودين القريبين على الخريطة'}
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <div className="space-y-3 mb-6">
            {[
              { icon: Navigation, text_ar: 'عرض المزودين القريبين منك', text_en: 'Show nearby providers' },
              { icon: MapPin, text_ar: 'حساب المسافات بدقة', text_en: 'Calculate accurate distances' },
              { icon: Shield, text_ar: 'موقعك محمي ولا يُشارك', text_en: 'Your location stays private' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(31,61,43,0.08)' }}>
                  <item.icon className="w-4 h-4 text-[#1F3D2B]" />
                </div>
                <p className="text-sm font-semibold text-[#1F3D2B]" style={{ fontFamily: f }}>
                  {isEn ? item.text_en : item.text_ar}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={onAllow}
            className="w-full py-3.5 rounded-2xl font-black text-sm mb-3 flex items-center justify-center gap-2 transition-all active:scale-97"
            style={{ background: 'linear-gradient(135deg, #1F3D2B, #3B5BFE)', color: '#fff', fontFamily: f }}
          >
            <Navigation className="w-4 h-4" />
            {isEn ? 'Allow Location Access' : 'السماح بالوصول للموقع'}
          </button>

          <button
            onClick={onSkip}
            className="w-full py-3 rounded-2xl font-bold text-sm text-[#1F3D2B]/50 hover:text-[#1F3D2B]/70 transition-colors"
            style={{ fontFamily: f }}
          >
            {isEn ? 'Skip for now' : 'تخطي الآن'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════ MAIN COMPONENT ═══════════════════
export function MapsScreen() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { profile } = useUser();
  const { isLoaded, mapId, error: mapsError, retry: retryMaps } = useGoogleMaps();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  // Permission dialog
  const [showPermDialog, setShowPermDialog] = useState(false);
  const [permChecked, setPermChecked] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Map state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEmirate, setSelectedEmirate] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<MapProvider | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Real providers from backend
  const [backendProviders, setBackendProviders] = useState<MapProvider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);

  // Check first visit on mount
  useEffect(() => {
    const saved = localStorage.getItem(PERM_KEY);
    if (!saved) {
      setShowPermDialog(true);
    } else if (saved === 'granted') {
      doLocate(false);
    }
    setPermChecked(true);
  }, []);

  // Fetch real providers from backend
  useEffect(() => {
    fetchBackendProviders();
  }, []);

  const fetchBackendProviders = async () => {
    setIsLoadingProviders(true);
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a/providers/all`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const mapped: MapProvider[] = (data.providers || [])
        .filter((p: any) => p.lat && p.lng)
        .map((p: any) => ({
          id: `real_${p.id}`,
          name_ar: p.name || '',
          name_en: p.name || '',
          category: mapProviderCategory(p.category, p.specialties),
          emirate: mapEmirate(p.emirate),
          area_ar: p.city || p.emirate || '',
          area_en: p.city || p.emirate || '',
          rating: p.rating || 4.5,
          reviews: p.projects_count || 0,
          phone: p.phone,
          verified: p.is_verified || false,
          lat: p.lat,
          lng: p.lng,
          tags_ar: p.specialties || [],
          tags_en: p.specialties || [],
          completedProjects: p.projects_count,
          avatar_url: p.avatar_url,
          isRealProvider: true,
        }));
      setBackendProviders(mapped);
    } catch (e) {
      console.log('Provider fetch error:', e);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  function mapProviderCategory(cat: string, specs: string[] = []): string {
    const c = (cat || '').toLowerCase();
    if (c.includes('مقاول') || c.includes('contract')) return 'construction';
    if (c.includes('هندس') || c.includes('engineer')) return 'engineering';
    if (c.includes('صيانة') || c.includes('mainten')) return 'maintenance';
    if (c.includes('نجار') || c.includes('حداد') || c.includes('craft')) return 'craftsmen';
    if (c.includes('ورش') || c.includes('workshop')) return 'workshops';
    if (c.includes('دهان') || c.includes('paint')) return 'paint';
    if (c.includes('أثاث') || c.includes('ديكور') || c.includes('furni')) return 'furniture';
    if (c.includes('نظاف') || c.includes('clean')) return 'cleaning';
    if (c.includes('معدات') || c.includes('equipment')) return 'equipment';
    if (c.includes('مواد') || c.includes('material')) return 'building_materials';
    return 'construction';
  }

  function mapEmirate(em: string = ''): string {
    const e = em.toLowerCase();
    if (e.includes('دبي') || e.includes('dubai')) return 'dubai';
    if (e.includes('أبوظبي') || e.includes('abu dhabi') || e.includes('abudhabi')) return 'abu_dhabi';
    if (e.includes('الشارقة') || e.includes('sharjah')) return 'sharjah';
    if (e.includes('عجمان') || e.includes('ajman')) return 'ajman';
    if (e.includes('رأس') || e.includes('rak')) return 'ras_al_khaimah';
    if (e.includes('أم القيوين') || e.includes('uaq')) return 'umm_al_quwain';
    if (e.includes('الفجيرة') || e.includes('fujairah')) return 'fujairah';
    return 'dubai';
  }

  // All providers = static + real
  const allProviders = useMemo(() => {
    const realIds = new Set(backendProviders.map(p => p.id));
    return [...STATIC_PROVIDERS, ...backendProviders];
  }, [backendProviders]);

  // Filtered
  const filteredProviders = useMemo(() => {
    return allProviders.filter(p => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedEmirate !== 'all' && p.emirate !== selectedEmirate) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const name = (isEn ? p.name_en : p.name_ar).toLowerCase();
        const area = (isEn ? p.area_en : p.area_ar).toLowerCase();
        const tags = (isEn ? p.tags_en : p.tags_ar).join(' ').toLowerCase();
        if (!name.includes(q) && !area.includes(q) && !tags.includes(q)) return false;
      }
      return true;
    });
  }, [allProviders, selectedCategory, selectedEmirate, searchQuery, isEn]);

  // Is current user a provider and has their own pin?
  const myProviderPin = useMemo(() => {
    if (profile?.role !== 'provider') return null;
    const myCard = backendProviders.find(p => p.id === `real_${profile.id}`);
    return myCard;
  }, [profile, backendProviders]);

  // Init Google Map
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || mapRef.current) return;
    const g = (window as any).google;
    if (!g?.maps?.Map) return;

    const map = new g.maps.Map(mapContainerRef.current, {
      center: UAE_CENTER,
      zoom: 8,
      mapId,
      disableDefaultUI: true,
      zoomControl: false,
      gestureHandling: 'greedy',
      clickableIcons: false,
    });
    mapRef.current = map;
    setMapInstance(map);
    map.addListener('click', () => setSelectedProvider(null));
  }, [isLoaded, mapId]);

  const getCategoryInfo = useCallback((cat: string) => CATEGORIES.find(c => c.id === cat) || CATEGORIES[0], []);

  const handleEmirateSelect = useCallback((eid: string) => {
    setSelectedEmirate(eid);
    const em = EMIRATES.find(e => e.id === eid);
    if (em && mapRef.current) {
      mapRef.current.panTo({ lat: em.lat, lng: em.lng });
      mapRef.current.setZoom(em.zoom);
    }
  }, []);

  const handleMarkerClick = useCallback((p: MapProvider) => {
    setSelectedProvider(p);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: p.lat, lng: p.lng });
      mapRef.current.setZoom(15);
    }
  }, []);

  function doLocate(showToast = true) {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        if (mapRef.current) {
          mapRef.current.panTo(loc);
          mapRef.current.setZoom(14);
        }
        setIsLocating(false);
        if (showToast) toast.success(isEn ? 'Location found!' : 'تم تحديد موقعك!');
      },
      () => {
        setIsLocating(false);
        if (showToast) toast.info(isEn ? 'Enable location in browser settings' : 'فعّل الموقع من إعدادات المتصفح');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const handleAllowLocation = () => {
    localStorage.setItem(PERM_KEY, 'granted');
    setShowPermDialog(false);
    doLocate(true);
  };

  const handleSkipLocation = () => {
    localStorage.setItem(PERM_KEY, 'skipped');
    setShowPermDialog(false);
  };

  // Counts per emirate
  const emirateCounts = useMemo(() => {
    const counts: Record<string, number> = { all: filteredProviders.length };
    filteredProviders.forEach(p => {
      counts[p.emirate] = (counts[p.emirate] || 0) + 1;
    });
    return counts;
  }, [filteredProviders]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allProviders.length };
    allProviders.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }, [allProviders]);

  // Google Maps URL
  const getGoogleMapsUrl = (p: MapProvider) => p.lat && p.lng
    ? `https://www.google.com/maps?q=${p.lat},${p.lng}&query=${encodeURIComponent(isEn ? p.name_en : p.name_ar)}`
    : '';

  const verifiedCount = useMemo(() => filteredProviders.filter(p => p.verified).length, [filteredProviders]);
  const emiratesWithProviders = useMemo(() => {
    const set = new Set(filteredProviders.map(p => p.emirate));
    set.delete('all');
    return set.size;
  }, [filteredProviders]);

  // Role-based header config
  const headerConfig = useMemo(() => {
    if (profile?.role === 'provider') return {
      title_ar: 'خريطة المزودين — نشاطك',
      title_en: 'Providers Map — Your Business',
      subtitle_ar: 'موقعك مميّز بنجمة ذهبية على الخريطة',
      subtitle_en: 'Your location is highlighted with a gold star',
    };
    if (profile?.role === 'admin') return {
      title_ar: 'خريطة المزودين — الإدارة',
      title_en: 'Providers Map — Admin View',
      subtitle_ar: 'جميع المزودين المسجّلين على المنصة',
      subtitle_en: 'All registered providers on the platform',
    };
    return {
      title_ar: 'خريطة المحلات والمزودين',
      title_en: 'Providers & Stores Map',
      subtitle_ar: 'ابحث عن مزود خدمة في منطقتك',
      subtitle_en: 'Find a service provider near you',
    };
  }, [profile?.role]);

  // ── NOT LOADED ──
  if (!isLoaded) {
    return (
      <div className="min-h-[calc(100vh-100px)] bg-[#F5EEE1] flex flex-col" dir={isEn ? 'ltr' : 'rtl'}>
        {/* Permission dialog */}
        <AnimatePresence>
          {showPermDialog && (
            <LocationPermissionDialog isEn={isEn} onAllow={handleAllowLocation} onSkip={handleSkipLocation} />
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="px-4 pt-5 pb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1F3D2B 0%, #2d5a3f 50%, #3B5BFE 100%)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #D4AF37, transparent 60%)' }} />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black text-white" style={{ fontFamily: f }}>{isEn ? headerConfig.title_en : headerConfig.title_ar}</h1>
              <p className="text-xs text-white/50" style={{ fontFamily: f }}>{isEn ? headerConfig.subtitle_en : headerConfig.subtitle_ar}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          {/* Loading state — spinner داخلي بدون DecorativeMap */}
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="w-10 h-10 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
            <span className="text-sm text-[#1F3D2B]/50 font-bold" style={{ fontFamily: f }}>
              {isEn ? 'Loading Google Maps...' : 'جاري تحميل خرائط جوجل...'}
            </span>
          </div>
          {mapsError && (
            <div className="mt-4 bg-white/90 rounded-2xl p-5 border border-[#D4AF37]/20 space-y-3">
              <p className="text-sm font-bold text-[#1F3D2B]/70" style={{ fontFamily: f }}>
                {isEn ? 'Google Maps requires API key setup.' : 'خرائط جوجل تتطلب إعداد مفتاح API.'}
              </p>
              <button onClick={retryMaps} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: '#D4AF37', color: '#1F3D2B', fontFamily: f }}>
                <RefreshCw className="w-4 h-4" />
                {isEn ? 'Retry' : 'إعادة المحاولة'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── MAIN MAP ──
  return (
    <div className="relative flex flex-col" style={{ height: 'calc(100vh - 100px)' }} dir={isEn ? 'ltr' : 'rtl'}>
      {/* Permission Dialog */}
      <AnimatePresence>
        {showPermDialog && (
          <LocationPermissionDialog isEn={isEn} onAllow={handleAllowLocation} onSkip={handleSkipLocation} />
        )}
      </AnimatePresence>

      {/* ── MAP CANVAS ── */}
      <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* ── MARKERS ── */}
      {mapInstance && filteredProviders.map(p => {
        const cat = getCategoryInfo(p.category);
        const isMe = myProviderPin && p.id === myProviderPin.id;
        const isActive = selectedProvider?.id === p.id;
        if (isMe) return (
          <AdvancedMarker key={p.id} map={mapInstance} position={{ lat: p.lat, lng: p.lng }}
            onClick={() => handleMarkerClick(p)} variant="owner" zIndex={200} />
        );
        return (
          <AdvancedMarker key={p.id} map={mapInstance} position={{ lat: p.lat, lng: p.lng }}
            onClick={() => handleMarkerClick(p)} variant="circle" color={cat.color}
            size={isActive ? 14 : p.isRealProvider ? 12 : 10}
            zIndex={isActive ? 150 : p.isRealProvider ? 100 : 50} />
        );
      })}
      {mapInstance && userLocation && (
        <AdvancedMarker map={mapInstance} position={userLocation} variant="user" zIndex={300} />
      )}

      {/* ── TOP OVERLAY ── */}
      <div className="absolute top-0 inset-x-0 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Header */}
          <div className="mx-3 mt-3 rounded-2xl overflow-hidden shadow-lg" style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #1F3D2B, #3B5BFE)' }}>
              <div>
                <p className="text-white font-black text-sm" style={{ fontFamily: f }}>{isEn ? headerConfig.title_en : headerConfig.title_ar}</p>
                <p className="text-white/50 text-[10px]" style={{ fontFamily: f }}>{isEn ? headerConfig.subtitle_en : headerConfig.subtitle_ar}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowSearch(v => !v)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <Search className="w-4 h-4 text-white" />
                </button>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <AnimatePresence>
              {showSearch && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-3 py-2 flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#1F3D2B]/40 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder={isEn ? 'Search provider, area, service...' : 'ابحث عن مزود، منطقة، خدمة...'}
                      className="flex-1 bg-transparent border-none outline-none text-sm text-[#1F3D2B]"
                      style={{ fontFamily: f }}
                    />
                    {searchQuery && <button onClick={() => setSearchQuery('')}><X className="w-4 h-4 text-[#1F3D2B]/40" /></button>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Category Pills */}
          <div className="px-3 mt-2 overflow-x-auto flex gap-2 pb-1 scrollbar-hide">
            {CATEGORIES.filter(c => (categoryCounts[c.id] || 0) > 0 || c.id === 'all').map(cat => {
              const Icon = cat.Icon;
              const count = cat.id === 'all' ? allProviders.length : (categoryCounts[cat.id] || 0);
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap font-bold text-xs transition-all flex-shrink-0 shadow-sm"
                  style={{
                    background: isActive ? cat.color : 'rgba(255,255,255,0.95)',
                    color: isActive ? '#fff' : '#1F3D2B',
                    border: isActive ? `2px solid ${cat.color}` : '2px solid rgba(255,255,255,0.8)',
                    fontFamily: f,
                  }}
                >
                  <Icon className="w-3 h-3" />
                  {isEn ? cat.en : cat.ar}
                  <span className="text-[10px] font-black opacity-80">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Emirate Pills */}
          <div className="px-3 mt-1.5 overflow-x-auto flex gap-2 pb-1 scrollbar-hide">
            {EMIRATES.map(em => {
              const count = em.id === 'all' ? filteredProviders.length : (emirateCounts[em.id] || 0);
              if (count === 0 && em.id !== 'all') return null;
              const isActive = selectedEmirate === em.id;
              return (
                <button
                  key={em.id}
                  onClick={() => handleEmirateSelect(em.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full whitespace-nowrap font-bold text-xs transition-all flex-shrink-0 shadow-sm"
                  style={{
                    background: isActive ? '#1F3D2B' : 'rgba(255,255,255,0.95)',
                    color: isActive ? '#fff' : '#1F3D2B',
                    border: isActive ? '2px solid #1F3D2B' : '2px solid rgba(255,255,255,0.8)',
                    fontFamily: f,
                  }}
                >
                  {isEn ? em.en : em.ar}
                  <span className="text-[10px] font-black" style={{ color: isActive ? '#D4AF37' : '#1F3D2B60' }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SIDE CONTROLS ── */}
      <div className="absolute z-20 flex flex-col gap-2" style={{ [isEn ? 'right' : 'left']: 12, bottom: 100 }}>
        {/* Locate Me */}
        <button
          onClick={() => doLocate(true)}
          disabled={isLocating}
          className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          {isLocating ? <div className="w-4 h-4 border-2 border-[#3B5BFE]/30 border-t-[#3B5BFE] rounded-full animate-spin" /> : <Locate className="w-5 h-5 text-[#3B5BFE]" />}
        </button>

        {/* Zoom In */}
        <button
          onClick={() => { const z = mapRef.current?.getZoom(); mapRef.current?.setZoom((z || 8) + 1); }}
          className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg text-xl font-bold text-[#1F3D2B] transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(212,175,55,0.2)' }}
        >+</button>

        {/* Zoom Out */}
        <button
          onClick={() => { const z = mapRef.current?.getZoom(); mapRef.current?.setZoom((z || 8) - 1); }}
          className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg text-xl font-bold text-[#1F3D2B] transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(212,175,55,0.2)' }}
        >−</button>

        {/* Refresh backend */}
        <button
          onClick={fetchBackendProviders}
          className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          <RefreshCw className={`w-4 h-4 text-[#D4AF37] ${isLoadingProviders ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* ── BOTTOM SHEET — Provider Detail ── */}
      <AnimatePresence>
        {selectedProvider && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="absolute inset-x-0 bottom-0 z-30 rounded-t-3xl overflow-hidden shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', maxHeight: '55%' }}
          >
            {/* Pull handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="px-4 pb-6 overflow-y-auto">
              {/* Provider header */}
              <div className="flex items-start gap-3 mb-4">
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-xl font-black overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${getCategoryInfo(selectedProvider.category).color}40, ${getCategoryInfo(selectedProvider.category).color}20)`, border: `2px solid ${getCategoryInfo(selectedProvider.category).color}30` }}
                >
                  {selectedProvider.avatar_url ? (
                    <img src={selectedProvider.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (() => { const Icon = getCategoryInfo(selectedProvider.category).Icon; return <Icon className="w-7 h-7" style={{ color: getCategoryInfo(selectedProvider.category).color }} />; })()
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black text-[#1F3D2B] truncate" style={{ fontFamily: f }}>
                      {isEn ? selectedProvider.name_en : selectedProvider.name_ar}
                    </h3>
                    {selectedProvider.verified && <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />}
                    {selectedProvider.isRealProvider && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#3B5BFE15', color: '#3B5BFE', border: '1px solid #3B5BFE25' }}>
                        {isEn ? 'Registered' : 'مسجّل'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#1F3D2B]/50 mb-1.5" style={{ fontFamily: f }}>
                    {isEn ? selectedProvider.area_en : selectedProvider.area_ar}
                    {' · '}
                    {isEn ? getCategoryInfo(selectedProvider.category).en : getCategoryInfo(selectedProvider.category).ar}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                      <span className="text-xs font-black text-[#1F3D2B]" style={{ fontFamily: f }}>{selectedProvider.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-[#1F3D2B]/40" style={{ fontFamily: f }}>({selectedProvider.reviews})</span>
                    </div>
                    {selectedProvider.completedProjects && (
                      <span className="text-[10px] text-[#1F3D2B]/40" style={{ fontFamily: f }}>
                        {selectedProvider.completedProjects} {isEn ? 'projects' : 'مشروع'}
                      </span>
                    )}
                  </div>
                </div>

                <button onClick={() => setSelectedProvider(null)} className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(31,61,43,0.06)' }}>
                  <X className="w-4 h-4 text-[#1F3D2B]/50" />
                </button>
              </div>

              {/* Tags */}
              {(isEn ? selectedProvider.tags_en : selectedProvider.tags_ar).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(isEn ? selectedProvider.tags_en : selectedProvider.tags_ar).slice(0, 4).map((tag, i) => (
                    <span key={i} className="text-[10px] font-semibold px-2 py-1 rounded-lg" style={{ background: 'rgba(31,61,43,0.06)', color: '#1F3D2B', fontFamily: f }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {selectedProvider.phone && (
                  <a href={`tel:${selectedProvider.phone}`} className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm" style={{ background: '#1F3D2B', color: '#fff', fontFamily: f }}>
                    <Phone className="w-4 h-4" />
                    {isEn ? 'Call' : 'اتصال'}
                  </a>
                )}
                {selectedProvider.phone && (
                  <a href={`https://wa.me/${selectedProvider.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm" style={{ background: '#25D366', color: '#fff', fontFamily: f }} onClick={e => e.stopPropagation()}>
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                )}
              </div>

              {/* Google Maps Link */}
              {getGoogleMapsUrl(selectedProvider) && (
                <a
                  href={getGoogleMapsUrl(selectedProvider)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm mb-2"
                  style={{ background: 'linear-gradient(135deg, #1F3D2B, #3B5BFE)', color: '#fff', fontFamily: f }}
                  onClick={e => e.stopPropagation()}
                >
                  <Navigation className="w-4 h-4" />
                  {isEn ? 'Open in Google Maps' : 'فتح في خرائط جوجل'}
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BOTTOM STATUS BAR ── */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 px-4 py-2 flex items-center justify-between"
        style={{ background: 'rgba(31,61,43,0.92)', backdropFilter: 'blur(8px)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#D4AF37' }} />
            <span className="text-[11px] font-bold text-white/70" style={{ fontFamily: f }}>
              {filteredProviders.length} {isEn ? 'providers' : 'مزود على الخريطة'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3B5BFE]" />
            <span className="text-[11px] font-bold text-white/50" style={{ fontFamily: f }}>
              {verifiedCount} {isEn ? 'verified' : 'موثّق'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#C8A86A' }} />
            <span className="text-[11px] font-bold text-white/50" style={{ fontFamily: f }}>
              {emiratesWithProviders || 7} {isEn ? 'emirates' : 'إمارات'}
            </span>
          </div>
        </div>
        {profile?.role === 'provider' && myProviderPin && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold" style={{ color: '#D4AF37', fontFamily: f }}>
              {isEn ? 'Your pin is live' : 'دبوسك مفعّل'}
            </span>
            <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          </div>
        )}
        {profile?.role === 'provider' && !myProviderPin && (
          <span className="text-[10px] text-white/40 font-bold" style={{ fontFamily: f }}>
            {isEn ? 'Register to appear on map' : 'سجّل لتظهر على الخريطة'}
          </span>
        )}
      </div>

      {/* Pulse animation style */}
      <style>{`
        @keyframes bait-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}