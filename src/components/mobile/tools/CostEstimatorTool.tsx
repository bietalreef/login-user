import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Zap, ClipboardCopy, Share2, RotateCcw, AlertTriangle, Building2,
} from 'lucide-react';
import {
  SimpleToolShell, InputCard, SliderInput, OptionSelector,
  ActionButton, Divider, formatAED,
} from './SimpleToolShell';
import { calculateCostEstimate, CostEstimateResult } from './logic/AllCalculators';
import { useLanguage } from '../../../contexts/LanguageContext';

export function CostEstimatorTool({ onBack }: { onBack: () => void }) {
  const [area, setArea] = useState(200);
  const [floors, setFloors] = useState('1');
  const [emirate, setEmirate] = useState('dubai');
  const [finishLevel, setFinishLevel] = useState('standard');
  const [buildingType, setBuildingType] = useState('villa');
  const [result, setResult] = useState<CostEstimateResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    setLoading(true);
    setTimeout(() => {
      const res = calculateCostEstimate({
        area,
        floors: Number(floors),
        emirate,
        finishLevel: finishLevel as any,
        buildingType: buildingType as any,
      });
      setResult(res);
      setLoading(false);
      setTimeout(() => document.getElementById('ce-results')?.scrollIntoView({ behavior: 'smooth' }), 200);
    }, 800);
  };

  return (
    <SimpleToolShell
      title="مقدّر تكلفة البناء"
      titleEn="Construction Cost Estimator"
      subtitle="تقدير شامل لميزانية مشروعك"
      subtitleEn="Complete budget estimate for your project"
      toolId="cost"
      gradientFrom="#0F766E"
      gradientTo="#14B8A6"
      onBack={onBack}
    >
      {/* Building Type */}
      <InputCard title="🏗️ نوع المبنى">
        <OptionSelector
          label="اختر نوع المشروع"
          options={[
            { id: 'villa', label: 'فيلا', icon: '🏠' },
            { id: 'apartment', label: 'شقة', icon: '🏢' },
            { id: 'commercial', label: 'تجاري', icon: '🏪' },
            { id: 'warehouse', label: 'مستودع', icon: '🏭' },
          ]}
          value={buildingType}
          onChange={setBuildingType}
        />
      </InputCard>

      {/* Location & Size */}
      <InputCard title="📍 الموقع والمساحة">
        <OptionSelector
          label="الإمارة"
          options={[
            { id: 'dubai', label: 'دبي', icon: '🌆' },
            { id: 'abu-dhabi', label: 'أبوظبي', icon: '🕌' },
            { id: 'sharjah', label: 'الشارقة', icon: '🏙️' },
            { id: 'ajman', label: 'عجمان', icon: '🌊' },
            { id: 'ras-al-khaimah', label: 'رأس الخيمة', icon: '⛰️' },
            { id: 'fujairah', label: 'الفجيرة', icon: '🏔️' },
          ]}
          value={emirate}
          onChange={setEmirate}
        />

        <SliderInput
          label="مساحة الدور الواحد"
          value={area}
          onChange={setArea}
          min={50}
          max={3000}
          step={25}
          suffix="م²"
        />

        <OptionSelector
          label="عدد الأدوار"
          options={[
            { id: '1', label: 'دور واحد', icon: '1️⃣' },
            { id: '2', label: 'دورين', icon: '2️⃣' },
            { id: '3', label: '3 أدوار', icon: '3️⃣' },
            { id: '4', label: '4 أدوار+', icon: '4️⃣' },
          ]}
          value={floors}
          onChange={setFloors}
        />
      </InputCard>

      {/* Finish Level */}
      <InputCard title="✨ مستوى التشطيب">
        <div className="space-y-2">
          {[
            { id: 'standard', label: 'عادي', icon: '🏠', desc: 'دهانات عادية، سيراميك محلي، أبواب خشب ضغط', range: '1,200 - 1,800' },
            { id: 'premium', label: 'ممتاز', icon: '⭐', desc: 'دهانات فاخرة، بورسلين، أبواب خشب طبيعي', range: '1,800 - 2,800' },
            { id: 'luxury', label: 'سوبر ديلوكس', icon: '👑', desc: 'رخام، ديكورات جبس، إضاءة ذكية', range: '2,800 - 4,500' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFinishLevel(opt.id)}
              className={`w-full flex items-start gap-3 p-4 rounded-xl border-[4px] transition-all text-right ${
                finishLevel === opt.id
                  ? 'border-teal-500 bg-teal-50/50 shadow-sm'
                  : 'border-gray-200/60 bg-white hover:border-gray-300'
              }`}
            >
              <span className="text-2xl mt-0.5">{opt.icon}</span>
              <div className="flex-1">
                <div className={`font-bold font-cairo text-sm ${finishLevel === opt.id ? 'text-teal-700' : 'text-gray-700'}`}>
                  {opt.label}
                </div>
                <div className="text-[10px] text-gray-400 font-cairo mt-0.5">{opt.desc}</div>
                <div className="text-[10px] text-teal-600 font-bold font-cairo mt-1">{opt.range} د.إ / م²</div>
              </div>
            </button>
          ))}
        </div>
      </InputCard>

      {/* Calculate Button */}
      <div className="mb-4">
        <ActionButton onClick={handleCalculate} text="قدّر التكلفة" icon="⚡" loading={loading} />
      </div>

      {/* Results */}
      {result && (
        <motion.div
          id="ce-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Divider text="التقدير المالي" />

          {/* Cost Range Card */}
          <div className="bg-gradient-to-l from-teal-700 to-teal-900 rounded-[24px] p-6 mb-4 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -ml-10 -mt-10" />
            <div className="relative z-10">
              <div className="text-teal-300 text-xs font-cairo mb-1">التكلفة التقديرية المتوسطة</div>
              <div className="text-3xl font-bold font-cairo text-white mb-1">
                {formatAED(result.avgCost)}
              </div>
              <div className="flex items-center gap-2 mt-2 mb-4">
                <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-teal-300">الحد الأدنى</div>
                  <div className="text-sm font-bold text-white">{formatAED(result.minCost)}</div>
                </div>
                <div className="text-white/40">—</div>
                <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-teal-300">الحد الأقصى</div>
                  <div className="text-sm font-bold text-white">{formatAED(result.maxCost)}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
                <div className="text-center">
                  <div className="text-[10px] text-teal-300">المساحة الكلية</div>
                  <div className="text-sm font-bold text-white">{area * Number(floors)} م²</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-teal-300">سعر المتر</div>
                  <div className="text-sm font-bold text-[#C8A86A]">{result.pricePerM2.min}-{result.pricePerM2.max}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-teal-300">المدة المقدّرة</div>
                  <div className="text-sm font-bold text-white">{result.timelineAr}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <InputCard title="📊 توزيع التكلفة">
            <div className="space-y-3">
              {result.breakdown.map((item, index) => {
                const barWidth = item.percentage;
                return (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm font-bold text-gray-700 font-cairo">{item.categoryAr}</span>
                      </div>
                      <span className="text-sm font-bold text-teal-600 font-cairo">{formatAED(item.cost)}</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        className="h-full bg-gradient-to-l from-teal-500 to-teal-400 rounded-full"
                      />
                    </div>
                    <div className="text-left text-[10px] text-gray-400 font-cairo">{item.percentage}%</div>
                  </motion.div>
                );
              })}
            </div>
          </InputCard>

          {/* Disclaimer */}
          <div className="bg-amber-50 border-[4px] border-amber-200/60 rounded-2xl p-4 mb-4">
            <p className="text-amber-800 text-xs font-cairo leading-relaxed">
              ⚠️ التقدير مبني على متوسط أسعار السوق الإماراتي لعام 2025. الأسعار الفعلية تعتمد على تفاصيل المشروع والمقاول المنفّذ. يُنصح بطلب عروض أسعار تفصيلية.
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <ActionButton onClick={() => {
              const text = `مقدّر تكلفة البناء - بيت الريف\n${{villa:'فيلا',apartment:'شقة',commercial:'تجاري',warehouse:'مستودع'}[buildingType]}\nالموقع: ${{dubai:'دبي','abu-dhabi':'أبوظبي',sharjah:'الشارقة',ajman:'عجمان','ras-al-khaimah':'رأس الخيمة',fujairah:'الفجيرة'}[emirate]}\nالمساحة: ${area * Number(floors)} م²\nالتكلفة: ${formatAED(result.minCost)} - ${formatAED(result.maxCost)}\nالمتوسط: ${formatAED(result.avgCost)}`;
              navigator.clipboard?.writeText(text).then(() => alert('تم نسخ النتائج'));
            }} text="نسخ" icon="📋" variant="secondary" />
            <ActionButton onClick={() => {
              const text = `تقدير تكلفة بناء - بيت الريف\nالمساحة: ${area * Number(floors)}م²\nالتكلفة: ${formatAED(result.avgCost)}\nاطلب عرض سعر مجاناً`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            }} text="واتساب" icon="📤" variant="dark" />
          </div>

          <ActionButton onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} text="تقدير جديد" icon="🔄" variant="secondary" />
        </motion.div>
      )}
    </SimpleToolShell>
  );
}