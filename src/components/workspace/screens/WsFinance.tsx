/**
 * WsFinance — Finance & Invoices
 * ═══════════════════════════════
 * Income/Expense CRUD — no approvals
 */

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../contexts/LanguageContext';
import { useWorkspace } from '../WorkspaceContext';
import { getFinanceCategories } from '../config';
import { Icon3D } from '../../ui/Icon3D';
import * as api from '../workspaceApi';
import { toast } from 'sonner@2.0.3';
import {
  DollarSign, Plus, X, TrendingUp, TrendingDown, Wallet,
  Loader2, Calendar, Tag,
} from 'lucide-react';

const fontCairo = 'Cairo, Tajawal, sans-serif';

export function WsFinance() {
  const { isDark } = useTheme();
  const { language } = useTranslation('common');
  const isEn = language === 'en';
  const ws = useWorkspace();
  const { workspace, financeEntries, myRole } = ws;

  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ type: 'expense' as 'income' | 'expense', category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/60' : 'text-[#1F3D2B]/60';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const cardClass = isDark
    ? 'bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl'
    : 'bg-white border-[4px] border-gray-200/60 rounded-2xl shadow-sm';
  const inputClass = `w-full px-4 py-3 rounded-xl border-[4px] border-gray-200/60 text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-white text-[#1F3D2B]'}`;

  useEffect(() => { ws.loadFinance(); }, []);

  const categories = workspace ? getFinanceCategories(workspace.business_type, isEn) : [];

  const totalIncome = financeEntries.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const totalExpenses = financeEntries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpenses;

  const handleAdd = async () => {
    if (!form.amount || !form.description.trim() || !workspace) return;
    setAdding(true);
    try {
      await api.createFinanceEntry(workspace.id, {
        type: form.type,
        category: form.category || 'other',
        amount: Number(form.amount),
        description: form.description,
        date: form.date,
      });
      toast.success(isEn ? 'Entry added!' : 'تمت الإضافة!');
      setShowAdd(false);
      setForm({ type: 'expense', category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
      await ws.loadFinance();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="px-5 pt-8 pb-4 space-y-5" style={{ fontFamily: fontCairo }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon3D icon={DollarSign} theme="gold" size="md" />
          <div>
            <h1 className={`text-lg font-bold ${textClass}`}>
              {isEn ? 'Finance' : 'المالية'}
            </h1>
            <p className={`text-xs ${mutedClass}`}>
              {financeEntries.length} {isEn ? 'entries' : 'قيد'}
            </p>
          </div>
        </div>
        {(myRole === 'owner' || myRole === 'admin') && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            className={`p-2.5 rounded-xl border-[4px] transition-all ${
              showAdd ? 'bg-red-500/10 border-red-200/60 text-red-500'
                : isDark ? 'bg-[#FFD700]/15 border-[#FFD700]/30 text-[#FFD700]' : 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]'
            }`}
          >
            {showAdd ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className={`${cardClass} p-3 text-center`}>
          <TrendingUp className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className={`text-[10px] ${mutedClass}`}>{isEn ? 'Income' : 'إيرادات'}</p>
          <p className={`text-sm font-bold ${textClass}`}>{totalIncome.toLocaleString()}</p>
        </div>
        <div className={`${cardClass} p-3 text-center`}>
          <TrendingDown className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <p className={`text-[10px] ${mutedClass}`}>{isEn ? 'Expenses' : 'مصروفات'}</p>
          <p className={`text-sm font-bold ${textClass}`}>{totalExpenses.toLocaleString()}</p>
        </div>
        <div className={`${cardClass} p-3 text-center`}>
          <Wallet className={`w-5 h-5 mx-auto mb-1 ${balance >= 0 ? goldClass : 'text-red-400'}`} />
          <p className={`text-[10px] ${mutedClass}`}>{isEn ? 'Balance' : 'الرصيد'}</p>
          <p className={`text-sm font-bold ${balance >= 0 ? goldClass : 'text-red-400'}`}>
            {balance.toLocaleString()} {isEn ? 'AED' : 'د.إ'}
          </p>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className={`${cardClass} p-4 space-y-3`}>
          {/* Type Toggle */}
          <div className="flex gap-2">
            {(['income', 'expense'] as const).map(type => (
              <button
                key={type}
                onClick={() => setForm(f => ({ ...f, type }))}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-[4px] transition-all ${
                  form.type === type
                    ? type === 'income'
                      ? 'border-blue-300/60 bg-blue-500/10 text-blue-500'
                      : 'border-red-300/60 bg-red-500/10 text-red-500'
                    : isDark ? 'border-white/10 text-white/50' : 'border-gray-200/60 text-gray-400'
                }`}
              >
                {type === 'income' ? (isEn ? 'Income' : 'إيراد') : (isEn ? 'Expense' : 'مصروف')}
              </button>
            ))}
          </div>

          <input type="number" className={inputClass} value={form.amount}
            onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            placeholder={isEn ? 'Amount (AED) *' : 'المبلغ (د.إ) *'} />

          <input className={inputClass} value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder={isEn ? 'Description *' : 'الوصف *'} />

          <select className={inputClass} value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            <option value="">{isEn ? 'Category' : 'التصنيف'}</option>
            {categories.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <input type="date" className={inputClass} value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />

          <button onClick={handleAdd} disabled={adding || !form.amount || !form.description.trim()}
            className="w-full py-3 rounded-xl font-bold text-sm bg-[#D4AF37] text-white hover:bg-[#C8A86A] disabled:opacity-50 transition-colors">
            {adding ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : isEn ? 'Add Entry' : 'إضافة القيد'}
          </button>
        </div>
      )}

      {/* Entries List */}
      {financeEntries.length === 0 ? (
        <div className={`${cardClass} p-8 text-center`}>
          <Icon3D icon={DollarSign} theme="gold" size="xl" className="mx-auto mb-4" />
          <p className={`font-bold ${textClass}`}>{isEn ? 'No entries yet' : 'لا توجد قيود بعد'}</p>
          <p className={`text-sm mt-1 ${mutedClass}`}>{isEn ? 'Add your first financial entry' : 'أضف أول قيد مالي'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {financeEntries.map(entry => (
            <div key={entry.id} className={`${cardClass} p-3.5 flex items-center gap-3`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                entry.type === 'income' ? 'bg-blue-500/15' : 'bg-red-500/15'
              }`}>
                {entry.type === 'income'
                  ? <TrendingUp className="w-4 h-4 text-blue-500" />
                  : <TrendingDown className="w-4 h-4 text-red-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${textClass}`}>{entry.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] flex items-center gap-1 ${mutedClass}`}>
                    <Calendar className="w-3 h-3" />{entry.date}
                  </span>
                  {entry.category && (
                    <span className={`text-[10px] flex items-center gap-1 ${mutedClass}`}>
                      <Tag className="w-3 h-3" />{entry.category}
                    </span>
                  )}
                </div>
              </div>
              <span className={`text-sm font-bold ${entry.type === 'income' ? 'text-blue-500' : 'text-red-400'}`}>
                {entry.type === 'income' ? '+' : '-'}{entry.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
