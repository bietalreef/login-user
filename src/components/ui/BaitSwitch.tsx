/**
 * BaitSwitch.tsx — مفتاح تبديل ثلاثي الأبعاد بأسلوب iOS
 * ═══════════════════════════════════════════════════════════
 * مكون Toggle Switch احترافي لمنصة بيت الريف
 * - تأثير Frosted Glass للوضع الداكن
 * - ألوان ذهبية (#D4AF37 / #FFD700) بدلاً من الأخضر
 * - ظلال 3D واقعية على طراز iOS HIG + Material Design
 * - رسوم متحركة Spring Animation
 * - دعم RTL + أحجام متعددة + variants
 */

import { useState, useId, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const fontCairo = 'Cairo, sans-serif';

// ═══════════════════════════════════════
// Types & Config
// ═══════════════════════════════════════
type SwitchVariant = 'ios' | 'material' | 'frosted';
type SwitchSize = 'sm' | 'md' | 'lg';
type SwitchColor = 'gold' | 'blue' | 'amber' | 'brown' | 'indigo' | 'purple';

interface BaitSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  variant?: SwitchVariant;
  size?: SwitchSize;
  color?: SwitchColor;
  disabled?: boolean;
  label?: string;
  labelPosition?: 'start' | 'end';
  description?: string;
  className?: string;
  id?: string;
}

// Color palettes — NO GREEN
const COLOR_MAP: Record<SwitchColor, { on: string; onGlow: string; onDark: string; onGlowDark: string }> = {
  gold:   { on: '#D4AF37', onGlow: 'rgba(212,175,55,0.35)', onDark: '#FFD700', onGlowDark: 'rgba(255,215,0,0.4)' },
  blue:   { on: '#3B5BFE', onGlow: 'rgba(59,91,254,0.35)', onDark: '#5A78FF', onGlowDark: 'rgba(90,120,255,0.4)' },
  amber:  { on: '#F59E0B', onGlow: 'rgba(245,158,11,0.35)', onDark: '#FBBF24', onGlowDark: 'rgba(251,191,36,0.4)' },
  brown:  { on: '#8D6E63', onGlow: 'rgba(141,110,99,0.35)', onDark: '#A1887F', onGlowDark: 'rgba(161,136,127,0.4)' },
  indigo: { on: '#3B5BFE', onGlow: 'rgba(59,91,254,0.35)', onDark: '#5C6BC0', onGlowDark: 'rgba(92,107,192,0.4)' },
  purple: { on: '#7C5ADA', onGlow: 'rgba(124,90,218,0.35)', onDark: '#9B7AED', onGlowDark: 'rgba(155,122,237,0.4)' },
};

const SIZE_MAP: Record<SwitchSize, {
  trackW: number; trackH: number; knobSize: number;
  padding: number; travel: number; labelSize: string; descSize: string;
}> = {
  sm: { trackW: 40, trackH: 24, knobSize: 18, padding: 3, travel: 16, labelSize: 'text-xs', descSize: 'text-[10px]' },
  md: { trackW: 51, trackH: 31, knobSize: 27, padding: 2, travel: 20, labelSize: 'text-sm', descSize: 'text-[11px]' },
  lg: { trackW: 64, trackH: 38, knobSize: 32, padding: 3, travel: 26, labelSize: 'text-base', descSize: 'text-xs' },
};

// ═══════════════════════════════════════
// Helper: detect dark mode
// ═══════════════════════════════════════
function useIsDark() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  // Re-check on render (observer could be added for reactivity)
  if (typeof document !== 'undefined') {
    const current = document.documentElement.classList.contains('dark');
    if (current !== isDark) setIsDark(current);
  }

  return isDark;
}

// ═══════════════════════════════════════
// iOS HIG Style Switch
// ═══════════════════════════════════════
function IOSSwitch({
  checked,
  onToggle,
  size,
  colors,
  isDark,
  disabled,
}: {
  checked: boolean;
  onToggle: () => void;
  size: typeof SIZE_MAP.md;
  colors: typeof COLOR_MAP.gold;
  isDark: boolean;
  disabled: boolean;
}) {
  const [isPressed, setIsPressed] = useState(false);

  const onColor = isDark ? colors.onDark : colors.on;
  const glowColor = isDark ? colors.onGlowDark : colors.onGlow;
  const offTrackColor = isDark ? 'rgba(120,120,128,0.32)' : 'rgba(120,120,128,0.16)';

  const knobScale = isPressed ? 1.08 : 1;
  const knobX = checked ? size.travel : 0;

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onToggle}
      onPointerDown={() => !disabled && setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      className={`relative flex-shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-opacity ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{
        width: size.trackW,
        height: size.trackH,
        padding: size.padding,
        focusVisibleRingColor: onColor,
      } as CSSProperties}
    >
      {/* Track */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          backgroundColor: checked ? onColor : offTrackColor,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          boxShadow: checked
            ? `0 0 12px ${glowColor}, inset 0 1px 3px rgba(0,0,0,0.1)`
            : isDark
            ? 'inset 0 1px 3px rgba(0,0,0,0.3)'
            : 'inset 0 1px 3px rgba(0,0,0,0.08)',
          ...(isDark && !checked ? {
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          } : {}),
        }}
      />

      {/* Knob */}
      <motion.div
        className="relative rounded-full"
        animate={{
          x: knobX,
          scale: knobScale,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.8,
        }}
        style={{
          width: size.knobSize,
          height: size.knobSize,
          background: isDark
            ? 'linear-gradient(180deg, #F2F2F7 0%, #E5E5EA 100%)'
            : 'linear-gradient(180deg, #FFFFFF 0%, #F8F8F8 100%)',
          boxShadow: isDark
            ? `0 3px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)`
            : `0 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)`,
        }}
      />
    </motion.button>
  );
}

// ═══════════════════════════════════════
// Material Design Style Switch
// ═══════════════════════════════════════
function MaterialSwitch({
  checked,
  onToggle,
  size,
  colors,
  isDark,
  disabled,
}: {
  checked: boolean;
  onToggle: () => void;
  size: typeof SIZE_MAP.md;
  colors: typeof COLOR_MAP.gold;
  isDark: boolean;
  disabled: boolean;
}) {
  const [isPressed, setIsPressed] = useState(false);

  const onColor = isDark ? colors.onDark : colors.on;
  const glowColor = isDark ? colors.onGlowDark : colors.onGlow;
  const offTrackColor = isDark ? 'rgba(60,60,67,0.5)' : 'rgba(60,60,67,0.3)';

  // Material: smaller track, knob protrudes
  const trackH = Math.round(size.trackH * 0.55);
  const trackW = Math.round(size.trackW * 0.88);
  const knobSize = Math.round(size.knobSize * 0.78);
  const travel = trackW - knobSize;

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onToggle}
      onPointerDown={() => !disabled && setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      className={`relative flex-shrink-0 flex items-center outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-opacity ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{ width: trackW + 4, height: knobSize + 4 }}
    >
      {/* Track */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: trackW,
          height: trackH,
          left: 2,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        animate={{
          backgroundColor: checked ? onColor : offTrackColor,
          opacity: checked ? 0.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />

      {/* Knob */}
      <motion.div
        className="relative rounded-full"
        animate={{
          x: checked ? travel : 0,
          scale: isPressed ? 1.1 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 25,
          mass: 0.6,
        }}
        style={{
          width: knobSize,
          height: knobSize,
          marginLeft: 2,
          background: checked
            ? `linear-gradient(135deg, ${onColor}, ${isDark ? colors.onDark : colors.on})`
            : isDark
            ? 'linear-gradient(135deg, #F2F2F7, #E5E5EA)'
            : 'linear-gradient(135deg, #FFFFFF, #F0F0F0)',
          boxShadow: checked
            ? `0 3px 8px ${glowColor}, 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)`
            : isDark
            ? `0 3px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)`
            : `0 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.06)`,
        }}
      >
        {/* Inner ring gradient (Material MD3 style) */}
        <div
          className="absolute inset-[1px] rounded-full"
          style={{
            background: checked
              ? 'transparent'
              : isDark
              ? 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.8), transparent)',
          }}
        />
      </motion.div>
    </motion.button>
  );
}

// ═══════════════════════════════════════
// Frosted Glass Style Switch (بيت الريف signature)
// ═══════════════════════════════════════
function FrostedSwitch({
  checked,
  onToggle,
  size,
  colors,
  isDark,
  disabled,
}: {
  checked: boolean;
  onToggle: () => void;
  size: typeof SIZE_MAP.md;
  colors: typeof COLOR_MAP.gold;
  isDark: boolean;
  disabled: boolean;
}) {
  const [isPressed, setIsPressed] = useState(false);

  const onColor = isDark ? colors.onDark : colors.on;
  const glowColor = isDark ? colors.onGlowDark : colors.onGlow;

  const knobX = checked ? size.travel : 0;

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onToggle}
      onPointerDown={() => !disabled && setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      className={`relative flex-shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-opacity ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{
        width: size.trackW,
        height: size.trackH,
        padding: size.padding,
      }}
    >
      {/* Frosted Glass Track */}
      <motion.div
        className="absolute inset-0 rounded-full border-[2px]"
        animate={{
          borderColor: checked
            ? isDark ? 'rgba(255,215,0,0.3)' : 'rgba(212,175,55,0.4)'
            : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          background: checked
            ? isDark
              ? `linear-gradient(135deg, ${onColor}CC, ${onColor}99)`
              : `linear-gradient(135deg, ${onColor}, ${onColor}DD)`
            : isDark
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(120,120,128,0.12)',
          backdropFilter: isDark ? 'blur(20px) saturate(180%)' : 'blur(10px)',
          WebkitBackdropFilter: isDark ? 'blur(20px) saturate(180%)' : 'blur(10px)',
          boxShadow: checked
            ? `0 0 16px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.15)`
            : isDark
            ? 'inset 0 1px 2px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.05)'
            : 'inset 0 1px 2px rgba(0,0,0,0.06)',
        }}
      />

      {/* Knob with glass effect */}
      <motion.div
        className="relative rounded-full"
        animate={{
          x: knobX,
          scale: isPressed ? 0.92 : 1,
          rotateZ: isPressed ? -3 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 600,
          damping: 30,
          mass: 0.5,
        }}
        style={{
          width: size.knobSize,
          height: size.knobSize,
          background: isDark
            ? checked
              ? 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,240,245,0.9))'
              : 'linear-gradient(145deg, rgba(255,255,255,0.85), rgba(220,220,225,0.8))'
            : 'linear-gradient(145deg, #FFFFFF, #F2F2F7)',
          boxShadow: isDark
            ? checked
              ? `0 4px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3), 0 0 8px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.4)`
              : `0 3px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)`
            : `0 3px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)`,
          border: isDark
            ? '1px solid rgba(255,255,255,0.15)'
            : '0.5px solid rgba(0,0,0,0.04)',
        }}
      >
        {/* Inner shine */}
        <div
          className="absolute inset-[2px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 60%)',
          }}
        />
      </motion.div>
    </motion.button>
  );
}

// ═══════════════════════════════════════
// Main BaitSwitch Component
// ═══════════════════════════════════════
export function BaitSwitch({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  variant = 'ios',
  size = 'md',
  color = 'gold',
  disabled = false,
  label,
  labelPosition = 'end',
  description,
  className = '',
  id: propId,
}: BaitSwitchProps) {
  const autoId = useId();
  const switchId = propId || autoId;
  const isDark = useIsDark();

  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const newVal = !isChecked;
    if (!isControlled) setInternalChecked(newVal);
    onChange?.(newVal);
  };

  const sizeConfig = SIZE_MAP[size];
  const colorConfig = COLOR_MAP[color];

  const renderSwitch = () => {
    const commonProps = {
      checked: isChecked,
      onToggle: handleToggle,
      size: sizeConfig,
      colors: colorConfig,
      isDark,
      disabled,
    };

    switch (variant) {
      case 'material':
        return <MaterialSwitch {...commonProps} />;
      case 'frosted':
        return <FrostedSwitch {...commonProps} />;
      case 'ios':
      default:
        return <IOSSwitch {...commonProps} />;
    }
  };

  if (!label) {
    return <div className={className}>{renderSwitch()}</div>;
  }

  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      style={{ direction: 'rtl' }}
    >
      {labelPosition === 'start' && renderSwitch()}
      <label
        htmlFor={switchId}
        className={`flex flex-col cursor-pointer select-none ${disabled ? 'opacity-50' : ''}`}
        onClick={handleToggle}
      >
        <span
          className={`font-bold ${sizeConfig.labelSize} ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}
          style={{ fontFamily: fontCairo }}
        >
          {label}
        </span>
        {description && (
          <span
            className={`${sizeConfig.descSize} ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            style={{ fontFamily: fontCairo }}
          >
            {description}
          </span>
        )}
      </label>
      {labelPosition === 'end' && renderSwitch()}
    </div>
  );
}

// ═══════════════════════════════════════
// Showcase Demo Component
// ═══════════════════════════════════════
export function BaitSwitchShowcase() {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en';

  const [values, setValues] = useState({
    notifications: true,
    darkMode: false,
    location: true,
    sync: false,
    biometric: true,
    autoSave: false,
  });

  const toggle = (key: keyof typeof values) =>
    setValues((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div
      className={`rounded-2xl overflow-hidden border-[4px] ${
        isDark ? 'border-white/10' : 'border-gray-200/60'
      }`}
      style={{
        background: isDark
          ? 'rgba(255,255,255,0.06)'
          : '#ffffff',
        backdropFilter: isDark ? 'blur(20px) saturate(180%)' : undefined,
        WebkitBackdropFilter: isDark ? 'blur(20px) saturate(180%)' : undefined,
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 4px 16px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div
        className={`px-5 py-4 border-b-[3px] ${
          isDark ? 'border-white/8' : 'border-gray-100'
        }`}
      >
        <h3
          className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'Settings' : 'الإعدادات'}
        </h3>
        <p
          className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'iOS HIG • Material • Frosted Glass' : 'أنماط متعددة — iOS • ماتيريال • زجاجي'}
        </p>
      </div>

      {/* iOS Style Section */}
      <div className={`px-5 py-3 border-b ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
        <p
          className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${
            isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]'
          }`}
          style={{ fontFamily: fontCairo }}
        >
          iOS HIG
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span
                className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Notifications' : 'الإشعارات'}
              </span>
              <span
                className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Receive push notifications' : 'استلام إشعارات فورية'}
              </span>
            </div>
            <BaitSwitch
              variant="ios"
              size="md"
              color="gold"
              checked={values.notifications}
              onChange={() => toggle('notifications')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span
                className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Dark Mode' : 'الوضع الداكن'}
              </span>
              <span
                className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Use dark theme' : 'تفعيل المظهر الداكن'}
              </span>
            </div>
            <BaitSwitch
              variant="ios"
              size="md"
              color="blue"
              checked={values.darkMode}
              onChange={() => toggle('darkMode')}
            />
          </div>
        </div>
      </div>

      {/* Material Style Section */}
      <div className={`px-5 py-3 border-b ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
        <p
          className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${
            isDark ? 'text-[#5A78FF]' : 'text-[#3B5BFE]'
          }`}
          style={{ fontFamily: fontCairo }}
        >
          Material Design
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span
                className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Location Services' : 'خدمات الموقع'}
              </span>
              <span
                className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Allow location access' : 'السماح بالوصول للموقع'}
              </span>
            </div>
            <BaitSwitch
              variant="material"
              size="md"
              color="purple"
              checked={values.location}
              onChange={() => toggle('location')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span
                className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Cloud Sync' : 'المزامنة السحابية'}
              </span>
              <span
                className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Auto-sync data to cloud' : 'مزامنة تلقائية للسحابة'}
              </span>
            </div>
            <BaitSwitch
              variant="material"
              size="md"
              color="indigo"
              checked={values.sync}
              onChange={() => toggle('sync')}
            />
          </div>
        </div>
      </div>

      {/* Frosted Glass Section */}
      <div className="px-5 py-3">
        <p
          className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${
            isDark ? 'text-[#A1887F]' : 'text-[#8D6E63]'
          }`}
          style={{ fontFamily: fontCairo }}
        >
          Frosted Glass
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span
                className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Biometric Login' : 'تسجيل بالبصمة'}
              </span>
              <span
                className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Use Face ID / Touch ID' : 'استخدام البصمة أو الوجه'}
              </span>
            </div>
            <BaitSwitch
              variant="frosted"
              size="md"
              color="gold"
              checked={values.biometric}
              onChange={() => toggle('biometric')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span
                className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Auto-Save' : 'الحفظ التلقائي'}
              </span>
              <span
                className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Save changes automatically' : 'حفظ التغييرات تلقائياً'}
              </span>
            </div>
            <BaitSwitch
              variant="frosted"
              size="md"
              color="amber"
              checked={values.autoSave}
              onChange={() => toggle('autoSave')}
            />
          </div>
        </div>
      </div>

      {/* Size Showcase */}
      <div
        className={`px-5 py-4 border-t-[3px] ${isDark ? 'border-white/8' : 'border-gray-100'}`}
      >
        <p
          className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'Sizes' : 'الأحجام'}
        </p>
        <div className="flex items-center gap-5 justify-center">
          {(['sm', 'md', 'lg'] as SwitchSize[]).map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <BaitSwitch variant="frosted" size={s} color="gold" defaultChecked />
              <span
                className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                style={{ fontFamily: fontCairo }}
              >
                {s.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BaitSwitch;
