/**
 * ServicesCylinder.tsx — كاروسيل خدمات بيت الريف
 * ─────────────────────────────────────────────────
 * أسطوانة 3D دوّارة بنفس تصميم HeroCylinder
 * لكن بكروت خدمات بيت الريف التسعة
 */

import { useState, useEffect, useRef } from 'react';
import { 
  HardHat, Compass, Wrench, Users, Hammer, Truck, 
  Package, Sofa, SparklesIcon, Star
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// ─── Service Card Type ───
interface ServiceCard {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  badge: string;
  badgeColor: string;
  gradient: string;
  icon: React.ElementType;
  iconColor: string;
  image: string;
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    id: 'srv-1',
    titleAr: 'مقاولات البناء',
    titleEn: 'Construction',
    subtitleAr: 'بناء فلل ومنازل',
    subtitleEn: 'Villas & Homes',
    badge: '🏗️',
    badgeColor: 'from-amber-500 to-orange-600',
    gradient: 'from-amber-700/80 to-orange-900/80',
    icon: HardHat,
    iconColor: 'text-amber-200',
    image: 'https://images.unsplash.com/photo-1640184713822-174b6e94df51?w=300&h=200&fit=crop',
  },
  {
    id: 'srv-2',
    titleAr: 'الاستشارات الهندسية',
    titleEn: 'Engineering',
    subtitleAr: 'تصاميم ومخططات',
    subtitleEn: 'Designs & Plans',
    badge: '📐',
    badgeColor: 'from-blue-500 to-indigo-600',
    gradient: 'from-blue-700/80 to-indigo-900/80',
    icon: Compass,
    iconColor: 'text-blue-200',
    image: 'https://images.unsplash.com/photo-1762146828422-50a8bd416d3c?w=300&h=200&fit=crop',
  },
  {
    id: 'srv-3',
    titleAr: 'شركات الصيانة',
    titleEn: 'Maintenance',
    subtitleAr: 'صيانة دورية وطوارئ',
    subtitleEn: 'Regular & Emergency',
    badge: '🔧',
    badgeColor: 'from-emerald-500 to-teal-600',
    gradient: 'from-emerald-700/80 to-teal-900/80',
    icon: Wrench,
    iconColor: 'text-emerald-200',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&h=200&fit=crop',
  },
  {
    id: 'srv-4',
    titleAr: 'العمالة الحرفية',
    titleEn: 'Craftsmen',
    subtitleAr: 'معلمين وحرفيين',
    subtitleEn: 'Skilled Workers',
    badge: '👷',
    badgeColor: 'from-yellow-500 to-amber-600',
    gradient: 'from-stone-600/80 to-stone-800/80',
    icon: Users,
    iconColor: 'text-yellow-200',
    image: 'https://images.unsplash.com/photo-1766499431068-7686d755cec7?w=300&h=200&fit=crop',
  },
  {
    id: 'srv-5',
    titleAr: 'الورش',
    titleEn: 'Workshops',
    subtitleAr: 'حدادة ونجارة وألمنيوم',
    subtitleEn: 'Metal, Wood & More',
    badge: '🔨',
    badgeColor: 'from-red-500 to-rose-600',
    gradient: 'from-red-700/80 to-rose-900/80',
    icon: Hammer,
    iconColor: 'text-red-200',
    image: 'https://images.unsplash.com/photo-1673201159941-68fcdbbb4fa1?w=300&h=200&fit=crop',
  },
  {
    id: 'srv-6',
    titleAr: 'تأجير المعدات',
    titleEn: 'Equipment Rental',
    subtitleAr: 'رافعات وحفارات',
    subtitleEn: 'Cranes & Excavators',
    badge: '🚜',
    badgeColor: 'from-orange-500 to-amber-600',
    gradient: 'from-orange-700/80 to-amber-900/80',
    icon: Truck,
    iconColor: 'text-orange-200',
    image: 'https://images.unsplash.com/photo-1674558064214-a40da6370277?w=300&h=200&fit=crop',
  },
  {
    id: 'srv-7',
    titleAr: 'محلات مواد البناء',
    titleEn: 'Building Materials',
    subtitleAr: 'إسمنت وطوب وحديد',
    subtitleEn: 'Cement, Bricks & Steel',
    badge: '🧱',
    badgeColor: 'from-rose-500 to-red-600',
    gradient: 'from-slate-600/80 to-slate-800/80',
    icon: Package,
    iconColor: 'text-rose-200',
    image: 'https://images.unsplash.com/photo-1705214289208-ec900f8d8d35?w=300&h=200&fit=crop',
  },
  {
    id: 'srv-8',
    titleAr: 'محلات الأثاث',
    titleEn: 'Furniture Stores',
    subtitleAr: 'أثاث عصري وكلاسيكي',
    subtitleEn: 'Modern & Classic',
    badge: '🪑',
    badgeColor: 'from-violet-500 to-purple-600',
    gradient: 'from-violet-700/80 to-purple-900/80',
    icon: Sofa,
    iconColor: 'text-violet-200',
    image: 'https://images.unsplash.com/photo-1762803841422-5b8cf8767cd9?w=300&h=200&fit=crop',
  },
  {
    id: 'srv-9',
    titleAr: 'خدمات النظافة',
    titleEn: 'Cleaning Services',
    subtitleAr: 'تنظيف شامل واحترافي',
    subtitleEn: 'Professional Cleaning',
    badge: '🧹',
    badgeColor: 'from-sky-500 to-cyan-600',
    gradient: 'from-sky-600/80 to-cyan-800/80',
    icon: SparklesIcon,
    iconColor: 'text-sky-200',
    image: 'https://images.unsplash.com/photo-1581578949510-fa7315c4c350?w=300&h=200&fit=crop',
  },
];

interface ServicesCylinderProps {
  isEn?: boolean;
}

export function ServicesCylinder({ isEn = false }: ServicesCylinderProps) {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startRotation: 0 });
  const animRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const N = SERVICE_CARDS.length;
  const angleStep = 360 / N;

  // ─── Auto-rotation (opposite direction from HeroCylinder) ───
  useEffect(() => {
    let lastTime = performance.now();
    const speed = 0.018; // slightly different speed for visual variety

    function animate(now: number) {
      if (!isPaused && !isDragging) {
        const dt = now - lastTime;
        setRotation(prev => (prev - speed * dt) % 360); // reverse direction
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
    setRotation(dragRef.current.startRotation + dx * 0.3);
  };

  const handleDragEnd = () => setIsDragging(false);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: 170, perspective: '1000px', perspectiveOrigin: '50% 50%' }}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
    >
      {/* Ambient glow — warm golden for services */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-[#D4AF37]/12 rounded-full blur-[80px]" />
        <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-[#2AA676]/10 rounded-full blur-[60px]" />
      </div>

      {/* 3D Cylinder */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateX(-50%) translateY(-50%) rotateX(-6deg) rotateY(${rotation}deg)`,
          width: 0,
          height: 0,
        }}
      >
        {SERVICE_CARDS.map((card, i) => {
          const angle = angleStep * i;
          const radius = 220;

          return (
            <div
              key={card.id}
              className="absolute"
              style={{
                width: 140,
                height: 90,
                left: -70,
                top: -45,
                transformStyle: 'preserve-3d',
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                backfaceVisibility: 'hidden',
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <ServiceCardView card={card} isEn={isEn} />
            </div>
          );
        })}
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F5EEE1] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#F5EEE1] to-transparent z-10 pointer-events-none" />
    </div>
  );
}

// ─── Individual Service Card ───
function ServiceCardView({ card, isEn }: { card: ServiceCard; isEn: boolean }) {
  return (
    <div
      className="w-full h-full rounded-xl overflow-hidden relative cursor-pointer group shadow-xl"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.18)',
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={card.image}
          alt={card.titleAr}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient}`} />
      </div>

      {/* Badge */}
      <div className="absolute top-1.5 right-1.5 z-10">
        <span
          className={`bg-gradient-to-r ${card.badgeColor} text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg`}
        >
          {card.badge}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
        <div className="flex items-end gap-1.5">
          <div className="flex-shrink-0 w-5.5 h-5.5 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center" style={{ width: 22, height: 22 }}>
            <card.icon className={`w-3 h-3 ${card.iconColor}`} />
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
      </div>

      {/* Shine hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
        }}
      />
    </div>
  );
}