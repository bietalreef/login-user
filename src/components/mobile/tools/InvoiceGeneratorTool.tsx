import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, Trash2, Upload, Eye, Copy, Share2,
  Building2, Globe, Phone, Mail, MapPin, User,
  FileText, Printer, Receipt, Hash, Download,
} from 'lucide-react';
import {
  SimpleToolShell, InputCard, InputField, ActionButton,
  OptionSelector, formatAED,
} from './SimpleToolShell';
import { CollapsibleSection } from './CollapsibleSection';
import { useLanguage } from '../../../contexts/LanguageContext';
import { downloadPdfFromElement } from './pdfExport';

/* ── واجهة بنود الفاتورة ── */
interface InvoiceItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

/* ── وحدات القياس ── */
const UNITS_AR = [
  { id: 'item', label: 'قطعة' }, { id: 'm2', label: 'م²' }, { id: 'ml', label: 'م.ط' },
  { id: 'm3', label: 'م³' }, { id: 'set', label: 'طقم' }, { id: 'hour', label: 'ساعة' },
  { id: 'day', label: 'يوم' }, { id: 'kg', label: 'كجم' }, { id: 'ton', label: 'طن' },
  { id: 'service', label: 'خدمة' }, { id: 'lumpsum', label: 'مقطوعية' },
];
const UNITS_EN = [
  { id: 'item', label: 'Piece' }, { id: 'm2', label: 'm²' }, { id: 'ml', label: 'L.M' },
  { id: 'm3', label: 'm³' }, { id: 'set', label: 'Set' }, { id: 'hour', label: 'Hour' },
  { id: 'day', label: 'Day' }, { id: 'kg', label: 'Kg' }, { id: 'ton', label: 'Ton' },
  { id: 'service', label: 'Service' }, { id: 'lumpsum', label: 'Lump Sum' },
];

/* ═══════════════════════════════════════════════════════ */
export function InvoiceGeneratorTool({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const UNITS = isEn ? UNITS_EN : UNITS_AR;

  /* ── نوع الفاتورة ── */
  const [invoiceType, setInvoiceType] = useState<'tax' | 'simple' | 'credit'>('tax');

  /* ── بيانات الشركة ── */
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyTRN, setCompanyTRN] = useState('');

  /* ── بيانات العميل ── */
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientTRN, setClientTRN] = useState('');

  /* ── بيانات الفاتورة ── */
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [includeVAT, setIncludeVAT] = useState(true);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');

  /* ── البنود ── */
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', unit: 'item', quantity: 1, unitPrice: 0 },
  ]);

  /* ── حالة ── */
  const [showPreview, setShowPreview] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    company: true, client: true, details: false,
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const invoiceNumber = `BR-INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const toggleSection = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert(isEn ? 'Logo must be < 2MB' : 'الشعار أقل من 2 ميجابايت'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setCompanyLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, [isEn]);

  /* ── إدارة البنود ── */
  const addItem = () => setItems(prev => [...prev, { id: String(Date.now()), description: '', unit: 'item', quantity: 1, unitPrice: 0 }]);
  const removeItem = (id: string) => { if (items.length > 1) setItems(prev => prev.filter(i => i.id !== id)); };
  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));

  const validItems = items.filter(i => i.description.trim() && i.unitPrice > 0);
  const subtotal = validItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const vatAmount = includeVAT ? Math.round(subtotal * 0.05) : 0;
  const grandTotal = subtotal + vatAmount;

  const formattedDate = (d: string) => {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString(isEn ? 'en-US' : 'ar-AE', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return d; }
  };

  const handleGenerate = () => {
    if (validItems.length === 0) { alert(isEn ? 'Add at least one item' : 'أضف بنداً واحداً على الأقل'); return; }
    setShowPreview(true);
  };

  const handlePrint = () => {
    if (!previewRef.current) return;
    const pw = window.open('', '_blank');
    if (!pw) return;
    pw.document.write(`<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>${isEn ? 'Invoice' : 'فاتورة'} - ${invoiceNumber}</title><style>@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Cairo',sans-serif;direction:rtl}@page{size:A4;margin:0}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>${previewRef.current.innerHTML}</body></html>`);
    pw.document.close();
    setTimeout(() => pw.print(), 500);
  };

  const getInvoiceText = () => {
    let text = `═══════════════════════\n🧾 ${isEn ? 'Invoice' : 'فاتورة'} | ${invoiceNumber}\n═══════════════════════\n`;
    text += `📅 ${formattedDate(invoiceDate)}\n`;
    text += `🏢 ${companyName || '---'}${companyPhone ? ` | 📞 ${companyPhone}` : ''}\n`;
    text += `👤 ${isEn ? 'Client' : 'العميل'}: ${clientName || '---'}${clientPhone ? ` | 📞 ${clientPhone}` : ''}\n`;
    text += `───────────────────────\n`;
    validItems.forEach((i, idx) => { text += `${idx + 1}. ${i.description} | ${i.quantity} × ${i.unitPrice} = ${formatAED(i.quantity * i.unitPrice)}\n`; });
    text += `───────────────────────\n`;
    text += `${isEn ? 'Subtotal' : 'المجموع'}: ${formatAED(subtotal)}\n`;
    if (includeVAT) text += `${isEn ? 'VAT 5%' : 'ضريبة 5%'}: ${formatAED(vatAmount)}\n`;
    text += `═══════════════════════\n${isEn ? 'Total Due' : 'المستحق'}: ${formatAED(grandTotal)}\n═══════════════════════`;
    if (notes) text += `\n${isEn ? 'Notes' : 'ملاحظات'}: ${notes}`;
    text += `\n───────────────────────\n${isEn ? 'Beit Al Reef' : 'بيت الريف'}`;
    return text;
  };

  const L = {
    title: isEn ? 'Invoice Generator' : 'مولّد الفواتير',
    subtitle: isEn ? 'Create professional tax invoices' : 'أنشئ فاتورة ضريبية احترافية',
    invoiceType: isEn ? 'Invoice Type' : 'نوع الفاتورة',
    companyInfo: isEn ? 'Company Info' : 'بيانات الشركة',
    clientInfo: isEn ? 'Client Info' : 'بيانات العميل',
    invoiceDetails: isEn ? 'Invoice Details' : 'تفاصيل الفاتورة',
    items: isEn ? 'Invoice Items' : 'بنود الفاتورة',
    itemNum: isEn ? 'Item' : 'بند',
    addItem: isEn ? 'Add Item' : 'إضافة بند',
    generate: isEn ? 'Preview & Generate Invoice' : 'معاينة وإنشاء الفاتورة',
    preview: isEn ? 'Invoice Preview — A4' : 'معاينة الفاتورة — نموذج A4',
    copy: isEn ? 'Copy' : 'نسخ',
    whatsapp: isEn ? 'WhatsApp' : 'واتساب',
    printPdf: isEn ? 'Print PDF' : 'طباعة PDF',
    savePdf: isEn ? 'Save PDF' : 'حفظ PDF',
    close: isEn ? 'Close' : 'إغلاق',
    trn: isEn ? 'Tax Registration No. (TRN)' : 'رقم التسجيل الضريبي (TRN)',
    name: isEn ? 'Name' : 'الاسم',
    phone: isEn ? 'Phone' : 'الهاتف',
    email: isEn ? 'Email' : 'البريد',
    address: isEn ? 'Address' : 'العنوان',
    website: isEn ? 'Website' : 'الموقع',
    logo: isEn ? 'Logo' : 'الشعار',
    date: isEn ? 'Invoice Date' : 'تاريخ الفاتورة',
    due: isEn ? 'Due Date' : 'تاريخ الاستحقاق',
    ref: isEn ? 'Reference No.' : 'رقم مرجعي',
    vat: isEn ? 'Include VAT (5%)' : 'ضريبة القيمة المضافة (5%)',
    payMethod: isEn ? 'Payment Method' : 'طريقة الدفع',
    notes: isEn ? 'Notes' : 'ملاحظات',
    unit: isEn ? 'Unit' : 'الوحدة',
    qty: isEn ? 'Qty' : 'الكمية',
    price: isEn ? 'Price' : 'السعر',
    subtotalLabel: isEn ? 'Subtotal:' : 'المجموع:',
    descPh: isEn ? 'Item description' : 'وصف البند',
  };

  const invoiceTypeOpts = isEn
    ? [{ id: 'tax', label: 'Tax Invoice', icon: <Receipt className="w-4 h-4 text-teal-600" /> }, { id: 'simple', label: 'Simple', icon: <FileText className="w-4 h-4 text-gray-500" /> }, { id: 'credit', label: 'Credit Note', icon: <Receipt className="w-4 h-4 text-orange-500" /> }]
    : [{ id: 'tax', label: 'فاتورة ضريبية', icon: <Receipt className="w-4 h-4 text-teal-600" /> }, { id: 'simple', label: 'فاتورة بسيطة', icon: <FileText className="w-4 h-4 text-gray-500" /> }, { id: 'credit', label: 'إشعار دائن', icon: <Receipt className="w-4 h-4 text-orange-500" /> }];

  const payMethodOpts = isEn
    ? [{ id: 'bank', label: 'Bank Transfer', icon: <Building2 className="w-4 h-4 text-blue-500" /> }, { id: 'cash', label: 'Cash', icon: <Receipt className="w-4 h-4 text-green-500" /> }, { id: 'cheque', label: 'Cheque', icon: <FileText className="w-4 h-4 text-gray-500" /> }, { id: 'card', label: 'Card', icon: <Receipt className="w-4 h-4 text-purple-500" /> }]
    : [{ id: 'bank', label: 'تحويل بنكي', icon: <Building2 className="w-4 h-4 text-blue-500" /> }, { id: 'cash', label: 'نقداً', icon: <Receipt className="w-4 h-4 text-green-500" /> }, { id: 'cheque', label: 'شيك', icon: <FileText className="w-4 h-4 text-gray-500" /> }, { id: 'card', label: 'بطاقة', icon: <Receipt className="w-4 h-4 text-purple-500" /> }];

  const payMethodLabel = payMethodOpts.find(p => p.id === paymentMethod)?.label || '';

  return (
    <SimpleToolShell title={L.title} subtitle={L.subtitle} toolId="invoice" gradientFrom="#0F766E" gradientTo="#14B8A6" onBack={onBack}>
      {/* نوع الفاتورة */}
      <InputCard title={L.invoiceType}>
        <OptionSelector label={L.invoiceType} options={invoiceTypeOpts} value={invoiceType} onChange={v => setInvoiceType(v as any)} />
      </InputCard>

      {/* بيانات الشركة */}
      <CollapsibleSection isOpen={!!expandedSections.company} onToggle={() => toggleSection('company')} title={L.companyInfo} icon={<Building2 className="w-4 h-4 text-teal-500" />}>
        <div className="mb-3 flex items-center gap-3">
          <button onClick={() => logoInputRef.current?.click()} className="relative w-16 h-16 rounded-2xl border-[4px] border-dashed border-gray-300/60 bg-gray-50 flex flex-col items-center justify-center hover:border-teal-400 transition-all overflow-hidden group">
            {companyLogo ? (<><img src={companyLogo} alt="" className="w-full h-full object-contain p-1" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Upload className="w-4 h-4 text-white" /></div></>) : (<><Upload className="w-4 h-4 text-gray-400" /><span className="text-[8px] text-gray-400 font-cairo">{L.logo}</span></>)}
          </button>
          <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          {companyLogo && <button onClick={() => setCompanyLogo(null)} className="text-red-400 text-xs underline font-cairo">{isEn ? 'Remove' : 'إزالة'}</button>}
        </div>
        <InputField label={L.name} value={companyName} onChange={setCompanyName} type="text" placeholder={isEn ? 'Company name' : 'اسم الشركة'} />
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Phone className="w-3 h-3 inline ml-1" />{L.phone}</label><input type="tel" value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} placeholder="05X XXX XXXX" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-teal-400 font-cairo" dir="ltr" /></div>
          <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Mail className="w-3 h-3 inline ml-1" />{L.email}</label><input type="email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} placeholder="info@co.ae" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-teal-400 font-cairo" dir="ltr" /></div>
        </div>
        <div className="mt-3"><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><MapPin className="w-3 h-3 inline ml-1" />{L.address}</label><input type="text" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} placeholder={isEn ? 'Company address' : 'عنوان الشركة'} className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-teal-400 font-cairo" /></div>
        <div className="mt-3"><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Globe className="w-3 h-3 inline ml-1" />{L.website}</label><input type="url" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} placeholder="www.company.ae" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-teal-400 font-cairo" dir="ltr" /></div>
        {invoiceType === 'tax' && <div className="mt-3"><InputField label={L.trn} value={companyTRN} onChange={setCompanyTRN} type="text" placeholder="100XXXXXXXXX" /></div>}
      </CollapsibleSection>

      {/* بيانات العميل */}
      <CollapsibleSection isOpen={!!expandedSections.client} onToggle={() => toggleSection('client')} title={L.clientInfo} icon={<User className="w-4 h-4 text-green-500" />}>
        <InputField label={L.name} value={clientName} onChange={setClientName} type="text" placeholder={isEn ? 'Client name' : 'اسم العميل'} />
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Phone className="w-3 h-3 inline ml-1" />{L.phone}</label><input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="05X XXX XXXX" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-teal-400 font-cairo" dir="ltr" /></div>
          <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Mail className="w-3 h-3 inline ml-1" />{L.email}</label><input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@email.com" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-teal-400 font-cairo" dir="ltr" /></div>
        </div>
        <div className="mt-3"><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><MapPin className="w-3 h-3 inline ml-1" />{L.address}</label><input type="text" value={clientAddress} onChange={e => setClientAddress(e.target.value)} placeholder={isEn ? 'Client address' : 'عنوان العميل'} className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-teal-400 font-cairo" /></div>
        {invoiceType === 'tax' && <div className="mt-3"><InputField label={L.trn} value={clientTRN} onChange={setClientTRN} type="text" placeholder="100XXXXXXXXX" /></div>}
      </CollapsibleSection>

      {/* تفاصيل */}
      <CollapsibleSection isOpen={!!expandedSections.details} onToggle={() => toggleSection('details')} title={L.invoiceDetails} icon={<FileText className="w-4 h-4 text-orange-500" />}>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo">{L.date}</label><input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-teal-400 font-cairo" /></div>
          <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo">{L.due}</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-teal-400 font-cairo" /></div>
        </div>
        <div className="mt-3"><InputField label={L.ref} value={refNumber} onChange={setRefNumber} type="text" placeholder={isEn ? 'Quote or PO number' : 'رقم عرض السعر أو أمر الشراء'} /></div>
        <button onClick={() => setIncludeVAT(!includeVAT)} className={`w-full flex items-center justify-between p-3 rounded-xl border-[4px] transition-all mt-3 ${includeVAT ? 'border-teal-400 bg-teal-50' : 'border-gray-200/60 bg-white'}`}>
          <span className="font-cairo font-bold text-sm text-gray-700">{L.vat}</span>
          <div className={`w-12 h-7 rounded-full relative transition-colors ${includeVAT ? 'bg-teal-500' : 'bg-gray-300'}`}><div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${includeVAT ? 'right-0.5' : 'left-0.5'}`} /></div>
        </button>
        <div className="mt-3"><OptionSelector label={L.payMethod} options={payMethodOpts} value={paymentMethod} onChange={setPaymentMethod} /></div>
        <div className="mt-3"><label className="text-sm font-bold text-gray-500 font-cairo block mb-1.5">{L.notes}</label><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={isEn ? 'Notes...' : 'ملاحظات...'} className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-teal-400 font-cairo h-20 resize-none" /></div>
      </CollapsibleSection>

      {/* البنود */}
      <InputCard title={L.items}>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50/80 rounded-xl p-4 border-[4px] border-gray-100/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 font-cairo">{L.itemNum} #{idx + 1}</span>
                {items.length > 1 && <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100"><Trash2 className="w-3.5 h-3.5" /></button>}
              </div>
              <input type="text" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder={L.descPh} className="w-full p-3 bg-white rounded-lg border-[4px] border-gray-200/60 text-sm outline-none focus:border-teal-400 mb-2 font-cairo" />
              <div className="grid grid-cols-3 gap-2">
                <div><label className="text-[10px] text-gray-400 font-cairo block mb-1">{L.unit}</label><select value={item.unit} onChange={e => updateItem(item.id, 'unit', e.target.value)} className="w-full p-2.5 bg-white rounded-lg border-[4px] border-gray-200/60 text-xs font-cairo outline-none">{UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}</select></div>
                <div><label className="text-[10px] text-gray-400 font-cairo block mb-1">{L.qty}</label><input type="number" value={item.quantity || ''} onChange={e => updateItem(item.id, 'quantity', Number(e.target.value) || 0)} className="w-full p-2.5 bg-white rounded-lg border-[4px] border-gray-200/60 text-xs font-cairo outline-none text-center" min={1} /></div>
                <div><label className="text-[10px] text-gray-400 font-cairo block mb-1">{L.price}</label><input type="number" value={item.unitPrice || ''} onChange={e => updateItem(item.id, 'unitPrice', Number(e.target.value) || 0)} className="w-full p-2.5 bg-white rounded-lg border-[4px] border-gray-200/60 text-xs font-cairo outline-none text-center" min={0} /></div>
              </div>
              {item.quantity > 0 && item.unitPrice > 0 && <div className="mt-2 text-left"><span className="text-xs font-bold text-teal-600 font-cairo bg-teal-50 px-2 py-1 rounded-lg">= {formatAED(item.quantity * item.unitPrice)}</span></div>}
            </motion.div>
          ))}
        </div>
        <button onClick={addItem} className="w-full mt-3 py-3 border-[4px] border-dashed border-teal-300 rounded-xl text-teal-600 font-bold font-cairo text-sm flex items-center justify-center gap-2 hover:bg-teal-50 transition-colors"><Plus className="w-4 h-4" />{L.addItem}</button>
        {items.some(i => i.unitPrice > 0) && (<div className="mt-4 bg-teal-50 rounded-xl p-3 flex items-center justify-between"><span className="text-sm font-cairo text-gray-600">{L.subtotalLabel}</span><span className="text-lg font-bold font-cairo text-teal-700">{formatAED(subtotal)}</span></div>)}
      </InputCard>

      <div className="mb-4"><ActionButton onClick={handleGenerate} text={L.generate} icon="🧾" /></div>

      {/* ═══════════ A4 Preview ═══════════ */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto py-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-gray-100 w-full max-w-[650px] mx-2 rounded-2xl overflow-hidden shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex items-center justify-between z-20">
                <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-teal-500" /><h3 className="font-bold text-sm font-cairo text-[#1A1A1A]">{L.preview}</h3></div>
                <div className="flex items-center gap-2"><button onClick={handlePrint} className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center hover:bg-teal-100"><Printer className="w-4 h-4 text-teal-600" /></button><button onClick={() => setShowPreview(false)} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"><X className="w-4 h-4 text-gray-500" /></button></div>
              </div>
              <div className="p-3">
                <div ref={previewRef} style={{ width: '100%', maxWidth: '595px', minHeight: '842px', margin: '0 auto', background: '#fff', fontFamily: 'Cairo, sans-serif', direction: 'rtl', fontSize: '10px', lineHeight: '1.6', color: '#1A1A1A', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', borderRadius: '4px', overflow: 'hidden' }}>
                  {/* Header */}
                  <div style={{ background: 'linear-gradient(135deg, #0F766E, #14B8A6)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {companyLogo && <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '3px' }}><img src={companyLogo} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /></div>}
                      <div><div style={{ color: '#fff', fontWeight: 800, fontSize: '15px' }}>{companyName || (isEn ? 'Company' : 'الشركة')}</div>{companyAddress && <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '9px' }}>📍 {companyAddress}</div>}</div>
                    </div>
                    <div style={{ textAlign: 'left', color: 'rgba(255,255,255,0.9)', fontSize: '9px', lineHeight: '1.8' }}>
                      {companyPhone && <div>📞 {companyPhone}</div>}
                      {companyEmail && <div>✉️ {companyEmail}</div>}
                      {companyWebsite && <div>🌐 {companyWebsite}</div>}
                      {companyTRN && <div>🏷️ TRN: {companyTRN}</div>}
                    </div>
                  </div>
                  {/* Title */}
                  <div style={{ background: '#F0FDFA', borderBottom: '2px solid #CCFBF1', padding: '12px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '18px', color: '#0F766E' }}>{invoiceType === 'tax' ? (isEn ? 'TAX INVOICE' : 'فاتورة ضريبية') : invoiceType === 'credit' ? (isEn ? 'CREDIT NOTE' : 'إشعار دائن') : (isEn ? 'INVOICE' : 'فاتورة')}</div>
                      {!isEn && <div style={{ fontSize: '10px', color: '#14B8A6' }}>{invoiceType === 'tax' ? 'TAX INVOICE' : invoiceType === 'credit' ? 'CREDIT NOTE' : 'INVOICE'}</div>}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>{isEn ? 'Invoice No.' : 'رقم الفاتورة'}</div>
                      <div style={{ fontWeight: 700, fontSize: '12px', color: '#0F766E' }}>{invoiceNumber}</div>
                      <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>📅 {formattedDate(invoiceDate)}</div>
                      {dueDate && <div style={{ fontSize: '9px', color: '#DC2626' }}>⏰ {isEn ? 'Due' : 'الاستحقاق'}: {formattedDate(dueDate)}</div>}
                      {refNumber && <div style={{ fontSize: '9px', color: '#64748B' }}>📎 {isEn ? 'Ref' : 'مرجع'}: {refNumber}</div>}
                    </div>
                  </div>
                  {/* Parties */}
                  <div style={{ padding: '14px 28px 0' }}>
                    <div style={{ display: 'flex', gap: '14px' }}>
                      <div style={{ flex: 1, background: '#F8FAFC', borderRadius: '8px', padding: '10px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>{isEn ? 'FROM' : 'من'}</div>
                        <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '2px' }}>{companyName || '---'}</div>
                        {companyPhone && <div style={{ fontSize: '9px', color: '#64748B' }}>📞 {companyPhone}</div>}
                        {companyEmail && <div style={{ fontSize: '9px', color: '#64748B' }}>✉️ {companyEmail}</div>}
                        {companyTRN && <div style={{ fontSize: '9px', color: '#0F766E', fontWeight: 700 }}>TRN: {companyTRN}</div>}
                      </div>
                      <div style={{ flex: 1, background: '#F8FAFC', borderRadius: '8px', padding: '10px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>{isEn ? 'TO' : 'إلى'}</div>
                        <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '2px' }}>{clientName || (isEn ? 'Client' : 'العميل')}</div>
                        {clientPhone && <div style={{ fontSize: '9px', color: '#64748B' }}>📞 {clientPhone}</div>}
                        {clientEmail && <div style={{ fontSize: '9px', color: '#64748B' }}>✉️ {clientEmail}</div>}
                        {clientAddress && <div style={{ fontSize: '9px', color: '#64748B' }}>📍 {clientAddress}</div>}
                        {clientTRN && <div style={{ fontSize: '9px', color: '#0F766E', fontWeight: 700 }}>TRN: {clientTRN}</div>}
                      </div>
                    </div>
                  </div>
                  {/* Table */}
                  <div style={{ padding: '14px 28px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                      <thead><tr style={{ background: '#0F766E', color: '#fff' }}>
                        <th style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, borderRadius: '6px 0 0 0', width: '6%' }}>#</th>
                        <th style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 700, width: '38%' }}>{isEn ? 'Description' : 'الوصف'}</th>
                        <th style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, width: '12%' }}>{isEn ? 'Unit' : 'الوحدة'}</th>
                        <th style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, width: '12%' }}>{isEn ? 'Qty' : 'الكمية'}</th>
                        <th style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, width: '16%' }}>{isEn ? 'Price' : 'السعر'}</th>
                        <th style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, borderRadius: '0 6px 0 0', width: '16%' }}>{isEn ? 'Total' : 'الإجمالي'}</th>
                      </tr></thead>
                      <tbody>{validItems.map((item, idx) => (
                        <tr key={item.id} style={{ background: idx % 2 === 0 ? '#fff' : '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          <td style={{ padding: '8px 6px', textAlign: 'center', color: '#94A3B8', fontWeight: 700 }}>{idx + 1}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 600 }}>{item.description}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'center', color: '#64748B' }}>{UNITS.find(u => u.id === item.unit)?.label || item.unit}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'center' }}>{item.quantity}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'center' }}>{item.unitPrice.toLocaleString()}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, color: '#0F766E' }}>{(item.quantity * item.unitPrice).toLocaleString()}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                  {/* Totals */}
                  <div style={{ padding: '0 28px 12px', display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '220px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', fontSize: '11px', borderBottom: '1px solid #E2E8F0' }}><span style={{ color: '#64748B' }}>{isEn ? 'Subtotal' : 'المجموع'}</span><span style={{ fontWeight: 700 }}>{formatAED(subtotal)}</span></div>
                      {includeVAT && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', fontSize: '11px', borderBottom: '1px solid #E2E8F0' }}><span style={{ color: '#64748B' }}>{isEn ? 'VAT (5%)' : 'الضريبة (5%)'}</span><span style={{ fontWeight: 700 }}>{formatAED(vatAmount)}</span></div>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', fontSize: '14px', background: '#0F766E', color: '#fff', borderRadius: '0 0 8px 8px', fontWeight: 800 }}><span>{isEn ? 'Total Due' : 'المبلغ المستحق'}</span><span>{formatAED(grandTotal)}</span></div>
                    </div>
                  </div>
                  {/* Payment Method */}
                  <div style={{ padding: '0 28px 10px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 1, padding: '8px 10px', background: '#F0FDFA', borderRadius: '6px', border: '1px solid #CCFBF1', textAlign: 'center' }}><div style={{ fontSize: '8px', color: '#94A3B8' }}>{isEn ? 'Payment Method' : 'طريقة الدفع'}</div><div style={{ fontWeight: 700, fontSize: '11px', color: '#0F766E' }}>{payMethodLabel}</div></div>
                      {dueDate && <div style={{ flex: 1, padding: '8px 10px', background: '#FEF2F2', borderRadius: '6px', border: '1px solid #FECACA', textAlign: 'center' }}><div style={{ fontSize: '8px', color: '#94A3B8' }}>{isEn ? 'Due Date' : 'الاستحقاق'}</div><div style={{ fontWeight: 700, fontSize: '11px', color: '#DC2626' }}>{formattedDate(dueDate)}</div></div>}
                    </div>
                  </div>
                  {/* Notes */}
                  {notes && <div style={{ padding: '0 28px 10px' }}><div style={{ background: '#FEF9C3', borderRadius: '8px', padding: '8px 12px', border: '1px solid #FDE68A' }}><div style={{ fontSize: '9px', fontWeight: 700, color: '#92400E', marginBottom: '3px' }}>📝 {isEn ? 'Notes' : 'ملاحظات'}</div><div style={{ fontSize: '10px', color: '#78350F', lineHeight: '1.7' }}>{notes}</div></div></div>}
                  {/* Footer */}
                  <div style={{ background: '#0F766E', padding: '10px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}><div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px' }}>{isEn ? 'Generated via Beit Al Reef — app.bietalreef.ae' : 'تم إنشاء هذه الفاتورة عبر منصة بيت الريف — app.bietalreef.ae'}</div><div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px' }}>{isEn ? 'Page 1 of 1' : 'صفحة 1 من 1'}</div></div>
                </div>
              </div>
              {/* Actions */}
              <div className="p-4 bg-white border-t border-gray-200 space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => { navigator.clipboard?.writeText(getInvoiceText()).then(() => alert(isEn ? 'Invoice copied!' : 'تم نسخ الفاتورة')); }} className="flex flex-col items-center gap-1 py-3 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors"><Copy className="w-4 h-4 text-teal-600" /><span className="text-[10px] font-bold font-cairo text-teal-700">{L.copy}</span></button>
                  <button onClick={() => { window.open(`https://wa.me/?text=${encodeURIComponent(getInvoiceText())}`, '_blank'); }} className="flex flex-col items-center gap-1 py-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"><Share2 className="w-4 h-4 text-green-600" /><span className="text-[10px] font-bold font-cairo text-green-700">{L.whatsapp}</span></button>
                  <button onClick={() => { if (previewRef.current) downloadPdfFromElement(previewRef.current, `${isEn ? 'Invoice' : 'فاتورة'}-${invoiceNumber}`); }} className="flex flex-col items-center gap-1 py-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"><Download className="w-4 h-4 text-red-600" /><span className="text-[10px] font-bold font-cairo text-red-700">{L.savePdf}</span></button>
                  <button onClick={handlePrint} className="flex flex-col items-center gap-1 py-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"><Printer className="w-4 h-4 text-blue-600" /><span className="text-[10px] font-bold font-cairo text-blue-700">{L.printPdf}</span></button>
                </div>
                <button onClick={() => setShowPreview(false)} className="w-full py-3 bg-gray-100 rounded-xl text-sm font-bold font-cairo text-gray-600 hover:bg-gray-200 transition-colors">{L.close}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SimpleToolShell>
  );
}