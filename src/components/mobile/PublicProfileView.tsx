/**
 * PublicProfileView.tsx — كيف يرى الآخرون ملفك الشخصي
 * عرض شامل وجميل لبطاقة مزود الخدمة كما تظهر للعملاء
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Star, MapPin, Phone, MessageSquare, Shield, ChevronLeft,
  CheckCircle, Clock, ExternalLink, Share2, Copy, Award, Briefcase,
  Navigation, Globe, Mail
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PublicProfileViewProps {
  profile: {
    full_name?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    avatar_url?: string;
    role?: string;
    bio?: string;
    business_name?: string;
    specialties?: string[];
    emirate?: string;
    city?: string;
    district?: string;
    is_verified?: boolean;
    display_id?: string;
    projects_count?: number;
    completion_rate?: number;
    rating?: number;
    created_at?: string;
    lat?: number;
    lng?: number;
  };
  isEn: boolean;
  onClose: () => void;
}

export function PublicProfileView({ profile, isEn, onClose }: PublicProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'location' | 'contact'>('info');
  const fontFamily = isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif';

  const isProvider = profile.role === 'provider';
  const displayName = profile.full_name || (isEn ? 'User' : 'مستخدم');
  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString(isEn ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'long' })
    : '';

  const googleMapsUrl = profile.lat && profile.lng
    ? `https://www.google.com/maps?q=${profile.lat},${profile.lng}&query=${encodeURIComponent(profile.business_name || displayName)}`
    : profile.city
    ? `https://www.google.com/maps/search/${encodeURIComponent((profile.business_name || displayName) + ' ' + (profile.city || ''))}`
    : null;

  const handleShare = async () => {
    const text = isEn
      ? `Check out ${displayName} on Beit Al Reef — ${profile.business_name || ''} ${profile.city ? '| ' + profile.city : ''}`
      : `تفضل بزيارة ملف ${displayName} في بيت الريف — ${profile.business_name || ''} ${profile.city ? '| ' + profile.city : ''}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: displayName, text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success(isEn ? 'Copied to clipboard!' : 'تم النسخ!');
      }
    } catch { /* silent */ }
  };

  const tabs = [
    { id: 'info', ar: 'نبذة', en: 'About' },
    { id: 'location', ar: 'الموقع', en: 'Location' },
    { id: 'contact', ar: 'التواصل', en: 'Contact' },
  ] as const;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-end justify-center"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="w-full max-w-md rounded-t-3xl overflow-hidden"
          style={{ background: '#F5EEE1', maxHeight: '92vh', overflowY: 'auto' }}
          onClick={e => e.stopPropagation()}
          dir={isEn ? 'ltr' : 'rtl'}
        >
          {/* ── HERO ── */}
          <div className="relative overflow-hidden" style={{ minHeight: 200 }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1F3D2B 0%, #2d5a3f 40%, #3B5BFE 100%)' }} />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #D4AF37 0%, transparent 50%)' }} />

            {/* Header buttons */}
            <div className="absolute top-4 right-4 left-4 flex justify-between items-center z-20">
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                >
                  <Share2 className="w-4 h-4 text-white" />
                </button>
                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <Navigation className="w-4 h-4 text-white" />
                  </a>
                )}
              </div>
            </div>

            {/* Avatar + Name */}
            <div className="relative z-10 pt-14 pb-14 px-5 flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-white text-4xl font-black"
                  style={{ background: 'linear-gradient(135deg, #3B5BFE 0%, #C8A86A 100%)', boxShadow: '0 0 0 4px rgba(212,175,55,0.5)' }}
                >
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (displayName[0] || 'U').toUpperCase()
                  )}
                </div>
                {profile.is_verified && (
                  <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md" style={{ background: '#D4AF37' }}>
                    <Shield className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
              <h2 className="text-white text-xl font-black mb-1" style={{ fontFamily, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                {displayName}
              </h2>
              {isProvider && profile.business_name && (
                <p className="text-white/70 text-sm font-semibold mb-1" style={{ fontFamily }}>{profile.business_name}</p>
              )}
              <div className="flex flex-wrap justify-center gap-2">
                {profile.is_verified && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.3)', color: '#FFD700', border: '1px solid rgba(212,175,55,0.4)', fontFamily }}>
                    {isEn ? 'Verified' : 'موثّق'}
                  </span>
                )}
                {(profile.city || profile.emirate) && (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
                    <MapPin className="w-3 h-3" />
                    {profile.city || profile.emirate}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── STATS ── */}
          <div className="px-4 -mt-8 mb-4 relative z-10">
            <div className="rounded-2xl p-4 grid grid-cols-3 gap-3" style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(31,61,43,0.12)', border: '1px solid rgba(212,175,55,0.15)' }}>
              {[
                { label: isEn ? 'Projects' : 'المشاريع', value: String(profile.projects_count || 0), color: '#3B5BFE' },
                { label: isEn ? 'Rating' : 'التقييم', value: profile.rating ? `${profile.rating}` : '—', color: '#D4AF37', icon: Star },
                { label: isEn ? 'Completion' : 'الإنجاز', value: profile.completion_rate ? `${profile.completion_rate}%` : '—', color: '#C8A86A' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl font-black mb-0.5" style={{ color: stat.color, fontFamily }}>{stat.value}</p>
                  <p className="text-[11px] text-[#1F3D2B]/50 font-semibold" style={{ fontFamily }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── TABS ── */}
          <div className="px-4 mb-4">
            <div className="flex rounded-2xl p-1 gap-1" style={{ background: 'rgba(255,255,255,0.7)' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    fontFamily,
                    background: activeTab === tab.id ? '#1F3D2B' : 'transparent',
                    color: activeTab === tab.id ? '#fff' : '#1F3D2B',
                  }}
                >
                  {isEn ? tab.en : tab.ar}
                </button>
              ))}
            </div>
          </div>

          {/* ── TAB CONTENT ── */}
          <div className="px-4 pb-8 space-y-3">
            {activeTab === 'info' && (
              <>
                {profile.bio && (
                  <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(212,175,55,0.12)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 rounded-full" style={{ background: '#3B5BFE' }} />
                      <p className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily }}>{isEn ? 'About' : 'نبذة تعريفية'}</p>
                    </div>
                    <p className="text-sm text-[#1F3D2B]/70 leading-relaxed" style={{ fontFamily }}>{profile.bio}</p>
                  </div>
                )}
                {profile.specialties && profile.specialties.length > 0 && (
                  <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(212,175,55,0.12)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-4 rounded-full" style={{ background: '#D4AF37' }} />
                      <p className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily }}>{isEn ? 'Specialties' : 'التخصصات'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.specialties.map((s: string, i: number) => (
                        <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ background: 'rgba(59,91,254,0.08)', color: '#3B5BFE', border: '1px solid rgba(59,91,254,0.15)', fontFamily }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {memberSince && (
                  <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(212,175,55,0.12)' }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#D4AF3715' }}>
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#1F3D2B]/40 font-medium" style={{ fontFamily }}>{isEn ? 'Member Since' : 'عضو منذ'}</p>
                      <p className="text-sm font-semibold text-[#1F3D2B]" style={{ fontFamily }}>{memberSince}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'location' && (
              <>
                {(profile.emirate || profile.city) ? (
                  <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(212,175,55,0.12)' }}>
                    <div className="px-4 py-3 border-b border-[#F5EEE1] flex items-center gap-2">
                      <div className="w-1 h-4 rounded-full" style={{ background: '#D4AF37' }} />
                      <h3 className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily }}>{isEn ? 'Location' : 'الموقع'}</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#EF444415' }}>
                          <MapPin className="w-4 h-4 text-[#EF4444]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1F3D2B]" style={{ fontFamily }}>
                            {[profile.emirate, profile.city, profile.district].filter(Boolean).join(' · ')}
                          </p>
                          <p className="text-[11px] text-[#1F3D2B]/40" style={{ fontFamily }}>{isEn ? 'UAE' : 'الإمارات العربية المتحدة'}</p>
                        </div>
                      </div>
                      {googleMapsUrl && (
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all"
                          style={{ background: 'linear-gradient(135deg, #1F3D2B, #3B5BFE)', color: '#fff', fontFamily }}
                          onClick={e => e.stopPropagation()}
                        >
                          <Navigation className="w-4 h-4" />
                          {isEn ? 'View on Google Maps' : 'عرض على خرائط جوجل'}
                          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(212,175,55,0.12)' }}>
                    <MapPin className="w-10 h-10 text-[#1F3D2B]/20 mx-auto mb-2" />
                    <p className="text-sm text-[#1F3D2B]/40" style={{ fontFamily }}>{isEn ? 'Location not set' : 'لم يتم تحديد الموقع'}</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'contact' && (
              <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(212,175,55,0.12)' }}>
                <div className="px-4 py-3 border-b border-[#F5EEE1] flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full" style={{ background: '#3B5BFE' }} />
                  <h3 className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily }}>{isEn ? 'Contact' : 'التواصل'}</h3>
                </div>
                <div className="divide-y divide-[#F5EEE1]">
                  {profile.phone && (
                    <a href={`tel:${profile.phone}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5EEE1]/50 transition-colors">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#1F3D2B15' }}>
                        <Phone className="w-4 h-4 text-[#1F3D2B]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] text-[#1F3D2B]/40" style={{ fontFamily }}>{isEn ? 'Phone' : 'الهاتف'}</p>
                        <p className="text-sm font-semibold text-[#3B5BFE]" dir="ltr" style={{ fontFamily: 'monospace' }}>{profile.phone}</p>
                      </div>
                    </a>
                  )}
                  {(profile.whatsapp || profile.phone) && (
                    <a href={`https://wa.me/${(profile.whatsapp || profile.phone || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5EEE1]/50 transition-colors" onClick={e => e.stopPropagation()}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#25D36615' }}>
                        <MessageSquare className="w-4 h-4 text-[#25D366]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] text-[#1F3D2B]/40" style={{ fontFamily }}>WhatsApp</p>
                        <p className="text-sm font-semibold text-[#25D366]" style={{ fontFamily }}>{isEn ? 'Send Message' : 'إرسال رسالة'}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#1F3D2B]/30" />
                    </a>
                  )}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5EEE1]/50 transition-colors">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#3B5BFE15' }}>
                        <Mail className="w-4 h-4 text-[#3B5BFE]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-[#1F3D2B]/40" style={{ fontFamily }}>{isEn ? 'Email' : 'البريد الإلكتروني'}</p>
                        <p className="text-sm font-semibold text-[#3B5BFE] truncate" dir="ltr" style={{ fontFamily: 'monospace' }}>{profile.email}</p>
                      </div>
                    </a>
                  )}
                  {profile.display_id && (
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(profile.display_id || '').catch(() => {});
                        toast.success(isEn ? 'ID Copied!' : 'تم نسخ المعرّف!');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5EEE1]/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#D4AF3715' }}>
                        <Copy className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <div className="flex-1 text-right">
                        <p className="text-[11px] text-[#1F3D2B]/40" style={{ fontFamily }}>{isEn ? 'Profile ID' : 'معرّف الملف'}</p>
                        <p className="text-sm font-semibold text-[#1F3D2B]" dir="ltr" style={{ fontFamily: 'monospace' }}>{profile.display_id}</p>
                      </div>
                      <Copy className="w-3.5 h-3.5 text-[#1F3D2B]/30" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Google Maps Business Card — for providers */}
            {isProvider && (
              <div
                className="rounded-2xl p-4 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1F3D2B, #2d5a3f)', border: '1px solid rgba(212,175,55,0.3)' }}
              >
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #D4AF37 0px, #D4AF37 1px, transparent 1px, transparent 10px)' }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-[#D4AF37]" />
                    <p className="text-sm font-bold text-white" style={{ fontFamily }}>{isEn ? 'Google Maps Business Card' : 'بطاقة خرائط جوجل'}</p>
                  </div>
                  <p className="text-white/60 text-xs mb-3 leading-relaxed" style={{ fontFamily }}>
                    {isEn
                      ? 'This provider has a registered location that appears in Google Maps searches.'
                      : 'لهذا المزود موقع مسجّل يظهر في نتائج بحث خرائط جوجل.'}
                  </p>
                  <div className="flex gap-2">
                    {googleMapsUrl && (
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all"
                        style={{ background: '#D4AF37', color: '#1F3D2B', fontFamily }}
                        onClick={e => e.stopPropagation()}
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        {isEn ? 'Open in Maps' : 'افتح في الخرائط'}
                      </a>
                    )}
                    <button
                      onClick={handleShare}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                      style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.15)', fontFamily }}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
