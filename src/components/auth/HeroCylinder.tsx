import { useState, useEffect, useRef } from 'react';
import { Star, Wrench, Zap, Droplets, Paintbrush, Wind, Award, TrendingUp, Heart, Cpu, Home, Users } from 'lucide-react';
// Bot & Crown not available — using safe aliases
const Bot = Cpu;
const Crown = Award;
import { ImageWithFallback } from '../figma/ImageWithFallback';

// ─── Figma Assets ───
const mascotImg = "/assets/mascot.png";
const logoImg = "/assets/logo.png";
const meetingImg = "/assets/meeting.png";

// ─── Card Data ───
interface CylinderCard {
  id: string;
  type: 'offer' | 'featured';
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  badge?: string;
  badgeColor?: string;
  gradient: string;
  icon: React.ElementType;
  iconColor: string;
  image?: string;
  rating?: number;
}

const CYLINDER_CARDS: CylinderCard[] = [
  {
    id: 'o1', type: 'offer',
    titleAr: 'خصم 30% سباكة', titleEn: '30% Off Plumbing',
    subtitleAr: 'لفترة محدودة', subtitleEn: 'Limited Time',
    badge: '30%', badgeColor: 'from-red-500 to-orange-500',
    gradient: 'from-emerald-500/90 to-teal-700/90',
    icon: Droplets, iconColor: 'text-cyan-200',
    image: 'https://images.unsplash.com/photo-1604118600242-e7a6d23ec3a9?w=300&h=200&fit=crop',
  },
  {
    id: 'f1', type: 'featured',
    titleAr: 'أحمد المهيري', titleEn: 'Ahmed Al Maheeri',
    subtitleAr: 'كهربائي معتمد', subtitleEn: 'Certified Electrician',
    badge: '⭐ 4.9', badgeColor: 'from-amber-400 to-yellow-500',
    gradient: 'from-blue-600/90 to-indigo-800/90',
    icon: Zap, iconColor: 'text-yellow-300',
    image: 'https://images.unsplash.com/photo-1583954964358-1bd7215b6f7a?w=300&h=200&fit=crop',
    rating: 4.9,
  },
  {
    id: 'o2', type: 'offer',
    titleAr: 'عرض الصيانة الشاملة', titleEn: 'Full Maintenance Deal',
    subtitleAr: 'وفّر 500 د.إ', subtitleEn: 'Save 500 AED',
    badge: '🔥', badgeColor: 'from-orange-500 to-red-600',
    gradient: 'from-violet-600/90 to-purple-800/90',
    icon: Wrench, iconColor: 'text-purple-200',
    image: 'https://images.unsplash.com/photo-1765277789186-04b71a9afd40?w=300&h=200&fit=crop',
  },
  {
    id: 'f2', type: 'featured',
    titleAr: 'خالد الحمادي', titleEn: 'Khaled Al Hammadi',
    subtitleAr: 'مقاول بناء', subtitleEn: 'Building Contractor',
    badge: '⭐ 4.8', badgeColor: 'from-amber-400 to-yellow-500',
    gradient: 'from-emerald-600/90 to-green-800/90',
    icon: Award, iconColor: 'text-amber-300',
    image: 'https://images.unsplash.com/photo-1758876734777-dcc6981f3671?w=300&h=200&fit=crop',
    rating: 4.8,
  },
  {
    id: 'o3', type: 'offer',
    titleAr: 'دهان + تنظيف مجاناً', titleEn: 'Paint + Free Cleaning',
    subtitleAr: 'باقة متكاملة', subtitleEn: 'Complete Package',
    badge: 'مجاني', badgeColor: 'from-green-500 to-emerald-600',
    gradient: 'from-rose-500/90 to-pink-700/90',
    icon: Paintbrush, iconColor: 'text-pink-200',
    image: 'https://images.unsplash.com/photo-1688372199140-cade7ae820fe?w=300&h=200&fit=crop',
  },
  {
    id: 'f3', type: 'featured',
    titleAr: 'محمد السويدي', titleEn: 'Mohamed Al Suwaidi',
    subtitleAr: 'فني تكييف', subtitleEn: 'AC Technician',
    badge: '⭐ 5.0', badgeColor: 'from-amber-400 to-yellow-500',
    gradient: 'from-sky-500/90 to-blue-700/90',
    icon: Wind, iconColor: 'text-sky-200',
    image: 'https://images.unsplash.com/photo-1761642119720-1ce47b16d09b?w=300&h=200&fit=crop',
    rating: 5.0,
  },
  {
    id: 'o4', type: 'offer',
    titleAr: 'تمديدات كهرباء', titleEn: 'Electrical Wiring',
    subtitleAr: 'خصم أول طلب', subtitleEn: 'First Order Discount',
    badge: '25%', badgeColor: 'from-yellow-500 to-amber-600',
    gradient: 'from-amber-500/90 to-orange-700/90',
    icon: Zap, iconColor: 'text-yellow-200',
  },
  {
    id: 'f4', type: 'featured',
    titleAr: 'سعيد الكعبي', titleEn: 'Saeed Al Kaabi',
    subtitleAr: 'سباك محترف', subtitleEn: 'Professional Plumber',
    badge: '⭐ 4.7', badgeColor: 'from-amber-400 to-yellow-500',
    gradient: 'from-teal-500/90 to-cyan-700/90',
    icon: Crown, iconColor: 'text-yellow-300',
    rating: 4.7,
  },
  {
    id: 'o5', type: 'offer',
    titleAr: 'باقة المنزل الذكي', titleEn: 'Smart Home Package',
    subtitleAr: 'تقنية + توفير', subtitleEn: 'Tech + Savings',
    badge: '🏠', badgeColor: 'from-indigo-500 to-violet-600',
    gradient: 'from-indigo-500/90 to-violet-800/90',
    icon: TrendingUp, iconColor: 'text-indigo-200',
  },
  {
    id: 'f5', type: 'featured',
    titleAr: 'راشد المنصوري', titleEn: 'Rashed Al Mansouri',
    subtitleAr: 'مصمم داخلي', subtitleEn: 'Interior Designer',
    badge: '⭐ 4.9', badgeColor: 'from-amber-400 to-yellow-500',
    gradient: 'from-fuchsia-500/90 to-pink-700/90',
    icon: Heart, iconColor: 'text-pink-200',
    rating: 4.9,
  },
  // ─── Figma Asset Cards ───
  {
    id: 'br1', type: 'featured',
    titleAr: 'وياك — مساعدك الذكي', titleEn: 'Weyak — Smart Assistant',
    subtitleAr: 'خدمات ذكية بلمسة', subtitleEn: 'Smart Services at Hand',
    badge: '🤖 AI', badgeColor: 'from-emerald-500 to-teal-600',
    gradient: 'from-emerald-600/60 to-teal-800/60',
    icon: Bot, iconColor: 'text-emerald-200',
    image: mascotImg,
  },
  {
    id: 'br2', type: 'offer',
    titleAr: 'بيت الريف', titleEn: 'Biet Al Reef',
    subtitleAr: 'منصتك الرقمية الذكية', subtitleEn: 'Your Smart Platform',
    badge: '🏡', badgeColor: 'from-green-600 to-emerald-700',
    gradient: 'from-white/70 to-gray-200/70',
    icon: Home, iconColor: 'text-green-800',
    image: logoImg,
  },
  {
    id: 'br3', type: 'featured',
    titleAr: 'غرفة الاجتماعات', titleEn: 'Meeting Room',
    subtitleAr: 'مجتمع بيت الريف', subtitleEn: 'Community Hub',
    badge: '🎙️ Live', badgeColor: 'from-purple-500 to-indigo-600',
    gradient: 'from-amber-700/70 to-yellow-900/70',
    icon: Users, iconColor: 'text-amber-200',
    image: meetingImg,
  },
];

interface HeroCylinderProps {
  isEn?: boolean;
}

export function HeroCylinder({ isEn = false }: HeroCylinderProps) {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startRotation: 0 });
  const animRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const N = CYLINDER_CARDS.length;
  const angleStep = 360 / N;

  // ─── Auto-rotation ───
  useEffect(() => {
    let lastTime = performance.now();
    const speed = 0.015; // degrees per ms

    function animate(now: number) {
      if (!isPaused && !isDragging) {
        const dt = now - lastTime;
        setRotation(prev => (prev + speed * dt) % 360);
      }
      lastTime = now;
      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPaused, isDragging]);

  // ─── Touch/Mouse drag ───
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    dragRef.current = { startX: clientX, startRotation: rotation };
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const dx = clientX - dragRef.current.startX;
    // Invert for RTL feel
    setRotation(dragRef.current.startRotation - dx * 0.3);
  };

  const handleDragEnd = () => setIsDragging(false);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: 200, perspective: '1000px', perspectiveOrigin: '50% 50%' }}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2AA676]/15 rounded-full blur-[80px]" />
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-[60px]" />
      </div>

      {/* 3D Cylinder */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateX(-50%) translateY(-50%) rotateX(-8deg) rotateY(${rotation}deg)`,
          width: 0,
          height: 0,
        }}
      >
        {CYLINDER_CARDS.map((card, i) => {
          const angle = angleStep * i;
          const radius = 240;

          return (
            <div
              key={card.id}
              className="absolute"
              style={{
                width: 150,
                height: 100,
                left: -75,
                top: -50,
                transformStyle: 'preserve-3d',
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                backfaceVisibility: 'hidden',
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <CylinderCardView card={card} isEn={isEn} />
            </div>
          );
        })}
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#1F3D2B] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#1F3D2B] to-transparent z-10 pointer-events-none" />
    </div>
  );
}

// ─── Individual Card ───
function CylinderCardView({ card, isEn }: { card: CylinderCard; isEn: boolean }) {
  return (
    <div
      className={`w-full h-full rounded-xl overflow-hidden relative cursor-pointer group shadow-xl`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.18)',
      }}
    >
      {/* Background image */}
      {card.image && (
        <div className="absolute inset-0">
          <ImageWithFallback
            src={card.image}
            alt={card.titleAr}
            className="w-full h-full object-cover pointer-events-auto"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient}`} />
        </div>
      )}

      {/* No-image fallback */}
      {!card.image && (
        <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
      )}

      {/* Badge */}
      {card.badge && (
        <div className="absolute top-1.5 right-1.5 z-10">
          <span
            className={`bg-gradient-to-r ${card.badgeColor} text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg`}
          >
            {card.badge}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
        <div className="flex items-end gap-1.5">
          <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <card.icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white text-[9px] font-black leading-tight truncate drop-shadow-md">
              {isEn ? card.titleEn : card.titleAr}
            </h4>
            <p className="text-white/70 text-[7px] font-medium truncate">
              {isEn ? card.subtitleEn : card.subtitleAr}
            </p>
          </div>
        </div>

        {/* Rating stars for featured */}
        {card.type === 'featured' && card.rating && (
          <div className="flex items-center gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-2 h-2 ${i < Math.floor(card.rating!) ? 'text-amber-400 fill-amber-400' : 'text-white/30'}`}
              />
            ))}
            <span className="text-white/60 text-[7px] font-bold mr-1">{card.rating}</span>
          </div>
        )}
      </div>

      {/* Shine effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
        }}
      />
    </div>
  );
}