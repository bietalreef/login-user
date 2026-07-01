/**
 * ShopScreen.tsx — المتجر
 * نفس نمط DashboardScreen — المستخدم يضغط فيُسند المهمة لوياك مباشرة في الشات
 */

import { useNavigate } from 'react-router@7.1.1';
import {
  ShoppingCart,
  Cpu,
  ArrowLeft,
  Store,
  Sparkles,
  ClipboardList,
  Tag,
} from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../utils/UserContext';
import { motion } from 'motion/react';

const font = 'Cairo, Tajawal, sans-serif';

function buildTask(isEn: boolean, userName: string, userId: string): string {
  const identifier =
    userName && userName !== 'Guest User' && userName !== 'مستخدم زائر'
      ? userName
      : userId;

  if (isEn) {
    return `Hi Weyaak, I'm ${identifier} — I want to create a professional online store for my construction and contracting business. Please help me design the store, set up products, pricing, and marketing.`;
  }
  return `مرحباً وياك، أنا ${identifier} — أريد إنشاء متجر إلكتروني احترافي لنشاطي في قطاع البناء والمقاولات. ساعدني في تصميم المتجر وإعداد المنتجات والتسعير والتسويق.`;
}

export function ShopScreen() {
  const navigate = useNavigate();
  const { language } = useTranslation('common');
  const { isDark } = useTheme();
  const { profile } = useUser();
  const isEn = language === 'en';

  const userName = profile?.full_name || (isEn ? 'Guest User' : 'مستخدم زائر');
  const userId = profile?.display_id || profile?.id?.slice(0, 8) || 'BR-?????';
  const task = buildTask(isEn, userName, userId);

  const handleAssignTask = () => {
    try {
      sessionStorage.setItem(
        'weyaak_initial_task',
        JSON.stringify({ initialTask: task, taskType: 'create_store' })
      );
    } catch { /* silent */ }
    navigate('/agents');
  };

  const features = isEn
    ? [
        { icon: Store,         label: 'Custom Store Design' },
        { icon: ClipboardList, label: 'Product Catalog & Pricing' },
        { icon: Tag,           label: 'Promotions & Discounts' },
        { icon: Sparkles,      label: 'AI-Powered Marketing' },
      ]
    : [
        { icon: Store,         label: 'تصميم متجر مخصص' },
        { icon: ClipboardList, label: 'كتالوج المنتجات والتسعير' },
        { icon: Tag,           label: 'العروض والتخفيضات' },
        { icon: Sparkles,      label: 'تسويق مدعوم بالذكاء الاصطناعي' },
      ];

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-12 ${
        isDark ? 'bg-[var(--bait-bg)]' : 'bg-gradient-to-b from-[#F5EEE1] to-white'
      }`}
      dir={isEn ? 'ltr' : 'rtl'}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative inline-flex">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #C8A86A 100%)',
                boxShadow: '0 12px 40px rgba(212,175,55,0.30)',
              }}
            >
              <ShoppingCart className="w-12 h-12 text-white" />
            </div>
            {/* Weyaak badge */}
            <div
              className="absolute -bottom-2 -left-2 w-10 h-10 rounded-2xl flex items-center justify-center border-2 border-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #3B5BFE 0%, #5A78FF 100%)' }}
            >
              <Cpu className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1
          className={`text-2xl font-black mb-3 text-center ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`}
          style={{ fontFamily: font }}
        >
          {isEn ? 'Build Your Store with Weyaak' : 'أنشئ متجرك مع وياك'}
        </h1>

        {/* Subtitle */}
        <p
          className={`text-sm leading-relaxed mb-6 text-center ${isDark ? 'text-white/50' : 'text-[#5D4037]/60'}`}
          style={{ fontFamily: font }}
        >
          {isEn
            ? 'Weyaak AI agent will build your store tailored to your business. Click below to assign the task.'
            : 'وكيل وياك الذكي سيبني متجرك الخاص وفق نشاطك التجاري. اضغط أدناه لإسناد المهمة.'}
        </p>

        {/* User identifier pill */}
        <div
          className={`flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full mx-auto w-fit ${
            isDark ? 'bg-white/5 border border-white/10' : 'bg-[#FFF8E7] border border-[#D4AF37]/30'
          }`}
        >
          <span
            className={`text-xs font-bold ${isDark ? 'text-[#D4AF37]' : 'text-[#B8942A]'}`}
            style={{ fontFamily: font }}
          >
            {isEn ? 'For:' : 'لـ:'}
          </span>
          <span
            className={`text-xs font-black ${isDark ? 'text-white/80' : 'text-[#1F3D2B]'}`}
            style={{ fontFamily: font }}
          >
            {userName}
          </span>
          {profile?.display_id && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isDark ? 'bg-white/10 text-white/40' : 'bg-[#D4AF37]/10 text-[#B8942A]/70'
              }`}
            >
              {profile.display_id}
            </span>
          )}
        </div>

        {/* Features list */}
        <div className="space-y-2 mb-8">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${
                isDark ? 'bg-white/5' : 'bg-white/80 border border-[#F5EEE1]'
              }`}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(212,175,55,0.15)' }}
              >
                <Icon className="w-4 h-4" style={{ color: '#D4AF37' }} />
              </div>
              <span
                className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-[#5D4037]'}`}
                style={{ fontFamily: font }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Task Preview Box */}
        <div
          className={`rounded-2xl px-4 py-3 mb-6 border-2 border-dashed ${
            isDark ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5' : 'border-[#D4AF37]/40 bg-[#FEFAF0]'
          }`}
        >
          <p
            className={`text-xs font-bold mb-1 ${isDark ? 'text-[#D4AF37]' : 'text-[#B8942A]'}`}
            style={{ fontFamily: font }}
          >
            {isEn ? 'Task to be assigned to Weyaak:' : 'المهمة التي ستُسند لوياك:'}
          </p>
          <p
            className={`text-xs leading-relaxed ${isDark ? 'text-white/50' : 'text-[#5D4037]/60'}`}
            style={{ fontFamily: font }}
          >
            {task}
          </p>
        </div>

        {/* Main CTA button */}
        <motion.button
          onClick={handleAssignTask}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-3 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #3B5BFE 0%, #5A78FF 100%)',
            boxShadow: '0 8px 32px rgba(59,91,254,0.30)',
            fontFamily: font,
          }}
        >
          <Cpu className="w-5 h-5" />
          {isEn ? 'Assign Task to Weyaak' : 'أسند المهمة لوياك'}
          <ArrowLeft className={`w-4 h-4 ${isEn ? 'rotate-180' : ''}`} />
        </motion.button>

        <p
          className={`text-xs mt-4 text-center ${isDark ? 'text-white/25' : 'text-[#5D4037]/30'}`}
          style={{ fontFamily: font }}
        >
          {isEn
            ? 'Weyaak will open with your task pre-filled and sent automatically'
            : 'سيفتح وياك وسترسل المهمة تلقائياً في شات الدردشة'}
        </p>
      </motion.div>
    </div>
  );
}
