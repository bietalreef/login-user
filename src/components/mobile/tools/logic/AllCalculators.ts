// ========================================
// بيت الريف - محرك الحسابات الموحّد
// جميع الحسابات الهندسية بالدرهم الإماراتي
// ========================================

// ═══════════════════════════════════════
// 1. حاسبة مواد البناء (محسّنة)
// ═══════════════════════════════════════

export interface MaterialInput {
  area: number;
  floors: number;
  finishQuality: 'standard' | 'premium' | 'luxury';
}

export interface MaterialLineItem {
  name: string;
  nameAr: string;
  amount: number;
  unit: string;
  unitAr: string;
  estimatedCost: number;
  icon: string;
}

export interface MaterialResult {
  items: MaterialLineItem[];
  totalMaterialCost: number;
  laborCost: number;
  totalEstimatedCost: number;
  pricePerMeter: number;
  summary: { area: number; floors: number; quality: string };
}

const MATERIAL_PRICES_AED = {
  steel_ton: 2800,
  cement_bag: 18,
  sand_m3: 45,
  aggregate_m3: 60,
  block_unit: 2.5,
  paint_liter: 35,
};

export const calculateConstructionMaterials = (input: MaterialInput): MaterialResult => {
  const { area, floors, finishQuality } = input;
  const totalArea = area * floors;

  const steelTon = Number(((totalArea * 45) / 1000).toFixed(2));
  const cementBags = Math.ceil(totalArea * 3.2);
  const sandM3 = Math.ceil(totalArea * 0.18);
  const aggM3 = Math.ceil(totalArea * 0.25);
  const blocks = Math.ceil(totalArea * 18);
  
  let paintFactor = 0.3;
  if (finishQuality === 'premium') paintFactor = 0.4;
  if (finishQuality === 'luxury') paintFactor = 0.5;
  const paintLiters = Math.ceil(totalArea * 3.5 * paintFactor);

  const items: MaterialLineItem[] = [
    { name: 'Steel', nameAr: 'حديد التسليح', amount: steelTon, unit: 'Ton', unitAr: 'طن', estimatedCost: steelTon * MATERIAL_PRICES_AED.steel_ton, icon: '🔩' },
    { name: 'Cement', nameAr: 'الأسمنت', amount: cementBags, unit: 'Bags', unitAr: 'شكارة', estimatedCost: cementBags * MATERIAL_PRICES_AED.cement_bag, icon: '🧱' },
    { name: 'Sand', nameAr: 'الرمل', amount: sandM3, unit: 'm³', unitAr: 'م³', estimatedCost: sandM3 * MATERIAL_PRICES_AED.sand_m3, icon: '⏳' },
    { name: 'Aggregate', nameAr: 'الحصى', amount: aggM3, unit: 'm³', unitAr: 'م³', estimatedCost: aggM3 * MATERIAL_PRICES_AED.aggregate_m3, icon: '🪨' },
    { name: 'Blocks', nameAr: 'الطوب/البلوك', amount: blocks, unit: 'Block', unitAr: 'طوبة', estimatedCost: blocks * MATERIAL_PRICES_AED.block_unit, icon: '🏗️' },
    { name: 'Paint', nameAr: 'الدهانات', amount: paintLiters, unit: 'Liters', unitAr: 'لتر', estimatedCost: paintLiters * MATERIAL_PRICES_AED.paint_liter, icon: '🎨' },
  ];

  const totalMaterialCost = items.reduce((s, i) => s + i.estimatedCost, 0);
  const laborFactor = finishQuality === 'luxury' ? 0.45 : finishQuality === 'premium' ? 0.35 : 0.30;
  const laborCost = Math.round(totalMaterialCost * laborFactor);
  const totalEstimatedCost = totalMaterialCost + laborCost;

  return {
    items,
    totalMaterialCost: Math.round(totalMaterialCost),
    laborCost,
    totalEstimatedCost,
    pricePerMeter: Math.round(totalEstimatedCost / totalArea),
    summary: { area: totalArea, floors, quality: finishQuality },
  };
};


// ═══════════════════════════════════════
// 2. حاسبة الدهانات والأرضيات
// ═══════════════════════════════════════

export interface PaintFlooringInput {
  length: number;
  width: number;
  height: number;
  doors: number;
  windows: number;
  paintCoats: number;     // عدد الأوجه (2 أو 3)
  includeCeiling: boolean;
  flooringType: 'ceramic' | 'porcelain' | 'marble' | 'parquet' | 'vinyl';
}

export interface PaintFlooringResult {
  wallArea: number;
  ceilingArea: number;
  floorArea: number;
  netWallArea: number; // بعد خصم الأبواب والنوافذ
  paintLiters: number;
  paintBuckets: number; // دلاء 18 لتر
  flooringM2: number;  // مع هالك 10%
  skirtingMeters: number;
  costs: {
    paint: number;
    flooring: number;
    skirting: number;
    total: number;
  };
}

const FLOORING_PRICES_AED: Record<string, number> = {
  ceramic: 45,
  porcelain: 75,
  marble: 180,
  parquet: 120,
  vinyl: 55,
};

const FLOORING_NAMES: Record<string, { ar: string; en: string }> = {
  ceramic: { ar: 'سيراميك', en: 'Ceramic' },
  porcelain: { ar: 'بورسلين', en: 'Porcelain' },
  marble: { ar: 'رخام', en: 'Marble' },
  parquet: { ar: 'باركيه', en: 'Parquet' },
  vinyl: { ar: 'فينيل', en: 'Vinyl' },
};

export const getFlooringName = (type: string, lang: 'ar' | 'en' = 'ar') => 
  FLOORING_NAMES[type]?.[lang] || type;

export const calculatePaintFlooring = (input: PaintFlooringInput): PaintFlooringResult => {
  const { length, width, height, doors, windows, paintCoats, includeCeiling, flooringType } = input;

  const doorArea = doors * 2.1 * 0.9;   // باب قياسي
  const windowArea = windows * 1.2 * 1.0; // نافذة قياسية
  
  const wallArea = 2 * (length + width) * height;
  const netWallArea = Math.max(0, wallArea - doorArea - windowArea);
  const ceilingArea = length * width;
  const floorArea = length * width;

  const totalPaintArea = netWallArea + (includeCeiling ? ceilingArea : 0);
  const coveragePerLiter = 11; // م² لكل لتر (وجه واحد)
  const paintLiters = Math.ceil((totalPaintArea * paintCoats) / coveragePerLiter);
  const paintBuckets = Math.ceil(paintLiters / 18);

  const flooringM2 = Math.ceil(floorArea * 1.10); // 10% هالك
  const skirtingMeters = Math.ceil(2 * (length + width) - (doors * 0.9));

  const paintCost = paintLiters * 35;
  const flooringCost = flooringM2 * (FLOORING_PRICES_AED[flooringType] || 45);
  const skirtingCost = skirtingMeters * 25;

  return {
    wallArea: Number(wallArea.toFixed(1)),
    ceilingArea: Number(ceilingArea.toFixed(1)),
    floorArea: Number(floorArea.toFixed(1)),
    netWallArea: Number(netWallArea.toFixed(1)),
    paintLiters,
    paintBuckets,
    flooringM2,
    skirtingMeters,
    costs: {
      paint: paintCost,
      flooring: flooringCost,
      skirting: skirtingCost,
      total: paintCost + flooringCost + skirtingCost,
    },
  };
};


// ═══════════════════════════════════════
// 3. مقدّر التكلفة الشامل
// ═══════════════════════════════════════

export interface CostEstimateInput {
  area: number;
  floors: number;
  emirate: string;
  finishLevel: 'standard' | 'premium' | 'luxury';
  buildingType: 'villa' | 'apartment' | 'commercial' | 'warehouse';
}

export interface CostEstimateResult {
  minCost: number;
  maxCost: number;
  avgCost: number;
  breakdown: { category: string; categoryAr: string; percentage: number; cost: number; icon: string }[];
  pricePerM2: { min: number; max: number };
  timeline: string;
  timelineAr: string;
}

const LOCATION_MULTIPLIER: Record<string, number> = {
  'dubai': 1.20,
  'abu-dhabi': 1.15,
  'sharjah': 1.00,
  'ajman': 0.95,
  'umm-al-quwain': 0.92,
  'ras-al-khaimah': 0.93,
  'fujairah': 0.90,
};

const BASE_RATES: Record<string, Record<string, number>> = {
  villa: { standard: 1500, premium: 2400, luxury: 3800 },
  apartment: { standard: 1200, premium: 2000, luxury: 3200 },
  commercial: { standard: 1800, premium: 2800, luxury: 4200 },
  warehouse: { standard: 800, premium: 1200, luxury: 1800 },
};

export const calculateCostEstimate = (input: CostEstimateInput): CostEstimateResult => {
  const { area, floors, emirate, finishLevel, buildingType } = input;
  const totalArea = area * floors;
  const locationMult = LOCATION_MULTIPLIER[emirate] || 1.0;
  const baseRate = BASE_RATES[buildingType]?.[finishLevel] || 1500;

  const avgRate = baseRate * locationMult;
  const minRate = avgRate * 0.85;
  const maxRate = avgRate * 1.15;

  const avgCost = Math.round(totalArea * avgRate);
  const minCost = Math.round(totalArea * minRate);
  const maxCost = Math.round(totalArea * maxRate);

  const breakdown = [
    { category: 'Structure', categoryAr: 'الهيكل الإنشائي', percentage: 35, cost: Math.round(avgCost * 0.35), icon: '🏗️' },
    { category: 'MEP', categoryAr: 'التمديدات (كهرباء/سباكة/تكييف)', percentage: 20, cost: Math.round(avgCost * 0.20), icon: '⚡' },
    { category: 'Finishing', categoryAr: 'التشطيبات', percentage: 25, cost: Math.round(avgCost * 0.25), icon: '🎨' },
    { category: 'Fixtures', categoryAr: 'التركيبات والأدوات الصحية', percentage: 10, cost: Math.round(avgCost * 0.10), icon: '🚿' },
    { category: 'External', categoryAr: 'الأعمال الخارجية', percentage: 10, cost: Math.round(avgCost * 0.10), icon: '🏡' },
  ];

  // تقدير المدة
  const monthsPerFloor = buildingType === 'villa' ? 4 : 3;
  const totalMonths = monthsPerFloor * floors + 2;
  const timeline = `${totalMonths - 2} - ${totalMonths + 2} months`;
  const timelineAr = `${totalMonths - 2} - ${totalMonths + 2} شهر`;

  return {
    minCost,
    maxCost,
    avgCost,
    breakdown,
    pricePerM2: { min: Math.round(minRate), max: Math.round(maxRate) },
    timeline,
    timelineAr,
  };
};


// ═══════════════════════════════════════
// 4. مولّد عروض الأسعار
// ═══════════════════════════════════════

export interface QuoteItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteData {
  clientName: string;
  providerName: string;
  projectName: string;
  items: QuoteItem[];
  notes: string;
  validityDays: number;
  includeVAT: boolean;
}

export interface QuoteResult {
  subtotal: number;
  vatAmount: number;
  total: number;
  quoteNumber: string;
  date: string;
}

export const calculateQuote = (data: QuoteData): QuoteResult => {
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vatAmount = data.includeVAT ? Math.round(subtotal * 0.05) : 0; // ضريبة 5%
  const total = subtotal + vatAmount;
  const quoteNumber = `BR-Q-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const date = new Date().toLocaleDateString('ar-AE', { year: 'numeric', month: 'long', day: 'numeric' });

  return { subtotal, vatAmount, total, quoteNumber, date };
};


// ═══════════════════════════════════════
// 5. مولّد المحتوى التسويقي
// ═══════════════════════════════════════

export interface MarketingInput {
  serviceType: string;
  features: string;
  targetCity: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'whatsapp';
  tone: 'professional' | 'friendly' | 'promotional';
}

export interface MarketingResult {
  postText: string;
  hashtags: string;
  callToAction: string;
}

const SERVICE_EMOJIS: Record<string, string> = {
  'سباكة': '🔧', 'كهرباء': '⚡', 'تكييف': '❄️', 'دهانات': '🎨',
  'تنظيف': '✨', 'بناء': '🏗️', 'نجارة': '🪚', 'ديكور': '🏠',
  'حدادة': '🔨', 'تبريد': '🧊', 'صيانة': '🛠️', 'أرضيات': '🪵',
};

export const generateMarketingContent = (input: MarketingInput): MarketingResult => {
  const emoji = SERVICE_EMOJIS[input.serviceType] || '🏠';
  const featuresList = input.features.split(/[,،\n]/).filter(f => f.trim()).map(f => f.trim());

  const toneMap = {
    professional: {
      opening: `${emoji} خدمات ${input.serviceType} الاحترافية في ${input.targetCity}`,
      closing: `للحجز والاستفسار، تواصل معنا الآن`,
    },
    friendly: {
      opening: `${emoji} محتاج ${input.serviceType}؟ نحن هنا لمساعدتك!`,
      closing: `كلمنا وخلنا نساعدك! 💬`,
    },
    promotional: {
      opening: `🔥 عرض خاص على خدمات ${input.serviceType} في ${input.targetCity}!`,
      closing: `العرض لفترة محدودة! احجز الآن 📞`,
    },
  };

  const tone = toneMap[input.tone];
  const featuresText = featuresList.map(f => `✅ ${f}`).join('\n');

  const postText = `${tone.opening}\n\n${featuresText}\n\n📍 ${input.targetCity} - الإمارات\n\n${tone.closing}`;
  
  const hashtags = `#${input.serviceType.replace(/\s/g, '_')} #${input.targetCity.replace(/\s/g, '_')} #بيت_الريف #خدمات_منزلية #الإمارات #صيانة_منازل`;
  
  const callToAction = input.platform === 'whatsapp' 
    ? `واتساب: wa.me/971XXXXXXXXX`
    : `اتصل بنا أو راسلنا عبر الرسائل المباشرة`;

  return { postText, hashtags, callToAction };
};
