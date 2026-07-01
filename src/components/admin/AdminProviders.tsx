/**
 * AdminProviders — Provider management: list, verify, reject providers
 */
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon3D } from '../ui/Icon3D';
import { getProviders, verifyProvider } from './adminApi';
import { toast } from 'sonner@2.0.3';
import {
  Search, CheckCircle, XCircle, Clock, MapPin, Phone,
  Star, Briefcase, ChevronLeft, ChevronRight, Shield,
  User, Mail, RefreshCw,
} from 'lucide-react';

const fontCairo = 'Cairo, Tajawal, sans-serif';

type ProviderStatus = 'all' | 'pending' | 'verified';

const STATUS_FILTERS: { key: ProviderStatus; label: string; color: string }[] = [
  { key: 'all', label: 'الكل', color: '#6B7280' },
  { key: 'pending', label: 'بانتظار التحقق', color: '#F59E0B' },
  { key: 'verified', label: 'موثّقون', color: '#10B981' },
];

const PROVIDER_TYPE_LABELS: Record<string, string> = {
  plumber: 'سباك',
  electrician: 'كهربائي',
  painter: 'دهان',
  carpenter: 'نجار',
  cleaner: 'تنظيف',
  ac: 'مكيفات',
  construction: 'بناء',
  landscaping: 'تنسيق حدائق',
  tiles: 'بلاط',
  maintenance: 'صيانة عامة',
};

export function AdminProviders() {
  const { isDark } = useTheme();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQ, setSearchQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProviderStatus>('all');
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [noteModal, setNoteModal] = useState<{ open: boolean; id: string; action: 'verify' | 'reject'; name: string } | null>(null);
  const [noteText, setNoteText] = useState('');

  const cardClass = isDark
    ? 'bg-white/[0.13] backdrop-blur-xl border border-white/[0.18]'
    : 'bg-white border-[4px] border-gray-200/60';

  const inputClass = isDark
    ? 'bg-white/[0.10] border border-white/[0.15] text-white'
    : 'bg-white border-[3px] border-gray-200/60 text-[#1F3D2B]';

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProviders(page, 20, statusFilter, searchQ);
      setProviders(res.providers || []);
      setTotal(res.total || 0);
    } catch (err: any) {
      toast.error('خطأ في تحميل مزودي الخدمات: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchQ]);

  useEffect(() => { fetchProviders(); }, [fetchProviders]);

  const handleAction = async (id: string, action: 'verify' | 'reject', name: string) => {
    setNoteModal({ open: true, id, action, name });
  };

  const confirmAction = async () => {
    if (!noteModal) return;
    setActionLoading((prev) => ({ ...prev, [noteModal.id]: true }));
    try {
      await verifyProvider(noteModal.id, noteModal.action, noteText || undefined);
      toast.success(noteModal.action === 'verify' ? `تم توثيق ${noteModal.name}` : `تم رفض ${noteModal.name}`);
      setNoteModal(null);
      setNoteText('');
      fetchProviders();
    } catch (err: any) {
      toast.error('خطأ: ' + err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [noteModal?.id || '']: false }));
    }
  };

  const formatDate = (d: string) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('ar-AE', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6" style={{ fontFamily: fontCairo }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--bait-text)' }}>مزودو الخدمات</h2>
          <p className="text-sm" style={{ color: 'var(--bait-text-muted)' }}>
            إدارة وتوثيق مزودي الخدمات — إجمالي: {total}
          </p>
        </div>
        <button onClick={fetchProviders} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
          style={{ background: 'var(--bait-surface)', color: 'var(--bait-text)', border: '2px solid var(--bait-border)' }}>
          <RefreshCw size={14} />
          تحديث
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Status filter */}
        <div className="flex gap-2">
          {STATUS_FILTERS.map((f) => (
            <button key={f.key} onClick={() => { setStatusFilter(f.key); setPage(1); }}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
              style={{
                background: statusFilter === f.key ? `${f.color}20` : 'var(--bait-surface)',
                color: statusFilter === f.key ? f.color : 'var(--bait-text-secondary)',
                border: `2px solid ${statusFilter === f.key ? f.color + '60' : 'var(--bait-border)'}`,
              }}>
              {f.label}
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute top-1/2 -translate-y-1/2 end-3" style={{ color: 'var(--bait-text-muted)' }} />
          <input
            type="text"
            placeholder="بحث باسم أو بريد..."
            value={searchQ}
            onChange={(e) => { setSearchQ(e.target.value); setPage(1); }}
            className={`w-full px-4 pe-9 py-2 rounded-xl text-sm font-[Cairo] outline-none ${inputClass}`}
          />
        </div>
      </div>

      {/* Table */}
      <div className={`${cardClass} rounded-2xl overflow-hidden`}>
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--bait-skeleton)' }} />
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--bait-text-muted)' }}>
            <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold">لا يوجد مزودون</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--bait-border)' }}>
            {providers.map((p: any) => (
              <div key={p.id} className="p-4 flex flex-wrap items-center gap-4 hover:bg-white/5 transition-colors">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #FFD700)', color: '#5D4037' }}>
                  {(p.full_name || p.email || '?')[0].toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: 'var(--bait-text)' }}>{p.full_name || '-'}</span>
                    {p.is_verified ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
                        موثّق
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>
                        بانتظار
                      </span>
                    )}
                    {p.provider_type && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bait-badge-bg)', color: 'var(--bait-text-secondary)' }}>
                        {PROVIDER_TYPE_LABELS[p.provider_type] || p.provider_type}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {p.email && (
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--bait-text-muted)' }}>
                        <Mail size={10} />{p.email}
                      </span>
                    )}
                    {(p.primary_emirate || p.primary_city) && (
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--bait-text-muted)' }}>
                        <MapPin size={10} />{p.primary_emirate || p.primary_city}
                      </span>
                    )}
                    <span className="text-[11px]" style={{ color: 'var(--bait-text-muted)' }}>
                      {formatDate(p.created_at)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  {!p.is_verified && (
                    <button
                      onClick={() => handleAction(p.uid || p.id, 'verify', p.full_name || p.email)}
                      disabled={actionLoading[p.id]}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.03] disabled:opacity-50"
                      style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}
                    >
                      <CheckCircle size={12} />توثيق
                    </button>
                  )}
                  {p.is_verified && (
                    <button
                      onClick={() => handleAction(p.uid || p.id, 'reject', p.full_name || p.email)}
                      disabled={actionLoading[p.id]}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.03] disabled:opacity-50"
                      style={{ background: 'rgba(239,68,68,0.10)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }}
                    >
                      <XCircle size={12} />إلغاء التوثيق
                    </button>
                  )}
                  {!p.is_verified && (
                    <button
                      onClick={() => handleAction(p.uid || p.id, 'reject', p.full_name || p.email)}
                      disabled={actionLoading[p.id]}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.03] disabled:opacity-50"
                      style={{ background: 'rgba(239,68,68,0.10)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }}
                    >
                      <XCircle size={12} />رفض
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-xl disabled:opacity-30 hover:scale-105 transition-transform"
            style={{ background: 'var(--bait-surface)', color: 'var(--bait-text)' }}>
            <ChevronRight size={16} />
          </button>
          <span className="text-sm font-bold" style={{ color: 'var(--bait-text)' }}>
            {page} / {totalPages}
          </span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 rounded-xl disabled:opacity-30 hover:scale-105 transition-transform"
            style={{ background: 'var(--bait-surface)', color: 'var(--bait-text)' }}>
            <ChevronLeft size={16} />
          </button>
        </div>
      )}

      {/* Note Modal */}
      {noteModal?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className={`${cardClass} rounded-2xl p-6 w-full max-w-md space-y-4`} dir="rtl">
            <div className="flex items-center gap-3">
              <Icon3D icon={noteModal.action === 'verify' ? CheckCircle : XCircle} theme={noteModal.action === 'verify' ? 'teal' : 'red'} size="sm" hoverable={false} />
              <div>
                <h3 className="font-bold text-base" style={{ color: 'var(--bait-text)' }}>
                  {noteModal.action === 'verify' ? 'توثيق المزود' : 'رفض / إلغاء توثيق المزود'}
                </h3>
                <p className="text-xs" style={{ color: 'var(--bait-text-muted)' }}>{noteModal.name}</p>
              </div>
            </div>
            <textarea
              placeholder="ملاحظة (اختياري)..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 rounded-xl text-sm font-[Cairo] outline-none resize-none ${inputClass}`}
            />
            <div className="flex gap-3">
              <button onClick={confirmAction}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                style={{
                  background: noteModal.action === 'verify' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                  color: noteModal.action === 'verify' ? '#10B981' : '#EF4444',
                  border: `2px solid ${noteModal.action === 'verify' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                }}>
                {noteModal.action === 'verify' ? 'تأكيد التوثيق' : 'تأكيد الرفض'}
              </button>
              <button onClick={() => { setNoteModal(null); setNoteText(''); }}
                className="px-4 py-2.5 rounded-xl text-sm" style={{ color: 'var(--bait-text-muted)' }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
