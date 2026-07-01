/**
 * ReviewSubmitStep.tsx — المراجعة والإرسال
 * ═══════════════════════════════════════════
 * ملخص كامل لكل البيانات + زر إرسال
 * بعد الإرسال → إشعار "24-48 ساعة"
 * للمزود → إنشاء NOC تلقائي
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Icon3D } from '../ui/Icon3D';
import {
  CheckCircle, User, MapPin, Shield, Briefcase,
  Building2, FileText, Send, Download, Clock,
  Loader2, Bell, Star,
} from 'lucide-react';
import { UAE_EMIRATES, EXPERIENCE_OPTIONS, GENERAL_SPECIALIZATIONS, SPECIALIZATIONS } from './EmiratesData';

const fontCairo = 'Cairo, Tajawal, sans-serif';

interface ReviewData {
  role: 'client' | 'provider';
  provider_type?: 'company' | 'craftsman';
  full_name: string;
  phone: string;
  whatsapp: string;
  bio: string;
  emirate: string;
  city: string;
  district: string;
  verification_method: 'none' | 'uae_pass' | 'id_upload';
  uae_pass_verified: boolean;
  // Provider
  specialties?: string[];
  business_name?: string;
  years_experience?: number;
  service_emirates?: string[];
  residence?: string;
  sponsor_company?: string;
  previous_works_count?: number;
  social_links_count?: number;
  // Company
  trade_license_uploaded?: boolean;
  num_workers?: number;
  general_specialization?: string;
  specific_specialization?: string;
  classification_cert_uploaded?: boolean;
  // Plan
  subscription_plan?: string;
}

interface ReviewSubmitStepProps {
  data: ReviewData;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  isEn: boolean;
  isDark: boolean;
}

export function ReviewSubmitStep({ data, onSubmit, isSubmitting, isEn, isDark }: ReviewSubmitStepProps) {
  const [submitted, setSubmitted] = useState(false);

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/50' : 'text-[#1F3D2B]/50';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const cardClass = isDark
    ? 'bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl'
    : 'bg-white border-[4px] border-gray-200/60 rounded-2xl';

  // Helper to get label from ID
  const getEmirateName = (id: string) => {
    const e = UAE_EMIRATES.find(em => em.id === id);
    return isEn ? e?.nameEn : e?.nameAr;
  };

  const getCityName = (emirateId: string, cityId: string) => {
    const e = UAE_EMIRATES.find(em => em.id === emirateId);
    const c = e?.cities.find(ci => ci.id === cityId);
    return isEn ? c?.nameEn : c?.nameAr;
  };

  const getDistrictName = (emirateId: string, cityId: string, distId: string) => {
    const e = UAE_EMIRATES.find(em => em.id === emirateId);
    const c = e?.cities.find(ci => ci.id === cityId);
    const d = c?.districts.find(di => di.id === distId);
    return isEn ? d?.nameEn : d?.nameAr;
  };

  const getExperienceLabel = (val: number) => {
    const opt = EXPERIENCE_OPTIONS.find(o => o.value === val);
    return isEn ? opt?.en : opt?.ar;
  };

  const getGenSpecLabel = (id: string) => {
    const s = GENERAL_SPECIALIZATIONS.find(g => g.id === id);
    return isEn ? s?.en : s?.ar;
  };

  const getSpecLabel = (id: string) => {
    const s = SPECIALIZATIONS.find(sp => sp.id === id);
    return isEn ? s?.en : s?.ar;
  };

  // Build review sections
  const sections: { title: string; icon: any; theme: string; items: { label: string; value: string }[] }[] = [
    {
      title: isEn ? 'Personal Information' : 'البيانات الشخصية',
      icon: User,
      theme: 'blue',
      items: [
        { label: isEn ? 'Name' : 'الاسم', value: data.full_name },
        { label: isEn ? 'Phone' : 'الهاتف', value: data.phone },
        { label: isEn ? 'WhatsApp' : 'واتساب', value: data.whatsapp },
        ...(data.bio ? [{ label: isEn ? 'Bio' : 'النبذة', value: data.bio.substring(0, 60) + (data.bio.length > 60 ? '...' : '') }] : []),
      ],
    },
    {
      title: isEn ? 'Location' : 'الموقع',
      icon: MapPin,
      theme: 'blue',
      items: [
        { label: isEn ? 'Emirate' : 'الإمارة', value: getEmirateName(data.emirate) || '-' },
        { label: isEn ? 'City' : 'المدينة', value: getCityName(data.emirate, data.city) || '-' },
        ...(data.district ? [{ label: isEn ? 'District' : 'المنطقة', value: getDistrictName(data.emirate, data.city, data.district) || '-' }] : []),
      ],
    },
    {
      title: isEn ? 'Identity Verification' : 'التوثيق',
      icon: Shield,
      theme: 'gold',
      items: [
        {
          label: isEn ? 'Method' : 'الطريقة',
          value: data.verification_method === 'uae_pass'
            ? (isEn ? 'UAE Pass (Verified)' : 'UAE Pass (تم التوثيق)')
            : data.verification_method === 'id_upload'
              ? (isEn ? 'Emirates ID (Under Review)' : 'الهوية الإماراتية (قيد المراجعة)')
              : (isEn ? 'Skipped — will verify later' : 'تم التخطي — سيتم التوثيق لاحقاً'),
        },
      ],
    },
  ];

  // Provider sections
  if (data.role === 'provider') {
    sections.push({
      title: isEn ? 'Professional Information' : 'المعلومات المهنية',
      icon: Briefcase,
      theme: 'gold',
      items: [
        { label: isEn ? 'Type' : 'النوع', value: data.provider_type === 'company' ? (isEn ? 'Licensed Company' : 'شركة برخصة') : (isEn ? 'Craftsman' : 'حرفي') },
        ...(data.business_name ? [{ label: isEn ? 'Business Name' : 'اسم النشاط', value: data.business_name }] : []),
        ...(data.years_experience ? [{ label: isEn ? 'Experience' : 'الخبرة', value: getExperienceLabel(data.years_experience) || '-' }] : []),
        ...(data.service_emirates?.length ? [{
          label: isEn ? 'Service Areas' : 'مناطق الخدمة',
          value: data.service_emirates.map(e => getEmirateName(e)).filter(Boolean).join('، '),
        }] : []),
        ...(data.sponsor_company ? [{ label: isEn ? 'Sponsor/Company' : 'الكفيل/الشركة', value: data.sponsor_company }] : []),
        ...(data.previous_works_count ? [{
          label: isEn ? 'Previous Projects' : 'أعمال سابقة',
          value: `${data.previous_works_count} ${isEn ? 'projects' : 'مشاريع'}`,
        }] : []),
      ],
    });

    // Company-specific
    if (data.provider_type === 'company') {
      sections.push({
        title: isEn ? 'Company Documents' : 'وثائق الشركة',
        icon: Building2,
        theme: 'blue',
        items: [
          { label: isEn ? 'Trade License' : 'الرخصة التجارية', value: data.trade_license_uploaded ? (isEn ? 'Uploaded' : 'تم الرفع') : (isEn ? 'Not uploaded' : 'لم يتم الرفع') },
          ...(data.num_workers ? [{ label: isEn ? 'Workers' : 'العمال', value: `${data.num_workers}` }] : []),
          ...(data.general_specialization ? [{ label: isEn ? 'General Spec.' : 'التخصص العام', value: getGenSpecLabel(data.general_specialization) || '-' }] : []),
          ...(data.specific_specialization ? [{ label: isEn ? 'Specific Spec.' : 'التخصص الخاص', value: getSpecLabel(data.specific_specialization) || '-' }] : []),
          { label: isEn ? 'Classification' : 'شهادة التصنيف', value: data.classification_cert_uploaded ? (isEn ? 'Uploaded' : 'تم الرفع') : (isEn ? 'Not uploaded' : 'لم يتم الرفع') },
        ],
      });
    }
  }

  // Plan section
  const planLabels: Record<string, { ar: string; en: string }> = {
    free_trial: { ar: 'تجربة مجانية — 15 يوم', en: 'Free Trial — 15 days' },
    basic: { ar: 'أساسية — 99 د.إ/شهر', en: 'Basic — 99 AED/mo' },
    pro: { ar: 'احترافية — 299 د.إ/شهر', en: 'Professional — 299 AED/mo' },
    enterprise: { ar: 'مؤسسات', en: 'Enterprise' },
  };

  if (data.subscription_plan) {
    const planLabel = planLabels[data.subscription_plan];
    sections.push({
      title: isEn ? 'Subscription' : 'الباقة',
      icon: Star,
      theme: 'gold',
      items: [
        { label: isEn ? 'Plan' : 'الباقة', value: planLabel ? (isEn ? planLabel.en : planLabel.ar) : data.subscription_plan },
      ],
    });
  }

  const handleSubmit = async () => {
    await onSubmit();
    setSubmitted(true);
  };

  return (
    <div className="px-5 py-6">
      {/* Title */}
      <div className="text-center mb-6">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto mb-3">
          <Icon3D icon={CheckCircle} theme="gold" size="xl" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xl font-black mb-1 ${textClass}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'Review & Submit' : 'المراجعة والإرسال'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-sm ${mutedClass}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'Make sure your information is correct' : 'تأكد من صحة بياناتك'}
        </motion.p>
      </div>

      {/* Review Sections */}
      <div className="space-y-3">
        {sections.map((section, sIdx) => (
          <motion.div
            key={sIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + sIdx * 0.06 }}
            className={cardClass}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon3D icon={section.icon} theme={section.theme} size="xs" hoverable={false} />
                <h3 className={`text-sm font-bold ${textClass}`} style={{ fontFamily: fontCairo }}>
                  {section.title}
                </h3>
              </div>
              <div className="space-y-2">
                {section.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex items-start justify-between">
                    <span className={`text-xs ${mutedClass}`} style={{ fontFamily: fontCairo }}>
                      {item.label}
                    </span>
                    <span className={`text-xs font-bold text-left max-w-[60%] ${textClass}`} style={{ fontFamily: fontCairo }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* NOC Notice (for providers) */}
      {data.role === 'provider' && data.sponsor_company && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`mt-4 p-4 rounded-2xl border-[4px] border-dashed ${
            isDark ? 'border-[#D4AF37]/30 bg-[#D4AF37]/5' : 'border-[#D4AF37]/30 bg-[#D4AF37]/5'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Download className={`w-4 h-4 ${goldClass}`} />
            <span className={`text-xs font-bold ${goldClass}`} style={{ fontFamily: fontCairo }}>
              {isEn ? 'No Objection Certificate (NOC)' : 'شهادة عدم الممانعة (NOC)'}
            </span>
          </div>
          <p className={`text-[11px] ${mutedClass}`} style={{ fontFamily: fontCairo }}>
            {isEn
              ? `After submission, a NOC template will be generated with "${data.sponsor_company}". Download it, get it signed and stamped, then upload it back.`
              : `بعد الإرسال، سيتم إنشاء شهادة عدم ممانعة باسم "${data.sponsor_company}". حمّلها، وقّعها واختمها من الشركة، ثم ارفعها مرة أخرى.`}
          </p>
        </motion.div>
      )}

      {/* Review Time Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className={`mt-4 flex items-center gap-3 px-4 py-3 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-[#3B5BFE]/5'}`}
      >
        <div className="w-10 h-10 rounded-xl bg-[#3B5BFE]/15 flex items-center justify-center flex-shrink-0">
          <Clock className="w-5 h-5 text-[#3B5BFE]" />
        </div>
        <div>
          <p className={`text-xs font-bold ${textClass}`} style={{ fontFamily: fontCairo }}>
            {isEn ? 'Review takes 24-48 hours' : 'المراجعة تستغرق من 24 إلى 48 ساعة'}
          </p>
          <p className={`text-[10px] ${mutedClass}`} style={{ fontFamily: fontCairo }}>
            {isEn
              ? 'You will receive a notification when your account is approved'
              : 'ستصلك إشعار عند الموافقة على حسابك'}
          </p>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full mt-6 py-4 rounded-2xl text-white font-bold text-base transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        style={{
          background: 'linear-gradient(135deg, #3B5BFE, #2845C7)',
          fontFamily: fontCairo,
        }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {isEn ? 'Submitting...' : 'جاري الإرسال...'}
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            {isEn ? 'Submit for Review' : 'إرسال للمراجعة'}
          </>
        )}
      </motion.button>
    </div>
  );
}
