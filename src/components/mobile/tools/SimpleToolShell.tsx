import { ArrowRight, Share2, Download, type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Icon3D, TOOL_ICONS } from '../../ui/Icon3D';
import { useLanguage } from '../../../contexts/LanguageContext';

interface SimpleToolShellProps {
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  /** Emoji icon (legacy support) */
  icon?: string;
  /** Lucide icon component (preferred) */
  iconComponent?: LucideIcon;
  /** Icon3D theme (used with iconComponent) */
  iconTheme?: string;
  /** Tool ID for auto-mapping from TOOL_ICONS */
  toolId?: string;
  gradientFrom: string;
  gradientTo: string;
  onBack: () => void;
  children: React.ReactNode;
  showShareButton?: boolean;
  backLabel?: string;
}

export function SimpleToolShell({
  title,
  titleEn,
  subtitle,
  subtitleEn,
  icon,
  iconComponent,
  iconTheme = 'blue',
  toolId,
  gradientFrom,
  gradientTo,
  onBack,
  children,
  showShareButton = false,
  backLabel,
}: SimpleToolShellProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  // Resolve icon: toolId mapping > iconComponent > emoji
  const resolvedIcon = (() => {
    if (toolId && TOOL_ICONS[toolId]) {
      return <Icon3D icon={TOOL_ICONS[toolId].icon} theme={TOOL_ICONS[toolId].theme} size="lg" hoverable={false} />;
    }
    if (iconComponent) {
      return <Icon3D icon={iconComponent} theme={iconTheme} size="lg" hoverable={false} />;
    }
    // Fallback to emoji
    return (
      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-inner">
        {icon}
      </div>
    );
  })();

  const displayTitle = isEn && titleEn ? titleEn : title;
  const displaySubtitle = isEn && subtitleEn ? subtitleEn : subtitle;

  return (
    <div className="min-h-screen bg-background pb-32" dir="rtl">
      {/* Header - compact & clean */}
      <div
        className="px-5 pt-6 pb-8 rounded-b-[32px] shadow-lg relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-12 -right-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4 group"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}
          >
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>{isEn ? 'Back' : (backLabel || 'رجوع')}</span>
          </button>

          <div className="flex items-center gap-4">
            {resolvedIcon}
            <div className="flex-1">
              <h1
                className="text-white text-xl leading-tight"
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}
              >
                {displayTitle}
              </h1>
              {displaySubtitle && (
                <p className="text-white/80 text-sm mt-0.5" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {displaySubtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="px-4 -mt-4 relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

// ═══════════════ Shared UI Components ═══════════════

export function InputCard({ children, title, titleEn }: { children: React.ReactNode; title?: string; titleEn?: string }) {
  let displayTitle = title;
  try {
    const { language } = useLanguage();
    if (language === 'en' && titleEn) displayTitle = titleEn;
  } catch { /* LanguageContext not available */ }

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-[4px] border-gray-200/60 mb-4 transition-all hover:border-[#2AA676]/30">
      {displayTitle && (
        <h3 className="text-[#1A1A1A] font-cairo font-bold text-base mb-4 flex items-center gap-2">
          {displayTitle}
        </h3>
      )}
      {children}
    </div>
  );
}

export function InputField({
  label,
  labelEn,
  value,
  onChange,
  type = 'number',
  placeholder,
  placeholderEn,
  suffix,
  min,
  max,
}: {
  label: string;
  labelEn?: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  placeholderEn?: string;
  suffix?: string;
  min?: number;
  max?: number;
}) {
  let displayLabel = label;
  let displayPlaceholder = placeholder;
  try {
    const { language } = useLanguage();
    if (language === 'en') {
      if (labelEn) displayLabel = labelEn;
      if (placeholderEn) displayPlaceholder = placeholderEn;
    }
  } catch { /* LanguageContext not available */ }

  return (
    <div className="mb-3">
      <label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo">{displayLabel}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={displayPlaceholder}
          min={min}
          max={max}
          className="w-full p-3.5 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-[#2AA676] focus:ring-2 focus:ring-[#2AA676]/10 transition-all font-cairo text-[#1A1A1A]"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        />
        {suffix && (
          <span className="absolute left-3.5 top-3.5 text-gray-400 text-xs font-bold">{suffix}</span>
        )}
      </div>
    </div>
  );
}

export function SliderInput({
  label,
  labelEn,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = '',
  showValue = true,
}: {
  label: string;
  labelEn?: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  showValue?: boolean;
}) {
  let displayLabel = label;
  try {
    const { language } = useLanguage();
    if (language === 'en' && labelEn) displayLabel = labelEn;
  } catch { /* LanguageContext not available */ }

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-bold text-gray-500 font-cairo">{displayLabel}</label>
        {showValue && (
          <span className="text-sm font-bold text-[#2AA676] font-cairo bg-[#2AA676]/10 px-2.5 py-0.5 rounded-full">
            {value.toLocaleString()} {suffix}
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer slider-green"
          style={{
            background: `linear-gradient(to left, #2AA676 ${percentage}%, #E5E7EB ${percentage}%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-400">{min.toLocaleString()}</span>
          <span className="text-[10px] text-gray-400">{max.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export function OptionSelector({
  label,
  labelEn,
  options,
  value,
  onChange,
}: {
  label: string;
  labelEn?: string;
  options: { id: string; label: string; labelEn?: string; icon?: React.ReactNode; desc?: string; descEn?: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  let displayLabel = label;
  let isEnMode = false;
  try {
    const { language } = useLanguage();
    isEnMode = language === 'en';
    if (isEnMode && labelEn) displayLabel = labelEn;
  } catch { /* LanguageContext not available */ }

  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-gray-500 mb-2 font-cairo">{displayLabel}</label>
      <div className={`grid gap-2 ${options.length <= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`p-3 rounded-xl border-[4px] transition-all text-center ${
              value === opt.id
                ? 'border-[#2AA676] bg-[#2AA676]/5 shadow-sm'
                : 'border-gray-200/60 bg-white hover:border-gray-300'
            }`}
          >
            {opt.icon && <div className="text-xl mb-1 flex items-center justify-center">{opt.icon}</div>}
            <div
              className={`text-xs font-bold font-cairo ${
                value === opt.id ? 'text-[#2AA676]' : 'text-gray-600'
              }`}
            >
              {isEnMode && opt.labelEn ? opt.labelEn : opt.label}
            </div>
            {(opt.desc || opt.descEn) && (
              <div className="text-[9px] text-gray-400 mt-0.5">
                {isEnMode && opt.descEn ? opt.descEn : opt.desc}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CounterInput({
  label,
  labelEn,
  value,
  onChange,
  min = 0,
  max = 20,
}: {
  label: string;
  labelEn?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}) {
  let displayLabel = label;
  try {
    const { language } = useLanguage();
    if (language === 'en' && labelEn) displayLabel = labelEn;
  } catch { /* LanguageContext not available */ }

  return (
    <div className="flex items-center justify-between mb-3 bg-gray-50/80 rounded-xl p-3 border-[4px] border-gray-200/60">
      <span className="text-sm font-bold text-gray-600 font-cairo">{displayLabel}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-9 h-9 rounded-full bg-white border-[4px] border-gray-200/60 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg font-bold"
        >
          −
        </button>
        <span className="w-8 text-center text-lg font-bold text-[#1A1A1A] font-cairo">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-9 h-9 rounded-full bg-[#2AA676] text-white flex items-center justify-center hover:bg-[#238c63] transition-colors text-lg font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function ActionButton({
  onClick,
  text,
  textEn,
  icon,
  iconComponent: IconComp,
  loading = false,
  variant = 'primary',
  disabled = false,
}: {
  onClick: () => void;
  text: string;
  textEn?: string;
  icon?: string;
  iconComponent?: LucideIcon;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'dark';
  disabled?: boolean;
}) {
  let displayText = text;
  try {
    const { language } = useLanguage();
    if (language === 'en' && textEn) displayText = textEn;
  } catch { /* LanguageContext not available */ }

  const baseClass =
    'w-full py-4 rounded-2xl font-bold font-cairo text-base flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-50 shadow-lg border-[4px] border-transparent';
  const variants = {
    primary: 'bg-[#2AA676] hover:bg-[#238c63] text-white shadow-[#2AA676]/20 border-[#238c63]/30',
    secondary: 'bg-[#C8A86A] hover:bg-[#b8984f] text-white shadow-[#C8A86A]/20 border-[#b8984f]/30',
    dark: 'bg-[#1A1A1A] hover:bg-black text-white shadow-black/10 border-gray-800/30',
  };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseClass} ${variants[variant]}`}>
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {IconComp && <IconComp className="w-5 h-5" />}
          {icon && !IconComp && <span className="text-lg">{icon}</span>}
          <span>{displayText}</span>
        </>
      )}
    </button>
  );
}

export function ResultCard({
  title,
  titleEn,
  value,
  subtitle,
  subtitleEn,
  icon,
  iconComponent: IconComp,
  highlight = false,
}: {
  title: string;
  titleEn?: string;
  value: string;
  subtitle?: string;
  subtitleEn?: string;
  icon?: string;
  iconComponent?: LucideIcon;
  highlight?: boolean;
}) {
  let displayTitle = title;
  let displaySubtitle = subtitle;
  try {
    const { language } = useLanguage();
    if (language === 'en') {
      if (titleEn) displayTitle = titleEn;
      if (subtitleEn) displaySubtitle = subtitleEn;
    }
  } catch { /* LanguageContext not available */ }

  return (
    <div
      className={`rounded-2xl p-4 flex items-center gap-3 border-[4px] ${
        highlight
          ? 'bg-gradient-to-l from-[#2AA676] to-[#1F8A5E] text-white shadow-lg border-[#1F8A5E]/50'
          : 'bg-white border-gray-200/60 shadow-sm'
      }`}
    >
      {(IconComp || icon) && (
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            highlight ? 'bg-white/20' : 'bg-gray-50'
          }`}
        >
          {IconComp ? (
            <IconComp className={`w-5 h-5 ${highlight ? 'text-white' : 'text-[#2AA676]'}`} />
          ) : (
            <span className="text-lg">{icon}</span>
          )}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-cairo ${highlight ? 'text-white/80' : 'text-gray-500'}`}>{displayTitle}</div>
        <div className={`text-base font-bold font-cairo ${highlight ? 'text-white' : 'text-[#1A1A1A]'}`}>{value}</div>
      </div>
      {displaySubtitle && (
        <div className={`text-xs font-cairo ${highlight ? 'text-white/70' : 'text-gray-400'}`}>{displaySubtitle}</div>
      )}
    </div>
  );
}

export function Divider({ text, textEn }: { text?: string; textEn?: string }) {
  let displayText = text;
  try {
    const { language } = useLanguage();
    if (language === 'en' && textEn) displayText = textEn;
  } catch { /* LanguageContext not available */ }

  if (displayText) {
    return (
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-bold text-gray-400 font-cairo">{displayText}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    );
  }
  return <div className="h-px bg-gray-200 my-4" />;
}

export function formatAED(amount: number): string {
  return `${amount.toLocaleString('en-US')} د.إ`;
}