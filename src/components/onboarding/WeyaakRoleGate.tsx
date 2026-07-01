/**
 * WeyaakRoleGate.tsx — بوابة اختيار نوع الحساب في وياك
 * ════════════════════════════════════════════════════════
 * تظهر فقط للمستخدم الجديد الذي لم تُهيَّأ هويته بعد.
 * تختفي بعد الاختيار وتُهيئ:
 *   - WeyaakProfile في localStorage
 *   - Default UI Agent عبر AgentActivationContext
 *   - ربط الجلسة بـ WeyaakIdentityContext
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Wrench, Loader2, ChevronLeft, Sparkles } from 'lucide-react';
import { supabase } from '../../utils/supabase/client';
import { useWeyaakIdentity, type WeyaakRole } from '../../contexts/WeyaakIdentityContext';
import { useAgentActivation, AGENT_TEMPLATES } from '../../contexts/AgentActivationContext';

const C = {
  bg:      '#060C1A',
  surface: '#0F1A2E',
  card:    '#1A2540',
  border:  'rgba(255,255,255,0.10)',
  text:    '#F1F5F9',
  textDim: '#64748B',
  gold:    '#D4AF37',
  blue:    '#3B5BFE',
};
const font = "'Cairo', 'Tajawal', sans-serif";

interface RoleCardProps {
  role: WeyaakRole;
  title: string;
  subtitle: string;
  features: string[];
  color: string;
  icon: React.ElementType;
  selected: boolean;
  onClick: () => void;
}

function RoleCard({ title, subtitle, features, color, icon: Icon, selected, onClick }: RoleCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        flex: 1, padding: '20px 16px', borderRadius: 16, textAlign: 'right',
        border: `1.5px solid ${selected ? color : C.border}`,
        background: selected ? `${color}10` : C.card,
        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={24} color={color} />
      </div>

      {/* Title */}
      <div>
        <div style={{ fontFamily: font, fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontFamily: font, fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>
          {subtitle}
        </div>
      </div>

      {/* Features */}
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, direction: 'rtl' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontFamily: font, fontSize: 12, color: C.textDim }}>{f}</span>
          </li>
        ))}
      </ul>

      {/* Selected indicator */}
      {selected && (
        <div style={{
          marginTop: 'auto', padding: '6px 12px', borderRadius: 99, alignSelf: 'flex-start',
          background: `${color}20`, border: `1px solid ${color}40`,
          fontFamily: font, fontSize: 11, color, fontWeight: 700,
        }}>
          محدد
        </div>
      )}
    </motion.button>
  );
}

interface WeyaakRoleGateProps {
  onComplete?: () => void;
}

export function WeyaakRoleGate({ onComplete }: WeyaakRoleGateProps) {
  const { isNewUser, initializeUser, linkDefaultAgent, linkSession, userId } = useWeyaakIdentity();
  const { startChat } = useAgentActivation();

  const [selectedRole, setSelectedRole] = useState<WeyaakRole | null>(null);
  const [saving, setSaving] = useState(false);

  if (!isNewUser) return null;

  async function handleConfirm() {
    if (!selectedRole || !userId || saving) return;
    setSaving(true);

    try {
      // 1. Get Google user info from Supabase session
      const { data: { user } } = await supabase.auth.getUser();
      const email     = user?.email ?? '';
      const name      = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? email.split('@')[0];
      const avatarUrl = user?.user_metadata?.avatar_url ?? '';

      // 2. Initialize WeyaakProfile in localStorage
      initializeUser(userId, selectedRole, email, name, avatarUrl);

      // 3. Create default UI agent + session in one step
      const agent = startChat('ui_assistant', userId, userId);
      linkDefaultAgent(agent.id);
      linkSession(`session_${agent.id}`);

      onComplete?.();
    } catch (err) {
      console.error('WeyaakRoleGate: init failed', err);
      // Fail gracefully — user can retry
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(6,12,26,0.95)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.05 }}
          style={{
            width: '100%', maxWidth: 560,
            background: C.surface, borderRadius: 24,
            border: `1px solid ${C.border}`,
            padding: '28px 24px',
            display: 'flex', flexDirection: 'column', gap: 20,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, margin: '0 auto 12px',
              background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={26} color={C.gold} />
            </div>
            <h2 style={{ fontFamily: font, fontWeight: 900, fontSize: 20, color: C.text, margin: '0 0 6px' }}>
              مرحباً في وياك
            </h2>
            <p style={{ fontFamily: font, fontSize: 13, color: C.textDim, margin: 0 }}>
              اختر نوع حسابك لنهيئ لك التجربة المناسبة
            </p>
          </div>

          {/* Role cards */}
          <div style={{ display: 'flex', gap: 12 }}>
            <RoleCard
              role="customer"
              title="أنا عميل"
              subtitle="أبحث عن خدمات ومزودين محترفين"
              features={['تصفح مزودي الخدمات', 'طلب عروض أسعار', 'متابعة طلباتي', 'التواصل المباشر']}
              color={C.blue}
              icon={User}
              selected={selectedRole === 'customer'}
              onClick={() => setSelectedRole('customer')}
            />
            <RoleCard
              role="provider"
              title="أنا مزود خدمة"
              subtitle="أقدم خدماتي للعملاء وأدير نشاطي"
              features={['ملف تجاري احترافي', 'استقبال الطلبات', 'أدوات SEO وتسويق', 'ظهور في الخرائط']}
              color={C.gold}
              icon={Wrench}
              selected={selectedRole === 'provider'}
              onClick={() => setSelectedRole('provider')}
            />
          </div>

          {/* Provider note */}
          {selectedRole === 'provider' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)',
                fontFamily: font, fontSize: 12, color: C.gold, direction: 'rtl',
              }}
            >
              ملفك العام سيظل مخفياً حتى تكتمل عملية الإعداد والموافقة.
            </motion.div>
          )}

          {/* Confirm button */}
          <button
            onClick={handleConfirm}
            disabled={!selectedRole || saving}
            style={{
              padding: '14px', borderRadius: 12, border: 'none',
              background: selectedRole
                ? `linear-gradient(135deg, ${selectedRole === 'customer' ? C.blue : C.gold}, ${selectedRole === 'customer' ? '#2845C7' : '#B8940E'})`
                : 'rgba(255,255,255,0.06)',
              color: selectedRole ? (selectedRole === 'customer' ? '#fff' : '#000') : C.textDim,
              fontFamily: font, fontSize: 15, fontWeight: 800,
              cursor: selectedRole && !saving ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
            }}
          >
            {saving
              ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> جارٍ التهيئة...</>
              : <><ChevronLeft size={16} /> ابدأ رحلتك</>
            }
          </button>
        </motion.div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </AnimatePresence>
  );
}
