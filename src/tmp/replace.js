const fs = require('fs');
let content = fs.readFileSync('components/seo/SEOPlatformFeatures.tsx', 'utf8');

content = content.replace(
  /<div className="bg-white\/50 p-2 rounded-3xl border border-gray-100 shadow-sm mb-12">\s*<img src={storeDigitalImg}[^>]+>\s*<\/div>/g,
  `<div className="grid md:grid-cols-2 gap-8 mb-12 items-center">
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <img src={storeDigitalImg} alt="سوق رقمي لمواد البناء" className="w-full h-auto rounded-2xl object-cover" />
            </div>
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
              <img src={createStoreImg} alt="انشئ متجرك الإلكتروني الاحترافي" className="w-full h-auto rounded-2xl object-cover" />
            </div>
          </div>`
);

content = content.replace(
  /<div className="bg-white\/50 p-2 rounded-3xl border border-gray-100 shadow-sm">\s*<img src={dashboardSeoImg}[^>]+>\s*<\/div>\s*<div className="bg-white\/50 p-2 rounded-3xl border border-gray-100 shadow-sm">\s*<img src={aiSearchImg}[^>]+>\s*<\/div>/g,
  `<div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm">
              <img src={dashboardSeoImg} alt="لوحات تحكم احترافية" className="w-full h-auto rounded-2xl object-cover" />
            </div>
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
              <img src={crmTemplatesImg} alt="قوالب الداشبورد المتعددة" className="w-full h-auto rounded-2xl object-cover" />
            </div>
            <div className="bg-white/50 p-2 rounded-3xl border border-gray-100 shadow-sm md:col-span-2">
              <img src={aiSearchImg} alt="تحليلات الذكاء الاصطناعي" className="w-full h-auto rounded-2xl object-cover" />
            </div>`
);

fs.writeFileSync('components/seo/SEOPlatformFeatures.tsx', content);
