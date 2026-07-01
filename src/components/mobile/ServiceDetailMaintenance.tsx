import { useState } from 'react';
import { ArrowRight, Star, Wrench, Droplet, Zap, Wind, Paintbrush, Settings, Hammer, Home as HomeIcon, Clock, CheckCircle, Shield } from 'lucide-react';
import { ServiceSEOHead } from '../SEOHead';
import { GlassCard } from './GlassCard';
import { useTranslation } from '../../contexts/LanguageContext';
import { Icon3D, SERVICE_ICONS } from '../ui/Icon3D';

interface ServiceDetailMaintenanceProps {
  onBack: () => void;
  onNavigate?: (tab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers') => void;
  onOpenSearch?: (category?: string) => void;
}

export function ServiceDetailMaintenance({ onBack, onNavigate, onOpenSearch }: ServiceDetailMaintenanceProps) {
  const { t, dir } = useTranslation('services');
  const [activeTab, setActiveTab] = useState<'details' | 'providers' | 'reviews'>('details');

  const seoData = {
    title: t('maintenanceServices.title'),
    description: t('maintenanceServices.description'),
    serviceId: 'SRV-MAIN-003',
    serviceName: t('maintenanceServices.title'),
    serviceType: t('maintenanceServices.description'),
    priceRange: '200 - 50000 AED',
    rating: 4.7,
    reviewCount: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    keywords: ['maintenance', 'home maintenance', 'building maintenance', 'Biet Alreef'],
    faqs: [{ question: t('maintenanceServices.faqQuestion') || 'What are maintenance services?', answer: t('maintenanceServices.faqAnswer') || 'Complete maintenance services' }],
    providerCount: 89,
    projectCount: 3450
  };

  const serviceItems = [
    { icon: Droplet, theme: 'blue', title: t('maintenanceServices.plumbingMaintenance') || 'Plumbing Maintenance', description: t('maintenanceServices.plumbingMaintenanceDesc') || 'Leak repair and installations' },
    { icon: Zap, theme: 'amber', title: t('maintenanceServices.electricalMaintenance') || 'Electrical Maintenance', description: t('maintenanceServices.electricalMaintenanceDesc') || 'Electrical faults and installations' },
    { icon: Wind, theme: 'cyan', title: t('maintenanceServices.acMaintenance') || 'AC Maintenance', description: t('maintenanceServices.acMaintenanceDesc') || 'Cleaning and repairing AC units' },
    { icon: Paintbrush, theme: 'pink', title: t('maintenanceServices.painting') || 'Painting Works', description: t('maintenanceServices.paintingDesc') || 'Interior and exterior painting' },
    { icon: Hammer, theme: 'orange', title: t('maintenanceServices.carpentry') || 'Carpentry Works', description: t('maintenanceServices.carpentryDesc') || 'Wood maintenance' },
    { icon: Settings, theme: 'teal', title: t('maintenanceServices.generalMaintenance') || 'General Maintenance', description: t('maintenanceServices.generalMaintenanceDesc') || 'All maintenance works' },
    { icon: HomeIcon, theme: 'violet', title: t('maintenanceServices.periodic') || 'Periodic Maintenance', description: t('maintenanceServices.periodicDesc') || 'Complete maintenance contracts' },
    { icon: Zap, theme: 'red', title: t('maintenanceServices.emergency') || '24/7 Emergency Service', description: t('maintenanceServices.emergencyDesc') || 'Available 24/7' },
    { icon: CheckCircle, theme: 'cyan', title: t('maintenanceServices.inspection') || 'Complete Inspection', description: t('maintenanceServices.inspectionDesc') || 'Fault detection and diagnosis' },
    { icon: Wrench, theme: 'indigo', title: t('maintenanceServices.quickRepair') || 'Quick Repairs', description: t('maintenanceServices.quickRepairDesc') || 'Fast and guaranteed service' },
    { icon: Shield, theme: 'gold', title: t('maintenanceServices.competitive') || 'Competitive Prices', description: t('maintenanceServices.competitiveDesc') || 'Special offers and packages' },
  ];

  const heroIcon = SERVICE_ICONS['maintenance-companies'];

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
      <div className="bg-gradient-to-l from-[#D4AF37]/10 to-white py-8 pt-4">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {t('maintenanceServices.title')}
              </h1>
              <p className="text-gray-600 leading-relaxed max-w-3xl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {t('maintenanceServices.description')}
              </p>
            </div>
            {heroIcon && (
              <Icon3D icon={heroIcon.icon} theme={heroIcon.theme} size="xl" hoverable={false} />
            )}
          </div>
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#C8A86A] text-[#C8A86A]" />)}</div>
              <span className="text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>4.7</span>
              <span className="text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>(1250 {t('reviewsCount')})</span>
            </div>
            <div className="bg-[#D4AF37] text-white px-4 py-1 rounded-full text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>{t('certified')}</div>
          </div>
          <button className="bg-gradient-to-l from-[#D4AF37] to-[#1F3D2B] text-white px-8 py-3 rounded-full hover:shadow-lg transition-shadow" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            {t('requestService')}
          </button>
        </div>
      </div>

      <div className="bg-white border-b border-[#F5EEE1] sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-0">
            {(['details', 'providers', 'reviews'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 transition-all ${activeTab === tab ? 'text-[#D4AF37] border-b-4 border-[#D4AF37]' : 'text-gray-500'}`} style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {t(`tabs.${tab}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'details' && (
          <div>
            <h2 className="text-2xl text-[#1F3D2B] mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('maintenanceServices.servicesTitle') || t('maintenanceServices.title')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {serviceItems.map((item, idx) => (
                <GlassCard key={idx} icon={item.icon} theme={item.theme} title={item.title} description={item.description} />
              ))}
            </div>
          </div>
        )}
        {activeTab === 'providers' && <div className="bg-white rounded-xl p-6 shadow-sm text-center"><p className="text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>89 {t('companiesCount')}</p></div>}
        {activeTab === 'reviews' && <div className="bg-white rounded-xl p-6 shadow-sm text-center"><div className="text-5xl text-[#D4AF37] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>4.7</div><p className="text-sm text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>1250 {t('reviewsCount')}</p></div>}
      </div>

      <div className="bg-gradient-to-l from-[#D4AF37] to-[#1F3D2B] py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-white mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('maintenanceServices.ctaTitle') || t('maintenanceServices.title')}</h2>
          <p className="text-white/90 mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('maintenanceServices.ctaSubtitle') || t('maintenanceServices.description')}</p>
          <button className="bg-white text-[#D4AF37] px-10 py-4 rounded-full hover:shadow-2xl transition-shadow" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{t('bookNow')}</button>
        </div>
      </div>
    </div>
  );
}