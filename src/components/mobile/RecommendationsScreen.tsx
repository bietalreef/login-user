import React, { useState } from 'react';
import { Sparkles, TrendingUp, Star, Award, ThumbsUp, Zap, Filter, Search } from 'lucide-react';

// 1. فصل البيانات (Data Separation) لتسهيل التعديل لاحقاً
const RECOMMENDATIONS_DATA = [
  {
    id: 1,
    category: 'contractor',
    type: 'مقاول موصى به',
    icon: Award,
    title: 'مؤسسة الإمارات للمقاولات',
    rating: 4.9,
    reviews: 245,
    speciality: 'بناء الفلل والمنازل الفاخرة',
    badge: 'الأكثر طلباً',
    color: 'from-[#D4AF37] to-[#B8940E]',
  },
  {
    id: 2,
    category: 'consultant',
    type: 'مستشار هندسي موصى به',
    icon: Star,
    title: 'مكتب دبي الهندسي الاستشاري',
    rating: 4.8,
    reviews: 189,
    speciality: 'التصاميم الحديثة والمعمار الذكي',
    badge: 'الأعلى تقييماً',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 3,
    category: 'maintenance',
    type: 'شركة صيانة موصى بها',
    icon: ThumbsUp,
    title: 'الخليج للصيانة الشاملة',
    rating: 4.7,
    reviews: 312,
    speciality: 'صيانة دورية وطوارئ 24/7',
    badge: 'الأسرع استجابة',
    color: 'from-[#D4AF37] to-[#FFD700]',
  },
  {
    id: 4,
    category: 'worker',
    type: 'حرفي موصى به',
    icon: Zap,
    title: 'أبو أحمد - معلم بناء',
    rating: 4.9,
    reviews: 156,
    speciality: 'أعمال البناء والتشطيبات',
    badge: 'الأكثر خبرة',
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 5,
    category: 'shop',
    type: 'محل مواد موصى به',
    icon: TrendingUp,
    title: 'معرض الإمارات لمواد البناء',
    rating: 4.6,
    reviews: 428,
    speciality: 'أفضل الأسعار وجودة مضمونة',
    badge: 'الأفضل سعراً',
    color: 'from-teal-500 to-cyan-600',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'contractor', label: 'مقاولات' },
  { id: 'consultant', label: 'استشارات' },
  { id: 'maintenance', label: 'صيانة' },
];

export function RecommendationsScreen() {
  const [activeCategory, setActiveCategory] = useState('all');

  // منطق الفلترة
  const filteredData = activeCategory === 'all' 
    ? RECOMMENDATIONS_DATA 
    : RECOMMENDATIONS_DATA.filter(item => item.category === activeCategory);

  return (
    <div className="bg-[#F8F9FA] pb-24 font-sans flex-1" dir="rtl">
      
      {/* Header Section with Modern Gradient */}
      <div className="relative bg-gradient-to-r from-[#4A90E2] via-[#4776E6] to-[#56CCF2] pt-12 pb-16 px-5 rounded-b-[40px] shadow-lg overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

        <div className="relative z-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30">
            <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
            <span className="text-white text-sm font-bold tracking-wide">مدعوم بالذكاء الاصطناعي</span>
          </div>
          
          <h1 className="text-white text-3xl font-black font-cairo leading-tight">
            التوصيات الذكية
          </h1>
          <p className="text-blue-50 text-sm font-medium opacity-90 max-w-xs mx-auto">
            اخترنا لك نخبة من مزودي الخدمات الأعلى تقييماً في منطقتك
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="px-5 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-2 flex gap-2 overflow-x-auto no-scrollbar border border-gray-100 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-[#4A90E2] text-white shadow-md transform scale-105'
                  : 'bg-transparent text-gray-500 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="px-5 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 font-bold text-lg">
            {filteredData.length} نتيجة مقترحة
          </h3>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredData.map((item) => (
            <CardItem key={item.id} item={item} />
          ))}
        </div>
        
        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">لا توجد نتائج لهذا التصنيف حالياً</p>
          </div>
        )}
      </div>

      {/* AI Insight Footer */}
      <div className="px-5 mt-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-l from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-100 flex gap-4 items-start">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
             <Sparkles className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h4 className="text-gray-900 font-bold text-sm mb-1">كيف يعمل نظام التوصية؟</h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              يقوم نظام "وياك AI" بتحليل آلاف التقييمات، ومقارنة الأسعار وسرعة التنفيذ ليقدم لك الخيارات التي تناسب مشروعك بدقة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Cleaner Code
function CardItem({ item }: { item: any }) {
  const Icon = item.icon;
  
  return (
    <div className="group bg-white rounded-[24px] p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-blue-200 relative overflow-hidden">
      
      {/* Top Section */}
      <div className="flex justify-between items-start mb-4">
        {/* Icon Container */}
        <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        
        {/* Badge */}
        <span className="bg-gray-50 text-gray-600 border border-gray-100 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          {item.badge}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <p className="text-blue-500 text-xs font-bold tracking-wide">{item.type}</p>
        <h3 className="text-gray-900 font-bold text-lg leading-tight group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>
        
        {/* Stats Row */}
        <div className="flex items-center gap-4 py-2 border-b border-gray-50 mb-2">
           <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-gray-800 text-sm">{item.rating}</span>
           </div>
           <div className="h-4 w-[1px] bg-gray-200"></div>
           <span className="text-gray-500 text-xs font-medium">{item.reviews} مراجعة</span>
        </div>

        <p className="text-gray-500 text-xs line-clamp-1">{item.speciality}</p>
      </div>

      {/* Action Button */}
      <button className="w-full mt-4 bg-gray-50 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-900 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 group/btn">
        <span>عرض الملف</span>
        <TrendingUp className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform rtl:rotate-180" />
      </button>
    </div>
  );
}