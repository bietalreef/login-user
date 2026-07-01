// ====================================
// 🧪 Smart Search Tests
// اختبارات نظام البحث الذكي
// ====================================

import { searchAll, SearchFilters } from '../data/searchData';

// ====================================
// 📝 Test Cases
// ====================================

export function runSearchTests() {
  console.log('🧪 بدء اختبارات البحث الذكي...\n');

  let passedTests = 0;
  let failedTests = 0;

  // Test 1: البحث بكلمة عربية
  console.log('Test 1: البحث بكلمة "سباكة"');
  const test1 = searchAll('سباكة');
  if (test1.length > 0) {
    console.log('✅ PASS - وجد', test1.length, 'نتيجة');
    passedTests++;
  } else {
    console.log('❌ FAIL - لم يجد أي نتائج');
    failedTests++;
  }
  console.log('');

  // Test 2: البحث بكلمة إنجليزية
  console.log('Test 2: البحث بكلمة "plumbing"');
  const test2 = searchAll('plumbing');
  if (test2.length > 0) {
    console.log('✅ PASS - وجد', test2.length, 'نتيجة');
    passedTests++;
  } else {
    console.log('❌ FAIL - لم يجد أي نتائج');
    failedTests++;
  }
  console.log('');

  // Test 3: البحث مع فلتر التقييم
  console.log('Test 3: البحث مع فلتر تقييم 4.5+');
  const test3 = searchAll('', { rating: 4.5 });
  const allHighRated = test3.every(r => (r.rating || 0) >= 4.5);
  if (allHighRated) {
    console.log('✅ PASS - جميع النتائج تقييمها 4.5+');
    passedTests++;
  } else {
    console.log('❌ FAIL - بعض النتائج تقييمها أقل من 4.5');
    failedTests++;
  }
  console.log('');

  // Test 4: البحث مع فلتر السعر الاقتصادي
  console.log('Test 4: البحث مع فلتر السعر الاقتصادي');
  const test4 = searchAll('', { priceRange: 'budget' });
  const allBudget = test4.every(r => !r.price || r.price < 500);
  if (allBudget) {
    console.log('✅ PASS - جميع النتائج سعرها < 500 درهم');
    passedTests++;
  } else {
    console.log('❌ FAIL - بعض النتائج سعرها أكثر من 500 درهم');
    failedTests++;
  }
  console.log('');

  // Test 5: البحث مع فلتر الموثوق فقط
  console.log('Test 5: البحث مع فلتر الموثوق فقط');
  const test5 = searchAll('', { verified: true });
  const allVerified = test5.every(r => r.verified === true);
  if (allVerified) {
    console.log('✅ PASS - جميع النتائج موثوقة');
    passedTests++;
  } else {
    console.log('❌ FAIL - بعض النتائج غير موثوقة');
    failedTests++;
  }
  console.log('');

  // Test 6: البحث مع فلتر المتاح الآن
  console.log('Test 6: البحث مع فلتر المتاح الآن');
  const test6 = searchAll('', { availability: 'online' });
  const allOnline = test6.every(r => r.availability === 'online');
  if (allOnline) {
    console.log('✅ PASS - جميع النتائج متاحة الآن');
    passedTests++;
  } else {
    console.log('❌ FAIL - بعض النتائج غير متاحة');
    failedTests++;
  }
  console.log('');

  // Test 7: البحث مع فلتر نوع الخدمات
  console.log('Test 7: البحث مع فلتر نوع "service"');
  const test7 = searchAll('', { type: 'service' });
  const allServices = test7.every(r => r.type === 'service');
  if (allServices) {
    console.log('✅ PASS - جميع النتائج من نوع خدمة');
    passedTests++;
  } else {
    console.log('❌ FAIL - بعض النتائج ليست خدمات');
    failedTests++;
  }
  console.log('');

  // Test 8: البحث مع فلتر نوع المزودين
  console.log('Test 8: البحث مع فلتر نوع "provider"');
  const test8 = searchAll('', { type: 'provider' });
  const allProviders = test8.every(r => r.type === 'provider');
  if (allProviders) {
    console.log('✅ PASS - جميع النتائج من نوع مزود');
    passedTests++;
  } else {
    console.log('❌ FAIL - بعض النتائج ليست مزودين');
    failedTests++;
  }
  console.log('');

  // Test 9: البحث مع فلتر نوع المنتجات
  console.log('Test 9: البحث مع فلتر نوع "product"');
  const test9 = searchAll('', { type: 'product' });
  const allProducts = test9.every(r => r.type === 'product');
  if (allProducts) {
    console.log('✅ PASS - جميع النتائج من نوع منتج');
    passedTests++;
  } else {
    console.log('❌ FAIL - بعض النتائج ليست منتجات');
    failedTests++;
  }
  console.log('');

  // Test 10: البحث المركب (نص + فلاتر متعددة)
  console.log('Test 10: البحث المركب - "سباكة" + تقييم 4+ + موثوق');
  const test10 = searchAll('سباكة', { 
    rating: 4, 
    verified: true 
  });
  const test10Valid = test10.every(r => 
    (r.rating || 0) >= 4 && 
    r.verified === true
  );
  if (test10Valid && test10.length > 0) {
    console.log('✅ PASS - وجد', test10.length, 'نتيجة تطابق جميع الشروط');
    passedTests++;
  } else {
    console.log('❌ FAIL - النتائج لا تطابق جميع الشروط');
    failedTests++;
  }
  console.log('');

  // Test 11: البحث بكلمة غير موجودة
  console.log('Test 11: البحث بكلمة غير موجودة "xyz123"');
  const test11 = searchAll('xyz123');
  if (test11.length === 0) {
    console.log('✅ PASS - لم يجد نتائج (كما متوقع)');
    passedTests++;
  } else {
    console.log('❌ FAIL - وجد نتائج غير متوقعة');
    failedTests++;
  }
  console.log('');

  // Test 12: البحث الفارغ بدون فلاتر
  console.log('Test 12: البحث الفارغ بدون فلاتر');
  const test12 = searchAll('');
  if (test12.length === 0) {
    console.log('✅ PASS - لم يعرض أي نتائج (كما متوقع)');
    passedTests++;
  } else {
    console.log('❌ FAIL - عرض نتائج بدون بحث');
    failedTests++;
  }
  console.log('');

  // Test 13: ترتيب النتائج (الخدمات أولاً)
  console.log('Test 13: ترتيب النتائج - الخدمات أولاً');
  const test13 = searchAll('بناء');
  const firstIsService = test13.length > 0 && test13[0].type === 'service';
  if (firstIsService) {
    console.log('✅ PASS - الخدمات تظهر أولاً');
    passedTests++;
  } else {
    console.log('❌ FAIL - الترتيب غير صحيح');
    failedTests++;
  }
  console.log('');

  // Test 14: البحث في Tags
  console.log('Test 14: البحث في Tags - "contractor"');
  const test14 = searchAll('contractor');
  if (test14.length > 0) {
    console.log('✅ PASS - وجد نتائج من Tags');
    passedTests++;
  } else {
    console.log('❌ FAIL - لم يجد نتائج من Tags');
    failedTests++;
  }
  console.log('');

  // Test 15: البحث Case Insensitive
  console.log('Test 15: البحث Case Insensitive - "PLUMBING"');
  const test15a = searchAll('PLUMBING');
  const test15b = searchAll('plumbing');
  if (test15a.length === test15b.length) {
    console.log('✅ PASS - البحث لا يفرق بين الأحرف الكبيرة والصغيرة');
    passedTests++;
  } else {
    console.log('❌ FAIL - البحث يفرق بين الأحرف');
    failedTests++;
  }
  console.log('');

  // ====================================
  // النتيجة النهائية
  // ====================================
  console.log('='.repeat(50));
  console.log('📊 النتيجة النهائية:');
  console.log('✅ اجتاز:', passedTests, 'اختبار');
  console.log('❌ فشل:', failedTests, 'اختبار');
  console.log('📈 نسبة النجاح:', Math.round((passedTests / (passedTests + failedTests)) * 100) + '%');
  console.log('='.repeat(50));

  return {
    passed: passedTests,
    failed: failedTests,
    total: passedTests + failedTests,
    percentage: Math.round((passedTests / (passedTests + failedTests)) * 100)
  };
}

// ====================================
// تشغيل الاختبارات تلقائياً
// ====================================

// Uncomment to run tests on import
// runSearchTests();
