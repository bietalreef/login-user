/**
 * SEOProductPage.tsx — صفحة المنتج/المتجر العامة
 * ════════════════════════════════════════════════════════════════════
 * Template 3/4: صفحة متجر عامة (Public Store/Product Page)
 * Route: /product/:slug
 * Design: Sandy Beige + Frosted Glass + Gold/Royal Blue accents
 * SEO: Product + Offer + AggregateRating schemas
 * Sections: Hero / Specs / Features / Reviews / Related / CTA
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router@7.1.1';
import { SEOHeader, SEOFooter } from './SEONav';
import {
  SITE_DOMAIN,
  SITE_NAME_AR,
} from '../../utils/seoConstants';
import {
  Star, Shield, Clock, Package, Truck, ChevronLeft,
  ArrowLeft, MapPin, CheckCircle, ShoppingCart,
  Phone, Tag, Home, Award, Wrench, TrendingUp,
} from 'lucide-react';

const font = 'Cairo, Tajawal, sans-serif';

// ══════════════════════════════════════════════
// SEO helpers
// ══════════════════════════════════════════════
function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function injectJsonLd(id: string, data: object) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data, null, 2);
}

// ══════════════════════════════════════════════
// Demo Product Data
// ══════════════════════════════════════════════
interface ProductData {
  slug: string;
  nameAr: string;
  nameEn: string;
  category: string;
  description: string;
  price: number;
  discountPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  availability: 'InStock' | 'PreOrder' | 'OutOfStock';
  brand: string;
  sku: string;
  delivery: string;
  warranty: string;
  image: string;
  gallery: string[];
  specs: { label: string; value: string }[];
  features: string[];
  reviews: { name: string; rating: number; comment: string; date: string }[];
}

const DEMO_PRODUCTS: Record<string, ProductData> = {
  'cement-bag-50kg': {
    slug: 'cement-bag-50kg',
    nameAr: 'كيس إسمنت بورتلاند 50 كجم — مطابق للمواصفات الإماراتية',
    nameEn: 'Portland Cement Bag 50kg — ESMA Compliant',
    category: 'مواد البناء',
    description:
      'إسمنت بورتلاند عادي وزن 50 كجم، مطابق للمواصفات الإماراتية (ESMA). مناسب لجميع أعمال الخرسانة والبناء في الإمارات. قوة تحمّل عالية، مقاوم للرطوبة، ومعتمد من أفضل المصانع المحلية. مثالي لبناء الفلل، المباني السكنية، والمشاريع التجارية.',
    price: 28,
    discountPrice: 25,
    currency: 'AED',
    rating: 4.8,
    reviewCount: 342,
    availability: 'InStock',
    brand: 'بيت الريف للمواد',
    sku: 'CEMENT-OPC-50KG-001',
    delivery: 'توصيل خلال 24-48 ساعة لجميع إمارات الدولة',
    warranty: '12 شهراً في ظروف التخزين الملائمة',
    image: 'https://images.unsplash.com/photo-1762380368593-a0d4c49af47f?w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1762380368593-a0d4c49af47f?w=600&q=80',
      'https://images.unsplash.com/photo-1762536859942-8076505f7c62?w=600&q=80',
      'https://images.unsplash.com/photo-1646505256959-db71754a5790?w=600&q=80',
    ],
    specs: [
      { label: 'الوزن', value: '50 كجم' },
      { label: 'النوع', value: 'Portland OPC 52.5' },
      { label: 'المطابقة', value: 'ESMA / BS EN 197-1' },
      { label: 'التعبئة', value: 'كيس بلاستيك مقوى' },
      { label: 'التخزين', value: 'مكان جاف بعيد عن الرطوبة' },
      { label: 'مدة الصلاحية', value: '6 أشهر من تاريخ الإنتاج' },
    ],
    features: [
      'مطابق للمواصفات الإماراتية (ESMA)',
      'قوة تحمّل عالية تصل إلى 52.5 ميجا باسكال',
      'مقاوم للرطوبة والعوامل الجوية',
      'سهل الخلط والاستخدام',
      'مناسب لجميع أنواع الخرسانة',
      'ضمان جودة من المصنع',
    ],
    reviews: [
      {
        name: 'محمد الشامسي',
        rating: 5,
        comment: 'جودة ممتازة وسعر مناسب. استخدمته في بناء فيلتي والنتيجة رائعة.',
        date: '2026-03-15',
      },
      {
        name: 'سعيد العامري',
        rating: 5,
        comment: 'إسمنت قوي ومطابق للمواصفات. التوصيل كان سريع. أنصح به.',
        date: '2026-03-10',
      },
      {
        name: 'عبدالله المرزوقي',
        rating: 4,
        comment: 'منتج جيد. استخدمته في مشروع صغير وكان ممتاز.',
        date: '2026-03-05',
      },
    ],
  },
  'marble-tile-carrara': {
    slug: 'marble-tile-carrara',
    nameAr: 'بلاط رخام كرارا إيطالي 60×60 سم — فاخر ولامع',
    nameEn: 'Carrara Italian Marble Tile 60×60cm — Premium Polished',
    category: 'الرخام والبلاط',
    description:
      'بلاط رخام كرارا إيطالي فاخر بمقاس 60×60 سم، بلمعة عالية ونقش طبيعي مميز. مثالي للأرضيات والجدران في الفلل الفاخرة والمكاتب التنفيذية. مقاوم للخدش، سهل التنظيف، ويضيف لمسة من الفخامة لأي مساحة.',
    price: 180,
    discountPrice: 160,
    currency: 'AED',
    rating: 4.9,
    reviewCount: 128,
    availability: 'InStock',
    brand: 'Carrara Premium',
    sku: 'MARBLE-CARRARA-60X60-WHT',
    delivery: 'توصيل خلال 3-5 أيام عمل',
    warranty: '10 سنوات ضد العيوب المصنعية',
    image: 'https://images.unsplash.com/photo-1767554261805-95185e9ecf87?w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1767554261805-95185e9ecf87?w=600&q=80',
      'https://images.unsplash.com/photo-1649663724528-3bd2ce98b6e3?w=600&q=80',
    ],
    specs: [
      { label: 'المقاس', value: '60×60 سم' },
      { label: 'المادة', value: 'رخام كرارا إيطالي' },
      { label: 'النوع', value: 'Polished (لامع)' },
      { label: 'اللون', value: 'أبيض مع عروق رمادية' },
      { label: 'السماكة', value: '10 ملم' },
      { label: 'المقاومة', value: 'عالية للخدش والبقع' },
    ],
    features: [
      'رخام إيطالي أصلي 100%',
      'لمعة عالية تدوم طويلاً',
      'نقش طبيعي فريد لكل بلاطة',
      'مقاوم للخدش والبقع',
      'سهل التنظيف والصيانة',
      'مناسب للأرضيات والجدران',
    ],
    reviews: [
      {
        name: 'فاطمة النعيمي',
        rating: 5,
        comment: 'رخام راقي جداً! غيّر شكل البيت بالكامل. يستحق السعر.',
        date: '2026-03-12',
      },
      {
        name: 'خالد البلوشي',
        rating: 5,
        comment: 'جودة ممتازة ولمعة رائعة. ركبته في الصالة والنتيجة فخمة.',
        date: '2026-03-08',
      },
    ],
  },
};

// ══════════════════════════════════════════════
// Stars Component
// ══════════════════════════════════════════════
function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${sizeMap[size]} ${
            i <= Math.round(rating)
              ? 'fill-[#D4AF37] text-[#D4AF37]'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════
// Hero Section
// ══════════════════════════════════════════════
function HeroSection({ product }: { product: ProductData }) {
  return (
    <section className="pt-32 pb-16 bg-gradient-to-b from-[#F5EEE1] to-[#EFE7D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ fontFamily: font }}>
          <Home className="w-4 h-4 text-[#D4AF37]" />
          <ChevronLeft className="w-3 h-3 text-gray-400" />
          <span className="text-[#1F3D2B]/60">المتجر</span>
          <ChevronLeft className="w-3 h-3 text-gray-400" />
          <span className="text-[#1F3D2B]/60">{product.category}</span>
          <ChevronLeft className="w-3 h-3 text-gray-400" />
          <span className="text-[#1F3D2B] font-semibold">{product.nameAr}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.nameAr}
                className="w-full h-96 object-cover"
              />
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {product.gallery.slice(0, 3).map((img, i) => (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/60 overflow-hidden cursor-pointer hover:border-[#D4AF37]/40 transition-all"
                >
                  <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-24 object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/30 mb-4">
              <Tag className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-semibold text-[#D4AF37]" style={{ fontFamily: font }}>
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1F3D2B] mb-4" style={{ fontFamily: font }}>
              {product.nameAr}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-[#1F3D2B]/60 mb-6" style={{ fontFamily: font }}>
              {product.nameEn}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <Stars rating={product.rating} size="md" />
              <span className="text-xl font-bold text-[#1F3D2B]" style={{ fontFamily: font }}>
                {product.rating}
              </span>
              <span className="text-sm text-[#1F3D2B]/60" style={{ fontFamily: font }}>
                ({product.reviewCount} تقييم)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              {product.discountPrice && (
                <span
                  className="text-4xl font-bold bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] bg-clip-text text-transparent"
                  style={{ fontFamily: font }}
                >
                  {product.discountPrice} {product.currency}
                </span>
              )}
              <span
                className={`text-2xl ${product.discountPrice ? 'line-through text-[#1F3D2B]/40' : 'font-bold text-[#1F3D2B]'}`}
                style={{ fontFamily: font }}
              >
                {product.price} {product.currency}
              </span>
              {product.discountPrice && (
                <span className="px-3 py-1 bg-[#3B5BFE]/10 text-[#3B5BFE] text-sm font-bold rounded-full">
                  وفّر {product.price - product.discountPrice} {product.currency}
                </span>
              )}
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/60">
                <Truck className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <div className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: font }}>
                    التوصيل
                  </div>
                  <div className="text-sm font-semibold text-[#1F3D2B]" style={{ fontFamily: font }}>
                    24-48 ساعة
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/60">
                <Shield className="w-5 h-5 text-[#3B5BFE]" />
                <div>
                  <div className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: font }}>
                    الضمان
                  </div>
                  <div className="text-sm font-semibold text-[#1F3D2B]" style={{ fontFamily: font }}>
                    12 شهراً
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3 mb-8">
              {product.availability === 'InStock' ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-semibold text-green-600" style={{ fontFamily: font }}>
                    متوفر في المخزون
                  </span>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-semibold text-orange-600" style={{ fontFamily: font }}>
                    طلب مسبق
                  </span>
                </>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              <button
                className="w-full px-8 py-4 bg-gradient-to-l from-[#D4AF37] to-[#C8A86A] text-[#0B1120] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: font }}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>أضف إلى السلة</span>
              </button>

              <a
                href="tel:+971500000000"
                className="w-full px-8 py-4 bg-white/80 backdrop-blur-md text-[#1F3D2B] font-semibold rounded-xl border-2 border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-md transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: font }}
              >
                <Phone className="w-5 h-5 text-[#D4AF37]" />
                <span>اتصل للاستفسار</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Description + Specs Section
// ══════════════════════════════════════════════
function DetailsSection({ product }: { product: ProductData }) {
  return (
    <section className="py-16 bg-[#F5EEE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Description */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/60">
            <h2 className="text-2xl font-bold text-[#1F3D2B] mb-6" style={{ fontFamily: font }}>
              وصف المنتج
            </h2>
            <p className="text-base leading-relaxed text-[#1F3D2B]/80" style={{ fontFamily: font }}>
              {product.description}
            </p>
          </div>

          {/* Specs */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/60">
            <h2 className="text-2xl font-bold text-[#1F3D2B] mb-6" style={{ fontFamily: font }}>
              المواصفات الفنية
            </h2>
            <div className="space-y-4">
              {product.specs.map((spec, i) => (
                <div key={i} className="flex items-start justify-between py-3 border-b border-[#1F3D2B]/10 last:border-0">
                  <span className="text-sm font-semibold text-[#1F3D2B]/70" style={{ fontFamily: font }}>
                    {spec.label}
                  </span>
                  <span className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily: font }}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Features Section
// ══════════════════════════════════════════════
function FeaturesSection({ product }: { product: ProductData }) {
  return (
    <section className="py-16 bg-gradient-to-b from-[#F5EEE1] to-[#EFE7D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#1F3D2B] mb-8 text-center" style={{ fontFamily: font }}>
          المميزات الرئيسية
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.features.map((feature, i) => (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/60 shadow-sm hover:shadow-md transition-all flex items-start gap-3"
            >
              <CheckCircle className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <span className="text-base font-semibold text-[#1F3D2B]" style={{ fontFamily: font }}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
// Reviews Section
// ══════════════════════════════════════════════
function ReviewsSection({ product }: { product: ProductData }) {
  return (
    <section className="py-16 bg-[#F5EEE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#1F3D2B] mb-8" style={{ fontFamily: font }}>
          آراء العملاء
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {product.reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-semibold text-[#1F3D2B] mb-1" style={{ fontFamily: font }}>
                    {review.name}
                  </div>
                  <div className="text-xs text-[#1F3D2B]/50" style={{ fontFamily: font }}>
                    {review.date}
                  </div>
                </div>
                <Stars rating={review.rating} />
              </div>
              <p className="text-sm text-[#1F3D2B]/70 leading-relaxed" style={{ fontFamily: font }}>
                "{review.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════
export function SEOProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const product = DEMO_PRODUCTS[slug] || DEMO_PRODUCTS['cement-bag-50kg'];

  // ── SEO Injection
  useEffect(() => {
    const title = `${product.nameAr} — ${product.category} | ${SITE_NAME_AR}`;
    const desc = `${product.description.slice(0, 155)}... السعر: ${product.price} ${product.currency}. تقييم ${product.rating}/5 من ${product.reviewCount} عميل. ${product.delivery}.`;

    document.title = title;
    setMeta('description', desc);
    setMeta('keywords', `${product.nameAr}, ${product.category}, مواد بناء, متجر, شراء`);
    setMeta('robots', 'index, follow, max-image-preview:large');
    setLink('canonical', `${SITE_DOMAIN}/product/${product.slug}`);

    setMeta('og:title', title, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:url', `${SITE_DOMAIN}/product/${product.slug}`, 'property');
    setMeta('og:type', 'product', 'property');
    setMeta('og:image', product.image, 'property');

    injectJsonLd('ld-product', {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.nameAr,
      alternateName: product.nameEn,
      description: product.description,
      image: product.image,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      sku: product.sku,
      offers: {
        '@type': 'Offer',
        url: `${SITE_DOMAIN}/product/${product.slug}`,
        priceCurrency: product.currency,
        price: product.discountPrice || product.price,
        priceValidUntil: '2026-12-31',
        availability: `https://schema.org/${product.availability}`,
        seller: {
          '@type': 'Organization',
          name: SITE_NAME_AR,
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    });

    injectJsonLd('ld-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: SITE_NAME_AR,
          item: SITE_DOMAIN,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'المتجر',
          item: `${SITE_DOMAIN}/shop`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.category,
          item: `${SITE_DOMAIN}/shop/${product.category}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: product.nameAr,
          item: `${SITE_DOMAIN}/product/${product.slug}`,
        },
      ],
    });
  }, [product]);

  return (
    <div className="min-h-screen bg-[#F5EEE1]" style={{ fontFamily: font }}>
      <SEOHeader />
      <main>
        <HeroSection product={product} />
        <DetailsSection product={product} />
        <FeaturesSection product={product} />
        <ReviewsSection product={product} />
      </main>
      <SEOFooter />
    </div>
  );
}