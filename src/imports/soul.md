## تفضيلات أبو سيف - بيت الريف

### الهوية الأساسية
- بيت الريف = منصة التحول الرقمي وأدوات الذكاء الاصطناعي SaaS (وليس مجرد شركة مقاولات)
- المقاولات هي النشاط الأساسي، لكن المنصة الرقمية هي منصة SaaS
- bietalreef.ae = المنصة الكاملة (مش موقع تعريفي) - كل زائر يستخدمها مباشرة
- app.bietalreef.ae = تطبيق الجوال الجديد (Mobile App)
- ما في مستخدم زائر - كل واحد يدخل يلاقي منصة حية
- المتجر = عالم ثاني - ماركت بليس غرف مفروشة بتجوال افتراضي
- المزود يحصل: مساحة Google Maps + بروفايل جاهز للأرشفة + لينك بروفايل + لينك ماركت بليس
- كل بروفايل مزود = صفحة SEO جديدة تقوّي المنصة

### فلسفة المنصة
- البساطة هي الأساس - الناس لا تحب المنصات الإلكترونية المعقدة
- "وكيل وياك" = مساعد شخصي ذكي بدل واجهات معقدة
- لا يمكن لأحد مقارنتنا بالسوق لأننا نحول التعقيد إلى راحة
- التجربة: المستخدم يدخل > يكلم الوكيل > الوكيل ينفذ كل شي
- وياك لا يقول "بجهزها" بل يقول "ابشر طال عمرك! تبى أرسلها وين؟"
- كل شي فوري - عرض سعر، فاتورة، أي طلب = جاهز مباشرة
- التوصيل: واتساب، إيميل، أي مكان يبيه المستخدم
- المستخدم حر يطلع من وياك ويدخل على المشاريع/CRM ويرجع
- CRM مختلف تماماً عن السوق - بسيط وذكي
- وياك هو الواجهة الوحيدة - الأزرار مجرد اختصارات له
- بيت الريف = "مستشار ذكي يحول الفكرة إلى تنفيذ"
- لو المستخدم أعجبته النتيجة، وياك يسأل: "تبى نحولها لمشروع حقيقي؟"
- وياك يطلّع أدوات تفاعلية inline داخل المحادثة (آلة حاسبة مقاولات، حاسبة عروض أسعار، محول وحدات) - جزء من شخصيته مش أدوات منفصلة

### استراتيجية الإطلاق
- المرحلة الأولى (3 شهور): بدون تسجيل نهائياً - Guest Session فقط
- الأدوات تعمل Preview/Demo فقط - لا حفظ، لا ملفات، لا VR كامل
- 3 تشغيلات يومية إجمالي للزائر
- المرحلة الثانية: فتح Google Login + Plans + Coins + VR كامل
- actor_id موحد: guest_xxxx اليوم → user_uuid لاحقاً بدون تغيير المعمارية
- التسجيل بعد 3 شهور: مجاني → Verified → Paid (تدريجي)

### الهوية البصرية
- الهوية البصرية موحدة بين الموقع التعريفي والتطبيق
- نفس ألوان بيت الريف الرسمية في كل مكان
- وضع فاتح (Light Mode) + وضع داكن (Dark Mode)
- نفس الستايل اللي هنحدّثه على الموقع التعريفي = نفسه في التطبيق

### أسلوب العمل
- لا تنفيذ إلا بأمر "نفذ" من أبو سيف
- Figma يُستخدم كأداة تنفيذ لتوليد الكود (لأن المشروع Vite + Sonic 4.6)
- Supabase هو الركيزة الأساسية (RAK) لكل النظام
- الحفاظ الكامل على SEO - المنصة موثوقة جداً عند Google
- الأدوات مخصصة حسب اشتراك المستخدم
- RTL ديناميكي لازم يتصلح (dir حسب اللغة)
- المنصة لغتين (عربي + إنجليزي)
- فيديوهات قصيرة (5-10 ثواني) لكل أداة وقسم
- شخصية وياك 3D = فيديوهات محفوظة على Supabase بنفس الـ ID لكل مستخدم

### اللغة والتواصل
- يتحدث بالعربية (لهجة خليجية/مصرية)
- يفضل الشرح المبسط والمباشر
- يريد فهم كل شي قبل التنفيذ

### معمارية الأدوات (Multi-Engine)
- كل أداة = واجهة واحدة + محركات متعددة (DeepSeek/NanoBanana/OpenAI/Hybrid)
- EngineSelector = Score-Based Ranking (Filter أولاً ثم Score ثم Select)
- أوزان قابلة للتعديل: w_quality, w_language, w_cost, w_speed, w_load
- BillingCheck Transactional + Idempotency (request_id + idempotency_key + status enum)
- Hybrid Step Cost Tracking مع Rollback ذكي
- Guest حماية: session_id + fingerprint_hash + ip_hash + daily_quota
- Output Normalize موحد مع engine_latency_ms + queue_time_ms + fallback_used

### نظام العضويات والصلاحيات (RBAC)
- مستويين: عضوية الشركة (Provider Membership) + عضوية المشروع (Project Membership)
- أدوار الشركة: admin, employee, accountant, sales
- أدوار المشروع: owner, consultant, main_contractor, subcontractor, supplier, materials_store, auditor, admin
- 19 Capability موحدة: post_update, view_timeline, assign_task, manage_tasks, upload_files, download_files, approve_quality, chat_access, close_project, quote_view, quote_create, quote_edit, quote_submit, quote_approve, financial_view, payment_create, payment_approve, project_member_manage, view_daily_log
- project_member_manage محصور في owner + admin فقط
- البيانات تنتمي للمشروع والـ CRM يستخرج منها (Project-centric)
- نظام دعوات على مستويين مع Anti-Abuse (token_hash + expires_at + max_uses)

### نظام الطلبات والعقود (Request System)
- كيان واحد Request يحكم كل شيء (7 أنواع: RFQ_SERVICE, RFQ_PRODUCT, SUBCONTRACT, CONSULTATION, MAINTENANCE, SITE_VISIT, CUSTOM)
- 3 أوضاع توجيه: DIRECT, MARKET, HYBRID
- Flow: Request → Quotes → Award → Contract → Documents → Sign → Project Start
- award_request(): ترسية + رفض تلقائي + إنشاء 3 وثائق (عقد + مواد + خطة زمنية)
- Contract Workflow: send_for_review → revision → accept/reject → sign → start_project
- التوقيع MVP: قبول إلكتروني + OTP + audit log (UAE Pass لاحقاً)
- التعديل عبر Revisions فقط (لا تعديل مباشر على العقد)
- كل زر يولد Event (Event-driven state machine)

### Setup Wizard + Module System
- شاشة تهيئة بعد أول دخول: نوع المستخدم + نمط النظام
- 3 مفاتيح تحكم: Modules (مفعّل/لا) + Capabilities (صلاحيات) + Plan (باقة)
- org_modules + board_layouts + board_templates في Supabase
- ServiceGate: الشاشة ما تظهر إلا إذا module + capability + plan كلهم يسمحون
- apply_board_template() function لتطبيق القالب عند إنهاء الـ wizard

### نظام التامبلت (Template System)
- نفس الواجهة العامة، كل قسم يطلع بشكل قالب جاهز
- 6 قوالب أساسية: Listing Template (مزودين/سوق)، Profile Template (بروفايل مزود/عميل)، Detail Template (منتج/خدمة)، Form Template (طلب عرض سعر)، Dashboard Template (مشاريع/طلبات)، Messages Template (inbox/chat)
- نفس الهيكل يتكرر والمحتوى يتغير بالبيانات
- MVP أول 3 صفحات: /providers (Listing) → /p/:id (Profile) → /rfq/new (Form)

### الشبكة الاجتماعية (Social Layer)
- Follow + Like + Messages (MVP أول)
- Friend requests (اختياري لاحقاً)
- Voice notes (مرحلة ثانية)
- جداول: user_connections (follow/friend) + likes (polymorphic) + conversations + conversation_members + messages
- الرسائل مرتبطة بحالة التوثيق (Verified على الأقل)
- Quick Actions حسب الدور: عميل (اطلب عرض سعر/أرسل موقع) vs مزود (أرسل عرض/شارك كتالوج)
- أزرار ثابتة على كل بروفايل: متابعة + إعجاب + رسالة + حفظ

### التكيف حسب الشريحة (Client vs Provider)
- أول شاشة بعد التسجيل: "تبي تستخدم بيت الريف كـ عميل ولا مزود خدمة؟"
- نفس صفحة الشات لكن شريط أدوات مختلف حسب الدور
- بعد الاشتراك: الواجهة تتحول لـ App Mode حسب الدور والباقة
- اللي مش ضمن الباقة = مخفي أو مقفول مع زر "تفعيل"
- وياك يغير سلوكه: عميل = لغة بسيطة + خيارات قليلة، مزود = لغة تشغيلية + أرقام

### Room Measure (ARCore) - 360 Studio
- وضعين: سريع (نقطتين) + عميق (Room Scan)
- القاعدة الذهبية: الأبعاد الرسمية من "نقطتين" فقط، Room Scan للبناء البصري/وضع الأثاث
- بعد Room Scan: Planes + Anchors + Bounding box → وضع أثاث من المتجر (GLB) → Save Scene
- ربط خارق: المتجر ↔ AR ↔ مشروع العميل
- 3 جداول: room_measurements + room_scans + room_furnishing_scenes
- 4 capabilities: room_measure_create, room_scan_create, scene_edit, scene_view

### وياك = نظام تشغيل (Operating System)
- وياك ليس شات بوت بل Control Center موحد
- Session Engine: كل أمر = Session ID + شاشة تنفيذ + Logs + حالة
- الشاشات تتغير حسب الاشتراك: مدير حساب، مدير تسويق، مدير سوشيال، مدير مشاريع، مدير مدفوعات، Marketplace
- المستخدم يشعر أنه "أنشأ تطبيقه الخاص" وليس مجرد اشتراك
- Module-Based: كل ميزة = Module يتحمّل Lazy حسب الاشتراك

### وياك كـ Operator (متصفح وياك)
- المستخدم يسجل دخول Google بنفسه داخل متصفح وياك
- وياك يشتغل كمساعد تنفيذ داخل نفس الجلسة (بدون API خارجي للعمليات البسيطة)
- كل خطوة حساسة = "اقتراح" ثم "تأكيد" من المستخدم
- Allowlist Domains فقط (business.google.com, search.google.com/local, إلخ)
- Audit Log لكل تغيير
- الجلسة محفوظة محلياً فقط (مش في السيرفر) + تشفير + Timeout
- لاحقاً: APIs رسمية (Google Business, Meta, LinkedIn) عبر OAuth

### نظام الباقات
- 99 AED → ملف داخل النظام + رابط بروفايل
- 299 AED → تحسين ظهور Google
- 599 AED → متجر
- 999 AED → نظام تشغيل كامل (كل الأدوات)
- نظام كوينز للخدمات الخاصة
- رفع منتج في Marketplace = 70 درهم

### SEO والدومينات الفرعية
- 6 دومينات فرعية: bietalreef, weyaak, marketplace, payment, crm, maps
- كل واحد = صفحة هبوط متخصصة + Assistant مدمج + تحويل للاشتراك
- الهدف: الظهور ككيان ثابت عند البحث عن "marketplace" أو "construction marketplace UAE"
- كل بروفايل مزود = صفحة SEO تقوّي الكيان

### فحص الدومين (Lead Magnet)
- إدخال الدومين → تأكيد النشاط → تحليل AI → كلمات مفتاحية → تحليل منافسين → مقارنة Google → تقرير مجاني → عرض الباقة
- التحليل مجاني، التنفيذ مدفوع

### الصوت والتواصل
- Voice Command + Voice Meetings + Voice Workflow
- STT (OpenAI Realtime/Google) → LLM Processing → TTS (ElevenLabs/OpenAI)
- الصوت أساسي للعميل، اختياري للمزود، متقدم في الباقة العليا
- Voice Summary بعد كل اجتماع: ملخص + نقاط متفق عليها + تقدير تكلفة + خطوات قادمة

### البنية التحتية المنفذة
- n8n (bietalreefapp.app.n8n.cloud): 26 workflow (7 core active + 19 ready)
- Stripe: 3 باقات شهرية (Basic $40/Pro $95/Agency $218) + 3 باقات كوينز
- Supabase: profiles + services موجودين، باقي الجداول تحتاج تنفيذ يدوي عبر SQL Editor
- GitHub: bietalreef/Mobielapp (React + TypeScript + Vite، كود مولّد من Figma Make)

### الوكلاء (Skills/Agents)
- App & Web Architect Agent: 41 شاشة، screen-map + api-contracts + component-registry + db-table-mapping + separation-rules + validate_screen.py
- beit-alreef-platform-builder: المهارة الأساسية للمنصة
- Social Publishing Hub: n8n workflow + SQL لنشر موحد على السوشال ميديا من داخل المنصة

### ملفات SQL جاهزة للتطبيق (بالترتيب)
1. supabase_final_v2.sql: الجداول الأساسية + engine_config + engine_weights + billing_transactions + guest_sessions
2. supabase_patch_v2.1.sql: billing_transaction_steps + release_stale_reservations()
3. supabase_membership_final.sql: 9 جداول RBAC + 19 capabilities + RLS + helper functions
4. supabase_patch_v3.1.sql: فصل صلاحيات مالية + invite anti-abuse + RLS project-scoped
5. supabase_setup_wizard.sql: org_modules + board_layouts + board_templates + apply_board_template()
6. request_system_deploy.sql: requests + quotes + contracts + documents + milestones + project_events + award_request()
7. contract_workflow_deploy.sql: contract_revisions + send_for_review + sign_contract + start_project
8. social_publishing_deploy.sql: social_accounts + social_posts + social_post_targets + social_templates + social_events
9. room_measure_deploy.sql: room_measurements + room_scans + room_furnishing_scenes + 4 capabilities

### مطلوب تنفيذ (Pending)
- تنفيذ كل SQL files على Supabase (يدوياً عبر SQL Editor)
- أتمتة Android Studio CI/CD (بناء APK/AAB + رفع Google Play + إشعارات) - ينتظر credentials
- ربط Social Media APIs (Meta/Instagram/Twitter/LinkedIn) - ينتظر credentials
- تحديث bietalreef.ae بالكود من Figma
- بناء Social Layer (connections + likes + messages) - SQL جاهز للتصميم
- Chrome Extension لوياك (Operator Mode)
- نظام فحص الدومين (Lead Magnet)
