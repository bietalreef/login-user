import { useState } from 'react';
import { User, ShieldCheck, Award, UserPlus, Building2, Zap, Check } from 'lucide-react';
// Crown not available — using Award as alias
const Crown = Award;
import { useTranslation } from '../../contexts/LanguageContext';

export function PackagesSection() {
  const [activeTab, setActiveTab] = useState<'client' | 'provider'>('client');
  const { t } = useTranslation('home');

  const clientPackages = [
    {
      id: 'guest',
      titleKey: 'packageGuest.title',
      subtitleKey: 'packageGuest.subtitle',
      featuresKey: 'packageGuest.features',
      btnTextKey: 'packageGuest.btnText',
      icon: UserPlus,
      color: 'bg-gray-100',
      textColor: 'text-gray-600',
      borderColor: undefined as string | undefined,
    },
    {
      id: 'verified',
      titleKey: 'packageVerified.title',
      subtitleKey: 'packageVerified.subtitle',
      featuresKey: 'packageVerified.features',
      btnTextKey: 'packageVerified.btnText',
      icon: ShieldCheck,
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      id: 'vip',
      titleKey: 'packageVIP.title',
      subtitleKey: 'packageVIP.subtitle',
      featuresKey: 'packageVIP.features',
      btnTextKey: 'packageVIP.btnText',
      icon: Crown,
      color: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200',
    }
  ];

  const providerPackages = [
    {
      id: 'freelancer',
      titleKey: 'packageFreelancer.title',
      subtitleKey: 'packageFreelancer.subtitle',
      featuresKey: 'packageFreelancer.features',
      btnTextKey: 'packageFreelancer.btnText',
      icon: User,
      color: 'bg-gray-100',
      textColor: 'text-gray-600',
      borderColor: undefined as string | undefined,
    },
    {
      id: 'pro',
      titleKey: 'packagePro.title',
      subtitleKey: 'packagePro.subtitle',
      featuresKey: 'packagePro.features',
      btnTextKey: 'packagePro.btnText',
      icon: Zap,
      color: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      id: 'enterprise',
      titleKey: 'packageEnterprise.title',
      subtitleKey: 'packageEnterprise.subtitle',
      featuresKey: 'packageEnterprise.features',
      btnTextKey: 'packageEnterprise.btnText',
      icon: Building2,
      color: 'bg-slate-50',
      textColor: 'text-slate-700',
      borderColor: 'border-slate-200',
    }
  ];

  const currentPackages = activeTab === 'client' ? clientPackages : providerPackages;

  return (
    <div className="py-8 px-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('chooseYourPlan')}</h2>
        <p className="text-gray-500 text-sm">{t('packagesSubtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
          <button 
            onClick={() => setActiveTab('client')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'client' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t('clientJourney')}
          </button>
          <button 
            onClick={() => setActiveTab('provider')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'provider' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t('providerJourney')}
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {currentPackages.map((pkg) => {
          const Icon = pkg.icon;
          const features = t(pkg.featuresKey).split(',');
          return (
            <div 
              key={pkg.id} 
              className={`relative rounded-2xl p-6 border-2 transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col ${pkg.borderColor || 'border-transparent'} ${pkg.color}`}
            >
              <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-white shadow-sm ${pkg.textColor}`}>
                <Icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t(pkg.titleKey)}</h3>
              <p className="text-xs text-gray-500 font-bold mb-4">{t(pkg.subtitleKey)}</p>
              
              <div className="flex-1 space-y-3 mb-6">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className={`mt-1 p-0.5 rounded-full ${pkg.textColor} bg-white/50`}>
                       <Check className="w-3 h-3" />
                    </div>
                    <span>{feat.trim()}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 rounded-xl font-bold bg-white shadow-sm hover:shadow-md transition-all border border-transparent hover:border-gray-200 ${pkg.textColor}`}>
                {t(pkg.btnTextKey)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
