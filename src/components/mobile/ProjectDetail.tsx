import { ArrowLeft, Calendar, Users, CheckCircle, Circle, MoreVertical, MessageSquare } from 'lucide-react';
// CheckCircle2 not available — using CheckCircle as alias
const CheckCircle2 = CheckCircle;
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';

const tabs = ['نظرة عامة', 'المهام', 'الملفات', 'العقود', 'الفريق', 'المحادثة'];

export function ProjectDetail({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  // Real Data would come from props or context
  const project = null; // No hardcoded project

  return (
    <div className="flex-1 bg-[#F5EEE1] overflow-y-auto pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5B7FE8] to-[#7B5FE8] px-5 pt-12 pb-6 rounded-b-[40px]">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg flex-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
             {project ? 'Project Name' : 'تفاصيل المشروع'}
          </h1>
          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Progress */}
        <div className="bg-white/20 backdrop-blur-sm rounded-[28px] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              التقدم الإجمالي
            </span>
            <span className="text-white text-lg" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              0%
            </span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: '0%' }} />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center">
              <p className="text-white/80 text-xs mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                الميزانية
              </p>
              <p className="text-white text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                0
              </p>
            </div>
            <div className="text-center border-x border-white/20">
              <p className="text-white/80 text-xs mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                المهام
              </p>
              <p className="text-white text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                0/0
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                الفريق
              </p>
              <p className="text-white text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                0
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E5E5E5] px-5 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2" dir="rtl">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all ${
                activeTab === index
                  ? 'bg-gradient-to-r from-[#5B7FE8] to-[#7B5FE8] text-white'
                  : 'bg-[#F5EEE1] text-[#6F6F6F]'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-10 text-center opacity-60">
         <p className="text-slate-400 font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>لم يتم تحديد مشروع</p>
      </div>
    </div>
  );
}