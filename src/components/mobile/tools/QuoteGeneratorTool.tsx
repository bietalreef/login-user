import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, Trash2, Upload, Eye, Copy, Share2,
  Building2, Globe, Phone, Mail, MapPin, User, FileText,
  CreditCard, Shield, Printer, Download,
} from 'lucide-react';
import {
  SimpleToolShell, InputCard, InputField, ActionButton,
  formatAED,
} from './SimpleToolShell';
import { CollapsibleSection } from './CollapsibleSection';
import { QuoteItem, calculateQuote, QuoteResult } from './logic/AllCalculators';
import { useLanguage } from '../../../contexts/LanguageContext';
import { downloadPdfFromElement } from './pdfExport';

/* ── وحدات القياس ── */
const COMMON_UNITS_AR = [
  { id: 'item', label: 'قطعة' },
  { id: 'm2', label: 'م²' },
  { id: 'ml', label: 'م.ط' },
  { id: 'm3', label: 'م³' },
  { id: 'set', label: 'طقم' },
  { id: 'hour', label: 'ساعة' },
  { id: 'day', label: 'يوم' },
  { id: 'kg', label: 'كجم' },
  { id: 'ton', label: 'طن' },
  { id: 'lumpsum', label: 'مقطوعية' },
];
const COMMON_UNITS_EN = [
  { id: 'item', label: 'Piece' },
  { id: 'm2', label: 'm²' },
  { id: 'ml', label: 'L.M' },
  { id: 'm3', label: 'm³' },
  { id: 'set', label: 'Set' },
  { id: 'hour', label: 'Hour' },
  { id: 'day', label: 'Day' },
  { id: 'kg', label: 'Kg' },
  { id: 'ton', label: 'Ton' },
  { id: 'lumpsum', label: 'Lump Sum' },
];

/* ── الشروط والأحكام الافتراضية ── */
const DEFAULT_TERMS_AR = [
  'الأسعار المذكورة بالدرهم الإماراتي وتشمل التوريد والتركيب ما لم يُذكر خلاف ذلك.',
  'يُعد هذا العرض ساريًا لمدة 15 يومًا من تاريخ الإصدار.',
  'أي تغييرات في نطاق العمل بعد التوقيع قد تؤدي لتعديل في السعر والمدة.',
  'الضمان على الأعمال المنفذة: سنة واحدة من تاريخ التسليم.',
  'لا يشمل العرض أي أعمال إضافية غير مذكورة أعلاه.',
];
const DEFAULT_TERMS_EN = [
  'Prices are in AED and include supply and installation unless otherwise stated.',
  'This quotation is valid for 15 days from the date of issue.',
  'Any changes in scope after signing may result in price and timeline adjustments.',
  'Warranty on completed works: one year from handover date.',
  'This quotation does not include any additional works not mentioned above.',
];

/* ── واجهة الدفعات ── */
interface PaymentInstallment {
  id: string;
  label: string;
  percentage: number;
  description: string;
}

const DEFAULT_INSTALLMENTS_AR: PaymentInstallment[] = [
  { id: '1', label: 'دفعة مقدمة', percentage: 30, description: 'عند توقيع العقد' },
  { id: '2', label: 'دفعة ثانية', percentage: 40, description: 'عند إنجاز 50% من الأعمال' },
  { id: '3', label: 'دفعة نهائية', percentage: 30, description: 'عند التسليم والاستلام' },
];
const DEFAULT_INSTALLMENTS_EN: PaymentInstallment[] = [
  { id: '1', label: 'Down Payment', percentage: 30, description: 'Upon signing the contract' },
  { id: '2', label: 'Second Payment', percentage: 40, description: 'Upon 50% completion' },
  { id: '3', label: 'Final Payment', percentage: 30, description: 'Upon handover' },
];

/* ═══════════════════════════════════════════════════════ */
export function QuoteGeneratorTool({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const COMMON_UNITS = isEn ? COMMON_UNITS_EN : COMMON_UNITS_AR;

  /* ── بيانات الشركة ── */
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [providerName, setProviderName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyPhone2, setCompanyPhone2] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');

  /* ── بيانات العميل ── */
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientLocation, setClientLocation] = useState('');

  /* ── بيانات المشروع ── */
  const [projectName, setProjectName] = useState('');

  /* ── بيانات المسؤول ── */
  const [responsibleName, setResponsibleName] = useState('');
  const [responsibleTitle, setResponsibleTitle] = useState('');
  const [responsiblePhone, setResponsiblePhone] = useState('');

  /* ── البنود ── */
  const [items, setItems] = useState<QuoteItem[]>([
    { id: '1', description: '', unit: 'item', quantity: 1, unitPrice: 0 },
  ]);

  /* ── الملاحظات والشروط ── */
  const [notes, setNotes] = useState('');
  const [includeVAT, setIncludeVAT] = useState(true);
  const [validityDays, setValidityDays] = useState('15');
  const [terms, setTerms] = useState<string[]>([...(isEn ? DEFAULT_TERMS_EN : DEFAULT_TERMS_AR)]);
  const [newTerm, setNewTerm] = useState('');

  /* ── نظام الدفعات ── */
  const [enableInstallments, setEnableInstallments] = useState(true);
  const [installments, setInstallments] = useState<PaymentInstallment[]>(
    [...(isEn ? DEFAULT_INSTALLMENTS_EN : DEFAULT_INSTALLMENTS_AR)]
  );

  /* ── حالة العرض ── */
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    company: true, client: true, items: true, options: false, terms: false, payments: false, responsible: false,
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  /* ── رفع الشعار ── */
  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert(isEn ? 'Logo must be less than 2MB' : 'حجم الشعار يجب أن يكون أقل من 2 ميجابايت');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setCompanyLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, [isEn]);

  const toggleSection = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ── إدارة البنود ── */
  const addItem = () => {
    setItems(prev => [...prev, { id: String(Date.now()), description: '', unit: 'item', quantity: 1, unitPrice: 0 }]);
  };
  const removeItem = (id: string) => {
    if (items.length > 1) setItems(prev => prev.filter((i) => i.id !== id));
  };
  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(prev => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  /* ── إدارة الشروط ── */
  const addTerm = () => {
    if (newTerm.trim()) { setTerms(prev => [...prev, newTerm.trim()]); setNewTerm(''); }
  };
  const removeTerm = (idx: number) => setTerms(prev => prev.filter((_, i) => i !== idx));

  /* ── إدارة الدفعات ── */
  const addInstallment = () => {
    setInstallments(prev => [
      ...prev,
      { id: String(Date.now()), label: isEn ? `Payment ${prev.length + 1}` : `دفعة ${prev.length + 1}`, percentage: 0, description: '' },
    ]);
  };
  const removeInstallment = (id: string) => {
    if (installments.length > 1) setInstallments(prev => prev.filter((i) => i.id !== id));
  };
  const updateInstallment = (id: string, field: keyof PaymentInstallment, value: any) => {
    setInstallments(prev => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const totalInstallmentPct = installments.reduce((s, i) => s + i.percentage, 0);

  /* ── إنشاء العرض ── */
  const handleGenerate = () => {
    const validItems = items.filter((i) => i.description.trim() && i.unitPrice > 0);
    if (validItems.length === 0) {
      alert(isEn ? 'Add at least one item with description and price' : 'أضف بنداً واحداً على الأقل مع وصف وسعر');
      return;
    }
    if (enableInstallments && Math.abs(totalInstallmentPct - 100) > 0.01) {
      alert(isEn ? `Payment percentages must total 100%. Current: ${totalInstallmentPct}%` : `مجموع نسب الدفعات يجب أن يكون 100%. الحالي: ${totalInstallmentPct}%`);
      return;
    }
    const res = calculateQuote({
      clientName: clientName || (isEn ? 'Valued Client' : 'العميل الكريم'),
      providerName: providerName || (isEn ? 'Service Provider' : 'مزود الخدمة'),
      projectName: projectName || (isEn ? 'Untitled Project' : 'مشروع بدون عنوان'),
      items: validItems,
      notes,
      validityDays: Number(validityDays) || 15,
      includeVAT,
    });
    setResult(res);
    setShowPreview(true);
  };

  /* ── نص العرض للنسخ/واتساب ── */
  const getQuoteText = () => {
    if (!result) return '';
    const validItems = items.filter((i) => i.description.trim() && i.unitPrice > 0);
    const itemsText = validItems
      .map((i, idx) =>
        `${idx + 1}. ${i.description} | ${i.quantity} ${COMMON_UNITS.find((u) => u.id === i.unit)?.label || i.unit} × ${i.unitPrice} = ${formatAED(i.quantity * i.unitPrice)}`
      ).join('\n');

    let text = `═══════════════════════
📄 ${isEn ? 'Quotation' : 'عرض سعر'} | ${result.quoteNumber}
═══════════════════════
📅 ${result.date}
🏢 ${providerName || (isEn ? 'Provider' : 'مزود الخدمة')}${companyPhone ? ` | 📞 ${companyPhone}` : ''}${companyEmail ? ` | ✉️ ${companyEmail}` : ''}${companyWebsite ? ` | 🌐 ${companyWebsite}` : ''}
👤 ${isEn ? 'Client' : 'العميل'}: ${clientName || (isEn ? 'Valued Client' : 'العميل الكريم')}${clientPhone ? ` | 📞 ${clientPhone}` : ''}${clientLocation ? ` | 📍 ${clientLocation}` : ''}
📋 ${isEn ? 'Project' : 'المشروع'}: ${projectName || '-'}
───────────────────────
${itemsText}
───────────────────────
${isEn ? 'Subtotal' : 'المجموع'}: ${formatAED(result.subtotal)}${includeVAT ? `\n${isEn ? 'VAT 5%' : 'ضريبة 5%'}: ${formatAED(result.vatAmount)}` : ''}
═══════════════════════
${isEn ? 'Total' : 'الإجمالي'}: ${formatAED(result.total)}
═══════════════════════`;

    if (enableInstallments && installments.length > 0) {
      text += `\n\n💳 ${isEn ? 'Payment Schedule' : 'نظام الدفعات'}:\n`;
      installments.forEach((inst) => {
        text += `• ${inst.label}: ${inst.percentage}% (${formatAED(Math.round(result.total * inst.percentage / 100))}) - ${inst.description}\n`;
      });
    }
    if (terms.length > 0) {
      text += `\n📜 ${isEn ? 'Terms & Conditions' : 'الشروط والأحكام'}:\n`;
      terms.forEach((t, i) => { text += `${i + 1}. ${t}\n`; });
    }
    if (notes) text += `\n${isEn ? 'Notes' : 'ملاحظات'}: ${notes}`;
    text += `\n${isEn ? 'Valid for' : 'صلاحية العرض'}: ${validityDays} ${isEn ? 'days' : 'يوم'}`;
    if (responsibleName) text += `\n👤 ${isEn ? 'Contact' : 'المسؤول'}: ${responsibleName}${responsibleTitle ? ` - ${responsibleTitle}` : ''}`;
    text += `\n───────────────────────\n${isEn ? 'Beit Al Reef | Home Services Platform' : 'بيت الريف | منصة الخدمات المنزلية'}`;
    return text;
  };

  /* ── طباعة PDF ── */
  const handlePrint = () => {
    if (!previewRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>${isEn ? 'Quotation' : 'عرض سعر'} - ${result?.quoteNumber || ''}</title><style>@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Cairo',sans-serif;direction:rtl}@page{size:A4;margin:0}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>${previewRef.current.innerHTML}</body></html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  // Labels
  const L = {
    title: isEn ? 'Quotation Generator' : 'مولّد عروض الأسعار',
    subtitle: isEn ? 'Professional A4 quotation ready to print' : 'عرض سعر احترافي A4 جاهز للطباعة',
    toolId: 'quote',
    companyData: isEn ? 'Company / Provider Info' : 'بيانات الشركة / المزود',
    companyLogo: isEn ? 'Company Logo' : 'شعار الشركة',
    uploadLogo: isEn ? 'Upload' : 'رفع شعار',
    removeLogo: isEn ? 'Remove logo' : 'إزالة الشعار',
    logoHint: isEn ? 'PNG or JPG — max 2MB' : 'PNG أو JPG — حد أقصى 2 ميجابايت',
    companyName: isEn ? 'Company / Provider Name' : 'اسم الشركة / المزود',
    mainPhone: isEn ? 'Main Phone' : 'هاتف رئيسي',
    secPhone: isEn ? 'Secondary Phone' : 'هاتف ثانوي',
    email: isEn ? 'Email' : 'البريد الإلكتروني',
    website: isEn ? 'Website' : 'الموقع الإلكتروني',
    companyAddr: isEn ? 'Company Address' : 'عنوان الشركة',
    clientData: isEn ? 'Client Information' : 'بيانات العميل',
    clientName: isEn ? 'Client Name' : 'اسم العميل',
    clientPhone: isEn ? 'Client Phone' : 'هاتف العميل',
    clientEmail: isEn ? 'Client Email' : 'بريد العميل',
    clientLocation: isEn ? 'Client / Project Location' : 'موقع العميل / عنوان المشروع',
    projectName: isEn ? 'Project Name (optional)' : 'اسم المشروع (اختياري)',
    items: isEn ? 'Quotation Items' : 'بنود عرض السعر',
    itemNum: isEn ? 'Item' : 'بند',
    unit: isEn ? 'Unit' : 'الوحدة',
    qty: isEn ? 'Quantity' : 'الكمية',
    unitPrice: isEn ? 'Unit Price' : 'سعر الوحدة',
    addItem: isEn ? 'Add New Item' : 'إضافة بند جديد',
    subtotalLabel: isEn ? 'Preliminary Subtotal:' : 'المجموع المبدئي:',
    payments: isEn ? 'Payment Schedule' : 'نظام الدفعات',
    enablePayments: isEn ? 'Enable Payment Schedule' : 'تفعيل نظام الدفعات',
    paymentNum: isEn ? 'Payment' : 'دفعة',
    addPayment: isEn ? 'Add Payment' : 'إضافة دفعة',
    pctTotal: isEn ? 'Total Percentages' : 'مجموع النسب',
    pctMust100: isEn ? '(must be 100%)' : '(يجب أن يكون 100%)',
    termsTitle: isEn ? 'Terms & Conditions' : 'الشروط والأحكام',
    addTermPh: isEn ? 'Add a new term...' : 'أضف شرطاً جديداً...',
    addBtn: isEn ? 'Add' : 'إضافة',
    responsible: isEn ? 'Responsible Person' : 'بيانات المسؤول',
    respName: isEn ? 'Contact Name' : 'اسم المسؤول',
    respTitle: isEn ? 'Job Title' : 'المسمى الوظيفي',
    respPhone: isEn ? 'Phone' : 'هاتف المسؤول',
    options: isEn ? 'Additional Options' : 'خيارات إضافية',
    vatToggle: isEn ? 'Add VAT (5%)' : 'إضافة ضريبة القيمة المضافة (5%)',
    validityLabel: isEn ? 'Validity Period (days)' : 'مدة صلاحية العرض (يوم)',
    notesLabel: isEn ? 'Additional Notes' : 'ملاحظات إضافية',
    generateBtn: isEn ? 'Preview & Generate Quotation' : 'معاينة وإنشاء عرض السعر',
    previewTitle: isEn ? 'Quotation Preview — A4' : 'معاينة عرض السعر - نموذج A4',
    copy: isEn ? 'Copy' : 'نسخ',
    whatsapp: isEn ? 'WhatsApp' : 'واتساب',
    printPdf: isEn ? 'Print PDF' : 'طباعة PDF',
    savePdf: isEn ? 'Save PDF' : 'حفظ PDF',
    closePreview: isEn ? 'Close Preview' : 'إغلاق المعاينة',
    optional: isEn ? 'Optional' : 'اختياري',
    termCount: (n: number) => isEn ? `${n} terms` : `${n} شرط`,
    payCount: (n: number) => isEn ? `${n} payments` : `${n} دفعات`,
    descPh: isEn ? 'Item description (e.g. Split AC Installation)' : 'وصف البند (مثال: تركيب مكيف سبليت)',
    // A4 Preview labels
    a4: {
      quotation: isEn ? 'QUOTATION' : 'عرض سعر',
      quotationSub: isEn ? '' : 'QUOTATION',
      quoteNum: isEn ? 'Quote No.' : 'رقم العرض',
      clientInfo: isEn ? 'CLIENT INFO' : 'بيانات العميل',
      projectInfo: isEn ? 'PROJECT INFO' : 'بيانات المشروع',
      validity: isEn ? 'Validity' : 'صلاحية العرض',
      days: isEn ? 'days' : 'يوم',
      desc: isEn ? 'Description' : 'الوصف',
      unitH: isEn ? 'Unit' : 'الوحدة',
      qtyH: isEn ? 'Qty' : 'الكمية',
      priceH: isEn ? 'Price' : 'السعر',
      totalH: isEn ? 'Total' : 'الإجمالي',
      subtotal: isEn ? 'Subtotal' : 'المجموع الفرعي',
      vat: isEn ? 'VAT (5%)' : 'ضريبة القيمة المضافة (5%)',
      grandTotal: isEn ? 'Grand Total' : 'الإجمالي',
      paymentSchedule: isEn ? '💳 Payment Schedule' : '💳 نظام الدفعات',
      paymentLabel: isEn ? 'Payment' : 'الدفعة',
      percentage: isEn ? 'Percentage' : 'النسبة',
      amount: isEn ? 'Amount' : 'المبلغ',
      due: isEn ? 'Due' : 'الموعد',
      notesH: isEn ? '📝 Notes' : '📝 ملاحظات',
      termsH: isEn ? '📜 Terms & Conditions' : '📜 الشروط والأحكام',
      preparedBy: isEn ? 'Prepared By' : 'المسؤول / مُعِدّ العرض',
      clientApproval: isEn ? 'Client Approval' : 'موافقة العميل',
      signStamp: isEn ? 'Signature & Stamp' : 'التوقيع والختم',
      footer: isEn ? 'Generated via Beit Al Reef — app.bietalreef.ae' : 'تم إنشاء هذا العرض عبر منصة بيت الريف — app.bietalreef.ae',
      page: isEn ? 'Page 1 of 1' : 'صفحة 1 من 1',
    },
  };

  return (
    <SimpleToolShell
      title={isEn ? 'Quotation Generator' : 'مولّد عروض الأسعار'}
      subtitle={isEn ? 'Professional A4 quotation ready to print' : 'عرض سعر احترافي A4 جاهز للطباعة'}
      toolId="quote"
      gradientFrom="#1E40AF"
      gradientTo="#3B82F6"
      onBack={onBack}
    >
      {/* ═══════════ 1. بيانات الشركة ══════════ */}
      <CollapsibleSection
        isOpen={!!expandedSections.company}
        onToggle={() => toggleSection('company')}
        title={L.companyData}
        icon={<Building2 className="w-4 h-4 text-blue-500" />}
      >
        {/* رفع الشعار */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-500 mb-2 font-cairo">{L.companyLogo}</label>
          <div className="flex items-center gap-3">
            <button onClick={() => logoInputRef.current?.click()} className="relative w-20 h-20 rounded-2xl border-[4px] border-dashed border-gray-300/60 bg-gray-50 flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50/50 transition-all overflow-hidden group">
              {companyLogo ? (
                <>
                  <img src={companyLogo} alt="" className="w-full h-full object-contain p-1" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                </>
              ) : (
                <><Upload className="w-5 h-5 text-gray-400" /><span className="text-[9px] text-gray-400 font-cairo">{L.uploadLogo}</span></>
              )}
            </button>
            <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            <div className="flex-1 text-xs text-gray-400 font-cairo leading-relaxed">
              {companyLogo ? <button onClick={() => setCompanyLogo(null)} className="text-red-400 text-xs font-cairo underline">{L.removeLogo}</button> : L.logoHint}
            </div>
          </div>
        </div>
        <InputField label={L.companyName} value={providerName} onChange={setProviderName} type="text" placeholder={isEn ? 'e.g. Al Aman Maintenance Co.' : 'مثال: شركة الأمان للصيانة'} />
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Phone className="w-3 h-3 inline ml-1" />{L.mainPhone}</label><input type="tel" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="05X XXX XXXX" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-blue-400 font-cairo" dir="ltr" /></div>
          <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Phone className="w-3 h-3 inline ml-1" />{L.secPhone}</label><input type="tel" value={companyPhone2} onChange={(e) => setCompanyPhone2(e.target.value)} placeholder={L.optional} className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-blue-400 font-cairo" dir="ltr" /></div>
        </div>
        <div className="mt-3"><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Mail className="w-3 h-3 inline ml-1" />{L.email}</label><input type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="info@company.ae" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-blue-400 font-cairo" dir="ltr" /></div>
        <div className="mt-3"><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Globe className="w-3 h-3 inline ml-1" />{L.website}</label><input type="url" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} placeholder="www.company.ae" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-blue-400 font-cairo" dir="ltr" /></div>
        <div className="mt-3"><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><MapPin className="w-3 h-3 inline ml-1" />{L.companyAddr}</label><input type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder={isEn ? 'e.g. Dubai - Al Qusais - Baghdad St.' : 'مثال: دبي - القصيص - شارع بغداد'} className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-blue-400 font-cairo" /></div>
      </CollapsibleSection>

      {/* ═══════════ 2. بيانات العميل ═══════════ */}
      <CollapsibleSection isOpen={!!expandedSections.client} onToggle={() => toggleSection('client')} title={L.clientData} icon={<User className="w-4 h-4 text-green-500" />}>
        <InputField label={L.clientName} value={clientName} onChange={setClientName} type="text" placeholder={isEn ? 'e.g. Ahmed Mohammed' : 'مثال: أحمد محمد'} />
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Phone className="w-3 h-3 inline ml-1" />{L.clientPhone}</label><input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="05X XXX XXXX" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-blue-400 font-cairo" dir="ltr" /></div>
          <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Mail className="w-3 h-3 inline ml-1" />{L.clientEmail}</label><input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="client@email.com" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-blue-400 font-cairo" dir="ltr" /></div>
        </div>
        <div className="mt-3"><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><MapPin className="w-3 h-3 inline ml-1" />{L.clientLocation}</label><input type="text" value={clientLocation} onChange={(e) => setClientLocation(e.target.value)} placeholder={isEn ? 'e.g. Abu Dhabi - Corniche St. - Bldg 42' : 'مثال: أبوظبي - شارع الكورنيش - بناية 42'} className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-blue-400 font-cairo" /></div>
        <div className="mt-3"><InputField label={L.projectName} value={projectName} onChange={setProjectName} type="text" placeholder={isEn ? 'e.g. Al Nakheel Villa Maintenance' : 'مثال: صيانة فيلا النخيل'} /></div>
      </CollapsibleSection>

      {/* ═══════════ 3. بنود العرض ═══════════ */}
      <InputCard title={L.items}>
        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50/80 rounded-xl p-4 relative border-[4px] border-gray-100/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 font-cairo">{L.itemNum} #{index + 1}</span>
                {items.length > 1 && (<button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>)}
              </div>
              <input type="text" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} placeholder={L.descPh} className="w-full p-3 bg-white rounded-lg border-[4px] border-gray-200/60 text-sm outline-none focus:border-blue-400 mb-2 font-cairo" />
              <div className="grid grid-cols-3 gap-2">
                <div><label className="text-[10px] text-gray-400 font-cairo block mb-1">{L.unit}</label><select value={item.unit} onChange={(e) => updateItem(item.id, 'unit', e.target.value)} className="w-full p-2.5 bg-white rounded-lg border-[4px] border-gray-200/60 text-xs font-cairo outline-none">{COMMON_UNITS.map((u) => (<option key={u.id} value={u.id}>{u.label}</option>))}</select></div>
                <div><label className="text-[10px] text-gray-400 font-cairo block mb-1">{L.qty}</label><input type="number" value={item.quantity || ''} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value) || 0)} className="w-full p-2.5 bg-white rounded-lg border-[4px] border-gray-200/60 text-xs font-cairo outline-none text-center" min={1} /></div>
                <div><label className="text-[10px] text-gray-400 font-cairo block mb-1">{L.unitPrice}</label><input type="number" value={item.unitPrice || ''} onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value) || 0)} className="w-full p-2.5 bg-white rounded-lg border-[4px] border-gray-200/60 text-xs font-cairo outline-none text-center" min={0} /></div>
              </div>
              {item.quantity > 0 && item.unitPrice > 0 && (<div className="mt-2 text-left"><span className="text-xs font-bold text-blue-600 font-cairo bg-blue-50 px-2 py-1 rounded-lg">= {formatAED(item.quantity * item.unitPrice)}</span></div>)}
            </motion.div>
          ))}
        </div>
        <button onClick={addItem} className="w-full mt-3 py-3 border-[4px] border-dashed border-blue-300 rounded-xl text-blue-500 font-bold font-cairo text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"><Plus className="w-4 h-4" />{L.addItem}</button>
        {items.some((i) => i.unitPrice > 0) && (<div className="mt-4 bg-blue-50 rounded-xl p-3 flex items-center justify-between"><span className="text-sm font-cairo text-gray-600">{L.subtotalLabel}</span><span className="text-lg font-bold font-cairo text-blue-700">{formatAED(items.reduce((s, i) => s + i.quantity * i.unitPrice, 0))}</span></div>)}
      </InputCard>

      {/* ═══════════ 4. نظام الدفعات ═══════════ */}
      <CollapsibleSection isOpen={!!expandedSections.payments} onToggle={() => toggleSection('payments')} title={L.payments} icon={<CreditCard className="w-4 h-4 text-purple-500" />} badge={enableInstallments ? L.payCount(installments.length) : undefined}>
        <button onClick={() => setEnableInstallments(!enableInstallments)} className={`w-full flex items-center justify-between p-3.5 rounded-xl border-[4px] transition-all mb-4 ${enableInstallments ? 'border-purple-400 bg-purple-50' : 'border-gray-200/60 bg-white'}`}>
          <span className="font-cairo font-bold text-sm text-gray-700">{L.enablePayments}</span>
          <div className={`w-12 h-7 rounded-full relative transition-colors ${enableInstallments ? 'bg-purple-500' : 'bg-gray-300'}`}><div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${enableInstallments ? 'right-0.5' : 'left-0.5'}`} /></div>
        </button>
        {enableInstallments && (<>
          <div className="space-y-3">
            {installments.map((inst, idx) => (
              <motion.div key={inst.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-purple-50/50 rounded-xl p-3 border-[4px] border-purple-100/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-600 font-cairo">{L.paymentNum} #{idx + 1}</span>
                  {installments.length > 1 && (<button onClick={() => removeInstallment(inst.id)} className="w-6 h-6 rounded-full bg-red-50 text-red-400 flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>)}
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <input type="text" value={inst.label} onChange={(e) => updateInstallment(inst.id, 'label', e.target.value)} placeholder={isEn ? 'Payment name' : 'اسم الدفعة'} className="col-span-5 p-2 bg-white rounded-lg border-[4px] border-gray-200/60 text-xs font-cairo outline-none" />
                  <div className="col-span-3 relative"><input type="number" value={inst.percentage || ''} onChange={(e) => updateInstallment(inst.id, 'percentage', Number(e.target.value) || 0)} className="w-full p-2 bg-white rounded-lg border-[4px] border-gray-200/60 text-xs font-cairo outline-none text-center" min={0} max={100} /><span className="absolute left-2 top-2 text-[10px] text-gray-400">%</span></div>
                  <input type="text" value={inst.description} onChange={(e) => updateInstallment(inst.id, 'description', e.target.value)} placeholder={isEn ? 'When...' : 'عند...'} className="col-span-4 p-2 bg-white rounded-lg border-[4px] border-gray-200/60 text-xs font-cairo outline-none" />
                </div>
              </motion.div>
            ))}
          </div>
          <button onClick={addInstallment} className="w-full mt-3 py-2.5 border-[4px] border-dashed border-purple-300 rounded-xl text-purple-500 font-bold font-cairo text-xs flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors"><Plus className="w-3.5 h-3.5" />{L.addPayment}</button>
          <div className={`mt-3 text-center text-xs font-bold font-cairo py-2 rounded-lg ${Math.abs(totalInstallmentPct - 100) < 0.01 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{L.pctTotal}: {totalInstallmentPct}% {Math.abs(totalInstallmentPct - 100) >= 0.01 && L.pctMust100}</div>
        </>)}
      </CollapsibleSection>

      {/* ═══════════ 5. الشروط والأحكام ═══════════ */}
      <CollapsibleSection isOpen={!!expandedSections.terms} onToggle={() => toggleSection('terms')} title={L.termsTitle} icon={<Shield className="w-4 h-4 text-amber-500" />} badge={L.termCount(terms.length)}>
        <div className="space-y-2 mb-3">
          {terms.map((term, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-amber-50/50 rounded-lg p-2.5 border-[4px] border-amber-100/60">
              <span className="text-[10px] font-bold text-amber-600 font-cairo mt-0.5 shrink-0">{idx + 1}.</span>
              <p className="text-xs text-gray-700 font-cairo flex-1 leading-relaxed">{term}</p>
              <button onClick={() => removeTerm(idx)} className="w-5 h-5 rounded-full bg-red-50 text-red-400 flex items-center justify-center shrink-0 mt-0.5"><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newTerm} onChange={(e) => setNewTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTerm()} placeholder={L.addTermPh} className="flex-1 p-2.5 bg-gray-50 rounded-xl border-[4px] border-gray-200/60 text-xs outline-none focus:border-amber-400 font-cairo" />
          <button onClick={addTerm} className="px-4 bg-amber-500 text-white rounded-xl text-xs font-bold font-cairo hover:bg-amber-600 transition-colors">{L.addBtn}</button>
        </div>
      </CollapsibleSection>

      {/* ═══════════ 6. بيانات المسؤول ═══════════ */}
      <CollapsibleSection isOpen={!!expandedSections.responsible} onToggle={() => toggleSection('responsible')} title={L.responsible} icon={<User className="w-4 h-4 text-teal-500" />}>
        <InputField label={L.respName} value={responsibleName} onChange={setResponsibleName} type="text" placeholder={isEn ? 'e.g. Eng. Khalid Al Ali' : 'مثال: م. خالد العلي'} />
        <InputField label={L.respTitle} value={responsibleTitle} onChange={setResponsibleTitle} type="text" placeholder={isEn ? 'e.g. Project Manager' : 'مثال: مدير المشاريع'} />
        <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Phone className="w-3 h-3 inline ml-1" />{L.respPhone}</label><input type="tel" value={responsiblePhone} onChange={(e) => setResponsiblePhone(e.target.value)} placeholder="05X XXX XXXX" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-blue-400 font-cairo" dir="ltr" /></div>
      </CollapsibleSection>

      {/* ═══════════ 7. خيارات إضافية ═══════════ */}
      <CollapsibleSection isOpen={!!expandedSections.options} onToggle={() => toggleSection('options')} title={L.options} icon={<FileText className="w-4 h-4 text-gray-500" />}>
        <button onClick={() => setIncludeVAT(!includeVAT)} className={`w-full flex items-center justify-between p-3.5 rounded-xl border-[4px] transition-all mb-3 ${includeVAT ? 'border-blue-400 bg-blue-50' : 'border-gray-200/60 bg-white'}`}>
          <span className="font-cairo font-bold text-sm text-gray-700">{L.vatToggle}</span>
          <div className={`w-12 h-7 rounded-full relative transition-colors ${includeVAT ? 'bg-blue-500' : 'bg-gray-300'}`}><div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${includeVAT ? 'right-0.5' : 'left-0.5'}`} /></div>
        </button>
        <InputField label={L.validityLabel} value={validityDays} onChange={setValidityDays} type="number" placeholder="15" />
        <div><label className="text-sm font-bold text-gray-500 font-cairo block mb-1.5">{L.notesLabel}</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={isEn ? 'Additional notes (optional)...' : 'ملاحظات إضافية (اختياري)...'} className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-blue-400 font-cairo h-20 resize-none" /></div>
      </CollapsibleSection>

      {/* ═══════════ زر الإنشاء ═══════════ */}
      <div className="mb-4"><ActionButton onClick={handleGenerate} text={L.generateBtn} icon="📄" /></div>

      {/* ═══════════ معاينة A4 PDF ═══════════ */}
      <AnimatePresence>
        {showPreview && result && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto py-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: 'spring', damping: 25 }} className="bg-gray-100 w-full max-w-[650px] mx-2 rounded-2xl overflow-hidden shadow-2xl">
              {/* Toolbar */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex items-center justify-between z-20">
                <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-blue-500" /><h3 className="font-bold text-sm font-cairo text-[#1A1A1A]">{L.previewTitle}</h3></div>
                <div className="flex items-center gap-2">
                  <button onClick={handlePrint} className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors" title={L.printPdf}><Printer className="w-4 h-4 text-blue-600" /></button>
                  <button onClick={() => setShowPreview(false)} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"><X className="w-4 h-4 text-gray-500" /></button>
                </div>
              </div>
              {/* A4 Page */}
              <div className="p-3">
                <div ref={previewRef} style={{ width: '100%', maxWidth: '595px', minHeight: '842px', margin: '0 auto', background: '#fff', fontFamily: 'Cairo, sans-serif', direction: 'rtl', fontSize: '11px', lineHeight: '1.6', color: '#1A1A1A', position: 'relative', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', borderRadius: '4px', overflow: 'hidden' }}>
                  {/* Header */}
                  <div style={{ background: 'linear-gradient(135deg, #1E3A5F, #2563EB)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {companyLogo && (<div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '4px' }}><img src={companyLogo} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /></div>)}
                      <div>
                        <div style={{ color: '#fff', fontWeight: 800, fontSize: '16px' }}>{providerName || (isEn ? 'Company Name' : 'اسم الشركة')}</div>
                        {companyAddress && <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '9px', marginTop: '2px' }}>📍 {companyAddress}</div>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'left', color: 'rgba(255,255,255,0.9)', fontSize: '9px', lineHeight: '1.8' }}>
                      {companyPhone && <div>📞 {companyPhone}{companyPhone2 ? ` | ${companyPhone2}` : ''}</div>}
                      {companyEmail && <div>✉️ {companyEmail}</div>}
                      {companyWebsite && <div>🌐 {companyWebsite}</div>}
                    </div>
                  </div>
                  {/* Title Bar */}
                  <div style={{ background: '#F1F5F9', borderBottom: '2px solid #E2E8F0', padding: '12px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><div style={{ fontWeight: 800, fontSize: '18px', color: '#1E3A5F' }}>{L.a4.quotation}</div>{L.a4.quotationSub && <div style={{ fontSize: '10px', color: '#64748B' }}>{L.a4.quotationSub}</div>}</div>
                    <div style={{ textAlign: 'left' }}><div style={{ fontSize: '10px', color: '#64748B' }}>{L.a4.quoteNum}</div><div style={{ fontWeight: 700, fontSize: '13px', color: '#1E3A5F' }}>{result.quoteNumber}</div><div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>📅 {result.date}</div></div>
                  </div>
                  {/* Client & Project */}
                  <div style={{ padding: '16px 28px 0' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ flex: 1, background: '#F8FAFC', borderRadius: '8px', padding: '12px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 700, marginBottom: '6px' }}>{L.a4.clientInfo}</div>
                        <div style={{ fontWeight: 700, fontSize: '12px', marginBottom: '3px' }}>{clientName || (isEn ? 'Valued Client' : 'العميل الكريم')}</div>
                        {clientPhone && <div style={{ fontSize: '10px', color: '#64748B' }}>📞 {clientPhone}</div>}
                        {clientEmail && <div style={{ fontSize: '10px', color: '#64748B' }}>✉️ {clientEmail}</div>}
                        {clientLocation && <div style={{ fontSize: '10px', color: '#64748B' }}>📍 {clientLocation}</div>}
                      </div>
                      <div style={{ flex: 1, background: '#F8FAFC', borderRadius: '8px', padding: '12px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 700, marginBottom: '6px' }}>{L.a4.projectInfo}</div>
                        <div style={{ fontWeight: 700, fontSize: '12px', marginBottom: '3px' }}>{projectName || '—'}</div>
                        <div style={{ fontSize: '10px', color: '#64748B' }}>{L.a4.validity}: {validityDays} {L.a4.days}</div>
                      </div>
                    </div>
                  </div>
                  {/* Items Table */}
                  <div style={{ padding: '16px 28px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                      <thead><tr style={{ background: '#1E3A5F', color: '#fff' }}>
                        <th style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, borderRadius: '6px 0 0 0', width: '6%' }}>#</th>
                        <th style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 700, width: '38%' }}>{L.a4.desc}</th>
                        <th style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, width: '12%' }}>{L.a4.unitH}</th>
                        <th style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, width: '12%' }}>{L.a4.qtyH}</th>
                        <th style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, width: '16%' }}>{L.a4.priceH}</th>
                        <th style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, borderRadius: '0 6px 0 0', width: '16%' }}>{L.a4.totalH}</th>
                      </tr></thead>
                      <tbody>{items.filter(i => i.description.trim() && i.unitPrice > 0).map((item, idx) => (
                        <tr key={item.id} style={{ background: idx % 2 === 0 ? '#fff' : '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          <td style={{ padding: '8px 6px', textAlign: 'center', color: '#94A3B8', fontWeight: 700 }}>{idx + 1}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 600 }}>{item.description}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'center', color: '#64748B' }}>{COMMON_UNITS.find(u => u.id === item.unit)?.label || item.unit}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'center' }}>{item.quantity}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'center' }}>{item.unitPrice.toLocaleString()}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, color: '#1E3A5F' }}>{(item.quantity * item.unitPrice).toLocaleString()}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                  {/* Totals */}
                  <div style={{ padding: '0 28px 12px', display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '220px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', fontSize: '11px', borderBottom: '1px solid #E2E8F0' }}><span style={{ color: '#64748B' }}>{L.a4.subtotal}</span><span style={{ fontWeight: 700 }}>{formatAED(result.subtotal)}</span></div>
                      {includeVAT && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', fontSize: '11px', borderBottom: '1px solid #E2E8F0' }}><span style={{ color: '#64748B' }}>{L.a4.vat}</span><span style={{ fontWeight: 700 }}>{formatAED(result.vatAmount)}</span></div>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', fontSize: '14px', background: '#1E3A5F', color: '#fff', borderRadius: '0 0 8px 8px', fontWeight: 800 }}><span>{L.a4.grandTotal}</span><span>{formatAED(result.total)}</span></div>
                    </div>
                  </div>
                  {/* Payment Schedule */}
                  {enableInstallments && installments.length > 0 && (
                    <div style={{ padding: '0 28px 12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#1E3A5F', marginBottom: '8px', paddingBottom: '4px', borderBottom: '2px solid #E2E8F0' }}>{L.a4.paymentSchedule}</div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                        <thead><tr style={{ background: '#F1F5F9' }}><th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#475569' }}>{L.a4.paymentLabel}</th><th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>{L.a4.percentage}</th><th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>{L.a4.amount}</th><th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#475569' }}>{L.a4.due}</th></tr></thead>
                        <tbody>{installments.map(inst => (<tr key={inst.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '6px 8px', fontWeight: 600 }}>{inst.label}</td><td style={{ padding: '6px 8px', textAlign: 'center', color: '#7C3AED', fontWeight: 700 }}>{inst.percentage}%</td><td style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 700 }}>{formatAED(Math.round(result.total * inst.percentage / 100))}</td><td style={{ padding: '6px 8px', color: '#64748B' }}>{inst.description}</td></tr>))}</tbody>
                      </table>
                    </div>
                  )}
                  {/* Notes */}
                  {notes && (<div style={{ padding: '0 28px 12px' }}><div style={{ background: '#FEF9C3', borderRadius: '8px', padding: '10px 14px', border: '1px solid #FDE68A' }}><div style={{ fontSize: '9px', fontWeight: 700, color: '#92400E', marginBottom: '4px' }}>{L.a4.notesH}</div><div style={{ fontSize: '10px', color: '#78350F', lineHeight: '1.7' }}>{notes}</div></div></div>)}
                  {/* Terms */}
                  {terms.length > 0 && (<div style={{ padding: '0 28px 12px' }}><div style={{ fontSize: '11px', fontWeight: 800, color: '#1E3A5F', marginBottom: '8px', paddingBottom: '4px', borderBottom: '2px solid #E2E8F0' }}>{L.a4.termsH}</div><div style={{ fontSize: '9px', color: '#475569', lineHeight: '1.9' }}>{terms.map((term, idx) => (<div key={idx} style={{ display: 'flex', gap: '6px', marginBottom: '2px' }}><span style={{ color: '#1E3A5F', fontWeight: 700, minWidth: '14px' }}>{idx + 1}.</span><span>{term}</span></div>))}</div></div>)}
                  {/* Signatures */}
                  {(responsibleName || responsibleTitle) && (<div style={{ padding: '0 28px 12px' }}><div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}><div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '4px' }}>{L.a4.preparedBy}</div><div style={{ fontWeight: 700, fontSize: '11px' }}>{responsibleName}</div>{responsibleTitle && <div style={{ fontSize: '9px', color: '#64748B' }}>{responsibleTitle}</div>}{responsiblePhone && <div style={{ fontSize: '9px', color: '#64748B' }}>📞 {responsiblePhone}</div>}<div style={{ borderTop: '1px dashed #CBD5E1', marginTop: '20px', paddingTop: '4px', fontSize: '8px', color: '#94A3B8' }}>{L.a4.signStamp}</div></div><div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '4px' }}>{L.a4.clientApproval}</div><div style={{ fontWeight: 700, fontSize: '11px' }}>{clientName || (isEn ? 'Valued Client' : 'العميل الكريم')}</div><div style={{ borderTop: '1px dashed #CBD5E1', marginTop: '36px', paddingTop: '4px', fontSize: '8px', color: '#94A3B8' }}>{L.a4.signStamp}</div></div></div></div>)}
                  {/* Footer */}
                  <div style={{ background: '#1E3A5F', padding: '12px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}><div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px' }}>{L.a4.footer}</div><div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px' }}>{L.a4.page}</div></div>
                </div>
              </div>
              {/* Actions */}
              <div className="p-4 bg-white border-t border-gray-200 space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => { navigator.clipboard?.writeText(getQuoteText()).then(() => alert(isEn ? 'Quotation copied!' : 'تم نسخ عرض السعر')); }} className="flex flex-col items-center gap-1 py-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"><Copy className="w-4 h-4 text-blue-600" /><span className="text-[10px] font-bold font-cairo text-blue-700">{L.copy}</span></button>
                  <button onClick={() => { window.open(`https://wa.me/?text=${encodeURIComponent(getQuoteText())}`, '_blank'); }} className="flex flex-col items-center gap-1 py-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"><Share2 className="w-4 h-4 text-green-600" /><span className="text-[10px] font-bold font-cairo text-green-700">{L.whatsapp}</span></button>
                  <button onClick={() => { if (previewRef.current) downloadPdfFromElement(previewRef.current, `${isEn ? 'Quote' : 'عرض-سعر'}-${result?.quoteNumber || ''}`); }} className="flex flex-col items-center gap-1 py-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"><Download className="w-4 h-4 text-red-600" /><span className="text-[10px] font-bold font-cairo text-red-700">{L.savePdf}</span></button>
                  <button onClick={handlePrint} className="flex flex-col items-center gap-1 py-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"><Printer className="w-4 h-4 text-purple-600" /><span className="text-[10px] font-bold font-cairo text-purple-700">{L.printPdf}</span></button>
                </div>
                <button onClick={() => setShowPreview(false)} className="w-full py-3 bg-gray-100 rounded-xl text-sm font-bold font-cairo text-gray-600 hover:bg-gray-200 transition-colors">{L.closePreview}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SimpleToolShell>
  );
}