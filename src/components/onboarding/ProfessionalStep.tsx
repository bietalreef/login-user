/**
 * ProfessionalStep.tsx — المعلومات المهنية (للمزود)
 * ═══════════════════════════════════════════════════
 * سنوات الخبرة، بطاقات مشاريع سابقة، إمارات الخدمة، 
 * محل الإقامة، اسم الشركة/الكفيل، روابط التواصل الاجتماعي
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon3D } from '../ui/Icon3D';
import {
  Briefcase, Clock, MapPin, Building2, Plus, X,
  Camera, Globe, Instagram, Youtube, Linkedin,
  Award, AlertCircle, Check, Trash2,
} from 'lucide-react';
import {
  UAE_EMIRATES, EXPERIENCE_OPTIONS, SOCIAL_PLATFORMS,
} from './EmiratesData';

const fontCairo = 'Cairo, Tajawal, sans-serif';

export interface PreviousProject {
  id: string;
  title: string;
  location: string;
  year: number;
  description: string;
  imagePreview?: string;
  imageFile?: File;
}

interface ProfessionalStepProps {
  data: {
    years_experience: number;
    service_emirates: string[];
    residence: string;
    sponsor_company: string;
    previous_works: PreviousProject[];
    social_links: Record<string, string>;
  };
  onChange: (data: Partial<ProfessionalStepProps['data']>) => void;
  onNext: () => void;
  isEn: boolean;
  isDark: boolean;
}

export function ProfessionalStep({ data, onChange, onNext, isEn, isDark }: ProfessionalStepProps) {
  const [showAddProject, setShowAddProject] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [projectForm, setProjectForm] = useState<Partial<PreviousProject>>({
    title: '', location: '', year: 2025, description: '',
  });
  const [projectImagePreview, setProjectImagePreview] = useState<string | null>(null);
  const projectImageRef = useRef<HTMLInputElement>(null);

  const textClass = isDark ? 'text-white' : 'text-[#1F3D2B]';
  const mutedClass = isDark ? 'text-white/50' : 'text-[#1F3D2B]/50';
  const goldClass = isDark ? 'text-[#FFD700]' : 'text-[#D4AF37]';
  const cardClass = isDark
    ? 'bg-white/8 border-white/10'
    : 'bg-white border-gray-200/60';
  const inputClass = `w-full px-4 py-3 rounded-xl border-[4px] text-sm font-semibold transition-all ${
    isDark
      ? 'bg-white/8 border-white/10 text-white placeholder:text-white/30 focus:border-[#D4AF37]/50'
      : 'bg-white border-gray-200/60 text-[#1F3D2B] placeholder:text-[#1F3D2B]/30 focus:border-[#D4AF37]/50'
  }`;
  const labelClass = `text-sm font-bold mb-2 block ${isDark ? 'text-white/70' : 'text-[#1F3D2B]/70'}`;

  const toggleServiceEmirate = (emirateId: string) => {
    const current = data.service_emirates || [];
    const updated = current.includes(emirateId)
      ? current.filter(e => e !== emirateId)
      : [...current, emirateId];
    onChange({ service_emirates: updated });
  };

  const addProject = () => {
    if (!projectForm.title?.trim()) return;
    const newProject: PreviousProject = {
      id: `proj_${Date.now()}`,
      title: projectForm.title || '',
      location: projectForm.location || '',
      year: projectForm.year || 2025,
      description: projectForm.description || '',
      imagePreview: projectImagePreview || undefined,
    };
    onChange({ previous_works: [...(data.previous_works || []), newProject] });
    setProjectForm({ title: '', location: '', year: 2025, description: '' });
    setProjectImagePreview(null);
    setShowAddProject(false);
  };

  const removeProject = (id: string) => {
    onChange({ previous_works: data.previous_works.filter(p => p.id !== id) });
  };

  const updateSocialLink = (platformId: string, value: string) => {
    onChange({
      social_links: { ...data.social_links, [platformId]: value },
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!data.years_experience) {
      errs.experience = isEn ? 'Select your experience' : 'اختر سنوات الخبرة';
    }
    if (!data.service_emirates?.length) {
      errs.service_emirates = isEn ? 'Select at least one emirate' : 'اختر إمارة واحدة على الأقل';
    }
    if (!data.sponsor_company?.trim()) {
      errs.sponsor = isEn ? 'Company/sponsor name is required' : 'اسم الشركة / الكفيل مطلوب';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const SOCIAL_ICONS: Record<string, any> = {
    instagram: Instagram,
    youtube: Youtube,
    linkedin: Linkedin,
    globe: Globe,
    twitter: Globe,
    tiktok: Globe,
  };

  return (
    <div className="px-5 py-6">
      {/* Title */}
      <div className="text-center mb-6">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto mb-3">
          <Icon3D icon={Briefcase} theme="gold" size="xl" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xl font-black mb-1 ${textClass}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'Professional Information' : 'المعلومات المهنية'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-sm ${mutedClass}`}
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'Build your professional profile' : 'ابنِ ملفك المهني'}
        </motion.p>
      </div>

      <div className="space-y-5">
        {/* Years of Experience */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <label className={labelClass} style={{ fontFamily: fontCairo }}>
            <Clock className="w-4 h-4 inline-block ml-1.5" style={{ color: isDark ? '#FFD700' : '#D4AF37' }} />
            {isEn ? 'Years of Experience' : 'سنوات الخبرة'}
            <span className="text-red-400 mr-1">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_OPTIONS.map(opt => {
              const isSelected = data.years_experience === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onChange({ years_experience: opt.value })}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border-[3px] ${
                    isSelected
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                      : `${cardClass} ${isDark ? 'text-white/50' : 'text-[#1F3D2B]/50'}`
                  }`}
                  style={{ fontFamily: fontCairo }}
                >
                  {isEn ? opt.en : opt.ar}
                </button>
              );
            })}
          </div>
          {errors.experience && (
            <p className="text-xs text-red-400 font-bold mt-1 flex items-center gap-1" style={{ fontFamily: fontCairo }}>
              <AlertCircle className="w-3 h-3" />{errors.experience}
            </p>
          )}
        </motion.div>

        {/* Service Emirates */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label className={labelClass} style={{ fontFamily: fontCairo }}>
            <MapPin className="w-4 h-4 inline-block ml-1.5" style={{ color: isDark ? '#FFD700' : '#D4AF37' }} />
            {isEn ? 'Emirates You Serve' : 'الإمارات التي تقدم خدماتك بها'}
            <span className="text-red-400 mr-1">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {UAE_EMIRATES.map(emirate => {
              const isSelected = data.service_emirates?.includes(emirate.id);
              return (
                <button
                  key={emirate.id}
                  onClick={() => toggleServiceEmirate(emirate.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border-[3px] ${
                    isSelected
                      ? 'border-[#3B5BFE] bg-[#3B5BFE]/10 text-[#3B5BFE]'
                      : `${cardClass} ${isDark ? 'text-white/50' : 'text-[#1F3D2B]/50'}`
                  }`}
                  style={{ fontFamily: fontCairo }}
                >
                  {isSelected && <Check className="w-3 h-3 inline-block ml-1" />}
                  {isEn ? emirate.nameEn : emirate.nameAr}
                </button>
              );
            })}
          </div>
          {errors.service_emirates && (
            <p className="text-xs text-red-400 font-bold mt-1 flex items-center gap-1" style={{ fontFamily: fontCairo }}>
              <AlertCircle className="w-3 h-3" />{errors.service_emirates}
            </p>
          )}
        </motion.div>

        {/* Residence */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <label className={labelClass} style={{ fontFamily: fontCairo }}>
            <MapPin className="w-4 h-4 inline-block ml-1.5" style={{ color: isDark ? '#FFD700' : '#D4AF37' }} />
            {isEn ? 'Residence Address' : 'محل الإقامة'}
          </label>
          <input
            type="text"
            value={data.residence || ''}
            onChange={e => onChange({ residence: e.target.value })}
            placeholder={isEn ? 'Your current residence' : 'عنوان سكنك الحالي'}
            className={inputClass}
            style={{ fontFamily: fontCairo }}
            dir="rtl"
          />
        </motion.div>

        {/* Sponsor Company */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <label className={labelClass} style={{ fontFamily: fontCairo }}>
            <Building2 className="w-4 h-4 inline-block ml-1.5" style={{ color: isDark ? '#FFD700' : '#D4AF37' }} />
            {isEn ? 'Current Company / Sponsor' : 'الشركة / الكفيل الحالي'}
            <span className="text-red-400 mr-1">*</span>
          </label>
          <input
            type="text"
            value={data.sponsor_company || ''}
            onChange={e => onChange({ sponsor_company: e.target.value })}
            placeholder={isEn ? 'Company name your residency is under' : 'اسم الشركة التي إقامتك عليها'}
            className={inputClass}
            style={{ fontFamily: fontCairo }}
            dir="rtl"
          />
          <p className={`text-[10px] mt-1 ${mutedClass}`} style={{ fontFamily: fontCairo }}>
            {isEn
              ? 'A No Objection Certificate (NOC) will be generated for you to sign'
              : 'سيتم إنشاء شهادة عدم ممانعة (NOC) لتوقيعها وختمها من الشركة'}
          </p>
          {errors.sponsor && (
            <p className="text-xs text-red-400 font-bold mt-1 flex items-center gap-1" style={{ fontFamily: fontCairo }}>
              <AlertCircle className="w-3 h-3" />{errors.sponsor}
            </p>
          )}
        </motion.div>

        {/* Previous Projects */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <label className={labelClass} style={{ fontFamily: fontCairo }}>
            <Award className="w-4 h-4 inline-block ml-1.5" style={{ color: isDark ? '#FFD700' : '#D4AF37' }} />
            {isEn ? 'Previous Projects' : 'الأعمال السابقة'}
          </label>

          {/* Project Cards */}
          {data.previous_works?.length > 0 && (
            <div className="space-y-2 mb-3">
              {data.previous_works.map(project => (
                <div
                  key={project.id}
                  className={`rounded-2xl border-[4px] overflow-hidden ${cardClass}`}
                >
                  {project.imagePreview && (
                    <img src={project.imagePreview} alt={project.title} className="w-full h-24 object-cover" />
                  )}
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold text-sm ${textClass}`} style={{ fontFamily: fontCairo }}>
                        {project.title}
                      </h4>
                      <button
                        onClick={() => removeProject(project.id)}
                        className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                    <div className={`flex items-center gap-3 text-xs mt-1 ${mutedClass}`}>
                      {project.location && <span>📍 {project.location}</span>}
                      {project.year && <span>📅 {project.year}</span>}
                    </div>
                    {project.description && (
                      <p className={`text-xs mt-1 ${mutedClass}`}>{project.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Project Button / Form */}
          <AnimatePresence>
            {showAddProject ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`rounded-2xl border-[4px] p-4 space-y-3 ${cardClass}`}
              >
                <input
                  ref={projectImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setProjectImagePreview(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                {/* Image Upload */}
                <button
                  onClick={() => projectImageRef.current?.click()}
                  className={`w-full h-20 rounded-xl border-[3px] border-dashed flex items-center justify-center gap-2 ${
                    projectImagePreview
                      ? 'border-[#D4AF37]/40'
                      : isDark ? 'border-white/15' : 'border-gray-200/60'
                  }`}
                >
                  {projectImagePreview ? (
                    <img src={projectImagePreview} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <>
                      <Camera className={`w-5 h-5 ${mutedClass}`} />
                      <span className={`text-xs font-bold ${mutedClass}`} style={{ fontFamily: fontCairo }}>
                        {isEn ? 'Add Project Photo' : 'أضف صورة المشروع'}
                      </span>
                    </>
                  )}
                </button>

                <input
                  value={projectForm.title || ''}
                  onChange={e => setProjectForm(f => ({ ...f, title: e.target.value }))}
                  placeholder={isEn ? 'Project Name *' : 'اسم المشروع *'}
                  className={inputClass}
                  style={{ fontFamily: fontCairo }}
                  dir="rtl"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={projectForm.location || ''}
                    onChange={e => setProjectForm(f => ({ ...f, location: e.target.value }))}
                    placeholder={isEn ? 'Location' : 'الموقع'}
                    className={inputClass}
                    style={{ fontFamily: fontCairo }}
                    dir="rtl"
                  />
                  <input
                    type="number"
                    value={projectForm.year || ''}
                    onChange={e => setProjectForm(f => ({ ...f, year: Number(e.target.value) }))}
                    placeholder={isEn ? 'Year' : 'السنة'}
                    className={inputClass}
                    dir="ltr"
                  />
                </div>
                <textarea
                  value={projectForm.description || ''}
                  onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))}
                  placeholder={isEn ? 'Brief description' : 'وصف مختصر'}
                  rows={2}
                  className={`${inputClass} resize-none`}
                  style={{ fontFamily: fontCairo }}
                  dir="rtl"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addProject}
                    disabled={!projectForm.title?.trim()}
                    className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-[#D4AF37] text-white disabled:opacity-40 transition-all"
                    style={{ fontFamily: fontCairo }}
                  >
                    {isEn ? 'Add' : 'إضافة'}
                  </button>
                  <button
                    onClick={() => { setShowAddProject(false); setProjectImagePreview(null); }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold ${isDark ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-500'}`}
                    style={{ fontFamily: fontCairo }}
                  >
                    {isEn ? 'Cancel' : 'إلغاء'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowAddProject(true)}
                className={`w-full py-3 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                  isDark
                    ? 'border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10'
                    : 'border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10'
                }`}
                style={{ fontFamily: fontCairo }}
              >
                <Plus className="w-4 h-4" />
                {isEn ? 'Add Previous Project' : 'إضافة مشروع سابق'}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Social Media Links */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <label className={labelClass} style={{ fontFamily: fontCairo }}>
            <Globe className="w-4 h-4 inline-block ml-1.5" style={{ color: isDark ? '#FFD700' : '#D4AF37' }} />
            {isEn ? 'Social Media (Optional)' : 'وسائل التواصل الاجتماعي (اختياري)'}
          </label>
          <div className="space-y-2">
            {SOCIAL_PLATFORMS.map(platform => {
              const SocialIcon = SOCIAL_ICONS[platform.icon] || Globe;
              return (
                <div key={platform.id} className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-white/8' : 'bg-gray-50'}`}>
                    <SocialIcon className={`w-4 h-4 ${mutedClass}`} />
                  </div>
                  <input
                    value={data.social_links?.[platform.id] || ''}
                    onChange={e => updateSocialLink(platform.id, e.target.value)}
                    placeholder={platform.placeholder}
                    className={`${inputClass} flex-1`}
                    style={{ fontFamily: fontCairo }}
                    dir="ltr"
                  />
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Continue */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleNext}
        className="w-full mt-8 py-4 rounded-2xl text-white font-bold text-base transition-all"
        style={{
          background: 'linear-gradient(135deg, #D4AF37, #B8940E)',
          fontFamily: fontCairo,
        }}
      >
        {isEn ? 'Continue' : 'متابعة'}
      </motion.button>
    </div>
  );
}
