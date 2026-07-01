import { useState, useRef, useEffect } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { LocationPicker } from './LocationPicker';
import { DecorativeMap } from '../seo/DecorativeMap';
import { 
  MapPin, 
  Navigation,
  Save,
  CheckCircle,
  Shield,
  Upload,
  Image as ImageIcon,
  Video,
  ToggleLeft,
  ToggleRight,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// ====================================
// 📌 Types & Interfaces
// ====================================

type UserType = 'guest' | 'verified' | 'provider';

interface ProfileLocationSetupProps {
  userType: UserType;
  onVerificationClick?: () => void;
  onSaveHomeLocation?: (location: { lat: number; lng: number; address: string }) => void;
  onSaveBusinessLocation?: (data: BusinessLocationData) => void;
}

interface BusinessLocationData {
  location: { lat: number; lng: number; address: string };
  mainCategory: string;
  subcategories: string[];
  serviceRadius: string;
  panorama360?: File;
  gallery: File[];
  video?: File;
  showOnMap: boolean;
}

import { useGoogleMaps } from '../providers/GoogleMapsLoader';

// ====================================
// 🎨 Profile Location Setup Component
// ====================================

export function ProfileLocationSetup({
  userType,
  onVerificationClick,
  onSaveHomeLocation,
  onSaveBusinessLocation,
}: ProfileLocationSetupProps) {
  
  const [locationSaved, setLocationSaved] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('');
  
  // Provider-specific states
  const [mainCategory, setMainCategory] = useState('');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [serviceRadius, setServiceRadius] = useState('all-uae');
  const [showOnMap, setShowOnMap] = useState(true);
  const [panorama360, setPanorama360] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [verifiedMap, setVerifiedMap] = useState<google.maps.Map | null>(null);
  const [providerMap, setProviderMap] = useState<google.maps.Map | null>(null);
  const verifiedMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const providerMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  
  const { isLoaded, mapId } = useGoogleMaps();

  // AdvancedMarkerElement for verified user map preview
  useEffect(() => {
    if (!verifiedMap || !selectedLocation || !google.maps.marker?.AdvancedMarkerElement) return;
    if (verifiedMarkerRef.current) verifiedMarkerRef.current.map = null;
    const el = document.createElement('div');
    el.style.cssText = 'width:24px;height:24px;border-radius:50%;background:#D4AF37;border:3px solid #FFF;box-shadow:0 2px 8px rgba(0,0,0,0.3);';
    verifiedMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({ map: verifiedMap, position: selectedLocation, content: el });
    return () => { if (verifiedMarkerRef.current) { verifiedMarkerRef.current.map = null; verifiedMarkerRef.current = null; } };
  }, [verifiedMap, selectedLocation]);

  // AdvancedMarkerElement for provider map preview
  useEffect(() => {
    if (!providerMap || !selectedLocation || !google.maps.marker?.AdvancedMarkerElement) return;
    if (providerMarkerRef.current) providerMarkerRef.current.map = null;
    const el = document.createElement('div');
    el.style.cssText = 'width:24px;height:24px;border-radius:50%;background:#D4AF37;border:3px solid #FFF;box-shadow:0 2px 8px rgba(0,0,0,0.3);';
    providerMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({ map: providerMap, position: selectedLocation, content: el });
    return () => { if (providerMarkerRef.current) { providerMarkerRef.current.map = null; providerMarkerRef.current = null; } };
  }, [providerMap, selectedLocation]);

  // Categories
  const mainCategories = [
    'مقاولات البناء',
    'الاستشارات الهندسية',
    'شركات الصيانة',
    'العمالة الحرفية',
    'الورش',
    'تأجير المعدات',
    'محلات مواد البناء',
    'محلات الأثاث والديكور',
    'خدمات النظافة',
  ];

  const subcategoryOptions = {
    'مقاولات البناء': ['مقاولات عامة', 'بناء فلل', 'بناء عمائر', 'توسعات'],
    'الاستشارات الهندسية': ['هندسة معمارية', 'هندسة إنشائية', 'تصميم داخلي'],
    'شركات الصيانة': ['صيانة عامة', 'سباكة', 'كهرباء', 'تكييف'],
    'العمالة الحرفية': ['نجارة', 'حدادة', 'دهان', 'سيراميك'],
    'الورش': ['ورش ألمنيوم', 'ورش حدادة', 'ورش نجارة'],
    'تأجير المعدات': ['رافعات', 'حفارات', 'سقالات', 'مضخات'],
    'محلات مواد البناء': ['إسمنت وطوب', 'حديد وخشب', 'أدوات صحية'],
    'محلات الأثاث والديكور': ['أثاث منزلي', 'مكتبي', 'ديكورات'],
    'خدمات النظافة': ['تنظيف منازل', 'تنظيف مكاتب', 'تنظيف عميق'],
  };

  // ====================================
  // 🎯 Handlers
  // ====================================
  
  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setSelectedLocation({ lat, lng });
        
        // Simple reverse geocode if possible or just coords
        // ideally we use the geocoder here too, but for now we just set coords
        setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }, (_error) => {
        // Geolocation denied or unavailable — fallback to Dubai
        setSelectedLocation({ lat: 25.2048, lng: 55.2708 });
        setAddress('دبي، الإمارات العربية المتحدة');
      });
    } else {
      // Mock implementation fallback
      setSelectedLocation({ lat: 25.2048, lng: 55.2708 }); // Dubai coordinates
      setAddress('دبي، الإمارات العربية المتحدة');
    }
  };

  const handleLocationSelect = (loc: { lat: number; lng: number; address: string }) => {
    setSelectedLocation({ lat: loc.lat, lng: loc.lng });
    setAddress(loc.address);
  };

  const handleSaveHomeLocation = () => {
    if (selectedLocation && onSaveHomeLocation) {
      onSaveHomeLocation({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address: address,
      });
      setLocationSaved(true);
    }
  };

  const handleSaveBusinessLocation = () => {
    if (selectedLocation && onSaveBusinessLocation) {
      onSaveBusinessLocation({
        location: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          address: address,
        },
        mainCategory,
        subcategories,
        serviceRadius,
        panorama360: panorama360 || undefined,
        gallery: galleryImages,
        video: video || undefined,
        showOnMap,
      });
      setLocationSaved(true);
    }
  };

  // ====================================
  // 🎨 Render Guest View — now shows map for ALL users
  // ====================================
  
  if (userType === 'guest') {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm" dir="rtl">
        <h2 className="text-xl font-bold text-[#2C1810] mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
          حدد موقعك
        </h2>
        <p className="text-gray-600 mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
          حدد موقعك على الخريطة لعرض المزودين والمتاجر القريبة منك.
        </p>

        {!locationSaved ? (
          <div className="space-y-4">
            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleUseCurrentLocation}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-white rounded-xl font-medium hover:shadow-lg transition-all border-[3px] border-[#D4AF37]/30"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                <Navigation className="w-5 h-5" />
                <span>موقعي الحالي</span>
              </button>
              
              <button
                onClick={() => setIsMapOpen(true)}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#F5EEE1] text-[#2C1810] rounded-xl font-medium hover:bg-[#C8A86A] hover:text-white transition-all border-[3px] border-gray-200/60"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                <MapPin className="w-5 h-5" />
                <span>من الخريطة</span>
              </button>
            </div>

            {/* Map Preview */}
            {selectedLocation && (
              <div className="space-y-3">
                <div className="relative h-48 bg-gradient-to-br from-[#F5EEE1] to-[#E5DED1] rounded-xl overflow-hidden border-[3px] border-[#D4AF37]">
                  {isLoaded && selectedLocation ? (
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={selectedLocation}
                      zoom={15}
                      options={{ disableDefaultUI: true, draggable: false, gestureHandling: 'none', mapId }}
                      onLoad={(map) => setVerifiedMap(map)}
                    />
                  ) : (
                    <DecorativeMap
                      cityName="الإمارات"
                      compact={true}
                      hideHeader={true}
                      hideStrip={true}
                    />
                  )}
                </div>

                <div className="bg-[#F5EEE1] rounded-xl p-3">
                  <div className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>العنوان المحدد:</div>
                  <div className="font-semibold text-[#2C1810]" style={{ fontFamily: 'Cairo, sans-serif' }}>{address}</div>
                </div>

                <button
                  onClick={handleSaveHomeLocation}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-l from-[#D4AF37] to-[#2C1810] text-white rounded-xl font-semibold hover:shadow-lg transition-all border-[3px] border-[#D4AF37]/30"
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  <Save className="w-5 h-5" />
                  <span>حفظ موقعي</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#D4AF37]" />
            </div>
            
            <h3 className="text-lg font-bold text-[#2C1810] mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
              تم حفظ موقعك بنجاح
            </h3>
            
            <div className="bg-[#F5EEE1] rounded-xl p-4 mb-4">
              <div className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>العنوان المختصر:</div>
              <div className="font-semibold text-[#2C1810]" style={{ fontFamily: 'Cairo, sans-serif' }}>{address}</div>
            </div>
            
            <button
              onClick={() => setLocationSaved(false)}
              className="px-6 py-2 bg-[#F5EEE1] text-[#2C1810] rounded-xl font-medium hover:bg-[#D4AF37] hover:text-white transition-all border-[3px] border-gray-200/60"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              تعديل الموقع
            </button>
          </div>
        )}
        <LocationPicker 
          isOpen={isMapOpen} 
          onClose={() => setIsMapOpen(false)} 
          onSelectLocation={handleLocationSelect}
        />

        {/* Verification hint */}
        <div className="mt-4 bg-[#D4AF37]/10 rounded-xl p-3 flex items-center gap-3 border-[2px] border-[#D4AF37]/20">
          <Shield className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
          <p className="text-xs text-[#2C1810]/70" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            وثّق حس��بك لفتح ميزات الخرائط المتقدمة مثل تحديد موقع العمل وإضافة معرض صور 360°
          </p>
        </div>
      </div>
    );
  }

  // ====================================
  // 🎨 Render Verified User View
  // ====================================
  
  if (userType === 'verified') {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm" dir="rtl">
        <h2 className="text-xl font-bold text-[#1F3D2B] mb-2">موقعي السكني</h2>
        <p className="text-gray-600 mb-6">
          حدد موقع منزلك لتسهيل طلب الخدمات القريبة منك.
        </p>

        {!locationSaved ? (
          <div className="space-y-4">
            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleUseCurrentLocation}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                <Navigation className="w-5 h-5" />
                <span>موقعي الحالي</span>
              </button>
              
              <button
                onClick={() => setIsMapOpen(true)}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#F5EEE1] text-[#1F3D2B] rounded-xl font-medium hover:bg-[#C8A86A] hover:text-white transition-all"
              >
                <MapPin className="w-5 h-5" />
                <span>من الخريطة</span>
              </button>
            </div>

            {/* Map Preview */}
            {selectedLocation && (
              <div className="space-y-3">
                <div className="relative h-48 bg-gradient-to-br from-[#F5EEE1] to-[#E5DED1] rounded-xl overflow-hidden border-2 border-[#D4AF37]">
                  {isLoaded && selectedLocation ? (
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={selectedLocation}
                      zoom={15}
                      options={{ disableDefaultUI: true, draggable: false, gestureHandling: 'none', mapId }}
                      onLoad={(map) => setVerifiedMap(map)}
                    />
                  ) : (
                    <DecorativeMap
                      cityName="الإمارات"
                      compact={true}
                      hideHeader={true}
                      hideStrip={true}
                    />
                  )}
                </div>

                <div className="bg-[#F5EEE1] rounded-xl p-3">
                  <div className="text-sm text-gray-600 mb-1">العنوان المحدد:</div>
                  <div className="font-semibold text-[#1F3D2B]">{address}</div>
                </div>

                <button
                  onClick={handleSaveHomeLocation}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-l from-[#D4AF37] to-[#1F3D2B] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Save className="w-5 h-5" />
                  <span>حفظ موقعي</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#D4AF37]" />
            </div>
            
            <h3 className="text-lg font-bold text-[#1F3D2B] mb-2">
              تم حفظ موقعك بنجاح
            </h3>
            
            <div className="bg-[#F5EEE1] rounded-xl p-4 mb-4">
              <div className="text-sm text-gray-600 mb-1">العنوان المختصر:</div>
              <div className="font-semibold text-[#1F3D2B]">{address}</div>
            </div>
            
            <button
              onClick={() => setLocationSaved(false)}
              className="px-6 py-2 bg-[#F5EEE1] text-[#1F3D2B] rounded-xl font-medium hover:bg-[#D4AF37] hover:text-white transition-all"
            >
              تعديل الموقع
            </button>
          </div>
        )}
        <LocationPicker 
          isOpen={isMapOpen} 
          onClose={() => setIsMapOpen(false)} 
          onSelect={handleLocationSelect}
          initialLocation={selectedLocation || undefined}
          isLoaded={isLoaded}
        />
      </div>
    );
  }

  // ====================================
  // 🎨 Render Provider View
  // ====================================
  
  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#1F3D2B] mb-2">موقع نشاطي التجاري</h2>
        <p className="text-gray-600 mb-6">
          حدد موقع نشاطك التجاري لعرضه للعملاء في الخرائط والمتجر
        </p>

        {/* 1. Main Location */}
        <div className="mb-6">
          <h3 className="font-semibold text-[#1F3D2B] mb-3">موقع النشاط الرئيسي</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={handleUseCurrentLocation}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <Navigation className="w-5 h-5" />
              <span>موقعي الحالي</span>
            </button>
            
            <button
              onClick={() => setIsMapOpen(true)}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#F5EEE1] text-[#1F3D2B] rounded-xl font-medium hover:bg-[#C8A86A] hover:text-white transition-all"
            >
              <MapPin className="w-5 h-5" />
              <span>من الخريطة</span>
            </button>
          </div>

          {selectedLocation && (
            <div className="space-y-3">
              <div className="relative h-48 bg-gradient-to-br from-[#F5EEE1] to-[#E5DED1] rounded-xl overflow-hidden border-2 border-[#D4AF37]">
                {isLoaded && selectedLocation ? (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={selectedLocation}
                    zoom={15}
                    options={{ disableDefaultUI: true, draggable: false, gestureHandling: 'none', mapId }}
                    onLoad={(map) => setProviderMap(map)}
                  />
                ) : (
                  <DecorativeMap
                    cityName="الإمارات"
                    compact={true}
                    hideHeader={true}
                    hideStrip={true}
                  />
                )}
              </div>

              <div className="bg-[#4A90E2]/10 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#1F3D2B]">
                  حدد موقع المحل / الورشة بدقة كما يظهر على الشارع.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 2. Business Info */}
        <div className="mb-6">
          <h3 className="font-semibold text-[#1F3D2B] mb-3">معلومات النشاط الأساسية</h3>
          
          {/* Main Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الفئة الرئيسية
            </label>
            <select
              value={mainCategory}
              onChange={(e) => {
                setMainCategory(e.target.value);
                setSubcategories([]);
              }}
              className="w-full px-4 py-3 bg-[#F5EEE1] text-[#1F3D2B] rounded-xl outline-none focus:ring-2 focus:ring-[#4A90E2]"
            >
              <option value="">اختر الفئة الرئيسية</option>
              {mainCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Subcategories */}
          {mainCategory && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التخصصات الفرعية
              </label>
              <div className="flex flex-wrap gap-2">
                {subcategoryOptions[mainCategory as keyof typeof subcategoryOptions]?.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      if (subcategories.includes(sub)) {
                        setSubcategories(subcategories.filter(s => s !== sub));
                      } else {
                        setSubcategories([...subcategories, sub]);
                      }
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      subcategories.includes(sub)
                        ? 'bg-gradient-to-l from-[#4A90E2] to-[#56CCF2] text-white'
                        : 'bg-[#F5EEE1] text-[#1F3D2B]'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Service Radius */}
        <div className="mb-6">
          <h3 className="font-semibold text-[#1F3D2B] mb-3">نطاق الخدمة</h3>
          
          <div className="space-y-2">
            <button
              onClick={() => setServiceRadius('all-uae')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                serviceRadius === 'all-uae'
                  ? 'bg-gradient-to-l from-[#4A90E2] to-[#56CCF2] text-white'
                  : 'bg-[#F5EEE1] text-[#1F3D2B]'
              }`}
            >
              <span>كل الإمارات</span>
              {serviceRadius === 'all-uae' && <CheckCircle className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setServiceRadius('emirate')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                serviceRadius === 'emirate'
                  ? 'bg-gradient-to-l from-[#4A90E2] to-[#56CCF2] text-white'
                  : 'bg-[#F5EEE1] text-[#1F3D2B]'
              }`}
            >
              <span>إمارة محددة</span>
              {serviceRadius === 'emirate' && <CheckCircle className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setServiceRadius('radius')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                serviceRadius === 'radius'
                  ? 'bg-gradient-to-l from-[#4A90E2] to-[#56CCF2] text-white'
                  : 'bg-[#F5EEE1] text-[#1F3D2B]'
              }`}
            >
              <span>نطاق من موقعي (بالكيلومتر)</span>
              {serviceRadius === 'radius' && <CheckCircle className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 4. 360 Panorama */}
        <div className="mb-6">
          <h3 className="font-semibold text-[#1F3D2B] mb-3">صورة 360 بانوراما</h3>
          
          <button className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#4A90E2] transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[#4A90E2]">
            <div className="text-5xl">360°</div>
            <div className="text-sm">رفع صورة بانورامية 360° للمحل</div>
            <div className="text-xs text-gray-400">(Panolens.js integration)</div>
          </button>
        </div>

        {/* 5. Gallery & Video */}
        <div className="mb-6">
          <h3 className="font-semibold text-[#1F3D2B] mb-3">صور وفيديو</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="h-24 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#4A90E2] transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[#4A90E2]">
              <ImageIcon className="w-6 h-6" />
              <span className="text-xs">رفع صور</span>
            </button>
            
            <button className="h-24 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#4A90E2] transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[#4A90E2]">
              <Video className="w-6 h-6" />
              <span className="text-xs">رفع فيديو</span>
            </button>
          </div>
        </div>

        {/* 6. Show on Map Toggle */}
        <div className="mb-6">
          <div className="bg-gradient-to-l from-[#4A90E2]/5 to-[#56CCF2]/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-[#1F3D2B] mb-1">
                  إظهار نشاطي في الخرائط والمتجر
                </h3>
                <p className="text-sm text-gray-600">
                  عند تفعيل هذا الخيار، سيظهر نشاطك للعملاء في الخرائط، المتجر، ونتائج البحث القريبة.
                </p>
              </div>
              
              <button
                onClick={() => setShowOnMap(!showOnMap)}
                className="flex-shrink-0 mr-4"
              >
                {showOnMap ? (
                  <ToggleRight className="w-12 h-12 text-[#D4AF37]" />
                ) : (
                  <ToggleLeft className="w-12 h-12 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveBusinessLocation}
          disabled={!selectedLocation || !mainCategory}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-l from-[#D4AF37] to-[#1F3D2B] text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          <span>حفظ موقع النشاط</span>
        </button>
      </div>

      {/* Success State */}
      {locationSaved && (
        <div className="bg-[#D4AF37]/5 border-2 border-[#D4AF37] rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-lg font-bold text-[#1F3D2B] mb-2">
            تم حفظ معلومات النشاط بنجاح
          </h3>
          
          <p className="text-[#8B6914] mb-4">
            سيظهر نشاطك الآن في الخرائط، المتجر، ونتائج البحث القريبة.
          </p>
          
          <button
            onClick={() => setLocationSaved(false)}
            className="px-6 py-2 bg-white text-[#8B6914] border-2 border-[#D4AF37] rounded-xl font-semibold hover:bg-[#D4AF37]/5 transition-all"
          >
            تعديل المعلومات
          </button>
        </div>
      )}
      <LocationPicker 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        onSelect={handleLocationSelect}
        initialLocation={selectedLocation || undefined}
        isLoaded={isLoaded}
      />
    </div>
  );
}

// ====================================
// 📦 Export Types
// ====================================

export type { UserType, ProfileLocationSetupProps, BusinessLocationData };