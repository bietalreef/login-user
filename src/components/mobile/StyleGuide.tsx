import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function StyleGuide({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 bg-[#F5EEE1] overflow-y-auto pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5B7FE8] to-[#7B5FE8] px-5 pt-12 pb-6 rounded-b-[32px]">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            دليل التصميم
          </h1>
        </div>
      </div>

      <div className="px-5 py-6 space-y-8">
        {/* Colors */}
        <div>
          <h2 className="text-[#1A1A1A] text-base mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            الألوان
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-[16px] bg-gradient-to-r from-[#5B7FE8] to-[#7B5FE8] shadow-md" />
              <div>
                <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  Primary Blue
                </p>
                <p className="text-xs text-[#6F6F6F]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  #5B7FE8 → #7B5FE8
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-[16px] bg-gradient-to-r from-[#C8A24A] to-[#D3A55A] shadow-md" />
              <div>
                <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  Gold Accent
                </p>
                <p className="text-xs text-[#6F6F6F]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  #D4AF37
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-[16px] bg-[#0F6E4C] shadow-md" />
              <div>
                <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  Green Success
                </p>
                <p className="text-xs text-[#6F6F6F]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  #0F6E4C
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-[16px] bg-[#F5EEE1] border border-[#E5E5E5] shadow-sm" />
              <div>
                <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  Background
                </p>
                <p className="text-xs text-[#6F6F6F]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  #F5EEE1
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-[16px] bg-[#1A1A1A] shadow-md" />
              <div>
                <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  Dark Text
                </p>
                <p className="text-xs text-[#6F6F6F]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  #1A1A1A
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-[16px] bg-[#6F6F6F] shadow-md" />
              <div>
                <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  Muted Text
                </p>
                <p className="text-xs text-[#6F6F6F]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  #6F6F6F
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <h2 className="text-[#1A1A1A] text-base mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            الطباعة
          </h2>
          <div className="bg-white rounded-[20px] p-4 space-y-3">
            <div>
              <p className="text-2xl text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                عنوان كبير
              </p>
              <p className="text-xs text-[#6F6F6F]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Cairo Bold 24px
              </p>
            </div>
            <div>
              <p className="text-xl text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                عنوان متوسط
              </p>
              <p className="text-xs text-[#6F6F6F]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Cairo Bold 20px
              </p>
            </div>
            <div>
              <p className="text-base text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                عنوان صغير
              </p>
              <p className="text-xs text-[#6F6F6F]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Cairo SemiBold 16px
              </p>
            </div>
            <div>
              <p className="text-sm text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                نص عادي
              </p>
              <p className="text-xs text-[#6F6F6F]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Cairo Regular 14px
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6F6F6F] mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                نص صغير
              </p>
              <p className="text-xs text-[#6F6F6F]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Cairo Regular 12px
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div>
          <h2 className="text-[#1A1A1A] text-base mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            الأزرار
          </h2>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-[#5B7FE8] to-[#7B5FE8] text-white rounded-[20px] py-4 shadow-lg" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              زر أساسي
            </button>
            <button className="w-full bg-white border-2 border-[#5B7FE8] text-[#5B7FE8] rounded-[20px] py-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              زر ثانوي
            </button>
            <button className="w-full bg-[#F5EEE1] text-[#1A1A1A] rounded-[20px] py-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              زر عادي
            </button>
            <button className="w-full bg-gradient-to-r from-[#C8A24A] to-[#D3A55A] text-white rounded-[20px] py-4 shadow-lg" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              زر ذهبي
            </button>
          </div>
        </div>

        {/* Cards */}
        <div>
          <h2 className="text-[#1A1A1A] text-base mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            البطاقات
          </h2>
          <div className="space-y-3">
            <div className="bg-white rounded-[24px] p-4 shadow-md">
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                بطاقة عادية
              </p>
              <p className="text-xs text-[#6F6F6F] mt-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                rounded-[24px] shadow-md
              </p>
            </div>
            <div className="bg-white rounded-[20px] p-4 shadow-sm border border-[#E5E5E5]">
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                بطاقة بحدود
              </p>
              <p className="text-xs text-[#6F6F6F] mt-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                rounded-[20px] border
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#5B7FE8] to-[#7B5FE8] rounded-[24px] p-4 shadow-lg">
              <p className="text-sm text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                بطاقة ملونة
              </p>
              <p className="text-xs text-white/80 mt-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                gradient background
              </p>
            </div>
          </div>
        </div>

        {/* Spacing */}
        <div>
          <h2 className="text-[#1A1A1A] text-base mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            المسافات
          </h2>
          <div className="bg-white rounded-[20px] p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#5B7FE8] rounded-full" />
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Small: 0.5rem (8px)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#5B7FE8] rounded-full" />
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Medium: 1rem (16px)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#5B7FE8] rounded-full" />
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Large: 1.5rem (24px)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#5B7FE8] rounded-full" />
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                XLarge: 2rem (32px)
              </p>
            </div>
          </div>
        </div>

        {/* Border Radius */}
        <div>
          <h2 className="text-[#1A1A1A] text-base mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            الزوايا المستديرة
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-[#5B7FE8] rounded-[12px]" />
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Small: 12px
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-[#5B7FE8] rounded-[16px]" />
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Medium: 16px
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-[#5B7FE8] rounded-[20px]" />
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                Large: 20px
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-[#5B7FE8] rounded-[24px]" />
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                XLarge: 24px
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}