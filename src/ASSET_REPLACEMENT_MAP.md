# خريطة استبدال الأصول

## قاعدة الاستبدال
```javascript
// قبل:
import logoImage from 'figma:asset/[hash].png';

// بعد:
const logoImage = '/assets/[name].png';
```

## خريطة الاستبدالات حسب الاستخدام

### الشعار الرئيسي
- `figma:asset/d512a20eff8d218ba0eff5a889eac0c02f3553c4.png` → `/assets/logo.png`
- `figma:asset/67fe2af1d169e9257cfb304dda040baf67b4e599.png` → `/assets/logo.png`
- `figma:asset/d511be10491685b74698700e1b2f0b83bfbe018f.png` → `/assets/logo-alt.png`

### شخصية ياك
- `figma:asset/ed8996075e578e8f4e57771f0159ce5e02192dc2.png` → `/assets/wayak-character.png`

### لقطات الشاشة
- `figma:asset/f03b9b5edd3cf05197c2488d88786ec2cc1f7c34.png` → `/assets/screenshot-tenders.png`
- `figma:asset/2a69f0cd081d8f1644f098152c707686afe3a976.png` → `/assets/screenshot-dashboard.png`
- `figma:asset/26d7eae296508fa5edee6b6abbff0d133c0ef3f5.png` → `/assets/screenshot-home.png`
- `figma:asset/1d3f7ac269fcb8922cef991f788ec0c45ba06aa3.png` → `/assets/placeholder.png`

### صور SEO الرئيسية
- `figma:asset/f31fb663b9d6a31c0caaaa60450967a76d857ec8.png` → `/assets/banner.png`
- `figma:asset/6e2f8dc830246f7d96dab741f0cf72861e3e32ad.png` → `/assets/future.png`
- `figma:asset/3a0ff19fab469caee5facc1108b05862ab9b3b55.png` → `/assets/all-in-one.png`

### شعارات وياك
- `figma:asset/92b178229bea63154a517ae70efb4bdcaa9c43ff.png` → `/assets/weyaak-full-logo.png`
- `figma:asset/ec23bc2d800c376efa4574b8c6c82d98ae0aa324.png` → `/assets/weyaak-brain-logo.png`
- `figma:asset/c33d475de03bd99055b12c89eb52fa7b9aa3f848.png` → `/assets/weyaak-gate-logo.png`

### إنفوجرافيك ترويجي
- `figma:asset/d670397f02af3b23cf59b36bfa1b156f66f0ccd3.png` → `/assets/ask-weyaak.png`
- `figma:asset/471b84d13b074fd36acd3c9ab9d9cd4d531316c7.png` → `/assets/smart-agents.png`
- `figma:asset/784a0913aa131412f96b8117b015d54a36795ace.png` → `/assets/catalog.png`
- `figma:asset/c090009d13fd6d93d81de37622a8328353a3fa3c.png` → `/assets/project-tools.png`

### ميزات المنصة
- `figma:asset/4393e16153114d09a2a7099b2869ff1a04bf5123.png` → `/assets/uae-network.png`
- `figma:asset/f3e016d0577e887b3d59eb56ebdb47efcd307642.png` → `/assets/store-digital.png`
- `figma:asset/a9234fbf3c505dd0e651206130925f92f6244222.png` → `/assets/dashboard-seo.png`
- `figma:asset/2658e1fa60816c6fa42395120ede898ec1a56e6a.png` → `/assets/ai-profile.png`

### صور ذكاء اصطناعي
- `figma:asset/c1c55e55c88c1f9497be24d40b6aa2ed3216e8e4.png` → `/assets/ai-search.png`
- `figma:asset/ac2f201a1d1e6acb37b5102e5e1ca8d606c68a7b.png` → `/assets/weyaak-intro.png`
- `figma:asset/f39d6d5ed09c452fdb136974a1554f104f386a1a.png` → `/assets/weyaak-task.png`
- `figma:asset/a0de6e5e829fc1ad58e3e6a6b8b9a05b930ce823.png` → `/assets/smart-agents-team.png`
- `figma:asset/cbab9d117cda03001fb11fac8699ab1c9b518d8e.png` → `/assets/complex-requests.png`

### صور GEO
- `figma:asset/648675d6d7db13bac9b0ee394beee7d1692bb190.png` → `/assets/audience-triad.png`
- `figma:asset/32929fdfcaaf858dcf8c78403ce5df49428c9476.png` → `/assets/seo-vs-geo.png`
- `figma:asset/22e9a8ef71e423f6dab329f90a9ce63f069b7db0.png` → `/assets/decoding-geo.png`
- `figma:asset/9dcd64e8de01096cd5886f13a1499444d4645800.png` → `/assets/amir-quote.png`
- `figma:asset/829b32c35b79e2e6f8fb4a49cfe2bb16cda35d21.png` → `/assets/ai-visibility-evolution.png`

### أدوات وحلول
- `figma:asset/194dd5f8d5e3a55d308c2ebd23feb2b5de3674f1.png` → `/assets/why-biet-alreef.png`
- `figma:asset/5d8a48a326d06057f3cb76492dd538d62aa0da97.png` → `/assets/contracts-management.png`
- `figma:asset/96f18ad2a63fcc0b0b076520db2496f89681d095.png` → `/assets/building-calculator.png`
- `figma:asset/797d311f0050c07b657c6a4e712616822dbed7f1.png` → `/assets/comprehensive-solution.png`
- `figma:asset/f57070a093969d6fc186a940f90b3fa941daaf52.png` → `/assets/price-comparator.png`
- `figma:asset/988654d7cd8996d03bdc09039a5b5b697257958d.png` → `/assets/lighting-calculator.png`
- `figma:asset/1ca302a1082e23de17113a297bd9b7b13ba3cc23.png` → `/assets/3d-design.png`

### أدوات CRM
- `figma:asset/d481113bf15cdfa3e60012a026924b7e29347afd.png` → `/assets/create-store.png`
- `figma:asset/0861e3bbb0eb272a3cf709ff014231a328c379fa.png` → `/assets/crm-templates.png`

### صور Shader/Auth
- `figma:asset/511e8304322a6f74dc1093d98427b9186af435a6.png` → `/assets/shader-canvas.png`
- `figma:asset/f09fc40097ceb1615e8e8e0091712f5d64926489.png` → `/assets/shader-btn-0.png`
- `figma:asset/6fa770a657ba2df8b512f8d4c7a994a75aaf5694.png` → `/assets/shader-btn-1.png`
- `figma:asset/4d7482c5015e3fb99626cab0ef1a661a5624561a.png` → `/assets/shader-btn-2.png`
- `figma:asset/23e55c8c9e97d531e351da43ce1f39918e8c2f51.png` → `/assets/shader-btn-3.png`

### شخصيات وأيقونات
- `figma:asset/20af6d62a39f1c858539f151117135f90fe0515b.png` → `/assets/mascot.png`
- `figma:asset/974a3f48f5d3dd71e0edcb044fd3a5ff786b8d0e.png` → `/assets/meeting.png`
- `figma:asset/db8b4c8789c8551ddb5381f5fee56b219124b4b2.png` → `/assets/user-placeholder.png`

### إنفوجرافيك SEO
- `figma:asset/aa2f2efe2767f5678f3a46bdbcb07f45267249ae.png` → `/assets/seo-infographic.png`
