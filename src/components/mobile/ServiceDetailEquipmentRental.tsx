import { useState } from 'react';
import { ArrowRight, Star, Truck, Building2, Zap, Settings, Wrench, Lightbulb, Droplet, Clock, Package } from 'lucide-react';
import { ServiceSEOHead } from '../SEOHead';
import { GlassCard } from './GlassCard';
import { useTranslation } from '../../contexts/LanguageContext';
import { Icon3D, SERVICE_ICONS } from '../ui/Icon3D';

interface ServiceDetailEquipmentRentalProps {
  onBack: () => void;
  onNavigate?: (tab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers') => void;
  onOpenSearch?: (category?: string) => void;
  onOpenDrawer?: () => void;
}

export function ServiceDetailEquipmentRental({ onBack, onNavigate, onOpenSearch, onOpenDrawer }: ServiceDetailEquipmentRentalProps) {
  const { t, dir } = useTranslation('services');
  const [activeTab, setActiveTab] = useState<'details' | 'providers' | 'reviews'>('details');

  const seoData = {
    title: t('equipmentServices.seoTitle'),
    description: t('equipmentServices.seoDesc'),
    serviceId: 'SRV-EQUIP-006',
    serviceName: t('equipmentServices.title'),
    serviceType: t('equipmentServices.description'),
    priceRange: '100 - 10000 AED/day',
    rating: 4.7,
    reviewCount: 650,
    imageUrl: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    keywords: ['equipment rental', 'construction equipment', 'Biet Alreef'],
    faqs: [{ question: t('equipmentServices.faqQuestion'), answer: t('equipmentServices.faqAnswer') }],
    providerCount: 35,
    projectCount: 1200
  };

  const serviceItems = [
    { icon: Building2, theme: 'orange', title: t('equipmentServices.cranes'), description: t('equipmentServices.cranesDesc') },
    { icon: Truck, theme: 'gold', title: t('equipmentServices.heavyEquipment'), description: t('equipmentServices.heavyEquipmentDesc') },
    { icon: Zap, theme: 'amber', title: t('equipmentServices.generators'), description: t('equipmentServices.generatorsDesc') },
    { icon: Settings, theme: 'teal', title: t('equipmentServices.mixers'), description: t('equipmentServices.mixersDesc') },
    { icon: Building2, theme: 'red', title: t('equipmentServices.scaffolding'), description: t('equipmentServices.scaffoldingDesc') },
    { icon: Wrench, theme: 'indigo', title: t('equipmentServices.powerTools'), description: t('equipmentServices.powerToolsDesc') },
    { icon: Settings, theme: 'cyan', title: t('equipmentServices.compressors'), description: t('equipmentServices.compressorsDesc') },
    { icon: Lightbulb, theme: 'amber', title: t('equipmentServices.lighting'), description: t('equipmentServices.lightingDesc') },
    { icon: Droplet, theme: 'blue', title: t('equipmentServices.pumps'), description: t('equipmentServices.pumpsDesc') },
    { icon: Wrench, theme: 'brown', title: t('equipmentServices.welding'), description: t('equipmentServices.weldingDesc') },
    { icon: Clock, theme: 'purple', title: t('equipmentServices.dailyWeekly'), description: t('equipmentServices.dailyWeeklyDesc') },
    { icon: Truck, theme: 'blue', title: t('equipmentServices.freeDelivery'), description: t('equipmentServices.freeDeliveryDesc') },
  ];

  const heroIcon = SERVICE_ICONS['equipment-rental'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir={dir}>
      <ServiceSEOHead {...seoData} />
      <div className="container mx-auto px-4 pt-4">
        <button onClick={onBack} className="inline-flex items-center gap-2 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
          <ArrowRight className="w-5 h-5" /><span>{t('backToHome')}</span>
        </button>
      </div>
      <div className="bg-gradient-to-l from-[#F39C12]/10 to-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('equipmentServices.title')}</h1>
              <p className="text-gray-600 leading-relaxed max-w-3xl" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('equipmentServices.description')}</p>
            </div>
            {heroIcon && (
              <Icon3D icon={heroIcon.icon} theme={heroIcon.theme} size="xl" hoverable={false} />
            )}
          </div>
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#C8A86A] text-[#C8A86A]" />)}</div>
              <span className="text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>4.7</span>
              <span className="text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>(650 {t('reviewsCount')})</span>
            </div>
            <div className="bg-[#F39C12] text-white px-4 py-1 rounded-full text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>{t('certified')}</div>
          </div>
          <button className="bg-gradient-to-l from-[#F39C12] to-[#E67E22] text-white px-8 py-3 rounded-full hover:shadow-lg transition-shadow" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('rentNow')}</button>
        </div>
      </div>
      <div className="bg-white border-b border-[#F5EEE1] sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-0">
            {(['details', 'providers', 'reviews'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 transition-all ${activeTab === tab ? 'text-[#F39C12] border-b-4 border-[#F39C12]' : 'text-gray-500'}`} style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {t(`tabs.${tab}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'details' && (
          <div>
            <h2 className="text-2xl text-[#1F3D2B] mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('equipmentServices.servicesTitle')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {serviceItems.map((item, idx) => <GlassCard key={idx} icon={item.icon} theme={item.theme} title={item.title} description={item.description} />)}
            </div>
          </div>
        )}
        {activeTab === 'providers' && <div className="bg-white rounded-xl p-6 shadow-sm text-center"><p className="text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('equipmentServices.providersCount')}</p></div>}
        {activeTab === 'reviews' && <div className="bg-white rounded-xl p-6 shadow-sm text-center"><div className="text-5xl text-[#F39C12] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>4.7</div><p className="text-sm text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('equipmentServices.reviewsCount')}</p></div>}
      </div>
      <div className="bg-gradient-to-l from-[#F39C12] to-[#E67E22] py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-white mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('equipmentServices.ctaTitle')}</h2>
          <p className="text-white/90 mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('equipmentServices.ctaSubtitle')}</p>
          <button className="bg-white text-[#F39C12] px-10 py-4 rounded-full hover:shadow-2xl transition-shadow" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('rentNow')}</button>
        </div>
      </div>
    </div>
  );
}