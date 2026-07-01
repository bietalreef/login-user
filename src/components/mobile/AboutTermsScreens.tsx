import { motion } from 'motion/react';
import {
  ChevronLeft, Globe, Shield, Heart, Lightbulb, Users, Lock,
  Phone, Mail, MapPin, Clock, Scale, FileText, ExternalLink,
  Award, Building2, Sparkles, Target, BookOpen,
} from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';

/* ═══════════════════════════════════════════════════════
   قسم "من نحن"
   ═══════════════════════════════════════════════════════ */
export function AboutScreen({ onBack }: { onBack: () => void }) {
  const { language } = useTranslation();
  const isEn = language === 'en';

  const values = isEn ? [
    { icon: <Users className="w-5 h-5" />, title: 'Spirit of Union', desc: 'We work as one team — citizens and residents — to build a better future for our nation.' },
    { icon: <Shield className="w-5 h-5" />, title: 'Trust & Integrity', desc: 'The foundation of all our dealings. Every contract, every dirham, and every piece of information is a trust we uphold.' },
    { icon: <Sparkles className="w-5 h-5" />, title: 'Innovation & Leadership', desc: 'We use the latest AI technologies to deliver solutions no one has offered before.' },
    { icon: <Heart className="w-5 h-5" />, title: 'Community Service', desc: 'Our highest goal is to serve the people, ease their lives, and contribute to their well-being.' },
  ] : [
    { icon: <Users className="w-5 h-5" />, title: 'روح الاتحاد', desc: 'نعمل كفريق واحد، مواطنين ومقيمين، لبناء مستقبل أفضل لدولتنا.' },
    { icon: <Shield className="w-5 h-5" />, title: 'الثقة والأمانة', desc: 'هي أساس تعاملاتنا. كل عقد، كل درهم، وكل معلومة هي أمانة في أعناقنا.' },
    { icon: <Sparkles className="w-5 h-5" />, title: 'الابتكار والريادة', desc: 'نستخدم أحدث ما توصل إليه الذكاء الاصطناعي لنقدم حلولاً لم يسبقنا إليها أحد.' },
    { icon: <Heart className="w-5 h-5" />, title: 'خدمة المجتمع', desc: 'هدفنا الأسمى هو خدمة أهل الدار، وتسهيل حياتهم، والمساهمة في رفاهيتهم.' },
  ];

  const principles = isEn ? [
    { icon: <Lock className="w-4 h-4" />, title: 'Security', desc: 'A certified platform ensuring user data and contract protection.' },
    { icon: <Target className="w-4 h-4" />, title: 'Transparency', desc: 'Clear prices, real reviews, and precise tracking of all project stages.' },
    { icon: <Lightbulb className="w-4 h-4" />, title: 'Simplification', desc: 'Easy interfaces, fast processes, and AI that handles complex tasks for you.' },
    { icon: <Award className="w-4 h-4" />, title: 'Empowerment', desc: 'Empowering craftsmen, contractors, and citizens to manage their work anytime, anywhere.' },
  ] : [
    { icon: <Lock className="w-4 h-4" />, title: 'الأمان', desc: 'منصة موثقة تضمن حماية بيانات المستخدمين والعقود.' },
    { icon: <Target className="w-4 h-4" />, title: 'الشفافية', desc: 'أسعار واضحة، تقييمات حقيقية، ومتابعة دقيقة لكل مراحل المشروع.' },
    { icon: <Lightbulb className="w-4 h-4" />, title: 'التبسيط', desc: 'واجهات سهلة، إجراءات سريعة، وذكاء اصطناعي ينجز عنك المهام المعقدة.' },
    { icon: <Award className="w-4 h-4" />, title: 'التمكين', desc: 'نمكّن الحرفي والمقاول والمواطن من إدارة أعمالهم ومشاريعهم من أي مكان وفي أي وقت.' },
  ];

  return (
    <div className="min-h-screen bg-[#F5EEE1] pb-8" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#1F3D2B]/10 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-[#F5EEE1] transition-colors">
          <ChevronLeft className="w-5 h-5 text-[#1F3D2B] rotate-180" />
        </button>
        <h2 className="text-lg font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {isEn ? 'About Us' : 'من نحن'}
        </h2>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-bl from-[#2AA676] to-[#1F3D2B] px-6 pt-8 pb-10 text-center relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 -right-8 w-48 h-48 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🏡</span>
          </div>
          <h1 className="text-white text-2xl font-extrabold mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn ? 'Beit Al Reef' : 'بيت الريف'}
          </h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-xs mx-auto" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn
              ? 'A story from the land of Zayed, and a vision for the future'
              : 'قصة من دار زايد، ورؤية للمستقبل'
            }
          </p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 space-y-4">
        {/* Story */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-[#2AA676]" />
            <h3 className="font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Our Story' : 'قصتنا'}
            </h3>
          </div>
          <p className="text-sm text-[#1F3D2B]/70 leading-[1.9]" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn
              ? 'Beit Al Reef was born from the heart of the UAE, carrying the spirit of unity planted by the Founding Father, Sheikh Zayed bin Sultan Al Nahyan, may God rest his soul. We are not just a platform — we are an authentic Emirati home that combines the wisdom of the past with the ambition of the future, building a bridge of trust that connects everyone who builds on this blessed land. We launched from Al Ain City, Dar Al Zain, to be part of our nation\'s development journey, contributing to our wise leadership\'s vision of building the most prosperous digital economy in the world.'
              : 'وُلد "بيت الريف" من قلب الإمارات، حاملاً في طياته روح الاتحاد التي غرسها الوالد المؤسس الشيخ زايد بن سلطان آل نهيان، طيب الله ثراه. نحن لسنا مجرد منصة، بل نحن بيت إماراتي أصيل يجمع بين خبرة الماضي وطموح المستقبل، لنبني جسراً من الثقة يربط بين كل من يبني ويعمّر على هذه الأرض الطيبة. انطلقنا من مدينة العين، دار الزين، لنكون جزءاً من مسيرة التطور التي تشهدها دولتنا، مساهمين في تحقيق رؤية قيادتنا الرشيدة في بناء اقتصاد رقمي هو الأكثر ازدهاراً في العالم.'
            }
          </p>
        </motion.div>

        {/* Vision */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-[#C8A86A]" />
            <h3 className="font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Our Vision: Following Leadership' : 'رؤيتنا: على خطى القيادة'}
            </h3>
          </div>
          <p className="text-sm text-[#1F3D2B]/70 leading-[1.9] mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn
              ? 'We draw our vision directly from the directives of His Highness Sheikh Mohamed bin Zayed Al Nahyan, President of the UAE, in accelerating digital transformation and adopting artificial intelligence as a core pillar of the UAE\'s future. "Beit Al Reef" is a practical embodiment of this vision, aspiring to be the leading platform that puts the tools of the future in the hands of every citizen and resident.'
              : 'نحن نستلهم رؤيتنا مباشرة من توجيهات صاحب السمو الشيخ محمد بن زايد آل نهيان، رئيس الدولة حفظه الله، في تسريع وتيرة التحول الرقمي والاعتماد على الذكاء الاصطناعي كركيزة أساسية لمستقبل الإمارات. "بيت الريف" هي تجسيد عملي لهذه الرؤية، حيث نسعى لنكون المنصة الرائدة التي تضع أدوات المستقبل بين يدي كل مواطن مقيم.'
            }
          </p>
          {/* Quote */}
          <div className="bg-gradient-to-l from-[#F5EEE1] to-[#FFF8F0] rounded-xl p-4 border border-[#E8DCC8]">
            <p className="text-sm text-[#1F3D2B] italic leading-relaxed mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn
                ? '"We must accelerate the pace of digital transformation because the world will not wait for us."'
                : '"يجب أن نسرّع وتيرة التحول الرقمي لأن العالم لن ينتظرنا."'
              }
            </p>
            <p className="text-xs text-[#C8A86A] font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn
                ? 'H.H. Sheikh Mohamed bin Zayed Al Nahyan'
                : 'صاحب السمو الشيخ محمد بن زايد آل نهيان'
              }
            </p>
          </div>
          <p className="text-sm text-[#1F3D2B]/70 leading-[1.9] mt-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn
              ? 'We are committed to being at the forefront of this transformation, contributing to UAE Vision 2030 by providing a smart and secure digital infrastructure that supports the contracting and construction sector, one of the most important pillars of our national economy.'
              : 'نحن ملتزمون بأن نكون في طليعة هذا التحول، مساهمين في تحقيق رؤية الإمارات 2030 من خلال توفير بنية تحتية تقنية ذكية وآمنة تدعم قطاع المقاولات والبناء، أحد أهم أعمدة اقتصادنا الوطني.'
            }
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-[#2AA676]" />
            <h3 className="font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Our Mission: Building Trust & Simplifying Life' : 'مهمتنا: بناء الثقة وتبسيط الحياة'}
            </h3>
          </div>
          <p className="text-sm text-[#1F3D2B]/70 leading-[1.9] mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn
              ? 'In line with the directives of the Department of Municipalities and Transport and Al Ain City Municipality, our mission is to simplify procedures and make life easier. We believe technology should serve people, not the other way around. That\'s why we built a secure and reliable platform that ensures transparency, protects rights, and makes building and construction a smooth and enjoyable experience.'
              : 'تماشياً مع تعليمات إدارة البلديات والنقل وبلدية مدينة العين، تتمثل مهمتنا في تبسيط الإجراءات وتسهيل حياة الناس. نحن نؤمن بأن التكنولوجيا يجب أن تكون في خدمة الإنسان، لا العكس. لذلك، قمنا ببناء منصة آمنة وموثوقة تضمن الشفافية، تحفظ الحقوق، وتجعل من عملية البناء والتعمير تجربة سهلة وممتعة.'
            }
          </p>
          {/* Principles Grid */}
          <div className="grid grid-cols-2 gap-3">
            {principles.map((p, i) => (
              <div key={i} className="bg-[#F8FAFB] rounded-xl p-3 border border-gray-100">
                <div className="w-8 h-8 bg-[#2AA676]/10 rounded-lg flex items-center justify-center text-[#2AA676] mb-2">{p.icon}</div>
                <h4 className="text-xs font-bold text-[#1F3D2B] mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>{p.title}</h4>
                <p className="text-[10px] text-[#1F3D2B]/60 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[#C8A86A]" />
            <h3 className="font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Our Values: Emirati Heritage, Global Technology' : 'قيمنا: أصالة إماراتية، وتقنية عالمية'}
            </h3>
          </div>
          <div className="space-y-3">
            {values.map((v, i) => (
              <div key={i} className="flex items-start gap-3 bg-gradient-to-l from-[#F5EEE1]/50 to-transparent p-3 rounded-xl">
                <div className="w-10 h-10 bg-[#2AA676]/10 rounded-xl flex items-center justify-center text-[#2AA676] shrink-0 mt-0.5">{v.icon}</div>
                <div>
                  <h4 className="text-sm font-bold text-[#1F3D2B] mb-0.5" style={{ fontFamily: 'Cairo, sans-serif' }}>{v.title}</h4>
                  <p className="text-xs text-[#1F3D2B]/60 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Closing */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gradient-to-l from-[#2AA676]/10 to-[#C8A86A]/10 rounded-2xl p-5 border border-[#2AA676]/20">
          <p className="text-sm text-[#1F3D2B] text-center leading-[1.9] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn
              ? 'Beit Al Reef is not just a company — it is a pledge we made to ourselves: to be builders of trust, pioneers of the future, and loyal sons of the land of Zayed.'
              : 'بيت الريف ليس مجرد شركة، بل هو عهد قطعناه على أنفسنا بأن نكون بناة للثقة، ورواداً للمستقبل، وأبناءً أوفياء لدار زايد.'
            }
          </p>
        </motion.div>

        {/* Website Link */}
        <motion.a
          href="https://app.bietalreef.ae"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 bg-white rounded-2xl p-4 shadow-sm text-[#2AA676] font-bold"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          <Globe className="w-5 h-5" />
          <span>app.bietalreef.ae</span>
          <ExternalLink className="w-4 h-4" />
        </motion.a>

        {/* Contact */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn ? 'Contact Us' : 'تواصل معنا'}
          </h3>
          <div className="space-y-2">
            {[
              { icon: <Mail className="w-4 h-4" />, text: 'support@bietalreef.ae' },
              { icon: <Phone className="w-4 h-4" />, text: '0097126789000' },
              { icon: <MapPin className="w-4 h-4" />, text: isEn ? 'Abu Dhabi — UAE' : 'أبوظبي — الإمارات العربية المتحدة' },
              { icon: <Clock className="w-4 h-4" />, text: isEn ? '9 AM - 6 PM (Mon - Fri)' : '9 صباحاً - 6 مساءً (الإثنين - الجمعة)' },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-[#1F3D2B]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                <span className="text-[#2AA676]">{c.icon}</span>
                <span>{c.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   قسم "الشروط والأحكام"
   ═══════════════════════════════════════════════════════ */
export function TermsScreen({ onBack }: { onBack: () => void }) {
  const { language } = useTranslation();
  const isEn = language === 'en';

  const sections = isEn ? [
    {
      num: '1',
      title: 'Introduction & Definitions',
      items: [
        'Beit Al Reef reserves the legal right to modify or cancel any of these terms and conditions at any time at its sole discretion. Continued use of the platform after any modification constitutes explicit legal acceptance of the modified terms.',
        'The Platform is a licensed digital space that operates as a technical intermediary between sellers and buyers, facilitating commercial transactions in accordance with local legislation governing commercial activities in the UAE.',
        'The "Wayak" assistant is a smart tool that provides automated support and interaction services to users, without representing legal or financial consultation.',
        'Privacy Commitment: Personal data is collected and used only in accordance with the Privacy Policy and in compliance with the Personal Data Protection Law (PDPL).',
        'The use of any unauthorized software tools to access the platform or extract data from it in any way is prohibited.',
        'Definitions:\n• Platform: Beit Al Reef website and mobile application.\n• User: Any natural or legal person using the platform.\n• Seller: Registered provider offering products or services.\n• Buyer: User contracting to purchase a product or service.\n• Wayak: The platform\'s smart assistant.\n• Services: All services offered within the platform, free or paid.',
      ],
    },
    {
      num: '2',
      title: 'Registration & Use',
      items: [
        'Users must be at least 18 years of age.',
        'Users commit to providing accurate and up-to-date information.',
        'The platform reserves the right to verify identity and official documents before activating accounts.',
        'Registration on the platform constitutes legal acknowledgment of acceptance of these terms and conditions.',
      ],
    },
    {
      num: '3',
      title: 'Packages & Paid Services',
      items: [
        'Beit Al Reef offers monthly and annual subscription packages including various services such as featured listings, design tools, and extended technical support. Fees vary by package type and features.',
        'Standalone paid services are also available separately, including engineering consultation, interior design, and maintenance services.',
        'All fees include 5% Value Added Tax (VAT), and official approved invoices are issued.',
        'The platform reserves the right to modify package or service prices with 30 days notice to users before implementation.',
      ],
    },
    {
      num: '4',
      title: 'Pre-contracts & Legal Obligations',
      items: [
        'Beit Al Reef adopts bilateral contracts that are electronically signed between the provider and user through the platform.',
        'These contracts are legally binding under UAE Labor Law, municipal legislation, and court complex regulations.',
        'The platform is not a party to these contracts but acts as a technical intermediary for documentation and follow-up.',
        'Contracting parties bear full responsibility for executing contract terms in accordance with applicable regulations.',
      ],
    },
    {
      num: '5',
      title: 'Privacy & Data Protection',
      items: [
        'The platform commits to protecting user data using modern encryption systems and strict security standards.',
        'No data is shared with external parties without user consent or upon official request from competent authorities.',
        'Users have the right to access, correct, or delete their personal data in accordance with the UAE Personal Data Protection Law.',
      ],
    },
    {
      num: '6',
      title: 'Liability & Warranty',
      items: [
        'The platform bears no responsibility for disputes or disagreements arising between users or contracting parties.',
        'Services are provided "AS IS" without any express or implied warranties.',
        'Maximum platform liability does not exceed the value of the service provided or fees paid.',
      ],
    },
    {
      num: '7',
      title: 'Service Termination & Account Suspension',
      items: [
        'Users may close their accounts at any time after settling all financial obligations.',
        'The platform reserves the legal right to suspend or cancel accounts without prior notice in cases of:\n• Violation of laws or terms.\n• Unlawful use of the platform.\n• Fraudulent activities or repeated complaints.',
        'Upon termination, fees paid for partially or fully used services are not refundable.',
      ],
    },
    {
      num: '8',
      title: 'Laws & Dispute Resolution',
      items: [
        'These terms and conditions are governed by the laws of the United Arab Emirates.',
        'Any dispute shall first be resolved through legal mediation; if that fails, recourse shall be to commercial arbitration approved by the Abu Dhabi Courts Complex.',
        'The platform reserves the right to take any necessary legal actions to protect its rights and interests.',
      ],
    },
  ] : [
    {
      num: '٢',
      title: 'التسجيل والاستخدام',
      items: [
        'يجب أن يكون المستخدم قد أتم 18 عاماً على الأقل.',
        'يلتزم المستخدم بتقديم بيانات دقيقة وحديثة.',
        'تتحمل المنصة حق التحقق من الهوية والوثائق الرسمية قبل تفعيل الحساب.',
        'يعتبر التسجيل في المنصة إقراراً قانونياً بقبول هذه الشروط والأحكام.',
      ],
    },
    {
      num: '٣',
      title: 'الباقات والخدمات المدفوعة',
      items: [
        'تقدم منصة بيت الريف باقات اشتراك شهرية وسنوية تشمل خدمات متنوعة مثل الإعلانات المميزة، أدوات التصميم، والدعم الفني الموسع. تختلف الرسوم حسب نوع الباقة ومزاياها.',
        'تتوفر أيضاً خدمات مستقلة مدفوعة بشكل منفصل، وتشمل الاستشارات الهندسية، التصميم الداخلي، وخدمات الصيانة.',
        'جميع الرسوم تشمل ضريبة القيمة المضافة بنسبة 5٪، وتصدر فواتير رسمية معتمدة.',
        'تحتفظ المنصة بحق تعديل أسعار الباقات أو الخدمات مع إشعار المستخدم قبل 30 يوماً من التنفيذ.',
      ],
    },
    {
      num: '٤',
      title: 'العقود المسبقة والالتزامات القانونية',
      items: [
        'تعتمد منصة بيت الريف العقود الثنائية التي يتم توقيعها إلكترونياً بين المزود والمستخدم عبر المنصة.',
        'تعتبر هذه العقود ملزمة قانونياً وفق أحكام قانون العمل الإماراتي، وتشريعات البلديات المحلية، ولوائح مجمع المحاكم.',
        'لا تُعد المنصة طرفاً في تلك العقود، لكنها تعمل كوسيط تقني لتوثيقها ومتابعتها.',
        'تتحمل الأطراف المتعاقدة المسؤولية الكاملة عن تنفيذ بنود العقد وفق الأنظمة المعمول بها.',
      ],
    },
    {
      num: '٥',
      title: 'الخصوصية وحماية البيانات',
      items: [
        'تلتزم المنصة بحماية بيانات المستخدمين باستخدام أنظمة تشفير حديثة ومعايير أمنية صارمة.',
        'لا تتم مشاركة أي بيانات مع أطراف خارجية إلا بموافقة المستخدم أو بناءً على طلب رسمي من الجهات المختصة.',
        'يحق للمستخدم الوصول إلى بياناته الشخصية أو طلب تصحيحها أو حذفها وفق قانون حماية البيانات الشخصية الإماراتي.',
      ],
    },
    {
      num: '٦',
      title: 'المسؤولية والضمان',
      items: [
        'لا تتحمل المنصة أي مسؤولية عن النزاعات أو الخلافات التي تنشأ بين المستخدمين أو الأطراف المتعاقدة.',
        'تُقدَّم الخدمات كما هي (AS IS) دون أي ضمانات صريحة أو ضمنية.',
        'الحد الأقصى لمسؤولية المنصة لا يتجاوز قيمة الخدمة المقدمة أو الرسوم المدفوعة.',
      ],
    },
    {
      num: '٧',
      title: 'إنهاء الخدمة وتعليق الحسابات',
      items: [
        'يحق للمستخدم إغلاق حسابه في أي وقت بعد تسوية جميع الالتزامات المالية.',
        'تحتفظ المنصة بحقها القانوني في تعليق أو إلغاء الحساب دون إشعار مسبق ف�� حال:\n• مخالفة القوانين أو الشروط.\n• استخدام غير مشروع للمنصة.\n• أنشطة احتيالية أو بلاغات متكررة.',
        'في حال الإنهاء، لا يتم استرداد الرسوم المدفوعة للخدمات التي تم استخدامها جزئياً أو كلياً.',
      ],
    },
    {
      num: '٨',
      title: 'القوانين وتسوية المنازعات',
      items: [
        'تخضع هذه الشروط والأحكام لقوانين دولة الإمارات العربية المتحدة.',
        'يتم حل أي نزاع أولاً بالوساطة القانونية، وفي حال تعذر ذلك، يتم اللجوء إلى التحكيم التجاري المعتمد في مجمع محاكم أبوظبي.',
        'يحق للمنصة اتخاذ أي إجراءات قانونية ضرورية لحماية حقوقها ومصالحها.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5EEE1] pb-8" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#1F3D2B]/10 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-[#F5EEE1] transition-colors">
          <ChevronLeft className="w-5 h-5 text-[#1F3D2B] rotate-180" />
        </button>
        <h2 className="text-lg font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {isEn ? 'Terms & Conditions' : 'الشروط والأحكام'}
        </h2>
      </div>

      {/* Title Banner */}
      <div className="bg-gradient-to-bl from-[#1F3D2B] to-[#0F2518] px-6 pt-6 pb-8 text-center">
        <Scale className="w-10 h-10 text-[#C8A86A] mx-auto mb-3" />
        <h1 className="text-white text-xl font-extrabold mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {isEn ? 'Legal Terms & Conditions' : 'الشروط والأحكام القانونية'}
        </h1>
        <p className="text-white/60 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {isEn ? 'Beit Al Reef Platform' : 'منصة بيت الريف'}
        </p>
      </div>

      <div className="px-4 -mt-3 relative z-10 space-y-3">
        {/* Intro Note */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-2">
            <BookOpen className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn
                ? 'This document was prepared in accordance with the federal laws of the UAE, including the Electronic Transactions Law, Labor Law, Personal Data Protection Law No. 45 of 2021, and municipal and court complex regulations. By using Beit Al Reef, you agree to full compliance with all terms below.'
                : 'تم إعداد هذه الوثيقة وفق القوانين الاتحادية لدولة الإمارات العربية المتحدة، بما في ذلك قانون المعاملات الإلكترونية، قانون العمل، قانون حماية البيانات الشخصية رقم 45 لسنة 2021، ولوائح البلديات ومجمع المحاكم. باستخدامكم لمنصة بيت الريف، فإنكم توافقون على الالتزام التام بجميع البنود الواردة أدناه.'
              }
            </p>
          </div>
        </motion.div>

        {/* Sections */}
        {sections.map((s, sIdx) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * sIdx }}
            className="bg-white rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-[#1F3D2B] text-white rounded-lg flex items-center justify-center text-sm font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {s.num}
              </div>
              <h3 className="font-bold text-[#1F3D2B] text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>{s.title}</h3>
            </div>
            <div className="space-y-2.5">
              {s.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#2AA676] text-xs font-bold mt-1 shrink-0">{s.num}.{i + 1}</span>
                  <p className="text-xs text-[#1F3D2B]/70 leading-[1.9] whitespace-pre-line" style={{ fontFamily: 'Cairo, sans-serif' }}>{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Contact Section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-5 h-5 text-[#2AA676]" />
            <h3 className="font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Contact Us' : 'التواصل معنا'}
            </h3>
          </div>
          <p className="text-xs text-[#1F3D2B]/60 mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn ? 'For inquiries, complaints, and legal correspondence:' : 'للاستفسارات والشكاوى والمراسلات القانونية:'}
          </p>
          <div className="space-y-2">
            {[
              { icon: <Mail className="w-4 h-4" />, text: 'support@bietalreef.ae' },
              { icon: <Phone className="w-4 h-4" />, text: '0097126789000' },
              { icon: <MapPin className="w-4 h-4" />, text: isEn ? 'Abu Dhabi — UAE' : 'أبوظبي — الإمارات العربية المتحدة' },
              { icon: <Clock className="w-4 h-4" />, text: isEn ? '9 AM - 6 PM (Mon - Fri)' : '9 صباحاً - 6 مساءً (الإثنين - الجمعة)' },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-[#1F3D2B]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                <span className="text-[#2AA676]">{c.icon}</span>
                <span>{c.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Legal Disclaimer */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="bg-[#1F3D2B] rounded-2xl p-4 text-center">
          <Shield className="w-6 h-6 text-[#C8A86A] mx-auto mb-2" />
          <p className="text-xs text-white/80 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn
              ? 'This document has been reviewed and approved by the Legal Department of Beit Al Reef Platform, and serves as a binding reference for all users and providers. It is periodically updated in accordance with local regulations.'
              : 'تمت مراجعة هذه الوثيقة واعتمادها من قبل الإدارة القانونية لمنصة بيت الريف، وهي تمثل مرجعاً ملزماً لجميع المستخدمين والمزودين، وتُحدّث بشكل دوري بما يتوافق مع الأنظمة المحلية.'
            }
          </p>
        </motion.div>
      </div>
    </div>
  );
}