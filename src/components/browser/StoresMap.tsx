/**
 * StoresMap.tsx — خريطة المزودين والمتاجر التفاعلية
 * ═══════════════════════════════════════════════════
 * الواجهة الرئيسية للمسجلين + واجهة المتجر للمزودين
 * Google Maps مع ستايل Biet Al Reef Clean
 */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
// @react-google-maps/api removed — using raw Google Maps DOM API
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Search, Star, Phone, Clock, X, Navigation,
  Store, Hammer, Paintbrush, Wrench, Sofa, Building2,
  Truck, Sparkles, MessageCircle, CheckCircle, Filter,
  ChevronDown, ChevronUp, ExternalLink, Locate, Layers,
  Package, Compass, HardHat, Settings, Shield, Eye,
  Heart, Share2, Award, TrendingUp, ArrowRight, UserPlus,
} from 'lucide-react';
import { Icon3D } from '../ui/Icon3D';
import { useGoogleMaps } from '../providers/GoogleMapsLoader';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSmartUI } from '../../hooks/useSmartUI';


const f = 'Cairo, sans-serif';

/* ═══════════════════ TYPES ═══════════════════ */
interface StoreItem {
  id: string;
  name_ar: string;
  name_en: string;
  category: string;
  emirate: string;
  area_ar: string;
  area_en: string;
  rating: number;
  reviews: number;
  phone: string;
  hours_ar: string;
  hours_en: string;
  verified: boolean;
  lat: number;
  lng: number;
  tags_ar: string[];
  tags_en: string[];
  completedProjects?: number;
  responseTime_ar?: string;
  responseTime_en?: string;
  image?: string;
}

/* ═══════════════════ CATEGORIES ═══════════════════ */
const CATEGORIES = [
  { id: 'all', ar: 'الكل', en: 'All', Icon: Store, color: '#D4AF37', theme: 'gold' },
  { id: 'construction', ar: 'مقاولات', en: 'Contracting', Icon: Building2, color: '#E67E22', theme: 'orange' },
  { id: 'engineering', ar: 'استشارات هندسية', en: 'Engineering', Icon: Compass, color: '#3B5BFE', theme: 'blue' },
  { id: 'maintenance', ar: 'شركات صيانة', en: 'Maintenance', Icon: Wrench, color: '#D4AF37', theme: 'gold' },
  { id: 'craftsmen', ar: 'عمالة حرفية', en: 'Craftsmen', Icon: HardHat, color: '#C68B3E', theme: 'amber' },
  { id: 'workshops', ar: 'الورش', en: 'Workshops', Icon: Hammer, color: '#8D6E63', theme: 'brown' },
  { id: 'building_materials', ar: 'مواد البناء', en: 'Materials', Icon: Package, color: '#D97706', theme: 'orange' },
  { id: 'furniture', ar: 'ثاث وديكور', en: 'Furniture', Icon: Sofa, color: '#7C5ADA', theme: 'purple' },
  { id: 'paint', ar: 'دهانات', en: 'Paints', Icon: Paintbrush, color: '#E91E90', theme: 'pink' },
  { id: 'equipment', ar: 'تأجير معدات', en: 'Equipment', Icon: Truck, color: '#C68B3E', theme: 'amber' },
  { id: 'cleaning', ar: 'خدمات نظافة', en: 'Cleaning', Icon: Sparkles, color: '#26A69A', theme: 'teal' },
];

/* ═══════════════════ STORE DATA ═══════════════════ */
const STORES: StoreItem[] = [
  // Abu Dhabi
  { id:'s1', name_ar:'مصنع الإمارات لمواد البناء', name_en:'Emirates Building Materials', category:'building_materials', emirate:'abu_dhabi', area_ar:'مصفح الصناعية', area_en:'Musaffah Industrial', rating:4.8, reviews:312, phone:'+971-2-555-1234', hours_ar:'٨ص - ٩م', hours_en:'8AM - 9PM', verified:true, lat:24.3517, lng:54.5024, tags_ar:['اسمنت','حديد','رمل'], tags_en:['cement','steel','sand'], completedProjects: 156, responseTime_ar: '30 دقيقة', responseTime_en: '30 min' },
  { id:'s2', name_ar:'معرض الخليج للأثاث', name_en:'Gulf Furniture Gallery', category:'furniture', emirate:'abu_dhabi', area_ar:'شارع المطار', area_en:'Airport Road', rating:4.6, reviews:189, phone:'+971-2-555-2345', hours_ar:'٠٠ص - ٠٠م', hours_en:'10AM - 12AM', verified:true, lat:24.4539, lng:54.6532, tags_ar:['أثاث','ديكور','مفروشات'], tags_en:['furniture','decor','furnishings'], completedProjects: 89, responseTime_ar: '1 ساعة', responseTime_en: '1 hour' },
  { id:'s3', name_ar:'مركز النخبة للدهانات', name_en:'Elite Paints Center', category:'paint', emirate:'abu_dhabi', area_ar:'المرور', area_en:'Al Muroor', rating:4.5, reviews:156, phone:'+971-2-555-3456', hours_ar:'٩ص - ٨م', hours_en:'9AM - 8PM', verified:false, lat:24.4650, lng:54.3730, tags_ar:['جوتن','ناشيونال','دهانات'], tags_en:['jotun','national','paints'] },
  // Dubai
  { id:'s4', name_ar:'سوق الراس للأدوات', name_en:'Al Ras Tools Market', category:'workshops', emirate:'dubai', area_ar:'ديرة', area_en:'Deira', rating:4.9, reviews:428, phone:'+971-4-222-1111', hours_ar:'٧ص - ١١م', hours_en:'7AM - 11PM', verified:true, lat:25.2697, lng:55.2963, tags_ar:['عدد يدوية','كهربائية','لحام'], tags_en:['hand tools','electric','welding'], completedProjects: 342, responseTime_ar: '15 دقيقة', responseTime_en: '15 min' },
  { id:'s5', name_ar:'الفارس لمواد البناء', name_en:'Al Fares Building Materials', category:'building_materials', emirate:'dubai', area_ar:'القوز الصناعية', area_en:'Al Quoz Industrial', rating:4.7, reviews:367, phone:'+971-4-222-2222', hours_ar:'٦ص - ٠٠م', hours_en:'6AM - 10PM', verified:true, lat:25.1536, lng:55.2236, tags_ar:['بلاط','سيراميك','رخام'], tags_en:['tiles','ceramic','marble'], completedProjects: 203, responseTime_ar: '20 دقيقة', responseTime_en: '20 min' },
  { id:'s6', name_ar:'هوم سنتر', name_en:'Home Centre', category:'furniture', emirate:'dubai', area_ar:'فستيفال سيتي', area_en:'Festival City', rating:4.4, reviews:892, phone:'+971-4-222-3333', hours_ar:'٠٠ص - ٠٠م', hours_en:'10AM - 12AM', verified:true, lat:25.2237, lng:55.3536, tags_ar:['أثاث','مطابخ','حمامات'], tags_en:['furniture','kitchens','bathrooms'], completedProjects: 1200 },
  { id:'s7', name_ar:'دراغون مارت', name_en:'Dragon Mart', category:'building_materials', emirate:'dubai', area_ar:'المنطقة العالمية', area_en:'International City', rating:4.3, reviews:1200, phone:'+971-4-222-4444', hours_ar:'٠٠ص - ٠٠م', hours_en:'10AM - 10PM', verified:true, lat:25.1710, lng:55.4071, tags_ar:['جملة','إضاءة','أرضيات'], tags_en:['wholesale','lighting','flooring'] },
  { id:'s8', name_ar:'مقاولات الدار الذهبية', name_en:'Golden Home Contracting', category:'construction', emirate:'dubai', area_ar:'البرشاء', area_en:'Al Barsha', rating:4.8, reviews:245, phone:'+971-4-333-5555', hours_ar:'٨ص - ٦م', hours_en:'8AM - 6PM', verified:true, lat:25.1134, lng:55.2005, tags_ar:['بناء فلل','ترميم','توسعات'], tags_en:['villa construction','renovation','extensions'], completedProjects: 78, responseTime_ar: '45 دقيقة', responseTime_en: '45 min' },
  // Sharjah
  { id:'s9', name_ar:'سوق الجبيل للأدوات', name_en:'Jubail Tools Souk', category:'workshops', emirate:'sharjah', area_ar:'الجبيل', area_en:'Al Jubail', rating:4.6, reviews:245, phone:'+971-6-555-1111', hours_ar:'٨ص - ٩م', hours_en:'8AM - 9PM', verified:true, lat:25.3614, lng:55.3882, tags_ar:['أدوات','مسامير','براغي'], tags_en:['tools','nails','screws'] },
  { id:'s10', name_ar:'الصفا للأدوات الصحية', name_en:'Al Safa Sanitary', category:'maintenance', emirate:'sharjah', area_ar:'المنطقة الصناعية', area_en:'Industrial Area', rating:4.5, reviews:178, phone:'+971-6-555-2222', hours_ar:'٨ص - ٨م', hours_en:'8AM - 8PM', verified:true, lat:25.3209, lng:55.4152, tags_ar:['حنفيات','مراحيض','سخانات'], tags_en:['faucets','toilets','heaters'], completedProjects: 445 },
  { id:'s11', name_ar:'ناشيونال بينتس الشارقة', name_en:'National Paints Sharjah', category:'paint', emirate:'sharjah', area_ar:'المنطقة الصناعية ١٨', area_en:'Industrial Area 18', rating:4.8, reviews:334, phone:'+971-6-555-3333', hours_ar:'٧:٣٠ص - ٧م', hours_en:'7:30AM - 7PM', verified:true, lat:25.3001, lng:55.4325, tags_ar:['دهانات','عوازل','ألوان'], tags_en:['paints','insulation','colors'] },
  // Ajman
  { id:'s12', name_ar:'سوق الصين عجمان', name_en:'China Mall Ajman', category:'building_materials', emirate:'ajman', area_ar:'الجرف', area_en:'Al Jurf', rating:4.2, reviews:567, phone:'+971-6-777-1111', hours_ar:'٠٠ص - ٠٠م', hours_en:'10AM - 10PM', verified:true, lat:25.4105, lng:55.4491, tags_ar:['جملة','إكسسوارات','إضاءة'], tags_en:['wholesale','accessories','lighting'] },
  // RAK
  { id:'s13', name_ar:'RAK سيراميكس شوروم', name_en:'RAK Ceramics Showroom', category:'building_materials', emirate:'ras_al_khaimah', area_ar:'المنطقة الحرة', area_en:'Free Zone', rating:4.9, reviews:445, phone:'+971-7-244-1111', hours_ar:'٩ص - ٦م', hours_en:'9AM - 6PM', verified:true, lat:25.7817, lng:55.9552, tags_ar:['سيراميك','بورسلين','بلاط'], tags_en:['ceramics','porcelain','tiles'], completedProjects: 890 },
  // Engineering
  { id:'s14', name_ar:'دار الهندسة للاستشارات', name_en:'Dar Al Handasah', category:'engineering', emirate:'dubai', area_ar:'الخليج التجاري', area_en:'Business Bay', rating:4.9, reviews:178, phone:'+971-4-444-8888', hours_ar:'٩ص - ٦م', hours_en:'9AM - 6PM', verified:true, lat:25.1851, lng:55.2615, tags_ar:['تصميم معماري','إنشائي','إشراف'], tags_en:['architectural design','structural','supervision'], completedProjects: 234, responseTime_ar: '2 ساعة', responseTime_en: '2 hours' },
  // Craftsmen
  { id:'s15', name_ar:'معلم أبو أحمد — نجارة', name_en:'Abu Ahmad — Carpentry', category:'craftsmen', emirate:'sharjah', area_ar:'الخان', area_en:'Al Khan', rating:4.7, reviews:534, phone:'+971-50-123-4567', hours_ar:'٧ص - ٧م', hours_en:'7AM - 7PM', verified:true, lat:25.3389, lng:55.3812, tags_ar:['نجارة','أبواب','مطابخ'], tags_en:['carpentry','doors','kitchens'], completedProjects: 412, responseTime_ar: '10 دقائق', responseTime_en: '10 min' },
  // More Dubai
  { id:'s16', name_ar:'جوتن شوروم', name_en:'Jotun Showroom', category:'paint', emirate:'dubai', area_ar:'شارع الشيخ زايد', area_en:'Sheikh Zayed Rd', rating:4.9, reviews:445, phone:'+971-4-222-6666', hours_ar:'٩ص - ٩م', hours_en:'9AM - 9PM', verified:true, lat:25.2048, lng:55.2708, tags_ar:['دهانات','ألوان','ديكور'], tags_en:['paints','colors','decoration'] },
  { id:'s17', name_ar:'الإمارات لتأجير المعدات', name_en:'Emirates Equipment Rental', category:'equipment', emirate:'dubai', area_ar:'جبل علي', area_en:'Jebel Ali', rating:4.4, reviews:167, phone:'+971-4-222-7777', hours_ar:'٦ص - ٨م', hours_en:'6AM - 8PM', verified:true, lat:25.0101, lng:55.0940, tags_ar:['حفارات','رافعات','كمبريسور'], tags_en:['excavators','cranes','compressor'] },
  // Cleaning
  { id:'s18', name_ar:'شركة النظافة المتميزة', name_en:'Premium Cleaning Co.', category:'cleaning', emirate:'dubai', area_ar:'جميرا', area_en:'Jumeirah', rating:4.6, reviews:289, phone:'+971-4-888-9999', hours_ar:'٧ص - ١٠م', hours_en:'7AM - 10PM', verified:true, lat:25.2285, lng:55.2640, tags_ar:['تنظيف عميق','منازل','مكاتب'], tags_en:['deep cleaning','homes','offices'], completedProjects: 1560, responseTime_ar: '1 ساعة', responseTime_en: '1 hour' },
  // Abu Dhabi extra
  { id:'s19', name_ar:'أبوظبي للمقاولات العامة', name_en:'Abu Dhabi General Contracting', category:'construction', emirate:'abu_dhabi', area_ar:'الخالدية', area_en:'Al Khalidiyah', rating:4.7, reviews:201, phone:'+971-2-555-5555', hours_ar:'٧ص - ٥م', hours_en:'7AM - 5PM', verified:true, lat:24.4676, lng:54.3551, tags_ar:['بناء','مقاولات عامة','ترميم'], tags_en:['construction','general contracting','renovation'], completedProjects: 67, responseTime_ar: '1 ساعة', responseTime_en: '1 hour' },
  { id:'s20', name_ar:'ورشة الخبير للألمنيوم', name_en:'Al Khabeer Aluminum Workshop', category:'workshops', emirate:'dubai', area_ar:'القصيص', area_en:'Al Qusais', rating:4.5, reviews:312, phone:'+971-4-267-1234', hours_ar:'٨ص - ٨م', hours_en:'8AM - 8PM', verified:true, lat:25.2739, lng:55.3697, tags_ar:['ألمنيوم','نوافذ','واجهات'], tags_en:['aluminum','windows','facades'], completedProjects: 198, responseTime_ar: '30 دقيقة', responseTime_en: '30 min' },
  // Umm Al Quwain
  { id:'s21', name_ar:'مركز أم القيوين لمواد البناء', name_en:'UAQ Building Materials Center', category:'building_materials', emirate:'umm_al_quwain', area_ar:'المنطقة الصناعية', area_en:'Industrial Area', rating:4.3, reviews:89, phone:'+971-6-766-1111', hours_ar:'٧ص - ٨م', hours_en:'7AM - 8PM', verified:true, lat:25.5550, lng:55.5500, tags_ar:['بلوك','اسمنت','رمل'], tags_en:['blocks','cement','sand'], completedProjects: 45 },
  { id:'s22', name_ar:'شركة النور للصيانة', name_en:'Al Nour Maintenance Co.', category:'maintenance', emirate:'umm_al_quwain', area_ar:'أم القيوين القديمة', area_en:'Old Town UAQ', rating:4.4, reviews:67, phone:'+971-6-766-2222', hours_ar:'٨ص - ٧م', hours_en:'8AM - 7PM', verified:false, lat:25.5690, lng:55.5630, tags_ar:['كهرباء','سباكة','تكييف'], tags_en:['electrical','plumbing','AC'], responseTime_ar: '45 دقيقة', responseTime_en: '45 min' },
  // Fujairah
  { id:'s23', name_ar:'الفجيرة للرخام والجرانيت', name_en:'Fujairah Marble & Granite', category:'building_materials', emirate:'fujairah', area_ar:'المنطقة الصناعية', area_en:'Industrial Area', rating:4.7, reviews:198, phone:'+971-9-222-1111', hours_ar:'٧ص - ٧م', hours_en:'7AM - 7PM', verified:true, lat:25.1220, lng:56.3340, tags_ar:['رخام','جرانيت','حجر طبيعي'], tags_en:['marble','granite','natural stone'], completedProjects: 234, responseTime_ar: '1 ساعة', responseTime_en: '1 hour' },
  { id:'s24', name_ar:'ورشة الساحل الشرقي', name_en:'East Coast Workshop', category:'workshops', emirate:'fujairah', area_ar:'دبا الفجيرة', area_en:'Dibba Al Fujairah', rating:4.5, reviews:112, phone:'+971-9-222-2222', hours_ar:'٨ص - ٦م', hours_en:'8AM - 6PM', verified:true, lat:25.5950, lng:56.2630, tags_ar:['حدادة','ألمنيوم','أبواب'], tags_en:['blacksmith','aluminum','doors'], completedProjects: 156 },
  // Ajman extra
  { id:'s25', name_ar:'مقاولات عجمان الحديثة', name_en:'Modern Ajman Contracting', category:'construction', emirate:'ajman', area_ar:'النعيمية', area_en:'Al Nuaimiya', rating:4.6, reviews:145, phone:'+971-6-777-3333', hours_ar:'٧ص - ٥م', hours_en:'7AM - 5PM', verified:true, lat:25.3980, lng:55.4440, tags_ar:['مقاولات','بناء فلل','تشطيب'], tags_en:['contracting','villa construction','finishing'], completedProjects: 53, responseTime_ar: '30 دقيقة', responseTime_en: '30 min' },
  { id:'s26', name_ar:'معرض الديار للأثاث', name_en:'Al Diyar Furniture Gallery', category:'furniture', emirate:'ajman', area_ar:'كورنيش عجمان', area_en:'Ajman Corniche', rating:4.4, reviews:201, phone:'+971-6-777-4444', hours_ar:'١٠ص - ١٠م', hours_en:'10AM - 10PM', verified:false, lat:25.4150, lng:55.4370, tags_ar:['أثاث منزلي','مكتبي','ستائر'], tags_en:['home furniture','office','curtains'] },
  // RAK extra
  { id:'s27', name_ar:'النخلة لخدمات التنظيف', name_en:'Al Nakhla Cleaning Services', category:'cleaning', emirate:'ras_al_khaimah', area_ar:'الحمرا', area_en:'Al Hamra', rating:4.5, reviews:98, phone:'+971-7-244-2222', hours_ar:'٧ص - ٩م', hours_en:'7AM - 9PM', verified:true, lat:25.6990, lng:55.7940, tags_ar:['تنظيف منازل','فلل','بعد البناء'], tags_en:['home cleaning','villas','post-construction'], completedProjects: 678, responseTime_ar: '2 ساعة', responseTime_en: '2 hours' },
  // Sharjah extra
  { id:'s28', name_ar:'التقنية لتأجير المعدات', name_en:'Al Teqnia Equipment Rental', category:'equipment', emirate:'sharjah', area_ar:'المنطقة الصناعية ٣', area_en:'Industrial Area 3', rating:4.3, reviews:134, phone:'+971-6-555-8888', hours_ar:'٦ص - ٨م', hours_en:'6AM - 8PM', verified:true, lat:25.2900, lng:55.4500, tags_ar:['رافعات','حفارات','بوبكات'], tags_en:['cranes','excavators','bobcat'], completedProjects: 320 },
];

/* ═══════════════════ EMIRATES DATA ═══════════════════ */
const EMIRATES = [
  { id: 'all', ar: 'كل الإمارات', en: 'All Emirates', lat: 24.5, lng: 55.0, zoom: 8 },
  { id: 'dubai', ar: 'دبي', en: 'Dubai', lat: 25.2048, lng: 55.2708, zoom: 11 },
  { id: 'abu_dhabi', ar: 'أبوظبي', en: 'Abu Dhabi', lat: 24.4539, lng: 54.3773, zoom: 11 },
  { id: 'sharjah', ar: 'الشارقة', en: 'Sharjah', lat: 25.3463, lng: 55.4209, zoom: 12 },
  { id: 'ajman', ar: 'عجمان', en: 'Ajman', lat: 25.4052, lng: 55.5136, zoom: 13 },
  { id: 'ras_al_khaimah', ar: 'رأس الخيمة', en: 'RAK', lat: 25.7895, lng: 55.9432, zoom: 12 },
  { id: 'umm_al_quwain', ar: 'أم القيوين', en: 'UAQ', lat: 25.5647, lng: 55.5554, zoom: 13 },
  { id: 'fujairah', ar: 'الفجيرة', en: 'Fujairah', lat: 25.1288, lng: 56.3264, zoom: 12 },
];

/* ═══════════════════ MAP DEFAULTS ═══════════════════ */
const UAE_CENTER = { lat: 24.5, lng: 55.0 }; // UAE overview
const DEFAULT_ZOOM = 8;

/* ═══════════════════ ADVANCED MARKER WRAPPER ═══════════════════ */
/** Imperative wrapper around google.maps.marker.AdvancedMarkerElement */
function AdvancedMarker({
  map,
  position,
  onClick,
  color,
  size,
  strokeColor,
  strokeWidth,
  variant,
  zIndex,
}: {
  map: any;
  position: { lat: number; lng: number };
  onClick?: () => void;
  color?: string;
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
  variant?: 'circle' | 'badge' | 'user';
  zIndex?: number;
}) {
  const markerRef = useRef<any>(null);
  const listenerRef = useRef<any>(null);

  useEffect(() => {
    const g = (window as any).google;
    if (!map || !g?.maps?.marker?.AdvancedMarkerElement) return;

    // Build content element based on variant
    let el: HTMLElement;
    const v = variant || 'circle';
    if (v === 'badge') {
      el = document.createElement('div');
      el.style.cssText = 'width:12px;height:12px;border-radius:50%;background:#3B5BFE;border:2px solid #FFF;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.2)';
    } else if (v === 'user') {
      el = document.createElement('div');
      el.style.cssText = 'position:relative;width:20px;height:20px';
      const pulse = document.createElement('div');
      pulse.style.cssText = 'position:absolute;inset:-6px;border-radius:50%;background:rgba(59,91,254,0.2);animation:bait-pulse 2s ease-in-out infinite';
      el.appendChild(pulse);
      const dot = document.createElement('div');
      dot.style.cssText = 'width:20px;height:20px;border-radius:50%;background:#3B5BFE;border:3px solid #FFF;box-shadow:0 2px 8px rgba(59,91,254,0.4);position:relative';
      el.appendChild(dot);
    } else {
      const s = size || 10;
      const c = color || '#D4AF37';
      const sc = strokeColor || '#FFF';
      const sw = strokeWidth || 2.5;
      el = document.createElement('div');
      el.style.cssText = `width:${s * 2}px;height:${s * 2}px;border-radius:50%;background:${c};border:${sw}px solid ${sc};cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.25);transition:transform 0.15s ease`;
    }

    const marker = new g.maps.marker.AdvancedMarkerElement({
      map,
      position,
      content: el,
      zIndex: zIndex ?? 0,
    });

    markerRef.current = marker;

    if (onClick) {
      listenerRef.current = marker.addListener('click', onClick);
    }

    return () => {
      listenerRef.current?.remove();
      marker.map = null;
      markerRef.current = null;
    };
  }, [map, position.lat, position.lng, color, size, strokeColor, strokeWidth, variant, zIndex]);

  // Update click handler without recreating the marker
  useEffect(() => {
    if (!markerRef.current) return;
    listenerRef.current?.remove();
    if (onClick) {
      listenerRef.current = markerRef.current.addListener('click', onClick);
    }
  }, [onClick]);

  return null;
}

/* ═══════════════════ COMPONENT ═══════════════════ */
export function StoresMap({ isEn = false }: { isEn?: boolean }) {
  const { isLoaded, mapId, error: mapsError, retry: retryMaps } = useGoogleMaps();
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  // State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEmirate, setSelectedEmirate] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showList, setShowList] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState<Set<string>>(new Set());
  const [mapCenter, setMapCenter] = useState(UAE_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [isLocating, setIsLocating] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  /* ── Initialize raw Google Map ── */
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || mapRef.current) return;
    const g = (window as any).google;
    if (!g?.maps?.Map) return;
    const map = new g.maps.Map(mapContainerRef.current, {
      center: UAE_CENTER,
      zoom: DEFAULT_ZOOM,
      mapId,
      disableDefaultUI: true,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      gestureHandling: 'greedy',
      clickableIcons: false,
    });
    mapRef.current = map;
    setMapInstance(map);
    map.addListener('click', () => {
      setSelectedStore(null);
      setShowInfoWindow(null);
    });
  }, [isLoaded, mapId]);

  /* ── Handle Emirate Selection ── */
  const handleEmirateSelect = useCallback((emirateId: string) => {
    setSelectedEmirate(emirateId);
    const em = EMIRATES.find(e => e.id === emirateId);
    if (em && mapRef.current) {
      mapRef.current.panTo({ lat: em.lat, lng: em.lng });
      mapRef.current.setZoom(em.zoom);
      setMapCenter({ lat: em.lat, lng: em.lng });
      setMapZoom(em.zoom);
    }
  }, []);

  /* ── Filtered stores ── */
  const filteredStores = useMemo(() => {
    return STORES.filter(s => {
      if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
      if (selectedEmirate !== 'all' && s.emirate !== selectedEmirate) return false;
      if (verifiedOnly && !s.verified) return false;
      if (minRating > 0 && s.rating < minRating) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const name = isEn ? s.name_en.toLowerCase() : s.name_ar;
        const area = isEn ? s.area_en.toLowerCase() : s.area_ar;
        const tags = isEn ? s.tags_en.join(' ').toLowerCase() : s.tags_ar.join(' ');
        if (!name.includes(q) && !area.includes(q) && !tags.includes(q)) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedEmirate, searchQuery, isEn, verifiedOnly, minRating]);

  /* ── Get category info ── */
  const getCategoryInfo = useCallback((categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  }, []);

  /* ── Map handlers ── */

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setMapCenter(loc);
        setMapZoom(14);
        if (mapRef.current) {
          mapRef.current.panTo(loc);
          mapRef.current.setZoom(14);
        }
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleMarkerClick = useCallback((store: StoreItem) => {
    setSelectedStore(store);
    setShowInfoWindow(store.id);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: store.lat, lng: store.lng });
      mapRef.current.setZoom(15);
    }
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    setSelectedStore(null);
    setShowInfoWindow(null);
  }, []);

  const toggleFavorite = useCallback((storeId: string) => {
    setIsFavorite(prev => {
      const next = new Set(prev);
      if (next.has(storeId)) next.delete(storeId);
      else next.add(storeId);
      return next;
    });
  }, []);

  /* ── Stats ── */
  const verifiedCount = useMemo(() => STORES.filter(s => s.verified).length, []);

  /* ═══════════════════ RENDER — MAP NOT LOADED ═══════════════════ */
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F5EEE1] flex flex-col" dir={isEn ? 'ltr' : 'rtl'}>
        {/* Header */}
        <div className="bg-gradient-to-l from-[#2C1810] to-[#D4AF37] px-4 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <Icon3D icon={MapPin} theme="red" size="md" hoverable={false} />
            <div>
              <h1 className="text-xl font-extrabold text-white" style={{ fontFamily: f }}>
                {isEn ? 'Providers & Stores Map' : 'خريطة المزودين والمتاجر'}
              </h1>
              <p className="text-[11px] text-white/50" style={{ fontFamily: f }}>
                {isEn ? 'Interactive map of all UAE providers' : 'خريطة تفاعلية لكل مزودي الإمارات'}
              </p>
            </div>
          </div>
        </div>
        {/* Loading state — spinner نظيف بدون DecorativeMap */}
        <div className="flex-1 p-4 overflow-auto">
          {!mapsError && (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <div className="w-10 h-10 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
              <span className="text-sm text-[#1F3D2B]/50 font-bold" style={{ fontFamily: f }}>
                {isEn ? 'Loading Google Maps...' : 'جاري تحميل خرائط جوجل...'}
              </span>
            </div>
          )}

          {/* Error info */}
          {mapsError && (
            <div className="mt-4 bg-white/80 rounded-2xl p-5 border border-[#D4AF37]/20 shadow-sm" dir="rtl">
              <p className="text-sm font-bold text-[#1F3D2B]/60 mb-3" style={{ fontFamily: f }}>
                {isEn ? 'To enable real Google Maps:' : 'لتفعيل خرائط Google الحقيقية:'}
              </p>
              {mapsError.includes('RefererNotAllowed') || mapsError.includes('صلاحيات') ? (
                <div className="bg-amber-50 border border-[#D4AF37]/30 rounded-xl p-4 text-xs text-[#2C1810]/80 space-y-2" style={{ fontFamily: f }}>
                  <p className="font-bold text-[#B8940E]">{isEn ? 'Steps to fix:' : 'خطوات الحل:'}</p>
                  <ol className="list-decimal mr-4 space-y-1.5">
                    <li>{isEn ? 'Open' : 'افتح'} <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-[#3B5BFE] underline font-bold">Google Cloud Console → Credentials</a></li>
                    <li>{isEn ? 'Add this URL under HTTP referrers:' : 'أضف هذا الرابط تحت HTTP referrers:'}</li>
                  </ol>
                  <div className="bg-white/60 rounded-lg p-2 border border-gray-200 font-mono text-[11px] break-all select-all cursor-text" dir="ltr">
                    {window.location.origin}/*
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#2C1810]/60" style={{ fontFamily: f }}>{mapsError}</p>
              )}
              <button
                onClick={retryMaps}
                className="mt-3 px-5 py-2 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-[#2C1810] rounded-xl font-bold text-sm border-[3px] border-[#D4AF37]/40 hover:scale-105 active:scale-95 transition-transform"
                style={{ fontFamily: f }}
              >
                {isEn ? 'Retry Google Maps' : 'إعادة تحميل خرائط جوجل'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ═══════════════════ RENDER — MAIN ═══════════════════ */
  return (
    <div className="relative h-[calc(100vh-100px)] w-full overflow-hidden" dir={isEn ? 'ltr' : 'rtl'}>
      {/* ═══ GOOGLE MAP — raw div ═══ */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Markers — rendered imperatively via AdvancedMarker */}
      {mapInstance && filteredStores.map(store => {
        const cat = getCategoryInfo(store.category);
        const isActive = selectedStore?.id === store.id;
        return (
          <AdvancedMarker
            key={store.id}
            map={mapInstance}
            position={{ lat: store.lat, lng: store.lng }}
            onClick={() => handleMarkerClick(store)}
            variant="circle"
            color={cat.color}
            size={isActive ? 14 : 10}
            strokeColor="#FFFFFF"
            strokeWidth={isActive ? 4 : 2.5}
            zIndex={isActive ? 100 : 50}
          />
        );
      })}
      {mapInstance && filteredStores.filter(s => s.verified).map(store => (
        <AdvancedMarker
          key={`v-${store.id}`}
          map={mapInstance}
          position={{ lat: store.lat + 0.0012, lng: store.lng + 0.0012 }}
          onClick={() => handleMarkerClick(store)}
          variant="badge"
          zIndex={101}
        />
      ))}
      {mapInstance && userLocation && (
        <AdvancedMarker
          map={mapInstance}
          position={userLocation}
          variant="user"
          zIndex={102}
        />
      )}

      {/* Custom InfoWindow overlay */}
      {showInfoWindow && selectedStore && (
        <div
          className="absolute z-30 left-1/2 top-1/3 -translate-x-1/2 -translate-y-full"
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl border border-gray-200 px-3 py-2.5 text-center min-w-[160px] relative"
            dir={isEn ? 'ltr' : 'rtl'}
            style={{ fontFamily: f, pointerEvents: 'auto' }}
          >
            <button
              onClick={() => setShowInfoWindow(null)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
            <p className="font-bold text-sm text-[#2C1810] mb-0.5">
              {isEn ? selectedStore.name_en : selectedStore.name_ar}
            </p>
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-xs font-bold">{selectedStore.rating}</span>
              <span className="text-[10px] text-gray-400">({selectedStore.reviews})</span>
            </div>
            <p className="text-[10px] text-gray-500">
              {isEn ? selectedStore.area_en : selectedStore.area_ar}
            </p>
          </div>
        </div>
      )}

      {/* ═══ TOP OVERLAY — Search + Categories ═══ */}
      <div className="absolute top-0 inset-x-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Search Bar */}
          <div className="px-3 pt-3">
            <div className="relative">
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-lg border-[3px] border-gray-200/60">
                <Search className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <input
                  type="text"
                  placeholder={isEn ? 'Search providers, stores, materials...' : 'ابحث عن مزود، محل، مادة...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  className="flex-1 bg-transparent outline-none text-[#2C1810] placeholder:text-gray-400 text-sm"
                  style={{ fontFamily: f }}
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setShowSearch(false); }}>
                    <X className="w-4 h-4 text-gray-400 hover:text-[#2C1810] transition-colors" />
                  </button>
                )}
                <div className="w-px h-5 bg-gray-200" />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-1.5 rounded-xl transition-all ${showFilters ? 'bg-[#D4AF37] text-white' : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'}`}
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Chips */}
          <div className="px-3 pt-2 pb-1">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map(cat => {
                const CatIcon = cat.Icon;
                const active = selectedCategory === cat.id;
                const baseByEmirate = selectedEmirate === 'all' ? STORES : STORES.filter(s => s.emirate === selectedEmirate);
                const count = cat.id === 'all'
                  ? baseByEmirate.length
                  : baseByEmirate.filter(s => s.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap shrink-0 transition-all border-[3px] ${
                      active
                        ? 'bg-white text-[#2C1810] shadow-lg border-[#D4AF37]/60'
                        : 'bg-white/80 backdrop-blur-sm text-[#2C1810]/70 border-gray-200/60 hover:bg-white hover:border-[#D4AF37]/30'
                    }`}
                    style={{ fontFamily: f }}
                  >
                    <CatIcon className="w-3.5 h-3.5" style={{ color: active ? cat.color : '#999' }} />
                    {isEn ? cat.en : cat.ar}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${active ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'bg-gray-100 text-gray-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emirates Chips */}
          <div className="px-3 pt-1 pb-1">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {EMIRATES.map(em => {
                const active = selectedEmirate === em.id;
                // Count based on current category filter
                const baseStores = selectedCategory === 'all' ? STORES : STORES.filter(s => s.category === selectedCategory);
                const count = em.id === 'all'
                  ? baseStores.length
                  : baseStores.filter(s => s.emirate === em.id).length;
                return (
                  <button
                    key={em.id}
                    onClick={() => handleEmirateSelect(em.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap shrink-0 transition-all border-[2px] ${
                      active
                        ? 'bg-[#3B5BFE] text-white shadow-md border-[#3B5BFE]'
                        : 'bg-white/80 backdrop-blur-sm text-[#2C1810]/60 border-gray-200/60 hover:bg-white hover:border-[#3B5BFE]/30'
                    }`}
                    style={{ fontFamily: f }}
                  >
                    <MapPin className="w-3 h-3" style={{ color: active ? '#FFF' : '#3B5BFE' }} />
                    {isEn ? em.en : em.ar}
                    {count > 0 && (
                      <span className={`text-[8px] px-1 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-[#3B5BFE]/10 text-[#3B5BFE]'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mx-3 overflow-hidden"
              >
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-lg border-[3px] border-gray-200/60 space-y-4">
                  {/* Emirates Filter */}
                  <div>
                    <label className="block text-xs font-bold text-[#2C1810] mb-2" style={{ fontFamily: f }}>
                      {isEn ? 'Emirate' : 'الإمارة'}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {EMIRATES.map(em => {
                        const active = selectedEmirate === em.id;
                        return (
                          <button
                            key={em.id}
                            onClick={() => handleEmirateSelect(em.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border-[2px] ${
                              active
                                ? 'bg-[#3B5BFE] text-white border-[#3B5BFE]'
                                : 'bg-[#F5EEE1] text-[#2C1810] border-gray-200/60'
                            }`}
                            style={{ fontFamily: f }}
                          >
                            {isEn ? em.en : em.ar}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-bold text-[#2C1810] mb-2" style={{ fontFamily: f }}>
                      {isEn ? 'Min Rating' : 'التقييم الأدنى'}
                    </label>
                    <div className="flex gap-2">
                      {[0, 3, 4, 4.5].map(r => (
                        <button
                          key={r}
                          onClick={() => setMinRating(r)}
                          className={`flex-1 px-2 py-2 rounded-xl text-xs font-bold transition-all border-[3px] ${
                            minRating === r
                              ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                              : 'bg-[#F5EEE1] text-[#2C1810] border-gray-200/60'
                          }`}
                          style={{ fontFamily: f }}
                        >
                          {r === 0 ? (isEn ? 'All' : 'الكل') : (
                            <span className="flex items-center justify-center gap-0.5">
                              {r}+ <Star className="w-3 h-3 fill-current" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Verified Only */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#3B5BFE]" />
                      <span className="text-xs font-bold text-[#2C1810]" style={{ fontFamily: f }}>
                        {isEn ? 'Verified only' : 'مزودون موثّقون فقط'}
                      </span>
                    </div>
                    <button
                      onClick={() => setVerifiedOnly(!verifiedOnly)}
                      className={`w-11 h-6 rounded-full transition-all relative border-[2px] ${
                        verifiedOnly ? 'bg-[#3B5BFE] border-[#3B5BFE]' : 'bg-gray-200 border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
                        verifiedOnly ? (isEn ? 'left-[22px]' : 'right-[22px]') : (isEn ? 'left-0.5' : 'right-0.5')
                      }`} />
                    </button>
                  </div>

                  {/* Apply + Reset */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        handleEmirateSelect('all');
                        setMinRating(0);
                        setVerifiedOnly(false);
                        setSearchQuery('');
                      }}
                      className="flex-1 py-2.5 bg-[#F5EEE1] text-[#2C1810] rounded-xl text-xs font-bold border-[3px] border-gray-200/60 hover:bg-gray-100 transition-colors"
                      style={{ fontFamily: f }}
                    >
                      {isEn ? 'Reset' : 'إعادة ضبط'}
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="flex-[2] py-2.5 bg-gradient-to-l from-[#D4AF37] to-[#2C1810] text-white rounded-xl text-xs font-bold border-[3px] border-[#D4AF37]/30"
                      style={{ fontFamily: f }}
                    >
                      {isEn ? `Apply — ${filteredStores.length} results` : `تطبيق — ${filteredStores.length} نتيجة`}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ═══ RIGHT SIDE CONTROLS ═══ */}
      <div className={`absolute ${isEn ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2`}>
        {/* Locate Me */}
        <button
          onClick={handleLocateMe}
          className="w-11 h-11 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg flex items-center justify-center border-[3px] border-gray-200/60 hover:border-[#3B5BFE]/50 transition-all group"
          title={isEn ? 'My Location' : 'موقعي'}
        >
          {isLocating ? (
            <div className="w-5 h-5 border-2 border-[#3B5BFE]/30 border-t-[#3B5BFE] rounded-full animate-spin" />
          ) : (
            <Locate className="w-5 h-5 text-[#3B5BFE] group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Zoom In */}
        <button
          onClick={() => mapRef.current?.setZoom((mapRef.current.getZoom() || DEFAULT_ZOOM) + 1)}
          className="w-11 h-11 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg flex items-center justify-center border-[3px] border-gray-200/60 text-[#2C1810] font-bold text-lg hover:border-[#D4AF37]/50 transition-all"
        >
          +
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => mapRef.current?.setZoom((mapRef.current.getZoom() || DEFAULT_ZOOM) - 1)}
          className="w-11 h-11 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg flex items-center justify-center border-[3px] border-gray-200/60 text-[#2C1810] font-bold text-lg hover:border-[#D4AF37]/50 transition-all"
        >
          −
        </button>

        {/* Toggle List */}
        <button
          onClick={() => setShowList(!showList)}
          className={`w-11 h-11 backdrop-blur-xl rounded-xl shadow-lg flex items-center justify-center border-[3px] transition-all ${
            showList ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'bg-white/95 text-[#2C1810] border-gray-200/60 hover:border-[#D4AF37]/50'
          }`}
          title={isEn ? 'List View' : 'عرض القائمة'}
        >
          <Layers className="w-5 h-5" />
        </button>
      </div>

      {/* ═══ BOTTOM STATS BAR ═══ */}
      <div className={`absolute bottom-0 inset-x-0 z-10 transition-transform duration-300 ${selectedStore ? 'translate-y-full' : 'translate-y-0'}`}>
        <div className="mx-3 mb-3">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-lg border-[3px] border-gray-200/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon3D icon={MapPin} theme="red" size="xs" hoverable={false} />
              <div>
                <span className="text-sm font-bold text-[#2C1810]" style={{ fontFamily: f }}>
                  {filteredStores.length}
                </span>
                <span className="text-xs text-[#2C1810]/50 ms-1" style={{ fontFamily: f }}>
                  {isEn ? 'providers on map' : 'مزود على الخريطة'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {selectedEmirate !== 'all' && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#3B5BFE]" />
                  <span className="text-[10px] font-bold text-[#3B5BFE]" style={{ fontFamily: f }}>
                    {isEn ? EMIRATES.find(e => e.id === selectedEmirate)?.en : EMIRATES.find(e => e.id === selectedEmirate)?.ar}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#3B5BFE]" />
                <span className="text-[10px] font-bold text-[#2C1810]/40" style={{ fontFamily: f }}>
                  {filteredStores.filter(s => s.verified).length} {isEn ? 'verified' : 'موثق'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <span className="text-[10px] font-bold text-[#2C1810]/40" style={{ fontFamily: f }}>
                  {new Set(filteredStores.map(s => s.emirate)).size} {isEn ? 'emirates' : 'إمارات'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM SHEET — Selected Provider ═══ */}
      <AnimatePresence>
        {selectedStore && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute bottom-0 inset-x-0 z-20"
          >
            <div className="bg-white/98 backdrop-blur-xl rounded-t-3xl shadow-2xl border-t-[4px] border-[#D4AF37]/40 max-h-[55vh] overflow-y-auto">
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              <div className="px-5 pb-5">
                {/* Close Button */}
                <div className="flex justify-end mb-1">
                  <button onClick={handleCloseBottomSheet} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Provider Header */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-[4px] border-gray-200/60 flex-shrink-0 shadow-md">
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${getCategoryInfo(selectedStore.category).color}40, ${getCategoryInfo(selectedStore.category).color}15)` }}>
                      <Icon3D icon={getCategoryInfo(selectedStore.category).Icon} theme={getCategoryInfo(selectedStore.category).theme} size="sm" hoverable={false} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-[#2C1810] truncate" style={{ fontFamily: f }}>
                        {isEn ? selectedStore.name_en : selectedStore.name_ar}
                      </h3>
                      {selectedStore.verified && (
                        <span className="flex items-center gap-0.5 px-2 py-0.5 bg-[#3B5BFE]/10 rounded-full shrink-0">
                          <CheckCircle className="w-3 h-3 text-[#3B5BFE]" />
                          <span className="text-[9px] font-bold text-[#3B5BFE]">
                            {isEn ? 'Verified' : 'موثق'}
                          </span>
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-[#2C1810]/40 mb-1.5" style={{ fontFamily: f }}>
                      {isEn ? selectedStore.area_en : selectedStore.area_ar}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                        <span className="text-sm font-bold text-[#2C1810]">{selectedStore.rating}</span>
                        <span className="text-[10px] text-[#2C1810]/30">({selectedStore.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#2C1810]/40">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px]" style={{ fontFamily: f }}>
                          {isEn ? selectedStore.hours_en : selectedStore.hours_ar}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Favorite */}
                  <button
                    onClick={() => toggleFavorite(selectedStore.id)}
                    className="p-2 hover:bg-[#F5EEE1] rounded-full transition-colors shrink-0"
                  >
                    <Heart className={`w-5 h-5 transition-colors ${isFavorite.has(selectedStore.id) ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
                  </button>
                </div>

                {/* Stats Row */}
                {(selectedStore.completedProjects || selectedStore.responseTime_ar) && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {selectedStore.completedProjects && (
                      <div className="bg-[#F5EEE1] rounded-xl p-2.5 text-center border-[3px] border-gray-200/60">
                        <Award className="w-4 h-4 text-[#D4AF37] mx-auto mb-0.5" />
                        <div className="text-sm font-bold text-[#2C1810]" style={{ fontFamily: f }}>
                          {selectedStore.completedProjects}
                        </div>
                        <div className="text-[9px] text-[#2C1810]/40" style={{ fontFamily: f }}>
                          {isEn ? 'Projects' : 'مشروع'}
                        </div>
                      </div>
                    )}
                    {selectedStore.responseTime_ar && (
                      <div className="bg-[#F5EEE1] rounded-xl p-2.5 text-center border-[3px] border-gray-200/60">
                        <Clock className="w-4 h-4 text-[#3B5BFE] mx-auto mb-0.5" />
                        <div className="text-[11px] font-bold text-[#2C1810]" style={{ fontFamily: f }}>
                          {isEn ? selectedStore.responseTime_en : selectedStore.responseTime_ar}
                        </div>
                        <div className="text-[9px] text-[#2C1810]/40" style={{ fontFamily: f }}>
                          {isEn ? 'Response' : 'استجابة'}
                        </div>
                      </div>
                    )}
                    <div className="bg-[#F5EEE1] rounded-xl p-2.5 text-center border-[3px] border-gray-200/60">
                      <Star className="w-4 h-4 text-[#D4AF37] mx-auto mb-0.5" />
                      <div className="text-sm font-bold text-[#2C1810]" style={{ fontFamily: f }}>
                        {selectedStore.rating}
                      </div>
                      <div className="text-[9px] text-[#2C1810]/40" style={{ fontFamily: f }}>
                        {isEn ? 'Rating' : 'تقييم'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(isEn ? selectedStore.tags_en : selectedStore.tags_ar).map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 bg-[#F5EEE1] rounded-full text-[10px] font-bold text-[#2C1810]/60 border-[2px] border-gray-200/60">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-l from-[#D4AF37] to-[#2C1810] text-white rounded-xl font-bold border-[4px] border-gray-200/60 hover:shadow-lg transition-all"
                    style={{ fontFamily: f }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    {isEn ? 'Full Profile' : 'الملف الكامل'}
                  </button>

                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={`tel:${selectedStore.phone}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-[#3B5BFE] text-white rounded-xl text-xs font-bold border-[3px] border-[#3B5BFE]/30 hover:bg-[#2A4AED] transition-colors"
                      style={{ fontFamily: f }}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {isEn ? 'Call' : 'اتصال'}
                    </a>

                    <button
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-bold border-[3px] border-[#25D366]/30 hover:bg-[#20BA59] transition-colors"
                      style={{ fontFamily: f }}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      {isEn ? 'WhatsApp' : 'واتساب'}
                    </button>

                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedStore.lat},${selectedStore.lng}`;
                        window.open(url, '_blank');
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-[#F5EEE1] text-[#2C1810] rounded-xl text-xs font-bold border-[3px] border-gray-200/60 hover:bg-[#D4AF37] hover:text-white transition-colors"
                      style={{ fontFamily: f }}
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      {isEn ? 'Navigate' : 'اتجاهات'}
                    </button>

                    <button
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-[#3B5BFE]/10 text-[#3B5BFE] rounded-xl text-xs font-bold border-[3px] border-[#3B5BFE]/20 hover:bg-[#3B5BFE] hover:text-white transition-colors"
                      style={{ fontFamily: f }}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      {isEn ? 'Add Friend' : 'إضافة صديق'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SIDE LIST PANEL ═══ */}
      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ x: isEn ? 400 : -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isEn ? 400 : -400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className={`absolute top-0 ${isEn ? 'right-0' : 'left-0'} w-[340px] h-full z-15 overflow-hidden`}
          >
            <div className="h-full bg-white/95 backdrop-blur-xl border-e border-gray-200/60 flex flex-col">
              {/* List Header */}
              <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Icon3D icon={Store} theme="gold" size="xs" hoverable={false} />
                  <h2 className="text-sm font-bold text-[#2C1810]" style={{ fontFamily: f }}>
                    {isEn ? 'Providers' : 'المزودون'}
                    <span className="text-[#2C1810]/30 ms-1">({filteredStores.length})</span>
                  </h2>
                </div>
                <button onClick={() => setShowList(false)} className="p-1.5 hover:bg-gray-100 rounded-full">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* List Items */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredStores.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon3D icon={Search} theme="gold" size="lg" hoverable={false} className="mx-auto mb-3" />
                    <p className="text-sm font-bold text-[#2C1810]/40" style={{ fontFamily: f }}>
                      {isEn ? 'No providers found' : 'لا توجد نتائج'}
                    </p>
                    <p className="text-[11px] text-[#2C1810]/25 mt-1" style={{ fontFamily: f }}>
                      {isEn ? 'Try different filters' : 'جرب تغيير الفلاتر'}
                    </p>
                  </div>
                ) : (
                  filteredStores.map(store => {
                    const cat = getCategoryInfo(store.category);
                    const isActive = selectedStore?.id === store.id;
                    return (
                      <button
                        key={store.id}
                        onClick={() => handleMarkerClick(store)}
                        className={`w-full bg-white rounded-xl p-3 border-[3px] text-start transition-all ${
                          isActive
                            ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                            : 'border-gray-200/60 hover:shadow-md hover:border-[#D4AF37]/30'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${cat.color}12` }}>
                            <cat.Icon className="w-4.5 h-4.5" style={{ color: cat.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <h3 className="text-xs font-bold text-[#2C1810] truncate" style={{ fontFamily: f }}>
                                {isEn ? store.name_en : store.name_ar}
                              </h3>
                              {store.verified && (
                                <CheckCircle className="w-3.5 h-3.5 text-[#3B5BFE] shrink-0" />
                              )}
                            </div>
                            <p className="text-[10px] text-[#2C1810]/35 mb-1" style={{ fontFamily: f }}>
                              {isEn ? store.area_en : store.area_ar}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                                <span className="text-[10px] font-bold text-[#2C1810]">{store.rating}</span>
                              </div>
                              <span className="text-[9px] text-[#2C1810]/25">({store.reviews})</span>
                              <div className="flex items-center gap-0.5 text-[#2C1810]/25">
                                <Clock className="w-2.5 h-2.5" />
                                <span className="text-[9px]">{isEn ? store.hours_en : store.hours_ar}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Bottom CTA */}
              <div className="px-3 py-3 border-t border-gray-100 shrink-0">
                <div className="bg-gradient-to-l from-[#2C1810] to-[#D4AF37] rounded-xl p-3 flex items-center gap-3">
                  <Icon3D icon={Sparkles} theme="gold" size="xs" hoverable={false} />
                  <div className="flex-1">
                    <p className="text-white text-[11px] font-bold" style={{ fontFamily: f }}>
                      {isEn ? 'List your business' : 'أضف نشاطك التجاري'}
                    </p>
                    <p className="text-white/40 text-[9px]" style={{ fontFamily: f }}>
                      {isEn ? 'Get discovered by clients' : 'ليجدك العملاء بسهولة'}
                    </p>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-white/60 ${isEn ? '' : 'rotate-180'}`} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SEARCH OVERLAY ═══ */}
      <AnimatePresence>
        {showSearch && searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-[110px] inset-x-3 z-20"
          >
            <div className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border-[3px] border-gray-200/60 max-h-[300px] overflow-y-auto">
              {filteredStores.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-[#2C1810]/40" style={{ fontFamily: f }}>
                    {isEn ? 'No results for' : 'لا نتائج لـ'} "{searchQuery}"
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredStores.slice(0, 6).map(store => {
                    const cat = getCategoryInfo(store.category);
                    return (
                      <button
                        key={store.id}
                        onClick={() => {
                          handleMarkerClick(store);
                          setShowSearch(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-[#F5EEE1] rounded-xl transition-colors text-start"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${cat.color}15` }}>
                          <cat.Icon className="w-4 h-4" style={{ color: cat.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#2C1810] truncate" style={{ fontFamily: f }}>
                            {isEn ? store.name_en : store.name_ar}
                          </h4>
                          <p className="text-[10px] text-[#2C1810]/35" style={{ fontFamily: f }}>
                            {isEn ? store.area_en : store.area_ar}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                          <span className="text-[10px] font-bold">{store.rating}</span>
                        </div>
                      </button>
                    );
                  })}
                  {filteredStores.length > 6 && (
                    <div className="text-center py-2">
                      <span className="text-[10px] text-[#D4AF37] font-bold" style={{ fontFamily: f }}>
                        +{filteredStores.length - 6} {isEn ? 'more' : 'نتيجة أخرى'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside search to close */}
      {showSearch && (
        <div className="absolute inset-0 z-5" onClick={() => setShowSearch(false)} />
      )}
    </div>
  );
}