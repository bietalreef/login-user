import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, ShieldCheck, Award, User, Star } from 'lucide-react';
// CheckCircle2 & Crown not available — using safe aliases
const CheckCircle2 = CheckCircle;
const Crown = Award;
import { useUser } from '../utils/UserContext';
import { useState } from 'react';

interface PackageSelectionProps {
  onComplete: () => void;
}

export function PackageSelection({ onComplete }: PackageSelectionProps) {
  const { profile, updateProfile } = useUser();
  const [loading, setLoading] = useState(false);

  const role = profile?.role;

  const handleSelectVisitor = async () => {
    setLoading(true);
    try {
      // Visitor = Unverified, Free
      await updateProfile({ is_verified: false, plan: 'free' });
      toast.success('تم تفعيل وضع الزائر');
      onComplete();
    } catch (e) {
      toast.error('حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVerifiedFree = async () => {
    setLoading(true);
    try {
      // Simulate Verification Process -> Verify Identity
      // In real app, redirect to ID upload.
      // For MVP: We mark as Verified, Free
      await updateProfile({ is_verified: true, plan: 'free' });
      toast.success('تم توثيق الحساب (باقة مجانية)');
      onComplete();
    } catch (e) {
      toast.error('حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVerifiedPro = async () => {
    setLoading(true);
    try {
      // Simulate Payment -> Upgrade
      // For MVP: Mark as Verified, Pro
      await updateProfile({ is_verified: true, plan: 'pro' });
      toast.success('تم الترقية للباقة الاحترافية');
      onComplete();
    } catch (e) {
      toast.error('حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  if (!role) return null;

  return (
    <div className="w-full max-w-5xl px-4 py-8 h-[90vh] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold text-amber-900 mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
          اختر باقتك المفضلة
        </h1>
        <p className="text-amber-900/60 text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
          خطط مرنة تناسب جميع الاحتياجات
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tier 1: Visitor (Guest) */}
        <PackageCard
          title={role === 'client' ? 'زائر' : 'زائر (محدود)'}
          price="مجاناً"
          icon={<User className="w-8 h-8 text-gray-500" />}
          description="تصفح واستكشف المنصة"
          color="gray"
          buttonText="دخول كزائر"
          onClick={handleSelectVisitor}
          loading={loading}
          delay={0.1}
          features={role === 'client' ? [
            { text: "تصفح المتجر والمنتجات", valid: true },
            { text: "طلب عرض سعر سريع (RFQ)", valid: true },
            { text: "غرفة خدمة العملاء", valid: true },
            { text: "طلب مشاريع كاملة", valid: false },
            { text: "تواصل مع المزودين", valid: false },
          ] : [
            { text: "إنشاء بروفايل مبدئي", valid: true },
            { text: "متجر مصغر (محدود)", valid: true },
            { text: "غرفة خدمة العملاء", valid: true },
            { text: "الظهور في البحث", valid: false },
            { text: "استقبال الطلبات", valid: false },
          ]}
        />

        {/* Tier 2: Verified Free */}
        <PackageCard
          title={role === 'client' ? 'موثق (أساسي)' : 'موثق (مجاني)'}
          price="مجاناً"
          badge="الأكثر شيوعاً"
          icon={<ShieldCheck className="w-8 h-8 text-blue-600" />}
          description="هوية موثقة ومميزات كاملة"
          color="blue"
          buttonText="توثيق الهوية مجاناً"
          onClick={handleSelectVerifiedFree}
          loading={loading}
          delay={0.2}
          isPopular
          features={role === 'client' ? [
            { text: "كل مميزات الزائر", valid: true },
            { text: "طلب مشاريع ومناقصات", valid: true },
            { text: "تواصل مباشر (Chat)", valid: true },
            { text: "أولوية في الدعم", valid: true },
            { text: "غرف المشاريع الصوتية", valid: false },
          ] : [
            { text: "توثيق الهوية والرخصة", valid: true },
            { text: "الظهور في نتائج البحث", valid: true },
            { text: "استقبال الطلبات", valid: true },
            { text: "تقديم عروض أسعار", valid: true },
            { text: "شارة التوثيق الزرقاء", valid: true },
          ]}
        />

        {/* Tier 3: Verified Pro */}
        <PackageCard
          title={role === 'client' ? 'احترافي (VIP)' : 'شريك (Pro)'}
          price={role === 'client' ? '99 درهم/شهر' : '199 درهم/شهر'}
          icon={<Crown className="w-8 h-8 text-amber-500" />}
          description="للمحترفين والشركات الكبرى"
          color="gold"
          buttonText="اشتراك وتوثيق"
          onClick={handleSelectVerifiedPro}
          loading={loading}
          delay={0.3}
          features={role === 'client' ? [
            { text: "كل مميزات الموثق", valid: true },
            { text: "غرف مشاريع صوتية خاصة", valid: true },
            { text: "مدير حساب شخصي", valid: true },
            { text: "عروض حصرية وخصومات", valid: true },
            { text: "تحليلات متقدمة", valid: true },
          ] : [
            { text: "كل مميزات الموثق", valid: true },
            { text: "أولوية قصوى في الظهور", valid: true },
            { text: "عدد لا محدود من المنتجات", valid: true },
            { text: "تحليلات السوق والمنافسين", valid: true },
            { text: "غرف صوتية خاصة", valid: true },
          ]}
        />

      </div>
    </div>
  );
}

interface PackageCardProps {
  title: string;
  price: string;
  description: string;
  icon: React.ReactNode;
  features: { text: string; valid: boolean }[];
  buttonText: string;
  onClick: () => void;
  color: 'gray' | 'blue' | 'gold';
  loading: boolean;
  delay: number;
  badge?: string;
  isPopular?: boolean;
}

function PackageCard({ 
  title, price, description, icon, features, buttonText, onClick, color, loading, delay, badge, isPopular 
}: PackageCardProps) {
  
  const bgColors = {
    gray: 'bg-white/60 border-white/50',
    blue: 'bg-white/80 border-blue-200 shadow-blue-100',
    gold: 'bg-amber-50/90 border-amber-200 shadow-amber-100',
  };

  const btnColors = {
    gray: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    blue: 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200/50',
    gold: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:opacity-90 shadow-amber-200/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative rounded-[24px] p-6 border shadow-xl flex flex-col ${bgColors[color]} backdrop-blur-xl ${isPopular ? 'scale-105 z-10' : 'scale-100'}`}
    >
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {badge}
        </div>
      )}

      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-2xl ${color === 'gold' ? 'bg-amber-100' : color === 'blue' ? 'bg-blue-100' : 'bg-gray-100'}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Cairo, sans-serif' }}>{title}</h3>
          <p className="text-sm text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>{description}</p>
        </div>
      </div>

      <div className="mb-6">
        <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cairo, sans-serif' }}>{price}</span>
      </div>

      <div className="flex-1 mb-8">
        <ul className="space-y-3">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {f.valid ? (
                <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${color === 'gold' ? 'text-amber-600' : color === 'blue' ? 'text-blue-600' : 'text-green-600'}`} />
              ) : (
                <XCircle className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
              )}
              <span className={f.valid ? 'text-gray-700' : 'text-gray-400 line-through decoration-gray-300'}>
                {f.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onClick}
        disabled={loading}
        className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-md ${btnColors[color]}`}
        style={{ fontFamily: 'Cairo, sans-serif' }}
      >
        {buttonText}
      </button>
    </motion.div>
  );
}