import { Settings, HelpCircle, LogOut, ChevronLeft, Shield, Bell, Moon, Sun, MapPin, Lock, Camera, Edit3, Mail, Phone, Save, Volume2, VolumeX, Trash2, MessageSquare, ShoppingCart, Star, Wallet, Loader2, Info, Scale, ZoomIn, ZoomOut, ShieldAlert, RefreshCw, Eraser, Package, Briefcase, Eye, Navigation, BellRing } from 'lucide-react';
// ShoppingBag not available — using ShoppingCart as alias
const ShoppingBag = ShoppingCart;
// Coins not available in this lucide version — using Wallet as alias
const Coins = Wallet;
import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { ProfileLocationSetup } from './ProfileLocationSetup';
import { useUser } from '../../utils/UserContext';
import { useWallet } from '../../contexts/WalletContext';
import { SubscriptionsScreen } from './SubscriptionsScreen';
import { AIToolsDashboard } from './AIToolsDashboard';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';
import { useNavigate, useSearchParams } from 'react-router@7.1.1';
import { AboutScreen, TermsScreen } from './AboutTermsScreens';
import { useLanguage } from '../../contexts/LanguageContext';
import { useZoom } from '../../contexts/ZoomContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon3D } from '../ui/Icon3D';
import { BaitSwitch } from '../ui/BaitSwitch';
import { IDCopyBox } from './IDCopyBox';
import { PublicProfileView } from './PublicProfileView';

// ─── Content Protection Hook ───
function useContentProtection() {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    // Prevent print screen and common screenshot shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p') || (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5'))) {
        e.preventDefault();
        setIsBlurred(true);
        setTimeout(() => setIsBlurred(false), 2000);
      }
    };
    // Detect tab visibility change (user might be screenshotting)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
      } else {
        setTimeout(() => setIsBlurred(false), 500);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isBlurred;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

type ProfileSection = 'main' | 'edit' | 'settings' | 'orders' | 'support' | 'subscriptions' | 'ai-tools' | 'location' | 'about' | 'terms';

// ─── Permission Helpers ───
async function requestNotificationPermission(): Promise<'granted' | 'denied' | 'default'> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return 'denied';
  }
}

async function requestLocationPermission(): Promise<boolean> {
  if (!('geolocation' in navigator)) return false;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      () => resolve(false),
      { timeout: 5000 }
    );
  });
}

async function saveProviderCard(profile: any, projectId: string, publicAnonKey: string, token: string) {
  try {
    const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a/provider-card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        'X-User-Token': token,
      },
      body: JSON.stringify({
        name: profile.full_name,
        business_name: profile.business_name,
        category: profile.specialties?.[0] || '',
        specialties: profile.specialties || [],
        avatar_url: profile.avatar_url,
        phone: profile.phone,
        whatsapp: profile.whatsapp,
        emirate: profile.emirate,
        city: profile.city,
        district: profile.district,
        rating: profile.rating,
        projects_count: profile.projects_count,
        is_verified: profile.is_verified,
        display_id: profile.display_id,
        lat: profile.lat,
        lng: profile.lng,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
type OrderTab = 'active' | 'completed' | 'cancelled';

const roleLabels: Record<string, Record<string, string>> = {
  client: { ar: 'عميل', en: 'Client' },
  provider: { ar: 'مزود خدمة', en: 'Service Provider' },
  admin: { ar: 'مدير', en: 'Admin' },
  guest: { ar: 'زائر', en: 'Guest' },
};

export function ProfileScreen() {
  const { profile, updateProfile, refreshProfile, logout } = useUser();
  const { balance: walletBalance } = useWallet();
  const [section, setSection] = useState<ProfileSection>('main');
  const [editName, setEditName] = useState(profile?.full_name || '');
  const [editPhone, setEditPhone] = useState(profile?.phone || '');
  const [editWhatsapp, setEditWhatsapp] = useState(profile?.whatsapp || '');
  const [editBio, setEditBio] = useState(profile?.bio || '');
  const [orderTab, setOrderTab] = useState<OrderTab>('active');
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPublicView, setShowPublicView] = useState(false);
  const [notifPermission, setNotifPermission] = useState<string>('Notification' in window ? Notification.permission : 'denied');
  const [isRegisteringCard, setIsRegisteringCard] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const isBlurred = useContentProtection();
  const { zoomLevel, zoomIn, zoomOut, resetZoom } = useZoom();
  const { theme, setTheme } = useTheme();

  // ─── Sync edit fields when profile loads/changes ───
  useEffect(() => {
    if (profile) {
      setEditName(profile.full_name || '');
      setEditPhone(profile.phone || '');
      setEditWhatsapp(profile.whatsapp || '');
      setEditBio(profile.bio || '');
    }
  }, [profile?.full_name, profile?.phone, profile?.whatsapp, profile?.bio]);

  // ─── Read initial section from URL search params ───
  useEffect(() => {
    const sectionParam = searchParams.get('section');
    if (sectionParam && ['settings', 'orders', 'edit', 'support', 'subscriptions', 'location', 'about', 'terms'].includes(sectionParam)) {
      setSection(sectionParam as ProfileSection);
    }
  }, [searchParams]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: editName,
        phone: editPhone,
        whatsapp: editWhatsapp,
        bio: editBio,
      });
      toast.success(isEn ? 'Profile updated successfully' : 'تم تحديث الملف الشخصي بنجاح');
      setSection('main');
    } catch {
      toast.error(isEn ? 'Failed to update profile' : 'فشل في تحديث الملف الشخصي');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      toast.error('يجب اختيار صورة (jpg, png, webp)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن لا يتجاوز 5MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploadingAvatar(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        toast.error('يجب تسجيل الدخول أولاً');
        setAvatarPreview(null);
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch(`${API_BASE}/avatar/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': token,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('تم تغيير الصورة الشخصية بنجاح!');
        // Refresh profile to get new avatar_url
        await refreshProfile();
        setAvatarPreview(null);
      } else {
        toast.error(data.error || 'فشل في رفع الصورة');
        setAvatarPreview(null);
      }
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      toast.error('حدث خطأ أثناء رفع الصورة');
      setAvatarPreview(null);
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const currentAvatar = avatarPreview || profile?.avatar_url;

  const handleRequestNotifications = async () => {
    const result = await requestNotificationPermission();
    setNotifPermission(result);
    if (result === 'granted') {
      toast.success(isEn ? 'Notifications enabled!' : 'تم تفعيل الإشعارات!');
    } else {
      toast.info(isEn ? 'Enable notifications from browser settings' : 'فعّل الإشعارات من إعدادات المتصفح');
    }
  };

  const handleRequestLocation = async () => {
    const granted = await requestLocationPermission();
    if (granted) {
      toast.success(isEn ? 'Location access granted!' : 'تم السماح بالوصول للموقع!');
    } else {
      toast.info(isEn ? 'Enable location from browser settings' : 'فعّل الموقع من إعدادات المتصفح');
    }
  };

  const handleRegisterProviderCard = async () => {
    if (!profile || profile.role !== 'provider') return;
    setIsRegisteringCard(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (!token) { toast.error(isEn ? 'Please log in first' : 'سجّل دخولك أولاً'); return; }
      const ok = await saveProviderCard(profile, projectId, publicAnonKey, token);
      if (ok) {
        toast.success(isEn ? 'Business card registered on Google Maps!' : 'تم تسجيل بطاقتك على خرائط جوجل!');
      } else {
        toast.error(isEn ? 'Failed to register card' : 'فشل تسجيل البطاقة');
      }
    } finally {
      setIsRegisteringCard(false);
    }
  };

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(isEn ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'long' })
    : '';

  // ─── Sub-screens ───

  if (section === 'subscriptions') {
    return <SubscriptionsScreen onBack={() => setSection('main')} />;
  }

  if (section === 'ai-tools') {
    return <AIToolsDashboard onBack={() => setSection('main')} />;
  }

  if (section === 'location') {
    return (
      <div className="min-h-screen bg-[#F5EEE1]" dir="rtl">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#1F3D2B]/10 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSection('main')} className="p-2 rounded-xl hover:bg-[#F5EEE1] transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#1F3D2B] rotate-180" />
          </button>
          <h2 className="text-lg font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>تحديد الموقع</h2>
        </div>
        <ProfileLocationSetup 
          userType={profile?.verification_status === 'verified' ? 'verified' : 'guest'}
          onVerificationClick={() => {
            toast.info('يرجى التواصل مع الدعم لتوثيق حسابك');
          }}
          onSaveHomeLocation={(location) => {
            console.log('Home location saved:', location);
            toast.success('تم حفظ موقعك السكني بنجاح');
          }}
          onSaveBusinessLocation={(data) => {
            console.log('Business location saved:', data);
            toast.success('تم حفظ موقع نشاطك التجاري بنجاح');
          }}
        />
      </div>
    );
  }

  if (section === 'about') {
    return <AboutScreen onBack={() => setSection('main')} />;
  }

  if (section === 'terms') {
    return <TermsScreen onBack={() => setSection('main')} />;
  }

  // ─── Section Header Helper ───

  const SectionHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#1F3D2B]/10 px-4 py-3 flex items-center gap-3">
      <button onClick={onBack} className="p-2 rounded-xl hover:bg-[#F5EEE1] transition-colors">
        <ChevronLeft className="w-5 h-5 text-[#1F3D2B] rotate-180" />
      </button>
      <h2 className="text-lg font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>{title}</h2>
    </div>
  );

  // ─── Avatar Component ───

  const AvatarDisplay = ({ size = 'lg' }: { size?: 'sm' | 'lg' }) => {
    const dims = size === 'lg' ? 'w-24 h-24' : 'w-20 h-20';
    const textSize = size === 'lg' ? 'text-3xl' : 'text-2xl';

    return (
      <div className="relative inline-block">
        <div className={`${dims} rounded-full bg-gradient-to-br from-[#3B5BFE] to-[#C8A86A] flex items-center justify-center text-white ${textSize} font-bold overflow-hidden ${size === 'sm' ? 'border-2 border-white/40' : ''}`}>
          {isUploadingAvatar && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 rounded-full">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          {currentAvatar ? (
            <img src={currentAvatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            (profile?.full_name?.[0] || 'U').toUpperCase()
          )}
        </div>
        {size === 'lg' && (
          <button
            onClick={handleAvatarClick}
            disabled={isUploadingAvatar}
            className="absolute -bottom-1 -left-1 w-8 h-8 bg-[#3B5BFE] rounded-full flex items-center justify-center text-white shadow-lg disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
      </div>
    );
  };

  // ─── Edit Profile ───

  if (section === 'edit') {
    return (
      <div className="min-h-screen bg-[#F5EEE1]" dir="rtl">
        <SectionHeader title={isEn ? 'Edit Profile' : 'تعديل الملف الشخصي'} onBack={() => setSection('main')} />
        <div className="p-4 space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <AvatarDisplay size="lg" />
            <p className="text-xs text-[#1F3D2B]/50" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Tap the camera icon to change your photo' : 'اضغط على أيقونة الكاميرا لتغيير الصورة'}
            </p>
          </div>

          {/* Name */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="text-sm text-[#1F3D2B]/60 mb-1 block" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Name' : 'الاسم'}</label>
            <div className="flex items-center gap-3">
              <Edit3 className="w-5 h-5 text-[#D4AF37]" />
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#1F3D2B] font-semibold"
                style={{ fontFamily: 'Cairo, sans-serif' }}
                placeholder={isEn ? 'Enter your name' : 'أدخل اسمك'}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="text-sm text-[#1F3D2B]/60 mb-1 block" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Phone' : 'الهاتف'}</label>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#3B5BFE]" />
              <input
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#1F3D2B] font-semibold"
                style={{ fontFamily: 'Cairo, sans-serif' }}
                placeholder="+971 XX XXX XXXX"
                dir="ltr"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="text-sm text-[#1F3D2B]/60 mb-1 block" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'WhatsApp' : 'واتساب'}</label>
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-[#25D366]" />
              <input
                value={editWhatsapp}
                onChange={e => setEditWhatsapp(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#1F3D2B] font-semibold"
                style={{ fontFamily: 'Cairo, sans-serif' }}
                placeholder="+971 XX XXX XXXX"
                dir="ltr"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="text-sm text-[#1F3D2B]/60 mb-1 block" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'About' : 'نبذة'}</label>
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#D4AF37] mt-1 flex-shrink-0" />
              <textarea
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#1F3D2B] font-semibold resize-none min-h-[60px]"
                style={{ fontFamily: 'Cairo, sans-serif' }}
                placeholder={isEn ? 'Tell us about yourself...' : 'أخبرنا عن نفسك...'}
                rows={3}
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div className="bg-white rounded-2xl p-4 shadow-sm opacity-60">
            <label className="text-sm text-[#1F3D2B]/60 mb-1 block" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Email' : 'البريد الإلكتروني'}</label>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#3B5BFE]" />
              <span className="flex-1 text-[#1F3D2B] font-semibold" dir="ltr">{profile?.email || '—'}</span>
            </div>
          </div>

          {/* Location Info (read-only) */}
          {(profile?.emirate || profile?.city) && (
            <div className="bg-white rounded-2xl p-4 shadow-sm opacity-60">
              <label className="text-sm text-[#1F3D2B]/60 mb-1 block" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Location' : 'الموقع'}</label>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#EF4444]" />
                <span className="flex-1 text-[#1F3D2B] font-semibold">
                  {[profile?.emirate, profile?.city, profile?.district].filter(Boolean).join(' - ')}
                </span>
              </div>
              <p className="text-xs text-[#1F3D2B]/40 mt-1 mr-8" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {isEn ? 'Change location from Settings' : 'لتغيير الموقع، اذهب للإعدادات'}
              </p>
            </div>
          )}

          {/* Provider Info (read-only summary) */}
          {profile?.role === 'provider' && profile?.business_name && (
            <div className="bg-white rounded-2xl p-4 shadow-sm opacity-60">
              <label className="text-sm text-[#1F3D2B]/60 mb-1 block" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Business' : 'النشاط التجاري'}</label>
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-[#D4AF37]" />
                <span className="flex-1 text-[#1F3D2B] font-semibold">{profile.business_name}</span>
              </div>
              {profile.specialties && profile.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 mr-8">
                  {profile.specialties.map((s: string, i: number) => (
                    <span key={i} className="text-xs bg-[#3B5BFE]/10 text-[#3B5BFE] px-2 py-0.5 rounded-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Save */}
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="w-full bg-gradient-to-l from-[#3B5BFE] to-[#1F3D2B] text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEn ? 'Save Changes' : 'حفظ التعديلات'}
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ─── Settings ───

  if (section === 'settings') {
    const isDark = theme === 'dark';

    return (
      <div className="min-h-screen bg-[#F5EEE1]" dir="rtl">
        <SectionHeader title={isEn ? 'Settings' : 'الإعدادات'} onBack={() => setSection('main')} />
        <div className="p-4 space-y-3">

          {/* ─── Theme Toggle (المظهر) ─── */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              {isDark ? <Moon className="w-5 h-5 text-[#C8A86A]" /> : <Sun className="w-5 h-5 text-[#C8A86A]" />}
              <span className="text-[#1F3D2B] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {isEn ? 'Appearance' : 'المظهر'}
              </span>
            </div>
            <div className="flex gap-2">
              {/* Light */}
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
                  !isDark
                    ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                    : 'border-transparent bg-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative" style={{ background: '#F5EEE1' }}>
                  <div className="absolute top-0 left-0 right-0 h-3" style={{ background: 'linear-gradient(to right, #3B5BFE, #1F3D2B)' }} />
                  <div className="absolute top-4 left-1 right-1 h-2 bg-white rounded-sm" />
                  <div className="absolute top-7 left-1 right-1 h-2 bg-white rounded-sm" />
                  <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full" style={{ background: '#3B5BFE' }} />
                </div>
                <span className="text-xs font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {isEn ? 'Light' : 'فاتح'}
                </span>
                {!isDark && (
                  <div className="w-4 h-4 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>

              {/* Dark */}
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
                  isDark
                    ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                    : 'border-transparent bg-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative" style={{ background: '#F5EEE1' }}>
                  <div className="absolute top-0 left-0 right-0 h-3" style={{ background: 'linear-gradient(to right, #3B5BFE, #1F3D2B)' }} />
                  <div className="absolute top-4 left-1 right-1 h-2 bg-white rounded-sm" />
                  <div className="absolute top-7 left-1 right-1 h-2 bg-white rounded-sm" />
                  <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full" style={{ background: '#C8A86A' }} />
                </div>
                <span className="text-xs font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {isEn ? 'Classic' : 'كلاسيكي'}
                </span>
                {isDark && (
                  <div className="w-4 h-4 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2.5 text-center" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Theme is saved automatically across sessions' : 'يُحفظ المظهر تلقائياً ويبقى عند كل فتح'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#D4AF37]" />
              <div className="flex flex-col">
                <span className="text-[#1F3D2B] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {isEn ? 'Notifications' : 'الإشعارات'}
                </span>
                <span className="text-[10px] text-gray-400" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {isEn ? 'Receive push notifications' : 'استلام إشعارات فورية'}
                </span>
              </div>
            </div>
            <BaitSwitch
              variant="ios"
              size="md"
              color="gold"
              checked={notifications}
              onChange={(val) => { setNotifications(val); toast.info(val ? (isEn ? 'Notifications enabled' : 'تم تفعيل الإشعارات') : (isEn ? 'Notifications disabled' : 'تم إيقاف الإشعارات')); }}
            />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-[#3B5BFE]" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
              <div className="flex flex-col">
                <span className="text-[#1F3D2B] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {isEn ? 'Sounds' : 'الأصوات'}
                </span>
                <span className="text-[10px] text-gray-400" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {isEn ? 'In-app sound effects' : 'المؤثرات الصوتية'}
                </span>
              </div>
            </div>
            <BaitSwitch
              variant="frosted"
              size="md"
              color="blue"
              checked={soundEnabled}
              onChange={(val) => setSoundEnabled(val)}
            />
          </div>

          {/* Zoom / Display Size Control */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <ZoomIn className="w-5 h-5 text-[#3B5BFE]" />
                <span className="text-[#1F3D2B] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {isEn ? 'Display Size' : 'حجم العرض'}
                </span>
              </div>
              <span className="text-sm font-bold text-[#3B5BFE] bg-[#3B5BFE]/10 px-2.5 py-1 rounded-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {zoomLevel}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 70}
                className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-[#1F3D2B] hover:bg-[#3B5BFE] hover:text-white transition-colors disabled:opacity-30"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="flex-1 h-2 bg-gray-100 rounded-full relative">
                <div 
                  className="absolute inset-y-0 right-0 bg-gradient-to-l from-[#3B5BFE] to-[#1F3D2B] rounded-full transition-all"
                  style={{ width: `${((zoomLevel - 70) / 80) * 100}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#3B5BFE] rounded-full shadow transition-all"
                  style={{ right: `calc(${((zoomLevel - 70) / 80) * 100}% - 8px)` }}
                />
              </div>
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 150}
                className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-[#1F3D2B] hover:bg-[#3B5BFE] hover:text-white transition-colors disabled:opacity-30"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
            {zoomLevel !== 100 && (
              <button
                onClick={resetZoom}
                className="w-full mt-2.5 text-xs text-[#3B5BFE] font-bold py-1.5 bg-[#3B5BFE]/5 rounded-lg hover:bg-[#3B5BFE]/10 transition-colors"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                {isEn ? 'Reset to default (100%)' : 'إعادة ضبط (100%)'}
              </button>
            )}
            <p className="text-[10px] text-gray-400 mt-2 text-center" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Changes apply to the entire app and are saved automatically' : 'التغييرات تُطبّق على التطبيق بالكامل وتُحفظ تلقائياً'}
            </p>
          </div>

          {/* ─── Clear Browsing Data (حذف بيانات التصفح) ─── */}
          <ClearBrowsingDataButton isEn={isEn} />

          <button className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 text-right" onClick={() => toast.info(isEn ? 'Change password — coming soon' : 'تغيير كلمة المرور — قريباً')}>
            <Lock className="w-5 h-5 text-[#C8A86A]" />
            <span className="flex-1 text-[#1F3D2B] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Change Password' : 'تغيير كلمة المرور'}
            </span>
            <ChevronLeft className="w-4 h-4 text-[#1F3D2B]/40 rotate-180" />
          </button>

          <button className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 text-right" onClick={() => toast.error(isEn ? 'Account deletion not available' : 'حذف الحساب غير متاح حالياً')}>
            <Trash2 className="w-5 h-5 text-red-500" />
            <span className="flex-1 text-red-500 font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Delete Account' : 'حذف الحساب'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // ─── Orders ───

  if (section === 'orders') {
    return <OrdersSection orderTab={orderTab} setOrderTab={setOrderTab} onBack={() => setSection('main')} isEn={isEn} />;
  }

  // ─── Support ───

  if (section === 'support') {
    return (
      <div className="min-h-screen bg-[#F5EEE1]" dir="rtl">
        <SectionHeader title="الدعم الفني" onBack={() => setSection('main')} />
        <div className="p-4 space-y-3">
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <MessageSquare className="w-12 h-12 text-[#3B5BFE] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>كيف يمكننا مساعدتك؟</h3>
            <p className="text-sm text-[#1F3D2B]/60 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              فريقنا متاح على مدار الساعة لمساعدتك
            </p>
          </div>

          {[
            { icon: <Mail className="w-5 h-5" />, label: 'البريد الإلكتروني', value: 'support@bietalreef.ae' },
            { icon: <Phone className="w-5 h-5" />, label: 'الهاتف', value: '+971 XX XXX XXXX' },
            { icon: <MessageSquare className="w-5 h-5" />, label: 'محادثة مباشرة', value: 'ابدأ المحادثة' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => toast.info(`${item.label}: ${item.value}`)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 text-right"
            >
              <div className="w-10 h-10 bg-[#3B5BFE]/10 rounded-xl flex items-center justify-center text-[#3B5BFE]">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#1F3D2B]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>{item.label}</p>
                <p className="text-[#1F3D2B] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>{item.value}</p>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#1F3D2B]/40 rotate-180" />
            </button>
          ))}

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-bold text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>الأسئلة الشائعة</h4>
            {['كيف أضيف مشروعاً جديداً؟', 'كيف أتواصل مع مزود الخدمة؟', 'كيف أستخدم كوينز الدار؟'].map((q, i) => (
              <button
                key={i}
                onClick={() => toast.info('قريباً — الإجابات التفصيلية')}
                className="w-full text-right py-2 border-b border-[#1F3D2B]/5 last:border-0 flex items-center justify-between"
              >
                <span className="text-sm text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>{q}</span>
                <ChevronLeft className="w-4 h-4 text-[#1F3D2B]/30 rotate-180" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Profile Screen ───

  return (
    <div className="min-h-screen bg-[#F5EEE1] pb-24 select-none" dir={isEn ? 'ltr' : 'rtl'}>

      {/* ── Content Protection Overlay ── */}
      {isBlurred && (
        <div className="fixed inset-0 z-[100] bg-[#1F3D2B]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-4">
          <ShieldAlert className="w-16 h-16 text-white/80" />
          <p className="text-white text-lg font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn ? 'Content Protected' : 'المحتوى محمي'}
          </p>
          <p className="text-white/60 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn ? 'Screenshots are not allowed in this section' : 'لا يُسمح بالتقاط صور للشاشة في هذا القسم'}
          </p>
        </div>
      )}

      {/* ══ PUBLIC PROFILE VIEW MODAL ══ */}
      {showPublicView && profile && (
        <PublicProfileView
          profile={profile}
          isEn={isEn}
          onClose={() => setShowPublicView(false)}
        />
      )}

      {/* ══ HERO COVER ══ */}
      <div className="relative overflow-hidden" style={{ minHeight: 220 }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1F3D2B 0%, #2d5a3f 40%, #3B5BFE 100%)' }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #D4AF37 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C8A86A 0%, transparent 50%)' }} />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #D4AF37 0px, #D4AF37 1px, transparent 1px, transparent 12px)' }} />

        <div className="relative z-10 pt-10 pb-16 px-5 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-3">
            <div
              className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center text-white text-4xl font-black"
              style={{ background: 'linear-gradient(135deg, #3B5BFE 0%, #C8A86A 100%)', boxShadow: '0 0 0 4px rgba(212,175,55,0.5), 0 8px 32px rgba(0,0,0,0.3)' }}
            >
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-full">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              {(avatarPreview || profile?.avatar_url) ? (
                <img src={avatarPreview || profile?.avatar_url || ''} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                (profile?.full_name?.[0] || 'U').toUpperCase()
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 transition-transform active:scale-90"
              style={{ background: '#D4AF37', border: '2.5px solid #F5EEE1' }}
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
            {profile?.is_verified && (
              <div className="absolute -top-1 -left-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md" style={{ background: '#D4AF37' }}>
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>

          <h1 className="text-white text-2xl font-black mb-1 tracking-tight" style={{ fontFamily: 'Cairo, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            {profile?.full_name || (isEn ? 'User' : 'مستخدم')}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-1">
            <span className="text-xs font-bold px-3 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.25)', color: '#FFD700', border: '1px solid rgba(212,175,55,0.4)', fontFamily: 'Cairo, sans-serif' }}>
              {roleLabels[profile?.role || 'client']?.[language] || profile?.role}
            </span>
            {profile?.display_id && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }} dir="ltr">
                {profile.display_id}
              </span>
            )}
          </div>
          {profile?.email && <p className="text-white/50 text-xs font-medium" dir="ltr">{profile.email}</p>}

          {/* ── Permission Pills ── */}
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {/* Notifications */}
            <button
              onClick={handleRequestNotifications}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                background: notifPermission === 'granted' ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.12)',
                color: notifPermission === 'granted' ? '#FFD700' : 'rgba(255,255,255,0.6)',
                border: `1px solid ${notifPermission === 'granted' ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.2)'}`,
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              <BellRing className="w-3 h-3" />
              {notifPermission === 'granted'
                ? (isEn ? 'Notifications ON' : 'الإشعارات مفعّلة')
                : (isEn ? 'Enable Notifications' : 'تفعيل الإشعارات')}
            </button>

            {/* Location */}
            <button
              onClick={handleRequestLocation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              <Navigation className="w-3 h-3" />
              {isEn ? 'Enable Maps' : 'تفعيل الخرائط'}
            </button>

            {/* Eye — View as others see */}
            <button
              onClick={() => setShowPublicView(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                background: 'rgba(59,91,254,0.25)',
                color: '#7B9FFF',
                border: '1px solid rgba(59,91,254,0.4)',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              <Eye className="w-3 h-3" />
              {isEn ? 'Public View' : 'كما يراك الآخرون'}
            </button>
          </div>
        </div>
      </div>

      {/* ══ STATS ROW ══ */}
      <div className="px-4 -mt-8 mb-4 relative z-10">
        <div className="rounded-2xl p-4 grid grid-cols-3 gap-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(31,61,43,0.12)', border: '1px solid rgba(212,175,55,0.15)' }}>
          {[
            { label: isEn ? 'Projects' : 'المشاريع', value: String(profile?.projects_count || 0), color: '#3B5BFE' },
            { label: isEn ? 'Completion' : 'الإنجاز', value: profile?.completion_rate ? `${profile.completion_rate}%` : '—', color: '#D4AF37' },
            { label: isEn ? 'Member Since' : 'عضو منذ', value: memberSince ? memberSince.split(' ')[0] : '—', color: '#C8A86A' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xl font-black mb-0.5" style={{ color: stat.color, fontFamily: 'Cairo, sans-serif' }}>{stat.value}</p>
              <p className="text-[11px] text-[#1F3D2B]/50 font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-3">

        {/* ══ BIO ══ */}
        {profile?.bio && (
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(212,175,55,0.12)', boxShadow: '0 2px 12px rgba(31,61,43,0.06)' }}>
            <p className="text-[13px] text-[#1F3D2B]/70 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>{profile.bio}</p>
          </div>
        )}

        {/* ══ CONTACT INFO ══ */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(212,175,55,0.12)', boxShadow: '0 2px 12px rgba(31,61,43,0.06)' }}>
          <div className="px-4 py-3 border-b border-[#F5EEE1] flex items-center gap-2">
            <div className="w-1 h-4 rounded-full" style={{ background: '#3B5BFE' }} />
            <h3 className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Contact Information' : 'معلومات التواصل'}</h3>
          </div>
          <div className="divide-y divide-[#F5EEE1]/80">
            {[
              { Icon: Mail, label: isEn ? 'Email' : 'البريد الإلكتروني', value: profile?.email || '—', color: '#3B5BFE' },
              { Icon: Phone, label: isEn ? 'Phone' : 'الهاتف', value: profile?.phone || '—', color: '#1F3D2B' },
              { Icon: MessageSquare, label: 'WhatsApp', value: profile?.whatsapp || profile?.phone || '—', color: '#25D366' },
            ].map(({ Icon, label, value, color }) => (
              <div key={label} className="px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#1F3D2B]/40 font-medium" style={{ fontFamily: 'Cairo, sans-serif' }}>{label}</p>
                  <p className="text-sm text-[#1F3D2B] font-semibold truncate" dir="ltr" style={{ fontFamily: 'monospace' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ LOCATION ══ */}
        {(profile?.emirate || profile?.city || profile?.district) && (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(212,175,55,0.12)', boxShadow: '0 2px 12px rgba(31,61,43,0.06)' }}>
            <div className="px-4 py-3 border-b border-[#F5EEE1] flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ background: '#D4AF37' }} />
              <h3 className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Location' : 'الموقع الجغرافي'}</h3>
            </div>
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EF444415' }}>
                <MapPin className="w-4 h-4 text-[#EF4444]" />
              </div>
              <div>
                <p className="text-sm text-[#1F3D2B] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {[profile?.emirate, profile?.city, profile?.district].filter(Boolean).join(' · ')}
                </p>
                <p className="text-[11px] text-[#1F3D2B]/40 mt-0.5" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'United Arab Emirates' : 'الإمارات العربية المتحدة'}</p>
              </div>
            </div>
          </div>
        )}

        {/* ══ PROVIDER BUSINESS INFO ══ */}
        {profile?.role === 'provider' && profile?.business_name && (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 2px 12px rgba(212,175,55,0.08)' }}>
            <div className="px-4 py-3 border-b border-[#F5EEE1] flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ background: '#D4AF37' }} />
              <h3 className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Business Profile' : 'الملف التجاري'}</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#D4AF3715' }}>
                  <Briefcase className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-[11px] text-[#1F3D2B]/40 font-medium" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Business Name' : 'اسم النشاط التجاري'}</p>
                  <p className="text-sm text-[#1F3D2B] font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>{profile.business_name}</p>
                </div>
              </div>
              {profile.specialties && profile.specialties.length > 0 && (
                <div>
                  <p className="text-[11px] text-[#1F3D2B]/40 font-medium mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Specialties' : 'التخصصات'}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.specialties.map((s: string, i: number) => (
                      <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-xl" style={{ background: 'rgba(59,91,254,0.08)', color: '#3B5BFE', border: '1px solid rgba(59,91,254,0.15)', fontFamily: 'Cairo, sans-serif' }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ WALLET ══ */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/wallet')}
          className="w-full rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1F3D2B 0%, #2a5040 60%, #1a3020 100%)', boxShadow: '0 4px 20px rgba(31,61,43,0.25)' }}
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #D4AF37 0%, transparent 60%)' }} />
          <div className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.2)' }}>
            <Coins className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="relative flex-1 text-right">
            <p className="text-white/50 text-[11px]" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Dar Wallet' : 'محفظة الدار'}</p>
            <p className="text-white text-xl font-black" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {walletBalance.toLocaleString(isEn ? 'en-US' : 'ar-EG')} <span className="text-xs font-semibold text-[#D4AF37]">{isEn ? 'Coins' : 'كوينز'}</span>
            </p>
          </div>
          <ChevronLeft className="relative w-4 h-4 text-[#D4AF37] rotate-180 flex-shrink-0" />
        </motion.button>

        {/* ══ PROVIDER MAP CARD ══ */}
        {profile?.role === 'provider' && (
          <div
            className="rounded-2xl p-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1F3D2B 0%, #2d5a3f 60%, #1a3020 100%)', border: '1px solid rgba(212,175,55,0.3)' }}
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #D4AF37 0%, transparent 60%)' }} />
            <div className="relative z-10 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.2)' }}>
                <Navigation className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm mb-0.5" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {isEn ? 'Google Maps Business Card' : 'بطاقة نشاطك على خرائط جوجل'}
                </p>
                <p className="text-white/50 text-xs leading-relaxed mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {isEn
                    ? 'Register your business card so customers can find you on Google Maps and in the AI agent.'
                    : 'سجّل بطاقتك التجارية ليجدك العملاء على خرائط جوجل وفي الوكيل الذكي.'}
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleRegisterProviderCard}
                  disabled={isRegisteringCard}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
                  style={{ background: '#D4AF37', color: '#1F3D2B', fontFamily: 'Cairo, sans-serif' }}
                >
                  {isRegisteringCard ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                  {isEn ? 'Register on Maps' : 'تسجيل على الخرائط'}
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* ══ QUICK ACTIONS ══ */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(212,175,55,0.12)', boxShadow: '0 2px 12px rgba(31,61,43,0.06)' }}>
          {[
            { iconComp: Edit3, theme: 'gold', label: isEn ? 'Edit Profile' : 'تعديل الملف الشخصي', sub: isEn ? 'Update your info' : 'تحديث بياناتك', action: () => setSection('edit') },
            { iconComp: MessageSquare, theme: 'blue', label: isEn ? 'Messages' : 'الرسائل', sub: isEn ? 'Chat with others' : 'التواصل مع الآخرين', action: () => navigate('/messages') },
            { iconComp: MapPin, theme: 'blue', label: isEn ? 'Set Location' : 'تحديد الموقع', sub: isEn ? 'Update your area' : 'تحديث منطقتك', action: () => setSection('location') },
            { iconComp: ShoppingCart, theme: 'orange', label: isEn ? 'My Orders' : 'طلباتي', sub: isEn ? 'Track orders' : 'تتبع الطلبات', action: () => setSection('orders') },
            { iconComp: Star, theme: 'gold', label: isEn ? 'Subscriptions' : 'الاشتراكات', sub: isEn ? 'Manage your plan' : 'إدارة الخطة', action: () => setSection('subscriptions') },
          ].map((item, i, arr) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.99 }}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-right transition-colors hover:bg-[#F5EEE1]/60 ${i < arr.length - 1 ? 'border-b border-[#F5EEE1]' : ''}`}
            >
              <Icon3D icon={item.iconComp} theme={item.theme} size="xs" hoverable={false} />
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>{item.label}</p>
                <p className="text-[11px] text-[#1F3D2B]/40 font-medium" style={{ fontFamily: 'Cairo, sans-serif' }}>{item.sub}</p>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 text-[#1F3D2B]/25 rotate-180 flex-shrink-0" />
            </motion.button>
          ))}
        </div>

        {/* ══ SYSTEM OPTIONS ══ */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(212,175,55,0.12)', boxShadow: '0 2px 12px rgba(31,61,43,0.06)' }}>
          {[
            { iconComp: Settings, theme: 'teal', label: isEn ? 'Settings' : 'الإعدادات', action: () => setSection('settings') },
            { iconComp: HelpCircle, theme: 'purple', label: isEn ? 'Support' : 'الدعم الفني', action: () => setSection('support') },
            { iconComp: Info, theme: 'cyan', label: isEn ? 'About' : 'من نحن', action: () => setSection('about') },
            { iconComp: Scale, theme: 'amber', label: isEn ? 'Terms' : 'الشروط والأحكام', action: () => setSection('terms') },
          ].map((item, i, arr) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.99 }}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors hover:bg-[#F5EEE1]/60 ${i < arr.length - 1 ? 'border-b border-[#F5EEE1]' : ''}`}
            >
              <Icon3D icon={item.iconComp} theme={item.theme} size="xs" hoverable={false} />
              <span className="flex-1 text-sm font-semibold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>{item.label}</span>
              <ChevronLeft className="w-3.5 h-3.5 text-[#1F3D2B]/25 rotate-180 flex-shrink-0" />
            </motion.button>
          ))}
        </div>

        {/* ══ LOGOUT ══ */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={async () => { await logout(); window.location.reload(); }}
          className="w-full rounded-2xl p-3.5 flex items-center justify-center gap-2"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.15)' }}
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span className="text-sm font-bold text-red-500" style={{ fontFamily: 'Cairo, sans-serif' }}>{isEn ? 'Log Out' : 'تسجيل الخروج'}</span>
        </motion.button>

        <p className="text-center text-[11px] text-[#1F3D2B]/25 pb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {isEn ? 'Beit Al Reef v2.0 · Smart Building Platform' : 'بيت الريف v2.0 · منصة البناء الذكي'}
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   CLEAR BROWSING DATA BUTTON
   ================================================================ */
function ClearBrowsingDataButton({ isEn }: { isEn: boolean }) {
  const [isClearing, setIsClearing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = async () => {
    setIsClearing(true);
    try {
      // Clear localStorage (except auth tokens)
      const keysToKeep = ['sb-auth-token', 'supabase.auth.token'];
      const allKeys = Object.keys(localStorage);
      allKeys.forEach((key) => {
        if (!keysToKeep.some((k) => key.includes(k))) {
          localStorage.removeItem(key);
        }
      });

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear caches if available
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      toast.success(isEn ? 'Browsing data cleared successfully' : 'تم حذف بيانات التصفح بنجاح');
      setShowConfirm(false);
    } catch (err) {
      console.error('Clear browsing data error:', err);
      toast.error(isEn ? 'Failed to clear data' : 'فشل في حذف البيانات');
    } finally {
      setIsClearing(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-[#D4AF37]/30">
        <div className="flex items-center gap-3 mb-3">
          <Eraser className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-[#1F3D2B] font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn ? 'Clear Browsing Data?' : 'حذف بيانات التصفح؟'}
          </span>
        </div>
        <p className="text-xs text-[#1F3D2B]/50 mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {isEn
            ? 'This will clear cached data, preferences, and temporary files. Your account and orders will not be affected.'
            : 'سيتم حذف الملفات المؤقتة والتفضيلات المحفوظة. حسابك وطلباتك لن تتأثر.'}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            disabled={isClearing}
            className="flex-1 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            {isClearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {isEn ? 'Confirm Delete' : 'تأكيد الحذف'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 bg-gray-100 text-[#1F3D2B] py-2.5 rounded-xl text-sm font-bold"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            {isEn ? 'Cancel' : 'إلغاء'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 text-right"
      onClick={() => setShowConfirm(true)}
    >
      <Eraser className="w-5 h-5 text-[#D4AF37]" />
      <span className="flex-1 text-[#1F3D2B] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
        {isEn ? 'Clear Browsing Data' : 'حذف بيانات التصفح'}
      </span>
      <ChevronLeft className="w-4 h-4 text-[#1F3D2B]/40 rotate-180" />
    </button>
  );
}

/* ================================================================
   ORDERS SECTION — Connected to Supabase Backend
   ================================================================ */
function OrdersSection({ orderTab, setOrderTab, onBack, isEn }: {
  orderTab: OrderTab;
  setOrderTab: (tab: OrderTab) => void;
  onBack: () => void;
  isEn: boolean;
}) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setError(isEn ? 'Please log in first' : 'يجب تسجيل الدخول أولاً');
        setIsLoading(false);
        return;
      }

      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a/orders`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const json = await res.json();

      if (res.ok && json.orders) {
        setOrders(json.orders);
      } else {
        console.error('Orders fetch error:', json);
        setError(json.error || (isEn ? 'Failed to load orders' : 'فشل في تحميل الطلبات'));
      }
    } catch (err: any) {
      console.error('Orders fetch exception:', err);
      setError(isEn ? 'Connection error' : 'خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders by tab
  const filteredOrders = orders.filter((o) => {
    if (orderTab === 'active') return ['pending', 'processing', 'in_progress'].includes(o.status);
    if (orderTab === 'completed') return o.status === 'completed';
    if (orderTab === 'cancelled') return o.status === 'cancelled';
    return false;
  });

  const statusLabels: Record<string, { ar: string; en: string; color: string }> = {
    pending: { ar: 'بانتظار المعالجة', en: 'Pending', color: 'bg-[#D4AF37]/15 text-[#D4AF37]' },
    processing: { ar: 'قيد المعالجة', en: 'Processing', color: 'bg-blue-100 text-blue-700' },
    in_progress: { ar: 'قيد التنفيذ', en: 'In Progress', color: 'bg-[#3B5BFE]/15 text-[#3B5BFE]' },
    completed: { ar: 'مكتمل', en: 'Completed', color: 'bg-[#D4AF37]/15 text-[#8B6914]' },
    cancelled: { ar: 'ملغي', en: 'Cancelled', color: 'bg-red-100 text-red-700' },
  };

  const SectionHeader = ({ title, onBack: goBack }: { title: string; onBack: () => void }) => (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#1F3D2B]/10 px-4 py-3 flex items-center gap-3">
      <button onClick={goBack} className="p-2 rounded-xl hover:bg-[#F5EEE1] transition-colors">
        <ChevronLeft className="w-5 h-5 text-[#1F3D2B] rotate-180" />
      </button>
      <h2 className="text-lg font-bold text-[#1F3D2B] flex-1" style={{ fontFamily: 'Cairo, sans-serif' }}>{title}</h2>
      <button onClick={fetchOrders} className="p-2 rounded-xl hover:bg-[#F5EEE1] transition-colors" title={isEn ? 'Refresh' : 'تحديث'}>
        <RefreshCw className={`w-4 h-4 text-[#D4AF37] ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5EEE1]" dir="rtl">
      <SectionHeader title={isEn ? 'My Orders' : 'طلباتي'} onBack={onBack} />

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-3">
        {([
          ['active', isEn ? 'Active' : 'نشطة'],
          ['completed', isEn ? 'Completed' : 'مكتملة'],
          ['cancelled', isEn ? 'Cancelled' : 'ملغاة'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setOrderTab(key as OrderTab)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors border-[3px] ${
              orderTab === key
                ? 'bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-white border-[#D4AF37]/30'
                : 'bg-white text-[#1F3D2B] border-gray-200/60'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 mx-auto mb-3 text-[#D4AF37] animate-spin" />
            <p className="text-[#1F3D2B]/50 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Loading orders...' : 'جاري تحميل الطلبات...'}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-red-300" />
            </div>
            <p className="text-red-500 text-sm font-bold mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>{error}</p>
            <button
              onClick={fetchOrders}
              className="text-[#D4AF37] text-sm font-bold underline"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              {isEn ? 'Retry' : 'إعادة المحاولة'}
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-[#F5EEE1] to-white flex items-center justify-center border-2 border-[#E6DCC8] shadow-inner">
              <Package className="w-10 h-10 text-[#C8A86A]/50" />
            </div>
            <h3 className="text-[#1F3D2B] font-bold text-lg mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {orderTab === 'active'
                ? (isEn ? 'No active orders' : 'لا توجد طلبات نشطة')
                : orderTab === 'completed'
                ? (isEn ? 'No completed orders' : 'لا توجد طلبات مكتملة')
                : (isEn ? 'No cancelled orders' : 'لا توجد طلبات ملغاة')
              }
            </h3>
            <p className="text-[#1F3D2B]/40 text-sm max-w-[250px] mx-auto leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn
                ? 'Your orders will appear here once you request a service from our providers.'
                : 'ستظهر طلباتك هنا فور طلب أي خدمة من مزودينا.'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const st = statusLabels[order.status] || statusLabels.pending;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 shadow-sm border-[3px] border-gray-200/60"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#1F3D2B] font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>{order.title}</span>
                  <span className="text-[10px] text-[#1F3D2B]/40 font-mono">{order.id}</span>
                </div>
                {order.description && (
                  <p className="text-xs text-[#1F3D2B]/50 mb-2 line-clamp-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {order.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${st.color}`}>
                    {isEn ? st.en : st.ar}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-[#1F3D2B]/50">
                    <span>{new Date(order.created_at).toLocaleDateString(isEn ? 'en-US' : 'ar-EG')}</span>
                    {order.price && (
                      <span className="font-bold text-[#D4AF37]">{order.price} {isEn ? 'AED' : 'د.إ'}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}