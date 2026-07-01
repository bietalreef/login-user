import { LucideIcon } from 'lucide-react';
import { Icon3D } from '../ui/Icon3D';

interface GlassCardProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description?: string;
  /** Icon3D color theme — when provided with icon, renders as 3D */
  theme?: string;
}

export function GlassCard({ icon: Icon, emoji, title, description, theme = 'green' }: GlassCardProps) {
  return (
    <div className="group relative overflow-hidden bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-4 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-[#C8A86A]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Content */}
      <div className="relative flex items-start gap-3">
        {/* Icon3D or fallback */}
        <div className="flex-shrink-0">
          {Icon ? (
            <Icon3D icon={Icon} theme={theme} size="sm" hoverable={false} />
          ) : emoji ? (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/10 to-[#C8A86A]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl">{emoji}</span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/10 to-[#C8A86A]/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            </div>
          )}
        </div>
        
        {/* Text */}
        <div className="flex-1 min-w-0">
          <h4 className="text-[#1F3D2B] font-semibold text-sm mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {title}
          </h4>
          {description && (
            <p className="text-[#1F3D2B]/60 text-xs leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}