/**
 * FullSearchScreen — شاشة البحث الذكي الموحدة
 * ═══════════════════════════════════════════
 * مربع البحث الرئيسي الوحيد في التطبيق
 * - بحث بالاسم أو الـ ID
 * - فلاتر صغيرة مدمجة (dropdowns)
 * - أوضاع: بالاسم / بالخريطة / بالمنطقة
 * - كل الأيقونات Icon3D — ممنوع emoji
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, X, MapPin, Clock, Map, ChevronLeft, Mic, Filter, Star,
  CheckCircle, SlidersHorizontal, ChevronDown, Building2, Package,
  Wrench, HardHat, Droplets, Zap, Wind, Paintbrush, Sparkles,
  Hammer, Hash, ArrowRight,
} from 'lucide-react';
import {
  searchAll,
  SearchResult,
  SearchFilters,
  POPULAR_SEARCHES,
  QUICK_CATEGORIES,
  UAE_CITIES,
} from '../../data/searchData';
import { useSearchStore } from '../../stores/search-store';
import { Icon3D } from '../ui/Icon3D';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

// ─── Quick Category Icons (Lucide — no emoji) ───
const QUICK_ICONS: Record<string, any> = {
  plumbing: Droplets,
  electrical: Zap,
  ac: Wind,
  painting: Paintbrush,
  cleaning: Sparkles,
  carpentry: Hammer,
};

// ─── Type filter options ───
const TYPE_OPTIONS = [
  { id: 'all', ar: 'الكل', en: 'All', icon: Filter },
  { id: 'service', ar: 'خدمات', en: 'Services', icon: Wrench },
  { id: 'provider', ar: 'مزودين', en: 'Providers', icon: Building2 },
  { id: 'product', ar: 'منتجات', en: 'Products', icon: Package },
];

// ─── Rating filter options ───
const RATING_OPTIONS = [0, 3, 4, 4.5, 5];

interface FullSearchScreenProps {
  onClose?: () => void;
  context?: string;
  onNavigate?: (route: string, serviceId?: string) => void;
}

export function FullSearchScreen({ onClose, context: propContext, onNavigate }: FullSearchScreenProps) {
  const { scope, setOpen, query: globalQuery, setQuery: setGlobalQuery } = useSearchStore();
  const { language } = useTranslation('common');
  const { isDark } = useTheme();
  const isEn = language === 'en';
  const f = isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif';
  const context = propContext || (scope === 'GLOBAL' ? 'home' : scope?.toLowerCase() || 'home');

  const [localQuery, setLocalQuery] = useState(globalQuery || '');
  const [searchMode, setSearchMode] = useState<'name' | 'id' | 'area'>('name');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<SearchFilters>({
    rating: 0,
    priceRange: 'all',
    verified: false,
    availability: 'all',
    type: 'all',
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('btr_recent_searches') || '[]');
    } catch { return []; }
  });
  const [selectedArea, setSelectedArea] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const serviceCategory = context?.startsWith('service:') ? context.replace('service:', '') : undefined;

  // Auto-search on query or filter change
  useEffect(() => {
    const t = setTimeout(() => performSearch(), 250);
    return () => clearTimeout(t);
  }, [localQuery, selectedFilters, serviceCategory]);

  // Sync local query to global store
  useEffect(() => {
    setGlobalQuery(localQuery);
  }, [localQuery, setGlobalQuery]);

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const performSearch = useCallback(() => {
    if (!localQuery.trim() && !selectedFilters.verified && selectedFilters.rating === 0 && selectedFilters.type === 'all') {
      setSearchResults([]);
      return;
    }
    let q = localQuery;
    if (serviceCategory) q = serviceCategory + ' ' + q;
    setSearchResults(searchAll(q.trim(), selectedFilters));
  }, [localQuery, selectedFilters, serviceCategory]);

  const handleClose = () => {
    if (onClose) onClose();
    setOpen(false);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchResults([]);
    setSelectedFilters({ rating: 0, priceRange: 'all', verified: false, availability: 'all', type: 'all' });
    setGlobalQuery('');
  };

  const handleSelectSuggestion = (s: string) => {
    setLocalQuery(s);
    saveRecent(s);
  };

  const handleSelectResult = (result: SearchResult) => {
    saveRecent(isEn ? result.titleEn : result.titleAr);
    if (result.type === 'service' && result.serviceId && onNavigate) onNavigate('service', result.serviceId);
    else if (result.type === 'product' && onNavigate) onNavigate('shop', result.id);
    else if (result.type === 'provider' && onNavigate) onNavigate('provider', result.id);
    handleClose();
  };

  const handleOpenMap = () => {
    if (onNavigate) onNavigate('/maps');
    handleClose();
  };

  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
    setLocalQuery(prev => {
      const base = prev.split(' في ')[0];
      return `${base} في ${area}`.trim();
    });
  };

  const saveRecent = (s: string) => {
    const updated = [s, ...recentSearches.filter(r => r !== s)].slice(0, 8);
    setRecentSearches(updated);
    try { localStorage.setItem('btr_recent_searches', JSON.stringify(updated)); } catch {}
  };

  const clearRecent = () => {
    setRecentSearches([]);
    try { localStorage.removeItem('btr_recent_searches'); } catch {}
  };

  const activeCount = [
    selectedFilters.type !== 'all',
    selectedFilters.rating > 0,
    selectedFilters.verified,
    selectedFilters.priceRange !== 'all',
  ].filter(Boolean).length;

  const bgMain = isDark ? 'bg-[#0F1117]' : 'bg-[#FAFAF7]';
  const cardBg = isDark ? 'bg-[#1E2030] border-white/10' : 'bg-white border-gray-200/60';
  const textMain = isDark ? 'text-white' : 'text-[#2C1810]';
  const textMuted = isDark ? 'text-white/50' : 'text-[#2C1810]/50';
  const chipActive = 'bg-[#D4AF37] text-white border-[#D4AF37]';
  const chipInactive = isDark ? 'bg-white/5 text-white/70 border-white/10' : 'bg-[#F5EEE1] text-[#2C1810]/70 border-gray-200/60';

  return (
    <div className={`fixed inset-0 ${bgMain} z-50 flex flex-col`} dir="rtl">

      {/* ═══ HEADER — Gradient ═══ */}
      <div className="bg-gradient-to-l from-[#2C1810] to-[#D4AF37] px-4 pt-6 pb-4 shrink-0">
        {/* Title Row */}
        <div className="flex items-center gap-3 mb-3">
          <button onClick={handleClose} className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white flex-1 text-lg font-extrabold" style={{ fontFamily: f }}>
            {serviceCategory ? (isEn ? `Search in ${serviceCategory}` : `البحث في ${serviceCategory}`) : (isEn ? 'Smart Search' : 'البحث الذكي')}
          </h1>
          {(localQuery || activeCount > 0) && (
            <button onClick={handleClear} className="text-white/70 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg" style={{ fontFamily: f }}>
              {isEn ? 'Clear' : 'مسح'}
            </button>
          )}
        </div>

        {/* ═══ SEARCH INPUT ═══ */}
        <div className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 border-[3px] ${isDark ? 'bg-white/10 border-white/15' : 'bg-white border-gray-200/60'}`}>
          <Search className={`w-5 h-5 ${isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]'} shrink-0`} />
          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder={
              searchMode === 'id'
                ? (isEn ? 'Enter provider or service ID...' : 'أدخل رقم المزود أو الخدمة...')
                : (isEn ? 'Search services, providers, products...' : 'ابحث عن خدمة، مزود، منتج...')
            }
            className={`flex-1 bg-transparent outline-none text-sm font-semibold ${isDark ? 'text-white placeholder:text-white/40' : 'text-[#2C1810] placeholder:text-[#2C1810]/40'}`}
            style={{ fontFamily: f }}
            onKeyDown={(e) => { if (e.key === 'Enter') performSearch(); }}
          />
          {localQuery && (
            <button onClick={() => setLocalQuery('')} className="p-1">
              <X className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
            </button>
          )}
          <button className={`p-2 rounded-xl ${isDark ? 'bg-[#FFD700]/20' : 'bg-[#D4AF37]/10'}`}>
            <Mic className={`w-4 h-4 ${isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]'}`} />
          </button>
        </div>

        {/* ═══ MODE CHIPS — Name / ID / Area ═══ */}
        <div className="flex gap-2 mt-3">
          {[
            { id: 'name' as const, icon: Search, ar: 'بالاسم', en: 'By Name' },
            { id: 'id' as const, icon: Hash, ar: 'بالرقم', en: 'By ID' },
            { id: 'area' as const, icon: MapPin, ar: 'بالمنطقة', en: 'By Area' },
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => {
                setSearchMode(mode.id);
                if (mode.id === 'id') setLocalQuery('');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border-[2px] ${
                searchMode === mode.id
                  ? 'bg-white text-[#2C1810] border-white shadow-md'
                  : 'bg-white/15 text-white/80 border-white/10'
              }`}
              style={{ fontFamily: f }}
            >
              <mode.icon className="w-3.5 h-3.5" />
              {isEn ? mode.en : mode.ar}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={handleOpenMap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-white/15 text-white/80 border-[2px] border-white/10 transition-all hover:bg-white/25"
            style={{ fontFamily: f }}
          >
            <Map className="w-3.5 h-3.5" />
            {isEn ? 'Map' : 'الخريطة'}
          </button>
        </div>
      </div>

      {/* ═══ INLINE FILTERS BAR ═══ */}
      <div className={`px-4 py-2.5 border-b shrink-0 ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {/* Type Chips */}
          {TYPE_OPTIONS.map(opt => {
            const active = selectedFilters.type === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedFilters({ ...selectedFilters, type: opt.id as any })}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap shrink-0 border-[2px] transition-all ${
                  active ? chipActive : chipInactive
                }`}
                style={{ fontFamily: f }}
              >
                <opt.icon className="w-3 h-3" />
                {isEn ? opt.en : opt.ar}
              </button>
            );
          })}
          <div className="w-px h-5 bg-gray-300/30 shrink-0" />
          {/* Rating Mini-Dropdown */}
          <button
            onClick={() => {
              const next = RATING_OPTIONS[(RATING_OPTIONS.indexOf(selectedFilters.rating || 0) + 1) % RATING_OPTIONS.length];
              setSelectedFilters({ ...selectedFilters, rating: next });
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap shrink-0 border-[2px] transition-all ${
              selectedFilters.rating > 0 ? chipActive : chipInactive
            }`}
            style={{ fontFamily: f }}
          >
            <Star className="w-3 h-3" />
            {selectedFilters.rating > 0 ? `${selectedFilters.rating}+` : (isEn ? 'Rating' : 'التقييم')}
          </button>
          {/* Verified Toggle */}
          <button
            onClick={() => setSelectedFilters({ ...selectedFilters, verified: !selectedFilters.verified })}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap shrink-0 border-[2px] transition-all ${
              selectedFilters.verified ? 'bg-[#3B5BFE] text-white border-[#3B5BFE]' : chipInactive
            }`}
            style={{ fontFamily: f }}
          >
            <CheckCircle className="w-3 h-3" />
            {isEn ? 'Verified' : 'موثق'}
          </button>
          {/* Advanced Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap shrink-0 border-[2px] transition-all ${
              showAdvanced ? chipActive : chipInactive
            }`}
            style={{ fontFamily: f }}
          >
            <SlidersHorizontal className="w-3 h-3" />
            {isEn ? 'More' : 'متقدم'}
            {activeCount > 0 && (
              <span className={`w-4 h-4 rounded-full text-[8px] flex items-center justify-center ${showAdvanced ? 'bg-white/20' : 'bg-[#D4AF37] text-white'}`}>
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* ─── Advanced Filters Panel (collapsible) ─── */}
        {showAdvanced && (
          <div className={`mt-2 rounded-xl p-3 border-[2px] ${cardBg}`}>
            {/* Price Range */}
            <div className="mb-3">
              <p className={`text-[10px] font-bold mb-1.5 ${textMuted}`} style={{ fontFamily: f }}>
                {isEn ? 'Price Range' : 'مستوى السعر'}
              </p>
              <div className="flex gap-1.5">
                {[
                  { id: 'all', ar: 'الكل', en: 'All' },
                  { id: 'budget', ar: 'اقتصادي', en: 'Budget' },
                  { id: 'mid', ar: 'متوسط', en: 'Mid' },
                  { id: 'premium', ar: 'فاخر', en: 'Premium' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedFilters({ ...selectedFilters, priceRange: p.id as any })}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border-[2px] transition-all ${
                      selectedFilters.priceRange === p.id ? chipActive : chipInactive
                    }`}
                    style={{ fontFamily: f }}
                  >
                    {isEn ? p.en : p.ar}
                  </button>
                ))}
              </div>
            </div>
            {/* Availability */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFilters({ ...selectedFilters, availability: selectedFilters.availability === 'online' ? 'all' : 'online' })}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold border-[2px] transition-all ${
                  selectedFilters.availability === 'online' ? 'bg-[#3B5BFE] text-white border-[#3B5BFE]' : chipInactive
                }`}
                style={{ fontFamily: f }}
              >
                <Zap className="w-3 h-3" />
                {isEn ? 'Available Now' : 'متاح الآن'}
              </button>
              {activeCount > 0 && (
                <button
                  onClick={() => setSelectedFilters({ rating: 0, priceRange: 'all', verified: false, availability: 'all', type: 'all' })}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold border-[2px] text-red-500 border-red-200 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}
                  style={{ fontFamily: f }}
                >
                  {isEn ? 'Reset' : 'مسح'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ═══ SCROLLABLE CONTENT ═══ */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4">

          {/* ─── AREA MODE: Show Emirates Grid ─── */}
          {searchMode === 'area' && !localQuery && (
            <div className="mb-5">
              <h3 className={`text-sm font-bold mb-2.5 ${textMain}`} style={{ fontFamily: f }}>
                {isEn ? 'Select Area' : 'اختر المنطقة'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {UAE_CITIES.map(city => (
                  <button
                    key={city}
                    onClick={() => handleSelectArea(city)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl border-[3px] transition-all ${
                      selectedArea === city
                        ? 'bg-[#3B5BFE] text-white border-[#3B5BFE] shadow-md'
                        : `${cardBg} hover:border-[#3B5BFE]/30`
                    }`}
                    style={{ fontFamily: f }}
                  >
                    <MapPin className={`w-4 h-4 ${selectedArea === city ? 'text-white' : 'text-[#3B5BFE]'}`} />
                    <span className={`text-sm font-bold ${selectedArea === city ? 'text-white' : textMain}`}>{city}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── SEARCH RESULTS ─── */}
          {searchResults.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className={`text-sm font-bold ${textMain}`} style={{ fontFamily: f }}>
                  {isEn ? `Results (${searchResults.length})` : `النتائج (${searchResults.length})`}
                </h3>
              </div>
              <div className="space-y-2">
                {searchResults.map(result => {
                  const TypeIcon = result.type === 'service' ? Wrench : result.type === 'provider' ? HardHat : Package;
                  const typeTheme = result.type === 'service' ? 'blue' : result.type === 'provider' ? 'gold' : 'amber';
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleSelectResult(result)}
                      className={`w-full rounded-xl p-3 border-[3px] text-start transition-all hover:shadow-md active:scale-[0.98] ${cardBg}`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon3D icon={TypeIcon} theme={typeTheme} size="sm" hoverable={false} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className={`text-sm font-bold truncate ${textMain}`} style={{ fontFamily: f }}>
                              {isEn ? result.titleEn : result.titleAr}
                            </h4>
                            {result.verified && (
                              <CheckCircle className="w-3.5 h-3.5 text-[#3B5BFE] shrink-0" />
                            )}
                          </div>
                          <p className={`text-[11px] line-clamp-1 mb-1 ${textMuted}`} style={{ fontFamily: f }}>
                            {isEn ? result.descriptionEn : result.descriptionAr}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap">
                            {/* ID Badge */}
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isDark ? 'bg-white/10 text-white/40' : 'bg-gray-100 text-gray-400'}`}>
                              #{result.id}
                            </span>
                            {/* Type */}
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isDark ? 'bg-[#D4AF37]/15 text-[#FFD700]' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}`}>
                              {result.type === 'service' ? (isEn ? 'Service' : 'خدمة') : result.type === 'provider' ? (isEn ? 'Provider' : 'مزود') : (isEn ? 'Product' : 'منتج')}
                            </span>
                            {/* Rating */}
                            {result.rating && (
                              <span className="flex items-center gap-0.5">
                                <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                                <span className={`text-[10px] font-bold ${textMain}`}>{result.rating}</span>
                              </span>
                            )}
                            {/* Price */}
                            {result.price && (
                              <span className={`text-[10px] font-bold ${isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]'}`}>
                                {result.price} {isEn ? 'AED' : 'د.إ'}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronLeft className={`w-4 h-4 shrink-0 mt-1 ${textMuted}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── NO RESULTS ─── */}
          {localQuery && searchResults.length === 0 && (
            <div className={`rounded-2xl p-8 text-center border-[3px] mb-5 ${cardBg}`}>
              <Icon3D icon={Search} theme="gold" size="lg" hoverable={false} className="mx-auto mb-3" />
              <h3 className={`text-base font-bold mb-1 ${textMain}`} style={{ fontFamily: f }}>
                {isEn ? 'No results found' : 'لا توجد نتائج'}
              </h3>
              <p className={`text-xs ${textMuted}`} style={{ fontFamily: f }}>
                {isEn ? 'Try different keywords or use filters' : 'جرب كلمات أخرى أو استخدم الفلاتر'}
              </p>
            </div>
          )}

          {/* ─── QUICK SEARCH CHIPS (when idle) ─── */}
          {!localQuery && searchMode !== 'area' && (
            <>
              <div className="mb-5">
                <h3 className={`text-sm font-bold mb-2.5 ${textMain}`} style={{ fontFamily: f }}>
                  {isEn ? 'Quick Search' : 'بحث سريع'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {QUICK_CATEGORIES.map(chip => {
                    const CIcon = QUICK_ICONS[chip.id] || Wrench;
                    return (
                      <button
                        key={chip.id}
                        onClick={() => handleSelectSuggestion(chip.searchQuery)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border-[3px] transition-all hover:shadow-md active:scale-95 ${cardBg}`}
                        style={{ fontFamily: f }}
                      >
                        <CIcon className="w-4 h-4 text-[#D4AF37]" />
                        <span className={`text-xs font-bold ${textMain}`}>
                          {isEn ? chip.labelEn : chip.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ─── RECENT SEARCHES ─── */}
              {recentSearches.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className={`text-sm font-bold ${textMain}`} style={{ fontFamily: f }}>
                      {isEn ? 'Recent Searches' : 'بحث سابق'}
                    </h3>
                    <button onClick={clearRecent} className="text-[11px] font-bold text-[#D4AF37]" style={{ fontFamily: f }}>
                      {isEn ? 'Clear all' : 'مسح الكل'}
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {recentSearches.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectSuggestion(s)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-[2px] transition-all hover:shadow-sm ${cardBg}`}
                      >
                        <Clock className={`w-4 h-4 ${textMuted}`} />
                        <span className={`flex-1 text-start text-xs font-semibold ${textMain}`} style={{ fontFamily: f }}>
                          {s}
                        </span>
                        <ArrowRight className={`w-3.5 h-3.5 ${textMuted} rotate-180`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── POPULAR / TRENDING ─── */}
              <div className="mb-5">
                <h3 className={`text-sm font-bold mb-2.5 ${textMain}`} style={{ fontFamily: f }}>
                  {isEn ? 'Popular Searches' : 'الأكثر بحثاً'}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCHES.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSuggestion(s)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border-[2px] hover:border-[#D4AF37]/30 ${chipInactive}`}
                      style={{ fontFamily: f }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
