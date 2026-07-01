import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, FileText, ChevronDown, ChevronUp, Scale, Lock, Globe, AlertTriangle, Building2, CreditCard, UserCheck, Phone, Mail as MailIcon } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
type ModalType = 'terms' | 'privacy' | null;

interface LegalModalsProps {
  open: ModalType;
  onClose: () => void;
  language?: 'ar' | 'en';
}

// ─── Collapsible Section ─────────────────────────────────────
function Section({ title, icon, children, defaultOpen = false }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-amber-200/60 rounded-2xl overflow-hidden bg-white/40 backdrop-blur-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-5 py-4 text-right hover:bg-amber-50/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500/15 to-emerald-600/15 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <span className="flex-1 font-bold text-amber-900 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-amber-700/60 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-amber-700/60 flex-shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-amber-900/80 text-[13px] leading-[1.9] space-y-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Terms Content ───────────────────────────────────────────
export function TermsContent({ isEn }: { isEn: boolean }) {
  return (
    <div className="space-y-3">
      {/* Intro */}
      <div className="bg-gradient-to-l from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
        <p className="text-amber-900/90 text-[13px] leading-[1.9]" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {isEn ? (
            <>Welcome to <strong className="text-green-700">Beit Al Reef</strong> (app.bietalreef.ae). This platform is operated by Beit Al Reef Technology LLC, registered in the United Arab Emirates. By using this platform, you agree to abide by these Terms and Conditions. Please read them carefully.</>
          ) : (
            <>مرحباً بك في منصة <strong className="text-green-700">بيت الريف</strong> (app.bietalreef.ae). تُشغّل هذه المنصة شركة بيت الريف للتقنية ذ.م.م، المسجّلة في دولة الإمارات العربية المتحدة. باستخدامك للمنصة فإنك توافق على الالتزام بهذه الشروط والأحكام. يُرجى قراءتها بعناية.</>
          )}
        </p>
        <p className="text-amber-900/60 text-[11px] mt-2">{isEn ? 'Last updated: February 1, 2026' : 'آخر تحديث: 1 فبراير 2026'}</p>
      </div>

      <Section title={isEn ? '1. Definitions' : '1. التعريفات'} icon={<FileText className="w-4 h-4 text-green-600" />} defaultOpen>
        <ul className="list-none space-y-2">
          {isEn ? (
            <>
              <li>• <strong>"Platform"</strong>: The mobile application, website app.bietalreef.ae, and all related services.</li>
              <li>• <strong>"User"</strong>: Any person who accesses the platform, whether a contractor, craftsman, homeowner, or visitor.</li>
              <li>• <strong>"Service Provider"</strong>: A contractor, craftsman, or company registered to provide services through the platform.</li>
              <li>• <strong>"Client"</strong>: A user who requests services from service providers through the platform.</li>
              <li>• <strong>"Content"</strong>: Any text, images, videos, reviews, or quotations published by users.</li>
              <li>• <strong>"Packages"</strong>: Paid subscription plans that provide additional features for service providers.</li>
              <li>• <strong>"Smart Tools"</strong>: Cost calculators, quotation generators, contracts, and invoices built into the platform.</li>
            </>
          ) : (
            <>
              <li>• <strong>«المنصة»</strong>: تطبيق الهاتف المحمول وموقع الويب app.bietalreef.ae وجميع الخدمات المرتبطة.</li>
              <li>• <strong>«المستخدم»</strong>: أي شخص يصل إلى المنصة سواء كان مقاولاً، حرفياً، مالك منزل، أو زائراً.</li>
              <li>• <strong>«مزود الخدمة»</strong>: المقاول أو الحرفي أو الشركة المسجّلة لتقديم خدمات عبر المنصة.</li>
              <li>• <strong>«العميل»</strong>: المستخدم الذي يطلب خدمات من مزودي الخدمة عبر المنصة.</li>
              <li>• <strong>«المحتوى»</strong>: أي نصوص أو صور أو فيديوهات أو تقييمات أو عروض أسعار يُنشرها المستخدمون.</li>
              <li>• <strong>«الباقات»</strong>: خطط الاشتراك المدفوعة التي توفر ميزات إضافية لمزودي الخدمة.</li>
              <li>• <strong>«الأدوات الذكية»</strong>: حاسبات التكاليف ومولّدات العروض والعقود والفواتير المدمجة في المنصة.</li>
            </>
          )}
        </ul>
      </Section>

      <Section title={isEn ? '2. Eligibility & Registration' : '2. الأهلية والتسجيل'} icon={<UserCheck className="w-4 h-4 text-green-600" />}>
        <ul className="list-none space-y-2">
          {isEn ? (
            <>
              <li>• Users must be at least <strong>18 years old</strong> or have parental consent.</li>
              <li>• Service providers must hold a <strong>valid trade license</strong> in the UAE in accordance with Federal Law No. (2) of 2015 on Commercial Companies and its amendments.</li>
              <li>• Users must provide <strong>accurate and up-to-date</strong> information during registration.</li>
              <li>• The platform reserves the right to <strong>suspend or terminate</strong> any account that provides misleading or false information.</li>
              <li>• Registration as a "Verified Service Provider" requires submission of a trade license copy, UAE ID card, and relevant specialty certificates.</li>
            </>
          ) : (
            <>
              <li>• يجب ألا يقل عمر المستخدم عن <strong>18 عاماً</strong> أو أن يحصل على موافقة ولي الأمر.</li>
              <li>• يجب أن يكون مزود الخدمة حاصلاً على <strong>رخصة تجارية سارية</strong> في الإمارات وفقاً للقانون الاتحادي رقم (2) لسنة 2015 بشأن الشركات التجارية وتعديلاته.</li>
              <li>• يلتزم المستخدم بتقديم معلومات <strong>صحيحة ودقيقة</strong> عند التسجيل وتحديثها باستمرار.</li>
              <li>• تحتفظ المنصة بحق <strong>تعليق أو إلغاء</strong> أي حساب يقدم معلومات مضللة أو مزيفة.</li>
              <li>• التسجيل بصفة «مزود خدمة موثّق» يتطلب تقديم نسخة من الرخصة التجارية، بطاقة الهوية الإماراتية، وشهادات التخصص ذات الصلة.</li>
            </>
          )}
        </ul>
      </Section>

      <Section title={isEn ? '3. Platform Usage' : '3. استخدام المنصة'} icon={<Globe className="w-4 h-4 text-green-600" />}>
        <ul className="list-none space-y-2">
          {isEn ? (
            <>
              <li>• The platform is a <strong>technical intermediary</strong> connecting clients with service providers and is not a party to contracts between them.</li>
              <li>• It is prohibited to use the platform for any <strong>unlawful</strong> purpose or in violation of UAE federal laws.</li>
              <li>• Publishing <strong>offensive, discriminatory, or misleading</strong> content is prohibited under Federal Decree-Law No. (34) of 2021 on Combating Rumors and Cybercrimes.</li>
              <li>• Manipulation of ratings or posting fake reviews is prohibited.</li>
              <li>• Unauthorized access to other users' accounts or platform systems is prohibited.</li>
              <li>• Use of automated software (bots) or data scraping tools without written permission is prohibited.</li>
            </>
          ) : (
            <>
              <li>• المنصة <strong>وسيط تقني</strong> يربط بين العملاء ومزودي الخدمة، وليست طرفاً في العقود المبرمة بينهم.</li>
              <li>• يُحظر استخدام المنصة لأي غرض <strong>غير مشروع</strong> أو مخالف للقوانين الاتحادية الإماراتية.</li>
              <li>• يُمنع نشر محتوى <strong>مسيء أو تمييزي أو مضلل</strong> وفقاً للمرسوم بقانون اتحادي رقم (34) لسنة 2021 بشأن مكافحة الشائعات والجرائم الإلكترونية.</li>
              <li>• يُمنع التلاعب بالتقييمات أو نشر مراجعات وهمية.</li>
              <li>• يُمنع محاولة الوصول غير المصرح به لحسابات مستخدمين آخرين أو أنظمة المنصة.</li>
              <li>• يُمنع استخدام برامج آلية (bots) أو أدوات كشط البيانات (scraping) دون إذن كتابي.</li>
            </>
          )}
        </ul>
      </Section>

      <Section title={isEn ? '4. Services & Pricing' : '4. الخدمات والأسعار'} icon={<CreditCard className="w-4 h-4 text-green-600" />}>
        <ul className="list-none space-y-2">
          {isEn ? (
            <>
              <li>• All prices are displayed in UAE Dirhams <strong>(AED)</strong> and include 5% VAT unless otherwise stated.</li>
              <li>• Quotations from service providers are <strong>estimates</strong> and may change after on-site inspection.</li>
              <li>• Package and subscription fees are subject to the pricing policy published on the platform and may be updated periodically with <strong>30 days</strong> prior notice.</li>
              <li>• The platform is not responsible for the quality of work performed by service providers, but provides a <strong>rating and verification</strong> system to protect clients.</li>
              <li>• Payment is arranged between the client and service provider. The platform currently does not charge commissions on direct transactions.</li>
            </>
          ) : (
            <>
              <li>• جميع الأسعار المعروضة بالدرهم الإماراتي <strong>(د.إ)</strong> وتشمل ضريبة القيمة المضافة (5%) ما لم يُذكر خلاف ذلك.</li>
              <li>• عروض الأسعار المقدمة من مزودي الخدمة <strong>تقديرية</strong> وقد تتغير بعد المعاينة الميدانية.</li>
              <li>• تخضع رسوم الباقات والاشتراكات لسياسة التسعير المعلنة على المنصة وقد تُحدّث دورياً مع إشعار مسبق بـ <strong>30 يوماً</strong>.</li>
              <li>• المنصة غير مسؤولة عن جودة الأعمال المنفذة من قبل مزودي الخدمة، لكنها توفر نظام <strong>تقييم وتوثيق</strong> لحماية العملاء.</li>
              <li>• الدفع يتم حسب الاتفاق بين العميل ومزود الخدمة. لا تتقاضى المنصة عمولات على المعاملات المباشرة حالياً.</li>
            </>
          )}
        </ul>
      </Section>

      <Section title={isEn ? '5. Intellectual Property' : '5. الملكية الفكرية'} icon={<Shield className="w-4 h-4 text-green-600" />}>
        <ul className="list-none space-y-2">
          {isEn ? (
            <>
              <li>• All intellectual property rights of the platform (design, logo, code, smart tools, AI algorithms) are exclusively owned by Beit Al Reef Technology LLC and protected under <strong>Federal Law No. (38) of 2021</strong> on Copyright and Related Rights.</li>
              <li>• Users grant the platform a <strong>non-exclusive, revocable</strong> license to use content they publish for the purpose of operating and improving the platform.</li>
              <li>• Users bear full responsibility for ensuring that published content does not infringe third-party intellectual property rights.</li>
            </>
          ) : (
            <>
              <li>• جميع حقوق الملكية الفكرية للمنصة (التصميم، الشعار، الأكواد، الأدوات الذكية، خوارزميات الذكاء الاصطناعي) مملوكة حصرياً لشركة بيت الريف للتقنية ذ.م.م ومحمية بموجب <strong>القانون الاتحادي رقم (38) لسنة 2021</strong> بشأن حقوق المؤلف والحقوق المجاورة.</li>
              <li>• يمنح المستخدم المنصة ترخيصاً <strong>غير حصري وقابل للإلغاء</strong> لاستخدام المحتوى الذي ينشره بغرض تشغيل المنصة وتحسين خدماتها.</li>
              <li>• يتحمل المستخدم المسؤولية الكاملة عن ضمان أن المحتوى المنشور لا ينتهك حقوق الملكية الفكرية للغير.</li>
            </>
          )}
        </ul>
      </Section>

      <Section title={isEn ? '6. Warranties & Liability Limits' : '6. الضمانات وحدود المسؤولية'} icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}>
        <ul className="list-none space-y-2">
          {isEn ? (
            <>
              <li>• The platform is provided <strong>"as is"</strong> without express or implied warranties regarding continuous availability or freedom from errors.</li>
              <li>• The platform is not liable for direct or indirect damages resulting from:
                <ul className="mr-4 mt-1 space-y-1">
                  <li>– Transactions between clients and service providers.</li>
                  <li>– Service interruptions or technical failures beyond control.</li>
                  <li>– Use of smart tools and calculators results (these are advisory estimates, not binding professional consultations).</li>
                </ul>
              </li>
              <li>• In all cases, platform liability does not exceed the <strong>subscription fees</strong> paid during the preceding 12 months.</li>
            </>
          ) : (
            <>
              <li>• تُقدَّم المنصة <strong>«كما هي»</strong> دون ضمانات صريحة أو ضمنية بشأن توفرها الدائم أو خلوها من الأخطاء.</li>
              <li>• لا تتحمل المنصة مسؤولية الأضرار المباشرة أو غير المباشرة الناتجة عن:
                <ul className="mr-4 mt-1 space-y-1">
                  <li>– تعاملات بين العملاء ومزودي الخدمة.</li>
                  <li>– انقطاع الخدمة أو أعطال تقنية خارجة عن السيطرة.</li>
                  <li>– استخدام نتائج الأدوات الذكية والحاسبات (هي تقديرات إرشادية وليست استشارات مهنية ملزمة).</li>
                </ul>
              </li>
              <li>• في جميع الأحوال، لا تتجاوز مسؤولية المنصة <strong>قيمة رسوم الاشتراك</strong> المدفوعة خلال الـ 12 شهراً السابقة.</li>
            </>
          )}
        </ul>
      </Section>

      <Section title={isEn ? '7. Termination' : '7. إنهاء الاستخدام'} icon={<X className="w-4 h-4 text-red-500" />}>
        <ul className="list-none space-y-2">
          {isEn ? (
            <>
              <li>• Users may cancel their account at any time from account settings.</li>
              <li>• The platform may suspend or terminate any user account that violates these terms with <strong>7 days</strong> prior notice (except in cases of serious violation).</li>
              <li>• Upon account termination, users retain the right to export their data within <strong>30 days</strong> in accordance with data protection laws.</li>
            </>
          ) : (
            <>
              <li>• يحق للمستخدم إلغاء حسابه في أي وقت من إعدادات الحساب.</li>
              <li>• يحق للمنصة تعليق أو إنهاء حساب أي مستخدم يخالف هذه الشروط مع إشعار مسبق بـ <strong>7 أيام</strong> (إلا في حالات الانتهاك الجسيم).</li>
              <li>• عند إنهاء الحساب، يحتفظ المستخدم بحقه في تصدير بياناته خلال <strong>30 يوماً</strong> وفقاً لقوانين حماية البيانات.</li>
            </>
          )}
        </ul>
      </Section>

      <Section title={isEn ? '8. Governing Law & Dispute Resolution' : '8. القانون الواجب التطبيق وتسوية النزاعات'} icon={<Scale className="w-4 h-4 text-green-600" />}>
        <ul className="list-none space-y-2">
          {isEn ? (
            <>
              <li>• These terms are governed by and construed in accordance with the <strong>laws of the United Arab Emirates</strong>.</li>
              <li>• In case of any dispute, the parties shall seek an amicable resolution within <strong>30 days</strong>.</li>
              <li>• If an amicable resolution is not reached, the dispute shall be referred to the <strong>competent courts of the Emirate of Dubai</strong>.</li>
              <li>• The parties may agree to arbitration under the rules of the <strong>Dubai International Arbitration Centre (DIAC)</strong>.</li>
              <li>• Arabic is the <strong>official language</strong> for interpreting these terms. In case of conflict between Arabic and English versions, the Arabic version shall prevail.</li>
            </>
          ) : (
            <>
              <li>• تخضع هذه الشروط وتُفسَّر وفقاً <strong>لقوانين دولة الإمارات العربية المتحدة</strong>.</li>
              <li>• في حال نشوء أي نزاع، يسعى الطرفان لحله ودياً خلال <strong>30 يوماً</strong>.</li>
              <li>• في حال عدم التوصل لحل ودي، يُحال النزاع إلى <strong>محاكم إمارة دبي</strong> المختصة.</li>
              <li>• يجوز للأطراف الاتفاق على التحكيم وفقاً لقواعد <strong>مركز دبي للتحكيم الدولي (DIAC)</strong>.</li>
              <li>• اللغة العربية هي <strong>اللغة المعتمدة</strong> لتفسير هذه الشروط. في حال وجود تعارض بين النسختين العربية والإنجليزية، تسود النسخة العربية.</li>
            </>
          )}
        </ul>
      </Section>

      <Section title={isEn ? '9. Amendments' : '9. التعديلات'} icon={<FileText className="w-4 h-4 text-green-600" />}>
        <ul className="list-none space-y-2">
          {isEn ? (
            <>
              <li>• The platform reserves the right to amend these terms at any time.</li>
              <li>• Users will be notified of material amendments via <strong>in-app notification and email</strong> 30 days before they take effect.</li>
              <li>• Continued use of the platform after amendments take effect constitutes acceptance thereof.</li>
            </>
          ) : (
            <>
              <li>• تحتفظ المنصة بحق تعديل هذه الشروط في أي وقت.</li>
              <li>• يتم إشعار المستخدمين بالتعديلات الجوهرية عبر <strong>إشعار داخل التطبيق والبريد الإلكتروني</strong> قبل 30 يوماً من سريانها.</li>
              <li>• ا��تمرار استخدام المنصة بعد سريان التعديلات يُعتبر موافقة عليها.</li>
            </>
          )}
        </ul>
      </Section>

      {/* Contact */}
      <div className="bg-gradient-to-l from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-200/50 mt-4">
        <p className="font-bold text-amber-900 text-sm mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {isEn ? 'Legal Inquiries Contact:' : 'للتواصل والاستفسارات القانونية:'}
        </p>
        <div className="flex flex-col gap-1 text-[12px] text-amber-900/70">
          <span className="flex items-center gap-2"><MailIcon className="w-3.5 h-3.5" /> legal@bietalreef.ae</span>
          <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +971-4-XXX-XXXX</span>
          <span className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> {isEn ? 'Dubai, United Arab Emirates' : 'دبي، الإمارات العربية المتحدة'}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Privacy Content ─────────────────────────────────────────
export function PrivacyContent({ isEn }: { isEn: boolean }) {
  return (
    <div className="space-y-3">
      {/* Intro */}
      <div className="bg-gradient-to-l from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
        <p className="text-amber-900/90 text-[13px] leading-[1.9]" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {isEn ? (
            <><strong className="text-green-700">Beit Al Reef</strong> is committed to protecting user privacy in accordance with Federal Decree-Law No. <strong>(45) of 2021</strong> on Personal Data Protection and its executive regulations. This policy explains how we collect, use, and protect your data.</>
          ) : (
            <>تلتزم منصة <strong className="text-green-700">بيت الريف</strong> بحماية خصوصية مستخدميها وفقاً للمرسوم بقانون اتحادي رقم <strong>(45) لسنة 2021</strong> بشأن حماية البيانات الشخصية ولوائحه التنفيذية. توضح هذه السياسة كيفية جمع بياناتك واستخدامها وحمايتها.</>
          )}
        </p>
        <p className="text-amber-900/60 text-[11px] mt-2">{isEn ? 'Last updated: February 1, 2026' : 'آخر تحديث: 1 فبراير 2026'}</p>
      </div>

      <Section title={isEn ? '1. Data We Collect' : '1. البيانات التي نجمعها'} icon={<FileText className="w-4 h-4 text-blue-600" />} defaultOpen>
        {isEn ? (
          <>
            <p className="font-bold text-amber-900/90 mb-2">a. Data provided directly by the user:</p>
            <ul className="list-none space-y-1 mb-3">
              <li>• Full name, email address, phone number.</li>
              <li>• Trade license data and specialty certificates (for service providers).</li>
              <li>• Geographic location (emirate/city).</li>
              <li>• Uploaded photos and videos (work gallery, projects).</li>
              <li>• Message content, inquiries, and quotation requests.</li>
            </ul>
            <p className="font-bold text-amber-900/90 mb-2">b. Data collected automatically:</p>
            <ul className="list-none space-y-1 mb-3">
              <li>• Device type, operating system, browser version.</li>
              <li>• IP address and device identifiers.</li>
              <li>• Usage data (pages visited, session time, tools used).</li>
              <li>• Performance and technical error data.</li>
            </ul>
            <p className="font-bold text-amber-900/90 mb-2">c. Data from third parties:</p>
            <ul className="list-none space-y-1">
              <li>• Google account information when signing in via Google OAuth.</li>
              <li>• Linked social media platform data (e.g., TikTok) when Social Media Manager feature is activated.</li>
            </ul>
          </>
        ) : (
          <>
            <p className="font-bold text-amber-900/90 mb-2">أ. بيانات يقدمها المستخدم مباشرة:</p>
            <ul className="list-none space-y-1 mb-3">
              <li>• الاسم الكامل، البريد الإلكتروني، رقم الهاتف.</li>
              <li>• بيانات الرخصة التجارية وشهادات التخصص (لمزودي الخدمة).</li>
              <li>• الموقع الجغرافي (الإمارة/المدينة).</li>
              <li>• الصور والفيديوهات المرفوعة (معرض الأعمال، مشاريع).</li>
              <li>• محتوى الرسائل والاستفسارات وطلبات عروض الأسعار.</li>
            </ul>
            <p className="font-bold text-amber-900/90 mb-2">ب. بيانات تُجمع تلقائياً:</p>
            <ul className="list-none space-y-1 mb-3">
              <li>• نوع الجهاز، نظام التشغيل، إصدار المتصفح.</li>
              <li>• عنوان IP ومعرّفات الجهاز.</li>
              <li>• بيانات الاستخدام (الصفحات المزارة، وقت الجلسة، الأدوات المستخدمة).</li>
              <li>• بيانات الأداء والأخطاء التقنية.</li>
            </ul>
            <p className="font-bold text-amber-900/90 mb-2">ج. بيانات من أطراف ثالثة:</p>
            <ul className="list-none space-y-1">
              <li>• معلومات حساب Google عند تسجيل الدخول عبر Google OAuth.</li>
              <li>• بيانات منصات التواصل الاجتماعي المرتبطة (مثل TikTok) عند تفعيل خاصية مدير السوشيال ميديا.</li>
            </ul>
          </>
        )}
      </Section>

      <Section title={isEn ? '2. How We Use Your Data' : '2. كيف نستخدم بياناتك'} icon={<Globe className="w-4 h-4 text-blue-600" />}>
        <ul className="list-none space-y-2">
          {isEn ? (
            <>
              <li>• <strong>Service delivery:</strong> Account creation, matching clients with service providers, processing requests.</li>
              <li>• <strong>Improvement:</strong> Analyzing usage patterns to enhance the platform experience and smart tools.</li>
              <li>• <strong>Recommendations:</strong> Suggesting suitable service providers based on your location and service type.</li>
              <li>• <strong>Communication:</strong> Sending notifications about your account, platform updates, and offers (with opt-out option).</li>
              <li>• <strong>Security:</strong> Detecting and preventing fraud, suspicious activities, and protecting user rights.</li>
              <li>• <strong>Legal compliance:</strong> Responding to official requests from UAE government authorities.</li>
            </>
          ) : (
            <>
              <li>• <strong>تقديم الخدمة:</strong> إنشاء الحساب، مطابقة العملاء مع مزودي الخدمة، معالجة الطلبات.</li>
              <li>• <strong>التحسين والتطوير:</strong> تحليل أنماط الاستخدام لتحسين تجربة المنصة والأدوات الذكية.</li>
              <li>• <strong>التوصيات:</strong> اقتراح مزودي خدمة مناسبين بناءً على موقعك ونوع الخدمة المطلوبة.</li>
              <li>• <strong>التواصل:</strong> إرسال إشعارات حول حسابك، تحديثات المنصة، والعروض (مع خيار إلغاء الاشتراك).</li>
              <li>• <strong>الأمان:</strong> كشف ومنع الاحتيال والأنشطة المشبوهة وحماية حقوق المستخدمين.</li>
              <li>• <strong>الامتثال القانوني:</strong> الاستجابة للطلبات الرسمية من الجهات الحكومية المعنية في الإمارات.</li>
            </>
          )}
        </ul>
      </Section>

      <Section title={isEn ? '3. Data Sharing' : '3. مشاركة البيانات'} icon={<UserCheck className="w-4 h-4 text-blue-600" />}>
        <p className="mb-2"><strong>{isEn ? 'We do not sell your personal data.' : 'لا نبيع بياناتك الشخصية.'}</strong> {isEn ? 'We may share it only in these cases:' : 'قد نشاركها فقط في الحالات التالية:'}</p>
        <ul className="list-none space-y-2">
          {isEn ? (
            <>
              <li>• <strong>Service Providers:</strong> Sharing basic contact information when sending an inquiry or quotation request.</li>
              <li>• <strong>Infrastructure Providers:</strong> Hosting servers (Supabase), email services, payment gateways — under strict data protection agreements.</li>
              <li>• <strong>Social Platforms:</strong> When linking your account to TikTok or other platforms (with your explicit consent only).</li>
              <li>• <strong>Government Authorities:</strong> When there is a legal obligation or court order.</li>
            </>
          ) : (
            <>
              <li>• <strong>مزودي الخدمة:</strong> مشاركة معلومات التواصل الأساسية عند إرسال استفسار أو طلب عرض سعر.</li>
              <li>• <strong>مزودو البنية التحتية:</strong> خوادم الاستضافة (Supabase)، خدمات البريد الإلكتروني، بوابات الدفع — بموجب اتفاقيات حماية بيانات صارمة.</li>
              <li>• <strong>منصات التواصل:</strong> عند ربط حسابك بـ TikTok أو منصات أخرى (بموافقتك الصريحة فقط).</li>
              <li>• <strong>الجهات الحكومية:</strong> عند وجود التزام قانوني أو أمر قضائي.</li>
            </>
          )}
        </ul>
      </Section>

      <Section title={isEn ? '4. Data Storage & Security' : '4. تخزين البيانات وأمنها'} icon={<Lock className="w-4 h-4 text-blue-600" />}>
        <ul className="list-none space-y-2">
          {isEn ? (
            <>
              <li>• Data is stored on secure servers with <strong>AES-256 encryption</strong> at rest and TLS 1.3 in transit.</li>
              <li>• We implement security measures including: two-factor authentication, access monitoring, audit logs, and regular backups.</li>
              <li>• We comply with <strong>TDRA</strong> (Telecommunications and Digital Government Regulatory Authority) information security standards.</li>
              <li>• Sensitive data is stored within the <strong>UAE</strong> or in countries providing an equivalent level of protection.</li>
              <li>• Data retention: We retain your data throughout your account's active period, and for <strong>5 years</strong> after cancellation for legal and accounting compliance.</li>
            </>
          ) : (
            <>
              <li>• تُخزَّن البيانات على خوادم آمنة مع <strong>تشفير AES-256</strong> أثناء التخزين وTLS 1.3 أثناء النقل.</li>
              <li>• نطبق إجراءات أمنية تشمل: المصادقة الثنائية، مراقبة الوصول، سجلات التدقيق، والنسخ الاحتياطي المنتظم.</li>
              <li>• نلتزم بمعايير هيئة تنظيم الاتصالات والحكومة الرقمية <strong>(TDRA)</strong> لأمن المعلومات.</li>
              <li>• نُخزّن البيانات الحساسة داخل <strong>دولة الإمارات</strong> أو في دول توفر مستوى حماية مكافئاً وفقاً لقانون حماية البيانات.</li>
              <li>• مدة الاحتفاظ بالبيانات: نحتفظ ببياناتك طوال فترة نشاط حسابك، ولمدة <strong>5 سنوات</strong> بعد إلغائه للامتثال للمتطلبات القانونية والمحاسبية.</li>
            </>
          )}
        </ul>
      </Section>

      <Section title={isEn ? '5. Your Rights' : '5. حقوقك'} icon={<Shield className="w-4 h-4 text-blue-600" />}>
        <p className="mb-2">{isEn ? 'Under the UAE Personal Data Protection Law, you have the following rights:' : 'وفقاً لقانون حماية البيانات الشخصية الإماراتي، لديك الحقوق التالية:'}</p>
        <ul className="list-none space-y-2">
          {isEn ? (
            <>
              <li>• <strong>Right of access:</strong> Request a copy of your personal data stored with us.</li>
              <li>• <strong>Right to rectification:</strong> Modify or update inaccurate data.</li>
              <li>• <strong>Right to erasure:</strong> Request deletion of your data (subject to legal exceptions).</li>
              <li>• <strong>Right to data portability:</strong> Obtain your data in a structured, machine-readable format.</li>
              <li>• <strong>Right to object:</strong> Object to processing your data for direct marketing purposes.</li>
              <li>• <strong>Right to withdraw consent:</strong> Withdraw your consent at any time without affecting the lawfulness of prior processing.</li>
            </>
          ) : (
            <>
              <li>• <strong>حق الوصول:</strong> طلب نسخة من بياناتك الشخصية المخزنة لدينا.</li>
              <li>• <strong>حق التصحيح:</strong> تعديل أو تحديث بياناتك غير الدقيقة.</li>
              <li>• <strong>حق الحذف:</strong> طلب حذف بياناتك (مع مراعاة الاستثناءات القانونية).</li>
              <li>• <strong>حق نقل البيانات:</strong> الحصول على بياناتك بصيغة منظمة وقابلة للقراءة آلياً.</li>
              <li>• <strong>حق الاعتراض:</strong> الاعتراض على معالجة بياناتك لأغراض التسويق المباشر.</li>
              <li>• <strong>حق سحب الموافقة:</strong> سحب موافقتك في أي وقت دون التأثير على مشروعية المعالجة السابقة.</li>
            </>
          )}
        </ul>
        <p className="mt-2 bg-blue-50 rounded-xl p-3 text-[12px]">
          {isEn
            ? <>To exercise any of these rights, contact us at <strong>privacy@bietalreef.ae</strong>. We will respond within <strong>30 days</strong> maximum.</>
            : <>لممارسة أي من هذه الحقوق، تواصل معنا عبر <strong>privacy@bietalreef.ae</strong>. سنستجيب خلال <strong>30 يوماً</strong> كحد أقصى.</>
          }
        </p>
      </Section>

      <Section title={isEn ? '6. Amendments & Notification' : '6. التعديلات والإخطار'} icon={<FileText className="w-4 h-4 text-blue-600" />}>
        <ul className="list-none space-y-2">
          {isEn ? (
            <>
              <li>• We reserve the right to update this policy. You will be notified of material changes via in-app notification <strong>30 days</strong> in advance.</li>
              <li>• We recommend reviewing this policy periodically.</li>
            </>
          ) : (
            <>
              <li>• نحتفظ بحق تحديث هذه السياسة. سنُخطرك بالتغييرات الجوهرية عبر إشعار داخل التطبيق قبل <strong>30 يوماً</strong>.</li>
              <li>• ننصح بمراجعة هذه السياسة بشكل دوري.</li>
            </>
          )}
        </ul>
      </Section>

      {/* Contact */}
      <div className="bg-gradient-to-l from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50 mt-4">
        <p className="font-bold text-amber-900 text-sm mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {isEn ? 'Data Protection Officer (DPO):' : 'مسؤول حماية البيانات (DPO):'}
        </p>
        <div className="flex flex-col gap-1 text-[12px] text-amber-900/70">
          <span className="flex items-center gap-2"><MailIcon className="w-3.5 h-3.5" /> privacy@bietalreef.ae</span>
          <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +971-4-XXX-XXXX</span>
          <span className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> {isEn ? 'Dubai, United Arab Emirates' : 'دبي، الإمارات العربية المتحدة'}</span>
        </div>
        <p className="text-amber-900/50 text-[11px] mt-3">
          {isEn
            ? 'If you are not satisfied with how we handle your data, you have the right to file a complaint with the UAE Data Office under TDRA.'
            : 'في حال عدم رضاك عن تعاملنا مع بياناتك، يحق لك تقديم شكوى إلى مكتب البيانات الإماراتي التابع لهيئة تنظيم الاتصالات والحكومة الرقمية (TDRA).'
          }
        </p>
      </div>
    </div>
  );
}

// ─── Main Modal Shell ────────────────────────────────────────
export function LegalModals({ open, onClose, language = 'ar' }: LegalModalsProps) {
  if (!open) return null;

  const isEn = language === 'en';
  const isTerms = open === 'terms';
  const title = isTerms
    ? (isEn ? 'Terms & Conditions' : 'الشروط والأحكام')
    : (isEn ? 'Privacy Policy' : 'سياسة الخصوصية');
  const gradientFrom = isTerms ? 'from-green-500' : 'from-blue-500';
  const gradientTo = isTerms ? 'to-emerald-600' : 'to-indigo-600';
  const Icon = isTerms ? Scale : Lock;

  return (
    <AnimatePresence>
      <motion.div
        key="legal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[600px] max-h-[85vh] bg-gradient-to-b from-white to-amber-50/50 rounded-[32px] shadow-2xl border border-white/60 overflow-hidden flex flex-col"
          dir="rtl"
        >
          {/* Header */}
          <div className={`relative bg-gradient-to-l ${gradientFrom} ${gradientTo} px-6 py-5 flex-shrink-0`}>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-black text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {title}
                  </h2>
                  <p className="text-white/70 text-[11px]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {isEn ? 'Beit Al Reef Platform — app.bietalreef.ae' : 'منصة بيت الريف — app.bietalreef.ae'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">
            {isTerms ? <TermsContent isEn={isEn} /> : <PrivacyContent isEn={isEn} />}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 px-6 py-4 bg-white/60 backdrop-blur-sm border-t border-amber-200/40">
            <button
              onClick={onClose}
              className={`w-full py-3 bg-gradient-to-l ${gradientFrom} ${gradientTo} text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]`}
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              {isEn ? 'I Understand & Agree' : 'فهمت وأوافق'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Hook for easy usage ─────────────────────────────────────
export function useLegalModals() {
  const [openModal, setOpenModal] = useState<ModalType>(null);
  return {
    openModal,
    openTerms: () => setOpenModal('terms'),
    openPrivacy: () => setOpenModal('privacy'),
    closeModal: () => setOpenModal(null),
  };
}