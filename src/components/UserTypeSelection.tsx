import React from 'react';
import { Users, Briefcase, ArrowRight, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
const logoImage = '/assets/logo.png';
import { useState } from 'react';
import { useUser } from '../utils/UserContext';
import { toast } from 'sonner@2.0.3';

interface UserTypeSelectionProps {
  onSelectType: (type: 'client' | 'provider') => void;
}

export function UserTypeSelection({ onSelectType }: UserTypeSelectionProps) {
  const [loading, setLoading] = useState<'client' | 'provider' | null>(null);
  const { updateProfile } = useUser();

  const handleSelect = async (type: 'client' | 'provider') => {
      setLoading(type);
      try {
          await updateProfile({ role: type });
          onSelectType(type);
      } catch (e) {
          console.error(e);
          toast.error('حدث خطأ أثناء حفظ البيانات');
      } finally {
          setLoading(null);
      }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-[520px] h-auto"
    >
      {/* Glass Panel */}
      <div
        className="relative backdrop-blur-[22px] bg-white/35 rounded-[28px] p-10 border border-white/15"
        style={{
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <ImageWithFallback
            src={logoImage}
            alt="بيت الريف"
            className="w-[80px] h-[80px] object-contain"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 
            className="text-[24px] text-[#1A1A1A] mb-2"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
          >
            اختر نوع الحساب
          </h1>
          <p 
            className="text-[14px] text-[#6F6F6F]/70"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            حدد كيف تريد استخدام المنصة
          </p>
        </div>

        {/* User Type Cards */}
        <div className="space-y-4 mb-6">
          {/* Client Card */}
          <motion.button
            onClick={() => handleSelect('client')}
            disabled={loading !== null}
            className="w-full group disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            <div className="relative backdrop-blur-sm bg-white/60 rounded-[20px] p-6 border border-white/40 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#5B7FE8]/20 to-[#7B5FE8]/20 flex items-center justify-center">
                    {loading === 'client' ? (
                        <Loader2 className="w-7 h-7 text-[#5B7FE8] animate-spin" />
                    ) : (
                        <Users className="w-7 h-7 text-[#5B7FE8]" />
                    )}
                  </div>
                  
                  {/* Text */}
                  <div className="text-right">
                    <h3 
                      className="text-[18px] text-[#1A1A1A] mb-1"
                      style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
                    >
                      عميل
                    </h3>
                    <p 
                      className="text-[13px] text-[#6F6F6F]/70"
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    >
                      أبحث عن خدمات بناء ومقاولات
                    </p>
                  </div>
                </div>
                
                {/* Arrow */}
                {!loading && (
                    <ArrowRight className="w-5 h-5 text-[#5B7FE8] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </div>
          </motion.button>

          {/* Service Provider Card */}
          <motion.button
            onClick={() => handleSelect('provider')}
            disabled={loading !== null}
            className="w-full group disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            <div className="relative backdrop-blur-sm bg-white/60 rounded-[20px] p-6 border border-white/40 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7B5FE8]/20 to-[#9B5FE8]/20 flex items-center justify-center">
                    {loading === 'provider' ? (
                        <Loader2 className="w-7 h-7 text-[#7B5FE8] animate-spin" />
                    ) : (
                        <Briefcase className="w-7 h-7 text-[#7B5FE8]" />
                    )}
                  </div>
                  
                  {/* Text */}
                  <div className="text-right">
                    <h3 
                      className="text-[18px] text-[#1A1A1A] mb-1"
                      style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
                    >
                      مزود خدمة
                    </h3>
                    <p 
                      className="text-[13px] text-[#6F6F6F]/70"
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    >
                      شركة مرخصة أو حرفي ماهر
                    </p>
                  </div>
                </div>
                
                {/* Arrow */}
                {!loading && (
                    <ArrowRight className="w-5 h-5 text-[#7B5FE8] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </div>
          </motion.button>
        </div>

        {/* Info Text */}
        <p 
          className="text-center text-[11px] text-[#6F6F6F]/60 mt-6 leading-relaxed"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          يمكنك تغيير نوع الحساب لاحقاً من الإعدادات
        </p>
      </div>
    </motion.div>
  );
}