/**
 * ProviderChatCard.tsx — بطاقة مزود الخدمة في شات الوكيل الذكي
 * تظهر تلقائياً عند سؤال العميل عن أي مزود خدمة
 */

import { Star, MapPin, Phone, MessageSquare, Shield, Navigation, ExternalLink, Briefcase, CheckCircle } from 'lucide-react';

export interface ProviderCardData {
  id: string;
  name: string;
  business_name?: string;
  category?: string;
  specialties?: string[];
  avatar_url?: string;
  phone?: string;
  whatsapp?: string;
  emirate?: string;
  city?: string;
  rating?: number;
  projects_count?: number;
  is_verified?: boolean;
  lat?: number;
  lng?: number;
  display_id?: string;
}

interface ProviderChatCardProps {
  provider: ProviderCardData;
  isEn: boolean;
  onViewProfile?: () => void;
}

export function ProviderChatCard({ provider, isEn, onViewProfile }: ProviderChatCardProps) {
  const fontFamily = isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif';

  const googleMapsUrl = provider.lat && provider.lng
    ? `https://www.google.com/maps?q=${provider.lat},${provider.lng}&query=${encodeURIComponent(provider.business_name || provider.name)}`
    : provider.city
    ? `https://www.google.com/maps/search/${encodeURIComponent((provider.business_name || provider.name) + ' ' + (provider.city || ''))}`
    : null;

  const waUrl = `https://wa.me/${(provider.whatsapp || provider.phone || '').replace(/[^0-9]/g, '')}`;

  return (
    <div
      className="rounded-2xl overflow-hidden w-full max-w-xs"
      style={{
        background: 'rgba(255,255,255,0.97)',
        border: '1px solid rgba(212,175,55,0.2)',
        boxShadow: '0 4px 24px rgba(31,61,43,0.12)',
      }}
    >
      {/* Header */}
      <div
        className="p-3 flex items-center gap-3 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1F3D2B 0%, #3B5BFE 100%)' }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #D4AF37 0%, transparent 60%)' }} />
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xl font-black overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.4) 0%, rgba(59,91,254,0.3) 100%)', border: '2px solid rgba(212,175,55,0.4)' }}
        >
          {provider.avatar_url ? (
            <img src={provider.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            (provider.name[0] || 'م').toUpperCase()
          )}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0 relative z-10" dir={isEn ? 'ltr' : 'rtl'}>
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-white font-bold text-sm truncate" style={{ fontFamily }}>{provider.name}</p>
            {provider.is_verified && <Shield className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />}
          </div>
          {provider.business_name && (
            <p className="text-white/60 text-xs truncate" style={{ fontFamily }}>{provider.business_name}</p>
          )}
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {provider.category && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.25)', color: '#FFD700' }}>
                {provider.category}
              </span>
            )}
            {(provider.city || provider.emirate) && (
              <span className="text-[10px] text-white/50 flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" />
                {provider.city || provider.emirate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-3 py-2 flex items-center justify-between border-b" style={{ borderColor: 'rgba(212,175,55,0.1)' }} dir={isEn ? 'ltr' : 'rtl'}>
        <div className="flex items-center gap-3">
          {provider.rating !== undefined && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-xs font-bold text-[#1F3D2B]" style={{ fontFamily }}>{provider.rating.toFixed(1)}</span>
            </div>
          )}
          {provider.projects_count !== undefined && (
            <div className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-[#3B5BFE]" />
              <span className="text-xs font-bold text-[#1F3D2B]" style={{ fontFamily }}>{provider.projects_count} {isEn ? 'proj.' : 'مشروع'}</span>
            </div>
          )}
        </div>
        {provider.is_verified && (
          <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: '#D4AF37', fontFamily }}>
            <CheckCircle className="w-3 h-3" />
            {isEn ? 'Verified' : 'موثّق'}
          </span>
        )}
      </div>

      {/* Specialties */}
      {provider.specialties && provider.specialties.length > 0 && (
        <div className="px-3 py-2 border-b" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
          <div className="flex flex-wrap gap-1">
            {provider.specialties.slice(0, 3).map((s, i) => (
              <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg" style={{ background: 'rgba(59,91,254,0.07)', color: '#3B5BFE', border: '1px solid rgba(59,91,254,0.12)', fontFamily }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="p-2.5 flex gap-2" dir={isEn ? 'ltr' : 'rtl'}>
        {(provider.whatsapp || provider.phone) && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold"
            style={{ background: '#25D366', color: '#fff', fontFamily }}
            onClick={e => e.stopPropagation()}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {isEn ? 'Chat' : 'واتساب'}
          </a>
        )}
        {provider.phone && (
          <a
            href={`tel:${provider.phone}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(31,61,43,0.08)', color: '#1F3D2B', fontFamily }}
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
        )}
        {googleMapsUrl && (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(59,91,254,0.08)', color: '#3B5BFE', fontFamily }}
            onClick={e => e.stopPropagation()}
          >
            <Navigation className="w-3.5 h-3.5" />
          </a>
        )}
        {onViewProfile && (
          <button
            onClick={onViewProfile}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(212,175,55,0.12)', color: '#8B6914', fontFamily }}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
