import { useState } from 'react';
import { ArrowRight, Star, Wrench, Hammer, Gem, Sparkles, Paintbrush, Settings, Building2, Briefcase, Zap, Box, Home as HomeIcon } from 'lucide-react';
import { ServiceSEOHead } from '../SEOHead';
import { GlassCard } from './GlassCard';
import { useTranslation } from '../../contexts/LanguageContext';
import { Icon3D, SERVICE_ICONS } from '../ui/Icon3D';

interface ServiceDetailWorkshopsProps {
  onBack: () => void;
  onNavigate?: (tab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers') => void;
  onOpenSearch?: (category?: string) => void;
}

export function ServiceDetailWorkshops({ onBack, onNavigate, onOpenSearch }: ServiceDetailWorkshopsProps) {
  const { t, dir } = useTranslation('services');
  const [activeTab, setActiveTab] = useState<'details' | 'providers' | 'reviews'>('details');

  const seoData = {
    title: t('workshopServices.seoTitle'),
    description: t('workshopServices.seoDesc'),
    serviceId: 'SRV-WORK-005',
    serviceName: t('workshopServices.title'),
    serviceType: t('workshopServices.description'),
    priceRange: '500 - 100000 AED',
    rating: 4.8,
    reviewCount: 890,
    imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    keywords: ['workshops', 'carpentry', 'metalwork', 'aluminum', 'Biet Alreef'],
    faqs: [{ question: t('workshopServices.faqQuestion'), answer: t('workshopServices.faqAnswer') }],
    providerCount: 75,
    projectCount: 1800
  };

  const serviceItems = [
    { icon: Box, theme: 'brown', title: t('workshopServices.carpentryShop'), description: t('workshopServices.carpentryShopDesc') },
    { icon: Hammer, theme: 'red', title: t('workshopServices.metalworkShop'), description: t('workshopServices.metalworkShopDesc') },
    { icon: HomeIcon, theme: 'indigo', title: t('workshopServices.aluminumShop'), description: t('workshopServices.aluminumShopDesc') },
    { icon: Gem, theme: 'violet', title: t('workshopServices.marbleShop'), description: t('workshopServices.marbleShopDesc') },
    { icon: Sparkles, theme: 'gold', title: t('workshopServices.gypsumShop'), description: t('workshopServices.gypsumShopDesc') },
    { icon: HomeIcon, theme: 'orange', title: t('workshopServices.doorsShop'), description: t('workshopServices.doorsShopDesc') },
    { icon: Paintbrush, theme: 'pink', title: t('workshopServices.paintingShop'), description: t('workshopServices.paintingShopDesc') },
    { icon: Wrench, theme: 'teal', title: t('workshopServices.mechanicShop'), description: t('workshopServices.mechanicShopDesc') },
    { icon: Settings, theme: 'violet', title: t('workshopServices.maintenanceShop'), description: t('workshopServices.maintenanceShopDesc') },
    { icon: Building2, theme: 'amber', title: t('workshopServices.constructionShop'), description: t('workshopServices.constructionShopDesc') },
    { icon: Briefcase, theme: 'purple', title: t('workshopServices.customMade'), description: t('workshopServices.customMadeDesc') },
    { icon: Zap, theme: 'cyan', title: t('workshopServices.fastService'), description: t('workshopServices.fastServiceDesc') },
  ];

  const heroIcon = SERVICE_ICONS['workshops'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir={dir}>
      <ServiceSEOHead {...seoData} />
      <div className="container mx-auto px-4 pt-4">
        <button onClick={onBack} className="inline-flex items-center gap-2 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
          <ArrowRight className="w-5 h-5" /><span>{t('backToHome')}</span>
        </button>
      </div>
      <div className="bg-gradient-to-l from-[#8E44AD]/10 to-white py-8 pt-4">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('workshopServices.title')}</h1>
              <p className="text-gray-600 leading-relaxed max-w-3xl" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('workshopServices.description')}</p>
            </div>
            {heroIcon && (
              <Icon3D icon={heroIcon.icon} theme={heroIcon.theme} size="xl" hoverable={false} />
            )}
          </div>
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#C8A86A] text-[#C8A86A]" />)}</div>
              <span className="text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>4.8</span>
              <span className="text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>(890 {t('reviewsCount')})</span>
            </div>
            <div className="bg-[#8E44AD] text-white px-4 py-1 rounded-full text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>{t('certified')}</div>
          </div>
          <button className="bg-gradient-to-l from-[#8E44AD] to-[#1F3D2B] text-white px-8 py-3 rounded-full hover:shadow-lg transition-shadow" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('requestService')}</button>
        </div>
      </div>
      <div className="bg-white border-b border-[#F5EEE1] sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-0">
            {(['details', 'providers', 'reviews'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 transition-all ${activeTab === tab ? 'text-[#8E44AD] border-b-4 border-[#8E44AD]' : 'text-gray-500'}`} style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {t(`tabs.${tab}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'details' && (
          <div>
            <h2 className="text-2xl text-[#1F3D2B] mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('workshopServices.servicesTitle')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {serviceItems.map((item, idx) => <GlassCard key={idx} icon={item.icon} theme={item.theme} title={item.title} description={item.description} />)}
            </div>
          </div>
        )}
        {activeTab === 'providers' && <div className="bg-white rounded-xl p-6 shadow-sm text-center"><p className="text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('workshopServices.providersCount')}</p></div>}
        {activeTab === 'reviews' && <div className="bg-white rounded-xl p-6 shadow-sm text-center"><div className="text-5xl text-[#8E44AD] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>4.8</div><p className="text-sm text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('workshopServices.reviewsCount')}</p></div>}
      </div>
      <div className="bg-gradient-to-l from-[#8E44AD] to-[#1F3D2B] py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-white mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('workshopServices.ctaTitle')}</h2>
          <p className="text-white/90 mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('workshopServices.ctaSubtitle')}</p>
          <button className="bg-white text-[#8E44AD] px-10 py-4 rounded-full hover:shadow-2xl transition-shadow" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('orderNow')}</button>
        </div>
      </div>
    </div>
  );
}