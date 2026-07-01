import { useState } from 'react';
import { ArrowRight, Star, Building2, Hammer, Shield, Wrench, FileText, Home as HomeIcon, HardHat, Zap, Clock, CheckCircle, Paintbrush } from 'lucide-react';
import { ServiceSEOHead } from '../SEOHead';
import { GlassCard } from './GlassCard';
import { useTranslation } from '../../contexts/LanguageContext';
import { Icon3D, SERVICE_ICONS } from '../ui/Icon3D';

interface ServiceDetailConstructionContractingProps {
  onBack: () => void;
  onNavigate?: (tab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers') => void;
  onOpenSearch?: (category?: string) => void;
}

export function ServiceDetailConstructionContracting({ onBack, onNavigate, onOpenSearch }: ServiceDetailConstructionContractingProps) {
  const { t, dir, language } = useTranslation('services');
  const [activeTab, setActiveTab] = useState<'details' | 'providers' | 'reviews'>('details');

  const seoData = {
    title: t('constructionServices.seoTitle'),
    description: t('constructionServices.seoDescription'),
    serviceId: 'SRV-CONTR-001',
    serviceName: t('constructionContracting'),
    serviceType: t('constructionServices.serviceType'),
    priceRange: t('constructionServices.priceRange'),
    rating: 4.8,
    reviewCount: 789,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    keywords: language === 'ar' 
      ? ["مقاولات بناء", "مقاول الإمارات", "بناء فلل", "إنشاءات", "مقاول معتمد", "بيت الريف"]
      : ["construction", "contractor UAE", "villa construction", "building", "certified contractor", "Biet Alreef"],
    faqs: [{ 
      question: t('constructionServices.faqQuestion'), 
      answer: t('constructionServices.faqAnswer')
    }],
    providerCount: 67,
    projectCount: 1234
  };

  const serviceItems = [
    { icon: Building2, theme: 'orange', title: t('constructionContracting_items.residentialVillas'), description: t('constructionContracting_items.residentialVillasDesc') },
    { icon: Building2, theme: 'blue', title: t('constructionContracting_items.commercialBuildings'), description: t('constructionContracting_items.commercialBuildingsDesc') },
    { icon: Hammer, theme: 'amber', title: t('constructionContracting_items.extensions'), description: t('constructionContracting_items.extensionsDesc') },
    { icon: Wrench, theme: 'teal', title: t('constructionContracting_items.renovations'), description: t('constructionContracting_items.renovationsDesc') },
    { icon: Shield, theme: 'violet', title: t('constructionContracting_items.structural'), description: t('constructionContracting_items.structuralDesc') },
    { icon: Shield, theme: 'cyan', title: t('constructionContracting_items.insulation'), description: t('constructionContracting_items.insulationDesc') },
    { icon: Star, theme: 'gold', title: t('constructionContracting_items.finishing'), description: t('constructionContracting_items.finishingDesc') },
    { icon: Paintbrush, theme: 'pink', title: t('constructionContracting_items.painting'), description: t('constructionContracting_items.paintingDesc') },
    { icon: Hammer, theme: 'brown', title: t('constructionContracting_items.plumbing'), description: t('constructionContracting_items.plumbingDesc') },
    { icon: FileText, theme: 'purple', title: t('constructionContracting_items.supervision'), description: t('constructionContracting_items.supervisionDesc') },
    { icon: FileText, theme: 'indigo', title: t('constructionContracting_items.permits'), description: t('constructionContracting_items.permitsDesc') },
    { icon: Shield, theme: 'gold', title: t('constructionContracting_items.warranty'), description: t('constructionContracting_items.warrantyDesc') },
    { icon: Clock, theme: 'red', title: t('constructionContracting_items.ontime'), description: t('constructionContracting_items.ontimeDesc') },
  ];

  const heroIcon = SERVICE_ICONS['construction-contracting'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir={dir}>
      <ServiceSEOHead {...seoData} />

      {/* Back Button */}
      <div className="container mx-auto px-4 pt-4">
        <button onClick={onBack} className="inline-flex items-center gap-2 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
          <ArrowRight className="w-5 h-5" /><span>{t('backToHome')}</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-l from-[#FF5722]/10 to-white py-8 pt-4">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {t('constructionContracting')}
              </h1>
              <p className="text-gray-600 leading-relaxed max-w-3xl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {t('constructionServices.description')}
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
              <span className="text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>4.8</span>
              <span className="text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>
                ({t('constructionServices.reviewsCount')})
              </span>
            </div>
            <div className="bg-[#FF5722] text-white px-4 py-1 rounded-full text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              {t('constructionServices.certified')}
            </div>
          </div>
          <button className="bg-gradient-to-l from-[#FF5722] to-[#1F3D2B] text-white px-8 py-3 rounded-full hover:shadow-lg transition-shadow" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            {t('getQuote')}
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
                  activeTab === tab ? 'text-[#FF5722] border-b-4 border-[#FF5722]' : 'text-gray-500'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
              >
                {tab === 'details' && t('tabs.details')}
                {tab === 'providers' && t('tabs.providers')}
                {tab === 'reviews' && t('tabs.reviews')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'details' && (
          <div>
            <h2 className="text-2xl text-[#1F3D2B] mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              {t('constructionServices.servicesTitle')}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {serviceItems.map((item, idx) => (
                <GlassCard
                  key={idx}
                  icon={item.icon}
                  theme={item.theme}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'providers' && (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <p className="text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {t('constructionServices.providersCount')}
            </p>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-5xl text-[#FF5722] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              4.8
            </div>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {t('constructionServices.reviewsCount')}
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-l from-[#FF5722] to-[#1F3D2B] py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-white mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            {t('constructionServices.cta.title')}
          </h2>
          <p className="text-white/90 mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {t('constructionServices.cta.subtitle')}
          </p>
          <button className="bg-white text-[#FF5722] px-10 py-4 rounded-full hover:shadow-2xl transition-shadow" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            {t('constructionServices.cta.button')}
          </button>
        </div>
      </div>
    </div>
  );
}