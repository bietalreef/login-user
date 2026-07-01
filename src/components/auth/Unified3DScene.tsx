/**
 * Unified3DScene.tsx — مشهد 3D فخم موحّد
 * ─────────────────────────────────────────
 * دائرة واحدة كبيرة تعرض 11 داشبورد كروت ثلاثية الأبعاد
 * دوران بطيء تلقائي فقط — بدون سحب أو تكبير
 */

import { useState, useEffect, useRef } from 'react';
import {
  Building2, Layers, Paintbrush, Stethoscope, Scale,
  GraduationCap, ShoppingCart, Users, TrendingUp, Calendar,
  Wallet, Star, ShieldCheck, Sparkles, Cpu, Droplets,
} from 'lucide-react';
// ShoppingBag & BadgeCheck not available — using safe aliases
const ShoppingBag = ShoppingCart;
const BadgeCheck = ShieldCheck;
// FolderKanban & SprayCan not available
const FolderKanban = Layers;
const SprayCan = Droplets;
import { ImageWithFallback } from '../figma/ImageWithFallback';

// ═══════════════════════════════════════
// Dashboard Card Data
// ═══════════════════════════════════════
interface DashCardData {
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
  modules: string;
  modulesEn: string;
  premium?: boolean;
}

const DASHBOARD_CARDS: DashCardData[] = [
  {
    id: 'dash-real-estate',
    titleAr: 'العقارات',
    titleEn: 'Real Estate',
    subtitleAr: 'إدارة عقارات · مستأجرين · عقود',
    subtitleEn: 'Properties · Tenants · Leases',
    badge: '12', badgeColor: 'from-[#3B5BFE] to-[#5A78FF]',
    gradient: 'from-[#3B5BFE]/80 to-[#1E3A8A]/90',
    icon: Building2, iconColor: 'text-blue-200',
    image: 'https://images.unsplash.com/photo-1762536859942-8076505f7c62?w=400&h=260&fit=crop',
    modules: '12 وحدة', modulesEn: '12 Modules',
  },
  {
    id: 'dash-contracting',
    titleAr: 'المقاولات',
    titleEn: 'Contracting',
    subtitleAr: 'مشاريع · مناقصات · فرق عمل',
    subtitleEn: 'Projects · Bids · Teams',
    badge: '15', badgeColor: 'from-[#D4AF37] to-[#FFD700]',
    gradient: 'from-[#D4AF37]/80 to-[#8B6914]/90',
    icon: FolderKanban, iconColor: 'text-amber-200',
    image: 'https://images.unsplash.com/photo-1631171992385-784ae02b1acb?w=400&h=260&fit=crop',
    modules: '15 وحدة', modulesEn: '15 Modules',
    premium: true,
  },
  {
    id: 'dash-interior',
    titleAr: 'التصميم الداخلي',
    titleEn: 'Interior Design',
    subtitleAr: 'مشاريع تصميم · معارض · إلهام',
    subtitleEn: 'Design · Portfolios · Mood Boards',
    badge: '10', badgeColor: 'from-[#8B5CF6] to-[#A78BFA]',
    gradient: 'from-[#8B5CF6]/80 to-[#5B21B6]/90',
    icon: Paintbrush, iconColor: 'text-violet-200',
    image: 'https://images.unsplash.com/photo-1669387448840-610c588f003d?w=400&h=260&fit=crop',
    modules: '10 وحدات', modulesEn: '10 Modules',
  },
  {
    id: 'dash-healthcare',
    titleAr: 'الرعاية الصحية',
    titleEn: 'Healthcare',
    subtitleAr: 'مرضى · مواعيد · سجلات طبية',
    subtitleEn: 'Patients · Appointments · Records',
    badge: '14', badgeColor: 'from-[#8D6E63] to-[#A1887F]',
    gradient: 'from-[#8D6E63]/80 to-[#5D4037]/90',
    icon: Stethoscope, iconColor: 'text-orange-200',
    image: 'https://images.unsplash.com/photo-1769698678497-c41f0ab47c3e?w=400&h=260&fit=crop',
    modules: '14 وحدة', modulesEn: '14 Modules',
  },
  {
    id: 'dash-legal',
    titleAr: 'الخدمات القانونية',
    titleEn: 'Legal Services',
    subtitleAr: 'قضايا · عملاء · جلسات محكمة',
    subtitleEn: 'Cases · Clients · Court Dates',
    badge: '11', badgeColor: 'from-[#1E3A8A] to-[#3B82F6]',
    gradient: 'from-[#1E3A8A]/80 to-[#1E1B4B]/90',
    icon: Scale, iconColor: 'text-indigo-200',
    image: 'https://images.unsplash.com/photo-1659869764315-dc3d188141fe?w=400&h=260&fit=crop',
    modules: '11 وحدة', modulesEn: '11 Modules',
  },
  {
    id: 'dash-education',
    titleAr: 'التعليم',
    titleEn: 'Education',
    subtitleAr: 'طلاب · دورات · شهادات',
    subtitleEn: 'Students · Courses · Certificates',
    badge: '13', badgeColor: 'from-[#F59E0B] to-[#FBBF24]',
    gradient: 'from-[#F59E0B]/80 to-[#B45309]/90',
    icon: GraduationCap, iconColor: 'text-amber-100',
    image: 'https://images.unsplash.com/photo-1758270704524-596810e891b5?w=400&h=260&fit=crop',
    modules: '13 وحدة', modulesEn: '13 Modules',
  },
  {
    id: 'dash-retail',
    titleAr: 'التجزئة',
    titleEn: 'Retail',
    subtitleAr: 'مبيعات · مخزون · نقاط بيع',
    subtitleEn: 'Sales · Inventory · POS',
    badge: '12', badgeColor: 'from-[#EC4899] to-[#F472B6]',
    gradient: 'from-[#EC4899]/80 to-[#9D174D]/90',
    icon: ShoppingBag, iconColor: 'text-pink-200',
    image: 'https://images.unsplash.com/photo-1619496140817-ccc97b892d0b?w=400&h=260&fit=crop',
    modules: '12 وحدة', modulesEn: '12 Modules',
  },
  {
    id: 'dash-hr',
    titleAr: 'الموارد البشرية',
    titleEn: 'Human Resources',
    subtitleAr: 'موظفين · رواتب · إجازات',
    subtitleEn: 'Employees · Payroll · Leaves',
    badge: '14', badgeColor: 'from-[#06B6D4] to-[#22D3EE]',
    gradient: 'from-[#06B6D4]/80 to-[#0E7490]/90',
    icon: Users, iconColor: 'text-cyan-200',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=260&fit=crop',
    modules: '14 وحدة', modulesEn: '14 Modules',
  },
  {
    id: 'dash-marketing',
    titleAr: 'التسويق',
    titleEn: 'Marketing',
    subtitleAr: 'حملات · عملاء محتملين · تحليلات',
    subtitleEn: 'Campaigns · Leads · Analytics',
    badge: '13', badgeColor: 'from-[#EF4444] to-[#F87171]',
    gradient: 'from-[#EF4444]/80 to-[#991B1B]/90',
    icon: TrendingUp, iconColor: 'text-red-200',
    image: 'https://images.unsplash.com/photo-1686061594225-3e92c0cd51b0?w=400&h=260&fit=crop',
    modules: '13 وحدة', modulesEn: '13 Modules',
    premium: true,
  },
  {
    id: 'dash-events',
    titleAr: 'الفعاليات',
    titleEn: 'Events',
    subtitleAr: 'فعاليات · حجوزات · ضيوف',
    subtitleEn: 'Events · Bookings · Guests',
    badge: '10', badgeColor: 'from-[#8B5CF6] to-[#A78BFA]',
    gradient: 'from-[#7C3AED]/80 to-[#4C1D95]/90',
    icon: Calendar, iconColor: 'text-purple-200',
    image: 'https://images.unsplash.com/photo-1759477274012-263d469f0e16?w=400&h=260&fit=crop',
    modules: '10 وحدات', modulesEn: '10 Modules',
  },
  {
    id: 'dash-finance',
    titleAr: 'المالية',
    titleEn: 'Finance',
    subtitleAr: 'معاملات · تقارير · ميزانيات',
    subtitleEn: 'Transactions · Reports · Budgets',
    badge: '11', badgeColor: 'from-[#C8A86A] to-[#D4AF37]',
    gradient: 'from-[#C8A86A]/80 to-[#8B6914]/90',
    icon: Wallet, iconColor: 'text-yellow-200',
    image: 'https://images.unsplash.com/photo-1633158829875-e5316a358c6f?w=400&h=260&fit=crop',
    modules: '11 وحدة', modulesEn: '11 Modules',
  },
  {
    id: 'dash-cleaning',
    titleAr: 'شركات النظافة',
    titleEn: 'Cleaning Services',
    subtitleAr: 'عقود تنظيف · فرق · مواقع',
    subtitleEn: 'Contracts · Crews · Sites',
    badge: '12', badgeColor: 'from-[#0891B2] to-[#06B6D4]',
    gradient: 'from-[#0891B2]/80 to-[#0E7490]/90',
    icon: SprayCan, iconColor: 'text-cyan-200',
    image: 'https://images.unsplash.com/photo-1578329824171-ef7611e9a5ca?w=400&h=260&fit=crop',
    modules: '12 وحدة', modulesEn: '12 Modules',
  },
];

// ═══════════════════════════════════════
// Dashboard Card Component
// ═══════════════════════════════════════
function DashCard({ card, isEn }: { card: DashCardData; isEn: boolean }) {
  return (
    <div
      className="w-full h-full rounded-2xl overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
        backdropFilter: 'blur(12px)',
        border: card.premium
          ? '2px solid rgba(212,175,55,0.45)'
          : '1.5px solid rgba(255,255,255,0.22)',
        boxShadow: card.premium
          ? '0 8px 36px rgba(212,175,55,0.2), 0 2px 8px rgba(0,0,0,0.2)'
          : '0 8px 36px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.15)',
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

      {/* Premium top shine */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Premium crown badge */}
      {card.premium && (
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white rounded-full p-1 shadow-lg">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* Modules badge (top-right) */}
      <div className="absolute top-2 right-2 z-10">
        <span
          className={`bg-gradient-to-r ${card.badgeColor} text-white font-black shadow-lg flex items-center gap-1`}
          style={{
            fontSize: 9,
            padding: '3px 8px',
            borderRadius: 20,
            fontFamily: 'Cairo, sans-serif',
            letterSpacing: '0.02em',
          }}
        >
          <Cpu className="w-2.5 h-2.5" />
          {isEn ? card.modulesEn : card.modules}
        </span>
      </div>

      {/* AI badge */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-0.5 bg-black/30 backdrop-blur-sm text-white/90 px-2 py-0.5 rounded-full" style={{ fontSize: 8 }}>
          <Sparkles className="w-2 h-2 text-[#D4AF37]" />
          <span style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>AI</span>
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-3">
        {/* Dark content background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-b-2xl" />

        <div className="relative flex items-end gap-2.5">
          <div
            className="flex-shrink-0 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/15"
            style={{ width: 32, height: 32 }}
          >
            <card.icon className={`w-4.5 h-4.5 ${card.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h4
                className="text-white leading-tight truncate drop-shadow-lg"
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: '-0.01em',
                }}
              >
                {isEn ? card.titleEn : card.titleAr}
              </h4>
              <BadgeCheck
                className="flex-shrink-0 text-[#3B9EFF] drop-shadow-md"
                style={{ width: 14, height: 14 }}
                fill="#3B9EFF"
                stroke="white"
                strokeWidth={2.5}
              />
            </div>
            <p
              className="text-white/80 truncate"
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 600,
                fontSize: 10,
              }}
            >
              {isEn ? card.subtitleEn : card.subtitleAr}
            </p>
          </div>
        </div>

        {/* Star rating row */}
        <div className="relative flex items-center gap-0.5 mt-1.5 mr-10">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-2.5 h-2.5 text-amber-400 fill-amber-400"
            />
          ))}
          <span
            className="text-white/70 font-bold mr-1"
            style={{ fontSize: 9, fontFamily: 'Cairo, sans-serif' }}
          >
            5.0
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Main Unified 3D Scene — Slow Auto-Rotate Only
// ═══════════════════════════════════════
interface Unified3DSceneProps {
  isEn?: boolean;
}

export function Unified3DScene({ isEn = false }: Unified3DSceneProps) {
  const [rotation, setRotation] = useState(0);
  const animRef = useRef<number>(0);

  const tiltX = -3; // Almost upright — slight 3D perspective only
  const angleStep = 360 / DASHBOARD_CARDS.length;

  // ─── Slow auto-rotation only ───
  useEffect(() => {
    let lastTime = performance.now();
    const speed = 0.008; // Slower speed for stability

    function animate(now: number) {
      const dt = now - lastTime;
      setRotation(prev => (prev + speed * dt) % 360);
      lastTime = now;
      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      className="relative w-full select-none"
      style={{
        height: 280,
        perspective: '900px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/8 rounded-full blur-[120px]" />
        <div className="absolute top-[55%] left-1/3 w-56 h-56 bg-[#3B5BFE]/8 rounded-full blur-[90px]" />
        <div className="absolute top-[20%] right-1/4 w-40 h-40 bg-[#8B5CF6]/6 rounded-full blur-[70px]" />
      </div>

      {/* ═══ 3D Scene Container — fixed tilt, no drag ═══ */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateX(-50%) translateY(-50%) rotateX(${tiltX}deg)`,
          width: 0,
          height: 0,
        }}
      >
        {/* ─── Single Dashboard Ring ─── */}
        <div
          style={{
            position: 'absolute',
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`,
            width: 0, height: 0,
          }}
        >
          {DASHBOARD_CARDS.map((card, i) => {
            const angle = angleStep * i;
            const radius = 320;
            return (
              <div
                key={card.id}
                className="absolute"
                style={{
                  width: 190,
                  height: 130,
                  left: -95,
                  top: -65,
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <DashCard card={card} isEn={isEn} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F5EEE1] dark:from-[#0B1120] to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#F5EEE1] dark:from-[#0B1120] to-transparent z-20 pointer-events-none" />

      {/* Center label */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div
          className="flex items-center gap-2 bg-white/60 dark:bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#E6DCC8]/60 dark:border-white/10"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.7)]" />
          <span
            className="text-[#1F3D2B]/50 dark:text-white/50 text-[9px]"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}
          >
            {isEn ? 'Dashboards designed to fit your business' : 'داشبورد صُممت خصيصاً لتناسب أعمالك'}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#3B5BFE] shadow-[0_0_6px_rgba(59,91,254,0.7)]" />
        </div>
      </div>
    </div>
  );
}