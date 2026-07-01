import { useState } from 'react';
import { ArrowRight, Star, Package, Wrench, LayoutGrid, Paintbrush, Gem, Home as HomeIcon, Lightbulb, Droplet, Sparkles, Truck, Building2 } from 'lucide-react';
import { ServiceSEOHead } from '../SEOHead';
import { GlassCard } from './GlassCard';
import { useTranslation } from '../../contexts/LanguageContext';
import { Icon3D, SERVICE_ICONS } from '../ui/Icon3D';

interface ServiceDetailBuildingMaterialsProps {
  onBack: () => void;
  onNavigate?: (tab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers') => void;
  onOpenSearch?: (category?: string) => void;
  onOpenDrawer?: () => void;
}

export function ServiceDetailBuildingMaterials({ onBack, onNavigate, onOpenSearch, onOpenDrawer }: ServiceDetailBuildingMaterialsProps) {
  const { t, dir } = useTranslation('services');
  const [activeTab, setActiveTab] = useState<'details' | 'providers' | 'reviews'>('details');

  const seoData = {
    title: t('materialsServices.seoTitle'),
    description: t('materialsServices.seoDesc'),
    serviceId: 'SRV-MAT-007',
    serviceName: t('materialsServices.title'),
    serviceType: t('materialsServices.description'),
    priceRange: '10 - 500000 AED',
    rating: 4.6,
    reviewCount: 980,
    imageUrl: 'https://images.unsplash.com/photo-1597476877537-7a215c0c7b73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    keywords: ['building materials', 'cement', 'steel', 'blocks', 'sand', 'Biet Alreef'],
    faqs: [{ question: t('materialsServices.faqQuestion'), answer: t('materialsServices.faqAnswer') }],
    providerCount: 120,
    projectCount: 4500
  };

  const serviceItems = [
    { icon: Building2, theme: 'brown', title: t('materialsServices.cement'), description: t('materialsServices.cementDesc') },
    { icon: Wrench, theme: 'red', title: t('materialsServices.steel'), description: t('materialsServices.steelDesc') },
    { icon: Package, theme: 'orange', title: t('materialsServices.blocks'), description: t('materialsServices.blocksDesc') },
    { icon: Building2, theme: 'amber', title: t('materialsServices.sandGravel'), description: t('materialsServices.sandGravelDesc') },
    { icon: LayoutGrid, theme: 'teal', title: t('materialsServices.tiles'), description: t('materialsServices.tilesDesc') },
    { icon: Paintbrush, theme: 'pink', title: t('materialsServices.paint'), description: t('materialsServices.paintDesc') },
    { icon: Gem, theme: 'violet', title: t('materialsServices.marble'), description: t('materialsServices.marbleDesc') },
    { icon: HomeIcon, theme: 'indigo', title: t('materialsServices.doors'), description: t('materialsServices.doorsDesc') },
    { icon: Lightbulb, theme: 'amber', title: t('materialsServices.electrical'), description: t('materialsServices.electricalDesc') },
    { icon: Droplet, theme: 'blue', title: t('materialsServices.plumbing'), description: t('materialsServices.plumbingDesc') },
    { icon: Sparkles, theme: 'cyan', title: t('materialsServices.insulation'), description: t('materialsServices.insulationDesc') },
    { icon: Truck, theme: 'violet', title: t('materialsServices.freeDelivery'), description: t('materialsServices.freeDeliveryDesc') },
  ];

  const heroIcon = SERVICE_ICONS['building-materials'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir={dir}>
      <ServiceSEOHead {...seoData} />
      <div className="container mx-auto px-4 pt-4">
        <button onClick={onBack} className="inline-flex items-center gap-2 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
          <ArrowRight className="w-5 h-5" /><span>{t('backToHome')}</span>
        </button>
      </div>
      <div className="bg-gradient-to-l from-[#E67E22]/10 to-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('materialsServices.title')}</h1>
              <p className="text-gray-600 leading-relaxed max-w-3xl" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('materialsServices.description')}</p>
            </div>
            {heroIcon && (
              <Icon3D icon={heroIcon.icon} theme={heroIcon.theme} size="xl" hoverable={false} />
            )}
          </div>
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#C8A86A] text-[#C8A86A]" />)}</div>
              <span className="text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>4.6</span>
              <span className="text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>(980 {t('reviewsCount')})</span>
            </div>
            <div className="bg-[#E67E22] text-white px-4 py-1 rounded-full text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>{t('certified')}</div>
          </div>
          <button className="bg-gradient-to-l from-[#E67E22] to-[#D35400] text-white px-8 py-3 rounded-full hover:shadow-lg transition-shadow" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('shopNow')}</button>
        </div>
      </div>
      <div className="bg-white border-b border-[#F5EEE1] sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-0">
            {(['details', 'providers', 'reviews'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 transition-all ${activeTab === tab ? 'text-[#E67E22] border-b-4 border-[#E67E22]' : 'text-gray-500'}`} style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {t(`tabs.${tab}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'details' && (
          <div>
            <h2 className="text-2xl text-[#1F3D2B] mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('materialsServices.servicesTitle')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {serviceItems.map((item, idx) => <GlassCard key={idx} icon={item.icon} theme={item.theme} title={item.title} description={item.description} />)}
            </div>
          </div>
        )}
        {activeTab === 'providers' && <div className="bg-white rounded-xl p-6 shadow-sm text-center"><p className="text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('materialsServices.providersCount')}</p></div>}
        {activeTab === 'reviews' && <div className="bg-white rounded-xl p-6 shadow-sm text-center"><div className="text-5xl text-[#E67E22] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>4.6</div><p className="text-sm text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('materialsServices.reviewsCount')}</p></div>}
      </div>
      <div className="bg-gradient-to-l from-[#E67E22] to-[#D35400] py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-white mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('materialsServices.ctaTitle')}</h2>
          <p className="text-white/90 mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('materialsServices.ctaSubtitle')}</p>
          <button className="bg-white text-[#E67E22] px-10 py-4 rounded-full hover:shadow-2xl transition-shadow" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('shopNow')}</button>
        </div>
      </div>
    </div>
  );
}