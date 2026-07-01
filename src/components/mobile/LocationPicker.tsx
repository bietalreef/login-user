import { toast } from 'sonner@2.0.3';
import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { X, MapPin, Check } from 'lucide-react';
import { useGoogleMaps } from '../providers/GoogleMapsLoader';
import { DecorativeMap } from '../seo/DecorativeMap';

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
  isLoaded: boolean;
}

const defaultCenter = { lat: 25.2048, lng: 55.2708 }; // Dubai

export function LocationPicker({ isOpen, onClose, onSelect, initialLocation, isLoaded }: LocationPickerProps) {
  const { mapId } = useGoogleMaps();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(initialLocation || null);
  const [address, setAddress] = useState<string>('');
  const [loadingAddress, setLoadingAddress] = useState(false);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  // Manage AdvancedMarkerElement imperatively
  useEffect(() => {
    if (!map || !selectedLocation || !google.maps.marker?.AdvancedMarkerElement) return;

    // Remove old marker
    if (markerRef.current) {
      markerRef.current.map = null;
    }

    const el = document.createElement('div');
    el.style.cssText = 'width:24px;height:24px;border-radius:50%;background:#D4AF37;border:3px solid #FFF;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer';

    markerRef.current = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: selectedLocation,
      content: el,
    });

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
    };
  }, [map, selectedLocation]);

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    if (initialLocation) {
        // If we have an initial location, try to get its address
        getAddress(initialLocation.lat, initialLocation.lng);
    }
  }, [initialLocation]);

  const getAddress = async (lat: number, lng: number) => {
    setLoadingAddress(true);
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results[0]) {
        setAddress(response.results[0].formatted_address);
      } else {
        setAddress('عنوان غير معروف');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setAddress('تعذر تحديد العنوان');
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedLocation({ lat, lng });
      getAddress(lat, lng);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelect({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-white z-10">
          <h3 className="font-bold text-[#2C1810]">تحديد الموقع</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-[#EDE4D0] overflow-auto">
          {!isLoaded ? (
            <div className="p-3">
              <DecorativeMap
                cityName="الإمارات"
                compact={true}
                hideHeader={true}
                hideStrip={true}
              />
              <p className="text-center text-xs text-[#1F3D2B]/50 mt-2 font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                سجّل دخولك لتفعيل تحديد الموقع التفاعلي
              </p>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={initialLocation || defaultCenter}
              zoom={13}
              onLoad={onMapLoad}
              onClick={handleMapClick}
              options={{
                disableDefaultUI: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                mapId,
              }}
            >
              {/* AdvancedMarkerElement managed imperatively via useEffect */}
            </GoogleMap>
          )}

          {/* Center Helper (Optional, if we prefer center picking) */}
          {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none pb-8">
            <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg animate-bounce" />
          </div> */}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white border-t space-y-3">
          {selectedLocation ? (
            <div className="bg-[#F5EEE1] p-3 rounded-xl flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#2C1810] mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-gray-500 mb-1">الموقع المحدد:</div>
                <div className="text-sm font-semibold text-[#2C1810]">
                  {loadingAddress ? 'جاري جلب العنوان...' : address}
                </div>
                <div className="text-xs text-gray-400 mt-1" dir="ltr">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-2">
              اضغط على الخريطة لتحديد الموقع
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={!selectedLocation || loadingAddress}
            className="w-full py-3 bg-gradient-to-l from-[#D4AF37] to-[#2C1810] text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>تأكيد الموقع</span>
          </button>
        </div>
      </div>
    </div>
  );
}