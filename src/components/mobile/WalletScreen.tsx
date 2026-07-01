import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coins, ArrowDownCircle, ArrowUpCircle, Clock,
  Sparkles, Zap, Award, Gift, RefreshCw, TrendingUp, Wrench, ShieldCheck,
  Eye, History, ShoppingCart, Wallet, BarChart3, AlertTriangle
} from 'lucide-react';
// Crown not available — using Award as alias
const Crown = Award;
import { useWallet } from '../../contexts/WalletContext';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../../contexts/LanguageContext';
import { Icon3D } from '../ui/Icon3D';

type WalletTab = 'overview' | 'history' | 'buy';

interface CoinPackage {
  id: string;
  coins: number;
  priceAr: string;
  priceEn: string;
  bonus: number;
  popular?: boolean;
  icon: any;
  gradient: string;
}

export function WalletScreen() {
  const { balance, isLoading, ledger, ledgerLoading, fetchBalance, fetchLedger, topUpCoins, spendCoins } = useWallet();
  const [activeTab, setActiveTab] = useState<WalletTab>('overview');
  const [buyingPackage, setBuyingPackage] = useState<string | null>(null);
  const { language } = useLanguage();
  const isEn = language === 'en';
  const font = 'Cairo, sans-serif';
  const fw600: React.CSSProperties = { fontFamily: 'Cairo, sans-serif', fontWeight: 600 };
  const fw700: React.CSSProperties = { fontFamily: 'Cairo, sans-serif', fontWeight: 700 };
  const fw800: React.CSSProperties = { fontFamily: 'Cairo, sans-serif', fontWeight: 800 };

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  const coinPackages: CoinPackage[] = [
    { id: 'starter', coins: 50, priceAr: '25 د.إ', priceEn: '25 AED', bonus: 0, icon: Zap, gradient: 'from-blue-400 to-blue-600' },
    { id: 'basic', coins: 120, priceAr: '50 د.إ', priceEn: '50 AED', bonus: 20, icon: Sparkles, gradient: 'from-emerald-400 to-emerald-600' },
    { id: 'popular', coins: 300, priceAr: '100 د.إ', priceEn: '100 AED', bonus: 50, popular: true, icon: Crown, gradient: 'from-amber-400 to-orange-500' },
    { id: 'pro', coins: 700, priceAr: '200 د.إ', priceEn: '200 AED', bonus: 150, icon: Gift, gradient: 'from-purple-400 to-purple-600' },
  ];

  const handleBuyPackage = async (pkg: CoinPackage) => {
    setBuyingPackage(pkg.id);
    try {
      const totalCoins = pkg.coins + pkg.bonus;
      const reason = isEn ? `Purchase ${pkg.coins} coins package` : `شراء باقة ${pkg.coins} كوينز`;
      const result = await topUpCoins(totalCoins, reason);
      if (result.success) {
        toast.success(
          isEn ? `${totalCoins} coins added successfully!` : `تم شحن ${totalCoins} كوينز بنجاح!`,
          { description: isEn ? `New balance: ${balance + totalCoins} coins` : `الرصيد الجديد: ${balance + totalCoins} كوينز` }
        );
        fetchLedger();
      } else {
        toast.error(result.error || (isEn ? 'Failed to purchase package' : 'فشل في شراء الباقة'));
      }
    } catch {
      toast.error(isEn ? 'An error occurred during purchase' : 'حدث خطأ أثناء الشراء');
    } finally {
      setBuyingPackage(null);
    }
  };

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'earn': return <ArrowDownCircle className="w-5 h-5 text-emerald-500" />;
      case 'spend': return <ArrowUpCircle className="w-5 h-5 text-red-500" />;
      case 'adjust': return <RefreshCw className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getEntryColor = (type: string) => {
    switch (type) {
      case 'earn': return 'text-emerald-600';
      case 'spend': return 'text-red-500';
      case 'adjust': return 'text-blue-600';
      default: return 'text-gray-500';
    }
  };

  const getEntryLabel = (type: string) => {
    switch (type) {
      case 'earn': return isEn ? 'Deposit' : 'إيداع';
      case 'spend': return isEn ? 'Deduction' : 'خصم';
      case 'adjust': return isEn ? 'Adjustment' : 'تعديل';
      default: return type;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (isEn) {
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      } else {
        if (diffMins < 1) return 'الآن';
        if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
        if (diffHours < 24) return `منذ ${diffHours} ساعة`;
        if (diffDays < 7) return `منذ ${diffDays} يوم`;
        return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
      }
    } catch {
      return '';
    }
  };

  const tabsData: { id: WalletTab; labelAr: string; labelEn: string; icon: any }[] = [
    { id: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview', icon: Eye },
    { id: 'history', labelAr: 'السجل', labelEn: 'History', icon: History },
    { id: 'buy', labelAr: 'شراء كوينز', labelEn: 'Buy Coins', icon: ShoppingCart },
  ];

  // Stats
  const totalEarned = ledger.filter(e => e.type === 'earn' || e.type === 'adjust').reduce((sum, e) => sum + Math.abs(e.amount), 0);
  const totalSpent = ledger.filter(e => e.type === 'spend').reduce((sum, e) => sum + Math.abs(e.amount), 0);

  // Tool prices data
  const toolPrices = [
    { nameAr: 'حاسبة البناء', nameEn: 'Construction Calc', cost: 5 },
    { nameAr: 'تصميم الغرف', nameEn: 'Room Design', cost: 15 },
    { nameAr: 'التحليل المالي', nameEn: 'Financial Analysis', cost: 10 },
    { nameAr: 'مخطط المشروع', nameEn: 'Project Planner', cost: 20 },
    { nameAr: 'مقارنة الأسعار', nameEn: 'Price Compare', cost: 5 },
    { nameAr: 'تصميم الواجهات', nameEn: 'Facade Design', cost: 25 },
  ];

  // How-to steps
  const howToSteps = [
    { step: '1', icon: Coins, theme: 'gold', titleAr: 'اشحن رصيدك', titleEn: 'Top Up', descAr: 'اختر باقة كوينز وادفع', descEn: 'Choose a coin package and pay' },
    { step: '2', icon: Wrench, theme: 'teal', titleAr: 'استخدم الأدوات', titleEn: 'Use Tools', descAr: 'كل أداة لها تكلفة محددة بالكوينز', descEn: 'Each tool has a specific coin cost' },
    { step: '3', icon: BarChart3, theme: 'blue', titleAr: 'تابع رصيدك', titleEn: 'Track Balance', descAr: 'سجل كامل لجميع العمليات', descEn: 'Full record of all transactions' },
  ];

  return (
    <div className="min-h-screen bg-background pb-8" dir="rtl">
      {/* Hero Balance Section */}
      <div className="bg-background px-6 pt-8 pb-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#C8A86A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#D4AF37]/8 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Icon3D icon={Wallet} theme="gold" size="sm" hoverable={false} />
              <h1 className="text-[#1F3D2B] text-2xl font-extrabold" style={fw800}>
                {isEn ? 'Dar Wallet' : 'محفظة الدار'}
              </h1>
            </div>
            <button
              onClick={() => { fetchBalance(); fetchLedger(); }}
              className="p-2 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm border border-[#E6DCC8]"
              title={isEn ? 'Refresh' : 'تحديث'}
            >
              <RefreshCw className={`w-5 h-5 text-[#C8A86A] ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Balance Display */}
          <div className="text-center py-4 bg-white rounded-3xl shadow-sm border border-[#E6DCC8] mb-4">
            <p className="text-[#1F3D2B]/50 text-base font-semibold mb-1" style={fw600}>
              {isEn ? 'Your Balance' : 'رصيدك الحالي'}
            </p>
            <motion.div
              key={balance}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="animate-pulse bg-[#E6DCC8] h-14 w-40 rounded-2xl" />
              ) : (
                <>
                  <span className="text-5xl md:text-6xl text-[#1F3D2B] font-black" style={{ fontFamily: font }}>
                    {balance.toLocaleString(isEn ? 'en-US' : 'ar-EG')}
                  </span>
                  <Coins className="w-8 h-8 text-[#D4AF37]" />
                </>
              )}
            </motion.div>
            <p className="text-[#C8A86A] text-sm mt-2 font-bold" style={fw700}>
              {isEn ? 'Dar Coins' : 'كوينز الدار'}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-[#E6DCC8]">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-emerald-700 text-sm" style={fw700}>
                  {isEn ? 'Total Deposited' : 'إجمالي الإيداع'}
                </span>
              </div>
              <p className="text-[#1F3D2B] text-2xl" style={fw800}>
                {totalEarned.toLocaleString(isEn ? 'en-US' : 'ar-EG')}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-[#E6DCC8]">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-orange-700 text-sm" style={fw700}>
                  {isEn ? 'Total Used' : 'إجمالي الاستخدام'}
                </span>
              </div>
              <p className="text-[#1F3D2B] text-2xl" style={fw800}>
                {totalSpent.toLocaleString(isEn ? 'en-US' : 'ar-EG')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs with Icons */}
      <div className="px-4 -mt-5 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-1.5 flex gap-1 border border-[#E6DCC8]">
          {tabsData.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-l from-[#C8A86A] to-[#A07D35] text-white shadow-md'
                    : 'text-[#1F3D2B]/60 hover:bg-[#F5EEE1]'
                }`}
                style={fw700}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-white/20' : 'bg-[#C8A86A]/15'
                }`}>
                  <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#C8A86A]'}`} />
                </div>
                {isEn ? tab.labelEn : tab.labelAr}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 mt-4 relative z-10">
        <AnimatePresence mode="wait">
          {/* Overview */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* What are Dar Coins */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Icon3D icon={Coins} theme="gold" size="sm" hoverable={false} />
                  <h3 className="text-[#1F3D2B] text-xl" style={fw800}>
                    {isEn ? 'What are Dar Coins?' : 'ما هي كوينز الدار؟'}
                  </h3>
                </div>
                <p className="text-[#1F3D2B]/70 text-base leading-relaxed" style={fw600}>
                  {isEn
                    ? 'Dar Coins are your prepaid balance for using AI tools in Beit Al Reef. Top up your balance and use tools easily — construction calculators, room design, financial analysis and more.'
                    : 'كوينز الدار هي رصيدك المسبق الدفع لاستخدام أدوات الذكاء الاصطناعي في بيت الريف. اشحن رصيدك واستخدم الأدوات بسهولة — حاسبات البناء، تصميم الغرف، التحليل المالي والمزيد.'}
                </p>
              </div>

              {/* How to use */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="text-[#1F3D2B] text-lg mb-4" style={fw800}>
                  {isEn ? 'How to use Coins?' : 'كيف تستخدم الكوينز؟'}
                </h3>
                <div className="space-y-3">
                  {howToSteps.map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <Icon3D icon={item.icon} theme={item.theme} size="sm" hoverable={false} />
                      <div className="flex-1">
                        <p className="text-[#1F3D2B] text-base" style={fw700}>
                          {isEn ? item.titleEn : item.titleAr}
                        </p>
                        <p className="text-[#1F3D2B]/50 text-sm" style={fw600}>
                          {isEn ? item.descEn : item.descAr}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tool Prices */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="text-[#1F3D2B] text-lg mb-4" style={fw800}>
                  {isEn ? 'Tool Prices' : 'أسعار الأدوات'}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {toolPrices.map((tool, i) => (
                    <div key={i} className="bg-[#F5EEE1]/50 rounded-xl p-3 flex items-center justify-between">
                      <span className="text-[#1F3D2B] text-sm" style={fw700}>
                        {isEn ? tool.nameEn : tool.nameAr}
                      </span>
                      <span className="text-[#C8A86A] text-sm flex items-center gap-1" style={fw800}>
                        {tool.cost} <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Note */}
              <div className="bg-emerald-50 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-800 text-base" style={fw700}>
                    {isEn ? 'Secure Wallet' : 'محفظة آمنة'}
                  </p>
                  <p className="text-emerald-600 text-sm" style={fw600}>
                    {isEn
                      ? 'All transactions are protected and encrypted. Balance can only be modified through the server.'
                      : 'جميع العمليات محمية ومشفرة. لا يمكن التعديل على الرصيد إلا من خلال السيرفر.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* History */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {ledgerLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/3" />
                          <div className="h-3 bg-gray-100 rounded w-2/3" />
                        </div>
                        <div className="h-5 bg-gray-200 rounded w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : ledger.length === 0 ? (
                <div className="text-center py-16">
                  <Clock className="w-16 h-16 text-[#1F3D2B]/10 mx-auto mb-4" />
                  <p className="text-[#1F3D2B]/40 text-lg" style={fw700}>
                    {isEn ? 'No transactions yet' : 'لا توجد عمليات بعد'}
                  </p>
                  <p className="text-[#1F3D2B]/30 text-base mt-1" style={fw600}>
                    {isEn ? 'Top up your balance to start using tools' : 'ابدأ بشحن رصيدك لاستخدام الأدوات'}
                  </p>
                </div>
              ) : (
                ledger.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        entry.type === 'earn' ? 'bg-emerald-50' :
                        entry.type === 'spend' ? 'bg-red-50' : 'bg-blue-50'
                      }`}>
                        {getEntryIcon(entry.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm px-2.5 py-0.5 rounded-lg ${
                            entry.type === 'earn' ? 'bg-emerald-100 text-emerald-700' :
                            entry.type === 'spend' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'
                          }`} style={fw700}>
                            {getEntryLabel(entry.type)}
                          </span>
                          <span className="text-[#1F3D2B]/40 text-sm" style={fw600}>
                            {formatDate(entry.created_at)}
                          </span>
                        </div>
                        <p className="text-[#1F3D2B]/70 text-base mt-1 truncate" style={fw600}>
                          {entry.reason}
                        </p>
                      </div>
                      <span className={`text-xl ${getEntryColor(entry.type)}`} style={fw800}>
                        {entry.amount > 0 ? '+' : ''}{entry.amount}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Buy Coins */}
          {activeTab === 'buy' && (
            <motion.div
              key="buy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <p className="text-[#1F3D2B]/60 text-base text-center" style={fw600}>
                {isEn ? 'Choose a package and top up your balance' : 'اختر الباقة المناسبة واشحن رصيدك'}
              </p>

              <div className="space-y-3">
                {coinPackages.map((pkg) => {
                  const Icon = pkg.icon;
                  return (
                    <motion.button
                      key={pkg.id}
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => handleBuyPackage(pkg)}
                      disabled={buyingPackage === pkg.id}
                      className={`relative w-full bg-white rounded-3xl p-4 border-2 transition-all text-right group ${
                        pkg.popular 
                          ? 'border-[#C8A86A] shadow-lg' 
                          : 'border-[#E6DCC8] hover:border-[#C8A86A]/40 shadow-sm'
                      } ${buyingPackage === pkg.id ? 'opacity-50' : ''}`}
                    >
                      {/* Glow effect on active/hover */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-l from-[#C8A86A]/0 to-[#C8A86A]/0 group-hover:from-[#C8A86A]/5 group-hover:to-[#C8A86A]/10 group-active:from-[#C8A86A]/10 group-active:to-[#C8A86A]/20 transition-all duration-300" />
                      
                      {pkg.popular && (
                        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 bg-gradient-to-l from-[#C8A86A] to-[#A07D35] text-white text-xs px-3 py-0.5 rounded-b-xl z-10" style={fw700}>
                          {isEn ? 'Most Popular' : 'الأكثر طلبا'}
                        </div>
                      )}
                      
                      <div className="relative flex items-center gap-3">
                        {/* Icon */}
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-2xl md:text-3xl font-black text-[#1F3D2B] truncate" style={fw800}>
                            {pkg.coins} <span className="text-xs md:text-sm text-[#1F3D2B]/40" style={fw700}>{isEn ? 'Coins' : 'كوينز'}</span>
                          </p>
                          {pkg.bonus > 0 && (
                            <p className="text-emerald-600 text-xs md:text-sm mt-0.5 flex items-center gap-1" style={fw700}>
                              + {pkg.bonus} {isEn ? 'free' : 'مجانا'} <Gift className="w-3.5 h-3.5 text-emerald-500" />
                            </p>
                          )}
                        </div>
                        
                        {/* Price Button */}
                        <div className="flex-shrink-0">
                          <div className="bg-gradient-to-l from-[#C8A86A] to-[#A07D35] text-white text-sm md:text-base py-2.5 px-4 md:px-5 rounded-2xl text-center shadow-md group-active:shadow-[0_0_20px_rgba(200,168,106,0.5)] transition-shadow whitespace-nowrap" style={fw800}>
                            {buyingPackage === pkg.id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto" />
                            ) : (
                              isEn ? pkg.priceEn : pkg.priceAr
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Note */}
              <div className="bg-amber-50 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-700 text-sm" style={fw600}>
                  {isEn
                    ? 'Currently coins are added directly for testing. Payment gateway integration coming soon.'
                    : 'حاليا يتم الشحن مباشرة للتجربة. ربط بوابة الدفع قريبا.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}