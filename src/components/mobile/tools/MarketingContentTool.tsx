import { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Camera, BookOpen, MessageCircle, Briefcase, Smile, Flame, Settings, MapPin, Sparkles } from 'lucide-react';
import {
  SimpleToolShell, InputCard, InputField, OptionSelector,
  ActionButton, Divider,
} from './SimpleToolShell';
import { generateMarketingContent, MarketingResult } from './logic/AllCalculators';

const SERVICE_TYPES = [
  'سباكة', 'كهرباء', 'تكييف', 'دهانات', 'تنظيف', 'بناء',
  'نجارة', 'ديكور', 'حدادة', 'أرضيات', 'صيانة', 'تبريد',
];

const CITIES = [
  'دبي', 'أبوظبي', 'الشارقة', 'عجمان', 'رأس الخيمة', 'الفجيرة', 'أم القيوين',
];

export function MarketingContentTool({ onBack }: { onBack: () => void }) {
  const [serviceType, setServiceType] = useState('');
  const [features, setFeatures] = useState('');
  const [targetCity, setTargetCity] = useState('دبي');
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState<MarketingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!serviceType) {
      alert('اختر نوع الخدمة أولاً');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = generateMarketingContent({
        serviceType,
        features: features || 'خبرة طويلة، أسعار تنافسية، ضمان على الخدمة',
        targetCity,
        platform: platform as any,
        tone: tone as any,
      });
      setResult(res);
      setLoading(false);
      setTimeout(() => document.getElementById('mc-results')?.scrollIntoView({ behavior: 'smooth' }), 200);
    }, 1000);
  };

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(section);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <SimpleToolShell
      title="مولّد المحتوى التسويقي"
      titleEn="Marketing Content Generator"
      subtitle="أنشئ منشورات جاهزة لمنصات التواصل"
      subtitleEn="Create ready-to-publish social media posts"
      toolId="marketing"
      gradientFrom="#DB2777"
      gradientTo="#F472B6"
      onBack={onBack}
    >
      {/* Service Type */}
      <InputCard title="نوع الخدمة">
        <div className="flex flex-wrap gap-2">
          {SERVICE_TYPES.map((s) => (
            <button
              key={s}
              onClick={() => setServiceType(s)}
              className={`px-4 py-2 rounded-full text-xs font-bold font-cairo transition-all ${
                serviceType === s
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {!serviceType && (
          <input
            type="text"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            placeholder="أو اكتب نوع الخدمة يدوياً..."
            className="w-full mt-3 p-3 bg-gray-50 rounded-xl border-[4px] border-gray-200/60 text-sm font-cairo outline-none focus:border-pink-400"
          />
        )}
      </InputCard>

      {/* Features */}
      <InputCard title="مميزات الخدمة">
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder="اكتب مميزات خدمتك (كل ميزة في سطر أو افصل بفاصلة)&#10;مثال: خبرة 10 سنوات، ضمان سنة، أسعار منافسة"
          className="w-full p-3.5 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-pink-400 font-cairo h-24 resize-none"
        />
      </InputCard>

      {/* City */}
      <InputCard title="المدينة المستهدفة">
        <div className="flex flex-wrap gap-2">
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setTargetCity(c)}
              className={`px-4 py-2 rounded-full text-xs font-bold font-cairo transition-all ${
                targetCity === c
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </InputCard>

      {/* Platform & Tone */}
      <InputCard title="إعدادات المنشور">
        <OptionSelector
          label="المنصة"
          options={[
            { id: 'instagram', label: 'انستغرام', icon: <Camera className="w-4 h-4 text-pink-500" /> },
            { id: 'facebook', label: 'فيسبوك', icon: <BookOpen className="w-4 h-4 text-blue-600" /> },
            { id: 'twitter', label: 'تويتر', icon: <MessageCircle className="w-4 h-4 text-gray-700" /> },
            { id: 'whatsapp', label: 'واتساب', icon: <MessageCircle className="w-4 h-4 text-green-500" /> },
          ]}
          value={platform}
          onChange={setPlatform}
        />
        <OptionSelector
          label="نبرة الخطاب"
          options={[
            { id: 'professional', label: 'احترافي', icon: <Briefcase className="w-4 h-4 text-blue-500" /> },
            { id: 'friendly', label: 'ودّي', icon: <Smile className="w-4 h-4 text-amber-500" /> },
            { id: 'promotional', label: 'ترويجي', icon: <Flame className="w-4 h-4 text-red-500" /> },
          ]}
          value={tone}
          onChange={setTone}
        />
      </InputCard>

      {/* Generate Button */}
      <div className="mb-4">
        <ActionButton onClick={handleGenerate} text="أنشئ المنشور" loading={loading} />
      </div>

      {/* Results */}
      {result && (
        <motion.div
          id="mc-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Divider text="المحتوى الجاهز" />

          {/* Post Text */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm border-[4px] border-gray-100/60 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold font-cairo text-sm text-[#1A1A1A]">📝 نص المنشور</h4>
              <button
                onClick={() => handleCopy(result.postText, 'post')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  copied === 'post' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {copied === 'post' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'post' ? 'تم النسخ!' : 'نسخ'}
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-sm font-cairo text-gray-800 leading-relaxed whitespace-pre-line border-[4px] border-gray-100/60">
              {result.postText}
            </div>
          </div>

          {/* Hashtags */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm border-[4px] border-gray-100/60 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold font-cairo text-sm text-[#1A1A1A]"># هاشتاغات</h4>
              <button
                onClick={() => handleCopy(result.hashtags, 'hashtags')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  copied === 'hashtags' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {copied === 'hashtags' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'hashtags' ? 'تم النسخ!' : 'نسخ'}
              </button>
            </div>
            <div className="bg-pink-50 rounded-xl p-3 text-sm font-cairo text-pink-700 leading-relaxed">
              {result.hashtags}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm border-[4px] border-gray-100/60 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold font-cairo text-sm text-[#1A1A1A]">📞 دعوة للإجراء</h4>
              <button
                onClick={() => handleCopy(result.callToAction, 'cta')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  copied === 'cta' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {copied === 'cta' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'cta' ? 'تم النسخ!' : 'نسخ'}
              </button>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-sm font-cairo text-blue-700">
              {result.callToAction}
            </div>
          </div>

          {/* Copy All & Share */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <ActionButton onClick={() => {
              const fullText = `${result.postText}\n\n${result.hashtags}\n\n${result.callToAction}`;
              handleCopy(fullText, 'all');
            }} text="نسخ الكل" icon="📋" variant="secondary" />
            <ActionButton onClick={() => {
              const fullText = `${result.postText}\n\n${result.hashtags}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(fullText)}`, '_blank');
            }} text="واتساب" icon="📤" variant="dark" />
          </div>

          <ActionButton onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} text="إنشاء منشور جديد" icon="🔄" variant="secondary" />
        </motion.div>
      )}
    </SimpleToolShell>
  );
}