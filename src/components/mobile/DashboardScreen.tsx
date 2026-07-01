/**
 * DashboardScreen.tsx — لوحة التحكم
 * المستخدم يختار بنفسه إسناد مهمة بناء لوحة التحكم لوكيل وياك
 * المهمة تحمل اسم المستخدم أو display_id لتشخيص الطلب
 */

import { useNavigate } from 'react-router@7.1.1';
import {
  LayoutDashboard,
  Cpu,
  ArrowLeft,
  BarChart2,
  Users,
  FolderKanban,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../utils/UserContext';
import { motion } from 'motion/react';

const font = 'Cairo, Tajawal, sans-serif';

function buildTask(isEn: boolean, userName: string, userId: string): string {
  const identifier = userName && userName !== 'Guest User' && userName !== 'مستخدم زائر'
    ? userName
    : userId;

  if (isEn) {
    return `Hi Weyaak, I'm ${identifier} — I want to build a professional control dashboard for my construction and contracting business. Please help me set up: project tracking, expenses management, team management, and key performance indicators (KPIs).`;
  }
  return `مرحباً وياك، أنا ${identifier} — أريد بناء لوحة تحكم داشبورد احترافية لنشاطي في قطاع البناء والمقاولات. ساعدني في إعداد: متابعة المشاريع، إدارة المصروفات، إدارة الفريق، ومؤشرات الأداء الرئيسية (KPIs).`;
}

export function DashboardScreen() {
  const navigate = useNavigate();
  const { language } = useTranslation('common');
  const { isDark } = useTheme();
  const { profile } = useUser();
  const isEn = language === 'en';

  const userName = profile?.full_name || (isEn ? 'Guest User' : 'مستخدم زائر');
  const userId = profile?.display_id || profile?.id?.slice(0, 8) || 'BR-?????';
  const task = buildTask(isEn, userName, userId);

  const handleAssignTask = () => {
    // وياك يعيش في /home — ننقل المهمة عبر sessionStorage
    try {
      sessionStorage.setItem('weyaak_initial_task', JSON.stringify({
        initialTask: task,
        taskType: 'create_dashboard',
      }));
    } catch { /* silent */ }
    navigate('/agents');
  };

  const features = isEn
    ? [
        { icon: FolderKanban,  label: 'Project Tracking' },
        { icon: BarChart2,     label: 'Expenses & Budget' },
        { icon: Users,         label: 'Team Management' },
        { icon: TrendingUp,    label: 'KPIs & Analytics' },
      ]
    : [
        { icon: FolderKanban,  label: 'متابعة المشاريع' },
        { icon: BarChart2,     label: 'المصروفات والميزانية' },
        { icon: Users,         label: 'إدارة الفريق' },
        { icon: TrendingUp,    label: 'مؤشرات الأداء والتحليلات' },
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
                background: 'linear-gradient(135deg, #3B5BFE 0%, #5A78FF 100%)',
                boxShadow: '0 12px 40px rgba(59,91,254,0.30)',
              }}
            >
              <LayoutDashboard className="w-12 h-12 text-white" />
            </div>
            {/* Weyaak badge */}
            <div
              className="absolute -bottom-2 -left-2 w-10 h-10 rounded-2xl flex items-center justify-center border-2 border-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #C8A86A 100%)' }}
            >
              <Cpu className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1
          className={`text-2xl font-black mb-3 text-center ${isDark ? 'text-white' : 'text-[#1A2744]'}`}
          style={{ fontFamily: font }}
        >
          {isEn ? 'Build Your Dashboard with Weyaak' : 'أنشئ لوحة تحكمك مع وياك'}
        </h1>

        {/* Subtitle */}
        <p
          className={`text-sm leading-relaxed mb-6 text-center ${isDark ? 'text-white/50' : 'text-[#5D4037]/60'}`}
          style={{ fontFamily: font }}
        >
          {isEn
            ? 'Weyaak AI agent will build your custom control dashboard. Press below to assign the task.'
            : 'وكيل وياك الذكي سيبني لوحة تحكمك الخاصة وفق نشاطك التجاري. اضغط أدناه لإسناد المهمة.'}
        </p>

        {/* User identifier pill */}
        <div
          className={`flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full mx-auto w-fit ${
            isDark ? 'bg-white/5 border border-white/10' : 'bg-[#EEF2FF] border border-[#3B5BFE]/20'
          }`}
        >
          <span
            className={`text-xs font-bold ${isDark ? 'text-[#5A78FF]' : 'text-[#3B5BFE]'}`}
            style={{ fontFamily: font }}
          >
            {isEn ? 'For:' : 'لـ:'}
          </span>
          <span
            className={`text-xs font-black ${isDark ? 'text-white/80' : 'text-[#1A2744]'}`}
            style={{ fontFamily: font }}
          >
            {userName}
          </span>
          {profile?.display_id && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isDark ? 'bg-white/10 text-white/40' : 'bg-[#3B5BFE]/10 text-[#3B5BFE]/60'
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
                style={{ background: 'rgba(59,91,254,0.10)' }}
              >
                <Icon className="w-4 h-4" style={{ color: '#3B5BFE' }} />
              </div>
              <span
                className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-[#1A2744]'}`}
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
            ? 'Weyaak will open with your task pre-filled'
            : 'سيفتح وياك مع المهمة جاهزة للإرسال'}
        </p>
      </motion.div>
    </div>
  );
}
