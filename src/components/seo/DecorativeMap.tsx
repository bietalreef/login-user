/**
 * DecorativeMap.tsx — خريطة جمالية بصرية بدون تفاعل حقيقي
 * ═══════════════════════════════════════════════════════════
 * - شبكة خطوط الشوارع SVG بنمط مدني
 * - بنوات مزودين (Drops) بـ popup عند الـ hover
 * - كل drop يحتوي: اسم المزود + أيقونة هاتف + واتساب + المسافة
 * - لا يوجد تفاعل حقيقي، ولا أرقام هواتف
 */

import { Phone, MapPin, Navigation, Layers, Filter } from 'lucide-react';

const font = 'Cairo, Tajawal, sans-serif';

// WhatsApp SVG icon
const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
      fill="currentColor"
    />
    <path
      d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.413A9.954 9.954 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182a8.18 8.18 0 01-4.178-1.144l-.3-.178-3.1.813.828-3.02-.195-.31A8.182 8.182 0 1112 20.182z"
      fill="currentColor"
    />
  </svg>
);

// بيانات المزودين الديمو مع المواضع على الخريطة
interface MapProvider {
  name: string;
  shortName: string;
  specialty: string;
  rating: number;
  distance: string;
  x: number; // % من العرض
  y: number; // % من الارتفاع
  verified: boolean;
  color: 'gold' | 'blue';
}

const MAP_PROVIDERS: MapProvider[] = [
  {
    name: 'شركة النخبة للمقاولات',
    shortName: 'النخبة',
    specialty: 'مقاولات عامة',
    rating: 4.9,
    distance: '0.8 كم',
    x: 18,
    y: 28,
    verified: true,
    color: 'gold',
  },
  {
    name: 'مجموعة الإمارات للبناء',
    shortName: 'الإمارات',
    specialty: 'تشطيب فلل',
    rating: 4.8,
    distance: '1.4 كم',
    x: 42,
    y: 52,
    verified: true,
    color: 'blue',
  },
  {
    name: 'دار الجودة للصيانة',
    shortName: 'الجودة',
    specialty: 'صيانة شاملة',
    rating: 4.7,
    distance: '2.1 كم',
    x: 63,
    y: 22,
    verified: true,
    color: 'gold',
  },
  {
    name: 'فريق الحرفيين المتحدون',
    shortName: 'الحرفيون',
    specialty: 'كهرباء وتكييف',
    rating: 4.6,
    distance: '2.8 كم',
    x: 76,
    y: 60,
    verified: false,
    color: 'blue',
  },
  {
    name: 'مؤسسة الأفق للبناء',
    shortName: 'الأفق',
    specialty: 'مقاولات بناء',
    rating: 4.5,
    distance: '3.5 كم',
    x: 30,
    y: 72,
    verified: true,
    color: 'gold',
  },
  {
    name: 'شركة الرياض للتشطيب',
    shortName: 'الرياض',
    specialty: 'تصميم داخلي',
    rating: 4.8,
    distance: '4.2 كم',
    x: 83,
    y: 34,
    verified: true,
    color: 'blue',
  },
];

// ══════════════════════════════════════════════
// SVG Map Background — شبكة شوارع ديناميكية
// ══════════════════════════════════════════════
function MapGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1000 520"
    >
      <defs>
        {/* تدرج الخلفية */}
        <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EDE4D0" />
          <stop offset="50%" stopColor="#E8DCC8" />
          <stop offset="100%" stopColor="#EFE7D8" />
        </linearGradient>
        {/* تدرج الشوارع الرئيسية */}
        <linearGradient id="roadMain" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4C5A2" />
          <stop offset="100%" stopColor="#C8B890" />
        </linearGradient>
        {/* ظل المباني */}
        <filter id="buildingShadow">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#B8A882" floodOpacity="0.3" />
        </filter>
        {/* ظل المؤشر */}
        <filter id="pinShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#D4AF37" floodOpacity="0.5" />
        </filter>
        {/* نمط الشبكة الخفية */}
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#C8B88A" strokeWidth="0.4" strokeOpacity="0.5" />
        </pattern>
        {/* نمط نقاط صغيرة */}
        <pattern id="dots" width="25" height="25" patternUnits="userSpaceOnUse">
          <circle cx="12.5" cy="12.5" r="0.8" fill="#C0AA80" fillOpacity="0.4" />
        </pattern>
      </defs>

      {/* الخلفية الأساسية */}
      <rect width="1000" height="520" fill="url(#mapBg)" />

      {/* شبكة الإحداثيات */}
      <rect width="1000" height="520" fill="url(#grid)" />
      <rect width="1000" height="520" fill="url(#dots)" />

      {/* ═══ مناطق المدينة (Parks / Water / Districts) ═══ */}

      {/* منطقة خضراء / حديقة */}
      <rect x="80" y="60" width="120" height="90" rx="8" fill="#C8D8B0" fillOpacity="0.5" />
      <text x="140" y="112" textAnchor="middle" fill="#6A8050" fontSize="9" fontFamily="Arial">منطقة خضراء</text>

      {/* منطقة الميناء / الماء */}
      <path d="M0 380 Q100 360 200 375 Q300 390 400 370 Q500 355 600 368 Q700 382 800 365 Q900 350 1000 360 L1000 520 L0 520Z"
        fill="#B8D4E8" fillOpacity="0.35" />
      <text x="500" y="460" textAnchor="middle" fill="#4A7A98" fontSize="10" fontFamily="Arial">الواجهة البحرية</text>

      {/* منطقة تجارية */}
      <rect x="620" y="80" width="150" height="110" rx="6" fill="#E8D4A8" fillOpacity="0.6" />
      <text x="695" y="142" textAnchor="middle" fill="#8B7040" fontSize="9" fontFamily="Arial">المنطقة التجارية</text>

      {/* ═══ مبانٍ وكتل سكنية ═══ */}
      {/* مجموعة مبانٍ يسار */}
      {[
        { x: 55, y: 170, w: 35, h: 25 },
        { x: 95, y: 165, w: 28, h: 30 },
        { x: 130, y: 172, w: 40, h: 23 },
        { x: 55, y: 205, w: 55, h: 20 },
        { x: 118, y: 202, w: 30, h: 22 },
        { x: 155, y: 200, w: 22, h: 24 },
      ].map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="2"
          fill="#D4C4A0" fillOpacity="0.7" filter="url(#buildingShadow)" />
      ))}

      {/* مجموعة مبانٍ وسط */}
      {[
        { x: 420, y: 100, w: 45, h: 35 },
        { x: 472, y: 108, w: 30, h: 27 },
        { x: 508, y: 103, w: 38, h: 32 },
        { x: 420, y: 145, w: 60, h: 22 },
        { x: 488, y: 143, w: 40, h: 24 },
        { x: 535, y: 140, w: 25, h: 28 },
      ].map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="2"
          fill="#D0C09A" fillOpacity="0.65" filter="url(#buildingShadow)" />
      ))}

      {/* مجموعة مبانٍ يمين */}
      {[
        { x: 820, y: 210, w: 38, h: 28 },
        { x: 865, y: 205, w: 30, h: 33 },
        { x: 902, y: 215, w: 45, h: 25 },
        { x: 820, y: 248, w: 55, h: 20 },
        { x: 882, y: 245, w: 35, h: 22 },
        { x: 924, y: 243, w: 28, h: 25 },
      ].map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="2"
          fill="#CABA94" fillOpacity="0.65" filter="url(#buildingShadow)" />
      ))}

      {/* مبانٍ متفرقة */}
      {[
        { x: 270, y: 290, w: 50, h: 30 },
        { x: 328, y: 285, w: 35, h: 38 },
        { x: 580, y: 270, w: 42, h: 28 },
        { x: 628, y: 278, w: 30, h: 22 },
        { x: 680, y: 380, w: 55, h: 25 },
        { x: 742, y: 385, w: 40, h: 22 },
        { x: 155, y: 310, w: 45, h: 28 },
        { x: 907, y: 385, w: 50, h: 28 },
      ].map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="2"
          fill="#CCBC98" fillOpacity="0.6" filter="url(#buildingShadow)" />
      ))}

      {/* ═══ الشوارع الرئيسية (عريضة) ═══ */}

      {/* شارع أفقي رئيسي 1 */}
      <rect x="0" y="148" width="1000" height="14" fill="#D8CAA8" fillOpacity="0.9" />
      <line x1="0" y1="155" x2="1000" y2="155" stroke="#F0E8D0" strokeWidth="0.8" strokeDasharray="20,15" strokeOpacity="0.7" />
      <text x="500" y="145" textAnchor="middle" fill="#A08850" fontSize="8" fontFamily="Arial">شارع الشيخ زايد</text>

      {/* شارع أفقي رئيسي 2 */}
      <rect x="0" y="248" width="1000" height="12" fill="#D4C6A4" fillOpacity="0.85" />
      <line x1="0" y1="254" x2="1000" y2="254" stroke="#ECE4CC" strokeWidth="0.7" strokeDasharray="18,14" strokeOpacity="0.6" />
      <text x="500" y="245" textAnchor="middle" fill="#A08850" fontSize="8" fontFamily="Arial">شارع الاتحاد</text>

      {/* شارع أفقي رئيسي 3 */}
      <rect x="0" y="348" width="1000" height="12" fill="#CEC0A0" fillOpacity="0.8" />
      <line x1="0" y1="354" x2="1000" y2="354" stroke="#E8E0C8" strokeWidth="0.7" strokeDasharray="18,14" strokeOpacity="0.6" />
      <text x="500" y="345" textAnchor="middle" fill="#A08850" fontSize="8" fontFamily="Arial">شارع الكورنيش</text>

      {/* شارع عمودي رئيسي 1 */}
      <rect x="198" y="0" width="13" height="520" fill="#D8CAA8" fillOpacity="0.85" />
      <line x1="204.5" y1="0" x2="204.5" y2="520" stroke="#EEE6CE" strokeWidth="0.7" strokeDasharray="20,15" strokeOpacity="0.6" />
      <text x="195" y="40" textAnchor="end" fill="#A08850" fontSize="8" fontFamily="Arial" transform="rotate(-90, 195, 40)">شارع النهيان</text>

      {/* شارع عمودي رئيسي 2 */}
      <rect x="398" y="0" width="12" height="520" fill="#D4C6A4" fillOpacity="0.85" />
      <line x1="404" y1="0" x2="404" y2="520" stroke="#EAE2CA" strokeWidth="0.7" strokeDasharray="20,14" strokeOpacity="0.6" />

      {/* شارع عمودي رئيسي 3 */}
      <rect x="598" y="0" width="12" height="520" fill="#CEC0A0" fillOpacity="0.8" />
      <line x1="604" y1="0" x2="604" y2="520" stroke="#E8DFC8" strokeWidth="0.7" strokeDasharray="20,14" strokeOpacity="0.6" />

      {/* شارع عمودي رئيسي 4 */}
      <rect x="798" y="0" width="11" height="520" fill="#CEC0A0" fillOpacity="0.8" />

      {/* ═══ شوارع فرعية (رفيعة) ═══ */}
      {/* أفقية */}
      {[60, 100, 200, 298, 320, 420, 448, 480].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="1000" y2={y}
          stroke="#C8B890" strokeWidth="3" strokeOpacity="0.5" />
      ))}

      {/* عمودية */}
      {[80, 140, 260, 330, 460, 520, 660, 730, 860, 930].map((x, i) => (
        <line key={i} x1={x} y1="0" x2={x} y2="520"
          stroke="#C8B890" strokeWidth="3" strokeOpacity="0.45" />
      ))}

      {/* ═══ خطوط الشبكة الجغرافية (رفيعة جداً) ═══ */}
      {[50, 100, 150, 200, 250, 300, 350, 400, 450].map((y, i) => (
        <line key={`gh${i}`} x1="0" y1={y} x2="1000" y2={y}
          stroke="#B8A878" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="4,8" />
      ))}
      {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x, i) => (
        <line key={`gv${i}`} x1={x} y1="0" x2={x} y2="520"
          stroke="#B8A878" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="4,8" />
      ))}

      {/* ═══ دوّارات وتقاطعات ═══ */}
      {[
        { cx: 205, cy: 155 },
        { cx: 404, cy: 155 },
        { cx: 604, cy: 155 },
        { cx: 205, cy: 254 },
        { cx: 404, cy: 254 },
        { cx: 604, cy: 254 },
        { cx: 799, cy: 254 },
        { cx: 205, cy: 354 },
        { cx: 404, cy: 354 },
        { cx: 604, cy: 354 },
      ].map((c, i) => (
        <g key={i}>
          <circle cx={c.cx} cy={c.cy} r="10" fill="#D8C8A0" stroke="#C0A870" strokeWidth="1.5" />
          <circle cx={c.cx} cy={c.cy} r="4" fill="#C8B888" />
        </g>
      ))}

      {/* ═══ مقياس ��لخريطة (Scale Bar) ═══ */}
      <g transform="translate(20, 490)">
        <rect x="0" y="-4" width="80" height="8" rx="2" fill="#C8B080" />
        <rect x="0" y="-4" width="40" height="8" rx="2" fill="#A89060" />
        <text x="0" y="14" fill="#806840" fontSize="8" fontFamily="Arial">0</text>
        <text x="38" y="14" fill="#806840" fontSize="8" fontFamily="Arial">500م</text>
        <text x="72" y="14" fill="#806840" fontSize="8" fontFamily="Arial">1كم</text>
      </g>

      {/* ═══ مؤشر الشمال ═══ */}
      <g transform="translate(958, 25)">
        <circle cx="0" cy="0" r="18" fill="white" fillOpacity="0.9" stroke="#D4AF37" strokeWidth="1.5" />
        <polygon points="0,-12 -5,4 0,2 5,4" fill="#D4AF37" />
        <polygon points="0,12 -5,-4 0,-2 5,-4" fill="#C0AA88" fillOpacity="0.5" />
        <text x="0" y="-4" textAnchor="middle" fill="#8B6914" fontSize="10" fontFamily="Arial" fontWeight="bold">N</text>
      </g>
    </svg>
  );
}

// ══════════════════════════════════════════════
// Provider Marker — دبوس المزود
// ══════════════════════════════════════════════
function ProviderMarker({ provider }: { provider: MapProvider }) {
  const isGold = provider.color === 'gold';
  const pinColor = isGold ? '#D4AF37' : '#3B5BFE';
  const bgColor = isGold ? 'bg-[#D4AF37]' : 'bg-[#3B5BFE]';
  const borderColor = isGold ? 'border-[#D4AF37]' : 'border-[#3B5BFE]';
  const textColor = isGold ? 'text-[#8B6914]' : 'text-[#3B5BFE]';

  return (
    <div
      className="absolute group"
      style={{
        left: `${provider.x}%`,
        top: `${provider.y}%`,
        transform: 'translate(-50%, -100%)',
        zIndex: 10,
      }}
    >
      {/* ══ Popup Card — يظهر عند hover ══ */}
      <div
        className={`
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl
          border ${borderColor} border-opacity-30
          opacity-0 scale-90 pointer-events-none
          group-hover:opacity-100 group-hover:scale-100
          transition-all duration-200 ease-out
          text-right
        `}
        style={{ fontFamily: font, zIndex: 50 }}
      >
        {/* Header الكارد */}
        <div className={`px-3 py-2 rounded-t-2xl ${isGold ? 'bg-[#D4AF37]/10' : 'bg-[#3B5BFE]/10'}`}>
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white text-xs font-black">
                {provider.shortName.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-black truncate ${isGold ? 'text-[#1F3D2B]' : 'text-[#1F3D2B]'}`}>
                {provider.shortName}
              </p>
              <p className="text-[10px] text-[#1F3D2B]/50 truncate">{provider.specialty}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-3 py-2 space-y-1.5">
          {/* التقييم */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill={s <= Math.round(provider.rating) ? '#D4AF37' : '#E5E7EB'}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-xs font-bold text-[#1F3D2B]">{provider.rating}</span>
          </div>

          {/* المسافة */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />
            <span className="text-[10px] font-bold text-[#1F3D2B]/70">{provider.distance} منك</span>
            {provider.verified && (
              <span className={`mr-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isGold ? 'bg-[#D4AF37]/15 text-[#8B6914]' : 'bg-[#3B5BFE]/15 text-[#3B5BFE]'}`}>
                موثّق
              </span>
            )}
          </div>

          {/* أيقونات التواصل */}
          <div className="flex items-center justify-between pt-1.5 border-t border-[#1F3D2B]/8">
            {/* هاتف */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F5EEE1] cursor-default select-none"
              title="للتواصل سجّل دخولك"
            >
              <Phone className="w-3 h-3 text-[#D4AF37]" />
              <span className="text-[9px] font-bold text-[#1F3D2B]/60">اتصال</span>
            </div>
            {/* واتساب */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#E8F5E9] cursor-default select-none"
              title="للتواصل عبر واتساب سجّل دخولك"
            >
              <span className="text-[#25D366]">
                <WhatsAppIcon size={12} />
              </span>
              <span className="text-[9px] font-bold text-[#1F3D2B]/60">واتساب</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Pin الدبوس ══ */}
      <div className="relative cursor-pointer select-none">
        {/* نبضة */}
        <div
          className="absolute -inset-2 rounded-full animate-ping"
          style={{ backgroundColor: pinColor, opacity: 0.15 }}
        />
        {/* الدبوس الرئيسي */}
        <div
          className="relative w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-125 group-hover:shadow-xl"
          style={{ backgroundColor: pinColor }}
        >
          <MapPin className="w-4 h-4 text-white fill-white" />
        </div>
        {/* الذيل */}
        <div
          className="w-2 h-3 mx-auto -mt-1 rounded-b-full"
          style={{ backgroundColor: pinColor, opacity: 0.9 }}
        />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// Legend — مفتاح الخريطة
// ══════════════════════════════════════════════
function MapLegend() {
  return (
    <div
      className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-white/60"
      style={{ fontFamily: font }}
    >
      <p className="text-[10px] font-black text-[#1F3D2B]/60 mb-1.5">المؤشرات</p>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
        <span className="text-[10px] text-[#1F3D2B]/80">مزود مميز</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#3B5BFE]" />
        <span className="text-[10px] text-[#1F3D2B]/80">مزود موثق</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// Map Controls
// ══════════════════════════════════════════════
function MapControls() {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      {/* Zoom + */}
      <div className="w-9 h-9 bg-white/95 rounded-xl shadow-md flex items-center justify-center border border-white/60 cursor-default select-none">
        <span className="text-[#1F3D2B] font-bold text-lg leading-none">+</span>
      </div>
      {/* Zoom - */}
      <div className="w-9 h-9 bg-white/95 rounded-xl shadow-md flex items-center justify-center border border-white/60 cursor-default select-none">
        <span className="text-[#1F3D2B] font-bold text-lg leading-none">−</span>
      </div>
      {/* Navigation */}
      <div className="w-9 h-9 bg-white/95 rounded-xl shadow-md flex items-center justify-center border border-white/60 cursor-default select-none mt-1">
        <Navigation className="w-4 h-4 text-[#D4AF37]" />
      </div>
      {/* Layers */}
      <div className="w-9 h-9 bg-white/95 rounded-xl shadow-md flex items-center justify-center border border-white/60 cursor-default select-none">
        <Layers className="w-4 h-4 text-[#3B5BFE]" />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// Location Dot — موقعي الحالي
// ══════════════════════════════════════════════
function MyLocationDot() {
  return (
    <div
      className="absolute"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 20 }}
    >
      {/* دائرة النبض */}
      <div className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 rounded-full border-2 border-[#3B5BFE]/30 animate-ping" />
      </div>
      {/* النقطة الرئيسية */}
      <div className="relative w-5 h-5 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full bg-[#3B5BFE]/20 border-2 border-[#3B5BFE]/40" />
        <div className="absolute inset-1 rounded-full bg-[#3B5BFE] border-2 border-white shadow-md" />
      </div>
      {/* تلميح */}
      <div
        className="absolute -top-7 left-1/2 -translate-x-1/2 -translate-y-full bg-[#3B5BFE] text-white rounded-lg px-2 py-0.5 whitespace-nowrap shadow-md"
        style={{ fontFamily: font, fontSize: '10px', fontWeight: 700 }}
      >
        موقعي
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// MAIN DecorativeMap Component
// ══════════════════════════════════════════════
interface DecorativeMapProps {
  cityName: string;
  providers?: MapProvider[];
  className?: string;
  /** compact = 320px height, normal = 520px */
  compact?: boolean;
  /** إخفاء الشريط السفلي */
  hideStrip?: boolean;
  /** إخفاء الـ header (العنوان والزر) */
  hideHeader?: boolean;
}

export function DecorativeMap({
  cityName,
  providers = MAP_PROVIDERS,
  className = '',
  compact = false,
  hideStrip = false,
  hideHeader = false,
}: DecorativeMapProps) {
  const mapHeight = compact ? '320px' : '520px';

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between mb-6" dir="rtl">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F3D2B]" style={{ fontFamily: font }}>
              الخريطة التفاعلية
            </h2>
            <p className="text-sm text-[#1F3D2B]/50 mt-1" style={{ fontFamily: font }}>
              {providers.length} مزود قريب منك في {cityName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-white/80 backdrop-blur-md rounded-xl border border-[#D4AF37]/20 shadow-sm cursor-default select-none">
              <Filter className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-semibold text-[#1F3D2B]" style={{ fontFamily: font }}>تصفية</span>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37]/20 shadow-xl"
        style={{ height: mapHeight, background: '#EDE4D0' }}
      >
        {/* طبقة SVG الخلفية */}
        <MapGrid />

        {/* موقعي الحالي */}
        <MyLocationDot />

        {/* مؤشرات المزودين */}
        {providers.map((provider, i) => (
          <ProviderMarker key={i} provider={provider} />
        ))}

        {/* أدوات التحكم */}
        <MapControls />

        {/* مفتاح الخريطة */}
        <MapLegend />

        {/* شارة المدينة */}
        <div
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-white/60"
          style={{ fontFamily: font }}
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm font-black text-[#1F3D2B]">{cityName}</span>
          </div>
        </div>

        {/* شارة "تمرير للرؤية" على موبايل */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:hidden bg-[#1F3D2B]/70 text-white/90 rounded-full px-3 py-1.5 text-[10px] backdrop-blur-sm"
          style={{ fontFamily: font }}
        >
          مرّر فوق المؤشر لتفاصيل المزود
        </div>
      </div>

      {/* Provider Quick Strip — شريط المزودين أسفل الخريطة */}
      {!hideStrip && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide" dir="rtl">
          {providers.map((provider, i) => {
            const isGold = provider.color === 'gold';
            return (
              <div
                key={i}
                className="flex-shrink-0 flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/60 shadow-sm cursor-default select-none"
                style={{ fontFamily: font, minWidth: '200px' }}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-black text-sm`}
                  style={{ backgroundColor: isGold ? '#D4AF37' : '#3B5BFE' }}
                >
                  {provider.shortName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-[#1F3D2B] truncate">{provider.shortName}</p>
                  <p className="text-[10px] text-[#1F3D2B]/50 truncate">{provider.specialty}</p>
                </div>
                {/* المسافة */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span className="text-[10px] font-bold text-[#D4AF37]">{provider.distance}</span>
                </div>
                {/* أيقونات */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="w-6 h-6 rounded-lg bg-[#F5EEE1] flex items-center justify-center cursor-default" title="اتصال">
                    <Phone className="w-3 h-3 text-[#D4AF37]" />
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] flex items-center justify-center cursor-default text-[#25D366]" title="واتساب">
                    <WhatsAppIcon size={11} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}