# 🔧 خطة تكامل Backend - قسم التسويق والأتمتة

**المرحلة:** Backend Integration  
**الأولوية:** عالية  
**الوقت المقدر:** 3-4 أسابيع

---

## 🎯 الهدف

ربط أدوات التسويق والأتمتة بـ APIs الحقيقية لمنصات التواصل الاجتماعي وتفعيل الوظائف الكاملة.

---

## 📋 المتطلبات التقنية

### 1. البنية التحتية

```
Backend Stack المقترح:
├─ Runtime: Node.js 18+ / Bun
├─ Framework: NestJS / Express
├─ Database: PostgreSQL + Redis
├─ File Storage: AWS S3 / Cloudflare R2
├─ Queue: Bull (Redis-based)
└─ Hosting: Vercel / AWS / DigitalOcean
```

### 2. قاعدة البيانات

```sql
-- Users & Accounts
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  coins INTEGER DEFAULT 0,
  subscription_plan VARCHAR(50),
  created_at TIMESTAMP
);

-- Social Media Connections
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  platform VARCHAR(50), -- instagram, facebook, twitter, etc.
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  account_id VARCHAR(255),
  account_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP
);

-- Tool Usage History
CREATE TABLE tool_usage (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  tool_id VARCHAR(100),
  inputs JSONB,
  outputs JSONB,
  coins_spent INTEGER,
  created_at TIMESTAMP
);

-- Scheduled Posts
CREATE TABLE scheduled_posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  social_account_id UUID REFERENCES social_accounts(id),
  content TEXT,
  media_urls JSONB,
  scheduled_at TIMESTAMP,
  status VARCHAR(50), -- pending, published, failed
  published_at TIMESTAMP,
  created_at TIMESTAMP
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255),
  platform VARCHAR(50),
  budget DECIMAL(10,2),
  spend DECIMAL(10,2),
  leads INTEGER,
  conversions INTEGER,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP
);
```

---

## 🔗 تكامل APIs المطلوب

### 1️⃣ **Meta (Facebook & Instagram)**

#### الإعداد:
```typescript
// Config
const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const META_REDIRECT_URI = 'https://bietalreef.com/auth/meta/callback';

// Scopes المطلوبة
const SCOPES = [
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_posts',
  'instagram_basic',
  'instagram_content_publish',
  'business_management'
];
```

#### Endpoints:

**OAuth Authentication:**
```javascript
// 1. Redirect للمصادقة
app.get('/api/auth/meta', (req, res) => {
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?
    client_id=${META_APP_ID}
    &redirect_uri=${META_REDIRECT_URI}
    &scope=${SCOPES.join(',')}
    &state=${req.user.id}`;
  res.redirect(authUrl);
});

// 2. Callback
app.get('/api/auth/meta/callback', async (req, res) => {
  const { code, state: userId } = req.query;
  
  // Exchange code for access token
  const tokenResponse = await axios.post(
    'https://graph.facebook.com/v18.0/oauth/access_token',
    {
      client_id: META_APP_ID,
      client_secret: META_APP_SECRET,
      redirect_uri: META_REDIRECT_URI,
      code
    }
  );
  
  const { access_token, expires_in } = tokenResponse.data;
  
  // Save to database
  await saveSocialAccount({
    userId,
    platform: 'meta',
    accessToken: access_token,
    expiresAt: new Date(Date.now() + expires_in * 1000)
  });
  
  res.redirect('/tools/marketing?connected=true');
});
```

**نشر منشور على Instagram:**
```javascript
app.post('/api/marketing/post/instagram', async (req, res) => {
  const { userId, caption, imageUrl, hashtags } = req.body;
  
  // Get user's Instagram account
  const account = await getSocialAccount(userId, 'instagram');
  
  // 1. Upload media to Instagram
  const mediaResponse = await axios.post(
    `https://graph.facebook.com/v18.0/${account.accountId}/media`,
    {
      image_url: imageUrl,
      caption: `${caption}\n\n${hashtags}`,
      access_token: account.accessToken
    }
  );
  
  const { id: mediaId } = mediaResponse.data;
  
  // 2. Publish media
  const publishResponse = await axios.post(
    `https://graph.facebook.com/v18.0/${account.accountId}/media_publish`,
    {
      creation_id: mediaId,
      access_token: account.accessToken
    }
  );
  
  res.json({ success: true, postId: publishResponse.data.id });
});
```

---

### 2️⃣ **WhatsApp Business API**

#### الإعداد:
```typescript
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
```

#### إرسال رسالة تلقائية:
```javascript
app.post('/api/marketing/whatsapp/send', async (req, res) => {
  const { to, message, mediaUrl } = req.body;
  
  const payload = {
    messaging_product: 'whatsapp',
    to: to,
    type: mediaUrl ? 'image' : 'text',
    ...(mediaUrl ? {
      image: {
        link: mediaUrl,
        caption: message
      }
    } : {
      text: { body: message }
    })
  };
  
  const response = await axios.post(
    `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
    payload,
    {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  res.json({ success: true, messageId: response.data.messages[0].id });
});
```

#### Webhook لاستقبال الرسائل:
```javascript
app.post('/api/webhooks/whatsapp', async (req, res) => {
  const { entry } = req.body;
  
  for (const change of entry[0].changes) {
    const { messages } = change.value;
    
    if (messages) {
      for (const message of messages) {
        const { from, text } = message;
        
        // Check for auto-response triggers
        const trigger = await getAutoResponseTrigger(text.body);
        
        if (trigger) {
          await sendWhatsAppMessage(from, trigger.response, trigger.mediaUrl);
        }
      }
    }
  }
  
  res.sendStatus(200);
});
```

---

### 3️⃣ **Twitter (X) API v2**

#### الإعداد:
```typescript
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
```

#### نشر تغريدة:
```javascript
app.post('/api/marketing/post/twitter', async (req, res) => {
  const { userId, text, mediaUrls } = req.body;
  
  const account = await getSocialAccount(userId, 'twitter');
  
  let mediaIds = [];
  
  // Upload media if any
  if (mediaUrls && mediaUrls.length > 0) {
    for (const url of mediaUrls) {
      const mediaResponse = await uploadTwitterMedia(url, account.accessToken);
      mediaIds.push(mediaResponse.media_id_string);
    }
  }
  
  // Create tweet
  const tweetResponse = await axios.post(
    'https://api.twitter.com/2/tweets',
    {
      text,
      ...(mediaIds.length > 0 && { media: { media_ids: mediaIds } })
    },
    {
      headers: {
        'Authorization': `Bearer ${account.accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  res.json({ success: true, tweetId: tweetResponse.data.data.id });
});
```

---

### 4️⃣ **AI Processing (OpenAI / Anthropic)**

#### مصمم البوستات:
```javascript
app.post('/api/ai/generate-post', async (req, res) => {
  const { propertyImage, platform, keyPoints } = req.body;
  
  // 1. تحليل الصورة باستخدام GPT-4 Vision
  const imageAnalysis = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [{
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'حلل هذه الصورة العقارية واستخرج: نوع العقار، المميزات الظاهرة، الألوان السائدة'
        },
        {
          type: 'image_url',
          image_url: { url: propertyImage }
        }
      ]
    }]
  });
  
  // 2. توليد النص الإعلاني
  const copywriting = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'أنت خبير تسويق عقاري. اكتب نص إعلاني جذاب ومقنع.'
    }, {
      role: 'user',
      content: `اكتب منشور ${platform} لعقار بالمواصفات: ${keyPoints}. التحليل: ${imageAnalysis.choices[0].message.content}`
    }]
  });
  
  // 3. توليد الهاشتاقات
  const hashtags = await generateHashtags(keyPoints, platform);
  
  res.json({
    caption: copywriting.choices[0].message.content,
    hashtags,
    analysis: imageAnalysis.choices[0].message.content
  });
});
```

#### صانع الريلز (AI Video):
```javascript
app.post('/api/ai/generate-reel', async (req, res) => {
  const { mediaFiles, style, music } = req.body;
  
  // استخدام خدمة مثل Runway / Pika / Synthesia
  const videoJob = await runwayml.createVideoFromImages({
    images: mediaFiles,
    duration: 15,
    transitions: style === 'fast' ? 'quick' : 'smooth',
    music: music,
    textOverlays: await generateReelCaptions(mediaFiles)
  });
  
  // وضع الطلب في Queue
  await addToQueue('video-processing', {
    jobId: videoJob.id,
    userId: req.user.id
  });
  
  res.json({
    jobId: videoJob.id,
    status: 'processing',
    estimatedTime: '2 minutes'
  });
});

// Worker للمعالجة
async function processVideoQueue(job) {
  const { jobId } = job.data;
  
  // انتظار اكتمال المعالجة
  const result = await pollVideoStatus(jobId);
  
  // رفع الفيديو لـ S3
  const videoUrl = await uploadToS3(result.videoUrl);
  
  // إشعار المستخدم
  await notifyUser(job.data.userId, {
    type: 'video_ready',
    videoUrl
  });
}
```

---

## 💳 نظام الدفع والعملات

### Stripe Integration:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// شراء عملات
app.post('/api/coins/purchase', async (req, res) => {
  const { userId, package } = req.body;
  
  const packages = {
    starter: { coins: 100, price: 99 },
    pro: { coins: 500, price: 399 },
    enterprise: { coins: -1, price: 1499 } // unlimited
  };
  
  const selected = packages[package];
  
  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: selected.price * 100, // AED to fils
    currency: 'aed',
    metadata: {
      userId,
      package,
      coins: selected.coins
    }
  });
  
  res.json({
    clientSecret: paymentIntent.client_secret
  });
});

// Webhook للتأكيد
app.post('/api/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  
  if (event.type === 'payment_intent.succeeded') {
    const { userId, coins } = event.data.object.metadata;
    
    // إضافة العملات
    await addCoinsToUser(userId, parseInt(coins));
  }
  
  res.sendStatus(200);
});

// خصم عملات عند الاستخدام
app.post('/api/tools/use', async (req, res) => {
  const { userId, toolId } = req.body;
  
  const toolPrices = {
    postGenerator: 10,
    reelsGenerator: 15,
    contentWizard: 20,
    whatsappBot: 25,
    autoPublishing: 15,
    campaignAnalyzer: 20
  };
  
  const price = toolPrices[toolId];
  const user = await getUser(userId);
  
  if (user.coins < price) {
    return res.status(400).json({
      error: 'insufficient_balance',
      message: 'رصيدك غير كافٍ'
    });
  }
  
  // خصم العملات
  await deductCoins(userId, price);
  
  // تسجيل الاستخدام
  await logToolUsage(userId, toolId, price);
  
  res.json({ success: true, remainingCoins: user.coins - price });
});
```

---

## 📅 جدولة المنشورات

### Cron Jobs:

```javascript
const cron = require('node-cron');

// كل دقيقة، تحقق من المنشورات المجدولة
cron.schedule('* * * * *', async () => {
  const now = new Date();
  
  // احصل على المنشورات المستحقة
  const duePost = await db.query(`
    SELECT * FROM scheduled_posts
    WHERE status = 'pending'
    AND scheduled_at <= $1
    LIMIT 10
  `, [now]);
  
  for (const post of duePosts.rows) {
    try {
      // نشر حسب المنصة
      if (post.platform === 'instagram') {
        await publishToInstagram(post);
      } else if (post.platform === 'facebook') {
        await publishToFacebook(post);
      } else if (post.platform === 'twitter') {
        await publishToTwitter(post);
      }
      
      // تحديث الحالة
      await db.query(`
        UPDATE scheduled_posts
        SET status = 'published', published_at = NOW()
        WHERE id = $1
      `, [post.id]);
      
    } catch (error) {
      // تسجيل الفشل
      await db.query(`
        UPDATE scheduled_posts
        SET status = 'failed', error_message = $1
        WHERE id = $2
      `, [error.message, post.id]);
    }
  }
});
```

---

## 🔐 الأمان

### Best Practices:

```javascript
// 1. تشفير Tokens
const crypto = require('crypto');

function encryptToken(token) {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptToken(encrypted) {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 2. Rate Limiting
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per window
  message: 'تم تجاوز عدد الطلبات المسموح'
});

app.use('/api/', apiLimiter);

// 3. Validation
const { body, validationResult } = require('express-validator');

app.post('/api/marketing/post',
  body('caption').isLength({ min: 10, max: 2200 }),
  body('imageUrl').isURL(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Process...
  }
);
```

---

## 📊 المراقبة والتحليلات

### Analytics Tracking:

```javascript
// تتبع استخدام الأدوات
app.post('/api/analytics/track', async (req, res) => {
  const { userId, event, properties } = req.body;
  
  await analytics.track({
    userId,
    event,
    properties,
    timestamp: new Date()
  });
  
  res.sendStatus(200);
});

// Dashboard الإحصائيات
app.get('/api/admin/stats', async (req, res) => {
  const stats = await db.query(`
    SELECT
      tool_id,
      COUNT(*) as usage_count,
      SUM(coins_spent) as total_revenue,
      AVG(coins_spent) as avg_cost
    FROM tool_usage
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY tool_id
    ORDER BY usage_count DESC
  `);
  
  res.json(stats.rows);
});
```

---

## ✅ Checklist للإطلاق

### المرحلة 1: الإعداد (أسبوع 1)
- [ ] إعداد Backend Server (NestJS/Express)
- [ ] إعداد PostgreSQL Database
- [ ] إعداد Redis للـ Queue
- [ ] إعداد AWS S3 / Cloudflare R2
- [ ] تسجيل تطبيقات Meta Developer
- [ ] تسجيل WhatsApp Business API
- [ ] تسجيل Twitter Developer
- [ ] إعداد OpenAI API

### المرحلة 2: APIs (أسبوع 2-3)
- [ ] OAuth Flow لجميع المنصات
- [ ] Endpoint نشر Instagram
- [ ] Endpoint نشر Facebook
- [ ] Endpoint نشر Twitter
- [ ] WhatsApp Send Message
- [ ] WhatsApp Webhook
- [ ] AI Post Generation
- [ ] AI Video Generation

### المرحلة 3: الدفع والعملات (أسبوع 3)
- [ ] Stripe Integration
- [ ] شراء العملات
- [ ] خصم العملات
- [ ] سجل الاستخدام
- [ ] الباقات والاشتراكات

### المرحلة 4: الجدولة والأتمتة (أسبوع 4)
- [ ] Cron Jobs للنشر المجدول
- [ ] Queue System
- [ ] Auto-Response System
- [ ] Campaign Analytics

### المرحلة 5: الأمان والاختبار (أسبوع 4)
- [ ] Token Encryption
- [ ] Rate Limiting
- [ ] Input Validation
- [ ] Error Handling
- [ ] Unit Tests
- [ ] Integration Tests

### المرحلة 6: الإطلاق (أسبوع 5)
- [ ] Staging Environment
- [ ] Load Testing
- [ ] Security Audit
- [ ] Beta Testing
- [ ] Production Deploy
- [ ] Monitoring Setup

---

## 🚀 الإطلاق التدريجي

```
الأسبوع 1-2: Closed Beta
├─ 50 مستخدم مختار
├─ اختبار جميع المزايا
└─ جمع Feedback

الأسبوع 3-4: Open Beta
├─ 500 مستخدم
├─ إطلاق محدود
└─ مراقبة الأداء

الأسبوع 5+: Full Launch
├─ إطلاق عام
├─ حملة تسويقية
└─ دعم كامل
```

---

**📝 ملاحظة:** هذه خطة تفصيلية لتكامل Backend. يمكن تعديلها حسب الموارد المتاحة والأولويات.
