/**
 * OnboardingFlow.tsx — بيت الريف
 * ═══════════════════════════════
 * تجربة إعداد الحساب الكاملة:
 * 
 * 🔵 مسار العميل (4 خطوات):
 *    RoleSelection → BasicInfo → Location → Identity → PlanSelection → ReviewSubmit
 * 
 * 🟡 مسار المزود/حرفي (6 خطوات):
 *    RoleSelection → BasicInfo → Location → Identity → ProviderType → Professional → PlanSelection → ReviewSubmit
 * 
 * 🟣 مسار المزود/شركة (7 خطوات):
 *    RoleSelection → BasicInfo → Location → Identity → ProviderType → Professional → Company → PlanSelection → ReviewSubmit
 * 
 * بدون أخضر — ذهبي + أزرق ملكي فقط
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router@7.1.1';
import { useUser } from '../../utils/UserContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

// Steps
import { RoleSelection } from './RoleSelection';
import { BasicInfoStep } from './BasicInfoStep';
import { LocationStep } from './LocationStep';
import { IdentityStep } from './IdentityStep';
import { ProviderTypeStep } from './ProviderTypeStep';
import { ProfessionalStep, type PreviousProject } from './ProfessionalStep';
import { CompanyStep } from './CompanyStep';
import { PlanSelection } from './PlanSelection';
import { ReviewSubmitStep } from './ReviewSubmitStep';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;
const fontCairo = 'Cairo, Tajawal, sans-serif';

// ─── Step IDs ───
type StepId =
  | 'role'
  | 'basic_info'
  | 'location'
  | 'identity'
  | 'provider_type'
  | 'professional'
  | 'company'
  | 'plan'
  | 'review';

// ─── Full onboarding data ───
export interface OnboardingData {
  // Step 1: Role
  role: 'client' | 'provider' | null;
  // Step 2: Basic Info
  full_name: string;
  phone: string;
  whatsapp: string;
  bio: string;
  // Step 3: Location
  emirate: string;
  city: string;
  district: string;
  // Step 4: Identity
  verification_method: 'none' | 'uae_pass' | 'id_upload';
  emirates_id_front: File | null;
  emirates_id_back: File | null;
  uae_pass_verified: boolean;
  // Step 5: Provider Type (existing)
  provider_type: 'company' | 'craftsman' | null;
  business_name: string;
  business_name_en: string;
  specialties: string[];
  // Step 6: Professional
  years_experience: number;
  service_emirates: string[];
  residence: string;
  sponsor_company: string;
  previous_works: PreviousProject[];
  social_links: Record<string, string>;
  // Step 7: Company
  trade_license_file: File | null;
  num_workers: number;
  general_specialization: string;
  specific_specialization: string;
  classification_cert_file: File | null;
  // Step 8: Plan
  subscription_plan: string;
  // Meta
  preferred_language: string;
}

const INITIAL_DATA: OnboardingData = {
  role: null,
  full_name: '',
  phone: '',
  whatsapp: '',
  bio: '',
  emirate: '',
  city: '',
  district: '',
  verification_method: 'none',
  emirates_id_front: null,
  emirates_id_back: null,
  uae_pass_verified: false,
  provider_type: null,
  business_name: '',
  business_name_en: '',
  specialties: [],
  years_experience: 0,
  service_emirates: [],
  residence: '',
  sponsor_company: '',
  previous_works: [],
  social_links: {},
  trade_license_file: null,
  num_workers: 0,
  general_specialization: '',
  specific_specialization: '',
  classification_cert_file: null,
  subscription_plan: 'free_trial',
  preferred_language: 'ar',
};

export function OnboardingFlow({ onComplete, initialRole }: { onComplete: () => void; initialRole?: 'client' | 'provider' }) {
  const [currentStep, setCurrentStep] = useState<StepId>(initialRole ? 'basic_info' : 'role');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshProfile } = useUser();
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const isEn = language === 'en';
  const navigate = useNavigate();

  const [data, setData] = useState<OnboardingData>({
    ...INITIAL_DATA,
    preferred_language: language,
    role: initialRole ?? null,
  });

  // Pre-fill name from Google auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.full_name || user?.user_metadata?.name) {
        setData(prev => ({
          ...prev,
          full_name: user.user_metadata.full_name || user.user_metadata.name || '',
        }));
      }
    });
  }, []);

  // ─── Step Flow Logic ───
  const getStepSequence = (): StepId[] => {
    const steps: StepId[] = ['role', 'basic_info', 'location', 'identity'];
    if (data.role === 'provider') {
      steps.push('provider_type', 'professional');
      if (data.provider_type === 'company') {
        steps.push('company');
      }
    }
    steps.push('plan', 'review');
    return steps;
  };

  const stepSequence = getStepSequence();
  const currentIndex = stepSequence.indexOf(currentStep);
  const totalVisibleSteps = stepSequence.length;
  const displayStep = currentIndex + 1;

  const goNext = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < stepSequence.length) {
      setCurrentStep(stepSequence[nextIdx]);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentStep(stepSequence[currentIndex - 1]);
    }
  };

  // ─── Handlers ───
  // Note: we directly set the next step instead of goNext() because
  // setState is async and goNext uses the stale stepSequence
  const handleRoleSelect = (role: 'client' | 'provider') => {
    setData(prev => ({ ...prev, role }));
    setCurrentStep('basic_info'); // Always goes to basic_info after role
  };

  const handlePlanSelect = async (plan: string) => {
    setData(prev => ({ ...prev, subscription_plan: plan }));
    // Move to review
    setCurrentStep('review');
  };

  const submitOnboarding = async () => {
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        toast.error(isEn ? 'Please log in first' : 'يجب تسجيل الدخول أولاً');
        return;
      }

      // Prepare submission data (without File objects)
      const submissionData = {
        role: data.role,
        full_name: data.full_name,
        phone: data.phone,
        whatsapp: data.whatsapp,
        bio: data.bio,
        emirate: data.emirate,
        city: data.city,
        district: data.district,
        verification_method: data.verification_method,
        uae_pass_verified: data.uae_pass_verified,
        provider_type: data.provider_type,
        business_name: data.business_name,
        business_name_en: data.business_name_en,
        specialties: data.specialties,
        years_experience: data.years_experience,
        service_emirates: data.service_emirates,
        residence: data.residence,
        sponsor_company: data.sponsor_company,
        previous_works: data.previous_works.map(p => ({
          title: p.title,
          location: p.location,
          year: p.year,
          description: p.description,
        })),
        social_links: data.social_links,
        num_workers: data.num_workers,
        general_specialization: data.general_specialization,
        specific_specialization: data.specific_specialization,
        subscription_plan: data.subscription_plan,
        preferred_language: data.preferred_language,
        has_trade_license: !!data.trade_license_file,
        has_classification_cert: !!data.classification_cert_file,
        has_emirates_id_front: !!data.emirates_id_front,
        has_emirates_id_back: !!data.emirates_id_back,
      };

      const res = await fetch(`${API_BASE}/onboarding/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': token,
        },
        body: JSON.stringify(submissionData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // Upload files if any
        if (data.emirates_id_front || data.emirates_id_back || data.trade_license_file || data.classification_cert_file) {
          await uploadFiles(token, result.user_id || session?.user?.id);
        }

        toast.success(
          isEn
            ? `Your data has been submitted for review (24-48 hours). ID: ${result.display_id}`
            : `تم إرسال بياناتك للمراجعة (24-48 ساعة). معرفك: ${result.display_id}`,
          { duration: 6000 }
        );
        await refreshProfile();
        onComplete();
        navigate('/home');
      } else {
        console.error('Onboarding error:', result);
        toast.error(result.error || (isEn ? 'Setup failed' : 'فشل في إعداد الحساب'));
      }
    } catch (err: any) {
      console.error('Onboarding exception:', err);
      toast.error(isEn ? 'Connection error' : 'خطأ في الاتصال');
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadFiles = async (token: string, userId: string) => {
    const files: { key: string; file: File }[] = [];
    if (data.emirates_id_front) files.push({ key: 'emirates_id_front', file: data.emirates_id_front });
    if (data.emirates_id_back) files.push({ key: 'emirates_id_back', file: data.emirates_id_back });
    if (data.trade_license_file) files.push({ key: 'trade_license', file: data.trade_license_file });
    if (data.classification_cert_file) files.push({ key: 'classification_cert', file: data.classification_cert_file });

    for (const { key, file } of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', key);
        formData.append('userId', userId);

        await fetch(`${API_BASE}/verification/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-User-Token': token,
          },
          body: formData,
        });
      } catch (err) {
        console.error(`Failed to upload ${key}:`, err);
      }
    }
  };

  // ─── Step Labels for header ───
  const stepLabels: Record<StepId, { ar: string; en: string }> = {
    role: { ar: 'نوع الحساب', en: 'Account Type' },
    basic_info: { ar: 'البيانات الأساسية', en: 'Basic Info' },
    location: { ar: 'الموقع', en: 'Location' },
    identity: { ar: 'التوثيق', en: 'Verification' },
    provider_type: { ar: 'نوع النشاط', en: 'Business Type' },
    professional: { ar: 'المعلومات المهنية', en: 'Professional' },
    company: { ar: 'بيانات الشركة', en: 'Company' },
    plan: { ar: 'الباقة', en: 'Plan' },
    review: { ar: 'المراجعة', en: 'Review' },
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${isDark ? 'bg-[#0B1120]' : 'bg-[#F5EEE1]'}`}
      dir="rtl"
    >
      {/* Header */}
      <div className={`sticky top-0 z-20 px-4 py-3 flex items-center gap-3 ${isDark ? 'bg-[#0B1120]/90 backdrop-blur-xl border-b border-white/10' : 'bg-[#F5EEE1]/90 backdrop-blur-xl border-b border-[#E6DCC8]'}`}>
        {currentIndex > 0 && (
          <button
            onClick={goBack}
            className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-white'}`}
          >
            <ChevronLeft className={`w-5 h-5 rotate-180 ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`} />
          </button>
        )}
        <div className="flex-1">
          <h2
            className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`}
            style={{ fontFamily: fontCairo }}
          >
            {isEn ? stepLabels[currentStep].en : stepLabels[currentStep].ar}
          </h2>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-bold ${isDark ? 'bg-[#D4AF37]/20 text-[#FFD700]' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}`}
          style={{ fontFamily: fontCairo }}
        >
          {displayStep}/{totalVisibleSteps}
        </span>
      </div>

      {/* Progress Bar */}
      <div className={`h-1 ${isDark ? 'bg-white/10' : 'bg-[#E6DCC8]'}`}>
        <motion.div
          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700]"
          initial={{ width: '0%' }}
          animate={{ width: `${(displayStep / totalVisibleSteps) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 'role' && (
              <RoleSelection
                onSelect={handleRoleSelect}
                isEn={isEn}
                isDark={isDark}
              />
            )}

            {currentStep === 'basic_info' && (
              <BasicInfoStep
                data={{
                  full_name: data.full_name,
                  phone: data.phone,
                  whatsapp: data.whatsapp,
                  bio: data.bio,
                }}
                onChange={updates => setData(prev => ({ ...prev, ...updates }))}
                onNext={goNext}
                isEn={isEn}
                isDark={isDark}
              />
            )}

            {currentStep === 'location' && (
              <LocationStep
                data={{
                  emirate: data.emirate,
                  city: data.city,
                  district: data.district,
                }}
                onChange={updates => setData(prev => ({ ...prev, ...updates }))}
                onNext={goNext}
                isEn={isEn}
                isDark={isDark}
              />
            )}

            {currentStep === 'identity' && (
              <IdentityStep
                data={{
                  verification_method: data.verification_method,
                  emirates_id_front: data.emirates_id_front,
                  emirates_id_back: data.emirates_id_back,
                  uae_pass_verified: data.uae_pass_verified,
                }}
                onChange={updates => setData(prev => ({ ...prev, ...updates }))}
                onNext={() => {
                  setData(prev => ({
                    ...prev,
                    verification_method: prev.verification_method || 'none',
                  }));
                  goNext();
                }}
                onSkip={() => {
                  setData(prev => ({ ...prev, verification_method: 'none' }));
                  goNext();
                }}
                isEn={isEn}
                isDark={isDark}
              />
            )}

            {currentStep === 'provider_type' && (
              <ProviderTypeStep
                onSelect={(type) => {
                  setData(prev => ({ ...prev, provider_type: type }));
                  setCurrentStep('professional'); // Always goes to professional after provider_type
                }}
                data={data}
                onDataChange={(updates) => setData(updates)}
                isEn={isEn}
                isDark={isDark}
              />
            )}

            {currentStep === 'professional' && (
              <ProfessionalStep
                data={{
                  years_experience: data.years_experience,
                  service_emirates: data.service_emirates,
                  residence: data.residence,
                  sponsor_company: data.sponsor_company,
                  previous_works: data.previous_works,
                  social_links: data.social_links,
                }}
                onChange={updates => setData(prev => ({ ...prev, ...updates }))}
                onNext={goNext}
                isEn={isEn}
                isDark={isDark}
              />
            )}

            {currentStep === 'company' && (
              <CompanyStep
                data={{
                  trade_license_file: data.trade_license_file,
                  num_workers: data.num_workers,
                  general_specialization: data.general_specialization,
                  specific_specialization: data.specific_specialization,
                  classification_cert_file: data.classification_cert_file,
                }}
                onChange={updates => setData(prev => ({ ...prev, ...updates }))}
                onNext={goNext}
                isEn={isEn}
                isDark={isDark}
              />
            )}

            {currentStep === 'plan' && (
              <PlanSelection
                onSelect={handlePlanSelect}
                isSubmitting={false}
                isEn={isEn}
                isDark={isDark}
              />
            )}

            {currentStep === 'review' && (
              <ReviewSubmitStep
                data={{
                  role: data.role || 'client',
                  provider_type: data.provider_type || undefined,
                  full_name: data.full_name,
                  phone: data.phone,
                  whatsapp: data.whatsapp,
                  bio: data.bio,
                  emirate: data.emirate,
                  city: data.city,
                  district: data.district,
                  verification_method: data.verification_method,
                  uae_pass_verified: data.uae_pass_verified,
                  specialties: data.specialties,
                  business_name: data.business_name,
                  years_experience: data.years_experience,
                  service_emirates: data.service_emirates,
                  residence: data.residence,
                  sponsor_company: data.sponsor_company,
                  previous_works_count: data.previous_works.length,
                  social_links_count: Object.values(data.social_links).filter(Boolean).length,
                  trade_license_uploaded: !!data.trade_license_file,
                  num_workers: data.num_workers,
                  general_specialization: data.general_specialization,
                  specific_specialization: data.specific_specialization,
                  classification_cert_uploaded: !!data.classification_cert_file,
                  subscription_plan: data.subscription_plan,
                }}
                onSubmit={submitOnboarding}
                isSubmitting={isSubmitting}
                isEn={isEn}
                isDark={isDark}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Submitting Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-8 rounded-3xl text-center ${
                isDark ? 'bg-[#111827]' : 'bg-white'
              }`}
            >
              <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
              <p
                className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1F3D2B]'}`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Submitting your data...' : 'جاري إرسال بياناتك...'}
              </p>
              <p
                className={`text-sm mt-2 ${isDark ? 'text-white/60' : 'text-[#1F3D2B]/50'}`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? 'Creating your unique ID & profile' : 'يتم إنشاء معرفك الفريد وملفك'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}