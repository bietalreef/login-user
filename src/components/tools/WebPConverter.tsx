/**
 * WebPConverter.tsx — أداة تحويل الصور إلى WebP
 * ═══════════════════════════════════════════════
 * ثيم: زجاج رملي فاتح — ذهبي #D4AF37 — أزرق #3B5BFE
 * لا ثيم داكن · لا أخضر · لا إيموجي · أيقونات lucide-react فقط
 */
import { useState, useRef, useCallback, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, Download, Trash2, X, ImageIcon,
  Settings2, CheckCircle2, AlertCircle,
  ChevronDown, Package, RefreshCw, Eye, FileImage,
  ArrowRight, Info, Zap, FolderOpen, Copy, Check,
} from 'lucide-react';
import { useNavigate } from 'react-router@7.1.1';

// ── Types ──────────────────────────────────────────────────────────────────
interface ConvertedFile {
  id: string;
  originalName: string;
  originalSize: number;
  originalType: string;
  originalUrl: string;
  webpBlob: Blob | null;
  webpUrl: string | null;
  webpSize: number;
  status: 'pending' | 'converting' | 'done' | 'error';
  error?: string;
  customName?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function savingsPercent(orig: number, webp: number): number {
  if (!orig || !webp) return 0;
  return Math.round(((orig - webp) / orig) * 100);
}

function generateId() {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function slugify(name: string): string {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
}

async function convertToWebP(
  file: File,
  quality: number,
): Promise<{ blob: Blob; url: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas context unavailable')); return; }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (blob) {
            resolve({ blob, url: URL.createObjectURL(blob) });
          } else {
            reject(new Error('Conversion failed'));
          }
        },
        'image/webp',
        quality,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    img.src = objectUrl;
  });
}

async function downloadAllSequentially(
  files: ConvertedFile[],
  prefix: string,
  folder: string,
): Promise<void> {
  const doneFiles = files.filter(f => f.webpBlob && f.status === 'done');
  if (!doneFiles.length) return;

  const getName = (f: ConvertedFile) => {
    const base = f.customName
      ? slugify(f.customName)
      : slugify(f.originalName);
    const parts = [folder && folder !== 'products' ? folder : '', prefix, base]
      .filter(Boolean);
    return `${parts.join('-')}.webp`;
  };

  for (const f of doneFiles) {
    if (f.webpUrl) {
      const a = document.createElement('a');
      a.href = f.webpUrl;
      a.download = getName(f);
      a.click();
      await new Promise(r => setTimeout(r, 150));
    }
  }
}

// ── Target Folders ─────────────────────────────────────────────────────────
const FOLDERS = [
  { id: 'products', label: 'منتجات المتجر', path: '/assets/shop/products/' },
  { id: 'banners',  label: 'بانرات وعروض',  path: '/assets/shop/banners/' },
  { id: 'categories', label: 'فئات المتجر', path: '/assets/shop/categories/' },
  { id: 'seo',    label: 'صفحات SEO',     path: '/assets/seo/' },
  { id: 'other',   label: 'أخرى',          path: '/assets/' },
];

// ── الألوان والأنماط ────────────────────────────────────────────────────────
const SAND   = '#F5EDD6';
const SAND2  = '#EDE0C4';
const SAND3  = '#D6C4A0';
const GOLD   = '#D4AF37';
const GOLD_L = 'rgba(212,175,55,0.15)';
const GOLD_B = 'rgba(212,175,55,0.25)';
const BLUE   = '#3B5BFE';
const BLUE_L = 'rgba(59,91,254,0.10)';
const BLUE_B = 'rgba(59,91,254,0.20)';
const GLASS  = 'rgba(255,255,255,0.55)';
const GLASS2 = 'rgba(255,255,255,0.75)';
const TEXT   = '#2D2417';
const TEXT_M = '#7A6544';
const TEXT_L = '#B8A07A';
const SHADOW = '0 4px 24px rgba(180,140,60,0.10)';

// ── Component ───────────────────────────────────────────────────────────────
export function WebPConverter() {
  const navigate = useNavigate();
  const [files, setFiles]           = useState<ConvertedFile[]>([]);
  const [quality, setQuality]       = useState(0.85);
  const [prefix, setPrefix]         = useState('bietalreef');
  const [folder, setFolder]         = useState('products');
  const [dragging, setDragging]     = useState(false);
  const [converting, setConverting] = useState(false);
  const [preview, setPreview]       = useState<ConvertedFile | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide]   = useState(false);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // رابط المجلد المختار
  const selectedFolder = FOLDERS.find(f => f.id === folder) ?? FOLDERS[0];

  useEffect(() => {
    return () => {
      files.forEach(f => {
        if (f.originalUrl) URL.revokeObjectURL(f.originalUrl);
        if (f.webpUrl) URL.revokeObjectURL(f.webpUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback((rawFiles: FileList | File[]) => {
    const accepted = Array.from(rawFiles).filter(f => f.type.startsWith('image/'));
    if (!accepted.length) return;
    const newEntries: ConvertedFile[] = accepted.map(f => ({
      id: generateId(),
      originalName: f.name,
      originalSize: f.size,
      originalType: f.type,
      originalUrl: URL.createObjectURL(f),
      webpBlob: null,
      webpUrl: null,
      webpSize: 0,
      status: 'pending',
    }));
    setFiles(prev => [...prev, ...newEntries]);
    setTimeout(() => convertFiles(newEntries, accepted), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality]);

  const convertFiles = async (entries: ConvertedFile[], rawFiles: File[]) => {
    setConverting(true);
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const raw   = rawFiles[i];
      setFiles(prev => prev.map(f =>
        f.id === entry.id ? { ...f, status: 'converting' } : f,
      ));
      try {
        const { blob, url } = await convertToWebP(raw, quality);
        setFiles(prev => prev.map(f =>
          f.id === entry.id
            ? { ...f, status: 'done', webpBlob: blob, webpUrl: url, webpSize: blob.size }
            : f,
        ));
      } catch (err) {
        setFiles(prev => prev.map(f =>
          f.id === entry.id
            ? { ...f, status: 'error', error: (err as Error).message }
            : f,
        ));
      }
    }
    setConverting(false);
  };

  const reconvertAll = async () => {
    const pending = files.filter(f => f.status === 'done' || f.status === 'error');
    if (!pending.length) return;
    setConverting(true);
    for (const entry of pending) {
      setFiles(prev => prev.map(f =>
        f.id === entry.id ? { ...f, status: 'converting' } : f,
      ));
      try {
        const resp = await fetch(entry.originalUrl);
        const blob = await resp.blob();
        const file = new File([blob], entry.originalName, { type: entry.originalType });
        const { blob: wb, url } = await convertToWebP(file, quality);
        if (entry.webpUrl) URL.revokeObjectURL(entry.webpUrl);
        setFiles(prev => prev.map(f =>
          f.id === entry.id
            ? { ...f, status: 'done', webpBlob: wb, webpUrl: url, webpSize: wb.size }
            : f,
        ));
      } catch (err) {
        setFiles(prev => prev.map(f =>
          f.id === entry.id
            ? { ...f, status: 'error', error: (err as Error).message }
            : f,
        ));
      }
    }
    setConverting(false);
  };

  const downloadOne = (f: ConvertedFile) => {
    if (!f.webpUrl) return;
    const base = f.customName ? slugify(f.customName) : slugify(f.originalName);
    const name = prefix ? `${prefix}-${base}.webp` : `${base}.webp`;
    const a = document.createElement('a');
    a.href = f.webpUrl;
    a.download = name;
    a.click();
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (target) {
        URL.revokeObjectURL(target.originalUrl);
        if (target.webpUrl) URL.revokeObjectURL(target.webpUrl);
      }
      return prev.filter(f => f.id !== id);
    });
    if (preview?.id === id) setPreview(null);
  };

  const clearAll = () => {
    files.forEach(f => {
      URL.revokeObjectURL(f.originalUrl);
      if (f.webpUrl) URL.revokeObjectURL(f.webpUrl);
    });
    setFiles([]);
    setPreview(null);
  };

  const updateCustomName = (id: string, name: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, customName: name } : f));
  };

  const copyPath = (f: ConvertedFile) => {
    const base = f.customName ? slugify(f.customName) : slugify(f.originalName);
    const name = prefix ? `${prefix}-${base}.webp` : `${base}.webp`;
    const full = selectedFolder.path + name;
    navigator.clipboard.writeText(full).then(() => {
      setCopiedPath(f.id);
      setTimeout(() => setCopiedPath(null), 2000);
    });
  };

  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop      = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const doneFiles  = files.filter(f => f.status === 'done');
  const totalSaved = doneFiles.reduce((acc, f) => acc + (f.originalSize - f.webpSize), 0);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(145deg, ${SAND} 0%, ${SAND2} 50%, ${SAND3} 100%)`,
        fontFamily: 'Cairo, sans-serif',
        direction: 'rtl',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          background: GLASS2,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${GOLD_B}`,
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: SHADOW,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl transition-colors hover:bg-black/5"
              style={{ color: TEXT_M }}
              title="رجوع"
            >
              <ArrowRight size={18} />
            </button>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: GOLD_L,
                border: `1.5px solid ${GOLD_B}`,
                boxShadow: `0 2px 8px rgba(212,175,55,0.15)`,
              }}
            >
              <FileImage size={17} color={GOLD} />
            </div>
            <div>
              <h1 className="font-bold text-sm" style={{ color: TEXT }}>
                محوّل WebP
              </h1>
              <p className="text-xs" style={{ color: TEXT_L }}>
                PNG / JPG / GIF ← WebP محسّن لـ SEO
              </p>
            </div>
          </div>

          {/* Left side */}
          <div className="flex items-center gap-2">
            {doneFiles.length > 0 && (
              <div
                className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs"
                style={{ background: BLUE_L, border: `1px solid ${BLUE_B}` }}
              >
                <span style={{ color: TEXT_M }}>{doneFiles.length} صورة محوّلة</span>
                <span className="font-bold" style={{ color: GOLD }}>
                  وُفِّر {formatBytes(totalSaved)}
                </span>
              </div>
            )}

            <button
              onClick={() => setShowGuide(s => !s)}
              className="p-2 rounded-xl transition-colors hover:bg-black/5"
              style={{ color: showGuide ? BLUE : TEXT_M }}
              title="دليل المسارات"
            >
              <Info size={16} />
            </button>

            <button
              onClick={() => setShowSettings(s => !s)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: showSettings ? GOLD_L : GLASS,
                color: showSettings ? GOLD : TEXT_M,
                border: `1px solid ${showSettings ? GOLD_B : 'rgba(212,175,55,0.2)'}`,
              }}
            >
              <Settings2 size={13} />
              الإعدادات
              <ChevronDown
                size={12}
                style={{
                  transform: showSettings ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
          </div>
        </div>

        {/* ── Settings Panel ── */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                overflow: 'hidden',
                borderTop: `1px solid rgba(212,175,55,0.15)`,
                background: 'rgba(255,255,255,0.4)',
              }}
            >
              <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Quality */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold" style={{ color: TEXT }}>
                      جودة WebP
                    </label>
                    <span
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                      style={{ background: GOLD_L, color: GOLD }}
                    >
                      {Math.round(quality * 100)}%
                    </span>
                  </div>
                  <input
                    type="range" min={0.1} max={1} step={0.05}
                    value={quality}
                    onChange={e => setQuality(parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: GOLD }}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: TEXT_L }}>
                    <span>أقل حجم</span>
                    <span>أعلى جودة</span>
                  </div>
                </div>

                {/* Prefix */}
                <div>
                  <label className="text-xs font-semibold block mb-2" style={{ color: TEXT }}>
                    بادئة اسم الملف
                  </label>
                  <input
                    type="text"
                    value={prefix}
                    onChange={e => setPrefix(e.target.value)}
                    placeholder="bietalreef"
                    className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                    style={{
                      background: GLASS,
                      border: `1px solid ${GOLD_B}`,
                      color: TEXT,
                    }}
                  />
                  <p className="text-xs mt-1" style={{ color: TEXT_L }}>
                    مثال: {prefix || 'اسم'}-image.webp
                  </p>
                </div>

                {/* Folder */}
                <div>
                  <label className="text-xs font-semibold block mb-2" style={{ color: TEXT }}>
                    مجلد الوجهة
                  </label>
                  <select
                    value={folder}
                    onChange={e => setFolder(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                    style={{
                      background: GLASS,
                      border: `1px solid ${GOLD_B}`,
                      color: TEXT,
                    }}
                  >
                    {FOLDERS.map(f => (
                      <option key={f.id} value={f.id}>{f.label} — {f.path}</option>
                    ))}
                  </select>
                  <p className="text-xs mt-1 font-mono" style={{ color: TEXT_L }}>
                    /public{selectedFolder.path}
                  </p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="max-w-5xl mx-auto px-4 pb-4">
                  <button
                    onClick={reconvertAll}
                    disabled={converting}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: BLUE_L,
                      border: `1px solid ${BLUE_B}`,
                      color: BLUE,
                      opacity: converting ? 0.5 : 1,
                    }}
                  >
                    <RefreshCw size={13} className={converting ? 'animate-spin' : ''} />
                    إعادة ا��تحويل بالإعدادات الجديدة
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Path Guide ── */}
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                overflow: 'hidden',
                borderTop: `1px solid rgba(212,175,55,0.15)`,
                background: 'rgba(59,91,254,0.04)',
              }}
            >
              <div className="max-w-5xl mx-auto px-4 py-4">
                <p className="text-xs font-bold mb-3" style={{ color: BLUE }}>
                  دليل مسارات المتجر في /public/assets/
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {FOLDERS.map(f => (
                    <div
                      key={f.id}
                      className="rounded-lg p-3"
                      style={{
                        background: GLASS,
                        border: `1px solid ${GOLD_B}`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <FolderOpen size={13} color={GOLD} />
                        <span className="text-xs font-semibold" style={{ color: TEXT }}>
                          {f.label}
                        </span>
                      </div>
                      <p className="text-xs font-mono" style={{ color: TEXT_L }}>
                        /public{f.path}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-3 leading-relaxed" style={{ color: TEXT_M }}>
                  بعد التحميل، حدّث ملف <span className="font-mono font-bold">/data/shopAssets.ts</span> لتفعيل الصورة المحلية بدل Unsplash.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Drop Zone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative cursor-pointer rounded-2xl flex flex-col items-center justify-center gap-4 transition-all"
          style={{
            border: `2px dashed ${dragging ? GOLD : GOLD_B}`,
            background: dragging
              ? 'rgba(212,175,55,0.08)'
              : GLASS,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: files.length > 0 ? '20px 24px' : '64px 24px',
            boxShadow: SHADOW,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => e.target.files && addFiles(e.target.files)}
          />
          <motion.div
            animate={{ scale: dragging ? 1.06 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-3"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: dragging ? GOLD_L : 'rgba(212,175,55,0.08)',
                border: `1.5px solid ${dragging ? GOLD : GOLD_B}`,
                boxShadow: dragging ? `0 0 20px rgba(212,175,55,0.2)` : 'none',
              }}
            >
              <Upload size={24} color={dragging ? GOLD : GOLD} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold" style={{ color: dragging ? GOLD : TEXT }}>
                {dragging ? 'أفلت الصور هنا' : 'اسحب وأفلت الصور أو انقر للاختيار'}
              </p>
              <p className="text-xs mt-1" style={{ color: TEXT_L }}>
                PNG · JPG · GIF · BMP · TIFF — بدون حد للعدد
              </p>
            </div>
          </motion.div>

          {converting && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: BLUE_L, color: BLUE, border: `1px solid ${BLUE_B}` }}
            >
              <RefreshCw size={12} className="animate-spin" />
              جاري التحويل...
            </div>
          )}
        </div>

        {/* Action Bar */}
        {files.length > 0 && (
          <div className="flex items-center justify-between mt-4 mb-5">
            <span className="text-xs" style={{ color: TEXT_L }}>
              {files.length} ملف · {doneFiles.length} تم تحويله
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: 'rgba(220,38,38,0.07)',
                  border: '1px solid rgba(220,38,38,0.18)',
                  color: '#DC2626',
                }}
              >
                <Trash2 size={12} />
                مسح الكل
              </button>
              {doneFiles.length > 0 && (
                <button
                  onClick={() => downloadAllSequentially(files, prefix, folder)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${GOLD}, #b8960f)`,
                    color: '#fff',
                    boxShadow: `0 2px 10px rgba(212,175,55,0.3)`,
                  }}
                >
                  <Package size={13} />
                  تحميل الكل ({doneFiles.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Files Grid */}
        {files.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {files.map(f => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    background: GLASS2,
                    border: `1px solid ${GOLD_B}`,
                    boxShadow: SHADOW,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative group" style={{ aspectRatio: '4/3', background: SAND2 }}>
                    <img
                      src={f.webpUrl || f.originalUrl}
                      alt={f.originalName}
                      className="w-full h-full object-cover"
                    />

                    {/* Status overlay */}
                    {f.status === 'converting' && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: 'rgba(245,237,214,0.75)' }}
                      >
                        <RefreshCw size={20} color={BLUE} className="animate-spin" />
                      </div>
                    )}
                    {f.status === 'error' && (
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                        style={{ background: 'rgba(245,237,214,0.85)' }}
                      >
                        <AlertCircle size={18} color="#DC2626" />
                        <span className="text-xs font-semibold" style={{ color: '#DC2626' }}>خطأ</span>
                      </div>
                    )}
                    {f.status === 'done' && (
                      <div
                        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: GOLD, boxShadow: '0 2px 6px rgba(212,175,55,0.5)' }}
                      >
                        <CheckCircle2 size={11} color="#fff" />
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(245,237,214,0.88)' }}
                    >
                      {f.status === 'done' && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); setPreview(f); }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                            style={{ background: BLUE_L, border: `1px solid ${BLUE_B}` }}
                            title="معاينة"
                          >
                            <Eye size={14} color={BLUE} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadOne(f); }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                            style={{ background: GOLD_L, border: `1px solid ${GOLD_B}` }}
                            title="تحميل"
                          >
                            <Download size={14} color={GOLD} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); copyPath(f); }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                            style={{
                              background: copiedPath === f.id ? GOLD_L : GLASS,
                              border: `1px solid ${GOLD_B}`,
                            }}
                            title="نسخ المسار"
                          >
                            {copiedPath === f.id
                              ? <Check size={14} color={GOLD} />
                              : <Copy size={14} color={TEXT_M} />
                            }
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}
                        title="حذف"
                      >
                        <X size={14} color="#DC2626" />
                      </button>
                    </div>
                  </div>

                  {/* Info + editable name */}
                  <div className="px-2 py-2">
                    {/* اسم قابل للتعديل */}
                    <input
                      type="text"
                      value={f.customName ?? f.originalName.replace(/\.[^.]+$/, '')}
                      onChange={e => updateCustomName(f.id, e.target.value)}
                      className="w-full text-xs font-semibold outline-none bg-transparent border-b mb-1"
                      style={{
                        color: TEXT,
                        borderColor: 'rgba(212,175,55,0.3)',
                      }}
                      title="اسم الملف النهائي (قابل للتعديل)"
                    />
                    {f.status === 'done' && (
                      <div className="flex items-center justify-between mt-0.5">
                        <div className="flex items-center gap-1">
                          <span className="text-xs" style={{ color: TEXT_L }}>
                            {formatBytes(f.originalSize)}
                          </span>
                          <span className="text-xs" style={{ color: TEXT_L }}>→</span>
                          <span className="text-xs font-bold" style={{ color: GOLD }}>
                            {formatBytes(f.webpSize)}
                          </span>
                        </div>
                        {savingsPercent(f.originalSize, f.webpSize) > 0 && (
                          <span
                            className="text-xs font-bold px-1.5 py-0.5 rounded"
                            style={{ background: BLUE_L, color: BLUE }}
                          >
                            -{savingsPercent(f.originalSize, f.webpSize)}%
                          </span>
                        )}
                      </div>
                    )}
                    {f.status === 'pending' && (
                      <p className="text-xs" style={{ color: TEXT_L }}>في الانتظار</p>
                    )}
                    {f.status === 'converting' && (
                      <p className="text-xs font-semibold" style={{ color: BLUE }}>جاري التحويل...</p>
                    )}
                    {f.status === 'error' && (
                      <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>فشل التحويل</p>
                    )}
                    {/* المسار المقترح */}
                    {f.status === 'done' && (
                      <p
                        className="text-xs mt-1 font-mono truncate"
                        style={{ color: TEXT_L }}
                        title={`/public${selectedFolder.path}${prefix ? prefix + '-' : ''}${slugify(f.customName ?? f.originalName)}.webp`}
                      >
                        /public{selectedFolder.path}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {files.length === 0 && (
          <div className="flex flex-col items-center gap-3 mt-12 mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: GOLD_L, border: `1.5px solid ${GOLD_B}` }}
            >
              <ImageIcon size={28} color={GOLD} />
            </div>
            <p className="text-sm font-semibold" style={{ color: TEXT_M }}>
              لم يتم رفع أي صور بعد
            </p>
            <p className="text-xs text-center max-w-xs" style={{ color: TEXT_L }}>
              ارفع صور المتجر وسيتم تحويلها تلقائياً إلى WebP مع الحفاظ على الجودة
            </p>
          </div>
        )}

        {/* Summary Stats */}
        {doneFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {[
              { label: 'إجمالي الصور',  value: files.length.toString(),                                             color: TEXT },
              { label: 'تم التحويل',    value: doneFiles.length.toString(),                                         color: GOLD },
              { label: 'الحجم الأصلي', value: formatBytes(files.reduce((a, f) => a + f.originalSize, 0)), color: TEXT_M },
              { label: 'مساحة محفوظة', value: formatBytes(totalSaved),                                             color: BLUE },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="rounded-xl p-4 text-center"
                style={{
                  background: GLASS2,
                  border: `1px solid ${GOLD_B}`,
                  boxShadow: SHADOW,
                }}
              >
                <p className="text-xl font-bold" style={{ color }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: TEXT_L }}>{label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Workflow Guide Card */}
        <div
          className="mt-6 rounded-2xl p-5"
          style={{
            background: GLASS,
            border: `1px solid ${GOLD_B}`,
            boxShadow: SHADOW,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} color={GOLD} />
            <p className="text-sm font-bold" style={{ color: TEXT }}>
              خطوات إضافة صور المتجر
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              {
                step: '1',
                title: 'ارفع الصور',
                desc: 'PNG أو JPG من جهازك',
              },
              {
                step: '2',
                title: 'حوّل إلى WebP',
                desc: 'يتم التحويل تلقائياً في المتصفح',
              },
              {
                step: '3',
                title: 'حمّل وضع في المسار',
                desc: '/public/assets/shop/products/',
              },
              {
                step: '4',
                title: 'حدّث shopAssets.ts',
                desc: 'غيّر local من null إلى المسار',
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="rounded-xl p-3 flex flex-col gap-1"
                style={{ background: 'rgba(255,255,255,0.5)', border: `1px solid ${GOLD_B}` }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1"
                  style={{ background: GOLD, color: '#fff' }}
                >
                  {step}
                </div>
                <p className="text-xs font-bold" style={{ color: TEXT }}>{title}</p>
                <p className="text-xs" style={{ color: TEXT_L }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Preview Modal ── */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(45,36,23,0.6)', backdropFilter: 'blur(8px)' }}
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative rounded-2xl overflow-hidden max-w-2xl w-full"
              style={{ background: GLASS2, border: `1.5px solid ${GOLD_B}`, boxShadow: SHADOW }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: `1px solid ${GOLD_B}` }}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: TEXT }}>
                    {preview.customName ?? preview.originalName.replace(/\.[^.]+$/, '')}
                  </p>
                  <p className="text-xs" style={{ color: TEXT_L }}>
                    {formatBytes(preview.originalSize)} → {formatBytes(preview.webpSize)}
                    {' · '}
                    <span className="font-bold" style={{ color: BLUE }}>
                      -{savingsPercent(preview.originalSize, preview.webpSize)}%
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadOne(preview)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: GOLD_L, color: GOLD, border: `1px solid ${GOLD_B}` }}
                  >
                    <Download size={13} />
                    تحميل
                  </button>
                  <button
                    onClick={() => setPreview(null)}
                    className="p-2 rounded-xl hover:bg-black/5 transition-colors"
                    style={{ color: TEXT_M }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              {/* Image */}
              <img
                src={preview.webpUrl ?? preview.originalUrl}
                alt={preview.originalName}
                className="w-full object-contain"
                style={{ maxHeight: '70vh' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
