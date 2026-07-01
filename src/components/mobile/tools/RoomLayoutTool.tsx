import { useState } from 'react';
import { SimpleToolShell } from './SimpleToolShell';
import { useLanguage } from '../../../contexts/LanguageContext';

const fontCairo = 'Cairo, sans-serif';

interface FurnitureItem {
  id: string;
  nameAr: string;
  nameEn: string;
  minArea: number; // sqm needed
  icon: string;
}

const FURNITURE_CATALOG: Record<string, FurnitureItem[]> = {
  living: [
    { id: 'sofa3', nameAr: 'كنبة 3 مقاعد', nameEn: '3-Seat Sofa', minArea: 2.4, icon: '🛋️' },
    { id: 'sofa2', nameAr: 'كنبة مقعدين', nameEn: '2-Seat Sofa', minArea: 1.6, icon: '🛋️' },
    { id: 'coffee', nameAr: 'طاولة قهوة', nameEn: 'Coffee Table', minArea: 0.8, icon: '☕' },
    { id: 'tv', nameAr: 'وحدة تلفزيون', nameEn: 'TV Unit', minArea: 1.2, icon: '📺' },
    { id: 'shelf', nameAr: 'مكتبة/رف', nameEn: 'Bookshelf', minArea: 0.6, icon: '📚' },
    { id: 'armchair', nameAr: 'كرسي مفرد', nameEn: 'Armchair', minArea: 0.8, icon: '💺' },
  ],
  bedroom: [
    { id: 'bed_king', nameAr: 'سرير كينج', nameEn: 'King Bed', minArea: 3.6, icon: '🛏️' },
    { id: 'bed_queen', nameAr: 'سرير كوين', nameEn: 'Queen Bed', minArea: 3.0, icon: '🛏️' },
    { id: 'bed_single', nameAr: 'سرير مفرد', nameEn: 'Single Bed', minArea: 1.9, icon: '🛏️' },
    { id: 'wardrobe', nameAr: 'خزانة ملابس', nameEn: 'Wardrobe', minArea: 1.5, icon: '🗄️' },
    { id: 'dresser', nameAr: 'تسريحة', nameEn: 'Dresser', minArea: 0.8, icon: '🪞' },
    { id: 'nightstand', nameAr: 'كومودينو', nameEn: 'Nightstand', minArea: 0.3, icon: '🔲' },
  ],
  office: [
    { id: 'desk', nameAr: 'مكتب عمل', nameEn: 'Work Desk', minArea: 1.5, icon: '🖥️' },
    { id: 'chair', nameAr: 'كرسي مكتب', nameEn: 'Office Chair', minArea: 0.6, icon: '🪑' },
    { id: 'bookshelf', nameAr: 'مكتبة', nameEn: 'Bookshelf', minArea: 0.8, icon: '📚' },
    { id: 'filing', nameAr: 'خزانة ملفات', nameEn: 'Filing Cabinet', minArea: 0.4, icon: '🗄️' },
    { id: 'printer', nameAr: 'طاولة طابعة', nameEn: 'Printer Table', minArea: 0.5, icon: '🖨️' },
  ],
  kitchen: [
    { id: 'dining4', nameAr: 'طاولة طعام 4 أشخاص', nameEn: '4-Person Dining', minArea: 2.4, icon: '🍽️' },
    { id: 'dining6', nameAr: 'طاولة طعام 6 أشخاص', nameEn: '6-Person Dining', minArea: 3.6, icon: '🍽️' },
    { id: 'island', nameAr: 'جزيرة مطبخ', nameEn: 'Kitchen Island', minArea: 2.0, icon: '🏝️' },
    { id: 'cart', nameAr: 'عربة مطبخ', nameEn: 'Kitchen Cart', minArea: 0.5, icon: '🛒' },
  ],
  majlis: [
    { id: 'majlis_l', nameAr: 'كنبة L مجلس', nameEn: 'L-Shape Majlis Sofa', minArea: 4.5, icon: '🛋️' },
    { id: 'majlis_u', nameAr: 'كنبة U مجلس', nameEn: 'U-Shape Majlis Sofa', minArea: 6.0, icon: '🛋️' },
    { id: 'majlis_table', nameAr: 'طاولة مجلس', nameEn: 'Majlis Table', minArea: 1.2, icon: '☕' },
    { id: 'majlis_rug', nameAr: 'سجادة كبيرة', nameEn: 'Large Rug', minArea: 3.0, icon: '🧵' },
  ],
};

const ROOM_OPTIONS = [
  { id: 'living', ar: 'غرفة المعيشة', en: 'Living Room' },
  { id: 'bedroom', ar: 'غرفة النوم', en: 'Bedroom' },
  { id: 'office', ar: 'المكتب', en: 'Office' },
  { id: 'kitchen', ar: 'المطبخ', en: 'Kitchen' },
  { id: 'majlis', ar: 'المجلس', en: 'Majlis' },
];

export function RoomLayoutTool({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [roomType, setRoomType] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const area = length && width ? parseFloat(length) * parseFloat(width) : 0;
  const furniture = FURNITURE_CATALOG[roomType] || [];
  const selectedItems = furniture.filter(f => selected.includes(f.id));
  const usedArea = selectedItems.reduce((acc, f) => acc + f.minArea, 0);
  const walkingArea = area * 0.3; // 30% should be free space
  const availableArea = area - walkingArea;
  const fits = usedArea <= availableArea;

  const toggleItem = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setShowResult(false);
  };

  const analyze = () => setShowResult(true);

  return (
    <SimpleToolShell
      title={isEn ? 'Room Layout Planner' : 'مخطط تأثيث الغرف'}
      subtitle={isEn ? 'Check if furniture fits your room' : 'تحقّق من ملاءمة الأثاث لغرفتك'}
      onBack={onBack}
      toolId="room-layout"
      gradientFrom="#3730A3"
      gradientTo="#6366F1"
    >
      <div className="space-y-5 p-4" dir="rtl">
        {/* Room Type */}
        <div>
          <label className="text-sm font-bold text-[#1F3D2B] mb-2 block" style={{ fontFamily: fontCairo }}>
            {isEn ? 'Room Type' : 'نوع الغرفة'}
          </label>
          <div className="flex gap-2 flex-wrap">
            {ROOM_OPTIONS.map(r => (
              <button
                key={r.id}
                onClick={() => { setRoomType(r.id); setSelected([]); setShowResult(false); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  roomType === r.id ? 'bg-indigo-500 text-white shadow-md' : 'bg-white text-[#1F3D2B] border-[4px] border-gray-200/60'
                }`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? r.en : r.ar}
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
            <input type="number" value={length} onChange={e => { setLength(e.target.value); setShowResult(false); }}
              placeholder="5" dir="ltr"
              className="w-full bg-white border-[4px] border-gray-200/60 rounded-xl px-3 py-2.5 text-sm text-[#1F3D2B] outline-none focus:border-indigo-400"
              style={{ fontFamily: fontCairo }}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#1F3D2B]/70 mb-1 block" style={{ fontFamily: fontCairo }}>
              {isEn ? 'Width (m)' : 'العرض (م)'}
            </label>
            <input type="number" value={width} onChange={e => { setWidth(e.target.value); setShowResult(false); }}
              placeholder="4" dir="ltr"
              className="w-full bg-white border-[4px] border-gray-200/60 rounded-xl px-3 py-2.5 text-sm text-[#1F3D2B] outline-none focus:border-indigo-400"
              style={{ fontFamily: fontCairo }}
            />
          </div>
        </div>

        {area > 0 && (
          <div className="bg-indigo-50 rounded-xl p-3 text-xs text-indigo-800 flex items-center justify-between" style={{ fontFamily: fontCairo }}>
            <span>📐 {isEn ? 'Room Area' : 'مساحة الغرفة'}: {area.toFixed(1)} {isEn ? 'sqm' : 'م²'}</span>
            <span>{isEn ? 'Usable' : 'قابل للتأثيث'}: {availableArea.toFixed(1)} {isEn ? 'sqm' : 'م²'}</span>
          </div>
        )}

        {/* Furniture Selection */}
        {roomType && furniture.length > 0 && (
          <div>
            <label className="text-sm font-bold text-[#1F3D2B] mb-2 block" style={{ fontFamily: fontCairo }}>
              {isEn ? 'Select Furniture' : 'اختر الأثاث'}
            </label>
            <div className="space-y-2">
              {furniture.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-right transition-all ${
                    selected.includes(item.id)
                      ? 'bg-indigo-100 border-[4px] border-indigo-400'
                      : 'bg-white border-[4px] border-gray-200/60'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily: fontCairo }}>
                      {isEn ? item.nameEn : item.nameAr}
                    </p>
                    <p className="text-[10px] text-gray-400" style={{ fontFamily: fontCairo }}>
                      {isEn ? `Needs ${item.minArea} sqm` : `يحتاج ${item.minArea} م²`}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-[4px] flex items-center justify-center ${
                    selected.includes(item.id) ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-300'
                  }`}>
                    {selected.includes(item.id) && <span className="text-xs">✓</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Analyze */}
        {selected.length > 0 && area > 0 && (
          <button
            onClick={analyze}
            className="w-full bg-gradient-to-l from-indigo-500 to-blue-600 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg"
            style={{ fontFamily: fontCairo }}
          >
            {isEn ? 'Analyze Layout' : 'تحليل التخطيط'}
          </button>
        )}

        {/* Result */}
        {showResult && (
          <div className="space-y-3">
            <div className={`rounded-2xl p-4 ${fits ? 'bg-green-50 border-[4px] border-green-200/60' : 'bg-red-50 border-[4px] border-red-200/60'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{fits ? '✅' : '⚠️'}</span>
                <h4 className={`font-bold text-sm ${fits ? 'text-green-700' : 'text-red-700'}`} style={{ fontFamily: fontCairo }}>
                  {fits
                    ? (isEn ? 'Everything fits!' : 'كل شيء يتسع!')
                    : (isEn ? 'Space might be tight' : 'المساحة قد تكون ضيقة')}
                </h4>
              </div>
              <div className="space-y-1.5 text-xs" style={{ fontFamily: fontCairo }}>
                <div className="flex justify-between text-gray-600">
                  <span>{isEn ? 'Furniture area' : 'مساحة الأثاث'}</span>
                  <span className="font-bold">{usedArea.toFixed(1)} {isEn ? 'sqm' : 'م²'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{isEn ? 'Available area' : 'المساحة المتاحة'}</span>
                  <span className="font-bold">{availableArea.toFixed(1)} {isEn ? 'sqm' : 'م²'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{isEn ? 'Free walking space' : 'مسافة المشي الحرة'}</span>
                  <span className="font-bold">{(availableArea - usedArea).toFixed(1)} {isEn ? 'sqm' : 'م²'}</span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${fits ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min((usedArea / availableArea) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 text-center">
                  {isEn ? `${Math.round((usedArea / availableArea) * 100)}% utilized` : `${Math.round((usedArea / availableArea) * 100)}% مستغل`}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border-[4px] border-gray-100/60">
              <h4 className="font-bold text-sm text-[#1F3D2B] mb-2" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Selected Items' : 'العناصر المختارة'}
              </h4>
              {selectedItems.map(item => (
                <div key={item.id} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                  <span>{item.icon}</span>
                  <span className="flex-1 text-xs text-[#1F3D2B]" style={{ fontFamily: fontCairo }}>
                    {isEn ? item.nameEn : item.nameAr}
                  </span>
                  <span className="text-[10px] text-gray-400">{item.minArea} {isEn ? 'sqm' : 'م²'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SimpleToolShell>
  );
}