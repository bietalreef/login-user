import { useState } from 'react';
import { SimpleToolShell } from './SimpleToolShell';
import { useLanguage } from '../../../contexts/LanguageContext';

const fontCairo = 'Cairo, sans-serif';

const ROOM_TYPES: { id: string; ar: string; en: string; luxMin: number; luxMax: number }[] = [
  { id: 'living', ar: 'غرفة المعيشة', en: 'Living Room', luxMin: 150, luxMax: 300 },
  { id: 'bedroom', ar: 'غرفة النوم', en: 'Bedroom', luxMin: 100, luxMax: 200 },
  { id: 'kitchen', ar: 'المطبخ', en: 'Kitchen', luxMin: 300, luxMax: 500 },
  { id: 'bathroom', ar: 'الحمام', en: 'Bathroom', luxMin: 150, luxMax: 300 },
  { id: 'office', ar: 'المكتب', en: 'Office/Study', luxMin: 300, luxMax: 500 },
  { id: 'kids', ar: 'غرفة الأطفال', en: 'Kids Room', luxMin: 200, luxMax: 400 },
  { id: 'majlis', ar: 'المجلس', en: 'Majlis', luxMin: 200, luxMax: 400 },
  { id: 'corridor', ar: 'الممر', en: 'Corridor', luxMin: 100, luxMax: 150 },
  { id: 'garage', ar: 'الكراج', en: 'Garage', luxMin: 100, luxMax: 200 },
];

interface LightingResult {
  totalLumens: number;
  ledWatts: number;
  spotlightCount: number;
  panelCount: number;
  costEstimate: { min: number; max: number };
}

export function LightingCalcTool({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [roomType, setRoomType] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [result, setResult] = useState<LightingResult | null>(null);

  const selectedRoom = ROOM_TYPES.find(r => r.id === roomType);

  const calculate = () => {
    if (!selectedRoom || !length || !width) return;
    const area = parseFloat(length) * parseFloat(width);
    const avgLux = (selectedRoom.luxMin + selectedRoom.luxMax) / 2;
    const totalLumens = area * avgLux;
    const ledWatts = Math.ceil(totalLumens / 100); // ~100 lumens per watt for LED
    const spotlightCount = Math.ceil(area / 2.5); // 1 spotlight per 2.5 sqm
    const panelCount = Math.ceil(area / 6); // 1 panel per 6 sqm
    const costMin = spotlightCount * 45 + panelCount * 120;
    const costMax = spotlightCount * 85 + panelCount * 280;

    setResult({
      totalLumens: Math.round(totalLumens),
      ledWatts,
      spotlightCount,
      panelCount,
      costEstimate: { min: costMin, max: costMax },
    });
  };

  return (
    <SimpleToolShell
      title={isEn ? 'Lighting Calculator' : 'حاسبة الإضاءة'}
      subtitle={isEn ? 'Calculate lighting needs for your rooms' : 'احسب احتياجات الإضاءة لغرفك'}
      onBack={onBack}
      toolId="lighting"
      gradientFrom="#D97706"
      gradientTo="#F59E0B"
    >
      <div className="space-y-5 p-4" dir="rtl">
        {/* Room Type */}
        <div>
          <label className="text-sm font-bold text-[#1F3D2B] mb-2 block" style={{ fontFamily: fontCairo }}>
            {isEn ? 'Room Type' : 'نوع الغرفة'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ROOM_TYPES.map(room => (
              <button
                key={room.id}
                onClick={() => setRoomType(room.id)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  roomType === room.id
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-white text-[#1F3D2B] border-[4px] border-gray-200/60'
                }`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? room.en : room.ar}
              </button>
            ))}
          </div>
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-[#1F3D2B]/70 mb-1 block" style={{ fontFamily: fontCairo }}>
              {isEn ? 'Length (m)' : 'الطول (م)'}
            </label>
            <input
              type="number"
              value={length}
              onChange={e => setLength(e.target.value)}
              placeholder="5"
              className="w-full bg-white border-[4px] border-gray-200/60 rounded-xl px-3 py-2.5 text-sm text-[#1F3D2B] outline-none focus:border-amber-400"
              style={{ fontFamily: fontCairo }}
              dir="ltr"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#1F3D2B]/70 mb-1 block" style={{ fontFamily: fontCairo }}>
              {isEn ? 'Width (m)' : 'العرض (م)'}
            </label>
            <input
              type="number"
              value={width}
              onChange={e => setWidth(e.target.value)}
              placeholder="4"
              className="w-full bg-white border-[4px] border-gray-200/60 rounded-xl px-3 py-2.5 text-sm text-[#1F3D2B] outline-none focus:border-amber-400"
              style={{ fontFamily: fontCairo }}
              dir="ltr"
            />
          </div>
        </div>

        {selectedRoom && (
          <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-800" style={{ fontFamily: fontCairo }}>
            💡 {isEn 
              ? `Recommended: ${selectedRoom.luxMin}–${selectedRoom.luxMax} lux for ${selectedRoom.en}`
              : `المعيار الموصى: ${selectedRoom.luxMin}–${selectedRoom.luxMax} لكس لـ${selectedRoom.ar}`}
          </div>
        )}

        {/* Calculate */}
        <button
          onClick={calculate}
          disabled={!roomType || !length || !width}
          className="w-full bg-gradient-to-l from-amber-500 to-yellow-600 text-white py-3.5 rounded-2xl font-bold text-sm disabled:opacity-40 shadow-lg"
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'Calculate Lighting' : 'احسب الإضاءة'}
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-3 mt-4">
            <h3 className="text-base font-bold text-[#1F3D2B]" style={{ fontFamily: fontCairo }}>
              {isEn ? 'Lighting Requirements' : 'متطلبات الإضاءة'}
            </h3>

            <div className="bg-white rounded-2xl p-4 shadow-sm border-[4px] border-gray-100/60 space-y-3">
              {[
                { label: isEn ? 'Room Area' : 'مساحة الغرفة', value: `${(parseFloat(length) * parseFloat(width)).toFixed(1)} ${isEn ? 'sqm' : 'م²'}` },
                { label: isEn ? 'Total Lumens Needed' : 'إجمالي اللومن المطلوب', value: result.totalLumens.toLocaleString() + (isEn ? ' lm' : ' لومن') },
                { label: isEn ? 'LED Wattage Needed' : 'الواط المطلوب (LED)', value: `${result.ledWatts} ${isEn ? 'W' : 'واط'}` },
                { label: isEn ? 'Spotlights (7W each)' : 'سبوتلايت (7 واط)', value: `${result.spotlightCount} ${isEn ? 'units' : 'قطعة'}` },
                { label: isEn ? 'LED Panels (40W each)' : 'بانل LED (40 واط)', value: `${result.panelCount} ${isEn ? 'units' : 'قطعة'}` },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500" style={{ fontFamily: fontCairo }}>{item.label}</span>
                  <span className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily: fontCairo }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-l from-amber-500 to-yellow-600 rounded-2xl p-4 text-white border-[4px] border-amber-400/30">
              <p className="text-xs opacity-80 mb-1" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Estimated Cost (LED fixtures)' : 'التكلفة التقديرية (تجهيزات LED)'}
              </p>
              <p className="text-xl font-black" style={{ fontFamily: fontCairo }}>
                {result.costEstimate.min.toLocaleString()} – {result.costEstimate.max.toLocaleString()} {isEn ? 'AED' : 'د.إ'}
              </p>
            </div>
          </div>
        )}
      </div>
    </SimpleToolShell>
  );
}