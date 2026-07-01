/**
 * WayakAgents.tsx — وكلاء وياك الذكيون
 * ═══════════════════════════════════════
 * 1. وكيل مدير حسابات (Account Manager Agent)
 * 2. وكيل تحسين SEO (SEO Optimization Agent)
 * 3. وكيل السوشيال ميديا (Social Media Agent)
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOptionalTaskContext, type Task, type BusinessProfile } from '../../contexts/TaskContext';
import {
  Users, UserCheck, UserPlus, TrendingUp, TrendingDown,
  BarChart3, PieChart, Activity, Star, Eye,
  Search, Globe, FileText, Link, Code2,
  Share2, Camera, Hash, Heart, MessageSquare,
  Calendar, CalendarDays, Clock, Send, Sparkles,
  Target, Zap, Award, Shield,
  CheckCircle, AlertCircle, ArrowUp, ArrowDown,
  Loader2, Filter, RefreshCw, Settings,
  Briefcase, DollarSign, Phone, Mail,
  ChevronLeft, ChevronDown, Layers, BookOpen,
  type LucideIcon,
} from 'lucide-react';
// Crown not available in this lucide version — using Award as alias
const Crown = Award;

const seoInfographic = '/assets/seo-infographic.png';

// ═══════════════════════════════════════
// Shared Design Tokens
// ═══════════════════════════════════════
const fontCairo = "'Cairo', 'Tajawal', system-ui, sans-serif";
const fontMono  = "'JetBrains Mono', 'Fira Code', monospace";

const C = {
  bg:       '#0B1120',
  surface:  '#1E293B',
  border:   'rgba(255,255,255,0.12)',
  borderHi: 'rgba(255,255,255,0.18)',
  text:     '#F1F5F9',
  textDim:  '#94A3B8',
  textMut:  'rgba(255,255,255,0.35)',
  gold:     '#D4AF37',
  goldSoft: 'rgba(212,175,55,0.15)',
  blue:     '#3B5BFE',
  blueSoft: 'rgba(59,91,254,0.15)',
  purple:   '#9B51E0',
  purpleSoft: 'rgba(155,81,224,0.15)',
  orange:   '#E67E22',
  orangeSoft: 'rgba(230,126,34,0.15)',
  red:      '#EF4444',
  redSoft:  'rgba(239,68,68,0.15)',
  pink:     '#E91E63',
  pinkSoft: 'rgba(233,30,99,0.15)',
};

// ── Shared UI Components ──
function StatCard({ icon: Icon, label, value, color, trend, trendDir }: {
  icon: LucideIcon; label: string; value: string; color: string;
  trend?: string; trendDir?: 'up' | 'down';
}) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 10,
      background: 'rgba(255,255,255,0.07)', border: `1px solid ${C.border}`,
      textAlign: 'center',
    }}>
      <Icon style={{ width: 13, height: 13, color, marginBottom: 4 }} />
      <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{value}</div>
      <div style={{ fontSize: 9, color: C.textDim }}>{label}</div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, marginTop: 3 }}>
          {trendDir === 'up'
            ? <ArrowUp style={{ width: 8, height: 8, color: C.gold }} />
            : <ArrowDown style={{ width: 8, height: 8, color: C.red }} />}
          <span style={{ fontSize: 8, fontWeight: 700, color: trendDir === 'up' ? C.gold : C.red }}>{trend}</span>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, color, badge }: {
  icon: LucideIcon; title: string; color: string; badge?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
      <Icon style={{ width: 13, height: 13, color }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{title}</span>
      {badge && (
        <span style={{
          fontSize: 8.5, fontWeight: 700, color,
          background: `${color}20`, border: `1px solid ${color}30`,
          borderRadius: 100, padding: '2px 7px',
        }}>
          {badge}
        </span>
      )}
    </div>
  );
}

function ProgressBar({ value, color, height = 5 }: { value: number; color: string; height?: number }) {
  return (
    <div style={{ flex: 1, height, borderRadius: height, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ height: '100%', borderRadius: height, background: color }}
      />
    </div>
  );
}

function TabBar({ tabs, active, onChange }: {
  tabs: { id: string; label: string; icon: LucideIcon; count?: number }[];
  active: string; onChange: (id: string) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 9, padding: 2 }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            padding: '6px 8px', borderRadius: 7, border: 'none', cursor: 'pointer',
            fontFamily: fontCairo, fontSize: 10.5, fontWeight: 600,
            background: active === tab.id ? 'rgba(255,255,255,0.12)' : 'transparent',
            color: active === tab.id ? C.text : C.textDim,
          }}
        >
          <tab.icon style={{ width: 11, height: 11 }} />
          {tab.label}
          {tab.count !== undefined && tab.count > 0 && (
            <span style={{
              fontSize: 8, fontWeight: 800, color: '#fff',
              background: C.blue, borderRadius: 100, padding: '1px 5px',
            }}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// 1. وكيل مدير حسابات — Account Manager Agent
// ═══════════════════════════════════════════════════════
export function AccountManagerAgent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);

  // Real data from TaskContext
  const taskCtx = useOptionalTaskContext();

  const tasks = taskCtx?.tasks?.filter(t => t.agent === 'account_manager') || [];
  const stats = taskCtx?.stats;
  const bp = taskCtx?.businessProfile;

  // Business profile form state
  const [bpForm, setBpForm] = useState<Partial<BusinessProfile>>({
    business_name: '', business_name_en: '', business_type: '',
    city: '', emirate: '', phone: '', whatsapp: '', email: '',
    website: '', description: '', services: [], license_number: '',
  });

  // Sync form with loaded profile
  useEffect(() => {
    if (bp) {
      setBpForm({
        business_name: bp.business_name || '',
        business_name_en: bp.business_name_en || '',
        business_type: bp.business_type || '',
        city: bp.city || '', emirate: bp.emirate || '',
        phone: bp.phone || '', whatsapp: bp.whatsapp || '',
        email: bp.email || '', website: bp.website || '',
        description: bp.description || '',
        services: bp.services || [],
        license_number: bp.license_number || '',
      });
    }
  }, [bp]);

  // Compute profile completeness
  const profileFields = ['business_name', 'business_type', 'city', 'phone', 'email', 'description'];
  const filledCount = bp ? profileFields.filter(f => !!(bp as any)[f]).length : 0;
  const profileCompleteness = Math.round((filledCount / profileFields.length) * 100);

  // AI insights — dynamic based on profile state
  const aiInsights: { id: string; type: 'warning' | 'opportunity' | 'success'; title: string; desc: string; action: string; taskType: string }[] = [];

  if (!bp || profileCompleteness < 100) {
    aiInsights.push({
      id: 'i_profile', type: 'warning',
      title: 'الملف التجاري غير مكتمل',
      desc: `اكتمال الملف ${profileCompleteness}%. أكمل بياناتك لتحصل على صفحة ملف تجاري وصفحة خدمة احترافية.`,
      action: 'اكمال الملف', taskType: 'setup_business_profile',
    });
  }
  if (bp && profileCompleteness >= 80) {
    aiInsights.push({
      id: 'i_page', type: 'opportunity',
      title: 'انشاء صفحة الملف التجاري',
      desc: 'بيانات ملفك جاهزة. يمكن انشاء صفحة ملف تجاري متوافقة مع بحث الذكاء الاصطناعي ومحركات البحث.',
      action: 'انشاء الصفحة', taskType: 'create_profile_page',
    });
    aiInsights.push({
      id: 'i_service', type: 'opportunity',
      title: 'انشاء صفحة خدمة',
      desc: 'اعرض خدماتك بصفحة مخصصة مع Schema.org لتظهر في نتائج Google و AI Overview.',
      action: 'انشاء صفحة خدمة', taskType: 'create_service_page',
    });
  }
  if (bp && profileCompleteness === 100) {
    aiInsights.push({
      id: 'i_seo', type: 'success',
      title: 'طلب تقرير ظهور SEO',
      desc: 'ملفك مكتمل. اطلب تقريرا شاملا عن ظهورك في Google والذكاء الاصطناعي مع خطة تحسين.',
      action: 'طلب تقرير', taskType: 'seo_report',
    });
  }

  // Task pipeline from real data
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const runningCount = tasks.filter(t => t.status === 'running').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const failedCount = tasks.filter(t => t.status === 'failed').length;

  const pipelineStages = [
    { stage: 'قيد الانتظار', count: pendingCount, value: `${pendingCount * 5}`, color: C.blue },
    { stage: 'قيد التنفيذ',  count: runningCount, value: `${runningCount * 5}`, color: C.purple },
    { stage: 'مكتملة',       count: doneCount,    value: `${doneCount * 5}`,    color: C.gold },
    { stage: 'فشلت',         count: failedCount,  value: `${failedCount * 5}`,  color: C.red },
  ];

  const handleAgentAction = useCallback(async (actionId: string, taskType?: string) => {
    if (actionId === 'i_profile') {
      setShowProfileForm(true);
      return;
    }
    setIsAgentThinking(true);
    try {
      if (taskCtx && taskType) {
        const taskTitles: Record<string, string> = {
          'create_profile_page': 'انشاء صفحة الملف التجاري',
          'create_service_page': 'انشاء صفحة خدمة',
          'seo_report': 'تقرير ظهور SEO و AI',
          'client_followup': 'متابعة عميل',
        };
        const task = await taskCtx.createTask({
          type: taskType,
          title: taskTitles[taskType] || 'مهمة وكيل الحسابات',
          agent: 'account_manager',
          metadata: { source: 'ai_insight', insight_id: actionId },
        });
        if (task) {
          await taskCtx.executeTask(task.id);
          // Simulate task completion after 3s
          setTimeout(async () => {
            await taskCtx.updateTask(task.id, {
              status: 'done',
              result: { completed: true, timestamp: new Date().toISOString() },
            });
          }, 3000);
        }
      }
    } catch (e) {
      console.error('Agent action error:', e);
    } finally {
      setTimeout(() => setIsAgentThinking(false), 2500);
    }
  }, [taskCtx]);

  const handleSaveProfile = useCallback(async () => {
    if (!taskCtx) return;
    setIsAgentThinking(true);
    try {
      await taskCtx.saveBusinessProfile(bpForm);
      setShowProfileForm(false);
      await taskCtx.fetchTasks();
      await taskCtx.fetchStats();
    } catch (e) {
      console.error('Save profile error:', e);
    } finally {
      setIsAgentThinking(false);
    }
  }, [taskCtx, bpForm]);

  return (
    <div style={{ height: '100%', overflow: 'auto', fontFamily: fontCairo }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', borderBottom: `1px solid ${C.border}`,
        background: 'linear-gradient(180deg, rgba(59,91,254,0.05), transparent)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: C.blueSoft, border: `1px solid rgba(59,91,254,0.15)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Briefcase style={{ width: 16, height: 16, color: C.blue }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>وكيل مدير الحسابات</div>
            <div style={{ fontSize: 10, color: C.textDim }}>Account Manager Agent — إدارة ذكية للعلاقات</div>
          </div>
          <motion.div
            animate={isAgentThinking ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '4px 10px', borderRadius: 8,
              background: isAgentThinking ? C.blueSoft : C.goldSoft,
              border: `1px solid ${isAgentThinking ? 'rgba(59,91,254,0.15)' : 'rgba(212,175,55,0.15)'}`,
            }}
          >
            {isAgentThinking
              ? <Loader2 className="animate-spin" style={{ width: 10, height: 10, color: C.blue }} />
              : <Sparkles style={{ width: 10, height: 10, color: C.gold }} />}
            <span style={{ fontSize: 9, fontWeight: 700, color: isAgentThinking ? C.blue : C.gold }}>
              {isAgentThinking ? 'يحلل...' : 'ذكاء نشط'}
            </span>
          </motion.div>
        </div>

        <TabBar
          tabs={[
            { id: 'overview', label: 'نظرة عامة', icon: PieChart },
            { id: 'profile', label: 'الملف التجاري', icon: Briefcase },
            { id: 'insights', label: 'رؤى ذكية', icon: Sparkles, count: aiInsights.length },
            { id: 'tasks', label: 'المهام', icon: Filter, count: tasks.length },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '12px 16px' }}>
        {activeTab === 'overview' && (
          <>
            {/* Stats — from real data */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14 }}>
              <StatCard icon={FileText} label="اجمالي المهام" value={String(stats?.total || tasks.length)} color={C.blue} />
              <StatCard icon={CheckCircle} label="مكتملة" value={String(stats?.done || doneCount)} color={C.gold} />
              <StatCard icon={Activity} label="قيد التنفيذ" value={String(stats?.running || runningCount)} color={C.blue} />
              <StatCard icon={DollarSign} label="كوينز مصروفة" value={String(stats?.total_coins_spent || 0)} color={C.gold} />
            </div>

            {/* Profile Completeness */}
            <SectionHeader icon={Briefcase} title="حالة الملف التجاري" color={C.blue} badge={bp ? `${profileCompleteness}%` : 'جديد'} />
            <div style={{
              padding: '14px', borderRadius: 12, marginBottom: 14,
              background: bp ? 'rgba(255,255,255,0.02)' : C.blueSoft,
              border: `1px solid ${bp ? C.border : 'rgba(59,91,254,0.15)'}`,
            }}>
              {bp ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: C.goldSoft, border: '1px solid rgba(212,175,55,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Briefcase style={{ width: 18, height: 18, color: C.gold }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{bp.business_name || 'بدون اسم'}</div>
                      <div style={{ fontSize: 10, color: C.textDim }}>
                        {bp.business_type || 'نوع النشاط غير محدد'} {bp.city ? `— ${bp.city}` : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 9, color: C.textDim }}>اكتمال الملف</span>
                    <ProgressBar value={profileCompleteness} color={profileCompleteness >= 80 ? C.gold : C.orange} height={5} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: profileCompleteness >= 80 ? C.gold : C.orange }}>{profileCompleteness}%</span>
                  </div>
                  {profileCompleteness < 100 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setActiveTab('profile'); setShowProfileForm(true); }}
                      style={{
                        marginTop: 8, padding: '6px 14px', borderRadius: 8,
                        border: 'none', cursor: 'pointer', fontFamily: fontCairo,
                        fontSize: 10.5, fontWeight: 700, background: C.blueSoft, color: C.blue,
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}
                    >
                      <Zap style={{ width: 10, height: 10 }} />
                      اكمال البيانات الناقصة
                    </motion.button>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <Briefcase style={{ width: 24, height: 24, color: C.blue, margin: '0 auto 8px' }} />
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 4 }}>لم يتم اعداد الملف التجاري بعد</div>
                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 10 }}>ابدأ بتعبئة بياناتك واحصل على صفحة ملف تجاري مجانا</div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setActiveTab('profile'); setShowProfileForm(true); }}
                    style={{
                      padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      fontFamily: fontCairo, fontSize: 11, fontWeight: 700,
                      background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`, color: '#fff',
                    }}
                  >
                    ابدأ الآن
                  </motion.button>
                </div>
              )}
            </div>

            {/* Recent Tasks */}
            <SectionHeader icon={Clock} title="اخر المهام" color={C.textDim} />
            {tasks.length === 0 ? (
              <div style={{ fontSize: 10.5, color: C.textDim, textAlign: 'center', padding: '20px 0' }}>
                لا توجد مهام بعد. ابدأ بإعداد ملفك التجاري لتظهر المهام هنا.
              </div>
            ) : (
              tasks.slice(0, 5).map((task) => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: `1px solid ${C.border}` }}>
                  {task.status === 'done'
                    ? <CheckCircle style={{ width: 11, height: 11, color: C.gold, flexShrink: 0 }} />
                    : task.status === 'running'
                    ? <Loader2 className="animate-spin" style={{ width: 11, height: 11, color: C.blue, flexShrink: 0 }} />
                    : task.status === 'failed'
                    ? <AlertCircle style={{ width: 11, height: 11, color: C.red, flexShrink: 0 }} />
                    : <Clock style={{ width: 11, height: 11, color: C.textDim, flexShrink: 0 }} />}
                  <span style={{ flex: 1, fontSize: 10.5, color: C.text }}>{task.title}</span>
                  <span style={{ fontSize: 9, color: C.textDim, fontFamily: fontMono }}>
                    {task.cost_coins > 0 ? `${task.cost_coins} coin` : 'مجاني'}
                  </span>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'profile' && (
          <>
            <SectionHeader icon={Briefcase} title="الملف التجاري" color={C.blue} badge="وكيل الحسابات" />

            {/* Profile Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { key: 'business_name', label: 'اسم النشاط (عربي)', placeholder: 'مثال: شركة الاعمار للمقاولات' },
                { key: 'business_name_en', label: 'اسم النشاط (انجليزي)', placeholder: 'e.g. Al Emar Contracting' },
                { key: 'business_type', label: 'نوع النشاط', placeholder: 'مقاولات / تشطيبات / ديكور / مواد بناء...' },
                { key: 'emirate', label: 'الإمارة', placeholder: 'دبي / ابوظبي / الشارقة...' },
                { key: 'city', label: 'المدينة', placeholder: 'المنطقة او المدينة' },
                { key: 'phone', label: 'رقم الهاتف', placeholder: '+971 50 000 0000' },
                { key: 'whatsapp', label: 'واتساب', placeholder: '+971 50 000 0000' },
                { key: 'email', label: 'البريد الإلكتروني', placeholder: 'info@company.ae' },
                { key: 'website', label: 'الموقع الإلكتروني', placeholder: 'https://www.company.ae' },
                { key: 'license_number', label: 'رقم الرخصة التجارية', placeholder: 'اختياري' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: 10, color: C.textDim, marginBottom: 3, display: 'block' }}>{field.label}</label>
                  <input
                    value={(bpForm as any)[field.key] || ''}
                    onChange={e => setBpForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={{
                      width: '100%', padding: '8px 12px', borderRadius: 8,
                      background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.border}`,
                      color: C.text, fontSize: 11, fontFamily: fontCairo,
                      outline: 'none',
                    }}
                  />
                </div>
              ))}

              {/* Description */}
              <div>
                <label style={{ fontSize: 10, color: C.textDim, marginBottom: 3, display: 'block' }}>وصف النشاط</label>
                <textarea
                  value={bpForm.description || ''}
                  onChange={e => setBpForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="اكتب وصفا مختصرا عن نشاطك وخدماتك..."
                  rows={3}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 8, resize: 'vertical',
                    background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.border}`,
                    color: C.text, fontSize: 11, fontFamily: fontCairo, outline: 'none',
                  }}
                />
              </div>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveProfile}
                disabled={isAgentThinking}
                style={{
                  width: '100%', padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontFamily: fontCairo, fontSize: 12, fontWeight: 700,
                  background: isAgentThinking ? C.blueSoft : `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  marginTop: 6,
                }}
              >
                {isAgentThinking
                  ? <><Loader2 className="animate-spin" style={{ width: 12, height: 12 }} /> جاري الحفظ...</>
                  : <><CheckCircle style={{ width: 12, height: 12 }} /> حفظ الملف التجاري</>}
              </motion.button>

              {bp && (
                <div style={{
                  marginTop: 8, padding: '10px', borderRadius: 10,
                  background: C.goldSoft, border: '1px solid rgba(212,175,55,0.12)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Sparkles style={{ width: 11, height: 11, color: C.gold }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.gold }}>توصية وياك</span>
                  </div>
                  <p style={{ fontSize: 10, color: C.textDim, lineHeight: 1.7, margin: 0 }}>
                    بعد حفظ الملف، انتقل لتبويب "رؤى ذكية" لإنشاء صفحة الملف التجاري وصفحة الخدمة. هذه الصفحات ستكون متوافقة مع SEO والذكاء الاصطناعي.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'insights' && (
          <>
            <SectionHeader icon={Sparkles} title="رؤى وياك الذكية" color={C.gold} badge="AI" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {aiInsights.map(insight => (
                <motion.div
                  key={insight.id}
                  whileHover={{ scale: 1.01 }}
                  style={{
                    padding: '14px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${insight.type === 'warning' ? 'rgba(239,68,68,0.15)' : insight.type === 'opportunity' ? 'rgba(59,91,254,0.15)' : 'rgba(212,175,55,0.15)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    {insight.type === 'warning' && <AlertCircle style={{ width: 14, height: 14, color: C.red }} />}
                    {insight.type === 'opportunity' && <Target style={{ width: 14, height: 14, color: C.blue }} />}
                    {insight.type === 'success' && <CheckCircle style={{ width: 14, height: 14, color: C.gold }} />}
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text, flex: 1 }}>{insight.title}</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: C.textDim, marginBottom: 10, lineHeight: 1.6 }}>
                    {insight.desc}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAgentAction(insight.id, insight.taskType)}
                    style={{
                      padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      fontFamily: fontCairo, fontSize: 10.5, fontWeight: 700,
                      background: insight.type === 'warning' ? C.redSoft : insight.type === 'opportunity' ? C.blueSoft : C.goldSoft,
                      color: insight.type === 'warning' ? C.red : insight.type === 'opportunity' ? C.blue : C.gold,
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}
                  >
                    <Zap style={{ width: 10, height: 10 }} />
                    {insight.action}
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* AI Recommendations */}
            <div style={{ marginTop: 14, padding: '12px', borderRadius: 11, background: C.goldSoft, border: '1px solid rgba(212,175,55,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Sparkles style={{ width: 12, height: 12, color: C.gold }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: C.gold }}>توصية وياك</span>
              </div>
              <p style={{ fontSize: 10.5, color: C.textDim, lineHeight: 1.7, margin: 0 }}>
                {bp
                  ? `ملفك التجاري مكتمل بنسبة ${profileCompleteness}%. ${profileCompleteness < 100 ? 'اكمل البيانات الناقصة ثم اطلب انشاء صفحة الملف التجاري وتقرير SEO.' : 'ملفك جاهز! يمكنك الآن طلب تقرير ظهور SEO وانشاء صفحات خدمة احترافية.'} كل مهمة تُسجّل وتُتبّع تلقائيا.`
                  : 'ابدأ بإعداد ملفك التجاري — هذا اساس كل شيء. بعد الاعداد، سيقترح وياك مهام ذكية مخصصة لنشاطك.'
                }
              </p>
            </div>
          </>
        )}

        {activeTab === 'tasks' && (
          <>
            <SectionHeader icon={Filter} title="حالة المهام" color={C.purple} badge={`${tasks.length} مهمة`} />

            {/* Pipeline Visualization */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              {pipelineStages.map((stage, i) => {
                const total = Math.max(tasks.length, 1);
                const widthPct = Math.max(10, (stage.count / total) * 100);
                return (
                  <div key={stage.stage} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 10, color: C.textDim, width: 75, flexShrink: 0, textAlign: 'right' }}>{stage.stage}</span>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        style={{
                          height: 28, borderRadius: 7,
                          background: `linear-gradient(90deg, ${stage.color}20, ${stage.color}08)`,
                          border: `1px solid ${stage.color}20`,
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0 10px',
                        }}
                      >
                        <span style={{ fontSize: 10, fontWeight: 700, color: stage.color }}>{stage.count} مهمة</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: C.text }}>{stage.value} coin</span>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Task List */}
            <SectionHeader icon={Clock} title="كل المهام" color={C.textDim} />
            {tasks.length === 0 ? (
              <div style={{ fontSize: 10.5, color: C.textDim, textAlign: 'center', padding: '20px 0' }}>
                لا توجد مهام بعد. استخدم "رؤى ذكية" لإنشاء مهام جديدة.
              </div>
            ) : (
              tasks.map(task => (
                <motion.div
                  key={task.id}
                  whileHover={{ background: 'rgba(255,255,255,0.03)' }}
                  style={{
                    padding: '10px 12px', borderRadius: 10, marginBottom: 6,
                    border: `1px solid ${C.border}`, cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {task.status === 'done'
                      ? <CheckCircle style={{ width: 13, height: 13, color: C.gold, flexShrink: 0 }} />
                      : task.status === 'running'
                      ? <Loader2 className="animate-spin" style={{ width: 13, height: 13, color: C.blue, flexShrink: 0 }} />
                      : task.status === 'failed'
                      ? <AlertCircle style={{ width: 13, height: 13, color: C.red, flexShrink: 0 }} />
                      : <Clock style={{ width: 13, height: 13, color: C.textDim, flexShrink: 0 }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: C.text }}>{task.title}</div>
                      <div style={{ fontSize: 9, color: C.textDim, marginTop: 1 }}>
                        {task.type} {task.cost_coins > 0 ? `| ${task.cost_coins} coin` : '| مجاني'}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 8.5, fontWeight: 700, borderRadius: 100, padding: '2px 8px',
                      background: task.status === 'done' ? C.goldSoft : task.status === 'running' ? C.blueSoft : task.status === 'failed' ? C.redSoft : 'rgba(255,255,255,0.08)',
                      color: task.status === 'done' ? C.gold : task.status === 'running' ? C.blue : task.status === 'failed' ? C.red : C.textDim,
                    }}>
                      {task.status === 'done' ? 'مكتمل' : task.status === 'running' ? 'جاري' : task.status === 'failed' ? 'فشل' : 'معلّق'}
                    </span>
                  </div>
                  {task.status === 'pending' && taskCtx && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => {
                        setIsAgentThinking(true);
                        await taskCtx.executeTask(task.id);
                        setTimeout(async () => {
                          await taskCtx.updateTask(task.id, { status: 'done', result: { completed: true } });
                          setIsAgentThinking(false);
                        }, 3000);
                      }}
                      style={{
                        marginTop: 8, padding: '5px 12px', borderRadius: 7,
                        border: 'none', cursor: 'pointer', fontFamily: fontCairo,
                        fontSize: 10, fontWeight: 700, background: C.blueSoft, color: C.blue,
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <Zap style={{ width: 10, height: 10 }} />
                      تنفيذ المهمة ({task.cost_coins} coin)
                    </motion.button>
                  )}
                </motion.div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// 2. وكيل تحسين SEO — SEO Optimization Agent
// ═══════════════════════════════════════════════════════
export function SEOOptimizerAgent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const taskCtx = useOptionalTaskContext();

  const seoScore = 72;
  const geoScore = 45;

  const eatScores = [
    { label: 'خبرة (Expertise)', score: 78, color: C.blue },
    { label: 'تجربة (Experience)', score: 65, color: C.purple },
    { label: 'سلطة (Authority)', score: 58, color: C.orange },
    { label: 'ثقة (Trust)', score: 82, color: C.gold },
  ];

  const keywords = [
    { keyword: 'مقاول بناء دبي',      rank: 3,  vol: '2.4K', trend: 'up' as const, geoAppear: true },
    { keyword: 'شركة تشطيب ابوظبي',  rank: 7,  vol: '1.8K', trend: 'up' as const, geoAppear: false },
    { keyword: 'مواد بناء الامارات',   rank: 12, vol: '3.1K', trend: 'down' as const, geoAppear: true },
    { keyword: 'ديكور داخلي فلل',     rank: 5,  vol: '1.5K', trend: 'up' as const, geoAppear: false },
    { keyword: 'مقاول فلل العين',     rank: 2,  vol: '890',  trend: 'up' as const, geoAppear: true },
    { keyword: 'ترميم منازل دبي',     rank: 18, vol: '1.2K', trend: 'down' as const, geoAppear: false },
  ];

  const schemaStatus = [
    { type: 'LocalBusiness', status: 'active' as const, pages: 3 },
    { type: 'Product',       status: 'active' as const, pages: 48 },
    { type: 'Service',       status: 'partial' as const, pages: 9 },
    { type: 'Review',        status: 'active' as const, pages: 156 },
    { type: 'FAQPage',       status: 'missing' as const, pages: 0 },
    { type: 'HowTo',         status: 'missing' as const, pages: 0 },
  ];

  const geoTasks = [
    { task: 'إضافة محتوى E-E-A-T لصفحات الخدمات', priority: 'high' as const, impact: 'عالي' },
    { task: 'إنشاء Schema FAQPage لكل قسم خدمة',  priority: 'high' as const, impact: 'عالي' },
    { task: 'تحسين المحتوى ليظهر في AI Overview',  priority: 'medium' as const, impact: 'متوسط' },
    { task: 'إضافة بيانات منظمة HowTo للادوات',    priority: 'medium' as const, impact: 'متوسط' },
    { task: 'تحسين الروابط الداخلية للسلطة',       priority: 'low' as const, impact: 'منخفض' },
  ];

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      if (taskCtx) {
        const task = await taskCtx.createTask({
          type: 'seo_report',
          title: 'تحليل SEO + GEO شامل',
          description: 'تحليل محركات البحث والظهور في الذكاء الاصطناعي',
          agent: 'seo_optimizer',
        });
        if (task) {
          await taskCtx.executeTask(task.id);
          setTimeout(async () => {
            await taskCtx.updateTask(task.id, {
              status: 'done',
              result: { seo_score: 72, geo_score: 45, timestamp: new Date().toISOString() },
            });
          }, 3000);
        }
      }
    } catch (e) {
      console.error('SEO analyze error:', e);
    }
    setTimeout(() => setIsAnalyzing(false), 3000);
  }, [taskCtx]);

  return (
    <div style={{ height: '100%', overflow: 'auto', fontFamily: fontCairo }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', borderBottom: `1px solid ${C.border}`,
        background: 'linear-gradient(180deg, rgba(155,81,224,0.05), transparent)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: C.purpleSoft, border: '1px solid rgba(155,81,224,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Search style={{ width: 16, height: 16, color: C.purple }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>وكيل تحسين SEO</div>
            <div style={{ fontSize: 10, color: C.textDim }}>SEO + GEO Agent — تحسين محركات البحث والذكاء الاصطناعي</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: fontCairo, fontSize: 10, fontWeight: 700,
              background: isAnalyzing ? C.purpleSoft : `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
              color: '#fff',
            }}
          >
            {isAnalyzing
              ? <Loader2 className="animate-spin" style={{ width: 10, height: 10 }} />
              : <RefreshCw style={{ width: 10, height: 10 }} />}
            {isAnalyzing ? 'جاري التحليل...' : 'تحليل الموقع'}
          </motion.button>
        </div>

        <TabBar
          tabs={[
            { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
            { id: 'keywords', label: 'الكلمات المفتاحية', icon: Search, count: keywords.length },
            { id: 'geo', label: 'GEO', icon: Globe },
            { id: 'schema', label: 'Schema', icon: Code2 },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div style={{ padding: '12px 16px' }}>
        {activeTab === 'overview' && (
          <>
            {/* Score Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {/* SEO Score */}
              <div style={{
                padding: '14px', borderRadius: 12,
                background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, color: C.textDim, marginBottom: 6 }}>نتيجة SEO التقليدي</div>
                <div style={{ position: 'relative', width: 70, height: 70, margin: '0 auto 6px' }}>
                  <svg width="70" height="70" viewBox="0 0 70 70">
                    <circle cx="35" cy="35" r="30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
                    <circle
                      cx="35" cy="35" r="30" fill="none"
                      stroke={C.blue} strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={`${(seoScore / 100) * 188.5} 188.5`}
                      transform="rotate(-90 35 35)"
                    />
                  </svg>
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 800, color: C.blue,
                  }}>
                    {seoScore}
                  </div>
                </div>
                <span style={{ fontSize: 9, color: C.blue, fontWeight: 700 }}>جيد</span>
              </div>

              {/* GEO Score */}
              <div style={{
                padding: '14px', borderRadius: 12,
                background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, color: C.textDim, marginBottom: 6 }}>نتيجة GEO (ذكاء اصطناعي)</div>
                <div style={{ position: 'relative', width: 70, height: 70, margin: '0 auto 6px' }}>
                  <svg width="70" height="70" viewBox="0 0 70 70">
                    <circle cx="35" cy="35" r="30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
                    <circle
                      cx="35" cy="35" r="30" fill="none"
                      stroke={C.orange} strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={`${(geoScore / 100) * 188.5} 188.5`}
                      transform="rotate(-90 35 35)"
                    />
                  </svg>
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 800, color: C.orange,
                  }}>
                    {geoScore}
                  </div>
                </div>
                <span style={{ fontSize: 9, color: C.orange, fontWeight: 700 }}>يحتاج تحسين</span>
              </div>
            </div>

            {/* E-E-A-T Scores */}
            <SectionHeader icon={Shield} title="معايير E-E-A-T" color={C.gold} badge="معيار الثقة" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              {eatScores.map(eat => (
                <div key={eat.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, color: C.textDim, width: 120, flexShrink: 0 }}>{eat.label}</span>
                  <ProgressBar value={eat.score} color={eat.color} height={6} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: eat.color, width: 30, textAlign: 'left' }}>{eat.score}%</span>
                </div>
              ))}
            </div>

            {/* Infographic Reference */}
            <SectionHeader icon={BookOpen} title="مستقبل SEO — من الروابط إلى عصر GEO" color={C.purple} />
            <motion.div
              whileHover={{ scale: 1.01 }}
              style={{
                borderRadius: 12, overflow: 'hidden',
                border: `1px solid ${C.border}`,
                cursor: 'pointer',
              }}
            >
              <img
                src={seoInfographic}
                alt="مستقبل SEO والذكاء الاصطناعي"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </motion.div>
          </>
        )}

        {activeTab === 'keywords' && (
          <>
            <SectionHeader icon={Search} title="تحليل الكلمات المفتاحية" color={C.blue} badge={`${keywords.length} كلمة`} />

            {/* Legend */}
            <div style={{
              display: 'flex', gap: 12, marginBottom: 10, padding: '6px 10px',
              background: 'rgba(255,255,255,0.02)', borderRadius: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: C.blue }} />
                <span style={{ fontSize: 9, color: C.textDim }}>ترتيب Google</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Globe style={{ width: 9, height: 9, color: C.purple }} />
                <span style={{ fontSize: 9, color: C.textDim }}>ظهور في AI Overview</span>
              </div>
            </div>

            {keywords.map((kw, i) => (
              <div key={kw.keyword} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0',
                borderBottom: i < keywords.length - 1 ? `1px solid ${C.border}` : 'none',
              }}>
                {/* Rank */}
                <div style={{
                  width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                  background: kw.rank <= 3 ? C.goldSoft : kw.rank <= 10 ? C.blueSoft : C.redSoft,
                  border: `1px solid ${kw.rank <= 3 ? 'rgba(212,175,55,0.15)' : kw.rank <= 10 ? 'rgba(59,91,254,0.15)' : 'rgba(239,68,68,0.15)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800,
                  color: kw.rank <= 3 ? C.gold : kw.rank <= 10 ? C.blue : C.red,
                }}>
                  #{kw.rank}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: C.text }}>{kw.keyword}</span>
                    {kw.geoAppear && (
                      <Globe style={{ width: 10, height: 10, color: C.purple }} />
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 9, color: C.textDim }}>حجم: {kw.vol}/شهر</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {kw.trend === 'up'
                        ? <ArrowUp style={{ width: 8, height: 8, color: C.gold }} />
                        : <ArrowDown style={{ width: 8, height: 8, color: C.red }} />}
                      <span style={{ fontSize: 8, color: kw.trend === 'up' ? C.gold : C.red, fontWeight: 700 }}>
                        {kw.trend === 'up' ? 'صعود' : 'هبوط'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* AI Keyword Suggestion */}
            <div style={{
              marginTop: 12, padding: '12px', borderRadius: 11,
              background: C.purpleSoft, border: '1px solid rgba(155,81,224,0.12)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Sparkles style={{ width: 12, height: 12, color: C.purple }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: C.purple }}>اقتراحات وياك</span>
              </div>
              <p style={{ fontSize: 10.5, color: C.textDim, lineHeight: 1.7, margin: 0 }}>
                ركّز على الكلمات المفتاحية الطويلة (Long-tail) مع صياغتها كأسئلة طبيعية: "كيف اختار مقاول بناء موثوق في دبي؟" — هذا النوع يظهر في AI Overview بنسبة 3 اضعاف.
              </p>
            </div>
          </>
        )}

        {activeTab === 'geo' && (
          <>
            <SectionHeader icon={Globe} title="استراتيجية GEO" color={C.purple} badge="Generative Engine Optimization" />

            {/* Zero-Click Warning */}
            <div style={{
              padding: '12px', borderRadius: 11, marginBottom: 12,
              background: C.orangeSoft, border: '1px solid rgba(230,126,34,0.15)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <AlertCircle style={{ width: 13, height: 13, color: C.orange }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: C.orange }}>تحدي Zero-Click</span>
              </div>
              <p style={{ fontSize: 10.5, color: C.textDim, lineHeight: 1.6, margin: 0 }}>
                58% من عمليات البحث تنتهي بدون زيارة للموقع. المنافسة الآن على "الاقتباس" وليس "الترتيب".
              </p>
            </div>

            {/* GEO vs Traditional */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14,
            }}>
              <div style={{
                padding: '10px', borderRadius: 10, textAlign: 'center',
                background: C.blueSoft, border: '1px solid rgba(59,91,254,0.12)',
              }}>
                <Search style={{ width: 14, height: 14, color: C.blue, marginBottom: 4 }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: C.blue }}>SEO التقليدي</div>
                <div style={{ fontSize: 9, color: C.textDim, marginTop: 2 }}>ترتيب الروابط في الصفحة</div>
              </div>
              <div style={{
                padding: '10px', borderRadius: 10, textAlign: 'center',
                background: C.purpleSoft, border: '1px solid rgba(155,81,224,0.12)',
              }}>
                <Globe style={{ width: 14, height: 14, color: C.purple, marginBottom: 4 }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: C.purple }}>GEO (ذكاء اصطناعي)</div>
                <div style={{ fontSize: 9, color: C.textDim, marginTop: 2 }}>الظهور كمصدر داخل AI</div>
              </div>
            </div>

            {/* Action Tasks */}
            <SectionHeader icon={Zap} title="مهام التحسين" color={C.gold} badge={`${geoTasks.length} مهمة`} />
            {geoTasks.map((task, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0',
                borderBottom: i < geoTasks.length - 1 ? `1px solid ${C.border}` : 'none',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: 2, flexShrink: 0,
                  background: task.priority === 'high' ? C.red : task.priority === 'medium' ? C.orange : C.textDim,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{task.task}</div>
                  <div style={{ fontSize: 9, color: C.textDim, marginTop: 1 }}>
                    الأثر: <span style={{
                      color: task.priority === 'high' ? C.gold : task.priority === 'medium' ? C.orange : C.textDim,
                      fontWeight: 700,
                    }}>{task.impact}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    if (taskCtx) {
                      const t = await taskCtx.createTask({
                        type: 'geo_report',
                        title: task.task,
                        description: `اثر: ${task.impact}`,
                        agent: 'seo_optimizer',
                        metadata: { priority: task.priority },
                      });
                      if (t) {
                        await taskCtx.executeTask(t.id);
                        setTimeout(() => taskCtx.updateTask(t.id, { status: 'done', result: { completed: true } }), 3000);
                      }
                    }
                  }}
                  style={{
                    padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    fontFamily: fontCairo, fontSize: 9, fontWeight: 700,
                    background: C.purpleSoft, color: C.purple,
                  }}
                >
                  تنفيذ
                </motion.button>
              </div>
            ))}
          </>
        )}

        {activeTab === 'schema' && (
          <>
            <SectionHeader icon={Code2} title="Schema Markup" color={C.blue} badge="بيانات منظمة" />

            {/* Schema Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              {schemaStatus.map(schema => (
                <div key={schema.type} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  borderRadius: 9, background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`,
                }}>
                  <Code2 style={{
                    width: 14, height: 14, flexShrink: 0,
                    color: schema.status === 'active' ? C.gold : schema.status === 'partial' ? C.orange : C.red,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: C.text, fontFamily: fontMono }}>{schema.type}</span>
                      <span style={{
                        fontSize: 8, fontWeight: 700, borderRadius: 100, padding: '1px 6px',
                        background: schema.status === 'active' ? C.goldSoft : schema.status === 'partial' ? C.orangeSoft : C.redSoft,
                        color: schema.status === 'active' ? C.gold : schema.status === 'partial' ? C.orange : C.red,
                      }}>
                        {schema.status === 'active' ? 'مفعّل' : schema.status === 'partial' ? 'جزئي' : 'مفقود'}
                      </span>
                    </div>
                    {schema.pages > 0 && (
                      <span style={{ fontSize: 9, color: C.textDim }}>{schema.pages} صفحة</span>
                    )}
                  </div>
                  {schema.status !== 'active' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                        fontFamily: fontCairo, fontSize: 9, fontWeight: 700,
                        background: C.blueSoft, color: C.blue,
                      }}
                    >
                      {schema.status === 'partial' ? 'إكمال' : 'إنشاء'}
                    </motion.button>
                  )}
                </div>
              ))}
            </div>

            {/* Schema Code Preview */}
            <div style={{
              padding: '12px', borderRadius: 10,
              background: '#060810', border: `1px solid ${C.border}`,
              fontFamily: fontMono, fontSize: 10, direction: 'ltr', textAlign: 'left',
              lineHeight: 1.8, color: C.textDim,
            }}>
              <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Code2 style={{ width: 10, height: 10, color: C.purple }} />
                <span style={{ color: C.purple, fontWeight: 700, fontFamily: fontCairo, fontSize: 10 }}>نموذج Schema</span>
              </div>
              <span style={{ color: C.purple }}>{'{'}</span><br />
              {'  '}<span style={{ color: C.blue }}>"@context"</span>: <span style={{ color: C.gold }}>"https://schema.org"</span>,<br />
              {'  '}<span style={{ color: C.blue }}>"@type"</span>: <span style={{ color: C.gold }}>"LocalBusiness"</span>,<br />
              {'  '}<span style={{ color: C.blue }}>"name"</span>: <span style={{ color: C.gold }}>"بيت الريف"</span>,<br />
              {'  '}<span style={{ color: C.blue }}>"aggregateRating"</span>: <span style={{ color: C.purple }}>{'{'}</span><br />
              {'    '}<span style={{ color: C.blue }}>"ratingValue"</span>: <span style={{ color: C.orange }}>4.8</span>,<br />
              {'    '}<span style={{ color: C.blue }}>"reviewCount"</span>: <span style={{ color: C.orange }}>156</span><br />
              {'  '}<span style={{ color: C.purple }}>{'}'}</span><br />
              <span style={{ color: C.purple }}>{'}'}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// 3. وكيل السوشيال ميديا — Social Media Agent
// ═══════════════════════════════════════════════════════
export function SocialMediaAgent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const taskCtx = useOptionalTaskContext();

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Camera, color: '#E91E63', followers: '12.4K', growth: '+2.3%', engagement: '4.8%', posts: 234, handle: '@bietalreef' },
    { id: 'tiktok',    name: 'TikTok',    icon: Hash,   color: '#FF0050', followers: '8.7K',  growth: '+5.1%', engagement: '6.2%', posts: 89,  handle: '@bietalreef_ae' },
    { id: 'facebook',  name: 'Facebook',  icon: Users,  color: '#1877F2', followers: '5.2K',  growth: '+1.1%', engagement: '2.3%', posts: 156, handle: 'بيت الريف' },
    { id: 'x',         name: 'X',         icon: Send,   color: '#A0A0A0', followers: '3.1K',  growth: '+0.8%', engagement: '1.9%', posts: 412, handle: '@bietalreef' },
    { id: 'linkedin',  name: 'LinkedIn',  icon: Briefcase, color: '#0A66C2', followers: '1.8K', growth: '+3.4%', engagement: '3.1%', posts: 67, handle: 'BietAlreef' },
  ];

  const scheduledPosts = [
    { id: 'p1', title: 'عرض رمضان — خصم 20% على التشطيبات',  platforms: ['instagram', 'facebook'], time: 'اليوم 2:00 م', type: 'image' as const, status: 'ready' as const },
    { id: 'p2', title: 'فيديو تايم لابس — مشروع فيلا العين',  platforms: ['tiktok', 'instagram'],  time: 'غدا 10:00 ص',  type: 'video' as const, status: 'draft' as const },
    { id: 'p3', title: 'تقييم عميل — "افضل مقاول في ابوظبي"', platforms: ['facebook', 'x'],         time: 'غدا 4:00 م',   type: 'text' as const,  status: 'ready' as const },
    { id: 'p4', title: 'نصيحة بناء — كيف تختار الحديد',       platforms: ['linkedin', 'x'],         time: 'بعد غد 9:00 ص', type: 'carousel' as const, status: 'generating' as const },
  ];

  const contentIdeas = [
    { topic: 'دليل اختيار مقاول بناء موثوق',       format: 'Carousel', platform: 'Instagram', score: 92 },
    { topic: 'قبل وبعد — تحويل شقة قديمة',          format: 'Reels',    platform: 'Instagram', score: 88 },
    { topic: '5 اخطاء شائعة في البناء',              format: 'Thread',   platform: 'X',         score: 85 },
    { topic: 'جولة في المعرض — مواد بناء جديدة',    format: 'Video',    platform: 'TikTok',    score: 80 },
    { topic: 'مقارنة اسعار البناء — 2025 vs 2026',  format: 'Article',  platform: 'LinkedIn',  score: 77 },
  ];

  const weeklyPerformance = [
    { day: 'الأحد',   reach: 1200, engagement: 89 },
    { day: 'الإثنين', reach: 1450, engagement: 112 },
    { day: 'الثلاثاء', reach: 980, engagement: 67 },
    { day: 'الأربعاء', reach: 1680, engagement: 134 },
    { day: 'الخميس',  reach: 2100, engagement: 178 },
    { day: 'الجمعة',  reach: 1890, engagement: 156 },
    { day: 'السبت',   reach: 1340, engagement: 98 },
  ];
  const maxReach = Math.max(...weeklyPerformance.map(d => d.reach));

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      if (taskCtx) {
        const task = await taskCtx.createTask({
          type: 'social_post_generate',
          title: 'انشاء محتوى سوشيال ميديا',
          description: 'انشاء منشور محتوى عبر المنصات الاجتماعية',
          agent: 'social_media',
        });
        if (task) {
          await taskCtx.executeTask(task.id);
          setTimeout(async () => {
            await taskCtx.updateTask(task.id, {
              status: 'done',
              result: { generated: true, timestamp: new Date().toISOString() },
            });
          }, 3000);
        }
      }
    } catch (e) {
      console.error('Social generate error:', e);
    }
    setTimeout(() => setIsGenerating(false), 3000);
  }, [taskCtx]);

  return (
    <div style={{ height: '100%', overflow: 'auto', fontFamily: fontCairo }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', borderBottom: `1px solid ${C.border}`,
        background: 'linear-gradient(180deg, rgba(233,30,99,0.05), transparent)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: C.pinkSoft, border: '1px solid rgba(233,30,99,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Share2 style={{ width: 16, height: 16, color: C.pink }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>وكيل السوشيال ميديا</div>
            <div style={{ fontSize: 10, color: C.textDim }}>Social Media Agent — إدارة ذكية عبر المنصات</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: fontCairo, fontSize: 10, fontWeight: 700,
              background: isGenerating ? C.pinkSoft : `linear-gradient(135deg, ${C.pink}, ${C.purple})`,
              color: '#fff',
            }}
          >
            {isGenerating
              ? <Loader2 className="animate-spin" style={{ width: 10, height: 10 }} />
              : <Sparkles style={{ width: 10, height: 10 }} />}
            {isGenerating ? 'يولّد...' : 'توليد محتوى'}
          </motion.button>
        </div>

        <TabBar
          tabs={[
            { id: 'dashboard', label: 'لوحة التحكم', icon: BarChart3 },
            { id: 'schedule', label: 'الجدولة', icon: Calendar, count: scheduledPosts.length },
            { id: 'content', label: 'المحتوى', icon: Sparkles },
            { id: 'analytics', label: 'التحليلات', icon: TrendingUp },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div style={{ padding: '12px 16px' }}>
        {activeTab === 'dashboard' && (
          <>
            {/* Overall Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14 }}>
              <StatCard icon={Users} label="المتابعون" value="31.2K" color={C.pink} trend="+2.8%" trendDir="up" />
              <StatCard icon={Heart} label="التفاعل" value="3.2K" color={C.red} trend="+15%" trendDir="up" />
              <StatCard icon={Eye} label="الوصول" value="48K" color={C.blue} trend="+8%" trendDir="up" />
              <StatCard icon={Send} label="المنشورات" value="958" color={C.purple} />
            </div>

            {/* Platform Cards */}
            <SectionHeader icon={Layers} title="المنصات المتصلة" color={C.pink} badge={`${platforms.length} منصة`} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {platforms.map(p => (
                <motion.div
                  key={p.id}
                  whileHover={{ background: 'rgba(255,255,255,0.03)' }}
                  onClick={() => setSelectedPlatform(selectedPlatform === p.id ? null : p.id)}
                  style={{
                    padding: '10px 12px', borderRadius: 10,
                    background: selectedPlatform === p.id ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                    border: `1px solid ${selectedPlatform === p.id ? `${p.color}25` : C.border}`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: `${p.color}12`, border: `1px solid ${p.color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <p.icon style={{ width: 14, height: 14, color: p.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: C.text }}>{p.name}</span>
                        <span style={{ fontSize: 9, color: C.textDim, fontFamily: fontMono, direction: 'ltr' }}>{p.handle}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
                        <span style={{ fontSize: 10, color: p.color, fontWeight: 700 }}>{p.followers}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <ArrowUp style={{ width: 8, height: 8, color: C.gold }} />
                          <span style={{ fontSize: 8, color: C.gold, fontWeight: 700 }}>{p.growth}</span>
                        </div>
                        <span style={{ fontSize: 9, color: C.textDim }}>تفاعل: {p.engagement}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 10, color: C.textDim }}>{p.posts} منشور</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'schedule' && (
          <>
            <SectionHeader icon={Calendar} title="المنشورات المجدولة" color={C.blue} badge={`${scheduledPosts.length} منشور`} />

            {scheduledPosts.map(post => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.01 }}
                style={{
                  padding: '12px', borderRadius: 11, marginBottom: 8,
                  background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <CalendarDays style={{ width: 13, height: 13, color: C.blue, flexShrink: 0 }} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: C.text, flex: 1 }}>{post.title}</span>
                  <span style={{
                    fontSize: 8.5, fontWeight: 700, borderRadius: 100, padding: '2px 7px',
                    background: post.status === 'ready' ? C.goldSoft : post.status === 'draft' ? C.blueSoft : C.purpleSoft,
                    color: post.status === 'ready' ? C.gold : post.status === 'draft' ? C.blue : C.purple,
                    border: `1px solid ${post.status === 'ready' ? 'rgba(212,175,55,0.15)' : post.status === 'draft' ? 'rgba(59,91,254,0.15)' : 'rgba(155,81,224,0.15)'}`,
                  }}>
                    {post.status === 'ready' ? 'جاهز' : post.status === 'draft' ? 'مسودة' : 'يولّد...'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock style={{ width: 10, height: 10, color: C.textDim }} />
                  <span style={{ fontSize: 10, color: C.textDim }}>{post.time}</span>
                  <div style={{ width: 1, height: 10, background: C.border }} />
                  <div style={{ display: 'flex', gap: 4 }}>
                    {post.platforms.map(pid => {
                      const plat = platforms.find(p => p.id === pid);
                      if (!plat) return null;
                      return (
                        <div key={pid} style={{
                          width: 18, height: 18, borderRadius: 5,
                          background: `${plat.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <plat.icon style={{ width: 9, height: 9, color: plat.color }} />
                        </div>
                      );
                    })}
                  </div>
                  <span style={{
                    fontSize: 9, color: C.textDim, borderRadius: 5,
                    background: 'rgba(255,255,255,0.03)', padding: '1px 5px',
                  }}>
                    {post.type === 'image' ? 'صورة' : post.type === 'video' ? 'فيديو' : post.type === 'carousel' ? 'Carousel' : 'نص'}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Add Post Button */}
            <motion.button
              whileHover={{ scale: 1.01, background: 'rgba(233,30,99,0.06)' }}
              whileTap={{ scale: 0.99 }}
              style={{
                width: '100%', padding: '10px', borderRadius: 10, marginTop: 4,
                background: 'rgba(255,255,255,0.02)', border: `1px dashed rgba(233,30,99,0.2)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                cursor: 'pointer', fontFamily: fontCairo,
              }}
            >
              <CalendarDays style={{ width: 12, height: 12, color: C.pink }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: C.pink }}>جدولة منشور جديد</span>
            </motion.button>
          </>
        )}

        {activeTab === 'content' && (
          <>
            <SectionHeader icon={Sparkles} title="أفكار محتوى ذكية" color={C.gold} badge="AI Generated" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {contentIdeas.map((idea, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  style={{
                    padding: '12px', borderRadius: 11,
                    background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text, flex: 1 }}>{idea.topic}</span>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 3,
                      padding: '2px 7px', borderRadius: 6,
                      background: idea.score >= 85 ? C.goldSoft : C.blueSoft,
                    }}>
                      <Star style={{ width: 9, height: 9, color: idea.score >= 85 ? C.gold : C.blue }} />
                      <span style={{ fontSize: 9, fontWeight: 700, color: idea.score >= 85 ? C.gold : C.blue }}>{idea.score}%</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 9, color: C.purple, fontWeight: 700,
                      background: C.purpleSoft, borderRadius: 5, padding: '2px 6px',
                    }}>
                      {idea.format}
                    </span>
                    <span style={{ fontSize: 9, color: C.textDim }}>
                      {idea.platform}
                    </span>
                    <div style={{ flex: 1 }} />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                        fontFamily: fontCairo, fontSize: 9, fontWeight: 700,
                        background: `linear-gradient(135deg, ${C.pink}20, ${C.purple}20)`,
                        color: C.pink,
                      }}
                    >
                      توليد
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Content Generator */}
            <div style={{
              marginTop: 14, padding: '12px', borderRadius: 11,
              background: C.pinkSoft, border: '1px solid rgba(233,30,99,0.12)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Sparkles style={{ width: 12, height: 12, color: C.pink }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: C.pink }}>مولّد المحتوى الذكي</span>
              </div>
              <p style={{ fontSize: 10.5, color: C.textDim, lineHeight: 1.6, margin: '0 0 10px' }}>
                اكتب وصفا قصيرا وسيقوم وياك بتوليد محتوى متكامل لكل المنصات مع هاشتاغات وصور مقترحة.
              </p>
              <div style={{
                display: 'flex', gap: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 8,
                padding: '8px 10px', border: `1px solid ${C.border}`,
              }}>
                <input
                  placeholder="اكتب فكرة المحتوى..."
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    fontFamily: fontCairo, fontSize: 11, color: C.text, direction: 'rtl',
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerate}
                  style={{
                    padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    fontFamily: fontCairo, fontSize: 10, fontWeight: 700,
                    background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`,
                    color: '#fff', display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <Sparkles style={{ width: 10, height: 10 }} />
                  توليد
                </motion.button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            <SectionHeader icon={TrendingUp} title="اداء الأسبوع" color={C.blue} />

            {/* Mini Bar Chart */}
            <div style={{
              padding: '14px', borderRadius: 12, marginBottom: 14,
              background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 4, height: 100 }}>
                {weeklyPerformance.map((day, i) => (
                  <div key={day.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 8, color: C.gold, fontWeight: 700 }}>{day.engagement}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.reach / maxReach) * 70}px` }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                      style={{
                        width: '100%', maxWidth: 24, borderRadius: '4px 4px 0 0',
                        background: `linear-gradient(180deg, ${C.blue}, ${C.purple}60)`,
                      }}
                    />
                    <span style={{ fontSize: 8, color: C.textDim }}>{day.day.slice(0, 3)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: C.blue }} />
                  <span style={{ fontSize: 9, color: C.textDim }}>الوصول</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 9, color: C.gold }}>الأرقام = التفاعل</span>
                </div>
              </div>
            </div>

            {/* Best Performing Posts */}
            <SectionHeader icon={Award} title="افضل المنشورات اداء" color={C.gold} />
            {[
              { title: 'فيديو قبل وبعد — تجديد فيلا', reach: '12.4K', likes: 890, comments: 67, platform: 'Instagram' },
              { title: 'نصيحة بناء — الاساسات',        reach: '8.7K',  likes: 456, comments: 89, platform: 'TikTok' },
              { title: 'عرض رمضان — خصم 30%',         reach: '6.2K',  likes: 234, comments: 45, platform: 'Facebook' },
            ].map((post, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0',
                borderBottom: i < 2 ? `1px solid ${C.border}` : 'none',
              }}>
                <Crown style={{ width: 13, height: 13, color: i === 0 ? C.gold : i === 1 ? '#C0C0C0' : '#CD7F32', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{post.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 9, color: C.textDim }}>{post.platform}</span>
                    <span style={{ fontSize: 9, color: C.blue }}>
                      <Eye style={{ width: 8, height: 8, display: 'inline', verticalAlign: 'middle' }} /> {post.reach}
                    </span>
                    <span style={{ fontSize: 9, color: C.pink }}>
                      <Heart style={{ width: 8, height: 8, display: 'inline', verticalAlign: 'middle' }} /> {post.likes}
                    </span>
                    <span style={{ fontSize: 9, color: C.textDim }}>
                      <MessageSquare style={{ width: 8, height: 8, display: 'inline', verticalAlign: 'middle' }} /> {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Best Time to Post */}
            <div style={{
              marginTop: 14, padding: '12px', borderRadius: 11,
              background: C.blueSoft, border: '1px solid rgba(59,91,254,0.12)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Clock style={{ width: 12, height: 12, color: C.blue }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: C.blue }}>افضل اوقات النشر</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                {[
                  { time: '9:00 - 10:00 ص', day: 'الخميس', score: 'ممتاز' },
                  { time: '2:00 - 3:00 م',  day: 'الاربعاء', score: 'جيد جدا' },
                  { time: '8:00 - 9:00 م',  day: 'الجمعة', score: 'جيد' },
                ].map((slot, i) => (
                  <div key={i} style={{
                    padding: '8px', borderRadius: 7, textAlign: 'center',
                    background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.text }}>{slot.time}</div>
                    <div style={{ fontSize: 9, color: C.textDim }}>{slot.day}</div>
                    <div style={{ fontSize: 8, color: C.gold, fontWeight: 700, marginTop: 2 }}>{slot.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
