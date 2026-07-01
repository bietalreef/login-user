import { Gift, Percent, Tag, Clock, Zap, TrendingDown } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';
import { OffersPromoBanner, BrandPromiseBanner } from '../ui/PromoBanners';
import { SmartCTA } from '../ui/SmartCTA';
import { Icon3D } from '../ui/Icon3D';
import { Building2, FileText } from 'lucide-react';

export function OffersScreen() {
  const { t, dir, language } = useTranslation('offers');
  
  const offers = [
    {
      id: 1,
      type: t('limitedOffer'),
      icon: Zap,
      title: t('painting30Discount'),
      provider: t('paintingProvider'),
      discount: '30%',
      validUntil: language === 'ar' ? '31 ديسمبر 2025' : 'Dec 31, 2025',
      badge: t('endsingSoon'),
      color: 'from-red-500 to-orange-600',
      terms: t('paintingTerms'),
    },
    {
      id: 2,
      type: t('specialOffer'),
      icon: Percent,
      title: t('materials20Discount'),
      provider: t('materialsProvider'),
      discount: '20%',
      validUntil: language === 'ar' ? '15 يناير 2026' : 'Jan 15, 2026',
      badge: t('mostRequested'),
      color: 'from-blue-500 to-indigo-600',
      terms: t('materialsTerms'),
    },
    {
      id: 3,
      type: t('seasonalOffer'),
      icon: Tag,
      title: t('freeConsultation'),
      provider: t('consultationProvider'),
      discount: t('free'),
      validUntil: language === 'ar' ? '10 فبراير 2026' : 'Feb 10, 2026',
      badge: t('new'),
      color: 'from-[#D4AF37] to-[#B8940E]',
      terms: t('consultationTerms'),
    },
    {
      id: 4,
      type: t('exclusiveOffer'),
      icon: TrendingDown,
      title: t('equipment15Discount'),
      provider: t('equipmentProvider'),
      discount: '15%',
      validUntil: language === 'ar' ? '28 يناير 2026' : 'Jan 28, 2026',
      badge: t('exclusive'),
      color: 'from-purple-500 to-pink-600',
      terms: t('equipmentTerms'),
    },
    {
      id: 5,
      type: t('weekOffer'),
      icon: Clock,
      title: t('freeMaintenance'),
      provider: t('maintenanceProvider'),
      discount: t('free'),
      validUntil: language === 'ar' ? '5 يناير 2026' : 'Jan 5, 2026',
      badge: t('weekOfferBadge'),
      color: 'from-teal-500 to-cyan-600',
      terms: t('maintenanceTerms'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir={dir}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#C8A86A] to-[#D4B887] px-5 py-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="w-8 h-8 text-white" />
          <h1 className="text-white text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '28px' }}>
            {t('title')}
          </h1>
        </div>
        <p className="text-white/90 text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '14px' }}>
          {t('subtitle')}
        </p>
      </div>

      {/* Stats Banner */}
      <div className="px-5 -mt-4 mb-6">
        <div className="bg-white rounded-[20px] p-4 shadow-xl border-2 border-[#C8A86A]/20">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-[#4A90E2] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '24px' }}>
                12
              </p>
              <p className="text-[#1A1A1A]/60" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '12px' }}>
                {t('activeOffers')}
              </p>
            </div>
            <div>
              <p className="text-[#D4AF37] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '24px' }}>
                30%
              </p>
              <p className="text-[#1A1A1A]/60" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '12px' }}>
                {t('highestDiscount')}
              </p>
            </div>
            <div>
              <p className="text-[#C8A86A] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '24px' }}>
                3
              </p>
              <p className="text-[#1A1A1A]/60" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '12px' }}>
                {t('endsingSoon')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Offers List */}
      <div className="px-5 space-y-4">
        {offers.map((offer) => {
          const Icon = offer.icon;
          return (
            <div
              key={offer.id}
              className="bg-white rounded-[24px] overflow-hidden shadow-lg hover:shadow-xl transition-all border-2 border-[#F5EEE1] hover:border-[#C8A86A]/30 group"
            >
              {/* Header with Badge */}
              <div className={`bg-gradient-to-r ${offer.color} p-4 relative`}>
                <div className={`absolute top-3 ${dir === 'rtl' ? 'left-3' : 'right-3'} bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs`} style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  {offer.badge}
                </div>
                
                <div className="flex items-start gap-3 mt-6">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/90 mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '12px' }}>
                      {offer.type}
                    </p>
                    <h3 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '18px', lineHeight: 1.3 }}>
                      {offer.title}
                    </h3>
                  </div>
                  <div className="text-center bg-white/20 backdrop-blur-sm rounded-[12px] px-3 py-2">
                    <p className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '20px' }}>
                      {offer.discount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                {/* Provider */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-[#F5EEE1] rounded-full flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <p className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}>
                    {offer.provider}
                  </p>
                </div>

                {/* Valid Until */}
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-[#1A1A1A]/60" />
                  <p className="text-[#1A1A1A]/70" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '13px' }}>
                    {t('validUntil')}: {offer.validUntil}
                  </p>
                </div>

                {/* Terms */}
                <div className="bg-[#F5EEE1]/50 rounded-[12px] p-3 mb-4">
                  <p className="text-[#1A1A1A]/70" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '12px' }}>
                    {offer.terms}
                  </p>
                </div>

                {/* CTA Button */}
                <SmartCTA context="offer" variant="compact" isEn={language === 'en'} fullWidth showSubtext={false} />
              </div>
            </div>
          );
        })}
      </div>

      {/* OFFERS PROMO BANNER */}
      <div className="px-5 mt-6">
        <OffersPromoBanner isEn={language === 'en'} />
      </div>

      {/* Info Card */}
      <div className="px-5 mt-6">
        <div className="bg-gradient-to-br from-[#4A90E2]/10 to-[#56CCF2]/10 rounded-[20px] p-5 border-2 border-[#4A90E2]/20">
          <h4 className="text-[#1A1A1A] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
            {language === 'ar' ? 'نصيحة' : 'Tip'}
          </h4>
          <p className="text-[#1A1A1A]/70" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '13px', lineHeight: 1.7 }}>
            {language === 'ar' 
              ? 'تابع صفحة العروض بانتظام لتحصل على أفضل الصفقات. جميع العروض محدودة ومتاحة حسب الكمية.'
              : 'Check the offers page regularly to get the best deals. All offers are limited and available while stocks last.'}
          </p>
        </div>
      </div>

      {/* BRAND PROMISE */}
      <div className="px-5 mt-4 pb-4">
        <BrandPromiseBanner isEn={language === 'en'} variant="compact" />
      </div>
    </div>
  );
}