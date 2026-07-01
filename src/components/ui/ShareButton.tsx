/**
 * ShareButton.tsx — زر مشاركة ذكي لبيت الريف
 * ═════════════════════════════════════════════
 * يستخدم Web Share API (native) على الموبايل
 * يظهر قائمة مشاركة مخصصة على الديسكتوب
 * يدعم RTL + Dark Mode + ثيم بيت الريف
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, Copy, Check, X, 
  MessageCircle, Send, Mail, Link2,
  Twitter, Facebook, Smartphone
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const font = 'Cairo, sans-serif';
const SITE_DOMAIN = 'https://app.bietalreef.ae';

/**
 * Helper: يبني رابط المشاركة الصحيح دائماً باستخدام الدومين الإنتاجي
 * ← يمنع مشاركة المسارات الداخلية (profile, dashboard, workspace, admin)
 * ← يفرض الـ canonical URL فقط
 */

// Internal paths that should NEVER be shared
const INTERNAL_PATHS = ['/profile', '/wallet', '/workspace', '/dashboards', '/admin', '/ats', '/notifications', '/messages'];

function buildShareUrl(customUrl?: string): string {
  if (customUrl) return customUrl;
  if (typeof window === 'undefined') return SITE_DOMAIN;
  const path = window.location.pathname;
  const search = window.location.search;
  const hash = window.location.hash;

  // Block internal paths from being shared — redirect to home
  if (INTERNAL_PATHS.some(p => path === p || path.startsWith(p + '/'))) {
    return SITE_DOMAIN;
  }

  // Rewrite legacy /profile/:id to canonical /provider/:id
  const profileIdMatch = path.match(/^\/profile\/(.+)$/);
  if (profileIdMatch) {
    return `${SITE_DOMAIN}/provider/${profileIdMatch[1]}`;
  }

  const fullPath = `${path}${search}${hash}`;
  return `${SITE_DOMAIN}${fullPath === '/' ? '' : fullPath}`;
}

interface ShareButtonProps {
  /** عنوان المحتوى للمشاركة */
  title?: string;
  /** وصف المحتوى */
  description?: string;
  /** الرابط (إذا لم يُحدد، يُستخدم الرابط الحالي) */
  url?: string;
  /** النمط */
  variant?: 'icon' | 'button' | 'compact' | 'fab';
  /** العربية أم الإنجليزية */
  isEn?: boolean;
  /** ألوان مخصصة */
  className?: string;
}

// ─────────────────────────────────────────
// Share Channels
// ─────────────────────────────────────────
interface ShareChannel {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: any;
  color: string;
  action: (url: string, title: string, desc: string) => void;
}

const getShareChannels = (): ShareChannel[] => [
  {
    id: 'whatsapp',
    nameAr: 'واتساب',
    nameEn: 'WhatsApp',
    icon: MessageCircle,
    color: '#25D366',
    action: (url, title) => {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`, '_blank');
    },
  },
  {
    id: 'telegram',
    nameAr: 'تلغرام',
    nameEn: 'Telegram',
    icon: Send,
    color: '#0088cc',
    action: (url, title) => {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    },
  },
  {
    id: 'twitter',
    nameAr: 'إكس (تويتر)',
    nameEn: 'X (Twitter)',
    icon: Twitter,
    color: '#1DA1F2',
    action: (url, title) => {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    },
  },
  {
    id: 'facebook',
    nameAr: 'فيسبوك',
    nameEn: 'Facebook',
    icon: Facebook,
    color: '#1877F2',
    action: (url) => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    },
  },
  {
    id: 'email',
    nameAr: 'بريد إلكتروني',
    nameEn: 'Email',
    icon: Mail,
    color: '#D4AF37',
    action: (url, title, desc) => {
      window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${desc}\n\n${url}`)}`, '_blank');
    },
  },
  {
    id: 'sms',
    nameAr: 'رسالة نصية',
    nameEn: 'SMS',
    icon: Smartphone,
    color: '#34C759',
    action: (url, title) => {
      window.open(`sms:?body=${encodeURIComponent(`${title}\n${url}`)}`, '_blank');
    },
  },
];

export function ShareButton({
  title,
  description,
  url,
  variant = 'icon',
  isEn = false,
  className = '',
}: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const shareUrl = buildShareUrl(url);
  const shareTitle = title || (isEn ? 'Bait Al Reef — UAE Construction Platform' : 'بيت الريف — منصة البناء والصيانة الذكية');
  const shareDesc = description || (isEn 
    ? 'Discover the best contractors, craftsmen & building materials in UAE' 
    : 'اكتشف أفضل المقاولين، الحرفيين ومواد البناء في الإمارات');

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  const handleShare = async () => {
    // Try native Web Share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDesc,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        // User cancelled or API failed — fall through to custom menu
        if (err?.name === 'AbortError') return;
      }
    }
    // Desktop fallback — show custom share menu
    setShowMenu(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success(isEn ? 'Link copied!' : 'تم نسخ الرابط!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      toast.success(isEn ? 'Link copied!' : 'تم نسخ الرابط!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const channels = getShareChannels();

  // ─── Render Variants ───

  if (variant === 'fab') {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={handleShare}
          className={`w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C8A86A] rounded-full flex items-center justify-center shadow-lg shadow-[#D4AF37]/30 border-2 border-[#FFD700]/30 active:scale-90 transition-all ${className}`}
        >
          <Share2 className="w-5 h-5 text-white" />
        </button>
        <ShareMenu 
          isOpen={showMenu} 
          onClose={() => setShowMenu(false)}
          channels={channels}
          shareUrl={shareUrl}
          shareTitle={shareTitle}
          shareDesc={shareDesc}
          isEn={isEn}
          onCopy={handleCopyLink}
          copied={copied}
          position="above"
        />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={handleShare}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F5EEE1] text-[#1F3D2B] border-2 border-gray-200/60 hover:border-[#D4AF37]/30 active:scale-95 transition-all ${className}`}
          style={{ fontFamily: font }}
        >
          <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
          {isEn ? 'Share' : 'مشاركة'}
        </button>
        <ShareMenu 
          isOpen={showMenu} 
          onClose={() => setShowMenu(false)}
          channels={channels}
          shareUrl={shareUrl}
          shareTitle={shareTitle}
          shareDesc={shareDesc}
          isEn={isEn}
          onCopy={handleCopyLink}
          copied={copied}
        />
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={handleShare}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A86A] text-white shadow-md border-2 border-[#FFD700]/30 active:scale-95 transition-all ${className}`}
          style={{ fontFamily: font }}
        >
          <Share2 className="w-4 h-4" />
          {isEn ? 'Share App' : 'شارك التطبيق'}
        </button>
        <ShareMenu 
          isOpen={showMenu} 
          onClose={() => setShowMenu(false)}
          channels={channels}
          shareUrl={shareUrl}
          shareTitle={shareTitle}
          shareDesc={shareDesc}
          isEn={isEn}
          onCopy={handleCopyLink}
          copied={copied}
        />
      </div>
    );
  }

  // icon (default)
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleShare}
        className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/80 border-2 border-gray-200/60 hover:border-[#D4AF37]/30 active:scale-90 transition-all ${className}`}
      >
        <Share2 className="w-4.5 h-4.5 text-[#1F3D2B]/50" />
      </button>
      <ShareMenu 
        isOpen={showMenu} 
        onClose={() => setShowMenu(false)}
        channels={channels}
        shareUrl={shareUrl}
        shareTitle={shareTitle}
        shareDesc={shareDesc}
        isEn={isEn}
        onCopy={handleCopyLink}
        copied={copied}
      />
    </div>
  );
}


// ─────────────────────────────────────────
// Share Menu (Desktop Dropdown)
// ─────────────────────────────────────────
function ShareMenu({
  isOpen,
  onClose,
  channels,
  shareUrl,
  shareTitle,
  shareDesc,
  isEn,
  onCopy,
  copied,
  position = 'below',
}: {
  isOpen: boolean;
  onClose: () => void;
  channels: ShareChannel[];
  shareUrl: string;
  shareTitle: string;
  shareDesc: string;
  isEn: boolean;
  onCopy: () => void;
  copied: boolean;
  position?: 'above' | 'below';
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: position === 'above' ? 10 : -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: position === 'above' ? 10 : -10 }}
          className={`absolute z-[150] ${
            position === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'
          } left-0 right-0 min-w-[280px] w-max`}
          style={{ direction: isEn ? 'ltr' : 'rtl' }}
        >
          <div className="bg-white rounded-2xl shadow-2xl border-[3px] border-gray-200/60 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-l from-[#D4AF37]/5 to-transparent border-b border-gray-100 flex items-center justify-between">
              <h4 className="text-sm font-black text-[#1F3D2B]" style={{ fontFamily: font }}>
                {isEn ? 'Share' : 'مشاركة'}
              </h4>
              <button onClick={onClose} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <X className="w-3 h-3 text-gray-400" />
              </button>
            </div>

            {/* Copy Link */}
            <div className="px-3 py-2 border-b border-gray-50">
              <button
                onClick={onCopy}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#F5EEE1] hover:bg-[#F5EEE1]/80 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-gray-200/60">
                  {copied ? <Check className="w-4 h-4 text-[#D4AF37]" /> : <Link2 className="w-4 h-4 text-[#D4AF37]" />}
                </div>
                <div className="flex-1 text-right">
                  <p className="text-xs font-bold text-[#1F3D2B]" style={{ fontFamily: font }}>
                    {copied ? (isEn ? 'Copied!' : 'تم النسخ!') : (isEn ? 'Copy Link' : 'نسخ الرابط')}
                  </p>
                  <p className="text-[10px] text-[#1F3D2B]/30 font-semibold truncate max-w-[180px]" style={{ fontFamily: font }}>
                    {shareUrl.replace('https://', '')}
                  </p>
                </div>
              </button>
            </div>

            {/* Channels Grid */}
            <div className="px-3 py-3 grid grid-cols-3 gap-2">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    ch.action(shareUrl, shareTitle, shareDesc);
                    onClose();
                  }}
                  className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl hover:bg-gray-50 transition-colors active:scale-95"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${ch.color}15` }}
                  >
                    <ch.icon className="w-5 h-5" style={{ color: ch.color }} />
                  </div>
                  <span className="text-[10px] font-bold text-[#1F3D2B]/60" style={{ fontFamily: font }}>
                    {isEn ? ch.nameEn : ch.nameAr}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


// ─────────────────────────────────────────
// Full-Screen Share Modal (for mobile CTA)
// ─────────────────────────────────────────
export function ShareModal({
  isOpen,
  onClose,
  title,
  description,
  url,
  isEn = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  url?: string;
  isEn?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = buildShareUrl(url);
  const shareTitle = title || (isEn ? 'Bait Al Reef — UAE Construction Platform' : 'بيت الريف — منصة البناء والصيانة الذكية');
  const shareDesc = description || (isEn 
    ? 'Discover the best contractors, craftsmen & building materials in UAE' 
    : 'اكتشف أفضل المقاولين، الحرفيين ومواد البناء في الإمارات');

  const channels = getShareChannels();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast.success(isEn ? 'Link copied!' : 'تم نسخ الرابط!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[201] max-w-md mx-auto"
          >
            <div className="bg-white rounded-t-3xl shadow-2xl border-t-[3px] border-gray-200/60" dir={isEn ? 'ltr' : 'rtl'}>
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-5 py-3 flex items-center justify-between">
                <h3 className="text-lg font-black text-[#1F3D2B]" style={{ fontFamily: font }}>
                  {isEn ? 'Share' : 'مشاركة'}
                </h3>
                <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Preview Card */}
              <div className="px-5 pb-3">
                <div className="bg-[#F5EEE1] rounded-2xl p-4 flex items-center gap-3 border border-[#D4AF37]/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C8A86A] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1F3D2B] truncate" style={{ fontFamily: font }}>
                      {shareTitle}
                    </p>
                    <p className="text-[11px] text-[#1F3D2B]/40 truncate font-semibold" style={{ fontFamily: font }}>
                      {shareUrl.replace('https://', '')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Copy Link */}
              <div className="px-5 pb-3">
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border-2 border-gray-200/60 hover:border-[#D4AF37]/30 transition-colors active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                    {copied ? <Check className="w-5 h-5 text-[#D4AF37]" /> : <Copy className="w-5 h-5 text-[#D4AF37]" />}
                  </div>
                  <span className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily: font }}>
                    {copied ? (isEn ? 'Link Copied!' : 'تم نسخ الرابط!') : (isEn ? 'Copy Link' : 'نسخ الرابط')}
                  </span>
                </button>
              </div>

              {/* Share Channels */}
              <div className="px-5 pb-6">
                <div className="grid grid-cols-4 gap-3">
                  {channels.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => {
                        ch.action(shareUrl, shareTitle, shareDesc);
                        onClose();
                      }}
                      className="flex flex-col items-center gap-2 py-3 rounded-2xl hover:bg-gray-50 transition-colors active:scale-95"
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                        style={{ background: `${ch.color}15`, border: `2px solid ${ch.color}20` }}
                      >
                        <ch.icon className="w-6 h-6" style={{ color: ch.color }} />
                      </div>
                      <span className="text-[10px] font-bold text-[#1F3D2B]/50" style={{ fontFamily: font }}>
                        {isEn ? ch.nameEn : ch.nameAr}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Safe area padding */}
              <div className="h-6" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}