/**
 * MarketplaceProfile.tsx — Public Marketplace Identity
 * ═════════════════════════════════════════════════════
 * READS ONLY: marketplace_profile:{userId} + presence:{userId}
 * NEVER reads from workspace identity (ws_member)
 * Route: /profile/:id
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router@7.1.1';
import { motion } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { useEffectiveState } from '../../contexts/EffectiveState';
import { usePresence } from '../../contexts/PresenceContext';
import { Icon3D } from '../ui/Icon3D';
import { PresenceDot } from '../ui/PresenceDot';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  getMarketplaceProfile,
  updateMarketplaceProfile,
  type MarketplaceProfile as MPType,
  type PresenceData,
} from '../../utils/identityApi';
import {
  ArrowRight, Shield, MapPin, Briefcase, Users, Star,
  Edit3, Save, X, Loader2, ChevronLeft, Share2, UserPlus,
  UserCheck, Clock, Building2,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const fontCairo = 'Cairo, Tajawal, sans-serif';

export function MarketplaceProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const { state } = useEffectiveState();
  const { fetchPresence } = usePresence();

  const [profile, setProfile] = useState<MPType | null>(null);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [relationship, setRelationship] = useState<any>(null);
  const [isSelf, setIsSelf] = useState(false);
  const [presence, setPresence] = useState<PresenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: '', bio: '', city: '' });

  // Load profile
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      try {
        const data = await getMarketplaceProfile(id);
        setProfile(data.profile);
        setCounts(data.counts);
        setRelationship(data.relationship);
        setIsSelf(data.is_self);
        setEditForm({
          full_name: data.profile.full_name,
          bio: data.profile.bio,
          city: data.profile.city,
        });
        // Fetch presence
        const presences = await fetchPresence([id]);
        setPresence(presences[id] || null);
      } catch (err: any) {
        console.error('MarketplaceProfile load error:', err);
        toast.error(isEn ? 'Failed to load profile' : 'فشل تحميل الملف الشخصي');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { profile: updated } = await updateMarketplaceProfile(editForm);
      setProfile(updated);
      setEditing(false);
      toast.success(isEn ? 'Profile updated' : 'تم تحديث الملف الشخصي');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Styles ──
  const bgClass = isDark ? 'bg-[#1a1a2e]' : 'bg-[#F5EEE1]';
  const cardClass = isDark
    ? 'bg-white/10 backdrop-blur-xl border border-white/15'
    : 'bg-white border-[4px] border-gray-200/60 shadow-sm';
  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/50' : 'text-[#1F3D2B]/50';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const inputClass = `w-full px-4 py-3 rounded-xl border-2 text-sm ${
    isDark
      ? 'bg-white/10 border-white/15 text-white placeholder-white/30'
      : 'bg-[#F5EEE1]/50 border-gray-200 text-[#1F3D2B] placeholder-[#1F3D2B]/30'
  }`;

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${bgClass}`}>
        <Loader2 className={`w-8 h-8 animate-spin ${goldClass}`} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen gap-4 ${bgClass}`}>
        <Icon3D icon={Users} theme="gold" size="lg" />
        <p className={`text-lg font-bold ${textClass}`} style={{ fontFamily: fontCairo }}>
          {isEn ? 'Profile not found' : 'الملف الشخصي غير موجود'}
        </p>
        <button
          onClick={() => navigate('/home')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C8A86A] text-white text-sm font-bold"
        >
          {isEn ? 'Back to Home' : 'العودة للرئيسية'}
        </button>
      </div>
    );
  }

  const roleLabels: Record<string, { ar: string; en: string }> = {
    client: { ar: 'عميل', en: 'Client' },
    provider: { ar: 'مزود خدمة', en: 'Provider' },
    admin: { ar: 'مسؤول', en: 'Admin' },
  };

  return (
    <div
      className={`min-h-screen ${bgClass} pb-20`}
      dir={isEn ? 'ltr' : 'rtl'}
      style={{ fontFamily: fontCairo }}
    >
      {/* ── Header ── */}
      <div className="sticky top-0 z-20 px-4 py-3 flex items-center gap-3"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(26,26,46,0.95), rgba(26,26,46,0.8))'
            : 'linear-gradient(to bottom, rgba(245,238,225,0.95), rgba(245,238,225,0.8))',
          backdropFilter: 'blur(12px)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
          }`}
        >
          <ChevronLeft className={`w-5 h-5 ${textClass} ${isEn ? '' : 'rotate-180'}`} />
        </button>
        <h1 className={`text-lg font-black flex-1 ${textClass}`}>
          {isEn ? 'Public Profile' : 'الملف العام'}
        </h1>
        {isSelf && !editing && (
          <button
            onClick={() => setEditing(true)}
            className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
          >
            <Edit3 className={`w-4.5 h-4.5 ${goldClass}`} />
          </button>
        )}
      </div>

      {/* ── Profile Card ── */}
      <div className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardClass} rounded-3xl overflow-hidden`}
        >
          {/* Cover gradient */}
          <div className="h-24 bg-gradient-to-br from-[#D4AF37]/30 via-[#3B5BFE]/20 to-[#C8A86A]/30 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Avatar + Info */}
          <div className="px-5 pb-5 -mt-12 relative">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className={`w-20 h-20 rounded-2xl overflow-hidden border-4 ${
                  isDark ? 'border-[#1a1a2e]' : 'border-white'
                } shadow-lg`}>
                  {profile.avatar_url ? (
                    <ImageWithFallback
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#C8A86A] flex items-center justify-center">
                      <span className="text-white text-2xl font-black">
                        {profile.full_name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>
                {/* Presence dot */}
                <div className="absolute -bottom-0.5 -right-0.5">
                  <PresenceDot
                    status={presence?.status || 'offline'}
                    size="md"
                  />
                </div>
              </div>

              <div className="flex-1 pt-12">
                {editing ? (
                  <input
                    value={editForm.full_name}
                    onChange={(e) => setEditForm(p => ({ ...p, full_name: e.target.value }))}
                    className={inputClass}
                    placeholder={isEn ? 'Full Name' : 'الاسم الكامل'}
                  />
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className={`text-xl font-black ${textClass}`}>
                      {profile.full_name || (isEn ? 'Unknown' : 'غير معروف')}
                    </h2>
                    {profile.is_verified && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#3B5BFE]/10">
                        <Shield className="w-3 h-3 text-[#3B5BFE]" />
                        <span className="text-[10px] font-bold text-[#3B5BFE]">
                          {isEn ? 'Verified' : 'موثّق'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                    isDark ? 'bg-[#D4AF37]/15 text-[#FFD700]' : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                  }`}>
                    {roleLabels[profile.role]?.[isEn ? 'en' : 'ar'] || profile.role}
                  </span>
                  {profile.provider_type && (
                    <span className={`text-xs ${mutedClass}`}>
                      <Briefcase className="w-3 h-3 inline" />{' '}
                      {profile.provider_type === 'company'
                        ? (isEn ? 'Company' : 'شركة')
                        : (isEn ? 'Craftsman' : 'حرفي')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Presence text */}
            <div className="mt-3">
              <PresenceDot
                status={presence?.status || 'offline'}
                lastSeenAt={presence?.last_seen_at}
                showText
                isEn={isEn}
                size="sm"
              />
            </div>

            {/* Stats row */}
            <div className={`flex items-center gap-6 mt-4 pt-4 border-t ${
              isDark ? 'border-white/10' : 'border-gray-200/60'
            }`}>
              <div className="text-center">
                <span className={`text-lg font-black ${goldClass}`}>{counts.followers}</span>
                <p className={`text-[10px] font-semibold ${mutedClass}`}>
                  {isEn ? 'Followers' : 'متابعين'}
                </p>
              </div>
              <div className="text-center">
                <span className={`text-lg font-black ${goldClass}`}>{counts.following}</span>
                <p className={`text-[10px] font-semibold ${mutedClass}`}>
                  {isEn ? 'Following' : 'يتابع'}
                </p>
              </div>
              {profile.city && (
                <div className="flex items-center gap-1">
                  <MapPin className={`w-3.5 h-3.5 ${mutedClass}`} />
                  <span className={`text-xs font-semibold ${mutedClass}`}>{profile.city}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="mt-4">
              {editing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(p => ({ ...p, bio: e.target.value }))}
                  className={`${inputClass} min-h-[80px] resize-none`}
                  placeholder={isEn ? 'Write something about yourself...' : 'اكتب شيئاً عن نفسك...'}
                />
              ) : (
                profile.bio && (
                  <p className={`text-sm leading-relaxed ${mutedClass}`}>{profile.bio}</p>
                )
              )}
            </div>

            {/* City (edit mode) */}
            {editing && (
              <div className="mt-3">
                <input
                  value={editForm.city}
                  onChange={(e) => setEditForm(p => ({ ...p, city: e.target.value }))}
                  className={inputClass}
                  placeholder={isEn ? 'City / Emirate' : 'المدينة / الإمارة'}
                />
              </div>
            )}

            {/* Edit actions */}
            {editing && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C8A86A] text-white text-sm font-bold disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isEn ? 'Save' : 'حفظ'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold ${
                    isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-[#1F3D2B]'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Action buttons (for other users) */}
            {!isSelf && state.isAuthenticated && !editing && (
              <div className="flex gap-3 mt-4">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#3B5BFE] to-[#5B7FE8] text-white text-sm font-bold"
                  onClick={() => toast.info(isEn ? 'Social features coming soon' : 'الميزات الاجتماعية قريباً')}
                >
                  {relationship?.status === 'accepted' ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      {isEn ? 'Following' : 'متابَع'}
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      {isEn ? 'Follow' : 'متابعة'}
                    </>
                  )}
                </button>
                <button
                  className={`px-4 py-3 rounded-xl text-sm font-bold ${
                    isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-[#1F3D2B]'
                  }`}
                  onClick={() => toast.info(isEn ? 'Messaging coming in Phase 5' : 'المراسلة في المرحلة 5')}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Details Section ── */}
      {profile.role === 'provider' && (
        <div className="px-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${cardClass} rounded-2xl p-5`}
          >
            <h3 className={`text-sm font-black mb-3 ${textClass}`}>
              {isEn ? 'Provider Details' : 'تفاصيل المزود'}
            </h3>

            {profile.business_name && (
              <div className="flex items-center gap-2 mb-2.5">
                <Building2 className={`w-4 h-4 ${goldClass}`} />
                <span className={`text-sm font-semibold ${textClass}`}>{profile.business_name}</span>
              </div>
            )}

            {profile.specialties?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {profile.specialties.map((s, i) => (
                  <span
                    key={i}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                      isDark ? 'bg-[#D4AF37]/10 text-[#FFD700]' : 'bg-[#D4AF37]/8 text-[#D4AF37]'
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* ── Source Label ── */}
      <div className="px-4 mt-6">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
          isDark ? 'bg-white/5' : 'bg-[#D4AF37]/5'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#FFD700]' : 'bg-[#D4AF37]'}`} />
          <span className={`text-[10px] font-bold ${mutedClass}`}>
            {isEn
              ? 'Source: Marketplace Public Profile'
              : 'المصدر: الملف العام في السوق'}
          </span>
        </div>
      </div>
    </div>
  );
}