/**
 * AdminDeletionRequests — Admin panel for workspace deletion requests
 * ═══════════════════════════════════════════════════════════════════
 * Admin can view, approve, or reject workspace deletion requests.
 * Approve → soft deletes workspace, downgrades subscription.
 * Reject → updates status, notifies user.
 */

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getDeletionRequests, actionDeletionRequest } from './adminApi';
import { Icon3D } from '../ui/Icon3D';
import { toast } from 'sonner@2.0.3';
import {
  Trash2, CheckCircle, XCircle, Clock, Loader2,
  RefreshCw, Filter, AlertTriangle, Building2, Mail, Calendar,
} from 'lucide-react';
// CheckCircle2 not available — using CheckCircle as alias
const CheckCircle2 = CheckCircle;

const fontCairo = 'Cairo, sans-serif';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export function AdminDeletionRequests() {
  const { isDark } = useTheme();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState<Record<string, string>>({});

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/60' : 'text-[#1F3D2B]/60';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const cardClass = isDark
    ? 'bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] rounded-2xl'
    : 'bg-white border-[4px] border-gray-200/60 rounded-2xl shadow-sm';

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDeletionRequests(filter);
      setRequests(data.requests || []);
    } catch (err: any) {
      console.error('Failed to load deletion requests:', err);
      toast.error('Failed to load deletion requests');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAction = async (reqId: string, action: 'approve' | 'reject') => {
    setActionLoading(reqId);
    try {
      await actionDeletionRequest(reqId, action, adminNote[reqId] || '');
      toast.success(
        action === 'approve'
          ? 'Request approved. Workspace soft-deleted and subscription downgraded.'
          : 'Request rejected.'
      );
      // Refresh list
      await fetchRequests();
    } catch (err: any) {
      console.error(`Failed to ${action} deletion request:`, err);
      toast.error(err.message || `Failed to ${action} request`);
    } finally {
      setActionLoading(null);
    }
  };

  const STATUS_CONFIG = {
    pending: { label: 'قيد المراجعة', color: 'bg-[#D4AF37]/10 text-[#D4AF37]', icon: Clock },
    approved: { label: 'تمت الموافقة', color: 'bg-red-100 text-red-600', icon: CheckCircle2 },
    rejected: { label: 'مرفوض', color: 'bg-gray-100 text-gray-500', icon: XCircle },
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="p-6 space-y-6" dir="rtl" style={{ fontFamily: fontCairo }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon3D icon={Trash2} theme="red" size="md" />
          <div>
            <h1 className={`text-lg font-bold ${textClass}`}>
              طلبات حذف مساحات العمل
            </h1>
            <p className={`text-xs ${mutedClass}`}>
              {pendingCount > 0
                ? `${pendingCount} طلب قيد المراجعة`
                : 'لا توجد طلبات معلّقة'}
            </p>
          </div>
        </div>
        <button
          onClick={fetchRequests}
          disabled={loading}
          className={`p-2.5 rounded-xl ${isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''} ${mutedClass}`} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === f
                ? 'bg-[#D4AF37] text-white'
                : isDark
                  ? 'bg-white/5 text-white/50 hover:bg-white/10'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {f === 'all' ? 'الكل' : f === 'pending' ? 'معلّقة' : f === 'approved' ? 'موافق عليها' : 'مرفوضة'}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        </div>
      ) : requests.length === 0 ? (
        <div className={`${cardClass} p-8 text-center`}>
          <Icon3D icon={CheckCircle2} theme="gold" size="xl" className="mx-auto mb-4" />
          <p className={`font-bold ${textClass}`}>لا توجد طلبات</p>
          <p className={`text-sm mt-1 ${mutedClass}`}>
            لم يتم العثور على طلبات حذف مطابقة للفلتر
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => {
            const statusConf = STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
            const StatusIcon = statusConf.icon;
            const isProcessing = actionLoading === req.id;

            return (
              <div key={req.id} className={`${cardClass} p-5 space-y-4`}>
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      req.status === 'pending'
                        ? 'bg-[#D4AF37]/10'
                        : req.status === 'approved'
                          ? 'bg-red-500/10'
                          : 'bg-gray-100'
                    }`}>
                      <StatusIcon className={`w-5 h-5 ${
                        req.status === 'pending' ? 'text-[#D4AF37]' : req.status === 'approved' ? 'text-red-500' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${textClass}`}>
                        {req.workspace_name || 'Workspace'}
                      </p>
                      <p className={`text-[10px] font-mono ${mutedClass}`}>
                        {req.id}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${statusConf.color}`}>
                    {statusConf.label}
                  </span>
                </div>

                {/* Details */}
                <div className={`grid grid-cols-2 gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <Mail className={`w-3 h-3 ${mutedClass}`} />
                    <span className={`text-xs ${mutedClass}`}>{req.user_email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-3 h-3 ${mutedClass}`} />
                    <span className={`text-xs ${mutedClass}`}>
                      {new Date(req.requested_at).toLocaleDateString('ar-AE', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className={`w-3 h-3 ${mutedClass}`} />
                    <span className={`text-xs font-mono ${mutedClass}`}>{req.workspace_id?.slice(0, 12)}...</span>
                  </div>
                  {req.reason && (
                    <div className="col-span-2">
                      <p className={`text-xs ${mutedClass}`}>
                        <span className="font-bold">السبب:</span> {req.reason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Admin reviewed info */}
                {req.reviewed_at && (
                  <div className={`text-xs ${mutedClass} border-t ${isDark ? 'border-white/8' : 'border-gray-100'} pt-3`}>
                    <p>تمت المراجعة: {new Date(req.reviewed_at).toLocaleDateString('ar-AE')}</p>
                    {req.admin_note && <p className="mt-1">ملاحظة المسؤول: {req.admin_note}</p>}
                  </div>
                )}

                {/* Actions (only for pending requests) */}
                {req.status === 'pending' && (
                  <div className="space-y-3 pt-2">
                    <input
                      className={`w-full px-3 py-2 rounded-xl border text-xs ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white'
                          : 'bg-gray-50 border-gray-200 text-[#1F3D2B]'
                      }`}
                      placeholder="ملاحظة المسؤول (اختياري)"
                      value={adminNote[req.id] || ''}
                      onChange={e =>
                        setAdminNote(prev => ({ ...prev, [req.id]: e.target.value }))
                      }
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(req.id, 'approve')}
                        disabled={isProcessing}
                        className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            موافقة (حذف)
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleAction(req.id, 'reject')}
                        disabled={isProcessing}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
                          isDark
                            ? 'bg-white/10 text-white/70 hover:bg-white/15'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {isProcessing ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            رفض
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}