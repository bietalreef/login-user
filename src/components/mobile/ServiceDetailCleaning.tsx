import { useState } from 'react';
import { ArrowRight, Star, Sparkles, Home as HomeIcon, Building2, Gem, Droplet, Clock, CheckCircle, Shield } from 'lucide-react';
import { ServiceSEOHead } from '../SEOHead';
import { GlassCard } from './GlassCard';
import { useTranslation } from '../../contexts/LanguageContext';
import { ProvidersTabContent } from './ProviderProfileCard';
import { PlatformShowcaseBanner } from './PlatformShowcaseBanner';
import { Icon3D, SERVICE_ICONS } from '../ui/Icon3D';

interface ServiceDetailCleaningProps {
  onBack: () => void;
  onNavigate?: (tab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers') => void;
  onOpenSearch?: (category?: string) => void;
  onOpenDrawer?: () => void;
}

export function ServiceDetailCleaning({ onBack, onNavigate, onOpenSearch, onOpenDrawer }: ServiceDetailCleaningProps) {
  const { t, dir } = useTranslation('services');
  const [activeTab, setActiveTab] = useState<'details' | 'providers' | 'reviews'>('details');

  const seoData = {
    title: t('cleaningServicesPage.seoTitle'),
    description: t('cleaningServicesPage.seoDescription'),
    serviceId: 'SRV-CLEAN-009',
    serviceName: t('cleaning'),
    serviceType: t('cleaningServices.title'),
    priceRange: t('cleaningServicesPage.priceRange'),
    rating: 4.9,
    reviewCount: 2450,
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    keywords: dir === 'rtl' ? t('seoKeywords.cleaningAr' as any) : t('seoKeywords.cleaningEn' as any),
    faqs: [{ 
      question: t('cleaningServicesPage.faqQuestion'), 
      answer: t('cleaningServicesPage.faqAnswer')
    }],
    providerCount: 135,
    projectCount: 8900
  };

  const serviceItems = [
    { icon: HomeIcon, theme: 'violet', title: t('cleaningServices.items.homes'), description: t('cleaningServices.items.homesDesc') },
    { icon: Building2, theme: 'blue', title: t('cleaningServices.items.buildings'), description: t('cleaningServices.items.buildingsDesc') },
    { icon: Sparkles, theme: 'gold', title: t('cleaningServices.items.villas'), description: t('cleaningServices.items.villasDesc') },
    { icon: Users, theme: 'orange', title: t('cleaningServices.items.apartments'), description: t('cleaningServices.items.apartmentsDesc') },
    { icon: BedDouble, theme: 'purple', title: t('cleaningServices.items.rooms'), description: t('cleaningServices.items.roomsDesc') },
    { icon: Factory, theme: 'indigo', title: t('cleaningServices.items.warehouses'), description: t('cleaningServices.items.warehousesDesc') },
    { icon: Droplet, theme: 'cyan', title: t('cleaningServices.items.bathrooms'), description: t('cleaningServices.items.bathroomsDesc') },
    { icon: Gem, theme: 'violet', title: t('cleaningServices.items.marble'), description: t('cleaningServices.items.marbleDesc') },
    { icon: Sparkles, theme: 'pink', title: t('cleaningServices.items.periodic'), description: t('cleaningServices.items.periodicDesc') },
    { icon: Clock, theme: 'red', title: t('cleaningServices.items.available247'), description: t('cleaningServices.items.available247Desc') },
    { icon: CheckCircle, theme: 'gold', title: t('cleaningServices.items.guarantee'), description: t('cleaningServices.items.guaranteeDesc') },
  ];

  const heroIcon = SERVICE_ICONS['cleaning-services'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir={dir}>
      <ServiceSEOHead {...seoData} />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-4">
        <button 
          onClick={onBack} 
          className="inline-flex items-center gap-2 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? '' : 'rotate-180'}`} />
          <span>{t('backToHome')}</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-l from-[#3498DB]/10 to-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {t('cleaning')}
              </h1>
              <p className="text-gray-600 leading-relaxed max-w-3xl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {t('cleaningServices.description')}
              </p>
            </div>
            {heroIcon && (
              <Icon3D icon={heroIcon.icon} theme={heroIcon.theme} size="xl" hoverable={false} />
            )}
          </div>

          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#C8A86A] text-[#C8A86A]" />
                ))}
              </div>
              <span className="text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>4.9</span>
              <span className="text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>
                ({t('cleaningServicesPage.reviewsCount')})
              </span>
            </div>
            <div className="bg-[#3498DB] text-white px-4 py-1 rounded-full text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              {t('certified')}
            </div>
          </div>

          <button 
            className="bg-gradient-to-l from-[#3498DB] to-[#2980B9] text-white px-8 py-3 rounded-full hover:shadow-lg transition-shadow" 
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
          >
            {t('bookNow')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#F5EEE1] sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-0">
            {(['details', 'providers', 'reviews'] as const).map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`flex-1 py-4 transition-all ${
                  activeTab === tab ? 'text-[#3498DB] border-b-4 border-[#3498DB]' : 'text-gray-500'
                }`} 
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
              >
                {t(`tabs.${tab}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'details' && (
          <div>
            <h2 className="text-2xl text-[#1F3D2B] mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              {t('cleaningServices.availableServices')}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {serviceItems.map((item, idx) => (
                <GlassCard key={idx} icon={item.icon} theme={item.theme} title={item.title} description={item.description} />
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'providers' && (
          <ProvidersTabContent />
        )}
        
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-5xl text-[#3498DB] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              4.9
            </div>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {t('cleaningServicesPage.reviewsCount')}
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-l from-[#3498DB] to-[#2980B9] py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-white mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            {t('cleaningServices.cta.title')}
          </h2>
          <p className="text-white/90 mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {t('cleaningServices.cta.subtitle')}
          </p>
          <button 
            className="bg-white text-[#3498DB] px-10 py-4 rounded-full hover:shadow-2xl transition-shadow" 
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
          >
            {t('bookNow')}
          </button>
        </div>
      </div>
    </div>
  );
}